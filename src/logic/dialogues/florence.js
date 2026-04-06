import { CHAT_TRIGGERS } from '../constants.js';

export const FLORENCE_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "Let's make this interesting.",
      "Try to keep up, darling.",
      "Don't bore me.",
      "Vegas rules.",
      "I hope you brought enough."
    ],
    ko: [
      "재미있게 만들어보자고.",
      "따라오려면 서둘러야 할 거야, 자기.",
      "날 지루하게 만들지 마.",
      "이게 라스베이거스 스타일이지.",
      "밑천은 든든히 챙겨왔겠지?"
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "Too easy.",
      "Was that supposed to be a bluff?",
      "Thanks for the donation.",
      "Predictable.",
      "I almost feel bad. Almost."
    ],
    ko: [
      "너무 쉬운데.",
      "방금 그게 블러핑이었어?",
      "기부금 고맙게 받을게.",
      "뻔하네.",
      "미안해지려고 하네."
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: ["Cute.", "Every little bit helps.", "A modest return.", "I'll take it.", "Not bad."],
    ko: ["귀엽네.", "티끌 모아 태산이지.", "수익이 적당하네.", "가져갈게.", "나쁘지 않아."]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "How tedious.",
      "Enjoy your moment.",
      "You got incredibly lucky.",
      "We'll see how long that lasts.",
      "Fine."
    ],
    ko: [
      "지루해지네.",
      "그 순간을 즐겨둬.",
      "운이 정말 좋았나 보네.",
      "그게 얼마나 갈지 두고 보자고.",
      "뭐, 좋아."
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: ["Whatever.", "Next.", "Just a little variance.", "Moving on.", "Hmph."],
    ko: ["신경 안 써.", "다음.", "그저 약간의 변동성일 뿐이야.", "넘어가자고.", "흥."]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: ["A split.", "How boring.", "Tie.", "Next hand.", "Shared."],
    ko: ["나누기네.", "지루해.", "비겼어.", "다음 핸드.", "공유됐네."]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "Feeling bold?",
      "Let's see if you're brave.",
      "All in. Try me.",
      "Max pressure.",
      "Let's find out."
    ],
    ko: [
      "자신감 넘치는데?",
      "네 용기가 얼마나 갈지 볼까.",
      "올인. 한번 해보시지.",
      "최대 압박이야.",
      "한번 확인해 보자고."
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "I don't play trash.",
      "Fold.",
      "You can have it.",
      "Not worth my time.",
      "Pass."
    ],
    ko: [
      "난 쓰레기 패론 안 놀거든.",
      "폴드.",
      "너 가져.",
      "내 시간을 낭비할 가치도 없어.",
      "패스."
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: ["Let's see.", "A small fee.", "Bet.", "Pay up.", "Just a taste."],
    ko: ["볼까.", "입장료는 내야지.", "배팅.", "돈 내놔.", "맛보기만 할게."]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "Let's test your nerves.",
      "Raising the stakes, darling.",
      "Shall we make it more interesting?",
      "Vegas-style raise.",
      "Let's make it hurt, just a little."
    ],
    ko: [
      "너의 담력을 한번 테스트해볼까.",
      "판 좀 키워볼게, 자기.",
      "게임을 좀 더 흥미롭게 만들어보자고.",
      "이게 라스베이거스식 레이즈야.",
      "아프게 해줄게, 아주 조금이니깐 긴장 풀고."
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "I'll humor you.",
      "Let's see the cards.",
      "Call.",
      "I don't believe you.",
      "Curious."
    ],
    ko: [
      "상대해 줄게.",
      "카드 좀 볼까.",
      "콜.",
      "난 너 안 믿어.",
      "흥미롭네."
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: ["Check.", "Checking.", "Go ahead.", "Your turn, dear.", "Pass."],
    ko: ["체크.", "체크할게.", "네 순서야.", "어디 한번 해봐, 자기.", "패스."]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "This table is terrible anyway.",
      "I have better places to be.",
      "Whatever.",
      "I'm done here.",
      "Goodbye."
    ],
    ko: [
      "이 테이블 어차피 형편없었어.",
      "난 더 좋은 곳으로 가야겠어.",
      "상관없어.",
      "여기까지만 하지.",
      "안녕."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "Farewell.",
      "You won't be missed.",
      "And stay out.",
      "Finally.",
      "Next victim, please."
    ],
    ko: [
      "잘 가.",
      "아무도 널 그리워하지 않을 거야.",
      "다신 보지 말자고.",
      "드디어 끝났네.",
      "다음 희생자 들어오세요."
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Darling, the clock is ticking.",
      "Don't keep a lady waiting.",
      "Thinking of a way out? There is none.",
      "Decide quickly, I have a life outside this table.",
      "Tick-tock. Is it that hard to fold?"
    ],
    ko: [
      "자기, 시간 가고 있잖아.",
      "여자를 기다리게 하는 건 매너가 아니지.",
      "도망칠 궁리 중이야? 소용없을 텐데.",
      "빨리 정해, 난 이 테이블 말고도 할 일이 많거든.",
      "똑딱똑딱. 접는 게 그렇게 어려워?"
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "Now this is a Vegas-sized pot.",
      "Significant resources. Let's see who blinks first.",
      "The stakes are finally interesting.",
      "Careful now, one mistake costs everything.",
      "I love the smell of a huge pot."
    ],
    ko: [
      "이제야 라스베이거스 규모 팟답네.",
      "판이 꽤 큰걸. 누가 먼저 흔들리나 볼까.",
      "드디어 판돈이 좀 흥미로워지네.",
      "조심해, 실수 한 번에 모든 게 끝날 테니까.",
      "이 거대한 팟의 냄새, 정말 좋아."
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "I knew your story didn't add up. Nice try, darling.",
      "A thin call, but I saw right through you.",
      "The data suggested a bluff. My intuition confirmed it.",
      "You were too aggressive for a dry board. I caught you.",
      "That was a expensive lesson for you, wasn't it?"
    ],
    ko: [
      "네 연기 좀 어설펐어. 시도는 좋았어, 자기.",
      "어려운 콜이었지만, 널 훤히 들여다보고 있었지.",
      "데이터는 블러핑이라고 말했고, 내 직감은 확신했어.",
      "보드 상황에 비해 너무 공격적이더라. 걸렸어.",
      "꽤 비싼 수업료치고는 결과가 참담하네, 안 그래?"
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "Oh, you actually called that? Impressive.",
      "I suppose I underestimated your courage.",
      "Caught red-handed. Well played, dear.",
      "A failed bluff is just a temporary setback.",
      "You have good eyes. I'll give you that."
    ],
    ko: [
      "참나, 그걸 콜 한다고? 제법인데.",
      "네 용기를 과소평가했나 보네.",
      "검거됐네, 잘했어.",
      "실패한 블러핑은 그저 일시적인 차질일 뿐이야.",
      "눈썰미가 좋네. 그건 인정할게."
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "Is that your best? I'm disappointed. Reraise.",
      "Your story's too transparent, darling. Reraise.",
      "A refined counter-measure. Reraise.",
      "Hidden claws are the most elegant. Reraise.",
      "Let's see if you can handle the crescendo. Reraise."
    ],
    ko: [
      "그게 최선이야? 실망인걸. 리레이즈.",
      "네 의도가 너무 뻔히 보여. 리레이즈.",
      "세련된 반격이지. 리레이즈.",
      "우아함 속에도 발톱은 숨겨져 있는 법이야. 리레이즈.",
      "이 크레센도를 감당할 수 있을지 보자고. 리레이즈."
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking back. Observing the canvas, darling.",
      "A graceful pause. Check.",
      "Free card? I'll accept this gift. Check back.",
      "Keeping the harmony for now. Check.",
      "I'll watch for a moment. Check back."
    ],
    ko: [
      "체크백. 판을 좀 관찰해 볼게, 자기.",
      "우아한 쉼표라고 해두지. 체크백.",
      "공짜 카드라. 선물로 받아두지. 체크백.",
      "일단은 조화를 유지해 보자고. 첵굿.",
      "잠깐 지켜보지. 첵굿."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "Even a masterpiece must be abandoned occasionally, Fold.",
      "A graceful exit, Fold.",
      "Strong hand, but the composition is flawed, Fold.",
      "I'll find a more perfect moment, Fold.",
      "Respecting your vision today, Fold."
    ],
    ko: [
      "걸작이라도 때로는 포기해야 할 때가 있는 법이야. 폴드.",
      "우아한 퇴장이야. 폴드.",
      "강한 패지만 구도에 결함이 있네, 폴드.",
      "더 완벽한 순간을 찾아보겠어, 폴드.",
      "오늘의 네 비전은 존중해주지, 폴드."
    ]
  }
};
