
// GTO Range Matrix (Approximate High Stakes Online 6-Max)
// RFI (Raise First In) & Defense Strategies

export const GTO_RANGES = {
  // 1. Open Raising (RFI)
  OPEN: {
    // UTG (EP): Strict, ~15-17% (Wider)
    UTG: "66+, A2s+, KJs+, QJs, AJo+, KQo, JTs, T9s",
    // MP: ~20-22% (Wider)
    MP: "44+, A2s+, KTs+, QJs+, ATo+, KQo, J9s+, T9s, 98s, 87s",
    // CO: ~30% (Wider)
    CO: "22+, A2s+, K8s+, Q9s+, J9s+, T8s+, 98s, 87s, 76s, ATo+, KJo+, QJo+",
    // BTN: ~50-55% (Aggressive steal)
    BTN: "22+, A2s+, K2s+, Q2s+, J5s+, T6s+, 96s+, 85s+, 75s+, 64s+, 54s, 43s, A2o+, K8o+, Q9o+, J9o+, T8o+, 98o",
    // SB: ~50% (Pure aggression)
    SB: "22+, A2s+, K2s+, Q5s+, J7s+, T7s+, 97s+, 87s, 76s, 65s, A5o+, K9o+, Q9o+, J9o+, T9o+, 87o"
  },

  // 2. Defense Matrices (Hero Position vs Villain Position)
  // Format: VS_{VILLAIN_POS}.{HERO_POS}

  // VS UTG Open
  VS_UTG: {
    MP: {
      VALUE_3BET: "TT+, AKs, AKo, AQs, AJs",
      BLUFF_3BET: "A2s-A5s, KTs+, QJs, JTs, T9s, 87s, 76s, A5o",
      CALL: "22-99, ATs, KQs, QJs, JTs, 98s, AJo, KQo"
    },
    CO: {
      VALUE_3BET: "99+, AKs, AKo, AQs, AJs",
      BLUFF_3BET: "A2s-A5s, KTs+, QJs, T9s, 87s, 76s, 65s, AJo",
      CALL: "22-88, ATs, KQs, JTs, 98s, 87s, ATo, KQo"
    },
    BTN: {
      VALUE_3BET: "88+, AJs+, KJs+, AQo+, AKo",
      BLUFF_3BET: "A2s-A5s, K8s+, Q9s+, J9s+, T8s+, 98s, 87s, 76s, 65s, 54s, AJo, KQo",
      CALL: "22-77, ATs, KQs, QJs, JTs, 98s, 76s, ATo"
    },
    SB: {
      VALUE_3BET: "99+, AJs+, KJs+, AQo+, AKo",
      BLUFF_3BET: "A2s-A9s, KTs+, QJs, JTs, T9s, 87s, 76s, 65s, 54s, AJo, KQo",
      CALL: "Locked"
    },
    BB: {
      VALUE_3BET: "TT+, AJs+, AKo, AQo",
      BLUFF_3BET: "A2s-A5s, K5s-K8s, Q6s+, J7s+, 76s, 65s, 54s, ATo, KJo",
      CALL: "22-99, Any Suited Broad, Suited Connectors, ATo+, KJo+"
    }
  },

  // VS MP Open
  VS_MP: {
    CO: {
      VALUE_3BET: "99+, AJs+, KJs+, AQo+, AKo",
      BLUFF_3BET: "A2s-A5s, K9s+, Q9s+, T9s, 87s, 76s, 65s, 54s, AJo, KQo",
      CALL: "22-88, ATs, KQs, JTs, 98s, ATo"
    },
    BTN: {
      VALUE_3BET: "77+, ATs+, KJs+, QJs, AJo+, KQo",
      BLUFF_3BET: "A2s-A5s, K9s+, Q9s+, JTs, T9s, 98s, 87s, 76s, 65s, 54s, 43s, ATo, KJo",
      CALL: "22-66, ATs, KQs, QJs, JTs, ATo, KQo"
    },
    SB: {
      VALUE_3BET: "88+, ATs+, KJs+, QJs, AJo+, KQo",
      BLUFF_3BET: "A2s-A5s, KTs+, QTs+, JTs, T9s, 87s, 76s, 65s, 54s, ATo, KJo, QJo",
      CALL: "Locked"
    },
    BB: {
      VALUE_3BET: "99+, AJs+, AKo, AQo",
      BLUFF_3BET: "A2s-A5s, K5s+, Q7s+, J7s+, T8s, 97s, 86s, 75s, 64s, 54s, ATo, KJo",
      CALL: "22-88, KTo+, QTo+, Suited Broadways, Suited Connectors"
    }
  },

  // VS CO Open
  VS_CO: {
    BTN: {
      VALUE_3BET: "66+, ATs+, KJs+, QJs+, AJo+, KQo",
      BLUFF_3BET: "A2s-A5s, K5s-K9s, Q8s+, J8s+, T8s+, 98s, 87s, 76s, 65s, 54s, 43s, ATo, KJo, QJo",
      CALL: "22-55, A9s, KTs, QTs, JTs, ATo, KQo"
    },
    SB: {
      VALUE_3BET: "77+, ATs+, KJs+, QJs+, AJo+, KQo",
      BLUFF_3BET: "A2s-A9s, K8s-KTs, Q9s+, J9s+, T8s+, 98s, 87s, 76s, 65s, 54s, 53s, 43s, ATo, KJo, QJo",
      CALL: "Locked"
    },
    BB: {
      VALUE_3BET: "88+, ATs+, KJs+, AQo+",
      BLUFF_3BET: "A2s-A5s, K2s-K9s, Q5s+, J7s+, T6s+, 86s, 75s, 64s, 54s, 43s, A9o, KTo, QTo",
      CALL: "22-77, Any Broad, Suited Connectors, One Gappers, ATo+, KJo+"
    }
  },

  // VS BTN Open (Blind Defense)
  VS_BTN: {
    SB: {
      VALUE_3BET: "44+, A2s+, K5s+, Q5s+, J7s+, ATo+, KTo+, QTo+",
      BLUFF_3BET: "T7s+, 97s+, 86s+, 75s+, 65s, 54s, 53s, 43s, 32s, T8o, 98o, 87o",
      CALL: "Locked"
    },
    BB: {
      VALUE_3BET: "66+, A9s+, KTs+, QTs+, ATo+, KQo",
      BLUFF_3BET: "A2s-A8s, K2s-K9s, Q2s-Q9s, J5s+, T6s+, 96s+, 85s+, 75s+, 64s+, 53s+, 43s, K8o, Q9o, J9o",
      CALL: "Any Pair, Any Suited, Any Broad, T7o+, 96o+, 85o+, 75o+, 64o+, 53o+, 42o+"
    }
  },

  // VS SB Open (BB Defense)
  VS_SB: {
    BB: {
      VALUE_3BET: "44+, A2s+, K5s+, Q5s+, J5s+, ATo+, KTo+, QTo+",
      BLUFF_3BET: "T2s+, 92s+, 82s+, 72s+, 62s+, 52s+, 42s+, 32s, K2o-K9o, Q2o-Q9o, J5o+",
      CALL: "Any Two Suited, Any Broad, Any Pair, T7o+, 95o+, 84o+, 74o+, 63o+, 53o+, 43o"
    }
  },

  // --- VS 3-Bet (Hero Open, Villain 3-Bet) ---
  VS_3BET: {
    OOP: {
      VALUE_4BET: "TT+, AKs, AKo, AQs",
      BLUFF_4BET: "A2s-A5s, KJs, QJs, JTs, T9s, AJo, KQo",
      CALL: "77-99, ATs, KQs, QJs, JTs, T9s, 98s, AJo, KQo"
    },
    IP: {
      VALUE_4BET: "99+, AKs, AKo, AQs, KQs",
      BLUFF_4BET: "A2s-A8s, K9s, Q9s, J9s, T8s, 98s, ATo, KJo",
      CALL: "22-88, ATs, KTs+, QTs+, JTs, T9s, 98s, 87s, ATo+, KQo, QJo"
    }
  },

  // --- SHORT STACK ADJUSTMENTS (< 25BB or SPR < 3) ---
  // Remove speculative hands (Low Pairs, Suited Connectors).
  // Focus on High Card Strength & High Pairs.
  SHORT_STACK: {
    // Shove or Fold ranges mostly, or commit-heavy 3-bets.
    OPEN: "77+, ATs+, KJs+, QJs, AJo+, KQo",
    VS_OPEN_SHOVE: "88+, AJs+, AQo+",
    // If we 3-bet, we commit.
    VALUE_3BET_COMMIT: "99+, AJs+, KQs, AQo+",
    BLUFF_3BET_SHOVE: "A2s-A5s, KJs, QJs" // Blocker Shoves
  }
};
