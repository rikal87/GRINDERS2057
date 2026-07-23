import { CLASSES_PARTNER } from "./persona.js";
import { store, gainBankroll, getCurrentBankroll } from "./store.js";
import { scheduleEvent, EVENT_ID } from "./eventSystem.js";
import { createContractObject, shareBenefit, breakContract, triggerBankruptcyRelief, requestBailout, triggerDebtRepaymentDue } from "./partnerContractSystem.js";
import { PARTNER_ID, PARTNER_STATUS, CONTRACT_TYPE, TYPE_CHANGE_BANKROLL } from "./constants.js";
import { MatchSimulator } from "./matchSimulator.js";
import { sendMessage, MESSAGE_TYPE, MESSAGE_ACTION_TYPE, MESSAGE_ACTION_LABEL_TYPE } from "./messageSystem.js";
import { zones } from "./zone.js";

const matchSimulator = new MatchSimulator({ bb: 20, sb: 10, maxEventsPerTick: 1, cooldownMs: 180000 });

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
export const isJoinedPartner = (partnerId = null) => {
  if (!partnerId) return false;
  const partner = getPartners().find((p) => p.id === partnerId);
  if (!partner) return false;
  return partner.isJoined;
}
export const joinPartner = (partnerId = null) => {
  if (!partnerId) return;
  const partner = getPartners().find(p => p.id === partnerId);
  //for testing
  // partner.bankroll = 0;
  if (partner) partner.isJoined = true;
}
export const leavePartner = (partnerId = null) => {
  if (!partnerId) return;
  const partner = getJoinedPartners().find((p) => p.id === partnerId);
  if (partner) {
    scheduleEvent(EVENT_ID[partnerId.toUpperCase()]['GONE'], 2);
    partner.isJoined = false;
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
  const oldBankroll = partner.bankroll;
  partner.bankroll = Math.round(Math.max(0, partner.bankroll + amount));
  const actualChange = partner.bankroll - oldBankroll;
  if (type === TYPE_CHANGE_BANKROLL.DEBT_REPAYMENT) {
    partner.debt += actualChange;
  }
  partner.netWorthHistory.push({ time: store.gameTime, netWorth: partner.bankroll })
  if (partner.netWorthHistory.length > 150) partner.netWorthHistory.shift();
  return true;
}
export const transferBankroll = (partnerId = null, amount = 0, toPlayer = false) => {
  if (!partnerId || amount <= 0) return false;
  const partner = getJoinedPartners().find((p) => p.id === partnerId);
  if (!partner) return false;
  const direction = toPlayer ? 1 : -1;
  gainBankroll(amount * direction, TYPE_CHANGE_BANKROLL.TRANSFER);
  gainPartnerBankroll(partner, amount * -direction, TYPE_CHANGE_BANKROLL.TRANSFER);
  return true;
}
export const debtRepayment = (partnerId = null, amount = 0, toPlayer = true, isRequest = false) => {
  console.info('debtRepayment', partnerId, amount, toPlayer)
  if (!partnerId || amount <= 0) return false;
  const partner = getJoinedPartners().find((p) => p.id === partnerId);
  if (!partner) return false;
  // toPlayer=true: Partner pays Player (partner owes player => partner.debt < 0)
  // toPlayer=false: Player pays Partner (player owes partner => partner.debt > 0)
  const direction = toPlayer ? -1 : 1;
  if (!toPlayer) {
    const canRepay = getCurrentBankroll() >= amount
    if (!canRepay) return false;
  }
  gainPartnerBankroll(partner, amount * direction, TYPE_CHANGE_BANKROLL.DEBT_REPAYMENT);
  gainBankroll(amount * -direction, TYPE_CHANGE_BANKROLL.DEBT_REPAYMENT);
  if (!toPlayer && !isRequest && partner.debt === 0) {
    const foundEventId = `${EVENT_ID[partnerId.toUpperCase()].RESOLVED_DEBT}${partner.relationship < 200 ? '_LOW_RELATIONSHIP' : ''}`;
    if (foundEventId) scheduleEvent(foundEventId, 2, partner);
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
    if (contract.type === CONTRACT_TYPE.BAILOUT) triggerDebtRepaymentDue(partner, contract)
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
    const hasBenefitContract = partner.contracts.find((c) => c.type === CONTRACT_TYPE.BENEFIT_SHARE && c.active);
    if (hasBenefitContract) shareBenefit(partner, partner.sessionNetWorth, hasBenefitContract);
  }
  partner.sessionNetWorth = 0; // RESET
  // partner is how thinking about contract and debt
  let finalRelationshipChange = 0;
  // check debt penalty
  if (partner.debt !== 0) {
    const forDebt = Math.round(partner.debt / impactPercentage);
    finalRelationshipChange += Math.min(50, Math.max(-100, forDebt));
    console.info(`${partner.id} : forDebt = ${forDebt}`);
  }
  // about share benefit
  const hasBenefitContract = partner.contracts.find((c) => c.type === CONTRACT_TYPE.BENEFIT_SHARE && c.active);
  if (hasBenefitContract) {
    const baseGain = (hasBenefitContract.profitTotal - hasBenefitContract.profitTotalLatest) / impactPercentage;
    const ratioModifier = Math.abs((0.5 - hasBenefitContract.ratio) * 4) + 1;
    const forShareBenefit = Math.round(baseGain * ratioModifier);
    finalRelationshipChange += Math.max(-150, Math.min(75, forShareBenefit));
    hasBenefitContract.profitTotalLatest = hasBenefitContract.profitTotal
    console.info(`${partner.id} : forShareBenefit = ${forShareBenefit}`);
  }
  // about collusion
  const hasCollusionContract = partner.contracts.find((c) => c.type === CONTRACT_TYPE.COLLUSION && c.active);
  if (hasCollusionContract) {
    const baseGain = (hasCollusionContract.profitTotal - hasCollusionContract.profitTotalLatest) / impactPercentage;
    const ratioModifier = Math.abs((0.5 - hasCollusionContract.ratio) * 4) + 1;
    const forCollusion = Math.round(baseGain * ratioModifier);
    finalRelationshipChange += Math.max(-150, Math.min(75, forCollusion));
    hasCollusionContract.profitTotalLatest = hasCollusionContract.profitTotal
    console.info(`${partner.id} : forCollusion = ${forCollusion}`);
  }
  gainRelationship(partner.id, finalRelationshipChange);
  console.info(`${partner.id} : ${finalRelationshipChange}`);
  let isBankrupt = false;
  if (partner.bankroll <= 0) {
    const isTriggered = triggerBankruptRescueForPartner(partner);
    if (!isTriggered) {
      isBankrupt = true;
      if (partner.debt < 0) {
        scheduleEvent(EVENT_ID[partner.id.toUpperCase()]['BANKRUPT_HAS_DEBT' + (partner.relationship <= 200 ? '_LOW_RELATIONSHIP' : '')], 2);
      } else {
        requestBailout(partner);
      }
    }
  }
  if (getCurrentBankroll() === 0) {
    triggerBankruptRescueForPlayer();
  }
  // steady or break about contracts
  partner.contracts.forEach(contract => {
    if (!contract.active) return;
    if (contract.type === CONTRACT_TYPE.BAILOUT) {
      if (partner.id === PARTNER_ID.MAX) gainRelationship(partner.id, 1); // only max
    } else if (contract.type === CONTRACT_TYPE.A_DATE_WITH_YOU) {
      if (partner.id === PARTNER_ID.FLORENCE) gainRelationship(partner.id, Math.random() * 6 - 4); // only florence
    }
    if (partner.relationship < contract.relationshipToBreak || isBankrupt) {
      const result = breakContract(partner.id, contract.type);
      if (!isBankrupt) {
        const eId = EVENT_ID[partner.id.toUpperCase()]['BREAK_CONTRACT_' + contract.type.toUpperCase()];
        if (result && eId) scheduleEvent(eId, 2 * Math.random() + 1);
      }
    }
  });
}
export const triggerBankruptRescueForPlayer = () => {
  let isTriggered = false;
  const partners = getJoinedPartners()
  partners.forEach(partner => {
    const hasRescueBankruptContract = partner.contracts.find((c) => c.type === CONTRACT_TYPE.BAILOUT && c.active);
    if (hasRescueBankruptContract) {
      isTriggered = triggerBankruptcyRelief(partner, 0.3, hasRescueBankruptContract, true);
    }
  });
  return isTriggered;
}
export const triggerBankruptRescueForPartner = (partner) => {
  let isTriggered = false;
  const hasRescueBankruptContract = partner.contracts.find((c) => c.type === CONTRACT_TYPE.BAILOUT && c.active);
  if (hasRescueBankruptContract) {
    isTriggered = triggerBankruptcyRelief(partner, 0.3, hasRescueBankruptContract, false);
  }
  return isTriggered;
}

// for 1hr (in-game time)
export const simulatePartnersBehavior = () => {
  getJoinedPartners().forEach((partner) => {
    simulatePartnersNetWorth(partner);
    updatePartnerStatusBySchedule(partner);
    triggerRelationshipChange(partner);

    // Determine partner active casino location
    const activeLocationId = partner.locationId || 'high_grand_casino';
    let locationConfig = null;
    for (const zone of zones) {
      const loc = zone.locations.find(l => l.id === activeLocationId);
      if (loc) { locationConfig = loc; break; }
    }
    const tableBb = locationConfig?.tables?.bb || 100;
    matchSimulator.simulatePartnerCycle(partner, activeLocationId, tableBb);
  });

  // Consume queued big-pot notification events (1 per tick/cycle)
  const events = matchSimulator.consumeEventsForTick();
  events.forEach(evt => {
    const snapshot = evt.snapshot || {};
    const potBbRatio = snapshot.potBbRatio || Math.round((snapshot.potSize || 0) / (snapshot.bb || 100));
    const locationId = snapshot.locationId || 'high_grand_casino';

    sendMessage(
      MESSAGE_TYPE.EVENT,
      `🚨 [LIVE MATCH ALERT] ${evt.heroName}의 빅팟 경기 (${potBbRatio}BB)`,
      `${evt.heroName}님이 대형 테이블에서 $${snapshot.potSize?.toLocaleString()} (${potBbRatio}BB) 크기의 빅팟 경기를 치르고 있습니다. 관전하시겠습니까?`,
      [
        {
          label: MESSAGE_ACTION_LABEL_TYPE.SPECTATE_MATCH,
          actionType: MESSAGE_ACTION_TYPE.SPECTATE_MATCH,
          payload: { heroId: evt.heroId, locationId, snapshot }
        }
      ],
      evt.heroId
    );
  });
}
export const simulatePartnersNetWorth = (partner) => {
  // 1. Simulated living expenses / consumption (prevents infinite wealth accumulation)
  // Deduct 0.15% of bankroll every simulation cycle (approx. 1 in-game hour)
  if (partner.status !== PARTNER_STATUS.GAMBLING) {
    if (partner.bankroll > 0) {
      const expenses = Math.ceil(partner.bankroll * 0.0015);
      gainPartnerBankroll(partner, -expenses, TYPE_CHANGE_BANKROLL.OTHER);
    }
  } else if (partner.status === PARTNER_STATUS.GAMBLING) {
    // 2. Integrated MatchSimulator for 100% full poker AI simulation on volatile spikes
    const snapshot = matchSimulator.simulatePartnerCycle(partner);
    if (!snapshot) {
      // Low-volatility math fallback if no full match triggered
      if ((partner.vPIP + partner.WTSD) / 2 > Math.random()) {
        const volatility = partner.AF * Math.max(partner.bankroll / 1000, 25) * Math.random();
        let netWorthChange = Math.random() < partner.W$SD ? Math.ceil(97 * volatility) : -Math.ceil(100 * volatility);
        gainPartnerBankroll(partner, netWorthChange, TYPE_CHANGE_BANKROLL.GAMBLING);
        partner.sessionNetWorth += netWorthChange;
      }
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

/**
 * 1-Click 자금 주입 (Direct Capital Staking Injection)
 */
export const stakeCapitalToPartner = (partnerId, amount = 5000, isLoan = false) => {
  const partner = getPartner(partnerId) || store.partners.find(p => p.id === partnerId);
  if (!partner || store.bankroll < amount || amount <= 0) return false;

  gainBankroll(-amount);
  partner.bankroll = (partner.bankroll || 0) + amount;

  if (isLoan) {
    partner.makeupDebt = (partner.makeupDebt || 0) + amount;
  } else {
    partner.agencyLoyalty = Math.min(100, (partner.agencyLoyalty || 80) + 15);
    partner.relationship = Math.min(1000, (partner.relationship || 500) + 100);
  }
  return true;
};

/**
 * 바이아웃 매각 (Buyout Cash-out)
 */
export const calculatePartnerBuyoutValue = (partner) => {
  if (!partner) return 0;
  const ovr = partner.ovr || 50;
  const stardom = partner.stardomRating || 50;
  const debt = partner.makeupDebt || 0;
  return Math.max(5000, (ovr * 1000) + (stardom * 500) - debt);
};

export const cashoutPartnerBuyout = (partnerId) => {
  const partner = getPartner(partnerId) || store.partners.find(p => p.id === partnerId);
  if (!partner) return false;

  const buyoutVal = calculatePartnerBuyoutValue(partner);
  gainBankroll(buyoutVal);
  partner.isJoined = false;
  partner.status = 'GONE';
  return buyoutVal;
};

/**
 * 카지노 파견 및 긴급 회수 (Deploy & Recall)
 */
export const deployPartnerToCasino = (partnerId, locationId) => {
  const partner = getPartner(partnerId) || store.partners.find(p => p.id === partnerId);
  if (!partner) return false;

  partner.status = PARTNER_STATUS.GAMBLING;
  partner.currentLocationId = locationId;
  return true;
};

export const recallPartnerFromCasino = (partnerId) => {
  const partner = getPartner(partnerId) || store.partners.find(p => p.id === partnerId);
  if (!partner) return false;

  partner.status = PARTNER_STATUS.IDLE;
  partner.currentLocationId = null;
  return true;
};

/**
 * 카지노 블랙리스트 신분 세탁 (Laundering)
 */
export const launderPartnerBlacklist = (partnerId, cost = 15000) => {
  const partner = getPartner(partnerId) || store.partners.find(p => p.id === partnerId);
  if (!partner || store.bankroll < cost) return false;

  gainBankroll(-cost);
  partner.isBlacklisted = false;
  return true;
};

/**
 * 4D 스탯 수식 & CRT 블록 바 생성 헬퍼 (Clean Domain Helpers)
 */
export const calculatePartnerOvr = (partner) => {
  if (!partner) return 50;
  const skill = partner.skillRating || 75;
  const guts = partner.gutsRating || 80;
  const mental = partner.mentalRating || 70;
  const stardom = partner.stardomRating || 60;
  return Math.round((skill * 0.35) + (guts * 0.25) + (mental * 0.25) + (stardom * 0.15));
};

export const renderCRTBlockGauge = (val = 70) => {
  const totalBlocks = 10;
  const filled = Math.min(totalBlocks, Math.max(0, Math.floor(val / 10)));
  const empty = totalBlocks - filled;
  
  if (val > 100) {
    const overflow = Math.floor((val - 100) / 10);
    return '🟨'.repeat(overflow) + '█'.repeat(totalBlocks - overflow);
  }
  return '█'.repeat(filled) + '░'.repeat(empty);
};

export const getPartnerTraitsList = (partner) => {
  if (!partner || !partner.traits) {
    return [
      { id: 'calm_mind', name: '침착한 자', icon: '🧘', category: 'PERK' },
      { id: 'prodigy', name: '유망주', icon: '🌟', category: 'PERK' }
    ];
  }
  return partner.traits.map(t => {
    const id = typeof t === 'string' ? t : t.id;
    return typeof t === 'object' && t.name ? t : { id, name: id, icon: '♠', category: 'PERK' };
  });
};

export const getPartnerCareersList = (partner) => {
  if (!partner || !partner.careers || partner.careers.length === 0) {
    return [
      { id: 'origin_1', title: '에이전시 창립 멤버' },
      { id: 'milestone_1', title: '메이크업 빚 전액 청산자' }
    ];
  }
  return partner.careers;
};

export const getFilteredAndSortedPartners = (partners = [], filterStatus = 'ALL', sortBy = 'ovr') => {
  let list = [...partners];

  // 1. Filter
  if (filterStatus === 'GAMBLING') {
    list = list.filter(p => p.status === 'GAMBLING');
  } else if (filterStatus === 'IDLE') {
    list = list.filter(p => p.status !== 'GAMBLING' && p.status !== 'REHAB' && !p.isBlacklisted);
  } else if (filterStatus === 'RISKS') {
    list = list.filter(p => p.status === 'REHAB' || p.isBlacklisted || (p.agencyLoyalty || 100) < 40);
  }

  // 2. Sort
  list.sort((a, b) => {
    if (sortBy === 'ovr') {
      return (b.ovr || calculatePartnerOvr(b)) - (a.ovr || calculatePartnerOvr(a));
    }
    if (sortBy === 'pnl') {
      return (b.sessionNetWorth || 0) - (a.sessionNetWorth || 0);
    }
    if (sortBy === 'debt') {
      return (b.makeupDebt || 0) - (a.makeupDebt || 0);
    }
    if (sortBy === 'loyalty') {
      return (a.agencyLoyalty || 80) - (b.agencyLoyalty || 80);
    }
    return 0;
  });

  return list;
};

/**
 * 턴 마감 일일 파견 결과 정산 및 리포트 가공 (Zone Config-based Turn Settlement Engine)
 */
export const processTurnPartnerResults = () => {
  const partners = getPartners();
  let totalDailyAgencyShare = 0;
  let totalDailyPlayerPnL = 0;
  const partnerResults = [];

  partners.forEach(partner => {
    if (partner.status === 'GAMBLING') {
      const locationId = partner.currentLocationId || 'micro_warehouse';
      
      // 1. Resolve Zone Metadata Config from zone.js
      let zoneBuyIn = 1000;
      let zoneBb = 10;
      let reqSkill = 50;
      let zoneName = locationId;

      for (const z of zones) {
        const loc = (z.locations || []).find(l => l.id === locationId);
        if (loc) {
          const cfg = loc.tables || loc.tableConfig || {};
          zoneBuyIn = cfg.amount || 1000;
          zoneBb = cfg.bb || 10;
          reqSkill = loc.reqSkill || 50;
          zoneName = loc.name || locationId;
          break;
        }
      }

      // 2. 200-Hand Poker Math Model: Base EV in bb/100 + Luck Variance Spike
      const partnerSkill = partner.skillRating || 75;
      const partnerGuts = partner.gutsRating || 75;
      const partnerMental = partner.mentalRating || 75;
      const isTilting = partner.isTilting || partnerMental < 30;

      // Base EV in bb/100 hands
      const evBaseBb = (partnerSkill - reqSkill) * 0.8;
      const gutsFactor = 0.8 + (partnerGuts / 250); // 0.8 ~ 1.2x multiplier
      const mentalPenalty = isTilting ? -15.0 : 0.0;
      
      // Luck Variance Delta (-35 bb to +45 bb)
      const luckVarianceBb = (Math.random() * 80) - 35;
      const totalBbChange = (2 * (evBaseBb + mentalPenalty) * gutsFactor) + luckVarianceBb;

      // 3. Final Daily Session PnL (CR)
      const sessionPnL = Math.floor(totalBbChange * zoneBb);

      partner.sessionNetWorth = (partner.sessionNetWorth || 0) + sessionPnL;
      totalDailyPlayerPnL += sessionPnL;

      const isWin = sessionPnL > 0;

      // 4. Mental & Tilt Calculation on Loss
      if (!isWin) {
        partner.mentalRating = Math.max(10, (partner.mentalRating || 75) - (6 + zoneLv));
        if (partner.mentalRating < 30) {
          partner.isTilting = true;
        }
      } else {
        partner.mentalRating = Math.min(100, (partner.mentalRating || 75) + 3);
      }

      // 5. Generate Top 3 Daily Clean Highlights (Scaled by Zone BB)
      partner.dailyTopHighlights = [
        {
          handId: `hand_${partner.id}_top1`,
          title: `[TOP_01_WIN] ${zoneName} $${(zoneBb * 2400).toLocaleString()} CR 대형 팟 올인 승리`,
          potSize: zoneBb * 2400,
          winAmount: Math.floor(zoneBb * 1800),
          isUserObserved: false
        },
        {
          handId: `hand_${partner.id}_top2`,
          title: `[TOP_02_WIN] ${zoneName} $${(zoneBb * 1200).toLocaleString()} CR 카운터 블러핑 성공`,
          potSize: zoneBb * 1200,
          winAmount: Math.floor(zoneBb * 900),
          isUserObserved: false
        },
        {
          handId: `hand_${partner.id}_top3`,
          title: `[TOP_03_WIN] ${zoneName} $${(zoneBb * 600).toLocaleString()} CR Triple Pot 콜 다운`,
          potSize: zoneBb * 600,
          winAmount: Math.floor(zoneBb * 450),
          isUserObserved: false
        }
      ];

      // 6. Agency Cut Share (Default 30%)
      const agencyCutRate = (partner.agencyShareTarget || 30) / 100;
      const agencyShareAmount = sessionPnL > 0 ? Math.floor(sessionPnL * agencyCutRate) : 0;
      totalDailyAgencyShare += agencyShareAmount;

      partnerResults.push({
        id: partner.id,
        name: partner.name,
        locationId: locationId,
        zoneName: zoneName,
        sessionPnL: sessionPnL,
        agencyShare: agencyShareAmount,
        mentalAfter: partner.mentalRating,
        isWin: isWin
      });
    }
  });

  // Inject Agency Share into Store Bankroll
  if (totalDailyAgencyShare > 0) {
    gainBankroll(totalDailyAgencyShare);
  }

  return {
    day: store.gameDay || 1,
    totalAgencyShare: totalDailyAgencyShare,
    totalPlayerPnL: totalDailyPlayerPnL,
    deployedCount: partnerResults.length,
    partnerResults: partnerResults
  };
};



