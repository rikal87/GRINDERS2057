// GTO Range Matrix (Approximate High Stakes Online 6-Max)
// RFI (Raise First In) & Defense Strategies

export function expandRange(rangeStr) {
  if (!rangeStr) return new Set();
  const ranges = rangeStr.split(',').map(s => s.trim());
  let result = new Set();
  const ranksStr = '23456789TJQKA';

  const getRankVal = (r) => ranksStr.indexOf(r);
  const getRankChar = (v) => ranksStr[v];

  ranges.forEach(r => {
    try {
      // 1. Special Labels
      if (r === 'Any Pair') { 
        for (let i = 0; i < 13; i++) result.add(getRankChar(i) + getRankChar(i)); 
        return; 
      }
      if (r === 'Any Suited' || r === 'Any Two Suited') { 
        for (let i = 0; i < 13; i++) for (let j = 0; j < i; j++) result.add(getRankChar(i) + getRankChar(j) + 's');
        return; 
      }
      if (r === 'Any Broad') {
        const broads = 'TJQKA';
        for (let i = 0; i < broads.length; i++) for (let j = 0; j < broads.length; j++) {
           if (i === j) result.add(broads[i] + broads[j]);
           else if (i > j) { result.add(broads[i] + broads[j] + 's'); result.add(broads[i] + broads[j] + 'o'); }
        }
        return;
      }
      
      // 2. Pairs (e.g., 66+, 66-99)
      if (r[0] === r[1]) {
        if (r.endsWith('+')) {
          const start = getRankVal(r[0]);
          for (let i = start; i <= 12; i++) result.add(getRankChar(i) + getRankChar(i));
        } else if (r.includes('-')) {
          const parts = r.split('-');
          const v1 = getRankVal(parts[0][0]), v2 = getRankVal(parts[1][0]);
          if (v1 === -1 || v2 === -1) return;
          for (let i = Math.min(v1, v2); i <= Math.max(v1, v2); i++) result.add(getRankChar(i) + getRankChar(i));
        } else result.add(r[0] + r[0]);
        return;
      }

      // 3. Suited/Offsuit (e.g., A2s+, KJo, A2s-A5s)
      const type = r.includes('s') ? 's' : (r.includes('o') ? 'o' : null);
      if (type) {
        const r1 = r[0], r2 = r[1];
        if (r.endsWith('+')) {
          const anchorRank = getRankVal(r1);
          const startRank = getRankVal(r2);
          if (anchorRank === -1 || startRank === -1) return;
          for (let i = startRank; i < anchorRank; i++) result.add(r1 + getRankChar(i) + type);
        } else if (r.includes('-')) {
          const parts = r.split('-');
          const v1 = getRankVal(parts[0][1]), v2 = getRankVal(parts[1][1]);
          if (v1 === -1 || v2 === -1) return;
          for (let i = Math.min(v1, v2); i <= Math.max(v1, v2); i++) result.add(r1 + getRankChar(i) + type);
        } else {
          result.add(r[0] + r[1] + type);
        }
      }
    } catch (e) {
      // Ignore conversion errors
    }
  });
  return result;
}

