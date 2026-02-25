// for first player
import { sendMessage, MESSAGE_TYPE } from "./messageSystem.js";
import { store, saveStore } from "./store.js";

const pay_rent_bill = 5000;

export const EVENT_ID = {
  FIRST_PAY_RENT_BILL: 'first_pay_rent_bill',
  PAY_RENT_BILL_WARNING: 'pay_rent_bill_warning',
  YOU_GET_SOME_SLEEP: 'you_get_some_sleep',
  BIG_LOSE: 'big_lose',
  PAY_RENT_BILL: 'pay_rent_bill',
  INCOME_TAX: 'income_tax',
  FISH_HUNTER: 'fish_hunter',
  TUTORIAL_START: 'TUTORIAL_START', // MAX와의 튜토리얼 시작
  TUTORIAL_THEN_LEAVE_RETRY: 'TUTORIAL_THEN_LEAVE_RETRY', // 튜토리얼에서 게임 포기(이탈) 이후 재시도

  TUTORIAL_THEN_LOSE_RETRY: 'TUTORIAL_THEN_LOSE_RETRY', // 튜토리얼에서 테이블 이탈 이후 재시도
  TUTORIAL_WIN: 'TUTORIAL_WIN', // 튜토리얼 승리
  TUTORIAL_WIN_MAX: 'TUTORIAL_WIN_MAX', // 튜토리얼 승리(MAX 대행승)
  TUTORIAL_LOSE_MAX: 'TUTORIAL_LOSE_MAX', // 튜토리얼 진행중 MAX 중도 패배
  TUTORIAL_LOSE_PLAYER: 'TUTORIAL_LOSE_PLAYER', // 튜토리얼 패배 (플레이어)
  TUTORIAL_LEAVE: 'TUTORIAL_LEAVE', // 튜토리얼 패배 (이탈)
  TUTORIAL_LEAVE_AGAIN: 'TUTORIAL_LEAVE_AGAIN', // 튜토리얼에서에서 2번이상 이탈시
  TUTORIAL_WIN_AFTER: 'TUTORIAL_WIN_AFTER', // 튜토리얼 승리 후
};

