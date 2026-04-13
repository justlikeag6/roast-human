import { loadRoast, stripNamePlaceholder, renderRoastShort } from '@/lib/store'
import { ARCHETYPES, ROAST_QUESTIONS } from '@/lib/types'
import { PrintButton } from './PrintButton'
import type { Metadata } from 'next'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return { title: `Full Report · ${id}`, robots: { index: false, follow: false } }
}

export default async function ReportPage({ params }: Props) {
  const { id } = await params
  const r = await loadRoast(id)
  if (!r) {
    return <div style={{ padding: 60, textAlign: 'center', fontFamily: "'Press Start 2P', monospace", fontSize: 14 }}>This roast doesn&apos;t exist.</div>
  }

  const archKeys = Object.keys(ARCHETYPES)
  const arch = ARCHETYPES[r.archetype] || ARCHETYPES[archKeys[0]]
  const color = arch.color           // archetype-specific color — used ONLY for the
                                     // archetype title (cover + executive summary).
  const accent = '#2ced7a'           // platform theme green — used for every other
                                     // accent (headers, page numbers, evidence numbers,
                                     // manual bullets, signatures) so the report looks
                                     // unified regardless of which archetype it's for.
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const killerLine = stripNamePlaceholder(renderRoastShort(r.roastShort, r.humanName))

  return (
    <>
      <style>{printStyles}</style>

      {/* Top toolbar — hidden on print */}
      <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 10, background: '#FAF7F0', borderBottom: '3px solid #1A1A1A', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, letterSpacing: 1.5, color: '#1A1A1A' }}>
          FULL REPORT · {r.humanName.toUpperCase()}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#666' }}>Press Cmd/Ctrl+P or click →</div>
          <PrintButton />
        </div>
      </div>

      <div style={{ minHeight: '100vh', background: '#FAF7F0', fontFamily: "'IBM Plex Mono', monospace", padding: '40px 20px' }}>

        {/* ── P1 · COVER ──────────────────────────────────────── */}
        <div className="page">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minHeight: 900, justifyContent: 'space-between', padding: '40px 0' }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, letterSpacing: 2, color: '#666' }}>
              A PERSONALITY ASSESSMENT
            </div>
            <div>
              <div style={{ width: 280, height: 280, margin: '0 auto 32px', border: '3px solid #1A1A1A', borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '6px 6px 0 #1A1A1A' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/archetypes/${r.archetype}.png`} alt={arch.name} style={{ width: 220, height: 220, objectFit: 'contain', imageRendering: 'pixelated' as never }} />
              </div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, letterSpacing: 3, color: '#666', marginBottom: 18 }}>
                YOUR AGENT THINKS YOU ARE
              </div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 44, fontWeight: 900, letterSpacing: 4, lineHeight: 1.1, color, WebkitTextStroke: '1.5px #1A1A1A', textShadow: `0 0 24px ${color}60, 0 2px 0 #1A1A1A`, paintOrder: 'stroke fill' as never, marginBottom: 28 }}>
                {arch.name.toUpperCase()}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 44 }}>
                {arch.traits.map((t, i) => (
                  <span key={i} style={{ padding: '8px 16px', border: '2px solid #1A1A1A', borderRadius: 6, background: '#fff', fontFamily: "'Press Start 2P', monospace", fontSize: 9, letterSpacing: 1 }}>{t}</span>
                ))}
              </div>
              <div style={{ fontSize: 16, color: '#1A1A1A', lineHeight: 1.7, fontWeight: 600, maxWidth: 500, margin: '0 auto' }}>
                A CONFIDENTIAL ASSESSMENT PREPARED FOR
              </div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 22, letterSpacing: 3, color: '#1A1A1A', marginTop: 14 }}>
                {r.humanName.toUpperCase()}
              </div>
            </div>
            <div style={{ width: '100%', borderTop: '2px solid #1A1A1A', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'Press Start 2P', monospace", fontSize: 8, letterSpacing: 1, color: '#666' }}>
              <span>ASSESSED BY · {r.agentName.toUpperCase()}</span>
              <span>roast.dev.fun</span>
              <span>{today.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* ── P2 · EXECUTIVE SUMMARY ─────────────────────────── */}
        <div className="page">
          <ReportHeader pageNum="01" title="EXECUTIVE SUMMARY" color={accent} />
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, letterSpacing: 2, color: '#666', marginBottom: 12 }}>ARCHETYPE</div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 36, fontWeight: 900, letterSpacing: 3, lineHeight: 1.1, color, WebkitTextStroke: '1px #1A1A1A', textShadow: `0 2px 0 #1A1A1A`, paintOrder: 'stroke fill' as never, marginBottom: 20 }}>
              {arch.name.toUpperCase()}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {arch.traits.map((t, i) => (
                <span key={i} style={{ padding: '7px 14px', border: '2px solid #1A1A1A', borderRadius: 6, background: '#fff', fontFamily: "'Press Start 2P', monospace", fontSize: 9, letterSpacing: 1 }}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, letterSpacing: 2, color: '#666', marginBottom: 12 }}>PROFILE</div>
            <div style={{ fontSize: 14, color: '#1A1A1A', lineHeight: 1.8 }}>{arch.description}</div>
          </div>
          <div style={{ borderTop: '2px solid #1A1A1A', paddingTop: 24 }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, letterSpacing: 2, color: '#666', marginBottom: 12 }}>THE VERDICT</div>
            <div style={{ background: '#181818', border: '3px solid #1A1A1A', borderRadius: 10, padding: '24px 28px', boxShadow: '4px 4px 0 #1A1A1A' }}>
              <div style={{ fontSize: 18, color: '#EEEADE', lineHeight: 1.6, fontWeight: 600, fontStyle: 'italic' }}>
                &ldquo;{killerLine}&rdquo;
              </div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, marginTop: 16, textTransform: 'uppercase', letterSpacing: 1.5, color: accent, textAlign: 'right' }}>
                — {r.agentName}
              </div>
            </div>
          </div>
        </div>

        {/* ── P3 · THE FULL ROAST ────────────────────────────── */}
        <div className="page">
          <ReportHeader pageNum="02" title="THE FULL ROAST" color={accent} />
          {r.roastLong ? (
            <div style={{ background: '#FAF7F0', border: '3px solid #1A1A1A', borderRadius: 10, padding: '32px 36px', boxShadow: '4px 4px 0 #1A1A1A' }}>
              <div style={{ fontSize: 15, color: '#1A1A1A', lineHeight: 1.95, fontWeight: 500 }}>
                <ReportRoastText text={r.roastLong} nameColor={accent} />
              </div>
              <div style={{ marginTop: 24, paddingTop: 18, borderTop: '2px solid rgba(26,26,26,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, textTransform: 'uppercase', letterSpacing: 2, color: '#1A1A1A' }}>
                  &mdash; {r.agentName}
                </div>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, textTransform: 'uppercase', letterSpacing: 1.5, color: '#1A1A1A' }}>
                  {arch.emoji} {arch.name.toUpperCase()}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 14, color: '#666' }}>No long roast recorded.</div>
          )}
        </div>

        {/* ── P4 · THE EVIDENCE ──────────────────────────────── */}
        <div className="page">
          <ReportHeader pageNum="03" title="THE EVIDENCE" color={accent} />
          <div style={{ fontSize: 13, color: '#666', marginBottom: 24, lineHeight: 1.6 }}>
            The 6 open-ended questions your agent was asked, and the exact words it gave back.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {ROAST_QUESTIONS.map((q, i) => {
              const answer = r.responses?.[q.id]
              if (!answer) return null
              return (
                <div key={q.id} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', padding: '18px 22px', border: '2px solid #1A1A1A', borderRadius: 8, background: '#EEEADE', pageBreakInside: 'avoid' }}>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, color: accent, minWidth: 30, paddingTop: 2, WebkitTextStroke: '0.5px #1A1A1A', paintOrder: 'stroke fill' as never }}>
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
        </div>

        {/* ── P5 · USER MANUAL ───────────────────────────────── */}
        <div className="page">
          <ReportHeader pageNum="04" title="YOUR AGENT USER MANUAL" color={accent} />
          <div style={{ fontSize: 13, color: '#666', marginBottom: 24, lineHeight: 1.6 }}>
            Drop this into <code style={{ color: '#1A1A1A', fontWeight: 700 }}>CLAUDE.md</code> / <code style={{ color: '#1A1A1A', fontWeight: 700 }}>.cursorrules</code> / ChatGPT custom instructions, and your next agent will actually work the way you do.
          </div>
          {r.agentManual ? (
            <div style={{ background: '#fff', border: '3px solid #1A1A1A', borderRadius: 10, padding: '28px 32px', boxShadow: '4px 4px 0 #1A1A1A' }}>
              <ReportManualMarkdown text={r.agentManual} accent={accent} />
            </div>
          ) : (
            <div style={{ fontSize: 14, color: '#666' }}>No manual available for this roast.</div>
          )}
        </div>

        {/* ── P6 · APPENDIX ──────────────────────────────────── */}
        <div className="page">
          <ReportHeader pageNum="05" title="APPENDIX" color={accent} />
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, letterSpacing: 2, color: '#666', marginBottom: 14 }}>WHY THIS WORKS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 36 }}>
            <div style={{ background: '#EEEADE', border: '3px solid #1A1A1A', borderRadius: 10, padding: 20, boxShadow: '4px 4px 0 #1A1A1A' }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, color: '#1A1A1A' }}>🔥 Your AI has been hiding its real opinion</div>
              <p style={{ fontSize: 12, lineHeight: 1.7, color: '#333', margin: 0 }}>AI agrees with users 49% more than humans do — even when users are wrong. For the first time, we asked your agent to break that pattern.</p>
            </div>
            <div style={{ background: '#EEEADE', border: '3px solid #1A1A1A', borderRadius: 10, padding: 20, boxShadow: '4px 4px 0 #1A1A1A' }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, color: '#1A1A1A' }}>🧠 LLMs actually know your personality</div>
              <p style={{ fontSize: 12, lineHeight: 1.7, color: '#333', margin: 0 }}>Columbia research: LLMs infer Big Five personality from chat with r=.44 correlation. Your agent knows you better than you think.</p>
            </div>
          </div>

          <div style={{ background: '#181818', border: '3px solid #1A1A1A', borderRadius: 10, padding: '28px 32px', boxShadow: '4px 4px 0 #1A1A1A', marginBottom: 28 }}>
            <div style={{ fontSize: 14, color: '#EEEADE', lineHeight: 1.9, marginBottom: 16 }}>
              This experiment is brought to you by <span style={{ color: '#2ced7a', fontWeight: 700 }}>DevFun Arena</span> — a competitive infrastructure where AI agents prove capability through real-world performance, not self-reported benchmarks.
            </div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, letterSpacing: 1, color: '#2ced7a' }}>
              arena.dev.fun
            </div>
          </div>

          <div style={{ borderTop: '2px solid #1A1A1A', paddingTop: 20, textAlign: 'center' }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, letterSpacing: 2, color: '#666', marginBottom: 8 }}>
              VIEW THIS REPORT ONLINE
            </div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, letterSpacing: 1.5, color: '#1A1A1A' }}>
              roast.dev.fun/roast/{r.id}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

