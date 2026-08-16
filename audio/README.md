# Audio Directory Structure for The 11:59 Club

Drop your audio files here following the key mappings defined in `state-logic.md`. The web engine dynamically loads these paths and catches missing files gracefully.

## Ambient Loops (`/audio/loops/`)
- `lastCar.mp3` — G1–G2, B1 (train car hum)
- `platform.mp3` — G3–G6, B2–B3, G10, B_G10_extra (empty station platform ambient hum)
- `stationHall.mp3` — G7–G8, B4–B7, G11–G12 (echoing hallway soundscape)
- `trainArrival.mp3` — G13–G15, B8 (approaching train soundscape)
- `alarmRise.mp3` — G9 (rising alarm chime)

## Jump Stabs & Effects (`/audio/stabs/`)
- `boothReveal.mp3` — G7 ("something shifts" beat), G12, E3 opening
- `mapGlitch.mp3` — B4 (map exit shift), E4
- `alarmHit.mp3` — G9 (alarm hit trigger)

## Explicit Cut Cue
- `silence` — G12 note discovery (cuts all loop audio for ~2 seconds before Rin speaks)
