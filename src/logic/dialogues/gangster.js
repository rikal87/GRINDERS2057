import { CHAT_TRIGGERS } from '../constants.js';

export const GANGSTER_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "This is my turf.",
      "Pay up or bleed.",
      "Fresh meat for the grinder.",
      "Don't blink, choom.",
      "I smell fear."
    ],
    ko: [
      "여긴 내 구역이야. 까불지 마라.",
      "돈을 내놓든가, 피를 보든가. 둘 중 하나만 골라.",
      "분쇄기에 갈릴 신선한 고기가 왔네? 환영한다.",
      "눈 깜빡이지 마. 골로 가기 싫으면.",
      "어디서 겁에 질린 냄새가 나는데... 너냐?"
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "Easy eddies.",
      "Too soft.",
      "You gonna cry?",
      "That's my money.",
      "Business is good."
    ],
    ko: [
      "돈 벌기 참 쉽네. 껌이지.",
      "너무 물렁한 거 아냐? 좀 팍팍 들어와 봐.",
      "어이, 왜 그래? 울기라도 하려고?",
      "이건 원래 내 돈이었어. 돌려받은 것뿐이다.",
      "비즈니스가 아주 잘 풀리는구만. 기분 좋다!"
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: [
      "Lunch money.",
      "Mine.",
      "Pay the tax.",
      "Weak.",
      "Better than nothing."
    ],
    ko: [
      "점심값 정도는 되겠네. 짭짤해.",
      "내 거야. 손대지 마.",
      "자리세 냈다고 생각해라. 알겠냐?",
      "약해 빠졌어. 그딴 패로 덤비냐?",
      "안 받는 것보다야 낫지. 챙겨둬."
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "You're dead meat.",
      "Watch your back.",
      "You got lucky, punk.",
      "I'll remember that.",
      "This ain't over."
    ],
    ko: [
      "너 오늘 제삿날인 줄 알아라. 뒤지기 싫으면.",
      "등 뒤 조심하는 게 좋을 거야. 밤길은 무섭다고.",
      "운 좋은 줄 알아, 애송아. 뒤통수 조심하고.",
      "오늘 일, 내 머릿속에 똑똑히 박아뒀다.",
      "아직 안 끝났어. 이제 시작이다, 이 새끼야."
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: [
      "Watch it.",
      "Keep the change.",
      "Just a tax.",
      "Tch.",
      "You got lucky."
    ],
    ko: [
      "눈 똑바로 뜨고 해라. 뒤지기 싫으면.",
      "잔돈은 너 가져. 팁이다.",
      "세금 한 번 냈다고 치지. 아깝지도 않아.",
      "쳇. 재수가 없으려니.",
      "운 한번 더럽게 좋구만. 다음엔 국물도 없다."
    ]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: [
      "Halves.",
      "We share.",
      "Split it.",
      "Truce for now.",
      "Keep your half."
    ],
    ko: [
      "반반씩 나눠. 군말 말고.",
      "나눠 갖지. 이번만이다.",
      "스플릿. 귀찮게 됐네.",
      "일단 휴전이다. 다음에 죽여주마.",
      "네 몫은 챙겨가. 구질구질하게 굴지 말고."
    ]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "All in. You scared?",
      "Do you bleed?",
      "Put up or shut up.",
      "Let's see your guts.",
      "Die or rich."
    ],
    ko: [
      "올인이다. 쫄았냐? 쫄았으면 뒈져야지.",
      "피를 흘려볼 생각 있나? 내가 흘려주까?",
      "돈을 걸든지 길 비키든지. 선택해라.",
      "네 배짱 좀 보자고. 얼마나 두둑한지.",
      "죽거나, 부자가 되거나. 이게 뒷골목 방식이지."
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "Not worth my time.",
      "Trash.",
      "Get this garbage out.",
      "Next.",
      "Fold."
    ],
    ko: [
      "내 시간 낭비할 가치도 없어. 꺼져.",
      "쓰레기 같은 패네. 퉤-",
      "이 오물을 치워버려. 역겨우니까.",
      "다음. 시간 끌지 마라.",
      "폴드. 이번엔 넘어가마."
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: [
      "Price of living.",
      "Pay up.",
      "I'm raising the heat.",
      "Don't waste my time.",
      "Chips in."
    ],
    ko: [
      "목숨값 좀 내보시지.",
      "어서 내놔. 칩 던진다.",
      "판 좀 키워볼까? 뜨겁게 말야.",
      "내 시간 낭비하지 마. 배팅한다.",
      "칩 들어간다. 각오해라."
    ]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "I'm doubling the pain.",
      "Get crushed.",
      "I smell fear. Raise.",
      "Pay more or get out.",
      "RAISE!"
    ],
    ko: [
      "고통을 두 배로 늘려주마.",
      "짓밟아주겠어. 납작하게 말야.",
      "어디서 비린내가 나는데... 겁먹었냐? 레이즈.",
      "돈 더 내든가, 당장 꺼지든가.",
      "레이즈! 죽이고 싶네 진짜."
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "I'll see you.",
      "You think I'm scared?",
      "Call.",
      "Show me the garbage.",
      "Checking your pulse."
    ],
    ko: [
      "한번 보자고. 뭐가 들었나.",
      "내가 쫄 것 같냐? 이 바닥 생활이 몇 년인데.",
      "콜. 받아주지.",
      "그 쓰레기 같은 패 좀 까봐. 어디.",
      "네 맥박 좀 짚어볼까? 떨리는 것 같은데."
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: [
      "Move.",
      "Hurry it up.",
      "Check."
    ],
    ko: [
      "움직여. 가만있지 말고.",
      "서둘러. 인내심 바닥나기 전에.",
      "체크. 상황 보지."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "You're dead meat.",
      "This isn't the end.",
      "I'll find you.",
      "Damn it!",
      "You got lucky, punk."
    ],
    ko: [
      "너 나중에 내 눈에 띄지 마라. 진짜 죽는다.",
      "이게 끝이라고 생각하지 마. 평생 쫓아갈 테니까.",
      "반드시 찾아낸다. 지구 끝까지라도.",
      "이런 빌어먹을!!! 테이블 엎어버릴라니까!",
      "운 한번 더럽게 좋네. 애송이 주제에."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "Get trashed.",
      "Out of my sight.",
      "Weakling.",
      "Another victim.",
      "Pathetic."
    ],
    ko: [
      "쓰레기통으로 꺼져버려.",
      "내 눈앞에서 사라져. 꼴 보기 싫으니까.",
      "약해 빠진 새끼. 여기가 장난인 줄 알았냐?",
      "또 한 놈 골로 보냈군. 재미있어.",
      "보잘것없구만. 챙피한 줄 알아라."
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Is the thinking keeping you from paying your debts? Hurry up.",
      "Don't make me lose my patience. I'm itching to bash some heads.",
      "Tick-tock. Some of us have faces to crush, decide already.",
      "Are you frozen? Push the button or I'll push you.",
      "Hurry up. I am getting unsatisfied with this pace."
    ],
    ko: [
      "고민하느라 빚 갚는 걸 잊었냐? 아가리 닥치고 서둘러.",
      "내 인내심 시험하지 마라. 지금 손이 근질근질하니까.",
      "똑딱똑딱. 누구는 대가리 깨러 가야 하는데 여기서 시간 버리게 할래?",
      "얼어붙었냐? 어서 버튼 눌러라. 아니면 네 머리를 눌러주랴?",
      "서둘러. 이 속도감이 정말 짜증 나니까."
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "Now that's a lot of money in the middle. I love it!",
      "Look at that mountain of chips... mine, all mine.",
      "Significant resources! Let's see who's the true boss here.",
      "Huge pot! To the moon! Let's make it even bigger!",
      "Maximum pressure. I'm going to take it all."
    ],
    ko: [
      "오호, 가운데에 돈이 꽤 쌓였네? 아주 좋아.",
      "저 칩 산더미 좀 봐라... 다 내 거다. 건드리면 손목 날아간다.",
      "막대한 재원이야. 여기서 진짜 보스가 누군지 가려보자고.",
      "거대 팟이다! 가즈아아! 더 키워보라고, 이 새끼들아!",
      "최대의 압박이다. 내가 전부 싹 쓸어 가주지."
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "I knew you were lying. I can smell the fake from miles away.",
      "You tried to bluff me? In my own block? Pathetic.",
      "I followed the scent of your fear. Caught you.",
      "Outcome: Success. Result: You're broke.",
      "You thought I was weak? Wrong move, punk."
    ],
    ko: [
      "네가 구라 치는 거 다 알고 있었어. 냄새가 풀풀 났거든.",
      "나한테 블러핑을? 내 구역에서? 가소로운 새끼.",
      "네놈의 공포 냄새를 따라왔지. 딱 걸렸다.",
      "결과: 성공. 리스크: 너 파산.",
      "내가 만만해 보였냐? 실수한 거다, 애송아."
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "Ah, you caught me. Well played, punk. Don't let it go to your head.",
      "Caught red-handed. My power wasn't enough to scare you off?",
      "You called? I'll remember that. Watch your back tonight.",
      "A tactical error. I'll get it back double.",
      "Caught! You have good eyes for someone who's about to lose."
    ],
    ko: [
      "허, 날 잡았네? 잘했어, 애송아. 근데 너무 우쭐대진 마라.",
      "현장에서 검거됐구만. 내 위압감이 널 쫓아내는 데 부족했냐?",
      "그걸 받아? 기억해두지. 오늘 밤 길 가다 나 마주치지 마라.",
      "전술적 실수다. 다음번에 두 배로 뜯어내주마.",
      "딱 걸렸네! 곧 털릴 놈치고는 눈썰미가 제법이야."
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "You're challenging me? Reraise. I'll break you.",
      "You think you can bully me? Reraise.",
      "Increasing the stakes. Can you handle it?",
      "A bold move, but I'm meaner. Raise again.",
      "Let's see if you have the stomach for this. Reraise."
    ],
    ko: [
      "나한테 도전하는 거냐? 리레이즈. 널 부숴버리겠어.",
      "네가 날 괴롭힐 수 있을 것 같아? 리레이즈.",
      "판돈 키운다. 감당할 수 있겠냐?",
      "대담한 수군, 하지만 나는 더 악랄하지. 다시 레이즈.",
      "이 배짱을 감당할 수 있는지 보지. 리레이즈."
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking. I'll let you lead for now.",
      "Observation. Check back.",
      "Keeping the pot controlled. The street way. Check.",
      "Your move. Make it a good one, or else. Check.",
      "Balanced range. Check."
    ],
    ko: [
      "체크. 일단 네가 먼저 떠들어봐.",
      "관찰 중이다. 체크백.",
      "팟 조절 좀 하지. 거리의 방식대로. 체크.",
      "네 차례다. 제대로 해라, 안 그러면 골로 간다. 체크.",
      "범위 조절. 체크."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "A smart dog knows when to back off. Fold.",
      "I'm letting you have this. Don't waste it. Fold.",
      "Strong hand, but I'm not in the mood. Fold.",
      "I'll catch you later for this. Fold.",
      "Respecting your play... for now. Fold."
    ],
    ko: [
      "똑똑한 개는 물러날 때를 아는 법이지. 폴드.",
      "이번엔 양보하마. 헛되이 쓰지 마라. 폴드.",
      "좋은 패지만, 지금은 그럴 기분이 아냐. 폴드.",
      "나중에 꼭 갚아주마. 폴드.",
      "네 플레이를 존중해주지... 일단은 말이야. 폴드."
    ]
  }
};
