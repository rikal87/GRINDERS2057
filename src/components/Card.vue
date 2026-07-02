<template>
  <div class="poker-card" :class="{ 'flipped': !hidden }">
    <div class="card-inner">
      <div class="card-front" :class="suitClass">
        <div class="card-content">
          <div class="rank">{{ rank }}</div>
          <div class="suit">{{ suitIcon }}</div>
        </div>
      </div>
      <div class="card-back">
        <div class="matrix-effect"></div>
      </div>
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
  perspective: 1000px;
  margin: 5px;
  background: transparent;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
}

.poker-card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Outfit', sans-serif;
  font-weight: bold;
  font-size: 1.2rem;
  padding: 0;
  box-sizing: border-box;
}

.card-front {
  background: #fff;
  color: #000;
  transform: rotateY(180deg);
}

.card-front.red {
  color: #ff003c !important;
}
.card-front.blue {
  color: #0070ff !important;
}
.card-front.green {
  color: #00b341 !important;
}
.card-front.black {
  color: #000 !important;
}

.card-back {
  background: #050a0e;
  border: 1px solid var(--neon-cyan);
}

.card-back::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #050a0e 25%, #00f0ff11 50%, #050a0e 75%);
  background-size: 200% 200%;
  animation: shine 2s linear infinite;
  border-radius: 5px;
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

