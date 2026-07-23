<template>
  <Teleport to="body">
    <div v-if="visible" class="matrix-log-fullscreen-overlay font-orbitron" @click="handleFastForward">
      <div class="matrix-scanline-bg"></div>

      <!-- Top Header Telemetry Bar -->
      <div class="matrix-hdr-bar">
        <div class="hdr-left">
          <span class="cyan glitch-small">// CYBERSPACE_SIMULATION_MATRIX_STREAM</span>
          <span class="yellow">[DAY {{ store.gameDay || 1 }} EXECUTION]</span>
        </div>
        <div class="hdr-right">
          <span class="dim">// CLICK_ANYWHERE_TO_SKIP</span>
          <button class="btn-skip-sim font-orbitron instant-flash-btn" @click.stop="closeOverlay">[ FAST_FORWARD ] ➔</button>
        </div>
      </div>

      <!-- High-Speed Terminal Log Stream Feed -->
      <div class="matrix-logs-container" ref="logContainerRef">
        <div v-for="(log, idx) in logStream" :key="idx" class="log-line" :class="log.type">
          <span class="log-time cyan">[{{ log.time }}]</span>
          <span class="log-text">{{ log.text }}</span>
        </div>
      </div>

      <!-- Frozen Interception Alert Modal Overlay (Top Z-Index Master) -->
      <div v-if="isFrozen && activeInterception" class="interception-freeze-banner fui-cctv-frame">
        <div class="freeze-hdr magenta font-orbitron">🚨 [INTERCEPTION_FREEZE // ACTION_REQUIRED]</div>
        <div class="freeze-desc white font-orbitron">{{ activeInterception.desc || activeInterception.title }}</div>
        
        <div v-if="activeInterception.type === 'BIG_POT_ALERT'" class="freeze-pot-specs">
          <span class="yellow font-orbitron">POT_AT_RISK: ${{ (activeInterception.potSize || 0).toLocaleString() }} CR ({{ activeInterception.potBb || 50 }} BB)</span>
        </div>

        <div class="freeze-actions">
          <button class="target-lockon-btn yellow-solid font-orbitron instant-flash-btn" @click.stop="handleSpectate">
            <span class="btn-txt-layer">[ 👁️ SPECTATE & INTERVENE ] ➔</span>
          </button>
          <button class="target-lockon-btn cyan-solid font-orbitron instant-flash-btn" @click.stop="handlePassInterception">
            <span class="btn-txt-layer">[ ⏩ FAST SIMULATE PASS ] ➔</span>
          </button>
        </div>
      </div>

      <!-- Bottom Progress Bar -->
      <div class="matrix-progress-bar-wrap">
        <div class="matrix-progress-bar" :style="{ width: `${simProgress}%` }"></div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, nextTick } from 'vue';
import { store } from '../logic/store.js';
import { getPartners } from '../logic/partnerSystem.js';
import { resolveActiveInterception, finalizeTurnExecution } from '../logic/timeSystem.js';
import { audioManager } from '../logic/audioManager.js';

const props = defineProps({
  visible: { type: Boolean, default: false }
});

const emit = defineEmits(['close', 'spectate', 'completed']);

const logStream = ref([]);
const simProgress = ref(0);
const isFrozen = ref(false);
const logContainerRef = ref(null);
let streamTimer = null;
let currentMinute = 0;

const activeInterception = computed(() => store.activeInterception);

const generateMockLog = (minute) => {
  const partners = (getPartners() || []).filter(p => p.status === 'GAMBLING');
  const hh = String(Math.floor(minute / 60)).padStart(2, '0');
  const mm = String(minute % 60).padStart(2, '0');
  const timeStr = `${hh}:${mm}`;

  if (partners.length === 0) {
    return {
      time: timeStr,
      text: `// SIMULATING_PASSIVE_MARKET_TICK ... NO_ACTIVE_DEPLOYS`,
      type: 'dim'
    };
  }

  const p = partners[Math.floor(Math.random() * partners.length)];
  const actions = [
    `DEALT [${['A♠', 'K♦', 'Q♥', 'J♣', '10♠'][Math.floor(Math.random() * 5)]}, ${['9♦', '8♣', '7♠'][Math.floor(Math.random() * 3)]}] @ ${p.currentLocationId || 'SECTOR_01'}`,
    `RAISE $${(Math.floor(Math.random() * 50) + 10) * 100} CR | OPPONENT -> CALL`,
    `FLOP [Q♠, J♦, 4♣] -> BET $5,000 CR`,
    `RIVER SHOWDOWN -> WON POT $${(Math.floor(Math.random() * 80) + 20) * 100} CR ♠`,
    `FOLD PREFLOP TO 3-BET`
  ];
  const act = actions[Math.floor(Math.random() * actions.length)];

  return {
    time: timeStr,
    text: `${p.name.toUpperCase()} @ ${p.currentLocationId || 'SECTOR_01'} ➔ ${act}`,
    type: act.includes('WON') ? 'yellow' : act.includes('RAISE') ? 'cyan' : 'normal'
  };
};

