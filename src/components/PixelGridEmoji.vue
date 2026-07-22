<template>
  <div class="futuristic-pixel-device" :class="color">
    <!-- Corner Lock-On Reticle Brackets (┌ ┐ └ ┘) -->
    <div class="fui-bracket top-left"></div>
    <div class="fui-bracket top-right"></div>
    <div class="fui-bracket bottom-left"></div>
    <div class="fui-bracket bottom-right"></div>

    <!-- Laser Pulse Scanbeam -->
    <div class="fui-laser-beam"></div>

    <!-- High-Detail Multitone Pixel Grid Canvas -->
    <canvas ref="canvasRef" class="pixel-grid-canvas"></canvas>

    <!-- Sub-Data Hex Metadata Tag -->
    <div class="sub-hex-tag">{{ hexTag }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';

const props = defineProps({
  emoji: {
    type: String,
    default: '⚙️'
  },
  color: {
    type: String,
    default: 'cyan' // 'cyan', 'yellow', 'magenta'
  },
  gridSize: {
    type: Number,
    default: 32
  }
});

const canvasRef = ref(null);

const hexTag = computed(() => {
  const code = (props.emoji.codePointAt(0) || 0x4F).toString(16).toUpperCase();
  return `0x${code.slice(-2)}`;
});

const renderPixelGrid = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const size = 64; // Resolution size
  canvas.width = size;
  canvas.height = size;

  // 1. Render emoji with contrast prep to boost inner details
  ctx.clearRect(0, 0, size, size);
  ctx.font = '44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(props.emoji, size / 2, size / 2 + 2);

  // 2. Extract ImageData
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;

  // 3. Clear canvas for multitone pixel-grid reconstruction
  ctx.clearRect(0, 0, size, size);

  // Define Base Neon RGB
  let r = 0, g = 240, b = 255;
  if (props.color === 'yellow') { r = 204; g = 255; b = 0; }
  if (props.color === 'magenta') { r = 255; g = 0; b = 92; }

  const gridCount = props.gridSize; // 32x32 resolution
  const step = size / gridCount;

  // 4. Sample pixels with Multitone Brightness-to-Alpha Shading Engine
  for (let gy = 0; gy < gridCount; gy++) {
    for (let gx = 0; gx < gridCount; gx++) {
      const px = Math.floor((gx + 0.5) * step);
      const py = Math.floor((gy + 0.5) * step);
      const idx = (py * size + px) * 4;

      const pr = data[idx];
      const pg = data[idx + 1];
      const pb = data[idx + 2];
      const alpha = data[idx + 3];

      if (alpha > 20) {
        // Calculate Luminance (0.0 to 1.0)
        const lum = (0.299 * pr + 0.587 * pg + 0.114 * pb) / 255;
        const opacity = Math.max(0.15, Math.min(1, (alpha / 255) * (0.3 + lum * 0.7)));

        // If luminance is very low (inner lines/shadows like eyes, folds, cards lines)
        if (lum < 0.25) {
          // Draw dark inner outline block
          ctx.fillStyle = `rgba(0, 0, 0, 0.85)`;
          ctx.fillRect(gx * step, gy * step, step, step);
        } else {
          // Draw Multitone Neon block scaled by luminance
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(2)})`;
          const blockSize = Math.max(1, step - 0.2);
          ctx.fillRect(gx * step, gy * step, blockSize, blockSize);

          // Add bright highlight core for high luminance pixels
          if (lum > 0.8) {
            ctx.fillStyle = `rgba(255, 255, 255, 0.75)`;
            ctx.fillRect(gx * step + step * 0.25, gy * step + step * 0.25, step * 0.5, step * 0.5);
          }
        }
      }
    }
  }
};

onMounted(() => {
  renderPixelGrid();
});

watch(() => [props.emoji, props.color, props.gridSize], () => {
  renderPixelGrid();
});
</script>

<style scoped>
.futuristic-pixel-device {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000000;
  border: 1px solid rgba(0, 240, 255, 0.3);
  padding: 0.6rem 0.6rem 0.4rem 0.6rem;
  box-sizing: border-box;
  overflow: hidden;
}

.futuristic-pixel-device.yellow {
  border-color: var(--neon-yellow);
  box-shadow: 0 0 12px rgba(204, 255, 0, 0.2);
}

.futuristic-pixel-device.magenta {
  border-color: var(--neon-magenta);
  box-shadow: 0 0 12px rgba(255, 0, 92, 0.2);
}

.futuristic-pixel-device.cyan {
  border-color: var(--neon-cyan);
  box-shadow: 0 0 12px rgba(0, 240, 255, 0.2);
}

/* Corner Lock-On Reticle Brackets */
.fui-bracket {
  position: absolute;
  width: 6px;
  height: 6px;
  pointer-events: none;
}

.futuristic-pixel-device.cyan .fui-bracket { border-color: var(--neon-cyan); }
.futuristic-pixel-device.yellow .fui-bracket { border-color: var(--neon-yellow); }
.futuristic-pixel-device.magenta .fui-bracket { border-color: var(--neon-magenta); }

.fui-bracket.top-left { top: 2px; left: 2px; border-top: 2px solid; border-left: 2px solid; }
.fui-bracket.top-right { top: 2px; right: 2px; border-top: 2px solid; border-right: 2px solid; }
.fui-bracket.bottom-left { bottom: 2px; left: 2px; border-bottom: 2px solid; border-left: 2px solid; }
.fui-bracket.bottom-right { bottom: 2px; right: 2px; border-bottom: 2px solid; border-right: 2px solid; }

/* Laser Pulse Scanbeam */
.fui-laser-beam {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--neon-cyan);
  opacity: 0.7;
  box-shadow: 0 0 8px var(--neon-cyan);
  animation: laserScan 2.5s linear infinite;
  pointer-events: none;
}

.futuristic-pixel-device.yellow .fui-laser-beam {
  background: var(--neon-yellow);
  box-shadow: 0 0 8px var(--neon-yellow);
}

.futuristic-pixel-device.magenta .fui-laser-beam {
  background: var(--neon-magenta);
  box-shadow: 0 0 8px var(--neon-magenta);
}

@keyframes laserScan {
  0% { top: -2px; opacity: 0; }
  15% { opacity: 0.8; }
  85% { opacity: 0.8; }
  100% { top: 100%; opacity: 0; }
}

/* Canvas Display */
.pixel-grid-canvas {
  width: 58px;
  height: 58px;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  display: block;
}

/* Sub-Data Hex Tag */
.sub-hex-tag {
  font-size: 0.58rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  margin-top: 0.2rem;
  opacity: 0.85;
}

.futuristic-pixel-device.cyan .sub-hex-tag { color: var(--neon-cyan); }
.futuristic-pixel-device.yellow .sub-hex-tag { color: var(--neon-yellow); }
.futuristic-pixel-device.magenta .sub-hex-tag { color: var(--neon-magenta); }
</style>
