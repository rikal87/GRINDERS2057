<template>
  <TerminalLayout :show-back="true" @back="$emit('back')">
    <div class="partner-net-viewport">

      <!-- Top Title Header with Watermark Style -->
      <div class="title-block">
        <div class="title-watermark font-orbitron">ROSTER</div>
        <h1 class="hero-title font-orbitron">PARTNERS_NET<span class="yellow-dot">.</span></h1>

        <!-- Marathon Style FUI Symbol Decorator String -->
        <div class="fui-symbol-string font-orbitron">
          <span class="yellow glow-yellow">+ IIIIIIII X ⦿ 28 93 ⨉</span>
        </div>

        <div class="sub-syslog cyan font-orbitron">
          <span>// ROSTER_MANAGEMENT_CONSOLE //</span>
          <span class="yellow glow-yellow">[AGENCY_TIER: 03 (CLASS_C)]</span>
          <span class="dim">|</span>
          <span class="pulse-neon-cyan">[DEPLOYED: {{ deployedCount }}/{{ partners.length }}]</span>
          <span class="dim">|</span>
          <span class="yellow glow-yellow">[TODAY_PnL: +${{ todayTotalPnL.toLocaleString() }}]</span>
        </div>
      </div>

      <!-- ROSTER QUICK FILTER & SMART SORTING CONTROLLER BAR -->
      <div class="roster-filter-sort-bar">
        <!-- Status Quick Filter Tabs -->
        <div class="filter-tabs-group">
          <button class="btn-filter-tab font-orbitron" :class="{ active: filterStatus === 'ALL' }"
            @click="filterStatus = 'ALL'">
            ALL ({{ partners.length }})
          </button>
          <button class="btn-filter-tab cyan font-orbitron" :class="{ active: filterStatus === 'GAMBLING' }"
            @click="filterStatus = 'GAMBLING'">
            🟢 GAMBLING ({{ deployedCount }})
          </button>
          <button class="btn-filter-tab yellow font-orbitron" :class="{ active: filterStatus === 'IDLE' }"
            @click="filterStatus = 'IDLE'">
            🟡 IDLE ({{ idleCount }})
          </button>
          <button class="btn-filter-tab magenta font-orbitron" :class="{ active: filterStatus === 'RISKS' }"
            @click="filterStatus = 'RISKS'">
            🔴 RISKS/REHAB ({{ riskCount }})
          </button>
        </div>

        <!-- Smart Sorting Dropdown / Switcher -->
        <div class="sorting-selector-group">
          <span class="sort-lbl font-orbitron cyan">SORT_BY:</span>
          <select v-model="sortBy" class="os-select-sort font-orbitron">
            <option value="ovr">OVR_RATING (높은순)</option>
            <option value="pnl">TODAY_PnL (수익순)</option>
            <option value="debt">MAKEUP_DEBT (빚많은순)</option>
            <option value="loyalty">AGENCY_LOYALTY (충성도순)</option>
          </select>
        </div>
      </div>

      <!-- 1-Column Accordion Roster List (Filtered & Sorted, Clean Borderless) -->
      <div class="accordion-card-list" v-if="filteredPartners.length > 0">
        <div v-for="(partner, idx) in filteredPartners" :key="partner.id" class="accordion-card-item"
          :class="{ unfolded: expandedPartnerId === partner.id, blacklisted: partner.isBlacklisted }">

          <!-- Card Header Bar (Click to Fold / Unfold) -->
          <div class="card-header-bar instant-flash-btn" @click="toggleAccordion(partner.id)">
            <span class="card-num">0{{ idx + 1 }} //</span>

            <div class="card-title-group">
              <div class="name-row">
                <h2 class="card-main-title">{{ partner.name }}</h2>
                <span class="tier-tag">{{ getPartnerTierBadge(partner) }}-TIER</span>
              </div>
              <div class="deploy-status-line">
                <span v-if="partner.isBlacklisted" class="status-tag magenta blink-fast">🔴 BLACKLISTED</span>
                <span v-else-if="partner.status === 'GAMBLING'" class="status-tag cyan pulse-neon-cyan">🟢 [GAMBLING @
                  {{ getSectorName(partner.currentLocationId) }}]</span>
                <span v-else-if="partner.status === 'REHAB'" class="status-tag yellow">🔴 [REHAB @ CYBER_CHAMBER]</span>
                <span v-else class="status-tag dim">🟡 [IDLE @ HQ]</span>
              </div>
            </div>

            <div class="card-meta-right">
              <span class="card-ovr-val yellow font-orbitron">{{ partner.ovr || calculatePartnerOvr(partner) }}
                <small>OVR</small></span>
              <span class="card-unfold-icon">{{ expandedPartnerId === partner.id ? '▲' : '▼' }}</span>
            </div>

            <!-- Hover Cut-out Image Lens -->
            <div class="card-hover-lens" :style="{ backgroundImage: `url(${getPartnerImage(partner.id)})` }"></div>
          </div>

          <!-- Unfolded Detail Panel (Borderless Clean Layout) -->
          <div class="card-unfold-content" v-if="expandedPartnerId === partner.id">
            <div class="unfold-inner-body">

              <!-- CCTV Live Feed Watermark Header Decor -->
              <div class="cctv-live-feed-hdr">
                <span class="pulse-neon-cyan">[LIVE_FEED // SUBJECT_SURVEILLANCE: {{ partner.name.toUpperCase()
                  }}]</span>
                <span class="magenta blink-fast">🔴 REC // 98% SIGNAL</span>
              </div>

              <!-- Top Visual Banner (Clean Borderless Visual) -->
              <div class="unfold-visual-banner" :style="{ backgroundImage: `url(${getPartnerImage(partner.id)})` }">
                <div class="banner-gradient"></div>
                <div class="scanline-lens"></div>

                <div class="banner-info">
                  <div class="identity-tag yellow">// SUBJECT_0{{ idx + 1 }} [{{ getPartnerTierBadge(partner) }}-TIER]
                  </div>
                  <h1 class="selected-name-hero">{{ partner.name }}</h1>
                  <p class="banner-desc cyan">PHILOSOPHY: {{ partner.philosophy || 'INDEPENDENT' }}</p>
                </div>

                <!-- Buyout Cash-out Solid Badge -->
                <div class="buyout-solid-badge">
                  <span class="lbl cyan font-orbitron">BUYOUT_VALUE (CASH-OUT)</span>
                  <span class="val yellow glow-yellow font-orbitron">${{
                    calculatePartnerBuyoutValue(partner).toLocaleString() }}</span>
                </div>
              </div>

              <!-- 4-DIMENSIONAL CRT NEON BLOCK BAR STATS -->
              <div class="specs-grid-stats">
                <div class="spec-stat-card">
                  <span class="lbl cyan font-orbitron">SKILL (수익률)</span>
                  <div class="block-visual-row cyan">
                    <span class="block-visual">{{ renderCRTBlockGauge(partner.skillRating || 75) }}</span>
                    <span class="stat-num yellow font-orbitron">{{ partner.skillRating || 75 }}/100</span>
                  </div>
                </div>

                <div class="spec-stat-card">
                  <span class="lbl cyan font-orbitron">GUTS (변동성)</span>
                  <div class="block-visual-row yellow">
                    <span class="block-visual">{{ renderCRTBlockGauge(partner.gutsRating || 80) }}</span>
                    <span class="stat-num yellow font-orbitron">{{ partner.gutsRating || 80 }}/100</span>
                  </div>
                </div>

                <div class="spec-stat-card">
                  <span class="lbl cyan font-orbitron">MENTAL (TILT 방어)</span>
                  <div class="block-visual-row cyan">
                    <span class="block-visual" :class="{ 'overshield-glow': (partner.mentalRating || 70) > 100 }">
                      {{ renderCRTBlockGauge(partner.mentalRating || 70) }}
                    </span>
                    <span class="stat-num yellow font-orbitron">
                      {{ partner.mentalRating || 70 }}/100
                      <small v-if="(partner.mentalRating || 70) > 100" class="shield-tag yellow">🛡️ SHIELD</small>
                    </span>
                  </div>
                </div>

                <div class="spec-stat-card">
                  <span class="lbl magenta font-orbitron">STARDOM (스폰서)</span>
                  <div class="block-visual-row magenta">
                    <span class="block-visual">{{ renderCRTBlockGauge(partner.stardomRating || 60) }}</span>
                    <span class="stat-num yellow font-orbitron">{{ partner.stardomRating || 60 }}/100</span>
                  </div>
                </div>
              </div>

              <!-- Innate Traits & Acquired Careers Matrix -->
              <div class="traits-careers-matrix">
                <div class="matrix-column">
                  <div class="col-hdr cyan font-orbitron">// INNATE_TRAITS</div>
                  <div class="tags-flex-box">
                    <div v-for="t in getPartnerTraitsList(partner)" :key="t.id" class="trait-chip"
                      :class="t.category || 'PERK'">
                      <span class="trait-icon">{{ t.icon || '🧘' }}</span>
                      <span class="trait-name">{{ t.name || t.id }}</span>
                    </div>
                  </div>
                </div>

                <div class="matrix-column">
                  <div class="col-hdr yellow font-orbitron">// ACQUIRED_CAREERS</div>
                  <div class="tags-flex-box">
                    <div v-for="c in getPartnerCareersList(partner)" :key="c.id" class="career-chip">
                      <span class="career-icon">🏆</span>
                      <span class="career-name">{{ c.title || c.name }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Financial Matrix (Bankroll & Debt) -->
              <div class="financial-matrix-grid">
                <div class="matrix-box">
                  <span class="matrix-lbl cyan font-orbitron">PARTNER_BANKROLL (자금)</span>
                  <span class="matrix-val yellow font-orbitron">${{ (partner.bankroll || 0).toLocaleString() }}</span>
                </div>
                <div class="matrix-box">
                  <span class="matrix-lbl cyan font-orbitron">MAKEUP_DEBT (대납 빚)</span>
                  <span class="matrix-val magenta font-orbitron">${{ (partner.makeupDebt || 0).toLocaleString()
                    }}</span>
                </div>
                <div class="matrix-box">
                  <span class="matrix-lbl cyan font-orbitron">AGENCY_LOYALTY</span>
                  <span class="matrix-val cyan font-orbitron">{{ partner.agencyLoyalty || 85 }}%</span>
                </div>
              </div>

              <!-- 4-EXECUTIVE MANAGEMENT ACTIONS -->
              <div class="executive-controls-console">
                <div class="console-sec-title cyan font-orbitron">// EXECUTIVE_MANAGEMENT_ACTIONS</div>

                <div class="controls-buttons-grid">
                  <!-- 1. DEPLOY / RECALL BUTTON -->
                  <button v-if="partner.status === 'GAMBLING'"
                    class="target-lockon-btn magenta-solid font-orbitron instant-flash-btn"
                    @click="handleRecall(partner)">
                    <span class="btn-txt-layer">[ 🚨 EMERGENCY_RECALL ] ➔</span>
                    <div class="btn-image-lens" :style="{ backgroundImage: `url(${getPartnerImage(partner.id)})` }">
                    </div>
                  </button>

                  <button v-else class="target-lockon-btn yellow-solid font-orbitron instant-flash-btn"
                    :disabled="partner.isBlacklisted" @click="handleDeployModal(partner)">
                    <span class="btn-txt-layer" v-if="partner.isBlacklisted">ACCESS_DENIED</span>
                    <span class="btn-txt-layer" v-else>[ ▶ DEPLOY_TO_CASINO ] ➔</span>
                    <div class="btn-image-lens" :style="{ backgroundImage: `url(${getPartnerImage(partner.id)})` }">
                    </div>
                  </button>

                  <!-- 2. DIRECT CAPITAL STAKING BUTTON -->
                  <button class="target-lockon-btn cyan-solid font-orbitron instant-flash-btn"
                    @click="openStakingModal(partner)">
                    <span class="btn-txt-layer">[ 💵 STAKE_CAPITAL ] ➔</span>
                    <div class="btn-image-lens" :style="{ backgroundImage: `url(${getPartnerImage(partner.id)})` }">
                    </div>
                  </button>

                  <!-- 3. BUYOUT CASH-OUT BUTTON -->
                  <button class="target-lockon-btn yellow-solid font-orbitron instant-flash-btn"
                    @click="handleBuyout(partner)">
                    <span class="btn-txt-layer">[ 💰 BUYOUT_CASHOUT ] ➔</span>
                    <div class="btn-image-lens" :style="{ backgroundImage: `url(${getPartnerImage(partner.id)})` }">
                    </div>
                  </button>

                  <!-- 5. TODAY TOP 3 HIGHLIGHTS BUTTON -->
                  <button class="target-lockon-btn yellow-solid font-orbitron instant-flash-btn"
                    @click="openHighlightsModal(partner)">
                    <span class="btn-txt-layer">[ 📺 TODAY_TOP_3_HIGHLIGHTS (3/3) ] ➔</span>
                    <div class="btn-image-lens" :style="{ backgroundImage: `url(${getPartnerImage(partner.id)})` }">
                    </div>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-roster-msg fui-cctv-frame">
        <span class="magenta font-orbitron">// NO_ROSTER_MATCHES_FOUND</span>
        <p class="dim">해당 필터 조건에 부합하는 소속 선수가 없습니다.</p>
      </div>

      <!-- CAPITAL STAKING MODAL POPUP -->
      <div v-if="showStakeModal" class="os-modal-overlay">
        <div class="os-modal-content fui-cctv-frame">
          <div class="modal-hdr yellow font-orbitron">// DIRECT_CAPITAL_STAKING_INJECTION</div>
          <p class="modal-desc">에이전시 자금에서 <b>${{ stakeAmount.toLocaleString() }}</b>를 소속 선수에게 수혈합니다.</p>

          <div class="stake-amount-selector">
            <button class="btn-stake-opt font-orbitron" :class="{ active: stakeAmount === 5000 }"
              @click="stakeAmount = 5000">$5,000</button>
            <button class="btn-stake-opt font-orbitron" :class="{ active: stakeAmount === 20000 }"
              @click="stakeAmount = 20000">$20,000</button>
            <button class="btn-stake-opt font-orbitron" :class="{ active: stakeAmount === 50000 }"
              @click="stakeAmount = 50000">$50,000</button>
          </div>

          <div class="stake-mode-selection">
            <button class="btn-mode-select cyan instant-flash-btn font-orbitron" @click="confirmStaking(false)">
              🎁 [A: 무상 격려금 지원] (충성도 +15)
            </button>
            <button class="btn-mode-select magenta instant-flash-btn font-orbitron" @click="confirmStaking(true)">
              ⛓️ [B: 채무 귀속 대납] (Makeup 빚 +${{ stakeAmount.toLocaleString() }})
            </button>
          </div>

          <button class="btn-modal-close font-orbitron" @click="showStakeModal = false">CLOSE_INTERFACE</button>
        </div>
      </div>

      <!-- HIGHLIGHTS REPLAY MODAL POPUP -->
      <div v-if="showHighlightsModal" class="os-modal-overlay">
        <div class="os-modal-content fui-cctv-frame">
          <div class="modal-hdr yellow font-orbitron">// TODAY_TOP_3_CLEAN_HIGHLIGHTS: {{ activeHighlightPartner?.name.toUpperCase() }}</div>
          
          <div class="highlights-list-group">
            <div v-for="(hl, hIdx) in activeHighlightPartner?.dailyTopHighlights || []" :key="hl.handId" 
              class="highlight-item-box fui-cctv-frame">
              <div class="hl-top">
                <span class="yellow font-orbitron">{{ hl.title }}</span>
                <span class="cyan font-orbitron">+${{ hl.winAmount.toLocaleString() }} CR</span>
              </div>
              <button class="target-lockon-btn yellow-solid font-orbitron instant-flash-btn" @click="playHighlightReplay(hl)">
                <span class="btn-txt-layer">[ 🎬 REPLAY_HAND_0{{ hIdx + 1 }} ] ➔</span>
              </button>
            </div>
          </div>

          <button class="btn-modal-close font-orbitron" @click="showHighlightsModal = false">CLOSE_INTERFACE</button>
        </div>
      </div>

    </div>
  </TerminalLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store } from '../logic/store.js';
