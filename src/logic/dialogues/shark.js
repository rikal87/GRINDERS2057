import { CHAT_TRIGGERS } from '../constants.js';

export const SHARK_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "Let's play efficiently.",
      "Identify the fish.",
      "Session started.",
      "Focus.",
      "Bankroll building."
    ],
    ko: [
      "효율적으로 가자고.",
      "피래미가 누군지부터 찾아볼까.",
      "세션 시작이다.",
      "집중해.",
      "자금 확보를 시작하지."
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "As expected.",
      "Maximum value extracted.",
      "Textbook.",
      "Nice donation.",
      "Profit."
    ],
    ko: [
      "예상했던 결과군.",
      "최상의 효율로 가치를 추출했어.",
      "정석 그 자체지.",
      "기부금 고맙군. 잘 쓰지.",
      "수익이 발생했어. 깔끔하네."
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: [
      "Standard variance.",
      "Chip up.",
      "Good pot.",
      "Adding to stack.",
      "Routine."
    ],
    ko: [
      "표준적인 변동성이야.",
      "칩을 하나씩 쌓아가지.",
      "나쁘지 않은 팟이군.",
      "스택에 추가 완료.",
      "일과 같은 수익이야."
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "Noted.",
      "Unfortunate runout.",
      "Bad call.",
      "Mistake logged.",
      "Tilt control."
    ],
    ko: [
      "체크해두지.",
      "리버가 좋지 못했어.",
      "내 실수군. 인정하지.",
      "오류 기록 완료. 보조한다.",
      "냉정함을 유지해. 이제 시작일 뿐이야."
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: [
      "Expected loss.",
      "Part of the game.",
      "Moving on.",
      "Standard.",
      "Noted."
    ],
    ko: [
      "예상 범위 내의 손실이야.",
      "게임의 일부일 뿐이지.",
      "다음 판 가자.",
      "표준적인 결과군.",
      "분석 완료. 다음을 보지."
    ]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: [
      "Chop.",
      "Split equity.",
      "Shared pot.",
      "Next.",
      "Tie."
    ],
    ko: [
      "찹. 에퀴티를 나누지.",
      "동등하게 나눈다.",
      "팟 공유됨. 공평하군.",
      "다음 핸드.",
      "무승부."
    ]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "The math is correct.",
      "Positive EV shove.",
      "Snap call.",
      "No choice.",
      "Commit."
    ],
    ko: [
      "수학적으로 정답이야.",
      "기대값이 높은 올인이지.",
      "고민할 필요 없는 콜이야.",
      "다른 선택지는 없군.",
      "모든 걸 건다."
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "Discipline.",
      "Not profitable.",
      "Folding garbage.",
      "Tight is right.",
      "No value."
    ],
    ko: [
      "절제하고 있어.",
      "수익성이 없군.",
      "쓰레기 패는 빨리 정리해야지.",
      "타이트한 게 정답이야.",
      "기대값이 부족해."
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: [
      "Sizing properly.",
      "Value bet.",
      "Blocker bet.",
      "Extracting.",
      "Bet."
    ],
    ko: [
      "적정 사이즈군.",
      "밸류 배팅 중이다.",
      "블로커 배팅.",
      "가치를 뽑아내지.",
      "배팅."
    ]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "Isolating.",
      "Squeezing.",
      "Value raise.",
      "Punishing limp.",
      "Raise."
    ],
    ko: [
      "격리시키겠다.",
      "압박을 가하지.",
      "추가 가치를 위한 레이즈다.",
      "실수를 했으면 대가를 치러야지.",
      "레이즈."
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "Pot odds.",
      "Implied odds.",
      "Floating.",
      "Keeping you wide.",
      "Call."
    ],
    ko: [
      "팟 오즈가 맞군.",
      "잠재적 가치만 보고 콜 한다.",
      "계속 지켜보겠어.",
      "범위를 넓게 유지하지.",
      "콜."
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: [
      "Pot control.",
      "Balancing range.",
      "Check.",
      "Standard line.",
      "Checking back."
    ],
    ko: [
      "팟 조절 중이야.",
      "범위의 균형을 유지하지.",
      "체크.",
      "표준적인 라인이군.",
      "체크백한다."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "Variance caught up.",
      "Outplayed.",
      "Rebuy needed.",
      "Session over.",
      "Reviewing hand."
    ],
    ko: [
      "변동성에 당했군.",
      "상대가 더 잘했어. 인정하지.",
      "리바이가 필요하겠군.",
      "세션 종료. 고생했다.",
      "복기나 해야겠군."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "Fish gutted.",
      "Bankroll +1.",
      "Efficient.",
      "Next.",
      "Good game."
    ],
    ko: [
      "피래미 정리 완료.",
      "자금 확보 성공.",
      "효율적이군.",
      "다음.",
      "수고했다. 지지."
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Thinking is good, but keep it within standard deviation. Time is money.",
      "Efficient decisions are better than slow perfect ones.",
      "Latency detected. Is the analysis taking that long?",
      "The profit-per-hour is dropping. Please decide.",
      "Decision needed. The math doesn't change with time."
    ],
    ko: [
      "신중한 건 좋지만 길게 끌지 마. 시간은 곧 돈이다.",
      "느리고 완벽한 것보다 빠르고 효율적인 게 낫지. 결정해.",
      "지연 감지. 분석에 그렇게 오래 걸리는 이유가 뭐지?",
      "시간당 수익률이 떨어지고 있어. 어서 버튼이나 눌러.",
      "결정이 필요해. 시간이 지난다고 수학적 흐름이 바뀌진 않아."
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "This pot size is statistically significant. Risk management engaged.",
      "Maximum pressure. Let's see if the nerves hold under load.",
      "Significant capital concentration. Emotional variance risk: High.",
      "Proceeding with maximum data depth. The variance is peak.",
      "This single pot could define the session. Analyzing outcomes."
    ],
    ko: [
      "이 팟의 규모는 통계적으로 유의미해. 위험 관리를 시작하지.",
      "최대 압박 상황. 부하가 걸린 상태에서 평정심을 유지하는지 볼까.",
      "자본이 고농축됐군. 감정적 변동 가능성이 켜졌어.",
      "최대치의 데이터를 동원 중이다. 변동 수치 최고점 도달.",
      "단 한 판으로 승패가 갈릴 수 있겠군. 결과를 분석한다."
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "The probability of a bluff was over the threshold for a call. Logged.",
      "I didn't guess. I calculated the path to the result.",
      "Thin call, but the logic was rock solid.",
      "Your range had an anomaly. I adjusted and secured the pot.",
      "Outcome: Success. Analysis: Accurate."
    ],
    ko: [
      "블러핑 확률이 콜 임계치를 넘었어. 기록해두지.",
      "찍은 게 아냐. 결과에 도달하는 경로를 계산했을 뿐이지.",
      "어려운 콜이었지만, 로직은 완벽했다.",
      "네 핸드 범위에서 이상 징후를 감지하고 팟을 확보했다.",
      "결과: 성공. 분석: 정확."
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "A failed attempt at exploitation. Analyzing the error.",
      "Your call range was wider than expected. Adjusting.",
      "A tactical mistake on my part. The simulation failed.",
      "Caught red-handed. Your logic superseded mine this time.",
      "Negative EV result. Recalibrating my bluff frequencies."
    ],
    ko: [
      "착취 시도 실패. 오류를 분석하겠다.",
      "네 콜 범위가 예상보다 넓었군. 보정해주지.",
      "내 전술적 실수야. 시뮬레이션 실패.",
      "현장에서 검거됐군. 이번엔 네 논리가 앞섰다.",
      "부정적인 기대값이 나왔어. 블러프 빈도를 재조정한다."
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "Your bet was an invitation to reraise. Done.",
      "Aggression meets superior aggression. Reraise.",
      "I'm the one who dictates the price. Reraise.",
      "You're playing into my hands. Reraise.",
      "Escalating the value of this pot. Reraise."
    ],
    ko: [
      "네 배팅은 리레이즈를 해달라는 초대장 같군. 리레이즈.",
      "공격은 더 강력한 공격으로 맞받아친다. 리레이즈.",
      "이 판의 가격은 내가 정해. 리레이즈.",
      "내 의도대로 흘러오고 있군. 리레이즈.",
      "이 팟의 가치를 한 단계 더 높여보지. 리레이즈."
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking back for maximum efficiency. Check.",
      "Standard check for pot control.",
      "Let's see what you do on the next street. Check.",
      "Free card? No, it's a strategic delay. Check."
    ],
    ko: [
      "최대 효율을 위해 체크백한다. 체크.",
      "팟 조절을 위한 정석적인 체크지.",
      "다음 스트리트에서 어떤 움직임을 보일지 보지. 체크.",
      "공짜 카드? 아니, 전략적인 지연일 뿐이다. 체크."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "I'm making a disciplined fold here.",
      "Good hand, but I'm beat. fold.",
      "A rare high-equity fold, but correct. Out.",
      "I know exactly where I am. Folding.",
      "Saving my equity for a better iteration. Fold."
    ],
    ko: [
      "절제된 폴드를 할 타이밍이군. 폴드.",
      "좋은 패지만, 내가 졌어. 인정하지.",
      "드문 고에퀴티 폴드지만, 이게 정답이다. 나간다.",
      "내 상황이 어떤지 정확히 알고 있지. 폴드.",
      "더 나은 기회를 위해 에퀴티를 보존하마. 폴드."
    ]
  }
};
