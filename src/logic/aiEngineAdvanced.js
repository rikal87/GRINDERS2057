// aiEngineAdvanced.js is now a delegation wrapper for aiBrainHub.js
// and handles final action normalization and timing tells for Advanced AI players.
import { getUnifiedAction } from './aiBrainHub.js';
import { getAIChatDialogue } from './AIChatSystem.js';
export const getAdvancedAIAction = (player, engine) => {
  // [v10] Delegate to the new modular Brain Hub
  const decision = getUnifiedAction(player, engine);

  const action = {
    ...decision,
    type: decision.action || 'fold',
    amount: decision.amount || 0,
    insight: decision.insight || "Processing...",
    dialogue: decision.dialogue || '',
    exploitTrigger: decision.exploitTrigger || null,
    rangeEstimate: decision.rangeEstimate || ''
  };

  const pName = player.name.toUpperCase();
  let currentBet = engine.potManager ? engine.potManager.currentRoundBet : engine.currentRoundBet;

  // Normalization & Validation (Same as before)
  if (action.type === 'raise') {
    action.amount = Math.floor(action.amount);
    if (action.amount > player.chips + player.currentBet) {
      action.amount = player.chips + player.currentBet;
    }
    if (action.amount <= currentBet && currentBet > 0) {
      action.type = 'call';
      action.amount = currentBet;
      action.insight += " (Norm)";
    }
  } else if (action.type === 'call') {
    action.amount = engine.potManager ? engine.potManager.currentRoundBet : engine.currentRoundBet;
  } else if (action.type === 'check') {
    action.amount = 0;
  }

  if (action.type === 'raise' && action.amount >= player.chips + player.currentBet) {
    action.amount = player.chips + player.currentBet;
    action.type = 'all_in';
  }

  const activePlayersCount = engine.players.filter(p => !p.isFolded && !p.isEliminated).length;
  const isHeadsUp = activePlayersCount === 2;

  if (isHeadsUp && Math.random() < 0.25) action.dialogue = getAIChatDialogue(action.type, player.name, action.insight);

  let delay = 1000 + Math.random() * 3000;
  if (action.type === 'fold') delay = 1500 + Math.random() * 3500;
  if (engine.state === 'PREFLOP') delay /= 2;

  return { ...action, delay };
};
