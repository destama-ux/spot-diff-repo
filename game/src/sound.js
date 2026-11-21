// sound.js — tiny synthesized sounds, made with oscillators at play time.
// No audio files: every note is generated, so the game stays self-contained
// and the sounds are as original as the art.

let context = null;

/** The shared AudioContext, created lazily on the first user gesture. */
function audio() {
  if (context === null) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
  }
  if (context.state === 'suspended') context.resume();
  return context;
}

/** One soft sine note with a quick envelope. */
function note(frequency, at, duration, type = 'sine', gainPeak = 0.12) {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  const start = ac.currentTime + at;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainPeak, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

/** Two bright notes when a difference is found. */
export function playFound() {
  note(880, 0, 0.16);
  note(1318.5, 0.07, 0.22);
}

/** A low dull buzz for a wrong spot. */
export function playMiss() {
  note(140, 0, 0.18, 'triangle', 0.1);
}

/** A short rising arpeggio when a scene is completed. */
export function playSceneClear() {
  note(659.25, 0, 0.16);
  note(783.99, 0.09, 0.16);
  note(1046.5, 0.18, 0.28);
}

/** A longer fanfare when all three scenes are done. */
export function playGameClear() {
  note(523.25, 0, 0.18);
  note(659.25, 0.1, 0.18);
  note(783.99, 0.2, 0.18);
  note(1046.5, 0.3, 0.4);
  note(1318.5, 0.42, 0.5);
}
