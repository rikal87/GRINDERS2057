import { getStartingHandRank } from '../../poker.js';
import { profileVillain } from '../tools/aiBrainVillainTool.js';

/**
 * [Strategy] Preflop Strategy Layer
 */
export function getPreflopAction(context) {
  const { player, engine, myPos, bb, callAmount, isCheckable, matrix } = context;
  const hand = getCanonicalHand(player.hand);
  const handRank = getStartingHandRank(player.hand);

  const myPosGTO = mapPosToGTO(myPos);
  const effectiveStackBB = player.chips / bb;
  const isShortStack = effectiveStackBB < 25;
  const isUnopened = (context.currentBet || 0) <= bb && engine.currentStreetRaises === 0;
  const isIP = ['BTN', 'CO'].includes(myPos);

  // --- 0. Personality & Villain Profiling ---
  const villain = profileVillain(context);
  const philosophy = player.class?.philosophy || 'TAG';

  // Personality Offset: LAGs play wider (+20 rank points), NITs play tighter (-10)
  let pOffset = 0;
  if (philosophy === 'LAG') pOffset = 20;
  else if (philosophy === 'NIT') pOffset = -10;

  // Exploit Offset: If villain is tight (low VPIP), widen our range to steal
  let exploitOffset = 0;
  if (isUnopened && villain.vPIP < 0.20 && villain.confidence > 0.3) {
    exploitOffset = 15; // Steal more
  }

  // --- 1. UNOPENED POTS (RFI) ---
  if (isUnopened) {
    if (isShortStack) {
      if (matrix.SHORT_STACK.OPEN.has(hand) || handRank <= (15 + pOffset)) {
        return { action: 'raise', amount: bb * 2.2, insight: `ShortStack RFI (${myPos})` };
      }
      return { action: 'fold', insight: `ShortStack Fold (${myPos})` };
    }

    // [v11] Limper Isolation Logic
    if ((context.limperMoney || 0) > 0) {
      let isoThreshold = 25;
      if (myPosGTO === 'BTN') isoThreshold = 45;
      else if (myPosGTO === 'BB') isoThreshold = 35;
      else if (myPosGTO === 'SB') isoThreshold = 40;

      if (handRank <= (isoThreshold + pOffset)) {
        return { action: 'raise', amount: bb * 4 + (context.limperMoney || 0), insight: `Isolate Limpers (${myPosGTO}, Rank:${handRank})` };
      }
      if (myPosGTO === 'BB') return { action: 'check', insight: 'Check (BB vs Limpers)' };
    }

    const rangeSet = matrix.OPEN[myPosGTO];
    let size = 2.5;
    if (myPosGTO === 'SB') size = 3.0;
    else if (myPosGTO === 'BTN') size = 2.2;

    const amount = (bb + (context.limperMoney || 0)) * size;

    // GTO Check
    if (rangeSet && rangeSet.has(hand)) {
      return { action: 'raise', amount, insight: `GTO Open (${myPos}->${myPosGTO})` };
    }

    // Exploit & Personality Override
    const thresholds = { BTN: 88, CO: 55, MP: 38, UTG: 22 }; // [v11] Synced with legacy Advanced thresholds
    const baseThreshold = thresholds[myPosGTO] || 20;
    const finalThreshold = baseThreshold + pOffset + exploitOffset;

    if (handRank <= finalThreshold) {
      return { action: 'raise', amount, insight: `RFI Override ${myPosGTO} (Rank:${handRank}/${finalThreshold})` };
    }

    return isCheckable ? { action: 'check', insight: 'Check (BB)' } : { action: 'fold', insight: 'Fold' };
  }

  // --- 2. FACING AGGRESSION ---
  const currentBet = context.currentBet;
  const activePlayers = engine.players.filter(p => !p.isFolded);
  const lastRaiser = activePlayers.find(p => p.currentBet === currentBet && p.id !== player.id);
  const aggIdx = lastRaiser ? engine.players.indexOf(lastRaiser) : -1;
  const aggPos = aggIdx !== -1 ? context.getPosName(aggIdx) : 'UTG';

  // A. Defending vs 3-Bet / 4-Bet (I am the raiser)
  const isStreetStarted = player.totalWagered > bb;
  if (engine.currentStreetRaises >= 2 && isStreetStarted) {
    const isIP = ['BTN', 'CO'].includes(myPos);
    const posKey = isIP ? 'IP' : 'OOP';
    const contextStrategies = matrix.VS_3BET[posKey];

    if (contextStrategies) {
      // Adjustment: Maniacs/Sharks get 4-bet wider
      const maniaAdjustment = (villain.isManiac || philosophy === 'LAG') ? 8 : 0;

      // [v3.0] SPR Awareness: If we are committed (stack < 2.5x pot), aggression is free
      const potSize = engine.potSize || 0;
      const isCommitted = player.chips < potSize * 2.0;
      const sprAdjustment = isCommitted ? 5 : 0;

      let canRaise = contextStrategies.VALUE_4BET.has(hand) || handRank <= (6 + maniaAdjustment + sprAdjustment);

      // [v2.1] Shark/LAG Premium Persistence
      if (handRank <= 6) canRaise = true;

      // [v5.2] Polarized 4-Bet Bluffing (A2s-A5s)
      // Fixes Hand #990: Only bluff ONCE (during 4-bet). NEVER 6-bet bluff.
      const isSmallSuitedAce = hand[0] === 'A' && hand.endsWith('s') && '2345'.includes(hand[1]);
      if (!canRaise && isSmallSuitedAce && engine.currentStreetRaises === 2 && !villain.isNit && Math.random() < 0.40) {
        return { action: 'raise', amount: currentBet * 2.3, insight: `Polarized 4-Bet Bluff (${hand})` };
      }

      if (engine.currentStreetRaises >= 3) {
        canRaise = handRank <= (4 + (maniaAdjustment / 2) + sprAdjustment);
      }
      // [v4.0] 5-Bet+ Call Tightening: Heuristic AIs 5-bet with near-nuts.
      // Only call with the very top of our range (AA, KK, QQ, AKs, JJ = Rank <= 5).
      if (engine.currentStreetRaises >= 4) {
        canRaise = handRank <= 3 + (sprAdjustment / 2);
        // Tighten calling range for 5-bet: only top 5%
        const fiveBetCallThreshold = 5 + Math.floor(sprAdjustment / 2);
        if (!canRaise && handRank > fiveBetCallThreshold) {
          return { action: 'fold', insight: `Fold to 5-Bet (Rank:${handRank} > ${fiveBetCallThreshold})` };
        }
      }

      if (canRaise) {
        // [v25] Forced All-In on 5-bet+: Break the infinite 2.3x raise loop
        // If we are at the 4th raise (about to 5-bet), just shove.
        const isFiveBetPlus = engine.currentStreetRaises >= 4;
        const raiseSize = isFiveBetPlus ? (player.chips + (player.currentBet || 0)) : (currentBet * 2.5); // [v26] Standard 4-Bet sizing (2.5x)
        
        return { 
          action: 'raise', 
          amount: raiseSize, 
          insight: isFiveBetPlus ? `5-Bet+ Shove (Rank:${handRank})` : (isCommitted ? `Committed 4-Bet+ (Rank:${handRank})` : `Value 4-Bet+ (Rank:${handRank})`) 
        };
      }

      // [v4.0] Standard 4-Bet Call range (GTO: TT+, AQ+)
      let callThreshold = 10 + (villain.isManiac ? 6 : 0) + sprAdjustment;
      
      // [v5.1] Fix 3-Bet Call Range: We must defend wider IP against a 3-Bet (e.g. QJs, AJo)
      if (engine.currentStreetRaises === 2) {
        callThreshold = isIP ? 16 : 13; // Rank 16 = AJo/QJs.
      }

      if (contextStrategies.CALL.has(hand) || handRank <= callThreshold) {
        // [v23] Nit Respect: Don't call 3-bets from Nits with marginal rank (14-16)
        if (villain.isNit && handRank > 10) return { action: 'fold', insight: 'Nit Respect - Tight Fold' };
        
        return { action: 'call', insight: `GTO call ${engine.currentStreetRaises}-Bet (${posKey} Rank:${handRank})` };
      }
    }
    const strictFallback = engine.currentStreetRaises === 2 ? 14 : 10;
    if (handRank <= strictFallback) return { action: 'call', insight: `Strong Defense (Rank:${handRank})` };
    return { action: 'fold', insight: `Fold to ${engine.currentStreetRaises}-Bet (Rank:${handRank})` };
  }

  // B. Defending vs Open / Squeeze
  const vsKey = `VS_${aggPos.toUpperCase()}`;
  const defenseMatrix = matrix.DEFENSE[vsKey] ? matrix.DEFENSE[vsKey][myPosGTO] : null;

  // [v3.0] Aggression Overlay: Force 3-Bet for Top 12% or suited connectors in late pos
  // This triggers even if the GTO matrix doesn't cover this specific position pair.
  const isSuited = hand.endsWith('s');
  const r1 = hand[0], r2 = hand[1];
  const ranksTable = '23456789TJQKA';
  const v1 = ranksTable.indexOf(r1), v2 = ranksTable.indexOf(r2);
  const isSuitedConnector = isSuited && Math.abs(v1 - v2) === 1;
  const isSmallSuitedAce = r1 === 'A' && isSuited && '2345'.includes(r2);
  const isLatePos = ['BTN', 'CO'].includes(myPosGTO);
  const isVsLatePos = ['BTN', 'CO'].includes(aggPos.toUpperCase());

  // [v5.0] Hyper-Aggressive Positional 3-Bet Overlay (Target ~11% 3B):
  // - Rank <= 13 (JJ+, AQs+, AKo): 3-Bet from any position
  // - Rank 14-25 (TT, AJs, KQs etc.): 3-Bet from BTN/CO/SB
  const is3BetPremium = handRank <= 13;
  let is3BetPositional = false;

  if (handRank <= 25 && ['BTN', 'CO', 'SB'].includes(myPosGTO)) {
    is3BetPositional = true;
  }
  // If facing late position (cutoff/button), punish wide opens with slightly weaker hands
  if (isVsLatePos && handRank > 25 && handRank <= 35 && ['BTN', 'SB', 'BB'].includes(myPosGTO) && Math.random() < 0.6) {
    is3BetPositional = true;
  }

  const isOOP = ['SB', 'BB'].includes(myPosGTO);
  const raiseMult = isOOP ? 4.2 : 3.2; // [v26] Standard 3-Bet sizing: 4.2x OOP, 3.2x IP

  if (is3BetPremium || is3BetPositional) {
    return { action: 'raise', amount: currentBet * raiseMult, insight: `Premium 3-Bet Overlay (Rank:${handRank} Pos:${myPosGTO})` };
  }

  // [v5.0] Polarized Bluffing Heuristics (A2s-A5s and Suited Connectors)
  // Essential for 6-max aggression.
  if (isLatePos || ['SB', 'BB'].includes(myPosGTO)) {
    if (isSmallSuitedAce && !villain.isNit && Math.random() < 0.6) { // 60% Light 3B with A2s-A5s
      return { action: 'raise', amount: currentBet * raiseMult, insight: `Polarized 3-Bet (Suited Ace ${hand} from ${myPosGTO})` };
    }
    if (isSuitedConnector && v1 >= 4 && !villain.isNit && Math.random() < 0.4) { // 40% Light 3B for 65s+
      return { action: 'raise', amount: currentBet * raiseMult, insight: `Light 3-Bet (Suited Connector ${hand} from ${myPosGTO})` };
    }
  }

  if (defenseMatrix) {
    if (typeof defenseMatrix === 'object') {

      if (defenseMatrix.VALUE_3BET.has(hand)) {
        return { action: 'raise', amount: currentBet * raiseMult, insight: `GTO Value 3-Bet (vs ${aggPos})` };
      }

      // [v5.0] Execute GTO Bluffs much more frequently (Target 11%)
      let bluffFreq = 0.8; // Default to 80% (from 30%)
      if (villain.vPIP < 0.20) bluffFreq = 1.0; // Punish tight RFI
      if (villain.isManiac || philosophy === 'LAG') bluffFreq = 1.0; 

      if (defenseMatrix.BLUFF_3BET.has(hand) && Math.random() < bluffFreq) {
        return { action: 'raise', amount: currentBet * raiseMult, insight: `GTO Bluff 3-Bet (vs ${aggPos})` };
      }

      if (defenseMatrix.CALL.has(hand)) {
        return { action: 'call', insight: `GTO Call (vs ${aggPos})` };
      }
    } else if (defenseMatrix instanceof Set && defenseMatrix.has(hand)) {
      return { action: 'call', insight: `GTO Call (vs ${aggPos})` };
    }
  }

  // Fallback
  const fallbackRank = 7 + (villain.isManiac ? 5 : 0);
  if (handRank <= fallbackRank) return { action: 'raise', amount: currentBet * 3, insight: 'Premium Value Raise' };

  const marginalThreshold = 20 + (villain.isManiac ? 15 : 0);
  if (handRank <= marginalThreshold && callAmount > 0 && callAmount / bb <= 15) return { action: 'call', insight: 'Marginal Defense' };

  return isCheckable ? { action: 'check', insight: 'Check' } : { action: 'fold', insight: 'Fold' };
}

/** 
 * Helper: Map table position to GTO position name
 */
function mapPosToGTO(pos) {
  if (!pos) return 'UTG';
  const p = pos.toUpperCase();
  if (p.includes('EP') || p.includes('UTG')) return 'UTG';
  if (p.includes('MP') || p.includes('HJ')) return 'MP';
  if (p.includes('CO')) return 'CO';
  if (p.includes('BTN')) return 'BTN';
  if (p.includes('SB')) return 'SB';
  if (p.includes('BB')) return 'BB';
  return 'UTG';
}

function getCanonicalHand(handArr) {
  const ranksTable = '23456789TJQKA';
  if (!handArr || handArr.length < 2) return "";
  const r1 = handArr[0][0], r2 = handArr[1][0];
  const s1 = handArr[0][1], s2 = handArr[1][1];
  const v1 = ranksTable.indexOf(r1), v2 = ranksTable.indexOf(r2);
  
  if (v1 === v2) return r1 + r2;
  const suited = s1 === s2 ? 's' : 'o';
  return (v1 > v2) ? (r1 + r2 + suited) : (r2 + r1 + suited);
}
