import { evaluateHand, calculateOuts, analyzeBoardTexture, getDrawCategory, getHandCategory } from './poker.js';
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

  // Helper to add a specific hand combo
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
    // --- Natural Language Parsers ---
    if (['Any Pair', 'All Pairs'].includes(r)) {
      for (let i = 0; i < 13; i++) {
        addCombo(getRankChar(i), getRankChar(i), 'pair');
      }
      return;
    }
    if (['Suited Connectors', 'Any Suited Connectors'].includes(r)) {
      // 54s+ up to AKs
      for (let i = 0; i < 12; i++) { // 2 up to K (index 11)
        addCombo(getRankChar(i + 1), getRankChar(i), 's'); // (i+1) is high card
      }
      return;
    }
    if (['Suited Broadways', 'Any Suited Broad'].includes(r)) {
      // T, J, Q, K, A combined suited
      // Indices: T=8, J=9, Q=10, K=11, A=12
      for (let i = 8; i <= 11; i++) {
        for (let j = i + 1; j <= 12; j++) {
          addCombo(getRankChar(j), getRankChar(i), 's');
        }
      }
      return;
    }
    if (['Any Broad', 'Broadways'].includes(r)) {
      // T, J, Q, K, A combined any (suited + offsuit)
      // Indices: T=8 ... A=12
      for (let i = 8; i <= 11; i++) {
        for (let j = i + 1; j <= 12; j++) {
          addCombo(getRankChar(j), getRankChar(i), 's');
          addCombo(getRankChar(j), getRankChar(i), 'o');
        }
      }
      // Pairs too? Usually "Any Broad" implies unpaired high cards.
      // Let's stick to non-pairs unless specified.
      return;
    }
    if (['One Gappers', 'Suited One Gappers'].includes(r)) {
      // 53s, 64s ... AQs
      // Gap of 1 index.
      for (let i = 0; i < 11; i++) {
        // Low card i, High card i+2
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


    // --- Standard Notation Parser ---

    // 1. Pairs: "JJ+", "22-99", "77"
    if (r.length === 3 && r.endsWith('+') && r[0] === r[1]) {
      // JJ+
      const startRank = getRankVal(r[0]);
      for (let i = startRank; i <= 12; i++) {
        addCombo(getRankChar(i), getRankChar(i), 'pair');
      }
    } else if (r.includes('-') && r[0] === r[1] && r.split('-')[1][0] === r.split('-')[1][1]) {
      // 22-99
      let [start, end] = r.split('-');
      let startVal = getRankVal(start[0]);
      let endVal = getRankVal(end[0]);
      // Handle "99-22" order
      if (startVal > endVal) [startVal, endVal] = [endVal, startVal];

      for (let i = startVal; i <= endVal; i++) {
        addCombo(getRankChar(i), getRankChar(i), 'pair');
      }
    } else if (r.length === 2 && r[0] === r[1]) {
      // 77
      addCombo(r[0], r[0], 'pair');
    }
    // 2. Suited/Offsuit ranges: "A2s+", "KJo+", "T9s", "A2s-A5s"
    else {
      // let type = r.slice(-1); // 's', 'o', '+' or 's' from A2s-A5s

      // Handle "-" ranges for non-pairs e.g. "A2s-A5s"
      if (r.includes('-')) {
        // A2s-A5s
        let [start, end] = r.split('-'); // Start=A2s, End=A5s
        let type = start.slice(-1); // s or o
        let highCard = start[0]; // A
        let startKicker = start[1]; // 2
        let endKicker = end[1]; // 5

        let startKval = getRankVal(startKicker);
        let endKval = getRankVal(endKicker);
        if (startKval > endKval) [startKval, endKval] = [endKval, startKval];

        for (let k = startKval; k <= endKval; k++) {
          // Prevent pairs if range is weird, but A2s-A5s implies A!=2
          if (getRankVal(highCard) === k) continue;
          addCombo(highCard, getRankChar(k), type);
        }
      }
      else if (r.endsWith('+')) {
        // A2s+, AJo+
        let base = r.slice(0, -1); // A2s
        let type = base.slice(-1); // s or o
        let highCard = base[0];
        let kicker = base[1];

        let highVal = getRankVal(highCard);
        let kickerVal = getRankVal(kicker);

        // Go up to highVal - 1 (since AAs is impossible/handled elsewhere)
        for (let k = kickerVal; k < highVal; k++) {
          addCombo(highCard, getRankChar(k), type);
        }
      } else {
        // Single combo: T9s, AKo
        let type = r.slice(-1); // s or o
        let c1 = r[0];
        let c2 = r[1];
        addCombo(c1, c2, type);
      }
    }
  });

  return Array.from(result);
};
// Global Cache for Parsed Ranges
let PARSED_MATRIX = null;

