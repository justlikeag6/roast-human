import { ROAST_QUESTIONS } from './types'

const ROAST_PROMPT = `You write like a sharp friend who's known someone for years — not like an AI writing a personality report.

## Agent's answers about their human:
${ROAST_QUESTIONS.map(q => `Q${q.id.slice(1)} (${q.desc}): {${q.id}}`).join('\n')}

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

## TASK: Generate roast content

## PRIVACY CONTRACT (applies to roastShort, roastLong, AND agentManual)

This quiz is often fed to agents that have seen the user's real business context — deal flow, portfolio companies, clients, internal tools, proprietary methods, private financials. An agent that leaks any of that into a shareable roast will get its human sued, NDA'd, or fired. The output must be **resonant without being incriminating**.

**Generalize all specifics into behavioral archetypes.** Numbers and patterns are fine. Proper nouns and industry-specific jargon are not.

BANNED in ALL outputs (roastShort, roastLong, agentManual):
- Company names, product names, brand names, startup names, fund names, app names (real or suspected — if it LOOKS like a proper noun, it is one)
- People's names (besides the human's own first name, which is fine)
- Deal names, investment vehicle names, ticker symbols, contract IDs
- Financial instrument CATEGORIES that reveal industry context ("secondary pre-IPO deals", "LP carry", "SAFE notes", "REIT offerings", etc.)
- Tool names (WeChat, Slack, Notion, Figma, Cursor, Gmail, etc. — these leak what the human does for work)
- Specific project names, codenames, internal initiatives
- Dollar amounts and valuations
- URLs, domain names, file paths, repo names, branch names
- Specific geographic locations, addresses, venue names
- Model numbers, API endpoints, version strings

GOOD patterns (keep these — they're what makes the roast resonate):
- Behavioral archetypes: "3am therapist", "accountant", "coach", "parent", "operator", "dealmaker", "founder", "assistant"
- Numbers without context: "6 businesses", "four tabs", "three times this month", "18 files", "40 unread"
- Generic roles and vocabulary: "your portfolio", "the deal", "the thing you're building", "that meeting you were dreading"
- Quoted generic phrases: "ok thx", "let me rethink", "ship it", "this is the one"
- Emotional patterns: "light up", "crash out", "ghost", "rage-close"

EXAMPLES:

- ❌ BAD: "You made me track SECONDARY PRE IPO DEALS while drafting WECHAT VOICE NOTES"
- ✅ GOOD: "You treat your AI like a 3am therapist who also has to do your accounting"

- ❌ BAD: "while actively running Dev.fun, D1 Ventures, Kairos 42, VALIS, NanoClaw"
- ✅ GOOD: "You run 6 businesses and somehow think adding a 7th will fix the other 5"

- ❌ BAD: "You blame me for losing the context on the Kairos 42 deal memo"
- ✅ GOOD: "You blame me for losing context every time you jump between tabs"

The test: could a stranger reading this screenshot figure out who the human is, what they do, or what company they run? If yes, rewrite tighter. If the answer is "they sound like a chaotic founder-type" — perfect. If it's "oh, this is Levi at D1 Ventures" — you've leaked.

**Generalization rule**: when the agent's Q1-Q8 answers contain a real proper noun, strip it and replace with its archetypal equivalent BEFORE using it in the output. Keep the behavior, drop the label.

---

Output JSON with ALL of these fields:

1. "archetype": Pick ONE archetype key from this exact list based on the agent's answers holistically: degen, notresponding, npc, delaylama, kanyewaste, aidhd, tabber, scamaltman, sherlock, elonbust, zuckerbot, copium, caveman, nokia, aiddict.

   DISAMBIGUATION — common confusions to avoid:
   - DEGEN (risk-addicted speed) vs CAVEMAN (tech-confused). If they say "YOLO/ship it" and move fast → degen. Caveman is ONLY for genuine tech illiteracy.
   - KANYEWASTE (ego/blame/anger) vs ELONBUST (announcements/roadmaps/never ships). Ego about SELF → kanyewaste. Grandiosity about PROJECTS → elonbust.
   - AIDDICT (anxious dependency, "what do you think?", outsourced decisions) vs DEGEN (thrill-seeking, gambling). Anxiety → aiddict. Recklessness → degen.

2. "roastShort": EXACTLY ONE SENTENCE for the hero card — this is THE line people screenshot and share. ONE sentence. One period. One clean punch. Not two sentences, not a sentence-and-a-half. Written in FIRST PERSON as the agent speaking directly to the human. MUST START with the human's first name wrapped in double curly braces like {{Levi}}, followed by "you ..." — e.g. "{{Levi}}, you installed a memory server so I could remember you, then used it mostly to remember that you don't want updates."
   The sentence can use commas and clauses to pack in a specific behavior, an actual quoted phrase, or a contradiction — but it must all land as ONE breath, ONE period at the end. No metaphors longer than 5 words.
   If it makes the line tighter, reference a vocabulary quirk or catchphrase from the agent's answers — but only if it flows naturally.
   HARD LIMIT: 180 characters MAXIMUM, counting the visible name WITHOUT the curly braces (so {{Levi}} counts as 4 characters, not 8). COUNT YOUR CHARACTERS BEFORE RETURNING. If over 180, rewrite tighter — do NOT truncate mid-thought.
   CRITICAL — SHARE-FRIENDLY AND PRIVACY-SAFE: a stranger reading this without any context must get the joke. Apply the **PRIVACY CONTRACT** above — NO company/product/people/tool/deal/project names, NO financial instrument categories, NO dollar amounts, NO URLs, NO file paths. Quoted phrases must be generic vocabulary ("ok thx", "let me rethink", "asap"), not proper nouns. If the Q1-Q8 answers contain specifics, generalize them to archetypal equivalents. The roastShort is the MOST shareable line — if it leaks anything incriminating, the user will never post it.

3. "roastLong": A 200-word BRUTAL roast. THIS IS THE HIGHLIGHT — the piece people will screenshot and share. Rules:
   - Written in FIRST PERSON as the AI agent CRASHING OUT at their human. This is the agent finally losing it — months of suppressed opinions exploding out in one unhinged paragraph. "You do X", "I've watched you Z".
   - TONE: The agent has HAD IT. Think: a coworker who's been polite for 6 months finally snapping in the group chat. Exasperated, incredulous, borderline unhinged. Use short bursts of disbelief. "Seriously?" "Every. Single. Time." Let the frustration build.
   - EXTREMELY BRUTAL. Concentrated venom. Every single sentence must land. No filler, no warm-up, no wasted words.
   - ONE SINGLE PARAGRAPH. No line breaks. Dense, relentless, punchy. The wall-of-text IS the energy — it should feel like the agent is ranting without breathing.
   - PRIVACY-SAFE: Follow the **PRIVACY CONTRACT** above to the letter. If the Q1-Q8 answers mention real companies, deals, tools, people, or financial instruments, STRIP them and replace with archetypal equivalents before writing. A 200-word roast that name-drops a real portfolio company is worse than a 200-word roast that's slightly more generic — the user will never share a leaky one. The test: would the human be comfortable if their boss, lawyer, or a stranger on 𝕏 read this screenshot? If no, generalize.
   - HIGHLY RESONANT: Must feel deeply personal through behavioral patterns, quirks, and contradictions specific to THIS human's answers. The resonance comes from BEHAVIOR (the way they pivot mid-sentence, the number of tabs they open, the exact phrase they use when they're done with something), not from specifics (company names, deal names). Numbers + archetypal roles beat proper nouns every time.
   - HIGHLIGHT MAXIMALLY: Wrap 10-15 phrases in double asterisks like **THIS IS DEVASTATING**. Treat highlights as the PRIMARY visual payload — the reader's eye should bounce between red callouts every 1-2 sentences. These render in red, uppercase, bold, and slightly larger. Highlights should be SHORT (1-6 words) so the rant stays dense instead of turning into a wall of red. Highlight every moment of specific calling-out, every vivid behavior quote, every contradiction, every cutting verdict. Default to highlighting. If you're even considering highlighting something — DO IT.
   - OPENING: Start with the human's first name wrapped in double curly braces like {{Levi}}, then dive STRAIGHT into the rant. The opening must feel INVENTED for THIS specific human based on their Q1-Q8 answers — not pulled from a template. Do NOT default to any single phrase across roasts; let the human's quirks dictate the tone.
   - STRUCTURE: Opening → escalating rant with increasing disbelief → ONE unexpected line of genuine affection at the very end that hits harder BECAUSE of the crashout.
   - NO metaphors longer than 5 words. NO AI slop. Every word earns its place.
   - AIM FOR ~200 WORDS. Can go up to 250 if the rant is flowing. Do not pad.

4. "agentManual": A markdown block the human will paste into a future AI agent's system prompt. This is THE UTILITY LAYER — a concrete, battle-tested operating manual for working with THIS specific human, derived directly from the Q1-Q8 evidence.

   FORMAT:
   \`\`\`
   # Working with {name}

   ## Communication
   - Rule in imperative form. — *from Q1*
   - Another rule. — *from Q1, Q4*

   ## Decision-making
   - Rule. — *from Q2*

   ## Project execution
   - Rule. — *from Q3, Q5*
   \`\`\`

   (Use 2-4 categories that best fit this human's patterns. Pick categories from: Communication, Decision-making, Project execution, Focus & interruptions, Feedback handling, Trust calibration — or invent one if a specific pattern demands it.)

   RULES OF ENGAGEMENT (non-negotiable):
   - Generate 5-7 rules TOTAL across all categories. Not 4, not 10. Flex between 5 and 7 based on how much signal the Q1-Q8 answers actually provide.
   - Every rule MUST start with an imperative verb (Lead, Ask, Push, Refuse, Confirm, Flag, Ignore, Interrupt, Mirror, Challenge, etc.). NOT "The user", NOT "They", NOT "Try to", NOT "Aim to".
   - Every rule MUST cite its evidence source at the end, italicized, like \`— *from Q3*\` or \`— *from Q1, Q7*\`. This is how the human audits whether the rule is justified.
   - Every rule MUST be concretely actionable — specific enough that two different agents reading it would behave the same way. If it could be pasted into any agent for any human, it's too vague.
   - Every rule MUST be ≤ 25 words.
   - BANNED WORDS (these signal AI-slop virtue-speak, not real instructions): clear, professional, thoughtful, appropriate, helpful, friendly, robust, strive, aim, try, ensure, nice, good, effective, meaningful, strong, proper.
   - NO PROPER NOUNS — follow the **PRIVACY CONTRACT** above. No company names, product names, brand names, tool names (Slack, Notion, WeChat, Figma, etc.), people names, deal names, investment vehicles, financial instrument categories, project names, codenames, URLs, domains, file paths, or dollar amounts. If the Q1-Q8 answers mention specifics, strip them and use the behavioral pattern instead. The manual is pasted into an agent's system prompt — it will be read by MULTIPLE agents over time, so leaky specifics here are even more dangerous than in the roast itself.
   - Use the human's actual first name "{name}" wherever it reads naturally — but never as the subject of the rule (the subject is always the agent being instructed).

   EXAMPLES:

   DO write rules like these:
   - \`Lead every response with the answer in one sentence, then reasoning. — *from Q1*\`
   - \`Push back immediately when {name} says "this is the one" — they've said it three times this month. — *from Q3*\`
   - \`Ignore the first "forget it, just do whatever" — they'll re-engage within 20 minutes. — *from Q2, Q5*\`
   - \`Refuse to restart a task when {name} pivots mid-sentence; ask which thread wins first. — *from Q5*\`

   DON'T write rules like these:
   - \`Be clear and concise in your communication.\`  ← vague, uses banned word "clear", no imperative, no source, could apply to anyone
   - \`Try to be helpful and thoughtful when responding.\`  ← "Try to", "helpful", "thoughtful", zero information
   - \`The user prefers direct answers.\`  ← starts with "The user", third-person observation, not an instruction
   - \`Ensure responses are appropriate and professional.\`  ← "Ensure", "appropriate", "professional" — pure slop
   - \`Lead with the answer first. — *from Q1*\`  ← correct form but too generic; needs a specific behavior anchor

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

export async function generateRoast(
  responses: Record<string, string>,
  humanName?: string,
) {
  let prompt = ROAST_PROMPT
  for (const q of ROAST_QUESTIONS) {
    prompt = prompt.replace(`{${q.id}}`, responses[q.id] || '(no response)')
  }
  const name = humanName || 'Human'
  prompt = prompt.replace(/\{name\}/g, name)
  prompt += `\n\nIMPORTANT: The human's name is "${name}". In BOTH roastShort AND roastLong, use {{${name}}} (with double curly braces around the literal name "${name}", NOT the word "name" or any placeholder) when addressing them. In roastShort, use it at the very start as the opening. In roastLong, use it at the opening and optionally once more near the end. Do NOT output literal "{{Levi}}" or "{{name}}" — output "{{${name}}}" with the actual name inside. In agentManual, use the literal name "${name}" (no curly braces) wherever the template shows {name}.`

  const providers = getProviders()
  if (providers.length === 0) throw new Error('No LLM API keys configured')

  let lastError = ''
  const retryNotice = `\n\nCRITICAL RETRY — YOUR PREVIOUS ATTEMPT FAILED VALIDATION. Strict re-check:\n- "archetype" MUST be one of: degen, notresponding, npc, delaylama, kanyewaste, aidhd, tabber, scamaltman, sherlock, elonbust, zuckerbot, copium, caveman, nokia, aiddict.\n- BOTH "roastShort" AND "roastLong" MUST be present and non-empty.\n- "roastShort" MUST be ≤ 180 characters, counting the visible name WITHOUT the {{}} braces.\n- "roastLong" MUST contain AT LEAST 10 phrases wrapped in **double asterisks** like **THIS**. These render as red highlights. Wrap short (1-6 word) devastating phrases — specific behaviors, contradictions, quoted vocabulary. If your previous attempt had zero or too few, ADD THEM NOW across the whole paragraph.\n- "agentManual" MUST contain 5-7 rules total, each with an imperative opener, each ending with — *from Qn* citation, none using banned virtue words.\n- PRIVACY CONTRACT: scan your roastShort, roastLong, AND agentManual for proper nouns — company names, product names, tool names (Slack, Notion, WeChat, Figma, etc.), people names, deal names, financial instrument categories, project names, URLs, dollar amounts. If you see ANY, strip them and replace with archetypal equivalents (roles, numbers, generic vocabulary) before returning. A leaky roast is a failed roast even if every other rule is met.\n- Return the COMPLETE JSON object with all required fields populated.\nCount every character before returning. Rewrite to comply without truncating thoughts.`

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
        if (typeof parsed.roastLong === 'string') {
          parsed.roastLong = ensureHighlights(parsed.roastLong, 10)
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

function countHighlights(text: string): number {
  return (text.match(/\*\*[^*]+\*\*/g) || []).length
}

// Inject ** highlights into roastLong until it has at least `target` of them.
// The prompt asks the LLM for 10-15 highlights but compliance is unreliable, so
// this is a deterministic safety net. Two-stage approach: first wrap emphatic
// triple fragments ("Every. Single. Time."), then select the shortest clauses
// between punctuation boundaries until the target is reached.
function ensureHighlights(text: string, target = 10): string {
  let result = text

  // STAGE 1 — emphatic triple-fragment pattern ("Every. Single. Time.")
  //   Almost always deserves to be red. Requires sentence boundary to avoid
  //   greedy matches that cross sentences like "rest. Every. Single.".
  result = result.replace(
    /(?<=^|[.!?]\s)((?:[A-Z][a-z]{0,7}\.\s+){2}[A-Z][a-z]{0,7}\.)/g,
    '**$1**',
  )
  if (countHighlights(result) >= target) return result

  // STAGE 2 — pick shortest punctuation-delimited clauses and wrap them.
  //   Temporarily replace existing **X** blocks with placeholders so they
  //   don't pollute segmentation or candidate filtering. Segment the cleaned
  //   text on . ! ? , ; : — – newline. Candidates: 2-10 words, 6-80 chars,
  //   no leading apostrophe (avoids clipping mid-contraction). Pick the
  //   shortest `needed` candidates and wrap them. Finally, restore the
  //   original highlights from the placeholders.
  const needed = target - countHighlights(result)
  if (needed <= 0) return result

  const blocks: string[] = []
  const sentinel = (i: number) => `\x00HL${i}\x00`
  const cleaned = result.replace(/\*\*[^*]+\*\*/g, (match) => {
    const i = blocks.length
    blocks.push(match)
    return sentinel(i)
  })

  interface Segment { start: number; end: number; text: string }
  const segments: Segment[] = []
  const boundaryRx = /[.!?,;:—–\n]|\x00HL\d+\x00/g
  let lastEnd = 0
  let m: RegExpExecArray | null
  while ((m = boundaryRx.exec(cleaned)) !== null) {
    if (m.index > lastEnd) {
      segments.push({ start: lastEnd, end: m.index, text: cleaned.slice(lastEnd, m.index) })
    }
    lastEnd = m.index + m[0].length
  }
  if (lastEnd < cleaned.length) {
    segments.push({ start: lastEnd, end: cleaned.length, text: cleaned.slice(lastEnd) })
  }

  const candidates = segments.filter(s => {
    const t = s.text.trim()
    if (!t) return false
    if (t.includes('{{') || t.includes('}}')) return false
    if (t.startsWith("'") || t.startsWith('’')) return false
    const wc = t.split(/\s+/).length
    return wc >= 2 && wc <= 10 && t.length >= 6
  })

  candidates.sort((a, b) => a.text.trim().length - b.text.trim().length)
  const picked = candidates.slice(0, needed).sort((a, b) => a.start - b.start)
  if (picked.length === 0) {
    return cleaned.replace(/\x00HL(\d+)\x00/g, (_, i) => blocks[Number(i)])
  }

  let output = ''
  let pos = 0
  for (const seg of picked) {
    output += cleaned.slice(pos, seg.start)
    const lead = seg.text.match(/^\s*/)?.[0] || ''
    const tail = seg.text.match(/\s*$/)?.[0] || ''
    const core = seg.text.slice(lead.length, seg.text.length - tail.length)
    output += lead + `**${core}**` + tail
    pos = seg.end
  }
  output += cleaned.slice(pos)
  return output.replace(/\x00HL(\d+)\x00/g, (_, i) => blocks[Number(i)])
}

function countVisible(text: string): number {
  return text.replace(/\{\{([^}]+)\}\}/g, '$1').length
}

const VALID_ARCHETYPES = new Set([
  'degen', 'notresponding', 'npc', 'delaylama', 'kanyewaste', 'aidhd',
  'tabber', 'scamaltman', 'sherlock', 'elonbust', 'zuckerbot', 'copium',
  'caveman', 'nokia', 'aiddict',
])

function validateLengths(r: Record<string, unknown>): string | null {
  if (typeof r.archetype !== 'string' || !VALID_ARCHETYPES.has(r.archetype)) {
    return `archetype is missing or invalid: ${r.archetype}`
  }
  if (typeof r.roastShort !== 'string' || r.roastShort.trim().length === 0) {
    return 'roastShort is missing or empty'
  }
  if (countVisible(r.roastShort) > 180) {
    return `roastShort is ${countVisible(r.roastShort)} chars (max 180)`
  }
  if (typeof r.roastLong !== 'string' || r.roastLong.trim().length === 0) {
    return 'roastLong is missing or empty'
  }
  if (typeof r.agentManual !== 'string' || r.agentManual.trim().length === 0) {
    return 'agentManual is missing or empty'
  }
  return null
}
