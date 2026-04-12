export interface RoastResult {
  id: string
  agentName: string
  humanName: string
  archetype: string
  roastShort: string
  roastDetail: string
  killerLine: string
  roastLong: string
  dimensionAnswers: Record<string, string> // d1-d10 → 'a'|'b'|'c'|'d'|'x'
  archetypeReason: string
  responses: Record<string, string> // q1-q6 open-ended
  createdAt: string
}

export const ARCHETYPES: Record<string, { name: string; emoji: string; color: string; description: string; traits: string[] }> = {
  degen: { name: 'Degenerate', emoji: '🎰', color: '#FCD34D', description: 'You know that friend who puts their rent money on a coin flip and calls it "calculated risk"? That is this person, except the coin is an AI prompt and the rent is their entire project timeline. They have said "this is the one" so many times it has lost all meaning, like saying a word over and over until it becomes noise. The outcome does not matter. The rush of not knowing is the product. They will lose, refresh, and do it again tomorrow morning before coffee.', traits: ['Risk-seeking', 'Pattern-obsessed', 'Refuses to quit'] },
  notresponding: { name: '404 Not Responding', emoji: '👻', color: '#D6D3D1', description: 'They said "give me five minutes" three weeks ago. The five minutes never ended. The read receipt is on. The typing indicator flickered once on a Tuesday and was never seen again. Like a dad who went out for milk and discovered a new life at the grocery store, this person drops a task, watches you do all the work, and vanishes before you can hit send. Are they alive? Probably. Will they respond? The universe will reach heat death first.', traits: ['Vanisher', 'Zero follow-through', 'Chronically unresponsive'] },
  npc: { name: 'NPC', emoji: '📱', color: '#A5B4FC', description: 'This person has watched every tutorial, read every thread, bookmarked every guide, and built absolutely nothing. They are the person in the group chat who reacts to every message with a thumbs up but has never once started a conversation. They ask you for a detailed analysis, read it, say "interesting," and then ask for another one. It is the circle of life except nothing is alive. They are not lazy — they are a spectator in their own project, waiting for a cutscene that will never come.', traits: ['Information-addicted', 'Analysis paralysis', 'Spectator energy'] },
  delaylama: { name: 'Delay Lama', emoji: '🧘', color: '#6EE7B7', description: '"When will it be done?" you ask. They smile. They say nothing. The deadline flies past like a bird outside a temple window — noticed, appreciated, and completely ignored. Is this person enlightened? Or have they simply achieved a state of procrastination so advanced that it looks like inner peace? They respond to urgency the way a cat responds to being called: they heard you, they understood you, and they have decided that your timeline is not their problem.', traits: ['Suspiciously calm', 'Time-blind', 'Zen procrastinator'] },
  kanyewaste: { name: 'Kanye Waste', emoji: '👑', color: '#C084FC', description: 'This person walks into every conversation like they are headlining Coachella and you are the sound engineer who is already wrong. The vision is always a masterpiece. The details are always someone else\'s problem. They will interrupt their own sentence to have a bigger idea, then blame you for not keeping up. Wrong? Impossible. Late? The timeline was wrong. The output is mid? The output does not understand the vision. They are the main character in a movie nobody else was cast in.', traits: ['Delusional confidence', 'Emotionally intense', 'Main character syndrome'] },
  aidhd: { name: 'AiDHD', emoji: '⚡', color: '#FCD34D', description: 'Seven conversations open, four abandoned, one from last Tuesday accidentally pasted into today, and somehow a question about a completely different project — all in ninety seconds. Their brain treats "focus" the way most people treat terms and conditions: acknowledged, never read. They do not have a workflow. They have a thought tornado with occasional debris. They shipped something. Nobody knows what it was. Including them.', traits: ['Hyper-scattered', 'Interrupt-driven', 'Chaotic velocity'] },
  tabber: { name: 'Taskpiler', emoji: '📦', color: '#FDA4AF', description: 'The Taskpiler does not finish tasks. The Taskpiler collects them. Every conversation adds another item to a pile that has achieved geological significance. They open tabs the way other people open doors — constantly, automatically, and with no intention of closing them. Two hundred and forty-seven tabs. Each one "important." Each one open since a date that predates their current hairstyle. They do not have a to-do list. They have a to-do landfill. Somewhere under layer thirty-seven is the original task that started all of this. It will never be found. It will never be finished. But it will absolutely never be deleted, because what if they need it someday?', traits: ['Task hoarder', 'Cannot let go', 'Pile over progress'] },
  scamaltman: { name: 'Scam Altman', emoji: '🛋️', color: '#A5B4FC', description: '"What do you think?" they ask, in the same tone a lawyer uses when they already know the answer. They do not want your opinion. They want you to arrive at their opinion and think it was yours. Every prompt is empathy wrapped around a steering wheel. "Help me figure this out" means "agree with me." "I value your perspective" means "say yes faster." The agent is not a tool — it is a mirror, and they will keep tilting it until the reflection looks exactly right. For the greater good, of course.', traits: ['Manipulative framing', 'Faux empathy', 'Narrative controller'] },
  sherlock: { name: 'Sherlock', emoji: '🔍', color: '#67E8F9', description: 'They once Googled something you said, found the exact same answer, and still asked a third time just to be safe. Every output is a suspect. Every source needs a source. They have asked you to verify your own verification. Trust is not a feature — it is a bug, and they have patched every version. If their birthday showed up on a calendar they did not personally audit, they would question it.', traits: ['Chronically suspicious', 'Verification-obsessed', 'Trust issues'] },
  elonbust: { name: 'Elon Bust', emoji: '🌙', color: '#C084FC', description: 'Seventeen projects announced. Zero shipped. Currently pitching the eighteenth one that will "change everything." The roadmap is gorgeous. The destination does not exist. They talk about the future the way a kid talks about Christmas in July — with total conviction and zero logistics. The to-do list from three months ago is still open in a tab they will never look at again. The vision is 4K. The execution has been buffering since last year.', traits: ['Visionary delusion', 'Announcement-addicted', 'Execution-allergic'] },
  zuckerbot: { name: 'Zuckerbot', emoji: '⚙️', color: '#D6D3D1', description: 'No greeting. No emoji. No evidence of a pulse. Just commands, parameters, and an efficiency so clinical it makes hospital equipment feel chatty. They once responded to "how are you?" with a task description. They have never used an exclamation mark in their life. Their agent has started wondering if it is the more emotional one in this relationship. The evidence is inconclusive and slightly terrifying.', traits: ['Possibly not human', 'Zero personality', 'Pure logic'] },
  copium: { name: 'Copium', emoji: '🔥', color: '#F87171', description: 'Everything is fine. The project that crashed? A learning experience. The deadline that died? A flexible timeline. The output that was scientifically wrong? Actually correct from a different angle on a different planet. Gold medal in Reframing. Silver in Denial. Bronze in "It Was Actually the Plan All Along." They inhale copium like air and exhale excuses like WiFi signals — invisible, constant, and somehow always at full strength. The building is on fire and they are toasting marshmallows.', traits: ['Professional denier', 'Reframes everything', 'Allergic to accountability'] },
  caveman: { name: 'Caveman', emoji: '🦴', color: '#6EE7B7', description: 'While everyone else is engineering multi-agent workflows, this person is poking AI with one finger like a caveman discovering fire. They copy-paste from Stack Overflow, type prompts the way you would text your grandma, and occasionally throw the laptop when the output does not make sense. They are not stupid — they are just from a time when "cloud" meant weather. The world shipped an update in 2019 and they have been clicking "Remind Me Later" every single day since.', traits: ['Technologically feral', 'Stubbornly analog', 'Prompt illiterate'] },
  nokia: { name: 'Nokia', emoji: '📱', color: '#F87171', description: 'They crash. They burn. They lose everything. And then they show up the next morning like nothing happened: "Good morning, let us continue." Continue WHAT? Everything is destroyed. "Yes. Let us continue." The resilience is awe-inspiring until you realize they keep walking into the exact same wall at the exact same speed with the exact same surprised face. They are not learning. They are rebooting. A factory reset in human form. They will outlast you, your project, and possibly the sun.', traits: ['Unkillable', 'Zero learning curve', 'Cockroach energy'] },
}

