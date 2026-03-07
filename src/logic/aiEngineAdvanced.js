import { evaluateHand, calculateOuts, analyzeBoardTexture, getDrawCategory, getHandCategory, getStartingHandRank, getStartingHandRank96Max, getStartingHandRankHeadsup } from './poker.js';
import { getAIChatDialogue } from './AIChatSystem.js';
import { GTO_RANGES } from './GTORanges.js';
import { getUnifiedAction } from './aiEngine/aiBrainHub.js';

function expandRange(rangeStr) {
  if (!rangeStr) return [];
  const ranges = rangeStr.split(',').map(s => s.trim());
  let result = new Set();
  const ranksStr = '23456789TJQKA';

  const getRankVal = (r) => ranksStr.indexOf(r);
  const getRankChar = (v) => ranksStr[v];

  const addCombo = (r1, r2, type) => {
    if (type === 's') {
      ['s', 'h', 'd', 'c'].forEach(suit => {
        result.add(r1 + suit + r2 + suit);
      });
    } else if (type === 'o') {
      ['s', 'h', 'd', 'c'].forEach(s1 => {
        ['s', 'h', 'd', 'c'].forEach(s2 => {
          if (s1 !== s2) result.add(r1 + s1 + r2 + s2);
        });
      });
    } else if (type === 'pair') {
      ['s', 'h', 'd', 'c'].forEach((s1, idx1) => {
        ['s', 'h', 'd', 'c'].forEach((s2, idx2) => {
          if (idx1 < idx2) result.add(r1 + s1 + r1 + s2);
        });
      });
    }
  };

  ranges.forEach(r => {
    if (['Any Pair', 'All Pairs'].includes(r)) {
      for (let i = 0; i < 13; i++) {
        addCombo(getRankChar(i), getRankChar(i), 'pair');
      }
      return;
    }
    if (['Suited Connectors', 'Any Suited Connectors'].includes(r)) {
      for (let i = 0; i < 12; i++) {
        addCombo(getRankChar(i + 1), getRankChar(i), 's');
      }
      return;
    }
    if (['Suited Broadways', 'Any Suited Broad'].includes(r)) {
      for (let i = 8; i <= 11; i++) {
        for (let j = i + 1; j <= 12; j++) {
          addCombo(getRankChar(j), getRankChar(i), 's');
        }
      }
      return;
    }
    if (['Any Broad', 'Broadways'].includes(r)) {
      for (let i = 8; i <= 11; i++) {
        for (let j = i + 1; j <= 12; j++) {
          addCombo(getRankChar(j), getRankChar(i), 's');
          addCombo(getRankChar(j), getRankChar(i), 'o');
        }
      }
      return;
    }
    if (['One Gappers', 'Suited One Gappers'].includes(r)) {
      for (let i = 0; i < 11; i++) {
        addCombo(getRankChar(i + 2), getRankChar(i), 's');
      }
      return;
    }
    if (['Any Suited', 'Any Two Suited'].includes(r)) {
      for (let i = 0; i < 12; i++) {
        for (let j = i + 1; j < 13; j++) {
          addCombo(getRankChar(j), getRankChar(i), 's');
        }
      }
      return;
    }

    if (r.length === 3 && r.endsWith('+') && r[0] === r[1]) {
      const startRank = getRankVal(r[0]);
      for (let i = startRank; i <= 12; i++) {
        addCombo(getRankChar(i), getRankChar(i), 'pair');
      }
    } else if (r.includes('-') && r[0] === r[1] && r.split('-')[1][0] === r.split('-')[1][1]) {
      let [start, end] = r.split('-');
      let startVal = getRankVal(start[0]);
      let endVal = getRankVal(end[0]);
      if (startVal > endVal) [startVal, endVal] = [endVal, startVal];
      for (let i = startVal; i <= endVal; i++) {
        addCombo(getRankChar(i), getRankChar(i), 'pair');
      }
    } else if (r.length === 2 && r[0] === r[1]) {
      addCombo(r[0], r[0], 'pair');
    } else {
      if (r.includes('-')) {
        let [start, end] = r.split('-');
        let type = start.slice(-1);
        let highCard = start[0];
        let startKicker = start[1];
        let endKicker = end[1];
        let startKval = getRankVal(startKicker);
        let endKval = getRankVal(endKicker);
        if (startKval > endKval) [startKval, endKval] = [endKval, startKval];
        for (let k = startKval; k <= endKval; k++) {
          if (getRankVal(highCard) === k) continue;
          addCombo(highCard, getRankChar(k), type);
        }
      } else if (r.endsWith('+')) {
        let base = r.slice(0, -1);
        let type = base.slice(-1);
        let highCard = base[0];
        let kicker = base[1];
        let highVal = getRankVal(highCard);
        let kickerVal = getRankVal(kicker);
        for (let k = kickerVal; k < highVal; k++) {
          addCombo(highCard, getRankChar(k), type);
        }
      } else {
        let type = r.slice(-1);
        let c1 = r[0];
        let c2 = r[1];
        addCombo(c1, c2, type);
      }
    }
  });

  return Array.from(result);
}

let PARSED_MATRIX = null;

