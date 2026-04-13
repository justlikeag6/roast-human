'use client'

import { useState } from 'react'

// Emojis per dimension — slides in on hover
const DIMENSION_EMOJI: Record<string, string> = {
  d1: '👋', d2: '📦', d3: '💥', d4: '🧩', d5: '🎯',
  d6: '📖', d7: '💬', d8: '🔄', d9: '🥁', d10: '🚪',
}

// Returns true if a hex color is perceptually light (bad contrast with white text)
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  // Perceived luminance formula
  return (r * 0.299 + g * 0.587 + b * 0.114) > 160
}

interface Props {
  dimensionId: string
  label: string
  summary: string
  answerKey: string
  color: string
}

export default function EvidenceRow({ dimensionId, label, summary, answerKey, color }: Props) {
  const [hovered, setHovered] = useState(false)
  const light = isLightColor(color)
  // For light bg colors, use dark text; for dark bg colors, use white
  const hoverTextColor = light ? '#1A1A1A' : '#fff'
  const hoverLabelColor = light ? 'rgba(26,26,26,0.6)' : 'rgba(255,255,255,0.7)'
  const emoji = DIMENSION_EMOJI[dimensionId] || '🔮'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '20px 24px',
        borderBottom: '2px solid rgba(26,26,26,0.08)',
        background: hovered ? color : '#EEEADE',
        cursor: 'default',
        transition: 'background 0.25s ease',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Text content — shifts left when emoji appears */}
      <div style={{
        flex: 1,
        transform: hovered ? 'translateX(-12px)' : 'translateX(0)',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1,
          color: hovered ? hoverLabelColor : '#1A1A1A',
          textTransform: 'uppercase',
          marginBottom: 6,
          transition: 'color 0.25s ease',
        }}>{label}</div>
        <div style={{
          fontSize: 14,
          fontWeight: 500,
          color: hovered ? hoverTextColor : '#555',
          lineHeight: 1.5,
          transition: 'color 0.25s ease',
        }}>{summary}</div>
      </div>

      {/* Answer key */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 12,
        fontWeight: 900,
        color: hovered ? hoverTextColor : '#1A1A1A',
        letterSpacing: 1,
        textAlign: 'right',
        minWidth: 40,
        transform: hovered ? 'translateX(-40px)' : 'translateX(0)',
        transition: 'color 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        {answerKey.toUpperCase()}
      </div>

      {/* Emoji — slides in from right */}
      <div style={{
        position: 'absolute',
        right: 24,
        fontSize: 28,
        transform: hovered ? 'translateX(0)' : 'translateX(70px)',
        opacity: hovered ? 1 : 0,
        transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease',
        pointerEvents: 'none',
      }}>
        {emoji}
      </div>
    </div>
  )
}
