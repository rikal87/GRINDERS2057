import { getItemEffect, getRndItemBucket } from "./itemsEffect";
import { store } from './store.js';
import { ITEM_EFFECT_ID } from './constants.js';
export const ITEM_ID = {
  ADVANCED_EQUITY_CALC: 'advanced_equity_calc',
  ALGORITHMIC_REBATE_TOOL: 'algorithmic_rebate_tool',
  ALLIN_INSURANCE_PLUS: 'allin_insurance_plus',
  ANCIENT_POT: 'ancient_pot',
  ATOMIC_CLOCK_STABILIZER: 'atomic_clock_stabilizer',
  AURUM_PROCESSOR_Z: 'aurum_processor_z',
  BACKUP_BATTERY_SET: 'backup_battery_set',
  BLACK_CONSUMER: 'black_consumer',
  BLACK_MARKET_COURIER_BAG: 'black_market_courier_bag',
  BLACKJACK_SEAL: 'blackjack_seal',
  BLIND_FOLDED_MONK_STATUE: 'blind_folded_monk_statue',
  BLIND_MAKER: 'blind_maker',
  BROKEN_COMPASS: 'broken_compass',
  CAPITALISTS_TOP_HAT: 'capitalists_top_hat',
  CARD_OF_THE_CARD_SHARK: 'card_of_the_card_shark',
  CASINO_INSIDER: 'casino_insider',
  CASINO_INSIDER_NEMESIS: 'casino_insider_nemesis',
  CASINO_PROMOTION_INFO_COLLECTOR: 'casino_promotion_info_collector',
  CD: 'CD',
  CHIPS: 'chips',
  CLUB_MEMBERSHIP: 'club_membership',
  CODE_OF_CREATION: 'code_of_creation',
  CRYO_MINT_DISPENSER: 'cryo_mint_dispenser',
  CRYPTO_COIN_REPLICA: 'crypto_coin_replica',
  CRYSTAL_WINE_GLASS: 'crystal_wine_glass',
  CYBER_PET_COLLAR: 'cyber_pet_collar',
  DECRYPTED_TAX_FILE: 'decrypted_tax_file',
  DESTINY_SLOT_MACHINE: 'destiny_slot_machine',
  DOUBLE_BUY_IN_TICKET: 'double_buy_in_ticket',
  EIFFEL_TOWER: 'eiffel_tower',
  EMERGENCY_EXIT_HAMMER: 'emergency_exit_hammer',
  EMERGENCY_RESERVES: 'emergency_reserves',
  EQUITY_EMERGENCY_ALARM: 'equity_emergency_alarm',
  EV_RECOVERY_CORE: 'ev_recovery_core',
  FAILURE_PHILOSOPHY: 'failure_philosophy',
  FLOPPY_DISK: 'floppy_disk',
  FLUSH_MASTER_RING: 'flush_master_ring',
  FOLDING_FAN: 'folding_fan',
  FORGED_COUPON: 'forged_coupon',
  FULL_HOUSE_BLUEPRINT: 'full_house_blueprint',
  FUSION_CORE_MINI: 'fusion_core_mini',
  OLD_VHS_TAPE: 'old_vhs_tape',
  GOLDEN_DRAGON_STATUE: 'golden_dragon_statue',
  GOLDEN_HAND_STATUE: 'golden_hand_statue',
  GOLDEN_MIRROR: 'golden_mirror',
  GUARDIAN_ANGEL_PROGRAM: 'guardian_angel_program',
  HIGH_ROLLER_BADGE: 'high_roller_badge',
  HOLDEM_HOUSE_MEMBERSHIP: 'holdem_house_membership',
  HOLO_PROJECTED_FLOWER: 'holo_projected_flower',
  JACKPOT_SEED_DATA: 'jackpot_seed_data',
  KHAMSA: 'khamsa',
  LIFE_SAVER_BUOY: 'life_saver_buoy',
  LIQUID_NITROGEN_COOLING: 'liquid_nitrogen_cooling',
  LOADED_DICE: 'loaded_dice',
  LOAN_SHARK_FUNDING: 'loan_shark_funding',
  LOW_STACK_BATTERY: 'low_stack_battery',
  LUCK_OF_THE_DRAW_COIN: 'luck_of_the_draw_coin',
  LUCKY_CAT_GOLD: 'lucky_cat_gold',
  LUCKY_CHARM: 'lucky_charm',
  MASK_OF_JOY_AND_DESPAIR: 'mask_of_joy_and_despair',
  MERCHANTS_SECRET_HANDSHAKE: 'merchants_secret_handshake',
  MIRACLE_WORKER_SCRIPT: 'miracle_worker_script',
  MONOPOLY_PASS: 'monopoly_pass',
  MOVIE_ROUNDERS_DVD: 'movie_rounders_dvd',
  NEURAL_LINK_V3: 'neural_link_v3',
  NEURO_SYNC_HEADBAND: 'neuro_sync_headband',
  OLD_PHONE: 'old_phone',
  OLD_STOPWATCH: 'old_stopwatch',
  OLIVE_BRANCH: 'olive_branch',
  ORBIT_LOUNGE_NETWORK_HACKING: 'orbit_lounge_network_hacking',
  PHOENIX_PROTOCOL: 'phoenix_protocol',
  PRISMATIC_ACHIEVEMENT_CARD: 'prismatic_achievement_card',
  QUANTUM_CRYPTO_WALLET: 'quantum_crypto_wallet',
  QUANTUM_POCKET_WATCH: 'quantum_pocket_watch',
  QUICK_FOLD_MANUAL: 'quick_fold_manual',
  REINCARNATION_PROTOCOL: 'reincarnation_protocol',
  ROGUE_AI_FRAGMENT: 'rogue_ai_fragment',
  ROLLER_SKATES: 'roller_skates',
  ROSARY: 'rosary',
  ROYAL_FLUSH_CROWN: 'royal_flush_crown',
  ROYAL_ROOM_INVITE: 'royal_room_invite',
  RUSTY_PAIR_PENDANT: 'rusty_pair_pendant',
  SAD_EYES: 'sad_eyes',
  SAILING_YACHT: 'sailing_yacht',
  SCRAP_COLLECTOR_GLOVE: 'scrap_collector_glove',
  SECOND_CHANCE_SCRIPT_V2: 'second_chance_script_v2',
  SMOKE_BREAK: 'smoke_break',
  STAR_OF_AFRICA: 'star_of_africa',
  STATUE_OF_LIBERTY: 'statue_of_liberty',
  STONK: 'stonk',
  SUCKER: 'sucker',
  SYNAPSE_READING_PROTOCOL: 'synapse_reading_protocol',
  SYNTHETIC_COFFEE: 'synthetic_coffee',
  TAX_EVASION_MANUAL: 'tax_evasion_manual',
  TAX_HAVEN_VPN: 'tax_haven_vpn',
  THE_BUNKER_KEY: 'the_bunker_key',
  TITANIUM_INSURANCE_POLICY: 'titanium_insurance_policy',
  TO_THE_MARS_ROCKET: 'to_the_mars_rocket',
  UNDERGROUND_BAR_INVITE: 'underground_bar_invite',
  UNIVERSAL_MEMBERSHIP_CARD: 'universal_membership_card',
  VICTORY_STREAK_FLAG: 'victory_streak_flag',
  VIP_LOUNGE_KEYCARD: 'vip_lounge_keycard',
  WPT_CHAMPIONSHIP_MEDAL: 'wpt_championship_medal',
}
export const ITEM_DATA = [
  // --- T1 items (Common, 1000 - 5000 CR) ---
  {
    id: ITEM_ID.TO_THE_MARS_ROCKET,
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
    effects: [(ITEM_EFFECT_ID.XP_BOOST)]
  },

  {
    id: ITEM_ID.SUCKER,
    name_ko: '호구',
    name_en: 'Sucker',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🧐',
    class: 'Item',
    tier: 'T1',
    price: 2000,
    editable: false,
    desc_ko: '"예림이, 그 패 봐봐. 장이지?"',
    desc_en: '"Check the card, Yerim. It\'s a Dime, for sure."',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.SHOW_ME_YOUR_BLUFF)]
  },
  {
    id: ITEM_ID.CASINO_PROMOTION_INFO_COLLECTOR,
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
    effects: [(ITEM_EFFECT_ID.BLIND_DISCOUNT)]
  },
  {
    id: ITEM_ID.BROKEN_COMPASS,
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
    effects: [(ITEM_EFFECT_ID.SESSION_PROFIT_BONUS)]
  },
  {
    id: ITEM_ID.OLD_VHS_TAPE,
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
    effects: [(ITEM_EFFECT_ID.LT_RECOVERY)]
  },
  {
    id: ITEM_ID.SYNTHETIC_COFFEE,
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
    effects: [(ITEM_EFFECT_ID.STAMINA_REGEN)]
  },

  {
    id: ITEM_ID.OLD_STOPWATCH,
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
    effects: [(ITEM_EFFECT_ID.TIME_BANK_PLUS)]
  },
  {
    id: ITEM_ID.CRYPTO_COIN_REPLICA,
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
    effects: [(ITEM_EFFECT_ID.CHIP_ROUNDING)]
  },
  {
    id: ITEM_ID.SAD_EYES,
    name_ko: '슬픈 눈망울',
    name_en: 'Sad Eyes',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🥺',
    class: 'Item',
    tier: 'T1',
    price: 1750,
    editable: false,
    desc_ko: '승자에게 자비를 빌어 보세요, 혹시 아나요? 차비라도 줄지?',
    desc_en: 'Beg for mercy from the winner, who knows? Maybe they\'ll give you bus fare.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.SHOWDOWN_LOSE_REFUND)]
  },
  {
    id: ITEM_ID.SMOKE_BREAK,
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
    effects: [(ITEM_EFFECT_ID.SMOKE_BREAK)]
  },
  {
    id: ITEM_ID.FAILURE_PHILOSOPHY,
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
    effects: [(ITEM_EFFECT_ID.FAILURE_IS_MOTHER_OF_SUCCESS)]
  },
  {
    id: ITEM_ID.ROLLER_SKATES,
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
    effects: [(ITEM_EFFECT_ID.OUTKICKED)]
  },
  {
    id: ITEM_ID.RUSTY_PAIR_PENDANT,
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
    effects: [(ITEM_EFFECT_ID.PAIR_MASTER)]
  },

  // --- T2 items (Uncommon, 7500 - 15000 CR) ---
  {
    id: ITEM_ID.HOLO_PROJECTED_FLOWER,
    name_ko: '홀로그램 꽃',
    name_en: 'Holo-Projected Flower',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🌸',
    class: 'Item',
    tier: 'T2',
    price: 9000,
    desc_ko: '보고 있으면 마음이 편안해지며 자신감이 샘솟습니다.',
    desc_en: 'Looking at it puts your mind at ease and fills you with confidence.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.LT_REGEN_PLUS)]
  },
  {
    id: ITEM_ID.TAX_EVASION_MANUAL,
    name_ko: '합법적(?) 하우스 절세 비법',
    name_en: 'Legal(?) House Tax Evasion Manual',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '📄',
    class: 'Item',
    tier: 'T2',
    price: 7500,
    desc_ko: '하우스의 수수료를 아끼는 기발한 방법들이 적혀 있습니다.',
    desc_en: 'Contains ingenious ways to save on the House\'s rake.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.RAKE_REDUCTION)]
  },
  {
    id: ITEM_ID.LIQUID_NITROGEN_COOLING,
    name_ko: '액체 질소 냉각 시스템',
    name_en: 'Liquid Nitrogen Cooling System',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '❄️',
    class: 'Item',
    tier: 'T2',
    price: 10000,
    desc_ko: '극저온의 냉각으로 패배의 열기를 식혀줍니다.',
    desc_en: 'Cools down the heat of defeat with cryogenic cooling.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.COOLER)]
  },
  {
    id: ITEM_ID.UNDERGROUND_BAR_INVITE,
    name_ko: '지하 바 암호수첩',
    name_en: 'Underground Bar Cipher Book',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '📒',
    class: 'Item',
    tier: 'T2',
    price: 10000,
    isConsumable: true,
    isAccessKey: true,
    desc_ko: '매일 바뀌는 암구호보다 여기 술에 물 타는 비율이 더 자주 바뀔걸요?',
    desc_en: 'I bet the ratio of water in their drinks changes more often than their daily passwords.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.UNDERGROUND_BAR_INVITE)]
  },
  {
    id: ITEM_ID.CLUB_MEMBERSHIP,
    name_ko: '클럽 회원 계정',
    name_en: 'Club Membership Account',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🆔',
    class: 'Item',
    tier: 'T3',
    price: 25000,
    isConsumable: true,
    isAccessKey: true,
    desc_ko: '불법으로 위조되었지만, 이제 당당하게 어깨 피고 들어가세요.',
    desc_en: 'It\'s an illegal forgery, but now you can walk in with your shoulders squared.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.CLUB_MEMBERSHIP)]
  },
  {
    id: ITEM_ID.THE_BUNKER_KEY,
    name_ko: '"더 벙커" 복제 열쇠',
    name_en: 'Duplicate Key to "The Bunker"',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🔑',
    class: 'Item',
    tier: 'T4',
    price: 50000,
    isConsumable: true,
    isAccessKey: true,
    desc_ko: '원래는 KBT 조직들만 가지고 있는 열쇠인데, 누군가 복제해서 암시장에 팔고 있습니다.',
    desc_en: 'Originally a key held only by KBT syndicate members, someone duplicated it and is selling it on the black market.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.THE_BUNKER_KEY)]
  },
  {
    id: ITEM_ID.HOLDEM_HOUSE_MEMBERSHIP,
    name_ko: '홀덤 하우스 회원 뱃지',
    name_en: 'Hold\'em House Membership Badge',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '⚜️',
    class: 'Item',
    tier: 'T5',
    price: 100000,
    isConsumable: true,
    isAccessKey: true,
    desc_ko: '뱃지 하나 달았다고 매너 있는 척하지 마세요. 어차피 서로 등쳐먹으러 온 거 다 아니까요.',
    desc_en: 'Don\'t pretend to have manners just because you\'re wearing a badge. We all know you\'re here to hustle each other.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.HOLDEM_HOUSE_MEMBERSHIP)]
  },
  {
    id: ITEM_ID.ROYAL_ROOM_INVITE,
    name_ko: '로열 프라이빗 카드룸 회원 뱃지',
    name_en: 'Royal Private Cardroom Membership Badge',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🔱',
    class: 'Item',
    tier: 'T6',
    price: 250000,
    isConsumable: true,
    isAccessKey: true,
    desc_ko: '이제 당신도 "특별한 소수"가 되었습니다. 지갑이 완전히 털리기 전까지는 말이죠.',
    desc_en: 'Now you, too, are one of the "special few". That is, until your wallet is completely emptied.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.ROYAL_ROOM_INVITE)]
  },

  {
    id: ITEM_ID.EMERGENCY_RESERVES,
    name_ko: '비상 예비금 상자',
    name_en: 'Emergency Reserves Box',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '📦',
    class: 'Item',
    tier: 'T2',
    price: 10000,
    desc_ko: '정말 위험할 때를 대비해 숨겨둔 비상금입니다.',
    desc_en: 'A hidden stash of emergency funds for when things get really dangerous.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.EMERGENCY_FUND)]
  },
  // to-do: change effect reduct tax? or something else?
  // {
  //   id: ITEM_ID.TAX_HAVEN_VPN,
  //   name_ko: '조세 회피처 VPN',
  //   name_en: 'Tax Haven VPN',
  //   get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
  //   icon: '🌐',
  //   class: 'Item',
  //   tier: 'T2',
  //   price: 7000,
  //   desc_ko: '네트워크 위치를 속여 과도한 수수료를 회피합니다.',
  //   desc_en: 'Spoofs your network location to evade excessive fees.',
  //   get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
  //   effects: [(ITEM_EFFECT_ID.RAKE_REDUCTION)]
  // },
  {
    id: ITEM_ID.OLD_PHONE,
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
    effects: [(ITEM_EFFECT_ID.LOYALTY_CARD)]
  },
  {
    id: ITEM_ID.BACKUP_BATTERY_SET,
    name_ko: '백업 배터리 세트',
    name_en: 'Backup Battery Set',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🪫',
    class: 'Item',
    tier: 'T2',
    price: 8000,
    desc_ko: '메인 전원이 나갔을 때를 대비한 든든한 보험입니다.',
    desc_en: 'A solid insurance policy for when the main power goes out.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.LAST_STAND)]
  },
  {
    id: ITEM_ID.QUICK_FOLD_MANUAL,
    name_ko: '쾌속 폴드 지침서',
    name_en: 'Quick Fold Manual',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '📖',
    class: 'Item',
    tier: 'T2',
    price: 11000,
    desc_ko: '포기할 줄 아는 용기가 때로는 더 큰 자본으로 돌아옵니다.',
    desc_en: 'Sometimes the courage to give up returns as even greater capital.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.QUANTUM_FOLD)]
  },
  {
    id: ITEM_ID.BLACKJACK_SEAL,
    name_ko: '블랙잭 인장',
    name_en: 'Blackjack Seal',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '♠',
    class: 'Item',
    tier: 'T2',
    price: 9000,
    desc_ko: 'A와 J의 조합이 가져다주는 전율을 경험하십시오.',
    desc_en: 'Experience the thrill that the combination of A and J brings.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.BLACKJACK_MASTER)]
  },
  {
    id: ITEM_ID.VICTORY_STREAK_FLAG,
    name_ko: '연승의 깃발',
    name_en: 'Win Streak Flag',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🚩',
    class: 'Item',
    tier: 'T2',
    price: 12500,
    desc_ko: '승리의 기세가 꺾이지 않도록 성장을 가속화합니다.',
    desc_en: 'Accelerates growth to ensure your winning momentum isn\'t broken.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.WINNER_MASTER)]
  },
  {
    id: ITEM_ID.CHIPS,
    name_ko: '칩스',
    name_en: 'Chips',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🍟',
    class: 'Item',
    tier: 'T2',
    price: 10000,
    desc_ko: '햄버거랑 물은 안필요하세요?',
    desc_en: 'Don\'t you need a hamburger, and a bottle of water too?',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.SETS_MASTER)]
  },
  {
    id: ITEM_ID.BLACK_CONSUMER,
    name_ko: '블랙 컨슈머',
    name_en: 'Black Consumer',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🤑',
    class: 'Item',
    tier: 'T2',
    price: 20000,
    isConsumable: true,
    desc_ko: '진상 짓으로 암상인과의 관계를 최악으로 만들었습니다.',
    desc_en: 'Made your relationship with the black market dealer the worst with your complaining.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.BLACK_CONSUMER)]
  },
  {
    id: ITEM_ID.LUCK_OF_THE_DRAW_COIN,
    name_ko: '운명의 드로우 동전',
    name_en: 'Coin of Destiny\'s Draw',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🪙',
    class: 'Item',
    tier: 'T2',
    price: 15000,
    desc_ko: '불가능할 것 같은 승리를 당신의 것으로 만듭니다.',
    desc_en: 'Makes a seemingly impossible victory yours.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.QUANTUM_LUCK)]
  },
  {
    id: ITEM_ID.DOUBLE_BUY_IN_TICKET,
    name_ko: '더블 바이인 티켓',
    name_en: 'Double Buy-in Ticket',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🎫',
    class: 'Item',
    tier: 'T3',
    price: 15000,
    desc_ko: 'V.I.P 대우를 받으며 모든 바이인을 두 배로 즐기세요.',
    desc_en: 'Enjoy double the buy-in on everything while receiving V.I.P treatment.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.BUY_IN_MULTIPLY)]
  },
  // --- T3 items (20000 - 50000 CR) ---
  {
    id: ITEM_ID.STONK,
    name_ko: '주쉭',
    name_en: 'Stonk',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🗠',
    class: 'Item',
    tier: 'T3',
    price: 20000,
    editable: false,
    desc_ko: '그가 매수 했습니다, 어떻게 할까요?',
    desc_en: 'He bought? Dump it.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.STONK)]
  },
  {
    id: ITEM_ID.CYBER_PET_COLLAR,
    name_ko: '사이버 펫',
    name_en: 'Cyber Pet',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🐕‍🦺',
    class: 'Item',
    tier: 'T3',
    price: 21500,
    editable: false,
    desc_ko: '충직한 동반자와 함께라면 성장이 빠릅니다. 게다가 거리에서 값진 것을 물어올지도 모르죠.',
    desc_en: 'Growth is swift with a loyal companion. Plus, they might just fetch something valuable from gutters.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.XP_BOOST), (ITEM_EFFECT_ID.CHIP_ROUNDING)]
  },
  {
    id: ITEM_ID.PRISMATIC_ACHIEVEMENT_CARD,
    name_ko: '프리즘 업적 카드',
    name_en: 'Prismatic Achievement Card',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🃏',
    class: 'Item',
    tier: 'T3',
    price: 20000,
    desc_ko: '당신의 모든 승리가 영광스러운 기록으로 남게 됩니다.',
    desc_en: 'All your victories will be left as a glorious record.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.XP_BOOST), (ITEM_EFFECT_ID.XP_BOOST)]
  },
  {
    id: ITEM_ID.LOW_STACK_BATTERY,
    name_ko: '배수의 진 배터리',
    name_en: 'Last Stand Battery',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🪫',
    class: 'Item',
    tier: 'T3',
    price: 30000,
    desc_ko: '궁지에 몰릴수록 더욱 강력한 에너지를 내뿜습니다.',
    desc_en: 'Emits stronger energy the more cornered you are.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.LAST_STAND), (ITEM_EFFECT_ID.LAST_STAND)]
  },
  {
    id: ITEM_ID.FLOPPY_DISK,
    name_ko: '플로피 디스크',
    name_en: 'Floppy Disk',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '💾',
    class: 'Item',
    tier: 'T3',
    price: 35000,
    editable: false,
    desc_ko: '아주 먼 옛날에는 여기에 게임을 분할 압축하여 담았다고 합니다. 웃기죠?',
    desc_en: 'They say a long time ago, people used to split compress and store games on these. Funny, isn\'t it?',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.LT_RECOVERY), (ITEM_EFFECT_ID.LT_RECOVERY)]
  },
  {
    id: ITEM_ID.SCRAP_COLLECTOR_GLOVE,
    name_ko: '고철 수집가 장갑',
    name_en: 'Scrap Collector\'s Glove',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🧤',
    class: 'Item',
    tier: 'T3',
    price: 35000,
    editable: false,
    desc_ko: '더러운 건 싫지만 돈이 되는 건 좋습니다.',
    desc_en: 'I hate things being dirty, but I like things that make money.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.CHIP_ROUNDING), (ITEM_EFFECT_ID.CHIP_ROUNDING)]
  },
  {
    id: ITEM_ID.NEURO_SYNC_HEADBAND,
    name_ko: '뉴로 동기화 머리띠',
    name_en: 'Neuro Sync Headband',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🧠',
    class: 'Item',
    tier: 'T3',
    price: 35000,
    desc_ko: '뇌파를 에이전트와 직접 동기화하여 LT를 빠르게 회복합니다.',
    desc_en: 'Brainwave synchronization with the agent for rapid LT recovery.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.LT_REGEN_PLUS), (ITEM_EFFECT_ID.LT_REGEN_PLUS)]
  },
  {
    id: ITEM_ID.ALLIN_INSURANCE_PLUS,
    name_ko: '세이프 가드 플러스',
    name_en: 'Safe Guard Plus',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🛡️',
    class: 'Item',
    tier: 'T3',
    price: 40000,
    desc_ko: '더 넓은 범위의 손실을 보장해주는 프리미엄 보험입니다.',
    desc_en: 'Premium insurance that guarantees a wider range of losses.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.ALLIN_INSURANCE), (ITEM_EFFECT_ID.ALLIN_INSURANCE)]
  },
  {
    id: ITEM_ID.LIFE_SAVER_BUOY,
    name_ko: '구명튜브',
    name_en: 'Life Saver Buoy',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🛟',
    class: 'Item',
    tier: 'T3',
    price: 35000,
    "desc_ko": '올인이라는 거친 파도 속에서도 당신을 건져 올립니다.',
    "desc_en": 'Even in the rough waves of all-in, it lifts you up.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.ALLIN_INSURANCE), (ITEM_EFFECT_ID.TILT_RECOVERY)]
  },
  {
    id: ITEM_ID.ADVANCED_EQUITY_CALC,
    name_ko: '에쿼티 연산기',
    name_en: 'Advanced Equity Calculator',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '📊',
    class: 'Item',
    tier: 'T3',
    price: 32000,
    "desc_ko": '단순한 확률을 넘어 미래의 분기점까지 계산합니다.',
    "desc_en": 'Calculates not only simple probabilities but also future branch points.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.SESSION_PROFIT_BONUS), (ITEM_EFFECT_ID.QUANTUM_FOLD)]
  },
  {
    id: ITEM_ID.CRYSTAL_WINE_GLASS,
    name_ko: '크리스털 와인잔',
    name_en: 'Crystal Wine Glass',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🍷',
    class: 'Item',
    tier: 'T3',
    price: 25000,
    desc_ko: '당신의 승리에 건배.',
    desc_en: 'Cheers to your victory.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.SESSION_PROFIT_BONUS), (ITEM_EFFECT_ID.WINNER_MASTER)]
  },
  {
    id: ITEM_ID.SECOND_CHANCE_SCRIPT_V2,
    name_ko: '두 번째 찬스 v2',
    name_en: 'Second Chance Script v2',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '✌️',
    class: 'Item',
    tier: 'T3',
    price: 22222,
    desc_ko: '한 번의 실수를 덮어줄 수 있는 더 나은 코드입니다. 한 번의 실수를 덮어줄 수 있는 더 나은 코드입니다!!',
    desc_en: 'Better code that can cover up a single mistake, Better code that can cover up a single mistake!!',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.EMERGENCY_FUND), (ITEM_EFFECT_ID.PAIR_MASTER)]
  },
  {
    id: ITEM_ID.OLIVE_BRANCH,
    name_ko: '올리브 나뭇가지',
    name_en: 'Olive Branch',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🌿',
    class: 'Item',
    tier: 'T3',
    price: 25000,
    isConsumable: true,
    desc_ko: '이제 화해의 손길을 내밀 때인 것 같아요. 당신의 진심을 본다면 그들도 이해해 줄 겁니다.',
    desc_en: 'Maybe it\'s time to offer an olive branch. If they see your sincere remorse, they\'ll likely be more understanding.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.OLIVE_BRANCH)]
  },
  {
    id: ITEM_ID.BLINDFOLDED_MONK_STATUE,
    name_ko: '눈먼 수도승 조각상',
    name_en: 'Blindfolded Monk Statue',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🧘',
    class: 'Item',
    tier: 'T3',
    price: 30000,
    desc_ko: '보이지 않는 것이 때로는 가장 안전합니다.',
    desc_en: 'Sometimes what you can\'t see is the safest.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.BLIND_DISCOUNT), (ITEM_EFFECT_ID.BLIND_DISCOUNT)]
  },
  {
    id: ITEM_ID.CAPITALISTS_TOP_HAT,
    name_ko: '자본주의의 뚜껑',
    name_en: 'Capitalist\'s Top Hat',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🎩',
    class: 'Item',
    tier: 'T3',
    price: 40000,
    desc_ko: '머리 위에 얹힌 이 비싼 장식물은 당신이 멍청한 베팅을 해도 주위 사람들이 "과감한 결단"이라고 칭송하게 만듭니다.',
    desc_en: 'This expensive ornament sitting on your head makes the people around you praise your stupid bets as "bold decisions".',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.WINNER_MASTER), (ITEM_EFFECT_ID.WINNER_MASTER)]
  },
  {
    id: ITEM_ID.ALGORITHMIC_REBATE_TOOL,
    name_ko: '알고리즘 환급 도구',
    name_en: 'Algorithmic Rebate Tool',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '♻️',
    class: 'Item',
    tier: 'T3',
    price: 35000,
    desc_ko: '계산된 손실의 일부를 즉시 복구합니다.',
    desc_en: 'Immediately recovers a portion of calculated losses.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.TILT_RECOVERY), (ITEM_EFFECT_ID.TILT_RECOVERY)]
  },
  {
    id: ITEM_ID.JACKPOT_SEED_DATA,
    name_ko: '잭팟 시드 데이터',
    name_en: 'Jackpot Seed Data',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🌱',
    class: 'Item',
    tier: 'T3',
    price: 30000,
    desc_ko: '큰 행운을 불러올 씨앗 같은 데이터 뭉치입니다.',
    desc_en: 'A clump of data like a seed that will bring great luck.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.EMERGENCY_FUND), (ITEM_EFFECT_ID.SESSION_PROFIT_BONUS)]
  },
  {
    id: ITEM_ID.LUCKY_CAT_GOLD,
    name_ko: '황금 마네키네코',
    name_en: 'Golden Maneki-neko',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🐱',
    class: 'Item',
    tier: 'T3',
    price: 25000,
    editable: false,
    desc_ko: '끊임없이 흔들리는 저 금색 앞발은 행운을 부르는 게 아닙니다. 테이블 위의 칩들을 당신 쪽으로 긁어모으는 기계적인 갈퀴질이죠',
    desc_en: 'That endlessly waving golden paw isn\'t beckoning luck. It\'s a mechanical raking motion, scraping the chips on the table toward you.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.SESSION_PROFIT_BONUS), (ITEM_EFFECT_ID.SESSION_PROFIT_BONUS)]
  },
  {
    id: ITEM_ID.MERCHANTS_SECRET_HANDSHAKE,
    name_ko: '상인의 비밀 암호',
    name_en: 'Merchant\'s Secret Cipher',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🤝',
    class: 'Item',
    tier: 'T3',
    price: 27500,
    desc_ko: '아는 사람만 아는 방식으로 가격을 깎습니다.',
    desc_en: 'Discounts prices in a way only those in the know understand.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.LOYALTY_CARD), (ITEM_EFFECT_ID.SESSION_PROFIT_BONUS)]
  },
  {
    id: ITEM_ID.QUANTUM_CRYPTO_WALLET,
    name_ko: '양자 암호 지갑',
    name_en: 'Quantum Crypto Wallet',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🔒',
    class: 'Item',
    tier: 'T3',
    price: 35000,
    desc_ko: '보안과 수익을 동시에 챙기는 미래형 지갑입니다.',
    desc_en: 'A futuristic wallet that ensures both security and profit.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.RAKE_REDUCTION), (ITEM_EFFECT_ID.BLIND_DISCOUNT)]
  },
  {
    id: ITEM_ID.FOLDING_FAN,
    name_ko: '접이식 부채',
    name_en: 'Folding Fan',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🪭',
    class: 'Item',
    tier: 'T3',
    price: 30000,
    desc_ko: '부채질로 한번으로 느긋함과 우아함 두가지를 동시에 잡습니다.',
    desc_en: 'With a single sweep of the fan, you capture both relaxation and elegance.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.STAMINA_REGEN), (ITEM_EFFECT_ID.STAMINA_REGEN)]
  },
  {
    id: ITEM_ID.MASK_OF_JOY_AND_DESPAIR,
    name_ko: '환희와 절망의 가면',
    name_en: 'Mask of Joy and Despair',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🎭',
    class: 'Item',
    tier: 'T3',
    price: 25000,
    editable: false,
    desc_ko: '비극은 멀리서 보면 희극이라지만, 이 도시는 당신이 어느 쪽에 속해 있든 전혀 개의치 않습니다.',
    desc_en: 'They say tragedy is comedy from afar, but this city doesn\'t care which side you\'re on at all.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.FAILURE_IS_MOTHER_OF_SUCCESS), (ITEM_EFFECT_ID.WINNER_MASTER)]
  },
  // --- T4 items (50000 - 100000 CR) ---
  {
    id: ITEM_ID.LOADED_DICE,
    name_ko: '사기 주사위',
    name_en: 'Loaded Dice',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🎲',
    class: 'Item',
    tier: 'T4',
    price: 66000,
    desc_ko: '이상하게 높은 숫자가 자주 나오는건 기분 탓이겠죠?',
    desc_en: 'It\'s just my imagination that high numbers roll strangely often, right?',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.OMEN), (ITEM_EFFECT_ID.DOUBLE_DOWN)]
  },
  {
    id: ITEM_ID.BLACK_MARKET_COURIER_BAG,
    name_ko: '블랙마켓 배달 가방',
    name_en: 'Black Market Courier Bag',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '💼',
    class: 'Item',
    tier: 'T4',
    price: 65000,
    desc_ko: '배달 사고로 주인을 잃은 서류 가방입니다..',
    desc_en: 'A briefcase that lost its owner due to a delivery accident...',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [ITEM_EFFECT_ID.RND, ITEM_EFFECT_ID.RND]
  },
  {
    id: ITEM_ID.DECRYPTED_TAX_FILE,
    name_ko: '해독된 세무 파일',
    name_en: 'Decrypted Tax File',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '📄',
    class: 'Item',
    tier: 'T4',
    price: 70000,
    desc_ko: '카지노의 탈세 장부 사이에서 뜻밖의 뒷돈을 발견했습니다. 역시 남의 비밀을 파헤치는 것만큼 수익성 높은 비즈니스는 없군요.',
    desc_en: 'Found unexpected black money amidst the casino\'s tax evasion ledgers. Uncovering other people\'s secrets is indeed the most profitable business.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.RAKE_REDUCTION), ITEM_EFFECT_ID.RND]
  },
  {
    id: ITEM_ID.EMERGENCY_EXIT_HAMMER,
    name_ko: '긴급 탈출 망치',
    name_en: 'Emergency Exit Hammer',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🔨',
    class: 'Item',
    tier: 'T4',
    price: 80000,
    desc_ko: '복잡한 수수료 체계를 부수어버립니다.',
    desc_en: 'Smashes the complex fee structures entirely.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.RAKE_REDUCTION), (ITEM_EFFECT_ID.RAKE_REDUCTION)]
  },
  {
    id: ITEM_ID.EQUITY_EMERGENCY_ALARM,
    name_ko: '에퀴티 비상 경보기',
    name_en: 'Equity Emergency Alarm',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🚨',
    class: 'Item',
    tier: 'T4',
    price: 71000,
    editable: false,
    desc_ko: '당신의 에퀴티가 위험에 처했을 때, 자동으로 경보를 울립니다.',
    desc_en: 'Automatically sounds an alarm when your equity is in danger.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.QUANTUM_FOLD), (ITEM_EFFECT_ID.ALLIN_INSURANCE)]
  },
  {
    id: ITEM_ID.FORGED_COUPON,
    name_ko: '위조 쿠폰',
    name_en: 'Forged Coupon',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🎁',
    class: 'Item',
    tier: 'T4',
    price: 100000,
    desc_ko: '들키지만 않는다면 아주 유용한 수단입니다.',
    desc_en: 'It\'s a very useful tool, as long as you don\'t get caught.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.LOYALTY_CARD), (ITEM_EFFECT_ID.LOYALTY_CARD)]
  },
  {
    id: ITEM_ID.GOLDEN_MIRROR,
    name_ko: '황금 거울',
    name_en: 'Golden Mirror',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🪞',
    class: 'Item',
    tier: 'T4',
    price: 80000,
    desc_ko: '거울 속에 비친 당신의 모습보다 둘러싸인 순금 테두리의 가치가 더 높다는 사실에 위안을 얻으세요.',
    desc_en: 'Find comfort in the fact that the solid gold frame around it is worth more than your reflection in the mirror.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.GOLDEN_TOUCH), (ITEM_EFFECT_ID.GOLDEN_TOUCH)]
  },
  {
    id: ITEM_ID.LUCKY_CHARM,
    name_ko: '행운의 부적',
    name_en: 'Lucky Charm',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🧿',
    class: 'Item',
    tier: 'T4',
    price: 72000,
    desc_ko: '과학과 미신이 결합된 최신형 부적입니다.',
    desc_en: 'The latest charm combining science and superstition.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.EMERGENCY_FUND), ITEM_EFFECT_ID.RND]
  },

  {
    id: ITEM_ID.PHOENIX_PROTOCOL,
    name_ko: '피닉스 프로토콜',
    name_en: 'Phoenix Protocol',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🔥',
    class: 'Item',
    tier: 'T4',
    price: 88000,
    desc_ko: '잿더미에서 다시 일어서는 것처럼 초기 자금을 복구합니다.',
    desc_en: 'Recovers initial funds like rising from the ashes.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.EMERGENCY_FUND), (ITEM_EFFECT_ID.EMERGENCY_FUND)]
  },
  {
    id: ITEM_ID.QUANTUM_POCKET_WATCH,
    name_ko: '양자 포켓 워치',
    name_en: 'Quantum Pocket Watch',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '⌚',
    class: 'Item',
    tier: 'T4',
    price: 85000,
    desc_ko: '시간과 운명이 겹치는 찰나의 순간을 포착합니다.',
    desc_en: 'Captures the fleeting moment when time and fate intersect.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.QUANTUM_LUCK), (ITEM_EFFECT_ID.COOLDOWN_REDUCTION)]
  },
  {
    id: ITEM_ID.ROGUE_AI_FRAGMENT,
    name_ko: '탈주 AI의 파편',
    name_en: 'Rogue AI Fragment',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '👾',
    class: 'Item',
    tier: 'T4',
    price: 65000,
    desc_ko: '통제 불가능한 AI가 당신의 시스템을 뒤흔듭니다.',
    desc_en: 'An uncontrollable AI shakes up your system.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.LT_REGEN_PLUS), ITEM_EFFECT_ID.RND]
  },
  {
    id: ITEM_ID.VIP_LOUNGE_KEYCARD,
    name_ko: 'VIP 키카드',
    name_en: 'VIP Lounge Keycard',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '💳',
    class: 'Item',
    tier: 'T4',
    price: 50000,
    desc_ko: '대부분의 카지노에서 최고급 대우를 보장하는 신분 상징입니다.',
    desc_en: 'A status symbol that guarantees premium treatment at most casinos.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.RAKE_REDUCTION), (ITEM_EFFECT_ID.BLIND_DISCOUNT)]
  },

  // --- T5 items (Rare + 2 Random, 125000 - 250000 CR) ---
  {
    id: ITEM_ID.ATOMIC_CLOCK_STABILIZER,
    name_ko: '원자시계 안정기',
    name_en: 'Atomic Clock Stabilizer',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '⌛',
    class: 'Item',
    tier: 'T5',
    price: 125000,
    desc_ko: '우주의 시간을 기준으로 연산을 동기화하여 시스템의 안정을 돕습니다.',
    desc_en: 'Helps stabilize the system by synchronizing calculations based on cosmic time.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.LT_REGEN_PLUS), (ITEM_EFFECT_ID.LT_REGEN_PLUS), (ITEM_EFFECT_ID.TIME_BANK_PLUS)]
  },
  {
    id: ITEM_ID.BLIND_MAKER,
    name_ko: '장님 제조기',
    name_en: 'Blind Maker',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🔦',
    class: 'Item',
    tier: 'T5',
    price: 150000,
    desc_ko: '다른 세계에선 엔티티의 눈을 멀게 하는데 쓰였다고 합니다.\n여기선 블라인드를 막는 데 사용됩니다.',
    desc_en: 'They say it was used to blind "Entity" in another world.\nHere, it\'s used to block blinds.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.BLIND_DISCOUNT), (ITEM_EFFECT_ID.BLIND_DISCOUNT), (ITEM_EFFECT_ID.BLIND_DISCOUNT)]
  },
  {
    id: ITEM_ID.ANCIENT_POT,
    name_ko: '고대 항아리',
    name_en: 'Ancient Pot',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🏺',
    class: 'Item',
    tier: 'T5',
    price: 125000,
    desc_ko: '이 항아리에 깃든 고대의 행운은 과학적으로 증명되지 않았습니다. 하지만 당신의 팟을 키워준다는 소문만은 시장에서 아주 비싸게 팔리죠',
    desc_en: 'The ancient luck dwelling in this pot is not scientifically proven. However, the rumor that it grows your pot sells for a very high price on the market.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.SESSION_PROFIT_BONUS), (ITEM_EFFECT_ID.SESSION_PROFIT_BONUS), (ITEM_EFFECT_ID.SESSION_PROFIT_BONUS)]
  },
  {
    id: ITEM_ID.FUSION_CORE_MINI,
    name_ko: '소형 융합 코어',
    name_en: 'Mini Fusion Core',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '☢️',
    class: 'Item',
    tier: 'T5',
    price: 150000,
    desc_ko: '작은 도시 절반을 밝힐 에너지를 에이전트에 집중시킵니다. 인류의 미래보다 당신의 성공이 더 중요하니까요.',
    desc_en: 'Focuses enough energy to light up half a small city into the Agent. Because your success is more important than humanity\'s future.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.LT_REGEN_PLUS), (ITEM_EFFECT_ID.LT_REGEN_PLUS), (ITEM_EFFECT_ID.LT_REGEN_PLUS)]
  },
  {
    id: ITEM_ID.ROSARY,
    name_ko: '묵주',
    name_en: 'Rosary',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '📿',
    class: 'Item',
    tier: 'T5',
    price: 200000,
    desc_ko: '이걸 쥐고 있다고 해서 무조건 성인이 되는 건 아닙니다. 그저 죄를 지을 때 죄책감을 덜어줄 도구가 하나 늘었을 뿐이죠.',
    desc_en: 'Holding this doesn\'t make you a saint. It just gives you something to squeeze while you\'re breaking all ten commandments.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.ALLIN_INSURANCE), (ITEM_EFFECT_ID.INFAMY_BOOST), (ITEM_EFFECT_ID.DIAMOND_COLLECTOR)]
  },
  {
    id: ITEM_ID.EIFFEL_TOWER,
    name_ko: '에펠탑',
    name_en: 'Eiffel Tower',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🗼',
    class: 'Item',
    tier: 'T5',
    price: 175000,
    desc_ko: '과거 파리의 상징이자 랜드마크"였"습니다. 이제는 초거대 기업의 고출력 송신 안테나로 쓰이고 있습니다.',
    desc_en: '"Was" the symbol and landmark of Paris in the past. Now it\'s used as a high-powered transmission antenna by a megacorp.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.LAST_STAND), (ITEM_EFFECT_ID.LAST_STAND), (ITEM_EFFECT_ID.LAST_STAND)]
  },
  {
    id: ITEM_ID.SUBPRIME_MORTGAGE,
    name_ko: '서브 프라임 모기지',
    name_en: 'Sub Prime Mortgage',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🏚️',
    class: 'Item',
    tier: 'T5',
    price: 275000,
    desc_ko: '모두가 폭탄을 돌리고 있지만, 뭐, 나만 아니면 되겠죠? 안 그래요?',
    desc_en: 'Everyone\'s playing hot potato with a live grenade. But hey, as long as it\'s not me, right?',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [ITEM_EFFECT_ID.STONK, ITEM_EFFECT_ID.STONK, ITEM_EFFECT_ID.STONK]
  },
  {
    id: ITEM_ID.CRYO_MINT_DISPENSER,
    name_ko: '크라이오 민트 디스펜서',
    name_en: 'Cryo Mint Dispenser',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🧊',
    class: 'Item',
    tier: 'T5',
    price: 170000,
    desc_ko: '극도의 시원함으로 잠이 확 깹니다.',
    desc_en: 'The extreme coolness wakes you up instantly.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.STAMINA_REGEN), (ITEM_EFFECT_ID.STAMINA_REGEN), (ITEM_EFFECT_ID.STAMINA_REGEN)]
  },
  {
    id: ITEM_ID.STATUE_OF_LIBERTY,
    name_ko: '자유의 여신상',
    name_en: 'Statue of Liberty',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🗽',
    class: 'Item',
    tier: 'T5',
    price: 230000,
    desc_ko: '모두에게 부자가 될 기회는 공평하게 주어집니다. 다만, 당신의 잔고가 공평하지 않을 뿐이죠',
    desc_en: 'Everyone is given a fair chance to become rich. It\'s just that your bank balance isn\'t fair.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.BUY_IN_MULTIPLY), (ITEM_EFFECT_ID.BUY_IN_MULTIPLY), (ITEM_EFFECT_ID.BUY_IN_MULTIPLY)]
  },
  {
    id: ITEM_ID.NEURAL_LINK_V3,
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
    effects: [(ITEM_EFFECT_ID.LT_REGEN_PLUS), (ITEM_EFFECT_ID.LT_RECOVERY), ITEM_EFFECT_ID.RND]
  },
  {
    id: ITEM_ID.SAILING_YACHT,
    name_ko: '여가용 요트',
    name_en: 'Sailing Yacht',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '⛵',
    class: 'Item',
    tier: 'T5',
    price: 155000,
    desc_ko: '요즘은 볼 수 없는 돛이 달린 여가용 요트, 느긋함을 느낄 수 있습니다.',
    desc_en: 'A leisure yacht with a sail wrapped in nostalgia, you can feel the relaxation.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.FOUR_OF_A_KIND_MASTER), (ITEM_EFFECT_ID.STAMINA_REGEN), (ITEM_EFFECT_ID.TIME_BANK_PLUS)]
  },
  {
    id: ITEM_ID.KHAMSA,
    name_ko: '파티마의 손',
    name_en: 'Khamsa / Hand of Fatima',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🪬',
    class: 'Item',
    tier: 'T5',
    price: 175000,
    desc_ko: '이슬람교, 유대교, 불교, 기독교를 포함한 여러 종교에 중요한 고대 상징이며 행운, 보호, 인도, 여성의 힘, 믿음을 의미합니다.',
    desc_en: 'An ancient symbol important to several religions, representing luck, protection, guidance, feminine power, and faith.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.SHOWDOWN_LOSE_REFUND), (ITEM_EFFECT_ID.SHOWDOWN_LOSE_REFUND), (ITEM_EFFECT_ID.SHOWDOWN_LOSE_REFUND)]
  },
  {
    id: ITEM_ID.CD,
    name_ko: 'CD',
    name_en: 'CD',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '💿',
    class: 'Item',
    tier: 'T5',
    price: 153500,
    editable: false,
    desc_ko: '이거 컵 받침대 아니였나요?',
    desc_en: 'Wasn\'t this a coaster?',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.LT_RECOVERY), (ITEM_EFFECT_ID.LT_RECOVERY), (ITEM_EFFECT_ID.LT_RECOVERY)]
  },
  {
    id: ITEM_ID.TITANIUM_INSURANCE_POLICY,
    name_ko: '티타늄 보험 증권',
    name_en: 'Titanium Insurance Policy',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '📜',
    class: 'Item',
    tier: 'T5',
    price: 220000,
    desc_ko: '세상 그 어떤 파산도 당신을 멈출 수 없습니다.',
    desc_en: 'No bankruptcy in the world can stop you.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.EMERGENCY_FUND), (ITEM_EFFECT_ID.EMERGENCY_FUND), (ITEM_EFFECT_ID.RAKE_REDUCTION)]
  },
  {
    id: ITEM_ID.GOLDEN_DRAGON_STATUE,
    name_ko: '황금 용 조각상',
    name_en: 'Golden Dragon Statue',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🐉',
    class: 'Item',
    tier: 'T5',
    price: 180000,
    desc_ko: '팟을 삼키는 용의 기운이 승리를 가져옵니다.',
    desc_en: 'The aura of a dragon swallowing the pot brings victory.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.BUY_IN_MULTIPLY), (ITEM_EFFECT_ID.SESSION_PROFIT_BONUS), (ITEM_EFFECT_ID.SESSION_PROFIT_BONUS)]
  },
  {
    id: ITEM_ID.GOLDEN_HAND_STATUE,
    name_ko: '황금손 조각상',
    name_en: 'Golden Hand Statue',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🖐️',
    class: 'Item',
    tier: 'T5',
    price: 210000,
    desc_ko: '팟을 가져올 때 더 많은 칩이 따라오게 유혹합니다.',
    desc_en: 'Tempts more chips to follow when you bring in the pot.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.GOLDEN_TOUCH), (ITEM_EFFECT_ID.GOLDEN_TOUCH), (ITEM_EFFECT_ID.GOLDEN_TOUCH)]
  },
  {
    id: ITEM_ID.STAR_OF_AFRICA,
    name_ko: '스타 오브 아프리카',
    name_en: 'Star of Africa',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '💎',
    class: 'Item',
    tier: 'T5',
    price: 190000,
    desc_ko: '세계에서 가장 큰 "자연산" 다이몬드 입니다! ...요즘은 더 이상 의미없긴 하지만요!',
    desc_en: 'The largest "natural" diamond in the world! ...Although it doesn\'t mean much anymore these days!',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.DIAMOND_COLLECTOR), (ITEM_EFFECT_ID.DIAMOND_COLLECTOR), (ITEM_EFFECT_ID.DIAMOND_COLLECTOR)]
  },
  {
    id: ITEM_ID.LOAN_SHARK_FUNDING,
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
    effects: [(ITEM_EFFECT_ID.BUY_IN_MULTIPLY), (ITEM_EFFECT_ID.BUY_IN_MULTIPLY), (ITEM_EFFECT_ID.EMERGENCY_FUND)]
  },
  {
    id: ITEM_ID.CASINO_INSIDER,
    name_ko: '카지노 관계자',
    name_en: 'Casino Insider',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🤵',
    class: 'Item',
    tier: 'T5',
    price: 275000,
    desc_ko: '카지노 관계자는 당연하게도 카지노 시설을 손님보다 저렴하게 이용가능합니다.',
    desc_en: 'Casino insiders can naturally use casino facilities cheaper than guests.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.RAKE_REDUCTION), (ITEM_EFFECT_ID.RAKE_REDUCTION), (ITEM_EFFECT_ID.RAKE_REDUCTION)]
  },
  {
    id: ITEM_ID.UNIVERSAL_MEMBERSHIP_CARD,
    name_ko: '범우주 카지노 멤버십 카드',
    name_en: 'Universal Casino Membership Card',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '💳',
    class: 'Item',
    tier: 'T5',
    price: 200000,
    desc_ko: '은하계 그 어느 카지노에서도 상상 초월의 우대를 받습니다.',
    desc_en: 'Receive unimaginable preferential treatment at any casino in the galaxy.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.RAKE_REDUCTION), (ITEM_EFFECT_ID.BUY_IN_MULTIPLY), (ITEM_EFFECT_ID.BLIND_DISCOUNT)]
  },
  {
    id: ITEM_ID.EV_RECOVERY_CORE,
    name_ko: 'EV 복구 코어',
    name_en: 'EV Recovery Core',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🛑',
    class: 'Item',
    tier: 'T5',
    price: 250000,
    desc_ko: '완벽한 백업 시스템을 통해 잘못된 결정으로 인한 -EV를 복구합니다.',
    desc_en: 'Recovers -EV caused by wrong decisions through a perfect backup system.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.QUANTUM_FOLD), (ITEM_EFFECT_ID.QUANTUM_FOLD), (ITEM_EFFECT_ID.QUANTUM_FOLD)]
  },

  {
    id: ITEM_ID.REINCARNATION_PROTOCOL,
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
    effects: [(ITEM_EFFECT_ID.EMERGENCY_FUND), (ITEM_EFFECT_ID.EMERGENCY_FUND), ITEM_EFFECT_ID.RND]
  },

  {
    id: ITEM_ID.MONOPOLY_PASS,
    name_ko: '독점 거래 허가권',
    name_en: 'Monopoly Pass',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '📜',
    class: 'Item',
    tier: 'T5',
    price: 235000,
    desc_ko: '시장의 모든 아이템을 당신만이 누릴 수 있는 특가로 제공받습니다.',
    desc_en: 'Receive all items on the market at a special price that only you can enjoy.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.LOYALTY_CARD), (ITEM_EFFECT_ID.LOYALTY_CARD), (ITEM_EFFECT_ID.LOYALTY_CARD)]
  },
  {
    id: ITEM_ID.WPT_CHAMPIONSHIP_MEDAL,
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
    effects: [(ITEM_EFFECT_ID.BUY_IN_MULTIPLY), (ITEM_EFFECT_ID.BLIND_DISCOUNT), (ITEM_EFFECT_ID.RAKE_REDUCTION)]
  },
  {
    id: ITEM_ID.MOVIE_ROUNDERS_DVD,
    name_ko: '라운더스 DVD 소장판',
    name_en: 'Rounders DVD Collector\'s Edition',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '📀',
    class: 'Item',
    tier: 'T5',
    price: 170000,
    desc_ko: '옛날이나 지금이나 포커을 플레이하는 방식은 크게 바뀌지 않은거 같습니다.',
    desc_en: 'It seems the way poker is played hasn\'t changed much from the past to now.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.DOUBLE_DOWN), (ITEM_EFFECT_ID.GOLDEN_TOUCH), (ITEM_EFFECT_ID.FAILURE_IS_MOTHER_OF_SUCCESS)]
  },
  {
    id: ITEM_ID.FLUSH_MASTER_RING,
    name_ko: '플러시 마스터 링',
    name_en: 'Flush Master Ring',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '💍',
    class: 'Item',
    tier: 'T5',
    price: 170000,
    desc_ko: '같은 색상의 카드들이 모일 때, 진정한 힘이 깨어납니다.',
    desc_en: 'When cards of the same suit gather, true power awakens.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.FLUSH_MASTER), ITEM_EFFECT_ID.RND, ITEM_EFFECT_ID.RND]
  },
  {
    id: ITEM_ID.FULL_HOUSE_BLUEPRINT,
    name_ko: '풀하우스 설계도',
    name_en: 'Full House Blueprint',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🏗️',
    class: 'Item',
    tier: 'T5',
    price: 150000,
    desc_ko: '완벽한 조화를 이루는 핸드로 승리하는 비결을 담고 있습니다.',
    desc_en: 'Contains the secret to winning with a perfectly harmonious hand.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.FULL_HOUSE_MASTER), ITEM_EFFECT_ID.RND, ITEM_EFFECT_ID.RND]
  },
  {
    id: ITEM_ID.GUARDIAN_ANGEL_PROGRAM,
    name_ko: '수호천사 데몬',
    name_en: 'Guardian Angel Program',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '👼',
    class: 'Item',
    tier: 'T5',
    price: 250000,
    desc_ko: '보이지 않는 곳에서 당신의 칩을 지켜주는 프로그램입니다.',
    desc_en: 'A program that protects your chips from unseen places.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.ALLIN_INSURANCE), (ITEM_EFFECT_ID.ALLIN_INSURANCE), (ITEM_EFFECT_ID.ALLIN_INSURANCE)]
  },
  // --- T6 items (Unique or effect 4 slots, 300000+ CR) ---
  {
    id: ITEM_ID.CASINO_INSIDER_NEMESIS,
    name_ko: '천적',
    name_en: 'Nemesis',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '👹',
    class: 'Item',
    tier: 'T6',
    price: 325000,
    desc_ko: '카지노 관계자와 다른 플레이어들은 그의 이름만 들어도 치가 떨립니다.',
    desc_en: 'Casino insiders and other players tremble at the mere mention of his name.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [ITEM_EFFECT_ID.BORN_VILLAIN]
  },
  {
    id: ITEM_ID.CARD_OF_THE_CARD_SHARK,
    name_ko: '타짜의 화투',
    name_en: 'Card Shark\'s Hwatu',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🎴',
    class: 'Item',
    tier: 'T6',
    price: 360000,
    desc_ko: '동작 그만, 밑장 빼기냐?',
    desc_en: 'Hold it right there, are you dealing from the bottom?',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.GHOST_BET)]
  },
  {
    id: ITEM_ID.CODE_OF_CREATION,
    name_ko: '창조의 소스 코드',
    name_en: 'Source Code of Creation',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🧬',
    class: 'Item',
    tier: 'T6',
    price: 750000,
    desc_ko: '이 세계를 구성하는 근원적인 코드에 접근합니다.',
    desc_en: 'Accesses the fundamental code that constructs this world.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [ITEM_EFFECT_ID.RND, ITEM_EFFECT_ID.RND, ITEM_EFFECT_ID.RND, ITEM_EFFECT_ID.RND]
  },
  {
    id: ITEM_ID.MIRACLE_WORKER_SCRIPT,
    name_ko: '기적 구현 스크립트',
    name_en: 'Miracle Worker Script',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '✨',
    class: 'Item',
    tier: 'T6',
    price: 400000,
    desc_ko: '확률적으로 불가능한 일들을 현실로 만들어냅니다.',
    desc_en: 'Makes probabilistically impossible things a reality.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.QUANTUM_LUCK), (ITEM_EFFECT_ID.QUANTUM_LUCK), (ITEM_EFFECT_ID.QUANTUM_LUCK), (ITEM_EFFECT_ID.QUANTUM_LUCK)]
  },
  {
    id: ITEM_ID.AURUM_PROCESSOR_Z,
    name_ko: '오럼 프로세서 Z',
    name_en: 'Aurum Processor Z',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '⚡',
    class: 'Item',
    tier: 'T6',
    price: 300000,
    desc_ko: '초고속 연산을 통해 모든 고부가 가치 정보를 선점합니다.',
    desc_en: 'Preempts all high value-added information through ultra-high-speed processing.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.CLUB_COLLECTOR), (ITEM_EFFECT_ID.SPADE_COLLECTOR), (ITEM_EFFECT_ID.HEART_COLLECTOR), (ITEM_EFFECT_ID.DIAMOND_COLLECTOR)]
  },
  {
    id: ITEM_ID.DESTINY_SLOT_MACHINE,
    name_ko: '운명의 슬롯 머신',
    name_en: 'Destiny Slot Machine',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '🎰',
    class: 'Item',
    tier: 'T6',
    price: 225000,
    desc_ko: '자, 돌려 봅시다.',
    desc_en: 'LET\'S GO GAMBLING.',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.OMEN), (ITEM_EFFECT_ID.LUCKY_7_COLLECTOR), (ITEM_EFFECT_ID.DOPAMINE_ADDICTION), (ITEM_EFFECT_ID.DOPAMINE_ADDICTION)]
  },
  {
    id: ITEM_ID.SYNAPSE_READING_PROTOCOL,
    name_ko: '시냅스 리딩 프로토콜',
    name_en: 'Synapse Reading Protocol',
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    icon: '👁️',
    class: 'Item',
    tier: 'T6',
    price: 525000,
    desc_ko: '상대방의 생각을 꿰뚫어 봅니다...',
    desc_en: 'Sees through the opponent\'s thoughts...',
    get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
    effects: [(ITEM_EFFECT_ID.SYNAPSE_READING)]
  },
  {
    id: ITEM_ID.ROYAL_FLUSH_CROWN,
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
    effects: [(ITEM_EFFECT_ID.ROYAL_FLUSH_MASTER), ITEM_EFFECT_ID.RND, ITEM_EFFECT_ID.RND, ITEM_EFFECT_ID.RND]
  },
  // {
  //   id: ITEM_ID.ORBIT_LOUNGE_NETWORK_HACKING,
  //   name_ko: '오르빗 라운지 네트워크 해킹',
  //   name_en: 'Orbit Lounge Network Hacking',
  //   get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
  //   icon: '🚀',
  //   class: 'Item',
  //   tier: 'T7',
  //   price: 9999999,
  //   isConsumable: true,
  //   isAccessKey: true,
  //   desc_ko: '화성 갈끄니깐~~~!',
  //   desc_en: 'We\'re going to Mars~~~!',
  //   get desc() { return store.settings.language === 'en' ? this.desc_en : this.desc_ko; },
  //   effects: [(ITEM_EFFECT_ID.ORBIT_TOUR)]
  // },
];

