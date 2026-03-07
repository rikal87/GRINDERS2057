/**
 * [Tool] Budget Tool
 * Manages investment limits based on equity and pot sizes.
 */
export function getHandBudget(equity, potSize) {
  // [v9] Strategic Budgeting Logic
  if (equity >= 0.95) return potSize * 3.0;
  if (equity >= 0.85) return potSize * 2.0;
  if (equity >= 0.75) return potSize * 1.4;
  if (equity >= 0.65) return potSize * 1.2;
  if (equity >= 0.55) return potSize * 0.8;
  if (equity >= 0.35) return potSize * 0.35;
  return potSize * 0.15;
}

/**
 * Determines if a player is pot-committed.
 * Return true if player has invested >25% of stack and has decent equity (>40%).
 */
export function isPotCommitted(player, equity) {
  const totalInvested = player.totalWagered || 0;
  const currentStack = player.chips || 0;
  const totalStack = totalInvested + currentStack;
  
  if (totalStack === 0) return false;
  const investmentRatio = totalInvested / totalStack;
  
  // Loosened for more organic interaction: 20% investment and 30% equity
  return investmentRatio > 0.20 && equity > 0.30;
}

/**
 * Calculates dynamic raise sizing based on board and equity context.
 */
export function calculateRaiseSize(context, estimatedEquity, boardAnalysis) {
  const { potSize, street, bb, potType, callAmount, currentBet } = context;
  
  let potPct = 0.5; // Default SRP sizing
  
  if (potType === '4BET_POT') {
    potPct = 0.25; // Small sizing in 4B pots (low SPR)
  } else if (potType === '3BET_POT') {
    potPct = 0.33; // Medium-small in 3B pots
  }

  // Adjust for board texture
  if (boardAnalysis.isDry) potPct *= 0.8;
  else if (boardAnalysis.isWet) potPct *= 1.3;

  // Adjust for equity
  if (estimatedEquity >= 0.9) potPct *= 1.5;
  else if (estimatedEquity >= 0.8) potPct *= 1.2;

  // Street specific overrides
  if (street === 'FLOP' && boardAnalysis.isDry && potType === 'SRP') potPct = 0.33;
  if (street === 'RIVER' && estimatedEquity > 0.8) potPct = Math.max(potPct, 0.75);

  let amount = Math.floor(potSize * potPct);

  // [v19/v24/v25] Ensure it's a strategic raise size if facing a bet
  if (callAmount > 0) {
    // [v25] Boost multiplier for near-nuts (0.85+) to apply maximum pressure
    let multiplier = 2.1;
    if (estimatedEquity > 0.85) multiplier = 3.5;
    else if (estimatedEquity > 0.7) multiplier = 2.5;
    
    let strategicRaise = Math.floor(currentBet * multiplier);
    
    // Ensure it's at least a valid min-raise
    const minIncrement = Math.max(callAmount, bb);
    const minRaise = currentBet + minIncrement;
    
    amount = Math.max(amount, strategicRaise, minRaise);
  }

  return Math.max(amount, bb);
}
