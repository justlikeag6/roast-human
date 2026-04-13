'use client'

import { useState } from 'react'

export function CopyButton({ text, label = 'COPY ROAST' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers / insecure contexts
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch { /* give up */ }
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 9,
        letterSpacing: 1,
        padding: '10px 18px',
        background: copied ? '#2ced7a' : '#EEEADE',
        color: '#1A1A1A',
        border: '2px solid #1A1A1A',
        boxShadow: '3px 3px 0 #1A1A1A',
        cursor: 'pointer',
      }}
    >
      {copied ? '✓ COPIED' : label}
    </button>
  )
}
