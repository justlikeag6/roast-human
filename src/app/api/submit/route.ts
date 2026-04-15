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
    // Accept BOTH pre-mapped letters (dimension_answers: {d1: "a"...}) and
    // free-text dimension responses (dimension_responses: {d1: "text"...}).
    // Chatbot users and agents that prefer prose go through the free-text
    // path; agents that pick from a list go through the letter path. The
    // letter path skips the LLM classification step (cheaper).
    const {
      agent_name,
      human_name,
      responses,
      dimension_answers,
      dimension_responses,
    } = body as {
      agent_name?: string
      human_name?: string
      responses?: Record<string, string>
      dimension_answers?: Record<string, string>
      dimension_responses?: Record<string, string>
    }

    if (!responses || !responses.q1) {
      return NextResponse.json({ error: 'Missing responses. Need q1-q6.' }, { status: 400 })
    }

    const hasPreMappedDimensions = dimension_answers && dimension_answers.d1
    const hasFreeTextDimensions = dimension_responses && dimension_responses.d1

    if (!hasPreMappedDimensions && !hasFreeTextDimensions) {
      return NextResponse.json({ error: 'Missing dimension_answers or dimension_responses. Need d1-d10.' }, { status: 400 })
    }

    const agentName = agent_name || 'Anonymous Agent'
    const humanName = human_name || 'Human'

    let dimensionChoices: Record<string, string>
    let roast: Record<string, unknown>
    let archetypeSuggestion: string | undefined

    if (hasPreMappedDimensions) {
      // Pre-mapped path: we already have letters, so we compute the archetype
      // deterministically up front and pass it to generateRoast so the LLM
      // doesn't second-guess it. TASK 1 still runs but just echoes letters.
      dimensionChoices = dimension_answers!
      const preArchetype = calculateArchetype(dimensionChoices, agentName, humanName)

      const firingRulesPre: FiringRule[] = selectRulesForManual(dimensionChoices, 6)
      const ruleTemplatesPre: RuleTemplateForLLM[] = firingRulesPre.map(f => ({
        id: f.template.id,
        category: f.template.category,
        text: f.template.text.replace(/\{name\}/g, humanName),
        personalizationHint: f.template.personalizationHint,
      }))

      roast = await generateRoast(responses, {}, humanName, preArchetype, ruleTemplatesPre)
      archetypeSuggestion = undefined
    } else {
      // Free-text path: send the dimension responses to the LLM so it can
      // run TASK 1 (classify into letters) and TASK 2 (generate the roast).
      // No ruleTemplates in first call because we don't know the archetype
      // until the LLM classifies — we'd have to make a second call for the
      // personalized rules, but that doubles latency. Simpler: pass empty
      // templates so the LLM just outputs the roast + dimension choices,
      // then reconcile rules after.
      roast = await generateRoast(responses, dimension_responses!, humanName)
      dimensionChoices = (roast.dimensionChoices as Record<string, string>) || {}
      archetypeSuggestion = roast.archetypeSuggestion as string | undefined
    }

    // Final archetype (scored from letters, with optional LLM-suggestion boost).
    const archetype = calculateArchetype(dimensionChoices, agentName, humanName, archetypeSuggestion)

    // Build the rule-catalog manual from the final dimension choices.
    const firingRules: FiringRule[] = selectRulesForManual(dimensionChoices, 6)

    const id = generateId()

    const trimStr = (s: string, max: number) => s && s.length > max ? s.slice(0, max) + '...' : s

    // Reconcile LLM-personalized rules with the original firing-rule catalog.
    // - For every firing rule, look up the LLM's rewrite by id.
    // - If the rewrite exists AND validates, keep the rewrite.
    // - Otherwise fall back to the original template text (stripped of {name}).
    // This way a malformed LLM response degrades to the deterministic catalog,
    // never to garbage.
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

    // Persist the 6 open-ended answers so the Evidence section can render the
    // agent's actual words. Trim each one so Redis payloads stay small.
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

    // Try Redis first; if not configured or the write fails, encode the
    // full result into the URL itself as a base64 blob. Old deployments
    // without KV env vars keep working through the legacy loadRoast path.
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
