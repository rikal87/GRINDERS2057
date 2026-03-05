<template>
  <span class="chip-display">{{ formattedValue }}</span>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  value: { type: Number, required: true },
  bb: { type: Number, default: 0 }, // Room BB for conversion
  speed: { type: Number, default: 0.1 } // Lerp factor
});

import { store } from '../logic/store';
import { computed } from 'vue';

const displayValue = ref(props.value);
const formattedValue = computed(() => {
  if (store.settings.showAsBB && props.bb > 0) {
    const bbVal = displayValue.value / props.bb;
    return bbVal.toFixed(1).toLocaleString() + ' BB';
  }
  return Math.floor(displayValue.value).toLocaleString() + ' CR';
});

let animationFrame = null;

const animate = () => {
  const diff = props.value - displayValue.value;

  // High speed threshold for "transfer" feel
  if (Math.abs(diff) < 0.5) {
    displayValue.value = props.value;
    return;
  }

  // fast lerp
  displayValue.value += diff * 0.15;
  animationFrame = requestAnimationFrame(animate);
};

watch(() => props.value, (newVal) => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  animate();
});

onMounted(() => {
  displayValue.value = props.value;
});
</script>

<style scoped>
.chip-display {
  font-variant-numeric: tabular-nums;
  transition: color 0.2s;
}
</style>
