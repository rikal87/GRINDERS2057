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
            class="bet-slider" @touchstart.stop @touchmove.stop @touchend.stop />
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
        <!-- Skills (Mobile list) -->
        <div class="mobile-skills">
          <button v-for="skillId in store.unlockedSkills" :key="skillId" class="skill-btn"
            :disabled="store.stamina < store.getSkillCost(skillId)" @click="emit('skill', skillId)"
            :class="{ 'disabled': store.stamina < store.getSkillCost(skillId) }">
            <div class="skill-meta">
              <span class="skill-name">{{ store.getSkillDisplayName(skillId) }}</span>
            </div>
            <span class="skill-cost">{{ store.getSkillCost(skillId) }} RAM</span>
          </button>
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
      <div class="inbox-header">
        SYS.COMM.LOG //
      </div>
      <div class="message-list">
        <div v-for="msg in store.messages" :key="msg.id" class="message-item" :class="{ 'unread': !msg.isRead }">
          <span class="msg-indicator" v-if="!msg.isRead">*</span>
          <span class="msg-title">{{ msg.title }}</span>
        </div>
        <div v-if="store.messages.length === 0" class="empty-msg">NO_NEW_MESSAGES</div>
      </div>
    </aside>

    <div class="betting-interface desktop-only">
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
          class="bet-slider" @touchstart.stop @touchmove.stop @touchend.stop />
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
          <p>
            {{ isAllInSelection ? 'ALL-IN' : 'RAISE' }}
          </p>
          <p>{{ formatUnit(isAllInSelection ? playerTotalAvailable : currentBetValue) }}</p>
        </button>
      </div>
    </div>

    <!-- Gadget Panel -->
    <div class="skill-panel desktop-only">
      <!-- [CASHOUT], [RESERVE EXIT]  -->
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
      <!-- [MOVED] Protector Badge & Effects HUD -->
      <div class="status-row" v-if="player.item">
        <div class="protector-badge" :data-tooltip="player.item.desc">
          {{ player.item.icon }}
        </div>
        <div v-if="player.item.effects && player.item.effects.length > 0" class="effect-hud">
          <div v-for="eff in player.item.effects" :key="eff.id" class="effect-wrapper"
            :data-tooltip="getEffectDesc(eff)">
            <div class="effect-item" :class="{ 'cooldown': eff.cooldown > 0 }">
              <div class="eff-icon">{{ eff.icon }}</div>
              <!-- Cooldown Gauge Overlay -->
              <div v-if="eff.cooldown > 0" class="cooldown-gauge"
                :style="{ height: (eff.maxCooldown ? (eff.cooldown / eff.maxCooldown * 100) : 100) + '%' }">
              </div>
              <div v-if="eff.stack >= 1" class="eff-stack">{{ eff.stack }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- Victory Condition Display -->
      <div class="permanent-hud double">
        <div class="hud-stat">
          <span class="label">{{ getLanguage() === 'ko' ? '승리 조건' : 'WIN_CONDITION' }}:</span>
          <span class="value" :class="victoryConditionChips >= acquiredChips ? 'yellow' : 'green'">
            {{ formatUnit(acquiredChips) }} / {{ formatUnit(victoryConditionChips) }}
          </span>
        </div>
      </div>
      <!-- Permanent Stamina Display -->
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
      <!-- Skill Buttons -->
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
    <!-- <p class="scanline">NEURAL LINK ESTABLISHED // ENCRYPTED TRAFFIC ONLY</p> -->
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
@import '../styles/components/ControlPanel.css';
@import '../styles/components/ControlPanel-layout-desktop.css';
@import '../styles/components/ControlPanel-layout-mobile.css';
</style>



