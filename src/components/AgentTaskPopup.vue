<template>
  <transition name="v4-fade">

    <div class="v5-modal-overlay popup-overlay">
      <!-- Tab Navigation -->
      <div class="btn-group">
        <button v-for="tab in tabs" :key="tab.id" class="btn" :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id">
          {{ tab.label }}
        </button>
      </div>
      <div class="v5-modal agent-selector popup-modal">
        <h2 class="glitch-text modal-title" data-text="TASK_ASSIGNMENT">TASK_ASSIGNMENT</h2>



        <div class="agent-browser">
          <button class="nav-btn prev" @click="prevTask" :disabled="currentTaskIdx === 0">&lt;</button>

          <div v-if="filteredTasks.length > 0" class="agent-display"
            :class="{ locked: !isTaskUnlocked(currentTaskDef) }">
            <div class="agent-header">
              <span class="id-tag">TIER_{{ currentTaskDef.tier }}</span>
              <h3 class="name">{{ currentTaskDef.name }}</h3>
            </div>
            <div class="agent-info">
              <div v-if="isTaskUnlocked(currentTaskDef)" class="slogan-container">
                <p class="slogan" style="white-space: pre-line">{{ currentTaskDef.desc }}</p>
                <p class="slogan-detail" style="opacity: 0.7; font-size: 0.9em; margin-top: 8px;">{{
                  currentTaskDef.desc_detail }}</p>
              </div>
              <div v-else class="slogan-container">
                <div class="lock-icon">🔒</div>
                <p class="slogan" style="color:var(--neon-red)">LOCKED: REQUIREMENT_NOT_MET</p>
                <p class="requirement" v-if="currentTaskDef.unlock">
                  NEED: {{ getRecordStatsDesc(currentTaskDef.unlock.type) }}
                  <span v-if="currentTaskDef.unlock.id">[{{ currentTaskDef.unlock.id }}]</span>
                </p>
                <p class="requirement" v-if="currentTaskDef.unlock">
                  <small>{{ getRecordStatsCurrentCount(currentTaskDef.unlock.type,
                    currentTaskDef.unlock.id).toLocaleString() }}</small>
                  <small> / </small>
                  <small>{{ (currentTaskDef.unlock.count ||
                    currentTaskDef.unlock.amount ||
                    currentTaskDef.unlock.credit).toLocaleString() }}</small>
                </p>
              </div>
              <div class="stats-container" v-if="isTaskUnlocked(currentTaskDef)">
                <div class="stats-section">
                  <div class="section-label">EXECUTION_PARAMETERS</div>
                  <div class="stats-grid">
                    <div class="stat-entry">
                      <span class="label">COST/HR:</span>
                      <span class="val cyan">
                        {{ currentTaskDef.cost }} LT
                        <span v-if="currentTaskDef.type !== 'AGENT_WORK'">HR</span>
                      </span>
                    </div>
                    <div class="stat-entry">
                      <span class="label">COOLDOWN:</span>
                      <span class="val" :class="getBonusColor(cooldownBonus)">
                        {{ formatMinutes(currentTaskDef.cooldown) }}
                      </span>
                    </div>
                    <div class="stat-entry">
                      <span class="label">DURATION:</span> <span class="val" :class="getBonusColor(durationBonus)">{{
                        formatMinutes(currentTaskDef.duration) }}</span>
                    </div>
                    <div class="stat-entry">
                      <span class="label">SUCCESS_RATE:</span>
                      <span class="val" :class="getBonusColor(currentProbBonus)">
                        {{ ((currentTaskDef.probability + currentProbBonus) * 100).toFixed(1) }}%
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <span>NO_TASK_FOUND</span>
          </div>

          <button class="nav-btn next" @click="nextTask"
            :disabled="currentTaskIdx >= filteredTasks.length - 1 || filteredTasks.length === 0">&gt;</button>
        </div>
        <div class="modal-actions">
          <button class="btn-accept" :disabled="!canStartCurrentTask || filteredTasks.length === 0"
            @click="initiateTask">
            {{ taskInitiateBtnText }}
          </button>
          <button class="btn-cancel" @click="$emit('close')">CLOSE</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { store, getLanguage, getEnemyBustCount, getPlayStatsCount } from '../logic/store';
