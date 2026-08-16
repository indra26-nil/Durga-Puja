const fs = require('fs');
const path = require('path');

const publicAudioDir = path.join(__dirname, '..', 'public', 'audio');

if (!fs.existsSync(publicAudioDir)) {
  fs.mkdirSync(publicAudioDir, { recursive: true });
}

const sampleRate = 44100;
const durationSeconds = 12; // 12 seconds loopable track per song
const numSamples = sampleRate * durationSeconds;

function createWavBuffer(samples) {
  const buffer = Buffer.alloc(44 + samples.length * 2);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + samples.length * 2, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(1, 22);  // NumChannels (1 = Mono)
  buffer.writeUInt32LE(sampleRate, 24); // SampleRate
  buffer.writeUInt32LE(sampleRate * 2, 28); // ByteRate
  buffer.writeUInt16LE(2, 32);  // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(samples.length * 2, 40);

  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    const val = s < 0 ? s * 32768 : s * 32767;
    buffer.writeInt16LE(Math.floor(val), 44 + i * 2);
  }

  return buffer;
}

// Track definitions with custom melodies, instrumentation, and tempos
const tracks = [
  // DURGA PUJA TRACKS
  {
    id: 'dp-1',
    name: 'Dugga Elo',
    root: 261.63, // C4
    tempo: 120,
    wave: 'festive_flute',
    scale: [1, 1.25, 1.5, 1.68, 2, 1.68, 1.5, 1.25, 1, 1.12, 1.25, 1.5, 2, 1.68],
    hasDhak: true,
    dhakBpm: 124
  },
  {
    id: 'dp-2',
    name: 'Dugga Ma',
    root: 196.00, // G3
    tempo: 95,
    wave: 'sitar',
    scale: [1.5, 1.68, 2, 2.25, 2.5, 2.25, 2, 1.68, 1.5, 1.25, 1.5, 1.68, 1],
    hasDhak: true,
    dhakBpm: 105
  },
  {
    id: 'dp-3',
    name: 'Ebar Jeno Onno Rokom Pujo',
    root: 293.66, // D4
    tempo: 135,
    wave: 'harmonium',
    scale: [1, 1.12, 1.25, 1.5, 1.68, 1.5, 1.25, 1.12, 1, 1.25, 1.5, 2],
    hasDhak: true,
    dhakBpm: 136
  },
  {
    id: 'dp-4',
    name: 'Dhak Baja Kashor Baja',
    root: 329.63, // E4
    tempo: 130,
    wave: 'brass_shehnai',
    scale: [1.68, 2, 2.25, 2.5, 3, 2.5, 2.25, 2, 1.68, 1.5, 1.25, 1.5],
    hasDhak: true,
    dhakBpm: 132
  },
  {
    id: 'dp-5',
    name: 'Bolo Dugga Elo',
    root: 349.23, // F4
    tempo: 115,
    wave: 'festive_flute',
    scale: [1, 1.25, 1.33, 1.5, 1.68, 1.87, 2, 1.87, 1.68, 1.5, 1.33, 1.25],
    hasDhak: true,
    dhakBpm: 118
  },
  {
    id: 'dp-6',
    name: 'Aamaar Dugga',
    root: 220.00, // A3
    tempo: 88,
    wave: 'sitar',
    scale: [1.25, 1.5, 1.68, 2, 1.68, 1.5, 1.25, 1.12, 1, 1.12, 1.25, 1.5],
    hasDhak: false,
    dhakBpm: 90
  },
  {
    id: 'dp-7',
    name: 'Dhaker Taley',
    root: 233.08, // Bb3
    tempo: 142,
    wave: 'brass_shehnai',
    scale: [1, 1.12, 1.25, 1.5, 1.68, 2, 2.25, 2, 1.68, 1.5, 1.25, 1.12],
    hasDhak: true,
    dhakBpm: 142
  },
  {
    id: 'dp-8',
    name: 'Dugga Elo Akriti',
    root: 207.65, // Ab3
    tempo: 110,
    wave: 'harmonium',
    scale: [1.5, 1.68, 2, 2.5, 2.25, 2, 1.68, 1.5, 1.25, 1.5, 1.68],
    hasDhak: true,
    dhakBpm: 112
  },
  {
    id: 'dp-9',
    name: 'Shundori Komola',
    root: 293.66, // D4
    tempo: 125,
    wave: 'folk_ektara',
    scale: [1, 1.25, 1.5, 1.68, 1.5, 1.25, 1, 1.12, 1.25, 1.12, 1, 1.68],
    hasDhak: true,
    dhakBpm: 126
  },
  {
    id: 'dp-10',
    name: 'Elo Je Maa',
    root: 146.83, // Low D3
    tempo: 80,
    wave: 'brass_shehnai',
    scale: [1.68, 1.5, 1.25, 1.12, 1, 1.5, 1.68, 2, 2.25, 2.5, 2.25, 2],
    hasDhak: true,
    dhakBpm: 92
  },

  // MAHALAYA TRACKS
  {
    id: 'mh-1',
    name: 'Mahisasuramardini Full Audio',
    root: 130.81, // C3 Bhairav
    tempo: 65,
    wave: 'chandi_path_invocation',
    scale: [1, 1.06, 1.25, 1.33, 1.5, 1.6, 1.87, 2, 1.87, 1.6, 1.5, 1.33],
    hasDhak: false,
    hasShankho: true
  },
  {
    id: 'mh-2',
    name: 'Jago Durga',
    root: 220.00, // A3
    tempo: 75,
    wave: 'chandi_path_invocation',
    scale: [1, 1.33, 1.5, 1.68, 1.87, 2, 1.87, 1.68, 1.5, 1.33, 1],
    hasDhak: false,
    hasShankho: true
  },
  {
    id: 'mh-3',
    name: 'Ya Chandi Madhukaithabharadhani',
    root: 196.00, // G3
    tempo: 70,
    wave: 'temple_bell',
    scale: [1.5, 1.68, 1.87, 2, 2.25, 2, 1.87, 1.68, 1.5, 1.33, 1.25],
    hasDhak: false,
    hasShankho: true
  },
  {
    id: 'mh-4',
    name: 'Rupang Dehi Jayang Dehi',
    root: 174.61, // F3
    tempo: 72,
    wave: 'temple_bell',
    scale: [1.25, 1.33, 1.5, 1.68, 2, 1.87, 1.68, 1.5, 1.33, 1.25],
    hasDhak: false,
    hasShankho: true
  },
  {
    id: 'mh-5',
    name: 'Bajlo Tomar Alor Benu',
    root: 329.63, // E4 Flute
    tempo: 90,
    wave: 'festive_flute',
    scale: [1, 1.12, 1.25, 1.5, 1.68, 2, 1.68, 1.5, 1.25, 1.12, 1],
    hasDhak: false,
    hasShankho: true
  },
  {
    id: 'mh-6',
    name: 'Tabo Shubo Shankho Dhabani',
    root: 261.63, // C4
    tempo: 80,
    wave: 'chandi_path_invocation',
    scale: [1, 1.5, 1.68, 2, 2.25, 2, 1.68, 1.5, 1.25, 1.12, 1],
    hasDhak: false,
    hasShankho: true
  },

  // MAHALAYA SONGS
  {
    id: 'ms-1',
    name: 'Bajlo Tomar Alor Benu Song',
    root: 329.63, // E4
    tempo: 90,
    wave: 'festive_flute',
    scale: [1.25, 1.5, 1.68, 2, 2.25, 2, 1.68, 1.5, 1.25, 1.12, 1],
    hasDhak: false,
    hasShankho: true
  },
  {
    id: 'ms-2',
    name: 'Jaago Tumi Jaago',
    root: 261.63, // C4
    tempo: 85,
    wave: 'harmonium',
    scale: [1, 1.12, 1.25, 1.33, 1.5, 1.68, 2, 1.68, 1.5, 1.33, 1.25],
    hasDhak: false,
    hasShankho: true
  },
  {
    id: 'ms-3',
    name: 'Matribhumi Matrimurti',
    root: 196.00, // G3
    tempo: 78,
    wave: 'chandi_path_invocation',
    scale: [1.5, 1.68, 2, 2.25, 2.5, 2.25, 2, 1.68, 1.5, 1.25, 1.12],
    hasDhak: false,
    hasShankho: true
  },
  {
    id: 'ms-4',
    name: 'Subhra Shankha Robe',
    root: 293.66, // D4
    tempo: 92,
    wave: 'festive_flute',
    scale: [1, 1.25, 1.5, 1.68, 2, 1.68, 1.5, 1.25, 1, 1.12, 1.25],
    hasDhak: false,
    hasShankho: true
  },
  {
    id: 'ms-5',
    name: 'He Chinmayi',
    root: 220.00, // A3
    tempo: 84,
    wave: 'sitar',
    scale: [1.68, 2, 2.25, 2.5, 2.25, 2, 1.68, 1.5, 1.25, 1.5, 1.68],
    hasDhak: false,
    hasShankho: true
  }
];

