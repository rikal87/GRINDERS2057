import { PERSONALITIES } from "./dialogues/index.js";
import { getLanguage } from "./store.js";
import { CHAT_TRIGGERS } from './constants.js';
import { npcMemoryManager } from './npcMemoryManager.js';
import { CONTEXTUAL_DIALOGUES } from './dialogues/contextualDialogues.js';

/**
 * Evaluates conditions against the NPC's memory.
 * @param {Object} conditions - e.g. { minHandsPlayed: 5, minNetProfitFromPlayer: 1000 }
 * @param {Object} memory - NPC memory object
 */
const evaluateConditions = (conditions, memory, playerClass) => {
  if (!conditions) return true;

  // Persona/Attitude check
  if (conditions.personaIds && Array.isArray(conditions.personaIds)) {
    if (!conditions.personaIds.includes(playerClass.toUpperCase())) return false;
  }

  if (!memory) return true;

  if (conditions.minHandsPlayed !== undefined && memory.handsPlayed < conditions.minHandsPlayed) return false;
  
  if (conditions.minNetProfitFromPlayer !== undefined && memory.netProfitFromPlayer < conditions.minNetProfitFromPlayer) return false;
  if (conditions.maxNetProfitFromPlayer !== undefined && memory.netProfitFromPlayer > conditions.maxNetProfitFromPlayer) return false;
  
  if (conditions.bustedByPlayer !== undefined && (memory.timesBustedByPlayer > 0) !== conditions.bustedByPlayer) return false;

  return true;
};

// return message(string)
export const getAIChatDialogue = (trigger = "FOLD", player) => {
  const currentLang = getLanguage() || 'ko';
  let playerClass = player.personaId ? player.personaId.toUpperCase() : player.name.toUpperCase();
  
  // 1. Check Contextual (Memory-based) Dialogues first
  const npcData = npcMemoryManager.getNPC(player.id);
  const memory = npcData ? npcData.memory : null;
  
  const candidates = CONTEXTUAL_DIALOGUES.filter(d => 
    d.trigger.toUpperCase() === trigger.toUpperCase() && 
    evaluateConditions(d.conditions, memory, playerClass)
  );

  if (candidates.length > 0) {
      // Sort by priority (highest first)
      candidates.sort((a, b) => b.priority - a.priority);
      const topPriority = candidates[0].priority;
      // Gather all candidates with the top priority
      const topCandidates = candidates.filter(c => c.priority === topPriority);
      
      const selected = topCandidates[Math.floor(Math.random() * topCandidates.length)];
      
      // Support multi-language text
      const textArray = selected.text[currentLang] || selected.text['en'];
      if (textArray && textArray.length > 0) {
        return textArray[Math.floor(Math.random() * textArray.length)];
      }
    }
  }

  // 2. Fallback to Standard Persona Dialogues
  const personality = PERSONALITIES[playerClass] || PERSONALITIES.VANGUARD;
  const triggerData = personality[trigger.toUpperCase()];

  if (!triggerData) return null;

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

  // Now we pass the entire player object instead of just the personaId
  const msg = getAIChatDialogue(safeTrigger, player);

  if (!msg) return null; // If no msg found, do nothing

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
