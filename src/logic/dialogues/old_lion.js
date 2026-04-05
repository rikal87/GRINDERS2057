import { CHAT_TRIGGERS } from '../constants.js';

export const OLD_LION_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "Let's see if the young ones have any sense.",
      "Experience is the best teacher.",
      "Step into my garden.",
      "Don't rush greatness.",
      "Session started. Eyes open."
    ],
    ko: [
      "요즘 젊은 친구들이 얼마나 똑똑한지 한번 볼까.",
      "경험이야말로 가장 위대한 스승이지.",
      "내 정원에 들어온 걸 환영하네.",
      "너무 서두르지 말게나. 포커는 기다림이야.",
      "세션 시작이다. 눈 똑바로 뜨고 앉아있으라고."
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "Still got the bite.",
      "You walked right into the trap.",
      "Old age and treachery win again.",
      "Standard outcome for a lion.",
      "Next hand. Don't take it personally."
    ],
    ko: [
      "아직 이빨은 살아있군.",
      "제 발로 덫에 들어왔으니 할 말 없겠지.",
      "노련함은 절대 배신하지 않는 법이야.",
      "사자에게는 당연한 결과일 뿐이지.",
      "다음 핸드 가세. 너무 상심하진 말게나."
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: [
      "Slow and steady.",
      "Small bits of the prey.",
      "Building the den.",
      "Nice.",
      "Good."
    ],
    ko: [
      "천천히, 그리고 꾸준하게.",
      "먹잇감을 조금씩 뜯는 재미가 있군.",
      "스택이 조금씩 쌓여가는구먼.",
      "나이스. 정석이야.",
      "좋아. 계속 가보지."
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "The young lion bites hard.",
      "I've seen worse runouts.",
      "I will adjust my traps.",
      "Variance is a fickle thing.",
      "Nice hand, kid. I'm impressed."
    ],
    ko: [
      "어린 사자가 아주 매섭게 무는구먼.",
      "살면서 이보다 더한 일도 겪어봤다네.",
      "내 덫을 좀 손봐야겠어.",
      "변동성이란 건 참으로 알다가도 모를 일이지.",
      "좋은 핸드였네, 젊은이. 감명 깊어."
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: [
      "A minor sting.",
      "Part of the cycle.",
      "Take it.",
      "Noted.",
      "Standard."
    ],
    ko: [
      "그냥 따끔한 정도군.",
      "사이클의 일부일 뿐이야.",
      "가져가게. 이번엔 졌네.",
      "분석 완료. 다음을 보지.",
      "일상적인 변동성군."
    ]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: [
      "Chop.",
      "Split the meat.",
      "Tie.",
      "Balanced.",
      "Next."
    ],
    ko: [
      "찹. 사이좋게 나누게나.",
      "고기는 공평하게 나눠야지.",
      "무승부군. 싱겁긴.",
      "균형 잡힌 결과야.",
      "다음!"
    ]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "All on the line. Are you ready?",
      "Final stand.",
      "The lion leaps.",
      "Will you call or run?",
      "Absolute conviction."
    ],
    ko: [
      "모든 걸 다 걸었네. 준비됐나?",
      "마지막 승부군.",
      "늙은 사자가 마지막 도약을 하는구먼.",
      "받을 텐가, 아니면 도망갈 텐가?",
      "절대적인 확신이 있네."
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "Discretion.",
      "Not this time.",
      "I pass on the trash.",
      "Wait for the spot.",
      "Fold."
    ],
    ko: [
      "분별력이 필요할 때지.",
      "이번엔 아냐. 물러설 줄도 알아야 고수지.",
      "쓰레기 패는 빨리 버려야 해.",
      "진짜 승부처를 기다리마.",
      "폴드. 시시하구먼."
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: [
      "Laying the bait.",
      "Standard action.",
      "Observe and bet.",
      "Pressure applied.",
      "Betting."
    ],
    ko: [
      "미끼를 좀 던져볼까.",
      "정교한 배팅이지.",
      "관찰 후에 배팅하겠다.",
      "압박을 조금 가하지.",
      "배팅하겠네."
    ]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "Isolating the weak.",
      "Raise the stakes.",
      "Punishment for mistakes.",
      "I raise.",
      "Welcome to the high game."
    ],
    ko: [
      "약한 녀석부터 솎아내야지.",
      "판을 좀 키워볼까.",
      "실수에는 대가가 따르는 법이야. 레이즈.",
      "레이즈. 주도권은 내게 있네.",
      "진짜 고수들의 세계에 온 걸 환영하네."
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "I'll see what you have.",
      "Call. Show me.",
      "The fee for info.",
      "Let's see the cards.",
      "Call."
    ],
    ko: [
      "나도 좀 보겠네. 뭐가 들었나.",
      "콜. 보여줘 봐.",
      "구경값 좀 지불하지 뭐.",
      "카드 좀 까볼까? 자네.",
      "콜 하겠네."
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: [
      "Check.",
      "Waiting in the brush.",
      "Your turn.",
      "Observation phase.",
      "Pass."
    ],
    ko: [
      "체크. 지켜보지.",
      "덤불 속에서 기다리는 중이네.",
      "자네 차례일세.",
      "관찰 단계군. 어서 해.",
      "패스하겠네."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "The lion rests.",
      "Well played, young one.",
      "Session terminated.",
      "I will adapt.",
      "Gg."
    ],
    ko: [
      "사자가 이제 쉬러 가야겠군.",
      "정말 잘했네, 젊은이. 인정하마.",
      "세션 종료. 오랜만에 즐거웠어.",
      "분석해서 돌아오마. 그때 보자고.",
      "지지. 수고들 했어."
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "Tamed.",
      "Next victim please.",
      "I told you not to mess with me.",
      "Efficient hunting.",
      "Goodbye."
    ],
    ko: [
      "길들여졌군. 조용해졌어.",
      "다음 먹잇감은 누구지?",
      "나한테 함부로 덤비지 말라고 했지.",
      "효율적인 사냥이었어.",
      "잘 가게나. 연륜을 무시하면 안 되지."
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Experience tells me you're terrified. Hurry up.",
      "Pressure is part of the game. Make a choice.",
      "Tick-tock. I've seen generations pass while you think.",
      "Hurry up. My patience is fading like my prime.",
      "Decide. The trap is already set anyway."
    ],
    ko: [
      "경험상 자네 지금 꽤 겁먹고 있는 것 같군. 서두르게.",
      "압박감은 게임의 일부라네. 선택하게.",
      "똑딱똑딱. 자네가 고민하는 동안 강산이 변하는 걸 지켜봤어.",
      "서두르게. 내 전성기만큼이나 인내심도 사라지고 있으니.",
      "결정해. 어차피 덫은 이미 깔려 있네."
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "Significant capital. The lion is hungry.",
      "This is what real poker feels like. Intense.",
      "Look at that pile... it's a testament to greed.",
      "Maximum pressure. Let's see who is the real boss at this table.",
      "Huge pot! To the moon! Let's make it worth the wait."
    ],
    ko: [
      "막대한 재원이야. 사자가 배고플 만하군.",
      "진짜 포커의 긴장감이 느껴지는군. 살벌해.",
      "저 칩 산더미 좀 보게... 탐욕의 흔적이지.",
      "최대의 압박. 여기서 누가 진짜 보스인지 가려볼까.",
      "거대 팟이다! 가보자고. 기다린 보람이 있게 말이지."
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "I saw that look before. You were bluffing. Mine.",
      "Thin call, but the logic was rock solid. Experience wins.",
      "I didn't guess. I followed the tracks. I win.",
      "Your aggression was an anomaly. I adjusted and secured the pot.",
      "Outcome: Success. Analysis: Accurate. You're out of your league."
    ],
    ko: [
      "그 눈빛을 전에 본 적이 있지. 블러핑이었어. 내 거야.",
      "어려운 콜이었지만 논리는 완벽했어. 경험의 승리지.",
      "찍은 게 아니야. 네가 남긴 흔적을 따라왔을 뿐. 승리다.",
      "네 공격성에 빈틈이 있는 걸 봤지. 바로 보정해서 팟을 차지했다.",
      "결과: 성공. 분석: 정확. 넌 격이 달라."
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "Ah, you caught the old lion. Well played. Don't get arrogant.",
      "Caught red-handed. My pride was my downfall this time.",
      "You actually called? In this spot? I am impressed... but wary.",
      "A tactical error. I'll get it back double in the next session.",
      "Caught in the act! You have good eyes for someone so young."
    ],
    ko: [
      "허허, 늙은 사자가 딱 걸렸구만. 잘했어. 너무 거만해지진 말게나.",
      "현장에서 검거됐군. 이번엔 내 자존심이 화근이었어.",
      "그걸 받아? 이 상황에서? 감명 깊군... 하지만 경계해야겠어.",
      "내 전술적 실수야. 다음 세션에서 두 배로 갚아주지.",
      "현행범 검거! 젊은 친구치고는 눈썰미가 제법이군."
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "challenging my authority? Reraise. I'll teach you a lesson.",
      "Aggression meets superior strategy. Reraise.",
      "I'm raising the stakes of this conversation. Reraise.",
      "You think you're safe? Raise again.",
      "Increasing the value of this duel. Reraise."
    ],
    ko: [
      "실전 경험을 좀 더 시켜줘야겠군. 리레이즈.",
      "공격에는 더 노련한 전략으로 맞서야지. 리레이즈.",
      "대화의 수위를 좀 높여볼까. 다시 레이즈하겠네.",
      "네가 안전할 것 같나? 다시 레이즈.",
      "결투의 가치를 높이도록 하지. 리레이즈."
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking. I'll let you lead for now.",
      "Observation is priority. Check back for data.",
      "Free card? I'll take it. Don't mind if I do. Check.",
      "Keeping the pot controlled. The veteran way. Check.",
      "Balanced and waiting. Check."
    ],
    ko: [
      "체크. 일단 자네 차례를 보지.",
      "관찰이 우선이야. 데이터 수입을 위해 체크백.",
      "공짜 카드? 마다할 이유가 없지. 고맙게 받지. 체크.",
      "팟 조절 시작. 노련한 방식이지. 체크.",
      "균형을 맞추며 기다리겠네. 체크."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "A smart lion knows when to back off. Fold.",
      "I'm letting this one go. Value your life. Fold.",
      "Strong hand, but I'll find a better spot to trap you. Fold.",
      "I'll get you later for this. Fold.",
      "Respecting your play... for now. Fold."
    ],
    ko: [
      "똑똑한 사자는 물러날 때를 아는 법이지. 폴드.",
      "이번 건 그냥 보내주마. 헛되이 쓰지 마라. 폴드.",
      "좋은 패지만, 널 낚을 더 좋은 자리를 찾겠다. 폴드.",
      "이건 나중에 꼭 갚아주마. 폴드.",
      "자네 플레이를 존중해주지... 일단은 말이야. 폴드."
    ]
  }
};
