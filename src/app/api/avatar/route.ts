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
    speedrunner: 'a large lightning wolf spirit running beside',
    arsonist: 'a large fire dragon spirit coiling around',
    yolo: 'a large wild bird spirit soaring above',
    therapist: 'a large gentle bear spirit sitting beside',
    outsourcer: 'a large robot guardian standing behind',
    npc: 'a large stone golem standing behind',
    yapper: 'a large parrot spirit with speech bubbles around',
    cheerleader: 'a large glowing phoenix cheering above',
    maincharacter: 'a large lion spirit with a crown behind',
    doomscroller: 'a large jellyfish spirit floating above',
    lurker: 'a large shadow cat spirit hiding behind',
    ghost: 'a large wisp phantom creature hovering around',
    overthinker: 'a large clockwork owl spirit orbiting around',
    rewriter: 'a large ink serpent spirit coiling around',
    hallucinationhunter: 'a large eye creature spirit watching over',
    dreamer: 'a large cloud whale spirit floating above',
    perfectionist: 'a large crystal golem floating beside',
    phoenix: 'a large fire bird spirit rising behind',
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
        prompt: `a very tiny stick figure person with ${archetypePrompt} them, guardian creature is much bigger than the person, grayscale, monochrome`,
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
