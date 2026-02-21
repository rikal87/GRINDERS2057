<script setup>
import { ref, reactive, onMounted } from 'vue';
import { store, resetStore, initializeBankroll } from './logic/store';
import { GameEngine } from './logic/gameEngine';
import { getAIAction } from './logic/aiEngine.js';
import Intro from './components/Intro.vue';
import Splash from './components/Splash.vue';
import Lobby from './components/Lobby.vue';
import Shop from './components/Shop.vue';
import SafeHouse from './components/SafeHouse.vue';
import CryptoExchange from './components/CryptoExchange.vue';
import PokerTable from './components/PokerTable.vue';
import ControlPanel from './components/ControlPanel.vue';
import AudioPlayer from './components/AudioPlayer.vue';
import HistoryPopup from './components/HistoryPopup.vue';
import { audioManager } from './logic/audioManager';

import { checkAutoRefresh } from './logic/shopLogic';

// ... imports
import { startTimeSystem, formatGameTime, formatGameDate } from './logic/timeSystem';
import { processAiTasks } from './logic/aiTaskSystem';

const currentView = ref('splash'); // splash, intro, lobby, table, shop, home
const engine = ref(null);

const isSettingsOpen = ref(false);
const showHistory = ref(false);

const toggleSettings = () => {
  isSettingsOpen.value = !isSettingsOpen.value;
  const freq = isSettingsOpen.value ? 400 : 20000;
  audioManager.setFilter(freq);
};

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleSettings();
  });

  // Global shop refresh check every 10 seconds
  setInterval(checkAutoRefresh, 10000);

  // Start Game Time System
  startTimeSystem();

  // Process AI Tasks every minute (1 game hour)
  setInterval(() => {
    processAiTasks();
  }, 60000);
});

// --- Reboot Logic (Hold 3s) ---
const rebootTimer = ref(null);
const rebootInterval = ref(null);
const rebootProgress = ref(0);
const isRebooting = ref(false);

const startReboot = () => {
  if (isRebooting.value) return;


  isRebooting.value = true;
  rebootProgress.value = 0;

  // Visual Progress Update (every 50ms)
  rebootInterval.value = setInterval(() => {
    rebootProgress.value += (100 / (3000 / 50));
    if (rebootProgress.value >= 100) rebootProgress.value = 100;
  }, 50);

  // Trigger Action after 3s
  rebootTimer.value = setTimeout(() => {
    handleAction({ type: 'reboot' });
    cancelReboot(); // Reset after trigger
    toggleSettings(); // Close menu
  }, 3000);
};

const cancelReboot = () => {
  if (!isRebooting.value) return;
  isRebooting.value = false;
  rebootProgress.value = 0;
  clearTimeout(rebootTimer.value);
  clearInterval(rebootInterval.value);
  rebootTimer.value = null;
  rebootInterval.value = null;
};

const handleStart = (mode) => {
  if (mode === 'new') resetStore();
  audioManager.playSFX('bootup')
  currentView.value = 'lobby';
  audioManager.play();
};

const handleJoinTable = async (payload) => {
  const { size, buyIn, rake, rakeCap, isHighStakes, sb, bb, locationId, locationLV } = payload;
  console.info('handleJoinTable', payload);

  // [CLEANUP] Ensure previous engine is destroyed
  if (engine.value) {
    engine.value.cleanup();
    engine.value = null;
  }

  // Use passed rake or default
  const finalRake = rake !== undefined ? rake : 0.05;
  const finalRakeCap = rakeCap !== undefined ? rakeCap : (bb * 10);

  engine.value = new GameEngine(store.selectedClass, size, sb, bb, buyIn, finalRake, finalRakeCap, isHighStakes, locationId, locationLV);

  // ... rest of function

  // Initialize players with the selected buy-in
  // [FIX] Do NOT override chips here; GameEngine handles it (AI has multipliers)
  // engine.value.players.forEach(p => {
  //   p.chips = buyIn;
  // });

  // Inject equipped protector for human
  const equipped = store.ownedProtectors.find(p => (p.instanceId || p.id) === store.equippedProtector);
  if (equipped) {
    engine.value.players[0].equippedProtector = equipped.id;
    engine.value.players[0].equippedProtectorIcon = equipped.icon;
    engine.value.players[0].equippedProtectorInstance = equipped;
  }

  currentView.value = 'table';
  await engine.value.startNewHand();
};

const handleView = (view) => {
  currentView.value = view;
  audioManager.playSFX('ui-click');
};

