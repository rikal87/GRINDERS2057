
import { store } from './store';
import { consumeStamina } from './staminaSystem';
import { processAiTasks } from './aiTaskSystem';
import { sendLoreAndSpamMessage } from './messageSystem';

// 1 second real time = 1 minute game time
const TICKS_PER_SECOND = 1;
const GAME_MINUTES_PER_TICK = 1;

let timerInterval = null;

export const startTimeSystem = () => {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    // Add 1 minute (60000ms) per tick
    store.gameTime += GAME_MINUTES_PER_TICK * 60 * 1000;

    // Process AI Agent logic (LT regen, Task success check, etc.)
    processAiTasks();
    if (Math.random() < 1 / (GAME_MINUTES_PER_TICK * 60 * 1000)) sendLoreAndSpamMessage();
    // Consume player stamina
    // We check if the player is currently at a table (this would require checking view state or engine status)
    // For now, we can pass a simple flag or let the stamina system handle state check if possible.
    // However, App.vue has currentView.
    consumeStamina(window.isAtTable || false);

    // Check for daily rollover or other time-based events here if needed
    // processTimeBasedEvents(store.gameTime);
  }, 1000 / TICKS_PER_SECOND);
};

export const stopTimeSystem = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

export const formatGameTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatGameDate = (timestamp) => {
  const date = new Date(timestamp);
  // 2057-10-20
  return date.toISOString().split('T')[0];
}

export const getGameDay = (timestamp) => {
  const date = new Date(timestamp);
  return date.getDate(); // 1-31
}

export const advanceTime = (hours) => {
  store.gameTime += hours * 60 * 60 * 1000;
};
