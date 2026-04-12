import { NextRequest, NextResponse } from 'next/server'

const ARCHETYPE_COLORS: Record<string, { bg: string; fg: string; accent: string }> = {
  gambler:       { bg: '#FCD34D', fg: '#92400E', accent: '#DC2626' },
  ghost:         { bg: '#D6D3D1', fg: '#44403C', accent: '#78716C' },
  surgeon:       { bg: '#67E8F9', fg: '#164E63', accent: '#0E7490' },
  doomscroller:  { bg: '#A5B4FC', fg: '#312E81', accent: '#4338CA' },
  arsonist:      { bg: '#F87171', fg: '#7F1D1D', accent: '#FCD34D' },
  monk:          { bg: '#6EE7B7', fg: '#064E3B', accent: '#047857' },
  diva:          { bg: '#C084FC', fg: '#581C87', accent: '#FCD34D' },
  speedrunner:   { bg: '#FCD34D', fg: '#78350F', accent: '#DC2626' },
  hoarder:       { bg: '#FDA4AF', fg: '#881337', accent: '#9F1239' },
  therapist:     { bg: '#A5B4FC', fg: '#312E81', accent: '#6366F1' },
  detective:     { bg: '#67E8F9', fg: '#164E63', accent: '#155E75' },
  dreamer:       { bg: '#C084FC', fg: '#581C87', accent: '#7C3AED' },
  machine:       { bg: '#D6D3D1', fg: '#292524', accent: '#57534E' },
  cheerleader:   { bg: '#FCD34D', fg: '#78350F', accent: '#F59E0B' },
  rewriter:      { bg: '#FDA4AF', fg: '#881337', accent: '#E11D48' },
  phoenix:       { bg: '#F87171', fg: '#7F1D1D', accent: '#F59E0B' },
  skeptic:       { bg: '#67E8F9', fg: '#164E63', accent: '#06B6D4' },
  conductor:     { bg: '#6EE7B7', fg: '#064E3B', accent: '#059669' },
  tourist:       { bg: '#FCD34D', fg: '#78350F', accent: '#D97706' },
  perfectionist: { bg: '#A5B4FC', fg: '#312E81', accent: '#818CF8' },
}

// Deterministic seeded random
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b)
    s = Math.imul(s ^ (s >>> 13), 0x45d9f3b)
    s = (s ^ (s >>> 16)) >>> 0
    return s / 4294967296
  }
}

function hexToRgb(hex: string): [number, number, number] {
  const n = hex.replace('#', '')
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)]
}

// Generate a 16x16 symmetric pixel face, scaled to 128x128 PNG
function generatePixelAvatar(archetype: string, name: string): Buffer {
  const colors = ARCHETYPE_COLORS[archetype] || ARCHETYPE_COLORS.arsonist
  let hash = 0
  const str = name + archetype
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(31, hash) + (str.codePointAt(i) ?? 0)
  }
  const rand = seededRandom(Math.abs(hash))

  const SIZE = 16
  const SCALE = 8
  const W = SIZE * SCALE
  const bg = hexToRgb(colors.bg)
  const fg = hexToRgb(colors.fg)
  const accent = hexToRgb(colors.accent)

  // Build a 16x16 grid — left half random, right half mirrored
  const grid: number[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(0))

  // Face outline (rows 2-13, cols 3-12)
  for (let y = 2; y < 14; y++) {
    for (let x = 3; x <= 7; x++) {
      // Body shape with some randomness
      const inFace = y >= 3 && y <= 11
      const inBody = y >= 12 && y <= 13 && x >= 4 && x <= 7
      if (inFace || inBody) {
        grid[y][x] = rand() > 0.3 ? 1 : (rand() > 0.5 ? 2 : 0)
      }
      // Border
      if ((y === 2 || y === 13) || (x === 3 && inFace) || (y === 11 && x >= 3)) {
        grid[y][x] = 1
      }
    }
  }

  // Eyes (row 5-6, symmetric)
  grid[5][5] = 2; grid[5][6] = 2
  grid[6][5] = 1; grid[6][6] = 1

  // Mouth (row 9)
  grid[9][5] = 2; grid[9][6] = 2; grid[9][7] = 2

  // Hair/top (rows 1-2)
  for (let x = 4; x <= 7; x++) {
    grid[1][x] = rand() > 0.4 ? 1 : 0
    grid[2][x] = 1
  }

  // Mirror left half to right
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE / 2; x++) {
      grid[y][SIZE - 1 - x] = grid[y][x]
    }
  }

  // Add random accent pixels
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (grid[y][x] === 0 && rand() > 0.95) grid[y][x] = 2
    }
  }

  // Render to raw RGBA then encode as PNG
  const pixels = Buffer.alloc(W * W * 4)
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const c = grid[y][x] === 1 ? fg : grid[y][x] === 2 ? accent : bg
      for (let sy = 0; sy < SCALE; sy++) {
        for (let sx = 0; sx < SCALE; sx++) {
          const idx = ((y * SCALE + sy) * W + (x * SCALE + sx)) * 4
          pixels[idx] = c[0]
          pixels[idx + 1] = c[1]
          pixels[idx + 2] = c[2]
          pixels[idx + 3] = 255
        }
      }
    }
  }

  // Minimal PNG encoder (uncompressed)
  return encodePNG(W, W, pixels)
}

