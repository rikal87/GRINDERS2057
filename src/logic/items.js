import { getItemEffect, getRndItemBucket } from "./itemsEffect";
import { store } from './store.js';

export const ITEM_DATA = [
  // --- T1 items (Common, 1000 - 5000 CR) ---
  {
    id: 'to_the_mars_rocket',
    name_ko: '화성행 로켓 모형',
    name_en: 'Mars Bound Rocket Model',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🚀',
    class: 'Item',
    tier: 'T1',
    price: 1200,
    editable: false,
    desc_ko: '화성으로 떠나지 못한 지구에 남겨진 낙오자들을 위한 작은 위로입니다. ',
    desc_en: 'A small consolation for the left behind dropouts who couldn\'t depart for Mars.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('xp_boost')]
  },
  {
    id: 'casino_promotion_info_collector',
    name_ko: '카지노 프로모션 정보 수집기',
    name_en: 'Casino Promotion Info Collector',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '📡',
    class: 'Item',
    tier: 'T1',
    price: 3200,
    desc_ko: '프로모션 중인 카지노 정보를 수집합니다.',
    desc_en: 'Collects casino promotion information.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('blind_discount')]
  },
  {
    id: 'broken_compass',
    name_ko: '고장난 나침반',
    name_en: 'Broken Compass',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🧭',
    class: 'Item',
    tier: 'T1',
    price: 1100,
    editable: false,
    desc_ko: '북쪽 대신 돈이 있는 곳을 가리킨다는 소문이 있습니다.',
    desc_en: 'Rumored to point towards money instead of North.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('showdown_lose_refund')]
  },
  {
    id: 'glitchy_data_chip',
    name_ko: '구형 VHS 테이프',
    name_en: 'Old VHS Tape',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '📼',
    class: 'Item',
    tier: 'T1',
    price: 2800,
    editable: false,
    desc_ko: '여기에 데이터를 담는다구요? 장난하십니까?',
    desc_en: 'You store data on this? Are you kidding me?',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('lt_recovery')]
  },
  {
    id: 'synthetic_coffee',
    name_ko: '합성 커피',
    name_en: 'Synthetic Coffee',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '☕',
    class: 'Item',
    tier: 'T1',
    price: 1200,
    editable: false,
    desc_ko: '진짜 커피콩으로 만들었진 않지만 카페인 함량과 맛은 비슷합니다.',
    desc_en: 'Not made with real coffee beans, but the caffeine content and taste are similar.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('stemina_regen')]
  },

  {
    id: 'old_stopwatch',
    name_ko: '낡은 초시계',
    name_en: 'Old Stopwatch',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '⏱️',
    class: 'Item',
    tier: 'T1',
    price: 1000,
    editable: false,
    desc_ko: '시간을 조금 더 벌어줄 수 있을 것 같습니다.',
    desc_en: 'Looks like it can buy you a little more time.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('time_bank_plus')]
  },
  {
    id: 'crypto_coin_replica',
    name_ko: '암호화폐 복제품',
    name_en: 'Crypto Coin Replica',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '₿',
    class: 'Item',
    tier: 'T1',
    price: 1250,
    desc_ko: '한때 누군가의 인생을 구원하거나 파멸시켰던 상징물의 플라스틱 복제품입니다. 왠지 행운이 올 것 같은 착각이 듭니다.',
    desc_en: 'A plastic replica of a symbol that once saved or ruined someone\'s life. For some reason, it gives the illusion that luck is coming.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('chip_rounding')]
  },
  {
    id: 'industrial_showdown_lose_refund',
    name_ko: '공업용 자석',
    name_en: 'Industrial Magnet',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🧲',
    class: 'Item',
    tier: 'T1',
    price: 1750,
    editable: false,
    desc_ko: '엄청난 자력으로 주변을 초토화시킵니다.',
    desc_en: 'Devastates the surroundings with immense magnetic force.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('showdown_lose_refund')]
  },
  {
    id: 'smoke_break',
    name_ko: '담배 한 대',
    name_en: 'Smoke Break',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🚬',
    class: 'Item',
    tier: 'T1',
    price: 2500,
    editable: false,
    desc_ko: '"타들어가는 것은 담배가 아니라 당신의 생명입니다." 라는 공익 광고 본 적 없나요?',
    desc_en: 'Haven\'t you seen the public service announcement that \"Not only the cigarette is burning, but your life\"?',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('smoke_break')]
  },
  {
    id: 'failure_philosophy',
    name_ko: '실패학 개론',
    name_en: 'Introduction to Failure',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '📚',
    class: 'Item',
    tier: 'T1',
    price: 4500,
    desc_ko: '패배의 쓴맛을 경험치로 승화시키는 놀라운 철학서입니다.',
    desc_en: 'An amazing philosophy book that sublimates the bitter taste of defeat into experience points.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('failure_is_mother_of_success')]
  },
  {
    id: 'roller_skates',
    name_ko: '롤러 스케이트',
    name_en: 'Roller Skates',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🛼',
    class: 'Item',
    tier: 'T1',
    price: 3800,
    desc_ko: '아슬아슬하게 졌다고요? 아니요, 그냥 진 겁니다. 패배의 감정에서 빠르게 빠져나가세요.',
    desc_en: 'Lost by a hair? No, you just lost. Roll quickly out of your feelings of defeat.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('outkicked')]
  },
  {
    id: 'rusty_pair_pendant',
    name_ko: '녹슨 페어 펜던트',
    name_en: 'Rusty Pair Pendant',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '⛓️',
    class: 'Item',
    tier: 'T1',
    price: 3200,
    desc_ko: '보잘것 없는 원페어에 인생을 거는 사람들을 위한 유물입니다.',
    desc_en: 'A relic for those who bet their lives on a measly one pair.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('pair_master')]
  },

  // --- T2 items (Uncommon, 10000 - 50000 CR) ---
  {
    id: 'holo_projected_flower',
    name_ko: '홀로그램 꽃',
    name_en: 'Holo-Projected Flower',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🌸',
    class: 'Item',
    tier: 'T2',
    price: 18000,
    desc_ko: '보고 있으면 마음이 편안해지며 자신감이 샘솟습니다.',
    desc_en: 'Looking at it puts your mind at ease and fills you with confidence.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('lt_regen_plus')]
  },
  {
    id: 'tax_evasion_manual',
    name_ko: '합법적(?) 하우스 절세 비법',
    name_en: 'Legal(?) House Tax Evasion Manual',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '📄',
    class: 'Item',
    tier: 'T2',
    price: 15000,
    desc_ko: '하우스의 수수료를 아끼는 기발한 방법들이 적혀 있습니다.',
    desc_en: 'Contains ingenious ways to save on the House\'s rake.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('rake_reduction')]
  },
  {
    id: 'liquid_nitrogen_cooling',
    name_ko: '액체 질소 냉각 시스템',
    name_en: 'Liquid Nitrogen Cooling System',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '❄️',
    class: 'Item',
    tier: 'T2',
    price: 28000,
    desc_ko: '극저온의 냉각으로 패배의 열기를 식혀줍니다.',
    desc_en: 'Cools down the heat of defeat with cryogenic cooling.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('cooler')]
  },

  {
    id: 'orbit_lounge_network_hacking',
    name_ko: '오르빗 네트워크 해킹',
    name_en: 'Orbit Network Hacking',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🚀',
    class: 'Item',
    tier: 'T7',
    price: 9999999,
    isConsumable: true,
    isAccessKey: true,
    desc_ko: '화성 갈끄니깐~~~!',
    desc_en: 'We\'re going to Mars~~~!',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('orbit_tour')]
  },
  {
    id: 'underground_bar_invite',
    name_ko: '지하 바 암호수첩',
    name_en: 'Underground Bar Cipher Book',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '📒',
    class: 'Item',
    tier: 'T2',
    price: 40000,
    isConsumable: true,
    isAccessKey: true,
    desc_ko: '매일 바뀌는 암구호보다 여기 술에 물 타는 비율이 더 자주 바뀔걸요?',
    desc_en: 'I bet the ratio of water in their drinks changes more often than their daily passwords.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('underground_bar_invite')]
  },
  {
    id: 'club_membership',
    name_ko: '클럽 회원 계정',
    name_en: 'Club Membership Account',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🆔',
    class: 'Item',
    tier: 'T3',
    price: 80000,
    isConsumable: true,
    isAccessKey: true,
    desc_ko: '불법으로 위조되었지만, 이제 당당하게 어깨 피고 들어가세요.',
    desc_en: 'It\'s an illegal forgery, but now you can walk in with your shoulders squared.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('club_membership')]
  },
  {
    id: 'the_bunker_key',
    name_ko: '"더 벙커" 복제 열쇠',
    name_en: 'Duplicate Key to "The Bunker"',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🔑',
    class: 'Item',
    tier: 'T4',
    price: 160000,
    isConsumable: true,
    isAccessKey: true,
    desc_ko: '원래는 KBT 조직들만 가지고 있는 열쇠인데, 누군가 복제해서 암시장에 팔고 있습니다.',
    desc_en: 'Originally a key held only by KBT syndicate members, someone duplicated it and is selling it on the black market.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('the_bunker_key')]
  },
  {
    id: 'holdem_house_membership',
    name_ko: '홀덤 하우스 회원 뱃지',
    name_en: 'Hold\'em House Membership Badge',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '⚜️',
    class: 'Item',
    tier: 'T5',
    price: 250000,
    isConsumable: true,
    isAccessKey: true,
    desc_ko: '뱃지 하나 달았다고 매너 있는 척하지 마세요. 어차피 서로 등쳐먹으러 온 거 다 아니까요.',
    desc_en: 'Don\'t pretend to have manners just because you\'re wearing a badge. We all know you\'re here to hustle each other.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('holdem_house_membership')]
  },
  {
    id: 'royal_room_invite',
    name_ko: '로열 프라이빗 카드룸 회원 뱃지',
    name_en: 'Royal Private Cardroom Membership Badge',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🔱',
    class: 'Item',
    tier: 'T6',
    price: 640000,
    isConsumable: true,
    isAccessKey: true,
    desc_ko: '이제 당신도 "특별한 소수"가 되었습니다. 지갑이 완전히 털리기 전까지는 말이죠.',
    desc_en: 'Now you, too, are one of the "special few". That is, until your wallet is completely emptied.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('royal_room_invite')]
  },
  {
    id: 'double_buy_in_ticket',
    name_ko: '더블 바이인 티켓',
    name_en: 'Double Buy-in Ticket',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🎫',
    class: 'Item',
    tier: 'T2',
    price: 45000,
    desc_ko: 'V.I.P 대우를 받으며 모든 바이인을 두 배로 즐기세요.',
    desc_en: 'Enjoy double the buy-in on everything while receiving V.I.P treatment.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('buy_in_multiply')]
  },
  {
    id: 'emergency_reserves',
    name_ko: '비상 예비금 상자',
    name_en: 'Emergency Reserves Box',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '📦',
    class: 'Item',
    tier: 'T2',
    price: 19000,
    desc_ko: '정말 위험할 때를 대비해 숨겨둔 비상금입니다.',
    desc_en: 'A hidden stash of emergency funds for when things get really dangerous.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('emergency_fund')]
  },
  {
    id: 'tax_haven_vpn',
    name_ko: '조세 회피처 VPN',
    name_en: 'Tax Haven VPN',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🌐',
    class: 'Item',
    tier: 'T2',
    price: 27000,
    desc_ko: '네트워크 위치를 속여 과도한 수수료를 회피합니다.',
    desc_en: 'Spoofs your network location to evade excessive fees.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('rake_reduction')]
  },
  {
    id: 'old_phone',
    name_ko: '구식 전화기',
    name_en: 'Vintage Phone',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '☎️',
    class: 'Item',
    tier: 'T2',
    price: 12500,
    editable: false,
    desc_ko: '여보세요? 아, 관심없다니깐요? 안사요 안사...어? 반값 할인이라고요? 잠시만요, 끊지 말아 보세요.',
    desc_en: 'Hello? Ah, I said I\'m not interested. I\'m not buying... Huh? Half-price discount? Wait a minute, don\'t hang up.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('loyalty_card')]
  },
  {
    id: 'backup_battery_set',
    name_ko: '백업 배터리 세트',
    name_en: 'Backup Battery Set',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🪫',
    class: 'Item',
    tier: 'T2',
    price: 16500,
    desc_ko: '메인 전원이 나갔을 때를 대비한 든든한 보험입니다.',
    desc_en: 'A solid insurance policy for when the main power goes out.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('last_stand')]
  },


  {
    id: 'quick_fold_manual',
    name_ko: '쾌속 폴드 지침서',
    name_en: 'Quick Fold Manual',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '📖',
    class: 'Item',
    tier: 'T2',
    price: 22000,
    desc_ko: '포기할 줄 아는 용기가 때로는 더 큰 자본으로 돌아옵니다.',
    desc_en: 'Sometimes the courage to give up returns as even greater capital.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('quantum_fold')]
  },
  {
    id: 'blackjack_seal',
    name_ko: '블랙잭 인장',
    name_en: 'Blackjack Seal',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '♠',
    class: 'Item',
    tier: 'T2',
    price: 45000,
    desc_ko: 'A와 J의 조합이 가져다주는 전율을 경험하십시오.',
    desc_en: 'Experience the thrill that the combination of A and J brings.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('blackjack_master')]
  },
  {
    id: 'victory_streak_flag',
    name_ko: '연승의 깃발',
    name_en: 'Win Streak Flag',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🚩',
    class: 'Item',
    tier: 'T2',
    price: 25000,
    desc_ko: '승리의 기세가 꺾이지 않도록 성장을 가속화합니다.',
    desc_en: 'Accelerates growth to ensure your winning momentum isn\'t broken.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('winner_master')]
  },
  {
    id: 'chips',
    name_ko: '칩스',
    name_en: 'Chips',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🍟',
    class: 'Item',
    tier: 'T2',
    price: 30000,
    desc_ko: '햄버거랑 물은 안필요하세요?',
    desc_en: 'Don\'t you need a hamburger, and a bottle of water too?',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('sets_master')]
  },
  {
    id: 'black_consumer',
    name_ko: '블랙 컨슈머',
    name_en: 'Black Consumer',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🤑',
    class: 'Item',
    tier: 'T2',
    price: 25000,
    isConsumable: true,
    desc_ko: '진상 짓으로 암상인과의 관계를 최악으로 만들었습니다.',
    desc_en: 'Made your relationship with the black market dealer the worst with your complaining.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('black_consumer')]
  },
  {
    id: 'luck_of_the_draw_coin',
    name_ko: '운명의 드로우 동전',
    name_en: 'Coin of Destiny\'s Draw',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🪙',
    class: 'Item',
    tier: 'T2',
    price: 35000,
    desc_ko: '불가능할 것 같은 승리를 당신의 것으로 만듭니다.',
    desc_en: 'Makes a seemingly impossible victory yours.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('quantum_luck')]
  },
  // --- T3 items (Rare, 50000 - 100000 CR) ---
  {
    id: 'noise_cancelling_headset',
    name_ko: '노이즈 캔슬링 헤드셋',
    name_en: 'Noise Cancelling Headset',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🎧',
    class: 'Item',
    tier: 'T3',
    price: 55000,
    desc_ko: '가족 생각, 빚 독촉, 옆 자리의 욕설... 인생의 불협화음을 제거하면 오직 "숫자"만 남습니다. 이제 차분하게 올인을 결정하세요.',
    desc_en: 'Thoughts of family, debt collectors, curses from the next seat... When you remove life\'s dissonance, only "numbers" remain. Now calmly decide to go all-in.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('time_bank_plus'), getItemEffect('time_bank_plus')]
  },
  {
    id: 'low_stack_battery',
    name_ko: '배수의 진 배터리',
    name_en: 'Last Stand Battery',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🪫',
    class: 'Item',
    tier: 'T3',
    price: 63000,
    desc_ko: '궁지에 몰릴수록 더욱 강력한 에너지를 내뿜습니다.',
    desc_en: 'Emits stronger energy the more cornered you are.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('last_stand'), getItemEffect('last_stand')]
  },
  {
    id: 'floppy_disk',
    name_ko: '플로피 디스크',
    name_en: 'Floppy Disk',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '💾',
    class: 'Item',
    tier: 'T3',
    price: 82000,
    editable: false,
    desc_ko: '아주 먼 옛날에는 여기에 게임을 분할 압축하여 담았다고 합니다. 웃기죠?',
    desc_en: 'They say a long time ago, people used to split compress and store games on these. Funny, isn\'t it?',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('lt_recovery'), getItemEffect('lt_recovery')]
  },
  // {
  //   id: 'deep_well_program',
  //   name: '심층 연산 프로그램',
  //   icon: '🔩',
  //   class: 'Item',
  //   tier: 'T3',
  //   price: 76000,
  //   desc: '심층 연산 프로그램으로 정제된 연산량입니다.',
  //   effects: [getItemEffect('lt_regen_plus'), getItemEffect('lt_regen_plus')]
  // },
  {
    id: 'cyber_pet_collar',
    name_ko: '사이버 펫',
    name_en: 'Cyber Pet',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🐕‍🦺',
    class: 'Item',
    tier: 'T3',
    price: 88000,
    editable: false,
    desc_ko: '귀여운 동반자와 함께라면 성장이 빠릅니다.',
    desc_en: 'With a cute companion, growth is fast.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('xp_boost'), getItemEffect('chip_rounding')]
  },
  {
    id: 'scrap_collector_glove',
    name_ko: '고철 수집가 장갑',
    name_en: 'Scrap Collector\'s Glove',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🧤',
    class: 'Item',
    tier: 'T3',
    price: 65000,
    editable: false,
    desc_ko: '더러운 건 싫지만 돈이 되는 건 좋습니다.',
    desc_en: 'I hate things being dirty, but I like things that make money.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('chip_rounding'), getItemEffect('chip_rounding')]
  },
  {
    id: 'prismatic_achievement_card',
    name_ko: '프리즘 업적 카드',
    name_en: 'Prismatic Achievement Card',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🃏',
    class: 'Item',
    tier: 'T3',
    price: 92000,
    desc_ko: '당신의 모든 승리가 영광스러운 기록으로 남게 됩니다.',
    desc_en: 'All your victories will be left as a glorious record.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('xp_boost'), getItemEffect('xp_boost')]
  },

  {
    id: 'neuro_sync_headband',
    name_ko: '뉴로 동기화 머리띠',
    name_en: 'Neuro Sync Headband',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🧠',
    class: 'Item',
    tier: 'T3',
    price: 55000,
    desc_ko: '뇌파를 에이전트와 직접 동기화하여 LT를 빠르게 회복합니다.',
    desc_en: 'Brainwave synchronization with the agent for rapid LT recovery.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('lt_regen_plus'), getItemEffect('lt_regen_plus')]
  },
  {
    id: 'allin_insurance_plus',
    name_ko: '세이프 가드 플러스',
    name_en: 'Safe Guard Plus',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🛡️',
    class: 'Item',
    tier: 'T3',
    price: 72000,
    desc_ko: '더 넓은 범위의 손실을 보장해주는 프리미엄 보험입니다.',
    desc_en: 'Premium insurance that guarantees a wider range of losses.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('allin_insurance'), getItemEffect('allin_insurance')]
  },

  {
    id: 'life_saver_buoy',
    name_ko: '구명튜브',
    name_en: 'Life Saver Buoy',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🛟',
    class: 'Item',
    tier: 'T3',
    price: 93000,
    "desc_ko": '올인이라는 거친 파도 속에서도 당신을 건져 올립니다.',
    "desc_en": 'Even in the rough waves of all-in, it lifts you up.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('allin_insurance'), getItemEffect('tilt_recovery')]
  },
  {
    id: 'advanced_equity_calc',
    name_ko: '에쿼티 연산기',
    name_en: 'Advanced Equity Calculator',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '📊',
    class: 'Item',
    tier: 'T3',
    price: 92000,
    "desc_ko": '단순한 확률을 넘어 미래의 분기점까지 계산합니다.',
    "desc_en": 'Calculates not only simple probabilities but also future branch points.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('pot_bonus'), getItemEffect('quantum_fold')]
  },
  {
    id: 'crystal_wine_glass',
    name_ko: '크리스털 와인잔',
    name_en: 'Crystal Wine Glass',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🍷',
    class: 'Item',
    tier: 'T3',
    price: 64000,
    desc_ko: '당신의 승리에 건배.',
    desc_en: 'Cheers to your victory.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('pot_bonus'), getItemEffect('winner_master')]
  },

  // --- T4 items (Uncommon + 1 Random, 100000 - 200000 CR) ---
  {
    id: 'olive_branch',
    name_ko: '올리브 나뭇가지',
    name_en: 'Olive Branch',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🌿',
    class: 'Item',
    tier: 'T4',
    price: 100000,
    isConsumable: true,
    desc_ko: '이제 화해의 손길을 내밀 때인 것 같아요. 당신의 진심을 본다면 그들도 이해해 줄 겁니다.',
    desc_en: 'Maybe it\'s time to offer an olive branch. If they see your sincere remorse, they\'ll likely be more understanding.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('olive_branch')]
  },
  {
    id: 'loaded_dice',
    name_ko: '사기 주사위',
    name_en: 'Loaded Dice',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🎲',
    class: 'Item',
    tier: 'T4',
    price: 196000,
    desc_ko: '이상하게 높은 숫자가 자주 나오는건 기분 탓이겠죠?',
    desc_en: 'It\'s just my imagination that high numbers roll strangely often, right?',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('omen'), getItemEffect('pot_bonus')]
  },

  {
    id: 'algorithmic_rebate_tool',
    name_ko: '알고리즘 환급 도구',
    name_en: 'Algorithmic Rebate Tool',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '♻️',
    class: 'Item',
    tier: 'T4',
    price: 166000,
    desc_ko: '계산된 손실의 일부를 즉시 복구합니다.',
    desc_en: 'Immediately recovers a portion of calculated losses.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('tilt_recovery'), getItemEffect('tilt_recovery')]
  },
  {
    id: 'black_market_courier_bag',
    name_ko: '블랙마켓 배달 가방',
    name_en: 'Black Market Courier Bag',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '💼',
    class: 'Item',
    tier: 'T4',
    price: 135000,
    desc_ko: '배달 사고로 주인을 잃은 서류 가방입니다..',
    desc_en: 'A briefcase that lost its owner due to a delivery accident...',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getRndItemBucket, getRndItemBucket]
  },
  {
    id: 'blind_folded_monk_statue',
    name_ko: '눈먼 수도승 조각상',
    name_en: 'Blindfolded Monk Statue',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🧘',
    class: 'Item',
    tier: 'T4',
    price: 138000,
    desc_ko: '보이지 않는 것이 때로는 가장 안전합니다.',
    desc_en: 'Sometimes what you can\'t see is the safest.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('blind_discount'), getItemEffect('blind_discount')]
  },
  {
    id: 'blind_discount_v2_proto',
    name_ko: '블라인드 실드 v2(시제품)',
    name_en: 'Blind Shield v2 (Prototype)',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🛡️',
    class: 'Item',
    tier: 'T4',
    price: 149000,
    desc_ko: '아직 불안정하지만 강력한 방어력을 보여줍니다.',
    desc_en: 'It\'s still unstable but shows strong defensive power.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('blind_discount'), getRndItemBucket]
  },

  {
    id: 'cyber_junkies_stash',
    name_ko: '사이버 정키의 비축품',
    name_en: 'Cyber Junkie\'s Stash',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🥡',
    class: 'Item',
    tier: 'T4',
    price: 115000,
    desc_ko: '어딘가 쓸모 있는 잡동사니들이 가득합니다.',
    desc_en: 'It\'s full of junk that might be useful somewhere.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('emergency_fund'), getRndItemBucket]
  },
  {
    id: 'decrypted_tax_file',
    name_ko: '해독된 세무 파일',
    name_en: 'Decrypted Tax File',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '📄',
    class: 'Item',
    tier: 'T4',
    price: 120000,
    desc_ko: '카지노의 탈세 장부 사이에서 뜻밖의 뒷돈을 발견했습니다. 역시 남의 비밀을 파헤치는 것만큼 수익성 높은 비즈니스는 없군요.',
    desc_en: 'Found unexpected black money amidst the casino\'s tax evasion ledgers. Uncovering other people\'s secrets is indeed the most profitable business.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('rake_reduction'), getRndItemBucket]
  },
  {
    id: 'emergency_exit_hammer',
    name_ko: '긴급 탈출 망치',
    name_en: 'Emergency Exit Hammer',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🔨',
    class: 'Item',
    tier: 'T4',
    price: 168000,
    desc_ko: '복잡한 수수료 체계를 부수어버립니다.',
    desc_en: 'Smashes the complex fee structures entirely.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('rake_reduction'), getItemEffect('rake_reduction')]
  },
  {
    id: 'equity_emergency_alarm',
    name_ko: '에퀴티 비상 경보기',
    name_en: 'Equity Emergency Alarm',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🚨',
    class: 'Item',
    tier: 'T4',
    price: 171000,
    editable: false,
    desc_ko: '당신의 에퀴티가 위험에 처했을 때, 자동으로 경보를 울립니다.',
    desc_en: 'Automatically sounds an alarm when your equity is in danger.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('quantum_fold'), getItemEffect('allin_insurance')]
  },
  {
    id: 'forged_coupon',
    name_ko: '위조 쿠폰',
    name_en: 'Forged Coupon',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🎁',
    class: 'Item',
    tier: 'T4',
    price: 210000,
    desc_ko: '들키지만 않는다면 아주 유용한 수단입니다.',
    desc_en: 'It\'s a very useful tool, as long as you don\'t get caught.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('loyalty_card'), getItemEffect('loyalty_card')]
  },
  {
    id: 'golden_mirror',
    name_ko: '황금 거울',
    name_en: 'Golden Mirror',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🪞',
    class: 'Item',
    tier: 'T4',
    price: 139000,
    desc_ko: '거울 속에 비친 당신의 모습보다 둘러싸인 순금 테두리의 가치가 더 높다는 사실에 위안을 얻으세요.',
    desc_en: 'Find comfort in the fact that the solid gold frame around it is worth more than your reflection in the mirror.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('golden_touch'), getItemEffect('golden_touch')]
  },
  {
    id: 'capitalists_top_hat',
    name_ko: '자본주의의 뚜껑',
    name_en: 'Capitalist\'s Top Hat',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🎩',
    class: 'Item',
    tier: 'T4',
    price: 162000,
    desc_ko: '머리 위에 얹힌 이 비싼 장식물은 당신이 멍청한 베팅을 해도 주위 사람들이 "과감한 결단"이라고 칭송하게 만듭니다.',
    desc_en: 'This expensive ornament sitting on your head makes the people around you praise your stupid bets as "bold decisions".',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('winner_master'), getItemEffect('winner_master')]
  },
  {
    id: 'jackpot_seed_data',
    name_ko: '잭팟 시드 데이터',
    name_en: 'Jackpot Seed Data',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🌱',
    class: 'Item',
    tier: 'T4',
    price: 175000,
    desc_ko: '큰 행운을 불러올 씨앗 같은 데이터 뭉치입니다.',
    desc_en: 'A clump of data like a seed that will bring great luck.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('emergency_fund'), getItemEffect('pot_bonus')]
  },
  {
    id: 'low_stack_berserker_core',
    name_ko: '로우 스택 버서커 코어',
    name_en: 'Low Stack Berserker Core',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '⚛️',
    class: 'Item',
    tier: 'T4',
    price: 145000,
    desc_ko: '남은 칩이 적을수록 연산 회로가 폭주하며 재생력을 높입니다.',
    desc_en: 'The fewer chips remaining, the more the processing circuits go berserk, increasing regenerative power.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('last_stand'), getItemEffect('blind_discount')]
  },

  {
    id: 'lucky_cat_gold',
    name_ko: '황금 마네키네코',
    name_en: 'Golden Maneki-neko',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🐱',
    class: 'Item',
    tier: 'T4',
    price: 155000,
    editable: false,
    desc_ko: '끊임없이 흔들리는 저 금색 앞발은 행운을 부르는 게 아닙니다. 테이블 위의 칩들을 당신 쪽으로 긁어모으는 기계적인 갈퀴질이죠',
    desc_en: 'That endlessly waving golden paw isn\'t beckoning luck. It\'s a mechanical raking motion, scraping the chips on the table toward you.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('pot_bonus'), getItemEffect('pot_bonus')]
  },
  {
    id: 'lucky_charm_v4',
    name_ko: '행운의 부적 v4',
    name_en: 'Lucky Charm v4',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🧿',
    class: 'Item',
    tier: 'T4',
    price: 172000,
    desc_ko: '과학과 미신이 결합된 최신형 부적입니다.',
    desc_en: 'The latest charm combining science and superstition.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('emergency_fund'), getRndItemBucket]
  },
  {
    id: 'mask_of_joy_and_despair',
    name_ko: '환희와 절망의 가면',
    name_en: 'Mask of Joy and Despair',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🎭',
    class: 'Item',
    tier: 'T4',
    price: 186000,
    editable: false,
    desc_ko: '비극은 멀리서 보면 희극이라지만, 이 도시는 당신이 어느 쪽에 속해 있든 전혀 개의치 않습니다.',
    desc_en: 'They say tragedy is comedy from afar, but this city doesn\'t care which side you\'re on at all.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('failure_is_mother_of_success'), getItemEffect('winner_master')]
  },
  {
    id: 'merchants_secret_handshake',
    name_ko: '상인의 비밀 암호',
    name_en: 'Merchant\'s Secret Cipher',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🤝',
    class: 'Item',
    tier: 'T4',
    price: 144000,
    desc_ko: '아는 사람만 아는 방식으로 가격을 깎습니다.',
    desc_en: 'Discounts prices in a way only those in the know understand.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('loyalty_card'), getItemEffect('pot_bonus')]
  },
  {
    id: 'phoenix_protocol',
    name_ko: '피닉스 프로토콜',
    name_en: 'Phoenix Protocol',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🔥',
    class: 'Item',
    tier: 'T4',
    price: 118000,
    desc_ko: '잿더미에서 다시 일어서는 것처럼 초기 자금을 복구합니다.',
    desc_en: 'Recovers initial funds like rising from the ashes.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('emergency_fund'), getItemEffect('emergency_fund')]
  },
  {
    id: 'quantum_crypto_wallet',
    name_ko: '양자 암호 지갑',
    name_en: 'Quantum Crypto Wallet',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🔒',
    class: 'Item',
    tier: 'T4',
    price: 155000,
    desc_ko: '보안과 수익을 동시에 챙기는 미래형 지갑입니다.',
    desc_en: 'A futuristic wallet that ensures both security and profit.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('rake_reduction'), getItemEffect('blind_discount')]
  },
  {
    id: 'quantum_pocket_watch',
    name_ko: '양자 포켓 워치',
    name_en: 'Quantum Pocket Watch',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '⌚',
    class: 'Item',
    tier: 'T4',
    price: 185000,
    desc_ko: '시간과 운명이 겹치는 찰나의 순간을 포착합니다.',
    desc_en: 'Captures the fleeting moment when time and fate intersect.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('quantum_luck'), getItemEffect('cooldown_reduction')]
  },
  // {
  //   id: 'ram_thief_amplifier',
  //   name: '연산 도둑 증폭기',
  //   icon: '📢',
  //   class: 'Item',
  //   tier: 'T4',
  //   price: 165000,
  //   desc: '가져오는 것은 더 크게, 잃는 것은 더 작게.',
  //   effects: [getItemEffect('ram_thief'), getItemEffect('ram_thief')]
  // },
  {
    id: 'rogue_ai_fragment',
    name_ko: '탈주 AI의 파편',
    name_en: 'Rogue AI Fragment',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '👾',
    class: 'Item',
    tier: 'T4',
    price: 195000,
    desc_ko: '통제 불가능한 AI가 당신의 시스템을 뒤흔듭니다.',
    desc_en: 'An uncontrollable AI shakes up your system.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('lt_regen_plus'), getRndItemBucket]
  },
  {
    id: 'second_chance_script_v2',
    name_ko: '두 번째 찬스 v2',
    name_en: 'Second Chance Script v2',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '✌️',
    class: 'Item',
    tier: 'T4',
    price: 122000,
    desc_ko: '한 번의 실수를 덮어줄 수 있는 더 나은 코드입니다.',
    desc_en: 'Better code that can cover up a single mistake.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('emergency_fund'), getItemEffect('pair_master')]
  },
  {
    id: 'vip_lounge_keycard',
    name_ko: 'VIP 키카드',
    name_en: 'VIP Lounge Keycard',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '💳',
    class: 'Item',
    tier: 'T4',
    price: 190000,
    desc_ko: '대부분의 카지노에서 최고급 대우를 보장하는 신분 상징입니다.',
    desc_en: 'A status symbol that guarantees premium treatment at most casinos.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('rake_reduction'), getItemEffect('blind_discount')]
  },
  {
    id: 'folding_fan',
    name_ko: '접이식 부채',
    name_en: 'Folding Fan',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🪭',
    class: 'Item',
    tier: 'T4',
    price: 130000,
    desc_ko: '부채질로 한번으로 느긋함과 우아함 두가지를 동시에 잡습니다.',
    desc_en: 'With a single sweep of the fan, you capture both relaxation and elegance.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('stemina_regen'), getItemEffect('stemina_regen')]
  },
  // --- T5 items (Rare + 2 Random, 200000 - 500000 CR) ---
  {
    id: 'black_market_ring',
    name_ko: '암상인의 반지',
    name_en: 'Black Market Ring',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '💍',
    class: 'Item',
    tier: 'T5',
    price: 220000,
    desc_ko: '이 반지는 암시장에서 통용되는 상징입니다.',
    desc_en: 'This ring is a commonly accepted symbol in the black market.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('loyalty_card'), getItemEffect('straight_flush_master'), getRndItemBucket]
  },

  {
    id: 'ancient_pot',
    name_ko: '고대 항아리',
    name_en: 'Ancient Pot',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🏺',
    class: 'Item',
    tier: 'T5',
    price: 398000,
    desc_ko: '이 항아리에 깃든 고대의 행운은 과학적으로 증명되지 않았습니다. 하지만 당신의 팟을 키워준다는 소문만은 시장에서 아주 비싸게 팔리죠',
    desc_en: 'The ancient luck dwelling in this pot is not scientifically proven. However, the rumor that it grows your pot sells for a very high price on the market.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getRndItemBucket, getRndItemBucket]
  },
  {
    id: 'eiffel_tower',
    name_ko: '에펠탑',
    name_en: 'Eiffel Tower',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🗼',
    class: 'Item',
    tier: 'T5',
    price: 332000,
    desc_ko: '과거 파리의 상징이자 랜드마크"였"습니다. 이제는 초거대 기업의 고출력 송신 안테나로 쓰이고 있습니다.',
    desc_en: '"Was" the symbol and landmark of Paris in the past. Now it\'s used as a high-powered transmission antenna by a megacorp.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('last_stand'), getItemEffect('last_stand'), getItemEffect('last_stand')]
  },
  {
    id: 'cryo_mint_dispenser',
    name_ko: '크라이오 민트 디스펜서',
    name_en: 'Cryo Mint Dispenser',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🧊',
    class: 'Item',
    tier: 'T5',
    price: 390000,
    desc_ko: '극도의 시원함으로 잠이 확 깹니다.',
    desc_en: 'The extreme coolness wakes you up instantly.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('stemina_regen'), getItemEffect('stemina_regen'), getItemEffect('stemina_regen')]
  },
  {
    id: 'statue_of_liberty',
    name_ko: '자유의 여신상',
    name_en: 'Statue of Liberty',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🗽',
    class: 'Item',
    tier: 'T5',
    price: 430000,
    desc_ko: '모두에게 부자가 될 기회는 공평하게 주어집니다. 다만, 당신의 잔고가 공평하지 않을 뿐이죠',
    desc_en: 'Everyone is given a fair chance to become rich. It\'s just that your bank balance isn\'t fair.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('buy_in_multiply'), getItemEffect('buy_in_multiply'), getItemEffect('buy_in_multiply')]
  },
  {
    id: 'neural_link_v3',
    name_ko: '뉴럴 링크 v3',
    name_en: 'Neural Link v3',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🧠',
    class: 'Item',
    tier: 'T5',
    price: 215000,
    desc_ko: '뇌와 AI Agent 시스템을 직접 연결하여 한계를 돌파합니다.',
    desc_en: 'Breaks through limits by directly connecting the brain with the AI Agent system.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('lt_regen_plus'), getItemEffect('lt_recovery'), getRndItemBucket]
  },
  {
    id: 'sailing_yacht',
    name_ko: '여가용 요트',
    name_en: 'Sailing Yacht',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '⛵',
    class: 'Item',
    tier: 'T5',
    price: 215000,
    desc_ko: '요즘은 볼 수 없는 돛이 달린 여가용 요트, 느긋함을 느낄 수 있습니다.',
    desc_en: 'A leisure yacht with a sail wrapped in nostalgia, you can feel the relaxation.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('four_of_a_kind_master'), getItemEffect('stemina_regen'), getItemEffect('time_bank_plus')]
  },
  {
    id: 'khamsa',
    name_ko: '파티마의 손',
    name_en: 'Khamsa / Hand of Fatima',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🪬',
    class: 'Item',
    tier: 'T5',
    price: 275000,
    desc_ko: '이슬람교, 유대교, 불교, 기독교를 포함한 여러 종교에 중요한 고대 상징이며 행운, 보호, 인도, 여성의 힘, 믿음을 의미합니다.',
    desc_en: 'An ancient symbol important to several religions, representing luck, protection, guidance, feminine power, and faith.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('showdown_lose_refund'), getItemEffect('showdown_lose_refund'), getItemEffect('showdown_lose_refund')]
  },
  {
    id: 'CD',
    name_ko: 'CD',
    name_en: 'CD',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '💿',
    class: 'Item',
    tier: 'T5',
    price: 213500,
    editable: false,
    desc_ko: '이거 컵 받침대 아니였나요?',
    desc_en: 'Wasn\'t this a coaster?',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('lt_recovery'), getItemEffect('lt_recovery'), getItemEffect('lt_recovery')]
  },
  {
    id: 'titanium_insurance_policy',
    name_ko: '티타늄 보험 증권',
    name_en: 'Titanium Insurance Policy',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '📜',
    class: 'Item',
    tier: 'T5',
    price: 320000,
    desc_ko: '세상 그 어떤 파산도 당신을 멈출 수 없습니다.',
    desc_en: 'No bankruptcy in the world can stop you.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('emergency_fund'), getItemEffect('emergency_fund'), getItemEffect('rake_reduction')]
  },
  {
    id: 'golden_dragon_statue',
    name_ko: '황금 용 조각상',
    name_en: 'Golden Dragon Statue',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🐉',
    class: 'Item',
    tier: 'T5',
    price: 280000,
    desc_ko: '팟을 삼키는 용의 기운이 승리를 가져옵니다.',
    desc_en: 'The aura of a dragon swallowing the pot brings victory.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('buy_in_multiply'), getItemEffect('pot_bonus'), getItemEffect('pot_bonus')]
  },
  {
    id: 'golden_hand_statue',
    name_ko: '황금손 조각상',
    name_en: 'Golden Hand Statue',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🖐️',
    class: 'Item',
    tier: 'T5',
    price: 310000,
    desc_ko: '팟을 가져올 때 더 많은 칩이 따라오게 유혹합니다.',
    desc_en: 'Tempts more chips to follow when you bring in the pot.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('golden_touch'), getItemEffect('golden_touch'), getItemEffect('golden_touch')]
  },
  {
    id: 'star_of_africa',
    name_ko: '스타 오브 아프리카',
    name_en: 'Star of Africa',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '💎',
    class: 'Item',
    tier: 'T5',
    price: 380000,
    desc_ko: '세계에서 가장 큰 "자연산" 다이몬드 입니다! ...요즘은 더 이상 의미없긴 하지만요!',
    desc_en: 'The largest "natural" diamond in the world! ...Although it doesn\'t mean much anymore these days!',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('allin_insurance'), getItemEffect('diamond_collector'), getRndItemBucket]
  },
  {
    id: 'loan_shark_funding',
    name_ko: '악덕 대부업자의 대출자금',
    name_en: 'Loan Shark\'s Funds',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '💰',
    class: 'Item',
    tier: 'T5',
    price: 210000,
    desc_ko: '파산을 하셨나요? 걱정 마세요. 더 큰 돈으로 따서 갚으면 그만입니다.',
    desc_en: 'Did you go bankrupt? Don\'t worry. Just win with bigger money and pay it back.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('buy_in_multiply'), getItemEffect('buy_in_multiply'), getItemEffect('emergency_fund')]
  },
  {
    id: 'casino_insider',
    name_ko: '카지노 관계자',
    name_en: 'Casino Insider',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🤵',
    class: 'Item',
    tier: 'T5',
    price: 330000,
    desc_ko: '카지노 관계자는 당연하게도 카지노 시설을 손님보다 저렴하게 이용가능합니다.',
    desc_en: 'Casino insiders can naturally use casino facilities cheaper than guests.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('rake_reduction'), getItemEffect('rake_reduction'), getItemEffect('rake_reduction')]
  },
  {
    id: 'blind_maker',
    name_ko: '장님 제조기',
    name_en: 'Blind Maker',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🔦',
    class: 'Item',
    tier: 'T5',
    price: 360000,
    desc_ko: '다른 세계에선 엔티티의 눈을 멀게 하는데 쓰였다고 합니다.\n여기선 블라인드를 막는 데 사용됩니다.',
    desc_en: 'They say it was used to blind "Entity" in another world.\nHere, it\'s used to block blinds.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('blind_discount'), getItemEffect('blind_discount'), getItemEffect('blind_discount')]
  },
  {
    id: 'universal_membership_card',
    name_ko: '범우주 카지노 멤버십 카드',
    name_en: 'Universal Casino Membership Card',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '💳',
    class: 'Item',
    tier: 'T5',
    price: 430000,
    desc_ko: '은하계 그 어느 카지노에서도 상상 초월의 우대를 받습니다.',
    desc_en: 'Receive unimaginable preferential treatment at any casino in the galaxy.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('rake_reduction'), getItemEffect('buy_in_multiply'), getItemEffect('blind_discount')]
  },
  {
    id: 'ev_recovery_core',
    name_ko: 'EV 복구 코어',
    name_en: 'EV Recovery Core',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🛑',
    class: 'Item',
    tier: 'T5',
    price: 260000,
    desc_ko: '완벽한 백업 시스템을 통해 잘못된 결정으로 인한 -EV를 복구합니다.',
    desc_en: 'Recovers -EV caused by wrong decisions through a perfect backup system.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('quantum_fold'), getItemEffect('quantum_fold'), getItemEffect('quantum_fold')]
  },
  {
    id: 'atomic_clock_stabilizer',
    name_ko: '원자시계 안정기',
    name_en: 'Atomic Clock Stabilizer',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '⌛',
    class: 'Item',
    tier: 'T5',
    price: 415000,
    desc_ko: '우주의 시간을 기준으로 연산을 동기화하여 시스템의 안정을 돕습니다.',
    desc_en: 'Helps stabilize the system by synchronizing calculations based on cosmic time.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('lt_regen_plus'), getItemEffect('lt_regen_plus'), getItemEffect('time_bank_plus')]
  },
  {
    id: 'reincarnation_protocol',
    name_ko: '환생 프로토콜',
    name_en: 'Reincarnation Protocol',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '𓋹',
    class: 'Item',
    tier: 'T5',
    price: 240000,
    desc_ko: '죽음(파산)은 새로운 시작에 불과함을 코드로 증명합니다.',
    desc_en: 'Proves through code that death (bankruptcy) is but a new beginning.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('emergency_fund'), getItemEffect('emergency_fund'), getRndItemBucket]
  },

  {
    id: 'casino_insider_nemesis',
    name_ko: '불법 카지노 관계자의 천적',
    name_en: 'Nemesis of Illegal Casino Insiders',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '👹',
    class: 'Item',
    tier: 'T5',
    price: 305000,
    desc_ko: '불법 카지노 관계자들은 그의 이름만 들어도 치가 떨립니다.',
    desc_en: 'Illegal casino insiders tremble at the mere mention of his name.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('rake_reduction'), getItemEffect('rake_reduction'), getItemEffect('blind_discount')]
  },
  {
    id: 'monopoly_pass',
    name_ko: '독점 거래 허가권',
    name_en: 'Monopoly Pass',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '📜',
    class: 'Item',
    tier: 'T5',
    price: 435000,
    desc_ko: '시장의 모든 아이템을 당신만이 누릴 수 있는 특가로 제공받습니다.',
    desc_en: 'Receive all items on the market at a special price that only you can enjoy.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('loyalty_card'), getItemEffect('loyalty_card'), getItemEffect('loyalty_card')]
  },
  {
    id: 'wpt_championship_medal',
    name_ko: 'WPT 우승 메달',
    name_en: 'WPT Championship Medal',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🏅',
    class: 'Item',
    tier: 'T5',
    price: 215000,
    desc_ko: '이 메달을 보여주는 것만으로도 다양한 혜택을 받을 겁니다.',
    desc_en: 'Just showing this medal will grant you various benefits.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('buy_in_multiply'), getItemEffect('blind_discount'), getItemEffect('rake_reduction')]
  },
  {
    id: 'movie_rounders_dvd',
    name_ko: '라운더스 DVD 소장판',
    name_en: 'Rounders DVD Collector\'s Edition',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '📀',
    class: 'Item',
    tier: 'T5',
    price: 370000,
    desc_ko: '옛날이나 지금이나 포커을 플레이하는 방식은 크게 바뀌지 않은거 같습니다.',
    desc_en: 'It seems the way poker is played hasn\'t changed much from the past to now.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('double_down'), getItemEffect('golden_touch'), getItemEffect('failure_is_mother_of_success')]
  },
  {
    id: 'flush_master_ring',
    name_ko: '플러시 마스터 링',
    name_en: 'Flush Master Ring',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '💍',
    class: 'Item',
    tier: 'T5',
    price: 420000,
    desc_ko: '같은 색상의 카드들이 모일 때, 진정한 힘이 깨어납니다.',
    desc_en: 'When cards of the same suit gather, true power awakens.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('flush_master'), getRndItemBucket, getRndItemBucket]
  },
  {
    id: 'full_house_blueprint',
    name_ko: '풀하우스 설계도',
    name_en: 'Full House Blueprint',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🏗️',
    class: 'Item',
    tier: 'T5',
    price: 480000,
    desc_ko: '완벽한 조화를 이루는 핸드로 승리하는 비결을 담고 있습니다.',
    desc_en: 'Contains the secret to winning with a perfectly harmonious hand.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('full_house_master'), getRndItemBucket, getRndItemBucket]
  },

  // --- T6 items (Epic + 2 Random, 500000+ CR) ---
  {
    id: 'fusion_core_mini',
    name_ko: '소형 융합 코어',
    name_en: 'Mini Fusion Core',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '☢️',
    class: 'Item',
    tier: 'T6',
    price: 1990000,
    desc_ko: '작은 도시 절반을 밝힐 에너지를 에이전트에 집중시킵니다. 인류의 미래보다 당신의 성공이 더 중요하니까요.',
    desc_en: 'Focuses enough energy to light up half a small city into the Agent. Because your success is more important than humanity\'s future.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('lt_regen_plus'), getItemEffect('lt_regen_plus'), getItemEffect('lt_regen_plus')]
  },
  {
    id: 'card_of_the_card_shark',
    name_ko: '타짜의 화투',
    name_en: 'Card Shark\'s Hwatu',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🎴',
    class: 'Item',
    tier: 'T6',
    price: 2600000,
    desc_ko: '동작 그만, 밑장 빼기냐?',
    desc_en: 'Hold it right there, are you dealing from the bottom?',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('ghost_bet'), getItemEffect('golden_touch'), getRndItemBucket]
  },
  {
    id: 'destiny_rewriter',
    name_ko: '운명 변조기',
    name_en: 'Destiny Rewriter',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '✍️',
    class: 'Item',
    tier: 'T6',
    price: 2200000,
    desc_ko: '이미 정해진 카드의 운명조차 당신의 뜻대로 바꿉니다.',
    desc_en: 'Alters even the predetermined fate of the cards to your will.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('quantum_luck'), getRndItemBucket, getRndItemBucket]
  },
  // {
  //   id: 'golden_empire_mainframe',
  //   name: '황금 제국 메인프레임',
  //   icon: '🏰',
  //   class: 'Item',
  //   tier: 'T6',
  //   price: 1600000,
  //   desc: '제국의 부가 집적된 거대 연산 시스템입니다.',
  //   effects: [getItemEffect('golden_touch'), getRndItemBucket, getRndItemBucket]
  // },
  {
    id: 'serendipity_node',
    name_ko: '우연한 행운의 노드',
    name_en: 'Serendipity Node',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🍀',
    class: 'Item',
    tier: 'T6',
    price: 2100000,
    desc_ko: '모든 우연을 필연적인 승리로 연결합니다.',
    desc_en: 'Connects all coincidences into inevitable victory.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('quantum_luck'), getItemEffect('quantum_luck'), getRndItemBucket]
  },
  {
    id: 'code_of_creation',
    name_ko: '창조의 소스 코드',
    name_en: 'Source Code of Creation',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🧬',
    class: 'Item',
    tier: 'T6',
    price: 3000000,
    desc_ko: '이 세계를 구성하는 근원적인 코드에 접근합니다.',
    desc_en: 'Accesses the fundamental code that constructs this world.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getRndItemBucket, getRndItemBucket, getRndItemBucket]
  },
  // {
  //   id: 'alchemists_ultimate_vial',
  //   name: '연금술사의 궁극 시약',
  //   icon: '🧪',
  //   class: 'Item',
  //   tier: 'T6',
  //   price: 1700000,
  //   desc: '한 방울만으로도 평범한 데이터를 황금으로 바꿉니다.',
  //   effects: [getItemEffect('golden_touch'), getRndItemBucket, getRndItemBucket]
  // },
  {
    id: 'miracle_worker_script',
    name_ko: '기적 구현 스크립트',
    name_en: 'Miracle Worker Script',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '✨',
    class: 'Item',
    tier: 'T6',
    price: 2400000,
    desc_ko: '확률적으로 불가능한 일들을 현실로 만들어냅니다.',
    desc_en: 'Makes probabilistically impossible things a reality.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('straight_flush_master'), getItemEffect('quantum_luck'), getItemEffect('golden_touch')]
  },
  {
    id: 'deus_ex_machina_mod',
    name_ko: '데우스 엑스 마키나',
    name_en: 'Deus Ex Machina',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🤖',
    class: 'Item',
    tier: 'T6',
    price: 2600000,
    desc_ko: '절체절명의 순간, 기계 신이 강림하여 운명을 바꿉니다.',
    desc_en: 'In a desperate moment, the machine god descends and changes destiny.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('quantum_luck'), getItemEffect('quantum_luck'), getItemEffect('golden_touch')]
  },

  {
    id: 'aurum_processor_z',
    name_ko: '오럼 프로세서 Z',
    name_en: 'Aurum Processor Z',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '⚡',
    class: 'Item',
    tier: 'T6',
    price: 2000000,
    desc_ko: '초고속 연산을 통해 모든 고부가 가치 정보를 선점합니다.',
    desc_en: 'Preempts all high value-added information through ultra-high-speed processing.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('club_collector'), getItemEffect('spade_collector'), getItemEffect('heart_collector')]
  },
  {
    id: 'destiny_slot_machine',
    name_ko: '운명의 슬롯 머신',
    name_en: 'Destiny Slot Machine',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🎰',
    class: 'Item',
    tier: 'T6',
    price: 2250000,
    desc_ko: '운명과 벌이는 마지막 도박에서 반드시 승리하게 해줍니다.',
    desc_en: 'Ensures victory in the final gamble against fate.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('omen'), getItemEffect('lucky_7_collector'), getRndItemBucket]
  },
  {
    id: 'synapse_reading_protocol',
    name_ko: '시냅스 리딩 프로토콜',
    name_en: 'Synapse Reading Protocol',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '👁️',
    class: 'Item',
    tier: 'T6',
    price: 880000,
    desc_ko: '상대방의 생각을 꿰뚫어 봅니다...',
    desc_en: 'Sees through the opponent\'s thoughts...',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('synapse_reading'), getItemEffect('time_bank_plus'), getItemEffect('time_bank_plus')]
  },
  {
    id: 'royal_flush_crown',
    name_ko: '왕실 왕관',
    name_en: 'Royal Crown',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '👑',
    class: 'Item',
    tier: 'T6',
    price: 950000,
    desc_ko: '왕의 귀환. 최고의 족보로 최고의 명예를 누리십시오.',
    desc_en: 'Return of the King. Enjoy the highest honor with the best hand.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('royal_flush_master'), getRndItemBucket, getRndItemBucket]
  },
  {
    id: 'guardian_angel_program',
    name_ko: '수호천사 데몬',
    name_en: 'Guardian Angel Program',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '👼',
    class: 'Item',
    tier: 'T6',
    price: 770000,
    desc_ko: '보이지 않는 곳에서 당신의 칩을 지켜주는 프로그램입니다.',
    desc_en: 'A program that protects your chips from unseen places.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [getItemEffect('allin_insurance'), getItemEffect('allin_insurance'), getItemEffect('allin_insurance')]
  },
];

