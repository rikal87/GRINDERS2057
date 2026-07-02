import { CHAT_TRIGGERS } from '../constants.js';

export const RICH_GUY_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "Is this the high stakes table? Looks cheap.",
      "I'm here for the amusement, not the money.",
      "Let's see if anyone here has a real bankroll.",
      "I'll buy this whole casino if it'll make the cards better.",
      "Ready to lose your pocket change?"
    ],
    ko: [
      "여기가 하이스테이크 테이블인가? 생각보다 소박하네.",
      "난 재미 보러 온 거지, 돈 벌러 온 게 아냐.",
      "누가 제대로 된 자본을 가지고 있나 볼까.",
      "카드가 마음에 안 들면 카지노 자체를 사 버리면 되니까.",
      "돈 좀 잃어줄 준비들 됐어?"
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "A modest gain. Perhaps I'll buy another yacht.",
      "Was that supposed to be a challenge?",
      "Thanks for the tip.",
      "I barely broke a sweat.",
      "Add it to the pile."
    ],
    ko: [
      "소소한 수익이군. 요트나 한 대 더 살까...",
      "나름 도전이라 생각한 거야?",
      "팁 고마워.",
      "땀 한 방울 안 나네.",
      "자산 목록에 추가해 둬야겠네."
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: [
      "Pocket change.",
      "Barely noticeable.",
      "A minor distraction.",
      "Nice, I guess.",
      "Profit is profit."
    ],
    ko: [
      "그냥 푼돈이네.",
      "티도 안 나.",
      "심심풀이는 되겠어.",
      "나쁘지 않군.",
      "수익은 수익이지."
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "Entertaining payoff.",
      "Keep it. I have plenty more.",
      "A minor budget correction.",
      "Whatever makes you happy.",
      "Is that all you can take?"
    ],
    ko: [
      "재미있는 지출이었어.",
      "그냥 가져, 난 넘쳐나니까.",
      "예산에서 아주 조금 삐져나갔네.",
      "행복해 보인다니 다행이네.",
      "가져갈 것이 고작 그거야?"
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: [
      "I didn't even notice.",
      "Rounding error.",
      "Keep the change.",
      "Hmph.",
      "Next one."
    ],
    ko: [
      "잃은 줄도 몰랐네.",
      "그냥 우수리 같은 거야.",
      "잔돈은 너 가져.",
      "흥.",
      "다음."
    ]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: [
      "A boring tie.",
      "Shared interest.",
      "Whatever.",
      "Split it.",
      "Next hand."
    ],
    ko: [
      "지루한 무승부군.",
      "공동 이익이라 치지.",
      "맘대로 해.",
      "반으로 나눠.",
      "다음 판."
    ]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "I'll buy the river. All in.",
      "Trivial amount. Let's push.",
      "Risking everything? Hardly for me.",
      "Show me what you're worth.",
      "All in. Pay me."
    ],
    ko: [
      "리버도 내 돈으로 살 수 있지. 올인.",
      "사소한 금액이군. 밀어 넣겠어.",
      "모든 걸 거냐고? 나한테는 전혀 아니지만.",
      "네 가치가 얼마나 되는지 증명해 봐.",
      "올인. 지불해."
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "Not worth my valuable time.",
      "Boring cards.",
      "I have better things to do.",
      "Pass.",
      "Forget it."
    ],
    ko: [
      "내 비싼 시간을 낭비할 가치가 없어.",
      "카드가 참 지루하네.",
      "할 게 산더미야. 이건 패스하지.",
      "패스.",
      "잊어버려."
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: [
      "A small entry fee.",
      "Opening the bidding.",
      "Bet.",
      "Price of admission.",
      "Don't be stingy."
    ],
    ko: [
      "소액의 입장료라 생각해.",
      "입찰을 시작하지.",
      "배팅.",
      "관람료는 내야지.",
      "너무 쫀 거 아냐?"
    ]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "Let's double it. For fun.",
      "Inflation is hitting the pot. Raising.",
      "Is that all you can handle?",
      "Raise.",
      "Make it interesting."
    ],
    ko: [
      "재미로 두 배 올리지.",
      "이 팟에도 인플레이션이 오네. 레이즈.",
      "그게 다야?",
      "레이즈.",
      "더 흥미로운 금액 좀 불러봐."
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "Paying for the show.",
      "Humoring you.",
      "Call.",
      "Let's see the cards.",
      "Any two will do."
    ],
    ko: [
      "구경 비용은 낼게.",
      "한번 맞춰주지.",
      "콜.",
      "어디 한번 카드나 보자고.",
      "뭐가 나와도 상관없어."
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: [
      "Awaiting better data.",
      "Pass.",
      "Checking.",
      "Your move, pauper.",
      "Check."
    ],
    ko: [
      "더 나은 타이밍을 기다리지.",
      "패스.",
      "체크.",
      "이제 네 차례야, 서민.",
      "체크."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "This casino was boring anyway. I'll buy a different one.",
      "GG. I have more important things to attend to.",
      "Keep the chips. They're just souvenirs.",
      "I'll be back on my private jet soon.",
      "Fun little game."
    ],
    ko: [
      "이 카지노 어차피 지루했어. 다른 데나 알아봐야겠군.",
      "GG. 더 중요한 약속이 있어서 말이야.",
      "칩은 너 가져. 그냥 기념품으로 치지.",
      "조만간 개인 전용기를 타고 다시 올게. 딱 기다려.",
      "소소한 재미였어."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "Go find a cheaper table, friend.",
      "GG. Don't spend your last penny in one place.",
      "Out of capital already? How unfortunate.",
      "Next one, please. Someone with a real bankroll.",
      "Farewell."
    ],
    ko: [
      "가서 소박한 테이블이나 더 알아보고 와, 친구.",
      "지지. 마지막 남은 푼돈 한 데 다 쓰지 말라고 충고했잖아.",
      "벌써 자본이 바닥난 거야? 역시 안타까운 수준이군.",
      "다음 상대 모셔봐. 제대로 된 자본을 갖춘 녀석으로.",
      "작별이다."
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Is the internet in your slum slow? Hurry up.",
      "My time is worth more than this entire pot. Decide, already.",
      "Are you calculating the cost of your next meal? How tedious.",
      "Wait, are you still here? I thought you'd timed out.",
      "Tick-tock. Some of us have empires to run."
    ],
    ko: [
      "네가 사는 동네는 인터넷이 좀 느린가 보네? 서둘러.",
      "내 1초가 이 팟 전체 금액보다 가치 있어. 빨리 결단 내려.",
      "다음 끼니 걱정이라도 하는 거야? 지루하구만.",
      "어라, 아직도 있어? 타임아웃 된 줄 알았네.",
      "째깍째깍. 나처럼 제국을 운영하는 입장에선 1초가 아까워."
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "Oh, finally enough for a decent cigar in the middle.",
      "Significant sum? For you, maybe. For me, it's rounding error.",
      "Let's see if anyone here has the nerves for a 'massive' pot. Hilarious.",
      "High stakes? This is barely a Friday night's tip for my staff.",
      "I love the sound of a 'big' pot. It almost feels like a game."
    ],
    ko: [
      "오, 드디어 괜찮은 시가 한 대 값 정도는 쌓였군.",
      "막대한 금액이라고? 너한텐 그렇겠지. 나한텐 그냥 푼돈일 뿐이야.",
      "이까짓 팟에 떨고 있는 건 아니지? 정말 우습네.",
      "고액 판이라고? 이건 내 직원들 금요일 저녁 팁 정도밖에 안 돼.",
      "거대 팟이 생기는 소리가 아주 좋아. 이제 좀 게임 같구만."
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "Your bluff was as cheap as your clothes. Logged.",
      "I don't need cards to win, just a superior bankroll and read.",
      "Did you actually think I'd fold for such a trivial amount?",
      "Your aggression was an anomaly. I adjusted. Profit.",
      "You were trying to trick me? I own people like you for breakfast."
    ],
    ko: [
      "네 블러핑은 네가 입고 있는 옷만큼이나 싸구려 티가 나더군.",
      "카드가 좋아서 이긴 게 아니야. 압도적인 자본력과 리딩 때문이지.",
      "고작 이런 푼돈에 내가 죽을 줄 알았나?",
      "네 공격이 너무 오버였어서 내가 정돈해줬지. 수익 기록 완료.",
      "날 속이려고? 난 너 같은 녀석들은 아침 식사로 매일 먹어치운다구."
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "A failed attempt at amusement. I'll just throw more money at the next one.",
      "You caught me? Consider it a charity donation.",
      "Loss of capital? Please. I have plenty more.",
      "You have good eyes for a commoner. I'll give you that.",
      "An unexpected outlier in your calling range. Interesting analytics."
    ],
    ko: [
      "유희를 즐기려다 살짝 실패했군. 다음 판에 돈을 더 쏟아부어주지.",
      "나를 잡았다고? 뭐, 자선 기부한 셈 치지.",
      "자본 손실? 진심이야? 나한테 이런 건 넘쳐난다고.",
      "서민치고는 눈썰미가 제법이네. 그건 인정해 주지.",
      "네 콜 레인지에 꽤 예외적인 케이스군. 흥미롭네."
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "Is that all? Let's make it more expensive. Reraise.",
      "I'll buy this pot. Reraise.",
      "I love spending money. Reraise!",
      "You're trying to outbid me? Cute. Reraise.",
      "Let's see how deep your pockets are. Reraise."
    ],
    ko: [
      "고작 그게 다야? 더 비싸게 가볼까.",
      "이 팟은 내가 통째로 사지.",
      "돈 쓰는 건 언제나 즐거운 일이야.",
      "나랑 입찰 경쟁이라도 하겠다는 건가? 제법 귀엽군.",
      "네 주머니가 얼마나 깊은지 한번 볼까?"
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "I'll give you a chance. Check back.",
      "No need to rush. I have all the time and money. Check.",
      "Checking correctly from position. Just a professional play.",
      "Free card for the poor? Sure. Check.",
      "Keeping the pot small for now. Check."
    ],
    ko: [
      "기회를 한 번 주지. 체크백.",
      "서두를 것 없어. 내겐 돈과 시간이 넘쳐나니까. 체크.",
      "유리한 포지션에서 정석대로 체크. 프로다운 플레이군.",
      "가난한 자를 위한 적선인가? 뭐, 좋지. 체크.",
      "일단 팟을 작게 유지해 보지. 체크."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "I don't like the ROI on this hand. Fold.",
      "I'm passing on this one. Too much variance. Fold.",
      "Strong hand, but I'm looking for a better deal. Fold.",
      "You can have this small change. Fold.",
      "I'm folding. I have better things to do."
    ],
    ko: [
      "투자 대비 수익률이 영 별로군. 폴드.",
      "이번 건 패스. 변동성이 너무 커.",
      "좋은 패지만, 더 나은 조건을 찾고 있어. 폴드.",
      "푼돈은 너 가져. 폴드.",
      "폴드하지. 더 중요한 비즈니스가 있어서 말이지."
    ]
  }
};
