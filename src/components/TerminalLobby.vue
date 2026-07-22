<template>
  <TerminalLayout>
    <!-- Main Brutalist Typography OS Menu -->
    <div class="terminal-main">
      <div class="title-block">
        <h1 class="hero-title">CYBERSPACE<span class="yellow-dot">.</span></h1>
        <div class="sub-syslog cyan">// MAIN_OPERATING_SYSTEM // [6_SUBROUTINES_ONLINE]</div>
      </div>

      <nav class="terminal-menu-list">
        <!-- 01: TABLE_SEARCH (Fullscreen OS Subview) -->
        <div class="menu-card yellow-block" @click="$emit('view', 'table_search')">
          <div class="card-num">01 //</div>
          <div class="card-body">
            <h2 class="card-title">TABLE_SEARCH</h2>
            <p class="card-sub cyan">ACCESS HIGH-STAKES POKER TABLES & SECTOR CASINOS</p>
          </div>
          <div class="card-arrow">➔</div>
        </div>

        <!-- 02: AI_NEXUS (Fullscreen OS Subview) -->
        <div class="menu-card cyan-block" @click="$emit('view', 'ai_nexus')">
          <div class="card-num">02 //</div>
          <div class="card-body">
            <h2 class="card-title">AI_NET_NEXUS</h2>
            <p class="card-sub">RECRUIT AGENTS, ASSIGN LUDUS TOKENS & HUD PROTOCOLS</p>
          </div>
          <div class="card-arrow">➔</div>
        </div>

        <!-- 03: BLACK_MARKET -->
        <div class="menu-card magenta-block" @click="$emit('view', 'shop')">
          <div class="card-num">03 //</div>
          <div class="card-body">
            <h2 class="card-title">BLACK_MARKET</h2>
            <p class="card-sub">HARDWARE PLUGINS, FINANCIAL CONTRACTS & COMPANIONS</p>
          </div>
          <div class="card-arrow">➔</div>
        </div>

        <!-- 04: PARTNERS_NET (Standalone OS Page) -->
        <div class="menu-card" @click="$emit('view', 'partner_net')">
          <div class="card-num">04 //</div>
          <div class="card-body">
            <h2 class="card-title">PARTNERS_NET</h2>
            <p class="card-sub">ACTIVE COMPANION CONTRACTS, AFFINITY & GIFT PROTOCOLS</p>
          </div>
          <div class="card-arrow">➔</div>
        </div>

        <!-- 05: MODULE_DECK (Standalone OS Page) -->
        <div class="menu-card" @click="$emit('view', 'module_deck')">
          <div class="card-num">05 //</div>
          <div class="card-body">
            <h2 class="card-title">MODULE_DECK</h2>
            <p class="card-sub">MULTI-SLOT HARDWARE PLUGIN CONFIGURATOR & SYNERGY DECK</p>
          </div>
          <div class="card-arrow">➔</div>
        </div>

        <!-- 06: COMMS_INBOX (Standalone OS Page) -->
        <div class="menu-card" @click="$emit('view', 'comms_inbox')">
          <div class="card-num">06 //</div>
          <div class="card-body">
            <div class="title-row">
              <h2 class="card-title">COMMS_INBOX</h2>
              <span class="unread-badge" v-if="unreadCount > 0">[{{ unreadCount }}_UNREAD]</span>
            </div>
            <p class="card-sub">SECURE ENCRYPTED MESSAGES & TRANSMISSION LOGS</p>
          </div>
          <div class="card-arrow">➔</div>
        </div>
      </nav>
    </div>
  </TerminalLayout>
</template>

<script setup>
import { computed } from 'vue';
import { store } from '../logic/store';
import TerminalLayout from './TerminalLayout.vue';

defineEmits(['join', 'view', 'openSearch', 'openAgentModal']);

const unreadCount = computed(() => {
  if (!store.messages) return 0;
  return store.messages.filter(m => !m.read).length;
});
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
  border: 1px solid rgba(0, 240, 255, 0.2);
  padding: 1.8rem 2.5rem;
  cursor: pointer;
  border-radius: 0px;
  transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
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
  font-size: 0.78rem;
  font-weight: 900;
  color: var(--neon-magenta);
}

.card-arrow {
  font-size: 1.8rem;
  color: var(--neon-cyan);
  transition: transform 0.2s ease;
}

/* Hover Accent Blocks */
.menu-card:hover {
  border-color: var(--neon-yellow);
  transform: translateX(10px);
}

.menu-card:hover .card-num,
.menu-card:hover .card-arrow {
  color: var(--neon-yellow);
}

.menu-card.yellow-block:hover {
  background: var(--neon-yellow);
}

.menu-card.yellow-block:hover .card-num,
.menu-card.yellow-block:hover .card-title,
.menu-card.yellow-block:hover .card-sub,
.menu-card.yellow-block:hover .card-arrow {
  color: #000000 !important;
}

.menu-card.cyan-block:hover {
  background: var(--neon-cyan);
}

.menu-card.cyan-block:hover .card-num,
.menu-card.cyan-block:hover .card-title,
.menu-card.cyan-block:hover .card-sub,
.menu-card.cyan-block:hover .card-arrow {
  color: #000000 !important;
}

.menu-card.magenta-block:hover {
  background: var(--neon-magenta);
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
</style>
