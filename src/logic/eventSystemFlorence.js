import { sendMessage, MESSAGE_TYPE, MESSAGE_ACTION_TYPE, MESSAGE_ACTION_RESOLVE_TYPE } from "./messageSystem.js";
import { store, getLanguage, getCurrentBankroll, getBustEnemyCount } from "./store.js";
import { gainRelationship, leavePartner, getRelationship, gainPartnerBankroll, getPartner, joinPartner, isJoinedPartner } from "./partnerSystem.js";
import { scheduleEvent } from "./eventSystem.js";
import { EVENT_MAX } from "./eventSystemMax.js";
import { isEventCompleted } from "./eventSystem.js";
import { ENEMY_ID } from './constants.js'

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
 * @property {string} BANKRUPT_HAS_CONTRACT_BAILOUT
 * @property {string} BANKRUPT_HAS_CONTRACT_BAILOUT_FAIL
 * @property {string} BREAK_CONTRACT_COLLUSION
 * @property {string} BREAK_CONTRACT_BAILOUT
 * @property {string} BREAK_CONTRACT_BENEFIT_SHARE
 * @property {string} SIGN_CONTRACT_COLLUSION
 * @property {string} SIGN_CONTRACT_BENEFIT_SHARE
 * @property {string} SIGN_CONTRACT_BAILOUT
 * @property {string} SIGN_CONTRACT_DATE_WITH_ME
 * @property {string} GONE
 * @property {string} MAIN_STORY_2_1_HBD_UNDERGROUND // KBT UNDERGROUND THE BUNKER 미션
 * @property {string} MAIN_STORY_2_2_HBD_UNDERGROUND
 * @property {string} MAIN_STORY_2_2_B_HBD_UNDERGROUND
 * @property {string} MAIN_STORY_2_3_HBD_UNDERGROUND
 * @property {string} MAIN_STORY_2_4_HBD_UNDERGROUND
 * @property {string} MAIN_STORY_2_5_HBD_UNDERGROUND
 * @property {string} MAIN_STORY_2_6_HBD_UNDERGROUND
 * @property {string} MAIN_STORY_2_7_HBD_UNDERGROUND // 주인공과 접선
 * @property {string} MAIN_STORY_2_8_HBD_UNDERGROUND_FAIL // 미션 실패
 * @property {string} MAIN_STORY_2_8_HBD_UNDERGROUND_SUCCESS // 미션 성공
 * @property {string} MAIN_STORY_2_9_HBD_UNDERGROUND_RETRY // 미션 재도전
 * @property {string} JOIN_PARTNER // 플로렌스가 정식 파트너가 되기로 결심합니다.
 * @property {string} JOINED_PARTNER // 프로렌스를 정식 파트너로 등록했습니다.
 * @property {string} RESOLVED_DEBT
 * @property {string} RESOLVED_DEBT_LOW_RELATIONSHIP
 * @property {string} PRE_BUILD_UP_WARN_KBT
 * @property {string} MAIN_STORY_3_0_WARN_BIG_DADDY
 * @property {string} MAIN_STORY_3_2_CHALLENGE_HBD_ACCEPT_FLORENCE
 * @property {string} MAIN_STORY_3_2_CHALLENGE_HBD_REFUSE_FLORENCE
 * @property {string} RICH_GUY_HUNTER
 * @property {string} RICH_GUY_HUNTER_REFUSE
 * @property {string} ELIMINATED
 * @property {string} PLAYER_ELIMINATED
 * @property {string} WIN_FLORENCE
 * @property {string} WIN_PLAYER
 * @property {string} PLAYER_LEAVE
 * @property {string} BAILOUT_FOR_PLAYER
 */
/** @type {FlorenceEvents} */
export const EVENT_FLORENCE = new Proxy({}, {
  get: (target, prop) => `FLORENCE_${prop}`
});

