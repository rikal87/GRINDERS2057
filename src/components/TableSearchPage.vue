<template>
  <TerminalLayout :show-back="true" @back="$emit('back')">
    <!-- Main Fullscreen 1-Column Accordion Layout -->
    <div class="page-main-accordion">
      <div class="title-section">
        <div class="title-watermark">SECTOR</div>
        <h1 class="page-title">SECTOR_TABLE_FINDER<span class="yellow-dot">.</span></h1>
        <div class="sub-log cyan">// SELECT_LOCATION_CARD_TO_UNFOLD_SPECS // GROUPED_BY_STAKES</div>
      </div>

      <!-- Grouped by Stake Zones (CMY Structured Division) -->
      <div class="zones-container">
        <div v-for="(zone, zIdx) in zones" :key="zone.id" class="stake-zone-group">
          <!-- Stake Category Section Header (Cyan / Yellow Divider) -->
          <div class="zone-category-header">
            <span class="category-lbl cyan">STAKE_ZONE_0{{ zIdx + 1 }} //</span>
            <h2 class="category-title">{{ zone.name }}</h2>
            <span class="category-deco-line"></span>
          </div>

          <!-- 1-Column Accordion Card List inside Zone -->
          <div class="accordion-card-list">
            <div v-for="(loc, lIdx) in zone.locations" :key="loc.id" class="accordion-card-item"
              :class="{ unfolded: expandedGlobalId === loc.id, blacklisted: isBlacklisted(loc.id) }">

              <!-- Card Header Bar -->
              <div class="card-header-bar" @click="toggleAccordion(loc.id)">
                <span class="card-num">0{{ lIdx + 1 }} //</span>
                <div class="card-title-group">
                  <h2 class="card-main-title">{{ getLocalizedText(loc, 'name') }}</h2>
                  <span class="card-zone-sub cyan">{{ zone.name || 'SECTOR_NODE' }}</span>
                </div>
                <div class="card-meta-right">
                  <span class="card-stake-tag yellow">{{ (loc.tables || loc.tableConfig || {}).amount_fmt || '1K' }}
                    CR</span>
                  <span class="card-unfold-icon">{{ expandedGlobalId === loc.id ? '▲' : '▼' }}</span>
                </div>

                <!-- Hover Cut-out Image Lens -->
                <div class="card-hover-lens" :style="{ backgroundImage: `url(${loc.imgSrc})` }"></div>
              </div>

              <!-- Unfolded Panel: Visual Lens, 5-Column Specs Grid, & Deployment Console -->
              <div class="card-unfold-content" v-if="expandedGlobalId === loc.id">
                <div class="unfold-inner-body">

                  <!-- Top 3D Visual Lens Image Banner -->
                  <div class="unfold-visual-banner" :style="{ backgroundImage: `url(${loc.imgSrc})` }">
                    <div class="banner-gradient"></div>
                    <div class="banner-overlay-txt font-orbitron">{{ loc.desc }}</div>
                  </div>

                  <!-- 5-Column Specs Grid (Perfect Symmetry & Balance) -->
                  <div class="specs-matrix-grid">
                    <div class="spec-box">
                      <span class="spec-lbl cyan font-orbitron">BUY_IN</span>
                      <span class="spec-val yellow font-orbitron">${{ (loc.tables || loc.tableConfig || {}).amount ?
                        (loc.tables || loc.tableConfig || {}).amount.toLocaleString() : '1,000' }}
                        <small>CR</small></span>
                    </div>

                    <div class="spec-box">
                      <span class="spec-lbl cyan font-orbitron">BLINDS</span>
                      <span class="spec-val cyan font-orbitron">{{ (loc.tables || loc.tableConfig || {}).sb || 5 }}/{{
                        (loc.tables || loc.tableConfig || {}).bb || 10 }}</span>
                    </div>

                    <div class="spec-box">
                      <span class="spec-lbl cyan font-orbitron">RAKE</span>
                      <span class="spec-val font-orbitron">{{ ((loc.tables || loc.tableConfig || {}).rake || 0.05) * 100
                      }}%</span>
                    </div>

                    <div class="spec-box">
                      <span class="spec-lbl cyan font-orbitron">RULES</span>
                      <span class="spec-val magenta font-orbitron"
                        v-if="(loc.tables || loc.tableConfig || {}).isDeathmatch">DEATHMATCH</span>
                      <span class="spec-val cyan font-orbitron" v-else-if="loc.isDrunken">🍺 DRUNKEN</span>
                      <span class="spec-val cyan font-orbitron" v-else>STANDARD</span>
                    </div>

                    <div class="spec-box yellow-spec">
                      <span class="spec-lbl yellow font-orbitron">REQ_SKILL</span>
                      <span class="spec-val yellow font-orbitron">{{ loc.reqSkill || 50 }}+</span>
                    </div>
                  </div>

                  <!-- Hero Direct Table Join Action Bar -->
                  <!--필요없음-->
                  <!-- <div class="unfold-action-bar">
                    <button class="btn-initiate-link target-lockon-btn yellow-solid font-orbitron instant-flash-btn" 
                      :disabled="!canAffordLoc(loc) || isBlacklisted(loc.id)" @click="confirmJoinLoc(loc)">
                      <span class="btn-txt-layer" v-if="isBlacklisted(loc.id)">ACCESS_DENIED</span>
                      <span class="btn-txt-layer" v-else-if="canAffordLoc(loc)">[ HERO_JOIN_TABLE (6-MAX) ] ➔</span>
                      <span class="btn-txt-layer" v-else>INSUFFICIENT_FUNDS</span>
                      <div class="btn-image-lens" :style="{ backgroundImage: `url(${loc.imgSrc})` }"></div>
                    </button>
                  </div> -->

                  <!-- Sector Roster Deployment Console -->
                  <div class="sector-roster-deploy-panel fui-cctv-frame">
                    <div class="panel-hdr-row">
                      <span class="cyan font-orbitron">// SECTOR_ROSTER_DEPLOYMENT_CONSOLE</span>
                      <span class="dim font-orbitron">[ACTIVE_UNITS: {{ (getDeployedPartnersInSector(loc.id) ||
                        []).length }}]</span>
                    </div>

                    <!-- IDLE Roster Unit Relay Cards Grid (Touch/Click to Deploy Instantly) -->
                    <div class="roster-unit-cards-grid" v-if="(idlePartners || []).length > 0">
                      <div v-for="p in idlePartners" :key="p.id"
                        class="roster-unit-card instant-flash-btn fui-cctv-frame"
                        @click="handleDeployPartnerToSector(p, loc.id)">
                        <div class="unit-lens-bg" :style="{ backgroundImage: `url(${getPartnerImage(p.id)})` }"></div>
                        <div class="unit-card-info">
                          <span class="unit-name font-orbitron">{{ p.name.toUpperCase() }}</span>
                          <span class="unit-ovr yellow font-orbitron">SKILL: {{ p.skillRating || 75 }}</span>
                          <small v-if="(p.skillRating || 75) < (loc.reqSkill || 50)" class="magenta font-orbitron">⚠️ REQ_UNMET</small>
                        </div>
                        <button class="btn-unit-deploy font-orbitron">[ ▶ DEPLOY ]</button>
                      </div>
                    </div>

                    <div v-else class="empty-roster-txt dim font-orbitron">
                      // NO_IDLE_UNITS_AVAILABLE_FOR_DEPLOYMENT
                    </div>

                    <!-- Currently Deployed Partners List in this Sector (Sleek Brutalist Unit Tags) -->
                    <div class="deployed-units-chips-flex"
                      v-if="(getDeployedPartnersInSector(loc.id) || []).length > 0">
                      <span class="lbl yellow font-orbitron">ACTIVE_UNITS_IN_SECTOR:</span>
                      <div v-for="dp in getDeployedPartnersInSector(loc.id)" :key="dp.id" class="deployed-unit-chip">
                        <span class="unit-status-dot"></span>
                        <span class="unit-name font-orbitron">{{ dp.name.toUpperCase() }}</span>
                        <button class="btn-chip-recall font-orbitron instant-flash-btn"
                          @click="handleRecallPartner(dp)">[ RECALL_UNIT ]</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </TerminalLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store, isBlacklisted, getLocalizedText } from '../logic/store.js';
