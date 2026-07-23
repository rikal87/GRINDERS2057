<template>
  <div class="terminal-layout-wrapper">
    <!-- Ultra-Subtle CRT Scanline Lens Overlay (Toggleable) -->
    <div v-if="store.settings?.crtEnabled !== false" class="fui-scanline-lens"></div>

    <!-- MARATHON-STYLE VERTICAL 90-DEGREE SIDE TELEMETRY RAIL (Right Edge) -->
    <aside class="fui-vertical-side-rail">
      <div class="side-rail-content">
        <div class="rail-fui-symbols font-orbitron">+ IIIIIIII X ⦿ 28 93 ⨉</div>
        <div class="rail-vert-title yellow glow-yellow font-orbitron">GRINDERS 2057™</div>
        <div class="rail-sub-telemetry font-orbitron">HORIZON RELAY // 0.783±0.012 M⦿ // "ESCAPE WILL MAKE ME GOD"</div>
        <div class="rail-bottom-mark font-orbitron">+</div>
      </div>
    </aside>

    <!-- FUI Grid Overlay -->
    <div class="fui-grid-base">
      <div class="fui-spade-grid">
        <span v-for="n in 12" :key="n" class="spade-mark">♠</span>
      </div>
      <aside class="fui-side-bar">
        <div class="side-code">{{ sideCodeLeft || '[POT_ODDS: 4:1 // EV_CALC: +0.872]' }}</div>
        <div class="side-title-vert">{{ sideTitleVert || '♠_♦_♥_♣_DECK_HEURISTICS' }}</div>
        <div class="side-code">{{ sideCodeRight || 'HAND_HISTORY_SYNC // VERIFIED' }}</div>
      </aside>
    </div>

    <!-- Header Bar -->
    <header class="sys-header">
      <div class="sys-id cyan">
        <span class="pulse-cyan blink-fast"></span>
        <span class="meta-txt glow-cyan pulse-neon-cyan">{{ headerNode || 'TERMINAL_NODE_01' }} // {{ headerSystem || 'CYBERSPACE_OS' }}</span>
        <span class="telemetry-chip">[SYS_TICK: {{ sysTickCount }}s]</span>
      </div>
      
      <!-- Quick CRT FX Toggle Button -->
      <button class="crt-toggle-chip instant-flash-btn" @click="store.settings.crtEnabled = store.settings.crtEnabled === false ? true : false">
        [CRT_FX: {{ store.settings?.crtEnabled !== false ? 'ON' : 'OFF' }}]
      </button>

      <!-- High-tech Solid Rect Back Button -->
      <button v-if="showBack" class="btn-back-os instant-flash-btn" @click="$emit('back')">
        ◀ RETURN_TO_MAIN_OS
      </button>

      <div class="sys-time">
        <span class="telemetry-chip yellow-glow">[TRAFFIC: {{ liveTraffic }} KB/s]</span>
        <span class="yellow glow-yellow">{{ formatGameDate(store.gameTime) }}</span>
        <span class="dim">//</span>
        <span>{{ formatGameTime(store.gameTime) }}</span>
      </div>
    </header>

    <!-- Main Content Slot -->
    <main class="terminal-main-viewport os-scrollbar-custom">
      <slot></slot>
    </main>

    <!-- Footer Bar -->
    <footer class="sys-footer">
      <div class="footer-left">
        <span class="yellow glow-yellow pulse-neon-yellow">BANKROLL: {{ (store.bankroll || 0).toLocaleString() }} CR</span>
        <span class="dim">|</span>
        <span class="cyan glow-cyan">AGENCY_TIER: 03 (CLASS_C)</span>
        <span class="dim">|</span>
        <span class="cyan glow-cyan">[EV_ENGINE: ONLINE]</span>
      </div>
      <div class="footer-right">
        <span>POWERED BY GRINDERS_ENGINE // 2057</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { store } from '../logic/store';
import { formatGameTime, formatGameDate } from '../logic/timeSystem';

defineProps({
  showBack: { type: Boolean, default: false },
  headerNode: { type: String, default: 'TERMINAL_NODE_01' },
  headerSystem: { type: String, default: 'CYBERSPACE_OS' },
  sideCodeLeft: String,
  sideTitleVert: String,
  sideCodeRight: String
});

