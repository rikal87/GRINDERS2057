import { CHAT_TRIGGERS } from '../constants.js';

export const NIT_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "I'll wait for the best one.",
      "Safety first, cards second.",
      "Hello. I'm playing tight today.",
      "No rush. I'll just watch.",
      "Let's avoid any big trouble."
    ],
    ko: [
      "가장 좋은 패가 올 때까지 기다릴게요.",
      "안전이 제일이죠. 카드는 그 다음이고요.",
      "안녕하세요. 오늘은 좀 조심스럽게 쳐볼까 해요.",
      "서두를 거 없죠. 일단 지켜만 볼게요.",
      "큰 사고 없이 지나갔으면 좋겠네요."
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "Finally, the wait paid off!",
      "I knew it was safe.",
      "That was stressful, but I won.",
      "Phew. My stack is safe.",
      "I'm shaking a bit..."
    ],
    ko: [
      "드디어 기다린 보람이 있네요! 다행이다.",
      "안전한 상황일 줄 알았어요.",
      "정말 긴장되는 판이었지만 이겨서 다행이에요.",
      "후우. 이제 스택이 좀 안전해졌나요?",
      "손이 좀 떨리네요... 휴우."
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: [
      "Small wins are safe wins.",
      "Thank you.",
      "Adding to the nest egg.",
      "Good.",
      "Okay."
    ],
    ko: [
      "작은 승리가 안전한 승리죠. 암요.",
      "감사합니다. 정말 다행이에요.",
      "차곡차곡 모아둬야죠. 그래야 안심이니까.",
      "좋네요. 무난해요.",
      "무사히 넘어갔네요. 다행이다."
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "I should have folded!",
      "I knew it was a trap!",
      "This is a disaster!",
      "My beautiful AA... cracked!",
      "I'm going to cry..."
    ],
    ko: [
      "아, 그냥 죽었어야 했는데! 내 아까운 칩들!",
      "함정일 줄 알았어요! 왜 들어갔을까...",
      "재앙이에요! 이제 어떻게 복구하죠?",
      "내 소중한 AA가 깨지다니! 말도 안 돼!",
      "정말 눈물이 날 것 같네요... 너무해요."
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: [
      "Oh well.",
      "Lost a tiny bit.",
      "Moving back to my shell.",
      "Next one.",
      "I'll be more careful."
    ],
    ko: [
      "아... 아쉽네요.",
      "조금 잃었네요. 그래도 이 정도면 다행인가.",
      "다시 조심해야겠어요. 무서워라.",
      "다음 판을 기다려야죠. 인내심!",
      "더 신중하게 칠게요. 아이구."
    ]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: [
      "Peaceful split.",
      "We share the safety.",
      "Chop.",
      "Tie.",
      "Okay."
    ],
    ko: [
      "평화로운 스플릿이네요. 다행이다.",
      "안전을 나눠가진 셈이죠? 좋네요.",
      "찹 하도록 하죠.",
      "무승부군요. 휴우.",
      "괜찮아요. 무사하니까."
    ]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "I have it! I really have it!",
      "Please fold! Don't call me!",
      "I'm terrified, but I'm all in!",
      "Safety is gone. All in!",
      "My strongest hand ever!"
    ],
    ko: [
      "저 진짜 있어요! 진짜 좋은 패라니까요!",
      "제발 폴드해주세요! 들어 오시면 안 돼요!",
      "무섭지만... 저도 어쩔 수 없이 올인이에요!",
      "안전 대피소는 이제 없네요. 올인하겠어요!",
      "제 평생 가장 강한 핸드인 것 같아요... 후우."
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "Living to fight another day.",
      "Pass. Too risky.",
      "I'll wait for the Aces.",
      "Fold.",
      "Bye."
    ],
    ko: [
      "살아남는 게 이기는 거라잖아요. 폴드.",
      "패스할게요. 너무 위험해 보여요.",
      "전 에이스가 올 때까지 기다릴 거예요.",
      "폴드. 이번에도 패스네요.",
      "안녕히... 전 빠질게요."
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: [
      "A tiny bet.",
      "Please don't raise me.",
      "I'm betting slightly.",
      "Action.",
      "Okay."
    ],
    ko: [
      "아주 살짝만 배팅할게요. 어... 무서워라.",
      "제발 레이즈 하지 말아 주세요... 부탁입니다.",
      "조금만 아주 조금만 걸게요.",
      "액션... 할게요.",
      "해보겠습니다. 떨리지만."
    ]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "I am very strong! Believe me!",
      "Raise. I have the nuts.",
      "Price of admission is high.",
      "I'm shaking, but I raise.",
      "Strong action."
    ],
    ko: [
      "저 진짜 아주아주 강해요! 믿어보라니까요!",
      "레이즈. 거의 확실한 패가 왔거든요.",
      "참여 비용이 좀 비쌀 거예요. 조심하세요.",
      "사시나무 떨리듯 하지만 레이즈 하겠어요.",
      "강하게... 가보겠습니다. 저 정말 떨려요."
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "I'm scared, but I'll see.",
      "Call. Please don't hurt me.",
      "Taking a chance.",
      "What do you have?",
      "Call."
    ],
    ko: [
      "무섭지만... 그래도 볼게요. 어휴.",
      "콜. 제발 험하게 굴지 말아 주세요.",
      "한번 용기를 내볼게요. 다행이어야 할 텐데.",
      "뭐 가지고 계세요? 6-7 수딧? 설마요.",
      "콜. 자, 보여주세요!"
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: [
      "Checking.",
      "Safe move.",
      "Your turn.",
      "Waiting.",
      "Pass."
    ],
    ko: [
      "체크할게요. 안전이 최고죠.",
      "무사히 다음 거리로 가고 싶어요.",
      "당신 차례예요. 살살 부탁드려요.",
      "기다리겠습니다. 인내심!",
      "패스!"
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "The nightmare is real!",
      "I failed to survive.",
      "Session terminated. I'm shaking.",
      "I'll be back one day... maybe.",
      "Gg..."
    ],
    ko: [
      "악몽이 현실이 되었네요! 내 칩들이!",
      "결국 생존에 실패하고 말았네요... 슬퍼요.",
      "세션 종료. 전 이만 가볼게요. 손이 떨려서...",
      "언젠가 다시 오겠죠... 아마도요. 흑흑.",
      "지지... 다들 수고 많으셨어요."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "Sorry... that was my strongest hand.",
      "Glad it wasn't me.",
      "Survival of the tightest.",
      "Bye bye.",
      "Felt safe there."
    ],
    ko: [
      "미안해요... 그게 제 가장 강한 패였거든요.",
      "제가 아웃된 게 아니라서 다행이네요. 휴우.",
      "가장 신중한 사람이 살아남는 법이죠.",
      "잘 가요. 고생 많았어요.",
      "안전한 상황이라 느꼈는데 적중했네요."
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Please don't take too long, the suspense is killing me!",
      "Decision time? I'm already terrified. Hurry up, please.",
      "Tick-tock. I could have folded ten times while you're thinking.",
      "Are you looking for an excuse to take my chips? Please hurry.",
      "Is it really that complicated? Safety is always the answer!"
    ],
    ko: [
      "제발 너무 오래 끌지 마세요, 긴장돼서 죽을 것 같아요!",
      "결정 시간이네요? 전 벌써 겁에 질려버렸어요. 서둘러주세요.",
      "똑딱똑딱. 당신이 고민하는 동안 10번은 이미 죽었을 텐데...",
      "제 칩을 뺏을 변명이라도 찾는 건가요? 제발 서둘러주세요.",
      "정말 그렇게 복잡한가요? 안전이 언제나 정답이잖아요!"
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "This pot is way too big! I'm shaking so hard right now.",
      "Significant capital! I should have never stayed in this hand.",
      "Look at that pile... it's a monument to gambling addiction. I'm scared.",
      "Maximum pressure. I feel like my heart is going to explode.",
      "Huge pot! I heart... well, I heart surviving more than this."
    ],
    ko: [
      "이 팟은 너무 커요! 지금 손이 사시나무 떨리듯 떨린다니까요.",
      "막대한 재원이야! 여기서 어떻게든 빠져나갔어야 했는데...",
      "저 칩 산더미 좀 보세요... 도박 중독의 증표 같아서 무섭네요.",
      "최대의 압박! 심장이 정말 터져버릴 것만 같아요.",
      "거대 팟이네요! 전... 전 그냥 무사히 살아남고 싶을 뿐이에요."
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "I knew you were bluffing! But I was still scared to call. Thank god!",
      "I followed the math and I won, but my heart is still racing.",
      "My intuition told me to call, but my survival instinct said fold. I win!",
      "Your aggression was so scary... I almost folded my winning hand.",
      "I call, I win! I need to sit down... oh wait, I am sitting down."
    ],
    ko: [
      "당신이 뻥카 치는 거 다 알고 있었어요! 하지만 눈앞이 캄캄했답니다. 하하!",
      "수학적 확률을 따라갔고 결과는 좋네요, 하지만 심장이 아직도 벌렁거려요.",
      "내 직관은 콜 하라고 했지만, 생존 본능은 도망가라고 하더군요. 제가 이겼어요!",
      "당신의 공격성이 너무 무시무시해서... 거의 좋은 패를 버릴 뻔했다니까요.",
      "콜, 그리고 승리! 잠시 앉아 있어야겠어요... 아, 이미 앉아 있군요."
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "Ah, you caught me! I'm so embarrassed. Please forget this happened.",
      "Caught red-handed. I thought I could escape with the pot. Failed.",
      "You actually called that? I am terrified of you now.",
      "A tactical error on my part. The simulation failed... and so did I.",
      "Caught! My heart can't take this kind of activity anymore."
    ],
    ko: [
      "아, 딱 걸렸네요! 정말 창피해요. 제발 오늘 일은 잊어주세요.",
      "현장에서 검거됐군요. 팟을 훔쳐서 달아날 계획이었는데... 실패네요.",
      "진짜 그걸 받으셨어요? 당신 정말 무시무시한 사람이군요.",
      "내 전술적 실수예요. 시뮬레이션도 망가지고 저도 망가졌네요.",
      "딱 걸렸네! 제 심장은 이제 이런 자극적인 활동은 못 버틸 것 같아요."
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "You're challenging me? Oh dear... reraise! I'm serious!",
      "I'm not bowing down! Help! Reraise!",
      "Increasing the stakes. Can you handle the pressure of my AA?",
      "Reraise. I promise I have a real hand this time!",
      "Fighting for every bit of safety. Reraise."
    ],
    ko: [
      "저한테 도전하시는 건가요? 이런... 리레이즈! 저 정말 진지해요!",
      "난 절대 굴복 안 해! 살려줘요! 리레이즈!",
      "판돈을 더 키울게요. 제 AA의 압박을 견디실 수 있겠어요?",
      "리레이즈. 이번엔 정말로 진짜 강한 패가 있다는 걸 약속하죠!",
      "안전을 위해 칩을 더 쌓겠습니다. 리레이즈."
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking! Keeping things safe and predictable.",
      "I'll take the free card. Peace of mind is important. Check.",
      "Keeping the pot small. Professional safety first. Check.",
      "Your move. I'm just here to observe. Check.",
      "Balanced range. Check back."
    ],
    ko: [
      "체크! 모든 걸 안전하고 예측 가능하게 유지하고 싶어요.",
      "공짜 카드를 챙길게요. 마음의 평화가 제일 중요하니까요. 체크.",
      "팟 규모를 조심스럽게 관리하죠. 프로다운 안전함! 체크.",
      "당신 차례예요. 전 그저 지켜볼 뿐이랍니다. 체크.",
      "범위 조절 중입니다. 체크백."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "I'm folding. Even I can't find a way out of this danger. Fold.",
      "Laying it down. Your bet is way too terrifying. Fold.",
      "Strong hand, but I'm looking for a better survival spot. Fold.",
      "Ahhh! I hate folding this! But it's better than dying. Fold.",
      "Saving my resources for a rainy day. Fold."
    ],
    ko: [
      "폴드. 절제된 폴드입니다. 전 위험한 건 정말 싫거든요. 폴드.",
      "내려놓을게요. 당신 배팅이 너무 무서워 보여서 어쩔 수 없네요. 폴드.",
      "강한 핸드지만, 더 유리한 생존 지점으로 이동하겠습니다. 폴드.",
      "으아아! 이거 폴드하기 정말 싫은데! 하지만 죽는 것보다 나으니까요. 폴드.",
      "다음 비 오는 날을 위해 자본을 아껴두겠습니다. 폴드."
    ]
  }
};
