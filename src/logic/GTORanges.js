
// GTO Range Matrix (Approximate High Stakes Online 6-Max)
// RFI (Raise First In) & Defense Strategies

export const GTO_RANGES = {
  // 1. Open Raising (RFI)
  OPEN: {
    // UTG (EP): Strict, ~15%
    UTG: "77+, ATs+, KJs+, AQo+, KQs, QJs, JTs",
    // MP: ~19%
    MP: "55+, A2s+, KTs+, QJs+, AJo+, KQo, J9s+, T9s",
    // CO: ~28% (Wide steal)
    CO: "22+, A2s+, K9s+, Q9s+, J9s+, T8s+, 98s, 87s, ATo+, KJo+, QJo+",
    // BTN: ~45-50% (Max wide steal)
    BTN: "22+, A2s+, K2s+, Q5s+, J7s+, T7s+, 97s+, 86s+, 76s, 65s, 54s, A2o+, K9o+, Q9o+, J9o+, T9o+",
    // SB: ~35-45% (If folded to) - often wider but chopping occurs, let's say 40%
    SB: "22+, A2s+, K5s+, Q8s+, J8s+, T8s+, 98s, 87s, 76s, A8o+, KTo+, QTo+, JTo+"
  },

  // 2. Defense Matrices (Hero Position vs Villain Position)
  // Format: VS_{VILLAIN_POS}.{HERO_POS}

  // VS UTG Open (Tightest Range)
  VS_UTG: {
    MP: {
      VALUE_3BET: "QQ+, AKs, AKo",
      BLUFF_3BET: "A5s",
      CALL: "88-JJ, AQs, KQs, QJs, JTs"
    },
    CO: {
      VALUE_3BET: "QQ+, AKs, AKo",
      BLUFF_3BET: "A4s-A5s",
      CALL: "88-JJ, AQs, KQs, QJs, JTs, T9s"
    },
    BTN: {
      VALUE_3BET: "JJ+, AKs, AKo",
      BLUFF_3BET: "A2s-A5s",
      CALL: "66-TT, AQs, KQs, QJs, JTs, T9s, 98s"
    },
    SB: {
      // SB usually 3-bet or fold vs UTG (No cold call to avoid squeeze)
      VALUE_3BET: "QQ+, AKs, AKo",
      BLUFF_3BET: "A5s, KJs, QJs", // Polarized or Linear?
      CALL: "Locked" // Mostly Fold/3-Bet
    },
    BB: {
      // BB defends wide (price is good)
      VALUE_3BET: "QQ+, AKs, AKo",
      BLUFF_3BET: "A5s, K5s, 76s", // Random bluffs
      CALL: "22-JJ, Any Suited Broad, Suited Connectors, ATo+"
    }
  },

  // VS MP Open
  VS_MP: {
    CO: {
      VALUE_3BET: "QQ+, AKs, AKo",
      BLUFF_3BET: "A4s-A5s, K9s",
      CALL: "77-JJ, AQs, KQs, QJs, JTs, T9s"
    },
    BTN: {
      VALUE_3BET: "JJ+, AKs, AKo",
      BLUFF_3BET: "A2s-A5s, K8s",
      CALL: "55-TT, AQs, KQs, QJs, JTs, T9s, 98s, 87s"
    },
    SB: {
      VALUE_3BET: "JJ+, AKs, AKo, AQs",
      BLUFF_3BET: "A2s-A5s, KTs",
      CALL: "Locked"
    },
    BB: {
      VALUE_3BET: "JJ+, AKs, AKo",
      BLUFF_3BET: "A2s-A5s, T8s, 97s",
      CALL: "22-TT, KJo+, QJo+, Suited Broadways, Suited Connectors"
    }
  },

  // VS CO Open
  VS_CO: {
    BTN: {
      VALUE_3BET: "TT+, AQs+, AKo",
      BLUFF_3BET: "A2s-A5s, K8s, Q8s, J8s", // Polarized
      CALL: "22-99, KJs+, QJs, JTs, T9s, 98s, 87s, ATo+, KQo"
    },
    SB: {
      VALUE_3BET: "TT+, AQs+, AKo",
      BLUFF_3BET: "A2s-A9s, K9s",
      CALL: "Locked" // Mostly 3-bet or fold
    },
    BB: {
      VALUE_3BET: "TT+, AQs+, AKo",
      BLUFF_3BET: "K5s, Q6s, 54s",
      CALL: "22-99, Any Broad, Suited Connectors, One Gappers"
    }
  },

  // VS BTN Open (Blind Defense)
  VS_BTN: {
    SB: {
      // SB vs BTN is aggressive 3-bet war (Linear)
      VALUE_3BET: "88+, ATs+, KJs+, QJs, AJo+",
      BLUFF_3BET: "A2s-A9s, K8s+, Q8s+, J8s+, T8s+, 54s-76s", // Wide 3-bet
      CALL: "Locked" // Or some traps? Modern GTO is mostly 3-bet/Fold but flatting exists.
    },
    BB: {
      VALUE_3BET: "99+, AJs+, AQo+",
      BLUFF_3BET: "K5s, Q5s, J5s, T6s, 64s, 53s",
      CALL: "Any Pair, Any Suited, Any Broad, T7o+, 98o, 87o" // Defend ~60-70%
    }
  },

  // VS SB Open (BB Defense)
  VS_SB: {
    BB: {
      // SB opens wide, BB defends very wide using "Position + Price"
      VALUE_3BET: "88+, ATs+, KJs+, QJs",
      BLUFF_3BET: "T8s, 97s, 64s",
      CALL: "Any Two Suited, Any Broad, Any Pair, T7o+, 96o+, 54o+"
    }
  },

  // --- NEW: VS 3-Bet (Hero Open, Villain 3-Bet) => Hero 4-Bet/Call/Fold ---
  // If we are OOP (e.g. UTG vs BTN 3-bet), we play tight.
  // If we are IP (e.g. BTN vs Blinds 3-bet), we defend wider.

  VS_3BET: {
    OOP: {
      // Out of Position (UTG/MP/CO vs BTN)
      // Tight Value 4-Bet, Depolarized (adding QQ, AQs to cover value)
      VALUE_4BET: "QQ+, AKs, AKo, AQs",
      BLUFF_4BET: "A5s, A4s, KJs", // Blockers
      CALL: "TT-JJ, KQs, QJs, JTs" // Trap/Navigate (Removed QQ/AQs from call as they are now value 4-bet)
    },
    IP: {
      // In Position (BTN vs Blinds)
      // Wider Defense
      VALUE_4BET: "QQ+, AKs, AKo",
      BLUFF_4BET: "A2s-A5s", // Removed AJo/KQo from forced 4-bet bluff
      CALL: "77-JJ, AQs, KQs, QJs, JTs, T9s, 98s, AJo, KQo" // Added AJo, KQo to Call
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