import {
  getPartners,
  stakeCapitalToPartner,
  calculatePartnerBuyoutValue,
  cashoutPartnerBuyout,
  recallPartnerFromCasino,
  deployPartnerToCasino,
  launderPartnerBlacklist,
  calculatePartnerOvr,
  renderCRTBlockGauge,
  getPartnerTraitsList,
  getPartnerCareersList,
  getFilteredAndSortedPartners
} from '../logic/partnerSystem.js';
import { CLASSES_PARTNER } from '../logic/persona.js';
import { audioManager } from '../logic/audioManager.js';
import TerminalLayout from './TerminalLayout.vue';

defineEmits(['back']);

const partners = computed(() => getPartners());
const expandedPartnerId = ref(partners.value[0]?.id || 'max');
const activeStakingPartner = ref(null);

const filterStatus = ref('ALL');
const sortBy = ref('ovr');
const showStakeModal = ref(false);
const showHighlightsModal = ref(false);
const activeHighlightPartner = ref(null);
const stakeAmount = ref(5000);

const openHighlightsModal = (partner) => {
  audioManager.playSFX('ui-click');
  activeHighlightPartner.value = partner;
  showHighlightsModal.value = true;
};

const playHighlightReplay = (highlight) => {
  audioManager.playSFX('coin-throw');
  alert(`[REPLAY] ${highlight.title} 리플레이 감상을 시작합니다.`);
  showHighlightsModal.value = false;
};

