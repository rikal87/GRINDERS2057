const stats = {

  bust_enemy: {
    'Fish': 0,
    'Broke': 0,
    'MR_CALL': 0,
    'Gambler': 0,
    'Rich_Guy': 0,
    'Maniac': 0,
    'Gangster': 0,
    'Nit': 0,
    'Quant_Pro': 0,
    'Mafia_Boss': 0,
    'Shark': 0,
    'Old_Lion': 0,
    'Named_Pro': 0,
    'Musk_V': 0
  },
  // 경제 지표
  paid_rake: 0, // 레이크 지불
  paid_buy_item: 0, // 아이템 구매
  paid_bribe_dealer: 0, // 딜러에게 뇌물
  paid_penalty: 0,//벌금
  max_level: 0, // 최대 도달레벨
  total_earn_money: 0n, // it'is huge number, so use it carefully
  total_lost_money: 0n, // it'is huge number, so use it carefully
  // 행동 지표 (VPIP/PFR 계산용)
  played_hands: 0,
  fold: 0,
  check: 0,
  call: 0,
  raise: 0,
  all_in: 0,
  wtsd: 0, // went to showdown
  w$sd: 0, // won when went to showdown
  pfr: 0, // preflop raise
  c_bet_count: 0,
  fold_to_3bet: 0,
  fold_to_4bet_or_more: 0,
  donk_bet_count: 0,
  raise3bet: 0, // 3bet
  raise4bet_or_more: 0, // 4bet 5bet
  bankruptcy_count: 0, // same to game over count
  // 승패 및 확률
  showdown_win: 0,
  all_in_win: 0,
  win_without_showdown: 0,

  // 기록(Peak) 데이터
  max_win_pot: 0,
  max_lose_pot: 0,
  max_win_streak: 0,
  max_lose_streak: 0,
  max_lose_equity: 0.0, // equity 50 then higher to lose
  min_win_equity: 0.0, // equity 50 then lower to win
}