import { reactive, watch } from 'vue';
import { get, set, del } from 'idb-keyval';
import { AI_AGENT_MODEL_ENUM, AI_AGENT_MODEL_AND_PLAN_DATA } from './aiAgentModelClasses';
const SAVE_KEY = 'cyberpoker_save_v1';

const defaultState = {
  bankroll: 225000,
  chips: 0, // Chips on table
  // currentBB: 0,
  xp: 0,
  level: 25,
  selectedClass: 'GRINDER',
  ownedProtectors: [], // Array of materialized item objects
  equippedProtector: null, // item object or null
  equippedSkills: [null, null, null], // 3 Slots
  activeBoosts: [], // [{ taskId, effect: {} }]
  ownedPortraits: ['p1', 'p2', 'p3'],
  selectedPortrait: 'p1',
  boostRegenLT: 0,
  completedEvents: [],
  pendingEvents: [],
  latest_pay_income_base_amount: 0,
  collusion: {
    is_colluding: false,
    partner_id: null,
    partner_name: null,
    // partner_relationship: null,
    partner_share_rate: 0,
    zone_id: null,
  },
  missedPayments: {
    rent_bill: 0,
    income_tax: 0,
    fine: 0,
  },
  partners: [],
  isRealGameOver: false,
  realGameOverReason: '',
  play_stats: {
    bust_enemy: {
      'Fish': 0, 'Broke': 0, 'MR_CALL': 0, 'Gambler': 0, 'Rich_Guy': 0,
      'Maniac': 0, 'Gangster': 0, 'Nit': 0, 'Quant_Pro': 0, 'Mafia_Boss': 0,
      'Shark': 0, 'Old_Lion': 0, 'Named_Pro': 0, 'Musk_V': 0, 'KBT_Leader': 0,
      'Max': 0, 'Florence': 0
    },
    cleared_zones: {
      'micro_warehouse_with_max': 0,
      'micro_underground_bar': 0,
      'micro_warehouse': 0,
    },
    // Economy
    paid_rake: 0,
    paid_buy_item: 0,
    paid_bribe_dealer: 0,
    paid_penalty: 0,
    max_level: 0,
    total_earn_money: 0n,
    total_lost_money: 0n,
    // Behavior (VPIP/PFR)
    played_hands: 0,
    fold: 0,
    check: 0,
    call: 0,
    raise: 0,
    all_in: 0,
    wtsd: 0, // Went To Showdown
    w$sd: 0, // Won $ at Showdown
    pfr: 0, // Pre-Flop Raise
    c_bet_count: 0,
    fold_to_3bet: 0,
    fold_to_4bet_or_more: 0,
    donk_bet_count: 0,
    raise3bet: 0,
    raise4bet_or_more: 0,
    vpip_count: 0,
    bankruptcy_count: 0,
    // Luck & Probability
    showdown_win: 0,
    all_in_win: 0,
    win_without_showdown: 0,
    // Records
    max_win_pot: 0,
    max_lose_pot: 0,
    max_win_streak: 0,
    max_lose_streak: 0,
    max_lose_equity: 0.0,
    min_win_equity: 0.0,
    // Backward compatibility or UI convenience
    max_credit: 0,
    max_bankroll: 0,
    max_pot: 0,
  },
  settings: {
    language: 'en', // Added for i18n
    preflop: [
      { label: 'MIN', type: 'min' },
      { label: '50%', type: 'half' },
      { label: 'POT', type: 'pot' }
    ],
    postflop: [
      { label: '30%', type: '30p' },
      { label: '50%', type: '50p' },
      { label: '100%', type: '100p' }
    ],
    fourColorMode: false,
    showAsBB: false
  },
  shop: {
    items: [],
    lastRefreshTime: 0,
    manualRefreshCount: 0
  },
  cryptoPortfolio: {}, // { coinId: amount }
  marketState: {
    coins: [],
    lastUpdate: 0
  },
  unlockedLocations: [], // Array of item IDs that unlock locations
  ludusTokens: 50,
  gameTime: new Date('2057-01-20T09:00:00').getTime(), // Start Date
  aiAgent: {
    model: AI_AGENT_MODEL_AND_PLAN_DATA[AI_AGENT_MODEL_ENUM.VANGUARD],
    name: AI_AGENT_MODEL_ENUM.VANGUARD,
    price_plan_idx: 0,
    subscriptionExpireAt: 0,
  },
  onWorkTasks: [], // [{ taskId, startTime, lastProcessTime }]
  messages: [], // [{ id, type, title, body, timestamp, isRead, actions?, expireAt? }]
  stamina: 100,
  maxStamina: 100,
  staminaLastUpdate: Date.now(),
  statsAtWakeUp: {
    bankroll: 20000,
    played_hands: 0,
    total_earn_money: 0n,
    total_lost_money: 0n,
    max_win_pot: 0
  },
  all_time_bankroll_stats: {},
  session_net_history: [],
  session_net_total: 0,
  hasSave: false
};
export const getBustEnemyCount = (enemyId) => {
  return store.play_stats.bust_enemy[enemyId];
}
// BigInt JSON helpers
const bigIntReplacer = (key, value) => typeof value === 'bigint' ? `@BIGINT@:${value.toString()}` : value;
const bigIntReviver = (key, value) => {
  if (typeof value === 'string') {
    if (value.startsWith('@BIGINT@:')) return BigInt(value.split(':')[1]);
    if (value.endsWith('n') && !isNaN(value.slice(0, -1))) return BigInt(value.slice(0, -1)); // Legacy cleanup
  }
  return value;
};