export const COLLUSION_SIGNALS = {
  DOUBLE_MONSTER: {
    ko: '[합동 공세] 둘 다 패가 좋아요. 상대가 있으면 같이 긁어봐요.',
    en: '[Joint Offensive] We both have strong hands. Let\'s squeeze them together.'
  },
  PLAYER_STRONG: {
    ko: '[팟 빌딩] 당신 패가 좋은거 알아요. 기회되면 제가 판을 키워줄게요.',
    en: '[Pot Building] Your hand looks strong. I\'ll try to raise and build the pot.'
  },
  TEAM_SAVINGS: {
    ko: '[라운드 절약] 우리끼리 치는게 의미 없어요, 체크로 넘기죠.',
    en: '[Round Savings] No point fighting each other - let\'s check down.'
  },
  FOLD_ADVICE: {
    ko: '[폴드 권고] 보드가 위험해요, 이번은 퇴각을 권해요.',
    en: '[Fold Advice] The board is dangerous. I recommend folding.'
  },
  PARTNER_WEAK: {
    ko: '[핸드 약함] 제 패가 좋지 않아서 물러날게요.',
    en: '[Weak Hand] My hand isn\'t good enough - stepping back.'
  },
  PLAYER_WEAK: {
    ko: '[폴드 권고] 상황봐서 폴드 하시는게 나을 것 같아요.',
    en: '[Fold Advice] I think it\'s better to fold depending on the situation.'
  },
  SUPPORT_ME: {
    ko: '[팟 빌딩] 제 패가 좋아요. 상황 보면서 레이즈로 판 키워주시겠어요?',
    en: '[Pot Building] My hand is strong. Could you raise to help build the pot when you can?'
  },
  WATCHING_SUPPORT: {
    ko: '[상황 주시] 당신 패 좋은 거 알아요. 제 패로 무리는 안 되지만 상황 보며 닦아볼게요.',
    en: '[Watching] Your hand looks good. I can\'t push hard, but I\'ll help where I can.'
  }
};
export const COLLUSION_FEEDBACK = {
  IGNORE_ADVICE: {
    ko: '[전략 무시] 제 분석보다 본인의 감을 더 믿으시는 건가요?',
    en: '[Advice Ignored] Do you trust your gut more than my analysis?'
  },
  ATTACK_PARTNER: {
    ko: '[팀 공격] 왜 저를 상대로 레이즈를 하시는 거죠?',
    en: '[Team Attack] Why are you raising against me?'
  },
  RUINED_TRAP: {
    ko: '[작전 실수] 너무 서두르셨어요.',
    en: '[Joint Failure] You rushed it.'
  },
  FAILED_TO_SUPPORT: {
    ko: '[신뢰 부족] 좋은 기회였는데... 조금 더 절 믿어보시는 건 어때요?',
    en: '[Lack of Trust] That was a good chance... Why not trust me a bit more?'
  }
};
const SENDER_EN = 'Florence';
const SENDER_KO = '플로렌스';
export const EventData = [
  {
    id: EVENT_FLORENCE.ELIMINATED,
    scenario: '플로렌스가 게임중 버스트 당했습니다.',
    title_ko: '분산의 통제 실패',
    title_en: 'Failure to Control Variance',
    body_ko: '분산의 끝자락이 제 계산 범위를 벗어났네요. 이번 런아웃은 정말... 비합리적이었어요. 전 먼저 퇴근할게요. 파트너, 남은 테이블의 기대수익은 이제 온전히 당신의 몫이에요. 저 무례한 리스크들을 전부 청산해 주세요.',
    body_en: 'The variance tail ended up outside my calculated bounds. That runout was... irrational. I\'m heading out first. Partner, the rest of the table\'s EV is all yours now. Please liquidate those disrespectful risks for me.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.PLAYER_ELIMINATED,
    scenario: '플레이어가 플로렌스보다 먼저 패배했을 때',
    title_ko: '부적절한 리스크 관리',
    title_en: 'Inadequate Risk Management',
    body_ko: '리스크 관리가 전혀 되지 않았군요. 그렇게 이른 시점에 파산하는 건 제 포트폴리오에 없던 시나리오예요. 라운지에서 기다리세요. 남은 수익은 제가 최대한 확보한 뒤에 나중에 얘기하죠.',
    body_en: 'Your risk management was completely inadequate. Busting that early was a scenario my portfolio never accounted for. Wait for me in the lounge. I\'ll secure the remaining returns and we\'ll talk later.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.WIN_FLORENCE,
    scenario: '게임 종료 시 플로렌스의 칩이 플레이어보다 많을 때',
    title_ko: '안정적인 수익 곡선',
    title_en: 'Stable Profit Curve',
    body_ko: '계획대로군요. 시장의 변동성을 잘 제어해서 목표 포지션을 달성했어요. 당신도 제 보조를 맞추느라 고생 많았어요. 오늘 정산 데이터는 꽤 긍정적이겠네요.',
    body_en: 'Just as planned. I controlled the market volatility well and achieved the target position. You did a good job keeping pace with me. Today\'s settlement data should be quite positive.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.WIN_PLAYER,
    scenario: '게임 종료 시 플레이어의 칩이 플로렌스보다 많을 때',
    title_ko: '기대 이상의 퍼포먼스',
    title_en: 'Performance Beyond Expectations',
    body_ko: '놀랍네요. 당신의 결정들이 제가 예상했던 확률적 기댓값보다 훨씬 높은 성과를 냈어요. 인정하죠, 이번만큼은 당신의 직관이 제 계산보다 우수했습니다. 정말 훌륭한 게임이었어요.',
    body_en: 'Surprising. Your decisions yielded results far beyond the probabilistic expectations I projected. I\'ll admit, this time your intuition was superior to my calculations. That was an excellent game.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.PLAYER_LEAVE,
    scenario: '플레이어가 먼저 자리를 뜰 때',
    title_ko: '유동성 계획의 변경',
    title_en: 'Change in Liquidity Plan',
    body_ko: '벌써 철수하시는 건가요? 아직 테이블의 기대수익이 충분히 높은 상태인데 말이죠. 뭐, 각자의 스케줄 관리가 있을 테니까요. 조심히 들어가세요. 정산은 나중에 하죠.',
    body_en: 'Are you withdrawing already? The table\'s expected value is still quite high. Well, I suppose everyone has their own schedule management. Get home safe. We\'ll settle up later.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.BAILOUT_FOR_PLAYER,
    scenario: '플레이어가 파산했고 플로렌스가 자금을 지원했습니다.',
    title_ko: '긴급 수혈 서비스',
    title_en: 'Emergency Liquidity Injection',
    body_ko: '이런, 리스크 관리에 실패하셨군요. 하지만 걱정 마세요, 파트너. 제가 가진 유동성을 동원해서 당신의 포지션을 복구해 드릴게요. 비즈니스에서 가장 중요한 건 기회를 잃지 않는 법이니까요. 물론 이 채무는 나중에 정확히 정산해 주셔야 해요.',
    body_en: 'Oh dear, it seems your risk management failed. But don\'t worry, partner. I\'ll mobilize my liquidity to restore your position. The most important thing in business is not losing the opportunity. Of course, this debt must be settled precisely later.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
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
    id: EVENT_FLORENCE.MAIN_STORY_2_0_HBD_UNDERGROUND,
    scenario: 'MAIN_STORY_1_7_MEET_AT_CLUB_DONE 이후, 플레이어의 명성이 높아져서 미션을 의뢰하려는 플로렌스 이벤트',
    title_ko: '안녕? 혹시 저를 잊은 건 아니죠?',
    title_en: 'Hello. I remember seeing you at the H.B.D Club.',
    body_ko: '왜 있잖아요, 저번에 H.B.D 클럽 VIP 룸에서 같이 앉아 게임했던... 우리 그때 돈만 많은 호구 녀석들 아주 탈탈 털어먹었잖아요.',
    body_en: "Hello. You haven't forgotten me already, have you? We played at the H.B.D Club VIP room—right next to each other. Remember how we absolutely cleaned out those wealthy idiots?",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    timer: 30,
    condition: () => {
      // return isEventCompleted(EVENT_MAX.MAIN_STORY_1_7_MEET_AT_CLUB_DONE) && getBustEnemyCount(ENEMY_ID.GANGSTER) >= 3 && getCurrentBankroll() >= 100000;
      return getCurrentBankroll() >= 100000;
    },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_FLORENCE.MAIN_STORY_2_1_HBD_UNDERGROUND, 10)
    },
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_2_1_HBD_UNDERGROUND,
    scenario: 'MAIN_STORY_2_1_HBD_UNDERGROUND 이벤트, 주인공의 명성이 높아져서 미션을 의뢰하려는 플로렌스',
    title_ko: '다시 생각해도 정말 허접한 판이었죠.',
    title_en: 'It was such an amateur table, looking back.',
    body_ko: '아무튼, 요즘 KBT 깡패 녀석들을 아주 "효율적"으로 처리하고 있다는 소문을 들었어요. 포커 테이블에서 그 무식한 놈들을 줄줄이 파산시켰다면서요? 덕분에 제 체증이 다 내려가더군요!',
    body_en: "Anyway, I've heard rumors that you've been 'efficiently' dealing with those KBT thugs lately. Busting those brutes one by one? Honestly, it's the best news I've heard all week!",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_FLORENCE.MAIN_STORY_2_2_HBD_UNDERGROUND, 10)
    },
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_2_2_HBD_UNDERGROUND,
    scenario: '주인공의 활약(KBT 격파)에 만족감을 드러내는 플로렌스',
    title_ko: '무례한 리스크들',
    title_en: 'Disrespectful Risks',
    body_ko: "그 갱단 녀석들, 단지 제가 여자라는 이유로 제 실력을 무시하는 게 꽤나 불쾌했거든요.",
    body_en: "Those idiots from the gang... they underestimated me just because I'm a woman, which was highly offensive.",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_FLORENCE.MAIN_STORY_2_2_B_HBD_UNDERGROUND, 6)
    },
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_2_2_B_HBD_UNDERGROUND,
    scenario: '이름을 밝히며 친근감을 표시하는 플로렌스',
    title_ko: '아, 맞다!',
    title_en: 'Oh, wait!',
    body_ko: "그러고 보니 아직 제 이름을 안 알려줬네요. 미안해요, 너무 제 기분에만 취해 있었나 봐요. 제 이름은 [플로렌스]라고 해요. 이렇게 다시 만나게 돼서 정말 반가워요 :)",
    body_en: "I just realized I haven't even told you my name yet. My apologies, I guess I got a bit carried away. My name is [Florence]. It's a real pleasure to cross paths with you again :)",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_FLORENCE.MAIN_STORY_2_3_HBD_UNDERGROUND, 10)
    },
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_2_3_HBD_UNDERGROUND,
    scenario: 'H.B.D Club VIP룸에 대해 다시 언급하는 플로렌스',
    title_ko: '일단 다시 본론으로 돌아가죠.',
    title_en: 'Let\'s get back to business.',
    body_ko: "지난 번 당신 친구와 함께 갔던 [H.B.D Club VIP 룸] 기억하죠? 그곳은 평소에는 출입이 불가하지만, 제가 아는 사람 덕분에 출입이 가능해요. 실력 좋은 그라인더인 당신에겐 꽤나 구미가 당기는 정보 아닌가요?",
    body_en: "Remember the [H.B.D Club VIP Room] you visited with your friend? Access is usually restricted, but thanks to a certain acquaintance of mine, I can get us in. For a skilled grinder like yourself, that's a tempting piece of intel, isn't it?",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_FLORENCE.MAIN_STORY_2_4_HBD_UNDERGROUND, 25)
    },
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_2_4_HBD_UNDERGROUND,
    scenario: '[H.B.D Club VIP룸]으로 가서 [담합]을 제안하는 플로렌스',
    title_ko: '공동 작업 제안',
    title_en: 'Joint Operation Proposal',
    body_ko: '제안은 간단해요. 저와 함께 그곳 VIP 룸에 들어가는 거죠. 평소라면 다들 돌부처처럼 타이트하게 치는 녀석들이지만, 클럽 음악이랑 고급 샴페인이 들어가면... 글쎄요, "철저한 통제력"에도 균열이 생기기 마련이거든요.',
    body_en: "My proposal is simple. You're coming with me to that VIP room. Normally, those regulars play as tight as a vault, but add some loud music and flowing champagne... and well, even their 'Rigid Control' starts to show cracks eventually.",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_FLORENCE.MAIN_STORY_2_5_HBD_UNDERGROUND, 20)
    },
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_2_5_HBD_UNDERGROUND,
    scenario: '수익 배분에 대해 이야기하는 플로렌스',
    title_ko: '합리적인 수익 배분',
    title_en: 'Rational Profit Sharing',
    body_ko: '거기서 발생하는 수익은 정당하게 5:5로 하죠. 평소라면 제 엣지를 고려해 더 높은 지분을 요구했겠지만, 당신의 실력은 충분히 검증되었으니까요. 이 정도면 꽤나 매력적인 계약 조건 아닌가요?',
    body_en: "Let's split the profits from there cleanly 5:5. Ordinarily, I'd demand a higher share considering my edge, but your skills are well-proven. Isn't this quite an attractive contract term?",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_FLORENCE.MAIN_STORY_2_6_HBD_UNDERGROUND, 20)
    },
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_2_6_HBD_UNDERGROUND,
    scenario: 'MAIN_STORY_2_5_HBD_UNDERGROUND 연계 이벤트, 주인공의 명성이 높아져서 미션을 의뢰하려는 플로렌스',
    title_ko: '긍정적인 검토',
    title_en: 'Positive Review',
    body_ko: '수락하시는 걸로 이해할게요. 불필요한 협상은 에너지 낭비니까요. 준비할 시간이 필요할 테니, 내일 다시 연락드리죠. 최상의 컨디션을 유지하세요.',
    body_en: "I'll take that as an acceptance. Unnecessary negotiation is a waste of energy. You'll need time to prepare, so I'll contact you again tomorrow. Maintain your peak condition.",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_FLORENCE.MAIN_STORY_2_7_HBD_UNDERGROUND, 19 * 60)
    },
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_2_7_HBD_UNDERGROUND,
    scenario: 'MAIN_STORY_2_6_HBD_UNDERGROUND 연계 이벤트, 하루 뒤 주인공에게 준비가 되었음을 알리고 접선 준비',
    title_ko: '접전 준비 완료',
    title_en: 'Ready for Engagement',
    body_ko: '지금 즉시 [H.B.D Club VIP 룸]으로 오세요. 위치 데이터는 전송했어요. 늦는 건 제 계산에 없는 변수니, 부디 정시에 도착해 주시길 바랄게요. 게임을 시작해 보죠.',
    body_en: "Come to [H.B.D Club VIP Room] immediately. I've sent the location data. Being late is a variable I haven't accounted for, so please arrive on time. Let's start the game.",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    label_ko: '참가하기',
    label_en: 'Join',
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.MISSION, this.title, this.body, [{
        label: this.label,
        actionType: MESSAGE_ACTION_TYPE.ACCEPT_INVITE,
        payload: {
          location_id: LOCATION_ID.LOW_UNDERGROUND_CLUB_VIP_ROOM,
        }
      }], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
    repeatable: true,
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_2_8_HBD_UNDERGROUND_FAIL,
    scenario: 'MAIN_STORY_2_7_HBD_UNDERGROUND 연계 이벤트, 주인공이 미션을 실패했을 때, (주인공에게 가진 플로렌스는 크게 실망하였습니다.)',
    title_ko: '신뢰의 균열',
    title_en: 'Breach of Trust',
    body_ko: '아... 실망스럽네요. 제 계산이 빗나간 건가요, 아니면 당신의 집중력이 흐트러진 건가요? 이런 식의 리스크는 비즈니스에 치명적이에요. 당분간은 서로 거리를 두는 게 현명할 것 같네요.',
    body_en: "Ah... how disappointing. Did my calculations fail, or did your focus waver? Risks like this are fatal to business. It seems wise for us to keep our distance for the time being.",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      if (isEventCompleted(EVENT_FLORENCE.MAIN_STORY_2_8_HBD_UNDERGROUND_SUCCESS)) {
        gainRelationship(PARTNER_ID.FLORENCE, -50);
      } else scheduleEvent(EVENT_FLORENCE.MAIN_STORY_2_9_HBD_UNDERGROUND_RETRY, (Math.random() * 72 + 67) * 60)
    },
    repeatable: true,
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_2_9_HBD_UNDERGROUND_RETRY,
    scenario: 'MAIN_STORY_2_8_HBD_UNDERGROUND_FAIL 이후, 하루 뒤 플로렌스가 다시 미션을 제안',
    title_ko: '재도전의 기회',
    title_en: 'Opportunity for Redemption',
    body_ko: '당신의 이전 데이터는 실망스러웠지만, 시장 상황이 변했어요. 테이블 엣지가 지금 최고조에 달했거든요. 리스크를 안고 다시 한번 협력해 볼 의향이 있나요? 이번엔 확실히 증명해 주길 바랄게요.',
    body_en: "Your previous data was disappointing, but market conditions have changed. The table edge is peaking right now. Are you willing to take the risk and cooperate once more? I expect you to truly prove yourself this time.",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    repeatable: true,
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_FLORENCE.MAIN_STORY_2_7_HBD_UNDERGROUND, (Math.random() * 8 + 4) * 60) // 4 ~ 12
    },
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_2_8_HBD_UNDERGROUND_SUCCESS,
    scenario: 'MAIN_STORY_2_7_HBD_UNDERGROUND 연계 이벤트, 주인공이 미션을 성공했을 때, (플로렌스는 크게 기뻐합니다.)',
    title_ko: '완벽한 실행',
    title_en: 'Perfect Execution',
    body_ko: '역시 제 안목은 틀리지 않았군요. 그 시끄러운 VIP 룸에서 살아남아 수익까지 챙기다니! 기대 이상의 성과예요. 조만간 더 재미있는 제안을 하러 가죠. :)',
    body_en: "As expected, my intuition was correct. To survive that chaotic VIP room and even come away with a profit! It's a performance beyond expectations. I'll come to you with a more interesting proposal soon :)",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      gainRelationship(PARTNER_ID.FLORENCE, 50);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_FLORENCE.JOIN_PARTNER, 2 * 24 * 60); // Join after 1 days
    },
    repeatable: true,
  },
  {// simulate repeatable event
    id: EVENT_FLORENCE.RICH_GUY_HUNTER,
    scenario: '플로렌스가 플레이어에게 H.B.D Vip룸에서 술에 취한채 게임을 하고있는 부자를 게임을 벌이는 곳을 찾아내어 같이 게임을 하자고 제안합니다. (수익은 5:5로 강제로 고정됩니다)',
    title_ko: '기대수익 극대화의 시간',
    title_en: 'High EV Opportunity',
    body_ko: "흥미로운 데이터를 하나 찾았어요. 지난번 처럼 H.B.D VIP 룸에 부자들이 모인다고 하더군요. 지금 들어가면 우리의 기대수익이 비정상적으로 높을 거예요. 자산 증식의 기회인데, 함께하시겠어요?",
    body_en: "I've found some interesting data. Apparently, the whales are gathering in the H.B.D VIP room again. If we move in now, our EV will be abnormally high. It's a rare chance to grow our assets—care to join me?",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    accept_ko: '참가하기',
    accept_en: 'Join',
    refuse_ko: '거절하기',
    refuse_en: 'Refuse',
    get acceptLabel() { return store.settings.language === 'en' ? this.accept_en : this.accept_ko; },
    get refuseLabel() { return store.settings.language === 'en' ? this.refuse_en : this.refuse_ko; },
    timer: 4 * 24 * 60, // 4days
    condition: () => {
      return isEventCompleted(EVENT_FLORENCE.MAIN_STORY_2_8_HBD_UNDERGROUND_SUCCESS) && getRelationship(PARTNER_ID.FLORENCE) >= 300;
    },
    func() {
      sendMessage(MESSAGE_TYPE.EVENT, this.title, this.body, [
        {
          label: this.acceptLabel,
          actionType: MESSAGE_ACTION_TYPE.ACCEPT_INVITE,
          payload: {
            resolveType: MESSAGE_ACTION_RESOLVE_TYPE.JOIN,
            location_id: LOCATION_ID.LOW_UNDERGROUND_CLUB_VIP_ROOM
          }
        },
        {
          label: this.refuseLabel,
          actionType: MESSAGE_ACTION_TYPE.ACCEPT_INVITE,
          payload: {
            resolveType: MESSAGE_ACTION_RESOLVE_TYPE.REFUSE,
            nextEvent: EVENT_FLORENCE.RICH_GUY_HUNTER_REFUSE
          }
        }
      ], getLanguage() === 'en' ? SENDER_EN : SENDER_KO, 60 * 24)
    },
    repeatable: true // if repeatable is true, do not register store.completedEvents
  },
  {// simulate repeatable event
    id: EVENT_FLORENCE.RICH_GUY_HUNTER_REFUSE,
    scenario: '[EVENT_FLORENCE.RICH_GUY_HUNTER] 반복 이벤트 거절',
    title_ko: '기회비용의 발생',
    title_en: 'Opportunity Cost',
    body_ko: '수익 기회를 스스로 거절하다니, 흥미로운 선택이네요. 뭐, 각자의 리스크 관리 방식이 있는 거니까요. 이 기회비용은 오롯이 제가 흡수하도록 하죠.',
    body_en: "Rejecting a clear profit opportunity... an interesting choice. Well, everyone has their own risk management style. I'll just absorb this opportunity cost myself then.",
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    repeatable: true,
    condition() {
      return getRelationship(PARTNER_ID.FLORENCE) >= 500;
    },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.JOIN_PARTNER,
    scenario: '플로렌스가 정식 파트너가 되기로 결심합니다. (조건 달성시)',
    title_ko: '[신뢰의 증명]',
    title_en: '[Proof of Trust]',
    body_ko: '당신과 함께라면 꽤나 합리적인 기대수익을 기대할 수 있겠군요. 정식으로 파트너 계약을 제안합니다. 아, 물론 비즈니스일 뿐이니 오해는 말아주셨으면 해요.',
    body_en: 'I believe partnering with you will yield a fairly reasonable expected value. Consider this a formal proposal. And... please don\'t get the wrong idea. This is strictly business.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      // gainRelationship(PARTNER_ID.FLORENCE, 100);
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
    title_ko: '[계약 완전 종료]',
    title_en: '[Contract Terminated]',
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
    body_ko: '제 계산이 맞다면, 우리 둘이 같은 테이블에 앉을 때 테이블의 EV를 가장 효율적으로 흡수할 수 있어요. 라스베가스의 진짜 게임이 뭔지 보여드리죠.',
    body_en: 'If my calculations are correct, sitting at the same table allows us to absorb the table\'s EV most efficiently. Let me show you what real Las Vegas poker looks like.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    repeatable: true,
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.SIGN_CONTRACT_BENEFIT_SHARE,
    scenario: 'Florence와 (수익분배)계약을 체결했습니다. 이제 서로의 수익을 일정 지분만큼 공유합니다!(다만 수익 분배가 불균형하면 관계가 악화될 수 있습니다..)',
    title_ko: '위험 분산 포트폴리오',
    title_en: 'Risk Diversification Portfolio',
    body_ko: '포커는 결국 분산의 마법을 어떻게 통제하느냐의 싸움이죠. 당신과의 수익 해지는 제 포트폴리오를 완벽하게 보완해 줄 거예요. 물론 당신도 베테랑의 안정감을 누리게 되겠죠. 계약에 서명할게요.',
    body_en: 'Poker is ultimately a battle of controlling variance. Hedging profits with you perfectly complements my portfolio. And of course, you get to enjoy the stability of a veteran. Let\'s make it official.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    repeatable: true,
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.SIGN_CONTRACT_BAILOUT,
    scenario: 'Florence와 (파산 구제)계약을 체결했습니다. 이제 둘 중 한명이 파산하면 초기 자금을 지원해 줄겁니다!',
    title_ko: '최후의 안전장치',
    title_en: 'The Final Safety Net',
    body_ko: '아무리 완벽한 TAG 플레이어라도 다운스윙은 피할 수 없어요. 파산이라는 최악의 리스크를 헷징(Hedging)하는 이 계약은 충분히 합리적이군요. 서로에게 훌륭한 안전장치가 될 거예요.',
    body_en: 'Even the most perfect TAG player can\'t escape downswings. Hedging against the worst-case scenario of bankruptcy is highly rational. This will serve as an excellent safety net for both of us.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    repeatable: true,
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
    repeatable: true,
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
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    repeatable: true,
    func() {
      const partner = getPartner(PARTNER_ID.FLORENCE);
      if (!partner) return;
      // NO OPTION TO REFUSE
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO, 24 * 60 * 1)
    }
  },
  {
    id: EVENT_FLORENCE.BANKRUPT_HAS_DEBT_LOW_RELATIONSHIP,
    scenario: 'Florence가 파산했고 관계도가 낮을 때 빚 상환을 다소 싸늘하게 요구합니다.',
    title_ko: '자금 상환 통보',
    title_en: 'Notice of Repayment',
    body_ko: '지금 제가 많이 예민한 상태거든요. 귀찮은 일 만들지 말고, 밀린 돈 당장 가져오시죠.',
    body_en: 'I am on quite a short fuse right now. Don\'t make things difficult and bring me the money you owe, immediately.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    repeatable: true,
    func() {
      const partner = getPartner(PARTNER_ID.FLORENCE);
      if (!partner) return;
      // NO OPTION TO REFUSE
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO, 24 * 60 * 1)
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
    repeatable: true,
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
      ], getLanguage() === 'en' ? SENDER_EN : SENDER_KO, 24 * 60 * 2)
    },
  },
  {
    id: EVENT_FLORENCE.BANKRUPT_ACCEPT_RESCUE,
    scenario: 'Florence가 파산했고 플레이어가 자금 지원을 했을 때의 정상적인 반응',
    title_ko: '투자 수락',
    title_en: 'Investment Accepted',
    body_ko: '후후, 멋진 안목이네요. 이번 타이밍에 절 도와주신 건 절대 잊지 않을게요.',
    body_en: 'Hehe, what a wonderful eye you have. I definitely won\'t forget that you helped me out this time.',
    repeatable: true,
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
    repeatable: true,
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
    repeatable: true,
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
    repeatable: true,
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
    repeatable: true,
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.BREAK_CONTRACT_BAILOUT,
    title_ko: '부채 구제 계약 파기',
    title_en: 'Debt Rescue Contract Termination',
    body_ko: '저도 땅 파서 장사하는 건 아니라서요. 당신의 끝없는 부채를 감당하다간 저까지 위험해질 것 같네요. 약속했던 구제 계약은 물를게요.',
    body_en: 'I don\'t print money myself, you know. Handling your endless debt is putting me at risk. I\'ll have to cancel our rescue contract.',
    repeatable: true,
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.BREAK_CONTRACT_BENEFIT_SHARE,
    title_ko: '수익 공유 계약 해지',
    title_en: 'Termination of Profit Sharing Contract',
    body_ko: '수익률이 제가 기대했던 것보다 좀 많이 아쉽네요. 매력 없는 파트너십은 서로에게 시간 낭비일 뿐이죠. 계약은 이걸로 끝이에요.',
    body_en: 'The return rate is quite disappointing compared to my expectations. An unappealing partnership is just a waste of time for both of us. The contract ends here.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    repeatable: true,
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_FLORENCE.PRE_BUILD_UP_WARN_KBT,
    title_ko: '벌목꾼의 눈에 띄지 마세요',
    title_en: 'Don\'t catch the lumberjack\'s eye',
    body_ko: '요즘 판을 꽤 크게 벌리시던데, 나무가 너무 빨리 자라면 벌목꾼의 눈에 가장 먼저 띄는 법이죠. 특히 KBT 같은 위험한 집단은 더더욱요. 그 초대에 절대 응하지 마시길 바랍니다.',
    body_en: 'You\'ve been playing some big pots lately. Trees that grow too fast are the first to catch the lumberjack\'s eye. Especially a dangerous group like KBT. I strongly advise against accepting that invitation.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },

    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO);
    },
    repeatable: false
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_3_0_WARN_BIG_DADDY,
    title_ko: '당장 그만두세요',
    title_en: 'Stop immediately',
    body_ko: '진짜로 그 미치광이의 판에 뛰어들 생각이신가요? 통제 불가능한 리스크입니다. 당장 그만두세요.',
    body_en: 'Are you really thinking of jumping into that maniac\'s game? It\'s an uncontrollable risk. Stop immediately.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    condition() { return isJoinedPartner(PARTNER_ID.FLORENCE); },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO);
    },
    repeatable: false
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_3_2_CHALLENGE_HBD_ACCEPT_FLORENCE,
    title_ko: '실망입니다',
    title_en: 'I\'m disappointed',
    body_ko: '결국 제 조언을 무시하셨군요.',
    body_en: 'You ignored my advice in the end.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    condition() { return isEventCompleted(EVENT_MAX.MAIN_STORY_3_2_CHALLENGE_HBD_ACCEPT) && isJoinedPartner(PARTNER_ID.FLORENCE); },
    func() {
      gainRelationship(PARTNER_ID.FLORENCE, -250);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO);
    },
    repeatable: false
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_3_2_CHALLENGE_HBD_REFUSE_FLORENCE,
    title_ko: '현명한 선택 :)',
    title_en: 'A wise choice :)',
    body_ko: '현명한 판단입니다. 우리는 통제 가능한 싸움에만 베팅하면 됩니다.',
    body_en: 'A wise judgment. We only need to bet on fights we can control.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    condition() { return isEventCompleted(EVENT_MAX.MAIN_STORY_3_2_CHALLENGE_HBD_REFUSE) && isJoinedPartner(PARTNER_ID.FLORENCE) },
    func() {
      gainRelationship(PARTNER_ID.FLORENCE, 200);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO);
    },
    repeatable: false
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_3_2_BIG_DADDY_WIN,
    scenario: 'Big Daddy와의 매치 종료 시 플로렌스의 반응(승리)',
    title_ko: '이번 한 번만 넘어가겠어요',
    title_en: 'I\'ll let it slide this once',
    body_ko: '당신의 무모함에 질렸지만... 실력과 자신감 하나만큼은 훌륭하네요. 이번 한 번만 넘어가겠어요.',
    body_en: 'I\'m sick of your recklessness... but your skill and confidence are truly excellent. I\'ll let it slide this once.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    condition() { return isJoinedPartner(PARTNER_ID.FLORENCE); },
    func() {
      gainRelationship(PARTNER_ID.FLORENCE, 50);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO);
    },
    repeatable: false
  },
  {
    id: EVENT_FLORENCE.MAIN_STORY_3_2_BIG_DADDY_LOSE,
    scenario: 'Big Daddy와의 매치 종료 시 플로렌스의 반응(패배)',
    title_ko: '우리 비즈니스는 여기까지입니다',
    title_en: 'Our business ends here',
    body_ko: '제 경고를 그렇게 완전히 무시하다니... 당신은 통제 불가능한 리스크 그 자체입니다. 우리 비즈니스는 여기까지 하죠.',
    body_en: 'To completely ignore my warning like that... You are an uncontrollable risk itself. Our business ends right here.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      leavePartner(PARTNER_ID.FLORENCE);
      gainRelationship(PARTNER_ID.FLORENCE, -999);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO);
    },
    repeatable: false
  }
];
