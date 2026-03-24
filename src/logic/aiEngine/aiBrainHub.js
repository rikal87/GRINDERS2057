import { getPreflopAction } from './strategies/aiBrainPreflop.js';
import { getPostflopAction } from './strategies/aiBrainPostflop.js';
import { getGTOMatrix } from './tools/aiBrainRangeTool.js';

/**
 * [Hub] AI Brain Orchestrator
 * Collects state, coordinates tools, and returns final action.
 */
export function getUnifiedAction(player, engine) {
  const context = buildPokerContext(player, engine);
  let decision;
  if (context.state === 'PREFLOP') {
    decision = getPreflopAction(context);
  } else {
    decision = getPostflopAction(context);
  }

  // [v18] Normalize for Simulation Compatibility
  // The simulation expects 'type' but Brain system uses 'action'.
  return {
    type: decision.action || 'fold', // Legacy-Simulation compatibility
    action: decision.action || 'fold', // Brain system consistency
    amount: decision.amount || 0,
    insight: decision.insight || "No Insight",
    isBluffCatch: !!decision.isBluffCatch,
    exploitTrigger: decision.exploitTrigger || null
  };
}

/**
 * Normalizes game state into a standardized Context object
 * to ensure consistency across all sub-modules.
 */
function buildPokerContext(player, engine) {
  const board = engine.board || [];
  const potSize = engine.pot || 0;
  const currentBet = engine.potManager ? engine.potManager.currentRoundBet : (engine.currentRoundBet || 0);
  const callAmount = currentBet - (player.currentBet || 0);

  // Standardizing position
  const dealerIdx = engine.dealerIndex;
  const playerCount = engine.players.length;
  const playerIdx = engine.players.findIndex(p => p.id === player.id);
  const getPosName = (idx) => {
    const dist = (idx - dealerIdx + playerCount) % playerCount;
    if (playerCount === 2) return (idx === dealerIdx) ? 'SB' : 'BB';
    const posMap6 = ['BTN', 'SB', 'BB', 'UTG', 'MP', 'CO'];
    return posMap6[dist] || 'MP';
  };
  const myPos = getPosName(playerIdx);
  const myRelativeIdx = (playerIdx - (dealerIdx + 1) + playerCount) % playerCount;
  const hasPosition = engine.players
    .filter(p => !p.isFolded)
    .every(p => {
      if (p.id === player.id) return true;
      const pIdx = engine.players.findIndex(px => px.id === p.id);
      const pRelativeIdx = (pIdx - (dealerIdx + 1) + playerCount) % playerCount;
      return myRelativeIdx >= pRelativeIdx;
    });

  // Initiative & Pot Type Detection
  const preflopRaises = engine.preflopRaises || 0; // Assuming engine tracks this, if not we infer from current pot
  let potType = 'SRP';
  if (preflopRaises >= 3) potType = '4BET_POT';
  else if (preflopRaises === 2) potType = '3BET_POT';

  // Initiative: Did I make the last aggressive action preflop?
  // In the current engine, 'aggressor' often tracks the last person to raise.
  const hasInitiative = engine.aggressor === player.id;

  return {
    player,
    engine,
    matrix: getGTOMatrix(),
    state: engine.state,
    street: engine.state,
    board,
    potSize,
    currentBet,
    currentStreetRaises: engine.currentStreetRaises || 0,
    callAmount,
    myPos,
    hasPosition,
    potType,
    hasInitiative,
    actionHistory: player.actionHistory || engine.actionHistory || [],
    isCheckable: callAmount <= 0,
    alivePlayers: engine.players.filter(p => !p.isFolded).length,
    bb: engine.bb || engine.bigBlind || 2,
    getPosName
  };
}
