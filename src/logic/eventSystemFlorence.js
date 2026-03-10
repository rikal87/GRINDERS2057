import { sendMessage, MESSAGE_TYPE, MESSAGE_ACTION_TYPE, MESSAGE_ACTION_RESOLVE_TYPE } from "./messageSystem.js";
import { store, getLanguage, getCurrentBankroll } from "./store.js";
import { gainRelationship, leavePartner, getRelationship, gainPartnerBankroll, getPartner, joinPartner } from "./partnerSystem.js";
import { scheduleEvent } from "./eventSystem.js";
import { EVENT_MAX } from "./eventSystemMax.js";

import { PARTNER_ID, LOCATION_ID } from './constants.js'
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
 * @property {string} MAIN_STORY_2_1_KBT_UNDERGROUND // KBT UNDERGROUND THE BUNKER 미션
 * @property {string} MAIN_STORY_2_2_KBT_UNDERGROUND
 * @property {string} MAIN_STORY_2_3_KBT_UNDERGROUND
 * @property {string} MAIN_STORY_2_4_KBT_UNDERGROUND
 * @property {string} MAIN_STORY_2_5_KBT_UNDERGROUND
 * @property {string} MAIN_STORY_2_6_KBT_UNDERGROUND
 * @property {string} MAIN_STORY_2_7_KBT_UNDERGROUND // 주인공과 접선
 * @property {string} JOIN_PARTNER // 플로렌스가 정식 파트너가 되기로 결심합니다.
 * @property {string} JOINED_PARTNER // 프로렌스를 정식 파트너로 등록했습니다.
 * @property {string} RESOLVED_DEBT
 * @property {string} RESOLVED_DEBT_LOW_RELATIONSHIP
 */
