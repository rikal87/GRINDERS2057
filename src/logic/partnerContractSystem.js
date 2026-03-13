import { getPartners, gainPartnerBankroll, gainRelationship } from "./partnerSystem.js";
import { store, gainBankroll, getCurrentBankroll, getGameTime } from "./store.js";
import { audioManager } from "./audioManager";
import { scheduleEvent, EVENT_ID } from "./eventSystem";
import { CONTRACT_TYPE, TYPE_CHANGE_BANKROLL, PARTNER_ID } from "./constants.js";
export const CONTRACT_SIGN_PREVENT_REASON = {
  BENEFIT_SHARE_MAX_COUNT: 'BENEFIT_SHARE_MAX_COUNT',
  RELATIONSHIP: 'RELATIONSHIP',
  ACTIVE: 'ACTIVE',
  COOLDOWN: 'COOLDOWN',
  NONE: 'NONE'
}
export const CONTRACT_SIGN_PREVENT_REASON_DESC = {
  BENEFIT_SHARE_MAX_COUNT: {
    ko: '[이익 공유]는 동시에 하나의 계약만 가능합니다.',
    en: 'You can only sign one [Benefit Share] contract at a time.'
  },
  RELATIONSHIP: {
    ko: `파트너와의 관계가 너무 낮아 계약을 체결할 수 없습니다.`,
    en: `Relationship is too low to sign the contract.`
  },
  ACTIVE: {
    ko: '이미 계약중입니다.',
    en: 'Contract is already active.'
  },
  COOLDOWN: {
    ko: '계약이 종료된지 얼마 되지 않아 계약을 체결할 수 없습니다.',
    en: 'Contract is too new to sign the contract.'
  },
  NONE: {
    ko: '계약 가능',
    en: 'Contract Ready'
  }
}
export const CONTRACT_REQUIRED_RELATIONSHIP = {
  [CONTRACT_TYPE.BENEFIT_SHARE]: 300,
  [CONTRACT_TYPE.BAILOUT]: 100,
  [CONTRACT_TYPE.A_DATE_WITH_YOU]: 800,
  [CONTRACT_TYPE.COLLUSION]: 800,
  [CONTRACT_TYPE.STAKING]: 1000,
}
export const CONTRACT_BREAK_RELATIONSHIP = {
  [CONTRACT_TYPE.BENEFIT_SHARE]: 250,
  [CONTRACT_TYPE.BAILOUT]: 300,
  [CONTRACT_TYPE.A_DATE_WITH_YOU]: 400,
  [CONTRACT_TYPE.COLLUSION]: 400,
  [CONTRACT_TYPE.STAKING]: 500,
}