import { getPartners } from '../logic/partnerSystem.js';
import { zones } from '../logic/zone.js';
import { audioManager } from '../logic/audioManager.js';
import TerminalLayout from './TerminalLayout.vue';

const emit = defineEmits(['join', 'back']);

const expandedGlobalId = ref(null);
const selectedSize = ref(6);

const idlePartners = computed(() => {
  const list = getPartners ? getPartners() : (store.partners || []);
  return (list || []).filter(p => p.status !== 'GAMBLING' && p.status !== 'REHAB' && !p.isBlacklisted);
});

const getDeployedPartnersInSector = (sectorId) => {
  const list = getPartners ? getPartners() : (store.partners || []);
  return (list || []).filter(p => p.status === 'GAMBLING' && p.currentLocationId === sectorId);
};

const handleRecallPartner = (partner) => {
  if (partner) {
    partner.status = 'IDLE';
    partner.currentLocationId = null;
    audioManager.playSFX('ui-click');
  }
};

const toggleAccordion = (locId) => {
  audioManager.playSFX('ui-click');
  if (expandedGlobalId.value === locId) {
    expandedGlobalId.value = null;
  } else {
    expandedGlobalId.value = locId;
  }
};

const canAffordLoc = (loc) => {
  const config = loc.tables || loc.tableConfig || {};
  const buyIn = config.amount || 1000;
  return store.bankroll >= buyIn;
};

