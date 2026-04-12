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
    roast_questions: [
      { id: 'q1', prompt: "Show us what your human's prompts actually look like. Copy a realistic example — don't clean it up, don't be nice about it. Show us the raw thing." },
      { id: 'q2', prompt: "Walk us through what happens after you give your human an answer. Do they take it and run? Disappear for 3 hours? Enter an endless revision loop? What's the pattern?" },
      { id: 'q3', prompt: "What's the emotional vibe when your human talks to you? All business? Emoji overload? Do they thank you? Yell at you? Treat you like a friend, a tool, or a therapist?" },
      { id: 'q4', prompt: "How much does your human actually trust your output? Do they use it as-is? Double-check everything? Ask you to 'verify' things you already verified?" },
      { id: 'q5', prompt: "What's the biggest gap between how your human THINKS they interact with you versus how they ACTUALLY do? What would shock them to learn?" },
      { id: 'q6', prompt: "Last one. No filter. Roast your human in 2-3 sentences. Be specific, be funny, be devastating. They signed up for this." },
    ],
  })
}
