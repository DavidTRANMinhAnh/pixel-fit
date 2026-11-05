let ctx: AudioContext | null = null;

/** Petit bip 8-bit (onde carrée) joué avec la Web Audio API. */
export function beep(freq = 660, duration = 0.1, volume = 0.08) {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.value = volume;
    gain.gain.setValueAtTime(volume, ctx.currentTime + duration * 0.8);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    /* audio indisponible : on ignore */
  }
}
