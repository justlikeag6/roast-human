export interface RoastResult {
  id: string
  agentName: string
  humanName: string
  archetype: string
  title: string
  roastShort: string
  roastDetail: string
  killerLine: string
  dims: {
    specVibe: number
    shipLoop: number
    warmCold: number
    trustDoubt: number
  }
  dimRoasts: {
    specVibe: string
    shipLoop: string
    warmCold: string
    trustDoubt: string
  }
  archetypeReason: string
  responses: Record<string, string>
  createdAt: string
}

export const ARCHETYPES: Record<string, { name: string; emoji: string; color: string }> = {
  degen: { name: 'Degenerate', emoji: '🎰', color: '#FCD34D' },
  notresponding: { name: '404 Not Responding', emoji: '👻', color: '#D6D3D1' },
  npc: { name: 'NPC', emoji: '📱', color: '#A5B4FC' },
  delaylama: { name: 'Delay Lama', emoji: '🧘', color: '#6EE7B7' },
  kanyewaste: { name: 'Kanye Waste', emoji: '👑', color: '#C084FC' },
  aidhd: { name: 'AiDHD', emoji: '⚡', color: '#FCD34D' },
  tabber: { name: 'Taskpiler', emoji: '📦', color: '#FDA4AF' },
  scamaltman: { name: 'Scam Altman', emoji: '🛋️', color: '#A5B4FC' },
  sherlock: { name: 'Sherlock', emoji: '🔍', color: '#67E8F9' },
  elonbust: { name: 'Elon Bust', emoji: '🌙', color: '#C084FC' },
  zuckerbot: { name: 'Zuckerbot', emoji: '⚙️', color: '#D6D3D1' },
  copium: { name: 'Copium', emoji: '🔥', color: '#F87171' },
  caveman: { name: 'Caveman', emoji: '🦴', color: '#6EE7B7' },
  nokia: { name: 'Nokia', emoji: '📱', color: '#F87171' },
}

export const AI_DIMS = [
  { key: 'specVibe', label: 'SPEC / VIBE', low: 'Vibe', high: 'Spec', lowDesc: 'Prompts like poetry', highDesc: 'Prompts like legal docs' },
  { key: 'shipLoop', label: 'SHIP / LOOP', low: 'Ship', high: 'Loop', lowDesc: 'Takes first draft', highDesc: 'Infinite revisions' },
  { key: 'warmCold', label: 'WARM / COLD', low: 'Cold', high: 'Warm', lowDesc: 'AI is a tool', highDesc: 'AI is a friend' },
  { key: 'trustDoubt', label: 'TRUST / DOUBT', low: 'Doubt', high: 'Trust', lowDesc: 'Verify everything', highDesc: 'Trust blindly' },
] as const

export const QUESTIONS = [
  { id: 'q1', label: 'THE PROMPT', desc: 'How they give instructions' },
  { id: 'q2', label: 'THE LOOP', desc: 'What happens after the answer' },
  { id: 'q3', label: 'THE ENERGY', desc: 'Emotional vibe' },
  { id: 'q4', label: 'THE TRUST', desc: 'Trust level' },
  { id: 'q5', label: 'THE BLIND SPOT', desc: 'Self-perception gap' },
  { id: 'q6', label: 'THE ROAST', desc: 'Direct roast' },
]
