// for first player
import { sendMessage, MESSAGE_TYPE } from "./messageSystem.js";
import { store, saveStore } from "./store.js";
import { EVENT_FLORENCE, EventData as FlorenceEventData } from "./eventSystemFlorence.js";
import { EVENT_MAX, EventData as MaxEventData } from "./eventSystemMax.js";
const pay_rent_bill = 5000;

export const EVENT_ID = {
  FIRST_PAY_RENT_BILL: 'first_pay_rent_bill',
  PAY_RENT_BILL_WARNING: 'pay_rent_bill_warning',
  PAY_RENT_BILL: 'pay_rent_bill',
  INCOME_TAX: 'income_tax',
  MAX: EVENT_MAX,
  FLORENCE: EVENT_FLORENCE
};

const handleGameOver = async (reason) => {
  store.isRealGameOver = true;
  store.realGameOverReason = reason;
  await saveStore(); // 강제 종료 방지: 사망 상태 즉시 저장
};
export const EventData = [
  ...FlorenceEventData,
  ...MaxEventData,
  {
    id: EVENT_ID.FIRST_PAY_RENT_BILL,
    title_ko: '첫 주거 렌트비 지불',
    title_en: 'Pay Rent Bill',
    body_ko: '납부해야 할 주거 렌트비가 있습니다. 연체료를 피하려면 지금 납부하세요.',
    body_en: 'You have a rent bill to pay. Pay it now to avoid penalties.',
    sender_ko: '시스템',
    sender_en: 'System',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    label_ko: '지불',
    label_en: 'Pay',
    timer: 120, // after 2 hour(in game)
    func() {
      const pay_rent_bill = 5000;
      sendMessage(MESSAGE_TYPE.TUTORIAL, this.title, this.body, [{
        label: `${this.label} (${pay_rent_bill}) CR`,
        actionType: `PAY_RENT`,
        payload: {
          amount: pay_rent_bill
        }
      }], this.sender)
    },
    repeatable: false
  },
  {
    id: EVENT_ID.PAY_RENT_BILL_WARNING,
    description_ko: '렌트비 지불',
    description_en: 'Pay Rent',
    get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
    timer: 150, // after 2.5 hour(in game)
    func() {
      const title = store.settings.language === 'en' ? '[Final Warning] Rent Payment Overdue' : '[최후 통첩] 밀린 렌트비 납부 요망';
      const body = store.settings.language === 'en' ? "You've been missing rent payments lately. Act right. If you miss 3 times, you're immediately evicted, so figure it out. Deposit 5000 CR right now." : '요즘 자꾸 렌트비가 밀리고 있어. 처신 똑바로 해. 3번 이상 밀리면 즉시 퇴거 조치니까 알아서 해라. 당장 5000 CR 입금해.';
      const sender = store.settings.language === 'en' ? 'Landlord' : '임대인';
      sendMessage(MESSAGE_TYPE.SOCIAL, title, body, [], sender)
    },
    repeatable: false
  },
  {
    id: 'pay_rent_bill',
    description_ko: '렌트비 지불 (주기)',
    description_en: 'Pay Rent (Periodic)',
    get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
    timer: 7 * 24 * 60, // 7 days
    func() {
      store.missedPayments.rent_bill = (store.missedPayments.rent_bill || 0) + 1;

      if (store.missedPayments.rent_bill > 3) {
        const reason = store.settings.language === 'en' ? '[Eviction] You were kicked out onto the streets due to 3 missed rent payments.' : '[퇴거 조치] 렌트비 3회 미납으로 인해 길거리로 쫓겨났습니다.';
        handleGameOver(reason);
        return;
      }

      const title = store.settings.language === 'en' ? 'Pay Rent Bill' : '렌트비 고지서';
      const body = store.settings.language === 'en' ? `You have a rent bill to pay. Pay it now to avoid eviction. (Missed: ${store.missedPayments.rent_bill - 1}/3)` : `납부해야 할 주거 렌트비가 있습니다. 퇴거 조치를 피하려면 지금 납부하세요. (미납: ${store.missedPayments.rent_bill - 1}/3)`;
      const sender = store.settings.language === 'en' ? 'System' : '시스템';
      const label = store.settings.language === 'en' ? `Pay (${pay_rent_bill} CR)` : `지불 (${pay_rent_bill} CR)`;

      sendMessage(MESSAGE_TYPE.FINANCE, title, body, [{
        label: label,
        actionType: PAY_RENT,
        payload: {
          amount: pay_rent_bill
        }
      }], sender)
    },
    repeatable: true
  },
  {
    id: EVENT_ID.INCOME_TAX,
    description_ko: '소득세를 지불 (주기)',
    description_en: 'Pay Income Tax (Periodic)',
    get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
    timer: 90 * 24 * 60, // 90 days
    func() {
      const income_amount = (store.bankroll - store.latest_pay_income_base_amount);
      if (income_amount <= 0) return;

      store.missedPayments.income_tax = (store.missedPayments.income_tax || 0) + 1;

      if (store.missedPayments.income_tax > 3) {
        const reason = store.settings.language === 'en' ? '[Asset Seizure] All your assets have been seized by the IRS due to 3 missed income tax payments.' : '[자산 압류] 소득세 3회 미납으로 인해 국세청에 모든 자산을 압류당했습니다.';
        handleGameOver(reason);
        return;
      }

      let progressive_income_tax = 0.1;
      if (income_amount > 100000) progressive_income_tax += 0.05;
      if (income_amount > 500000) progressive_income_tax += 0.1;
      if (income_amount > 1000000) progressive_income_tax += 0.15;
      if (income_amount > 5000000) progressive_income_tax += 0.2;
      if (income_amount > 10000000) progressive_income_tax += 0.25;
      const pay_income_tax = income_amount * progressive_income_tax;

      const title = store.settings.language === 'en' ? 'Pay Income Tax' : '소득세 고지서';
      const body = store.settings.language === 'en' ? `You have an income tax to pay. Pay it now to avoid penalties. (Missed: ${store.missedPayments.income_tax - 1}/3)` : `납부해야 할 소득세가 있습니다. 연체료를 피하려면 지금 납부하세요. (미납: ${store.missedPayments.income_tax - 1}/3)`;
      const sender = store.settings.language === 'en' ? 'System' : '시스템';
      const label = store.settings.language === 'en' ? 'Pay' : '지불';

      sendMessage(MESSAGE_TYPE.FINANCE, title, body, [{
        label: label,
        actionType: 'PAY_INCOME_TAX',
        payload: {
          amount: Math.ceil(pay_income_tax)
        }
      }], sender)
    },
    repeatable: true
  },

];

const START_TIME = new Date('2057-01-20T09:00:00').getTime();

export const scheduleEvent = (eventId, delayMinutes = 0) => {
  // Prevent duplicate scheduling if it's already pending or completed
  if (store.completedEvents.includes(eventId)) return;
  if (store.pendingEvents.some(e => e.id === eventId)) return;

  const triggerTime = store.gameTime + (delayMinutes * 60000);
  store.pendingEvents.push({ id: eventId, triggerTime });
  console.log(`[EVENT] Scheduled '${eventId}' for +${delayMinutes}m`);
};
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
    store.pendingEvents = store.pendingEvents.filter(pending => {
      if (now >= pending.triggerTime) {
        const eventDef = EventData.find(e => e.id === pending.id);
        if (eventDef) {
          eventDef.func(); // 대기열에서 조건 달성 즉시 실행
          if (!eventDef.repeatable) {
            store.completedEvents.push(pending.id);
          }
        }
        return false; // 실행 완료 후 큐에서 삭제
      }
      return true; // 시간이 안 됐으면 큐에 유지
    });
  }
};