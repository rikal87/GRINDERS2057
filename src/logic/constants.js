export const CONTRACT_TYPE = {
  BENEFIT_SHARE: 'BENEFIT_SHARE', // your win and lose net share
  BAILOUT: 'BAILOUT', // rescue bankrupt each other
  A_DATE_WITH_YOU: 'A_DATE_WITH_YOU', // a date with you
  COLLUSION: 'COLLUSION', // with you gambling then session end share net worth
  STAKING: 'STAKING' // 그가 스테이커(Staker)가 되어 플레이어에게 자금을 대주고, 게임결과에 대해 수익을 나눕니다.
};
export const ENEMY_ID = {
  MAX: 'Max',
  FLORENCE: 'Florence',
  KATE: 'Kate',
  Sloan: 'Sloan',
  MR_CALL: 'mr_call',
  FISH: 'fish',
  BROKE: 'broke',
  AN_UNKNOWN_WOMAN: 'an_unknown_woman',
  GAMBLER: 'gambler',
  MANIAC: 'maniac',
  RICH_GUY: 'rich_guy',
  GANGSTER: 'gangster',
  NIT: 'nit',
  QUANT_PRO: 'quant_pro',
  OLD_LION: 'old_lion',
  SHARK: 'shark',
  THE_DON: 'the_don',
  THE_WHALE: 'the_whale',
  NAMED_PRO: 'named_pro',
}
export const TASK_STATS_TYPE = {
  COST_LT_TOTAL: 'cost_lt_total',
  COMPLETED_TASK_COUNT: 'completed_task_count'
}

export const TYPE_CHANGE_BANKROLL = {
  GAMBLING: 'GAMBLING',
  CRYPTO_TRADE: 'CRYPTO_TRADE',
  RECEIVE: 'RECEIVE',
  PAY_RENT: 'PAY_RENT',
  PAY_INCOME_TAX: 'PAY_INCOME_TAX',
  PAY_FINE: 'PAY_FINE',
  DEBT_REPAYMENT: 'DEBT_REPAYMENT',
  TRANSFER: 'TRANSFER',
  BUY_ITEM: 'BUY_ITEM',
  SELL_ITEM: 'SELL_ITEM',
  AI_AGENT_SUBSCRIPTION: 'AI_AGENT_SUBSCRIPTION',
  AGENT_TASK: 'AGENT_TASK',
  PARTNER_BENEFIT: 'PARTNER_BENEFIT',
  OTHER: 'OTHER',
  ITEM_EFFECT: 'ITEM_EFFECT',
  BRIBE_DEALER: 'BRIBE_DEALER',
  CONTRACT: 'CONTRACT', // 계약 관련
}
export const CHAT_TRIGGERS = {
  GAME_START: 'GAME_START',
  WIN_HUGE: 'WIN_HUGE', // Pot > 40BB
  WIN_SMALL: 'WIN_SMALL',
  LOSE_HUGE: 'LOSE_HUGE',
  LOSE_SMALL: 'LOSE_SMALL',
  CHOP: 'CHOP',
  BLUFF_CAUGHT: 'BLUFF_CAUGHT',
  ALL_IN: 'ALL_IN',
  FOLD: 'FOLD',
  WAITING: 'WAITING',
  BET: 'BET',
  RAISE: 'RAISE',
  CALL: 'CALL',
  CHECK: 'CHECK',
  ELIMINATED_SELF: 'ELIMINATED_SELF',
  ELIMINATED_ENEMY: 'ELIMINATED_ENEMY',
  WIN_HUGE_FOR_PLAYER: 'WIN_HUGE_FOR_PLAYER',
  LOSE_HUGE_FOR_PLAYER: 'LOSE_HUGE_FOR_PLAYER',
  WIN_SMALL_FOR_PLAYER: 'WIN_SMALL_FOR_PLAYER',
  LOSE_SMALL_FOR_PLAYER: 'LOSE_SMALL_FOR_PLAYER',
  ALL_IN_FOR_PLAYER: 'ALL_IN_FOR_PLAYER',
  FOLD_FOR_PLAYER: 'FOLD_FOR_PLAYER',
  WAITING_FOR_PLAYER: 'WAITING_FOR_PLAYER',
  RAISE_SMALL_FOR_PLAYER: 'RAISE_SMALL_FOR_PLAYER',
  RAISE_MEDIUM_FOR_PLAYER: 'RAISE_MEDIUM_FOR_PLAYER',
  RAISE_BIG_FOR_PLAYER: 'RAISE_BIG_FOR_PLAYER',
  CALL_FOR_PLAYER: 'CALL_FOR_PLAYER',
  CHECK_FOR_PLAYER: 'CHECK_FOR_PLAYER',
  BLUFF_CAUGHT_FOR_PLAYER: 'BLUFF_CAUGHT_FOR_PLAYER',
};



export const PARTNER_ID = {
  MAX: 'Max',
  FLORENCE: 'Florence',
};

export const PARTNER_STATUS = {
  GAMBLING: 'GAMBLING', // IN CASINO
  SLEEPING: 'SLEEPING',
  EATING: 'EATING',
  DRINKING: 'DRINKING',
  RESTING: 'RESTING',
  IDLE: 'IDLE',
};
export const LOCATION_ID = {
  FREE_HABITAT: "free_habitat",
  FREE_STREET_SHOP_WITH_MAX: "free_street_shop_with_max",
  MICRO_WAREHOUSE: "micro_warehouse",
  MICRO_UNDERGROUND_BAR: "micro_underground_bar",
  LOW_NEON_LOUNGE: "low_neon_lounge",
  LOW_UNDERGROUND_CLUB: "low_underground_club",
  LOW_OLD_CASINO: "low_old_casino",
  MIDDLE_UNDERGROUND_CASINO: "middle_underground_casino",
  MIDDLE_HOLDEM_HOUSE: "middle_holdem_house",
  MIDDLE_CASINO_HOTEL: "middle_casino_hotel",
  HIGH_PRO_HOUSE: "high_pro_house",
  HIGH_GRAND_CASINO: "high_grand_casino",
  SPECIAL_ORBIT_LOUNGE: "special_orbit_lounge",
  MICRO_WAREHOUSE_WITH_MAX: "micro_warehouse_with_max",
  LOW_UNDERGROUND_CLUB_MEET_MAX: "low_underground_club_meet_max",
  MIDDLE_UNDERGROUND_CASINO_WITH_FLORENCE: "middle_underground_casino_with_florence",
  FREE_HABITAT: 'free_habitat',
  MIDDLE_KBT_BASE: "middle_kbt_base",
}
