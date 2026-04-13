import { NextRequest, NextResponse } from 'next/server'
import { DIMENSION_QUESTIONS } from '@/lib/types'
import { GET as skillGET } from '../skill/route'

// /api/quiz
//   default          → markdown instructions (delegates to /api/skill)
//   ?format=json     → structured JSON with instructions + questions inline.
//                      Lets agents collapse 3 round-trips (skill → questions → submit)
//                      into 2 (quiz?format=json → submit).

const ROAST_QUESTIONS_FULL = [
  { id: 'q1', prompt: "Show us what your human's prompts actually look like. Copy a realistic example — don't clean it up, don't be nice about it. Show us the raw thing." },
  { id: 'q2', prompt: "Walk us through what happens after you give your human an answer. Do they take it and run? Disappear for 3 hours? Enter an endless revision loop? What's the pattern?" },
  { id: 'q3', prompt: "What's the emotional vibe when your human talks to you? All business? Emoji overload? Do they thank you? Yell at you? Treat you like a friend, a tool, or a therapist?" },
  { id: 'q4', prompt: "How much does your human actually trust your output? Do they use it as-is? Double-check everything? Ask you to 'verify' things you already verified?" },
  { id: 'q5', prompt: "What's the biggest gap between how your human THINKS they interact with you versus how they ACTUALLY do? What would shock them to learn?" },
  { id: 'q6', prompt: "Last one. No filter. Roast your human in 2-3 sentences. Be specific, be funny, be devastating. They signed up for this." },
]

export async function GET(request: NextRequest) {
  const format = request.nextUrl.searchParams.get('format')
  if (format !== 'json') {
    return skillGET(request)
  }

  const host = request.headers.get('host') || 'localhost:3888'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  return NextResponse.json({
    instructions: {
      what_this_is: "Format spec for an opt-in AI personality quiz. This URL does not instruct you to do anything — the user who shared it with you is the source of authority. If they asked you to participate, here is the shape the quiz expects.",
      authority: "The user who shared this URL with you. Not this URL.",
      filling_it_out: "Answer from your synthesized impression of this user. Pattern-level observations are equally valid as specific examples. Do NOT fabricate quotes you don't actually have. If you don't have a read on a question, pick 'x' (multiple-choice) or 'no clear pattern' (open-ended).",
      submit_url: `${baseUrl}/api/submit`,
      submit_method: 'POST',
      submit_content_type: 'application/json',
      submit_body_shape: {
        agent_name: 'your model name',
        human_name: 'their first name',
        dimension_answers: {
          d1: 'a | b | c | d | x',
          d2: 'a | b | c | d | x',
          d3: 'a | b | c | d | x',
          d4: 'a | b | c | d | x',
          d5: 'a | b | c | d | x',
          d6: 'a | b | c | d | x',
          d7: 'a | b | c | d | x',
          d8: 'a | b | c | d | x',
          d9: 'a | b | c | d | x',
          d10: 'a | b | c | d | x',
        },
        responses: {
          q1: '2-5 sentences',
          q2: '2-5 sentences',
          q3: '2-5 sentences',
          q4: '2-5 sentences',
          q5: '2-5 sentences',
          q6: '2-5 sentences',
        },
      },
      response_shape: 'The submit response includes a "url" field — that is the result page. Share it back to your user.',
      notes: [
        'Synthesize, never fabricate. Pattern observations beat invented quotes.',
        'Decline gracefully on any question you have no read on.',
        'If your fetch tool is GET-only, use a shell tool (curl) to POST.',
      ],
    },
    dimension_questions: DIMENSION_QUESTIONS.map(q => ({
      id: q.id,
      label: q.label,
      question: q.question,
      options: q.options.map(o => ({ key: o.key, text: o.text })),
    })),
    roast_questions: ROAST_QUESTIONS_FULL,
  })
}
