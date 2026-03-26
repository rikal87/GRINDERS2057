<template>
  <div class="lobby-container">
    <div class="city-skyline">
      <div class="minimap-viewport">
        <!-- Single canvas: draws map image + digital rain stream together -->
        <canvas ref="mapCanvas" class="map-canvas"></canvas>
        <div class="minimap-overlay">
          <div :class="['location-tag', { 'typing': isAnimating }]">{{ currentMapLocationName }}</div>
          <div :class="['crosshair', { 'targeting': isAnimating }]"></div>
        </div>
      </div>
      <div class="lobby-content">
        <div class="menu-grid">
          <div class="grid-item" @click="$emit('openSearch')" @mouseenter="setMapLocation('CASINO')">
            <div class="icon">F</div>
            <div class="label">TABLE_SEARCH</div>
            <div class="desc">CASINO_DISTRICT</div>
          </div>
          <div class="grid-item" @click="$emit('view', 'home')" @mouseenter="setMapLocation('HABITAT')">
            <div class="icon">H</div>
            <div class="label">HABITAT</div>
            <div class="desc">RESIDENTIAL_ZONE</div>
          </div>
          <div class="grid-item" @click="$emit('view', 'shop')" @mouseenter="setMapLocation('BLACK_MARKET')">
            <div class="icon">S</div>
            <div class="label">BLACK_MARKET</div>
            <div class="desc">UNRESTRICTED_ZONE</div>
          </div>
          <div class="grid-item disabled" disabled="disabled" @mouseenter="setMapLocation('EXCHANGE')">
            <div class="icon">C</div>
            <div class="label">CRYPTO_NEXUS</div>
            <div class="desc">FINANCIAL_DISTRICT</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { audioManager } from '../logic/audioManager.js';
import minimapSrc from '../assets/image/minimap.v5.webp';

const emit = defineEmits(['view', 'openSearch']);

const currentMapKey = ref('DEFAULT');
// Positions as x/y percentages (same semantics as CSS background-position)
const mapPositions = {
  DEFAULT: { x: 50, y: 50, name: 'FINDING_LOCATION...' },
  CASINO: { x: 5, y: 100, name: 'CASINO_STRIP' },
  HABITAT: { x: 95, y: 80, name: 'HABITAT' },
  BLACK_MARKET: { x: 100, y: 20, name: 'BLACK MARKET' },
  EXCHANGE: { x: 0, y: 50, name: 'FINANCIAL_SECTOR' },
};

const currentMapLocationName = computed(() => mapPositions[currentMapKey.value].name);

const setMapLocation = (key) => {
  if (currentMapKey.value !== key) {
    currentMapKey.value = key;
    triggerAnimation();
  }
};

const isAnimating = ref(false);
const triggerAnimation = () => {
  if (isAnimating.value) return;
  audioManager.playSFX('keyboard-type');
  isAnimating.value = true;
  setTimeout(() => { isAnimating.value = false; }, 1500);
};

// --- Unified Canvas ---
const mapCanvas = ref(null);
let animId = null;

