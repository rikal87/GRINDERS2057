import { store } from './store'
import { TYPE_CHANGE_BANKROLL } from './constants'
import { recordPlayStatsSessionForCPU } from './playRecordStatsForCPU'
export const PLAY_RECORD_STATS_TYPE = {
  ...TYPE_CHANGE_BANKROLL,
  LEVEL_REACHED: 'level_reached',
  PAID_RAKE: 'paid_rake',
  RAKE_SAVED: 'rake_saved',
  HANDS_PLAYED: 'hands_played',
  FACED_RAISE: 'faced_raise',
  FACED_3BET: 'faced_3bet',
  FACED_4BET_OR_MORE: 'faced_4bet_or_more',
  FOLDED_TO_RAISE: 'folded_to_raise',
  FOLDED_TO_3BET: 'folded_to_3bet',
  FOLDED_TO_4BET_OR_MORE: 'folded_to_4bet_or_more',
  PAID_BLIND_COUNT: 'paid_blind_count',
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
  BUST: 'bust',
  VPIP: 'vpip',
  PFR: 'pfr',
  C_BET_COUNT: 'c_bet_count',
  FOLD_TO_3BET: 'fold_to_3bet',
  FOLD_TO_4BET_OR_MORE: 'fold_to_4bet_or_more',
  DONK_BET_COUNT: 'donk_bet_count',
  RAISE3BET: 'raise3bet',
  RAISE4BET_OR_MORE: 'raise4bet_or_more',
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
  WIN_WITH_HIGH_CARD: 'win_with_high_card',
  WIN_WITH_ONE_PAIR: 'win_with_one_pair',
  WIN_WITH_TWO_PAIR: 'win_with_two_pair',
  WIN_WITH_THREE_OF_A_KIND: 'win_with_three_of_a_kind',
  WIN_WITH_STRAIGHT: 'win_with_straight',
  WIN_WITH_FLUSH: 'win_with_flush',
  WIN_WITH_FULL_HOUSE: 'win_with_full_house',
  WIN_WITH_FOUR_OF_A_KIND: 'win_with_four_of_a_kind',
  WIN_WITH_STRAIGHT_FLUSH: 'win_with_straight_flush',
  WIN_WITH_ROYAL_FLUSH: 'win_with_royal_flush',
  DEALT_HANDS_DIAMOND: 'dealt_hands_diamond',
  DEALT_HANDS_CLUB: 'dealt_hands_club',
  DEALT_HANDS_HEART: 'dealt_hands_heart',
  DEALT_HANDS_SPADE: 'dealt_hands_spade',
  SHOWDOWN_WIN: 'showdown_win',
  ALL_IN_WIN: 'all_in_win',
  WIN_WITHOUT_SHOWDOWN: 'win_without_showdown',
  MIN_WIN_EQUITY: 'min_win_equity',
  TOTAL_EARN_MONEY: 'total_earn_money',
  TOTAL_LOST_MONEY: 'total_lost_money',
  TOTAL_GAIN_INFAMY: 'total_gain_infamy',
  TOTAL_GAIN_SUSPICION: 'total_gain_suspicion',
  STAMINA_CONSUMED: 'stamina_consumed',
  COST_LT_TOTAL: 'cost_lt_total',
  COMPLETED_TASK_COUNT: 'completed_task_count',
  FAILED_TASK_COUNT: 'failed_task_count',
}
export const PLAY_RECORD_STATS_DESC = {
  // Bankroll Types (from TYPE_CHANGE_BANKROLL)
  [PLAY_RECORD_STATS_TYPE.GAMBLING]: { ko: '겜블링 수익', en: 'Gambling Profit' },
  [PLAY_RECORD_STATS_TYPE.CRYPTO_TRADE]: { ko: '암호화폐 거래', en: 'Crypto Trade' },
  [PLAY_RECORD_STATS_TYPE.RECEIVE]: { ko: '자금 수령', en: 'Funds Received' },
  [PLAY_RECORD_STATS_TYPE.PAY_RENT]: { ko: '임대료 지불', en: 'Rent Payment' },
  [PLAY_RECORD_STATS_TYPE.PAY_INCOME_TAX]: { ko: '소득세 납부', en: 'Income Tax' },
  [PLAY_RECORD_STATS_TYPE.PAY_FINE]: { ko: '벌금 납부', en: 'Fine Payment' },
  [PLAY_RECORD_STATS_TYPE.DEBT_REPAYMENT]: { ko: '채무 상환', en: 'Debt Repayment' },
  [PLAY_RECORD_STATS_TYPE.TRANSFER]: { ko: '자금 이체', en: 'Funds Transfer' },
  [PLAY_RECORD_STATS_TYPE.BUY_ITEM]: { ko: '아이템 구매', en: 'Item Purchase' },
  [PLAY_RECORD_STATS_TYPE.SELL_ITEM]: { ko: '아이템 판매', en: 'Item Sale' },
  [PLAY_RECORD_STATS_TYPE.AI_AGENT_SUBSCRIPTION]: { ko: 'AI 에이전트 구독', en: 'AI Agent Subscription' },
  [PLAY_RECORD_STATS_TYPE.AGENT_TASK]: { ko: '에이전트 태스크', en: 'Agent Task' },
  [PLAY_RECORD_STATS_TYPE.PARTNER_BENEFIT]: { ko: '파트너와 수익배분', en: 'Partner Benefit Share' },
  [PLAY_RECORD_STATS_TYPE.OTHER]: { ko: '기타 지출/수입', en: 'Other Expense/Income' },
  [PLAY_RECORD_STATS_TYPE.ITEM_EFFECT]: { ko: '아이템 효과', en: 'Item Effect' },
  [PLAY_RECORD_STATS_TYPE.BRIBE_DEALER]: { ko: '딜러에게 뇌물', en: 'Dealer Bribe' },
  [PLAY_RECORD_STATS_TYPE.CONTRACT]: { ko: '계약 수익/손실', en: 'Contract Profit/Loss' },
  [PLAY_RECORD_STATS_TYPE.COST_LT_TOTAL]: {
    'ko': '총 LT 소모량',
    'en': 'Total LT Spent'
  },
  [PLAY_RECORD_STATS_TYPE.COMPLETED_TASK_COUNT]: {
    'ko': '완료된 작업 수',
    'en': 'Completed Task Count'
  },
  [PLAY_RECORD_STATS_TYPE.FAILED_TASK_COUNT]: {
    'ko': '실패한 작업 수',
    'en': 'Failed Task Count'
  },
  // Gameplay Metrics
  [PLAY_RECORD_STATS_TYPE.LEVEL_REACHED]: { ko: '도달 레벨', en: 'Level Reached' },
  [PLAY_RECORD_STATS_TYPE.PAID_RAKE]: { ko: '지불한 레이크', en: 'Paid Rake' },
  [PLAY_RECORD_STATS_TYPE.RAKE_SAVED]: { ko: '절약한 레이크', en: 'Rake Saved' },
  [PLAY_RECORD_STATS_TYPE.HANDS_PLAYED]: { ko: '플레이한 핸드 수', en: 'Hands Played' },
  [PLAY_RECORD_STATS_TYPE.FACED_RAISE]: { ko: '레이즈에 직면', en: 'Faced Raise' },
  [PLAY_RECORD_STATS_TYPE.FACED_3BET]: { ko: '3-Bet에 직면', en: 'Faced 3-Bet' },
  [PLAY_RECORD_STATS_TYPE.FACED_4BET_OR_MORE]: { ko: '4-Bet+에 직면', en: 'Faced 4-Bet+' },
  [PLAY_RECORD_STATS_TYPE.FOLDED_TO_RAISE]: { ko: '레이즈에 폴드', en: 'Folded to Raise' },
  [PLAY_RECORD_STATS_TYPE.FOLDED_TO_3BET]: { ko: '3-Bet에 폴드', en: 'Folded to 3-Bet' },
  [PLAY_RECORD_STATS_TYPE.FOLDED_TO_4BET_OR_MORE]: { ko: '4-Bet+에 폴드', en: 'Folded to 4-Bet+' },
  [PLAY_RECORD_STATS_TYPE.PAID_BLIND_COUNT]: { ko: '지불한 블라인드 횟수', en: 'Paid Blind Count' },
  [PLAY_RECORD_STATS_TYPE.BET]: { ko: '베트 횟수', en: 'Bet Count' },
  [PLAY_RECORD_STATS_TYPE.RAISE]: { ko: '레이즈 횟수', en: 'Raise Count' },
  [PLAY_RECORD_STATS_TYPE.CALL]: { ko: '콜 횟수', en: 'Call Count' },
  [PLAY_RECORD_STATS_TYPE.FOLD]: { ko: '폴드 횟수', en: 'Fold Count' },
  [PLAY_RECORD_STATS_TYPE.CHECK]: { ko: '체크 횟수', en: 'Check Count' },
  [PLAY_RECORD_STATS_TYPE.ALL_IN]: { ko: '올인 횟수', en: 'All-in Count' },
  [PLAY_RECORD_STATS_TYPE._3BET]: { ko: '3-Bet 횟수', en: '3-Bet Count' },
  [PLAY_RECORD_STATS_TYPE._4BET_OR_MORE]: { ko: '4-Bet+ 횟수', en: '4-Bet+ Count' },
  [PLAY_RECORD_STATS_TYPE.SHOWDOWN]: { ko: '쇼다운 진출', en: 'Showdown' },
  [PLAY_RECORD_STATS_TYPE.WIN]: { ko: '승리 횟수', en: 'Wins' },
  [PLAY_RECORD_STATS_TYPE.LOSE]: { ko: '패배 횟수', en: 'Losses' },
  [PLAY_RECORD_STATS_TYPE.BUST]: { ko: '파산 횟수', en: 'Bust Count' },
  [PLAY_RECORD_STATS_TYPE.VPIP]: { ko: 'VPIP', en: 'VPIP' },
  [PLAY_RECORD_STATS_TYPE.PFR]: { ko: 'PFR', en: 'PFR' },
  [PLAY_RECORD_STATS_TYPE.C_BET_COUNT]: { ko: 'C-Bet 횟수', en: 'C-Bet Count' },
  [PLAY_RECORD_STATS_TYPE.FOLD_TO_3BET]: { ko: '3-Bet에 폴드', en: 'Fold to 3-Bet' },
  [PLAY_RECORD_STATS_TYPE.FOLD_TO_4BET_OR_MORE]: { ko: '4-Bet+에 폴드', en: 'Fold to 4-Bet+' },
  [PLAY_RECORD_STATS_TYPE.DONK_BET_COUNT]: { ko: '동크 뱃 횟수', en: 'Donk Bet Count' },
  [PLAY_RECORD_STATS_TYPE.RAISE3BET]: { ko: '3-Bet 레이즈', en: 'Raise 3-Bet' },
  [PLAY_RECORD_STATS_TYPE.RAISE4BET_OR_MORE]: { ko: '4-Bet+ 레이즈', en: 'Raise 4-Bet+' },
  [PLAY_RECORD_STATS_TYPE.FOLDED_TO_FLOP_BET]: { ko: '플랍 뱃에 폴드', en: 'Fold to Flop Bet' },
  [PLAY_RECORD_STATS_TYPE.WTSD]: { ko: 'WTSD', en: 'WTSD' },
  [PLAY_RECORD_STATS_TYPE.WSD]: { ko: 'WSD', en: 'WSD' },
  [PLAY_RECORD_STATS_TYPE.W$SD]: { ko: 'W$SD', en: 'W$SD' },
  [PLAY_RECORD_STATS_TYPE.MAX_LOSE_STREAK]: { ko: '최대 연패', en: 'Max Lose Streak' },
  [PLAY_RECORD_STATS_TYPE.MAX_WIN_STREAK]: { ko: '최대 연승', en: 'Max Win Streak' },
  [PLAY_RECORD_STATS_TYPE.MAX_LOSE_POT]: { ko: '최대 손실 팟', en: 'Max Lose Pot' },
  [PLAY_RECORD_STATS_TYPE.MAX_WIN_POT]: { ko: '최대 수익 팟', en: 'Max Win Pot' },
  [PLAY_RECORD_STATS_TYPE.MAX_LOSE_EQUITY]: { ko: '최악의 배드비트', en: 'Max Lose Equity' },
  [PLAY_RECORD_STATS_TYPE.MAX_WIN_EQUITY]: { ko: '최대 승리 에퀴티', en: 'Max Win Equity' },
  [PLAY_RECORD_STATS_TYPE.BUST_ENEMY]: { ko: '제거한 라이벌', en: 'Total Rivals Busted' },
  [PLAY_RECORD_STATS_TYPE.NET_SHARE]: { ko: '수익 배분', en: 'Net Share' },
  [PLAY_RECORD_STATS_TYPE.NET_WINNING]: { ko: '최종 순이익', en: 'Net Winning' },
  [PLAY_RECORD_STATS_TYPE.COST_LT]: { ko: '소모한 LT', en: 'Cost LT' },
  [PLAY_RECORD_STATS_TYPE.FACED_FLOP_BET]: { ko: '플랍 C-Bet에 직면', en: 'Faced Flop C-Bet' },

  // Winning Hands
  [PLAY_RECORD_STATS_TYPE.WIN_WITH_HIGH_CARD]: { ko: '하이카드로 승리', en: 'High Card Wins' },
  [PLAY_RECORD_STATS_TYPE.WIN_WITH_ONE_PAIR]: { ko: '원페어로 승리', en: 'One Pair Wins' },
  [PLAY_RECORD_STATS_TYPE.WIN_WITH_TWO_PAIR]: { ko: '투페어로 승리', en: 'Two Pair Wins' },
  [PLAY_RECORD_STATS_TYPE.WIN_WITH_THREE_OF_A_KIND]: { ko: '트리플로 승리', en: 'Three Of A Kind Wins' },
  [PLAY_RECORD_STATS_TYPE.WIN_WITH_STRAIGHT]: { ko: '스트레이트로 승리', en: 'Straight Wins' },
  [PLAY_RECORD_STATS_TYPE.WIN_WITH_FLUSH]: { ko: '플러시로 승리', en: 'Flush Wins' },
  [PLAY_RECORD_STATS_TYPE.WIN_WITH_FULL_HOUSE]: { ko: '풀하우스로 승리', en: 'Full House Wins' },
  [PLAY_RECORD_STATS_TYPE.WIN_WITH_FOUR_OF_A_KIND]: { ko: '포카드로 승리', en: 'Four Of A Kind Wins' },
  [PLAY_RECORD_STATS_TYPE.WIN_WITH_STRAIGHT_FLUSH]: { ko: '스트레이트 플러시로 승리', en: 'Straight Flush Wins' },
  [PLAY_RECORD_STATS_TYPE.WIN_WITH_ROYAL_FLUSH]: { ko: '로열 플러시로 승리', en: 'Royal Flush Wins' },

  // Dealt Card Suits
  [PLAY_RECORD_STATS_TYPE.DEALT_HANDS_DIAMOND]: { ko: '다이아몬드 핸드 수', en: 'Diamond Hands Dealt' },
  [PLAY_RECORD_STATS_TYPE.DEALT_HANDS_CLUB]: { ko: '클럽 핸드 수', en: 'Club Hands Dealt' },
  [PLAY_RECORD_STATS_TYPE.DEALT_HANDS_HEART]: { ko: '하트 핸드 수', en: 'Heart Hands Dealt' },
  [PLAY_RECORD_STATS_TYPE.DEALT_HANDS_SPADE]: { ko: '스페이드 핸드 수', en: 'Spade Hands Dealt' },

  // Performance Summaries
  [PLAY_RECORD_STATS_TYPE.SHOWDOWN_WIN]: { ko: '쇼다운 승리', en: 'Showdown Wins' },
  [PLAY_RECORD_STATS_TYPE.ALL_IN_WIN]: { ko: '올인 승리', en: 'All-in Wins' },
  [PLAY_RECORD_STATS_TYPE.WIN_WITHOUT_SHOWDOWN]: { ko: '쇼다운 없이 승리', en: 'Wins Without Showdown' },
  [PLAY_RECORD_STATS_TYPE.MIN_WIN_EQUITY]: { ko: '최소 승리 에퀴티', en: 'Min Win Equity' },
  [PLAY_RECORD_STATS_TYPE.TOTAL_EARN_MONEY]: { ko: '총 수익 금', en: 'Total Earned Money' },
  [PLAY_RECORD_STATS_TYPE.TOTAL_LOST_MONEY]: { ko: '총 손실 금', en: 'Total Lost Money' },
  [PLAY_RECORD_STATS_TYPE.TOTAL_GAIN_INFAMY]: { ko: '획득한 악명', en: 'Total Infamy Gained' },
  [PLAY_RECORD_STATS_TYPE.TOTAL_GAIN_SUSPICION]: { ko: '획득한 의심도', en: 'Total Suspicion Gained' },
  [PLAY_RECORD_STATS_TYPE.STAMINA_CONSUMED]: { ko: '소모한 스태미나', en: 'Stamina Consumed' },
}
// Exception types that can't default to 0 (BigInt, float, Object)
const STAT_OVERRIDES = {
  // BigInt - 누적 총액 (정수 초과 가능)
  [PLAY_RECORD_STATS_TYPE.TOTAL_EARN_MONEY]: 0n,
  [PLAY_RECORD_STATS_TYPE.TOTAL_LOST_MONEY]: 0n,
  // Float - equity %
  [PLAY_RECORD_STATS_TYPE.MAX_LOSE_EQUITY]: 0.0,
  [PLAY_RECORD_STATS_TYPE.MIN_WIN_EQUITY]: 0.0,
  // Object - 적 유형별 bust 카운트
  [PLAY_RECORD_STATS_TYPE.BUST_ENEMY]: {
    'Fish': 0, 'Broke': 0, 'MR_CALL': 0, 'Gambler': 0, 'Rich_Guy': 0,
    'Maniac': 0, 'Gangster': 0, 'Nit': 0, 'Quant_Pro': 0, 'The_Don': 0,
    'Shark': 0, 'Old_Lion': 0, 'Named_Pro': 0, 'Musk_V': 0, 'KBT_Leader': 0,
    'Max': 0, 'Florence': 0
  },
  [PLAY_RECORD_STATS_TYPE.LEVEL_REACHED]: 1,
};

