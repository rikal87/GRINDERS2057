import { getListPlayStatsSession, addUnlockAchievement, getUnlockAchievements } from './store';
import { PLAY_RECORD_STATS_TYPE } from './playRecordStats';
import { ITEM_EFFECT_ID } from './itemsEffect';
import { ITEM_DATA } from './items';

export const ACHIEVEMENT_ID = {
  FIRST_BURST: 'first_burst', // 첫 버스트
  THRITY: 'thrity', // 구두쇠 계열
  PENNY_PINCHER: 'penny_pincher', // 구두쇠 계열
  SKINFLINT: 'skinflint', // 구두쇠 계열
  MISER: 'miser', // 구두쇠 계열
  HIGH_ROLLER: 'high_roller', // 하이롤러
}
export const UNLOCK_RULES = [
  {
    id: ACHIEVEMENT_ID.THRITY,
    type: PLAY_RECORD_STATS_TYPE.RAKE_SAVED,
    isSession: true,
    value: 100,
    unlockEffectId: ITEM_EFFECT_ID.THRITY,
    maxAllowEffectCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.PENNY_PINCHER,
    type: PLAY_RECORD_STATS_TYPE.RAKE_SAVED,
    isSession: true,
    value: 1000,
    unlockEffectId: ITEM_EFFECT_ID.RAKE_REDUCTION,
    maxAllowEffectCount: 2,
  },
  {
    id: ACHIEVEMENT_ID.SKINFLINT,
    type: PLAY_RECORD_STATS_TYPE.RAKE_SAVED,
    isSession: true,
    value: 10000,
    unlockEffectId: ITEM_EFFECT_ID.RAKE_REDUCTION,
    maxAllowEffectCount: 3,
  },
  {
    id: ACHIEVEMENT_ID.MISER,
    type: PLAY_RECORD_STATS_TYPE.RAKE_SAVED,
    isSession: true,
    value: 100000,
    unlockEffectId: ITEM_EFFECT_ID.RAKE_REDUCTION,
    maxAllowEffectCount: 4,
  },
];


export function checkCompleteAchievement() {
  UNLOCK_RULES.forEach((rule) => {
    const playStats = getPlayStatsSession(rule.type);
    if (playStats >= rule.value) {
      addUnlockAchievement(rule.id);
    }
  })
}
export function checkUnlockItem() {
  const unlockAchievements = getUnlockAchievements();
  // unlockAchievements.forEach((achievement) => {
  //   ITEM_DATA.forEach((item) => {
  //     if (item.effects.filter((effect) => effect.id === achievement.unlockEffectId).length > 0) {
  //       item.unlocked = true;
  //     }
  //   })
  // })
  // ITEM_DATA.forEach((item) => {
  //   if (item.effects.filter((effect) => effect.id === ).length > 0 && unlockAchievements[item.unlockAchievementId]) {
  //     item.unlocked = true;
  //   }
  // })
}