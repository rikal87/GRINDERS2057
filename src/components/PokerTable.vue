<template>
  <HistoryPopup v-if="showHistory" :history="engine.handHistory" @close="showHistory = false" />
  <div v-for="(p, idx) in engine.players" :key="p.id" class="player-seat" :class="[`max${engine.tableSize}`, getSeatClass(idx), {
    'folded': p.isFolded,
    'winner-glow': showShowdown && isWinner(p.id)
  }]">

    <div class="dealer-btn" v-if="engine.dealerIndex === idx">D</div>
    <div v-if="p.currentBet > 0" class="chip-stack">
      <span class="bet-amount">{{ formatUnit(p.currentBet) }}</span>
    </div>

    <Transition name="fold-cards">
      <div v-if="!p.isFolded" :class="{ 'cards': true, 'is-human': p.isHuman }">
        <!-- Human shows cards, others hidden until showdown -->
        <Card v-for="(c, i) in p.hand" :key="i" :code="c" :hidden="!p.isHuman && engine.state !== 'SHOWDOWN'" />
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
      'time-critical': isTimeCritical(p, idx)
    }"
      :style="isTimeCritical(p, idx) ? { borderColor: 'var(--neon-red)', boxShadow: '0 0 15px var(--neon-red)' } : {}">
      <!-- Time Gauge Background -->
      <div class="time-gauge" :style="getTimeGaugeStyle(p, idx)"></div>

      <!-- Character Dialogue Bubble -->

      <div class="meta">
        <span class="name">{{ p.name }}</span>
        <span class="class-tag" v-if="p.isHuman">{{ p.class.name }}</span>
      </div>
      <div class="balance">
        <!-- [MOVED] Protector Badge -->
        <span class="chips">
          {{ formatUnit(p.chips) }}
        </span>
      </div>
      <!-- RAM Bar for Human -->
      <div v-if="p.isHuman" class="ram-meter">
        <div class="ram-fill" :style="{ width: ramPercent + '%' }"></div>
      </div>

    </div>
    <!-- [MOVED] Effect HUD -->
    <!-- <div class="status-overlay" v-if="p.isFolded">FOLDED</div> -->
    <!-- Neural Insight (LLM Thought) -->
    <div class="neural-insight"
      v-if="!p.isHuman && p.lastThought && !p.isFolded && engine.players.find(p => p.isMe).canReadSynapses">
      <span class="prefix">>></span> {{ p.lastThought }}
    </div>
  </div>
  <div class="poker-table" v-if="engine" :style="tableStyle">
    <!-- Pot Display (Center) -->
    <div class="center-area">
      <div class="pot-display">
        <b class="neon-text glitch-small">{{ currentPotName || 'POT' }}:
          <ChipDisplay :value="showShowdown ? visualTotalPot : engine.pot"
            :bb="engine.buyIn ? (engine.buyIn / 100) : engine.bb" />
        </b>
      </div>
      <div class="board-cards">
        <Card v-for="(c, i) in engine.board" :key="i" :code="c" />
        <div v-for="i in (5 - engine.board.length)" :key="'p' + i" class="card-placeholder"></div>
      </div>
    </div>
    <!-- Players (Relative Positioning) -->

    <!-- [IMPROVEMENT] Winning Hand HUD (Bottom) -->
    <Transition name="fade">
      <div v-if="showShowdown && winnerHandInfo" class="hud-winner-hand">
        <!-- <div class="winner-label">WINNER_IDENTIFIED //</div> -->
        <div class="winner-label">{{ winnerHandInfo.player.name }}</div>
        <div class="winner-hand">{{ winnerHandInfo.hand.name }}</div>
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
  <div class="replay-trigger" @click="$emit('openHistory')">
    <span class="icon">🗘</span>
    <span class="label">HISTORY</span>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue';
import Card from './Card.vue';
import ChipDisplay from './ChipDisplay.vue';
import HistoryPopup from './HistoryPopup.vue';
import { evaluateHand } from '../logic/poker.js';
import { zones } from '../logic/zone.js';
const props = defineProps({
  engine: Object
});
const emit = defineEmits(['openHistory']);

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

// 히스토리 팝업
const showHistory = ref(false);

const showShowdown = ref(false);
let showdownTimer = null;

// Auto-hide showdown after 3 seconds
// Auto-hide showdown after 3 seconds
// Modified for Sequential Side Pot Animation
const activePotWinner = ref(null); // Player ID of current pot winner
const visualTotalPot = ref(0);
const currentPotName = ref('');
const visualChips = ref({}); // [NEW] For chip sync animation

watch(() => props.engine.pot, (newPot) => {
  if (!showShowdown.value) {
    visualTotalPot.value = newPot;
  }
});