export const CONTRACT_TYPE_DESC_FIELD = {
  DESC: 'desc',
  NOTE: 'note'
}
export const CONTRACT_TYPE_DESC = {
  [CONTRACT_TYPE.COLLUSION]: {
    desc_ko: '파트너와 사전에 계약된 비율로 수익을 나누기로 협의하고 같은 테이블에서 플레이합니다',
    desc_en: 'You and your partner will share the profits according to the agreed-upon ratio. You can play together at the same table.',
    note_ko: '이 행위는 불법으로, 적발될 가능성이 있습니다. 적발시 가진 모든 바이인이 몰수됩니다.',
    note_en: 'This action is illegal and may be detected. If caught, all your buy-ins will be confiscated.',
  },
  [CONTRACT_TYPE.BENEFIT_SHARE]: {
    desc_ko: '이제 파트너와 플레이어가 게임을 통해 창출한 수익을 정산하며, 계약된 분배율에 따라 상호 이익을 나눕니다',
    desc_en: 'All game profits will be settled and distributed according to the agreed-upon split.',
    note_ko: '수익 기여율 차이가 불균형하면 관계가 변화할 수 있습니다.\n(동시에 1명의 파트너와만 맺을 수 있습니다.)',
    note_en: 'Disparities in profit contribution\nmay impact your relationship.\n(Only one contract can be active at a time.)',
  },
  [CONTRACT_TYPE.BAILOUT]: {
    desc_ko: '한쪽이 파산할 경우, 보유 뱅크롤의 30%를 긴급 지원합니다.',
    desc_en: 'If either party goes bankrupt, 30% of the active bankroll will be provided as emergency funds.',
    note_ko: '본 계약으로 발생한 채무는 7일간의 유예 기간을 거친 후 일반 채무로 전환됩니다.',
    note_en: 'Debts incurred under this contract will be converted into general liabilities after a 7-day grace period.',
  },
  [CONTRACT_TYPE.A_DATE_WITH_YOU]: {
    desc_ko: '파트너와 개인적으로 만나는 사이가 됩니다.',
    desc_en: 'You and your partner will start seeing each other in private.',
    note_ko: '데이트 관계시 관계가 상승할 수 있으나, 반대로 하락할 수도 있습니다.',
    note_en: 'The relationship may increase when dating, but it may also decrease.',
  },
  [CONTRACT_TYPE.STAKING]: {
    desc_ko: '파트너가 당신에게 주기적으로 하이스테이크 게임을 주선합니다, 파트너가 판돈 전액을 지원하는 대신, 세션 종료 후 발생한 모든 수익은 사전에 약정된 비율에 따라 엄격하게 분배됩니다',
    desc_en: 'The partner leverages their capital to grant you access to exclusive high-stakes tables, providing 100% of the buy-in. Upon the conclusion of the session, all realized profits are divided according to the pre-negotiated equity split.',
    note_ko: '지속적인 손실이나 기대치 하락은 파트너의 신뢰를 잃게 만들며, 관계도에 치명적인 악영향을 미칩니다. 자산가의 인내심에는 한계가 있음을 명심하십시오.',
    note_en: "Negative returns or sub-par performance will severely damage your rapport with the partner. Remember: in this city, a backer's patience is only as deep as their last profit.",
  },
};
export const Contract = (type = CONTRACT_TYPE.NOTHING) => {
  return {
    type,
    cooldown: 0,
    initCooldown: 24 * 3,
    active: false,
    requiredRelationship: CONTRACT_REQUIRED_RELATIONSHIP[type] || 0,
    relationshipToBreak: CONTRACT_BREAK_RELATIONSHIP[type] || 0,
  }
}
export const ContractCollusion = (ratio = 0.5) => { return { ratio, profitTotal: 0, profitTotalLatest: 0, ...Contract(CONTRACT_TYPE.COLLUSION) } }
export const ContractBailout = (ratio = 0.3) => { return { ratio, activeRepaymentPeriod: false, debtRepaymentDue: 0, initDebtRepaymentDue: 24 * 7, debt: 0, ...Contract(CONTRACT_TYPE.BAILOUT) } }
export const ContractBenefitShare = (ratio = 0.5) => { return { ratio, profitTotal: 0, profitTotalLatest: 0, ...Contract(CONTRACT_TYPE.BENEFIT_SHARE) } }
export const ContractADateWithYou = () => { return { ...Contract(CONTRACT_TYPE.A_DATE_WITH_YOU) } }

