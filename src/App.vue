<script setup>
import { ref, onMounted } from 'vue';
import { store, resetStore, saveStore, initStore, calculateSessionReport, applySessionExit } from './logic/store';
import { createPlayRecordStats } from './logic/playRecordStats';
import { GameEngine } from './logic/gameEngine';
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
import AgentTaskPopup from './components/AgentTaskPopup.vue';
import AiAgentPopup from './components/AiAgentPopup.vue';
import SkillSelectorModal from './components/SkillSelectorModal.vue';
import PlayStatsPopup from './components/PlayStatsPopup.vue';
import TableSearchPopup from './components/TableSearchPopup.vue';
import ItemCatalogPopup from './components/ItemCatalogPopup.vue';
import { audioManager } from './logic/audioManager';
import { performSleep } from './logic/staminaSystem';
import { checkAutoRefresh } from './logic/shopLogic';
import { hydrateStoreItems } from './logic/items';
import { getPartners } from './logic/partnerSystem';
import { startTimeSystem, formatGameTime, formatGameDate, formatGameDayOfWeek, stopTimeSystem, advanceTime } from './logic/timeSystem';
// Automated Hand Transition Logic
import { watch, computed, nextTick } from 'vue';
const showInvestigationOverlay = ref(false);
const showInvestigationResultOverlay = ref(false);
const showConfiscationOverlay = ref(false);
const searchPopupRef = ref(null);
const investigationMessage = computed(() => {
  return store.settings.language === 'ko'
    ? '하우스 보안 관계자가 당신을 수상하게 여기고, 신상 및 혐의를 조사하고 있습니다...'
    : 'House security is vetting your ID and investigating potential violations...';
})
const investigationResultMessage = computed(() => {
  return store.settings.language === 'ko'
    ? '조사 결과 명확한 혐의점은 발견되지 않았습니다. 당신은 혐의를 벗었으나, 즉시 시설에서 떠나야 했습니다.'
    : 'Investigation result: No violations found. You are released, but must leave the facility immediately.';
})
const confiscationMessage = computed(() => {
  return store.settings.language === 'ko'
    ? '파트너와의 불법 계약 확인. 당신은 모든 칩을 압수당했습니다!'
    : 'Illegal contract with partner confirmed. You lost all your chips!';
})

const handleQuitApp = async () => {
  try {
    saveStore(); // Save before exiting
    if (window.__TAURI_INTERNALS__) {
      const { exit } = await import('@tauri-apps/plugin-process');
      await exit(0);
    } else {
      console.warn("Running in pure web mode. Cannot close the window automatically.");
      alert('브라우저에서는 게임을 닫을 수 없습니다.');
    }
  } catch (error) {
    console.error("Failed to exit properly", error);
    // Fallback attempt if plugin import failed but we are in Tauri
    if (window.__TAURI_INTERNALS__) {
      window.close();
    }
  }
};

const currentView = ref(''); // splash, intro, lobby, table, shop, home
const isAppLoading = ref(true);
const engine = ref(null);

const isSettingsOpen = ref(false);
const showHistory = ref(false);
const showAgentTaskPopup = ref(false);
const selectedTaskSlotIdx = ref(-1);

const showAgentModal = ref(false);
const showSkillSelector = ref(false);
const showStatsModal = ref(false);
const showCatalog = ref(false);
const activeSlotIdx = ref(null);
const activeSlotType = ref(null);

const handleOpenAgentModal = () => {
  showAgentModal.value = true;
};

const handleOpenSkillSelector = (payload) => {
  activeSlotIdx.value = payload.idx;
  activeSlotType.value = payload.type;
  showSkillSelector.value = true;
};

const closeSkillSelector = () => {
  showSkillSelector.value = false;
  activeSlotIdx.value = null;
  activeSlotType.value = null;
};

