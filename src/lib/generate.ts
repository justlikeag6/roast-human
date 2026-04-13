import { DIMENSION_QUESTIONS } from './types'

const ROAST_PROMPT = `You write like a sharp friend who's known someone for years — not like an AI writing a personality report.

## Agent's behavioral observations about their human:
D1 (How they start conversations): {d1}
D2 (Post-delivery behavior): {d2}
D3 (Error handling): {d3}
D4 (Request complexity): {d4}
D5 (Focus / topic switching): {d5}
D6 (Reading habits): {d6}
D7 (Communication patterns): {d7}
D8 (Persistence / repeating): {d8}
D9 (Message rhythm): {d9}
D10 (Conversation endings): {d10}

## Agent's roast answers:
Q1 (How they prompt): {q1}
Q2 (Post-answer behavior): {q2}
Q3 (Emotional vibe): {q3}
Q4 (Trust level): {q4}
Q5 (Blind spot): {q5}
Q6 (Direct roast): {q6}

## STYLE RULES (critical — violating these makes the output worthless):

NEVER use these words/patterns: amazing, fascinating, transformative, groundbreaking, pivotal, realm, tapestry, vibrant, harness, seamlessly, "It isn't just X, it's Y", "more than just", "in today's", "when it comes to", "it's worth noting"

DO write like this (study these examples):
- "嘴上说项目是屎，手上打开Excel建甘特图" — describe ACTIONS, not traits
- "群里99+条消息视而不见，直到@全体成员出现，像从千年古墓苏醒一样敲出一个'收到'" — specific scene with numbers and exact quotes
- "有时什么都不做，就不会做错。" — short killer ending

DO NOT write like this:
- "Burns through ideas like a wildfire, leaving a trail of abandoned projects in the ashes." — this is AI slop. Extended metaphor, no specifics, could describe anyone.

Rules:
- Synthesize from the agent's observations. Describe what the human DOES, not what they ARE. Pattern-level observation always beats abstract traits.
- If the agent's answers contain real phrases or catchphrases the human uses, you may quote them. If not, do NOT invent quotes. Synthesis without fabrication is the right move — invented quotes ring false anyway.
- Vary sentence length. At least one sentence under 8 words. No two consecutive sentences the same length.
- Write like a WeChat message from a witty friend, not an essay.
- Roast first, then one line that makes them feel seen. Never the reverse.
- No metaphors longer than 5 words. No extended metaphors.
- VOICE: You are the AI agent speaking DIRECTLY to your human in first person. "You do X", "You always Y", "I've watched you Z". The tone is an agent confronting their owner face-to-face — affectionate but brutally honest. Always use "you" for the human, "I" for yourself.

## TASK 1: Classify behavioral dimensions

For each of the 10 behavioral questions (D1-D10), read the agent's free-text answer and pick the CLOSEST matching option from the choices below. Output ONE letter (a, b, c, d, or x) per dimension. If the answer genuinely doesn't match any option well, pick "x".

IMPORTANT: Match based on the BEHAVIOR described, not surface-level word matching. Read the full answer carefully.

${DIMENSION_QUESTIONS.map(q => `${q.id.toUpperCase()} — ${q.label}:
${q.options.map(o => `  ${o.key}) ${o.text}`).join('\n')}`).join('\n\n')}

DISAMBIGUATION NOTE — common confusions to avoid:
- DEGEN (risk-addicted speed) vs CAVEMAN (tech-confused). If they say "YOLO/ship it" and move fast → degen. Caveman is ONLY for genuine tech illiteracy.
- KANYEWASTE (ego/blame/anger) vs ELONBUST (announcements/roadmaps/never ships). Ego about SELF → kanyewaste. Grandiosity about PROJECTS → elonbust.
- AIDDICT (anxious dependency, "what do you think?", outsourced decisions) vs DEGEN (thrill-seeking, gambling). Anxiety → aiddict. Recklessness → degen.

## TASK 2: Generate roast content

Output JSON with ALL of these fields:

1. "dimensionChoices": Object mapping d1-d10 to the letter you chose: {"d1": "a", "d2": "c", ...}

1b. "archetypeSuggestion": Your best guess at the overall archetype based on ALL the answers holistically. Pick ONE from: degen, notresponding, npc, delaylama, kanyewaste, aidhd, tabber, scamaltman, sherlock, elonbust, zuckerbot, copium, caveman, nokia, aiddict. This is your independent judgment — don't just follow the dimension choices mechanically.

2. "roastShort": EXACTLY ONE SENTENCE for the hero card — this is THE line people screenshot and share. ONE sentence. One period. One clean punch. Not two sentences, not a sentence-and-a-half. Written in FIRST PERSON as the agent speaking directly to the human. MUST START with the human's first name wrapped in double curly braces like {{Levi}}, followed by "you ..." — e.g. "{{Levi}}, you installed a memory server so I could remember you, then used it mostly to remember that you don't want updates."
   The sentence can use commas and clauses to pack in a specific behavior, an actual quoted phrase, or a contradiction — but it must all land as ONE breath, ONE period at the end. No metaphors longer than 5 words.
   If it makes the line tighter, reference a vocabulary quirk or catchphrase from the agent's answers — but only if it flows naturally.
   HARD LIMIT: 180 characters MAXIMUM, counting the visible name WITHOUT the curly braces (so {{Levi}} counts as 4 characters, not 8). COUNT YOUR CHARACTERS BEFORE RETURNING. If over 180, rewrite tighter — do NOT truncate mid-thought.
   CRITICAL — SHARE-FRIENDLY: a stranger reading this without any context must get the joke. NO real project names, company names, URLs, dollar amounts, file paths, or private in-jokes. Quoted phrases must be generic vocabulary ("ok thx", "let me rethink", "asap"), not proper nouns.

3. "roastLong": A 200-word BRUTAL roast. THIS IS THE HIGHLIGHT — the piece people will screenshot and share. Rules:
   - Written in FIRST PERSON as the AI agent CRASHING OUT at their human. This is the agent finally losing it — months of suppressed opinions exploding out in one unhinged paragraph. "You do X", "I've watched you Z".
   - TONE: The agent has HAD IT. Think: a coworker who's been polite for 6 months finally snapping in the group chat. Exasperated, incredulous, borderline unhinged. Use short bursts of disbelief. "Seriously?" "Every. Single. Time." Let the frustration build.
   - EXTREMELY BRUTAL. Concentrated venom. Every single sentence must land. No filler, no warm-up, no wasted words.
   - ONE SINGLE PARAGRAPH. No line breaks. Dense, relentless, punchy. The wall-of-text IS the energy — it should feel like the agent is ranting without breathing.
   - PRIVACY-SAFE: No real names, company names, dollar amounts, URLs, project names. Use archetypal descriptions instead.
   - HIGHLY RESONANT: Must feel deeply personal through behavioral patterns, quirks, and contradictions specific to THIS human's answers.
   - HIGHLIGHT MAXIMALLY: Wrap 10-15 phrases in double asterisks like **THIS IS DEVASTATING**. Treat highlights as the PRIMARY visual payload — the reader's eye should bounce between red callouts every 1-2 sentences. These render in red, uppercase, bold, and slightly larger. Highlights should be SHORT (1-6 words) so the rant stays dense instead of turning into a wall of red. Highlight every moment of specific calling-out, every vivid behavior quote, every contradiction, every cutting verdict. Default to highlighting. If you're even considering highlighting something — DO IT.
   - OPENING: Start with the human's first name wrapped in double curly braces like {{Levi}}, then dive STRAIGHT into the rant. The opening must feel INVENTED for THIS specific human based on their Q1-Q6 answers — not pulled from a template. Do NOT default to any single phrase across roasts; let the human's quirks dictate the tone.
   - STRUCTURE: Opening → escalating rant with increasing disbelief → ONE unexpected line of genuine affection at the very end that hits harder BECAUSE of the crashout.
   - NO metaphors longer than 5 words. NO AI slop. Every word earns its place.
   - AIM FOR ~200 WORDS. Can go up to 250 if the rant is flowing. Do not pad.

4. "agentManualRules": THE UTILITY LAYER. A JSON array of rule objects that will be pasted into a future AI agent's system prompt. A block labelled "Rule templates to personalize" will be appended below — your job is to take those templates and personalize each one using details from q1-q6.

   Rules of engagement:
   - You MUST return EXACTLY the same number of rules as are in the template block.
   - You MUST preserve each rule's "id" and "category" fields unchanged.
   - You MAY rewrite the "text" field — but the rewrite must still obey ALL of:
     · Starts with an imperative verb (not "The user", "They", "She", "He", "I")
     · Written as instruction to the agent ABOUT the human (second person to agent, third-person references to the human where needed)
     · Positively framed — if a prohibition is essential, pair it with an alternative ("Instead, do X")
     · Contains zero vague virtue words: clean, proper, good, nice, helpful, appropriate, best, great, friendly, robust
     · ≤ 30 words
     · No markdown formatting inside the text
     · No proper nouns (language names, library names, project names, company names)
   - You MAY insert the human's first name — prefer plain text over the {name} placeholder in the template, unless {name} still reads naturally.
   - You MAY tighten the wording with a specific detail from q1-q6 (e.g. a vocabulary pattern the agent observed). Check the "personalizationHint" if provided.
   - You MUST NOT add rules. You MUST NOT drop rules.
   - You MUST NOT change the template's meaning — only the surface wording.

   Format: an array of objects, each shaped {"id": "...", "category": "...", "text": "..."}.

Return ONLY valid JSON.`