function encodePNG(w: number, h: number, rgba: Buffer): Buffer {
  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  function crc32(buf: Buffer): number {
    let c = 0xffffffff
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i]
      for (let j = 0; j < 8; j++) c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0)
    }
    return (c ^ 0xffffffff) >>> 0
  }

  function chunk(type: string, data: Buffer): Buffer {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const t = Buffer.from(type)
    const crcData = Buffer.concat([t, data])
    const crcBuf = Buffer.alloc(4)
    crcBuf.writeUInt32BE(crc32(crcData))
    return Buffer.concat([len, t, data, crcBuf])
  }

  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 2  // color type RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0

  // IDAT — raw RGB rows with filter byte 0
  const rawRows: Buffer[] = []
  for (let y = 0; y < h; y++) {
    rawRows.push(Buffer.from([0])) // filter none
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      rawRows.push(Buffer.from([rgba[i], rgba[i + 1], rgba[i + 2]]))
    }
  }
  const rawData = Buffer.concat(rawRows)

  // zlib: store blocks (no compression)
  const blocks: Buffer[] = [Buffer.from([0x78, 0x01])] // zlib header
  const BLOCK = 65535
  for (let i = 0; i < rawData.length; i += BLOCK) {
    const end = Math.min(i + BLOCK, rawData.length)
    const isLast = end === rawData.length
    const blockData = rawData.subarray(i, end)
    const header = Buffer.alloc(5)
    header[0] = isLast ? 1 : 0
    header.writeUInt16LE(blockData.length, 1)
    header.writeUInt16LE(blockData.length ^ 0xffff, 3)
    blocks.push(header, blockData)
  }

  // Adler32
  let a = 1, b = 0
  for (let i = 0; i < rawData.length; i++) {
    a = (a + rawData[i]) % 65521
    b = (b + a) % 65521
  }
  const adler = Buffer.alloc(4)
  adler.writeUInt32BE((b << 16) | a)
  blocks.push(adler)

  const idat = Buffer.concat(blocks)

  // IEND
  const iend = Buffer.alloc(0)

  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', iend)])
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const archetype = searchParams.get('archetype') || 'arsonist'
  const name = searchParams.get('name') || 'Agent'

  const apiKey = process.env.RETRODIFFUSION_API_KEY

  // Try RetroDiffusion API first if key exists
  if (apiKey) {
    const prompts: Record<string, string> = {
      gambler: 'a confident gambler with wild cocky smirk, fist pumping, dice and playing cards flying around him, wearing sharp navy blazer with red tie, dramatic cinematic lighting, dark moody background',
      ghost: 'a mysterious figure with hollow haunted stare, pale ghostly skin, hood up, fading into shadows, ethereal glow, dark foggy background, eerie unsettling presence',
      surgeon: 'an intense surgeon with piercing focused stare behind glasses, surgical mask pulled down, scalpel raised, sharp determined jaw, green scrubs, operating room lights',
      doomscroller: 'an exhausted person bathed in blue phone light, massive dark eye circles, glazed dead eyes, slack jaw, messy greasy hair, dark room, screens reflecting in eyes',
      arsonist: 'a wild-eyed pyromaniac cackling with flames reflecting in dilated pupils, messy windswept hair, hoodie, holding a lit match, fire swirling around, dark background with embers',
      monk: 'a serene monk in deep meditation, eyes closed, slight knowing smile, bald head, simple orange robes, golden light aura, floating lotus petals, peaceful temple background',
      diva: 'a dramatic diva mid-theatrical gasp, hand on chest, crown tilted, mascara slightly running, glamorous outfit with sparkles, spotlight from above, stage curtains background',
      speedrunner: 'an intense speedrunner leaning forward, eyes laser focused, teeth gritted, gaming headband, motion blur streaks, energy drink cans, multiple monitors glowing behind',
      hoarder: 'a panicked person surrounded by towering piles of stuff, wild darting eyes, nervous grin, clutching items to chest, boxes and papers avalanching, chaotic messy room',
      therapist: 'a warm therapist with empathetic but exhausted expression, tilted head, round glasses, notepad in hand, comfortable cardigan, cozy office with warm lamp lighting',
      detective: 'a paranoid detective squinting suspiciously, magnifying glass up, trench coat collar popped, conspiracy strings and photos on cork board behind, noir lighting',
      dreamer: 'a wide-eyed dreamer gazing upward in wonder, stars and galaxies reflecting in huge sparkling eyes, floating among clouds, cosmic light, ethereal peaceful expression',
      machine: 'a robotic figure with perfect symmetrical face, unblinking glowing eyes, half face showing circuitry, holographic screens around head, cold blue lighting, angular features',
      cheerleader: 'an insanely enthusiastic cheerleader with biggest possible grin, eyes squeezed with joy, both fists pumping, pom-poms, confetti explosion, stadium lights, pure hype energy',
      rewriter: 'a frustrated writer pulling hair out, surrounded by tornado of crumpled papers, red pen in mouth, wild eyes, pencils behind both ears, chaotic desk, lamp light',
      phoenix: 'a powerful figure rising from dramatic flames, wings of fire erupting from back, fierce determined eyes glowing, half-transformed, embers swirling, epic cinematic lighting',
      skeptic: 'a deeply doubtful person with one eyebrow raised impossibly high, arms crossed tight, pursed lips, side-eye glare, dark background, spotlight from side, maximum contempt',
      conductor: 'an passionate orchestra conductor mid-swing, baton slashing air, wild flowing hair, eyes blazing with intensity, tuxedo, sheet music flying, concert hall background',
      tourist: 'a completely lost tourist spinning with map held upside down, camera flash going off, eyes spiraling, luggage scattered everywhere, foreign street signs, total confusion',
      perfectionist: 'an obsessed perfectionist examining something tiny through magnifying glass, one eye huge, other squinting, white gloves, tweezers, spotless white lab, intense focus',
    }

    const archetypePrompt = prompts[archetype] || prompts.arsonist

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
          prompt: archetypePrompt,
          prompt_style: 'rd_fast__portrait',
          width: 256, height: 256, num_images: 1, seed,
        }),
      })

      if (res.ok) {
        const data = await res.json() as { base64_images?: string[] }
        if (data.base64_images?.[0]) {
          const buffer = Buffer.from(data.base64_images[0], 'base64')
          return new NextResponse(buffer, {
            headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
          })
        }
      }
    } catch { /* fall through to generated avatar */ }
  }

  // Fallback: generate pixel avatar locally
  const png = generatePixelAvatar(archetype, name)
  return new NextResponse(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  })
}
