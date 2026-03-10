import { evaluateHand, getDrawCategory, analyzeBoardTexture, getHandCategory, getSimpleHandCategory, getStartingHandRankHeadsup, getStartingHandRank96Max } from './poker.js';
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
  const existAggressor = !!engine.aggressor;
  const isAggressor = engine.aggressor === player.id;
  // Base Bluff Frequency based on Aggression Factor
  // Scales down SHARPLY with raises to prevent suicide bluffs in high-depth spots (3-bet/4-bet+)
  let bluffFreq = ((AF - 2.5) * 0.05) / Math.pow(1.5, raises);

  if (street !== 'PREFLOP' && raises >= 1) bluffFreq *= 0.66; // Be more conservative postflop
  if (street === 'RIVER') bluffFreq *= 0.5; // River bluffs are most expensive

  // Further reduce bluff freq if facing a huge bet relative to pot (low fold equity)
  const betToPotRatio = pot > 0 ? (callAmt / pot) : 0;
  if (betToPotRatio > 0.6) bluffFreq *= 0.3; // Polarized/Large bet usually means less fold equity

  bluffFreq = Math.max(0, Math.min(0.15, bluffFreq));
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
  let drawBonus = 0;
  const streetsLeft = street === 'FLOP' ? 2 : (street === 'TURN' ? 1 : 0);
  const pfIntensity = engine.preflopRaises || 0;
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
    if (handRank <= 2) estimatedEquity = 0.95;
    else if (handRank <= 4) estimatedEquity = 0.9;
    else if (handRank <= 7) estimatedEquity = 0.85;
    else if (handRank <= 11) estimatedEquity = 0.8;
    else if (handRank <= 17) estimatedEquity = 0.7;
    else if (handRank <= 33) estimatedEquity = 0.6;
    else if (handRank <= 100) estimatedEquity = 0.5;
    else estimatedEquity = 0.3;

    if (isAdvanced) {
      if (distFromButton <= 1) estimatedEquity += 0.05;
      else if (distFromButton >= alivePlayers - 2) estimatedEquity -= 0.05;
    }

  } else {
    // Postflop
    const evaluation = evaluateHand([...player.hand, ...engine.board]);
    const drawCategory = getDrawCategory(player.hand, engine.board);

    if (isAdvanced) handCategory = getHandCategory(player.hand, engine.board, evaluation);
    else handCategory = getSimpleHandCategory(player.hand, engine.board, evaluation);

    if (handCategory === 'NUTS') estimatedEquity = 0.95;
    else if (handCategory === 'MONSTER') estimatedEquity = 0.85;
    else if (handCategory === 'STRONG') estimatedEquity = 0.7;
    else if (handCategory === 'GOOD') estimatedEquity = 0.6;
    else if (handCategory === 'MARGINAL') estimatedEquity = 0.45;
    else if (handCategory === 'WEAK') estimatedEquity = 0.2;
    else if (handCategory === 'ACE_HIGH') estimatedEquity = 0.1;
    else estimatedEquity = 0.05; // AIR

    if (drawCategory === 'DRAW_MONSTER') drawBonus = 0.25;
    else if (drawCategory === 'DRAW_STRONG') drawBonus = 0.15;
    else if (drawCategory === 'DRAW_WEAK') drawBonus = 0.08;
    // draw bonus is not increed estimatedEquity.
    drawBonus *= (streetsLeft / 2);
    estimatedEquity = Math.min(0.98, estimatedEquity + drawBonus);
    console.info(`[AI_ENGINE] ${player.name} Category: ${handCategory}, Base Eq: ${estimatedEquity}`);

    // [MOD] Intensity-based Range Differentiation (Post-flop)
    // If it was a 3-bet or 4-bet pot, we must be more cautious with medium hands


  }
  // if (pfIntensity >= 2 && street !== 'PREFLOP') {
  const isFacingAggressor = existAggressor && !isAggressor;
  // If we are facing the preflop aggressor, "Marginal" hands are likely behind their tighter range
  if (isFacingAggressor && estimatedEquity <= 0.5 && pfIntensity >= 2) {
    const penalty = (pfIntensity === 2) ? 0.1 : 0.2; // 10% for 3-bet, 20% for 4-bet+
    estimatedEquity -= penalty;
    insight += ` [Intensity Adj: -${(penalty * 100).toFixed(0)}%]`;
  }
  // }
  // Adjust equity based on short stack aggressiveness
  estimatedEquity = Math.min(0.99, estimatedEquity * (multiplier > 1 ? (1 + (multiplier - 1) * 0.2) : 1));
  estimatedEquity = Math.max(0, estimatedEquity); // Ensure non-negative

  // --- Calculate Aggression Thresholds ---
  const totalPotAfterCall = (pot || 0) + callAmt;
  let potOdds = callAmt > 0 ? (callAmt / totalPotAfterCall) : 0;
  let requiredEquity = potOdds;


  // --- 4. Strategy Selection ---
  let strategy = "STANDARD";
  const aggressorIdx = engine.players.findIndex(p => p.id === engine.aggressor);
  const myPos = (playerIdx - dealerIdx + playerCount - 1) % playerCount;
  const aggPos = (aggressorIdx - dealerIdx + playerCount - 1) % playerCount;
  const isIP = myPos > aggPos;

  // [NEW] Detect if the aggressor has "lost" the initiative by checking back a previous street
  let leadLost = !existAggressor;
  // if (existAggressor && !isAggressor && engine.handHistory) {
  //   const aggName = engine.players[aggressorIdx]?.name;
  //   if (aggName) {
  //     // Find the last action by the aggressor in hand history
  //     const aggActions = engine.handHistory.filter(h => h.includes(`${aggName}:`));
  //     const lastAggAction = aggActions[aggActions.length - 1] || "";
  //     // If their last action was a check (and it's not the current street we're checking), they lost lead
  //     if (lastAggAction.includes("Checks") && !lastAggAction.includes(`[${street}]`)) {
  //       leadLost = true;
  //     }
  //   }
  // }

  if (callAmt > 0) {
    if (street === 'PREFLOP' && raises === 0) {
      strategy = "OPENER"; // Classification: First in preflop is an OPEN (even if calling blinds)
    } else {
      strategy = "RESPONSE"; // Facing a bet/raise
    }
  } else {
    // [MOD] Position-Aware Aggression Logic
    if (existAggressor && !isAggressor) {
      if (isIP || leadLost) {
        strategy = "OPENER"; // Aggressor checked to us IP, OR they lost initiative by checking previous street

      } else {
        strategy = "DONK_AVOIDER"; // OOP against aggressor, trap-check
      }
    } else if (isAggressor) {
      strategy = "C_BETTER"; // Continuing aggression
    } else {
      strategy = "OPENER"; // First to act in open pot
    }
  }

  // Set thresholds based on strategy
  let raiseEquityThreshold = requiredEquity + 0.35;
  if (strategy === "RESPONSE") {
    // Standard required equity based on pot odds
    raiseEquityThreshold = requiredEquity + 0.45;
    if ((street === 'TURN' || street === 'RIVER') && !isAggressor) {
      raiseEquityThreshold -= 0.15; // Easier to check-raise/defend on later streets
    }
    // High Aggression with Monsters: Lower threshold to ensure we don't just call
    if (handCategory === 'MONSTER' || handCategory === 'NUTS') {
      raiseEquityThreshold -= 0.2;
    }

    // [MOD] Buffer raise threshold in high-intensity pots
    if ((engine.preflopRaises || 0) >= 2) {
      raiseEquityThreshold += 0.15; // Require more "certainty" to raise back in a 3-bet/4-bet pot
    }

    insight += " [Strategy: RESPONSE]";
  } else if (strategy === "DONK_AVOIDER") {
    // Default to checking for Traps.
    // Flop: Only lead with literal NUTS (1.1+ base). Force MONSTER hands (Sets, etc) to Trap-Check.
    // if (street === 'FLOP') raiseEquityThreshold = 1.1;
    if (street === 'RIVER') raiseEquityThreshold = 0.7;
    else raiseEquityThreshold = 1.1;
    // else raiseEquityThreshold = 0.7;
    insight += " [Strategy: DONK_AVOIDER]";
  } else {
    // OPENER or C_BETTER
    raiseEquityThreshold = 0.45; // Standard buffer for leading
    if (strategy === "C_BETTER" && street === 'FLOP') raiseEquityThreshold -= 0.1;

    // [MOD] Preflop Opener: Buff aggression for strong hands
    if (street === 'PREFLOP' && strategy === 'OPENER') {
      if (estimatedEquity >= 0.6) raiseEquityThreshold -= 0.1;
    }

    insight += ` [Strategy: ${strategy}]`;
  }

  // Multi-way penalty
  if (alivePlayers > 2) {
    const multiWayFactor = (street === 'PREFLOP') ? 0.02 : 0.05;
    requiredEquity += (alivePlayers - 2) * multiWayFactor;
  }
  if (player.class.id.toUpperCase() === 'GAMBLER') {
    const addBonus = drawBonus > 0.0 ? .1 : 0;
    estimatedEquity = Math.min(0.98, estimatedEquity + addBonus);
  }

  // Global adjustments
  if (street === 'PREFLOP') {
    raiseEquityThreshold += (2.5 - AF) * 0.3;
  } else {
    raiseEquityThreshold += (2.5 - AF) * (0.3 - (pfIntensity * .1));
  }
  let raisePenalty = 0;
  if (raises > 0) {
    if (raises === 1) raisePenalty = 0.07; // Softened penalty for the first bet (C-bet response)
    else raisePenalty = Math.pow(1.15, raises) - 1; // Keep original curve for multi-raises
  }
  raiseEquityThreshold += raisePenalty;
  requiredEquity += raisePenalty;

  let wtsdBoost = 0.3 - (street === 'PREFLOP' ? vPIP : wtsd);
  if (street === 'FLOP' || street === 'PREFLOP') requiredEquity += wtsdBoost;

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
  const isVirtuallyCommitted = callAmt > 0 && (
    (player.chips <= ((engine.bb || 10) * 2)) ||
    (player.chips / (pot + player.chips) < 0.1)
  );

  if (isVirtuallyCommitted) {
    requiredEquity = 0;
    insight += " [V-Committed]";
  }
  if (callAmt >= player.chips) bluffFreq = 0;

  // Final Cap and safety
  raiseEquityThreshold = Math.min(0.95, raiseEquityThreshold);
  requiredEquity = Math.min(0.8, requiredEquity); // dont fold monster

  const catLabel = handCategory ? ` (${handCategory})` : '';
  insight += ` [Eq:${(estimatedEquity * 100).toFixed(0)}% / C-Req:${(requiredEquity * 100).toFixed(0)}% / B-Req:${(raiseEquityThreshold * 100).toFixed(0)}%]${catLabel}`;

  let action = 'fold';
  if (estimatedEquity >= raiseEquityThreshold) {
    // [FIX] Relax Call Huge threshold preflop to prevent limping strong hands
    const callHugeThreshold = street === 'PREFLOP' ? 0.55 : 0.4;
    if (potOdds > callHugeThreshold && street !== 'RIVER' && estimatedEquity < 0.85) {
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
        const mult = Math.max(raises > 3 ? 9999 : 2.2, 4.5 - raises);
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
          amount = Math.round(openSize + (limpers * bb) + bb);
        } else {
          amount = Math.round(openSize);
        }
      }
    } else {
      let potPct = 0.70;
      potPct -= streetsLeft * .15;

      if (boardAnalysis.type === 'DRY') potPct -= 0.15;

      const rnd = Math.random()
      const baseOnEq = estimatedEquity >= requiredEquity ? estimatedEquity : requiredEquity
      if (baseOnEq >= 0.80 && rnd <= bluffFreq) {
        potPct += estimatedEquity * (boardAnalysis.type === 'WET' ? 1 : 0.5);
      } else if (estimatedEquity >= 0.70 && rnd <= bluffFreq) {
        potPct += estimatedEquity - .55
      }

      if (street === 'FLOP') potPct = Math.max(0.6, potPct)
      else if (street === 'TURN') potPct = Math.max(1.2, potPct)

      // [2] BET Sizing
      if (callAmt > 0) {
        let mult = Math.max(raises > 2 ? 9999 : 2.2, 3.5 - raises);
        amount = Math.floor(currentBet * (mult + potPct));
        amount = Math.max(amount, currentBet * 2);
      } else {
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
