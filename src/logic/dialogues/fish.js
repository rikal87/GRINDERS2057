import { CHAT_TRIGGERS } from '../constants.js';

export const FISH_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "Hi everyone!",
      "These chips are pretty.",
      "How do I play again?",
      "Having fun!",
      "Good luck!"
    ],
    ko: [
      "안녕!",
      "칩들이 정말 이쁘군.",
      "어떻게 하는 거였더라?",
      "즐겨보자고!",
      "행운을 빌어!"
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "Yay! I won!",
      "Did I do good?",
      "Look at all these!",
      "So lucky!",
      "Woohoo!"
    ],
    ko: [
      "와아! 내가 이겼어!",
      "나 진짜 잘한 거 맞지?",
      "이 칩들 좀 봐!",
      "운이 정말 좋았나 봐!",
      "우와아아!"
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: [
      "I won something!",
      "Cool!",
      "Fun!",
      "Nice!",
      "Hehe."
    ],
    ko: [
      "뭔가 이긴거 같아!",
      "멋진데?",
      "재밌네!",
      "좋아!",
      "헤헤."
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "Aww...",
      "That's mean...",
      "Why?",
      "Sad face."
    ],
    ko: [
      "아아...",
      "내가 졌다는 말이죠...?",
      "왜...",
      "슬프네..."
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: [
      "Aww...",
      "Oops.",
      "My chips...",
      "Next hand!",
      "Oh well."
    ],
    ko: [
      "아쉬워...",
      "이런..",
      "내 칩들이...",
      "다음 판!",
      "뭐 어때!"
    ]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: [
      "We share?",
      "Yay, a tie!",
      "Chop!",
      "Everyone wins!",
      "Friendly game."
    ],
    ko: [
      "같이 나누는 건가?",
      "비겼네!",
      "찹!",
      "다 같이 이긴 거니까 좋은 거지?",
      "친근한 게임이네!"
    ]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "Is this good?",
      "All my chips!",
      "I like this hand!",
      "Clicking the button!",
      "Hope I win!"
    ],
    ko: [
      "이러면 좋은 거지?",
      "칩 전부 다 걸게!",
      "이 카드 맘에 들어!",
      "올인 버튼 누를게!",
      "이기고 싶어!"
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "I don't like these.",
      "Folding is boring.",
      "Bye bye cards.",
      "No thanks.",
      "Next please."
    ],
    ko: [
      "별로 마음에 안드는 카드들이야.",
      "폴드하면 기다리는 게 심심해.",
      "카드야, 잘 가.",
      "이번엔 안 할래.",
      "다음 판이요!"
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: [
      "I bet this much.",
      "Here.",
      "Chips go in.",
      "Betting!",
      "Is this right?"
    ],
    ko: [
      "이만큼 배팅할래.",
      "여기.",
      "칩이 들어간다!",
      "배팅!",
      "이렇게 배팅하는 거 맞지?"
    ]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "I raise you!",
      "More chips!",
      "Take that!",
      "I think I'm winning.",
      "Raise!"
    ],
    ko: [
      "더 걸고 싶어! 레이즈!",
      "더 많은 칩!",
      "받아라!",
      "이거 이길 수 있을 것 같아!",
      "레이즈다!"
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "I want to see.",
      "Show me!",
      "Calling.",
      "Staying in!",
      "Don't bluff me."
    ],
    ko: [
      "난 봐야겠어.",
      "보여줘!",
      "콜할게.",
      "벼텨라!",
      "날 속이려 들지마."
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: [
      "Checking.",
      "Pass.",
      "Your turn.",
      "I wait.",
      "Check."
    ],
    ko: [
      "체크할게.",
      "일단 패스.",
      "이제 당신 차례야.",
      "난 기다렸다가 다음 카드 볼래.",
      "체크!"
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "Oh no...",
      "All gone?",
      "Can I play again?",
      "Oops.",
      "Bye bye."
    ],
    ko: [
      "안 돼...",
      "다 없어졌어?",
      "칩 다시 받아와야 하나?",
      "이런...",
      "바이 바이."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "Bye!",
      "You lost?",
      "Oh refreshing.",
      "Gg!",
      "Whoops."
    ],
    ko: [
      "안녕히 가세요!",
      "졌어요?",
      "테이블이 넓어진 느낌이야!",
      "지지!",
      "저런."
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Is it my turn? Oh wait, it's yours!",
      "Are you thinking really hard? Me too!",
      "Hurry up! I want to see the pretty cards.",
      "Did the game stop? Oh, you're just slow.",
      "Tick-tock! I'm getting hungry!"
    ],
    ko: [
      "제 차례인가요? 아, 당신 차례군요!",
      "지금 엄청 고민 중이신가요? 저도 항상 그래요!",
      "빨리 해주세요! 다음 카드를 보고 싶어요.",
      "게임이 멈춘 줄 알았어요! 결정이 어려우신가 봐요.",
      "똑딱똑딱! 저 배고파지기 시작했어요!"
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "Wow, there are so many chips! I'm nervous!",
      "Is this a lot of money? My hands are shaking!",
      "This is like a movie! Everyone is so quiet.",
      "I hope I don't lose all my chips here...",
      "So many chips in the middle... can I have them?"
    ],
    ko: [
      "와아, 칩이 진짜 많아! 엄청 떨리네!",
      "이거 엄청 큰돈인가? 손이 막 부들부들 떨려!",
      "우와, 무슨 영화 촬영장 같아! 다들 조용하니까 더 무섭잖아.",
      "여기서 칩 다 잃으면 안 되는데...",
      "칩이 산더미 같아... 과연 내가 가질 수 있을까?"
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "I didn't know what to do, so I just clicked call... and I won! Yay!",
      "I thought you were bluffing! Or maybe I just got lucky?",
      "Is it my victory? I wasn't even sure about my cards!",
      "I'm learning! You were trying to trick me, right?",
      "Wow! I actually won! This is so much fun!"
    ],
    ko: [
      "어떡하지 하다가 그냥 콜 눌렀는데... 이겼어!",
      "저 속이는 줄 알았거든요! 아니면 그냥 제가 천재인가요? 헤헤.",
      "진짜 제가 이긴 거예요? 제 카드가 좋은 건지도 몰랐는데!",
      "저 포커 좀 소질 있나 봐! 절 속이려고 하신 거죠, 맞죠?",
      "와! 진짜 이겼어! 포커는 재밌는 거였어!"
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "Oh no, you caught me! I'm not good at lying, am I?",
      "I tried to be brave like the pros, but it didn't work. Hehe.",
      "You called? But I thought you would fold!",
      "My bluff failed... I should practice my poker face.",
      "Oops! You saw right through me. You're good!"
    ],
    ko: [
      "이런, 걸렸어! 거짓말 하면 얼굴에 다 티 나나봐.",
      "고수들처럼 멋있게 블러핑 해봤는데 안 통하네. 헤헤.",
      "세상에, 콜 하셨다구요? 다른 분들은 다 접으시던데!",
      "블러핑이 실패했네... 포커페이스 연습이 좀 필요할 것 같아.",
      "으앗! 절 훤히 꿰뚫어 보시네요. 진짜 고수시네요!"
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "Wait, I'm supposed to raise back? Okay, reraise!",
      "I... I think I have a good hand. Raise again.",
      "Is this how you play? Reraise.",
      "Please don't hurt me... reraise.",
      "I'm feeling brave! Reraise."
    ],
    ko: [
      "어라, 나도 더 걸어야 하는 타이밍인가? 리레이즈!",
      "음... 이 카드는 왠지 진짜 좋은 것 같아. 레이즈 한 번 더!",
      "이렇게 하는 거 맞나? 리레이즈!",
      "저 무섭게 하지 마세요... 저도 리레이즈할 겁니다!",
      "지금은 왠지 용기가 불끈 나네! 리레이즈 갑니다!"
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking! Is that okay?",
      "I'll just check too. No trouble.",
      "Check is nice. Check.",
      "Keeping it simple. Check.",
      "I don't want to make a mistake. Check."
    ],
    ko: [
      "여기서는 체크하는 게 좋다고 들었어요! 체크!",
      "그냥 저도 따라갈게요. 싸우고 싶지 않아요.",
      "체크 좋죠, 나도 체크!",
      "복잡한 건 싫어요. 조용히 체크백 할게요.",
      "실수해서 칩 다 잃으면 속상하니까... 그냥 체크!"
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "Oh no, but my cards were so pretty! Fold.",
      "I'm too scared to call. Fold.",
      "You must have a really big hand. Fold.",
      "I'll just wait for the next one. Fold.",
      "Too much for me! Fold."
    ],
    ko: [
      "안 돼애... 내 카드 예뻤는데! 아쉽지만 폴드요.",
      "무서워서 콜 못하겠네요. 폴드!",
      "좋은 카드를 들고 계신가 보네요, 폴드.",
      "다음 판 기다릴래요. 폴드.",
      "이건 저한테 너무 큰 금액이에요! 안 할래요, 폴드요."
    ]
  }
};
