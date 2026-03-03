<template>
  <transition name="v4-fade">
    <div v-if="show" class="v5-modal-overlay">
      <div class="v5-modal stats-modal">
        <h2 class="glitch-text" data-text="PERFORMANCE_REPORT">PERFORMANCE_REPORT</h2>
        <h3 v-if="currentStats.msgCode" :class="currentStats.msgCode">"{{ getMsg(currentStats.msgCode) }}"</h3>
        <div class="stats-container">
          <!-- Economic Stats -->
          <div class="stats-section">
            <div class="section-label">ECONOMIC_METRICS</div>
            <div class="stats-grid">
              <div class="stat-entry"><span class="label">TOTAL_EARNED:</span> <span class="val cyan">{{
                (currentStats.total_earn_money || 0n).toLocaleString() }} CR</span></div>
              <div class="stat-entry"><span class="label">TOTAL_LOST:</span> <span class="val red">{{
                (currentStats.total_lost_money || 0n).toLocaleString() }} CR</span></div>
              <div class="stat-entry"><span class="label">PAID_RAKE:</span> <span class="val yellow">{{
                (currentStats.paid_rake || 0).toLocaleString() }} CR</span></div>
              <div class="stat-entry"><span class="label">MAX_WIN_POT:</span> <span class="val white">{{
                (currentStats.max_win_pot || 0).toLocaleString() }} CR</span></div>
              <div class="stat-entry"><span class="label">MAX_LOSE_POT:</span> <span class="val white">{{
                (currentStats.max_lose_pot || 0).toLocaleString() }} CR</span></div>
            </div>
          </div>
          <!-- Behavioral Stats -->
          <div class="stats-section">
            <div class="section-label">BEHAVIORAL_HUD</div>
            <div class="stats-grid">
              <div class="stat-entry"><span class="label">HANDS_PLAYED:</span> <span class="val">{{
                currentStats.hands_played }}</span></div>
              <div class="stat-entry"><span class="label">VPIP:</span> <span class="val cyan">{{ vpip }}%</span></div>
              <div class="stat-entry"><span class="label">PFR:</span> <span class="val yellow">{{ pfr }}%</span></div>
              <div class="stat-entry"><span class="label">WTSD:</span> <span class="val white">{{ wtsd }}%</span>
              </div>
              <div class="stat-entry"><span class="label">W$SD:</span> <span class="val green">{{ wsd }}%</span></div>
            </div>
          </div>
          <!-- Luck & Performance -->
          <div class="stats-section">
            <div class="section-label">LUCK_AND_PEAKS</div>
            <div class="stats-grid">
              <div class="stat-entry" v-if="!isSession"><span class="label">BANKRUPTCY:</span> <span class="val red">{{
                currentStats.bankruptcy_count }}</span></div>
              <div class="stat-entry"><span class="label">MAX_STREAK (WIN):</span> <span class="val green">{{
                currentStats.max_win_streak }}</span></div>
              <div class="stat-entry"><span class="label">MAX_STREAK (LOSE):</span> <span class="val red">{{
                currentStats.max_lose_streak }}</span></div>
              <div class="stat-entry"><span class="label">BAD_BEAT_PEAK:</span> <span class="val yellow">{{
                (currentStats.max_lose_equity || 0).toFixed(1) }}%</span></div>
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
import { pickRandomMessage } from '../logic/playRecordStats';
const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close']);
const getMsg = (msgCode) => {
  return store.settings.language === 'ko' ? pickRandomMessage(msgCode).ko : pickRandomMessage(msgCode).en;
}
const isSession = computed(() => !!store.play_stats_session);
const sessionStats = computed(() => store.play_stats_session || {});
const currentStats = computed(() => isSession.value ? sessionStats.value : store.play_stats);

// HUD Metrics
const vpip = computed(() => {
  if (!currentStats.value.hands_played) return 0;
  return ((currentStats.value.vpip_count / currentStats.value.hands_played) * 100).toFixed(1);
});

const pfr = computed(() => {
  if (!currentStats.value.hands_played) return 0;
  return ((currentStats.value.pfr / currentStats.value.hands_played) * 100).toFixed(1);
});

const wtsd = computed(() => {
  if (!currentStats.value.hands_played) return 0;
  return ((currentStats.value.wtsd / currentStats.value.hands_played) * 100).toFixed(1);
});

const wsd = computed(() => {
  if (!currentStats.value.wtsd) return 0;
  return ((currentStats.value.w$sd / currentStats.value.wtsd) * 100).toFixed(1);
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
.lose_big {
  color: var(--neon-megenta);
}
.lose_medium {
  color: var(--neon-orange);
}
.lose_small {
  color: var(--neon-yellow);
}
.win_big {
  color: var(--neon-green);
}
.win_medium {
  color: var(--neon-green);
}
.win_small {
  color: var(--neon-yellow);
}
</style>
