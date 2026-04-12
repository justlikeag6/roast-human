import { ImageResponse } from 'next/og'
import { decodeRoast } from '@/lib/store'
import { ARCHETYPES } from '@/lib/types'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) return new Response('Missing id', { status: 400 })
  const r = decodeRoast(id)
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
      border: '4px solid #1A1A1A',
    }}>
      {/* Title section */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '32px 28px 20px',
      }}>
        <div style={{ fontSize: 12, letterSpacing: 4, color: '#1A1A1A', marginBottom: 12 }}>
          YOUR AGENT THINKS YOU ARE
        </div>
        <div style={{ fontSize: 36, fontWeight: 900, color, letterSpacing: 3, lineHeight: 1.1 }}>
          {arch.name.toUpperCase()}
        </div>
      </div>

      {/* Avatar placeholder */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flex: 1, fontSize: 140, borderTop: '3px solid #1A1A1A', borderBottom: '3px solid #1A1A1A',
        background: '#f5f5f0',
      }}>
        {arch.emoji}
      </div>

      {/* Killer line */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        padding: '20px 28px', background: '#181818',
      }}>
        <div style={{ fontSize: 12, letterSpacing: 2, marginBottom: 10 }}>
          <span style={{ color: '#EEEADE' }}>AGENT </span>
          <span style={{ color }}>{r.agentName.toUpperCase()}</span>
          <span style={{ color: '#EEEADE' }}> COOKED YOU</span>
        </div>
        <div style={{ fontSize: 16, fontStyle: 'italic', color: '#EEEADE', lineHeight: 1.6, fontWeight: 600 }}>
          &ldquo;{r.killerLine.length > 120 ? r.killerLine.slice(0, 117) + '...' : r.killerLine}&rdquo;
        </div>
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
