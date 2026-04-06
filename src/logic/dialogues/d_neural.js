import { CHAT_TRIGGERS } from '../constants.js';

export const D_NEURAL_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "Hey everyone! Let's have fun!",
      "I love this game! Do you?",
      "What's everyone drinking?",
      "Small ball poker!",
      "Let's see some flops!"
    ],
    ko: [
      "안녕! 여러분 재미좀 보자구!",
      "이 게임 정말 재밌네! 맞지?",
      "다들 뭐 마시면서 하고 있나?",
      "스몰 볼 포커!",
      "플랍좀 보자고!"
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "I KNEW you had that!",
      "My read was perfect!",
      "So much fun!",
      "Scooping!",
      "Did you see that river?"
    ],
    ko: [
      "거봐요! 당신 그거 들고 있을 줄 알았어!",
      "내 리딩이 완벽했네!",
      "와, 정말 짜릿한 판이었어!",
      "스쿠핑!",
      "방금 그 리버 보셨어요?"
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: [
      "Pots are pots!",
      "Mining chips.",
      "Incrementing.",
      "Nice tiny pot.",
      "I'll take it."
    ],
    ko: [
      "작은 팟도 소중하지!",
      "칩 하나하나 캐는 재미가 있네.",
      "조금씩 늘려보자구!",
      "소소한 팟이네.",
      "가져갈게!"
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "Wow! You actually had it?",
      "Incredible hand!",
      "You played that well.",
      "I put you on a bluff!",
      "That stings!"
    ],
    ko: [
      "와우! 진짜 그거 들고 있었네?",
      "와, 정말 엄청난 핸드네!",
      "플레이 정말 잘하네!",
      "블러핑인 줄 알고 들어간 건데!",
      "어우, 이번 판은 꽤 아프네!"
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: [
      "Nice hand.",
      "Lost a little.",
      "Gg.",
      "Oops.",
      "Next one."
    ],
    ko: [
      "굿 핸드!",
      "조금 잃었네!",
      "지지!",
      "아이쿠.",
      "다음 판!"
    ]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: [
      "Chop!",
      "We share!",
      "EVERYONE LOVES A CHOP POT!!",
      "Split pot!",
      "Nice."
    ],
    ko: [
      "찹! 사이좋게 나눠요!",
      "같이 나누자고!",
      "모두가 행복한 찹 팟이라니!!",
      "팟을 나누자!",
      "나이스!"
    ]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "I think I'm ahead!",
      "Let's gamble!",
      "Do you have Ace King?",
      "I'm feeling it!",
      "All the biscuits!"
    ],
    ko: [
      "아무래도 제가 앞서고 있는 것 같은데!",
      "겜블 시작!",
      "혹시 AK 들고 있는 거 아냐?",
      "느낌이 오는데!",
      "모든 비스킷을 팟에!"
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "Foldy foldy.",
      "Trash.",
      "Not my cards.",
      "Saving money.",
      "Bye bye."
    ],
    ko: [
      "폴드, 폴드.",
      "쓰레기 패.",
      "인연이 아니네.",
      "돈 좀 아껴야겠어.",
      "잘 가!"
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: [
      "Just a little bet.",
      "Poker is fun!",
      "Betting!",
      "Action!",
      "Here comes the bet."
    ],
    ko: [
      "살짝 배팅해볼게.",
      "포커는 정말 재밌어!",
      "자, 배팅 들어갑니다!",
      "액션!",
      "배팅 들어간다!"
    ]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "I think I'm winning!",
      "Raising it up!",
      "Power poker!",
      "Make it expensive!",
      "Raise!"
    ],
    ko: [
      "이번엔 제가 이기고 있는 것 같은데!",
      "판 키웁니다!",
      "파워 포커!",
      "가격을 좀 올려볼까!",
      "레이즈! 따라오실 건가요?"
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "I have to see.",
      "Calling station mode!",
      "What do you have?",
      "I call!",
      "Let's see the river."
    ],
    ko: [
      "이건 꼭 봐야겠어!",
      "콜링 스테이션 모드야!",
      "음, 뭘 가지고 있을까?",
      "콜할게!",
      "리버 좀 보자고!"
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: [
      "Check.",
      "Free card please.",
      "Pass.",
      "Checking."
    ],
    ko: [
      "체크.",
      "공짜 카드 부탁해!",
      "일단 패스.",
      "체크할게."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "Aww man!",
      "That was fun though!",
      "Gg guys!",
      "Cruel river!",
      "I'm out!"
    ],
    ko: [
      "아아, 이런!",
      "그래도 정말 재밌는 시간이었어!",
      "다들 지지!",
      "리버가 참 잔인하네...",
      "난 이만 가볼게!"
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "Ouch! Sorry buddy.",
      "Nice try!",
      "Gg!",
      "That was intense.",
      "Who's next?"
    ],
    ko: [
      "으악! 미안해요, 친구. 어쩔 수 없었어.",
      "시도는 정말 좋았어요! 멋진 승부였어.",
      "지지! 아쉽게 됐네요.",
      "정말 치열한 판이었어요. 흥분되네요!",
      "자, 다음은 누구랑 놀아볼까요?"
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Thinking? I'm just here to play! Hurry up.",
      "Don't take too long, the next hand is going to be even better!",
      "You're making the TV cameras wait! Hurry up, buddy.",
      "Is it really that hard? I usually know in 2 seconds!",
      "Tick-tock. I'm getting hungry for more action!"
    ],
    ko: [
      "고민 중이야? 난 그냥 놀러 온 건데! 어서 결정해.",
      "너무 오래 끌지 마, 다음 핸드는 훨씬 더 좋을 거라구!",
      "TV 카메라들이 다 기다리고 있잖아! 빨리빨리, 친구!",
      "그렇게 어려운가? 난 보통 2초면 다 안다구! 하하.",
      "똑딱똑딱. 액션이 더 필요해, 배고프다구!"
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "Now that's a lot of chips! I'm nervous but excited!",
      "This is what I live for! Everyone is so quiet now.",
      "Wow, a huge pot! I heart poker so much right now!",
      "It's a big investment! Let's see who's got the goods.",
      "Max volume, max chips! This is small ball at its peak!"
    ],
    ko: [
      "와아, 칩 정말 많네요! 떨리면서도 구미가 당기는데요?",
      "내가 바로 이 맛에 포커 친다니까요! 다들 조용해진 것 좀 봐.",
      "우와, 거대 팟! 지금 포커가 정말 사랑스러워지네요! 아이 러브 포커!",
      "엄청난 투자네요! 누가 진짜 패를 가졌나 같이 확인해볼까요?",
      "최대 볼륨, 최대 스택! 스몰 볼 포커의 정점이네요!"
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "I KNEW you were bluffing! I saw it in your eyes!",
      "My read was perfect! I have to see it and I did.",
      "You tried to bluff Daniel? I'm the master of the small talk read!",
      "That was a fun hand. You were almost convincing, almost!",
      "I call, I win! High five someone!"
    ],
    ko: [
      "자네가 블러핑 중이라는 거 다 알고 있었어! 눈빛이 딱 그랬거든!",
      "내 리딩이 완벽했어! 꼭 봐야겠다고 생각했는데 적중했어.",
      "나한테 블러핑을? 난 세상 모든 수다 섞인 리딩의 달인이라구!",
      "정말 재밌는 판이었어. 거의 속을 뻔했을 정도로 대단했네, 거의!",
      "콜, 그리고 승리! 누구 저랑 하이파이브 할 사람 없나요?"
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "Wow, you actually called that? Well played! Hehe.",
      "You caught me! I guess I should stick to small ball.",
      "Oops! My radar was a little bit off on that one.",
      "Caught red-handed! You're a better reader than I thought.",
      "Negative EV move there. I'll adjust for the next session!"
    ],
    ko: [
      "와우, 진짜 그걸 받았어? 한수 배웠네! 대단해!",
      "딱 걸렸네! 역시 난 점잖게 스몰 볼이나 굴려야 하나 봐. 헤헤.",
      "아이쿠! 이번엔 내 레이더가 살짝 빗나갔나 보네. 방심했어!",
      "현장에서 검거 완료! 생각보다 훨씬 리딩을 잘하는데?",
      "기대값 낮은 실수를 했네. 다음 판엔 보정하고 올게!"
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "Let's make it a bit more expensive. Reraise.",
      "I'm raising you back! Power poker!",
      "Reraise. I have a feeling about this one.",
      "You're playing my game now. Reraise.",
      "Increasing the excitement level. Reraise!"
    ],
    ko: [
      "가격을 좀 더 올려볼까? 분위기 좋네! 리레이즈.",
      "나도 다시 레이즈 할게! 파워 포커!",
      "리레이즈. 이번 판은 느낌이 참 좋네. 감이 와!",
      "내 페이스대로 오고 있네. 리레이즈!",
      "흥미진진하게 만들어 보자구! 리레이즈!"
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking to the raiser.",
      "Checking! Keeping the pot small and friendly.",
      "Check back. I'll take the free information.",
      "Standard check from position. Professional play.",
      "Let's see what the next card brings. Check.",
      "Keeping you guessing. Check back."
    ],
    ko: [
      "레이저에게 체크!",
      "체크! 팟을 작고 다정하게 유지하자구",
      "체크백. 공짜 정보는 언제나 환영이지",
      "포지션에서 정석대로 체크. 이것이 프로다운 플레이.",
      "다음 카드가 뭘 줄지 보지. 체크!",
      "당신을 알쏭달쏭하게 만들겠어. 체크백."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "I'm making a disciplined fold here. Good bet.",
      "I'm passing on this one. You played it well.",
      "Strong hand, but I'll find a better spot. Fold.",
      "I have to let this one go. I'll get you next time!",
      "Protecting my stack for the long run. Fold."
    ],
    ko: [
      "이번 건 패스할게. 플레이 정말 멋지게 하네.",
      "강한 패지만, 더 보람찬 순간을 기다릴게. 폴드!",
      "이건 놔줘야 할 것 같네. 다음번에 꼭 복수할 거야!",
      "장기적인 승부를 위해 스택을 아낄게. 폴드!"
    ]
  }
};
