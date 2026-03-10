
import { store, gainInfamy, gainSuspicion } from './store';
import { consumeStamina } from './staminaSystem';
import { processAiTasks } from './aiAgentTaskSystem';
import { sendLoreAndSpamMessage, checkMessageExpiration } from './messageSystem';
import { processEvents } from './eventSystem';
import { simulatePartnersBehavior } from './partnerSystem';

// 1 second real time = 1 minute game time
const TICKS_PER_SECOND = 1;
export const GAME_MINUTES_PER_TICK = 1;

let timerInterval = null;
let lastProcessedHour = null;

export const startTimeSystem = () => {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    // Add 1 minute (60000ms) per tick
    const oldDate = new Date(store.gameTime);
    const oldDay = oldDate.getDate();

    store.gameTime += GAME_MINUTES_PER_TICK * 60 * 1000;

    const newDate = new Date(store.gameTime);
    const newDay = newDate.getDate();

    if (oldDay !== newDay) {
      // Daily rollover logic
      processDailyDecay();
    }

    // Process AI Agent logic (LT regen, Task success check, etc.)
    processAiTasks();

    // Process global storyline / repeating events
    processEvents();

    // Check for message expiration
    checkMessageExpiration();

    // Process hourly events
    const currentHour = new Date(store.gameTime).getHours();
    if (lastProcessedHour === null) {
      lastProcessedHour = currentHour;
      simulatePartnersBehavior();
    } else if (lastProcessedHour !== currentHour) {
      lastProcessedHour = currentHour;
      simulatePartnersBehavior();
    }

    // 3% chance per game hour (60 game minutes)
    const probPerTick = 0.03 / (60 / GAME_MINUTES_PER_TICK);
    if (Math.random() < probPerTick) sendLoreAndSpamMessage();

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

export const formatGameDayOfWeek = (timestamp) => {
  const date = new Date(timestamp);
  const options = { weekday: 'short' };
  return date.toLocaleDateString(store.settings.language === 'en' ? 'en-US' : 'ko-KR', options);
}

export const getGameDay = (timestamp) => {
  const date = new Date(timestamp);
  return date.getDate(); // 1-31
}

export const advanceTime = (hours) => {
  const ticksToSimulate = Math.floor(hours * 60);
  for (let i = 0; i < ticksToSimulate; i++) {
    store.gameTime += 60 * 1000;
    processAiTasks();
    processEvents();
    checkMessageExpiration();

    const currentHour = new Date(store.gameTime).getHours();
    if (lastProcessedHour === null) {
      lastProcessedHour = currentHour;
      simulatePartnersBehavior();
    } else if (lastProcessedHour !== currentHour) {
      lastProcessedHour = currentHour;
      simulatePartnersBehavior();
    }
  }
};

const processDailyDecay = () => {
  // Infamy and Suspicion decay by 1 each day for inactive zones
  Object.keys(store.status_zone).forEach(locationId => {
    // Don't decay the current zone if player is at table
    if (window.isAtTable && window.currentLocationId === locationId) {
      return;
    }
    // if (store.status_zone[locationId].isBlacklisted) {
    //   return;
    // }
    gainInfamy(locationId, -1);
    gainSuspicion(locationId, -1);
  });
};
