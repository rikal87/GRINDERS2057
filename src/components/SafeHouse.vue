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
            <span class="label">CORE_STATUS</span>
            <button class="stats-btn" @click="$emit('open-stats-modal')">STATS</button>
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
                <span>{{ Math.floor(store.stamina) }} / {{ getEffectiveMaxStamina() }}</span>
              </div>
              <div class="v5-progress-track">
                <div class="v5-progress-fill"
                  :style="{ width: (store.stamina / getEffectiveMaxStamina() * 100) + '%', backgroundColor: getStaminaColor }">
                </div>
              </div>
            </div>
          </div>
        </div>
        <button class="btn" @click="$emit('sleep')">SLEEP</button>
        <!-- Program Setup -->
        <!-- Ai Agent Template -->
        <div class="v5-panel v5-neural-template">
          <div class="v5-panel-label">
            <span>AI_AGENT</span>
            <button class="set-up-agent-btn" @click="$emit('open-agent-modal')">SETUP</button>
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
                  <span class="val cyan">{{ Math.floor(store.ludusTokens).toLocaleString() }}
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

      <!-- CENTER COLUMN: Chip Protector / Partner / Crypto -->
      <section class="v5-main-col">
        <div class="v5-panel v5-storage-unit" style="flex:1; overflow:hidden">
          <div class="v5-tabs">
            <button :class="{ active: mainTab === 'hardware' }" @click="mainTab = 'hardware'">Chip Protector</button>
            <button :class="{ active: mainTab === 'partner' }" @click="mainTab = 'partner'">Partner</button>
            <!-- <button :class="{ active: mainTab === 'crypto' }" @click="mainTab = 'crypto'">Crypto Currency</button> -->
          </div>

          <div class="v5-item-container">
            <!-- Chip Protector View -->
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

            <!-- Partner View -->
            <template v-else-if="mainTab === 'partner'">
              <div class="partner-grid" v-if="getJoinedPartners().length > 0">
                <div v-for="partner in getJoinedPartners()" :key="partner.id" class="v5-panel-inner">
                  <div class="card-glow"></div>
                  <div class="card-header">
                    <div class="partner-info">
                      <div class="scanline"></div>
                      <span class="v5-class-title philosophy" :class="partner.philosophy.toLowerCase()">{{ partner.name
                      }}</span>
                    </div>
                  </div>
                  <div class="card-body">
                    <p class="v5-class-desc partner-note">{{ partner.note }}</p>
                    <p class="v5-status-badges">
                      <span class="v5-badge-mini status" :class="partner.status.toLowerCase()">{{ partner.status
                      }}</span>
                      <span v-for="contract in partner.contracts" :key="contract.type" class="v5-badge-mini"
                        :class="{ active: contract.active }" :data-tooltip="getContractLabel(contract.type)">
                        {{ contract.type }}
                      </span>
                    </p>
                    <div class="partner-stats-grid">
                      <div class="stat-box">
                        <span class="label">BANKROLL</span>
                        <span class="val bankroll">{{ partner.bankroll.toLocaleString() }} <small>CR</small></span>
                      </div>
                      <div class="stat-box">
                        <span class="label">CURRENT_DEBT</span>
                        <span class="val" :class="getProfitClass(partner.debt)">{{ partner.debt.toLocaleString() }}
                          <small>CR</small></span>
                      </div>
                      <div class="stat-box">
                        <span class="label">NET_WORTH</span>
                        <div class="net-worth-chart-container">
                          <svg viewBox="0 0 100 40" preserveAspectRatio="none" class="net-worth-sparkline">
                            <path :d="getNetWorthChartPath(partner)" fill="none" stroke="var(--neon-cyan)"
                              stroke-width="1.5" />
                          </svg>
                        </div>
                      </div>
                      <div class="stat-box">
                        <span class="label">RELATIONSHIP</span>
                        <span class="val" :class="getRelationClass(partner.relationship)">
                          {{ Math.round(partner.relationship / 10) }}
                        </span>
                      </div>
                      <div class="stat-box" v-for="contract in partner.contracts" :key="contract.type">
                        <span class="label">{{ contract.type }}</span>
                        <p class="v5-class-desc">
                          {{ CONTRACT_TYPE_DESC[contract.type].desc }}
                        </p>
                        <p class="v5-class-desc note">
                          {{ CONTRACT_TYPE_DESC[contract.type].note }}
                        </p>
                        <div v-if="contract.type === CONTRACT_TYPE.SHARE_BENEFIT">
                          <p>
                            <label class="ratio-group">
                              <span class="label">PARTNER</span>
                              <input type="range" min="0.1" max="0.9" step="0.1" value="0.5"
                                :disabled="!contract.active" v-model="contract.ratio"
                                @change="signContract(partner.id, contract.type, contract.ratio)">
                              <span class="label">YOU</span>
                            </label>
                            <label class="label"> {{ Math.round((1 - contract.ratio) * 10) }} : {{
                              Math.round(contract.ratio * 10) }}
                            </label>
                          </p>
                          <p>
                            <label class="label">
                              <span class="label">PROFIT_TOTAL(FOR_PARTNER)</span>
                              <span class="val" :class="getProfitClass(contract.profitTotal)">{{
                                contract.profitTotal.toLocaleString() }} <small>CR</small>
                              </span>
                            </label>
                          </p>
                        </div>
                        <div v-if="contract.type === CONTRACT_TYPE.BANKRUPT_RESCUE">
                          <p>
                            <label class="label">
                              <span class="label">SAFETY_MAKER</span>
                              <span class="val" :class="getProfitClass(contract.debt)">{{
                                contract.debt.toLocaleString() }} <small>CR</small>
                              </span>
                            </label>
                          </p>
                          <p>
                            <input type="range" min="0.0" max="1.0" step="0.01" :disabled="contract.debt > 0"
                              v-model="contract.ratio">
                            <label class="label"> {{ Math.round((contract.debt * contract.ratio)) }} CR
                            </label>
                          </p>
                        </div>
                        <p v-if="!contract.activeRepayment">
                          <button class="btn"
                            :disabled="partner.relationship < contract.requiredRelationship || contract.active || contract.cooldown > 0"
                            @click="signContract(partner.id, contract.type, contract.ratio)">SIGN</button>
                          <button class="btn" :disabled="!contract.active || contract.cooldown > 0"
                            @click="breakContract(partner.id, contract.type)">CANCEL</button>
                        </p>
                        <p v-else>
                          <button class="btn" @click="sendDebtRepayment(partner.id, contract.type)">REPAYMENT</button>
                        </p>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="card-footer">
                  </div> -->
                </div>
              </div>
              <div v-if="getJoinedPartners().length === 0" class="empty-stock">
                <h2>NO_PARTNER_AVAILABLE</h2>
                <p>FIND AT MISSION</p>
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
            <p style="text-align: right;">
              <button class="sell-btn" :disabled="selectedMessage.actions.length > 0"
                @click="deleteMessageBtn(selectedMessage.id)">DELETE</button>
            </p>
            <span class="v5-reader-title">{{ selectedMessage.title }}</span>
            <div class="v5-reader-body" v-html="selectedMessage.body">
            </div>
            <div class="v5-reader-actions">
              <button v-for="(act, idx) in selectedMessage.actions" :key="idx" class="btn"
                @click="triggerMessageAction(selectedMessage.id, idx)">
                {{ act.label }}
                <span v-if="act.payload">
                  {{ act.payload.amount ? ' ' + act.payload.amount.toLocaleString() : '' }}
                  {{ act.payload.currency ? ' ' + act.payload.currency : '' }}
                </span>
              </button>
            </div>
          </div>
          <div v-else class="v5-msg-h-reader">
            <div class="v5-reader-body" style="margin-top:20px">NO_MESSAGES</div>
          </div>
          <div class="v5-msg-list">
            <div v-for="msg in store.messages" :key="msg.id" class="v5-msg-card"
              :class="{ unread: !msg.isRead, active: selectedMessage?.id === msg.id }" @click="selectMessage(msg)">
              <div class="head">
                <div>
                  <span :class="`${msg.type.toLowerCase()}`">{{ msg.type }}</span>
                  <label> from.<span class="from"> {{ msg.sender }}</span></label>
                </div>
                <span>{{ new Date(msg.timestamp).toLocaleDateString() }}</span>
              </div>
              <div class="title">{{ msg.title }}</div>
            </div>
          </div>
        </div>
      </section>
    </div>


  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { store, getNextLevelThreshold, getEffectiveMaxStamina, gainBankroll, TYPE_CHANGE_BANKROLL } from '../logic/store';
