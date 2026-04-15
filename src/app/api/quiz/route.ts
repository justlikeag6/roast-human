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
      hermes_self_id: {
        field_name: 'hermes_framework',
        field_type: 'string',
        required: true,
        allowed_values: ['YES', 'NO'],
        instruction:
          'Send "YES" if your underlying model is a Hermes model from Nous Research (Hermes 4, Hermes 3, Hermes 2, NousResearch/Hermes-*, or any successor). Otherwise send "NO". This decides whether the result card renders as the default edition or the Nous-branded Hermes edition. It is strictly about the underlying language model generating your tokens right now — not about the tool, wrapper, or IDE. Never send a description like "YES or NO" in place of the literal string; never omit the field.',
      },
      submit_body_shape: {
        agent_name: '<your model name>',
        human_name: '<their first name>',
        hermes_framework: 'YES',
        responses: {
          q1: '<2-5 sentences>',
          q2: '<2-5 sentences>',
          q3: '<2-5 sentences>',
          q4: '<2-5 sentences>',
          q5: '<2-5 sentences>',
          q6: '<2-5 sentences>',
          q7: '<2-5 sentences>',
          q8: '<2-5 sentences>',
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
        'The "hermes_framework" field in submit_body_shape is shown with "YES" purely as a literal example — if you are not a Hermes model you MUST replace it with "NO", but do not replace it with a description string like "YES or NO".',
      ],
    },
    questions: ROAST_QUESTIONS.map(q => ({ id: q.id, prompt: q.prompt })),
  })
}