const startSimulationStream = () => {
  logStream.value = [];
  simProgress.value = 0;
  isFrozen.value = false;
  currentMinute = 0;
  if (streamTimer) clearInterval(streamTimer);

  const realLogs = store.currentRealHandLogStream || [];
  let logIdx = 0;

  // Immediate check for pending activeInterception or queued interception
  const pendingInterception = store.activeInterception || (store.interceptionQueue && store.interceptionQueue.length > 0 ? store.interceptionQueue.shift() : null);
  if (pendingInterception) {
    store.activeInterception = pendingInterception;
    isFrozen.value = true;
    audioManager.playSFX('alarm');
    logStream.value.push({
      time: 'ALERT',
      text: `🚨 [INTERCEPTION_TRIGGERED] ${pendingInterception.title || 'HIGH_STAKES_EVENT'}`,
      type: 'magenta'
    });
  }

  streamTimer = setInterval(() => {
    if (isFrozen.value) return;

    currentMinute += 35; // 24 hours simulation tick
    simProgress.value = Math.min(100, Math.floor((currentMinute / 1440) * 100));

    if (logIdx < realLogs.length) {
      logStream.value.push(realLogs[logIdx++]);
    } else {
      logStream.value.push(generateMockLog(currentMinute));
    }

    if (logStream.value.length > 90) logStream.value.shift();
    scrollToBottom();

    if (currentMinute >= 1440) {
      clearInterval(streamTimer);
      setTimeout(() => {
        finishStream();
      }, 400);
    }
  }, 30);
};

const scrollToBottom = () => {
  nextTick(() => {
    if (logContainerRef.value) {
      logContainerRef.value.scrollTop = logContainerRef.value.scrollHeight;
    }
  });
};

const handleFastForward = () => {
  if (isFrozen.value) return;
  finishStream();
};

const finishStream = () => {
  if (streamTimer) clearInterval(streamTimer);

  const pendingInterception = store.activeInterception || (store.interceptionQueue && store.interceptionQueue.length > 0 ? store.interceptionQueue.shift() : null);
  if (pendingInterception) {
    store.activeInterception = pendingInterception;
    isFrozen.value = true;
    audioManager.playSFX('alarm');
    logStream.value.push({
      time: 'ALERT',
      text: `🚨 [INTERCEPTION_TRIGGERED] ${pendingInterception.title || 'HIGH_STAKES_EVENT'}`,
      type: 'magenta'
    });
    scrollToBottom();
    return;
  }

  const result = finalizeTurnExecution();
  emit('completed', result?.summaryReport);
  emit('close');
};

const handleSpectate = () => {
  // Lock simulation stream and enter Phase 1 → Phase 2 Decisive Moment flow
  isFrozen.value = true;
  const target = activeInterception.value || store.activeInterception;
  resolveActiveInterception(true);

  const cp = target?.capturePoint || null;

  window.dispatchEvent(new CustomEvent('start-spectate-match', {
    detail: {
      locationId: target?.locationId || cp?.locationId || 'micro_warehouse',
      heroId: target?.partnerName || cp?.players?.[0]?.name || 'HERO',
      capturePoint: cp   // [NEW] capturePoint replaces snapshot
    }
  }));
};


const handleResumeUnlock = () => {
  console.info('🔓 [MATRIX_LOG_OVERLAY] Unlocking simulation stream and resuming scroll...');
  isFrozen.value = false;
  startSimulationStream();
};

window.addEventListener('resume-simulation-unlock', handleResumeUnlock);

onUnmounted(() => {
  if (streamTimer) clearInterval(streamTimer);
  window.removeEventListener('resume-simulation-unlock', handleResumeUnlock);
});

const handlePassInterception = () => {
  isFrozen.value = false;
  resolveActiveInterception(false);
};

const closeOverlay = () => {
  finishStream();
};

watch(() => props.visible, (val) => {
  if (val) {
    startSimulationStream();
  } else {
    if (streamTimer) clearInterval(streamTimer);
  }
});

onUnmounted(() => {
  if (streamTimer) clearInterval(streamTimer);
});
</script>

<style scoped>
.matrix-log-fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(2, 4, 6, 0.96);
  z-index: 99999;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 1.5rem 2rem;
  backdrop-filter: blur(10px);
}

.matrix-scanline-bg {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: repeating-linear-gradient(0deg, rgba(0,240,255,0.03), rgba(0,240,255,0.03) 1px, transparent 1px, transparent 2px);
  pointer-events: none;
}

.matrix-hdr-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 240, 255, 0.3);
  padding-bottom: 0.8rem;
  margin-bottom: 1rem;
  z-index: 2;
}

.btn-skip-sim {
  background: var(--neon-yellow);
  color: #000000;
  border: none;
  font-weight: 900;
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  margin-left: 1rem;
}

.matrix-logs-container {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  z-index: 2;
  padding-right: 0.5rem;
}

.log-line {
  font-size: 0.92rem;
  line-height: 1.4;
  display: flex;
  gap: 0.8rem;
}

.log-line.yellow { color: var(--neon-yellow); }
.log-line.cyan { color: var(--neon-cyan); }
.log-line.magenta { color: var(--neon-magenta); font-weight: 900; }
.log-line.dim { color: rgba(255, 255, 255, 0.4); }

.interception-freeze-banner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100000;
  width: 85%;
  max-width: 650px;
  background: #080204;
  border: 2px solid var(--neon-magenta);
  padding: 1.8rem;
  box-shadow: 0 0 40px rgba(255, 0, 85, 0.6);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  backdrop-filter: blur(12px);
}

.freeze-hdr { font-size: 1.2rem; font-weight: 900; }
.freeze-desc { font-size: 1rem; }
.freeze-actions { display: flex; gap: 1rem; }

.matrix-progress-bar-wrap {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  margin-top: 1rem;
  z-index: 2;
}

.matrix-progress-bar {
  height: 100%;
  background: var(--neon-yellow);
  transition: width 0.04s linear;
}
</style>
