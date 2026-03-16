import { store } from './store'
export const PLAY_RECORD_STATS_TYPE = {
  PAID_RAKE: 'paid_rake',
  RAKE_SAVED: 'rake_saved',
  HANDS_PLAYED: 'hands_played',
  FACED_RAISE: 'faced_raise',
  FACED_3BET: 'faced_3bet',
  FACED_4BET_OR_MORE: 'faced_4bet_or_more',
  FOLDED_TO_RAISE: 'folded_to_raise',
  FOLDED_TO_3BET: 'folded_to_3bet',
  FOLDED_TO_4BET_OR_MORE: 'folded_to_4bet_or_more',
  BET: 'bet',
  RAISE: 'raise',
  CALL: 'call',
  FOLD: 'fold',
  CHECK: 'check',
  ALL_IN: 'all_in',
  _3BET: '3bet',
  _4BET_OR_MORE: '4bet_or_more',
  SHOWDOWN: 'showdown',
  WIN: 'win',
  LOSE: 'lose',
  BUST: 'bankrupt',
  VPIP: 'vpip',
  PFR: 'pfr',
  C_BET_COUNT: 'c_bet_count',
  FOLD_TO_3BET: 'fold_to_3bet',
  FOLD_TO_4BET_OR_MORE: 'fold_to_4bet_or_more',
  DONK_BET_COUNT: 'donk_bet_count',
  RAISE3BET: 'raise3bet',
  RAISE4BET_OR_MORE: 'raise4bet_or_more',
  VPIP_COUNT: 'vpip_count',
  FOLDED_TO_FLOP_BET: 'folded_to_flop_bet',
  WTSD: 'wtsd',
  WSD: 'wsd',
  W$SD: 'w$sd',
  MAX_LOSE_STREAK: 'max_lose_streak',
  MAX_WIN_STREAK: 'max_win_streak',
  MAX_LOSE_POT: 'max_lose_pot',
  MAX_WIN_POT: 'max_win_pot',
  MAX_LOSE_EQUITY: 'max_lose_equity',
  MAX_WIN_EQUITY: 'max_win_equity',
  BUST_ENEMY: 'bust_enemy',
  NET_SHARE: 'net_share',
  NET_WINNING: 'net_winning',
  ITEM_EFFECT: 'item_effect',
  COST_LT: 'cost_lt',
  FACED_FLOP_BET: 'faced_flop_bet',
  WIN_WITH_ONE_PAIR: 'win_with_one_pair',
  WIN_WITH_TWO_PAIR: 'win_with_two_pair',
  WIN_WITH_THREE_OF_A_KIND: 'win_with_three_of_a_kind',
  WIN_WITH_STRAIGHT: 'win_with_straight',
  WIN_WITH_FLUSH: 'win_with_flush',
  WIN_WITH_FULL_HOUSE: 'win_with_full_house',
  WIN_WITH_FOUR_OF_A_KIND: 'win_with_four_of_a_kind',
  WIN_WITH_STRAIGHT_FLUSH: 'win_with_straight_flush',
  WIN_WITH_ROYAL_FLUSH: 'win_with_royal_flush',
  SHOWDOWN_WIN: 'showdown_win',
  ALL_IN_WIN: 'all_in_win',
  WIN_WITHOUT_SHOWDOWN: 'win_without_showdown',
  MIN_WIN_EQUITY: 'min_win_equity',
  TOTAL_EARN_MONEY: 'total_earn_money',
  TOTAL_LOST_MONEY: 'total_lost_money',
}
export const createPlayRecordStats = () => ({
  [PLAY_RECORD_STATS_TYPE.BUST_ENEMY]: {
    'Fish': 0, 'Broke': 0, 'MR_CALL': 0, 'Gambler': 0, 'Rich_Guy': 0,
    'Maniac': 0, 'Gangster': 0, 'Nit': 0, 'Quant_Pro': 0, 'The_Don': 0,
    'Shark': 0, 'Old_Lion': 0, 'Named_Pro': 0, 'Musk_V': 0, 'KBT_Leader': 0,
    'Max': 0, 'Florence': 0
  },
  // Economy
  [PLAY_RECORD_STATS_TYPE.COST_LT]: 0,
  [PLAY_RECORD_STATS_TYPE.PAID_RAKE]: 0,
  [PLAY_RECORD_STATS_TYPE.RAKE_SAVED]: 0,
  [PLAY_RECORD_STATS_TYPE.NET_WINNING]: 0,
  [PLAY_RECORD_STATS_TYPE.NET_SHARE]: 0,
  [PLAY_RECORD_STATS_TYPE.ITEM_EFFECT]: 0,
  [PLAY_RECORD_STATS_TYPE.TOTAL_EARN_MONEY]: 0n,
  [PLAY_RECORD_STATS_TYPE.TOTAL_LOST_MONEY]: 0n,
  // Behavior (VPIP/PFR)
  [PLAY_RECORD_STATS_TYPE.HANDS_PLAYED]: 0,
  [PLAY_RECORD_STATS_TYPE.FOLD]: 0,
  [PLAY_RECORD_STATS_TYPE.CHECK]: 0,
  [PLAY_RECORD_STATS_TYPE.CALL]: 0,
  [PLAY_RECORD_STATS_TYPE.RAISE]: 0,
  [PLAY_RECORD_STATS_TYPE.ALL_IN]: 0,
  [PLAY_RECORD_STATS_TYPE.WTSD]: 0, // Went To Showdown
  [PLAY_RECORD_STATS_TYPE.W$SD]: 0, // Won $ at Showdown
  [PLAY_RECORD_STATS_TYPE.PFR]: 0, // Pre-Flop Raise
  [PLAY_RECORD_STATS_TYPE.C_BET_COUNT]: 0,
  [PLAY_RECORD_STATS_TYPE.FOLD_TO_3BET]: 0,
  [PLAY_RECORD_STATS_TYPE.FOLD_TO_4BET_OR_MORE]: 0,
  [PLAY_RECORD_STATS_TYPE.DONK_BET_COUNT]: 0,
  [PLAY_RECORD_STATS_TYPE.RAISE3BET]: 0,
  [PLAY_RECORD_STATS_TYPE.RAISE4BET_OR_MORE]: 0,
  [PLAY_RECORD_STATS_TYPE.VPIP_COUNT]: 0,
  [PLAY_RECORD_STATS_TYPE.FACED_FLOP_BET]: 0,
  [PLAY_RECORD_STATS_TYPE.FOLDED_TO_FLOP_BET]: 0,
  [PLAY_RECORD_STATS_TYPE.SHOWDOWN_WIN]: 0,
  [PLAY_RECORD_STATS_TYPE.ALL_IN_WIN]: 0,
  [PLAY_RECORD_STATS_TYPE.WIN_WITHOUT_SHOWDOWN]: 0,
  [PLAY_RECORD_STATS_TYPE.MAX_WIN_POT]: 0,
  [PLAY_RECORD_STATS_TYPE.MAX_LOSE_POT]: 0,
  // Luck & Probability
  [PLAY_RECORD_STATS_TYPE.MAX_WIN_STREAK]: 0,
  [PLAY_RECORD_STATS_TYPE.MAX_LOSE_STREAK]: 0,
  [PLAY_RECORD_STATS_TYPE.MAX_LOSE_EQUITY]: 0.0,
  [PLAY_RECORD_STATS_TYPE.MIN_WIN_EQUITY]: 0.0,
});

