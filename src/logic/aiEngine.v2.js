import { evaluateHand, getDrawCategory, analyzeBoardTexture, getHandCategory, getSimpleHandCategory, getStartingHandRankHeadsup, getStartingHandRank96Max } from './poker.js';
import { getAIChatDialogue } from './AIChatSystem.js';
import { CHAT_TRIGGERS } from './constants.js'

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

export const getAIAction = (player, engine) => {
  let decision = getProbabilisticAction(player, engine);
  const action = {
    type: decision.action || 'fold',
    amount: decision.amount || 0,
    delay: decision.delay || 1000,
    insight: decision.insight || "",
    dialogue: decision.dialogue || ""
  };

  // Safety Layer
  if (action.type === 'raise') {
    let currentBet = engine.potManager ? engine.potManager.currentRoundBet : engine.currentRoundBet;
    action.amount = Math.floor(action.amount);
    if (action.amount > player.chips + player.currentBet) {
      action.amount = player.chips + player.currentBet;
    }
    if (action.amount <= currentBet && currentBet > 0) {
      action.type = 'call';
      action.amount = currentBet;
    }
  }
  if (action.type === 'raise' && action.amount >= player.chips + player.currentBet) {
    action.amount = player.chips + player.currentBet;
    action.type = 'all_in';
  }

  if (Math.random() < 0.25 + (player.isDrunken ? 0.25 : 0)) {
    let dialogueTrigger = action.type.toUpperCase();
    if (dialogueTrigger === 'CALL' && (engine.currentRoundBet - player.currentBet) === 0) dialogueTrigger = 'CHECK';
    action.dialogue = getAIChatDialogue(dialogueTrigger, player.name, action.insight);
  }
  if (engine.state === 'PREFLOP') action.delay /= 2;
  return action;
};

const getRankVal = c => '23456789TJQKA'.indexOf(c[0]);

