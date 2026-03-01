<template>
  <div class="intro-container">
    <LobbyBackground />
    <div class="logo-area" :class="{ 'jitter-active': jitterActive }">
      <!-- <div class="streak-container">
        <div v-for="n in 28" :key="n" class="glitch-streak" :style="getStreakStyle(n)"></div>
      </div> -->
      <h1 class="logo static-logo" data-text="GRINDERS 2057">GRINDERS 2057</h1>
    </div>
    <div class="menu-list">
      <button class="menu-btn glitch-hover" data-text="INITIALIZE_LINK" @click="$emit('start', 'new')">
        INITIALIZE_LINK
      </button>
      <button class="menu-btn" :disabled="!store.hasSave" @click="$emit('start', 'continue')">
        RESUME_LINK
      </button>
      <button class="menu-btn" @click="$emit('calibrate')">
        CALIBRATE_SYSTEM
      </button>
      <button class="menu-btn" @click="$emit('quit')">
        SHUT_DOWN
      </button>
    </div>

    <div class="ambient-overlay"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { store } from '../logic/store';
import LobbyBackground from './LobbyBackground.vue';
import { audioManager } from '../logic/audioManager';

defineEmits(['start', 'calibrate', 'quit']);

onMounted(() => {
  audioManager.playTrackByZoneId('main');
});
</script>

<style scoped>
.intro-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #050a0e;
  overflow: hidden;
  position: relative;
}

/* Global Scanline Overlay */
.intro-container::before {
  content: " ";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  /* Reduced opacity for better readability */
  background:
    linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%),
    linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
  z-index: 2;
  background-size: 100% 3px, 3px 100%;
  pointer-events: none;
}

.logo-area {
  font-family: 'Orbitron', 'Share Tech Mono', 'Orbit', monospace;
  position: relative;
  margin-bottom: 4rem;
  z-index: 10;
  transition: transform 0.05s;
}

.logo-area.jitter-active {
  animation: logo-jitter 0.1s infinite;
}

@keyframes logo-jitter {
  0% {
    transform: translate(0, 0);
    filter: brightness(1.1);
  }
  25% {
    transform: translate(-2px, 1px);
  }
  50% {
    transform: translate(2px, -1px) scale(1.01);
    filter: brightness(1.3);
  }
  75% {
    transform: translate(-1px, -1px);
  }
  100% {
    transform: translate(1px, 1px);
  }
}


.menu-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  z-index: 10;
}

.menu-btn {
  background: transparent;
  color: var(--neon-cyan);
  border: 1px solid var(--neon-cyan);
  padding: 1rem 3rem;
  font-size: 1.2rem;
  font-family: 'Outfit', sans-serif;
  letter-spacing: 4px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.menu-btn:hover:not(:disabled) {
  background: var(--neon-cyan);
  color: #000;
  box-shadow: 0 0 20px var(--neon-cyan);
}

.menu-btn:disabled {
  opacity: 0.3;
  border-color: #333;
  color: #333;
  cursor: not-allowed;
}

.ambient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, transparent 20%, #050a0e 100%);
  pointer-events: none;
}
</style>
