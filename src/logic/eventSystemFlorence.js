import { sendMessage, MESSAGE_TYPE, MESSAGE_ACTION_TYPE, MESSAGE_ACTION_RESOLVE_TYPE } from "./messageSystem.js";
import { store, getLanguage } from "./store.js";
import { PARTNER_ID, gainRelationship } from "./partnerSystem.js";
// import { scheduleEvent, processEvents } from "./eventSystem.js";

const pay_rent_bill = 5000;
/**
 * @typedef {Object} FlorenceEvents
 * @property {string} REFUSE_CONTRACT_CAUSE_YOU_HAS_DEBT
 * @property {string} REFUSE_CONTRACT_CAUSE_YOU_HAS_RELATIONSHIP_LOW
 * @property {string} BANKRUPT
 * @property {string} BANKRUPT_HAS_DEBT
 * @property {string} BANKRUPT_HAS_DEBT_LOW_RELATIONSHIP
 * @property {string} BANKRUPT_REFUSE_RESCUE
 * @property {string} BANKRUPT_ACCEPT_RESCUE_LOW_RELATIONSHIPSHIP
 * @property {string} BANKRUPT_REFUSE_RESCUE_LOW_RELATIONSHIPSHIP
 * @property {string} BANKRUPT_HAS_CONTRACT_BANKRUPT_RESCUE
 * @property {string} BANKRUPT_HAS_CONTRACT_BANKRUPT_RESCUE_FAIL
 * @property {string} BREAK_CONTRACT_COLLUSION
 * @property {string} BREAK_CONTRACT_BANKRUPT_RESCUE
 * @property {string} BREAK_CONTRACT_SHARE_BENEFIT
 * @property {string} SIGN_CONTRACT_COLLUSION
 * @property {string} SIGN_CONTRACT_SHARE_BENEFIT
 * @property {string} SIGN_CONTRACT_BANKRUPT_RESCUE
 * @property {string} SIGN_CONTRACT_DATE_WITH_ME
 * @property {string} GONE
 */
