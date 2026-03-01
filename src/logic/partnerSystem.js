import { CLASSES_PARTNER } from "./persona";
import { store, gainBankroll, TYPE_CHANGE_BANKROLL } from "./store";
import { scheduleEvent, EVENT_ID } from "./eventSystem";
import { audioManager } from "./audioManager";

export const getPartner = (partnerId = null) => {
  if (!partnerId) return null;
  const partner = store.partners.find(p => p.id === partnerId);
  return partner;
}
export const createContractObject = (type, ratio) => {
  if (type === CONTRACT_TYPE.SHARE_BENEFIT) return ContractShareBenefit(ratio ?? 0.5);
  if (type === CONTRACT_TYPE.BANKRUPT_RESCUE) return ContractBankruptRescue(ratio ?? 0.3);
  if (type === CONTRACT_TYPE.A_DATE_WITH_YOU) return ContractADateWithYou();
  if (type === CONTRACT_TYPE.COLLUSION) return ContractCollusion(ratio ?? 0.5);
  return Contract(type);
};

export const hydratePartners = () => {
  store.partners.forEach(existingPartner => {
    // 1. Restore missing properties on saved contracts
    if (Array.isArray(existingPartner.contracts)) {
      existingPartner.contracts = existingPartner.contracts.map(c => {
        const defaultContract = createContractObject(c.type, c.ratio);
        return { ...defaultContract, ...c };
      });
    } else {
      existingPartner.contracts = [];
    }

    // 2. Add any missing contracts based on CLASSES_PARTNER base data
    const canContracts = CLASSES_PARTNER.find((p) => p.id === existingPartner.id)?.canContracts || [];
    canContracts.forEach((contractType) => {
      if (!existingPartner.contracts.some((c) => c.type === contractType)) {
        existingPartner.contracts.push(createContractObject(contractType));
      }
    });

    // 3. Optional: Restore any missing fields from base data (version compatibility)
    const baseData = CLASSES_PARTNER.find((p) => p.id === existingPartner.id);
    if (baseData) {
      Object.keys(baseData).forEach(key => {
        if (existingPartner[key] === undefined && key !== 'initialBankroll' && key !== 'initialRelationship' && key !== 'canContracts') {
          existingPartner[key] = baseData[key];
        }
      });
    }
  });
};
export const getRelationship = (partnerId = null) => {
  if (!partnerId) return null;
  const partner = store.partners.find((p) => p.id === partnerId);
  if (!partner) return null;
  return partner.relationship;
}
export const registerPartner = (partnerId = null) => {
  if (!partnerId) return;
  store.partners.push(generatePartner(partnerId));
}
export const unregisterPartner = (partnerId = null) => {
  if (!partnerId) return;
  const partner = store.partners.find((p) => p.id === partnerId);
  if (partner) partnerScheduleEvent(EVENT_ID[partnerId.toUpperCase()]['GONE'], 2, partner, true);
  store.partners = store.partners.filter((p) => p.id !== partnerId);
}
export const gainPartnersRelationshipOliveBranch = () => {
  store.partners.forEach((partner) => {
    if (partner.relationship <= 250) gainRelationship(partner.id, Math.ceil(Math.random() * 200 + 50));
  });
}
export const gainRelationship = (partnerId = null, amount = 0) => {
  if (Number.isNaN(amount)) return false;
  if (!partnerId) return false;
  const partner = store.partners.find((p) => p.id === partnerId);
  if (!partner) return false;
  partner.relationship = Math.max(0, Math.min(1000, partner.relationship + Math.ceil(amount)));
  return true;
}
export const gainPartnerBankroll = (partner = null, amount = 0, type = TYPE_CHANGE_BANKROLL.OTHER) => {
  if (Number.isNaN(amount)) return false;
  if (!partner) return false;
  const finalAmount = Math.round(Math.max(0, partner.bankroll + amount));
  partner.bankroll = finalAmount;
  if (type === TYPE_CHANGE_BANKROLL.PARTNER_BENEFIT) partner.netShareTotal += finalAmount;
  // else if (type === TYPE_CHANGE_BANKROLL.DEBT_REPAYMENT) partner.debt -= amount;  // if amount > 0, it means player's debt for partner
  return true;
}
export const debtRepayment = (partner = null, amount = 0, toPlayer = true, contract = null) => {
  if (!partner || amount <= 0) return false;
  if (partner.id !== PARTNER_ID.MAX) {
    console.warn('!!!!!!!! Only for Max can repay debt !!!!!!!!')
    return false;
  }
  // toPlayer=true: Partner pays Player (partner owes player => partner.debt < 0)
  // toPlayer=false: Player pays Partner (player owes partner => partner.debt > 0)
  const direction = toPlayer ? -1 : 1;
  const debt = contract ? contract.debt : partner.debt;
  const oweAmount = (debt * direction > 0) ? debt * direction : 0;
  const actualAmount = Math.min(oweAmount, amount);
  if (actualAmount > 0) {
    gainPartnerBankroll(partner, actualAmount * direction, TYPE_CHANGE_BANKROLL.DEBT_REPAYMENT);
    gainBankroll(actualAmount * -direction, TYPE_CHANGE_BANKROLL.DEBT_REPAYMENT);
    partner.netWorthHistory.push({ time: store.gameTime, netWorth: partner.bankroll });
    if (contract && contract.type === CONTRACT_TYPE.BANKRUPT_RESCUE && contract.activeRepaymentPeriod) {
      contract.debt -= actualAmount;
      if (contract.debt === 0) {
        contract.activeRepaymentPeriod = false;
        if (toPlayer) scheduleEvent(EVENT_ID.MAX.BANKRUPT_RESCUE_REPAYMENT_DONE, 2, partner);
        else scheduleEvent(EVENT_ID.MAX.BANKRUPT_RESCUE_REPAYMENT_DONE_PLAYER, 2, partner, true);
      }
    }
    else {
      partner.debt -= actualAmount;
      if (partner.debt === 0) {
        if (toPlayer) scheduleEvent(`${EVENT_ID.MAX.BANKRUPT_RESCUE_REPAYMENT_DONE + (partner.relationship < 200 ? '_LOW_RELATIONSHIP' : '')}`, 2, partner);
        else scheduleEvent(`${EVENT_ID.MAX.BANKRUPT_RESCUE_REPAYMENT_DONE_PLAYER + (partner.relationship < 200 ? '_LOW_RELATIONSHIP' : '')}`, 2, partner, true);
      }
    }
  }
  return true;
}
export const shareBenefit = (partner = null, amount = 0, contract = null, toPlayer = true) => {
  if (!partner || !contract) return false;
  const finalAmount = amount * contract.ratio * (toPlayer ? -1 : 1);
  gainPartnerBankroll(partner, finalAmount, TYPE_CHANGE_BANKROLL.PARTNER_BENEFIT);
  gainBankroll(-finalAmount, TYPE_CHANGE_BANKROLL.PARTNER_BENEFIT);
  contract.profitTotal += finalAmount;
  console.log(`${partner.id} PARTNER_BENEFIT: ${finalAmount}`);
  partner.netWorthHistory.push({ time: store.gameTime, netWorth: partner.bankroll + finalAmount });
  return true;
}
export const requestRescueDebt = (partner = null) => {
  if (!partner) return false;
  const getEvent = EVENT_ID[partner.id.toUpperCase()].BANKRUPT
  if (getEvent && !partner.sendedEventIds.includes(getEvent.id)) {
    partnerScheduleEvent(getEvent, 2, partner);
    return true;
  }
  return false;
}
export const rescueDebt = (partner = null, ratio = 0.3, contract = null, toPlayer = false) => {
  if (!contract || !partner) return false;
  if (contract.active) {
    ratio = contract.ratio;
    contract.active = false;
    contract.debtRepaymentDue = contract.initDebtRepaymentDue
    contract.activeRepaymentPeriod = true;
  }
  const whosBankroll = toPlayer ? partner.bankroll : store.bankroll;
  const amount = whosBankroll * ratio * (toPlayer ? 1 : -1);

  gainBankroll(amount, TYPE_CHANGE_BANKROLL.DEBT_REPAYMENT);
  gainPartnerBankroll(partner, -amount, TYPE_CHANGE_BANKROLL.DEBT_REPAYMENT);
  const getEvent = EVENT_ID[partner.id.toUpperCase()]['BANKRUPT_ACCEPT_RESCUE' + (partner.relationship < 200 ? '_LOW_RELATIONSHIPSHIP' : '')]
  if (getEvent) partnerScheduleEvent(getEvent, 2, partner, true);
  return false;
}
export const PARTNER_ID = {
  MAX: 'Max',
  FLORENCE: 'Florence',
}
export const PartnerStatus = {
  GAMBLING: 'GAMBLING', // IN CASINO
  SLEEPING: 'SLEEPING',
  EATING: 'EATING',
  DRINKING: 'DRINKING',
  RESTING: 'RESTING',
  IDLE: 'IDLE',
}
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
  [CONTRACT_TYPE.A_DATE_WITH_YOU]: 500,
  [CONTRACT_TYPE.COLLUSION]: 0 // for TEST
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


