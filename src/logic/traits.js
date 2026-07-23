/**
 * GRINDERS 2057 Cyberspace OS - Player Trait System (traits.js)
 * 
 * 조기 성숙(Early Bloomer) 및 대기만성(Late Bloomer) 특성 포함 최신 데이터 모듈
 */

import { store } from './store.js';

// 언어 조회 헬퍼
const getLanguage = () => store?.settings?.language || 'ko';

/**
 * 특성 성격 카테고리 (TRAIT_CATEGORY)
 */
export const TRAIT_CATEGORY = {
  PERK: 'PERK',       // 순수 긍정 (Buff)
  HYBRID: 'HYBRID',   // 일장일단 (Double-edged / Trade-off)
  FLAW: 'FLAW',       // 순수 부정 (Debuff / Risk)
};

/**
 * 특성 ID 상수 고유 키 맵
 */
export const TRAIT_ID = {
  // Tier 1: 수치/Cap 보정형
  CALM_MIND: 'calm_mind',               // [침착한 자] 멘탈 cap +20%
  SOLVER_BRAIN: 'solver_brain',         // [포커 컴퓨터] 실력 +10
  PRODIGY: 'prodigy',                   // [유망주] XP 1.5배 & S+(95) 한계치
  EARLY_BLOOMER: 'early_bloomer',       // [조기 성숙] XP +25% 속도 / 한계치 -20 감가
  LATE_BLOOMER: 'late_bloomer',         // [대기만성] XP -20% 속도 / 한계치 +20 확장

  // Tier 2: 조건부 승폭형
  FISH_HUNTER: 'fish_hunter',           // [피쉬 사냥꾼] C/D급 하위 테이블 출전 시 수익 2배
  BIG_GAME_HUNTER: 'big_game_hunter',   // [승부사] 대형 팟 승리 시 상금 +20%

  // Tier 3: 에이전시 경영/경제 규칙 변형형
  FAMOUS_STREAMER: 'famous_streamer',   // [유명 스트리머] 후원금 3배 / 수수료 1.5배
  DESPERATE_GAMBLER: 'desperate_gambler', // [벼랑끝 도박꾼] 배짱 +30 / 패배 시 빚 +$5,000
  LOYAL_GUARANTOR: 'loyal_guarantor',   // [충성 보증인] 재계약 거부율 0% / 이적 해약금 0

  // Tier 4: 이벤트/시스템 파괴형 유니크 기믹
  PHOENIX_PROTOCOL: 'phoenix_protocol', // [파산 불사조] 뱅크롤 $0 도달 시 1회 파산 무효화 & $10,000 복구
  SABOTEUR: 'saboteur',                 // [사보타주 마스터] 상대 에이전시 선수 멘탈 지속 감가
  MANIAC: 'maniac',                     // [공격적 도박꾼] 팟 승리 +30% / 패배 시 멘탈 감가 2배
  GLASS_MENTAL: 'glass_mental',         // [유리멘탈] TILT 발동 시 무조건 올인
  DIRT_POOR: 'dirt_poor',               // [흙수저] 시작 뱅크롤 -50% / 충성도 2배

  // persona.js 영감 유니크 특성
  CALLING_STATION: 'calling_station',   // [콜링 스테이션] (mr_call)
  WHALE_STACKER: 'whale_stacker',       // [무한 자금력/고래] (Kate/The_Whale)
  QUANT_ANALYST: 'quant_analyst',       // [데이터 퀀트] (quant_pro)
  CHEATING_SCANDAL: 'cheating_scandal', // [치팅 스캔들] (Sloan)
  NEURAL_READER: 'neural_reader',       // [독심술사] (D_NEURAL/Negreanu)
  IRON_NIT: 'iron_nit',                 // [바위 니트] (nit)
};

/**
 * 통합 특성 데이터 정의 배열 (TRAIT_DATA)
 */