// Clean Delegated Computed Counters
const deployedCount = computed(() => partners.value.filter(p => p.status === 'GAMBLING').length);
const idleCount = computed(() => partners.value.filter(p => p.status !== 'GAMBLING' && p.status !== 'REHAB' && !p.isBlacklisted).length);
const riskCount = computed(() => partners.value.filter(p => p.status === 'REHAB' || p.isBlacklisted || (p.agencyLoyalty || 100) < 40).length);
const todayTotalPnL = computed(() => partners.value.reduce((acc, p) => acc + (p.sessionNetWorth || 14500), 0));

// Delegated Pure Filter & Sort Helper Call
const filteredPartners = computed(() => getFilteredAndSortedPartners(partners.value, filterStatus.value, sortBy.value));

const toggleAccordion = (id) => {
  audioManager.playSFX('ui-click');
  expandedPartnerId.value = expandedPartnerId.value === id ? null : id;
};

const getPartnerTierBadge = (partner) => partner.tierBadge || 'A';

const getPartnerImage = (partnerId) => {
  const p = CLASSES_PARTNER.find(c => c.id === partnerId);
  return p?.imgSrc || '';
};

const getSectorName = (locationId) => {
  if (!locationId) return 'UNKNOWN_CASINO';
  if (locationId.includes('warehouse')) return '뒷골목 창고';
  if (locationId.includes('club')) return 'H.B.D 클럽 VIP';
  if (locationId.includes('holdem')) return '홀덤 하우스';
  return locationId.toUpperCase();
};

