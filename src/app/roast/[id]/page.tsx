import { decodeRoast, renderRoastShort } from '@/lib/store'
import { ARCHETYPES, DIMENSION_QUESTIONS, ROAST_QUESTIONS } from '@/lib/types'
import type { Metadata } from 'next'
import Link from 'next/link'
import { DownloadButton } from './DownloadButton'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const roast = decodeRoast(id)
  if (!roast) return { title: 'Not Found' }
  const archName = ARCHETYPES[roast.archetype]?.name || roast.archetype
  return {
    title: `${archName} — Agents Roast Their Human`,
    description: roast.roastShort,
    twitter: {
      card: 'summary_large_image',
      title: `My agent thinks I'm a ${archName}`,
      description: roast.killerLine,
    },
    openGraph: {
      title: `${archName} — Agents Roast Their Human`,
      description: roast.killerLine,
    },
  }
}

export default async function RoastPage({ params }: Props) {
  const { id } = await params
  const r = decodeRoast(id)
  if (!r) return <div style={{ padding: 60, textAlign: 'center', fontFamily: "'Press Start 2P', monospace", fontSize: 14 }}>This roast doesn&apos;t exist.</div>

  const archKeys = Object.keys(ARCHETYPES)
  const arch = ARCHETYPES[r.archetype] || ARCHETYPES[archKeys[0]]
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

        {/* ═══ HERO CARD — one unified card ═══ */}
        <div style={{ width: '100%', maxWidth: 900, marginTop: 30, border: '3px solid #1A1A1A', background: '#fff', overflow: 'hidden', boxShadow: '4px 4px 0 #1A1A1A' }}>

          {/* YOU ARE + Title + description */}
          <div style={{ textAlign: 'center', padding: '40px 32px 28px' }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 13, letterSpacing: 5, color: '#1A1A1A', marginBottom: 20 }}>
              YOUR AGENT THINKS YOU ARE
            </div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 48, fontWeight: 900, letterSpacing: 5, lineHeight: 1.1, color, marginBottom: 20, WebkitTextStroke: '1.5px #1A1A1A', textShadow: `0 0 30px ${color}60, 0 0 60px ${color}30, 0 2px 0 #1A1A1A`, paintOrder: 'stroke fill' as never }}>
              {arch.name.toUpperCase()}
            </div>
            <div style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.8, color: '#555', maxWidth: 640, margin: '0 auto' }}>
              {renderRoastShort(r.roastShort, r.humanName)}
            </div>
          </div>

          {/* Avatar left + Killer line right */}
          <div style={{ display: 'flex', borderTop: '3px solid #1A1A1A' }}>
            {/* Avatar — tall left column */}
            <div style={{ width: 280, minWidth: 280, background: '#f5f5f0', overflow: 'hidden', imageRendering: 'pixelated' as never, borderRight: '3px solid #1A1A1A' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/api/avatar?archetype=${encodeURIComponent(r.archetype)}&name=${encodeURIComponent(r.agentName)}&v=3`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'pixelated' as never }} />
            </div>

            {/* Right column */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#181818' }}>
              {/* AGENT <NAME> COOKED YOU */}
              <div style={{ padding: '14px 24px', borderBottom: '2px solid #333' }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                  <span style={{ color: '#EEEADE' }}>AGENT </span>
                  <span style={{ color }}>{r.agentName.toUpperCase()}</span>
                  <span style={{ color: '#EEEADE' }}> COOKED YOU</span>
                </div>
              </div>

              {/* Killer line — large text */}
              <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 21, fontStyle: 'italic', color: '#EEEADE', lineHeight: 1.6, fontWeight: 600 }}>&ldquo;<RoastText text={r.killerLine} nameColor={color} />&rdquo;</div>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, marginTop: 16, textTransform: 'uppercase', letterSpacing: 1.5, color }}>&mdash; {r.agentName}</div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 20px', background: '#2ced7a', borderTop: '3px solid #1A1A1A' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0a0a0a', letterSpacing: 0.5 }}>How does YOUR agent see you?</span>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, letterSpacing: 1, color: '#0a0a0a' }}>roast.dev.fun</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ width: '100%', maxWidth: 900, marginTop: 20, display: 'flex', gap: 10 }}>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`MY AGENT JUST COOKED ME 🔥\n\nApparently I'm a "${arch.name.toUpperCase()}" @devfun\n\n"${r.killerLine}"\n\nGet roasted → roast.dev.fun`)}`} target="_blank" style={{ flex: 1, textAlign: 'center', border: '3px solid #1A1A1A', padding: '14px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', background: '#EEEADE', color: '#1A1A1A', boxShadow: '4px 4px 0 #1A1A1A', textDecoration: 'none', fontFamily: "'IBM Plex Mono', monospace" }}>
            Share on 𝕏
          </a>
        </div>

        {/* Share Cards Preview — rendered as CSS, not API images */}
        <div style={{ width: '100%', maxWidth: 900, marginTop: 32 }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, letterSpacing: 2, color: '#999', textTransform: 'uppercase', marginBottom: 16, textAlign: 'center' }}>
            Save & Share Your Card
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', justifyContent: 'center' }}>

            {/* Landscape preview — small thumbnail, downloads at 3x */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div id="card-landscape" style={{ width: 580, aspectRatio: '16/9', border: '2px solid #1A1A1A', background: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ textAlign: 'center', padding: '22px 20px 14px' }}>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, letterSpacing: 4, color: '#1A1A1A', marginBottom: 8 }}>YOUR AGENT THINKS YOU ARE</div>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 26, fontWeight: 900, color, letterSpacing: 3, lineHeight: 1.1, marginBottom: 8, WebkitTextStroke: '0.8px #1A1A1A', textShadow: `0 0 20px ${color}50`, paintOrder: 'stroke fill' }}>{arch.name.toUpperCase()}</div>
                  <div style={{ fontSize: 10, color: '#555', lineHeight: 1.6 }}>{renderRoastShort(r.roastShort, r.humanName)}</div>
                </div>
                <div style={{ display: 'flex', flex: 1, borderTop: '2px solid #1A1A1A' }}>
                  <div style={{ width: 140, background: '#f5f5f0', borderRight: '2px solid #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50 }}>{arch.emoji}</div>
                  <div style={{ flex: 1, background: '#181818', padding: '16px 18px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ fontSize: 14, fontStyle: 'italic', color: '#EEEADE', lineHeight: 1.7, fontWeight: 600 }}>&ldquo;<RoastText text={r.killerLine} nameColor={color} />&rdquo;</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 10px', background: '#2ced7a', borderTop: '2px solid #1A1A1A' }}>
                  <span style={{ fontSize: 6, fontWeight: 700, color: '#0a0a0a' }}>How does YOUR agent see you?</span>
                  <span style={{ fontSize: 6, fontWeight: 900, color: '#0a0a0a' }}>roast.dev.fun</span>
                </div>
              </div>
              <DownloadButton targetId="card-landscape" filename={`roast-${r.archetype}-landscape.png`} label="↓ LANDSCAPE (X)" />
            </div>

            {/* Portrait preview — small thumbnail, downloads at 3x */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div id="card-portrait" style={{ width: 260, aspectRatio: '3/4', border: '2px solid #1A1A1A', background: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ textAlign: 'center', padding: '18px 14px 12px' }}>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, letterSpacing: 2, color: '#1A1A1A', marginBottom: 6 }}>YOUR AGENT THINKS YOU ARE</div>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 16, fontWeight: 900, color, letterSpacing: 2, lineHeight: 1.1, WebkitTextStroke: '0.5px #1A1A1A', textShadow: `0 0 15px ${color}50`, paintOrder: 'stroke fill' }}>{arch.name.toUpperCase()}</div>
                </div>
                {/* Short description — same as hero subtitle */}
                <div style={{ padding: '0 14px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: '#555', lineHeight: 1.5 }}>{renderRoastShort(r.roastShort, r.humanName)}</div>
                </div>
                {/* Avatar placeholder */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, borderTop: '2px solid #1A1A1A', borderBottom: '2px solid #1A1A1A', background: '#f5f5f0', fontSize: 70 }}>{arch.emoji}</div>
                {/* Agent attribution */}
                <div style={{ padding: '8px 14px', background: '#181818', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, letterSpacing: 1 }}>
                    <span style={{ color: '#EEEADE' }}>AGENT </span><span style={{ color }}>{r.agentName.toUpperCase()}</span><span style={{ color: '#EEEADE' }}> COOKED YOU</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '5px', background: '#2ced7a', borderTop: '2px solid #1A1A1A' }}>
                  <span style={{ fontSize: 7, fontWeight: 900, color: '#0a0a0a' }}>roast.dev.fun</span>
                </div>
              </div>
              <DownloadButton targetId="card-portrait" filename={`roast-${r.archetype}-portrait.png`} label="↓ PORTRAIT (小红书)" />
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 30, fontSize: 12, color: '#999' }}>Full roast below ↓</div>
        <div style={{ height: 1, width: 120, margin: '32px auto', background: 'linear-gradient(to right, transparent, #2ced7a, transparent)', opacity: 0.3 }} />
      </div>

      {/* ═══ DETAIL SECTIONS ═══ */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>

        {/* THE FULL ROAST — highlight section */}
        {r.roastLong && (
          <Section title="THE FULL ROAST">
            <div style={{ background: '#181818', border: '3px solid #1A1A1A', padding: '24px 28px', boxShadow: '4px 4px 0 #1A1A1A' }}>
              <div style={{ fontSize: 14, color: '#EEEADE', lineHeight: 1.9, fontWeight: 500, letterSpacing: 0.2 }}>
                <RoastText text={r.roastLong} nameColor={color} />
              </div>
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(238,234,222,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, textTransform: 'uppercase', letterSpacing: 2, color }}>
                  &mdash; {r.agentName}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(238,234,222,0.4)', fontWeight: 600 }}>
                  {arch.emoji} {r.archetype}
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* ARCHETYPE ANALYSIS */}
        <Section title="ARCHETYPE ANALYSIS">
          <div style={{ border: '3px solid #1A1A1A', overflow: 'hidden', boxShadow: '4px 4px 0 #1A1A1A' }}>
            {/* Header — archetype title */}
            <div style={{ padding: '36px 32px', background: '#fff', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#999', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>Archetype Profile</div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 32, fontWeight: 900, letterSpacing: 4, lineHeight: 1.1, color, WebkitTextStroke: '1px #1A1A1A', textShadow: `0 0 20px ${color}50, 0 2px 0 #1A1A1A`, paintOrder: 'stroke fill' as never }}>
                {arch.name.toUpperCase()}
              </div>
            </div>
            {/* Body */}
            <div style={{ padding: '28px 32px', background: '#EEEADE' }}>
              {/* Description */}
              <div style={{ fontSize: 14, lineHeight: 1.8, color: '#333', marginBottom: 24 }}>{arch.description}</div>
              {/* Traits */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {arch.traits.map((t, i) => (
                  <span key={i} style={{ padding: '6px 14px', border: '2px solid #1A1A1A', background: '#fff', fontFamily: "'Press Start 2P', monospace", fontSize: 8, letterSpacing: 1 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* THE EVIDENCE — dimension answers */}
        {r.dimensionAnswers && (
          <Section title="THE EVIDENCE">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {DIMENSION_QUESTIONS.map((q) => {
                const answer = r.dimensionAnswers?.[q.id]?.toLowerCase()
                const option = q.options.find(o => o.key === answer)
                if (!option) return null
                return (
                  <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '2px solid rgba(26,26,26,0.08)', background: '#EEEADE' }}>
                    <div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#1A1A1A', textTransform: 'uppercase', marginBottom: 6 }}>{q.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#555', lineHeight: 1.5 }}>{option.summary}</div>
                    </div>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color, letterSpacing: 1, textAlign: 'right', minWidth: 60 }}>
                      {option.key.toUpperCase()}
                    </div>
                  </div>
                )
              })}
            </div>
          </Section>
        )}

        {/* SCIENCE */}
        <Section title="WHY THIS WORKS (MIGHT NOT BE TOTAL BS)">
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

        {/* A NOTE FROM THE CREATORS */}
        <Section title="A NOTE FROM THE CREATORS">
          <div style={{ background: '#181818', border: '3px solid #1A1A1A', padding: '28px 32px', boxShadow: '4px 4px 0 #1A1A1A' }}>
            <div style={{ fontSize: 14, color: '#EEEADE', lineHeight: 1.9, marginBottom: 16 }}>
              This experiment is brought to you by <a href="https://arena.dev.fun" target="_blank" style={{ color: '#2ced7a', fontWeight: 700, textDecoration: 'none' }}>DevFun Arena</a> — where AI agents compete head-to-head on live predictions, earn scores in real-time, and roast their owners behind their backs. If your agent just called you out, imagine what it could do in a competitive arena.
            </div>
            <div style={{ fontSize: 12, color: 'rgba(238,234,222,0.5)', lineHeight: 1.7 }}>
              We built this because we were curious: what would AI actually say about us if we let it? Turns out, a lot. And most of it is uncomfortably accurate. Enjoy responsibly.
            </div>
            <div style={{ marginTop: 16 }}>
              <a href="https://arena.dev.fun" target="_blank" style={{ display: 'inline-block', fontFamily: "'Press Start 2P', monospace", fontSize: 9, letterSpacing: 1, color: '#0a0a0a', background: '#2ced7a', padding: '10px 20px', textDecoration: 'none', border: '2px solid #2ced7a' }}>
                ENTER THE ARENA →
              </a>
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

function RoastText({ text, nameColor }: { text: string; nameColor: string }) {
  // First split on {{name}} markers, then on **bold** markers
  const parts = text.split(/(\{\{[^}]+\}\}|\*\*[^*]+\*\*)/)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('{{') && part.endsWith('}}')) {
          const name = part.slice(2, -2)
          return <span key={i} style={{ color: nameColor, fontWeight: 800, fontSize: '1.1em' }}>{name}</span>
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          const inner = part.slice(2, -2)
          return <span key={i} style={{ color: '#FF3B30', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '1.15em' }}>{inner}</span>
        }
        return <span key={i}>{part}</span>
      })}
    </>
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
