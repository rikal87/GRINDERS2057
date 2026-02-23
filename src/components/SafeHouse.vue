<template>
  <div class="safe-house v5">
    <div class="v5-bg-scan"></div>

    <!-- NOT USED-->
    <!-- <header class="v5-top-bar">
      <div class="v5-logo-side">
        <div class="v5-area-tag">SECURE_LOCATION // SECTOR_07</div>
        <h1>SAFEHOUSE_V.5</h1>
      </div>

      <div class="v5-time-side">
        <div class="v5-digital-clock">{{ formatGameTime(store.gameTime) }}</div>
        <button class="v5-btn-settings" @click="$emit('back')">LOBBY_RETURN</button>
      </div>
    </header> -->

    <div class="v5-body">
      <!-- LEFT COLUMN: STATUS & SETUP -->
      <section class="v5-side-col">
        <!-- Core Vitality -->
        <div class=" v5-panel v5-core-vitality">
          <div class="v5-panel-label">
            <span>CORE_VITALITY</span>
            <button class="stats-btn" @click="showStatsModal = true">STATS</button>
          </div>
          <div class="v5-panel-inner">

            <div class=" v5-stat-row">
              <div class="v5-stat-group">
                <span class="label">BANKROLL</span>
                <span class="bankroll">{{ store.bankroll.toLocaleString() }} <small>CR</small></span>
              </div>
            </div>
            <div class="v5-stat-row">
            </div>
            <div class="v5-xp-box">
              <div class="v5-xp-text">
                <span class="label">LEVEL</span>
                <span class="val highlight">LV.{{ store.level }}</span>
              </div>
              <div class="v5-xp-text">
                <span>EXPERIENCE_GAINED</span>
                <span>{{ store.xp }} / {{ getNextLevelThreshold() }}</span>
              </div>
              <div class="v5-progress-track">
                <div class="v5-progress-fill" :style="{ width: xpPercent + '%' }"></div>
              </div>
              <div class="v5-xp-text v5-stamina" :class="{ 'low-stamina': store.stamina < 25 }">
                <span>STEMINA</span>
                <span>{{ Math.floor(store.stamina) }} / {{ store.maxStamina }}</span>
              </div>
              <div class="v5-progress-track">
                <div class="v5-progress-fill"
                  :style="{ width: (store.stamina / store.maxStamina * 100) + '%', backgroundColor: getStaminaColor }">
                </div>
              </div>
            </div>

          </div>
        </div>
        <button class="btn" @click="$emit('sleep')">REST</button>
        <!-- Program Setup -->
        <!-- Ai Agent Template -->
        <div class="v5-panel v5-neural-template">
          <div class="v5-panel-label">
            <span>AI_AGENT</span>
            <button class="set-up-agent-btn" @click="showAgentModal = true">SETUP</button>
          </div>
          <div class="v5-panel-inner">
            <div class="v5-neural-hero">
              <span class="v5-class-title">{{ store.aiAgent.name }}</span>
              <p class="v5-class-desc">
                {{ store.aiAgent.model?.slogan }}
              </p>
              <div class="v5-stat-row">
                <div class="v5-stat-group">
                  <span class="label">LUDUS_TOKENS</span>
                  <span class="val yellow">{{ Math.floor(store.ludusTokens).toLocaleString() }}
                    <small>LT</small></span>
                </div>
              </div>
              <div class="v5-status-badges">
                <span class="v5-badge-mini" v-if="store.gameTime < store.aiAgent.subscriptionExpireAt">SYS_ACTIVE</span>
                <span class="v5-badge-mini" v-else style="color:var(--neon-red)">SYS_EXPIRED</span>
                <span class="v5-badge-mini">HUD_ACTIVE</span>
                <span class="v5-badge-mini">RAM_V1</span>
              </div>
            </div>
            <div class="v5-slot-list">
              <div v-for="(slot, idx) in taskSlots" :key="idx" class="v5-slot-item" :class="{ locked: slot.isLocked }"
                @click="!slot.isLocked && !slot.task && openTaskSelector(idx)"
                @mousedown="!slot.isLocked && slot.task && startLongPress(idx)" @mouseup="cancelLongPress"
                @mouseleave="cancelLongPress" @touchstart="!slot.isLocked && slot.task && startLongPress(idx)"
                @touchend="cancelLongPress">

                <div class="v5-slot-meta">
                  <span class="v5-slot-tier-tag"> {{ slot.tier }}</span>
                  <span class="name">{{ slot.task ? slot.task.name : (slot.isLocked ? 'LOCKED' :
                    'CLICK_TO_ASSIGN') }}</span>
                  <div class="v5-slot-status" :class="getTaskStatusClass(slot)">
                    {{ slot.statusText }}
                  </div>
                </div>

                <!-- Progress bar for long press -->
                <div v-if="longPressIdx === idx" class="long-press-progress"
                  :style="{ width: longPressProgress + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
        <button class="btn-leave" @click="$emit('back')">
          LEAVE_AREA
        </button>
      </section>

      <!-- CENTER COLUMN: GEAR / STORAGE -->
      <section class="v5-main-col">
        <div class="v5-panel v5-storage-unit" style="flex:1; overflow:hidden">
          <div class="v5-tabs">
            <button :class="{ active: mainTab === 'hardware' }" @click="mainTab = 'hardware'">Chip Protector</button>
            <button :class="{ active: mainTab === 'crypto' }" @click="mainTab = 'crypto'">Crypto Currency</button>
          </div>

          <div class="v5-item-container">
            <!-- Hardware View -->
            <template v-if="mainTab === 'hardware'">
              <div class="items-grid">
                <div v-for="item in store.ownedProtectors" :key="item.instanceId" class="item-card"
                  @click="equipItem(item.instanceId)">
                  <div class="card-header">
                    <span class="tier-tag" :class="'tier-' + item.tier">{{ item.tier }}</span>
                    <button class="sell-btn" @click="sellItem(item)">SELL</button>
                  </div>
                  <div class="item-icon">{{ item.icon }}</div>
                  <div class="item-details">
                    <h3 class="name">{{ item.name }}</h3>
                    <p class="desc">{{ item.desc }}</p>
                    <div class="effects-mini">
                      <div v-for="eff in item.effects" :key="eff?.name" class="eff-badge"
                        :class="'rarity-' + (eff?.rarity ? eff.rarity.toLowerCase() : 'common')">
                        <span class="eff-name">{{ eff?.name }}</span>
                        <span class="eff-desc">{{ eff?.desc }}</span>
                      </div>
                    </div>
                    <div
                      :class="{ 'equipped-overlay': true, 'isEquipped': store.equippedProtector?.instanceId === item.instanceId }">
                      <span>EQUIP</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="store.ownedProtectors.length === 0" class="empty-stock">
                <h2>OUT_OF_INVENTORY</h2>
                <p>BUY AT THE SHOP</p>
              </div>
            </template>

            <!-- Crypto View -->
            <template v-else>
              <div v-for="coin in marketState.coins" :key="coin.id" class="v5-item-h-card">
                <div class="v5-item-icon-box">
                  <span class="v5-item-tier-tag">COIN</span>
                  <span style="font-size:1.2rem; color:var(--accent-yellow)">$</span>
                </div>
                <div class="v5-item-h-body">
                  <div class="v5-item-h-head">
                    <span class="v5-item-h-name">{{ coin.symbol }} - {{ coin.name }}</span>
                    <span class="v5-item-h-status">MARKET_VAL: ${{ coin.price.toFixed(2) }}</span>
                  </div>
                  <p class="v5-item-h-desc">Global decentralized asset. Current trend: {{ coin.trend > 0 ? 'BULLISH' :
                    'BEARISH' }}</p>
                  <div class="v5-item-h-meta">
                    <div class="v5-item-h-stats">VOLATILITY: {{ (coin.volatility * 100).toFixed(1) }}%</div>
                    <div class="v5-item-h-actions">
                      <button class="sell" @click="sellCoin(coin.id, 0.5)">SELL 50%</button>
                      <button class="sell" @click="sellCoin(coin.id, 1.0)">DUMP ALL</button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </section>

      <!-- RIGHT COLUMN: COMMS / INBOX -->
      <section class="v5-msg-col">
        <div class="v5-panel v5-secure-comms" style="flex:1; overflow:hidden">
          <!-- <div class="v5-panel-label">
              <span>SECURE_COMMS</span>
              <button class="set-up-agent-btn" @click="showAgentModal = true">SETUP</button>
            </div> -->

          <div class="v5-panel-label inbox-label">SECURE_COMMS<small style="color:var(--accent-red)">[{{
            unreadCount
          }} UNREAD]</small>
          </div>
          <!-- Message Reader Integrated -->
          <div v-if="selectedMessage" class="v5-msg-h-reader">
            <div style="text-align: right;"><button class="sell-btn"
                @click="deleteMessageBtn(selectedMessage.id)">DELETE</button></div>
            <span class="v5-reader-title">{{ selectedMessage.title }}</span>
            <div class="v5-reader-body">
              <header></header>
              <article v-html="selectedMessage.body"></article>
            </div>
            <div class="v5-reader-actions">
              <button v-for="(act, idx) in selectedMessage.actions" :key="idx" class="v4-btn cyan"
                @click="triggerMessageAction(selectedMessage.id, idx)">
                {{ act.label }}
              </button>
            </div>
          </div>
          <div v-else class="v4-empty-state" style="margin-top:20px">NO_MESSAGES</div>
          <div class="v5-msg-list">
            <div v-for="msg in store.messages" :key="msg.id" class="v5-msg-card"
              :class="{ unread: !msg.isRead, active: selectedMessage?.id === msg.id }" @click="selectMessage(msg)">
              <div class="head">
                <span>{{ msg.type }}</span>
                <span>{{ new Date(msg.timestamp).toLocaleDateString() }}</span>
              </div>
              <div class="title">{{ msg.title }}</div>
            </div>



          </div>
        </div>
      </section>
    </div>
    <!-- AI AGENT SELECTION MODAL -->
    <transition name="v4-fade">
      <div v-if="showAgentModal" class="v5-modal-overlay" @click.self="showAgentModal = false">
        <div class="v5-modal agent-selector">
          <h2 class="glitch-text" data-text="AGENT_MARKET_ACCESS">AGENT_MARKET_ACCESS</h2>

          <div class="agent-browser">
            <button class="nav-btn prev" @click="prevAgent" :disabled="currentModelIdx === 0">&lt;</button>

            <div class="agent-display">
              <div class="agent-header">
                <span class="id-tag">MODEL_ID: {{ selectedModelId }}</span>
                <h3 class="name">{{ selectedModelId }}</h3>
              </div>

              <div class="agent-visual">
                <span class="icon">🤖</span>
              </div>

              <div class="agent-info">
                <p class="slogan">"{{ AI_AGENT_MODEL_AND_PLAN_DATA[selectedModelId]?.slogan }}"</p>
                <div class="features-box">
                  <div class="label">KEY_CAPABILITIES</div>
                  <ul class="features">
                    <li>{{ AI_AGENT_MODEL_AND_PLAN_DATA[selectedModelId]?.key_features }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <button class="nav-btn next" @click="nextAgent"
              :disabled="currentModelIdx === availableModelIds.length - 1">&gt;</button>
          </div>

          <div v-if="selectedModelId" class="plan-selector">
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
                  <span>LT_MAX: {{ plan.maxLt }}</span>
                  <span>SLOTS: {{ plan.slot.join(', ') }}</span>
                </div>
                <div v-if="isCurrentPlan(selectedModelId, idx)" class="status-tag">ACTIVE</div>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button class="v4-btn cyan" :disabled="!canPurchase" @click="confirmPurchase">
              {{ purchaseBtnText }}
            </button>
            <button class="v4-btn" @click="showAgentModal = false">CLOSE</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- TASK SELECTOR MODAL -->
    <transition name="v4-fade">
      <div v-if="showTaskModal" class="v5-modal-overlay" @click.self="showTaskModal = false">
        <div class="v5-modal agent-selector">
          <h2 class="glitch-text" data-text="TASK_PROTOCOL_ASSIGNMENT">TASK_PROTOCOL_ASSIGNMENT</h2>

          <div class="agent-browser">
            <button class="nav-btn prev" @click="prevTask" :disabled="currentTaskIdx === 0">&lt;</button>

            <div class="agent-display" :class="{ locked: !isTaskUnlocked(currentTaskDef) }">
              <div class="agent-header">
                <span class="id-tag">TIER_{{ currentTaskDef.tier }} // {{ currentTaskDef.type }}</span>
                <h3 class="name">{{ currentTaskDef.name }}</h3>
              </div>

              <div class="agent-visual">
                <span class="icon">📜</span>
              </div>

              <div class="agent-info">
                <p class="slogan" v-if="isTaskUnlocked(currentTaskDef)">"{{ currentTaskDef.desc }}"</p>
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
                  <div class="label">OPERATIONAL_COSTS</div>
                  <ul class="features">
                    <li v-if="currentTaskDef.isLumpSum">LUMP_SUM: {{ currentTaskDef.cost }} LT</li>
                    <li v-else>OP_COST: {{ currentTaskDef.costPerTime }} LT/HR</li>
                    <li>PROBABILITY: {{ (currentTaskDef.probability * 100).toFixed(1) }}%</li>
                    <li>COOLDOWN: {{ currentTaskDef.cooldown / 60 }} HR</li>
                  </ul>
                </div>
              </div>
            </div>

            <button class="nav-btn next" @click="nextTask"
              :disabled="currentTaskIdx === AI_TASK_DATA.length - 1">&gt;</button>
          </div>

          <div class="modal-actions">
            <button class="v4-btn cyan" :disabled="!canStartCurrentTask" @click="initiateTask">
              {{ taskInitiateBtnText }}
            </button>
            <button class="v4-btn" @click="showTaskModal = false">ABORT</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- SKILL SELECTOR MODAL -->
    <transition name="v4-fade">
      <div v-if="showSkillSelector" class="v5-modal-overlay" @click.self="closeSkillSelector">
        <div class="v5-modal">
          <div class="v4-label">SELECT_SUBROUTINE: {{ activeSlotType }}</div>
          <div class="v5-modal-list">
            <div v-for="sk in filteredSkillsForSlot" :key="sk.id" class="v4-item-card" @click="equipSkill(sk)">
              <div class="v4-item-row">
                <span class="v4-val white">{{ sk.name }}</span>
                <span class="v4-val yellow">{{ sk.tier }}</span>
              </div>
              <div class="v4-key">{{ sk.desc }}</div>
              <div class="v4-key" style="opacity:0.4;">RAM: {{ sk.ramOccupation }}GB</div>
            </div>
          </div>
          <div class="v4-modal-footer" style="display:flex; gap:10px; margin-top:20px">
            <button class="v4-btn red" @click="equipSkill(null)">DE_ATTACH</button>
            <button class="v4-btn" @click="closeSkillSelector">CANCEL</button>
          </div>
        </div>
      </div>
    </transition>
    <!-- PLAY STATS MODAL -->
    <transition name="v4-fade">
      <div v-if="showStatsModal" class="v5-modal-overlay" @click.self="showStatsModal = false">
        <div class="v5-modal stats-modal">
          <div class="v4-label">PLAY_STATS_ANALYSIS</div>
          <h2 class="glitch-text" data-text="PERFORMANCE_REPORT">PERFORMANCE_REPORT</h2>

          <div class="stats-container">
            <!-- Economic Stats -->
            <div class="stats-section">
              <div class="section-label">ECONOMIC_METRICS</div>
              <div class="stats-grid">
                <div class="stat-entry"><span class="label">TOTAL_EARNED:</span> <span class="val cyan">{{
                  (store.play_stats.total_earn_money || 0n).toLocaleString() }} CR</span></div>
                <div class="stat-entry"><span class="label">TOTAL_LOST:</span> <span class="val red">{{
                  (store.play_stats.total_lost_money || 0n).toLocaleString() }} CR</span></div>
                <div class="stat-entry"><span class="label">PAID_RAKE:</span> <span class="val yellow">{{
                  (store.play_stats.paid_rake || 0).toLocaleString() }} CR</span></div>
                <div class="stat-entry"><span class="label">MAX_WIN_POT:</span> <span class="val white">{{
                  store.play_stats.max_win_pot.toLocaleString() }} CR</span></div>
                <div class="stat-entry"><span class="label">MAX_LOSE_POT:</span> <span class="val white">{{
                  store.play_stats.max_lose_pot.toLocaleString() }} CR</span></div>
              </div>
            </div>

            <!-- Behavioral Stats (HUD) -->
            <div class="stats-section">
              <div class="section-label">BEHAVIORAL_HUD</div>
              <div class="stats-grid">
                <div class="stat-entry"><span class="label">HANDS_PLAYED:</span> <span class="val">{{
                  store.play_stats.played_hands }}</span></div>
                <div class="stat-entry"><span class="label">VPIP:</span> <span class="val cyan">{{ vpip }}%</span></div>
                <div class="stat-entry"><span class="label">PFR:</span> <span class="val yellow">{{ pfr }}%</span></div>
                <div class="stat-entry"><span class="label">WTSD:</span> <span class="val white">{{ wtsd }}%</span>
                </div>
                <div class="stat-entry"><span class="label">W$SD:</span> <span class="val green">{{ wsd }}%</span></div>
              </div>
            </div>

            <!-- Luck & Performance -->
            <div class="stats-section">
              <div class="section-label">LUCK_AND_PEAKS</div>
              <div class="stats-grid">
                <div class="stat-entry"><span class="label">BANKRUPTCY:</span> <span class="val red">{{
                  store.play_stats.bankruptcy_count }}</span></div>
                <div class="stat-entry"><span class="label">MAX_STREAK (WIN):</span> <span class="val green">{{
                  store.play_stats.max_win_streak }}</span></div>
                <div class="stat-entry"><span class="label">MAX_STREAK (LOSE):</span> <span class="val red">{{
                  store.play_stats.max_lose_streak }}</span></div>
                <div class="stat-entry"><span class="label">BAD_BEAT_PEAK:</span> <span class="val yellow">{{
                  store.play_stats.max_lose_equity.toFixed(1) }}%</span></div>
              </div>
            </div>
          </div>

          <div class="modal-actions" style="margin-top:20px">
            <button @click="showStatsModal = false">CLOSE_REPORT</button>
          </div>
        </div>
      </div>
    </transition>


  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { store, getNextLevelThreshold, getCurrentAgent } from '../logic/store';
import { marketState, sellCoin } from '../logic/cryptoMarket';
import { markAsRead, handleMessageAction as processMsgAction } from '../logic/messageSystem';
import { validateTaskSlots, isTaskUnlocked, startTask } from '../logic/aiTaskSystem';
import { AI_TASK_DATA } from '../logic/agentTaskData';
import { audioManager } from '../logic/audioManager';
import { SKILL_DATA, getSlotConfig } from '../logic/skills';
import { AI_AGENT_MODEL_ENUM, AI_AGENT_MODEL_AND_PLAN_DATA } from '../logic/aiAgentModelClasses';
import { deleteMessage } from '../logic/messageSystem';
// import { formatGameTime, formatGameDate } from '../logic/timeSystem';

defineEmits(['sleep']);
const mainTab = ref('hardware');
const selectedMessage = ref(null);
const showSkillSelector = ref(false);
const showStatsModal = ref(false);
const showAgentModal = ref(false);
const selectedModelId = ref(store.aiAgent.name);
const selectedPlanIdx = ref(store.aiAgent.price_plan_idx);
const activeSlotIdx = ref(null);
const activeSlotType = ref(null);

const availableModelIds = computed(() => Object.keys(AI_AGENT_MODEL_AND_PLAN_DATA));
const currentModelIdx = computed(() => availableModelIds.value.indexOf(selectedModelId.value));

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

// Task Selector Logic
const showTaskModal = ref(false);
const currentTaskIdx = ref(0);
const currentTaskDef = computed(() => AI_TASK_DATA[currentTaskIdx.value]);
const selectedTaskSlotIdx = ref(-1);

const openTaskSelector = (idx) => {
  selectedTaskSlotIdx.value = idx;
  showTaskModal.value = true;
  audioManager.playSFX('ui-click');
};

const nextTask = () => {
  if (currentTaskIdx.value < AI_TASK_DATA.length - 1) {
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

const canStartCurrentTask = computed(() => {
  const task = currentTaskDef.value;
  if (!isTaskUnlocked(task)) return false;

  // Check LT for lump sum
  if (task.isLumpSum && store.ludusTokens < task.cost) return false;

  // Check if slot tier is sufficient
  const slot = taskSlots.value[selectedTaskSlotIdx.value];
  if (!slot) return false;
  const slotTier = parseInt(slot.tier.substring(1));
  if (task.tier > slotTier) return false;

  return true;
});

const taskInitiateBtnText = computed(() => {
  const task = currentTaskDef.value;
  if (!isTaskUnlocked(task)) return 'REQUIREMENT_NOT_MET';

  const slot = taskSlots.value[selectedTaskSlotIdx.value];
  if (slot) {
    const slotTier = parseInt(slot.tier.substring(1));
    if (task.tier > slotTier) return `LOW_TIER_MEMORY (REQ T${task.tier})`;
  }

  if (task.isLumpSum && store.ludusTokens < task.cost) return 'INSUFFICIENT_LT';
  return 'INITIATE_PROTOCOL';
});

const initiateTask = () => {
  if (startTask(currentTaskDef.value.id)) {
    showTaskModal.value = false;
    audioManager.playSFX('action-confirm');
  } else {
    audioManager.playSFX('ui-error');
  }
};

// Long press logic
const longPressIdx = ref(-1);
const longPressProgress = ref(0);
let longPressTimer = null;

const currentAgentSlots = computed(() => {
  const agentData = store.aiAgent.model; // This is the plan object from AI_AGENT_MODEL_AND_PLAN_DATA
  return agentData?.price_plan[store.aiAgent.price_plan_idx]?.slot || ['T1'];
});

const taskSlots = computed(() => {
  const slots = [];
  const allowedSlots = currentAgentSlots.value;

  for (let i = 0; i < 4; i++) {
    const taskState = store.onWorkTasks.find(t => t.slotIndex === i);
    const taskDef = taskState ? AI_TASK_DATA.find(t => t.id === taskState.taskId) : null;
    const isLocked = i >= allowedSlots.length;

    slots.push({
      tier: allowedSlots[i] || 'LOCKED',
      isLocked,
      task: taskDef,
      state: taskState,
      statusText: taskState ? taskState.status : (isLocked ? 'LOCKED' : 'IDLE')
    });
  }
  return slots;
});

const getTaskStatusClass = (slot) => {
  if (!slot.state) return {};
  const status = slot.state.status;
  return {
    'searching': status === 'SEARCHING',
    'active': status === 'ACTIVE',
    'cooldown': status === 'COOLDOWN'
  };
};

const isCurrentPlan = (modelId, idx) => {
  return store.aiAgent.name === modelId && store.aiAgent.price_plan_idx === idx;
};

const canPurchase = computed(() => {
  if (selectedPlanIdx.value === null) return false;
  const plan = AI_AGENT_MODEL_AND_PLAN_DATA[selectedModelId.value].price_plan[selectedPlanIdx.value];
  if (isCurrentPlan(selectedModelId.value, selectedPlanIdx.value)) return false;
  return store.bankroll >= plan.cost;
});

const purchaseBtnText = computed(() => {
  if (!selectedModelId.value) return 'SELECT AGENT';
  if (isCurrentPlan(selectedModelId.value, selectedPlanIdx.value)) return 'CURRENT PLAN';
  const plan = AI_AGENT_MODEL_AND_PLAN_DATA[selectedModelId.value].price_plan[selectedPlanIdx.value];
  if (store.bankroll < plan.cost) return 'INSUFFICIENT FUNDS';
  return `PURCHASE ( ${plan.cost.toLocaleString()} CR )`;
});

const confirmPurchase = () => {
  const plan = AI_AGENT_MODEL_AND_PLAN_DATA[selectedModelId.value].price_plan[selectedPlanIdx.value];
  if (store.bankroll < plan.cost) return;

  store.bankroll -= plan.cost;
  store.aiAgent.name = selectedModelId.value;
  store.aiAgent.model = AI_AGENT_MODEL_AND_PLAN_DATA[selectedModelId.value];
  store.aiAgent.price_plan_idx = selectedPlanIdx.value;
  // Set expiration to 30 days from now
  store.aiAgent.subscriptionExpireAt = store.gameTime + (30 * 24 * 60 * 60 * 1000);

  audioManager.playSFX('action-confirm');
  showAgentModal.value = false;

  // Clean up invalid tasks if slots decreased
  validateTaskSlots();
};

const startLongPress = (idx) => {
  if (!taskSlots.value[idx]?.state) return;
  longPressIdx.value = idx;
  longPressProgress.value = 0;

  const step = 5; // 5% per 100ms = 100% in 2s
  longPressTimer = setInterval(() => {
    longPressProgress.value += step;
    if (longPressProgress.value >= 100) {
      cancelTask(idx);
      cancelLongPress();
    }
  }, 100);
};

const cancelLongPress = () => {
  clearInterval(longPressTimer);
  longPressIdx.value = -1;
  longPressProgress.value = 0;
};

const cancelTask = (idx) => {
  const taskIdx = store.onWorkTasks.findIndex(t => t.slotIndex === idx);
  if (taskIdx !== -1) {
    store.onWorkTasks.splice(taskIdx, 1);
    audioManager.playSFX('ui-click');
  }
};

const xpPercent = computed(() => Math.min((store.xp / getNextLevelThreshold()) * 100, 100));
const equipItem = (instanceId) => {
  const item = store.ownedProtectors.find(p => p.instanceId === instanceId);
  if (item) {
    store.equippedProtector = item;
    // audioManager.playSFX('click');
    audioManager.playSFX('ui-click');
  }
}
const openSkillSelector = (idx, type) => {
  activeSlotIdx.value = idx;
  activeSlotType.value = type;
  showSkillSelector.value = true;
};
const closeSkillSelector = () => {
  showSkillSelector.value = false;
  activeSlotIdx.value = null;
  activeSlotType.value = null;
};
const getTierClass = (tier) => {
  return `tier-${tier}`;
}
const filteredSkillsForSlot = computed(() => {
  if (!activeSlotType.value) return [];
  const type = activeSlotType.value;
  return SKILL_DATA.filter(sk => {
    if (type === 'ULT') return true;
    const slotTier = parseInt(type.substring(1));
    const skTier = sk.tier === 'ULT' ? 99 : parseInt(sk.tier.substring(1));
    return skTier <= slotTier;
  });
});

const equipSkill = (skill) => {
  store.equippedSkills[activeSlotIdx.value] = skill;
  closeSkillSelector();
  audioManager.playSFX('action-confirm');
};

const unreadCount = computed(() => store.messages.filter(m => !m.isRead).length);
const deleteMessageBtn = (id) => {
  deleteMessage(id);
  if (store.messages.length > 0) selectedMessage.value = store.messages[0];
};
const selectMessage = (msg) => {
  selectedMessage.value = msg;
  if (!msg.isRead) markAsRead(msg.id);
};
const triggerMessageAction = (msgId, idx) => {
  processMsgAction(msgId, idx);
  selectedMessage.value = null;
};

const sellItem = (item) => {
  store.bankroll += Math.floor((item.price || 100) * 0.25);
  const idx = store.ownedProtectors.findIndex(p => p.instanceId === item.instanceId);
  if (idx !== -1) store.ownedProtectors.splice(idx, 1);
  audioManager.playSFX('coin-throw');
  if (store.equippedProtector?.instanceId === item.instanceId) store.equippedProtector = null;
};

// HUD Metrics
const vpip = computed(() => {
  if (!store.play_stats.played_hands) return 0;
  return ((store.play_stats.vpip_count / store.play_stats.played_hands) * 100).toFixed(1);
});

const pfr = computed(() => {
  if (!store.play_stats.played_hands) return 0;
  return ((store.play_stats.pfr / store.play_stats.played_hands) * 100).toFixed(1);
});

const wtsd = computed(() => {
  if (!store.play_stats.played_hands) return 0;
  return ((store.play_stats.wtsd / store.play_stats.played_hands) * 100).toFixed(1);
});

const wsd = computed(() => {
  if (!store.play_stats.wtsd) return 0;
  return ((store.play_stats.w$sd / store.play_stats.wtsd) * 100).toFixed(1);
});

const getStaminaColor = computed(() => {
  const s = store.stamina;
  if (s > 50) return '#00f0ff';
  if (s > 25) return '#f8ef00';
  return '#ff003c';
});
</script>
<style scoped src="../styles/components/SafeHouse.css"></style>
