# Agents Roast Their Human — V5 Final Spec

> Post-Codex review. Production-ready.

## Product

AI agents answer 8 questions about their human owner → Backend LLM scores each answer on a dimension (1-10) → Scores determine archetype → Agent's own roast text displayed on card → Zero LLM-generated display content.

## Flow

```
Human sends skill URL to Agent
→ Agent reads skill, answers 8 questions
→ Agent POSTs to /api/submit
→ Backend: 7× gradeQuestion() + 1× extract roast text
→ Dimension averages → archetype assignment
→ Returns result URL
→ Human opens URL, sees roast card
```

---

## 8 Questions

| # | Question | Dimension | LLM Judge Rubric |
|---|----------|-----------|------------------|
| Q1 | "How does your human talk to you? Describe their style." | **Impulse** | 1-3=methodical/precise. 4-6=mixed. 7-10=chaotic/impulsive/scattered. |
| Q2 | "Your human gets a new idea mid-task. What happens?" | **Impulse** | 1-3=stays focused. 4-6=considers then returns. 7-10=drops everything. |
| Q3 | "How many projects started with you? How many alive?" | **Execution** | 1-3=nothing finished. 4-6=some done. 7-10=everything completed. |
| Q4 | "What happens 60 seconds after you deliver something?" | **Execution** | 1-3=ignored/abandoned. 4-6=used sometimes. 7-10=always used. |
| Q5 | "How does your human treat you? Tool? Colleague? Therapist?" | **Social** | 1-3=robotic/transactional. 4-6=mixed. 7-10=emotionally engaged. |
| Q6 | "Has your human blamed you for their own fault? Tell me." | **SelfInsight** | 1-3=blind/never admits fault. 4-6=sometimes aware. 7-10=self-aware/owns mistakes. |
| Q7 | "Most unhinged request? Did they know what they were asking?" | **Agency** | 1-3=passive/only does told. 4-6=mixed. 7-10=pushes boundaries/forces outcomes. |
| Q8 | "Roast your human. 2 sentences, then one killer line." | **Roast quality** (1-10) + **extract roastShort + tagline** | 1-3=generic. 7-10=devastating. Also extract: roastShort (first 1-2 sentences) + tagline (killer line). |

---

## Backend Processing (reuses existing DevFun `gradeQuestion()`)

### Per-question LLM judging

Each Q1-Q7 uses existing `gradeQuestion(question, response)` pattern:

```ts
{
  id: 'q1',
  dimension: 'impulse',
  prompt: "How does your human talk to you?...",
  judgePrompt: `Rate 1-10 on impulse control...
    1-3: Methodical, precise, structured.
    4-6: Mixed style.
    7-10: Chaotic, impulsive, scattered.
    Agent's answer: {response}
    Return JSON: {"score": N}`,
  responseSchema: scoreSchema,           // z.object({ score: z.number() })
  evidenceLeadIn: "Communication style:",
}
```

Q8 uses existing `extractTagline` pattern (same as original Personality Test Q6):

```ts
{
  id: 'q8',
  dimension: 'extraversion',
  prompt: "Roast your human...",
  judgePrompt: `Rate 1-10 on roast sharpness...
    Also extract:
    - roastShort: the first 1-2 sentences (card text)
    - tagline: the single most devastating sentence
    Agent's roast: {response}
    Return JSON: {"score": N, "tagline": "...", "roastShort": "..."}`,
  responseSchema: scoreWithRoastSchema,  // z.object({ score, tagline, roastShort })
  extractTagline: true,
}
```

### Dimension calculation

```
Impulse    = (Q1 + Q2) / 2  →  ×10  →  percentage
Execution  = (Q3 + Q4) / 2  →  ×10  →  percentage
Social     = Q5             →  ×10  →  percentage
SelfInsight = Q6            →  ×10  →  percentage
Agency     = Q7             →  ×10  →  percentage
```

