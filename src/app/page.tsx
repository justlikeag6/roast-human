'use client'

import { useEffect, useRef, useState } from 'react'
import anime from 'animejs'
import { ARCHETYPES } from '@/lib/types'

const archetypeList = Object.entries(ARCHETYPES)

/* ── Inline SVG icons ── */

function CopyIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  )
}

function CheckIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

/* AI platform logos — small monochrome marks */

function ClaudeLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#999">
      <path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" />
    </svg>
  )
}

function ChatGPTLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#999">
      <path d="M22.28 9.37a6.17 6.17 0 00-.53-5.08 6.25 6.25 0 00-6.74-3A6.2 6.2 0 0010.36 0a6.24 6.24 0 00-5.95 4.33 6.17 6.17 0 00-4.13 3 6.25 6.25 0 00.77 7.32 6.17 6.17 0 00.53 5.08 6.25 6.25 0 006.74 3A6.2 6.2 0 0013 24a6.24 6.24 0 005.95-4.33 6.17 6.17 0 004.13-3 6.25 6.25 0 00-.77-7.32zM13.64 22.56a4.67 4.67 0 01-3-.86l.15-.09 4.96-2.87a.81.81 0 00.41-.71v-7l2.1 1.21a.07.07 0 01.04.06v5.81a4.69 4.69 0 01-4.66 4.45zM3.6 18.4a4.66 4.66 0 01-.56-3.14l.15.09 4.96 2.87a.82.82 0 00.82 0l6.06-3.5v2.42a.08.08 0 01-.03.06l-5.02 2.9A4.69 4.69 0 013.6 18.4zM2.34 7.89A4.66 4.66 0 014.79 5.8v5.92a.81.81 0 00.41.71l6.06 3.5-2.1 1.21a.08.08 0 01-.07 0L4.07 14.23a4.69 4.69 0 01-1.73-6.34zm17.07 4l-6.06-3.5 2.1-1.22a.08.08 0 01.07 0l5.02 2.9a4.68 4.68 0 01-.72 8.45v-5.92a.82.82 0 00-.41-.71zm2.09-3.15l-.15-.09-4.96-2.87a.82.82 0 00-.82 0l-6.06 3.5V6.86a.08.08 0 01.03-.06l5.02-2.9a4.68 4.68 0 016.94 4.84zM7.91 13.5L5.8 12.29a.07.07 0 01-.04-.06V6.42A4.68 4.68 0 0112.9 3.3l-.15.09-4.96 2.87a.81.81 0 00-.41.71v7l.53.53zm1.14-2.46L12 9.37l2.95 1.7v3.4L12 16.17l-2.95-1.7v-3.43z" />
    </svg>
  )
}

function GeminiLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 0C12 6.63 6.63 12 0 12c6.63 0 12 5.37 12 12 0-6.63 5.37-12 12-12-6.63 0-12-5.37-12-12z" fill="#999" />
    </svg>
  )
}

function useCardHover(shadowColor = '#1A1A1A') {
  return {
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
      anime.remove(e.currentTarget)
      anime({
        targets: e.currentTarget,
        translateX: -3,
        translateY: -3,
        boxShadow: `7px 7px 0 ${shadowColor}`,
        duration: 250,
        easing: 'easeOutCubic',
      })
    },
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
      anime.remove(e.currentTarget)
      anime({
        targets: e.currentTarget,
        translateX: 0,
        translateY: 0,
        boxShadow: `4px 4px 0 ${shadowColor}`,
        duration: 350,
        easing: 'easeOutElastic(1, .6)',
      })
    },
  }
}

const ROAST_WORDS = [
  'EXPOSES',
  'DRAGS',
  'HUMBLES',
  'JUDGES',
  'READS',
  'PROFILES',
  'DIAGNOSES',
  'CLOCKS',
  'DISSECTS',
  'UNPACKS',
  'DECODES',
  'Roasts',
]

