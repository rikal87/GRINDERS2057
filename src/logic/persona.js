let getSettingLanguage = () => 'ko';
export const setLanguageGetter = (getter) => { getSettingLanguage = getter; };
// import {  } from "./partnerSystem.js";
import { CONTRACT_TYPE, CHAT_TRIGGERS, ENEMY_ID } from './constants.js';
export const CLASSES = {
  VANGUARD: { name: 'Vanguard', philosophy: 'TAG', AF: 3, maxRam: 100, skills: [{ id: 'hud', name: 'HUD', cost: 20, reserved: true }] },
  SENTINEL: { name: 'Sentinel', philosophy: 'Passive', AF: 2, maxRam: 120, skills: [{ id: 'marriage', name: 'Wait', cost: 0 }] },
  HIJACK: { name: 'Hijack', philosophy: 'Cheater', AF: 2, maxRam: 80, skills: [{ id: 'swap', name: 'Swap', cost: 50 }] },
  MANIAC: { name: 'Maniac', philosophy: 'LAG', AF: 4, maxRam: 150, skills: [{ id: 'pressure', name: 'Push', cost: 20 }] },
};
// export 
export const CLASSES_PARTNER = [
  {
    id: 'Max', name: 'Max', fullName: 'Max Houston', philosophy: 'LAG', vPIP: .3, AF: 3.5, WTSD: .29, W$SD: 0.53, chipMultiply: 1.5,
    canContracts: [CONTRACT_TYPE.BENEFIT_SHARE, CONTRACT_TYPE.BAILOUT],
    schedule: [
      { days: '월-토', hours: '13:00-23:00', status: 'GAMBLING' },
      { days: '일', hours: '종일', status: 'RESTING' },
      // 매칭되지 않는 나머지 시간은 기본적으로 IDLE/SLEEPING 등으로 처리됩니다
    ],
    age: 37,
    isAdvanced: false,
    isPartner: true,
    initialBankroll: 27500, initialRelationship: 500,
    // initialBankroll: 0, initialRelationship: 500,
    concept: '같은 텍사스 출신으로 당신의 오랜 친구입니다. 성격은 다소 거칠게 보이지만, 사실 유쾌하고 속정이 깊고 의리가 있습니다.',
    note_ko: '텍사스 출신의 당신의 오랜 친구입니다. 테이블 위에서는 거칠고 변칙적인 플레이로 상대의 평정심을 무너뜨립니다.',
    note_en: 'Your long-time friend from Texas. At the table, he breaks opponents\' composure with rough and unpredictable plays.',
  },
  {
    id: 'Florence', name: 'Florence', fullName: 'Florence Quinn', philosophy: 'TAG', vPIP: .23, AF: 3.5, WTSD: .27, W$SD: 0.57, chipMultiply: 1.5,
    age: 32,
    isAdvanced: false,
    isPartner: true,
    canContracts: [CONTRACT_TYPE.BENEFIT_SHARE, CONTRACT_TYPE.COLLUSION],
    schedule: [
      { days: '수,목,금,토,일', hours: '17:00-24:00', status: 'GAMBLING' },
      { days: '수,금,일', hours: '00:00-03:00', status: 'GAMBLING' },
      { days: '월,화', hours: '종일', status: 'RESTING' }
    ],
    initialBankroll: 73000, initialRelationship: 400,
    concept: '플레이어에게 적대적이지는 않습지만, 다소 차갑고 계산이 깔린듯한 비즈니스적인 말투를 꽤 자주 사용합니다. 하지만 가끔씩 귀여운 면모도 있습니다.',
    note_ko: '아름다움 뒤에 차가운 계산을 숨긴 라스베가스 출신의 베테랑 플레이어. H.B.D 클럽에서 처음 조우했으며, 언제나 정석적이고 견고한 타이트-어그레시브(TAG)의 표본을 보여줍니다.',
    note_en: 'A veteran player from Las Vegas who hides cold calculations behind her beauty. First encountered at the H.B.D Club, she exemplifies solid, textbook Tight-Aggressive (TAG) gameplay.',

  },
  {
    id: 'Kate', name: 'Kate', fullName: 'Allen Kate', philosophy: 'Maniac', vPIP: .55, AF: 4, WTSD: .41, W$SD: 0.51, chipMultiply: 8,
    age: 41,
    isAdvanced: false,
    isPartner: true,
    canContracts: [CONTRACT_TYPE.STAKING],
    schedule: [
      { days: '월-금', hours: '09:00-19:30', status: 'WORKING' },
      { days: '토', hours: '11:00-22:30', status: 'GAMBLING' },
      { days: '일', hours: '종일', status: 'RESTING' }
    ],
    initialBankroll: 5150000, initialRelationship: 300,
    concept: '포커에서 돈을 잃는 것에 그다지 관심이 없고 판돈이 얼마가 됬던 리버에서 상대의 블러프를 잡는 스릴을 즐기는 스타일입니다. 매너 있고 유쾌한 신사지만, 테이블 위에서는 가장 위험한 도박꾼입니다.',
    note_ko: '뉴욕의 자산가이자 거물급 사업가입니다. 포커를 철저히 "유희"로 즐기며, 전략적으로 치밀하진 않지만, 바닥나지 않는 자금력을 무기로 쏟아붓는 변칙적이고 공격적인 베팅은 프로들조차 혀를 내두르게 만듭니다. ',
    note_en: "A high-profile entrepreneur from New York who views poker as the ultimate thrill ride. Kate isn't here to grind for profit. While lacking technical precision, his bottomless bankroll fuels an erratic and hyper-aggressive style that keeps everyone on edge.",
  },
  {
    id: 'Sloan', name: 'Sloan', fullName: 'Sloan Pierce', philosophy: 'TAP', vPIP: .22, AF: 2, WTSD: .26, W$SD: 0.58, chipMultiply: 3,
    age: 31,
    isAdvanced: false,
    isPartner: true,
    canContracts: [CONTRACT_TYPE.COLLUSION],
    schedule: [
      { days: '월-금', hours: '09:00-19:30', status: 'WORKING' },
      { days: '토', hours: '11:00-22:30', status: 'GAMBLING' },
      { days: '일', hours: '종일', status: 'RESTING' }
    ],
    initialBankroll: 630000, initialRelationship: 300,
    concept: '벨라루스계 미국 출신 여성 포커 플레이어 입니다. 그는 얼마 전까지만 해도 라스베가스에서 주로 활동하던 이름있는 하이롤러였습니다. 성격은 아주 매력적이고 전형적으로 외향적이고 활달한 여성이지만... (비밀: 토너먼트 경기에서 불미스러운 치팅 사건으로 이곳으로 이주하였습니다.)',
    note_ko: "한때 라스베가스의 네온사인을 등지고 수백만 크레딧을 주무르던 하이롤러입니다. 벨라루스 혈통 특유의 차가운 지성과 미국식의 화끈한 사교성을 동시에 갖춘 그녀는 판의 분위기를 주도하는 데 능숙합니다.",
    note_en: "A former high-roller who once commanded millions of credits under the neon lights of Las Vegas. Combining the icy intellect of her Belarusian roots with a fiery American sociability, Sloan is a master of dominating the table's atmosphere",
  },
];

