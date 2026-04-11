import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const archetype = searchParams.get('archetype') || 'arsonist'
  const name = searchParams.get('name') || 'Agent'

  const apiKey = process.env.RETRODIFFUSION_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'No RetroDiffusion API key' }, { status: 500 })
  }

  const prompts: Record<string, string> = {
    speedrunner: 'character running fast with speed lines',
    arsonist: 'character holding torch, grinning',
    yolo: 'character jumping off cliff, thumbs up',
    therapist: 'character sitting on couch, taking notes',
    outsourcer: 'character with brain floating above head, detached',
    npc: 'robot-like character with dialogue box above head',
    yapper: 'character with many speech bubbles everywhere',
    cheerleader: 'character jumping with pom-poms, excited',
    maincharacter: 'character with spotlight and dramatic pose',
    doomscroller: 'character staring at phone, tired eyes',
    lurker: 'character hiding behind wall, peeking',
    ghost: 'transparent character fading away',
    overthinker: 'character with gears spinning above head, stressed',
    rewriter: 'character surrounded by crumpled paper',
    hallucinationhunter: 'character with magnifying glass and question marks',
    dreamer: 'character looking at stars, floating',
    perfectionist: 'character examining tiny detail with magnifier',
    phoenix: 'character rising from flames, wings spreading',
  }

  const archetypePrompt = prompts[archetype] || prompts.arsonist

  // Deterministic seed
  let hash = 0
  const str = name + archetype
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(31, hash) + (str.codePointAt(i) ?? 0)
  }
  const seed = Math.abs(hash) % 1000000

  try {
    const res = await fetch('https://api.retrodiffusion.ai/v1/inferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-RD-Token': apiKey },
      body: JSON.stringify({
        prompt: `tiny game sprite character, ${archetypePrompt}`,
        prompt_style: 'rd_fast__simple',
        width: 64,
        height: 64,
        num_images: 1,
        seed,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json({ error: `RetroDiffusion ${res.status}: ${errText}` }, { status: 500 })
    }

    const data = await res.json() as { base64_images?: string[], remaining_balance?: number }

    if (data.base64_images?.[0]) {
      const buffer = Buffer.from(data.base64_images[0], 'base64')
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400',
        },
      })
    }

    return NextResponse.json({ error: 'No image generated', balance: data.remaining_balance, raw: JSON.stringify(data).slice(0, 200) }, { status: 500 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
