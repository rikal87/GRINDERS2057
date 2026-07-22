<template>
  <div class="terminal-layout-wrapper">
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
        <span class="pulse-cyan"></span>
        <span class="meta-txt">{{ headerNode || 'TERMINAL_NODE_01' }} // {{ headerSystem || 'CYBERSPACE_OS' }}</span>
      </div>
      
      <!-- High-tech Solid Rect Back Button -->
      <button v-if="showBack" class="btn-back-os" @click="$emit('back')">
        ◀ RETURN_TO_MAIN_OS
      </button>

      <div class="sys-time">
        <span class="yellow">{{ formatGameDate(store.gameTime) }}</span>
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
        <span class="yellow">BANKROLL: {{ (store.bankroll || 0).toLocaleString() }} CR</span>
        <span class="dim">|</span>
        <span>LEVEL {{ store.level || 1 }}</span>
      </div>
      <div class="footer-right">
        <span>POWERED BY GRINDERS_ENGINE // 2057</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
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
</script>

<style scoped>
@import '../assets/fonts/pretendard-std.css';
@import '../assets/css/theme-os.css';

.cyan { color: var(--neon-cyan) !important; }
.yellow { color: var(--neon-yellow) !important; }

.terminal-layout-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #000000;
  color: #ffffff;
  font-family: 'Orbitron', 'Pretendard Std', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.fui-grid-base {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.fui-spade-grid {
  position: absolute;
  top: 15px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  opacity: 0.15;
  font-size: 0.75rem;
  color: var(--neon-cyan);
}

.fui-side-bar {
  position: absolute;
  right: 15px;
  top: 100px;
  bottom: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  opacity: 0.25;
  font-size: 0.7rem;
  color: var(--neon-cyan);
  font-weight: 800;
}

.side-title-vert {
  writing-mode: vertical-rl;
  letter-spacing: 0.2em;
}

.sys-header {
  height: 55px;
  padding: 0 2rem;
  background: rgba(8, 12, 16, 0.95);
  border-bottom: 1px solid rgba(0, 240, 255, 0.25);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 10;
}

.sys-id {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.05em;
}

.pulse-cyan {
  width: 8px;
  height: 8px;
  background: var(--neon-cyan);
  box-shadow: 0 0 10px var(--neon-cyan);
}

.btn-back-os {
  background: transparent;
  border: 1px solid var(--neon-cyan);
  color: var(--neon-cyan);
  padding: 0.45rem 1.2rem;
  font-family: inherit;
  font-weight: 900;
  font-size: 0.8rem;
  cursor: pointer;
  border-radius: 0px;
  transition: all 0.2s ease;
}

.btn-back-os:hover {
  background: var(--neon-cyan);
  color: #000000;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.5);
}

.sys-time {
  font-size: 0.85rem;
  font-weight: 900;
  display: flex;
  gap: 0.5rem;
}

.dim { color: #506070; }

.terminal-main-viewport {
  flex: 1;
  overflow-y: auto;
  position: relative;
  z-index: 5;
}

.sys-footer {
  height: 40px;
  padding: 0 2rem;
  background: rgba(8, 12, 16, 0.95);
  border-top: 1px solid rgba(0, 240, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
  font-weight: 900;
  position: relative;
  z-index: 10;
}

.footer-left {
  display: flex;
  gap: 0.8rem;
}
</style>
