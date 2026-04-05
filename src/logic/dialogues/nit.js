import { CHAT_TRIGGERS } from '../constants.js';
// 꽉막힌 성격, 방어적인 말투
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
      "좋은 패 올 때까지 기다릴 거예요.",
      "안전이 우선이에요.",
      "안녕하세요. 오늘도 조심히 할게요.",
      "서두를 거 없어요. 지켜보겠습니다.",
      "조용히 지나갔으면 합니다."
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
      "기다리길 잘했네요.",
      "역시 안전한 상황이었네요.",
      "긴장됐는데... 이겼네요.",
      "후. 스택이 좀 안전해졌네요.",
      "손이 아직도 좀 떨리네요."
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
      "작은 게 안전한 거죠.",
      "다행이네요.",
      "차곡차곡 쌓아야죠.",
      "무난하네요.",
      "무사하네요."
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
      "죽었어야 했는데.",
      "함정이었어요. 역시.",
      "재앙이네요.",
      "AA가 깨졌어요. 믿을 수 없네요.",
      "눈물 날 것 같아요."
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
      "아쉽네요.",
      "조금 잃었어요. 이 정도면 다행이죠.",
      "다음엔 더 조심할게요.",
      "기다리겠습니다.",
      "더 신중하게요."
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
      "평화롭네요.",
      "안전하게 나눴네요.",
      "찹이네요.",
      "무승부. 다행이에요.",
      "무사하니까요."
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
      "진짜 있어요. 믿으셔도 돼요.",
      "제발 폴드하세요.",
      "무섭지만 올인이에요.",
      "더 이상 물러설 곳이 없네요.",
      "지금까지 제일 좋은 패예요."
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
      "살아남는 게 이기는 거죠.",
      "너무 위험해요. 폴드.",
      "에이스 올 때까지 기다릴게요.",
      "폴드.",
      "나갈게요."
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
      "아주 살짝만요.",
      "레이즈는 하지 마세요. 진짜요.",
      "조금만 걸게요.",
      "배팅.",
      "떨리지만 배팅."
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
      "진짜 강해요. 믿어보세요.",
      "확실한 패예요. 레이즈.",
      "비용이 좀 올라갔네요.",
      "떨리지만 레이즈예요.",
      "강하게 가겠습니다."
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
      "무섭지만 볼게요.",
      "콜. 걱정되네요.",
      "용기를 내볼게요.",
      "뭐 가지고 계신 거예요?",
      "콜이에요."
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
      "체크요. 안전하게.",
      "무사히 넘어가고 싶네요.",
      "당신 차례예요. 살살 해주세요.",
      "기다릴게요.",
      "패스."
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
      "악몽이 현실이 됐네요.",
      "생존에 실패했어요.",
      "세션 종료. 이만 갈게요.",
      "언젠가 다시 올게요.",
      "지지."
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
      "아... 미안해요.",
      "제가 아닌 게 다행이에요.",
      "신중한 사람이 살아남는 거죠.",
      "잘 가요.",
      "안전하다고 느꼈는데 맞았네요."
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Don't take too long. The suspense is unbearable.",
      "You're deciding? I'm already anxious. Please hurry.",
      "Tick-tock. I've considered folding three times already.",
      "Are you looking for an excuse to take my chips? Please hurry.",
      "Is it complicated? Just fold."
    ],
    ko: [
      "너무 오래 끌지 마세요. 긴장돼요.",
      "결정 중이신가요? 전 벌써 불안해요.",
      "째깍째깍. 그동안 세 번은 폴드했을 거예요.",
      "제 칩 노리시는 건 아니죠? 어서요.",
      "그렇게 복잡한가요? 그냥 폴드하세요."
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "This pot is too big. I'm shaking.",
      "Too much capital. I shouldn't have stayed.",
      "Look at that pile... it's a monument to gambling. I'm scared.",
      "Maximum pressure. Not good.",
      "I just want to survive this hand."
    ],
    ko: [
      "팟이 너무 커요. 손이 떨려요.",
      "너무 많이 들어와버렸어요.",
      "저 칩 더미... 무섭네요.",
      "압박이 장난이 아니에요.",
      "그냥 살아만 남으면 돼요."
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "Suspected a bluff. Still scared. Thank god.",
      "I followed the math and I won, but my heart is still racing.",
      "Gut said call. Instinct said fold. Gut won.",
      "Your aggression was so scary... I almost folded my winning hand.",
      "I call, I win!"
    ],
    ko: [
      "뻥카인 건 알고 있었어요. 그래도 무서웠어요.",
      "확률상 콜이었는데... 심장이 아직 두근거려요.",
      "직관은 콜, 본능은 폴드. 직관이 맞았네요.",
      "너무 공격적이어서... 좋은 패 버릴 뻔했어요.",
      "난 콜을 했고, 승리했지!"
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "Ah, you caught me! I'm so embarrassed. Please forget this happened.",
      "Caught red-handed. I thought I could escape with the pot. Failed.",
      "You actually called that? I am terrified of you now.",
      "A miscalculation. I shouldn't have tried.",
      "Caught! My heart can't take this kind of activity anymore."
    ],
    ko: [
      "걸렸네요. 창피해요. 잊어주세요.",
      "팟 훔치려 했는데 실패했어요.",
      "그걸 받으셨어요? 무서운 분이네요.",
      "계산 실수였네요.",
      "심장이 버틸 수가 없어요."
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "You challenge me? Reraise. I'm serious.",
      "Not backing down. Reraise.",
      "Increasing the stakes. Can you handle the pressure of my AA?",
      "Reraise. I really have a hand.",
      "Fighting for every bit of safety. Reraise."
    ],
    ko: [
      "도전하시는 건가요? 리레이즈예요.",
      "굴복 안 해요. 리레이즈.",
      "제 AA 압박을 견디실 수 있겠어요?",
      "이번엔 진짜예요. 리레이즈.",
      "안전을 위해서요. 리레이즈."
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking. Safe and predictable.",
      "I'll take the free card. Peace of mind is important. Check.",
      "Keeping the pot small. Safety first. Check.",
      "Your move. I'm just here to observe. Check.",
      "Balanced range. Check back."
    ],
    ko: [
      "체크. 안전하게, 예측 가능하게.",
      "공짜 카드요. 마음의 평화가 중요하니까요.",
      "팟은 작게 유지해야 해요. 체크.",
      "당신 차례예요. 체크해요.",
      "범위 조절이요. 체크백."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "Even I can't navigate this. Fold.",
      "Your bet is too much. Fold.",
      "Strong hand, but I'm looking for a better survival spot. Fold.",
      "Hate this fold. Better than dying.",
      "Saving my resources for a rainy day. Fold."
    ],
    ko: [
      "위험한 건 못 참아요. 폴드.",
      "배팅이 너무 무서워요. 폴드.",
      "강한 패지만. 폴드해요.",
      "폴드하기 싫은데... 죽는 것보다 낫죠.",
      "나중을 위해 아껴둘게요. 폴드."
    ]
  }
};
