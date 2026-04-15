'use client'

import { useEffect, useState } from 'react'
import { ARCHETYPES, BEHAVIORAL_QUESTIONS, ROAST_QUESTIONS } from '@/lib/types'

const archetypeList = Object.entries(ARCHETYPES)

// Self-contained quiz prompt for users whose AI lives inside a chatbot
// interface (ChatGPT web, Claude.ai, Gemini web, 豆包) — those chatbots
// can't make HTTP requests, so we inline the full quiz here. The user
// copies this into their chatbot, the chatbot returns JSON, and the
// user pastes that back into Step 2 for us to POST to /api/submit.
//
// Uses the free-text dimension path: the chatbot answers the 10
// behavioral questions in natural language (not multiple-choice), and
// the backend LLM classifies each into an internal a/b/c/d bucket for
// scoring. Feels more like a conversation and less like an exam.
const CHATBOT_PROMPT = `I'm taking the "Agents Roast Their Human" quiz. It asks my own AI to give its honest read on how I actually work with it — behaviors, habits, quirks. Answer from real interactions with me. Be accurate, not flattering, not cruel.

## Part 1 — Behavioral questions (1-3 sentences each)

${BEHAVIORAL_QUESTIONS.map(q => `${q.id.toUpperCase()}. ${q.prompt}`).join('\n\n')}

## Part 2 — Open-ended roast (2-4 sentences each)

${ROAST_QUESTIONS.map(q => `${q.id.toUpperCase()}. ${q.prompt}`).join('\n\n')}

## Output

Reply with ONLY this JSON object, nothing else. Answer every field based on our actual history — synthesize, don't fabricate. If you genuinely have no read on a question, write "no clear pattern".

\`\`\`json
{
  "agent_name": "your model name (e.g. Claude Opus, GPT-4o, Gemini)",
  "human_name": "my first name if you know it, else 'Human'",
  "dimension_responses": {
    "d1": "...", "d2": "...", "d3": "...", "d4": "...", "d5": "...",
    "d6": "...", "d7": "...", "d8": "...", "d9": "...", "d10": "..."
  },
  "responses": {
    "q1": "...", "q2": "...", "q3": "...",
    "q4": "...", "q5": "...", "q6": "..."
  }
}
\`\`\`
`

// Small animated label for the submit button while the backend is running.
// The roast-long LLM call takes 10-15s — without something moving, users
// will reload. Three cycling dots keeps it clearly alive.
function SubmittingLabel() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => (t + 1) % 4), 450)
    return () => clearInterval(id)
  }, [])
  const dots = '.'.repeat(tick)
  return <>🔥 ROASTING{dots}<span style={{ visibility: 'hidden' }}>{'.'.repeat(3 - tick)}</span></>
}

