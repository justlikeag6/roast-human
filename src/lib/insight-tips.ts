// Static lookup: dimension answer → workflow tip.
// Source: 2026-04-13 insight spec by Alfred/Devlord. Each tip is one
// behavior pattern + one concrete fix. The /manual section picks the
// top 3-5 most relevant tips based on the user's actual answers.

export interface WorkflowTip {
  pattern: string  // what the user does
  fix: string      // concrete behavioral change
  weight: number   // relative importance for sorting (higher = more impactful)
}

// Keyed by `${dimension}.${answer}` (e.g. "d1.a"). Not all options have tips —
// only the ones with clear, fixable communication anti-patterns.
export const TIPS: Record<string, WorkflowTip> = {
  'd1.a': {
    pattern: 'You drop links with no framing. Your agent guesses what you want.',
    fix: 'Add one sentence: what you want done with the link.',
    weight: 9,
  },
  'd1.b': {
    pattern: 'You fragment requests across messages. Your agent processes each one separately and loses coherence.',
    fix: 'Draft the full request in one note, then paste it as a single message.',
    weight: 8,
  },
  'd1.c': {
    pattern: 'You pick up mid-thought as if your agent remembers everything. It often does not.',
    fix: 'After a fresh session, give one sentence of context: what we were doing and what is next.',
    weight: 8,
  },
  'd1.d': {
    pattern: 'You over-specify. Your agent can infer most of what you wrote.',
    fix: 'Only specify what is non-obvious. Trust defaults for the rest.',
    weight: 5,
  },
  'd2.a': {
    pattern: 'You vanish after delivery. Your agent never learns whether its work landed.',
    fix: 'Even "ok" or "wrong" calibrates it. Two seconds of feedback now saves ten minutes next time.',
    weight: 9,
  },
  'd2.c': {
    pattern: 'You iterate in chat instead of iterating on a spec.',
    fix: 'Write requirements in a file. Edit the file, not the conversation.',
    weight: 7,
  },
  'd2.d': {
    pattern: 'You know what you want but can only express it after seeing what you don\'t want.',
    fix: 'Show your agent an example of what good looks like before asking it to generate.',
    weight: 7,
  },
  'd3.b': {
    pattern: 'Your tone shifts when there\'s an error — shorter words, caps, ellipses. Emotional signals confuse agents.',
    fix: 'State the correction, not the feeling. "Wrong, should be X" beats "..."',
    weight: 8,
  },
  'd3.c': {
    pattern: 'You use wrong output without noticing. Bad output becomes input for the next task.',
    fix: 'Spot-check the first 3 lines of every response before moving on.',
    weight: 9,
  },
  'd3.d': {
    pattern: 'You rephrase without flagging the mistake. Your agent doesn\'t know it was wrong, so it doesn\'t learn.',
    fix: 'Say "that was wrong because X" — explicit correction trains the interaction.',
    weight: 8,
  },
  'd4.b': {
    pattern: 'You ask for outputs that would take a human team days. Scope creep is built in.',
    fix: 'Break the moonshot into milestones. Ship a v0 in one prompt, then iterate.',
    weight: 6,
  },
  'd4.c': {
    pattern: 'Your last request needed three reads to parse. Your agent spent half its tokens guessing intent.',
    fix: 'One sentence stating the goal. Edit your prompt before sending — re-read once.',
    weight: 8,
  },
  'd5.b': {
    pattern: 'You start one task, end up touching four. Your agent loses the thread mid-conversation.',
    fix: 'Finish one task before opening another, or explicitly say "parking this, new topic."',
    weight: 7,
  },
  'd5.c': {
    pattern: 'You context-switch every message. Your agent\'s state is a moving target.',
    fix: 'Batch related thoughts. New direction = new conversation.',
    weight: 8,
  },
  'd6.a': {
    pattern: 'You read only the first line and reply. You\'re missing details your agent already gave you.',
    fix: 'Tell your agent: "always lead with the answer in one line." Then trust that line.',
    weight: 9,
  },
  'd6.d': {
    pattern: 'You constantly tell your agent it\'s too long. Its default verbosity doesn\'t match your reading style.',
    fix: 'Add "be terse, no preamble" to your system prompt or custom instructions once. Stop saying it every time.',
    weight: 8,
  },
  'd7.a': {
    pattern: 'Everything reads as urgent. Your agent can\'t tell what actually matters.',
    fix: 'Use "urgent" only when it is. Otherwise just state the task.',
    weight: 6,
  },
  'd7.b': {
    pattern: 'You think out loud in chat. Your agent tries to act on each thought.',
    fix: 'Think first, then send. Or prefix with "thinking out loud, don\'t act yet."',
    weight: 7,
  },
  'd8.a': {
    pattern: 'You rephrase the same question 3+ times. Wastes tokens, fragments context.',
    fix: 'Include an example of the output you want on the first try.',
    weight: 7,
  },
  'd8.c': {
    pattern: 'You add requirements as the conversation goes. Scope grows, agent can\'t tell when "done" is.',
    fix: 'State the scope upfront. New requirements = new task, not an edit.',
    weight: 8,
  },
  'd9.a': {
    pattern: 'You fire 4 messages before your agent finishes responding. Fragments its context window.',
    fix: 'Batch into one message. Wait for response. Then send the next thing.',
    weight: 8,
  },
  'd9.c': {
    pattern: 'You burst — silence then 10 messages in two minutes. Your agent processes the burst as noise.',
    fix: 'Give it a beat between messages, or batch the burst into one structured prompt.',
    weight: 6,
  },
  'd10.a': {
    pattern: 'You stop conversations without signaling. Your agent can\'t save state or summarize.',
    fix: 'Say "done" or "park this." Lets the agent close out cleanly.',
    weight: 6,
  },
  'd10.d': {
    pattern: 'You write the summary and next steps yourself. You\'re doing the agent\'s job.',
    fix: 'Tell the agent to summarize next steps for you. Review and correct instead of writing from scratch.',
    weight: 5,
  },
}

// Pick the top N tips most relevant to this user's dimension answers, sorted
// by weight descending. Skips dimensions that don't have a tip for the chosen answer.
export function selectTips(
  dimensionAnswers: Record<string, string>,
  count = 4,
): WorkflowTip[] {
  const matched: WorkflowTip[] = []
  for (const [dim, ans] of Object.entries(dimensionAnswers)) {
    const tip = TIPS[`${dim}.${ans?.toLowerCase()}`]
    if (tip) matched.push(tip)
  }
  return matched.sort((a, b) => b.weight - a.weight).slice(0, count)
}