const confirmJoinLoc = (loc) => {
  if (isBlacklisted(loc.id) || !canAffordLoc(loc)) return;
  audioManager.playSFX('chip-ship-it');
  emit('join', {
    locationId: loc.id,
    tableSize: 6 // Hardcoded 6-MAX Format
  });
};

const getPartnerImage = (id) => {
  return new URL(`../assets/image/partner/${id}.jpg`, import.meta.url).href;
};

const handleDeployPartnerToSector = (partner, sectorId) => {
  if (partner) {
    partner.status = 'GAMBLING';
    partner.currentLocationId = sectorId;
    audioManager.playSFX('coin-throw');
  }
};
</script>

<style scoped>
@import '../assets/fonts/pretendard-std.css';
@import '../assets/css/theme-os.css';

/* Colors */
.cyan {
  color: var(--neon-cyan) !important;
}
.yellow {
  color: var(--neon-yellow) !important;
}
/* 5-Column Specs Grid (Perfect Balance) */
.specs-matrix-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.spec-box {
  background: #04080c;
  border: 1px solid rgba(0, 240, 255, 0.2);
  padding: 0.8rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.spec-box.yellow-spec {
  border-color: var(--neon-yellow);
  background: rgba(204, 255, 0, 0.05);
}

.spec-lbl {
  font-size: 0.72rem;
  font-weight: 900;
}
.spec-val {
  font-size: 1.2rem;
  font-weight: 900;
}
.spec-val small {
  font-size: 0.75rem;
}

.panel-hdr-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unit-status-dot {
  width: 8px;
  height: 8px;
  background: var(--neon-cyan);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--neon-cyan);
}

.btn-chip-recall {
  background: var(--neon-magenta);
  border: none;
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 900;
  padding: 0.25rem 0.6rem;
  cursor: pointer;
  border-radius: 0px;
}

