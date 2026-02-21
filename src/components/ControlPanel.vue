<template>
  <footer class="control-panel" v-if="engine">
    <!-- Permanent Hand Rank Display (Always Visible) -->
    <div class="permanent-hud">
      <div class="hud-stat">
        <span class="label">CURRENT_HAND:</span>
        <span class="value">{{ currentHandRank }}</span>
      </div>
    </div>
    <!-- Betting & Actions -->
    <div class="betting-interface">
      <!-- Shortcuts -->

      <div class="shortcuts">
        <template v-if="engine.state === 'PREFLOP'">
          <button @click="setBet('min')">MIN</button>
          <button @click="setBet('2.2BB')">2.2BB</button>
          <button @click="setBet(.5)">50%</button>
          <button @click="setBet(1)">100%</button>
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
        <input type="range" :min="minRaise" :max="playerChips" step="1" v-model.number="currentBetValue"
          class="bet-slider" />
        <div class="bet-display">
          <span class="value">{{ formatUnit(currentBetValue) }}</span>
          <span class="label">SET CHARGE</span>
        </div>
      </div>
      <div class="actions">
        <button class="btn-fold" :disabled="!isMyTurn" @click="$emit('action', { type: 'fold' })">FOLD</button>
        <button class="btn-call" :disabled="!isMyTurn"
          @click="$emit('action', { type: callAmountRaw >= playerChips ? 'all_in' : 'call', amount: callAmountRaw + player.currentBet })">
          <p>{{ callAmountRaw === 0 ? 'CHECK' : callAmountRaw >= playerChips ? 'ALL-IN' : 'CALL' }}</p>
          <p>{{ formatUnit(callAmountRaw) }}</p>
        </button>
        <button class="btn-raise" :disabled="!isMyTurn || currentBetValue < minRaise"
          @click="$emit('action', { type: currentBetValue >= playerChips ? 'all_in' : 'raise', amount: currentBetValue + player.currentBet })">
          <p>
            {{ (currentBetValue >= playerChips) ? 'ALL-IN' : (player.hasFacedFlopBet) ? 'RAISE' : 'BET' }}
          </p>
          <p>{{ formatUnit(currentBetValue) }}</p>
        </button>
      </div>
    </div>
    <!-- Gadget Panel -->
    <div class="skill-panel">
      <!-- [MOVED] Protector Badge & Effects HUD -->
      <div class="status-row" v-if="player.item">
        <div class="protector-badge" :title="player.item.desc">
          {{ player.item.icon }}
        </div>
        <div v-if="player.item.effects && player.item.effects.length > 0" class="effect-hud">
          <div v-for="eff in player.item.effects" :key="eff.id" class="effect-item"
            :class="{ 'cooldown': eff.cooldown > 0 }" :title="getEffectDesc(eff)">
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
    <!-- <p class="scanline">NEURAL LINK ESTABLISHED // ENCRYPTED TRAFFIC ONLY</p> -->
  </footer>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { evaluateHand } from '../logic/poker.js';

import { store } from '../logic/store';

const props = defineProps({
  engine: Object
});

const emit = defineEmits(['action', 'skill']);

const player = computed(() => props.engine.players[0]);
const isMyTurn = computed(() => props.engine.currentPlayerIndex === 0 && props.engine.state !== 'IDLE' && props.engine.state !== 'SHOWDOWN');
const playerChips = computed(() => player.value.chips);
const callAmountRaw = computed(() => Math.min(props.engine.currentRoundBet - player.value.currentBet, playerChips.value));
const minRaise = computed(() => Math.min(props.engine.currentRoundBet + (props.engine.bb || 2), playerChips.value));
const currentBetValue = ref(minRaise.value);

const formatUnit = (val) => {
  if (store.settings.showAsBB && props.engine.bb > 0) {
    return (val / props.engine.bb).toFixed(1) + ' BB';
  }
  return val + ' CR';
};

const currentHandRank = computed(() => {
  if (!player.value.hand.length) return 'N/A';
  const evalResult = evaluateHand([...player.value.hand, ...props.engine.board]);
  // Returning shorter rank name for HUD
  return evalResult.name;
});



watch(minRaise, (newVal) => {
  currentBetValue.value = newVal;
});

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
      currentBetValue.value = pot;
      break;
    default: {
      if (typeof type === 'number') {
        if (type > 100) { // Assume All-in for huge numbers
          currentBetValue.value = playerChips.value;
        } else {
          currentBetValue.value = Math.max(minRaise.value, Math.min(Math.floor((pot + currentRoundBet) * type), playerChips.value));
        }
      }
    } break;
  }
};

const canUse = (skill) => {
  const p = props.engine.players[0];
  return (p.ram.used + p.ram.reserved + skill.cost) <= p.class.maxRam;
};

const useSkill = (skill) => {
  if (props.engine.executeSkill(props.engine.players[0], skill.id)) {
    // success
  } else {
    // fail
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
</script>

<style scoped>
.control-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 999;
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

/* RAM Gauge */
.ram-container {
  grid-column: span 2;
  background: rgba(0, 0, 0, 0.3);
  padding: 8px;
  border: 1px solid #333;
  margin-bottom: 5px;
}
.ram-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.6rem;
  color: var(--neon-cyan);
  margin-bottom: 4px;
}
.ram-bar {
  height: 8px;
  background: #111;
  display: flex;
}
.ram-fill {
  height: 100%;
  transition: width 0.3s;
}
.ram-fill.used {
  background: var(--neon-magenta);
  box-shadow: 0 0 5px var(--neon-magenta);
}
.ram-fill.reserved {
  background: var(--neon-cyan);
  box-shadow: 0 0 5px var(--neon-cyan);
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
</style>
