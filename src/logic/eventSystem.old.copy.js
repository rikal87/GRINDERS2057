// for first player
import { sendMessage, MESSAGE_TYPE } from "./messageSystem.js";
import { store, saveStore } from "./store.js";
import { PARTNER_ID } from "./partnerSystem.js";

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

  MAX_REFUSE_CONTRACT_CAUSE_YOU_HAS_DEBT: 'MAX_REFUSE_CONTRACT_CAUSE_YOU_HAS_DEBT',
  MAX_REFUSE_CONTRACT_CAUSE_YOU_HAS_RELATIONSHIP_LOW: 'MAX_REFUSE_CONTRACT_CAUSE_YOU_HAS_RELATIONSHIP_LOW',

  RESOLVED_DEBT_FOR_MAX: 'RESOLVED_DEBT_FOR_MAX',
  RESOLVED_DEBT_FOR_MAX_LOW_RELATIONSHIP: 'RESOLVED_DEBT_FOR_MAX_LOW_RELATIONSHIP',

  MAX_BREAK_CONTRACT_COLLUSION: 'MAX_BREAK_CONTRACT_COLLUSION',
  MAX_BREAK_CONTRACT_BANKRUPT_RESCUE: 'MAX_BREAK_CONTRACT_BANKRUPT_RESCUE',
  MAX_BREAK_CONTRACT_SHARE_BENEFIT: 'MAX_BREAK_CONTRACT_SHARE_BENEFIT',
  MAX_BANKRUPT: 'MAX_BANKRUPT',
  MAX_BANKRUPT_ACCEPT_RESCUE: 'MAX_BANKRUPT_ACCEPT_RESCUE',
  MAX_BANKRUPT_REFUSE_RESCUE: 'MAX_BANKRUPT_REFUSE_RESCUE',
  MAX_BANKRUPT_ACCEPT_RESCUE_LOW_RELATIONSHIPSHIP: 'MAX_BANKRUPT_ACCEPT_RESCUE_LOW_RELATIONSHIPSHIP',
  MAX_BANKRUPT_REFUSE_RESCUE_LOW_RELATIONSHIPSHIP: 'MAX_BANKRUPT_REFUSE_RESCUE_LOW_RELATIONSHIPSHIP',
  MAX_BANKRUPT_HAS_DEBT: 'MAX_BANKRUPT_HAS_DEBT',
  MAX_BANKRUPT_HAS_DEBT_LOW_RELATIONSHIP: 'MAX_BANKRUPT_HAS_DEBT_LOW_RELATIONSHIP',
  MAX_BANKRUPT_HAS_CONTRACT_BANKRUPT_RESCUE: 'MAX_BANKRUPT_HAS_CONTRACT_BANKRUPT_RESCUE',
  MAX_BANKRUPT_HAS_CONTRACT_BANKRUPT_RESCUE_FAIL: 'MAX_BANKRUPT_HAS_CONTRACT_BANKRUPT_RESCUE_FAIL',
  MAX_SIGN_CONTRACT_SHARE_BENEFIT: 'MAX_SIGN_CONTRACT_SHARE_BENEFIT',
  MAX_SIGN_CONTRACT_COLLUSION: 'MAX_SIGN_CONTRACT_COLLUSION',
  MAX_SIGN_CONTRACT_BANKRUPT_RESCUE: 'MAX_SIGN_CONTRACT_BANKRUPT_RESCUE',
  MAX_GONE: 'MAX_GONE',
  FLORENCE_REFUSE_CONTRACT_CAUSE_YOU_HAS_DEBT: 'FLORENCE_REFUSE_CONTRACT_CAUSE_YOU_HAS_DEBT',
  FLORENCE_REFUSE_CONTRACT_CAUSE_YOU_HAS_RELATIONSHIP_LOW: 'FLORENCE_REFUSE_CONTRACT_CAUSE_YOU_HAS_RELATIONSHIP_LOW',
  FLORENCE_BANKRUPT: 'FLORENCE_BANKRUPT',
  FLORENCE_BANKRUPT_HAS_DEBT: 'FLORENCE_BANKRUPT_HAS_DEBT',
  FLORENCE_BANKRUPT_HAS_DEBT_LOW_RELATIONSHIP: 'FLORENCE_BANKRUPT_HAS_DEBT_LOW_RELATIONSHIP',
  FLORENCE_BANKRUPT_REFUSE_RESCUE: 'FLORENCE_BANKRUPT_REFUSE_RESCUE',
  FLORENCE_BANKRUPT_ACCEPT_RESCUE_LOW_RELATIONSHIPSHIP: 'FLORENCE_BANKRUPT_ACCEPT_RESCUE_LOW_RELATIONSHIPSHIP',
  FLORENCE_BANKRUPT_REFUSE_RESCUE_LOW_RELATIONSHIPSHIP: 'FLORENCE_BANKRUPT_REFUSE_RESCUE_LOW_RELATIONSHIPSHIP',
  FLORENCE_BANKRUPT_HAS_CONTRACT_BANKRUPT_RESCUE: 'FLORENCE_BANKRUPT_HAS_CONTRACT_BANKRUPT_RESCUE',
  FLORENCE_BANKRUPT_HAS_CONTRACT_BANKRUPT_RESCUE_FAIL: 'FLORENCE_BANKRUPT_HAS_CONTRACT_BANKRUPT_RESCUE_FAIL',
  FLORENCE_BREAK_CONTRACT_COLLUSION: 'FLORENCE_BREAK_CONTRACT_COLLUSION',
  FLORENCE_BREAK_CONTRACT_BANKRUPT_RESCUE: 'FLORENCE_BREAK_CONTRACT_BANKRUPT_RESCUE',
  FLORENCE_BREAK_CONTRACT_SHARE_BENEFIT: 'FLORENCE_BREAK_CONTRACT_SHARE_BENEFIT',
  FLORENCE_SIGN_CONTRACT_COLLUSION: 'FLORENCE_SIGN_CONTRACT_COLLUSION',
  FLORENCE_SIGN_CONTRACT_SHARE_BENEFIT: 'FLORENCE_SIGN_CONTRACT_SHARE_BENEFIT',
  FLORENCE_SIGN_CONTRACT_BANKRUPT_RESCUE: 'FLORENCE_SIGN_CONTRACT_BANKRUPT_RESCUE',
  FLORENCE_SIGN_CONTRACT_DATE_WITH_ME: 'FLORENCE_SIGN_CONTRACT_DATE_WITH_ME',
  FLORENCE_GONE: 'FLORENCE_GONE',
};

