import { getPlayStats, addUnlockAchievement, getUnlockAchievements } from './store';
import { PLAY_RECORD_STATS_TYPE } from './playRecordStats';
import { ITEM_EFFECT_ID } from './itemsEffect';
import { ITEM_DATA } from './items';

export const ACHIEVEMENT_ID = {
  BUST_1: 'bust_1', // 버스트
  BUST_2: 'bust_2', // 버스트
  BUST_3: 'bust_3', // 버스트
  BUST_4: 'bust_4', // 버스트
  THRITY_1: 'thrity_1', // 구두쇠 계열
  THRITY_2: 'thrity_2', // 구두쇠 계열
  THRITY_3: 'thrity_3', // 구두쇠 계열
  THRITY_4: 'thrity_4', // 구두쇠 계열
  HIGH_ROLLER_1: 'high_roller_1', // 하이롤러
  HIGH_ROLLER_2: 'high_roller_2', // 하이롤러
  HIGH_ROLLER_3: 'high_roller_3', // 하이롤러
  HIGH_ROLLER_4: 'high_roller_4', // 하이롤러
  WIN_STREAK_1: 'win_streak_1', // 연승
  WIN_STREAK_2: 'win_streak_2', // 연승
  WIN_STREAK_3: 'win_streak_3', // 연승
  WIN_STREAK_4: 'win_streak_4', // 연승
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
  WTSD_1: 'wtsd_1', // 팟에 참여
  WTSD_2: 'wtsd_2', // 팟에 참여
  WTSD_3: 'wtsd_3', // 팟에 참여
  WTSD_4: 'wtsd_4', // 팟에 참여
  BONUS_BENEFIT_1: 'bonus_benefit_1', // 보너스 혜택
  BONUS_BENEFIT_2: 'bonus_benefit_2', // 보너스 혜택
  BONUS_BENEFIT_3: 'bonus_benefit_3', // 보너스 혜택
  BONUS_BENEFIT_4: 'bonus_benefit_4', // 보너스 혜택
  GAIND_XP_1: 'gaind_xp_1', // 경험치 획득
  GAIND_XP_2: 'gaind_xp_2', // 경험치 획득
  GAIND_XP_3: 'gaind_xp_3', // 경험치 획득
  GAIND_XP_4: 'gaind_xp_4', // 경험치 획득
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
}

/**
 * Each rule defines an achievement and the effect it unlocks.
 * maxAllowEffectCount: the max number of this effect an item can have while being unlocked.
 * e.g., PENNY_PINCHER (value: 1000) -> allows items with up to 2 RAKE_REDUCTION effects to appear in shop.
 * If an item has 3 RAKE_REDUCTION effects, it requires SKINFLINT to be unlocked.
 */
export const UNLOCK_RULES = [
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
    value: 100000,
    unlockEffectId: ITEM_EFFECT_ID.STONK,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.BUY_ITEM_3,
    type: PLAY_RECORD_STATS_TYPE.BUY_ITEM,
    value: 500000,
    unlockEffectId: ITEM_EFFECT_ID.STONK,
    maxAllowEffectCount: 3,
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
    value: 2500,
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
    value: 100000,
    unlockEffectId: ITEM_EFFECT_ID.LOYALTY_CARD,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.BRIBE_DEALER_3,
    type: PLAY_RECORD_STATS_TYPE.BRIBE_DEALER,
    value: 1000000,
    unlockEffectId: ITEM_EFFECT_ID.LOYALTY_CARD,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.BRIBE_DEALER_4,
    type: PLAY_RECORD_STATS_TYPE.BRIBE_DEALER,
    value: 10000000,
    unlockEffectId: ITEM_EFFECT_ID.LOYALTY_CARD,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.GAIND_XP_2,
    type: PLAY_RECORD_STATS_TYPE.ITEM_EFFECT,
    value: 1000,
    unlockEffectId: ITEM_EFFECT_ID.XP_BOOST,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.GAIND_XP_3,
    type: PLAY_RECORD_STATS_TYPE.ITEM_EFFECT,
    value: 10000,
    unlockEffectId: ITEM_EFFECT_ID.XP_BOOST,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.GAIND_XP_4,
    type: PLAY_RECORD_STATS_TYPE.ITEM_EFFECT,
    value: 100000,
    unlockEffectId: ITEM_EFFECT_ID.XP_BOOST,
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
    id: ACHIEVEMENT_ID.THRITY_1,
    type: PLAY_RECORD_STATS_TYPE.RAKE_SAVED,
    value: 100,
    unlockEffectId: ITEM_EFFECT_ID.RAKE_REDUCTION,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.THRITY_2,
    type: PLAY_RECORD_STATS_TYPE.RAKE_SAVED,
    value: 1000,
    unlockEffectId: ITEM_EFFECT_ID.RAKE_REDUCTION,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.THRITY_3,
    type: PLAY_RECORD_STATS_TYPE.RAKE_SAVED,
    value: 10000,
    unlockEffectId: ITEM_EFFECT_ID.RAKE_REDUCTION,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.THRITY_4,
    type: PLAY_RECORD_STATS_TYPE.RAKE_SAVED,
    value: 100000,
    unlockEffectId: ITEM_EFFECT_ID.RAKE_REDUCTION,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.HIGH_ROLLER_1,
    type: PLAY_RECORD_STATS_TYPE.MAX_WIN_POT,
    value: 1000,
    unlockEffectId: ITEM_EFFECT_ID.BUY_IN_MULTIPLY,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.HIGH_ROLLER_2,
    type: PLAY_RECORD_STATS_TYPE.MAX_WIN_POT,
    value: 10000,
    unlockEffectId: ITEM_EFFECT_ID.BUY_IN_MULTIPLY,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.HIGH_ROLLER_3,
    type: PLAY_RECORD_STATS_TYPE.MAX_WIN_POT,
    value: 100000,
    unlockEffectId: ITEM_EFFECT_ID.BUY_IN_MULTIPLY,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.HIGH_ROLLER_4,
    type: PLAY_RECORD_STATS_TYPE.MAX_WIN_POT,
    value: 1000000,
    unlockEffectId: ITEM_EFFECT_ID.BUY_IN_MULTIPLY,
    maxAllowEffectCount: 4,
  },
  {
    id: ACHIEVEMENT_ID.WIN_STREAK_1,
    type: PLAY_RECORD_STATS_TYPE.MAX_WIN_STREAK,
    value: 3,
    unlockEffectId: ITEM_EFFECT_ID.WINNER_MASTER,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.WIN_STREAK_2,
    type: PLAY_RECORD_STATS_TYPE.MAX_WIN_STREAK,
    value: 6,
    unlockEffectId: ITEM_EFFECT_ID.WINNER_MASTER,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.WIN_STREAK_3,
    type: PLAY_RECORD_STATS_TYPE.MAX_WIN_STREAK,
    value: 9,
    unlockEffectId: ITEM_EFFECT_ID.WINNER_MASTER,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.WIN_STREAK_4,
    type: PLAY_RECORD_STATS_TYPE.MAX_WIN_STREAK,
    value: 12,
    unlockEffectId: ITEM_EFFECT_ID.WINNER_MASTER,
    maxAllowEffectCount: 4,
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
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.LOSE_STREAK_4,
    type: PLAY_RECORD_STATS_TYPE.MAX_LOSE_STREAK,
    value: 20,
    unlockEffectId: ITEM_EFFECT_ID.FAILURE_IS_MOTHER_OF_SUCCESS,
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