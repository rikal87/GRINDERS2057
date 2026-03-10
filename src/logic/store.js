import { reactive } from 'vue';
import { createPlayRecordStats, GAME_RESULT_CODE, PLAY_RECORD_STATS_TYPE, recordPlayStatsSession } from './playRecordStats';
import { get, set, del } from 'idb-keyval';
import { AI_AGENT_MODEL_ENUM, AI_AGENT_MODEL_AND_PLAN_DATA } from './aiAgentModelClasses';
import { initializePartners, triggerBankruptRescueForPlayer, gainRelationship } from './partnerSystem';
import { shareBenefitForPartners, shareCollusion } from './partnerContractSystem'
import { setLanguageGetter } from './persona.js';
import { deleteMessage } from './messageSystem';
import { zones } from './zone.js';
import { scheduleEvent, EVENT_ID } from './eventSystem.js';
import { LOCATION_ID, PARTNER_ID, TYPE_CHANGE_BANKROLL } from './constants.js'
const SAVE_KEY = 'cyberpoker_save_v1';

const getDefaultState = () => ({
  bankroll: 12220000,
  // bankroll:20000
  chips: 0, // Chips on table
  // currentBB: 0,
  xp: 0,
  // level:1,
  level: 41,
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
  status_zone: {
    'micro_warehouse_with_max': { suspicion: 0.0, infamy: 0.0, isBlacklisted: false },
    'micro_underground_bar': { suspicion: 0.0, infamy: 0.0, isBlacklisted: false },
    'micro_warehouse': { suspicion: 0.0, infamy: 0.0, isBlacklisted: false },
  },
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
  partners: initializePartners(),
  // partners: [], // initialized dynamically to avoid persona.js -> store.js circular dependency
  isRealGameOver: false,
  realGameOverReason: '',
  cleared_zones: {
    'micro_warehouse_with_max': 0,
    'micro_underground_bar': 0,
    'micro_warehouse': 0,
  },
  play_stats: createPlayRecordStats(),
  play_stats_session: createPlayRecordStats(),
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
  agentStats: {
    cost_lt_total: 0,
    completed_task_count: 0,
    failed_task_count: 0,
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
  hasSave: false,
  // last_session_stats: null // Used for settlement popup
});
const RENT_BILL_MAX_MISS = 3;
const INCOME_TAX_MAX_MISS = 3;
const FINE_MAX_MISS = 3;
export const MISSED_PAYMENT_TYPE = {
  RENT_BILL: 'rent_bill',
  INCOME_TAX: 'income_tax',
  FINE: 'fine',
}
export const MAX_MISS = {
  [MISSED_PAYMENT_TYPE.RENT_BILL]: RENT_BILL_MAX_MISS,
  [MISSED_PAYMENT_TYPE.INCOME_TAX]: INCOME_TAX_MAX_MISS,
  [MISSED_PAYMENT_TYPE.FINE]: FINE_MAX_MISS,
}
export const getTotalIncomeTaxCalculated = () => {
  const amount = store.bankroll - store.latest_pay_income_base_amount;
  if (amount <= 0) return 0;
  let progressive_income_tax = 0.1;
  if (amount >= 100000) progressive_income_tax += 0.05;
  if (amount >= 500000) progressive_income_tax += 0.1;
  if (amount >= 1000000) progressive_income_tax += 0.15;
  if (amount >= 5000000) progressive_income_tax += 0.2;
  if (amount >= 10000000) progressive_income_tax += 0.25;
  return Math.ceil(amount * progressive_income_tax);
}
export const isUnlockedLocation = (locationId) => {
  return store.unlockedLocations.includes(locationId);
}
export const gainMissedPayments = (type, amount) => {
  store.missedPayments[type] = (store.missedPayments[type] || 0) + amount;
}
export const getMissedPayments = (type) => {
  return store.missedPayments[type];
}
export const getLanguage = () => {
  return store.settings.language;
};

export const getLocalizedText = (obj, field) => {
  console.info('obj', obj)
  if (!obj) return '';
  const lang = getLanguage();
  if (field) {
    return lang === 'en' ? (obj[`${field}_en`] || obj[field]) : (obj[`${field}_ko`] || obj[field]);
  } else {
    return lang === 'en' ? (obj._en || obj) : (obj._ko || obj);
  }
};
export const getGameTime = () => {
  return store.gameTime;
}
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

export const getCurrentBankroll = () => {
  return store.bankroll;
}

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
export const gainXPEstimate = (player, pot, bb = 1.0, isAdvanced = false, locationLV = 1) => {
  if (!player.isMe) return 0;
  const bbWon = pot / bb;
  let xp = bbWon * 1.0;
  // 티어 가산점: 높은 방일수록 경험치 기본값이 높음
  xp += bb * (isAdvanced ? 2 : 1) * locationLV;
  // AI Agent Boost effects
  const activeXpBoosts = store.activeBoosts
    .filter(b => b.effect.type === 'xp_boost')
    .reduce((sum, b) => sum + (b.effect.amount || 0), 0);
  const bonus = player.tempXPBonus || 0;
  player.gainedXp += Math.ceil(xp * (1 + bonus + activeXpBoosts));
  console.info('player.tempXPBonus', player.tempXPBonus)
  player.tempXPBonus = 0;
  console.log(`[XP] Gain ${xp} XP.(Estimate)`);
  return xp;
}
export const gainXP = (player) => {
  if (!player.isMe) return 0;
  const xp = Math.ceil(player.gainedXp);
  store.xp += xp;
  player.gainedXp = 0; // reset player xp(temp value)
  console.log(`[XP] Gained ${xp} XP.`);
  checkLevelUp(xp);
  return xp;
}
export const gainSuspicion = (locationId, amount) => {
  if (!store.status_zone[locationId]) store.status_zone[locationId] = { suspicion: 0, infamy: 0, isBlacklisted: false };
  const suspicion = Math.ceil(Math.max(0, store.status_zone[locationId].suspicion + Math.min(100, amount)));
  store.status_zone[locationId].suspicion = suspicion;
  if (suspicion >= 100) store.status_zone[locationId].isBlacklisted = true;
}
export const isBlacklisted = (locationId) => {
  if (!store.status_zone[locationId]) return false;
  return store.status_zone[locationId].isBlacklisted;
}
export const unlockBlacklist = (locationId) => {
  if (!store.status_zone[locationId]) store.status_zone[locationId] = { suspicion: 0, infamy: 0, isBlacklisted: false };
  store.status_zone[locationId].isBlacklisted = false;
}
export const getCurrentSuspicion = (locationId) => {
  if (!store.status_zone[locationId]) return 0;
  return store.status_zone[locationId].suspicion;
}
export const gainInfamy = (locationId, amount) => {
  if (!store.status_zone[locationId]) store.status_zone[locationId] = { suspicion: 0, infamy: 0, isBlacklisted: false };
  const infamy = Math.ceil(Math.max(0, store.status_zone[locationId].infamy + Math.min(100, amount)));
  store.status_zone[locationId].infamy = infamy;
}
export const getCurrentInfamy = (locationId) => {
  if (!store.status_zone[locationId]) return 0;
  return store.status_zone[locationId].infamy;
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
let initialState = getDefaultState();
export const store = reactive(initialState);
setLanguageGetter(() => store.settings.language);

export const initStore = async () => {
  try {
    const savedData = await get(SAVE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData, bigIntReviver);
      const defaultState = getDefaultState();
      if (parsed.play_stats) {
        if (parsed.play_stats.played_hands !== undefined) {
          parsed.play_stats.hands_played = parsed.play_stats.played_hands;
          delete parsed.play_stats.played_hands;
        }
        parsed.play_stats = { ...defaultState.play_stats, ...parsed.play_stats };
      } else {
        parsed.play_stats = { ...defaultState.play_stats };
      }
      if (parsed.play_stats_session) {
        if (parsed.play_stats_session.played_hands !== undefined) {
          parsed.play_stats_session.hands_played = parsed.play_stats_session.played_hands;
          delete parsed.play_stats_session.played_hands;
        }
        parsed.play_stats_session = { ...defaultState.play_stats_session, ...parsed.play_stats_session };
      } else {
        parsed.play_stats_session = { ...defaultState.play_stats_session };
      }
      Object.assign(store, { ...defaultState, ...parsed, hasSave: true });
    } else {
      // store.partners = initializePartners();
    }
  } catch (e) {
    console.error('Failed to parse save data from IndexedDB:', e);
    // store.partners = initializePartners();
  }
};

// EVENT SYSTEM
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

// ZONE CLEAR SYSTEM
export const getClearedZoneCount = (zoneId) => {
  return store.cleared_zones[zoneId] || 0;
}
export const gainClearedZoneCount = (locationId) => {
  if (!locationId) return;
  if (!store.cleared_zones[locationId]) store.cleared_zones[locationId] = 1
  store.cleared_zones[locationId]++
}

// CAN USE NAGATIVE AMOUNT
export const gainBankroll = (amount = 0, type = TYPE_CHANGE_BANKROLL.OTHER) => {
  console.log(`[BANKROLL] Gained ${amount} bankroll.`);
  if (Number.isNaN(amount)) return;
  const intAmount = Math.ceil(amount);
  store.bankroll = Math.max(0, store.bankroll + intAmount);
  store.session_net_history.push({ amount: intAmount, type, timestamp: Date.now() });
  if (store.session_net_history.length > 200) store.session_net_history.shift();
}

export const saveStore = async () => {
  const dataToSave = { ...store };
  delete dataToSave.hasSave; // Don't persist this meta flag
  await set(SAVE_KEY, JSON.stringify(dataToSave, bigIntReplacer));
};

export const resetStore = async () => {
  Object.assign(store, { ...getDefaultState(), hasSave: false });
  await del(SAVE_KEY);
};
export const calculateSessionReport = () => {
  // const current = {
  //   bankroll: store.bankroll,
  //   played_hands: store.play_stats.played_hands,
  //   total_earn_money: store.play_stats.total_earn_money,
  //   total_lost_money: store.play_stats.total_lost_money,
  //   max_win_pot: store.play_stats.max_win_pot
  // };
  const detailes = { ...TYPE_CHANGE_BANKROLL }
  Object.keys(detailes).forEach(key => {
    detailes[key] = store.session_net_history.filter(h => h.type === detailes[key]).reduce((acc, h) => acc + h.amount, 0) || 0;
  });
  store.session_net_history = [];
  return detailes;
};
export const gameResult = (winBB) => {
  if (winBB >= 100) return GAME_RESULT_CODE.WIN_BIG;
  if (winBB >= 50) return GAME_RESULT_CODE.WIN_MEDIUM;
  if (winBB >= 30) return GAME_RESULT_CODE.WIN_SMALL;
  if (winBB <= -100) return GAME_RESULT_CODE.LOSE_BIG;
  if (winBB <= -50) return GAME_RESULT_CODE.LOSE_MEDIUM;
  if (winBB <= -30) return GAME_RESULT_CODE.LOSE_SMALL;
  return GAME_RESULT_CODE.NEUTRAL;
}
export const applySessionExit = (engine) => {

  const player = engine.players.find(p => p.isMe);
  const netWinnings = (player.chips - player.totalBuyIn);
  recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.NET_WINNING, { amount: netWinnings })
  const winBB = netWinnings / engine.bb;
  // infarmy Calc
  let generatedInfamy = winBB * 0.2;
  let baseBoostInfamy = (engine.exitReservationRounds === -1 ? 1.0 : 0.5) + player.born_villain + player.infamy_boost;
  if (generatedInfamy > 0) {
    gainInfamy(engine.locationId, generatedInfamy * baseBoostInfamy);
  } else gainInfamy(engine.locationId, generatedInfamy);
  // game result Calc
  const result = gameResult(winBB);
  store.play_stats_session.msgCode = result
  if (result === GAME_RESULT_CODE.WIN_BIG) gainClearReward(engine.locationId);
  if (result.indexOf('WIN') !== -1) {
    gainClearedZoneCount(engine.locationId);
  }
  // mission result
  processMissionResult(player, result, engine);
  // gain xp and bankroll
  gainXP(player);
  gainBankroll(player.chips, TYPE_CHANGE_BANKROLL.GAMBLING); // returned chips

  // share collusion
  const partners = engine.players.filter(p => p.isPartner);
  partners.forEach(partner => {
    console.info('shareCollusion in game', partner, engine)
    const partnerNetWinnings = partner.chips - partner.initialChips;
    console.info('in game', partner, partnerNetWinnings)
    const share = shareCollusion(partner.id, netWinnings, partnerNetWinnings)
    recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.NET_SHARE, { amount: -share })
    // todo chips calculate to partner.bankroll
  });
  // share benefit
  const share = shareBenefitForPartners(netWinnings);
  recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.NET_SHARE, { amount: -share })
  if (store.bankroll === 0) triggerBankruptRescueForPlayer();
  saveStore();
  // return t
};
const gainClearReward = (locationId) => {
  let reward = null;
  for (const tier of zones) {
    const loc = tier.locations.find(l => l.id === locationId);
    if (loc && loc.firstClearRewards) {
      reward = loc.firstClearRewards;
      break;
    }
  }
  if (reward) {
    if (!store.unlockedLocations) store.unlockedLocations = [];
    if (!store.unlockedLocations.includes(reward)) {
      store.unlockedLocations.push(reward);
      scheduleEvent(EVENT_ID.UNLOCK_ZONE[reward.toUpperCase()], 1);
      console.log(`[GAME] First Clear Reward Awarded: ${reward}`);
    }
  }
}
const processMissionResult = (player, result, engine) => {
  const locationId = engine.locationId;
  const inviteId = engine.inviteId;

  // Mission FREE_STREET_SHOP_WITH_MAX
  deleteMessage(inviteId);
  if (locationId === LOCATION_ID.FREE_STREET_SHOP_WITH_MAX) {
    const client = engine.players.find(p => p.id === PARTNER_ID.MAX);
    console.info('client', client)
    if (!client) return;
    if (result.indexOf('WIN') !== -1) {
      if (client.chips > player.chips) {
        gainRelationship(client.id, 50);
        scheduleEvent(EVENT_ID.MAX.TUTORIAL_WIN_MAX, 30);
      } else {
        gainRelationship(client.id, 100);
        scheduleEvent(EVENT_ID.MAX.TUTORIAL_WIN, 30);
      }
    } else if (result.indexOf('LOSE') !== -1) {
      if (!client.isEliminated) {
        scheduleEvent(EVENT_ID.MAX.TUTORIAL_LOSE_PLAYER, 30);
      }
      scheduleEvent(EVENT_ID.MAX.TUTORIAL_THEN_LOSE_RETRY, 45);
    } else {
      if (store.completedEvents.includes(EVENT_ID.MAX.TUTORIAL_LEAVE)) {
        scheduleEvent(EVENT_ID.MAX.TUTORIAL_LEAVE_AGAIN, 30);
      } else {
        scheduleEvent(EVENT_ID.MAX.TUTORIAL_LEAVE, 30);
      }
    }
  }
  if (locationId === LOCATION_ID.MICRO_WAREHOUSE_WITH_MAX) {
    const client = engine.players.find(p => p.id === PARTNER_ID.MAX);
    console.info('client', client)
    if (!client) return;
    if (result.indexOf('WIN') !== -1) {
      if (client.chips > player.chips) {
        gainRelationship(client.id, 50);
        scheduleEvent(EVENT_ID.MAX.WIN_PLAYER, 30);
      } else {
        gainRelationship(client.id, 100);
        scheduleEvent(EVENT_ID.MAX.WIN_MAX, 30);
      }
    } else if (result.indexOf('LOSE') !== -1) {
      if (!client.isEliminated) {
        scheduleEvent(EVENT_ID.MAX.PLAYER_ELIMINATED, 30);
      }
    } else {
      scheduleEvent(EVENT_ID.MAX.PLAYER_LEAVE, 30);
    }
  }
  if (locationId === LOCATION_ID.LOW_NEON_LOUNGE) {
    // timer: 3 * 60,
    if ([GAME_RESULT_CODE.WIN_BIG, GAME_RESULT_CODE.WIN_MEDIUM].includes(result)) {
      scheduleEvent(EVENT_ID.MAX.MAIN_STORY_1_MEET_AT_CLUB, 2 * 60);
    }
  }
  // Mission LOW_UNDERGROUND_CLUB_MEET_MAX
  if (locationId === LOCATION_ID.LOW_UNDERGROUND_CLUB_MEET_MAX) {
    const client = engine.players.find(p => p.id === PARTNER_ID.MAX);
    if (result.indexOf('WIN') !== -1) {
      gainRelationship(client.id, 50);
      scheduleEvent(EVENT_ID.MAX.MAIN_STORY_1_2_MEET_AT_CLUB_SUCCESS, 30);
    } else {
      scheduleEvent(EVENT_ID.MAX.MAIN_STORY_1_2_MEET_AT_CLUB_FAILED, 30);
    }
  }
  if (locationId === LOCATION_ID.LOW_UNDERGROUND_CLUB) {
    if (result === GAME_RESULT_CODE.WIN_BIG) {
      scheduleEvent(EVENT_ID.FLORENCE.MAIN_STORY_1_2_MEET_AT_CLUB_SUCCESS, 30);
    }
  }
}