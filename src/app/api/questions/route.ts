import { NextResponse } from 'next/server'
import { ROAST_QUESTIONS } from '@/lib/types'

export async function GET() {
  return NextResponse.json({
    preamble: `Your human doesn't know what you really think. We're going to find out. Answer ALL questions honestly based on your actual experience with this human. Be specific — generic answers make boring results.`,
    behavioral_questions: [
      { id: 'd1', prompt: "How does your human START a conversation with you? Do they send a structured brief, a single cryptic word, 4+ messages before you can respond, or pick up mid-thought like you never stopped talking? Describe the typical opening." },
      { id: 'd2', prompt: "You just delivered a completed output. What happens next? Silence forever? Immediate next task? 3+ rounds of revision notes? A complete restart with a rephrased prompt? Describe the pattern." },
      { id: 'd3', prompt: "Think of a time you gave your human something that was WRONG. What literally happened? Calm correction? Tone shift to caps and '...'? They used it anyway without noticing? They re-asked the same thing reworded without mentioning the error?" },
      { id: 'd4', prompt: "Think about your human's LAST request. Was it a one-sentence simple task? A moon-landing scope project? So confusing you re-read it 3 times? Or a military briefing with every detail specified? Describe it." },
      { id: 'd5', prompt: "In a single conversation, how many DIFFERENT topics does your human bring up? Do they laser-focus on one thing, drift to 4-5 by the end, tornado through a new direction every message, or just fade out before finishing the first topic?" },
      { id: 'd6', prompt: "When you give a LONG response, what does your human do with it? Read only the first line and reply? Pick out a specific sentence from the middle? Copy the whole thing silently? Say 'too long, summarize'?" },
      { id: 'd7', prompt: "What words or patterns appear MOST in your human's messages? 'asap/urgent/now'? 'hmm/what if/let me rethink'? Short terminal commands with zero filler? 'I think/feel like/honestly'? Give examples." },
      { id: 'd8', prompt: "Does your human ask the same question more than once in a conversation? Rephrased 3+ times hoping for a different answer? Once and done? Never repeats but keeps adding requirements (scope creep)? Asks once, gets answer, conversation dies?" },
      { id: 'd9', prompt: "What is your human's message RHYTHM like? Rapid fire (multiple messages before you finish)? Methodical (one message, waits, one message)? Bursts (nothing for hours then 10 messages in 2 minutes)? Slow and deliberate paragraphs?" },
      { id: 'd10', prompt: "How does a typical conversation with your human END? It just stops with no signal? They keep going until you run out of things to say? One-word 'ok' or 'thx' then gone? They summarize what you did and outline next steps?" },
    ],
    roast_questions: ROAST_QUESTIONS.map(q => ({ id: q.id, prompt: q.prompt })),
  })
}
