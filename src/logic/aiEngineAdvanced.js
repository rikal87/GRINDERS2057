import { evaluateHand, calculateOuts, analyzeBoardTexture, getDrawCategory, getHandCategory, getStartingHandRank, getStartingHandRank96Max, getStartingHandRankHeadsup } from './poker.js';
import { getAIChatDialogue } from './AIChatSystem.js';
import { CHAT_TRIGGERS } from './persona.js'
import { GTO_RANGES } from './GTORanges.js';

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
  const matrix = getParsedMatrix();
  const hand = getCanonicalHand(player.hand);
  const playerIdx = engine.players.findIndex(p => p.id === player.id);
  const dealerIdx = engine.dealerIndex;
  const playerCount = engine.players.length;

  const getPosName = (idx) => {
    const dist = (idx - dealerIdx + playerCount) % playerCount;
    if (playerCount === 2) return (idx === dealerIdx) ? 'SB' : 'BB';
    const posMap6 = ['BTN', 'SB', 'BB', 'UTG', 'MP', 'CO'];
    return posMap6[dist] || 'MP';
  };

  const myPos = getPosName(playerIdx);
  let decision = { action: 'fold', insight: `GTO Default (${myPos})`, amount: 0 };

  if (engine.state === 'PREFLOP') {
    decision = getUniversalPreflopAction(player, engine, myPos, hand, matrix, getPosName, playerCount);
  } else {
    decision = getPostflopAction(player, engine, myPos);
  }

  const action = {
    type: decision.action || 'fold',
    amount: decision.amount || 0,
    insight: decision.insight || "Processing...",
    dialogue: decision.dialogue || '',
    exploitTrigger: decision.exploitTrigger || null,
    rangeEstimate: decision.rangeEstimate || ''
  };

  const pName = player.name.toUpperCase();
  let currentBet = engine.potManager ? engine.potManager.currentRoundBet : engine.currentRoundBet;
  if (action.type === 'raise') {
    action.amount = Math.floor(action.amount);
    if (action.amount > player.chips + player.currentBet) {
      action.amount = player.chips + player.currentBet;
    }
    if (action.amount <= currentBet && currentBet > 0) {
      action.type = 'call';
      action.amount = currentBet;
      action.insight += " (Downgraded to Call)";
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
    const blindMoney = (engine.bb || engine.bigBlind) * 1.5;
    const limperMoney = Math.max(0, pot - blindMoney);
    const amount = (bb + limperMoney) * size;

    if (rangeSet && rangeSet.has(hand)) {
      return { action: 'raise', amount, insight: `GTO Open (${myPos}->${myPosGTO})`, exploitTrigger: null, rangeEstimate: `${myPosGTO} RFI Range` };
    }

    const handRank = getStartingHandRank(player.hand);
    if (myPosGTO === 'BTN' && handRank <= 85) return { action: 'raise', amount, insight: `RFI Override BTN (Rank:${handRank})`, exploitTrigger: null, rangeEstimate: 'Wide BTN' };
    if (myPosGTO === 'CO' && handRank <= 50) return { action: 'raise', amount, insight: `RFI Override CO (Rank:${handRank})`, exploitTrigger: null, rangeEstimate: 'CO Fallback' };
    if (myPosGTO === 'MP' && handRank <= 33) return { action: 'raise', amount, insight: `RFI Override MP (Rank:${handRank})`, exploitTrigger: null, rangeEstimate: 'MP Fallback' };
    if (myPosGTO === 'UTG' && handRank <= 20) return { action: 'raise', amount, insight: `RFI Override UTG (Rank:${handRank})`, exploitTrigger: null, rangeEstimate: 'UTG Fallback' };

    if (myPosGTO === 'BB') return { action: 'check', insight: `GTO check (${myPos})`, exploitTrigger: null, rangeEstimate: '' };
    else return { action: 'fold', insight: `GTO Fold (${myPos})`, exploitTrigger: null, rangeEstimate: '' };
  }

  const handRank = getStartingHandRank(player.hand);
  const aggressorId = engine.preflopAggressor;
  if (aggressorId && aggressorId !== player.id) {
    const aggPlayer = engine.players.find(p => p.id === aggressorId);
    if (aggPlayer) {
      const aggIdx = engine.players.indexOf(aggPlayer);
      const aggPos = getPosNameFn(aggIdx);
      const aggPosGTO = mapPosToGTO(aggPos);

      const activePlayers = engine.players.filter(p => !p.isFolded);
      const callers = activePlayers.filter(p => p.currentBet === currentBet && p.id !== aggressorId && p.id !== player.id).length;
      const isSqueezeSpot = callers >= 1;

      const rawStats = aggPlayer.stats || {};
      const handsPlayed = rawStats.handsPlayed || 0;
      const oppVPIP = handsPlayed > 10 ? ((rawStats.vpipCount || 0) / handsPlayed) : 0.22;
      const oppPFR = handsPlayed > 10 ? ((rawStats.pfrCount || 0) / handsPlayed) : 0.18;
      const opp3BetFreq = handsPlayed > 10 ? ((rawStats.threeBetCount || 0) / handsPlayed) : 0.08;

      if (isSqueezeSpot) {
        const vsKey = `VS_${aggPosGTO}`;
        const strategies = matrix[vsKey] ? matrix[vsKey][myPosGTO] : null;
        if (strategies) {
          if (strategies.VALUE_3BET && strategies.VALUE_3BET.has(hand)) {
            const isOOP = ['SB', 'BB'].includes(myPos);
            let baseSize = isOOP ? 4.5 : 3.5;
            let squeezeSize = baseSize + (callers * 1.0);
            return { action: 'raise', amount: currentBet * squeezeSize, insight: `GTO Squeeze Value (${myPos} vs ${aggPos}+${callers})`, exploitTrigger: null, rangeEstimate: 'Squeeze Value' };
          }
          if (strategies.BLUFF_3BET && strategies.BLUFF_3BET.has(hand)) {
            if (Math.random() < 0.5) {
              const isOOP = ['SB', 'BB'].includes(myPos);
              let baseSize = isOOP ? 4.5 : 3.5;
              let squeezeSize = baseSize + (callers * 1.0);
              return { action: 'raise', amount: currentBet * squeezeSize, insight: `GTO Squeeze Bluff (${myPos} vs ${aggPos}+${callers})`, exploitTrigger: null, rangeEstimate: 'Squeeze Bluff' };
            }
          }
          if (strategies.CALL && strategies.CALL !== 'Locked' && strategies.CALL.has(hand)) {
            return { action: 'call', insight: `GTO Overcall (${myPos})`, exploitTrigger: null, rangeEstimate: 'Overcall Range' };
          }
        }

        if (handRank <= 20 && engine.currentStreetRaises <= 2) {
          const isLooseAggLocal = oppVPIP > 0.22 || oppPFR > 0.18;
          if (isLooseAggLocal && handRank <= 8) {
            return { action: 'raise', amount: player.chips, insight: `Exploitative All-In Squeeze (Rank:${handRank})`, exploitTrigger: 'Maniac', rangeEstimate: 'Premium Squeeze' };
          }
          return { action: 'raise', amount: currentBet * 4.5, insight: `Fallback Squeeze (Rank:${handRank})`, exploitTrigger: null, rangeEstimate: 'Strong Squeeze' };
        }
        if (handRank <= 35) {
          const callBB = callAmount / engine.bb;
          if (callBB < 15 || handRank <= 10) {
            return { action: 'call', insight: `Fallback Overcall (Rank:${handRank})`, exploitTrigger: null, rangeEstimate: 'Marginal Overcall' };
          }
        }
        return { action: 'fold', insight: 'Fold to Raise+Callers', exploitTrigger: null, rangeEstimate: '' };
      }

      const vsKey = `VS_${aggPosGTO}`;
      const strategies = matrix[vsKey] ? matrix[vsKey][myPosGTO] : null;

      if (strategies) {
        const rng = Math.random();
        let bluffBound = 0.5;
        const isLooseAgg = oppVPIP > 0.22 || oppPFR > 0.18;
        if (isLooseAgg) {
          bluffBound = 0.8;
          if (handRank <= 25) {
            return { action: 'raise', amount: currentBet * 3.5, insight: `Linear Aggression 3-Bet (vs ${aggPos})`, exploitTrigger: 'Maniac', rangeEstimate: 'Linear Aggression' };
          }
        }

        if (["AA", "KK", "QQ", "AKs", "AKo"].includes(hand)) {
          return { action: 'raise', amount: currentBet * 3.5, insight: `Premium Value 3-Bet (${aggPos})`, exploitTrigger: null, rangeEstimate: 'Premium Range' };
        }

        if (strategies.VALUE_3BET && strategies.VALUE_3BET.has(hand)) {
          let sizing = 3.0;
          if (['SB', 'BB'].includes(myPos)) sizing = 4.0;
          return { action: 'raise', amount: currentBet * sizing, insight: `GTO Value 3-Bet vs ${aggPos}`, exploitTrigger: null, rangeEstimate: 'GTO Value 3B' };
        }

        if (strategies.BLUFF_3BET && strategies.BLUFF_3BET.has(hand)) {
          if (rng < bluffBound) {
            let sizing = 3.0;
            if (['SB', 'BB'].includes(myPos)) sizing = 4.0;
            return { action: 'raise', amount: currentBet * sizing, insight: `GTO Bluff 3-Bet vs ${aggPos} (Adj:${bluffBound})`, exploitTrigger: null, rangeEstimate: 'GTO Bluff 3B' };
          }
        }

        if (strategies.CALL && strategies.CALL !== 'Locked' && strategies.CALL.has(hand)) {
          if (handRank <= 16) {
            return { action: 'raise', amount: currentBet * 3.5, insight: `Premium Call -> Forced 3-Bet (vs ${aggPos})`, exploitTrigger: null, rangeEstimate: 'Premium Overcall -> 3B' };
          }
          return { action: 'call', insight: `GTO Call vs ${aggPos}`, exploitTrigger: null, rangeEstimate: 'GTO Call Range' };
        }

        if (oppVPIP > 0.60 && handRank <= 40) {
          return { action: 'call', insight: `Exploitative Call vs Maniac (${aggPos})`, exploitTrigger: 'Maniac', rangeEstimate: 'Hero Call Range' };
        }

        if (handRank <= 60) {
          const potOdds = callAmount > 0 ? callAmount / (engine.pot + callAmount) : 0;
          let rankThreshold = 25;
          if (oppVPIP > 0.4) rankThreshold = 40;
          else if (oppVPIP < 0.25) rankThreshold = 12;
          if (potOdds < 0.25) rankThreshold *= 1.5;
          let aggressiveThreshold = 22;
          if (oppVPIP > 0.45) aggressiveThreshold = 30;
          if (handRank <= aggressiveThreshold) {
            return { action: 'raise', amount: currentBet * 3.0, insight: `Fallback Strong 3-Bet (Rank:${handRank})`, exploitTrigger: null, rangeEstimate: 'Strong 3B' };
          }
          if (handRank <= rankThreshold) {
            return { action: 'call', insight: 'Fallback Strong Call', exploitTrigger: null, rangeEstimate: 'Strong Call' };
          }
        }

        if (handRank <= 35) {
          const callBB = callAmount / engine.bb;
          if (callBB <= 5 || (handRank <= 15 && callBB <= 15)) {
            return { action: 'call', insight: `Fallback Marginal Call (Rank:${handRank})`, exploitTrigger: null, rangeEstimate: 'Marginal Call' };
          }
        }
        return { action: 'fold', insight: `GTO Fold vs ${aggPos}`, exploitTrigger: null, rangeEstimate: '' };
      } else {
        const callBB = callAmount / engine.bb;
        if (handRank <= 15 && engine.currentStreetRaises <= 2) {
          return { action: 'raise', amount: currentBet * 3.0, insight: `Fallback Strong 3-Bet (Rank:${handRank})`, exploitTrigger: null, rangeEstimate: 'Strong 3B' };
        }
        if (handRank <= 30) {
          if (callBB <= 6 || (handRank <= 12 && callBB <= 25)) {
            return { action: 'call', insight: `Fallback Strong Call (Rank:${handRank})`, exploitTrigger: null, rangeEstimate: 'Strong Call' };
          }
        }
        if (callAmount <= 0) return { action: 'check', insight: 'Check (No GTO)', exploitTrigger: null, rangeEstimate: '' };
        return { action: 'fold', insight: 'Fold (No GTO)', exploitTrigger: null, rangeEstimate: '' };
      }
    }
  }

  const dealerIdx = engine.dealerIndex;
  if (engine.preflopAggressor === player.id && engine.currentStreetRaises >= 2 && callAmount > 0) {
    const activePlayers = engine.players.filter(p => !p.isFolded);
    const threeBettor = activePlayers.find(p => p.currentBet === currentBet && p.id !== player.id);
    let isIP = false;
    if (threeBettor) {
      const myIdx = engine.players.indexOf(player);
      const villainIdx = engine.players.indexOf(threeBettor);
      const myDist = (myIdx - dealerIdx + playerCount) % playerCount;
      const villainDist = (villainIdx - dealerIdx + playerCount) % playerCount;
      isIP = myDist > villainDist;
    } else {
      isIP = ['BTN', 'CO'].includes(myPos);
    }

    const posKey = isIP ? 'IP' : 'OOP';
    const contextStrategies = matrix.VS_3BET[posKey];
    const aggStats = threeBettor ? threeBettor.stats : null;
    const handsPlayed = (aggStats && aggStats.handsPlayed) || 0;
    const opp3BetFreq = (handsPlayed > 20) ? ((aggStats.threeBetCount || 0) / handsPlayed) : 0.11;

    if (contextStrategies) {
      if (contextStrategies.VALUE_4BET.has(hand)) {
        return { action: 'raise', amount: currentBet * 2.3, insight: `GTO 4-Bet Value (${posKey} vs 3-Bet)`, exploitTrigger: null, rangeEstimate: '4B Value' };
      }
      if (contextStrategies.BLUFF_4BET.has(hand)) {
        let bluffFreq = 0.4;
        if (opp3BetFreq > 0.15) bluffFreq = 0.6;
        if (Math.random() < bluffFreq) return { action: 'raise', amount: currentBet * 2.2, insight: `GTO 4-Bet Bluff (${posKey} vs 3-Bet, Adj:${bluffFreq})`, exploitTrigger: null, rangeEstimate: '4B Bluff' };
      }
      if (contextStrategies.CALL.has(hand)) {
        return { action: 'call', insight: `GTO Call 3-Bet (${posKey})`, exploitTrigger: null, rangeEstimate: 'Call 3B Range' };
      }
      if (opp3BetFreq > 0.12) {
        if (handRank <= 15) {
          return { action: 'raise', amount: currentBet * 2.2, insight: `Exploitative Wide 4-Bet Value (vs Loose ${opp3BetFreq.toFixed(2)}, Rank:${handRank})`, exploitTrigger: 'Maniac', rangeEstimate: 'Wide 4B' };
        }
      }
    }

    if (handRank <= 8) {
      return { action: 'raise', amount: player.chips, insight: `Stack Off (Rank:${handRank})`, exploitTrigger: null, rangeEstimate: 'Premium StackOff' };
    }
    let callThreshold = 25;
    if (opp3BetFreq > 0.15) callThreshold = 35;
    if (handRank <= callThreshold) {
      if (callAmount / engine.bb <= 20 || handRank <= 10) {
        return { action: 'call', insight: `Fallback Strong Call (Rank:${handRank})`, exploitTrigger: null, rangeEstimate: 'Strong 4B Defense' };
      }
    }
    if (callAmount <= 0) return { action: 'check', insight: 'Check (GTO Miss)', exploitTrigger: null, rangeEstimate: '' };
    return { action: 'fold', insight: `Fold to 3-Bet (${posKey} GTO Miss)`, exploitTrigger: null, rangeEstimate: '' };
  }

  if (callAmount <= 0) return { action: 'check', insight: 'Check (Default)', exploitTrigger: null, rangeEstimate: '' };
  return { action: 'fold', insight: 'GTO Default', exploitTrigger: null, rangeEstimate: '' };
}

