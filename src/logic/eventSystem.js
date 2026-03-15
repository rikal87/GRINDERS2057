// for first player
import { sendMessage, MESSAGE_TYPE, MESSAGE_ACTION_TYPE, MESSAGE_ACTION_LABEL_TYPE } from "./messageSystem.js";
import { store, saveStore, getLanguage, gainMissedPayments, getMissedPayments, MISSED_PAYMENT_TYPE, isUnlockedLocation, getBustEnemyCount, getTotalIncomeTaxCalculated } from "./store.js";
import { EVENT_FLORENCE, EventData as FlorenceEventData } from "./eventSystemFlorence.js";
import { EVENT_MAX, EventData as MaxEventData } from "./eventSystemMax.js";
import { ENEMY_ID, LOCATION_ID } from "./constants.js";
import { audioManager } from "./audioManager.js";
import { CONTRACT_SIGN_PREVENT_REASON, CONTRACT_SIGN_PREVENT_REASON_DESC } from './partnerContractSystem.js'
const pay_rent_bill = 5000;

export const EVENT_ID = {
  FIRST_PAY_RENT_BILL: 'first_pay_rent_bill',
  PAY_RENT_BILL_WARNING: 'pay_rent_bill_warning',
  PAY_RENT_BILL: 'pay_rent_bill',
  PAY_RENT_BILL_EVICTION: 'pay_rent_bill_eviction',
  INCOME_TAX: 'income_tax',
  MAX: EVENT_MAX,
  FLORENCE: EVENT_FLORENCE,
  SHARK_HUNTER_APPEARS: 'SHARK_HUNTER_APPEARS',
  GANGSTER_WARNING: 'GANGSTER_WARNING',
  UNLOCK_ZONE: {
    UNDERGROUND_BAR_INVITE: 'UNDERGROUND_BAR_INVITE',
    CLUB_MEMBERSHIP: 'CLUB_MEMBERSHIP',
    THE_BUNKER_KEY: 'THE_BUNKER_KEY',
    HOLDEM_HOUSE_MEMBERSHIP: 'HOLDEM_HOUSE_MEMBERSHIP',
    ROYAL_ROOM_INVITE: 'ROYAL_ROOM_INVITE',
  },
  SYSTEM_PARTNER_BAILOUT_FOR_PLAYER: 'SYSTEM_PARTNER_BAILOUT_FOR_PLAYER',
  SYSTEM_PLAYER_BAILOUT_FOR_PARTNER: 'SYSTEM_PLAYER_BAILOUT_FOR_PARTNER',
  CONTRACT_SIGN_PREVENT_REASON: CONTRACT_SIGN_PREVENT_REASON
};

