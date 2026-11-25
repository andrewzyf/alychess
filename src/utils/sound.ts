// Synthesized crisp Chess.com-style wooden board sound effects using Web Audio API
// Zero external MP3 dependencies, zero latency, works offline!

export type SoundType =
  | 'move'
  | 'capture'
  | 'check'
  | 'castle'
  | 'promote'
  | 'game-start'
  | 'game-end'
  | 'illegal';

class SoundManager {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  public setMuted(muted: boolean) {
    this.muted = muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private woodTap(time: number, freq: number, duration: number, gainPeak: number, clickNoise = 0.25) {
    const ctx = this.getContext();
    if (!ctx) return;

    // Warm wooden body thud
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.42), time + duration);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(gainPeak, time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + duration + 0.01);

    // Subtle crisp transient click
    if (clickNoise > 0) {
      const bufferSize = Math.floor(ctx.sampleRate * 0.025);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.22));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 4.2, time);
      filter.Q.setValueAtTime(1.8, time);

      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(gainPeak * clickNoise, time);
      nGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.025);

      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(ctx.destination);
      noise.start(time);
    }
  }

  public play(type: SoundType) {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    switch (type) {
      case 'move':
        this.woodTap(now, 215, 0.075, 0.34, 0.35);
        break;
      case 'capture':
        this.woodTap(now, 165, 0.095, 0.46, 0.65);
        this.woodTap(now + 0.014, 290, 0.065, 0.28, 0.45);
        break;
      case 'castle':
        this.woodTap(now, 215, 0.07, 0.32, 0.3);
        this.woodTap(now + 0.085, 245, 0.075, 0.3, 0.32);
        break;
      case 'check':
        this.woodTap(now, 230, 0.07, 0.35, 0.4);
        {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(660, now);
          osc.frequency.exponentialRampToValueAtTime(520, now + 0.14);
          g.gain.setValueAtTime(0.14, now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.16);
        }
        break;
      case 'promote':
        this.woodTap(now, 240, 0.08, 0.32, 0.3);
        [523.25, 659.25, 783.99].forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + idx * 0.045);
          g.gain.setValueAtTime(0.12, now + idx * 0.045);
          g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.045 + 0.14);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now + idx * 0.045);
          osc.stop(now + idx * 0.045 + 0.15);
        });
        break;
      case 'game-start':
        [392, 523.25].forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + idx * 0.08);
          g.gain.setValueAtTime(0.14, now + idx * 0.08);
          g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.18);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.2);
        });
        break;
      case 'game-end':
        [523.25, 659.25, 783.99].forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + idx * 0.09);
          g.gain.setValueAtTime(0.15, now + idx * 0.09);
          g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.28);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now + idx * 0.09);
          osc.stop(now + idx * 0.09 + 0.3);
        });
        break;
      case 'illegal':
        this.woodTap(now, 110, 0.09, 0.28, 0.1);
        break;
    }
  }
}

export const soundManager = new SoundManager();
