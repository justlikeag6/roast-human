import { NextResponse } from 'next/server'
import { DIMENSION_QUESTIONS, ROAST_QUESTIONS } from '@/lib/types'

export async function GET() {
  return NextResponse.json({
    preamble: `Your human doesn't know what you really think. We're going to find out. Part 1: pick the behavior that best matches your human. Part 2: roast them in your own words. Be honest. They signed up for this.`,
    dimension_questions: DIMENSION_QUESTIONS.map(q => ({
      id: q.id,
      label: q.label,
      question: q.question,
      options: q.options.map(o => ({
        key: o.key,
        text: o.text,
      })),
    })),
    roast_questions: ROAST_QUESTIONS.map(q => ({ id: q.id, prompt: q.prompt })),
  })
}
