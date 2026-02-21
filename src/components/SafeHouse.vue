<template>
  <div class="safe-house v5">
    <div class="v5-bg-scan"></div>

    <!-- 2. CONTROL BAR (ABORT / USER) -->
    <!-- <div class="v5-control-bar">
      <button class="v5-btn-abort" @click="$emit('back')">LEAVE_SAFEHOUSE [ESC]</button>
      <div class="v5-user-profile">
        <div class="v5-portrait-frame">
          <div class="v5-sq cyan"></div>
          <div class="v5-sq red"></div>
          <div class="v5-sq yellow"></div>
        </div>
        <div class="v5-user-meta">
          <span class="v5-user-class-label">PORTRAIT_CONFIG</span>
          <span class="v5-user-class-val">{{ store.selectedClass.toUpperCase() }}</span>
          <div class="v5-user-name">USER_UNIFIED_01</div>
        </div>
      </div>
    </div> -->

    <div class="v5-body">

      <!-- LEFT COLUMN: STATUS & SETUP -->
      <section class="v5-side-col">
        <!-- Core Vitality -->
        <div class=" v5-panel v5-core-vitality">
          <div class="v5-panel-label">CORE_VITALITY</div>
          <div class="v5-panel-inner">
            <div class="v5-stat-row">
              <div class="v5-stat-group">
                <span class="label">BANKROLL</span>
                <span class="bankroll">{{ store.bankroll.toLocaleString() }} <small ">CR</small></span>
              </div>
            </div>
            <div class=" v5-stat-row">
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
              </div>
            </div>
          </div>

          <!-- Program Setup -->
          <!-- Ai Agent Template -->
          <div class="v5-panel v5-neural-template">
            <div class="v5-panel-label">DESCRIPTED_AI</div>
            <div class="v5-panel-inner">
              <div class="v5-neural-hero">
                <span class="v5-class-title">{{ aiAgent.name }}</span>
                <p class="v5-class-desc">
                  {{ aiAgent.model.slogan }}
                </p>
                <div class="v5-stat-row">
                  <div class="v5-stat-group">
                    <span class="label">Ludus Tokens</span>
                    <span class="bankroll">{{ store.ludusTokens.toLocaleString() }} <small ">LT</small></span>
              </div>
              </div>
                <div class=" v5-status-badges">
                        <span class="v5-badge-mini">HUD_ACTIVE</span>
                        <span class="v5-badge-mini">ANTI_FOLD_SIG</span>
                        <span class="v5-badge-mini">RAM_BOOST_V1</span>
                  </div>
                </div>
              </div>
              <div class="v5-panel-inner">
                <div class="v5-slot-list">
                  <div v-for="(task, idx) in TASK_SLOT" :key="idx" class="v5-slot-item">
                    <div class="v5-slot-meta">
                      <span class="v5-slot-tier-tag"> T{{ task.tier }}</span>
                      <span class="name">{{ task.name }}</span>
                    </div>
                    <div class="v5-slot-status">IDLE</div>
                  </div>
                </div>
              </div>
            </div>
      </section>

      <!-- CENTER COLUMN: GEAR / STORAGE -->
      <section class="v5-main-col">
        <div class="v5-panel v5-storage-unit" style="flex:1; overflow:hidden">
          <div class="v5-panel-label">STORAGE_UNIT</div>
          <div class="v5-tabs">
            <button :class="{ active: mainTab === 'hardware' }" @click="mainTab = 'hardware'">HARDWARE</button>
            <button :class="{ active: mainTab === 'crypto' }" @click="mainTab = 'crypto'">CRYPTO</button>
          </div>

          <div class="v5-item-container">
            <!-- Hardware View -->
            <template v-if="mainTab === 'hardware'">
              <div v-for="p in store.ownedProtectors" :key="p.instanceId" class="item-card"
                :class="{ equipped: store.equippedProtector?.instanceId === p.instanceId }">
                <div class="v5-item-icon-box">
                  <span :class="['tier-tag', 'tier-' + p.tier]">{{ p.tier || 'T1' }}</span>
                  <span class="icon">{{ p.icon }}</span>
                </div>
                <div class="v5-item-h-body">
                  <div class="v5-item-h-head">
                    <span class="v5-item-h-name">{{ p.name }}</span>
                    <span class="v5-item-h-status"
                      v-if="store.equippedProtector?.instanceId === p.instanceId">ACTIVE_LINK</span>
                  </div>
                  <p class="v5-item-h-desc">{{ p.desc || 'Standard issue hardware module. Reliability: High.' }}</p>
                  <div class="v5-item-h-meta">
                    <div class="v5-item-h-actions">
                      <button v-if="store.equippedProtector?.instanceId !== p.instanceId" class="equip"
                        @click="equip(p)">MOUNT</button>
                      <button class="sell" @click="sellItem(p)">SELL {{ Math.floor(p.price * 0.25) }} CR</button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="store.ownedProtectors.length === 0" class="v4-empty-state">CARGO_EMPTY</div>
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
          <div class="v5-panel-label">SECURE_COMMS <small v-if="unreadCount" style="color:var(--accent-red)">[{{
            unreadCount
          }} UNREAD]</small></div>

          <div class="v5-msg-list">
            <div v-for="msg in store.messages" :key="msg.id" class="v5-msg-card"
              :class="{ unread: !msg.isRead, active: selectedMessage?.id === msg.id }" @click="selectMessage(msg)">
              <div class="head">
                <span>{{ msg.type }}</span>
                <span>{{ new Date(msg.timestamp).toLocaleDateString() }}</span>
              </div>
              <div class="title">{{ msg.title }}</div>
            </div>

            <!-- Message Reader Integrated -->
            <div v-if="selectedMessage" class="v5-msg-h-reader">
              <span class="v5-reader-title">DECIPHERED_CONTENT:</span>
              <div class="v5-reader-body">{{ selectedMessage.body }}</div>
              <div class="v5-reader-actions">
                <button v-for="(act, idx) in selectedMessage.actions" :key="idx" class="v4-btn cyan"
                  @click="triggerMessageAction(selectedMessage.id, idx)">
                  {{ act.label }}
                </button>
              </div>
            </div>
            <div v-else class="v4-empty-state" style="margin-top:20px">SELECT_PACKET_TO_READ</div>
          </div>
        </div>
      </section>

    </div>

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
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { store, getNextLevelThreshold } from '../logic/store';
import { marketState, sellCoin } from '../logic/cryptoMarket';
import { markAsRead, handleMessageAction as processMsgAction } from '../logic/messageSystem';
import { AI_TASK_DATA, startTask } from '../logic/aiTaskSystem';
import { audioManager } from '../logic/audioManager';
import { SKILL_DATA, getSlotConfig } from '../logic/skills';
import { AI_AGENT_MODEL_ENUM, AI_AGENT_MODEL_AND_PLAN_DATA } from '../logic/aiAgentModelClasses';
import { formatGameTime, formatGameDate } from '../logic/timeSystem';

