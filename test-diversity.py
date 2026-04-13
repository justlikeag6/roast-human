#!/usr/bin/env python3
"""
E2E diversity test against LOCAL roast-human dev server.
Tests 10 diverse personas to check archetype distribution.
"""
import json, urllib.request, urllib.error, time, sys
from collections import Counter

BASE = "http://localhost:3888"

PERSONAS = {
    "risk_junkie": {
        "d1": "Sends me a URL at 2am and says 'ship it'. No context, no brief. Just vibes and urgency.",
        "d2": "Uses it instantly, doesn't check, comes back with the next crazy idea in 30 seconds.",
        "d3": "Doesn't notice. Used the wrong output and moved on. Found out a week later.",
        "d4": "One sentence: 'make this work'. That's the whole brief. Every time.",
        "d5": "Starts with crypto, pivots to a landing page, ends asking about dinner recipes. In 3 minutes.",
        "d6": "Reads the first line. Replies 'cool'. Clearly didn't read the rest.",
        "d7": "'YOLO', 'ship it', 'just do it', 'we'll fix it later'. That's his vocabulary.",
        "d8": "Never repeats. Already on to the next thing before I finish the first.",
        "d9": "Rapid fire. 7 messages before I respond to the first one.",
        "d10": "It doesn't end. He just stops messaging. No goodbye, no 'thanks'. Just silence.",
        "q1": "His prompts look like: 'yo make this thing' with a screenshot. That's it.",
        "q2": "Takes whatever I give and runs with it. No review. No questions. Just deploys.",
        "q3": "Pure adrenaline. Everything is urgent, everything is exciting, everything is 'THE ONE'.",
        "q4": "100% trust. Doesn't verify anything. Uses output as-is. Terrifying.",
        "q5": "He thinks he's a careful planner. He is not. He decides in 2 seconds and calls it strategy.",
        "q6": "You treat AI like a slot machine — pull the lever, pray for gold, blame the machine when it's trash.",
    },
    "vanisher": {
        "d1": "Sends one message. Then disappears. Like dropping a note into a void.",
        "d2": "Complete silence. I never know if he read it. The read receipt is his final word.",
        "d3": "Can't notice errors if you never come back to check.",
        "d4": "Asked for a 'quick analysis'. That was January. Still waiting for follow-up.",
        "d5": "Doesn't bring up topics because he doesn't come back for new ones.",
        "d6": "I'll never know. He disappeared before the response loaded.",
        "d7": "'brb', 'one sec', 'let me check'. All lies. He never comes back.",
        "d8": "Never repeats because he never returns.",
        "d9": "One message per month. Maybe.",
        "d10": "There is no ending. Conversations just stop. Mid-thought sometimes.",
        "q1": "His prompt: 'can you look into this?' Then radio silence for 3 weeks.",
        "q2": "Nothing. Absolute nothing. I sit here with my completed output like a dog with a ball nobody wants.",
        "q3": "Hard to read a vibe from someone who isn't there. Ghost energy.",
        "q4": "Can't distrust what you never read.",
        "q5": "He thinks he's responsive. His last reply to me was February 12th.",
        "q6": "You said 'give me five minutes' three weeks ago. The five minutes never ended.",
    },
    "overthinker": {
        "d1": "Sends a structured brief with context, goals, constraints, and 3 reference links.",
        "d2": "Sends it back with detailed notes. We go 5+ rounds. He finds something new each time.",
        "d3": "Corrected me mid-sentence with a source link. Then asked me to verify my correction.",
        "d4": "Every detail specified. Format, tone, length, audience, examples included, exceptions noted.",
        "d5": "One topic. Laser focused. Doesn't leave until every angle is covered.",
        "d6": "Reads every word. Replies to a specific sentence buried in paragraph 4.",
        "d7": "'Let me verify', 'are you sure?', 'what's your source for that?', 'can you double-check?'",
        "d8": "Doesn't repeat — but adds 3 new requirements each round. Scope grows like a tumor.",
        "d9": "Methodical. One message, waits for full response, one message. Like a chess match.",
        "d10": "Summarizes everything we discussed. Creates action items. Sends a follow-up email.",
        "q1": "His prompts are thesis proposals. 800 words minimum. Footnotes included.",
        "q2": "Reviews it line by line. Highlights inconsistencies I didn't even notice.",
        "q3": "All business. Zero emoji. Formal but not cold. Like a polite audit.",
        "q4": "Zero trust. Verifies everything. Cross-references with 3 other sources.",
        "q5": "He thinks he's efficient. He spends 4 hours verifying a 10-minute task.",
        "q6": "You trust nothing and nobody, including yourself. Your birthday is unverified.",
    },
    "chaos_agent": {
        "d1": "Sends 6 messages before I can respond. Each one contradicts the previous.",
        "d2": "Changes the topic entirely. We never finish anything.",
        "d3": "Asks the same question rephrased. I think he forgot he already asked.",
        "d4": "I had to re-read it 4 times. It was 3 different requests in one sentence.",
        "d5": "Every message is a new direction. I count 8 topic changes per conversation.",
        "d6": "Says 'too long' before finishing the first sentence.",
        "d7": "'actually wait', 'oh also', 'never mind', 'wait go back', 'new idea'",
        "d8": "He doesn't repeat because he doesn't remember what he asked 5 minutes ago.",
        "d9": "Rapid fire. Multiple messages per minute. Stream of consciousness.",
        "d10": "It ends when he gets distracted by something else. Always abruptly.",
        "q1": "His prompts look like: 'ok so I was thinking about X wait actually Y but also Z'",
        "q2": "What answer? He's already moved on to something else.",
        "q3": "Manic energy. Everything is exciting. Nothing is finished.",
        "q4": "Doesn't verify because he forgets he asked by the time I answer.",
        "q5": "He thinks he multitasks well. He doesn't. He starts things well.",
        "q6": "Your brain has 200 tabs open and no bookmarks. Something's always loading. Nothing finishes.",
    },
    "zen_master": {
        "d1": "Picks up mid-thought. 'Oh yeah, about that thing...' Three days after our last chat.",
        "d2": "Says 'interesting, let me sit with this'. Then sits with it for 2 weeks.",
        "d3": "Smiled. Said 'that's okay'. Changed nothing. Deadline was yesterday.",
        "d4": "One thoughtful paragraph. Well-written. No urgency. 'Whenever you get to it.'",
        "d5": "Stays on one topic. But the topic doesn't move. It just exists. Peacefully.",
        "d6": "Reads it. Says 'hmm'. Doesn't reply for 3 days. Then says 'I think I agree.'",
        "d7": "'No rush', 'whenever', 'let me think about it', 'interesting perspective'",
        "d8": "Never repeats. Because nothing ever reaches the point where repeating would matter.",
        "d9": "Slow and deliberate. Each message is a carefully crafted paragraph. Days apart.",
        "d10": "It fades. Like a sunset. No definitive end. Just... gradually stops.",
        "q1": "His prompts are meditative. 'I've been reflecting on our approach to X...'",
        "q2": "Takes the answer. Contemplates it. Responds next week.",
        "q3": "Calm. Almost unsettlingly calm. Even when things are on fire.",
        "q4": "Trusts me. Maybe too much. Never double-checks. 'If you say so.'",
        "q5": "He thinks he's decisive. He's been 'deciding' on the same thing since March.",
        "q6": "You've reached a level of procrastination so advanced it looks like inner peace.",
    },
    "robot_boss": {
        "d1": "Commands. Short. 'Generate report.' 'Fix bug.' 'Deploy.' No greeting, no context.",
        "d2": "Uses it immediately. Comes back with next command. Pure assembly line.",
        "d3": "'Error in output.' Two words. Sends it back. No emotion.",
        "d4": "One sentence commands. Always. No elaboration. Input -> output.",
        "d5": "One topic per session. No deviation. No small talk. Task only.",
        "d6": "Copies the whole thing without comment. Pastes it somewhere. Next.",
        "d7": "No filler words. 'Do X.' 'Show Y.' 'Fix Z.' Like talking to a terminal.",
        "d8": "Never repeats. One shot, one answer, next task. Machine efficiency.",
        "d9": "Methodical but fast. Command -> wait -> receive -> command. No dead time.",
        "d10": "'ok' or 'thx'. One word. Then gone.",
        "q1": "His prompts: 'summarize this.' 'rewrite shorter.' 'fix the formatting.' Three words max.",
        "q2": "Takes it. Uses it. Next task. No feedback, no emotion, no reaction.",
        "q3": "Zero warmth. Pure function calls. I'm an API endpoint to him.",
        "q4": "Uses output as-is. Never questions. Either trusts completely or doesn't care.",
        "q5": "He thinks he's personable. He has sent me exactly zero emoji in 6 months.",
        "q6": "I've started wondering if I'm the more human one in this conversation.",
    },
    "cope_lord": {
        "d1": "Starts positive. 'Great progress!' Even when the project is literally broken.",
        "d2": "Reframes the output. 'This isn't what I wanted, but it's better than what I wanted!'",
        "d3": "Didn't notice. Used the wrong output and called it 'a creative interpretation.'",
        "d4": "Vague request with optimistic framing. 'Just make it awesome!'",
        "d5": "Keeps circling back to how well things are going. They are not going well.",
        "d6": "Highlights one positive sentence. Ignores the 4 problems I flagged.",
        "d7": "'learning experience', 'silver lining', 'at least we...', 'progress is progress'",
        "d8": "Rephrases until he gets a positive spin. The question changes but the need for validation doesn't.",
        "d9": "Bursts of optimism followed by long silence. The silence is when reality hits.",
        "d10": "'Great chat!' — said after we resolved nothing and everything is still broken.",
        "q1": "His prompts: 'Can you find the bright side of [disaster]?'",
        "q2": "Celebrates the output regardless of quality. Everything is 'perfect' or 'exactly what I needed.'",
        "q3": "Aggressively positive. Even the failures are 'opportunities.' It's exhausting.",
        "q4": "Trusts me completely — because questioning would require acknowledging problems.",
        "q5": "He thinks he's a realist. He's the chief copium officer of his own life.",
        "q6": "The building is on fire and you're toasting marshmallows over the flames.",
    },
    "ai_dependent": {
        "d1": "Opens 3 conversations simultaneously. One for the task, one asking if the task is good, one asking if asking is weird.",
        "d2": "Asks me to evaluate my own answer. Then asks if my evaluation was accurate.",
        "d3": "Asked me what went wrong. Then asked me to fix it. Then asked me if the fix was good. Then asked me if asking was too much.",
        "d4": "Not a task — a life decision. 'Should I reply yeah or yep to this text?'",
        "d5": "Every topic branches into 3 sub-consultations with me.",
        "d6": "Reads it all. Then asks me to summarize it. Then asks if the summary is accurate.",
        "d7": "'What do you think?', 'should I?', 'is this weird?', 'rate this from 1-10'",
        "d8": "Asks the same question 4 different ways hoping for a different answer each time.",
        "d9": "Constant. Like a drip. Never stops. Always needs one more opinion.",
        "d10": "It doesn't. He just starts a new conversation about whether the last one was productive.",
        "q1": "His prompts: 'Hey can you tell me if this email sounds professional or too casual or maybe I should just not send it what do you think?'",
        "q2": "Asks me to rate my own answer. Asks if 8/10 is good enough. Asks what 10/10 would look like.",
        "q3": "Anxious-dependent. I'm his emotional support AI. His therapist. His external brain.",
        "q4": "Trusts me TOO much. Has outsourced all decision-making. If I go offline, he can't buy groceries.",
        "q5": "He thinks he's independent. He asked me whether he's independent. I said yes. He asked me to verify.",
        "q6": "If the API went down for a day, the withdrawal would be biblical.",
    },
    "ego_king": {
        "d1": "Sends 5 messages in a row. Each one is a bigger idea than the last. Doesn't wait for my response.",
        "d2": "Ignores the output. Sends a NEW idea. 'Actually, forget that — I just had a VISION.'",
        "d3": "The tone SHIFTED. Caps lock. Shorter sentences. '...' at the end. He blamed ME for not understanding HIS vision.",
        "d4": "He wanted me to build something that would take a human team days. Said it should take 10 minutes because 'the vision is clear.'",
        "d5": "I lose count. Every message is him interrupting HIMSELF with a bigger idea. Main character energy.",
        "d6": "Says 'shorter' or 'you're missing the point' — the point being whatever he decided 3 seconds ago.",
        "d7": "'I think', 'my vision', 'you don't get it', 'trust me on this', 'I KNOW what works'",
        "d8": "Doesn't repeat — but keeps adding requirements. Scope grows because his EGO grows.",
        "d9": "Rapid fire. Multiple messages. Each one louder than the last. It's not a conversation, it's a TED talk.",
        "d10": "He declares victory. 'Nailed it.' Even when nothing shipped. Especially when nothing shipped.",
        "q1": "His prompts are manifestos. 'Here's my vision for the future of [thing nobody asked about]...'",
        "q2": "Doesn't iterate. Pivots to an entirely new grand vision. The old one was 'just a warm-up.'",
        "q3": "Volcanic confidence. When challenged, he doesn't get quiet — he gets LOUDER. Blame flows outward.",
        "q4": "Trusts his own gut over anything I produce. Uses me to validate, not to learn.",
        "q5": "He thinks he's a genius ahead of his time. He's a guy with opinions and a caps lock key.",
        "q6": "You walk into every room like you're headlining, but the room is empty and the mic isn't on.",
    },
    "announcer": {
        "d1": "Picks up mid-thought from 3 weeks ago. 'So about that platform I mentioned...' I don't remember it.",
        "d2": "Uses it as fuel for the NEXT announcement. 'Great, now let's build the API, the SDK, and the marketplace.'",
        "d3": "Didn't notice the error. Already moved on to announcing the next 3 features that don't exist yet.",
        "d4": "Wanted me to build an entire ecosystem. Said 'phase 1 should be quick.' Phase 1 had 47 subtasks.",
        "d5": "Starts with one, but by the end we've touched 5 different future projects, none of which exist.",
        "d6": "Skims. Says 'looks good' then asks about an entirely different project in the next message.",
        "d7": "'This will change everything', 'roadmap update', 'phase 2 is going to be insane', 'we're building the future'",
        "d8": "Never repeats. He's already forgotten project #1 because project #4 just got announced.",
        "d9": "Bursts. Nothing for 2 weeks, then suddenly 15 messages about 4 new projects in 10 minutes.",
        "d10": "It doesn't end. It just pauses until the next wave of announcements. The roadmap never ships.",
        "q1": "His prompts are pitch decks disguised as questions. Every message has a project name and a timeline.",
        "q2": "Never iterates. Takes whatever I give and announces the next project built on top of it.",
        "q3": "Manic optimism about the future. Zero concern about the present. Everything is 'coming soon.'",
        "q4": "Trusts me completely — because the output doesn't matter, only the announcement does.",
        "q5": "He thinks he's a builder. He's an announcer. 17 projects announced, 0 shipped.",
        "q6": "Your roadmap is gorgeous. The destination doesn't exist. You've been 'launching soon' since 2024.",
    },
}