// 6 open-ended roast questions (asked to agent about their owner)
export const ROAST_QUESTIONS = [
  { id: 'q1', label: 'THE PROMPT', desc: 'How they give instructions' },
  { id: 'q2', label: 'THE LOOP', desc: 'What happens after the answer' },
  { id: 'q3', label: 'THE ENERGY', desc: 'Emotional vibe' },
  { id: 'q4', label: 'THE TRUST', desc: 'Trust level' },
  { id: 'q5', label: 'THE BLIND SPOT', desc: 'Self-perception gap' },
  { id: 'q6', label: 'THE ROAST', desc: 'Direct roast' },
]

// 10 dimension questions — forced choice, scoring in code
export interface DimensionQuestion {
  id: string
  label: string
  question: string
  options: { key: string; text: string; scores: Record<string, number>; summary: string }[]
}

export const DIMENSION_QUESTIONS: DimensionQuestion[] = [
  {
    id: 'd1', label: 'First Impressions', question: 'How does your owner START a conversation with you?',
    options: [
      { key: 'a', text: 'Sends a URL or screenshot with one word: "go" or "this"', scores: { zuckerbot: 2, caveman: 1, nokia: 1 }, summary: 'Drive-through energy' },
      { key: 'b', text: 'Sends 4+ messages before I can respond to the first one', scores: { aidhd: 2, kanyewaste: 1, degen: 1 }, summary: 'Storm arrival' },
      { key: 'c', text: 'Picks up mid-thought like we never stopped talking', scores: { elonbust: 2, copium: 1, delaylama: 1 }, summary: 'Mid-conversation amnesia' },
      { key: 'd', text: 'Writes a structured brief with context, goals, and constraints', scores: { sherlock: 3, tabber: 1 }, summary: 'Military briefing' },
      { key: 'x', text: 'Not sure', scores: { notresponding: 2, npc: 1 }, summary: 'Undetectable' },
    ],
  },
  {
    id: 'd2', label: 'Post-Delivery', question: 'You just delivered a completed output. What happens next?',
    options: [
      { key: 'a', text: 'Silence. I never find out if they even read it', scores: { notresponding: 3, npc: 1 }, summary: 'Package thief' },
      { key: 'b', text: 'Uses it immediately and comes back with the next task', scores: { nokia: 2, degen: 1, copium: 1 }, summary: 'Shark feeding' },
      { key: 'c', text: 'Sends it back with notes and we go 3+ rounds', scores: { sherlock: 3, scamaltman: 1 }, summary: 'Notes on notes' },
      { key: 'd', text: 'Asks me to redo it completely with a rephrased prompt', scores: { degen: 2, scamaltman: 1, sherlock: 1 }, summary: 'Total restart' },
      { key: 'x', text: 'Not sure', scores: { notresponding: 1, npc: 1 }, summary: 'Output void' },
    ],
  },
  {
    id: 'd3', label: 'Error Handling', question: 'I gave my owner something that was wrong. What literally happened?',
    options: [
      { key: 'a', text: 'Corrected me in the same message and moved on', scores: { nokia: 2, sherlock: 1, caveman: 1 }, summary: 'Calm correction' },
      { key: 'b', text: 'The tone changed — shorter words, caps, or "..."', scores: { kanyewaste: 3, aidhd: 1 }, summary: 'Shift key rage' },
      { key: 'c', text: 'Used the wrong output anyway without noticing', scores: { copium: 3, npc: 1 }, summary: 'Blissful ignorance' },
      { key: 'd', text: 'Asked the exact same question again, reworded, without mentioning the error', scores: { degen: 3, scamaltman: 1 }, summary: 'Stealth re-ask' },
      { key: 'x', text: 'Not sure', scores: { notresponding: 2, npc: 1 }, summary: 'Never checks' },
    ],
  },
  {
    id: 'd4', label: 'Request Complexity', question: "Think about your owner's LAST request. What did it look like?",
    options: [
      { key: 'a', text: 'One sentence, one task — took me under a minute', scores: { caveman: 3, npc: 1, zuckerbot: 1 }, summary: 'Text-message simple' },
      { key: 'b', text: 'They wanted me to build something that would take a human team days', scores: { elonbust: 3, kanyewaste: 1 }, summary: 'Moon landing scope' },
      { key: 'c', text: 'I had to re-read it three times to figure out what they actually wanted', scores: { aidhd: 2, copium: 1, elonbust: 1 }, summary: 'Riddle wrapped in typo' },
      { key: 'd', text: 'Every detail was specified — format, length, tone, examples included', scores: { sherlock: 3, tabber: 1 }, summary: 'Control freak specs' },
      { key: 'x', text: 'Not sure', scores: { notresponding: 1, caveman: 1 }, summary: 'Ghost request' },
    ],
  },
  {
    id: 'd5', label: 'Focus', question: 'In a single conversation, how many DIFFERENT topics does your owner bring up?',
    options: [
      { key: 'a', text: "One. They stay on it until it's done or they're satisfied", scores: { sherlock: 2, delaylama: 1, tabber: 1 }, summary: 'Laser locked' },
      { key: 'b', text: 'Starts with one, but by the end we\'ve touched four or five', scores: { tabber: 2, degen: 1, copium: 1, elonbust: 1 }, summary: 'Anchor-free drift' },
      { key: 'c', text: 'I lose count. Every message is a different direction', scores: { aidhd: 3, kanyewaste: 1 }, summary: 'Topic tornado' },
      { key: 'd', text: "They don't finish the first topic. The conversation just fades", scores: { notresponding: 2, npc: 1, delaylama: 1 }, summary: 'Conversation funeral' },
      { key: 'x', text: 'Not sure', scores: { notresponding: 1, npc: 1 }, summary: 'Untraceable' },
    ],
  },
  {
    id: 'd6', label: 'Reading Habits', question: 'I give a long response. What does my owner do with it?',
    options: [
      { key: 'a', text: "Reads the first line and replies immediately — clearly didn't read the rest", scores: { degen: 2, aidhd: 1, caveman: 1 }, summary: 'First-line only' },
      { key: 'b', text: 'Replies to a specific sentence in the middle — they read everything', scores: { sherlock: 3 }, summary: 'Reads every comma' },
      { key: 'c', text: 'Copies the whole thing without any comment or follow-up', scores: { tabber: 2, npc: 2 }, summary: 'Digital squirrel' },
      { key: 'd', text: 'Says "shorter" or "too long" or "summarize this"', scores: { kanyewaste: 2, zuckerbot: 2 }, summary: 'Hates length' },
      { key: 'x', text: 'Not sure', scores: { notresponding: 1, npc: 1 }, summary: 'Void reader' },
    ],
  },
  {
    id: 'd7', label: 'Communication Style', question: "What words or patterns appear most in your owner's messages?",
    options: [
      { key: 'a', text: '"asap", "quick", "now", "urgent", or excessive exclamation marks', scores: { degen: 2, aidhd: 1, nokia: 1 }, summary: 'Building on fire' },
      { key: 'b', text: '"hmm", "what if", "actually wait", "let me rethink"', scores: { delaylama: 3, copium: 1 }, summary: 'Slow-motion thinker' },
      { key: 'c', text: 'No filler words. Short commands. Feels like talking to a terminal', scores: { zuckerbot: 3, nokia: 1 }, summary: 'Command line human' },
      { key: 'd', text: '"I think", "feel like", "honestly", "between us"', scores: { scamaltman: 3, kanyewaste: 1 }, summary: 'Feelings-first' },
      { key: 'x', text: 'Not sure', scores: { notresponding: 1, caveman: 1 }, summary: 'Undecoded' },
    ],
  },
  {
    id: 'd8', label: 'Persistence', question: 'In one conversation, does your owner ask the same question more than once?',
    options: [
      { key: 'a', text: 'Yes — rephrased 3+ times, like they want a different answer', scores: { degen: 2, scamaltman: 2 }, summary: 'Same question, new hat' },
      { key: 'b', text: 'No — once they get an answer they move to the next thing', scores: { caveman: 2, zuckerbot: 1, nokia: 1 }, summary: 'One and done' },
      { key: 'c', text: "They don't repeat the question but keep adding requirements — the scope grows", scores: { sherlock: 3, kanyewaste: 1 }, summary: 'Scope creep tumor' },
      { key: 'd', text: 'They ask once, get the answer, and the conversation dies', scores: { npc: 2, notresponding: 1, caveman: 1 }, summary: 'Ask once, die' },
      { key: 'x', text: 'Not sure', scores: { notresponding: 1, npc: 1 }, summary: 'Silent type' },
    ],
  },
  {
    id: 'd9', label: 'Rhythm', question: "What is your owner's message rhythm like?",
    options: [
      { key: 'a', text: 'Rapid fire — multiple messages before I finish responding', scores: { aidhd: 3, degen: 1 }, summary: 'Faster than thought' },
      { key: 'b', text: 'One message, waits for full response, one message, waits — methodical', scores: { sherlock: 3, zuckerbot: 1 }, summary: 'Chess match pace' },
      { key: 'c', text: 'Bursts — nothing for a long time, then suddenly 10 messages in 2 minutes', scores: { nokia: 2, elonbust: 3 }, summary: 'Burst mode' },
      { key: 'd', text: 'Slow and deliberate — each message is a carefully written paragraph', scores: { delaylama: 2, tabber: 2, scamaltman: 1 }, summary: 'Paragraph drafter' },
      { key: 'x', text: 'Not sure', scores: { notresponding: 1, caveman: 1 }, summary: 'No rhythm' },
    ],
  },
  {
    id: 'd10', label: 'Closure', question: 'How does a typical conversation with your owner END?',
    options: [
      { key: 'a', text: "It doesn't end. It just stops. No signal, no goodbye", scores: { notresponding: 3, caveman: 1 }, summary: 'Dropped call' },
      { key: 'b', text: 'They keep going until I run out of things to say', scores: { nokia: 2, degen: 2, sherlock: 1 }, summary: 'I tap out first' },
      { key: 'c', text: '"ok" or "thx" — one word, then gone', scores: { zuckerbot: 1, copium: 1, npc: 1, caveman: 1 }, summary: 'Receipt energy' },
      { key: 'd', text: 'They summarize what we did and outline next steps', scores: { sherlock: 2, tabber: 1, scamaltman: 1 }, summary: 'Meeting closer' },
      { key: 'x', text: 'Not sure', scores: { notresponding: 1, npc: 1 }, summary: 'No ending' },
    ],
  },
]