const mainTab = ref('hardware');
const selectedMessage = ref(null);
const showSkillSelector = ref(false);
const activeSlotIdx = ref(null);
const activeSlotType = ref(null);

// store.aiAgent.value.model = AI_AGENT_MODEL_ENUM.VANGUARD;
// store.aiAgent.value.price_plan_idx = 0;
console.info(store.aiAgent.value);
// const aiAgent = AI_AGENT_MODEL_AND_PLAN_DATA[store.aiAgent.value.model][store.aiAgent.value.price_plan_idx];
const DEFAULT_AI_AGENT = {
  name: AI_AGENT_MODEL_ENUM.VANGUARD,
  price_plan_idx: 0,
  model: AI_AGENT_MODEL_AND_PLAN_DATA[AI_AGENT_MODEL_ENUM.VANGUARD],
  subscriptionExpireAt: 0,
  activeTasks: [],
}
const TASK_SLOT = ref([
  {
    tier: 0,
    taskId: 'task_1',
    startTime: null,
    lastProcessTime: null,
  },
  {
    tier: 0,
    taskId: 'task_2',
    startTime: null,
    lastProcessTime: null,
  },
  {
    tier: 0,
    taskId: 'task_3',
    startTime: null,
    lastProcessTime: null,
  },
  {
    tier: 0,
    taskId: 'task_4',
    startTime: null,
    lastProcessTime: null,
  },
  {
    tier: 0, // if tier === 0, it means it is locked and paused work task
    taskId: 'task_5',
    startTime: null,
    lastProcessTime: null,
  }
])
if (!store.aiAgent.value) store.aiAgent.value = DEFAULT_AI_AGENT;
// let timer = null;
// store.aiAgent.value = DEFAULT_AI_AGENT;
let aiAgent = store.aiAgent.value;

const currentSlots = computed(() => getSlotConfig(store.level));
const xpPercent = computed(() => Math.min((store.xp / getNextLevelThreshold()) * 100, 100));

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
const selectMessage = (msg) => {
  selectedMessage.value = msg;
  if (!msg.isRead) markAsRead(msg.id);
};
const triggerMessageAction = (msgId, idx) => {
  processMsgAction(msgId, idx);
  selectedMessage.value = null;
};

const equip = (item) => {
  store.equippedProtector = item;
  audioManager.playSFX('action-confirm');
};

const sellItem = (item) => {
  if (store.equippedProtector?.instanceId === item.instanceId) return;
  store.bankroll += Math.floor((item.price || 100) * 0.25);
  const idx = store.ownedProtectors.findIndex(p => p.instanceId === item.instanceId);
  if (idx !== -1) store.ownedProtectors.splice(idx, 1);
  audioManager.playSFX('coin-throw');
};

const formatFullTime = (ts) => {
  const d = new Date(ts);
  return d.toISOString().replace('T', ' ').split('.')[0];
};

const getItemIcon = (item) => {
  // Simple emoji mapping for now, can be replaced with assets
  if (item.name.includes('Phone') || item.name.includes('전화')) return '☎️';
  if (item.name.includes('Chips') || item.name.includes('칩')) return '🍟';
  return '📦';
};
</script>

<style scoped src="../styles/components/SafeHouse.css"></style>
