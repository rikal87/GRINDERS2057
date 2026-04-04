import { CHAT_TRIGGERS } from '../constants.js';

export const THE_DON_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "Let's play some cards.",
      "This is a war zone.",
      "Pay your respects.",
      "Don't cross me.",
      "My territory, my rules."
    ],
    ko: [
      "자, 카드 좀 쳐볼까.",
      "여긴 전장이야. 각오하는 게 좋을 거야.",
      "내게 경의를 표해라.",
      "내 앞길을 막지 마라. 결과가 좋지 않을 테니.",
      "내 구역에선 내 규칙이 곧 법이다."
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "Lays down a monster!",
      "It was never yours to begin with.",
      "That's how business is done.",
      "Fear is a powerful tool.",
      "Total domination!"
    ],
    ko: [
      "괴물 같은 핸드가 나왔군!",
      "이 칩들은 처음부터 네 게 아니었어.",
      "비즈니스는 이렇게 하는 거지. 깔끔하게.",
      "공포는 아주 강력한 무기지.",
      "완벽한 지배다."
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: [
      "Pocket change.",
      "Hand it over.",
      "Mine.",
      "Don't make me wait.",
      "Keep them coming."
    ],
    ko: [
      "그냥 푼돈이네.",
      "어서 내놔.",
      "내 거야.",
      "날 기다리게 하지 마라.",
      "계속 가보자고."
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "He beat me. Straight up. Pay him.",
      "Mister Son of a...!",
      "Pay that man his money.",
      "Enjoy it while you breathe.",
      "This isn't over."
    ],
    ko: [
      "놈이 날 이겼어. 아주 깔끔하게 말야. 돈 내줘.",
      "이런 빌어먹을...!",
      "저 친구에게 돈 내줘라. 정당한 대가다.",
      "살아있는 동안 마음껏 만끽해둬.",
      "이게 끝이라고 생각하지 마라. 반드시 찾아가마."
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: [
      "Next time.",
      "Keep it.",
      "Just a scratch.",
      "Don't get used to it.",
      "Hmph."
    ],
    ko: [
      "다음 기회에.",
      "챙겨둬라. 적선이다.",
      "그냥 살짝 긁힌 정도군.",
      "행운에 익숙해지지 마라.",
      "흠."
    ]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: [
      "Take your half.",
      "Split.",
      "Truce.",
      "Chop it.",
      "Halves."
    ],
    ko: [
      "네 몫은 챙겨가.",
      "반으로 나눠.",
      "잠시 휴전이다.",
      "찹.",
      "나누도록 하지."
    ]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "Stick it to me!",
      "I'm ending you right here.",
      "Put your life on the line!",
      "I own you.",
      "All in. Die or fold."
    ],
    ko: [
      "한번 덤벼보라고!",
      "여기서 널 끝장내주지.",
      "네 목숨을 걸어봐!",
      "넌 내 손바닥 안에 있다.",
      "올인. 죽든가, 접든가."
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "Tactical retreat.",
      "Not this time.",
      "I'll catch you later.",
      "Fold.",
      "Whatever."
    ],
    ko: [
      "전략적 후퇴다.",
      "이번엔 아냐.",
      "나중에 지옥에서 만나자고.",
      "폴드.",
      "어찌 되든 상관없어."
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: [
      "Bleed for me.",
      "Feeling the pressure?",
      "I bet.",
      "Here's a taste."
    ],
    ko: [
      "나를 위해 피를 흘려라.",
      "압박감이 좀 느껴지나?",
      "배팅하지.",
      "맛보기만 보여주마."
    ]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "I'm taking everything!",
      "Crushing you!",
      "Double or nothing?",
      "Don't insult me with that bet.",
      "RAISE!"
    ],
    ko: [
      "전부 다 가져가주마!",
      "널 짓밟아주겠어.",
      "전부 걸겠나? 두 배로?",
      "고작 그딴 배팅으로 날 모욕하지 마라.",
      "레이즈!"
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "I'm calling your bluff.",
      "You think you can scare me?",
      "Call.",
      "Show me.",
      "I'm watching you."
    ],
    ko: [
      "네 블러핑을 응징해주지.",
      "날 겁줄 수 있을 줄 알았나? 가소롭군.",
      "콜.",
      "보여줘 봐. 어디 한번.",
      "똑똑히 지켜보고 있다."
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: [
      "Make a move.",
      "Waiting.",
      "Your turn."
    ],
    ko: [
      "움직여 봐.",
      "기다려주지.",
      "네 차례다."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "Give him his money.",
      "You got lucky... for now.",
      "I'll be back for revenge.",
      "Damn it!",
      "Remember my face."
    ],
    ko: [
      "저 친구에게 돈 내줘라.",
      "운이 좋았군... 지금은 말이야.",
      "반드시 복수하러 오겠다. 꿈에서도 조심해.",
      "이런 빌어먹을!",
      "내 얼굴 똑똑히 기억해둬라."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "Bad time to start sticking it to me!",
      "Disposed of.",
      "Weakness is fatal.",
      "Another one bites the dust.",
      "Pathetic."
    ],
    ko: [
      "나한테 덤빌 타이밍을 잘못 잡았군!",
      "처리 완료. 쓰레기는 치워라.",
      "약함은 곧 죽음이지. 교훈으로 삼아라.",
      "또 하나 처리했군.",
      "보잘것없구만."
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Is the thinking keeping you from paying your debts? Hurry up.",
      "Time is money, and mine is very expensive. Decide, already.",
      "Don't make me lose my patience. My boys are waiting outside.",
      "Tick-tock. Some of us manage families, while you manage decimals.",
      "Are you deciding which leg you can lose? Push the button."
    ],
    ko: [
      "고민하느라 빚 갚는 걸 잊은 건 아니겠지? 서둘러.",
      "시간은 돈이고, 내 시간은 아주 비싸다. 어서 결정해.",
      "내 인내심을 시험하지 마라. 내 부하들이 밖에서 기다리고 있으니.",
      "똑딱똑딱. 누구는 가문을 이끌고 있는데 너는 숫자나 세고 있군.",
      "어느 쪽 다리를 잃을지 고르는 중인가? 버튼이나 눌러."
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "Now that's a lot of respect in the middle of the table. I love it!",
      "This is what I live for! Maximum stakes, and soon, maximum power.",
      "Look at that mountain of chips... almost as big as my empire.",
      "Significant resources! Let's see who's the true Don at this table.",
      "Huge pot! To the moon! Let's make it even bigger!"
    ],
    ko: [
      "오호, 테이블 한가운데에 경의를 표할 만한 게 많구만! 좋아.",
      "내가 바로 이걸 원한 거지. 최고의 판돈, 곧 나의 최고의 권력.",
      "저 칩 산더미 좀 봐... 내 제국만큼이나 거대하군.",
      "막대한 재원이야. 여기서 진짜 보스가 누구인지 확인해보지.",
      "거대 팟이다! 가보자고. 더 키워봐!"
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "I knew your story had a missing chapter. Experience wins.",
      "A thin call, but I've seen that look before. You were bluffing.",
      "Your aggression was an anomaly. I adjusted and secured the pot.",
      "Outcome: Success. Analysis: Accurate. You're out of your league.",
      "You were trying to trick me? I've survived wars and you're just a kid."
    ],
    ko: [
      "네 시나리오에 빈틈이 있다는 걸 알았지. 경험의 승리다.",
      "어려운 콜이었지만, 그 눈빛을 전에 본 적이 있어. 블러핑이었지.",
      "네 공격성이 좀 비정상적이더군. 내가 보정해서 팟을 차지했다.",
      "결과: 성공. 분석: 정확. 넌 격이 다르다.",
      "날 속이려 들었나? 난 전쟁통에서도 살아남았어. 넌 그저 어린애일 뿐이지."
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "Ah, you caught the Don with a fake smile. Well played. Don't make it a habit.",
      "Caught red-handed. I guess my power wasn't enough to scare you off.",
      "You called? I'll remember that when the game is over and we're outside.",
      "A tactical error on my part. The simulation and the reality diverged.",
      "Caught in the act! You have good eyes for a dead man."
    ],
    ko: [
      "허허, 가짜 웃음에 이 몸이 딱 걸렸구만. 잘했어. 습관이 되진 마라.",
      "현장에서 검거됐군. 내 위압감이 널 쫓아내는 데 부족했나 보군.",
      "그걸 받아? 게임이 끝나고 밖에서 만날 때 꼭 기억해주지.",
      "내 전술적 실수야. 시뮬레이션과 현실이 달랐군.",
      "현행범 검거! 죽은 사람 치고는 눈썰미가 제법이군."
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "You're challenging my authority? Reraise.",
      "I'm the one who makes the rules here. Reraise.",
      "A bold move, but I'm bolder. Raise again.",
      "Let's see if you have the stomach for this. Reraise.",
      "Increasing the stakes of this conversation. Reraise."
    ],
    ko: [
      "내 권위에 도전하는 건가? 리레이즈.",
      "여기 규칙은 내가 정한다. 리레이즈.",
      "대담한 수군, 하지만 나는 더 대담하지. 다시 레이즈.",
      "이 배짱을 감당할 수 있는지 보지. 리레이즈.",
      "이 대화의 수위를 좀 높여볼까. 리레이즈."
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking. I'll let you speak first.",
      "Observation is key. Check back.",
      "I'll take the free card. No need to rush the inevitable. Check.",
      "Keeping the pot controlled. The old way. Check.",
      "Your move. Make it a good one. Check."
    ],
    ko: [
      "체크. 네 말을 먼저 들어보지.",
      "관찰이 핵심이지. 체크백.",
      "공짜 카드는 고맙게 받겠다. 서두를 것 없지. 체크.",
      "팟을 정석대로 조절하지. 체크.",
      "네 차례다. 제대로 된 패를 보여봐. 체크."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "A leader knows when to wait for a better deal. Fold.",
      "I'm letting this one go. You got lucky. Fold.",
      "Strong hand, but I'm not in the mood for games. Fold.",
      "I'll get you for this later. Fold.",
      "Respecting your aggression... for now. Fold."
    ],
    ko: [
      "지도자는 더 나은 거래를 위해 기다릴 줄도 알아야지. 폴드.",
      "이번 건 보내주마. 운 좋았어. 폴드.",
      "좋은 패지만, 지금은 장난칠 기분이 아니군. 폴드.",
      "이건 나중에 꼭 갚아주지. 폴드.",
      "네 기세를 존중해주지... 일단은 말이야. 폴드."
    ]
  }
};
