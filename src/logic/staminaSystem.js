import { store, getEffectiveMaxStamina, TYPE_CHANGE_BANKROLL } from './store';
import { audioManager } from './audioManager';

const DEPOSITION_RATE_IDLE = 2 / 60; // 2 per hour = 2/60 per minute
const DEPOSITION_RATE_TABLE = 4 / 60; // 4 per hour = 4/60 per minute

export const consumeStamina = (isAtTable = false) => {
  const rate = isAtTable ? DEPOSITION_RATE_TABLE : DEPOSITION_RATE_IDLE;
  // We assume this is called every game minute
  store.stamina = Math.max(0, store.stamina - rate);
};

export const recoverStamina = (amount) => {
  store.stamina = Math.min(getEffectiveMaxStamina(), store.stamina + amount);
};



export const performSleep = (advanceTimeFunc) => {
  const maxStaminaVal = getEffectiveMaxStamina();
  const staminaToRecover = maxStaminaVal - store.stamina;
  const hoursToSkip = staminaToRecover / 10;

  // Recovery
  store.stamina = maxStaminaVal;

  // Advance time
  if (advanceTimeFunc) {
    advanceTimeFunc(hoursToSkip);
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
