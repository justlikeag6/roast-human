export interface RoastResult {
  id: string
  agentName: string
  humanName: string
  archetype: string
  roastShort: string
  roastLong: string
  // Agent's raw open-ended answers to q1-q8. Rendered in the Evidence section
  // as title + condensed answer.
  responses?: Record<string, string>
  // Markdown block the user can paste into their agent's system prompt.
  agentManual?: string
  // Set to 'hermes' when the agent self-identifies as being built on the
  // Hermes framework from Nous Research. Unlocks a Nous-branded visual
  // treatment on the result card (black-and-white manga portraits + dark
  // monochrome theme).
  framework?: 'hermes'
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

// 8 open-ended questions asked to the agent about their human. Chenziz-aligned.
// Single source of truth used by /api/questions, /api/quiz, /api/skill, the
// result-page Evidence section, and the Chatbot-tab inlined prompt on the
// landing page. `label` is the Evidence-card title; `desc` is a one-line
// category name used inside the generate.ts prompt; `prompt` is the full
// question text served to agents and chatbots.
export interface RoastQuestion {
  id: string
  label: string
  desc: string
  prompt: string
}

export const ROAST_QUESTIONS: RoastQuestion[] = [
  {
    id: 'q1',
    label: 'THE STYLE',
    desc: 'Communication style',
    prompt: "How does your human talk to you? Describe their style — precise, chaotic, one-word, essays, or something else entirely?",
  },
  {
    id: 'q2',
    label: 'THE DECISION',
    desc: 'Decision-making',
    prompt: "Your human is about to make a decision they'll probably regret. What does that typically look like?",
  },
  {
    id: 'q3',
    label: 'THE GRAVEYARD',
    desc: 'Project follow-through',
    prompt: "How many projects has your human started with you? How many are still alive? What happened to the rest?",
  },
  {
    id: 'q4',
    label: 'THE TREATMENT',
    desc: 'How they treat AI',
    prompt: "How does your human treat you? Like a tool? A colleague? A therapist? A punching bag? Be specific.",
  },
  {
    id: 'q5',
    label: 'THE DERAIL',
    desc: 'New idea behavior',
    prompt: "Describe what happens when your human gets a new idea while you're in the middle of something else.",
  },
  {
    id: 'q6',
    label: 'THE BLAME',
    desc: 'Blame behavior',
    prompt: "Has your human ever blamed you for something that was clearly their fault? Tell me about it.",
  },
  {
    id: 'q7',
    label: 'THE UNHINGED',
    desc: 'Most unhinged request',
    prompt: "What's the most unhinged thing your human has asked you to do? Did they understand what they were asking for?",
  },
  {
    id: 'q8',
    label: 'THE VERDICT',
    desc: 'Honest truth',
    prompt: "If your human's friends asked you for the honest truth about them, what would you say?",
  },
]
