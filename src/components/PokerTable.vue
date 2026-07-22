<template>
  <template v-if="engine && engine.players">
    <div v-for="(p, idx) in engine.players" :key="p.id" class="player-seat" :class="[`max${engine.tableSize}`, getSeatClass(idx), {
      // 'folded': p.isFolded,
      'winner-glow': showShowdown && isWinner(p.id)
    }]" :style="{ filter: staminaBlur > 0 ? `blur(${staminaBlur}px)` : '' }">

    <div class="dealer-btn" v-if="engine.dealerIndex === idx">D</div>
    <!-- <div class="chip-stack"> -->
    <div v-if="p.currentBet > 0" class="chip-stack">
      <ChipStack :amount="p.currentBet" :bb="engine.bb" labelPosition="bottom" />
    </div>

    <Transition name="fold-cards">
      <div v-if="!p.isFolded" :class="{ 'cards': true, 'is-human': p.isHuman }">
        <!-- Cards are hidden for NPCs unless explicitly revealed (showHoleCards) -->
        <Card v-for="(c, i) in p.hand" :key="i" :code="c"
          :hidden="!p.isHuman && !p.showHoleCards" />
      </div>
    </Transition>
    <Transition name="fade">
      <div class="dialogue-bubble" v-if="p.lastDialogue">
        <div class="bubble-content">{{ p.lastDialogue }}</div>
        <div class="bubble-arrow"></div>
      </div>
    </Transition>
    <div class="player-info" :class="{
      'active': engine.currentPlayerIndex === idx,
      'time-critical': isTimeCritical(p, idx),
      'bust': p.isEliminated
    }"
      :style="isTimeCritical(p, idx) ? { borderColor: 'var(--neon-red)', boxShadow: '0 0 15px var(--neon-red)' } : {}">
      <!-- Time Gauge Background -->
      <div class="time-gauge" :style="getTimeGaugeStyle(p, idx)"></div>
      <div v-if="store.isActiveHud && !p.isHuman" class="hud-badge">
        <span class="vpip-val">{{ p.stats.vPIP.toFixed(0) }}</span>
        <div class="hud-tooltip">
          <div class="tooltip-row">
            <span class="label">VPIP</span>
            <span class="val cyan">{{ p.stats.vPIP.toFixed(1) }}%</span>
          </div>
          <div class="tooltip-row">
            <span class="label">PFR</span>
            <span class="val yellow">{{ p.stats.pfr.toFixed(1) }}%</span>
          </div>
          <div class="tooltip-row">
            <span class="label">3-BET</span>
            <span class="val magenta">{{ p.stats.threeBet.toFixed(1) }}%</span>
          </div>
          <div class="tooltip-row">
            <span class="label">4-BET+</span>
            <span class="val magenta">{{ p.stats.fourBetOrMore.toFixed(1) }}%</span>
          </div>
          <div class="tooltip-row">
            <span class="label">AF</span>
            <span class="val white">{{ p.stats.aggressionFactor.toFixed(1) }}</span>
          </div>
        </div>
      </div>
      <!-- Character Dialogue Bubble -->

      <div class="meta">
        <span class="name" :class="{ 'companion': p.isPartner }">
          <span class="tilted" v-if="p.tilt >= 75" :data-tooltip="getTiltTooltip(p.tilt)">😡</span>
          <span class="tilted" v-else-if="p.tilt >= 50" :data-tooltip="getTiltTooltip(p.tilt)">😠</span>
          <span class="tilted" v-else-if="p.tilt >= 25" :data-tooltip="getTiltTooltip(p.tilt)">😒</span>
          <span class="drunken" v-if="p.isDrunken" :data-tooltip="getDrunkTooltip()">🍺</span>
          {{ p.name }}
        </span>
        <!-- no more need to show class tag -->
        <!-- <span class="class-tag" v-if="p.isHuman">{{ p.class?.name }}</span> -->
      </div>
      <div class="balance">
        <!-- [MOVED] Protector Badge -->
        <span class="chips">
          {{ formatUnit(showShowdown ? visualChips[p.id] : p.chips) }}
        </span>
      </div>
      <!-- RAM Bar for Human -->
      <!-- <div v-if="p.isHuman" class="ram-meter">
        <div class="ram-fill" :style="{ width: ramPercent + '%' }"></div>
      </div> -->

    </div>
    <!-- [MOVED] Effect HUD -->
    <!-- <div class="status-overlay" v-if="p.isFolded">FOLDED</div> -->
    <!-- Neural Insight (LLM Thought) -->
    <div class="neural-insight"
      v-if="!p.isHuman && p.lastThought && !p.isFolded && engine.players.find(p => p.isMe)?.canReadSynapses">
      <span class="prefix">>></span> {{ p.lastThought }}
    </div>
  </div>
  <div class="poker-table" v-if="engine" :style="tableStyleWithBlur">
    <!-- Pot Display (Center) -->
    <div class="center-area">
      <div class="pot-display">
        <b class="neon-text glitch-small">{{ currentPotName || 'POT' }}</b>
        <ChipStack :amount="showShowdown ? visualTotalPot : engine.pot"
          :bb="engine.buyIn ? (engine.buyIn / 100) : engine.bb" :showLabel="true" labelPosition="bottom"
          :collecting="isPotCollecting" :winnerSeat="activePotWinnerSeat" />
      </div>
      <div class="board-cards">
        <Card v-for="(c, i) in engine.board" :key="i" :code="c" />
        <div v-for="i in (5 - engine.board.length)" :key="'p' + i" class="card-placeholder"></div>
      </div>
      <!-- Live All-In Equity HUD -->
      <div v-if="engine.runoutInProgress" class="allin-equity-hud">
        <div class="equity-title">ALL-IN REALTIME EQUITY</div>
        <div class="equity-players">
          <div v-for="p in activeRunoutPlayers" :key="p.id" class="equity-row">
            <span class="eq-name" :class="{ 'is-me': p.isHuman }">{{ p.name }}</span>
            <div class="eq-bar-bg">
              <div class="eq-bar-fill" :style="{ width: (shouldShowEquity(p) ? (p.equity || 0) : 0) + '%' }"></div>
            </div>
            <span class="eq-percent">{{ shouldShowEquity(p) ? (p.equity || 0).toFixed(0) + '%' : '?%' }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- Players (Relative Positioning) -->

    <!-- [IMPROVEMENT] Winning Hand HUD (Bottom) -->
    <Transition name="fade">
      <div v-if="showShowdown && winnerHandInfo" class="hud-winner-hand">
        <!-- <div class="winner-label">WINNER_IDENTIFIED //</div> -->
        <div class="winner-label">{{ winnerHandInfo.player.name }}</div>
        <div class="winner-hand">{{ props.engine.state === 'SHOWDOWN' ? winnerHandInfo.hand.name : 'UNCONTESTED' }}
        </div>
      </div>
    </Transition>

    <!-- [IMPROVEMENT] Player Current Hand HUD (Right) -->
    <!-- <div v-if="!engine.players[0].isFolded" class="hud-player-hand">
      <div class="hud-label">NEURAL_ANALYSIS // CURRENT_HAND</div>
      <div class="hud-hand-name">{{ playerHandEval?.name || 'ANALYZING...' }}</div>
    </div> -->

    <!-- Item Activation Toast -->
    <!-- <Transition name="slide-up">
      <div v-if="itemToast" class="item-toast">
        <div class="toast-icon">⚡</div>
        <div class="toast-content">
          <div class="toast-label">ITEM_ACTIVATED</div>
          <div class="toast-name">{{ itemToast.name }}</div>
        </div>
      </div>
    </Transition> -->
  </div>

  <!-- Move replay-trigger here to ensure it's on top of everything -->
  <div class="replay-trigger" @click="$emit('openHistory')" :style="{ filter: staminaBlur > 0 ? `blur(${staminaBlur}px)` : '' }">
    <span class="icon">🗘</span>
    <span class="label">HISTORY</span>
  </div>
  </template>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue';
import Card from './Card.vue';
import ChipDisplay from './ChipDisplay.vue';
import ChipStack from './ChipStack.vue';
import { getLanguage } from '../logic/store.js';
import { zones } from '../logic/zone.js';
const props = defineProps({
  engine: Object
});
const emit = defineEmits(['openHistory']);

const activeRunoutPlayers = computed(() => {
  if (!props.engine || !props.engine.players) return [];
  return props.engine.players.filter(p => !p.isFolded && p.hand && p.hand.length === 2);
});

const shouldShowEquity = (p) => {
  // Always show for human. For AI, only show if they have been revealed (showHoleCards is true)
  return p.isHuman || p.showHoleCards;
};

watch(() => props.engine?.state, (s) => {
  console.log('[PokerTable] State changed to:', s);
});

// [NEW] Background Music Sync
onMounted(() => {
  if (props.engine && props.engine.locationId) {
    audioManager.playTrackByZoneId(props.engine.locationId);
  }
});

watch(() => props.engine?.locationId, (newLoc) => {
  if (newLoc) {
    audioManager.playTrackByZoneId(newLoc);
  }
});
const DRUNK_DESC = {
  ko: '이 친구는 지금 취했습니다. 평소보다 말이 많아지며, 플레이가 루즈해집니다.',
  en: 'Hammered and chatty. Range is wider than ever—expect some loose plays.',
}
const TILT_DESC = {
  HIGH: {
    ko: '완전한 틸트 상태입니다!',
    en: 'Full-on tilted!',
  },
  MID: {
    ko: '화가 난거 같아 보이네요...',
    en: 'Seems pretty salty...',
  },
  LOW: {
    ko: '조금 짜증나 보이네요.',
    en: 'Looks a bit peeved.',
  }
}
const getDrunkTooltip = () => {
  return DRUNK_DESC[getLanguage()];
}
const getTiltTooltip = (tilt) => {
  if (tilt >= 75) return TILT_DESC.HIGH[getLanguage()];
  else if (tilt >= 50) return TILT_DESC.MID[getLanguage()];
  else if (tilt >= 25) return TILT_DESC.LOW[getLanguage()];
  else return '';
}

const showShowdown = ref(false);
let showdownTimer = null;

// Auto-hide showdown after 3 seconds
// Auto-hide showdown after 3 seconds
// Modified for Sequential Side Pot Animation
const activePotWinner = ref(null); // Player IDs of current pot winners
const activePotWinnerSeat = ref(''); // Seat class of a primary winner
const isPotCollecting = ref(false);
const visualTotalPot = ref(0);
const currentPotName = ref('');
const visualChips = ref({}); // [NEW] For chip sync animation

watch(() => props.engine?.pot, (newPot) => {
  if (!showShowdown.value && newPot !== undefined) {
    visualTotalPot.value = newPot;
  }
});

watch(() => props.engine?.showdownResults, async (newResults) => {
  if (newResults) {
    showShowdown.value = true;
    activePotWinner.value = null;
    activePotWinnerSeat.value = '';
    isPotCollecting.value = false;

    // Initialize Visual Chips
    props.engine.players.forEach(p => {
      const result = newResults.results.find(r => r.id === p.id);
      const won = result ? result.amountWon : 0;
      visualChips.value[p.id] = p.chips - won;
    });

    if (newResults.detailedPots && newResults.detailedPots.length > 0) {
      const potsToAnimate = [...newResults.detailedPots];
      visualTotalPot.value = potsToAnimate.reduce((sum, p) => sum + p.amount, 0);

      for (const pot of potsToAnimate) {
        currentPotName.value = pot.name;
        activePotWinner.value = pot.winners;

        // Find winner seat class for animation direction
        const firstWinnerIdx = props.engine.players.findIndex(p => p.id === pot.winners[0]);
        if (firstWinnerIdx !== -1) {
          activePotWinnerSeat.value = getSeatClass(firstWinnerIdx);
        }

        await new Promise(r => setTimeout(r, 1500));

        // Start Collection Animation
        isPotCollecting.value = true;
        visualTotalPot.value -= pot.amount;
        audioManager.playSFX('chip-ship-it');

        const share = Math.floor(pot.amount / pot.winners.length);
        pot.winners.forEach(winnerId => {
          if (visualChips.value[winnerId] !== undefined) {
            visualChips.value[winnerId] += share;
          }
        });

        // Wait for chips to fly away before resetting pot name/winner highlights
        await new Promise(r => setTimeout(r, 1800));
        isPotCollecting.value = false;
        activePotWinnerSeat.value = '';
      }

      activePotWinner.value = null;
      currentPotName.value = '';
    }

    if (showdownTimer) clearTimeout(showdownTimer);
    showShowdown.value = false;
    visualTotalPot.value = props.engine.pot;
    visualChips.value = {};
  } else {
    showShowdown.value = false;
  }
});

// const currentRam = computed(() => {
//   const p = props.engine?.players[0];
//   if (!p || !p.ram) return 0;
//   return p.ram.used + p.ram.reserved;
// });
// const ramPercent = computed(() => {
//   const p = props.engine?.players[0];
//   if (!p || !p.class?.maxRam) return 0;
//   return (currentRam.value / p.class.maxRam) * 100;
// });

const getSeatClass = (idx) => {
  // Basic mapping for 6 and 9 player layouts
  const total = props.engine.tableSize;
  if (total === 2) return idx === 0 ? 'seat-bottom' : 'seat-top';

  // For 6 and 9, we distribute around the table
  return `seat-${idx}`;
};

const isWinner = (playerId) => {
  // If animating specific pot, check that
  if (showShowdown.value && activePotWinner.value) {
    return activePotWinner.value.includes(playerId);
  }
  // Fallback to general winner result
  return props.engine.showdownResults?.winnerId === playerId;
};

import { store } from '../logic/store';
import { audioManager } from '../logic/audioManager.js';
const formatUnit = (val) => {
  if (store.settings.showAsBB) {
    const baseBB = props.engine.bb;
    if (baseBB > 0) return (val / baseBB).toFixed(1) + ' BB';
  }
  return val.toLocaleString() + ' CR';
};

const winnerHandInfo = computed(() => {
  if (!props.engine.showdownResults) return null;
  const winnerResult = props.engine.showdownResults.results.find(r => r.isWinner);
  return winnerResult || null;
});

const currentLocation = computed(() => {
  if (!props.engine || !props.engine.locationId) return null;
  // Flatten zones to locations
  const allLocations = zones.flatMap(z => z.locations);
  return allLocations.find(l => l.id === props.engine.locationId);
});

const tableStyle = computed(() => {
  if (currentLocation.value && currentLocation.value.theme) {
    const t = currentLocation.value.theme;
    return {
      background: t.background,
      borderColor: t.borderColor,
      boxShadow: t.boxShadow || ''
    };
  }
  return {}; // Use CSS defaults
});

const staminaBlur = computed(() => {
  const s = store.stamina;
  if (s >= 25) return 0;
  return ((25 - s) / 25) * 5;
});

const tableStyleWithBlur = computed(() => {
  const style = { ...tableStyle.value };
  if (staminaBlur.value > 0) {
    style.filter = `blur(${staminaBlur.value}px)`;
  }
  return style;
});

// [MOVED] getEffectDesc to ControlPanel

const getTimeGaugeStyle = (p, idx) => {
  // Optimization: Use direct index comparison (O(1)) instead of array search (O(n))
  if (p.timeBankRemaining === undefined || props.engine.currentPlayerIndex !== idx) {
    return { width: '0%', opacity: 0 };
  }

  const max = p.maxTimeBank || 30;
  const percent = Math.max(0, Math.min(100, (p.timeBankRemaining / max) * 100));

  let color = 'var(--neon-cyan)'; // > 50%
  let opacity = 0.25;

  if (percent < 20) {
    color = 'var(--neon-red)';
    opacity = 0.6;
  } else if (percent < 50) {
    color = 'var(--neon-yellow)';
    opacity = 0.4;
  }

  return {
    width: percent + '%',
    background: color,
    opacity: opacity
  };
};

const isTimeCritical = (p, idx) => {
  // Optimization: Direct index check
  if (p.timeBankRemaining === undefined || props.engine.currentPlayerIndex !== idx) return false;
  const percent = (p.timeBankRemaining / (p.maxTimeBank || 30)) * 100;
  return percent < 20;
};
</script>

<style lang="css">
@import '../styles/components/PokerTable.css';
@import '../styles/components/PokerTable-layout-desktop.css';
@import '../styles/components/PokerTable-layout-mobile.css';
</style>

<style scoped>
.allin-equity-hud {
  margin-top: 15px;
  background: rgba(4, 8, 12, 0.95);
  border: 1.5px solid var(--neon-cyan);
  /* Cyberpunk cut corner style */
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3), inset 0 0 10px rgba(0, 240, 255, 0.1);
  padding: 12px 16px;
  width: 290px;
  box-sizing: border-box;
  z-index: 10;
  position: relative;
}

/* Subtle CRT Scanline overlay */
.allin-equity-hud::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%, 
    rgba(0, 240, 255, 0.08) 50%
  );
  background-size: 100% 3px;
  pointer-events: none;
  z-index: 2;
}

.equity-title {
  font-family: 'Outfit', 'Consolas', monospace;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: var(--neon-cyan);
  text-align: center;
  margin-bottom: 10px;
  text-shadow: 0 0 5px var(--neon-cyan);
  text-transform: uppercase;
}

.equity-players {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.equity-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 0.8rem;
}

.eq-name {
  width: 70px;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
}

.eq-name.is-me {
  color: var(--neon-cyan);
  text-shadow: 0 0 4px rgba(0, 240, 255, 0.5);
}

.eq-bar-bg {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 0; /* Sharp sci-fi edges */
  overflow: hidden;
}

.eq-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--neon-cyan), #00ffaa);
  box-shadow: 0 0 6px var(--neon-cyan);
  transition: width 0.45s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 0; /* Sharp sci-fi edges */
}

.eq-percent {
  width: 40px;
  text-align: right;
  color: #fff;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}
</style>