export const TRAIT_DATA = [
  // --- Tier 1: 수치/Cap 보정형 ---
  {
    id: TRAIT_ID.CALM_MIND,
    name_ko: '침착한 자',
    name_en: 'Calm Mind',
    get name() { return getLanguage() === 'en' ? this.name_en : this.name_ko; },
    icon: '🧘',
    category: TRAIT_CATEGORY.PERK,
    type: 'MENTAL',
    tier: 'EPIC',
    desc_ko: '멘탈 한계치가 +20% 확장되며, 패배 후 급발진(TILT)에 빠질 확률이 50% 줄어듭니다.',
    desc_en: 'Increases Mental Cap by +20% and cuts TILT crash risk by 50%.',
    get desc() { return getLanguage() === 'en' ? this.desc_en : this.desc_ko; },
    unlockXp: 50,
    isUnrevealed: false,
    trigger: ['background_sim', 'mental_cap'],
    applyEffect: (partner, triggerType, context = {}) => {
      if (triggerType === 'background_sim') {
        return { tiltLossMitigation: 0.5, evModifier: 1.05 };
      }
      if (triggerType === 'mental_cap') {
        return { mentalCapModifier: 1.2 };
      }
      return null;
    }
  },
  {
    id: TRAIT_ID.SOLVER_BRAIN,
    name_ko: '포커 컴퓨터',
    name_en: 'Poker AI Mind',
    get name() { return getLanguage() === 'en' ? this.name_en : this.name_ko; },
    icon: '🤖',
    category: TRAIT_CATEGORY.PERK,
    type: 'SKILL',
    tier: 'RARE',
    desc_ko: '실력(Skill) 수치가 +10 보정되며, 정석 플레이 시 실수를 하지 않습니다.',
    desc_en: 'Grants +10 Skill Rating and eliminates tactical mistakes.',
    get desc() { return getLanguage() === 'en' ? this.desc_en : this.desc_ko; },
    unlockXp: 100,
    isUnrevealed: false,
    trigger: ['background_sim', 'stat_calc'],
    applyEffect: (partner, triggerType, context = {}) => {
      if (triggerType === 'stat_calc') {
        return { skillBonus: 10 };
      }
      if (triggerType === 'background_sim') {
        return { evModifier: 1.15 };
      }
      return null;
    }
  },
  {
    id: TRAIT_ID.PRODIGY,
    name_ko: '유망주',
    name_en: 'Prodigy',
    get name() { return getLanguage() === 'en' ? this.name_en : this.name_ko; },
    icon: '🌟',
    category: TRAIT_CATEGORY.PERK,
    type: 'GROWTH',
    tier: 'EPIC',
    desc_ko: '성장 경험치 획득량이 1.5배 빨라지며, 최고 S+(95) 등급까지 성장할 수 있습니다.',
    desc_en: 'Boosts XP growth by 1.5x and unlocks maximum growth up to S+ (95).',
    get desc() { return getLanguage() === 'en' ? this.desc_en : this.desc_ko; },
    unlockXp: 150,
    isUnrevealed: false,
    trigger: ['background_sim', 'max_ovr_cap'],
    applyEffect: (partner, triggerType, context = {}) => {
      if (triggerType === 'max_ovr_cap') {
        return { maxCap: 95 };
      }
      if (triggerType === 'background_sim') {
        return { xpMultiplier: 1.5 };
      }
      return null;
    }
  },
  {
    id: TRAIT_ID.EARLY_BLOOMER,
    name_ko: '조기 성숙',
    name_en: 'Early Bloomer',
    get name() { return getLanguage() === 'en' ? this.name_en : this.name_ko; },
    icon: '⚡',
    category: TRAIT_CATEGORY.HYBRID,
    type: 'GROWTH',
    tier: 'RARE',
    desc_ko: '초반 성장 속도가 +25% 빠르게 급상승하지만, 성장 한계선(Max Cap)이 -20 조기 정체됩니다.',
    desc_en: 'Boosts early XP gain by +25%, but caps maximum growth by -20 lower.',
    get desc() { return getLanguage() === 'en' ? this.desc_en : this.desc_ko; },
    unlockXp: 40,
    isUnrevealed: false,
    trigger: ['background_sim', 'max_ovr_cap'],
    applyEffect: (partner, triggerType, context = {}) => {
      if (triggerType === 'max_ovr_cap') {
        return { capDeduction: 20 };
      }
      if (triggerType === 'background_sim') {
        return { xpMultiplier: 1.25 };
      }
      return null;
    }
  },
  {
    id: TRAIT_ID.LATE_BLOOMER,
    name_ko: '대기만성',
    name_en: 'Late Bloomer',
    get name() { return getLanguage() === 'en' ? this.name_en : this.name_ko; },
    icon: '🐢',
    category: TRAIT_CATEGORY.HYBRID,
    type: 'GROWTH',
    tier: 'EPIC',
    desc_ko: '초반 경험치 획득이 -20% 느려 대기 시간이 길지만, 최종 성장 한계선(Max Cap)이 +20 확장됩니다.',
    desc_en: 'Slower early XP (-20%), but extends final maximum growth cap by +20 higher.',
    get desc() { return getLanguage() === 'en' ? this.desc_en : this.desc_ko; },
    unlockXp: 160,
    isUnrevealed: false,
    trigger: ['background_sim', 'max_ovr_cap'],
    applyEffect: (partner, triggerType, context = {}) => {
      if (triggerType === 'max_ovr_cap') {
        return { capBonus: 20 };
      }
      if (triggerType === 'background_sim') {
        return { xpMultiplier: 0.8 };
      }
      return null;
    }
  },

  // --- persona.js 영감 추출 유니크 페르소나 특성 ---
  {
    id: TRAIT_ID.CALLING_STATION,
    name_ko: '콜링 스테이션',
    name_en: 'Calling Station',
    get name() { return getLanguage() === 'en' ? this.name_en : this.name_ko; },
    icon: '👀',
    category: TRAIT_CATEGORY.HYBRID,
    type: 'GUTS',
    tier: 'COMMON',
    desc_ko: '상대 블러핑 판별력이 높아 쇼다운 승률이 +20% 상승하지만, 패배 시 팟 손실이 +30% 증가합니다.',
    desc_en: 'Boosts showdown winrate by +20%, but increases pot loss by +30% on defeat.',
    get desc() { return getLanguage() === 'en' ? this.desc_en : this.desc_ko; },
    unlockXp: 40,
    isUnrevealed: false,
    trigger: ['background_sim'],
    applyEffect: (partner, triggerType, context = {}) => {
      if (triggerType === 'background_sim') {
        return { evModifier: 1.2, varianceMultiplier: 1.3 };
      }
      return null;
    }
  },
  {
    id: TRAIT_ID.WHALE_STACKER,
    name_ko: '무한 자금력',
    name_en: 'Whale Stacker',
    get name() { return getLanguage() === 'en' ? this.name_en : this.name_ko; },
    icon: '🐋',
    category: TRAIT_CATEGORY.PERK,
    type: 'FINANCIAL',
    tier: 'EPIC',
    desc_ko: '바닥나지 않는 자금 압박으로 상대방의 폴드(도망)를 25% 유도하며, 파산 유예 쿨다운이 2배 깁니다.',
    desc_en: 'Induces +25% opponent fold rate via bottomless bankroll pressure.',
    get desc() { return getLanguage() === 'en' ? this.desc_en : this.desc_ko; },
    unlockXp: 110,
    isUnrevealed: false,
    trigger: ['background_sim'],
    applyEffect: (partner, triggerType, context = {}) => {
      if (triggerType === 'background_sim') {
        return { evModifier: 1.25 };
      }
      return null;
    }
  },
  {
    id: TRAIT_ID.QUANT_ANALYST,
    name_ko: '데이터 퀀트',
    name_en: 'Quant Analyst',
    get name() { return getLanguage() === 'en' ? this.name_en : this.name_ko; },
    icon: '📊',
    category: TRAIT_CATEGORY.HYBRID,
    type: 'SKILL',
    tier: 'RARE',
    desc_ko: '감정에 휘둘리지 않아 멘탈 감가가 0%가 되지만, 지루한 플레이 방식 탓에 스타성(Stardom)이 0으로 고정됩니다.',
    desc_en: 'Immune to mental damage (0%), but fixes Stardom to 0 due to robotic play.',
    get desc() { return getLanguage() === 'en' ? this.desc_en : this.desc_ko; },
    unlockXp: 90,
    isUnrevealed: false,
    trigger: ['background_sim', 'stat_calc'],
    applyEffect: (partner, triggerType, context = {}) => {
      if (triggerType === 'stat_calc') {
        return { stardomFixed: 0 };
      }
      if (triggerType === 'background_sim') {
        return { mentalDropMultiplier: 0.0 };
      }
      return null;
    }
  },
  {
    id: TRAIT_ID.CHEATING_SCANDAL,
    name_ko: '치팅 스캔들',
    name_en: 'Cheating Scandal',
    get name() { return getLanguage() === 'en' ? this.name_en : this.name_ko; },
    icon: '🃏',
    category: TRAIT_CATEGORY.FLAW,
    type: 'SPECIAL',
    tier: 'RARE',
    desc_ko: '쇼다운 승률이 +30% 폭등하지만, 5% 확률로 딜러에게 적발되어 세션 상금 전액 몰수 및 빚 +$10,000가 쌓입니다.',
    desc_en: 'Spikes winrate by +30%, but has 5% chance of dealer bust costing all profits + $10k debt.',
    get desc() { return getLanguage() === 'en' ? this.desc_en : this.desc_ko; },
    unlockXp: 70,
    isUnrevealed: false,
    trigger: ['background_sim'],
    applyEffect: (partner, triggerType, context = {}) => {
      if (triggerType === 'background_sim') {
        const isBustedByDealer = Math.random() < 0.05;
        if (isBustedByDealer) {
          return { evModifier: 0.0, lossDebtAddition: 10000 };
        }
        return { evModifier: 1.3 };
      }
      return null;
    }
  },
  {
    id: TRAIT_ID.NEURAL_READER,
    name_ko: '독심술사',
    name_en: 'Neural Reader',
    get name() { return getLanguage() === 'en' ? this.name_en : this.name_ko; },
    icon: '🔮',
    category: TRAIT_CATEGORY.PERK,
    type: 'SKILL',
    tier: 'LEGENDARY',
    desc_ko: '상대방의 카드를 읽어 리버 올인으로 파산할 확률을 70% 방어하며, 대형 팟 승률이 +15% 증가합니다.',
    desc_en: 'Reads opponent hands, mitigating river bust risk by 70% and boosting big-pot winrate by +15%.',
    get desc() { return getLanguage() === 'en' ? this.desc_en : this.desc_ko; },
    unlockXp: 180,
    isUnrevealed: false,
    trigger: ['background_sim'],
    applyEffect: (partner, triggerType, context = {}) => {
      if (triggerType === 'background_sim') {
        return { evModifier: 1.15, tiltLossMitigation: 0.7 };
      }
      return null;
    }
  },
  {
    id: TRAIT_ID.IRON_NIT,
    name_ko: '바위 니트',
    name_en: 'Iron Nit',
    get name() { return getLanguage() === 'en' ? this.name_en : this.name_ko; },
    icon: '🪨',
    category: TRAIT_CATEGORY.HYBRID,
    type: 'MENTAL',
    tier: 'COMMON',
    desc_ko: '확실한 프리미엄 핸드만 참여하여 세션 손실률이 0%에 수렴하지만, 참전 핸드 진행 속도가 -50% 느립니다.',
    desc_en: 'Reduces session loss rate to ~0% by playing ultra-tight, but slows hand rate by -50%.',
    get desc() { return getLanguage() === 'en' ? this.desc_en : this.desc_ko; },
    unlockXp: 30,
    isUnrevealed: false,
    trigger: ['background_sim'],
    applyEffect: (partner, triggerType, context = {}) => {
      if (triggerType === 'background_sim') {
        return { evModifier: 1.05, varianceMultiplier: 0.3 };
      }
      return null;
    }
  },

  // --- Tier 2: 조건부 승폭형 ---
  {
    id: TRAIT_ID.FISH_HUNTER,
    name_ko: '피쉬 사냥꾼',
    name_en: 'Fish Hunter',
    get name() { return getLanguage() === 'en' ? this.name_en : this.name_ko; },
    icon: '🎣',
    category: TRAIT_CATEGORY.PERK,
    type: 'SKILL',
    tier: 'COMMON',
    desc_ko: '하위 등급(C/D/F급) 상대 필드 출전 시 백그라운드 세션 수익성이 2배 상승합니다.',
    desc_en: 'Doubles profitability in background sessions against low-tier field tables.',
    get desc() { return getLanguage() === 'en' ? this.desc_en : this.desc_ko; },
    unlockXp: 40,
    isUnrevealed: false,
    trigger: ['background_sim'],
    applyEffect: (partner, triggerType, context = {}) => {
      if (triggerType === 'background_sim' && context.isFishField) {
        return { evModifier: 2.0 };
      }
      return null;
    }
  },
  {
    id: TRAIT_ID.BIG_GAME_HUNTER,
    name_ko: '승부사',
    name_en: 'Big Game Hunter',
    get name() { return getLanguage() === 'en' ? this.name_en : this.name_ko; },
    icon: '🏆',
    category: TRAIT_CATEGORY.PERK,
    type: 'GUTS',
    tier: 'RARE',
    desc_ko: '배짱(Guts) 수치가 +15 증가하고, 대형 판(빅팟) 승리 시 획득 상금이 +20% 늘어납니다.',
    desc_en: 'Grants +15 Guts and boosts big-pot win profits by +20%.',
    get desc() { return getLanguage() === 'en' ? this.desc_en : this.desc_ko; },
    unlockXp: 90,
    isUnrevealed: false,
    trigger: ['background_sim', 'stat_calc'],
    applyEffect: (partner, triggerType, context = {}) => {
      if (triggerType === 'stat_calc') {
        return { gutsBonus: 15 };
      }
      if (triggerType === 'background_sim') {
        return { evModifier: 1.20 };
      }
      return null;
    }
  },

  // --- Tier 3: 에이전시 경영 규칙 변형형 ---
  {
    id: TRAIT_ID.FAMOUS_STREAMER,
    name_ko: '유명 스트리머',
    name_en: 'Famous Streamer',
    get name() { return getLanguage() === 'en' ? this.name_en : this.name_ko; },
    icon: '🎥',
    category: TRAIT_CATEGORY.HYBRID,
    type: 'STARDOM',
    tier: 'RARE',
    desc_ko: '스타성(Stardom)이 +25 증가하고 다크웹 후원 수입이 3배가 되지만, 카지노 수수료가 +50% 커집니다.',
    desc_en: 'Grants +25 Stardom and 3x darkweb tips, but increases casino rake by +50%.',
    get desc() { return getLanguage() === 'en' ? this.desc_en : this.desc_ko; },
    unlockXp: 60,
    isUnrevealed: false,
    trigger: ['background_sim', 'stardom_income', 'stat_calc'],
    applyEffect: (partner, triggerType, context = {}) => {
      if (triggerType === 'stat_calc') {
        return { stardomBonus: 25 };
      }
      if (triggerType === 'stardom_income') {
        return { donationMultiplier: 3.0 };
      }
      if (triggerType === 'background_sim') {
        return { rakeFeeMultiplier: 1.5 };
      }
      return null;
    }
  },
  {
    id: TRAIT_ID.LOYAL_GUARANTOR,
    name_ko: '충성 보증인',
    name_en: 'Loyal Guarantor',
    get name() { return getLanguage() === 'en' ? this.name_en : this.name_ko; },
    icon: '🤝',
    category: TRAIT_CATEGORY.PERK,
    type: 'LOYALTY',
    tier: 'EPIC',
    desc_ko: '에이전시 충성도가 항상 100%로 고정되어 절대 재계약을 거부하거나 야반도주하지 않습니다.',
    desc_en: 'Fixes agency loyalty to 100%, preventing renewal refusal or flight.',
    get desc() { return getLanguage() === 'en' ? this.desc_en : this.desc_ko; },
    unlockXp: 120,
    isUnrevealed: false,
    trigger: ['background_sim', 'loyalty_calc'],
    applyEffect: (partner, triggerType, context = {}) => {
      if (triggerType === 'loyalty_calc') {
        return { fixedLoyalty: 100, preventFlight: true };
      }
      return null;
    }
  },

  // --- Tier 4: 이벤트/시스템 파괴형 유니크 기믹 ---
  {
    id: TRAIT_ID.PHOENIX_PROTOCOL,
    name_ko: '파산 불사조',
    name_en: 'Phoenix Protocol',
    get name() { return getLanguage() === 'en' ? this.name_en : this.name_ko; },
    icon: '🔥',
    category: TRAIT_CATEGORY.PERK,
    type: 'SPECIAL',
    tier: 'LEGENDARY',
    desc_ko: '보유 뱅크롤이 $0(파산)에 도달했을 때, 1회에 한해 파산을 무효화하고 $10,000를 즉시 무료 복구합니다.',
    desc_en: 'On reaching $0 bankroll, negates bankruptcy once and restores $10,000.',
    get desc() { return getLanguage() === 'en' ? this.desc_en : this.desc_ko; },
    unlockXp: 200,
    isUnrevealed: false,
    trigger: ['on_bust_check'],
    applyEffect: (partner, triggerType, context = {}) => {
      if (triggerType === 'on_bust_check' && !partner.phoenixUsed) {
        partner.phoenixUsed = true;
        partner.bankroll = 10000;
        return { preventBust: true, restoredAmount: 10000 };
      }
      return null;
    }
  },
  {
    id: TRAIT_ID.SABOTEUR,
    name_ko: '사보타주 마스터',
    name_en: 'Saboteur',
    get name() { return getLanguage() === 'en' ? this.name_en : this.name_ko; },
    icon: '🗡️',
    category: TRAIT_CATEGORY.HYBRID,
    type: 'SPECIAL',
    tier: 'EPIC',
    desc_ko: '동일 카지노 출전 시 타 경쟁 에이전시 선수의 멘탈을 틱당 -10 감가시켜 파산을 유도합니다.',
    desc_en: 'Deducts -10 mental per tick from rival agency players in the same casino.',
    get desc() { return getLanguage() === 'en' ? this.desc_en : this.desc_ko; },
    unlockXp: 160,
    isUnrevealed: false,
    trigger: ['background_sim'],
    applyEffect: (partner, triggerType, context = {}) => {
      if (triggerType === 'background_sim') {
        return { rivalMentalSabotage: 10 };
      }
      return null;
    }
  },
  {
    id: TRAIT_ID.GLASS_MENTAL,
    name_ko: '유리멘탈',
    name_en: 'Glass Mental',
    get name() { return getLanguage() === 'en' ? this.name_en : this.name_ko; },
    icon: '💔',
    category: TRAIT_CATEGORY.FLAW,
    type: 'MENTAL',
    tier: 'COMMON',
    desc_ko: '멘탈(Mental) 수치가 -15 감가되며, 경기 패배 시 멘탈 상처를 2배로 크게 받습니다.',
    desc_en: 'Deducts -15 Mental and doubles mental damage on game losses.',
    get desc() { return getLanguage() === 'en' ? this.desc_en : this.desc_ko; },
    unlockXp: 30,
    isUnrevealed: false,
    trigger: ['background_sim', 'stat_calc'],
    applyEffect: (partner, triggerType, context = {}) => {
      if (triggerType === 'stat_calc') {
        return { mentalPenalty: 15 };
      }
      if (triggerType === 'background_sim') {
        return { varianceMultiplier: 1.8, mentalDropMultiplier: 2.0 };
      }
      return null;
    }
  },
  {
    id: TRAIT_ID.DIRT_POOR,
    name_ko: '흙수저',
    name_en: 'Dirt Poor',
    get name() { return getLanguage() === 'en' ? this.name_en : this.name_ko; },
    icon: '🛖',
    category: TRAIT_CATEGORY.FLAW,
    type: 'FINANCIAL',
    tier: 'COMMON',
    desc_ko: '시작 보유 뱅크롤이 -50% 차감된 상태로 시작하지만, 에이전시 충성도가 2배 빠르게 오릅니다.',
    desc_en: 'Starts with -50% initial bankroll, but gains agency loyalty 2x faster.',
    get desc() { return getLanguage() === 'en' ? this.desc_en : this.desc_ko; },
    unlockXp: 0,
    isUnrevealed: false,
    trigger: ['background_sim'],
    applyEffect: (partner, triggerType, context = {}) => {
      if (triggerType === 'background_sim') {
        return { flatDeduction: 100, loyaltyMultiplier: 2.0 };
      }
      return null;
    }
  }
];

