<template>
  <footer class="control-panel" v-if="engine">

    <!-- ══════════════════════════════════════════════
         MOBILE: 3-패널 스와이프 레이아웃
         [ INBOX ] [ BETTING(default) ] [ HUD/SKILLS ]
    ══════════════════════════════════════════════ -->
    <div class="mobile-swipe-container" ref="swipeContainer" @scroll.passive="onSwipeScroll">

      <!-- PANEL 0: 메시지함 (왼쪽) -->
      <div class="swipe-panel panel-inbox">
        <div class="panel-label">SYS.COMM.LOG //</div>
        <div class="message-list">
          <div v-for="msg in store.messages" :key="msg.id" class="message-item" :class="{ 'unread': !msg.isRead }">
            <span class="msg-indicator" v-if="!msg.isRead">*</span>
            <span class="msg-title">{{ msg.title }}</span>
          </div>
          <div v-if="store.messages.length === 0" class="empty-msg">NO_NEW_MESSAGES</div>
        </div>
      </div>

      <!-- PANEL 1: 베팅 인터페이스 (중앙 / 기본) -->
      <div class="swipe-panel panel-betting">
        <div class="shortcuts">
          <template v-if="engine.state === 'PREFLOP'">
            <button @click="setBet('min')">MIN</button>
            <button @click="setBet('2.2BB')">2.2BB</button>
            <button @click="setBet(1)">100%</button>
            <button @click="setBet(1.2)">120%</button>
          </template>
          <template v-else>
            <button @click="setBet(.3)">30%</button>
            <button @click="setBet(.5)">50%</button>
            <button @click="setBet(0.8)">80%</button>
            <button @click="setBet(1.2)">120%</button>
          </template>
        </div>
        <div class="slider-area">
          <input type="range" :min="minRaise" :max="playerTotalAvailable" step="1" v-model.number="currentBetValue"
            class="bet-slider" />
          <div class="bet-display">
            <span class="value">{{ formatUnit(currentBetValue) }}</span>
            <span class="label">SET CHARGE</span>
          </div>
        </div>
        <div class="actions">
          <button class="btn-fold" :disabled="!isMyTurn || isProcessing"
            @click="handleAction({ type: 'fold' })">FOLD</button>
          <button class="btn-call" :disabled="!isMyTurn || isProcessing"
            @click="handleAction({ type: callAmountRaw >= playerChips ? 'all_in' : 'call', amount: callAmountRaw + player.currentBet })">
            <p>{{ callAmountRaw === 0 ? 'CHECK' : callAmountRaw >= playerChips ? 'ALL-IN' : 'CALL' }}</p>
            <p>{{ formatUnit(callAmountRaw) }}</p>
          </button>
          <button class="btn-raise" :disabled="!isMyTurn || isProcessing || currentBetValue < minRaise"
            @click="handleAction({ type: isAllInSelection ? 'all_in' : 'raise', amount: isAllInSelection ? playerTotalAvailable : currentBetValue })">
            <p>{{ isAllInSelection ? 'ALL-IN' : 'RAISE' }}</p>
            <p>{{ formatUnit(isAllInSelection ? playerTotalAvailable : currentBetValue) }}</p>
          </button>
        </div>
      </div>

      <!-- PANEL 2: HUD + 스킬패널 (오른쪽) -->
      <div class="swipe-panel panel-hud">
        <!-- Exit Controls -->
        <div class="status-row exit-controls" v-if="!engine.isDeathmatch">
          <button class="btn-cashout" :disabled="!player.isFolded" @click="handleCashout"
            :data-tooltip="cashoutTooltip">CASHOUT</button>
          <button class="btn-reserve-exit" :class="{ 'inactive': engine.exitReservationRounds === -1 }"
            :data-tooltip="reserveExitTooltip" :disabled="!player.isFolded || engine.exitReservationRounds !== -1"
            @click="handleReserveExit" :style="engine.exitReservationRounds >= 0 ? {
              '--gauge-percent': `${(engine.exitReservationRounds / Math.max(engine.exitReservationRoundsMax, 1)) * 100}%`
            } : { '--gauge-percent': '0%' }">
            {{ engine.exitReservationRounds >= 0 ? `EXIT IN ${engine.exitReservationRounds} ROUNDS` : 'RESERVE EXIT' }}
          </button>
        </div>
        <!-- Item Effects -->
        <div class="status-row" v-if="player.item">
          <div class="protector-badge" :data-tooltip="player.item.desc">
            {{ player.item.icon }}
          </div>
          <div v-if="player.item.effects && player.item.effects.length > 0" class="effect-hud">
            <div v-for="eff in player.item.effects" :key="eff.id" class="effect-wrapper"
              :data-tooltip="getEffectDesc(eff)">
              <div class="effect-item" :class="{ 'cooldown': eff.cooldown > 0 }">
                <div class="eff-icon">{{ eff.icon }}</div>
                <div v-if="eff.cooldown > 0" class="cooldown-gauge"
                  :style="{ height: (eff.maxCooldown ? (eff.cooldown / eff.maxCooldown * 100) : 100) + '%' }">
                </div>
                <div v-if="eff.stack >= 1" class="eff-stack">{{ eff.stack }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- HUD Stats -->
        <div class="hud-strip">
          <div class="permanent-hud double">
            <div class="hud-stat">
              <span class="label">{{ getLanguage() === 'ko' ? '승리 조건' : 'WIN_CONDITION' }}:</span>
              <span class="value" :class="victoryConditionChips >= acquiredChips ? 'yellow' : 'green'">
                {{ formatUnit(acquiredChips) }} / {{ formatUnit(victoryConditionChips) }}
              </span>
            </div>
          </div>
          <div class="permanent-hud">
            <div class="hud-stat" :class="{ 'low-stamina': store.stamina < 25 }">
              <span class="label">STAMINA:</span>
              <span class="value" :style="{ color: getStaminaColor }">{{ Math.floor(store.stamina) }} / {{
                getEffectiveMaxStamina() }}</span>
            </div>
          </div>
          <div class="permanent-hud" v-if="isActiveHandHud()">
            <div class="hud-stat">
              <span class="label">HAND:</span>
              <span class="value">{{ currentHandRank }}</span>
            </div>
          </div>
          <div class="permanent-hud" v-if="isActiveSuspicionHud()">
            <div class="hud-stat">
              <span class="label">SUSPICION:</span>
              <span class="value" :style="{ color: getSuspicionColorLabelClass(props.engine.zoneId) }">{{
                getCurrentSuspicion(props.engine.zoneId) }}/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 모바일 패널 위치 인디케이터 (dot) -->
    <div class="swipe-dots">
      <span class="dot" :class="{ active: activePanelIndex === 0 }" @click="scrollToPanel(0)"></span>
      <span class="dot" :class="{ active: activePanelIndex === 1 }" @click="scrollToPanel(1)"></span>
      <span class="dot" :class="{ active: activePanelIndex === 2 }" @click="scrollToPanel(2)"></span>
    </div>

    <!-- ══════════════════════════════════════════════
         DESKTOP: 기존 3-컬럼 레이아웃 유지
    ══════════════════════════════════════════════ -->
    <aside class="inbox-panel desktop-only">
      <div class="inbox-header">SYS.COMM.LOG //</div>
      <div class="message-list">
        <div v-for="msg in store.messages" :key="msg.id" class="message-item" :class="{ 'unread': !msg.isRead }">
          <span class="msg-indicator" v-if="!msg.isRead">*</span>
          <span class="msg-title">{{ msg.title }}</span>
        </div>
        <div v-if="store.messages.length === 0" class="empty-msg">NO_NEW_MESSAGES</div>
      </div>
    </aside>

    <div class="betting-interface desktop-only">
      <div class="actions">
        <button class="btn-fold" :disabled="!isMyTurn || isProcessing"
          @click="handleAction({ type: 'fold' })">FOLD</button>
        <button class="btn-call" :disabled="!isMyTurn || isProcessing"
          @click="handleAction({ type: callAmountRaw >= playerChips ? 'all_in' : 'call', amount: callAmountRaw + player.currentBet })">
          <p>{{ callAmountRaw === 0 ? 'CHECK' : callAmountRaw >= playerChips ? 'ALL-IN' : 'CALL' }}</p>
          <p>{{ formatUnit(callAmountRaw) }}</p>
        </button>
        <button class="btn-raise" :disabled="!isMyTurn || isProcessing || currentBetValue < minRaise"
          @click="handleAction({ type: isAllInSelection ? 'all_in' : 'raise', amount: isAllInSelection ? playerTotalAvailable : currentBetValue })">
          <p>{{ isAllInSelection ? 'ALL-IN' : 'RAISE' }}</p>
          <p>{{ formatUnit(isAllInSelection ? playerTotalAvailable : currentBetValue) }}</p>
        </button>
      </div>
      <div class="slider-area">
        <input type="range" :min="minRaise" :max="playerTotalAvailable" step="1" v-model.number="currentBetValue"
          class="bet-slider" />
        <div class="bet-display">
          <span class="value">{{ formatUnit(currentBetValue) }}</span>
          <span class="label">SET CHARGE</span>
        </div>
      </div>
      <div class="shortcuts">
        <template v-if="engine.state === 'PREFLOP'">
          <button @click="setBet('min')">MIN</button>
          <button @click="setBet('2.2BB')">2.2BB</button>
          <button @click="setBet(1)">100%</button>
          <button @click="setBet(1.2)">120%</button>
        </template>
        <template v-else>
          <button @click="setBet(.3)">30%</button>
          <button @click="setBet(.5)">50%</button>
          <button @click="setBet(0.8)">80%</button>
          <button @click="setBet(1.2)">120%</button>
        </template>
      </div>
    </div>

    <div class="skill-panel desktop-only">
      <div class="status-row exit-controls" v-if="!engine.isDeathmatch">
        <button class="btn-cashout" :disabled="!player.isFolded" @click="handleCashout"
          :data-tooltip="cashoutTooltip">CASHOUT</button>
        <button class="btn-reserve-exit" :class="{ 'inactive': engine.exitReservationRounds === -1 }"
          :data-tooltip="reserveExitTooltip" :disabled="!player.isFolded || engine.exitReservationRounds !== -1"
          @click="handleReserveExit" :style="engine.exitReservationRounds >= 0 ? {
            '--gauge-percent': `${(engine.exitReservationRounds / Math.max(engine.exitReservationRoundsMax, 1)) * 100}%`
          } : { '--gauge-percent': '0%' }">
          {{ engine.exitReservationRounds >= 0 ? `EXIT IN ${engine.exitReservationRounds} ROUNDS` : 'RESERVE EXIT' }}
        </button>
      </div>
      <div class="status-row" v-if="player.item">
        <div class="protector-badge" :data-tooltip="player.item.desc">
          {{ player.item.icon }}
        </div>
        <div v-if="player.item.effects && player.item.effects.length > 0" class="effect-hud">
          <div v-for="eff in player.item.effects" :key="eff.id" class="effect-wrapper"
            :data-tooltip="getEffectDesc(eff)">
            <div class="effect-item" :class="{ 'cooldown': eff.cooldown > 0 }">
              <div class="eff-icon">{{ eff.icon }}</div>
              <div v-if="eff.cooldown > 0" class="cooldown-gauge"
                :style="{ height: (eff.maxCooldown ? (eff.cooldown / eff.maxCooldown * 100) : 100) + '%' }">
              </div>
              <div v-if="eff.stack >= 1" class="eff-stack">{{ eff.stack }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="hud-strip">
        <div class="permanent-hud double">
          <div class="hud-stat">
            <span class="label">{{ getLanguage() === 'ko' ? '승리 조건' : 'WIN_CONDITION' }}:</span>
            <span class="value" :class="victoryConditionChips >= acquiredChips ? 'yellow' : 'green'">
              {{ formatUnit(acquiredChips) }} / {{ formatUnit(victoryConditionChips) }}
            </span>
          </div>
        </div>
        <div class="permanent-hud">
          <div class="hud-stat" :class="{ 'low-stamina': store.stamina < 25 }">
            <span class="label">STAMINA:</span>
            <span class="value" :style="{ color: getStaminaColor }">{{ Math.floor(store.stamina) }} / {{
              getEffectiveMaxStamina() }}</span>
          </div>
        </div>
        <div class="permanent-hud" v-if="isActiveHandHud()">
          <div class="hud-stat">
            <span class="label">HAND:</span>
            <span class="value">{{ currentHandRank }}</span>
          </div>
        </div>
        <div class="permanent-hud" v-if="isActiveSuspicionHud()">
          <div class="hud-stat">
            <span class="label">SUSPICION:</span>
            <span class="value" :style="{ color: getSuspicionColorLabelClass(props.engine.zoneId) }">{{
              getCurrentSuspicion(props.engine.zoneId) }}/100</span>
          </div>
        </div>
      </div>
      <button v-for="skillId in store.unlockedSkills" :key="skillId" class="skill-btn"
        :disabled="store.stamina < store.getSkillCost(skillId)" @click="emit('skill', skillId)"
        :class="{ 'disabled': store.stamina < store.getSkillCost(skillId) }">
        <div class="skill-meta">
          <span class="skill-philosophy">{{ store.getSkillPhilosophy(skillId) }}</span>
          <span class="skill-name">{{ store.getSkillDisplayName(skillId) }}</span>
        </div>
        <span class="skill-cost">{{ store.getSkillCost(skillId) }} RAM</span>
      </button>
    </div>

    <!-- Custom Cashout Modal -->
    <Transition name="fade">
      <div v-if="showCashoutModal" class="overlay">
        <div class="terminal-msg danger cyber-modal">
          <h2 class="glitch-text" data-text="CASHOUT_WARNING">CASHOUT_WARNING</h2>
          <h3 class="critical-msg">
            Are you sure you want to cashout instantly?
          </h3>
          <p>
            Leaving the table without prior notification is a violation of house rules, regardless of your current
            standing
          </p>
          <div class="popup-actions">
            <button class="btn-confirm btn-accept" @click="confirmCashout">CONFIRM</button>
            <button class="btn-cancel btn-cancel" @click="showCashoutModal = false">CANCEL</button>
          </div>
        </div>
      </div>
    </Transition>
  </footer>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { evaluateHand } from '../logic/poker.js';
import { store, getEffectiveMaxStamina, getLanguage, isActiveHandHud, isActiveSuspicionHud, getCurrentSuspicion } from '../logic/store';
import { audioManager } from '../logic/audioManager.js';

// ── 모바일 스와이프 패널 로직 ──
const swipeContainer = ref(null);
const activePanelIndex = ref(1); // 기본: 중앙(베팅) 패널

const scrollToPanel = (index) => {
  if (!swipeContainer.value) return;
  const panelWidth = swipeContainer.value.clientWidth;
  swipeContainer.value.scrollTo({ left: panelWidth * index, behavior: 'smooth' });
  activePanelIndex.value = index;
};

const onSwipeScroll = () => {
  if (!swipeContainer.value) return;
  const panelWidth = swipeContainer.value.clientWidth;
  const scrollLeft = swipeContainer.value.scrollLeft;
  activePanelIndex.value = Math.round(scrollLeft / panelWidth);
};

onMounted(() => {
  nextTick(() => {
    // 마운트 시 중앙 패널(베팅)로 초기화
    scrollToPanel(1);
  });
});
const getSuspicionColorLabelClass = (locationId) => {
  const suspicion = getCurrentSuspicion(locationId);
  if (suspicion >= 80) return 'CRITICAL';
  else if (suspicion >= 60) return 'HIGH';
  else if (suspicion >= 40) return 'MEDIUM';
  else if (suspicion >= 20) return 'LOW';
  else return 'NONE';
}
const props = defineProps({
  engine: Object
});
const victoryConditionChips = computed(() => {
  return Math.round(props.engine.bb * 30);
});
const emit = defineEmits(['action', 'skill']);
const cashoutTooltip = computed(() => {
  return getLanguage() === 'ko' ?
    '현재 가지고 있는 칩을 즉시 현금화하여 테이블을 떠납니다.(패널티 존재)'
    : 'Cash out your current chips and leave the table immediately. (Penalty applies)';
});
const reserveExitTooltip = computed(() => {
  return getLanguage() === 'ko' ?
    '지정된 라운드 후에 칩을 현금화하고 테이블을 떠납니다.(패널티 없음)'
    : 'Cash out and leave the table after the specified rounds. (No penalty)';
});
const player = computed(() => props.engine.players[0]);
const isMyTurn = computed(() => {
  return props.engine.currentPlayerIndex === 0 &&
    !props.engine.calculationInProgress &&
    !props.engine.runoutInProgress;
});
const playerChips = computed(() => player.value.chips);
const playerTotalAvailable = computed(() => player.value.chips + player.value.currentBet);
const isAllInSelection = computed(() => {
  const remaining = playerTotalAvailable.value - currentBetValue.value;
  return remaining < (props.engine.bb || 2);
});

const callAmountRaw = computed(() => Math.min(props.engine.currentRoundBet - player.value.currentBet, playerChips.value));
const minRaise = computed(() => {
  const currentBet = props.engine.currentRoundBet || 0;
  const bb = props.engine.bb || 2;
  const logicalMin = Math.max(currentBet * 2, bb);
  return Math.min(logicalMin, playerTotalAvailable.value);
});
const currentBetValue = ref(minRaise.value);

const acquiredChips = computed(() => player.value.chips - player.value.totalBuyIn);

const formatUnit = (val) => {
  if (store.settings.showAsBB && props.engine.bb > 0) {
    return (val / props.engine.bb).toFixed(1) + ' BB';
  }
  return val.toLocaleString() + ' CR';
};

const currentHandRank = computed(() => {
  if (!player.value.hand.length) return 'N/A';
  const evalResult = evaluateHand([...player.value.hand, ...props.engine.board]);
  // Returning shorter rank name for HUD
  return evalResult.name;
});

const getStaminaColor = computed(() => {
  const s = store.stamina;
  if (s > 50) return '#00f0ff'; // neon-cyan
  if (s > 25) return '#f8ef00'; // neon-yellow
  return '#ff003c'; // neon-red
});

const isProcessing = ref(false);
const showCashoutModal = ref(false);

watch(isMyTurn, (newVal) => {
  if (newVal) {
    isProcessing.value = false;
  }
});
watch(() => props.engine.state, () => {
  if (props.engine.state === 'PREFLOP') currentBetValue.value = minRaise.value; // Reset slider when street/round changes
});
watch(minRaise, (newVal) => {
  currentBetValue.value = Math.max(currentBetValue.value, newVal);
});

const handleAction = (payload) => {
  if (!isMyTurn.value || isProcessing.value) return;
  isProcessing.value = true;
  emit('action', payload);
  // Safety timeout in case the turn change doesn't happen fast enough
  setTimeout(() => {
    isProcessing.value = false;
  }, 500);
};

const setBet = (type) => {
  const pot = props.engine.pot;
  const bb = props.engine.bb;
  const currentRoundBet = props.engine.currentRoundBet;

  switch (type) {
    case 'min':
      currentBetValue.value = minRaise.value;
      break;
    case '2.2BB':
      currentBetValue.value = Math.max(minRaise.value, Math.min(Math.floor(bb * 2.2), playerChips.value));
      break;
    case 'pot':
      currentBetValue.value = Math.min(pot, playerTotalAvailable.value);
      break;
    default: {
      if (typeof type === 'number') {
        if (type > 100) { // Assume All-in for huge numbers
          currentBetValue.value = playerTotalAvailable.value;
        } else {
          currentBetValue.value = Math.max(minRaise.value, Math.min(Math.floor((pot + currentRoundBet) * type), playerTotalAvailable.value));
        }
      }
    } break;
  }
};

const getEffectDesc = (effDef) => {
  const base = effDef.desc || effDef.originalDef?.desc || effDef.effect?.type || 'Effect';
  const eff = effDef.effect || effDef;

  // If stack exists, append info
  if (eff.stack > 1) {
    return `${base}\n(Stack: ${eff.stack})`;
  }
  return base;
};

// --- Exit Handlers ---
const handleCashout = () => {
  // if (isProcessing.value) return;
  // Apply full infamy calculation
  // let msg = ''
  // if (props.engine.suspicion < 80) msg = `You will gain ${props.engine.infamy} infamy.`
  // else msg = `You will gain ${props.engine.infamy} infamy and ${props.engine.suspicion * 1.5} suspicion.`
  audioManager.playSFX('ui-click');
  showCashoutModal.value = true;
};

const confirmCashout = () => {
  audioManager.playSFX('ui-click');
  showCashoutModal.value = false;
  props.engine.cashOut();
  // emit('action', { type: 'cashout' });
};

const handleReserveExit = () => {
  if (isProcessing.value) return;
  audioManager.playSFX('ui-click');
  // Calculate Reservation Rounds based on Suspicion
  let roundsToWait = props.engine.exitReservationRoundDefault;
  if (props.engine.suspicion >= 40) roundsToWait += 20;
  else if (props.engine.suspicion >= 20) roundsToWait += 10;
  props.engine.exitReservationRoundsMax = roundsToWait;
  props.engine.exitReservationRounds = roundsToWait;
};
</script>

<style scoped>
.critical-msg {
  font-size: 1.5rem;
  color: var(--neon-red);
}
.control-panel {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
  background: rgba(5, 10, 14, 0.8);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--glass-border);
  z-index: 10;
  position: relative;
}

