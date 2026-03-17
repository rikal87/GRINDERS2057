<template>
  <Transition name="fade">
    <div v-if="showSearchPopup" class="overlay table-search-overlay" @click.self="showSearchPopup = false">
      <div class="terminal-msg search-popup">
        <h2 class="glitch-text" data-text="NET_TABLE_FINDER">NET_TABLE_FINDER</h2>

        <div class="location-browser">
          <button class="nav-btn prev" @click="prevLocation" :disabled="currentInviteId">&lt;</button>

          <div class="location-display" :style="{ backgroundImage: `url(${currentLocation.imgSrc})` }">
            <div class="location-header">
              <b class="zone-label">{{ currentLocation.zoneName }}</b>
              <h3 class="location-name">{{ getLocalizedText(currentLocation, 'name') }}</h3>
              <!-- <span class="location-subname">{{ currentLocation.name }}</span> -->
            </div>
            <div class="location-info">
              <p class="desc">{{ getLocalizedText(currentLocation, 'description') }}</p>

              <div class="npc-list">
                <span class="label">TABLE_NOTES</span>
                <div class="tags">

                  <span v-for="npc in currentLocation.npcs" :key="npc" class="npc-tag" :data-tooltip="getNote(npc)"
                    :class="`${npc.toLowerCase()}`">{{
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
                  <span class="stat-value">{{ currentTableConfig.sb.toLocaleString() }}/{{
                    currentTableConfig.bb.toLocaleString() }}</span>
                </div>

                <div class="stat-row">
                  <span class="stat-label">RAKE:</span>
                  <span class="stat-value">
                    <span v-if="currentTableConfig.baseRake !== currentRake"
                      style="text-decoration: line-through; opacity: 0.5; margin-right: 5px;">
                      {{ (currentTableConfig.baseRake * 100).toFixed(1) }}%
                    </span>
                    {{ (currentRake * 100).toFixed(1) }}% (Max {{ currentTableConfig.rakeCap.toLocaleString() }})
                  </span>
                </div>
                <div class="stat-row" v-if="currentTableConfig.buyInLimit">
                  <span class="stat-label">BUY_IN_LIMIT:</span>
                  <span class="stat-value red">
                    {{ currentTableConfig.buyInLimit }}
                  </span>
                </div>
              </div>
            </div>
            <div class="house-status">
              <span class="tag CRITICAL" :data-tooltip="blacklistInfo" v-if="isBlacklisted(currentLocation.id)">
                {{ getBlacklistNote(currentLocation.id) }}
              </span>
              <span class="tag" :data-tooltip="infamyinfo" :class="`${getInfamyColorlabel(currentLocation.id)}`">
                {{ getInfamyNote(currentLocation.id) }}
              </span>
              <span class="tag" v-if="currentTableConfig.isMonitoring" :data-tooltip="suspicioninfo"
                :class="`${getSuspicionColorLabel(currentLocation.id)}`">
                {{ getSuspicionNote(currentLocation.id) }}
              </span>
            </div>
          </div>
          <button class="nav-btn next" @click="nextLocation" :disabled="currentInviteId">&gt;</button>
        </div>

        <div class="search-options">
          <div class="option-group">
            <span class="label">TABLE_SIZE:</span>
            <div class="btn-group">
              <button class="btn-accept" v-for="size in currentTableConfig.available"
                :class="{ active: selectedSize === size }" @click="selectedSize = size">{{ size === 2 ? 'HEADS_UP' :
                  `${size}-MAX` }}</button>
            </div>
          </div>
        </div>

        <div class="popup-actions">
          <button class="btn-accept" :disabled="!canAfford || isLocked" @click="confirmJoin">
            <span v-if="isLocked">ACCESS_DENIED</span>
            <span v-else-if="canAfford">INITIATE_LINK</span>
            <span v-else>INSUFFICIENT_FUNDS</span>
          </button>
          <button class="btn-cancel" @click="closePopup">ABORT</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { getCurrentInfamy, getCurrentSuspicion, store, isBlacklisted, getLocalizedText } from '../logic/store.js';
import { audioManager } from '../logic/audioManager.js';
import { zones } from '../logic/zone.js';
import { CLASSES_ENEMY } from '../logic/persona.js';

const showSearchPopup = ref(false);
const emit = defineEmits(['join', 'close']);

const currentInviteId = ref(null);
const closePopup = () => {
  currentLocationIndex.value = 0
  currentInviteId.value = null;
  showSearchPopup.value = false;
}
// Expose ability to open popup from parent
defineExpose({
  open() {
    currentInviteId.value = null;
    showSearchPopup.value = true;
  },
  openWithLocation(locationId, inviteId = null) {
    const idx = flatLocations.value.findIndex(loc => loc.id === locationId);
    if (idx !== -1) {
      currentLocationIndex.value = idx;
    }
    currentInviteId.value = inviteId;
    showSearchPopup.value = true;
  },
});

watch(showSearchPopup, (newVal) => {
  if (!newVal) {
    emit('close');
  }
});
const blacklistInfo = computed(() => store.settings.language === 'ko' ?
  '이 구역은 출입이 제한되었습니다. 의심 수치가 떨어지면 다시 방문할 수 있습니다.'
  : 'This zone is currently off-limits. You can visit again once your suspicion level drops.');
const infamyinfo = computed(() => store.settings.language === 'ko' ?
  '악명이 높을수록 NPC의 대응이 정교해지며, 일정 수준 이상부터는 의심 수치가 증가합니다.'
  : 'Higher Notoriety leads to more balanced NPC play. Beyond a certain point, it starts increasing your Suspect level.');
const suspicioninfo = computed(() => store.settings.language === 'ko' ?
  '감시의 눈초리가 깊어지면 자리를 뜨기 쉽지 않습니다. 보안 요원의 검문을 조심하십시오. 의심이 확신이 되는 순간, 이 구역은 출입이 불가하게 될 것입니다.'
  : 'Under high suspicion, leaving becomes a challenge and security checks become frequent. Once you\'re marked, this entire zone will be off-limits');
const getBlacklistNote = (locationId) => {
  const isTrue = isBlacklisted(locationId);
  return isTrue ? 'BLACKLISTED' : 'CLEARED';
}
const getInfamyColorlabel = (locationId) => {
  const suspicion = getCurrentInfamy(locationId);
  if (suspicion >= 80) return 'CRITICAL';
  else if (suspicion >= 60) return 'HIGH';
  else if (suspicion >= 40) return 'MEDIUM';
  else if (suspicion >= 20) return 'LOW';
  else return 'NONE';
}
const getSuspicionColorLabel = (locationId) => {
  const suspicion = getCurrentSuspicion(locationId);
  if (suspicion >= 80) return 'CRITICAL';
  else if (suspicion >= 60) return 'HIGH';
  else if (suspicion >= 40) return 'MEDIUM';
  else if (suspicion >= 20) return 'LOW';
  else return 'NONE';
}
const getInfamyNote = (locationId) => {
  const infamy = getCurrentInfamy(locationId);
  if (infamy >= 80) return 'INFAMY: PUBLIC_ENEMY';
  else if (infamy >= 60) return 'INFAMY: NOTORIOUS';
  else if (infamy >= 40) return 'INFAMY: RISING_STAR';
  else if (infamy >= 20) return 'INFAMY: BLIP';
  else return 'INFAMY: NOBODY';
}
const getSuspicionNote = (locationId) => {
  const suspicion = getCurrentSuspicion(locationId);
  if (suspicion >= 80) return 'SUSPICION: CRITICAL_ALERT';
  else if (suspicion >= 60) return 'SUSPICION: FOCUSED_MONITORING';
  else if (suspicion >= 40) return 'SUSPICION: UNDER_SURVEILLANCE';
  else if (suspicion >= 20) return 'SUSPICION: MINOR_TRACE';
  else return 'SUSPICION: CLEAN';
}

const selectedSize = ref(6);
const getNote = (npc) => {
  const enemy = CLASSES_ENEMY.find(e => e.name === npc);
  return enemy ? getLocalizedText(enemy, 'note') : '';
}

// Flatten locations efficiently
const flatLocations = computed(() => {
  const locs = [];
  zones.forEach(zone => {
    zone.locations.forEach(loc => {
      // if (loc.isHidden && !currentInviteId.value) return true;
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
  currentLocationIndex.value++;
  if (currentLocationIndex.value >= flatLocations.value.length) {
    currentLocationIndex.value = 0;
  }
  if (flatLocations.value[currentLocationIndex.value].isHidden) {
    nextLocation();
    return;
  }

  audioManager.playSFX('ui-click');
};
const prevLocation = () => {
  currentLocationIndex.value--;
  if (currentLocationIndex.value < 0) {
    currentLocationIndex.value = flatLocations.value.length - 1;
  }
  console.log(flatLocations.value[currentLocationIndex.value]);
  if (flatLocations.value[currentLocationIndex.value].isHidden) {
    prevLocation();
    return;
  }

  audioManager.playSFX('ui-click');
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

const isLocked = computed(() => {
  if (isBlacklisted(currentLocation.value.id)) return true;
  const req = currentLocation.value.requirements;
  if (!req) return false;
  return !(store.unlockedLocations && store.unlockedLocations.includes(req));
});

const confirmJoin = () => {
  if (currentLocation.value && canAfford.value && !isLocked.value) {
    const table = currentTableConfig.value;
    // Check if table size is available
    if (!table.available.includes(selectedSize.value)) {
      return;
    }
    emit('join', {
      inviteId: currentInviteId.value,
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
/* Search Popup Styles */
.table-search-overlay {
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  z-index: 100;
}

.search-popup {
  width: 95%;
  max-width: 900px;
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
  grid-template-columns: 0.75fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 1.5rem;
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
  text-shadow: 0 0 2px #000;
}

.location-subname {
  font-size: 0.8rem;
  color: #888;
}

.location-info {
  display: inline-flex;
  align-self: flex-end;
  flex-direction: column;
  gap: 1rem;
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
  min-height: 4vh;
  gap: 5px;
  align-content: center;
}

.npc-tag {
  font-size: 0.7rem;
  padding: 2px 6px;
  background: rgba(0, 255, 65, 0.1);
  border: 1px solid;
  cursor: help;
}
.npc-tag.mr_call {
  border-color: var(--neon-marine);
  color: var(--neon-marine);
}
.npc-tag.fish {
  border-color: var(--neon-green);
  color: var(--neon-green);
}
.npc-tag.broke {
  border-color: var(--neon-brown);
  color: var(--neon-brown);
}
.npc-tag.gambler {
  border-color: var(--neon-purple);
  color: var(--neon-purple);
}
.npc-tag.rich_guy {
  border-color: var(--accent-magenta);
  color: var(--accent-magenta);
}
.npc-tag.maniac {
  border-color: var(--neon-violet);
  color: var(--neon-violet);
}
.npc-tag.old_lion {
  border-color: var(--neon-gold);
  color: var(--neon-gold);
}
.npc-tag.quant_pro {
  border-color: var(--neon-cyan);
  color: var(--neon-cyan);
}
.npc-tag.shark {
  border-color: var(--neon-indigo);
  color: var(--neon-indigo);
}
.npc-tag.the_whale {
  border-color: var(--neon-shine-gold);
  color: var(--neon-shine-gold);
}
.npc-tag.gangster {
  border-color: var(--neon-orange);
  color: var(--neon-orange);
}
.npc-tag.the_don {
  border-color: var(--neon-red);
  color: var(--neon-red);
}
.npc-tag.nit {
  border-color: var(--neon-grey);
  color: var(--neon-grey);
}
.npc-tag.named_pro {
  border-color: var(--neon-red);
  color: var(--neon-gold);
}
.table-stats {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border: 1px solid #333;
}
.house-status {
  display: flex;
  flex-direction: column;
  align-content: flex-end;
  align-items: flex-end;
  justify-content: flex-end;
}
.house-status .tag {
  font-size: 0.7rem;
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid;
  margin: 5px;
  cursor: help;
}
.house-status .tag.CRITICAL {
  border-color: var(--neon-red);
  color: var(--neon-red);
}
.house-status .tag.HIGH {
  border-color: var(--neon-orange);
  color: var(--neon-orange);
}
.house-status .tag.MEDIUM {
  border-color: var(--neon-yellow);
  color: var(--neon-yellow);
}
.house-status .tag.LOW {
  border-color: var(--neon-green);
  color: var(--neon-green);
}
.house-status .tag.NONE {
  border-color: var(--neon-grey);
  color: var(--neon-grey);
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
</style>
