import { NextRequest, NextResponse } from 'next/server'
import { generateRoast } from '@/lib/generate'
import { calculateArchetype } from '@/lib/scoring'
import { generateId, saveRoast } from '@/lib/store'
import type { RoastResult } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agent_name, human_name, responses, dimension_answers } = body as {
      agent_name?: string
      human_name?: string
      responses?: Record<string, string>
      dimension_answers?: Record<string, string>
    }

    if (!responses || !responses.q1) {
      return NextResponse.json({ error: 'Missing responses. Need q1-q6.' }, { status: 400 })
    }

    if (!dimension_answers || !dimension_answers.d1) {
      return NextResponse.json({ error: 'Missing dimension_answers. Need d1-d10.' }, { status: 400 })
    }

    const agentName = agent_name || 'Anonymous Agent'
    const humanName = human_name || 'Human'

    // Calculate archetype from dimension answers (code, not LLM)
    const archetype = calculateArchetype(dimension_answers, agentName, humanName)

    // Generate roast content via LLM (archetype is already determined)
    const roast = await generateRoast(responses, humanName, archetype)

    const id = generateId()

    const trimStr = (s: string, max: number) => s && s.length > max ? s.slice(0, max) + '...' : s

    const result: RoastResult = {
      id,
      agentName,
      humanName,
      archetype,
      roastShort: trimStr(roast.roastShort, 220),
      roastLong: trimStr(roast.roastLong || '', 1500),
      dimensionAnswers: dimension_answers,
      agentManual: trimStr(roast.agentManual || '', 1200),
    }

    await saveRoast(result)

    const host = request.headers.get('host') || 'localhost:3888'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const url = `${protocol}://${host}/roast/${id}`

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