/* Ensure buttons pop over scanlines */
button {
  backface-visibility: hidden;
  transform: translateZ(0);
}

/* ══════════════════════════════════════════════
   MOBILE-ONLY 요소 / DESKTOP-ONLY 요소
══════════════════════════════════════════════ */
.mobile-swipe-container,
.swipe-dots {
  display: none;
  /* 모바일에서만 표시 */
}
.desktop-only {
  display: flex;
  /* 데스크톱에서만 표시 */
}
aside.inbox-panel.desktop-only {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 154px;
  min-height: 154px;
}

/* ══════════════════════════════════════════════
   DESKTOP: 기존 3-컬럼 레이아웃
══════════════════════════════════════════════ */
.betting-interface {
  flex: 2;
  max-width: 600px;
}
.permanent-hud {
  max-width: 500px;
}
.skill-panel {
  flex: 1.5;
  max-width: 500px;
}

.betting-interface {
  background: rgba(0, 240, 255, 0.05);
  padding: 15px;
  border-radius: 8px;
  border: 1px solid var(--glass-border);
}
.actions button p {
  margin: 0;
  color: unset;
}
.actions button.active {
  background: var(--accent-color);
}
.shortcuts {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 15px;
}

.shortcuts button {
  padding: 12px 8px;
  font-size: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.slider-area {
  margin-bottom: 20px;
}

.bet-display {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 10px;
}

.bet-display .value {
  font-size: 1.5rem;
  color: var(--neon-yellow);
}

.bet-display .label {
  font-size: 0.6rem;
  color: var(--neon-cyan);
  opacity: 0.7;
}

/* Custom Slider Styling */
.bet-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  background: #1a1a1a;
  border: 1px solid var(--neon-cyan);
  outline: none;
}

