<template>
  <transition name="v4-fade">
    <div v-if="show" class="v5-modal-overlay">
      <div class="v5-modal stats-modal">
        <div class="v4-label">{{ isSession ? 'SESSION_SETTLEMENT' : 'PLAY_STATS_ANALYSIS' }}</div>
        <h2 class="glitch-text" data-text="PERFORMANCE_REPORT">PERFORMANCE_REPORT</h2>

        <div class="stats-container">
          <!-- Session Result (Displayed only for session summary) -->
          <div v-if="isSession" class="stats-section summary-section">
            <div class="section-label">SESSION_RESULT</div>
            <div class="stats-grid">
              <div class="stat-entry summary-stat"><span class="label">NET PROFIT:</span>
                <span class="val" :class="sessionStats.netBB >= 0 ? 'green' : 'red'">{{ sessionStats.netBB }} BB</span>
              </div>
              <div class="stat-entry"><span class="label">GENERATED NOTORIETY:</span> <span class="val"
                  :class="sessionStats.generatedInfamy > 0 ? 'red' : 'green'">{{ sessionStats.generatedInfamy > 0
                    ? '+' : '' }}{{ sessionStats.generatedInfamy }}</span></div>
              <div class="stat-entry"><span class="label">GENERATED SUSPICION:</span> <span class="val"
                  :class="sessionStats.generatedSuspicion > 0 ? 'red' : 'green'">{{ sessionStats.generatedSuspicion > 0
                    ? '+' : '' }}{{ sessionStats.generatedSuspicion }}</span></div>
            </div>
          </div>

          <!-- Economic Stats (Global only) -->
          <div v-if="!isSession" class="stats-section">
            <div class="section-label">ECONOMIC_METRICS</div>
            <div class="stats-grid">
              <div class="stat-entry"><span class="label">TOTAL_EARNED:</span> <span class="val cyan">{{
                (store.play_stats.total_earn_money || 0n).toLocaleString() }} CR</span></div>
              <div class="stat-entry"><span class="label">TOTAL_LOST:</span> <span class="val red">{{
                (store.play_stats.total_lost_money || 0n).toLocaleString() }} CR</span></div>
              <div class="stat-entry"><span class="label">PAID_RAKE:</span> <span class="val yellow">{{
                (store.play_stats.paid_rake || 0).toLocaleString() }} CR</span></div>
              <div class="stat-entry"><span class="label">MAX_WIN_POT:</span> <span class="val white">{{
                store.play_stats.max_win_pot.toLocaleString() }} CR</span></div>
              <div class="stat-entry"><span class="label">MAX_LOSE_POT:</span> <span class="val white">{{
                store.play_stats.max_lose_pot.toLocaleString() }} CR</span></div>
            </div>
          </div>

          <!-- Behavioral Stats (HUD) -->
          <div class="stats-section">
            <div class="section-label">BEHAVIORAL_HUD {{ isSession ? "(SESSION)" : "" }}</div>
            <div class="stats-grid">
              <div class="stat-entry"><span class="label">HANDS_PLAYED:</span> <span class="val">{{
                isSession ? sessionStats.played_hands : store.play_stats.played_hands }}</span></div>
              <div class="stat-entry"><span class="label">VPIP:</span> <span class="val cyan">{{ vpip }}%</span></div>
              <div class="stat-entry"><span class="label">PFR:</span> <span class="val yellow">{{ pfr }}%</span></div>
              <div class="stat-entry"><span class="label">WTSD:</span> <span class="val white">{{ wtsd }}%</span>
              </div>
              <div class="stat-entry"><span class="label">W$SD:</span> <span class="val green">{{ wsd }}%</span></div>
            </div>
          </div>

          <!-- Luck & Performance -->
          <div v-if="!isSession" class="stats-section">
            <div class="section-label">LUCK_AND_PEAKS</div>
            <div class="stats-grid">
              <div class="stat-entry"><span class="label">BANKRUPTCY:</span> <span class="val red">{{
                store.play_stats.bankruptcy_count }}</span></div>
              <div class="stat-entry"><span class="label">MAX_STREAK (WIN):</span> <span class="val green">{{
                store.play_stats.max_win_streak }}</span></div>
              <div class="stat-entry"><span class="label">MAX_STREAK (LOSE):</span> <span class="val red">{{
                store.play_stats.max_lose_streak }}</span></div>
              <div class="stat-entry"><span class="label">BAD_BEAT_PEAK:</span> <span class="val yellow">{{
                store.play_stats.max_lose_equity.toFixed(1) }}%</span></div>
            </div>
          </div>
        </div>

        <div class="modal-actions" style="margin-top:20px">
          <button @click="handleClose" class="btn cyan">CLOSE_REPORT</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue';
import { store } from '../logic/store';

const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close']);

const isSession = computed(() => !!store.play_stats_session);
const sessionStats = computed(() => store.play_stats_session || {});

// HUD Metrics
const vpip = computed(() => {
  if (isSession.value) return sessionStats.value.vpip;
  if (!store.play_stats.played_hands) return 0;
  return ((store.play_stats.vpip_count / store.play_stats.played_hands) * 100).toFixed(1);
});

const pfr = computed(() => {
  if (isSession.value) return sessionStats.value.pfr;
  if (!store.play_stats.played_hands) return 0;
  return ((store.play_stats.pfr / store.play_stats.played_hands) * 100).toFixed(1);
});

const wtsd = computed(() => {
  if (isSession.value) return sessionStats.value.wtsd;
  if (!store.play_stats.played_hands) return 0;
  return ((store.play_stats.wtsd / store.play_stats.played_hands) * 100).toFixed(1);
});

const wsd = computed(() => {
  if (isSession.value) return sessionStats.value.wsd;
  if (!store.play_stats.wtsd) return 0;
  return ((store.play_stats.w$sd / store.play_stats.wtsd) * 100).toFixed(1);
});

const handleClose = () => {
  if (isSession.value) {
    store.play_stats_session = null;
  }
  emit('close');
};
</script>

<style scoped>
@import '../styles/components/SafeHouse.css';

.v5-modal-overlay {
  z-index: 1000;
}

.summary-section {
  background: rgba(0, 240, 255, 0.05);
  border: 1px solid rgba(0, 240, 255, 0.2);
}
.summary-stat .val {
  font-size: 1.2rem;
  font-weight: 800;
}
</style>
