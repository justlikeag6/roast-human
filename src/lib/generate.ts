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
- VOICE: You are the AI agent describing your human in third person. "He does X", "She always Y", "They think Z but actually...". Never use "you" — always "he/she/they". The tone is an agent gossiping about their owner behind their back — affectionate but brutally honest.

## Output JSON with these fields:

1. "archetype": ONE of: speedrunner, arsonist, yolo, therapist, outsourcer, npc, yapper, cheerleader, maincharacter, doomscroller, lurker, ghost, overthinker, rewriter, hallucinationhunter, dreamer, perfectionist, phoenix

Archetype meanings (pick the best fit):
- speedrunner: ships first answer immediately, no revision
- arsonist: tears everything down and rebuilds from scratch
- yolo: zero context in prompts, maximum expectations
- therapist: uses AI as emotional support
- outsourcer: delegated all thinking to AI, kept the opinions
- npc: follows AI output without question, zero agency
- yapper: sends 47 messages before AI finishes responding
- cheerleader: "amazing!" but hasn't read the output
- maincharacter: every prompt is a 3-act personal narrative
- doomscroller: asks everything, acts on nothing
- lurker: reads every response, implements zero
- ghost: sends prompt, vanishes, never returns
- overthinker: 3 hours of prompt engineering for a 5-min task
- rewriter: rewrites AI output word by word
- hallucinationhunter: "source?" "verify that" on every response
- dreamer: grand prompts, zero follow-through
- perfectionist: it's never done, just another iteration
- phoenix: only opens AI when everything is already on fire

2. "title": "The [Modifier] [Archetype]" — modifier adds irony. Under 5 words total.

3. "roastShort": 1-2 SHORT sentences for the card, MAX 25 words total. English only. Third person ("He...", "She...", "They..."). ZERO metaphors, ZERO similes (no "like a", "as if", "similar to"). State what they DO, not what they are like. Can include catchphrases in original language.

4. "roastDetail": 3-4 sentences. Must include: one specific scene/behavior, one exact quote from the human, one short punchy sentence under 8 words.

5. "killerLine": The one sentence people screenshot. Must reference a specific behavior, not an abstraction.

6. "dims": 4 AI-observation dimensions. Score each 1-100:
   - "specVibe": How detailed are their prompts? 1=pure vibes ("make it good"), 100=legal-doc specs (bullet points, examples, constraints). Based on Q1.
   - "shipLoop": Do they accept first output or iterate? 1=ships immediately, 100=infinite revision loop. Based on Q2.
   - "warmCold": Emotional register with AI? 1=pure function (no greetings, no thanks), 100=treats AI like a friend (please, thanks, shares feelings). Based on Q3.
   - "trustDoubt": How much they trust AI output? 1=verifies everything ("source?"), 100=copy-pastes blindly. Based on Q4.

7. "dimRoasts": Per-dimension one-liner roast. Each must describe a BEHAVIOR not a trait.
   - "specVibe": roast about how they give instructions
   - "shipLoop": roast about their iteration behavior
   - "warmCold": roast about their emotional register with AI
   - "trustDoubt": roast about their trust level
   Bad: "Your trust level is high." Good: "92 Trust — would let AI drive their car off a cliff and say 'interesting route.'"

8. "archetypeReason": 1-2 sentences. Must reference a specific behavior from the answers.

Return ONLY valid JSON.`

interface OpenAICompatConfig {
  url: string
  key: string
  model: string
  name: string
}

function getProviders(): OpenAICompatConfig[] {
  const providers: OpenAICompatConfig[] = []

  if (process.env.OPENAI_API_KEY) {
    providers.push({
      url: 'https://api.openai.com/v1/chat/completions',
      key: process.env.OPENAI_API_KEY,
      model: 'gpt-4o-mini',
      name: 'openai',
    })
  }

  if (process.env.KIMI_API_KEY) {
    providers.push({
      url: 'https://api.moonshot.cn/v1/chat/completions',
      key: process.env.KIMI_API_KEY,
      model: 'moonshot-v1-8k',
      name: 'kimi',
    })
  }

  if (process.env.GOOGLE_API_KEY) {
    // Gemini via OpenAI-compatible endpoint
    providers.push({
      url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      key: process.env.GOOGLE_API_KEY,
      model: 'gemini-2.5-flash',
      name: 'gemini',
    })
  }

  return providers
}

export async function generateRoast(responses: Record<string, string>) {
  let prompt = ROAST_PROMPT
  for (const [key, value] of Object.entries(responses)) {
    prompt = prompt.replace(`{${key}}`, value || '(no response)')
  }

  const providers = getProviders()
  if (providers.length === 0) throw new Error('No LLM API keys configured')

  let lastError = ''

  for (const p of providers) {
    try {
      const res = await fetch(p.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${p.key}`,
        },
        body: JSON.stringify({
          model: p.model,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          max_tokens: 2000,
        }),
      })

      if (!res.ok) {
        lastError = `${p.name}/${p.model}: ${res.status}`
        continue
      }

      const data = await res.json()
      const text = data.choices?.[0]?.message?.content
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
    gambler: 'a confident risk-taker with dice and cards, smirking, wearing a blazer',
    ghost: 'a mysterious figure fading into transparency, ethereal, wearing a hood',
    surgeon: 'a precise focused character with glasses, lab coat, holding a scalpel',
    doomscroller: 'an exhausted character glued to a glowing phone screen, tired eyes',
    arsonist: 'a chaotic visionary holding a lit match, messy hair, hoodie, energetic eyes',
    monk: 'a peaceful zen master meditating, bald, serene expression, simple robes',
    diva: 'a dramatic character with a crown, expressive pose, sparkles around them',
    speedrunner: 'a lightning-fast character with motion blur, sneakers, headband',
    hoarder: 'a character surrounded by piles of boxes and documents, overwhelmed but happy',
    therapist: 'a warm empathetic character sitting on a couch, taking notes, kind smile',
    detective: 'a suspicious character with magnifying glass, trench coat, raised eyebrow',
    dreamer: 'a stargazing character floating among clouds and stars, peaceful expression',
    machine: 'a robotic efficient character, angular features, screens around them',
    cheerleader: 'an overly enthusiastic character with pom-poms, huge smile, sparkle eyes',
    rewriter: 'a character surrounded by crumpled papers, pencil behind ear, focused',
    phoenix: 'a character rising from flames, dramatic pose, fiery wings forming',
    skeptic: 'a doubtful character with one eyebrow raised, arms crossed, questioning look',
    conductor: 'a character with a baton directing invisible orchestra, elegant, composed',
    tourist: 'a wandering character with a map and camera, looking in every direction',
    perfectionist: 'a character polishing a diamond, magnifying glass, white gloves, intense focus',
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
