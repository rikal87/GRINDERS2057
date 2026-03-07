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

  // --- 1. UNOPENED POTS (RFI) ---
  if (isUnopened) {
    if (isShortStack) {
      if (matrix.SHORT_STACK.OPEN.has(hand)) {
        return { action: 'raise', amount: bb * 2.2, insight: `ShortStack RFI (${myPos})` };
      }
      return { action: 'fold', insight: `ShortStack Fold (${myPos})` };
    }

    const rangeSet = matrix.OPEN[myPosGTO];
    let size = 2.5;
    if (myPosGTO === 'SB') size = 3.0;
    else if (myPosGTO === 'BTN') size = 2.2;
    
    const amount = (bb + (context.limperMoney || 0)) * size;

    if (rangeSet && rangeSet.has(hand)) {
      return { action: 'raise', amount, insight: `GTO Open (${myPos}->${myPosGTO})` };
    }

    // Exploit: Wide BTN/CO/MP/UTG based on HandRank
    const thresholds = { BTN: 90, CO: 55, MP: 33, UTG: 20 };
    if (handRank <= thresholds[myPosGTO]) {
      return { action: 'raise', amount, insight: `RFI Override ${myPosGTO} (Rank:${handRank})` };
    }

    return isCheckable ? { action: 'check', insight: 'Check (BB)' } : { action: 'fold', insight: 'Fold' };
  }

  // --- 2. FACING AGGRESSION ---
  const currentBet = context.currentBet;
  const villain = profileVillain(context);
  const activePlayers = engine.players.filter(p => !p.isFolded);
  const lastRaiser = activePlayers.find(p => p.currentBet === currentBet && p.id !== player.id);
  const aggIdx = lastRaiser ? engine.players.indexOf(lastRaiser) : -1;
  const aggPos = aggIdx !== -1 ? context.getPosName(aggIdx) : 'UTG';
  
  // A. Defending vs 3-Bet / 4-Bet (I am the raiser)
  const isStreetStarted = player.totalWagered > bb;
  if (engine.currentStreetRaises >= 2 && isStreetStarted) {
    const isIP = ['BTN', 'CO'].includes(myPos); // Simplified IP/OOP
    const posKey = isIP ? 'IP' : 'OOP';
    const contextStrategies = matrix.VS_3BET[posKey];

    if (contextStrategies) {
      // [v15] Tiered Aggression Cap: Prevent infinite wars with non-nut premiums (TT, JJ, AKo)
      let canRaise = contextStrategies.VALUE_4BET.has(hand) || handRank <= 6;
      
      if (engine.currentStreetRaises >= 3) {
        // Facing 4-Bet: Only AA, KK, QQ, AKs raise. Others call.
        canRaise = handRank <= 4;
      }
      if (engine.currentStreetRaises >= 4) {
        // Facing 5-Bet+: Only AA, KK raise.
        canRaise = handRank <= 2;
      }

      if (canRaise) {
        return { action: 'raise', amount: currentBet * 2.3, insight: `Value 4-Bet+ (${posKey})` };
      }
      if (contextStrategies.CALL.has(hand) || handRank <= 12) {
        return { action: 'call', insight: `GTO call ${engine.currentStreetRaises}-Bet (${posKey})` };
      }
    }
    if (handRank <= 12) return { action: 'call', insight: `Strong Defense (Rank:${handRank})` };
    return { action: 'fold', insight: `Fold to ${engine.currentStreetRaises}-Bet` };
  }

  // B. Defending vs Open / Squeeze
  const vsKey = `VS_${aggPos.toUpperCase()}`;
  const defenseMatrix = matrix.DEFENSE[vsKey] ? matrix.DEFENSE[vsKey][myPosGTO] : null;

  if (defenseMatrix) {
    if (typeof defenseMatrix === 'object') {
      if (defenseMatrix.VALUE_3BET.has(hand)) {
        return { action: 'raise', amount: currentBet * 3.5, insight: `GTO Value 3-Bet (vs ${aggPos})` };
      }
      if (defenseMatrix.BLUFF_3BET.has(hand) && Math.random() < 0.3) {
        return { action: 'raise', amount: currentBet * 3.3, insight: `GTO Bluff 3-Bet (vs ${aggPos})` };
      }
      if (defenseMatrix.CALL.has(hand)) {
        return { action: 'call', insight: `GTO Call (vs ${aggPos})` };
      }
    } else if (defenseMatrix instanceof Set && defenseMatrix.has(hand)) {
       return { action: 'call', insight: `GTO Call (vs ${aggPos})` };
    }
  }

  // Fallback
  if (handRank <= 7) return { action: 'raise', amount: currentBet * 3, insight: 'Premium Value Raise' };
  if (handRank <= 20 && callAmount > 0 && callAmount / bb <= 15) return { action: 'call', insight: 'Marginal Defense' };

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

function getCanonicalHand(hand) {
  const ranks = '23456789TJQKA';
  if (!hand || hand.length < 2) return "";
  const r1 = hand[0][0], r2 = hand[1][0];
  const v1 = ranks.indexOf(r1), v2 = ranks.indexOf(r2);
  return (v1 > v2) ? hand[0] + hand[1] : hand[1] + hand[0];
}
