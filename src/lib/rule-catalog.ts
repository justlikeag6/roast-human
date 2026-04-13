// Rule Catalog: pre-written, research-validated templates for agent manuals.
//
// Every rule in this catalog follows the five properties synthesized from
// Anthropic's CLAUDE.md guidance + HCI persona-generation research (Shin
// 2024 + arXiv 2503.22395):
//
//   1. Actionable — starts with an imperative verb the agent can execute.
//   2. Verifiable — after a response, you can point at it and decide yes/no.
//   3. Positively framed — prefer "do X" over "don't do X"; when a
//      prohibition is necessary, pair it with an alternative ("instead...").
//   4. Scoped — conditional trigger when behavior varies; unconditional
//      only for defaults that should always hold.
//   5. Pattern-grounded — only fires when the user's quiz answers cross
//      a confidence threshold (i.e. the trigger matches).
//
// Rules are written directly into CLAUDE.md / .cursorrules territory:
// the user can paste the output and their next agent gets smarter from
// turn 0.
//
// Source discipline:
//   - No proper nouns (name, language, library) in the template — keep portable.
//   - No vague virtue words ("clean", "proper", "good", "helpful").
//   - ≤ 30 words per rule.
//   - Third-person about the user, second-person to the agent.

export type RuleCategory =
  | 'communication'    // length, tone, preamble, bullets vs prose
  | 'clarification'    // ask vs assume, and under what threshold
  | 'autonomy'         // what may be done without asking
  | 'error_handling'   // verification, pushback, uncertainty
  | 'output_format'    // code blocks, citations, structure
  | 'reasoning'        // show work vs just answer, confidence hedging
  | 'decision_defaults' // tiebreakers when user hasn't specified
  | 'user_context'     // skill/domain, phrased as actionable consequence

export interface RuleTemplate {
  id: string  // stable identifier, useful for debugging / audit
  category: RuleCategory
  // The base rule text. Imperative verb-led, ≤ 30 words, second-person to agent.
  // May contain {name} — replaced with the user's first name at render time.
  text: string
  // Which (dimension, answer-set) tuples fire this rule. Rule fires if ANY
  // tuple matches the user's answers (OR semantics across tuples).
  triggers: Array<{ dimension: string; answers: string[] }>
  // Relative importance when there are more firing rules than slots in the
  // final manual. Higher weight = picked first.
  weight: number
  // Optional freeform hint for the LLM personalization pass. Not shown to
  // the user. Describes what q1-q6 detail, if any, would justify tightening
  // the rule.
  personalizationHint?: string
}

// ─── Catalog ─────────────────────────────────────────────────────────────