import { AI_TASK_DATA, } from '../logic/aiAgentTaskData';
import { isTaskUnlocked, startTask } from '../logic/aiAgentTaskSystem';
import { audioManager } from '../logic/audioManager';
import { PLAY_RECORD_STATS_TYPE, PLAY_RECORD_STATS_DESC } from '../logic/playRecordStats';

const getRecordStatsDesc = (type) => {
  if (!type) return;
  console.info('PLAY_RECORD_STATS_DESC[]', PLAY_RECORD_STATS_DESC[type], type)
  return PLAY_RECORD_STATS_DESC[type][getLanguage()];
}
const getRecordStatsCurrentCount = (type, id) => {
  switch (type) {
    case PLAY_RECORD_STATS_TYPE.BUST_ENEMY: return getEnemyBustCount(id) || 0;
    default: return getPlayStatsCount(type) || 0;
  }
}
const getBonusColor = (probBonus) => {
  if (!probBonus) return '#fff';
  else if (probBonus > 0.0) return 'var(--neon-green)';
}
const props = defineProps({
  slotIdx: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['close']);

const tabs = [
  { id: 'AGENT_WORK', label: 'AGENT WORK' },
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
const durationBonus = computed(() => {
  const agent = store.aiAgent;
  const planData = agent.model?.price_plan[agent.price_plan_idx];
  return planData?.duration_bonus || 0;
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

  // [FIX] Allow multiple assignments of the same task type in different slots.
  // Check if LT
  if (store.ludusTokens < task.cost) return false;

  // Check if slot tier is sufficient
  if (task.tier > slotTierValue.value) return false;

  return true;
});

const taskInitiateBtnText = computed(() => {
  const task = currentTaskDef.value;
  if (!task) return 'NO_TASK_SELECTED';
  if (!isTaskUnlocked(task)) return 'INITIATE';

  // [FIX] Removed global check to allow multiple assignments of the same task.
  // Since the popup is only opened for empty slots, any existing task instance is in another slot.

  if (task.tier > slotTierValue.value) return `LOW_TIER_TASKSLOT`;

  if (store.ludusTokens < task.cost) return 'INSUFFICIENT_LT';
  return 'INITIATE';
});

const initiateTask = () => {
  audioManager.playSFX('bootup');
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
  display: flex;
  flex-direction: column;
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
  overflow: hidden;
  /* Important for internal scrolling */
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
.modal-actions {
  padding: 25px;
}
.btn-group {
  justify-content: center;
  margin-bottom: 10px;
}

.features li {
  color: var(--neon-cyan);
  text-align: left;
  font-size: 0.75rem;
}
.slogan-container {
  background: #0d1319;
  border: 1px solid rgba(255, 0, 85, 0.25);
  padding: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
  position: relative;
}
.agent-display {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--panel-border);
  padding: 10px;
}
.agent-display h3 {
  color: var(--neon-red);
}
.btn-accept,
.btn-cancel {
  min-width: 200px;
}
.agent-browser {
  flex: 1;
  /* Take all available space */
  min-height: 0;
  /* Important for flex child scroll */
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  overflow-y: auto;
  /* Scrollable content */
}
.stats-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px 0;
  max-height: 70vh;
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: 10px;
}

.stats-section {
  border: 1px solid rgba(0, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  padding: 15px;
  margin-top: 15px;
  position: relative;
}

.stats-section .section-label {
  position: absolute;
  top: -10px;
  left: 10px;
  background: #0d1117;
  padding: 0 8px;
  font-size: 0.7rem;
  color: var(--neon-cyan);
  letter-spacing: 2px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 4px;
}
@media (max-width: 768px) {
  .agent-browser {
    position: relative;
    gap: 0;
  }
  .v5-modal {
    height: auto !important;
    max-height: 85vh !important;
  }
  /* Color Theme Override */

  .btn-accept,
  .btn-cancel {
    min-width: 140px;
    font-size: 0.8rem;
  }

  .modal-actions {
    padding: 15px 5px;
    display: flex;
    gap: 10px;
    justify-content: center;
  }
}
</style>
