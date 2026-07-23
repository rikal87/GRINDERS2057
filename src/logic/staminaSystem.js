import { store, getEffectiveMaxStamina } from './store.js';
import { audioManager } from './audioManager.js';
import { recordPlayStatsSessionForPlayer, PLAY_RECORD_STATS_TYPE } from './playRecordStats.js';
const DEPOSITION_RATE_IDLE = 2 / 60; // 2 per hour = 2/60 per minute
const DEPOSITION_RATE_TABLE = 4 / 60; // 4 per hour = 4/60 per minute

export const consumeStamina = (isAtTable = false, multiplier = 1) => {
  if (store.stamina <= 0) return;
  const rate = (isAtTable ? DEPOSITION_RATE_TABLE : DEPOSITION_RATE_IDLE) * multiplier;
  const consumed = Math.min(store.stamina, rate);
  store.stamina = Math.max(0, store.stamina - rate);
  recordPlayStatsSessionForPlayer(PLAY_RECORD_STATS_TYPE.STAMINA_CONSUMED, { amount: consumed });
};

export const recoverStamina = (amount) => {
  store.stamina = Math.min(getEffectiveMaxStamina(), store.stamina + amount);
};

export const performSleep = (advanceTimeFunc, hours = 0) => {
  const maxStaminaVal = getEffectiveMaxStamina();
  // Recovery: 10 stamina per hour
  const staminaToRecover = hours * 10;

  store.stamina = Math.min(maxStaminaVal, store.stamina + staminaToRecover);

  // Advance time
  if (advanceTimeFunc) {
    advanceTimeFunc(hours);
  }

  // Reset session stats start point
  store.statsAtWakeUp = {
    bankroll: store.bankroll,
    played_hands: store.play_stats.played_hands,
    total_earn_money: store.play_stats.total_earn_money,
    total_lost_money: store.play_stats.total_lost_money,
    max_win_pot: store.play_stats.max_win_pot
  };
  audioManager.playSFX('action-confirm');
};
