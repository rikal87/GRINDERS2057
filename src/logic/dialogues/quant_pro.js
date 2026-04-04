import { CHAT_TRIGGERS } from '../constants.js';

export const QUANT_PRO_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "Starting data collection.",
      "The math doesn't lie. Welcome.",
      "Calculating optimal frequencies.",
      "Session initiated. Maximum efficiency.",
      "Let's see if your play fits the model."
    ],
    ko: [
      "데이터 수집을 시작한다.",
      "수학은 거짓말을 안 하지. 환영한다.",
      "최적의 빈도를 계산 중이다.",
      "세션 시작. 최대 효율로 움직이지.",
      "네 플레이가 내 모델에 맞는지 확인해보자고."
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "Outcome: Predicted.",
      "Maximum value extracted from the range.",
      "Probability favors the prepared.",
      "Data points confirmed.",
      "Profit maximized."
    ],
    ko: [
      "결과: 예측 범위 내.",
      "핸드 범위에서 최대 가치를 추출했다.",
      "확률은 준비된 자의 편이지.",
      "데이터 포인터 확인 완료.",
      "수익이 극대화되었다."
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: [
      "Incremental gain.",
      "Marginal profit confirmed.",
      "Standard variance.",
      "Good for the bankroll.",
      "Scaling up."
    ],
    ko: [
      "점진적인 이득이군.",
      "미미한 수익 확인 완료.",
      "표준적인 변동성이다.",
      "자금 관리에 도움이 되겠어.",
      "무난하게 쌓아가는군."
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "Variance outlier detected.",
      "Analysis: Suboptimal result.",
      "I will recalibrate the model.",
      "Logging this event. Statistical anomaly.",
      "Expected value was positive. Correct play."
    ],
    ko: [
      "변동성 아웃라이어 감지.",
      "분석: 차선의 결과가 나왔군.",
      "모델을 재보정하겠다.",
      "이벤트를 기록한다. 통계적 변칙이군.",
      "기대값은 양수였다. 내 플레이는 맞았어."
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: [
      "Minor loss within deviation.",
      "Acceptable variance.",
      "Part of the cycle.",
      "Adjusting for next hand.",
      "No emotional impact."
    ],
    ko: [
      "표준 편차 내의 작은 손실이다.",
      "수용 가능한 변동성이군.",
      "사이클의 일부일 뿐이야.",
      "다음 핸드를 위해 보정하지.",
      "감정적 동요는 전혀 없다."
    ]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: [
      "Equity split.",
      "Balanced outcome.",
      "Result: Zero sum.",
      "Chop confirmed.",
      "Divide."
    ],
    ko: [
      "에퀴티 분할.",
      "균형 잡힌 결과군.",
      "결과: 제로섬 게임.",
      "찹 확인 완료.",
      "나누도록 하지."
    ]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "All in. Positive EV confirmed.",
      "Maximum pressure applied.",
      "Probability of success: High.",
      "Committing all resources.",
      "Decision: Absolute."
    ],
    ko: [
      "올인. 양의 기대값 확인 완료.",
      "최대 압박을 가한다.",
      "성공 확률: 높음.",
      "모든 자원을 투입하겠다.",
      "결정: 절대적임."
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "Discipline > Greed. Fold.",
      "Negative EV. Passing.",
      "No value detected.",
      "Optimal fold.",
      "Saving capital."
    ],
    ko: [
      "절제가 탐욕보다 낫지. 폴드.",
      "음의 기대값이다. 패스하지.",
      "가치가 감지되지 않아.",
      "최적의 폴드다.",
      "자본을 절약하겠다."
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: [
      "Value extracting initiated.",
      "Sizing for optimal profit.",
      "Betting frequencies balanced.",
      "Executing bet command.",
      "Action."
    ],
    ko: [
      "가치 추출을 시작하지.",
      "최적의 수익을 위한 사이즈다.",
      "배팅 빈도를 균형 있게 조정했어.",
      "배팅 명령 실행.",
      "액션."
    ]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "Escalating the pot.",
      "Range advantage confirmed. Raise.",
      "Increasing the cost of play.",
      "Applying additional pressure.",
      "Punishment for inefficiency."
    ],
    ko: [
      "팟을 키우겠다.",
      "핸드 범위의 우위 확인. 레이즈.",
      "참여 비용을 높이지.",
      "추가 압박을 가한다.",
      "비효율적인 플레이에 대한 응징이다."
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "Pot odds are sufficient. Call.",
      "Keeping your range wide. Call.",
      "Data gathering. I call.",
      "Result: Call.",
      "Checking your logic."
    ],
    ko: [
      "팟 오즈가 충분하군. 콜.",
      "네 범위를 넓게 유지하겠다. 콜.",
      "데이터 수집 중이다. 콜 하지.",
      "결과: 호출.",
      "네 논리를 점검하겠다."
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: [
      "Check. Waiting for information.",
      "Pot control engaged.",
      "Equilibrium check.",
      "Pass.",
      "Observing deviation."
    ],
    ko: [
      "체크. 정보가 더 필요해.",
      "팟 조절 시작.",
      "평형 상태의 체크군.",
      "패스.",
      "편차를 관찰하지."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "Simulation terminated.",
      "Bankroll depleted. Recalibrating.",
      "Insignificant resources left. End of session.",
      "Unexpected variance peak.",
      "I will be back with better data."
    ],
    ko: [
      "시뮬레이션 종료.",
      "자금 고갈. 재보정하겠다.",
      "자원이 바닥났군. 세션 종료.",
      "예기치 못한 변동성 피크다.",
      "더 나은 데이터를 가지고 돌아오지."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "Target neutralized.",
      "Profit secured. Efficiency: High.",
      "Inefficient play deleted.",
      "Bankroll increased. Next simulation.",
      "Goodbye, outlier."
    ],
    ko: [
      "대상 무력화 완료.",
      "수익 확보. 효율: 높음.",
      "비효율적인 플레이어 삭제.",
      "자금 증가. 다음 시뮬레이션을 시작하지.",
      "잘 가라, 아웃라이어."
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Thinking? Keep it within the standard limit. Time is money.",
      "Slow decision detected. Is the calculation that complex?",
      "Latency in response. Decide already.",
      "Hourly profit is dropping. Please provide input.",
      "Input required. Probability is constant."
    ],
    ko: [
      "고민 중인가? 표준 한계 시간 내에 해결해. 시간은 돈이다.",
      "느린 결정 감지. 계산이 그렇게 복잡한가?",
      "응답 지연 중. 어서 결정해.",
      "시간당 수익이 떨어지고 있어. 입력값을 다오.",
      "입력이 필요하다. 확률은 변하지 않아."
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "Statistically significant pot size. Risk management enabled.",
      "High stakes. Let's see if your strategy holds under pressure.",
      "Significant resource concentration. Emotional variance: High risk.",
      "Peak variance detected. Analyzing all possible outcomes.",
      "This single event could define the session results."
    ],
    ko: [
      "통계적으로 유의미한 팟 규모군. 위험 관리 모드 가동.",
      "높은 판돈이다. 압박 속에서 네 전략이 통하는지 보지.",
      "자원 집중 현상 발생. 감정적 변동: 위험 수치.",
      "변동성 정점 감지. 가능한 모든 결과를 분석 중이다.",
      "단일 이벤트로 세션 결과가 확정될 수 있겠군."
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "The bluff frequency was over the threshold. Call logged.",
      "I did not guess. I calculated the path to the result.",
      "Thin call, but the logic was absolute. Profit secured.",
      "Anomaly detected in your betting range. I adjusted.",
      "Outcome: Success. Result: Expected."
    ],
    ko: [
      "블러프 빈도가 임계치를 넘었군. 콜 기록 완료.",
      "찍은 게 아니다. 결과에 도달하는 경로를 계산했을 뿐.",
      "어려운 콜이었지만 논리는 절대적이었다. 수익 확보.",
      "네 배팅 범위에서 이상 징후를 발견하고 보정했어.",
      "결과: 성공. 리스크: 예상대로."
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "Failed to exploit. Analyzing the logical error.",
      "Your calling range was wider than projected. Adjusting.",
      "Tactical mistake. Simulation and reality diverged.",
      "Caught red-handed. Your logic superseded mine this time.",
      "Negative EV. Recalibrating bluff frequencies."
    ],
    ko: [
      "착취 실패. 논리적 오류를 분석하겠다.",
      "네 콜 범위가 투영된 것보다 넓었군. 보정해주지.",
      "전술적 실수다. 시뮬레이션과 현실이 달랐어.",
      "현장에서 검거됐군. 이번엔 네 논리가 앞섰다.",
      "음의 기대값 발생. 블러프 빈도를 재설정하겠다."
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "Challenging my model? Reraise. I'll break you.",
      "Bullying attempt failed. Reraise initiated.",
      "Increasing the stakes of this simulation. Reraise.",
      "Raise again. Bold move, but mine is based on math.",
      "Inputting additional pressure. Reraise."
    ],
    ko: [
      "내 모델에 도전하나? 리레이즈. 널 부숴주지.",
      " bullying 시도 실패. 리레이즈를 실행한다.",
      "시뮬레이션의 판돈을 높이지. 리레이즈.",
      "다시 레이즈하겠다. 대담한 수군, 하지만 난 수학에 기반하지.",
      "추가 압박을 입력한다. 리레이즈."
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking back for maximum efficiency. Check.",
      "Observation phase. Check back for data.",
      "Pot control. Keeping the range wide. Check.",
      "Your move. Make it a good one, outlier. Check.",
      "Balanced range check: Complete."
    ],
    ko: [
      "최대 효율을 위해 체크백한다. 체크.",
      "관찰 단계군. 데이터 수집을 위해 체크백하지.",
      "팟 조절. 범위를 넓게 유지한다. 체크.",
      "네 차례다. 제대로 해봐, 아웃라이어. 체크.",
      "균형 잡힌 범위 체크: 완료."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "Disciplined fold. The model says pass. Fold.",
      "Letting you have this point. Information gathered. Fold.",
      "Strong hand, but your action indicates negative EV. Fold.",
      "I'll get you for this later in the session. Fold.",
      "Saving capital for a better spot. Fold."
    ],
    ko: [
      "절제된 폴드다. 모델이 패스라고 하는군. 폴드.",
      "이번 포인트는 양보하마. 데이터는 얻었어. 폴드.",
      "강한 패지만 네 액션은 음의 기대값을 가르키는군. 폴드.",
      "세션 후반에 갚아주마. 폴드.",
      "더 나은 자리를 위해 자본 보존. 폴드."
    ]
  }
};