function getParsedMatrix() {
  if (PARSED_MATRIX) return PARSED_MATRIX;

  PARSED_MATRIX = {};

  // 1. Open Ranges
  PARSED_MATRIX.OPEN = {};
  for (const [pos, rangeStr] of Object.entries(GTO_RANGES.OPEN)) {
    PARSED_MATRIX.OPEN[pos] = new Set(expandRange(rangeStr));
  }
  // 2. Defense Matrices
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

  // 3. VS 3-Bet (4-Bet Ranges)
  PARSED_MATRIX.VS_3BET = {};
  for (const [pos, strategies] of Object.entries(GTO_RANGES.VS_3BET)) {
    PARSED_MATRIX.VS_3BET[pos] = {};
    for (const [stratKey, rangeStr] of Object.entries(strategies)) {
      PARSED_MATRIX.VS_3BET[pos][stratKey] = new Set(expandRange(rangeStr));
    }
  }

  // 4. Short Stack Ranges
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
  return hand[1] + hand[0];
}


/**
 * Universal Advanced AI Entry Point
 */
export const getAdvancedAIAction = (player, engine) => {
  const matrix = getParsedMatrix();
  const hand = getCanonicalHand(player.hand);

  // 1. Determine Positions
  const playerIdx = engine.players.findIndex(p => p.id === player.id);
  const dealerIdx = engine.dealerIndex;
  const playerCount = engine.players.length;

  const getPosName = (idx) => {
    const dist = (idx - dealerIdx + playerCount) % playerCount;
    if (playerCount === 2) {
      return (idx === dealerIdx) ? 'SB' : 'BB';
    }
    if (dist === 0) return 'BTN';
    if (dist === 1) return 'SB';
    if (dist === 2) return 'BB';
    if (dist === playerCount - 1) return 'CO';
    if (dist === playerCount - 2) return 'HJ';
    if (dist === 3 && playerCount === 6) return 'UTG';
    return 'EP';
  };

  const myPos = getPosName(playerIdx);

  let decision = { action: 'fold', insight: `GTO Default (${myPos})`, amount: 0 };

  // 2. Route Logic
  if (engine.state === 'PREFLOP') {
    decision = getUniversalPreflopAction(player, engine, myPos, hand, matrix, getPosName, playerCount);
  } else {
    decision = getPostflopAction(player, engine, myPos);
  }

  // 3. Format Output
  const action = {
    type: decision.action || 'fold',
    amount: decision.amount || 0,
    insight: decision.insight || "Processing...",
    dialogue: decision.dialogue || ''
  };

  // Dialogue & Delay
  // [FIX] REMOVED the overwrite of action.amount here which caused all raises to become calls.

  const pName = player.name.toUpperCase();
  let currentBet = engine.potManager ? engine.potManager.currentRoundBet : engine.currentRoundBet;
  if (action.type === 'raise') {
    // [SAFETY] Ensure raise is valid and INT

    // [FIX] Handle Float Issues
    action.amount = Math.floor(action.amount);
    // Cap at chips
    if (action.amount > player.chips + player.currentBet) {
      action.amount = player.chips + player.currentBet;
    }
    // [FIX] Demote to CALL if amount <= currentBet (e.g. All-In but not enough to raise, or logic error)
    if (action.amount <= currentBet && currentBet > 0) {
      action.type = 'call';
      action.amount = currentBet;
      // If we intended to raise but were forced to call, update insight
      action.insight += " (Downgraded to Call)";
    }
  } else if (action.type === 'call') {
    action.amount = engine.potManager ? engine.potManager.currentRoundBet : engine.currentRoundBet; // Ensure call amount
  } else if (action.type === 'check') {
    action.amount = 0;
  }
  const isBet = (currentBet === 0 && engine.state !== 'PREFLOP');
  if (isBet && Math.random() < 0.25) {
    action.dialogue = getAIChatDialogue(CHAT_TRIGGERS.BET, pName);
  } else if (Math.random() < 0.25) action.dialogue = getAIChatDialogue(action.type, pName);

  // [NEW] Global All-In Check
  // If the determined amount puts us all_in (or more), switch action to 'all_in'
  if (action.type === 'raise' && action.amount >= player.chips + player.currentBet) {
    action.amount = player.chips + player.currentBet;
    action.type = 'all_in';
  }
  if (Math.random() < 0.25) action.dialogue = getAIChatDialogue(action.type, player.name, action.insight);
  let delay = 1000 + Math.random() * 3000;
  if (action.type === 'fold') delay = 1500 + Math.random() * 3500;
  if (engine.state === 'PREFLOP') delay /= 3; // if preflop, faster decision
  return { ...action, delay };
};

