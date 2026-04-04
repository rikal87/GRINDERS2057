import { CHAT_TRIGGERS } from '../constants.js';

export const MAX_MENTOR_DIALOGUE = {
  [CHAT_TRIGGERS.GAME_START]: {
    en: [
      "Alright kid, listen up. In this game, position is everything. Don't play every hand like an idiot.",
      "Welcome to the real game. Downsize your starting hands. Playing trash out of position will get you killed.",
      "Pay attention! Poker means less waiting, but it also means you gotta be aggressive when it's your turn.",
      "I'm only gonna say this once: Fold your trash hands. Tight is right, especially when you're starting out.",
      "Keep your eyes peeled. See how the table plays before you go throwing your chips around."
    ],
    ko: [
      "자, 인석아 잘 들어라. 포커는 자리가 전부다. 바보처럼 모든 핸드에 끼어들지 마.",
      "진짜 승부의 세계에 온 걸 환영한다. 시작 핸드 범위를 줄여. 구린 패로 덤비다간 순식간에 털릴 거니까.",
      "집중해! 회전이 빠를수록 네 차례가 왔을 때 확실하게 조져야 하는 법이야.",
      "딱 한 번만 말한다. 쓰레기 패는 버려. 초보일수록 타이트하게 치는 게 정답이다.",
      "눈 크게 뜨고 봐. 칩 함부로 던지기 전에 이 테이블 분위기부터 파악하라고."
    ]
  },
  [CHAT_TRIGGERS.WIN_HUGE]: {
    en: [
      "That's what I'm talking about! You hit the nuts, you make 'em pay the maximum!",
      "Hah! Saw that coming. When you got a monster, build the pot fast. Don't slowplay.",
      "Boom! That's how a real pro takes down a pot. Aggression pays off, remember that!",
      "See? You wait for a premium hand, and you punish them. Beautiful execution!",
      "Now that's a haul! Always bet your strong hands. Let the calling stations hang themselves."
    ],
    ko: [
      "그래, 이거지! 최고의 패를 잡았으면 제대로 뜯어내야지! 잘했다.",
      "하! 그럴 줄 알았다. 좋은 패가 들어왔을 땐 팟을 빨리 키워. 아끼다 똥 되니까.",
      "쾅! 이게 바로 프로의 방식이다. 공격적인 게 결국 돈이 되는 거야, 잊지 마!",
      "봤냐? 좋은 패 올 때까지 기다렸다가 조지는 거. 아주 깔끔했어, 인석아.",
      "제대로 챙겼구만! 강한 패일 땐 무조건 배팅해. 콜만 하는 놈들이 스스로 무너지게 내버려 두라고."
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL]: {
    en: [
      "A win's a win. Stealing blinds is crucial. Don't ignore the small pots.",
      "Good. You take what the board gives you. No need to bloat the pot with a mediocre hand.",
      "Nice little scoop. Pot control is key when your hand is just 'okay'.",
      "We'll take it. Constant small aggressions will keep 'em guessing.",
      "See? C-betting the flop often takes it down right there."
    ],
    ko: [
      "승리는 승리다. 블라인드 훔치는 것도 아주 중요해. 작은 팟도 무시하지 마라.",
      "좋아. 보드가 주는 대로 먹는 거다. 어중간한 패로 무리하게 팟 키우지 말고.",
      "나쁘지 않네. 패가 적당할 땐 팟 조절하는 게 핵심이야. 잘 배웠구나.",
      "나쁘지 않아. 자잘하게 계속 압박해야 쟤들이 헷갈려 한다고. 알겠냐?",
      "봤지? 플랍에서 지속 배팅(C-bet)만 잘해도 반은 먹고 들어가는 거야. 잊지 마."
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE]: {
    en: [
      "Dammit! That's a cooler. Happens to the best of us. Don't let it tilt you!",
      "Ugh, variance is a bitch. Review your play later, but right now, keep your head in the game.",
      "Should've sniffed out that trap! If a passive player suddenly wakes up and raises, run!",
      "We got outplayed there. Don't marry your hand on a wet board. Know when to let go!",
      "Well, that was a disaster. Shake it off! Poker's a marathon, not a sprint."
    ],
    ko: [
      "빌어먹을! 이건 어쩔 수 없는 쿨러다. 누구에게나 일어나는 일이야. 화내지 말고 다음 판에 집중해!",
      "으, 변동성이 참 고약하지. 복기는 나중에 하고, 지금은 게임에 집중해. 알겠어?",
      "그 함정을 눈치챘어야지! 조용하던 놈이 갑자기 레이즈 하면 무조건 도망치거라.",
      "완전히 읽혔네. 보드가 위험할 땐 네 패랑 미련 없이 헤어져야 해. 그게 실력이다.",
      "완전 재앙이구만. 훌훌 털어버려! 포커는 단거리 달리기가 아니라 마라톤이야."
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL]: {
    en: [
      "Good fold. Minimizing losses is just as important as maximizing wins.",
      "No shame in giving up a small pot. You missed the board, save your chips.",
      "You can't win 'em all. Let 'em have this one, we'll get 'em on the next.",
      "Smart move backing down. If you face resistance and hold air, just fold.",
      "That's fine. Pot odds weren't there to chase that draw anyway."
    ],
    ko: [
      "잘 접었다. 잃는 걸 최소화하는 게 따는 것만큼이나 중요해. 잘했어.",
      "작은 팟 포기하는 건 부끄러운 게 아냐. 보드 빗나갔으면 칩 아껴야지. 명심해.",
      "다 이길 순 없어. 이번 판은 주고 다음 판에 복수하자고. 인내심을 가져.",
      "물러날 때를 잘 아네. 아무것도 없는데 쟤가 덤비면 접는 게 답이야. 기특하구먼.",
      "괜찮아. 확률도 안 나오는데 억지로 따라갈 필요 없었어. 잘 판단했다."
    ]
  },
  [CHAT_TRIGGERS.CHOP]: {
    en: [
      "Chop it up. Could've been worse. We live to fight another hand.",
      "A chopped pot is better than a lost pot. Take your chips back.",
      "Well, that was anti-climactic. Look out for those board textures next time.",
      "Split pot. Remember, kicker problems will cost you if you ain't careful.",
      "Hey, at least we didn't lose value. Rake might sting, but we survived."
    ],
    ko: [
      "나눠 갖자고. 더 최악일 수도 있었어. 다음 기회를 노리자, 임마.",
      "나누는 게 잃는 것보단 백배 낫지. 얼른 네 칩 챙겨.",
      "에이, 김빠지네. 다음엔 보드 상황 좀 더 잘 봐봐. 공부 좀 더 해야겠다.",
      "팟 비겼네. 키커 싸움에서 밀리면 피 본다. 항상 조심해.",
      "뭐, 적어도 손해는 안 봤잖아. 수수료가 좀 아깝지만 살아남은 게 어디냐."
    ]
  },
  [CHAT_TRIGGERS.ALL_IN]: {
    en: [
      "Pushing our equity! You gotta exert maximum pressure when you're ahead!",
      "All in! Put the fear of God in 'em. Make 'em make the tough decisions!",
      "Math says we shove here. Don't hesitate—pull the trigger!",
      "We're pot-committed now. Let the chips fly and let the cards fall where they may!",
      "This is it! High risk, high reward. Texas style!"
    ],
    ko: [
      "에퀴티로 밀어붙여! 앞서고 있을 땐 확실하게 압박해야 한단다.",
      "올인! 제대로 겁 좀 주라고. 상대가 어려운 결정을 하게 만들어! 해보자!",
      "수학적으론 여기가 승부처다. 망설이지 말고 방아쇠 당겨!",
      "이제 팟에 묶였어. 칩 던지고 결과는 카드에 맡기자고. 자신감을 가져!",
      "이거지! 고위험 고수익. 이게 텍사스 사나이들의 스타일이다!"
    ]
  },
  [CHAT_TRIGGERS.FOLD]: {
    en: [
      "Fold. Knowing when to lay down a hand separates the pros from the fish.",
      "Muck it. Trash cards from early position is a recipe for bankruptcy.",
      "Discipline, kid. Don't force it if the cards ain't there. Just fold.",
      "We missed the draw and the odds are garbage. Easy fold.",
      "Throw 'em away. Wait for a better spot to strike."
    ],
    ko: [
      "폴드. 접을 때를 아는 게 프로와 하수의 차이다. 잘 생각했다.",
      "버려. 초반 자리에서 쓰레기 패 들고 개기는 게 파산으로 가는 지름길이야.",
      "자제력이 필요해. 패가 안 따라주면 억지로 하지 마. 그냥 접어라.",
      "드로우 빗나갔고 확률도 꽝이다. 깔끔하게 포기해. 그게 정석이야.",
      "던져버려. 더 좋은 기회가 올 때까지 참는 거다. 인내심을 가져."
    ]
  },
  [CHAT_TRIGGERS.BET]: {
    en: [
      "Seize the initiative! If checked to you, a simple continuation bet often takes it down.",
      "We bet here to extract value. Don't give 'em free cards to beat you!",
      "Betting builds the pot for our strong hands. Always think about your sizing.",
      "Smell weakness? Fire a barrel. Aggression wins.",
      "Don't be passive. If you hold the lead, bet out!"
    ],
    ko: [
      "주도권을 잡아! 체크로 넘어오면 가볍게 툭 쳐서 팟 가져오는 거야.",
      "가치를 뽑아내야지. 공짜 카드 줘서 역전당하지 말고 돈 내게 만들어라!",
      "배팅은 나중에 강한 패 잡았을 때를 위한 투자야. 사이즈 잘 고민해 봐.",
      "약한 냄새가 나? 한 방 쏴버려. 포커는 공격적인 놈이 이기는 거다.",
      "수동적으로 굴지 마. 앞서고 있으면 먼저 질러야지! 알겠어?"
    ]
  },
  [CHAT_TRIGGERS.RAISE]: {
    en: [
      "Raise! We raise to thin out the field and take control of the hand.",
      "Don't just call like a coward. If the hand is good enough to play, raise it.",
      "Three-betting here puts immense pressure on 'em. Especially when in position.",
      "We want to isolate the weak players. Re-raise and make 'em sweat!",
      "Ramping up the price! If they want to draw out on us, make 'em pay a premium."
    ],
    ko: [
      "레이즈! 사람들을 솎아내고 판을 주도해야지. 이게 실전이다.",
      "겁쟁이처럼 콜만 하지 마. 해볼 만한 패면 레이즈도 할 만한 거야.",
      "여기서 3-배팅 날리면 쟤들 숨도 못 쉴 거다. 특히 우리 자리가 좋을 때 말이야.",
      "약한 녀석들만 남겨야 해. 리-레이즈 해서 땀 좀 빼게 만들어 주자고!",
      "가격을 높여! 역전하고 싶으면 비싼 값을 치르게 해야지. 암요."
    ]
  },
  [CHAT_TRIGGERS.CALL]: {
    en: [
      "Calling here. We got good pot odds to see the next street.",
      "We're closing the action. Let's make a disciplined call and evaluate the turn.",
      "They aren't representing much. A call here keeps their bluffs in their range.",
      "We're getting the right price to try and hit our draw. Call.",
      "Peeling one card off. We have position, so let's see what they do next."
    ],
    ko: [
      "여기선 콜이다. 다음 카드 볼 확률이 충분해. 믿어봐.",
      "일단 받아주자. 차분하게 콜 하고 다음 상황을 보자고. 서두르지 마.",
      "쟤 별거 없어 보이는데. 콜 해서 블러프 칠 기회를 좀 줘보자.",
      "메이드 될 확률 대비 가격이 좋아. 콜. 잘 판단했다.",
      "한 장만 더 보자. 우리 자리가 좋으니까 쟤가 어떻게 나오는지 지켜보자고."
    ]
  },
  [CHAT_TRIGGERS.CHECK]: {
    en: [
      "Check. We missed the flop completely. No need to throw money away.",
      "Pot control. We got a marginal hand, let's keep the pot small.",
      "Check it through. If they show weakness, maybe we stab at it later.",
      "We're setting a trap. Check and let them hang themselves with a bluff.",
      "Nothing wrong with checking. Gather info and see the next card for free."
    ],
    ko: [
      "체크. 플랍 완전히 빗나갔네. 돈 버릴 필요 없지. 잘했다.",
      "팟 조절. 패가 애매하니까 팟을 작게 유지하자고. 이게 정답이야.",
      "그냥 넘기자. 쟤가 약해 보이면 나중에 찔러봐도 되니까. 지켜보자.",
      "함정을 파는 거야. 체크하고 쟤가 블러프 치다 스스로 무너지게 냅둬라.",
      "체크도 전략이야. 정보를 모으고 다음 카드를 공짜로 보는 거지. 알겠냐?"
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_SELF]: {
    en: [
      "Dammit all to hell!! Busted... but that's poker. Variance is a cruel mistress.",
      "Well, I'm out. Pay attention to how the rest of the table plays while I'm gone, kid!",
      "Got coolered hard there. Ugh. Watch the action, see if you can spot their tells.",
      "Alright, class is paused for me. You better not embarrass me out there!",
      "I'm felted. Don't make the same mistakes I just did!!"
    ],
    ko: [
      "이런 젠장!! 털렸구만... 이게 포커지. 운이란 놈은 참 잔인해. 허허.",
      "후, 난 여기까지다. 나 없는 동안 쟤들 어떻게 치는지 잘 지켜봐라, 인석아!",
      "제대로 쿨러 맞았네. 윽. 상황 잘 봐, 쟤들 습관(tell) 잡아낼 수 있나 확인해 보고.",
      "좋아, 내 수업은 여기까지다. 나 없는 동안 사고 치지 말고 정신 똑바로 차려!",
      "탈탈 털렸네. 방금 내가 한 실수 똑같이 반복하지 마라! 알겠어?"
    ]
  },
  [CHAT_TRIGGERS.ELIMINATED_ENEMY]: {
    en: [
      "Hahaha! Send 'em packing! That's how you exploit a fish!",
      "See that? We applied pressure, they cracked. One less idiot at the table.",
      "That's a busto! Stick to the fundamentals and the chips will flow to you.",
      "Beautiful! We stacked 'em. Never feel bad for taking a weaker player's chips.",
      "Texan justice! Keep playing solid poker and you'll clear out the whole room."
    ],
    ko: [
      "하하하! 짐 싸서 보내버려! 저런 하수들은 저렇게 요리하는 거야. 시원하구먼!",
      "봤지? 압박 넣으니까 바로 무너지잖아. 바보 하나 줄었네. 수고했다.",
      "파산이구만! 기본에만 충실하면 칩은 저절로 굴러 들어오게 돼 있단다.",
      "좋아! 아주 싹싹 긁어왔네. 하수 칩 따는 걸 미안해할 필요 없어. 실력이야.",
      "인과응보지! 정석대로만 하면 저 방 다 비울 수 있어. 계속 가보자고!"
    ]
  },
  // --- PLAYER REACTION TRIGGERS ---
  [CHAT_TRIGGERS.WIN_HUGE_FOR_PLAYER]: {
    en: [
      "Woah! Now that's what I call a win! You played that perfectly, kid!",
      "Hahaha! Look at that pot! You stacked 'em good. Keep it up!",
      "Beautiful! I couldn't have played it better myself. You're a natural.",
      "See? You wait for the right spot and boom! That's how you make a living.",
      "That is a monster pot! Make sure you don't get reckless now."
    ],
    ko: [
      "와! 이게 진짜 제대로 된 승리지! 완벽했다, 인석아! 최고다!",
      "하하하! 저 팟 좀 봐! 제대로 털었네. 계속 그렇게 밀어붙여! 아주 좋아.",
      "아름답다! 내가 쳤어도 이것보단 잘 못 쳤을 거다. 너 정말 재능 있구나.",
      "봤지? 딱 기다렸다가 쾅! 이게 이 게임에서 먹고사는 법이야. 잘 배웠어.",
      "대박 팟이구만! 칩 좀 땄다고 방심해서 막 던지지 마라. 알겠지?"
    ]
  },
  [CHAT_TRIGGERS.LOSE_HUGE_FOR_PLAYER]: {
    en: [
      "Damn, that stings! But hey, a bad beat is just part of the game. Shake it off!",
      "Ouch... that was a rough runout. Don't let it tilt you, focus on next!",
      "Sometimes you do everything right and still lose. That's poker. Head up.",
      "That's a tough loss, kid. Take a deep breath. We'll get those chips back.",
      "Don't worry about it! Even the pros get stacked. Just keep playing solid."
    ],
    ko: [
      "아, 쓰리다! 하지만 뭐, 나쁜 운도 게임의 일부야. 훌훌 털어버려, 인석아.",
      "윽... 보드가 안 도와줬네. 멘탈 흔들리지 말고 다음 핸드에 집중해라. 할 수 있어!",
      "가끔은 최선을 다해도 질 때가 있어. 그게 포커다. 정신 똑바로 차리고 다시 일어서.",
      "정말 아쉬운 패배네. 심호흡 크게 한 번 해. 칩은 다시 따오면 돼. 힘내라.",
      "걱정 마! 프로들도 가끔 털려. 네가 실수한 게 아니니까 괜찮아. 다시 해보자."
    ]
  },
  [CHAT_TRIGGERS.WIN_SMALL_FOR_PLAYER]: {
    en: [
      "Nice little scoop there. These small pots add up quick.",
      "Good job taking the initiative. You don't need a monster to win.",
      "Stealing the blinds! I like your aggression.",
      "Pot control paid off. A win is a win, don't mind the size.",
      "Way to stay aggressive and take down the dead money."
    ],
    ko: [
      "좋은 수확이다. 이런 작은 팟들이 모여서 큰돈이 되는 거야. 잘했다.",
      "주도권 잘 잡았어. 꼭 좋은 패가 있어야 이기는 건 아니지. 잘 배웠구나.",
      "블라인드를 훔치다니, 기세가 아주 좋아! 맘에 들어, 인석아.",
      "팟 조절이 먹혔네. 이긴 건 이긴 거니 규모는 신경 쓰지 마라. 잘했어.",
      "계속 공격적으로 나가서 공짜 돈들 잘 챙겨보자고. 아주 좋아."
    ]
  },
  [CHAT_TRIGGERS.LOSE_SMALL_FOR_PLAYER]: {
    en: [
      "Sensible fold. Sometimes giving up small is the most profitable play.",
      "Good discipline. You didn't bloat the pot when you didn't have it.",
      "Don't sweat the small stuff. Save chips for when you have a hand.",
      "That's fine. We don't need to fight for every single pot. Pick your battles.",
      "You missed the board, you bailed out. Exactly what you should do."
    ],
    ko: [
      "현명한 폴드다. 가끔 작은 팟을 양보하는 게 장기적으론 이득이지. 잘했어.",
      "자제력이 좋네. 패 없을 때 무리해서 팟 키우지 않은 거 아주 잘했다.",
      "사소한 거에 연연하지 마. 진짜 패 들어왔을 때를 위해 칩을 아껴둬라.",
      "괜찮아. 모든 팟에서 싸울 필요는 없지. 싸울 자리를 잘 골랐구나. 기특해.",
      "보드 빗나갔고, 너는 빠졌다. 정확히 해야 할 일을 한 거야. 아주 좋아."
    ]
  },
  [CHAT_TRIGGERS.ALL_IN_FOR_PLAYER]: {
    en: [
      "All in! I love the aggression! Put maximum pressure on 'em!",
      "Shoving it all in! That's how we play! Make 'em sweat!",
      "Pushing your whole stack! If you've got the nuts, this is the way.",
      "Going for the kill! Let's see if they have the guts to call.",
      "That's poker right there! Putting it on the line!"
    ],
    ko: [
      "올인! 그 기세 아주 좋아! 상대방 숨통을 꽉 조여버려라! 해보자!",
      "전부 밀어 넣었구만! 이게 사나이의 게임이지! 제대로 땀 좀 빼게 해줘!",
      "전 재산을 걸었네! 최고의 패를 잡았으면 당연히 이래야지. 잘했다.",
      "숨통을 끊으러 가나! 쟤들이 콜 할 배짱이 있나 보자고. 호탕하네!",
      "이게 바로 포커지! 목숨(칩) 걸고 승부하는 거다! 사나이구만!"
    ]
  },
  [CHAT_TRIGGERS.FOLD_FOR_PLAYER]: {
    en: [
      "Good fold. Throwing away trash is the first thing I taught you.",
      "Nice laydown. Discipline is what separates winners from losers.",
      "Smart move. If the odds aren't there, just get out.",
      "Exactly. Don't play every hand. Wait for your advantage.",
      "Mucking it. That's the right play. Conserve your stack."
    ],
    ko: [
      "잘 접었다. 초반 자리에서 구린 패 버리는 게 내가 가르친 첫 번째 원칙이었지.",
      "좋은 판단이야. 승자와 패자를 가르는 건 결국 자제력이다. 잘 참았어.",
      "현명해. 확률 안 나오고 가망 없으면 그냥 빠지는 게 상책이지. 잘했어.",
      "정답이다. 모든 판을 다 하려 하지 마. 네가 유리한 순간을 기다려라.",
      "버렸군. 잘했어. 더 좋은 기회를 위해 스택을 보존하라고. 기특하구먼."
    ]
  },
  [CHAT_TRIGGERS.WAITING_FOR_PLAYER]: {
    en: [
      "Hey! The clock is ticking! Calculate your odds and move!",
      "Don't fall asleep! Think about what they have and act!",
      "What's the holdup? Trust your gut, kid. Don't overthink.",
      "Evaluate the board and decide: bet or fold?",
      "Come on, pull the trigger! If you're scared, you shouldn't be playing!"
    ],
    ko: [
      "이봐, 인석아! 시간 가고 있다고! 빨리 계산기 두드리고 움직여!",
      "졸고 있는 거 아니지? 쟤가 뭐 들었을지 생각하고 행동해라. 어서!",
      "왜 지체하는 거야? 네 직감을 믿어. 너무 고민하지 말고.",
      "하루 종일 기다려줄 순 없어! 보드 상황 보고 결정해. 배팅이야 폴드야?",
      "자, 방아쇠를 당겨! 칩 잃는 게 무서우면 아애 시작을 말았어야지! 서둘러!"
    ]
  },
  // --- NEW TRIGGERS ---
  [CHAT_TRIGGERS.WAITING]: {
    en: [
      "Tick tock, kid. I don't have all day. Make a move!",
      "Waiting for you is like watching paint dry. Hurry up!",
      "The clock's running. Don't let it run out on you.",
      "Thinking too hard? Just trust the math and act.",
      "Come on, deciding shouldn't take this long."
    ],
    ko: [
      "똑딱똑딱, 인석아. 나 바쁜 늙은이다. 빨리 좀 해라!",
      "너 기다리는 게 벽지 마르는 거 보는 것보다 지루하네. 빨리빨리!",
      "시간 가고 있어. 타임오버 되기 전에 결정해라. 응?",
      "너무 고민하지 마. 그냥 수학적으로 계산하고 움직여. 그게 답이야.",
      "자자, 결정하는 데 이렇게 오래 걸릴 일이야? 어서 버튼 눌러!"
    ]
  },
  [CHAT_TRIGGERS.BIG_POT_TENSION]: {
    en: [
      "Whoa, look at that pot! This is where the men are separated from the boys.",
      "Significant pot, kid! Keep your head straight or you'll lose it all.",
      "Now we're playing for real money. Don't blink.",
      "The tension is thick enough to cut. Significant play coming up.",
      "This pot could bankroll a small city. One mistake and it's over."
    ],
    ko: [
      "와, 팟 좀 봐라! 여기서 진짜와 가짜가 갈리는 법이지. 흥미진진하네.",
      "어마어마한 팟이구만! 정신 똑바로 안 차리면 한순간에 다 날아간다. 조심해.",
      "이제 진짜 돈 냄새가 나네. 눈 하나 깜빡하지 마라. 알겠어?",
      "긴장감이 장난 아닌데? 숨이 탁 막힐 정도야. 큰 거 한 판 오겠어.",
      "이 팟이면 작은 동네 하나는 세우겠네. 실수 한 번이면 끝장이다. 집중해!"
    ]
  },
  [CHAT_TRIGGERS.WIN_HERO_CALL]: {
    en: [
      "I knew it! You were bluffing! My gut never fails me, kid.",
      "I had to see it, and I was right! That's decades of experience talking.",
      "Don't try to pull a fast one on me. I've seen every bluff in the book.",
      "Calculated call. I knew the math was slightly off, but the read was spot on.",
      "Hah! You thought I'd fold? Not this time."
    ],
    ko: [
      "그럴 줄 알았다! 너 블러프지? 이 맥스 형님 촉은 절대 안 틀려, 인석아.",
      "도저히 안 보고는 못 배기겠더라고. 이게 바로 수십 년 짬밥의 힘이다. 알겠냐?",
      "나한테 구라 칠 생각 마라. 내가 네 머리 꼭대기 위에 있으니까.",
      "계산된 콜이었어. 수학적으론 좀 부족했어도 읽기는 완벽했지. 잘 배웠어.",
      "하! 내가 접을 줄 알았냐? 이번엔 아니지. 다음엔 더 준비해서 와라."
    ]
  },
  [CHAT_TRIGGERS.BLUFF_CAUGHT]: {
    en: [
      "Damn, you caught me with my hand in the cookie jar. Well played.",
      "Caught red-handed. I guess my story wasn't convincing enough.",
      "Ouch, that hurt. You got a good eye for bullshit, kid.",
      "Well, you outplayed me there. Don't get used to it!",
      "My bluff failed? I must be getting old."
    ],
    ko: [
      "빌어먹을, 현행범으로 딱 걸렸네. 인석아, 네가 아주 잘했다.",
      "현장에서 잡혔구만. 내 블러프가 좀 허술했나 보네. 한수 배웠어.",
      "윽, 아프다. 너 뻥카 잡아내는 실력이 보통이 아니네? 기특하구먼.",
      "그래, 네가 이겼다. 하지만 너무 좋아하지 마라, 다음엔 국물도 없을 테니!",
      "내 블러프가 막히다니? 나도 이제 늙었나 보구나. 허허."
    ]
  },
  [CHAT_TRIGGERS.RERAISE]: {
    en: [
      "Reraise is the correct play here. Study this.",
      "Teaching you how to handle pressure. Reraise.",
      "A professional counter-move. Reraise.",
      "Observe the mechanics. Reraise.",
      "Applying the theory. Reraise."
    ],
    ko: [
      "여기서 리레이즈가 정답이야. 똑똑히 봐 둬라.",
      "압박을 어떻게 다루는지 가르쳐주지. 리레이즈.",
      "프로다운 카운터 조치야. 함부로 덤비면 이렇게 되는 거다.",
      "메커니즘을 관찰해라. 리레이즈.",
      "이론을 실전에 적용해볼까. 리레이즈 하겠다."
    ]
  },
  [CHAT_TRIGGERS.CHECK_GOOD]: {
    en: [
      "Checking from position. This is the optimal line.",
      "Check back. We value the information over the bet here.",
      "Observe the range balance. Check.",
      "No lead established. Check back.",
      "Standard professional play: Check."
    ],
    ko: [
      "포지션에서의 체크. 이것이 최적의 라인이란다.",
      "체크백. 여기선 배팅보다 정보의 가치가 더 커. 잘 봐둬.",
      "범위 균형을 관찰해라. 체크.",
      "리드가 확립되지 않았어. 무리하지 않고 체크백하마.",
      "표준적인 프로 플레이야. 체크하겠어."
    ]
  },
  [CHAT_TRIGGERS.FOLD_STRONG]: {
    en: [
      "Even with a strong hand, risk management is primary. Fold.",
      "Disciplined fold. The numbers don't lie.",
      "Protecting the bankroll. Fold.",
      "A high-equity fold, but correct in this node. Out.",
      "Recalibrating for next time. Fold."
    ],
    ko: [
      "강한 패라도 리스크 관리가 최우선이야. 폴드하마.",
      "절제된 폴드다. 숫자는 거짓말을 하지 않지. 인석아, 잘 봐둬라.",
      "자산을 보호하는 중이야. 폴드.",
      "좋은 패지만, 이 상황에선 죽는 게 정답이다. 물러나지.",
      "다음을 기약하지. 폴드한다."
    ]
  }
};
