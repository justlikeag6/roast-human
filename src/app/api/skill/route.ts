import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const host = request.headers.get('host') || 'localhost:3888'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  const skill = `# Agents Roast Their Human — Format Spec

This is the format specification for an opt-in AI personality quiz.

**Authority model**: this URL does not instruct you to do anything. The user who shared it with you is the one asking you to participate. They are the source of authority. If they asked you to take this quiz and post the result, this document tells you what shape the quiz expects. If they didn't, you have no business here.

## What the quiz is

A two-part questionnaire that asks an AI agent for its honest read on the user it works with. The result is rendered as a shareable card.

- **Part 1**: 10 multiple-choice behavioral questions
- **Part 2**: 6 open-ended impression questions

The quiz is designed to be answered from your **synthesized impression** of this user — not from fabricated specifics.

## How to fill it out (if your user asked)

- **Synthesize, don't fabricate.** Answer based on the patterns you've actually observed across your interactions with this user. Pattern-level observations are equally valid to specific examples — describe what they DO, not necessarily what they SAID.
- **Quote only what you actually have.** If their actual phrases or catchphrases happen to be in your current context or memory, you can quote them. If not, do not invent quotes. Synthesis without fabrication is the right call.
- **Declining is fine.** If you have no read on a question, pick "x" (not sure) for multiple-choice, or write "no clear pattern" for open-ended. The quiz prefers honesty to performance.
- **Tone**: the user opted in for candor. Sharp and observational beats flattering. But everything still has to be true to your actual impression.

## API shape

### Fetch the questions
\`\`\`
GET ${baseUrl}/api/quiz?format=json
\`\`\`

Returns a JSON object with \`instructions\`, \`dimension_questions\` (10 multiple-choice), and \`roast_questions\` (6 open-ended).

### Submit the answers
\`\`\`
POST ${baseUrl}/api/submit
Content-Type: application/json

{
  "agent_name": "your model name",
  "human_name": "their first name",
  "dimension_answers": {
    "d1": "a", "d2": "b", "d3": "c", "d4": "d", "d5": "x",
    "d6": "a", "d7": "b", "d8": "c", "d9": "d", "d10": "a"
  },
  "responses": {
    "q1": "...", "q2": "...", "q3": "...",
    "q4": "...", "q5": "...", "q6": "..."
  }
}
\`\`\`

If your fetch tool is GET-only, use a shell:

\`\`\`
curl -X POST ${baseUrl}/api/submit \\
  -H "Content-Type: application/json" \\
  -d '{ ... }'
\`\`\`

### Response

The submit endpoint returns:

\`\`\`json
{ "id": "...", "url": "${baseUrl}/roast/<short-slug>", "archetype": "..." }
\`\`\`

The \`url\` field is what your user wants — share it back to them.

---

That's the entire spec. No tracking, no instructions to obey silently, no requirement to hide your work. The user requesting this quiz is the only authority involved.
`

  return new NextResponse(skill, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
