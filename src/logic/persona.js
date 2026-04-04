import { CONTRACT_TYPE, CHAT_TRIGGERS, ENEMY_ID } from './constants.js';
import { PERSONALITIES } from './dialogues/index.js';
let getSettingLanguage = () => 'ko';
export const setLanguageGetter = (getter) => { getSettingLanguage = getter; };
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
    name: 'Old_Lion', philosophy: 'TAG', vPIP: .23, AF: 2.75, WTSD: .27, chipMultiply: 1.75, isAdvanced: true,
    note_ko: '전성기는 지났지만 여전히 날카로운 노장입니다. 그가 참전했다는 건 이미 덫을 다 깔아두었다는 뜻이니, 함부로 덤비지 마세요.',
    note_en: 'His prime has passed, but he is still a sharp veteran. If he has entered the game, it means he has already laid all the traps, so don\'t mess with him carelessly.',
  },
  {
    id: 'shark',
    name: 'Shark', philosophy: 'TAG', vPIP: .22, AF: 3.5, WTSD: .25, chipMultiply: 2, isAdvanced: true, isBoss: true,
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
  { id: 'named_pro', concept: '실제 프로포커 플레이어인 필아이비를 모티브로 한 캐릭터입니다.', name: 'IVY_00', philosophy: 'TAG', vPIP: .27, AF: 3.5, WTSD: .27, chipMultiply: 2, isBoss: true, note: '균형잡힌, 그리고 전설적인 포커 플레이어입니다.' },
  { id: 'named_pro', concept: '실제 프로포커 플레이어인 다니엘 네그라누를 모티브로 한 캐릭터입니다.', name: 'D_NEURAL', philosophy: 'LAG', vPIP: .34, AF: 2.7, WTSD: .26, chipMultiply: 2, isBoss: true, note: '유쾌하며 상대방의 핸드리딩 실력이 정말 좋습니다.' },
  { id: 'named_pro', concept: '실제 프로포커 플레이어인 탐드완를 모티브로 한 캐릭터입니다.', name: 'D.W.A.N_V2', philosophy: 'LAG', vPIP: .33, AF: 4.2, WTSD: .30, chipMultiply: 2, isBoss: true, note: '매우 공격적인 프로 포커 플레이어입니다.' },
  { id: 'named_pro', concept: '실제 프로포커 플레이어인 정글맨 케이트를 모티브로 한 캐릭터입니다.', name: 'JNGL_MAN', philosophy: 'TAG', vPIP: .30, AF: 3.3, WTSD: .31, chipMultiply: 2, isBoss: true, note: '헤즈업 전문 프로 포커 플레이어입니다.' },
  { id: 'named_pro', concept: '실제 프로포커 플레이어인 요 바이럴를 모티브로 한 캐릭터입니다.', name: 'YH0_V1RAL', philosophy: 'LAG', vPIP: .33, AF: 3.7, WTSD: .29, chipMultiply: 2, isBoss: true, note: '프랑스 출신 유명 포커 플레이어입니다.' },
]