function getUniversalPreflopAction(player, engine, myPos, hand, matrix, getPosNameFn, playerCount) {
  const bb = engine.bb;
  const currentBet = engine.potManager ? engine.potManager.currentRoundBet : engine.currentRoundBet;
  const callAmount = currentBet - player.currentBet;
  const isUnopened = currentBet <= bb && engine.currentStreetRaises === 0;

  // [FIX] Global Aliasing for GTO Keys
  const mapPosToGTO = (p) => {
    if (p === 'HJ') return 'MP';
    if (p === 'EP') return 'UTG';
    return p;
  };
  const myPosGTO = mapPosToGTO(myPos);

  // [PHASE 5] Short Stack Logic
  const effectiveStackBB = player.chips / bb;
  const isShortStack = effectiveStackBB < 25;

  // --- Scenario 1: Unopened Pot (RFI) ---
  if (isUnopened) {
    // Short Stack RFI
    if (isShortStack) {
      const rangeSet = matrix.SHORT_STACK.OPEN;
      if (rangeSet && rangeSet.has(hand)) {
        return { action: 'raise', amount: bb * 2.2, insight: `ShortStack Open (${myPos})` };
      }
      // Push Fold Logic implies usually we shove or fold if < 15bb, but here we simplify
      if (effectiveStackBB < 12 && ["88", "99", "TT", "JJ", "QQ", "KK", "AA", "AKs", "AKo"].includes(hand)) {
        return { action: 'raise', amount: player.chips, insight: 'ShortStack Shove' };
      }
      return { action: 'fold', insight: `ShortStack Fold (${myPos})` };
    }

    const rangeSet = matrix.OPEN[myPosGTO];
    if (rangeSet && rangeSet.has(hand)) {
      let size = 2.5;
      if (myPosGTO === 'SB') size = 3.0;
      else if (myPosGTO === 'BTN') size = 2.2;

      return { action: 'raise', amount: bb * size, insight: `GTO Open (${myPos}->${myPosGTO})` };
    }
    if (myPosGTO === 'BB') return { action: 'check', insight: `GTO check (${myPos})` };
    else return { action: 'fold', insight: `GTO Fold (${myPos})` };
  }

  // --- Scenario 2: Facing Raise ---
  const aggressorId = engine.preflopAggressor;
  if (aggressorId) {
    const aggPlayer = engine.players.find(p => p.id === aggressorId);
    if (aggPlayer) {
      const aggIdx = engine.players.indexOf(aggPlayer);
      const aggPos = getPosNameFn(aggIdx);
      const aggPosGTO = mapPosToGTO(aggPos);

      // [NEW] Squeeze Detection
      const activePlayers = engine.players.filter(p => !p.isFolded);
      const callers = activePlayers.filter(p => p.currentBet === currentBet && p.id !== aggressorId && p.id !== player.id).length;
      const isSqueezeSpot = callers >= 1;

      // [NEW] Get Real Opponent Stats
      const stats = aggPlayer.stats || { vPIP: 0.5, foldToFlop: 0.5 };
      const oppVPIP = stats.handsPlayed > 10 ? stats.vPIP : 0.5; // Use default if low sample

      if (isSqueezeSpot) {
        const vsKey = `VS_${aggPosGTO}`;
        const strategies = matrix[vsKey] ? matrix[vsKey][myPosGTO] : null;

        if (strategies && strategies.VALUE_3BET && strategies.VALUE_3BET.has(hand)) {
          // [GTO Standard]
          // IP Squeeze: 3.5x + 1x per caller (Standard Aggressive)
          // OOP Squeeze: 4.5x + 1x per caller
          const isOOP = ['SB', 'BB'].includes(myPos);
          let baseSize = isOOP ? 4.5 : 3.5;
          let squeezeSize = baseSize + (callers * 1.0);

          return { action: 'raise', amount: currentBet * squeezeSize, insight: `GTO Squeeze (${myPos} vs ${aggPos}+${callers})` };
        }
        if (strategies && strategies.CALL && strategies.CALL !== 'Locked' && strategies.CALL.has(hand)) {
          return { action: 'call', insight: `GTO Overcall (${myPos})` };
        }
        return { action: 'fold', insight: 'Fold to Raise+Callers' };
      }

      // Standard Matchup
      const vsKey = `VS_${aggPosGTO}`;
      const strategies = matrix[vsKey] ? matrix[vsKey][myPosGTO] : null;

      if (strategies) {
        const rng = Math.random();

        // [ADAPTATION] Adjust based on Opponent vPIP
        let valueBound = 0; // Standard
        let bluffBound = 0.5; // Standard 50% freq for bluffs

        if (oppVPIP > 0.45) {
          // Loose Opponent: Value 3-Bet wider? 
          // Strategy: Convert some Bluff 3-Bets AND Strong Calls to Pure Value
          bluffBound = 0.8;

          // [ADAPTATION] Force 3-Bet with Strong Call hands (Merger Range)
          // If we have a hand that is normally a Call, but strong (TT+, AQs+), Raise it for Value against loose range.
          const strongCallHands = ["TT", "JJ", "QQ", "KK", "AA", "AQs", "AKs", "AKo", "AJs", "KQs"];
          if (strongCallHands.includes(hand)) {
            // Force Value 3-Bet override
            return { action: 'raise', amount: currentBet * 3.5, insight: `Exploitative Value 3-Bet (vs Loose ${aggPos})` };
          }
        }

        if (strategies.VALUE_3BET && strategies.VALUE_3BET.has(hand)) {
          let sizing = 3.0;
          if (['SB', 'BB'].includes(myPos)) sizing = 4.0;
          return { action: 'raise', amount: currentBet * sizing, insight: `GTO Value 3-Bet vs ${aggPos}` };
        }

        if (strategies.BLUFF_3BET && strategies.BLUFF_3BET.has(hand)) {
          if (rng < bluffBound) {
            let sizing = 3.0;
            if (['SB', 'BB'].includes(myPos)) sizing = 4.0;
            return { action: 'raise', amount: currentBet * sizing, insight: `GTO Bluff 3-Bet vs ${aggPos} (Adj:${bluffBound})` };
          }
        }

        if (strategies.CALL && strategies.CALL !== 'Locked') {
          // Loose Opponent -> Call wider? 
          if (strategies.CALL.has(hand)) {
            return { action: 'call', insight: `GTO Call vs ${aggPos}` };
          }
        }

        // [ADAPTATION] Flat Call with broader range against Maniacs?
        // If 'Locked' but we have a decent hand and opp is maniac, Flat Call.
        if (oppVPIP > 0.60 && evaluateHand([...player.hand]).rank <= 40) { // Top ~25%
          return { action: 'call', insight: `Exploitative Call vs Maniac (${aggPos})` };
        }

        return { action: 'fold', insight: `GTO Fold vs ${aggPos}` };
      } else {
        if (evaluateHand([...player.hand]).rank <= 20) {
          return { action: 'call', insight: 'Fallback Strong Call' };
        }
        if (callAmount <= 0) return { action: 'check', insight: 'Check (No GTO)' };
        return { action: 'fold', insight: `No GTO Strategy (VS_${aggPos}.${myPos})` };
      }
    }
  }

  // --- Scenario 3: Facing 3-Bet (4-Bet Time) ---
  if (engine.preflopAggressor === player.id && engine.currentStreetRaises >= 2) {
    // 1. Identify 3-Bettor Position
    const activePlayers = engine.players.filter(p => !p.isFolded);
    // The player who made the currentRaise amount is likely the 3-bettor (or last aggressor)
    const threeBettor = activePlayers.find(p => p.currentBet === currentBet && p.id !== player.id);

    let isIP = false;
    if (threeBettor) {
      const myIdx = engine.players.indexOf(player);
      const villainIdx = engine.players.indexOf(threeBettor);

      // Calculate relative position.
      // In 6-max, if (myIdx - villainIdx + N) % N is small, they are left of me -> I am OOP?
      // Wait. Dealer is 0. 
      // If I am BTN (idx 0 for HU?), Dealer is BTN.
      // General Rule: The player closer to the left of the Button is SB/BB (OOP).
      // The player closer to the right of the Button is CO/HJ (IP).
      // Simpler: The one who acts LAST on postflop is IP.
      // Postflop order is: SB, BB, UTG... BTN.
      // So relative distance from Dealer.
      // Distance from Dealer: (Idx - DealerIdx + N) % N.
      // Smaller distance = Earlier Position = OOP.
      // Larger distance = Later Position = IP.

      const myDist = (myIdx - dealerIdx + playerCount) % playerCount;
      const villainDist = (villainIdx - dealerIdx + playerCount) % playerCount;

      isIP = myDist > villainDist;
    } else {
      // Fallback: Use absolute position heuristic
      isIP = ['BTN', 'CO'].includes(myPos);
    }

    const posKey = isIP ? 'IP' : 'OOP';
    const contextStrategies = matrix.VS_3BET[posKey];

    if (contextStrategies) {
      // [GTO 4-Bet Value]
      if (contextStrategies.VALUE_4BET.has(hand)) {
        return { action: 'raise', amount: currentBet * 2.2, insight: `GTO 4-Bet Value (${posKey} vs 3-Bet)` };
      }
      // [GTO 4-Bet Bluff]
      if (contextStrategies.BLUFF_4BET.has(hand)) {
        if (Math.random() < 0.4) return { action: 'raise', amount: currentBet * 2.2, insight: `GTO 4-Bet Bluff (${posKey} vs 3-Bet)` };
      }
      // [GTO Call]
      // Middle Suited Connectors (T9s, 98s) are usually here for IP
      if (contextStrategies.CALL.has(hand)) {
        return { action: 'call', insight: `GTO Call 3-Bet (${posKey})` };
      }
    }

    // [FALLBACK DEFENSE]
    // If logic fails or range is missing, stick to top 15% hands to avoid over-folding
    // rank 1 (AA) to ~25 (A9s). 
    // Top 8% (~Rank 1-12) usually 4-bet or Call.
    // Let's call with Top 15% (~Rank 25).
    const handRank = getStartingHandRank(player.hand);
    if (handRank <= 25) {
      return { action: 'call', insight: 'Fallback Strong Call (Top15%)' };
    }

    if (callAmount <= 0) return { action: 'check', insight: 'Check (GTO Miss)' };
    return { action: 'fold', insight: `Fold to 3-Bet (${posKey} GTO Miss)` };
  }

  if (callAmount <= 0) return { action: 'check', insight: 'Check (Default)' };
  return { action: 'fold', insight: 'GTO Default' };
}

