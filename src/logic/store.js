import { reactive, watch } from 'vue';
import { AI_AGENT_MODEL_ENUM } from './aiAgentModelClasses';
const SAVE_KEY = 'cyberpoker_save_v1';

const defaultState = {
  bankroll: 999999999,
  chips: 0, // Chips on table
  xp: 0,
  level: 25,
  selectedClass: 'VANGUARD',
  ownedProtectors: [], // Array of materialized item objects
  equippedProtector: null, // item object or null
  equippedSkills: [null, null, null], // 3 Slots
  ownedPortraits: ['p1', 'p2', 'p3'],
  selectedPortrait: 'p1',
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
    model: AI_AGENT_MODEL_ENUM.VANGUARD,
    price_plan_idx: 0,
    subscriptionExpireAt: 0,
    activeTasks: [] // [{ taskId, startTime, lastProcessTime }]
  },
  messages: [], // [{ id, type, title, body, timestamp, isRead, actions?, expireAt? }]
  hasSave: false
};
export const gainShopRefreshCount = (amount = 1) => {
  store.shop.manualRefreshCount = Math.max(0, store.shop.manualRefreshCount + amount);
}
export const gainXP = (player, pot, bb = 1.0, isHighStakes = false, locationLV = 1) => {
  if (!player.isMe) return 0;
  const bbWon = pot / bb;
  let xp = bbWon * 1.0;
  // 티어 가산점: 높은 방일수록 경험치 기본값이 높음
  xp += bb * (isHighStakes ? 10 : 5) * locationLV;
  const bonus = player.tempXPBonus || 0;
  store.xp += Math.ceil(xp * (1 + bonus));
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
const savedData = localStorage.getItem(SAVE_KEY);
let initialState = { ...defaultState };

if (savedData) {
  try {
    const parsed = JSON.parse(savedData);
    // Basic merge: ensure we have all keys from defaultState
    initialState = { ...defaultState, ...parsed, hasSave: true };
  } catch (e) {
    console.error('Failed to parse save data:', e);
  }
}

export const store = reactive(initialState);
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
watch(store, (newState) => {
  const dataToSave = { ...newState };
  delete dataToSave.hasSave; // Don't persist this meta flag
  localStorage.setItem(SAVE_KEY, JSON.stringify(dataToSave));
}, { deep: true });

export const resetStore = () => {
  Object.assign(store, { ...defaultState, hasSave: false });
  localStorage.removeItem(SAVE_KEY);
};
