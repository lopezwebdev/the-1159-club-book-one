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
- Exact number of scenes per branch (want to keep dead-end branches short — 2-3 scenes — so effort stays on the golden path and its near-variants)
- Whether the countdown-timer moments (locker, peephole-style beats) get their own dedicated scenes or are folded into existing ones above
- Names: protagonist, the girl, the friend, the trapped kid