function startCanvas(canvas) {
  const ctx = canvas.getContext('2d');

  // Load minimap image
  const img = new Image();
  img.src = minimapSrc;
  let imgLoaded = false;
  img.onload = () => { imgLoaded = true; initDrops(); };

  // Lerped pan position (0–100 percent)
  let curX = 50, curY = 50;
  const LERP = 0.04; // ≈ 1.2s settle at 60fps
  let offX = 0, offY = 0; // current pan offset — shared with drawRain

  // Rain config
  const LINE_WIDTH = 1;
  const COL_SPACING = 20;
  const SPEED_MIN = 1, SPEED_MAX = 4.5;
  const LEN_MIN = 220, LEN_MAX = 320;

  let w, h, drops;

  function initDrops() {
    // Drops are placed in IMAGE (world) space across the full image width
    const imgW = imgLoaded ? img.naturalWidth : 2048;
    const imgH = imgLoaded ? img.naturalHeight : 2048;
    const totalCols = Math.floor(imgW / COL_SPACING);
    drops = Array.from({ length: totalCols }, (_, i) => ({
      imgX: i * COL_SPACING + COL_SPACING / 2,     // world-space x
      // start spread across the full image height, not just bottom
      y: Math.random() * imgH,
      speed: SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN),
      len: LEN_MIN + Math.random() * (LEN_MAX - LEN_MIN),
      opacity: 0.15 + Math.random() * 0.35,
    }));
  }

  function init() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    initDrops();
  }

  function drawMap() {
    if (!imgLoaded) { ctx.fillStyle = '#111'; ctx.fillRect(0, 0, w, h); return; }
    // Lerp toward the active target
    const tgt = mapPositions[currentMapKey.value];
    curX += (tgt.x - curX) * LERP;
    curY += (tgt.y - curY) * LERP;
    // CSS background-position % semantics: offset = (container - image) * pct
    offX = (w - img.naturalWidth) * (curX / 100);
    offY = (h - img.naturalHeight) * (curY / 100);
    ctx.save();
    ctx.globalAlpha = 0.72;
    ctx.drawImage(img, offX, offY);
    ctx.restore();
  }

  function drawRain() {
    // 'screen' blend: streams glow brightest on the cyan city wireframe
    ctx.globalCompositeOperation = 'screen';
    const imgH = imgLoaded ? img.naturalHeight : 2048;
    drops.forEach((drop) => {
      // Convert world (image) coordinates → screen coordinates
      const screenX = drop.imgX + offX;
      // Cull: skip if this column is off-screen (with a small margin)
      if (screenX < -10 || screenX > w + 10) {
        drop.y -= drop.speed; // still advance time
        if (drop.y + drop.len < -offY) {
          drop.y = imgH - offY + drop.len * Math.random();
          drop.speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
          drop.len = LEN_MIN + Math.random() * (LEN_MAX - LEN_MIN);
          drop.opacity = 0.15 + Math.random() * 0.35;
        }
        return;
      }
      // Map world-y → screen-y (streams rise from the map surface upward)
      const screenTop = drop.y + offY;
      const screenBottom = screenTop + drop.len;
      if (screenBottom > 0 && screenTop < h) {
        const grad = ctx.createLinearGradient(screenX, screenTop, screenX, screenBottom);
        grad.addColorStop(0, `rgba(0,240,255,${drop.opacity})`);
        grad.addColorStop(0.5, `rgba(0,240,255,${drop.opacity * 0.7})`);
        grad.addColorStop(1, `rgba(0,240,255,0)`);
        ctx.beginPath();
        ctx.moveTo(screenX, Math.max(0, screenTop));
        ctx.lineTo(screenX, Math.min(h, screenBottom));
        ctx.strokeStyle = grad;
        ctx.lineWidth = LINE_WIDTH;
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#00f0ff';
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      drop.y -= drop.speed; // move upward in world space
      // Reset: once stream rises fully above the visible world area
      if (drop.y + drop.len < -offY) {
        drop.y = imgH - offY + drop.len * Math.random();
        drop.speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
        drop.len = LEN_MIN + Math.random() * (LEN_MAX - LEN_MIN);
        drop.opacity = 0.15 + Math.random() * 0.35;
      }
    });
    ctx.globalCompositeOperation = 'source-over';
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    drawMap();
    drawRain();
    animId = requestAnimationFrame(frame);
  }

  const ro = new ResizeObserver(() => init());
  ro.observe(canvas);
  init();
  frame();
  return ro;
}

onMounted(() => {
  triggerAnimation();
  audioManager.playTrackByZoneId('lobby');
  if (mapCanvas.value) {
    const ro = startCanvas(mapCanvas.value);
    onUnmounted(() => { cancelAnimationFrame(animId); ro.disconnect(); });
  }
});
</script>

<style scoped>
.lobby-container {
  flex-grow: 1;
  display: flex;
  max-height: 85vh;
  flex-direction: column;
  position: relative;
  /* overflow: hidden; */
}

.city-skyline {
  flex: 1;
  display: flex;
  border: 1px solid var(--neon-cyan);
}

.minimap-viewport {
  display: flex;
  flex: 1;
  background: #333;
}

.map-canvas {
  display: block;
  flex: 1;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}