/** @type {FlorenceEvents} */
export const EVENT_FLORENCE = new Proxy({}, {
  get: (target, prop) => `FLORENCE_${prop}`
});
const SENDER_EN = 'Florence';
const SENDER_KO = '플로렌스';
export const EventData = [

  {
    id: EVENT_FLORENCE.GONE,
    scenario: '플로렌스는 사라졌습니다 (관계악화, 관계도 < 0)',
    title_ko: '계약 완전 종료',
    title_en: 'Contract Terminated',
    body_ko: '당신과의 비즈니스는 이걸로 완전히 끝이네요. 당신처럼 통제 안 되는 리스크를 계속 둘 순 없으니까요. 뭐... 그래도 가끔은 당신의 바보 같은 배팅이 조금은 그리울지도 모르겠네요. 각자의 테이블에서 건승하길 바랄게요. 안녕.',
    body_en: 'Our business arrangement ends completely with this. I cannot keep an unpredictable risk like you. Well... maybe I will occasionally miss your foolish bets, though. I wish you the best of luck at your own tables. Goodbye.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      leavePartner(PARTNER_ID.FLORENCE);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.SIGN_CONTRACT_COLLUSION,
    scenario: 'Florence와 [담합] 계약을 체결했습니다. 이제 플레이어와 함께 게임에 참가할 것입니다!',
    title_ko: '완벽한 뱅크롤 메이트',
    title_en: 'Perfect Bankroll Mate',
    body_ko: '제 계산이 맞다면, 우리 둘이 같은 테이블에 앉을 때 테이블의 EV(기댓값)를 가장 효율적으로 흡수할 수 있어요. 라스베가스의 진짜 게임이 뭔지 보여드리죠.',
    body_en: 'If my calculations are correct, sitting at the same table allows us to absorb the table\'s EV most efficiently. Let me show you what real Las Vegas poker looks like.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.SIGN_CONTRACT_SHARE_BENEFIT,
    scenario: 'Florence와 (수익분배)계약을 체결했습니다. 이제 서로의 수익을 일정 지분만큼 공유합니다!(다만 수익 분배가 불균형하면 관계가 악화될 수 있습니다..)',
    title_ko: '위험 분산 포트폴리오',
    title_en: 'Risk Diversification Portfolio',
    body_ko: '포커는 결국 분산의 마법을 어떻게 통제하느냐의 싸움이죠. 당신과의 수익 해지는 제 포트폴리오를 완벽하게 보완해 줄 거예요. 물론 당신도 베테랑의 안정감을 누리게 되겠죠. 계약에 서명할게요.',
    body_en: 'Poker is ultimately a battle of controlling variance. Hedging profits with you perfectly complements my portfolio. And of course, you get to enjoy the stability of a veteran. Let\'s make it official.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.SIGN_CONTRACT_BANKRUPT_RESCUE,
    scenario: 'Florence와 (파산 구제)계약을 체결했습니다. 이제 둘 중 한명이 파산하면 초기 자금을 지원해 줄겁니다!',
    title_ko: '최후의 안전장치',
    title_en: 'The Final Safety Net',
    body_ko: '아무리 완벽한 TAG 플레이어라도 다운스윙은 피할 수 없어요. 파산이라는 최악의 리스크를 헷징(Hedging)하는 이 계약은 충분히 합리적이군요. 서로에게 훌륭한 안전장치가 될 거예요.',
    body_en: 'Even the most perfect TAG player can\'t escape downswings. Hedging against the worst-case scenario of bankruptcy is highly rational. This will serve as an excellent safety net for both of us.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.SIGN_CONTRACT_DATE_WITH_ME,
    scenario: 'Florence와 (데이트)계약을 체결했습니다. 이제 정기적으로 관계도가 변동합니다!',
    title_ko: '계산 밖의 변수',
    title_en: 'Uncalculated Variables',
    body_ko: '...포커 테이블 밖에서의 확률 계산은 좀 서투른 편인데... 특별히 조금의 감정을 허락해 보죠.',
    body_en: '...I\'m not exactly used to calculating odds away from the poker table. I might just allow a little emotion.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.BANKRUPT_HAS_DEBT,
    scenario: 'Florence가 파산했습니다, 플레이어에게 지원을 조금은 능청스럽게 요구합니다.',
    title_ko: '긴급 자금 요청',
    title_en: 'Urgent Capital Request',
    body_ko: '어머, 제 자산 관리에 작은 틈이 생겼네요. 저한테 갚을 돈 있으시죠? 지금 당장 상환해 주셨으면 좋겠어요.',
    body_en: 'Oh my, it seems there\'s a tiny gap in my asset management. You owe me some money, don\'t you? I\'d appreciate an immediate repayment.',
    label_accept_ko: '승낙하기',
    label_accept_en: 'Accept',
    label_refuse_ko: '거절하기',
    label_refuse_en: 'Refuse',
    get label_accept() { return store.settings.language === 'en' ? this.label_accept_en : this.label_accept_ko; },
    get label_refuse() { return store.settings.language === 'en' ? this.label_refuse_en : this.label_refuse_ko; },
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      const partner = getPartner(PARTNER_ID.FLORENCE);
      if (!partner) return;
      // NO OPTION TO REFUSE
      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body, [
        {
          label: this.label_accept,
          actionType: MESSAGE_ACTION_TYPE.DEBT_REPAYMENT,
          payload: {
            amount: partner.debt,
            currency: 'CR',
            resolveType: MESSAGE_ACTION_RESOLVE_TYPE.ACCEPT,
          }
        }
      ], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },

  {
    id: EVENT_FLORENCE.BANKRUPT_HAS_DEBT_LOW_RELATIONSHIP,
    scenario: 'Florence가 파산했고 관계도가 낮을 때 빚 상환을 다소 싸늘하게 요구합니다.',
    title_ko: '자금 상환 통보',
    title_en: 'Notice of Repayment',
    body_ko: '지금 제가 많이 예민한 상태거든요. 귀찮은 일 만들지 말고, 밀린 돈 당장 가져오시죠.',
    body_en: 'I am on quite a short fuse right now. Don\'t make things difficult and bring me the money you owe, immediately.',
    lebel_ko: '빚 갚기',
    lebel_en: 'Pay debt',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    func() {
      const partner = getPartner(PARTNER_ID.FLORENCE);
      if (!partner) return;
      // NO OPTION TO REFUSE
      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body, [{
        label: this.label,
        actionType: MESSAGE_ACTION_TYPE.DEBT_REPAYMENT,
        payload: {
          amount: partner.debt,
          currency: 'CR',
          resolveType: MESSAGE_ACTION_RESOLVE_TYPE.ACCEPT,
        }
      }], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.BANKRUPT,
    scenario: 'Florence가 파산하여 플레이어에게 투자를 제안(자금 지원 요청)합니다.',
    title_ko: '단기 투자 제안',
    title_en: 'Short-term Investment Proposal',
    body_ko: '잠깐 흐름이 꼬였을 뿐이에요. 금방 일어설 테니, 여유가 있으면 저한테 베팅해 보시는 건 어때요? 당연히 보답할게요.',
    body_en: 'Just a temporary bad beat. I\'ll be back on my feet in no time, so how about betting on me? I\'ll make it worth your while, of course.',
    label_accept_ko: '승낙하기',
    label_accept_en: 'Accept',
    label_refuse_ko: '거절하기',
    label_refuse_en: 'Refuse',
    get label_accept() { return store.settings.language === 'en' ? this.label_accept_en : this.label_accept_ko; },
    get label_refuse() { return store.settings.language === 'en' ? this.label_refuse_en : this.label_refuse_ko; },
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      const partner = getPartner(PARTNER_ID.FLORENCE);
      if (!partner) return;
      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body, [
        {
          label: this.label_accept,
          actionType: MESSAGE_ACTION_TYPE.DEBT_REPAYMENT,
          payload: {
            amount: partner.initialBankroll,
            currency: 'CR',
            resolveType: MESSAGE_ACTION_RESOLVE_TYPE.ACCEPT,
            nextEvent: getRelationship(PARTNER_ID.FLORENCE) < 200 ? EVENT_FLORENCE.BANKRUPT_ACCEPT_RESCUE_LOW_RELATIONSHIPSHIP : EVENT_FLORENCE.BANKRUPT_ACCEPT_RESCUE
          }
        },
        {
          label: this.label_refuse,
          actionType: MESSAGE_ACTION_TYPE.DEBT_REPAYMENT,
          payload: {
            amount: 0,
            resolveType: MESSAGE_ACTION_RESOLVE_TYPE.REFUSE,
            nextEvent: getRelationship(PARTNER_ID.FLORENCE) < 200 ? EVENT_FLORENCE.BANKRUPT_REFUSE_RESCUE_LOW_RELATIONSHIPSHIP : EVENT_FLORENCE.BANKRUPT_REFUSE_RESCUE
          }
        }
      ], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.BANKRUPT_ACCEPT_RESCUE,
    scenario: 'Florence가 파산했고 플레이어가 자금 지원을 했을 때의 정상적인 반응',
    title_ko: '투자 수락',
    title_en: 'Investment Accepted',
    body_ko: '후후, 멋진 안목이네요. 이번 타이밍에 절 도와주신 건 절대 잊지 않을게요.',
    body_en: 'Hehe, what a wonderful eye you have. I definitely won\'t forget that you helped me out this time.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      gainRelationship(PARTNER_ID.FLORENCE, 300);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.BANKRUPT_ACCEPT_RESCUE_LOW_RELATIONSHIPSHIP,
    scenario: 'Florence가 파산했고 플레이어가 자금 지원을 했지만 기본 관계도가 낮을 때',
    title_ko: '자금 수령',
    title_en: 'Funds Received',
    body_ko: '어라, 당신이 도와줄 줄은 정말 몰랐는걸요? 생각보다 괜찮은 구석이 있네요.',
    body_en: 'Well, I really didn\'t expect you to help out. You might be a bit more decent than I thought.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      gainRelationship(PARTNER_ID.FLORENCE, 300);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.BANKRUPT_REFUSE_RESCUE,
    scenario: 'Florence가 파산했고 플레이어가 자금 지원을 거부했을 때',
    title_ko: '거절 확인',
    title_en: 'Refusal Confirmed',
    body_ko: '아쉬워라. 저한테 베팅할 좋은 찬스였는데 말이죠. 뭐, 당신 마음이니 어쩔 수 없네요.',
    body_en: 'What a shame. It was a great chance to bet on me. Well, it\'s your choice, I can\'t force you.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      gainRelationship(PARTNER_ID.FLORENCE, -150);
      gainPartnerBankroll(PARTNER_ID.FLORENCE, 25000); // 초기 자금 지원
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.BANKRUPT_REFUSE_RESCUE_LOW_RELATIONSHIPSHIP,
    scenario: 'Florence가 파산했고 플레이어가 자금 지원을 거부했으며 기본 관계도마저 낮을 때',
    title_ko: '재고 가치 하락',
    title_en: 'Depreciated Value',
    body_ko: '역시 수준 안 맞는 파트너에게 기대하는 건 무리였나 보네요. 당신과의 비즈니스는 여기까지 할게요.',
    body_en: 'Guess it was too much to expect from a partner out of my league. Our business ends right here.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      gainRelationship(PARTNER_ID.FLORENCE, -150);
      gainPartnerBankroll(PARTNER_ID.FLORENCE, 50000); // 초기 자금 지원
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.BREAK_CONTRACT_COLLUSION,
    title_ko: '동행의 종료',
    title_en: 'End of our journey',
    body_ko: '당신과의 게임은 더 이상 제게 어떠한 영감도 주지 않네요. 미안하지만 같이 테이블에 앉는 건 여기까지 하는 게 좋겠어요.',
    body_en: 'Playing with you brings no inspiration to me anymore. I\'m sorry, but I think our time sitting at the same table ends here.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
    repeatable: true
  },
  {
    id: EVENT_FLORENCE.BREAK_CONTRACT_BANKRUPT_RESCUE,
    title_ko: '부채 구제 계약 파기',
    title_en: 'Debt Rescue Contract Termination',
    body_ko: '저도 땅 파서 장사하는 건 아니라서요. 당신의 끝없는 부채를 감당하다간 저까지 위험해질 것 같네요. 약속했던 구제 계약은 물를게요.',
    body_en: 'I don\'t print money myself, you know. Handling your endless debt is putting me at risk. I\'ll have to cancel our rescue contract.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
    repeatable: true
  },
  {
    id: EVENT_FLORENCE.BREAK_CONTRACT_SHARE_BENEFIT,
    title_ko: '수익 공유 계약 해지',
    title_en: 'Termination of Profit Sharing Contract',
    body_ko: '수익률이 제가 기대했던 것보다 좀 많이 아쉽네요. 매력 없는 파트너십은 서로에게 시간 낭비일 뿐이죠. 계약은 이걸로 끝이에요.',
    body_en: 'The return rate is quite disappointing compared to my expectations. An unappealing partnership is just a waste of time for both of us. The contract ends here.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
    repeatable: true
  },
];
