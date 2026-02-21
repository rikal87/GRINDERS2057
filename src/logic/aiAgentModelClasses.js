
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
  [AI_AGENT_MODEL_ENUM.VANGUARD]: {
    slogan: "A.I is not a choice, it's a survival.",
    key_features: "Entry-level agent balance. Reliable but limited in expansion.",
    price_plan: [
      { cost: 0, maxLt: 100, slot: ['T1'] },
      { cost: 5000, maxLt: 200, slot: ['T1', 'T1'] },
      { cost: 12000, maxLt: 350, slot: ['T1', 'T1', 'T1'] },
      { cost: 25000, maxLt: 500, slot: ['T2', 'T1', 'T1'] },
      { cost: 50000, maxLt: 800, slot: ['T3', 'T2', 'T1'] },
    ]
  },
  [AI_AGENT_MODEL_ENUM.ARIES]: {
    slogan: "Aggressive optimization for the boldest users.",
    key_features: "Focus on high-tier slot access and rapid processing.",
    price_plan: [
      { cost: 8000, maxLt: 150, slot: ['T2'] },
      { cost: 20000, maxLt: 350, slot: ['T2', 'T2'] },
      { cost: 45000, maxLt: 600, slot: ['T3', 'T2', 'T1'] },
      { cost: 100000, maxLt: 1200, slot: ['T4', 'T3', 'T2'] },
      { cost: 250000, maxLt: 2500, slot: ['T5', 'T4', 'T3'] },
    ]
  },
  [AI_AGENT_MODEL_ENUM.TAURUS]: {
    slogan: "Unwavering stability. Built for the long term.",
    key_features: "Massive Ludus Token capacity and consistent efficiency.",
    price_plan: [
      { cost: 10000, maxLt: 500, slot: ['T1'] },
      { cost: 30000, maxLt: 1200, slot: ['T2', 'T1'] },
      { cost: 75000, maxLt: 2500, slot: ['T2', 'T2', 'T1'] },
      { cost: 150000, maxLt: 5000, slot: ['T3', 'T2', 'T2'] },
      { cost: 400000, maxLt: 10000, slot: ['T4', 'T3', 'T3'] },
    ]
  },
  [AI_AGENT_MODEL_ENUM.GEMINI]: {
    slogan: "Powerful Multi-modal synergy.",
    key_features: "Maximum task concurrency from the start.",
    price_plan: [
      { cost: 12000, maxLt: 300, slot: ['T1', 'T1', 'T1'] },
      { cost: 35000, maxLt: 700, slot: ['T2', 'T1', 'T1', 'T1'] },
      { cost: 80000, maxLt: 1500, slot: ['T2', 'T2', 'T1', 'T1'] },
      { cost: 180000, maxLt: 3000, slot: ['T3', 'T2', 'T2', 'T1'] },
      { cost: 500000, maxLt: 6000, slot: ['T4', 'T3', 'T2', 'T2'] },
    ]
  },
  [AI_AGENT_MODEL_ENUM.LEO]: {
    slogan: "Majestic power. Only at the top.",
    key_features: "Elite T6 slot access at lower price tiers.",
    price_plan: [
      { cost: 25000, maxLt: 400, slot: ['T2', 'T2'] },
      { cost: 60000, maxLt: 900, slot: ['T3', 'T2'] },
      { cost: 150000, maxLt: 2000, slot: ['T4', 'T3', 'T2'] },
      { cost: 350000, maxLt: 5000, slot: ['T5', 'T4', 'T3'] },
      { cost: 800000, maxLt: 12000, slot: ['T6', 'T5', 'T4'] },
    ]
  },
  [AI_AGENT_MODEL_ENUM.VIRGO]: {
    slogan: "Total analytical precision.",
    key_features: "Unmatched performance per Ludus Token spent.",
    price_plan: [
      { cost: 15000, maxLt: 400, slot: ['T1', 'T1'] },
      { cost: 40000, maxLt: 1000, slot: ['T2', 'T1', 'T1'] },
      { cost: 100000, maxLt: 2500, slot: ['T3', 'T2', 'T2'] },
      { cost: 250000, maxLt: 6000, slot: ['T4', 'T3', 'T3'] },
      { cost: 600000, maxLt: 15000, slot: ['T5', 'T4', 'T4'] },
    ]
  },
  [AI_AGENT_MODEL_ENUM.LIBRA]: {
    slogan: "Balance is the ultimate algorithm.",
    key_features: "Smooth scaling across all dimensions.",
    price_plan: [
      { cost: 20000, maxLt: 600, slot: ['T1', 'T1', 'T1'] },
      { cost: 50000, maxLt: 1500, slot: ['T2', 'T2', 'T2'] },
      { cost: 120000, maxLt: 3500, slot: ['T3', 'T3', 'T3'] },
      { cost: 300000, maxLt: 8000, slot: ['T4', 'T4', 'T4'] },
      { cost: 700000, maxLt: 18000, slot: ['T6', 'T5', 'T4'] },
    ]
  },
  [AI_AGENT_MODEL_ENUM.SCORPIO]: {
    slogan: "Lethal efficiency. No waste.",
    key_features: "Hidden benefits for specialized mission types.",
    price_plan: [
      { cost: 22000, maxLt: 500, slot: ['T2', 'T2'] },
      { cost: 55000, maxLt: 1200, slot: ['T3', 'T3'] },
      { cost: 140000, maxLt: 3000, slot: ['T4', 'T4'] },
      { cost: 350000, maxLt: 7500, slot: ['T5', 'T5'] },
      { cost: 850000, maxLt: 20000, slot: ['T6', 'T6', 'T6'] },
    ]
  },
  [AI_AGENT_MODEL_ENUM.SAGITTARIUS]: {
    slogan: "Aims for the stars, hits the mark.",
    key_features: "Exceptional LT capacity and search task bonuses.",
    price_plan: [
      { cost: 18000, maxLt: 800, slot: ['T1', 'T1'] },
      { cost: 45000, maxLt: 2000, slot: ['T2', 'T2', 'T2'] },
      { cost: 110000, maxLt: 5000, slot: ['T3', 'T3', 'T3', 'T3'] },
      { cost: 280000, maxLt: 12000, slot: ['T5', 'T4', 'T3', 'T2'] },
      { cost: 750000, maxLt: 25000, slot: ['T6', 'T6', 'T6', 'T6'] },
    ]
  },
  [AI_AGENT_MODEL_ENUM.CAPRICORN]: {
    slogan: "Eternal persistence. Foundation of the Net.",
    key_features: "The highest Max LT limits in the mid-high range.",
    price_plan: [
      { cost: 30000, maxLt: 1500, slot: ['T1', 'T1', 'T1'] },
      { cost: 80000, maxLt: 4000, slot: ['T2', 'T2', 'T1'] },
      { cost: 200000, maxLt: 10000, slot: ['T3', 'T3', 'T2', 'T2'] },
      { cost: 500000, maxLt: 25000, slot: ['T4', 'T4', 'T4', 'T4'] },
      { cost: 1200000, maxLt: 60000, slot: ['T6', 'T6', 'T6', 'T6'] },
    ]
  },
  [AI_AGENT_MODEL_ENUM.AQUARIUS]: {
    slogan: "Deep technical insight. Visionary.",
    key_features: "Early access to advanced slot configurations.",
    price_plan: [
      { cost: 35000, maxLt: 1000, slot: ['T2', 'T2'] },
      { cost: 90000, maxLt: 3000, slot: ['T3', 'T3', 'T3'] },
      { cost: 250000, maxLt: 8000, slot: ['T4', 'T4', 'T4'] },
      { cost: 600000, maxLt: 20000, slot: ['T5', 'T5', 'T5'] },
      { cost: 1500000, maxLt: 50000, slot: ['T6', 'T6', 'T6', 'T6'] },
    ]
  },
  [AI_AGENT_MODEL_ENUM.PISCES]: {
    slogan: "Deep net exploration. Boundless.",
    key_features: "Massive LT regeneration and unique slot types.",
    price_plan: [
      { cost: 40000, maxLt: 3000, slot: ['T2', 'T2'] },
      { cost: 120000, maxLt: 8000, slot: ['T3', 'T3', 'T3'] },
      { cost: 350000, maxLt: 20000, slot: ['T4', 'T4', 'T4'] },
      { cost: 800000, maxLt: 50000, slot: ['T5', 'T5', 'T5'] },
      { cost: 2000000, maxLt: 120000, slot: ['T6', 'T6', 'T6', 'T6'] },
    ]
  },
  [AI_AGENT_MODEL_ENUM.ZODIAC]: {
    slogan: "THE COMPLETED SYSTEM. DIVINE INTERVENTION.",
    key_features: "Ultimate everything. If you have this, you own the Net.",
    price_plan: [
      { cost: 100000, maxLt: 10000, slot: ['T3', 'T3', 'T3'] },
      { cost: 300000, maxLt: 25000, slot: ['T4', 'T4', 'T4', 'T4'] },
      { cost: 1000000, maxLt: 100000, slot: ['T5', 'T5', 'T5', 'T5'] },
      { cost: 5000000, maxLt: 500000, slot: ['T6', 'T6', 'T6', 'T6'] },
      { cost: 25000000, maxLt: 2000000, slot: ['T6', 'T6', 'T6', 'T6', 'T6'] },
    ]
  }
};
