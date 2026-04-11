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
    gambler: 'grinning face holding flaming dice, wink, sweat drop',
    ghost: 'fading transparent figure, hollow pixel eyes, glitch effect',
    surgeon: 'intense eyes behind glasses, scalpel raised, one eyebrow up',
    doomscroller: 'dead eyes glued to glowing phone, soul leaving body',
    arsonist: 'manic grin holding lit match, hair on fire, loving it',
    monk: 'perfectly serene face, everything behind them exploding',
    diva: 'crown tilted, dramatic pointing gesture, single tear of rage',
    speedrunner: 'motion blur trail, shoes smoking, eyes popping from speed',
    hoarder: 'buried in boxes, one hand waving for help, still smiling',
    therapist: 'warm smile but dead eyes, soul visibly escaping upward',
    detective: 'extreme side-eye, magnifying glass, conspiracy board behind',
    dreamer: 'floating with stars in eyes, completely checked out, blissful',
    machine: 'robot face, steam from ears, circuit eyes, zero emotion',
    cheerleader: 'screaming with joy, star eyes, confetti explosion around head',
    rewriter: 'drowning in crumpled papers, ink on face, manic focus',
    phoenix: 'rising from flames with dramatic pose, fire wings spreading',
    skeptic: 'one eyebrow raised to orbit, arms crossed, maximum doubt face',
    conductor: 'wild hair, baton crackling, orchestrating visible chaos',
    tourist: 'spinning with maps flying everywhere, camera tangled, lost but happy',
    perfectionist: 'anguished face staring at one wrong pixel through magnifier',
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
        prompt: `pixel art character, clean bold lines, funny exaggerated expression, ${archetypePrompt}`,
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
