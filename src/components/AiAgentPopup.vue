<template>
  <transition name="v4-fade">
    <div v-if="show" class="v5-modal-overlay">
      <div class="v5-modal agent-selector">
        <h2 class="glitch-text">AI AGENT</h2>
        <div class="modal-content-scroll">
          <div class="agent-browser">
            <button class="nav-btn prev" @click="prevAgent" :disabled="currentModelIdx === 0">&lt;</button>

            <div class="agent-display">
              <div class="agent-header">
                <span class="id-tag">MODEL_ID: {{ selectedModelId }}</span>
                <h3 class="name">{{ selectedModelId }}</h3>
                <div v-if="isModelLocked" class="level-lock-info">
                  <span class="lock-icon">🔒</span>
                  <span class="lock-text">LEVEL {{ getRequiredLevel(selectedModelId) }} REQUIRED</span>
                </div>
              </div>
              <div class="agent-info" :class="{ 'is-locked': isModelLocked }">
                <p class="slogan">"{{ AI_AGENT_MODEL_AND_PLAN_DATA[selectedModelId]?.slogan }}"</p>
                <div class="features-box">
                  <div class="label">KEY_CAPABILITIES</div>
                  <ul v-if="!isModelLocked" class="features">
                    <li>{{ AI_AGENT_MODEL_AND_PLAN_DATA[selectedModelId]?.key_features }}</li>
                  </ul>
                  <div v-else class="locked-placeholder">
                    [ DATA ENCRYPTED - INSUFFICIENT CLEARANCE ]
                  </div>
                </div>
              </div>
            </div>
            <button class="nav-btn next" @click="nextAgent"
              :disabled="currentModelIdx === availableModelIds.length - 1">&gt;</button>
          </div>

          <div v-if="selectedModelId && !isModelLocked" class="comparison-view">
            <!-- CURRENT RANK -->
            <div class="tier-column current" :class="{ 'not-owned': !currentTierPlan }">
              <div class="v4-label">CURRENT</div>
              <div class="rank-card" v-if="currentTierPlan">
                <div class="rank-header">
                  <span class="level">{{ maxTierReached === 0 ? 'BASIC' : 'TIER ' + maxTierReached }}</span>
                </div>
                <div class="rank-stats">
                  <div class="stat-item">
                    <span class="label">CAPACITY:</span>
                    <span class="value cyan">{{ currentTierPlan.maxLt.toLocaleString() }} LT</span>
                  </div>
                  <div class="stat-item">
                    <span class="label">SLOTS:</span>
                    <div class="slots-list">
                      <span v-for="(slot, idx) in currentTierPlan.slot" :key="idx" :class="slot">[{{ slot }}]</span>
                    </div>
                  </div>
                  <div class="extra-bonuses" v-if="hasAnyBonus(currentTierPlan)">
                    <span v-if="currentTierPlan.cooldown_bonus" class="bonus magenta">COOLDOWN +{{
                      (currentTierPlan.cooldown_bonus * 100).toFixed(0) }}%</span>
                    <span v-if="currentTierPlan.duration_bonus" class="bonus yellow">DURATION +{{
                      (currentTierPlan.duration_bonus * 100).toFixed(0) }}%</span>
                    <span v-if="currentTierPlan.probability_bonus" class="bonus green">PROB +{{
                      (currentTierPlan.probability_bonus * 100).toFixed(0) }}%</span>
                    <span v-if="currentTierPlan.lt_regen_bonus_rate" class="bonus cyan">REGEN {{
                      currentTierPlan.lt_regen_bonus_rate }}x</span>
                  </div>
                </div>
              </div>
              <div class="rank-card empty" v-else>
                <div class="empty-text">NOT_OWNED</div>
              </div>
            </div>
            <!-- TRANSITION INDICATOR -->
            <div class="tier-separator" v-if="nextTierPlan">
              <div class="arrow">>></div>
            </div>
            <!-- NEXT RANK -->
            <div class="tier-column next" v-if="nextTierPlan">
              <div class="v4-label">UPGRADE</div>
              <div class="rank-card upgrade">
                <div class="rank-header">
                  <span class="level">TIER {{ maxTierReached + 1 }}</span>
                  <span class="cost" v-if="nextTierPlan.cost > 0">{{ nextTierPlan.cost.toLocaleString() }} CR</span>
                </div>
                <div class="rank-stats">
                  <div class="stat-item">
                    <span class="label">CAPACITY:</span>
                    <span class="value cyan">{{ nextTierPlan.maxLt.toLocaleString() }} LT</span>
                  </div>
                  <div class="stat-item">
                    <span class="label">SLOTS:</span>
                    <div class="slots-list">
                      <span v-for="(slot, idx) in nextTierPlan.slot" :key="idx" :class="slot">[{{ slot }}]</span>
                    </div>
                  </div>
                  <div class="extra-bonuses" v-if="hasAnyBonus(nextTierPlan)">
                    <span v-if="nextTierPlan.cooldown_bonus" class="bonus magenta">COOLDOWN +{{
                      (nextTierPlan.cooldown_bonus * 100).toFixed(0) }}%</span>
                    <span v-if="nextTierPlan.duration_bonus" class="bonus yellow">DURATION +{{
                      (nextTierPlan.duration_bonus * 100).toFixed(0) }}%</span>
                    <span v-if="nextTierPlan.probability_bonus" class="bonus green">PROB +{{
                      (nextTierPlan.probability_bonus * 100).toFixed(0) }}%</span>
                    <span v-if="nextTierPlan.lt_regen_bonus_rate" class="bonus cyan">REGEN {{
                      nextTierPlan.lt_regen_bonus_rate }}x</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-accept" :disabled="!canInstall" @click="handleInstall">
            <span v-if="isCurrentModelActive">CURRENT</span>
            <span v-else-if="maxTierReached >= 0">ACTIVATE</span>
            <span v-else>NOT PURCHASED</span>
          </button>
          <button class="btn-upgrade" :disabled="!canUpgrade" @click="handleUpgrade" v-if="nextTierPlan">
            {{ maxTierReached === -1 ? 'INITIAL_BUY' : 'UPGRADE' }}
          </button>
          <button class="btn-upgrade" disabled v-else>
            MAXIMUM TIER
          </button>
          <button class="btn-cancel" @click="$emit('close')">CLOSE</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { store, gainBankroll } from '../logic/store';
