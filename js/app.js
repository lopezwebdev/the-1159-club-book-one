/* ===========================================================
   THE 11:59 CLUB — BOOK ONE: THE LAST TRAIN TO NOWHERE
   Author: E.G. Lopez
   Engine: JS State Engine & Audio Manager (V1 Final)
   =========================================================== */

(function () {
  'use strict';

  /* ===========================================================
     AUDIO HOOK SYSTEM
     =========================================================== */
  const AUDIO_LOOPS = {
    lastCar:     'audio/loops/lastCar.mp3',
    platform:    'audio/loops/platform.mp3',
    stationHall: 'audio/loops/stationHall.mp3',
    trainArrival:'audio/loops/trainArrival.mp3',
    alarmRise:   'audio/loops/alarmRise.mp3',
  };

  const AUDIO_STABS = {
    boothReveal: 'audio/stabs/boothReveal.mp3',
    mapGlitch:   'audio/stabs/mapGlitch.mp3',
    alarmHit:    'audio/stabs/alarmHit.mp3',
  };

  const loopEl = document.getElementById('audioLoop');
  const stabEl = document.getElementById('audioStab');
  const muteBtn = document.getElementById('muteBtn');

  let isMuted = localStorage.getItem('1159club_muted') === 'true';
  let currentLoopKey = null;
  let fadeInterval = null;

  function updateMuteUI() {
    if (!muteBtn) return;
    const label = isMuted ? 'Muted' : 'Audio On';
    const icon = isMuted
      ? `<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`
      : `<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
    muteBtn.innerHTML = `${icon} <span>${label}</span>`;
    muteBtn.setAttribute('aria-label', label);
  }

  function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('1159club_muted', isMuted ? 'true' : 'false');
    updateMuteUI();
    if (isMuted) {
      if (loopEl) loopEl.volume = 0;
      if (stabEl) stabEl.volume = 0;
    } else {
      if (loopEl) loopEl.volume = 0.55;
      if (stabEl) stabEl.volume = 0.85;
      if (currentLoopKey && AUDIO_LOOPS[currentLoopKey]) {
        playLoop(currentLoopKey);
      }
    }
  }

  function playLoop(key) {
    if (!key) { fadeOutLoop(); return; }
    if (key === currentLoopKey && loopEl && !loopEl.paused) return;
    currentLoopKey = key;
    const src = AUDIO_LOOPS[key];
    if (!src || !loopEl) return;

    try {
      loopEl.src = src;
      loopEl.volume = isMuted ? 0 : 0.55;
      loopEl.play().catch(() => { /* silent graceful fallback */ });
    } catch (e) {}
  }

  function fadeOutLoop() {
    currentLoopKey = null;
    if (!loopEl) return;
    try {
      let vol = loopEl.volume;
      if (vol === 0 || loopEl.paused) {
        loopEl.pause();
        return;
      }
      clearInterval(fadeInterval);
      fadeInterval = setInterval(() => {
        vol = Math.max(0, vol - 0.1);
        loopEl.volume = vol;
        if (vol <= 0) {
          clearInterval(fadeInterval);
          loopEl.pause();
        }
      }, 50);
    } catch (e) {
      if (loopEl) loopEl.pause();
    }
  }

  function playStab(key) {
    const src = AUDIO_STABS[key];
    if (src && stabEl && !isMuted) {
      try {
        stabEl.src = src;
        stabEl.volume = 0.85;
        stabEl.currentTime = 0;
        stabEl.play().catch(() => {});
      } catch (e) {}
    }

    const board = document.getElementById('board');
    if (board && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      board.classList.remove('glitch');
      void board.offsetWidth;
      board.classList.add('glitch');
    }
  }

  function cutSilence() {
    fadeOutLoop();
  }

  /* ===========================================================
     STATE & CHECKPOINTS
     =========================================================== */
  const state = {
    playerName: 'Rider',
    flags: {
      keptPromise: null,
      hasItem: false,
      helpedMara: null,
      sawTell: null,
      examinedNote: false,
      boothTried: false,
    },
    counters: {
      mapLoop: 0,
      stairLoop: 0,
      missedWindow: 0,
    },
    checkpoint: 'G1',
    currentId: 'START',
    spineVisited: new Set(),
  };

  const SPINE_ORDER = ['G1','G2','G3','G4','G5','G6','G7','G8','G9','G10','G11','G12','G13','G14','G15'];
  const CHECKPOINTS = ['G1','G3','G7','G11'];

  /* ===========================================================
     ENDINGS META & LOCAL STORAGE TRACKER
     =========================================================== */
  const ENDING_META = {
    E1: { title: "Escape (Full)", tone: "Good", hint: "Board the train with Mara and the glowing item." },
    E2: { title: "Escape, Alone", tone: "Bittersweet", hint: "Leave Mara trapped at the gate, then board the train alone." },
    E3: { title: "The Booth", tone: "Loop", hint: "Try opening the locked conductor's booth door at G7." },
    E4: { title: "Trust the Map", tone: "Loop", hint: "Ignore Rin's advice and inspect the station wall map twice." },
    E5: { title: "The Vending Machine Deal", tone: "Funny", hint: "Inspect the vending machine when it spells your name and drink the juice." },
    E6: { title: "You Already Got Off This Train Once", tone: "Mystery", hint: "Push Rin aggressively for answers on the bench." },
    E7: { title: "Try Again (Missed Window)", tone: "Soft Fail", hint: "Refuse to get off the train twice when the doors open." },
    E8: { title: "The Lie Catches Up", tone: "Scary", hint: "Ghost your friend at G1 AND leave Mara trapped at the gate." },
    E9: { title: "New Member", tone: "Secret", hint: "Keep your promise, take the item, save Mara, and read the note inside the booth." },
  };

  function getUnlockedEndings() {
    try {
      const stored = localStorage.getItem('1159club_endings_unlocked');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  function saveUnlockedEnding(endingId) {
    try {
      const unlocked = getUnlockedEndings();
      if (!unlocked.includes(endingId)) {
        unlocked.push(endingId);
        localStorage.setItem('1159club_endings_unlocked', JSON.stringify(unlocked));
        return true;
      }
    } catch (e) {}
    return false;
  }

  function updateTrackerButton() {
    const trackerBtn = document.getElementById('trackerBtn');
    if (!trackerBtn) return;
    const unlocked = getUnlockedEndings();
    trackerBtn.innerHTML = `
      <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      <span>Endings: ${unlocked.length}/9</span>
    `;
  }

  function openEndingsModal() {
    const modal = document.getElementById('endingsModal');
    const modalGrid = document.getElementById('endingsGrid');
    if (!modal || !modalGrid) return;

    const unlocked = getUnlockedEndings();

    modalGrid.innerHTML = Object.keys(ENDING_META).map(id => {
      const isUnlocked = unlocked.includes(id);
      const meta = ENDING_META[id];
      const isGood = meta.tone === "Good" || meta.tone === "Secret";
      return `
        <div class="ending-card ${isUnlocked ? 'unlocked' : 'locked'} ${isGood ? 'good' : ''}">
          <div class="ending-card-header">
            <span class="ending-code">${id}</span>
            <span class="ending-name">${isUnlocked ? meta.title : '??? Locked'}</span>
          </div>
          <div class="ending-hint">${isUnlocked ? meta.hint : `<i>Hint: ${meta.hint}</i>`}</div>
        </div>
      `;
    }).join('');

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeEndingsModal() {
    const modal = document.getElementById('endingsModal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  /* ===========================================================
     SCENE DATABASE (Reconciled with Prose Files & State Logic)
     =========================================================== */
  const S = {};

  S.G1 = {
    id: 'G1', checkpoint: true, audioLoop: 'lastCar',
    text: `The train is almost empty. Just you, a sleeping salaryman two seats down, and the hum of wheels on track.<br><br>Your phone buzzes.<br><br><span class="speaker">Kenji:</span> <i>did you seriously just leave? i needed to talk to you</i><br><br>You stare at it a second too long. You told him you'd stay after practice. You didn't.`,
    choices: [
      { label: "Text him back and explain.", next: 'G2', setFlag: { keptPromise: true } },
      { label: "Ghost him. You'll deal with it tomorrow.", next: 'G2', setFlag: { keptPromise: false } }
    ]
  };

  S.G2 = {
    id: 'G2', audioLoop: 'lastCar',
    timer: { seconds: 10, defaultNext: 'B1', forgiving: true },
    text: `<i>"Next stop —"</i> the speaker crackles, garbled. You don't catch the name.<br><br>The doors chime. You weren't even paying attention to which stop this was supposed to be.`,
    choices: [
      { label: "Jump off now, before the doors seal shut.", next: 'G3' },
      { label: "Stay seated — you'll catch the next one back.", next: 'B1' }
    ]
  };

  S.B1 = {
    id: 'B1', audioLoop: 'lastCar',
    text: `Fine. No big deal. You'll just get off at the next stop instead.<br><br>The train rattles on. One minute. Two. The lights inside flicker once, and outside the window there's nothing — no platforms sliding past, no tunnel walls, just dark.<br><br>The speaker crackles again. Same garbled voice. <i>"Next stop —"</i><br><br>The doors open onto the exact same platform. Same flickering light. Same hum from a vending machine down the way.<br><br>You didn't gain a second chance. You just took the long way to the same place.`,
    onEnter: (st) => { st.counters.missedWindow++; },
    choicesFn: (st) => {
      if (st.counters.missedWindow >= 2) {
        return [{ label: "Stay seated again.", next: 'E7' }];
      }
      return [
        { label: "Get off here, for real this time.", next: 'G3' },
        { label: "Stay seated again and see what happens.", next: 'B1' }
      ];
    }
  };

  S.G3 = {
    id: 'G3', checkpoint: true, audioLoop: 'platform',
    text: `The train pulls away, and the platform goes quiet in a way platforms aren't supposed to be quiet.<br><br>No one else got off. Not the salaryman. Not the two girls who were laughing by the doors a minute ago. Just you.<br><br>The overhead light nearest you flickers, buzzing like it's thinking about giving up entirely. Down the platform, a vending machine glows — the only steady light in the whole station.`,
    choices: [
      { label: "Go look at the vending machine.", next: 'G4' },
      { label: "Head straight for the stairs and get out of here.", next: 'B2' }
    ]
  };

  S.B2 = {
    id: 'B2', audioLoop: 'platform',
    onEnter: (st) => { st.counters.stairLoop++; },
    text: `You take the stairs two at a time, glad to be moving, glad to have a plan.<br><br>The stairs turn. Then turn again. Then a third time, and you're fairly sure staircases aren't supposed to have this many turns for one flight.<br><br>You come out — onto the same platform you just left. Same flicker. Same hum.<br><br>Okay. Different plan needed.`,
    choices: [
      { label: "Actually check out that vending machine this time.", next: 'G4' },
      { label: "Try the stairs again — maybe you missed a turn.", next: 'B2_loop' }
    ]
  };

  S.B2_loop = {
    id: 'B2_loop', audioLoop: 'platform',
    text: `You try the stairs again, paying close attention to every single turn. One flight, two flights, three...<br><br>And there you are, right back on the exact same platform facing the glowing vending machine.<br><br>The stairs aren't going to get you out.`,
    choices: [
      { label: "Head over to the vending machine.", next: 'G4' }
    ]
  };

  S.G4 = {
    id: 'G4', audioLoop: 'platform',
    text: `The machine is stocked with drinks and snacks you don't recognize — brands with no logos, wrappers a little too shiny. One item near the bottom row glows faintly, like it's lit from the inside.<br><br>There's no coin slot. No card reader. Just a button.`,
    choices: [
      { label: "Press it. Take the item.", next: 'G5', setFlag: { hasItem: true } },
      { label: "Leave it. Something about this feels like a trade you don't want to make.", next: 'G5', setFlag: { hasItem: false } }
    ]
  };

  S.G5 = {
    id: 'G5', audioLoop: 'platform',
    text: `A girl about your age is sitting alone on a bench near the stairs, like she's been waiting for exactly you.<br><br>She doesn't look scared. She looks <i>tired</i>.<br><br><span class="speaker">Rin:</span> "You already got off this train once."<br><br>You don't know what that means. You don't know her. But she's the only other person in this entire station.`,
    choices: [
      { label: "Ask her what she means.", next: 'B3' },
      { label: "Ask her how to get out of here.", next: 'G6' }
    ]
  };

  S.B3 = {
    id: 'B3', audioLoop: 'platform',
    text: `"What do you mean I already got off this train once? I've never even <i>been</i> here—"`,
    choices: [
      { label: "Push harder. She knows something and you want it now.", next: 'E6' },
      { label: "Back off — she clearly doesn't want to explain yet.", next: 'G6' }
    ]
  };

  S.G6 = {
    id: 'G6', audioLoop: 'platform',
    text: `Rin doesn't really answer either question — not directly.<br><br><span class="speaker">Rin:</span> "There's a way out. It's not the stairs. It's not the way you think." She points down two hallways — one dim but lit, one completely dark. "Go that way. Don't look at the map on the wall. Don't trust it."`,
    choices: [
      { label: "Follow her directions down the lit hallway.", next: 'G7' },
      { label: "Check the station map first, just to be sure.", next: 'B4' }
    ]
  };

  S.B4 = {
    id: 'B4', audioLoop: 'stationHall', audioStab: 'mapGlitch',
    text: `The map is bolted to the wall, laminated, official-looking. <b>YOU ARE HERE</b>, it says, with a little red dot.<br><br>You look at the exits. Blink. Look again.<br><br>The exits have moved.`,
    onEnter: (st) => { st.counters.mapLoop++; },
    choicesFn: (st) => {
      if (st.counters.mapLoop >= 2) {
        return [{ label: "Look one more time, just to be sure.", next: 'E4' }];
      }
      return [
        { label: "Look one more time, just to be sure.", next: 'B4' },
        { label: "Stop looking at it and go find Rin instead.", next: 'G7' }
      ];
    }
  };

  S.G7 = {
    id: 'G7', checkpoint: true, audioLoop: 'stationHall', audioStab: 'boothReveal',
    text: `Halfway down the hall sits a stopped train car, dark inside except for one dim light. Painted on the side: <b>CONDUCTOR — DO NOT ENTER</b>.<br><br>The door is locked. From the <i>outside</i>.<br><br>Something inside shifts. Slowly. Like it heard you.`,
    choices: [
      { label: "Try the door anyway.", next: 'B5' },
      { label: "Keep walking. Whatever's in there can wait.", next: 'G8' }
    ]
  };

  S.B5 = {
    id: 'B5', audioLoop: 'stationHall',
    text: `You know you probably shouldn't. You try it anyway.<br><br>The lock gives with no resistance at all — like it was never really locked, just waiting for you to ask.`,
    choices: [
      { label: "Step inside.", next: 'E3' },
      { label: "Change your mind at the last second. Shut the door.", next: 'G8', setFlag: { boothTried: true } }
    ]
  };

  S.G8 = {
    id: 'G8', audioLoop: 'stationHall',
    text: `Further down, a turnstile gate blocks the hall — and behind it, a kid about your age is gripping the bars, panicked.<br><br><span class="speaker">Mara:</span> "Please — it won't open, I've been stuck since the last stop, please—"`,
    choices: [
      { label: "Help her get free.", next: 'G9', setFlag: { helpedMara: true } },
      { label: "Tell her to wait here — you'll go find help.", next: 'B6' }
    ]
  };

  S.B6 = {
    id: 'B6', audioLoop: 'stationHall',
    text: `"I'll get help," you say. "Just — stay here. I'll be back."<br><br>She doesn't look like she believes you. Honestly, you're not sure you believe you either.<br><br>You keep walking. The panic in her voice fades behind you, and something about how easy that was bothers you more than the station does.`,
    choices: [
      { label: "Keep going. You made a choice — live with it.", next: 'G10', setFlag: { helpedMara: false } },
      { label: "Turn back — you can't actually leave her there.", next: 'G9', setFlag: { helpedMara: true } }
    ]
  };

  S.G9 = {
    id: 'G9', audioLoop: 'alarmRise', audioStab: 'alarmHit',
    timer: { seconds: 15, defaultNext: 'G10', forgiving: true },
    text: `The gate groans and something in the wall <i>clicks</i> — a chime starts, low and rising, lights along the hallway beginning to strobe.`,
    choices: [
      { label: "Pull her through the gap now.", next: 'G10' },
      { label: "Grab the loose bolt and widen the gap first.", next: 'G10' }
    ]
  };

  S.G10 = {
    id: 'G10', audioLoop: 'platform',
    textFn: (st) => {
      if (st.flags.hasItem) {
        return `You pass the vending machine again on the way back — except now the little screen above the buttons is flickering with letters. It's spelling your name.<br><br>Beneath your name, a second word flickers: <i>WATCH THE LIGHTS</i>.<br><br><span class="speaker">Mara:</span> "Don't stare at it too long."`;
      }
      return `You pass the vending machine again on the way back — except now the little screen above the buttons is flickering with letters. It's spelling your name.<br><br><span class="speaker">Mara:</span> "Don't stare at it too long."`;
    },
    choices: [
      { label: "Take her advice and move on.", next: 'G11' },
      { label: "One more second — just to see what it does.", next: 'B_G10_extra' }
    ]
  };

  S.B_G10_extra = {
    id: 'B_G10_extra', audioLoop: 'platform',
    text: `You lean in for one more look. The screen flickers your name a third time, then — <i>bloop</i> — spits out another item, no button pressed, no request made.<br><br>It's a very ordinary-looking juice box.`,
    choices: [
      { label: "Drink it. You're thirsty and this night has been a lot.", next: 'E5' },
      { label: "Actually — leave it. Follow Mara.", next: 'G11' }
    ]
  };

  S.G11 = {
    id: 'G11', checkpoint: true, audioLoop: 'stationHall',
    textFn: (st) => {
      if (st.flags.boothTried) {
        return `Back near the conductor's booth, the door is different now. Not locked. Wide open, a sliver of heavy dark inside, creaking gently as if it remembers you tried the handle earlier.`;
      }
      return `Back near the conductor's booth, the door is different now. Not locked. Just barely open, a sliver of dark inside, like something wants you to look.`;
    },
    choices: [
      { label: "Look inside.", next: 'G12' },
      { label: "Walk past it toward the platform. You're almost out.", next: 'B7' }
    ]
  };

  S.B7 = {
    id: 'B7', audioLoop: 'stationHall',
    text: `Whatever's behind that door, you don't want to know tonight. You keep walking.<br><br>Behind you, faint, you could swear you hear the door creak shut on its own — like it's disappointed.`,
    choices: [
      { label: "Keep moving toward the platform.", next: 'G13', setFlag: { examinedNote: false } },
      { label: "Actually, go back and look. You'll regret not knowing.", next: 'G12' }
    ]
  };

  S.G12 = {
    id: 'G12', audioLoop: 'stationHall', audioStab: 'boothReveal', cutSilence: true,
    text: `Inside the booth: an old ticket stub, a photo gone soft at the corners, a note in handwriting that looks — unsettlingly — a little like Rin's.<br><br>It isn't a trap. It's a <i>warning</i>. Left by someone who didn't make it out in time.<br><br>Rin appears behind you, quieter than before. "I've been here longer than you think," she says. "I'm not doing this <i>to</i> you."`,
    choices: [
      { label: "Ask her what happens now.", next: 'G13', setFlag: { examinedNote: true } },
      { label: "Just nod. There isn't time for more questions.", next: 'G13', setFlag: { examinedNote: false } }
    ]
  };

  S.G13 = {
    id: 'G13', audioLoop: 'trainArrival',
    timer: { seconds: 10, defaultNext: 'G14', forgiving: true },
    text: `"A train's coming," Rin says. "But so is a fake one. They'll look the same. Almost."`,
    choices: [
      { label: "Trust her completely — board when she tells you to.", next: 'G14', setFlag: { sawTell: false } },
      { label: "Watch the platform yourself, just to be sure.", next: 'B8', setFlag: { sawTell: true } }
    ]
  };

  S.B8 = {
    id: 'B8', audioLoop: 'trainArrival',
    timer: { seconds: 10, defaultNext: 'G14', forgiving: true },
    text: `Two lights down the tunnel. Both trains, growing louder, closer, identical in every way you can see.`,
    choicesFn: (st) => {
      if (st.flags.hasItem) {
        return [{ label: "You catch it fast — the item's second clue confirms the tell.", next: 'G14' }];
      }
      return [
        { label: "You think you spot it — trust your gut.", next: 'G14' },
        { label: "You can't tell. Trust Rin's earlier instructions instead.", next: 'G14' }
      ];
    }
  };

  S.G14 = {
    id: 'G14', audioLoop: 'trainArrival',
    text: `Mara's beside you now, watching the tunnel too.<br><br><span class="speaker">Mara:</span> "Are you — are we going together?"`,
    choicesFn: (st) => {
      if (st.flags.helpedMara === false) {
        return [{ label: "You board alone. Mara isn't here anymore.", next: 'G15' }];
      }
      return [
        { label: "Bring her onto the train with you.", next: 'G15' },
        { label: "Let her find her own way out.", next: 'G15', setFlag: { helpedMara: false } }
      ];
    }
  };

  S.G15 = {
    id: 'G15', audioLoop: 'trainArrival',
    text: `The right train slows to a stop. The doors open with an ordinary, boring, <i>wonderful</i> hiss.<br><br>Rin doesn't move to follow.`,
    choices: [
      { label: "Step on board.", next: 'RESOLVE' },
      { label: "Hesitate one more second and look back.", next: 'RESOLVE' }
    ]
  };

  /* ===========================================================
     ENDINGS (Prose & Resolution Specs)
     =========================================================== */
  S.E1 = {
    id: 'E1', isEnding: true, good: true, audioLoop: null,
    title: 'Escape',
    text: `The train rattles along like any other train. Mara falls asleep against the window within two stops. Normal. Boring. Perfect.<br><br>You get off at your actual stop. Walk home under streetlights that work exactly the way streetlights are supposed to.<br><br>In your room, you empty your pockets before bed — coins, a receipt, your key.<br><br>And one small glowing thing you don't remember buying.<br><br>You set it on your nightstand. It's still warm.<br><br>Somewhere, a station clock ticks toward 11:59 again.`
  };

  S.E9 = {
    id: 'E9', isEnding: true, good: true, audioLoop: null,
    title: 'New Member',
    text: `Same walk home. Same streetlights. Same glowing thing on the nightstand.<br><br>Except this time, when you turn it over, there's something scratched into the underside — small, careful letters, like they were carved slowly, by someone who had all the time in the world.<br><br><b>11:59.</b><br><br>Your phone buzzes. It's not Kenji this time. It's a number you don't recognize.<br><br><span class="speaker">Unknown:</span> Welcome to the club.<br><br>You don't reply. You don't need to. Somehow, you already know you're not getting a normal night's sleep.`
  };

  S.E2 = {
    id: 'E2', isEnding: true, good: false, audioLoop: null,
    title: 'Escape, Alone',
    text: `The train rattles along like any other train. Except the seat across from you stays empty the whole ride, and you can't stop looking at it.<br><br>You get off at your stop. Walk home. Normal streetlights, normal night.<br><br>But you keep hearing footsteps a half-step behind your own, matching your pace exactly, stopping exactly when you stop.<br><br>You don't turn around. You tell yourself it's nothing.<br><br>In bed, you almost fall asleep — until your phone buzzes once, from an unknown number, no name, no message. Just a photo.<br><br>A turnstile gate. Still locked.`
  };

  S.E3 = {
    id: 'E3', isEnding: true, good: false, checkpointReturn: 'G7', audioLoop: null, audioStab: 'boothReveal',
    title: 'The Booth',
    text: `The door creaks open on its own, slow, like it's been waiting for permission.<br><br>Inside isn't a booth. It's the inside of the train — your train — rows of seats stretching back further than they should, lit by a light that flickers in time with your heartbeat.<br><br>At the far end, a seat. Your seat. Someone's already sitting in it.<br><br>They turn around.<br><br>It's you — from ten minutes ago, phone still in hand, still deciding whether to answer Kenji's text.<br><br>The doors behind you seal shut.<br><br>Somewhere far away, a conductor's voice crackles: <i>"Next stop —"</i><br><br>The station resets around you. The platform. The vending machine. The quiet.<br><br>You've done this before.`
  };

  S.E4 = {
    id: 'E4', isEnding: true, good: false, checkpointReturn: 'G3', audioLoop: null, audioStab: 'mapGlitch',
    title: 'Trust the Map',
    text: `The hallway on the map says LEFT. You go left. It says LEFT again. You go left again.<br><br>By the third turn you realize you're not walking down new hallways at all. You're walking the same twenty feet, over and over, and the map is simply relabeling itself each time you check.<br><br>Somewhere behind you, faint and almost gentle, Rin's voice: <i>"I told you not to look at it."</i><br><br>The lights go out one row at a time, moving toward you, unhurried, patient, like they have exactly as long as it takes.`
  };

  S.E5 = {
    id: 'E5', isEnding: true, good: false, funny: true, checkpointReturn: 'G7', audioLoop: null,
    title: 'The Vending Machine Deal',
    text: `It tastes fine. Great, actually. Slightly blue, somehow.<br><br><span class="speaker">Mara:</span> "You just drank <i>mystery station juice.</i>"<br><br>"It was FREE," you say.<br><br>You do make it home fine. Completely fine. The only side effect is that for the next three weeks, you can only taste the color blue, and every vending machine you pass hums a little when you walk by — like it recognizes you.<br><br>Small price. Ten out of ten juice box. Would drink again.`
  };

  S.E6 = {
    id: 'E6', isEnding: true, good: false, checkpointReturn: 'G3', audioLoop: null,
    title: 'You Already Got Off This Train Once',
    text: `Rin doesn't answer right away. When she finally does, her voice sounds tired in a way that has nothing to do with being sleepy.<br><br>"You always say that," she says. "Every time."<br><br>The platform light nearest you flickers out completely. When it comes back on, Rin is gone — and so is the bench she was sitting on, like it was never there.<br><br>You check your phone. The clock reads:<br><br><span class="clock-flash">11:58.</span><br><br>Again.`
  };

  S.E7 = {
    id: 'E7', isEnding: true, good: false, restartFull: true, audioLoop: null,
    title: 'Try Again',
    text: `The doors close a half-second before you reach them. You catch your reflection in the glass, mouth open mid-word.<br><br>The train rolls on. Fine. You'll just get off at the next stop instead.<br><br>Except the doors don't open at the next stop either. Or the one after that.<br><br>Outside the window, the world has gone completely dark — nothing at all except your own reflection, patiently waiting for you to make a different choice.`
  };

  S.E8 = {
    id: 'E8', isEnding: true, good: false, audioLoop: null,
    title: 'The Lie Catches Up',
    text: `The right train pulls in. Doors open with that same ordinary hiss. You step on alone.<br><br>Halfway home, your phone buzzes. Kenji, finally, hours late:<br><br><span class="speaker">Kenji:</span> hey. we ok?<br><br>You go to answer — really answer, this time — but the message won't send. It just sits there, spinning, spinning, spinning.<br><br>Across the train car, in the very last seat, someone is sitting who wasn't there a second ago. Small. Familiar. Arms crossed, waiting by a gate that, in this light, looks a lot like a turnstile.<br><br>She doesn't say anything. She doesn't have to.<br><br>The train doesn't stop at your station. It just keeps going, past it, into the dark, and somewhere far behind you, faint through the window, a station clock resets to <b>11:59.</b>`
  };

  const ENDINGS = { E1: S.E1, E2: S.E2, E3: S.E3, E4: S.E4, E5: S.E5, E6: S.E6, E7: S.E7, E8: S.E8, E9: S.E9 };

  /* Strict Ending Resolution Matrix per state-logic.md */
  function resolveEnding(st) {
    if (st.flags.helpedMara === false && st.flags.keptPromise === false) return 'E8';
    if (st.flags.helpedMara === false) return 'E2';
    if (st.flags.examinedNote && st.flags.hasItem && st.flags.helpedMara && st.flags.keptPromise) return 'E9';
    return 'E1';
  }

  /* ===========================================================
     RENDER ENGINE
     =========================================================== */
  const board = document.getElementById('board');
  let timerTimeout = null;

  function clearTimer() {
    if (timerTimeout) {
      clearTimeout(timerTimeout);
      timerTimeout = null;
    }
  }

  function resetState() {
    state.flags = {
      keptPromise: null,
      hasItem: false,
      helpedMara: null,
      sawTell: null,
      examinedNote: false,
      boothTried: false,
    };
    state.counters = { mapLoop: 0, stairLoop: 0, missedWindow: 0 };
    state.checkpoint = 'G1';
    state.spineVisited = new Set();
  }

  /* Standalone Un-cropped Cover 1 Opening Screen with Controls Below */
  function renderStart() {
    clearTimer();
    fadeOutLoop();

    board.innerHTML = `
      <div class="cover-screen">
        <div class="cover-image-container">
          <img src="Last Train to Nowhere Cover 1.png" alt="Last Train to Nowhere Cover 1" class="cover-img">
        </div>
        <div class="cover-controls-panel">
          <div class="input-group">
            <input class="nameinput" id="nameField" placeholder="TYPE YOUR NAME" maxlength="18" autocomplete="off" aria-label="Your Name">
          </div>
          <button class="go-btn" id="startBtn">Board the Train</button>
        </div>
      </div>
    `;

    updateTrackerButton();

    document.getElementById('startBtn').onclick = () => {
      const val = document.getElementById('nameField').value.trim();
      state.playerName = val || 'Rider';
      state.currentId = 'G1';
      renderScene('G1');
    };

    document.getElementById('nameField').onkeydown = (e) => {
      if (e.key === 'Enter') {
        document.getElementById('startBtn').click();
      }
    };
  }

  function renderScene(id) {
    clearTimer();
    const scene = S[id];
    if (!scene) { console.error('Missing scene node:', id); return; }

    state.currentId = id;

    if (scene.onEnter) scene.onEnter(state);
    if (SPINE_ORDER.includes(id)) state.spineVisited.add(id);
    if (scene.checkpoint) state.checkpoint = id;

    playLoop(scene.audioLoop);
    if (scene.audioStab) playStab(scene.audioStab);
    if (scene.cutSilence) cutSilence();

    const dots = SPINE_ORDER.map(sid => {
      const isVisited = state.spineVisited.has(sid);
      const isCheckpoint = CHECKPOINTS.includes(sid);
      return `<div class="dot ${isVisited ? 'on' : ''} ${isCheckpoint ? 'checkpoint' : ''}" title="${sid}"></div>`;
    }).join('');

    const textContent = scene.textFn ? scene.textFn(state) : scene.text;
    const choices = scene.choicesFn ? scene.choicesFn(state) : scene.choices;

    board.innerHTML = `
      <div class="topbar">
        <span class="title">11:59 Club</span>
        <div class="progress" aria-label="Story Progress">${dots}</div>
      </div>
      ${scene.timer ? `<div class="timerwrap"><div class="timerbar" id="timerbar"></div></div>` : ''}
      <div class="scene" aria-live="polite">
        <p>${textContent.split('<br><br>').join('</p><p>')}</p>
      </div>
      <div class="choices" id="choiceWrap">
        ${choices.map((c, i) => `
          <button class="choice" data-i="${i}" aria-label="Option ${i + 1}: ${c.label}">
            <span class="choice-key">${i + 1}</span>
            <span class="choice-text">${c.label}</span>
          </button>
        `).join('')}
      </div>
    `;

    choices.forEach((c, i) => {
      const btn = board.querySelector(`.choice[data-i="${i}"]`);
      if (btn) btn.onclick = () => handleChoice(c);
    });

    if (scene.timer) {
      startTimer(scene.timer);
    }

    updateTrackerButton();
  }

  function startTimer(timerCfg) {
    const bar = document.getElementById('timerbar');
    if (!bar) return;
    const total = timerCfg.seconds;
    bar.style.transition = `width ${total}s linear`;
    requestAnimationFrame(() => { bar.style.width = '0%'; });

    timerTimeout = setTimeout(() => {
      clearTimer();
      handleChoice({ next: timerCfg.defaultNext });
    }, total * 1000);
  }

  function handleChoice(choice) {
    clearTimer();
    if (choice.setFlag) {
      Object.assign(state.flags, choice.setFlag);
    }
    if (choice.next === 'RESOLVE') {
      const endId = resolveEnding(state);
      renderEnding(endId);
      return;
    }
    if (ENDINGS[choice.next]) {
      renderEnding(choice.next);
      return;
    }
    renderScene(choice.next);
  }

  function renderEnding(id) {
    clearTimer();
    const e = ENDINGS[id];
    if (!e) { console.error('Missing ending:', id); return; }

    const isNewlyUnlocked = saveUnlockedEnding(id);
    updateTrackerButton();

    playLoop(e.audioLoop);
    if (e.audioStab) playStab(e.audioStab);

    let tagClass = 'end-tag';
    if (e.good) tagClass += ' good';

    board.innerHTML = `
      <div class="topbar">
        <span class="title">11:59 Club</span>
        <span>Rider: ${state.playerName}</span>
      </div>
      <div class="endwrap" aria-live="polite">
        <div>
          ${isNewlyUnlocked ? `<div class="unlock-toast">★ NEW ENDING UNLOCKED! ★</div>` : ''}
          <p style="text-align:left; line-height:1.65; font-size:0.98rem;">
            ${e.text.split('<br><br>').join('</p><p style="text-align:left; line-height:1.65; font-size:0.98rem;">')}
          </p>
        </div>
        <div>
          <div class="${tagClass}">— ${e.title} —</div>
          <div class="actionrow">
            <button class="go-btn" id="againBtn">Play Again</button>
            <button class="ghost-btn" id="restartBtn">Back to Start</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('restartBtn').onclick = () => {
      resetState();
      renderStart();
    };

    document.getElementById('againBtn').onclick = () => {
      if (e.restartFull) {
        resetState();
        renderScene('G1');
        return;
      }
      const target = e.checkpointReturn || state.checkpoint || 'G1';
      renderScene(target);
    };
  }

  /* ===========================================================
     KEYBOARD NAVIGATION ACCESSIBILITY
     =========================================================== */
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('endingsModal');
    if (modal && modal.classList.contains('open') && e.key === 'Escape') {
      closeEndingsModal();
      return;
    }

    if (['1', '2', '3'].includes(e.key)) {
      const idx = parseInt(e.key, 10) - 1;
      const choiceBtn = document.querySelector(`.choice[data-i="${idx}"]`);
      if (choiceBtn) {
        choiceBtn.click();
      }
    }
  });

  /* ===========================================================
     VISITOR & PASSENGER TRACKING ENGINE
     =========================================================== */
  async function initVisitorTracker() {
    const countEl = document.getElementById('visitorCountVal');
    if (!countEl) return;

    const STORAGE_KEY_TOTAL = 'the1159_visitor_count';
    const SESSION_KEY = 'the1159_session_counted';
    
    // Display cached local count immediately if available
    let cachedCount = parseInt(localStorage.getItem(STORAGE_KEY_TOTAL) || '1', 10);
    countEl.textContent = cachedCount.toLocaleString();

    const isSessionCounted = sessionStorage.getItem(SESSION_KEY);
    const namespace = 'the-1159-club-book-one';
    const key = 'passengers';

    // Primary & secondary counter endpoints
    const endpoint = isSessionCounted
      ? `https://abacus.jasoncameron.dev/get/${namespace}/${key}`
      : `https://abacus.jasoncameron.dev/hit/${namespace}/${key}`;

    const fallbackEndpoint = isSessionCounted
      ? `https://countapi.mileshilliard.com/api/v1/get/${namespace}`
      : `https://countapi.mileshilliard.com/api/v1/hit/${namespace}`;

    const tryFetchCount = async (url) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) return null;
      const data = await res.json();
      const val = data.value || data.count;
      return typeof val === 'number' ? val : (parseInt(val, 10) || null);
    };

    try {
      let serverCount = await tryFetchCount(endpoint);
      if (!serverCount) {
        serverCount = await tryFetchCount(fallbackEndpoint);
      }

      if (serverCount && serverCount > 0) {
        localStorage.setItem(STORAGE_KEY_TOTAL, serverCount.toString());
        sessionStorage.setItem(SESSION_KEY, 'true');
        countEl.textContent = serverCount.toLocaleString();
        return;
      }
    } catch (err) {
      console.log('Visitor API note: Using local counter fallback.', err.message || err);
    }

    // Fallback counter increment for offline / network issues
    if (!isSessionCounted) {
      cachedCount += 1;
      localStorage.setItem(STORAGE_KEY_TOTAL, cachedCount.toString());
      sessionStorage.setItem(SESSION_KEY, 'true');
      countEl.textContent = cachedCount.toLocaleString();
    }
  }

  /* ===========================================================
     INITIALIZATION & EVENT LISTENERS
     =========================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    updateMuteUI();
    if (muteBtn) muteBtn.onclick = toggleMute;

    const trackerBtn = document.getElementById('trackerBtn');
    if (trackerBtn) trackerBtn.onclick = openEndingsModal;

    const modalCloseBtn = document.getElementById('modalCloseBtn');
    if (modalCloseBtn) modalCloseBtn.onclick = closeEndingsModal;

    const modal = document.getElementById('endingsModal');
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) closeEndingsModal();
      };
    }

    initVisitorTracker();
    renderStart();
  });

})();
