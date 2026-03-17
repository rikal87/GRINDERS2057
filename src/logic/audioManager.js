import { ref } from 'vue';
import { zones } from './zone.js';
import { TRACK_ENUM, TRACK_INFO } from './audioTracks.js';

// Track the track list dynamically
// const trackModules = import.meta.glob('../assets/music/*.mp3', { eager: true, import: 'default' });
const sfxModules = import.meta.glob('../assets/sfx/*.{mp3,wav}', { eager: true, import: 'default' });

const DEFAULT_PLAYLIST = [TRACK_ENUM.Lucid];
export let playlist = DEFAULT_PLAYLIST;
// export const playlist = Object.entries(trackModules).map(([path, url]) => {
//   const fileName = path.split('/').pop().replace('.mp3', '');

//   // Try to parse "Artist - Title" format
//   if (fileName.includes(' - ')) {
//     const [artist, title] = fileName.split(' - ');
//     return { title: title.trim(), artist: artist.trim(), url };
//   }

//   // Fallback for names without dash
//   return { title: fileName, artist: 'SYSTEM_TRACK', url };
// });

const sfxMap = Object.entries(sfxModules).reduce((acc, [path, url]) => {
  const name = path.split('/').pop().replace(/\.(mp3|wav)$/, '');
  acc[name] = url;
  return acc;
}, {});

class AudioManager {
  constructor() {
    this.ctx = null;
    this.source = null;
    this.filter = null;
    this.gainNode = null;
    this.tensionGainNode = null; // New gain node for tension mode
    this.currentTrackIndex = ref(0);
    this.currentZoneId = ref(null);
    this.isPlaying = ref(false);
    this.volume = ref(0.5);
    this.sfxVolume = ref(0.7);
    this.playbackRate = ref(1.0);
    this.isTensionMode = ref(false);
    this.initialized = false;
    this.sfxBuffers = {};
    this.currentTrackInfo = ref({ title: 'SYSTEM_TRACK', artist: 'SYSTEM_TRACK', license: null });
    this.loadLock = false; // Prevent concurrent track loading
  }

