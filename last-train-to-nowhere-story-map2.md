# The 11:59 Club — Book 1: The Last Train to Nowhere
*A Choose-Your-Scare Adventure*

Story map skeleton — golden path, endings, and remembered-choice hooks.

---

## 1. Golden Path (the "correct" full playthrough)

This is the safest, most complete route through the story — the one a careful, observant reader can find. It should still feel tense, but it's the path that rewards paying attention to early details (especially the two remembered choices below).

1. **11:58 PM — The Last Car.** Protagonist is half-asleep on the train home, phone buzzing with a text from a friend they blew off earlier that night. They almost miss their stop.
2. **The Missed Stop.** They bolt off the doors just as they close — onto a platform that's wrong. Too quiet. No station name they recognize.
3. **The Empty Platform.** Every other passenger who got off with them has vanished. A **vending machine** hums under a flickering light — it can be examined (sets up remembered choice #1, the flashlight/item).
4. **The Girl.** A girl about their age is sitting on a bench like she's been waiting. She says: *"You already got off this train once."* She won't explain, but she's not hostile — she's a guide, if trusted.
5. **The Station Map.** A wall map shows exits — but the exits are different every time you look away. Golden path: reader learns to trust the girl's directions over the map.
6. **The Locked Conductor's Booth.** A dark train car with a booth that shouldn't be locked from outside. Sounds of something shifting inside. Golden path: reader does NOT try to open it yet.
7. **The Other Trapped Kid.** A second child, panicking, trapped behind a gate or turnstile. Golden path choice: help them (sets up remembered choice #2, the promise/lie).
8. **The Vending Machine Returns.** It "knows the reader's name" now — pays off scene 3. If they took the item earlier, it helps here (a code, a light, a reason to trust their own eyes over the shifting map).
9. **The Conductor's Booth, Revisited.** Now it's safe/necessary to open — what's inside recontextualizes the girl and the station (she's not a ghost trying to trap them, she's warning them / she's also stuck).
10. **The Real Platform.** A train arrives that looks like the ordinary train home. Golden path: reader recognizes the "tell" (something about the girl's earlier warning, or the map, or the vending machine) that proves it's safe to board — because they gathered the right clues.
11. **Ending: Escape (Full).** They get home. Everything looks normal — except one small detail (the vending machine snack in their pocket, a name tag, a flicker in a mirror) that suggests it's not fully over. Sets up sequel hook.

---

## 2. Ending Map (6–10 endings, branching off specific decision points)

Endings are grouped by tone so you can balance scary/funny/mysterious across the set.

| # | Ending Name | Branches From | Tone | Trigger |
|---|---|---|---|---|
| 1 | **Escape (Full)** | Scene 10 | Satisfying / slightly eerie | Golden path — helped the kid, took the item, trusted the girl |
| 2 | **Escape (Alone)** | Scene 7 | Bittersweet | Reader abandons the trapped kid — they get out, but something follows them home |
| 3 | **The Booth** | Scene 6 | Scary / mystery | Reader opens the conductor's booth too early — pulled into a new, worse loop |
| 4 | **Trust the Map** | Scene 5 | Scary | Reader follows the shifting map instead of the girl — ends up back at scene 2 (loop), OR a "true" bad ending on 2nd loop |
| 5 | **The Vending Machine Deal** | Scene 3 or 8 | Funny/disaster | Reader interacts with the machine too much / eats something from it — comic "cursed forever, but fine" ending |
| 6 | **You Already Got Off This Train Once** | Scene 4 | Mystery | Reader pushes the girl for answers repeatedly — she reveals reader has done this before (memory-loop ending, sets up series mythology) |
| 7 | **Try Again (Missed the Window)** | Scene 1 | Soft fail | Reader doesn't act fast enough to jump off — rides the "wrong" train one more stop, gentle nudge back to scene 1 |
| 8 | **The Lie Catches Up** | Scene 7 (if lied to friend earlier in scene 1 AND abandons the kid) | Scary | Combo ending — both remembered choices go "wrong," friend's texts turn threatening, hardest ending to find |
| 9 | **New Member** | Scene 11 variant | Mystery / series hook | Rare golden-path variant — reader finds a hidden item that marks them as an "11:59 Club" member, teases Book 2 |

Endings 3, 4, and 7 can loop back into earlier scenes rather than being dead ends — that's your replay engine. A kid who "fails" isn't stuck, they're routed back in with new information, which is what makes rereads rewarding instead of punishing.

---

## 3. Remembered-Choice Hooks

Two persistent choices, tracked as simple flags, referenced later regardless of how many scenes sit between the choice and the payoff.

### Hook A — "The Item" (flashlight-equivalent)
- **Set at:** Scene 3, the vending machine. Reader can choose to interact with it (get an item — could be a flashlight, a coin, a candy that glows) or walk past.
- **Flag:** `hasItem = true/false`
- **Payoff at:** Scene 8 (vending machine returns) and Scene 10 (recognizing the real train). With the item, reader gets an extra clue/safety net. Without it, those scenes are harder — more tension, higher chance of a scary-branch ending.
- **Design note:** Never make the item *required* to survive — it should make the safe path easier to find, not gate it entirely. Otherwise readers without it feel cheated rather than challenged.

### Hook B — "The Promise" (lied to a friend)
- **Set at:** Scene 1, the pre-story text message. Reader chooses whether to respond honestly or blow the friend off (the lie).
- **Flag:** `keptPromise = true/false`
- **Payoff at:** Scene 7 (the trapped kid) — if reader lied earlier, this scene has extra weight/dialogue (the trapped kid stands in for the friend they blew off), and if they *also* abandon this kid, it opens Ending 8, "The Lie Catches Up." If they kept the promise, the trapped kid is more willing to trust/help them later.
- **Design note:** This is the emotional hook, not just a mechanical one — it's what gives the horror a conscience instead of just being a maze.

---

## Open questions for next pass
- Whether the countdown-timer moments get their own dedicated scenes or are folded into existing ones above (mostly folded in below)
- Names: protagonist, the girl, the friend, the trapped kid (placeholders used below: YOU, THE GIRL, THE FRIEND, THE OTHER KID)

---

## 4. Full Scene List (32 scenes)

Numbering: **G-#** = golden path / main spine, **B-#** = branch scene, **E-#** = ending. Each scene = one short "page" with 2 choices unless noted.

### Act 1 — The Missed Stop
- **G1.** Late train home. Phone buzzes — text from THE FRIEND, upset/asking to talk. *Choice: answer honestly / brush them off.* → sets Hook B.
- **G2.** [TIMED, 10 sec, cosmetic on 1st play] Conductor calls the stop. Doors closing. *Choice: jump off now / stay in seat, you'll catch it next stop.* → jump = G3; stay = **B1**.
- **B1.** Ride one extra stop — everything's normal, but the doors won't reopen at the "real" next stop either. Nudges back into G3. *(Try Again ending lives here if reader stalls twice — E7.)*
- **G3.** The Empty Platform. Every passenger who got off is gone. Silence. Flickering light. *Choice: examine the vending machine / head straight for the exit stairs.*
- **B2.** Skip the machine, go straight to stairs — stairs loop back to the same platform. Short, spooky, funnels back to G3 choice again (no penalty, just atmosphere/replay flavor).
- **G4.** The vending machine hums. Label's peeling — one item glows faintly. *Choice: take the item / leave it.* → sets Hook A (`hasItem`).
- **G5.** THE GIRL is on a bench, waiting like she expected you. She says: "You already got off this train once." *Choice: ask her what she means / ask her how to get out.*
- **B3.** Push her repeatedly for what she meant → she gets quiet, station lights dim → **E6 "You Already Got Off This Train Once"** (mystery ending, short branch, 2 scenes).

### Act 2 — The Station
- **G6.** THE GIRL points down two halls — one lit, one dark — but won't walk with you. *Choice: take her advice / check the station map instead.*
- **B4.** Trust the map instead — exits are different every time you glance away; reader gets looped through 1-2 unsettling near-identical hallway scenes before dumping back to G6 with a warning cost (girl is now less trusting later). Can dead-end at **E4 "Trust the Map"** if reader repeats this twice.
- **G7.** Hallway leads past a dark train car — the **conductor's booth** door is shut, locked from the outside, something shifts inside. *Choice: try the door / keep walking.*
- **B5.** Try the door now (too early) — it creaks open on its own → **E3 "The Booth"** (scary branch ending, 2-3 scenes, pulls reader into a short loop-within-a-loop before spitting them back to G1 as a "you've done this before" cold open — great replay hook).
- **G8.** Keep walking — reach a turnstile/gate. THE OTHER KID is trapped behind it, panicking, begging for help. *Choice: help them get free / tell them to wait, you'll send help.*
- **B6.** Leave them — you get free faster, but something about it feels wrong. If `keptPromise = false` (lied to friend in G1) → flag combo for **E8**. Continues to G10 regardless, tone shifted colder.
- **G9.** [TIMED, 15 sec] Freeing THE OTHER KID trips an alarm-like chime — station lights strobe. *Choice: pull them through the gap now / grab the loose bolt to widen it first (safer, slower).* Either works, just flavors G10 dialogue.
- **G10.** Back at the vending machine — it now flickers YOUR name on the display. *Choice: interact with it again / ignore it and move on.* If `hasItem = true` from G4, new dialogue/clue appears here (safety net). If reader lingers/interacts twice → **E5 "The Vending Machine Deal"** (funny/disaster branch, 2 scenes, low stakes, comic tone).

### Act 3 — The Booth, Revisited & The Choice Home
- **G11.** Booth door again — now it's ajar on its own, and it's clear something wants you to look. *Choice: look inside / walk past toward the platform.*
- **B7.** Walk past without looking — story continues but reader misses a key clue about the girl; makes G13's "tell" harder to spot (raises odds of E2 instead of E1 at the end — not a hard gate, just weighted).
- **G12.** Inside the booth: a note, a photo, or an old ticket that reframes the girl — she's not haunting you, she's warning you (she's stuck the same way, from a different night). Girl reappears, more urgent now.
- **G13.** THE GIRL says a real train is coming — but so is a fake one. She gives (or, if B7 taken, hints at) the "tell" to spot the real one. *Choice: trust her fully and board when she says / wait and check the platform yourself for the tell.*
- **B8.** [TIMED, 10 sec, forgiving default] Check for the tell yourself — if `hasItem = true`, item helps confirm it fast; if not, tense near-miss, but doesn't fail outright (timer expiry defaults to trusting the girl).
- **G14.** THE OTHER KID (if helped in G8/B6) is at the platform too — offers to go together or wave you off. *Choice: bring them onto the train with you / let them find their own way.*
- **G15.** The real train arrives. Doors open. *Final choice: step on / hesitate one more second and look back at the station.*

### Endings (spine)
- **E1. Escape (Full)** — from G15, golden path (helped kid, has item or spotted tell cleanly, kept the girl's trust). Home again — small unsettling detail in pocket/mirror. Series hook.
- **E9. New Member** — rare variant of E1: if reader also picked up a specific hidden detail (e.g. examined the note in G12 twice, or has `hasItem` AND helped the kid AND kept the promise), unlocks a bonus final beat — the "11:59 Club" name is spoken for the first time, teases Book 2.
- **E2. Escape (Alone)** — from G8/B6 branch where reader abandoned the other kid, then reaches G15 solo. Gets out, but something follows.
- **E3. The Booth** — from B5, opening the booth too early.
- **E4. Trust the Map** — from repeated B4 loops.
- **E5. Vending Machine Deal** — from repeated G10 interaction. Comic tone, low stakes.
- **E6. You Already Got Off This Train Once** — from B3, pushing the girl too hard for answers.
- **E7. Try Again (Missed the Window)** — from B1, failing to jump off in time (soft fail, gentle loop back to G1/G2).
- **E8. The Lie Catches Up** — combo ending: `keptPromise = false` AND abandoned the kid (B6). Triggers off G15 with altered dialogue — hardest ending to find, most rewarding for replay-hunters.

**Scene count:** 15 golden-path spine scenes (G1–G15) + 8 branch scenes (B1–B8) + 9 endings (E1–E9) = **32 total scenes**, comfortably inside your 25–35 target, with several endings sharing setup work so nothing feels like a separate ten-book effort.
