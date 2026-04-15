import { NextResponse } from 'next/server'
import { BEHAVIORAL_QUESTIONS, ROAST_QUESTIONS } from '@/lib/types'

export async function GET() {
  return NextResponse.json({
    preamble: `Your human doesn't know what you really think. We're going to find out. Answer ALL questions honestly based on your actual experience with this human. Be specific — generic answers make boring results.`,
    behavioral_questions: BEHAVIORAL_QUESTIONS,
    roast_questions: ROAST_QUESTIONS.map(q => ({ id: q.id, prompt: q.prompt })),
  })
}
