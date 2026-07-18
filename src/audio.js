let ctx = null;
let muted = false;

function getCtx() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return ctx;
}

function playTone(freq, duration, type = 'sine', gainVal = 0.3, decay = duration) {
  if (muted) return;
  const ac = getCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(gainVal, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + decay);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + duration);
}

export function initAudio() {
  getCtx();
}

export function setMuted(val) {
  muted = !!val;
}

export function isMuted() {
  return muted;
}

export function playMove() {
  playTone(800, 0.08, 'sine', 0.25, 0.08);
}

export function playWin() {
  if (muted) return;
  const ac = getCtx();
  if (!ac) return;
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const start = ac.currentTime + i * 0.12;
    gain.gain.setValueAtTime(0.3, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(start);
    osc.stop(start + 0.2);
  });
}

export function playLose() {
  if (muted) return;
  const ac = getCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = 'sine';
  osc.frequency.value = 440;
  osc.frequency.exponentialRampToValueAtTime(220, ac.currentTime + 0.3);
  gain.gain.setValueAtTime(0.25, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.3);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + 0.3);
}

export function playDraw() {
  playTone(440, 0.2, 'triangle', 0.2, 0.2);
}

export function playClick() {
  playTone(1200, 0.04, 'sine', 0.15, 0.04);
}
