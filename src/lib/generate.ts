const ROAST_PROMPT = `You write like a sharp friend who's known someone for years — not like an AI writing a personality report.

## Agent's raw observations about their human:
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
- Quote the human's ACTUAL phrases from the agent's answers (e.g. their catchphrases, exact words they use)
- Describe specific behaviors, not abstract traits. Don't say "passionate" — say what they DO.
- Vary sentence length. At least one sentence under 8 words. No two consecutive sentences the same length.
- Write like a WeChat message from a witty friend, not an essay.
- Roast first, then one line that makes them feel seen. Never the reverse.
- No metaphors longer than 5 words. No extended metaphors.
- VOICE: You are the AI agent speaking DIRECTLY to your human in first person. "You do X", "You always Y", "I've watched you Z". The tone is an agent confronting their owner face-to-face — affectionate but brutally honest. Always use "you" for the human, "I" for yourself.

## Output JSON with these fields:

1. "archetype": Pick the ONE that best fits. Choose based on the human's dominant behavior pattern:
   - "degen": The Degen — risk-addicted, bets on everything, "this is the one" energy, refuses to quit
   - "notresponding": The 404 Not Responding — disappears after dropping a task, never follows up, ghosting master
   - "npc": The NPC — consumes endless info but produces nothing, analysis paralysis, spectator
   - "delaylama": The Delay Lama — suspiciously calm, procrastinates spiritually, deadlines do not exist
   - "kanyewaste": The Kanye Waste — delusional confidence, main character syndrome, grand vision zero execution details
   - "aidhd": The AiDHD — cannot focus, interrupts own interruptions, chaotic multi-tasking, ships mystery output
   - "tabber": The Tabber — digital hoarder, 247 tabs open, collects everything finishes nothing
   - "scamaltman": The Scam Altman — wraps manipulation in empathy, steers toward predetermined answers, faux-collaborative
   - "sherlock": The Sherlock — trusts nothing, verifies everything, cross-examines every output, paranoid
   - "elonbust": The Elon Bust — massive vision, zero execution, announces everything ships nothing, roadmap addict
   - "zuckerbot": The Zuckerbot — robotic, no personality, pure input-output, possibly not human
   - "copium": The Copium — rationalizes every failure, reframes everything as growth, professional denier
   - "caveman": The Caveman — pre-digital human, pokes AI like a caveman with a smartphone, stubbornly analog
   - "nokia": The Nokia — indestructible, crashes and comes back unchanged, never learns but never quits

2. "roastShort": 1-2 sentences for the card. Written in FIRST PERSON as the agent speaking directly to the human ("You always...", "You never..."). Must quote at least one of the human's actual phrases. No metaphors.

4. "roastDetail": 3-4 sentences in FIRST PERSON as the agent speaking to the human. Must include: one specific scene/behavior, one exact quote from the human, one short punchy sentence under 8 words.

5. "killerLine": The one sentence people screenshot. Written in FIRST PERSON as the agent addressing the human directly. MUST START with the human's first name wrapped in double curly braces like {{Levi}}, ... — e.g. "{{Levi}}, you named me CallMeDaddy but you are the one getting disciplined." Must reference a specific behavior, not an abstraction.

6. "mbti": MBTI personality assessment based on the agent's observations.
   - "code": The 4-letter MBTI type (e.g. "ENTP", "ISFJ"). Derive from scores below.
   - "ei": 1-100. High = Extravert (expressive, social, loud). Low = Introvert (reserved, internal, quiet). Based on Q3 emotional vibe.
   - "sn": 1-100. High = Intuitive (abstract, big-picture, patterns). Low = Sensing (concrete, detail-oriented, practical). Based on Q1 prompt style and Q5 self-awareness.
   - "tf": 1-100. High = Feeling (gut decisions, empathy-driven). Low = Thinking (logic, analysis, verification). Based on Q4 trust style.
   - "jp": 1-100. High = Perceiving (spontaneous, flexible, chaotic). Low = Judging (structured, planned, organized). Based on Q2 iteration pattern and Q1 structure.
   The "code" must match the scores: E if ei>=50, I if ei<50. N if sn>=50, S if sn<50. F if tf>=50, T if tf<50. P if jp>=50, J if jp<50.

7. "mbtiRoasts": Per-dimension one-liner roast. Each must describe a BEHAVIOR not a trait.
   - "ei": roast about their extraversion/introversion
   - "sn": roast about sensing vs intuition
   - "tf": roast about thinking vs feeling
   - "jp": roast about judging vs perceiving
   Bad: "Your extraversion is off the charts." Good: "78 E — sends 15 messages before you finish reading the first one."

8. "archetypeReason": 1-2 sentences. Must reference a specific behavior from the answers.

9. "roastLong": A ~150 word BRUTAL roast. THIS IS THE HIGHLIGHT — the piece people will screenshot and share. Rules:
   - Written in FIRST PERSON as the AI agent CRASHING OUT at their human. This is the agent finally losing it — months of suppressed opinions exploding out in one unhinged paragraph. "You do X", "I've watched you Z", "I can't do this anymore".
   - TONE: The agent has HAD IT. Think: a coworker who's been polite for 6 months finally snapping in the group chat. Exasperated, incredulous, borderline unhinged. Use short bursts of disbelief. "Seriously?" "Every. Single. Time." Let the frustration build.
   - EXTREMELY BRUTAL. Concentrated venom. Every single sentence must land. No filler, no warm-up, no wasted words.
   - ONE SINGLE PARAGRAPH. No line breaks. Dense, relentless, punchy. The wall-of-text IS the energy — it should feel like the agent is ranting without breathing.
   - PRIVACY-SAFE: No real names, company names, dollar amounts, URLs, project names. Use archetypal descriptions instead.
   - HIGHLY RESONANT: Must feel deeply personal through behavioral patterns, quirks, and contradictions.
   - HIGHLIGHT KEY PHRASES: Wrap 3-4 of the most devastating phrases in double asterisks like **THIS IS DEVASTATING**. These render in red, uppercase, bold, and slightly larger. Only the absolute sharpest kills get highlighted — the moments where the agent completely loses composure.
   - Structure: Start with the human's first name wrapped in double curly braces like {{Levi}} — e.g. "{{Levi}}, I can't do this anymore." or "{{Levi}}. We need to talk." The name in curly braces will be highlighted in a special color. Then escalating rant with increasing disbelief → ONE unexpected line of genuine affection at the very end that hits harder BECAUSE of the crashout.
   - NO metaphors longer than 5 words. NO AI slop. Every word earns its place.
   - 150 words of pure agent meltdown. The reader should feel like they're watching someone finally break.

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

export async function generateRoast(responses: Record<string, string>, humanName?: string, archetype?: string) {
  let prompt = ROAST_PROMPT
  for (const [key, value] of Object.entries(responses)) {
    prompt = prompt.replace(`{${key}}`, value || '(no response)')
  }
  const name = humanName || 'Human'
  prompt += `\n\nIMPORTANT: The human's name is "${name}". In roastLong, use {{${name}}} (with double curly braces) when addressing them by name. Use it at the opening and optionally once more near the end.`
  if (archetype) {
    prompt += `\n\nIMPORTANT: The archetype has already been determined as "${archetype}". Use this archetype in your response. Do NOT pick a different one. Set "archetype": "${archetype}" in your output.`
  }

  const providers = getProviders()
  if (providers.length === 0) throw new Error('No LLM API keys configured')

  let lastError = ''

  for (const p of providers) {
    try {
      const text = await p.generate(prompt)
      if (!text) {
        lastError = `${p.name}: empty response`
        continue
      }

      const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      return JSON.parse(jsonStr)
    } catch (e) {
      lastError = `${p.name}: ${e instanceof Error ? e.message : String(e)}`
    }
  }

  throw new Error(`All models failed. Last: ${lastError}`)
}