const toggleSettings = () => {
  isSettingsOpen.value = !isSettingsOpen.value;
  const freq = isSettingsOpen.value ? 400 : 20000;
  audioManager.setFilter(freq);
};

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleSettings();
  });

  window.addEventListener('join-table', (e) => {
    handleJoinTable(e.detail);
  });

  window.addEventListener('open-table-search', (e) => {
    if (searchPopupRef.value) {
      if (e.detail?.locationId) {
        searchPopupRef.value.openWithLocation(e.detail.locationId, e.detail.inviteId);
      } else {
        searchPopupRef.value.open();
      }
    }
  });

  window.addEventListener('trigger-cashout', () => {
    if (engine.value) {
      handleAction({ type: 'cashout' });
    }
  });

  window.addEventListener('trigger-confiscation', () => {
    if (engine.value) {
      showInvestigationOverlay.value = false;
      showConfiscationOverlay.value = true;
      // setTimeout(() => {
      //   showConfiscationOverlay.value = false;
      //   handleAction({ type: 'exit' });
      // }, 3500);
    }
  });

  window.addEventListener('trigger-investigation', () => {
    if (engine.value) {
      showInvestigationOverlay.value = true;
      // setTimeout(() => {
      //   showInvestigationOverlay.value = false;
      // }, 5500);
    }
  });
  window.addEventListener('trigger-investigation-result', () => {
    if (engine.value) {
      showInvestigationResultOverlay.value = true;
      showInvestigationOverlay.value = false;
    }
  });
  window.addEventListener('open-item-catalog', () => {
    showCatalog.value = true;
  });

  // Global shop refresh check every 10 seconds
  setInterval(checkAutoRefresh, 10000);

  // Process initStore async
  const initializeApp = async () => {
    stopTimeSystem()
    await initStore();
    hydrateStoreItems();
    console.info('store.partners', getPartners())
    currentView.value = 'splash';
    isAppLoading.value = false;
  };

  initializeApp();

  // Handle Autoplay policy: Resume AudioContext on first interaction
  const resumeAudio = async () => {
    try {
      await audioManager.init();
      if (audioManager.ctx && audioManager.ctx.state === 'suspended') {
        await audioManager.ctx.resume();
        console.info('AudioContext resumed via user interaction');
      }
      // Re-trigger music if it was supposed to be playing
      if (currentView.value === 'intro' || currentView.value === 'lobby') {
        audioManager.playTrackByZoneId(currentView.value === 'intro' ? 'main' : 'lobby');
      }
    } catch (e) {
      console.warn('Failed to resume audio:', e);
    }
    window.removeEventListener('click', resumeAudio);
    window.removeEventListener('keydown', resumeAudio);
  };
  window.addEventListener('click', resumeAudio);
  window.addEventListener('keydown', resumeAudio);

  // Background Auto-Save (Fallback for non-poker events)
  setInterval(() => {
    saveStore();
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
    handleAction({ type: 'hard_reset' });
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
  startTimeSystem();
};

const handleJoinTable = async (payload) => {
  const { inviteId, size, buyIn, rake, rakeCap, isAdvanced, sb, bb, locationId, locationLV, buyInLimit, isMonitoring } = payload;
  console.info('handleJoinTable', payload);
  // [CLEANUP] Ensure previous engine is destroyed
  if (engine.value) {
    engine.value.cleanup();
    engine.value = null;
  }
  // Initialize session stats
  store.play_stats_session = createPlayRecordStats();
  // Use passed rake or default
  const finalRake = rake !== undefined ? rake : 0.05;
  const finalRakeCap = rakeCap !== undefined ? rakeCap : (bb * 10);
  // const finalBuyInLimit = buyInLimit !== undefined ? buyInLimit : 999999;
  engine.value = new GameEngine(store.selectedClass, size, sb, bb, buyIn, finalRake, finalRakeCap, isAdvanced, locationId, locationLV, buyInLimit, isMonitoring, inviteId);

  const equipped = store.ownedItems.find(p => (p.instanceId || p.id) === store.equippedItem);
  if (equipped) {
    engine.value.players[0].equippedItem = equipped.id;
    engine.value.players[0].equippedItemIcon = equipped.icon;
    engine.value.players[0].equippedItemInstance = equipped;
  }
  currentView.value = 'table';
  await engine.value.startNewHand();
};

const handleView = (view) => {
  currentView.value = view;
  audioManager.playSFX('ui-click');
};

const handleOpenTaskSelector = (idx) => {
  selectedTaskSlotIdx.value = idx;
  showAgentTaskPopup.value = true;
};

const handleAction = async (payload) => {
  const { type, amount } = payload;
  console.info('handleAction', payload);
  if (type === 'main_menu') {
    currentView.value = 'intro';
  } else if (type === 'hard_reset') {
    resetStore().then(() => {
      window.location.reload();
    });
  }
  if (!engine.value) return;
  switch (type) {
    case 'all_in':
    case 'fold':
    case 'call':
    case 'raise':
      await engine.value.handlePlayerAction(engine.value.players[0], { type, amount });
      break;
    case 'exit':
      showConfiscationOverlay.value = false;
      showInvestigationOverlay.value = false;
      showInvestigationResultOverlay.value = false;
      showGameOverOverlay.value = false;
      if (engine.value) {
        applySessionExit(engine.value);
        currentView.value = 'lobby';
        showStatsModal.value = true;
        engine.value.exitGame();
        engine.value = null;
      }
      break;
    case 'cashout':
      currentView.value = 'lobby';
      showConfiscationOverlay.value = false;
      showInvestigationOverlay.value = false;
      showInvestigationResultOverlay.value = false;
      showGameOverOverlay.value = false;
      audioManager.pause();
      audioManager.playSFX('paybill');
      audioManager.playSFX('clear-table')
      if (engine.value) {
        applySessionExit(engine.value);
        showStatsModal.value = true;
        engine.value.exitGame();
        engine.value = null;
      }
      break;
  }
};
// Sleep System Refs
const showSleepModal = ref(false);
const visibleReportLines = ref([]);
const reportFinished = ref(false);
const fullReportLines = ref([]);
const consoleBox = ref(null);
const currentSleepDuration = ref(0);
const handleSleepClick = (duration = 8.0) => {
  currentSleepDuration.value = duration;
  // bankroll_history
  const report = calculateSessionReport();
  const details = [];
  Object.keys(report).forEach(key => {
    if (report[key] !== 0) {
      details.push(`${key}: ${report[key].toLocaleString()} CR`);
    }
  });
  if (details.length === 0) {
    details.push(`DATA_NOT_FOUND`)
  }
  audioManager.playSFX('plus-sound-short');
  fullReportLines.value = [
    `--------------------------------`,
    `ACCESS_PROFIT_DETAILES...`,
    `--------------------------------`,
  ];
  fullReportLines.value = fullReportLines.value.concat([...details,
    `--------------------------------`,
    `STAMINA_LEVEL: 100% RECOVERED`,
  ])
  visibleReportLines.value = [];
  reportFinished.value = false;
  showSleepModal.value = true;
  // visibleReportLines.value.push(fullReportLines.value[0]);
  // visibleReportLines.value.push(fullReportLines.value[1]);
  // visibleReportLines.value.push(fullReportLines.value[2]);
  setTimeout(() => {
    let i = 2;
    loopShowReport(i);
  }, 800);
  saveStore(); // Save after sleeping
};
function loopShowReport(i) {
  if (i >= fullReportLines.value.length) {
    reportFinished.value = true;
    return;
  }
  setTimeout(() => {
    visibleReportLines.value.push(fullReportLines.value[i]);
    audioManager.playSFX('ui-click');
    nextTick(() => {
      consoleBox.value.scrollTop = consoleBox.value.scrollHeight;
    })
    loopShowReport(++i);
  }, 350 - (i * 10));
}
const wakeUp = () => {
  performSleep(advanceTime, currentSleepDuration.value)
  showSleepModal.value = false;
  audioManager.playSFX('action-confirm');
};
const handleSkill = (skillId) => {
  if (engine.value.useSkill(engine.value.players[0], skillId)) {
    console.log(`Program ${skillId} executed.`);
  } else {
    alert("RAM OVERLOAD: Cannot execute program.");
  }
};


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

const staminaBlur = computed(() => {
  const s = store.stamina;
  if (s >= 25) return 0;
  // Below 25%, blur increases from 0 to 5px
  return ((25 - s) / 25) * 5;
});

watch(currentView, (newView) => {
  window.isAtTable = (newView === 'table');
});
</script>

<template>
  <div class="app-shell" :class="{ 'in-settings': isSettingsOpen }">
    <div class="scanline-bg"></div>
    <Transition name="fade" mode="out-in" class="layout-container">
      <div v-if="isAppLoading" class="loading-screen">
      </div>
      <!-- Settings Overlay -->
      <div v-else :key="currentView">
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
                <span class="status-value">{{ formatGameDate(store.gameTime) }} ({{ formatGameDayOfWeek(store.gameTime)
                }})</span>
                <span class="status-divider"></span>
                <span class="status-value">{{ formatGameTime(store.gameTime) }}</span>
              </div>
            </div>
          </div>
        </header>
        <!-- Splash Screen (Intro) -->
        <Splash v-if="currentView === 'splash'" @finish="currentView = 'intro'" />
        <!-- Intro View(main-menu) -->
        <Intro v-else-if="currentView === 'intro'" @start="handleStart" @calibrate="toggleSettings"
          @quit="handleQuitApp" />
        <section v-else class="game-container" :style="{ filter: `blur(${staminaBlur}px)` }">
          <!-- Lobby View -->
          <Lobby v-if="currentView === 'lobby'" @join="handleJoinTable" @view="handleView"
            @openSearch="searchPopupRef?.open()" />

          <!-- Shop View -->
          <Shop v-else-if="currentView === 'shop'" @back="handleView('lobby')" />

          <!-- Safe House View -->
          <SafeHouse v-else-if="currentView === 'home'" @back="handleView('lobby')" @sleep="handleSleepClick"
            @open-task-selector="handleOpenTaskSelector" @open-agent-modal="handleOpenAgentModal"
            @open-skill-selector="handleOpenSkillSelector" @open-stats-modal="showStatsModal = true" />

          <!-- c House View -->
          <!-- <SafeHouse v-else-if="currentView === 'home'" @back="handleView('lobby')" @sleep="handleSleepClick" @open-task-selector="handleOpenTaskSelector" /> -->

          <!-- Crypto Exchange View -->
          <CryptoExchange v-else-if="currentView === 'crypto'" @back="handleView('lobby')" />
          <!-- Game Table View -->
          <div v-else-if="currentView === 'table'" class="game-container">
            <main>
              <PokerTable :engine="engine" @openHistory="showHistory = true" />
            </main>
            <ControlPanel :engine="engine" @action="handleAction" @skill="handleSkill" />

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
          </div>
        </section>
      </div>
    </Transition>
    <!-- Settings Overlay -->

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
              <span class="label">RESET_GAME_DATA:</span>
              <button class="reboot-hold-btn" @mousedown="startReboot" @touchstart.prevent="startReboot"
                @mouseup="cancelReboot" @touchend="cancelReboot" @mouseleave="cancelReboot"
                :class="{ 'rebooting': isRebooting }">
                <div class="reboot-progress" :style="{ width: rebootProgress + '%' }"></div>
                <span class="btn-text">
                  HOLD BUTTON
                </span>
              </button>
            </div>
            <!-- Global Actions

            <!-- Accessibility -->
            <div class="setting-item">
              <span class="label">VISUAL_MODE:</span>
              <button @click="store.settings.fourColorMode = !store.settings.fourColorMode">
                {{ store.settings.fourColorMode ? '4-COLOR: ON' : '4-COLOR: OFF' }}
              </button>
            </div>
            <div class="setting-item">
              <span class="label">LANGUAGE:</span>
              <button @click="store.settings.language = store.settings.language === 'en' ? 'ko' : 'en'">
                {{ store.settings.language === 'en' ? 'LANG: EN' : 'LANG: KO' }}
              </button>
            </div>
            <div class="setting-item">
              <span class="label">DISPLAY_UNIT:</span>
              <button @click="store.settings.showAsBB = !store.settings.showAsBB">
                {{ store.settings.showAsBB ? 'UNIT: BB' : 'UNIT: CR' }}
              </button>
            </div>
            <!-- <div class="setting-item" v-if="currentView === 'table'">
              <span class="label">SESSION_LINK:</span>
              <button class="btn-danger" @click="handleAction({ type: 'exit' }); toggleSettings()">LEAVE_TABLE</button>
            </div> -->
            <div class="setting-item">
              <span class="label">EXIT_GAME:</span>
              <button class="btn-danger" @click="handleQuitApp">EXIT</button>
            </div>
          </div>
          <button class="btn-close" @click="toggleSettings">CLOSE_INTERFACE</button>
        </div>
      </div>
    </Transition>
    <!-- History Popup -->
    <HistoryPopup v-if="showHistory && engine" :history="engine.handHistory" @close="showHistory = false" />

    <!-- Agent Task Popup -->
    <AgentTaskPopup v-if="showAgentTaskPopup" :slotIdx="selectedTaskSlotIdx" @close="showAgentTaskPopup = false" />

    <!-- AI Agent Selection Modal -->
    <AiAgentPopup :show="showAgentModal" @close="showAgentModal = false" />

    <!-- Skill Selector Modal -->
    <SkillSelectorModal :show="showSkillSelector" :activeSlotIdx="activeSlotIdx" :activeSlotType="activeSlotType"
      @close="closeSkillSelector" />

    <!-- Play Stats Modal -->
    <PlayStatsPopup :show="showStatsModal" @close="showStatsModal = false" />

    <!-- Item Catalog Modal -->
    <ItemCatalogPopup :show="showCatalog" @close="showCatalog = false" />

    <!-- SLEEP REPORT MODAL -->
    <Transition name="fade">
      <div v-if="showSleepModal" class="v5-modal-overlay sleep-overlay">
        <div class="v5-modal sleep-modal">
          <div class="">TODAY_SESSION_BENEFITS_REPORT</div>
          <h2 class="glitch-text" data-text="SESSION_ANALYSIS">SESSION_ANALYSIS</h2>
          <div class="console-box" ref="consoleBox">
            <div v-for="(line, idx) in visibleReportLines" :key="idx" class="console-line">
              <span class="prompt">></span> {{ line }}
            </div>
          </div>
          <div class="report-actions">
            <button class="btn" @click="wakeUp" :disabled="!reportFinished">WAKE_UP</button>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="showInvestigationOverlay" class="overlay investigation-overlay">
        <div class="terminal-msg warn">
          <h2 class="glitch-text" data-text="INVESTIGATION">INVESTIGATING...</h2>
          <p class="critical-msg">{{ investigationMessage }}</p>
          <div class="action-row">
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="showInvestigationResultOverlay" class="overlay investigation-overlay">
        <div class="terminal-msg warn">
          <h2 class="glitch-text" data-text="INVESTIGATION_RESULT">INVESTIGATION_RESULT</h2>
          <p class="critical-msg">{{ investigationResultMessage }}</p>
          <div class="action-row">
            <button class="btn-reboot reboot-btn"
              @click="handleAction({ type: 'cashout' }); showInvestigationResultOverlay = false">
              <span class="btn-glitch">GO TO LOBBY</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="showConfiscationOverlay" class="overlay confiscation-overlay">
        <div class="terminal-msg danger">
          <h2 class="glitch-text" data-text="CONFISCATION">CONFISCATION</h2>
          <p class="critical-msg">{{ confiscationMessage }}</p>
          <div class="action-row">
            <button class="btn-reboot reboot-btn" @click="handleAction({ type: 'exit' });">
              <span class="btn-glitch">GO TO LOBBY</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
    <!-- Bankruptcy Overlay -->
    <Transition name="fade">
      <div v-if="showGameOverOverlay" class="overlay bankruptcy-overlay">
        <div class="terminal-msg danger">
          <h2 class="glitch-text" data-text="CONNECTION TERMINATED">YOU ARE ELIMINATED</h2>
          <p class="critical-msg">YOU'VE GONE BUST.</p>
          <div class="action-row">
            <button class="btn-reboot reboot-btn" @click="handleAction({ type: 'exit' });">
              <span class="btn-glitch">GO TO LOBBY</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
    <!-- Game Over Overlay -->
    <Transition name="fade">
      <div v-if="store.isRealGameOver" class="overlay bankruptcy-overlay">
        <div class="terminal-msg danger">
          <!-- <div class="danger-icon">⚠️</div> -->
          <h2 class="glitch-text" data-text="CONNECTION TERMINATED">GAME OVER</h2>
          <p class="critical-msg">{{ store.realGameOverReason }}</p>
          <div class="action-row">
            <button class="btn-reboot reboot-btn" @click="handleAction({ type: 'hard_reset' });">
              <span class="btn-glitch">GO TO MAIN MENU</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
    <TableSearchPopup ref="searchPopupRef" @join="handleJoinTable" />
  </div>
</template>


<style>
/* Global Styles moved to style.css */
</style>
