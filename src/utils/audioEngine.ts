/**
 * Web Audio API based sound synthesizer for authentic Dhak, Kanshor, Shankho, and festive music melodies.
 * Completely self-contained and zero latency, ensuring reliable audio in all environments.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;
  private dhakInterval: number | null = null;
  private currentPatternId: string | null = null;
  private isDhakPlaying = false;
  private isMusicPlaying = false;
  private musicInterval: number | null = null;
  private masterGain: GainNode | null = null;
  private dhakGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private audioEl: HTMLAudioElement | null = null;
  private audioSourceNode: MediaElementAudioSourceNode | null = null;
  private onDhakStepCallback: ((stepIndex: number, hitType: string) => void) | null = null;
  private onWaveformDataCallback: ((data: Uint8Array) => void) | null = null;
  private analyser: AnalyserNode | null = null;
  private animationFrameId: number | null = null;

  constructor() {
    // Lazy initialization on first user interaction
  }

  private init() {
    if (this.isInitialized && this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);

      this.dhakGain = this.ctx.createGain();
      this.dhakGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.dhakGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      this.isInitialized = true;
      this.startVisualizerLoop();
    } catch (e) {
      console.warn('AudioContext not supported or blocked:', e);
    }
  }

  public resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime, 0.05);
    }
  }

  public setDhakVolume(val: number) {
    if (this.dhakGain && this.ctx) {
      this.dhakGain.gain.setTargetAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime, 0.05);
    }
  }

  public setMusicVolume(val: number) {
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime, 0.05);
    }
  }

  public setOnDhakStep(cb: (stepIndex: number, hitType: string) => void) {
    this.onDhakStepCallback = cb;
  }

  public setOnWaveformData(cb: (data: Uint8Array) => void) {
    this.onWaveformDataCallback = cb;
  }

  private startVisualizerLoop() {
    if (!this.analyser) return;
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const tick = () => {
      if (this.analyser && this.onWaveformDataCallback) {
        this.analyser.getByteFrequencyData(dataArray);
        this.onWaveformDataCallback(dataArray);
      }
      this.animationFrameId = requestAnimationFrame(tick);
    };
    tick();
  }

  // --- STRIKE SOUNDS (Dhak Bass, Slap, Rim, Kanshor, Shankho) ---

  // Deep booming bass side of Dhak
  public playDhakBass(velocity = 1.0) {
    this.init();
    if (!this.ctx || !this.dhakGain) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(145, t);
    osc.frequency.exponentialRampToValueAtTime(52, t + 0.14);

    gain.gain.setValueAtTime(0.9 * velocity, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.dhakGain);

    osc.start(t);
    osc.stop(t + 0.36);
  }

  // Crisp treble stick slap on thin Dhak membrane ("kiti" / "kur")
  public playDhakSlap(velocity = 1.0) {
    this.init();
    if (!this.ctx || !this.dhakGain) return;
    const t = this.ctx.currentTime;

    // Membrane pitch
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.08);

    gain.gain.setValueAtTime(0.7 * velocity, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.dhakGain);

    // Noise burst for stick snap
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1800;
    noiseFilter.Q.value = 3;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6 * velocity, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.dhakGain);

    osc.start(t);
    osc.stop(t + 0.13);
    noise.start(t);
  }

  // Wooden rim stick click ("taka" / "chhot")
  public playDhakRim(velocity = 0.8) {
    this.init();
    if (!this.ctx || !this.dhakGain) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(860, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.04);

    gain.gain.setValueAtTime(0.4 * velocity, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.dhakGain);

    osc.start(t);
    osc.stop(t + 0.06);
  }

  // Kanshor (Bengali brass gong/cymbal bell accompaniment)
  public playKanshor(velocity = 0.7) {
    this.init();
    if (!this.ctx || !this.dhakGain) return;
    const t = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const osc3 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1420, t);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2850, t);

    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(4280, t);

    gain.gain.setValueAtTime(0.35 * velocity, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    osc3.connect(gain);
    gain.connect(this.dhakGain);

    osc1.start(t);
    osc2.start(t);
    osc3.start(t);
    osc1.stop(t + 0.5);
    osc2.stop(t + 0.5);
    osc3.stop(t + 0.5);
  }

  // Sacred Temple Bell (Ghanta) chime
  public playTempleBell() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    const freqs = [1046.5, 1318.5, 1567.98, 2093.0]; // High resonant harmonics (C6, E6, G6, C7)
    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      const decay = 1.2 - idx * 0.2;
      gain.gain.setValueAtTime(0.2 / (idx + 1), t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(t);
      osc.stop(t + decay + 0.1);
    });
  }

  // Sacred Shankho (Conch Shell) invocation sound
  public playShankho() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(290, t);
    osc.frequency.linearRampToValueAtTime(345, t + 0.6);
    osc.frequency.linearRampToValueAtTime(340, t + 1.8);
    osc.frequency.linearRampToValueAtTime(280, t + 2.5);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.5, t + 0.5);
    gain.gain.setValueAtTime(0.5, t + 1.8);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 2.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 2.7);
  }

  // --- DHAK RHYTHMIC LOOPER ---
  public toggleDhakLoop(patternId = 'agomoni') {
    if (this.isDhakPlaying && this.currentPatternId === patternId) {
      this.stopDhakLoop();
      return false;
    } else {
      this.startDhakLoop(patternId);
      return true;
    }
  }

  public startDhakLoop(patternId = 'agomoni') {
    this.resume();
    this.stopDhakLoop();
    this.isDhakPlaying = true;
    this.currentPatternId = patternId;

    // Beat step definition:
    // 0: Bass (Dhum), 1: Slap (Kur), 2: Rim (Taka), 3: Kanshor
    interface BeatStep {
      bass?: boolean;
      slap?: boolean;
      rim?: boolean;
      kanshor?: boolean;
      vel?: number;
      name: string;
    }

    let steps: BeatStep[] = [];
    let bpm = 112;

    if (patternId === 'dhunuchi') {
      bpm = 136;
      steps = [
        { bass: true, kanshor: true, vel: 1.0, name: 'Dha' },
        { slap: true, vel: 0.7, name: 'Tin' },
        { slap: true, vel: 0.8, name: 'Tin' },
        { bass: true, vel: 0.9, name: 'Dhum' },
        { slap: true, kanshor: true, vel: 0.9, name: 'Kur' },
        { slap: true, vel: 0.8, name: 'Kur' },
        { bass: true, kanshor: true, vel: 1.0, name: 'Dha' },
        { rim: true, vel: 0.7, name: 'Kiti' },
      ];
    } else if (patternId === 'sandhi') {
      bpm = 122;
      steps = [
        { bass: true, kanshor: true, vel: 1.0, name: 'Dha' },
        { rim: true, vel: 0.6, name: 'Ghene' },
        { slap: true, vel: 0.8, name: 'Dha' },
        { rim: true, vel: 0.6, name: 'Ghene' },
        { slap: true, kanshor: true, vel: 0.9, name: 'Kiti' },
        { slap: true, vel: 0.8, name: 'Taka' },
        { bass: true, kanshor: true, vel: 1.0, name: 'Dhum' },
        { bass: true, vel: 0.9, name: 'Dha' },
      ];
    } else if (patternId === 'bisorjon') {
      bpm = 128;
      steps = [
        { bass: true, kanshor: true, vel: 1.0, name: 'Dhum' },
        { bass: true, vel: 0.8, name: 'Dhum' },
        { slap: true, vel: 0.9, name: 'Dha' },
        { kanshor: true, vel: 0.7, name: 'Jhaang' },
        { slap: true, vel: 0.8, name: 'Kiti' },
        { slap: true, vel: 0.8, name: 'Kiti' },
        { bass: true, kanshor: true, vel: 1.0, name: 'Dha' },
        { rim: true, vel: 0.7, name: 'Ta' },
      ];
    } else {
      // Default: Agomoni
      bpm = 110;
      steps = [
        { bass: true, kanshor: true, vel: 1.0, name: 'Dhum' },
        { slap: true, vel: 0.7, name: 'Kur' },
        { slap: true, vel: 0.8, name: 'Kur' },
        { bass: true, vel: 0.85, name: 'Dhum' },
        { slap: true, kanshor: true, vel: 0.9, name: 'Kur' },
        { slap: true, vel: 0.7, name: 'Kur' },
        { bass: true, kanshor: true, vel: 1.0, name: 'Dhum' },
        { slap: true, vel: 0.9, name: 'Dha' },
      ];
    }

    const stepInterval = (60 / bpm / 2) * 1000; // 16th or 8th note interval
    let stepIndex = 0;

    const runStep = () => {
      const s = steps[stepIndex];
      if (s.bass) this.playDhakBass(s.vel);
      if (s.slap) this.playDhakSlap(s.vel);
      if (s.rim) this.playDhakRim(s.vel);
      if (s.kanshor) this.playKanshor(s.vel ? s.vel * 0.8 : 0.7);

      if (this.onDhakStepCallback) {
        this.onDhakStepCallback(stepIndex, s.name);
      }

      stepIndex = (stepIndex + 1) % steps.length;
    };

    runStep();
    this.dhakInterval = window.setInterval(runStep, stepInterval);
  }

  public stopDhakLoop() {
    if (this.dhakInterval !== null) {
      clearInterval(this.dhakInterval);
      this.dhakInterval = null;
    }
    this.isDhakPlaying = false;
  }

  public getIsDhakPlaying() {
    return this.isDhakPlaying;
  }

  public getCurrentDhakPattern() {
    return this.currentPatternId;
  }

  private currentTrackSource: AudioBufferSourceNode | null = null;
  private bufferCache: Map<string, AudioBuffer> = new Map();

  // --- MELODIC FESTIVE PUJA AUDIO ENGINE ---
  // Plays imported audio files (MP3/WAV) or high-fidelity realistic synthesized audio buffers
  public startMelodyTrack(
    trackId: string,
    audioSrc?: string,
    onTimeUpdate?: (seconds: number, duration?: number) => void
  ) {
    this.resume();
    this.stopMelodyTrack();
    this.stopDhakLoop();
    this.isMusicPlaying = true;

    if (!this.ctx || !this.musicGain) return;

    if (audioSrc && !audioSrc.includes('soundhelix.com')) {
      try {
        const audio = new Audio(audioSrc);
        audio.volume = 0.85;

        const updateTimeAndDuration = () => {
          if (onTimeUpdate) {
            const cur = Math.floor(audio.currentTime || 0);
            const dur = Math.floor(audio.duration || 0);
            onTimeUpdate(cur, dur > 0 ? dur : undefined);
          }
        };

        audio.onloadedmetadata = updateTimeAndDuration;
        audio.ontimeupdate = updateTimeAndDuration;

        audio.onended = () => {
          this.isMusicPlaying = false;
        };

        try {
          const source = this.ctx.createMediaElementSource(audio);
          source.connect(this.musicGain);
        } catch (e) {
          // MediaElementSource might already exist or be blocked
        }

        audio.play().then(() => {
          this.audioEl = audio;
        }).catch((err) => {
          console.warn('Real audio play error, falling back to synth buffer:', err);
          this.playBufferTrack(trackId, onTimeUpdate);
        });

        this.audioEl = audio;
        return;
      } catch (e) {
        console.warn('Audio element error:', e);
      }
    }

    this.playBufferTrack(trackId, onTimeUpdate);
  }

  public seek(seconds: number) {
    if (this.audioEl) {
      try {
        this.audioEl.currentTime = seconds;
      } catch (e) {}
    }
  }

  private playBufferTrack(
    trackId: string,
    onTimeUpdate?: (seconds: number, duration?: number) => void
  ) {
    if (!this.ctx || !this.musicGain) return;

    try {
      const buffer = this.generateTrackBuffer(trackId);
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(this.musicGain);
      source.start(0);

      this.currentTrackSource = source;

      let elapsedSeconds = 0;
      this.musicInterval = window.setInterval(() => {
        elapsedSeconds += 1;
        if (onTimeUpdate) {
          onTimeUpdate(elapsedSeconds);
        }
      }, 1000);
    } catch (e) {
      console.warn('Synth buffer playback error:', e);
    }
  }

  private generateTrackBuffer(trackId: string): AudioBuffer {
    if (this.bufferCache.has(trackId)) {
      return this.bufferCache.get(trackId)!;
    }

    if (!this.ctx) {
      this.init();
    }
    const sampleRate = this.ctx?.sampleRate || 44100;
    const duration = 12; // 12-second loopable track
    const numSamples = Math.floor(sampleRate * duration);

    const buffer = this.ctx!.createBuffer(1, numSamples, sampleRate);
    const data = buffer.getChannelData(0);

    // Track Configuration Spec: Unique Root Pitch, Instrument Timbre, Tempo, & Melodic Notes
    interface TrackSpec {
      rootFreq: number;       // Base root frequency for key signature
      dronePitch2: number;   // Harmonizing fifth or fourth
      waveType: 'sine' | 'sawtooth' | 'square' | 'triangle' | 'chandi_path'; // Instrument timbre
      filterFreq: number;    // Tone brightness
      tempo: number;         // BPM
      notes: number[];       // Scale multipliers
      hasDhak?: boolean;     // Authentic Dhak percussion layer
      dhakBpm?: number;      // Dhak beat speed
      hasShankho?: boolean;  // Sacred Conch Shell invocation
    }

    const trackSpecs: Record<string, TrackSpec> = {
      // 1. DURGA PUJA TRACKS
      'dp-1': { // Dugga Elo - Bright C Major Flute
        rootFreq: 261.63,
        dronePitch2: 392.00,
        waveType: 'sine',
        filterFreq: 2400,
        tempo: 120,
        notes: [1, 1.25, 1.5, 1.68, 2, 1.68, 1.5, 1.25, 1, 1.12, 1.25, 1.5, 2, 1.68]
      },
      'dp-2': { // Dugga Ma - Soulful G Major Sitar Anthem
        rootFreq: 196.00,
        dronePitch2: 293.66,
        waveType: 'sawtooth',
        filterFreq: 1400,
        tempo: 95,
        notes: [1.5, 1.68, 2, 2.25, 2.5, 2.25, 2, 1.68, 1.5, 1.25, 1.5, 1.68, 1]
      },
      'dp-3': { // Ebar Jeno Onno Rokom Pujo - Energetic D Major Harmonium Beat
        rootFreq: 293.66,
        dronePitch2: 440.00,
        waveType: 'triangle',
        filterFreq: 1800,
        tempo: 135,
        notes: [1, 1.12, 1.25, 1.5, 1.68, 1.5, 1.25, 1.12, 1, 1.25, 1.5, 2]
      },
      'dp-4': { // Dhak Baja Kashor Baja - Electrifying E Shehnai Fusion
        rootFreq: 329.63,
        dronePitch2: 493.88,
        waveType: 'square',
        filterFreq: 2600,
        tempo: 130,
        notes: [1.68, 2, 2.25, 2.5, 3, 2.5, 2.25, 2, 1.68, 1.5, 1.25, 1.5]
      },
      'dp-5': { // Bolo Dugga Elo - F Major Joyful Chorus
        rootFreq: 349.23,
        dronePitch2: 523.25,
        waveType: 'sine',
        filterFreq: 2000,
        tempo: 115,
        notes: [1, 1.25, 1.33, 1.5, 1.68, 1.87, 2, 1.87, 1.68, 1.5, 1.33, 1.25]
      },
      'dp-6': { // Aamaar Dugga - Tender A Minor Emotional Sitar Ballad
        rootFreq: 220.00,
        dronePitch2: 329.63,
        waveType: 'sawtooth',
        filterFreq: 1100,
        tempo: 88,
        notes: [1.25, 1.5, 1.68, 2, 1.68, 1.5, 1.25, 1.12, 1, 1.12, 1.25, 1.5]
      },
      'dp-7': { // Dhaker Taley - Fast Bb Dhunuchi Dance Frenzy
        rootFreq: 233.08,
        dronePitch2: 349.23,
        waveType: 'square',
        filterFreq: 2400,
        tempo: 142,
        notes: [1, 1.12, 1.25, 1.5, 1.68, 2, 2.25, 2, 1.68, 1.5, 1.25, 1.12]
      },
      'dp-8': { // Dugga Elo Akriti - Ab Sparkling Morning Pop
        rootFreq: 207.65,
        dronePitch2: 311.13,
        waveType: 'triangle',
        filterFreq: 1900,
        tempo: 110,
        notes: [1.5, 1.68, 2, 2.5, 2.25, 2, 1.68, 1.5, 1.25, 1.5, 1.68]
      },
      'dp-9': { // Shundori Komola - D Bhatiyali Folk Rhythm
        rootFreq: 293.66,
        dronePitch2: 440.00,
        waveType: 'sawtooth',
        filterFreq: 1600,
        tempo: 125,
        notes: [1, 1.25, 1.5, 1.68, 1.5, 1.25, 1, 1.12, 1.25, 1.12, 1, 1.68]
      },
      'dp-10': { // Elo Je Maa - Deep Orchestral Welcome
        rootFreq: 146.83,
        dronePitch2: 220.00,
        waveType: 'square',
        filterFreq: 1300,
        tempo: 80,
        notes: [1.68, 1.5, 1.25, 1.12, 1, 1.5, 1.68, 2, 2.25, 2.5, 2.25, 2]
      },

      // 2. MAHALAYA TRACKS
      'mh-1': { // Mahisasuramardini Full Audio - Deep C Bhairav 4 AM Sacred Chandi Path
        rootFreq: 130.81,
        dronePitch2: 196.00,
        waveType: 'chandi_path',
        filterFreq: 950,
        tempo: 65,
        notes: [1, 1.06, 1.25, 1.33, 1.5, 1.6, 1.87, 2, 1.87, 1.6, 1.5, 1.33],
        hasDhak: false,
        hasShankho: true
      },
      'mh-2': { // Jago Durga - Celestial Invocation
        rootFreq: 220.00,
        dronePitch2: 329.63,
        waveType: 'chandi_path',
        filterFreq: 1200,
        tempo: 75,
        notes: [1, 1.33, 1.5, 1.68, 1.87, 2, 1.87, 1.68, 1.5, 1.33, 1],
        hasDhak: false,
        hasShankho: true
      },
      'mh-3': { // Ya Chandi Shloka - Resonant Temple Shloka Tone
        rootFreq: 196.00,
        dronePitch2: 293.66,
        waveType: 'sine',
        filterFreq: 1500,
        tempo: 70,
        notes: [1.5, 1.68, 1.87, 2, 2.25, 2, 1.87, 1.68, 1.5, 1.33, 1.25],
        hasDhak: false,
        hasShankho: true
      },
      'mh-4': { // Rupang Dehi Jayang Dehi - Devotional Grace Hymn
        rootFreq: 174.61,
        dronePitch2: 261.63,
        waveType: 'sine',
        filterFreq: 1000,
        tempo: 72,
        notes: [1.25, 1.33, 1.5, 1.68, 2, 1.87, 1.68, 1.5, 1.33, 1.25],
        hasDhak: false,
        hasShankho: true
      },
      'mh-5': { // Bajlo Tomar Alor Benu - Pure E Flute Morning Melody
        rootFreq: 329.63,
        dronePitch2: 493.88,
        waveType: 'sine',
        filterFreq: 2800,
        tempo: 90,
        notes: [1, 1.12, 1.25, 1.5, 1.68, 2, 1.68, 1.5, 1.25, 1.12, 1],
        hasDhak: false,
        hasShankho: true
      },
      'mh-6': { // Tabo Shubo Shankho Dhabani - Sacred Conch Vibrations
        rootFreq: 261.63,
        dronePitch2: 392.00,
        waveType: 'chandi_path',
        filterFreq: 1400,
        tempo: 80,
        notes: [1, 1.5, 1.68, 2, 2.25, 2, 1.68, 1.5, 1.25, 1.12, 1],
        hasDhak: false,
        hasShankho: true
      },

      // 3. MAHALAYA SONGS
      'ms-1': { // Bajlo Tomar Alor Benu Song - Radiant Morning Flute
        rootFreq: 329.63,
        dronePitch2: 493.88,
        waveType: 'sine',
        filterFreq: 2800,
        tempo: 90,
        notes: [1.25, 1.5, 1.68, 2, 2.25, 2, 1.68, 1.5, 1.25, 1.12, 1],
        hasDhak: false,
        hasShankho: true
      },
      'ms-2': { // Jaago Tumi Jaago - Gentle Devotional Awakening
        rootFreq: 261.63,
        dronePitch2: 392.00,
        waveType: 'triangle',
        filterFreq: 1600,
        tempo: 85,
        notes: [1, 1.12, 1.25, 1.33, 1.5, 1.68, 2, 1.68, 1.5, 1.33, 1.25],
        hasDhak: false,
        hasShankho: true
      },
      'ms-3': { // Matribhumi Matrimurti - Deep Reverence Chant
        rootFreq: 196.00,
        dronePitch2: 293.66,
        waveType: 'chandi_path',
        filterFreq: 1100,
        tempo: 78,
        notes: [1.5, 1.68, 2, 2.25, 2.5, 2.25, 2, 1.68, 1.5, 1.25, 1.12],
        hasDhak: false,
        hasShankho: true
      },
      'ms-4': { // Subhra Shankha Robe - Clear White Conch Dawn Melody
        rootFreq: 293.66,
        dronePitch2: 440.00,
        waveType: 'sine',
        filterFreq: 2200,
        tempo: 92,
        notes: [1, 1.25, 1.5, 1.68, 2, 1.68, 1.5, 1.25, 1, 1.12, 1.25],
        hasDhak: false,
        hasShankho: true
      },
      'ms-5': { // He Chinmayi - Celestial Wisdom Hymn
        rootFreq: 220.00,
        dronePitch2: 329.63,
        waveType: 'sawtooth',
        filterFreq: 1700,
        tempo: 84,
        notes: [1.68, 2, 2.25, 2.5, 2.25, 2, 1.68, 1.5, 1.25, 1.5, 1.68],
        hasDhak: false,
        hasShankho: true
      }
    };

    const spec = trackSpecs[trackId] || trackSpecs['dp-1'];

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let val = 0;

      // 1. Tanpura / Drone (Key Root & Fifth)
      const drone1 = Math.sin(2 * Math.PI * (spec.rootFreq / 2) * t) * 0.15;
      const drone2 = Math.sin(2 * Math.PI * (spec.dronePitch2 / 2) * t) * 0.10;
      val += drone1 + drone2;

      // 2. Melody Note Step
      const noteDuration = 60 / spec.tempo;
      const noteIndex = Math.floor(t / noteDuration) % spec.notes.length;
      const multiplier = spec.notes[noteIndex];

      if (multiplier > 0) {
        const freq = spec.rootFreq * multiplier;
        const timeInNote = t % noteDuration;
        const env = Math.exp(-timeInNote * 3.2);

        let melodyOsc = 0;
        if (spec.waveType === 'sine') { // Flute
          const vibrato = Math.sin(2 * Math.PI * 6 * t) * 2.5;
          melodyOsc = (Math.sin(2 * Math.PI * (freq + vibrato) * t) * 0.35 +
                      Math.sin(2 * Math.PI * (freq * 2) * t) * 0.10) * env;
        } else if (spec.waveType === 'sawtooth') { // Sitar
          const saw = (2 * ((freq * t) % 1) - 1);
          melodyOsc = saw * 0.30 * env;
        } else if (spec.waveType === 'square') { // Shehnai / Reedy Brass
          const sq = Math.sin(2 * Math.PI * freq * t) > 0 ? 0.22 : -0.22;
          melodyOsc = sq * env;
        } else if (spec.waveType === 'chandi_path') { // Chandi Path Chant Tone
          const chant = Math.sin(2 * Math.PI * freq * t) +
                        Math.sin(2 * Math.PI * (freq * 2) * t) * 0.4 +
                        Math.sin(2 * Math.PI * (freq * 3) * t) * 0.2;
          melodyOsc = chant * 0.25 * env;
        } else { // Harmonium (Triangle)
          const tri = Math.abs(2 * ((freq * t) % 1) - 1) * 2 - 1;
          melodyOsc = tri * 0.32 * env;
        }

        val += melodyOsc;
      }

      // 3. Dhak Percussion Layer (if applicable)
      if (spec.hasDhak) {
        const beatSec = 60 / (spec.dhakBpm || 120);
        const timeInBeat = t % beatSec;
        const beatIndex = Math.floor(t / beatSec) % 4;

        if (beatIndex === 0 || beatIndex === 2) { // Bass Dhum
          if (timeInBeat < 0.2) {
            const bassFreq = 145 * Math.exp(-timeInBeat * 15);
            const bassGain = Math.exp(-timeInBeat * 10);
            val += Math.sin(2 * Math.PI * bassFreq * t) * 0.38 * bassGain;
          }
        }

        if (beatIndex === 1 || beatIndex === 3) { // Slap Kiti/Kur
          if (timeInBeat < 0.1) {
            const slapFreq = 420 * Math.exp(-timeInBeat * 25);
            const slapGain = Math.exp(-timeInBeat * 20);
            val += (Math.abs(2 * ((slapFreq * t) % 1) - 1) * 2 - 1) * 0.28 * slapGain;
          }
        }

        if (beatIndex === 0 && timeInBeat < 0.3) { // Kanshor Gong
          const gongGain = Math.exp(-timeInBeat * 6);
          const gong = Math.sin(2 * Math.PI * 1420 * t) + Math.sin(2 * Math.PI * 2850 * t) * 0.5;
          val += gong * 0.12 * gongGain;
        }
      }

      // 4. Sacred Shankho Conch Shell (for Mahalaya)
      if (spec.hasShankho) {
        const shankhoCycle = 4.0;
        const shankhoTime = t % shankhoCycle;
        if (shankhoTime < 2.2) {
          const sweepFreq = 290 + 55 * (shankhoTime / 2.2);
          const shankhoGain = Math.sin(Math.PI * (shankhoTime / 2.2)) * 0.22;
          const saw = (2 * ((sweepFreq * t) % 1) - 1);
          val += saw * shankhoGain;
        }
      }

      data[i] = Math.max(-1, Math.min(1, val * 0.7));
    }

    this.bufferCache.set(trackId, buffer);
    return buffer;
  }

  public stopMelodyTrack() {
    if (this.audioEl) {
      try {
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
      } catch (e) {}
      this.audioEl = null;
    }
    if (this.currentTrackSource) {
      try {
        this.currentTrackSource.stop();
        this.currentTrackSource.disconnect();
      } catch (e) {}
      this.currentTrackSource = null;
    }
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.isMusicPlaying = false;
  }

  public getIsMusicPlaying() {
    return this.isMusicPlaying;
  }
}

export const audioEngine = new AudioEngine();
