// for first player
import { sendMessage, MESSAGE_TYPE } from "./messageSystem.js";
import { store, saveStore } from "./store.js";

const pay_rent_bill = 5000;

const handleGameOver = async (reason) => {
  store.isRealGameOver = true;
  store.realGameOverReason = reason;
  await saveStore(); // 강제 종료 방지: 사망 상태 즉시 저장
};
export const EventData = [
  {
    id: 'first_pay_rent_bill',
    description_ko: '첫 주거 렌트비를 지불하세요.',
    description_en: 'Pay your first residential rent.',
    get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
    timer: 30, // after 1 hour(in game)
    func: () => {
      const title = store.settings.language === 'en' ? 'Pay Rent Bill' : '렌트비 고지서';
      const body = store.settings.language === 'en' ? 'You have a rent bill to pay. Pay it now to avoid penalties.' : '납부해야 할 주거 렌트비가 있습니다. 연체료를 피하려면 지금 납부하세요.';
      const sender = store.settings.language === 'en' ? 'System' : '시스템';
      const label = store.settings.language === 'en' ? 'Pay' : '지불';

      sendMessage(MESSAGE_TYPE.TUTORIAL, title, body, [{
        label: label,
        actionType: 'PAY_RENT',
        payload: {
          amount: pay_rent_bill
        }
      }], sender)
    },
    repeatable: false
  },
  {
    id: 'pay_rent_bill',
    description_ko: '렌트비를 지불',
    description_en: 'Pay Rent',
    get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
    timer: 60, // after 1 hour(in game)
    func: () => {
      const title = store.settings.language === 'en' ? '[Final Warning] Rent Payment Overdue' : '[최후 통첩] 밀린 렌트비 납부 요망';
      const body = store.settings.language === 'en' ? "You've been missing rent payments lately. Act right. If you miss 3 times, you're immediately evicted, so figure it out. Deposit 5000 CR right now." : '요즘 자꾸 렌트비가 밀리고 있어. 처신 똑바로 해. 3번 이상 밀리면 즉시 퇴거 조치니까 알아서 해라. 당장 5000 CR 입금해.';
      const sender = store.settings.language === 'en' ? 'Building Owner' : '건물주';
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
    func: () => {
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
    id: 'income_tax',
    description_ko: '소득세를 지불 (주기)',
    description_en: 'Pay Income Tax (Periodic)',
    get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
    timer: 90 * 24 * 60, // 90 days
    func: () => {
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
  {// simulate repeatable event
    id: 'test_event',
    description_ko: '피쉬 헌터 이벤트',
    description_en: 'Fish Hunter Event',
    get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
    timer: 7 * 24 * 60, // 7 days
    func: () => {
      if (store.play_stats.bust_enemy.Fish >= 5) {
        const title = store.settings.language === 'en' ? 'Fish Hunter' : '피쉬 헌터';
        const body = store.settings.language === 'en' ? "Found a table full of fish. I'll send you the coordinates in case you're interested." : '피쉬들 모인 테이블을 찾았다, 관심있을지 몰라 좌표를 불러줄께.';
        const sender = store.settings.language === 'en' ? 'Fish Hunter' : '피쉬 헌터';
        const label = store.settings.language === 'en' ? 'Join' : '참여';

        sendMessage(MESSAGE_TYPE.TIER_EVENT, title, body, [
          {
            label: label,
            actionType: 'ACCEPT_INVITE',
            payload: {
              location_id: 'free_safe_house'
            }
          }
        ], sender)
      }
    },
    repeatable: true // if repeatable is true, do not register store.completedEvents
  }
];

const START_TIME = new Date('2057-10-20T09:00:00').getTime();

export const processEvents = () => {
  const elapsedMinutes = Math.floor((store.gameTime - START_TIME) / 60000);

  EventData.forEach(event => {
    // 단발성 이벤트인데 이미 완료되었다면 무시
    if (!event.repeatable && store.completedEvents.includes(event.id)) {
      return;
    }

    let shouldTrigger = false;
    if (!event.repeatable) {
      // 지정된 타이머 이상 도달 시 최초 1회 발생
      if (elapsedMinutes >= event.timer) {
        shouldTrigger = true;
      }
    } else {
      // 반복성 이벤트는 지정된 분 단위마다 정확히 발생
      if (elapsedMinutes > 0 && elapsedMinutes % event.timer === 0) {
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
};