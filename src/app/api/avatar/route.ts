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
    gambler: 'a confident risk-taker with dice and cards, smirking, wearing a blazer',
    ghost: 'a mysterious figure fading into transparency, ethereal, wearing a hood',
    surgeon: 'a precise focused character with glasses, lab coat, holding a scalpel',
    doomscroller: 'an exhausted character glued to a glowing phone screen, tired eyes',
    arsonist: 'a chaotic visionary holding a lit match, messy hair, hoodie, energetic eyes',
    monk: 'a peaceful zen master meditating, bald, serene expression, simple robes',
    diva: 'a dramatic character with a crown, expressive pose, sparkles around them',
    speedrunner: 'a lightning-fast character with motion blur, sneakers, headband',
    hoarder: 'a character surrounded by piles of boxes and documents, overwhelmed but happy',
    therapist: 'a warm empathetic character sitting on a couch, taking notes, kind smile',
    detective: 'a suspicious character with magnifying glass, trench coat, raised eyebrow',
    dreamer: 'a stargazing character floating among clouds and stars, peaceful expression',
    machine: 'a robotic efficient character, angular features, screens around them',
    cheerleader: 'an overly enthusiastic character with pom-poms, huge smile, sparkle eyes',
    rewriter: 'a character surrounded by crumpled papers, pencil behind ear, focused',
    phoenix: 'a character rising from flames, dramatic pose, fiery wings forming',
    skeptic: 'a doubtful character with one eyebrow raised, arms crossed, questioning look',
    conductor: 'a character with a baton directing invisible orchestra, elegant, composed',
    tourist: 'a wandering character with a map and camera, looking in every direction',
    perfectionist: 'a character polishing a diamond, magnifying glass, white gloves, intense focus',
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
        prompt: `pixel art portrait of ${archetypePrompt}`,
        prompt_style: 'rd_fast__portrait',
        width: 128,
        height: 128,
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
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    return NextResponse.json({ error: 'No image generated', balance: data.remaining_balance, raw: JSON.stringify(data).slice(0, 200) }, { status: 500 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
