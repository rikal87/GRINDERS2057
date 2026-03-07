import { evaluateHand, getDrawCategory, getStartingHandRank, analyzeBoardTexture, getSimpleHandCategory, getStartingHandRankHeadsup, getStartingHandRank96Max } from './poker.js';
// import { LLMService } from './llmService.js';
import { getAIChatDialogue, } from './AIChatSystem.js';
import { CHAT_TRIGGERS } from './constants.js'

/**
 * AI Decision Engine (LLM Integrated)
 * Now delegates Prompt Construction & Schema to LLMService.
 */
export const chatAI = (player, trigger = CHAT_TRIGGERS.FOLD_WEAK, insight = "", duration = 0) => {
  const safeTrigger = trigger || 'FOLD'; // Fallback if undefined
  const msg = getAIChatDialogue(safeTrigger.toUpperCase(), player.name.toUpperCase());
  console.log(`[AI_CHAT] ${player.name} ${safeTrigger.toUpperCase()}: ${msg}`);

  if (player.dialogueTimeoutId) {
    clearTimeout(player.dialogueTimeoutId);
  }

  // Dynamic duration calculation: Base 2500ms + 50ms per character
  // Cap at 7000ms max to prevent it from getting stuck forever.
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
export const getAIAction = (player, engine) => {
  let decision = getHeuristicFallback(player, engine);
  // Process Decision
  const action = {
    type: decision.action || 'fold',
    amount: decision.amount || 0,
    delay: decision.delay || 1000,
    insight: decision.insight || "",
    dialogue: decision.dialogue || ""
  };

  // Safety Layer: Ensure 'raise' actually increases the bet
  if (action.type === 'raise') {
    // [SAFETY] Ensure raise is valid and INT
    let currentBet = engine.potManager ? engine.potManager.currentRoundBet : engine.currentRoundBet;
    // [FIX] Handle Float Issues
    action.amount = Math.floor(action.amount);
    // Cap at chips
    if (action.amount > player.chips + player.currentBet) {
      action.amount = player.chips + player.currentBet;
    }
    // [FIX] Demote to CALL if amount <= currentBet (e.g. All-In but not enough to raise, or logic error)
    if (action.amount <= currentBet && currentBet > 0) {
      action.type = 'call';
      action.amount = currentBet;
      // If we intended to raise but were forced to call, update insight
      action.insight += " (Downgraded to Call)";
    }
  }
  // [NEW] Global All-In Check
  // If the determined amount puts us all_in (or more), switch action to 'all_in'
  if (action.type === 'raise' && action.amount >= player.chips + player.currentBet) {
    action.amount = player.chips + player.currentBet;
    action.type = 'all_in';
  }
  if (Math.random() < 0.25) action.dialogue = getAIChatDialogue(action.type, player.name, action.insight);
  if (engine.state === 'PREFLOP') action.delay /= 2; // if preflop, faster decision
  return action;
};

/**
 * Heuristic Fallback (Moved from LLMService.mockDecision)
 */
function getHeuristicFallback(player, engine) {
  const callAmt = engine.currentRoundBet - player.currentBet;
  const pot = engine.pot;
  const AF = player.class?.AF || 1;
  const street = (engine.state || '').toUpperCase()
  let handCategory = 'AIR';
  const raises = engine.currentStreetRaises || 0;
  let dialogue = "";
  let amount = 0;
  let insight = "";
  const vPIP = player.class.vPIP || 0.5;
  const wtsd = player.class.WTSD || 0.5;
  const isAdvanced = player.isAdvanced;
  const playerIdx = engine.players.findIndex(p => p.id === player.id);
  const dealerIdx = engine.dealerIndex;
  const playerCount = engine.players.length;
  const startingStack = player.chips + player.totalWagered;

  // Base Bluff Frequency based on Aggression Factor
  let bluffFreq = (AF - 2.5) * 0.1 + 0.05;
  let multiplier = 1.0;
  const distFromButton = (dealerIdx - playerIdx + playerCount) % playerCount;

  // Short stack Strategy (Multiplies effective equity logic)
  if (player.chips < 40 * (engine.bb || 10)) {
    multiplier = (engine.bb || 10) * 40 / player.chips;
  }
  if (raises > 0 && isAdvanced) multiplier -= Math.min(1, 1 - (3.5 - AF));

  const alivePlayers = engine.players.filter(p => !p.isFolded).length;

  // --- 0. Evaluate Estimated Equity ---
  let estimatedEquity = 0;
  let handRank = 169;
  let drawInfo = { draws: [] };
  let drawBonus = 0;
  const streetsLeft = street === 'FLOP' ? 2 : (street === 'TURN' ? 1 : 0);

  if (street === 'PREFLOP') {
    if (isAdvanced && (player.chips <= 30 * (engine.bb || 10) || alivePlayers <= 2)) {
      handRank = getStartingHandRankHeadsup(player.hand);
    } else {
      handRank = getStartingHandRank96Max(player.hand);
    }

    const percentile = 1 - (handRank / 169);
    estimatedEquity = percentile;

    // vPIP Fold Check
    let vPIPThreshold = 1 - vPIP;
    if (callAmt > 0) {
      if (percentile < vPIPThreshold) {
        return { action: 'fold', amount: 0, insight: `vPIP Fold (Eq: ${(estimatedEquity * 100).toFixed(0)}%)` };
      }
    }
    if (handRank <= 2) estimatedEquity = 0.9;
    else if (handRank <= 4) estimatedEquity = 0.8;
    else if (handRank <= 7) estimatedEquity = 0.7;
    else if (handRank <= 11) estimatedEquity = 0.6;
    else if (handRank <= 13) estimatedEquity = 0.55;
    else if (handRank <= 33) estimatedEquity = 0.5;
    else if (handRank <= 100) estimatedEquity = 0.4;
    else estimatedEquity = 0.35;

    if (isAdvanced) {
      if (distFromButton <= 1) estimatedEquity += 0.05;
      else if (distFromButton >= alivePlayers - 2) estimatedEquity -= 0.05;
    }

  } else {
    // Postflop
    const evaluation = evaluateHand([...player.hand, ...engine.board]);
    const drawCategory = getDrawCategory(player.hand, engine.board);
    handCategory = getSimpleHandCategory(player.hand, engine.board, evaluation);

    if (handCategory === 'NUTS') estimatedEquity = 0.95;
    else if (handCategory === 'MONSTER') estimatedEquity = 0.85;
    else if (handCategory === 'STRONG') estimatedEquity = 0.70;
    else if (handCategory === 'GOOD') estimatedEquity = 0.55;
    else if (handCategory === 'MARGINAL') estimatedEquity = 0.40;
    else if (handCategory === 'WEAK') estimatedEquity = 0.20;
    else if (handCategory === 'ACE_HIGH') estimatedEquity = 0.10;
    else estimatedEquity = 0.05; // AIR

    if (drawCategory === 'DRAW_MONSTER') drawBonus = 0.25;
    else if (drawCategory === 'DRAW_STRONG') drawBonus = 0.15;
    else if (drawCategory === 'DRAW_WEAK') drawBonus = 0.05;

    drawBonus *= (streetsLeft / 2);
    estimatedEquity = Math.min(0.98, estimatedEquity + drawBonus);
    console.info(`[AI_ENGINE] ${player.name} Category: ${handCategory}, Base Eq: ${estimatedEquity}`);
  }

  // Adjust equity based on short stack aggressiveness
  estimatedEquity = Math.min(0.99, estimatedEquity * (multiplier > 1 ? (1 + (multiplier - 1) * 0.2) : 1));

  // --- Calculate Aggression Thresholds ---
  const totalPotAfterCall = (pot || 0) + callAmt;
  let potOdds = callAmt > 0 ? (callAmt / totalPotAfterCall) : 0;
  let requiredEquity = potOdds;
  let raiseEquityThreshold = requiredEquity + 0.3;

  const existAggressor = !!engine.aggressor;
  const isAggressor = engine.aggressor === player.id;

  if (isAdvanced && isAggressor && street === 'FLOP') {
    raiseEquityThreshold -= 0.1; // C-Bet lighter
  }

  // Multi-way penalty
  if (alivePlayers > 2) {
    const multiWayFactor = (street === 'PREFLOP') ? 0.02 : 0.05;
    requiredEquity += (alivePlayers - 2) * multiWayFactor;
  }

  raiseEquityThreshold += (3 - AF) * 0.1;

  let wtsdBoost = 0.3 - (street === 'FLOP' ? wtsd : vPIP);
  if (street === 'FLOP') requiredEquity += wtsdBoost;

  if (player.class.id.toUpperCase() === 'GAMBLER') {
    const addBonus = drawBonus > 0.0 ? .1 : 0;
    estimatedEquity = Math.min(0.98, estimatedEquity + addBonus);
  }

  if (callAmt > 0) {
    requiredEquity += raises * 0.12;
    raiseEquityThreshold += raises * 0.16;
  }

  const commitmentRatio = startingStack > 0 ? (player.totalWagered / startingStack) : 0;
  const spr = pot > 0 ? (player.chips / pot) : 20;

  if (isAdvanced) {
    if (spr < 1.5) {
      requiredEquity *= 0.8;
    } else if (spr > 10) {
      requiredEquity *= 1.1;
      if (street !== 'RIVER') bluffFreq += 0.05;
    }
  }

  const boardAnalysis = analyzeBoardTexture(engine.board);

  if (isAdvanced) {
    const highCardCount = boardAnalysis.ranks ? boardAnalysis.ranks.filter(r => r >= 9).length : 0;
    const lowCardCount = boardAnalysis.ranks ? boardAnalysis.ranks.filter(r => r < 9).length : 0;
    if (isAggressor) {
      if (street === 'FLOP') {
        const bluffMod = (highCardCount * 2) - lowCardCount * .05;
        bluffFreq += bluffMod;
      }
    } else {
      if (boardAnalysis.type === 'WET') bluffFreq += 0.05;
    }
    if (street === 'TURN') bluffFreq *= 0.66;
  }

  if (existAggressor && street !== 'PREFLOP') {
    raiseEquityThreshold *= (1.1 + streetsLeft);
  }

  const isVirtuallyCommitted = callAmt > 0 && (
    (player.chips <= ((engine.bb || 10) * 2)) ||
    (player.chips / (pot + player.chips) < 0.1)
  );

  if (isVirtuallyCommitted) {
    requiredEquity = 0;
    insight += " [V-Committed]";
  } else {
    if (commitmentRatio > 0.35) {
      requiredEquity *= Math.max(0, 1 - (commitmentRatio * 0.5));
      insight += ` [Commt ${(commitmentRatio * 100).toFixed(0)}%]`;
    }
  }

  if (callAmt >= player.chips) bluffFreq = 0;

  insight += ` [Eq:${(estimatedEquity * 100).toFixed(0)}% / Req:${(requiredEquity * 100).toFixed(0)}%]`;
  insight += ` [Eq:${(estimatedEquity * 100).toFixed(0)}% / Req:${(requiredEquity * 100).toFixed(0)}%]`;

  let action = 'fold';
  if (estimatedEquity >= raiseEquityThreshold) {
    if (potOdds > 0.4 && street !== 'RIVER' && estimatedEquity < 0.85) {
      action = 'call'; insight += " (Call Huge)";
    } else {
      action = 'raise'; insight += " (Value Raise)";
    }
  } else if (estimatedEquity >= requiredEquity) {
    action = 'call'; insight += " (Call Odds)";
  } else {
    // Bluffing
    const rnd = Math.random();
    if (isAdvanced && rnd < bluffFreq / 2 && street === 'RIVER') {
      action = 'raise'; amount = player.chips + 10000; insight += " (River Shove Bluff)";
    } else if (rnd < bluffFreq) {
      action = 'raise'; insight += " (Pure Bluff)";
    } else {
      action = 'fold'; insight += " (Fold)";
    }
  }

  if (handCategory === 'BOARD_CHOP') {
    action = 'call'; insight = "Board Chop";
  }

  // --- 5. Sizing ---
  if (action === 'raise') {
    let currentBet = engine.currentRoundBet || 0;
    if (street === 'PREFLOP') {
      const bb = engine.bb || 10;
      if (raises > 0) {
        // [1] Against raise (3-Bet / Squeeze)
        const mult = Math.max(2.2, 4.5 - raises);
        let baseAmount = currentBet * mult;

        const blindMoney = bb * 1.5;
        const deadMoney = blindMoney + currentBet;
        const callers = Math.max(0, Math.round((pot - deadMoney) / currentBet));

        if (callers > 0) {
          baseAmount += (callers * currentBet);
        }
        amount = Math.floor(baseAmount);
      } else {
        // [2] Open raise / Limp response
        const openSize = bb * 2.2;
        const blindMoney = bb * 1.5;
        const limperMoney = Math.max(0, pot - blindMoney);
        const limpers = Math.floor(limperMoney / bb);

        if (limpers > 0) {
          amount = Math.floor(openSize + (limpers * bb) + bb);
        } else {
          amount = Math.floor(openSize);
        }
      }
    } else {
      // [2] Postflop Sizing
      if (callAmt > 0) {
        let mult = Math.max(2.2, 4.5 - raises);
        amount = Math.floor(currentBet * mult);
        amount = Math.max(amount, currentBet * 2);
      } else {
        let potPct = 0.5;
        if (street === 'TURN') potPct += 0.25;
        if (boardAnalysis.type === 'DRY') potPct -= 0.15;
        else if (boardAnalysis.type === 'WET') potPct += 0.25;
        if (estimatedEquity < requiredEquity && drawBonus > 0) potPct += 0.20;

        if (street === 'RIVER') {
          if (estimatedEquity >= 0.70) {
            potPct = AF * 0.1 + 0.7 + Math.max(0, estimatedEquity - 0.7);
          } else if (isAdvanced && Math.random() < 0.2) {
            potPct = AF * 0.1 + 0.7 + Math.max(0, requiredEquity - 0.7);
          } else {
            potPct = AF * 0.1 + 0.7;
          }
        }
        amount = Math.floor(pot * potPct);
        amount = Math.max(amount, (engine.bb || 10));
      }
    }
  }

  // --- 6. Timing Tells ---
  let delay = 1000 + Math.random() * 2000;
  const equityDiff = Math.abs(estimatedEquity - requiredEquity);

  if (estimatedEquity >= raiseEquityThreshold + 0.15) {
    if (Math.random() < 0.3) delay = 500; else delay = 2000 + Math.random() * 1500;
  } else if (equityDiff < 0.10) {
    delay = 2000 + Math.random() * 3000;
  } else if (action === 'fold' && estimatedEquity < requiredEquity - 0.20) {
    delay = 500 + Math.random() * 300;
  }

  if (action === 'raise' && estimatedEquity < requiredEquity) {
    if (Math.random() < 0.5) delay = 2000 + Math.random() * 2000;
    else delay = 1300;
  }

  return {
    action,
    amount: action === 'raise' ? amount : (action === 'call' ? engine.currentRoundBet : 0),
    insight: insight + ` (d:${Math.floor(delay)}ms)`,
    dialogue,
    delay
  };
}