export const signContract = (partnerId, type, ratio = 0.5) => {
  const partner = store.partners.find((p) => p.id === partnerId);
  if (!partner) return false;
  if (type === CONTRACT_TYPE.BENEFIT_SHARE) {
    const contractCount = getPartners().filter(p => p.contracts.find(c => c.type === CONTRACT_TYPE.BENEFIT_SHARE && c.active)).length > 0
    if (contractCount > 1) {
      audioManager.playSFX('error');
      return false;
    }
  }
  let contract = partner.contracts.find((c) => c.type === type);
  if (!contract) return false;
  console.info('contract', contract)

  if (!contract.active) {
    const eventId = EVENT_ID[partner.id.toUpperCase()]['SIGN_CONTRACT_' + type.toUpperCase()];
    if (eventId) scheduleEvent(eventId, 1 + (2 * Math.random()));
  }
  console.info('signContract', partnerId, type, ratio);
  contract.active = true;
  contract.ratio = ratio;
  contract.cooldown = contract.initCooldown;
  // contract.initCooldown = ;
  return true;
}
export const breakContract = (partnerId, type) => {
  const partner = store.partners.find((p) => p.id === partnerId);
  if (!partner) return false;
  const contract = partner.contracts.find((c) => c.type === type);
  if (!contract || !contract.active) return false;
  contract.active = false;
  contract.profitTotal = 0; // reset profit total
  contract.cooldown = contract.initCooldown;
  return true;
}
export const createContractObject = (type, ratio) => {
  if (type === CONTRACT_TYPE.BENEFIT_SHARE) return ContractBenefitShare(ratio ?? 0.5);
  if (type === CONTRACT_TYPE.BAILOUT) return ContractBailout(ratio ?? 0.3);
  if (type === CONTRACT_TYPE.A_DATE_WITH_YOU) return ContractADateWithYou();
  if (type === CONTRACT_TYPE.COLLUSION) return ContractCollusion(ratio ?? 0.5);
  return Contract(type);
};
export const shareCollusion = (partnerId = null, yourNetWinnings = 0, partnerNetWinnings = 0) => {
  const partner = getPartners().find(p => p.id === partnerId && p.isJoined);
  if (!partner) return 0;
  if (yourNetWinnings < 0) yourNetWinnings = 0;
  if (partnerNetWinnings < 0) partnerNetWinnings = 0;
  let diffShare = 0
  if (partner) {
    const contract = partner.contracts.find(c => c.type === CONTRACT_TYPE.COLLUSION && c.active);
    console.info('shareCollusion', partner, contract)
    if (!contract) return 0;
    const yourShare = partnerNetWinnings * contract.ratio;
    const partnerShare = yourNetWinnings * contract.ratio;
    diffShare = Math.floor(partnerShare - yourShare); // if +: partner gain, if -: you gain
    gainBankroll(yourShare, TYPE_CHANGE_BANKROLL.COLLUSION);
    gainPartnerBankroll(partner, partnerShare, TYPE_CHANGE_BANKROLL.COLLUSION);
    contract.profitTotal += diffShare;
  };
  return diffShare;
}
export const shareBenefitForPartners = (amount = 0) => {
  const targetPartners = getPartners().filter(p => p.isJoined);
  let sum = 0
  if (amount < 0) return sum;
  targetPartners.forEach((partner) => {
    partner.contracts.forEach((contract) => {
      if (contract.type === CONTRACT_TYPE.BENEFIT_SHARE && contract.active) {
        const finalAmount = Math.floor(amount * contract.ratio);
        sum += shareBenefit(partner, finalAmount, contract, false)
      }
    });
  });
  return sum;
}
export const shareBenefit = (partner = null, amount = 0, contract = null, toPlayer = true) => {
  if (!partner || !contract) return 0;
  const finalAmount = Math.floor(amount * contract.ratio * (toPlayer ? -1 : 1));
  gainPartnerBankroll(partner, finalAmount, TYPE_CHANGE_BANKROLL.PARTNER_BENEFIT);
  gainBankroll(-finalAmount, TYPE_CHANGE_BANKROLL.PARTNER_BENEFIT);
  contract.profitTotal += finalAmount;
  console.log(`${partner.id} PARTNER_BENEFIT: ${finalAmount}`);
  partner.netWorthHistory.push({ time: getGameTime(), netWorth: partner.bankroll + finalAmount });
  return finalAmount;
}
export const requestBailout = (partner = null) => {
  if (!partner) return false;
  const getEvent = EVENT_ID[partner.id.toUpperCase()].BANKRUPT
  if (getEvent) {
    console.info('requestBailout', partner.id, getEvent)
    scheduleEvent(getEvent, 2);
    return true;
  }
  return false;
}
export const triggerDebtRepaymentDue = (partner = null, contract = null) => {
  if (contract.debtRepaymentDue > 0) contract.debtRepaymentDue--
  else {
    partner.debt += contract.debt;
    contract.activeRepaymentPeriod = false;
  }
}
// BANKRUPTCY_RELIEF
// BankruptcyRelief
export const triggerBankruptcyRelief = (partner = null, ratio = 0.3, contract = null, toPlayer = false) => {
  if (!contract || !partner) return false;
  if (contract.active) {
    ratio = contract.ratio;
    contract.debtRepaymentDue = contract.initDebtRepaymentDue
    contract.activeRepaymentPeriod = true;
  }
  const whosBankroll = toPlayer ? partner.bankroll : getCurrentBankroll();
  const amount = Math.floor(whosBankroll * ratio * (toPlayer ? 1 : -1));
  contract.debt = toPlayer ? -amount : amount
  gainBankroll(amount, TYPE_CHANGE_BANKROLL.DEBT_REPAYMENT);
  gainPartnerBankroll(partner, -amount, TYPE_CHANGE_BANKROLL.CONTRACT);
  console.info('partner', partner)
  audioManager.playSFX('ATM');
  if (!toPlayer) {
    const getEvent = EVENT_ID[partner.id.toUpperCase()]['BANKRUPT_ACCEPT_RESCUE' + (partner.relationship < 200 ? '_LOW_RELATIONSHIPSHIP' : '')]
    if (getEvent) {
      scheduleEvent(getEvent, 15, partner);
    }
    scheduleEvent(EVENT_ID.SYSTEM_PLAYER_BAILOUT_FOR_PARTNER, 2, { partnerName: partner.fullName, amount })
  } else {
    // EVENT_ID.MAX.BAILOUT_FOR_PLAYER is only for Max
    if (partner.id === PARTNER_ID.MAX) {
      scheduleEvent(EVENT_ID.MAX.BAILOUT_FOR_PLAYER, 15);
    }
    scheduleEvent(EVENT_ID.SYSTEM_PARTNER_BAILOUT_FOR_PLAYER, 2, { partnerName: partner.fullName, amount })
  }
  return true;
}