export const getItemById = (id) => {
  return ITEM_DATA.find(item => item.id === id);
};

export const materializeItem = (baseItem) => {
  if (!baseItem) return null;

  // Use Object.create to preserve getters from baseItem while allowing instance-specific overrides
  const instance = Object.create(baseItem);
  instance.id = baseItem.id;
  instance.instanceId = getinstanceId(baseItem);

  if (baseItem.effects) {
    const effectMap = {};
    const merged = [];

    baseItem.effects.forEach(eff => {
      const resolved = (typeof eff === 'function') ? eff() : eff;
      if (!resolved) return;

      if (effectMap[resolved.id]) {
        try {
          effectMap[resolved.id].value += resolved.value;
        } catch (e) {
          // Ignore if value is a getter-only property. 
          // Getter-based dynamic values will just return their computed value.
        }
      } else {
        // Clone object and preserve getter descriptors (like 'desc')
        const descriptors = Object.getOwnPropertyDescriptors(resolved);
        const clone = Object.defineProperties({}, descriptors);
        effectMap[resolved.id] = clone;
        merged.push(clone);
      }
    });

    instance.effects = merged;
  }

  return instance;
};

export const restoreItem = (savedItem) => {
  if (!savedItem) return savedItem;

  let id = savedItem.id;
  if (!id && savedItem.instanceId) {
    // Extract `id` from `instanceId` (format: id_timestamp_random) by removing the last 2 segments
    const parts = savedItem.instanceId.split('_');
    if (parts.length > 2) {
      parts.pop(); // remove random str
      parts.pop(); // remove timestamp
      id = parts.join('_');
    }
  }

  if (!id) return savedItem;

  const baseItem = getItemById(id);
  if (!baseItem) return savedItem;

  const restored = Object.create(baseItem);
  restored.id = id;
  Object.keys(savedItem).forEach(key => {
    // Avoid overwriting prototype getters that were serialized
    if (key !== 'name' && key !== 'desc' && key !== 'effects') {
      try {
        restored[key] = savedItem[key];
      } catch (e) {
        console.warn(`Failed to restore property ${key}: ${e}`);
        // Ignore errors when trying to overwrite getter-only properties
      }
    }
  });

  if (savedItem.effects) {
    restored.effects = savedItem.effects.map(savedEff => {
      const baseEff = getItemEffect(savedEff.id);
      if (baseEff) {
        const effRestored = Object.create(baseEff);
        Object.keys(savedEff).forEach(k => {
          if (k !== 'name' && k !== 'desc' && savedEff[k] !== undefined) {
            try {
              effRestored[k] = savedEff[k];
            } catch (e) {
              console.warn(`Failed to restore property ${k}: ${e}`);
              // Ignore errors when trying to overwrite getter-only properties (like 'value')
            }
          }
        });
        return effRestored;
      }
      return savedEff;
    });
  }

  return restored;
};

export const hydrateStoreItems = () => {
  if (store.shop && Array.isArray(store.shop.items)) {
    store.shop.items = store.shop.items.map(item => restoreItem(item));
  }
  if (Array.isArray(store.ownedProtectors)) {
    store.ownedProtectors = store.ownedProtectors.map(item => restoreItem(item));
  }
  if (store.equippedProtector) {
    store.equippedProtector = restoreItem(store.equippedProtector);
  }
};
export const getinstanceId = (baseItem) => `${baseItem.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