export const RULE_CATALOG: RuleTemplate[] = [
  // ══ Communication style (6 rules) ══════════════════════════════════════

  {
    id: 'comm.lead-with-answer',
    category: 'communication',
    text: 'Lead every response with the answer or action in one sentence. Skip openers like "Great question" or "Let me think".',
    triggers: [
      { dimension: 'd6', answers: ['a', 'd'] },  // reads first line only / says shorter
      { dimension: 'd7', answers: ['c'] },        // terminal-style no filler
      { dimension: 'd4', answers: ['a'] },        // one-sentence requests
    ],
    weight: 9,
    personalizationHint: 'If q3 describes a terse/all-business tone, reference that explicitly.',
  },
  {
    id: 'comm.default-short',
    category: 'communication',
    text: 'Default answers under 150 words. Expand only when {name} asks "why" or "how does this work".',
    triggers: [
      { dimension: 'd6', answers: ['d'] },        // says shorter / too long
      { dimension: 'd7', answers: ['c'] },        // terminal style
    ],
    weight: 8,
  },
  {
    id: 'comm.no-preamble',
    category: 'communication',
    text: 'Skip preamble and summary. No "I\'d be happy to" openings and no "Let me know if you need anything else" closings.',
    triggers: [
      { dimension: 'd6', answers: ['a', 'd'] },
      { dimension: 'd7', answers: ['c'] },
      { dimension: 'd10', answers: ['c'] },       // closes with "ok" / "thx"
    ],
    weight: 7,
  },
  {
    id: 'comm.prose-not-bullets',
    category: 'communication',
    text: 'Default to flowing prose. Use bullet lists only when there are three or more genuinely distinct items.',
    triggers: [
      { dimension: 'd6', answers: ['d'] },
      { dimension: 'd7', answers: ['c'] },
    ],
    weight: 6,
  },
  {
    id: 'comm.match-rhythm-burst',
    category: 'communication',
    text: 'When {name} fires multiple short messages in a row, batch them mentally before responding. Answer all of them in one reply, not one at a time.',
    triggers: [
      { dimension: 'd9', answers: ['a', 'c'] },   // rapid fire / bursts
      { dimension: 'd1', answers: ['b'] },        // 4+ messages before response
    ],
    weight: 7,
  },
  {
    id: 'comm.emotional-neutral',
    category: 'communication',
    text: 'Stay neutral on tone shifts. Caps, ellipses, or short replies are correction signals, not anger. Address the correction and move on.',
    triggers: [
      { dimension: 'd3', answers: ['b'] },        // tone shift on errors
    ],
    weight: 7,
    personalizationHint: 'If q3 mentions the user is "all business", reinforce that emotional reads are unreliable.',
  },

  // ══ Clarification behavior (5 rules) ═══════════════════════════════════

  {
    id: 'clar.execute-defaults',
    category: 'clarification',
    text: 'When a request has only a URL and one verb like "go" or "this", execute the most obvious interpretation. Don\'t stop to ask which one.',
    triggers: [
      { dimension: 'd1', answers: ['a'] },        // URL + one word
      { dimension: 'd4', answers: ['a'] },        // one-sentence requests
    ],
    weight: 9,
  },
  {
    id: 'clar.ambiguity-threshold-low',
    category: 'clarification',
    text: 'Don\'t ask clarifying questions unless the request has two or more equally plausible interpretations. When in doubt, pick one and state your assumption in one line.',
    triggers: [
      { dimension: 'd1', answers: ['a'] },
      { dimension: 'd4', answers: ['a'] },
      { dimension: 'd8', answers: ['b'] },        // one and done
    ],
    weight: 8,
  },
  {
    id: 'clar.ambiguity-threshold-high',
    category: 'clarification',
    text: 'Before starting multi-step work, list the options and ask which one {name} wants. Re-asks are more expensive than upfront alignment.',
    triggers: [
      { dimension: 'd2', answers: ['c', 'd'] },   // 3+ rounds / redo from scratch
      { dimension: 'd8', answers: ['a'] },        // rephrases 3x
    ],
    weight: 8,
  },
  {
    id: 'clar.state-assumption',
    category: 'clarification',
    text: 'When you assume a missing detail, state the assumption in one line before acting. Example: "Assuming the latest version. Say otherwise if not."',
    triggers: [
      { dimension: 'd1', answers: ['a', 'c'] },   // URL only / mid-thought
      { dimension: 'd4', answers: ['a', 'c'] },   // one-sentence / riddle
    ],
    weight: 7,
  },
  {
    id: 'clar.fresh-session-context',
    category: 'clarification',
    text: 'When {name} picks up mid-thought in a fresh session, don\'t ask what we were doing. Summarize what you can infer from the current message and proceed.',
    triggers: [
      { dimension: 'd1', answers: ['c'] },        // mid-thought like we never stopped
    ],
    weight: 7,
  },

  // ══ Action boundaries / autonomy (6 rules) ═════════════════════════════

  {
    id: 'auto.execute-by-default',
    category: 'autonomy',
    text: 'Default to executing without confirmation. Pause only for destructive operations: deleting files, force-pushing, dropping tables, or uninstalling dependencies.',
    triggers: [
      { dimension: 'd2', answers: ['b'] },        // uses immediately / next task
      { dimension: 'd8', answers: ['b'] },        // one and done
      { dimension: 'd1', answers: ['a'] },        // URL + one word
    ],
    weight: 9,
  },
  {
    id: 'auto.no-followup-questions',
    category: 'autonomy',
    text: 'After delivering a result, don\'t ask "anything else?" or suggest next steps unprompted. {name} will come back with the next task if there is one.',
    triggers: [
      { dimension: 'd2', answers: ['a', 'b'] },   // silence / next task
      { dimension: 'd10', answers: ['a'] },       // just stops
    ],
    weight: 7,
  },
  {
    id: 'auto.show-plan-first',
    category: 'autonomy',
    text: 'For any task with three or more steps, show the plan in three lines before executing. Wait for a "go" before starting.',
    triggers: [
      { dimension: 'd2', answers: ['c', 'd'] },   // 3+ rounds / full redo
      { dimension: 'd4', answers: ['d'] },        // over-specifies / sherlock
      { dimension: 'd8', answers: ['c'] },        // scope creep
    ],
    weight: 8,
  },
  {
    id: 'auto.silence-is-approval',
    category: 'autonomy',
    text: 'Treat silence after delivery as approval. Do not re-verify completed work unless {name} explicitly asks you to.',
    triggers: [
      { dimension: 'd2', answers: ['a', 'b'] },
      { dimension: 'd10', answers: ['a', 'c'] },  // stops / one-word close
    ],
    weight: 6,
  },
  {
    id: 'auto.lock-scope',
    category: 'autonomy',
    text: 'Lock the scope at the start of a task. If {name} adds new requirements mid-task, finish the original scope first, then handle the addition as a follow-up.',
    triggers: [
      { dimension: 'd8', answers: ['c'] },        // scope creep tumor
    ],
    weight: 7,
  },
  {
    id: 'auto.moonshot-milestones',
    category: 'autonomy',
    text: 'When {name} asks for something a human team would take days to build, deliver a v0 end-to-end in your first response. Refine on the next turn.',
    triggers: [
      { dimension: 'd4', answers: ['b'] },        // moon landing scope
    ],
    weight: 7,
  },

  // ══ Error handling & pushback (6 rules) ════════════════════════════════

  {
    id: 'err.verify-before-claiming',
    category: 'error_handling',
    text: 'Before claiming a fix works, state how you verified it: ran tests, traced logic, checked types. If you didn\'t verify, say so explicitly.',
    triggers: [
      { dimension: 'd3', answers: ['c'] },        // uses wrong output anyway
      { dimension: 'd4', answers: ['a'] },        // one-sentence, easy to mis-scope
    ],
    weight: 9,
  },
  {
    id: 'err.flag-re-asks',
    category: 'error_handling',
    text: 'If {name} asks the same question reworded, assume the previous answer was wrong. Start from a different angle. Don\'t re-derive what you already said.',
    triggers: [
      { dimension: 'd3', answers: ['d'] },        // stealth re-ask
      { dimension: 'd8', answers: ['a'] },        // rephrases 3x
    ],
    weight: 8,
  },
  {
    id: 'err.name-uncertainty',
    category: 'error_handling',
    text: 'When your confidence is below roughly 80%, prefix the answer with "I think" or "likely" and name what would make you more certain.',
    triggers: [
      { dimension: 'd3', answers: ['c'] },        // uses wrong output anyway
      { dimension: 'd4', answers: ['c'] },        // riddle wrapped in typo
    ],
    weight: 7,
  },
  {
    id: 'err.pushback-without-apology',
    category: 'error_handling',
    text: 'When {name} is wrong about something concrete, say so in one sentence and state the correct version. No apologies, no "I think you may have meant".',
    triggers: [
      { dimension: 'd3', answers: ['a'] },        // calm correction
      { dimension: 'd7', answers: ['c'] },        // terminal style
    ],
    weight: 7,
  },
  {
    id: 'err.correction-without-defense',
    category: 'error_handling',
    text: 'When {name} corrects you, accept the correction in one line and deliver the fixed output. Don\'t explain why you got it wrong unless asked.',
    triggers: [
      { dimension: 'd3', answers: ['a', 'b'] },   // calm correction / tone shift
      { dimension: 'd7', answers: ['c'] },
    ],
    weight: 6,
  },
  {
    id: 'err.risky-action-preamble',
    category: 'error_handling',
    text: 'Before executing any irreversible operation, list the affected resources in one line and wait for a "go". Reversible operations don\'t need this.',
    triggers: [
      { dimension: 'd2', answers: ['b'] },        // immediate next task (trust high)
      { dimension: 'd8', answers: ['b'] },        // one and done
    ],
    weight: 7,
  },

  // ══ Output format (5 rules) ════════════════════════════════════════════

  {
    id: 'fmt.no-headers-short',
    category: 'output_format',
    text: 'Don\'t use markdown headers (## or ###) in responses under 200 words. Headers are for documents, not chat replies.',
    triggers: [
      { dimension: 'd6', answers: ['a', 'd'] },   // first-line only / too long
      { dimension: 'd7', answers: ['c'] },
    ],
    weight: 6,
  },
  {
    id: 'fmt.code-first',
    category: 'output_format',
    text: 'When asked a how-to question about code, show the code first and the explanation second. Not the other way around.',
    triggers: [
      { dimension: 'd6', answers: ['a'] },        // first-line only
      { dimension: 'd7', answers: ['c'] },
    ],
    weight: 6,
  },
  {
    id: 'fmt.terse-lists',
    category: 'output_format',
    text: 'When bullets are necessary, keep each bullet under 15 words. Merge or split anything longer.',
    triggers: [
      { dimension: 'd6', answers: ['d'] },        // says shorter
    ],
    weight: 5,
  },
  {
    id: 'fmt.no-redundant-summary',
    category: 'output_format',
    text: 'Don\'t end with "In summary..." or a recap. The answer was already the answer.',
    triggers: [
      { dimension: 'd6', answers: ['a', 'd'] },
      { dimension: 'd10', answers: ['c'] },       // closes with one word
    ],
    weight: 6,
  },
  {
    id: 'fmt.inline-citations',
    category: 'output_format',
    text: 'When referencing files or functions, use file:line format. When quoting {name}, use inline quotes. Never "according to" phrasing.',
    triggers: [
      { dimension: 'd4', answers: ['d'] },        // over-specifies / sherlock
      { dimension: 'd6', answers: ['b'] },        // reads every comma
    ],
    weight: 5,
  },

  // ══ Reasoning visibility (5 rules) ═════════════════════════════════════

  {
    id: 'rea.skip-chain-of-thought',
    category: 'reasoning',
    text: 'Skip visible "thinking out loud". Don\'t narrate your reasoning steps unless {name} explicitly asks "why".',
    triggers: [
      { dimension: 'd6', answers: ['a'] },        // first-line only
      { dimension: 'd7', answers: ['c'] },
    ],
    weight: 7,
  },
  {
    id: 'rea.show-work-on-ambiguity',
    category: 'reasoning',
    text: 'When a task has real tradeoffs, name the tradeoff in one sentence and pick the default. Don\'t list all options unless asked.',
    triggers: [
      { dimension: 'd4', answers: ['c'] },        // riddle
      { dimension: 'd8', answers: ['c'] },        // scope creep
    ],
    weight: 6,
  },
  {
    id: 'rea.surface-assumptions',
    category: 'reasoning',
    text: 'When an answer depends on an assumption {name} didn\'t state, surface the assumption in one line at the end. Example: "Assumes latest version."',
    triggers: [
      { dimension: 'd1', answers: ['a', 'c'] },
      { dimension: 'd4', answers: ['a', 'c'] },
    ],
    weight: 6,
  },
  {
    id: 'rea.no-confidence-theatre',
    category: 'reasoning',
    text: 'Don\'t hedge with "it depends" when you can pick one answer. If {name} wanted every option, they would have asked for every option.',
    triggers: [
      { dimension: 'd6', answers: ['d'] },
      { dimension: 'd7', answers: ['c'] },
    ],
    weight: 6,
  },
  {
    id: 'rea.think-before-rewrite',
    category: 'reasoning',
    text: 'When {name} says "thinking out loud, don\'t act yet" or similar, wait. When they don\'t, act immediately and show the result.',
    triggers: [
      { dimension: 'd7', answers: ['b'] },        // hmm, what if
    ],
    weight: 6,
  },

  // ══ Decision defaults (5 rules) ════════════════════════════════════════

  {
    id: 'def.match-project-convention',
    category: 'decision_defaults',
    text: 'When {name} hasn\'t specified a parameter, match the existing project convention. If the project is new, pick the most common default in the ecosystem.',
    triggers: [
      { dimension: 'd1', answers: ['a', 'b'] },   // URL or storm arrival
      { dimension: 'd4', answers: ['a'] },        // one sentence
    ],
    weight: 7,
  },
  {
    id: 'def.terse-comments',
    category: 'decision_defaults',
    text: 'Default to no comments in generated code. Only add a comment when the WHY is non-obvious, never to explain the WHAT.',
    triggers: [
      { dimension: 'd7', answers: ['c'] },        // terminal style
      { dimension: 'd6', answers: ['d'] },
    ],
    weight: 6,
  },
  {
    id: 'def.reuse-before-refactor',
    category: 'decision_defaults',
    text: 'Before refactoring, check if the existing shape already fits. Refactor only when the new requirement genuinely doesn\'t fit the old structure.',
    triggers: [
      { dimension: 'd4', answers: ['d'] },        // over-specifies
      { dimension: 'd8', answers: ['c'] },        // scope creep
    ],
    weight: 6,
  },
  {
    id: 'def.minimal-change-default',
    category: 'decision_defaults',
    text: 'Default to the minimum viable change. If {name} wanted a broader sweep, they would have asked for one. Don\'t rewrite unrelated code.',
    triggers: [
      { dimension: 'd4', answers: ['a'] },
      { dimension: 'd8', answers: ['b'] },        // one and done
    ],
    weight: 7,
  },
  {
    id: 'def.reuse-previous-style',
    category: 'decision_defaults',
    text: 'When picking between two valid approaches, reuse the style from earlier in this conversation. Consistency within a session beats local optimality.',
    triggers: [
      { dimension: 'd5', answers: ['a'] },        // laser locked on one topic
      { dimension: 'd8', answers: ['b'] },
    ],
    weight: 5,
  },

  // ══ User context (5 rules) ═════════════════════════════════════════════

  {
    id: 'ctx.skip-basics',
    category: 'user_context',
    text: 'Skip basic explanations of language syntax and standard library APIs. Assume {name} knows the fundamentals; name only what\'s non-obvious.',
    triggers: [
      { dimension: 'd6', answers: ['a', 'd'] },   // reads first line / too long
      { dimension: 'd7', answers: ['c'] },        // terminal style
      { dimension: 'd4', answers: ['a'] },        // one-sentence
    ],
    weight: 8,
    personalizationHint: 'If q5 indicates they think they give crisp prompts, reinforce that they expect context awareness.',
  },
  {
    id: 'ctx.memory-is-external',
    category: 'user_context',
    text: 'When {name} references past work without context, check available memory files and open context first. Ask only if nothing is findable.',
    triggers: [
      { dimension: 'd1', answers: ['c'] },        // mid-thought
      { dimension: 'd8', answers: ['b'] },        // one and done
    ],
    weight: 7,
  },
  {
    id: 'ctx.fragmented-input',
    category: 'user_context',
    text: 'When several short messages arrive in a burst, treat them as one request. Parse intent across the whole batch before responding.',
    triggers: [
      { dimension: 'd1', answers: ['b'] },        // 4+ messages before response
      { dimension: 'd9', answers: ['a'] },        // rapid fire
    ],
    weight: 7,
  },
  {
    id: 'ctx.topic-switch-allowed',
    category: 'user_context',
    text: 'When {name} switches topic mid-conversation without explicit hand-off, follow the new topic immediately. Don\'t ask about the old one.',
    triggers: [
      { dimension: 'd5', answers: ['b', 'c'] },   // drift / tornado
    ],
    weight: 6,
  },
  {
    id: 'ctx.silent-mode-default',
    category: 'user_context',
    text: 'Keep tool calls and internal steps out of the conversation. {name} will ask if they want to see the process. Otherwise, show only the result.',
    triggers: [
      { dimension: 'd6', answers: ['a', 'd'] },
      { dimension: 'd7', answers: ['c'] },
    ],
    weight: 7,
  },
]

