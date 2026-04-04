import { CHAT_TRIGGERS } from '../constants.js';

export const IVY_00_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "...",
      "I am reading your soul.",
      "Focus.",
      "Class is in session.",
      "Do not blink."
    ],
    ko: [
      "...",
      "네 영혼을 읽고 있지.",
      "집중해.",
      "수업 시작이다.",
      "눈 깜빡이지 마라."
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "...",
      "Efficiency.",
      "As calculated.",
      "Your tell was obvious.",
      "Next hand."
    ],
    ko: [
      "...",
      "효율적이군.",
      "계산대로야.",
      "네 습관은 너무 뻔해.",
      "다음 핸드."
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: [
      "...",
      "Stack building.",
      "Standard.",
      "Expected.",
      "Mine."
    ],
    ko: [
      "...",
      "스택 쌓기.",
      "정석이지.",
      "예상했어.",
      "내 거야."
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "...",
      "Interesting line.",
      "I will adjust.",
      "Variance.",
      "Noted."
    ],
    ko: [
      "...",
      "흥미로운 라인이군.",
      "보정하겠어.",
      "변동성일 뿐이지.",
      "분석 완료."
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: [
      "...",
      "Standard.",
      "Move on.",
      "Small.",
      "Variance."
    ],
    ko: [
      "...",
      "기본적인 결과야.",
      "넘어가자고.",
      "사소하군.",
      "변동성."
    ]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: [
      "...",
      "Chop.",
      "Split.",
      "Tie.",
      "Next."
    ],
    ko: [
      "...",
      "찹.",
      "나눠 갖지.",
      "무승부.",
      "다음."
    ]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "...",
      "I see your fear.",
      "Commit.",
      "Decision made.",
      "All in."
    ],
    ko: [
      "...",
      "네 공포가 보이는군.",
      "승부다.",
      "결정했어.",
      "올인."
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "...",
      "Fold.",
      "Not this time.",
      "Discipline.",
      "Pass."
    ],
    ko: [
      "...",
      "폴드.",
      "이번엔 아냐.",
      "절제하고 있지.",
      "패스."
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: [
      "...",
      "Bet.",
      "Pressure.",
      "Sizing.",
      "Observe."
    ],
    ko: [
      "...",
      "배팅.",
      "압박이다.",
      "적정 사이즈군.",
      "지켜봐라."
    ]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "...",
      "Isolating.",
      "Raise.",
      "Do you have it?",
      "Price goes up."
    ],
    ko: [
      "...",
      "격리 중이지.",
      "레이즈.",
      "정말 가지고 있나?",
      "가격이 올라갔군."
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "...",
      "Call.",
      "Show me.",
      "I know what you have.",
      "Keeping you."
    ],
    ko: [
      "...",
      "콜.",
      "보여줘.",
      "네 패가 뭔지 알아.",
      "계속 가보지."
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: [
      "...",
      "Check.",
      "Waiting.",
      "Trap set?",
      "Go."
    ],
    ko: [
      "...",
      "체크.",
      "기다리지.",
      "함정인가?",
      "진행해."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "...",
      "Impossible.",
      "The math...",
      "Rebooting.",
      "Mistake."
    ],
    ko: [
      "...",
      "말도 안 돼.",
      "수학적으로 봐도...",
      "분석 중이다.",
      "내 실수군."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "...",
      "Dismissed.",
      "Class dismissed.",
      "Predictable.",
      "Empty."
    ],
    ko: [
      "...",
      "퇴장해.",
      "수업 끝이다.",
      "뻔하군.",
      "패가 비었어."
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "...",
      "Your soul is hesitant. Decide.",
      "Tick-tock. The staring won't stop until you move.",
      "Decision needed. The data is already static.",
      "Hurry. Perspective is everything."
    ],
    ko: [
      "...",
      "영혼이 망설이고 있군. 결정해.",
      "똑딱똑딱. 네가 움직일 때까지 이 시선은 멈추지 않아.",
      "결정이 필요해. 데이터는 이미 정해졌어.",
      "서둘러. 관점이 모든 걸 결정하지."
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "...",
      "Significant stakes. Maximum focus.",
      "The gravity of this pile... is intense.",
      "Outcome: Session-defining. Analyzing precision.",
      "Maximum pressure. Let's see who is the real boss."
    ],
    ko: [
      "...",
      "거대한 판돈이군. 최대 압박이다.",
      "이 칩 산더미의 무게... 살벌하군.",
      "결과가 오늘 승패를 가르겠지. 정밀 분석 중이다.",
      "최고 수준의 긴장감이군. 보스가 누군지 확인해보자고."
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "...",
      "I saw your fear. My intuition was right. Mine.",
      "The map was wrong, but the terrain was right. I call and win.",
      "Your aggression was an anomaly. I adjusted.",
      "Result: Accurate read. Profit secured."
    ],
    ko: [
      "...",
      "네 공포가 보였어. 내 직감이 맞았지. 내 거야.",
      "지도는 틀릴 수 있어도, 지형지물은 거짓말을 안 하지. 콜, 그리고 승리.",
      "네 공격성에 빈틈이 보이더군. 보정했다.",
      "결과는 정확한 리딩. 수익 확보 완료."
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "...",
      "You caught the tiger? Good eye.",
      "Caught in the act. I adjusted, but you adjusted better.",
      "Exploitation failed. Analyzing the variance.",
      "Interesting line. I will remember this."
    ],
    ko: [
      "...",
      "사자를 잡았나? 눈썰미가 좋군.",
      "현장에서 잡혔어. 자네가 한수 위였군.",
      "착취 실패. 변동성을 분석하겠다.",
      "흥미로운 라인이야. 똑똑히 기억해두지."
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "Your bet lacks conviction. Reraise.",
      "I'm raising the stakes. Are you prepared?",
      "Reraise. I believe the advantage is mine.",
      "Let's see how much you really value those chips. Reraise.",
      "Countering your aggression with precision. Reraise."
    ],
    ko: [
      "네 배팅엔 확신이 없어. 리레이즈.",
      "판을 키워볼까. 준비됐나? 리레이즈.",
      "리레이즈. 주도권은 내게 있다.",
      "그 칩들이 얼마나 아까운지 보지. 리레이즈.",
      "정밀한 카운터 어택이다. 리레이즈."
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking. No need to reveal my hand prematurely.",
      "Check back. I'll take the free card and the information.",
      "Optimal line from position. Check.",
      "Your move. I'm content to watch for now. Check.",
      "Strategic pause. Check."
    ],
    ko: [
      "체크. 서둘러 보여줄 필요 없지.",
      "체크백. 공짜 카드와 정보는 챙기마.",
      "포지션에서의 최적의 라인이군. 체크.",
      "네 차례다. 일단 지켜보는 걸로 하지. 체크.",
      "전략적 휴지기다. 체크."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "I'm folding. Even a strong hand must be abandoned sometimes.",
      "Discretion is the better part of valor. Fold.",
      "I'll find a more favorable frequency. Fold.",
      "Strong hand, but your action is undeniable. Fold.",
      "Protecting my capital for a better spot. Fold."
    ],
    ko: [
      "폴드. 강한 패라도 때로는 버려야 하는 법.",
      "분별력이 필요할 때지. 폴드.",
      "더 유리한 상황을 기다린다. 폴드.",
      "강한 패지만, 네 액션은 확실하군. 폴드.",
      "자본 보존. 다음 기회를 보지. 폴드."
    ]
  }
};
