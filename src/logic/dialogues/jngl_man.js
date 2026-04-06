import { CHAT_TRIGGERS } from '../constants.js';

export const JNGL_MAN_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "I am the JNGL_MAN.",
      "Do you really think you can beat me?",
      "I'm the best heads-up player in the world.",
      "Where is the money?",
      "Let's play some real poker."
    ],
    ko: [
      "내가 바로 정글맨이다.",
      "진짜 네가 날 이길 수 있을 것 같아?",
      "난 세계 최고의 헤즈업 플레이어야.",
      "돈은 다 어디 갔어? 내놔.",
      "진짜 포커 한번 쳐보자고."
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "So easy.",
      "Total domination.",
      "Wooooo!",
      "The math doesn't lie."
    ],
    ko: [
      "너무 쉽군.",
      "완벽한 지배다.",
      "우오오오오!",
      "수학은 거짓말을 안 하지."
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: [
      "Every chip counts.",
      "Nice.",
      "I'll take it.",
      "Standard.",
      "Good."
    ],
    ko: [
      "칩 하나하나가 소중하지.",
      "나이스.",
      "가져가마.",
      "표준적이야.",
      "좋아."
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "That is impossible!",
      "You are so lucky!",
      "How can you call with that?!",
      "I am tilting so hard!",
      "This variance is sick.",
      "...You have a four?"
    ],
    ko: [
      "말도 안 돼! 그게 가능해?!",
      "넌 운이 너무 좋아!",
      "그 핸드로 어떻게 콜 할 수가 있어?!",
      "아, 진짜 틸트 온다! 미치겠네!",
      "변동성 정말 지독하구만.",
      "...너 4 들고 있었어?"
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: [
      "Whatever.",
      "Small hit.",
      "I don't care.",
      "Next.",
      "Whatever."
    ],
    ko: [
      "상관없어.",
      "살짝 긁혔군.",
      "신경 안 써.",
      "다음.",
      "어쩌라고."
    ]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: [
      "Chop.",
      "Split.",
      "Tie.",
      "Boring.",
      "Next."
    ],
    ko: [
      "찹.",
      "나눠.",
      "비겼군.",
      "지루해.",
      "다음."
    ]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "I'm all in.",
      "Let's gamble.",
      "Do you have the courage?",
      "I challenge you.",
      "Time to die."
    ],
    ko: [
      "올인이다.",
      "한번 도박해보지.",
      "배짱은 좀 두둑해?",
      "네게 도전하마.",
      "죽을 시간이다."
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "I fold.",
      "Boring.",
      "Next hand.",
      "Not worth it.",
      "Trash."
    ],
    ko: [
      "폴드.",
      "지루하구만.",
      "다음 핸드나 가자.",
      "가치가 없어.",
      "쓰레기 패군."
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: [
      "I bet.",
      "Pay attention.",
      "Action.",
      "I'm betting.",
      "Price of poker."
    ],
    ko: [
      "배팅하겠어.",
      "집중해.",
      "액션 가자.",
      "내가 배팅한다.",
      "포커 치려면 이 정돈 내야지."
    ]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "I raise.",
      "Too cheap.",
      "Lets play for real money.",
      "I am raising.",
      "Punishment."
    ],
    ko: [
      "레이즈.",
      "너무 싸구려 아냐?",
      "진짜 돈 냄새 좀 맡아보자고.",
      "레이즈다.",
      "응징해주마."
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "I call.",
      "Show me.",
      "I have to see it.",
      "You are bluffing.",
      "Snap call."
    ],
    ko: [
      "콜.",
      "보여줘 봐.",
      "이건 꼭 봐야겠어.",
      "너 뻥카 치는 거지.",
      "스냅 콜."
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: [
      "Check.",
      "Your move.",
      "Waiting.",
      "Pass.",
      "Checking."
    ],
    ko: [
      "체크.",
      "네 차례다.",
      "기다리지.",
      "패스.",
      "체크한다."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "I will be back.",
      "You got lucky.",
      "Unbelievable.",
      "I'll crush you next time.",
      "Gg."
    ],
    ko: [
      "반드시 다시 온다.",
      "넌 운이 좋았어.",
      "믿을 수가 없군.",
      "다음번엔 널 부숴주지.",
      "지지."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "Get out of here.",
      "I told you I am the best.",
      "Too easy.",
      "Who's next?",
      "Sit down."
    ],
    ko: [
      "여기서 나가.",
      "내가 최고라고 말했잖아.",
      "너무 쉽구만.",
      "다음은 누구지?",
      "가서 앉아있어."
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "I am the JNGL_MAN, and I'm losing my patience! Hurry up!",
      "Decision time, buddy! Don't let the action cool down.",
      "Tick-tock! I have worlds to conquer, and you're making me wait!",
      "Hurry up! My brain is processing outcomes faster than you can blink!",
      "Are you frozen? Push the button already!"
    ],
    ko: [
      "나 정글맨이야! 인내심 잃어버리고 있다고! 빨리 안 해?!",
      "결정해, 친구! 분위기 식게 만들지 마라.",
      "똑딱똑딱! 나 정복해야 할 세상이 산더미 같은데 널 기다리게 해?!",
      "서둘러! 내 뇌는 네가 눈 깜빡이는 것보다 빠르게 결과를 분석 중이라고!",
      "얼어붙은 거야? 어서 버튼이나 눌러!"
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "Now that's a real mountain of chips! I love it!",
      "This is what I live for! Maximum stakes, maximum fun!",
      "Look at that beauty in the middle! It's practically glowing!",
      "Significant resources! Let's see who's the true boss at this table.",
      "Huge pot! To the moon! Let's make it even bigger!"
    ],
    ko: [
      "와! 저 칩 산더미 좀 봐! 정말 사랑스럽네!",
      "내가 바로 이걸 원한 거지! 최대 판돈, 최고의 즐거움!",
      "가운데 저 아름다운 걸 좀 봐! 빛이 나는 것 같은데!",
      "막대한 재원이야! 여기서 진정한 보스가 누구인지 확인해보자고.",
      "거대 팟이다! 가즈아아! 더 키워보자고!"
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "I knew your story was fake! My gut never fails me. Hahaha!",
      "I couldn't fold for that price. I'm the best, not a fish! I win!",
      "My intuition is over 9000! Caught you red-handed!",
      "I love it when people try to trick me. It makes winning sweeter!",
      "Haha! I just felt like calling, and look what happened! Jackpot!"
    ],
    ko: [
      "네 시나리오가 가짜라는 거 다 알고 있었어! 내 촉은 틀리는 법이 없거든. 하하하!",
      "이런 상황에 어떻게 죽어. 난 정글맨이야, 피래미가 아니라고! 내가 이겼다!",
      "내 직관력은 측정 불능이야! 뻥카 딱 걸렸어!",
      "사람들이 날 속이려는 게 정말 좋아. 그래야 이길 때 더 달달하거든!",
      "하하! 그냥 콜 하고 싶어서 했는데 결과 좀 봐! 잭팟이다!"
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "Hahaha! You caught the Jungleman! Good eye, kid!",
      "A failed attempt at stealing the pot. Money well spent for the thrill!",
      "You actually called that? You're braver than I thought!",
      "Ah well, my story was a bit too wild, I guess. Well played!",
      "Caught in the act! Next time I'll make it even more confusing!"
    ],
    ko: [
      "하하하! 정글맨을 낚았구만! 눈썰미 좋은데?",
      "팟 훔치기 실패! 전율을 위해서라면 이 정도 돈은 아깝지 않아!",
      "진짜 그걸 콜 했네? 생각보다 훨씬 용감한걸!",
      "뭐, 이번엔 내 시나리오가 너무 황당했나 보군. 잘했어!",
      "현행범 검거! 다음번엔 훨씬 더 꼬아주지!"
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "You're challenging the king of the jungle? Reraise.",
      "I'm not bowing down! Raise again!",
      "Intensity levels increasing! Reraise.",
      "You think you're safe? Reraise.",
      "Fighting for every chip. Reraise."
    ],
    ko: [
      "정글의 왕에게 도전하는 거냐? 리레이즈.",
      "난 절대 굴복 안 해! 다시 레이즈!",
      "집중도 올라가고 있어! 리레이즈.",
      "네가 안전할 것 같아? 리레이즈.",
      "칩 하나하나를 위해 싸우지. 리레이즈."
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking! Waiting for the right moment to strike.",
      "I'll take the free card. Strategic patience. Check.",
      "Keeping the pressure bottled up. Check back.",
      "Your turn. I'm watching. Check.",
      "Balanced range check."
    ],
    ko: [
      "체크! 공격할 적기를 기다리는 법이지.",
      "공짜 카드 좀 볼까. 전략적 인내지. 체크.",
      "압박을 일단 억눌러두마. 체크백.",
      "네 차례다. 보겠어. 체크.",
      "범위 균형 맞추는 체크다."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "I'm folding. Even I can't find a way out of this. Fold.",
      "Laying it down. Respect the bet. Fold.",
      "Strong hand, but I'm looking for a better duel. Fold.",
      "Ahhh! I hate folding this! But fold.",
      "Saving my energy for the next battle. Fold."
    ],
    ko: [
      "폴드. 나조차도 여기서 빠져나갈 방법이 안 보이네. 폴드.",
      "내려놓지. 그 배팅은 인정한다. 폴드.",
      "좋은 패지만, 더 나은 결투를 기약하마. 폴드.",
      "으아아! 이거 폴드하기 정말 싫은데! 폴드.",
      "다음 전투를 위해 기운 아껴두마. 폴드."
    ]
  }
};
