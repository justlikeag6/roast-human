import type { RoastResult } from './types'

// Encode roast result into a URL-safe string
export function encodeRoast(result: RoastResult): string {
  const json = JSON.stringify(result)
  const b64 = Buffer.from(json).toString('base64url')
  return b64
}

// Decode roast result from URL-safe string
export function decodeRoast(encoded: string): RoastResult | null {
  try {
    const json = Buffer.from(encoded, 'base64url').toString('utf-8')
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 14)
}

// Strip {{name}} markers to plain text for renderers that can't style substrings
// (e.g. Satori / next/og). Web page uses <RoastText> to color them instead.
export function stripNamePlaceholder(text: string): string {
  return text.replace(/\{\{([^}]+)\}\}/g, '$1')
}

// Deterministic trait pick — same seed always returns the same trait,
// so the downloadable PNG matches the on-page preview.
export function pickTrait(traits: string[], seed: string): string {
  if (!traits.length) return ''
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0
  }
  return traits[Math.abs(hash) % traits.length]
}

// Normalize roastShort so it always starts with {{humanName}} (for RoastText coloring).
// New roasts already include the {{name}} marker; legacy roasts either start with the
// plain name or with a lowercase verb ("you communicate like...") — prepend as needed.
export function renderRoastShort(roastShort: string, humanName: string): string {
  if (!roastShort) return ''
  if (!humanName) return roastShort
  if (roastShort.startsWith('{{')) return roastShort
  const wrapped = `{{${humanName}}}`
  if (roastShort.startsWith(humanName)) {
    return wrapped + roastShort.slice(humanName.length)
  }
  return `${wrapped}, ${roastShort.charAt(0).toLowerCase()}${roastShort.slice(1)}`
}