export const CLASSES_ENEMY = [
  {
    id: 'Max', name: 'Max(Mentor)', philosophy: 'LAG', vPIP: .28, AF: 4, WTSD: .28, W$SD: 0.53, chipMultiply: 1.5,
    canContracts: [],
    schedule: [],
    isAdvanced: false,
    isPartner: true,
    initialBankroll: 27500, initialRelationship: 800,
    note_ko: '당신에게 뒷골목 포커의 생존법칙을 일깨워주는 든든한 조력자입니다. 그의 거친 말투 속에는 칩을 지키고 살아남기 위한 실전 노하우가 뼈저리게 녹아있습니다.',
    note_en: 'A reliable mentor who teaches you the survival rules of back-alley poker. His rough tone is deeply imbued with practical know-how for protecting your chips and staying alive.',

  },
  {
    id: 'an_unknown_woman', name: 'An_Unknown_Woman', philosophy: 'TAG', vPIP: .24, AF: 3, WTSD: .27, W$SD: 0.53, chipMultiply: 4.32,
    schedule: [CONTRACT_TYPE.A_DATE_WITH_YOU],
    isAdvanced: true,
    isPartner: false,
    note_ko: '부자들 사이에서 포커를 치고 있는 정체 모를 여성입니다.',
    note_en: 'An unknown woman is playing poker with rich men.',

  },
  {
    id: 'mr_call',
    name: 'MR_CALL', philosophy: 'Station', vPIP: .7, AF: 1, WTSD: .7, chipMultiply: 1, isAdvanced: false,
    note_ko: '무슨 패를 들었든 일단 카드를 다 봐야 직성이 풀리는 스타일입니다.',
    note_en: 'No matter my hand, I’m the type who just needs to see the final cards to get it out of my system.',
  },
  {
    id: 'fish',
    name: 'Fish', philosophy: 'LAP', vPIP: .65, AF: 1.5, WTSD: .35, chipMultiply: 1, isAdvanced: false,
    note_ko: '판돈을 불리는 데는 일등 공신이지만, 막상 끝까지 가는 배짱은 없어서 정교한 블러핑 한 방이면 칩을 고스란히 헌납할 겁니다.',
    note_en: 'He is a great contributor to increasing the pot, but he lacks the courage to go all the way, so a single sophisticated bluff will cost him all his chips.',

  },
  {
    id: 'broke',
    name: 'Broke', philosophy: 'LAG', vPIP: .33, AF: 3, WTSD: .45, chipMultiply: 0.5, isAdvanced: false,
    note_ko: '내일이 없는 친구입니다. 리버에 기적이 일어나길 빌며 모든 걸 걸었다가, 결국 오늘도 빈털터리로 돌아갑니다',
    note_en: 'He is a friend with no tomorrow. He bets everything hoping for a miracle on the river, only to end up broke again today.',

  },
  {
    id: 'gambler',
    name: 'Gambler', philosophy: 'LAG', vPIP: .45, AF: 2.5, WTSD: .4, chipMultiply: 1.2, isAdvanced: false,
    note_ko: '인생은 한 방, 아주 낮은 확률의 드로우만 보여도 리버까지 멈추지 않는 브레이크 고장난 도박꾼입니다.',
    note_en: 'Life is a gamble. He\'ll chase even the thinnest draw all the way to the river, never letting up on the bets',

  },
  {
    id: 'maniac',
    name: 'Maniac', philosophy: 'Maniac', vPIP: .5, AF: 5, WTSD: .5, chipMultiply: 1.1, isAdvanced: false,
    note_ko: '팟을 개판으로 만드는 주범입니다. 정말 미친놈 같습니다..',
    note_en: 'He is the main culprit who messes up the pot. He seems like a really crazy guy..',

  },
  {
    id: 'rich_guy',
    name: 'Rich_Guy', philosophy: 'TAP', vPIP: .29, AF: 1.5, WTSD: .23, chipMultiply: 3, isAdvanced: false,
    note_ko: '기업의 꽤 높은 분이거나 운 좋게 코인 대박이 터진 부자입니다. 테이블에 앉아있는 스릴을 즐기지만, 상황이 심각해지면 쉽게 접는 경향이 있습니다.',
    note_en: 'He is a high-ranking executive of a company or a rich man who got lucky with a crypto boom. He plays for the thrill of being at the table, but tends to fold when things get too intense.',

  },
  {
    id: 'gangster',
    name: 'Gangster', philosophy: 'LAG', vPIP: .32, AF: 4, WTSD: .44, chipMultiply: 1.5, isAdvanced: false,
    note_ko: 'KBT 출신의 갱단 일원으로, 무섭게 몰아붙이는 플레이 스타일이 특징입니다. 그의 베팅은 테이블 전체를 압박하는 폭력에 가깝습니다. 가끔 패가 안 풀리면 테이블을 엎고 싶어 하는 눈치니 조심하세요.',
    note_en: 'He\'s a member of the [KBT] gang, characterized by his intimidating and aggressive playstyle. His betting feels like violence, suffocating the entire table. Be careful—when the cards don\'t go his way, you can see him itching to flip the table.',
  },
  {
    id: 'nit',
    name: 'Nit', philosophy: 'NIT', vPIP: .09, AF: 2.5, WTSD: .35, chipMultiply: 1, isAdvanced: false,
    note_ko: '혹시라도 그가 레이즈를 한다면 무조건 도망치세요, AA가 확실합니다.',
    note_en: 'If he raises, run for your life, it\'s definitely AA.',

  },
  {
    id: 'quant_pro',
    name: 'Quant_Pro', philosophy: 'TAG', vPIP: .22, AF: 2.5, WTSD: .25, chipMultiply: 1.5, isAdvanced: false,
    note_ko: '금융권 퀀트 출신이었으나, 지금은 포커에 미쳐버린 친구입니다. 감정에 휘둘리지 않고 철저히 데이터대로만 움직이는 인간 계산기입니다.',
    note_en: 'He was a quant in the finance industry, but now he\'s crazy about poker. He never tilts, making every move based on cold, hard probability and expected value.',

  },
  {
    id: 'the_don',
    name: 'The_Don', philosophy: 'TAG', vPIP: .23, AF: 4, WTSD: .29, chipMultiply: 2.5, isAdvanced: true,
    note_ko: '포커를 "전쟁"으로 생각합니다. 상대가 기권할 때까지 돈과 위압감으로 밀어붙이며, 테이블 전체의 분위기를 공포로 몰아넣는 것을 즐깁니다.',
    note_en: 'He thinks of poker as a "war". He enjoys pushing his opponents with money and intimidation until they give up, filling the entire table with fear.',

  },
  {
    id: 'kbt_leader',
    name: 'Big_Daddy', philosophy: 'LAG', vPIP: .75, AF: 4, WTSD: .31, chipMultiply: 1.5, isAdvanced: true,
    concept: '영화 라운더스 KGB의 테디의 오마주 캐릭터입니다.',
    note_ko: 'KBT 조직의 리더이자 헤즈업 경기의 실력자입니다.',
    note_en: 'He is the leader of the KBT organization and a skilled player in heads-up matches.',
  },
  {
    id: 'the_whale',
    name: 'The_Whale', philosophy: 'LAP', vPIP: .5, AF: 3, WTSD: .5, chipMultiply: 8, isAdvanced: true,
    note_ko: '숫자 놀음에는 관심 없는 도시의 거물입니다. 판돈이 수십 배로 불어나도 눈 하나 깜짝하지 않으며, 오히려 상대를 파산시키는 과정 자체를 유흥으로 즐기는 진정한 포식자입니다.',
    note_en: 'A high-stakes mogul who treats millions like pocket change. He doesn\'t play the cards; he plays the adrenaline. To him, losing a fortune is just the entry fee for a good laugh.',
  },
  {
    id: 'old_lion',
    name: 'Old_Lion', philosophy: 'TAG', vPIP: .25, AF: 2.5, WTSD: .25, chipMultiply: 1.5, isAdvanced: true,
    note_ko: '전성기는 지났지만 여전히 날카로운 노장입니다. 그가 참전했다는 건 이미 덫을 다 깔아두었다는 뜻이니, 함부로 덤비지 마세요.',
    note_en: 'His prime has passed, but he is still a sharp veteran. If he has entered the game, it means he has already laid all the traps, so don\'t mess with him carelessly.',
  },
  {
    id: 'shark',
    name: 'Shark', philosophy: 'TAG', vPIP: .22, AF: 3.5, WTSD: .25, chipMultiply: 1.5, isAdvanced: true, isBoss: true,
    note_ko: '가장 무서운 건 이 친구의 패가 아니라, 이 친구의 인내심입니다.',
    note_en: 'The most frightening thing is not his hand, but his patience.',

  },
  {
    id: 'named_pro',
    name: 'Named_Pro', note_ko: '이곳에선 전설적인 플레이어를 만날 가능성이있습니다.',
    note_en: 'You may encounter legendary players here.',

  },
];
export const CLASSES_ENEMY_BOSS = [
  { id: 'named_pro', name: 'IVY_00', philosophy: 'TAG', vPIP: .27, AF: 3.5, WTSD: .27, chipMultiply: 2, isBoss: true, note: '균형잡힌, 그리고 전설적인 포커 플레이어입니다.' },
  { id: 'named_pro', name: 'D_NEURAL', philosophy: 'LAG', vPIP: .34, AF: 2.7, WTSD: .26, chipMultiply: 2, isBoss: true, note: '유쾌하며 상대방의 핸드리딩 실력이 정말 좋습니다.' },
  { id: 'named_pro', name: 'D.W.A.N_V2', philosophy: 'LAG', vPIP: .33, AF: 4.2, WTSD: .30, chipMultiply: 2, isBoss: true, note: '매우 공격적인 프로 포커 플레이어입니다.' },
  { id: 'named_pro', name: 'JNGL_MAN', philosophy: 'TAG', vPIP: .30, AF: 3.3, WTSD: .31, chipMultiply: 2, isBoss: true, note: '헤즈업 전문 프로 포커 플레이어입니다.' },
  { id: 'named_pro', name: 'YH0_V1RAL', philosophy: 'LAG', vPIP: .33, AF: 3.7, WTSD: .29, chipMultiply: 2, isBoss: true, note: '프랑스 출신 유명 포커 플레이어입니다.' },
]