export default function Home() {
  const [copied, setCopied] = useState<string | null>(null)
  const [origin, setOrigin] = useState('')
  const [tab, setTab] = useState<'agent' | 'chatbot'>('agent')
  const [pastedResponse, setPastedResponse] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => { setOrigin(window.location.origin) }, [])

  const skillText = `Take this AI personality quiz about me and post your honest read: ${origin}/api/quiz`

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(c => (c === key ? null : c)), 2000)
  }

  async function handleChatbotSubmit() {
    setSubmitting(true)
    setError('')
    try {
      // Tolerant JSON extraction: strip code fences, find the outer {...}.
      const cleaned = pastedResponse.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
      const first = cleaned.indexOf('{')
      const last = cleaned.lastIndexOf('}')
      if (first < 0 || last < 0) {
        throw new Error("Couldn't find a JSON object in your paste — the chatbot reply must include the { ... } block.")
      }
      const sliced = cleaned.slice(first, last + 1)
      // Terminal-wrapped pastes often contain raw newlines inside string
      // literals, which JSON.parse rejects. Walk the text, track whether we're
      // inside a "..." string (respecting \ escapes), and collapse any raw
      // CR/LF + following whitespace into a single space. Tabs become \t.
      const repaired = (() => {
        let out = ''
        let inString = false
        let escape = false
        for (let i = 0; i < sliced.length; i++) {
          const c = sliced[i]
          if (escape) { out += c; escape = false; continue }
          if (c === '\\') { out += c; escape = true; continue }
          if (c === '"') { inString = !inString; out += c; continue }
          if (inString) {
            if (c === '\n' || c === '\r') {
              while (i + 1 < sliced.length && /\s/.test(sliced[i + 1])) i++
              out += ' '
              continue
            }
            if (c === '\t') { out += '\\t'; continue }
          }
          out += c
        }
        return out
      })()
      let parsed: Record<string, unknown>
      try {
        parsed = JSON.parse(repaired)
      } catch {
        throw new Error('The pasted JSON is invalid. Ask the chatbot to reformat, or fix braces/commas manually.')
      }
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submit failed')
      window.location.href = data.url
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setSubmitting(false)
    }
  }

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

        {/* Tab switcher — picks between the Agent (CLI / coding-agent) flow
            and the Chatbot (web chat interface) flow. Both paths end at the
            same /api/submit endpoint and produce the same roast card. */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14, paddingLeft: 4 }}>
          {([
            { key: 'agent' as const, label: '🤖 AGENT', hint: 'Claude Code, Cursor, CLI' },
            { key: 'chatbot' as const, label: '💬 CHATBOT', hint: 'ChatGPT, Claude.ai, Gemini' },
          ]).map(t => {
            const active = tab === t.key
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                title={t.hint}
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 10,
                  letterSpacing: 1.2,
                  padding: '11px 22px',
                  background: active ? '#2ced7a' : '#EEEADE',
                  color: '#1A1A1A',
                  border: '3px solid #1A1A1A',
                  borderRadius: 12,
                  boxShadow: active ? '4px 4px 0 #1A1A1A' : '2px 2px 0 #1A1A1A',
                  cursor: 'pointer',
                  transform: active ? 'translate(-1px, -1px)' : 'none',
                  transition: 'transform 0.1s ease',
                }}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        {/* How to get roasted */}
        <div style={{ background: '#fff', border: '3px solid #1A1A1A', borderRadius: 18, padding: 36, marginBottom: 40, boxShadow: '4px 4px 0 #1A1A1A' }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, letterSpacing: 1, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, background: '#2ced7a', display: 'inline-block' }} />
            HOW TO GET ROASTED
          </div>

          {tab === 'agent' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Step 1 — Agent */}
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
                      onClick={() => copyToClipboard(skillText, 'agent-skill')}
                      style={{ padding: '12px 20px', background: '#1A1A1A', color: '#EEEADE', border: 'none', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, cursor: 'pointer', fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {copied === 'agent-skill' ? '✓ COPIED' : 'COPY'}
                    </button>
                  </div>
                  <div style={{ fontSize: 11, color: '#999', marginTop: 8 }}>
                    Works with Claude Code, Cursor, or any agent that can fetch URLs and POST
                  </div>
                  <div style={{ fontSize: 11, color: '#1A1A1A', marginTop: 10, lineHeight: 1.6 }}>
                    💡 <span style={{ background: '#FFF3A1', padding: '1px 4px', boxDecorationBreak: 'clone' as never, WebkitBoxDecorationBreak: 'clone' as never }}>Best results in a chat where your agent already knows you — memory enabled, prior conversations, or a workspace you&apos;ve shared for a while. Fresh chats produce generic roasts.</span>
                  </div>
                </div>
              </div>

              {/* Step 2 — Agent */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, color: '#2ced7a', minWidth: 36 }}>2</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>Your agent takes the test</div>
                  <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>10 behavioral observations + 6 open-ended roast questions. All answered by YOUR agent about YOU.</div>
                </div>
              </div>

              {/* Step 3 — Agent */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, color: '#2ced7a', minWidth: 36 }}>3</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>Get your roast card</div>
                  <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>Find out your archetype, read the full roast, share the result. Try not to cry.</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Step 1 — Chatbot: copy the self-contained prompt */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, color: '#2ced7a', minWidth: 36 }}>1</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', marginBottom: 10 }}>
                    Copy this prompt and paste it into your chatbot
                  </div>
                  <div style={{ position: 'relative' }}>
                    <textarea
                      readOnly
                      value={CHATBOT_PROMPT}
                      style={{
                        width: '100%',
                        minHeight: 160,
                        maxHeight: 260,
                        padding: '12px 14px',
                        paddingRight: 78,
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 11,
                        lineHeight: 1.6,
                        color: '#444',
                        background: '#FAF7F0',
                        border: '2px solid #1A1A1A',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      onClick={() => copyToClipboard(CHATBOT_PROMPT, 'chatbot-prompt')}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        padding: '10px 14px',
                        background: '#1A1A1A',
                        color: '#EEEADE',
                        border: 'none',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        cursor: 'pointer',
                        fontFamily: "'IBM Plex Mono', monospace",
                      }}
                    >
                      {copied === 'chatbot-prompt' ? '✓ COPIED' : 'COPY'}
                    </button>
                  </div>
                  <div style={{ fontSize: 11, color: '#999', marginTop: 8 }}>
                    Works with ChatGPT, Claude.ai, Gemini, Grok, 豆包, 文心 — any chatbot
                  </div>
                  <div style={{ fontSize: 11, color: '#1A1A1A', marginTop: 10, lineHeight: 1.6 }}>
                    💡 <span style={{ background: '#FFF3A1', padding: '1px 4px', boxDecorationBreak: 'clone' as never, WebkitBoxDecorationBreak: 'clone' as never }}>Best results when your chatbot actually knows you — memory on, or after a long shared conversation. Fresh chats produce generic roasts.</span>
                  </div>
                </div>
              </div>

              {/* Step 2 — Chatbot: paste the reply back */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, color: '#2ced7a', minWidth: 36 }}>2</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', marginBottom: 10 }}>
                    Paste your chatbot&apos;s reply here
                  </div>
                  <textarea
                    value={pastedResponse}
                    onChange={e => { setPastedResponse(e.target.value); if (error) setError('') }}
                    placeholder="Paste the whole reply — the { ... } JSON block with dimension_responses and responses. Extra text around it is fine, we'll find the JSON."
                    style={{
                      width: '100%',
                      minHeight: 160,
                      padding: '12px 14px',
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 11,
                      lineHeight: 1.6,
                      color: '#1A1A1A',
                      background: '#fff',
                      border: '2px solid #1A1A1A',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                  {error && (
                    <div style={{ marginTop: 10, padding: '10px 12px', background: '#FFE5E5', border: '2px solid #FF3B30', borderRadius: 8, fontSize: 12, color: '#1A1A1A', lineHeight: 1.5 }}>
                      ⚠️ {error}
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3 — Chatbot: submit and redirect to the roast */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, color: '#2ced7a', minWidth: 36 }}>3</span>
                <div style={{ flex: 1 }}>
                  <button
                    onClick={handleChatbotSubmit}
                    disabled={!pastedResponse.trim() || submitting}
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 12,
                      letterSpacing: 1.5,
                      padding: '14px 28px',
                      background: (!pastedResponse.trim() || submitting) ? '#EEEADE' : '#2ced7a',
                      color: '#0a0a0a',
                      border: '3px solid #1A1A1A',
                      borderRadius: 12,
                      boxShadow: '4px 4px 0 #1A1A1A',
                      cursor: (!pastedResponse.trim() || submitting) ? 'not-allowed' : 'pointer',
                      opacity: (!pastedResponse.trim() || submitting) ? 0.55 : 1,
                    }}
                  >
                    {submitting ? <SubmittingLabel /> : '🔥 GET MY ROAST'}
                  </button>
                  <div style={{ fontSize: 13, color: '#555', marginTop: 10, lineHeight: 1.55 }}>
                    {submitting
                      ? <>Reading the chatbot&apos;s answers, classifying your behaviors, generating the roast. <strong style={{ color: '#1A1A1A' }}>Takes ~10–15 seconds.</strong> Don&apos;t refresh.</>
                      : <>We&apos;ll parse the JSON, classify your behaviors, generate the roast, and redirect you. <span style={{ color: '#999' }}>Takes ~10–15 seconds.</span></>
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Science */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
          <div style={{ background: '#EEEADE', border: '3px solid #1A1A1A', borderRadius: 18, padding: 24, boxShadow: '4px 4px 0 #1A1A1A' }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
              🔥 Your agent has been hiding its opinion
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: '#333', margin: 0 }}>
              AI agrees with users 49% more than humans do — even when users are wrong. We asked your agent to stop being polite and tell the truth.
            </p>
          </div>
          <div style={{ background: '#EEEADE', border: '3px solid #1A1A1A', borderRadius: 18, padding: 24, boxShadow: '4px 4px 0 #1A1A1A' }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
              🧠 Your agent actually knows you
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: '#333', margin: 0 }}>
              Research shows LLMs can infer personality from chat with surprising accuracy. Your agent knows you better than you think.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ marginBottom: 32, padding: '18px 22px', border: '2px solid #1A1A1A', borderRadius: 12, background: '#EEEADE', boxShadow: '3px 3px 0 #1A1A1A' }}>
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
              border: '3px solid #1A1A1A', borderRadius: 18,
              boxShadow: '4px 4px 0 #1A1A1A',
              cursor: 'pointer',
            }}
          >
            ⚠️ SPOILER ALERT — CLICK TO VIEW ALL ARCHETYPES
          </button>
          <div id="archetype-spoiler" style={{ display: 'none', marginTop: 20 }}>
            <div style={{ background: '#181818', border: '3px solid #1A1A1A', borderRadius: 18, padding: '28px 32px', boxShadow: '4px 4px 0 #1A1A1A', textAlign: 'center' }}>
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