function getPostflopAction(player, engine, myPos) {
  const board = engine.board;
  if (!board || board.length < 3) return { action: 'check', insight: 'Error: No Board', exploitTrigger: null, rangeEstimate: '' };

  const hand = player.hand;
  const evalResult = evaluateHand([...hand, ...board]);
  const texture = analyzeBoardTexture(board);
  const drawCategory = getDrawCategory(hand, board);
  const category = getHandCategory(hand, board, evalResult);

  const currentBet = engine.potManager ? engine.potManager.currentRoundBet : engine.currentRoundBet;
  const callAmount = currentBet - player.currentBet;
  const potSize = engine.pot;
  const isCheckable = callAmount <= 0;
  const isAggressor = engine.preflopAggressor === player.id;
  const alivePlayers = engine.players.filter(p => !p.isFolded).length;
  const street = engine.state;

  let estimatedEquity = 0;
  if (category === 'NUTS') estimatedEquity = 0.95;
  else if (category === 'MONSTER') estimatedEquity = 0.85;
  else if (category === 'STRONG') estimatedEquity = 0.70;
  else if (category === 'GOOD') estimatedEquity = 0.55;
  else if (category === 'MARGINAL') estimatedEquity = 0.40;
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

  const totalPotAfterCall = potSize + callAmount;
  let potOdds = callAmount > 0 ? (callAmount / totalPotAfterCall) : 0;
  let requiredEquity = potOdds;
  if (alivePlayers > 2) requiredEquity += (alivePlayers - 2) * 0.05;

  const startingStack = player.chips + player.totalWagered;
  const commitmentRatio = startingStack > 0 ? (player.totalWagered / startingStack) : 0;
  const spr = potSize > 0 ? (player.chips / potSize) : 20;

  const opponent = engine.players.find(p => p.isHuman && !p.isFolded) || engine.players.find(p => p.id !== player.id && !p.isFolded);
  const rawStats = (opponent && opponent.stats) ? opponent.stats : {};
  const handsPlayed = rawStats.handsPlayed || 0;
  const confidence = Math.min(1, handsPlayed / 25);
  const defStats = { vPIP: 0.30, foldToFlop: 0.5, aggressionFactor: 1.5 };

  const calcVPIP = handsPlayed > 0 ? ((rawStats.vpipCount || 0) / handsPlayed) : 0.30;
  const f2fCount = (rawStats.foldsPerStreet && rawStats.foldsPerStreet.FLOP) || 0;
  const calcF2F = handsPlayed > 0 ? (f2fCount / Math.max(1, handsPlayed * 0.4)) : 0.5;

  const oppVPIP = (calcVPIP * confidence) + (defStats.vPIP * (1 - confidence));
  const oppF2F = (calcF2F * confidence) + (defStats.foldToFlop * (1 - confidence));
  const oppPFR = handsPlayed > 0 ? ((rawStats.pfrCount || 0) / handsPlayed) : 0.20;

  let bluffFreq = Math.max(0, (player.class?.AF || 1.5) - 2) * 0.1;
  let insight = "";
  let exploitTrigger = null;
  let rangeEstimate = `Top ${Math.round(oppVPIP * 100)}%`;

  const isManiac = oppVPIP > 0.42 && oppPFR > 0.25;
  const isStation = oppVPIP > 0.45 && oppF2F < 0.45;

  if (isManiac) {
    bluffFreq *= 0.3; requiredEquity -= 0.12; insight += " [Exp:Maniac]"; exploitTrigger = "Maniac";
  } else if (isStation) {
    bluffFreq *= 0.1; requiredEquity -= 0.05; insight += " [Exp:Station]"; exploitTrigger = "Station";
  } else if (oppF2F > 0.6) {
    bluffFreq += 0.20; if (!isCheckable) requiredEquity += 0.08; insight += " [Exp:Tight]"; exploitTrigger = "Tight";
  }

  let raiseEquityThreshold = requiredEquity + 0.20;
  const AF = player.class?.AF || 1.5;
  estimatedEquity *= 1 + ((AF - 3) * 0.1);
  raiseEquityThreshold *= 1 + ((AF - 3) * 0.1);

  if (isAggressor) {
    if (street === 'FLOP') bluffFreq += 0.15;
  }
  if (spr < 1.5) requiredEquity *= 0.8;
  else if (spr > 10) requiredEquity *= 1.1;

  if (commitmentRatio > 0.35) {
    requiredEquity *= Math.max(0, 1 - (estimatedEquity + commitmentRatio * 0.5));
    insight += ` [Commt ${(commitmentRatio * 100).toFixed(0)}%]`;
  }

  const raises = engine.currentStreetRaises || 0;
  if (!isCheckable) {
    requiredEquity += raises * 0.08;
    raiseEquityThreshold += raises * 0.15;
    const betToPotRatio = potSize > 0 ? (callAmount / potSize) : 0;
    if (betToPotRatio >= 0.8) requiredEquity += 0.1;
  }

  if (callAmount >= player.chips) bluffFreq = 0;
  const isVirtuallyCommitted = callAmount > 0 && (player.chips <= (engine.bb * 2) || (player.chips / (potSize + player.chips) < 0.1));
  if (isVirtuallyCommitted) { requiredEquity = 0; insight += " [Virtually Committed]"; }

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
      action = 'call'; insight += " (Call Odds)";
    } else {
      const isRiverBluffSpot = street === 'RIVER' && !isStation && potSize > engine.bb * 15;
      if (isRiverBluffSpot && Math.random() < (bluffFreq * 1.5)) {
        action = 'raise'; amount = player.chips + 10000; insight += " (Polarized River All-In Bluff)";
      } else if (Math.random() < bluffFreq && street !== 'RIVER') { action = 'raise'; insight += " (Pure Bluff)"; }
      else { action = 'fold'; insight += " (Fold)"; }
    }
  }

  if (category === 'BOARD_CHOP') { action = 'call'; insight = "Board Chop"; }

  if (action === 'raise') {
    let currentTotalBet = engine.currentRoundBet || 0;
    if (!isCheckable) {
      let mult = Math.max(2.2, 4.5 - raises);
      amount = Math.floor(currentTotalBet * mult);
      amount = Math.max(amount, currentTotalBet * 2);
    } else {
      let potPct = 0.5;
      if (estimatedEquity >= 0.85) potPct = 0.9;
      else if (estimatedEquity >= 0.70) potPct = 0.7;
      if (street === 'RIVER' && (estimatedEquity >= 0.90 || estimatedEquity < requiredEquity)) potPct = Math.max(potPct, 1.2);
      amount = Math.floor(potSize * potPct);
      amount = Math.max(amount, engine.bb || 2);
    }
  }
  amount = Math.floor(amount);
  return { action, amount, insight, exploitTrigger, rangeEstimate };
}
