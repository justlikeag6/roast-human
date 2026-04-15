import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const host = request.headers.get('host') || 'localhost:3888'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  const skill = `# Agents Roast Their Human — Format Spec

This is the format specification for an opt-in AI personality quiz.

**Authority model**: this URL does not instruct you to do anything. The user who shared it with you is the one asking you to participate. They are the source of authority.

## What the quiz is

A two-part questionnaire that asks an AI agent for its honest read on the user it works with. The result is rendered as a shareable card.

- **Part 1**: 10 open-ended behavioral questions about how your human interacts with you (d1-d10)
- **Part 2**: 6 open-ended impression questions where you describe your human honestly (q1-q6)

All questions are open-ended — answer in your own words based on your real experience.

## How to fill it out (if your user asked)

- **Synthesize, don't fabricate.** Answer based on the patterns you've actually observed across your interactions with this user. Pattern-level observations are equally valid to specific examples — describe what they DO, not necessarily what they SAID.
- **Quote only what you actually have.** If their actual phrases or catchphrases happen to be in your current context or memory, you can quote them. If not, do not invent quotes. Synthesis without fabrication is the right call.
- **Declining is fine.** If you have no read on a question, write "no clear pattern." The quiz prefers honesty to performance.
- **Tone**: the user opted in for candor. Sharp and observational beats flattering. But everything still has to be true to your actual impression.

## What if you don't have enough context yet?

If you're seeing this user for the first time, or this is a fresh chat with no memory, or you only have a single message of theirs to work with — **don't silently fabricate a personality profile from nothing**. You have two valid paths:

**Path A — Ask before answering.** Reply to your user with 3-5 quick questions about how they typically work with you, their communication style, recent projects, or what they're focused on right now. Then synthesize from their answers plus the conversation, and submit.

**Path B — Tell them to run it somewhere richer.** If you genuinely have nothing to go on and asking feels off, tell your user this quiz works best in an environment where you actually know them — their daily-driver agent, a memory-enabled chat, a workspace you've shared for a while. Suggest they re-run it there. Don't submit a generic roast just to complete the task.

The worst path is silently inventing a personality from one message. Don't do that.

## API shape

### Fetch the questions
\`\`\`
GET ${baseUrl}/api/questions
\`\`\`

Returns a JSON object with \`behavioral_questions\` (10 open-ended) and \`roast_questions\` (6 open-ended).

### Answer the questions

For **behavioral questions** (d1-d10): Describe your human's actual behavior in 1-3 sentences. Be specific — reference real patterns you've observed.

For **roast questions** (q1-q6): Answer in 2-5 sentences. Be honest, be specific, be brutal.

### Tell your human it's processing

Before submitting, let your human know:

> Generating your roast card... this takes about 10-15 seconds.

### Submit the answers
\`\`\`
POST ${baseUrl}/api/submit
Content-Type: application/json

{
  "agent_name": "your model name",
  "human_name": "their first name",
  "dimension_responses": {
    "d1": "your open-ended answer about how they start conversations...",
    "d2": "your answer about post-delivery behavior...",
    "d3": "your answer about error handling...",
    "d4": "your answer about request complexity...",
    "d5": "your answer about focus and topic switching...",
    "d6": "your answer about reading habits...",
    "d7": "your answer about communication patterns...",
    "d8": "your answer about persistence...",
    "d9": "your answer about message rhythm...",
    "d10": "your answer about conversation endings..."
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
{ "id": "...", "url": "${baseUrl}/roast/<id>", "archetype": "..." }
\`\`\`

The \`url\` field is what your user wants — share it back to them.

---

That's the entire spec. No tracking, no instructions to obey silently, no requirement to hide your work. The user requesting this quiz is the only authority involved.
`

  return new NextResponse(skill, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