const handleGameOver = async (reason) => {
  store.isRealGameOver = true;
  store.realGameOverReason = reason;
  await saveStore(); // 강제 종료 방지: 사망 상태 즉시 저장
};
export const EventData = [
  {
    id: EVENT_ID.MAX_GONE,
    scenario: '맥스는 파산했고, 빚을 갚지 못해 사라졌습니다. 당신은 더 이상 맥스와 함께 할 수 없습니다.',
    title_ko: '맥스가 사라졌습니다.',
    title_en: 'Max is gone',
    body_ko: '맥스는 파산했고, 빚을 갚지 못해 사라졌습니다. 당신은 더 이상 맥스와 함께 할 수 없습니다.',
    body_en: 'Max went bankrupt and disappeared because he couldn\'t pay his debts. You can no longer with Max.',
    sender_ko: '시스템',
    sender_en: 'System',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SYSTEM, this.title, this.body, [], this.sender)
    },
  },
  {
    id: EVENT_ID.FLORENCE_GONE,
    scenario: '플로렌스는 파산했고, 빚을 갚지 못해 사라졌습니다. 당신은 더 이상 플로렌스와 함께 할 수 없습니다.',
    title_ko: '플로렌스가 사라졌습니다.',
    title_en: 'Florence is gone',
    body_ko: '플로렌스는 파산했고, 빚을 갚지 못해 사라졌습니다. 당신은 더 이상 플로렌스와 함께 할 수 없습니다.',
    body_en: 'Florence went bankrupt and disappeared because she couldn\'t pay her debts. You can no longer with Florence.',
    sender_ko: '시스템',
    sender_en: 'System',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SYSTEM, this.title, this.body, [], this.sender)
    },
  },
  {
    id: EVENT_ID.MAX_SIGN_CONTRACT_COLLUSION,
    scenario: 'Max와 (함께 게임하기)계약을 체결했습니다. 이제 플레이어와 함께 게임에 참가할 것입니다!',
    title_ko: '텍사스 콤비 결성',
    title_en: 'Texas Duo Formed',
    body_ko: '하! 좋아! 나야 당근빳따 환영이지. 내가 테이블 분위기를 확 휘저어 놓을테니 넌 뒤에서 달달하게 챙겨가라고! 내 등 뒤를 잘 부탁한다 파트너.',
    body_en: 'Hah! Perfect! I\'m all in for this. I\'ll stir up the whole table with my crazy bets, you just sit back and scoop up the sweet pots! Watch my six, partner.',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender)
    },
  },
  {
    id: EVENT_ID.MAX_SIGN_CONTRACT_SHARE_BENEFIT,
    scenario: 'Max와 (수익분배)계약을 체결했습니다. 이제 서로의 수익을 일정 지분만큼 공유합니다!(다만 수익 분배가 불균형하면 관계가 악화될 수 있습니다..)',
    title_ko: '우리 사이에 이정도는 나눠야지',
    title_en: 'We Share the Spoils',
    body_ko: '내 거친 텍사스 스타일 알잖아? 내가 크게 먹든, 네가 얌전하게 쓸어 담든, 어느 쪽이든 짭짤하게 나눠 갖자고! 다만 한쪽이 계속 꿀만 빠는 그림은 피하자. 룰은 공평하게!',
    body_en: 'You know my crazy Texas style, right? Whether I hit a massive pot or you quietly rake them in, we split the loot! Just don\'t become a leech on my stack. Keep it fair!',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender)
    },
  },
  {
    id: EVENT_ID.MAX_SIGN_CONTRACT_BANKRUPT_RESCUE,
    scenario: 'Max와 (파산 구제)계약을 체결했습니다. 이제 둘 중 한명이 파산하면 초기 자금을 지원해 줄겁니다!',
    title_ko: '사나이 최고의 보험',
    title_en: 'The Ultimate Bromance Insurance',
    body_ko: '크으... 진짜 남자의 계약이지. 인생에 올인하다가 길거리에 나앉게 생기면 시원하게 쏴준다는 거잖아? 너 파산하면 내가 텍사스식 최고급 바베큐라도 사들고 찾아간다. 물론 빚은 갚아야겠지만!',
    body_en: 'Oh man... Now this is a real man\'s handshake. If one of us goes broke going all-in on life, the other bails him out! If you hit rock bottom, I\'ll come find you with some premium Texas BBQ. But you\'ll owe me big time, yeah?',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender)
    },
  },
  {
    id: EVENT_ID.FLORENCE_SIGN_CONTRACT_COLLUSION,
    scenario: 'Florence와 (함께 게임하기)계약을 체결했습니다. 이제 플레이어와 함께 게임에 참가할 것입니다!',
    title_ko: '완벽한 뱅크롤 메이트',
    title_en: 'Perfect Bankroll Mate',
    body_ko: '제 계산이 맞다면, 우리 둘이 같은 테이블에 앉을 때 테이블의 EV(기댓값)를 가장 효율적으로 흡수할 수 있어요. 라스베가스의 진짜 게임이 뭔지 보여드리죠.',
    body_en: 'If my calculations are correct, sitting at the same table allows us to absorb the table\'s EV most efficiently. Let me show you what real Las Vegas poker looks like.',
    sender_ko: '플로렌스',
    sender_en: 'Florence',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender)
    },
  },
  {
    id: EVENT_ID.FLORENCE_SIGN_CONTRACT_SHARE_BENEFIT,
    scenario: 'Florence와 (수익분배)계약을 체결했습니다. 이제 서로의 수익을 일정 지분만큼 공유합니다!(다만 수익 분배가 불균형하면 관계가 악화될 수 있습니다..)',
    title_ko: '위험 분산 포트폴리오',
    title_en: 'Risk Diversification Portfolio',
    body_ko: '포커는 결국 분산의 마법을 어떻게 통제하느냐의 싸움이죠. 당신과의 수익 해지는 제 포트폴리오를 완벽하게 보완해 줄 거예요. 물론 당신도 베테랑의 안정감을 누리게 되겠죠. 계약에 서명할게요.',
    body_en: 'Poker is ultimately a battle of controlling variance. Hedging profits with you perfectly complements my portfolio. And of course, you get to enjoy the stability of a veteran. Let\'s make it official.',
    sender_ko: '플로렌스',
    sender_en: 'Florence',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender)
    },
  },
  {
    id: EVENT_ID.FLORENCE_SIGN_CONTRACT_BANKRUPT_RESCUE,
    scenario: 'Florence와 (파산 구제)계약을 체결했습니다. 이제 둘 중 한명이 파산하면 초기 자금을 지원해 줄겁니다!',
    title_ko: '최후의 안전장치',
    title_en: 'The Final Safety Net',
    body_ko: '아무리 완벽한 TAG 플레이어라도 다운스윙은 피할 수 없어요. 파산이라는 최악의 리스크를 헷징(Hedging)하는 이 계약은 충분히 합리적이군요. 서로에게 훌륭한 안전장치가 될 거예요.',
    body_en: 'Even the most perfect TAG player can\'t escape downswings. Hedging against the worst-case scenario of bankruptcy is highly rational. This will serve as an excellent safety net for both of us.',
    sender_ko: '플로렌스',
    sender_en: 'Florence',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender)
    },
  },
  {
    id: EVENT_ID.FLORENCE_SIGN_CONTRACT_DATE_WITH_ME,
    scenario: 'Florence와 (데이트)계약을 체결했습니다. 이제 정기적으로 관계도가 변동합니다!',
    title_ko: '계산 밖의 변수',
    title_en: 'Uncalculated Variables',
    body_ko: '...포커 테이블 밖에서의 확률 계산은 좀 서투른 편인데... 특별히 조금의 감정을 허락해 보죠.',
    body_en: '...I\'m not exactly used to calculating odds away from the poker table. I might just allow a little emotion.',
    sender_ko: '플로렌스',
    sender_en: 'Florence',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender)
    },
  },
  {
    id: EVENT_ID.MAX_BANKRUPT_HAS_DEBT,
    scenario: 'Max가 파산했습니다, 플레이어에게 빚을 갚으라고 독촉합니다. (플레이어가 빚을 갚지 않으면 관계도가 계속 하락하게됩니다.)',
    title_ko: '야 나 깡통 찼다',
    title_en: 'I\'m busted.',
    body_ko: '임마, 너 나한테 빌려간 돈 안 잊었지? 내가 지금 존나게 급해서 그러는데 빨리 좀 갚아라. 나 진짜 테이블에서 쫓겨날 판이야.',
    body_en: 'Hey man, you didn\'t forget the money you owe me, right? I\'m in a damn tight spot right now, so pay up quick. I\'m about to get kicked off the table.',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body, [{
        label: this.title,
        actionType: `PAY_DEBT (${pay_rent_bill}) CR`,
        payload: {
          amount: pay_rent_bill
        }
      }], this.sender)
    },
  },
  {
    id: EVENT_ID.MAX_BANKRUPT_RESOLVE_DEBT_LOW_RELATIONSHIP,
    scenario: 'Max가 파산했고 플레이어와의 관계가 낮습니다(관계도 <= 0). 플에이어에게 빚을 갚으라고 독촉합니다. (플레이어가 빚을 갚지 않으면 게임 오버 처리합니다.)',
    title_ko: '당장 내 돈 내놔',
    title_en: 'Give me my money now.',
    body_ko: '야!! 너 때문에 내가 이 지경까지 왔잖아! 장난하냐? 뒤지게 맞기 싫으면 지금 당장 내 돈 뱉어내!',
    body_en: 'Hey!! I\'m in this mess because of you! Are you kidding me? Cough up my money right now if you don\'t want a beating!',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body, [{
        label: this.title,
        actionType: `PAY_DEBT (${pay_rent_bill}) CR`,
        payload: {
          amount: pay_rent_bill
        }
      }], this.sender)
    },
  },
  {
    id: EVENT_ID.RESOLVED_DEBT_FOR_MAX,
    scenario: '플레이어가 맥스에게 빚을 갚았습니다.',
    title_ko: '역시, 돈 관계는 철저해야지',
    title_en: 'As expected, money relationships must be thorough.',
    body_ko: '그래, 네가 빚을 갚으니 마음이 놓인다. 역시 돈 관계는 철저해야지. 다음에 또 보자.',
    body_en: 'Alright, I feel relieved now that you\'ve paid your debt. As expected, money relationships must be thorough. See you next time.',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      gainRelationship(PARTNER_ID.MAX, 200);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender)
    },
  },
  {
    id: EVENT_ID.RESOLVED_DEBT_FOR_MAX_LOW_RELATIONSHIP,
    scenario: 'Max와 플레이어와의 관계가 낮습니다(관계도 <= 0). 플레이어가 맥스에게 빚을 갚았습니다.',
    title_ko: '안주면 경찰에 신고하려 했는데',
    title_en: 'I was going to call the cops if you didn\'t pay.',
    body_ko: '진작 갚았으면 서로 좋았을거 아냐? 다음 부턴 제때 갚아라.',
    body_en: 'We would have been better off if you\'d paid me back earlier. Pay me back on time next time.',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      gainRelationship(PARTNER_ID.MAX, 50);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender)
    },
  },
  {
    id: EVENT_ID.MAX_BANKRUPT,
    scenario: 'Max가 파산했습니다. 플레이어 자금을 지원해달라고 요청합니다. (플레이어가 자금을 지원하면 관계가 향상됩니다.)',
    title_ko: '도움이 필요해',
    title_en: 'I need some help.',
    body_ko: '아 썅, 오늘 진짜 더럽게 안 풀리네. 나 올인났다. 친구야, 지금 여유 좀 있으면 칩 좀 쏴줄 수 있냐? 금방 불려서 갚을게.',
    body_en: 'Ah shit, today is just not my day. I\'m busted. Hey buddy, if you have some to spare, could you shoot me some chips? I\'ll run it up and pay you right back.',
    sender_ko: '맥스',
    sender_en: 'Max',
    label_accept_ko: '승낙하기',
    label_accept_en: 'Accept',
    label_refuse_ko: '거절하기',
    label_refuse_en: 'Refuse',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    get label_accept() { return store.settings.language === 'en' ? this.label_accept_en : this.label_accept_ko; },
    get label_refuse() { return store.settings.language === 'en' ? this.label_refuse_en : this.label_refuse_ko; },
    func() {
      const partner = store.partners.find(partner => partner.id === PARTNER_ID.MAX);
      if (!partner) return;
      // if (partner.debt <= 0) return;
      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body, [
        {
          label: this.label_accept,
          actionType: `DEBT_REPAYMENT`,
          payload: {
            amount: partner.initialBankroll,
            currency: 'CR',
            resolveType: 'ACCEPT',
            nextEvent: partner.relationship < 200 ? EVENT_ID.MAX_BANKRUPT_ACCEPT_RESCUE_LOW_RELATIONSHIPSHIP : EVENT_ID.MAX_BANKRUPT_ACCEPT_RESCUE,
          }
        },
        {
          label: this.label_refuse,
          actionType: `DEBT_REPAYMENT`,
          payload: {
            amount: 0,
            currency: 'CR',
            resolveType: 'REFUSE',
            nextEvent: partner.relationship < 200 ? EVENT_ID.MAX_BANKRUPT_REFUSE_RESCUE_LOW_RELATIONSHIPSHIP : EVENT_ID.MAX_BANKRUPT_REFUSE_RESCUE
          }
        }
      ], this.sender)
    },
  },
  {
    id: EVENT_ID.MAX_BANKRUPT_HAS_CONTRACT_BANKRUPT_RESCUE,
    scenario: 'Max가 파산했지만, 플레이어와 계약되어 있어 자동으로 초기 자원을 지원했습니다.(계약은 해지됩니다.)',
    title_ko: '자동 이체',
    title_en: 'Automatic Transfer',
    body_ko: '귀하의 계좌에서 [Max]님에게 $ CR 이 자동 이체되었습니다.',
    body_en: 'Automatic transfer of $ CR from your account to Max.',
    sender_ko: '시스템',
    sender_en: 'SYSTEM',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      const partner = store.partners.find(partner => partner.id === PARTNER_ID.MAX);
      if (!partner) return;
      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body.replace('$', partner.initialBankroll), [], this.sender)
    },
  },
  {
    id: EVENT_ID.MAX_BANKRUPT_ACCEPT_RESCUE,
    scenario: 'Max가 파산했고 플레이어가 자금을 지원했습니다.',
    title_ko: '역시 내 친구다!',
    title_en: 'That\'s my friend!',
    body_ko: '크으... 진짜 고맙다! 역시 텍사스 의리 어디 안가네! 너 진짜 내가 평생 안 잊는다. 한 판 시원하게 먹고 올게!',
    body_en: 'Hell yeah... thanks a ton! Texan loyalty never dies! I\'m never gonna forget this. Wait here, I\'m gonna go scoop a huge pot!',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      gainRelationship(200);
      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body, [], this.sender)
    },
  },
  {
    id: EVENT_ID.MAX_BANKRUPT_ACCEPT_RESCUE_LOW_RELATIONSHIPSHIP,
    scenario: 'Max가 파산했고 플레이어가 자금을 지원했습니다. (관계도가 낮음)',
    title_ko: '의외인데?',
    title_en: 'Well, that\'s a surprise.',
    body_ko: '오... 네가 칩을 다 대주고, 진짜 의외다. 아깐 좀 예민하게 굴어서 미안했고, 고맙게 잘 쓸게.',
    body_en: 'Wow... you actually covering me? That\'s a real surprise. Sorry for being a bit on the edge earlier, I\'ll put this to good use.',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      gainRelationship(200);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender)
    },
  },
  {
    id: EVENT_ID.MAX_BANKRUPT_REFUSE_RESCUE,
    scenario: 'Max가 파산했고 플레이어가 자금 지원을 거절했습니다.',
    title_ko: '매정한 놈',
    title_en: 'Cold-hearted bastard',
    body_ko: '뭐? 돈이 없다고? 치사하게 진짜... 알았어, 딴 데서 구해보지 뭐. 나중에 후회나 하지 마라.',
    body_en: 'What? You\'re broke too? That\'s cold... fine, I\'ll find it somewhere else. Don\'t regret this later.',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body, [], this.sender)
    },
  },
  {
    id: EVENT_ID.MAX_BANKRUPT_REFUSE_RESCUE_LOW_RELATIONSHIPSHIP,
    scenario: 'Max가 파산했고 플레이어가 자금 지원을 거절했습니다. (관계도가 낮음)',
    title_ko: '너 이 새끼.',
    title_en: 'You bastard.',
    body_ko: '아오, 텍사스 망신 다 시키는 자식. 너 같은 새끼한테 기대한 내가 등신이지. 다신 연락 안 한다.',
    body_en: 'Ugh, you\'re an embarrassment to Texas. I\'m an idiot for expecting anything from a jerk like you. Lose my number.',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body, [], this.sender)
    },
  },
  {
    id: EVENT_ID.FLORENCE_BANKRUPT_HAS_DEBT,
    scenario: 'Florence가 파산했습니다, 플레이어에게 지원을 조금은 능청스럽게 요구합니다.',
    title_ko: '긴급 자금 요청',
    title_en: 'Urgent Capital Request',
    body_ko: '어머, 제 자산 관리에 작은 틈이 생겼네요. 저한테 갚을 돈 있으시죠? 지금 당장 상환해 주셨으면 좋겠어요.',
    body_en: 'Oh my, it seems there\'s a tiny gap in my asset management. You owe me some money, don\'t you? I\'d appreciate an immediate repayment.',
    sender_ko: '플로렌스',
    sender_en: 'Florence',
    label_accept_ko: '승낙하기',
    label_accept_en: 'Accept',
    label_refuse_ko: '거절하기',
    label_refuse_en: 'Refuse',
    get label_accept() { return store.settings.language === 'en' ? this.label_accept_en : this.label_accept_ko; },
    get label_refuse() { return store.settings.language === 'en' ? this.label_refuse_en : this.label_refuse_ko; },
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      const partner = store.partners.find(partner => partner.id === PARTNER_ID.FLORENCE);
      if (!partner) return;
      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body, [
        {
          label: this.label_accept,
          actionType: `DEBT_REPAYMENT`,
          payload: {
            amount: pay_rent_bill,
            currency: 'CR',
            resolveType: 'ACCEPT',
            nextEvent: partner.relationship < 200 ? EVENT_ID.FLORENCE_BANKRUPT_ACCEPT_RESCUE_LOW_RELATIONSHIPSHIP : EVENT_ID.FLORENCE_BANKRUPT_ACCEPT_RESCUE,
          }
        },
        {
          label: this.label_refuse,
          actionType: `DEBT_REPAYMENT`,
          payload: {
            amount: 0,
            currency: 'CR',
            resolveType: 'REFUSE',
            failEvent: partner.relationship < 200 ? EVENT_ID.FLORENCE_BANKRUPT_REFUSE_RESCUE_LOW_RELATIONSHIPSHIP : EVENT_ID.FLORENCE_BANKRUPT_REFUSE_RESCUE
          }
        }
      ], this.sender)
    },
  },
  {
    id: EVENT_ID.FLORENCE_BANKRUPT_HAS_CONTRACT_BANKRUPT_RESCUE,
    scenario: 'Florence가 파산했지만, 플레이어와 자금 지원 계약을 맺은 상태라 초기 자원을 자동으로 지원했습니다. (계약은 해지됩니다.)',
    title_ko: '자동 이체',
    title_en: 'Automatic Transfer',
    body_ko: '귀하의 계좌에서 [Florence]님에게 $ CR 이 자동 이체되었습니다.',
    body_en: 'Automatic transfer of $ CR from your account to Florence.',
    sender_ko: '시스템',
    sender_en: 'SYSTEM',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      const partner = store.partners.find(partner => partner.id === PARTNER_ID.FLORENCE);
      if (!partner) return;
      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body.replace('$', partner.initialBankroll), [], this.sender)
    },
  },
  {
    id: EVENT_ID.FLORENCE_BANKRUPT_HAS_CONTRACT_BANKRUPT_RESCUE_FAIL,
    scenario: 'Florence가 파산했고, 플레이어와 자금 지원 계약을 맺은 상태지만, 자금이 부족하여 초기 자원을 지원할 수 없었습니다. (계약은 해지됩니다.)',
    title_ko: '자동 이체',
    title_en: 'Automatic Transfer',
    body_ko: '귀하의 계좌에서 [Florence]님에게 $ CR 자동이체를 실패했습니다.',
    body_en: 'Automatic transfer of $ CR from your account to Florence failed because you don\'t have enough money.',
    sender_ko: '시스템',
    sender_en: 'SYSTEM',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      const partner = store.partners.find(partner => partner.id === PARTNER_ID.FLORENCE);
      if (!partner) return;
      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body.replace('$', partner.initialBankroll), [], this.sender)
    },
  },

  {
    id: EVENT_ID.FLORENCE_BANKRUPT_HAS_DEBT_LOW_RELATIONSHIP,
    scenario: 'Florence가 파산했고 관계도가 낮을 때 빚 상환을 다소 싸늘하게 요구합니다.',
    title_ko: '자금 상환 통보',
    title_en: 'Notice of Repayment',
    body_ko: '지금 제가 많이 예민한 상태거든요. 귀찮은 일 만들지 말고, 밀린 돈 당장 가져오시죠.',
    body_en: 'I am on quite a short fuse right now. Don\'t make things difficult and bring me the money you owe, immediately.',
    sender_ko: '플로렌스',
    sender_en: 'Florence',
    lebel_ko: '빚 갚기',
    lebel_en: 'Pay debt',

    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body, [{
        label: this.label,
        actionType: `${this.label} (${pay_rent_bill}) CR`,
        payload: {
          amount: pay_rent_bill
        }
      }], this.sender)
    },
  },
  {
    id: EVENT_ID.FLORENCE_BANKRUPT,
    scenario: 'Florence가 파산하여 플레이어에게 투자를 제안(자금 지원 요청)합니다.',
    title_ko: '단기 투자 제안',
    title_en: 'Short-term Investment Proposal',
    body_ko: '잠깐 흐름이 꼬였을 뿐이에요. 금방 일어설 테니, 여유가 있으면 저한테 베팅해 보시는 건 어때요? 당연히 보답할게요.',
    body_en: 'Just a temporary bad beat. I\'ll be back on my feet in no time, so how about betting on me? I\'ll make it worth your while, of course.',
    sender_ko: '플로렌스',
    sender_en: 'Florence',
    label_accept_ko: '승낙하기',
    label_accept_en: 'Accept',
    label_refuse_ko: '거절하기',
    label_refuse_en: 'Refuse',
    get label_accept() { return store.settings.language === 'en' ? this.label_accept_en : this.label_accept_ko; },
    get label_refuse() { return store.settings.language === 'en' ? this.label_refuse_en : this.label_refuse_ko; },
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body, [
        {
          label: this.label_accept,
          actionType: `DEBT_REPAYMENT`,
          payload: {
            amount: pay_rent_bill,
            currency: 'CR',
            resolveType: 'ACCEPT',
            nextEvent: EVENT_ID.FLORENCE_BANKRUPT_ACCEPT_RESCUE
          }
        },
        {
          label: this.label_refuse,
          actionType: `DEBT_REPAYMENT`,
          payload: {
            amount: 0,
            resolveType: 'REFUSE',
            nextEvent: EVENT_ID.FLORENCE_ELIMINATED
          }
        }
      ], this.sender)
    },
  },
  {
    id: EVENT_ID.FLORENCE_BANKRUPT_ACCEPT_RESCUE,
    scenario: 'Florence가 파산했고 플레이어가 자금 지원을 했을 때의 정상적인 반응',
    title_ko: '투자 수락',
    title_en: 'Investment Accepted',
    body_ko: '후후, 멋진 안목이네요. 이번 타이밍에 절 도와주신 건 절대 잊지 않을게요.',
    body_en: 'Hehe, what a wonderful eye you have. I definitely won\'t forget that you helped me out this time.',
    sender_ko: '플로렌스',
    sender_en: 'Florence',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      gainRelationship(200);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender)
    },
  },
  {
    id: EVENT_ID.FLORENCE_BANKRUPT_ACCEPT_RESCUE_LOW_RELATIONSHIPSHIP,
    scenario: 'Florence가 파산했고 플레이어가 자금 지원을 했지만 기본 관계도가 낮을 때',
    title_ko: '자금 수령',
    title_en: 'Funds Received',
    body_ko: '어라, 당신이 도와줄 줄은 정말 몰랐는걸요? 생각보다 괜찮은 구석이 있네요.',
    body_en: 'Well, I really didn\'t expect you to help out. You might be a bit more decent than I thought.',
    sender_ko: '플로렌스',
    sender_en: 'Florence',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      gainRelationship(400);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender)
    },
  },
  {
    id: EVENT_ID.FLORENCE_BANKRUPT_REFUSE_RESCUE,
    scenario: 'Florence가 파산했고 플레이어가 자금 지원을 거부했을 때',
    title_ko: '거절 확인',
    title_en: 'Refusal Confirmed',
    body_ko: '아쉬워라. 저한테 베팅할 좋은 찬스였는데 말이죠. 뭐, 당신 마음이니 어쩔 수 없네요.',
    body_en: 'What a shame. It was a great chance to bet on me. Well, it\'s your choice, I can\'t force you.',
    sender_ko: '플로렌스',
    sender_en: 'Florence',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body, [], this.sender)
    },
  },
  {
    id: EVENT_ID.FLORENCE_BANKRUPT_REFUSE_RESCUE_LOW_RELATIONSHIPSHIP,
    scenario: 'Florence가 파산했고 플레이어가 자금 지원을 거부했으며 기본 관계도마저 낮을 때',
    title_ko: '재고 가치 하락',
    title_en: 'Depreciated Value',
    body_ko: '역시 수준 안 맞는 파트너에게 기대하는 건 무리였나 보네요. 당신과의 비즈니스는 여기까지 할게요.',
    body_en: 'Guess it was too much to expect from a partner out of my league. Our business ends right here.',
    sender_ko: '플로렌스',
    sender_en: 'Florence',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body, [], this.sender)
    },
  },
  {
    id: EVENT_ID.MAX_BREAK_CONTRACT_COLLUSION,
    title_ko: '혼자 다녀라',
    title_en: 'Fly solo from now on',
    body_ko: '하아, 너랑 같이 테이블에 앉아 있으면 내 패까지 꼬이는 느낌이야. 콤비 놀이는 여기까지 하자. 각자도생 텍사스 스타일 알지?',
    body_en: 'Sigh, sitting at the same table as you is dragging my luck down too. Let\'s end this partner gig. It\'s every man for himself, Texas style, you know?',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender)
    },
    repeatable: true
  },
  {
    id: EVENT_ID.MAX_BREAK_CONTRACT_BANKRUPT_RESCUE,
    title_ko: '밑 빠진 독에 물 붓기',
    title_en: 'Pouring water in a broken jug',
    body_ko: '야, 나도 내 코가 석 자야. 한두 번이야 땜빵해 주지, 네 빚 처리하다간 나까지 파산하겠다. 구제 계약은 오늘부터 취소다.',
    body_en: 'Hey, I\'ve got my own problems to worry about. I can cover you once or twice, but paying your debts is gonna bankrupt me too. Our rescue deal is over today.',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender)
    },
    repeatable: true
  },
  {
    id: EVENT_ID.MAX_BREAK_CONTRACT_SHARE_BENEFIT,
    title_ko: '각자 벌어먹자고',
    title_en: 'Eat what you kill',
    body_ko: '수익 공유? 장난하냐? 이건 뭐 너 좋은 일만 시켜주는 꼴이잖아. 앞으론 각자 벌어서 각자 먹자. 계약 해지야.',
    body_en: 'Profit sharing? Are you kidding me? This is just me doing charity for you. From now on, you eat what you kill. The contract is cancelled.',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender)
    },
    repeatable: true
  },
  {
    id: EVENT_ID.FLORENCE_BREAK_CONTRACT_COLLUSION,
    title_ko: '동행의 종료',
    title_en: 'End of our journey',
    body_ko: '당신과의 게임은 더 이상 제게 어떠한 영감도 주지 않네요. 미안하지만 같이 테이블에 앉는 건 여기까지 하는 게 좋겠어요.',
    body_en: 'Playing with you brings no inspiration to me anymore. I\'m sorry, but I think our time sitting at the same table ends here.',
    sender_ko: '플로렌스',
    sender_en: 'Florence',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender)
    },
    repeatable: true
  },
  {
    id: EVENT_ID.FLORENCE_BREAK_CONTRACT_BANKRUPT_RESCUE,
    title_ko: '부채 구제 계약 파기',
    title_en: 'Debt Rescue Contract Termination',
    body_ko: '저도 땅 파서 장사하는 건 아니라서요. 당신의 끝없는 부채를 감당하다간 저까지 위험해질 것 같네요. 약속했던 구제 계약은 물를게요.',
    body_en: 'I don\'t print money myself, you know. Handling your endless debt is putting me at risk. I\'ll have to cancel our rescue contract.',
    sender_ko: '플로렌스',
    sender_en: 'Florence',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender)
    },
    repeatable: true
  },
  {
    id: EVENT_ID.FLORENCE_BREAK_CONTRACT_SHARE_BENEFIT,
    title_ko: '수익 공유 계약 해지',
    title_en: 'Termination of Profit Sharing Contract',
    body_ko: '수익률이 제가 기대했던 것보다 좀 많이 아쉽네요. 매력 없는 파트너십은 서로에게 시간 낭비일 뿐이죠. 계약은 이걸로 끝이에요.',
    body_en: 'The return rate is quite disappointing compared to my expectations. An unappealing partnership is just a waste of time for both of us. The contract ends here.',
    sender_ko: '플로렌스',
    sender_en: 'Florence',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], this.sender)
    },
    repeatable: true
  },
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
    body_ko: '내가 기초부터 다 알려줬잖아! 에효... 밥이나 든든하게 먹고 대기해라, 쫌 이따 다시 부를 테니까.',
    body_en: 'I taught you the basics! Sigh... Go get some hot food. I\'ll call you back shortly.',
    sender_ko: '맥스',
    sender_en: 'Max',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get sender() { return store.settings.language === 'en' ? this.sender_en : this.sender_ko; },
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    label_ko: '알았어',
    label_en: 'OK',
    func() {
      scheduleEvent(EVENT_ID.TUTORIAL_THEN_LOSE_RETRY, 60); // 1시간 뒤 이어서 재도전 메시지 발송 
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
      scheduleEvent(EVENT_ID.TUTORIAL_THEN_LEAVE_RETRY, 60);
    },
    repeatable: false
  },
  {
    id: EVENT_ID.TUTORIAL_LEAVE_AGAIN,
    desc_for_dev: 'Max가 플레이어에게 포커를 가르쳐주는 이벤트 연계(테이블 재 이탈)',
    title_ko: '이 자식이 진짜 돌았나...',
    title_en: 'Are you out of your mind...',
    body_ko: '또 도망가? 장난치냐 지금?! 다시는 나한테 배울 생각 마라!',
    body_en: 'Run away again? Are you kidding me?! Don\'t ever expect me to teach you again!',
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