import { AI_AGENT_MODEL_AND_PLAN_DATA } from '../logic/aiAgentModelClasses';
import { validateTaskSlots } from '../logic/aiAgentTaskSystem';
import { audioManager } from '../logic/audioManager';
import { TYPE_CHANGE_BANKROLL } from '../logic/constants.js'
const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close']);

const selectedModelId = ref(store.aiAgent?.name || 'VANGUARD');
const selectedPlanIdx = ref(store.aiAgent?.price_plan_idx || 0);

watch(() => props.show, (newVal) => {
  if (newVal) {
    selectedModelId.value = store.aiAgent?.name || 'VANGUARD';
    selectedPlanIdx.value = store.aiAgent?.price_plan_idx || 0;
  }
});

const availableModelIds = computed(() => Object.keys(AI_AGENT_MODEL_AND_PLAN_DATA));
const currentModelIdx = computed(() => availableModelIds.value.indexOf(selectedModelId.value));

const getRequiredLevel = (modelId) => {
  const allIds = Object.keys(AI_AGENT_MODEL_AND_PLAN_DATA);
  const idx = allIds.indexOf(modelId);
  if (idx <= 0) return 1;
  return 1 + (idx * 2);
};

const isModelLocked = computed(() => {
  // Current agent is never locked
  if (store.aiAgent?.name === selectedModelId.value) return false;
  return store.level < getRequiredLevel(selectedModelId.value);
});

// Permanent Tier System
const maxTierReached = computed(() => {
  const storedTier = store.aiAgentTiers[selectedModelId.value];
  if (storedTier !== undefined) return storedTier;
  // If model is not locked by level, they automatically own Tier 0 (BASIC)
  if (!isModelLocked.value) return 0;
  return -1;
});

const isCurrentModelActive = computed(() => store.aiAgent?.name === selectedModelId.value);

const currentTierPlan = computed(() => {
  if (maxTierReached.value === -1) return null;
  return AI_AGENT_MODEL_AND_PLAN_DATA[selectedModelId.value].price_plan[maxTierReached.value];
});

const nextTierPlan = computed(() => {
  return AI_AGENT_MODEL_AND_PLAN_DATA[selectedModelId.value].price_plan[maxTierReached.value + 1] || null;
});

const canInstall = computed(() => {
  if (isModelLocked.value) return false;
  if (isCurrentModelActive.value) return false;
  return maxTierReached.value >= 0;
});

const canUpgrade = computed(() => {
  if (isModelLocked.value) return false;
  if (!nextTierPlan.value) return false;
  return store.bankroll >= nextTierPlan.value.cost;
});

const hasAnyBonus = (plan) => {
  return plan.cooldown_bonus || plan.duration_bonus || plan.probability_bonus || plan.lt_regen_bonus_rate;
};

const handleInstall = () => {
  if (!canInstall.value) return;

  store.aiAgent = {
    name: selectedModelId.value,
    model: AI_AGENT_MODEL_AND_PLAN_DATA[selectedModelId.value],
    price_plan_idx: maxTierReached.value
  };
  audioManager.playSFX('bootup');
  emit('close');
  validateTaskSlots();
};

const handleUpgrade = () => {
  if (!canUpgrade.value) return;
  audioManager.playSFX('electric-boom');
  const plan = nextTierPlan.value;
  gainBankroll(-plan.cost, TYPE_CHANGE_BANKROLL.AI_AGENT_SUBSCRIPTION);

  // Update permanent tier record
  const newTier = maxTierReached.value + 1;
  store.aiAgentTiers[selectedModelId.value] = newTier;

  // Auto activate upon purchase/upgrade
  store.aiAgent = {
    name: selectedModelId.value,
    model: AI_AGENT_MODEL_AND_PLAN_DATA[selectedModelId.value],
    price_plan_idx: newTier
  };

  audioManager.playSFX('ui-click');
};