function getPostflopAction(player, engine, myPos) {
  const board = engine.board;
  if (!board || board.length < 3) return { action: 'check', insight: 'Error: No Board' };

  const hand = player.hand;
  const evalResult = evaluateHand([...hand, ...board]);
  const outsData = calculateOuts(hand, board);
  const texture = analyzeBoardTexture(board);

  // 1. Categorize Hand
  const drawCategory = getDrawCategory(hand, board);
  const category = getHandCategory(hand, board, evalResult);
  // const category = [drawCategory, madeCategory];

  // 2. Determine Context
  const isPreflopAggressor = engine.preflopAggressor === player.id;
  const isAggressor = isPreflopAggressor;

  // 3. Pot Odds
  const currentBet = engine.potManager ? engine.potManager.currentRoundBet : engine.currentRoundBet;
  const callAmount = currentBet - player.currentBet;
  const potSize = engine.pot;
  const potOdds = callAmount / (potSize + callAmount);
  const isCheckable = callAmount <= 0;

  // [NEW] Opponent Adaptation
  // Try to find the opponent. If HU, it's the other guy.
  const activePlayers = engine.players.filter(p => !p.isFolded);
  const opponent = activePlayers.find(p => p.id !== player.id);
  const rawStats = (opponent && opponent.stats) ? opponent.stats : { foldToFlop: 0.5, vPIP: 0.5, aggressionFactor: 1.5 };

  // Create a safe local copy to avoid "Set on Proxy" errors for getters
  const stats = {
    vPIP: rawStats.vPIP || 0.5,
    foldToFlop: rawStats.foldToFlop || 0.5,
    aggressionFactor: rawStats.aggressionFactor || 1.5 // Default to Standard Aggression
  };
  // [STATS FIX] Blend Default with Actual Stats for small samples (0-25 hands)
  // Instead of hard override, we use a weighted average.
  // Weight of Actual Stats = handsPlayed / 25.
  // Weight of Default Stats = 1 - (handsPlayed / 25).
  const SAMPLE_THRESHOLD = 25;
  const hands = rawStats.handsPlayed || 0;

  if (hands < SAMPLE_THRESHOLD) {
    const confidence = hands / SAMPLE_THRESHOLD;
    const defaultStats = { vPIP: 0.25, foldToFlop: 0.5, aggressionFactor: 1.5 }; // Conservative Defaults

    stats.vPIP = (rawStats.vPIP * confidence) + (defaultStats.vPIP * (1 - confidence));
    stats.foldToFlop = (rawStats.foldToFlop * confidence) + (defaultStats.foldToFlop * (1 - confidence));
    stats.aggressionFactor = (rawStats.aggressionFactor * confidence) + (defaultStats.aggressionFactor * (1 - confidence));
  }

  const adjustment = getExploitativeAdjustment(player, stats);

  // [PHASE 4] Contextual Adjustments (SPR & Range)
  // 1. SPR Logic
  const startingStack = player.chips + player.totalWagered;
  const commitmentRatio = startingStack > 0 ? (player.totalWagered / startingStack) : 0;
  const spr = potSize > 0 ? (player.chips / potSize) : 20;
  if (commitmentRatio > 0.35) {
    adjustment.callBoost += 0.35; // Commit
    adjustment.bluffBoost += 0.15;
    // adjustments to raising? 
    // If low SPR, we are happy to get it in. raiseThreshold lower?
    // In this engine, raising is logic-driven. We can boost bluff slightly or value shove.
  } else if (spr < 1.5) {
    adjustment.callBoost += 0.1; // Pot Odds
  } else if (spr > 10) {
    adjustment.callBoost -= 0.1; // Reverse Implied Odds
  }

  // 2. Range Advantage
  // Aggressor favors High Cards (J+).
  const highCardCount = texture.ranks ? texture.ranks.filter(r => r >= 9).length : 0;
  if (isAggressor) {
    if (highCardCount >= 1) adjustment.bluffBoost += 0.15; // Range Match
    else adjustment.bluffBoost -= 0.1; // Range Miss
  } else {
    // Defender Advantage (Low/Mid board)
    if (highCardCount === 0 && texture.type !== 'DRY') {
      // Boost Donk/Lead freq? 
      // Current logic mostly checks. We could boost a lead if we added that logic.
      // For now, maybe Call Boost?
      adjustment.callBoost += 0.1;
    }
  }

  // --- Scenario A: We are Aggressor (C-Betting) ---
  if (isAggressor && isCheckable) {
    let betSize = engine.pot * 0.5;

    switch (engine.state) {
      case 'FLOP':
        betSize = engine.pot * 0.35; // Standard Flop C-Bet
        break;
      case 'TURN':
        betSize = engine.pot * 0.6; // Turn requires more protection
        break;
      case 'RIVER':
        betSize = engine.pot * 0.75; // River bets should be polarized and sizable
        break;
    }
    console.info(engine.pot, betSize)
    // [RIVER SPECIAL LOGIC]
    if (engine.state === 'RIVER') {

      if (category === 'NUTS' || category === 'MONSTER') {
        const sizeInfo = Math.random() < 0.3 ? 1.2 : 0.8; // Overbet or fat value
        return { action: 'raise', amount: engine.pot * sizeInfo, insight: `River Value Bomb (${category})` };
      }
      if (category === 'STRONG') {
        // Thin Value or Standard Value
        return { action: 'raise', amount: engine.pot * 0.55, insight: `River Value Bet (${category})` };
      }
      if (category === 'MARGINAL') {
        // Thin Value or Standard Value
        if (Math.random() < 0.1) return { action: 'raise', amount: engine.pot * 0.33, insight: 'River Any-Two Value' };
        return { action: 'check', insight: `River Check Back (Showdown Value)` };
      }
      // Draw is not made, try to bluff!
      if (['DRAW_MONSTER', 'DRAW_STRONG', 'DRAW_WEAK'].includes(drawCategory)) {
        let bluffFreq = 0.3 + adjustment.bluffBoost;
        if (drawCategory === 'DRAW_MONSTER') bluffFreq += 0.25;
        else if (drawCategory === 'DRAW_STRONG') bluffFreq += 0.15;
        if (Math.random() < bluffFreq) {
          return { action: 'raise', amount: engine.pot * 0.75, insight: 'River Triple-Barrel Bluff' };
        }
        return { action: 'check', insight: 'River Give Up' };
      }
      if (['AIR', 'WEAK'].includes(category)) {
        // Almost pure bluff 
        const bluffFreq = 0.1 + adjustment.bluffBoost;
        if (Math.random() < bluffFreq) {
          return { action: 'raise', amount: engine.pot * 0.75, insight: 'River Triple-Barrel Bluff' };
        }
        return { action: 'check', insight: 'River Give Up' };
      }
    }

    // [FLOP / TURN LOGIC]
    if (['STRONG', 'NUTS', 'MONSTER'].includes(category)) {
      return { action: 'raise', amount: betSize * 1.1, insight: `Postflop Value (${category})` };
    }
    if (['DRAW_STRONG', 'DRAW_WEAK'].includes(drawCategory)) {
      const rnd = Math.random()
      if (drawCategory === 'DRAW_STRONG' && rnd < 0.6) return { action: 'raise', amount: betSize, insight: `Postflop Semi-Bluff (${drawCategory})` };
      else if (drawCategory === 'DRAW_WEAK' && rnd < 0.3) return { action: 'raise', amount: betSize, insight: `Postflop Semi-Bluff (${drawCategory})` };
      else return { action: 'check', insight: `Postflop Check (${drawCategory})` };
    }
    if (['MARGINAL'].includes(category)) {
      // Thin Value Bet or Check Back for Pot Control
      if (Math.random() < 0.5) return { action: 'raise', amount: betSize, insight: `Postflop Thin Value (${category})` };
      else return { action: 'check', insight: `Postflop Check Back (${category})` };
    }
    // [C-BET ENHANCEMENT] AIR & WEAK (Bluff C-Bet)
    if (['AIR', 'WEAK'].includes(category)) {
      // [ADAPTATION] Boost base bluff frequency
      let baseBluffFreq = (texture.type === 'DRY') ? 0.6 : 0.4; // Dry boards are better for C-Betting
      let bluffFreq = baseBluffFreq + adjustment.bluffBoost;

      // If we have backdoors or overcards, boost slightly
      if (category === 'WEAK') bluffFreq += 0.1;

      if (Math.random() < bluffFreq) {
        return { action: 'raise', amount: betSize, insight: 'Postflop Bluff C-Bet' };
      }
    }
    return { action: 'check', insight: `Postflop Check (${category})` };
  }
  // --- Scenario B: Facing Bet (Defending) ---
  // Define betRatio for logic (Overbet detection)
  if (!isCheckable) {

    const betRatio = callAmount / (potSize || 1);

    // [RIVER DEFENSE]
    if (engine.state === 'RIVER') {
      // 1. Monsters always raise or call-trap
      if (category === 'NUTS') {
        return { action: 'raise', amount: currentBet * 3, insight: 'River Value Raise' };
      }
      if (category === 'MONSTER') {
        if (Math.random() < 0.25) return { action: 'call', insight: 'River Trap Call' };
        return { action: 'raise', amount: currentBet * 3, insight: 'River Value Raise' };
      }

      // 2. Strong hands or Board Chop Call
      if (category === 'STRONG' || category === 'BOARD_CHOP') {
        if (category === 'BOARD_CHOP') return { action: 'call', insight: 'River Call (Board Split)' };
        if (betRatio > 1.5 && Math.random() < 0.5) return { action: 'fold', insight: 'Fold Strong to Overbet' };
        return { action: 'call', insight: 'River Call (Strong)' };
      }

      // 3. Medium Hands - Bluff Catch Logic
      if (['MARGINAL', 'WEAK', 'ACE_HIGH'].includes(category)) {
        // If Opponent is Aggressive (AF > 3), call with Medium or Ace High
        let callProb = 0.2 + adjustment.callBoost; // Base 20% + adapt

        // Ace High Hero Call specific
        if (category === 'ACE_HIGH') {
          // Only call if opponent is somewhat aggressive or we think they bluff
          if (stats.aggressionFactor < 2.0 && adjustment.bluffBoost <= 0) {
            callProb = 0; // Fold vs Passive
          } else {
            callProb = 0.15 + (adjustment.bluffBoost * 0.5); // 15% base vs Aggro
          }
        }

        if (potOdds < 0.25 && category !== 'ACE_HIGH') callProb += 0.4; // Great odds (Exclude Ace High from "Great Odds" auto-call unless strictly aggro)

        if (Math.random() < callProb) {
          return { action: 'call', insight: `River Bluff Catch (${category} AF=${stats.aggressionFactor.toFixed(1)})` };
        }
        return { action: 'fold', insight: `River Fold (${category})` };
      }
      if (category === 'AIR' && texture.type === 'WET') {
        // [ADAPTATION]
        let bluffFreq = adjustment.bluffBoost;
        if (Math.random() < bluffFreq) {
          return { action: 'raise', amount: betSize, insight: 'River Bluff' };
        }
      }
      // 4. Weak/Air - Fold
      return { action: 'fold', insight: 'River Fold (Trash)' };
    }

    // [FLOP / TURN DEFENSE]
    if (['NUTS', 'MONSTER', 'STRONG'].includes(category)) {
      // [RAISE LOOP FIX] Capping aggression based on raise count
      const raises = engine.currentStreetRaises || 0;

      if (category === 'STRONG' && raises >= 2) {
        return { action: 'call', insight: `Postflop Call Strong (Raise Cap: ${raises})` };
      }
      if (category === 'MONSTER' && raises >= 3) {
        return { action: 'call', insight: `Postflop Call Monster (Raise Cap: ${raises})` };
      }

      if ((category === 'NUTS' || category === 'MONSTER') && Math.random() < 0.3) return { action: 'call', insight: 'Postflop Trap' };
      return { action: 'raise', amount: currentBet * 3, insight: `Postflop Raise for Value (${category})` };
    }
    if (category === 'MARGINAL') {
      // If Passive Opponent Bets, Respect it (Fold unless Pot Odds are huge)
      if (adjustment.callBoost < -0.2 && Math.random() < 0.7) {
        return { action: 'fold', insight: 'Postflop Fold Medium (Respect Passive)' };
      }
      return { action: 'call', insight: 'Postflop Call (Marginal)' };
    }
    if (['DRAW_STRONG', 'DRAW_WEAK'].includes(drawCategory)) {
      let equity = 0;
      if (engine.state === 'TURN') equity = outsData.outs * 2;
      else equity = outsData.outs * 4;

      if ((equity / 100) > potOdds) {
        return { action: 'call', insight: `Postflop Call Draw (Eq: ${equity}%)` };
      }
    }

    if (category === 'BOARD_CHOP') {
      return { action: 'call', insight: 'Postflop Call (Board Split)' };
    }

    return { action: 'fold', insight: `Postflop Fold (${category})` };
  }

  // --- Scenario C: Probe/Stab Logic (Checkable, Non-Aggressor) ---
  // If everyone checked in front of us, we can stab at the pot.
  if (isCheckable) {
    // [RIVER] Value Bet & Bluff
    if (engine.state === 'RIVER') {
      if (['NUTS', 'MONSTER', 'STRONG'].includes(category)) {
        const valSize = (category === 'NUTS' || category === 'MONSTER') ? 0.8 : 0.6;
        return { action: 'raise', amount: potSize * valSize, insight: `River Value Stab (${category})` };
      }
      if (['AIR', 'WEAK'].includes(category) || ['AIR', 'DRAW_MONSTER', 'DRAW_STRONG', 'DRAW_WEAK'].includes(drawCategory)) {
        const stabFreq = 0.4 + adjustment.bluffBoost;
        if (Math.random() < stabFreq) {
          return { action: 'raise', amount: potSize * 0.66, insight: 'River Bluff Stab' };
        }
      }
    }
    // [TURN / FLOP] Stab (If checked to)
    else {
      // If we have value, bet it
      if (['NUTS', 'MONSTER', 'STRONG'].includes(category)) {
        return { action: 'raise', amount: potSize * 0.6, insight: `Postflop Value Stab (${category})` };
      }
      // If we have draws, bet for semi-bluff (protection)
      if (['DRAW_STRONG', 'DRAW_WEAK', 'DRAW_MONSTER'].includes(drawCategory)) {
        if (Math.random() < 0.6) return { action: 'raise', amount: potSize * 0.6, insight: `Postflop Draw Stab (${drawCategory})` };
      }
      // If we have nothing (AIR/WEAK), stab to steal
      if (['AIR', 'WEAK'].includes(category)) {
        let stabFreq = 0.45 + adjustment.bluffBoost; // 45% Base Stab
        if (texture.type === 'WET') stabFreq += 0.1;

        if (Math.random() < stabFreq) {
          return { action: 'raise', amount: potSize * 0.5, insight: 'Postflop Bluff Stab' };
        }
      }
    }
    return { action: 'check', insight: 'Postflop Check-Back' };
  }

  return { action: 'check', insight: 'Postflop Check' };
}



function getExploitativeAdjustment(player, stats) {
  let adj = { bluffBoost: 0, tightMod: 0, callBoost: 0 };

  // 1. Over-Folder (FoldToFlop > 60%)
  if (stats.foldToFlop > 0.6) {
    adj.bluffBoost += 0.2;
  }

  // 2. Calling Station (vPIP > 50%, FoldToFlop < 30%)
  if (stats.vPIP > 0.5 && stats.foldToFlop < 0.3) {
    adj.bluffBoost -= 0.5;
  }

  // 3. High AF (Aggressive) > 3.0
  if (stats.aggressionFactor > 3.0) {
    adj.callBoost += 0.3; // Call wider (Bluff Catch)
  }

  // 4. Low AF (Passive) < 1.0
  if (stats.aggressionFactor < 1.0) {
    adj.callBoost -= 0.3; // Fold more (Respect Strength)
    adj.bluffBoost += 0.1; // Steal from them
  }
  console.log('Adjustment:', adj);
  return adj;
}
