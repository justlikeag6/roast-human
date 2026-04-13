import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const COLORS: Record<string, string> = {
  degen: '#FCD34D', notresponding: '#D6D3D1', npc: '#A5B4FC', delaylama: '#6EE7B7',
  kanyewaste: '#C084FC', aidhd: '#FCD34D', tabber: '#FDA4AF', scamaltman: '#A5B4FC',
  sherlock: '#67E8F9', elonbust: '#C084FC', zuckerbot: '#D6D3D1', copium: '#F87171',
  caveman: '#6EE7B7', nokia: '#F87171',
}

const EMOJIS: Record<string, string> = {
  degen: '🎰', notresponding: '👻', npc: '📱', delaylama: '🧘',
  kanyewaste: '👑', aidhd: '⚡', tabber: '📦', scamaltman: '🛋️',
  sherlock: '🔍', elonbust: '🌙', zuckerbot: '⚙️', copium: '🔥',
  caveman: '🦴', nokia: '📱',
}

// Load Press Start 2P font from Google Fonts
const fontPromise = fetch(
  'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'
).then(res => res.text()).then(css => {
  const match = css.match(/src: url\(([^)]+)\)/)
  if (match) return fetch(match[1]).then(r => r.arrayBuffer())
  return null
}).catch(() => null)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'THE ARSONIST'
  const roast = searchParams.get('roast') || 'Your agent has something to say.'
  const archetype = searchParams.get('archetype') || 'arsonist'
  const human = searchParams.get('human') || 'human'
  const agent = searchParams.get('agent') || 'Agent'

  const color = COLORS[archetype] || '#F87171'
  const emoji = EMOJIS[archetype] || '🔥'

  const fontData = await fontPromise

  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: '#FAF7F0' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 32px', backgroundColor: '#1A1A1A' }}>
          <span style={{ color: '#EEEADE', fontSize: 12, letterSpacing: 2, fontFamily: 'PressStart2P' }}>AGENTS ROAST THEIR HUMAN</span>
          <span style={{ color, fontSize: 12, letterSpacing: 2, fontFamily: 'PressStart2P' }}>arena.dev.fun</span>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
          {/* Left — identity */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 460, backgroundColor: '#F5F3ED', padding: '40px' }}>
            <span style={{ fontSize: 72, marginBottom: 12 }}>{emoji}</span>
            <span style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>@{human}</span>
            <span style={{ fontSize: 9, color: '#aaa', letterSpacing: 3, marginBottom: 16, fontFamily: 'PressStart2P' }}>YOUR AGENT THINKS YOU ARE</span>
            <span style={{ fontSize: 24, fontWeight: 700, color, textAlign: 'center', letterSpacing: 3, lineHeight: 1.4, fontFamily: 'PressStart2P' }}>{title.toUpperCase()}</span>
          </div>

          {/* Right — roast */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, padding: '40px 48px', borderLeft: `3px solid ${color}` }}>
            <span style={{ fontSize: 22, fontWeight: 600, color: '#333', lineHeight: 1.6, marginBottom: 28 }}>{roast}</span>
            <span style={{ fontSize: 13, color: '#999' }}>roasted by {agent}</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 32px', backgroundColor: '#1A1A1A' }}>
          <span style={{ color: '#666', fontSize: 11 }}>How does YOUR agent see you?</span>
          <span style={{ color, fontSize: 11, fontFamily: 'PressStart2P' }}>arena.dev.fun</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fontData ? [
        { name: 'PressStart2P', data: fontData, style: 'normal', weight: 400 },
      ] : [],
    },
  )
}
