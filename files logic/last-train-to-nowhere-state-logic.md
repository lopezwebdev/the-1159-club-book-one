# The 11:59 Club — Book 1: The Last Train to Nowhere
### State & Flag Logic Spec

This defines the data model the engine runs on. Every scene is a node; every choice either sets a flag, jumps to a node, or both. The prose files are the content; this is the wiring.

---

## Flags (persist across the whole playthrough)

| Flag | Set at | Read at | Effect |
|---|---|---|---|
| `keptPromise` | G1 (texted Kenji back = true, ghosted = false) | G8/E8 | Colors Mara-rescue dialogue; combines with `helpedMara=false` to unlock E8 |
| `hasItem` | G4 (took item = true) | G10, B8, G13 | Gives extra clue text; makes B8's timer easier to beat cleanly |
| `helpedMara` | G8 (helped = true, told her to wait = false→B6) | G14, E2, E8 | Determines whether Mara is present at the ending |
| `sawTell` | B8 (spotted it themself = true; trusted Rin = false) | G14/E9 flavor only | Cosmetic — doesn't gate anything, just changes a line of dialogue |
| `examinedNote` | G12 (asked what happens now = true) | E9 | Required (with the three below) for New Member ending |
| `pushedRin` | B3 (pushed hard = triggers E6 directly, not really a "flag" so much as a hard branch) | — | — |
| `boothTried` | B5 (tried door early, changed mind = true) | G11 | Booth reappears "ajar" faster / with extra dread text |
| `mapLoopCount` | B4 (increments each time reader re-checks map) | B4 | At 2, routes to E4 instead of looping back |
| `stairLoopCount` | B2 (increments each retry) | B2 | Purely flavor — always funnels to G4 after 1 loop, no ending attached |
| `missedWindowCount` | B1 (increments each time reader stays seated) | B1 | At 2, routes to E7 instead of looping |

## Ending resolution (checked at G15, after the "step on / hesitate" choice)

Priority order — check top to bottom, first match wins:

1. `helpedMara === false && keptPromise === false` → **E8** (The Lie Catches Up)
2. `helpedMara === false` → **E2** (Escape, Alone)
3. `examinedNote === true && hasItem === true && helpedMara === true && keptPromise === true` → **E9** (New Member)
4. else → **E1** (Escape, Full)

Endings E3, E4, E6, E7 are **not** reached through G15 at all — they're hard exits triggered directly from their branch scenes (B5, B4-repeat, B3, B1-repeat). E5 similarly triggers directly from repeated G10 interaction, not through the final resolution check.

## Checkpoints (for "restart from checkpoint")

Rather than saving after every scene, checkpoint only at spine entry points, so a restart never feels like it erased real progress:

- Checkpoint A: G1 (start)
- Checkpoint B: G3 (platform arrival — post the only truly binary early choice, G2)
- Checkpoint C: G7 (post-Rin, pre-booth)
- Checkpoint D: G11 (post-Mara-rescue, pre-booth-revisit)

A reader who dies into a loop ending (E3, E4, E6, E7) resumes from the most recent checkpoint at or before the branch they entered, not from scene 1 — except E7, which narratively *is* a return to G1, so let that one actually restart the story (it's the "soft fail" ending, and re-experiencing G1's texting choice is part of the joke/tension).

## Scene node shape (for implementation)

```js
{
  id: "G1",
  checkpoint: true,          // optional
  text: "...",                // supports basic markdown: **bold**, *italic*
  audioLoop: "lastCar",       // optional — ambient track key
  audioStab: null,            // optional — one-shot jump-scare key
  timer: null,                // or { seconds: 10, defaultNext: "G2", forgiving: true }
  choices: [
    { label: "Text him back and explain.", next: "G2", setFlag: { keptPromise: true } },
    { label: "Ghost him. You'll deal with it tomorrow.", next: "G2", setFlag: { keptPromise: false } }
  ]
}
```

Endings use the same shape with `isEnding: true` and no `choices` (instead a single "Play Again" / "Back to Start" control, plus checkpoint-aware restart per the table above).

---

## Audio hook map (keys only — files to be supplied)

| Key | Type | Fires at |
|---|---|---|
| `lastCar` | loop | G1–G2 |
| `platform` | loop | G3–G6, G10, G11 |
| `stationHall` | loop | G7–G9, B1–B8 (default fallback loop) |
| `boothReveal` | stab | E3 opening, G7 "something shifts" beat |
| `alarmRise` | stab→loop | G9 alarm trigger |
| `mapGlitch` | stab | E4, repeated B4 |
| `trainArrival` | loop | G13–G15 |
| `silence` | (explicit cut) | G12 (note discovery — cut all audio for ~2s before Rin speaks) |

Silence-as-cue (`silence`) is itself a hook the engine should support — not just "no track playing," but an explicit fade-to-nothing the designer can call at a specific beat, per your instinct that quiet is part of the pacing toolkit.