export const getItemById = (id) => {
  return ITEM_DATA.find(item => item.id === id);
};

/**
 * Re-links a minimal item object (usually from save data or shop generation) to its base ITEM_DATA prototype.
 * This ensures that constant fields like 'name', 'desc', and 'effects' always reflect
 * the latest balance changes in ITEM_DATA, while keeping instance-specific data (instanceId, discount, originalPrice, price).
 */
export const relinkItem = (itemData) => {
  if (!itemData) return null;

  let id = itemData.id;
  if (!id && itemData.instanceId) {
    // Fallback: extract id from instanceId if id is missing
    const parts = itemData.instanceId.split('_');
    if (parts.length > 2) {
      parts.pop(); // remove rand
      parts.pop(); // remove ts
      id = parts.join('_');
    }
  }

  if (!id) return itemData;

  const baseItem = getItemById(id);
  if (!baseItem) {
    console.warn(`[relinkItem] Base item not found for ID: ${id}`);
    return itemData;
  }

  // 1. Create instance with baseItem as prototype
  const instance = Object.create(baseItem);

  // 2. Merge all properties from itemData into instance
  // Exclude prototype-provided getters and arrays to avoid stale data/conflicts
  Object.keys(itemData).forEach(key => {
    if (key !== 'name' && key !== 'desc' && key !== 'effects') {
      try {
        instance[key] = itemData[key];
      } catch (e) {
        // Ignore read-only properties
      }
    }
  });

  // 3. Resolve effects: Convert IDs to stateful instances via prototypes
  const resolvedEffects = [];
  const sourceEffects = itemData.effects || baseItem.effects;

  if (Array.isArray(sourceEffects)) {
    sourceEffects.forEach(eff => {
      let effectBase = null;
      let existingState = null;

      if (typeof eff === 'string') {
        // Resolve ID -> Base Effect
        if (eff === ITEM_EFFECT_ID.RND) {
          // One-shot resolution for random slots
          effectBase = getRndItemBucket();
        } else {
          effectBase = getItemEffect(eff);
        }
      } else if (eff && eff.id) {
        // Re-hydrating from saved object
        effectBase = getItemEffect(eff.id);
        existingState = eff;
      }

      if (effectBase) {
        // Create stateful instance: base effect as prototype
        const effInstance = Object.create(effectBase);
        // Ensure ID is an own property for persistence (JSON.stringify excludes prototype properties)
        effInstance.id = effectBase.id;

        if (existingState) {
          // Recover saved state (cooldowns, stacks, etc.)
          Object.keys(existingState).forEach(k => {
            // Don't override prototype getters/fields unless they are state
            if (k !== 'name' && k !== 'desc' && k !== 'trigger') {
              effInstance[k] = existingState[k];
            }
          });
        }
        resolvedEffects.push(effInstance);
      }
    });
  }

  // 4. Consolidate stackable effects
  const mergedEffects = [];
  const stackableMap = new Map();

  resolvedEffects.forEach(eff => {
    if (eff.isStackable) {
      if (stackableMap.has(eff.id)) {
        const existing = stackableMap.get(eff.id);
        // Sum values if both exist
        if (typeof eff.value === 'number' && typeof existing.value === 'number') {
          existing.value += eff.value;
        }
      } else {
        stackableMap.set(eff.id, eff);
        mergedEffects.push(eff);
      }
    } else {
      mergedEffects.push(eff);
    }
  });

  instance.effects = mergedEffects;

  // 4. Ensure instanceId exists
  if (!instance.instanceId) {
    instance.instanceId = getinstanceId(baseItem);
  }

  return instance;
};

export const hydrateStoreItems = () => {
  if (store.shop && Array.isArray(store.shop.items)) {
    store.shop.items = store.shop.items.map(item => relinkItem(item));
  }
  if (Array.isArray(store.ownedItems)) {
    store.ownedItems = store.ownedItems.map(item => relinkItem(item));
  }
  if (store.equippedItem) {
    // If it's a legacy ID string, find the item in ownedItems
    if (typeof store.equippedItem === 'string' && Array.isArray(store.ownedItems)) {
      const found = store.ownedItems.find(p => (p.instanceId || p.id) === store.equippedItem);
      if (found) store.equippedItem = found;
    }
    // Now relink if it's an object
    if (typeof store.equippedItem === 'object') {
      store.equippedItem = relinkItem(store.equippedItem);
    }
  }
};

export const getinstanceId = (baseItem) => `${baseItem.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
