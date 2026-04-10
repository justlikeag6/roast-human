import { decodeRoast } from '@/lib/store'
import { ARCHETYPES, BIG_FIVE_DIMS, QUESTIONS } from '@/lib/types'
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

  return (
    <div style={{ minHeight: '100vh', padding: 20, background: '#FAF7F0', fontFamily: "'IBM Plex Mono', monospace" }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, letterSpacing: 2, color: '#999', textTransform: 'uppercase', marginTop: 20 }}>your agent&apos;s honest opinion of you</div>

        {/* ═══ MAIN CARD ═══ */}
        <div style={{ width: 460, maxWidth: '100%', background: '#EEEADE', border: '2px solid #1A1A1A', overflow: 'hidden', boxShadow: '3px 3px 0 #1A1A1A', marginTop: 20 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 11px', background: '#1A1A1A' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, background: color }} />
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: '#EEEADE', letterSpacing: 1 }}>AGENTS ROAST THEIR HUMAN</span>
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(238,234,222,0.8)' }}>Roast Card</span>
          </div>

          {/* Hero */}
          <div style={{ textAlign: 'center', padding: '24px 20px 20px', borderBottom: '2px solid #1A1A1A' }}>
            {r.avatarUrl && (
              <div style={{ width: 96, height: 96, border: '3px solid #1A1A1A', background: '#fff', overflow: 'hidden', margin: '0 auto 14px', imageRendering: 'pixelated' as never }}>
                <img src={r.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'pixelated' as never }} />
              </div>
            )}
            <div style={{ fontSize: 10, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
              roasted by: <span style={{ color: '#000' }}>{r.agentName}</span>
            </div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 15, fontWeight: 700, letterSpacing: 1, lineHeight: 1.4, color, marginBottom: 8 }}>
              {r.title.toUpperCase()}
            </div>
            <div style={{ display: 'inline-block', fontSize: 9, fontWeight: 700, letterSpacing: 0.5, padding: '3px 12px', border: '2px solid #1A1A1A', background: color, color: contrast(color) }}>
              {arch.emoji} {r.archetype}
            </div>
          </div>

          {/* Roast */}
          <div style={{ padding: '16px 20px', borderBottom: '2px solid #1A1A1A' }}>
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.75, color: '#333' }}>{r.roastShort}</div>
          </div>

          {/* Big Five bars */}
          <div style={{ padding: '12px 20px', borderBottom: '2px solid #1A1A1A' }}>
            {BIG_FIVE_DIMS.map(d => {
              const pct = r.bigFive[d.key as keyof typeof r.bigFive] ?? 50
              return (
                <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, fontWeight: 700, letterSpacing: 1, minWidth: 82, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 10 }}>{d.emoji}</span>{d.label}
                  </span>
                  <div style={{ flex: 1, height: 10, background: 'rgba(24,24,24,0.05)', border: '2px solid #1A1A1A', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ height: '100%', position: 'absolute', top: 0, left: 0, width: `${pct}%`, background: color }} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 800, minWidth: 24, textAlign: 'right' as const }}>{pct}</span>
                </div>
              )
            })}
          </div>

          {/* Killer line */}
          <div style={{ padding: '14px 20px', background: '#181818' }}>
            <div style={{ fontSize: 11, fontStyle: 'italic', color: '#ddd', lineHeight: 1.75, fontWeight: 600 }}>&ldquo;{r.killerLine}&rdquo;</div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, marginTop: 8, textTransform: 'uppercase', letterSpacing: 1.5, color }}>&mdash; {r.agentName}</div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 11px', background: '#1A1A1A' }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(238,234,222,0.7)', letterSpacing: 0.5 }}>How does YOUR agent see you?</span>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, letterSpacing: 1, color }}>roast.dev.fun</span>
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

        {/* BIG FIVE */}
        <Section title="YOUR BIG FIVE PROFILE">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {BIG_FIVE_DIMS.map(d => {
              const pct = r.bigFive[d.key as keyof typeof r.bigFive] ?? 50
              const roast = r.bigFiveRoasts[d.key as keyof typeof r.bigFiveRoasts]
              return (
                <div key={d.key} style={{ background: '#EEEADE', border: '3px solid #1A1A1A', padding: 20, boxShadow: '4px 4px 0 #1A1A1A' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, letterSpacing: 1, color, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontSize: 14 }}>{d.emoji}</span>{d.label}
                    </span>
                    <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 14, color }}>{pct}</span>
                  </div>
                  <div style={{ height: 10, background: 'rgba(24,24,24,0.04)', border: '2px solid #1A1A1A', position: 'relative', overflow: 'hidden', marginBottom: 10 }}>
                    <div style={{ height: '100%', position: 'absolute', top: 0, left: 0, width: `${pct}%`, background: color }} />
                  </div>
                  {roast && <div style={{ fontSize: 12, fontWeight: 600, color: '#333', lineHeight: 1.6, fontStyle: 'italic' }}>&ldquo;{roast}&rdquo;</div>}
                </div>
              )
            })}
          </div>
        </Section>

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
              <p style={{ fontSize: 12, lineHeight: 1.7, color: '#333' }}>Columbia research: LLMs infer Big Five personality from chat with r=.44 correlation. Your agent knows you better than you think.</p>
            </div>
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