function getParsedMatrix() {
  if (PARSED_MATRIX) return PARSED_MATRIX;
  PARSED_MATRIX = {};
  PARSED_MATRIX.OPEN = {};
  for (const [pos, rangeStr] of Object.entries(GTO_RANGES.OPEN)) {
    PARSED_MATRIX.OPEN[pos] = new Set(expandRange(rangeStr));
  }
  for (const key of Object.keys(GTO_RANGES)) {
    if (key.startsWith('VS_')) {
      PARSED_MATRIX[key] = {};
      const scenario = GTO_RANGES[key];
      for (const [heroPos, strategies] of Object.entries(scenario)) {
        PARSED_MATRIX[key][heroPos] = {};
        for (const [stratKey, rangeStr] of Object.entries(strategies)) {
          if (rangeStr === 'Locked') {
            PARSED_MATRIX[key][heroPos][stratKey] = 'Locked';
          } else {
            PARSED_MATRIX[key][heroPos][stratKey] = new Set(expandRange(rangeStr));
          }
        }
      }
    }
  }
  PARSED_MATRIX.VS_3BET = {};
  for (const [pos, strategies] of Object.entries(GTO_RANGES.VS_3BET)) {
    PARSED_MATRIX.VS_3BET[pos] = {};
    for (const [stratKey, rangeStr] of Object.entries(strategies)) {
      PARSED_MATRIX.VS_3BET[pos][stratKey] = new Set(expandRange(rangeStr));
    }
  }
  PARSED_MATRIX.SHORT_STACK = {};
  for (const [key, rangeStr] of Object.entries(GTO_RANGES.SHORT_STACK)) {
    PARSED_MATRIX.SHORT_STACK[key] = new Set(expandRange(rangeStr));
  }
  return PARSED_MATRIX;
}

function getMaxHandBudget(equity, potSize) {
  // [v9] Strategic Budgeting based on aiAdvanceEngine.md
  if (equity >= 0.95) return potSize * 3.0;
  if (equity >= 0.85) return potSize * 2.0;
  if (equity >= 0.75) return potSize * 1.4;
  if (equity >= 0.65) return potSize * 1.2;
  if (equity >= 0.55) return potSize * 0.8;
  if (equity >= 0.35) return potSize * 0.35;
  return potSize * 0.15;
}

function getCanonicalHand(hand) {
  const ranks = '23456789TJQKA';
  if (!hand || hand.length < 2) return "";
  const r1 = hand[0][0];
  const r2 = hand[1][0];
  const v1 = ranks.indexOf(r1);
  const v2 = ranks.indexOf(r2);
  if (v1 > v2) return hand[0] + hand[1];
  if (v2 > v1) return hand[1] + hand[0];
  const suits = 'shdc';
  const s1 = suits.indexOf(hand[0][1]);
  const s2 = suits.indexOf(hand[1][1]);
  if (s1 < s2) return hand[0] + hand[1];
  return hand[1] + hand[0];
}

export const getAdvancedAIAction = (player, engine) => {
  // [v10] Delegate to the new modular Brain Hub
  const decision = getUnifiedAction(player, engine);

  const action = {
    ...decision,
    type: decision.action || 'fold',
    amount: decision.amount || 0,
    insight: decision.insight || "Processing...",
    dialogue: decision.dialogue || '',
    exploitTrigger: decision.exploitTrigger || null,
    rangeEstimate: decision.rangeEstimate || ''
  };

  const pName = player.name.toUpperCase();
  let currentBet = engine.potManager ? engine.potManager.currentRoundBet : engine.currentRoundBet;
  
  // Normalization & Validation (Same as before)
  if (action.type === 'raise') {
    action.amount = Math.floor(action.amount);
    if (action.amount > player.chips + player.currentBet) {
      action.amount = player.chips + player.currentBet;
    }
    if (action.amount <= currentBet && currentBet > 0) {
      action.type = 'call';
      action.amount = currentBet;
      action.insight += " (Norm)";
    }
  } else if (action.type === 'call') {
    action.amount = engine.potManager ? engine.potManager.currentRoundBet : engine.currentRoundBet;
  } else if (action.type === 'check') {
    action.amount = 0;
  }

  if (action.type === 'raise' && action.amount >= player.chips + player.currentBet) {
    action.amount = player.chips + player.currentBet;
    action.type = 'all_in';
  }

  if (Math.random() < 0.25) action.dialogue = getAIChatDialogue(action.type, player.name, action.insight);
  
  let delay = 1000 + Math.random() * 3000;
  if (action.type === 'fold') delay = 1500 + Math.random() * 3500;
  if (engine.state === 'PREFLOP') delay /= 2;

  return { ...action, delay };
};