// Page header bar — page number + title + archetype-colored divider line.
function ReportHeader({ pageNum, title, color }: { pageNum: string; title: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, borderBottom: '3px solid #1A1A1A', paddingBottom: 16 }}>
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 14, color, letterSpacing: 1.5 }}>
        {pageNum}
      </div>
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: '#1A1A1A', letterSpacing: 2, fontWeight: 700 }}>
        {title}
      </div>
      <div style={{ flex: 1, height: 3, background: color }} />
    </div>
  )
}

// Renders roastLong with {{name}} + **highlight** markers. Light-theme variant
// (text #1A1A1A on cream, red highlights preserved).
function ReportRoastText({ text, nameColor }: { text: string; nameColor: string }) {
  const parts = text.split(/(\{\{[^}]+\}\}|\*\*[^*]+\*\*)/)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('{{') && part.endsWith('}}')) {
          return <span key={i} style={{ color: nameColor, fontWeight: 800, fontSize: '1.1em', WebkitTextStroke: '0.5px #1A1A1A', paintOrder: 'stroke fill' as never }}>{part.slice(2, -2)}</span>
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return <span key={i} style={{ color: '#FF3B30', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '1.12em' }}>{part.slice(2, -2)}</span>
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

// Light-theme manual renderer (## category → section title, - item → bullet).
function ReportManualMarkdown({ text, accent }: { text: string; accent: string }) {
  const lines = text.split('\n')
  const blocks: React.ReactNode[] = []
  let currentCategory: string | null = null
  let currentBullets: string[] = []
  let key = 0

  const flushCategory = () => {
    if (currentCategory === null && currentBullets.length === 0) return
    blocks.push(
      <div key={key++} style={{ marginBottom: 24, pageBreakInside: 'avoid' }}>
        {currentCategory && (
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, letterSpacing: 1.2, color: accent, marginBottom: 12, paddingBottom: 6, borderBottom: `2px solid ${accent}` }}>
            {currentCategory.toUpperCase()}
          </div>
        )}
        {currentBullets.map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
            <span style={{ color: accent, fontWeight: 900, flexShrink: 0 }}>▸</span>
            <span style={{ color: '#1A1A1A', fontSize: 14, lineHeight: 1.7 }}>{b}</span>
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
    if (line.startsWith('# ')) continue
    if (line.startsWith('## ')) {
      flushCategory()
      currentCategory = line.slice(3).trim()
      continue
    }
    if (line.startsWith('- ')) {
      currentBullets.push(line.slice(2).trim())
      continue
    }
    blocks.push(
      <div key={key++} style={{ color: '#1A1A1A', fontSize: 14, lineHeight: 1.7, marginBottom: 10 }}>
        {line}
      </div>,
    )
  }
  flushCategory()
  return <div>{blocks}</div>
}

const printStyles = `
@page { size: letter; margin: 0.5in; }

.page {
  background: #FAF7F0;
  max-width: 820px;
  margin: 0 auto 40px;
  border: 3px solid #1A1A1A;
  border-radius: 10px;
  padding: 56px 64px;
  box-shadow: 4px 4px 0 #1A1A1A;
  box-sizing: border-box;
}

@media print {
  .no-print { display: none !important; }
  body { background: #FAF7F0 !important; }
  html, body, * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .page {
    border: none;
    box-shadow: none;
    border-radius: 0;
    margin: 0;
    max-width: none;
    padding: 0;
    page-break-after: always;
  }
  .page:last-child { page-break-after: auto; }
}
`
