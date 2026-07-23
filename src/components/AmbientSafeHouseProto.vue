<template>
  <div class="ambient-proto-container">
    <!-- Pure Ambient Lighting Layers (No Image Asset) -->
    <div class="ambient-glow cyan-glow"></div>
    <div class="ambient-glow yellow-glow"></div>
    <div class="ambient-glow magenta-glow"></div>
    <div class="ambient-scanline"></div>

    <!-- Top Floating CyberLink Terminal Bridge -->
    <header class="proto-header">
      <div class="deck-status">
        <span class="pulse-cyan"></span>
        <span class="sys-title">MEATSPACE // BEDSIDE_INTERFACE</span>
      </div>
      <div class="cyberlink-btn-card" @click="$emit('enter-terminal')">
        <span class="label">NET_DECK_LINK:</span>
        <button class="btn-cyberlink">
          <span>CONNECT TO CYBERSPACE</span> ➔
        </button>
      </div>
    </header>

    <!-- Main Ambient Grid Layout -->
    <main class="proto-main-grid">
      <!-- LEFT: BEDSIDE ALARM CLOCK (Sleep & Time) -->
      <section class="proto-card alarm-clock-card">
        <div class="card-header">
          <span class="card-tag">[BEDSIDE_ALARM_CLOCK]</span>
          <button class="btn-mini" @click="$emit('open-stats')">STATS</button>
        </div>
        <div class="card-body">
          <div class="digital-time-display">
            <h1 class="big-time">{{ formatGameTime(store.gameTime) }}</h1>
            <div class="date-sub">{{ formatGameDate(store.gameTime) }} ({{ formatGameDayOfWeek(store.gameTime) }})</div>
          </div>

          <div class="stamina-section">
            <div class="stamina-header">
              <span>STAMINA_RECOVERY</span>
              <span class="val cyan">+{{ sleepDuration }} HR</span>
            </div>
            <div class="slider-box">
              <input type="range" class="stamina-slider" min="0.5" max="24.0" step="0.5" v-model.number="sleepDuration">
            </div>
            <div class="stamina-meter">
              <div class="meter-bar" :style="{ width: (store.stamina || 100) + '%' }"></div>
            </div>
          </div>

          <div class="action-row">
            <button class="btn-sleep" @click="handleSleep">
              <span>SLEEP // PASS_TIME</span>
            </button>
          </div>
        </div>
      </section>

      <!-- CENTER: STASH & PARTNER MINI -->
      <section class="proto-card stash-card">
        <div class="card-header">
          <span class="card-tag">[HARDWARE_STASH & COMPANION]</span>
          <button class="btn-mini" @click="$emit('open-catalog')">CATALOG</button>
        </div>
        <div class="card-body">
          <div class="stash-box">
            <div class="sub-title">// ACTIVE_EQUIPPED_MODULES</div>
            <div v-if="store.onWorkTasks && store.onWorkTasks.length > 0" class="mod-list">
              <div v-for="(item, idx) in store.onWorkTasks" :key="idx" class="mod-chip">
                <span class="icon">⚡</span>
                <span class="name">{{ item.name }}</span>
                <span class="tier">[T{{ item.tier }}]</span>
              </div>
            </div>
            <div v-else class="empty-msg">
              <span>NO_EQUIPPED_ITEMS</span>
            </div>
          </div>

          <div class="partner-mini-box">
            <div class="sub-title">// ACTIVE_PARTNER_LINK</div>
            <div v-if="activePartner" class="partner-card">
              <div class="partner-name">{{ activePartner.name }}</div>
              <div class="partner-rel">RELATIONSHIP: <span class="cyan">{{ Math.round(activePartner.relationship / 10) }}</span></div>
            </div>
            <div v-else class="empty-msg">
              <span>NO_ACTIVE_PARTNER</span>
            </div>
          </div>
        </div>
      </section>

      <!-- RIGHT: PERSONAL COMMUNICATOR (Messages) -->
      <section class="proto-card comms-card">
        <div class="card-header">
          <span class="card-tag">[PERSONAL_COMMUNICATOR]</span>
          <span class="unread-badge magenta" v-if="unreadCount > 0">[{{ unreadCount }} UNREAD]</span>
        </div>
        <div class="card-body comms-body">
          <div class="message-feed">
            <div v-for="msg in store.messages" :key="msg.id" class="msg-card-mini" :class="{ unread: !msg.read }">
              <div class="msg-meta">
                <span class="sender">{{ msg.sender || 'SYSTEM' }}</span>
                <span class="time">{{ msg.date || 'TODAY' }}</span>
              </div>
              <div class="msg-title">{{ msg.title }}</div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer System Status -->
    <footer class="proto-footer">
      <div class="fui-text-left">MEATSPACE_NODE_01 // ENCRYPTED</div>
      <div class="fui-text-right">BANKROLL: <span class="yellow">{{ store.bankroll.toLocaleString() }} CR</span></div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store, saveStore } from '../logic/store';
import { formatGameTime, formatGameDate, formatGameDayOfWeek, advanceTime } from '../logic/timeSystem';
import { performSleep } from '../logic/staminaSystem';
import { audioManager } from '../logic/audioManager';

const emit = defineEmits(['enter-terminal', 'open-stats', 'open-catalog']);
const sleepDuration = ref(8);

const unreadCount = computed(() => {
  if (!store.messages) return 0;
  return store.messages.filter(m => !m.read).length;
});

const activePartner = computed(() => {
  if (!store.partners) return null;
  return store.partners.find(p => p.relationship > 0) || store.partners[0] || null;
});

const handleSleep = async () => {
  audioManager.playSFX('ui-click');
  await performSleep(sleepDuration.value);
  advanceTime(sleepDuration.value);
  await saveStore();
  audioManager.playSFX('chip-ship-it');
};
</script>

