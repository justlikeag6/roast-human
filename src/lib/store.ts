import type { RoastResult } from './types'

// Encode roast result into a URL-safe compressed string
export function encodeRoast(result: RoastResult): string {
  const json = JSON.stringify(result)
  // Base64 encode, then make URL-safe
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
