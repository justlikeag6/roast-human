import { ImageResponse } from 'next/og'
import { loadRoast, renderRoastShort, stripNamePlaceholder, pickTrait } from '@/lib/store'
import { ARCHETYPES } from '@/lib/types'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) return new Response('Missing id', { status: 400 })
  const r = await loadRoast(id)
  if (!r) return new Response('Not found', { status: 404 })

  const arch = ARCHETYPES[r.archetype] || ARCHETYPES[Object.keys(ARCHETYPES)[0]]
  const color = arch.color

  return new ImageResponse(
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      background: '#fff',
      border: '4px solid #1A1A1A', borderRadius: 22,
    }}>
      {/* Title section */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '28px 24px 16px',
      }}>
        <div style={{ fontSize: 12, letterSpacing: 4, color: '#1A1A1A', marginBottom: 12 }}>
          YOUR AGENT THINKS YOU ARE
        </div>
        <div style={{ fontSize: 36, fontWeight: 900, color, letterSpacing: 3, lineHeight: 1.1, marginBottom: 14 }}>
          {arch.name.toUpperCase()}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span style={{ padding: '7px 16px', border: '2.5px solid #1A1A1A', borderRadius: 12, background: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>{pickTrait(arch.traits, r.id)}</span>
        </div>
      </div>

      {/* Avatar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flex: 1, borderTop: '3px solid #1A1A1A', borderBottom: '3px solid #1A1A1A',
        background: '#fff', padding: 16,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${request.nextUrl.origin}/archetypes/${r.archetype}.png`} alt={arch.name} width={220} height={220} style={{ objectFit: 'contain' }} />
      </div>

      {/* Roast short */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        padding: '18px 24px', background: '#181818',
      }}>
        <div style={{ display: 'flex', fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>
          <span style={{ color: '#EEEADE' }}>AGENT </span>
          <span style={{ color }}>{r.agentName.toUpperCase()}</span>
          <span style={{ color: '#EEEADE' }}> COOKED YOU</span>
        </div>
        <div style={{ fontSize: 14, fontStyle: 'italic', color: '#EEEADE', lineHeight: 1.5, fontWeight: 600 }}>{`\u201C${stripNamePlaceholder(renderRoastShort(r.roastShort, r.humanName))}\u201D`}</div>
      </div>

      {/* Green footer */}
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        padding: '10px', background: '#2ced7a', borderTop: '3px solid #1A1A1A',
      }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#0a0a0a', letterSpacing: 2 }}>roast.dev.fun</div>
      </div>
    </div>,
    { width: 540, height: 720 }
  )
}
