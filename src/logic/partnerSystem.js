import { CLASSES_PARTNER } from "./persona";
import { store, gainBankroll, TYPE_CHANGE_BANKROLL } from "./store";
import { scheduleEvent, EVENT_ID } from "./eventSystem";
import { audioManager } from "./audioManager";

export const getPartners = (partnerId = null) => {
  if (partnerId) return store.partners.filter(p => p.id === partnerId);
  return store.partners;
}
export const hydratePartners = () => {
  store.partners.forEach(existingPartner => {
    // 1. Hydrate un-classed JSON objects to Contract instances
    if (Array.isArray(existingPartner.contracts)) {
      existingPartner.contracts = existingPartner.contracts.map(c =>
        (c instanceof Contract) ? c : new Contract(c.type, c.ratio, c.active)
      );
    } else {
      existingPartner.contracts = [];
    }

    // 2. Add any missing contracts based on CLASSES_PARTNER base data
    const canContracts = CLASSES_PARTNER.find((p) => p.id === existingPartner.id)?.canContracts || [];
    canContracts.forEach((contractType) => {
      if (!existingPartner.contracts.some((c) => c.type === contractType)) {
        existingPartner.contracts.push(new Contract(contractType, 0.5, false));
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

export const registerPartner = (partnerId = null) => {
  if (!partnerId) return;
  store.partners.push(generatePartner(partnerId));
}
export const unregisterPartner = (partnerId = null) => {
  if (!partnerId) return;
  store.partners = store.partners.filter((p) => p.id !== partnerId);
}
export const gainRelationship = (partnerId = null, amount = 0) => {
  if (Number.isNaN(amount)) return;
  if (!partnerId) return null;
  const partner = store.partners.find((p) => p.id === partnerId);
  if (!partner) return null;
  partner.relationship = Math.max(-100, Math.min(100, partner.relationship + Math.ceil(amount)));
}
export const gainPartnerBankroll = (partner = null, amount = 0, type = TYPE_CHANGE_BANKROLL.OTHER) => {
  if (Number.isNaN(amount)) return;
  if (!partner) return null;
  partner.bankroll = Math.max(0, partner.bankroll + Math.ceil(amount));
  if (type === TYPE_CHANGE_BANKROLL.PARTNER_BENEFIT) partner.netShareTotal += amount;
}
export const shareBenefit = (partnerId = null, amount = 0) => {
  if (!partnerId) return null;
  const partner = store.partners.find((p) => p.id === partnerId);
  if (!partner) return null;
  if (partner.contracts.some((c) => c.type === CONTRACT_TYPE.SHARE_BENEFIT && c.active)) {
    gainPartnerBankroll(partnerId, amount * partner.ratio, TYPE_CHANGE_BANKROLL.PARTNER_BENEFIT);
    gainBankroll(amount * -1 * partner.ratio, TYPE_CHANGE_BANKROLL.PARTNER_BENEFIT);
    // time for partner's net worth history is game in-game time (save total bankroll)
    partner.netWorthHistory.push({ time: store.gameTime, netWorth: partner.bankroll });
  }
}
export const rescueDebt = (partnerId = null) => {
  if (!partnerId) return false;
  const partner = store.partners.find((p) => p.id === partnerId);
  if (!partner) return false;
  const contract = partner.contracts.find((c) => c.type === CONTRACT_TYPE.BANKRUPT_RESCUE);
  if (!contract) return false;
  if (contract.active) {
    if (partner.initialBankroll > store.bankroll) {
      if (partnerId === PARTNER_ID.MAX) {
        scheduleEvent(EVENT_ID.MAX_BANKRUPT_HAS_CONTRACT_BANKRUPT_RESCUE_FAIL, 0);
        scheduleEvent(EVENT_ID.MAX_BANKRUPT_REFUSE_RESCUE, 2);
      }
      else if (partnerId === PARTNER_ID.FLORENCE) {
        scheduleEvent(EVENT_ID.FLORENCE_BANKRUPT_HAS_CONTRACT_BANKRUPT_RESCUE_FAIL, 0);
        scheduleEvent(EVENT_ID.FLORENCE_BANKRUPT_REFUSE_RESCUE, 2);
      }
      contract.active = false;
      return false;
    } else {
      const amount = partner.initialBankroll;
      partner.netWorthHistory.push({ time: store.gameTime, netWorth: amount });
      gainPartnerBankroll(partner.id, amount);
      gainBankroll(amount * -1);
      contract.active = false;

      if (partnerId === PARTNER_ID.MAX) {
        scheduleEvent(EVENT_ID.MAX_BANKRUPT_HAS_CONTRACT_BANKRUPT_RESCUE, 0);
        scheduleEvent(EVENT_ID.MAX_BANKRUPT_ACCEPT_RESCUE, 5);
      }
      else if (partnerId === PARTNER_ID.FLORENCE) {
        scheduleEvent(EVENT_ID.FLORENCE_BANKRUPT_HAS_CONTRACT_BANKRUPT_RESCUE, 0);
        scheduleEvent(EVENT_ID.FLORENCE_BANKRUPT_ACCEPT_RESCUE, 2);
      }
      return true;
    }
  }
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
  GAMBLING_WITH_ME: 'GAMBLING_WITH_ME', // with you gambling
  A_DATE_WITH_YOU: 'A_DATE_WITH_YOU', // a date with you
}
export const CONTRACT_REQUIRED_RELATIONSHIP = {
  [CONTRACT_TYPE.GAMBLING_WITH_ME]: 200,
  [CONTRACT_TYPE.SHARE_BENEFIT]: 600,
  [CONTRACT_TYPE.BANKRUPT_RESCUE]: 800,
  [CONTRACT_TYPE.A_DATE_WITH_YOU]: 1000,
}
export const CONTRACT_TYPE_DESC = {
  [CONTRACT_TYPE.GAMBLING_WITH_ME]: {
    desc_ko: '이제 당신이 테이블에 참가할때, 해당 파트너도 함께 참가합니다.',
    desc_en: 'Now when you join the table, the partner will also participate.',
    get desc() {
      return store.language === 'ko' ? this.desc_ko : this.desc_en;
    },
    note_ko: '함께 게임을 하면, 파트너와의 관계가 상승합니다.',
    note_en: 'Playing together will increase the relationship with the partner.',
    get note() {
      return store.language === 'ko' ? this.note_ko : this.note_en;
    }
  },
  [CONTRACT_TYPE.SHARE_BENEFIT]: {
    desc_ko: '파트너와의 이익 공유 계약합니다. 이제 파트너나 플레이어가 승리할때마다 계약된 비율로 수익을 나눕니다.',
    desc_en: 'Enter into a profit-sharing agreement with your partner. Now, whenever you or your partner wins, the profits will be shared according to the agreed ratio.',
    get require() {
      return partner.relationship >= 600;
    },
    get desc() {
      return store.language === 'ko' ? this.desc_ko : this.desc_en;
    },
    note_kr: '수익 기여율 대비 계약된 쉐어 비율이 차이가 불균형하면, 관계가 변화할 수 있습니다.',
    note_en: 'If the agreed share ratio differs significantly from the profit contribution ratio, the relationship may change.',
    get note() {
      return store.language === 'ko' ? this.note_kr : this.note_en;
    }
  },
  [CONTRACT_TYPE.BANKRUPT_RESCUE]: {
    desc_ko: '플레이어나 파트너가 파산했을때, 계약된 비율 기준으로 뱅크롤의 일정 비율 만큼 자금을 지원합니다.',
    desc_en: 'If the player or partner goes bankrupt, funds will be provided from the bankroll according to the agreed ratio.',
    get desc() {
      return store.language === 'ko' ? this.desc_ko : this.desc_en;
    },
    note_kr: '파트너에게 자금을 지원하면 관계가 상승하지만, 파산한 대상이 당신이라면 빚을 갚을때까지 관계가 하락합니다\n(해당 계약은 한쪽이 파산하면 자동으로 해제됩니다).',
    note_en: 'Providing funds to a partner increases the relationship, but if you are the one who goes bankrupt, the relationship will decrease until the debt is repaid\n(This contract is automatically terminated if one party goes bankrupt).',
    get note() {
      return store.language === 'ko' ? this.note_kr : this.note_en;
    }
  },
  [CONTRACT_TYPE.A_DATE_WITH_YOU]: {
    desc_ko: '파트너와 데이트를 합니다. 파트너와 데이트를 하면, 파트너와의 관계가 상승합니다.',
    desc_en: 'Go on a date with your partner. Going on a date with your partner will increase your relationship with them.',
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
const CONTRACT_USE_RATIO = {
  [CONTRACT_TYPE.NOTHING]: false,
  [CONTRACT_TYPE.GAMBLING_WITH_ME]: false,
  [CONTRACT_TYPE.SHARE_BENEFIT]: true,
  [CONTRACT_TYPE.BANKRUPT_RESCUE]: true,
  [CONTRACT_TYPE.A_DATE_WITH_YOU]: false,
}
export class Contract {
  constructor(type = CONTRACT_TYPE.NOTHING, ratio = 0.5, active = false) {
    this.type = type;
    this.ratio = ratio;
    this.useRatio = CONTRACT_USE_RATIO[type];
    this.cooldown = 0;
    this.active = active;
    this.requiredRelationship = CONTRACT_REQUIRED_RELATIONSHIP[type] || 999999;
  }
}
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
    this.sessionNetWorth = [];
    this.contracts = contracts;
    this.schedule = schedule;
    this.netShareTotal = 0; // +: Gain for partner, -: Gain for you
    this.debt = 0; // +: you owe partner, -: partner owes you

  }
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
    const eventId = EVENT_ID[`${partner.id.toUpperCase()}_SIGN_CONTRACT_${type.toUpperCase()}`];
    if (eventId) scheduleEvent(eventId, 1 + (2 * Math.random()));

  }
  contract.active = true;
  contract.ratio = ratio;
  contract.cooldown = 24;
  return true;
}

// check steady or break contracts (1hour in game time)
export const checkSteadyOrBreakContracts = () => {
  store.partners.forEach(partner => {
    partner.contracts.forEach(contract => {
      // 시간당 감소 (in-game 1hour)
      if (contract.cooldown > 0) {
        contract.cooldown--;
      }

      if (!contract.active) return; // 활성화 된 계약만 효과/해지 체크

      if (contract.type === CONTRACT_TYPE.GAMBLING_WITH_ME) {
        const eId = partner.id === 'max' ? EVENT_ID.MAX_BREAK_CONTRACT_GAMBLING_WITH_ME :
          partner.id === 'florence' ? EVENT_ID.FLORENCE_BREAK_CONTRACT_GAMBLING_WITH_ME : null;
        if (partner.relationship <= 0) {
          const result = breakContract(partner.id, contract.type);
          if (result && eId) scheduleEvent(eId, 10);
        } else {
          if (eId === 'max') partner.relationship += 1;
        }
      }
      else if (contract.type === CONTRACT_TYPE.SHARE_BENEFIT) {
        const eId = partner.id === 'max' ? EVENT_ID.MAX_BREAK_CONTRACT_SHARE_BENEFIT :
          partner.id === 'florence' ? EVENT_ID.FLORENCE_BREAK_CONTRACT_SHARE_BENEFIT : null;
        if (partner.relationship < 300) {
          const result = breakContract(partner.id, contract.type);
          if (result && eId) scheduleEvent(eId, 10);
        } else {
          if (eId === 'max') partner.relationship += 2;
          else if (eId === 'florence') partner.relationship += 1;
        }
      }
      else if (contract.type === CONTRACT_TYPE.BANKRUPT_RESCUE) {
        const eId = partner.id === 'max' ? EVENT_ID.MAX_BREAK_CONTRACT_BANKRUPT_RESCUE :
          partner.id === 'florence' ? EVENT_ID.FLORENCE_BREAK_CONTRACT_BANKRUPT_RESCUE : null;
        if (partner.relationship < 500) {
          const result = breakContract(partner.id, contract.type);
          if (eId && result) scheduleEvent(eId, 10);
        } else {
          if (eId === 'max') partner.relationship += 2;
          else if (eId === 'florence') partner.relationship += 2;
        }
      }
    });
  });
}
export const breakContract = (partnerId, type) => {
  const partner = store.partners.find((p) => p.id === partnerId);
  if (!partner) return false;
  const contract = partner.contracts.find((c) => c.type === type);
  if (!contract || !contract.active) return false;
  contract.active = false;
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
    if (partner.status === PartnerStatus.IDLE && partner.sessionNetWorth.length > 0) {
      const hasBenefitContract = partner.contracts.find((c) => c.type === CONTRACT_TYPE.SHARE_BENEFIT && c.active);
      if (hasBenefitContract) {
        const totalNetWorth = partner.sessionNetWorth.reduce((total, netWorth) => total + netWorth, 0);

        if (totalNetWorth > 0) {
          const totalShareAmount = totalNetWorth * hasBenefitContract.ratio;
          gainBankroll(totalShareAmount, TYPE_CHANGE_BANKROLL.PARTNER_BENEFIT);
          gainPartnerBankroll(partner, -totalShareAmount, TYPE_CHANGE_BANKROLL.PARTNER_BENEFIT);
          // cooldown이 0일 때만 관계도 변동 (최초계약시 24시간 유예기간)
          if (hasBenefitContract.cooldown === 0) {
            const impactPercentage = partner.bankroll > 0 ? (totalShareAmount / partner.bankroll) : 0;
            let baseGain = impactPercentage * 100;

            const ratioModifier = 1.0 * ((0.5 - hasBenefitContract.ratio) * 4);

            let finalRelationshipChange = Math.round(baseGain * ratioModifier);
            finalRelationshipChange = Math.max(-50, Math.min(50, finalRelationshipChange));

            gainRelationship(partner.id, finalRelationshipChange);
            console.log(`[CONTRACT ${partner.id}] 수익분배:${Math.floor(totalShareAmount)} CR / 체감도:${(impactPercentage * 100).toFixed(1)}% / 비율:${hasBenefitContract.ratio} => 관계도 변동량: ${finalRelationshipChange}`);
          }
        }
        partner.sessionNetWorth = []; // RESET
      }
    }
  });
};

// for 1hr (in-game time)
export const simulatePartnersBehavior = () => {
  updatePartnerStatusBySchedule();
  checkSteadyOrBreakContracts();
  simulatePartnersNetWorth();
}
export const simulatePartnersNetWorth = () => {
  // simulate partner's net worth logic
  store.partners.forEach(partner => {
    if (partner.status === PartnerStatus.GAMBLING) {
      // 잔고가 0 이하(파산)인 경우 도박 종료
      if (partner.bankroll <= 0) {
        partner.status = PartnerStatus.IDLE;
        if (partner.contracts.some((c) => c.type === CONTRACT_TYPE.BANKRUPT_RESCUE && c.active)) {
          rescueDebt(partner.id);
        } else {
          if (partner.id === 'max') {
            if (partner.relationship <= 200) scheduleEvent(EVENT_ID.MAX_BANKRUPT_HAS_DEBT_LOW_RELATION, 10);
            else scheduleEvent(EVENT_ID.MAX_BANKRUPT_HAS_DEBT, 10);
          } else if (partner.id === 'florence') {
            if (partner.relationship <= 200) scheduleEvent(EVENT_ID.FLORENCE_BANKRUPT_HAS_DEBT_LOW_RELATION, 10);
            else scheduleEvent(EVENT_ID.FLORENCE_BANKRUPT_HAS_DEBT, 10);
          }
        }
        return;
      }
      if ((partner.vPIP + partner.WTSD) / 2 > Math.random()) {
        const volatility = partner.AF * 50 * Math.random();
        let netWorthChange = 0;
        // 승리 시
        if (Math.random() < partner.W$SD) {
          netWorthChange = Math.ceil(100 * volatility);
        } else { // 패배 시
          netWorthChange = -Math.ceil(100 * volatility);
        }
        gainPartnerBankroll(partner, netWorthChange);
        partner.netWorthHistory.push({ time: store.gameTime, netWorth: partner.bankroll });
        partner.sessionNetWorth.push(netWorthChange);
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
  canContracts.forEach((c) => {
    contracts.push(new Contract(c, 0.5, 0));
  })
  return new Partner({ ...p, contracts });
};
