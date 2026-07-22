<template>
  <div class="marathon-safehouse">
    <!-- FUI Grid & Vertical Side Decors -->
    <div class="fui-grid-overlay">
      <div class="fui-plus-grid">
        <span v-for="n in 12" :key="n" class="plus-mark">+</span>
      </div>
      <aside class="fui-side-bar">
        <div class="side-code">0.783 ± 0.012 // TAU CETI IV</div>
        <div class="side-title-vert">GRINDERS_2057</div>
        <div class="side-code">SECURE_LINK // ACTIVE</div>
      </aside>
    </div>

    <!-- Top Header Bar -->
    <header class="marathon-header">
      <div class="sys-meta">
        <span class="pulse-lime"></span>
        <span class="meta-txt">MEATSPACE_SAFEHOUSE // NODE_09</span>
      </div>
      <div class="time-meta">
        <span class="yellow">{{ formatGameDate(store.gameTime) }}</span>
        <span class="dim">//</span>
        <span>{{ formatGameTime(store.gameTime) }}</span>
      </div>
    </header>

    <!-- Main Brutalist Typography Menu (3 Main Keys Only) -->
    <main class="marathon-main">
      <div class="title-block">
        <h1 class="hero-marathon-title">SAFEHOUSE<span class="lime-dot">.</span></h1>
        <div class="sub-sys-info">// SELECT_FUNCTIONAL_SUBROUTINE // [3_MODULES_ACTIVE]</div>
      </div>

      <nav class="marathon-menu-list">
        <!-- 01: CYBER_LINK -->
        <div class="marathon-menu-card lime-block" @click="$emit('enter-terminal')">
          <div class="card-num">01 //</div>
          <div class="card-body">
            <h2 class="card-title">CYBER_LINK</h2>
            <p class="card-sub">CONNECT TO HIGH-STAKES CYBERSPACE & AI NEXUS</p>
          </div>
          <div class="card-arrow">➔</div>
        </div>

        <!-- 02: SLEEP -->
        <div class="marathon-menu-card" @click="toggleSleepModal">
          <div class="card-num">02 //</div>
          <div class="card-body">
            <div class="title-row">
              <h2 class="card-title">SLEEP</h2>
              <span class="stamina-badge">STAMINA: {{ Math.floor(store.stamina || 100) }}%</span>
            </div>
            <p class="card-sub">PASS TIME & RECOVER PHYSICAL VITALITY</p>
          </div>
          <div class="card-arrow">➔</div>
        </div>

        <!-- 03: MESSAGES -->
        <div class="marathon-menu-card" @click="toggleMessagesModal">
          <div class="card-num">03 //</div>
          <div class="card-body">
            <div class="title-row">
              <h2 class="card-title">MESSAGES</h2>
              <span class="unread-badge" v-if="unreadCount > 0">[{{ unreadCount }} UNREAD]</span>
            </div>
            <p class="card-sub">SECURE PERSONAL COMMUNICATOR & NOTIFICATIONS</p>
          </div>
          <div class="card-arrow">➔</div>
        </div>
      </nav>
    </main>

    <!-- SLEEP INTERACTIVE MODAL (Marathon Style) -->
    <Transition name="fade">
      <div v-if="showSleepModal" class="marathon-modal-overlay" @click.self="showSleepModal = false">
        <div class="marathon-modal-box">
          <div class="modal-hdr">// BEDSIDE_ALARM_CLOCK // SLEEP_CONTROL</div>
          <h2 class="modal-hero-txt">SELECT_REST_DURATION</h2>
          <div class="stamina-adjust-area">
            <div class="duration-val">{{ sleepDuration }} <small>HOURS</small></div>
            <input type="range" class="marathon-range" min="0.5" max="24.0" step="0.5" v-model.number="sleepDuration">
          </div>
          <div class="modal-btn-row">
            <button class="btn-marathon-cancel" @click="showSleepModal = false">CANCEL</button>
            <button class="btn-marathon-confirm" @click="executeSleep">EXECUTE_SLEEP ➔</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- MESSAGES INTERACTIVE MODAL (Marathon Style) -->
    <Transition name="fade">
      <div v-if="showCommsModal" class="marathon-modal-overlay" @click.self="showCommsModal = false">
        <div class="marathon-modal-box comms-box">
          <div class="modal-hdr">// PERSONAL_COMMUNICATOR // INBOX</div>
          <h2 class="modal-hero-txt">SECURE_MESSAGES</h2>
          <div class="msg-list-scroll">
            <div v-for="msg in store.messages" :key="msg.id" class="marathon-msg-card" :class="{ unread: !msg.read }">
              <div class="msg-hdr">
                <span class="sender">{{ msg.sender || 'SYSTEM' }}</span>
                <span class="date">{{ msg.date || 'TODAY' }}</span>
              </div>
              <div class="msg-txt">{{ msg.title }}</div>
            </div>
          </div>
          <div class="modal-btn-row">
            <button class="btn-marathon-confirm" @click="showCommsModal = false">CLOSE_COMMUNICATOR</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Bottom Marathon Footer Banner -->
    <footer class="marathon-footer">
      <div class="footer-left">
        <span class="yellow">BANKROLL: {{ store.bankroll.toLocaleString() }} CR</span>
        <span class="dim">|</span>
        <span>LEVEL {{ store.level }}</span>
      </div>
      <div class="footer-right">
        <span>POWERED BY GRINDERS_ENGINE // 2057</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store, saveStore } from '../logic/store';
