export const SKILL_DATA = [
  {
    id: 'duel',
    name: 'Duel',
    class: 'Vanguard',
    tier: 'T1',
    ramOccupation: 5,
    ramCost: 2,
    cooldown: 5,
    trigger: 'open_raise',
    desc: '다음 순서의 플레이어가 콜하면, 1:1 구도가 성립될때까지 모든 플레이어는 무조건 레이즈 또는 폴드만 가능',
    effect: (engine, player) => {
      engine.addActiveEffect({ type: 'DUEL_MODE', initiator: player.id });
    }
  },
  {
    id: 'crit_dec',
    name: 'Critical Decision',
    class: 'Vanguard',
    tier: 'T1',
    ramOccupation: 1,
    ramCost: 1,
    cooldown: 1,
    trigger: 'time_bank_zero',
    desc: '타임뱅크 추가 60초 발동',
    effect: (engine, player) => {
      player.timeBank += 60;
    }
  },
  {
    id: 'art_fold',
    name: 'Art of Fold',
    class: 'Vanguard',
    tier: 'T2',
    ramOccupation: 1,
    ramCost: 0,
    cooldown: 1,
    trigger: 'fold_strong',
    desc: '강한 족보로 폴드 시 다음 팟 일시적인 RAM 보너스 지급',
    effect: (engine, player) => {
      player.ram.tempBonus += 2;
    }
  },
  {
    id: 'equity_lock',
    name: 'Equity Lock',
    class: 'Vanguard',
    tier: 'T2',
    ramOccupation: 2,
    ramCost: 4,
    cooldown: 6,
    trigger: 'allin_1v1',
    desc: '1:1 올인 시 상대보다 에퀴티 높으면 내가 드로우 횟수 결정 (최대 3회)',
    effect: (engine, player) => {
      // Handled in resolveShowdown or runout logic
    }
  },
  {
    id: 'threat_mgmt',
    name: 'Threat Management',
    class: 'Vanguard',
    tier: 'T1',
    ramOccupation: 1,
    ramCost: 1,
    cooldown: 1,
    trigger: 'opponent_bet',
    desc: '최대 RAM 일시적 2GB 증가',
    effect: (engine, player) => {
      player.ram.tempMax += 2;
    }
  },
  {
    id: 'nut_adv',
    name: 'Nut Advantage.dll',
    class: 'Vanguard',
    tier: 'T3',
    ramOccupation: 1,
    ramCost: 1,
    cooldown: 1,
    trigger: 'bet_broadway',
    desc: '보드에 브로드웨이 카드 다수 시 RAM 소모 50% 감소',
    effect: (engine, player) => {
      // Cost reduction logic
    }
  },
  {
    id: 'anticheat',
    name: 'Anticheat',
    class: 'Vanguard',
    tier: 'T2',
    ramOccupation: '인원*3',
    ramCost: 3,
    cooldown: 1,
    trigger: 'preflop_start',
    desc: '상대에게 [보안 툴] +1 스택 부여',
    effect: (engine, player) => {
      engine.players.forEach(p => {
        if (p.id !== player.id && p.addStatus) p.addStatus('SECURITY_TOOL');
      });
    }
  },
  // Hijack Skills
  {
    id: 'packet_resend',
    name: 'Packet Resend',
    class: 'Hijack',
    tier: 'T1',
    ramOccupation: 4,
    ramCost: 3,
    cooldown: 1,
    trigger: 'deal_cards',
    desc: '하위 70% 핸드일 경우 카드 교체 (리드로우)',
    effect: (engine, player) => {
      // Logic to replace cards
    }
  },
  {
    id: 'peeking_packet',
    name: 'Peeking Packet',
    class: 'Hijack',
    tier: 'T3',
    ramOccupation: 4,
    ramCost: 6,
    cooldown: 6,
    trigger: 'fold_muck',
    desc: '자신의 핸드 마킹, 다음 판 타인이 소유 시 식별 가능',
    effect: (engine, player) => {
      // Complex logic
    }
  },
  {
    id: 'bit_flip',
    name: 'Bit-Flip',
    class: 'Hijack',
    tier: 'T2',
    ramOccupation: 2,
    ramCost: 4,
    cooldown: 1,
    trigger: 'flop_no_pair',
    desc: '자신의 두 카드의 숫자를 무작위 변경(두 카드 모두 숫자 카드일 경우에만)',
    effect: (engine, player) => {
      // Rank randomization logic
    }
  },
  {
    id: 'suit_swap',
    name: 'Suit Swap',
    class: 'Hijack',
    tier: 'T2',
    ramOccupation: 2,
    ramCost: 6,
    cooldown: 1,
    trigger: 'flop_wrong_suit',
    desc: '자신의 두 카드의 문양을 무작위 변경(두 카드 모두 숫자 카드일 경우에만)',
    effect: (engine, player) => {
      // Suit randomization logic
    }
  },
  {
    id: 'defrag_hand',
    name: 'Defragment:hand',
    class: 'Hijack',
    tier: 'T1',
    ramOccupation: 3,
    ramCost: 5,
    cooldown: 6,
    trigger: 'deal_cards',
    desc: '카드 숫자 조정 (높은 건 -1, 낮은 건 +1)(두 카드 모두 숫자 카드일 경우에만)',
    effect: (engine, player) => {
      // Defrag logic
    }
  },
  // Maniac Skills
  {
    id: 'underdog',
    name: 'Born to be an underdog',
    class: 'Maniac',
    tier: 'T3',
    ramOccupation: 5,
    ramCost: 5,
    cooldown: 1,
    trigger: 'win_allin_underdog',
    desc: '올인 쇼다운에서 (상대 에퀴티 - 자신 에퀴티)의 2배 만큼의 추가 칩을 상대를 버스트 시킬때 얻습니다.',
    effect: (engine, player) => {
      // Bonus calculation
    }
  },
  {
    id: 'chat_rebate',
    name: 'Super Chat Rebate',
    class: 'Maniac',
    tier: 'T1',
    ramOccupation: 3,
    ramCost: 1,
    cooldown: 1,
    trigger: 'action_end',
    desc: '폴드시 -10, 쇼다운시 +5, 올인시 +25 만큼 [후원 미션 마일리지] 스택으로 누적합니다.',
    effect: (engine, player) => {
      // Mileage stack logic
    }
  },
  {
    id: 'luckbox',
    name: 'Luckbox',
    class: 'Maniac',
    tier: 'T1',
    ramOccupation: 3,
    ramCost: 'ALL',
    cooldown: 1,
    trigger: 'win_low_equity',
    desc: '에퀴티 15% 미만 승리 시 소모 RAM 비례 추가 칩',
    effect: (engine, player) => {
      // Bonus logic
    }
  },
  {
    id: 'overclocking',
    name: 'Overclocking',
    class: 'Maniac',
    tier: 'T3',
    ramOccupation: 1,
    ramCost: 8,
    cooldown: 10,
    trigger: 'turn_bet',
    desc: '턴에서 배팅 또는 레이즈로 팟 대비 베팅액 비율만큼 리버에서 스킬 RAM 비용 감소(최대 100%)',
    effect: (engine, player) => {
      // Cost reduction logic
    }
  },
  {
    id: 'leverage',
    name: 'LEVERAGE',
    class: 'Maniac',
    tier: 'T1',
    ramOccupation: 1,
    ramCost: 8,
    cooldown: 0,
    trigger: 'bust',
    desc: '다음 바이인 금액 100BB에서 200BB로 증가',
    effect: (engine, player) => {
      // store.nextBuyInMultiplier = 2; logic should be in engine
    }
  },
  {
    id: 'sharkloan',
    name: 'Sharkloan',
    class: 'Maniac',
    tier: 'T2',
    ramOccupation: 1,
    ramCost: 8,
    cooldown: 1,
    trigger: 'river_action',
    desc: '잔여 스택 100% 추가 베팅 (레이크 3배 지불)',
    effect: (engine, player) => {
      // Loan betting logic
    }
  },
  // Sentinel Skills
  {
    id: 'garbage_col',
    name: 'Garbage Collecting',
    class: 'Sentinel',
    tier: 'T1',
    ramOccupation: 4,
    ramCost: 0,
    cooldown: 1,
    trigger: 'fold_weak',
    desc: '하위 70% 핸드 폴드 시 RAM 1GB 즉시 회복',
    effect: (engine, player) => {
      player.recoverRam(1);
    }
  },
  {
    id: 'def_champ',
    name: 'Defending Champion',
    class: 'Sentinel',
    tier: 'T2',
    ramOccupation: 3,
    ramCost: 0,
    cooldown: 5,
    trigger: 'win_blind_def',
    desc: '블라인드(SB/BB) 방어 승리 시 RAM 회복량 증가',
    effect: (engine, player) => {
      player.recoverRam(2);
    }
  },
  {
    id: 'crypto_mine',
    name: 'Crypto mining',
    class: 'Sentinel',
    tier: 'T2',
    ramOccupation: 5,
    ramCost: 3,
    cooldown: 5,
    trigger: 'call_pot',
    desc: '콜 금액의 10% 해당하는 가상칩을 가상 사이드 팟에 적립',
    effect: (engine, player) => {
      // Mining logic
    }
  },
  {
    id: 'siberia_trap',
    name: 'Siberia trap',
    class: 'Sentinel',
    tier: 'T3',
    ramOccupation: 1,
    ramCost: 5,
    cooldown: 3,
    trigger: 'check_call_trap',
    desc: '상대의 액션에 체크 또는 콜을 할때 1스택을 얻습니다. 리버에서 (중첩된 스택 * 10%)만큼 배팅액 증가 간주.',
    effect: (engine, player) => {
      // Trap logic
    }
  },
  // 공통 Skills
  {
    id: 'quick_scan',
    name: 'Quick Scan',
    class: '공통',
    tier: 'T1',
    ramOccupation: '인원*1',
    ramCost: 1,
    cooldown: 1,
    trigger: 'my_turn',
    desc: '참여자 RAM 용량 확인',
    effect: (engine, player) => {
      // UI reveal
    }
  },
  {
    id: 'mem_purge',
    name: 'Memory Purge',
    class: '공통',
    tier: 'T2',
    ramOccupation: 1,
    ramCost: 8,
    cooldown: 1,
    trigger: 'river_action',
    desc: '리버 스트리트에서 소모 메모리 100% 회복',
    effect: (engine, player) => {
      player.ram.used = 0;
    }
  },
  {
    id: 'basic_fw',
    name: 'Basic Firewall',
    class: '공통',
    tier: 'T1',
    ramOccupation: 3,
    ramCost: 3,
    cooldown: 0,
    trigger: 'debuff_received',
    desc: '해로운 효과 무효화 및 램 소모',
    effect: (engine, player) => {
      // Cleanse logic
    }
  },
  {
    id: 'extra_ram',
    name: 'Extra RAM',
    class: '공통',
    tier: 'T2',
    ramOccupation: 0,
    ramCost: 0,
    cooldown: 0,
    trigger: 'passive',
    desc: '8GB 확장 (레이크 2배 증가 / 누적 가능)',
    effect: (engine, player) => {
      player.class.maxRam += 8;
    }
  },
  {
    id: 'vm_ware',
    name: 'VM WARE',
    class: '공통',
    tier: 'T3',
    ramOccupation: 5,
    ramCost: 0,
    cooldown: 0,
    trigger: 'passive',
    desc: '스킬 슬롯 +1 (본 스킬은 슬롯 미차지)',
    effect: (engine, player) => {
      // Slot logic
    }
  },
  {
    id: 'cloud_computing',
    name: 'Cloud Computing',
    class: '공통',
    tier: 'T3',
    ramOccupation: 0,
    ramCost: 0,
    cooldown: 0,
    trigger: 'passive',
    desc: '메모리 사용량 30% 감소 (레이크 3배 증가 / 누적 가능)',
    effect: (engine, player) => { }
  },
  {
    id: 'prog_optimizer',
    name: 'Program Optimizer',
    class: '공통',
    tier: 'T3',
    ramOccupation: 4,
    ramCost: 0,
    cooldown: 0,
    trigger: 'passive',
    desc: '스킬 실행 메모리 50% 감소',
    effect: (engine, player) => { }
  },
  {
    id: 'universal_driver',
    name: 'Universal Driver',
    class: '공통',
    tier: 'T3',
    ramOccupation: 2,
    ramCost: 0,
    cooldown: 0,
    trigger: 'passive',
    desc: '장착 스킬 개수당 점유 메모리 10% 감소',
    effect: (engine, player) => { }
  },
  {
    id: 'ideal_process',
    name: 'Ideal Process',
    class: '공통',
    tier: 'T2',
    ramOccupation: 2,
    ramCost: 0,
    cooldown: 0,
    trigger: 'passive',
    desc: '빈 슬롯 개수당 프로그램 실행 메모리 10% 감소',
    effect: (engine, player) => { }
  },
  // Ultimates
  {
    id: 'blockchain_enc',
    name: 'BlockChain Encryption',
    class: 'Vanguard',
    tier: 'ULT',
    ramOccupation: 5,
    ramCost: 8,
    cooldown: 1,
    trigger: 'river_action',
    desc: '모든 플레이어 스킬 사용 강제 차단',
    effect: (engine, player) => {
      engine.globalEffects.skillBlock = true;
    }
  },
  {
    id: 'rootkit',
    name: 'Rootkit Access',
    class: 'Hijack',
    tier: 'ULT',
    ramOccupation: 6,
    ramCost: 10,
    cooldown: 10,
    trigger: 'bet_raise',
    desc: '가장 먼저 자신의 배팅 또는 레이즈에 콜한 대상이 소지한 일반 프로그램이 실행할때 자신이 시전한 것으로 판정',
    effect: (engine, player) => {
      // Hijack logic
    }
  },
  {
    id: 'deep_fake',
    name: 'Deep Fake',
    class: 'Hijack',
    tier: 'ULT',
    ramOccupation: 6,
    ramCost: 10,
    cooldown: 5,
    trigger: 'flop_start',
    desc: '커뮤니티 카드 1장을 타인에게 가짜로 노출 (턴까지)',
    effect: (engine, player) => {
      // Visual spoofing
    }
  },
  {
    id: 'chicken_game',
    name: 'Chicken Game',
    class: 'Maniac',
    tier: 'ULT',
    ramOccupation: 6,
    ramCost: 10,
    cooldown: 5,
    trigger: 'turn_action',
    desc: '리버까지 도달한 플레이어 폴드 불가',
    effect: (engine, player) => {
      engine.globalEffects.preventFold = true;
    }
  },
  {
    id: 'limit_holdem',
    name: 'Limit Holdem Rule.exe',
    class: 'Sentinel',
    tier: 'ULT',
    ramOccupation: 3,
    ramCost: 5,
    cooldown: 3,
    trigger: 'preflop_end',
    desc: '베팅 상한선을 팟 크기로 제한',
    effect: (engine, player) => {
      engine.globalEffects.potLimit = true;
    }
  },
  // 보조/특수 상태
  {
    id: 'security_tool',
    name: '보안 툴',
    class: 'Vanguard',
    tier: '0T',
    ramOccupation: 0,
    ramCost: 0,
    cooldown: 0,
    trigger: 'skill_trigger',
    desc: '다음 1회 프로그램 실행에 필요한 RAM 비용 2배(고정)가 되고 1스택 차감됩니다.',
    effect: (engine, player) => { }
  },
  {
    id: 'mileage',
    name: '후원 미션 마일리지',
    class: 'Maniac',
    tier: '0T',
    ramOccupation: 0,
    ramCost: 0,
    cooldown: 0,
    trigger: 'passive',
    desc: '최대 중첩 시 승리할 경우 마일리지 수치를 BB로 계산하여 칩으로 획득',
    effect: (engine, player) => { }
  }
];

export const getSlotConfig = (level) => {
  if (level === 1) return ['T1', 'T1', 'T1'];
  if (level === 2) return ['T1', 'T1', 'T2'];
  if (level === 3) return ['T1', 'T2', 'T2'];
  if (level === 4) return ['T2', 'T2', 'T2'];
  if (level === 5) return ['T2', 'T2', 'T3'];
  if (level === 6) return ['T2', 'T3', 'T3'];
  if (level === 7) return ['T3', 'T3', 'T3'];
  if (level >= 8) return ['ULT', 'T3', 'T3'];
  return ['T1', 'T1', 'T1'];
};
