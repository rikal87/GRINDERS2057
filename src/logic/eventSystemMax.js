// for first player
import { sendMessage, MESSAGE_TYPE, MESSAGE_ACTION_TYPE, MESSAGE_ACTION_RESOLVE_TYPE } from "./messageSystem.js";
import { store, registerCompletedEvent, getLanguage, getCurrentBankroll, getCurrentLevel } from "./store.js";
import { gainRelationship, leavePartner, getRelationship, gainPartnerBankroll, getPartner, joinPartner, isJoinedPartner } from "./partnerSystem.js";
import { scheduleEvent } from "./eventSystem.js";
import { recoverStamina } from "./staminaSystem.js";
import { isEventCompleted } from "./eventSystem.js";
import { PARTNER_ID, LOCATION_ID, ENEMY_ID } from './constants.js'
/**
 * @typedef {Object} MaxEvents
 * @property {string} YOU_GET_SOME_SLEEP
 * @property {string} BIG_LOSE
 * @property {string} FISH_HUNTER
 * @property {string} TUTORIAL_START
 * @property {string} TUTORIAL_THEN_LEAVE_RETRY
 * @property {string} TUTORIAL_THEN_LOSE_RETRY
 * @property {string} TUTORIAL_WIN
 * @property {string} TUTORIAL_WIN_MAX
 * @property {string} TUTORIAL_LOSE_MAX
 * @property {string} TUTORIAL_LOSE_PLAYER
 * @property {string} TUTORIAL_LEAVE
 * @property {string} TUTORIAL_LEAVE_AGAIN
 * @property {string} TUTORIAL_WIN_AFTER
 * @property {string} TUTORIAL_DONE // 패배 또는 승리 후 튜토리얼 완료 표시
 * @property {string} RESOLVED_DEBT
 * @property {string} RESOLVED_DEBT_LOW_RELATIONSHIP
 * @property {string} BREAK_CONTRACT_COLLUSION
 * @property {string} BREAK_CONTRACT_BAILOUT
 * @property {string} BREAK_CONTRACT_BENEFIT_SHARE
 * @property {string} BANKRUPT
 * @property {string} BANKRUPT_ACCEPT_RESCUE
 * @property {string} BANKRUPT_REFUSE_RESCUE
 * @property {string} BANKRUPT_ACCEPT_RESCUE_LOW_RELATIONSHIPSHIP
 * @property {string} BANKRUPT_REFUSE_RESCUE_LOW_RELATIONSHIPSHIP
 * @property {string} BANKRUPT_HAS_DEBT // 맥스파산, 플레이어 빚 존재
 * @property {string} BANKRUPT_HAS_DEBT_LOW_RELATIONSHIP // 맥스파산, 플레이어 빚 존재 (관계도 낮음)
 * @property {string} BANKRUPT_HAS_CONTRACT_BAILOUT
 * @property {string} BANKRUPT_HAS_CONTRACT_BAILOUT_FAIL
 * @property {string} SIGN_CONTRACT_BENEFIT_SHARE
 * @property {string} SIGN_CONTRACT_COLLUSION
 * @property {string} SIGN_CONTRACT_BAILOUT
 * @property {string} JOIN_PARTNER // 맥스가 정식 파트너가 되기로 결심합니다.
 * @property {string} JOINED_PARTNER // 맥스를 정식 파트너로 등록했습니다.
 * @property {string} MAIN_STORY_1_MEET_AT_CLUB // 맥스가 클럽에서 플레이어를 만납니다.
 * @property {string} MAIN_STORY_1_2_MEET_AT_CLUB_SUCCESS // 맥스와 플레이어가 클럽에서 게임을 합니다. (승리)
 * @property {string} MAIN_STORY_1_2_MEET_AT_CLUB_FAILED // 맥스와 플레이어가 클럽에서 게임을 합니다. (패배)
 * @property {string} GONE
 * @property {string} DEBT_REPAYMENT_DONE
 * @property {string} DEBT_REPAYMENT_DONE_PLAYER
 * @property {string} DEBT_REPAYMENT_DONE_LOW_RELATIONSHIP
 * @property {string} DEBT_REPAYMENT_DONE_PLAYER_LOW_RELATIONSHIP
 * @property {string} MAIN_STORY_1_4_MEET_AT_CLUB_DONE
 * @property {string} MAIN_STORY_1_5_MEET_AT_CLUB_DONE
 * @property {string} MAIN_STORY_1_6_MEET_AT_CLUB_DONE
 * @property {string} MAIN_STORY_1_7_MEET_AT_CLUB_DONE
 * @property {string} MAIN_STORY_3_0_INTRODUCE_BIG_DADDY
 * @property {string} MAIN_STORY_3_1_CHALLENGE_KBT_LEADER
 * @property {string} PRE_BUILD_UP_RUMOR_BIG_DADDY
 * @property {string} PRE_BUILD_UP_KBT_BROKER_MEET
 * @property {string} PRE_BUILD_UP_MAX_EXCITED_1
 * @property {string} PRE_BUILD_UP_MAX_EXCITED_2
 * @property {string} MAIN_STORY_3_2_CHALLENGE_KBT_ACCEPT
 * @property {string} MAIN_STORY_3_2_CHALLENGE_KBT_REFUSE
 * @property {string} MAIN_STORY_3_2_BIG_DADDY_WIN
 * @property {string} MAIN_STORY_3_2_BIG_DADDY_LOSE
 * @property {string} BAILOUT_FOR_PLAYER
 * @property {string} ELIMINATED
 * @property {string} PLAYER_LEAVE
 * @property {string} PLAYER_ELIMINATED
 * @property {string} WIN_MAX
 * @property {string} WIN_PLAYER
 * @property {string} HOW_TO_USE_AI_AGENT_1
 * @property {string} HOW_TO_USE_AI_AGENT_2
 * @property {string} HOW_TO_USE_AI_AGENT_3
 * @property {string} HOW_TO_USE_AI_AGENT_4
 * @property {string} HOW_TO_USE_AI_AGENT_5
 * @property {string} HOW_TO_USE_AI_AGENT_6
 * @property {string} HOW_TO_USE_AI_AGENT_7
 */
