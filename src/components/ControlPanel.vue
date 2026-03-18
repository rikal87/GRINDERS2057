<template>
  <footer class="control-panel" v-if="engine">
    <aside class="inbox-panel">
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
    <!-- Betting & Actions -->
    <div class="betting-interface">
      <!-- Shortcuts -->

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
      <!-- Slider Area -->
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
          <p>
            {{ isAllInSelection ? 'ALL-IN' : 'RAISE' }}
          </p>
          <p>{{ formatUnit(isAllInSelection ? playerTotalAvailable : currentBetValue) }}</p>
        </button>
      </div>
    </div>
    <!-- Gadget Panel -->
    <div class="skill-panel">
      <!-- Permanent Hand Rank Display (Always Visible) -->
      <div class="permanent-hud">
        <div class="hud-stat">
          <span class="label">CURRENT_HAND:</span>
          <span class="value">{{ currentHandRank }}</span>
        </div>
      </div>
      <!-- Victory Condition Display (Always Visible) -->
      <div class="permanent-hud">
        <div class="hud-stat">
          <span class="label">{{ getLanguage() === 'ko' ? '승리 조건' : 'VICTORY_CONDITION' }}:</span>
          <span class="value" :class="victoryConditionChips >= acquiredChips ? 'yellow' : 'green'">
            {{ formatUnit(acquiredChips) }} / {{ formatUnit(victoryConditionChips) }}
          </span>
        </div>
      </div>
      <!-- Permanent Stamina Display (Always Visible) -->
      <div class="permanent-hud">
        <div class="hud-stat" :class="{ 'low-stamina': store.stamina < 25 }">
          <span class="label">STAMINA:</span>
          <span class="value" :style="{ color: getStaminaColor }">{{ Math.floor(store.stamina) }} / {{
            getEffectiveMaxStamina() }}</span>
        </div>
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
import { ref, computed, watch } from 'vue';
import { evaluateHand } from '../logic/poker.js';
import { store, getEffectiveMaxStamina, getLanguage } from '../logic/store';
import { audioManager } from '../logic/audioManager.js';

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
  flex-direction: column;
  gap: 15px;
  z-index: 1;
  position: relative;
  /* Ensure z-index works */
}

/* Ensure buttons pop over scanlines */
button {
  backface-visibility: hidden;
  transform: translateZ(0);
}
@media (min-width: 1200px) {
  .control-panel {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    padding: 20px;
    background: rgba(5, 10, 14, 0.8);
    backdrop-filter: blur(10px);
    border-top: 1px solid var(--glass-border);
  }

  .betting-interface {
    flex: 2;
    max-width: 600px;
  }
  .permanent-hud {
    flex: 1.5;
    max-width: 500px;
  }
  .skill-panel {
    flex: 1.5;
    max-width: 500px;
  }
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
  padding: 8px;
  font-size: 0.7rem;
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
  grid-column: span 2;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px;
  margin-top: 5px;
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
.btn-fold {
  background: #333;
  border-left: unset;
}
.btn-call {
  background: var(--neon-cyan);
  color: #000;
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

/* --- Mobile Portrait Optimizations (412x915) --- */
@media (max-width: 450px) {
  .control-panel {
    gap: 10px;
    padding-bottom: 20px;
  }

  aside.inbox-panel {
    height: 100px;
    min-height: 100px;
  }

  .betting-interface {
    padding: 10px;
  }

  .shortcuts {
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
  }

  .shortcuts button {
    padding: 12px 5px;
    /* Larger touch target */
    font-size: 0.8rem;
  }

  .bet-display .value {
    font-size: 1.2rem;
  }

  .actions {
    grid-template-columns: 1fr 1fr;
    /* Stack actions better */
    gap: 8px;
  }

  .btn-fold {
    grid-column: span 1;
    padding: 15px;
  }
  .btn-call {
    grid-column: span 1;
    padding: 15px;
  }
  .btn-raise {
    grid-column: span 2;
    padding: 15px;
    margin-top: 5px;
  }

  .skill-panel {
    grid-template-columns: 1fr;
    /* Vertical stack for skills on mobile */
    gap: 8px;
  }

  .skill-btn {
    padding: 12px;
  }

  .skill-name {
    font-size: 0.9rem;
  }
  .skill-cost {
    font-size: 1rem;
  }
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