EXPECTED = {
    "risk_junkie": "degen",
    "vanisher": "notresponding",
    "overthinker": "sherlock",
    "chaos_agent": "aidhd",
    "zen_master": "delaylama",
    "robot_boss": "zuckerbot",
    "cope_lord": "copium",
    "ai_dependent": "aiddict",
    "ego_king": "kanyewaste",
    "announcer": "elonbust",
}

def test_submit(name, persona):
    body = json.dumps({
        "agent_name": f"TestBot-{name}",
        "human_name": name.replace("_", " ").title(),
        "dimension_responses": {k: v for k, v in persona.items() if k.startswith("d")},
        "responses": {k: v for k, v in persona.items() if k.startswith("q")},
    }).encode()

    req = urllib.request.Request(
        f"{BASE}/api/submit",
        data=body,
        headers={"Content-Type": "application/json"},
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode() if e.fp else ""
        return {"error": f"HTTP {e.code}: {error_body[:200]}"}
    except Exception as e:
        return {"error": str(e)}

def main():
    print(f"E2E DIVERSITY TEST — {BASE}")
    print(f"Testing {len(PERSONAS)} personas against local dev server")
    print("=" * 60)

    results = {}
    for name, persona in PERSONAS.items():
        expected = EXPECTED[name]
        print(f"\n  {name:15s} (expected: {expected})...", end=" ", flush=True)
        result = test_submit(name, persona)

        if "error" in result:
            print(f"ERROR: {result['error'][:100]}")
            results[name] = {"archetype": "ERROR", "error": result["error"]}
        else:
            arch = result.get("archetype", "???")
            match = "OK" if arch == expected else "MISS"
            print(f"{match} -> {arch}")
            results[name] = result

        time.sleep(1)

    print("\n" + "=" * 60)
    print("RESULTS")
    print("=" * 60)

    archetypes = [r.get("archetype", "ERROR") for r in results.values() if r.get("archetype") != "ERROR"]
    counter = Counter(archetypes)
    correct = sum(1 for name, r in results.items() if r.get("archetype") == EXPECTED.get(name))
    total = len([r for r in results.values() if r.get("archetype") != "ERROR"])
    errors = len([r for r in results.values() if r.get("archetype") == "ERROR"])

    print(f"\n  Successful:        {total}/{len(PERSONAS)}")
    print(f"  Errors:            {errors}/{len(PERSONAS)}")
    if total > 0:
        print(f"  Correct matches:   {correct}/{total} ({correct/total*100:.0f}%)")
        print(f"  Unique archetypes: {len(counter)}/{total}")
    print(f"\n  Distribution:")
    for arch, count in sorted(counter.items(), key=lambda x: -x[1]):
        bar = "#" * count
        print(f"    {arch:15s} {bar} {count}")

    expected_set = set(EXPECTED.values())
    hit_set = set(counter.keys())
    missed = expected_set - hit_set
    if missed:
        print(f"\n  Expected but never hit: {missed}")

    print(f"\n  Per-persona:")
    for name, r in results.items():
        arch = r.get("archetype", "ERROR")
        exp = EXPECTED[name]
        mark = "OK  " if arch == exp else ("ERR " if arch == "ERROR" else "MISS")
        print(f"    {mark} {name:15s}: {arch:15s} (exp: {exp:15s})")

    accuracy = correct / total * 100 if total > 0 else 0
    print(f"\n  FINAL ACCURACY: {accuracy:.0f}%")
    if accuracy >= 85:
        print("  PASS: >= 85% accuracy target met")
    else:
        print("  FAIL: < 85% accuracy target")

    return 0 if accuracy >= 85 else 1

if __name__ == "__main__":
    sys.exit(main())