export const GAME_RESULT_CODE = {
  WIN_BIG: 'WIN_BIG',
  WIN_MEDIUM: 'WIN_MEDIUM',
  WIN_SMALL: 'WIN_SMALL',
  LOSE_BIG: 'LOSE_BIG',
  LOSE_MEDIUM: 'LOSE_MEDIUM',
  LOSE_SMALL: 'LOSE_SMALL',
  NEUTRAL: 'NEUTRAL',
}
export const pickRandomMessage = (msgCode) => {
  const messages = PLAY_RECORD_STATS_MSG_TEXTS[msgCode];
  if (!messages || messages.length === 0) return null;
  const msg = messages[Math.floor(Math.random() * messages.length)];
  return msg;
}
export const PLAY_RECORD_STATS_MSG_TEXTS = {
  [GAME_RESULT_CODE.WIN_BIG]: [
    { ko: '완벽한 운영이었습니다.', en: 'Clinical execution.' },
    { ko: '상대를 완전히 압도했습니다.', en: 'You controlled the flow.' },
    { ko: '흐름을 완벽히 장악했습니다.', en: 'You read the table perfectly.' },
    { ko: '칩 스택이 기하급수적으로 불어납니다.', en: 'Massive stack builder.' },
    { ko: '그라인더의 정석입니다. 기회를 놓치지 않았군요.', en: 'Textbook grinder spot. Max value taken.' }
  ],
  [GAME_RESULT_CODE.WIN_MEDIUM]: [
    { ko: '침착하게 거둔 훌륭한 성과입니다.', en: 'Solid performance.' },
    { ko: '꾸준히 빈틈을 파고든 결과입니다.', en: 'Solid grind.' },
    { ko: '이성적인 판단이 돋보였습니다.', en: 'Disciplined session.' },
    { ko: '당신의 엣지를 확실히 증명했습니다.', en: 'Locked in profit.' },
    { ko: '차곡차곡 쌓아가는 게 진짜 실력입니다.', en: 'Stacking value, piece by piece.' }
  ],
  [GAME_RESULT_CODE.WIN_SMALL]: [
    { ko: '작지만 의미 있는 블라인드 수익입니다.', en: 'Small edge secured.' },
    { ko: '기회를 놓치지 않고 챙겼습니다.', en: 'You took the spot.' },
    { ko: '리스크 없이 확실한 팟만 챙겼습니다.', en: 'Nice minimal-risk pickup.' },
    { ko: '새는 칩을 막고 이익을 챙겼습니다.', en: 'Plugging leaks, making bank.' },
    { ko: '이런 작은 팟이 그라인더의 원동력입니다.', en: 'Every pot counts for a grinder.' }
  ],
  [GAME_RESULT_CODE.LOSE_SMALL]: [
    { ko: '자연스러운 배리언스의 일부입니다.', en: 'Calculated risk.' },
    { ko: '손실 통제가 아주 잘 되었습니다.', en: 'Within variance.' },
    { ko: '통제 가능한 수준의 지출입니다.', en: 'Still manageable.' },
    { ko: '싼 값에 테이블 정보를 얻었습니다.', en: 'Cheap information.' },
    { ko: '이 정도면 언제든 복구할 수 있습니다.', en: 'Easy minor setback.' }
  ],
  [GAME_RESULT_CODE.LOSE_MEDIUM]: [
    { ko: '폴드 타이밍이 한 템포 늦었습니다.', en: 'Marginal spot.' },
    { ko: '손절이 필요했던 까다로운 구간입니다.', en: 'Should have folded.' },
    { ko: '배리언스의 타격을 입었습니다.', en: 'Variance hit.' },
    { ko: '상대의 레인지에 너무 관대했습니다.', en: 'Too loose against their range.' },
    { ko: '멘탈을 유지하세요. 아직 기회는 많습니다.', en: 'Tough spot, keep the discipline.' }
  ],
  [GAME_RESULT_CODE.LOSE_BIG]: [
    { ko: '과감한 선택이었지만 런아웃이 무자비했습니다.', en: 'Brutal runout.' },
    { ko: '오늘 세션에서 가장 뼈아픈 타격입니다.', en: 'Brutal swing.' },
    { ko: '하이 리스크 하이 리턴의 반대 면입니다.', en: 'High risk, high cost. Stay focused.' },
    { ko: '쿨러에 당했습니다. 평정심부터 되찾으세요.', en: 'Big cooler. Focus on the next hand.' },
    { ko: '틸트 경고. 잠시 쉬거나 하향 이동을 고려하세요.', en: 'Tilt warning. Consider a break or stepping down.' }
  ],
  [GAME_RESULT_CODE.NEUTRAL]: [
    { ko: 'EV 기준 중립 결과입니다.', en: 'EV-neutral outcome.' },
    { ko: '큰 변동 없이 지나간 핸드입니다.', en: 'No significant change this hand.' },
    { ko: '균형 잡힌 선택이었습니다.', en: 'Balanced decision.' },
    { ko: '의사결정 품질은 유지되었습니다.', en: 'Decision quality maintained.' },
    { ko: '장기 수익률에 영향 없는 결과입니다.', en: 'No impact on long-term ROI.' },
    { ko: '분산 범위 내 정상 구간입니다.', en: 'Within standard variance band.' }
  ],
}