/** @type {MaxEvents} */
export const EVENT_MAX = new Proxy({}, {
  get: (target, prop) => `MAX_${prop}`
});
const SENDER_EN = 'Max';
const SENDER_KO = '맥스';
export const EventData = [
  {
    id: EVENT_MAX.HOW_TO_USE_AI_AGENT_1,
    scenario: '맥스가 유휴 상태인 AI 에이전트 단말기의 기초 활용법을 알려줍니다.',
    title_ko: '어이 친구, 그 깡통 단말기 말이야',
    title_en: 'Hey, about that tin can terminal...',
    body_ko: '그 방구석에 처박아둔 깡통 단말기 말이야. 난 기계 쪼가리한테 내 카드를 맡기는 건 딱 질색이지만, 굳이 먼지만 쌓이게 둘 필요는 없잖아? 일단 전원 버튼이라도 좀 눌러둬.',
    body_en: 'About that tin can terminal you\'ve got gathering dust. I despise leaving my cards to some machine, but there\'s no reason to let it sit idle. At least hit the power button for once.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    timer: 30,
    condition() {
      return getCurrentLevel() >= 2;
    },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO);
      scheduleEvent(EVENT_MAX.HOW_TO_USE_AI_AGENT_2, 25);
    },
  },
  {
    id: EVENT_MAX.HOW_TO_USE_AI_AGENT_2,
    scenario: '맥스가 정부에서 모든 시민에게 무료로 제공되는 뱅가드(Vanguard) AI에 대해 마치 무료 배급소에 비유하듯 반감을 들어냅니다.',
    title_ko: '전원을 켰으면 그...',
    title_en: 'Once it\'s on...',
    body_ko: '정부가 배급소 빵 퍼주듯이 공짜로 제공하는 뱅가드(Vanguard) AI라도 써먹어보라고. 난 그딴 "공짜 점심"은 질색이지만.',
    body_en: 'You might as well use that Vanguard AI the government hands out like a damn soup kitchen. I usually steer clear of "free lunches".',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO);
      scheduleEvent(EVENT_MAX.HOW_TO_USE_AI_AGENT_3, 15);
    },
  },
  {
    id: EVENT_MAX.HOW_TO_USE_AI_AGENT_3,
    scenario: '맥스가 얼마전에 주위사람에게 들은 섀도 워크(Shadow Work) 기능에 대해 언급합니다.',
    title_ko: '근데 말이야',
    title_en: 'But listen',
    body_ko: '얼마 전에 들은 얘긴데, 그 깡통을 서브넷 뒷골목에 던져놓으면 알아서 푼돈을 벌어오게 할 수도 있다더군. 이른바 "섀도 워크(Shadow Work)"라고 부르는 모양인데... 매 시간마다 운만 좋으면 크레딧을 쏠쏠하게 물어온다나 봐.',
    body_en: 'I heard something interesting lately. You can toss that tin can into the sub-net back-alleys and have it scavenge for loose change. They call it "Shadow Work," or something like that... word is they drag back some Credits every hour if luck\'s on your side.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    label_ko: '그게 뭐야?',
    label_en: 'What is that?',
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.TUTORIAL, this.title, this.body, [{
        label: this.label,
        actionType: MESSAGE_ACTION_TYPE.INTERACT,
        payload: {
          resolveType: MESSAGE_ACTION_RESOLVE_TYPE.ACCEPT,
          nextEvent: EVENT_MAX.HOW_TO_USE_AI_AGENT_4,
        }
      }], getLanguage() === 'en' ? SENDER_EN : SENDER_KO);
    },
  },
  {
    id: EVENT_MAX.HOW_TO_USE_AI_AGENT_4,
    scenario: '맥스가 섀도 워크의 위험성과 이점을 설명하며 튜토리얼을 마무리합니다.',
    title_ko: '어디 한번 굴려보라고!',
    title_en: 'Give it a Spin!',
    body_ko: '듣기로는 토큰(LT) 소모가 장난 아니게 심하긴 하다던데, 그래도 가끔 크레딧을 물어오면 꽤 쏠쏠할 거야. 주머니 사정이 안 좋을 때 집에서 한번 굴려보는 것도 나쁘지 않겠지. 나중에 맥주나 한 잔 사라고, 알았냐?',
    body_en: 'I hear they burn through LT like crazy, but if they drag back some Credits now and then, it\'s damn well worth it. If your pockets are feeling light, try setting it up at your home terminal. You owe me a beer if it pays off, alright?',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.TUTORIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_MAX.HOW_TO_USE_AI_AGENT_5, 15);
    },
  },
  {
    id: EVENT_MAX.HOW_TO_USE_AI_AGENT_5,
    scenario: '맥스와 나눈 대화를 기반으로 시스템 추가 안내를 내보냅니다.',
    title_ko: 'AI 에이전트 사용자 매뉴얼 1',
    title_en: 'AI Agent User Manual 1',
    body_ko: '2057년의 그라인더에게 AI 에이전트는 생존의 필수 요소입니다. 먼저 거주 구역(Habitat) 좌측의 단말기를 확인하십시오. 테스크 슬롯에 활성화된 [족보 오버레이]를 길게 눌러 해당 작업을 제거할 수 있습니다.',
    body_en: 'In 2057, an AI Agent is essential for survival. Check the terminal on the left side of your Habitat. Long-press the active [Hand Overlay] in the task slot to remove it.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.TUTORIAL, this.title, this.body)
      scheduleEvent(EVENT_MAX.HOW_TO_USE_AI_AGENT_6, 25);
    },
  },
  {
    id: EVENT_MAX.HOW_TO_USE_AI_AGENT_6,
    scenario: '맥스와 나눈 대화를 기반으로 시스템 추가 안내를 내보냅니다.2',
    title_ko: 'AI 에이전트 사용자 매뉴얼 2',
    title_en: 'AI Agent User Manual 2',
    body_ko: '슬롯이 비워졌다면, 해당 빈 슬롯을 클릭하여 태스크 목록을 엽니다. 목록에서 [섀도 워크(Shadow Work)]를 선택하여 새로운 작업을 할당하십시오.',
    body_en: 'Once the slot is empty, click it to open the task selection menu. Select [Sub-net Shadow Work] from the list to assign it.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.TUTORIAL, this.title, this.body)
      scheduleEvent(EVENT_MAX.HOW_TO_USE_AI_AGENT_7, 25);
    },
  },
  {
    id: EVENT_MAX.HOW_TO_USE_AI_AGENT_7,
    scenario: '맥스와 나눈 대화를 기반으로 시스템 추가 안내를 내보냅니다.3',
    title_ko: 'AI 에이전트 사용자 매뉴얼 3',
    title_en: 'AI Agent User Manual 3',
    body_ko: '모든 에이전트 작업은 LT(Lodus Token)를 소모합니다. 작업 중 LT가 고갈되면 현재 진행 중인 태스크가 즉시 취소되니 주의하십시오. LT는 시간이 흐름에 따라 서서히 충전됩니다.',
    body_en: 'All agent tasks consume LT (Lodus Token). If you run out of LT during a task, the process will be canceled immediately. LT will naturally recharge over time.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.TUTORIAL, this.title, this.body)
    },
  },
  {
    id: EVENT_MAX.WIN_MAX,
    scenario: '플레이어와 맥스가 승리시(MAX CHIP > PLAYER)',
    title_ko: '크하하! 봤냐? 이게 텍사스 스타일이지!',
    title_en: 'Hahaha! Did ya see that? That\'s Texas style, baby!',
    body_ko: '너도 제법 치긴 했는데, 아직 이 형님 따라오려면 멀었다 짜샤! ㅋㅋㅋ 그래도 등딱지 안 털리고 살아남은 건 칭찬해주마. 끝나고 맥주나 한 잔 하러 가자고!',
    body_en: 'You didn\'t do half bad out there, but you\'ve still got a long way to go to catch up to me, kid! Still, gotta give you props for surviving. Let\'s grab some beers to celebrate!',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_MAX.WIN_PLAYER,
    scenario: '플레이어와 맥스가 승리시(MAX.CHIPS < PLAYER.CHIPS)',
    title_ko: '이런 썅... 내 칩이 너보다 적다니?!',
    title_en: 'Well I\'ll be damned... You beat my stack?!',
    body_ko: '와, 너 이자식 텍사스 소 떼마냥 미쳐 날뛰더만! 솔직히 좀 쫄았다. 뭐, 나같이 훌륭한 스승 밑에서 배웠으니 당연한 거려나? 크하하! 아무튼 기특하네 내 친구!',
    body_en: 'Whoa, you were running wild like a herd of Texas longhorns out there! Gotta admit, I was a little nervous. Guess it\'s only natural with a great teacher like me, huh? Hahaha! Damn proud of you, buddy!',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    condition() {
      return getRelationship(PARTNER_ID.MAX) >= 500;
    },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_MAX.TUTORIAL_WIN_AFTER, 15); // 연계 튜토리얼 2탄 스케줄 예약 가능
    },
  },
  {
    id: EVENT_MAX.PLAYER_ELIMINATED,
    scenario: '플레이어가 맥스보다 먼저 패배시',
    title_ko: '아이고 이 화상아!',
    title_en: 'Lord have mercy!',
    body_ko: '내가 가르쳐준 그 알량한 텍사스 스킬들은 다 어디다 팔아먹었냐? 으휴... 일단 바에 가서 시원한 맥주나 한잔 하고 있어라. 형님이 네 몫까지 복수해줄 테니까!',
    body_en: 'Did you already forget every Texas trick I taught you?! Sheesh... Go grab a cold beer at the bar. Your big brother\'s gonna avenge your stack! Just watch and learn!',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_MAX.ELIMINATED,
    scenario: 'Max가 먼저 버스트 당했습니다.',
    title_ko: '아오 썅! 빌어먹을 리버 카드!!',
    title_en: 'Son of a gun! That damn river card!!',
    body_ko: '오늘 딜러가 나랑 웬수라도 졌나, 패가 개판이네! 크흠... 아무튼 난 먼저 올인났다. 파트너, 내 칩까지 다 긁어모아서 저놈들 콧대를 팍 꺾어버려 줘!',
    body_en: 'The dealer must have a personal vendetta against me today, these cards are trash! Ahem... anyway, I\'m busted. Partner, scoop up every last chip on that table and break their damn pride for me!',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_MAX.PLAYER_LEAVE,
    scenario: '플레이어가 Max와 함께 게임을 즐기다가 먼저 떠납니다.',
    title_ko: '어이쿠, 야반도주냐?!',
    title_en: 'Whoa there, making a run for it?!',
    body_ko: '먼저 간다고? 아하, 칩 좀 땄다 이거냐? 농담이고, 뭐 급한 일 있으면 어쩔 수 없지. 등 뒤는 내가 지킬 테니 몸조심하고 나중에 연락해라 짜샤!',
    body_en: 'Bailin\' out early? Aha, guess your pockets are full enough, huh? Just pullin\' your leg. If it\'s urgent, can\'t be helped. I\'ll hold down the fort here, so stay safe and hit me up later!',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO);
    },
  },
  {
    id: EVENT_MAX.BAILOUT_FOR_PLAYER,
    scenario: '플레이어가 파산했고 맥스가 자금을 지원했습니다.',
    title_ko: '역시 내 친구다!',
    title_en: 'That\'s My Friend!',
    body_ko: '이런, 꼴딱 다 까먹었다니! 하지만 걱정 마, 친구! 내가 가진 거 전부 털어서 어떻게든 다시 일으켜 세워줄게. 텍사스 사나이의 의리는 이런 때 빛나는 법이지!',
    body_en: 'Damn, you lost it all! But don\'t sweat it, friend! I\'ll put everything I\'ve got into getting you back on your feet. That\'s what Texas loyalty is all about!',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_MAX.DEBT_REPAYMENT_DONE_PLAYER_LOW_RELATIONSHIP,
    scenario: '플레이어가 맥스에게 빚진 돈을 모두 갚았습니다.(하지만 플레이어랑 사이가 별로 좋진 않은 상태입니다...)',
    title_ko: '채무 상환 확인',
    title_en: 'Debt Repayment Confirmed',
    body_ko: '입금된 거 방금 확인했어. 제때 갚아줘서 다행이네. 돈 거래는 확실해야 뒤탈이 없는 법이니까. 수고해.',
    body_en: 'Just confirmed the deposit. Glad you paid it back on time. Money matters need to be kept clean. See ya.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_MAX.JOIN_PARTNER,
    scenario: '[맥스]가 정식 파트너가 되기로 결심합니다. (플레이어의 자산이 3만 CR 이상 또는 관계도 600 이상일 때)',
    title_ko: '텍사스 듀오 결성 제안',
    title_en: 'Texas Duo Proposal',
    body_ko: '하하! 실력이 아주 물이 올랐구만 친구! 뒷골목 피쉬들 돈이나 뜯어먹기엔 이제 아까운 실력이야. 이 정도면 나랑 본격적으로 등 맞대고 뛰어도 되겠어. 제대로 텍사스 마초 듀오를 결성해 볼까?',
    body_en: 'Haha! You\'ve really sharpened those claws, friend! You\'re too good to just be swiping chips from back-alley fish now. With skills like that, you\'re ready to watch my back. What do you say we form a real Texas macho duo?',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    timer: 30,
    condition: () => {
      return getCurrentBankroll() > 30000 || getRelationship(PARTNER_ID.MAX) > 650;
    },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_MAX.JOINED_PARTNER, 1);
    },
    repeatable: false,
  },
  {
    id: EVENT_MAX.JOINED_PARTNER,
    scenario: '맥스가 파트너로 등록되었습니다.(시스템 안내용)',
    title_ko: '[맥스]가 파트너로 등록되었습니다.',
    title_en: '[Max] Registered as Partner',
    body_ko: '신규 파트너 [맥스]가 추가되었습니다. [안전가옥] > [파트너] 탭에서 확인 가능합니다.',
    body_en: 'New partner [Max] has been added. You can check it in the [Partner] tab of the [Safe House].',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      joinPartner(PARTNER_ID.MAX);
      sendMessage(MESSAGE_TYPE.SYSTEM, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_MAX.MAIN_STORY_1_MEET_AT_CLUB,
    scenario: '네온 라운지에서 수집한 정보인 H.B.D 클럽의 VIP 룸에 꽤 돈이 많은 호구들이 모인다는 정보를 입수하여 맥스를 만나 한탕 뛰기로 합니다.',
    title_ko: '큰 판이 열린다',
    title_en: 'Big game brewing',
    body_ko: '이봐 친구, 네온 라운지에서 활동하는 어떤 그라인더한테 흥미로운 얘길 들었어. 오늘 밤 H.B.D 클럽 VIP 룸에 돈 냄새 풀풀 풍기는 부잣집 호구들이 잔뜩 모인다더군. 저녁에 다시 연락줄테니 준비해둬.',
    body_en: 'Listen up buddy, a grinder I know over at the Neon Lounge just gave me a sweet tip. Tonight, the VIP room at H.B.D Club is gonna be crawling with rich suckers stinking of cash. I\'ll call you later tonight, so get ready.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.MISSION, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO);
    },
  },
  {
    id: EVENT_MAX.MAIN_STORY_1_1_MEET_AT_CLUB,
    scenario: 'MAIN_STORY_1_MEET_AT_CLUB 연계 이벤트',
    title_ko: '지금이야, H.B.D 로 와라',
    title_en: 'Now, get to H.B.D',
    body_ko: '시간 됐다. 아주 살코기가 꽉 찬 녀석들이니까 판돈 든든하게 챙겨서 클럽으로 와라. 한몫 단단히 챙겨보자고!',
    body_en: ' It\'s time. They\'re fat, juicy, and ready to be bled dry. Bring a heavy stack of chips and meet me there. We\'re gonna make a killing!',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    label_ko: '참가하기',
    label_en: 'Join',
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    timer: 32,
    condition: () => {
      return isEventCompleted(EVENT_MAX.MAIN_STORY_1_MEET_AT_CLUB) && new Date(store.gameTime).getHours() >= 22;
    },
    func() {
      sendMessage(MESSAGE_TYPE.MISSION, this.title, this.body, [
        {
          label: this.label,
          actionType: 'ACCEPT_INVITE',
          payload: {
            resolveType: 'JOIN',
            location_id: LOCATION_ID.LOW_UNDERGROUND_CLUB_MEET_MAX
          }
        },
      ], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_MAX.MAIN_STORY_1_2_MEET_AT_CLUB_FAILED,
    scenario: 'MAIN_STORY_1_MEET_AT_CLUB 미션 -[Rich_Guy] 털어먹기 실패 (중도 탈락) 이벤트',
    title_ko: '퉤, 오늘 물 버렸네.',
    title_en: 'Spit, water\'s gone bad tonight.',
    body_ko: '아오 썅, 그 자식들 겉멋만 든 줄 알았더니 생각보다 빡센 놈들이었네. 올인 나기 전에 튀는 것도 실력이지 뭐. 오늘은 일단 후퇴다!',
    body_en: 'Ah shit, thought those punks were just all show, but they\'re tougher than they look. Knowing when to bail before going bust is a skill too. We retreat for now!',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_MAX.MAIN_STORY_1_3_MEET_AT_CLUB_DONE, 20)
    },
  },
  {
    id: EVENT_MAX.MAIN_STORY_1_2_MEET_AT_CLUB_SUCCESS,
    scenario: 'MAIN_STORY_1_MEET_AT_CLUB 미션 -[Rich_Guy] 털어먹기 성공 이벤트',
    title_ko: '크하하! 봤냐?!',
    title_en: 'Mwahaha! Did you see that?!',
    body_ko: '이게 진짜 텍사스 마초 듀오의 힘이지! 그 놈들 표정 썩어들어가는 거 봤냐? 이 쌓인 돈 좀 보라고, 하하하! 오늘 밤엔 내가 최고급 스테이크 쏜다!',
    body_en: 'That\'s the power of the Texas macho duo! Did you see the look on those suckers\' faces? Just look at this mountain of money, hahaha! Premium steak is on me tonight!',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_MAX.MAIN_STORY_1_3_MEET_AT_CLUB_DONE, 10)
    },
  },
  {
    id: EVENT_MAX.MAIN_STORY_1_3_MEET_AT_CLUB_DONE,
    scenario: 'MAIN_STORY_1_MEET_AT_CLUB 미션 완료후 맥스가 플레이어에게 말을 거는 이벤트',
    title_ko: '어이, 근데 말이야...',
    title_en: 'Hey, but you know...',
    body_ko: '아까 그 VIP 룸에 앉아있던 여자 말이지. 얼음장같이 차갑게 생겨가지곤 칩 쓸어담던 그 여자. 어디서 본 얼굴인데... 분명 텍사스 그라인더 판에서 굴러먹던 시절에 어디선가 마주친 적이 있는 거 같단 말이지. 아... 썅, 누구였더라?',
    body_en: 'The ice queen in the VIP room, bleeding the table dry. I\'ve seen her before. Somewhere... back in my days grinding the Texas underground. I\'m sure of it. Ah... shit, who was it?',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_MAX.MAIN_STORY_1_5_MEET_AT_CLUB_DONE, 20)
    },
  },
  {
    id: EVENT_MAX.MAIN_STORY_1_5_MEET_AT_CLUB_DONE,
    scenario: 'MAIN_STORY_1_4_MEET_AT_CLUB_DONE 연계',
    title_ko: '아 썅! 기억났다!',
    title_en: 'Ah shit! I remember now!',
    body_ko: '플로렌스! 그래 맞아, 플로렌스 피어스! 라스베가스 하이롤러 판에서 이름 꽤나 날리던 여자라고. 어쩐지 포스가 장난 아니더라니.',
    body_en: 'Florence! Yeah, that\'s right, Florence Pierce! She\'s a big name from the Vegas high-roller scene. No wonder her vibe was no joke.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_MAX.MAIN_STORY_1_6_MEET_AT_CLUB_DONE, 12)
    },
  },
  {
    id: EVENT_MAX.MAIN_STORY_1_6_MEET_AT_CLUB_DONE,
    scenario: 'MAIN_STORY_1_5_MEET_AT_CLUB_DONE 연계',
    title_ko: '근데 여긴 웬일이래?',
    title_en: 'What\'s she doing here though?',
    body_ko: '그렇게 잘 나가던 여자가 이런 촌구석 뒷골목 클럽엔 왜 굴러들어온 거지? 뭐 크게 한탕 말아먹고 도망이라도 온 건가? 하, 세상 참 좁아.',
    body_en: 'Why would a big shot like her be playing in a back-alley club? Did she go bust on a massive pot and run away or something? Hah, small world.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_MAX.MAIN_STORY_1_7_MEET_AT_CLUB_DONE, 15)
    },
  },
  {
    id: EVENT_MAX.MAIN_STORY_1_7_MEET_AT_CLUB_DONE,
    scenario: 'MAIN_STORY_1_6_MEET_AT_CLUB_DONE 연계',
    title_ko: '뭐 어쨌든',
    title_en: 'Well, anyway',
    body_ko: '우리가 신경 쓸 일은 아니지. 남의 사정이야 어찌됐든 우린 우리 살길이나 찾자고. 오늘 밤 꽤 피곤했을 텐데 푹 쉬어라, 파트너!',
    body_en: 'None of our business. Whatever her deal is, we just gotta look out for our own survival. You must be wiped out tonight, get some solid rest, partner!',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_MAX.GONE,
    scenario: '맥스는 사라졌습니다 (관계악화, 관계도 < 0)',
    title_ko: '의리는 여기까지다',
    title_en: 'End of the Line',
    body_ko: '어이, 텍사스 사나이의 의리도 여기까지다. 네 등 뒤 하나만큼은 확실하게 맡아줬건만, 돌아오는 게 고작 이거냐? 하, 이제 다 끝난 거 같네. 두 번 다시 내 눈앞에 띄지 마라.',
    body_en: 'Hey, even my Texan loyalty has its limits. I watched your back better than anyone. Is this what I get in return? Hah, guess we\'re done here. Don\'t ever cross my path again.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      leavePartner(PARTNER_ID.MAX)
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_MAX.SIGN_CONTRACT_COLLUSION,
    scenario: 'Max와 (함께 게임하기)계약을 체결했습니다. 이제 플레이어와 함께 게임에 참가할 것입니다!',
    title_ko: '텍사스 콤비 결성',
    title_en: 'Texas Duo Formed',
    body_ko: '하! 좋아! 나야 당근빳따 환영이지. 내가 테이블 분위기를 확 휘저어 놓을테니 넌 뒤에서 달달하게 챙겨가라고! 내 등 뒤를 잘 부탁한다 파트너.',
    body_en: 'Hah! Perfect! I\'m all in for this. I\'ll stir up the whole table with my crazy bets, you just sit back and scoop up the sweet pots! Watch my six, partner.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    repeatable: true,
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_MAX.SIGN_CONTRACT_BENEFIT_SHARE,
    scenario: 'Max와 (수익분배)계약을 체결했습니다. 이제 서로의 수익을 일정 지분만큼 공유합니다!(다만 수익 분배가 불균형하면 관계가 악화될 수 있습니다..)',
    title_ko: '우리 사이에 이정도는 나눠야지',
    title_en: 'We Share the Spoils',
    body_ko: '내 거친 텍사스 스타일 알잖아? 내가 크게 먹든, 네가 얌전하게 쓸어 담든, 어느 쪽이든 짭짤하게 나눠 갖자고! 다만 한쪽이 계속 꿀만 빠는 그림은 피하자. 룰은 공평하게!',
    body_en: 'You know my crazy Texas style, right? Whether I hit a massive pot or you quietly rake them in, we split the loot! Just don\'t become a leech on my stack. Keep it fair!',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    repeatable: true,
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_MAX.SIGN_CONTRACT_BAILOUT,
    scenario: 'Max와 (파산 구제)계약을 체결했습니다. 이제 둘 중 한명이 파산하면 긴급 자금을 지원해 줄겁니다!',
    title_ko: '사나이 최고의 보험',
    title_en: 'The Ultimate Bromance Insurance',
    body_ko: '크으... 진짜 남자의 계약이지. 인생에 올인하다가 길거리에 나앉게 생기면 시원하게 쏴준다는 거잖아? 너 파산하면 내가 텍사스식 최고급 바베큐라도 사들고 찾아간다. 물론 빚은 갚아야겠지만!',
    body_en: 'Oh man... Now this is a real man\'s handshake. If one of us goes broke going all-in on life, the other bails him out! If you hit rock bottom, I\'ll come find you with some premium Texas BBQ. But you\'ll owe me big time, yeah?',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    repeatable: true,
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_MAX.BANKRUPT_HAS_DEBT,
    scenario: 'Max가 파산했습니다, 플레이어에게 빚을 갚으라고 독촉합니다. (플레이어가 빚을 갚지 않으면 관계도가 계속 하락하게됩니다.)',
    title_ko: '야 나 깡통 찼다',
    title_en: 'I\'m busted.',
    body_ko: '임마, 너 나한테 빌려간 돈 안 잊었지? 내가 지금 존나게 급해서 그러는데 빨리 좀 갚아라. 나 진짜 테이블에서 쫓겨날 판이야.',
    body_en: 'Hey man, you didn\'t forget the money you owe me, right? I\'m in a damn tight spot right now, so pay up quick. I\'m about to get kicked off the table.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    repeatable: true,
    func() {
      const partner = getPartner(PARTNER_ID.MAX);
      if (!partner) return;
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_MAX.BANKRUPT_HAS_DEBT_LOW_RELATIONSHIP,
    scenario: 'Max가 파산했고 플레이어와의 관계가 낮습니다(관계도 <= 0). 플에이어에게 빚을 갚으라고 독촉합니다.',
    title_ko: '당장 내 돈 내놔',
    title_en: 'Give me my money now.',
    body_ko: '야!! 너 때문에 내가 이 지경까지 왔잖아! 장난하냐? 뒤지게 맞기 싫으면 지금 당장 내 돈 뱉어내!',
    body_en: 'Hey!! I\'m in this mess because of you! Are you kidding me? Cough up my money right now if you don\'t want a beating!',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    repeatable: true,
    func() {
      const partner = getPartner(PARTNER_ID.MAX);
      if (!partner) return;
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_MAX.RESOLVED_DEBT,
    scenario: '플레이어가 맥스에게 빚을 갚았습니다.',
    title_ko: '역시, 돈 관계는 철저해야지',
    title_en: 'As expected, money relationships must be thorough.',
    body_ko: '그래, 네가 빚을 갚으니 마음이 놓인다. 역시 돈 관계는 철저해야지. 다음에 또 보자.',
    body_en: 'Alright, I feel relieved now that you\'ve paid your debt. As expected, money relationships must be thorough. See you next time.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    repeatable: true,
    func() {
      gainRelationship(PARTNER_ID.MAX, 200);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_MAX.RESOLVED_DEBT_LOW_RELATIONSHIP,
    scenario: 'Max와 플레이어와의 관계가 낮습니다(관계도 <= 0). 플레이어가 맥스에게 빚을 갚았습니다.',
    title_ko: '안주면 경찰에 신고하려 했는데',
    title_en: 'I was going to call the cops if you didn\'t pay.',
    body_ko: '진작 갚았으면 서로 좋았을거 아냐? 다음 부턴 제때 갚아라.',
    body_en: 'We would have been better off if you\'d paid me back earlier. Pay me back on time next time.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    repeatable: true,
    func() {
      gainRelationship(PARTNER_ID.MAX, 50);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_MAX.BANKRUPT,
    scenario: 'Max가 파산했습니다. 플레이어 자금을 지원해달라고 요청합니다. (플레이어가 자금을 지원하면 관계가 향상됩니다.)',
    title_ko: '도움이 필요해',
    title_en: 'I need some help.',
    body_ko: '아 썅, 오늘 진짜 더럽게 안 풀리네. 나 올인났다. 친구야, 지금 여유 좀 있으면 칩 좀 쏴줄 수 있냐? 금방 불려서 갚을게.',
    body_en: 'Ah shit, today is just not my day. I\'m busted. Hey buddy, if you have some to spare, could you shoot me some chips? I\'ll run it up and pay you right back.',
    label_accept_ko: '승낙하기',
    label_accept_en: 'Accept',
    label_refuse_ko: '거절하기',
    label_refuse_en: 'Refuse',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get label_accept() { return store.settings.language === 'en' ? this.label_accept_en : this.label_accept_ko; },
    get label_refuse() { return store.settings.language === 'en' ? this.label_refuse_en : this.label_refuse_ko; },
    repeatable: true,
    func() {
      const partner = getPartner(PARTNER_ID.MAX)
      if (!partner) return;
      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body, [
        {
          label: this.label_accept,
          actionType: MESSAGE_ACTION_TYPE.DEBT_REPAYMENT,
          payload: {
            amount: partner.initialBankroll,
            currency: 'CR',
            resolveType: MESSAGE_ACTION_RESOLVE_TYPE.ACCEPT,
            id: partner.id,
            to: partner.fullName,
            nextEvent: getRelationship(partner.id) < 200 ? EVENT_MAX.BANKRUPT_ACCEPT_RESCUE_LOW_RELATIONSHIPSHIP : EVENT_MAX.BANKRUPT_ACCEPT_RESCUE,
          }
        },
        {
          label: this.label_refuse,
          actionType: MESSAGE_ACTION_TYPE.DEBT_REPAYMENT,
          payload: {
            resolveType: MESSAGE_ACTION_RESOLVE_TYPE.REFUSE,
            nextEvent: getRelationship(partner.id) < 200 ? EVENT_MAX.BANKRUPT_REFUSE_RESCUE_LOW_RELATIONSHIPSHIP : EVENT_MAX.BANKRUPT_REFUSE_RESCUE
          }
        }
      ], getLanguage() === 'en' ? SENDER_EN : SENDER_KO, 24 * 60 * 2)
    },
  },
  {
    id: EVENT_MAX.BANKRUPT_ACCEPT_RESCUE,
    scenario: 'Max가 파산했고 플레이어가 자금을 지원했습니다.',
    title_ko: '역시 내 친구다!',
    title_en: 'That\'s my friend!',
    body_ko: '크으... 진짜 고맙다! 역시 텍사스 의리 어디 안가네! 너 진짜 내가 평생 안 잊는다. 한 판 시원하게 먹고 올게!',
    body_en: 'Hell yeah... thanks a ton! Texan loyalty never dies! I\'m never gonna forget this. Wait here, I\'m gonna go scoop a huge pot!',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    repeatable: true,
    func() {
      gainRelationship(PARTNER_ID.MAX, 400);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_MAX.BANKRUPT_ACCEPT_RESCUE_LOW_RELATIONSHIPSHIP,
    scenario: 'Max가 파산했고 플레이어가 자금을 지원했습니다. (관계도가 낮음)',
    title_ko: '의외인데?',
    title_en: 'Well, that\'s a surprise.',
    body_ko: '오... 네가 칩을 다 대주고, 진짜 의외다. 지난번엔 좀 예민하게 굴어서 미안했고, 고맙게 잘 쓸게.',
    body_en: 'Wow... you actually covering me? That\'s a real surprise. Sorry for being a bit on the edge last time, I\'ll put this to good use.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    repeatable: true,
    func() {
      gainRelationship(PARTNER_ID.MAX, 400);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_MAX.BANKRUPT_REFUSE_RESCUE,
    scenario: 'Max가 파산했고 플레이어가 자금 지원을 거절했습니다.',
    title_ko: '매정한 놈',
    title_en: 'Cold-hearted bastard',
    body_ko: '뭐? 돈이 없다고? 치사하게 진짜... 알았어, 딴 데서 구해보지 뭐. 나중에 후회나 하지 마라.',
    body_en: 'What? You\'re broke too? That\'s cold... fine, I\'ll find it somewhere else. Don\'t regret this later.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    repeatable: true,
    func() {
      gainRelationship(PARTNER_ID.MAX, -200);
      const partner = getPartner(PARTNER_ID.MAX);
      if (!partner) return;
      gainPartnerBankroll(partner, partner.initialBankroll / 2); // 초기 자금 지원
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_MAX.BANKRUPT_REFUSE_RESCUE_LOW_RELATIONSHIPSHIP,
    scenario: 'Max가 파산했고 플레이어가 자금 지원을 거절했습니다. (관계도가 낮음)',
    title_ko: '너 이 새끼.',
    title_en: 'You bastard.',
    body_ko: '아오, 텍사스 망신 다 시키는 자식. 너 같은 새끼한테 기대한 내가 등신이지. 다신 연락 안 한다.',
    body_en: 'Ugh, you\'re an embarrassment to Texas. I\'m an idiot for expecting anything from a jerk like you. Lose my number.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    repeatable: true,
    func() {
      gainRelationship(PARTNER_ID.MAX, -999);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_MAX.BREAK_CONTRACT_COLLUSION,
    title_ko: '혼자 다녀라',
    title_en: 'Fly solo from now on',
    body_ko: '하아, 너랑 같이 테이블에 앉아 있으면 내 패까지 꼬이는 느낌이야. 콤비 놀이는 여기까지 하자. 각자도생 텍사스 스타일 알지?',
    body_en: 'Sigh, sitting at the same table as you is dragging my luck down too. Let\'s end this partner gig. It\'s every man for himself, Texas style, you know?',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    repeatable: true,
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
    repeatable: true
  },
  {
    id: EVENT_MAX.BREAK_CONTRACT_BAILOUT,
    title_ko: '밑 빠진 독에 물 붓기',
    title_en: 'Pouring water in a broken jug',
    body_ko: '야, 나도 내 코가 석 자야. 한두 번이야 땜빵해 주지, 네 빚 처리하다간 나까지 파산하겠다. 구제 계약은 오늘부터 취소다.',
    body_en: 'Hey, I\'ve got my own problems to worry about. I can cover you once or twice, but paying your debts is gonna bankrupt me too. Our rescue deal is over today.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    repeatable: true,
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
    repeatable: true
  },
  {
    id: EVENT_MAX.BREAK_CONTRACT_BENEFIT_SHARE,
    title_ko: '각자 벌어먹자고',
    title_en: 'Eat what you kill',
    body_ko: '수익 공유? 장난하냐? 이건 뭐 너 좋은 일만 시켜주는 꼴이잖아. 앞으론 각자 벌어서 각자 먹자. 계약 해지야.',
    body_en: 'Profit sharing? Are you kidding me? This is just me doing charity for you. From now on, you eat what you kill. The contract is cancelled.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
    repeatable: true
  },
  {
    id: EVENT_MAX.YOU_GET_SOME_SLEEP,
    title_ko: '어이, 눈 감기는 거 다 보인다.',
    title_en: 'Hey, I can see you nodding off.',
    body_ko: '이봐 친구, 테이블에서 반쯤 졸고 있는 거 옆 동네까지 소문 다 났어. 그따위 컨디션으로 치다간 칩 다 빨리기 십상이라고. 얼른 가서 눈 좀 붙여라.',
    body_en: 'Listen pal, word\'s out all the way to the next town that you\'re half-asleep at the table. Playin\' in that condition is a guaranteed way to lose your shirt. Go get some shut-eye.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    timer: 20, // after 20 minutes(in game)
    condition() {
      // 체력이 20 이하로 떨어졌을 때 활성화
      return store.stamina <= 15 && getRelationship(PARTNER_ID.MAX) >= 350;
    },
    func() {
      recoverStamina(15)
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
    repeatable: false
  },
  {
    id: EVENT_MAX.BIG_LOSE,
    title_ko: '그렇게 치다간 뼈도 못 추린다.',
    title_en: 'You\'ll be stripped to the bone playin\' like that.',
    body_ko: '게임 안 풀릴 땐 테이블에서 일어나는 것도 실력이야. 피자라도 하나 시켜 먹어라. 내 앞으로 달아놨으니까 든든하게 먹고 쉬어.',
    body_en: 'Knowin\' when to walk away from a cold table is a skill itself. Go order yourself a pizza, I already put it on my tab. Eat up and take a breather.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    timer: 15, // after 5 minutes(in game)
    condition() {
      return getRelationship(PARTNER_ID.MAX) >= 300 && getCurrentBankroll() === 0;
    },
    func() {
      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body, [{
        label: `RECEIVE`,
        actionType: 'RECEIVE',
        payload: {
          amount: 2500,
          currency: 'CR'
        }
      }], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
    repeatable: false
  },
  {// simulate repeatable event
    id: EVENT_MAX.FISH_HUNTER,
    title_ko: '어이, 월척 낚으러 갈 시간이다!',
    title_en: 'Hey, time to catch some big fish!',
    body_ko: '하하! 이봐, 호구들이 잔뜩 깔린 기가 막힌 물을 하나 찾았거든? 딱 네가 좋아할 만한 사이즈니까 얼른 텍사스 스타일로 테이블 한번 제대로 쓸어보자고! 준비되면 바로 합류해!',
    body_en: 'Haha! Listen up, I just found a sweet spot crawling with easy money! It\'s exactly the kind of action you love. Let\'s clean \'em out Texas style! Join me as soon as you\'re ready!',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    accept_ko: '참가하기',
    accept_en: 'Join',
    refuse_ko: '거절하기',
    refuse_en: 'Refuse',
    get acceptLabel() { return store.settings.language === 'en' ? this.accept_en : this.accept_ko; },
    get refuseLabel() { return store.settings.language === 'en' ? this.refuse_en : this.refuse_ko; },
    timer: 3 * 24 * 60, // 3days
    condition() {
      return store.completedEvents.includes(EVENT_MAX.TUTORIAL_WIN_AFTER) && getRelationship(PARTNER_ID.MAX) >= 300
    },
    func() {
      sendMessage(MESSAGE_TYPE.EVENT, this.title, this.body, [
        {
          label: this.acceptLabel,
          actionType: MESSAGE_ACTION_TYPE.ACCEPT_INVITE,
          payload: {
            resolveType: MESSAGE_ACTION_RESOLVE_TYPE.JOIN,
            location_id: LOCATION_ID.MICRO_WAREHOUSE_WITH_MAX
          }
        },
        {
          label: this.refuseLabel,
          actionType: MESSAGE_ACTION_TYPE.ACCEPT_INVITE,
          payload: {
            resolveType: MESSAGE_ACTION_RESOLVE_TYPE.REFUSE,
            nextEvent: EVENT_MAX.FISH_HUNTER_REFUSE
          }
        }
      ], getLanguage() === 'en' ? SENDER_EN : SENDER_KO, 60 * 24)
    },
    repeatable: true // if repeatable is true, do not register store.completedEvents
  },
  {// simulate repeatable event
    id: EVENT_MAX.FISH_HUNTER_REFUSE,
    scenario: '[EVENT_MAX.FISH_HUNTER] 반복 이벤트 거절',
    title_ko: '참나, 떠 먹여주는데도 안먹네?',
    title_en: 'Geez, you won\'t even take a free meal?',
    body_ko: '네가 안오면 내가 다 먹어야지 뭐. 넌 그냥 네 페이스대로 해라.',
    body_en: 'If you don\'t come, I\'ll just eat it all myself. You just do your thing.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    repeatable: true,
    condition() {
      return getRelationship(PARTNER_ID.MAX) >= 500;
    },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
  },
  {
    id: EVENT_MAX.TUTORIAL_START,
    desc_for_dev: 'Max가 플레이어에게 포커를 가르쳐주는 이벤트',
    title_ko: '어이, 포커 한 수 배워볼래?',
    title_en: 'Hey, wanna learn some poker?',
    body_ko: '쌩초보 냄새가 풀풀 나는데 내가 특별히 가르쳐주마. 뒷골목으로 따라와, 내가 테이블에서 어떻게 하는지 두 눈 똑바로 뜨고 지켜보라고. 알겠어?',
    body_en: 'You smell like a total rookie. Follow me to the backroom and watch exactly how I play at the table. Got it?',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    label_ko: '참가하기',
    label_en: 'Join',
    timer: 20, // 30 minutes
    func() {
      sendMessage(MESSAGE_TYPE.TUTORIAL, this.title, this.body, [
        {
          label: this.label,
          actionType: MESSAGE_ACTION_TYPE.ACCEPT_INVITE,
          payload: {
            // location_id: 'free_street_shop_with_max',
            location_id: LOCATION_ID.FREE_STREET_SHOP_WITH_MAX,
            guest: 'Max'
          }
        }
      ], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
    repeatable: false // if repeatable is true, do not register store.completedEvents
  },
  {
    id: EVENT_MAX.TUTORIAL_THEN_LEAVE_RETRY,
    desc_for_dev: 'max가 플레이어에게 포커를 가르쳐주는 이벤트(도망간 후 재시도)',
    title_ko: '지금 나한테서 도망치는 거냐?',
    title_en: 'You running away from me?',
    body_ko: '지금 진지하게 가르쳐 주려는데 어디가냐? 얼른 안 돌아와? 이번엔 중간에 도망가면 진짜 가만 안 둔다.',
    body_en: 'I\'m trying to teach you something here. Better get back here. Run away again, and we\'re gonna have a problem.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    label_ko: '참가하기',
    label_en: 'Join',
    condition() {
      return getRelationship(PARTNER_ID.MAX) >= 500;
    },
    func() {
      sendMessage(MESSAGE_TYPE.TUTORIAL, this.title, this.body, [
        {
          label: this.label,
          actionType: MESSAGE_ACTION_TYPE.ACCEPT_INVITE,
          payload: {
            location_id: LOCATION_ID.FREE_STREET_SHOP_WITH_MAX,
          }
        }
      ], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
    repeatable: false
  },

  {
    id: EVENT_MAX.TUTORIAL_THEN_LOSE_RETRY,
    desc_for_dev: 'max가 플레이어에게 포커를 가르쳐주는 이벤트(패배시 후속 이벤트 발생)',
    title_ko: '하아... 진짜 드럽게 못하네',
    title_en: 'Man... you really suck at this.',
    body_ko: '내가 처음부터 다시 빡세게 굴려줄 테니까 당장 다시 뒷골목으로 기어와. 이대로 보낼 순 없다.',
    body_en: 'I\'m gonna drill you from the top, so get your ass back here. I ain\'t letting you leave like a loser.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    label_ko: '참가하기',
    label_en: 'Join',
    condition() {
      return getRelationship(PARTNER_ID.MAX) >= 500;
    },
    func() {
      sendMessage(MESSAGE_TYPE.TUTORIAL, this.title, this.body, [
        {
          label: this.label,
          actionType: MESSAGE_ACTION_TYPE.ACCEPT_INVITE,
          payload: {
            location_id: LOCATION_ID.FREE_STREET_SHOP_WITH_MAX,
          }
        }
      ], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
    repeatable: true
  },
  {
    id: EVENT_MAX.TUTORIAL_WIN,
    desc_for_dev: 'max가 플레이어에게 포커를 가르쳐주는 이벤트 연계(승리시)',
    title_ko: '와 씨... 내가 질 줄은 몰랐네',
    title_en: 'Well I\'ll be damned... didn\'t think I\'d lose.',
    body_ko: '너 제법 재능이 있잖아? 뭐, 내가 잘 가르친 덕분이지만 ㅋㅋㅋ 짜식, 인정한다.',
    body_en: 'You got some talent, kid. Course, it\'s mostly \'cause of my teaching! Haha, alright, I respect that.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    condition() {
      return getRelationship(PARTNER_ID.MAX) >= 400;
    },
    func() {
      gainRelationship(PARTNER_ID.MAX, 100);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_MAX.TUTORIAL_WIN_AFTER, 15); // 연계 튜토리얼 2탄 스케줄 예약 가능
    },
    repeatable: false
  },
  {
    id: EVENT_MAX.TUTORIAL_WIN_AFTER,
    desc_for_dev: 'max가 플레이어에게 포커를 가르쳐주는 이벤트 연계(승리 후)',
    title_ko: '어쨌든...',
    title_en: 'Anyway...',
    body_ko: '덕분에 나도 몸 좀 풀었다. 나중에 물 좋은 테이블 보이면 연락 때릴 테니까, 대기타고 있어! 알았지?',
    body_en: 'That was a good warmup for me too. I\'ll hit you up when I find a juicy table, so stay sharp! Got it?',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    condition() {
      return getRelationship(PARTNER_ID.MAX) >= 400;
    },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      registerCompletedEvent(EVENT_MAX.TUTORIAL_DONE);
    },
    repeatable: false
  },
  {
    id: EVENT_MAX.TUTORIAL_WIN_MAX,
    desc_for_dev: 'max가 플레이어에게 포커를 가르쳐주는 이벤트 연계(MAX의 최종 승리시)',
    title_ko: '크하하! 어떠냐, 이게 바로 짬바다!',
    title_en: 'Hahaha! How about that? Experience talking!',
    body_ko: '너도 나쁘진 않았는데, 나한텐 아직 멀었어 ㅋㅋㅋ 자, 그래도 고생했으니 택시비나 해라.',
    body_en: 'You weren\'t bad, but you\'re not on my level yet. Here, take this for the cab ride home.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    get label() { return store.settings.language === 'en' ? this.label_en : this.label_ko; },
    label_ko: '알았어',
    label_en: 'OK',
    func() {
      const taxiFee = 2000;

      sendMessage(MESSAGE_TYPE.FINANCE, this.title, this.body, [
        {
          label: this.label,
          actionType: MESSAGE_ACTION_TYPE.RECEIVE,
          payload: {
            amount: taxiFee,
            currency: 'CR',
            sender: getLanguage() === 'en' ? SENDER_EN : SENDER_KO
          }
        }
      ], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
      scheduleEvent(EVENT_MAX.TUTORIAL_WIN_AFTER, 1);
    },
    repeatable: false
  },

  {
    id: EVENT_MAX.TUTORIAL_LOSE_PLAYER,
    desc_for_dev: 'Max가 플레이어에게 포커를 가르쳐주는 이벤트 연계(Max 보다 먼저 패배)',
    title_ko: '야... 너 내 말은 귓등으로 듣냐?',
    title_en: 'Are you even listening to me when you play?',
    body_ko: '내가 기초부터 다 알려줬잖아! 에효... 밥이나 든든하게 먹고 대기해라, 쫌 이따 다시 부를 테니까.',
    body_en: 'I taught you the basics! Sigh... Go get some hot food. I\'ll call you back shortly.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    condition() {
      return getRelationship(PARTNER_ID.MAX) >= 500;
    },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
    repeatable: false
  },


  {
    id: EVENT_MAX.TUTORIAL_LEAVE,
    desc_for_dev: 'Max가 플레이어에게 포커를 가르쳐주는 이벤트 연계(테이블 이탈)',
    title_ko: '야, 어디가?',
    title_en: 'Hey, where are you going?',
    body_ko: '뭐 급한 일 있냐? 텍사스 남자답지 못하게 꽁무니를 빼네. 좀 이따 다시 연락한다.',
    body_en: 'Something urgent? Running off doesn\'t seem very Texan to me. I\'ll hit you up again shortly.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    condition() {
      return getRelationship(PARTNER_ID.MAX) >= 500;
    },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO);
      scheduleEvent(EVENT_MAX.TUTORIAL_THEN_LEAVE_RETRY, 60);
    },
    repeatable: false
  },

  {
    id: EVENT_MAX.TUTORIAL_LEAVE_AGAIN,
    desc_for_dev: 'Max가 플레이어에게 포커를 가르쳐주는 이벤트 연계(테이블 재 이탈)',
    title_ko: '이 자식이 진짜 돌았나...',
    title_en: 'Are you out of your mind...',
    body_ko: '또 도망가? 장난치냐 지금?! 다시는 나한테 배울 생각 마라!',
    body_en: 'Run away again? Are you kidding me?! Don\'t ever expect me to teach you again!',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      registerCompletedEvent(EVENT_MAX.TUTORIAL_DONE);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO)
    },
    repeatable: false
  },
  {
    id: EVENT_MAX.PRE_BUILD_UP_RUMOR_BIG_DADDY,
    title_ko: '흉흉한 소문',
    title_en: 'Disturbing Rumor',
    body_ko: '이봐 친구, 최근 KBT 조직이 뒷골목 판돈을 다 쓸어 담고 있다더군. 그 조직 보스가 "Big Daddy"라는데... 지난밤에 하이롤러 하나를 뼈까지 발라먹었다는 소문이야.',
    body_en: 'Hey friend, heard the KBT org is sweeping up all the back-alley pots lately. Rumor is their boss, "Big Daddy", picked a high-roller clean to the bone last night.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    timer: 1,
    condition() { return getCurrentBankroll() >= 200000 && isJoinedPartner(PARTNER_ID.MAX); },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO);
    },
    repeatable: false
  },
  {
    id: EVENT_MAX.PRE_BUILD_UP_MAX_EXCITED_1,
    title_ko: '야, 파트너! 길거리 소식 들었어!',
    title_en: 'Hey Partner! Heard the rumors on the street!',
    body_ko: '망할, 길거리에 쫙 퍼진 재미난 소문을 이제야 들었네! 그 KGB 앞잡이 놈이 너한테 VIP 매치 제안을 했다며?! 이런 엄청난 얘길 왜 나한테 바로 안 한 거야! ',
    body_en: 'Damn it, I just heard the interesting rumors spreading on the street! That KGB lackey really offered you a VIP match?! Why didn\'t you tell me immediately!',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    condition() { return isJoinedPartner(PARTNER_ID.MAX); },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO);
      scheduleEvent(EVENT_MAX.PRE_BUILD_UP_MAX_EXCITED_2, 15);
    },
    repeatable: false
  },
  {
    id: EVENT_MAX.PRE_BUILD_UP_MAX_EXCITED_2,
    title_ko: '와 썅! 대박 기회다!',
    title_en: 'Holy shit! Jackpot opportunity!',
    body_ko: '드디어 KBT 보스 대가리를 직접 딸 절호의 기회잖아! 당장 50만 모아서 그 판에 치고 들어가자고. 그 녀석들에게 텍사스 마초의 매운맛을 제대로 보여주는 거야!',
    body_en: ' This is our golden chance to take the KBT boss\'s head directly! Let\'s scrap 500k together and crash that table. We\'re gonna show \'em the true spicy taste of a Texas macho!',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    func() {
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO);
    },
    repeatable: false
  },
  {
    id: EVENT_MAX.MAIN_STORY_3_2_CHALLENGE_KBT_ACCEPT,
    title_ko: '직접 보여주고 와라!',
    title_en: 'Show them how it\'s done!',
    body_ko: '그래야 내 텍사스 콤비지! 직접 텍사스 스타일을 보여주고 와라! 저 미치광이의 칩을 바닥까지 긁어모아오라고!',
    body_en: 'That\'s my Texas partner! Go show \'em the Texas style! Scrape every last chip off that maniac\'s table!',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    condition() { return isJoinedPartner(PARTNER_ID.MAX); },
    func() {
      gainRelationship(PARTNER_ID.MAX, 50);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO);
    },
    repeatable: false
  },
  {
    id: EVENT_MAX.MAIN_STORY_3_2_CHALLENGE_KBT_REFUSE,
    title_ko: '아 시시하네',
    title_en: 'Ah, how boring.',
    body_ko: '야 이 쫄보 자식아! 뭐 이런 식으로 남자가 그릇이 작냐? 눈앞의 엄청난 기회를 걷어차다니 진짜 실망이다.',
    body_en: 'You coward! How small is your bowl, man? Kicking away a massive opportunity right in front of you... truly disappointing.',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    condition() { return isJoinedPartner(PARTNER_ID.MAX); },
    func() {
      gainRelationship(PARTNER_ID.MAX, -200);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO);
    },
    repeatable: false
  },
  {
    id: EVENT_MAX.MAIN_STORY_3_2_BIG_DADDY_WIN,
    scenario: 'Big Daddy와의 매치 종료 시 맥스의 반응(승리)',
    title_ko: '우리가 전설을 썼어!',
    title_en: 'We wrote a legend!',
    body_ko: '와하하! 네가 진짜 KBT 리더의 대가리를 박살낼 줄이야! 길거리 놈들이 텍사스 콤비 이름만 들어도 벌벌 떨고 있다고. 오늘 밤은 내가 쏜다! 승축 파티를 즐기자고 파트너!',
    body_en: 'Hahaha! I can\'t believe you actually smashed the KBT leader\'s head! The street punks are trembling just hearing about the Texas duo. Drinks are on me tonight! Let\'s enjoy a victory party, partner!',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    condition() { return isJoinedPartner(PARTNER_ID.MAX); },
    func() {
      gainRelationship(PARTNER_ID.MAX, 100);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO);
    },
    repeatable: false
  },
  {
    id: EVENT_MAX.MAIN_STORY_3_2_BIG_DADDY_LOSE,
    scenario: 'Big Daddy와의 매치 종료 시 맥스의 반응(패배)',
    title_ko: '괜찮아, 파트너?!',
    title_en: 'Are you okay, partner?!',
    body_ko: '썅, 그 영감탱이가 그렇게 끔찍한 독종일 줄은 몰랐네. 완전히 다 털린 거 아니지? 아직 목숨이 붙어있으면 다음을 기약하면 돼! 이 텍사스 남자가 네 뒤를 봐주고 있잖아. 툭툭 털고 다시 시작하자고!',
    body_en: 'Damn, I didn\'t know that old man was such a terrifying beast. You didn\'t lose absolutely everything, right? If you\'re still breathing, there is always a next time! This Texas man has your back. Dust it off and let\'s start again!',
    get title() { return store.settings.language === 'en' ? this.title_en : this.title_ko; },
    get body() { return store.settings.language === 'en' ? this.body_en : this.body_ko; },
    condition() { return isJoinedPartner(PARTNER_ID.MAX); },
    func() {
      gainRelationship(PARTNER_ID.MAX, 50);
      sendMessage(MESSAGE_TYPE.SOCIAL, this.title, this.body, [], getLanguage() === 'en' ? SENDER_EN : SENDER_KO);
    },
    repeatable: false
  }
];
