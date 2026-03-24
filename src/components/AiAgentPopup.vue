<template>
  <transition name="v4-fade">
    <div v-if="show" class="v5-modal-overlay" @click.self="$emit('close')">
      <div class="v5-modal agent-selector">
        <h2 class="glitch-text">AGENT_DESCRIPTION</h2>

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
            <!-- <div class="agent-visual">
              <span class="icon">🤖</span>
            </div> -->
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

        <div v-if="selectedModelId && !isModelLocked" class="plan-selector">
          <div class="v4-label">SELECT_SUBSCRIPTION_PLAN</div>
          <div class="plan-grid">
            <div v-for="(plan, idx) in AI_AGENT_MODEL_AND_PLAN_DATA[selectedModelId]?.price_plan" :key="idx"
              class="plan-card"
              :class="{ current: isCurrentPlan(selectedModelId, idx), selected: selectedPlanIdx === idx }"
              @click="selectedPlanIdx = idx">
              <div class="plan-header">
                <span class="level">LEVEL {{ idx }}</span>
                <span class="cost">{{ plan.cost.toLocaleString() }} CR</span>
              </div>
              <div class="plan-stats">
                <div>TOKENS_CAPACITY: <span style="color:var(--neon-cyan)">{{ plan.maxLt.toLocaleString() }}</span>
                </div>
                <div>SLOTS:
                  <span v-for="(slot, idx) in plan.slot" :key="idx" :class="slot">[{{ slot }}]</span>
                </div>
                <span v-if="plan.cooldown_bonus" style="color:var(--neon-magenta)">COOLDOWN_BONUS: +{{
                  (plan.cooldown_bonus * 100).toFixed(0) }}%</span>
                <span v-if="plan.duration_bonus" style="color:var(--neon-yellow)">DURATION_BONUS: +{{
                  (plan.duration_bonus * 100).toFixed(0) }}%</span>
                <span v-if="plan.probability_bonus" style="color:var(--neon-green)">PROB_BONUS: +{{
                  (plan.probability_bonus * 100).toFixed(0) }}%</span>
                <span v-if="plan.lt_regen_bonus_rate" style="color:var(--neon-cyan)">REGEN_MUL: {{
                  plan.lt_regen_bonus_rate }}x</span>
              </div>
              <div v-if="isCurrentPlan(selectedModelId, idx)" class="status-tag">ACTIVE</div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn" :disabled="!canPurchase" @click="confirmPurchase">
            {{ purchaseBtnText }}
          </button>
          <button class="btn" @click="$emit('close')">CLOSE</button>
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

const nextAgent = () => {
  if (currentModelIdx.value < availableModelIds.value.length - 1) {
    selectedModelId.value = availableModelIds.value[currentModelIdx.value + 1];
    selectedPlanIdx.value = 0; // Reset to level 0 plan when changing models
    audioManager.playSFX('ui-click');
  }
};

const prevAgent = () => {
  if (currentModelIdx.value > 0) {
    selectedModelId.value = availableModelIds.value[currentModelIdx.value - 1];
    selectedPlanIdx.value = 0;
    audioManager.playSFX('ui-click');
  }
};

const isCurrentPlan = (modelId, idx) => {
  return store.aiAgent?.name === modelId && store.aiAgent?.price_plan_idx === idx;
};

const canPurchase = computed(() => {
  if (selectedPlanIdx.value === null) return false;
  if (isModelLocked.value) return false;
  const plan = AI_AGENT_MODEL_AND_PLAN_DATA[selectedModelId.value]?.price_plan[selectedPlanIdx.value];
  if (!plan) return false;
  if (isCurrentPlan(selectedModelId.value, selectedPlanIdx.value)) return false;
  return store.bankroll >= plan.cost;
});

const purchaseBtnText = computed(() => {
  if (!selectedModelId.value) return 'SELECT AGENT';
  if (isModelLocked.value) return `LEVEL ${getRequiredLevel(selectedModelId.value)} REQUIRED`;
  if (isCurrentPlan(selectedModelId.value, selectedPlanIdx.value)) return 'CURRENT PLAN';
  const plan = AI_AGENT_MODEL_AND_PLAN_DATA[selectedModelId.value]?.price_plan[selectedPlanIdx.value];
  if (!plan) return 'N/A';
  if (store.bankroll < plan.cost) return 'INSUFFICIENT FUNDS';
  return `PURCHASE ( ${plan.cost.toLocaleString()} CR )`;
});

const confirmPurchase = () => {
  const plan = AI_AGENT_MODEL_AND_PLAN_DATA[selectedModelId.value].price_plan[selectedPlanIdx.value];
  if (store.bankroll < plan.cost) return;

  gainBankroll(-plan.cost, TYPE_CHANGE_BANKROLL.AI_AGENT_SUBSCRIPTION)
  const agentUpdate = {
    name: selectedModelId.value,
    model: AI_AGENT_MODEL_AND_PLAN_DATA[selectedModelId.value],
    price_plan_idx: selectedPlanIdx.value,
    subscriptionExpireAt: store.gameTime + (30 * 24 * 60 * 60 * 1000)
  };

  if (!store.aiAgent) {
    store.aiAgent = agentUpdate;
  } else {
    Object.assign(store.aiAgent, agentUpdate);
  }

  audioManager.playSFX('action-confirm');
  emit('close');

  // Clean up invalid tasks if slots decreased
  validateTaskSlots();
};
</script>

<style scoped>
@import '../styles/components/SafeHouse.css';

/* Override some styles to make sure it looks identical as a modal */
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
</style>
