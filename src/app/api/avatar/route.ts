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
    speedrunner: 'with lightning bolt',
    arsonist: 'holding fire torch',
    yolo: 'with parachute',
    therapist: 'on a couch',
    outsourcer: 'with a small robot',
    npc: 'with question mark above head',
    yapper: 'with megaphone',
    cheerleader: 'with pom poms',
    maincharacter: 'wearing crown and cape',
    doomscroller: 'holding glowing phone',
    lurker: 'wearing dark hood',
    ghost: 'as a ghost floating',
    overthinker: 'with swirling gears above head',
    rewriter: 'holding red pen',
    hallucinationhunter: 'with big magnifying glass',
    dreamer: 'with star above head',
    perfectionist: 'with ruler and checklist',
    phoenix: 'with fire wings',
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