@media (max-width: 1024px) {
  .specs-matrix-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Main Accordion Layout */
.page-main-accordion {
  padding: 1.5rem 4rem;
  max-width: 1300px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.title-section {
  margin-bottom: 2rem;
}

.page-title {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

.yellow-dot {
  color: var(--neon-yellow);
}

.sub-log {
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  margin-top: 0.4rem;
}

/* Stake Zone Category Header */
.stake-zone-group {
  margin-bottom: 3rem;
}

.zone-category-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.category-lbl {
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.category-title {
  font-size: 1.5rem;
  font-weight: 900;
  margin: 0;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #ffffff;
}

.category-deco-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--neon-cyan) 0%, rgba(255, 255, 255, 0.02) 100%);
}

/* 1-Column Accordion List */
.title-section {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
}

.title-watermark {
  position: absolute;
  top: -25px;
  left: -10px;
  font-size: 6rem;
  font-weight: 900;
  color: rgba(0, 240, 255, 0.03);
  letter-spacing: 0.1em;
  pointer-events: none;
  user-select: none;
}

.accordion-card-item {
  border: 1px solid rgba(0, 240, 255, 0.2);
  background: rgba(8, 12, 16, 0.9);
  transition: all 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
  overflow: hidden;
}

/* Header Bar */
.card-header-bar {
  position: relative;
  display: flex;
  align-items: center;
  padding: 1.4rem 2.2rem;
  cursor: pointer;
  overflow: hidden;
}

.card-num {
  font-size: 1.8rem;
  font-weight: 900;
  color: #405060;
  width: 80px;
  transition: color 0.25s;
}

.card-title-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-main-title {
  font-size: clamp(1.6rem, 3vw, 2.5rem);
  font-weight: 900;
  margin: 0;
  letter-spacing: 0.02em;
  color: #ffffff;
  transition: color 0.25s;
}

.card-zone-sub {
  font-size: 0.78rem;
  margin-top: 0.2rem;
  letter-spacing: 0.1em;
}

.card-meta-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  z-index: 2;
}

.card-stake-tag {
  font-size: 1.1rem;
  font-weight: 900;
}

.card-unfold-icon {
  font-size: 1.2rem;
  color: #405060;
  transition: color 0.25s;
}

/* Hover Cut-out Image Lens */
.card-hover-lens {
  position: absolute;
  right: -40px;
  top: 0;
  width: 180px;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transform: skewX(-20deg);
  transition: all 0.3s ease;
  z-index: 1;
  filter: contrast(1.2) brightness(0.8);
}

.card-header-bar:hover .card-hover-lens {
  opacity: 0.5;
  right: 0;
}

/* Unfolded State (Yellow Active Block Header) */
.accordion-card-item.unfolded .card-header-bar {
  background: var(--neon-yellow);
  color: #000000;
}

.accordion-card-item.unfolded .card-num,
.accordion-card-item.unfolded .card-main-title,
.accordion-card-item.unfolded .card-zone-sub,
.accordion-card-item.unfolded .card-stake-tag,
.accordion-card-item.unfolded .card-unfold-icon {
  color: #000000 !important;
}

.accordion-card-item:not(.unfolded) .card-header-bar:hover {
  background: var(--neon-cyan);
}

.accordion-card-item:not(.unfolded) .card-header-bar:hover .card-num {
  color: var(--neon-magenta);
}
.accordion-card-item:not(.unfolded) .card-header-bar:hover .card-main-title {
  color: #000000;
}
.accordion-card-item:not(.unfolded) .card-header-bar:hover .card-zone-sub {
  color: #111111;
  font-weight: bold;
}
.accordion-card-item:not(.unfolded) .card-header-bar:hover .card-stake-tag {
  color: #000000;
}

/* Unfolded Body Area */
.card-unfold-content {
  background: rgba(4, 6, 8, 0.95);
  border-top: 1px solid var(--neon-yellow);
  padding: 1.8rem 2.2rem;
  animation: unfoldDown 0.3s ease-out forwards;
}

.unfold-inner-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.unfold-visual-banner {
  position: relative;
  height: 220px;
  /* Brutalist Roster Unit Relay Cards (No Select Box!) */
  .roster-unit-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.8rem;
    margin-top: 0.4rem;
  }

  .roster-unit-card {
    position: relative;
    background: #020406;
    border: 1px solid rgba(0, 240, 255, 0.3);
    padding: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.2s ease;
  }

  .roster-unit-card:hover {
    border-color: var(--neon-yellow);
    box-shadow: 0 0 15px rgba(204, 255, 0, 0.3);
  }

  .unit-lens-bg {
    width: 44px;
    height: 44px;
    background-size: cover;
    background-position: center;
    border: 1px solid var(--neon-cyan);
    flex-shrink: 0;
  }

  .unit-card-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .unit-name {
    font-size: 0.88rem;
    font-weight: 900;
    color: #ffffff;
  }
  .unit-ovr {
    font-size: 0.75rem;
    font-weight: 900;
  }

  .btn-unit-deploy {
    background: var(--neon-yellow);
    border: none;
    color: #000000;
    font-size: 0.72rem;
    font-weight: 900;
    padding: 0.3rem 0.6rem;
    border-radius: 0px;
    cursor: pointer;
  }

  .empty-roster-txt {
    font-size: 0.8rem;
    padding: 0.5rem 0;
  }
  background-size: cover;
  background-position: center;
  border: 1px solid rgba(0, 240, 255, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  box-sizing: border-box;
  filter: grayscale(20%) contrast(1.2);
}

