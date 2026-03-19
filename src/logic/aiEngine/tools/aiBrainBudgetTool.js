/**
 * [Tool] Budget Tool
 * Manages investment limits based on equity and pot sizes.
 */
export function getHandBudget(equity, potSize, philosophy = 'TAG') {
  // [v2.1] More realistic budgeting. Equity is your "fair share" of the pot.
  // A Shark/LAG should be willing to over-invest slightly to apply pressure.
  let multiplier = 1.0;
  if (philosophy === 'LAG') multiplier = 1.25;
  if (philosophy === 'NIT') multiplier = 0.8;

  if (equity >= 0.95) return potSize * 20.0; // Effectively All-in
  if (equity >= 0.85) return potSize * 10.0; // Monster: willing to commit stack
  if (equity >= 0.75) return potSize * 5.0;
  if (equity >= 0.65) return potSize * 3.5;
  if (equity >= 0.50) return potSize * 2.5; // Coinflip+: willing to put in multiple barrels
  if (equity >= 0.35) return potSize * 1.5; // Marginal: Enough to call a pot-sized bet and defend
  if (equity >= 0.20) return potSize * 0.6; // Draw/Weak: small/medium investment
  return potSize * 0.25;
}

/**
 * Determines if a player is pot-committed.
 * Return true if player has invested >25% of stack and has decent equity (>40%).
 */
export function isPotCommitted(player, equity, currentPot) {
  const totalInvested = player.totalWagered || 0;
  const currentStack = player.chips || 0;
  const totalStack = totalInvested + currentStack;
  
  if (totalStack === 0) return false;
  const investmentRatio = totalInvested / totalStack;
  const spr = currentStack / (currentPot || 1);
  
  // [v2.2] Strong Hand Commitment (SPR < 1.0)
  if (spr < 1.2 && equity > 0.45) return true; // SPR < 1.2 is high commitment for Good+ hands

  // General commitment: Invested > 20% of stack with decent equity
  return investmentRatio > 0.20 && equity > 0.30;
}

/**
 * Calculates dynamic raise sizing based on board, equity, and villain context.
 * Goal: "Win BIG when winning, Control Pot when losing/marginal."
 */
export function calculateRaiseSize(context, estimatedEquity, boardAnalysis, villain = {}) {
  const { potSize, street, bb, potType, callAmount, currentBet } = context;
  const streetsLeft = street === 'FLOP' ? 2 : (street === 'TURN' ? 1 : 0);
  
  // 1. Base Pot Pct (Standard)
  // [v4.0] Balanced sizing base (incorporating aiEngine.js line 485 logic)
  let potPct = 0.70;
  potPct -= (streetsLeft * 0.15); // Flop: 0.4, Turn: 0.55, River: 0.70

  if (potType === '4BET_POT') potPct *= 0.6; // Smaller relative to pot in 4B
  else if (potType === '3BET_POT') potPct *= 0.8;

  if (boardAnalysis.isDry) potPct -= 0.15;
  if (boardAnalysis.isWet) potPct += 0.15;

  // 2. [EXPLOIT] "Win Big" vs "Control Pot"
  // A. MAX VALUE (Nuts/Monster)
  if (estimatedEquity >= 0.85) {
    if (villain.isStation) {
      potPct = Math.max(potPct, 1.2); // Over-bet into the station!
    } else if (villain.isNit) {
      potPct = 0.35; // Trap the nit with a smaller "Curiosity" bet
    } else {
      potPct = Math.max(potPct, 0.75); // Standard strong value
    }
  } 
  // B. POT CONTROL (Marginal Value / Strong but vulnerable)
  else if (estimatedEquity >= 0.55 && estimatedEquity < 0.80) {
    // "Blocker" sizing to keep the pot manageable
    potPct = Math.min(potPct, 0.33); 
  }
  // C. POLARIZING BLUFF (Air into certain profiles)
  else if (estimatedEquity < 0.30 && villain.isNit) {
    potPct = 0.85; // Large "Fear-Inducing" bluff against rocks
  }

  let amount = Math.floor(potSize * potPct);

  // 3. Strategic Raise Multiplier (Facing a Bet)
  if (callAmount > 0) {
    let multiplier = 2.2;
    // Boost multiplier for strong hands to build pot or clear field
    if (estimatedEquity > 0.85) {
       multiplier = villain.isStation ? 4.5 : 3.0; // Crank it up vs stations
    } else if (estimatedEquity < 0.4 && villain.isNit) {
       multiplier = 3.5; // Large bluff-raise vs Nit
    } else if (estimatedEquity < 0.7) {
       multiplier = 2.1; // Standard/Protect
    }
    
    let strategicRaise = Math.floor(currentBet * multiplier);
    const minIncrement = Math.max(callAmount, bb);
    const minRaise = currentBet + minIncrement;
    
    amount = Math.max(amount, strategicRaise, minRaise);
  }

  // Safety Capping
  amount = Math.max(amount, bb);
  return Math.floor(amount);
}