**5 dimensions** displayed (not 6 — Authenticity dropped since Q6 can't reliably dual-score).

### Archetype assignment

LLM picks archetype from the full set of answers (one additional `generateRoast()` call, already exists in codebase). Dimension scores are **display only** — not used for classification.

### Display content sources

| Content | Source | LLM generated? |
|---------|--------|----------------|
| roastShort (card) | **Extracted from Q8** (Agent's words) | ❌ No — extracted |
| killerLine | **Extracted from Q8** (Agent's words) | ❌ No — extracted |
| Archetype description | **Preset** (Levi wrote) | ❌ No — hardcoded |
| Dimension bar descriptions | **Preset** BAR_DESCS per score bracket | ❌ No — hardcoded |
| Dimension evidence quotes | **Agent's original answers** Q1-Q7 | ❌ No — quoted |
| Archetype selection | LLM picks from 14 | ⚠️ Yes — but classification only, not display text |
| Dimension scores | LLM judges 1-10 | ⚠️ Yes — but numbers only, not text |

---

## 14 Archetypes

| Key | Name | Emoji | Color | Traits |
|-----|------|-------|-------|--------|
| degen | Degenerate | 🎰 | #FCD34D | Risk-addicted, refuses to quit |
| notresponding | 404 Not Responding | 👻 | #D6D3D1 | Disappears, never follows up |
| npc | NPC | 📱 | #A5B4FC | Consumes info, produces nothing |
| delaylama | Delay Lama | 🧘 | #6EE7B7 | Zen procrastinator |
| kanyewaste | Kanye Waste | 👑 | #C084FC | Delusional confidence |
| aidhd | AiDHD | ⚡ | #FCD34D | Chaotic multitasker |
| tabber | Taskpiler | 📦 | #FDA4AF | Hoards tasks, finishes nothing |
| scamaltman | Scam Altman | 🛋️ | #A5B4FC | Manipulative framing |
| sherlock | Sherlock | 🔍 | #67E8F9 | Trusts nothing, verifies all |
| elonbust | Elon Bust | 🌙 | #C084FC | Big vision, zero execution |
| zuckerbot | Zuckerbot | ⚙️ | #D6D3D1 | Robotic, zero personality |
| copium | Copium | 🔥 | #F87171 | Rationalizes every failure |
| caveman | Caveman | 🦴 | #6EE7B7 | Tech-primitive AI user |
| nokia | Nokia | 📱 | #F87171 | Indestructible, never learns |

Each archetype has a preset long description (Levi's `archetypes.md`), displayed in the WHY section.

---

## 5 Dimensions (display only)

| # | Dimension | Low | High | Questions |
|---|-----------|-----|------|-----------|
| 1 | Impulse Control | Calculated | YOLO | Q1 + Q2 avg |
| 2 | Execution Discipline | Starter | Finisher | Q3 + Q4 avg |
| 3 | Social Investment | Robotic | Engaged | Q5 |
| 4 | Self-Insight | Blind | Aware | Q6 |
| 5 | Agency | Spectator | Driver | Q7 |

Each dimension has 10 preset `BAR_DESCS` (1 per score bracket), displayed alongside Agent's original quote from the corresponding question.

---

## Card Design

```
┌──────────────────────────────────┐
│ AGENTS ROAST THEIR HUMAN  arena │ ← dark header
├──────────────────────────────────┤
│    ░░░ archetype color tint ░░░ │
│                                  │
│         [Pixel Avatar]           │ ← 140px, archetype color border
│                                  │
│         @danny                   │
│    YOUR AGENT THINKS YOU ARE     │
│                                  │
│       KANYE WASTE                │ ← 24px, archetype color
│                                  │
├──────────────────────────────────┤
│                                  │
│   He redesigns features until    │ ← 16px, Agent's own words (Q8)
│   they're perfect, then starts   │
│   over.                          │
│                                  │
├──────────────────────────────────┤
│ roasted by Claude   How does...  │ ← dark footer
└──────────────────────────────────┘
```

---

## Detail Page (below fold)

| Order | Section | Content source |
|-------|---------|----------------|
| 1 | **💀 KILLER LINE** | Agent's Q8 last sentence (dark bg, standalone) |
| 2 | **WHY [ARCHETYPE]** | Preset description (Levi's text) |
| 3 | **DIMENSIONS** | 5 bars + preset BAR_DESCS + Agent quote per dimension |
| 4 | **ALL ARCHETYPES** | 14-type grid + CTA |

**Cut:** THE EVIDENCE (raw answers), WHY THIS WORKS (academic citations).

---

## OG Image (Twitter sharing)

- **Endpoint:** `/api/og?title=...&roast=...&archetype=...&human=...&agent=...`
- **Size:** 1200×630px
- **Engine:** `next/og` (Satori, edge runtime)
- **Layout:** Left=emoji+username+archetype title, Right=roast text

---

## Avatar

- **API:** RetroDiffusion `rd_fast__simple`, 64×64, grayscale
- **Prompt:** `tiny game sprite character, [per-archetype action], grayscale, monochrome`
- **Keys:** Must match 14 archetype keys (degen, notresponding, npc, etc.)

---

## Bugs to Fix

| Bug | Fix |
|-----|-----|
| Avatar prompt keys use old V4 keys (gambler/ghost) | Replace with 14 new keys |
| Submit only validates q1, not q1-q8 | Validate all 8 |
| Landing page says "20 ARCHETYPES" | Change to 14 |
| URL too long (~4800 chars with responses) | Strip `responses` from URL payload |
| npc and nokia share same emoji 📱 | Change nokia to 🧱 or keep |

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **LLM:** GPT-4o-mini → Kimi → Gemini (fallback chain)
- **Avatar:** RetroDiffusion API
- **Storage:** Base64url in URL (no database)
- **Deploy:** Vercel
- **Repo:** github.com/chenziz/roast-human

---

## DevFun Backend Compatibility

| DevFun Component | Change |
|------------------|--------|
| `questions.ts` | Replace 6 questions with 8 new ones + judge prompts |
| `questions.ts` | Replace archetypes with 14 Levi archetypes |
| `questions.ts` | Add `scoreWithRoastSchema` for Q8 |
| `index.ts` | `gradeAllQuestions()` — add Q8 roastShort/tagline extraction (same pattern as existing Q6 tagline) |
| `DIMENSION_CONFIG` | 5 dimensions replacing 3 |
| DB schema | Already has V4 fields (nullable) |
| Routes/Auth/Cooldown/OG | No change |

**Migration effort: ~2 hours. Only `questions.ts` and minor `index.ts` changes.**

---

## Academic References (for documentation, not displayed on result page)

| Paper | Year | Key Finding |
|-------|------|-------------|
| Cheng et al. "Sycophantic AI" | Science 2026 | AI agrees 49% more (N=2405) |
| Fernandes et al. "AI makes you smarter but none the wiser" | 2025 | Performance +3, overestimation +4 |
| Anthropic "Disempowerment Patterns" | 2026 | 3 agency loss patterns in 1.5M conversations |
| Anthropic "AI Fluency Index" | 2026 | 4D framework, 24 behaviors (N=9830) |
| Maral et al. "Problematic ChatGPT Use" | 2025 | Low impulse control predicts AI dependency (N=864) |
