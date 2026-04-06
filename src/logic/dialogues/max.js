import { CHAT_TRIGGERS } from '../constants.js';

export const MAX_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "Let's get this over with.",
      "Try not to lose it all at once.",
      "Texas style, baby.",
      "My chips, my rules.",
      "Don't blink."
    ],
    ko: [
      "자, 빨리 시작하자고.",
      "한번에 다 잃지 않게 조심해, 임마.",
      "이게 바로 텍사스 스타일이지.",
      "내 칩, 내 규칙대로 간다. 불만 없지?",
      "눈 깜빡이지 마라. 골로 가는 거 순식간이다."
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "That's how we do it back home!",
      "Read you like a book!",
      "Easiest money of my life.",
      "Don't cry about it.",
      "Texas strong!"
    ],
    ko: [
      "우리 고향에선 다 이렇게 한다고! 하하!",
      "널 책 보듯이 훤히 다 읽었지! 뻔하구만.",
      "내 인생에서 제일 쉽게 번 돈이네. 고맙다.",
      "질질 짜지 말라고. 이게 포커다.",
      "텍사스의 힘이다! 봤냐?"
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: [
      "A win's a win.",
      "Keep 'em coming.",
      "Not bad.",
      "I'll take it.",
      "Small change."
    ],
    ko: [
      "이긴 건 이긴 거지. 안 그래?",
      "계속 가져와 보라고. 짭짤하네.",
      "나쁘지 않아. 흐름 좋고!",
      "칩은 내가 가져가마.",
      "소소한 수익이군. 티끌 모아 태산이지."
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "Are you kidding me?!",
      "Absolute garbage luck.",
      "This deck is rigged.",
      "You shouldn't even be in that hand!",
      "Son of a..."
    ],
    ko: [
      "지금 장난해?! 말도 안 돼!",
      "말도 안 되는 쓰레기 운이군. 지독하다.",
      "이 덱 주작 아니야? 리버 상태가 왜 이래!",
      "네가 그 핸드로 들어오면 안 되는 거였다고! 으휴.",
      "이런 빌어먹을... 이번 판은 내 실수군."
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: [
      "Whatever.",
      "Just wait.",
      "Next hand.",
      "Lucky catch.",
      "Hmm."
    ],
    ko: [
      "상관없어. 이 정도야 뭐.",
      "두고 보자고. 다음 판에 갚아주지.",
      "다음 판 가자. 분위기 전환 해보자고.",
      "운 좋게 잡았네. 운도 실력이라지?",
      "흠. 이번엔 네가 이겼다."
    ]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: [
      "Chop.",
      "Tie.",
      "Save the chips.",
      "Split it.",
      "Fine."
    ],
    ko: [
      "찹. 사이좋게 나눠.",
      "비겼군. 시시하구만.",
      "칩이나 아끼자고. 다음 판을 위해서.",
      "반으로 나눠. 공평하게.",
      "좋아. 찹 하도록 하지."
    ]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "Let's ride!",
      "All in, let's see it!",
      "No guts, no glory.",
      "Put 'em in the middle.",
      "Shoving!"
    ],
    ko: [
      "한번 달려보자고! 인생 뭐 있어?",
      "올인이다, 보여줘 봐! 배짱 좀 보자.",
      "배짱 없으면 영광도 없는 법. 안 그래?",
      "가운데로 다 밀어 넣어라! 시원하게!",
      "그냥 박는다! 결과는 하늘에 맡기자고!"
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "Garbage.",
      "Fold.",
      "Not this time.",
      "Pass.",
      "I can wait."
    ],
    ko: [
      "쓰레기 패군. 퉤-",
      "폴드. 이번엔 넘어가마.",
      "이번엔 아니야. 나중에 보자고.",
      "패스. 지루하게 굴지 말자.",
      "난 기다릴 수 있어. 인내심이 내 장점이지."
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: [
      "Let's see where you're at.",
      "Bet.",
      "Price of poker.",
      "Action.",
      "Chips in."
    ],
    ko: [
      "네가 지금 어떤지 좀 볼까. 배팅!",
      "배팅하겠어. 따라오려고?",
      "포커 하려면 이 정돈 내야지. 안 그래?",
      "액션 가자! 자, 대답해보라고.",
      "칩 들어간다. 각오해라."
    ]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "Not so fast.",
      "Pump it up.",
      "Raise.",
      "Let's make it a real pot.",
      "Costing you more now."
    ],
    ko: [
      "그렇게는 안 되지. 가격 좀 올려야겠어.",
      "판 좀 키워볼까? 화끈하게!",
      "레이즈. 주도권은 내게 있다.",
      "진짜 팟답게 만들어보자고. 거대하게!",
      "이제 좀 더 비싸질 거야. 감당할 수 있겠냐?"
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "I'll bite.",
      "Let's see it.",
      "Call.",
      "I have to know.",
      "Can't fold this."
    ],
    ko: [
      "미끼 한번 물어주지. 하하.",
      "한번 보자고. 뭐가 들었길래 그래?",
      "콜. 받아주겠어.",
      "꼭 알아야겠단 말이야. 리딩 확인용이지.",
      "이걸 죽을 순 없지. 끝까지 가보자고."
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: [
      "Check.",
      "Your move.",
      "Pass.",
      "Seeing a free card.",
      "I'll wait."
    ],
    ko: [
      "체크. 상황 보지.",
      "네 차례다. 어서 해봐.",
      "패스. 다음 상황 가보자고.",
      "공짜 카드 좀 볼까. 좋네.",
      "기다리마. 서두를 거 없지."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "Man, forget this.",
      "I need a drink.",
      "Worst luck ever.",
      "I'm out of here.",
      "See you around."
    ],
    ko: [
      "이봐, 관두자고. 오늘은 영 아니네.",
      "술이나 한잔해야겠네. 칩도 없는데.",
      "내 인생 최악의 운이야. 리버가 왜 이래!",
      "난 여기서 나간다. 다들 수고들 해.",
      "나중에 보자고. 그때는 복수하마."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "Don't let the door hit you.",
      "Another one down.",
      "That's what you get.",
      "See ya.",
      "Get off the table."
    ],
    ko: [
      "나가는 문 조심해라, 임마. 짐 잘 챙기고.",
      "또 하나 처리했군. 시원하네.",
      "네가 자초한 결과야. 한 수 배웠길 빈다.",
      "잘 가라고. 고생 많았다.",
      "테이블에서 꺼져. 이제 내 구역이야."
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Texas ain't that slow. Hurry up!",
      "Decision time, partner! Don't let the dust settle.",
      "Are you waiting for a miracle? It ain't coming.",
      "Hurry up! My cattle are getting hungry back home.",
      "Tick-tock. Some of us want to play."
    ],
    ko: [
      "텍사스도 이렇게 느리진 않다고. 빨리빨리 해!",
      "결정할 시간이야, 파트너! 서둘러라.",
      "기적이라도 바라는 거야? 그런 건 안 온다고.",
      "서둘러! 고향에 있는 내 소떼들이 기다린다.",
      "똑딱똑딱. 나 기다리다 지치겠다, 임마."
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "Now that's a real Texas-sized pot! I love it!",
      "This is what I live for! Maximum pressure, huge stakes.",
      "Look at that pile of chips... almost as big as my ranch!",
      "Things are heating up! Significant outcome coming.",
      "A huge pot... let's see who's got the biggest guts."
    ],
    ko: [
      "오호, 텍사스 규모 팟이군! 아주 좋아!",
      "내가 바로 이걸 위해 산다고! 최대의 압박감, 엄청난 판돈.",
      "저 칩 쌓인 것 좀 봐... 내 목장만큼이나 거대하구만!",
      "분위기 달아오르는데! 곧 큰 거 한 방 터지겠어.",
      "어마어마한 팟이군... 누가 제일 배짱이 두둑한지 볼까."
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "I knew your story was fake! My gut never fails me.",
      "A hard call, but I saw right through you. My chips now!",
      "You tried to bluff a man who's seen everything? Nice try, kid.",
      "My intuition told me you were full of it. I was right.",
      "I don't need a monster hand. I just need to read ya."
    ],
    ko: [
      "네 연기가 가짜라는 거 다 알고 있었어! 내 촉은 최고지.",
      "힘든 결정이었지만 널 훤히 들여다봤다. 이제 내 칩 내놔!",
      "산전수전 다 겪은 나한테 블러핑을? 시도는 좋았다, 임마.",
      "내 직감이 네가 뻥카라고 소리치더군. 역시 내가 맞았어.",
      "따는 데는 무시무시한 핸드는 필요 없어. 그냥 널 읽기만 하면 돼."
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "Darn, you caught me with my hand in the cookie jar. Well played.",
      "Caught red-handed. I guess my story wasn't convincing enough.",
      "You actually called that? You're braver than you look, partner.",
      "You caught the bluff. Don't go tellin' everyone about it.",
      "Bad move on my part. Next time, I'll bring a bigger gun to the fight."
    ],
    ko: [
      "빌어먹을, 현행범으로 딱 걸렸네. 이번엔 네가 잘했다.",
      "현장에서 검거됐구만. 내 블러핑이 좀 어설펐나 봐. 하하.",
      "진짜 그걸 받아? 보기보다 훨씬 용감하구만, 파트너.",
      "블러프 한번 걸린 거 가지고 동네방네 소문내고 다니지 마라.",
      "내 작전 미스야. 다음번엔 훨씬 더 큰 놈으로 상대해주지."
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "Punishing your sizing. Reraise.",
      "I'm the one who dictates the price. Reraise.",
      "Aggression is the only language you understand. Reraise.",
      "Re-taking the initiative. Reraise.",
      "Raise again. Let's see you call."
    ],
    ko: [
      "사이징을 좀 고쳐줘야겠어. 리레이즈.",
      "가격은 내가 정한다. 리레이즈.",
      "공격에는 공격으로 답해주지. 리레이즈.",
      "주도권을 다시 가져오겠어. 리레이즈.",
      "다시 레이즈. 어디 한번 콜 해보시지."
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking back. No need to bloat the pot here.",
      "Optimal check from position. Balance.",
      "I'll take the free card and the equity. Check.",
      "Keeping you in the dark. Check back.",
      "Standard professional check."
    ],
    ko: [
      "체크백. 여기서 팟을 키울 필요는 없지. 상황 보지.",
      "포지션에서의 최적의 체크야. 상황 판단 끝.",
      "공짜 카드와 에퀴티를 챙기겠어. 체크.",
      "네 의중을 좀 더 파악해보고 싶군. 체크백.",
      "표준적인 체크다. 실망하지 마라."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "The situation doesn't favor me. Fold.",
      "Laying it down. Respect the power. Fold.",
      "Strong hand, but I'll find a more profitable spot. Fold.",
      "Saving my stack for a better node. Fold.",
      "Discretion is key. Fold."
    ],
    ko: [
      "상황이 나한테 유리하지 않군. 폴드.",
      "내려놓지. 그 기세는 인정해주마. 폴드.",
      "강한 패지만, 더 수익성 좋은 자리를 찾겠어. 폴드.",
      "스택 좀 아껴두마. 다음번에 다 가져올 테니까. 폴드.",
      "신중함이 핵심이지. 폴드."
    ]
  }
};