function getProbabilisticAction(player, engine) {
  const street = (engine.state || '').toUpperCase()
  const streetsLeft = street === 'FLOP' ? 2 : (street === 'TURN' ? 1 : 0);
  const pfIntensity = engine.preflopRaises || 0;
  const callAmt = engine.currentRoundBet - player.currentBet;
  const pot = engine.pot;
  const AF = player.class?.AF || 2;
  const vPIP = player.class?.vPIP || 0.5;
  const WTSD = player.class?.WTSD || 0.5;

  const raises = engine.currentStreetRaises || 0;
  let insight = "";
  const isAdvanced = player.isAdvanced;
  const playerIdx = engine.players.findIndex(p => p.id === player.id);
  const dealerIdx = engine.dealerIndex;
  const playerCount = engine.players.length;
  const spr = pot > 0 ? (player.chips / pot) : 20;

  // --- 1. Evaluate Estimated Equity ---
  let estimatedEquity = 0;
  let handRank = 169;
  let afMod = 0;
  if (street === 'PREFLOP') {
    const alivePlayers = engine.players.filter(p => !p.isFolded).length;
    handRank = (player.chips <= 30 * (engine.bb || 10) || alivePlayers <= 2)
      ? getStartingHandRankHeadsup(player.hand)
      : getStartingHandRank96Max(player.hand);
    // vPIP Fold Check

    estimatedEquity = 1 - (handRank / 169);
    // Explicit Tiers for consistency
    if (handRank <= 2) estimatedEquity = 0.9;
    else if (handRank <= 4) estimatedEquity = 0.8;
    else if (handRank <= 7) estimatedEquity = 0.7;
    else if (handRank <= 11) estimatedEquity = 0.6;
    else if (handRank <= 17) estimatedEquity = 0.55;
    else if (handRank <= 33) estimatedEquity = 0.5;
    else if (handRank <= 41) estimatedEquity = 0.45;
    else if (handRank <= 55) estimatedEquity = 0.4;
    else if (handRank <= 80) estimatedEquity = 0.35;
    else if (handRank <= 100) estimatedEquity = 0.3;
    else estimatedEquity = 0.25;

    if (isAdvanced) {
      const distFromBtn = (dealerIdx - playerIdx + playerCount) % playerCount;
      if (distFromBtn <= 1) estimatedEquity += 0.05;
      else if (distFromBtn >= alivePlayers - 2) estimatedEquity -= 0.05;
    }

  } else {
    const evaluation = evaluateHand([...player.hand, ...engine.board]);
    const handCategory = isAdvanced ? getHandCategory(player.hand, engine.board, evaluation) : getSimpleHandCategory(player.hand, engine.board, evaluation);

    if (handCategory === 'NUTS') estimatedEquity = 0.95;
    else if (handCategory === 'MONSTER') estimatedEquity = 0.85;
    else if (handCategory === 'STRONG') estimatedEquity = 0.7;
    else if (handCategory === 'GOOD') estimatedEquity = 0.6;
    else if (handCategory === 'MARGINAL') estimatedEquity = 0.5;
    else if (handCategory === 'BOARD_CHOP') estimatedEquity = 0.5;
    else if (handCategory === 'WEAK') estimatedEquity = .2;
    else if (handCategory === 'ACE_HIGH') estimatedEquity = .1;
    else if (handCategory === 'AIR') estimatedEquity = .05;

    const drawCategory = getDrawCategory(player.hand, engine.board);
    let drawBonus = 0;
    if (drawCategory === 'DRAW_MONSTER') drawBonus = 0.7;
    else if (drawCategory === 'DRAW_STRONG') drawBonus = 0.5;
    else if (drawCategory === 'DRAW_WEAK') drawBonus = 0.3;
    if (player.class.id.toUpperCase() === 'GAMBLER') drawBonus *= 1.2 // they like to draw bonus more 
    if (AF >= 3) afMod = drawBonus;
    drawBonus *= (streetsLeft / 2);
    estimatedEquity = Math.max(estimatedEquity, drawBonus);
  }

  const totalPotAfterCall = pot + callAmt;
  const potOdds = callAmt > 0 ? (callAmt / totalPotAfterCall) : 0;

  // --- 2.5 Strategy Selection (Ported from v1) ---
  const isAggressor = (player.id === engine.aggressor);
  const aggressorIdx = engine.players.findIndex(p => p.id === engine.aggressor);
  const myPos = (playerIdx - dealerIdx + playerCount - 1) % playerCount;
  const aggPos = (aggressorIdx - dealerIdx + playerCount - 1) % playerCount;
  const isIP = myPos > aggPos;

  let strategy = "OPENER";
  if (callAmt > 0) {
    strategy = "RESPONSE";
  } else if (street !== 'PREFLOP' && engine.aggressor && !isAggressor) {
    if (!isIP && raises === 0) strategy = "DONK_AVOIDER";
    else strategy = "OPENER";
  } else if (isAggressor) {
    strategy = "C_BETTER";
  }

  // --- 3. Probabilistic Action Selection ---
  let action = 'fold';
  let continueProb = 0;
  let raiseProb = 0;
  let rangePower = 1.0;

  if (street === 'PREFLOP') {
    // [v15.6] True Range-Based Participation
    const handPercentile = handRank / 169;

    // Binary-like multiplier: 1.0 if inside range, steep 20x drop-off outside
    const inRange = handPercentile <= vPIP;
    rangePower = inRange ? 1.0 : Math.max(0, 1.0 - (handPercentile - vPIP) * 20);

    // Facing raises shrinks the effective play probability (Intensity)
    // raises=0 (Open): 0.9, raises=1 (Call/3B): 0.6, raises>=2 (4B+): 0.35
    // Passive players (low AF) call more against a single raise (loose-passive style)
    const raiseCallIntensity = AF >= 3.0 ? 0.65 : Math.min(0.90, 0.65 + (3.0 - AF) * 0.15);
    const intensity = (raises >= 3) ? 0.25 : (raises >= 2 ? 0.45 : (raises >= 1 ? raiseCallIntensity : 0.95));
    continueProb = rangePower * intensity;
    // [v15.8] Garbage Raise Mitigation: Couple raiseProb with rangePower

    // Premium Safety (AK, JJ+ Protection)
    if (estimatedEquity >= 0.7 && callAmt > 0 && raises <= 5) {
      continueProb = Math.max(continueProb, 0.92);
    }
  } else {
    // [v15] Simplified Protection Model
    const perceivedEq = estimatedEquity + (WTSD - 0.33) * 0.8;

    // Linear Interaction (Unified 1.5x scaling, minimal 0.1 base)
    continueProb = 0.1 + (perceivedEq * 1.5);

    // Protection Floor (The "Life Line" for Top Pair+)
    if (estimatedEquity >= 0.45) {
      const baseProt = (street === 'FLOP' ? 0.90 : 0.70);
      const pressure = Math.min(0.5, potOdds) * 0.6;
      continueProb = Math.max(continueProb, baseProt - pressure);
    }
  }

  // Common Adjustments
  raiseProb = Math.min(0.95, (AF + afMod - 2) * (street === 'PREFLOP' ? 0.1 : 0.05) + estimatedEquity);
  if (street === 'PREFLOP') {
    if (estimatedEquity >= 0.55) raiseProb *= 1.2;
    else if (estimatedEquity >= 0.3 && raises > 2) raiseProb = 0;
    else if (estimatedEquity < 0.3) raiseProb = 0;
  } else {
    // [v16.0] Deep Stack (High SPR) Value Building
    // If SPR is high and we have equity, we should build the pot more aggressively
    if ((estimatedEquity >= 0.5 && isAggressor) || (estimatedEquity >= 0.6 && !isAggressor)) {
      const potBuildBoost = Math.min(spr * 0.05, 0.3);
      raiseProb += potBuildBoost;
      insight += ` [SPR-Build: +${potBuildBoost.toFixed(2)}]`;
    }
  }

  const boardAnalysis = analyzeBoardTexture([...engine.board]);
  const boardRanks = engine.board.map(c => '23456789TJQKA'.indexOf(c[0]));

  // Board Texture (Post-flop only)
  if (isAdvanced && street !== 'PREFLOP') {
    const highCardCount = boardRanks.filter(r => r >= 9).length;
    if (isAggressor && street === 'FLOP') {
      raiseProb += (highCardCount * 2) - (boardRanks.length * .05);
    } else if (!isAggressor && boardAnalysis.type === 'WET') {
      raiseProb += 0.05;
    }
    if (street === 'RIVER' && estimatedEquity < 0.6) raiseProb *= 0.66;
  }

  // Pot Odds Pressure (v15.1 Floor Erosion)
  if (callAmt > 0) {
    let floorMult = (estimatedEquity <= 0.35) ? 0.2 : 0.45;
    // Eroding floor for weak hands on later streets
    if (estimatedEquity <= 0.35 && street !== 'FLOP' && street !== 'PREFLOP') floorMult = 0.1;

    const pFloorMult = (street === 'PREFLOP' ? 0.2 : floorMult);
    let oddsBasedProb = (estimatedEquity / Math.max(0.01, potOdds)) * pFloorMult;

    // [v16.1] Junk Mitigation: Range-gate the pot-odds floor preflop
    if (street === 'PREFLOP') oddsBasedProb *= rangePower;

    continueProb = Math.max(continueProb, oddsBasedProb);

    if (estimatedEquity < potOdds) continueProb *= 0.8; // v15.2 Tightened from 0.8
  }

  continueProb = Math.min(0.96, continueProb); // Strict realistic cap

  // Strategy Bias
  if (strategy === "DONK_AVOIDER") {
    if (callAmt === 0) raiseProb *= 0.1;
    insight += " [Donk Avoid]";
  } else if (["C_BETTER", "OPENER"].includes(strategy) && street !== "PREFLOP") {
    raiseProb = Math.min(1.0, raiseProb + 0.15);
  } else if (strategy === "RESPONSE" && estimatedEquity >= 0.85 && street === 'FLOP') {
    if (Math.random() <= 0.65 || raises >= 2) raiseProb = 0; // Trap
  }


  // Multi-way penalty
  const alivePlayers = engine.players.filter(p => !p.isFolded || p.chips >= engine.bb * 20).length;
  if (alivePlayers > 2 && street === 'PREFLOP') {
    const multiWayFactor = 0.05;
    const penalty = (alivePlayers - 2) * multiWayFactor;
    raiseProb -= penalty;
  }
  // [v15.8] Multi-bet penalty for raiseProb (steeper for preflop)
  // const raiseDecayBase = 0.8;
  raiseProb *= Math.pow(street === 'PREFLOP' ? 0.8 : 0.6, raises);
  raiseProb = Math.max(0, Math.min(1.0, raiseProb));

  // Final Action Logic
  const rnd = Math.random();
  if (boardAnalysis.type === 'WET' && street === 'RIVER' && estimatedEquity <= 0.3) raiseProb *= 1.3; //bluff
  // [v15.7] No Limp Rule: aggressive personas (AF >= 3.0) play raise-or-fold preflop
  const isAggressive = AF >= 3.0;
  const bbPos = (dealerIdx + 2) % playerCount;
  const isBBOption = (street === 'PREFLOP' && raises === 0 && playerIdx === bbPos);
  const isVirtuallyCommitted = callAmt > 0 && (
    (player.chips <= ((engine.bb || 10) * 2)) ||
    (player.chips / (Number(pot) + Number(player.chips)) < 0.1)
  );
  if (isVirtuallyCommitted) {
    if (estimatedEquity >= 0.3 || streetsLeft > 0) {
      continueProb = 1;
      raiseProb = 0;
      insight += " [V-Committed]";
    } else {
      // Fold complete trash (AIR) even if committed
      insight += " [V-Committed-Fold]";
    }
  }
  if (callAmt === 0) {
    if (street === 'PREFLOP' && isAggressive && !isBBOption) {
      // Aggressive persona: raise-or-fold only (no limping)
      if (rnd <= continueProb) {
        action = 'raise'; insight += ` (Raise: ${(raiseProb * 100).toFixed(0)}%)`;
      } else {
        action = 'fold'; insight += ` (Prob-Fold: ${((1 - continueProb) * 100).toFixed(0)}%)`;
      }
    } else {
      if (rnd <= raiseProb) {
        action = 'raise'; insight += ` (Raise: ${(raiseProb * 100).toFixed(0)}%)`;
      } else {
        action = 'call'; insight += " (Check)";
      }
    }
  } else {
    if (rnd <= continueProb) {
      if (Math.random() <= raiseProb) {
        action = 'raise'; insight += ` (Prob-Raise: ${(raiseProb * 100).toFixed(0)}%)`;
      } else if (street === 'PREFLOP' && raises === 0 && isAggressive) {
        // [v15.9] Aggressive Isolation: TAG/LAG should raise (isolate) instead of fold if in-range
        action = 'raise'; insight += ` (Isolate: LAG)`;
      } else {
        action = 'call';
        const totalCallProb = continueProb * (1 - raiseProb);
        insight += ` (Prob-Call: ${(totalCallProb * 100).toFixed(0)}%)`;
      }
    } else {
      action = 'fold'; insight += ` (Prob-Fold: ${((1 - continueProb) * 100).toFixed(0)}%)`;
    }
  }

  // --- 4. Sizing (Sync with original engine) ---
  let amount = 0;
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
        if (callers > 0) baseAmount += (callers * currentBet);
        amount = Math.floor(baseAmount);
      } else {
        // [2] Open raise / Limp response
        const bb = engine.bb || 10;
        const openSize = bb * 2.2;
        const blindMoney = bb * 1.5;
        const limperMoney = Math.max(0, pot - blindMoney);
        const limpers = Math.floor(limperMoney / bb);
        if (limpers > 0) amount = Math.round(openSize + (limpers * bb) + bb);
        else amount = Math.round(openSize);
      }
    } else {
      let potPct = 0.70;
      potPct -= streetsLeft * .15;
      if (boardAnalysis.type === 'DRY') potPct -= 0.15;

      const rndS = Math.random()
      const baseOnEq = estimatedEquity >= potOdds ? estimatedEquity : potOdds
      if (baseOnEq >= 0.80 && rndS <= 0.3) {
        potPct += estimatedEquity * (boardAnalysis.type === 'WET' ? 1 : 0.5);
      } else if (estimatedEquity >= 0.70 && rndS <= 0.3) {
        potPct += estimatedEquity - .55
      }

      if (street === 'FLOP') potPct = Math.max(0.6, potPct)

      if (callAmt > 0) {
        let mult = Math.max(raises > 2 ? 9999 : 1) + Math.pow(2, raises);
        amount = Math.floor(currentBet * (mult + potPct));
        amount = Math.max(amount, currentBet * 2);
      } else {
        amount = Math.floor(pot * potPct);
        // [v16.1] Sizing Floor for Post-flop streets (Avoid tiny bets in large pots)
        if (street === 'RIVER') amount = Math.max(amount, Math.floor(pot * 0.30));
        else if (street === 'TURN') amount = Math.max(amount, Math.floor(pot * 0.25));
        else if (street === 'FLOP') amount = Math.max(amount, Math.floor(pot * 0.20));
        amount = Math.max(amount, (engine.bb || 10));
      }
    }
  }
  // --- 6. Timing Tells ---
  let delay = 1000 + Math.random() * 2000;
  const equityDiff = Math.abs(estimatedEquity - continueProb);

  if (estimatedEquity >= raiseProb + 0.15) {
    if (Math.random() < 0.3) delay = 600; else delay = 2000 + Math.random() * 1500;
  } else if (equityDiff < 0.10) {
    delay = 2000 + Math.random() * 3000;
  } else if (action === 'fold' && estimatedEquity < continueProb - 0.20) {
    delay = 500 + Math.random() * 300;
  }
  if (action === 'raise' && estimatedEquity < continueProb) {
    if (Math.random() < 0.5) delay = 2000 + Math.random() * 2000;
    else delay = 1300;
  }
  insight += ` [Cont-P:${(continueProb * 100).toFixed(0)}% Raise-P:${(raiseProb * 100).toFixed(0)}% Eq:${(estimatedEquity * 100).toFixed(0)}%] `;

  return {
    action,
    amount: action === 'raise' ? amount : (action === 'call' ? engine.currentRoundBet : 0),
    insight,
    delay
  };
}