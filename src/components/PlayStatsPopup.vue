<template>
  <transition name="v4-fade">
    <div v-if="show" class="v5-modal-overlay">
      <div class="v5-modal stats-modal">
        <h2 class="glitch-text" data-text="PERFORMANCE_REPORT">PERFORMANCE_REPORT</h2>
        <h3 v-if="showMsg && currentStats.msgCode" class="final-message" :class="currentStats.msgCode">"{{
          getMsg(currentStats.msgCode) }}"</h3>
        <div class="stats-container">
          <!-- Economic Stats -->
          <Transition name="slide-fade">
            <div class="stats-section" v-if="showEcon">
              <div class="section-label">ECONOMIC_METRICS</div>
              <div class="stats-grid">
                <div class="stat-entry"><span class="label">NET_WINNING:</span> <span class="val"
                    :class="animatedStats.net_winning >= 0 ? 'green' : 'red'">{{
                      Math.floor(animatedStats.net_winning).toLocaleString() }} CR</span></div>
                <div class="stat-entry"><span class="label">PAID_RAKE:</span> <span class="val yellow">{{
                  Math.floor(animatedStats.paid_rake).toLocaleString() }} CR</span></div>
                <div class="stat-entry"><span class="label">MAX_WIN_POT:</span> <span class="val white">{{
                  Math.floor(animatedStats.max_win_pot).toLocaleString() }} CR</span></div>
                <div class="stat-entry"><span class="label">MAX_LOSE_POT:</span> <span class="val white">{{
                  Math.floor(animatedStats.max_lose_pot).toLocaleString() }} CR</span></div>
                <div class="stat-entry"><span class="label">NET_SHARE(Partner):</span> <span class="val"
                    :class="animatedStats.net_share >= 0 ? 'green' : 'red'">{{
                      Math.floor(animatedStats.net_share).toLocaleString() }} CR</span></div>
                <div class="stat-entry"><span class="label">ITEM_EFFECT:</span> <span class="val"
                    :class="animatedStats.item_effect >= 0 ? 'green' : 'red'">{{
                      Math.floor(animatedStats.item_effect).toLocaleString() }} CR</span></div>
              </div>
            </div>
          </Transition>
          <!-- Behavioral Stats -->
          <Transition name="slide-fade">
            <div class="stats-section" v-if="showBehav">
              <div class="section-label">BEHAVIORAL_HUD</div>
              <div class="stats-grid">
                <div class="stat-entry"><span class="label">HANDS_PLAYED:</span> <span class="val">{{
                  Math.floor(animatedStats.hands_played) }}</span></div>
                <div class="stat-entry"><span class="label">VPIP:</span> <span class="val cyan">{{ (animatedStats.vpip
                  || 0).toFixed(1) }}%</span></div>
                <div class="stat-entry"><span class="label">PFR:</span> <span class="val yellow">{{ (animatedStats.pfr
                  || 0).toFixed(1) }}%</span></div>
                <div class="stat-entry"><span class="label">WTSD:</span> <span class="val white">{{ (animatedStats.wtsd
                  || 0).toFixed(1) }}%</span>
                </div>
                <div class="stat-entry"><span class="label">W$SD:</span> <span class="val green">{{ (animatedStats.wsd
                  || 0).toFixed(1) }}%</span></div>
              </div>
            </div>
          </Transition>
          <!-- Luck & Performance -->
          <Transition name="slide-fade">
            <div class="stats-section" v-if="showLuck">
              <div class="section-label">LUCK_AND_PEAKS</div>
              <div class="stats-grid">
                <div class="stat-entry" v-if="!isSession"><span class="label">BANKRUPTCY:</span> <span
                    class="val red">{{
                      Math.floor(animatedStats.bankruptcy_count) }}</span></div>
                <div class="stat-entry"><span class="label">MAX_STREAK (WIN):</span> <span class="val green">{{
                  Math.floor(animatedStats.max_win_streak) }}</span></div>
                <div class="stat-entry"><span class="label">MAX_STREAK (LOSE):</span> <span class="val red">{{
                  Math.floor(animatedStats.max_lose_streak) }}</span></div>
                <div class="stat-entry"><span class="label">BAD_BEAT_PEAK:</span> <span class="val yellow">{{
                  (animatedStats.max_lose_equity).toFixed(1) }}%</span></div>
              </div>
            </div>
          </Transition>
          <Transition name="slide-fade">
            <!--UNLOCK NEW ITEM LAYOUT-->
          </Transition>
        </div>
        <div class="modal-actions" style="margin-top:20px">
          <button @click="handleClose" :disabled="isProcessing" class="btn cyan">CLOSE_REPORT</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { store } from '../logic/store';
import { pickRandomMessage } from '../logic/playRecordStats';
import { audioManager } from '../logic/audioManager';

