'use client'

export function DownloadButton({ targetId, filename, label }: { targetId: string; filename: string; label: string }) {
  return (
    <button
      onClick={async () => {
        try {
          const el = document.querySelector(`#${targetId}`) as HTMLElement
          if (!el) return
          const { toPng } = await import('html-to-image')
          const url = await toPng(el, { pixelRatio: 3 })
          const a = document.createElement('a')
          a.href = url
          a.download = filename
          a.click()
        } catch {
          alert('Long press or screenshot to save')
        }
      }}
      style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 8,
        letterSpacing: 1,
        padding: '10px 20px',
        background: '#1A1A1A',
        color: '#EEEADE',
        border: '2px solid #1A1A1A',
        boxShadow: '3px 3px 0 #1A1A1A',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}