// 1-Click UI Actions
const handleRecall = (partner) => {
  audioManager.playSFX('ui-click');
  recallPartnerFromCasino(partner.id);
};

const handleDeployModal = (partner) => {
  audioManager.playSFX('chip-ship-it');
  deployPartnerToCasino(partner.id, 'micro_warehouse');
};

const openStakingModal = (partner) => {
  audioManager.playSFX('ui-click');
  activeStakingPartner.value = partner;
  showStakeModal.value = true;
};

const confirmStaking = (isLoan) => {
  if (!activeStakingPartner.value) return;
  audioManager.playSFX('coin-throw');
  stakeCapitalToPartner(activeStakingPartner.value.id, stakeAmount.value, isLoan);
  showStakeModal.value = false;
};

const handleBuyout = (partner) => {
  if (confirm(`[BUYOUT CASH-OUT] ${partner.name} 선수를 경쟁 에이전시에 이적 매각하시겠습니까?\n매각 대금: $${calculatePartnerBuyoutValue(partner).toLocaleString()}`)) {
    audioManager.playSFX('coin-throw');
    cashoutPartnerBuyout(partner.id);
  }
};

const handleLaunder = (partner) => {
  audioManager.playSFX('coin-throw');
  launderPartnerBlacklist(partner.id, 15000);
};
</script>