const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close']);
const getMsg = (msgCode) => {
  const msgObj = pickRandomMessage(msgCode);
  if (!msgObj) return '';
  return store.settings.language === 'ko' ? msgObj.ko : msgObj.en;
}
const isSession = computed(() => !!store.play_stats_session);
const sessionStats = computed(() => store.play_stats_session || {});
const currentStats = computed(() => isSession.value ? sessionStats.value : store.play_stats);
// Animation States
const showEcon = ref(false);
const showBehav = ref(false);
const showLuck = ref(false);
const showMsg = ref(false);
const isProcessing = ref(true);
const animatedStats = ref({
  net_winning: 0,
  net_share: 0,
  total_earn_money: 0,
  total_lost_money: 0,
  paid_rake: 0,
  max_win_pot: 0,
  max_lose_pot: 0,
  hands_played: 0,
  vpip: 0,
  pfr: 0,
  wtsd: 0,
  wsd: 0,
  bankruptcy_count: 0,
  max_win_streak: 0,
  max_lose_streak: 0,
  max_lose_equity: 0,
  item_effect: 0
});

const animateValue = (key, endValue, duration) => {
  let startTimestamp = null;
  const startValue = animatedStats.value[key];

  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);

    // Ease-out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    animatedStats.value[key] = startValue + (endValue - startValue) * easeProgress;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      animatedStats.value[key] = endValue;
    }
  };
  window.requestAnimationFrame(step);
};
watch(() => props.show, (newVal) => {
  if (newVal) {
    // Reset states
    showEcon.value = false;
    showBehav.value = false;
    showLuck.value = false;
    showMsg.value = false;
    isProcessing.value = true;
    Object.keys(animatedStats.value).forEach(k => animatedStats.value[k] = 0);
    // Sequence animations
    setTimeout(() => {
      showEcon.value = true;
      animateValue('net_winning', currentStats.value.net_winning || 0, 1000);
      animateValue('paid_rake', currentStats.value.paid_rake || 0, 1000);
      animateValue('max_win_pot', currentStats.value.max_win_pot || 0, 1000);
      animateValue('max_lose_pot', currentStats.value.max_lose_pot || 0, 1000);
      animateValue('net_share', currentStats.value.net_share || 0, 1000);
      if (currentStats.value.item_effect) animateValue('item_effect', currentStats.value.item_effect || 0, 1000);
    }, 300);

    setTimeout(() => {
      showBehav.value = true;
      animateValue('hands_played', currentStats.value.hands_played || 0, 1000);
      animateValue('vpip', Number(vpipTarget.value), 1000);
      animateValue('pfr', Number(pfrTarget.value), 1000);
      animateValue('wtsd', Number(wtsdTarget.value), 1000);
      animateValue('wsd', Number(wsdTarget.value), 1000);
    }, 1300);

    setTimeout(() => {
      showLuck.value = true;
      animateValue('bankruptcy_count', currentStats.value.bankruptcy_count || 0, 1000);
      animateValue('max_win_streak', currentStats.value.max_win_streak || 0, 1000);
      animateValue('max_lose_streak', currentStats.value.max_lose_streak || 0, 1000);
      animateValue('max_lose_equity', currentStats.value.max_lose_equity || 0, 1000);
      if (!currentStats.value.msgCode) isProcessing.value = false;
    }, 2300);
    if (currentStats.value.msgCode) {
      setTimeout(() => {
        audioManager.playSFX('swoosh');
        showMsg.value = true;
        isProcessing.value = false;
      }, 4500);
    }
  }
});

// HUD Metrics
// Targets for HUD Metrics
const vpipTarget = computed(() => {
  if (!currentStats.value.hands_played) return 0;
  return ((currentStats.value.vpip_count / currentStats.value.hands_played) * 100).toFixed(1);
});

const pfrTarget = computed(() => {
  if (!currentStats.value.hands_played) return 0;
  return ((currentStats.value.pfr / currentStats.value.hands_played) * 100).toFixed(1);
});

const wtsdTarget = computed(() => {
  if (!currentStats.value.hands_played) return 0;
  return ((currentStats.value.wtsd / currentStats.value.hands_played) * 100).toFixed(1);
});

const wsdTarget = computed(() => {
  if (!currentStats.value.wtsd) return 0;
  return ((currentStats.value.w$sd / currentStats.value.wtsd) * 100).toFixed(1);
});

const handleClose = () => {
  audioManager.playSFX('ui-click');
  store.play_stats_session = null;
  setTimeout(() => {
    if (audioManager.currentZoneId.value) {
      if (isSession.value) {
        audioManager.playTrackByZoneId(audioManager.currentZoneId.value);
      }
    }
  }, 5000)
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
.LOSE_BIG {
  color: var(--neon-magenta);
}
.LOSE_MEDIUM {
  color: var(--neon-orange);
}
.LOSE_SMALL {
  color: var(--neon-yellow);
}
.WIN_BIG {
  color: var(--neon-green);
}
.WIN_MEDIUM {
  color: var(--neon-green);
}
.WIN_SMALL {
  color: var(--neon-green);
}
.final-message {
  text-align: center;
  margin-top: 15px;
  font-size: 1.1rem;
  letter-spacing: 1px;
  text-shadow: 0 0 5px currentColor;
}

/* Animations */
.slide-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.1, 0.7, 0.1, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
  filter: blur(4px);
}

.pop-in-enter-active {
  animation: pop-in-anim 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes pop-in-anim {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(20px);
    filter: blur(5px);
  }
  70% {
    transform: scale(1.1) translateY(-5px);
    filter: blur(0);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
    text-shadow: 0 0 15px currentColor, 0 0 5px currentColor;
  }
}
</style>
