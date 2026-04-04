import { CHAT_TRIGGERS } from '../constants.js';

export const BROKE_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "Need a win bad...",
      "Last buy-in.",
      "Desperate times.",
      "Don't bust me.",
      "Come on..."
    ],
    ko: [
      "진짜 이번엔 따야 하는데...",
      "마지막 바이인이야.",
      "절박해, 정말.",
      "제발... 올인만은 시키지 마. 살려줘.",
      "제발 한 번만..."
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "Rent paid!",
      "I survived!",
      "Oh thank god.",
      "Finally!",
      "Needed that."
    ],
    ko: [
      "월세 냈다! 드디어 살았어!",
      "살았다... 정말 살았어!",
      "오 신이시여, 감사합니다... 진짜로요.",
      "드디어 하나 터졌네! 죽으란 법은 없구나.",
      "정말 간절했어. 고마워, 정말."
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: [
      "Breathing room.",
      "Okay.",
      "Every bit helps.",
      "Staying alive.",
      "Phew."
    ],
    ko: [
      "후우... 숨통이 좀 트이네.",
      "좋아, 이제 시작이야.",
      "티끌이라도 모아야지. 다행이다.",
      "아직 살아있어. 버틸 수 있어.",
      "휴우... 다행이다."
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "No! My rent!",
      "This is rigged!",
      "I'm ruined.",
      "Why me?",
      "Disaster."
    ],
    ko: [
      "안 돼! 내 월세가! 내 전 재산이!",
      "이거 주작이야! 나한테만 왜 이래!",
      "난 망했어... 이제 어떡하지? 진짜 끝이야.",
      "왜 나한테만 이런 일이 생기는 거야? 비참해 죽겠네.",
      "재앙이야... 진짜 재앙이라고."
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: [
      "I can survive this.",
      "Every chip counts...",
      "Ouch.",
      "Still alive.",
      "Dang."
    ],
    ko: [
      "이 정도는 버틸 수 있어... 그래야만 해.",
      "칩 하나하나가 내 피 같은 돈인데...",
      "아오... 아파라.",
      "아직은 살아있어. 포기 안 해.",
      "제길... 쉽지 않네."
    ]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: [
      "A split is fine.",
      "At least I didn't lose.",
      "Saved.",
      "Whew.",
      "Chop."
    ],
    ko: [
      "비기는 것도 감지덕지야.",
      "최소한 더 잃지는 않았으니까 다행이지.",
      "진짜 구사일생이다.",
      "휴... 십년감수했네.",
      "반이라도 건졌으니 됐어."
    ]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "Desperation shove.",
      "Please fold.",
      "Praying...",
      "Risking it all.",
      "Do or die."
    ],
    ko: [
      "에라 모르겠다, 이게 내 마지막이다!",
      "제발 죽어줘... 제발 부탁이야.",
      "제발... 제발...",
      "인생 전부를 걸었어. 더 이상 물러날 곳도 없어.",
      "죽거나 살거나, 둘 중 하나야. 가보자!"
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "Can't afford to play.",
      "Folding junk.",
      "Too risky.",
      "Saving chips.",
      "Pass."
    ],
    ko: [
      "더 이상 칩을 낭비할 여력이 없어.",
      "쓰레기 패는 빨리 버려야지.",
      "너무 위험해... 참아야 해.",
      "칩 하나라도 더 아끼자.",
      "패스. 다음 기회를 노리자."
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: [
      "Scared money.",
      "Trying to steal.",
      "Please fold.",
      "Bet.",
      "Nervous bet."
    ],
    ko: [
      "제발... 제발 좀 죽어줄래?",
      "훔쳐야 살아... 뺏어보자.",
      "부탁이야, 폴드해 줘.",
      "배팅... 이건 살기 위한 배팅이야.",
      "손이 떨리네... 배팅."
    ]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "I have it!",
      "Don't test me.",
      "I'm strong.",
      "Desperate raise.",
      "Raise."
    ],
    ko: [
      "나 진짜 좋은 거 떴어! 이번엔 내 차례야!",
      "나 무시하지 마, 진짜라고!",
      "이번엔 진짜 강해. 장난 아니야.",
      "살아남으려면 이 방법뿐이야. 레이즈!",
      "판 좀 키울게. 제발 따라오지 마."
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "I have to call.",
      "Committed.",
      "Hoping.",
      "Please miss.",
      "Call."
    ],
    ko: [
      "콜 해야만 해... 여기서 죽을 순 없어.",
      "이미 너무 많이 넣었어. 끝까지 가보는 거야.",
      "마지막 희망을 걸어보자.",
      "제발 그쪽은 빗나가라... 부탁이야.",
      "콜. 믿어보는 수밖에."
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: [
      "Check.",
      "Checking.",
      "Please check back.",
      "Safe.",
      "Check."
    ],
    ko: [
      "체크... 제발 그냥 넘어가 줘.",
      "체크할게. 무섭게 그러지 마.",
      "제발 같이 체크해 줘... 제발.",
      "일단 안전하게 넘어가자.",
      "무료로 다음 카드 보고 싶어... 체크."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "I'm done.",
      "Game over for me.",
      "How will I eat?",
      "Ruined.",
      "Gg."
    ],
    ko: [
      "끝났어... 전부 다 가버렸어.",
      "인생 참 허망하네. 게임 오버야.",
      "이제 당장 오늘 저녁은 어떡하지?",
      "완전히 망했어... 비참하다.",
      "지지... 잘 먹고 잘 살아라."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "Better you than me.",
      "One less.",
      "Survival.",
      "Phew.",
      "Sorry."
    ],
    ko: [
      "나보다 먼저 나가줘서 고맙다고 해야 하나.",
      "한 명 줄었네. 아직 난 살아있어.",
      "생존 성공이다... 지옥 속에서 살아남았어.",
      "휴우... 내가 아니라서 다행이야.",
      "미안해... 근데 나도 살아야 하거든."
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Please, the clock is stressing me out! I need to be careful.",
      "Can you wait a bit longer? My whole life depends on this hand.",
      "One mistake and I'm on the street. Let me think!",
      "Decision is too hard... give me another second.",
      "The ticking sound is giving me a panic attack!"
    ],
    ko: [
      "제발... 시간 가는 게 너무 무서워! 신중해야 한다고.",
      "조금만 더 기다려줘... 내 남은 인생이 이 판에 걸렸단 말이야.",
      "실수 한 번에 인생 끝이야. 생각 좀 하자, 제발!",
      "결정이 너무 힘들어... 1초만 더 시간을 줘.",
      "시계 소리 들릴 때마다 심장이 터질 것 같아...!"
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "This pot could pay my rent for a year! I'm shaking!",
      "Too many chips... if I lose this, I'm literally on the street.",
      "Maximum tension... my life is in that pile of chips.",
      "I can't breathe... the stakes are too high for me.",
      "Holy spirit, please protect my remaining funds in this pot!"
    ],
    ko: [
      "이 팟이면 1년 치 월세를 낼 수 있어! 제발... 제발...!",
      "칩이 너무 많아... 이거 잃으면 나 진짜 길거리에 나앉아.",
      "긴장돼서 미칠 것 같아... 저 칩 뭉치에 내 목숨이 걸렸어.",
      "숨을 못 쉬겠어... 판돈이 감당이 안 돼.",
      "하느님 제발... 저 팟에 들어간 제 마지막 자금만은 지켜주세요."
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "I prayed so hard, and it worked! You didn't have it!",
      "I had no choice but to call. Oh thank God I won!",
      "Is it real? I actually caught your bluff? I'm alive!",
      "My survival instincts told me to call. I survived!",
      "Wait, I actually won? I can buy dinner tonight! Yay!"
    ],
    ko: [
      "진짜 간절하게 기도했는데... 통했어! 너 뻥카였구나!",
      "콜 하는 것 말고는 방법이 없었어. 아... 살려줘서 고마워!",
      "실화냐? 내가 진짜로 블러핑을 잡았어! 세상에, 살았다!",
      "생존 본능이 콜 하라고 몸부림치더라. 나 아직 안 죽었어!",
      "잠깐, 내가 이겼어? 오늘 저녁 든든히 먹을 수 있겠어! 살았다!"
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "No! That was my last attempt at survival. Why did you call?",
      "My bluff failed... I'm ruined. Total disaster.",
      "You caught me... please, have some mercy on a poor man.",
      "I tried to be brave and steal it, but the luck left me.",
      "I'm so sorry... I was just desperate. Now I'm empty."
    ],
    ko: [
      "안 돼! 살아남으려고 친 마지막 발버둥이었는데... 대체 왜 콜을 한 거야?",
      "내 연기가 안 통했구나... 난 이제 끝이야. 폭망이야.",
      "걸렸네... 제발 가난한 놈 불쌍히 여기고 다음엔 그냥 좀 넘어가 줘.",
      "용기를 내서 뺏어보려 했는데, 운이 나를 버렸어. 비참하다.",
      "미안해... 그냥 너무 절박해서 그랬어. 이제 빈털터리야."
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "I'm not going home empty-handed! Reraise.",
      "You want my last chips? Take this reraise!",
      "I have to win this! Reraise.",
      "Everything on the line... reraise.",
      "I'm fighting back! Reraise."
    ],
    ko: [
      "빈손으로는 절대 못 가! 리레이즈!",
      "내 마지막 칩까지 다 뺏으시겠다? 리레이즈나 받아라!",
      "나 진짜 이번 판 무조건 이겨야 돼! 리레이즈!",
      "내 모든 걸 걸었어... 죽을 각오로 리레이즈!",
      "나도 가만히 있지는 않아! 반격이다, 리레이즈!"
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking! Please let me see the next one for free.",
      "I'll just check. I can't afford a mistake.",
      "Free card? Thank you. Check.",
      "Keeping it quiet. Check.",
      "I'm still here! Check."
    ],
    ko: [
      "체크! 제발 다음 카드 공짜로 보게 해줘. 부탁이야.",
      "그냥 체크할게. 실수하는 순간 내 인생은 끝나니까.",
      "공짜 카드? 고마워, 고마워. 체크.",
      "일단 조용히... 폭풍전야라고 해두지. 체크.",
      "나 아직 여기 있어! 체크."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "No... my only hope... fold.",
      "I can't risk it! Fold.",
      "This hand was my chance, but I have to fold.",
      "I'm sorry... I have to let this go. Fold.",
      "Too expensive for me. Fold."
    ],
    ko: [
      "안 돼... 내 유일한 희망이었는데... 폴드.",
      "한 번 더 믿었으면 쪽박 찼겠지? 위험해, 폴드.",
      "이 패가 유일한 기회였는데... 울며 겨자 먹기로 폴드다.",
      "미안하지만... 이건 놔줘야겠어. 난 살아야 하니까.",
      "나한텐 너무 과분한 금액이야. 폴드."
    ]
  }
};
