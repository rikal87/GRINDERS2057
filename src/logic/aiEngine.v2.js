import { evaluateHand, getDrawCategory, analyzeBoardTexture, getHandCategory, getSimpleHandCategory, getStartingHandRankHeadsup, getStartingHandRank96Max, getHandTierHeuristic } from './poker.js';

export const getAIAction = (player, engine) => {
  let decision = getProbabilisticAction(player, engine);
  const action = {
    action: decision.action || 'fold',
    type: decision.action || 'fold', // Legacy support
    amount: decision.amount || 0,
    delay: decision.delay || 1000,
    insight: decision.insight || "",
    dialogue: decision.dialogue || ""
  };
  player.currentEquity = decision.estimatedEquity || 0; // [NEW] Store for showdown reaction logic

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

  const activePlayersCount = engine.players.filter(p => !p.isFolded && !p.isEliminated).length;
  const isHeadsUp = activePlayersCount === 2;

  if (isHeadsUp && Math.random() < 0.25 + (player.isDrunken ? 0.25 : 0)) {
    let dialogueTrigger = action.type.toUpperCase();
    if (dialogueTrigger === 'CALL' && (engine.currentRoundBet - player.currentBet) === 0) dialogueTrigger = 'CHECK';

    const eq = decision.estimatedEquity || 0;
    const raises = decision.raises || 0;

    if (dialogueTrigger === 'CALL') {
      if (eq < 0.4) dialogueTrigger = 'CALL_WEAK';
      else if (eq >= 0.7) dialogueTrigger = 'CALL_GOOD';
    } else if (dialogueTrigger === 'RAISE') {
      // raises is engine.currentStreetRaises
      if (raises > 1) dialogueTrigger = 'RERAISE'; // 4-bet+
      else if (raises === 1) dialogueTrigger = 'RAISE'; // 3-bet or raise over bet
      else if (engine.currentStreet !== 'PREFLOP') dialogueTrigger = 'BET'; // First bet
    } else if (dialogueTrigger === 'FOLD') {
      if (eq >= 0.6) dialogueTrigger = 'FOLD_STRONG';
    } else if (dialogueTrigger === 'CHECK') {
      if (decision.isIP) dialogueTrigger = 'CHECK_GOOD';
    }

    action.dialogueTrigger = dialogueTrigger;
  }
  if (engine.state === 'PREFLOP') action.delay /= 2;
  return action;
};



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

    // Safety Fallback: If rank is worst (169) but we have a pair or AK, something is wrong with lookup
    if (handRank >= 160) {
      const r1 = player.hand[0][0];
      const r2 = player.hand[1][0];
      if (r1 === r2 || (r1 === 'A' || r2 === 'A')) {
        // Force a better rank for obvious premiums if lookup failed
        handRank = (r1 === r2) ? 50 : 80;
      }
    }
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
    else estimatedEquity = 0.4; // NORMAL/WEAK base

    player.handCategory = 'PRE_HAND';
    player.handTier = getHandTierHeuristic(player.hand, [], 'PREFLOP');
  } else {
    const evaluation = evaluateHand([...player.hand, ...engine.board]);
    const handCategory = isAdvanced && street === 'RIVER' ? getHandCategory(player.hand, engine.board, evaluation).category : getSimpleHandCategory(player.hand, engine.board, evaluation);

    if (handCategory === 'NUTS') estimatedEquity = 0.98;
    else if (handCategory === 'MONSTER') estimatedEquity = 0.85;
    else if (handCategory === 'STRONG') estimatedEquity = 0.7;
    else if (handCategory === 'GOOD') estimatedEquity = 0.6;
    else if (handCategory === 'MARGINAL') estimatedEquity = 0.5;
    else if (handCategory === 'BOARD_CHOP') estimatedEquity = 0.5;
    else if (handCategory === 'WEAK') estimatedEquity = .2;
    else if (handCategory === 'ACE_HIGH') estimatedEquity = .1;
    else if (handCategory === 'AIR') estimatedEquity = .05;

    player.handCategory = handCategory;
    player.handTier = getHandTierHeuristic(player.hand, engine.board, street, evaluation);

    const drawCategory = getDrawCategory(player.hand, engine.board);
    let drawBonus = 0;
    if (drawCategory === 'DRAW_MONSTER') drawBonus = 0.7;
    else if (drawCategory === 'DRAW_STRONG') drawBonus = 0.5;
    else if (drawCategory === 'DRAW_WEAK') drawBonus = 0.3;
    if (player.personaId.toUpperCase() === 'GAMBLER') drawBonus *= 1.2 // they like to draw bonus more 
    if (AF >= 3) afMod = drawBonus;
    drawBonus *= (streetsLeft / 2);
    estimatedEquity = Math.max(estimatedEquity, drawBonus);

    // Update tier if draw is strong
    if (drawBonus >= 0.7) player.handTier = 'MONSTER_DRAW';
  }

  const totalPotAfterCall = pot + callAmt;
  const potOdds = callAmt > 0 ? (callAmt / totalPotAfterCall) : 0;

  // --- 2.5 Position & Strategy Selection ---
  const getRelativePos = (idx) => {
    const pos = (idx - dealerIdx + playerCount) % playerCount;
    return pos === 0 ? playerCount : pos;
  };
  const lastActiveIdx = engine.players.reduce((maxIdx, p, idx) => {
    if (p.isEliminated || p.isFolded) return maxIdx;
    const pPos = getRelativePos(idx);
    const maxPos = (maxIdx === -1) ? -1 : getRelativePos(maxIdx);
    return pPos > maxPos ? idx : maxIdx;
  }, -1);
  const isIP = (playerIdx === lastActiveIdx);
  const isAggressor = (player.id === engine.aggressor);

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

    // [v16.6] Facing 3-Bets+ shrinks the effective play probability (Exponential Intensity)
    // Only apply when raises >= 2 (Facing a 3-bet or 4-bet, not just a standard open raise)
    const personalityBonus = (AF * 0.05) + (vPIP * 0.2);

    let intensity = 1.0;
    if (raises >= 2) {
      // Adjusted so a 3-bet (raises = 2) applies the first level of exponential decay
      intensity = Math.pow(0.7, raises - 1) + personalityBonus;
      intensity = Math.max(0.2, Math.min(0.95, intensity));
    }
    continueProb = rangePower * intensity;
    // [v15.8] Garbage Raise Mitigation: Couple raiseProb with rangePower

    // Premium Safety (AK, JJ+ Protection)
    if (estimatedEquity >= 0.7 && raises <= 5) {
      continueProb = Math.max(continueProb, estimatedEquity >= 0.9 ? 1.0 : 0.98); 
    }
  } else {
    // [v16.9] Pure Equity + WTSD Personality Scaling
    let wtsdBonus = (WTSD - 0.2) * 2; // Tight bots (<0.25) get negative/zero, Stations get huge bonus
    // Calculate how 'decent' the hand is.
    // 0.0 for Garbage (Eq <= 0.25), 1.0 for Decent (Eq >= 0.45)
    const decentHandFactor = Math.max(0, Math.min(1, (estimatedEquity - 0.1) / 0.10));

    // Apply the factor
    wtsdBonus *= decentHandFactor;

    // Direct mapping to true equity, no 1.5x artificial inflation
    continueProb = estimatedEquity + wtsdBonus;

    // Universal Pot Odds Pressure (Only apply if facing a bet)
    if (callAmt > 0) {
      let universalPressure = potOdds * 0.5; // Scaled down penalty
      if (estimatedEquity >= 0.5) universalPressure *= 0.5; // Half pressure for decent hands
      continueProb = Math.max(0.05, continueProb - universalPressure);
    }

    // Protection Floor (The "Life Line" for Top Pair+)
    if (estimatedEquity >= 0.1) {
      // [v16.10] WTSD +12% Goal: Add a strong stickiness boost specifically for decent hands
      // Flop gets the most leeway (+0.30), Turn (+0.20), River (+0.10)
      const baseProt = (streetsLeft + 1) * 0.1 + estimatedEquity;
      // Higher equity = lower pressure intimidation (Halved for decent hands to increase stickiness!)
      // const pressureMult = Math.max(0.1, (1.0 - estimatedEquity) * 0.5);
      const pressureMult = Math.max(0.1, (1.0 - estimatedEquity) * (1.0 - wtsdBonus));
      const floorPressure = Math.min(0.5, potOdds) * pressureMult;
      continueProb = Math.max(continueProb, baseProt - floorPressure);
    }
  }

  // Common Adjustments
  let baseAF = (AF + afMod - 2.5) * 0.05; // Restored afMod so 'draw bonuses' still trigger aggression
  raiseProb = Math.min(0.95, estimatedEquity + (street === 'PREFLOP' ? baseAF * 2 : baseAF));
  if (street === 'PREFLOP') {
    if (estimatedEquity >= 0.55) raiseProb *= 1.2;
    else if (estimatedEquity >= 0.3 && raises > 1) raiseProb = 0;
    else if (estimatedEquity < 0.3) raiseProb = 0;
  } else {
    // [v16.0] Deep Stack (High SPR) Value Building
    // If SPR is high and we have equity, we should build the pot more aggressively
    if ((estimatedEquity >= 0.6 && isAggressor) || (estimatedEquity >= 0.7 && !isAggressor)) {
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
      raiseProb += 0.2;
    }
    if (street === 'RIVER' && estimatedEquity < 0.6) raiseProb *= 0.5;
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
    // if (estimatedEquity < potOdds) continueProb *= 0.8; // v15.2 Tightened from 0.8
  }

  // 수학적 확률 오류(> 100%)로 비정상적인 로그(음수 확률 등)가 나오는 것을 막는 안전장치
  continueProb = Math.min(1.0, Math.max(0.0, continueProb));
  // Multi-way penalty
  const alivePlayers = engine.players.filter(p => !p.isFolded || p.chips >= engine.bb * 20).length;
  if (alivePlayers > 2 && street === 'PREFLOP') {
    const multiWayFactor = 0.05;
    const penalty = (alivePlayers - 2) * multiWayFactor;
    raiseProb -= penalty;
  }

  // Strategy Bias
  if (strategy === "DONK_AVOIDER") {
    if (callAmt === 0) raiseProb *= 0.1;
    insight += " [Donk Avoid]";
  } else if (["C_BETTER", "OPENER"].includes(strategy) && street !== "PREFLOP") {
    raiseProb = Math.min(1.0, raiseProb + 0.15);
  } else if (strategy === "RESPONSE") {
    if (estimatedEquity >= 0.85 && street === 'FLOP') {
      if (Math.random() <= 0.65 || raises >= 2) raiseProb = 0; // Trap
      insight += " [Pot control]";
    }
    if (callAmt === 0 && isAdvanced) raiseProb *= 1.5; // if c-better or opener is not bet, raise more
  }
  // [v15.8] Multi-bet penalty for raiseProb (steeper for preflop)
  // const raiseDecayBase = 0.8;
  raiseProb *= Math.pow(['PREFLOP', 'RIVER'].includes(street) ? 0.8 : 0.6, raises);
  raiseProb = Math.max(0, Math.min(1.0, raiseProb));

  // Final Action Logic
  const rnd = Math.random();
  if (boardAnalysis.type === 'WET' && street === 'RIVER' && estimatedEquity <= 0.3) raiseProb *= 1.3; //bluff
  // [v15.7] No Limp Rule: aggressive personas (AF >= 3.0) play raise-or-fold preflop
  const isAggressive = AF >= 3.0;
  const bbPos = (dealerIdx + 2) % playerCount;
  const isBBOption = (street === 'PREFLOP' && raises === 0 && playerIdx === bbPos);
  // [v5.6] Improved Pot-Committed Detection
  // 1. 3BB or less is a short-stack emergency
  // 2. If stack is < 15% of the total pot (after call), we are mathematically committed
  const isVirtuallyCommitted = callAmt > 0 && (
    (player.chips <= ((engine.bb || 10) * 3)) ||
    (player.chips / (Number(pot) + Number(callAmt)) < 0.15)
  );

  if (isVirtuallyCommitted) {
    // Street-specific "No Hope" escape hatch
    // River: Never fold if committed. Turn: Need ~15% Eq. Flop: Need ~25% Eq or meaningful potential.
    const commitFloor = (street === 'FLOP' ? 0.25 : (street === 'TURN' ? 0.15 : 0.05));

    if (estimatedEquity >= commitFloor) {
      // continueProb = 1.0; // Stay in!
      estimatedEquity = 1.0;
      raiseProb = 0;
      insight += ` [V-Committed: ${street}]`;
    } else {
      // Even if committed, don't throw away the last chips with 0% hope on the flop/turn
      continueProb *= 0.4; // Return to probabilistic logic, heavily biased towards fold
      insight += ` [V-Committed-Fold-Escape: Eq ${estimatedEquity.toFixed(2)}]`;
    }
  }
  if (callAmt === 0) {
    if (street === 'PREFLOP' && isAggressive && !isBBOption) {
      // Aggressive persona: raise-or-fold only (no limping)
      if (rnd <= continueProb) {
        action = 'raise'; insight += ` (Raise: ${(raiseProb * 100).toFixed(0)}%)`;
      } else if (['MONSTER', 'STRONG'].includes(player.handTier)) {
        // [FIX] 강한 핸드인데 레이즈 확률에 실패했다면 최소한 콜(Limp)이라도 합니다 (폴드 방지)
        action = 'call'; insight += ` (Fallback-Call: Strong)`;
      } else {
        action = 'fold'; insight += ` (Prob-Fold: ${((1 - continueProb) * 100).toFixed(0)}%)`;
      }
    } else {
      if (rnd <= raiseProb) {
        action = 'raise'; insight += ` (Raise: ${(raiseProb * 100).toFixed(0)}%)`;
      } else {
        action = 'call'; insight += ` (Prob-Call: ${(continueProb * 100).toFixed(0)}%)`;
      }
    }
  } else {
    if (rnd <= continueProb) {
      if (Math.random() <= raiseProb) {
        action = 'raise';
      } else if (street === 'PREFLOP' && raises === 0 && isAggressive) {
        // [v15.9] Aggressive Isolation: TAG/LAG should raise (isolate) instead of fold if in-range
        action = 'raise'; insight += ` (Isolate: LAG)`;
      } else {
        action = 'call'; insight += ` (Prob-Call: ${(continueProb * 100).toFixed(0)}%)`;
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
      if (callAmt > 0) {
        const mult = Math.max(raises > 2 ? 9999 : 2.2, 4.5 - raises);
        amount = Math.floor(currentBet * mult);
      } else {
        let potPct = 0.75;
        potPct -= streetsLeft * .15;
        if (boardAnalysis.type === 'DRY') potPct -= 0.15;
        if (spr < 3) potPct -= 0.15;
        if (street !== 'FLOP' && (estimatedEquity >= 0.8 || estimatedEquity <= 0.05)) {
          const prob = Math.abs(estimatedEquity - 0.5);
          if (isAdvanced && Math.random() <= prob) {
            const boost = Math.min(1.2, Math.max(spr * 0.15, 0.6));
            potPct += boost;
            insight += ` [Overbet: ${(boost * 100).toFixed(0)}%]`;
          } else if (boardAnalysis.type === 'WET') potPct += 0.25;
        }
        amount = Math.floor(pot * potPct);
      }
    }
  }
  // --- 6. Timing Tells ---
  let delay = 1000 + Math.random() * 2000;
  const equityDiff = Math.abs(estimatedEquity - (isAggressor ? raiseProb : continueProb));

  if (equityDiff < 0.10) {
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
    delay,
    estimatedEquity,
    potOdds: potOdds,
    isIP,
    raises,
    handCategory: player.handCategory,
    handTier: player.handTier
  };
}