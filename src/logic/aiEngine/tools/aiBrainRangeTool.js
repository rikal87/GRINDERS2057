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
    if (['Any Pair'].includes(r)) { for (let i = 0; i < 13; i++) addCombo(getRankChar(i), getRankChar(i), 'pair'); return; }
    if (r.length === 3 && r.endsWith('+') && r[0] === r[1]) {
      const startRank = getRankVal(r[0]);
      for (let i = startRank; i <= 12; i++) addCombo(getRankChar(i), getRankChar(i), 'pair');
    } else if (r.length === 2 && r[0] === r[1]) {
      addCombo(r[0], r[0], 'pair');
    } else {
      // Basic support for AKs, AKo, etc.
      let type = r.slice(-1);
      if (type === 's' || type === 'o') {
        addCombo(r[0], r[1], type);
      }
    }
  });

  return result;
}
