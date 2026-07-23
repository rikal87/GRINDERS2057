<script setup>
import { ref, onMounted } from 'vue';
import { store, resetStore, saveStore, initStore, calculateSessionReport, applySessionExit, isFastFoward, getLanguage } from './logic/store';
import { createPlayRecordStats } from './logic/playRecordStats';
import { GameEngine } from './logic/gameEngine';
import Intro from './components/Intro.vue';
import Splash from './components/Splash.vue';
import Lobby from './components/Lobby.vue';
import TerminalLobby from './components/TerminalLobby.vue';
import AmbientSafeHouseProto from './components/AmbientSafeHouseProto.vue';
import TableSearchPage from './components/TableSearchPage.vue';
import Shop from './components/Shop.vue';
import PartnerNetPage from './components/PartnerNetPage.vue';
import AiNexusPage from './components/AiNexusPage.vue';
import ModuleDeckPage from './components/ModuleDeckPage.vue';
import CommsInboxPage from './components/CommsInboxPage.vue';
import SafeHouse from './components/SafeHouse.vue';
import CryptoExchange from './components/CryptoExchange.vue';
import PokerTable from './components/PokerTable.vue';
import ControlPanel from './components/ControlPanel.vue';
import AudioPlayer from './components/AudioPlayer.vue';
import HistoryPopup from './components/HistoryPopup.vue';
import AgentTaskPopup from './components/AgentTaskPopup.vue';
import { zones } from './logic/zone.js';
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
    await saveStore(); // Save before exiting
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
  // const freq = isSettingsOpen.value ? 400 : 20000;
  // audioManager.setFilter(freq);
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

  window.addEventListener('start-spectate-match', (e) => {
    // [DECISIVE MOMENT ENGINE] capturePoint 기반 관전 진입 (snapshot 레거시 전환)
    const { capturePoint, heroId, locationId = 'high_grand_casino' } = e.detail || {};
    window.isAtTable = true;
    window.currentLocationId = locationId;

    let locationConfig = null;
    for (const zone of zones) {
      const loc = zone.locations.find(l => l.id === locationId);
      if (loc) { locationConfig = loc; break; }
    }

    const tableConfig = locationConfig?.tables || {};
    const sb = tableConfig.sb || 50;
    const bb = tableConfig.bb || 100;
    const amount = tableConfig.amount || 10000;
    const baseRake = tableConfig.baseRake !== undefined ? tableConfig.baseRake : 0.05;
    const rakeCap = tableConfig.rakeCap || (bb * 10);

    // Hero is always players[0] in capturePoint (Seat 0 Hardlock)
    const heroName = capturePoint?.players?.[0]?.name || heroId || 'HERO';

    engine.value = new GameEngine(
      store.selectedClass, 6, sb, bb, amount, baseRake, rakeCap,
      false, locationId, locationConfig?.level || 1, amount * 2, false, null, false,
      {
        isSpectateMode: true,
        spectateHero: heroName,
        capturePoint: capturePoint || null  // [NEW] capturePoint replaces snapshot
      }
    );
    window.gameEngine = engine.value;
    currentView.value = 'table';
    audioManager.playTrackByZoneId(locationId);

    if (capturePoint) {
      engine.value.injectCapturePoint(capturePoint);
    } else {
      engine.value.startNewHand(true);
    }
  });

  window.addEventListener('trigger-cashout', () => {
    if (engine.value) {
      handleAction({ type: 'cashout' });
    }
  });

  window.addEventListener('trigger-game-over', (e) => {
    audioManager.playSFX('busted');
    showGameOverOverlay.value = true;
  });

  window.addEventListener('trigger-victory', (e) => {
    showVictoryOverlay.value = true;
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
  window.addEventListener('direct-spectate-join', (e) => {
    console.info('🚀 [APP_HIGHWAY] Received direct-spectate-join payload:', e.detail);
    if (e.detail) {
      handleJoinTable(e.detail);
    }
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
  // setInterval(() => {
  //   saveStore();
  // }, 60000);
});

// --- Reboot Logic (Hold 3s) ---
const rebootTimer = ref(null);
const rebootInterval = ref(null);
const rebootProgress = ref(0);
const isRebooting = ref(false);
const getFastForward = () => {
  return getLanguage() === 'en' ? 'If this option is turned on, the game speed will increase when you fold.' : '이 옵션이 켜져있을때 자신이 폴드하면 게임 진행 속도가 빨라집니다.';
}

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
  audioManager.playSFX('riser')
  currentView.value = 'home';
  audioManager.play();
  startTimeSystem();
};
const handleJoinTable = async (payload) => {
  // Save current state before entering a poker session to allow rollback if interrupted
  await saveStore();

  const { inviteId, size, buyIn, rake, rakeCap, isAdvanced, sb, bb, locationId, locationLV, buyInLimit, isMonitoring, isDeathmatch, isSpectateMode, spectateHero, capturePoint } = payload;
  
  // [CLEANUP] Ensure previous engine is destroyed
  if (engine.value) {
    engine.value = null;
  }
  
  // Initialize session stats
  store.play_stats_session = createPlayRecordStats();
  
  // Auto-resolve Zone Metadata Specs from zone.js if missing
  let resolvedSb = sb;
  let resolvedBb = bb;
  let resolvedBuyIn = buyIn;
  let resolvedRake = rake;
  const targetLocationId = locationId || 'micro_warehouse';

  for (const z of zones) {
    const loc = (z.locations || []).find(l => l.id === targetLocationId);
    if (loc) {
      const cfg = loc.tables || loc.tableConfig || {};
      if (!resolvedSb) resolvedSb = cfg.sb || 5;
      if (!resolvedBb) resolvedBb = cfg.bb || 10;
      if (!resolvedBuyIn) resolvedBuyIn = cfg.amount || 1000;
      if (resolvedRake === undefined) resolvedRake = cfg.rake || 0.05;
      break;
    }
  }

  const finalRake = resolvedRake !== undefined ? resolvedRake : 0.05;
  const finalRakeCap = rakeCap !== undefined ? rakeCap : ((resolvedBb || 10) * 10);
  
  const gameEngineOptions = {
    isSpectateMode: !!isSpectateMode,
    spectateHero: spectateHero || (capturePoint?.players?.[0]?.name) || 'HERO',
    capturePoint: capturePoint || null  // [NEW] capturePoint replaces snapshot
  };

  engine.value = new GameEngine(
    store.selectedClass, 
    size || 6, 
    resolvedSb || 5, 
    resolvedBb || 10, 
    resolvedBuyIn || 1000, 
    finalRake, 
    finalRakeCap, 
    isAdvanced, 
    targetLocationId, 
    locationLV || 1, 
    buyInLimit, 
    isMonitoring, 
    inviteId, 
    isDeathmatch, 
    gameEngineOptions
  );

  const equipped = store.equippedItem;
  if (equipped) {
    engine.value.players[0].equippedItem = equipped.id;
    engine.value.players[0].equippedItemIcon = equipped.icon;
    engine.value.players[0].equippedItemInstance = equipped;
  }

  currentView.value = 'table';

  await engine.value.startNewHand(true);
};

// [DECISIVE MOMENT] Phase 2 ready: Phase 1 replay completed, waiting for user decision
// engine.isPhase1Replay becomes false when the engine reaches the capturePoint street
const isPhase2Ready = computed(() =>
  engine.value?.isSpectateMode &&
  !engine.value?.isPhase1Replay &&
  !!engine.value?.capturePoint
);

const handleExitSpectateAndUnlock = () => {
  console.info('[SIMULATION_UNLOCK] Exiting spectate mode and resuming turn simulation...');
  if (engine.value) {
    engine.value = null;
  }
  window.dispatchEvent(new CustomEvent('resume-simulation-unlock'));
  currentView.value = 'lobby';
};

// [Phase 2] User chooses to directly control the decisive street
const handleEnterPhase2 = () => {
  if (!engine.value) return;
  console.info('[DECISIVE_MOMENT] User entering direct control — Phase 2 LIVE');

  // 1. Disable spectate mode & clear capture point lock
  engine.value.isSpectateMode = false;
  engine.value.isPhase1Replay = false;
  engine.value.capturePoint = null;

  // 2. Mark Seat 0 (Hero) as Human User
  const hero = engine.value.players[0];
  if (hero) {
    hero.isHuman = true;
    hero.isPartner = false;
  }

  // 3. Conceal all opponent cards (Poker Tension Rule)
  engine.value.players.forEach((p, idx) => {
    if (idx !== 0) {
      p.isHuman = false;
      p.showHoleCards = false;
    }
  });

  // 4. Force turn to Hero if Hero is alive and hasn't acted yet this street
  if (hero && !hero.isFolded && !hero.isEliminated) {
    const heroIdx = engine.value.players.indexOf(hero);
    if (heroIdx !== -1) {
      engine.value.currentPlayerIndex = heroIdx;
    }
  }

  // 5. Trigger processTurns to pause for Human Input and show ControlPanel
  engine.value.processTurns();
};

// Listen for hand completion auto-exit event
window.addEventListener('exit-spectate-to-lobby', () => {
  console.info('🎥 [APP] exit-spectate-to-lobby event received');
  handleExitSpectateAndUnlock();
});

// [Phase 2] User delegates to AI — engine resumes AI decisions and exits spectate after hand
const handleDelegateToAI = () => {
  if (!engine.value) return;
  console.info('[DECISIVE_MOMENT] Delegating to AI — Phase 2 AI_AUTO');
  engine.value.isPhase1Replay = false;
  engine.value.capturePoint = null;
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
  if (type === 'main_menu') {
    currentView.value = 'intro';
  } else if (type === 'hard_reset') {
    audioManager.playSFX('gameover');
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
      if (type === 'fold' && isFastFoward()) {
        window.isFastFowardActive = true;
      }
      await engine.value.handlePlayerAction(engine.value.players[0], { type, amount });
      break;
    case 'exit':
      engine.value.cashOut(true);
      break;
    case 'cashout':
      // currentView.value = 'lobby';
      engine.value.exitGame();
      showConfiscationOverlay.value = false;
      showInvestigationOverlay.value = false;
      showInvestigationResultOverlay.value = false;
      showGameOverOverlay.value = false;
      showStatsModal.value = true;
      applySessionExit();
      break;
  }
};

const handleBackToLobby = () => {
  currentView.value = 'lobby';
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

// Show Victory/Game Over directly from event
const showGameOverOverlay = ref(false);
const showVictoryOverlay = ref(false);
const now = ref(new Date().toLocaleTimeString())
setInterval(() => now.value = new Date().toLocaleTimeString(), 1000)

watch(currentView, (newView) => {
  window.isAtTable = (newView === 'table');
});
</script>

<template>
  <div class="v5-bg-scan"></div>
  <div class="app-shell" :class="{ 'in-settings': isSettingsOpen }">
    <!-- <div class="scanline-bg"></div> -->
    <Transition name="fade" mode="out-in" class="layout-container">
      <div v-if="isAppLoading" class="loading-screen">
      </div>
      <!-- Settings Overlay -->
      <div v-else :key="currentView">
        <header v-if="!['intro', 'splash', 'lobby', 'home'].includes(currentView)" class="navbar">
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
        <section v-else class="game-container">
          <!-- Cyberspace OS Main Lobby Terminal (Marathon Style - Primary Hub) -->
          <TerminalLobby v-if="currentView === 'lobby' || currentView === 'home'" @join="handleJoinTable" @view="handleView"
            @openSearch="searchPopupRef?.open()" @openAgentModal="handleOpenAgentModal" />

          <!-- Full-Screen Terminal OS Table Search Subview -->
          <TableSearchPage v-else-if="currentView === 'table_search'" @join="handleJoinTable" @back="handleView('lobby')" />

          <!-- Pure Ambient Light SafeHouse Prototype (Preserved) -->
          <AmbientSafeHouseProto v-else-if="currentView === 'ambient_proto'" @enter-terminal="handleView('lobby')"
            @open-stats="showStatsModal = true" @open-catalog="showCatalog = true" />

          <!-- Full Featured SafeHouse (Preserved for comparison) -->
          <SafeHouse v-else-if="currentView === 'full_safehouse'" @enter-terminal="handleView('lobby')" @back="handleView('lobby')" @sleep="handleSleepClick"
            @open-task-selector="handleOpenTaskSelector" @open-agent-modal="handleOpenAgentModal"
            @open-skill-selector="handleOpenSkillSelector" @open-stats-modal="showStatsModal = true" />

          <!-- c House View -->
          <!-- <SafeHouse v-else-if="currentView === 'home'" @back="handleView('lobby')" @sleep="handleSleepClick" @open-task-selector="handleOpenTaskSelector" /> -->

          <!-- Crypto Exchange View -->
          <CryptoExchange v-else-if="currentView === 'crypto'" @back="handleView('lobby')" />
          
          <!-- Black Market View -->
          <Shop v-else-if="currentView === 'shop'" @back="handleView('lobby')" />

          <!-- Partner Net View -->
          <PartnerNetPage v-else-if="currentView === 'partner_net'" @back="handleView('lobby')" />

          <!-- AI Nexus View -->
          <AiNexusPage v-else-if="currentView === 'ai_nexus'" @back="handleView('lobby')" />

          <!-- Module Deck View -->
          <ModuleDeckPage v-else-if="currentView === 'module_deck'" @back="handleView('lobby')" />

          <!-- Comms Inbox View -->
          <CommsInboxPage v-else-if="currentView === 'comms_inbox'" @back="handleView('lobby')" />

          <!-- Game Table View -->
          <div v-else-if="currentView === 'table'" class="game-container">
            <main>
              <PokerTable :engine="engine" @openHistory="showHistory = true" />
            </main>
            <ControlPanel v-if="engine && !engine.isSpectateMode" :engine="engine" @action="handleAction" @skill="handleSkill" />

            <!-- Phase 1: REPLAY_MODE 배너 (자동 리플레이 진행 중) -->
            <div v-else-if="engine && engine.isSpectateMode && engine.isPhase1Replay" class="spectator-control-bar font-orbitron phase1-bar">
              <div class="spectator-status-group">
                <span class="cyan glitch-small">[REPLAY_MODE]</span>
                <span class="white">PREFLOP ➔ {{ engine.capturePoint?.currentStreet || 'TURN' }}</span>
                <span class="meta-tag yellow">[WATCH_ONLY // SIMULATION_LOCKED]</span>
              </div>
              <div class="spectator-actions-group">
                <span class="replay-hint">결정적 순간까지 자동 재생 중...</span>
              </div>
            </div>

            <!-- Phase 2: DECISIVE_MOMENT — 직접 개입 또는 AI 위임 선택 -->
            <div v-else-if="engine && engine.isSpectateMode && isPhase2Ready" class="spectator-control-bar font-orbitron phase2-bar">
              <div class="spectator-status-group">
                <span class="magenta glitch-small">[DECISIVE_MOMENT // {{ engine.capturePoint?.currentStreet || 'RIVER' }}]</span>
                <span class="white">POT: <b class="yellow">${{ engine.pot?.toLocaleString() || '??' }} CR</b></span>
              </div>
              <div class="spectator-actions-group">
                <button class="btn-intervene-hook font-orbitron" @click="handleEnterPhase2">
                  <span class="btn-lbl">[ DIRECT_INTERVENE ]</span>
                </button>
                <button class="btn-leave-spectate font-orbitron" @click="handleDelegateToAI">
                  <span class="btn-lbl">[ AI_DELEGATE ]</span>
                </button>
              </div>
            </div>

            <!-- Default: Spectator Watch-Only Bar -->
            <div v-else-if="engine && engine.isSpectateMode" class="spectator-control-bar font-orbitron">
              <div class="spectator-status-group">
                <span class="cyan glitch-small">[SPECTATING_MODE]</span>
                <span class="white">HERO: <b class="yellow">{{ engine.spectateHero || 'HERO' }}</b></span>
                <span class="meta-tag cyan">[LIVE_FEED_STABLE]</span>
              </div>
              <div class="spectator-actions-group">
                <button class="btn-leave-spectate font-orbitron instant-flash-btn" @click="handleExitSpectateAndUnlock">
                  <span class="btn-lbl">[ EXIT_SPECTATE_TO_OS ] ➔</span>
                </button>
              </div>
            </div>

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
            <div class="setting-item">
              <span class="label">STACK_DISPLAY:</span>
              <button @click="store.settings.showAsBB = !store.settings.showAsBB"
                :class="{ 'is-on': store.settings.showAsBB }">
                {{ store.settings.showAsBB ? 'BIG_BLIND' : 'CURRENCY' }}
              </button>
            </div>
            <div class="setting-item">
              <span class="label">DECK_COLOR:</span>
              <button @click="store.settings.fourColorMode = !store.settings.fourColorMode"
                :class="{ 'is-on': store.settings.fourColorMode }">
                {{ store.settings.fourColorMode ? 'FOUR_COLOR' : 'STANDARD' }}
              </button>
            </div>
            <div class="setting-item">
              <span class="label">LANGUAGE:</span>
              <button @click="store.settings.language = store.settings.language === 'en' ? 'ko' : 'en'">
                {{ store.settings.language === 'en' ? 'ENGLISH' : '한국어' }}
              </button>
            </div>
            <div class="setting-item">
              <span class="label" :data-tooltip="getFastForward()">{{
                store.settings.language === 'en' ? 'FAST_FORWARD:' : 'FAST_FORWARD:' }}</span>
              <button @click="store.settings.fastFoward = !store.settings.fastFoward"
                :class="{ 'is-on': store.settings.fastFoward }">
                {{ store.settings.fastFoward ? 'ON' : 'OFF' }}
              </button>
            </div>
            <div class="setting-item">
              <span class="label">CRT_SCANLINE_FX:</span>
              <button @click="store.settings.crtEnabled = store.settings.crtEnabled === false ? true : false"
                :class="{ 'is-on': store.settings.crtEnabled !== false }">
                {{ store.settings.crtEnabled !== false ? 'ON' : 'OFF' }}
              </button>
            </div>
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
    <PlayStatsPopup :show="showStatsModal" @close="showStatsModal = false" @back="handleBackToLobby" />

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
/* Global Layout Pure Black Background Integration */
body, #app, .app-shell, .game-container, .layout-container {
  background-color: #000000 !important;
  margin: 0;
  padding: 0;
}

/* 🤖 [GRINDERS 2057] Cyberspace OS Spectator Control Bar Styling */
.spectator-control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: #080808;
  border-top: 2px solid var(--neon-cyan, #00f0ff);
  border-radius: 0px !important;
  box-shadow: 0 -4px 15px rgba(0, 240, 255, 0.15);
  margin-top: auto;
}

.spectator-status-group {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.95rem;
}

.spectator-status-group .cyan {
  color: var(--neon-cyan, #00f0ff);
  font-weight: 900;
}

.spectator-status-group .yellow {
  color: var(--neon-yellow, #ccff00);
}

.spectator-actions-group {
  display: flex;
  gap: 14px;
}

.btn-intervene-hook, .btn-leave-spectate {
  border-radius: 0px !important;
  border: 1px solid var(--neon-cyan, #00f0ff);
  background: #000000;
  color: var(--neon-cyan, #00f0ff);
  padding: 8px 18px;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.btn-intervene-hook:hover {
  background: var(--neon-cyan, #00f0ff);
  color: #000000;
  box-shadow: 0 0 10px var(--neon-cyan, #00f0ff);
}

.btn-leave-spectate {
  border-color: var(--neon-yellow, #ccff00);
  color: var(--neon-yellow, #ccff00);
}

.btn-leave-spectate:hover {
  background: var(--neon-yellow, #ccff00);
  color: #000000;
  box-shadow: 0 0 12px var(--neon-yellow, #ccff00);
}

/* Phase 1: Watch-Only Replay Banner */
.phase1-bar {
  border-top-color: var(--neon-yellow, #ccff00) !important;
  box-shadow: 0 -4px 15px rgba(204, 255, 0, 0.12);
}

/* Phase 2: Decisive Moment Action Bar */
.phase2-bar {
  border-top-color: var(--neon-magenta, #ff00cc) !important;
  box-shadow: 0 -4px 20px rgba(255, 0, 204, 0.2);
  animation: phase2-pulse 1.5s ease-in-out infinite;
}

@keyframes phase2-pulse {
  0%, 100% { box-shadow: 0 -4px 20px rgba(255, 0, 204, 0.2); }
  50% { box-shadow: 0 -4px 35px rgba(255, 0, 204, 0.45); }
}

.replay-hint {
  color: var(--neon-yellow, #ccff00);
  font-size: 0.8rem;
  opacity: 0.75;
  font-weight: 700;
}

.magenta {
  color: var(--neon-magenta, #ff00cc);
}
</style>
