<template>
  <div class="meatspace-container">
    <!-- Ambient Room Lighting Vignette -->
    <div class="room-lighting"></div>

    <!-- CRT Scanline Filter -->
    <div class="crt-overlay"></div>

    <!-- Header Status Overlay -->
    <header class="room-header">
      <div class="location-badge">
        <span class="pulse-dot"></span>
        <span class="room-title">MEATSPACE // SAFEHOUSE_UNIT_09</span>
      </div>
      <div class="vital-stats">
        <div class="stat-item">
          <span class="label">CREDITS:</span>
          <span class="val yellow">{{ store.bankroll.toLocaleString() }} CR</span>
        </div>
        <div class="stat-item">
          <span class="label">STAMINA:</span>
          <span class="val green">{{ Math.floor(store.stamina || 100) }}%</span>
        </div>
        <div class="stat-item">
          <span class="label">DATE:</span>
          <span class="val cyan">{{ formatGameDate(store.gameTime) }}</span>
        </div>
      </div>
    </header>

    <!-- 3D Perspective Room Stage -->
    <main class="room-stage-3d">
      <div class="room-viewport">
        <!-- Left Wall: Bed / Rest -->
        <div class="room-wall wall-left" @click="handleRest">
          <div class="panel-wireframe">
            <div class="panel-tag">[BED // REST]</div>
            <div class="icon">🛌</div>
            <div class="panel-desc">RECOVER_STAMINA & PASS_TIME</div>
            <div class="status-indicator green">READY</div>
          </div>
        </div>

        <!-- Center Wall: CyberLink Terminal Deck -->
        <div class="room-wall wall-center" @click="$emit('enter-terminal')">
          <div class="panel-wireframe terminal-deck">
            <div class="glitch-title" data-text="CYBER_LINK // DECK">CYBER_LINK // DECK</div>
            <div class="deck-screen">
              <div class="prompt">>> INITIALIZE_NET_SESSION...</div>
              <div class="net-status">ONLINE // ENCRYPTED</div>
            </div>
            <button class="btn-cyberlink">
              <span class="btn-text">CONNECT TO CYBERSPACE</span>
              <span class="arrow">➔</span>
            </button>
          </div>
        </div>

        <!-- Right Wall: Stash & Mirror -->
        <div class="room-wall wall-right" @click="$emit('open-stats')">
          <div class="panel-wireframe">
            <div class="panel-tag">[STASH // MIRROR]</div>
            <div class="icon">🪞</div>
            <div class="panel-desc">NEURAL_STATS & MODULES</div>
            <div class="status-indicator cyan">LEVEL {{ store.level }}</div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer Quick Actions & Comms -->
    <footer class="room-footer">
      <div class="comms-panel" @click="$emit('open-catalog')">
        <span class="comms-icon">📱</span>
        <span class="comms-text">BLACK_MARKET_LINK // OPEN_CATALOG</span>
      </div>
      <div class="system-time">
        SYSTEM_TIME: {{ formatGameTime(store.gameTime) }} ({{ formatGameDayOfWeek(store.gameTime) }})
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { store, saveStore } from '../logic/store';
import { formatGameTime, formatGameDate, formatGameDayOfWeek, advanceTime } from '../logic/timeSystem';
import { performSleep } from '../logic/staminaSystem';
import { audioManager } from '../logic/audioManager';

const emit = defineEmits(['enter-terminal', 'open-stats', 'open-catalog']);

const handleRest = async () => {
  audioManager.playSFX('ui-click');
  // Rest 6 hours
  await performSleep(6);
  advanceTime(6);
  await saveStore();
  audioManager.playSFX('chip-ship-it');
};
</script>

<style scoped>
.meatspace-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #040608;
  color: #e0e6ed;
  font-family: 'Share Tech Mono', 'Orbitron', monospace;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Ambient Vignette & CRT */
.room-lighting {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.08) 0%, rgba(4, 6, 8, 0.95) 75%);
  pointer-events: none;
  z-index: 1;
}

.crt-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 2;
}

/* Header */
.room-header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(4, 6, 8, 0.6);
  backdrop-filter: blur(8px);
}

