import { store } from './store'

export const createPlayRecordStats = () => ({
  bust_enemy: {
    'Fish': 0, 'Broke': 0, 'MR_CALL': 0, 'Gambler': 0, 'Rich_Guy': 0,
    'Maniac': 0, 'Gangster': 0, 'Nit': 0, 'Quant_Pro': 0, 'The_Don': 0,
    'Shark': 0, 'Old_Lion': 0, 'Named_Pro': 0, 'Musk_V': 0, 'KBT_Leader': 0,
    'Max': 0, 'Florence': 0
  },
  // Economy
  paid_rake: 0,
  netWinnings: 0,
  // Behavior (VPIP/PFR)
  hands_played: 0,
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
  // Luck & Probability
  showdown_win: 0,
  all_in_win: 0,
  win_without_showdown: 0,
  // Records
  max_win_pot: 0,
  max_lose_pot: 0,
  total_earn_money: 0n,
  total_lost_money: 0n,
  current_lose_streak: 0,
  current_win_streak: 0,
  max_win_streak: 0,
  max_lose_streak: 0,
  max_lose_equity: 0.0,
  min_win_equity: 0.0,
  max_pot: 0,
});
export const PLAY_RECORD_STATS_TYPE = {
  PAID_RAKE: 'paid_rake',
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
}
export const PLAY_RECORD_STATS_MSG_CODE = {
  WIN_BIG: 'win_big',
  WIN_MEDIUM: 'win_medium',
  WIN_SMALL: 'win_small',
  LOSE_BIG: 'lose_big',
  LOSE_MEDIUM: 'lose_medium',
  LOSE_SMALL: 'lose_small',
}
export const pickRandomMessage = (msgCode) => {
  const messages = PLAY_RECORD_STATS_MSG_TEXTS[msgCode];
  const msg = messages[Math.floor(Math.random() * messages.length)];
  return msg;
}
export const PLAY_RECORD_STATS_MSG_TEXTS = {
  [PLAY_RECORD_STATS_MSG_CODE.WIN_BIG]: [
    { ko: '완벽한 운영이었습니다.', en: 'Clinical execution.' },
    { ko: '상대를 완전히 압도했습니다.', en: 'You controlled the flow.' },
    { ko: '흐름을 완벽히 장악했습니다.', en: 'You read the table perfectly.' },
    { ko: '칩 스택이 기하급수적으로 불어납니다.', en: 'Massive stack builder.' },
    { ko: '그라인더의 정석입니다. 기회를 놓치지 않았군요.', en: 'Textbook grinder spot. Max value taken.' }
  ],
  [PLAY_RECORD_STATS_MSG_CODE.WIN_MEDIUM]: [
    { ko: '침착하게 거둔 훌륭한 성과입니다.', en: 'Solid performance.' },
    { ko: '꾸준히 빈틈을 파고든 결과입니다.', en: 'Solid grind.' },
    { ko: '이성적인 판단이 돋보였습니다.', en: 'Disciplined session.' },
    { ko: '당신의 엣지를 확실히 증명했습니다.', en: 'Locked in profit.' },
    { ko: '차곡차곡 쌓아가는 게 진짜 실력입니다.', en: 'Stacking value, piece by piece.' }
  ],
  [PLAY_RECORD_STATS_MSG_CODE.WIN_SMALL]: [
    { ko: '작지만 의미 있는 블라인드 수익입니다.', en: 'Small edge secured.' },
    { ko: '기회를 놓치지 않고 챙겼습니다.', en: 'You took the spot.' },
    { ko: '리스크 없이 확실한 팟만 챙겼습니다.', en: 'Nice minimal-risk pickup.' },
    { ko: '새는 칩을 막고 이익을 챙겼습니다.', en: 'Plugging leaks, making bank.' },
    { ko: '이런 작은 팟이 그라인더의 원동력입니다.', en: 'Every pot counts for a grinder.' }
  ],
  [PLAY_RECORD_STATS_MSG_CODE.LOSE_SMALL]: [
    { ko: '자연스러운 배리언스의 일부입니다.', en: 'Calculated risk.' },
    { ko: '손실 통제가 아주 잘 되었습니다.', en: 'Within variance.' },
    { ko: '통제 가능한 수준의 지출입니다.', en: 'Still manageable.' },
    { ko: '싼 값에 테이블 정보를 얻었습니다.', en: 'Cheap information.' },
    { ko: '이 정도면 언제든 복구할 수 있습니다.', en: 'Easy minor setback.' }
  ],
  [PLAY_RECORD_STATS_MSG_CODE.LOSE_MEDIUM]: [
    { ko: '폴드 타이밍이 한 템포 늦었습니다.', en: 'Marginal spot.' },
    { ko: '손절이 필요했던 까다로운 구간입니다.', en: 'Should have folded.' },
    { ko: '배리언스의 타격을 입었습니다.', en: 'Variance hit.' },
    { ko: '상대의 레인지에 너무 관대했습니다.', en: 'Too loose against their range.' },
    { ko: '멘탈을 유지하세요. 아직 기회는 많습니다.', en: 'Tough spot, keep the discipline.' }
  ],
  [PLAY_RECORD_STATS_MSG_CODE.LOSE_BIG]: [
    { ko: '과감한 선택이었지만 런아웃이 무자비했습니다.', en: 'Brutal runout.' },
    { ko: '오늘 세션에서 가장 뼈아픈 타격입니다.', en: 'Brutal swing.' },
    { ko: '하이 리스크 하이 리턴의 반대 면입니다.', en: 'High risk, high cost. Stay focused.' },
    { ko: '쿨러에 당했습니다. 평정심부터 되찾으세요.', en: 'Big cooler. Focus on the next hand.' },
    { ko: '틸트 경고. 잠시 쉬거나 하향 이동을 고려하세요.', en: 'Tilt warning. Consider a break or stepping down.' }
  ],

}