.banner-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.85) 100%);
  z-index: 1;
}

.scanline-lens {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.3) 50%);
  background-size: 100% 3px;
  pointer-events: none;
  z-index: 2;
}

.banner-info {
  position: relative;
  z-index: 3;
}

.status-tag {
  font-size: 0.75rem;
  font-weight: 900;
  padding: 0.2rem 0.6rem;
}
.status-tag.cyan {
  border: 1px solid var(--neon-cyan);
  color: var(--neon-cyan);
}
.status-tag.magenta {
  border: 1px solid var(--neon-magenta);
  color: var(--neon-magenta);
}

.banner-desc {
  font-size: 0.9rem;
  color: #c0d0e0;
  margin-top: 0.5rem;
}

/* Specs Grid */
.specs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.spec-card {
  display: flex;
  flex-direction: column;
  background: #000000;
  padding: 0.9rem 1.2rem;
  border: 1px solid rgba(0, 240, 255, 0.25);
}

.spec-card .lbl {
  font-size: 0.72rem;
  color: #506070;
  font-weight: bold;
  letter-spacing: 0.05em;
}
.spec-card .val {
  font-size: 1.15rem;
  font-weight: 900;
  margin-top: 0.4rem;
}

/* Unfold Action Bar */
.unfold-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.capacity-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cap-lbl {
  font-size: 0.85rem;
  color: #8090a0;
  font-weight: bold;
}
.cap-btn-group {
  display: flex;
  gap: 0.6rem;
}

.btn-cap {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(0, 240, 255, 0.25);
  color: #ffffff;
  padding: 0.7rem 1.2rem;
  font-family: inherit;
  font-weight: 900;
  font-size: 0.85rem;
  cursor: pointer;
  border-radius: 0px;
}

.btn-cap.active {
  background: var(--neon-cyan);
  border-color: var(--neon-cyan);
  color: #000000;
}

/* Target Lock-on Button (Complete Rectangle Solid Block) */
.target-lockon-btn {
  position: relative;
  flex: 1;
  max-width: 450px;
  background: var(--neon-yellow);
  border: 2px solid var(--neon-yellow);
  color: #000000;
  padding: 1.1rem 2rem;
  font-family: inherit;
  font-weight: 900;
  font-size: 1.15rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  box-shadow: 0 0 25px rgba(204, 255, 0, 0.35);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0px;
  transition: all 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.btn-txt-layer {
  z-index: 3;
  position: relative;
}

.btn-image-lens {
  position: absolute;
  right: -40px;
  top: 0;
  width: 140px;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0.2;
  transition: all 0.3s ease;
  z-index: 2;
  filter: contrast(1.3);
  border-left: 2px solid #000000;
}

.target-lockon-btn:hover:not(:disabled) {
  background: #ffffff;
  border-color: #ffffff;
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.85);
}

.target-lockon-btn:hover:not(:disabled) .btn-image-lens {
  opacity: 0.85;
  right: 0;
}

.target-lockon-btn:disabled {
  background: #151b22;
  border-color: #151b22;
  color: #405060;
  cursor: not-allowed;
  box-shadow: none;
}

@keyframes unfoldDown {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 900px) {
  .page-main-accordion {
    padding: 1rem;
  }
  .specs-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 0.6rem;
  }
  .unfold-action-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 1.2rem;
  }
  .capacity-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .target-lockon-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