.minimap-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.location-tag {
  position: absolute;
  bottom: 10px;
  right: 15px;
  font-size: 0.9rem;
  color: var(--neon-cyan);
  background: rgba(0, 0, 0, 0.85);
  padding: 4px 12px;
  border-left: 3px solid var(--neon-cyan);
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 5px var(--neon-cyan);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150px;
  height: 150px;
  color: #f8ef00;
  border: 4px solid rgba(248, 239, 0, 0.5);
  transform: translate(-50%, -50%);
}


.b1 {
  height: 150px;
  width: 40px;
}

.b2 {
  height: 250px;
  width: 80px;
}

.b3 {
  height: 180px;
  width: 50px;
}

.lobby-content {
  position: absolute;
  display: flex;
  flex-direction: column;
  bottom: 8vh;
  left: 50%;
  transform: translateX(-50%);
  padding: 2rem;
  z-index: 1;
}

.user-header {
  margin-bottom: 3rem;
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: 1rem;
  text-align: center;
}

.chip-balance .label {
  display: block;
  font-size: 0.7rem;
  color: var(--neon-cyan);
  /* margin-bottom: 5px; */
}

.chip-balance .value {
  font-size: 2rem;

  color: var(--neon-yellow);
  font-weight: 900;
}

.menu-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (min-width: 1000px) {
  .menu-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.grid-item.disabled {
  opacity: 0.5;
  filter: grayscale(0.5);
  cursor: not-allowed;
}

.grid-item {
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid var(--glass-border);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  width: 10rem;
  backdrop-filter: blur(2px);
}

.grid-item:hover {
  border-color: var(--neon-magenta);
}

.grid-item .icon {
  font-size: 2rem;
  font-weight: 900;
  color: var(--neon-magenta);
  margin-bottom: 1rem;
}

.grid-item .label {
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
}

.grid-item .desc {
  font-size: 0.6rem;
  opacity: 0.5;
  margin-top: 4px;
}

.grid-item.highlight {
  border-color: var(--neon-yellow);
  background: rgba(248, 239, 0, 0.05);
}

.grid-item.highlight:hover {
  background: rgba(248, 239, 0, 0.1);
  box-shadow: 0 0 20px rgba(248, 239, 0, 0.1);
}

.grid-item.highlight .icon {
  color: var(--neon-yellow);
}



.stat-label {
  color: #888;
}

.stat-value {
  color: var(--neon-yellow);
}

.stat-warning {
  color: var(--neon-magenta);
  font-size: 0.7rem;
  animation: blink 2s infinite;
}

.popup-actions {
  display: flex;
  gap: 15px;
  margin-top: 1rem;
}

.btn-confirm {
  flex: 1;
  background: var(--neon-cyan);
  color: #000;
  border: none;
  padding: 15px;
  font-weight: 900;
  cursor: pointer;
}

.btn-confirm:disabled {
  background: #333;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .lobby-content {
    padding: unset;
    left: unset;
    transform: unset;
    bottom: 10%;
  }
  .menu-grid {
    gap: 5px;
  }
}


/* --- Minimap Animations --- */
.crosshair.targeting {
  animation: target-lock 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes target-lock {
  0% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
    border-color: #fff;
  }
  50% {
    opacity: 1;
    border-color: var(--neon-magenta);
  }
  70% {
    transform: translate(-50%, -50%) scale(0.8);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    border-color: rgba(248, 239, 0, 0.8);
  }
}

.location-tag.typing {
  overflow: hidden;
  /* Ensures the content is not revealed until the animation */
  white-space: nowrap;
  /* Keeps the content on a single line */
  border-right: 2px solid var(--neon-cyan);
  /* The typwriter cursor */
  animation:
    typing 2s steps(30, end),
    blink-caret 1.1s step-end infinite;
  max-width: 0;
  animation-fill-mode: forwards;
}

@keyframes typing {
  from {
    max-width: 0
  }
  to {
    max-width: 100%
  }
}

@keyframes blink-caret {
  from,
  to {
    border-color: transparent
  }
  50% {
    border-color: var(--neon-cyan);
  }
}
</style>