function getUniversalPreflopAction(player, engine, myPos, hand, matrix, getPosNameFn, playerCount) {
  const bb = engine.bb;
  const currentBet = engine.potManager ? engine.potManager.currentRoundBet : engine.currentRoundBet;
  const callAmount = currentBet - player.currentBet;
  const isUnopened = currentBet <= bb && engine.currentStreetRaises === 0;
  const handRank = getStartingHandRank(player.hand); // [FIX] Move up

  const mapPosToGTO = (pos) => {
    if (!pos) return 'UTG';
    const p = pos.toUpperCase();
    if (p.includes('EP') || p.includes('UTG') || p === 'UTG') return 'UTG';
    if (p.includes('MP') || p.includes('HJ') || p.includes('UTG+1')) return 'MP';
    if (p.includes('CO') || p === 'HJ') return 'CO';
    if (p.includes('BTN') || p.includes('BU')) return 'BTN';
    if (p.includes('SB')) return 'SB';
    if (p.includes('BB')) return 'BB';
    return 'UTG';
  };
  const myPosGTO = mapPosToGTO(myPos);
  const effectiveStackBB = player.chips / bb;
  const isShortStack = effectiveStackBB < 25;

  if (isUnopened) {
    if (isShortStack) {
      const rangeSet = matrix.SHORT_STACK.OPEN;
      if (rangeSet && rangeSet.has(hand)) {
        return { action: 'raise', amount: bb * 2.2, insight: `ShortStack Open (${myPos})`, exploitTrigger: null, rangeEstimate: 'ShortStack RFI' };
      }
      if (effectiveStackBB < 12 && ["88", "99", "TT", "JJ", "QQ", "KK", "AA", "AKs", "AKo"].includes(hand)) {
        return { action: 'raise', amount: player.chips, insight: 'ShortStack Shove', exploitTrigger: null, rangeEstimate: 'ShortStack Shove' };
      }
      return { action: 'fold', insight: `ShortStack Fold (${myPos})`, exploitTrigger: null, rangeEstimate: '' };
    }

    const rangeSet = matrix.OPEN[myPosGTO];
    let size = 2.5;
    if (myPosGTO === 'SB') size = 3.0;
    else if (myPosGTO === 'BTN') size = 2.2;

    const pot = engine.potManager ? engine.potManager.pot : engine.pot;
    const blindMoney = (bb * 1.5);
    const limperMoney = Math.max(0, pot - blindMoney);
    const amount = (bb + limperMoney) * size; // [FIX] Restore missing variable

    if (limperMoney > 0) {
      // Isolate Limpers
      let isoThreshold = 25;
      if (myPosGTO === 'BTN') isoThreshold = 45;
      else if (myPosGTO === 'BB') isoThreshold = 35;
      else if (myPosGTO === 'SB') isoThreshold = 40;

      if (handRank <= isoThreshold) {
        return { action: 'raise', amount: bb * 4 + limperMoney, insight: `Isolate Limpers (${myPos}, Rank:${handRank})`, exploitTrigger: 'Station', rangeEstimate: `Top ${isoThreshold}%` };
      }
      if (myPosGTO === 'BB') return { action: 'check', insight: `GTO check (${myPos})`, exploitTrigger: null, rangeEstimate: '' };
    }

    if (rangeSet && rangeSet.has(hand)) {
      return { action: 'raise', amount, insight: `GTO Open (${myPos}->${myPosGTO})`, exploitTrigger: null, rangeEstimate: `${myPosGTO} RFI Range` };
    }

    if (myPosGTO === 'BTN' && handRank <= 90) return { action: 'raise', amount, insight: `RFI Override BTN (Rank:${handRank})`, exploitTrigger: null, rangeEstimate: 'Wide BTN' };
    if (myPosGTO === 'CO' && handRank <= 55) return { action: 'raise', amount, insight: `RFI Override CO (Rank:${handRank})`, exploitTrigger: null, rangeEstimate: 'CO Fallback' };
    if (myPosGTO === 'MP' && handRank <= 33) return { action: 'raise', amount, insight: `RFI Override MP (Rank:${handRank})`, exploitTrigger: null, rangeEstimate: 'MP Fallback' };
    if (myPosGTO === 'UTG' && handRank <= 20) return { action: 'raise', amount, insight: `RFI Override UTG (Rank:${handRank})`, exploitTrigger: null, rangeEstimate: 'UTG Fallback' };

    // [v5] Blind Stealing Exploit: BTN/CO vs Tight Blinds
    if (['BTN', 'CO'].includes(myPosGTO)) {
      const blinds = engine.players.filter(p => {
        const pPos = getPosNameFn(engine.players.indexOf(p));
        return (myPosGTO === 'BTN' && ['SB', 'BB'].includes(pPos)) || (myPosGTO === 'CO' && ['BTN', 'SB', 'BB'].includes(pPos));
      });
      const areBlindsTight = blinds.every(b => (b.stats.vpipCount / (b.stats.handsPlayed || 1)) < 0.25);
      if (areBlindsTight) {
        let stealThreshold = (myPosGTO === 'BTN') ? 100 : 65; // Expand significantly
        if (handRank <= stealThreshold) {
          return { action: 'raise', amount, insight: `Steal Exploit (${myPosGTO} vs Tight Blinds)`, exploitTrigger: 'Tight', rangeEstimate: 'Steal Range' };
        }
      }
    }

    if (myPosGTO === 'BB') {
      const pot = engine.potManager ? engine.potManager.pot : engine.pot;
      const blindMoney = (engine.bb || engine.bigBlind) * 1.5;
      const limperMoney = Math.max(0, pot - blindMoney);
      if (limperMoney > 0 && handRank <= 35) {
        return { action: 'raise', amount: bb * 4 + limperMoney, insight: `Isolate Limpers (BB, Rank:${handRank})`, exploitTrigger: 'Station', rangeEstimate: 'Top 35%' };
      }
      return { action: 'check', insight: `GTO check (${myPos})`, exploitTrigger: null, rangeEstimate: '' };
    }
    else return { action: 'fold', insight: `GTO Fold (${myPos})`, exploitTrigger: null, rangeEstimate: '' };
  }

  // --- [FIX] Consolidated Preflop Defense Logic ---
  const aggressorId = engine.aggressor;
  const isStreetStarted = player.totalWagered > bb;

  if (callAmount > 0) {
    const activePlayers = engine.players.filter(p => !p.isFolded);
    const lastRaiser = activePlayers.find(p => p.currentBet === currentBet && p.id !== player.id);
    const aggIdx = lastRaiser ? engine.players.indexOf(lastRaiser) : -1;
    const aggPos = aggIdx !== -1 ? getPosNameFn(aggIdx) : 'UTG';
    const aggPosGTO = mapPosToGTO(aggPos);

    // 1. DEFENDING VS 3-BET / 4-BET+ (I have already raised/3-bet)
    // - engine.currentStreetRaises >= 2 means someone re-raised.
    // - isStreetStarted means I am the one who was re-raised.
    if (engine.currentStreetRaises >= 2 && isStreetStarted) {
      let isIP = false;
      const dealerIdx = engine.dealerIndex;
      if (lastRaiser) {
        const myIdx = engine.players.indexOf(player);
        const villainIdx = engine.players.indexOf(lastRaiser);
        const myDist = (myIdx - dealerIdx + playerCount) % playerCount;
        const villainDist = (villainIdx - dealerIdx + playerCount) % playerCount;
        isIP = myDist > villainDist;
      } else {
        isIP = ['BTN', 'CO'].includes(myPos);
      }

      const posKey = isIP ? 'IP' : 'OOP';
      const contextStrategies = matrix.VS_3BET[posKey];

      // Aggressor Profiling
      const rawStats = lastRaiser ? lastRaiser.stats : {};
      const handsPlayed = rawStats.handsPlayed || 0;
      const profConfidence = Math.min(1, handsPlayed / 12);
      const calc3Bet = handsPlayed > 0 ? ((rawStats.threeBetCount || 0) / handsPlayed) : 0.11;
      const opp3BetFreq = (calc3Bet * profConfidence) + (0.11 * (1 - profConfidence));

      if (contextStrategies) {
        // A. PREMIUM VALUE 4-BET+
        if (contextStrategies.VALUE_4BET.has(hand) || handRank <= 6) {
          if (engine.currentStreetRaises <= 4) {
            return { action: 'raise', amount: currentBet * 2.3, insight: `GTO Value 4-Bet+ (${posKey})`, exploitTrigger: null, rangeEstimate: '4B+ Value' };
          } else {
            return { action: 'raise', amount: player.chips, insight: `Stack Off Value (Rank:${handRank})`, exploitTrigger: null, rangeEstimate: 'Premium StackOff' };
          }
        }

        // B. BLUFF 4-BET (Capped to prevent infinite bluff war)
        if (contextStrategies.BLUFF_4BET.has(hand) && engine.currentStreetRaises <= 2) {
          let bluffFreqadj = 0.25; // [v7] Reduced from 0.4 - 0.6 to balance 3B:4B ratio
          if (opp3BetFreq > 0.15) bluffFreqadj = 0.35;
          if (Math.random() < bluffFreqadj) {
            return { action: 'raise', amount: currentBet * 2.22, insight: `GTO 4-Bet Bluff (${posKey}, Adj:${bluffFreqadj})`, exploitTrigger: null, rangeEstimate: '4B Bluff' };
          }
        }

        // C. GTO CALL (Defense)
        if (contextStrategies.CALL.has(hand)) {
          return { action: 'call', insight: `GTO Call ${engine.currentStreetRaises}-Bet (${posKey})`, exploitTrigger: null, rangeEstimate: 'Call Defense' };
        }
      }

      // D. FALLBACK EXPLOITATIVE DEFENSE
      if (handRank <= 10) return { action: 'raise', amount: player.chips, insight: `Stack Off (Rank:${handRank})`, exploitTrigger: null, rangeEstimate: 'Premium StackOff' };
      let callThreshold = 18; // Tightened from 22
      if (opp3BetFreq > 0.15) callThreshold = 25; // Tightened from 30
      const callBB = callAmount / engine.bb;
      // Tightened: Only call up to 30bb with marginal hands, or if rank is very strong (<=12)
      if (handRank <= callThreshold && (callBB <= 30 || handRank <= 12)) {
        return { action: 'call', insight: `Fallback Defense (Rank:${handRank})`, exploitTrigger: null, rangeEstimate: 'Strong Defense' };
      }
      return { action: 'fold', insight: `Fold to ${engine.currentStreetRaises}-Bet (No Range)`, exploitTrigger: null, rangeEstimate: '' };
    }

    // 2. DEFENDING VS OPEN / SQUEEZE (First time defending this street)
    const callers = activePlayers.filter(p => p.currentBet === currentBet && p.id !== lastRaiser.id && p.id !== player.id).length;
    const isSqueezeSpot = callers >= 1;

    // Aggressor Profiling
    const rawStats = lastRaiser ? lastRaiser.stats : {};
    const handsPlayed = rawStats.handsPlayed || 0;
    const profilingConfidence = Math.min(1, handsPlayed / 10);
    const calcVPIPPre = handsPlayed > 0 ? ((rawStats.vpipCount || 0) / handsPlayed) : 0.30;
    const oppVPIP = (calcVPIPPre * profilingConfidence) + (0.30 * (1 - profilingConfidence));
    const oppPFR = handsPlayed > 0 ? ((rawStats.pfrCount || 0) / handsPlayed) : 0.20;

    let shiftedAggPosGTO = aggPosGTO;
    if (oppVPIP > 0.60) shiftedAggPosGTO = 'BTN';
    else if (oppVPIP > 0.45 && ['UTG', 'MP'].includes(aggPosGTO)) shiftedAggPosGTO = 'CO';

    if (isSqueezeSpot) {
      const vsKey = `VS_${shiftedAggPosGTO}`;
      const strategies = matrix[vsKey] ? matrix[vsKey][myPosGTO] : null;
      if (strategies) {
        if (strategies.VALUE_3BET && strategies.VALUE_3BET.has(hand)) {
          const isOOP = ['SB', 'BB'].includes(myPos);
          let baseSize = isOOP ? 4.5 : 3.5;
          let squeezeSize = baseSize + (callers * 1.0);
          return { action: 'raise', amount: currentBet * squeezeSize, insight: `GTO Squeeze Value (${myPos} vs ${aggPos}+${callers})`, exploitTrigger: null, rangeEstimate: 'Squeeze Value' };
        }
        if (strategies.BLUFF_3BET && strategies.BLUFF_3BET.has(hand)) {
          // [v5] Increased Squeeze Bluff frequency
          if (Math.random() < 0.8) {
            const isOOP = ['SB', 'BB'].includes(myPos);
            let baseSize = isOOP ? 4.5 : 3.5;
            let squeezeSize = baseSize + (callers * 1.0);
            return { action: 'raise', amount: currentBet * squeezeSize, insight: `GTO Squeeze Bluff (${myPos} vs ${aggPos}+${callers})`, exploitTrigger: null, rangeEstimate: 'Squeeze Bluff' };
          }
        }
        if (strategies.CALL && strategies.CALL !== 'Locked' && strategies.CALL.has(hand)) {
          // [v6] Squeeze Overdrive: Convert 40% of squeeze-calls to squeeze-raises
          if (Math.random() < 0.4) {
            const isOOP = ['SB', 'BB'].includes(myPos);
            let baseSize = isOOP ? 4.5 : 3.5;
            let squeezeSize = baseSize + (callers * 1.2); // Slightly bigger sizing for weight
            return { action: 'raise', amount: currentBet * squeezeSize, insight: `GTO Squeeze Overdrive (${myPos} vs ${aggPos}+${callers})`, exploitTrigger: null, rangeEstimate: 'Squeeze Overdrive' };
          }
          return { action: 'call', insight: `GTO Overcall (${myPos})`, exploitTrigger: null, rangeEstimate: 'Overcall Range' };
        }
      }

      if (handRank <= 20 && engine.currentStreetRaises <= 2) { // Tightened from 25
        return { action: 'raise', amount: currentBet * 5.0, insight: `Fallback Squeeze (Rank:${handRank})`, exploitTrigger: 'Aggression', rangeEstimate: 'Strong Squeeze' };
      }
      if (handRank <= 35 && callAmount / engine.bb < 15) { // Tightened from 45 and 20bb
        return { action: 'call', insight: `Fallback Overcall (Rank:${handRank})`, exploitTrigger: null, rangeEstimate: 'Marginal Overcall' };
      }
      return { action: 'fold', insight: 'Fold to Raise+Callers', exploitTrigger: null, rangeEstimate: '' };
    }

    // Normal Defense vs Open
    const vsKey = `VS_${shiftedAggPosGTO}`;
    const strategies = matrix[vsKey] ? matrix[vsKey][myPosGTO] : null;

    if (strategies) {
      const rng = Math.random();
      let bluffBound = 0.8;
      if (oppPFR < 0.15) bluffBound = 1.0; // [v5] Max aggression vs Nits
      else if (oppPFR < 0.22 || oppVPIP > 0.22 || oppPFR > 0.18) bluffBound = 0.95;

      // [v4] Aggressive Blind Defense vs BTN/CO
      if (['SB', 'BB'].includes(myPos) && ['BTN', 'CO'].includes(aggPosGTO)) bluffBound = Math.max(bluffBound, 0.95); // [v5] 0.9 -> 0.95

      if (["AA", "KK", "QQ", "AKs", "AKo"].includes(hand)) {
        return { action: 'raise', amount: currentBet * 3.5, insight: `Premium Value 3-Bet (${aggPos})`, exploitTrigger: null, rangeEstimate: 'Premium Range' };
      }
      if (strategies.VALUE_3BET && strategies.VALUE_3BET.has(hand)) {
        let sizing = (['SB', 'BB'].includes(myPos)) ? 4.0 : 3.0;
        return { action: 'raise', amount: currentBet * sizing, insight: `GTO Value 3-Bet vs ${aggPos}`, exploitTrigger: null, rangeEstimate: 'GTO Value 3B' };
      }
      if (strategies.BLUFF_3BET && strategies.BLUFF_3BET.has(hand)) {
        if (rng < bluffBound) {
          let sizing = (['SB', 'BB'].includes(myPos)) ? 4.0 : 3.0;
          return { action: 'raise', amount: currentBet * sizing, insight: `GTO Bluff 3-Bet vs ${aggPos} (Adj:${bluffBound})`, exploitTrigger: null, rangeEstimate: 'GTO Bluff 3B' };
        }
      }
      if (strategies.CALL && strategies.CALL !== 'Locked' && strategies.CALL.has(hand)) {
        // [v6.2] Aggressive conversion: 0.25 -> 0.45 to hit 7-9% target
        let convertTo3BetFreq = 0.20;
        if (['BTN', 'CO'].includes(shiftedAggPosGTO)) convertTo3BetFreq = 0.45;
        if (oppPFR < 0.22) convertTo3BetFreq += 0.20;

        if (Math.random() < convertTo3BetFreq) {
          let sizing = (['SB', 'BB'].includes(myPos)) ? 4.0 : 3.0;
          return { action: 'raise', amount: currentBet * sizing, insight: `GTO Call -> 3-Bet Overdrive (vs ${aggPos})`, exploitTrigger: null, rangeEstimate: '3B Overdrive' };
        }

        if (handRank <= 18) return { action: 'raise', amount: currentBet * 3.5, insight: `Premium Call -> 3-Bet (vs ${aggPos})`, exploitTrigger: null, rangeEstimate: 'Premium 3B' };
        return { action: 'call', insight: `GTO Call vs ${aggPos}`, exploitTrigger: null, rangeEstimate: 'GTO Call Range' };
      }
    }

    // Fallback Defense
    let fallback3BRank = 22;
    if (oppPFR < 0.22) fallback3BRank = 33; // [v7] Linear 3-Bet against TAG/Nit openers (Top 20%)

    if (handRank <= fallback3BRank) return { action: 'raise', amount: currentBet * 3.3, insight: `Exploit 3-Bet (vs ${aggPos}, Rank:${handRank})`, exploitTrigger: 'Tight', rangeEstimate: 'Exploit 3B' };
    if (handRank <= 35 && (callAmount / engine.bb <= 12)) return { action: 'call', insight: `Fallback Marginal Call (Rank:${handRank})`, exploitTrigger: null, rangeEstimate: 'Marginal Call' };

    return { action: 'fold', insight: `GTO Fold vs ${aggPos}`, exploitTrigger: null, rangeEstimate: '' };
  }

  // 3. DEFAULT ACTIONS
  if (callAmount <= 0) return { action: 'check', insight: 'Check (Default Fallback)', exploitTrigger: null, rangeEstimate: '' };
  return { action: 'fold', insight: 'Fold (Default Fallback)', exploitTrigger: null, rangeEstimate: '' };
}

