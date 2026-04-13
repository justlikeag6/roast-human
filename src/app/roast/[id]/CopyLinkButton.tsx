'use client'

import { useState } from 'react'

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false)

  return (
    <button
      className="hover-lift"
      onClick={() => {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      style={{
        flex: 1,
        textAlign: 'center',
        border: '3px solid #1A1A1A',
        padding: '14px 20px',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        background: copied ? '#1A1A1A' : '#EEEADE',
        color: copied ? '#EEEADE' : '#1A1A1A',
        boxShadow: '4px 4px 0 #1A1A1A',
        fontFamily: "'IBM Plex Mono', monospace",
        letterSpacing: 0.5,
        transition: 'background 0.2s ease, color 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <rect x="5.5" y="5.5" width="7" height="8.5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3.5 10.5V3a1 1 0 011-1h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      {copied ? 'Copied!' : 'Copy Link'}
    </button>
  )
}
