import { CLASSES_PARTNER } from "./persona";
import { store, gainBankroll } from "./store";
import { scheduleEvent, EVENT_ID } from "./eventSystem";
import { createContractObject, shareBenefit, breakContract, triggerRescueDebt, requestRescueDebt } from "./partnerContractSystem";
import { PARTNER_ID, PARTNER_STATUS, CONTRACT_TYPE, TYPE_CHANGE_BANKROLL } from "./constants";

export const getPartners = () => {
  return store.partners;
}
export const getPartner = (partnerId = null) => {
  if (!partnerId) return null;
  const partner = getJoinedPartners().find(p => p.id === partnerId);
  return partner;
}
export const getJoinedPartners = () => {
  return store.partners.filter(p => p.isJoined);
}

export const getRelationship = (partnerId = null) => {
  if (!partnerId) return null;
  const partner = getPartners().find((p) => p.id === partnerId);
  if (!partner) return null;
  return partner.relationship;
}
export const joinPartner = (partnerId = null) => {
  if (!partnerId) return;
  const partner = getPartners().find(p => p.id === partnerId);
  if (partner) partner.isJoined = true;
}
export const leavePartner = (partnerId = null) => {
  if (!partnerId) return;
  const partner = getPartners().find((p) => p.id === partnerId);
  if (partner) {
    scheduleEvent(EVENT_ID[partnerId.toUpperCase()]['GONE'], 2);
    partner.find(p => p.id === partnerId).isJoined = false;
  }
}
export const gainPartnersRelationshipOliveBranch = () => {
  getPartners().forEach((partner) => {
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
  partner.bankroll += finalAmount;
  if (type === TYPE_CHANGE_BANKROLL.DEBT_REPAYMENT) {
    partner.debt += amount;
  }
  partner.netWorthHistory.push({ time: store.gameTime, netWorth: partner.bankroll })
  if (partner.netWorthHistory.length > 150) partner.netWorthHistory.shift();
  return true;
}
export const transferBankroll = (partnerId = null, amount = 0, toPlayer = false) => {
  if (!partnerId || amount <= 0) return false;
  const partner = store.partners.find((p) => p.id === partnerId);
  if (!partner) return false;
  const direction = toPlayer ? 1 : -1;
  gainBankroll(amount * direction, TYPE_CHANGE_BANKROLL.TRANSFER);
  gainPartnerBankroll(partner, amount * -direction, TYPE_CHANGE_BANKROLL.TRANSFER);
  return true;
}
export const debtRepayment = (partnerId = null, amount = 0, toPlayer = true) => {
  if (!partnerId || amount <= 0) return false;
  const partner = store.partners.find((p) => p.id === partnerId);
  if (!partner) return false;
  // toPlayer=true: Partner pays Player (partner owes player => partner.debt < 0)
  // toPlayer=false: Player pays Partner (player owes partner => partner.debt > 0)
  const direction = toPlayer ? -1 : 1;
  gainPartnerBankroll(partner, amount * direction, TYPE_CHANGE_BANKROLL.DEBT_REPAYMENT);
  gainBankroll(amount * -direction, TYPE_CHANGE_BANKROLL.DEBT_REPAYMENT);
  if (partnerId === PARTNER_ID.MAX) {
    if (toPlayer) scheduleEvent(`${EVENT_ID.MAX.BANKRUPT_RESCUE_REPAYMENT_DONE + (partner.relationship < 200 ? '_LOW_RELATIONSHIP' : '')}`, 2, partner);
    else scheduleEvent(`${EVENT_ID.MAX.BANKRUPT_RESCUE_REPAYMENT_DONE_PLAYER + (partner.relationship < 200 ? '_LOW_RELATIONSHIP' : '')}`, 2, partner, true);
  }
  return true;
}

export const Partner = ({ id, name, fullName, philosophy, vPIP, AF, WTSD, W$SD, chipMultiply, isPartner, note, initialBankroll = 0, initialRelationship = 0, schedule = [], contracts = [], isAdvanced = false }) => {
  return {
    id: id,
    name: name,
    fullName: fullName,
    philosophy: philosophy,
    vPIP: vPIP,
    AF: AF,
    WTSD: WTSD,
    W$SD: W$SD,
    relationship: initialRelationship,
    chipMultiply: chipMultiply,
    isPartner: isPartner,
    note: note,
    initialBankroll: initialBankroll,
    bankroll: initialBankroll,
    status: PARTNER_STATUS.IDLE,
    netWorthHistory: [],
    contracts: contracts,
    isAdvanced: isAdvanced,
    sessionNetWorth: 0,
    schedule: schedule,
    netShareTotal: 0, // +: Gain for partner, -: Gain for you
    debt: 0, // -: you owe partner, +: partner owes you
    sendedEventIds: [], // partner will not request same event to you
    isJoinedPartner: false,
    isJoinedTable: false,
    // isCheckedRelationship: false,
    lastRelationshipCheckTime: null
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

export const updatePartnerStatusBySchedule = (partner) => {
  const date = new Date(store.gameTime);
  const currentDayNum = date.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
  const currentHour = date.getHours();

  // skip partners without schedule array
  if (partner.relationship === 0) {
    leavePartner(partner.id);
    return;
  }
  if (!partner.schedule || !Array.isArray(partner.schedule)) return;
  let newStatus = PARTNER_STATUS.IDLE; // Default status if nothing matches

  for (const rule of partner.schedule) {
    const targetDays = parseDayString(rule.days);
    if (targetDays.includes(currentDayNum)) {
      const { start, end } = parseHourString(rule.hours);
      // Handle normal range (e.g. 13-23)
      if (start < end) {
        if (currentHour >= start && currentHour < end) {
          newStatus = PARTNER_STATUS[rule.status] || PARTNER_STATUS.IDLE;
          break;
        }
      }
      // Handle overnight range (e.g. 20-04 means 20 to 23 and 0 to 3)
      else if (start > end) {
        if (currentHour >= start || currentHour < end) {
          newStatus = PARTNER_STATUS[rule.status] || PARTNER_STATUS.IDLE;
          break;
        }
      }
    }
  }
  // Don't wake up bankrupt partners to gamble
  if (newStatus === PARTNER_STATUS.GAMBLING && partner.bankroll <= 0) {
    newStatus = PARTNER_STATUS.IDLE;
  }
  partner.status = newStatus;
  partner.contracts.forEach(contract => {
    if (contract.cooldown > 0) contract.cooldown--;
    if (contract.debtRepaymentDue > 0) contract.debtRepaymentDue--;
  });
}
const triggerRelationshipChange = (partner) => {

  const date = new Date(store.gameTime);
  const currentDayStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  if (partner.lastRelationshipCheckTime === currentDayStr || partner.status === PARTNER_STATUS.GAMBLING) return;
  partner.lastRelationshipCheckTime = currentDayStr;
  const impactPercentage = Math.max(partner.bankroll, 10000) / 1000;
  // networth adjustment
  if (partner.sessionNetWorth > 0) {
    const hasPartnerDebt = partner.debt > 0;
    if (hasPartnerDebt) {
      const finalAmount = Math.min(partner.debt, Math.round(partner.sessionNetWorth * 0.5))
      debtRepayment(partner.id, finalAmount, true);
    }
    const hasBenefitContract = partner.contracts.find((c) => c.type === CONTRACT_TYPE.SHARE_BENEFIT && c.active);
    let shareAmount = 0;
    if (hasBenefitContract) shareAmount = shareBenefit(partner, partner.sessionNetWorth, hasBenefitContract);
    partner.sessionNetWorth = 0; // RESET
  }
  // partner is how thinking about contract and debt
  let finalRelationshipChange = 0;
  // check debt penalty
  if (partner.debt !== 0) {
    const forDebt = Math.round(partner.debt / impactPercentage);
    finalRelationshipChange += Math.max(-150, forDebt);
    console.info(`${partner.id} : forDebt = ${forDebt}`);
  }
  // about share benefit
  const hasBenefitContract = partner.contracts.find((c) => c.type === CONTRACT_TYPE.SHARE_BENEFIT && c.active);
  if (hasBenefitContract) {
    const baseGain = hasBenefitContract.profitTotal / impactPercentage;
    const ratioModifier = Math.abs((0.5 - hasBenefitContract.ratio) * 4) + 1;
    const forShareBenefit = Math.round(baseGain * ratioModifier);
    finalRelationshipChange += Math.max(-50, Math.min(50, forShareBenefit));
    console.info(`${partner.id} : forShareBenefit = ${forShareBenefit}`);
  }
  // about collusion
  const hasCollusionContract = partner.contracts.find((c) => c.type === CONTRACT_TYPE.COLLUSION && c.active);
  if (hasCollusionContract) {
    const baseGain = hasCollusionContract.profitTotal / impactPercentage;
    const ratioModifier = Math.abs((0.5 - hasCollusionContract.ratio) * 4) + 1;
    const forCollusion = Math.round(baseGain * ratioModifier);
    finalRelationshipChange += Math.max(-50, Math.min(50, forCollusion));
    console.info(`${partner.id} : forCollusion = ${forCollusion}`);
  }
  gainRelationship(partner, finalRelationshipChange);
  console.info(`${partner.id} : ${finalRelationshipChange}`);
  // check bankrupt partner
  if (partner.bankroll <= 0) {
    const isTriggered = triggerBankruptRescueForPartner(partner);
    if (!isTriggered && partner.debt < 0) {
      scheduleEvent(EVENT_ID[partner.id.toUpperCase()]['BANKRUPT_HAS_DEBT' + (partner.relationship <= 200 ? '_LOW_RELATIONSHIP' : '')], 2);
    } else {
      const firstRequest = requestRescueDebt(partner);
      if (!firstRequest) gainRelationship(partner.id, -50); // no have contract. (but, Players do not support their partners.)
    }
  }
  // steady or break about contracts
  partner.contracts.forEach(contract => {
    if (!contract.active) return;
    if (partner.relationship < contract.relationshipToBreak) { // MUST USE relationshipToBreak
      const result = breakContract(partner.id, contract.type);
      const eId = EVENT_ID[partner.id.toUpperCase()]['BREAK_CONTRACT_' + contract.type.toUpperCase()];
      if (result && eId) scheduleEvent(eId, 2 * Math.random() + 1);
    }
    if (contract.type === CONTRACT_TYPE.BANKRUPT_RESCUE) {
      if (partner.id === 'max') gainRelationship(partner.id, 1); // only max
    } else if (contract.type === CONTRACT_TYPE.A_DATE_WITH_YOU) {
      if (partner.id === 'florence') gainRelationship(partner.id, Math.random() * 6 - 4); // only florence
    }
  });
}
export const triggerBankruptRescueForPlayer = () => {
  let isTriggered = false;
  const partners = getJoinedPartners()
  partners.forEach(partner => {
    const hasRescueBankruptContract = partner.contracts.find((c) => c.type === CONTRACT_TYPE.BANKRUPT_RESCUE && c.active);
    isTriggered = triggerRescueDebt(partner, 0.3, hasRescueBankruptContract, true);
  });
  return isTriggered;
}
export const triggerBankruptRescueForPartner = (partner) => {
  let isTriggered = false;
  const hasRescueBankruptContract = partner.contracts.find((c) => c.type === CONTRACT_TYPE.BANKRUPT_RESCUE && c.active);
  if (hasRescueBankruptContract) {
    isTriggered = triggerRescueDebt(partner, 0.3, hasRescueBankruptContract, false);
  }
  return isTriggered;
}
// for 1hr (in-game time)
export const simulatePartnersBehavior = () => {
  getJoinedPartners().forEach((partner) => {
    simulatePartnersNetWorth(partner);
    updatePartnerStatusBySchedule(partner);
    triggerRelationshipChange(partner);
  })

}
export const simulatePartnersNetWorth = (partner) => {
  // simulate partner's net worth logic
  if (partner.status === PARTNER_STATUS.GAMBLING) {
    // for Testing
    partner.bankroll = 0

    // 잔고가 0 이하(파산)인 경우 도박 종료
    if (partner.bankroll <= 0) {
      partner.status = PARTNER_STATUS.IDLE;
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
      gainPartnerBankroll(partner, netWorthChange, TYPE_CHANGE_BANKROLL.GAMBLING);
      partner.sessionNetWorth += netWorthChange;
      console.info(partner.name, partner.sessionNetWorth);

    }
  }
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
  return Partner({ ...p, contracts });
};

export const initializePartners = () => {
  const partners = [];
  CLASSES_PARTNER.forEach((partner) => {
    partners.push(generatePartner(partner.id));
  });
  return partners;
}
