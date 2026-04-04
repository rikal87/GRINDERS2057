import { PERSONALITIES } from "./dialogues/index.js";
import { getLanguage } from "./store.js";

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