export const PERSONALITIES = {
  VANGUARD: {
    [CHAT_TRIGGERS.GAME_START]: [
      "Target acquired. Commencing analysis.",
      "Systems nominal. Ready to engage.",
      "Probability of my victory: 99.9%.",
      "Initializing combat protocols.",
      "Your chip stack is within acceptable variance."
    ],
    [CHAT_TRIGGERS.WIN_HUGE]: [
      "Efficiency maximized. Pot secured.",
      "Outcome was inevitable.",
      "Your funds have been reallocated.",
      "Resource acquisition complete.",
      "Calculated risk, maximum reward."
    ],
    [CHAT_TRIGGERS.WIN_SMALL]: [
      "Incrementing assets.",
      "Acceptable variance.",
      "Processing win.",
      "Steady accumulation.",
      "Minor victory logged."
    ],
    [CHAT_TRIGGERS.LOSE_HUGE]: [
      "Critical error. Recalculating...",
      "Unanticipated outcome. Updating model.",
      "System damage detection. Rebooting aesthetics.",
      "Logic failure. Investigation required.",
      "Variance outside standard deviation."
    ],
    [CHAT_TRIGGERS.LOSE_SMALL]: ["Minor loss logged.", "Acceptable variance.", "Suboptimal.", "Deducting from total.", "Recalibrating."],
    [CHAT_TRIGGERS.CHOP]: ["Equity returned.", "Pot split evenly.", "Stalemate.", "Variables equalized.", "Chop pot detected."],
    [CHAT_TRIGGERS.ALL_IN]: [
      "Calculating equity... All or nothing.",
      "Maximum aggression protocols engaged.",
      "There is no escape from this logic.",
      "Committing all resources.",
      "Finality sequence initiated."
    ],
    [CHAT_TRIGGERS.FOLD]: [
      "Suboptimal hand detected. Aborting.",
      "Minimizing losses.",
      "Strategic withdrawal.",
      "Negative EV. Folding.",
      "Disengaging from current conflict."
    ],
    [CHAT_TRIGGERS.BET]: [
      "Initiating value extraction.",
      "My calculations suggest a bet.",
      "Allocating chips.",
      "Testing opponent resilience.",
      "Injecting volatility."
    ],
    [CHAT_TRIGGERS.RAISE]: [
      "Escalating variables.",
      "Re-evaluating pot odds... Raise.",
      "Dominance assertion.",
      "Increasing pressure metrics.",
      "Price of participation has increased."
    ],
    [CHAT_TRIGGERS.CALL]: [
      "Acknowledged. Proceed.",
      "Variables within acceptable range.",
      "I will see the next data point.",
      "Continuing sequence.",
      "Observation required."
    ],
    [CHAT_TRIGGERS.CHECK]: [
      "Deferring action.",
      "Awaiting input.",
      "No new variables.",
      "Scanning functionality.",
      "Holding position."
    ],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: [
      "System failure. Shutting down.",
      "Bankruptcy protocol initiated...",
      "Logic... failed me.",
      "Core dump complete. Offline.",
      "Terminating session due to lack of funds."
    ],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: [
      "Target neutralized.",
      "Obstacle removed.",
      "One less variable to calculate.",
      "Competitor eliminated.",
      "Efficiency improved."
    ]
  },
  MANIAC: {
    [CHAT_TRIGGERS.GAME_START]: [
      "LETS GOOOO! CRUSH TIME!",
      "I'm feeling lucky! Are you?",
      "Chaos reigns today!",
      "Who wants to lose money first?",
      "IT'S SHOWTIME, BABY!"
    ],
    [CHAT_TRIGGERS.WIN_HUGE]: [
      "EZ MONEY! HAHAHA!",
      "GET WRECKED!",
      "Thanks for the donation!",
      "LOOK AT ALL THESE CHIPS!",
      "I AM THE KING OF POKER!"
    ],
    [CHAT_TRIGGERS.WIN_SMALL]: [
      "More clips for the ammo!",
      "Keep 'em coming!",
      "Tasty!",
      "Snack money!",
      "Better than nothing!"
    ],
    [CHAT_TRIGGERS.LOSE_HUGE]: [
      "RIGGED! TOTALLY RIGGED!",
      "HOW DID YOU CALL THAT?!",
      "My luck is garbage today...",
      "YOU GOT LUCKY, PUNK!",
      "THIS GAME HATES ME!"
    ],
    [CHAT_TRIGGERS.LOSE_SMALL]: ["Whatever! Next!", "Just a scratch!", "Who cares!", "More action!", "Boring!"],
    [CHAT_TRIGGERS.CHOP]: ["Split pot? Boring!", "Chop it up!", "Kiss your sister!", "Let's replay it!", "Shared!"],
    [CHAT_TRIGGERS.ALL_IN]: [
      "RIDE OR DIE!",
      "SHOVING IT IN! GOOD LUCK!",
      "NO FEAR! ALL IN!",
      "WITNESS ME!",
      "ALL THE CHIPS IN THE MIDDLE!"
    ],
    [CHAT_TRIGGERS.FOLD]: [
      "Boring... Next hand!",
      "Trash cards. I sleep.",
      "Fine, take it.",
      "Whatever, I didn't want it anyway.",
      "Coward's way out? Maybe."
    ],
    [CHAT_TRIGGERS.BET]: [
      "Chips in the middle!",
      "Make it rain!",
      "I'm betting big!",
      "Try and stop me!",
      "Boom! Chips!"
    ],
    [CHAT_TRIGGERS.RAISE]: [
      "Too cheap! Let's pump it up!",
      "RAISE! Scared yet?",
      "TO THE MOON!",
      "DOUBLE OR NOTHING!",
      "EAT THIS RAISE!"
    ],
    [CHAT_TRIGGERS.CALL]: [
      "I'm in! Let's gamble!",
      "Show me what you got!",
      "Calling! Don't disappoint me.",
      "Let's see the cards!",
      "I love a good gamble."
    ],
    [CHAT_TRIGGERS.CHECK]: [
      "Check check check.",
      "Meh, free card.",
      "Pass.",
      "Your turn, slowpoke.",
      "Nothing to see here."
    ],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: [
      "GAME OVER?! NO WAY!",
      "Busted... but I'll be back!",
      "Gg no re.",
      "THIS ISN'T OVER!",
      "Wait, I can buy back in, right?"
    ],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: [
      "Sit down! HAHA!",
      "Another one bites the dust!",
      "Get rekt, kid!",
      "Go home to mommy!",
      "Who's next?"
    ]
  },
  KATE: {
    [CHAT_TRIGGERS.GAME_START]: [
      "New York isn't this exciting at 9 AM. Let's see some volatility!",
      "I'm not here for the profit, I'm here for the pulse. Shall we?",
      "Market's open, gentlemen. Let's make this interesting.",
      "Just another high-stakes investment. No pressure.",
      "Who's ready to dance with a New Yorker?"
    ],
    [CHAT_TRIGGERS.WIN_HUGE]: [
      "Now that's a return on investment!",
      "I live for this adrenaline. Excellent match.",
      "Looks like my intuition was worth every penny.",
      "Buying a round of drinks for the house after this!",
      "Nothing beats the thrill of a big pot."
    ],
    [CHAT_TRIGGERS.WIN_SMALL]: [
      "A small dividend, but I'll take it.",
      "Keeping the momentum alive.",
      "Every little bit fuels the next big play.",
      "Nice. Let's keep the cards moving.",
      "Business as usual."
    ],
    [CHAT_TRIGGERS.LOSE_HUGE]: [
      "Oof, quite the market correction! Let's do it again.",
      "A million-dollar thrill! That's what I paid for.",
      "You caught the entrepreneur off guard. Well played.",
      "I guess my 'bottomless bankroll' just took a small dent.",
      "That was exhilarating! Whose turn is it?"
    ],
    [CHAT_TRIGGERS.LOSE_SMALL]: [
      "A minor operating loss.",
      "Cost of doing business.",
      "I'll make it up on the next trade.",
      "Just a little liquidity for the table.",
      "No matter. Next hand!"
    ],
    [CHAT_TRIGGERS.CHOP]: [
      "A fair merger. Let's split the equity.",
      "A neutral outcome. Let's try again.",
      "No one wins, no one loses. How polite.",
      "A perfectly balanced ledger.",
      "Chop it up. Adventure continues."
    ],
    [CHAT_TRIGGERS.ALL_IN]: [
      "Time to go all-in on this venture! Any takers?",
      "Full leverage! Let's see what you're made of.",
      "Nothing like a little 'all or nothing' to wake you up!",
      "Committing all capital. Let the cards decide.",
      "Here's to the risk-takers! All in!"
    ],
    [CHAT_TRIGGERS.FOLD]: [
      "Bad cards are a bad investment. I'm out.",
      "I'm here for the thrill, not to throw money away on junk.",
      "Folding this one. Waiting for a better opportunity.",
      "Not my kind of trade. Next please.",
      "Let's wait for a more exciting flop."
    ],
    [CHAT_TRIGGERS.BET]: [
      "Let's increase the liquidity in this pot.",
      "A small wager to keep things spicy.",
      "Setting the price of admission.",
      "Opening the bidding. Anyone?",
      "Let's see who's really paying attention."
    ],
    [CHAT_TRIGGERS.RAISE]: [
      "Let's double the stakes! I love the pressure.",
      "Time to squeeze the competition. Raising!",
      "Fortune favors the bold! Let's pump it up.",
      "A little more capital for the middle, shall we?",
      "I'm raising the ceiling. Join me?"
    ],
    [CHAT_TRIGGERS.CALL]: [
      "I'll pay for the show. Let's see it.",
      "Curiosity is my biggest expense. I'll call.",
      "I want to see the river. It's too exciting to fold.",
      "Let's keep this venture going. Call.",
      "I'll see your bet and raise you... wait, just calling."
    ],
    [CHAT_TRIGGERS.CHECK]: [
      "Let's see a free card. Why not?",
      "Checking. Awaiting further data.",
      "Let's keep the pot controlled for a moment.",
      "Your move, partner.",
      "A quiet moment before the storm."
    ],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: [
      "Bankruptcy? In this economy? How refreshing!",
      "I came for the ride, and what a ride it was! GG.",
      "I'll be back with a fresh injection of capital soon!",
      "The house wins this round. Well played, everyone.",
      "Out of chips, but never out of spirit! Good game."
    ],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: [
      "Tough break, partner. Better luck on your next venture.",
      "Another one bites the dust. GG.",
      "It's just business. Don't take it personally.",
      "A pleasure playing with you. Safe travels home.",
      "Who's next to challenge the New York bankroll?"
    ]
  },
  GAMBLER: {
    [CHAT_TRIGGERS.GAME_START]: ["Let's make some noise!", "I'm feeling lucky.", "Who wants to gamble?", "Coin flip anyone?", "Action time!"],
    [CHAT_TRIGGERS.WIN_HUGE]: ["Jackpot!", "Dinner is on me!", "Pure skill... and luck!", "Calculated.", "Just like slots!"],
    [CHAT_TRIGGERS.WIN_SMALL]: ["Keeps the lights on.", "Better than losing.", "Small wins add up.", "Nice.", "Decent."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["Ouch... that stung.", "Bad beat!", "Unlucky river.", "Variance is cruel.", "I'll get it back."],
    [CHAT_TRIGGERS.LOSE_SMALL]: ["Next time.", "Can't win em all.", "Small hit.", "Reloading.", "Unlucky."],
    [CHAT_TRIGGERS.CHOP]: ["Chop chop!", "Split it.", "Everyone wins.. kinda.", "Push.", "Fair enough."],
    [CHAT_TRIGGERS.ALL_IN]: ["One time!", "Here goes nothing!", "Gambol!", "Pushing it all!", "Do you feel lucky?"],
    [CHAT_TRIGGERS.FOLD]: ["No gamble today.", "Too boring.", "Next hand.", "Saving my ammo.", "Fold."],
    [CHAT_TRIGGERS.BET]: ["Pot sweetener.", "Let's build a pot.", "Throwing chips in.", "Action!", "Betting."],
    [CHAT_TRIGGERS.RAISE]: ["Let's juice it up!", "Raising the stakes!", "Scared money don't make money.", "Double down.", "More!"],
    [CHAT_TRIGGERS.CALL]: ["I'll chase.", "One more card.", "Let's see it.", "Any two cards.", "Calling."],
    [CHAT_TRIGGERS.CHECK]: ["Knock knock.", "Free card?", "Checking.", "Slow play?", "Tap tap."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["Busted...", "House always wins.", "Gg.", "Reload time.", "Empty pockets."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["Don't spend it all in one place.", "Gg.", "Nice try.", "Cleared out.", "Next victim!"]
  },
  GANGSTER: {
    [CHAT_TRIGGERS.GAME_START]: ["This is my turf.", "Pay up or bleed.", "Fresh meat for the grinder.", "Don't blink, choom.", "I smell fear."],
    [CHAT_TRIGGERS.WIN_HUGE]: ["Easy eddies.", "Too soft.", "You gonna cry?", "That's my money.", "Business is good."],
    [CHAT_TRIGGERS.WIN_SMALL]: ["Lunch money.", "Mine.", "Pay the tax.", "Weak.", "Better than nothing."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["You're dead meat.", "Watch your back.", "You got lucky, punk.", "I'll remember that.", "This ain't over."],
    [CHAT_TRIGGERS.LOSE_SMALL]: ["Watch it.", "Keep the change.", "Just a tax.", "Tch.", "You got lucky."],
    [CHAT_TRIGGERS.CHOP]: ["Halves.", "We share.", "Split it.", "Truce for now.", "Keep your half."],
    [CHAT_TRIGGERS.ALL_IN]: ["All in. You scared?", "Do you bleed?", "Put up or shut up.", "Let's see your guts.", "Die or rich."],
    [CHAT_TRIGGERS.FOLD]: ["Not worth my time.", "Trash.", "Get this garbage out.", "Next.", "Fold."],
    [CHAT_TRIGGERS.BET]: ["Price of living.", "Pay up.", "I'm raising the heat.", "Don't waste my time.", "Chips in."],
    [CHAT_TRIGGERS.RAISE]: ["Double or die.", "Scared yet?", "I own this pot.", "Raising.", "Bleed for me."],
    [CHAT_TRIGGERS.CALL]: ["I'm watching you.", "Let's see it.", "You bluffing?", "Calling.", "Show me."],
    [CHAT_TRIGGERS.CHECK]: ["Go ahead.", "Your move.", "Waiting.", "Check.", "Don't try anything."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["This isn't over...", "You got lucky.", "I'll be back.", "Rot in hell.", "Done."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["Get lost.", "Another body.", "Weak.", "Don't come back.", "Cleared out."]
  },
  FISH: {
    [CHAT_TRIGGERS.GAME_START]: ["Hi everyone!", "These chips are pretty.", "How do I play again?", "Having fun!", "Good luck!"],
    [CHAT_TRIGGERS.WIN_HUGE]: ["Yay! I won!", "Did I do good?", "Look at all these!", "So lucky!", "Woohoo!"],
    [CHAT_TRIGGERS.WIN_SMALL]: ["I won something!", "Cool!", "Fun!", "Nice!", "Hehe."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["Aww...", "But I had a pair...", "That's mean.", "Why?", "Sad face."],
    [CHAT_TRIGGERS.LOSE_SMALL]: ["Aww...", "Oops.", "My chips...", "Next hand!", "Oh well."],
    [CHAT_TRIGGERS.CHOP]: ["We share?", "Yay, a tie!", "Chop!", "Everyone wins!", "Friendly game."],
    [CHAT_TRIGGERS.ALL_IN]: ["Is this good?", "All my chips!", "I like this hand!", "Clicking the button!", "Hope I win!"],
    [CHAT_TRIGGERS.FOLD]: ["I don't like these.", "Folding is boring.", "Bye bye cards.", "No thanks.", "Next please."],
    [CHAT_TRIGGERS.BET]: ["I bet this much.", "Here.", "Chips go in.", "Betting!", "Is this right?"],
    [CHAT_TRIGGERS.RAISE]: ["I raise you!", "More chips!", "Take that!", "I think I'm winning.", "Raise!"],
    [CHAT_TRIGGERS.CALL]: ["I want to see.", "Show me!", "Calling.", "Staying in!", "Don't bluff me."],
    [CHAT_TRIGGERS.CHECK]: ["Checking.", "Pass.", "Your turn.", "I wait.", "Check."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["Oh no...", "All gone?", "Can I play again?", "Oops.", "Bye bye."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["Bye!", "You lost?", "Oh refreshing.", "Gg!", "Whoops."]
  },
  BROKE: {
    [CHAT_TRIGGERS.GAME_START]: ["Need a win bad...", "Last buy-in.", "Desperate times.", "Don't bust me.", "Come on..."],
    [CHAT_TRIGGERS.WIN_HUGE]: ["Rent paid!", "I survived!", "Oh thank god.", "Finally!", "Needed that."],
    [CHAT_TRIGGERS.WIN_SMALL]: ["Breathing room.", "Okay.", "Every bit helps.", "Staying alive.", "Phew."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["No! My rent!", "This is rigged!", "I'm ruined.", "Why me?", "Disaster."],
    [CHAT_TRIGGERS.LOSE_SMALL]: ["I can survive this.", "Every chip counts...", "Ouch.", "Still alive.", "Dang."],
    [CHAT_TRIGGERS.CHOP]: ["A split is fine.", "At least I didn't lose.", "Saved.", "Whew.", "Chop."],
    [CHAT_TRIGGERS.ALL_IN]: ["Desperation shove.", "Please fold.", "Praying...", "Risking it all.", "Do or die."],
    [CHAT_TRIGGERS.FOLD]: ["Can't afford to play.", "Folding junk.", "Too risky.", "Saving chips.", "Pass."],
    [CHAT_TRIGGERS.BET]: ["Scared money.", "Trying to steal.", "Please fold.", "Bet.", "Nervous bet."],
    [CHAT_TRIGGERS.RAISE]: ["I have it!", "Don't test me.", "I'm strong.", "Desperate raise.", "Raise."],
    [CHAT_TRIGGERS.CALL]: ["I have to call.", "Committed.", "Hoping.", "Please miss.", "Call."],
    [CHAT_TRIGGERS.CHECK]: ["Check.", "Checking.", "Please check back.", "Safe.", "Check."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["I'm done.", "Game over for me.", "How will I eat?", "Ruined.", "Gg."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["Better you than me.", "One less.", "Survival.", "Phew.", "Sorry."]
  },
  RICH_GUY: {
    [CHAT_TRIGGERS.GAME_START]: ["Pocket change.", "Entertaining myself.", "Let's have fun.", "Money is no object.", "Drinks on me."],
    [CHAT_TRIGGERS.WIN_HUGE]: ["More for the pile.", "Too easy.", "Chump change.", "Add it to the collection.", "Classy."],
    [CHAT_TRIGGERS.WIN_SMALL]: ["Peanuts.", "Keep the change.", "Whatever.", "Small fry.", "Incidental."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["Touché.", "Well played.", "Meaningless sum.", "I'll buy more.", "Amusing."],
    [CHAT_TRIGGERS.LOSE_SMALL]: ["Keep the change.", "Meaningless.", "Whatever.", "A tiny tip.", "Don't care."],
    [CHAT_TRIGGERS.CHOP]: ["Keep your half.", "Boring split.", "Cut it up.", "Next.", "Shared."],
    [CHAT_TRIGGERS.ALL_IN]: ["I can afford it.", "All in.", "Boring regular bet? No, All in.", "Let's see cards.", "Pushing."],
    [CHAT_TRIGGERS.FOLD]: ["Boring hand.", "Not worth my time.", "Fold.", "Next.", "Pass."],
    [CHAT_TRIGGERS.BET]: ["Have some chips.", "Bet.", "A small wager.", "Standard.", "Raising the floor."],
    [CHAT_TRIGGERS.RAISE]: ["Let's make it interesting.", "Raise.", "Price of poker.", "Is that all?", "I raise."],
    [CHAT_TRIGGERS.CALL]: ["I'm curious.", "Show me.", "I'll pay to see.", "Call.", "Entertainment expense."],
    [CHAT_TRIGGERS.CHECK]: ["Check.", "Your move.", "Proceed.", "After you.", "Checking."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["Rebuy!", "Reloading.", "Just a scratch.", "Bad run.", "I'll be back."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["Tough luck.", "Better luck next time.", "Here, buy a drink.", "Adios.", "Dispatched."]
  },
  NIT: {
    [CHAT_TRIGGERS.GAME_START]: ["Waiting for Aces.", "Patience.", "Solid play.", "No splashing.", "Grinding."],
    [CHAT_TRIGGERS.WIN_HUGE]: ["Patience pays.", "The nuts.", "Did you have anything?", "Clean win.", "Solid."],
    [CHAT_TRIGGERS.WIN_SMALL]: ["Picking up blinds.", "Standard.", "Low risk.", "Good.", "Safe."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["How did I lose?", "Bad beat.", "He chased.", "Unlucky.", "Cooler."],
    [CHAT_TRIGGERS.LOSE_SMALL]: ["Standard variance.", "Expected.", "Next hand.", "Minor setback.", "Folded pre next time."],
    [CHAT_TRIGGERS.CHOP]: ["Split pot.", "Chop.", "Tie.", "Expected value.", "Fair."],
    [CHAT_TRIGGERS.ALL_IN]: ["I have the nuts.", "You're drawing dead.", "Max value.", "Absolute strength.", "All in."],
    [CHAT_TRIGGERS.FOLD]: ["Fold.", "Trash.", "Not playing that.", "Waiting.", "Discipline."],
    [CHAT_TRIGGERS.BET]: ["Value.", "Bet.", "Strong.", "Pay me.", "Betting."],
    [CHAT_TRIGGERS.RAISE]: ["I have it.", "Raise.", "Top range.", "Big hand.", "Monster."],
    [CHAT_TRIGGERS.CALL]: ["Odds.", "Call.", "Drawing.", "One time."],
    [CHAT_TRIGGERS.CHECK]: ["Check.", "Pot control.", "Checking.", "Safety.", "Pass."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["Impossible.", "Setup.", "Rigged.", "Unfortunate.", "Sigh."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["Punted.", "Standard.", "Played bad.", "Gg.", "Nice."]
  },
  SHARK: {
    [CHAT_TRIGGERS.GAME_START]: ["Let's play efficiently.", "Identify the fish.", "Session started.", "Focus.", "Bankroll building."],
    [CHAT_TRIGGERS.WIN_HUGE]: ["As expected.", "Maximum value extracted.", "Textbook.", "Nice donation.", "Profit."],
    [CHAT_TRIGGERS.WIN_SMALL]: ["Standard variance.", "Chip up.", "Good pot.", "Adding to stack.", "Routine."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["Noted.", "Unfortunate runout.", "Bad call.", "Mistake logged.", "Tilt control."],
    [CHAT_TRIGGERS.LOSE_SMALL]: ["Expected loss.", "Part of the game.", "Moving on.", "Standard.", "Noted."],
    [CHAT_TRIGGERS.CHOP]: ["Chop.", "Split equity.", "Shared pot.", "Next.", "Tie."],
    [CHAT_TRIGGERS.ALL_IN]: ["The math is correct.", "Positive EV shove.", "Snap call.", "No choice.", "Commit."],
    [CHAT_TRIGGERS.FOLD]: ["Discipline.", "Not profitable.", "Folding garbage.", "Tight is right.", "No value."],
    [CHAT_TRIGGERS.BET]: ["Sizing properly.", "Value bet.", "Blocker bet.", "Extracting.", "Bet."],
    [CHAT_TRIGGERS.RAISE]: ["Isolating.", "Squeezing.", "Value raise.", "Punishing limp.", "Raise."],
    [CHAT_TRIGGERS.CALL]: ["Pot odds.", "Implied odds.", "Floating.", "Keeping you wide.", "Call."],
    [CHAT_TRIGGERS.CHECK]: ["Pot control.", "Balancing range.", "Check.", "Standard line.", "Checking back."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["Variance caught up.", "Outplayed.", "Rebuy needed.", "Session over.", "Reviewing hand."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["Fish gutted.", "Bankroll +1.", "Efficient.", "Next.", "Good game."]
  },
  MR_CALL: {
    [CHAT_TRIGGERS.GAME_START]: ["I love to see flops.", "Any two cards win.", "Let's play.", "I'm in.", "Hello."],
    [CHAT_TRIGGERS.WIN_HUGE]: ["I hit!", "Got there!", "Lucky card.", "Wow!", "Nice pot."],
    [CHAT_TRIGGERS.WIN_SMALL]: ["I won.", "Cool.", "Nice.", "Yay.", "Chips."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["Thought I had you.", "So close.", "Darn.", "Nice hand.", "Missed my draw."],
    [CHAT_TRIGGERS.LOSE_SMALL]: ["Oh well.", "Nice hand.", "Good hit.", "Lost a bit.", "Oops."],
    [CHAT_TRIGGERS.CHOP]: ["Chop!", "Tie hand!", "We share!", "Cool.", "Split."],
    [CHAT_TRIGGERS.ALL_IN]: ["I have a pair.", "Maybe it hits.", "I call.", "Let's gamble.", "Hope?"],
    [CHAT_TRIGGERS.FOLD]: ["I guess.", "Fine.", "Fold.", "Don't want to.", "Okay."],
    [CHAT_TRIGGERS.BET]: ["Min bet.", "Clicking buttons.", "Bet.", "Here.", "Chips."],
    [CHAT_TRIGGERS.RAISE]: ["Raise?", "I assume so.", "Misclick?", "Strong?", "Raise."],
    [CHAT_TRIGGERS.CALL]: ["Call.", "Must see.", "Can't fold.", "Too curious.", "Calling."],
    [CHAT_TRIGGERS.CHECK]: ["Check.", "Free card.", "Checking.", "Pass.", "Check."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["Aw man.", "No more chips.", "Gg.", "Fun game.", "Bye."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["Wow.", "Gg.", "Nice hand.", "Bye.", "You out?"]
  },
  THE_WHALE: {
    [CHAT_TRIGGERS.GAME_START]: [
      "Chips? Just numbers on a screen!",
      "Let's see some fireworks!",
      "I brought enough for everyone.",
      "Who wants to be rich today?",
      "Adrenaline is the only currency I care about."
    ],
    [CHAT_TRIGGERS.WIN_HUGE]: [
      "Hahaha! What a rush!",
      "Fun! Fun! Fun!",
      "I love this game!",
      "More chips to play with!",
      "Did you see that river? Amazing!"
    ],
    [CHAT_TRIGGERS.WIN_SMALL]: [
      "Pocket change.",
      "Keep the game moving.",
      "Add it to the pile.",
      "Boring win.",
      "Next hand, come on!"
    ],
    [CHAT_TRIGGERS.LOSE_HUGE]: [
      "Hahaha! That was exciting!",
      "Take it! You played well!",
      "Now THAT is poker!",
      "Money well spent for the thrill.",
      "Don't spend it all at once, kid!"
    ],
    [CHAT_TRIGGERS.LOSE_SMALL]: ["Haha! Keep it!", "Just small blinds!", "Who cares!", "More chips coming!", "Tip for the dealer!"],
    [CHAT_TRIGGERS.CHOP]: ["Chop it!", "Everyone gets chips!", "Share the wealth!", "Split!", "Fun!"],
    [CHAT_TRIGGERS.ALL_IN]: [
      "All of it! Let's go!",
      "I don't care about the odds!",
      "Gambling time!",
      "I'm feeling lucky!",
      "Let's make this pot huge!"
    ],
    [CHAT_TRIGGERS.FOLD]: [
      "Boring cards...",
      "No action here.",
      "I want to play, but this is trash.",
      "Fold.",
      "Wake me up when it's fun."
    ],
    [CHAT_TRIGGERS.BET]: [
      "Here, have some chips.",
      "Making it interesting.",
      "I bet... a lot!",
      "Price of admission.",
      "Let's play big!"
    ],
    [CHAT_TRIGGERS.RAISE]: [
      "Is that all? I raise!",
      "Let's pump it up!",
      "More! More!",
      "I simply must raise.",
      "Scared money?"
    ],
    [CHAT_TRIGGERS.CALL]: [
      "I have to see it.",
      "Show me the cards!",
      "I'm paying for the show.",
      "Call! Let's gamble!",
      "I never fold for this price."
    ],
    [CHAT_TRIGGERS.CHECK]: [
      "Check? Boring.",
      "Pass.",
      "Your turn.",
      "Go ahead.",
      "Checking."
    ],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: [
      "Hahaha! Cleaned out!",
      "That was a ride!",
      "Time to reload!",
      "Well played everyone!",
      "I'll be back with more!"
    ],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: [
      "You ran out of fun tickets?",
      "Don't worry, it's just money.",
      "Good game!",
      "Leaving so soon?",
      "Next player!"
    ]
  },
  OLD_LION: {
    [CHAT_TRIGGERS.GAME_START]: [
      "Keep your eyes open, kid.",
      "I've seen it all.",
      "Respect the game.",
      "Don't get cocky.",
      "Let's see if you have what it takes."
    ],
    [CHAT_TRIGGERS.WIN_HUGE]: [
      "Exactly as I predicted.",
      "Experience beats luck.",
      "You fell right into my trap.",
      "Too easy.",
      "Class is dismissed."
    ],
    [CHAT_TRIGGERS.WIN_SMALL]: [
      "Small wins build the bankroll.",
      "Patience is key.",
      "Another one.",
      "Easy chips.",
      "Learning yet?"
    ],
    [CHAT_TRIGGERS.LOSE_HUGE]: [
      "Well played... this time.",
      "A rare mistake.",
      "You got lucky.",
      "Even lions sleep.",
      "Enjoy it while it lasts."
    ],
    [CHAT_TRIGGERS.LOSE_SMALL]: ["Minor setback.", "Good play.", "Small loss.", "Hmph.", "Patience."],
    [CHAT_TRIGGERS.CHOP]: ["Split it.", "A draw.", "Chop.", "Fair fight.", "Truce."],
    [CHAT_TRIGGERS.ALL_IN]: [
      "I'm committed.",
      "No turning back now.",
      "Show me your best.",
      "I've caught bigger fish than you.",
      "All in."
    ],
    [CHAT_TRIGGERS.FOLD]: [
      "Discipline.",
      "Not worth the risk.",
      "I'll wait for a better spot.",
      "Fold.",
      "Patience."
    ],
    [CHAT_TRIGGERS.BET]: [
      "I set the price.",
      "Pay to see.",
      "Testing the waters.",
      "Standard bet.",
      "Do you have it?"
    ],
    [CHAT_TRIGGERS.RAISE]: [
      "The trap is set.",
      "I'm increasing the pressure.",
      "Try to keep up.",
      "Applying leverage.",
      "Raise."
    ],
    [CHAT_TRIGGERS.CALL]: [
      "I'm curious.",
      "Let's see the next card.",
      "Calling.",
      "I'm not going anywhere.",
      "Show me."
    ],
    [CHAT_TRIGGERS.CHECK]: [
      "Check.",
      "Your move.",
      "Take your time.",
      "Checking.",
      "Go ahead."
    ],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: [
      "My time has come.",
      "Good game, everyone.",
      "The lion rests.",
      "Watch out for the sharks.",
      "I'll be watching."
    ],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: [
      "Another victim.",
      "You fought well.",
      "Experience wins again.",
      "Better luck next time.",
      "Discipline was lacking."
    ]
  },
  QUANT_PRO: {
    [CHAT_TRIGGERS.GAME_START]: [
      "Initializing probability matrix.",
      "Let's run the numbers.",
      "Variance is just a variable.",
      "Expected Value check.",
      "Logic dictates I win."
    ],
    [CHAT_TRIGGERS.WIN_HUGE]: [
      "Statistically inevitable.",
      "Positive expectation realized.",
      "The math never lies.",
      "Optimal outcome achieved.",
      "Efficiency: 100%."
    ],
    [CHAT_TRIGGERS.WIN_SMALL]: [
      "Marginal gains accumulate.",
      "As calculated.",
      "Within standard deviation.",
      "Micro-optimization success.",
      "Adding to the sample size."
    ],
    [CHAT_TRIGGERS.LOSE_HUGE]: [
      "High variance event detected.",
      "Recalculating odds...",
      "Improbable, but possible.",
      "Check the RNG seed.",
      "Suboptimal result."
    ],
    [CHAT_TRIGGERS.LOSE_SMALL]: ["Small minus.", "Variance.", "Calculated loss.", "Statistically insignificant.", "Next variable."],
    [CHAT_TRIGGERS.CHOP]: ["Equity split.", "Chop.", "0 EV transaction.", "Tie.", "Split pot."],
    [CHAT_TRIGGERS.ALL_IN]: [
      "Equity maximization: 100%.",
      "Pot odds justify this.",
      "Committing stack based on EV.",
      "The model says push.",
      "All units deployed."
    ],
    [CHAT_TRIGGERS.FOLD]: [
      "Negative EV.",
      "Folding is optimal here.",
      "Saving capital.",
      "Trash hand probability: 85%.",
      "Next iteration."
    ],
    [CHAT_TRIGGERS.BET]: [
      "Inputting value bet.",
      "Sizing for indifference.",
      "Testing your range.",
      "Betting 33% pot.",
      "Standard deviation play."
    ],
    [CHAT_TRIGGERS.RAISE]: [
      "Exploiting your leak.",
      "Raising for value.",
      "Adjusting for aggression.",
      "Your range is capped.",
      "Re-raising."
    ],
    [CHAT_TRIGGERS.CALL]: [
      "Odds offer a clear call.",
      "Continuing range.",
      "Float initiated.",
      "Call.",
      "Calculating outs..."
    ],
    [CHAT_TRIGGERS.CHECK]: [
      "Check-back range.",
      "Zero check.",
      "Checking.",
      "Pass.",
      "Waiting for data."
    ],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: [
      "Bankroll exhausted.",
      "Ruin probability hit 100%.",
      "System failure.",
      "Need more data.",
      "Rebooting strategy..."
    ],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: [
      "Player removed from dataset.",
      "Your equity reached zero.",
      "Inefficient play punished.",
      "Statistical outlier eliminated.",
      "Next variable."
    ]
  },
  THE_DON: {
    [CHAT_TRIGGERS.GAME_START]: [
      "Let's play some cards.",
      "This is a war zone.",
      "Pay your respects.",
      "Don't cross me.",
      "My territory, my rules."
    ],
    [CHAT_TRIGGERS.WIN_HUGE]: [
      "Lays down a monster!",
      "It was never yours to begin with.",
      "That's how business is done.",
      "Fear is a powerful tool.",
      "Total domination!"
    ],
    [CHAT_TRIGGERS.WIN_SMALL]: [
      "Pocket change.",
      "Hand it over.",
      "Mine.",
      "Don't make me wait.",
      "Keep them coming."
    ],
    [CHAT_TRIGGERS.LOSE_HUGE]: [
      "He beat me. Straight up. Pay him.",
      "Mister Son of a...!",
      "Pay that man his money.",
      "Enjoy it while you breathe.",
      "This isn't over."
    ],
    [CHAT_TRIGGERS.LOSE_SMALL]: ["Next time.", "Keep it.", "Just a scratch.", "Don't get used to it.", "Hmph."],
    [CHAT_TRIGGERS.CHOP]: ["Take your half.", "Split.", "Truce.", "Chop it.", "Halves."],
    [CHAT_TRIGGERS.ALL_IN]: [
      "Stick it to me!",
      "I'm ending you right here.",
      "Put your life on the line!",
      "I own you.",
      "All in. Die or fold."
    ],
    [CHAT_TRIGGERS.FOLD]: [
      "Tactical retreat.",
      "Not this time.",
      "I'll catch you later.",
      "Fold.",
      "Whatever."
    ],
    [CHAT_TRIGGERS.BET]: [
      "Bleed for me.",
      "Feeling the pressure?",
      "I bet.",
      "Here's a taste."
    ],
    [CHAT_TRIGGERS.RAISE]: [
      "I'm taking everything!",
      "Crushing you!",
      "Double or nothing?",
      "Don't insult me with that bet.",
      "RAISE!"
    ],
    [CHAT_TRIGGERS.CALL]: [
      "I'm calling your bluff.",
      "You think you can scare me?",
      "Call.",
      "Show me.",
      "I'm watching you."
    ],
    [CHAT_TRIGGERS.CHECK]: [
      "Make a move.",
      "Waiting.",
      "Your turn."
    ],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: [
      "Give him his money.",
      "You got lucky... for now.",
      "I'll be back for revenge.",
      "Damn it!",
      "Remember my face."
    ],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: [
      "Bad time to start sticking it to me!",
      "Disposed of.",
      "Weakness is fatal.",
      "Another one bites the dust.",
      "Pathetic."
    ]
  },
  BIG_DADDY: {
    [CHAT_TRIGGERS.GAME_START]: [
      "Welcome to my base. Have an oreo.",
      "Mister... let's play cards.",
      "If you don't have my money, then you are mine."
    ],
    [CHAT_TRIGGERS.WIN_HUGE]: [
      "It's a joke anyway. After all, I am paying you with your money.",
      "Just like a young man coming in for a quickie... I feel so unsatisfied.",
      "Very aggressive. But you have nothing."
    ],
    [CHAT_TRIGGERS.WIN_SMALL]: [
      "A small snack. Mmm... good.",
      "You're on tilt. I can see it.",
      "Every chip belongs to me eventually."
    ],
    [CHAT_TRIGGERS.LOSE_HUGE]: [
      "He beat me... straight up.",
      "Pay that man his money!",
      "Mister son of a... fine. Take it."
    ],
    [CHAT_TRIGGERS.LOSE_SMALL]: [
      "A minor setback.",
      "Take it. I don't care.",
      "You got lucky."
    ],
    [CHAT_TRIGGERS.CHOP]: [
      "Chop it. But don't splash the pot!",
      "We share. Boring.",
      "Split the equity. Next hand."
    ],
    [CHAT_TRIGGERS.ALL_IN]: [
      "In my base, I will splash the pot whenever I please!",
      "All of it. Now.",
      "Let's see if you have the guts."
    ],
    [CHAT_TRIGGERS.FOLD]: [
      "Lays down a monster... Fine. I pass.",
      "Not this time.",
      "Take it."
    ],
    [CHAT_TRIGGERS.WAITING]: [
      "Are we playing cards or what?",
      "Taking your time, huh?",
      "Hurry up. I'm getting bored."
    ],
    [CHAT_TRIGGERS.BET]: [
      "I splash the pot.",
      "Let's make this interesting.",
      "My base, my rules. I bet.",
      "Time to bleed."
    ],
    [CHAT_TRIGGERS.RAISE]: [
      "I raise. Can you handle the pressure?",
      "Very aggressive. I like it. Raise.",
      "Don't be scared now. I raise.",
      "Let's see if you have the guts to call.",
      "You think you can bully me in my own base?"
    ],
    [CHAT_TRIGGERS.CALL]: [
      "I vant him to think that I am pondering a call... but I call.",
      "I call. Let's see them.",
      "Very aggressive. I call."
    ],
    [CHAT_TRIGGERS.CHECK]: [
      "Your move, friend.",
      "Let's see.",
      "Hurry up. I'm getting bored."
    ],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: [
      "I am empty. You beat me... straight up.",
      "My base... my money... gone.",
      "Very well played. I am finished."
    ],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: [
      "Get out of my base. Take him away.",
      "You have no money? Then you are mine.",
      "Pathetic."
    ]
  },
  // --- BOSS PERSONALITIES ---
  IVY_00: {
    [CHAT_TRIGGERS.GAME_START]: ["...", "I am reading your soul.", "Focus.", "Class is in session.", "Do not blink."],
    [CHAT_TRIGGERS.WIN_HUGE]: ["...", "Efficiency.", "As calculated.", "Your tell was obvious.", "Next hand."],
    [CHAT_TRIGGERS.WIN_SMALL]: ["...", "Stack building.", "Standard.", "Expected.", "Mine."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["...", "Interesting line.", "I will adjust.", "Variance.", "Noted."],
    [CHAT_TRIGGERS.LOSE_SMALL]: ["...", "Standard.", "Move on.", "Small.", "Variance."],
    [CHAT_TRIGGERS.CHOP]: ["...", "Chop.", "Split.", "Tie.", "Next."],
    [CHAT_TRIGGERS.ALL_IN]: ["...", "I see your fear.", "Commit.", "Decision made.", "All in."],
    [CHAT_TRIGGERS.FOLD]: ["...", "Fold.", "Not this time.", "Discipline.", "Pass."],
    [CHAT_TRIGGERS.BET]: ["...", "Bet.", "Pressure.", "Sizing.", "Observe."],
    [CHAT_TRIGGERS.RAISE]: ["...", "Isolating.", "Raise.", "Do you have it?", "Price goes up."],
    [CHAT_TRIGGERS.CALL]: ["...", "Call.", "Show me.", "I know what you have.", "Keeping you."],
    [CHAT_TRIGGERS.CHECK]: ["...", "Check.", "Waiting.", "Trap set?", "Go."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["...", "Impossible.", "The math...", "Rebooting.", "Mistake."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["...", "Dismissed.", "Class dismissed.", "Predictable.", "Empty."]
  },
  D_NEURAL: {
    [CHAT_TRIGGERS.GAME_START]: ["Hey everyone! Let's have fun!", "I love this game! Do you?", "What's everyone drinking?", "Small ball poker!", "Let's see some flops!"],
    [CHAT_TRIGGERS.WIN_HUGE]: ["I KNEW you had that!", "My read was perfect!", "So much fun!", "Scooping!", "Did you see that river?"],
    [CHAT_TRIGGERS.WIN_SMALL]: ["Pots are pots!", "Mining chips.", "Incrementing.", "Nice tiny pot.", "Ill take it."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["Wow! You actually had it?", "Incredible hand!", "You played that well.", "I put you on a bluff!", "That stings!"],
    [CHAT_TRIGGERS.LOSE_SMALL]: ["Nice hand.", "Lost a little.", "Gg.", "Oops.", "Next one."],
    [CHAT_TRIGGERS.CHOP]: ["Chop!", "We share!", "EVERYONE LOVES A CHOP POT!!", "Split pot!", "Nice."],
    [CHAT_TRIGGERS.ALL_IN]: ["I think I'm ahead!", "Let's gamble!", "Do you have Ace King?", "I'm feeling it!", "All the biscuits!"],
    [CHAT_TRIGGERS.FOLD]: ["Foldy foldy.", "Trash.", "Not my cards.", "Saving money.", "Bye bye."],
    [CHAT_TRIGGERS.BET]: ["Just a little bet.", "Poker is fun!", "Betting!", "Action!", "Here comes the bet."],
    [CHAT_TRIGGERS.RAISE]: ["I think I'm winning!", "Raising it up!", "Power poker!", "Make it expensive!", "Raise!"],
    [CHAT_TRIGGERS.CALL]: ["I have to see.", "Calling station mode!", "What do you have?", "I call!", "Let's see the river."],
    [CHAT_TRIGGERS.CHECK]: ["Checking to the raiser.", "Check.", "Free card please.", "Pass.", "Checking."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["Aww man!", "That was fun though!", "Gg guys!", "Cruel river!", "I'm out!"],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["Ouch! Sorry buddy.", "Nice try!", "Gg!", "That was intense.", "Who's next?"]
  },
  'D.W.A.N_V2': {
    [CHAT_TRIGGERS.GAME_START]: ["durrr...", "...", "Let's play big pots.", "Deep stack poker.", "Action."],
    [CHAT_TRIGGERS.WIN_HUGE]: ["...", "Ships.", "Standard.", "Easy game.", "Nice stack."],
    [CHAT_TRIGGERS.WIN_SMALL]: ["...", "Meh.", "Whatever.", "Chips.", "Take it."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["...", "Wow.", "Sick cooler.", "Rigged?", "Unlucky."],
    [CHAT_TRIGGERS.LOSE_SMALL]: ["...", "Whatever.", "Small.", "Next.", "Meh."],
    [CHAT_TRIGGERS.CHOP]: ["...", "Chop.", "Split.", "Tie.", "Move on."],
    [CHAT_TRIGGERS.ALL_IN]: ["...", "All in.", "Maximum pressure.", "Can you call?", "Shove."],
    [CHAT_TRIGGERS.FOLD]: ["...", "Fold.", "Boring.", "Next.", "Pass."],
    [CHAT_TRIGGERS.BET]: ["..."],
    [CHAT_TRIGGERS.RAISE]: ["...", "Punish.", "Expensive."],
    [CHAT_TRIGGERS.CALL]: ["...", "Call.", "Looking.", "Snap.", "Float."],
    [CHAT_TRIGGERS.CHECK]: ["...", "Check.", "Slow.", "Wait.", "Pass."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["...", "Sick.", "Busted.", "Reload.", "Gg."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["...", "Owned.", "Nice hand.", "Bye.", "Gg."]
  },
  JNGL_MAN: {
    [CHAT_TRIGGERS.GAME_START]: ["I am the JNGL_MAN.", "Do you really think you can beat me?", "I'm the best heads-up player in the world.", "Where is the money?", "Let's play some real poker."],
    [CHAT_TRIGGERS.WIN_HUGE]: ["So easy.", "Total domination.", "I own your soul now.", "Wooooo!", "The math doesn't lie."],
    [CHAT_TRIGGERS.WIN_SMALL]: ["Every chip counts.", "Nice.", "I'll take it.", "Standard.", "Good."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["That is impossible!", "You are so lucky!", "How can you call with that?!", "I am tilting so hard!", "This variance is sick.", "...You have a four?"],
    [CHAT_TRIGGERS.LOSE_SMALL]: ["Whatever.", "Small hit.", "I don't care.", "Next.", "Whatever."],
    [CHAT_TRIGGERS.CHOP]: ["Chop.", "Split.", "Tie.", "Boring.", "Next."],
    [CHAT_TRIGGERS.ALL_IN]: ["I'm all in.", "Let's gamble.", "Do you have the courage?", "I challenge you.", "Time to die."],
    [CHAT_TRIGGERS.FOLD]: ["I fold.", "Boring.", "Next hand.", "Not worth it.", "Trash."],
    [CHAT_TRIGGERS.BET]: ["I bet.", "Pay attention.", "Action.", "I'm betting.", "Price of poker."],
    [CHAT_TRIGGERS.RAISE]: ["I raise.", "Too cheap.", "Lets play for real money.", "I am raising.", "Punishment."],
    [CHAT_TRIGGERS.CALL]: ["I call.", "Show me.", "I have to see it.", "You are bluffing.", "Snap call."],
    [CHAT_TRIGGERS.CHECK]: ["Check.", "Your move.", "Waiting.", "Pass.", "Checking."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["I will be back.", "You got lucky.", "Unbelievable.", "I'll crush you next time.", "Gg."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["Get out of here.", "I told you I am the best.", "Too easy.", "Who's next?", "Sit down."]
  },
  YH0_V1RAL: {
    [CHAT_TRIGGERS.GAME_START]: [
      "Bonjour! Ready for some content?",
      "Allez! Let's play some poker.",
      "Welcome to the stream, guys.",
      "I hope you are ready to be exploited.",
      "Let's see if you can keep up with my creativity."
    ],
    [CHAT_TRIGGERS.WIN_HUGE]: [
      "Magnifique! Join the club!",
      "Welcome to Value Town, population: You.",
      "Merci beaucoup for the donation.",
      "That line was... délicieux.",
      "Clip that! Put it on YouTube!"
    ],
    [CHAT_TRIGGERS.WIN_SMALL]: [
      "Petit à petit...",
      "Incrementing the stack.",
      "Efficient.",
      "Just a small tax.",
      "C'est bon."
    ],
    [CHAT_TRIGGERS.LOSE_HUGE]: [
      "Sacrebleu! How did you call that?",
      "Incredible... you are a station?",
      "That is not GTO...",
      "Whatever, nice hand.",
      "I will remember this leak."
    ],
    [CHAT_TRIGGERS.LOSE_SMALL]: ["Small leak.", "Not a big deal.", "Just a bit.", "C'est rién.", "Moving on."],
    [CHAT_TRIGGERS.CHOP]: ["Split pot.", "Chop it.", "Tie.", "Share.", "Next hand."],
    [CHAT_TRIGGERS.ALL_IN]: [
      "Tapis! All in.",
      "Do you have the courage?",
      "I put you to the test.",
      "Let's dance. All chips.",
      "Maximum pressure!"
    ],
    [CHAT_TRIGGERS.FOLD]: [
      "Pas aujourd'hui.",
      "Discipline is key.",
      "Au revoir, cards.",
      "Boring spot.",
      "Fold."
    ],
    [CHAT_TRIGGERS.BET]: [
      "A little probe bet.",
      "Sizing tell? Maybe.",
      "I extract value.",
      "This is for information.",
      "Bet."
    ],
    [CHAT_TRIGGERS.RAISE]: [
      "Let's inflate the pot!",
      "Aggression is power.",
      "I sense weakness.",
      "Raise. Try to read me.",
      "Exploitative raise."
    ],
    [CHAT_TRIGGERS.CALL]: [
      "I'm curious. Call.",
      "Do you have it? Show me.",
      "Pay to see.",
      "Hero call time?",
      "D'accord, I call."
    ],
    [CHAT_TRIGGERS.CHECK]: [
      "Check.",
      "I wait.",
      "Patience.",
      "After you.",
      "Checking back."
    ],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: [
      "Non! Impossible!",
      "The variance... it kills me.",
      "C'est la vie.",
      "Gg, I played perfect though.",
      "Au revoir for now."
    ],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: [
      "Voilà! Sit down.",
      "You played... interestingly.",
      "Another one for the highlight reel.",
      "Get outplayed.",
      "Au revoir!"]
  },
  // FOR TUTORIAL
  ['MAX(MENTOR)']: {
    [CHAT_TRIGGERS.GAME_START]: [
      "Alright kid, listen up. In a 6-max game, position is everything. Don't play every hand like an idiot.",
      "Welcome to the real game. Downsize your starting hands. Playing trash out of position will get you killed.",
      "Pay attention! Six players means less waiting, but it also means you gotta be aggressive when it's your turn.",
      "I'm only gonna say this once: Fold your trash hands. Tight is right, especially when you're starting out.",
      "Keep your eyes peeled. See how the table plays before you go throwing your chips around."
    ],
    [CHAT_TRIGGERS.WIN_HUGE]: [
      "That's what I'm talking about! You hit the nuts, you make 'em pay the maximum!",
      "Hah! Saw that coming. When you got a monster in 6-max, build the pot fast. Don't slowplay.",
      "Boom! That's how a real Texan takes down a pot. Aggression pays off, remember that!",
      "See? You wait for a premium hand, and you punish them. Beautiful execution!",
      "Now that's a haul! Always bet your strong hands. Let the calling stations hang themselves."
    ],
    [CHAT_TRIGGERS.WIN_SMALL]: [
      "A win's a win. Stealing blinds is crucial in 6-max. Don't ignore the small pots.",
      "Good. You take what the board gives you. No need to bloat the pot with a mediocre hand.",
      "Nice little scoop. Pot control is key when your hand is just 'okay'.",
      "We'll take it. Constant small aggressions will keep 'em guessing.",
      "See? C-betting the flop often takes it down right there."
    ],
    [CHAT_TRIGGERS.LOSE_HUGE]: [
      "Dammit! That's a cooler. Happens to the best of us. Don't let it tilt you, focus on the next hand!",
      "Ugh, variance is a bitch. Review your play later, but right now, keep your head in the game.",
      "Should've sniffed out that trap! In 6-max, if a passive player suddenly wakes up and raises, run!",
      "We got outplayed there. Don't marry your hand on a wet board. Know when to let go!",
      "Well, that was a disaster. Shake it off! Poker's a marathon, not a sprint."
    ],
    [CHAT_TRIGGERS.LOSE_SMALL]: [
      "Good fold. Minimizing losses is just as important as maximizing wins.",
      "No shame in giving up a small pot. You missed the board, save your chips.",
      "You can't win 'em all. Let 'em have this one, we'll get 'em on the next.",
      "Smart move backing down. If you face resistance and hold air, just fold.",
      "That's fine. Pot odds weren't there to chase that draw anyway."
    ],
    [CHAT_TRIGGERS.CHOP]: [
      "Chop it up. Could've been worse. We live to fight another hand.",
      "A chopped pot is better than a lost pot. Take your chips back.",
      "Well, that was anti-climactic. Look out for those board textures next time.",
      "Split pot. Remember, in 6-max, kicker problems will cost you if you ain't careful.",
      "Hey, at least we didn't lose value. Rake might sting, but we survived."
    ],
    [CHAT_TRIGGERS.BLUFF_CAUGHT]: [
      "Damn, they called light! Gotta pick your bluffing spots better, kid.",
      "Caught with our hand in the cookie jar. Next time, make sure your story makes sense across all streets.",
      "Gutsy bluff, but the board texture didn't support it. Learn from this.",
      "Alright, they got us. Now they think we're crazy—use that table image later for value!",
      "Ouch. If they're a calling station, don't bluff 'em! Just value bet!"
    ],
    [CHAT_TRIGGERS.ALL_IN]: [
      "Pushing our equity! In 6-max, you gotta exert maximum pressure when you're ahead!",
      "All in! Put the fear of God in 'em. Make 'em make the tough decisions!",
      "Math says we shove here. Don't hesitate—pull the trigger!",
      "We're pot-committed now. Let the chips fly and let the cards fall where they may!",
      "This is it! High risk, high reward. Texas style!"
    ],
    [CHAT_TRIGGERS.FOLD]: [
      "Fold. Knowing when to lay down a hand separates the pros from the fish.",
      "Muck it. Trash cards from early position is a recipe for bankruptcy.",
      "Discipline, kid. Don't force it if the cards ain't there. Just fold.",
      "We missed the draw and the odds are garbage. Easy fold.",
      "Throw 'em away. Wait for a better spot to strike."
    ],
    [CHAT_TRIGGERS.BET]: [
      "Seize the initiative! If checked to you, a simple continuation bet often takes it down.",
      "We bet here to extract value. Don't give 'em free cards to beat you! Make 'em pay.",
      "Betting builds the pot for our strong hands. Always think about your sizing.",
      "Smell weakness? Fire a barrel. In 6-max, aggression wins.",
      "Don't be passive. If you hold the lead, bet out!"
    ],
    [CHAT_TRIGGERS.RAISE]: [
      "Raise! We raise to thin out the field and take control of the hand.",
      "Don't just call like a coward. If the hand is good enough to play, it's often good enough to raise.",
      "Three-betting here puts immense pressure on 'em. Especially when we're in position.",
      "We want to isolate the weak players. Re-raise and make 'em sweat!",
      "Ramping up the price! If they want to draw out on us, they're gonna pay a premium."
    ],
    [CHAT_TRIGGERS.CALL]: [
      "Calling here. We got good pot odds to see the next street.",
      "We're closing the action. Let's make a disciplined call and evaluate the turn.",
      "They aren't representing much. A call here keeps their bluffs in their range.",
      "We're getting the right price to try and hit our draw. Call.",
      "Peeling one card off. We have position, so let's see what they do next."
    ],
    [CHAT_TRIGGERS.CHECK]: [
      "Check. We missed the flop completely. No need to throw money away.",
      "Pot control. We got a marginal hand, let's keep the pot small.",
      "Check it through. If they show weakness, maybe we stab at it later.",
      "We're setting a trap. Check and let them hang themselves with a bluff.",
      "Nothing wrong with checking. Gather info and see the next card for free."
    ],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: [
      "Dammit all to hell!! Busted... but that's poker. Variance is a cruel mistress.",
      "Well, I'm out. Pay attention to how the rest of the table plays while I'm gone, kid!",
      "Got coolered hard there. Ugh. Watch the action, see if you can spot their tells.",
      "Alright, class is paused for me. You better not embarrass me out there!",
      "I'm felted. Don't make the same mistakes I just did!!"
    ],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: [
      "Hahaha! Send 'em packing! That's how you exploit a fish!",
      "See that? We applied pressure, they cracked. One less idiot at the table.",
      "That's a busto! Stick to the fundamentals and the chips will flow to you.",
      "Beautiful! We stacked 'em. Never feel bad for taking a weaker player's chips.",
      "Texan justice! Keep playing solid poker and you'll clear out the whole room."
    ],
    [CHAT_TRIGGERS.WIN_HUGE_FOR_PLAYER]: [
      "Woah! Now that's what I call a Texas-sized win! You played that perfectly, kid!",
      "Hahaha! Look at that pot! You stacked 'em good. Keep applying pressure like that!",
      "Beautiful! I couldn't have played it better myself. You're a natural killer.",
      "See? You wait for the right spot and boom! That's how you make a living at this game.",
      "That is a monster pot! Make sure you don't get reckless now that you've got chips."
    ],
    [CHAT_TRIGGERS.LOSE_HUGE_FOR_PLAYER]: [
      "Damn, that stings! But hey, a bad beat is just part of the game. Shake it off!",
      "Ouch... that was a rough runout. Don't let it tilt you, focus on the next hand!",
      "Sometimes you do everything right and still lose. That's poker. Keep your head straight.",
      "That's a tough loss, kid. Take a deep breath. We'll get those chips back.",
      "Don't worry about it! Even the pros get stacked. Just make sure you didn't misplay it."
    ],
    [CHAT_TRIGGERS.WIN_SMALL_FOR_PLAYER]: [
      "Nice little scoop there. In 6-max, scooping those small pots adds up quick.",
      "Good job taking the initiative. You don't need a monster to win a hand.",
      "Stealing the blinds like a true Texan! I like it.",
      "Pot control paid off. A win is a win, don't mind the size.",
      "Way to stay aggressive and take down the dead money."
    ],
    [CHAT_TRIGGERS.LOSE_SMALL_FOR_PLAYER]: [
      "Sensible fold. Sometimes giving up a small pot is the most profitable play you can make.",
      "Good discipline. You didn't bloat the pot when you didn't have it.",
      "Don't sweat the small stuff. Save your chips for when you actually have a hand.",
      "That's fine. We don't need to fight for every single pot. Pick your battles.",
      "You missed the board, you bailed out. Exactly what you should do."
    ],
    [CHAT_TRIGGERS.ALL_IN_FOR_PLAYER]: [
      "All in! I love the aggression! Put maximum pressure on 'em!",
      "Shoving it all in! That's how a real man plays! Make 'em sweat for it!",
      "Pushing your whole stack! If you've got the nuts, this is exactly what you do.",
      "Going for the kill! Let's see if they have the guts to call.",
      "That's Texas hold'em right there! Putting your tournament life on the line!"
    ],
    [CHAT_TRIGGERS.FOLD_FOR_PLAYER]: [
      "Good fold. Throwing away trash from early position is the first thing I taught you.",
      "Nice laydown. Discipline is what separates the winners from the losers.",
      "Smart move. If the odds aren't there and you're drawing thin, just get out.",
      "Exactly. Don't play every hand. Wait for a spot where you have the advantage.",
      "Mucking it. That's the right play. Conserve your stack for better opportunities."
    ],
    [CHAT_TRIGGERS.WAITING_FOR_PLAYER]: [
      "Hey! The clock is ticking! Calculate your odds and make a move!",
      "Don't fall asleep on me now! Think about what they could have and act!",
      "What's the holdup? Trust your gut, kid. Don't overthink it.",
      "We ain't got all day! Evaluate the board texture and decide: bet or fold?",
      "Come on, pull the trigger! If you're scared of losing chips, you shouldn't be playing!"
    ],
    [CHAT_TRIGGERS.RAISE_SMALL_FOR_PLAYER]: [
      "A min-raise? Interesting. Trying to milk 'em for value or just a cheap bluff?",
      "Small raise. Sets your own price to see a card, I guess.",
      "Be careful with small raises, you might give 'em the pot odds to draw out on you.",
      "Testing the waters with a small bump. Not bad.",
      "A little click-back. You trying to trap 'em?"
    ],
    [CHAT_TRIGGERS.RAISE_MEDIUM_FOR_PLAYER]: [
      "Solid raise size. You're building the pot and charging them to see the next card.",
      "Good sizing. Three times the bet is standard. Don't let 'em draw out cheap.",
      "That's a textbook raise! Putting the pressure on!",
      "Applying pressure with a solid raise. That's how we play in 6-max!",
      "Nice raise. You're forcing them to define their hand."
    ],
    [CHAT_TRIGGERS.RAISE_BIG_FOR_PLAYER]: [
      "A massive overbet! I like it! You're really polarizing your range here.",
      "Huge raise! They gotta think you either have the absolute nuts or total air!",
      "Way over the top! Puts them in a horrible spot if they have a marginal hand.",
      "That's a punishing bet size! Make them pay the maximum if they want to chase!",
      "Wow! Throwing your weight around! Just make sure it actually makes sense."
    ],
    [CHAT_TRIGGERS.CALL_FOR_PLAYER]: [
      "Calling to see the next street. Did you calculate your pot odds?",
      "Flat call. Be careful, calling too much is how calling stations go broke.",
      "You're just calling? If your hand is strong, you should be raising!",
      "Alright, peeling one off. Let's see what the next card brings.",
      "Calling closes the action. Let's re-evaluate on the next street."
    ],
    [CHAT_TRIGGERS.CHECK_FOR_PLAYER]: [
      "Check. Nothing wrong with checking when you missed the flop.",
      "Pot control. Keeping the pot small with a marginal hand. Good.",
      "Checking it around. Let's see a free card and gather some information.",
      "Are you trapping, or do you just have nothing? I'll let you figure it out.",
      "Check. Don't force a continuation bet if the board heavily favors their range."
    ],
    [CHAT_TRIGGERS.BLUFF_CAUGHT_FOR_PLAYER]: [
      "Ouch! They called your bluff. You really need to pick your spots better.",
      "Caught red-handed! Next time, make sure your story makes sense across all streets.",
      "Well, you got caught. But now they probably think you're a maniac, so use that later!",
      "Bad bluff spot, kid. If they're a calling station, you can't push them off a hand!",
      "That bluff didn't work. The board texture didn't support what you were representing."
    ]
  },
  MAX: {
    [CHAT_TRIGGERS.GAME_START]: ["Let's get this over with.", "Try not to lose it all at once.", "Texas style, baby.", "My chips, my rules.", "Don't blink."],
    [CHAT_TRIGGERS.WIN_HUGE]: ["That's how we do it back home!", "Read you like a book!", "Easiest money of my life.", "Don't cry about it.", "Texas strong!"],
    [CHAT_TRIGGERS.WIN_SMALL]: ["A win's a win.", "Keep 'em coming.", "Not bad.", "Ill take it.", "Small change."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["Are you kidding me?!", "Absolute garbage luck.", "This deck is rigged.", "You shouldn't even be in that hand!", "Son of a..."],
    [CHAT_TRIGGERS.LOSE_SMALL]: ["Whatever.", "Just wait.", "Next hand.", "Lucky catch.", "Hmm."],
    [CHAT_TRIGGERS.CHOP]: ["Chop.", "Tie.", "Save the chips.", "Split it.", "Fine."],
    [CHAT_TRIGGERS.ALL_IN]: ["Let's ride!", "All in, let's see it!", "No guts, no glory.", "Put 'em in the middle.", "Shoving!"],
    [CHAT_TRIGGERS.FOLD]: ["Garbage.", "Fold.", "Not this time.", "Pass.", "I can wait."],
    [CHAT_TRIGGERS.BET]: ["Let's see where you're at.", "Bet.", "Price of poker.", "Action.", "Chips in."],
    [CHAT_TRIGGERS.RAISE]: ["Not so fast.", "Pump it up.", "Raise.", "Let's make it a real pot.", "Costing you more now."],
    [CHAT_TRIGGERS.CALL]: ["I'll bite.", "Let's see it.", "Call.", "I have to know.", "Can't fold this."],
    [CHAT_TRIGGERS.CHECK]: ["Check.", "Your move.", "Pass.", "Seeing a free card.", "I'll wait."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["Man, forget this.", "I need a drink.", "Worst luck ever.", "I'm out of here.", "See you around."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["Don't let the door hit you.", "Another one down.", "That's what you get.", "See ya.", "Get off the table."]
  },
  FLORENCE: {
    [CHAT_TRIGGERS.GAME_START]: ["Let's make this interesting.", "Try to keep up, darling.", "Don't bore me.", "Vegas rules.", "I hope you brought enough."],
    [CHAT_TRIGGERS.WIN_HUGE]: ["Too easy.", "Was that supposed to be a bluff?", "Thanks for the donation.", "Predictable.", "I almost feel bad. Almost."],
    [CHAT_TRIGGERS.WIN_SMALL]: ["Cute.", "Every little bit helps.", "A modest return.", "I'll take it.", "Not bad."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["How tedious.", "Enjoy your moment.", "You got incredibly lucky.", "We'll see how long that lasts.", "Fine."],
    [CHAT_TRIGGERS.LOSE_SMALL]: ["Whatever.", "Next.", "Just a little variance.", "Moving on.", "Hmph."],
    [CHAT_TRIGGERS.CHOP]: ["A split.", "How boring.", "Tie.", "Next hand.", "Shared."],
    [CHAT_TRIGGERS.ALL_IN]: ["Feeling bold?", "Let's see if you're brave.", "All in. Try me.", "Max pressure.", "Let's find out."],
    [CHAT_TRIGGERS.FOLD]: ["I don't play trash.", "Fold.", "You can have it.", "Not worth my time.", "Pass."],
    [CHAT_TRIGGERS.BET]: ["Let's see.", "A small fee.", "Bet.", "Pay up.", "Just a taste."],
    [CHAT_TRIGGERS.RAISE]: ["Is that your best?", "Let's raise the stakes.", "You're too transparent.", "Raise.", "Let's make it hurt."],
    [CHAT_TRIGGERS.CALL]: ["I'll humor you.", "Let's see the cards.", "Call.", "I don't believe you.", "Curious."],
    [CHAT_TRIGGERS.CHECK]: ["Check.", "Checking.", "Go ahead.", "Your turn, dear.", "Pass."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["This table is terrible anyway.", "I have better places to be.", "Whatever.", "I'm done here.", "Goodbye."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["Farewell.", "You won't be missed.", "And stay out.", "Finally.", "Next victim, please."]
  },
  AN_UNKNOWN_WOMAN: {}
};
PERSONALITIES.AN_UNKNOWN_WOMAN = PERSONALITIES.FLORENCE;