const handleGameOver = async (reason) => {
  store.realGameOverReason = reason;
  store.isRealGameOver = true;
  audioManager.pause();
  await saveStore(); // 강제 종료 방지: 사망 상태 즉시 저장
  setTimeout(() => {
    audioManager.playSFX('game_over');
  }, 1000)
};
export const EventData = [
  ...FlorenceEventData,
  ...MaxEventData,
  {
    id: EVENT_ID.CONTRACT_SIGN_PREVENT_REASON.BENEFIT_SHARE_MAX_COUNT,
    scenario: '[이익 공유] 계약 최대치',
    title_ko: '[이익 공유]는 동시에 하나의 계약만 가능합니다.',
    title_en: '[Benefit Share] is Only One Contract',
    func(payload) {
      const lang = store.settings.language;
      const body = lang === 'en'
        ? CONTRACT_SIGN_PREVENT_REASON_DESC.BENEFIT_SHARE_MAX_COUNT.en
        : CONTRACT_SIGN_PREVENT_REASON_DESC.BENEFIT_SHARE_MAX_COUNT.ko;
      const title = lang === 'en' ? this.title_en : this.title_ko
      const sender = lang === 'en' ? 'System' : '시스템';
      sendMessage(MESSAGE_TYPE.SYSTEM, title, body, [], sender)
    },
  },
  {
    id: EVENT_ID.CONTRACT_SIGN_PREVENT_REASON.RELATIONSHIP,
    scenario: '파트너와의 관계가 너무 낮아 계약을 체결할 수 없습니다.',
    title_ko: '관계가 너무 낮습니다.',
    title_en: 'Relationship is too low.',
    func(payload) {
      const lang = store.settings.language;
      const body = lang === 'en'
        ? CONTRACT_SIGN_PREVENT_REASON_DESC.BENEFIT_SHARE_MAX_COUNT.en
        : CONTRACT_SIGN_PREVENT_REASON_DESC.BENEFIT_SHARE_MAX_COUNT.ko;
      const title = lang === 'en' ? this.title_en : this.title_ko
      const sender = lang === 'en' ? 'System' : '시스템';
      sendMessage(MESSAGE_TYPE.SYSTEM, title, body, [], sender)
    },
  },
  {
    id: EVENT_ID.CONTRACT_SIGN_PREVENT_REASON.COOLDOWN,
    scenario: '계약이 종료된지 얼마 되지 않아 계약을 체결할 수 없습니다.',
    title_ko: '계약이 종료된지 얼마 되지 않았습니다.',
    title_en: 'Contract is too new.',
    func(payload) {
      const lang = store.settings.language;
      const body = lang === 'en'
        ? CONTRACT_SIGN_PREVENT_REASON_DESC.COOLDOWN.en
        : CONTRACT_SIGN_PREVENT_REASON_DESC.COOLDOWN.ko;
      const title = lang === 'en' ? this.title_en : this.title_ko
      const sender = lang === 'en' ? 'System' : '시스템';
      sendMessage(MESSAGE_TYPE.SYSTEM, title, body, [], sender)
    },
  },
  {
    id: EVENT_ID.CONTRACT_SIGN_PREVENT_REASON.ACTIVE,
    scenario: '이미 계약중입니다.',
    title_ko: '이미 계약중입니다.',
    title_en: 'Contract is already active.',
    func(payload) {
      const lang = store.settings.language;
      const body = lang === 'en'
        ? CONTRACT_SIGN_PREVENT_REASON_DESC.ACTIVE.en
        : CONTRACT_SIGN_PREVENT_REASON_DESC.ACTIVE.ko;
      const title = lang === 'en' ? this.title_en : this.title_ko
      const sender = lang === 'en' ? 'System' : '시스템';
      sendMessage(MESSAGE_TYPE.SYSTEM, title, body, [], sender)
    },
  },
  {
    id: EVENT_ID.SYSTEM_PARTNER_BAILOUT_FOR_PLAYER,
    scenario: '플레이어가 파산했고 [파산 구제]를 계약한 파트너가 자금을 대출해줌.(시스템 발신용)',
    title_ko: '긴급 채무 집행',
    title_en: 'Emergency Debt Issued',
    func(payload) {
      const partnerName = payload.partnerName;
      const lang = store.settings.language;
      const body = lang === 'en'

        ? `${payload.amount.toLocaleString()} CR has been loaned via [${partnerName}]. (This balance is subject to future repayment)`
        : `[${partnerName}]의 승인에 따라 ${payload.amount.toLocaleString()} CR이 대출되었습니다. (해당 금액은 향후 상환 대상입니다.)`;

      const title = lang === 'en' ? this.title_en : this.title_ko
      const sender = lang === 'en' ? 'System' : '시스템';
      sendMessage(MESSAGE_TYPE.FINANCE, title, body, [], sender)
    },
  },
  {
    id: EVENT_ID.SYSTEM_PLAYER_BAILOUT_FOR_PARTNER,
    scenario: '파트너가 파산했고 [파산 구제]를 계약한 플레이어가 자금을 대출해줌.(시스템 발신용)',
    title_ko: '긴급 채무 집행',
    title_en: 'Emergency Debt Issued',
    func(payload) {
      const partner = payload.partner;
      const lang = store.settings.language;

      const body = lang === 'en'
        ? `${payload.amount.toLocaleString()} CR has been loaned to [${partner.name}]. (This balance is subject to future repayment)`
        : `당신의 승인에 따라 [${partner.name}]에게 ${payload.amount.toLocaleString()} CR이 대출되었습니다. (해당 금액은 향후 상환 대상입니다.)`;

      const sender = lang === 'en' ? 'System' : '시스템';
      const title = lang === 'en' ? this.title_en : this.title_ko
      sendMessage(MESSAGE_TYPE.FINANCE, title, body, [], sender)
    },
  },
  {
    id: EVENT_ID.UNLOCK_ZONE.UNDERGROUND_BAR_INVITE,
    scenario: '[언더그라운드 바] 잠금 해제',
    func() {
      const title = store.settings.language === 'en' ? 'Reward for unlocking [Underground Bar]' : '[언더그라운드 바] 이용가능';
      const body = store.settings.language === 'en' ? "You can now access the [Underground Bar]." : '[지하 바]의 접근 권한이 해제되었습니다.';
      const sender = store.settings.language === 'en' ? 'System' : '시스템';
      sendMessage(MESSAGE_TYPE.REWARD, title, body, [], sender)
    },
  },

  {
    id: EVENT_ID.UNLOCK_ZONE.CLUB_MEMBERSHIP,
    scenario: '[H.B.D 클럽] 잠금 해제',
    func() {
      const title = store.settings.language === 'en' ? 'Reward for unlocking [H.B.D Club]' : '[H.B.D 클럽] 이용가능';
      const body = store.settings.language === 'en' ? "You can now access the [H.B.D Club]." : '[H.B.D 클럽]의 접근 권한이 해제되었습니다.';
      const sender = store.settings.language === 'en' ? 'System' : '시스템';
      sendMessage(MESSAGE_TYPE.REWARD, title, body, [], sender)
    },
  },
  {
    id: EVENT_ID.UNLOCK_ZONE.THE_BUNKER_KEY,
    scenario: '[The Bunker] 잠금 해제',
    func() {
      const title = store.settings.language === 'en' ? 'Reward for unlocking [The Bunker]' : '[더 벙커] 이용가능';
      const body = store.settings.language === 'en' ? "You can now access the [The Bunker]." : '[더 벙커]의 접근 권한이 해제되었습니다.';
      const sender = store.settings.language === 'en' ? 'System' : '시스템';
      sendMessage(MESSAGE_TYPE.REWARD, title, body, [], sender)
    },
  },
  {
    id: EVENT_ID.UNLOCK_ZONE.HOLDEM_HOUSE_MEMBERSHIP,
    scenario: '[홀덤 하우스] 잠금 해제',
    func() {
      const title = store.settings.language === 'en' ? 'Reward for unlocking [Holdem House]' : '[홀덤 하우스] 이용가능';
      const body = store.settings.language === 'en' ? "You can now access the [Holdem House]." : '[홀덤 하우스]의 접근 권한이 해제되었습니다.';
      const sender = store.settings.language === 'en' ? 'System' : '시스템';
      sendMessage(MESSAGE_TYPE.REWARD, title, body, [], sender)
    },
  },
  {
    id: EVENT_ID.UNLOCK_ZONE.ROYAL_ROOM_INVITE,
    scenario: '[로열 프라이빗 카드룸] 잠금 해제',
    func() {
      const title = store.settings.language === 'en' ? 'Reward for unlocking [Royal Private Cardroom]' : '[로열 프라이빗 카드룸] 이용가능';
      const body = store.settings.language === 'en' ? "You can now access the [Royal Private Cardroom]." : '[로열 프라이빗 카드룸]의 접근 권한이 해제되었습니다.';
      const sender = store.settings.language === 'en' ? 'System' : '시스템';
      sendMessage(MESSAGE_TYPE.REWARD, title, body, [], sender)
    },
  },
  {
    id: EVENT_ID.SHARK_HUNTER_APPEARS,
    "type": "SOCIAL",
    "sender": "Fan_Club_Prez",
    "title_ko": "샤크 사냥꾼 등장!",
    "title_en": "Shark Hunter Appears!",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    "body_ko": "와 대박! 너 랭킹 게시판 떴어! 그 유명한 'Sharkill' 잡았다며? 사인 좀 해주라 ㅋㅋㅋ",
    "body_en": "Wow, amazing! You made it to the rankings board! I heard you caught the famous 'Sharkill'? Can I get an autograph lol",
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    condition: () => {
      return getBustEnemyCount(ENEMY_ID.SHARK) > 0;
    },
    timer: 123, // after 2 hour(in game)
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender)
    },
    repeatable: false
  },
  {
    id: EVENT_ID.GANGSTER_WARNING,
    "type": "SOCIAL",
    "sender": "The_Syndicate",
    "title_ko": "경고장",
    "title_en": "Warning Letter",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    "body_ko": "이봐, 우리 구역에서 노름을 하고 싶으면 상납금을 내야지? 이번엔 말로 하지만, 다음엔 네 놈의 그 예쁜 손가락을 가져가겠다. - The_Syndicate",
    "body_en": "Listen up, if you want to play poker in our district, you must pay tributes, right? This time it's just words, but next time I'll take those pretty fingers of yours. - The_Syndicate",
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    condition: () => {
      return getBustEnemyCount(ENEMY_ID.GANGSTER) > 0;
    },
    timer: 123, // after 2 hour(in game)
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender)
    },
    repeatable: false
  },
  {
    id: EVENT_ID.FIRST_PAY_RENT_BILL,
    scenario: '게임 시작 후 얼마지나지 않아 첫 주거 렌트비 지불 메시지',
    timer: 30 * 60, // after 1 DAY 6 hour(in game)
    func() {
      scheduleEvent(EVENT_ID.PAY_RENT_BILL, 3)
      scheduleEvent(EVENT_ID.PAY_RENT_BILL_WARNING, 5)
    },
    repeatable: false
  },
  {
    id: EVENT_ID.PAY_RENT_BILL_WARNING,
    scenario: '게임시작후 얼마 지나지 않아 임대인의 렌트비 독촉 메시지',
    func() {
      const title = store.settings.language === 'en' ? '[Final Warning] Rent Payment Overdue' : '[최후 통첩] 밀린 렌트비 납부 요망';
      const body = store.settings.language === 'en' ? "You've been missing rent payments lately. Act right. If you miss 3 times, you're immediately evicted, so figure it out. Deposit 5000 CR right now." : '요즘 자꾸 렌트비가 밀리고 있어. 처신 똑바로 해. 3번 이상 밀리면 즉시 퇴거 조치니까 알아서 해라. 당장 5000 CR 입금해.';
      const sender = store.settings.language === 'en' ? 'Landlord' : '임대인';
      sendMessage(MESSAGE_TYPE.SOCIAL, title, body, [], sender)
    },
    repeatable: false
  },
  {
    id: EVENT_ID.PAY_RENT_BILL,
    scenario: '렌트비 지불 (주기)',
    timer: 7 * 24 * 60, // 7 days
    func() {
      gainMissedPayments(MISSED_PAYMENT_TYPE.RENT_BILL, 1);
      if (getMissedPayments(MISSED_PAYMENT_TYPE.RENT_BILL) >= 3) {
        const reason = store.settings.language === 'en' ? '[Eviction] You were kicked out onto the streets due to 3 missed rent payments.' : '[퇴거 조치] 렌트비 3회 미납으로 인해 길거리로 쫓겨났습니다.';
        handleGameOver(reason);
        return;
      }
      const title = store.settings.language === 'en' ? 'Pay Rent Bill' : '렌트비 고지서';
      const body = store.settings.language === 'en' ? `You have a rent bill to pay. (Missed: ${getMissedPayments(MISSED_PAYMENT_TYPE.RENT_BILL)}/3)` : `납부해야 할 주거 렌트비가 있습니다. (미납: ${getMissedPayments(MISSED_PAYMENT_TYPE.RENT_BILL)}/3)`;
      const sender = store.settings.language === 'en' ? 'System' : 'System';
      sendMessage(MESSAGE_TYPE.FINANCE, title, body, [{
        label: MESSAGE_ACTION_LABEL_TYPE.PAY,
        actionType: MESSAGE_ACTION_TYPE.PAY_RENT,
        payload: {
          currency: 'CR',
          amount: pay_rent_bill
        }
      }], sender)
    },
    repeatable: true
  },
  {
    id: EVENT_ID.INCOME_TAX,
    scenario: '소득세를 지불 (주기)',
    timer: 90 * 24 * 60, // 90 days
    func() {
      const pay_income_tax = getTotalIncomeTaxCalculated();
      if (pay_income_tax <= 0) return;
      gainMissedPayments(MISSED_PAYMENT_TYPE.INCOME_TAX, 1);
      if (getMissedPayments(MISSED_PAYMENT_TYPE.INCOME_TAX) >= MAX_MISS[MISSED_PAYMENT_TYPE.INCOME_TAX]) {
        const reason = store.settings.language === 'en' ? '[Asset Seizure] All your assets have been seized by the IRS due to 3 missed income tax payments.' : '[자산 압류] 소득세 3회 미납으로 인해 국세청에 모든 자산을 압류당했습니다.';
        handleGameOver(reason);
        return;
      }
      const title = store.settings.language === 'en' ? 'Pay Income Tax' : '소득세 고지서';
      const body = store.settings.language === 'en' ? `You have an income tax to pay. (Missed: ${getMissedPayments(MISSED_PAYMENT_TYPE.INCOME_TAX)}/3)` : `납부해야 할 소득세가 있습니다. (미납: ${getMissedPayments(MISSED_PAYMENT_TYPE.INCOME_TAX)}/3)`;
      const sender = store.settings.language === 'en' ? 'System' : 'System';

      sendMessage(MESSAGE_TYPE.FINANCE, title, body, [{
        label: MESSAGE_ACTION_LABEL_TYPE.PAY,
        actionType: MESSAGE_ACTION_TYPE.PAY_INCOME_TAX,
        payload: {
          currency: 'CR',
          amount: Math.ceil(pay_income_tax)
        }
      }], sender)
    },
    repeatable: true
  },
];
const START_TIME = new Date('2057-01-20T09:00:00').getTime();