const handleGameOver = async (reason) => {
  store.isRealGameOver = true;
  store.realGameOverReason = reason;
  await saveStore(); // 강제 종료 방지: 사망 상태 즉시 저장
};
export const EventData = [
  {
    id: EVENT_ID.FIRST_PAY_RENT_BILL,
    description_ko: '첫 주거 렌트비를 지불하세요.',
    description_en: 'Pay your first residential rent.',
    get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
    timer: 120, // after 2 hour(in game)
    func() {
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
    id: EVENT_ID.PAY_RENT_BILL_WARNING,
    description_ko: '렌트비를 지불',
    description_en: 'Pay Rent',
    get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
    timer: 150, // after 2.5 hour(in game)
    func() {
      const title = store.settings.language === 'en' ? '[Final Warning] Rent Payment Overdue' : '[최후 통첩] 밀린 렌트비 납부 요망';
      const body = store.settings.language === 'en' ? "You've been missing rent payments lately. Act right. If you miss 3 times, you're immediately evicted, so figure it out. Deposit 5000 CR right now." : '요즘 자꾸 렌트비가 밀리고 있어. 처신 똑바로 해. 3번 이상 밀리면 즉시 퇴거 조치니까 알아서 해라. 당장 5000 CR 입금해.';
      const sender = store.settings.language === 'en' ? 'Building Owner' : '건물주';
      sendMessage(MESSAGE_TYPE.SOCIAL, title, body, [], sender)
    },
    repeatable: false
  },
  {
    id: EVENT_ID.YOU_GET_SOME_SLEEP,
    title_ko: '어서 집에가서 잠 좀 자',
    title_en: 'You need to get some sleep.',
    body_ko: '이봐 친구, 잠좀 자면서 포커쳐. 너 아까 내가 나가면서 봤는데 포커 테이블에서 반쯤 졸고있던데 그러다가 돈 다 잃는다?',
    body_en: 'Hey friend, get some sleep while playing poker. I saw you half-asleep at the poker table just now, and you might lose all your money.',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    timer: 20, // after 20 minutes(in game)
    condition() {
      // 체력이 20 이하로 떨어졌을 때 활성화
      return store.stamina <= 25;
    },
    func() {
      store.stamina += 10; // a little bit recovery (for text message read)
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender)
    },
    repeatable: false
  },
  {
    id: EVENT_ID.BIG_LOSE,
    title_ko: '그렇게 치다간 하루도 못가 파산할 거야.',
    title_en: 'You are going to be bankrupt if you keep playing like this.',
    body_ko: '게임이 안될때는 테이블에서 일어날 줄 알아야해 내가 돈 좀 보내 놨으니 가서 뭐 좀 사먹으면서 쉬어라.',
    body_en: 'When the game is not going well, get off the table and take a break. I sent you some money, so go get something to eat and rest.',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    timer: 5, // after 5 minutes(in game)
    condition() {
      return store.bankroll <= 5000;
    },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [{
        label: `RECEIVE (2000 CR)`,
        actionType: 'RECEIVE',
        payload: {
          amount: 2000
        }
      }], this.sender)
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
  {// simulate repeatable event
    id: EVENT_ID.FISH_HUNTER,
    title_ko: '피쉬들 모인 테이블을 찾았다.',
    title_en: 'I found a table full of fish.',
    body_ko: 'ㅋㅋ 내가 정보 지금 보내줄께, 딱 너가 좋아하는 스타일의 테이블이야',
    body_en: 'Hehe, I\'ll send you the information right now. It\'s exactly your style of table.',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    label_ko: '참가하기',
    label_en: 'Join',
    timer: 6 * 24 * 60, // 6 days
    condition() {
      return store.completedEvents.includes(EVENT_ID.TUTORIAL_WIN_AFTER)
    },
    func() {
      sendMessage(MESSAGE_TYPE.TIER_EVENT, this.title, this.body, [
        {
          label: this.label,
          actionType: 'ACCEPT_INVITE',
          payload: {
            location_id: 'free_safe_house'
          }
        }
      ], this.sender)
    },
    repeatable: true // if repeatable is true, do not register store.completedEvents
  },
  {
    id: EVENT_ID.TUTORIAL_START,
    desc_for_dev: 'max가 플레이어에게 포커를 가르쳐주는 이벤트',
    title_ko: '어이, 포커 한 수 배워볼래?',
    title_en: 'Hey, wanna learn some poker?',
    body_ko: '쌩초보 냄새가 풀풀 나는데 내가 특별히 가르쳐주마. 뒷골목으로 따라와, 내가 테이블에서 어떻게 하는지 두 눈 똑바로 뜨고 지켜보라고. 알겠어?',
    body_en: 'You smell like a total rookie. Follow me to the backroom and watch exactly how I play at the table. Got it?',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    label_ko: '참가하기',
    label_en: 'Join',
    timer: 20, // 30 minutes
    condition() {
      // return store.bankroll > 1000 && store.cleared_zones.includes('free_street_shop');
      return true // for test
    },
    func() {
      sendMessage(MESSAGE_TYPE.TUTORIAL, this.title, this.body, [
        {
          label: this.label,
          actionType: 'ACCEPT_INVITE',
          payload: {
            location_id: 'free_street_shop_with_max',
            guest: 'Max'
          }
        }
      ], this.sender)
    },
    repeatable: false // if repeatable is true, do not register store.completedEvents
  },
  {
    id: EVENT_ID.TUTORIAL_THEN_LEAVE_RETRY,
    desc_for_dev: 'max가 플레이어에게 포커를 가르쳐주는 이벤트(도망간 후 재시도)',
    title_ko: '어이, 어디가?',
    title_en: 'Hey, where are you running off to?',
    body_ko: '지금 진지하게 가르쳐 주려는데 어디가냐? 얼른 안 돌아와? 이번엔 중간에 도망가면 진짜 가만 안 둔다.',
    body_en: 'I\'m trying to teach you something here. Better get back here. Run away again, and we’re gonna have a problem.',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    label_ko: '참가하기',
    label_en: 'Join',
    func() {
      // (Removed incorrect forced TUTORIAL_LOSE_MAX schedule)
      sendMessage(MESSAGE_TYPE.TUTORIAL, this.title, this.body, [
        {
          label: this.label,
          actionType: 'ACCEPT_INVITE',
          payload: {
            location_id: 'free_street_shop_with_max',
          }
        }
      ], this.sender)
    },
    repeatable: false
  },

  {
    id: EVENT_ID.TUTORIAL_THEN_LOSE_RETRY,
    desc_for_dev: 'max가 플레이어에게 포커를 가르쳐주는 이벤트(패배시 후속 이벤트 발생)',
    title_ko: '하아... 진짜 드럽게 못하네',
    title_en: 'Man... you really suck at this.',
    body_ko: '내가 처음부터 다시 빡세게 굴려줄 테니까 당장 다시 뒷골목으로 기어와. 이대로 보낼 순 없다.',
    body_en: 'I\'m gonna drill you from the top, so get your ass back here. I ain\'t letting you leave like a loser.',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    label_ko: '참가하기',
    label_en: 'Join',
    func() {
      sendMessage(MESSAGE_TYPE.TUTORIAL, this.title, this.body, [
        {
          label: this.label,
          actionType: 'ACCEPT_INVITE',
          payload: {
            location_id: 'free_street_shop_with_max',
          }
        }
      ], this.sender)
    },
    repeatable: false
  },
  {
    id: EVENT_ID.TUTORIAL_WIN,
    desc_for_dev: 'max가 플레이어에게 포커를 가르쳐주는 이벤트 연계(승리시)',
    title_ko: '와 씨... 내가 질 줄은 몰랐네',
    title_en: 'Well I\'ll be damned... didn\'t think I\'d lose.',
    body_ko: '너 제법 재능이 있잖아? 뭐, 내가 잘 가르친 덕분이지만 ㅋㅋㅋ 짜식, 인정한다.',
    body_en: 'You got some talent, kid. Course, it\'s mostly \'cause of my teaching! Haha, alright, I respect that.',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    label_ko: '알았어',
    label_en: 'OK',
    func() {
      sendMessage(MESSAGE_TYPE.TUTORIAL, this.title, this.body, [
        {
          label: this.label,
        }
      ], this.sender)
      scheduleEvent(EVENT_ID.TUTORIAL_WIN_AFTER, 1); // 연계 튜토리얼 2탄 스케줄 예약 가능
    },
    repeatable: false
  },
  {
    id: EVENT_ID.TUTORIAL_WIN_AFTER,
    desc_for_dev: 'max가 플레이어에게 포커를 가르쳐주는 이벤트 연계(승리 후)',
    title_ko: '어쨌든...',
    title_en: 'Anyway...',
    body_ko: '덕분에 나도 몸 좀 풀었다. 나중에 물 좋은 테이블 보이면 연락 때릴 테니까, 대기타고 있어! 알았지?',
    body_en: 'That was a good warmup for me too. I\'ll hit you up when I find a juicy table, so stay sharp! Got it?',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    label_ko: '알았어',
    label_en: 'OK',
    func() {
      sendMessage(MESSAGE_TYPE.TUTORIAL, this.title, this.body, [
        {
          label: this.label,
        }
      ], this.sender)
      scheduleEvent(EVENT_ID.FISH_HUNTER, 0); // 연계 튜토리얼 2탄 스케줄 예약 가능
    },
    repeatable: false
  },
  {
    id: EVENT_ID.TUTORIAL_WIN_MAX,
    desc_for_dev: 'max가 플레이어에게 포커를 가르쳐주는 이벤트 연계(MAX의 최종 승리시)',
    title_ko: '크하하! 어떠냐, 이게 바로 짬바다!',
    title_en: 'Hahaha! How about that? Experience talking!',
    body_ko: '너도 나쁘진 않았는데, 나한텐 아직 멀었어 ㅋㅋㅋ 자, 그래도 고생했으니 택시비나 해라.',
    body_en: 'You weren\'t bad, but you\'re not on my level yet. Here, take this for the cab ride home.',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    label_ko: '알았어',
    label_en: 'OK',
    func() {
      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body, [
        {
          label: `${this.label} (2,500 CR)`,
          actionType: 'RECEIVE',
          payload: {
            amount: 2500
          }
        }
      ], this.sender)
      scheduleEvent(EVENT_ID.TUTORIAL_WIN_AFTER, 1);
    },
    repeatable: false
  },
  {
    id: EVENT_ID.TUTORIAL_LOSE_MAX,
    desc_for_dev: 'Max가 플레이어에게 포커를 가르쳐주는 이벤트 연계(Max가 먼저 파산시)',
    title_ko: '아오 ㅆ... 오늘 패가 왜 이따위냐!!',
    title_en: 'Dammit... what are these cards today!!',
    body_ko: '진짜 난 운이 더럽게 없네 썅! 야, 나는 먼저 올인났으니 너라도 딴 놈들 다 이겨봐라!',
    body_en: 'My luck is absolute trash right now. Hey, I\'m busted, so you better win this whole thing for both of us!',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    label_ko: '알았어',
    label_en: 'OK',
    func() {
      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body, [
        {
          label: this.label,
        }
      ], this.sender)
    },
    repeatable: false
  },
  {
    id: EVENT_ID.TUTORIAL_LOSE_PLAYER,
    desc_for_dev: 'Max가 플레이어에게 포커를 가르쳐주는 이벤트 연계(Max 보다 먼저 패배)',
    title_ko: '야... 너 내 말은 귓등으로 듣냐?',
    title_en: 'Are you even listening to me when you play?',
    body_ko: '내가 기초부터 다 알려줬잖아! 에효... 밥이나 든든하게 먹고 칩 좀 챙겨서 대기해라, 쫌 이따 다시 부를 테니까.',
    body_en: 'I taught you the basics! Sigh... Go get some hot food and grab some chips. I\'ll call you back shortly.',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    label_ko: '알았어',
    label_en: 'OK',
    func() {
      scheduleEvent(EVENT_ID.TUTORIAL_THEN_LOSE_RETRY, 10); // 10분 뒤 이어서 재도전 메시지 발송 
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [
        {
          label: `${this.label} (1,000 CR)`,
          actionType: 'RECEIVE',
          payload: {
            amount: 1000
          }
        }
      ], this.sender)
    },
    repeatable: false
  },
  {
    id: EVENT_ID.TUTORIAL_LEAVE,
    desc_for_dev: 'Max가 플레이어에게 포커를 가르쳐주는 이벤트 연계(테이블 이탈)',
    title_ko: '야, 어디가?',
    title_en: 'Hey, where are you going?',
    body_ko: '뭐 급한 일 있냐? 텍사스 남자답지 못하게 꽁무니를 빼네. 좀 이따 다시 연락한다.',
    body_en: 'Something urgent? Running off doesn\'t seem very Texan to me. I\'ll hit you up again shortly.',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    label_ko: '알았어',
    label_en: 'OK',
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender);
      scheduleEvent(EVENT_ID.TUTORIAL_THEN_LEAVE_RETRY, 5);
    },
    repeatable: false
  },
  {
    id: EVENT_ID.TUTORIAL_LEAVE_AGAIN,
    desc_for_dev: 'Max가 플레이어에게 포커를 가르쳐주는 이벤트 연계(테이블 재 이탈)',
    title_ko: '이 자식이 진짜 돌았나...',
    title_en: 'Are you out of your mind...',
    body_ko: '불러줬더니 또 도망가? 장난치냐 지금?! 다시는 나한테 배울 생각 마라!',
    body_en: 'I invite you and you run away again? Are you kidding me?! Don\'t ever expect me to teach you again!',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    label_ko: '알았어',
    label_en: 'OK',
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender)
    },
    repeatable: false
  }
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