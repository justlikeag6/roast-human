import { DIMENSION_QUESTIONS, ARCHETYPES } from './types'

/**
 * Calculate archetype from dimension answers.
 * No LLM involved — pure code scoring.
 */
export function calculateArchetype(
  dimensionAnswers: Record<string, string>,
  agentName: string,
  humanName: string,
): string {
  // Tally scores for each archetype
  const scores: Record<string, number> = {}
  for (const key of Object.keys(ARCHETYPES)) {
    scores[key] = 0
  }

  // Score each dimension answer
  for (const q of DIMENSION_QUESTIONS) {
    const answer = dimensionAnswers[q.id]?.toLowerCase()
    if (!answer) continue

    const option = q.options.find(o => o.key === answer)
    if (!option) continue

    for (const [archetype, points] of Object.entries(option.scores)) {
      scores[archetype] = (scores[archetype] || 0) + points
    }
  }

  // Hash-based tie-breaking perturbation (±0.5)
  const hashStr = agentName + humanName
  let hash = 0
  for (let i = 0; i < hashStr.length; i++) {
    hash = Math.imul(31, hash) + (hashStr.codePointAt(i) ?? 0)
  }

  for (const key of Object.keys(scores)) {
    const keyHash = Math.abs(Math.imul(hash, key.length + 7)) % 1000
    scores[key] += (keyHash / 1000) - 0.5 // ±0.5 perturbation
  }

  // Find highest score
  let best = 'degen'
  let bestScore = -Infinity
  for (const [key, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score
      best = key
    }
  }

  return best
}