  async init() {
    if (this.initialized) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 20000;

    this.tensionGainNode = this.ctx.createGain();
    this.tensionGainNode.gain.value = 1.0;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = this.volume.value;

    // Chain: Source -> Filter -> TensionGain -> MasterGain -> Destination
    this.filter.connect(this.tensionGainNode);
    this.tensionGainNode.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);
    this.initialized = true;
  }

  async loadTrack(index = 0, trackInfo = null) {
    if (this.loadLock) return;
    this.loadLock = true;
    try {
      await this.init();

      let track = null;
      let trackIndex = index;

      // Handle different call signatures
      if (typeof index === 'number') {
        // Only index passed (likely for DEFAULT_PLAYLIST)
        if (trackInfo) {
          playlist = trackInfo;
        }
        track = playlist[index];
        trackIndex = index;
      } else if (typeof index === 'string' && TRACK_INFO[index]) {
        // Enum key passed
        track = TRACK_INFO[index];
      }

      if (!track) {
        console.warn('AudioManager: Could not resolve track', trackInfo, index);
        return;
      }

      console.log('Loading track:', track.title, 'at index:', trackIndex);

      // Stop previous source if exists
      if (this.source) {
        this.source.onended = null; // Prevent trigger when manually changing tracks
        try { this.source.stop(); } catch (e) { }
        this.source.disconnect();
      }

      const response = await fetch(track.file);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);

      this.currentTrackInfo.value = track;
      this.source = this.ctx.createBufferSource();
      this.source.buffer = audioBuffer;
      this.source.playbackRate.value = this.playbackRate.value;
      this.source.loop = false;
      this.source.onended = () => {
        if (this.isPlaying.value) {
          this.next();
        }
      };
      this.source.connect(this.filter);

      // Update currentTrackIndex only if it's a valid number
      if (typeof trackIndex === 'number') {
        this.currentTrackIndex.value = trackIndex;
      } else {
        // Try to find index in current playlist to keep navigation working
        const foundIdx = playlist.findIndex(t => t.file === track.file);
        if (foundIdx !== -1) {
          this.currentTrackIndex.value = foundIdx;
        }
      }

      if (this.isPlaying.value) {
        this.source.start(0);
      }
    } finally {
      this.loadLock = false;
    }
  }

  async play() {
    await this.init();
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (!this.source) {
      await this.loadTrack(this.currentTrackIndex.value);
      if (this.source) this.source.start(0);
    } else if (!this.isPlaying.value) {
      // If source was stopped, we need to recreate it because BufferSource is one-time use
      await this.loadTrack(this.currentTrackIndex.value);
      if (this.source) this.source.start(0);
    }

    this.isPlaying.value = true;
  }

  pause() {
    if (this.source && this.isPlaying.value) {
      this.source.onended = null; // Prevent trigger when pausing
      try { this.source.stop(); } catch (e) { }
      this.isPlaying.value = false;
    }
  }

  async next() {
    const nextIdx = (this.currentTrackIndex.value + 1) % playlist.length;
    await this.loadTrack(nextIdx);
  }

  async prev() {
    const prevIdx = (this.currentTrackIndex.value - 1 + playlist.length) % playlist.length;
    await this.loadTrack(prevIdx);
  }

  async playSFX(name) {
    if (!sfxMap[name]) {
      console.warn(`SFX not found: ${name}`);
      return;
    }

    await this.init();

    let buffer = this.sfxBuffers[name];
    if (!buffer) {
      const response = await fetch(sfxMap[name]);
      const arrayBuffer = await response.arrayBuffer();
      buffer = await this.ctx.decodeAudioData(arrayBuffer);
      this.sfxBuffers[name] = buffer;
    }

    const sfxSource = this.ctx.createBufferSource();
    sfxSource.buffer = buffer;

    const sfxGain = this.ctx.createGain();
    sfxGain.gain.value = this.sfxVolume.value;

    sfxSource.connect(sfxGain);
    sfxGain.connect(this.ctx.destination);

    sfxSource.start(0);
  }

  setVolume(value) {
    this.volume.value = value;
    if (this.gainNode) {
      this.gainNode.gain.setTargetAtTime(value, this.ctx.currentTime, 0.1);
    }
  }

  setFilter(freq) {
    if (this.filter && this.ctx) {
      this.filter.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.1);
    }
  }

  setPlaybackRate(value) {
    this.playbackRate.value = value;
    if (this.source && this.ctx) {
      this.source.playbackRate.setTargetAtTime(value, this.ctx.currentTime, 0.2);
    }
  }

  // --- FX Generators ---

  createImpulseResponse(duration = 2.0, decay = 2.0, reverse = false) {
    if (!this.ctx) return null;
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * duration;
    const impulse = this.ctx.createBuffer(2, length, sampleRate);
    const impulseL = impulse.getChannelData(0);
    const impulseR = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = reverse ? length - i : i;
      let decayFactor = Math.pow(1 - n / length, decay);
      impulseL[i] = (Math.random() * 2 - 1) * decayFactor;
      impulseR[i] = (Math.random() * 2 - 1) * decayFactor;
    }
    return impulse;
  }

  createBitCrusherCurve(amount = 0.5) {
    if (!this.ctx) return null;
    const samples = 44100;
    const curve = new Float32Array(samples);
    const k = amount; // Distortion amount
    for (let i = 0; i < samples; ++i) {
      const x = (i * 2) / samples - 1;
      // Simple quantization simulation (stepped curve)
      const steps = 4 + (1 - k) * 60; // Few steps = crushing
      curve[i] = Math.round(x * steps) / steps;
    }
    return curve;
  }

  // ---------------------

  enableTensionMode() {
    if (this.isTensionMode.value) return;
    this.isTensionMode.value = true;

    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const timeConstant = 2.25;

    // 1. Lowpass Filter: 1000Hz (Smooth transition)
    if (this.filter) {
      this.filter.frequency.setTargetAtTime(1000, now, timeConstant);
    }

    // 2. Setup Parallel Dry/Wet Path for smooth crossfade
    // Create gain nodes if missing
    if (!this.dryGainNode) {
      this.dryGainNode = this.ctx.createGain();
      this.dryGainNode.gain.value = 1.0;
    }
    if (!this.wetGainNode) {
      this.wetGainNode = this.ctx.createGain();
      this.wetGainNode.gain.value = 0.0;
    }

    // Create Reverb if missing
    if (!this.reverbNode) {
      this.reverbNode = this.ctx.createConvolver();
      this.reverbNode.buffer = this.createImpulseResponse(3.0, 2.0); // Large hall
    }

    // Re-wire Graph:
    // Disconnect Direct Path (Filter -> TensionGain)
    try {
      this.filter.disconnect(this.tensionGainNode);
    } catch (e) { }

    // Connect New Graph:
    // Filter -> DryGain -> TensionGain
    this.filter.connect(this.dryGainNode);
    this.dryGainNode.connect(this.tensionGainNode);

    // Filter -> WetGain -> Reverb -> TensionGain
    this.filter.connect(this.wetGainNode);
    this.wetGainNode.connect(this.reverbNode);
    this.reverbNode.connect(this.tensionGainNode);

    // cancel strict scheduled values to ensure smooth ramp from current
    this.dryGainNode.gain.cancelScheduledValues(now);
    this.wetGainNode.gain.cancelScheduledValues(now);

    // 3. Crossfade to Wet
    // Target: Dry = 0.0, Wet = 1.0 (or 0.8 for mix)
    // Using setTargetAtTime for "organic" curve
    this.dryGainNode.gain.setTargetAtTime(0.0, now, timeConstant);
    this.wetGainNode.gain.setTargetAtTime(1.0, now, timeConstant);

    // 4. Volume Boost (Compensate for filter)
    if (this.tensionGainNode) {
      this.tensionGainNode.gain.setTargetAtTime(1.25, now, timeConstant);
    }
  }

  disableTensionMode() {
    if (!this.isTensionMode.value) return;
    this.isTensionMode.value = false;

    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const timeConstant = 2.25;

    // 1. Reset Filter
    if (this.filter) {
      this.filter.frequency.setTargetAtTime(20000, now, timeConstant);
    }

    // 2. Crossfade back to Dry
    if (this.dryGainNode && this.wetGainNode) {
      this.dryGainNode.gain.setTargetAtTime(1.0, now, timeConstant);
      this.wetGainNode.gain.setTargetAtTime(0.0, now, timeConstant);
    }

    // 3. Reset Volume
    if (this.tensionGainNode) {
      this.tensionGainNode.gain.setTargetAtTime(1.0, now, timeConstant);
    }

    // 4. Cleanup Graph after fade (approx 3 * timeConstant = ~7s)
    setTimeout(() => {
      if (this.isTensionMode.value) return; // Abort if re-enabled

      // Restore Direct Path: Filter -> TensionGain
      // Disconnect Intermediate Nodes
      try {
        if (this.dryGainNode) {
          this.filter.disconnect(this.dryGainNode);
          this.dryGainNode.disconnect();
        }
        if (this.wetGainNode) {
          this.filter.disconnect(this.wetGainNode);
          this.wetGainNode.disconnect();
        }
        if (this.reverbNode) {
          this.reverbNode.disconnect();
        }
        this.filter.connect(this.tensionGainNode);
      } catch (e) { console.warn('Audio cleanup error', e); }
    }, 7000);
  }

  async playTrackByZoneId(zoneId) {
    if (this.currentZoneId.value === zoneId && this.isPlaying.value) {
      // Already playing this zone, just ensure context is resumed
      if (this.ctx && this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return;
    }

    this.currentZoneId.value = zoneId;
    console.log('Switching to zone:', zoneId);

    // Find location config from zones
    let locationConfig = null;
    for (const zone of zones) {
      const loc = zone.locations.find(l => l.id === zoneId);
      if (loc) {
        locationConfig = loc;
        break;
      }
    }

    let tracks = [];
    if (zoneId === 'main') tracks = [TRACK_ENUM.Grainders2057];
    else if (zoneId === 'lobby') tracks = DEFAULT_PLAYLIST;
    else if (locationConfig && locationConfig.bgMusic) {
      tracks = locationConfig.bgMusic;
    }

    if (!tracks || tracks.length === 0) {
      console.warn(`No tracks found for zone: ${zoneId}`);
      tracks = [TRACK_ENUM.Grainders2057];
    }

    const newPlaylist = tracks.map(t => TRACK_INFO[t]).filter(t => t);
    if (newPlaylist.length === 0) return;

    const randomIdx = Math.floor(Math.random() * newPlaylist.length);
    this.isPlaying.value = true;

    await this.loadTrack(randomIdx, newPlaylist);

    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }
}

export const audioManager = new AudioManager();
