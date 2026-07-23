<template>
  <TerminalLayout>
    <!-- Main Brutalist Typography OS Menu -->
    <div class="terminal-main">
      <div class="title-block">
        <h1 class="hero-title">CYBERSPACE<span class="yellow-dot">.</span></h1>
        <div class="sub-syslog cyan">
          <span class="pulse-neon-cyan">// MAIN_OPERATING_SYSTEM // [DAY_0{{ store.gameDay || 1 }}]</span>
          <span class="telemetry-chip yellow-glow">[STATUS: OPTIMAL]</span>
        </div>
      </div>

      <!-- MAIN TURN EXECUTION CONTROL BAR (PASS DAY) -->
      <div class="turn-control-banner fui-cctv-frame">
        <div class="turn-info-left">
          <span class="turn-day-tag yellow font-orbitron">DAY_0{{ store.gameDay || 1 }} // TURN_READY</span>
          <p class="turn-desc-txt cyan font-orbitron">// EXECUTE_DAILY_CASINO_SIMULATION_&_AGENCY_SETTLEMENT</p>
        </div>

        <button class="target-lockon-btn yellow-solid main-turn-btn font-orbitron instant-flash-btn" @click="handlePassDay">
          <span class="btn-txt-layer">[ ➔ PASS_DAY / EXECUTE_TURN ]</span>
        </button>
      </div>

      <nav class="terminal-menu-list">
        <!-- 01: TABLE_SEARCH (Fullscreen OS Subview) -->
        <div class="menu-card yellow-block instant-flash-btn" @click="$emit('view', 'table_search')">
          <div class="card-num">01 //</div>
          <div class="card-body">
            <h2 class="card-title">TABLE_SEARCH</h2>
            <p class="card-sub cyan">ACCESS HIGH-STAKES POKER TABLES & SECTOR CASINOS</p>
          </div>
          <div class="card-arrow">➔</div>
        </div>

        <!-- 02: AI_NEXUS (Fullscreen OS Subview) -->
        <div class="menu-card cyan-block instant-flash-btn" @click="$emit('view', 'ai_nexus')">
          <div class="card-num">02 //</div>
          <div class="card-body">
            <h2 class="card-title">AI_NET_NEXUS</h2>
            <p class="card-sub">RECRUIT AGENTS, ASSIGN LUDUS TOKENS & HUD PROTOCOLS</p>
          </div>
          <div class="card-arrow">➔</div>
        </div>

        <!-- 03: BLACK_MARKET -->
        <div class="menu-card magenta-block instant-flash-btn" @click="$emit('view', 'shop')">
          <div class="card-num">03 //</div>
          <div class="card-body">
            <h2 class="card-title">BLACK_MARKET</h2>
            <p class="card-sub">HARDWARE PLUGINS, FINANCIAL CONTRACTS & COMPANIONS</p>
          </div>
          <div class="card-arrow">➔</div>
        </div>

        <!-- 04: PARTNERS_NET (Standalone OS Page) -->
        <div class="menu-card instant-flash-btn" @click="$emit('view', 'partner_net')">
          <div class="card-num">04 //</div>
          <div class="card-body">
            <h2 class="card-title">PARTNERS_NET</h2>
            <p class="card-sub">ACTIVE COMPANION CONTRACTS, AFFINITY & GIFT PROTOCOLS</p>
          </div>
          <div class="card-arrow">➔</div>
        </div>

        <!-- 05: MODULE_DECK (Standalone OS Page) -->
        <div class="menu-card instant-flash-btn" @click="$emit('view', 'module_deck')">
          <div class="card-num">05 //</div>
          <div class="card-body">
            <h2 class="card-title">MODULE_DECK</h2>
            <p class="card-sub">MULTI-SLOT HARDWARE PLUGIN CONFIGURATOR & SYNERGY DECK</p>
          </div>
          <div class="card-arrow">➔</div>
        </div>

        <!-- 06: COMMS_INBOX (Standalone OS Page) -->
        <div class="menu-card instant-flash-btn" @click="$emit('view', 'comms_inbox')">
          <div class="card-num">06 //</div>
          <div class="card-body">
            <div class="title-row">
              <h2 class="card-title">COMMS_INBOX</h2>
              <span class="unread-badge blink-fast" v-if="unreadCount > 0">[{{ unreadCount }}_UNREAD]</span>
            </div>
            <p class="card-sub">SECURE ENCRYPTED MESSAGES & TRANSMISSION LOGS</p>
          </div>
          <div class="card-arrow">➔</div>
        </div>
      </nav>
    </div>

    <!-- Emergency Turn Interception Modal -->
    <InterceptionModal @spectate="handleInterceptionSpectate" @resolved="handleInterceptionResolved" />

    <!-- Daily Settlement Report Modal (Governance Standard Brutalist Telemetry Report) -->
    <div v-if="showSettlementModal && dailyReport" class="os-modal-overlay">
      <div class="os-modal-content fui-cctv-frame settlement-hero-modal">
        
        <!-- Header Bar -->
        <div class="modal-hdr-banner">
          <span class="yellow font-orbitron">[DAILY_AGENCY_SETTLEMENT_REPORT // DAY_0{{ dailyReport.day }}]</span>
          <span class="pulse-neon-cyan font-orbitron">● LIVE_TELEMETRY_SYNCED</span>
        </div>

        <div class="report-watermark font-orbitron">REPORT</div>

        <!-- 3-Hero Metrics Grid -->
        <div class="report-metrics-grid">
          <div class="metric-box yellow-border">
            <span class="lbl cyan font-orbitron">AGENCY_CUT_SHARE (수수료)</span>
            <span class="val yellow glow-yellow font-orbitron">+${{ dailyReport.totalAgencyShare.toLocaleString() }} <small>CR</small></span>
          </div>
          <div class="metric-box">
            <span class="lbl cyan font-orbitron">TOTAL_PARTNERS_PnL</span>
            <span class="val font-orbitron" :class="dailyReport.totalPlayerPnL >= 0 ? 'yellow' : 'magenta'">
              ${{ dailyReport.totalPlayerPnL.toLocaleString() }} <small>CR</small>
            </span>
          </div>
          <div class="metric-box">
            <span class="lbl cyan font-orbitron">DEPLOYED_ROSTER</span>
            <span class="val cyan font-orbitron">{{ dailyReport.deployedCount }} UNITS</span>
          </div>
        </div>

        <!-- Deployed Partners Performance Table -->
        <div class="partner-performance-sec">
          <div class="sec-hdr cyan font-orbitron">// INDIVIDUAL_PARTNER_PERFORMANCE_LOGS</div>
          <div class="partner-log-rows">
            <div v-for="res in dailyReport.partnerResults" :key="res.id" class="partner-log-card fui-cctv-frame">
              <div class="p-info">
                <span class="p-name font-orbitron">{{ res.name.toUpperCase() }}</span>
                <span class="p-loc dim font-orbitron">@ {{ (res.locationId || 'CASINO').toUpperCase() }}</span>
              </div>
              <div class="p-pnl font-orbitron" :class="res.isWin ? 'yellow' : 'magenta'">
                {{ res.isWin ? '🟢 +' : '🔴 ' }}${{ res.sessionPnL.toLocaleString() }} CR
              </div>
              <div class="p-share cyan font-orbitron">
                CUT: +${{ res.agencyShare.toLocaleString() }}
              </div>
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <button class="target-lockon-btn yellow-solid font-orbitron instant-flash-btn modal-close-hero" @click="showSettlementModal = false">
          <span class="btn-txt-layer">[ ACKNOWLEDGE_DAILY_REPORT & RETURN_TO_OS ] ➔</span>
        </button>

      </div>
    </div>

    <!-- High-Speed Matrix Telemetry Log Stream Overlay -->
    <MatrixLogOverlay :visible="showMatrixOverlay" @close="showMatrixOverlay = false" @completed="handleMatrixCompleted" />
  </TerminalLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store } from '../logic/store.js';
