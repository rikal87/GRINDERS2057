<template>
  <div class="lobby-container">
    <div class="city-skyline">
      <!-- Interactive Minimap Viewport -->
      <div class="minimap-viewport">
        <div class="minimap-scanner"></div>
        <div class="minimap-image" :style="{ backgroundPosition: mapPosition }"></div>
        <div class="minimap-overlay">
          <div :class="['location-tag', { 'typing': isAnimating }]">{{ currentMapLocationName }}</div>
          <div :class="['crosshair', { 'targeting': isAnimating }]"></div>
        </div>
      </div>

      <!-- Vector city silhouettes (now background behind map) -->
      <div class="building-silhouette">
      </div>
    </div>
    <div class="lobby-content">
      <div class="user-header">
        <div class="chip-balance">
          <span class="label">CREDITS_AVAILABLE</span>
          <span class="value">{{ getCurrentBankroll().toLocaleString() }} CR</span>
        </div>
      </div>
      <div class="menu-grid">
        <div class="grid-item" @click="$emit('openSearch')" @mouseenter="setMapLocation('CASINO')">
          <div class="icon">F</div>
          <div class="label">TABLE_SEARCH</div>
          <div class="desc">CASINO_DISTRICT</div>
        </div>
        <div class="grid-item" @click="$emit('view', 'home')" @mouseenter="setMapLocation('HABITAT')">
          <div class="icon">H</div>
          <div class="label">HABITAT</div>
          <div class="desc">RESIDENTIAL_ZONE</div>
        </div>
        <div class="grid-item" @click="$emit('view', 'shop')" @mouseenter="setMapLocation('BLACK_MARKET')">
          <div class="icon">S</div>
          <div class="label">BLACK_MARKET</div>
          <div class="desc">UNRESTRICTED_ZONE</div>
        </div>
        <!-- TODO: Need a Crypto Trade rebuild -->
        <!-- @click="$emit('view', 'crypto')" -->
        <div class="grid-item disabled" disabled="disabled" @mouseenter="setMapLocation('EXCHANGE')">
          <div class="icon">C</div>
          <div class="label">CRYPTO_NEXUS</div>
          <div class="desc">FINANCIAL_DISTRICT</div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getCurrentBankroll, store } from '../logic/store.js';
import { audioManager } from '../logic/audioManager.js';

const emit = defineEmits(['view', 'openSearch']);

const currentMapKey = ref('DEFAULT');
const mapPositions = {
  DEFAULT: { pos: '50% 50%', name: 'FINDING_LOCATION...' },
  CASINO: { pos: '1% 90%', name: 'CASINO_STRIP' },
  HABITAT: { pos: '53% 54%', name: 'HABITAT' },
  BLACK_MARKET: { pos: '100% 0%', name: 'KBT_UNDERGROUND' },
  EXCHANGE: { pos: '17% 10%', name: 'FINANCIAL_SECTOR' }
};

const mapPosition = computed(() => mapPositions[currentMapKey.value].pos);
const currentMapLocationName = computed(() => mapPositions[currentMapKey.value].name);

const setMapLocation = (key) => {
  if (currentMapKey.value !== key) {
    currentMapKey.value = key;
    triggerAnimation();
  }
};

// Animation Trigger Logic
const isAnimating = ref(false);
const triggerAnimation = () => {
  if (isAnimating.value) return;
  audioManager.playSFX('keyboard-type')
  isAnimating.value = true;
  setTimeout(() => {
    isAnimating.value = false;
  }, 1500);
};

// Initial trigger
onMounted(() => {
  triggerAnimation();
  audioManager.playTrackByZoneId('lobby');
});
</script>

<style scoped>
.lobby-container {
  /* height: 100vh; */
  margin: auto;
  flex-grow: 1;
  /* background: linear-gradient(to bottom, #0d1218 0%, #050a0e 100%); */
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.city-skyline {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}


.minimap-viewport {
  display: flex;
  flex: 1;
  width: 90%;
  height: 80%;
  max-width: 800px;
  background: #000;
  border: 1px solid var(--neon-cyan);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.2);
  position: relative;
  overflow: hidden;
  z-index: 2;
  /* clip-path: polygon(0 0, 95% 0, 100% 15%, 100% 100%, 5% 100%, 0 85%); */
}

