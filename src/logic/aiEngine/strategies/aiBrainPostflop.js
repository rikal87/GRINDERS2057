import { evaluateHand, getDrawCategory, getHandCategory } from '../../poker.js';
import { analyzeBoard } from '../tools/aiBrainBoardTool.js';
import { profileVillain } from '../tools/aiBrainVillainTool.js';
import { getHandBudget, calculateRaiseSize, isPotCommitted } from '../tools/aiBrainBudgetTool.js';

/**
 * [Strategy] Postflop Strategy Layer
 */
const equityMap = { NUTS: 0.98, MONSTER: 0.85, STRONG: 0.68, GOOD: 0.40, MARGINAL: 0.26, WEAK: 0.15, ACE_HIGH: 0.04 };
export function getPostflopAction(context) {
  const { player, board, potSize, callAmount, isCheckable, street, hasInitiative, potType, currentStreetRaises } = context;
  let extraInsight = '';

  // 1. Scene Analysis
  const evalResult = evaluateHand([...player.hand, ...board]);
  let { category, percentile } = getHandCategory(player.hand, board, evalResult);
  const drawCategory = getDrawCategory(player.hand, board);
  const boardAnalysis = analyzeBoard(context);
  const villain = profileVillain(context);

  // [v19] Relative Strength Layer (Collective Memory & Caution)
  // Absolute categories (MONSTER/STRONG) from poker.js can be over-optimistic in high-intensity pots.
  const isTwoPair = evalResult.total >= 2000000 && evalResult.total < 3000000;
  const isDangerousBoard = boardAnalysis.flushDanger === 'HIGH' || boardAnalysis.straightDanger === 'HIGH' || boardAnalysis.isPaired || boardAnalysis.isDoublePaired;

  // [v20] Use Centralized Tool Intelligence
  const isIntensePot = ['3BET_POT', '4BET_POT', '5BET_POT'].includes(potType);

  if (isTwoPair && boardAnalysis.fullHouseDanger === 'HIGH') {
    category = 'STRONG'; // Downgrade Two-Pair in dangerous textures (Hand #77)
    if (player.handState?.facedRaise || boardAnalysis.isDoublePaired) category = 'GOOD';
  } else if (category === 'MONSTER' && isTwoPair && boardAnalysis.isHighCardHeavy && isIntensePot) {
    category = 'STRONG'; 
    if (player.handState?.facedRaise) category = 'GOOD';
  }

  if (category === 'STRONG' && player.handState?.facedRaise && isDangerousBoard) {
    category = 'GOOD'; // Further downgrade if facing a raise
  }

  // 2. Equity & Budgeting
  let baseEquity = equityMap[category] || 0.05;

  // [v28] Hybrid Equity Blend (Discrete + Continuous)
  // Refines the "step-function" equity with absolute rank-based nuance.
  const rawEquity = 1.0 - (percentile || 0);
  if (['STRONG', 'GOOD', 'MARGINAL', 'WEAK'].includes(category)) {
    // 70% Strategic Label / 30% Continuous Percentile
    baseEquity = (baseEquity * 0.7) + (rawEquity * 0.3);
  }

  let penalty = 0;

  // [v11] Board Risk Penalties
  if (boardAnalysis.flushDanger === 'HIGH') penalty += 0.25;
  else if (boardAnalysis.flushDanger === 'MED') penalty += 0.12;

  // [v22] Straight Awareness
  if (boardAnalysis.straightDanger === 'HIGH') penalty += 0.15;
  else if (boardAnalysis.straightDanger === 'MED') penalty += 0.07;

  if (boardAnalysis.isDowngraded) penalty += 0.08;

  // [v12] Paired Board Caution (General)
  if (boardAnalysis.isPaired && !['NUTS', 'MONSTER', 'STRONG', 'FULL_HOUSE', 'FOUR_OF_A_KIND'].includes(category)) {
    // If board is paired and we don't have FH+, apply caution for Trips/FH potential.
    penalty += 0.15;
    if (street === 'RIVER' && evalResult.total < 3000000) penalty += 0.05;
  }

  // [v18] Counterfeit & Overcard detection: Pocket pair lower than board
  const isPocketPair = player.hand[0][0] === player.hand[1][0];
  if (isPocketPair) {
    const ranksStr = '23456789TJQKA';
    const myPairRank = ranksStr.indexOf(player.hand[0][0]);
    
    // A. Counterfeit (Paired Board)
    if (boardAnalysis.isPaired && myPairRank < boardAnalysis.maxBoardRank) {
       penalty += 0.22;
    }
    
    // B. Overcard Presence (Hard Overcard Penalty)
    // If board has any card higher than our pocket pair, we are likely second best.
    if (boardAnalysis.maxBoardRank > myPairRank) {
       penalty += 0.35; // Severe penalty for KK on A-high board (Hand #276)
    }
  }

  // [v23] Nit (Rock) Exploitation - Overfold to their raises
  if (villain.isNit && player.handState?.facedRaise && category !== 'NUTS') {
    penalty += 0.20; // Massive penalty for playing back against a rock
  }

  // [v20] Applied Range Interaction Penalty from Tool
  if (boardAnalysis.rangeInteractionScore > 0 && !['NUTS', 'MONSTER'].includes(category)) {
      penalty += (boardAnalysis.rangeInteractionScore * 0.25);
  }

  // [v2.2] Aggression Awareness: Aggression doesn't change raw equity, 
  // but it increases the 'price' (required equity) to stay in.
  let aggressionPressure = 0;
  if ((currentStreetRaises >= 1 || player.handState?.facedRaise) && category !== 'NUTS') {
    aggressionPressure = (currentStreetRaises || 1) * 0.08; // Reduced from 0.10

    if (['MONSTER', 'STRONG'].includes(category) && (potType === '3BET_POT' || potType === '4BET_POT')) {
      aggressionPressure *= 0.5;
    }
  }

  // [MOD] River Penalty Reduction (Bravery Adjustment)
  // We reduce penalties by 50% on the river because RIO (Reverse Implied Odds) no longer exists.
  if (street === 'RIVER') penalty *= 0.5;

  const estimatedEquity = Math.max(0.05, baseEquity - penalty);

  // [v25] Personality-based Aggression Scale
  const philosophy = player.class?.philosophy || 'TAG';
  let aggressionOffset = 0;
  if (philosophy === 'LAG') aggressionOffset = 0.1;
  else if (philosophy === 'NIT') aggressionOffset = -0.05;

  // [v11] Equity Decay against Aggression: 
  // If villain raises, our "estimated" equity in their eyes drops because their range is stronger.
  let scaleFactor = 1.0;
  if (!['NUTS', 'MONSTER'].includes(category)) {
     if (currentStreetRaises >= 2) scaleFactor = 0.45; // Extreme discount for non-premiums under heavy fire
     else if (currentStreetRaises === 1) scaleFactor = 0.85;

     // [v19] Range Condensation (Action Memory): 
     // If this is a 3-Bet/4-Bet pot, the opponent's range is already very narrow.
     if (potType === '3BET_POT') scaleFactor *= 0.88;
     else if (['4BET_POT', '5BET_POT'].includes(potType)) scaleFactor *= 0.75;
  }
  let finalEquity = Math.max(0.01, (estimatedEquity * scaleFactor) + aggressionOffset);

  // [v3.1] River Showdown Floor: 
  // If we have at least One-Pair on the river, our absolute equity floor should be ~22%. 
  // This prevents the "Budget Trap" where scary boards force a fold against tiny bets.
  if (street === 'RIVER' && evalResult.total >= 1000000) {
    finalEquity = Math.max(finalEquity, 0.22);
  }

  // [v5.1] River Bluff-Catch Equity Realization
  // On the river, absolute hand equity means nothing if the opponent is bluffing.
  // We add their perceived bluffing frequency to our equity if we hold a bluff-catcher.
  let effectiveEquity = finalEquity;
  let isBluffCatchSituation = false;

  if (street === 'RIVER' && !isCheckable) {
    let riverBluffProb = 0.20;
    if (boardAnalysis.isPaired) riverBluffProb += 0.15; // Increased to call more on paired boards
    if (villain.af > 2.0 || philosophy === 'LAG') riverBluffProb += 0.15; // Aggressive opponents
    // Base bluff prob boost for calling
    riverBluffProb += 0.05;

    // Eligible Bluff Catchers: WEAK pairs, MARGINAL pairs, GOOD, STRONG, A-High, or K-High
    const hasShowdownValue = ['WEAK', 'MARGINAL', 'GOOD', 'STRONG', 'ACE_HIGH'].includes(category) ||
      (evalResult.rank === 1 && player.hand.some(c => c[0] === 'A' || c[0] === 'K'));

    if (hasShowdownValue) {
      effectiveEquity += riverBluffProb;
      isBluffCatchSituation = true;
    }
  }

  const budget = getHandBudget(Math.max(finalEquity, effectiveEquity), potSize, philosophy);
  const isOverBudget = (player.totalWagered + callAmount) > budget;
  const isCommitted = isPotCommitted(player, effectiveEquity, potSize);

  // 3. Decision Logic
  // [v2.2] Adjusted Required Equity: Pot Odds + Aggression Pressure
  const potOdds = callAmount / (potSize + callAmount);
  const requiredEquity = Math.min(0.85, potOdds + aggressionPressure);
  const isOOP = !hasInitiative;

  // [v11/v25] Donk-bet Prevention (Tightened)
  if (isOOP && isCheckable && (potType !== 'SRP' || street === 'FLOP')) {
    // [v25] Only lead with NEAR-NUTS/MONSTER (Threshold 0.95)
    const leadThreshold = (category === 'NUTS') ? 0.75 : 0.95;
    if (finalEquity < leadThreshold) {
      return { action: 'check', insight: extraInsight + `OOP Defense - Respecting ${potType} Initiative` };
    }
  }

  // Value Betting Constraints
  // [v18] Tighter margin for non-premiums to justify a RAISE (especially against aggression)
  let valMargin = 0.2;
  if (!['NUTS', 'MONSTER'].includes(category)) {
    valMargin = 0.45; // [v22] Match Heuristic-Max (requiredEquity + 0.45)
  }
  let canValueBet = finalEquity >= potOdds + valMargin;

  // [v3.0] Aggression Mitigation: If facing a 3-bet or extreme aggression, disable raising with hands < 2-pair
  // Also disable if we've faced a raise and aren't premium.
  const isExtremeAggression = currentStreetRaises >= 2 || (villain.af > 3.0 && player.handState?.facedRaise);
  const hasStrongHolding = ['NUTS', 'MONSTER'].includes(category) || (evalResult.total >= 2000000); // 2-pair or better

  if (isExtremeAggression && !hasStrongHolding) {
    canValueBet = false;
  }

  // [v25] Defensive Switch: If we've already faced a raise this hand, non-premiums shouldn't re-raise.
  const isValuePremium = ['NUTS', 'MONSTER'].includes(category);
  if (player.handState?.facedRaise && !isValuePremium) {
    canValueBet = false;
  }

  // [v18] Strict Reraise Block: In 3BP/4BP/5BP, non-premiums CANNOT raise/reraise.
  if (['3BET_POT', '4BET_POT', '5BET_POT'].includes(potType) && !isValuePremium) {
    canValueBet = false;
  }

  // [v25] Strict River Reraise Block (Nuts Only)
  // If facing a 3-bet (raises >= 2) on the river, only the NUTS can 4-bet/Shove.
  if (street === 'RIVER' && currentStreetRaises >= 2) {
    if (category !== 'NUTS') {
      canValueBet = false;
      extraInsight += " [River Reraise Block - Nuts Only]";
    }
  } else if (street === 'TURN' && currentStreetRaises >= 2 && !isValuePremium) {
    canValueBet = false; 
  }

  // [v21] SRP Pot Reraise Block: Even in SRP, don't 3-bet/4-bet on dangerous boards without Nuts/Top Monster.
  // This prevents self-destruction in Hands #534 and #891.
  if (potType === 'SRP' && isDangerousBoard && currentStreetRaises >= 1 && !isValuePremium) {
    canValueBet = false;
  }

  if (street === 'RIVER' && !isCheckable && ['GOOD', 'MARGINAL', 'WEAK'].includes(category)) {
    canValueBet = false;
  }
  if (boardAnalysis.flushDanger === 'HIGH' && !['NUTS', 'MONSTER'].includes(category)) {
    canValueBet = false;
  }
  
  // [v22] Trap Logic (Nuts on Flop/Turn): 
  // If we have the NEAR-NUTS, don't scare them away too early.
  if (canValueBet && street === 'FLOP' && ['NUTS', 'MONSTER'].includes(category)) {
     if (Math.random() < 0.35) canValueBet = false; // [Trap Mode]
  }

  // [v24] Postflop Aggression Cap
  const isPremium = ['NUTS', 'MONSTER'].includes(category);
  const raiseCap = isPremium ? 4 : 2;

  if (canValueBet && currentStreetRaises >= raiseCap) {
    canValueBet = false;
  }

  // Value Aggression
  if (canValueBet) {
    if (isOverBudget && !['NUTS', 'MONSTER', 'STRONG'].includes(category)) {
      return { action: isCheckable ? 'check' : 'fold', insight: extraInsight + 'Budget Limit - Value Aborted' };
    }
    const isMultiRaiseWar = currentStreetRaises >= 3;
    const amount = isMultiRaiseWar ? (player.chips + (player.currentBet || 0)) : calculateRaiseSize(context, finalEquity, boardAnalysis, villain);
    
    return {
      action: 'raise',
      amount,
      insight: extraInsight + (isMultiRaiseWar ? `Multi-Raise Shove (${street} - Eq:${Math.round(finalEquity * 100)}%)` : `Value Bet (${street} - Eq:${Math.round(finalEquity * 100)}%)`),
      exploitTrigger: villain.exploitTrigger
    };
  }


  // 4. Tactical Aggression (Bluffs & Steals)
  if (isCheckable) {
    // A. Continuation Betting (Aggressor on Flop/Turn)
    if ((street === 'FLOP' || street === 'TURN') && hasInitiative && boardAnalysis.flushDanger !== 'HIGH') {
      let cbetChance = 0.65; // [v5.2] Base increased from 0.55 to 0.65
      const isAceHigh = board.some(c => c.startsWith('A'));
      const isScaryCard = boardAnalysis.highCardCount >= 2 || (street === 'TURN' && board[board.length - 1][0] === 'A');

      if (isAceHigh) cbetChance = 0.85;
      if (philosophy === 'LAG') cbetChance += 0.15;

      // [v5.2] Range Advantage & Overcard C-Bet (Hand #546 passive check fix)
      // If we have any overcards (J/Q/K/A) or any kind of draw/backdoor, maintain C-Bet pressure.
      const hasOvercards = player.hand.some(c => 'JQKA'.includes(c[0]));
      if (street === 'FLOP' && (hasOvercards || drawCategory !== 'AIR')) {
        cbetChance = Math.max(cbetChance, 0.75);
      }

      // [v23] Nit Exploitation - Over-Cbet against Rocks
      if (villain.isNit) {
        cbetChance = Math.max(cbetChance, 0.90);
      }

      // [v5.0] 3-Bet Pot Aggressive C-Betting & Double Barreling
      if (['3BET_POT', '4BET_POT'].includes(potType)) {
        // Massively increase C-Bet frequency on dry/high-card boards
        if (boardAnalysis.type === 'DRY' && (isAceHigh || boardAnalysis.highCardCount >= 1)) {
          cbetChance = Math.max(cbetChance, 0.75);
        }

        // Relentless Double Barrel on the Turn if we have any equity
        if (street === 'TURN') {
          const hasResidualEquity = ['DRAW_WEAK', 'DRAW_STRONG', 'DRAW_MONSTER'].includes(drawCategory) || boardAnalysis.highCardCount >= 2;
          if (hasResidualEquity) {
            cbetChance = Math.max(cbetChance, 0.80); // Keep firing!
          } else {
            cbetChance = Math.max(cbetChance, 0.60);
          }
        }
      } else {
        // [v3.0] Standard Barrel Persistence (SRP Pots)
        if (street === 'TURN' && isScaryCard) cbetChance = Math.max(cbetChance, 0.65);
      }

      // [v23] Boost C-bet if weakness detected
      if (villain.weaknessLevel > 0) cbetChance = Math.min(1, cbetChance + villain.weaknessLevel);

      // Avoid C-betting into high flush danger unless we have a strong hand
      if (['MONSTER', 'STRONG', 'GOOD'].includes(category) || Math.random() < cbetChance) {
        const amount = calculateRaiseSize(context, 0.45, boardAnalysis, villain);
        return {
          action: 'raise',
          amount,
          insight: extraInsight + (street === 'TURN' ? 'Double Barrel' : 'C-Bet') + (villain.weaknessLevel > 0 ? ' (Exploiting Weakness)' : ' (Maintaining Initiative)'),
          exploitTrigger: villain.exploitTrigger
        };
      }
    }

    // B. Semi-Bluffing (Strong Draws)
    if (['DRAW_STRONG', 'DRAW_MONSTER'].includes(drawCategory) && !isOverBudget) {
      if (Math.random() < 0.4) {
        const amount = calculateRaiseSize(context, 0.4, boardAnalysis, villain);
        return { action: 'raise', amount, insight: extraInsight + `Semi-Bluff (${drawCategory})`, exploitTrigger: villain.exploitTrigger };
      }
    }

    // C. Probing (Exploiting Weakness)
    if (!hasInitiative && (street === 'TURN' || street === 'RIVER')) {
      let probeChance = 0.25;
      if (villain.weaknessLevel > 0) probeChance = Math.min(1, probeChance + villain.weaknessLevel);
      if (philosophy === 'LAG') probeChance += 0.2;
      
      // [v23] Nit Exploitation - Probe aggressively when they check
      if (villain.isNit) probeChance = Math.max(probeChance, 0.70);

      if (Math.random() < probeChance && (finalEquity < 0.4 || villain.weaknessLevel > 0.5)) {
        const amount = calculateRaiseSize(context, 0.35, boardAnalysis, villain);
        return {
          action: 'raise',
          amount,
          insight: extraInsight + (villain.weaknessLevel > 0 ? 'Probe Bet (Weakness Detected)' : 'Probe Bet (Tactical)'),
          exploitTrigger: villain.exploitTrigger
        };
      }
    }
  }

  // [v3.0] All-In Thresholding (Hand #314 Fix)
  // Only shove if we have a strong enough hand to justify it.
  // [v22] Tightened C-Shove (Hand #534): Only MONSTER+ should shove. STRONG (Top Pair) must not.
  const canCommitShove = ['NUTS', 'MONSTER'].includes(category);
  if (!isCheckable && finalEquity >= potOdds && canCommitShove) {
    const stackAfterAction = player.chips - callAmount;
    const sprAfterAction = stackAfterAction / (potSize + callAmount);
    if (sprAfterAction < 0.2) {
      return {
        action: 'raise',
        amount: player.chips + (player.currentBet || 0),
        insight: extraInsight + `SPR Committal Shove (SPR:${sprAfterAction.toFixed(2)} Cat:${category})`
      };
    }
  }

  // Defensive Call/Check
  // [MOD] Hard-Tighten Flop Buffer (+0.12) - Raising Flop Fold Rate to target 20-30%
  const callThreshold = (street === 'FLOP') ? (requiredEquity + 0.12) : requiredEquity;

  if (effectiveEquity >= callThreshold) {
    if (isOverBudget && !isPremium && !isCommitted) {
      // [v3.0] Minimum Call Rule: Never fold to tiny bets (odds < 10%) if hand is MARGINAL+
      const isTinyBet = potOdds < 0.10;
      const isMarginalPlus = ['STRONG', 'GOOD', 'MARGINAL'].includes(category) || finalEquity > 0.35;

      // [FIX] River MDF Compliance: If our effective equity matches or exceeds potOdds, call regardless of budget limits
      const isRiverMDFCall = street === 'RIVER' && effectiveEquity >= potOdds;

      if (!isCheckable && !isCommitted && (!isTinyBet || !isMarginalPlus) && !isRiverMDFCall) {
        return { action: 'fold', insight: extraInsight + 'Over Budget - Defensive Fold' };
      }
    }

    const insightLabel = isCheckable ? 'Passive Check' : (isBluffCatchSituation ? 'Bluff Catching' : 'Defensive Call');

    return {
      action: isCheckable ? 'check' : 'call',
      insight: extraInsight + `${insightLabel} (Eq:${Math.round(finalEquity * 100)}% + Blf:${isBluffCatchSituation ? Math.round((effectiveEquity - finalEquity) * 100) : 0}%)`,
      isBluffCatch: isBluffCatchSituation || (street === 'RIVER' && isCommitted),
      exploitTrigger: villain.exploitTrigger
    };
  }

  return isCheckable ? { action: 'check' } : { action: 'fold' };
}

function isStackCommitted(player) {
  return (player.totalWagered / (player.chips + player.totalWagered)) > 0.4;
}