export const getCurrentAgent = () => {
  return store.aiAgent ? store.aiAgent.model : AI_AGENT_MODEL_AND_PLAN_DATA[AI_AGENT_MODEL_ENUM.VANGUARD];
}
export const getEffectiveMaxLT = () => {
  const agent = store.aiAgent;
  const planIdx = agent.price_plan_idx;
  const baseMax = agent.model?.price_plan[planIdx]?.maxLt || 100;
  const bonus = store.equippedProtector?.effects?.reduce((sum, e) => (e.id === 'lt_max_plus') ? sum + e.value : sum, 0) || 0;
  return baseMax + bonus;
}
export const gainLT = (amount) => {
  store.ludusTokens = Math.min(getEffectiveMaxLT(), store.ludusTokens + amount);
}
export const gainShopRefreshCount = (amount = 1) => {
  store.shop.manualRefreshCount = Math.max(0, store.shop.manualRefreshCount + amount);
}
export const getEffectiveMaxStamina = () => {
  const baseMax = store.maxStamina || 100;
  const activeStaminaBoosts = store.activeBoosts
    .filter(b => b.effect.type === 'max_stamina_boost')
    .reduce((sum, b) => sum + (b.effect.amount || 0), 0);
  return baseMax + activeStaminaBoosts;
};
export const gainXP = (player, pot, bb = 1.0, isHighStakes = false, locationLV = 1) => {
  if (!player.isMe) return 0;
  const bbWon = pot / bb;
  let xp = bbWon * 1.0;
  // 티어 가산점: 높은 방일수록 경험치 기본값이 높음
  xp += bb * (isHighStakes ? 2 : 1) * locationLV;

  // AI Agent Boost effects
  const activeXpBoosts = store.activeBoosts
    .filter(b => b.effect.type === 'xp_boost')
    .reduce((sum, b) => sum + (b.effect.amount || 0), 0);

  const bonus = player.tempXPBonus || 0;
  store.xp += Math.ceil(xp * (1 + bonus + activeXpBoosts));
  console.info('player.tempXPBonus', player.tempXPBonus)
  player.tempXPBonus = 0;
  console.log(`[XP] Gained ${xp} XP.`);
  checkLevelUp(xp);
  return xp;
}
export const gainClearedZone = (locationId) => {
  if (!store.cleared_zones[locationId]) store.cleared_zones[locationId] = 0
  store.cleared_zones[locationId]++
}
export const checkLevelUp = (xp) => {
  // 1000 + 2000 >? 1500
  if (Number.isNaN(xp)) return;
  const nextThreshold = getNextLevelThreshold();
  if (store.xp + xp >= nextThreshold) {
    // store.xp = 0;
    xp = store.xp + xp - nextThreshold;
    store.xp = 0;
    store.level++;
    console.log(`[XP] Level Up!`);
    checkLevelUp(xp);
  }
}
export const getNextLevelThreshold = () => {
  return Math.floor(1000 * Math.pow(1.5, store.level - 1));
}
let initialState = { ...defaultState };
export const store = reactive(initialState);