.minimap-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../assets/image/minimap.v4.png');
  /* background-size: 200% 200%; */
  transition: background-position 1.2s cubic-bezier(0.23, 1, 0.32, 1);
  opacity: 0.75;
}

.minimap-scanner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom,
      transparent 50%,
      rgba(207, 255, 35, 0.05) 50%,
      rgba(251, 255, 5, 0.05) 51%,
      transparent 51%);
  background-size: 100% 4px;
  z-index: 3;
  pointer-events: none;
}

.minimap-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
  pointer-events: none;
}

.location-tag {
  position: absolute;
  bottom: 10px;
  right: 15px;

  font-size: 0.9rem;
  color: var(--neon-cyan);
  background: rgba(0, 0, 0, 0.85);
  padding: 4px 12px;
  border-left: 3px solid var(--neon-cyan);
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 5px var(--neon-cyan);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  color: #f8ef00;
  border: 4px solid rgba(248, 239, 0, 0.5);
  transform: translate(-50%, -50%);
}


.b1 {
  height: 150px;
  width: 40px;
}

.b2 {
  height: 250px;
  width: 80px;
}

.b3 {
  height: 180px;
  width: 50px;
}

.lobby-content {
  padding: 2rem;
  z-index: 10;
}

.user-header {
  margin-bottom: 3rem;
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: 1rem;
}

.chip-balance .label {
  display: block;
  font-size: 0.7rem;
  color: var(--neon-cyan);
  margin-bottom: 5px;
}

.chip-balance .value {
  font-size: 2rem;

  color: var(--neon-yellow);
  font-weight: 900;
}

.menu-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (min-width: 1000px) {
  .menu-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.grid-item.disabled {
  opacity: 0.5;
  filter: grayscale(0.5);
  cursor: not-allowed;
}

.grid-item {
  background: rgba(0, 240, 255, 0.05);
  border: 1px solid var(--glass-border);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.grid-item:hover {
  background: rgba(0, 240, 255, 0.1);
  border-color: var(--neon-cyan);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.1);
}

.grid-item .icon {
  font-size: 2rem;
  font-weight: 900;
  color: var(--neon-magenta);
  margin-bottom: 1rem;
}

.grid-item .label {
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
}

.grid-item .desc {
  font-size: 0.6rem;
  opacity: 0.5;
  margin-top: 4px;
}

.grid-item.highlight {
  border-color: var(--neon-yellow);
  background: rgba(248, 239, 0, 0.05);
}

.grid-item.highlight:hover {
  background: rgba(248, 239, 0, 0.1);
  box-shadow: 0 0 20px rgba(248, 239, 0, 0.1);
}

.grid-item.highlight .icon {
  color: var(--neon-yellow);
}



.stat-label {
  color: #888;
}

.stat-value {
  color: var(--neon-yellow);
}

.stat-warning {
  color: var(--neon-magenta);
  font-size: 0.7rem;
  animation: blink 2s infinite;
}

.popup-actions {
  display: flex;
  gap: 15px;
  margin-top: 1rem;
}

.btn-confirm {
  flex: 1;
  background: var(--neon-cyan);
  color: #000;
  border: none;
  padding: 15px;
  font-weight: 900;
  cursor: pointer;
}

.btn-confirm:disabled {
  background: #333;
  cursor: not-allowed;
}



.city-ground::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--neon-cyan);
  box-shadow: 0 0 10px var(--neon-cyan);
}

/* --- Minimap Animations --- */
.crosshair.targeting {
  animation: target-lock 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes target-lock {
  0% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
    border-color: #fff;
  }
  50% {
    opacity: 1;
    border-color: var(--neon-magenta);
  }
  70% {
    transform: translate(-50%, -50%) scale(0.8);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    border-color: rgba(248, 239, 0, 0.8);
  }
}

.location-tag.typing {
  overflow: hidden;
  /* Ensures the content is not revealed until the animation */
  white-space: nowrap;
  /* Keeps the content on a single line */
  border-right: 2px solid var(--neon-cyan);
  /* The typwriter cursor */
  animation:
    typing 2s steps(30, end),
    blink-caret 1.1s step-end infinite;
  max-width: 0;
  animation-fill-mode: forwards;
}

@keyframes typing {
  from {
    max-width: 0
  }
  to {
    max-width: 100%
  }
}

@keyframes blink-caret {
  from,
  to {
    border-color: transparent
  }
  50% {
    border-color: var(--neon-cyan);
  }
}
</style>
