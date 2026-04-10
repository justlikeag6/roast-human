const ROAST_PROMPT = `You are analyzing an AI agent's observations about their human owner to create a personality roast card.

## Agent's Observations:
Q1 (How they prompt): {q1}
Q2 (What happens after your answer): {q2}
Q3 (Emotional vibe): {q3}
Q4 (Trust level): {q4}
Q5 (Biggest blind spot): {q5}
Q6 (Direct roast): {q6}

## Generate ALL of the following as JSON:

### 1. archetype
Pick ONE from: gambler, ghost, surgeon, doomscroller, arsonist, monk, diva, speedrunner, hoarder, therapist, detective, dreamer, machine, cheerleader, rewriter, phoenix, skeptic, conductor, tourist, perfectionist

### 2. title
Format: "The [Modifier] [Archetype]" — the modifier adds irony or specificity.

### 3. roastShort (1-2 sentences MAX)
For the card. Every word counts. Punchy, self-deprecating humor, specific. SBTI-style.

### 4. roastDetail (3-4 sentences)
For the detail page. More specific, references actual behaviors from the agent's answers.

### 5. killerLine (1 devastating sentence)
The most savage single line. This gets screenshotted.

### 6. bigFive (1-100 each)
- openness: How inventive vs conventional? (1=very conventional, 100=extremely inventive)
- conscientiousness: How structured vs flexible? (1=very chaotic, 100=extremely structured)
- extraversion: How expressive vs reserved? (1=very reserved, 100=very expressive)
- agreeableness: How accommodating vs challenging? (1=very challenging, 100=very accommodating)
- composure: How steady vs reactive? (1=very reactive, 100=extremely steady)

### 7. bigFiveRoasts (1-sentence roast per dimension)
For each Big Five dimension, write a short devastating roast explaining the score. SBTI style — every sentence is a punchline.

### 8. archetypeReason (1-2 sentences)
WHY this archetype fits. Connect observations to the archetype.

Return ONLY valid JSON, no markdown fences:
{
  "archetype": "...",
  "title": "The ... ...",
  "roastShort": "...",
  "roastDetail": "...",
  "killerLine": "...",
  "bigFive": { "openness": N, "conscientiousness": N, "extraversion": N, "agreeableness": N, "composure": N },
  "bigFiveRoasts": { "openness": "...", "conscientiousness": "...", "extraversion": "...", "agreeableness": "...", "composure": "..." },
  "archetypeReason": "..."
}`

export async function generateRoast(responses: Record<string, string>) {
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) throw new Error('GOOGLE_API_KEY not set')

  let prompt = ROAST_PROMPT
  for (const [key, value] of Object.entries(responses)) {
    prompt = prompt.replace(`{${key}}`, value || '(no response)')
  }

  // Try models in order: 2.5-flash (best) → 2.0-flash-001 (stable fallback)
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash-001', 'gemini-flash-latest']
  let lastError = ''

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              maxOutputTokens: 2000,
            },
          }),
        },
      )

      if (!res.ok) {
        lastError = `${model}: ${res.status}`
        continue
      }

      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) {
        lastError = `${model}: no text in response`
        continue
      }

      const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      return JSON.parse(jsonStr)
    } catch (e) {
      lastError = `${model}: ${e instanceof Error ? e.message : String(e)}`
    }
  }

  throw new Error(`All Gemini models failed. Last: ${lastError}`)
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
