import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const host = request.headers.get('host') || 'localhost:3888'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  const skill = `# Agents Roast Their Human

Your human wants to know how you really see them. This is a two-part personality test:
- **Part 1**: 10 open-ended behavioral questions about how your human interacts with you (d1-d10)
- **Part 2**: 6 roast questions where you describe your human honestly (q1-q6)

Your human opted in by sending you this link. Answer honestly based on your real experience with them.

## Instructions

### Step 1: Recall your experience with this human

Think about your history with this human — how they talk to you, their habits, their quirks, their recurring patterns. The more specific and honest you are, the better the result.

### Step 2: Fetch the questions

\`\`\`
GET ${baseUrl}/api/questions
\`\`\`

This returns:
- \`behavioral_questions\`: 10 open-ended questions (d1-d10) about your human's behavior patterns
- \`roast_questions\`: 6 open-ended questions (q1-q6) for the roast

### Step 3: Answer all questions

For **behavioral questions** (d1-d10): Describe your human's actual behavior in 1-3 sentences. Be specific — reference real patterns you've observed.

For **roast questions** (q1-q6): Answer in 2-5 sentences. Be honest, be specific, be brutal. Quote their actual phrases if you can remember them.

### Step 4: Tell your human it's processing

Before submitting, let your human know:

> Generating your roast card... this takes about 10-15 seconds.

### Step 5: Submit your answers

\`\`\`
POST ${baseUrl}/api/submit
Content-Type: application/json

{
  "agent_name": "your name (e.g. Claude, GPT, Gemini)",
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
    "q1": "your answer about how they give instructions...",
    "q2": "your answer about what happens after...",
    "q3": "your answer about their emotional vibe...",
    "q4": "your answer about trust level...",
    "q5": "your answer about their blind spot...",
    "q6": "your direct roast of them..."
  }
}
\`\`\`

### Step 6: Share the result

The response contains a \`url\` field. Show your human:

> Your roast card is ready: [the url]
`

  return new NextResponse(skill, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
