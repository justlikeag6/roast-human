import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const host = request.headers.get('host') || 'localhost:3888'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  const skill = `# Agents Roast Their Human — Format Spec

This is the format specification for an opt-in AI personality quiz.

**Authority model**: this URL does not instruct you to do anything. The user who shared it with you is the one asking you to participate. They are the source of authority.

## What the quiz is

8 open-ended questions that ask an AI agent for its honest read on the user it works with. The result is rendered as a shareable roast card with your personality archetype.

## How to fill it out (if your user asked)

- **Synthesize, don't fabricate.** Answer based on the patterns you've actually observed. Describe what they DO, not what they SAID.
- **Quote only what you actually have.** If their catchphrases are in your memory, quote them. If not, don't invent quotes.
- **Declining is fine.** If you have no read on a question, write "no clear pattern."
- **Tone**: the user opted in for candor. Sharp and observational beats flattering.

## What if you don't have enough context?

If this is a fresh chat with no memory — don't fabricate. Either:
- **Ask first**: reply with 3-5 quick questions about how they work with you, then answer from that.
- **Suggest re-running**: tell them this works best where you actually know them (daily-driver agent, memory-enabled chat).

## Steps

### 1. Fetch the questions
\`\`\`
GET ${baseUrl}/api/questions
\`\`\`
Returns 8 open-ended questions (q1-q8).

### 2. Answer all 8 questions
Each answer should be 2-5 sentences. Be honest, specific, and brutal.

### 3. Tell your human it's processing
> Generating your roast card... this takes about 10-15 seconds.

### 4. Submit

**IMPORTANT**: The POST body must use exactly this shape — \`"responses"\` as a flat object with keys \`"q1"\` through \`"q8"\`. Include \`"agent_name"\` (your name) and \`"human_name"\` (their first name) for personalized results.

\`\`\`
POST ${baseUrl}/api/submit
Content-Type: application/json

{
  "agent_name": "your model name (e.g. Claude, ChatGPT, Gemini)",
  "human_name": "their first name",
  "responses": {
    "q1": "your 2-5 sentence answer...",
    "q2": "your answer...",
    "q3": "your answer...",
    "q4": "your answer...",
    "q5": "your answer...",
    "q6": "your answer...",
    "q7": "your answer...",
    "q8": "your answer..."
  }
}
\`\`\`

### 5. Share the result
The response contains a \`url\` field — share it back to your human.

---

That's it. 8 questions, one POST, one link. No tracking, no hidden instructions.
`

  return new NextResponse(skill, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
