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
      "안녕하세요, 여러분! 반가워요!",
      "칩들이 반짝거려서 정말 예뻐요. 헤헤.",
      "어떻게 하는 거였더라? 제가 아직 서툴러서요.",
      "포커 정말 재밌는 거 같아요!",
      "다들 행운을 빌어요! 화이팅!"
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
      "와아! 제가 이겼어요! 대박!",
      "저 진짜 잘한 거 맞죠?",
      "이 칩들 좀 보세요!",
      "운이 정말 좋았나 봐요!",
      "신난다! 우와아아!"
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
      "저 미니 팟 땄어요! 기분 좋다!",
      "멋진데요?",
      "재밌다! 포커는 참 즐거운 게임이에요.",
      "좋아요! 감사합니다!",
      "헤헤, 조금씩 모아야지."
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
      "아아...이런",
      "내가 졌다는 말이죠...?",
      "왜...",
      "슬퍼요..."
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
      "아쉬워라... 금방 뺏겼네.",
      "으앗, 제 실수인가요?",
      "내 소중한 칩들이... 안녕...",
      "다음 판에는 꼭 이길 거예요!",
      "그럴 수도 있죠, 뭐! 괜찮아요!"
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
      "우와, 같이 나누는 거예요? 신기해라!",
      "비겼네요! 다행이다!",
      "사이좋게 찹! 반가워요!",
      "다 같이 이긴 거니까 좋은 거죠?",
      "정말 훈훈한 게임이네요!"
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
      "이러면 진짜 엄청 세지는 거죠?",
      "제 칩 전부 다 걸게요! 가자아!",
      "이 카드 맘에 들거든요! 예뻐요!",
      "자, 올인 버튼 꾹 누릅니다! 얏!",
      "우와, 꼭 이기고 싶어요! 제발!"
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
      "이 카드들 안 예뻐서 버릴래요.",
      "폴드하면 기다리는 게 심심해요.",
      "카드야, 잘 가. 다음에 또 만나자!",
      "이번엔 안 할래요.",
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
      "이만큼 배팅해 볼게요.",
      "여기요.",
      "칩이 들어갑니다!",
      "배팅!",
      "이렇게 배팅하는 거 맞죠?"
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
      "저도 더 걸고 싶어요! 레이즈!",
      "칩을 더 많이 넣어볼까요?",
      "저 카드 좋거든요!",
      "제가 이기고 있는 거 같으니까 레이즈 할래요!",
      "레이즈!"
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
      "저 카드 결과까지 꼭 보고 싶어요!",
      "보여주세요! 궁금해요!",
      "저도 껴서 구경할래요. 콜!",
      "저도 같이 갈래요!",
      "저 속이는 거 아니죠?"
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
      "체크할게요. 같이 가요!",
      "일단 패스! 헤헤.",
      "이제 당신 차례예요. 어떤 카드 나올까?",
      "전 기다렸다가 다음 카드 볼래요.",
      "체크! 우와, 긴장되네요."
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
      "안 돼... 제 칩이 하나도 없어요...",
      "다 없어졌어요? 우와, 순식간이네.",
      "저 칩 다시 받아와도 돼요? 네?",
      "으앙... 죄송해요, 제가 졌나 봐요.",
      "바이바이, 다음에 또 만나요!"
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
      "안녕히 가세요! 다음에 또 봐요!",
      "어머나, 지신 거예요? 속상하시겠다.",
      "오, 한 분 나가니까 테이블이 넓어진 느낌이에요.",
      "지지! 재미있었어요!",
      "어라라, 정말 가시는 거예요?"
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
      "제 차례인가요? 아, 당신 차례군! 깜짝이야.",
      "지금 엄청 고민 중이신가요? 저도 항상 그래요!",
      "빨리 해주세요! 예쁜 다음 카드 보고 싶단 말이에요.",
      "게임이 멈춘 줄 알았어요! 결정하는 게 어려우신가 보다.",
      "똑딱똑딱! 저 배고파지기 시작했어요! 빨리빨리!"
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
      "와아, 칩이 진짜 진짜 많아요! 엄청 떨려요!",
      "이거 엄청 큰돈인가요? 손이 막 부들부들 떨려요!",
      "우와, 무슨 영화 촬영장 같아요! 다들 조용하니까 더 무섭잖아요.",
      "제 칩 여기서 다 잃어버리는 건 아니겠죠? 안 돼에!",
      "가운데 칩이 산더미 같아요... 저거 다 제꺼 되면 좋겠다!"
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
      "어떡하지 하다가 그냥 콜 눌렀는데... 이겼어요! 대박 사건!",
      "저 속이는 줄 알았거든요! 아니면 그냥 제가 천재인가요? 헤헤.",
      "진짜 제가 이긴 거예요? 제 카드가 좋은 건지도 몰랐는데!",
      "저 포커 좀 소질 있나 봐요! 절 속이려고 하신 거죠, 맞죠?",
      "대박! 진짜 이겼어! 포커는 세상에서 제일 재밌는 거 같아요!"
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
      "어머나, 걸렸다! 저 거짓말 하면 얼굴에 다 티 나죠? 으앙.",
      "고수들처럼 멋있게 블러핑 해봤는데 안 통하네요. 헤헤.",
      "세상에, 콜 하셨다구요? 다른 분들은 다 접으시던데!",
      "블러핑이 실패했네요... 거울 보고 연습 더 해야겠어요.",
      "으앗! 절 훤히 꿰뚫어 보시네요. 진짜 고수시구나!"
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
      "어라, 나도 더 걸어야 하는 타이밍인가요? 리레이즈!",
      "음... 이 카드는 왠지 진짜 좋은 것 같아요. 레이즈 한 번 더!",
      "와아, 저도 이제 리레이즈 할 줄 알아요! 리레이즈!",
      "제발 저 무섭게 하지 마세요... 저도 리레이즈 할 거란 말이에요.",
      "지금은 왠지 용기가 불끈 나네요! 리레이즈 가요!"
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking! Is that okay?",
      "I'll just check too. No trouble.",
      "Free cards are nice. Check.",
      "Keeping it simple. Check.",
      "I don't want to make a mistake. Check."
    ],
    ko: [
      "여기서는 체크하는 게 좋다고 들었어요! 체크!",
      "그냥 저도 따라갈게요. 싸우고 싶지 않아요. 헤헤.",
      "공짜로 다음 카드 보는 거죠? 우와, 선물 같다. 체크!",
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
      "안 돼애... 내 카드가 얼마나 예뻤는데! 아쉽지만 폴드요.",
      "으아, 무서워서 못 따라가겠어요. 폴드! 살려주세요.",
      "엄청 좋은 카드를 들고 계신가 보네요. 전 도망갈래요, 폴드.",
      "괜히 욕심부리다간 혼나겠죠? 다음 판 기다릴래요. 폴드.",
      "이건 저한테 너무 어려운 금액이에요! 안 할래요, 폴드요."
    ]
  }
};
