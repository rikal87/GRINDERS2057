<template>
  <transition name="v4-fade">
    <div class="v5-modal-overlay popup-overlay" @click.self="$emit('close')">
      <div class="v5-modal agent-selector popup-modal">
        <h2 class="glitch-text modal-title" data-text="TASK_ASSIGNMENT">TASK_ASSIGNMENT</h2>

        <!-- Tab Navigation -->
        <div class="btn-group">
          <button v-for="tab in tabs" :key="tab.id" class="btn" :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id">
            {{ tab.label }}
          </button>
        </div>

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
import { store, getLanguage, getEnemyBustCount, getPlayStatsCount, getAgentTaskStat } from '../logic/store';
import { AI_TASK_DATA, } from '../logic/aiAgentTaskData';
import { isTaskUnlocked, startTask } from '../logic/aiAgentTaskSystem';
import { audioManager } from '../logic/audioManager';
import { TASK_STATS_TYPE } from '../logic/constants';
import { PLAY_RECORD_STATS_TYPE, } from '../logic/playRecordStats';

const PLAY_RECORD_STATS_TYPE_DESC = {
  PAID_RAKE: {
    'ko': '레이크 지불',
    'en': 'Paid Rake'
  },
  HANDS_PLAYED: {
    'ko': '핸드 수',
    'en': 'Hands Played'
  },
  FACED_RAISE: {
    'ko': '레이즈 당함',
    'en': 'Faced Raise'
  },
  FACED_3BET: {
    'ko': '3벳 당함',
    'en': 'Faced 3Bet'
  },
  FACED_4BET_OR_MORE: {
    'ko': '4벳 이상 당함',
    'en': 'Faced 4Bet or More'
  },
  FOLDED_TO_RAISE: {
    'ko': '레이즈에 폴드',
    'en': 'Folded to Raise'
  },
  FOLDED_TO_3BET: {
    'ko': '3벳에 폴드',
    'en': 'Folded to 3Bet'
  },
  FOLDED_TO_4BET_OR_MORE: {
    'ko': '4벳 이상에 폴드',
    'en': 'Folded to 4Bet or More'
  },
  BET: {
    'ko': '벳',
    'en': 'Bet'
  },
  RAISE: {
    'ko': '레이즈',
    'en': 'Raise'
  },
  CALL: {
    'ko': '콜',
    'en': 'Call'
  },
  FOLD: {
    'ko': '폴드',
    'en': 'Fold'
  },
  CHECK: {
    'ko': '체크',
    'en': 'Check'
  },
  ALL_IN: {
    'ko': '올인',
    'en': 'All In'
  },
  _3BET: {
    'ko': '3벳',
    'en': '3Bet'
  },
  _4BET_OR_MORE: {
    'ko': '4벳 이상',
    'en': '4Bet or More'
  },
  SHOWDOWN: {
    'ko': '쇼다운',
    'en': 'Showdown'
  },
  WIN: {
    'ko': '승리',
    'en': 'Win'
  },
  LOSE: {
    'ko': '패배',
    'en': 'Lose'
  },
  BUST: {
    'ko': '파산',
    'en': 'Bankrupt'
  },
  VPIP: {
    'ko': 'VPIP',
    'en': 'VPIP'
  },
  PFR: {
    'ko': 'PFR',
    'en': 'PFR'
  },
  WTSD: {
    'ko': 'WTSD',
    'en': 'WTSD'
  },
  WSD: {
    'ko': 'WSD',
    'en': 'WSD'
  },
  W$SD: {
    'ko': 'W$SD',
    'en': 'W$SD'
  },
  MAX_LOSE_STREAK: {
    'ko': '최대 연속 패배',
    'en': 'Max Lose Streak'
  },
  MAX_WIN_STREAK: {
    'ko': '최대 연속 승리',
    'en': 'Max Win Streak'
  },
  MAX_LOSE_POT: {
    'ko': '최대 패배 팟',
    'en': 'Max Lose Pot'
  },
  MAX_WIN_POT: {
    'ko': '최대 승리 팟',
    'en': 'Max Win Pot'
  },
  MAX_LOSE_EQUITY: {
    'ko': '최대 패배 에퀴티',
    'en': 'Max Lose Equity'
  },
  MAX_WIN_EQUITY: {
    'ko': '최대 승리 에퀴티',
    'en': 'Max Win Equity'
  },
  BUST_ENEMY: {
    'ko': '적 파산 횟수',
    'en': 'Bust Enemy'
  },
  NET_SHARE: {
    'ko': '파트너와의 수익 분배',
    'en': 'Net Share to Partner'
  },
  NET_WINNING: {
    'ko': '순수익',
    'en': 'Net Winning'
  },
  COST_LT: {
    'ko': '비용',
    'en': 'Cost LT'
  },
  FACED_FLOP_BET: {
    'ko': '플랍 벳 당함',
    'en': 'Faced Flop Bet'
  },
  COST_LT_TOTAL: {
    'ko': '총 LT 소모량',
    'en': 'Total LT Spent'
  },
  COMPLETED_TASK_COUNT: {
    'ko': '완료된 작업 수',
    'en': 'Completed Task Count'
  }
}
const getRecordStatsDesc = (type) => {
  if (!type) return;
  return PLAY_RECORD_STATS_TYPE_DESC[type.toUpperCase()][getLanguage()];
}
const getRecordStatsCurrentCount = (type, id) => {
  switch (type) {
    case TASK_STATS_TYPE.COST_LT_TOTAL:
    case TASK_STATS_TYPE.COMPLETED_TASK_COUNT: return getAgentTaskStat(type) || 0;
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

  // Check if already active or on cooldown
  if (store.onWorkTasks.find(t => t.taskId === task.id)) return false;

  // Check LT
  if (store.ludusTokens < task.cost) return false;

  // Check if slot tier is sufficient
  if (task.tier > slotTierValue.value) return false;

  return true;
});

const taskInitiateBtnText = computed(() => {
  const task = currentTaskDef.value;
  if (!task) return 'NO_TASK_SELECTED';
  if (!isTaskUnlocked(task)) return 'INITIATE';

  const activeTask = store.onWorkTasks.find(t => t.taskId === task.id);
  if (activeTask) {
    if (activeTask.status === 'COOLDOWN') return 'ON_COOLDOWN';
    if (activeTask.status === 'ACTIVE' || activeTask.status === 'WORKING') return 'IN_PROGRESS';
    return 'UNAVAILABLE';
  }

  if (task.tier > slotTierValue.value) return `LOW_TIER_TASKSLOT`;

  if (store.ludusTokens < task.cost) return 'INSUFFICIENT_LT';
  return 'INITIATE';
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
  justify-content: space-between
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
  margin-top: 10px;
  justify-content: center
}

.features li {
  color: var(--neon-cyan);
  text-align: left;
  font-size: 0.75rem;
}
.slogan-container {
  background: #0d1319;
  border: 1px solid rgba(255, 0, 85, 0.25);
  padding: 0 20px;
  /* padding-right: 10px; */
  margin-bottom: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
  position: relative;
  /* color: var(--neon-cyan); */
}
.agent-display {
  /* width: 300px; */
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--panel-border);
  height: 40vh;
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
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
</style>
