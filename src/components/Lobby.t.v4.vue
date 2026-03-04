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
          <span class="value">{{ store.bankroll }} CR</span>
        </div>
      </div>

      <div class="menu-grid">
        <div class="grid-item" @click="showSearchPopup = true" @mouseenter="setMapLocation('CASINO')">
          <div class="icon">F</div>
          <div class="label">TABLE_SEARCH</div>
          <div class="desc">CASINO_DISTRICT</div>
        </div>
        <div class="grid-item" @click="$emit('view', 'home')" @mouseenter="setMapLocation('SAFE_HOUSE')">
          <div class="icon">H</div>
          <div class="label">SAFE_HOUSE</div>
          <div class="desc">RESIDENTIAL_ZONE</div>
        </div>
        <div class="grid-item" @click="$emit('view', 'shop')" @mouseenter="setMapLocation('BLACK_MARKET')">
          <div class="icon">S</div>
          <div class="label">BLACK_MARKET</div>
          <div class="desc">UNRESTRICTED_ZONE</div>
        </div>
        <div class="grid-item" @click="$emit('view', 'crypto')" @mouseenter="setMapLocation('EXCHANGE')">
          <div class="icon">C</div>
          <div class="label">CRYPTO_NEXUS</div>
          <div class="desc">FINANCIAL_DISTRICT</div>
        </div>
      </div>
    </div>

    <!-- Table Search Popup -->
    <Transition name="fade">
      <div v-if="showSearchPopup" class="overlay table-search-overlay" @click.self="showSearchPopup = false">
        <div class="terminal-msg search-popup">
          <h2 class="glitch-text" data-text="NET_TABLE_FINDER">NET_TABLE_FINDER</h2>

          <div class="location-browser">
            <button class="nav-btn prev" @click="prevLocation" :disabled="currentLocationIndex === 0">&lt;</button>

            <div class="location-display" :style="{ backgroundImage: `url(${currentLocation.imgSrc})` }">
              <div class="location-header">
                <b class="zone-label">{{ currentLocation.zoneName }}</b>
                <h3 class="location-name">{{ currentLocation.englishName }}</h3>
              </div>

              <div class="location-info">
                <p class="desc">{{ currentLocation.description }}</p>

                <div class="npc-list">
                  <span class="label">DETECTED_PERSONAS</span>
                  <div class="tags">
                    <span v-for="npc in currentLocation.npcs" :key="npc" class="npc-tag" :title="getNote(npc)">{{
                      npc
                    }}</span>
                  </div>
                </div>

                <div class="table-stats">
                  <div class="stat-row">
                    <span class="stat-label">BUY_IN:</span>
                    <span class="stat-value">{{ currentTableConfig.amount_fmt }} CR</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">BLINDS:</span>
                    <span class="stat-value">{{ currentTableConfig.sb }}/{{ currentTableConfig.bb }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">RAKE:</span>
                    <span class="stat-value">{{ (currentRake * 100).toFixed(1) }}% (Max {{ currentTableConfig.rakeCap
                    }})</span>
                  </div>
                  <div class="stat-row" v-if="currentTableConfig.isAdvanced">
                    <span class="stat-warning">HIGH_STAKES_PROTOCOL_ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>

            <button class="nav-btn next" @click="nextLocation"
              :disabled="currentLocationIndex === flatLocations.length - 1">&gt;</button>
          </div>

          <div class="search-options">
            <div class="option-group">
              <span class="label">TABLE_SIZE:</span>
              <div class="btn-group">
                <button :class="{ active: selectedSize === 6 }" @click="selectedSize = 6">6-MAX</button>
                <button :class="{ active: selectedSize === 9 }" @click="selectedSize = 9">9-MAX</button>
              </div>
            </div>
          </div>

          <div class="popup-actions">
            <button class="btn-confirm" :disabled="!canAfford || isLocked" @click="confirmJoin">
              <span v-if="isLocked">ACCESS_DENIED</span>
              <span v-else-if="canAfford">INITIATE_LINK</span>
              <span v-else>INSUFFICIENT_FUNDS</span>
            </button>
            <button class="btn-cancel" @click="showSearchPopup = false">ABORT</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { store } from '../logic/store.js';
import { audioManager } from '../logic/audioManager.js';
import { zones } from '../logic/zone.js';
import { CLASSES_ENEMY } from '../logic/persona.js';
const emit = defineEmits(['join', 'view']);

const showSearchPopup = ref(false);
const selectedSize = ref(6);
const getNote = (npc) => {
  const enemy = CLASSES_ENEMY.find(e => e.name === npc);
  return enemy ? enemy.note : ''
}
// Flatten locations efficiently
const flatLocations = computed(() => {
  const locs = [];
  zones.forEach(zone => {
    zone.locations.forEach(loc => {
      locs.push({
        ...loc,
        zoneName: zone.name,
        zoneId: zone.id,
        locationLV: zone.level
      });
    });
  });
  return locs;
});

const currentLocationIndex = ref(0);
const currentLocation = computed(() => flatLocations.value[currentLocationIndex.value]);

const nextLocation = () => {
  if (currentLocationIndex.value < flatLocations.value.length - 1) {
    currentLocationIndex.value++;
    audioManager.playSFX('ui-click');
  }
};

const prevLocation = () => {
  if (currentLocationIndex.value > 0) {
    currentLocationIndex.value--;
    audioManager.playSFX('ui-click');
  }
};

const currentTableConfig = computed(() => currentLocation.value.tables);

// Dynamic Rake Calculation
const currentRake = computed(() => {
  if (!currentTableConfig.value) return 0;
  const base = currentTableConfig.value.baseRake;
  return Math.max(0.01, base - (store.level * 0.001));
});

const canAfford = computed(() => {
  if (!currentTableConfig.value) return false;
  return store.bankroll >= (currentTableConfig.value.amount * 0.5);
});


const currentMapKey = ref('DEFAULT');
const mapPositions = {
  // DEFAULT: { pos: '50% 50%', name: 'NIGHT_CITY_HUB' },
  CASINO: { pos: '-12% 100%', name: 'CASINO_STRIP' },
  SAFE_HOUSE: { pos: '53% 54%', name: 'SAFE_HOUSE' },
  BLACK_MARKET: { pos: '115% -20%', name: 'KBT_UNDERGROUND' },
  EXCHANGE: { pos: '10% 20%', name: 'FINANCIAL_SECTOR' }
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

function testAddLevel() {
  store.level++;
}

const isLocked = computed(() => {
  if (!currentLocation.value) return false;
  const req = currentLocation.value.requirements;
  if (!req) return false;
  return !(store.unlockedLocations && store.unlockedLocations.includes(req));
});

const confirmJoin = () => {
  if (currentLocation.value && canAfford.value && !isLocked.value) {
    const table = currentTableConfig.value;

    if (!table.available.includes(selectedSize.value)) {
      return;
    }
    emit('join', {
      size: selectedSize.value,
      buyIn: table.amount,
      rake: currentRake.value,
      rakeCap: table.rakeCap,
      isAdvanced: table.isAdvanced || false,
      locationLV: currentLocation.value.locationLV,
      sb: table.sb,
      bb: table.bb,
      locationId: currentLocation.value.id,
      locationName: currentLocation.value.name,
      backgroundDescription: currentLocation.value.backgroundDescription
    });
    showSearchPopup.value = false;
  } else {
    audioManager.playSFX('ui-error');
  }
};
</script>

<style scoped>
/* =============================================
   LOBBY V4 — NET_TABLE_FINDER AESTHETIC
   ============================================= */

.lobby-container {
  height: 100vh;
  background: #141422;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  font-family: 'Share Tech Mono', 'Orbit', 'Courier New', monospace;
  color: #b0b8cc;
  --accent-red: #ff0055;
  --accent-cyan: #00f0ff;
  --accent-yellow: #ccff00;
  --accent-green: #39ff14;
  --accent-magenta: #ff00aa;
  --border-subtle: rgba(255, 255, 255, 0.06);
}

/* Outer red glow frame */
.lobby-container::before {
  content: '';
  position: absolute;
  inset: 0;
  border: 2px solid var(--accent-red);
  box-shadow:
    inset 0 0 40px rgba(255, 0, 85, 0.07),
    0 0 25px rgba(255, 0, 85, 0.3);
  pointer-events: none;
  z-index: 200;
}

/* --- MINIMAP SECTION --- */
.city-skyline {
  height: 42%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 0, 85, 0.2);
}

@media (min-width: 1200px) {
  .city-skyline {
    height: 50%;
  }
}

.minimap-viewport {
  width: 100%;
  height: 100%;
  max-width: 900px;
  background: #000;
  border: 1px solid var(--accent-red);
  box-shadow: 0 0 20px rgba(255, 0, 85, 0.2), inset 0 0 40px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
  z-index: 2;
}

.minimap-image {
  position: absolute;
  inset: 0;
  background-image: url('../assets/image/minimap.v3.png');
  background-size: 200% 200%;
  transition: background-position 1.2s cubic-bezier(0.23, 1, 0.32, 1);
  opacity: 0.65;
}

.minimap-scanner {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom,
      transparent 50%,
      rgba(204, 255, 0, 0.04) 50%,
      rgba(204, 255, 0, 0.04) 51%,
      transparent 51%);
  background-size: 100% 4px;
  z-index: 3;
  pointer-events: none;
}