const nextAgent = () => {
  if (currentModelIdx.value < availableModelIds.value.length - 1) {
    selectedModelId.value = availableModelIds.value[currentModelIdx.value + 1];
    audioManager.playSFX('ui-click');
  }
};

const prevAgent = () => {
  if (currentModelIdx.value > 0) {
    selectedModelId.value = availableModelIds.value[currentModelIdx.value - 1];
    audioManager.playSFX('ui-click');
  }
};
</script>

<style scoped>
/* Override some styles to make sure it looks identical as a modal */
.v5-modal.agent-selector {
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.modal-content-scroll {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding-right: 5px;
}
.modal-content-scroll::-webkit-scrollbar {
  width: 4px;
}
.modal-content-scroll::-webkit-scrollbar-thumb {
  background: var(--neon-cyan);
  opacity: 0.3;
}
.v5-modal-overlay {
  z-index: 1000;
}

.level-lock-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--neon-red);
  font-size: 0.8rem;
  margin-top: 0.2rem;
  font-weight: bold;
}

.agent-info.is-locked {
  filter: grayscale(1) opacity(0.7);
}

.locked-placeholder {
  color: var(--neon-red);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  padding: 1rem 0;
  text-align: center;
}

.comparison-view {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 20px;
  margin: 1.5rem 0;
  min-height: 180px;
}

.tier-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tier-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--neon-cyan);
  font-weight: bold;
  font-size: 1.5rem;
}

.rank-card {
  flex: 1;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid var(--neon-cyan);
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.1);
}

.rank-card.upgrade {
  border-color: var(--neon-magenta);
  box-shadow: 0 0 10px rgba(255, 0, 96, 0.1);
}

.rank-card.empty {
  border-color: #333;
  justify-content: center;
  align-items: center;
  color: #666;
}

.rank-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 240, 255, 0.2);
  padding-bottom: 0.5rem;
}

.rank-card.upgrade .rank-header {
  border-bottom-color: rgba(255, 0, 96, 0.2);
}

.rank-header .level {
  font-family: 'Orbitron', sans-serif;
  font-weight: bold;
  color: var(--neon-cyan);
  font-size: 1.1rem;
}

.rank-card.upgrade .level {
  color: var(--neon-magenta);
}

.rank-header .cost {
  color: var(--neon-yellow);
  font-size: 0.9rem;
}

.rank-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.stat-item .label {
  color: #888;
}

.slots-list {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.extra-bonuses {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.4rem;
  padding-top: 0.4rem;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
}

.bonus {
  font-size: 0.75rem;
  font-weight: bold;
}
/* Agent Selector Modal */
.agent-selector {
  width: 900px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  gap: 10px;

}
.agent-selector h2 {
  margin: 1rem;
}
.lock-overlay {
  text-align: center;
}
/* Agent Browser (Carousel) */
.agent-browser {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
  height: 30vh;
}

.agent-display {
  flex: 1;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--panel-border);
  display: flex;
  flex-direction: column;
  /* grid-template-rows: auto 1fr; */
  padding: 12px;
  height: auto;
  min-height: 30vh;
  overflow-y: visible;
}

.agent-header {
  grid-column: 1 / -1;
  border-bottom: 1px solid rgba(0, 240, 255, 0.2);
  margin-bottom: 20px;
  padding-bottom: 15px;
}

.agent-header .id-tag {
  font-size: 0.6rem;
  color: var(--neon-magenta);
  letter-spacing: 2px;
  display: block;
  margin-bottom: 4px;
}

.agent-header .name {
  font-size: 1.8rem;
  font-weight: 900;
  color: #fff;
  margin: 0;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.agent-visual {
  background: #000;
  border: 1px solid var(--panel-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  margin-right: 25px;
}

.agent-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: justify;
}

.agent-info .slogan {
  font-size: 1.2rem;
  text-align: center;
  color: var(--neon-cyan);
  line-height: 1.4;
  margin: 0;
}

.features-box .label {
  font-size: 0.65rem;
  color: var(--neon-magenta);
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.agent-info .features {
  font-size: 0.85rem;
  color: #a0b0c0;
  line-height: 1.6;
  margin: 0;
  padding-left: 18px;
}


@media (max-width: 768px) {
  .comparison-view {
    flex-direction: column;
    gap: 10px;
  }
  .tier-separator {
    transform: rotate(90deg);
  }

  .v5-modal.agent-selector {
    height: auto !important;
    max-height: 80vh !important;
    padding: 15px;
  }

  .agent-browser {
    position: relative;
    margin-top: 10px;
    height: auto;
    min-height: unset;
    gap: 0;
  }

  /* Plan Grid to 1-column on mobile */
  .plan-grid {
    grid-template-columns: 1fr !important;
    gap: 15px !important;
  }

  .plan-card {
    padding: 12px !important;
  }

  .modal-actions {
    padding: 5px;
    gap: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .modal-actions button {
    font-size: 0.8rem;
    /* margin: 0; */
    /* ; */
    min-width: unset;
  }
}
</style>