defineEmits(['back']);

// 실시간 텔레메트리 틱 반응성 수치
const sysTickCount = ref('0.00');
const liveTraffic = ref('124.5');
let timerId = null;

onMounted(() => {
  let tick = 0;
  timerId = setInterval(() => {
    tick += 0.1;
    sysTickCount.value = tick.toFixed(1);
    liveTraffic.value = (100 + Math.random() * 50).toFixed(1);
  }, 100);
});

onUnmounted(() => {
  if (timerId) clearInterval(timerId);
});
</script>

<style scoped>
@import '../assets/fonts/pretendard-std.css';
@import '../assets/css/theme-os.css';

.terminal-layout-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: var(--os-bg-black);
  color: var(--os-text-main);
  font-family: 'Orbitron', 'Pretendard Std', -apple-system, sans-serif !important;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* MARATHON-STYLE VERTICAL 90-DEGREE SIDE TELEMETRY RAIL */
.fui-vertical-side-rail {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 50px;
  background: #000000;
  border-left: 2px solid var(--neon-yellow);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  pointer-events: none;
}

.side-rail-content {
  transform: rotate(90deg);
  display: flex;
  align-items: center;
  gap: 2rem;
  white-space: nowrap;
}

.rail-fui-symbols {
  font-size: 0.8rem;
  color: var(--neon-yellow);
  letter-spacing: 0.2em;
}

.rail-vert-title {
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: 0.15em;
  color: var(--neon-yellow);
}

.rail-sub-telemetry {
  font-size: 0.68rem;
  color: #506070;
  letter-spacing: 0.1em;
}

.rail-bottom-mark {
  font-size: 1.2rem;
  color: var(--neon-yellow);
}

/* Base FUI Overlay */
.fui-grid-base {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.fui-spade-grid {
  position: absolute;
  top: 10px;
  left: 20px;
  display: flex;
  gap: 8px;
  opacity: 0.15;
  font-size: 10px;
  color: var(--neon-cyan);
}

.fui-side-bar {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 40px;
  opacity: 0.3;
  font-size: 9px;
  color: var(--neon-cyan);
  font-family: monospace;
}

.side-title-vert {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 4px;
}

/* Header */
.sys-header {
  position: relative;
  z-index: 10;
  height: 48px;
  background: rgba(4, 6, 8, 0.95);
  border-bottom: 1px solid rgba(0, 240, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  padding-right: 60px;
  font-size: 0.85rem;
}

.sys-id {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 800;
}

.telemetry-chip {
  font-size: 0.72rem;
  color: #506070;
  font-family: monospace;
  margin-left: 0.4rem;
}

.crt-toggle-chip {
  background: transparent;
  border: 1px solid var(--neon-yellow);
  color: var(--neon-yellow);
  font-size: 0.72rem;
  font-weight: 900;
  padding: 0.2rem 0.5rem;
  font-family: inherit;
}

.btn-back-os {
  background: var(--neon-cyan);
  color: #000000;
  border: none;
  font-family: inherit;
  font-weight: 900;
  font-size: 0.8rem;
  padding: 0.3rem 0.8rem;

  letter-spacing: 0.05em;
  border-radius: 0px;
}

.btn-back-os:hover {
  background: #ffffff;
  box-shadow: 0 0 15px #ffffff;
}

.sys-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
}

/* Main Viewport */
.terminal-main-viewport {
  position: relative;
  z-index: 5;
  flex: 1;
  overflow-y: auto;
  padding-right: 50px;
}

/* Footer */
.sys-footer {
  position: relative;
  z-index: 10;
  height: 36px;
  background: rgba(4, 6, 8, 0.95);
  border-top: 1px solid rgba(0, 240, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  padding-right: 60px;
  font-size: 0.78rem;
  font-weight: 800;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.footer-right {
  color: #506070;
  font-size: 0.72rem;
}

.cyan { color: var(--neon-cyan); }
.yellow { color: var(--neon-yellow); }
.dim { color: #405060; }
</style>
