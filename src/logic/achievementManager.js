import { getPlayStats, addUnlockAchievement, getUnlockAchievements } from './store';
import { PLAY_RECORD_STATS_TYPE } from './playRecordStats';
import { ITEM_EFFECT_ID } from './itemsEffect';
import { ITEM_DATA } from './items';

export const ACHIEVEMENT_ID = {
  LEVEL_1: 'level_1', // 레벨
  LEVEL_2: 'level_2', // 레벨
  LEVEL_3: 'level_3', // 레벨
  LEVEL_4: 'level_4', // 레벨
  LEVEL_5: 'level_5', // 레벨
  LEVEL_6: 'level_6', // 레벨
  BUST_1: 'bust_1', // 버스트
  BUST_2: 'bust_2', // 버스트
  BUST_3: 'bust_3', // 버스트
  BUST_4: 'bust_4', // 버스트
  THRIFTY_1: 'thrity_1', // 구두쇠 계열
  THRIFTY_2: 'thrity_2', // 구두쇠 계열
  THRIFTY_3: 'thrity_3', // 구두쇠 계열
  THRIFTY_4: 'thrity_4', // 구두쇠 계열
  HIGH_ROLLER_1: 'high_roller_1', // 하이롤러
  HIGH_ROLLER_2: 'high_roller_2', // 하이롤러
  HIGH_ROLLER_3: 'high_roller_3', // 하이롤러
  HIGH_ROLLER_4: 'high_roller_4', // 하이롤러
  WIN_STREAK_1: 'win_streak_1', // 연승
  WIN_STREAK_2: 'win_streak_2', // 연승
  WIN_STREAK_3: 'win_streak_3', // 연승
  WIN_STREAK_4: 'win_streak_4', // 연승
  WIN_STREAK_5: 'win_streak_5', // 연승
  WIN_STREAK_6: 'win_streak_6', // 연승
  LOSE_STREAK_1: 'lose_streak_1', // 연패
  LOSE_STREAK_2: 'lose_streak_2', // 연패
  LOSE_STREAK_3: 'lose_streak_3', // 연패
  LOSE_STREAK_4: 'lose_streak_4', // 연패
  VILLAIN_1: 'villain_1', // 악당
  VILLAIN_2: 'villain_2', // 악당
  VILLAIN_3: 'villain_3', // 악당
  VILLAIN_4: 'villain_4', // 악당
  VILLAIN_5: 'villain_5', // 악당
  ALL_IN_1: 'all_in_1', // 올인
  ALL_IN_2: 'all_in_2', // 올인
  ALL_IN_3: 'all_in_3', // 올인
  ALL_IN_4: 'all_in_4', // 올인
  BLIND_PAY_1: 'blind_pay_1', // 블라인드
  BLIND_PAY_2: 'blind_pay_2', // 블라인드
  BLIND_PAY_3: 'blind_pay_3', // 블라인드
  BLIND_PAY_4: 'blind_pay_4', // 블라인드
  CONSUME_STAMINA_1: 'consume_stamina_1', // 스태미나
  CONSUME_STAMINA_2: 'consume_stamina_2', // 스태미나
  CONSUME_STAMINA_3: 'consume_stamina_3', // 스태미나
  CONSUME_STAMINA_4: 'consume_stamina_4', // 스태미나
  WIN_WITH_HIGH_CARD_1: 'win_with_high_card_1', // 하이카드
  WIN_WITH_PAIR_1: 'win_with_pair_1', // 원페어
  WIN_WITH_TWO_PAIR_1: 'win_with_two_pair_1', // 투페어
  WIN_WITH_THREE_OF_A_KIND_1: 'win_with_three_of_a_kind_1', // 트리플
  WIN_WITH_STRAIGHT_1: 'win_with_straight_1', // 스트레이트
  WIN_WITH_FLUSH_1: 'win_with_flush_1', // 플러시
  WIN_WITH_FLUSH_2: 'win_with_flush_2', // 플러시
  WIN_WITH_FLUSH_3: 'win_with_flush_3', // 플러시
  WIN_WITH_FLUSH_4: 'win_with_flush_4', // 플러시
  DEALT_HANDS_DIAMOND_1: 'dealt_hands_diamond_1', // 다이아몬드
  DEALT_HANDS_DIAMOND_2: 'dealt_hands_diamond_2', // 다이아몬드
  DEALT_HANDS_DIAMOND_3: 'dealt_hands_diamond_3', // 다이아몬드
  DEALT_HANDS_DIAMOND_4: 'dealt_hands_diamond_4', // 다이아몬드
  DEALT_HANDS_CLUB_1: 'dealt_hands_club_1', // 클럽
  DEALT_HANDS_CLUB_2: 'dealt_hands_club_2', // 클럽
  DEALT_HANDS_CLUB_3: 'dealt_hands_club_3', // 클럽
  DEALT_HANDS_CLUB_4: 'dealt_hands_club_4', // 클럽
  DEALT_HANDS_HEART_1: 'dealt_hands_heart_1', // 하트
  DEALT_HANDS_HEART_2: 'dealt_hands_heart_2', // 하트
  DEALT_HANDS_HEART_3: 'dealt_hands_heart_3', // 하트
  DEALT_HANDS_HEART_4: 'dealt_hands_heart_4', // 하트
  DEALT_HANDS_SPADE_1: 'dealt_hands_spade_1', // 스페이드
  DEALT_HANDS_SPADE_2: 'dealt_hands_spade_2', // 스페이드
  DEALT_HANDS_SPADE_3: 'dealt_hands_spade_3', // 스페이드
  DEALT_HANDS_SPADE_4: 'dealt_hands_spade_4', // 스페이드
  WIN_WITH_FULL_HOUSE_1: 'win_with_full_house_1', // 풀하우스
  WIN_WITH_FOUR_OF_A_KIND_1: 'win_with_four_of_a_kind_1', // 포카드
  WIN_WITH_STRAIGHT_FLUSH_1: 'win_with_straight_flush_1', // 스트레이트 플러시
  WIN_WITH_STRAIGHT_FLUSH_2: 'win_with_straight_flush_2', // 로열 플러시
  FOLD_1: 'fold_1', // 폴드
  FOLD_2: 'fold_2', // 폴드
  FOLD_3: 'fold_3', // 폴드
  FOLD_4: 'fold_4', // 폴드
  WTSD_1: 'wtsd_1', // 팟에 참여
  WTSD_2: 'wtsd_2', // 팟에 참여
  WTSD_3: 'wtsd_3', // 팟에 참여
  WTSD_4: 'wtsd_4', // 팟에 참여
  BONUS_BENEFIT_1: 'bonus_benefit_1', // 보너스 혜택
  BONUS_BENEFIT_2: 'bonus_benefit_2', // 보너스 혜택
  BONUS_BENEFIT_3: 'bonus_benefit_3', // 보너스 혜택
  BONUS_BENEFIT_4: 'bonus_benefit_4', // 보너스 혜택
  GAINED_XP_1: 'gaind_xp_1', // 경험치 획득
  GAINED_XP_2: 'gaind_xp_2', // 경험치 획득
  GAINED_XP_3: 'gaind_xp_3', // 경험치 획득
  GAINED_XP_4: 'gaind_xp_4', // 경험치 획득
  BRIBE_DEALER_1: 'bribe_dealer_1', // 딜러에게 뇌물
  BRIBE_DEALER_2: 'bribe_dealer_2', // 딜러에게 뇌물
  BRIBE_DEALER_3: 'bribe_dealer_3', // 딜러에게 뇌물
  BRIBE_DEALER_4: 'bribe_dealer_4', // 딜러에게 뇌물
  BUY_ITEM_1: 'buy_item_1', // 아이템 구매
  BUY_ITEM_2: 'buy_item_2', // 아이템 구매
  BUY_ITEM_3: 'buy_item_3', // 아이템 구매
  BUY_ITEM_4: 'buy_item_4', // 아이템 구매
  SELL_ITEM_1: 'sell_item_1', // 아이템 판매
  SELL_ITEM_2: 'sell_item_2', // 아이템 판매
  SELL_ITEM_3: 'sell_item_3', // 아이템 판매
  SELL_ITEM_4: 'sell_item_4', // 아이템 판매
  RAISE_1: 'raise_1', // 레이즈
  RAISE_2: 'raise_2', // 레이즈
  RAISE_3: 'raise_3', // 레이즈
  RAISE_4: 'raise_4', // 레이즈
  CALL_1: 'call_1', // 콜
  CALL_2: 'call_2', // 콜
  CALL_3: 'call_3', // 콜
  CALL_4: 'call_4', // 콜
  NET_WINNING_1: 'net_winning_1', // 순이익
  NET_WINNING_2: 'net_winning_2', // 순이익
  NET_WINNING_3: 'net_winning_3', // 순이익
  NET_WINNING_4: 'net_winning_4', // 순이익
  WIN_1: 'win_1', // 승리
  WIN_2: 'win_2', // 승리
  WIN_3: 'win_3', // 승리
  PAID_RAKE_1: 'paid_rake_1', // 낸 레이크
  LOSE_1: 'lose_1', // 패배
  LOSE_2: 'lose_2', // 패배
  LOSE_3: 'lose_3', // 패배
  LOSE_4: 'lose_4', // 패배
  CHECK_1: 'check_1', // 체크
  CHECK_2: 'check_2', // 체크
  PARTNER_BENEFIT_1: 'partner_benefit_1', // 파트너 혜택
  GAMBLING_1: 'gambling_1', // 겜블링으로 딴 돈
  GAMBLING_2: 'gambling_2', // 겜블링으로 딴 돈
  GAMBLING_3: 'gambling_3', // 겜블링으로 딴 돈
  GAMBLING_4: 'gambling_4', // 겜블링으로 딴 돈
  GAMBLING_5: 'gambling_5', // 겜블링으로 딴 돈
}
export const ACHIEVEMENT_DESC = {
  [ACHIEVEMENT_ID.LEVEL_1]: { ko: '풋내기 그라인더', en: 'Rookie Grinder' },
  [ACHIEVEMENT_ID.LEVEL_2]: { ko: '거리의 숙련자', en: 'Street Veteran' },
  [ACHIEVEMENT_ID.LEVEL_3]: { ko: '네온의 승부사', en: 'Neon Gambler' },
  [ACHIEVEMENT_ID.LEVEL_4]: { ko: '언더그라운드 킹', en: 'Underground King' },
  [ACHIEVEMENT_ID.LEVEL_5]: { ko: '사이버 펑크', en: 'Cyber Punk' },
  [ACHIEVEMENT_ID.LEVEL_6]: { ko: '메트로폴리스의 지배자', en: 'Metropolis Ruler' },

  [ACHIEVEMENT_ID.BUST_1]: { ko: '첫 파산의 쓴맛', en: 'Bitter Taste of Bankruptcy' },
  [ACHIEVEMENT_ID.BUST_2]: { ko: '바닥을 치다', en: 'Hitting Rock Bottom' },
  [ACHIEVEMENT_ID.BUST_3]: { ko: '불사조', en: 'Phoenix' },
  [ACHIEVEMENT_ID.BUST_4]: { ko: '파산 면역', en: 'Bankruptcy Immune' },

  [ACHIEVEMENT_ID.THRIFTY_1]: { ko: '동전 한 푼', en: 'Every Penny Counts' },
  [ACHIEVEMENT_ID.THRIFTY_2]: { ko: '절약의 미덕', en: 'Virtue of Frugality' },
  [ACHIEVEMENT_ID.THRIFTY_3]: { ko: '짠돌이', en: 'Skinflint' },
  [ACHIEVEMENT_ID.THRIFTY_4]: { ko: '구두쇠 왕', en: 'Miser King' },

  [ACHIEVEMENT_ID.HIGH_ROLLER_1]: { ko: '큰 손의 자격', en: 'High Roller Stakes' },
  [ACHIEVEMENT_ID.HIGH_ROLLER_2]: { ko: '판을 키우는 자', en: 'Pot Builder' },
  [ACHIEVEMENT_ID.HIGH_ROLLER_3]: { ko: 'VIP 전용', en: 'VIP Only' },
  [ACHIEVEMENT_ID.HIGH_ROLLER_4]: { ko: '전설의 거부', en: 'Legendary Tycoon' },

  [ACHIEVEMENT_ID.WIN_STREAK_1]: { ko: '기분 좋은 출발', en: 'Good Start' },
  [ACHIEVEMENT_ID.WIN_STREAK_2]: { ko: '연승 가도', en: 'Winning Streak' },
  [ACHIEVEMENT_ID.WIN_STREAK_3]: { ko: '멈출 수 없는 기세', en: 'Unstoppable Momentum' },
  [ACHIEVEMENT_ID.WIN_STREAK_4]: { ko: '테이블의 지배자', en: 'Table Dominator' },
  [ACHIEVEMENT_ID.WIN_STREAK_5]: { ko: '무패의 신화', en: 'Invincible Myth' },
  [ACHIEVEMENT_ID.WIN_STREAK_6]: { ko: '신의 경지', en: 'Godlike Status' },

  [ACHIEVEMENT_ID.LOSE_STREAK_1]: { ko: '오늘따라 안 되네', en: 'Bad Day' },
  [ACHIEVEMENT_ID.LOSE_STREAK_2]: { ko: '연속된 불운', en: 'Long Run of Bad Luck' },
  [ACHIEVEMENT_ID.LOSE_STREAK_3]: { ko: '틸트 경보', en: 'Tilt Warning' },
  [ACHIEVEMENT_ID.LOSE_STREAK_4]: { ko: '극복해야 할 시련', en: 'Trial to Overcome' },

  [ACHIEVEMENT_ID.VILLAIN_1]: { ko: '사악한 미소', en: 'Evil Smile' },
  [ACHIEVEMENT_ID.VILLAIN_2]: { ko: '공공의 적', en: 'Public Enemy' },
  [ACHIEVEMENT_ID.VILLAIN_3]: { ko: '악의 축', en: 'Axis of Evil' },
  [ACHIEVEMENT_ID.VILLAIN_4]: { ko: '지옥의 사자', en: 'Messenger of Hell' },
  [ACHIEVEMENT_ID.VILLAIN_5]: { ko: '절대 악', en: 'Absolute Evil' },

  [ACHIEVEMENT_ID.ALL_IN_1]: { ko: '인생은 한 방', en: 'Life is One Shot' },
  [ACHIEVEMENT_ID.ALL_IN_2]: { ko: '승부사', en: 'Risk Taker' },
  [ACHIEVEMENT_ID.ALL_IN_3]: { ko: '도박사', en: 'Gambler' },
  [ACHIEVEMENT_ID.ALL_IN_4]: { ko: '올인 마스터', en: 'All-in Master' },

  [ACHIEVEMENT_ID.BLIND_PAY_1]: { ko: '통행료', en: 'Toll Fee' },
  [ACHIEVEMENT_ID.BLIND_PAY_2]: { ko: '성실한 납세자', en: 'Honest Taxpayer' },
  [ACHIEVEMENT_ID.BLIND_PAY_3]: { ko: '블라인드 기부자', en: 'Blind Donor' },
  [ACHIEVEMENT_ID.BLIND_PAY_4]: { ko: '죽순이', en: 'Regular Customer' },

  [ACHIEVEMENT_ID.CONSUME_STAMINA_1]: { ko: '조금 피곤하네', en: 'Feeling Tired' },
  [ACHIEVEMENT_ID.CONSUME_STAMINA_2]: { ko: '밤샘 도박', en: 'All-nighter' },
  [ACHIEVEMENT_ID.CONSUME_STAMINA_3]: { ko: '강철 체력', en: 'Iron Stamina' },
  [ACHIEVEMENT_ID.CONSUME_STAMINA_4]: { ko: '일중독', en: 'Workaholic' },

  [ACHIEVEMENT_ID.WIN_WITH_HIGH_CARD_1]: { ko: '하이카드의 기적', en: 'High Card Miracle' },
  [ACHIEVEMENT_ID.WIN_WITH_PAIR_1]: { ko: '단짝 영웅', en: 'Best Friend Hero' },
  [ACHIEVEMENT_ID.WIN_WITH_TWO_PAIR_1]: { ko: '투페어 마스터', en: 'Two Pair Master' },
  [ACHIEVEMENT_ID.WIN_WITH_THREE_OF_A_KIND_1]: { ko: '트리플 샷', en: 'Triple Shot' },
  [ACHIEVEMENT_ID.WIN_WITH_STRAIGHT_1]: { ko: '순차적인 승리', en: 'Sequential Victory' },
  [ACHIEVEMENT_ID.WIN_WITH_FLUSH_1]: { ko: '색깔 맞추기', en: 'Color Matching' },
  [ACHIEVEMENT_ID.WIN_WITH_FLUSH_2]: { ko: '플러시 광기', en: 'Flush Mania' },
  [ACHIEVEMENT_ID.WIN_WITH_FLUSH_3]: { ko: '바다의 물결', en: 'Ocean Wave' },
  [ACHIEVEMENT_ID.WIN_WITH_FLUSH_4]: { ko: '완벽한 조화', en: 'Perfect Harmony' },

  [ACHIEVEMENT_ID.DEALT_HANDS_DIAMOND_1]: { ko: '다이아몬드는 영원히', en: 'Diamonds are Forever' },
  [ACHIEVEMENT_ID.DEALT_HANDS_DIAMOND_2]: { ko: '빛나는 손패', en: 'Shining Hands' },
  [ACHIEVEMENT_ID.DEALT_HANDS_DIAMOND_3]: { ko: '보석 수집가', en: 'Gem Collector' },
  [ACHIEVEMENT_ID.DEALT_HANDS_DIAMOND_4]: { ko: '보석상', en: 'Jeweler' },

  [ACHIEVEMENT_ID.DEALT_HANDS_CLUB_1]: { ko: '클럽의 밤', en: 'Club Night' },
  [ACHIEVEMENT_ID.DEALT_HANDS_CLUB_2]: { ko: '행운의 네잎클로버', en: 'Lucky Clover' },
  [ACHIEVEMENT_ID.DEALT_HANDS_CLUB_3]: { ko: '단단한 곤봉', en: 'Sturdy Club' },
  [ACHIEVEMENT_ID.DEALT_HANDS_CLUB_4]: { ko: '클럽 멤버십', en: 'Club Membership' },

  [ACHIEVEMENT_ID.DEALT_HANDS_HEART_1]: { ko: '열정의 하트', en: 'Passionate Heart' },
  [ACHIEVEMENT_ID.DEALT_HANDS_HEART_2]: { ko: '사랑이 가득한 손패', en: 'Hands Full of Love' },
  [ACHIEVEMENT_ID.DEALT_HANDS_HEART_3]: { ko: '심장 박동', en: 'Heartbeat' },
  [ACHIEVEMENT_ID.DEALT_HANDS_HEART_4]: { ko: '낭만주의자', en: 'Romanticist' },

  [ACHIEVEMENT_ID.DEALT_HANDS_SPADE_1]: { ko: '죽음의 상징', en: 'Symbol of Death' },
  [ACHIEVEMENT_ID.DEALT_HANDS_SPADE_2]: { ko: '검은 날개', en: 'Black Wings' },
  [ACHIEVEMENT_ID.DEALT_HANDS_SPADE_3]: { ko: '무덤 파는 자', en: 'Gravedigger' },
  [ACHIEVEMENT_ID.DEALT_HANDS_SPADE_4]: { ko: '스페이드 에이스', en: 'Ace of Spades' },

  [ACHIEVEMENT_ID.WIN_WITH_FULL_HOUSE_1]: { ko: '꽉 찬 집', en: 'Full House' },
  [ACHIEVEMENT_ID.WIN_WITH_FOUR_OF_A_KIND_1]: { ko: '포카드 전문가', en: 'Four of a Kind Guru' },
  [ACHIEVEMENT_ID.WIN_WITH_STRAIGHT_FLUSH_1]: { ko: '환상의 런', en: 'Fantastic Run' },
  [ACHIEVEMENT_ID.WIN_WITH_STRAIGHT_FLUSH_2]: { ko: '황금 손패', en: 'Golden Hand' },

  [ACHIEVEMENT_ID.FOLD_1]: { ko: '물러설 때를 아는 자', en: 'Know When to Fold' },
  [ACHIEVEMENT_ID.FOLD_2]: { ko: '인내의 도박사', en: 'Patient Gambler' },
  [ACHIEVEMENT_ID.FOLD_3]: { ko: '철저한 수비', en: 'Strict Defense' },
  [ACHIEVEMENT_ID.FOLD_4]: { ko: '포기의 달인', en: 'Master of Retreat' },

  [ACHIEVEMENT_ID.WTSD_1]: { ko: '결판을 내자', en: 'Decide the Outcome' },
  [ACHIEVEMENT_ID.WTSD_2]: { ko: '쇼다운의 전율', en: 'Showdown Thrill' },
  [ACHIEVEMENT_ID.WTSD_3]: { ko: '끝까지 간다', en: 'To the End' },
  [ACHIEVEMENT_ID.WTSD_4]: { ko: '진실의 목격자', en: 'Witness of Truth' },

  [ACHIEVEMENT_ID.BONUS_BENEFIT_1]: { ko: '쏠쏠한 보너스', en: 'Sweet Bonus' },
  [ACHIEVEMENT_ID.BONUS_BENEFIT_2]: { ko: '추가 수익', en: 'Extra Profit' },
  [ACHIEVEMENT_ID.BONUS_BENEFIT_3]: { ko: '기분 좋은 가산점', en: 'Nice Extra Points' },
  [ACHIEVEMENT_ID.BONUS_BENEFIT_4]: { ko: '보너스 잭팟', en: 'Bonus Jackpot' },

  [ACHIEVEMENT_ID.GAINED_XP_1]: { ko: '배움의 길', en: 'Way of Learning' },
  [ACHIEVEMENT_ID.GAINED_XP_2]: { ko: '지식의 축적', en: 'Accumulation of Knowledge' },
  [ACHIEVEMENT_ID.GAINED_XP_3]: { ko: '사이버 브레인', en: 'Cyber Brain' },
  [ACHIEVEMENT_ID.GAINED_XP_4]: { ko: '초월적 존재', en: 'Transcendent Being' },

  [ACHIEVEMENT_ID.BRIBE_DEALER_1]: { ko: '뒷거래', en: 'Backdoor Deal' },
  [ACHIEVEMENT_ID.BRIBE_DEALER_2]: { ko: '부패의 시작', en: 'Start of Corruption' },
  [ACHIEVEMENT_ID.BRIBE_DEALER_3]: { ko: '매수 전문가', en: 'Bribery Expert' },
  [ACHIEVEMENT_ID.BRIBE_DEALER_4]: { ko: '딜러의 주인', en: 'Master of Dealers' },

  [ACHIEVEMENT_ID.BUY_ITEM_1]: { ko: '쇼핑광', en: 'Shopaholic' },
  [ACHIEVEMENT_ID.BUY_ITEM_2]: { ko: '컬렉션 중독', en: 'Collection Addict' },
  [ACHIEVEMENT_ID.BUY_ITEM_3]: { ko: '아이템 수집가', en: 'Item Collector' },
  [ACHIEVEMENT_ID.BUY_ITEM_4]: { ko: '검은 금요일', en: 'Black Friday' },

  [ACHIEVEMENT_ID.SELL_ITEM_1]: { ko: '중고 거래', en: 'Used Trade' },
  [ACHIEVEMENT_ID.SELL_ITEM_2]: { ko: '필요 없는 물건', en: 'Unneeded Items' },
  [ACHIEVEMENT_ID.SELL_ITEM_3]: { ko: '현금화 전문가', en: 'Cash-out Expert' },
  [ACHIEVEMENT_ID.SELL_ITEM_4]: { ko: '장사의 신', en: 'God of Sales' },

  [ACHIEVEMENT_ID.RAISE_1]: { ko: '공격적인 베팅', en: 'Aggressive Betting' },
  [ACHIEVEMENT_ID.RAISE_2]: { ko: '압박 수사', en: 'Pressure Tactics' },
  [ACHIEVEMENT_ID.RAISE_3]: { ko: '공포 유발자', en: 'Terror Inducer' },
  [ACHIEVEMENT_ID.RAISE_4]: { ko: '포커 페이스', en: 'Poker Face' },

  [ACHIEVEMENT_ID.CALL_1]: { ko: '응답하라', en: 'Response' },
  [ACHIEVEMENT_ID.CALL_2]: { ko: '따라가기', en: 'Following' },
  [ACHIEVEMENT_ID.CALL_3]: { ko: '블러프 캐쳐', en: 'Bluff Catcher' },
  [ACHIEVEMENT_ID.CALL_4]: { ko: '신의 부름', en: 'Call of God' },

  [ACHIEVEMENT_ID.NET_WINNING_1]: { ko: '자수성가', en: 'Self-made' },
  [ACHIEVEMENT_ID.NET_WINNING_2]: { ko: '신흥 부자', en: 'New Rich' },
  [ACHIEVEMENT_ID.NET_WINNING_3]: { ko: '억만장자', en: 'Billionaire' },
  [ACHIEVEMENT_ID.NET_WINNING_4]: { ko: '경제적 자유', en: 'Financial Freedom' },

  [ACHIEVEMENT_ID.WIN_1]: { ko: '승리의 기쁨', en: 'Joy of Victory' },
  [ACHIEVEMENT_ID.WIN_2]: { ko: '승리의 용사', en: 'Hero of Victory' },
  [ACHIEVEMENT_ID.WIN_3]: { ko: '승리의 제왕', en: 'King of Victory' },

  [ACHIEVEMENT_ID.PAID_RAKE_1]: { ko: '하우스의 친구', en: 'Friend of the House' },

  [ACHIEVEMENT_ID.LOSE_1]: { ko: '루저', en: 'Loser' },
  [ACHIEVEMENT_ID.LOSE_2]: { ko: '호구', en: 'Sucker' },
  [ACHIEVEMENT_ID.LOSE_3]: { ko: '불운아', en: 'Unlucky Soul' },
  [ACHIEVEMENT_ID.LOSE_4]: { ko: '해탈', en: 'Nirvana' },

  [ACHIEVEMENT_ID.CHECK_1]: { ko: '돌다리도 신중하게', en: 'Careful on the Bridge' },
  [ACHIEVEMENT_ID.CHECK_2]: { ko: '팟 컨트롤', en: 'Pot Control' },

  [ACHIEVEMENT_ID.PARTNER_BENEFIT_1]: { ko: '파트너와의 시너지', en: 'Partner Synergy' },

  [ACHIEVEMENT_ID.GAMBLING_1]: { ko: '피쉬', en: 'Fish' },
  [ACHIEVEMENT_ID.GAMBLING_2]: { ko: '레귤러', en: 'Regular' },
  [ACHIEVEMENT_ID.GAMBLING_3]: { ko: '세미프로', en: 'Semi-Pro' },
  [ACHIEVEMENT_ID.GAMBLING_4]: { ko: '프로', en: 'Pro' },
  [ACHIEVEMENT_ID.GAMBLING_5]: { ko: '전설', en: 'Legend' },
}

