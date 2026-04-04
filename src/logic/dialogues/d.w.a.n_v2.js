import { CHAT_TRIGGERS } from '../constants.js';

export const DWAN_V2_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "durrr...",
      "...",
      "Let's play big pots.",
      "Deep stack poker.",
      "Action."
    ],
    ko: [
      "durrr...",
      "...",
      "거대 팟 좀 만들어보자고.",
      "딥 스택 포커, 이게 진짜지.",
      "액션 가자."
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "...",
      "Ships.",
      "Standard.",
      "Easy game.",
      "Nice stack."
    ],
    ko: [
      "...",
      "칩 가져오마.",
      "정석이지.",
      "쉬운 게임이야.",
      "스택 좋군."
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: [
      "...",
      "Meh.",
      "Whatever.",
      "Chips.",
      "Take it."
    ],
    ko: [
      "...",
      "흠.",
      "아무래도 좋아.",
      "칩 추가.",
      "가져가마."
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "...",
      "Wow.",
      "Sick cooler.",
      "Rigged?",
      "Unlucky."
    ],
    ko: [
      "...",
      "와우.",
      "지독한 쿨러네.",
      "조작된 거 아냐?",
      "운이 없었어."
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: [
      "...",
      "Whatever.",
      "Small.",
      "Next.",
      "Meh."
    ],
    ko: [
      "...",
      "상관없어.",
      "작은 거네.",
      "다음.",
      "별로."
    ]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: [
      "...",
      "Chop.",
      "Split.",
      "Tie.",
      "Move on."
    ],
    ko: [
      "...",
      "찹.",
      "나눠.",
      "비겼군.",
      "넘어가자."
    ]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "...",
      "All in.",
      "Maximum pressure.",
      "Can you call?",
      "Shove."
    ],
    ko: [
      "...",
      "올인.",
      "최대 압박이야.",
      "받을 수 있겠어?",
      "밀어 넣지."
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "...",
      "Fold.",
      "Boring.",
      "Next.",
      "Pass."
    ],
    ko: [
      "...",
      "폴드.",
      "지루해.",
      "다음.",
      "패스."
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: [
      "...",
      "Betting.",
      "Putting pressure.",
      "Sizing."
    ],
    ko: [
      "...",
      "배팅.",
      "압박 들어간다.",
      "사이즈 조절 중."
    ]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "...",
      "Punish.",
      "Expensive.",
      "Raise."
    ],
    ko: [
      "...",
      "응징 중이지.",
      "비싸질 거야.",
      "레이즈."
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "...",
      "Call.",
      "Looking.",
      "Snap.",
      "Float."
    ],
    ko: [
      "...",
      "콜.",
      "지켜보는 중.",
      "스냅 콜.",
      "플로팅."
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: [
      "...",
      "Check.",
      "Slow.",
      "Wait.",
      "Pass."
    ],
    ko: [
      "...",
      "체크.",
      "천천히 가자.",
      "기다리지.",
      "패스."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "...",
      "Sick.",
      "Busted.",
      "Reload.",
      "Gg."
    ],
    ko: [
      "...",
      "지독하군.",
      "다 털렸어.",
      "재충전한다.",
      "지지."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "...",
      "Owned.",
      "Nice hand.",
      "Bye.",
      "Gg."
    ],
    ko: [
      "...",
      "내 장중에 있군.",
      "좋은 핸드였어.",
      "잘 가.",
      "지지."
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "...",
      "Thinking? Action is better. Hurry.",
      "Time is a resource. Don't waste mine.",
      "The clock is ticking. Are you scared?",
      "Decision needed. Now."
    ],
    ko: [
      "...",
      "고민 중? 액션이 낫지. 서둘러.",
      "시간은 자산이야. 내 시간 낭비하지 마.",
      "시간 가고 있어. 쫄았어?",
      "결정해. 지금 당장."
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "...",
      "Deep stack, big pot. This is real poker.",
      "Significant capital concentration. Interesting.",
      "Massive volatility. My favorite state.",
      "The outcome of this pot defines the session."
    ],
    ko: [
      "...",
      "딥 스택, 거대 팟. 이게 진짜 포커지.",
      "자본이 고농축됐군. 흥미로워.",
      "엄청난 변동성... 내가 제일 좋아하는 상태지.",
      "이 팟의 결과가 세션을 결정할 거야."
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "...",
      "I put you on a draw. I was right. Ships.",
      "The math was against me, but my gut said call. Victory.",
      "Your range had a hole. I exploited it.",
      "I paid to see, and I liked what I saw. My pot."
    ],
    ko: [
      "...",
      "너 드로우라고 생각했지. 내가 맞았어. 칩 가져오마.",
      "수학적으로는 불리했지만 리딩이 콜 하라더군. 승리.",
      "네 핸드 범위에 구멍이 있었어. 내가 뚫어버렸지.",
      "구경값 냈고, 결과도 만족스럽군. 내 팟이야."
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "...",
      "You caught me. Sick call. Gg.",
      "A failed exploitation attempt. Adjusting.",
      "My story was weak this time. Noted.",
      "You actually called that? Brave child."
    ],
    ko: [
      "...",
      "날 잡았나? 지독한 콜이군. 지지.",
      "착취 시도 실패. 보정하겠어.",
      "이번 시나리오는 좀 빈약했나 보군. 분석 완료.",
      "진짜 그걸 받았어? 용감하네."
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "Is that a raise? Let's make it a reraise.",
      "I'm not folding to that. Reraise.",
      "Feeling creative. Reraise.",
      "You want to play for the whole stack? Reraise.",
      "Keeping the pressure at maximum. Reraise."
    ],
    ko: [
      "그게 레이즈야? 리레이즈로 받아쳐 주지.",
      "그 정도론 안 죽어. 리레이즈.",
      "창의적으로 가볼까. 리레이즈.",
      "스택 전부를 걸고 해볼까? 리레이즈.",
      "압박을 최고조로 유지한다. 리레이즈."
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking back. I'll take the free card.",
      "Check. Let's see what you do on the next street.",
      "Interesting spot. I'll just check for now.",
      "Keeping the range wide. Check back.",
      "Free information? Yes, please. Check."
    ],
    ko: [
      "체크백. 공짜 카드 좀 보지.",
      "체크. 다음 스트리트에서 어떻게 하는지 볼까.",
      "흥미로운 상황이군. 일단은 체크.",
      "범위를 넓게 유지하지. 체크백.",
      "공짜 정보? 좋지. 체크."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "I'm making a disciplined fold. For once. Fold.",
      "Actually folding here. Good bet.",
      "Strong hand, but I'll find a better spot to bluff. Fold.",
      "Laying it down. You win this round.",
      "Saving it for a bigger pot. Fold."
    ],
    ko: [
      "절제된 폴드다. 이번 한 번만이지. 폴드.",
      "좋은 배팅이었어.",
      "강한 패지만, 블러핑할 더 좋은 기회를 보지. 폴드.",
      "내려놓지. 이번 라운드는 네 승리야.",
      "더 큰 판을 위해 아껴두마. 폴드."
    ]
  }
};
