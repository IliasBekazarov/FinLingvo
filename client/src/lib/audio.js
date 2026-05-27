let ctx = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  return ctx
}

function beep(freq, type, dur, vol = 0.18) {
  try {
    const c = getCtx()
    const o = c.createOscillator()
    const g = c.createGain()
    o.connect(g); g.connect(c.destination)
    o.frequency.value = freq
    o.type = type
    g.gain.setValueAtTime(vol, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur)
    o.start(c.currentTime)
    o.stop(c.currentTime + dur)
  } catch {}
}

export const audio = {
  correct() { beep(880, 'sine', 0.18); setTimeout(() => beep(1100, 'sine', 0.22), 100) },
  wrong()   { beep(200, 'sawtooth', 0.35) },
  click()   { beep(660, 'sine', 0.08, 0.1) },
  levelup() {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 'sine', 0.25), i * 100))
  },
  complete() { beep(660, 'sine', 0.15); setTimeout(() => beep(880, 'sine', 0.2), 130) },
}