.bet-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: var(--neon-magenta);
  cursor: pointer;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  box-shadow: 0 0 10px var(--neon-magenta);
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}

.skill-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.skill-btn {
  background: rgba(0, 240, 255, 0.1);
  border: 1px solid var(--neon-cyan);
  padding: 10px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.skill-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.skill-philosophy {
  font-size: 0.5rem;
  color: var(--neon-cyan);
  opacity: 0.6;
}

.skill-btn:hover:not(.disabled) {
  background: rgba(0, 240, 255, 0.2);
  box-shadow: 0 0 10px var(--neon-cyan);
}

.skill-btn.disabled {
  opacity: 0.3;
  cursor: not-allowed;
  border-color: #333;
}

.skill-name {
  font-size: 0.8rem;
  color: #fff;
  text-transform: uppercase;
}
.skill-cost {
  font-size: 0.8rem;
  color: var(--neon-cyan);
  font-weight: bold;
}

/* Status Row (Badge + HUD) */
.status-row {
  grid-column: span 2;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.4);
  padding: 5px;
  border-radius: 4px;
  border: 1px solid rgba(0, 240, 255, 0.2);
}

.exit-controls {
  justify-content: space-between;
  border: 1px solid var(--neon-magenta);
}
.btn-reserve-exit:disabled {
  opacity: 1;
  filter: brightness(1.5) contrast(1.5);
}
.btn-cashout,
.btn-reserve-exit {
  flex: 1;
  padding: 8px;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cashout {
  background: var(--neon-magenta);
  color: #000;
}

.btn-cashout:hover:not(:disabled) {
  box-shadow: 0 0 10px var(--neon-magenta);
}

.btn-reserve-exit {
  background: linear-gradient(to right, rgba(0, 240, 255, 0.2) var(--gauge-percent, 0%), transparent var(--gauge-percent, 0%));
  border: 1px solid var(--neon-cyan);
  color: var(--neon-cyan);
  border-color: var(--neon-cyan);
  box-shadow: 0 0 10px var(--neon-cyan);
}

.btn-reserve-exit:hover:not(:disabled) {
  background: linear-gradient(to right, rgba(0, 240, 255, 0.4) var(--gauge-percent, 0%), rgba(0, 240, 255, 0.1) var(--gauge-percent, 0%));
}

.btn-reserve-exit.inactive:disabled {
  border-color: #555;
  color: #555;
}

.protector-badge {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 5px var(--neon-cyan));
  animation: float 3s ease-in-out infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.effect-hud {
  display: flex;
  gap: 5px;
}

.effect-item {
  position: relative;
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: help;
  overflow: hidden;
}

.effect-item.cooldown {
  opacity: 0.45;
  filter: grayscale(0.5);
  border: 1px solid rgba(255, 230, 0, 0.3);
}

.eff-icon {
  font-size: 0.8rem;
  z-index: 2;
}

.cooldown-gauge {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--neon-yellow);
  opacity: 0.6;
  z-index: 1;
  pointer-events: none;
  box-shadow: 0 0 5px var(--neon-yellow);
}