export const initStore = async () => {
  try {
    const savedData = await get(SAVE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData, bigIntReviver);
      Object.assign(store, { ...defaultState, ...parsed, hasSave: true });
    }
  } catch (e) {
    console.error('Failed to parse save data from IndexedDB:', e);
  }
};
export const TYPE_CHANGE_BANKROLL = {
  GAMBLING: 'GAMBLING',
  CRYPTO_TRADE: 'CRYPTO_TRADE',
  RECEIVE: 'RECEIVE',
  PAY_RENT: 'PAY_RENT',
  PAY_INCOME_TAX: 'PAY_INCOME_TAX',
  PAY_FINE: 'PAY_FINE',
  RESOLVE_PARTNER_DEBT: 'RESOLVE_PARTNER_DEBT',
  BUY_ITEM: 'BUY_ITEM',
  SELL_ITEM: 'SELL_ITEM',
  AI_AGENT_SUBSCRIPTION: 'AI_AGENT_SUBSCRIPTION',
  AGENT_TASK: 'AGENT_TASK',
  PARTNER_BENEFIT: 'PARTNER_BENEFIT',
  PARTNER_DEBT: 'PARTNER_DEBT',
  OTHER: 'OTHER',
  GIVE_BRIBE_DEALER: 'GIVE_BRIBE_DEALER',
  CONTRACT: 'CONTRACT', // 계약 관련
}
export const registerCompletedEvent = (eventId) => {
  if (store.completedEvents.includes(eventId)) return;
  store.completedEvents.push(eventId);
}
export const isCompletedEvent = (eventId) => {
  return store.completedEvents.includes(eventId);
}
export const deleteCompletedEvent = (eventId) => {
  store.completedEvents = store.completedEvents.filter(id => id !== eventId);
}
// CAN USE NAGATIVE AMOUNT
export const gainBankroll = (amount = 0, type = TYPE_CHANGE_BANKROLL.OTHER) => {
  console.log(`[BANKROLL] Gained ${amount} bankroll.`);
  if (Number.isNaN(amount)) return;
  const intAmount = Math.ceil(amount);
  store.bankroll = Math.max(0, store.bankroll + intAmount);

  if (!store.all_time_bankroll_stats[type]) store.all_time_bankroll_stats[type] = 0;
  store.all_time_bankroll_stats[type] += intAmount;

  store.session_net_history.push({ amount: intAmount, type, timestamp: Date.now() });
  if (store.session_net_history.length > 200) store.session_net_history.shift();
  if (type === TYPE_CHANGE_BANKROLL.GAMBLING) store.sessionNetWorth += intAmount;
}

export const saveStore = async () => {
  const dataToSave = { ...store };
  delete dataToSave.hasSave; // Don't persist this meta flag
  await set(SAVE_KEY, JSON.stringify(dataToSave, bigIntReplacer));
};

export const resetStore = async () => {
  Object.assign(store, { ...defaultState, hasSave: false });
  await del(SAVE_KEY);
};
export const calculateSessionReport = () => {
  const current = {
    bankroll: store.bankroll,
    played_hands: store.play_stats.played_hands,
    total_earn_money: store.play_stats.total_earn_money,
    total_lost_money: store.play_stats.total_lost_money,
    max_win_pot: store.play_stats.max_win_pot
  };
  const start = store.statsAtWakeUp;
  const totalProfit = Number(current.bankroll || 0) - Number(start.bankroll || 0);
  const startBankrollNum = Number(start.bankroll || 0);
  const roi = startBankrollNum > 0 ? (totalProfit / startBankrollNum) * 100 : 0;
  const playTime = Number(current.played_hands || 0) - Number(start.played_hands || 0);
  const biggestWin = Number(current.max_win_pot || 0) - Number(start.max_win_pot || 0);
  const detailes = { ...TYPE_CHANGE_BANKROLL }
  Object.keys(detailes).forEach(key => {
    detailes[key] = store.session_net_history.filter(h => h.type === detailes[key]).reduce((acc, h) => acc + h.amount, 0) || 0;
  });
  store.session_net_history = [];
  return {
    totalProfit,
    roi: roi.toFixed(1),
    playTime,
    biggestWin,
    detailes
  };
};