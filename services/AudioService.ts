
import { MusicType } from '../types';

class AudioService {
  private audioCtx: AudioContext | null = null;
  private voices: { osc: OscillatorNode; gain: GainNode }[] = [];
  private mainGain: GainNode | null = null;
  private currentType: string = MusicType.NONE;
  private volume: number = 0.2;
  private isMuted: boolean = false;
  private audioEl: HTMLAudioElement | null = null;

  private init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.mainGain = this.audioCtx.createGain();
      this.mainGain.connect(this.audioCtx.destination);
      this.mainGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioCtx.currentTime);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.mainGain && this.audioCtx) {
      const targetGain = this.isMuted ? 0 : this.volume;
      this.mainGain.gain.setTargetAtTime(targetGain, this.audioCtx.currentTime, 0.2);
    }
    if (this.audioEl) {
      this.audioEl.volume = this.isMuted ? 0 : this.volume;
    }
  }

  private createRichVoice(freq: number, type: OscillatorType = 'sine', pulseRate: number = 0.1) {
    if (!this.audioCtx || !this.mainGain) return;

    const osc = this.audioCtx.createOscillator();
    const voiceGain = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.audioCtx.currentTime);

    voiceGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
    
    osc.connect(filter);
    filter.connect(voiceGain);
    voiceGain.connect(this.mainGain);

    // Hitaasti "hengittävä" voimakkuus (LFO-simulaatio)
    const now = this.audioCtx.currentTime;
    voiceGain.gain.setTargetAtTime(0.2, now, 2);
    
    // Luodaan eloa ääneen pienellä detunella ja hitaalla voimakkuuden vaihtelulla
    const lfo = () => {
        if (!this.audioCtx || this.currentType === MusicType.NONE) return;
        const time = this.audioCtx.currentTime;
        voiceGain.gain.linearRampToValueAtTime(0.1 + Math.random() * 0.1, time + 4 + Math.random() * 2);
        filter.frequency.linearRampToValueAtTime(400 + Math.random() * 600, time + 5);
    };
    
    osc.start();
    this.voices.push({ osc, gain: voiceGain });
  }

  public play(type: string, customUrl?: string | null) {
    this.init();
    if (this.currentType === type && type !== MusicType.CUSTOM) return;
    this.stop();
    this.currentType = type;

    if (type === MusicType.NONE || !this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (type === MusicType.CUSTOM && customUrl) {
      this.audioEl = new Audio(customUrl);
      this.audioEl.loop = true;
      this.audioEl.volume = this.isMuted ? 0 : this.volume;
      this.audioEl.play().catch(console.error);
      return;
    }

    const now = this.audioCtx.currentTime;

    switch (type) {
      case MusicType.AIRY:
        // F Major 9th chord - ethereal and light
        [174.61, 220.00, 261.63, 329.63, 349.23].forEach(f => this.createRichVoice(f, 'sine'));
        break;
      case MusicType.WARM:
        // Csus2/9 chord - warm and inviting
        [130.81, 196.00, 261.63, 293.66, 392.00].forEach(f => this.createRichVoice(f, 'triangle'));
        break;
      case MusicType.CALM:
        // Deep Bb major drone - resonant and grounded
        [116.54, 174.61, 233.08, 277.18].forEach(f => this.createRichVoice(f, 'sine'));
        break;
    }
  }

  public stop() {
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl = null;
    }
    
    if (this.voices.length > 0 && this.mainGain && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      this.voices.forEach(v => {
        v.gain.gain.setTargetAtTime(0, now, 0.5);
        setTimeout(() => {
          try { v.osc.stop(); } catch (e) {}
        }, 1000);
      });
      this.voices = [];
    }
    this.currentType = MusicType.NONE;
  }
}

export const audioService = new AudioService();
