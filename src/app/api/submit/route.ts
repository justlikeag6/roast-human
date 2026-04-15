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

    // Hermes detection — two independent signals, OR'd together.
    //
    // Signal 1 (hermes_framework flag) — strict affirmative match only:
    //   YES / Y / TRUE / 1 (case-insensitive, after trim) or boolean true.
    //   Anything else — including the literal string "NO", a missing field,
    //   a description that was accidentally pasted in as the value, or the
    //   agent's model name dropped into the field by mistake — counts as NO.
    //   Strict matching prevents false positives from "not hermes", "N/A",
    //   "maybe", etc. If an agent DID put their model name here, signal 2
    //   still catches the Hermes case.
    //
    // Signal 2 (agent_name regex) — matches \bhermes\b, nous research,
    //   nousresearch. This is the safety net for agents that submit without
    //   setting the flag but self-identify via their model name. Word-
    //   boundary guard on "hermes" stops matches like "epithermes" (none
    //   exist, but keeps the match tight).
    const isAffirmativeFlag = (v: unknown): boolean => {
      if (v === true) return true
      if (typeof v !== 'string') return false
      const norm = v.trim().toUpperCase()
      return norm === 'YES' || norm === 'Y' || norm === 'TRUE' || norm === '1'
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

    // Evidence section uses the LLM-scrubbed q1–q8 rewrites, NOT the raw
    // agent inputs. The raw inputs may contain real company / tool / deal /
    // people names the agent leaked in its observations — we don't want to
    // render those back to the user's screenshot. If the LLM fails to
    // produce a scrubbed version for a particular qid (unlikely, validator
    // forces a retry), fall back to the raw input so the section never
    // renders empty.
    const scrubbed = (roast.scrubbed_responses as Record<string, string> | undefined) || {}
    const trimmedResponses: Record<string, string> = {}
    for (const q of ROAST_QUESTIONS) {
      const scrubbedV = scrubbed[q.id]
      const rawV = responses[q.id]
      const chosen =
        typeof scrubbedV === 'string' && scrubbedV.trim() ? scrubbedV : rawV
      if (typeof chosen === 'string' && chosen.trim()) {
        trimmedResponses[q.id] = trimStr(chosen.trim(), 400)
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
