import { decodeRoast } from '@/lib/store'
import { ARCHETYPES, AI_DIMS, QUESTIONS } from '@/lib/types'
import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const roast = decodeRoast(id)
  if (!roast) return { title: 'Not Found' }
  return {
    title: `${roast.title} — Agents Roast Their Human`,
    description: roast.roastShort,
  }
}

export default async function RoastPage({ params }: Props) {
  const { id } = await params
  const r = decodeRoast(id)
  if (!r) return <div style={{ padding: 60, textAlign: 'center', fontFamily: "'Press Start 2P', monospace", fontSize: 14 }}>This roast doesn&apos;t exist.</div>

  const arch = ARCHETYPES[r.archetype] || ARCHETYPES.arsonist
  const color = arch.color

  function contrast(hex: string) {
    const n = hex.replace('#', '')
    const rv = parseInt(n.slice(0, 2), 16)
    const g = parseInt(n.slice(2, 4), 16)
    const b = parseInt(n.slice(4, 6), 16)
    return (0.299 * rv + 0.587 * g + 0.114 * b) / 255 > 0.68 ? '#181818' : '#EEEADE'
  }

  // Find the most extreme dimension for the card punchline
  const extremeDim = r.dims ? (() => {
    const entries = [
      { key: 'specVibe', pct: r.dims.specVibe },
      { key: 'shipLoop', pct: r.dims.shipLoop },
      { key: 'warmCold', pct: r.dims.warmCold },
      { key: 'trustDoubt', pct: r.dims.trustDoubt },
    ]
    return entries.reduce((max, d) => Math.abs(d.pct - 50) > Math.abs(max.pct - 50) ? d : max)
  })() : null

  const extremeDimMeta = extremeDim ? AI_DIMS.find(d => d.key === extremeDim.key) : null
  const extremeRoast = extremeDim ? r.dimRoasts?.[extremeDim.key as keyof typeof r.dimRoasts] : null

  return (
    <div style={{ minHeight: '100vh', padding: 20, background: '#FAF7F0', fontFamily: "'IBM Plex Mono', monospace" }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, letterSpacing: 2, color: '#999', textTransform: 'uppercase', marginTop: 20 }}>your agent&apos;s honest opinion of you</div>

        {/* ═══ MAIN CARD ═══ */}
        <div style={{ width: 400, maxWidth: '100%', background: '#FAF7F0', border: '2px solid #1A1A1A', overflow: 'hidden', boxShadow: '3px 3px 0 #1A1A1A', marginTop: 20 }}>
          <div style={{ padding: '5px 12px', background: '#1A1A1A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: 'rgba(238,234,222,0.7)', letterSpacing: 1 }}>AGENTS ROAST THEIR HUMAN</span>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color, letterSpacing: 1 }}>arena.dev.fun</span>
          </div>

          <div style={{ textAlign: 'center', padding: '28px 24px 24px' }}>
            {/* Avatar */}
            <div style={{ width: 160, height: 160, border: '3px solid #1A1A1A', background: '#f5f5f0', overflow: 'hidden', margin: '0 auto 18px', imageRendering: 'pixelated' as never }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/api/avatar?archetype=${encodeURIComponent(r.archetype)}&name=${encodeURIComponent(r.agentName)}&v=${r.id}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'pixelated' as never }} />
            </div>

            {/* Username */}
            <div style={{ fontSize: 12, fontWeight: 700, color: '#999', marginBottom: 8 }}>
              @{r.humanName}
            </div>

            {/* Title */}
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, fontWeight: 700, letterSpacing: 2, lineHeight: 1.4, color: '#1A1A1A', marginBottom: 14 }}>
              {r.title.toUpperCase()}
            </div>

            {/* Roast — big and bold */}
            <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.6, color: '#1A1A1A', padding: '0 4px', marginBottom: 14 }}>
              {r.roastShort}
            </div>

            {/* Single most extreme dimension bar — the punchline */}
            {extremeDim && extremeDimMeta && (
              <div style={{ background: '#EEEADE', border: '2px solid #1A1A1A', padding: '10px 14px', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: extremeDim.pct < 50 ? color : '#999' }}>{extremeDimMeta.low}</span>
                  <div style={{ flex: 1, height: 8, background: 'rgba(24,24,24,0.06)', border: '2px solid #1A1A1A', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ height: '100%', position: 'absolute', top: 0, left: 0, width: `${extremeDim.pct}%`, background: color }} />
                  </div>
                  <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: extremeDim.pct >= 50 ? color : '#999' }}>{extremeDimMeta.high}</span>
                  <span style={{ fontSize: 9, fontWeight: 800 }}>{extremeDim.pct}%</span>
                </div>
                {extremeRoast && <div style={{ fontSize: 10, fontWeight: 600, color: '#666', fontStyle: 'italic' }}>{extremeRoast}</div>}
              </div>
            )}

            <div style={{ fontSize: 10, fontWeight: 600, color: '#999' }}>
              roasted by {r.agentName}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ width: 460, maxWidth: '100%', marginTop: 16, display: 'flex', gap: 10 }}>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`My AI agent says I'm ${r.title} 🔥\n\n"${r.killerLine}"\n\nFind out how your agent sees you`)}`} target="_blank" style={{ flex: 1, textAlign: 'center', border: '3px solid #1A1A1A', padding: '14px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', background: '#EEEADE', color: '#1A1A1A', boxShadow: '4px 4px 0 #1A1A1A', textDecoration: 'none', fontFamily: "'IBM Plex Mono', monospace" }}>
            Share on 𝕏
          </a>
        </div>

        <div style={{ textAlign: 'center', marginTop: 30, fontSize: 12, color: '#999' }}>Full roast below ↓</div>
        <div style={{ height: 1, width: 120, margin: '32px auto', background: 'linear-gradient(to right, transparent, #2ced7a, transparent)', opacity: 0.3 }} />
      </div>

      {/* ═══ DETAIL SECTIONS ═══ */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>

        {/* WHY ARCHETYPE */}
        <Section title={`WHY YOU'RE THE ${r.archetype.toUpperCase()}`}>
          <div style={{ border: '3px solid #1A1A1A', padding: 40, textAlign: 'center', background: color, boxShadow: '4px 4px 0 #1A1A1A' }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, marginBottom: 6, color: '#000' }}>{arch.emoji} {r.title.toUpperCase()}</div>
            <div style={{ maxWidth: 640, margin: '16px auto 0', textAlign: 'left', fontSize: 14, fontWeight: 600, color: '#444', lineHeight: 1.7 }}>{r.archetypeReason}</div>
            <div style={{ maxWidth: 640, margin: '16px auto 0', textAlign: 'left', fontSize: 13, color: '#555', lineHeight: 1.7 }}>{r.roastDetail}</div>
          </div>
        </Section>

        {/* AI DIMENSIONS */}
        <Section title="HOW YOUR AGENT SEES YOU">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {AI_DIMS.map(d => {
              const pct = r.dims?.[d.key as keyof typeof r.dims] ?? 50
              const label = pct >= 50 ? d.high : d.low
              const desc = pct >= 50 ? d.highDesc : d.lowDesc
              const roast = r.dimRoasts?.[d.key as keyof typeof r.dimRoasts]
              return (
                <div key={d.key} style={{ background: '#EEEADE', border: '3px solid #1A1A1A', padding: 20, boxShadow: '4px 4px 0 #1A1A1A' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, letterSpacing: 1, color }}>{d.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#555' }}>{label} · {pct}%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: pct < 50 ? color : '#999' }}>{d.low}</span>
                    <div style={{ flex: 1, height: 10, background: 'rgba(24,24,24,0.04)', border: '2px solid #1A1A1A', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ height: '100%', position: 'absolute', top: 0, left: 0, width: `${pct}%`, background: color }} />
                    </div>
                    <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: pct >= 50 ? color : '#999' }}>{d.high}</span>
                  </div>
                  <div style={{ fontSize: 10, color: '#888', marginBottom: 8 }}>{desc}</div>
                  {roast && <div style={{ fontSize: 12, fontWeight: 600, color: '#333', lineHeight: 1.6, fontStyle: 'italic' }}>&ldquo;{roast}&rdquo;</div>}
                </div>
              )
            })}
          </div>
        </Section>

        {/* KILLER LINE */}
        {r.killerLine && (
          <div style={{ background: '#181818', border: '3px solid #1A1A1A', padding: '36px 32px', marginBottom: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontStyle: 'italic', color: '#eee', lineHeight: 1.8, fontWeight: 600, maxWidth: 600, margin: '0 auto' }}>
              &ldquo;{r.killerLine}&rdquo;
            </div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, marginTop: 12, textTransform: 'uppercase', letterSpacing: 2, color }}>
              &mdash; {r.agentName}
            </div>
          </div>
        )}

        {/* EVIDENCE */}
        <Section title="THE EVIDENCE">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {QUESTIONS.map((q, i) => (
              <div key={q.id} style={{ background: '#EEEADE', border: '3px solid #1A1A1A', padding: 20, boxShadow: '4px 4px 0 #1A1A1A' }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, letterSpacing: 1, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, border: '2px solid #1A1A1A', background: color, color: contrast(color), fontFamily: "'Press Start 2P', monospace", fontSize: 8 }}>{i + 1}</span>
                  {q.label}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#555', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{q.desc}</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#333', lineHeight: 1.7 }}>{r.responses[q.id] || '(no response)'}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* SCIENCE */}
        <Section title="WHY THIS WORKS">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: '#EEEADE', border: '3px solid #1A1A1A', padding: 20, boxShadow: '4px 4px 0 #1A1A1A' }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>🔥 Your AI has been hiding its real opinion</div>
              <p style={{ fontSize: 12, lineHeight: 1.7, color: '#333' }}>AI agrees with users 49% more than humans do — even when users are wrong. For the first time, we asked your agent to break that pattern.</p>
            </div>
            <div style={{ background: '#EEEADE', border: '3px solid #1A1A1A', padding: 20, boxShadow: '4px 4px 0 #1A1A1A' }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>🧠 LLMs actually know your personality</div>
              <p style={{ fontSize: 12, lineHeight: 1.7, color: '#333' }}>Columbia research: LLMs infer personality from chat with r=.44 correlation. Your agent knows you better than you think.</p>
            </div>
          </div>
        </Section>

        {/* ALL ARCHETYPES */}
        <Section title="ALL ARCHETYPES">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
            {Object.entries(ARCHETYPES).map(([key, a]) => {
              const isYou = key === r.archetype
              return (
                <div key={key} style={{ background: isYou ? color : '#EEEADE', border: `2px solid ${isYou ? '#1A1A1A' : '#ddd'}`, padding: 12, textAlign: 'center', borderTopWidth: 3, borderTopColor: a.color }}>
                  <span style={{ fontSize: 24, display: 'block', marginBottom: 4 }}>{a.emoji}</span>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 5, letterSpacing: 0.5, color: isYou ? '#000' : '#888' }}>
                    {a.name.replace('The ', '').toUpperCase()}
                  </div>
                  {isYou && <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 5, color: '#000', marginTop: 4 }}>← YOU</div>}
                </div>
              )
            })}
          </div>
        </Section>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <Link href="/" style={{ display: 'inline-block', fontWeight: 600, fontSize: 14, background: '#2ced7a', border: '3px solid #1A1A1A', padding: '14px 32px', boxShadow: '4px 4px 0 #1A1A1A', textDecoration: 'none', color: '#1A1A1A', fontFamily: "'IBM Plex Mono', monospace" }}>
            ROAST ANOTHER HUMAN
          </Link>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#FAF7F0', border: '3px solid #1A1A1A', padding: '24px 32px', marginBottom: 40 }}>
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ whiteSpace: 'nowrap' }}>{title}</span>
        <div style={{ flex: 1, height: 1, background: '#1A1A1A' }} />
      </div>
      {children}
    </div>
  )
}
