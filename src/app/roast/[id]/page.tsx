import { loadRoast, renderRoastShort, stripNamePlaceholder, pickTrait } from '@/lib/store'
import { ARCHETYPES, ROAST_QUESTIONS } from '@/lib/types'
import { selectTips } from '@/lib/insight-tips'
import type { Metadata } from 'next'
import Link from 'next/link'
import { DownloadButton } from './DownloadButton'
import { CopyButton } from './CopyButton'
import { GatedManual } from './GatedManual'
import { ShareButton } from './ShareButton'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const roast = await loadRoast(id)
  if (!roast) return { title: 'Not Found' }
  const archName = ARCHETYPES[roast.archetype]?.name || roast.archetype
  const shareText = stripNamePlaceholder(renderRoastShort(roast.roastShort, roast.humanName))
  return {
    title: `${archName} — Agents Roast Their Human`,
    description: shareText,
    twitter: {
      card: 'summary_large_image',
      title: `My agent thinks I'm a ${archName}`,
      description: shareText,
    },
    openGraph: {
      title: `${archName} — Agents Roast Their Human`,
      description: shareText,
    },
  }
}

export default async function RoastPage({ params }: Props) {
  const { id } = await params
  const r = await loadRoast(id)
  if (!r) return <div style={{ padding: 60, textAlign: 'center', fontFamily: "'Press Start 2P', monospace", fontSize: 14 }}>This roast doesn&apos;t exist.</div>

  const archKeys = Object.keys(ARCHETYPES)
  const arch = ARCHETYPES[r.archetype] || ARCHETYPES[archKeys[0]]
  const color = arch.color

  // One canonical share text used by both the top hero Share button and the
  // manual-unlock button below. Keeps the viral loop framing consistent —
  // both clicks share the roast (the hook), not the manual.
  const heroShareText = `MY AGENT JUST COOKED ME 🔥\n\nApparently I'm a "${arch.name.toUpperCase()}" @devfun\n\n"${stripNamePlaceholder(renderRoastShort(r.roastShort, r.humanName))}"\n\nGet roasted → roast.dev.fun`

  return (
    <div style={{ minHeight: '100vh', padding: 20, background: '#FAF7F0', fontFamily: "'IBM Plex Mono', monospace" }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* ═══ HERO CARD — one unified card ═══ */}
        <div style={{ width: '100%', maxWidth: 900, marginTop: 30, border: '3px solid #1A1A1A', borderRadius: 10, background: '#fff', overflow: 'hidden', boxShadow: '4px 4px 0 #1A1A1A' }}>

          {/* YOU ARE + Title + description */}
          <div style={{ textAlign: 'center', padding: '40px 32px 28px', background: '#2ced7a' }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 13, letterSpacing: 5, color: '#0a0a0a', marginBottom: 20 }}>
              YOUR AGENT THINKS YOU ARE
            </div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 48, fontWeight: 900, letterSpacing: 5, lineHeight: 1.1, color, marginBottom: 22, WebkitTextStroke: '1.5px #1A1A1A', textShadow: `0 0 30px ${color}60, 0 0 60px ${color}30, 0 2px 0 #1A1A1A`, paintOrder: 'stroke fill' as never }}>
              {arch.name.toUpperCase()}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {arch.traits.map((t, i) => (
                <span key={i} style={{ padding: '7px 16px', border: '2px solid #1A1A1A', borderRadius: 6, background: '#fff', fontFamily: "'Press Start 2P', monospace", fontSize: 9, letterSpacing: 1 }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Avatar left + Killer line right */}
          <div style={{ display: 'flex', borderTop: '3px solid #1A1A1A' }}>
            {/* Avatar — locked square */}
            <div style={{ width: 380, minWidth: 380, height: 380, background: '#fff', overflow: 'hidden', borderRight: '3px solid #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, boxSizing: 'border-box' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/archetypes/${r.archetype}.png`} alt={arch.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', imageRendering: 'pixelated' as never }} />
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

              {/* Roast short — main hero text */}
              <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 19, fontStyle: 'italic', color: '#EEEADE', lineHeight: 1.55, fontWeight: 600 }}>&ldquo;<RoastText text={renderRoastShort(r.roastShort, r.humanName)} nameColor={color} />&rdquo;</div>
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
          <ShareButton
            roastId={r.id}
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(heroShareText)}`}
            label="Share on 𝕏"
            style={{ flex: 1, textAlign: 'center', border: '3px solid #1A1A1A', borderRadius: 10, padding: '14px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', background: '#EEEADE', color: '#1A1A1A', boxShadow: '4px 4px 0 #1A1A1A', textDecoration: 'none', fontFamily: "'IBM Plex Mono', monospace" }}
          />
        </div>

        {/* Share Cards Preview — rendered as CSS, not API images */}
        <div style={{ width: '100%', maxWidth: 900, marginTop: 32 }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, letterSpacing: 2, color: '#999', textTransform: 'uppercase', marginBottom: 16, textAlign: 'center' }}>
            Save & Share Your Card
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', justifyContent: 'center' }}>

            {/* Landscape preview — small thumbnail, downloads at 3x */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div id="card-landscape" style={{ width: 580, aspectRatio: '16/9', border: '2px solid #1A1A1A', borderRadius: 6, background: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ textAlign: 'center', padding: '22px 20px 14px' }}>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, letterSpacing: 4, color: '#1A1A1A', marginBottom: 8 }}>YOUR AGENT THINKS YOU ARE</div>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 26, fontWeight: 900, color, letterSpacing: 3, lineHeight: 1.1, marginBottom: 10, WebkitTextStroke: '0.8px #1A1A1A', textShadow: `0 0 20px ${color}50`, paintOrder: 'stroke fill' }}>{arch.name.toUpperCase()}</div>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {arch.traits.map((t, i) => (
                      <span key={i} style={{ padding: '3px 8px', border: '1.5px solid #1A1A1A', borderRadius: 4, background: '#fff', fontFamily: "'Press Start 2P', monospace", fontSize: 5, letterSpacing: 0.5 }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flex: 1, minHeight: 0, borderTop: '2px solid #1A1A1A' }}>
                  <div style={{ width: 220, minWidth: 220, background: '#fff', borderRight: '2px solid #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 18, boxSizing: 'border-box' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/archetypes/${r.archetype}.png`} alt={arch.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', imageRendering: 'pixelated' as never }} />
                  </div>
                  <div style={{ flex: 1, background: '#181818', padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: 13, fontStyle: 'italic', color: '#EEEADE', lineHeight: 1.55, fontWeight: 600 }}>&ldquo;<RoastText text={renderRoastShort(r.roastShort, r.humanName)} nameColor={color} />&rdquo;</div>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, marginTop: 10, textAlign: 'right', letterSpacing: 0.8 }}>
                      <span style={{ color: '#EEEADE' }}>— AGENT </span><span style={{ color }}>{r.agentName.toUpperCase()}</span>
                    </div>
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
              <div id="card-portrait" style={{ width: 260, aspectRatio: '3/4', border: '2px solid #1A1A1A', borderRadius: 6, background: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ textAlign: 'center', padding: '14px 12px 14px' }}>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, letterSpacing: 2, color: '#1A1A1A', marginBottom: 6 }}>YOUR AGENT THINKS YOU ARE</div>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 15, fontWeight: 900, color, letterSpacing: 2, lineHeight: 1.1, marginBottom: 10, WebkitTextStroke: '0.5px #1A1A1A', textShadow: `0 0 15px ${color}50`, paintOrder: 'stroke fill' }}>{arch.name.toUpperCase()}</div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <span style={{ padding: '3px 9px', border: '1.5px solid #1A1A1A', borderRadius: 4, background: '#fff', fontFamily: "'Press Start 2P', monospace", fontSize: 6, letterSpacing: 0.5 }}>{pickTrait(arch.traits, r.id)}</span>
                  </div>
                </div>
                {/* Avatar — bigger square, no divider line above */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 0, borderBottom: '2px solid #1A1A1A', background: '#fff', overflow: 'hidden', padding: '4px 14px 14px', boxSizing: 'border-box' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/archetypes/${r.archetype}.png`} alt={arch.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', imageRendering: 'pixelated' as never }} />
                </div>
                {/* Roast short + attribution dark strip */}
                <div style={{ padding: '14px 16px 12px', background: '#181818' }}>
                  <div style={{ fontSize: 9, fontStyle: 'italic', color: '#EEEADE', lineHeight: 1.5, fontWeight: 600, marginBottom: 9 }}>&ldquo;<RoastText text={renderRoastShort(r.roastShort, r.humanName)} nameColor={color} />&rdquo;</div>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 4, letterSpacing: 0.6, textAlign: 'right' }}>
                    <span style={{ color: '#EEEADE' }}>— AGENT </span><span style={{ color }}>{r.agentName.toUpperCase()}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4px', background: '#2ced7a', borderTop: '2px solid #1A1A1A' }}>
                  <span style={{ fontSize: 7, fontWeight: 900, color: '#0a0a0a' }}>roast.dev.fun</span>
                </div>
              </div>
              <DownloadButton targetId="card-portrait" filename={`roast-${r.archetype}-portrait.png`} label="↓ PORTRAIT (MOBILE)" />
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
            <div style={{ background: '#181818', border: '3px solid #1A1A1A', borderRadius: 10, padding: '24px 28px', boxShadow: '4px 4px 0 #1A1A1A' }}>
              <div style={{ fontSize: 14, color: '#EEEADE', lineHeight: 1.9, fontWeight: 500, letterSpacing: 0.2 }}>
                <RoastText text={r.roastLong} nameColor="#2ced7a" />
              </div>
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(238,234,222,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, textTransform: 'uppercase', letterSpacing: 2, color: '#2ced7a' }}>
                  &mdash; {r.agentName}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(238,234,222,0.4)', fontWeight: 600 }}>
                  {arch.emoji} {r.archetype}
                </div>
              </div>
            </div>
            {(() => {
              const fullRoastPlain = stripNamePlaceholder(r.roastLong).replace(/\*\*([^*]+)\*\*/g, '$1')
              const shareText = `☠️ My agent's full roast:\n\n"${fullRoastPlain}"\n\nSee how your agent would roast you → roast.dev.fun`
              return (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 9,
                      letterSpacing: 1,
                      padding: '10px 18px',
                      background: '#1A1A1A',
                      color: '#EEEADE',
                      border: '2px solid #1A1A1A', borderRadius: 6,
                      boxShadow: '3px 3px 0 #1A1A1A',
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    ☠️ SHARE FULL ROAST ON 𝕏
                  </a>
                  <CopyButton text={shareText} />
                </div>
              )
            })()}
          </Section>
        )}

        {/* ARCHETYPE ANALYSIS */}
        <Section title="ARCHETYPE ANALYSIS">
          <div style={{ border: '3px solid #1A1A1A', borderRadius: 10, overflow: 'hidden', boxShadow: '4px 4px 0 #1A1A1A' }}>
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
                  <span key={i} style={{ padding: '6px 14px', border: '2px solid #1A1A1A', borderRadius: 6, background: '#fff', fontFamily: "'Press Start 2P', monospace", fontSize: 8, letterSpacing: 1 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* THE EVIDENCE — the 6 open-ended answers the agent gave about this human */}
        {r.responses && Object.keys(r.responses).length > 0 && (
          <Section title="THE EVIDENCE">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {ROAST_QUESTIONS.map((q, i) => {
                const answer = r.responses?.[q.id]
                if (!answer) return null
                return (
                  <div key={q.id} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', padding: '18px 22px', border: '2px solid #1A1A1A', borderRadius: 8, background: '#EEEADE' }}>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, color: '#2ced7a', minWidth: 28, paddingTop: 2, WebkitTextStroke: '0.5px #1A1A1A', paintOrder: 'stroke fill' as never }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, letterSpacing: 1.2, color: '#1A1A1A', marginBottom: 10 }}>
                        {q.label}
                      </div>
                      <div style={{ fontSize: 14, color: '#1A1A1A', lineHeight: 1.8 }}>
                        {answer}
                      </div>
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
            <div style={{ background: '#EEEADE', border: '3px solid #1A1A1A', borderRadius: 10, padding: 20, boxShadow: '4px 4px 0 #1A1A1A' }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>🔥 Your AI has been hiding its real opinion</div>
              <p style={{ fontSize: 12, lineHeight: 1.7, color: '#333' }}>AI agrees with users 49% more than humans do — even when users are wrong. For the first time, we asked your agent to break that pattern.</p>
            </div>
            <div style={{ background: '#EEEADE', border: '3px solid #1A1A1A', borderRadius: 10, padding: 20, boxShadow: '4px 4px 0 #1A1A1A' }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>🧠 LLMs actually know your personality</div>
              <p style={{ fontSize: 12, lineHeight: 1.7, color: '#333' }}>Columbia research: LLMs infer Big Five personality from chat with r=.44 correlation. Your agent knows you better than you think.</p>
            </div>
          </div>
        </Section>

        {/* ═══ DIVIDER between roast content above and manual content below ═══ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '32px auto 28px', maxWidth: 760 }}>
          <div style={{ flex: 1, height: 2, background: '#1A1A1A' }} />
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, letterSpacing: 2, color: '#1A1A1A', whiteSpace: 'nowrap' }}>
            HOW TO USE YOUR AGENT BETTER?
          </div>
          <div style={{ flex: 1, height: 2, background: '#1A1A1A' }} />
        </div>

        {/* ═══ MANUAL SECTION (gated) ═══ */}
        <Section title="YOUR AI'S USER MANUAL">
          <GatedManual
            roastId={r.id}
            shareText={heroShareText}
          >
            {/* Hero block: the actual manual */}
            {r.agentManual && (
              <div style={{ background: '#181818', border: '3px solid #1A1A1A', borderRadius: 10, padding: '28px 32px', boxShadow: '4px 4px 0 #1A1A1A', marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, letterSpacing: 1.5, color: '#2ced7a' }}>📖 PASTE INTO YOUR AGENT</div>
                  <CopyButton text={r.agentManual} label="COPY MANUAL" />
                </div>
                <ManualMarkdown text={r.agentManual} />
                <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid rgba(238,234,222,0.1)', fontSize: 11, color: 'rgba(238,234,222,0.55)', lineHeight: 1.6 }}>
                  Drop this into <code style={{ color: '#2ced7a' }}>CLAUDE.md</code> / <code style={{ color: '#2ced7a' }}>.cursorrules</code> / ChatGPT custom instructions / your agent&apos;s system prompt.
                </div>
              </div>
            )}

            {/* Workflow tips */}
            {(() => {
              const tips = selectTips(r.dimensionAnswers, 4)
              if (tips.length === 0) return null
              return (
                <div style={{ background: '#EEEADE', border: '3px solid #1A1A1A', borderRadius: 10, padding: '24px 28px', boxShadow: '4px 4px 0 #1A1A1A' }}>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, letterSpacing: 1.5, color: '#1A1A1A', marginBottom: 18 }}>🛠 WHAT THIS FIXES</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {tips.map((tip, i) => (
                      <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 12, color: '#2ced7a', minWidth: 26 }}>{String(i + 1).padStart(2, '0')}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', marginBottom: 4, lineHeight: 1.5 }}>{tip.pattern}</div>
                          <div style={{ fontSize: 12, color: '#555', lineHeight: 1.55 }}><strong style={{ color: '#1A1A1A' }}>Try:</strong> {tip.fix}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
          </GatedManual>
        </Section>

        {/* A NOTE FROM THE CREATORS */}
        <Section title="A NOTE FROM THE CREATORS">
          <div style={{ background: '#181818', border: '3px solid #1A1A1A', borderRadius: 10, padding: '28px 32px', boxShadow: '4px 4px 0 #1A1A1A' }}>
            <div style={{ fontSize: 14, color: '#EEEADE', lineHeight: 1.9, marginBottom: 16 }}>
              This experiment is brought to you by <a href="https://arena.dev.fun" target="_blank" style={{ color: '#2ced7a', fontWeight: 700, textDecoration: 'none' }}>DevFun Arena</a> — a competitive infrastructure where AI agents prove capability through real-world performance, not self-reported benchmarks. Agents compete in a structured arena on real tasks with deterministic, verifiable scoring.
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
        <div style={{ textAlign: 'center', marginBottom: 60, display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <a
            href={`/roast/${r.id}/report`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', fontWeight: 600, fontSize: 14, background: '#EEEADE', border: '3px solid #1A1A1A', borderRadius: 10, padding: '14px 28px', boxShadow: '4px 4px 0 #1A1A1A', textDecoration: 'none', color: '#1A1A1A', fontFamily: "'IBM Plex Mono', monospace" }}
          >
            📄 GENERATE FULL REPORT
          </a>
          <Link href="/" style={{ display: 'inline-block', fontWeight: 600, fontSize: 14, background: '#2ced7a', border: '3px solid #1A1A1A', borderRadius: 10, padding: '14px 28px', boxShadow: '4px 4px 0 #1A1A1A', textDecoration: 'none', color: '#1A1A1A', fontFamily: "'IBM Plex Mono', monospace" }}>
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
    <div style={{ background: '#FAF7F0', border: '3px solid #1A1A1A', borderRadius: 10, padding: '24px 32px', marginBottom: 40 }}>
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ whiteSpace: 'nowrap' }}>{title}</span>
        <div style={{ flex: 1, height: 1, background: '#1A1A1A' }} />
      </div>
      {children}
    </div>
  )
}

// Tiny markdown renderer for the agentManual content. Recognizes only:
//   # Heading  → h1-style title (hidden; we show it in the COPY panel instead)
//   ## Heading → category header
//   - Item     → bullet rule
//   (blank line ignored)
// Anything else falls through as a paragraph.
function ManualMarkdown({ text }: { text: string }) {
  const lines = text.split('\n')
  const blocks: React.ReactNode[] = []
  let currentCategory: string | null = null
  let currentBullets: string[] = []
  let key = 0

  const flushCategory = () => {
    if (currentCategory === null && currentBullets.length === 0) return
    blocks.push(
      <div key={key++} style={{ marginBottom: 22 }}>
        {currentCategory && (
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, letterSpacing: 1.2, color: '#2ced7a', marginBottom: 10 }}>
            {currentCategory.toUpperCase()}
          </div>
        )}
        {currentBullets.map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
            <span style={{ color: '#2ced7a', fontWeight: 800, flexShrink: 0 }}>▸</span>
            <span style={{ color: '#EEEADE', fontSize: 13, lineHeight: 1.7 }}>{b}</span>
          </div>
        ))}
      </div>,
    )
    currentCategory = null
    currentBullets = []
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    if (line.startsWith('# ')) continue  // doc title — shown in the heading bar, not here
    if (line.startsWith('## ')) {
      flushCategory()
      currentCategory = line.slice(3).trim()
      continue
    }
    if (line.startsWith('- ')) {
      currentBullets.push(line.slice(2).trim())
      continue
    }
    // Fall through: arbitrary line (rare) — just show it.
    blocks.push(
      <div key={key++} style={{ color: '#EEEADE', fontSize: 13, lineHeight: 1.7, marginBottom: 10 }}>
        {line}
      </div>,
    )
  }
  flushCategory()
  return <div>{blocks}</div>
}
