<template>
  <div class="intro-container">
    <LobbyBackground />

    <!-- CRT Central Flare & Rotating Cipher Ring Boot Overlay -->
    <div v-if="bootingActive" class="crt-boot-overlay">
      <div class="crt-iris-unfold"></div>
      
      <!-- Rotating Cipher Reticle Rings -->
      <div class="cipher-ring-container">
        <div class="cipher-ring ring-outer">
          <span>+ + + 0x8F01 + + + TAU CETI IV + + + SECURE_NODE + + +</span>
        </div>
        <div class="cipher-ring ring-inner">
          <span>/// INITIALIZING CYBERSPACE OS V2.5 /// CONNECTING... ///</span>
        </div>
        <div class="center-crosshair">
          <span class="ch-line h-line"></span>
          <span class="ch-line v-line"></span>
          <span class="ch-txt">SYSTEM_ONLINE</span>
        </div>
      </div>

      <div class="boot-text-log">
        <p>> MOUNTING LUDUS PROTOCOL... [OK]</p>
        <p>> DECRYPTING USER SESSION... [OK]</p>
        <p>> ESTABLISHING NET_LINK... ONLINE</p>
      </div>
    </div>

    <div class="logo-area" :class="{ 'jitter-active': jitterActive }">
      <h1 class="static-logo" data-text="GRINDERS 2057">GRINDERS 2057</h1>
    </div>
    <div class="menu-list">
      <button class="menu-btn glitch-hover" data-text="INITIALIZE_LINK" @click="handleStartLink('new')"
        v-if="!store.hasSave">
        INITIALIZE_LINK
      </button>
      <button class="menu-btn" v-else @click="handleStartLink('continue')">
        RESUME_LINK
      </button>
      <button class="menu-btn" @click="$emit('calibrate')">
        CALIBRATE_SYSTEM
      </button>
      <button class="menu-btn" @click="$emit('quit')">
        EXIT
      </button>
    </div>

    <div class="ambient-overlay"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { store } from '../logic/store';
import LobbyBackground from './LobbyBackground.vue';
import { audioManager } from '../logic/audioManager';

const emit = defineEmits(['start', 'calibrate', 'quit']);
const jitterActive = ref(false);
const bootingActive = ref(false);
let jitterInterval = null;

const handleStartLink = (mode) => {
  audioManager.playSFX('bootup');
  bootingActive.value = true;
  
  // 1.2s CRT Bootup & Rotating Ring Sequence
  setTimeout(() => {
    emit('start', mode);
  }, 1250);
};

onMounted(() => {
  audioManager.playTrackByZoneId('main');
  jitterInterval = setInterval(() => {
    if (Math.random() > 0.8) {
      jitterActive.value = true;
      setTimeout(() => jitterActive.value = false, 100 + Math.random() * 200);
    }
  }, 2000);
});
</script>

<style scoped>
@import '../assets/fonts/pretendard-std.css';

.intro-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #050a0e;
  overflow: hidden;
  position: relative;
  font-family: 'Pretendard Std', 'Share Tech Mono', monospace;
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
  background:
    linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%),
    linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
  z-index: 2;
  background-size: 100% 3px, 3px 100%;
  pointer-events: none;
}

.logo-area {
  font-family: 'Orbitron', 'Share Tech Mono', monospace;
  position: relative;
  margin-bottom: 4rem;
  z-index: 10;
  transition: transform 0.05s;
}

.static-logo {
  font-size: 4rem;
  font-weight: 900;
  color: #ccff00;
  letter-spacing: 0.1em;
  text-shadow: 0 0 20px rgba(204, 255, 0, 0.6);
  margin: 0;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 10;
}

.menu-btn {
  background: transparent;
  border: 1px solid rgba(0, 240, 255, 0.3);
  color: #00f0ff;
  padding: 0.8rem 2.5rem;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 250px;
}

.menu-btn:hover {
  background: #ccff00;
  border-color: #ccff00;
  color: #000000;
  box-shadow: 0 0 20px rgba(204, 255, 0, 0.5);
}

/* CRT Central Unfold & Rotating Cipher Ring Overlay */
.crt-boot-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000000;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.crt-iris-unfold {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(204, 255, 0, 0.15) 0%, #000000 80%);
  animation: crtIrisOpen 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
}

/* Rotating Cipher Rings */
.cipher-ring-container {
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.cipher-ring {
  position: absolute;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  white-space: nowrap;
}

.ring-outer {
  width: 360px;
  height: 360px;
  border: 2px dashed #ccff00;
  color: #ccff00;
  animation: rotateCW 3s linear infinite;
}

.ring-inner {
  width: 260px;
  height: 260px;
  border: 1px solid rgba(0, 240, 255, 0.6);
  color: #00f0ff;
  animation: rotateCCW 2.5s linear infinite;
}

.center-crosshair {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ch-line {
  position: absolute;
  background: #ccff00;
}
.h-line { width: 60px; height: 2px; }
.v-line { width: 2px; height: 60px; }

.ch-txt {
  margin-top: 45px;
  font-size: 0.85rem;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: 0.2em;
  background: #000;
  padding: 0.2rem 0.6rem;
  border: 1px solid #ccff00;
}

.boot-text-log {
  position: absolute;
  bottom: 3rem;
  left: 3rem;
  font-size: 0.8rem;
  color: #ccff00;
  letter-spacing: 0.1em;
  z-index: 10;
  line-height: 1.6;
}

@keyframes crtIrisOpen {
  0% {
    clip-path: inset(49.5% 0 49.5% 0);
    filter: brightness(3);
  }
  40% {
    clip-path: inset(49% 0 49% 0);
    filter: brightness(2);
  }
  100% {
    clip-path: inset(0 0 0 0);
    filter: brightness(1);
  }
}

@keyframes rotateCW {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes rotateCCW {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-360deg); }
}
</style>