const handleAction = async (payload) => {
  const { type, amount } = payload;
  console.info('handleAction', payload);
  if (type === 'reboot') {
    currentView.value = 'lobby';
    initializeBankroll();
  } else if (type === 'main_menu') {
    currentView.value = 'intro';
  }
  if (!engine.value) return;
  switch (type) {

    case 'all_in':
    case 'fold':
    case 'call':
    case 'raise':
      await engine.value.handlePlayerAction(engine.value.players[0], { type, amount });
      break;
    case 'reboot':
    case 'main_menu':
    case 'exit':
      audioManager.playSFX('ui-click');
      showGameOverOverlay.value = false
      engine.value.exitGame();
      engine.value = null;
      currentView.value = 'lobby';
      break;
  }
};

const handleSkill = (skillId) => {
  if (engine.value.useSkill(engine.value.players[0], skillId)) {
    console.log(`Program ${skillId} executed.`);
  } else {
    alert("RAM OVERLOAD: Cannot execute program.");
  }
};



// Automated Hand Transition Logic
import { watch } from 'vue';
const autoNextTimer = ref(null);

watch(() => engine.value?.state, (newState, oldState) => {
  // Clear any existing timer regardless of state change
  if (autoNextTimer.value) {
    clearTimeout(autoNextTimer.value);
    autoNextTimer.value = null;
  }

  // Play deal sound on street transitions
  // if (['FLOP', 'TURN', 'RIVER'].includes(newState) && newState !== oldState) {
  //   audioManager.playSFX('card-dealt&fold');
  // }

  if (newState === 'SHOWDOWN' && !engine.value.gameOver) {
    let delay = 5000;
    // Dynamic delay for sequential side pot animation
    if (engine.value.showdownResults?.detailedPots?.length > 0) {
      // Each pot takes ~5s (2s highlight + 3s pause)
      // Add buffer
      delay = (engine.value.showdownResults.detailedPots.length * 6000) + 2000;
    }

    autoNextTimer.value = setTimeout(() => {
      handleAction({ type: 'next' });
    }, delay);
  }
});

const showGameOverOverlay = ref(false);
const showVictoryOverlay = ref(false);
const now = ref(new Date().toLocaleTimeString())
setInterval(() => now.value = new Date().toLocaleTimeString(), 1000)
// Watch for bankruptcy/game over
watch(() => engine.value?.gameOver, (isGameOver) => {
  if (isGameOver) {
    setTimeout(() => {
      if (engine.value.winnerId === 'player') {
        showVictoryOverlay.value = true;
      } else {
        audioManager.playSFX('glitch-reboot');
        if (Math.random() < 0.05) audioManager.setPlaybackRate(0.9);
        audioManager.setFilter(800);
        showGameOverOverlay.value = true;
      }
    }, 3500);
  } else {
    showGameOverOverlay.value = false;
    showVictoryOverlay.value = false;
  }
});
</script>

