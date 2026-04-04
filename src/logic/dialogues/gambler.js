import { CHAT_TRIGGERS } from '../constants.js';

export const GAMBLER_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "I'm feeling it tonight!",
      "Just one more session to break even.",
      "The rush... I need it.",
      "Cards, deal 'em fast!",
      "Double or nothing, let's go!"
    ],
    ko: [
      "오늘 느낌이 정말 왔어! 대박 조짐이야!",
      "한 세션만 더 하면 본전 뽑을 수 있어. 가자!",
      "이 전율... 바로 이거지. 어서 시작해!",
      "카드 좀 빨리빨리 돌려봐! 현기증 나니까.",
      "모 아니면 도다! 한판 붙어보자고!"
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "I KNEW it! My luck is back!",
      "Jackpot! Hahaha!",
      "This is it! I'm on a heater!",
      "See? It always comes back around.",
      "I'm a god! Give me those chips!"
    ],
    ko: [
      "그럴 줄 알았어! 내 운이 돌아왔다고!",
      "잭팟이다! 하하하하!",
      "드디어 터졌네! 흐름 제대로 탔어!",
      "봤지? 결국엔 돌아오게 돼 있다니까.",
      "난 도박의 신이야! 칩 다 내놔!"
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: [
      "Building the bankroll for a bigger bet.",
      "Nice.",
      "Just the start.",
      "Keep it coming.",
      "Small win, but it counts."
    ],
    ko: [
      "더 큰 배팅을 위한 자금일 뿐이지.",
      "나이스. 분위기 좋고!",
      "이제 겨우 시작이야. 지켜보라고.",
      "계속 가져와 보라고. 싹 쓸어갈 테니.",
      "작게라도 이긴 게 어디야. 곧 터진다!"
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "Impossible! The cards are cursed!",
      "One more! I need a rebuy!",
      "That is pure garbage. Rigged!",
      "I was so close! Just one card!",
      "My luck... where did it go?!"
    ],
    ko: [
      "말도 안 돼! 이 카드들 저주받은 거 아냐?!",
      "한판 더! 리바이 해야 돼, 제발!",
      "쓰레기 같은 덱이네. 확실히 조작됐어!",
      "거의 다 왔는데! 진짜 카드 한 장 차이였다고!",
      "내 운... 다 어디로 간 거야?! 안 돼!"
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: [
      "Just variance. I'll get it back.",
      "Whatever.",
      "Next hand will be mine.",
      "Lucky catch, kid.",
      "Hmm."
    ],
    ko: [
      "그냥 변동성일 뿐이야. 금방 다시 따오마.",
      "흥. 상관없어.",
      "다음 핸드는 반드시 내 거야. 두고 봐.",
      "운 좋게 잡았네. 운도 실력이겠지?",
      "흠. 이번엔 네가 이겼다."
    ]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: [
      "I hate splitting the rush.",
      "Chop.",
      "Tie.",
      "Split.",
      "Next action, hurry!"
    ],
    ko: [
      "나눠 갖는 건 정말 싫어! 전율이 끊기잖아!",
      "찹. 비겼구만.",
      "무승부라니, 싱겁긴.",
      "반으로 나눠. 빨리빨리 하자고.",
      "다음 액션 가자! 서둘러!"
    ]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "All in! Destination: The moon or the gutter!",
      "I'm gambling it all! Do it!",
      "Put your life on it! All in!",
      "No guts, no glory! Let's ride!",
      "I'm feeling lucky! Shoving!"
    ],
    ko: [
      "올인이다! 달나라 아니면 시궁창이지, 가즈아!",
      "전부 다 걸겠어! 어디 한번 받아보시지!",
      "네 목숨을 걸어봐! 올인이다!",
      "배짱 없으면 죽어야지! 한번 달려보자고!",
      "느낌이 좋아! 무조건 박는다!"
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "Not worth the gamble.",
      "Trash.",
      "Not my vibe.",
      "Fold.",
      "Next."
    ],
    ko: [
      "도박할 가치도 없네. 패스.",
      "쓰레기 같은 패군. 퉤-",
      "내 분위기가 아냐. 던져버려.",
      "폴드. 이번엔 참는다.",
      "다음 카드나 빨리 가져오라고."
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: [
      "Action!",
      "Betting big!",
      "Feeling lucky. Bet.",
      "Extra pressure.",
      "Chips in!"
    ],
    ko: [
      "액션 가자! 칩 던진다!",
      "거하게 한번 배팅해볼까?",
      "운이 좀 따르는 것 같네. 배팅!",
      "추가 압박이다! 쫄았냐?",
      "칩 들어간다! 각오해라."
    ]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "Pump it up! I want more!",
      "Raise it! Let's make it a massive pot!",
      "Can you handle this much risk?",
      "Raise! Gambling is a lifestyle!",
      "Raising the heat!"
    ],
    ko: [
      "판 좀 키워볼까? 화끈하게!",
      "더 높이! 거대 팟 한번 만들어보자고!",
      "이 정도 리스크는 감당할 수 있겠냐?",
      "레이즈! 도박은 인생 그 자체라고!",
      "지옥의 불맛을 좀 보여주지! 레이즈!"
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "I have to see it! Call!",
      "Snap call! Let's gamble!",
      "What do you have? I call!",
      "I'm curious. Call.",
      "Let's see the river!"
    ],
    ko: [
      "이건 꼭 봐야겠어! 콜 하겠어!",
      "스냅 콜! 도박 타임이다!",
      "뭐 들고 있어? 내가 확인해주지! 콜!",
      "궁금하네. 어디 한번 보여줘 봐.",
      "리버에서 어떤 풍경이 펼쳐질지 보자고! 어서!"
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: [
      "Check. Fast.",
      "Waiting for the magic card.",
      "Your turn.",
      "Pass.",
      "Checking."
    ],
    ko: [
      "체크. 빨리빨리 가자고.",
      "마법 같은 카드를 기다리는 중이지. 체크.",
      "네 차례다. 서둘러.",
      "일단 패스. 다음 상황 보자고.",
      "체크한다. 뜸 들이지 마라."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "NOOOO! My bankroll is gone!",
      "Just one more loan... please...",
      "Rigged game! I'll be back!",
      "Damn it! My luck ran out!",
      "Gg everybody..."
    ],
    ko: [
      "안 돼!!! 내 피 같은 돈이 다 날아갔어!",
      "한 번만 더 빌려줘... 제발... 복구할 수 있다고!",
      "주작이야! 반드시 돌아와서 다 따줄 테니 기다려!",
      "이런 빌어먹을!!! 내 운이 벌써 바닥난 거야?!",
      "다들 지지... 정말 허무하게 끝났네."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "Get rekt! Luck is on my side!",
      "One down! More chips for me!",
      "Goodbye, loser!",
      "Predator mode: ON.",
      "Too easy."
    ],
    ko: [
      "골로 갔구만! 역시 운은 내 편이야!",
      "한 놈 처리! 이제 그 칩들은 다 내 거다!",
      "잘 가라, 루저! 지옥에서나 도박해!",
      "포식자 모드 가동! 싹 쓸어버리겠어.",
      "너무 쉽구만. 다음 상대를 내놔라!"
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Hurry up! The rush is fading!",
      "Tick-tok! I don't have all day, let's gamble!",
      "Stop thinking so much, trust your gut and act!",
      "Decide already, your hesitation is killing the mood!",
      "I need the next rush! Hurry up!"
    ],
    ko: [
      "서둘러! 아드레날린 식기 전에!",
      "똑딱똑딱! 나 바쁜 몸이야, 어서 도박하자고!",
      "생각 좀 그만해! 네 촉을 믿고 지르란 말야!",
      "빨리 결정해, 네 망설임 때문에 분위기 다 뒤지잖아!",
      "다음 전율이 필요해! 빨리빨리!"
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "Now that is a real mountain of adrenaline! I love it!",
      "This is what I live for! Pure risk! Pure reward!",
      "Look at that pile... it's practically glowing with hope!",
      "Significant resources in the middle. Let's see who's craziest.",
      "Huge pot! To the moon! Let's make it even bigger!"
    ],
    ko: [
      "와! 저 전율의 산더미 좀 봐! 정말 사랑스러워!",
      "내가 바로 이걸 원한 거지! 리스크 100%, 리턴 100%!",
      "저 칩 산더미 좀 보세요... 희망의 빛이 쏟아지는 것 같네요.",
      "막대한 재원이야! 여기서 진정한 도박꾼이 누군지 가려보자고.",
      "거대 팟이다! 가즈아아! 여기서 한번 터뜨려보자고!"
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "I knew you were lying! My gut never fails me. Hahaha!",
      "I couldn't fold for that price. I'm a Gambler, not a chicken! I win!",
      "My intuition is over 9000 today! Caught you red-handed!",
      "I love it when people try to trick me. It makes winning sweeter!",
      "Haha! I just felt like calling, and look what happened! Jackpot!"
    ],
    ko: [
      "네 시나리오가 가짜라는 거 다 알고 있었어! 내 흐름은 틀리지 않지. 하하하!",
      "이런 상황에 어떻게 죽어. 난 도박꾼이야, 겁쟁이가 아니라고! 내가 이겼어!",
      "내 직관력은 오늘 최고조야! 뻥카 딱 걸렸구만!",
      "사람들이 날 속이려는 게 정말 좋아. 그래야 이길 때 더 달달하거든!",
      "하하! 그냥 콜 하고 싶어서 했는데 결과 좀 봐! 잭팟이다!"
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "Hahaha! You caught me! Well played, partner. Don't tell my bookie.",
      "A failed attempt at stealing the pot. Money well spent for the thrill!",
      "You actually called that? You're as crazy as I am!",
      "Ah well, my plot was a bit too wild, I guess. Again!",
      "Caught! At least it makes for great drama, right?"
    ],
    ko: [
      "하하하! 날 낚았구만! 제법이야, 파트너. 하지만 어디 가서 소문내진 마라.",
      "팟 훔치기 실패! 전율을 위해서라면 이 정도 돈은 아깝지 않아. 하하!",
      "진짜 그걸 받았어? 너도 나만큼 미친 거 아냐?!",
      "뭐, 이번엔 내 시나리오가 너무 황당했나 보네. 한판 더!",
      "딱 걸렸네! 뭐, 그래도 아주 드라마틱한 결말은 만들었으니 됐나?"
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "You're raising me? Reraise! Let's make it a massive heater!",
      "I'm not bowing down! Raise again! More risk!",
      "Adrenaline levels maxing out! Reraise.",
      "Gambling for everything. Reraise.",
      "Dueling in the fire. Reraise."
    ],
    ko: [
      "네가 날 레이즈해? 리레이즈! 판을 지옥불로 만들어주마!",
      "난 절대 굴복 안 해! 다시 레이즈! 리스크를 더 키워보자고!",
      "아드레날린 수치 폭발 직전! 리레이즈.",
      "모든 걸 건 도박이다. 리레이즈.",
      "불꽃 속에서 결투다! 받아라, 리레이즈!"
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking! Waiting for the right card to explode.",
      "I'll take the free card and chase the dream. Check.",
      "Keeping the pressure bottled up. Check back.",
      "Your turn, gambler. I'm watching. Check.",
      "Chaos in waiting. Check back."
    ],
    ko: [
      "체크! 폭발할 마법의 카드를 기다리는 중이지.",
      "공짜 카드 좀 보고 꿈을 쫓아보겠어. 체크.",
      "압박을 일단 억눌러두마. 체크백.",
      "네 차례다, 도박꾼 동지. 지켜보고 있지. 체크.",
      "혼돈의 대기 상태. 체크백."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "I'm folding. Even I can't find a reason to bet on this. Fold.",
      "Laying it down. Respect the power. Fold.",
      "Strong hand, but I'm looking for a better gamble. Fold.",
      "Ahhh! I hate folding this! Fold.",
      "Saving my luck for the next session. Fold."
    ],
    ko: [
      "폴드. 나조차도 이번 판에 돈 걸 이유를 못 찾겠네. 물러나지.",
      "내려놓지. 그 기세는 인정해주마. 폴드.",
      "좋은 패지만, 더 화끈한 도박 판을 찾아보겠어. 폴드.",
      "으아아! 이거 폴드하기 정말 싫은데! 하지만... 폴드.",
      "다음 판을 위해 운을 좀 아껴두마. 폴드."
    ]
  }
};