/**
 * Each rule defines an achievement and the effect it unlocks.
 * maxAllowEffectCount: the max number of this effect an item can have while being unlocked.
 * e.g., PENNY_PINCHER (value: 1000) -> allows items with up to 2 RAKE_REDUCTION effects to appear in shop.
 * If an item has 3 RAKE_REDUCTION effects, it requires SKINFLINT to be unlocked.
 */
export const UNLOCK_RULES = [
  {
    id: ACHIEVEMENT_ID.GAMBLING_1,
    type: PLAY_RECORD_STATS_TYPE.GAMBLING,
    value: 50000,
    unlockEffectId: ITEM_EFFECT_ID.UNDERGROUND_BAR_INVITE,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.GAMBLING_2,
    type: PLAY_RECORD_STATS_TYPE.GAMBLING,
    value: 250000,
    unlockEffectId: ITEM_EFFECT_ID.CLUB_MEMBERSHIP,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.GAMBLING_3,
    type: PLAY_RECORD_STATS_TYPE.GAMBLING,
    value: 1000000,
    unlockEffectId: ITEM_EFFECT_ID.THE_BUNKER_KEY,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.GAMBLING_4,
    type: PLAY_RECORD_STATS_TYPE.GAMBLING,
    value: 5000000,
    unlockEffectId: ITEM_EFFECT_ID.HOLDEM_HOUSE_MEMBERSHIP,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.GAMBLING_5,
    type: PLAY_RECORD_STATS_TYPE.GAMBLING,
    value: 10000000,
    unlockEffectId: ITEM_EFFECT_ID.ROYAL_ROOM_INVITE,
    maxAllowEffectCount: 5,
  },
  {
    id: ACHIEVEMENT_ID.CHECK_1,
    type: PLAY_RECORD_STATS_TYPE.CHECK,
    value: 25,
    unlockEffectId: ITEM_EFFECT_ID.TIME_BANK_PLUS,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.CHECK_2,
    type: PLAY_RECORD_STATS_TYPE.CHECK,
    value: 100,
    unlockEffectId: ITEM_EFFECT_ID.TIME_BANK_PLUS,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.WIN_1,
    type: PLAY_RECORD_STATS_TYPE.WIN,
    value: 10,
    unlockEffectId: ITEM_EFFECT_ID.XP_BOOST,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.WIN_2,
    type: PLAY_RECORD_STATS_TYPE.WIN,
    value: 100,
    unlockEffectId: ITEM_EFFECT_ID.XP_BOOST,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.WIN_3,
    type: PLAY_RECORD_STATS_TYPE.WIN,
    value: 200,
    unlockEffectId: ITEM_EFFECT_ID.BLACKJACK_MASTER,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.PARTNER_BENEFIT_1,
    type: PLAY_RECORD_STATS_TYPE.PARTNER_BENEFIT,
    value: 10000,
    unlockEffectId: ITEM_EFFECT_ID.OLIVE_BRANCH,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.PAID_RAKE_1,
    type: PLAY_RECORD_STATS_TYPE.PAID_RAKE,
    value: 1000,
    unlockEffectId: ITEM_EFFECT_ID.RAKE_REDUCTION,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.LOSE_1,
    type: PLAY_RECORD_STATS_TYPE.LOSE,
    value: 10,
    unlockEffectId: ITEM_EFFECT_ID.SHOW_ME_YOUR_BLUFF,
    maxAllowEffectCount: 4,
  },

  {
    id: ACHIEVEMENT_ID.LOSE_2,
    type: PLAY_RECORD_STATS_TYPE.LOSE,
    value: 25,
    unlockEffectId: ITEM_EFFECT_ID.SMOKE_BREAK,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.LOSE_3,
    type: PLAY_RECORD_STATS_TYPE.LOSE,
    value: 50,
    unlockEffectId: ITEM_EFFECT_ID.COOLER,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.LOSE_4,
    type: PLAY_RECORD_STATS_TYPE.LOSE,
    value: 100,
    unlockEffectId: ITEM_EFFECT_ID.TILT_RECOVERY,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.NET_WINNING_1,
    type: PLAY_RECORD_STATS_TYPE.NET_WINNING,
    value: 1000,
    unlockEffectId: ITEM_EFFECT_ID.SESSION_PROFIT_BONUS,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.NET_WINNING_2,
    type: PLAY_RECORD_STATS_TYPE.NET_WINNING,
    value: 10000,
    unlockEffectId: ITEM_EFFECT_ID.SESSION_PROFIT_BONUS,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.NET_WINNING_3,
    type: PLAY_RECORD_STATS_TYPE.NET_WINNING,
    value: 100000,
    unlockEffectId: ITEM_EFFECT_ID.SESSION_PROFIT_BONUS,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.NET_WINNING_4,
    type: PLAY_RECORD_STATS_TYPE.NET_WINNING,
    value: 5000000,
    unlockEffectId: ITEM_EFFECT_ID.SYNAPSE_READING,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.LEVEL_1,
    type: PLAY_RECORD_STATS_TYPE.LEVEL_REACHED,
    value: 3,
    unlockEffectId: ITEM_EFFECT_ID.LT_REGEN_PLUS,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.LEVEL_2,
    type: PLAY_RECORD_STATS_TYPE.LEVEL_REACHED,
    value: 5,
    unlockEffectId: ITEM_EFFECT_ID.LT_RECOVERY,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.LEVEL_3,
    type: PLAY_RECORD_STATS_TYPE.LEVEL_REACHED,
    value: 10,
    unlockEffectId: ITEM_EFFECT_ID.RND,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.LEVEL_4,
    type: PLAY_RECORD_STATS_TYPE.LEVEL_REACHED,
    value: 15,
    unlockEffectId: ITEM_EFFECT_ID.RND,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.LEVEL_5,
    type: PLAY_RECORD_STATS_TYPE.LEVEL_REACHED,
    value: 25,
    unlockEffectId: ITEM_EFFECT_ID.RND,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.LEVEL_6,
    type: PLAY_RECORD_STATS_TYPE.LEVEL_REACHED,
    value: 30,
    unlockEffectId: ITEM_EFFECT_ID.RND,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.BUY_ITEM_1,
    type: PLAY_RECORD_STATS_TYPE.BUY_ITEM,
    value: 10000,
    unlockEffectId: ITEM_EFFECT_ID.STONK,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.BUY_ITEM_2,
    type: PLAY_RECORD_STATS_TYPE.BUY_ITEM,
    value: 50000,
    unlockEffectId: ITEM_EFFECT_ID.BLACK_CONSUMER,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.BUY_ITEM_3,
    type: PLAY_RECORD_STATS_TYPE.BUY_ITEM,
    value: 250000,
    unlockEffectId: ITEM_EFFECT_ID.BLACK_CONSUMER,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.BUY_ITEM_4,
    type: PLAY_RECORD_STATS_TYPE.BUY_ITEM,
    value: 1000000,
    unlockEffectId: ITEM_EFFECT_ID.STONK,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.SELL_ITEM_1,
    type: PLAY_RECORD_STATS_TYPE.SELL_ITEM,
    value: 1000,
    unlockEffectId: ITEM_EFFECT_ID.CHIP_ROUNDING,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.SELL_ITEM_2,
    type: PLAY_RECORD_STATS_TYPE.SELL_ITEM,
    value: 10000,
    unlockEffectId: ITEM_EFFECT_ID.CHIP_ROUNDING,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.SELL_ITEM_3,
    type: PLAY_RECORD_STATS_TYPE.SELL_ITEM,
    value: 25000,
    unlockEffectId: ITEM_EFFECT_ID.CHIP_ROUNDING,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.SELL_ITEM_4,
    type: PLAY_RECORD_STATS_TYPE.SELL_ITEM,
    value: 100000,
    unlockEffectId: ITEM_EFFECT_ID.CHIP_ROUNDING,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.BRIBE_DEALER_1,
    type: PLAY_RECORD_STATS_TYPE.BRIBE_DEALER,
    value: 10000,
    unlockEffectId: ITEM_EFFECT_ID.LOYALTY_CARD,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.BRIBE_DEALER_2,
    type: PLAY_RECORD_STATS_TYPE.BRIBE_DEALER,
    value: 50000,
    unlockEffectId: ITEM_EFFECT_ID.LOYALTY_CARD,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.BRIBE_DEALER_3,
    type: PLAY_RECORD_STATS_TYPE.BRIBE_DEALER,
    value: 250000,
    unlockEffectId: ITEM_EFFECT_ID.LOYALTY_CARD,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.BRIBE_DEALER_4,
    type: PLAY_RECORD_STATS_TYPE.BRIBE_DEALER,
    value: 500000,
    unlockEffectId: ITEM_EFFECT_ID.LOYALTY_CARD,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.RAISE_1,
    type: PLAY_RECORD_STATS_TYPE.RAISE,
    value: 5000,
    unlockEffectId: ITEM_EFFECT_ID.GHOST_BET,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.CALL_1,
    type: PLAY_RECORD_STATS_TYPE.CALL,
    value: 10,
    unlockEffectId: ITEM_EFFECT_ID.OUTKICKED,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.CALL_2,
    type: PLAY_RECORD_STATS_TYPE.CALL,
    value: 100,
    unlockEffectId: ITEM_EFFECT_ID.TILT_RECOVERY,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.CALL_3,
    type: PLAY_RECORD_STATS_TYPE.CALL,
    value: 250,
    unlockEffectId: ITEM_EFFECT_ID.LAST_STAND,
    maxAllowEffectCount: 4,
  },

  {
    id: ACHIEVEMENT_ID.BONUS_BENEFIT_1,
    type: PLAY_RECORD_STATS_TYPE.ITEM_EFFECT,
    value: 10000,
    unlockEffectId: ITEM_EFFECT_ID.GOLDEN_TOUCH,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.BONUS_BENEFIT_2,
    type: PLAY_RECORD_STATS_TYPE.ITEM_EFFECT,
    value: 100000,
    unlockEffectId: ITEM_EFFECT_ID.GOLDEN_TOUCH,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.BONUS_BENEFIT_3,
    type: PLAY_RECORD_STATS_TYPE.ITEM_EFFECT,
    value: 1000000,
    unlockEffectId: ITEM_EFFECT_ID.GOLDEN_TOUCH,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.BONUS_BENEFIT_4,
    type: PLAY_RECORD_STATS_TYPE.ITEM_EFFECT,
    value: 10000000,
    unlockEffectId: ITEM_EFFECT_ID.GOLDEN_TOUCH,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.WTSD_1,
    type: PLAY_RECORD_STATS_TYPE.WTSD,
    value: 10,
    unlockEffectId: ITEM_EFFECT_ID.SHOWDOWN_LOSE_REFUND,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.WTSD_2,
    type: PLAY_RECORD_STATS_TYPE.WTSD,
    value: 50,
    unlockEffectId: ITEM_EFFECT_ID.SHOWDOWN_LOSE_REFUND,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.WTSD_3,
    type: PLAY_RECORD_STATS_TYPE.WTSD,
    value: 100,
    unlockEffectId: ITEM_EFFECT_ID.SHOWDOWN_LOSE_REFUND,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.WTSD_4,
    type: PLAY_RECORD_STATS_TYPE.WTSD,
    value: 250,
    unlockEffectId: ITEM_EFFECT_ID.SHOWDOWN_LOSE_REFUND,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.FOLD_1,
    type: PLAY_RECORD_STATS_TYPE.FOLD,
    value: 100,
    unlockEffectId: ITEM_EFFECT_ID.QUANTUM_FOLD,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.FOLD_2,
    type: PLAY_RECORD_STATS_TYPE.FOLD,
    value: 500,
    unlockEffectId: ITEM_EFFECT_ID.QUANTUM_FOLD,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.FOLD_3,
    type: PLAY_RECORD_STATS_TYPE.FOLD,
    value: 1000,
    unlockEffectId: ITEM_EFFECT_ID.QUANTUM_FOLD,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.FOLD_4,
    type: PLAY_RECORD_STATS_TYPE.FOLD,
    value: 2500,
    unlockEffectId: ITEM_EFFECT_ID.QUANTUM_FOLD,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.WIN_WITH_PAIR_1,
    type: PLAY_RECORD_STATS_TYPE.WIN_WITH_ONE_PAIR,
    value: 10,
    unlockEffectId: ITEM_EFFECT_ID.OUTKICKED,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.WIN_WITH_TWO_PAIR_1,
    type: PLAY_RECORD_STATS_TYPE.WIN_WITH_TWO_PAIR,
    value: 22,
    unlockEffectId: ITEM_EFFECT_ID.PAIR_MASTER,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.WIN_WITH_THREE_OF_A_KIND_1,
    type: PLAY_RECORD_STATS_TYPE.WIN_WITH_THREE_OF_A_KIND,
    value: 10,
    unlockEffectId: ITEM_EFFECT_ID.SETS_MASTER,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.WIN_WITH_STRAIGHT_1,
    type: PLAY_RECORD_STATS_TYPE.WIN_WITH_STRAIGHT,
    value: 10,
    unlockEffectId: ITEM_EFFECT_ID.DOUBLE_DOWN,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.WIN_WITH_FLUSH_1,
    type: PLAY_RECORD_STATS_TYPE.WIN_WITH_FLUSH,
    value: 5,
    unlockEffectId: ITEM_EFFECT_ID.FLUSH_MASTER,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.WIN_WITH_FLUSH_2,
    type: PLAY_RECORD_STATS_TYPE.WIN_WITH_FLUSH,
    value: 25,
    unlockEffectId: ITEM_EFFECT_ID.FLUSH_MASTER,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.WIN_WITH_FLUSH_3,
    type: PLAY_RECORD_STATS_TYPE.WIN_WITH_FLUSH,
    value: 50,
    unlockEffectId: ITEM_EFFECT_ID.FLUSH_MASTER,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.WIN_WITH_FLUSH_4,
    type: PLAY_RECORD_STATS_TYPE.WIN_WITH_FLUSH,
    value: 100,
    unlockEffectId: ITEM_EFFECT_ID.FLUSH_MASTER,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.DEALT_HANDS_DIAMOND_1,
    type: PLAY_RECORD_STATS_TYPE.DEALT_HANDS_DIAMOND,
    value: 500,
    unlockEffectId: ITEM_EFFECT_ID.DIAMOND_COLLECTOR,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.DEALT_HANDS_DIAMOND_2,
    type: PLAY_RECORD_STATS_TYPE.DEALT_HANDS_DIAMOND,
    value: 1000,
    unlockEffectId: ITEM_EFFECT_ID.DIAMOND_COLLECTOR,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.DEALT_HANDS_DIAMOND_3,
    type: PLAY_RECORD_STATS_TYPE.DEALT_HANDS_DIAMOND,
    value: 2500,
    unlockEffectId: ITEM_EFFECT_ID.DIAMOND_COLLECTOR,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.DEALT_HANDS_DIAMOND_4,
    type: PLAY_RECORD_STATS_TYPE.DEALT_HANDS_DIAMOND,
    value: 5000,
    unlockEffectId: ITEM_EFFECT_ID.DIAMOND_COLLECTOR,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.DEALT_HANDS_CLUB_1,
    type: PLAY_RECORD_STATS_TYPE.DEALT_HANDS_CLUB,
    value: 500,
    unlockEffectId: ITEM_EFFECT_ID.CLUB_COLLECTOR,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.DEALT_HANDS_CLUB_2,
    type: PLAY_RECORD_STATS_TYPE.DEALT_HANDS_CLUB,
    value: 1000,
    unlockEffectId: ITEM_EFFECT_ID.CLUB_COLLECTOR,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.DEALT_HANDS_CLUB_3,
    type: PLAY_RECORD_STATS_TYPE.DEALT_HANDS_CLUB,
    value: 2500,
    unlockEffectId: ITEM_EFFECT_ID.CLUB_COLLECTOR,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.DEALT_HANDS_CLUB_4,
    type: PLAY_RECORD_STATS_TYPE.DEALT_HANDS_CLUB,
    value: 5000,
    unlockEffectId: ITEM_EFFECT_ID.CLUB_COLLECTOR,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.DEALT_HANDS_HEART_1,
    type: PLAY_RECORD_STATS_TYPE.DEALT_HANDS_HEART,
    value: 500,
    unlockEffectId: ITEM_EFFECT_ID.HEART_COLLECTOR,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.DEALT_HANDS_HEART_2,
    type: PLAY_RECORD_STATS_TYPE.DEALT_HANDS_HEART,
    value: 1000,
    unlockEffectId: ITEM_EFFECT_ID.HEART_COLLECTOR,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.DEALT_HANDS_HEART_3,
    type: PLAY_RECORD_STATS_TYPE.DEALT_HANDS_HEART,
    value: 2500,
    unlockEffectId: ITEM_EFFECT_ID.HEART_COLLECTOR,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.DEALT_HANDS_HEART_4,
    type: PLAY_RECORD_STATS_TYPE.DEALT_HANDS_HEART,
    value: 5000,
    unlockEffectId: ITEM_EFFECT_ID.HEART_COLLECTOR,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.DEALT_HANDS_SPADE_1,
    type: PLAY_RECORD_STATS_TYPE.DEALT_HANDS_SPADE,
    value: 500,
    unlockEffectId: ITEM_EFFECT_ID.SPADE_COLLECTOR,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.DEALT_HANDS_SPADE_2,
    type: PLAY_RECORD_STATS_TYPE.DEALT_HANDS_SPADE,
    value: 1000,
    unlockEffectId: ITEM_EFFECT_ID.SPADE_COLLECTOR,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.DEALT_HANDS_SPADE_3,
    type: PLAY_RECORD_STATS_TYPE.DEALT_HANDS_SPADE,
    value: 2500,
    unlockEffectId: ITEM_EFFECT_ID.SPADE_COLLECTOR,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.DEALT_HANDS_SPADE_4,
    type: PLAY_RECORD_STATS_TYPE.DEALT_HANDS_SPADE,
    value: 5000,
    unlockEffectId: ITEM_EFFECT_ID.SPADE_COLLECTOR,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.WIN_WITH_FULL_HOUSE_1,
    type: PLAY_RECORD_STATS_TYPE.WIN_WITH_FULL_HOUSE,
    value: 10,
    unlockEffectId: ITEM_EFFECT_ID.FULL_HOUSE_MASTER,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.WIN_WITH_FOUR_OF_A_KIND_1,
    type: PLAY_RECORD_STATS_TYPE.WIN_WITH_FOUR_OF_A_KIND,
    value: 5,
    unlockEffectId: ITEM_EFFECT_ID.FOUR_OF_A_KIND_MASTER,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.WIN_WITH_STRAIGHT_FLUSH_1,
    type: PLAY_RECORD_STATS_TYPE.WIN_WITH_STRAIGHT_FLUSH,
    value: 1,
    unlockEffectId: ITEM_EFFECT_ID.STRAIGHT_FLUSH_MASTER,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.WIN_WITH_STRAIGHT_FLUSH_2,
    type: PLAY_RECORD_STATS_TYPE.WIN_WITH_ROYAL_FLUSH,
    value: 5,
    unlockEffectId: ITEM_EFFECT_ID.ROYAL_FLUSH_MASTER,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.CONSUME_STAMINA_1,
    type: PLAY_RECORD_STATS_TYPE.STAMINA_CONSUMED,
    value: 100,
    unlockEffectId: ITEM_EFFECT_ID.STAMINA_REGEN,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.CONSUME_STAMINA_2,
    type: PLAY_RECORD_STATS_TYPE.STAMINA_CONSUMED,
    value: 1000,
    unlockEffectId: ITEM_EFFECT_ID.STAMINA_REGEN,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.CONSUME_STAMINA_3,
    type: PLAY_RECORD_STATS_TYPE.STAMINA_CONSUMED,
    value: 10000,
    unlockEffectId: ITEM_EFFECT_ID.STAMINA_REGEN,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.CONSUME_STAMINA_4,
    type: PLAY_RECORD_STATS_TYPE.STAMINA_CONSUMED,
    value: 100000,
    unlockEffectId: ITEM_EFFECT_ID.STAMINA_REGEN,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.ALL_IN_1,
    type: PLAY_RECORD_STATS_TYPE.ALL_IN,
    value: 1,
    unlockEffectId: ITEM_EFFECT_ID.ALLIN_INSURANCE,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.ALL_IN_2,
    type: PLAY_RECORD_STATS_TYPE.ALL_IN,
    value: 10,
    unlockEffectId: ITEM_EFFECT_ID.ALLIN_INSURANCE,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.ALL_IN_3,
    type: PLAY_RECORD_STATS_TYPE.ALL_IN,
    value: 50,
    unlockEffectId: ITEM_EFFECT_ID.ALLIN_INSURANCE,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.ALL_IN_4,
    type: PLAY_RECORD_STATS_TYPE.ALL_IN,
    value: 100,
    unlockEffectId: ITEM_EFFECT_ID.ALLIN_INSURANCE,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.BLIND_PAY_1,
    type: PLAY_RECORD_STATS_TYPE.PAID_BLIND_COUNT,
    value: 10,
    unlockEffectId: ITEM_EFFECT_ID.BLIND_DISCOUNT,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.BLIND_PAY_2,
    type: PLAY_RECORD_STATS_TYPE.PAID_BLIND_COUNT,
    value: 100,
    unlockEffectId: ITEM_EFFECT_ID.BLIND_DISCOUNT,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.BLIND_PAY_3,
    type: PLAY_RECORD_STATS_TYPE.PAID_BLIND_COUNT,
    value: 250,
    unlockEffectId: ITEM_EFFECT_ID.BLIND_DISCOUNT,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.BLIND_PAY_4,
    type: PLAY_RECORD_STATS_TYPE.PAID_BLIND_COUNT,
    value: 500,
    unlockEffectId: ITEM_EFFECT_ID.BLIND_DISCOUNT,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.BUST_1,
    type: PLAY_RECORD_STATS_TYPE.BUST,
    value: 1,
    unlockEffectId: ITEM_EFFECT_ID.EMERGENCY_FUND,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.BUST_2,
    type: PLAY_RECORD_STATS_TYPE.BUST,
    value: 3,
    unlockEffectId: ITEM_EFFECT_ID.EMERGENCY_FUND,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.BUST_3,
    type: PLAY_RECORD_STATS_TYPE.BUST,
    value: 6,
    unlockEffectId: ITEM_EFFECT_ID.EMERGENCY_FUND,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.BUST_4,
    type: PLAY_RECORD_STATS_TYPE.BUST,
    value: 12,
    unlockEffectId: ITEM_EFFECT_ID.EMERGENCY_FUND,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.THRIFTY_1,
    type: PLAY_RECORD_STATS_TYPE.RAKE_SAVED,
    value: 1000,
    unlockEffectId: ITEM_EFFECT_ID.RAKE_REDUCTION,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.THRIFTY_2,
    type: PLAY_RECORD_STATS_TYPE.RAKE_SAVED,
    value: 10000,
    unlockEffectId: ITEM_EFFECT_ID.RAKE_REDUCTION,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.THRIFTY_3,
    type: PLAY_RECORD_STATS_TYPE.RAKE_SAVED,
    value: 100000,
    unlockEffectId: ITEM_EFFECT_ID.RAKE_REDUCTION,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.HIGH_ROLLER_1,
    type: PLAY_RECORD_STATS_TYPE.MAX_WIN_POT,
    value: 50000,
    unlockEffectId: ITEM_EFFECT_ID.BUY_IN_MULTIPLY,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.HIGH_ROLLER_2,
    type: PLAY_RECORD_STATS_TYPE.MAX_WIN_POT,
    value: 500000,
    unlockEffectId: ITEM_EFFECT_ID.BUY_IN_MULTIPLY,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.HIGH_ROLLER_3,
    type: PLAY_RECORD_STATS_TYPE.MAX_WIN_POT,
    value: 5000000,
    unlockEffectId: ITEM_EFFECT_ID.BUY_IN_MULTIPLY,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.HIGH_ROLLER_4,
    type: PLAY_RECORD_STATS_TYPE.MAX_WIN_POT,
    value: 10000000,
    unlockEffectId: ITEM_EFFECT_ID.BUY_IN_MULTIPLY,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.WIN_STREAK_1,
    type: PLAY_RECORD_STATS_TYPE.MAX_WIN_STREAK,
    value: 2,
    unlockEffectId: ITEM_EFFECT_ID.WINNER_MASTER,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.WIN_STREAK_2,
    type: PLAY_RECORD_STATS_TYPE.MAX_WIN_STREAK,
    value: 4,
    unlockEffectId: ITEM_EFFECT_ID.WINNER_MASTER,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.WIN_STREAK_3,
    type: PLAY_RECORD_STATS_TYPE.MAX_WIN_STREAK,
    value: 6,
    unlockEffectId: ITEM_EFFECT_ID.QUANTUM_LUCK,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.WIN_STREAK_4,
    type: PLAY_RECORD_STATS_TYPE.MAX_WIN_STREAK,
    value: 8,
    unlockEffectId: ITEM_EFFECT_ID.QUANTUM_LUCK,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.WIN_STREAK_5,
    type: PLAY_RECORD_STATS_TYPE.MAX_WIN_STREAK,
    value: 8,
    unlockEffectId: ITEM_EFFECT_ID.QUANTUM_LUCK,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.WIN_STREAK_6,
    type: PLAY_RECORD_STATS_TYPE.MAX_WIN_STREAK,
    value: 10,
    unlockEffectId: ITEM_EFFECT_ID.LUCKY_7_COLLECTOR,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.VILLAIN_1,
    type: PLAY_RECORD_STATS_TYPE.TOTAL_GAIN_INFAMY,
    value: 50,
    unlockEffectId: ITEM_EFFECT_ID.INFAMY_BOOST,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.VILLAIN_2,
    type: PLAY_RECORD_STATS_TYPE.TOTAL_GAIN_INFAMY,
    value: 150,
    unlockEffectId: ITEM_EFFECT_ID.INFAMY_BOOST,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.VILLAIN_3,
    type: PLAY_RECORD_STATS_TYPE.TOTAL_GAIN_INFAMY,
    value: 300,
    unlockEffectId: ITEM_EFFECT_ID.INFAMY_BOOST,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.VILLAIN_4,
    type: PLAY_RECORD_STATS_TYPE.TOTAL_GAIN_INFAMY,
    value: 500,
    unlockEffectId: ITEM_EFFECT_ID.INFAMY_BOOST,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.VILLAIN_5,
    type: PLAY_RECORD_STATS_TYPE.TOTAL_GAIN_INFAMY,
    value: 1000,
    unlockEffectId: ITEM_EFFECT_ID.BORN_VILLAIN,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.LOSE_STREAK_1,
    type: PLAY_RECORD_STATS_TYPE.MAX_LOSE_STREAK,
    value: 5,
    unlockEffectId: ITEM_EFFECT_ID.FAILURE_IS_MOTHER_OF_SUCCESS,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.LOSE_STREAK_2,
    type: PLAY_RECORD_STATS_TYPE.MAX_LOSE_STREAK,
    value: 10,
    unlockEffectId: ITEM_EFFECT_ID.FAILURE_IS_MOTHER_OF_SUCCESS,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.LOSE_STREAK_3,
    type: PLAY_RECORD_STATS_TYPE.MAX_LOSE_STREAK,
    value: 15,
    unlockEffectId: ITEM_EFFECT_ID.FAILURE_IS_MOTHER_OF_SUCCESS,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.LOSE_STREAK_4,
    type: PLAY_RECORD_STATS_TYPE.MAX_LOSE_STREAK,
    value: 20,
    unlockEffectId: ITEM_EFFECT_ID.OMEN,
    maxAllowEffectCount: 4,
  },

];