// Auto-generate stats object: all enum values → 0, then override exceptions
// Adding a new PLAY_RECORD_STATS_TYPE entry requires no changes here unless
// it needs a non-zero or non-integer initial value.
export const createPlayRecordStats = () => Object.assign(
  Object.fromEntries(Object.values(PLAY_RECORD_STATS_TYPE).map(k => [k, 0])),
  STAT_OVERRIDES
);


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
  if (player.isMe) recordPlayStatsSessionForPlayer(action, payload)
  else recordPlayStatsSessionForCPU(player, action, payload);
}

/**
 * Records a play stat for the player character.
 * Simple counter actions (++/+=amount) are handled by the default fallback.
 * Complex actions (WIN, LOSE, BUST_ENEMY) with extra state logic have explicit cases.
 */
export const recordPlayStatsSessionForPlayer = (action, payload) => {
  const totalStats = store.play_stats;
  const sessionStats = store.play_stats_session;
  switch (action) {
    // BET is an alias for RAISE (both count as aggressive actions)
    case PLAY_RECORD_STATS_TYPE.BET:
      return recordPlayStatsSessionForPlayer(PLAY_RECORD_STATS_TYPE.RAISE, payload);
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
    case PLAY_RECORD_STATS_TYPE.BUST_ENEMY:
      totalStats.bust_enemy[payload.enemyClass || 'fish']++;
      if (sessionStats) sessionStats.bust_enemy[payload.enemyClass || 'fish']++;
      break;
    default: {
      // Generic handler for all simple numeric increments/additions
      // Covers: RAISE, CALL, FOLD, CHECK, ALL_IN, BUST, BANKRUPT, VPIP, PFR,
      //         WTSD, WSD, W$SD, HANDS_PLAYED, NET_SHARE, NET_WINNING, ITEM_EFFECT,
      //         FACED_RAISE, FACED_3BET, RAISE3BET, etc.
      const amount = payload?.amount ?? 1;
      if (action in totalStats && typeof totalStats[action] === 'number') {
        totalStats[action] += amount;
      }
      if (sessionStats && action in sessionStats && typeof sessionStats[action] === 'number') {
        sessionStats[action] += amount;
      }
    }
  }
}