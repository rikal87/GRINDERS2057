import { CHAT_TRIGGERS } from '../constants.js';

/**
 * Contextual Dialogues evaluated by the AIChatSystem.
 * Evaluated top-to-bottom or by priority.
 * 
 * conditions:
 * - minHandsPlayed: Number (e.g. >= 3)
 * - minNetProfitFromPlayer: Number (positive means NPC won money from player, negative means NPC lost money to player)
 * - maxNetProfitFromPlayer: Number
 * - bustedByPlayer: Boolean
 */
export const CONTEXTUAL_DIALOGUES = [
  // --- GAME START TRIGGERS ---
  {
    trigger: CHAT_TRIGGERS.GAME_START,
    priority: 100,
    conditions: {
      maxNetProfitFromPlayer: -1000 // NPC lost more than 1000 to the player
    },
    text: {
      en: ["I haven't forgotten what you took from me. It's payback time.", "You're not taking my chips this easily today."],
      ko: ["저번에 내 칩들 탈탈 털어간 거, 다 갚아줄 때가 왔다.", "오늘도 저번처럼 호락호락하게 당하진 않아."]
    }
  },
  {
    trigger: CHAT_TRIGGERS.GAME_START,
    priority: 90,
    conditions: {
      minNetProfitFromPlayer: 1000 // NPC won more than 1000 from the player
    },
    text: {
      en: ["Back for more punishment?", "I hope you brought a bigger bankroll this time."],
      ko: ["또 털리러 왔어? 이번엔 지갑 좀 두둑하게 챙겨왔길 바란다.", "내 훌륭한 자금 공급원이 또 오셨군."]
    }
  },
  {
    trigger: CHAT_TRIGGERS.GAME_START,
    priority: 80,
    conditions: {
      minHandsPlayed: 5 // They've met and played at least 5 hands previously
    },
    text: {
      en: ["We seem to run into each other quite often lately.", "You again? Let's just get the cards dealt."],
      ko: ["우리 요즘 꽤 자주 만나는 것 같네.", "또 너야? 길게 말할 것 없이 게임이나 치자고."]
    }
  },

  // --- ELIMINATED ENEMY (NPC bankrupts player) ---
  {
    trigger: CHAT_TRIGGERS.ELIMINATED_ENEMY,
    priority: 100,
    conditions: {
      maxNetProfitFromPlayer: -500 // NPC was losing overall, but finally busted the player
    },
    text: {
      en: ["Finally got you. That covers some of my losses.", "Sweet revenge. See ya."],
      ko: ["드디어 잡았군. 그동안 잃은 거 다 복구했다.", "달콤한 복수야. 잘 가라."]
    }
  },

  // --- LOSE HUGE (NPC loses big pot) ---
  {
    trigger: CHAT_TRIGGERS.LOSE_HUGE,
    priority: 100,
    conditions: {
      minHandsPlayed: 3
    },
    text: {
      en: ["Always you causing me problems.", "Why is it always when I play against you?"],
      ko: ["왜 너랑 칠 때만 항상 이 모양이지?", "너한테는 진짜 칩 주기가 싫은데 말이야."]
    }
  },

  // --- BLUFF_CAUGHT (When a bluff is shown/caught) ---
  {
    trigger: CHAT_TRIGGERS.BLUFF_CAUGHT,
    priority: 80,
    conditions: {
      // Specifically for Maniac or Gambler who love bluffing
      personaIds: ['MANIAC', 'GAMBLER', 'FISH']
    },
    text: {
      en: ["So what if it was a bluff? I'll get you next time.", "You just got lucky. I'll bluff you off the table eventually."],
      ko: ["어쩌라고? 방금 건 운 좋게 걸린 것뿐이야.", "블러프인 거 알았으면 뭐해? 다음엔 무조건 털어주마."]
    }
  },
  {
    trigger: CHAT_TRIGGERS.BLUFF_CAUGHT,
    priority: 70,
    conditions: {}, // Global bluff caught reaction
    text: {
      en: ["A tactical error on my part.", "I underestimated your calling range."],
      ko: ["내 계산에 오차가 있었군.", "생각보다 콜 레인지가 넓군. 다음엔 안 통할 거다."]
    }
  },

  // --- ELIMINATED_SELF (NPC is eliminated by the player) ---
  {
    trigger: CHAT_TRIGGERS.ELIMINATED_SELF,
    priority: 90,
    conditions: {}, // Global
    text: {
      en: ["This isn't over. I'll be back for my chips.", "You won the battle, but I'll win the war."],
      ko: ["이걸로 끝이라고 생각하지 마라. 내 칩 찾으러 다시 올 테니까.", "오늘은 운이 좋았군. 다음에 만나면 각오해라."]
    }
  },

  // --- BLUFF_CAUGHT_FOR_PLAYER (NPC catches a bluff from someone else) ---
  {
    trigger: 'BLUFF_CAUGHT_FOR_PLAYER', // defined in constants, but we use literal here for safety
    priority: 80,
    conditions: {
      // Analytical personas taunt differently
      personaIds: ['SHARK', 'QUANT_PRO', 'THE_DON', 'IVY_00']
    },
    text: {
      en: ["Your bluffing frequency was mathematically inefficient. Thanks for the chips.", "I saw right through your little act. Pathetic."],
      ko: ["수학적으로 전혀 성립하지 않는 뻥카군. 칩은 잘 쓰겠다.", "그 정도 연기로 날 속일 수 있을 거라 생각했나? 한심하군."]
    }
  },
  {
    trigger: 'BLUFF_CAUGHT_FOR_PLAYER',
    priority: 70,
    conditions: {}, // Global catcher taunt
    text: {
      en: ["Nice try, but you can't bluff me.", "Did you really think that garbage would work?"],
      ko: ["어딜 쓰레기 패로 뻥카를 치려고?", "좋은 시도였지만 나한텐 안 통해."]
    }
  }
];