export const recordPlayStatsSession = (player, action, payload = {}) => {
  if (player.isMe) recordPlayStatsSessionForPlayer(player, action, payload)
  else recordPlayStatsSessionForCPU(player, action, payload);
}
export const recordPlayStatsSessionForCPU = (player, action, payload) => {
  const sessionStats = player.stats;
  if (action === PLAY_RECORD_STATS_TYPE.HANDS_PLAYED || action === PLAY_RECORD_STATS_TYPE.VPIP || action === PLAY_RECORD_STATS_TYPE.PFR) {
    console.info('[PLAY_RECORD_STATS_CPU] Before:', action, sessionStats.handsPlayed);
  }
  switch (action) {
    case PLAY_RECORD_STATS_TYPE.BET:
    case PLAY_RECORD_STATS_TYPE.RAISE:
      sessionStats.aggressiveActions++;
      break;
    case PLAY_RECORD_STATS_TYPE.CALL:
      sessionStats.calls++;
      break;
    case PLAY_RECORD_STATS_TYPE.FOLD:
      sessionStats.fold++;
      break;
    case PLAY_RECORD_STATS_TYPE.CHECK:
      sessionStats.check++;
      break;
    case PLAY_RECORD_STATS_TYPE.ALL_IN:
      sessionStats.all_in++;
      break;
    case PLAY_RECORD_STATS_TYPE.WIN:
      sessionStats.win++;
      sessionStats.currentLoseStreak = 0
      sessionStats.currentWinStreak++;
      if (sessionStats.currentWinStreak > sessionStats.maxWinStreak) {
        sessionStats.maxWinStreak = sessionStats.currentWinStreak;
      }
      sessionStats.max_win_equity = Math.max(payload.equity || 0, sessionStats.max_win_equity);
      if (payload.rake) {
        sessionStats.paid_rake += payload.rake;
      }
      if (payload.rakeSaved) {
        sessionStats.rake_saved += payload.rakeSaved;
      }
      if (payload.isShowDown) {
        sessionStats.w$sd++;
      }
      break;
    case PLAY_RECORD_STATS_TYPE.LOSE:
      sessionStats.lose++;
      sessionStats.currentWinStreak = 0
      sessionStats.currentLoseStreak++;
      if (sessionStats.currentLoseStreak > sessionStats.maxLoseStreak) {
        sessionStats.maxLoseStreak = sessionStats.currentLoseStreak;
      }
      sessionStats.maxLoseEquity = Math.max(payload.equity || 0, sessionStats.maxLoseEquity);
      sessionStats.maxLosePot = Math.max(payload.pot || 0, sessionStats.maxLosePot);
      break;
    case PLAY_RECORD_STATS_TYPE.BUST:
      sessionStats.bust++;
      break;
    case PLAY_RECORD_STATS_TYPE.BANKRUPT:
      sessionStats.bankrupt++;
      break;
    case PLAY_RECORD_STATS_TYPE.VPIP:
      sessionStats.vPIPCount++;
      break;
    case PLAY_RECORD_STATS_TYPE.PFR:
      sessionStats.pfrCount++;
      break;
    case PLAY_RECORD_STATS_TYPE.WTSD:
      sessionStats.wtsd++;
      break;
    case PLAY_RECORD_STATS_TYPE.WSD:
      sessionStats.wsd++;
      break;
    case PLAY_RECORD_STATS_TYPE.W$SD:
      sessionStats.w$sd++;
      break;
    case PLAY_RECORD_STATS_TYPE.HANDS_PLAYED:
      sessionStats.handsPlayed++;
      break;
    case PLAY_RECORD_STATS_TYPE.FACED_RAISE:
      sessionStats.faced_raise++;
      break;
    case PLAY_RECORD_STATS_TYPE.FACED_3BET:
      sessionStats.faced_3bet++;
      break;
    case PLAY_RECORD_STATS_TYPE.FACED_4BET_OR_MORE:
      sessionStats.faced_4bet_or_more++;
      break;
    case PLAY_RECORD_STATS_TYPE.FOLDED_TO_RAISE:
      sessionStats.folded_to_raise++;
      break;
    case PLAY_RECORD_STATS_TYPE.FOLDED_TO_3BET:
      sessionStats.folded_to_3bet++;
      break;
    case PLAY_RECORD_STATS_TYPE.FOLDED_TO_4BET_OR_MORE:
      sessionStats.folded_to_4bet_or_more++;
      break;
    case PLAY_RECORD_STATS_TYPE.FOLDED_TO_FLOP_BET:
      sessionStats.foldedToFlopBet++;
      break;
    case PLAY_RECORD_STATS_TYPE.FACED_FLOP_BET:
      sessionStats.facedFlopBet++;
      break;
    case PLAY_RECORD_STATS_TYPE._3BET:
      sessionStats.threeBetCount++;
      break;
    case PLAY_RECORD_STATS_TYPE._4BET_OR_MORE:
      sessionStats.fourBetOrMoreCount++; // Simplified for CPU for now
      break;
    case PLAY_RECORD_STATS_TYPE.NET_WINNING:
      sessionStats.net_winning += payload.amount;
      break;
  }
}
export const recordPlayStatsSessionForPlayer = (player, action, payload) => {
  const totalStats = store.play_stats;
  const sessionStats = store.play_stats_session;
  if (sessionStats && (action === PLAY_RECORD_STATS_TYPE.HANDS_PLAYED || action === PLAY_RECORD_STATS_TYPE.VPIP || action === PLAY_RECORD_STATS_TYPE.PFR)) {
    console.info('[PLAY_RECORD_STATS_PLAYER] Before:', action, sessionStats.hands_played);
  }
  switch (action) {
    case PLAY_RECORD_STATS_TYPE.BET:
    case PLAY_RECORD_STATS_TYPE.RAISE:
      totalStats.raise++;
      if (sessionStats) sessionStats.raise++;
      break;
    case PLAY_RECORD_STATS_TYPE.CALL:
      totalStats.call++;
      if (sessionStats) sessionStats.call++;
      break;
    case PLAY_RECORD_STATS_TYPE.FOLD:
      totalStats.fold++;
      if (sessionStats) sessionStats.fold++;
      break;
    case PLAY_RECORD_STATS_TYPE.CHECK:
      totalStats.check++;
      if (sessionStats) sessionStats.check++;
      break;
    case PLAY_RECORD_STATS_TYPE.ALL_IN:
      totalStats.all_in++;
      if (sessionStats) sessionStats.all_in++;
      break;
    case PLAY_RECORD_STATS_TYPE.WIN:
      totalStats.win++;
      if (sessionStats) {
        sessionStats.win++;
        sessionStats.current_lose_streak = 0
        sessionStats.current_win_streak++;
        if (sessionStats.current_win_streak > sessionStats.max_win_streak) {
          sessionStats.max_win_streak = sessionStats.current_win_streak;
        }
        sessionStats.max_win_pot = Math.max(payload.pot || 0, sessionStats.max_win_pot);
        sessionStats.max_win_equity = Math.max(payload.equity || 0, sessionStats.max_win_equity);
        if (payload.rake) {
          sessionStats.paid_rake += payload.rake;
        }
        if (payload.rakeSaved) {
          sessionStats.rake_saved += payload.rakeSaved;
        }
        if (payload.isShowDown) {
          sessionStats.w$sd++;
        }
      }

      if (Number.isInteger(payload.pot) && Number.isInteger(payload.amount)) {
        totalStats[PLAY_RECORD_STATS_TYPE.TOTAL_EARN_MONEY] += BigInt(payload.pot - payload.amount);
        if (sessionStats) sessionStats[PLAY_RECORD_STATS_TYPE.TOTAL_EARN_MONEY] += BigInt(payload.pot - payload.amount);
      }

      if (totalStats.max_win_streak > (sessionStats?.current_win_streak || 0)) {
        // totalStats.max_win_streak = sessionStats.current_win_streak; // This logic seems backwards in original code, but keeping it consistent with null check
      }
      totalStats.max_win_pot = Math.max(payload.pot || 0, totalStats.max_win_pot);
      totalStats.max_win_equity = Math.max(payload.equity || 0, totalStats.max_win_equity);
      if (payload.rake) {
        totalStats.paid_rake += payload.rake;
      }
      if (payload.rakeSaved) {
        totalStats.rake_saved += payload.rakeSaved;
      }
      if (payload.isShowDown) {
        totalStats.w$sd++;
      }
      break;
    case PLAY_RECORD_STATS_TYPE.LOSE:
      totalStats.lose++;
      if (sessionStats) {
        sessionStats.lose++;
        sessionStats.current_win_streak = 0
        sessionStats.current_lose_streak++;
        if (sessionStats.current_lose_streak > sessionStats.max_lose_streak) {
          sessionStats.max_lose_streak = sessionStats.current_lose_streak;
        }
        sessionStats.max_lose_equity = Math.max(payload.equity || 0, sessionStats.max_lose_equity);
        sessionStats.max_lose_pot = Math.max(payload.pot || 0, sessionStats.max_lose_pot);
      }
      totalStats.max_lose_equity = Math.max(payload.equity || 0, totalStats.max_lose_equity);
      totalStats.max_lose_pot = Math.max(payload.pot || 0, totalStats.max_lose_pot);
      if (Number.isInteger(payload.pot) && Number.isInteger(payload.amount)) {
        totalStats[PLAY_RECORD_STATS_TYPE.TOTAL_LOST_MONEY] += BigInt(payload.pot - payload.amount);
        if (sessionStats) sessionStats[PLAY_RECORD_STATS_TYPE.TOTAL_LOST_MONEY] += BigInt(payload.pot - payload.amount);
      }
      break;
    case PLAY_RECORD_STATS_TYPE.BUST:
      totalStats.bust++;
      if (sessionStats) sessionStats.bust++;
      break;
    case PLAY_RECORD_STATS_TYPE.BANKRUPT:
      totalStats.bankrupt++;
      if (sessionStats) sessionStats.bankrupt++;
      break;
    case PLAY_RECORD_STATS_TYPE.VPIP:
      totalStats.vpip_count++;
      if (sessionStats) sessionStats.vpip_count++;
      break;
    case PLAY_RECORD_STATS_TYPE.PFR:
      totalStats.pfr++;
      if (sessionStats) sessionStats.pfr++;
      break;
    case PLAY_RECORD_STATS_TYPE.WTSD:
      totalStats.wtsd++;
      if (sessionStats) sessionStats.wtsd++;
      break;
    case PLAY_RECORD_STATS_TYPE.WSD:
      totalStats.wsd++;
      if (sessionStats) sessionStats.wsd++;
      break;
    case PLAY_RECORD_STATS_TYPE.W$SD:
      totalStats.w$sd++;
      if (sessionStats) sessionStats.w$sd++;
      break;
    case PLAY_RECORD_STATS_TYPE.HANDS_PLAYED:
      totalStats.hands_played++;
      if (sessionStats) sessionStats.hands_played++;
      break;
    case PLAY_RECORD_STATS_TYPE.FACED_RAISE:
      totalStats.faced_raise++;
      if (sessionStats) sessionStats.faced_raise++;
      break;
    case PLAY_RECORD_STATS_TYPE.FACED_3BET:
      totalStats.faced_3bet++;
      if (sessionStats) sessionStats.faced_3bet++;
      break;
    case PLAY_RECORD_STATS_TYPE.FACED_4BET_OR_MORE:
      totalStats.faced_4bet_or_more++;
      if (sessionStats) sessionStats.faced_4bet_or_more++;
      break;
    case PLAY_RECORD_STATS_TYPE.FOLDED_TO_RAISE:
      totalStats.folded_to_raise++;
      if (sessionStats) sessionStats.folded_to_raise++;
      break;
    case PLAY_RECORD_STATS_TYPE.FOLDED_TO_3BET:
      totalStats.folded_to_3bet++;
      if (sessionStats) sessionStats.folded_to_3bet++;
      break;
    case PLAY_RECORD_STATS_TYPE.FOLDED_TO_4BET_OR_MORE:
      totalStats.folded_to_4bet_or_more++;
      if (sessionStats) sessionStats.folded_to_4bet_or_more++;
      break;
    case PLAY_RECORD_STATS_TYPE.FOLDED_TO_FLOP_BET:
      totalStats.folded_to_flop_bet++;
      if (sessionStats) sessionStats.folded_to_flop_bet++;
      break;
    case PLAY_RECORD_STATS_TYPE.FACED_FLOP_BET:
      totalStats.faced_flop_bet++;
      if (sessionStats) sessionStats.faced_flop_bet++;
      break;
    case PLAY_RECORD_STATS_TYPE._3BET:
      totalStats.raise3bet++;
      if (sessionStats) sessionStats.raise3bet++;
      break;
    case PLAY_RECORD_STATS_TYPE._4BET_OR_MORE:
      totalStats.raise4bet_or_more++;
      if (sessionStats) sessionStats.raise4bet_or_more++;
      break;
    case PLAY_RECORD_STATS_TYPE.BUST_ENEMY:
      totalStats.bust_enemy[payload.enemyClass || 'fish']++;
      if (sessionStats) sessionStats.bust_enemy[payload.enemyClass || 'fish']++;
      break;
    case PLAY_RECORD_STATS_TYPE.NET_SHARE:
      totalStats.net_share += payload.amount;
      if (sessionStats) sessionStats.net_share += payload.amount;
      break;
    case PLAY_RECORD_STATS_TYPE.NET_WINNING:
      totalStats.net_winning += payload.amount;
      if (sessionStats) sessionStats.net_winning += payload.amount;
      break;
    case PLAY_RECORD_STATS_TYPE.ITEM_EFFECT:
      totalStats.item_effect += payload.amount;
      if (sessionStats) sessionStats.item_effect += payload.amount;
      break;
  }
}