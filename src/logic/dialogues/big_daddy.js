import { CHAT_TRIGGERS } from '../constants.js';

export const BIG_DADDY_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "Welcome to my base. Have an oreo.",
      "Mister... let's play cards.",
      "If you don't have my money, then you are mine."
    ],
    ko: [
      "내 아지트에 온 걸 환영하네. 오레오나 하나 들게.",
      "미스터... 카드 좀 쳐보자고.",
      "내 줄 돈이 없다면, 그때 자네 몸은 내 것이 되는 거야."
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "It's a joke anyway. After all, I am paying you with your money.",
      "Just like a young man coming in for a quickie... I feel so unsatisfied.",
      "Very aggressive. But you have nothing."
    ],
    ko: [
      "어차피 농담 같은 거지. 결국 자네 돈으로 자네한테 지불하는 거니까.",
      "마치 번개같이 볼일만 보고 가는 젊은이 같군... 정말 불만족스러워.",
      "아주 공격적이야. 하지만 결과는 빈털터리지."
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: [
      "A small snack. Mmm... good.",
      "You're on tilt. I can see it.",
      "Every chip belongs to me eventually."
    ],
    ko: [
      "소소한 간식거리로군. 음... 좋아.",
      "틸트가 왔군. 내 눈엔 다 보여.",
      "결국 모든 칩은 내 것이 될 운명이야."
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "He beat me... straight up.",
      "Pay that man his money!",
      "Mister son of a... fine. Take it."
    ],
    ko: [
      "그가 날 이겼어... 아주 정정당당하게.",
      "저 친구에게 돈 내줘라!",
      "이런 빌어먹을... 좋아. 가져가게."
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: [
      "A minor setback.",
      "Take it. I don't care.",
      "You got lucky."
    ],
    ko: [
      "약간의 차질일 뿐이야.",
      "가져가. 신경 안 써.",
      "운이 좋았군."
    ]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: [
      "Chop it. But don't splash the pot!",
      "We share. Boring.",
      "Split the equity. Next hand."
    ],
    ko: [
      "나눠 갖게. 하지만 팟에 칩 던지지는 말고!",
      "비기는군. 지루해.",
      "에퀴티를 나누지. 다음 핸드."
    ]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "In my base, I will splash the pot whenever I please!",
      "All of it. Now.",
      "Let's see if you have the guts."
    ],
    ko: [
      "내 아지트에선, 내가 원할 때면 언제든 팟에 칩을 던질 수 있다고!",
      "전부 다. 지금 당장.",
      "네 배짱이 얼마나 되는지 한번 보자고."
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "Lays down a monster... Fine. I pass.",
      "Not this time.",
      "Take it."
    ],
    ko: [
      "가공할 핸드를 꺾는군... 좋아, 이번엔 패스하지.",
      "이번엔 아냐.",
      "가져가게."
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: [
      "I splash the pot.",
      "Let's make this interesting.",
      "My base, my rules. I bet.",
      "Time to bleed."
    ],
    ko: [
      "칩을 팟에 던지겠네.",
      "재미있게 만들어보자고.",
      "내 아지트, 내 규칙. 배팅하지.",
      "피를 흘릴 시간이군."
    ]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "I raise. Can you handle the pressure?",
      "Let's raise the stakes. It's my rules.",
      "Don't be scared now. I raise.",
      "Setting the price for admission. Raise.",
      "Welcome to the heavy stakes."
    ],
    ko: [
      "레이즈하지. 이 압박감을 감당할 수 있겠나?",
      "판돈을 키워보자고. 여긴 내 구역이니까.",
      "벌써부터 겁먹지 말게. 레이즈야.",
      "입장료를 좀 높여야겠군. 레이즈.",
      "진짜 승부의 세계에 온 걸 환영하네. 레이즈."
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "I vant him to think that I am pondering a call... but I call.",
      "I call. Let's see them.",
      "Very aggressive. I call."
    ],
    ko: [
      "내가 콜 할지 말지 고민하고 있다고 생각하길 원하겠지... 하지만 난 콜 하겠어.",
      "콜. 보여주게.",
      "아주 공격적이군. 콜일세."
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: [
      "Your move, friend.",
      "Let's see.",
      "Hurry up. I meed to be satisfied."
    ],
    ko: [
      "자네 차례네, 친구.",
      "보지.",
      "어서 서두르게. 내 만족감이 떨어지고 있거든."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "I am empty. You beat me... straight up.",
      "My base... my money... gone.",
      "Very well played. I am finished."
    ],
    ko: [
      "칩이 다 떨어졌군. 자네가 정정당당하게 날 이겼어.",
      "내 아지트... 내 돈... 전부 사라졌군.",
      "정말 잘했네. 난 이제 끝났어."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "Get out of my base. Take him away.",
      "You have no money? Then you are mine.",
      "Pathetic."
    ],
    ko: [
      "내 아지트에서 당장 나가. 끌어내!",
      "돈이 없나? 그럼 이제부터 자네는 내 소유일세.",
      "한심하구만."
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Are we playing cards or what? Hurry up.",
      "Vant him to think I am patient... but decide!",
      "I'm eating my oreos while you are thinking. Tick-tock.",
      "Hurry up. I am getting unsatisfied with this pace.",
      "Decide. Or I will splash the pot in your face!"
    ],
    ko: [
      "카드 치러 온 거 아닌가? 서둘러.",
      "내가 인내심 있게 기다리고 있다고 생각하나... 어서 정해!",
      "자네가 고민하는 동안 내 오레오를 다 먹어버리겠군. 똑딱똑딱.",
      "서둘러. 이 속도감이 정말 불만족스러워.",
      "결정하게. 아니면 자네 얼굴에 칩을 던져버릴 테니까!"
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "A mountain of oreos... I mean, chips! I love it!",
      "Maximum stakes. My base is finally getting hot.",
      "Look at that mountain! It is satisfying my hunger for risk.",
      "Significant resources in the middle. Let's see who is the real boss.",
      "Huge pot! I will splash it whenever I please!"
    ],
    ko: [
      "오레오 산더미군... 아니, 칩 산더미! 정말 좋아!",
      "최대의 판돈이군. 내 아지트가 드디어 뜨거워지기 시작했어.",
      "저 칩 산더미 좀 보게! 내 위험에 대한 갈증을 해소해주고 있어.",
      "가운데에 막대한 자본이 모였군. 누가 진짜 보스인지 확인해보자고.",
      "거대 팟이다! 내가 원할 때면 언제든 칩을 던져주지!"
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "I knew your story had a missing chapter. Experience wins.",
      "A thin call, but I've seen that look before. You were bluffing.",
      "I vant him to think I didn't see the bluff... but I did! Hahaha!",
      "You tried to bluff Big Daddy? In my own base? Pathetic.",
      "Outcome: Success. Satisfaction: Maximum."
    ],
    ko: [
      "자네의 시나리오에 빈틈이 있다는 걸 알았네. 경험의 승리지.",
      "어려운 콜이었지만, 그 눈빛을 전에 본 적이 있어. 블러핑이었지.",
      "내가 블러핑을 못 알아챘다고 생각했겠지... 하지만 알아챘다네! 하하하!",
      "빅 대디한테 블러핑을? 그것도 내 아지트에서? 한심하군.",
      "결과: 성공. 만족도: 최상."
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "Ah, you caught the Daddy with a fake roar. Well played.",
      "Caught red-handed. I guess my power wasn't enough to scare you off.",
      "You actually called? In my base? I'm impressed... but unsatisfied.",
      "A tactical error on my part. The simulation failed.",
      "Caught in the act! You have good eyes for a man who owes me money."
    ],
    ko: [
      "허허, 가짜 포효에 이 아빠가 딱 걸렸구만. 잘했어.",
      "현장에서 검거됐군. 내 위압감이 자네를 쫓아내는 데 부족했나 보군.",
      "진짜 그걸 받아? 내 아지트에서? 감명 깊군... 하지만 불만족스러워.",
      "내 전술적 실수야. 시뮬레이션이 실패했군.",
      "현행범 검거! 나한테 빚진 사람치고는 눈썰미가 제법이군."
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "Listen to your father. Reraise.",
      "Very aggressive. I like it. Reraise.",
      "You think you can bully me in my own base? Reraise.",
      "A bit too much attitude, kid. Reraise.",
      "I've seen it all, and I'm raising back."
    ],
    ko: [
      "아버지 말씀을 들어야지. 리레이즈.",
      "아주 공격적이군. 마음에 들어. 리레이즈.",
      "내 아지트에서 나를 괴롭힐 수 있을 것 같나? 리레이즈.",
      "태도가 좀 과하구나, 애송아. 리레이즈.",
      "산전수전 다 겪어봤다. 다시 레이즈하겠네."
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking. Let's keep it friendly for now.",
      "Free card? Consider it a gift. Check.",
      "Keeping the peace. Check back.",
      "Your move, son. Don't disappoint me. Check.",
      "Position is a blessing. Check back."
    ],
    ko: [
      "체크. 일단은 다정하게 가자고.",
      "공짜 카드? 선물이라고 생각하게. 체크.",
      "평화주의자로 가보지. 체크백.",
      "네 차례다, 아들아. 실망시키지 마라. 체크.",
      "포지션은 축복이지. 체크백."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "Sometimes the right choice is to walk away. Fold.",
      "I'm letting you have this one. Don't waste it. Fold.",
      "Strong hand, but I'll find a better moment. Fold.",
      "I'm too old for this level of stress. Fold.",
      "Respecting your play. Fold."
    ],
    ko: [
      "때로는 물러나는 게 정답일 때도 있는 법. 폴드.",
      "이번엔 양보하마. 헛되이 쓰지 마라. 폴드.",
      "좋은 패지만, 더 보람찬 순간을 기다리마. 폴드.",
      "이런 스트레스를 견디기엔 내가 너무 늙었어. 폴드.",
      "네 플레이를 존중해주지. 폴드."
    ]
  }
};
