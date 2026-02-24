import { getItemEffect, getRndItemBucket } from "./itemsEffect";

export const ITEM_DATA = [
  // --- T1 items (Common, 1000 - 5000 CR) ---
  {
    id: 'to_the_mars_rocket',
    name: '화성행 로켓 모형',
    icon: '🚀',
    class: 'Item',
    tier: 'T1',
    price: 1200,
    editable: false,
    desc: '화성으로 떠나지 못한 지구에 남겨진 낙오자들을 위한 작은 위로입니다. ',
    effects: [getItemEffect('xp_boost')]
  },
  {
    id: 'broken_compass',
    name: '고장난 나침반',
    icon: '🧭',
    class: 'Item',
    tier: 'T1',
    price: 1100,
    editable: false,
    desc: '북쪽 대신 돈이 있는 곳을 가리킨다는 소문이 있습니다.',
    effects: [getItemEffect('showdown_lose_refund')]
  },
  {
    id: 'glitchy_data_chip',
    name: '구형 VHS 테이프',
    icon: '📼',
    class: 'Item',
    tier: 'T1',
    price: 2800,
    editable: false,
    desc: '여기에 데이터를 담는다구요? 장난하십니까?',
    effects: [getItemEffect('lt_recovery')]
  },
  {
    id: 'synthetic_coffee',
    name: '합성 커피',
    icon: '☕',
    class: 'Item',
    tier: 'T1',
    price: 1200,
    editable: false,
    desc: '진짜 커피콩으로 만들었진 않지만 카페인 함량과 맛은 비슷합니다.',
    effects: [getItemEffect('stemina_regen')]
  },
  {
    id: 'old_stopwatch',
    name: '낡은 초시계',
    icon: '⏱️',
    class: 'Item',
    tier: 'T1',
    price: 1000,
    editable: false,
    desc: '시간을 조금 더 벌어줄 수 있을 것 같습니다.',
    effects: [getItemEffect('time_bank_plus')]
  },
  {
    id: 'crypto_coin_replica',
    name: '암호화폐 복제품',
    icon: '₿',
    class: 'Item',
    tier: 'T1',
    price: 1250,
    desc: '한때 누군가의 인생을 구원하거나 파멸시켰던 상징물의 플라스틱 복제품입니다. 왠지 행운이 올 것 같은 착각이 듭니다.',
    effects: [getItemEffect('chip_rounding')]
  },
  {
    id: 'cryo_mint_dispenser',
    name: '크라이오 민트 디스펜서',
    icon: '🧊',
    class: 'Item',
    tier: 'T1',
    price: 1800,
    desc: '극도의 시원함으로 뇌 회로를 일시적으로 냉각시켜 시간을 법니다.',
    effects: [getItemEffect('time_bank_plus')]
  },
  {
    id: 'industrial_showdown_lose_refund',
    name: '공업용 자석',
    icon: '🧲',
    class: 'Item',
    tier: 'T1',
    price: 1750,
    editable: false,
    desc: '엄청난 자력으로 주변을 초토화시킵니다.',
    effects: [getItemEffect('showdown_lose_refund')]
  },
  {
    id: 'failure_philosophy',
    name: '실패학 개론',
    icon: '📚',
    class: 'Item',
    tier: 'T1',
    price: 4500,
    desc: '패배의 쓴맛을 경험치로 승화시키는 놀라운 철학서입니다.',
    effects: [getItemEffect('failure_is_mother_of_success')]
  },
  {
    id: 'roller_skates',
    name: '롤러 스케이트',
    icon: '🛼',
    class: 'Item',
    tier: 'T1',
    price: 3800,
    desc: '아슬아슬하게 졌다고요? 아니요, 그냥 진 겁니다. 패배의 감정에서 빠르게 빠져나가세요.',
    effects: [getItemEffect('outkicked')]
  },
  {
    id: 'rusty_pair_pendant',
    name: '녹슨 페어 펜던트',
    icon: '⛓️',
    class: 'Item',
    tier: 'T1',
    price: 3200,
    desc: '보잘것 없는 원페어에 인생을 거는 사람들을 위한 유물입니다.',
    effects: [getItemEffect('pair_master')]
  },



  // --- T2 items (Uncommon, 10000 - 50000 CR) ---
  {
    id: 'holo_projected_flower',
    name: '홀로그램 꽃',
    icon: '🌸',
    class: 'Item',
    tier: 'T2',
    price: 18000,
    desc: '보고 있으면 마음이 편안해지며 자신감이 샘솟습니다.',
    effects: [getItemEffect('lt_regen_plus')]
  },
  {
    id: 'tax_evasion_manual',
    name: '합법적(?) 하우스 절세 비법',
    icon: '📄',
    class: 'Item',
    tier: 'T2',
    price: 15000,
    desc: '하우스의 수수료를 아끼는 기발한 방법들이 적혀 있습니다.',
    effects: [getItemEffect('rake_reduction')]
  },
  {
    id: 'liquid_nitrogen_cooling',
    name: '액체 질소 냉각 시스템',
    icon: '❄️',
    class: 'Item',
    tier: 'T2',
    price: 28000,
    desc: '극저온의 냉각으로 패배의 열기를 식혀줍니다.',
    effects: [getItemEffect('cooler')]
  },
  {
    id: 'casino_info_collector',
    name: '카지노 정보 수집기',
    icon: '📡',
    class: 'Item',
    tier: 'T2',
    price: 32000,
    desc: '블라이드가 저렴한 카지노가 있는지 찾습니다.',
    effects: [getItemEffect('blind_discount')]
  },
  {
    id: 'orbit_lounge_network_hacking',
    name: '오르빗 네트워크 해킹',
    icon: '🚀',
    class: 'Item',
    tier: 'T7',
    price: 9999999,
    isConsumable: true,
    isAccessKey: true,
    desc: '화성 갈끄니깐~~~!',
    effects: [getItemEffect('orbit_tour')]
  },
  {
    id: 'underground_bar_invite',
    name: '지하 바 암호수첩',
    icon: '📒',
    class: 'Item',
    tier: 'T2',
    price: 40000,
    isConsumable: true,
    isAccessKey: true,
    desc: '매일 바뀌는 암구호보다 여기 술에 물 타는 비율이 더 자주 바뀔걸요?',
    effects: [getItemEffect('underground_bar_invite')]
  },
  {
    id: 'club_membership',
    name: '클럽 회원 계정',
    icon: '🆔',
    class: 'Item',
    tier: 'T3',
    price: 80000,
    isConsumable: true,
    isAccessKey: true,
    desc: '불법으로 위조되었지만, 이제 당당하게 어깨 피고 들어가세요.',
    effects: [getItemEffect('club_membership')]
  },
  {
    id: 'the_bunker_key',
    name: '"더 벙커" 복제 열쇠',
    icon: '🔑',
    class: 'Item',
    tier: 'T4',
    price: 160000,
    isConsumable: true,
    isAccessKey: true,
    desc: '원래는 KBT 조직들만 가지고 있는 열쇠인데, 누군가 복제해서 암시장에 팔고 있습니다.',
    effects: [getItemEffect('the_bunker_key')]
  },
  {
    id: 'holdem_house_membership',
    name: '홀덤 하우스 회원 뱃지',
    icon: '⚜️',
    class: 'Item',
    tier: 'T5',
    price: 250000,
    isConsumable: true,
    isAccessKey: true,
    desc: '뱃지 하나 달았다고 매너 있는 척하지 마세요. 어차피 서로 등쳐먹으러 온 거 다 아니까요.',
    effects: [getItemEffect('holdem_house_membership')]
  },
  {
    id: 'royal_room_invite',
    name: '로열 프라이빗 카드룸 회원 뱃지',
    icon: '🔱',
    class: 'Item',
    tier: 'T6',
    price: 640000,
    isConsumable: true,
    isAccessKey: true,
    desc: '이제 당신도 "특별한 소수"가 되었습니다. 지갑이 완전히 털리기 전까지는 말이죠.',
    effects: [getItemEffect('royal_room_invite')]
  },
  {
    id: 'double_buy_in_ticket',
    name: '더블 바이인 티켓',
    icon: '🎫',
    class: 'Item',
    tier: 'T2',
    price: 45000,
    desc: 'V.I.P 대우를 받으며 모든 바이인을 두 배로 즐기세요.',
    effects: [getItemEffect('buy_in_multiply')]
  },
  {
    id: 'emergency_reserves',
    name: '비상 예비금 상자',
    icon: '📦',
    class: 'Item',
    tier: 'T2',
    price: 19000,
    desc: '정말 위험할 때를 대비해 숨겨둔 비상금입니다.',
    effects: [getItemEffect('initial_bankroll_bonus')]
  },
  {
    id: 'tax_haven_vpn',
    name: '조세 회피처 VPN',
    icon: '🌐',
    class: 'Item',
    tier: 'T2',
    price: 27000,
    desc: '네트워크 위치를 속여 과도한 수수료를 회피합니다.',
    effects: [getItemEffect('rake_reduction')]
  },
  {
    id: 'old_phone',
    name: '구식 전화기',
    icon: '☎️',
    class: 'Item',
    tier: 'T2',
    price: 12500,
    editable: false,
    desc: '여보세요? 아, 관심없다니깐요? 안사요 안사...어? 반값 할인이라고요? 잠시만요, 끊지 말아 보세요.',
    effects: [getItemEffect('loyalty_card')]
  },
  {
    id: 'backup_battery_set',
    name: '백업 배터리 세트',
    icon: '🪫',
    class: 'Item',
    tier: 'T2',
    price: 16500,
    desc: '메인 전원이 나갔을 때를 대비한 든든한 보험입니다.',
    effects: [getItemEffect('last_stand')]
  },


  {
    id: 'quick_fold_manual',
    name: '쾌속 폴드 지침서',
    icon: '📖',
    class: 'Item',
    tier: 'T2',
    price: 22000,
    desc: '포기할 줄 아는 용기가 때로는 더 큰 자본으로 돌아옵니다.',
    effects: [getItemEffect('quantum_fold')]
  },
  {
    id: 'blackjack_seal',
    name: '블랙잭 인장',
    icon: '♠',
    class: 'Item',
    tier: 'T2',
    price: 45000,
    desc: 'A와 J의 조합이 가져다주는 전율을 경험하십시오.',
    effects: [getItemEffect('blackjack_master')]
  },
  {
    id: 'victory_streak_flag',
    name: '연승의 깃발',
    icon: '🚩',
    class: 'Item',
    tier: 'T2',
    price: 25000,
    desc: '승리의 기세가 꺾이지 않도록 성장을 가속화합니다.',
    effects: [getItemEffect('winner_master')]
  },
  {
    id: 'chips',
    name: '칩스',
    icon: '🍟',
    class: 'Item',
    tier: 'T2',
    price: 30000,
    desc: '햄버거랑 물은 안필요하세요?',
    effects: [getItemEffect('sets_master')]
  },
  {
    id: 'black_consumer',
    name: '블랙 컨슈머',
    icon: '🤑',
    class: 'Item',
    tier: 'T2',
    price: 25000,
    isConsumable: true,
    desc: '진상 짓으로 암상인과의 관계를 최악으로 만들었습니다.',
    effects: [getItemEffect('black_consumer')]
  },
  {
    id: 'luck_of_the_draw_coin',
    name: '운명의 드로우 동전',
    icon: '🪙',
    class: 'Item',
    tier: 'T2',
    price: 35000,
    desc: '불가능할 것 같은 승리를 당신의 것으로 만듭니다.',
    effects: [getItemEffect('quantum_luck')]
  },
  {
    id: 'illegal_system_miner',
    name: '불법 토큰 채굴 프로그램',
    icon: '⛏️',
    class: 'Item',
    tier: 'T2',
    price: 28000,
    desc: '공유 경제의 미래를 미리 만나보세요. 타인의 자원을 내 것처럼 쓰는 것, 그것이 이 도시에서 살아남는 유일한 규례입니다.',
    effects: [getItemEffect('joy_of_victory')]
  },
  // --- T3 items (Rare, 50000 - 100000 CR) ---
  {
    id: 'noise_cancelling_headset',
    name: '노이즈 캔슬링 헤드셋',
    icon: '🎧',
    class: 'Item',
    tier: 'T3',
    price: 55000,
    desc: '가족 생각, 빚 독촉, 옆 자리의 욕설... 인생의 불협화음을 제거하면 오직 \"숫자\"만 남습니다. 이제 차분하게 올인을 결정하세요.',
    effects: [getItemEffect('time_bank_plus'), getItemEffect('time_bank_plus')]
  },
  {
    id: 'low_stack_battery',
    name: '배수의 진 배터리',
    icon: '🪫',
    class: 'Item',
    tier: 'T3',
    price: 63000,
    desc: '궁지에 몰릴수록 더욱 강력한 에너지를 내뿜습니다.',
    effects: [getItemEffect('last_stand'), getItemEffect('last_stand')]
  },
  {
    id: 'floppy_disk',
    name: '플로피 디스크',
    icon: '💾',
    class: 'Item',
    tier: 'T3',
    price: 82000,
    editable: false,
    desc: '아주 먼 옛날에는 여기에 게임을 분할 압축하여 담았다고 합니다. 웃기죠?',
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
    name: '사이버 펫',
    icon: '🐕‍🦺',
    class: 'Item',
    tier: 'T3',
    price: 88000,
    editable: false,
    desc: '귀여운 동반자와 함께라면 성장이 빠릅니다.',
    effects: [getItemEffect('xp_boost'), getItemEffect('chip_rounding')]
  },
  {
    id: 'scrap_collector_glove',
    name: '고철 수집가 장갑',
    icon: '🧤',
    class: 'Item',
    tier: 'T3',
    price: 65000,
    editable: false,
    desc: '더러운 건 싫지만 돈이 되는 건 좋습니다.',
    effects: [getItemEffect('chip_rounding'), getItemEffect('chip_rounding')]
  },
  {
    id: 'prismatic_achievement_card',
    name: '프리즘 업적 카드',
    icon: '🃏',
    class: 'Item',
    tier: 'T3',
    price: 92000,
    desc: '당신의 모든 승리가 영광스러운 기록으로 남게 됩니다.',
    effects: [getItemEffect('xp_boost'), getItemEffect('xp_boost')]
  },

  {
    id: 'neuro_sync_headband',
    name: '뉴로 동기화 머리띠',
    icon: '🧠',
    class: 'Item',
    tier: 'T3',
    price: 55000,
    desc: '뇌파를 에이전트와 직접 동기화하여 LT를 빠르게 회복합니다.',
    effects: [getItemEffect('lt_regen_plus'), getItemEffect('lt_regen_plus')]
  },
  {
    id: 'allin_insurance_plus',
    name: '세이프 가드 플러스',
    icon: '🛡️',
    class: 'Item',
    tier: 'T3',
    price: 72000,
    desc: '더 넓은 범위의 손실을 보장해주는 프리미엄 보험입니다.',
    effects: [getItemEffect('allin_insurance'), getItemEffect('allin_insurance')]
  },

  {
    id: 'life_saver_buoy',
    name: '디지털 구명튜브',
    icon: '🛟',
    class: 'Item',
    tier: 'T3',
    price: 93000,
    desc: '올인이라는 거친 파도 속에서도 당신을 건져 올립니다.',
    effects: [getItemEffect('allin_insurance'), getItemEffect('tilt_recovery')]
  },
  {
    id: 'advanced_equity_calc',
    name: '에쿼티 연산기',
    icon: '📊',
    class: 'Item',
    tier: 'T3',
    price: 92000,
    desc: '단순한 확률을 넘어 미래의 분기점까지 계산합니다.',
    effects: [getItemEffect('pot_bonus'), getItemEffect('quantum_fold')]
  },
  // {
  //   id: 'unbreakable_vault',
  //   name: '파괴 불능 금고',
  //   icon: '🔐',
  //   class: 'Item',
  //   tier: 'T3',
  //   price: 75000,
  //   desc: '손실이 발생해도 금고 안의 자산은 안전하게 보존됩니다.',
  //   effects: [getItemEffect('allin_insurance')]
  // },
  // {
  //   id: 'phantom_signal_emitter',
  //   name: '팬텀 신호 방출기',
  //   icon: '📡',
  //   class: 'Item',
  //   tier: 'T3',
  //   price: 82000,
  //   desc: '허위 신호를 내보내 실제 RAM 상태를 숨깁니다.',
  //   effects: [getItemEffect('stealth_mode')]
  // },
  // {
  //   id: 'dealers_eye_lens',
  //   name: '딜러의 눈 렌즈',
  //   icon: '👁️',
  //   class: 'Item',
  //   tier: 'T3',
  //   price: 94000,
  //   desc: '결과가 나오기 전, 당신의 승리 확률을 미리 속삭입니다.',
  //   effects: [getItemEffect('hand_reader')]
  // },
  {
    id: 'crystal_wine_glass',
    name: '크리스털 와인잔',
    icon: '🍷',
    class: 'Item',
    tier: 'T3',
    price: 64000,
    desc: '당신의 승리에 건배.',
    effects: [getItemEffect('pot_bonus'), getItemEffect('winner_master')]
  },

  // --- T4 items (Uncommon + 1 Random, 100000 - 200000 CR) ---
  {
    id: 'loaded_dice',
    name: '사기 주사위',
    icon: '🎲',
    class: 'Item',
    tier: 'T4',
    price: 196000,
    desc: '이상하게 높은 숫자가 자주 나오는건 기분 탓이겠죠?',
    effects: [getItemEffect('omen'), getItemEffect('pot_bonus')]
  },

  {
    id: 'algorithmic_rebate_tool',
    name: '알고리즘 환급 도구',
    icon: '♻️',
    class: 'Item',
    tier: 'T4',
    price: 166000,
    desc: '계산된 손실의 일부를 즉시 복구합니다.',
    effects: [getItemEffect('tilt_recovery'), getItemEffect('tilt_recovery')]
  },
  // {
  //   id: 'bio_luminescence_chip',
  //   name: '생체 발광 칩',
  //   class: 'Item',
  //   icon: '🍄',
  //   tier: 'T4',
  //   price: 150000,
  //   desc: '스스로 빛을 내며 에너지를 생성하는 칩입니다.',
  //   effects: [getItemEffect('lt_regen_plus'), getRndItemBucket]
  // },
  {
    id: 'black_market_courier_bag',
    name: '블랙마켓 배달 가방',
    icon: '💼',
    class: 'Item',
    tier: 'T4',
    price: 135000,
    desc: '배달 사고로 주인을 잃은 서류 가방입니다..',
    effects: [getRndItemBucket, getRndItemBucket]
  },
  {
    id: 'blind_folded_monk_statue',
    name: '눈먼 수도승 조각상',
    icon: '🧘',
    class: 'Item',
    tier: 'T4',
    price: 138000,
    desc: '보이지 않는 것이 때로는 가장 안전합니다.',
    effects: [getItemEffect('blind_discount'), getItemEffect('blind_discount')]
  },
  {
    id: 'blind_discount_v2_proto',
    name: '블라인드 실드 v2(시제품)',
    icon: '🛡️',
    class: 'Item',
    tier: 'T4',
    price: 149000,
    desc: '아직 불안정하지만 강력한 방어력을 보여줍니다.',
    effects: [getItemEffect('blind_discount'), getRndItemBucket]
  },

  {
    id: 'cyber_junkies_stash',
    name: '사이버 정키의 비축품',
    icon: '🥡',
    class: 'Item',
    tier: 'T4',
    price: 115000,
    desc: '어딘가 쓸모 있는 잡동사니들이 가득합니다.',
    effects: [getItemEffect('initial_bankroll_bonus'), getRndItemBucket]
  },
  {
    id: 'decrypted_tax_file',
    name: '해독된 세무 파일',
    icon: '📄',
    class: 'Item',
    tier: 'T4',
    price: 120000,
    desc: '카지노의 탈세 장부 사이에서 뜻밖의 뒷돈을 발견했습니다. 역시 남의 비밀을 파헤치는 것만큼 수익성 높은 비즈니스는 없군요.',
    effects: [getItemEffect('rake_reduction'), getRndItemBucket]
  },
  {
    id: 'emergency_exit_hammer',
    name: '긴급 탈출 망치',
    icon: '🔨',
    class: 'Item',
    tier: 'T4',
    price: 168000,
    desc: '복잡한 수수료 체계를 부수어버립니다.',
    effects: [getItemEffect('rake_reduction'), getItemEffect('rake_reduction')]
  },
  {
    id: 'equity_emergency_alarm',
    name: '에퀴티 비상 경보기',
    icon: '🚨',
    class: 'Item',
    tier: 'T4',
    price: 171000,
    editable: false,
    desc: '당신의 에퀴티가 위험에 처했을 때, 자동으로 경보를 울립니다.',
    effects: [getItemEffect('quantum_fold'), getItemEffect('allin_insurance')]
  },
  {
    id: 'forged_coupon',
    name: '위조 쿠폰',
    icon: '🎁',
    class: 'Item',
    tier: 'T4',
    price: 210000,
    desc: '들키지만 않는다면 아주 유용한 수단입니다.',
    effects: [getItemEffect('loyalty_card'), getItemEffect('loyalty_card')]
  },
  {
    id: 'golden_mirror',
    name: '황금 거울',
    icon: '🪞',
    class: 'Item',
    tier: 'T4',
    price: 139000,
    desc: '거울 속에 비친 당신의 모습보다 둘러싸인 순금 테두리의 가치가 더 높다는 사실에 위안을 얻으세요.',
    effects: [getItemEffect('golden_touch'), getItemEffect('golden_touch')]
  },
  {
    id: 'capitalists_top_hat',
    name: '자본주의의 뚜껑',
    icon: '🎩',
    class: 'Item',
    tier: 'T4',
    price: 162000,
    desc: '머리 위에 얹힌 이 비싼 장식물은 당신이 멍청한 베팅을 해도 주위 사람들이 "과감한 결단"이라고 칭송하게 만듭니다.',
    effects: [getItemEffect('winner_master'), getItemEffect('winner_master')]
  },
  {
    id: 'jackpot_seed_data',
    name: '잭팟 시드 데이터',
    icon: '🌱',
    class: 'Item',
    tier: 'T4',
    price: 175000,
    desc: '큰 행운을 불러올 씨앗 같은 데이터 뭉치입니다.',
    effects: [getItemEffect('initial_bankroll_bonus'), getItemEffect('pot_bonus')]
  },
  {
    id: 'low_stack_berserker_core',
    name: '로우 스택 버서커 코어',
    icon: '⚛️',
    class: 'Item',
    tier: 'T4',
    price: 145000,
    desc: '남은 칩이 적을수록 연산 회로가 폭주하며 재생력을 높입니다.',
    effects: [getItemEffect('last_stand'), getItemEffect('blind_discount')]
  },

  {
    id: 'lucky_cat_gold',
    name: '황금 마네키네코',
    icon: '🐱',
    class: 'Item',
    tier: 'T4',
    price: 155000,
    editable: false,
    desc: '끊임없이 흔들리는 저 금색 앞발은 행운을 부르는 게 아닙니다. 테이블 위의 칩들을 당신 쪽으로 긁어모으는 기계적인 갈퀴질이죠',
    effects: [getItemEffect('pot_bonus'), getItemEffect('pot_bonus')]
  },
  {
    id: 'lucky_charm_v4',
    name: '행운의 부적 v4',
    icon: '🧿',
    class: 'Item',
    tier: 'T4',
    price: 172000,
    desc: '과학과 미신이 결합된 최신형 부적입니다.',
    effects: [getItemEffect('initial_bankroll_bonus'), getRndItemBucket]
  },
  {
    id: 'mask_of_joy_and_despair',
    name: '환희와 절망의 가면',
    icon: '🎭',
    class: 'Item',
    tier: 'T4',
    price: 186000,
    editable: false,
    desc: '비극은 멀리서 보면 희극이라지만, 이 도시는 당신이 어느 쪽에 속해 있든 전혀 개의치 않습니다.',
    effects: [getItemEffect('failure_is_mother_of_success'), getItemEffect('winner_master')]
  },
  {
    id: 'merchants_secret_handshake',
    name: '상인의 비밀 암호',
    icon: '🤝',
    class: 'Item',
    tier: 'T4',
    price: 144000,
    desc: '아는 사람만 아는 방식으로 가격을 깎습니다.',
    effects: [getItemEffect('loyalty_card'), getItemEffect('pot_bonus')]
  },
  {
    id: 'phoenix_protocol',
    name: '피닉스 프로토콜',
    icon: '🔥',
    class: 'Item',
    tier: 'T4',
    price: 118000,
    desc: '잿더미에서 다시 일어서는 것처럼 초기 자금을 복구합니다.',
    effects: [getItemEffect('initial_bankroll_bonus'), getItemEffect('initial_bankroll_bonus')]
  },
  {
    id: 'quantum_crypto_wallet',
    name: '양자 암호 지갑',
    icon: '🔒',
    class: 'Item',
    tier: 'T4',
    price: 155000,
    desc: '보안과 수익을 동시에 챙기는 미래형 지갑입니다.',
    effects: [getItemEffect('rake_reduction'), getItemEffect('blind_discount')]
  },
  {
    id: 'quantum_pocket_watch',
    name: '양자 포켓 워치',
    icon: '⌚',
    class: 'Item',
    tier: 'T4',
    price: 185000,
    desc: '시간과 운명이 겹치는 찰나의 순간을 포착합니다.',
    effects: [getItemEffect('quantum_luck'), getItemEffect('time_bank_plus')]
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
    name: '탈주 AI의 파편',
    icon: '👾',
    class: 'Item',
    tier: 'T4',
    price: 195000,
    desc: '통제 불가능한 AI가 당신의 시스템을 뒤흔듭니다.',
    effects: [getItemEffect('lt_regen_plus'), getRndItemBucket]
  },
  {
    id: 'second_chance_script_v2',
    name: '두 번째 찬스 v2',
    icon: '✌️',
    class: 'Item',
    tier: 'T4',
    price: 122000,
    desc: '한 번의 실수를 덮어줄 수 있는 더 나은 코드입니다.',
    effects: [getItemEffect('initial_bankroll_bonus'), getItemEffect('pair_master')]
  },
  {
    id: 'vip_lounge_keycard',
    name: 'VIP 키카드',
    icon: '💳',
    class: 'Item',
    tier: 'T4',
    price: 190000,
    desc: '대부분의 카지노에서 최고급 대우를 보장하는 신분 상징입니다.',
    effects: [getItemEffect('rake_reduction'), getItemEffect('blind_discount')]
  },
  {
    id: 'blind_folding_fan',
    name: '접이식 부채',
    icon: '🪭',
    class: 'Item',
    tier: 'T4',
    price: 130000,
    desc: '부채질로 한번으로 느긋함과 우아함 두가지를 동시에 잡습니다.',
    effects: [getItemEffect('blind_discount'), getItemEffect('loyalty_card')]
  },
  // --- T5 items (Rare + 2 Random, 200000 - 500000 CR) ---
  {
    id: 'black_market_ring',
    name: '암상인의 반지',
    icon: '💍',
    class: 'Item',
    tier: 'T5',
    price: 220000,
    desc: '이 반지는 암시장에서 통용되는 상징입니다.',
    effects: [getItemEffect('loyalty_card'), getItemEffect('straight_flush_master'), getRndItemBucket]
  },
  {
    id: 'ancient_pot',
    name: '고대 항아리',
    icon: '🏺',
    class: 'Item',
    tier: 'T5',
    price: 398000,
    desc: '이 항아리에 깃든 고대의 행운은 과학적으로 증명되지 않았습니다. 하지만 당신의 팟을 키워준다는 소문만은 시장에서 아주 비싸게 팔리죠',
    effects: [getRndItemBucket, getRndItemBucket]
  },
  {
    id: 'eiffel_tower',
    name: '에펠탑',
    icon: '🗼',
    class: 'Item',
    tier: 'T5',
    price: 332000,
    desc: '과거 파리의 상징이자 랜드마크"였"습니다. 이제는 초거대 기업의 고출력 송신 안테나로 쓰이고 있습니다.',
    effects: [getItemEffect('stemina_regen'), getItemEffect('stemina_regen'), getItemEffect('stemina_regen')]
  },
  {
    id: 'statue_of_liberty',
    name: '자유의 여신상',
    icon: '🗽',
    class: 'Item',
    tier: 'T5',
    price: 430000,
    desc: '모두에게 부자가 될 기회는 공평하게 주어집니다. 다만, 당신의 잔고가 공평하지 않을 뿐이죠',
    effects: [getItemEffect('buy_in_multiply'), getItemEffect('buy_in_multiply'), getItemEffect('buy_in_multiply')]
  },
  {
    id: 'neural_link_v3',
    name: '뉴럴 링크 v3',
    icon: '🧠',
    class: 'Item',
    tier: 'T5',
    price: 215000,
    desc: '뇌와 AI Agent 시스템을 직접 연결하여 한계를 돌파합니다.',
    effects: [getItemEffect('lt_regen_plus'), getItemEffect('lt_recovery'), getRndItemBucket]
  },
  {
    id: 'sailing_yacht',
    name: '여가용 요트',
    icon: '⛵',
    class: 'Item',
    tier: 'T5',
    price: 215000,
    desc: '요즘은 볼 수 없는 돛이 달린 여가용 요트, 느긋함을 느낄 수 있습니다.',
    effects: [getItemEffect('four_of_a_kind_master'), getItemEffect('stemina_regen'), getItemEffect('time_bank_plus')]
  },
  {
    id: 'khamsa',
    name: '파티마의 손',
    icon: '🪬',
    class: 'Item',
    tier: 'T5',
    price: 275000,
    desc: '이슬람교, 유대교, 불교, 기독교를 포함한 여러 종교에 중요한 고대 상징이며 행운, 보호, 인도, 여성의 힘, 믿음을 의미합니다.',
    effects: [getItemEffect('showdown_lose_refund'), getItemEffect('showdown_lose_refund'), getItemEffect('showdown_lose_refund')]
  },
  {
    id: 'CD',
    name: 'CD',
    icon: '💿',
    class: 'Item',
    tier: 'T5',
    price: 213500,
    editable: false,
    desc: '이거 컵 받침대 아니였나요?',
    effects: [getItemEffect('lt_recovery'), getItemEffect('lt_recovery'), getItemEffect('lt_recovery')]
  },
  {
    id: 'titanium_insurance_policy',
    name: '티타늄 보험 증권',
    icon: '📜',
    class: 'Item',
    tier: 'T5',
    price: 320000,
    desc: '세상 그 어떤 파산도 당신을 멈출 수 없습니다.',
    effects: [getItemEffect('initial_bankroll_bonus'), getItemEffect('initial_bankroll_bonus'), getItemEffect('rake_reduction')]
  },
  {
    id: 'golden_dragon_statue',
    name: '황금 용 조각상',
    icon: '🐉',
    class: 'Item',
    tier: 'T5',
    price: 280000,
    desc: '팟을 삼키는 용의 기운이 승리를 가져옵니다.',
    effects: [getItemEffect('buy_in_multiply'), getItemEffect('pot_bonus'), getItemEffect('pot_bonus')]
  },
  {
    id: 'golden_hand_statue',
    name: '황금손 조각상',
    icon: '🖐️',
    class: 'Item',
    tier: 'T5',
    price: 310000,
    desc: '팟을 가져올 때 더 많은 칩이 따라오게 유혹합니다.',
    effects: [getItemEffect('golden_touch'), getItemEffect('golden_touch'), getItemEffect('golden_touch')]
  },
  {
    id: 'star_of_africa',
    name: '스타 오브 아프리카',
    icon: '💎',
    class: 'Item',
    tier: 'T5',
    price: 380000,
    desc: '세계에서 가장 큰 "자연산" 다이몬드 입니다! ...요즘은 더 이상 의미없긴 하지만요!',
    effects: [getItemEffect('allin_insurance'), getItemEffect('diamond_collector'), getRndItemBucket]
  },
  {
    id: 'loan_shark_funding',
    name: '악덕 대부업자의 대출자금',
    icon: '💰',
    class: 'Item',
    tier: 'T5',
    price: 210000,
    desc: '파산을 하셨나요? 걱정 마세요. 더 큰 돈으로 따서 갚으면 그만입니다.',
    effects: [getItemEffect('buy_in_multiply'), getItemEffect('buy_in_multiply'), getItemEffect('initial_bankroll_bonus')]
  },
  {
    id: 'casino_insider',
    name: '카지노 관계자',
    icon: '🤵',
    class: 'Item',
    tier: 'T5',
    price: 330000,
    desc: '카지노 관계자는 당연하게도 카지노 시설을 손님보다 저렴하게 이용가능합니다.',
    effects: [getItemEffect('rake_reduction'), getItemEffect('rake_reduction'), getItemEffect('rake_reduction')]
  },
  {
    id: 'blind_maker',
    name: '장님 제조기',
    icon: '🔦',
    class: 'Item',
    tier: 'T5',
    price: 360000,
    desc: '다른 세계에선 엔티티의 눈을 멀게 하는데 쓰였다고 합니다.\n여기선 블라인드를 막는 데 사용됩니다.',
    effects: [getItemEffect('blind_discount'), getItemEffect('blind_discount'), getItemEffect('blind_discount')]
  },
  {
    id: 'universal_membership_card',
    name: '범우주 카지노 멤버십 카드',
    icon: '💳',
    class: 'Item',
    tier: 'T5',
    price: 430000,
    desc: '은하계 그 어느 카지노에서도 상상 초월의 우대를 받습니다.',
    effects: [getItemEffect('rake_reduction'), getItemEffect('buy_in_multiply'), getItemEffect('blind_discount')]
  },
  {
    id: 'ev_recovery_core',
    name: 'EV 복구 코어',
    icon: '🛑',
    class: 'Item',
    tier: 'T5',
    price: 260000,
    desc: '완벽한 백업 시스템을 통해 잘못된 결정으로 인한 -EV를 복구합니다.',
    effects: [getItemEffect('quantum_fold'), getItemEffect('quantum_fold'), getItemEffect('quantum_fold')]
  },
  {
    id: 'atomic_clock_stabilizer',
    name: '원자시계 안정기',
    icon: '⌛',
    class: 'Item',
    tier: 'T5',
    price: 415000,
    desc: '우주의 시간을 기준으로 연산을 동기화하여 시스템의 안정을 돕습니다.',
    effects: [getItemEffect('lt_regen_plus'), getItemEffect('lt_regen_plus'), getItemEffect('time_bank_plus')]
  },
  {
    id: 'reincarnation_protocol',
    name: '환생 프로토콜',
    icon: '𓋹',
    class: 'Item',
    tier: 'T5',
    price: 240000,
    desc: '죽음(파산)은 새로운 시작에 불과함을 코드로 증명합니다.',
    effects: [getItemEffect('initial_bankroll_bonus'), getItemEffect('initial_bankroll_bonus'), getRndItemBucket]
  },

  {
    id: 'casino_insider_nemesis',
    name: '불법 카지노 관계자의 천적',
    icon: '👹',
    class: 'Item',
    tier: 'T5',
    price: 305000,
    desc: '불법 카지노 관계자들은 그의 이름만 들어도 치가 떨립니다.',
    effects: [getItemEffect('rake_reduction'), getItemEffect('rake_reduction'), getItemEffect('blind_discount')]
  },
  {
    id: 'monopoly_pass',
    name: '독점 거래 허가권',
    icon: '📜',
    class: 'Item',
    tier: 'T5',
    price: 435000,
    desc: '시장의 모든 아이템을 당신만이 누릴 수 있는 특가로 제공받습니다.',
    effects: [getItemEffect('loyalty_card'), getItemEffect('loyalty_card'), getItemEffect('loyalty_card')]
  },
  {
    id: 'wpt_championship_medal',
    name: 'WPT 우승 메달',
    icon: '🏅',
    class: 'Item',
    tier: 'T5',
    price: 215000,
    desc: '이 메달을 보여주는 것만으로도 다양한 혜택을 받을 겁니다.',
    effects: [getItemEffect('buy_in_multiply'), getItemEffect('blind_discount'), getItemEffect('rake_reduction')]
  },
  {
    id: 'movie_rounders_dvd',
    name: '영화 라운더스 DVD 소장판',
    icon: '📀',
    class: 'Item',
    tier: 'T5',
    price: 370000,
    desc: '옛날이나 지금이나 포커을 플레이하는 방식은 크게 바뀌지 않은거 같습니다.',
    effects: [getItemEffect('double_down'), getItemEffect('golden_touch'), getItemEffect('failure_is_mother_of_success')]
  },
  {
    id: 'flush_master_ring',
    name: '플러시 마스터 링',
    icon: '💍',
    class: 'Item',
    tier: 'T5',
    price: 420000,
    desc: '같은 색상의 카드들이 모일 때, 진정한 힘이 깨어납니다.',
    effects: [getItemEffect('flush_master'), getRndItemBucket, getRndItemBucket]
  },
  {
    id: 'full_house_blueprint',
    name: '풀하우스 설계도',
    icon: '🏗️',
    class: 'Item',
    tier: 'T5',
    price: 480000,
    desc: '완벽한 조화를 이루는 핸드로 승리하는 비결을 담고 있습니다.',
    effects: [getItemEffect('full_house_master'), getRndItemBucket, getRndItemBucket]
  },

  // --- T6 items (Epic + 2 Random, 500000+ CR) ---
  {
    id: 'fusion_core_mini',
    name: '소형 융합 코어',
    icon: '☢️',
    class: 'Item',
    tier: 'T6',
    price: 1990000,
    desc: '작은 도시 절반을 밝힐 에너지를 에이전트에 집중시킵니다. 인류의 미래보다 당신의 성공이 더 중요하니까요.',
    effects: [getItemEffect('lt_regen_plus'), getItemEffect('lt_regen_plus'), getItemEffect('lt_regen_plus')]
  },
  {
    id: 'card_of_the_card_shark',
    name: '타짜의 화투',
    icon: '🎴',
    class: 'Item',
    tier: 'T6',
    price: 2600000,
    desc: '동작 그만, 밑장 빼기냐?',
    effects: [getItemEffect('ghost_bet'), getItemEffect('golden_touch'), getRndItemBucket]
  },
  {
    id: 'destiny_rewriter',
    name: '운명 변조기',
    icon: '✍️',
    class: 'Item',
    tier: 'T6',
    price: 2200000,
    desc: '이미 정해진 카드의 운명조차 당신의 뜻대로 바꿉니다.',
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
    name: '우연한 행운의 노드',
    icon: '🍀',
    class: 'Item',
    tier: 'T6',
    price: 2100000,
    desc: '모든 우연을 필연적인 승리로 연결합니다.',
    effects: [getItemEffect('quantum_luck'), getItemEffect('quantum_luck'), getRndItemBucket]
  },
  {
    id: 'code_of_creation',
    name: '창조의 소스 코드',
    icon: '🧬',
    class: 'Item',
    tier: 'T6',
    price: 3000000,
    desc: '이 세계를 구성하는 근원적인 코드에 접근합니다.',
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
    name: '기적 구현 스크립트',
    icon: '✨',
    class: 'Item',
    tier: 'T6',
    price: 2400000,
    desc: '확률적으로 불가능한 일들을 현실로 만들어냅니다.',
    effects: [getItemEffect('straight_flush_master'), getItemEffect('quantum_luck'), getItemEffect('golden_touch')]
  },
  {
    id: 'deus_ex_machina_mod',
    name: '데우스 엑스 마키나',
    icon: '🤖',
    class: 'Item',
    tier: 'T6',
    price: 2600000,
    desc: '절체절명의 순간, 기계 신이 강림하여 운명을 바꿉니다.',
    effects: [getItemEffect('quantum_luck'), getItemEffect('quantum_luck'), getItemEffect('golden_touch')]
  },

  {
    id: 'aurum_processor_z',
    name: '오럼 프로세서 Z',
    icon: '⚡',
    class: 'Item',
    tier: 'T6',
    price: 2000000,
    desc: '초고속 연산을 통해 모든 고부가 가치 정보를 선점합니다.',
    effects: [getItemEffect('club_collector'), getItemEffect('spade_collector'), getItemEffect('heart_collector')]
  },
  {
    id: 'destiny_slot_machine',
    name: '운명의 슬롯 머신',
    icon: '🎰',
    class: 'Item',
    tier: 'T6',
    price: 2250000,
    desc: '운명과 벌이는 마지막 도박에서 반드시 승리하게 해줍니다.',
    effects: [getItemEffect('omen'), getItemEffect('lucky_7_collector'), getRndItemBucket]
  },
  {
    id: 'synapse_reading_protocol',
    name: '시냅스 리딩 프로토콜',
    icon: '👁️',
    class: 'Item',
    tier: 'T6',
    price: 880000,
    desc: '상대방의 생각을 꿰뚫어 봅니다...',
    effects: [getItemEffect('synapse_reading'), getItemEffect('time_bank_plus'), getItemEffect('time_bank_plus')]
  },
  {
    id: 'royal_flush_crown',
    name: '왕실 왕관',
    icon: '👑',
    class: 'Item',
    tier: 'T6',
    price: 950000,
    desc: '왕의 귀환. 최고의 족보로 최고의 명예를 누리십시오.',
    effects: [getItemEffect('royal_flush_master'), getRndItemBucket, getRndItemBucket]
  },
  {
    id: 'guardian_angel_program',
    name: '수호천사 데몬',
    icon: '👼',
    class: 'Item',
    tier: 'T6',
    price: 770000,
    desc: '보이지 않는 곳에서 당신의 칩을 지켜주는 프로그램입니다.',
    effects: [getItemEffect('allin_insurance'), getItemEffect('allin_insurance'), getItemEffect('allin_insurance')]
  },
];

export const getItemById = (id) => {
  return ITEM_DATA.find(item => item.id === id);
};

export const materializeItem = (baseItem) => {
  if (!baseItem) return null;
  const instance = { ...baseItem, instanceId: getinstanceId(baseItem) };

  if (instance.effects) {
    const effectMap = {};
    const merged = [];

    instance.effects.forEach(eff => {
      const resolved = (typeof eff === 'function') ? eff() : eff;
      if (!resolved) return;

      if (effectMap[resolved.id]) {
        effectMap[resolved.id].value += resolved.value;
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
export const getinstanceId = (baseItem) => `${baseItem.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
