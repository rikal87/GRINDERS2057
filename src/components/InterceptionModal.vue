<template>
  <div v-if="interception" class="interception-modal-overlay">
    <div class="interception-modal-content fui-cctv-frame">
      
      <!-- Top Alert Header Bar -->
      <div class="alert-hdr-bar">
        <span class="pulse-neon-cyan font-orbitron">[INTERCEPTION_INTERRUPT // DAY_0{{ store.gameDay || 1 }}]</span>
        <span class="magenta blink-fast font-orbitron">🔴 REC // SIGNAL_INTERCEPTED</span>
      </div>

      <!-- Main Interception Title & Event Info -->
      <div class="interception-hero-block">
        <div class="event-type-badge font-orbitron" :class="interception.type === 'BIG_POT_ALERT' ? 'yellow-solid' : 'magenta-solid'">
          {{ interception.title || '🚨 EMERGENCY_INTERCEPT_EVENT' }}
        </div>
        
        <h1 class="target-partner-hero font-orbitron">
          SUBJECT: {{ interception.partnerName || 'MAX' }}
        </h1>
        
        <p class="event-desc-text">
          {{ interception.desc }}
        </p>

        <!-- Pot Details if Big Pot Alert -->
        <div v-if="interception.type === 'BIG_POT_ALERT'" class="pot-specs-box">
          <div class="spec-row">
            <span class="lbl cyan font-orbitron">TOTAL_POT_AT_RISK:</span>
            <span class="val yellow font-orbitron">${{ (interception.potSize || 35000).toLocaleString() }} CR <small class="cyan">({{ interception.potBb || 50 }} BB)</small></span>
          </div>
          <div class="spec-row">
            <span class="lbl cyan font-orbitron">ESTIMATED_WIN_PROB:</span>
            <span class="val cyan font-orbitron">{{ Math.round((interception.winProbability || 0.65) * 100) }}%</span>
          </div>
        </div>
      </div>

      <!-- 2-Executive Interception Action Buttons -->
      <div class="interception-actions-grid">
        <!-- Option A: Spectate & Intervene -->
        <button class="target-lockon-btn yellow-solid font-orbitron instant-flash-btn" @click="handleAction(true)">
          <span class="btn-txt-layer">[ 👁️ SPECTATE & INTERVENE ] ➔</span>
        </button>

        <!-- Option B: Fast Simulate Pass -->
        <button class="target-lockon-btn cyan-solid font-orbitron instant-flash-btn" @click="handleAction(false)">
          <span class="btn-txt-layer">[ ⏩ FAST SIMULATE PASS ] ➔</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { store } from '../logic/store.js';
import { resolveActiveInterception } from '../logic/timeSystem.js';
import { audioManager } from '../logic/audioManager.js';

const interception = computed(() => store.activeInterception);

const emit = defineEmits(['spectate', 'resolved']);

const handleAction = (shouldSpectate) => {
  audioManager.playSFX('ui-click');
  
  if (shouldSpectate) {
    const targetInterception = interception.value || store.activeInterception;
    console.info('🚀 [DIRECT_SPECTATE_HIGHWAY] Triggering spectate join for:', targetInterception);
    
    // Resolve active interception state in store
    resolveActiveInterception(true);

    // Dispatch direct global event to App.vue bypassing nested Vue emits
    window.dispatchEvent(new CustomEvent('direct-spectate-join', {
      detail: {
        locationId: targetInterception?.locationId || 'micro_warehouse',
        tableSize: 6,
        isSpectateMode: true,
        spectateHero: targetInterception?.partnerName || 'Max',
        snapshot: targetInterception?.snapshot || null
      }
    }));
  } else {
    // Pass action: resolve interception standardly via timeSystem.js
    const result = resolveActiveInterception(false);
    if (!result || !result.hasInterception) {
      emit('resolved', result?.summaryReport);
    }
  }
};
</script>

<style scoped>
@import '../assets/fonts/pretendard-std.css';
@import '../assets/css/theme-os.css';

.cyan { color: var(--neon-cyan) !important; }
.yellow { color: var(--neon-yellow) !important; }
.magenta { color: var(--neon-magenta) !important; }

.interception-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 1.5rem;
}

.interception-modal-content {
  width: 600px;
  max-width: 90vw;
  background: #000000;
  border: 2px solid var(--neon-magenta);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.alert-hdr-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
  font-weight: 900;
  padding: 0.4rem 0.8rem;
  background: rgba(255, 0, 92, 0.1);
}

.interception-hero-block {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.event-type-badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  font-size: 0.82rem;
  font-weight: 900;
  width: fit-content;
}

.yellow-solid { background: var(--neon-yellow); color: #000000 !important; }
.magenta-solid { background: var(--neon-magenta); color: #ffffff !important; }

.target-partner-hero {
  font-size: 2rem;
  font-weight: 900;
  margin: 0;
  color: #ffffff;
}

.event-desc-text {
  font-size: 0.95rem;
  color: #c0d0e0;
  margin: 0;
  line-height: 1.5;
}

.pot-specs-box {
  background: #04080c;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 0.4rem;
}

.spec-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 900;
}

.interception-actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 0.5rem;
}

.target-lockon-btn {
  border: none;
  padding: 1rem;
  font-weight: 900;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.target-lockon-btn.cyan-solid { background: var(--neon-cyan); color: #000000 !important; }

@media (max-width: 600px) {
  .interception-actions-grid { grid-template-columns: 1fr; }
}
</style>
