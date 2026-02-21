<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="terminal-msg history-popup">
      <header class="popup-header">
        <h2 class="glitch-text" data-text="PLAY_HISTORY">PLAY_HISTORY</h2>
        <button class="btn-close" @click="$emit('close')">X</button>
      </header>

      <div class="history-content">
        <!-- List of Hands -->
        <div v-if="!selectedHand" class="hand-list">
          <div v-for="hand in history" :key="hand.id" class="hand-item" @click="selectedHand = hand">
            <div class="hand-meta">
              <span class="time">{{ hand.timestamp }}</span>
              <span class="pot">POT:
                <ChipDisplay :value="hand.pot" :bb="hand.blinds.bb" />
              </span>
            </div>
            <div class="hand-result">
              <span class="winner" :class="{ 'hero': hand.winner === 'player' }">
                WINNER: {{ hand.winner === 'player' ? 'YOU' : 'AGENT' }}
                <div class="winner-hand-rank">{{ hand.winnerHand }}</div>
              </span>
              <div class="board-mini">
                <span v-for="card in hand.board" :key="card" class="card-dot"></span>
              </div>
            </div>
          </div>
          <div v-if="history.length === 0" class="empty-msg">NO_RECORDS_FOUND</div>
        </div>

        <!-- Detailed Hand View -->
        <div v-else class="hand-detail">
          <button class="btn-back" @click="selectedHand = null">&lt; BACK_TO_LIST</button>

          <div class="hand-summary">
            <div class="summary-line">TIME: {{ selectedHand.timestamp }}</div>
            <div class="summary-line">TOTAL_POT:
              <ChipDisplay :value="selectedHand.pot" :bb="selectedHand.blinds.bb" />
            </div>
            <div class="summary-line">RESULT: {{ selectedHand.winnerHand }}</div>

            <!-- Detailed Pot Breakdown -->
            <div v-if="selectedHand.detailedPots && selectedHand.detailedPots.length > 0" class="detailed-pots">
              <div v-for="(pot, pIdx) in selectedHand.detailedPots" :key="pIdx" class="pot-item">
                <span class="pot-name">{{ pot.name }}</span>
                <span class="pot-amount">
                  <ChipDisplay :value="pot.amount" :bb="selectedHand.blinds.bb" />
                </span>
                <span class="pot-winners">
                  WIN: <span v-for="w in pot.winners" :key="w" class="winner-id">{{ w.replace('cpu_',
                    'AI_').replace('player', 'YOU') }}</span>
                </span>
              </div>
            </div>

            <!-- Community Board -->
            <div v-if="selectedHand.board && selectedHand.board.length > 0" class="board-display">
              <span class="label">BOARD:</span>
              <div class="mini-cards">
                <span v-for="(card, cIdx) in selectedHand.board" :key="cIdx" class="mini-card"
                  :class="getSuitClass(card)">
                  {{ getCardLabel(card) }}
                </span>
              </div>
            </div>

            <!-- Showdown Hands -->
            <div v-if="selectedHand.playerResults && selectedHand.playerResults.length > 0" class="showdown-hands">
              <div class="label">SHOWDOWN_HANDS:</div>
              <div v-for="res in selectedHand.playerResults" :key="res.id" class="showdown-entry"
                :class="{ 'winner': res.isWinner }">
                <span class="p-name">{{ res.id === 'player' ? 'YOU' : res.name || res.id }}</span>
                <div class="p-cards">
                  <span v-for="(card, cIdx) in res.hand.cards" :key="cIdx" class="mini-card"
                    :class="getSuitClass(card)">
                    {{ getCardLabel(card) }}
                  </span>
                </div>
                <span class="p-rank">{{ res.hand.name }}</span>
              </div>
            </div>
          </div>

          <div class="street-tabs">
            <button v-for="street in ['PREFLOP', 'FLOP', 'TURN', 'RIVER']" :key="street"
              :class="{ 'active': activeStreet === street, 'empty': !selectedHand.actions[street].length }"
              @click="activeStreet = street">
              {{ street }}
            </button>
          </div>

          <div class="action-log">
            <div v-for="(action, idx) in selectedHand.actions[activeStreet]" :key="idx" class="action-entry">
              <span class="actor" :class="{ 'hero': action.player === 'YOU' }">[{{ action.player }}]</span>
              <span class="type">{{ action.type.toUpperCase() }}</span>
              <span class="amount" v-if="action.amount > 0">{{ action.amount }} CR</span>
              <span class="pot-state">POT: {{ action.pot }}</span>
            </div>
            <div v-if="!selectedHand.actions[activeStreet].length" class="empty-street">
              NO_ACTION_IN_THIS_STREET
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChipDisplay from './ChipDisplay.vue';

