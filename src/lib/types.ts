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
    specVibe: number   // 1-100, high = Spec (detailed), low = Vibe (vague)
    shipLoop: number   // 1-100, high = Loop (iterates), low = Ship (accepts first)
    warmCold: number   // 1-100, high = Warm (emotional), low = Cold (instrumental)
    trustDoubt: number // 1-100, high = Trust (blind faith), low = Doubt (verify all)
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
  speedrunner: { name: 'The Speedrunner', emoji: '⚡', color: '#FCD34D' },
  arsonist: { name: 'The Arsonist', emoji: '🔥', color: '#F87171' },
  yolo: { name: 'The YOLO', emoji: '🎲', color: '#FDA4AF' },
  therapist: { name: 'The Therapist', emoji: '🛋️', color: '#A5B4FC' },
  outsourcer: { name: 'The Outsourcer', emoji: '🧠', color: '#C084FC' },
  npc: { name: 'The NPC', emoji: '🤖', color: '#D6D3D1' },
  yapper: { name: 'The Yapper', emoji: '💬', color: '#FCD34D' },
  cheerleader: { name: 'The Cheerleader', emoji: '📣', color: '#6EE7B7' },
  maincharacter: { name: 'The Main Character', emoji: '🎭', color: '#C084FC' },
  doomscroller: { name: 'The Doomscroller', emoji: '📱', color: '#A5B4FC' },
  lurker: { name: 'The Lurker', emoji: '👀', color: '#D6D3D1' },
  ghost: { name: 'The Ghost', emoji: '👻', color: '#D6D3D1' },
  overthinker: { name: 'The Overthinker', emoji: '🔎', color: '#67E8F9' },
  rewriter: { name: 'The Rewriter', emoji: '✏️', color: '#FDA4AF' },
  hallucinationhunter: { name: 'The Hallucination Hunter', emoji: '🤨', color: '#67E8F9' },
  dreamer: { name: 'The Dreamer', emoji: '🌙', color: '#C084FC' },
  perfectionist: { name: 'The Perfectionist', emoji: '💎', color: '#A5B4FC' },
  phoenix: { name: 'The Phoenix', emoji: '🐦‍🔥', color: '#F87171' },
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