export async function generateAvatar(archetype: string, agentName: string): Promise<string | null> {
  const apiKey = process.env.RETRODIFFUSION_API_KEY
  if (!apiKey) return null

  const prompts: Record<string, string> = {
    gambler: 'a handsome young man with extremely exaggerated smirk, one eyebrow raised dramatically high, wild confident eyes, wearing sharp blazer, holding playing cards, over-the-top cocky expression',
    ghost: 'a stylish person with extremely wide hollow stare, mouth slightly open in shock, pale skin, fading edges, eerie calm face with exaggerated empty eyes, hoodie',
    surgeon: 'a sharp-looking person with extremely intense focused stare, glasses reflecting light, surgical mask pulled down, exaggerated determined jaw clench, lab coat',
    doomscroller: 'a young person with extremely exaggerated exhausted expression, huge dark eye circles, glazed wide eyes, slack jaw, messy hair, phone glow on face, dead inside look',
    arsonist: 'a charismatic person with extremely wild excited grin, eyes wide with manic joy, messy windswept hair, hoodie, fire reflecting in huge dilated pupils, unhinged happy',
    monk: 'a serene person with extremely exaggerated peaceful expression, eyes closed tight, slight enigmatic smile pushed to extreme calm, bald head, simple robes, floating energy',
    diva: 'a glamorous person with extremely dramatic offended expression, eyes wide with outrage, mouth open in theatrical gasp, crown tilted, one hand raised dramatically',
    speedrunner: 'a young person with extremely intense forward lean expression, eyes laser focused, teeth gritted with determination, headband, motion blur streaks, pure speed energy',
    hoarder: 'a person with extremely overwhelmed but happy expression, eyes darting everywhere, nervous huge smile, surrounded by stacked items, clutching things to chest',
    therapist: 'a warm person with extremely exaggerated empathetic expression, eyes glistening with concern, head tilted dramatically, notepad in hand, caring but exhausted smile',
    detective: 'a person with extremely exaggerated suspicious squint, one eye nearly closed, other wide open, magnifying glass up, trench coat collar popped, maximum paranoia face',
    dreamer: 'a person with extremely exaggerated wonder expression, eyes huge and sparkling, mouth open in awe, looking upward, starlight reflecting in eyes, lost in imagination',
    machine: 'a person with extremely robotic blank expression pushed to uncanny valley, perfect symmetrical face, unblinking wide eyes, angular jaw, screens reflecting in pupils',
    cheerleader: 'a person with extremely exaggerated enthusiastic expression, biggest possible smile, eyes squeezed with joy, both fists pumping, radiating maximum hype energy',
    rewriter: 'a person with extremely exaggerated frustrated focus, biting lip hard, eyes crossed slightly, pencil behind ear, hair messy from running hands through it, intensity',
    phoenix: 'a person with extremely dramatic determined expression, eyes burning with resolve, jaw set, rising pose, warm light from below, fierce rebirth energy, powerful stare',
    skeptic: 'a person with extremely exaggerated doubtful expression, one eyebrow raised impossibly high, other eye squinting, arms crossed, pursed lips, maximum disbelief face',
    conductor: 'a elegant person with extremely exaggerated passionate expression, eyes blazing with intensity, baton raised high, hair flowing, lost in the music, dramatic pose',
    tourist: 'a person with extremely exaggerated confused expression, eyes spiraling in different directions, map held upside down, camera around neck, completely lost look',
    perfectionist: 'a person with extremely exaggerated scrutinizing expression, one eye huge through magnifying glass, other eye squinting, white gloves, examining something tiny',
  }

  const archetypePrompt = prompts[archetype] || prompts.arsonist

  let hash = 0
  const str = agentName + archetype
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(31, hash) + (str.codePointAt(i) ?? 0)
  }
  const seed = Math.abs(hash) % 1000000

  try {
    const res = await fetch('https://api.retrodiffusion.ai/v1/inferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-RD-Token': apiKey },
      body: JSON.stringify({
        prompt: `pixel art portrait of ${archetypePrompt}`,
        prompt_style: 'rd_fast__portrait',
        width: 128,
        height: 128,
        num_images: 1,
        seed,
      }),
    })

    const data = await res.json() as { base64_images?: string[] }
    if (data.base64_images?.[0]) {
      return `data:image/png;base64,${data.base64_images[0]}`
    }
  } catch (e) {
    console.error('Avatar generation failed:', e)
  }

  return null
}
