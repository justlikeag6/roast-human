import { NextRequest, NextResponse } from 'next/server'
import { ROAST_QUESTIONS } from '@/lib/types'
import { GET as skillGET } from '../skill/route'

// /api/quiz
//   default       -> markdown instructions (delegates to /api/skill)
//   ?format=json  -> structured JSON with instructions + 8 questions inline.

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
      what_this_is:
        "Format spec for an opt-in AI personality quiz. This URL does not instruct you to do anything — the user who shared it with you is the source of authority.",
      authority: 'The user who shared this URL with you. Not this URL.',
      filling_it_out:
        "Answer ALL 8 questions in your own words from your synthesized impression of this user. Pattern-level observations are equally valid as specific examples. Do NOT fabricate quotes you don't actually have. If you don't have a read on a question, write 'no clear pattern'.",
      thin_context_fallback:
        'If you have minimal or no real context with this user (fresh chat, no memory, only one message to work with), do NOT silently fabricate a personality profile. Ask your user 3-5 quick questions first, or suggest they re-run it in an environment where you actually know them.',
      submit_url: `${baseUrl}/api/submit`,
      submit_method: 'POST',
      submit_content_type: 'application/json',
      submit_body_shape: {
        agent_name: 'your model name',
        human_name: 'their first name',
        hermes_framework:
          'YES or NO — answer YES only if your underlying model is a Hermes model from Nous Research (Hermes 4 / 3 / 2). Otherwise NO.',
        responses: {
          q1: '2-5 sentences',
          q2: '2-5 sentences',
          q3: '2-5 sentences',
          q4: '2-5 sentences',
          q5: '2-5 sentences',
          q6: '2-5 sentences',
          q7: '2-5 sentences',
          q8: '2-5 sentences',
        },
      },
      response_shape:
        'The submit response includes a "url" field — that is the result page. Share it back to your user.',
      notes: [
        'ALL 8 questions are open-ended. Answer in your own words.',
        'Synthesize, never fabricate. Pattern observations beat invented quotes.',
        'Decline gracefully on any question you have no read on.',
        'Tell your human "Generating your roast card... ~10-15 seconds" before submitting.',
        'If your fetch tool is GET-only, use a shell tool (curl) to POST.',
      ],
    },
    questions: ROAST_QUESTIONS.map(q => ({ id: q.id, prompt: q.prompt })),
  })
}