<style scoped>
.ambient-proto-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #000000;
  color: #ffffff;
  font-family: 'Orbitron', monospace;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}

/* Ambient Glow Lighting Layers */
.ambient-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  z-index: 1;
  opacity: 0.15;
  animation: ambientFloat 10s ease-in-out infinite alternate;
}

.cyan-glow {
  top: 10%;
  left: 15%;
  width: 500px;
  height: 500px;
  background: var(--neon-cyan);
}

.yellow-glow {
  bottom: 10%;
  right: 15%;
  width: 450px;
  height: 450px;
  background: var(--neon-yellow);
}

.magenta-glow {
  bottom: 30%;
  left: 40%;
  width: 400px;
  height: 400px;
  background: var(--neon-magenta);
}

.ambient-scanline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.3) 50%);
  background-size: 100% 3px;
  pointer-events: none;
  z-index: 2;
}

/* Header */
.proto-header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 2.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.6);
}

.deck-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.pulse-cyan {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--neon-cyan);
  box-shadow: 0 0 8px var(--neon-cyan);
  animation: pulse 1.5s infinite alternate;
}

.sys-title {
  font-weight: bold;
  letter-spacing: 0.1em;
}

.cyberlink-btn-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
}

.cyberlink-btn-card .label {
  color: #6c7a89;
  font-size: 0.8rem;
}

.btn-cyberlink {
  background: var(--neon-yellow);
  color: #000;
  border: none;
  padding: 0.7rem 1.4rem;
  font-family: inherit;
  font-weight: 900;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(248, 239, 0, 0.4);
  transition: all 0.2s ease;
}

.cyberlink-btn-card:hover .btn-cyberlink {
  background: #fff;
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.7);
}

/* Main Grid */
.proto-main-grid {
  position: relative;
  z-index: 10;
  flex: 1;
  display: grid;
  grid-template-columns: 32% 36% 32%;
  gap: 1.5rem;
  padding: 2rem 2.5rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.proto-card {
  background: rgba(8, 12, 16, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(8px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.4);
}

.card-tag {
  font-size: 0.85rem;
  color: var(--neon-cyan);
  letter-spacing: 0.1em;
  font-weight: bold;
}

.btn-mini {
  background: transparent;
  border: 1px solid rgba(0, 240, 255, 0.3);
  color: var(--neon-cyan);
  font-family: inherit;
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  cursor: pointer;
}

.btn-mini:hover {
  border-color: var(--neon-yellow);
  color: var(--neon-yellow);
}

.card-body {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Alarm Clock Card */
.digital-time-display {
  text-align: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.big-time {
  font-size: 3rem;
  margin: 0;
  color: var(--neon-yellow);
  text-shadow: 0 0 15px rgba(248, 239, 0, 0.4);
}

.date-sub {
  color: #6c7a89;
  font-size: 0.85rem;
  margin-top: 0.4rem;
}

.stamina-section {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.stamina-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.stamina-slider {
  width: 100%;
  accent-color: var(--neon-cyan);
  cursor: pointer;
}

.stamina-meter {
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 240, 255, 0.2);
}

.meter-bar {
  height: 100%;
  background: var(--neon-cyan);
  box-shadow: 0 0 8px var(--neon-cyan);
}

.btn-sleep {
  width: 100%;
  background: rgba(0, 240, 255, 0.1);
  border: 1px solid var(--neon-cyan);
  color: var(--neon-cyan);
  padding: 0.9rem;
  font-family: inherit;
  font-weight: bold;
  font-size: 0.95rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sleep:hover {
  background: var(--neon-cyan);
  color: #000;
  box-shadow: 0 0 20px var(--neon-cyan);
}

/* Stash Card */
.sub-title {
  font-size: 0.75rem;
  color: var(--neon-cyan);
  margin-bottom: 0.6rem;
}

.mod-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mod-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.5rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.85rem;
}

.mod-chip .icon { color: var(--neon-yellow); }
.mod-chip .name { flex: 1; }
.mod-chip .tier { color: var(--neon-cyan); font-size: 0.75rem; }

.empty-msg {
  color: #506070;
  font-size: 0.8rem;
  padding: 1rem 0;
  text-align: center;
}

.partner-card {
  background: rgba(0, 240, 255, 0.05);
  border: 1px solid rgba(0, 240, 255, 0.2);
  padding: 0.8rem 1rem;
}

.partner-name {
  font-weight: bold;
  font-size: 1rem;
  color: var(--neon-yellow);
}

.partner-rel {
  font-size: 0.8rem;
  color: #a0b0c0;
  margin-top: 0.2rem;
}

/* Comms Card */
.comms-body {
  overflow-y: auto;
  max-height: 400px;
}

.unread-badge {
  font-size: 0.75rem;
  font-weight: bold;
}

.cyan { color: var(--neon-cyan); }
.yellow { color: var(--neon-yellow); }
.magenta { color: var(--neon-magenta); }

.msg-card-mini {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.8rem;
  margin-bottom: 0.6rem;
}

.msg-card-mini.unread {
  border-color: var(--neon-magenta);
  background: rgba(255, 0, 60, 0.05);
}

.msg-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #6c7a89;
  margin-bottom: 0.3rem;
}

.msg-title {
  font-size: 0.85rem;
  color: #e0e6ed;
}

/* Footer */
.proto-footer {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  padding: 1rem 2.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.6);
  font-size: 0.85rem;
}

@keyframes ambientFloat {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, -20px) scale(1.1); }
}

@keyframes pulse {
  0% { opacity: 0.3; }
  100% { opacity: 1; }
}

@media (max-width: 900px) {
  .proto-main-grid {
    grid-template-columns: 1fr;
    height: auto;
    overflow-y: auto;
  }
}
</style>
