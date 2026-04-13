import { ARCHETYPES } from '@/lib/types'

export default function PreviewPage() {
  const archetypes = Object.entries(ARCHETYPES)

  return (
    <div style={{ minHeight: '100vh', padding: 40, background: '#FAF7F0', fontFamily: "'IBM Plex Mono', monospace" }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, marginBottom: 40, textAlign: 'center' }}>
          ALL {archetypes.length} ARCHETYPES
        </h1>

        {archetypes.map(([key, arch]) => {
          const color = arch.color
          return (
            <div key={key} style={{ marginBottom: 32 }}>
              <div style={{ border: '3px solid #1A1A1A', borderRadius: 18, overflow: 'hidden', boxShadow: '4px 4px 0 #1A1A1A' }}>
                <div style={{ padding: '20px 28px', background: color, textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 18, color: '#000', marginBottom: 4 }}>{arch.emoji} {arch.name.toUpperCase()}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(0,0,0,0.5)', letterSpacing: 1, textTransform: 'uppercase' }}>Archetype Profile · {key}</div>
                </div>
                <div style={{ padding: '24px 28px', background: '#EEEADE' }}>
                  <div style={{ fontSize: 13, lineHeight: 1.85, color: '#333', marginBottom: 16 }}>{arch.description}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {arch.traits.map((t, i) => (
                      <span key={i} style={{ padding: '5px 12px', border: '2px solid #1A1A1A', borderRadius: 12, background: '#fff', fontFamily: "'Press Start 2P', monospace", fontSize: 7, letterSpacing: 1 }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