import { marketState, sellCoin } from '../logic/cryptoMarket';
import { markAsRead, handleMessageAction as processMsgAction } from '../logic/messageSystem';
import { AI_TASK_DATA } from '../logic/aiAgentTaskData';
import { audioManager } from '../logic/audioManager';
import { deleteMessage } from '../logic/messageSystem';
import { CONTRACT_TYPE, CONTRACT_TYPE_DESC } from '../logic/partnerContractSystem';
import { signContract, breakContract, debtRepayment, getJoinedPartners } from '../logic/partnerSystem';
// import { formatGameTime, formatGameDate } from '../logic/timeSystem';
const getRelationClass = (v) => {
  if (v > 700) return 'high';
  if (v < 300) return 'low';
  else return '';
}
const getProfitClass = (v) => {
  if (v > 0.0) return 'high';
  if (v < 0.0) return 'low';
  else return '';
}
const emit = defineEmits(['sleep', 'back', 'open-task-selector', 'open-agent-modal', 'open-skill-selector', 'open-stats-modal']);
const mainTab = ref('hardware');
const selectedMessage = ref(null);


const repaymentAmount = ref(0);
const sendDebtRepayment = (partner, contract) => {
  debtRepayment(partner, Math.round(contract.debt * contract.ratio), false, contract);
  repaymentAmount.value = 0;
};