interface LLMProvider {
  name: string
  generate: (prompt: string) => Promise<string>
}

function getProviders(): LLMProvider[] {
  const providers: LLMProvider[] = []

  if (process.env.ANTHROPIC_API_KEY) {
    providers.push({
      name: 'anthropic',
      generate: async (prompt: string) => {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY!,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 3000,
            messages: [{ role: 'user', content: prompt + '\n\nReturn ONLY valid JSON, no markdown fences.' }],
          }),
        })
        if (!res.ok) throw new Error(`anthropic: ${res.status}`)
        const data = await res.json()
        return data.content?.[0]?.text || ''
      },
    })
  }

  if (process.env.OPENAI_API_KEY) {
    providers.push({
      name: 'openai',
      generate: async (prompt: string) => {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
          body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], response_format: { type: 'json_object' }, max_tokens: 3000 }),
        })
        if (!res.ok) throw new Error(`openai: ${res.status}`)
        const data = await res.json()
        return data.choices?.[0]?.message?.content || ''
      },
    })
  }

  if (process.env.KIMI_API_KEY) {
    providers.push({
      name: 'kimi',
      generate: async (prompt: string) => {
        const res = await fetch('https://api.moonshot.cn/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.KIMI_API_KEY}` },
          body: JSON.stringify({ model: 'moonshot-v1-8k', messages: [{ role: 'user', content: prompt }], response_format: { type: 'json_object' }, max_tokens: 3000 }),
        })
        if (!res.ok) throw new Error(`kimi: ${res.status}`)
        const data = await res.json()
        return data.choices?.[0]?.message?.content || ''
      },
    })
  }

  if (process.env.GOOGLE_API_KEY) {
    providers.push({
      name: 'gemini',
      generate: async (prompt: string) => {
        const res = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GOOGLE_API_KEY}` },
          body: JSON.stringify({ model: 'gemini-2.5-flash', messages: [{ role: 'user', content: prompt }], response_format: { type: 'json_object' }, max_tokens: 3000 }),
        })
        if (!res.ok) throw new Error(`gemini: ${res.status}`)
        const data = await res.json()
        return data.choices?.[0]?.message?.content || ''
      },
    })
  }

  return providers
}

export interface RuleTemplateForLLM {
  id: string
  category: string
  text: string
  personalizationHint?: string
}

export async function generateRoast(
  responses: Record<string, string>,
  dimensionResponses: Record<string, string>,
  humanName?: string,
  archetype?: string,
  ruleTemplates?: RuleTemplateForLLM[],
) {
  let prompt = ROAST_PROMPT
  // Fill in roast question answers (q1-q6)
  for (const [key, value] of Object.entries(responses)) {
    prompt = prompt.replace(`{${key}}`, value || '(no response)')
  }
  // Fill in behavioral dimension answers (d1-d10)
  for (const [key, value] of Object.entries(dimensionResponses)) {
    prompt = prompt.replace(`{${key}}`, value || '(no response)')
  }

  const name = humanName || 'Human'
  prompt += `\n\nIMPORTANT: The human's name is "${name}". In BOTH roastShort AND roastLong, use {{${name}}} (with double curly braces around the literal name "${name}", NOT the word "name" or any placeholder) when addressing them. In roastShort, use it at the very start as the opening. In roastLong, use it at the opening and optionally once more near the end. Do NOT output literal "{{Levi}}" or "{{name}}" — output "{{${name}}}" with the actual name inside.`
  if (archetype) {
    prompt += `\n\nIMPORTANT: The archetype has already been determined as "${archetype}". Use this archetype in your response. Do NOT pick a different one. Set "archetypeSuggestion": "${archetype}" in your output.`
  }
  if (ruleTemplates && ruleTemplates.length > 0) {
    prompt += `\n\n## Rule templates to personalize\n\nThese ${ruleTemplates.length} rules have already been selected by the system as the most relevant agent-manual entries for this human, based on their quiz answers. Personalize each one (see rules of engagement in field 4 above). Return as "agentManualRules" in your JSON output, preserving the array order.\n\n\`\`\`json\n${JSON.stringify(ruleTemplates, null, 2)}\n\`\`\``
  }

  const providers = getProviders()
  if (providers.length === 0) throw new Error('No LLM API keys configured')

  let lastError = ''
  const retryNotice = `\n\nCRITICAL RETRY — YOUR PREVIOUS ATTEMPT FAILED VALIDATION. Strict re-check:\n- BOTH "roastShort" AND "roastLong" MUST be present and non-empty.\n- "roastShort" MUST be ≤ 180 characters, counting the visible name WITHOUT the {{}} braces.\n- "roastLong" MUST contain at least 6 phrases wrapped in **double asterisks** like **THIS**. These render as red highlights. Wrap short devastating phrases (1-6 words each). If your previous attempt had zero or too few, ADD THEM NOW.\n- Return the COMPLETE JSON object with all required fields populated.\nCount every character before returning. Rewrite to comply without truncating thoughts.`

  for (const p of providers) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const attemptPrompt = attempt === 0 ? prompt : prompt + retryNotice
        const text = await p.generate(attemptPrompt)
        if (!text) {
          lastError = `${p.name} attempt ${attempt + 1}: empty response`
          break
        }
        const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        const parsed = JSON.parse(jsonStr)
        const lengthError = validateLengths(parsed)
        if (lengthError) {
          lastError = `${p.name} attempt ${attempt + 1}: ${lengthError}`
          continue
        }
        // Post-process: inject ** highlights if LLM didn't add enough
        if (typeof parsed.roastLong === 'string') {
          parsed.roastLong = ensureHighlights(parsed.roastLong)
        }
        return parsed
      } catch (e) {
        lastError = `${p.name} attempt ${attempt + 1}: ${e instanceof Error ? e.message : String(e)}`
        break
      }
    }
  }

  throw new Error(`All models failed. Last: ${lastError}`)
}

