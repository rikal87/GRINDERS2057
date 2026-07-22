<template>
  <TerminalLayout :show-back="true" @back="$emit('back')">
    <div class="page-main-accordion">
      
      <!-- Top Title Header with Watermark Style -->
      <div class="title-section">
        <div class="title-watermark">NEXUS</div>
        <h1 class="page-title">SECTOR_AI_NEXUS<span class="yellow-dot">.</span></h1>
        <div class="sub-log cyan">// FOCUSED_AI_AGENT_CATALOG_&_TIER_MONITOR</div>
      </div>

      <!-- 1-Column Accordion Card List -->
      <div class="accordion-card-list">
        <div v-for="(agentItem, aIdx) in agentList" :key="agentItem.id" 
          class="accordion-card-item" :class="{ unfolded: expandedAgentId === agentItem.id }">
          
          <!-- Card Header Bar (Yellow Active Block Header) -->
          <div class="card-header-bar" @click="toggleAgent(agentItem.id)">
            <span class="card-num">0{{ aIdx + 1 }} //</span>
            <div class="card-title-group">
              <h2 class="card-main-title font-orbitron">{{ agentItem.id }}</h2>
              <span class="card-zone-sub cyan font-orbitron">{{ getAgentSlogan(agentItem.data) }}</span>
            </div>
            <div class="card-meta-right">
              <span class="card-stake-tag yellow font-orbitron" v-if="currentAgent?.name === agentItem.id">DELEGATED ✓</span>
              <span class="card-stake-tag cyan font-orbitron" v-else>TIER_0{{ getTierIndex(agentItem.id) + 1 }}</span>
              <span class="card-unfold-icon">{{ expandedAgentId === agentItem.id ? '▲' : '▼' }}</span>
            </div>
          </div>

          <!-- Unfolded Detail Content Panel -->
          <div class="card-unfold-content" v-if="expandedAgentId === agentItem.id">
            <div class="unfold-inner-body">
              
              <!-- Slim Banner Bar -->
              <div class="unfold-visual-banner">
                <div class="banner-info">
                  <span v-if="currentAgent?.name === agentItem.id" class="status-tag yellow font-orbitron">PRIMARY_DELEGATED // ACTIVE</span>
                  <span v-else class="status-tag cyan font-orbitron">STANDBY_UNIT // READY</span>
                  <p class="banner-desc">{{ agentItem.data.key_features || agentItem.data.slogan }}</p>
                </div>

                <!-- High Visibility Solid Action Button -->
                <button class="btn-delegate-agent solid-action-btn font-orbitron" 
                  v-if="currentAgent?.name !== agentItem.id" 
                  @click="switchCurrentAgent(agentItem.id)">
                  <span class="btn-lockon-bracket">[</span>
                  DELEGATE_PRIMARY_AGENT
                  <span class="btn-lockon-bracket">]</span> ➔
                </button>
                <div class="delegated-indicator yellow font-orbitron" v-else>PRIMARY_AGENT_DELEGATED ✓</div>
              </div>

              <!-- Clean Tier Monitor Section -->
              <div class="specs-section-hdr cyan font-orbitron">
                // TIER_SPECIFICATIONS [CURRENT: TIER_0{{ getTierIndex(agentItem.id) + 1 }}]
              </div>

              <div class="tier-cards-row">
                <!-- 1. CURRENT EQUIPPED TIER SPEC CARD -->
                <div class="tier-spec-card current-active">
                  <div class="spec-card-top">
                    <span class="lbl-mini yellow font-orbitron">CURRENT // TIER_0{{ getTierIndex(agentItem.id) + 1 }}</span>
                    <span class="val-mini yellow font-orbitron">EQUIPPED ✓</span>
                  </div>

                  <div class="spec-card-body">
                    <div class="spec-row-block">
                      <span class="micro-lbl cyan font-orbitron">SLOT_DECK</span>
                      <span class="hero-val yellow font-orbitron">{{ getCurrentPlan(agentItem).slot ? getCurrentPlan(agentItem).slot.join(' + ') : 'T1' }}</span>
                    </div>
                    
                    <div class="spec-row-block">
                      <span class="micro-lbl cyan font-orbitron">MAX_LT_CAPACITY</span>
                      <span class="hero-val white font-orbitron">{{ getCurrentPlan(agentItem).maxLt || 100 }} <span class="unit-txt font-orbitron">LT</span></span>
                    </div>

                    <!-- High-Contrast Neural Buff Badges -->
                    <div class="buff-tags-row" v-if="getSpecialBuffs(getCurrentPlan(agentItem)).length > 0">
                      <span v-for="(bTxt, bIdx) in getSpecialBuffs(getCurrentPlan(agentItem))" :key="bIdx" class="slim-buff-badge yellow font-orbitron">
                        {{ bTxt }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 2. NEXT UPGRADE TIER SPEC CARD -->
                <div class="tier-spec-card next-upgrade" v-if="getNextPlan(agentItem)">
                  <div class="spec-card-top">
                    <span class="lbl-mini cyan font-orbitron">NEXT // TIER_0{{ getTierIndex(agentItem.id) + 2 }}</span>
                    <span class="val-mini cyan font-orbitron">TARGET_SPECS</span>
                  </div>

                  <div class="spec-card-body">
                    <div class="spec-row-block">
                      <span class="micro-lbl cyan font-orbitron">SLOT_DECK</span>
                      <span class="hero-val yellow font-orbitron">{{ getNextPlan(agentItem).slot ? getNextPlan(agentItem).slot.join(' + ') : 'T1' }}</span>
                    </div>
                    
                    <div class="spec-row-block">
                      <span class="micro-lbl cyan font-orbitron">MAX_LT_CAPACITY</span>
                      <span class="hero-val white font-orbitron">{{ getNextPlan(agentItem).maxLt || 200 }} <span class="unit-txt font-orbitron">LT</span></span>
                    </div>

                    <!-- High-Contrast Neural Buff Badges -->
                    <div class="buff-tags-row" v-if="getSpecialBuffs(getNextPlan(agentItem)).length > 0">
                      <span v-for="(bTxt, bIdx) in getSpecialBuffs(getNextPlan(agentItem))" :key="bIdx" class="slim-buff-badge cyan font-orbitron">
                        {{ bTxt }}
                      </span>
                    </div>
                  </div>

                  <!-- High Visibility Skewed Solid Action Bar -->
                  <div class="tier-action-bar">
                    <div class="price-block">
                      <span class="micro-lbl cyan font-orbitron">REQUIRED_COST</span>
                      <span class="price-hero yellow font-orbitron">{{ getPlanCost(getNextPlan(agentItem)).toLocaleString() }} <span class="unit-txt font-orbitron">CR</span></span>
                    </div>
                    
                    <button class="btn-initiate-link target-lockon-btn solid-upgrade-btn font-orbitron" 
                      :disabled="store.bankroll < getPlanCost(getNextPlan(agentItem))" 
                      @click="upgradeTier(agentItem.id, getTierIndex(agentItem.id) + 1, getPlanCost(getNextPlan(agentItem)))">
                      <span class="btn-txt-layer">
                        <span class="btn-lockon-bracket">[</span> UPGRADE_TIER <span class="btn-lockon-bracket">]</span> ➔
                      </span>
                    </button>
                  </div>
                </div>

                <!-- Max Tier Reached Banner -->
                <div class="max-tier-box" v-else>
                  <h3 class="yellow font-orbitron">MAX_TIER_ACHIEVED</h3>
                  <p class="cyan">Agent is operating at maximum tier performance capability.</p>
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
import { store, getAgent } from '../logic/store';
import { AI_AGENT_MODEL_AND_PLAN_DATA } from '../logic/aiAgentModelClasses';
import { audioManager } from '../logic/audioManager';
import TerminalLayout from './TerminalLayout.vue';

defineEmits(['back']);

const expandedAgentId = ref('VANGUARD');

const currentAgent = computed(() => getAgent());

const agentList = computed(() => {
  return Object.keys(AI_AGENT_MODEL_AND_PLAN_DATA).map(id => ({
    id,
    data: AI_AGENT_MODEL_AND_PLAN_DATA[id]
  }));
});

const getTierIndex = (agentId) => {
  return store.aiAgentTiers[agentId] || 0;
};

const getAgentSlogan = (agentData) => {
  if (!agentData || !agentData.slogan) return 'CYBERNETIC_AGENT_UNIT';
  return agentData.slogan.replace(/\n/g, ' ');
};

const getPlanCost = (plan) => {
  if (!plan) return 0;
  if (typeof plan.cost !== 'undefined') return plan.cost;
  if (typeof plan.price !== 'undefined') return plan.price;
  return 0;
};

const getSpecialBuffs = (plan) => {
  if (!plan) return [];
  const list = [];
  if (typeof plan.probability_bonus === 'number') {
    list.push(`+${(plan.probability_bonus * 100).toFixed(1)}% SUCCESS`);
  }
  if (typeof plan.cooldown_bonus === 'number') {
    list.push(`-${(plan.cooldown_bonus * 100).toFixed(0)}% COOLDOWN`);
  }
  if (typeof plan.duration_bonus === 'number') {
    list.push(`+${(plan.duration_bonus * 100).toFixed(0)}% DURATION`);
  }
  if (typeof plan.lt_regen_bonus_rate === 'number') {
    list.push(`+${(plan.lt_regen_bonus_rate * 100).toFixed(0)}% REGEN_SPEED`);
  }
  return list;
};

const getCurrentPlan = (agentItem) => {
  const currentIdx = getTierIndex(agentItem.id);
  return agentItem.data.price_plan[currentIdx] || agentItem.data.price_plan[0];
};

const getNextPlan = (agentItem) => {
  const nextIdx = getTierIndex(agentItem.id) + 1;
  return agentItem.data.price_plan[nextIdx] || null;
};

const toggleAgent = (agentId) => {
  audioManager.playSFX('ui-click');
  if (expandedAgentId.value === agentId) {
    expandedAgentId.value = null;
  } else {
    expandedAgentId.value = agentId;
  }
};

const switchCurrentAgent = (agentId) => {
  store.selectedClass = agentId;
  audioManager.playSFX('install');
};

const upgradeTier = (agentId, tierIdx, cost) => {
  if (store.bankroll >= cost) {
    store.bankroll -= cost;
    store.aiAgentTiers[agentId] = tierIdx;
    audioManager.playSFX('reward');
  } else {
    audioManager.playSFX('error');
  }
};
</script>

<style scoped>
@import '../assets/fonts/pretendard-std.css';
@import '../assets/css/theme-os.css';

/* Font Utility */
.font-orbitron {
  font-family: 'Orbitron', 'Pretendard Std', sans-serif !important;
}

/* Colors */
.cyan { color: var(--neon-cyan) !important; }
.yellow { color: var(--neon-yellow) !important; }
.magenta { color: var(--neon-magenta) !important; }
.white { color: #ffffff !important; }

/* Main Accordion Layout */
.page-main-accordion {
  padding: 1.5rem 4rem;
  max-width: 1300px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

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
  font-family: 'Orbitron', sans-serif;
}

.page-title {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: #ffffff;
  font-family: 'Orbitron', sans-serif;
}

.yellow-dot { color: var(--neon-yellow); }

.sub-log {
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  margin-top: 0.4rem;
  font-family: 'Orbitron', sans-serif;
}

.accordion-card-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
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
  user-select: none;
}

.card-num {
  font-size: 1.8rem;
  font-weight: 900;
  color: #405060;
  width: 80px;
  transition: color 0.25s;
  font-family: 'Orbitron', sans-serif;
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

.accordion-card-item:not(.unfolded) .card-header-bar:hover .card-num { color: var(--neon-magenta); }
.accordion-card-item:not(.unfolded) .card-header-bar:hover .card-main-title { color: #000000; }
.accordion-card-item:not(.unfolded) .card-header-bar:hover .card-zone-sub { color: #111111; font-weight: bold; }
.accordion-card-item:not(.unfolded) .card-header-bar:hover .card-stake-tag { color: #000000; }

/* Unfolded Body Area */
.card-unfold-content {
  background: rgba(4, 6, 8, 0.95);
  border-top: 1px solid var(--neon-yellow);
  padding: 1.8rem 2.2rem;
}

.unfold-inner-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.unfold-visual-banner {
  position: relative;
  background: #000000;
  border: 1px solid rgba(0, 240, 255, 0.15);
  padding: 1.2rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.banner-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.status-tag {
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.banner-desc {
  font-size: 0.95rem;
  color: #c0d4e8;
  margin: 0;
  line-height: 1.4;
}

/* High Visibility Solid Action Button */
.btn-delegate-agent {
  background: var(--neon-cyan);
  border: 1px solid var(--neon-cyan);
  color: #000000 !important;
  padding: 0.9rem 1.8rem;
  font-family: 'Orbitron', sans-serif !important;
  font-weight: 900;
  font-size: 0.88rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  border-radius: 0px;
  white-space: nowrap;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
  transition: all 0.2s ease;
}

.btn-delegate-agent:hover {
  background: #ffffff;
  border-color: #ffffff;
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.6);
  transform: translateY(-2px);
}

.btn-lockon-bracket {
  color: #000000;
  font-weight: 900;
  margin: 0 0.15rem;
}

.delegated-indicator {
  font-size: 0.9rem;
  font-weight: 900;
  letter-spacing: 0.05em;
}

.specs-section-hdr {
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.tier-cards-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 1.6rem;
}

.tier-spec-card {
  background: #000000;
  border: 1px solid rgba(0, 240, 255, 0.15);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.tier-spec-card.current-active {
  border-color: var(--neon-yellow);
}

.tier-spec-card.next-upgrade {
  border-color: var(--neon-cyan);
}

.spec-card-top {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1.2rem;
  background: rgba(0, 0, 0, 0.6);
  border-bottom: 1px solid rgba(0, 240, 255, 0.12);
}

.lbl-mini { font-size: 0.78rem; font-weight: 900; letter-spacing: 0.05em; }
.val-mini { font-size: 0.78rem; font-weight: 900; letter-spacing: 0.05em; }

.spec-card-body {
  padding: 1.4rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.spec-row-block {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.micro-lbl {
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  color: #60758a;
  text-transform: uppercase;
}

.hero-val {
  font-size: 1.35rem;
  font-weight: 900;
  letter-spacing: -0.01em;
  line-height: 1.1;
}

.unit-txt {
  font-size: 0.85rem;
  font-weight: 900;
  margin-left: 0.2rem;
  color: #8095aa;
}

.buff-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.2rem;
}

.slim-buff-badge {
  font-size: 0.82rem;
  font-weight: 900;
  padding: 0.35rem 0.7rem;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid currentColor;
  letter-spacing: 0.03em;
}

.tier-action-bar {
  padding: 1rem 1.4rem;
  background: rgba(0, 0, 0, 0.6);
  border-top: 1px solid rgba(0, 240, 255, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-block {
  display: flex;
  flex-direction: column;
}

.price-hero {
  font-size: 1.3rem;
  font-weight: 900;
  letter-spacing: 0.02em;
}

/* High Visibility Skewed Solid Upgrade Button */
.btn-initiate-link {
  position: relative;
  background: var(--neon-yellow);
  border: 1px solid var(--neon-yellow);
  color: #000000 !important;
  padding: 0.9rem 1.8rem;
  font-family: 'Orbitron', sans-serif !important;
  font-weight: 900;
  font-size: 0.88rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  transform: skewX(-20deg);
  border-radius: 0px;
  box-shadow: 0 0 15px rgba(204, 255, 0, 0.35);
  transition: all 0.2s ease;
}

.btn-initiate-link:hover:not(:disabled) {
  background: #ffffff;
  border-color: #ffffff;
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.6);
  transform: skewX(-20deg) translateY(-2px);
}

.btn-initiate-link:disabled {
  background: #1a222a;
  border-color: #1a222a;
  color: #405060 !important;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-txt-layer {
  display: inline-block;
  transform: skewX(20deg);
}

.max-tier-box {
  background: #000000;
  border: 1px solid var(--neon-yellow);
  padding: 2rem;
  text-align: center;
}
</style>