function getPostflopAction(player, engine, myPos) {
  const board = engine.board;
  if (!board || board.length < 3) return { action: 'check', insight: 'Error: No Board', exploitTrigger: null, rangeEstimate: '' };

  const hand = player.hand;
  const evalResult = evaluateHand([...hand, ...board]);
  const drawCategory = getDrawCategory(hand, board);
  const category = getHandCategory(hand, board, evalResult);

  const currentBet = engine.potManager ? engine.potManager.currentRoundBet : engine.currentRoundBet;
  const callAmount = currentBet - player.currentBet;
  const potSize = engine.pot;
  const isCheckable = callAmount <= 0;
  const isAggressor = engine.aggressor === player.id;
  const alivePlayers = engine.players.filter(p => !p.isFolded).length;
  const street = engine.state;
  const boardAnalysis = analyzeBoardTexture(board);

  // 1. Opponent Profiling
  const opponent = engine.players.find(p => p.isHuman && !p.isFolded) || engine.players.find(p => p.id !== player.id && !p.isFolded);
  const rawStats = (opponent && opponent.stats) ? opponent.stats : {};
  const handsPlayed = rawStats.handsPlayed || 0;
  const profilingConfidence = Math.min(1, handsPlayed / 10);
  const defStats = { vPIP: 0.30, foldToFlop: 0.5, aggressionFactor: 1.5 };

  const calcVPIP = handsPlayed > 0 ? ((rawStats.vpipCount || 0) / handsPlayed) : 0.30;
  const f2fCount = (rawStats.foldsPerStreet && rawStats.foldsPerStreet.FLOP) || 0;
  const calcF2F = handsPlayed > 0 ? (f2fCount / Math.max(1, handsPlayed * 0.4)) : 0.5;

  const oppVPIP = (calcVPIP * profilingConfidence) + (defStats.vPIP * (1 - profilingConfidence));
  const oppF2F = (calcF2F * profilingConfidence) + (defStats.foldToFlop * (1 - profilingConfidence));
  const oppAF = (rawStats.betsCount || 0) / Math.max(1, rawStats.callsCount || 0);

  // 2. My Stats & Setup
  const AF = player.class?.AF || 1.5;
  let bluffFreq = (AF - 2.5) * 0.1 + 0.05;
  let insight = "";
  let exploitTrigger = null;
  let rangeEstimate = `Top ${Math.round(oppVPIP * 100)}%`;

  // 3. Equity Calculation & Adjustments
  let estimatedEquity = 0;
  if (category === 'NUTS') estimatedEquity = 0.95;
  else if (category === 'MONSTER') estimatedEquity = 0.85;
  else if (category === 'STRONG') estimatedEquity = 0.70;
  else if (category === 'GOOD') estimatedEquity = 0.5;
  else if (category === 'MARGINAL') estimatedEquity = 0.35;
  else if (category === 'WEAK') estimatedEquity = 0.20;
  else if (category === 'ACE_HIGH') estimatedEquity = 0.10;
  else estimatedEquity = 0.05;

  let drawBonus = 0;
  if (drawCategory === 'DRAW_MONSTER') drawBonus = 0.25;
  else if (drawCategory === 'DRAW_STRONG') drawBonus = 0.15;
  else if (drawCategory === 'DRAW_WEAK') drawBonus = 0.05;

  const streetsLeft = street === 'FLOP' ? 2 : (street === 'TURN' ? 1 : 0);
  drawBonus *= (streetsLeft / 2);
  estimatedEquity = Math.min(0.98, estimatedEquity + drawBonus);

  // [v9] Board Risk Inferencing (Hand Memory of Danger)
  let dangerPenalty = 0;
  if (boardAnalysis.maxSuit >= 3 && drawCategory !== 'DRAW_MONSTER' && !['NUTS', 'MONSTER', 'STRONG'].includes(category)) {
    dangerPenalty += 0.12; 
    insight += " [Flush-Danger]";
  }
  if (boardAnalysis.maxRankCount >= 2 && ['GOOD', 'MARGINAL', 'WEAK'].includes(category)) {
    dangerPenalty += 0.08;
    insight += " [Paired-Danger]";
  }
  estimatedEquity = Math.max(0.05, estimatedEquity - dangerPenalty);

  // [v9] Strategic Equity Budgeting
  const handBudget = getMaxHandBudget(estimatedEquity, potSize);
  const totalWageredSoFar = player.totalWagered || 0;
  const isOverBudgetForCall = (totalWageredSoFar + callAmount) > handBudget;

  const totalPotAfterCall = potSize + callAmount;
  let potOdds = callAmount > 0 ? (callAmount / totalPotAfterCall) : 0;
  let requiredEquity = potOdds;
  if (alivePlayers > 2) requiredEquity += (alivePlayers - 2) * 0.05;

  const startingStack = player.chips + player.totalWagered;
  const commitmentRatio = startingStack > 0 ? (player.totalWagered / startingStack) : 0;
  const spr = potSize > 0 ? (player.chips / potSize) : 20;

  const isManiac = oppVPIP > 0.42 && (oppAF > 3.0 || oppAF === Infinity);
  const isStation = (oppVPIP > 0.45 && oppAF < 0.8) || (oppVPIP > 0.60 && oppF2F < 0.3);

  let raiseEquityThreshold = requiredEquity + 0.3;

  // --- 3.5 NPC Playstyle Adjustments ---
  // lower AF > 3 = Overestimating your own hand, lower AF < 3 = Underestimating your own hand
  raiseEquityThreshold += (3 - AF) * 0.1; // lower AF > 3 = raise more, lower AF < 3 = raise less
  // const vPIP = player.class.vPIP || 0.3;
  // const wtsdThreshold = (street === 'PREFLOP' ? vPIP : wtsd) / 2
  // requiredEquity = Math.max(0, requiredEquity - wtsdThreshold); // higher vPIP|wtsd = loose play, lower vPIP|wtsd = tight play
  if (isManiac) {
    bluffFreq *= 0.2;
    requiredEquity -= 0.12;
    raiseEquityThreshold -= 0.04;
    insight += " [Exp:Maniac]";
    exploitTrigger = "Maniac";
  } else if (isStation) {
    bluffFreq *= 0.05;
    requiredEquity -= 0.06;
    raiseEquityThreshold -= 0.12; // Value Overdrive
    insight += " [Exp:Station]";
    exploitTrigger = "Station";
  } else if (oppF2F > 0.6) {
    bluffFreq += 0.25;
    if (!isCheckable) requiredEquity += 0.12;
    insight += " [Exp:Tight]";
    exploitTrigger = "Tight";
  }

  // (Move safety floor to the end of all adjustments)

  // Board Texture / Range Advantage
  const existAggressor = !!engine.aggressor
  const highCardCount = boardAnalysis.ranks ? boardAnalysis.ranks.filter(r => r >= 9).length : 0;
  const lowCardCount = boardAnalysis.ranks ? boardAnalysis.ranks.filter(r => r < 9).length : 0;
  if (isAggressor) {
    if (street === 'FLOP') {
      const bluffMod = (highCardCount * 0.10) - (lowCardCount * 0.05);
      bluffFreq += bluffMod;
    }
  } else {
    if (existAggressor) raiseEquityThreshold = 120; // don't donk-bet
    // caller advantage (BB, BTN)
    let bluffMod = 0;
    if (street === 'FLOP' && ["BB", "BTN"].includes(myPos)) {
      bluffMod = (highCardCount * 0.10) - (lowCardCount * 0.05);
    }

    if (boardAnalysis.type === 'WET') bluffMod *= 1.5;
    bluffFreq += bluffMod;
  }
  // [v3] Cap bluff frequency to prevent overdrive
  bluffFreq = Math.max(0, Math.min(0.45, bluffFreq));

  // Street adjustments
  if (street === 'TURN') bluffFreq *= 0.66;

  // [EXPLOIT] AF-based bluff catching adjustment
  if (!isCheckable && callAmount > 0) {
    if (oppAF > 4.0) {
      // Toned down: Max 15% reduction vs extreme bluffers
      requiredEquity -= Math.min(0.15, (oppAF - 2.5) * 0.05);
    }
    else if (oppAF > 2.5) requiredEquity -= Math.min(0.10, (oppAF - 2.5) * 0.04);
    else if (oppAF < 0.8) {
      requiredEquity += 0.15; // [v5] 0.10 -> 0.15 (Respect the Nits)
      bluffFreq = 0; // bluff is not good idea
      insight += " (Respect-Nit)";
    }
  }

  if (spr < 1.5 && ['GOOD', 'STRONG', 'MONSTER', 'NUTS'].includes(category)) requiredEquity *= 0.8; // [v4] Only discount if we have something
  else if (spr > 10) requiredEquity *= 1.1;

  if (commitmentRatio > 0.35) {
    // [FIX v4] Drastically reduced commitment bias to prevent "Whale" calls.
    // Cap the discount at 15% (0.85x) instead of 30%.
    requiredEquity *= Math.max(0.85, 1 - (commitmentRatio * 0.15));
    insight += ` [Commt ${(commitmentRatio * 100).toFixed(0)}%]`;
  }

  const raises = engine.currentStreetRaises || 0;
  if (!isCheckable) {
    requiredEquity += raises * 0.08;
    raiseEquityThreshold += raises * 0.15;
    const betToPotRatio = potSize > 0 ? (callAmount / potSize) : 0;
    if (betToPotRatio >= 0.8) requiredEquity += 0.1;

    // [v4] Turn Pressure for marginal hands vs big bets
    if (street === 'TURN' && betToPotRatio >= 0.7 && ['MARGINAL', 'GOOD'].includes(category)) {
      requiredEquity += (boardAnalysis.type === 'WET' ? 0.20 : 0.12); // [v6.2] Final Fold Pressure Boost
      insight += " (Turn-Fold-Pressure)";
    }
  }

  if (callAmount >= player.chips) bluffFreq = 0;
  const isVirtuallyCommitted = callAmount > 0 && (player.chips <= (engine.bb * 2) || (player.chips / (potSize + player.chips) < 0.1));
  if (isVirtuallyCommitted) { requiredEquity = 0; insight += " [Virtually Committed]"; }

  // [RIVER] Additional caution on the river for marginal hands
  if (street === 'RIVER' && !isCheckable && ['GOOD', 'MARGINAL'].includes(category)) {
    requiredEquity += (category === 'MARGINAL' ? 0.12 : 0.07); // [v4] 0.07 -> 0.12 for MARGINAL
  }

  // Cap exploitative requiredEquity reductions to prevent "never folding"
  // Moved to the end to ensure it floor-caps ALL adjustments including AF/SPR/Commitment
  requiredEquity = Math.max(requiredEquity, 0.10);

  insight += ` [Eq:${(estimatedEquity * 100).toFixed(0)}% / Req:${(requiredEquity * 100).toFixed(0)}%]`;

  let action = 'fold';
  let amount = 0;

  if (isCheckable) {
    if (estimatedEquity >= raiseEquityThreshold) { action = 'raise'; insight += " (Value)"; }
    else if (Math.random() < bluffFreq) { action = 'raise'; insight += " (Bluff)"; }
    else { action = 'check'; insight += " (Check)"; }
  } else {
    if (estimatedEquity >= raiseEquityThreshold) {
      if (isManiac && estimatedEquity > 0.65 && street !== 'RIVER') { action = 'call'; insight += " (Call Trap)"; }
      else { action = 'raise'; insight += " (Value Raise)"; }
    } else if (estimatedEquity >= requiredEquity) {
      if (isOverBudgetForCall && !['NUTS', 'MONSTER', 'STRONG'].includes(category)) {
        action = 'fold'; insight += " (Budget Fold)";
      } else {
        action = 'call'; insight += " (Call Odds)";
      }
    } else {
      const isRiverBluffSpot = street === 'RIVER' && !isStation && potSize > engine.bb * 15;
      if (isRiverBluffSpot && Math.random() < (bluffFreq * 1.5)) {
        action = 'raise'; amount = player.chips + 10000; insight += " (Polarized River All-In Bluff)";
      } else if (Math.random() < bluffFreq && street !== 'RIVER' && !isOverBudgetForCall) {
        action = 'raise'; insight += " (Pure Bluff)";
      } else {
        action = 'fold'; insight += " (Fold)";
      }
    }
  }

  if (category === 'BOARD_CHOP') { action = 'call'; insight = "Board Chop"; }

  // --- 5. Sizing ---
  if (action === 'raise') {
    let currentTotalBet = engine.currentRoundBet || 0;
    const bb = engine.bb || engine.bigBlind || 2;

    if (street === 'PREFLOP') {
      if (raises > 0) {
        // [1] Facing Raise (3-Bet / 4-Bet / Squeeze)
        const mult = Math.max(2.2, 4.0 - raises * 0.5); // Slightly smaller multipliers for higher bets
        let baseAmount = currentBet * mult;

        // [v7 Squeeze logic]
        const callers = activePlayers.filter(p => p.currentBet === currentBet && p.id !== player.id).length;
        if (callers > 0) baseAmount += (callers * currentBet);

        amount = Math.floor(baseAmount);
      } else {
        // [2] Open Raise / Isolate
        const openSize = bb * 2.5;
        const pot = engine.potManager ? engine.potManager.pot : engine.pot;
        const limperMoney = Math.max(0, pot - (bb * 1.5));
        const limpers = Math.floor(limperMoney / bb);

        if (limpers > 0) {
          amount = Math.floor(openSize + (limpers * bb) + bb);
        } else {
          amount = Math.floor(openSize);
        }
      }
    } else {
      // Postflop
      if (!isCheckable) {
        const mult = Math.max(2.2, 3.5 - raises * 0.5);
        amount = Math.floor(currentTotalBet * mult);
        amount = Math.max(amount, currentTotalBet * 2);
      } else {
        let potPct = 0.5;
        if (boardAnalysis.type === 'DRY') potPct -= 0.15;
        else if (boardAnalysis.type === 'WET') potPct += 0.25;

        const baseOnEquity = Math.max(estimatedEquity, requiredEquity);
        // const baseOnEquity = estimatedEquity;
        if (baseOnEquity >= 0.9) potPct *= 1.8;
        else if (baseOnEquity >= 0.85) potPct *= 1.5;
        else if (baseOnEquity >= 0.70) potPct *= 1.2;

        if (street === 'FLOP' && boardAnalysis.type === 'DRY') potPct = 0.33;
        else if (street === 'TURN') potPct = Math.max(potPct * 0.5, 0.6);

        amount = Math.floor(potSize * potPct);
        amount = Math.max(amount, bb);
      }
    }
  }

  amount = Math.floor(amount);
  return { action, amount, insight, exploitTrigger, rangeEstimate };
}