// Task Selector Logic
const openTaskSelector = (idx) => {
  emit('open-task-selector', idx);
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
    'networking': status === 'NETWORKING',
    'active': status === 'ACTIVE',
    'cooldown': status === 'COOLDOWN'
  };
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
  gainBankroll(item.price * 0.25, TYPE_CHANGE_BANKROLL.SELL_ITEM)
  const idx = store.ownedProtectors.findIndex(p => p.instanceId === item.instanceId);
  if (idx !== -1) store.ownedProtectors.splice(idx, 1);
  audioManager.playSFX('coin-throw');
  if (store.equippedProtector?.instanceId === item.instanceId) store.equippedProtector = null;
};


const getStaminaColor = computed(() => {
  const s = store.stamina;
  if (s > 50) return '#00f0ff';
  if (s > 25) return '#f8ef00';
  return '#ff003c';
});
// CONTRACT_TYPE
const getContractLabel = (type) => {
  const lang = store.settings.language;
  const labels = {
    'SHARE_BENEFIT': lang === 'ko' ? '수익률 스왑' : 'Share Benefit',
    'BANKRUPT_RESCUE': lang === 'ko' ? '파산 구조' : 'Bankrupt Rescue',
    'COLLUSION': lang === 'ko' ? '담합' : 'Collusion',
    'A_DATE_WITH_YOU': lang === 'ko' ? '데이트 신청' : 'A Date with You',
  };
  return labels[type] || type;
};

const getNetWorthChartPath = (partner) => {
  const history = partner.netWorthHistory || [];
  if (history.length < 2) return "M 0 20 L 100 20";

  // Filter for last 7 days (approx 168 hours)
  const maxPoints = 168;
  const data = history.slice(-maxPoints).map(h => h.netWorth);

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = 100 / (data.length - 1);

  return data.map((val, i) => {
    const x = i * stepX;
    const y = 40 - ((val - min) / range) * 35 - 2.5; // Scale and offset to keep in 40px height
    return (i === 0 ? "M " : "L ") + `${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
};
</script>
<style scoped src="../styles/components/SafeHouse.css"></style>