<template>
  <div class="app-shell" :class="{ 'in-settings': isSettingsOpen }">
    <div class="scanline-bg"></div>
    <Transition name="fade" mode="out-in" class="layout-container">
      <!-- Settings Overlay -->
      <div :key="currentView">
        <header v-if="currentView !== 'intro' && currentView !== 'splash'" class="navbar">
          <div class="header-main">
            <div class="row">
              <h1 class="glitch-text logo" data-text="GRINDERS 2057">GRINDERS 2057</h1>
              <div class="header-controls">
                <button class="btn-audio" @click="toggleSettings">SETTINGS</button>
              </div>
            </div>
            <div class="row">
              <div class="status-group">
                <span class="status-value">{{ formatGameDate(store.gameTime) }}</span>
                <span class="status-divider"></span>
                <span class="status-value">{{ formatGameTime(store.gameTime) }}</span>
              </div>
            </div>
          </div>
        </header>
        <!-- Splash Screen (Intro) -->
        <Splash v-if="currentView === 'splash'" @finish="currentView = 'intro'" />
        <!-- Intro View(main-menu) -->
        <Intro v-else-if="currentView === 'intro'" @start="handleStart" />
        <section class="game-container">
          <!-- Lobby View -->
          <Lobby v-if="currentView === 'lobby'" @join="handleJoinTable" @view="handleView" />

          <!-- Shop View -->
          <Shop v-else-if="currentView === 'shop'" @back="handleView('lobby')" />

          <!-- Safe House View -->
          <SafeHouse v-else-if="currentView === 'home'" @back="handleView('lobby')" />

          <!-- Crypto Exchange View -->
          <CryptoExchange v-else-if="currentView === 'crypto'" @back="handleView('lobby')" />
          <!-- Game Table View -->
          <div v-else-if="currentView === 'table'" class="game-container">
            <main>
              <PokerTable :engine="engine" @openHistory="showHistory = true" />
            </main>
            <ControlPanel :engine="engine" @action="handleAction" @skill="handleSkill" />
            <!-- History Popup -->
            <HistoryPopup v-if="showHistory" :history="engine.handHistory" @close="showHistory = false" />

            <!-- Victory Overlay -->
            <Transition name="slide-up">
              <div v-if="showVictoryOverlay" class="overlay victory-overlay dark-glass">
                <div class="terminal-msg victory">
                  <h2 class="glitch-text" data-text="VICTORY ACHIEVED // SECTOR CLEARED">VICTORY ACHIEVED // SECTOR
                    CLEARED</h2>
                  <div class="reward-area">
                    <p class="reward-label">REWARD_DISBURSED</p>
                    <p class="reward-value neon-yellow">{{ engine.victoryPrize }} <span class="unit">XP</span></p>
                  </div>
                  <p class="victory-sub">You are the last survivor. The sector belongs to you.</p>
                  <div class="action-row">
                    <button class="btn-exit nexus-btn" @click="handleAction({ type: 'exit' })">
                      <span class="btn-glitch">RETURN_TO_LOBBY</span>
                    </button>
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Bankruptcy Overlay -->
            <Transition name="fade">
              <div v-if="showGameOverOverlay" class="overlay bankruptcy-overlay">
                <div class="terminal-msg danger">
                  <!-- <div class="danger-icon">⚠️</div> -->
                  <h2 class="glitch-text" data-text="CONNECTION TERMINATED">CONNECTION TERMINATED</h2>
                  <h2 class="danger-title">BANKRUPTCY DETECTED</h2>
                  <p class="critical-msg">CRITICAL ERROR: Neural link severed. Assets liquidated.</p>
                  <div class="action-row">
                    <button class="btn-reboot reboot-btn" @click="handleAction({ type: 'reboot' });">
                      <span class="btn-glitch">SYSTEM REBOOT</span>
                    </button>
                  </div>
                </div>
              </div>
            </Transition>

          </div>
        </section>
      </div>
    </Transition>
    <Transition name="fade" mode="out-in">
      <div v-if="isSettingsOpen" class="overlay settings-overlay">
        <div class="terminal-msg">
          <h2 class="glitch-text" data-text="SYSTEM_CONFIGURATION">SYSTEM_CONFIGURATION</h2>
          <div class="settings-list">
            <!-- Audio Settings -->
            <div class="audio-widget-area">
              <AudioPlayer />
            </div>
            <div class="setting-item">
              <span class="label">SYSTEM_REBOOT:</span>
              <button class="reboot-hold-btn" @mousedown="startReboot" @touchstart.prevent="startReboot"
                @mouseup="cancelReboot" @touchend="cancelReboot" @mouseleave="cancelReboot"
                :class="{ 'rebooting': isRebooting }">
                <div class="reboot-progress" :style="{ width: rebootProgress + '%' }"></div>
                <span class="btn-text">
                  HOLD BUTTON
                </span>
              </button>
            </div>
            <!-- Global Actions -->
            <div class="setting-item" v-if="currentView === 'table'">
              <span class="label">SESSION_LINK:</span>
              <button class="btn-danger" @click="handleAction({ type: 'exit' }); toggleSettings()">LEAVE_TABLE</button>
            </div>
            <!-- Accessibility -->
            <div class="setting-item">
              <span class="label">VISUAL_MODE:</span>
              <button @click="store.settings.fourColorMode = !store.settings.fourColorMode">
                {{ store.settings.fourColorMode ? '4-COLOR: ON' : '4-COLOR: OFF' }}
              </button>
            </div>
            <div class="setting-item">
              <span class="label">DISPLAY_UNIT:</span>
              <button @click="store.settings.showAsBB = !store.settings.showAsBB">
                {{ store.settings.showAsBB ? 'UNIT: BB' : 'UNIT: CR' }}
              </button>
            </div>
            <div class="setting-item">
              <span class="label">EXIT_GAME:</span>
              <button @click="handleAction({ type: 'main_menu' }); toggleSettings();">
                EXIT
              </button>
            </div>
          </div>
          <button class="btn-close" @click="toggleSettings">CLOSE_INTERFACE</button>
        </div>
      </div>
    </Transition>
  </div>
</template>


<style>
/* Global Styles moved to style.css */
.reboot-hold-btn {
  position: relative;
  overflow: hidden;
  background: #332b00;
  color: #ffdd00;
  border: 1px solid #ffdd00;
  transition: all 0.2s;
}
.app-shell,
.layout-container {
  height: 100vh;
}
.layout-container {
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
  /* overflow: auto; */
}
.app-shell {
  display: flex;
  flex-direction: column;
}
.game-container {
  /* height: 100vh; */
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
/* .lobby-container {
  flex-grow: 1;
} */
.reboot-hold-btn:active {
  transform: scale(0.98);
}
.reboot-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(255, 221, 0, 0.6);
  z-index: 1;
  transition: width 0.05s linear;
}

.reboot-hold-btn .btn-text {
  position: relative;
  z-index: 2;
}

.reboot-hold-btn.rebooting {
  border-color: #ffe600;
  box-shadow: 0 0 15px rgba(255, 230, 0, 0.4);
}
</style>
