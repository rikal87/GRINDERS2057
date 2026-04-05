import { PERSONALITIES } from "./dialogues/index.js";
import { getLanguage } from "./store.js";
import { CHAT_TRIGGERS } from './constants.js';

// return message(string)
export const getAIChatDialogue = (trigger = "FOLD", playerClass) => {
  // Default to VANGUARD if class not found
  const personality = PERSONALITIES[playerClass.toUpperCase()] || PERSONALITIES.VANGUARD;
  const triggerData = personality[trigger.toUpperCase()];

  if (!triggerData) return null;

  const currentLang = getLanguage() || 'ko';
  let messages = Array.isArray(triggerData) ? triggerData : (triggerData[currentLang] && triggerData[currentLang].length > 0 ? triggerData[currentLang] : triggerData['en']);

  if (!messages || messages.length === 0) return null;

  // Random selection
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

/**
 * AI Decision Engine v2 (Probabilistic Stat-Correction)
 * Integrates persona stats (AF, WTSD, vPIP) directly into probabilistic decision trees.
 */
export const chatAI = (player, trigger = CHAT_TRIGGERS.FOLD_WEAK, insight = "", duration = 0, engine = null) => {
  let safeTrigger = trigger || 'FOLD';
  if (safeTrigger.toUpperCase() === CHAT_TRIGGERS.CALL && engine) {
    const callAmt = engine.currentRoundBet - player.currentBet;
    if (callAmt === 0) {
      safeTrigger = CHAT_TRIGGERS.CHECK;
    }
  }

  const msg = getAIChatDialogue(safeTrigger.toUpperCase(), player.name.toUpperCase());

  if (player.dialogueTimeoutId) {
    clearTimeout(player.dialogueTimeoutId);
  }

  let displayDuration = duration > 0 ? duration : (2000 + (msg.length * 100));
  displayDuration = Math.min(Math.max(displayDuration, 2000), 8000);

  player.lastDialogue = msg;
  player.lastThought = insight;

  player.dialogueTimeoutId = setTimeout(() => {
    player.lastDialogue = null;
    player.lastThought = null;
    player.dialogueTimeoutId = null;
  }, displayDuration);

  return msg;
}
