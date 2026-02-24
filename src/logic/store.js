import { reactive, watch } from 'vue';
import { get, set, del } from 'idb-keyval';
import { AI_AGENT_MODEL_ENUM, AI_AGENT_MODEL_AND_PLAN_DATA } from './aiAgentModelClasses';
const SAVE_KEY = 'cyberpoker_save_v1';

const defaultState = {
  bankroll: 999999999,
  chips: 0, // Chips on table
  // currentBB: 0,
  xp: 0,
  level: 30,
  selectedClass: 'VANGUARD',
  ownedProtectors: [], // Array of materialized item objects
  equippedProtector: null, // item object or null
  equippedSkills: [null, null, null], // 3 Slots
  activeBoosts: [], // [{ taskId, effect: {} }]
  ownedPortraits: ['p1', 'p2', 'p3'],
  selectedPortrait: 'p1',
  boostRegenLT: 0,
  play_stats: {
    bust_enemy: {
      'Fish': 0, 'Broke': 0, 'MR_CALL': 0, 'Gambler': 0, 'Rich_Guy': 0,
      'Maniac': 0, 'Gangster': 0, 'Nit': 0, 'Quant_Pro': 0, 'Mafia_Boss': 0,
      'Shark': 0, 'Old_Lion': 0, 'Named_Pro': 0, 'Musk_V': 0, 'KBT_Leader': 0
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
  ludusTokens: 0,
  gameTime: new Date('2057-10-20T09:00:00').getTime(), // Start Date
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
    bankroll: 999999999,
    played_hands: 0,
    total_earn_money: 0n,
    total_lost_money: 0n,
    max_win_pot: 0
  },
  hasSave: false
};

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

export const checkLevelUp = (xp) => {
  // 1000 + 2000 >? 1500
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
export const gainBankroll = (amount) => {
  console.log(`[BANKROLL] Gained ${amount} bankroll.`);
  store.bankroll += Math.ceil(amount);
}
export const initializeBankroll = () => {
  const bonus = store.equippedProtector?.effects?.reduce((sum, e) => (e.id === 'initial_bankroll_bonus') ? sum + e.value : sum, 0.0);
  const initialBankroll = store.level * 1000 * (1.0 + bonus);
  console.log(`[BANKROLL] Initial Bankroll: ${initialBankroll}, ${bonus}`);
  // gainBankroll(initialBankroll);
  store.bankroll = Math.ceil(initialBankroll);
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
