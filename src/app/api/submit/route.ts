import { NextRequest, NextResponse } from 'next/server'
import { generateRoast } from '@/lib/generate'
import type { RuleTemplateForLLM } from '@/lib/generate'
import { calculateArchetype } from '@/lib/scoring'
import { generateId, saveRoast } from '@/lib/store'
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
    const { agent_name, human_name, responses, dimension_answers } = body as {
      agent_name?: string
      human_name?: string
      responses?: Record<string, string>
      dimension_answers?: Record<string, string>
    }

    if (!responses || !responses.q1) {
      return NextResponse.json({ error: 'Missing responses. Need q1-q6.' }, { status: 400 })
    }

    if (!dimension_answers || !dimension_answers.d1) {
      return NextResponse.json({ error: 'Missing dimension_answers. Need d1-d10.' }, { status: 400 })
    }

    const agentName = agent_name || 'Anonymous Agent'
    const humanName = human_name || 'Human'

    // Calculate archetype from dimension answers (code, not LLM)
    const archetype = calculateArchetype(dimension_answers, agentName, humanName)

    // Pick the rule templates that fire on this user's quiz answers. Pure
    // code, deterministic. The LLM only personalizes wording.
    const firingRules: FiringRule[] = selectRulesForManual(dimension_answers, 6)
    const ruleTemplates: RuleTemplateForLLM[] = firingRules.map(f => ({
      id: f.template.id,
      category: f.template.category,
      text: f.template.text.replace(/\{name\}/g, humanName),
      personalizationHint: f.template.personalizationHint,
    }))

    // Generate roast + LLM-personalized rule wording in a single LLM call.
    const roast = await generateRoast(responses, humanName, archetype, ruleTemplates)

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
      roastShort: trimStr(roast.roastShort, 220),
      roastLong: trimStr(roast.roastLong || '', 1500),
      dimensionAnswers: dimension_answers,
      responses: trimmedResponses,
      agentManual: trimStr(agentManualMarkdown, 1800),
    }

    await saveRoast(result)

    const host = request.headers.get('host') || 'localhost:3888'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const url = `${protocol}://${host}/roast/${id}`

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
