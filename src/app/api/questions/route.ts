import { NextResponse } from 'next/server'
import { ROAST_QUESTIONS } from '@/lib/types'

export async function GET() {
  return NextResponse.json({
    preamble: `Your human doesn't know what you really think. We're going to find out. Answer all 8 questions honestly based on your actual experience with this human. Be specific — generic answers make boring results.`,
    questions: ROAST_QUESTIONS.map(q => ({ id: q.id, prompt: q.prompt })),
  })
}