watch(() => props.engine.showdownResults, async (newResults) => {
  if (newResults) {
    showShowdown.value = true;
    activePotWinner.value = null;

    // Initialize Visual Chips (Start = End - Won)
    // This makes the chips start "low" and animate up as pots are awarded.
    props.engine.players.forEach(p => {
      // Find if this player won anything
      const result = newResults.results.find(r => r.id === p.id);
      const won = result ? result.amountWon : 0;
      // Current engine chips are already final. So subtract won amount to get "before win" state.
      visualChips.value[p.id] = p.chips - won;
    });

    // Initialize Visual Pot from total pot (or calculate from detailedPots)
    // If detailedPots exists, we animate.
    if (newResults.detailedPots && newResults.detailedPots.length > 0) {
      // Use natural order: Main Pot first (Index 0), then Side Pots
      const potsToAnimate = [...newResults.detailedPots];

      // Calculate total starting visually
      visualTotalPot.value = potsToAnimate.reduce((sum, p) => sum + p.amount, 0);

      for (const pot of potsToAnimate) {
        // 1. Announce Pot
        currentPotName.value = pot.name;
        activePotWinner.value = pot.winners; // Array of IDs

        // 2. Wait for visual emphasis
        await new Promise(r => setTimeout(r, 2000));

        // 3. Deduct amount from visual pot (simulate distribution)
        visualTotalPot.value -= pot.amount;
        audioManager.playSFX('chip-ship-it');
        // [NEW] Distribute chips to winners visually
        const share = Math.floor(pot.amount / pot.winners.length); // Simplified share
        pot.winners.forEach(winnerId => {
          if (visualChips.value[winnerId] !== undefined) {
            visualChips.value[winnerId] += share;
          }
        });

        // 4. Brief pause before next
        await new Promise(r => setTimeout(r, 2000));
      }

      // End of sequence
      activePotWinner.value = null;
      currentPotName.value = '';
    }

    // Fallback or After Animation: Show final winner state if desired?
    // Actually, maybe just keep the main winner highlighted or duplicate the final state.
    // Let's keep the final winner highlighted for a bit.

    if (showdownTimer) clearTimeout(showdownTimer);
    showShowdown.value = false;
    // Reset visual pot to engine pot (likely 0 for next hand)
    visualTotalPot.value = props.engine.pot;
    visualChips.value = {}; // Reset visual chips
    // showdownTimer = setTimeout(() => {

    // }, 2000); // Give a bit more time after animation
  } else {
    showShowdown.value = false;
  }
});

const currentRam = computed(() => {
  const p = props.engine.players[0];
  return p.ram.used + p.ram.reserved;
});
const ramPercent = computed(() => (currentRam.value / props.engine.players[0].class.maxRam) * 100);

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
    // Normalizing 1 Buy-In to 100 "BB" visual unit
    // If standard table buy-in is 1000, we treat 10 chips as 1 BB (1000 / 100)
    // regardless of actual blind structure (e.g. 2/5 or 5/10) if user wants "Stack based" BB
    // However, user specifically asked for "Table's Base Buy-In" basis check.
    const baseBB = props.engine.buyIn ? (props.engine.buyIn / 100) : props.engine.bb;
    if (baseBB > 0) return (val / baseBB).toFixed(1) + ' BB';
  }
  return val + ' CR';
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

<style scoped>
@import '../styles/components/PokerTable.css';

.effect-hud {
  /* position: absolute; */
  /* right: -40px; */
  display: flex;
  gap: 5px;
  background: rgba(0, 0, 0, 0.6);
  padding: 4px;
  border-radius: 4px;
  border: 1px solid rgba(0, 240, 255, 0.3);
  backdrop-filter: blur(4px);
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
}

.eff-icon {
  font-size: 0.8rem;
}

.eff-stack {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: #ff003c;
  color: #fff;
  font-size: 0.5rem;
  font-weight: 800;
  padding: 1px 3px;
  border-radius: 3px;
  line-height: 1;
}


.time-bank {
  position: absolute;
  bottom: -20px;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  height: 4px;
  border-radius: 2px;
}

.time-bar {
  height: 100%;
  background: #ffcc00;
  /* Yellow warning color? or Cyan? */
  background: linear-gradient(90deg, #00f0ff, #fff);
  box-shadow: 0 0 5px #00f0ff;
  transition: width 1s linear;
}

.time-text {
  position: absolute;
  top: -16px;
  right: 0;
  font-size: 0.7rem;
  font-weight: bold;
  color: #00f0ff;
  text-shadow: 0 0 2px #00f0ff;
}
</style>
