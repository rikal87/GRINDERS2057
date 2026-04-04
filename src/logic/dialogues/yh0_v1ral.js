import { CHAT_TRIGGERS } from '../constants.js';

export const YH0_V1RAL_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "Bonjour! Ready for some content?",
      "Allez! Let's play some poker.",
      "Welcome to the stream, guys.",
      "I hope you are ready to be exploited.",
      "Let's see if you can keep up with my creativity."
    ],
    ko: [
      "Bonjour! 컨텐츠 뽑을 준비 됐나?",
      "Allez! 포커 한 판 쳐보자고.",
      "방송 보러 온 여러분 환영해.",
      "내 먹잇감이 될 준비는 됐겠지?",
      "내 창의적인 플레이를 따라올 수 있을지 보자고."
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "Magnifique! Join the club!",
      "Welcome to Value Town, population: You.",
      "Merci beaucoup for the donation.",
      "That line was... délicieux.",
      "Clip that! Put it on YouTube!"
    ],
    ko: [
      "Magnifique! 입장을 환영한다!",
      "밸류 타운에 오신 걸 환영해. 거주자: 바로 너.",
      "기부금 고마워, Merci beaucoup.",
      "이 전략은... Délicieux.",
      "방금 거 클립 따! 유튜브 박제 감이야!"
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: [
      "Petit à petit...",
      "Incrementing the stack.",
      "Efficient.",
      "Just a small tax.",
      "C'est bon."
    ],
    ko: [
      "Petit à petit...",
      "스택 쌓는 중이지.",
      "효율적이야.",
      "소소한 세금 낸 셈 쳐.",
      "C'est bon. "
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "Sacrebleu! How did you call that?",
      "Incredible... you are a station?",
      "That is not GTO...",
      "Whatever, nice hand.",
      "I will remember this leak."
    ],
    ko: [
      "Sacrebleu! 그걸 어떻게 콜 하는 거야?",
      "세상에... 완전 콜링 스테이션이네.",
      "이건 GTO가 아닌데... 말이 안 돼.",
      "뭐 어쩌겠어, 좋은 핸드였어.",
      "네 핸드에 구멍은 똑똑히 기억해두지."
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: [
      "Small leak.",
      "Not a big deal.",
      "Just a bit.",
      "C'est rién.",
      "Moving on."
    ],
    ko: [
      "작은 실수였어.",
      "별거 아냐.",
      "살짝 긁혔네.",
      "C'est rien. 아무것도 아니지.",
      "다음 판 가자."
    ]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: [
      "Split pot.",
      "Chop it.",
      "Tie.",
      "Share.",
      "Next hand."
    ],
    ko: [
      "스플릿 팟.",
      "찹.",
      "무승부.",
      "나눠 갖자.",
      "다음 핸드."
    ]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "Tapis! All in.",
      "Do you have the courage?",
      "I put you to the test.",
      "Let's dance. All chips.",
      "Maximum pressure!"
    ],
    ko: [
      "Tapis! 올인이다.",
      "배짱은 좀 두둑한가?",
      "네 실력을 테스트해주지.",
      "한번 춤춰볼까? 모든 칩을 걸고.",
      "최대의 압박이다!"
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "Pas aujourd'hui.",
      "Discipline is key.",
      "Au revoir, cards.",
      "Boring spot.",
      "Fold."
    ],
    ko: [
      "Pas aujourd'hui. 오늘은 아냐.",
      "절제가 핵심이지.",
      "Au revoir, 카드여.",
      "지루하네.",
      "폴드."
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: [
      "A little probe bet.",
      "Sizing tell? Maybe.",
      "I extract value.",
      "This is for information.",
      "Bet."
    ],
    ko: [
      "살짝 찔러보는 배팅.",
      "사이즈 텔? 그럴지도 모르지.",
      "가치를 뽑아내겠어.",
      "정보 파악용 배팅이야.",
      "배팅."
    ]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "Let's inflate the pot!",
      "Aggression is power.",
      "I sense weakness.",
      "Raise. Try to read me.",
      "Exploitative raise."
    ],
    ko: [
      "팟 좀 키워볼까!",
      "공격성이 곧 권력이지.",
      "약점 냄새가 나는데.",
      "레이즈. 어디 한번 날 읽어보시지.",
      "착취적인 레이즈다."
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "I'm curious. Call.",
      "Do you have it? Show me.",
      "Pay to see.",
      "Hero call time?",
      "D'accord, I call."
    ],
    ko: [
      "궁금하네. 콜.",
      "가지고 있어? 보여줘 봐.",
      "구경값 내지.",
      "히어로 콜 타임인가?",
      "D'accord, 콜 하겠어."
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: [
      "Check.",
      "I wait.",
      "Patience.",
      "After you.",
      "Checking back."
    ],
    ko: [
      "체크.",
      "기다리지.",
      "인내심.",
      "너 먼저 해.",
      "체크할게."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "Non! Impossible!",
      "The variance... it kills me.",
      "C'est la vie.",
      "Gg, I played perfect though.",
      "Au revoir for now."
    ],
    ko: [
      "아니! 말도 안 돼!",
      "변동성 때문에... 아주 죽겠네.",
      "C'est la vie. 이게 인생이지.",
      "지지. 내 플레이는 완벽했는데 말야.",
      "Au revoir."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "Voilà! Sit down.",
      "You played... interestingly.",
      "Another one for the highlight reel.",
      "Get outplayed.",
      "Au revoir!"
    ],
    ko: [
      "Voilà! 가서 좀 앉아있으라고.",
      "플레이가... 아주 흥미롭더군.",
      "하이라이트 영상 감이 하나 더 늘었네.",
      "실력 차이를 느껴라.",
      "Au revoir!"
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Allez! Time is money! Don't make the stream wait.",
      "Petit à petit... but not that slowly! Decide, buddy.",
      "The viewers are getting bored. Make a move!",
      "Is the French internet faster than yours? Hurry up!",
      "Tick-tock. Some of us have content to create."
    ],
    ko: [
      "Allez! 시간은 돈이야! 방송 기다리게 하지 말라고.",
      "Petit à petit... 하지만 이렇게 느린 건 곤란해! 어서 결정해.",
      "시청자들이 지루해하잖아. 액션 좀 보여줘!",
      "프랑스 인터넷이 너네보다 빠르겠어! 서둘러!",
      "똑딱똑딱. 컨텐츠 뽑아야 한다고."
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "Now that is a magnifique pot! Significant stakes in the middle.",
      "The adrenaline is délicieux! Let's see who's got the goods.",
      "Look at that beauty! It's practically glowing with value.",
      "Significant resources koncentrated. Emotional variance: High.",
      "Huge pot! To the moon! Let's make it even bigger for the fans!"
    ],
    ko: [
      "오, 이건 정말 Magnifique한 팟이군! 엄청난 판돈이 모였어.",
      "아드레날린이 정말 Délicieux 하구만! 누가 진짜 승자인지 보자고.",
      "저 아름다운 것 좀 봐! 밸류가 뚝뚝 떨어지는군.",
      "자본이 엄청나게 모였네. 감정적 소모가 크겠어.",
      "거대 팟이다! 가즈아아! 팬들을 위해 판을 더 키워보자고!"
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "Merci beaucoup for the donation! I knew you were bluffing. Clips ready!",
      "An amazing hero call! I see right through you. My pot!",
      "You tried to bluff a pro? That's magnifique... for me!",
      "My intuition is over 9000 today! Caught you red-handed!",
      "Haha! I just felt like calling, and look what happened! Jackpot for the stream!"
    ],
    ko: [
      "기부 감사합니다, Merci beaucoup! 너 뻥카인 거 다 알고 있었어. 클립 따!",
      "웅장한 히어로 콜이다! 널 훤히 꿰뚫어 보고 있었지. 내 팟이야!",
      "프로한테 블러핑을? 정말 Magnifique 하네... 나한테 말이야!",
      "오늘 내 직관 수치가 최고조군! 현행범 검거 완료!",
      "하하! 그냥 콜 하고 싶어서 했는데 결과 좀 봐! 방송 잭팟이다!"
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "Ah, you caught the pro! Sacrebleu! Well played. Don't tell my fans.",
      "Caught in the act! A failed exploitation attempt. Adjusting.",
      "You actually called that? Wow, you're braver than I thought!",
      "Ah well, my story was a bit too creative, I guess. Next hand.",
      "Caught! At least it makes for great content, right?"
    ],
    ko: [
      "아, 프로가 딱 걸렸네! Sacrebleu! 잘했어. 팬들한텐 비밀이다.",
      "현장에서 검거! 착취 시도 실패군. 보정해주지.",
      "진짜 그걸 받았어? 와, 생각보다 훨씬 용감하네!",
      "뭐, 내 시나리오가 너무 창의적이었나 보네. 다음 핸드.",
      "걸렸네! 뭐, 그래도 컨텐츠는 뽑았으니 됐나?"
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "Let's inflate the pot with a reraise! Allez!",
      "Raising the stakes for the content. Reraise.",
      "Reraise. I sensing a huge pot incoming.",
      "You're playing against a pro. Reraise.",
      "Escalating the value of this hand. Reraise."
    ],
    ko: [
      "리레이즈로 팟 좀 키워볼까! Allez!",
      "컨텐츠를 위해 판돈 좀 올리지. 리레이즈.",
      "리레이즈. 거대 팟의 기운이 느껴지는데.",
      "프로랑 한판 붙어보자고. 리레이즈.",
      "이 핸드의 가치를 높이겠어. 리레이즈."
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking back. Magnifique information.",
      "Standard IP check for range balance. Check.",
      "Keeping the signal quiet. Check back.",
      "Let's see the next card. Check.",
      "Optimal line: Check."
    ],
    ko: [
      "체크백. Magnifique 한 정보군.",
      "범위 균형을 위해 정석대로 체크. 체크.",
      "신호를 조용히 유지하지. 체크백.",
      "다음 카드가 뭘 줄지 보자고. 체크.",
      "최적의 라인: 체크."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "I'm making a disciplined fold here. Pas aujourd'hui.",
      "Laying it down. Even a pro must fold sometimes.",
      "Strong hand, but your action is undeniable. Fold.",
      "Saving the stack for a better spot. Fold.",
      "Respecting your betting distribution. Fold."
    ],
    ko: [
      "여기서 절제된 폴드를 하지. Pas aujourd'hui.",
      "내려놓는다. 프로도 가끔은 죽어야 하니까.",
      "강한 패지만, 네 액션은 속일 수 없군. 폴드.",
      "더 좋은 자리를 위해 스택을 보존하겠어. 폴드.",
      "네 배팅 분포를 존중해주지. 폴드."
    ]
  }
};