/**
 * Checks session stats and marks achievements as completed.
 * Called on game init or at cashout before showing session report.
 */
export function checkCompleteAchievement() {
  UNLOCK_RULES.forEach((rule) => {
    const statValue = getPlayStats(rule.type);
    if (statValue >= rule.value) {
      addUnlockAchievement(rule.id);
    }
  });
}

/**
 * Checks which items are newly unlocked based on completed achievements.
 * Returns the list of items that can now be obtained for the first time
 * (i.e., items that weren't unlocked before this session but are now).
 * @param {string[]} previouslyUnlocked - Achievement IDs that were unlocked BEFORE this session.
 * @returns {object[]} - Array of newly accessible ITEM_DATA items.
 */
export function checkUnlockItem(previouslyUnlocked = []) {
  const currentlyUnlocked = getUnlockAchievements();

  // Check what items are newly accessible
  const wasUnlocked = (item) => isItemUnlocked(item, previouslyUnlocked);
  const isNowUnlocked = (item) => isItemUnlocked(item, currentlyUnlocked);

  const newlyUnlocked = ITEM_DATA.filter(item => !wasUnlocked(item) && isNowUnlocked(item));
  return newlyUnlocked;
}

/**
 * Determines if a given item is unlocked based on the provided set of completed achievement IDs.
 * Logic:
 *  - For each effect in the item that is linked to an UNLOCK_RULE:
 *    count how many of that effect the item has.
 *    Find the most permissive rule achieved (highest maxAllowEffectCount).
 *    If the item's effect count <= that maxAllowEffectCount → that effect group is unlocked.
 *  - If any effect group is NOT unlocked → item is locked.
 *  - Effects not in any UNLOCK_RULE are always considered unlocked.
 * @param {object} item - An item from ITEM_DATA (with string-based effects array).
 * @param {string[]} unlockedAchievementIds - Array of achieved achievement IDs.
 * @returns {boolean}
 */
