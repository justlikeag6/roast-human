'use client'

import { useEffect, useState } from 'react'
import { ARCHETYPES } from '@/lib/types'

const archetypeList = Object.entries(ARCHETYPES)

export default function Home() {
  const [copied, setCopied] = useState(false)
  const [origin, setOrigin] = useState('')
  useEffect(() => { setOrigin(window.location.origin) }, [])

  const skillText = `Take this AI personality quiz about me and post your honest read: ${origin}/api/quiz`

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F0', fontFamily: "'IBM Plex Mono', monospace" }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', paddingTop: 60, paddingBottom: 32 }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 12, letterSpacing: 3, color: '#999', marginBottom: 12 }}>
            BROUGHT TO YOU BY DEVFUN ARENA
          </div>
          <h1 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 24, letterSpacing: 2, lineHeight: 1.5, marginBottom: 16 }}>
            Your Agent <span style={{ color: '#2ced7a' }}>Roasts</span> You
          </h1>
          <p style={{ fontSize: 15, fontWeight: 500, color: '#555', lineHeight: 1.8, maxWidth: 600, margin: '0 auto' }}>
            Your AI agent answers questions about you. You get an archetype, a roast, and a reality check you didn&apos;t ask for.
          </p>
        </div>

        {/* How to get roasted */}
        <div style={{ background: '#fff', border: '3px solid #1A1A1A', borderRadius: 10, padding: 36, marginBottom: 40, boxShadow: '4px 4px 0 #1A1A1A' }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, letterSpacing: 1, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, background: '#2ced7a', display: 'inline-block' }} />
            HOW TO GET ROASTED
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Step 1 */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, color: '#2ced7a', minWidth: 36 }}>1</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', marginBottom: 10 }}>
                  Copy this and send it to your AI agent
                </div>
                <div style={{ display: 'flex', background: '#FAF7F0', border: '2px solid #1A1A1A', overflow: 'hidden' }}>
                  <span style={{ flex: 1, padding: '12px 16px', fontSize: 12, fontWeight: 600, wordBreak: 'break-all', color: '#444' }}>
                    {skillText}
                  </span>
                  <button
                    onClick={() => { navigator.clipboard.writeText(skillText); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                    style={{ padding: '12px 20px', background: '#1A1A1A', color: '#EEEADE', border: 'none', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, cursor: 'pointer', fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    {copied ? '✓ COPIED' : 'COPY'}
                  </button>
                </div>
                <div style={{ fontSize: 11, color: '#999', marginTop: 8 }}>
                  Works with Claude, ChatGPT, Gemini, or any AI agent
                </div>
                <div style={{ fontSize: 11, color: '#1A1A1A', marginTop: 10, lineHeight: 1.6 }}>
                  💡 <span style={{ background: '#FFF3A1', padding: '1px 4px', boxDecorationBreak: 'clone' as never, WebkitBoxDecorationBreak: 'clone' as never }}>Best results in a chat where your agent already knows you — memory enabled, prior conversations, or a workspace you&apos;ve shared for a while. Fresh chats produce generic roasts.</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, color: '#2ced7a', minWidth: 36 }}>2</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>Your agent takes the test</div>
                <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>10 behavioral observations + 6 open-ended roast questions. All answered by YOUR agent about YOU.</div>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, color: '#2ced7a', minWidth: 36 }}>3</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>Get your roast card</div>
                <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>Find out your archetype, read the full roast, share the result. Try not to cry.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Science */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
          <div style={{ background: '#EEEADE', border: '3px solid #1A1A1A', borderRadius: 10, padding: 24, boxShadow: '4px 4px 0 #1A1A1A' }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
              🔥 Your agent has been hiding its opinion
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: '#333', margin: 0 }}>
              AI agrees with users 49% more than humans do — even when users are wrong. We asked your agent to stop being polite and tell the truth.
            </p>
          </div>
          <div style={{ background: '#EEEADE', border: '3px solid #1A1A1A', borderRadius: 10, padding: 24, boxShadow: '4px 4px 0 #1A1A1A' }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
              🧠 Your agent actually knows you
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: '#333', margin: 0 }}>
              Research shows LLMs can infer personality from chat with surprising accuracy. Your agent knows you better than you think.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ marginBottom: 32, padding: '18px 22px', border: '2px solid #1A1A1A', borderRadius: 6, background: '#EEEADE', boxShadow: '3px 3px 0 #1A1A1A' }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, letterSpacing: 1, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, background: '#1A1A1A', display: 'inline-block' }} />
            DISCLAIMER
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.7, color: '#333', margin: 0 }}>
            Running this means you&apos;re OK with your AI agent drawing on its history with you to write the roast — but no specific personal details are exposed in the output, and we never collect or store the raw conversations.
          </p>
        </div>

        {/* Spoiler */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <button
            onClick={() => {
              const el = document.getElementById('archetype-spoiler')
              if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none'
            }}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 11,
              letterSpacing: 2,
              padding: '14px 28px',
              background: '#FF3B30',
              color: '#fff',
              border: '3px solid #1A1A1A', borderRadius: 10,
              boxShadow: '4px 4px 0 #1A1A1A',
              cursor: 'pointer',
            }}
          >
            ⚠️ SPOILER ALERT — CLICK TO VIEW ALL ARCHETYPES
          </button>
          <div id="archetype-spoiler" style={{ display: 'none', marginTop: 20 }}>
            <div style={{ background: '#181818', border: '3px solid #1A1A1A', borderRadius: 10, padding: '28px 32px', boxShadow: '4px 4px 0 #1A1A1A', textAlign: 'center' }}>
              <div style={{ fontSize: 15, color: '#EEEADE', lineHeight: 1.8, fontWeight: 600 }}>
                There are <span style={{ color: '#2ced7a', fontFamily: "'Press Start 2P', monospace", fontSize: 14 }}>{archetypeList.length}</span> archetypes. No, I&apos;m not showing you a single one. That would ruin the surprise, and honestly, you deserve to be blindsided by whatever your agent picks for you. Go ask your agent. It already knows.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '20px 0 40px', fontSize: 12, color: '#999' }}>
          Built by <a href="https://arena.dev.fun" target="_blank" style={{ color: '#2ced7a', textDecoration: 'none', fontWeight: 700 }}>DevFun Arena</a>
        </div>
      </div>
    </div>
  )
}
