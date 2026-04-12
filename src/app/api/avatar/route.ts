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
    degen: 'holding dice, wild grin',
    notresponding: 'fading away, waving goodbye',
    npc: 'standing still, question mark above head',
    delaylama: 'meditating peacefully, clock melting',
    kanyewaste: 'wearing crown, dramatic pose',
    aidhd: 'surrounded by lightning bolts, spinning',
    tabber: 'buried in pile of boxes and papers',
    scamaltman: 'smiling with hidden hands behind back',
    sherlock: 'holding magnifying glass, suspicious squint',
    elonbust: 'pointing at stars, standing on nothing',
    zuckerbot: 'robot face, no expression, gears visible',
    copium: 'on fire but smiling, thumbs up',
    caveman: 'poking a computer with a stick',
    nokia: 'cracked but standing, glowing eyes',
  }
  const archetypePrompt = prompts[archetype] || prompts.degen

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
        prompt: `tiny game sprite character, ${archetypePrompt}, grayscale, monochrome`,
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