const props = defineProps({
  history: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close']);

const selectedHand = ref(null);
const activeStreet = ref('PREFLOP');

// Helper to convert card string/object to displayable label
const getCardLabel = (card) => {
  if (!card) return '?';
  let rank, suit;

  if (typeof card === 'object') {
    rank = card.rank || '?';
    suit = card.suit || '?';
  } else {
    // string "Ah", "Td"
    suit = card.slice(-1);
    rank = card.slice(0, -1);
  }

  const suitMap = {
    'h': '♥', 'd': '♦', 's': '♠', 'c': '♣',
    'H': '♥', 'D': '♦', 'S': '♠', 'C': '♣'
  };

  return rank.toUpperCase() + (suitMap[suit] || suit);
};

const getSuitClass = (card) => {
  if (!card) return '';
  let suit = '';
  if (typeof card === 'object') {
    suit = card.suit;
  } else {
    suit = card.slice(-1);
  }

  // Also check if the suit is already converted or upper case
  const redSuits = ['h', 'd', 'H', 'D', '♥', '♦'];
  return redSuits.includes(suit) ? 'red-suit' : 'black-suit';
};
</script>

<style scoped>
.history-popup {
  width: 90%;
  max-width: 600px;
  height: 55vh;
  display: flex;
  flex-direction: column;
  background: #050a0e;
  border: 2px solid var(--neon-cyan);
  padding: 1.5rem;
  margin-top: 50px;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.btn-close {
  background: none;
  border: none;
  color: var(--neon-cyan);
  font-size: 1.2rem;
  cursor: pointer;
}

.history-content {
  flex: 1;
  overflow-y: auto;
}

/* List View */
.hand-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hand-item {
  background: rgba(0, 240, 255, 0.05);
  border: 1px solid var(--glass-border);
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.hand-item:hover {
  background: rgba(0, 240, 255, 0.1);
  border-color: var(--neon-cyan);
}

.hand-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  opacity: 0.7;
  margin-bottom: 5px;
}

.hand-result {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.winner {
  font-weight: bold;
  font-size: 0.8rem;
  color: var(--neon-magenta);
}

.winner.hero {
  color: var(--neon-yellow);
}

.winner-hand-rank {
  font-size: 0.6rem;
  opacity: 0.6;
  font-weight: normal;
}

.board-mini {
  display: flex;
  gap: 3px;
}

.card-dot {
  width: 6px;
  height: 8px;
  background: var(--neon-cyan);
  border-radius: 1px;
}

/* Detail View */
.btn-back {
  background: none;
  border: 1px solid var(--neon-cyan);
  color: var(--neon-cyan);
  padding: 5px 10px;
  font-size: 0.7rem;
  margin-bottom: 1rem;
  cursor: pointer;
}

.hand-summary {
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-left: 2px solid var(--neon-yellow);
  margin-bottom: 1.5rem;

  font-size: 0.75rem;
}

.street-tabs {
  display: flex;
  gap: 2px;
  margin-bottom: 1rem;
}

.street-tabs button {
  flex: 1;
  padding: 8px 2px;
  font-size: 0.6rem;
  background: #111;
  border: 1px solid #333;
  color: #666;
  cursor: pointer;
}

.street-tabs button.active {
  background: var(--neon-cyan);
  color: #000;
  border-color: var(--neon-cyan);
}

.street-tabs button.empty {
  opacity: 0.3;
}

.action-log {
  background: rgba(255, 255, 255, 0.02);
  padding: 10px;
  border-radius: 4px;
}

.action-entry {

  font-size: 0.75rem;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  gap: 8px;
  align-items: center;
}

.actor {
  color: var(--neon-cyan);
}
.actor.hero {
  color: var(--neon-yellow);
}
.type {
  font-weight: bold;
  color: #fff;
}
.amount {
  color: var(--neon-magenta);
}
.pot-state {
  margin-left: auto;
  opacity: 0.5;
  font-size: 0.65rem;
}

.empty-street {
  text-align: center;
  padding: 2rem;
  opacity: 0.3;
  font-size: 0.7rem;
}

.empty-msg {
  text-align: center;
  padding: 3rem;
  opacity: 0.5;
}

/* Detailed Pot & Showdown Styles */
.detailed-pots {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
}
.pot-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: var(--neon-cyan);
  margin-bottom: 4px;
}
.pot-winners {
  color: var(--neon-yellow);
}

.board-display {
  margin-top: 15px;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.mini-cards {
  display: flex;
  gap: 5px;
}
.mini-card {
  background: #eee;
  color: #000;
  padding: 2px 4px;
  border-radius: 2px;
  font-weight: bold;
  font-size: 0.7rem;
  min-width: 20px;
  text-align: center;
}
.mini-card.red-suit {
  color: #d00;
}
.mini-card.black-suit {
  color: #000;
}

.showdown-hands {
  margin-top: 15px;
}
.showdown-entry {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.75rem;
}
.showdown-entry.winner {
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid var(--neon-yellow);
}
.p-name {
  width: 80px;
  color: var(--neon-blue);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.showdown-entry.winner .p-name {
  color: var(--neon-yellow);
  font-weight: bold;
}
.p-cards {
  display: flex;
  gap: 3px;
}
.p-rank {
  margin-left: auto;
  opacity: 0.8;
  font-size: 0.7rem;
}
</style>
