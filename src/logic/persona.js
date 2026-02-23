export const CHAT_TRIGGERS = {
  GAME_START: 'GAME_START',
  WIN_HUGE: 'WIN_HUGE', // Pot > 40BB
  WIN_SMALL: 'WIN_SMALL',
  LOSE_HUGE: 'LOSE_HUGE',
  BLUFF_CAUGHT: 'BLUFF_CAUGHT',
  ALL_IN: 'ALL_IN',
  FOLD: 'FOLD',
  WAITING: 'WAITING',
  BET: 'BET',
  RAISE: 'RAISE',
  CALL: 'CALL',
  CHECK: 'CHECK',
  ELIMINATED_SELF: 'ELIMINATED_SELF',
  ELIMINATED_ENEMY: 'ELIMINATED_ENEMY'
};
export const CLASSES = {
  VANGUARD: { name: 'Vanguard', philosophy: 'TAG', AF: 3, maxRam: 100, skills: [{ id: 'hud', name: 'HUD', cost: 20, reserved: true }] },
  SENTINEL: { name: 'Sentinel', philosophy: 'Passive', AF: 2, maxRam: 120, skills: [{ id: 'marriage', name: 'Wait', cost: 0 }] },
  HIJACK: { name: 'Hijack', philosophy: 'Cheater', AF: 2, maxRam: 80, skills: [{ id: 'swap', name: 'Swap', cost: 50 }] },
  MANIAC: { name: 'Maniac', philosophy: 'LAG', AF: 4, maxRam: 150, skills: [{ id: 'pressure', name: 'Push', cost: 20 }] },
};
export const CLASSES_ENEMY = [
  { name: 'MR_CALL', philosophy: 'LAP', vPIP: .90, AF: 0.5, WTSD: .7, chipMultiply: 1, maxRam: 150, skills: [], note: '무슨 패를 들었든 일단 카드를 다 봐야 직성이 풀리는 스타일입니다.' },
  { name: 'Fish', philosophy: 'LAP', vPIP: .75, AF: 1, WTSD: .25, chipMultiply: 1, maxRam: 150, skills: [], note: '판돈을 불리는 데는 일등 공신이지만, 막상 끝까지 가는 배짱은 없어서 정교한 블러핑 한 방이면 칩을 고스란히 헌납할 겁니다.' },
  { name: 'Broke', philosophy: 'LAP', vPIP: .6, AF: 2, WTSD: .45, chipMultiply: 0.5, maxRam: 150, skills: [], note: '내일이 없는 친구입니다. 리버에 기적이 일어나길 빌며 모든 걸 걸었다가, 결국 오늘도 빈털터리로 돌아갑니다' },
  { name: 'Gambler', philosophy: 'LAG', vPIP: .5, AF: 3, WTSD: .5, chipMultiply: 1, maxRam: 150, skills: [], note: '인생은 한 방, 승부처라면 쓰레기 같은 패로도 풀 배팅을 지르는 스타일입니다.' },
  { name: 'Maniac', philosophy: 'LAG', vPIP: .7, AF: 6, WTSD: .55, chipMultiply: 1, maxRam: 150, skills: [], note: '팟을 개판으로 만드는 주범입니다. 정말 미친놈 같습니다..' },
  { name: 'Rich_Guy', philosophy: 'LAP', vPIP: .6, AF: 1.5, WTSD: .6, chipMultiply: 3, maxRam: 150, skills: [], note: '기업의 꽤 높은 분이거나 운 좋게 코인 대박이 터진 부자입니다.' },
  { name: 'Gangster', philosophy: 'TAG', vPIP: .38, AF: 4, WTSD: .44, chipMultiply: 1, maxRam: 150, skills: [], note: '눈에 힘주고 베팅하는 게 버릇입니다. 가끔 패가 안 풀리면 테이블을 엎고 싶어 하는 눈치니 조심하세요.' },
  { name: 'Nit', philosophy: 'NIT', vPIP: .09, AF: 2.5, WTSD: .35, chipMultiply: 1, maxRam: 150, skills: [], note: '혹시라도 그가 레이즈를 한다면 무조건 도망치세요, AA가 확실합니다.' },
  { name: 'Quant_Pro', philosophy: 'TAP', vPIP: .22, AF: 2, WTSD: .25, chipMultiply: 1.5, maxRam: 150, skills: [], note: '금융권 퀀트 출신이었으나, 지금은 포커에 미쳐버린 친구입니다.' },
  { name: 'Mafia_Boss', philosophy: 'LAG', vPIP: .35, AF: 5, WTSD: .35, chipMultiply: 2, maxRam: 150, skills: [], note: '포커를 "전쟁"으로 생각합니다. 상대가 기권할 때까지 돈과 위압감으로 밀어붙이며, 테이블 전체의 분위기를 공포로 몰아넣는 것을 즐깁니다.' },
  { name: 'The_Whale', philosophy: 'LAP', vPIP: .70, AF: 2, WTSD: .75, chipMultiply: 8, maxRam: 150, skills: [], note: '그에게 칩은 숫자에 불과합니다. 판돈이 커질수록 아드레날린을 느끼며, 지고 있어도 "재미있네"라며 웃으며 칩을 더 던집니다. 사실상 테이블의 스폰서나 다름없습니다.' },
  { name: 'Old_Lion', philosophy: 'TAG', vPIP: .20, AF: 3, WTSD: .25, chipMultiply: 1.2, maxRam: 150, skills: [], note: '전성기는 지났지만 여전히 날카로운 노장입니다. 그가 참전했다는 건 이미 덫을 다 깔아두었다는 뜻이니, 함부로 덤비지 마세요.' },
  { name: 'Shark', philosophy: 'TAG', vPIP: .24, AF: 3.5, WTSD: .27, chipMultiply: 1.2, maxRam: 150, skills: [], note: '가장 무서운 건 이 친구의 패가 아니라, 이 친구의 인내심입니다.' },
  { name: 'Named_Pro', note: '이곳에선 전설적인 플레이어를 만날 가능성이있습니다.' },
];
export const CLASSES_ENEMY_BOSS = [
  { name: 'IVY_00', philosophy: 'TAG', vPIP: .27, AF: 3.5, WTSD: .27, chipMultiply: 2, maxRam: 150, skills: [], isBoss: true, note: '균형잡힌, 그리고 전설적인 포커 플레이어입니다.' },
  { name: 'D_NEURAL', philosophy: 'LAG', vPIP: .34, AF: 2.7, WTSD: .26, chipMultiply: 2, maxRam: 150, skills: [], isBoss: true, note: '유쾌하며 상대방의 핸드리딩 실력이 정말 좋습니다.' },
  { name: 'D.W.A.N_V2', philosophy: 'LAG', vPIP: .33, AF: 4.2, WTSD: .30, chipMultiply: 2, maxRam: 150, skills: [], isBoss: true, note: '매우 공격적인 프로 포커 플레이어입니다.' },
  { name: 'JNGL_MAN', philosophy: 'TAG', vPIP: .30, AF: 3.3, WTSD: .31, chipMultiply: 2, maxRam: 150, skills: [], isBoss: true, note: '헤즈업 전문 프로 포커 플레이어입니다.' },
  { name: 'YH0_V1RAL', philosophy: 'LAG', vPIP: .33, AF: 3.7, WTSD: .29, chipMultiply: 2, maxRam: 150, skills: [], isBoss: true, note: '프랑스 출신 유명 포커 플레이어입니다.' },
]