export const recordPlayStatsSession = (player, action, payload = {}) => {
  if (!player.isMe) return;
  const sessionStats = store.play_stats_session;
  const totalStats = store.play_stats;
  if (action === PLAY_RECORD_STATS_TYPE.HANDS_PLAYED || action === PLAY_RECORD_STATS_TYPE.VPIP || action === PLAY_RECORD_STATS_TYPE.PFR) {
    console.info('[PLAY_RECORD_STATS] Before:', action, sessionStats.hands_played);
  }
  switch (action) {
    case PLAY_RECORD_STATS_TYPE.BET:
    case PLAY_RECORD_STATS_TYPE.RAISE:
      totalStats.raise++;
      sessionStats.raise++;
      break;
    case PLAY_RECORD_STATS_TYPE.CALL:
      totalStats.call++;
      sessionStats.call++;
      break;
    case PLAY_RECORD_STATS_TYPE.FOLD:
      totalStats.fold++;
      sessionStats.fold++;
      break;
    case PLAY_RECORD_STATS_TYPE.CHECK:
      totalStats.check++;
      //
      sessionStats.check++;
      break;
    case PLAY_RECORD_STATS_TYPE.ALL_IN:
      totalStats.all_in++;
      //
      sessionStats.all_in++;
      break;
    case PLAY_RECORD_STATS_TYPE.WIN:
      totalStats.win++;
      sessionStats.win++;

      sessionStats.current_lose_streak = 0
      sessionStats.current_win_streak++;
      console.info('payload.pot', payload.pot)
      if (Number.isInteger(payload.pot)) {
        sessionStats.total_earn_money += BigInt(payload.pot);
        totalStats.total_earn_money += BigInt(payload.pot);
      }

      if (sessionStats.current_win_streak > sessionStats.max_win_streak) {
        sessionStats.max_win_streak = sessionStats.current_win_streak;
      }
      if (totalStats.max_win_streak > sessionStats.current_win_streak) {
        totalStats.max_win_streak = sessionStats.current_win_streak;
      }
      sessionStats.max_win_pot = Math.max(payload.pot || 0, sessionStats.max_win_pot);
      totalStats.max_win_pot = Math.max(payload.pot || 0, totalStats.max_win_pot);
      sessionStats.max_win_equity = Math.max(payload.equity || 0, sessionStats.max_win_equity);
      totalStats.max_win_equity = Math.max(payload.equity || 0, totalStats.max_win_equity);
      if (payload.rake) {
        sessionStats.paid_rake += payload.rake;
        totalStats.paid_rake += payload.rake;
      }
      if (payload.isShowDown) {
        sessionStats.w$sd++;
        totalStats.w$sd++;
      }
      break;
    case PLAY_RECORD_STATS_TYPE.LOSE:
      sessionStats.lose++;
      sessionStats.current_win_streak = 0
      sessionStats.current_lose_streak++;
      if (sessionStats.current_lose_streak > sessionStats.max_lose_streak) {
        sessionStats.max_lose_streak = sessionStats.current_lose_streak;
      }
      sessionStats.max_lose_pot = Math.max(payload.pot || 0, sessionStats.max_lose_pot);
      totalStats.max_lose_pot = Math.max(payload.pot || 0, totalStats.max_lose_pot);
      sessionStats.max_lose_equity = Math.max(payload.equity || 0, sessionStats.max_lose_equity);
      totalStats.max_lose_equity = Math.max(payload.equity || 0, totalStats.max_lose_equity);
      sessionStats.total_lost_money += BigInt(payload.amount);
      break;
    case PLAY_RECORD_STATS_TYPE.BUST:
      sessionStats.bust++;
      totalStats.bust++;
      break;
    case PLAY_RECORD_STATS_TYPE.BANKRUPT:
      sessionStats.bankrupt++;
      totalStats.bankrupt++;
      break;
    case PLAY_RECORD_STATS_TYPE.VPIP:
      sessionStats.vpip_count++;
      totalStats.vpip_count++;
      break;
    case PLAY_RECORD_STATS_TYPE.PFR:
      sessionStats.pfr++;
      sessionStats.vpip_count++;
      totalStats.pfr++;
      totalStats.vpip_count++;
      break;
    case PLAY_RECORD_STATS_TYPE.WTSD:
      sessionStats.wtsd++;
      totalStats.wtsd++;
      break;
    case PLAY_RECORD_STATS_TYPE.WSD:
      sessionStats.wsd++;
      totalStats.wsd++;
      break;
    case PLAY_RECORD_STATS_TYPE.W$SD:
      sessionStats.w$sd++;
      totalStats.w$sd++;
      break;
    case PLAY_RECORD_STATS_TYPE.HANDS_PLAYED:
      sessionStats.hands_played++;
      totalStats.hands_played++;
      break;
    case PLAY_RECORD_STATS_TYPE.FACED_RAISE:
      sessionStats.faced_raise++;
      totalStats.faced_raise++;
      break;
    case PLAY_RECORD_STATS_TYPE.FACED_3BET:
      sessionStats.faced_3bet++;
      totalStats.faced_3bet++;
      break;
    case PLAY_RECORD_STATS_TYPE.FACED_4BET_OR_MORE:
      sessionStats.faced_4bet_or_more++;
      totalStats.faced_4bet_or_more++;
      break;
    case PLAY_RECORD_STATS_TYPE.FOLDED_TO_RAISE:
      sessionStats.folded_to_raise++;
      totalStats.folded_to_raise++;
      break;
    case PLAY_RECORD_STATS_TYPE.FOLDED_TO_3BET:
      sessionStats.folded_to_3bet++;
      totalStats.folded_to_3bet++;
      break;
    case PLAY_RECORD_STATS_TYPE.FOLDED_TO_4BET_OR_MORE:
      sessionStats.folded_to_4bet_or_more++;
      totalStats.folded_to_4bet_or_more++;
      break;
    case PLAY_RECORD_STATS_TYPE.FOLDED_TO_FLOP_BET:
      sessionStats.folded_to_flop_bet++;
      totalStats.folded_to_flop_bet++;
      break;
    case PLAY_RECORD_STATS_TYPE._3BET:
      sessionStats._3bet++;
      totalStats._3bet++;
      break;
    case PLAY_RECORD_STATS_TYPE._4BET_OR_MORE:
      sessionStats._4bet_or_more++;
      totalStats._4bet_or_more++;
      break;
    case PLAY_RECORD_STATS_TYPE.BUST_ENEMY:
      sessionStats.bust_enemy[payload.enemyClass || 'Unknown']++;
      totalStats.bust_enemy[payload.enemyClass || 'Unknown']++;
      break;
  }
}
