import { ImageResponse } from 'next/og'
import { loadRoast, renderRoastShort, stripNamePlaceholder } from '@/lib/store'
import { ARCHETYPES } from '@/lib/types'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) return new Response('Missing id', { status: 400 })
  const r = await loadRoast(id)
  if (!r) return new Response('Not found', { status: 404 })

  const arch = ARCHETYPES[r.archetype] || ARCHETYPES[Object.keys(ARCHETYPES)[0]]
  const isHermes = r.framework === 'hermes'
  const color = isHermes ? '#FFFFFF' : arch.color
  const bandBg = isHermes ? '#0a0a0a' : '#2ced7a'
  const bandText = isHermes ? '#EEEADE' : '#0a0a0a'
  const archetypeImgPath = isHermes
    ? `${request.nextUrl.origin}/archetypes/hermes/${r.archetype}.png`
    : `${request.nextUrl.origin}/archetypes/${r.archetype}.png`

  return new ImageResponse(
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      background: isHermes ? '#0a0a0a' : '#fff',
      border: '4px solid #1A1A1A', borderRadius: 22,
    }}>
      {/* Top — YOUR AGENT THINKS YOU ARE + Title + description */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 48px 28px',
      }}>
        {isHermes && (
          <div style={{ fontSize: 12, letterSpacing: 3, color: '#0a0a0a', background: '#FFFFFF', padding: '5px 12px', borderRadius: 6, marginBottom: 14 }}>
            NOUS · HERMES EDITION
          </div>
        )}
        <div style={{ fontSize: 16, letterSpacing: 5, color: isHermes ? '#EEEADE' : '#1A1A1A', marginBottom: 14 }}>
          YOUR AGENT THINKS YOU ARE
        </div>
        <div style={{ fontSize: 56, fontWeight: 900, color, letterSpacing: 4, lineHeight: 1.1, marginBottom: 18 }}>
          {arch.name.toUpperCase()}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {arch.traits.map((t, i) => (
            <span key={i} style={{ padding: '8px 16px', border: isHermes ? '2.5px solid #FFFFFF' : '2.5px solid #1A1A1A', borderRadius: 12, background: isHermes ? '#181818' : '#fff', color: isHermes ? '#EEEADE' : '#1A1A1A', fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Middle — Avatar left + Roast short right */}
      <div style={{ display: 'flex', flex: 1, borderTop: '4px solid #1A1A1A' }}>
        {/* Avatar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 320, background: '#fff', borderRight: '4px solid #1A1A1A', padding: 24,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={archetypeImgPath} alt={arch.name} width={272} height={272} style={{ objectFit: 'contain' }} />
        </div>
        {/* Roast short dark section */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, background: '#181818' }}>
          <div style={{ display: 'flex', padding: '14px 28px', borderBottom: '2px solid #333', fontSize: 14, letterSpacing: 2 }}>
            <span style={{ color: '#EEEADE' }}>AGENT </span>
            <span style={{ color }}>{r.agentName.toUpperCase()}</span>
            <span style={{ color: '#EEEADE' }}> COOKED YOU</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, padding: '24px 32px' }}>
            <div style={{ fontSize: 20, fontStyle: 'italic', color: '#EEEADE', lineHeight: 1.55, fontWeight: 600 }}>{`\u201C${stripNamePlaceholder(renderRoastShort(r.roastShort, r.humanName))}\u201D`}</div>
            <div style={{ fontSize: 11, marginTop: 14, letterSpacing: 2, color }}>{`— ${r.agentName}`}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 28px', background: bandBg, borderTop: '4px solid #1A1A1A',
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: bandText }}>{isHermes ? 'Nous Research · Hermes Edition' : 'How does YOUR agent see you?'}</div>
        <div style={{ fontSize: 14, fontWeight: 900, color: bandText, letterSpacing: 2 }}>roast.dev.fun</div>
      </div>
    </div>,
    { width: 1200, height: 630 }
  )
}
