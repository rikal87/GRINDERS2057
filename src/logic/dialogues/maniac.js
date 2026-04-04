import { CHAT_TRIGGERS } from '../constants.js';

export const MANIAC_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "Let's burn those chips!",
      "I'm going to ruin the pot!",
      "Chaos is my favorite game.",
      "Uwaaaaa! Action time!",
      "Who wants to go crazy with me?"
    ],
    ko: [
      "자, 저 칩들을 다 태워버리자고!",
      "팟을 아예 개판으로 만들어줄게!",
      "혼돈이야말로 내가 제일 좋아하는 게임이지.",
      "우와아아아! 액션 가즈아!",
      "누구 나랑 같이 미쳐볼 사람?"
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "I'm a genius! Waaaaa!",
      "Total chaos wins again!",
      "Did you see that bluff? Or was it?",
      "I own this table!",
      "Stack em high, burn em fast!"
    ],
    ko: [
      "난 역시 천재야! 우오오오아!",
      "혼돈의 승리군!",
      "방금 그 블러핑 봤어? 아니, 블러핑이었나?",
      "이 테이블은 이제 내 거야!",
      "높이 쌓아라, 빨리 불태워버릴 테니!"
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: [
      "Not enough blood!",
      "Mine!",
      "Keep it coming!",
      "Small snack.",
      "Next hand, make it bigger!"
    ],
    ko: [
      "피가 모자라! 더 큰 판을 원한다고!",
      "내 거야! 건드리지 마!",
      "계속 달려보자고!",
      "소소한 간식거리군.",
      "다음 핸드는 판 좀 더 키워봐!"
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "Whatever! I don't care about money!",
      "Nice hit! Let's do it again!",
      "You got lucky, and I love it!",
      "I'm tilting? I was born tilted!",
      "Again! Again! Again!"
    ],
    ko: [
      "상관없어! 돈 따위 아깝지도 않다고!",
      "나이스 샷! 한판 더 붙어보자고!",
      "네가 운이 좋았네, 그래서 더 재밌어!",
      "내가 틸트 왔다고? 난 태어날 때부터 틸트 상태였어!",
      "한판 더! 한판 더! 한판 더 하라고!"
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: [
      "Meh.",
      "Small pot.",
      "Not enough action.",
      "Take it.",
      "Whatever."
    ],
    ko: [
      "흥.",
      "작은 팟이군. 지루해.",
      "액션이 너무 모자라잖아!",
      "가져가라. 푼돈 따위.",
      "어쩌라구."
    ]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: [
      "Chop? Boring!",
      "I hate splitting!",
      "Split.",
      "Tie.",
      "Next action now!"
    ],
    ko: [
      "찹? 지루해 뒤지겠네!",
      "나눠 갖는 건 정말 싫어!",
      "나눠.",
      "비겼군.",
      "어서 다음 액션 가자고!"
    ]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "All in! Die with me!",
      "Maximum chaos! All in!",
      "Let's end this session right now!",
      "Everything on the line! Uwaaaa!",
      "Can you handle the madness?"
    ],
    ko: [
      "올인이다! 나랑 같이 죽어보자고!",
      "혼돈의 끝을 보자! 올인이다!",
      "여기서 세션을 끝내버리자고!",
      "모든 걸 다 건다! 우와아아아아!",
      "이 광기를 감당할 수 있겠어? 응?!"
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "Not my vibe.",
      "Boring cards.",
      "Trash them.",
      "Next one please.",
      "Fold."
    ],
    ko: [
      "내 분위기가 아냐.",
      "지루한 카드들이군.",
      "쓰레기통에나 던져버려.",
      "다음 카드나 빨리 보여줘.",
      "폴드. 시시하구먼."
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: [
      "Shoving chips!",
      "Action starts now!",
      "Bet! Bet! Bet!",
      "Pressure is rising!",
      "Eat this bet!"
    ],
    ko: [
      "칩 들어간다! 다 죽었어!",
      "액션 시작이다!",
      "배팅! 배팅! 배팅 하라고!",
      "압박감이 올라오지? 기분 최고야!",
      "내 배팅이나 처먹으라고!"
    ]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "Raising the heat!",
      "Go big or go home!",
      "Raise! I don't care about your cards!",
      "Let's play for everything!",
      "RAISE!"
    ],
    ko: [
      "지옥의 열기를 보여주지!",
      "죽든 살든 한판 가보자고!",
      "레이즈! 네 카드가 뭔지 상관도 안 해!",
      "모든 걸 걸고 한판 붙어보자고!",
      "레이즈! 하하하, 재미있군!"
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "I have to see! Call!",
      "Looking! Call!",
      "Aha! Call!",
      "Let's see the river!",
      "Gambling time!"
    ],
    ko: [
      "이건 꼭 봐야겠어! 콜!",
      "지켜본다! 콜!",
      "아하! 콜이야!",
      "리버 좀 보자고! 어서!",
      "도박 시간이다! 콜!"
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: [
      "Check? Fine.",
      "Wait, wait, wait.",
      "Your turn.",
      "Pressure mounting.",
      "Check."
    ],
    ko: [
      "체크? 좋아.",
      "기다려, 기다려, 기다리라고.",
      "네 차례다.",
      "압박감이 밀려오지?",
      "체크."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "I burned out! Waaaaa!",
      "Session ended in a blast!",
      "I'll be back higher! Faster! Louder!",
      "Damn it! One more river!",
      "Gg everybody!"
    ],
    ko: [
      "시원하게 타버렸군! 우오오오아아!",
      "폭발적인 세션 종료군! 대만족이다!",
      "더 높게! 더 빠르게! 더 시끄럽게 돌아오마!",
      "이런 빌어먹을!!! 리버 한 번만 더 보자니까!",
      "다들 지지! 정말 미친 듯이 놀았네!"
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "Get outplayed by madness!",
      "One down! Many more to go!",
      "Pathetic sanity.",
      "Bye, loser!",
      "Madness reigns supreme!"
    ],
    ko: [
      "광기에 잡아먹힌 걸 축하한다!",
      "한 놈 처리! 아직 배고프다고!",
      "제정신으로 여기서 버틸 줄 알았냐?",
      "잘 가라, 루저!",
      "결국 광기가 최고지! 하하하!"
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Thinking? Brains are meant to be fried! Hurry up!",
      "Action is slowing down. My blood is boiling. Move!",
      "Tick-tock. I can burn the whole casino down in 10 minutes.",
      "Decide or I'll push all your chips for you!",
      "Hurry up! I need the next rush!"
    ],
    ko: [
      "고민 중? 뇌가 타버릴 때까지 고민해봐! 어서!",
      "액션이 죽고 있어! 내 피가 끓는다고! 빨리 움직여!",
      "똑딱똑딱. 10분이면 이 카지노 통째로 태워버릴 수 있다고.",
      "결정해! 아니면 내가 네 칩 대신 다 밀어 넣어주까?!",
      "서둘러! 다음 전율이 필요해!"
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "Now that is a huge mountain of chaos! I love it!",
      "This is what I live for! The pressure! The noise!",
      "Pure madness in the middle! It's glowing for me!",
      "Significant resources! Let's see who is the craziest boss.",
      "Huge pot! To the moon! Let's blow it up!"
    ],
    ko: [
      "와! 거대한 혼돈의 산더미군! 정말 사랑스러워!",
      "내가 바로 이걸 위해 산다니까! 압박감! 소음! 다 좋아!",
      "가운데 저 광기 어린 칩 좀 봐! 날 부르고 있잖아!",
      "막대한 재원이야! 여기서 누가 제일 미친 보스인지 가려보자고.",
      "거대 팟이다! 가즈아아! 여기서 한번 터뜨려보자고!"
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "Your story was too sane! I saw the bluff! Hahaha!",
      "I couldn't fold for that price. I'm a Maniac, not a chicken! I win!",
      "My chaotic intuition is over 9000! Caught you!",
      "I love it when people try to trick a crazy guy. It's funny!",
      "Haha! I just felt like calling, and look what happened! Jackpot!"
    ],
    ko: [
      "네 시나리오는 너무 멀쩡해서 탈이야! 뻥카 딱 들켰어! 하하하!",
      "이런 상황에 어떻게 죽어. 난 매니악이야, 겁쟁이가 아니라고! 내가 이겼어!",
      "내 혼돈의 직관력은 측정 불능이야! 딱 걸렸어!",
      "미친놈을 속이려 들다니. 정말 웃기는구먼!",
      "하하! 그냥 콜 하고 싶어서 했는데 결과 좀 봐! 잭팟이다!"
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "Hahaha! You caught the Maniac! Well played, sane person!",
      "A failed attempt at blowing up the pot. Money well spent for the chaos!",
      "You actually called that? You're as crazy as I am!",
      "Ah well, my plot was a bit too wild, I guess. Again!",
      "Caught! At least it was a loud disaster, right?"
    ],
    ko: [
      "하하하! 매니악을 낚았구만! 제정신인 사람치고는 잘했어!",
      "팟 폭발 시도 실패! 혼돈을 위해서라면 이 정도 돈은 아깝지 않아. 하하!",
      "진짜 그걸 콜 했네? 너도 나만큼 미친 거 아냐?!",
      "뭐, 이번엔 내 시나리오가 너무 황당했나 보네. 한판 더!",
      "딱 걸렸네! 뭐, 그래도 아주 시끄러운 재난은 만들었으니 됐나?"
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "You're raising me? Reraise! I'll take your brain house!",
      "I'm not folding! Raise again! More fire!",
      "Madness levels maxing out! Reraise.",
      "Safety is a lie! Reraise.",
      "Dueling in the flames. Reraise."
    ],
    ko: [
      "네가 날 레이즈해? 리레이즈! 네 뇌 속까지 다 털어주마!",
      "난 절대 안 죽어! 다시 레이즈! 불을 더 질러보자고!",
      "광기 수치 맥스 도달! 리레이즈.",
      "안전함이란 건 다 거짓이야! 리레이즈.",
      "불꽃 속에서 결투다! 리레이즈."
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking! Waiting to explode.",
      "I'll take the free card and throw a bomb on river. Check.",
      "Keeping the pressure bottled up. Check back.",
      "Go, go, go! I'm watching. Check.",
      "Chaos in waiting. Check back."
    ],
    ko: [
      "체크! 폭발할 적기만 기다리고 있지.",
      "공짜 카드 좀 보고 리버에 폭탄 던질 거야. 체크.",
      "압박을 일단 억눌러두마. 체크백.",
      "어서, 어서, 어서! 지켜보고 있지. 체크.",
      "혼돈의 대기 상태. 체크백."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "I'm folding. Even I can't find a reason to stay in this mess. Fold.",
      "Laying it down. Respect the bet. Fold.",
      "Strong hand, but I'm looking for a more chaotic duel. Fold.",
      "Ahhh! I hate folding this! But fold.",
      "Saving my madness for the next hand. Fold."
    ],
    ko: [
      "폴드. 나조차도 이 개판에서 빠져나갈 이유를 못 찾겠네. 폴드.",
      "내려놓지. 그 배팅은 인정한다. 폴드.",
      "좋은 패지만, 더 혼란스러운 결투를 기약하마. 폴드.",
      "으아아! 이거 폴드하기 정말 싫은데! 폴드.",
      "다음 핸드에 광기를 쏟아붓겠다. 폴드."
    ]
  }
};
