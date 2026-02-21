import { PERSONALITIES } from "./persona.js";


// return message(string)
export const getAIChatDialogue = (trigger = "FOLD", playerClass) => {
  // Default to VANGUARD if class not found
  const personality = PERSONALITIES[playerClass.toUpperCase()] || PERSONALITIES.VANGUARD;
  const messages = personality[trigger.toUpperCase()];

  if (!messages || messages.length === 0) return null;

  // Random selection
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};