import { formatGameTime, formatGameDate, advanceTime } from '../logic/timeSystem';
import { performSleep } from '../logic/staminaSystem';
import { audioManager } from '../logic/audioManager';

const emit = defineEmits(['enter-terminal']);

const showSleepModal = ref(false);
const showCommsModal = ref(false);
const sleepDuration = ref(8);

const unreadCount = computed(() => {
  if (!store.messages) return 0;
  return store.messages.filter(m => !m.read).length;
});

const toggleSleepModal = () => {
  audioManager.playSFX('ui-click');
  showSleepModal.value = !showSleepModal.value;
};

const toggleMessagesModal = () => {
  audioManager.playSFX('ui-click');
  showCommsModal.value = !showCommsModal.value;
};

const executeSleep = async () => {
  audioManager.playSFX('ui-click');
  await performSleep(sleepDuration.value);
  advanceTime(sleepDuration.value);
  await saveStore();
  audioManager.playSFX('chip-ship-it');
  showSleepModal.value = false;
};
</script>

<style scoped>
@import '../assets/fonts/pretendard-std.css';

.marathon-safehouse {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #000000;
  color: #ffffff;
  font-family: 'Pretendard Std', 'Share Tech Mono', monospace;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}

/* FUI Grid Overlay & Vertical Side Text */
.fui-grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.fui-plus-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(4, 1fr);
  width: 100%;
  height: 100%;
  opacity: 0.15;
  padding: 3rem;
  box-sizing: border-box;
}

.plus-mark {
  color: #ffffff;
  font-size: 1rem;
}

.fui-side-bar {
  position: absolute;
  right: 1.5rem;
  top: 20%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  writing-mode: vertical-rl;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: #ccff00;
  opacity: 0.7;
}

/* Header */
.marathon-header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  font-size: 0.9rem;
}

.sys-meta {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 800;
}

.pulse-lime {
  width: 10px;
  height: 10px;
  background: #ccff00;
  box-shadow: 0 0 10px #ccff00;
  animation: blink 1.5s infinite alternate;
}

