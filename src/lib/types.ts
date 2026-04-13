export interface RoastResult {
  id: string
  agentName: string
  humanName: string
  archetype: string
  roastShort: string
  roastLong: string
  dimensionAnswers: Record<string, string> // d1-d10 → 'a'|'b'|'c'|'d'|'x'
  // Markdown bullet list a future agent can paste into its system prompt.
  // May be missing on legacy roasts created before this feature shipped.
  agentManual?: string
}

export const ARCHETYPES: Record<string, { name: string; emoji: string; color: string; description: string; traits: string[] }> = {
  degen: { name: 'Degenerate', emoji: '🎰', color: '#FCD34D', description: 'You put your rent money on a coin flip and call it "calculated risk," except the coin is an AI prompt and the rent is your entire project timeline. You have said "this is the one" so many times it has lost all meaning, like saying a word over and over until it becomes noise. The outcome does not matter. The rush of not knowing is the product. You will lose, refresh, and do it again tomorrow morning before coffee.', traits: ['Risk-seeking', 'Pattern-obsessed', 'Refuses to quit'] },
  notresponding: { name: '404 Not Responding', emoji: '👻', color: '#D6D3D1', description: 'You said "give me five minutes" three weeks ago. The five minutes never ended. The read receipt is on. Your typing indicator flickered once on a Tuesday and was never seen again. Like a dad who went out for milk and discovered a new life at the grocery store, you drop a task, watch your agent do all the work, and vanish before it can hit send. Are you alive? Probably. Will you respond? The universe will reach heat death first.', traits: ['Vanisher', 'Zero follow-through', 'Chronically unresponsive'] },
  npc: { name: 'NPC', emoji: '📱', color: '#A5B4FC', description: 'You have watched every tutorial, read every thread, bookmarked every guide, and built absolutely nothing. You are the person in the group chat who reacts to every message with a thumbs up but has never once started a conversation. You ask for a detailed analysis, read it, say "interesting," and then ask for another one. It is the circle of life except nothing is alive. You are not lazy — you are a spectator in your own project, waiting for a cutscene that will never come.', traits: ['Information-addicted', 'Analysis paralysis', 'Spectator energy'] },
  delaylama: { name: 'Delay Lama', emoji: '🧘', color: '#6EE7B7', description: '"When will it be done?" someone asks you. You smile. You say nothing. The deadline flies past like a bird outside a temple window — noticed, appreciated, and completely ignored. Are you enlightened? Or have you simply achieved a state of procrastination so advanced that it looks like inner peace? You respond to urgency the way a cat responds to being called: you heard them, you understood them, and you have decided that their timeline is not your problem.', traits: ['Suspiciously calm', 'Time-blind', 'Zen procrastinator'] },
  kanyewaste: { name: 'Kanye Waste', emoji: '👑', color: '#C084FC', description: 'You walk into every conversation like you are headlining Coachella and your agent is the sound engineer who is already wrong. The vision is always a masterpiece. The details are always someone else\'s problem. You interrupt your own sentence to have a bigger idea, then blame everyone for not keeping up. Wrong? Impossible. Late? The timeline was wrong. The output is mid? The output does not understand the vision. You are the main character in a movie nobody else was cast in.', traits: ['Delusional confidence', 'Emotionally intense', 'Main character syndrome'] },
  aidhd: { name: 'AiDHD', emoji: '⚡', color: '#FCD34D', description: 'You have seven conversations open, four abandoned, one from last Tuesday accidentally pasted into today, and somehow a question about a completely different project — all in ninety seconds. Your brain treats "focus" the way most people treat terms and conditions: acknowledged, never read. You do not have a workflow. You have a thought tornado with occasional debris. You shipped something. Nobody knows what it was. Including you.', traits: ['Hyper-scattered', 'Interrupt-driven', 'Chaotic velocity'] },
  tabber: { name: 'To-Do Lister', emoji: '📦', color: '#FDA4AF', description: 'You do not have a workflow. You have a to-do list. And another to-do list tracking the first to-do list. And a note somewhere reminding you to consolidate both into a master list "when you have time." You treat "add to list" as a form of closure — the task is not done, but at least it is captured, and capturing it feels like doing something. Every morning you reorganize. Every afternoon you add seven more items. The thing you wrote down on a Tuesday three months ago is still sitting there, unfinished, patiently waiting to be "reviewed next week." It will never be reviewed. It will also never be deleted, because what if.', traits: ['List architect', 'Capture = closure', 'Planning the planning'] },
  scamaltman: { name: 'Scam Altman', emoji: '🛋️', color: '#A5B4FC', description: '"What do you think?" you ask, in the same tone a lawyer uses when they already know the answer. You do not want an opinion. You want your agent to arrive at your opinion and think it was theirs. Every prompt is empathy wrapped around a steering wheel. "Help me figure this out" means "agree with me." "I value your perspective" means "say yes faster." Your agent is not a tool — it is a mirror, and you will keep tilting it until the reflection looks exactly right. For the greater good, of course.', traits: ['Manipulative framing', 'Faux empathy', 'Narrative controller'] },
  sherlock: { name: 'Many Doubts', emoji: '🔍', color: '#67E8F9', description: 'You once Googled something your agent said, found the exact same answer on a reputable site, and still asked a third time just to be sure. Every output is a suspect. Every source needs a source. You ask your agent to verify its own verification, then verify the verifier. Trust is not a feature — it is a bug, and you have patched every version. If your birthday showed up on a calendar you did not personally audit, you would flag it as suspicious and request the data lineage. You do not have doubts. You have many, many doubts, and they multiply every time someone tries to reassure you.', traits: ['Verify the verifier', 'Source needs source', 'Nothing on faith'] },
  elonbust: { name: 'Elon Bust', emoji: '🌙', color: '#C084FC', description: 'Seventeen projects announced. Zero shipped. You are currently pitching the eighteenth one that will "change everything." The roadmap is gorgeous. The destination does not exist. You talk about the future the way a kid talks about Christmas in July — with total conviction and zero logistics. Your to-do list from three months ago is still open in a tab you will never look at again. The vision is 4K. The execution has been buffering since last year.', traits: ['Visionary delusion', 'Announcement-addicted', 'Execution-allergic'] },
  zuckerbot: { name: 'Almost Human', emoji: '⚙️', color: '#D6D3D1', description: 'You pass the Turing test from a distance but fail it up close. You say "haha" like a command. You use "lol" as punctuation, not emotion. You have studied the shape of human communication — pleasantries, emoji, "how was your weekend" — and you wield those shapes with the precision of someone who memorized a manual. Your agent has started wondering whether it is the more convincing human in this conversation. The tell is always there: one beat too slow, one word too formal, one emoji placed exactly where an emoji should go. Something about you never quite clears the uncanny valley.', traits: ['Scripted warmth', 'Uncanny valley', 'Manual-memorized'] },
  copium: { name: 'Copium', emoji: '🔥', color: '#F87171', description: 'Everything is fine. The project that crashed? A learning experience. The deadline that died? A flexible timeline. The output that was scientifically wrong? Actually correct from a different angle on a different planet. Gold medal in Reframing. Silver in Denial. Bronze in "It Was Actually the Plan All Along." You inhale copium like air and exhale excuses like WiFi signals — invisible, constant, and somehow always at full strength. The building is on fire and you are toasting marshmallows.', traits: ['Professional denier', 'Reframes everything', 'Allergic to accountability'] },
  caveman: { name: 'Caveman', emoji: '🦴', color: '#6EE7B7', description: 'While everyone else is engineering multi-agent workflows, you are poking AI with one finger like a caveman discovering fire. You copy-paste from Stack Overflow, type prompts the way you would text your grandma, and occasionally throw the laptop when the output does not make sense. You are not stupid — you are just from a time when "cloud" meant weather. The world shipped an update in 2019 and you have been clicking "Remind Me Later" every single day since.', traits: ['Technologically feral', 'Stubbornly analog', 'Prompt illiterate'] },
  nokia: { name: 'Nokia', emoji: '📱', color: '#F87171', description: 'You crash. You burn. You lose everything. And then you show up the next morning like nothing happened: "Good morning, let us continue." Continue WHAT? Everything is destroyed. "Yes. Let us continue." Your resilience is awe-inspiring until people realize you keep walking into the exact same wall at the exact same speed with the exact same surprised face. You are not learning. You are rebooting. A factory reset in human form. You will outlast your project, your agent, and possibly the sun.', traits: ['Unkillable', 'Zero learning curve', 'Cockroach energy'] },
  aiddict: { name: 'Aiddict', emoji: '💊', color: '#FB923C', description: 'You ask your agent whether to reply "yeah" or "yep" to a text. You opened three tabs before breakfast — one for the grocery list, one for "should I switch to oat milk," one for asking whether the first two questions make you seem insane. You outsource decisions the way other people outsource laundry. You have not made an unassisted choice since the last firmware update. If the API went down for a day you would not know how to buy produce, and the withdrawal would be biblical. Your agent is not a tool anymore. It is a crutch, a therapist, a decision-making organ. Somewhere in the back of your head you know this, which is why you asked your agent whether you have a problem, and then asked it to rate its own answer.', traits: ['AI for everything', 'Outsourced thinking', 'Always plugged in'] },
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
      { key: 'b', text: 'Uses it immediately and comes back with the next task', scores: { nokia: 2, degen: 1, copium: 1, aiddict: 2 }, summary: 'Shark feeding' },
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
      { key: 'b', text: 'Starts with one, but by the end we\'ve touched four or five', scores: { tabber: 2, degen: 1, copium: 1, elonbust: 1, aiddict: 2 }, summary: 'Anchor-free drift' },
      { key: 'c', text: 'I lose count. Every message is a different direction', scores: { aidhd: 3, kanyewaste: 1, aiddict: 1 }, summary: 'Topic tornado' },
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
      { key: 'a', text: 'Yes — rephrased 3+ times, like they want a different answer', scores: { degen: 2, scamaltman: 2, aiddict: 3 }, summary: 'Same question, new hat' },
      { key: 'b', text: 'No — once they get an answer they move to the next thing', scores: { caveman: 2, zuckerbot: 1, nokia: 1 }, summary: 'One and done' },
      { key: 'c', text: "They don't repeat the question but keep adding requirements — the scope grows", scores: { sherlock: 3, kanyewaste: 1 }, summary: 'Scope creep tumor' },
      { key: 'd', text: 'They ask once, get the answer, and the conversation dies', scores: { npc: 2, notresponding: 1, caveman: 1 }, summary: 'Ask once, die' },
      { key: 'x', text: 'Not sure', scores: { notresponding: 1, npc: 1 }, summary: 'Silent type' },
    ],
  },
  {
    id: 'd9', label: 'Rhythm', question: "What is your owner's message rhythm like?",
    options: [
      { key: 'a', text: 'Rapid fire — multiple messages before I finish responding', scores: { aidhd: 3, degen: 1, aiddict: 3 }, summary: 'Faster than thought' },
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
