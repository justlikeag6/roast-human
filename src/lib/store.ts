import { Redis } from '@upstash/redis'
import type { RoastResult } from './types'

// Lazy-init Redis client. Vercel Marketplace Upstash integration injects
// KV_REST_API_URL / KV_REST_API_TOKEN automatically.
let _redis: Redis | null = null
function redis(): Redis | null {
  if (_redis) return _redis
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  _redis = new Redis({ url, token })
  return _redis
}

const KEY_PREFIX = 'roast:'
const TTL_SECONDS = 60 * 60 * 24 * 365 // 1 year

// Persist a roast under its short slug. Idempotent on the same id.
export async function saveRoast(result: RoastResult): Promise<void> {
  const r = redis()
  if (!r) throw new Error('Redis not configured (KV_REST_API_URL / KV_REST_API_TOKEN missing)')
  await r.set(KEY_PREFIX + result.id, JSON.stringify(result), { ex: TTL_SECONDS })
}

// Load a roast by either short slug (Redis lookup) or legacy base64 blob.
export async function loadRoast(idOrBlob: string): Promise<RoastResult | null> {
  // Short slug heuristic: alphanumeric, ≤ 32 chars → fetch from Redis.
  if (idOrBlob.length <= 32 && /^[a-z0-9]+$/i.test(idOrBlob)) {
    const r = redis()
    if (!r) return null
    try {
      const raw = await r.get<string | RoastResult>(KEY_PREFIX + idOrBlob)
      if (!raw) return null
      // Upstash auto-deserializes JSON values, so it may return either a
      // string (older clients) or an already-parsed object.
      return typeof raw === 'string' ? JSON.parse(raw) : raw
    } catch {
      return null
    }
  }
  // Legacy long base64 blob → decode in-place. Keeps already-shared URLs alive.
  return decodeRoast(idOrBlob)
}

// ─── Legacy URL-blob encoding (kept for backwards compat) ─────────────

export function encodeRoast(result: RoastResult): string {
  const json = JSON.stringify(result)
  const b64 = Buffer.from(json).toString('base64url')
  return b64
}

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
