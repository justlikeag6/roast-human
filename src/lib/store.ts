import type { RoastResult } from './types'

// Encode roast result into a URL-safe compressed string
export function encodeRoast(result: RoastResult): string {
  // Strip responses from URL payload to keep URL short (~2000 chars vs ~4800)
  // Evidence section is cut from detail page, so responses not needed
  const { responses, ...compact } = result
  const json = JSON.stringify(compact)
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
