
// Task Definitions
export const AI_AGENT_MODEL_ENUM = {
  VANGUARD: "VANGUARD",
  ARIES: "ARIES",
  TAURUS: "TAURUS",
  GEMINI: "GEMINI",
  LEO: "LEO",
  VIRGO: "VIRGO",
  LIBRA: "LIBRA",
  SCORPIO: "SCORPIO",
  SAGITTARIUS: "SAGITTARIUS",
  CAPRICORN: "CAPRICORN",
  AQUARIUS: "AQUARIUS",
  PISCES: "PISCES",
  ZODIAC: "ZODIAC"
};
export const AI_AGENT_MODEL_AND_PLAN_DATA = {
  // FREE TIER
  [AI_AGENT_MODEL_ENUM.VANGUARD]: {
    slogan: "A.I is not a choice, it's a survival.",
    key_features: "Free for use.",
    price_plan: [
      { cost: 0, maxLt: 100, slot: ['T1'] }
    ]
  },
  // LOW TIER?
  [AI_AGENT_MODEL_ENUM.ARIES]: {
    slogan: "Aggressive optimization for the boldest users.",
    key_features: "Focus on high-tier slot access and rapid processing.",
    price_plan: [
      { cost: 8000, maxLt: 200, slot: ['T2'] },
      { cost: 8000 * 1.50, maxLt: 300, slot: ['T3'] },
      { cost: 8000 * 2.25, maxLt: 400, slot: ['T4'] },
      { cost: 8000 * 3.5, maxLt: 500, slot: ['T5'] },
    ]
  },
  [AI_AGENT_MODEL_ENUM.TAURUS]: {
    slogan: "Unwavering stability. Built for the long term.",
    key_features: "Massive Ludus Token capacity and consistent efficiency.",
    price_plan: [
      { cost: 10000, maxLt: 400, slot: ['T1'] },
      { cost: 10000 * 1.50, maxLt: 800, slot: ['T1', 'T1'] },
      { cost: 10000 * 2.25, maxLt: 1200, slot: ['T2', 'T1'] },
      { cost: 10000 * 3.5, maxLt: 1600, slot: ['T2', 'T2'] },
    ]
  },
  // MID TIER
  [AI_AGENT_MODEL_ENUM.GEMINI]: {
    slogan: "Powerful Multi-modal synergy.",
    key_features: "Maximum task concurrency from the start.",
    price_plan: [
      { cost: 12000 * 1.00, maxLt: 300, slot: ['T1', 'T1'], cooldown_bonus: 0.05 },
      { cost: 12000 * 1.50, maxLt: 450, slot: ['T2', 'T2', 'T1'], cooldown_bonus: 0.10 },
      { cost: 12000 * 2.25, maxLt: 550, slot: ['T2', 'T2', 'T1', 'T1'], cooldown_bonus: 0.15 },
      { cost: 12000 * 3.5, maxLt: 550, slot: ['T3', 'T3', 'T2', 'T2'], cooldown_bonus: 0.20 },
    ]
  },
  [AI_AGENT_MODEL_ENUM.LEO]: {
    slogan: "Majestic power. Only at the top.",
    key_features: "Middle Tier slot access at lower price tiers.",
    price_plan: [
      { cost: 17000 * 1.00, maxLt: 400, slot: ['T2', 'T2', 'T2'] },
      { cost: 17000 * 1.50, maxLt: 600, slot: ['T3', 'T3', 'T2'] },
      { cost: 17000 * 2.25, maxLt: 700, slot: ['T3', 'T3', 'T2'] },
      { cost: 17000 * 3.5, maxLt: 700, slot: ['T4', 'T4', 'T2'] },
    ]
  },
  [AI_AGENT_MODEL_ENUM.VIRGO]: {
    slogan: "Total analytical precision.",
    key_features: "Unmatched performance per Ludus Token capacity.",
    price_plan: [
      { cost: 19000 * 1.00, maxLt: 600, slot: ['T1', 'T1'] },
      { cost: 19000 * 1.50, maxLt: 1200, slot: ['T2', 'T1'] },
      { cost: 19000 * 2.25, maxLt: 1800, slot: ['T2', 'T2'] },
      { cost: 19000 * 3.5, maxLt: 2400, slot: ['T3', 'T2'] },
    ]
  },
  // MID-HIGH TIER
  [AI_AGENT_MODEL_ENUM.LIBRA]: {
    slogan: "Balance is the ultimate algorithm.",
    key_features: "Smooth scaling across all dimensions.",
    price_plan: [
      { cost: 25000 * 1.00, maxLt: 400, slot: ['T1', 'T1', 'T1', 'T1'] },
      { cost: 25000 * 1.50, maxLt: 600, slot: ['T2', 'T2', 'T2', 'T2'] },
      { cost: 25000 * 2.25, maxLt: 800, slot: ['T3', 'T3', 'T3', 'T3'] },
      { cost: 25000 * 3.5, maxLt: 900, slot: ['T4', 'T4', 'T4', 'T4'] },
    ]
  },
  [AI_AGENT_MODEL_ENUM.SCORPIO]: {
    slogan: "Lethal efficiency. No waste.",
    key_features: "Focus on high-tier slot access.",
    price_plan: [
      { cost: 32000 * 1.00, maxLt: 300, slot: ['T3', 'T2'] },
      { cost: 32000 * 1.50, maxLt: 450, slot: ['T4', 'T3'] },
      { cost: 32000 * 2.25, maxLt: 550, slot: ['T5', 'T4'] },
      { cost: 32000 * 3.5, maxLt: 550, slot: ['T5', 'T5'] },
    ]
  },
  [AI_AGENT_MODEL_ENUM.SAGITTARIUS]: {
    slogan: "Aims for the stars, hits the mark.",
    key_features: "High Task Success probability bonus.",
    price_plan: [
      { cost: 35000 * 1.00, maxLt: 750, slot: ['T2'], probability_bonus: 0.02 },
      { cost: 35000 * 1.50, maxLt: 750, slot: ['T3'], probability_bonus: 0.04 },
      { cost: 35000 * 2.25, maxLt: 750, slot: ['T4'], probability_bonus: 0.06 },
      { cost: 35000 * 3.5, maxLt: 750, slot: ['T5'], probability_bonus: 0.08 },
    ]
  },
  [AI_AGENT_MODEL_ENUM.CAPRICORN]: {
    slogan: "Eternal persistence. Foundation of the Net.",
    key_features: "The highest Max LT limits in the mid-high range.",
    price_plan: [
      { cost: 40000 * 1.00, maxLt: 1000, slot: ['T2', 'T2', 'T2'] },
      { cost: 40000 * 1.50, maxLt: 1500, slot: ['T2', 'T2', 'T2'] },
      { cost: 40000 * 2.25, maxLt: 1750, slot: ['T3', 'T3', 'T3'] },
      { cost: 40000 * 3.5, maxLt: 2000, slot: ['T4', 'T4', 'T4'] },
    ]
  },
  // HIGH TIER
  [AI_AGENT_MODEL_ENUM.AQUARIUS]: {
    slogan: "Deep technical insight. Visionary.",
    key_features: "Can Access to dual elite Slot(T6) and Task duration bonus.",
    price_plan: [
      { cost: 65000 * 1.00, maxLt: 800, slot: ['T3', 'T3'], duration_bonus: 0.25 },
      { cost: 65000 * 1.50, maxLt: 800, slot: ['T4', 'T4'], duration_bonus: 0.50 },
      { cost: 65000 * 2.25, maxLt: 800, slot: ['T5', 'T5'], duration_bonus: 0.75 },
      { cost: 65000 * 3.5, maxLt: 800, slot: ['T6', 'T6'], duration_bonus: 1.0 },
    ]
  },
  [AI_AGENT_MODEL_ENUM.PISCES]: {
    slogan: "Deep net exploration. Boundless.",
    key_features: "Massive LT regeneration",
    price_plan: [
      { cost: 80000 * 1.00, maxLt: 500, slot: ['T3'], lt_regen_bonus_rate: 2.0 },
      { cost: 80000 * 1.50, maxLt: 500, slot: ['T4', 'T3'], lt_regen_bonus_rate: 3.0 },
      { cost: 80000 * 2.25, maxLt: 500, slot: ['T5', 'T4', 'T3'], lt_regen_bonus_rate: 4.0 },
      { cost: 80000 * 3.25, maxLt: 500, slot: ['T6', 'T5', 'T4', 'T3'], lt_regen_bonus_rate: 5.0 },
    ]
  },
  // EXCLUSIVE TIER
  [AI_AGENT_MODEL_ENUM.ZODIAC]: {
    slogan: "THE COMPLETED SYSTEM. DIVINE INTERVENTION.",
    key_features: "Ultimate everything. If you have this, you own the Net.",
    isHidden: true,
    price_plan: [
      { cost: 500000, maxLt: 2000, slot: ['T6', 'T6', 'T6', 'T6'], probability_bonus: 0.03, lt_regen_bonus_rate: 1.0, duration_bonus: 0.5, cooldown_bonus: 0.15 }
    ]
  }
};
