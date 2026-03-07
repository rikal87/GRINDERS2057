import { evaluateHand, getDrawCategory, getHandCategory } from '../../poker.js';
import { analyzeBoard } from '../tools/aiBrainBoardTool.js';
import { profileVillain } from '../tools/aiBrainVillainTool.js';
import { getHandBudget, calculateRaiseSize, isPotCommitted } from '../tools/aiBrainBudgetTool.js';

/**
 * [Strategy] Postflop Strategy Layer
 */
const equityMap = { NUTS: 0.95, MONSTER: 0.85, STRONG: 0.70, GOOD: 0.50, MARGINAL: 0.35, WEAK: 0.20, ACE_HIGH: 0.10 };
export function getPostflopAction(context) {
  const { player, board, potSize, callAmount, isCheckable, street, hasInitiative, potType, currentStreetRaises } = context;

  // 1. Scene Analysis
  const evalResult = evaluateHand([...player.hand, ...board]);
  const category = getHandCategory(player.hand, board, evalResult);
  const drawCategory = getDrawCategory(player.hand, board);
  const boardAnalysis = analyzeBoard(context);
  const villain = profileVillain(context);

  // 2. Equity & Budgeting
  let baseEquity = equityMap[category] || 0.05;
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

  // [v14] Aggression Awareness
  // Every re-raise from opponent reduces our effective equity for non-nuts.
  if ((currentStreetRaises >= 1 || player.handState?.facedRaise) && category !== 'NUTS') {
    let aggressionPenalty = (currentStreetRaises || 1) * 0.15; // [v25] Increased base penalty

    // [v20] Resilience in High Pots: Halve aggression penalty for premium hands (AA/KK equivalents)
    if (['MONSTER', 'STRONG'].includes(category) && (potType === '3BET_POT' || potType === '4BET_POT')) {
      aggressionPenalty *= 0.5;
    }

    penalty += aggressionPenalty;

    // Broadway Saturation: Extra caution on high-card boards when re-raised
    // [v20] Skip for premium pocket pairs in high pots (Ensuring they stay committed)
    const isPremiumHighPot = ['MONSTER', 'STRONG'].includes(category) && (potType === '3BET_POT' || potType === '4BET_POT');
    if (boardAnalysis.highCardCount >= 2 && !['NUTS', 'MONSTER'].includes(category) && !isPremiumHighPot) {
      penalty += 0.10;
    }
  }

  const estimatedEquity = Math.max(0.05, baseEquity - penalty);
  const budget = getHandBudget(estimatedEquity, potSize);
  const isOverBudget = (player.totalWagered + callAmount) > budget;
  const isCommitted = isPotCommitted(player, estimatedEquity);

  // 3. Decision Logic
  const potOdds = callAmount / (potSize + callAmount);
  const isOOP = !hasInitiative;

  // [v11/v25] Donk-bet Prevention (Tightened)
  if (isOOP && isCheckable && (potType !== 'SRP' || street === 'FLOP')) {
    // [v25] Only lead with NEAR-NUTS/MONSTER (Threshold 0.95)
    const leadThreshold = (category === 'NUTS') ? 0.75 : 0.95; 
    if (estimatedEquity < leadThreshold) {
      return { action: 'check', insight: `OOP Defense - Respecting ${potType} Initiative` };
    }
  }

  // [v12] River Decision: Bluff Catch vs Fold
  if (street === 'RIVER' && !isCheckable) {
    if (isOverBudget && !isCommitted) {
      if (estimatedEquity < potOdds + 0.1) {
        return { action: 'fold', insight: 'Budget Exhausted - Safe Fold' };
      }
    }

    if (isOverBudget && isCommitted) {
      const bluffProbability = (villain.af > 3.0) ? 0.3 : 0.1;
      if (estimatedEquity + bluffProbability >= potOdds) {
        return { action: 'call', insight: 'Pot Committed - Bluff Catching', isBluffCatch: true };
      }
    }
  }

  // Value Betting Constraints
  let canValueBet = estimatedEquity >= potOdds + 0.2;

  // [v25] Defensive Switch: If we've already faced a raise this hand, non-premiums shouldn't re-raise.
  const isValuePremium = ['NUTS', 'MONSTER'].includes(category);
  if (player.handState?.facedRaise && !isValuePremium) {
    canValueBet = false;
  }

  if (street === 'RIVER' && !isCheckable && ['GOOD', 'MARGINAL', 'WEAK'].includes(category)) {
    canValueBet = false;
  }
  if (boardAnalysis.flushDanger === 'HIGH' && !['NUTS', 'MONSTER'].includes(category)) {
    canValueBet = false;
  }
  // [v12] Disable River Raise if Over Budget (Unless Nuts)
  if (street === 'RIVER' && isOverBudget && estimatedEquity < 0.9) {
    canValueBet = false;
  }

  // [v24] Postflop Aggression Cap
  // Limit the number of raises for non-NUTS/MONSTER hands to avoid infinite re-betting wars.
  const isPremium = ['NUTS', 'MONSTER'].includes(category);
  const raiseCap = isPremium ? 4 : 2; 

  if (canValueBet && currentStreetRaises >= raiseCap) {
    canValueBet = false;
  }

  // Value Aggression
  if (canValueBet) {
    if (isOverBudget && !['NUTS', 'MONSTER', 'STRONG'].includes(category)) {
      return { action: isCheckable ? 'check' : 'fold', insight: 'Budget Limit - Value Aborted' };
    }
    const amount = calculateRaiseSize(context, estimatedEquity, boardAnalysis);
    return { 
      action: 'raise', 
      amount, 
      insight: `Value Bet (${street} - Eq:${Math.round(estimatedEquity * 100)}%)`,
      exploitTrigger: villain.exploitTrigger
    };
  }


  // 4. Tactical Aggression (Bluffs & Steals)
  if (isCheckable) {
    // A. Continuation Betting (Aggressor on Flop)
    if (street === 'FLOP' && hasInitiative && boardAnalysis.flushDanger !== 'HIGH') {
      let cbetChance = 0.55;
      const isAceHigh = board.some(c => c.startsWith('A'));
      if (isAceHigh && player.id.includes('BTN')) cbetChance = 0.85;
      
      // [v23] Boost C-bet if weakness detected
      if (villain.weaknessLevel > 0) cbetChance = Math.min(1, cbetChance + villain.weaknessLevel);

      // Avoid C-betting into high flush danger unless we have a strong hand
      if (['MONSTER', 'STRONG', 'GOOD'].includes(category) || Math.random() < cbetChance) {
        const amount = calculateRaiseSize(context, 0.45, boardAnalysis);
        return { 
          action: 'raise', 
          amount, 
          insight: villain.weaknessLevel > 0 ? 'C-Bet (Exploiting Weakness)' : 'C-Bet (Maintaining Initiative)',
          exploitTrigger: villain.exploitTrigger
        };
      }
    }

    // B. Semi-Bluffing (Strong Draws)
    if (['DRAW_STRONG', 'DRAW_MONSTER'].includes(drawCategory) && !isOverBudget) {
      if (Math.random() < 0.4) {
        const amount = calculateRaiseSize(context, 0.4, boardAnalysis);
        return { action: 'raise', amount, insight: `Semi-Bluff (${drawCategory})`, exploitTrigger: villain.exploitTrigger };
      }
    }

    // C. Probing (Exploiting Weakness)
    if (!hasInitiative && (street === 'TURN' || street === 'RIVER')) {
      let probeChance = 0.25;
      if (villain.weaknessLevel > 0) probeChance = Math.min(1, probeChance + villain.weaknessLevel);

      if (Math.random() < probeChance && (estimatedEquity < 0.4 || villain.weaknessLevel > 0.5)) {
        const amount = calculateRaiseSize(context, 0.35, boardAnalysis);
        return { 
          action: 'raise', 
          amount, 
          insight: villain.weaknessLevel > 0 ? 'Probe Bet (Weakness Detected)' : 'Probe Bet (Tactical)',
          exploitTrigger: villain.exploitTrigger 
        };
      }
    }
  }

  // Defensive Call/Check
  if (estimatedEquity >= potOdds) {
    const isBluffCatchSituation = street === 'RIVER' && !isCheckable && ['GOOD', 'MARGINAL', 'WEAK'].includes(category);

    if (isOverBudget && !['NUTS', 'MONSTER', 'STRONG'].includes(category) && !isStackCommitted(player)) {
      if (!isCheckable && !isCommitted) return { action: 'fold', insight: 'Over Budget - Defensive Fold' };
    }

    const insightLabel = isCheckable ? 'Passive Check' : (isBluffCatchSituation ? 'Bluff Catching' : 'Defensive Call');

    return {
      action: isCheckable ? 'check' : 'call',
      insight: `${insightLabel} (Eq:${Math.round(estimatedEquity * 100)}%)`,
      isBluffCatch: isBluffCatchSituation || (street === 'RIVER' && isCommitted),
      exploitTrigger: villain.exploitTrigger
    };
  }

  return isCheckable ? { action: 'check' } : { action: 'fold' };
}

function isStackCommitted(player) {
  return (player.totalWagered / (player.chips + player.totalWagered)) > 0.4;
}