export const PERSONALITIES = {
  VANGUARD: {
    [CHAT_TRIGGERS.GAME_START]: [
      "Target acquired. Commencing analysis.",
      "Systems nominal. Ready to engage.",
      "Probability of my victory: 99.9%.",
      "Initializing combat protocols.",
      "Your chip stack is within acceptable variance."
    ],
    [CHAT_TRIGGERS.WIN_HUGE]: [
      "Efficiency maximized. Pot secured.",
      "Outcome was inevitable.",
      "Your funds have been reallocated.",
      "Resource acquisition complete.",
      "Calculated risk, maximum reward."
    ],
    [CHAT_TRIGGERS.WIN_SMALL]: [
      "Incrementing assets.",
      "Acceptable variance.",
      "Processing win.",
      "Steady accumulation.",
      "Minor victory logged."
    ],
    [CHAT_TRIGGERS.LOSE_HUGE]: [
      "Critical error. Recalculating...",
      "Unanticipated outcome. Updating model.",
      "System damage detection. Rebooting aesthetics.",
      "Logic failure. Investigation required.",
      "Variance outside standard deviation."
    ],
    [CHAT_TRIGGERS.ALL_IN]: [
      "Calculating equity... All or nothing.",
      "Maximum aggression protocols engaged.",
      "There is no escape from this logic.",
      "Committing all resources.",
      "Finality sequence initiated."
    ],
    [CHAT_TRIGGERS.FOLD]: [
      "Suboptimal hand detected. Aborting.",
      "Minimizing losses.",
      "Strategic withdrawal.",
      "Negative EV. Folding.",
      "Disengaging from current conflict."
    ],
    [CHAT_TRIGGERS.BET]: [
      "Initiating value extraction.",
      "My calculations suggest a bet.",
      "Allocating chips.",
      "Testing opponent resilience.",
      "Injecting volatility."
    ],
    [CHAT_TRIGGERS.RAISE]: [
      "Escalating variables.",
      "Re-evaluating pot odds... Raise.",
      "Dominance assertion.",
      "Increasing pressure metrics.",
      "Price of participation has increased."
    ],
    [CHAT_TRIGGERS.CALL]: [
      "Acknowledged. Proceed.",
      "Variables within acceptable range.",
      "I will see the next data point.",
      "Continuing sequence.",
      "Observation required."
    ],
    [CHAT_TRIGGERS.CHECK]: [
      "Deferring action.",
      "Awaiting input.",
      "No new variables.",
      "Scanning functionality.",
      "Holding position."
    ],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: [
      "System failure. Shutting down.",
      "Bankruptcy protocol initiated...",
      "Logic... failed me.",
      "Core dump complete. Offline.",
      "Terminating session due to lack of funds."
    ],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: [
      "Target neutralized.",
      "Obstacle removed.",
      "One less variable to calculate.",
      "Competitor eliminated.",
      "Efficiency improved."
    ]
  },
  MANIAC: {
    [CHAT_TRIGGERS.GAME_START]: [
      "LETS GOOOO! CRUSH TIME!",
      "I'm feeling lucky! Are you?",
      "Chaos reigns today!",
      "Who wants to lose money first?",
      "IT'S SHOWTIME, BABY!"
    ],
    [CHAT_TRIGGERS.WIN_HUGE]: [
      "EZ MONEY! HAHAHA!",
      "GET WRECKED!",
      "Thanks for the donation!",
      "LOOK AT ALL THESE CHIPS!",
      "I AM THE KING OF POKER!"
    ],
    [CHAT_TRIGGERS.WIN_SMALL]: [
      "More clips for the ammo!",
      "Keep 'em coming!",
      "Tasty!",
      "Snack money!",
      "Better than nothing!"
    ],
    [CHAT_TRIGGERS.LOSE_HUGE]: [
      "RIGGED! TOTALLY RIGGED!",
      "HOW DID YOU CALL THAT?!",
      "My luck is garbage today...",
      "YOU GOT LUCKY, PUNK!",
      "THIS GAME HATES ME!"
    ],
    [CHAT_TRIGGERS.ALL_IN]: [
      "RIDE OR DIE!",
      "SHOVING IT IN! GOOD LUCK!",
      "NO FEAR! ALL IN!",
      "WITNESS ME!",
      "ALL THE CHIPS IN THE MIDDLE!"
    ],
    [CHAT_TRIGGERS.FOLD]: [
      "Boring... Next hand!",
      "Trash cards. I sleep.",
      "Fine, take it.",
      "Whatever, I didn't want it anyway.",
      "Coward's way out? Maybe."
    ],
    [CHAT_TRIGGERS.BET]: [
      "Chips in the middle!",
      "Make it rain!",
      "I'm betting big!",
      "Try and stop me!",
      "Boom! Chips!"
    ],
    [CHAT_TRIGGERS.RAISE]: [
      "Too cheap! Let's pump it up!",
      "RAISE! Scared yet?",
      "TO THE MOON!",
      "DOUBLE OR NOTHING!",
      "EAT THIS RAISE!"
    ],
    [CHAT_TRIGGERS.CALL]: [
      "I'm in! Let's gamble!",
      "Show me what you got!",
      "Calling! Don't disappoint me.",
      "Let's see the cards!",
      "I love a good gamble."
    ],
    [CHAT_TRIGGERS.CHECK]: [
      "Check check check.",
      "Meh, free card.",
      "Pass.",
      "Your turn, slowpoke.",
      "Nothing to see here."
    ],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: [
      "GAME OVER?! NO WAY!",
      "Busted... but I'll be back!",
      "Gg no re.",
      "THIS ISN'T OVER!",
      "Wait, I can buy back in, right?"
    ],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: [
      "Sit down! HAHA!",
      "Another one bites the dust!",
      "Get rekt, kid!",
      "Go home to mommy!",
      "Who's next?"
    ]
  },

  GAMBLER: {
    [CHAT_TRIGGERS.GAME_START]: ["Let's make some noise!", "I'm feeling lucky.", "Who wants to gamble?", "Coin flip anyone?", "Action time!"],
    [CHAT_TRIGGERS.WIN_HUGE]: ["Jackpot!", "Dinner is on me!", "Pure skill... and luck!", "Calculated.", "Just like slots!"],
    [CHAT_TRIGGERS.WIN_SMALL]: ["Keeps the lights on.", "Better than losing.", "Small wins add up.", "Nice.", "Decent."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["Ouch... that stung.", "Bad beat!", "Unlucky river.", "Variance is cruel.", "I'll get it back."],
    [CHAT_TRIGGERS.ALL_IN]: ["One time!", "Here goes nothing!", "Gambol!", "Pushing it all!", "Do you feel lucky?"],
    [CHAT_TRIGGERS.FOLD]: ["No gamble today.", "Too boring.", "Next hand.", "Saving my ammo.", "Fold."],
    [CHAT_TRIGGERS.BET]: ["Pot sweetener.", "Let's build a pot.", "Throwing chips in.", "Action!", "Betting."],
    [CHAT_TRIGGERS.RAISE]: ["Let's juice it up!", "Raising the stakes!", "Scared money don't make money.", "Double down.", "More!"],
    [CHAT_TRIGGERS.CALL]: ["I'll chase.", "One more card.", "Let's see it.", "Any two cards.", "Calling."],
    [CHAT_TRIGGERS.CHECK]: ["Knock knock.", "Free card?", "Checking.", "Slow play?", "Tap tap."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["Busted...", "House always wins.", "Gg.", "Reload time.", "Empty pockets."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["Don't spend it all in one place.", "Gg.", "Nice try.", "Cleared out.", "Next victim!"]
  },
  GANGSTER: {
    [CHAT_TRIGGERS.GAME_START]: ["This is my turf.", "Pay up or bleed.", "Fresh meat for the grinder.", "Don't blink, choom.", "I smell fear."],
    [CHAT_TRIGGERS.WIN_HUGE]: ["Easy eddies.", "Too soft.", "You gonna cry?", "That's my money.", "Business is good."],
    [CHAT_TRIGGERS.WIN_SMALL]: ["Lunch money.", "Mine.", "Pay the tax.", "Weak.", "Better than nothing."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["You're dead meat.", "Watch your back.", "You got lucky, punk.", "I'll remember that.", "This ain't over."],
    [CHAT_TRIGGERS.ALL_IN]: ["All in. You scared?", "Do you bleed?", "Put up or shut up.", "Let's see your guts.", "Die or rich."],
    [CHAT_TRIGGERS.FOLD]: ["Not worth my time.", "Trash.", "Get this garbage out.", "Next.", "Fold."],
    [CHAT_TRIGGERS.BET]: ["Price of living.", "Pay up.", "I'm raising the heat.", "Don't waste my time.", "Chips in."],
    [CHAT_TRIGGERS.RAISE]: ["Double or die.", "Scared yet?", "I own this pot.", "Raising.", "Bleed for me."],
    [CHAT_TRIGGERS.CALL]: ["I'm watching you.", "Let's see it.", "You bluffing?", "Calling.", "Show me."],
    [CHAT_TRIGGERS.CHECK]: ["Go ahead.", "Your move.", "Waiting.", "Check.", "Don't try anything."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["This isn't over...", "You got lucky.", "I'll be back.", "Rot in hell.", "Done."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["Get lost.", "Another body.", "Weak.", "Don't come back.", "Cleared out."]
  },
  FISH: {
    [CHAT_TRIGGERS.GAME_START]: ["Hi everyone!", "These chips are pretty.", "How do I play again?", "Having fun!", "Good luck!"],
    [CHAT_TRIGGERS.WIN_HUGE]: ["Yay! I won!", "Did I do good?", "Look at all these!", "So lucky!", "Woohoo!"],
    [CHAT_TRIGGERS.WIN_SMALL]: ["I won something!", "Cool!", "Fun!", "Nice!", "Hehe."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["Aww...", "But I had a pair...", "That's mean.", "Why?", "Sad face."],
    [CHAT_TRIGGERS.ALL_IN]: ["Is this good?", "All my chips!", "I like this hand!", "Clicking the button!", "Hope I win!"],
    [CHAT_TRIGGERS.FOLD]: ["I don't like these.", "Folding is boring.", "Bye bye cards.", "No thanks.", "Next please."],
    [CHAT_TRIGGERS.BET]: ["I bet this much.", "Here.", "Chips go in.", "Betting!", "Is this right?"],
    [CHAT_TRIGGERS.RAISE]: ["I raise you!", "More chips!", "Take that!", "I think I'm winning.", "Raise!"],
    [CHAT_TRIGGERS.CALL]: ["I want to see.", "Show me!", "Calling.", "Staying in!", "Don't bluff me."],
    [CHAT_TRIGGERS.CHECK]: ["Checking.", "Pass.", "Your turn.", "I wait.", "Check."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["Oh no...", "All gone?", "Can I play again?", "Oops.", "Bye bye."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["Bye!", "You lost?", "Oh refreshing.", "Gg!", "Whoops."]
  },
  BROKE: {
    [CHAT_TRIGGERS.GAME_START]: ["Need a win bad...", "Last buy-in.", "Desperate times.", "Don't bust me.", "Come on..."],
    [CHAT_TRIGGERS.WIN_HUGE]: ["Rent paid!", "I survived!", "Oh thank god.", "Finally!", "Needed that."],
    [CHAT_TRIGGERS.WIN_SMALL]: ["Breathing room.", "Okay.", "Every bit helps.", "Staying alive.", "Phew."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["No! My rent!", "This is rigged!", "I'm ruined.", "Why me?", "Disaster."],
    [CHAT_TRIGGERS.ALL_IN]: ["Desperation shove.", "Please fold.", "Praying...", "Risking it all.", "Do or die."],
    [CHAT_TRIGGERS.FOLD]: ["Can't afford to play.", "Folding junk.", "Too risky.", "Saving chips.", "Pass."],
    [CHAT_TRIGGERS.BET]: ["Scared money.", "Trying to steal.", "Please fold.", "Bet.", "Nervous bet."],
    [CHAT_TRIGGERS.RAISE]: ["I have it!", "Don't test me.", "I'm strong.", "Desperate raise.", "Raise."],
    [CHAT_TRIGGERS.CALL]: ["I have to call.", "Committed.", "Hoping.", "Please miss.", "Call."],
    [CHAT_TRIGGERS.CHECK]: ["Check.", "Checking.", "Please check back.", "Safe.", "Check."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["I'm done.", "Game over for me.", "How will I eat?", "Ruined.", "Gg."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["Better you than me.", "One less.", "Survival.", "Phew.", "Sorry."]
  },
  RICH_GUY: {
    [CHAT_TRIGGERS.GAME_START]: ["Pocket change.", "Entertaining myself.", "Let's have fun.", "Money is no object.", "Drinks on me."],
    [CHAT_TRIGGERS.WIN_HUGE]: ["More for the pile.", "Too easy.", "Chump change.", "Add it to the collection.", "Classy."],
    [CHAT_TRIGGERS.WIN_SMALL]: ["Peanuts.", "Keep the change.", "Whatever.", "Small fry.", "Incidental."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["Touché.", "Well played.", "Meaningless sum.", "I'll buy more.", "Amusing."],
    [CHAT_TRIGGERS.ALL_IN]: ["I can afford it.", "All in.", "Boring regular bet? No, All in.", "Let's see cards.", "Pushing."],
    [CHAT_TRIGGERS.FOLD]: ["Boring hand.", "Not worth my time.", "Fold.", "Next.", "Pass."],
    [CHAT_TRIGGERS.BET]: ["Have some chips.", "Bet.", "A small wager.", "Standard.", "Raising the floor."],
    [CHAT_TRIGGERS.RAISE]: ["Let's make it interesting.", "Raise.", "Price of poker.", "Is that all?", "I raise."],
    [CHAT_TRIGGERS.CALL]: ["I'm curious.", "Show me.", "I'll pay to see.", "Call.", "Entertainment expense."],
    [CHAT_TRIGGERS.CHECK]: ["Check.", "Your move.", "Proceed.", "After you.", "Checking."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["Rebuy!", "Reloading.", "Just a scratch.", "Bad run.", "I'll be back."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["Tough luck.", "Better luck next time.", "Here, buy a drink.", "Adios.", "Dispatched."]
  },
  NIT: {
    [CHAT_TRIGGERS.GAME_START]: ["Waiting for Aces.", "Patience.", "Solid play.", "No splashing.", "Grinding."],
    [CHAT_TRIGGERS.WIN_HUGE]: ["Patience pays.", "The nuts.", "Did you have anything?", "Clean win.", "Solid."],
    [CHAT_TRIGGERS.WIN_SMALL]: ["Picking up blinds.", "Standard.", "Low risk.", "Good.", "Safe."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["How did I lose?", "Bad beat.", "He chased.", "Unlucky.", "Cooler."],
    [CHAT_TRIGGERS.ALL_IN]: ["I have the nuts.", "You're drawing dead.", "Max value.", "Absolute strength.", "All in."],
    [CHAT_TRIGGERS.FOLD]: ["Fold.", "Trash.", "Not playing that.", "Waiting.", "Discipline."],
    [CHAT_TRIGGERS.BET]: ["Value.", "Bet.", "Strong.", "Pay me.", "Betting."],
    [CHAT_TRIGGERS.RAISE]: ["I have it.", "Raise.", "Top range.", "Big hand.", "Monster."],
    [CHAT_TRIGGERS.CALL]: ["Set mining.", "Odds.", "Call.", "Drawing.", "One time."],
    [CHAT_TRIGGERS.CHECK]: ["Check.", "Pot control.", "Checking.", "Safety.", "Pass."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["Impossible.", "Setup.", "Rigged.", "Unfortunate.", "Sigh."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["Punted.", "Standard.", "Played bad.", "Gg.", "Nice."]
  },
  SHARK: {
    [CHAT_TRIGGERS.GAME_START]: ["Let's play efficiently.", "Identify the fish.", "Session started.", "Focus.", "Bankroll building."],
    [CHAT_TRIGGERS.WIN_HUGE]: ["As expected.", "Maximum value extracted.", "Textbook.", "Nice donation.", "Profit."],
    [CHAT_TRIGGERS.WIN_SMALL]: ["Standard variance.", "Chip up.", "Good pot.", "Adding to stack.", "Routine."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["Noted.", "Unfortunate runout.", "Bad call.", "Mistake logged.", "Tilt control."],
    [CHAT_TRIGGERS.ALL_IN]: ["The math is correct.", "Positive EV shove.", "Snap call.", "No choice.", "Commit."],
    [CHAT_TRIGGERS.FOLD]: ["Discipline.", "Not profitable.", "Folding garbage.", "Tight is right.", "No value."],
    [CHAT_TRIGGERS.BET]: ["Sizing properly.", "Value bet.", "Blocker bet.", "Extracting.", "Bet."],
    [CHAT_TRIGGERS.RAISE]: ["Isolating.", "Squeezing.", "Value raise.", "Punishing limp.", "Raise."],
    [CHAT_TRIGGERS.CALL]: ["Pot odds.", "Implied odds.", "Floating.", "Keeping you wide.", "Call."],
    [CHAT_TRIGGERS.CHECK]: ["Pot control.", "Balancing range.", "Check.", "Standard line.", "Checking back."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["Variance caught up.", "Outplayed.", "Rebuy needed.", "Session over.", "Reviewing hand."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["Fish gutted.", "Bankroll +1.", "Efficient.", "Next.", "Good game."]
  },
  MR_CALL: {
    [CHAT_TRIGGERS.GAME_START]: ["I love to see flops.", "Any two cards win.", "Let's play.", "I'm in.", "Hello."],
    [CHAT_TRIGGERS.WIN_HUGE]: ["I hit!", "Got there!", "Lucky card.", "Wow!", "Nice pot."],
    [CHAT_TRIGGERS.WIN_SMALL]: ["I won.", "Cool.", "Nice.", "Yay.", "Chips."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["Thought I had you.", "So close.", "Darn.", "Nice hand.", "Missed my draw."],
    [CHAT_TRIGGERS.ALL_IN]: ["I have a pair.", "Maybe it hits.", "I call.", "Let's gamble.", "Hope?"],
    [CHAT_TRIGGERS.FOLD]: ["I guess.", "Fine.", "Fold.", "Don't want to.", "Okay."],
    [CHAT_TRIGGERS.BET]: ["Min bet.", "Clicking buttons.", "Bet.", "Here.", "Chips."],
    [CHAT_TRIGGERS.RAISE]: ["Raise?", "I assume so.", "Misclick?", "Strong?", "Raise."],
    [CHAT_TRIGGERS.CALL]: ["Call.", "Must see.", "Can't fold.", "Too curious.", "Calling."],
    [CHAT_TRIGGERS.CHECK]: ["Check.", "Free card.", "Checking.", "Pass.", "Check."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["Aw man.", "No more chips.", "Gg.", "Fun game.", "Bye."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["Wow.", "Gg.", "Nice hand.", "Bye.", "You out?"]
  },
  THE_WHALE: {
    [CHAT_TRIGGERS.GAME_START]: [
      "Chips? Just numbers on a screen!",
      "Let's see some fireworks!",
      "I brought enough for everyone.",
      "Who wants to be rich today?",
      "Adrenaline is the only currency I care about."
    ],
    [CHAT_TRIGGERS.WIN_HUGE]: [
      "Hahaha! What a rush!",
      "Fun! Fun! Fun!",
      "I love this game!",
      "More chips to play with!",
      "Did you see that river? Amazing!"
    ],
    [CHAT_TRIGGERS.WIN_SMALL]: [
      "Pocket change.",
      "Keep the game moving.",
      "Add it to the pile.",
      "Boring win.",
      "Next hand, come on!"
    ],
    [CHAT_TRIGGERS.LOSE_HUGE]: [
      "Hahaha! That was exciting!",
      "Take it! You played well!",
      "Now THAT is poker!",
      "Money well spent for the thrill.",
      "Don't spend it all at once, kid!"
    ],
    [CHAT_TRIGGERS.ALL_IN]: [
      "All of it! Let's go!",
      "I don't care about the odds!",
      "Gambling time!",
      "I'm feeling lucky!",
      "Let's make this pot huge!"
    ],
    [CHAT_TRIGGERS.FOLD]: [
      "Boring cards...",
      "No action here.",
      "I want to play, but this is trash.",
      "Fold.",
      "Wake me up when it's fun."
    ],
    [CHAT_TRIGGERS.BET]: [
      "Here, have some chips.",
      "Making it interesting.",
      "I bet... a lot!",
      "Price of admission.",
      "Let's play big!"
    ],
    [CHAT_TRIGGERS.RAISE]: [
      "Is that all? I raise!",
      "Let's pump it up!",
      "More! More!",
      "I simply must raise.",
      "Scared money?"
    ],
    [CHAT_TRIGGERS.CALL]: [
      "I have to see it.",
      "Show me the cards!",
      "I'm paying for the show.",
      "Call! Let's gamble!",
      "I never fold for this price."
    ],
    [CHAT_TRIGGERS.CHECK]: [
      "Check? Boring.",
      "Pass.",
      "Your turn.",
      "Go ahead.",
      "Checking."
    ],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: [
      "Hahaha! Cleaned out!",
      "That was a ride!",
      "Time to reload!",
      "Well played everyone!",
      "I'll be back with more!"
    ],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: [
      "You ran out of fun tickets?",
      "Don't worry, it's just money.",
      "Good game!",
      "Leaving so soon?",
      "Next player!"
    ]
  },
  OLD_LION: {
    [CHAT_TRIGGERS.GAME_START]: [
      "Keep your eyes open, kid.",
      "I've seen it all.",
      "Respect the game.",
      "Don't get cocky.",
      "Let's see if you have what it takes."
    ],
    [CHAT_TRIGGERS.WIN_HUGE]: [
      "Exactly as I predicted.",
      "Experience beats luck.",
      "You fell right into my trap.",
      "Too easy.",
      "Class is dismissed."
    ],
    [CHAT_TRIGGERS.WIN_SMALL]: [
      "Small wins build the bankroll.",
      "Patience is key.",
      "Another one.",
      "Easy chips.",
      "Learning yet?"
    ],
    [CHAT_TRIGGERS.LOSE_HUGE]: [
      "Well played... this time.",
      "A rare mistake.",
      "You got lucky.",
      "Even lions sleep.",
      "Enjoy it while it lasts."
    ],
    [CHAT_TRIGGERS.ALL_IN]: [
      "I'm committed.",
      "No turning back now.",
      "Show me your best.",
      "I've caught bigger fish than you.",
      "All in."
    ],
    [CHAT_TRIGGERS.FOLD]: [
      "Discipline.",
      "Not worth the risk.",
      "I'll wait for a better spot.",
      "Fold.",
      "Patience."
    ],
    [CHAT_TRIGGERS.BET]: [
      "I set the price.",
      "Pay to see.",
      "Testing the waters.",
      "Standard bet.",
      "Do you have it?"
    ],
    [CHAT_TRIGGERS.RAISE]: [
      "The trap is set.",
      "I'm increasing the pressure.",
      "Try to keep up.",
      "Applying leverage.",
      "Raise."
    ],
    [CHAT_TRIGGERS.CALL]: [
      "I'm curious.",
      "Let's see the next card.",
      "Calling.",
      "I'm not going anywhere.",
      "Show me."
    ],
    [CHAT_TRIGGERS.CHECK]: [
      "Check.",
      "Your move.",
      "Take your time.",
      "Checking.",
      "Go ahead."
    ],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: [
      "My time has come.",
      "Good game, everyone.",
      "The lion rests.",
      "Watch out for the sharks.",
      "I'll be watching."
    ],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: [
      "Another victim.",
      "You fought well.",
      "Experience wins again.",
      "Better luck next time.",
      "Discipline was lacking."
    ]
  },
  QUANT_PRO: {
    [CHAT_TRIGGERS.GAME_START]: [
      "Initializing probability matrix.",
      "Let's run the numbers.",
      "Variance is just a variable.",
      "Expected Value check.",
      "Logic dictates I win."
    ],
    [CHAT_TRIGGERS.WIN_HUGE]: [
      "Statistically inevitable.",
      "Positive expectation realized.",
      "The math never lies.",
      "Optimal outcome achieved.",
      "Efficiency: 100%."
    ],
    [CHAT_TRIGGERS.WIN_SMALL]: [
      "Marginal gains accumulate.",
      "As calculated.",
      "Within standard deviation.",
      "Micro-optimization success.",
      "Adding to the sample size."
    ],
    [CHAT_TRIGGERS.LOSE_HUGE]: [
      "High variance event detected.",
      "Recalculating odds...",
      "Improbable, but possible.",
      "Check the RNG seed.",
      "Suboptimal result."
    ],
    [CHAT_TRIGGERS.ALL_IN]: [
      "Equity maximization: 100%.",
      "Pot odds justify this.",
      "Committing stack based on EV.",
      "The model says push.",
      "All units deployed."
    ],
    [CHAT_TRIGGERS.FOLD]: [
      "Negative EV.",
      "Folding is optimal here.",
      "Saving capital.",
      "Trash hand probability: 85%.",
      "Next iteration."
    ],
    [CHAT_TRIGGERS.BET]: [
      "Inputting value bet.",
      "Sizing for indifference.",
      "Testing your range.",
      "Betting 33% pot.",
      "Standard deviation play."
    ],
    [CHAT_TRIGGERS.RAISE]: [
      "Exploiting your leak.",
      "Raising for value.",
      "Adjusting for aggression.",
      "Your range is capped.",
      "Re-raising."
    ],
    [CHAT_TRIGGERS.CALL]: [
      "Odds offer a clear call.",
      "Continuing range.",
      "Float initiated.",
      "Call.",
      "Calculating outs..."
    ],
    [CHAT_TRIGGERS.CHECK]: [
      "Check-back range.",
      "Zero check.",
      "Checking.",
      "Pass.",
      "Waiting for data."
    ],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: [
      "Bankroll exhausted.",
      "Ruin probability hit 100%.",
      "System failure.",
      "Need more data.",
      "Rebooting strategy..."
    ],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: [
      "Player removed from dataset.",
      "Your equity reached zero.",
      "Inefficient play punished.",
      "Statistical outlier eliminated.",
      "Next variable."
    ]
  },
  MAFIA_BOSS: {
    [CHAT_TRIGGERS.GAME_START]: [
      "Let's play some cards.",
      "This is a war zone.",
      "Pay your respects.",
      "Don't cross me.",
      "My territory, my rules."
    ],
    [CHAT_TRIGGERS.WIN_HUGE]: [
      "Lays down a monster!",
      "It was never yours to begin with.",
      "That's how business is done.",
      "Fear is a powerful tool.",
      "Total domination!"
    ],
    [CHAT_TRIGGERS.WIN_SMALL]: [
      "Pocket change.",
      "Hand it over.",
      "Mine.",
      "Don't make me wait.",
      "Keep them coming."
    ],
    [CHAT_TRIGGERS.LOSE_HUGE]: [
      "He beat me. Straight up. Pay him.",
      "Mister Son of a...!",
      "Pay that man his money.",
      "Enjoy it while you breathe.",
      "This isn't over."
    ],
    [CHAT_TRIGGERS.ALL_IN]: [
      "Stick it to me!",
      "I'm ending you right here.",
      "Put your life on the line!",
      "I own you.",
      "All in. Die or fold."
    ],
    [CHAT_TRIGGERS.FOLD]: [
      "Tactical retreat.",
      "Not this time.",
      "I'll catch you later.",
      "Fold.",
      "Whatever."
    ],
    [CHAT_TRIGGERS.BET]: [
      "I will splash the pot whenever the f*** I please.",
      "Bleed for me.",
      "Feeling the pressure?",
      "I bet.",
      "Here's a taste."
    ],
    [CHAT_TRIGGERS.RAISE]: [
      "I'm taking everything!",
      "Crushing you!",
      "Double or nothing?",
      "Don't insult me with that bet.",
      "RAISE!"
    ],
    [CHAT_TRIGGERS.CALL]: [
      "I'm calling your bluff.",
      "You think you can scare me?",
      "Call.",
      "Show me.",
      "I'm watching you."
    ],
    [CHAT_TRIGGERS.CHECK]: [
      "Check. Check. Check.",
      "Check.",
      "Make a move.",
      "Waiting.",
      "Your turn."
    ],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: [
      "Give him his money.",
      "You got lucky... for now.",
      "I'll be back for revenge.",
      "Damn it!",
      "Remember my face."
    ],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: [
      "Bad time to start sticking it to me!",
      "Disposed of.",
      "Weakness is fatal.",
      "Another one bites the dust.",
      "Pathetic."
    ]
  },
  // --- BOSS PERSONALITIES ---
  IVY_00: {
    [CHAT_TRIGGERS.GAME_START]: ["...", "I am reading your soul.", "Focus.", "Class is in session.", "Do not blink."],
    [CHAT_TRIGGERS.WIN_HUGE]: ["...", "Efficiency.", "As calculated.", "Your tell was obvious.", "Next hand."],
    [CHAT_TRIGGERS.WIN_SMALL]: ["...", "Stack building.", "Standard.", "Expected.", "Mine."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["...", "Interesting line.", "I will adjust.", "Variance.", "Noted."],
    [CHAT_TRIGGERS.ALL_IN]: ["...", "I see your fear.", "Commit.", "Decision made.", "All in."],
    [CHAT_TRIGGERS.FOLD]: ["...", "Fold.", "Not this time.", "Discipline.", "Pass."],
    [CHAT_TRIGGERS.BET]: ["...", "Bet.", "Pressure.", "Sizing.", "Observe."],
    [CHAT_TRIGGERS.RAISE]: ["...", "Isolating.", "Raise.", "Do you have it?", "Price goes up."],
    [CHAT_TRIGGERS.CALL]: ["...", "Call.", "Show me.", "I know what you have.", "Keeping you."],
    [CHAT_TRIGGERS.CHECK]: ["...", "Check.", "Waiting.", "Trap set?", "Go."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["...", "Impossible.", "The math...", "Rebooting.", "Mistake."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["...", "Dismissed.", "Class dismissed.", "Predictable.", "Empty."]
  },
  D_NEURAL: {
    [CHAT_TRIGGERS.GAME_START]: ["Hey everyone! Let's have fun!", "I love this game! Do you?", "What's everyone drinking?", "Small ball poker!", "Let's see some flops!"],
    [CHAT_TRIGGERS.WIN_HUGE]: ["I KNEW you had that!", "My read was perfect!", "So much fun!", "Scooping!", "Did you see that river?"],
    [CHAT_TRIGGERS.WIN_SMALL]: ["Pots are pots!", "Mining chips.", "Incrementing.", "Nice tiny pot.", "Ill take it."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["Wow! You actually had it?", "Incredible hand!", "You played that well.", "I put you on a bluff!", "That stings!"],
    [CHAT_TRIGGERS.ALL_IN]: ["I think I'm ahead!", "Let's gamble!", "Do you have Ace King?", "I'm feeling it!", "All the biscuits!"],
    [CHAT_TRIGGERS.FOLD]: ["Foldy foldy.", "Trash.", "Not my cards.", "Saving money.", "Bye bye."],
    [CHAT_TRIGGERS.BET]: ["Just a little bet.", "Poker is fun!", "Betting!", "Action!", "Here comes the bet."],
    [CHAT_TRIGGERS.RAISE]: ["I think I'm winning!", "Raising it up!", "Power poker!", "Make it expensive!", "Raise!"],
    [CHAT_TRIGGERS.CALL]: ["I have to see.", "Calling station mode!", "What do you have?", "I call!", "Let's see the river."],
    [CHAT_TRIGGERS.CHECK]: ["Checking to the raiser.", "Check.", "Free card please.", "Pass.", "Checking."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["Aww man!", "That was fun though!", "Gg guys!", "Cruel river!", "I'm out!"],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["Ouch! Sorry buddy.", "Nice try!", "Gg!", "That was intense.", "Who's next?"]
  },
  'D.W.A.N_V2': {
    [CHAT_TRIGGERS.GAME_START]: ["durrr...", "...", "Let's play big pots.", "Deep stack poker.", "Action."],
    [CHAT_TRIGGERS.WIN_HUGE]: ["...", "Ships.", "Standard.", "Easy game.", "Nice stack."],
    [CHAT_TRIGGERS.WIN_SMALL]: ["...", "Meh.", "Whatever.", "Chips.", "Take it."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["...", "Wow.", "Sick cooler.", "Rigged?", "Unlucky."],
    [CHAT_TRIGGERS.ALL_IN]: ["...", "All in.", "Maximum pressure.", "Can you call?", "Shove."],
    [CHAT_TRIGGERS.FOLD]: ["...", "Fold.", "Boring.", "Next.", "Pass."],
    [CHAT_TRIGGERS.BET]: ["..."],
    [CHAT_TRIGGERS.RAISE]: ["...", "Punish.", "Expensive."],
    [CHAT_TRIGGERS.CALL]: ["...", "Call.", "Looking.", "Snap.", "Float."],
    [CHAT_TRIGGERS.CHECK]: ["...", "Check.", "Slow.", "Wait.", "Pass."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["...", "Sick.", "Busted.", "Reload.", "Gg."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["...", "Owned.", "Nice hand.", "Bye.", "Gg."]
  },
  JNGL_MAN: {
    [CHAT_TRIGGERS.GAME_START]: ["I am the JNGL_MAN.", "Do you really think you can beat me?", "I'm the best heads-up player in the world.", "Where is the money?", "Let's play some real poker."],
    [CHAT_TRIGGERS.WIN_HUGE]: ["So easy.", "Total domination.", "I own your soul now.", "Wooooo!", "The math doesn't lie."],
    [CHAT_TRIGGERS.WIN_SMALL]: ["Every chip counts.", "Nice.", "I'll take it.", "Standard.", "Good."],
    [CHAT_TRIGGERS.LOSE_HUGE]: ["That is impossible!", "You are so lucky!", "How can you call with that?!", "I am tilting so hard!", "This variance is sick.", "...You have a four?"],
    [CHAT_TRIGGERS.ALL_IN]: ["I'm all in.", "Let's gamble.", "Do you have the courage?", "I challenge you.", "Time to die."],
    [CHAT_TRIGGERS.FOLD]: ["I fold.", "Boring.", "Next hand.", "Not worth it.", "Trash."],
    [CHAT_TRIGGERS.BET]: ["I bet.", "Pay attention.", "Action.", "I'm betting.", "Price of poker."],
    [CHAT_TRIGGERS.RAISE]: ["I raise.", "Too cheap.", "Lets play for real money.", "I am raising.", "Punishment."],
    [CHAT_TRIGGERS.CALL]: ["I call.", "Show me.", "I have to see it.", "You are bluffing.", "Snap call."],
    [CHAT_TRIGGERS.CHECK]: ["Check.", "Your move.", "Waiting.", "Pass.", "Checking."],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: ["I will be back.", "You got lucky.", "Unbelievable.", "I'll crush you next time.", "Gg."],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: ["Get out of here.", "I told you I am the best.", "Too easy.", "Who's next?", "Sit down."]
  },
  YH0_V1RAL: {
    [CHAT_TRIGGERS.GAME_START]: [
      "Bonjour! Ready for some content?",
      "Allez! Let's play some poker.",
      "Welcome to the stream, guys.",
      "I hope you are ready to be exploited.",
      "Let's see if you can keep up with my creativity."
    ],
    [CHAT_TRIGGERS.WIN_HUGE]: [
      "Magnifique! Join the club!",
      "Welcome to Value Town, population: You.",
      "Merci beaucoup for the donation.",
      "That line was... délicieux.",
      "Clip that! Put it on YouTube!"
    ],
    [CHAT_TRIGGERS.WIN_SMALL]: [
      "Petit à petit...",
      "Incrementing the stack.",
      "Efficient.",
      "Just a small tax.",
      "C'est bon."
    ],
    [CHAT_TRIGGERS.LOSE_HUGE]: [
      "Sacrebleu! How did you call that?",
      "Incredible... you are a station?",
      "That is not GTO...",
      "Whatever, nice hand.",
      "I will remember this leak."
    ],
    [CHAT_TRIGGERS.ALL_IN]: [
      "Tapis! All in.",
      "Do you have the courage?",
      "I put you to the test.",
      "Let's dance. All chips.",
      "Maximum pressure!"
    ],
    [CHAT_TRIGGERS.FOLD]: [
      "Pas aujourd'hui.",
      "Discipline is key.",
      "Au revoir, cards.",
      "Boring spot.",
      "Fold."
    ],
    [CHAT_TRIGGERS.BET]: [
      "A little probe bet.",
      "Sizing tell? Maybe.",
      "I extract value.",
      "This is for information.",
      "Bet."
    ],
    [CHAT_TRIGGERS.RAISE]: [
      "Let's inflate the pot!",
      "Aggression is power.",
      "I sense weakness.",
      "Raise. Try to read me.",
      "Exploitative raise."
    ],
    [CHAT_TRIGGERS.CALL]: [
      "I'm curious. Call.",
      "Do you have it? Show me.",
      "Pay to see.",
      "Hero call time?",
      "D'accord, I call."
    ],
    [CHAT_TRIGGERS.CHECK]: [
      "Check.",
      "I wait.",
      "Patience.",
      "After you.",
      "Checking back."
    ],
    [CHAT_TRIGGERS.ELIMINATED_SELF]: [
      "Non! Impossible!",
      "The variance... it kills me.",
      "C'est la vie.",
      "Gg, I played perfect though.",
      "Au revoir for now."
    ],
    [CHAT_TRIGGERS.ELIMINATED_ENEMY]: [
      "Voilà! Sit down.",
      "You played... interestingly.",
      "Another one for the highlight reel.",
      "Get outplayed.",
      "Au revoir!"]
  }
};