export class Partner {
  constructor({ id, name, philosophy, vPIP, AF, WTSD, W$SD, chipMultiply, isPartner, note, initialBankroll = 0, initialRelationship = 0, schedule = [], contracts = [] }) {
    this.id = id;
    this.name = name.toUpperCase();
    this.philosophy = philosophy;
    this.vPIP = vPIP;
    this.AF = AF;
    this.WTSD = WTSD;
    this.W$SD = W$SD;
    this.relationship = initialRelationship;
    this.chipMultiply = chipMultiply;
    this.isPartner = isPartner;
    this.note = note;
    this.bankroll = initialBankroll;
    this.status = PartnerStatus.IDLE;
    this.netWorthHistory = [];
    this.sessionNetWorth = 0;
    this.contracts = contracts;
    this.schedule = schedule;
    this.netShareTotal = 0; // +: Gain for partner, -: Gain for you
    this.debt = 0; // +: you owe partner, -: partner owes you
    this.sendedEventIds = []; // partner will not request same event to you
  }
}
export const addSendedEventId = (partnerId, eventId) => {
  const partner = store.partners.find((p) => p.id === partnerId);
  if (!partner) return false;
  partner.sendedEventIds.push(eventId);
  return true;
}
export const deleteSendedEventId = (partnerId, eventId) => {
  const partner = store.partners.find((p) => p.id === partnerId);
  if (!partner) return false;
  partner.sendedEventIds = partner.sendedEventIds.filter((id) => id !== eventId);
  return true;
}
export const signContract = (partnerId, type, ratio = 0.5) => {
  audioManager.playSFX('ui-click');
  const partner = store.partners.find((p) => p.id === partnerId);
  if (!partner) return false;

  let contract = partner.contracts.find((c) => c.type === type);
  if (!contract) return false;
  // Check cooldown
  if (contract.cooldown > 0) return false;
  if (!contract.active) {
    const eventId = EVENT_ID[partner.id.toUpperCase()]['SIGN_CONTRACT_' + type.toUpperCase()];
    if (eventId) partnerScheduleEvent(eventId, 1 + (2 * Math.random()), partner, true);
  }

  contract.active = true;
  contract.ratio = ratio;
  contract.cooldown = 24;
  return true;
}