/**
 * 특정 특성 아이디로 특성 데이터 객체를 조회합니다.
 */
export const getTrait = (traitId) => {
  return TRAIT_DATA.find((t) => t.id === traitId) || null;
};

/**
 * 모든 특성 목록을 반환합니다. 카테고리 필터링 지원.
 */
export const getAllTraits = (categoryFilter = null) => {
  if (!categoryFilter) return TRAIT_DATA;
  return TRAIT_DATA.filter((t) => t.category === categoryFilter);
};

/**
 * 백그라운드 가상 수익 시뮬레이션(Mode A: Fast Math Engine)용 일괄 특성 보정 수식 계산기
 */
export const calculateBackgroundSimTraitModifiers = (partner, context = {}) => {
  const summary = {
    evModifier: 1.0,
    varianceMultiplier: 1.0,
    xpMultiplier: 1.0,
    flatDeduction: 0,
    tiltLossMitigation: 0,
    loyaltyMultiplier: 1.0,
    mentalDropMultiplier: 1.0,
    rakeFeeMultiplier: 1.0,
    lossDebtAddition: 0,
    skillBonus: 0,
    gutsBonus: 0,
    stardomBonus: 0,
    mentalPenalty: 0,
    preventBust: false,
    rivalMentalSabotage: 0,
    maxCapBonus: 0,
    maxCapDeduction: 0,
  };

  if (!partner || !Array.isArray(partner.traits)) return summary;

  partner.traits.forEach((traitItem) => {
    if (traitItem.isUnrevealed) return; // 미발현 (???) 예외 처리

    const traitDef = getTrait(traitItem.id);
    if (!traitDef || typeof traitDef.applyEffect !== 'function') return;

    // 1. max_ovr_cap 보정
    const capRes = traitDef.applyEffect(partner, 'max_ovr_cap', context);
    if (capRes) {
      if (capRes.capBonus) summary.maxCapBonus += capRes.capBonus;
      if (capRes.capDeduction) summary.maxCapDeduction += capRes.capDeduction;
    }

    // 2. stat_calc 수치 보정
    const statRes = traitDef.applyEffect(partner, 'stat_calc', context);
    if (statRes) {
      if (statRes.skillBonus) summary.skillBonus += statRes.skillBonus;
      if (statRes.gutsBonus) summary.gutsBonus += statRes.gutsBonus;
      if (statRes.stardomBonus) summary.stardomBonus += statRes.stardomBonus;
      if (statRes.mentalPenalty) summary.mentalPenalty += statRes.mentalPenalty;
    }

    // 3. background_sim 시뮬레이션 보정
    if (traitDef.trigger.includes('background_sim')) {
      const simRes = traitDef.applyEffect(partner, 'background_sim', context);
      if (simRes) {
        if (simRes.evModifier) summary.evModifier *= simRes.evModifier;
        if (simRes.varianceMultiplier) summary.varianceMultiplier *= simRes.varianceMultiplier;
        if (simRes.xpMultiplier) summary.xpMultiplier *= simRes.xpMultiplier;
        if (simRes.flatDeduction) summary.flatDeduction += simRes.flatDeduction;
        if (simRes.tiltLossMitigation) summary.tiltLossMitigation = Math.max(summary.tiltLossMitigation, simRes.tiltLossMitigation);
        if (simRes.loyaltyMultiplier) summary.loyaltyMultiplier *= simRes.loyaltyMultiplier;
        if (simRes.mentalDropMultiplier) summary.mentalDropMultiplier *= simRes.mentalDropMultiplier;
        if (simRes.rakeFeeMultiplier) summary.rakeFeeMultiplier *= simRes.rakeFeeMultiplier;
        if (simRes.lossDebtAddition) summary.lossDebtAddition += simRes.lossDebtAddition;
        if (simRes.rivalMentalSabotage) summary.rivalMentalSabotage += simRes.rivalMentalSabotage;
      }
    }
  });

  return summary;
};

/**
 * 파트너의 traits 배열을 데이터 객체로 하이드레이션합니다.
 */
export const hydratePartnerTraits = (partner) => {
  if (!partner || !Array.isArray(partner.traits)) return;

  partner.traits = partner.traits.map((t) => {
    const id = typeof t === 'string' ? t : t.id;
    const traitDef = getTrait(id);
    if (!traitDef) return typeof t === 'object' ? t : { id };

    return {
      id: traitDef.id,
      name: traitDef.name,
      icon: traitDef.icon,
      category: traitDef.category,
      type: traitDef.type,
      tier: traitDef.tier,
      desc: traitDef.desc,
      unlockXp: traitDef.unlockXp,
      isUnrevealed: t.isUnrevealed ?? traitDef.isUnrevealed,
      currentXp: t.currentXp || 0
    };
  });
};