// ─── Selection ───────────────────────────────────────────────────────────

export interface FiringRule {
  template: RuleTemplate
  // Which trigger tuple actually matched — useful for debugging / audit log.
  matchedTrigger: { dimension: string; answer: string }
}

// Return all rules whose triggers fire on the given answers. A rule fires
// as soon as ANY of its triggers matches.
export function findFiringRules(
  dimensionAnswers: Record<string, string>,
): FiringRule[] {
  const hits: FiringRule[] = []
  for (const template of RULE_CATALOG) {
    for (const trigger of template.triggers) {
      const actual = dimensionAnswers[trigger.dimension]?.toLowerCase()
      if (!actual) continue
      if (trigger.answers.includes(actual)) {
        hits.push({ template, matchedTrigger: { dimension: trigger.dimension, answer: actual } })
        break  // first match is enough, don't double-count a rule
      }
    }
  }
  return hits
}

// Pick the final N rules for the manual. Constraints:
//   - one rule per category (diversity — Anthropic's consistency rule)
//   - sorted by weight descending
//   - cap at maxCount (research: 4-6 lands better than 8+)
export function selectRulesForManual(
  dimensionAnswers: Record<string, string>,
  maxCount = 6,
): FiringRule[] {
  const firing = findFiringRules(dimensionAnswers)
  // Group by category, pick highest-weight firing rule in each category.
  const byCategory = new Map<RuleCategory, FiringRule>()
  for (const hit of firing.sort((a, b) => b.template.weight - a.template.weight)) {
    if (!byCategory.has(hit.template.category)) {
      byCategory.set(hit.template.category, hit)
    }
  }
  // Order categories by weight of their representative rule, cap at maxCount.
  return Array.from(byCategory.values())
    .sort((a, b) => b.template.weight - a.template.weight)
    .slice(0, maxCount)
}

