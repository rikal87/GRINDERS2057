import { CHAT_TRIGGERS } from '../constants.js';

export const VANGUARD_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "Let's play professional poker.",
      "Stability is the key to winning.",
      "I'm here to execute the game plan.",
      "Good luck. You'll need it.",
      "Game on."
    ],
    ko: [
      "프로답게 한판 쳐보자고.",
      "안정감이 곧 승패를 가르는 법이야.",
      "제대로 된 게임 플랜을 보여주지.",
      "행운을 빌어. 꽤 필요할 거야.",
      "게임 시작이다."
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "Plan executed perfectly.",
      "A solid result. No surprises.",
      "I saw that coming. Good hand.",
      "Maximum value extracted.",
      "This is how we build a stack."
    ],
    ko: [
      "플랜대로 완벽하게 실행됐군.",
      "견고한 결과야. 놀랄 것도 없지.",
      "충분히 예상했던 일이야. 좋은 패였어.",
      "가치를 최대로 뽑아냈네.",
      "이렇게 스택을 쌓아가는 거야."
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: [
      "Incremental gains are standard.",
      "Nice.",
      "Stay focused.",
      "Good.",
      "One hand at a time."
    ],
    ko: [
      "자잘한 수익도 표준적인 과정일 뿐이야.",
      "나이스.",
      "계속 집중하자고.",
      "좋아.",
      "한 판 한 판씩 차근차근 가지."
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "An unfortunate outcome.",
      "Review needed, but moving on.",
      "Variance happens to the best of us.",
      "That was unexpected.",
      "I'll adapt for the next street."
    ],
    ko: [
      "불운한 결과군.",
      "복기가 좀 필요하겠지만, 일단 넘어가자고.",
      "변동성은 누구에게나 일어나는 법이니까.",
      "예상 밖이었어.",
      "다음 거리에서 다시 보정하지."
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: [
      "Minor deviation. No issue.",
      "Whatever.",
      "Moving on.",
      "Noted.",
      "Next."
    ],
    ko: [
      "사소한 편차일 뿐이야. 문제없어.",
      "상관없어.",
      "다음 판 가자.",
      "분석 완료.",
      "다음."
    ]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: [
      "Standard split.",
      "Tie.",
      "Correct.",
      "Chop.",
      "Next hand."
    ],
    ko: [
      "표준적인 찹이네.",
      "비겼어.",
      "정확한 결과군.",
      "찹 하도록 하지.",
      "다음 핸드 부탁해."
    ]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "Max pressure now.",
      "It's the optimal decision.",
      "Calculated all in.",
      "Are you ready for this?",
      "Committed."
    ],
    ko: [
      "최대의 압박을 가할 때군.",
      "최적의 결정이야.",
      "계산된 올인이다.",
      "준비됐어?",
      "승부처다."
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "Sub-optimal hand. Fold.",
      "Throwing away garbage.",
      "Not this time.",
      "Fold.",
      "Next."
    ],
    ko: [
      "최적이 아닌 핸드네. 폴드.",
      "쓰레기는 버려야지.",
      "이번엔 아니야.",
      "폴드.",
      "다음."
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: [
      "Testing the range.",
      "Standard bet.",
      "Action.",
      "I bet.",
      "Sizing optimized."
    ],
    ko: [
      "범위 테스트 좀 해보지.",
      "표준적인 배팅이야.",
      "액션 하겠어.",
      "배팅.",
      "사이징 완료."
    ]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "Increasing the price.",
      "Standard raise.",
      "Your turn.",
      "Raise.",
      "Building the pot."
    ],
    ko: [
      "가격 좀 올려보지.",
      "표준적인 레이즈야.",
      "네 차례다.",
      "레이즈.",
      "팟 키우는 중이야."
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "I'll see the data.",
      "Call.",
      "Show me the card.",
      "I have to know.",
      "Standard."
    ],
    ko: [
      "데이터 확인 좀 하지. 콜.",
      "콜.",
      "카드 보여줘 봐.",
      "리딩 확인이 필요해.",
      "표준적인 판단이야."
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: [
      "Check.",
      "Observing the board.",
      "Your move.",
      "Pass.",
      "Standard check."
    ],
    ko: [
      "체크.",
      "보드 상황 좀 보지.",
      "네 차례야.",
      "패스.",
      "표준적인 체크야."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "Execution failed.",
      "I'm out of here.",
      "Wait for my return.",
      "Damn it.",
      "Gg everyone."
    ],
    ko: [
      "실행 실패군.",
      "난 여기까지야.",
      "복수하러 돌아오마.",
      "빌어먹을.",
      "다들 고생했어."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "Target out of session.",
      "One less player at Table.",
      "Calculated victory.",
      "See ya.",
      "Well played."
    ],
    ko: [
      "상대방 세션 탈퇴 확인.",
      "테이블에서 인원 하나 줄었네.",
      "계산된 승리야.",
      "잘 가.",
      "수고했어."
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Hurry up! Precision requires focus, not sleeping on the trigger.",
      "Thinking? This is standard situation. Make a move.",
      "Decision time. Tick-tock. Don't waste my cycles.",
      "Decide or fold. My patience is optimized for speed.",
      "Hurry! I need the next rush!"
    ],
    ko: [
      "서둘러! 정밀함은 집중에서 나오는 법이지, 졸고 있으면 안 돼.",
      "고민 중? 이건 아주 표준적인 상황이야. 어서 움직여.",
      "결정할 시간이야. 똑딱똑딱. 내 시간을 낭비하지 마.",
      "결정하든가 폴드하든가. 내 인내심은 속도에 맞게 최적화돼 있어.",
      "빨리! 다음 상황이 필요해."
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "Significant resources. This is what separates the winners from the rest.",
      "This is what I live for! Pure risk! Pure reward!",
      "An interesting pile... almost glowing with potential value.",
      "Significant pressure. I'll maintain my professional composure.",
      "Huge pot! To the moon! Let's make it a career-defining moment."
    ],
    ko: [
      "막대한 재원이군. 여기서 승자와 패자가 갈리는 법이야.",
      "내가 바로 이걸 원했지! 순수한 리스크, 순수한 보상!",
      "흥미로운 칩 산더미군... 가치가 뚝뚝 떨어지는 것 같네.",
      "최대의 압박! 난 내 프로다운 침착함을 유지하겠어.",
      "거대 팟이다! 가보자고. 오늘 세션의 정점이네."
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "Your story lacked consistency! I saw the bluff immediately. Hahaha!",
      "I followed the math and won. Professional read is superior to your story.",
      "My intuition is over 9000 today! Caught you red-handed!",
      "I love it when people try to trick a pro. It's an expensive lesson.",
      "Haha! I just felt like calling, and look what happened! Jackpot!"
    ],
    ko: [
      "네 연기는 일관성이 부족했어! 블러핑인 거 바로 눈치챘지. 하하!",
      "수학적 확률을 따라가서 얻은 승리야. 프로의 리딩은 네 시나리오보다 앞서지.",
      "내 직관력은 오늘 최고조야! 뻥카 딱 걸렸구만!",
      "프로를 속이려 들다니. 꽤 비싼 교훈이 됐을 거야.",
      "하하! 그냥 콜 하고 싶어서 했는데 결과 좀 봐! 잭팟이다!"
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "Hahaha! You caught my misdirection. Well played, partner.",
      "A failed attempt at blowing up the pot. Strategic error on my part.",
      "You actually called that? I overestimated your courage.",
      "Ah well, my plot was a bit too wild, I guess. Again!",
      "Caught! At least it was a professional disaster, right?"
    ],
    ko: [
      "하하하! 내 교란 작전을 잡아내셨구만. 잘했어.",
      "팟 폭발 시도 성공인가? 내 전략적 실수야.",
      "진짜 그걸 받아냈어? 네 용기를 과소평가했나 보네.",
      "뭐, 이번엔 내 시나리오가 너무 황당했나 보네. 한판 더 하까!",
      "딱 걸렸네! 뭐, 그래도 아주 프로다운 재난은 만들었으니 됐나?"
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "Re-establishing the initiative. Reraise.",
      "I'm not bowing down! Raise again! More pressure!",
      "Optimal counter-move: Reraise.",
      "Professional response. Reraise.",
      "Dueling in the fire. Reraise."
    ],
    ko: [
      "주도권을 다시 가져오겠어. 리레이즈.",
      "난 절대 굴복 안 해! 다시 레이즈! 압박을 더 키워보지.",
      "최적의 카운터 조치: 리레이즈.",
      "프로다운 대처야. 리레이즈.",
      "불꽃 속에서 결투다! 리레이즈 하겠어."
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking! Keeping the game in intellectual equilibrium.",
      "I'll take the free card and chase the dream. Check.",
      "Keeping the pot small. Professional safety first. Check.",
      "Your turn, pro. I'm watching. Check.",
      "Chaos in waiting. Check back."
    ],
    ko: [
      "체크! 승부를 지적인 평형 상태로 유지하지.",
      "공짜 카드 좀 보고 꿈을 쫓아보겠어. 체크.",
      "팟 규모를 조절하지. 프로다운 안전함이 제일이니까. 체크.",
      "네 차례다. 지켜보고 있지. 체크.",
      "혼돈의 대기 상태. 체크백."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "I'm folding. Even I can't find a reason to bet on this. Fold.",
      "Laying it down. Respect the power. Fold.",
      "Strong hand, but I'm looking for a better duel. Fold.",
      "Ahhh! I hate folding this! Fold.",
      "Saving my resources for a better spot. Fold."
    ],
    ko: [
      "폴드. 나조차도 이번 판에 돈 걸 이유를 못 찾겠어. 물러나지.",
      "내려놓지. 그 기세는 인정해주겠어. 폴드.",
      "좋은 패지만, 더 완벽한 결투를 기약하며 물러나지. 폴드.",
      "으아아! 이거 폴드하기 정말 싫어! 하지만... 폴드.",
      "더 유리한 상황을 위해 자원을 아끼도록 하지. 폴드."
    ]
  }
};