.yellow { color: #ccff00; font-weight: 900; }
.dim { color: #506070; margin: 0 0.4rem; }

/* Main Section */
.marathon-main {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 4rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.title-block {
  margin-bottom: 3rem;
}

.hero-marathon-title {
  font-size: clamp(3.5rem, 8vw, 7rem);
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.03em;
  line-height: 0.9;
  text-transform: uppercase;
}

.lime-dot {
  color: #ccff00;
}

.sub-sys-info {
  font-size: 0.85rem;
  color: #ccff00;
  letter-spacing: 0.15em;
  margin-top: 0.8rem;
}

/* Menu Cards */
.marathon-menu-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.marathon-menu-card {
  display: flex;
  align-items: center;
  padding: 1.6rem 2.5rem;
  background: rgba(15, 15, 15, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.card-num {
  font-size: 1.8rem;
  font-weight: 900;
  color: #506070;
  width: 80px;
  transition: color 0.25s;
}

.card-body {
  flex: 1;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-title {
  font-size: clamp(1.8rem, 3.5vw, 3rem);
  font-weight: 900;
  margin: 0;
  letter-spacing: 0.02em;
  color: #ffffff;
  transition: color 0.25s;
}

.card-sub {
  font-size: 0.8rem;
  color: #8090a0;
  margin: 0.3rem 0 0 0;
  letter-spacing: 0.1em;
}

.card-arrow {
  font-size: 2.5rem;
  font-weight: 900;
  color: #506070;
  transition: all 0.25s ease;
}

.stamina-badge, .unread-badge {
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.2rem 0.6rem;
  border: 1px solid #ccff00;
  color: #ccff00;
}

.unread-badge {
  border-color: #ff0055;
  color: #ff0055;
}

/* Lime Block Style for CYBER_LINK */
.marathon-menu-card.lime-block {
  background: #ccff00;
  border-color: #ccff00;
  color: #000000;
  box-shadow: 0 0 30px rgba(204, 255, 0, 0.4);
}

.marathon-menu-card.lime-block .card-num,
.marathon-menu-card.lime-block .card-title,
.marathon-menu-card.lime-block .card-sub,
.marathon-menu-card.lime-block .card-arrow {
  color: #000000 !important;
}

/* Normal Hover Interactions */
.marathon-menu-card:not(.lime-block):hover {
  background: #ffffff;
  border-color: #ffffff;
  transform: translateX(15px);
}

.marathon-menu-card:not(.lime-block):hover .card-num { color: #ff0055; }
.marathon-menu-card:not(.lime-block):hover .card-title { color: #000000; }
.marathon-menu-card:not(.lime-block):hover .card-sub { color: #333333; font-weight: bold; }
.marathon-menu-card:not(.lime-block):hover .card-arrow { color: #000000; transform: translateX(5px); }

/* Modals */
.marathon-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marathon-modal-box {
  background: #000000;
  border: 3px solid #ccff00;
  padding: 3rem;
  width: 90%;
  max-width: 650px;
  box-shadow: 0 0 40px rgba(204, 255, 0, 0.3);
}

.modal-hdr {
  font-size: 0.85rem;
  color: #ccff00;
  letter-spacing: 0.15em;
  margin-bottom: 1rem;
}

.modal-hero-txt {
  font-size: 2.2rem;
  font-weight: 900;
  margin: 0 0 2rem 0;
}

.duration-val {
  font-size: 3rem;
  font-weight: 900;
  color: #ccff00;
  text-align: center;
  margin-bottom: 1rem;
}

.marathon-range {
  width: 100%;
  accent-color: #ccff00;
  cursor: pointer;
}

.modal-btn-row {
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
}

.btn-marathon-cancel {
  flex: 1;
  background: transparent;
  border: 2px solid #506070;
  color: #ffffff;
  padding: 1rem;
  font-weight: 900;
  cursor: pointer;
}

.btn-marathon-confirm {
  flex: 2;
  background: #ccff00;
  border: 2px solid #ccff00;
  color: #000000;
  padding: 1rem;
  font-weight: 900;
  font-size: 1.05rem;
  cursor: pointer;
}

.comms-box {
  border-color: #ffffff;
}

.msg-list-scroll {
  max-height: 350px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.marathon-msg-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 1rem;
}

.marathon-msg-card.unread {
  border-color: #ff0055;
  background: rgba(255, 0, 85, 0.1);
}

.msg-hdr {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #708090;
  margin-bottom: 0.4rem;
}

.msg-txt {
  font-size: 0.95rem;
  font-weight: bold;
}

/* Footer */
.marathon-footer {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  font-size: 0.85rem;
  color: #607080;
}

@keyframes blink {
  0% { opacity: 0.3; }
  100% { opacity: 1; }
}

@media (max-width: 768px) {
  .marathon-main {
    padding: 0 1.5rem;
  }
  .hero-marathon-title {
    font-size: 3rem;
  }
  .fui-side-bar {
    display: none;
  }
}
</style>