import { advanceTurnDay, resolveActiveInterception } from '../logic/timeSystem.js';
import { audioManager } from '../logic/audioManager.js';
import TerminalLayout from './TerminalLayout.vue';
import InterceptionModal from './InterceptionModal.vue';
import MatrixLogOverlay from './MatrixLogOverlay.vue';

const emit = defineEmits(['join', 'view', 'openSearch', 'openAgentModal']);

const showSettlementModal = ref(false);
const showMatrixOverlay = ref(false);
const dailyReport = ref(null);

const unreadCount = computed(() => {
  if (!store.messages) return 0;
  return store.messages.filter(m => !m.read).length;
});

const handlePassDay = () => {
  audioManager.playSFX('ui-click');
  advanceTurnDay();
  showMatrixOverlay.value = true;
};

const handleMatrixCompleted = (summaryReport) => {
  showMatrixOverlay.value = false;
  audioManager.playSFX('coin-throw');
  dailyReport.value = summaryReport || store.lastDailyReport || {
    day: store.gameDay || 1,
    totalAgencyShare: 0,
    totalPlayerPnL: 0,
    deployedCount: 0,
    partnerResults: []
  };
  showSettlementModal.value = true;
};

const handleInterceptionSpectate = (interception) => {
  if (!interception) return;
  showSettlementModal.value = false;
  
  // Standard resolution call in timeSystem.js
  resolveActiveInterception(true);
  
  audioManager.playSFX('chip-ship-it');
  emit('join', {
    locationId: interception.locationId || 'micro_warehouse',
    tableSize: 6,
    isSpectateMode: true,
    spectateHero: interception.partnerName || 'Max'
  });
};

