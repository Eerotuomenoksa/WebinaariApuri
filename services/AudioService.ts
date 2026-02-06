
import { MusicType } from '../types';

class AudioService {
  private audioCtx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private currentType: string = MusicType.NONE;
  private volume: number = 0.15;
  private isMuted: boolean = false;
  private audioEl: HTMLAudioElement | null = null;

  private init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.connect(this.audioCtx.destination);
      this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioCtx.currentTime);
    }
  }

  public setVolume(val: number) {
    this.volume = val;
    if (this.gainNode && this.audioCtx && !this.isMuted) {
      this.gainNode.gain.setTargetAtTime(this.volume, this.audioCtx.currentTime, 0.1);
    }
    if (this.audioEl) {
      this.audioEl.volume = this.isMuted ? 0 : this.volume;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.gainNode && this.audioCtx) {
      const targetGain = this.isMuted ? 0 : this.volume;
      this.gainNode.gain.setTargetAtTime(targetGain, this.audioCtx.currentTime, 0.2);
    }
    if (this.audioEl) {
      this.audioEl.volume = this.isMuted ? 0 : this.volume;
    }
  }

  public play(type: string, customUrl?: string | null) {
    this.init();
    if (this.currentType === type && type !== MusicType.CUSTOM) return;
    this.stop();
    this.currentType = type;

    if (type === MusicType.NONE || !this.audioCtx || !this.gainNode) return;

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

    this.oscillator = this.audioCtx.createOscillator();
    this.filter = this.audioCtx.createBiquadFilter();
    this.lfo = this.audioCtx.createOscillator();
    const lfoGain = this.audioCtx.createGain();
    
    const now = this.audioCtx.currentTime;

    // Default filter setup for warm, muffled "elevator" sound
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(800, now);

    switch (type) {
      case MusicType.ELEVATOR_1: // Classical Elevator
        this.oscillator.type = 'sine';
        this.oscillator.frequency.setValueAtTime(349.23, now); // F4
        this.filter.frequency.setValueAtTime(600, now);
        break;
      case MusicType.ELEVATOR_2: // Bossa Nova vibe
        this.oscillator.type = 'triangle';
        this.oscillator.frequency.setValueAtTime(293.66, now); // D4
        this.filter.frequency.setValueAtTime(400, now);
        // Add a gentle pulse
        lfoGain.gain.setValueAtTime(20, now);
        this.lfo.frequency.setValueAtTime(2, now);
        this.lfo.connect(lfoGain);
        lfoGain.connect(this.oscillator.frequency);
        this.lfo.start();
        break;
      case MusicType.ELEVATOR_3: // Soft Jazz
        this.oscillator.type = 'sine';
        this.oscillator.frequency.setValueAtTime(220, now); // A3
        this.filter.frequency.setValueAtTime(300, now);
        break;
      case MusicType.ELEVATOR_4: // Lounge Chill
        this.oscillator.type = 'sine';
        this.oscillator.frequency.setValueAtTime(110, now); // A2
        this.filter.frequency.setValueAtTime(150, now);
        break;
      case MusicType.ELEVATOR_5: // Modern Lobby
        this.oscillator.type = 'triangle';
        this.oscillator.frequency.setValueAtTime(440, now); // A4
        this.filter.frequency.setValueAtTime(1000, now);
        break;
    }

    this.oscillator.connect(this.filter);
    this.filter.connect(this.gainNode);
    this.oscillator.start();
    
    const targetGain = this.isMuted ? 0 : this.volume;
    this.gainNode.gain.setTargetAtTime(targetGain, now, 2);
  }

  public stop() {
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl = null;
    }
    if (this.lfo) {
      try { this.lfo.stop(); } catch(e) {}
      this.lfo = null;
    }
    if (this.oscillator && this.gainNode && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      this.gainNode.gain.setTargetAtTime(0, now, 0.5);
      const prevOsc = this.oscillator;
      setTimeout(() => {
        try {
          prevOsc.stop();
        } catch (e) {}
      }, 600);
      this.oscillator = null;
    }
    this.currentType = MusicType.NONE;
  }
}

export const audioService = new AudioService();
