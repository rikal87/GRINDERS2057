import { CHAT_TRIGGERS } from '../constants.js';
// 무던, 짧고 담담한 말투
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
      "플랍은 꼭 봐야죠.",
      "두 장이면 되죠.",
      "해보죠, 뭐.",
      "저도 껴요.",
      "안녕하세요."
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
      "맞췄네요.",
      "왔네요.",
      "운이 좋았어요.",
      "오.",
      "좋네요."
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: ["I won.", "Cool.", "Nice.", "Yay.", "Chips."],
    ko: ["이겼네요.", "뭐, 나쁘지 않네.", "좋아요.", "칩이 늘었네.", "수익이면 됐죠."]
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
      "이길 줄 알았는데.",
      "아깝네요.",
      "졌네요.",
      "좋은 핸드네요.",
      "안 됐네요."
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: ["Oh well.", "Nice hand.", "Good hit.", "Lost a bit.", "Oops."],
    ko: ["어쩔 수 없죠.", "잘 하셨네요.", "좋은 카드네요.", "조금 잃었네.", "실수했나."]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: ["Chop!", "Tie hand!", "We share!", "Cool.", "Split."],
    ko: ["찹이네요.", "비겼네요.", "나눠요.", "공평하네요.", "스플릿."]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "Maybe it hits.",
      "",
      "Let's gamble.",
      "Hope?"
    ],
    ko: [
      "맞을 수도 있죠.",
      "안 접어요.",
      "해보는 거죠.",
      "희망이 있잖아요."
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
      "하기 싫지만, 폴드.",
      "어쩔 수 없네.",
      "폴드. 다음 카드 보고 싶었는데.",
      "죽기 싫지만 폴드.",
      "항복이에요."
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: ["Min bet.", "Clicking buttons.", "Bet.", "Here.", "Chips."],
    ko: ["최소 배팅.", "카드 보고 싶어서요.", "칩 하나.", "배팅.", "칩요."]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: ["Raise?", "I assume so.", "Misclick?", "Strong?", "Raise."],
    ko: ["올려볼까요.", "레이즈할게요.", "잘못 눌렀나. 뭐, 레이즈.", "레이즈.", "레이즈."]
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
      "콜이요.",
      "봐야겠어요.",
      "못 죽겠네요.",
      "궁금하니까 콜.",
      "콜이요."
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: ["Check.", "Free card.", "Checking.", "Pass.", "Check."],
    ko: ["체크요.", "공짜네요. 체크.", "체크.", "패스.", "체크."]
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
      "칩이 다 떨어졌네요.",
      "더 볼 칩이 없네요.",
      "지지.",
      "즐거웠어요.",
      "안녕히 계세요."
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
      "좋은 핸드네요.",
      "지지.",
      "잘 하셨어요.",
      "잘 가요.",
      "벌써요?"
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Thinking? I usually just click Call.",
      "Next card will probably be good. Hurry up.",
      "Waiting is the only part I don't like.",
      "Just click something.",
      "Tick-tock. More cards to see."
    ],
    ko: [
      "고민 중이세요? 그냥 콜 누르면 되는데.",
      "다음 카드는 좋을 거예요. 빨리요.",
      "기다리는 건 좀 힘드네요.",
      "그냥 아무거나 눌러요.",
      "째깍째깍. 카드 보고 싶다고요."
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "Big pot. More cards to see, right?",
      "So many chips. Can I call with 7-2?",
      "Everyone got serious.",
      "Just want to see the river.",
      "Large pot. I'm staying to see."
    ],
    ko: [
      "팟이 크네요. 카드 더 볼 수 있겠는데.",
      "칩이 많네요. 7-2로도 콜하고 싶어요.",
      "갑자기 다들 진지해졌네.",
      "리버까지는 봐야겠는데.",
      "이건 봐야 하는데."
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "Called to see, and won. Lucky.",
      "Wasn't sure to fold. Stayed. Good.",
      "You were bluffing. I kind of figured.",
      "'Must See' rule worked. Nice chips.",
      "Won. Didn't really know what was happening."
    ],
    ko: [
      "그냥 보고 싶어서 콜 했는데 이겼네요.",
      "접으려다 그냥 봤더니.",
      "블러핑이었군요. 그럴 것 같긴 했어요.",
      "'일단 본다' 규칙 덕분이네요.",
      "이겼네요. 사실 잘 모르겠었어요."
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "Tried being aggressive. Got caught.",
      "Bluff failed. Should stick to calling.",
      "You called that. Good read.",
      "Tried to push people out. Didn't work.",
      "Caught. At least I saw your cards."
    ],
    ko: [
      "공격적으로 해봤는데 걸렸네요.",
      "역시 콜만 하는 게 맞나봐요.",
      "그걸 받으셨네요.",
      "쫓아내려 했는데 안 됐네요.",
      "걸렸네요. 카드는 봤으니까요."
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
      "콜만으로는 부족한가봐요. 리레이즈.",
      "이번엔 핸드가 있어요. 리레이즈.",
      "계속 가요. 리레이즈.",
      "리레이즈도 되나요. 해볼게요.",
      "리레이즈."
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking. Want to see more cards.",
      "I'll check. No reason to bet.",
      "Check back.",
      "Free card. Check.",
      "Check."
    ],
    ko: [
      "카드 더 보고 싶어서 체크요.",
      "체크할게요.",
      "체크백이요.",
      "공짜네요. 체크.",
      "체크."
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
      "폴드가 맞겠죠... 폴드.",
      "이건 저도 못 따라가겠어요.",
      "좋은 패인데. 폴드.",
      "이건 못 콜하겠네요.",
      "카드 보고 싶었는데. 폴드."
    ]
  }
};
