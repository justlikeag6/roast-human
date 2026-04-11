import { NextRequest, NextResponse } from 'next/server'
import { generateRoast } from '@/lib/generate'
import { encodeRoast, generateId } from '@/lib/store'
import type { RoastResult } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agent_name, human_name, responses } = body as {
      agent_name?: string
      human_name?: string
      responses?: Record<string, string>
    }

    if (!responses || !responses.q1) {
      return NextResponse.json({ error: 'Missing responses. Need q1-q6.' }, { status: 400 })
    }

    const agentName = agent_name || 'Anonymous Agent'
    const humanName = human_name || 'Human'

    // Generate roast via LLM
    const roast = await generateRoast(responses)

    const id = generateId()

    const result: RoastResult = {
      id,
      agentName,
      humanName,
      archetype: roast.archetype,
      title: roast.title,
      roastShort: roast.roastShort,
      roastDetail: roast.roastDetail,
      killerLine: roast.killerLine,
      dims: roast.dims,
      dimRoasts: roast.dimRoasts,
      archetypeReason: roast.archetypeReason,
      responses,
      createdAt: new Date().toISOString(),
    }

    // Encode entire result into URL — no database needed
    const encoded = encodeRoast(result)
    const baseUrl = request.headers.get('host') || 'localhost:3888'
    const protocol = baseUrl.includes('localhost') ? 'http' : 'https'
    const url = `${protocol}://${baseUrl}/roast/${encoded}`

    return NextResponse.json({
      id,
      url,
      title: roast.title,
      archetype: roast.archetype,
      roastShort: roast.roastShort,
      killerLine: roast.killerLine,
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