export const scheduleEvent = (eventId, delayMinutes = 0, payload = {}) => {
  // Prevent duplicate scheduling if it's already pending or completed
  if (store.completedEvents.includes(eventId) && !EventData.find(e => e.id === eventId).repeatable) return;
  if (store.pendingEvents.some(e => e.id === eventId)) return;

  const triggerTime = store.gameTime + (delayMinutes * 60000);
  store.pendingEvents.push({ id: eventId, triggerTime, payload });
  console.log(`[EVENT] Scheduled '${eventId}' for +${delayMinutes}m`);
};
export const isEventCompleted = (eventId) => {
  return store.completedEvents.includes(eventId);
}
export const processEvents = () => {
  const elapsedMinutes = Math.floor((store.gameTime - START_TIME) / 60000);
  const now = store.gameTime;

  // 1. Process standard Time/Condition Based Events
  EventData.forEach(event => {
    // 단발성 이벤트인데 이미 완료되었다면 무시 (스케줄된 이벤트는 pendingEvents 에서 관리됨)
    if (!event.repeatable && store.completedEvents.includes(event.id)) return;
    // 명시적으로 조건 함수가 없으면 타이머만 체크 (연계 이벤트들은 타이머가 없고 큐로 관리댐)
    if (event.condition === undefined && event.timer === undefined) return;

    let shouldTrigger = false;

    // 조건 함수가 있는 이벤트의 경우, 조건을 만족하지 않으면 검사 건너뜀
    if (event.condition && !event.condition()) {
      return;
    }

    if (!event.repeatable) {
      if (event.timer !== undefined && elapsedMinutes >= event.timer) {
        shouldTrigger = true;
      }
    } else {
      // 반복성 이벤트는 지정된 분 단위마다 정확히 발생
      if (event.timer !== undefined && elapsedMinutes > 0 && elapsedMinutes % event.timer === 0) {
        shouldTrigger = true;
      }
    }

    if (shouldTrigger) {
      event.func();
      if (!event.repeatable) {
        store.completedEvents.push(event.id);
      }
    }
  });

  // 2. Process Pending (Scheduled/Queued) Events
  if (store.pendingEvents && store.pendingEvents.length > 0) {
    const triggeredEvents = [];
    const remainingEvents = [];

    // 실행할 이벤트와 대기할 이벤트를 먼저 분리
    store.pendingEvents.forEach(pending => {
      if (now >= pending.triggerTime) {
        triggeredEvents.push(pending);
      } else {
        remainingEvents.push(pending);
      }
    });

    // 큐를 먼저 갱신. (이렇게 해야 아래 func() 안에서 스케줄링된 새 이벤트가 날아가지 않고 올바르게 추가됨)
    store.pendingEvents = remainingEvents;

    // 분리된 이벤트 실행
    triggeredEvents.forEach(pending => {
      const eventDef = EventData.find(e => e.id === pending.id);
      if (eventDef) {
        // [FIX] Prevent re-triggering completed non-repeatable events
        if (!eventDef.repeatable && store.completedEvents.includes(pending.id)) {
          console.info(`[EVENT] Skipping already completed '${pending.id}'`);
          return;
        }

        console.info(`[EVENT] Triggering '${pending.id}'`);
        eventDef.func(pending.payload); // 대기열에서 조건 달성 즉시 실행
        if (!eventDef.repeatable) {
          store.completedEvents.push(pending.id);
        }
      } else {
        console.info(`[EVENT] Not Found '${pending.id}'`);
      }
    });
  }
};