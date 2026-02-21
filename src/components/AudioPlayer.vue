<template>
  <div class="audio-player" :class="{ 'compact': compact }">
    <div class="player-main">
      <div class="track-info">
        <div class="status-indicator" :class="{ 'active': audioManager.isPlaying.value }">
          {{ audioManager.isPlaying.value ? 'SYSTEM_PLAYING' : 'IDLE' }}
        </div>
        <div class="track-title marquee">
          <span :class="{ 'scrolling': audioManager.isPlaying.value }">
            {{ audioManager.currentTrackInfo.value.title }} // {{ audioManager.currentTrackInfo.value.artist }} // {{
              audioManager.currentTrackInfo.value.license }}
          </span>
        </div>
      </div>

      <div class="controls">
        <button class="ctrl-btn" @click="audioManager.prev()">
          <span class="icon">⏮</span>
        </button>
        <button class="ctrl-btn main" @click="togglePlay">
          <span class="icon">{{ audioManager.isPlaying.value ? '⏸' : '▶' }}</span>
        </button>
        <button class="ctrl-btn" @click="audioManager.next()">
          <span class="icon">⏭</span>
        </button>
      </div>
    </div>

    <div class="player-footer">
      <div class="volume-container">
        <span class="vol-label">VOL:</span>
        <input type="range" min="0" max="1" step="0.05" v-model="volume" @input="updateVolume" class="volume-slider" />
        <span class="vol-value">{{ Math.round(volume * 100) }}%</span>
      </div>
    </div>

    <div class="glitch-line"></div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { audioManager, } from '../logic/audioManager';

const props = defineProps({
  compact: Boolean
});

// const currentTrack = computed(() => playlist[audioManager.currentTrackIndex.value]);
const volume = ref(audioManager.volume.value);

const togglePlay = () => {
  if (audioManager.isPlaying.value) audioManager.pause();
  else audioManager.play();
};

const updateVolume = () => {
  audioManager.setVolume(volume.value / 1); // Ensure it's treated as a number
};

watch(() => audioManager.volume.value, (newVal) => {
  volume.value = newVal;
});
</script>

<style scoped>
.audio-player {
  background: rgba(5, 10, 14, 0.9);
  border: 1px solid var(--neon-cyan);
  padding: 15px;
  width: 100%;
  max-width: 320px;
  position: relative;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.1);
  overflow: hidden;

}

.player-main {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.track-info {
  border-left: 2px solid var(--neon-magenta);
  padding-left: 10px;
}

.status-indicator {
  font-size: 0.6rem;
  color: var(--neon-magenta);
  margin-bottom: 5px;
  opacity: 0.7;
}

.status-indicator.active {
  color: var(--neon-cyan);
  opacity: 1;
  text-shadow: 0 0 5px var(--neon-cyan);
}

.track-title {
  font-size: 0.9rem;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
}

.marquee span {
  display: inline-block;
  padding-left: 100%;
  animation: marquee 15s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-100%, 0);
  }
}

.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.ctrl-btn {
  background: transparent;
  border: 1px solid var(--neon-cyan);
  color: var(--neon-cyan);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  clip-path: polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%);
}

.ctrl-btn:hover {
  background: rgba(0, 240, 255, 0.2);
  transform: scale(1.1);
}

.ctrl-btn.main {
  width: 50px;
  height: 50px;
  background: var(--neon-cyan);
  color: #000;
}

.player-footer {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid rgba(0, 240, 255, 0.1);
}

.volume-container {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.7rem;
  color: var(--neon-cyan);
}

.volume-slider {
  flex-grow: 1;
  background: rgba(0, 240, 255, 0.1);
  height: 4px;
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: var(--neon-cyan);
  cursor: pointer;
  border-radius: 0;
}

.vol-value {
  width: 35px;
  text-align: right;
}

.glitch-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--neon-magenta);
  animation: flicker 4s infinite;
}

@keyframes flicker {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  52% {
    opacity: 0.8;
  }
  54% {
    opacity: 0.2;
  }
}

/* Compact mode */
.audio-player.compact {
  padding: 5px 10px;
  max-width: none;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 20px;
}

.audio-player.compact .player-main {
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.audio-player.compact .player-footer,
.audio-player.compact .status-indicator {
  display: none;
}
</style>