.minimap-overlay {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
}

.location-tag {
  position: absolute;
  bottom: 10px;
  right: 14px;
  font-size: 0.8rem;
  color: var(--accent-cyan);
  background: rgba(0, 0, 0, 0.88);
  padding: 3px 12px;
  border-left: 3px solid var(--accent-cyan);
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 6px var(--accent-cyan);
}

.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  border: 3px solid rgba(204, 255, 0, 0.5);
  transform: translate(-50%, -50%);
}

.building-silhouette {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
  opacity: 0.12;
  z-index: 1;
}

.building {
  background: var(--accent-cyan);
  width: 60px;
  clip-path: polygon(0 20%, 50% 0, 100% 20%, 100% 100%, 0 100%);
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

/* --- LOBBY CONTENT (MENU) --- */
.lobby-content {
  flex: 1;
  padding: 1.5rem 2rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.user-header {
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 1rem;
}

.chip-balance .label {
  display: block;
  font-size: 0.6rem;
  color: var(--accent-red);
  letter-spacing: 3px;
  margin-bottom: 4px;
}

.chip-balance .value {
  font-size: 1.8rem;
  color: var(--accent-yellow);
  font-weight: 900;
}

/* --- NAV GRID (4 CARDS) --- */
.menu-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (min-width: 1000px) {
  .menu-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.grid-item {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid var(--border-subtle);
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.grid-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: var(--accent-red);
  opacity: 0;
  transition: opacity 0.2s;
}

.grid-item:hover {
  background: rgba(255, 0, 85, 0.07);
  border-color: var(--accent-red);
  box-shadow: 0 0 18px rgba(255, 0, 85, 0.15);
}

.grid-item:hover::before {
  opacity: 1;
}

.grid-item .icon {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--accent-red);
  margin-bottom: 0.8rem;
  text-shadow: 0 0 10px var(--accent-red);
}

.grid-item .label {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #d0dde8;
}

.grid-item .desc {
  font-size: 0.55rem;
  opacity: 0.35;
  margin-top: 4px;
  letter-spacing: 1px;
}

/* --- POPUP OVERLAY --- */
.overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-search-overlay {
  background: rgba(0, 0, 0, 0.87);
  backdrop-filter: blur(8px);
  z-index: 100;
}

.search-popup {
  width: 95%;
  max-width: 860px;
  background: #141422;
  border: 2px solid var(--accent-red);
  box-shadow: 0 0 50px rgba(255, 0, 85, 0.25);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.glitch-text {
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: 5px;
  text-align: center;
  color: #fff;
  margin: 0 0 0.5rem;
}

/* --- LOCATION BROWSER --- */
.location-browser {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-btn {
  background: transparent;
  border: 1px solid var(--accent-red);
  color: var(--accent-red);
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.nav-btn:hover:not(:disabled) {
  background: var(--accent-red);
  color: #fff;
  box-shadow: 0 0 15px var(--accent-red);
}

.nav-btn:disabled {
  border-color: #222;
  color: #2a2a2a;
  cursor: not-allowed;
}

.location-display {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 1.2rem;
  background-size: cover;
  background-position: center;
  border: 1px solid var(--border-subtle);
  padding: 1.2rem;
  height: 48vh;
}

.location-header {
  grid-column: 1 / -1;
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 0.6rem;
}

.zone-label {
  display: block;
  font-size: 0.6rem;
  color: var(--accent-red);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.location-name {
  font-size: 1.7rem;
  color: #fff;
  margin: 0;
  font-family: inherit;
}

.location-subname {
  font-size: 0.8rem;
  color: #607080;
}

.location-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 0, 85, 0.2);
  padding: 1.2rem;
}

.location-info .desc {
  font-size: 0.88rem;
  color: #c0ccd8;
  line-height: 1.6;
  word-break: keep-all;
}

.npc-list {
  margin-top: auto;
}

.npc-list .label {
  display: block;
  font-size: 0.6rem;
  color: var(--accent-green);
  letter-spacing: 2px;
  margin-bottom: 6px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.npc-tag {
  font-size: 0.65rem;
  padding: 2px 8px;
  background: rgba(57, 255, 20, 0.08);
  cursor: help;
}
.npc-tag.mr-call {
  border: 1px solid var(--accent-green);
  color: var(--accent-green);
}
.npc-tag.fish {
  border-color: var(--accent-red);
  color: var(--accent-red);
}
.npc-tag.broke {}
.npc-tag.rich_guy {
  border-color: var(--accent-yellow);
  color: var(--accent-yellow);
}
.npc-tag.maniac {
  border-color: var(--accent-blue);
  color: var(--accent-blue);
}
.npc-tag.old_lion {
  border-color: var(--accent-green);
  color: var(--accent-green);
}
.npc-tag.quant_pro {
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
}
.npc-tag.shark {
  border-color: var(--accent-purple);
  color: var(--accent-purple);
}
.npc-tag.whale {
  border-color: var(--accent-pink);
  color: var(--accent-pink);
}
.npc-tag.gangster {
  border-color: var(--accent-yellow);
  color: var(--accent-yellow);
}

.table-stats {
  background: rgba(0, 0, 0, 0.5);
  padding: 1rem;
  border: 1px solid rgba(255, 0, 85, 0.2);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 0.8rem;
}

.stat-row:last-child {
  margin-bottom: 0;
}
.stat-label {
  color: #506070;
}
.stat-value {
  color: var(--accent-yellow);
  font-weight: 700;
}

.stat-warning {
  color: var(--accent-red);
  font-size: 0.65rem;
  letter-spacing: 1px;
  animation: blink 1.8s infinite;
}

/* --- OPTIONS & BUTTONS --- */
.search-options {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
}

.option-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.option-group .label {
  font-size: 0.65rem;
  color: #607080;
  letter-spacing: 2px;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.btn-group button {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid #333;
  color: #7a8a9a;
  padding: 6px 18px;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-group button.active {
  background: rgba(255, 0, 85, 0.15);
  border-color: var(--accent-red);
  color: var(--accent-red);
}

.popup-actions {
  display: flex;
  gap: 12px;
}

.btn-confirm {
  flex: 1;
  background: rgba(0, 240, 255, 0.12);
  border: 1px solid var(--accent-cyan);
  color: var(--accent-cyan);
  padding: 14px;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 900;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm:hover:not(:disabled) {
  background: var(--accent-cyan);
  color: #000;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.4);
}

.btn-confirm:disabled {
  background: rgba(0, 0, 0, 0.3);
  border-color: #2a2a2a;
  color: #3a4a5a;
  cursor: not-allowed;
}

.btn-cancel {
  padding: 14px 24px;
  background: transparent;
  border: 1px solid var(--accent-red);
  color: var(--accent-red);
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: var(--accent-red);
  color: #fff;
}

/* --- FADE TRANSITION --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* --- MINIMAP ANIMATIONS --- */
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
    border-color: var(--accent-magenta);
  }
  70% {
    transform: translate(-50%, -50%) scale(0.8);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    border-color: rgba(204, 255, 0, 0.8);
  }
}

.location-tag.typing {
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid var(--accent-cyan);
  animation:
    typing 2s steps(30, end),
    blink-caret 1.1s step-end infinite;
  max-width: 0;
  animation-fill-mode: forwards;
}

@keyframes typing {
  from {
    max-width: 0;
  }
  to {
    max-width: 100%;
  }
}

@keyframes blink-caret {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: var(--accent-cyan);
  }
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
}
</style>
