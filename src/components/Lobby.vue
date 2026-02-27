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
        <!-- TODO: Need a Crypto Trade rebuild -->
        <div class="grid-item" :disabled="true" @click="$emit('view', 'crypto')"
          @mouseenter="setMapLocation('EXCHANGE')">
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
                <!-- <span class="location-subname">{{ currentLocation.name }}</span> -->
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
                    <span class="stat-value">
                      <span v-if="currentTableConfig.baseRake !== currentRake"
                        style="text-decoration: line-through; opacity: 0.5; margin-right: 5px;">
                        {{ (currentTableConfig.baseRake * 100).toFixed(1) }}%
                      </span>
                      {{ (currentRake * 100).toFixed(1) }}% (Max {{ currentTableConfig.rakeCap }})
                    </span>
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
                <button class="btn" :class="{ active: selectedSize === 6 }" @click="selectedSize = 6">6-MAX</button>
                <button class="btn" :class="{ active: selectedSize === 9 }" @click="selectedSize = 9">9-MAX</button>
              </div>
            </div>
          </div>

          <div class="popup-actions">
            <button class="btn-confirm" :disabled="!canAfford || isLocked" @click="confirmJoin">
              <span v-if="isLocked">ACCESS_DENIED (KEY_REQUIRED)</span>
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
  return enemy ? enemy.note : '';
}
// Flatten locations efficiently
const flatLocations = computed(() => {
  const locs = [];
  zones.forEach(zone => {
    zone.locations.forEach(loc => {
      if (loc.isHidden) return true;
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
  const eventRake = store.eventRake || 0;

  // AI Agent Boost effects
  let agentRakeDiscount = 0;
  if (store.activeBoosts && currentLocation.value) {
    store.activeBoosts.forEach(b => {
      // Global discount
      if (b.effect.type === 'rake_discount') {
        agentRakeDiscount += b.effect.amount;
      }
      // Targeted discount (e.g. random location event)
      if (b.effect.type === 'rake_discount_rnd_mul' && b.effect.targetLocationId === currentLocation.value.id) {
        agentRakeDiscount += b.effect.amount;
      }
    });
  }

  // Multiply based discount
  let finalRake = (base - eventRake) * Math.max(0, 1 - agentRakeDiscount);
  return Math.max(0.00, finalRake); // CAN'T BE LOWER THAN 0
});

const canAfford = computed(() => {
  if (!currentTableConfig.value) return false;
  return store.bankroll >= (currentTableConfig.value.amount * 0.5);
});

const currentMapKey = ref('DEFAULT');
const mapPositions = {
  DEFAULT: { pos: '50% 50%', name: 'NIGHT_CITY_HUB' },
  CASINO: { pos: '-12% 100%', name: 'CASINO_STRIP' },
  SAFE_HOUSE: { pos: '53% 54%', name: 'SAFE_HOUSE' },
  BLACK_MARKET: { pos: '115% -20%', name: 'KBT_UNDERGROUND' },
  EXCHANGE: { pos: '10% 20%', name: 'FINANCIAL_SECTOR' }
};

const mapPosition = computed(() => mapPositions[currentMapKey.value].pos);
const currentMapLocationName = computed(() => mapPositions[currentMapKey.value].name); // Renamed to avoid collision

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
  // Check against unlockedLocations in store
  return !(store.unlockedLocations && store.unlockedLocations.includes(req));
});

const confirmJoin = () => {
  if (currentLocation.value && canAfford.value && !isLocked.value) {
    const table = currentTableConfig.value;
    console.log('table', table);
    // Check if table size is available
    if (!table.available.includes(selectedSize.value)) {
      // Fallback or error? For now just log or do nothing. 
      // Ideally UI should disable join if size not supported, currently we support 6/9 for all
      return;
    }
    emit('join', {
      size: selectedSize.value,
      buyIn: table.amount,
      rake: currentRake.value,
      rakeCap: table.rakeCap,
      isHighStakes: table.isHighStakes || false,
      locationLV: currentLocation.value.locationLV,
      sb: table.sb,
      bb: table.bb,
      locationId: currentLocation.value.id,
      locationName: currentLocation.value.name,
      backgroundDescription: currentLocation.value.backgroundDescription,
      buyInLimit: table.buyInLimit
    });
    showSearchPopup.value = false;
  } else {
    audioManager.playSFX('ui-error');
  }
};
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
  height: 45%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2.5rem;
}


@media (min-width: 1200px) {
  .city-skyline {
    height: 55%;
  }
}

.minimap-viewport {
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
  background-image: url('../assets/image/minimap.v3.png');
  background-size: 200% 200%;
  transition: background-position 1.2s cubic-bezier(0.23, 1, 0.32, 1);
  opacity: 0.6;
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
  width: 75px;
  height: 75px;
  color: #f8ef00;
  border: 4px solid rgba(248, 239, 0, 0.5);
  transform: translate(-50%, -50%);
}

.building-silhouette {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
  opacity: 0.15;
  z-index: 1;
}

.building {
  background: var(--neon-cyan);
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

.lobby-content {
  flex: 1;
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

/* Search Popup Styles */
.table-search-overlay {
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  z-index: 100;
}

.search-popup {
  width: 95%;
  max-width: 900px;
  /* Wider for the new layout */
  background: #050a0e;
  border: 2px solid var(--neon-cyan);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  background-position: center center;
}

.location-browser {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1.5rem 0;
  gap: 1rem;
}

.location-display {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 1.5rem;
  /* background: rgba(0, 240, 255, 0.02); */
  background-size: cover;
  background-position: center center;
  border: 1px solid var(--glass-border);
  padding: 1.5rem;
  height: 50vh;
}

.location-header {
  grid-column: 1 / -1;
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: 0.5rem;
}

.zone-label {
  font-size: 0.7rem;
  color: var(--neon-magenta);
  letter-spacing: 2px;
  text-transform: uppercase;
  text-shadow: 0 0 3px #050a0e;
}

.location-name {
  font-size: 1.8rem;
  color: #fff;
  margin: 0.2rem 0;

  text-shadow: 0 0 5px rgba(0, 240, 255, 0.3);
}

.location-subname {
  font-size: 0.8rem;
  color: #888;
  font-style: italic;
}

/* removed .location-visual and .visual-placeholder styles */

.location-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  /* Glassmorphism for better readability over background image */
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(0, 240, 255, 0.2);
  padding: 1.5rem;
  border-radius: 4px;
}

.location-info .desc {
  font-size: 1.2rem;
  color: #fff;
  line-height: 1.6;
  text-align: left;
  word-break: keep-all;
  overflow-wrap: break-word;
  margin: 0;
}
[lang="en"] .location-info .desc {
  font-size: 1rem;
}

.npc-list {
  margin-top: auto;
}

.npc-list .label {
  display: block;
  font-size: 0.7rem;
  color: var(--neon-green);
  margin-bottom: 0.5rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.npc-tag {
  font-size: 0.7rem;
  padding: 2px 6px;
  background: rgba(0, 255, 65, 0.1);
  border: 1px solid var(--neon-green);
  color: var(--neon-green);
  cursor: help;
}

.table-stats {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border: 1px solid #333;
  /* margin-top: 1rem; */
}

.stat-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;

  font-size: 0.8rem;
}

.stat-row:last-child {
  margin-bottom: 0;
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

.nav-btn {
  background: transparent;
  border: 1px solid var(--neon-cyan);
  color: var(--neon-cyan);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover:not(:disabled) {
  background: var(--neon-cyan);
  color: #000;
  box-shadow: 0 0 15px var(--neon-cyan);
}

.nav-btn:disabled {
  border-color: #333;
  color: #333;
  cursor: not-allowed;
}

.search-options {
  margin: 1rem 0;
  display: flex;
  justify-content: flex-end;
  /* right align the size selector */
}

.option-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.option-group .label {
  margin-bottom: 0;
}

/* Reusing btn-group styles but checking if override is needed */
.btn-group {
  display: flex;
  gap: 10px;
}

.btn-group button {
  padding: 5px 15px;
  font-size: 0.8rem;
  background-color: #333;
}

.btn-group button.active {
  background-color: var(--neon-red);
  /* color: #000; */
  /* box-shadow: 0 0 15px var(--neon-cyan); */
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
