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
  let category = getHandCategory(player.hand, board, evalResult);
  const drawCategory = getDrawCategory(player.hand, board);
  const boardAnalysis = analyzeBoard(context);
  const villain = profileVillain(context);

  // [v5.0] 3-Bet Pot Aggressor Resilience (Hand Category Shift)
  // If we inflated the pot preflop (Initiative + 3/4-Bet Pot), we MUST NOT check-fold Top Pairs (STRONG).
  // Upgrading them to MONSTER prevents budget constraints from forcing a fold.
  if (hasInitiative && ['3BET_POT', '4BET_POT'].includes(potType)) {
    if (category === 'STRONG') {
      category = 'MONSTER';
    }
  }

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
    // [v2.1] Shark/Advanced are more resilient to aggression (0.10 base)
    let aggressionPenalty = (currentStreetRaises || 1) * 0.10; 

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
  
  // [v25] Personality-based Aggression Scale
  const philosophy = player.class?.philosophy || 'TAG';
  let aggressionOffset = 0;
  if (philosophy === 'LAG') aggressionOffset = 0.1;
  else if (philosophy === 'NIT') aggressionOffset = -0.05;

  const finalEquity = Math.max(0.01, estimatedEquity + aggressionOffset);
  const budget = getHandBudget(finalEquity, potSize, philosophy);
  const isOverBudget = (player.totalWagered + callAmount) > budget;
  const isCommitted = isPotCommitted(player, finalEquity, potSize);

  // 3. Decision Logic
  const potOdds = callAmount / (potSize + callAmount);
  const isOOP = !hasInitiative;

  // [v11/v25] Donk-bet Prevention (Tightened)
  if (isOOP && isCheckable && (potType !== 'SRP' || street === 'FLOP')) {
    // [v25] Only lead with NEAR-NUTS/MONSTER (Threshold 0.95)
    const leadThreshold = (category === 'NUTS') ? 0.75 : 0.95; 
    if (finalEquity < leadThreshold) {
      return { action: 'check', insight: `OOP Defense - Respecting ${potType} Initiative` };
    }
  }

  // [v12] River Decision: Bluff Catch vs Fold
  if (street === 'RIVER' && !isCheckable) {
    if (isOverBudget && !isCommitted) {
      if (finalEquity < potOdds + 0.1) {
        return { action: 'fold', insight: 'Budget Exhausted - Safe Fold' };
      }
    }

    if (isOverBudget && isCommitted) {
      // [v2.1] Higher Bluff Probability consideration for certain textures
      const bluffProbability = (villain.af > 2.5 || boardAnalysis.isPaired) ? 0.35 : 0.15;
      if (finalEquity + bluffProbability >= potOdds) {
        return { action: 'call', insight: 'Pot Committed - Bluff Catching', isBluffCatch: true };
      }
    }
  }

  // Value Betting Constraints
  let canValueBet = finalEquity >= potOdds + 0.2;

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

  if (street === 'RIVER' && !isCheckable && ['GOOD', 'MARGINAL', 'WEAK'].includes(category)) {
    canValueBet = false;
  }
  if (boardAnalysis.flushDanger === 'HIGH' && !['NUTS', 'MONSTER'].includes(category)) {
    canValueBet = false;
  }
  // [v12] Disable River Raise if Over Budget (Unless Nuts)
  if (street === 'RIVER' && isOverBudget && finalEquity < 0.9) {
    canValueBet = false;
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
      return { action: isCheckable ? 'check' : 'fold', insight: 'Budget Limit - Value Aborted' };
    }
    const amount = calculateRaiseSize(context, finalEquity, boardAnalysis);
    return { 
      action: 'raise', 
      amount, 
      insight: `Value Bet (${street} - Eq:${Math.round(finalEquity * 100)}%)`,
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
        const amount = calculateRaiseSize(context, 0.45, boardAnalysis);
        return { 
          action: 'raise', 
          amount, 
          insight: (street === 'TURN' ? 'Double Barrel' : 'C-Bet') + (villain.weaknessLevel > 0 ? ' (Exploiting Weakness)' : ' (Maintaining Initiative)'),
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
      if (philosophy === 'LAG') probeChance += 0.2;

      if (Math.random() < probeChance && (finalEquity < 0.4 || villain.weaknessLevel > 0.5)) {
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

  // [v3.0] All-In Thresholding (Hand #314 Fix)
  // Only shove if we have a strong enough hand to justify it.
  // GOOD hands (TPTK etc.) facing river overbets in 4-bet pots should fold, not shove blind.
  const canCommitShove = ['NUTS', 'MONSTER'].includes(category) ||
    (category === 'STRONG' && potType !== '4BET_POT');
  if (!isCheckable && finalEquity >= potOdds && canCommitShove) {
    const stackAfterAction = player.chips - callAmount;
    const sprAfterAction = stackAfterAction / (potSize + callAmount);
    if (sprAfterAction < 0.2) {
      return { 
        action: 'raise', 
        amount: player.chips + (player.currentBet || 0), 
        insight: `SPR Committal Shove (SPR:${sprAfterAction.toFixed(2)} Cat:${category})` 
      };
    }
  }

  // Defensive Call/Check
  // [v5.1] River Bluff-Catch Equity Realization
  // On the river, our absolute hand equity means nothing if the opponent is bluffing.
  // We add their perceived bluffing frequency to our equity if we hold a bluff-catcher (K-High+).
  let effectiveEquity = finalEquity;
  let isBluffCatchSituation = false;

  if (street === 'RIVER' && !isCheckable) {
    let riverBluffProb = 0.20; 
    if (boardAnalysis.isPaired) riverBluffProb += 0.10; // Paired boards invite dry bluffs
    if (villain.af > 2.0 || philosophy === 'LAG') riverBluffProb += 0.15; // Aggressive opponents
    
    // Eligible Bluff Catchers: WEAK pairs, MARGINAL pairs, A-High, or K-High
    const hasShowdownValue = ['WEAK', 'MARGINAL', 'GOOD', 'ACE_HIGH'].includes(category) || 
      (evalResult.rank === 1 && player.hand.some(c => c[0] === 'A' || c[0] === 'K'));

    if (hasShowdownValue) {
      effectiveEquity += riverBluffProb;
      isBluffCatchSituation = true;
    }
  }

  if (effectiveEquity >= potOdds) {
    // [v2.1] Global Commitment Override: If committed, we don't fold to a single bet if we have equity
    if (isOverBudget && !isPremium && !isStackCommitted(player)) {
      // [v3.0] Minimum Call Rule: Never fold to tiny bets (odds < 10%) if hand is MARGINAL+
      const isTinyBet = potOdds < 0.10;
      const isMarginalPlus = ['STRONG', 'GOOD', 'MARGINAL'].includes(category) || finalEquity > 0.35;

      if (!isCheckable && !isCommitted && (!isTinyBet || !isMarginalPlus)) {
        return { action: 'fold', insight: 'Over Budget - Defensive Fold' };
      }
    }

    const insightLabel = isCheckable ? 'Passive Check' : (isBluffCatchSituation ? 'Bluff Catching' : 'Defensive Call');

    return {
      action: isCheckable ? 'check' : 'call',
      insight: `${insightLabel} (Eq:${Math.round(finalEquity * 100)}% + Blf:${isBluffCatchSituation ? Math.round((effectiveEquity-finalEquity)*100) : 0}%)`,
      isBluffCatch: isBluffCatchSituation || (street === 'RIVER' && isCommitted),
      exploitTrigger: villain.exploitTrigger
    };
  }

  return isCheckable ? { action: 'check' } : { action: 'fold' };
}

function isStackCommitted(player) {
  return (player.totalWagered / (player.chips + player.totalWagered)) > 0.4;
}