<style scoped>
@import '../assets/fonts/pretendard-std.css';
@import '../assets/css/theme-os.css';

.cyan {
  color: var(--neon-cyan) !important;
}
.yellow {
  color: var(--neon-yellow) !important;
}
.magenta {
  color: var(--neon-magenta) !important;
}
.dim {
  color: #506070;
}

.partner-net-viewport {
  padding: 1.5rem 4rem;
  max-width: 1300px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.title-block {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
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

.hero-title {
  font-family: var(--font-ui-english);
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 900;
  margin: 0;
  color: #ffffff;
  letter-spacing: -0.02em;
}

.fui-symbol-string {
  font-family: var(--font-code-mono);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.15em;
  margin-top: 0.2rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.sub-syslog {
  font-family: var(--font-ui-english);
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  margin-top: 0.4rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* ROSTER QUICK FILTER & SMART SORTING CONTROLLER BAR */
.roster-filter-sort-bar {
  font-family: var(--font-ui-english);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(8, 12, 16, 0.95);
  border-bottom: 1px solid rgba(0, 240, 255, 0.2);
  padding: 0.8rem 0rem;
  margin-bottom: 1.8rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-tabs-group {
  display: flex;
  gap: 0.6rem;
}

.btn-filter-tab {
  font-family: var(--font-ui-english);
  background: transparent;
  border: none;
  color: #8090a0;
  padding: 0.45rem 0.9rem;
  font-size: 0.78rem;
  font-weight: 900;
  cursor: pointer;
  border-radius: 0px;
  transition: all 0.2s ease;
}

.btn-filter-tab.active {
  background: var(--neon-cyan);
  color: #000000 !important;
}

.btn-filter-tab.yellow.active {
  background: var(--neon-yellow);
  color: #000000 !important;
}

.btn-filter-tab.magenta.active {
  background: var(--neon-magenta);
  color: #ffffff !important;
}

.sorting-selector-group {
  font-family: var(--font-ui-english);
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.sort-lbl {
  font-family: var(--font-ui-english);
  font-size: 0.78rem;
  font-weight: 900;
}

.os-select-sort {
  font-family: var(--font-ui-english);
  background: #000000;
  border: 1px solid var(--neon-cyan);
  color: var(--neon-yellow);
  padding: 0.4rem 0.8rem;
  font-size: 0.78rem;
  font-weight: 900;
  outline: none;
  cursor: pointer;
  border-radius: 0px;
}

/* 1-Column Accordion Card List */
.accordion-card-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.accordion-card-item {
  background: rgba(8, 12, 16, 0.9);
  transition: all 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
  overflow: hidden;
}

.card-header-bar {
  position: relative;
  display: flex;
  align-items: center;
  padding: 1.4rem 2.2rem;
  cursor: pointer;
  overflow: hidden;
}

.card-num {
  font-family: 'Orbitron', monospace !important;
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

.name-row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.card-main-title {
  font-family: 'Orbitron', monospace, sans-serif !important;
  font-size: clamp(1.6rem, 3vw, 2.5rem);
  font-weight: 900;
  margin: 0;
  letter-spacing: 0.02em;
  color: #ffffff;
  transition: color 0.25s;
}

.tier-tag {
  font-family: 'Orbitron', monospace, sans-serif !important;
  font-size: 0.78rem;
  font-weight: 900;
  border: 1px solid var(--neon-yellow);
  color: var(--neon-yellow);
  padding: 0.1rem 0.4rem;
}

.deploy-status-line {
  font-family: 'Pretendard Std', -apple-system, sans-serif !important;
  font-size: 0.8rem;
  margin-top: 0.2rem;
  letter-spacing: 0.08em;
}

.card-meta-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  z-index: 2;
}

.card-ovr-val {
  font-family: 'Orbitron', monospace, sans-serif !important;
  font-size: 1.4rem;
  font-weight: 900;
}

.card-ovr-val small {
  font-size: 0.75rem;
  margin-left: 0.2rem;
}

.card-unfold-icon {
  font-family: 'Orbitron', monospace !important;
  font-size: 1.2rem;
  color: #405060;
  transition: color 0.25s;
}

/* Mobile-First Image Lens (Visible by default, active touch flash) */
.card-hover-lens {
  position: absolute;
  right: -20px;
  top: 0;
  width: 160px;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0.3;
  transform: skewX(-20deg);
  transition: all 0.2s ease;
  z-index: 1;
  filter: contrast(1.2) brightness(0.8);
  pointer-events: none;
}

/* Touch Active State (Instant Flash & Micro Press) */
.card-header-bar:active .card-hover-lens,
.target-lockon-btn:active .btn-image-lens {
  opacity: 0.85;
  right: 0;
}

.target-lockon-btn:active:not(:disabled) {
  transform: scale(0.97) !important;
  background: #ffffff !important;
  color: #000000 !important;
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.95) !important;
}

/* Desktop Mouse Hover Only (Wrapped in @media hover) */
@media (hover: hover) and (pointer: fine) {
  .card-header-bar:hover .card-hover-lens {
    opacity: 0.6;
    right: 0;
  }

  .accordion-card-item:not(.unfolded) .card-header-bar:hover {
    background: var(--neon-cyan);
  }

  .accordion-card-item:not(.unfolded) .card-header-bar:hover .card-num {
    color: var(--neon-magenta);
  }
  .accordion-card-item:not(.unfolded) .card-header-bar:hover .card-main-title,
  .accordion-card-item:not(.unfolded) .card-header-bar:hover .card-ovr-val {
    color: #000000 !important;
  }

  .target-lockon-btn:hover:not(:disabled) {
    background: #ffffff !important;
    color: #000000 !important;
    box-shadow: 0 0 40px rgba(255, 255, 255, 0.85) !important;
  }

  .target-lockon-btn:hover:not(:disabled) .btn-image-lens {
    opacity: 0.85;
    right: 0;
  }
}

.accordion-card-item.unfolded .card-header-bar {
  background: var(--neon-yellow);
  color: #000000;
}

.accordion-card-item.unfolded .card-num,
.accordion-card-item.unfolded .card-main-title,
.accordion-card-item.unfolded .tier-tag,
.accordion-card-item.unfolded .card-ovr-val,
.accordion-card-item.unfolded .card-unfold-icon {
  color: #000000 !important;
}

.accordion-card-item:not(.unfolded) .card-header-bar:hover {
  background: var(--neon-cyan);
}

.accordion-card-item:not(.unfolded) .card-header-bar:hover .card-num {
  color: var(--neon-magenta);
}
.accordion-card-item:not(.unfolded) .card-header-bar:hover .card-main-title,
.accordion-card-item:not(.unfolded) .card-header-bar:hover .card-ovr-val {
  color: #000000 !important;
}

.card-unfold-content {
  background: #020406;
  border-top: 2px solid var(--neon-yellow);
  padding: 1.8rem 2.2rem;
  animation: unfoldDown 0.3s ease-out forwards;
}

.unfold-inner-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cctv-live-feed-hdr {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 900;
  padding: 0.4rem 0.8rem;
  background: rgba(0, 240, 255, 0.08);
}

.unfold-visual-banner {
  position: relative;
  height: 220px;
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 1.5rem;
  box-sizing: border-box;
  filter: contrast(1.2);
}

.banner-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%);
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

.identity-tag {
  font-size: 0.8rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.selected-name-hero {
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 900;
  margin: 0.2rem 0;
  color: #ffffff;
  letter-spacing: 0.02em;
}

.banner-desc {
  font-size: 0.85rem;
  font-weight: 800;
  margin: 0;
}

.buyout-solid-badge {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: #000000;
  padding: 0.6rem 1.2rem;
  border-left: 2px solid var(--neon-yellow);
}

.buyout-solid-badge .lbl {
  font-size: 0.7rem;
  font-weight: 900;
}
.buyout-solid-badge .val {
  font-size: 1.6rem;
  font-weight: 900;
}

.specs-grid-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.spec-stat-card {
  display: flex;
  flex-direction: column;
  background: #000000;
  padding: 1rem 1.2rem;
  gap: 0.4rem;
}

.spec-stat-card .lbl {
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.05em;
}

.block-visual-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.block-visual {
  font-size: 1.1rem;
  letter-spacing: 0.12em;
  font-family: monospace;
}

.overshield-glow {
  text-shadow: 0 0 10px var(--neon-yellow);
}
.shield-tag {
  font-size: 0.7rem;
  margin-left: 0.4rem;
}
.stat-num {
  font-size: 1.1rem;
  font-weight: 900;
}

.traits-careers-matrix {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.matrix-column {
  background: #000000;
  padding: 1rem 1.2rem;
}

.col-hdr {
  font-size: 0.78rem;
  font-weight: 900;
  margin-bottom: 0.6rem;
}

.tags-flex-box {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.trait-chip,
.career-chip {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #080c10;
  padding: 0.35rem 0.8rem;
  font-size: 0.8rem;
  font-weight: 900;
  color: #ffffff;
}

.financial-matrix-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.matrix-box {
  display: flex;
  flex-direction: column;
  background: #000000;
  padding: 1rem 1.2rem;
}

.matrix-lbl {
  font-size: 0.72rem;
  font-weight: 900;
}
.matrix-val {
  font-size: 1.4rem;
  font-weight: 900;
  margin-top: 0.3rem;
}

.executive-controls-console {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
}

.console-sec-title {
  font-size: 0.82rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.controls-buttons-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

.target-lockon-btn {
  position: relative;
  background: var(--neon-yellow);
  border: none;
  color: #000000;
  padding: 1.1rem 1.6rem;
  font-family: inherit;
  font-weight: 900;
  font-size: 1rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0px;
  transition: all 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.target-lockon-btn.cyan-solid {
  background: var(--neon-cyan);
}
.target-lockon-btn.magenta-solid {
  background: var(--neon-magenta);
  color: #ffffff;
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
  background: #ffffff !important;
  color: #000000 !important;
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.85) !important;
}

.target-lockon-btn:hover:not(:disabled) .btn-image-lens {
  opacity: 0.85;
  right: 0;
}

.target-lockon-btn:disabled {
  background: #151b22 !important;
  color: #405060 !important;
  cursor: not-allowed;
}

.empty-roster-msg {
  padding: 3rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

.os-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.os-modal-content {
  width: 520px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  background: #000000;
  border: 2px solid var(--neon-yellow);
}

.modal-hdr {
  font-size: 1.2rem;
  font-weight: 900;
}
.modal-desc {
  font-size: 0.9rem;
  color: #ffffff;
}

.stake-amount-selector {
  display: flex;
  gap: 0.8rem;
}

.btn-stake-opt {
  flex: 1;
  background: transparent;
  border: 1px solid rgba(0, 240, 255, 0.4);
  color: #ffffff;
  padding: 0.6rem;
  font-weight: 900;
  cursor: pointer;
}

.btn-stake-opt.active {
  background: var(--neon-yellow);
  color: #000000;
  border-color: var(--neon-yellow);
}

.stake-mode-selection {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.btn-mode-select {
  padding: 0.8rem;
  font-weight: 900;
  font-family: inherit;
  background: transparent;
  cursor: pointer;
}

.btn-mode-select.cyan {
  border: 1px solid var(--neon-cyan);
  color: var(--neon-cyan);
}
.btn-mode-select.magenta {
  border: 1px solid var(--neon-magenta);
  color: var(--neon-magenta);
}

.btn-modal-close {
  background: #202530;
  border: none;
  color: #ffffff;
  padding: 0.5rem;
  font-weight: 900;
  cursor: pointer;
}

@media (max-width: 900px) {
  .partner-net-viewport {
    padding: 1rem;
  }
  .specs-grid-stats {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 0.6rem;
  }
  .controls-buttons-grid {
    grid-template-columns: 1fr !important;
  }
  .financial-matrix-grid {
    grid-template-columns: 1fr !important;
  }
  .traits-careers-matrix {
    grid-template-columns: 1fr !important;
  }
  .roster-filter-sort-bar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
