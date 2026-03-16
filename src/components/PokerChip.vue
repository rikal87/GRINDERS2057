<template>
  <div class="poker-chip" :style="chipStyle" :data-tooltip="value.toLocaleString() + ' CR'">
    <div class="edge-stripes"></div>
    <div class="inner-circle">
      <div class="center-label">{{ formattedLabel }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: Number,
    required: true
  }
});

const formattedLabel = computed(() => {
  const val = props.value;
  if (val >= 1000000) {
    return (val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1).replace('.0', '') + 'M';
  }
  if (val >= 1000) {
    return (val / 1000).toFixed(val % 1000 === 0 ? 0 : 1).replace('.0', '') + 'K';
  }
  return val.toString();
});

const chipStyle = computed(() => {
  const val = props.value;
  let color = '#ffffff'; // Default
  let textColor = '#333';
  let textStroke = '0.5px #fff';
  let glow = 'unset';

  if (val < 10) {
    color = '#ffffff'; // White (10)
  } else if (val < 50) {
    color = '#ff3b3b'; // Red (50)
  } else if (val < 100) {
    color = '#3b82f6'; // Blue (100)
  } else if (val < 250) {
    color = '#10b981'; // Green (200)
  } else if (val < 1000) {
    color = '#1f2937'; // Black (500)
    textColor = '#ddd';
    textStroke = '0.5px #000';
  } else if (val < 5000) {
    color = '#8b5cf6'; // Purple (5000)
  } else if (val < 10000) {
    color = '#fdc700'; // YELLOW (10000)
  } else if (val < 50000) {
    color = '#f59e0b'; // Orange (50000)
  } else if (val < 100000) {
    color = '#00f0ff'; // Cyan (100000)
    glow = '0 0 12px rgba(0, 240, 255, 0.7)';
  } else if (val < 1000000) {
    color = '#ec4899'; // Pink (1000000)
    glow = '0 0 12px rgba(236, 72, 153, 0.7)';
  } else if (val < 10000000) {
    color = '#ff003c'; // NEON-MAGENTA (10000000)
    glow = '0 0 12px rgba(255, 0, 60, 0.7)';
  } else {
    color = '#facc15'; // Gold (10000000+)
    glow = '0 0 15px rgba(250, 204, 21, 0.8)';
  }

  return {
    '-webkit-text-stroke': textStroke,
    '--chip-color': color,
    '--text-color': textColor,
    'box-shadow': glow
  };
});
</script>

<style scoped>
.test {
  color: #fdc700;
  text-shadow: 0 0 12px rgba(236, 72, 153, 0.7);
}

.poker-chip {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--chip-color);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(0, 0, 0, 0.2);
  user-select: none;
  flex-shrink: 0;
  transition: transform 0.2s ease;
  cursor: default;
  font-family: 'Impact';
}

.poker-chip:hover {
  transform: translateY(-2px) scale(1.1);
  z-index: 10;
}

.inner-circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
}

.center-label {
  font-size: 0.8rem;
  font-weight: 900;
  /* -webkit-text-stroke: 0.5px #fff; */
  color: var(--text-color);
  line-height: 1;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.3);
  z-index: 1;
}

.edge-stripes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: repeating-conic-gradient(from 0deg,
      transparent 0deg 30deg,
      rgba(255, 255, 255, 0.3) 30deg 45deg,
      transparent 45deg 75deg);
  pointer-events: none;
}
</style>
