<template>
  <transition name="v4-fade">
    <div class="v5-modal-overlay popup-overlay" @click.self="$emit('close')">
      <div class="v5-modal agent-selector popup-modal">
        <h2 class="glitch-text" data-text="TASK_PROTOCOL_ASSIGNMENT">TASK_PROTOCOL_ASSIGNMENT</h2>

        <!-- Tab Navigation -->
        <div class="v5-tabs">
          <button v-for="tab in tabs" :key="tab.id" :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id">
            {{ tab.label }}
          </button>
        </div>

        <div class="agent-browser">
          <button class="nav-btn prev" @click="prevTask" :disabled="currentTaskIdx === 0">&lt;</button>

          <div v-if="filteredTasks.length > 0" class="agent-display"
            :class="{ locked: !isTaskUnlocked(currentTaskDef) }">
            <div class="agent-header">
              <span class="id-tag">TIER_{{ currentTaskDef.tier }} // {{ currentTaskDef.type }}</span>
              <h3 class="name">{{ currentTaskDef.name }}</h3>
            </div>
            <div class="agent-visual">
              <span class="icon">📜</span>
            </div>
            <div class="agent-info">
              <div v-if="isTaskUnlocked(currentTaskDef)" class="slogan-container">
                <p class="slogan" style="white-space: pre-line">{{ currentTaskDef.desc }}</p>
                <p class="slogan-detail" style="opacity: 0.7; font-size: 0.9em; margin-top: 8px;">{{
                  currentTaskDef.desc_detail }}</p>
              </div>
              <div v-else class="lock-overlay">
                <div class="lock-icon">🔒</div>
                <p class="slogan" style="color:var(--neon-red)">ENCRYPTION_ACTIVE: REQUIREMENT_NOT_MET</p>
                <p class="requirement" v-if="currentTaskDef.unlock">
                  NEED: {{ currentTaskDef.unlock.type }}
                  <span v-if="currentTaskDef.unlock.id">[{{ currentTaskDef.unlock.id }}]</span>
                  {{ currentTaskDef.unlock.count || currentTaskDef.unlock.amount || currentTaskDef.unlock.credit }}
                </p>
              </div>
              <div class="features-box" v-if="isTaskUnlocked(currentTaskDef)">
                <div class="label">EXECUTION_PARAMETERS</div>
                <ul class="features">
                  <li>COST: {{ currentTaskDef.cost }} LT <span v-if="currentTaskDef.type !== 'AGENT_WORK'">/
                      HR</span><span v-else>/ ACTIVE</span></li>
                  <li v-if="currentTaskDef.duration">DURATION: {{ formatMinutes(currentTaskDef.duration) }}</li>
                  <li>COOLDOWN: {{ formatMinutes(currentTaskDef.cooldown) }}</li>
                  <li v-if="currentProbBonus > 0 || currentTaskDef.probability" style="color:var(--neon-green)">
                    SUCCESS_RATE: {{
                      ((currentTaskDef.probability + currentProbBonus) * 100).toFixed(1) }}% / HR
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <span>NO_PROTOCOL_FOUND</span>
          </div>

          <button class="nav-btn next" @click="nextTask"
            :disabled="currentTaskIdx >= filteredTasks.length - 1 || filteredTasks.length === 0">&gt;</button>
        </div>
        <div class="modal-actions">
          <button class="btn cyan" :disabled="!canStartCurrentTask || filteredTasks.length === 0" @click="initiateTask">
            {{ taskInitiateBtnText }}
          </button>
          <button class="btn" @click="$emit('close')">ABORT</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { store } from '../logic/store';
import { AI_TASK_DATA } from '../logic/agentTaskData';
import { isTaskUnlocked, startTask } from '../logic/aiTaskSystem';
import { audioManager } from '../logic/audioManager';

const props = defineProps({
  slotIdx: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['close']);

const tabs = [
  { id: 'AGENT_WORK', label: 'AGENT WORK' },
  { id: 'SEARCH', label: 'SEARCH' },
  { id: 'BOOST', label: 'BOOST' },
  { id: 'NETWORKING', label: 'NETWORKING' }
];

const activeTab = ref('AGENT_WORK');
const currentTaskIdx = ref(0);

// Filter and Sort Logic
const filteredTasks = computed(() => {
  return AI_TASK_DATA
    .filter(task => task.type === activeTab.value)
    .sort((a, b) => {
      // Ascending by tier
      if (a.tier !== b.tier) return a.tier - b.tier;
      // Ascending by name
      return a.name.localeCompare(b.name);
    });
});

// Reset index when tab changes
watch(activeTab, () => {
  currentTaskIdx.value = 0;
  audioManager.playSFX('ui-click');
});

const currentTaskDef = computed(() => filteredTasks.value[currentTaskIdx.value]);

const currentProbBonus = computed(() => {
  const agent = store.aiAgent;
  const planData = agent.model?.price_plan[agent.price_plan_idx];
  return planData?.probability_bonus || 0;
});

const formatMinutes = (mins) => {
  if (!mins) return 'NONE';
  if (mins >= 1440) {
    const days = Math.floor(mins / 1440);
    const remainder = mins % 1440;
    const hours = Math.floor(remainder / 60);
    if (hours > 0) return `${days}D ${hours}H`;
    return `${days}D`;
  }
  return `${Math.floor(mins / 60)}H`;
};

const nextTask = () => {
  if (currentTaskIdx.value < filteredTasks.value.length - 1) {
    currentTaskIdx.value++;
    audioManager.playSFX('ui-click');
  }
};

const prevTask = () => {
  if (currentTaskIdx.value > 0) {
    currentTaskIdx.value--;
    audioManager.playSFX('ui-click');
  }
};

const currentAgentSlots = computed(() => {
  const agentData = store.aiAgent.model;
  return agentData?.price_plan[store.aiAgent.price_plan_idx]?.slot || ['T1'];
});

const slotTierValue = computed(() => {
  const tierStr = currentAgentSlots.value[props.slotIdx];
  if (!tierStr) return 0;
  return parseInt(tierStr.substring(1));
});


const canStartCurrentTask = computed(() => {
  const task = currentTaskDef.value;
  if (!task) return false;
  if (!isTaskUnlocked(task)) return false;

  // Check LT
  if (store.ludusTokens < task.cost) return false;

  // Check if slot tier is sufficient
  if (task.tier > slotTierValue.value) return false;

  return true;
});

const taskInitiateBtnText = computed(() => {
  const task = currentTaskDef.value;
  if (!task) return 'NO_TASK_SELECTED';
  if (!isTaskUnlocked(task)) return 'REQUIREMENT_NOT_MET';

  if (task.tier > slotTierValue.value) return `LOW_TIER_MEMORY (REQ T${task.tier})`;

  if (store.ludusTokens < task.cost) return 'INSUFFICIENT_LT';
  return 'INITIATE_PROTOCOL';
});

const initiateTask = () => {
  if (startTask(currentTaskDef.value.id)) {
    emit('close');
    audioManager.playSFX('action-confirm');
  } else {
    audioManager.playSFX('ui-error');
  }
};

onMounted(() => {
  audioManager.playSFX('ui-click');
});
</script>

<style scoped>
.popup-overlay {
  z-index: 1000;
  /* Ensure it floats above SafeHouse and App */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
}
.popup-modal {
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  width: 300px;
  color: var(--neon-red);
  font-family: 'Share Tech Mono', monospace;
  text-align: center;
  border: 1px dashed var(--neon-red);
}

.agent-browser {
  margin-top: 10px;
}
</style>