/** @type {FlorenceEvents} */
export const EVENT_FLORENCE = new Proxy({}, {
  get: (target, prop) => `FLORENCE_${prop}`
});
const SENDER_EN = 'Florence';
const SENDER_KO = '플로렌스';
export const EventData = [
  {
    id: EVENT_FLORENCE.RESOLVED_DEBT,
    scenario: '플레이어가 플로렌스에게 빚을 갚았습니다.',
    title_ko: '[채무 관계 해소]',
    title_en: '[Debt Resolved]',
    body_ko: '정확한 타이밍에 상환해주셨네요. 비즈니스 파트너로서 신뢰할 만한 유동성을 보여주셨군요. ...솔직히 말하면 당신의 이런 성실한 면모가 꽤 마음에 들어요. 이 신뢰, 앞으로도 변함없길 바랄게요.',
    body_en: "You repaid at the exact right timing. You've shown reliable liquidity as a business partner. ...To be honest, I quite appreciate this sincere side of you. I hope we can keep this trust going.",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      gainRelationship(PARTNER_ID.FLORENCE, 150);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.RESOLVED_DEBT_LOW_RELATIONSHIP,
    scenario: '플로렌스와 플레이어와의 관계가 낮습니다(관계도 <= 0). 플레이어가 빚을 갚았습니다.',
    title_ko: '[강제 상환 완료]',
    title_en: '[Repayment Complete]',
    body_ko: '상환이 꽤 지체되었네요. 당신의 리스크 관리 능력에 대해 다시 검토해야겠어요. 다음부턴 제 인내심을 테스트하지 마시고, 기한 내에 정확히 처리해주시길 바랄게요.',
    body_en: 'The repayment was delayed quite a bit. I\'ll have to re-evaluate your risk management skills. Don\'t test my patience next time, and make sure to process it exactly within the deadline.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      gainRelationship(PARTNER_ID.FLORENCE, 150);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_2_1_KBT_UNDERGROUND,
    scenario: 'MAIN_STORY_2_1_KBT_UNDERGROUND 이벤트, 주인공의 명성이 높아져서 미션을 의뢰하려는 플로렌스',
    title_ko: '[비즈니스 제안]',
    title_en: '[Business Proposal]',
    body_ko: '안녕? 전에 H.B.D 클럽에서 봤던 기억이 나네요. 거기서 기웃거리는 KBT 깡패 녀석들을 꽤나 효율적으로 처리했다는 소문을 들었어요. 당신의 실력이 제 예상보다 훨씬 정교하더군요.',
    body_en: 'Hello. I remember seeing you at the H.B.D Club. I heard rumors that you handled those KBT thugs quite efficiently. Your skill is much sophisticated than I expected.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    timer: 11,
    condition: () => {
      // return isEventCompleted(EVENT_MAX.MAIN_STORY_1_7_MEET_AT_CLUB_DONE) &&
      //   true
      // return new Date(store.gameTime).getHours() >= 22 // for test
      return true;
    },
    func() {
      sendMessage(MESSAGE_TYPE.MISSION, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_FLORENCE.MAIN_STORY_2_2_KBT_UNDERGROUND, 10)
    },
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_2_2_KBT_UNDERGROUND,
    scenario: 'MAIN_STORY_2_1_KBT_UNDERGROUND 연계 이벤트, 주인공의 명성이 높아져서 미션을 의뢰하려는 플로렌스',
    title_ko: '무례한 리스크들',
    title_en: 'Disrespectful Risks',
    body_ko: '그 갱단 녀석들, 단지 제가 여자라는 이유로 제 실력을 무시하는 게 꽤나 불쾌했거든요.',
    body_en: "Those idiots from the gang... they dared to underestimate me just because I'm a woman. I found that highly offensive.",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    condition: () => {
      // return new Date(store.gameTime).getHours() >= 22 // for test
    },
    func() {
      sendMessage(MESSAGE_TYPE.MISSION, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_FLORENCE.MAIN_STORY_2_3_KBT_UNDERGROUND, 10)
    },
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_2_3_KBT_UNDERGROUND,
    scenario: 'MAIN_STORY_2_2_KBT_UNDERGROUND 연계 이벤트, 주인공의 명성이 높아져서 미션을 의뢰하려는 플로렌스',
    title_ko: '[더 벙커]의 위치',
    title_en: 'Location of [The Bunker]',
    body_ko: '혹시 KBT 갱단이 관리하는 비밀 카지노, [더 벙커]의 정확한 위치를 알고 있나요? 그곳은 표준적인 확률이 통하지 않는, 아주 위험하고도 매력적인 변동성이 존재하는 곳이죠.',
    body_en: "Do you happen to know the exact location of [The Bunker], the secret casino managed by the KBT gang? It's a place where standard odds don't apply, filled with dangerous yet attractive volatility.",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    condition: () => {
      // return new Date(store.gameTime).getHours() >= 22 // for test
    },
    func() {
      sendMessage(MESSAGE_TYPE.MISSION, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_FLORENCE.MAIN_STORY_2_4_KBT_UNDERGROUND, 25)
    },
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_2_4_KBT_UNDERGROUND,
    scenario: 'MAIN_STORY_2_3_KBT_UNDERGROUND 연계 이벤트, 주인공의 명성이 높아져서 미션을 의뢰하려는 플로렌스',
    title_ko: '공동 작업 제안',
    title_en: 'Joint Operation Proposal',
    body_ko: '제 제안은 심플해요. 저와 함께 그곳에 가주시는 거예요. 자세한 옵션은 현장에서 설명해 드릴게요. 당신의 배짱과 제 계산이 합쳐진다면, 승률은 90%를 상회할 거라 확신해요. 팀워크를 한번 발휘해 볼까요?',
    body_en: "My proposal is simple. Come with me to that place. I'll explain the detailed options on-site. With your guts and my calculations, I'm certain our win rate will exceed 90%. Shall we demonstrate some teamwork?",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    condition: () => {
      // return new Date(store.gameTime).getHours() >= 22 // for test
    },
    func() {
      sendMessage(MESSAGE_TYPE.MISSION, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_FLORENCE.MAIN_STORY_2_5_KBT_UNDERGROUND, 20)
    },
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_2_5_KBT_UNDERGROUND,
    scenario: 'MAIN_STORY_2_4_KBT_UNDERGROUND 연계 이벤트, 주인공의 명성이 높아져서 미션을 의뢰하려는 플로렌스',
    title_ko: '합리적인 수익 배분',
    title_en: 'Rational Profit Sharing',
    body_ko: '거기서 발생하는 수익은 정당하게 5:5로 하죠. 평소라면 제 엣지를 고려해 더 높은 지분을 요구했겠지만, 당신의 실력은 충분히 검증되었으니까요. 이 정도면 꽤나 매력적인 계약 조건 아닌가요?',
    body_en: "Let's split the profits from there cleanly 5:5. Ordinarily, I'd demand a higher share considering my edge, but your skills are well-proven. Isn't this quite an attractive contract term?",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    condition: () => {
      // return new Date(store.gameTime).getHours() >= 22 // for test
    },
    func() {
      sendMessage(MESSAGE_TYPE.MISSION, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_FLORENCE.MAIN_STORY_2_6_KBT_UNDERGROUND, 20)
    },
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_2_6_KBT_UNDERGROUND,
    scenario: 'MAIN_STORY_2_5_KBT_UNDERGROUND 연계 이벤트, 주인공의 명성이 높아져서 미션을 의뢰하려는 플로렌스',
    title_ko: '긍정적인 검토',
    title_en: 'Positive Review',
    body_ko: '수락하시는 걸로 이해할게요. 불필요한 협상은 에너지 낭비니까요. 준비할 시간이 필요할 테니, 내일 다시 연락드리죠. 최상의 컨디션을 유지하세요.',
    body_en: "I'll take that as an acceptance. Unnecessary negotiation is a waste of energy. You'll need time to prepare, so I'll contact you again tomorrow. Maintain your peak condition.",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    condition: () => {
      // return new Date(store.gameTime).getHours() >= 22 // for test
    },
    func() {
      sendMessage(MESSAGE_TYPE.MISSION, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_FLORENCE.MAIN_STORY_2_6_KBT_UNDERGROUND, 24 * 60)
    },
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_2_7_KBT_UNDERGROUND,
    scenario: 'MAIN_STORY_2_6_KBT_UNDERGROUND 연계 이벤트, 하루 뒤 주인공에게 준비가 되었음을 알리고 접선 준비',
    title_ko: '접전 준비 완료',
    title_en: 'Ready for Engagement',
    body_ko: '지금 즉시 [더 벙커]로 오세요. 위치 데이터는 전송했어요. 늦는 건 제 계산에 없는 변수니, 부디 정시에 도착해 주시길 바랄게요. 게임을 시작해 보죠.',
    body_en: "Come to [The Bunker] immediately. I've sent the location data. Being late is a variable I haven't accounted for, so please arrive on time. Let's start the game.",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    label_ko: '참가하기',
    label_en: 'Join',
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    condition: () => {
      // return new Date(store.gameTime).getHours() >= 22 // for test
    },
    func() {
      sendMessage(MESSAGE_TYPE.MISSION, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.JOIN_PARTNER,
    scenario: '플로렌스가 정식 파트너가 되기로 결심합니다. (조건 달성시)',
    title_ko: '신뢰의 증명',
    title_en: 'Proof of Trust',
    body_ko: '당신과 함께라면 꽤나 합리적인 기대수익을 기대할 수 있겠군요. 정식으로 파트너 계약을 제안합니다. 아, 물론 비즈니스일 뿐이니 오해는 말아주셨으면 해요.',
    body_en: 'I believe partnering with you will yield a fairly reasonable expected value. Consider this a formal proposal. And... please don\'t get the wrong idea. This is strictly business.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    timer: 30,
    condition: () => {
      // return getCurrentBankroll() > 500000 || getRelationship(PARTNER_ID.FLORENCE) >= 500;
      return getCurrentBankroll() > 3000 || getRelationship(PARTNER_ID.FLORENCE) >= 150;
    },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_FLORENCE.JOINED_PARTNER, 1);
    },
    repeatable: false
  },
  {
    id: EVENT_FLORENCE.JOINED_PARTNER,
    scenario: '플로렌스가 파트너로 등록되었습니다.(시스템 안내용)',
    title_ko: '[플로렌스]가 파트너로 등록되었습니다.',
    title_en: '[Florence] Registered as Partner',
    body_ko: '신규 파트너 [플로렌스]가 추가되었습니다. [안전가옥] > [파트너] 탭에서 확인 가능합니다.',
    body_en: 'New partner [Florence] has been added. You can check it in the [Partner] tab of the [Safe House].',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      joinPartner(PARTNER_ID.FLORENCE);
      sendMessage(MESSAGE_TYPE.SYSTEM, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.GONE,
    scenario: '플로렌스는 사라졌습니다 (관계악화, 관계도 < 0)',
    title_ko: '계약 완전 종료',
    title_en: 'Contract Terminated',
    body_ko: '당신과의 비즈니스는 이걸로 완전히 끝이네요. 당신처럼 통제 안 되는 리스크를 계속 둘 순 없으니까요. 뭐... 각자의 테이블에서 건승하길 바랄게요. 안녕.',
    body_en: 'Our business arrangement ends completely with this. I cannot keep an unpredictable risk like you. Well... I wish you the best of luck at your own tables. Goodbye.',
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
            nextEvent: getRelationship(partner.id) < 200 ? EVENT_FLORENCE.BANKRUPT_ACCEPT_RESCUE_LOW_RELATIONSHIPSHIP : EVENT_FLORENCE.BANKRUPT_ACCEPT_RESCUE,
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
          id: partner.id,
          resolveType: MESSAGE_ACTION_RESOLVE_TYPE.ACCEPT,
          to: partner.fullName,
          nextEvent: getRelationship(partner.id) < 200 ? EVENT_FLORENCE.BANKRUPT_ACCEPT_RESCUE_LOW_RELATIONSHIPSHIP : EVENT_FLORENCE.BANKRUPT_ACCEPT_RESCUE,
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
      // if (partner.debt <= 0) return;
      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body, [
        {
          label: this.label_accept,
          actionType: MESSAGE_ACTION_TYPE.DEBT_REPAYMENT,
          payload: {
            amount: partner.initialBankroll,
            currency: 'CR',
            id: partner.id,
            resolveType: MESSAGE_ACTION_RESOLVE_TYPE.ACCEPT,
            to: partner.fullName,
            nextEvent: getRelationship(partner.id) < 200 ? EVENT_FLORENCE.BANKRUPT_ACCEPT_RESCUE_LOW_RELATIONSHIPSHIP : EVENT_FLORENCE.BANKRUPT_ACCEPT_RESCUE,
          }
        },
        {
          label: this.label_refuse,
          actionType: MESSAGE_ACTION_TYPE.DEBT_REPAYMENT,
          payload: {
            resolveType: MESSAGE_ACTION_RESOLVE_TYPE.REFUSE,
            nextEvent: getRelationship(partner.id) < 200 ? EVENT_FLORENCE.BANKRUPT_REFUSE_RESCUE_LOW_RELATIONSHIPSHIP : EVENT_FLORENCE.BANKRUPT_REFUSE_RESCUE
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
      const partner = getPartner(PARTNER_ID.FLORENCE)
      if (!partner) return;
      gainPartnerBankroll(partner, partner.initialBankroll / 2); // 초기 자금 지원
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
      const partner = getPartner(PARTNER_ID.FLORENCE)
      if (!partner) return;
      gainPartnerBankroll(partner, partner.initialBankroll / 2); // 초기 자금 지원
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