// Sound Synthesizer Functions
function getSample(t, track) {
  let val = 0;

  // 1. Tanpura / Drone (Base pitch & Fifth)
  const drone1 = Math.sin(2 * Math.PI * (track.root / 2) * t) * 0.15;
  const drone2 = Math.sin(2 * Math.PI * (track.root * 0.75) * t) * 0.10;
  val += drone1 + drone2;

  // 2. Melody Note Step calculation
  const noteDuration = 60 / track.tempo;
  const noteIndex = Math.floor(t / noteDuration) % track.scale.length;
  const noteMult = track.scale[noteIndex];

  if (noteMult > 0) {
    const freq = track.root * noteMult;
    const timeInNote = t % noteDuration;
    
    // Note envelope (Attack + Decay)
    const env = Math.exp(-timeInNote * 3.5);

    let melodyOsc = 0;
    if (track.wave === 'festive_flute') {
      // Pure sine with gentle 2nd harmonic and vibrato
      const vibrato = Math.sin(2 * Math.PI * 6 * t) * 3;
      melodyOsc = Math.sin(2 * Math.PI * (freq + vibrato) * t) * 0.35 +
                  Math.sin(2 * Math.PI * (freq * 2) * t) * 0.10;
    } else if (track.wave === 'sitar') {
      // Sawtooth with string bend (meend)
      const bend = Math.sin(2 * Math.PI * (freq * 1.006) * t);
      const saw = (2 * ((freq * t) % 1) - 1);
      melodyOsc = (saw * 0.3 + bend * 0.2) * env;
    } else if (track.wave === 'brass_shehnai') {
      // Shehnai reedy dual waveform
      const reed1 = (2 * ((freq * t) % 1) - 1);
      const reed2 = Math.sin(2 * Math.PI * (freq * 1.5) * t);
      melodyOsc = (reed1 * 0.25 + reed2 * 0.15) * env;
    } else if (track.wave === 'temple_bell') {
      // High bell chimes
      const bell1 = Math.sin(2 * Math.PI * freq * t);
      const bell2 = Math.sin(2 * Math.PI * (freq * 2.76) * t) * 0.4;
      const bellEnv = Math.exp(-timeInNote * 1.8);
      melodyOsc = (bell1 + bell2) * 0.3 * bellEnv;
    } else if (track.wave === 'chandi_path_invocation') {
      // Deep sacred chant / vocal resonant tone
      const chant = Math.sin(2 * Math.PI * freq * t) +
                    Math.sin(2 * Math.PI * (freq * 2) * t) * 0.4 +
                    Math.sin(2 * Math.PI * (freq * 3) * t) * 0.2;
      melodyOsc = chant * 0.25 * env;
    } else { // Harmonium / Folk Ektara
      const tri = Math.abs(2 * ((freq * t) % 1) - 1) * 2 - 1;
      melodyOsc = tri * 0.3 * env;
    }

    val += melodyOsc;
  }

  // 3. Dhak Percussion Layer (if applicable)
  if (track.hasDhak) {
    const beatSec = 60 / (track.dhakBpm || 120);
    const timeInBeat = t % beatSec;
    const beatIndex = Math.floor(t / beatSec) % 4;

    // Dhum (Bass side) on beat 0 and 2
    if (beatIndex === 0 || beatIndex === 2) {
      if (timeInBeat < 0.2) {
        const bassFreq = 145 * Math.exp(-timeInBeat * 15);
        const bassGain = Math.exp(-timeInBeat * 10);
        val += Math.sin(2 * Math.PI * bassFreq * t) * 0.4 * bassGain;
      }
    }

    // Kiti / Kur (Slap) on beat 1 and 3
    if (beatIndex === 1 || beatIndex === 3) {
      if (timeInBeat < 0.1) {
        const slapFreq = 420 * Math.exp(-timeInBeat * 25);
        const slapGain = Math.exp(-timeInBeat * 20);
        val += (Math.abs(2 * ((slapFreq * t) % 1) - 1) * 2 - 1) * 0.3 * slapGain;
      }
    }

    // Kanshor gong chime on main beat
    if (beatIndex === 0 && timeInBeat < 0.3) {
      const gongGain = Math.exp(-timeInBeat * 6);
      const gong = Math.sin(2 * Math.PI * 1420 * t) + Math.sin(2 * Math.PI * 2850 * t) * 0.5;
      val += gong * 0.15 * gongGain;
    }
  }

  // 4. Sacred Shankho Conch Shell (for Mahalaya tracks)
  if (track.hasShankho) {
    const shankhoCycle = 4.0;
    const shankhoTime = t % shankhoCycle;
    if (shankhoTime < 2.2) {
      const sweepFreq = 290 + 55 * (shankhoTime / 2.2);
      const shankhoGain = Math.sin(Math.PI * (shankhoTime / 2.2)) * 0.25;
      const saw = (2 * ((sweepFreq * t) % 1) - 1);
      val += saw * shankhoGain;
    }
  }

  return val * 0.7; // Master normalization
}

console.log('Generating 21 realistic audio files in public/audio/...');

tracks.forEach((tr) => {
  const samples = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    samples[i] = getSample(t, tr);
  }

  const wavBuf = createWavBuffer(samples);
  const filePath = path.join(publicAudioDir, `${tr.id}.wav`);
  fs.writeFileSync(filePath, wavBuf);
  console.log(`Generated: ${tr.id}.wav (${(wavBuf.length / 1024).toFixed(1)} KB) -> ${tr.name}`);
});

console.log('ALL 21 AUDIO FILES GENERATED SUCCESSFULLY!');
