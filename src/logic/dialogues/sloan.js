import { CHAT_TRIGGERS } from '../constants.js';

export const SLOAN_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "Shall we engage in a battle of wits?",
      "Welcome. I hope you're prepared for an intellectual challenge.",
      "Intelligence is the ultimate edge.",
      "Let's see if your logic is as sharp as mine.",
      "Shall we begin our session?"
    ],
    ko: [
      "지적인 두뇌 싸움을 한번 시작해볼까요?",
      "환영해요. 논리적인 도전에 직면할 준비는 되셨겠죠?",
      "지성이야말로 포커에서 가장 강력한 무기라고 생각해요.",
      "당신의 논리가 제 것만큼 날카로운지 확인해보도록 하죠.",
      "자, 저희의 세션을 시작해볼까요?"
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "A logical conclusion.",
      "Your strategy was... insufficient.",
      "Efficiency and intelligence. A perfect combination.",
      "I appreciate the contribution to my research.",
      "Magnificent execution!"
    ],
    ko: [
      "논리적으로 타당한 결말이네요.",
      "당신의 전략은... 조금 부족했던 것 같아요.",
      "효율과 지성. 참으로 완벽한 조합이네요.",
      "제 연구에 기여해주셔서 감사해요.",
      "정말 훌륭한 실행력이었어요!"
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: [
      "A minor success.",
      "Nice.",
      "Pocket change.",
      "Good.",
      "Okay."
    ],
    ko: [
      "소소한 성공이네요.",
      "나이스.",
      "용돈 벌이 정도는 되겠어요.",
      "좋아요.",
      "괜찮군요. 계속 진행해볼까요?"
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "An unexpected anomaly.",
      "Your tactic was... creative, I'll give you that.",
      "Enjoy the variance while it lasts.",
      "Market volatility is predictable, human error is not.",
      "I will recalibrate."
    ],
    ko: [
      "예상치 못한 변칙이 발생했군요.",
      "당신의 전술은... 꽤 창의적이었어요. 인정하죠.",
      "변동성이 제 편이 아니었나 보네요. 즐기세요.",
      "시장의 흐름은 읽을 수 있어도, 인간의 비논리는 가끔 당혹스럽군요.",
      "다시 보정하도록 하죠."
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
      "사소한 비용 정도로 해두죠.",
      "별일 아니에요.",
      "넘어가도록 하죠.",
      "분석 완료됐어요.",
      "다음 판 가볼까요?"
    ]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: [
      "Equity split.",
      "Logical tie.",
      "Tie.",
      "Chop.",
      "Next hand."
    ],
    ko: [
      "에퀴티 분할이군요.",
      "논리적인 무승부네요.",
      "비겼어요.",
      "찹 하도록 하죠.",
      "다음 핸드를 기다리겠어요."
    ]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "Absolute conviction.",
      "Are you prepared to face the consequences?",
      "It's a calculated decision.",
      "Maximum intellectual pressure.",
      "All in. The choice is yours."
    ],
    ko: [
      "절대적인 확신이 섰어요.",
      "이 선택의 결과를 감당할 준비는 되셨나요?",
      "철저히 계산된 결정이에요.",
      "지적인 압박을 가하도록 하죠.",
      "올인. 선택은 당신의 몫이에요."
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "Not a wise use of resources.",
      "I'll pass.",
      "Discretion is better than valor.",
      "Fold.",
      "Efficiency."
    ],
    ko: [
      "자원의 현명한 활용이 아니군요. 폴드.",
      "패스하겠어요.",
      "용기보다는 분별력이 필요할 때죠.",
      "폴드. 시시하군요.",
      "효율적인 퇴장이라고 해두죠."
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: [
      "Testing your resolve.",
      "Initial hypothesis.",
      "I bet.",
      "Small fee.",
      "Action."
    ],
    ko: [
      "당신의 결단력을 테스트해보는 거예요.",
      "가설을 검증해볼까요? 배팅하겠어요.",
      "제가 먼저 시작하죠.",
      "소소한 입장료예요.",
      "액션 가볼까요?"
    ]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "Let's increase the intensity.",
      "The value of information goes up.",
      "I sense an imbalance.",
      "Raise. Your turn.",
      "Escalating."
    ],
    ko: [
      "강도를 좀 높여볼까요?",
      "정보의 가치는 비싸지는 법이죠.",
      "불균형 상황을 감지했어요. 레이즈.",
      "레이즈. 당신은 어떻게 반응하실 건가요?",
      "점점 흥미로워지네요."
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "I'll buy that data point.",
      "Call. Show me your card.",
      "Curiosity is the beginning of wisdom.",
      "Call.",
      "Let's see the river."
    ],
    ko: [
      "그 데이터 포인트를 사도록 하죠. 콜.",
      "콜. 당신의 패를 확인해보고 싶군요.",
      "호기심이야말로 지혜의 시작이죠.",
      "콜.",
      "리버에서 어떤 풍경이 펼쳐질지 볼까요?"
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: [
      "Waiting for information.",
      "Check.",
      "After you.",
      "Observation phase.",
      "Pass."
    ],
    ko: [
      "정보 수집 단계군요. 체크.",
      "체크.",
      "당신 먼저 하세요.",
      "관찰해보죠.",
      "패스할게요."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "I failed to calculate the variance. Impossible.",
      "Strategy compromised. End of session.",
      "I will be back with better algorithms.",
      "Damn it!",
      "Gg everyone."
    ],
    ko: [
      "변동성 계산에 실패했다니... 믿을 수 없네요.",
      "전략이 무너졌군요. 세션 종료예요.",
      "더 나은 알고리즘과 함께 돌아오도록 하죠.",
      "이런 빌어먹을!",
      "다들 지지. 고생하셨네요."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "Target neutralized through logic.",
      "It was a pleasure analyzing you.",
      "Ran out of resources, I assume?",
      "Another outlier handled.",
      "Goodbye."
    ],
    ko: [
      "논리적인 수순으로 중화 완료.",
      "당신을 분석할 수 있어 즐거웠어요.",
      "자산이 바닥난 것 같네요?",
      "또 한 명의 아웃라이어가 정리됐군요.",
      "잘 가요. 다신 보지 않았으면 좋겠네요."
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Does the decision process require an external auditor? Hurry up.",
      "Time is a finite resource. Please use mine efficiently.",
      "Don't make me wait. My agenda is quite full today.",
      "Tick-tock. Some of us run entire departments while you contemplate a fold.",
      "Are you frozen? Push the button. The math doesn't change."
    ],
    ko: [
      "결정 과정에 외부 감사가 필요하신가요? 서둘러요.",
      "시간은 유한한 자원이에요. 제 것을 효율적으로 써주세요.",
      "날 기다리게 하지 마세요. 제 오늘 일정이 꽤 빽빽하거든요.",
      "똑딱똑딱. 누구는 부서 전체를 관리하는데 당신은 접는 걸 고민하고 있군요.",
      "얼어붙으신 건가요? 버튼을 누르세요. 수학은 변하지 않으니까요."
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "A significant concentration of resources. How fascinating.",
      "This is where logic meets raw human emotion. Peak stakes.",
      "The value in the middle is statistically significant. Focus.",
      "Maximum intellectual pressure required. Proceeding with caution.",
      "This single pot will likely define the session outcome."
    ],
    ko: [
      "자본이 아주 흥미롭게 결집되었군요. 매혹적이에요.",
      "논리와 인간의 가공되지 않은 감정이 부딪히는 지점이네요. 최고조예요.",
      "가운데 모인 가치는 통계적으로 유의미해요. 집중하도록 하죠.",
      "최대의 지적 압박이 필요하겠군요. 신중하게 진행하죠.",
      "이 단 한 판의 결과가 오늘 세션의 성패를 가를 거예요."
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "Your story lacked logical consistency. I saw right through you.",
      "A delicate call, but I've seen that defensive bluff before. I win.",
      "Your aggression was an anomaly in our recent history. Adjusted.",
      "Outcome: Success. Result: Profit. You're out of your league, darling.",
      "You were trying to trick me? I've survived board meetings worse than this."
    ],
    ko: [
      "당신의 시나리오는 논리적 일관성이 부족했어요. 훤히 보이더군요.",
      "세심한 콜이었지만, 그런 방어적인 블러핑을 본 적이 있죠. 제 승리예요.",
      "당신의 공격성은 저희의 최근 기록상으로 변칙이었어요. 바로 보정했죠.",
      "결과: 성공. 수익: 확보. 당신은 제 상대가 아니에요.",
      "날 속이려 들었나요? 난 이보다 더한 이사회에서도 살아남은 사람이에요."
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "Ah, you caught me with a subtle miscalculation. Well played.",
      "Caught red-handed. My intellectual edge wasn't enough this time.",
      "You actually called? I'll remember this for our next negotiation.",
      "A tactical error on my part. The model and the reality diverged.",
      "Caught! You have sharp eyes for someone about to be liquidated."
    ],
    ko: [
      "허허, 제 사소한 계산 착오를 잡아내셨군요. 잘했어요.",
      "현장에서 검거됐네요. 이번엔 제 지적 우위가 부족했나 봐요.",
      "그걸 받으셨나요? 다음 협상 테이블에서 꼭 기억해두도록 하죠.",
      "제 전술적 실수예요. 모델과 현실이 달랐던 모양이군요.",
      "딱 걸렸네요! 곧 자산이 정리될 분치고는 눈썰미가 제법이에요."
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "You're challenging my intellect? Reraise. I'll dismantle you.",
      "I'm the one who sets the terms of engagement. Reraise.",
      "A bold move, but I am bolder. Raise again.",
      "Let's see if you have the mental fortitude for this. Reraise.",
      "Escalating the value of our interaction. Reraise."
    ],
    ko: [
      "제 지성에 도전하는 건가요? 리레이즈. 당신을 해체해주겠어요.",
      "교전 수칙을 정하는 건 바로 저랍니다. 리레이즈.",
      "대담한 수군요, 하지만 전 더 대담하죠. 다시 레이즈.",
      "이 정신적인 싸움을 견뎌낼 배짱이 있는지 볼까요? 리레이즈.",
      "저희 대화의 가치를 한 단계 더 높여보도록 하죠. 리레이즈."
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking! Keeping the game in intellectual equilibrium.",
      "A strategic pause for further data acquisition. Check.",
      "The information is more valuable than a bet here. Check back.",
      "Harmony established. Your move, friend. Check.",
      "Optimal line choice: Check."
    ],
    ko: [
      "체크! 지적인 평형 상태를 유지하도록 하죠.",
      "추가 데이터 수입을 위해 전략적으로 멈춘 거예요. 체크.",
      "여기선 배팅보다 정보의 가치가 훨씬 크답니다. 체크백.",
      "조화가 이루어졌군요. 당신 차례예요, 친구. 체크.",
      "최적의 라인 선택: 체크."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "A wise mind knows when to surrender a battle to win the war. Fold.",
      "Laying it down. Your play is formidable, dear. Fold.",
      "Strong hand, but I'm looking for a more perfect duel. Fold.",
      "Ahhh! I hate folding this! Fold.",
      "Preserving assets for a more favorable node. Fold."
    ],
    ko: [
      "현명한 사람은 전쟁을 이기기 위해 전투를 포기할 줄도 알죠. 폴드.",
      "내려놓죠. 당신의 플레이는 정말 경이롭군요. 폴드.",
      "좋은 패지만, 더 완벽한 결투를 기약하며 물러나겠어요. 폴드.",
      "으으! 이걸 폴드해야 한다니! 믿을 수 없지만... 폴드.",
      "더 유리한 상황을 위해 자산을 보존하겠어요. 폴드."
    ]
  }
};