export function isItemUnlocked(item, unlockedAchievementIds = []) {
  if (!item || !item.effects) return true;

  // Build a map: effectId -> max allowed count from achieved rules
  const allowedCountMap = {};
  UNLOCK_RULES.forEach(rule => {
    if (unlockedAchievementIds.includes(rule.id)) {
      const current = allowedCountMap[rule.unlockEffectId] || 0;
      if (rule.maxAllowEffectCount > current) {
        allowedCountMap[rule.unlockEffectId] = rule.maxAllowEffectCount;
      }
    }
  });

  // Build a set of all effectIds that have unlock rules
  const guardedEffects = new Set(UNLOCK_RULES.map(r => r.unlockEffectId));

  // Count how many of each guarded effect this item has
  const effectCountMap = {};
  item.effects.forEach(eff => {
    const effectId = typeof eff === 'string' ? eff : eff?.id;
    if (effectId && guardedEffects.has(effectId)) {
      effectCountMap[effectId] = (effectCountMap[effectId] || 0) + 1;
    }
  });

  // For each effect group, check if we have sufficient achievement level
  for (const [effectId, count] of Object.entries(effectCountMap)) {
    const allowed = allowedCountMap[effectId] || 0;
    if (count > allowed) return false; // This item requires more than what the player has achieved
  }

  return true;
}