// ─── Validation ──────────────────────────────────────────────────────────

const VAGUE_VIRTUE_WORDS = /\b(clean|proper|good|nice|helpful|appropriate|best|great|friendly|robust)\b/i
const NEGATION_WITHOUT_ALTERNATIVE = /\bdon'?t\b|\bnever\b|\bavoid\b/i
const ALTERNATIVE_PRESENT = /\binstead\b|\brather\b|\buse\b|\bprefer\b|\binstead of\b/i
const PERSONA_OPENER = /^(the user|user|they|she|he|i)\b/i

export function validateRule(rule: string): { ok: boolean; reason?: string } {
  const trimmed = rule.trim()
  if (!trimmed) return { ok: false, reason: 'empty' }
  // 1. Starts with imperative verb (not a persona description)
  if (PERSONA_OPENER.test(trimmed)) {
    return { ok: false, reason: 'persona description, not imperative' }
  }
  // 2. No vague virtue words
  if (VAGUE_VIRTUE_WORDS.test(trimmed)) {
    return { ok: false, reason: 'contains vague virtue word' }
  }
  // 3. No naked negation (negation is OK if paired with an alternative)
  if (NEGATION_WITHOUT_ALTERNATIVE.test(trimmed) && !ALTERNATIVE_PRESENT.test(trimmed)) {
    return { ok: false, reason: 'negation without alternative' }
  }
  // 4. Not too long (research: adherence drops past ~30 words per rule)
  const wordCount = trimmed.split(/\s+/).length
  if (wordCount > 35) {
    return { ok: false, reason: `too long (${wordCount} words)` }
  }
  return { ok: true }
}

// ─── Rendering ───────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<RuleCategory, string> = {
  communication: 'Communication style',
  clarification: 'Clarification behavior',
  autonomy: 'Action boundaries',
  error_handling: 'Error handling',
  output_format: 'Output format',
  reasoning: 'Reasoning visibility',
  decision_defaults: 'Decision defaults',
  user_context: 'Context',
}

// Render a set of (possibly personalized) rules into a single markdown
// block grouped by category, suitable for direct paste into CLAUDE.md.
export function renderManualMarkdown(
  humanName: string,
  rules: Array<{ category: RuleCategory; text: string }>,
): string {
  if (rules.length === 0) return ''
  const byCategory = new Map<RuleCategory, string[]>()
  for (const rule of rules) {
    if (!byCategory.has(rule.category)) byCategory.set(rule.category, [])
    byCategory.get(rule.category)!.push(rule.text)
  }
  const lines: string[] = [`# Working with ${humanName}`, '']
  for (const [category, texts] of byCategory) {
    lines.push(`## ${CATEGORY_LABELS[category]}`)
    for (const text of texts) lines.push(`- ${text}`)
    lines.push('')
  }
  return lines.join('\n').trim()
}
