import { NextRequest, NextResponse } from 'next/server'
import { generateRoast } from '@/lib/generate'
import type { RuleTemplateForLLM } from '@/lib/generate'
import { calculateArchetype } from '@/lib/scoring'
import { generateId, saveRoast, encodeRoast } from '@/lib/store'
import type { RoastResult } from '@/lib/types'
import {
  selectRulesForManual,
  validateRule,
  renderManualMarkdown,
  type RuleCategory,
  type FiringRule,
} from '@/lib/rule-catalog'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Accept BOTH our format (dimension_responses as text) and Levi's format (dimension_answers as keys)
    const {
      agent_name, human_name, responses,
      dimension_responses, dimension_answers,
    } = body as {
      agent_name?: string
      human_name?: string
      responses?: Record<string, string>
      dimension_responses?: Record<string, string>
      dimension_answers?: Record<string, string>
    }

    if (!responses || !responses.q1) {
      return NextResponse.json({ error: 'Missing responses. Need q1-q6.' }, { status: 400 })
    }

    const agentName = agent_name || 'Anonymous Agent'
    const humanName = human_name || 'Human'

    // Determine if we need LLM dimension mapping or already have pre-mapped answers
    const hasPreMappedDimensions = dimension_answers && dimension_answers.d1
    const hasFreeTextDimensions = dimension_responses && dimension_responses.d1

    if (!hasPreMappedDimensions && !hasFreeTextDimensions) {
      return NextResponse.json({ error: 'Missing dimension_answers or dimension_responses. Need d1-d10.' }, { status: 400 })
    }

    let dimensionChoices: Record<string, string>
    let archetypeSuggestion: string | undefined
    let roast: Record<string, unknown>

    if (hasPreMappedDimensions) {
      // Levi's path: dimensions already mapped, use them directly
      dimensionChoices = dimension_answers!

      // Calculate archetype from pre-mapped dimension answers
      const archetype = calculateArchetype(dimensionChoices, agentName, humanName)

      // Pick rule templates for LLM personalization
      const firingRules: FiringRule[] = selectRulesForManual(dimensionChoices, 6)
      const ruleTemplates: RuleTemplateForLLM[] = firingRules.map(f => ({
        id: f.template.id,
        category: f.template.category,
        text: f.template.text.replace(/\{name\}/g, humanName),
        personalizationHint: f.template.personalizationHint,
      }))

      // Generate roast with pre-determined archetype + rule templates
      // Pass empty dimensionResponses since we don't need TASK 1
      roast = await generateRoast(responses, {}, humanName, archetype, ruleTemplates)
      archetypeSuggestion = undefined // not needed, archetype already set
      // Override dimensionChoices from roast output if present (TASK 1 still runs)
      if (roast.dimensionChoices) {
        // keep the pre-mapped ones
      }
    } else {
      // Our path: free-text dimensions, need LLM to map them
      // First pass: generate roast + dimension mapping
      roast = await generateRoast(responses, dimension_responses!, humanName)
      dimensionChoices = (roast.dimensionChoices as Record<string, string>) || {}
      archetypeSuggestion = roast.archetypeSuggestion as string | undefined
    }

    // Calculate archetype from dimension choices + LLM suggestion boost
    const archetype = calculateArchetype(dimensionChoices, agentName, humanName, archetypeSuggestion)

    // Build rule-catalog manual if we have dimension choices
    const firingRules: FiringRule[] = selectRulesForManual(dimensionChoices, 6)

    // Reconcile LLM-personalized rules with the original firing-rule catalog
    interface PersonalizedRule { id: string; category: string; text: string }
    const personalized: PersonalizedRule[] = Array.isArray(roast.agentManualRules)
      ? roast.agentManualRules as PersonalizedRule[]
      : []
    const personalizedById = new Map<string, PersonalizedRule>()
    for (const r of personalized) {
      if (r && typeof r.id === 'string' && typeof r.text === 'string') {
        personalizedById.set(r.id, r)
      }
    }
    const finalRules = firingRules.map(f => {
      const rewrite = personalizedById.get(f.template.id)
      const fallbackText = f.template.text.replace(/\{name\}/g, humanName)
      if (!rewrite) {
        return { category: f.template.category, text: fallbackText }
      }
      const check = validateRule(rewrite.text)
      if (!check.ok) {
        return { category: f.template.category, text: fallbackText }
      }
      return { category: f.template.category, text: rewrite.text }
    })
    const agentManualMarkdown = renderManualMarkdown(
      humanName,
      finalRules.map(r => ({ category: r.category as RuleCategory, text: r.text })),
    )

    const id = generateId()
    const trimStr = (s: string, max: number) => s && s.length > max ? s.slice(0, max) + '...' : s

    // Persist the 6 open-ended answers so the Evidence section can render them
    const trimmedResponses: Record<string, string> = {}
    for (const key of ['q1', 'q2', 'q3', 'q4', 'q5', 'q6']) {
      const v = responses[key]
      if (typeof v === 'string' && v.trim()) {
        trimmedResponses[key] = trimStr(v.trim(), 400)
      }
    }

    const result: RoastResult = {
      id,
      agentName,
      humanName,
      archetype,
      roastShort: trimStr(roast.roastShort as string, 220),
      roastLong: trimStr((roast.roastLong as string) || '', 1500),
      dimensionAnswers: dimensionChoices,
      responses: trimmedResponses,
      agentManual: trimStr(agentManualMarkdown, 1800),
    }

    // Try Redis first, fall back to base64 URL if Redis not configured
    let roastSlug = id
    try {
      await saveRoast(result)
    } catch (e) {
      console.warn('Redis save failed, falling back to base64 URL:', e instanceof Error ? e.message : e)
      roastSlug = encodeRoast(result)
    }

    const host = request.headers.get('host') || 'localhost:3888'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const url = `${protocol}://${host}/roast/${roastSlug}`

    return NextResponse.json({
      id,
      url,
      archetype,
      roastShort: roast.roastShort,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Submit error:', msg, error)
    return NextResponse.json(
      { error: `Failed to generate roast: ${msg}` },
      { status: 500 },
    )
  }
}
