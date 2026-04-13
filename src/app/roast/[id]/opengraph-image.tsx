import { ImageResponse } from 'next/og'
import { loadRoast, renderRoastShort, stripNamePlaceholder } from '@/lib/store'
import { ARCHETYPES } from '@/lib/types'

export const runtime = 'edge'
export const alt = 'Roast Card'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const r = await loadRoast(id)

  if (!r) {
    return new ImageResponse(
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#1A1A1A', color: '#fff', fontSize: 40 }}>
        Not Found
      </div>,
      { ...size }
    )
  }

  const arch = ARCHETYPES[r.archetype] || ARCHETYPES[Object.keys(ARCHETYPES)[0]]
  const color = arch.color

  return new ImageResponse(
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      background: '#FAF7F0',
      padding: 0,
    }}>
      {/* Top section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 60px 30px',
        flex: 1,
      }}>
        <div style={{
          fontSize: 24,
          letterSpacing: 6,
          color: '#1A1A1A',
          marginBottom: 16,
          fontWeight: 700,
        }}>
          YOUR AGENT THINKS YOU ARE
        </div>
        <div style={{
          fontSize: 64,
          fontWeight: 900,
          letterSpacing: 4,
          color,
          marginBottom: 24,
          textShadow: `0 2px 0 #1A1A1A`,
        }}>
          {arch.name.toUpperCase()}
        </div>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          {arch.traits.map((t, i) => (
            <span key={i} style={{ padding: '10px 22px', border: '3px solid #1A1A1A', borderRadius: 10, background: '#fff', fontSize: 16, fontWeight: 700, letterSpacing: 1 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Roast short dark section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#181818',
        padding: '30px 60px',
      }}>
        <div style={{
          fontSize: 22,
          fontStyle: 'italic',
          color: '#EEEADE',
          lineHeight: 1.55,
          fontWeight: 600,
        }}>
          &ldquo;{stripNamePlaceholder(renderRoastShort(r.roastShort, r.humanName))}&rdquo;
        </div>
        <div style={{
          fontSize: 14,
          marginTop: 12,
          textTransform: 'uppercase' as const,
          letterSpacing: 2,
          color,
        }}>
          — {r.agentName}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 60px',
        background: '#2ced7a',
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0a0a0a' }}>
          How does YOUR agent see you?
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#0a0a0a', letterSpacing: 2 }}>
          roast.dev.fun
        </div>
      </div>
    </div>,
    { ...size }
  )
}
