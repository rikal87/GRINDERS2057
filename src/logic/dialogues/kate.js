import { CHAT_TRIGGERS } from '../constants.js';

export const KATE_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "Shall we discuss business?",
      "Welcome to the high game.",
      "Don't let my smile fool you.",
      "Capital is king.",
      "Shall we begin?"
    ],
    ko: [
      "비즈니스 이야기를 좀 해볼까요?",
      "하이 스테이크의 세계에 오신 걸 환영해요.",
      "제 미소에 방심하지 않는 게 좋을 거예요.",
      "결국 자본이 곧 권력이죠.",
      "자, 시작해볼까요?"
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "A profitable acquisition.",
      "Your assets are now mine.",
      "Efficiency is beautiful.",
      "I love a good return on investment.",
      "Magnificent!"
    ],
    ko: [
      "수익성 좋은 인수합병이었네요.",
      "당신의 자산은 이제 제 것입니다.",
      "효율성이란 참 아름다운 단어죠.",
      "투자 대비 수익률이 아주 만족스럽군요.",
      "정말 훌륭한 결과예요!"
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: [
      "A minor dividend.",
      "Nice.",
      "Pocket change.",
      "Good.",
      "Okay."
    ],
    ko: [
      "소소한 배당금이군요.",
      "나이스.",
      "용돈 벌이 정도는 되겠네요.",
      "좋아요.",
      "괜찮군요. 계속 가보죠."
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "A temporary loss.",
      "Interesting tactic.",
      "Enjoy the dividend... while you can.",
      "Market volatility is to be expected.",
      "I will adapt."
    ],
    ko: [
      "일시적인 손실일 뿐이에요.",
      "흥미로운 전술이군요.",
      "그 배당금을 즐기세요... 지금뿐일 테니까.",
      "시장 변동성이란 건 언제나 대비해야 하는 법이죠.",
      "곧 보정해서 돌아올게요."
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: [
      "A minor cost of business.",
      "No big deal.",
      "Moving on.",
      "Noted.",
      "Next."
    ],
    ko: [
      "사업상의 사소한 비용 정도로 해두죠.",
      "별거 아니에요.",
      "넘어가도록 하죠.",
      "분석 완료됐어요.",
      "다음 판 가볼까요?"
    ]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: [
      "Equity split.",
      "Cooperation.",
      "Tie.",
      "Chop.",
      "Next hand."
    ],
    ko: [
      "에퀴티 분할이군요.",
      "잠시 협력했다고 생각하죠.",
      "무승부네요.",
      "찹 하도록 해요.",
      "다음 핸드 부탁해요."
    ]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "Hostile takeover.",
      "Are you prepared to lose everything?",
      "It's a calculated risk.",
      "Maximum pressure.",
      "All in. Your move."
    ],
    ko: [
      "적대적 인수합병을 제안하죠.",
      "모든 걸 잃을 준비는 되셨나요?",
      "철저히 계산된 리스크예요.",
      "최대의 압박을 가하도록 하죠.",
      "올인. 당신 차례예요."
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "Not a wise investment.",
      "I'll pass.",
      "Respect the risk.",
      "Fold.",
      "Discretion."
    ],
    ko: [
      "현명한 투자처가 아니군요. 폴드.",
      "패스하겠어요.",
      "리스크를 존중할 줄도 알아야죠.",
      "폴드. 시시하군요.",
      "분별력 있는 퇴장이라고 해두죠."
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: [
      "Testing the market.",
      "Initial investment.",
      "I bet.",
      "Small fee.",
      "Action."
    ],
    ko: [
      "시장을 테스트해보는 거예요.",
      "초기 투자금을 좀 던져보죠.",
      "배팅하겠어요.",
      "소소한 입장료예요.",
      "액션 가볼까요?"
    ]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "Let's increase the stakes.",
      "The price and power go up.",
      "I sense weakness.",
      "Raise. Your move.",
      "Escalating."
    ],
    ko: [
      "판돈을 좀 키워볼까요?",
      "가격과 권위는 비례하는 법이죠.",
      "약점 냄새가 나는데요.",
      "레이즈. 당신은 어떻게 하실 거죠?",
      "점점 흥미진진해지네요."
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "I'll buy that information.",
      "Call. Show me your hand.",
      "Curiosity is my only weakness.",
      "Call.",
      "Let's see the river."
    ],
    ko: [
      "그 정보를 사도록 하죠. 콜.",
      "콜. 당신의 패를 확인해보고 싶군요.",
      "호기심은 제 유일한 약점이죠.",
      "콜.",
      "리버에서 어떤 풍경이 펼쳐질지 볼까요?"
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: [
      "Waiting for data.",
      "Check.",
      "After you.",
      "Observation.",
      "Pass."
    ],
    ko: [
      "데이터가 좀 더 필요하네요.",
      "체크.",
      "당신 먼저 하세요.",
      "관찰해보죠.",
      "패스할게요."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "I lost the market? Impossible.",
      "Bankruptcy was never in the model.",
      "I will be back for revenge.",
      "Damn it!",
      "Gg everyone."
    ],
    ko: [
      "제가 시장 주도권을 잃었다고요? 믿을 수 없네요.",
      "파산은 제 시나리오에 없던 일이에요.",
      "반드시 복수하러 다시 올게요.",
      "이런 빌어먹을!",
      "다들 지지. 고생하셨네요."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "Target neutralized.",
      "Pleasure doing business with you.",
      "Out of assets, I assume?",
      "Another one liquidated.",
      "Goodbye."
    ],
    ko: [
      "대상 무력화 성공.",
      "즐거운 비즈니스였어요.",
      "자산이 바닥난 것 같네요?",
      "또 한 명이 정리됐군요.",
      "잘 가요. 다신 보지 않았으면 좋겠네요."
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Is the thinking keeping you from paying your debts? Hurry up.",
      "Time is money, and my time is very expensive. Decide.",
      "Don't make me lose my patience. My attorneys are on standby.",
      "Tick-tock. Some of us run entire districts while you count decimals.",
      "Are you frozen? Push the button, for Pete's sake."
    ],
    ko: [
      "고민하느라 빚 갚는 걸 잊으신 건 아니겠죠? 서둘러요.",
      "시간은 돈이고, 제 시간은 아주 비싸답니다. 어서 결정하세요.",
      "제 인내심을 시험하지 마세요. 변호사들이 대기 중이니까요.",
      "똑딱똑딱. 누구는 구역 전체를 관리하는데 당신은 숫자나 세고 있군요.",
      "얼어붙으신 건가요? 제발 버튼이라도 눌러보세요."
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "Now that is a significant resource concentration. Magnificent!",
      "This is what I live for! Maximum liquidity, maximum risk.",
      "Look at that beauty! It's practically glowing with value.",
      "Emotional variance: High. Probability of success: Maximum.",
      "Huge pot! To the moon! Let's make it session-defining."
    ],
    ko: [
      "오, 이건 정말 막대한 자본의 결집체군요! 웅장해요.",
      "제가 바로 이걸 원한 거죠. 최고의 유동성, 최고의 리스크.",
      "저 아름다운 것 좀 보세요! 가치가 뚝뚝 떨어지는 것 같네요.",
      "감정적 변동 수치: 높음. 성공 확률: 최고조.",
      "거대 팟이네요! 가보도록 하죠. 오늘 세션의 결과는 여기서 정해질 거예요."
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "I knew your story had a flaw. Experience won this round.",
      "A delicate call, but I've seen that look in NY before. Bluff.",
      "Your aggression was an anomaly. I adjusted and secured the assets.",
      "Outcome: Success. Analysis: Accurate. You're out of your league.",
      "You were trying to trick me? I've survived hostile takeovers, kid."
    ],
    ko: [
      "당신의 시나리오에 결함이 있다는 걸 알았죠. 경험의 승리예요.",
      "세심한 콜이었지만, 뉴욕에서 그런 눈빛을 많이 봤거든요. 블러핑이죠.",
      "당신의 공격 수치가 비정상적이더군요. 바로 보정해서 자산을 확보했어요.",
      "결과: 성공. 분석: 정확. 당신은 저와 격이 다르죠.",
      "날 속이려 들었나요? 난 적대적 인수합병에서도 살아남은 사람이라고요."
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "Ah, you caught me with a fake smile. Well played. Don't make it a habit.",
      "Caught red-handed. My power wasn't enough to intimidate you?",
      "You actually called? I'll remember that for our next negotiation.",
      "A tactical error. The projection and reality diverged.",
      "Caught in the act! You have sharp eyes for someone about to be liquidated."
    ],
    ko: [
      "허허, 가짜 웃음에 제가 딱 걸렸군요. 잘했어요. 하지만 습관이 되진 마세요.",
      "현장에서 검거됐네요. 제 위압감이 당신을 쫓아내는 데 부족했나 보죠?",
      "그걸 받으셨나요? 다음 협상 테이블에서 꼭 기억해두도록 하죠.",
      "제 전술적 실수예요. 투영된 수치와 현실이 달랐나 보군요.",
      "현행범 검거! 곧 자산이 청산될 분치고는 눈썰미가 제법이네요."
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "You're challenging my authority? Reraise. I'll break you.",
      "I'm the one who sets the pricing here. Reraise.",
      "A bold move, but I am bolder. Raise again.",
      "Let's see if you have the stomach for a merger. Reraise.",
      "Increasing the stakes of this conversation. Reraise."
    ],
    ko: [
      "제 권위에 도전하는 건가요? 리레이즈. 당신을 부서버리겠어요.",
      "이곳의 가격 결정권은 제가 쥐고 있답니다. 리레이즈.",
      "대담한 수군요, 하지만 전 더 대담하죠. 다시 레이즈.",
      "이 합병을 감당할 배짱이 있는지 볼까요? 리레이즈.",
      "이 대화의 수위를 좀 더 높여보죠. 리레이즈."
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking. I'll let you speak first.",
      "Observation phase. Check back for data.",
      "I'll take the free card. Strategic delay. Check.",
      "Keeping the pot controlled. The entrepreneur's way. Check.",
      "Balanced and waiting. Your move. Check."
    ],
    ko: [
      "체크. 당신의 말을 먼저 들어보도록 하죠.",
      "관찰 단계군군. 데이터를 수집하겠어요. 체크백.",
      "공짜 카드는 환영이죠. 전략적 지연일 뿐이에요. 체크.",
      "팟 규모를 조절해야죠. 경영인의 방식대로. 체크.",
      "균형을 유지하며 기다리겠어요. 당신 차례예요. 체크."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "A wise investor knows when to cut losses. Fold.",
      "I'm letting this one go. Value your life. Fold.",
      "Strong hand, but I'll find a better market to exploit. Fold.",
      "I'll get you for this later. Fold.",
      "Respecting your play... for now. Fold."
    ],
    ko: [
      "현명한 투자자는 손절할 타이밍을 아는 법이죠. 폴드.",
      "이번 건 그냥 보내줄게요. 다신 보지 말자고요. 폴드.",
      "좋은 패지만, 당신을 낚을 더 좋은 시장을 찾아보겠어요. 폴드.",
      "이건 나중에 꼭 두 배로 돌려받도록 하죠. 폴드.",
      "당신의 플레이를 존중해주겠어요... 일단은 말이죠. 폴드."
    ]
  }
};
