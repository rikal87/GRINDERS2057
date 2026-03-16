<template>
  <div class="chip-stack-container" 
    :class="[
      { 'has-label': showLabel },
      collecting ? 'collecting' : '',
      collecting && winnerSeat ? getCollectionClass() : ''
    ]"
  >
    <div class="stacks-container">
      <div v-for="(stack, sIndex) in groupedStacks" :key="sIndex" class="stack-column">
        <div class="stack-visual">
          <TransitionGroup name="chip-drop">
            <div v-for="(chip, cIndex) in stack" :key="chip.id" class="chip-wrapper" :style="getChipStyle(cIndex, stack.length, sIndex)">
              <PokerChip :value="chip.value" />
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
    <div v-if="showLabel && labelPosition === 'bottom'" 
      class="stack-label bottom"
      :class="{ 'collecting': collecting && amount === 0 }"
    >
      {{ formattedAmount }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import PokerChip from './PokerChip.vue';
import { store } from '../logic/store';

const props = defineProps({
  amount: {
    type: Number,
    required: true
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  labelPosition: {
    type: String,
    default: 'top' // 'top' or 'bottom'
  },
  bb: {
    type: Number,
    default: 0
  },
  collecting: {
    type: Boolean,
    default: false
  },
  winnerSeat: {
    type: String,
    default: '' // e.g. 'seat-0', 'seat-bottom'
  }
});

const denominations = [1000000, 100000, 50000, 10000, 5000, 1000, 500, 250, 100, 50, 10, 5];
const MAX_HEIGHT = 20;

const groupedStacks = computed(() => {
  let remaining = props.amount;
  if (remaining <= 0) return [];

  // 1. Initial Greedy Breakdown
  const allUsed = [];
  for (const den of denominations) {
    const totalCount = Math.floor(remaining / den);
    if (totalCount > 0) {
      allUsed.push({ den, count: totalCount, totalValue: den * totalCount });
      remaining -= totalCount * den;
    }
  }

  // 2. 80/20 Rule Logic
  const sortedByValue = [...allUsed].sort((a, b) => b.totalValue - a.totalValue);
  const selectedDens = new Set();
  let currentVal = 0;
  for (let i = 0; i < sortedByValue.length && i < 3; i++) {
    selectedDens.add(sortedByValue[i].den);
    currentVal += sortedByValue[i].totalValue;
    if (currentVal >= props.amount * 0.8) break;
  }
  const usedByDenSize = [...allUsed].sort((a, b) => a.den - b.den);
  let changeCount = 0;
  for (const item of usedByDenSize) {
    if (!selectedDens.has(item.den)) {
      selectedDens.add(item.den);
      changeCount++;
      if (changeCount >= 2) break;
    }
  }

  // 3. Generate Visual Stacks
  const groups = [];
  for (const item of allUsed) {
    if (selectedDens.has(item.den)) {
      let tempCount = item.count;
      while (tempCount > 0) {
        const stackSize = Math.min(tempCount, MAX_HEIGHT);
        const stack = [];
        for (let i = 0; i < stackSize; i++) {
          stack.push({
            id: `chip-${item.den}-${groups.length}-${i}`,
            value: item.den
          });
        }
        groups.push(stack);
        tempCount -= stackSize;
      }
    }
  }
  return groups;
});

const formattedAmount = computed(() => {
  if (store.settings.showAsBB && props.bb > 0) {
    return (props.amount / props.bb).toFixed(1) + ' BB';
  }
  const val = props.amount;
  if (val >= 1000000) return (val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1).replace('.0', '') + 'M';
  if (val >= 1000) return (val / 1000).toFixed(val % 1000 === 0 ? 0 : 1).replace('.0', '') + 'K';
  return val.toLocaleString();
});

const getChipStyle = (index, stackTotal, sIndex) => {
  const reverseIndex = stackTotal - 1 - index;
  // Stagger stacks slightly if multiple
  const stackDelay = sIndex * 0.1;
  return {
    zIndex: index,
    '--stack-y': `-${index * 3}px`,
    '--enter-delay': `${index * 0.05 + stackDelay}s`,
    '--leave-delay': `${reverseIndex * 0.04 + stackDelay}s`
  };
};

const getCollectionClass = () => {
  if (!props.winnerSeat) return '';
  if (props.winnerSeat.includes('bottom')) return 'collecting-to-bottom';
  if (props.winnerSeat.includes('top')) return 'collecting-to-top';
  if (['seat-0', 'seat-1', 'seat-2'].includes(props.winnerSeat)) return 'collecting-to-right';
  return 'collecting-to-left';
};
</script>

<style scoped>
.chip-stack-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stacks-container {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
  height: 25px;
}

.stack-column {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stack-visual {
  position: relative;
  height: 25px;
  overflow: visible;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 24px;
}

.chip-wrapper {
  position: absolute;
  bottom: 0;
  transform: translateY(var(--stack-y, 0));
}

.stack-label {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--neon-yellow);
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.8), 0 0 2px var(--neon-yellow);
  white-space: nowrap;
  letter-spacing: 0.5px;
  transition: opacity 0.3s ease;
}

.stack-label.collecting {
  opacity: 0;
}

.stack-label.bottom {
  margin-top: 2px;
}

/* Chip Drop Animation */
.chip-drop-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition-delay: var(--enter-delay);
}

.chip-drop-enter-from {
  opacity: 0;
  transform: translateY(-40px);
}

.chip-drop-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: var(--leave-delay);
  z-index: 100;
}

.chip-drop-leave-to {
  opacity: 0;
  transform: translateY(calc(var(--stack-y) - 60px)) scale(0.5);
}

/* Directional fly-away */
.collecting-to-bottom .chip-drop-leave-to { 
  transform: translateY(calc(var(--stack-y) + 200px)) scale(0.2); 
}
.collecting-to-top .chip-drop-leave-to { 
  transform: translateY(calc(var(--stack-y) - 200px)) scale(0.2); 
}
.collecting-to-left .chip-drop-leave-to { 
  transform: translate(-300px, calc(var(--stack-y) - 100px)) scale(0.1); 
}
.collecting-to-right .chip-drop-leave-to { 
  transform: translate(300px, calc(var(--stack-y) - 100px)) scale(0.1); 
}

.chip-drop-move {
  transition: transform 0.3s ease;
}
</style>
