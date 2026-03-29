<template>
  <div class="card poker-card" :class="[suitClass, { 'hidden': hidden }]">
    <div v-if="!hidden" class="card-content">
      <div class="rank">{{ rank }}</div>
      <div class="suit">{{ suitIcon }}</div>
    </div>
    <div v-else class="card-back">
      <div class="matrix-effect"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { store } from '../logic/store';

const props = defineProps({
  code: String, // e.g., 'As', 'Th'
  hidden: Boolean
});

const rank = computed(() => props.code ? props.code[0].replace('T', '10') : '');
const suit = computed(() => props.code ? props.code[1] : '');

const suitClass = computed(() => {
  if (props.hidden) return '';
  const s = suit.value;
  const is4Color = store.settings.fourColorMode;

  if (s === 'h') return 'red';
  if (s === 's') return 'black';

  if (is4Color) {
    if (s === 'd') return 'blue';
    if (s === 'c') return 'green';
  } else {
    if (s === 'd') return 'red';
    if (s === 'c') return 'black';
  }
  return '';
});

const suitIcon = computed(() => {
  const icons = { 's': '♠', 'h': '♥', 'd': '♦', 'c': '♣' };
  return icons[suit.value] || '';
});
</script>

<style scoped>
.poker-card {
  width: 60px;
  height: 85px;
  background: #fff;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Outfit', sans-serif;
  font-weight: bold;
  font-size: 1.2rem;
  color: #000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  padding: 0;
  margin: 5px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.poker-card.red {
  color: #ff003c !important;
}
.poker-card.blue {
  color: #0070ff !important;
}
.poker-card.green {
  color: #00b341 !important;
}
.poker-card.black {
  color: #000 !important;
}

.poker-card.hidden {
  background: #050a0e;
  border: 1px solid var(--neon-cyan);
}

.card-back {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #050a0e 25%, #00f0ff11 50%, #050a0e 75%);
  background-size: 200% 200%;
  animation: shine 2s linear infinite;
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes shine {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.rank {
  line-height: 1;
}
.suit {
  line-height: 1;

}
</style>