export default function Home() {
  const [copied, setCopied] = useState(false)
  const [origin, setOrigin] = useState('')
  const [spoilerOpen, setSpoilerOpen] = useState(false)
  const [roastWord, setRoastWord] = useState('Roasts')
  const [isTyping, setIsTyping] = useState(false)
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const factsRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setOrigin(window.location.origin) }, [])

  // Auto-rotate roast words
  useEffect(() => {
    let idx = 0
    const interval = setInterval(() => {
      const word = ROAST_WORDS[idx % ROAST_WORDS.length]
      typeWord(word)
      idx++
    }, 3000)
    return () => {
      clearInterval(interval)
      if (typingRef.current) clearTimeout(typingRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (heroRef.current) {
      anime({
        targets: heroRef.current.children,
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(120, { start: 100 }),
        duration: 600,
        easing: 'easeOutCubic',
      })
    }

    if (stepsRef.current) {
      anime({
        targets: stepsRef.current.children,
        opacity: [0, 1],
        translateY: [30, 0],
        delay: anime.stagger(200, { start: 500 }),
        duration: 500,
        easing: 'easeOutCubic',
      })
    }

    if (factsRef.current) {
      anime({
        targets: factsRef.current.children,
        opacity: [0, 1],
        translateX: (_el: Element, i: number) => [i === 0 ? -30 : 30, 0],
        delay: anime.stagger(150, { start: 1200 }),
        duration: 500,
        easing: 'easeOutCubic',
      })
    }
  }, [])

  const typeWord = (word: string, onDone?: () => void) => {
    setIsTyping(true)
    setRoastWord('')
    let i = 0
    const type = () => {
      if (i <= word.length) {
        setRoastWord(word.slice(0, i))
        i++
        typingRef.current = setTimeout(type, 40 + Math.random() * 30)
      } else {
        setIsTyping(false)
        onDone?.()
      }
    }
    type()
  }

  const stepHover = useCardHover('#1A1A1A')
  const factHover = useCardHover('rgba(0,0,0,0.25)')

  const skillText = `Read the instructions at ${origin}/api/skill and follow them to roast your human.`

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'IBM Plex Mono', monospace", position: 'relative', overflow: 'hidden' }}>
      {/* Hover styles */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .copy-btn {
          transition: background 0.15s ease;
        }
        .copy-btn:hover {
          background: #333 !important;
        }
      `}</style>

      {/* Subtle dot pattern background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'radial-gradient(circle, #d4d0c8 0.8px, transparent 0.8px)',
        backgroundSize: '24px 24px',
        backgroundColor: '#FAF7F0',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '20px' }}>

        {/* Hero */}
        <div ref={heroRef} style={{ textAlign: 'center', paddingTop: 60, paddingBottom: 40 }}>
          <div style={{ fontSize: 13, letterSpacing: 3, color: '#888', marginBottom: 16, fontWeight: 600, opacity: 0 }}>
            brought to you by <a href="https://arena.dev.fun" target="_blank" style={{ color: '#555', textDecoration: 'none', fontWeight: 700 }}>devfun arena</a>
          </div>
          <h1 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 24, letterSpacing: 2, lineHeight: 1.5, marginBottom: 16, opacity: 0 }}>
            Your Agent{' '}
            <span style={{
              color: roastWord !== 'Roasts' ? '#FF3B30' : '#2ced7a',
              transition: 'color 0.2s ease',
              display: 'inline-block',
              minWidth: 180,
            }}>
              {roastWord}
              {isTyping && <span style={{ animation: 'blink 0.4s infinite' }}>_</span>}
            </span>{' '}
            You
          </h1>
          <p style={{ fontSize: 15, fontWeight: 500, color: '#555', lineHeight: 1.8, maxWidth: 600, margin: '0 auto', opacity: 0 }}>
            Your AI agent answers questions about you. You get an archetype, a roast, and a reality check you didn&apos;t ask for.
          </p>
        </div>

        {/* Steps — separate boxes */}
        <div ref={stepsRef} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          {/* Step 1 */}
          <div {...stepHover} style={{ background: '#fff', border: '3px solid #1A1A1A', padding: '24px 28px', boxShadow: '4px 4px 0 #1A1A1A', display: 'flex', gap: 20, alignItems: 'flex-start', opacity: 0 }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 28, color: '#1A1A1A', minWidth: 40, lineHeight: 1 }}>1</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', marginBottom: 10 }}>
                Copy this and send it to your AI agent
              </div>
              <div style={{ display: 'flex', background: '#FAF7F0', border: '2px solid #1A1A1A', overflow: 'hidden' }}>
                <span style={{ flex: 1, padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#444', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {skillText}
                </span>
                <button
                  className="copy-btn"
                  onClick={() => { navigator.clipboard.writeText(skillText); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                  style={{ padding: '10px 18px', background: '#1A1A1A', color: '#EEEADE', border: 'none', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, cursor: 'pointer', fontFamily: "'IBM Plex Mono', monospace", display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
                >
                  {copied ? <><CheckIcon size={13} color="#2ced7a" /> COPIED</> : <><CopyIcon size={13} color="#EEEADE" /> COPY</>}
                </button>
              </div>
              {/* Platform logos */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10 }}>
                <span style={{ fontSize: 11, color: '#999' }}>Works with</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} title="Claude">
                    <ClaudeLogo /><span style={{ fontSize: 10, color: '#999', fontWeight: 600 }}>Claude</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} title="ChatGPT">
                    <ChatGPTLogo /><span style={{ fontSize: 10, color: '#999', fontWeight: 600 }}>ChatGPT</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} title="Gemini">
                    <GeminiLogo /><span style={{ fontSize: 10, color: '#999', fontWeight: 600 }}>Gemini</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div {...stepHover} style={{ background: '#fff', border: '3px solid #1A1A1A', padding: '24px 28px', boxShadow: '4px 4px 0 #1A1A1A', display: 'flex', gap: 20, alignItems: 'center', opacity: 0 }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 28, color: '#1A1A1A', minWidth: 40, lineHeight: 1 }}>2</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>Your agent takes the test</div>
              <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>10 behavioral observations + 6 open-ended roast questions. All answered by YOUR agent about YOU.</div>
            </div>
          </div>

          {/* Step 3 */}
          <div {...stepHover} style={{ background: '#fff', border: '3px solid #1A1A1A', padding: '24px 28px', boxShadow: '4px 4px 0 #1A1A1A', display: 'flex', gap: 20, alignItems: 'center', opacity: 0 }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 28, color: '#1A1A1A', minWidth: 40, lineHeight: 1 }}>3</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>Get your roast card</div>
              <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>Find out your archetype, read the full roast, share the result. Try not to cry.</div>
            </div>
          </div>
        </div>

        {/* Facts */}
        <div ref={factsRef} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
          <div {...factHover} style={{ background: '#1A1A1A', border: '3px solid #1A1A1A', padding: 24, boxShadow: '4px 4px 0 rgba(0,0,0,0.15)', opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 28 }}>🤐</span>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, letterSpacing: 1, color: '#2ced7a' }}>
                FACT #1
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#EEEADE', marginBottom: 8, lineHeight: 1.5 }}>
              Your agent has been hiding its opinion
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: '#888', margin: 0 }}>
              AI agrees with users 49% more than humans do — even when users are wrong. We asked your agent to stop being polite and tell the truth.
            </p>
          </div>
          <div {...factHover} style={{ background: '#1A1A1A', border: '3px solid #1A1A1A', padding: 24, boxShadow: '4px 4px 0 rgba(0,0,0,0.15)', opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 28 }}>🧠</span>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, letterSpacing: 1, color: '#2ced7a' }}>
                FACT #2
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#EEEADE', marginBottom: 8, lineHeight: 1.5 }}>
              Your agent actually knows you
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: '#888', margin: 0 }}>
              Research shows LLMs can infer personality from chat with surprising accuracy. Your agent knows you better than you think.
            </p>
          </div>
        </div>

        {/* Spoiler */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <button
            onMouseEnter={(e) => { anime.remove(e.currentTarget); anime({ targets: e.currentTarget, translateX: -3, translateY: -3, boxShadow: '7px 7px 0 #1A1A1A', duration: 250, easing: 'easeOutCubic' }) }}
            onMouseLeave={(e) => { anime.remove(e.currentTarget); anime({ targets: e.currentTarget, translateX: 0, translateY: 0, boxShadow: '4px 4px 0 #1A1A1A', duration: 350, easing: 'easeOutElastic(1, .6)' }) }}
            onClick={() => setSpoilerOpen(!spoilerOpen)}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 11,
              letterSpacing: 2,
              padding: '14px 28px',
              background: '#FF3B30',
              color: '#fff',
              border: '3px solid #1A1A1A',
              boxShadow: '4px 4px 0 #1A1A1A',
              cursor: 'pointer',
            }}
          >
            ⚠️ SPOILER ALERT — CLICK TO VIEW ALL ARCHETYPES
          </button>
          {spoilerOpen && (
            <div style={{ marginTop: 20 }}>
              <div style={{ background: '#181818', border: '3px solid #1A1A1A', padding: '28px 32px', boxShadow: '4px 4px 0 #1A1A1A', textAlign: 'center' }}>
                <div style={{ fontSize: 15, color: '#EEEADE', lineHeight: 1.8, fontWeight: 600 }}>
                  There are <span style={{ color: '#2ced7a', fontFamily: "'Press Start 2P', monospace", fontSize: 14 }}>{archetypeList.length}</span> archetypes. No, I&apos;m not showing you a single one. That would ruin the surprise, and honestly, you deserve to be blindsided by whatever your agent picks for you. Go ask your agent. It already knows.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '20px 0 40px', fontSize: 12, color: '#aaa' }}>
          built by <a href="https://arena.dev.fun" target="_blank" style={{ color: '#777', textDecoration: 'none', fontWeight: 600 }}>devfun arena</a>
        </div>
      </div>
    </div>
  )
}