.eff-stack {
  position: absolute;
  bottom: 0px;
  right: 0px;
  background: #ff003c;
  color: #fff;
  font-size: 0.5rem;
  font-weight: 800;
  padding: 1px 2px;
  border-radius: 2px;
  line-height: 1;
  z-index: 3;
}


aside.inbox-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 154px;
  min-height: 154px;
}

.inbox-header {
  font-size: 0.6rem;
  color: var(--neon-cyan);
  margin-bottom: 5px;
  letter-spacing: 1px;
  text-align: left;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  border: 1px solid rgba(0, 240, 255, 0.2);
  background: rgba(0, 0, 0, 0.3);
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Custom scrollbar for message-list */
.message-list::-webkit-scrollbar {
  width: 4px;
}
.message-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}
.message-list::-webkit-scrollbar-thumb {
  background: var(--neon-cyan);
}

.message-item {
  font-size: 0.7rem;
  padding: 4px 6px;
  color: #aaa;
  border-left: 2px solid var(--neon-cyan);
  flex-shrink: 0;
  min-height: 24px;
  display: flex;
  align-items: center;
  text-align: left;
}

.message-item.unread {
  color: #fff;
  border-left-color: var(--neon-yellow);
  background: rgba(255, 230, 0, 0.05);
}

.msg-indicator {
  color: var(--neon-yellow);
  margin-right: 4px;
  flex-shrink: 0;
}