const handleInterceptionResolved = (summaryReport) => {
  if (summaryReport) {
    audioManager.playSFX('coin-throw');
    dailyReport.value = summaryReport;
    showSettlementModal.value = true;
  }
};
</script>

<style scoped>
@import '../assets/fonts/pretendard-std.css';
@import '../assets/css/theme-os.css';

.cyan { color: var(--neon-cyan) !important; }

.terminal-main {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding: 2rem 4rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.title-block {
  display: flex;
  flex-direction: column;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  margin: 0;
  color: #ffffff;
  letter-spacing: -0.02em;
  line-height: 1;
}

.yellow-dot { color: var(--neon-yellow); }

.sub-syslog {
  font-size: 0.85rem;
  font-weight: 800;
  margin-top: 0.5rem;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.telemetry-chip {
  font-size: 0.72rem;
  font-weight: 900;
}

.yellow-glow {
  color: var(--neon-yellow) !important;
}

.terminal-menu-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.menu-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(8, 12, 16, 0.95);
  border: 1px solid rgba(0, 240, 255, 0.25);
  padding: 1.8rem 2.5rem;
  cursor: pointer;
  border-radius: 0px;
  position: relative;
}

.card-num {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--neon-cyan);
  width: 90px;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-title {
  font-size: 1.8rem;
  font-weight: 900;
  margin: 0;
  color: #ffffff;
  letter-spacing: 0.02em;
}

.card-sub {
  font-size: 0.85rem;
  color: #8090a0;
  margin-top: 0.3rem;
  letter-spacing: 0.05em;
}

.unread-badge {
  font-size: 0.7rem;
  background: var(--neon-magenta);
  color: #ffffff;
  padding: 0.1rem 0.4rem;
  font-family: var(--font-code-mono);
}

/* TURN CONTROL BANNER */
.turn-control-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #000000;
  border: 2px solid var(--neon-yellow);
  padding: 1.2rem 2rem;
  gap: 1.5rem;
}

