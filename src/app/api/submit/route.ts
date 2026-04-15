import { NextRequest, NextResponse } from 'next/server'
import { generateRoast } from '@/lib/generate'
import { generateId, saveRoast, encodeRoast } from '@/lib/store'
import type { RoastResult } from '@/lib/types'
import { ROAST_QUESTIONS, ARCHETYPES } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agent_name, human_name, responses, hermes_framework } = body as {
      agent_name?: string
      human_name?: string
      responses?: Record<string, string>
      hermes_framework?: string | boolean
    }

    if (!responses || !responses.q1) {
      return NextResponse.json(
        { error: 'Missing responses. Need q1-q8.' },
        { status: 400 },
      )
    }

    const agentName = agent_name || 'Anonymous Agent'
    const humanName = human_name || 'Human'

    // Hermes detection — we accept a wide range of affirmative values on the
    // dedicated `hermes_framework` flag because different agents write YES/NO
    // in different shapes (uppercase, lowercase, boolean, "Y", pasted model
    // name, etc.). The permissive match is:
    //
    //   - string that normalizes to YES / Y / TRUE / 1
    //   - boolean true
    //   - string that itself contains "hermes" or "nous" (if an agent put its
    //     model name there by mistake, e.g. "Hermes 4", treat it as YES)
    //
    // Fallback: scan agent_name for "hermes" / "nous research" — catches
    // agents that forgot the field but self-identify via their model name.
    const isAffirmativeFlag = (v: unknown): boolean => {
      if (v === true) return true
      if (typeof v !== 'string') return false
      const norm = v.trim().toUpperCase()
      if (norm === 'YES' || norm === 'Y' || norm === 'TRUE' || norm === '1') return true
      if (/hermes|nous\s*research|nousresearch/i.test(v)) return true
      return false
    }
    const hermesFromFlag = isAffirmativeFlag(hermes_framework)
    const hermesFromName = /\bhermes\b|nous\s*research|nousresearch/i.test(agentName)
    const isHermes = hermesFromFlag || hermesFromName
    // Surface the detection result in server logs so we can see in Vercel
    // whether real submissions are tripping the Hermes branch or silently
    // falling through to the default edition.
    console.log(
      `[submit] agent_name="${agentName}" hermes_framework=${JSON.stringify(hermes_framework)} fromFlag=${hermesFromFlag} fromName=${hermesFromName} isHermes=${isHermes}`,
    )

    const roast = await generateRoast(responses, humanName)

    const archetypeKey = (roast.archetype as string) || 'degen'
    const archetype = ARCHETYPES[archetypeKey] ? archetypeKey : 'degen'

    const id = generateId()

    const trimStr = (s: string, max: number) =>
      s && s.length > max ? s.slice(0, max) + '...' : s

    const trimmedResponses: Record<string, string> = {}
    for (const q of ROAST_QUESTIONS) {
      const v = responses[q.id]
      if (typeof v === 'string' && v.trim()) {
        trimmedResponses[q.id] = trimStr(v.trim(), 400)
      }
    }

    const result: RoastResult = {
      id,
      agentName,
      humanName,
      archetype,
      roastShort: trimStr(roast.roastShort as string, 220),
      roastLong: trimStr((roast.roastLong as string) || '', 1500),
      responses: trimmedResponses,
      agentManual: trimStr((roast.agentManual as string) || '', 1800),
      ...(isHermes ? { framework: 'hermes' as const } : {}),
    }

    let roastSlug = id
    try {
      await saveRoast(result)
    } catch (e) {
      console.warn(
        'Redis save failed, falling back to base64 URL:',
        e instanceof Error ? e.message : e,
      )
      roastSlug = encodeRoast(result)
    }

    const host = request.headers.get('host') || 'localhost:3888'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const url = `${protocol}://${host}/roast/${roastSlug}`

    return NextResponse.json({
      id,
      url,
      archetype,
      roastShort: roast.roastShort,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Submit error:', msg, error)
    return NextResponse.json(
      { error: `Failed to generate roast: ${msg}` },
      { status: 500 },
    )
  }
}