.msg-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.empty-msg {
  font-size: 0.7rem;
  color: #555;
  text-align: center;
  margin-top: 10px;
}

/* HUD Mini-Display */
.permanent-hud {
  /* grid-column: span 2; */
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px;
  margin-top: 5px;
}
.double {
  grid-column: span 2;
}
.hud-overlay-mini {
  grid-column: span 2;
  background: rgba(0, 240, 255, 0.1);
  border: 1px solid var(--neon-cyan);
  padding: 8px;
  margin-top: 2px;

}
.hud-stat {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
}
.hud-stat .label {
  opacity: 0.7;
}
.hud-stat .value {
  color: var(--neon-cyan);
  font-weight: bold;
}
button:disabled {
  cursor: not-allowed;
}
.btn-fold,
.btn-call,
.btn-raise {
  padding: 12px 20px;
  font-size: 0.9rem;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.btn-fold {
  background: #333;
  border-left: unset;
}

.btn-call {
  background: var(--neon-cyan);
  color: #000;
  font-weight: 900;
  text-shadow: none;
}

.btn-raise {
  background: var(--neon-magenta);
  color: #000;
  font-weight: 900;
  text-shadow: none;
  border-left: unset;
}

.btn-start {
  width: 100%;
  padding: 1.5em;
  font-size: 1.2rem;
}

/* ══════════════════════════════════════════════
   MOBILE: 스와이프 슬라이드 레이아웃
   max-width: 768px 이하에서 활성화
══════════════════════════════════════════════ */
@media (max-width: 768px) {

  /* 데스크톱 전용 요소 숨김 */
  .desktop-only {
    display: none !important;
  }

  /* 모바일 전용 요소 표시 */
  .mobile-swipe-container {
    display: flex;
    width: 100%;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    /* 패널 전환 부드럽게 */
    scroll-behavior: smooth;
  }
  .mobile-swipe-container::-webkit-scrollbar {
    display: none;
  }

  /* 각 패널 공통 */
  .swipe-panel {
    flex: 0 0 100%;
    width: 100%;
    scroll-snap-align: start;
    box-sizing: border-box;
    padding: 4px 6px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-height: 0;
  }

  /* 패널 0: INBOX */
  .panel-inbox {
    background: rgba(0, 0, 0, 0.4);
    border-right: 1px solid rgba(0, 240, 255, 0.15);
  }
  .panel-label {
    font-size: 0.6rem;
    color: var(--neon-cyan);
    letter-spacing: 1px;
    text-align: left;
    flex-shrink: 0;
  }
  .panel-inbox .message-list {
    flex: 1;
    overflow-y: auto;
    border: 1px solid rgba(0, 240, 255, 0.2);
    background: rgba(0, 0, 0, 0.3);
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  /* 패널 1: BETTING */
  .panel-betting {
    background: rgba(0, 240, 255, 0.04);
    border: 1px solid var(--glass-border);
    border-radius: 8px;
  }
  .panel-betting .shortcuts {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
    margin-bottom: 2px;
  }
  .panel-betting .shortcuts button {
    padding: 4px 2px;
    font-size: 0.7rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
  }
  .panel-betting .bet-display .value {
    font-size: 1rem;
  }
  .panel-betting .slider-area {
    margin-bottom: 2px;
  }
  .panel-betting .actions {
    display: grid;
    grid-template-columns: 1fr 1fr 1.2fr;
    gap: 4px;
  }
  .panel-betting .btn-fold {
    grid-column: unset;
    padding: 4px;
  }
  .panel-betting .btn-call {
    grid-column: unset;
    padding: 4px;
  }
  .panel-betting .btn-raise {
    grid-column: unset;
    padding: 4px;
    margin-top: 0px;
  }

  /* 패널 2: HUD */
  .panel-hud {
    background: rgba(0, 0, 0, 0.5);
    border-left: 1px solid rgba(0, 240, 255, 0.15);
    overflow-y: auto;
  }
  /* HUD 패널 내 hud-strip: 세로 스택 */
  .panel-hud .hud-strip {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .panel-hud .permanent-hud {
    margin-top: 0;
    width: 100%;
    box-sizing: border-box;
  }
  .panel-hud .permanent-hud.double {
    grid-column: unset;
  }
  /* skill-panel 스타일은 panel-hud 내부에 있으므로 조정 */
  .panel-hud .skill-panel {
    display: block;
  }

  /* ── DOT 인디케이터 ── */
  .swipe-dots {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    padding: 2px 0;
    flex-shrink: 0;
  }
  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(0, 240, 255, 0.2);
    border: 1px solid rgba(0, 240, 255, 0.3);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .dot.active {
    background: var(--neon-cyan);
    box-shadow: 0 0 4px var(--neon-cyan);
    transform: scale(1.2);
  }

  /* control-panel 자체 레이아웃 */
  .control-panel {
    display: flex;
    flex-direction: column;
    padding: 0;
    gap: 0;
    padding-bottom: 2px;
    background: rgba(5, 10, 14, 0.95);
    border-top: 1px solid var(--glass-border);
  }
}

/* ── HUD Strip 기본(데스크톱): 래퍼 투명화 ── */
.hud-strip {
  display: contents;
  /* 자식이 부모 grid에 직접 참여 → 기존 레이아웃 그대로 */
}

/* Stamina Glitch & Visuals */
@keyframes stamina-glitch {
  0% {
    transform: translate(0);
    opacity: 1;
  }
  20% {
    transform: translate(-2px, 1px);
    opacity: 0.8;
  }
  40% {
    transform: translate(2px, -1px);
    opacity: 0.9;
  }
  60% {
    transform: translate(-1px, -1px);
    opacity: 1;
  }
  80% {
    transform: translate(1px, 1px);
    opacity: 0.8;
  }
  100% {
    transform: translate(0);
    opacity: 1;
  }
}

.glitch-active {
  animation: stamina-glitch 0.2s infinite;
  box-shadow: 0 0 15px currentColor;
}

.low-stamina {
  color: #ff003c !important;
  text-shadow: 0 0 5px #ff003c;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
