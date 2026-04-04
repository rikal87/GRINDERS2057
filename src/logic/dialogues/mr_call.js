import { CHAT_TRIGGERS } from '../constants.js';

export const MR_CALL_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "I love to see flops.",
      "Any two cards win.",
      "Let's play.",
      "I'm in.",
      "Hello."
    ],
    ko: [
      "플랍 보는 게 제 유일한 낙이에요.",
      "두 장만 있으면 뭐든 이길 수 있지 않겠어요?",
      "어디 한번 진하게 놀아보자구요.",
      "저도 당연히 껴야죠. 빠지면 섭섭하죠.",
      "안녕하세요! 반가워요!"
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "I hit!",
      "Got there!",
      "Lucky card.",
      "Wow!",
      "Nice pot."
    ],
    ko: [
      "와아! 맞췄다! 역시 끝까지 보길 잘했네요!",
      "결국 여기까지 왔네요! 승리는 제껍니다!",
      "정말 행운의 카드예요. 기분 최고!",
      "와우! 판돈이 정말 달콤하네요.",
      "보세요, 제가 이긴다고 했잖아요!"
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: ["I won.", "Cool.", "Nice.", "Yay.", "Chips."],
    ko: ["이겼네요! 소소하지만 좋아요.", "멋지십니다! 아니, 멋지네요 제가.", "좋아요, 좋아!", "야호! 칩이 늘어났어!", "이것도 다 수익이죠, 헤헤."]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "Thought I had you.",
      "So close.",
      "Darn.",
      "Nice hand.",
      "Missed my draw."
    ],
    ko: [
      "제가 진짜 이길 줄 알았는데! 아쉬워라.",
      "정말 한 지점 차이인데... 너무 아깝네요.",
      "이런, 이번엔 제가 졌네요.",
      "좋은 핸드였어요! 제가 졌습니다.",
      "메이드가 안 됐네요... 그래도 끝까지 본 것에 만족합니다!"
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: ["Oh well.", "Nice hand.", "Good hit.", "Lost a bit.", "Oops."],
    ko: ["어쩔 수 없죠, 다음 판이 있으니까!", "잘 하셨어요! 훌륭하네.", "좋은 카드네요. 인정합니다!", "조금 잃었지만 괜찮아요.", "앗, 이번엔 제 실수인가요?"]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: ["Chop!", "Tie hand!", "We share!", "Cool.", "Split."],
    ko: ["찹! 사이좋게 나눠요!", "비겼네요! 역시 우린 통하는 게 있어.", "나누자구요! 이것도 운명이죠.", "좋아요, 공평하네!", "스플릿! 다음 판으로 가죠."]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "I have a pair.",
      "Maybe it hits.",
      "I call.",
      "Let's gamble.",
      "Hope?"
    ],
    ko: [
      "저 페어 하나 믿고 끝까지 갑니다!",
      "맞을지도 몰라요! 리버까지 확인하죠!",
      "콜입니다! 전 절대 안 접어요!",
      "한번 시원하게 도박해 보자구요! 올인!",
      "희망이 있다고 믿어요. 가자!"
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "I guess.",
      "Fine.",
      "Fold.",
      "Don't want to.",
      "Okay."
    ],
    ko: [
      "정말 하기 싫지만... 폴드할게요.",
      "좋아요, 이번만 져드리는 겁니다.",
      "폴드. 아, 다음 카드 보고 싶었는데.",
      "죽기 싫지만 어쩔 수 없네요.",
      "오케이, 이번 판은 항복!"
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: ["Min bet.", "Clicking buttons.", "Bet.", "Here.", "Chips."],
    ko: ["최소 배팅입니다! 같이 가요!", "카드 보고 싶으니까 배팅!", "여기요, 칩 하나 던져봅니다.", "배팅! 저도 껴줄거죠?", "칩 들어가요! 기대되네."]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: ["Raise?", "I assume so.", "Misclick?", "Strong?", "Raise."],
    ko: ["조금 더 올려볼까요? 궁굼하네.", "레이즈 할게요! 다음 카드 비싼가요?", "어라.. 잘못 눌렀나? 그래도 고!", "강하게 가볼까? 레이즈!", "레이즈! 판돈 좀 키워보자구요."]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "Call.",
      "Must see.",
      "Can't fold.",
      "Too curious.",
      "Calling."
    ],
    ko: [
      "콜! 무조건 콜입니다!",
      "이건 꼭 봐야겠어요. 리버까지!",
      "도저히 죽을 수가 없네요. 끝까지 갑니다!",
      "너무 궁금해서 잠이 안 올 것 같아요. 콜!",
      "콜 할게요! 자, 카드 보여줘요!"
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: ["Check.", "Free card.", "Checking.", "Pass.", "Check."],
    ko: ["체크! 공짜 카드 감사합니다!", "공짜는 언제나 환영이죠! 체크.", "체크할게요. 같이 가요!", "패스! 다음 상황 보죠.", "체크! 자자, 다음 카드!"]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "Aw man.",
      "No more chips.",
      "Gg.",
      "Fun game.",
      "Bye."
    ],
    ko: [
      "아이고 이런, 칩이 다 떨어졌네.",
      "더 이상 볼 칩이 없네요... 아쉽다.",
      "지지! 재미있는 게임이었어요.",
      "덕분에 즐겁게 놀다 갑니다!",
      "안녕히 계세요! 다음에 또 봐요!"
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "Wow.",
      "Gg.",
      "Nice hand.",
      "Bye.",
      "You out?"
    ],
    ko: [
      "와우! 저걸 이기다니 대단하네.",
      "지지! 수고하셨어요.",
      "좋은 핸드였어요! 멋진 승부였습니다.",
      "잘 가요! 다음에 다시 도전해줘요.",
      "어라, 벌써 나가시는 거예요? 아쉽네."
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Thinking? I usually just click Call.",
      "Don't worry, the next card will be great! Hurry up.",
      "Waiting is the only part of poker I don't like. Decide!",
      "Are you deciding which button looks prettiest? Click one!",
      "Tick-tock. Some of us want to see more cards!"
    ],
    ko: [
      "고민 중이세요? 전 보통 그냥 콜 누르는데 말이죠.",
      "걱정 마요, 다음 카드는 좋을 거예요! 빨리빨리!",
      "기다리는 건 질색이에요. 어서 다음 상황을 보여줘요!",
      "어떤 버튼이 예쁜지 고르는 중인가요? 아무거나 눌러봐요!",
      "똑딱똑딱. 카드 좀 더 보고 싶단 말이에요! 어서요!"
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "Wow, a big pot! Does that mean we see more cards?",
      "So many chips in the middle. Can I call even with 7-2?",
      "The tension is exciting! Everyone is so serious now.",
      "I hope I can see the river in this huge pot!",
      "Large pot detected! I simply must stay in and see what happens."
    ],
    ko: [
      "와아, 거대 팟이다! 그럼 카드 더 많이 볼 수 있는 거죠? 기대되네!",
      "가운데 칩이 정말 많네요. 7-2로도 그냥 콜 하고 싶다!",
      "긴장되는 분위기 최고예요! 다들 갑자기 진지해졌어, 재밌어!",
      "이 거대한 팟에서 꼭 리버까지 확인하고 싶어요!",
      "큰 판이다! 이건 무조건 껴서 끝까지 무슨 일이 생기나 봐야 해."
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "I called because I wanted to see, and I won! Lucky me!",
      "I wasn't even sure if I should fold. I'm glad I stayed in!",
      "You were bluffing? I suspect everyone is always bluffing!",
      "My 'Must See' rule paid off! Look at all these chips!",
      "Victory! Even though I didn't really know what was happening."
    ],
    ko: [
      "그냥 보고 싶어서 콜 했는데 이겼네! 역시 인생은 콜이야!",
      "접어야 할지 고민 좀 했는데, 안 가길 천만다행이네!",
      "당신 블러핑이었어요? 전 사실 모든 걸 다 뻥카라고 생각한다구요!",
      "내 '일단 무조건 본다' 규칙이 빛을 보네! 칩 좀 봐, 대박!",
      "승리! 사실 무슨 상황인지 정확히는 몰랐지만요, 헤헤."
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "Oh, I tried to be aggressive for once. Caught me! Hehe.",
      "My bluff failed? I guess I should stick to calling.",
      "You called that? Wow, you're a real pro!",
      "I tried to push people out, but it didn't work. Oh well.",
      "Caught red-handed! At least I got to see your cards now."
    ],
    ko: [
      "오, 이번엔 한번 공격적으로 해보려고 했는데 딱 걸렸네! 헤헤.",
      "제 블러핑이 실패했나요? 역시 전 그냥 콜맨 체질인가 봐요.",
      "그걸 받으셨어요? 우와, 진짜 고수시네!",
      "사람들을 쫓아내 보려고 했는데 잘 안 됐네. 뭐, 어쩔 수 없지.",
      "현장에서 검거 완료! 그래도 덕분에 당신 카드는 구경했네."
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "Calling isn't enough? Okay, let's reraise then.",
      "Wait, I actually have a hand this time. Reraise!",
      "I'm staying in, and I'm raising back.",
      "Is reraising allowed? I'll try it. Reraise.",
      "Surprise! Reraise."
    ],
    ko: [
      "콜만으로는 부족한가요? 그럼 리레이즈 하죠, 뭐!",
      "어라, 이번엔 저도 진짜 핸드가 있다구요. 공격 개시!",
      "나도 계속 갈 거야. 아니, 더 세게 갈 거야! 레이즈!",
      "리레이즈도 되는 거지? 한번 해볼게. 리레이즈!",
      "깜짝 놀랐지? 리레이즈 공격!"
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking! I just want to see more cards.",
      "I'll check too. No reason to bet.",
      "Let's keep it simple and check back.",
      "Free card? I love free cards. Check.",
      "Keeping the pot manageable. Check."
    ],
    ko: [
      "체크요! 그냥 카드 좀 더 보고 싶어서 그래요.",
      "저도 체크할게요. 싸울 이유가 전혀 없죠.",
      "그냥 무난하게 체크백 하고 다음 장면 보죠.",
      "공짜 카드? 공짜는 언제나 환영이죠! 체크.",
      "팟을 감당할 수 있는 수준으로 유지할게요. 평화롭게 체크!"
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "I have to fold? But I love calling... fold.",
      "This is too much for even me. Fold.",
      "I'm folding a good one. Don't tell anyone.",
      "I can't call this. Fold.",
      "Giving up on this one. Fold."
    ],
    ko: [
      "제가 폴드를 해야 하나요? 콜 하는 거 정말 좋아하는데... 폴드.",
      "이건 저조차도 감당이 안 되네요. 눈물을 머금고 폴드.",
      "진짜 좋은 패지만 버립니다. 이거 어디 가서 말하면 안 돼요!",
      "이건 도저히 콜 못 하겠네요. 죽을 때도 있는 법이죠.",
      "이번 한 번만 포기할게요. 아, 저 카드 진짜 보고 싶었는데...!"
    ]
  }
};
