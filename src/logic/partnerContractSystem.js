import { store } from "./store.js";
export const CONTRACT_TYPE = {
  SHARE_BENEFIT: 'SHARE_BENEFIT', // your win and lose net share
  BANKRUPT_RESCUE: 'BANKRUPT_RESCUE', // rescue bankrupt each other
  A_DATE_WITH_YOU: 'A_DATE_WITH_YOU', // a date with you
  COLLUSION: 'COLLUSION', // with you gambling then session end share net worth
}
export const CONTRACT_REQUIRED_RELATIONSHIP = {
  [CONTRACT_TYPE.SHARE_BENEFIT]: 600,
  [CONTRACT_TYPE.BANKRUPT_RESCUE]: 800,
  [CONTRACT_TYPE.A_DATE_WITH_YOU]: 1000,
  [CONTRACT_TYPE.COLLUSION]: 0 // for TEST
}
export const CONTRACT_BREAK_RELATIONSHIP = {
  [CONTRACT_TYPE.SHARE_BENEFIT]: 300,
  [CONTRACT_TYPE.BANKRUPT_RESCUE]: 500,
  [CONTRACT_TYPE.A_DATE_WITH_YOU]: 700,
  [CONTRACT_TYPE.COLLUSION]: 800 // for TEST
}
export const CONTRACT_TYPE_DESC = {
  [CONTRACT_TYPE.COLLUSION]: {
    desc_ko: '파트너와 사전에 수익을 나누기로 협의하고 같은 테이블에 참여합니다',
    desc_en: 'Now when you join the table, the partner will also participate.',
    get desc() {
      return store.language === 'ko' ? this.desc_ko : this.desc_en;
    },
    note_ko: '이 행위는 불법으로, 적발될 가능성이 있습니다. 적발시 가진 모든 바이인이 몰수됩니다.',
    note_en: 'This action is illegal and may be detected. If caught, all your buy-ins will be confiscated.',
    get note() {
      return store.language === 'ko' ? this.note_ko : this.note_en;
    }
  },
  [CONTRACT_TYPE.SHARE_BENEFIT]: {
    desc_ko: '파트너와 이익 공유 계약을 체결합니다. 이제 파트너와 플레이어가 게임을 통해 창출한 수익을 정산하며, 계약된 분배율에 따라 상호 이익을 나눕니다',
    desc_en: 'Upon entering this contract, all game profits will be settled and distributed according to the agreed-upon split.',
    get require() {
      return partner.relationship >= 600;
    },
    get desc() {
      return store.language === 'ko' ? this.desc_ko : this.desc_en;
    },
    note_kr: '수익 기여율 차이가 불균형하면, 관계가 변화할 수 있습니다. 이 계약은 동시에 1명의 파트너와만 맺을 수 있습니다.',
    note_en: 'Disparities in profit contribution may impact your relationship. You can only maintain one active partnership contract at a time',
    get note() {
      return store.language === 'ko' ? this.note_kr : this.note_en;
    }
  },
  [CONTRACT_TYPE.BANKRUPT_RESCUE]: {
    desc_ko: '한쪽이 파산할 경우, 보유 뱅크롤의 30%를 긴급 지원합니다. (해당 계약은 한쪽이 파산하면 자동으로 해제됩니다.)',
    desc_en: 'If either party goes bankrupt, 30% of the active bankroll will be provided as emergency funds. (Contract terminates automatically upon either party\'s bankruptcy.)',
    get desc() {
      return store.language === 'ko' ? this.desc_ko : this.desc_en;
    },
    note_kr: '만약 당신이 파산한 상태에서 파트너에게 7일 안에 빚을 갚지 못하면 일반 채무상태로 넘어가게 됩니다.',
    note_en: 'If you remain bankrupt and fail to settle your debt within 7 days, you will enter a state of general debt.',
    get note() {
      return store.language === 'ko' ? this.note_kr : this.note_en;
    }
  },
  [CONTRACT_TYPE.A_DATE_WITH_YOU]: {
    desc_ko: '파트너와 사적으로 만나는 사이가 됩니다.',
    desc_en: 'You and your partner will start seeing each other privately.',
    get desc() {
      return store.language === 'ko' ? this.desc_ko : this.desc_en;
    },
    note_kr: '데이트 관계시 관계가 상승할 수 있으나, 반대로 하락할 수도 있습니다.',
    note_en: 'The relationship may increase when dating, but it may also decrease.',
    get note() {
      return store.language === 'ko' ? this.note_kr : this.note_en;
    }
  },
};

export const Contract = (type = CONTRACT_TYPE.NOTHING) => {
  return {
    type,
    cooldown: 0,
    active: false,
    requiredRelationship: CONTRACT_REQUIRED_RELATIONSHIP[type] || 999999,
    relationshipToBreak: CONTRACT_BREAK_RELATIONSHIP[type] || 999999,
  }
}
export const ContractCollusion = (ratio = 0.5) => { return { ratio, profitTotal: 0, ...Contract(CONTRACT_TYPE.COLLUSION) } }
export const ContractBankruptRescue = (ratio = 0.3) => { return { ratio, activeRepaymentPeriod: false, debtRepaymentDue: 0, initDebtRepaymentDue: 24 * 7, debt: 0, ...Contract(CONTRACT_TYPE.BANKRUPT_RESCUE) } }
export const ContractShareBenefit = (ratio = 0.5) => { return { ratio, profitTotal: 0, ...Contract(CONTRACT_TYPE.SHARE_BENEFIT) } }
export const ContractADateWithYou = () => { return { ...Contract(CONTRACT_TYPE.A_DATE_WITH_YOU) } }