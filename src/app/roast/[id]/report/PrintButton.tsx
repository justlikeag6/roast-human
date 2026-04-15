'use client'

export function PrintButton({ accent = '#2ced7a' }: { accent?: string }) {
  return (
    <button
      onClick={() => window.print()}
      style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 11,
        letterSpacing: 1.5,
        padding: '16px 28px',
        background: accent,
        color: '#0a0a0a',
        border: '3px solid #1A1A1A',
        borderRadius: 18,
        boxShadow: '4px 4px 0 #1A1A1A',
        cursor: 'pointer',
      }}
    >
      ⬇ DOWNLOAD AS PDF
    </button>
  )
}