export const breakContract = (partnerId, type) => {
  const partner = store.partners.find((p) => p.id === partnerId);
  if (!partner) return false;
  const contract = partner.contracts.find((c) => c.type === type);
  if (!contract || !contract.active) return false;
  contract.active = false;
  contract.profitTotal = 0; // reset profit total
  contract.cooldown = 72; // 3 days in game time (72 hours)
  return true;
}
export const parseDayString = (dayStr) => {
  const daysMap = { '일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6 };
  if (!dayStr || dayStr === '매일' || dayStr === 'everyday') return [0, 1, 2, 3, 4, 5, 6];

  const days = new Set();
  const parts = dayStr.split(',');
  parts.forEach(p => {
    p = p.trim();
    if (p.includes('-')) {
      const [startStr, endStr] = p.split('-');
      const startNum = daysMap[startStr.trim()];
      const endNum = daysMap[endStr.trim()];
      if (startNum !== undefined && endNum !== undefined) {
        let current = startNum;
        while (current !== endNum) {
          days.add(current);
          current = (current + 1) % 7;
        }
        days.add(endNum);
      }
    } else {
      if (daysMap[p] !== undefined) days.add(daysMap[p]);
    }
  });
  return Array.from(days);
};

export const parseHourString = (hourStr) => {
  if (!hourStr || hourStr === '종일' || hourStr === 'allday') return { start: 0, end: 24 };
  const [startStr, endStr] = hourStr.split('-');
  return { start: parseInt(startStr), end: parseInt(endStr) };
};

export const updatePartnerStatusBySchedule = () => {
  const date = new Date(store.gameTime);
  const currentDayNum = date.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
  const currentHour = date.getHours();

  store.partners.forEach(partner => {
    // skip partners without schedule array
    if (partner.relationship === 0) {
      unregisterPartner(partner.id);
      return;
    }
    if (!partner.schedule || !Array.isArray(partner.schedule)) return;
    let newStatus = PartnerStatus.IDLE; // Default status if nothing matches

    for (const rule of partner.schedule) {
      const targetDays = parseDayString(rule.days);
      if (targetDays.includes(currentDayNum)) {
        const { start, end } = parseHourString(rule.hours);
        // Handle normal range (e.g. 13-23)
        if (start < end) {
          if (currentHour >= start && currentHour < end) {
            newStatus = PartnerStatus[rule.status] || PartnerStatus.IDLE;
            break;
          }
        }
        // Handle overnight range (e.g. 20-04 means 20 to 23 and 0 to 3)
        else if (start > end) {
          if (currentHour >= start || currentHour < end) {
            newStatus = PartnerStatus[rule.status] || PartnerStatus.IDLE;
            break;
          }
        }
      }
    }
    // Don't wake up bankrupt partners to gamble
    if (newStatus === PartnerStatus.GAMBLING && partner.bankroll <= 0) {
      newStatus = PartnerStatus.IDLE;
    }
    partner.status = newStatus;
    partner.contracts.forEach(contract => {
      if (contract.cooldown > 0) contract.cooldown--;
      if (contract.debtRepaymentDue > 0) contract.debtRepaymentDue--;
    });
    if (partner.status === PartnerStatus.GAMBLING) return;
    // --- POST-GAMBLING / IDLE CHECKS ---
    // 겜블링 중에는 계약 파기나 빚 독촉을 하지 않는다(당연하게도? 데이트도 불가!)
    // 관계도 
    partner.contracts.forEach(contract => {
      if (!contract.active) return;
      if (partner.relationship < contract.relationshipToBreak) { // MUST USE relationshipToBreak
        const result = breakContract(partner.id, contract.type);
        const eId = EVENT_ID[partner.id.toUpperCase()]['BREAK_CONTRACT_' + contract.type.toUpperCase()];
        if (result && eId) partnerScheduleEvent(eId, 2 * Math.random() + 1, partner, true);
      }
      if (contract.type === CONTRACT_TYPE.BANKRUPT_RESCUE) {
        if (partner.id === 'max') gainRelationship(partner.id, 1); // only max
      } else if (contract.type === CONTRACT_TYPE.A_DATE_WITH_YOU) {
        if (partner.id === 'florence') gainRelationship(partner.id, Math.random() * 6 - 4); // only florence
      }
    });
    // check debt penalty
    const impactPercentage = Math.max(partner.bankroll, 10000) / 1000;
    if (partner.debt !== 0) {
      const finalRelationshipChange = Math.round(impactPercentage * 100);
      gainRelationship(partner.id, Math.max(-20, Math.min(10, finalRelationshipChange)));
    }
    // networth adjustment
    if (partner.sessionNetWorth !== 0) {
      if (partner.sessionNetWorth > 0) { // only positive networth

        let finalRelationshipChange = 0;
        const hasPartnerDebt = partner.debt < 0;
        const hasDebtContract = partner.contracts.find((c) => c.type === CONTRACT_TYPE.BANKRUPT_RESCUE && c.activeRepaymentPeriod);
        if (hasPartnerDebt) {
          if (!hasDebtContract) {
            // 1st priority: partner repays player
            debtRepayment(partner, partner.sessionNetWorth * 0.5, true);
          } else {
            // 2nd priority: debt contract
            debtRepayment(partner, partner.sessionNetWorth * 0.5, true, hasDebtContract);
          }
        }
        const hasBenefitContract = partner.contracts.find((c) => c.type === CONTRACT_TYPE.SHARE_BENEFIT && c.active);
        let isShared = false;
        if (hasBenefitContract) isShared = shareBenefit(partner, partner.sessionNetWorth, hasBenefitContract);
        if (isShared) {
          const baseGain = (hasBenefitContract.profitTotal * 0.1) * impactPercentage;
          const ratioModifier = Math.abs((0.5 - hasBenefitContract.ratio) * 4) + 1;
          finalRelationshipChange += Math.round(baseGain * ratioModifier);
          finalRelationshipChange = Math.max(-150, Math.min(50, finalRelationshipChange));

        }
        console.info(`${partner.id} : ${finalRelationshipChange}`);
        gainRelationship(partner.id, finalRelationshipChange);
      }
      partner.sessionNetWorth = 0; // RESET
    }
    // check bankrupt partner
    if (partner.bankroll <= 0) {
      const hasRescueBankruptContract = partner.contracts.find((c) => c.type === CONTRACT_TYPE.BANKRUPT_RESCUE && c.active);
      if (hasRescueBankruptContract) {
        rescueDebt(partner, 0.3, hasRescueBankruptContract, false);
        // Removed the extra RESOLVED_DEBT trigger here because rescueDebt triggers BANKRUPT_ACCEPT_RESCUE natively.
      } else if (partner.debt > 0) {
        partnerScheduleEvent(EVENT_ID[partner.id.toUpperCase()]['BANKRUPT_HAS_DEBT' + (partner.relationship <= 200 ? '_LOW_RELATIONSHIP' : '')], 2, partner);
      } else {
        const firstRequest = requestRescueDebt(partner);
        if (!firstRequest) gainRelationship(partner.id, -1); // no have contract. (but, Players do not support their partners.)
      }
    }
  });
};
// for 1hr (in-game time)
export const simulatePartnersBehavior = () => {
  simulatePartnersNetWorth();
  updatePartnerStatusBySchedule();
}
export const simulatePartnersNetWorth = () => {
  // simulate partner's net worth logic
  store.partners.forEach(partner => {
    if (partner.status === PartnerStatus.GAMBLING) {
      // 잔고가 0 이하(파산)인 경우 도박 종료
      if (partner.bankroll <= 0) {
        partner.status = PartnerStatus.IDLE;
        return;
      }
      if ((partner.vPIP + partner.WTSD) / 2 > Math.random()) {
        // .36 + .31 / 2 = .335 (max)
        // 73 * 3.5 * 100 = 25550 (max)
        // (25550/2) * 0.53 = 6771.5
        // .25 + .27 / 2 = .26 (florence)
        // 73 * 3 * 100 = 19710 (florence)
        // (19710/2) * 0.57 = 5612.45
        //  * 0.53
        const volatility = partner.AF * Math.max(partner.bankroll / 1000, 25) * Math.random();
        let netWorthChange = 0;
        // 승리 시
        if (Math.random() < partner.W$SD) {
          netWorthChange = Math.ceil(100 * volatility);
        } else { // 패배 시
          netWorthChange = -Math.ceil(100 * volatility);
        }
        gainPartnerBankroll(partner, netWorthChange);
        partner.netWorthHistory.push({ time: store.gameTime, netWorth: partner.bankroll });
        partner.sessionNetWorth += netWorthChange;
        console.info(partner.name, partner.sessionNetWorth);
        if (partner.netWorthHistory.length > 150) partner.netWorthHistory.shift();
      }
    }
  });
}
export const generatePartner = (partnerId = 'max') => {
  const p = CLASSES_PARTNER.find((p) => p.id === partnerId);
  if (!p) return;
  const { canContracts } = p;
  const contracts = [];
  canContracts.forEach((type) => {
    const contract = createContractObject(type);
    if (contract) contracts.push(contract);
  });
  return new Partner({ ...p, contracts });
};
const partnerScheduleEvent = (eventId, delay = 2, partner, acceptResend = false) => {
  if (acceptResend) {
    scheduleEvent(eventId, delay);
  } else if (!partner.sendedEventIds.includes(eventId)) {
    addSendedEventId(partner.id, eventId);
    scheduleEvent(eventId, delay);
  }
}
export const playerNetSharePartners = () => {
  if (store.sessionNetWorth <= 0) {
    store.sessionNetWorth = 0;
    return;
  }
  store.partners.forEach(partner => {
    partner.contracts.forEach(contract => {
      if (contract.active && contract.type === CONTRACT_TYPE.SHARE_BENEFIT) {
        gainBankroll(-contract.ratio * store.sessionNetWorth, TYPE_CHANGE_BANKROLL.PARTNER_BENEFIT);
        gainPartnerBankroll(partner, contract.ratio * store.sessionNetWorth, TYPE_CHANGE_BANKROLL.PARTNER_BENEFIT);
      }
    })
  })
  store.sessionNetWorth = 0;
}