.turn-info-left {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.turn-day-tag { font-size: 1rem; font-weight: 900; }
.turn-desc-txt { font-size: 0.85rem; margin: 0; }

.main-turn-btn {
  padding: 1rem 2rem !important;
  font-size: 1.05rem !important;
  box-shadow: 0 0 20px rgba(204, 255, 0, 0.4);
}

.target-lockon-btn {
  position: relative;
  background: var(--neon-yellow);
  border: none;
  color: #000000;
  font-weight: 900;
  cursor: pointer;
  border-radius: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.report-metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1rem 0;
}

.metric-box {
  background: #04080c;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.metric-box .lbl { font-size: 0.72rem; font-weight: 900; }
.metric-box .val { font-size: 1.4rem; font-weight: 900; }

.btn-modal-close {
  background: var(--neon-yellow);
  border: none;
  color: #000000;
  padding: 0.8rem;
  font-weight: 900;
  cursor: pointer;
  width: 100%;
}

@media (max-width: 900px) {
  .turn-control-banner { flex-direction: column; align-items: stretch; }
  .report-metrics-grid { grid-template-columns: 1fr; }
}

/* Instant Hover Accent Blocks */
.menu-card:hover {
  border-color: var(--neon-yellow);
  transform: translateX(10px);
}

.menu-card:hover .card-num,
.menu-card:hover .card-arrow {
  color: var(--neon-yellow);
}

.menu-card.yellow-block:hover {
  background: var(--neon-yellow) !important;
}

.menu-card.yellow-block:hover .card-num,
.menu-card.yellow-block:hover .card-title,
.menu-card.yellow-block:hover .card-sub,
.menu-card.yellow-block:hover .card-arrow {
  color: #000000 !important;
}

.menu-card.cyan-block:hover {
  background: var(--neon-cyan) !important;
}

.menu-card.cyan-block:hover .card-num,
.menu-card.cyan-block:hover .card-title,
.menu-card.cyan-block:hover .card-sub,
.menu-card.cyan-block:hover .card-arrow {
  color: #000000 !important;
}

.menu-card.magenta-block:hover {
  background: var(--neon-magenta) !important;
}

.menu-card.magenta-block:hover .card-num,
.menu-card.magenta-block:hover .card-title,
.menu-card.magenta-block:hover .card-sub,
.menu-card.magenta-block:hover .card-arrow {
  color: #ffffff !important;
}

@media (max-width: 900px) {
  .terminal-main { padding: 1.5rem; }
  .menu-card { padding: 1.2rem; }
  .card-num { width: 60px; font-size: 1.2rem; }
  .card-title { font-size: 1.3rem; }
}
/* BRUTALIST TELEMETRY SETTLEMENT MODAL STYLES */
.os-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 1.5rem;
}

.settlement-hero-modal {
  position: relative;
  width: 720px;
  max-width: 95vw;
  background: #020406;
  border: 2px solid var(--neon-yellow);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  box-shadow: 0 0 40px rgba(204, 255, 0, 0.2);
}

.modal-hdr-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 900;
  padding: 0.6rem 1rem;
  background: rgba(204, 255, 0, 0.08);
  border-left: 3px solid var(--neon-yellow);
}

.report-watermark {
  position: absolute;
  top: -30px;
  right: 10px;
  font-size: 7rem;
  font-weight: 900;
  color: rgba(204, 255, 0, 0.03);
  pointer-events: none;
  user-select: none;
}

.yellow-border { border: 1px solid var(--neon-yellow); }

.partner-performance-sec {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.sec-hdr { font-size: 0.78rem; font-weight: 900; }

.partner-log-rows {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-height: 220px;
  overflow-y: auto;
}

.partner-log-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #000000;
  padding: 0.8rem 1.2rem;
  border-left: 2px solid var(--neon-cyan);
}

.p-info {
  display: flex;
  flex-direction: column;
}

.p-name { font-size: 0.95rem; font-weight: 900; color: #ffffff; }
.p-loc { font-size: 0.72rem; }

.p-pnl { font-size: 1rem; font-weight: 900; }
.p-share { font-size: 0.8rem; font-weight: 900; }

.modal-close-hero {
  padding: 1rem !important;
  font-size: 0.95rem !important;
  margin-top: 0.5rem;
}
</style>
