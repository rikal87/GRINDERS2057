import { GTO_RANGES } from '../../GTORanges.js';

let cachedMatrix = null;
const VS_3BET = {
  IP: {
    CALL: expandRange(GTO_RANGES.VS_3BET.IP.CALL),
    VALUE_4BET: expandRange(GTO_RANGES.VS_3BET.IP.VALUE_4BET),
    BLUFF_4BET: expandRange(GTO_RANGES.VS_3BET.IP.BLUFF_4BET)
  },
  OOP: {
    CALL: expandRange(GTO_RANGES.VS_3BET.OOP.CALL),
    VALUE_4BET: expandRange(GTO_RANGES.VS_3BET.OOP.VALUE_4BET),
    BLUFF_4BET: expandRange(GTO_RANGES.VS_3BET.OOP.BLUFF_4BET)
  }
};

const SHORT_STACK = {
  OPEN: expandRange(GTO_RANGES.SHORT_STACK.OPEN)
};
/**
 * [Tool] Range Tool
 * Parses and caches the GTO range matrix.
 */
export function getGTOMatrix() {
  if (cachedMatrix) return cachedMatrix;

  const OPEN = {};
  for (const pos in GTO_RANGES.OPEN) {
    OPEN[pos] = expandRange(GTO_RANGES.OPEN[pos]);
  }

  // Defense against specific positions
  const DEFENSE = {};
  ['VS_UTG', 'VS_MP', 'VS_CO', 'VS_BTN', 'VS_SB'].forEach(vsPos => {
    if (GTO_RANGES[vsPos]) {
      DEFENSE[vsPos] = {};
      for (const myPos in GTO_RANGES[vsPos]) {
        const strat = GTO_RANGES[vsPos][myPos];
        if (typeof strat === 'string') {
          DEFENSE[vsPos][myPos] = expandRange(strat);
        } else {
          DEFENSE[vsPos][myPos] = {
            VALUE_3BET: expandRange(strat.VALUE_3BET),
            BLUFF_3BET: expandRange(strat.BLUFF_3BET),
            CALL: expandRange(strat.CALL)
          };
        }
      }
    }
  });

  cachedMatrix = { OPEN, VS_3BET, SHORT_STACK, DEFENSE };
  return cachedMatrix;
}

function expandRange(rangeStr) {
  if (!rangeStr) return new Set();
  const ranges = rangeStr.split(',').map(s => s.trim());
  let result = new Set();
  const ranksStr = '23456789TJQKA';

  const getRankVal = (r) => ranksStr.indexOf(r);
  const getRankChar = (v) => ranksStr[v];

  const addCombo = (r1, r2, type) => {
    if (type === 's') {
      ['s', 'h', 'd', 'c'].forEach(suit => result.add(r1 + suit + r2 + suit));
    } else if (type === 'o') {
      ['s', 'h', 'd', 'c'].forEach(s1 => ['s', 'h', 'd', 'c'].forEach(s2 => {
        if (s1 !== s2) result.add(r1 + s1 + r2 + s2);
      }));
    } else if (type === 'pair') {
      ['s', 'h', 'd', 'c'].forEach((s1, idx1) => ['s', 'h', 'd', 'c'].forEach((s2, idx2) => {
        if (idx1 < idx2) result.add(r1 + s1 + r1 + s2);
      }));
    }
  };

  ranges.forEach(r => {
    // 1. Special Labels
    if (r === 'Any Pair') { for (let i = 0; i < 13; i++) addCombo(getRankChar(i), getRankChar(i), 'pair'); return; }
    if (r === 'Any Suited') { 
      for (let i = 0; i < 13; i++) {
        for (let j = 0; j < i; j++) addCombo(getRankChar(i), getRankChar(j), 's');
      }
      return; 
    }
    if (r === 'Any Broad') {
      const broads = 'TJQKA';
      for (let i = 0; i < broads.length; i++) {
        for (let j = 0; j < broads.length; j++) {
           if (i === j) addCombo(broads[i], broads[j], 'pair');
           else if (i > j) { addCombo(broads[i], broads[j], 's'); addCombo(broads[i], broads[j], 'o'); }
        }
      }
      return;
    }
    if (r === 'Any Two Suited') { /* Same as Any Suited */
        for (let i = 0; i < 13; i++) for (let j = 0; j < i; j++) addCombo(getRankChar(i), getRankChar(j), 's');
        return;
    }

    // 2. Pairs (66+, 66-99)
    if (r[0] === r[1]) {
      if (r.endsWith('+')) {
        const start = getRankVal(r[0]);
        for (let i = start; i <= 12; i++) addCombo(getRankChar(i), getRankChar(i), 'pair');
      } else if (r.includes('-')) {
        const parts = r.split('-');
        const start = getRankVal(parts[1][0]), end = getRankVal(parts[0][0]);
        for (let i = start; i <= end; i++) addCombo(getRankChar(i), getRankChar(i), 'pair');
      } else {
        addCombo(r[0], r[0], 'pair');
      }
      return;
    }

    // 3. Suited/Offsuit with + (A2s+, AJo+)
    if (r.endsWith('+')) {
      const r1 = r[0], r2 = r[1], type = r[2];
      const startRank = getRankVal(r2);
      const anchorRank = getRankVal(r1);
      for (let i = startRank; i < anchorRank; i++) addCombo(r1, getRankChar(i), type);
      return;
    }

    // 4. Sub-ranges (A2s-A5s)
    if (r.includes('-')) {
       const parts = r.split('-'); // ["A2s", "A5s"]
       const type = parts[0][2];
       const r1 = parts[0][0];
       const startRank = getRankVal(parts[0][1]);
       const endRank = getRankVal(parts[1][1]);
       for (let i = Math.min(startRank, endRank); i <= Math.max(startRank, endRank); i++) {
         addCombo(r1, getRankChar(i), type);
       }
       return;
    }

    // 5. Single Combo (AKs, AKo, AJo)
    if (r.length >= 3) {
      const type = r[2];
      if (type === 's' || type === 'o') addCombo(r[0], r[1], type);
    }
  });

  return result;
}
