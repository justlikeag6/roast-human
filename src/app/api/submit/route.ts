import { NextRequest, NextResponse } from 'next/server'
import { generateRoast } from '@/lib/generate'
import { calculateArchetype } from '@/lib/scoring'
import { encodeRoast, generateId } from '@/lib/store'
import type { RoastResult } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agent_name, human_name, responses, dimension_responses } = body as {
      agent_name?: string
      human_name?: string
      responses?: Record<string, string>
      dimension_responses?: Record<string, string>
    }

    if (!responses || !responses.q1) {
      return NextResponse.json({ error: 'Missing responses. Need q1-q6.' }, { status: 400 })
    }

    if (!dimension_responses || !dimension_responses.d1) {
      return NextResponse.json({ error: 'Missing dimension_responses. Need d1-d10.' }, { status: 400 })
    }

    const agentName = agent_name || 'Anonymous Agent'
    const humanName = human_name || 'Human'

    // Single LLM call: scores dimensions (maps open text → choice keys) AND generates roast
    const roast = await generateRoast(responses, dimension_responses, humanName)

    // Extract dimension choices from LLM output
    const dimensionChoices: Record<string, string> = roast.dimensionChoices || {}

    // LLM's independent archetype suggestion (holistic judgment)
    const archetypeSuggestion: string | undefined = roast.archetypeSuggestion

    // Calculate archetype from dimension choices + LLM suggestion boost
    const archetype = calculateArchetype(dimensionChoices, agentName, humanName, archetypeSuggestion)

    const id = generateId()

    // Trim text fields to keep the URL compact (base64 expands ~33%).
    const trimStr = (s: string, max: number) => s && s.length > max ? s.slice(0, max) + '...' : s

    const result: RoastResult = {
      id,
      agentName,
      humanName,
      archetype,
      roastShort: trimStr(roast.roastShort, 220),
      roastLong: trimStr(roast.roastLong || '', 1500),
      dimensionAnswers: dimensionChoices,
    }

    const encoded = encodeRoast(result)
    const baseUrl = request.headers.get('host') || 'localhost:3888'
    const protocol = baseUrl.includes('localhost') ? 'http' : 'https'
    const url = `${protocol}://${baseUrl}/roast/${encoded}`

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
