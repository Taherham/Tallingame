// Sound effects, synthesized with the Web Audio API. No audio files to load, works offline.
// Sounds are short, warm, and layered so they feel like a game, not a notification.

const Sfx = (() => {
  const KEY = "shrimp_sound";
  let ctx = null;
  let enabled = true;
  try { enabled = localStorage.getItem(KEY) !== "off"; } catch (e) { /* ignore */ }

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    return ctx;
  }

  // One note. `slide` bends the pitch to another frequency over the note's length.
  function tone({ freq, type = "sine", start = 0, dur = 0.15, gain = 0.18, slide = null, attack = 0.012 }) {
    const c = ac();
    if (!c) return;
    const t = c.currentTime + start;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  // A soft, short noise burst for taps and "thuds".
  function thump({ start = 0, dur = 0.12, gain = 0.12, freq = 140 }) {
    tone({ freq, type: "triangle", start, dur, gain, slide: freq * 0.6, attack: 0.004 });
  }

  const C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99, A5 = 880, B5 = 987.77, C6 = 1046.5, D6 = 1174.7, E6 = 1318.5, G6 = 1568;

  const library = {
    // UI
    tap: () => tone({ freq: 620, type: "triangle", dur: 0.045, gain: 0.05, attack: 0.004 }),
    // Answers
    correct: () => { tone({ freq: E5, dur: 0.09, gain: 0.16 }); tone({ freq: A5, start: 0.08, dur: 0.16, gain: 0.16 }); },
    wrong: () => { thump({ freq: 180, dur: 0.16, gain: 0.14 }); tone({ freq: 220, type: "sine", start: 0.02, dur: 0.2, gain: 0.08, slide: 170 }); },
    // Lesson complete: a rising arpeggio
    complete: () => [C5, E5, G5, C6].forEach((f, i) => tone({ freq: f, start: i * 0.09, dur: 0.26, gain: 0.15 })),
    // Practice complete: shorter, brighter
    practice: () => [E5, G5, B5].forEach((f, i) => tone({ freq: f, start: i * 0.09, dur: 0.22, gain: 0.14 })),
    // Daily goal reached
    goal: () => { [G5, B5, D6].forEach((f, i) => tone({ freq: f, start: i * 0.1, dur: 0.2, gain: 0.15 })); tone({ freq: G6, start: 0.3, dur: 0.45, gain: 0.08 }); },
    // Stripe earned: longer fanfare
    stripe: () => {
      [G5 / 2, C5, E5, G5, C6].forEach((f, i) => tone({ freq: f, start: i * 0.085, dur: 0.3, gain: 0.15 }));
      tone({ freq: E6, start: 0.48, dur: 0.5, gain: 0.1 });
      tone({ freq: C6, start: 0.48, dur: 0.5, gain: 0.08 });
    },
    // Promotion: the fanfare, twice as grand
    promotion: () => {
      [C5, E5, G5, C6, E6, G6].forEach((f, i) => tone({ freq: f, start: i * 0.08, dur: 0.34, gain: 0.15 }));
      [C6, E6, G6].forEach((f) => tone({ freq: f, start: 0.62, dur: 0.9, gain: 0.07 }));
    },
    // Out of hearts: a gentle descending line, not a punishment
    fail: () => [E5, C5, A5 / 2].forEach((f, i) => tone({ freq: f, type: "triangle", start: i * 0.14, dur: 0.24, gain: 0.12 })),
    // Streak: scales with the streak length
    streak: (n = 1) => {
      if (n >= 7) {
        [C5, E5, G5, C6, E6].forEach((f, i) => tone({ freq: f, start: i * 0.08, dur: 0.3, gain: 0.15 }));
        [C6, E6, G6].forEach((f) => tone({ freq: f, start: 0.5, dur: 0.8, gain: 0.07 }));
      } else {
        tone({ freq: G5, dur: 0.1, gain: 0.14 });
        tone({ freq: C6, start: 0.1, dur: 0.28, gain: 0.14 });
      }
    },
    // Counting tick for number roll-ups
    tick: () => tone({ freq: 900, type: "triangle", dur: 0.03, gain: 0.04, attack: 0.003 }),
  };

  function play(name, arg) {
    if (!enabled || !library[name]) return;
    try { library[name](arg); } catch (e) { /* audio is best-effort */ }
  }

  // Browsers only let audio start after a user gesture; call this from the first tap.
  function unlock() { try { ac(); } catch (e) { /* ignore */ } }

  function setEnabled(on) {
    enabled = !!on;
    try { localStorage.setItem(KEY, enabled ? "on" : "off"); } catch (e) { /* ignore */ }
    if (enabled) play("tap");
  }
  const isEnabled = () => enabled;

  return { play, unlock, setEnabled, isEnabled };
})();