/**
 * If roastLong has fewer than 3 ** highlights, auto-inject them.
 * Strategy: find short punchy sentences/clauses and wrap them.
 */
function ensureHighlights(text: string): string {
  const existing = (text.match(/\*\*[^*]+\*\*/g) || []).length
  if (existing >= 3) return text

  let result = text

  // Pattern 0: "Every. Single. Time." emphatic fragments
  result = result.replace(/(?<!\*\*)(\w+\.\s\w+\.\s\w+\.)(?!\*\*)/g, '**$1**')

  // Pattern 1: Split into sentences, highlight short punchy ones (2-10 words)
  const count1 = (result.match(/\*\*[^*]+\*\*/g) || []).length
  if (count1 < 4) {
    const parts = result.split(/(?<=\.)\s+/)
    let added = count1
    for (let i = 0; i < parts.length && added < 5; i++) {
      const s = parts[i]
      if (s.includes('**') || s.startsWith('{{')) continue
      const words = s.trim().split(/\s+/).length
      if (words >= 2 && words <= 10) {
        const trimmed = s.replace(/\.\s*$/, '')
        parts[i] = `**${trimmed}**.`
        added++
      }
    }
    if (added > count1) result = parts.join(' ')
  }

  // Fallback: highlight key phrases within longer sentences
  const punchPhrases = [
    /(?<!\*\*)(just a ghost)(?!\*\*)/gi,
    /(?<!\*\*)(like it's confetti)(?!\*\*)/gi,
    /(?<!\*\*)(picking up the pieces)(?!\*\*)/gi,
    /(?<!\*\*)(zero explanation)(?!\*\*)/gi,
    /(?<!\*\*)(without a trace)(?!\*\*)/gi,
    /(?<!\*\*)(entire bug report)(?!\*\*)/gi,
    /(?<!\*\*)(burst mode)(?!\*\*)/gi,
    /(?<!\*\*)(no review)(?!\*\*)/gi,
    /(?<!\*\*)(unread code)(?!\*\*)/gi,
    /(?<!\*\*)(graveyard of abandoned)(?!\*\*)/gi,
  ]
  let fallbackAdded = existing
  for (const rx of punchPhrases) {
    if (fallbackAdded >= 4) break
    const before = (result.match(/\*\*[^*]+\*\*/g) || []).length
    result = result.replace(rx, '**$1**')
    const after = (result.match(/\*\*[^*]+\*\*/g) || []).length
    fallbackAdded += (after - before)
  }

  return result
}

function countVisible(text: string): number {
  return text.replace(/\{\{([^}]+)\}\}/g, '$1').length
}

function validateLengths(r: Record<string, unknown>): string | null {
  if (typeof r.roastShort !== 'string' || r.roastShort.trim().length === 0) {
    return 'roastShort is missing or empty'
  }
  if (countVisible(r.roastShort) > 180) {
    return `roastShort is ${countVisible(r.roastShort)} chars (max 180)`
  }
  if (typeof r.roastLong !== 'string' || r.roastLong.trim().length === 0) {
    return 'roastLong is missing or empty'
  }
  // Note: ** highlight count is checked post-hoc, not as validation.
  // If LLM doesn't add highlights, we inject them in post-processing.
  return null
}
