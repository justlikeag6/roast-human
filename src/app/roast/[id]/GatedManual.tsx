'use client'

import { useEffect, useState } from 'react'

interface Props {
  roastId: string
  shareText: string  // text prefilled into the X intent URL
  children: React.ReactNode
}

const STORAGE_KEY_PREFIX = 'manual-unlocked-'

// Reads a localStorage flag — same key family used by the top "Share on 𝕏"
// button so a user who already shared from there is NOT re-gated here.
function isAlreadyUnlocked(roastId: string): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEY_PREFIX + roastId) === '1'
}

export function setManualUnlocked(roastId: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY_PREFIX + roastId, '1')
}

export function GatedManual({ roastId, shareText, children }: Props) {
  // Start locked on every render to avoid hydration mismatch — the effect
  // flips us to the unlocked state on mount if localStorage says so.
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    if (isAlreadyUnlocked(roastId)) setUnlocked(true)
  }, [roastId])

  function handleUnlock() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setManualUnlocked(roastId)
    setUnlocked(true)
  }

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          filter: unlocked ? 'none' : 'blur(8px)',
          userSelect: unlocked ? 'auto' : 'none',
          pointerEvents: unlocked ? 'auto' : 'none',
          transition: 'filter 0.4s ease',
        }}
        aria-hidden={!unlocked}
      >
        {children}
      </div>

      {!unlocked && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            padding: 24,
            background: 'rgba(250, 247, 240, 0.55)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 11,
              letterSpacing: 1.5,
              color: '#1A1A1A',
              textAlign: 'center',
              maxWidth: 460,
              lineHeight: 1.7,
            }}
          >
            🔒 LOCKED
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#1A1A1A',
              textAlign: 'center',
              maxWidth: 520,
              lineHeight: 1.6,
            }}
          >
            Share your roast to unlock your AI&apos;s personalized user manual —
            ready to paste into your agent so it actually works the way you do.
          </div>
          <button
            onClick={handleUnlock}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              letterSpacing: 1.2,
              padding: '14px 24px',
              background: '#2ced7a',
              color: '#0a0a0a',
              border: '3px solid #1A1A1A',
              borderRadius: 10,
              boxShadow: '4px 4px 0 #1A1A1A',
              cursor: 'pointer',
            }}
          >
            🔓 SHARE TO UNLOCK
          </button>
        </div>
      )}
    </div>
  )
}