export const GTO_RANGES = {
  // 1. Open Raising (RFI)
  OPEN: {
    UTG: "66+, A2s+, KJs+, QJs, AJo+, KQo, JTs, T9s",
    MP: "44+, A2s+, KTs+, QJs+, ATo+, KQo, J9s+, T9s, 98s, 87s",
    CO: "22+, A2s+, K8s+, Q9s+, J9s+, T8s+, 98s, 87s, 76s, ATo+, KJo+, QJo+",
    BTN: "22+, A2s+, K2s+, Q2s+, J5s+, T6s+, 96s+, 85s+, 75s+, 64s+, 54s, 43s, A2o+, K8o+, Q9o+, J9o+, T8o+, 98o",
    SB: "22+, A2s+, K2s+, Q5s+, J7s+, T7s+, 97s+, 87s, 76s, 65s, A5o+, K9o+, Q9o+, J9o+, T9o+, 87o"
  },

  // 2. Defense Matrices
  VS_UTG: {
    MP: { VALUE_3BET: "TT+, AKs, AKo, AQs, AJs", BLUFF_3BET: "A2s-A5s, KTs+, QJs, JTs, T9s, 87s, 76s, A5o", CALL: "22-99, ATs, KQs, QJs, JTs, 98s, AJo, KQo" },
    CO: { VALUE_3BET: "99+, AKs, AKo, AQs, AJs", BLUFF_3BET: "A2s-A5s, KTs+, QJs, T9s, 87s, 76s, 65s, AJo", CALL: "22-88, ATs, KQs, JTs, 98s, 87s, ATo, KQo" },
    BTN: { VALUE_3BET: "88+, AJs+, KJs+, AQo+, AKo", BLUFF_3BET: "A2s-A5s, K8s+, Q9s+, J9s+, T8s+, 98s, 87s, 76s, 65s, 54s, AJo, KQo", CALL: "22-77, ATs, KQs, QJs, JTs, 98s, 76s, ATo" },
    SB: { VALUE_3BET: "99+, AJs+, KJs+, AQo+, AKo", BLUFF_3BET: "A2s-A9s, KTs+, QJs, JTs, T9s, 87s, 76s, 65s, 54s, AJo, KQo", CALL: "Locked" },
    BB: { VALUE_3BET: "TT+, AJs+, AKo, AQo", BLUFF_3BET: "A2s-A5s, K5s-K8s, Q6s+, J7s+, 76s, 65s, 54s, ATo, KJo", CALL: "22-99, Any Suited Broad, Suited Connectors, ATo+, KJo+" }
  },
  VS_MP: {
    CO: { VALUE_3BET: "99+, AJs+, KJs+, AQo+, AKo", BLUFF_3BET: "A2s-A5s, K9s+, Q9s+, T9s, 87s, 76s, 65s, 54s, AJo, KQo", CALL: "22-88, ATs, KQs, JTs, 98s, ATo" },
    BTN: { VALUE_3BET: "77+, ATs+, KJs+, QJs, AJo+, KQo", BLUFF_3BET: "A2s-A5s, K9s+, Q9s+, JTs, T9s, 98s, 87s, 76s, 65s, 54s, 43s, ATo, KJo", CALL: "22-66, ATs, KQs, QJs, JTs, ATo, KQo" },
    SB: { VALUE_3BET: "88+, ATs+, KJs+, QJs, AJo+, KQo", BLUFF_3BET: "A2s-A5s, KTs+, QTs+, JTs, T9s, 87s, 76s, 65s, 54s, ATo, KJo, QJo", CALL: "Locked" },
    BB: { VALUE_3BET: "99+, AJs+, AKo, AQo", BLUFF_3BET: "A2s-A5s, K5s+, Q7s+, J7s+, T8s, 97s, 86s, 75s, 64s, 54s, ATo, KJo", CALL: "22-88, KTo+, QTo+, Suited Broadways, Suited Connectors" }
  },
  VS_CO: {
    BTN: { VALUE_3BET: "66+, ATs+, KJs+, QJs+, AJo+, KQo", BLUFF_3BET: "A2s-A5s, K5s-K9s, Q8s+, J8s+, T8s+, 98s, 87s, 76s, 65s, 54s, 43s, ATo, KJo, QJo", CALL: "22-55, A9s, KTs, QTs, JTs, ATo, KQo" },
    SB: { VALUE_3BET: "77+, ATs+, KJs+, QJs+, AJo+, KQo", BLUFF_3BET: "A2s-A9s, K8s-KTs, Q9s+, J9s+, T8s+, 87s, 76s, 65s, 54s, 53s, 43s, ATo, KJo, QJo", CALL: "Locked" },
    BB: { VALUE_3BET: "88+, ATs+, KJs+, AQo+", BLUFF_3BET: "A2s-A5s, K2s-K9s, Q5s+, J7s+, T6s+, 86s, 75s, 64s, 54s, 43s, A9o, KTo, QTo", CALL: "22-77, Any Broad, Suited Connectors, One Gappers, ATo+, KJo+" }
  },
  VS_BTN: {
    SB: { VALUE_3BET: "44+, A2s+, K5s+, Q5s+, J7s+, ATo+, KTo+, QTo+", BLUFF_3BET: "T7s+, 97s+, 86s+, 75s+, 65s, 54s, 53s, 43s, 32s, T8o, 98o, 87o", CALL: "Locked" },
    BB: { VALUE_3BET: "66+, A9s+, KTs+, QTs+, ATo+, KQo", BLUFF_3BET: "A2s-A8s, K2s-K9s, Q2s-Q9s, J5s+, T6s+, 96s+, 85s+, 75s+, 64s+, 53s+, 43s, K8o, Q9o, J9o", CALL: "Any Pair, Any Suited, Any Broad, T7o+, 96o+, 85o+, 75o+, 64o+, 53o+, 42o+" }
  },
  VS_SB: {
    BB: { VALUE_3BET: "44+, A2s+, K5s+, Q5s+, J5s+, ATo+, KTo+, QTo+", BLUFF_3BET: "T2s+, 92s+, 82s+, 72s+, 62s+, 52s+, 42s+, 32s, K2o-K9o, Q2o-Q9o, J5o+", CALL: "Any Two Suited, Any Broad, Any Pair, T7o+, 95o+, 84o+, 74o+, 63o+, 53o+, 43o" }
  },

  VS_3BET: {
    OOP: { VALUE_4BET: "TT+, AKs, AKo, AQs", BLUFF_4BET: "A2s-A5s, KJs, QJs, JTs, T9s, AJo, KQo", CALL: "77-99, ATs, KQs, QJs, JTs, T9s, 98s, AJo, KQo" },
    IP: { VALUE_4BET: "99+, AKs, AKo, AQs, KQs", BLUFF_4BET: "A2s-A8s, K9s, Q9s, J9s, T8s, 98s, ATo, KJo", CALL: "22-88, ATs, KTs+, QTs+, JTs, T9s, 98s, 87s, ATo+, KQo, QJo" }
  },

  SHORT_STACK: {
    OPEN: "77+, ATs+, KJs+, QJs, AJo+, KQo",
    VS_OPEN_SHOVE: "88+, AJs+, AQo+",
    VALUE_3BET_COMMIT: "99+, AJs+, KQs, AQo+",
    BLUFF_3BET_SHOVE: "A2s-A5s, KJs, QJs"
  }
};

// [v25] Pre-expanded sets for high performance
GTO_RANGES.SETS = {
    VS_3BET: {
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
    },
    SHORT_STACK: {
        OPEN: expandRange(GTO_RANGES.SHORT_STACK.OPEN)
    }
};