.location-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.pulse-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--neon-cyan);
  box-shadow: 0 0 10px var(--neon-cyan);
  animation: blink 1.5s infinite alternate;
}

.room-title {
  font-weight: bold;
  letter-spacing: 0.1em;
  color: #fff;
}

.vital-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item .label {
  color: #6c7a89;
  font-size: 0.85rem;
  margin-right: 0.4rem;
}

.stat-item .val {
  font-weight: bold;
}

.val.yellow { color: var(--neon-yellow); text-shadow: 0 0 8px rgba(248, 239, 0, 0.3); }
.val.green { color: var(--neon-green); text-shadow: 0 0 8px rgba(57, 255, 20, 0.3); }
.val.cyan { color: var(--neon-cyan); text-shadow: 0 0 8px rgba(0, 240, 255, 0.3); }

/* 3D Perspective Room Stage */
.room-stage-3d {
  position: relative;
  z-index: 5;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
  padding: 2rem;
}

.room-viewport {
  display: flex;
  gap: 2rem;
  width: 100%;
  max-width: 1100px;
  height: 380px;
  transform-style: preserve-3d;
}

.room-wall {
  flex: 1;
  background: rgba(10, 15, 22, 0.6);
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 4px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  position: relative;
}

/* Perspective Rotation */
.wall-left {
  transform: rotateY(18deg) translateZ(-20px);
}

.wall-center {
  flex: 1.3;
  border-color: var(--neon-cyan);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.15);
  background: rgba(6, 12, 18, 0.85);
  transform: translateZ(20px);
}

.wall-right {
  transform: rotateY(-18deg) translateZ(-20px);
}

.room-wall:hover {
  border-color: var(--neon-yellow);
  box-shadow: 0 0 25px rgba(248, 239, 0, 0.3);
  transform: scale(1.03) translateZ(30px);
}

.panel-wireframe {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  width: 100%;
}

.panel-tag {
  font-size: 0.85rem;
  color: #6c7a89;
  letter-spacing: 0.1em;
}

.icon {
  font-size: 3.5rem;
  margin: 0.5rem 0;
}

.panel-desc {
  font-size: 0.8rem;
  color: #a0b0c0;
  letter-spacing: 0.05em;
}

.status-indicator {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border: 1px solid;
  border-radius: 2px;
  letter-spacing: 0.1em;
}

.status-indicator.green { border-color: var(--neon-green); color: var(--neon-green); }
.status-indicator.cyan { border-color: var(--neon-cyan); color: var(--neon-cyan); }

/* Center Terminal Deck */
.terminal-deck {
  gap: 1.5rem;
}

.glitch-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--neon-yellow);
  letter-spacing: 0.15em;
  text-shadow: 0 0 10px rgba(248, 239, 0, 0.4);
}

.deck-screen {
  background: #000;
  border: 1px solid rgba(0, 240, 255, 0.4);
  padding: 1rem;
  width: 90%;
  text-align: left;
  font-size: 0.8rem;
}

.prompt { color: var(--neon-cyan); }
.net-status { color: #506070; margin-top: 0.3rem; font-size: 0.75rem; }

.btn-cyberlink {
  background: var(--neon-yellow);
  color: #000;
  border: none;
  padding: 0.9rem 1.8rem;
  font-family: inherit;
  font-weight: 900;
  font-size: 0.95rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.2s ease;
  box-shadow: 0 0 15px rgba(248, 239, 0, 0.4);
}

.btn-cyberlink:hover {
  background: #fff;
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.6);
  transform: translateY(-2px);
}

/* Footer */
.room-footer {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(4, 6, 8, 0.6);
  font-size: 0.85rem;
}

.comms-panel {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--neon-cyan);
  cursor: pointer;
  transition: color 0.2s;
}

.comms-panel:hover {
  color: var(--neon-yellow);
}

.system-time {
  color: #506070;
}

@keyframes blink {
  0% { opacity: 0.3; }
  100% { opacity: 1; }
}

/* Mobile Graceful Degradation */
@media (max-width: 768px) {
  .room-viewport {
    flex-direction: column;
    height: auto;
    gap: 1rem;
    perspective: none;
  }
  .wall-left, .wall-right, .wall-center {
    transform: none !important;
  }
}
</style>
