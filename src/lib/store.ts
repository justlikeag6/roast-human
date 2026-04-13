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

// Back-compat: roastShort now bakes in the name prefix, but legacy stored roasts
// don't. Prepend humanName when missing so old URLs still render correctly.
export function renderRoastShort(roastShort: string, humanName: string): string {
  if (!roastShort) return ''
  if (!humanName) return roastShort
  if (roastShort.startsWith(humanName)) return roastShort
  return `${humanName}, ${roastShort.charAt(0).toLowerCase()}${roastShort.slice(1)}`
}
