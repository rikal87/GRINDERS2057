import fs from 'fs';
import { calculateEquity, createDeck } from './poker.js';
import { getAIAction } from './aiEngine.js';
import { getAdvancedAIAction } from './aiEngineAdvanced.js';
import { PotManager } from './PotManager.js';

const CLASSES_ENEMY = [
  {
    id: 'Max', name: 'Max', fullName: 'Max Houston', philosophy: 'LAG', vPIP: .3, AF: 4, WTSD: .29, W$SD: 0.53, chipMultiply: 1.5,
    schedule: [
      { days: '월-토', hours: '13:00-23:00', status: 'GAMBLING' },
      { days: '일', hours: '종일', status: 'RESTING' },
      // 매칭되지 않는 나머지 시간은 기본적으로 IDLE/SLEEPING 등으로 처리됩니다
    ],
    age: 37,
    isAdvanced: false,
    isPartner: true,
    initialBankroll: 27500, initialRelationship: 500,
    concept: '같은 텍사스 출신으로 당신의 오랜 친구입니다. 성격은 다소 거칠게 보이지만, 사실 유쾌하고 속정이 깊고 의리가 있습니다.',
    note_ko: '텍사스 출신의 당신의 오랜 친구입니다. 테이블 위에서는 거칠고 변칙적인 플레이로 상대의 평정심을 무너뜨립니다.',
    note_en: 'Your long-time friend from Texas. At the table, he breaks opponents\' composure with rough and unpredictable plays.',
  },
  {
    id: 'Florence', name: 'Florence', fullName: 'Florence Quinn', philosophy: 'TAG', vPIP: .25, AF: 3, WTSD: .27, W$SD: 0.57, chipMultiply: 1.5,
    age: 32,
    isAdvanced: false,
    isPartner: true,
    schedule: [
      { days: '수,목,금,토,일', hours: '17:00-24:00', status: 'GAMBLING' },
      { days: '수,금,일', hours: '00:00-03:00', status: 'GAMBLING' },
      { days: '월,화', hours: '종일', status: 'RESTING' }
    ],
    initialBankroll: 73000, initialRelationship: 300,
    concept: '플레이어에게 적대적이지는 않습지만, 다소 차갑고 계산이 깔린듯한 비즈니스적인 말투를 꽤 자주 사용합니다. 하지만 가끔씩 귀여운 면모도 있습니다.',
    note_ko: '아름다움 뒤에 차가운 계산을 숨긴 라스베가스 출신의 베테랑 플레이어. H.B.D 클럽에서 처음 조우했으며, 언제나 정석적이고 견고한 타이트-어그레시브(TAG)의 표본을 보여줍니다.',
    note_en: 'A veteran player from Las Vegas who hides cold calculations behind her beauty. First encountered at the H.B.D Club, she exemplifies solid, textbook Tight-Aggressive (TAG) gameplay.',
  },
  {
    id: 'an_unknown_woman', name: 'An_Unknown_Woman', philosophy: 'TAG', vPIP: .24, AF: 3.5, WTSD: .27, W$SD: 0.53, chipMultiply: 4.32,
    schedule: [],
    isAdvanced: true,
    isPartner: false,
    note_ko: '부자들 사이에서 포커를 치고 있는 정체 모를 여성입니다.',
    note_en: 'An unknown woman is playing poker with rich men.',
  },
  {
    id: 'mr_call',
    name: 'MR_CALL', philosophy: 'LAP', vPIP: .90, AF: 0.5, WTSD: .7, chipMultiply: 1, isAdvanced: false,
    note_ko: '무슨 패를 들었든 일단 카드를 다 봐야 직성이 풀리는 스타일입니다.',
    note_en: 'Mr. Call is a mysterious man who plays poker with a calm demeanor, but his eyes reveal a hint of danger.',

  },
  {
    id: 'fish',
    name: 'Fish', philosophy: 'LAP', vPIP: .7, AF: 1, WTSD: .22, chipMultiply: 1, isAdvanced: false,
    note_ko: '판돈을 불리는 데는 일등 공신이지만, 막상 끝까지 가는 배짱은 없어서 정교한 블러핑 한 방이면 칩을 고스란히 헌납할 겁니다.',
    note_en: 'He is a great contributor to increasing the pot, but he lacks the courage to go all the way, so a single sophisticated bluff will cost him all his chips.',

  },
  {
    id: 'broke',
    name: 'Broke', philosophy: 'MIX', vPIP: .38, AF: 2, WTSD: .6, chipMultiply: 0.5, isAdvanced: false,
    note_ko: '내일이 없는 친구입니다. 리버에 기적이 일어나길 빌며 모든 걸 걸었다가, 결국 오늘도 빈털터리로 돌아갑니다',
    note_en: 'He is a friend with no tomorrow. He bets everything hoping for a miracle on the river, only to end up broke again today.',

  },
  {
    id: 'gambler',
    name: 'Gambler', philosophy: 'LAG', vPIP: .4, AF: 3, WTSD: .4, chipMultiply: 1, isAdvanced: false,
    note_ko: '인생은 한 방, 아주 낮은 확률의 드로우만 보여도 리버까지 멈추지 않는 브레이크 고장난 도박꾼입니다.',
    note_en: 'Life is a gamble. He\'ll chase even the thinnest draw all the way to the river, never letting up on the bets',

  },
  {
    id: 'maniac',
    name: 'Maniac', philosophy: 'LAG', vPIP: .5, AF: 6, WTSD: .5, chipMultiply: 1, isAdvanced: false,
    note_ko: '팟을 개판으로 만드는 주범입니다. 정말 미친놈 같습니다..',
    note_en: 'He is the main culprit who messes up the pot. He seems like a really crazy guy..',

  },
  {
    id: 'rich_guy',
    name: 'Rich_Guy', philosophy: 'TAP', vPIP: .29, AF: 1.5, WTSD: .26, chipMultiply: 3, isAdvanced: false,
    note_ko: '기업의 꽤 높은 분이거나 운 좋게 코인 대박이 터진 부자입니다. 테이블에 앉아있는 스릴을 즐기지만, 상황이 심각해지면 쉽게 접는 경향이 있습니다.',
    note_en: 'He is a high-ranking executive of a company or a rich man who got lucky with a crypto boom. He plays for the thrill of being at the table, but tends to fold when things get too intense.',
  },
  {
    id: 'gangster',
    name: 'Gangster', philosophy: 'TAG', vPIP: .38, AF: 4, WTSD: .44, chipMultiply: 1, isAdvanced: false,
    note_ko: '확실한 판에서만 무섭게 몰아붙이는 무법자입니다. 그의 베팅은 테이블 전체를 압박하는 폭력에 가깝습니다. 가끔 패가 안 풀리면 테이블을 엎고 싶어 하는 눈치니 조심하세요.',
    note_en: 'He\'s an outlaw who strikes ruthlessly only when the odds are in his favor. His betting is akin to violence, suffocating the entire table. Be careful—when the cards don\'t go his way, you can see him itching to flip the table.',
  },
  {
    id: 'nit',
    name: 'Nit', philosophy: 'NIT', vPIP: .09, AF: 2.5, WTSD: .35, chipMultiply: 1, isAdvanced: false,
    note_ko: '혹시라도 그가 레이즈를 한다면 무조건 도망치세요, AA가 확실합니다.',
    note_en: 'If he raises, run for your life, it\'s definitely AA.',
  },
  {
    id: 'quant_pro',
    name: 'Quant_Pro', philosophy: 'TAP', vPIP: .22, AF: 2, WTSD: .25, chipMultiply: 1.5, isAdvanced: false,
    note_ko: '금융권 퀀트 출신이었으나, 지금은 포커에 미쳐버린 친구입니다. 감정에 휘둘리지 않고 철저히 데이터대로만 움직이는 인간 계산기입니다.',
    note_en: 'He was a quant in the finance industry, but now he\'s crazy about poker. He never tilts, making every move based on cold, hard probability and expected value.',

  },
  {
    id: 'the_don',
    name: 'The_Don', philosophy: 'LAG', vPIP: .35, AF: 5, WTSD: .35, chipMultiply: 2, isAdvanced: false,
    note_ko: '포커를 "전쟁"으로 생각합니다. 상대가 기권할 때까지 돈과 위압감으로 밀어붙이며, 테이블 전체의 분위기를 공포로 몰아넣는 것을 즐깁니다.',
    note_en: 'He thinks of poker as a "war". He enjoys pushing his opponents with money and intimidation until they give up, filling the entire table with fear.',
  },
  {
    id: 'kbt_leader',
    name: 'KBT_Leader', philosophy: 'LAG', vPIP: .75, AF: 4, WTSD: .31, chipMultiply: 3.5, isAdvanced: true,
    note_ko: 'KBT 조직의 리더이자 헤즈업 경기의 실력자입니다. 그와의 1:1 경기에서 승리할 수 있을까요?',
    note_en: 'He is the leader of the KBT organization and a skilled player in heads-up matches. Can you defeat him in a 1:1 game?',
  },
  {
    id: 'the_whale',
    name: 'The_Whale', philosophy: 'LAP', vPIP: .70, AF: 2, WTSD: .75, chipMultiply: 8, isAdvanced: false,
    note_ko: '숫자 놀음에는 관심 없는 도시의 거물입니다. 판돈이 수십 배로 불어나도 눈 하나 깜짝하지 않으며, 오히려 상대를 파산시키는 과정 자체를 유흥으로 즐기는 진정한 포식자입니다.',
    note_en: 'A high-stakes mogul who treats millions like pocket change. He doesn\'t play the cards; he plays the adrenaline. To him, losing a fortune is just the entry fee for a good laugh.',
  },
  {
    id: 'old_lion',
    name: 'Old_Lion', philosophy: 'TAG', vPIP: .25, AF: 3, WTSD: .25, chipMultiply: 1.5, isAdvanced: true,
    note_ko: '전성기는 지났지만 여전히 날카로운 노장입니다. 그가 참전했다는 건 이미 덫을 다 깔아두었다는 뜻이니, 함부로 덤비지 마세요.',
    note_en: 'His prime has passed, but he is still a sharp veteran. If he has entered the game, it means he has already laid all the traps, so don\'t mess with him carelessly.',

  },
  {
    id: 'shark',
    name: 'Shark', philosophy: 'TAG', vPIP: .27, AF: 3.5, WTSD: .24, chipMultiply: 1.5, isAdvanced: true, isBoss: true,
    note_ko: '가장 무서운 건 이 친구의 패가 아니라, 이 친구의 인내심입니다.',
    note_en: 'The most frightening thing is not his hand, but his patience.',
  },
  {
    id: 'named_pro',
    name: 'Named_Pro', note_ko: '이곳에선 전설적인 플레이어를 만날 가능성이있습니다.',
    note_en: 'You may encounter legendary players here.',
  },
  { name: 'IVY_00', philosophy: 'TAG', vPIP: .27, AF: 3.5, WTSD: .27, chipMultiply: 2, isBoss: true, note: '균형잡힌, 그리고 전설적인 포커 플레이어입니다.' },
  { name: 'D_NEURAL', philosophy: 'LAG', vPIP: .34, AF: 2.7, WTSD: .26, chipMultiply: 2, isBoss: true, note: '유쾌하며 상대방의 핸드리딩 실력이 정말 좋습니다.' },
  { name: 'D.W.A.N_V2', philosophy: 'LAG', vPIP: .33, AF: 4.2, WTSD: .30, chipMultiply: 2, isBoss: true, note: '매우 공격적인 프로 포커 플레이어입니다.' },
  { name: 'JNGL_MAN', philosophy: 'TAG', vPIP: .30, AF: 3.3, WTSD: .31, chipMultiply: 2, isBoss: true, note: '헤즈업 전문 프로 포커 플레이어입니다.' },
  { name: 'YH0_V1RAL', philosophy: 'LAG', vPIP: .33, AF: 3.7, WTSD: .29, chipMultiply: 2, isBoss: true, note: '프랑스 출신 유명 포커 플레이어입니다.' },
]
export async function runSimulation() {
  const opp1 = 'Max'
  const opp2 = 'gangster'
  const opp3 = 'old_lion'
  console.log(`Starting DB Simulation (${opp1} vs ${opp2} vs ${opp3})...`);

  const oop1Template = CLASSES_ENEMY.find(c => c.id === opp1 || c.name === opp1);
  const oop2Template = CLASSES_ENEMY.find(c => c.id === opp2 || c.name === opp2);
  const oop3Template = CLASSES_ENEMY.find(c => c.id === opp3 || c.name === opp3);
  // ** don't edit this function **
  function getUnifiedAction(player, engine) {

    if (player.class?.isBoss) {
      return getAdvancedAIAction(player, engine);
    }
    return getAIAction(player, engine);
  }

  let players = [];
  const createPlayer = (id, name, template, initialChips) => ({
    id,
    name,
    class: template,
    chips: initialChips,
    startChips: initialChips,
    currentBet: 0,
    totalWagered: 0,
    isFolded: false,
    isHuman: false,
    hand: [],
    stats: {
      handsPlayed: 0,
      vpipCount: 0,
      pfrCount: 0,
      threeBetCount: 0,
      fourBetPlusCount: 0,
      wins: 0,
      bankrupt: false,
      foldsPerStreet: { PREFLOP: 0, FLOP: 0, TURN: 0, RIVER: 0 },
      showdownCount: 0,
      showdownWinCount: 0,
      sawFlopCount: 0,
      sawTurnCount: 0,
      sawRiverCount: 0,
      totalProfit: 0,
      betsCount: 0,
      callsCount: 0
    },
    // Reset per hand
    handState: {
      didVpip: false,
      didPfr: false,
      didThreeBet: false
    }
  });

  for (let i = 0; i < 2; i++) {
    players.push(createPlayer(`${opp1}_${i}`, `${opp1}_${i}`, oop1Template, 10000));
    players.push(createPlayer(`${opp2}_${i}`, `${opp2}_${i}`, oop2Template, 10000));
    players.push(createPlayer(`${opp3}_${i}`, `${opp3}_${i}`, oop3Template, 10000));
  }

  let handsToPlay = 2000;
  console.log(`Initialized 6 players. Running ${handsToPlay} hands...`);

  const engine = {
    bb: 2,
    sb: 1,
    board: [],
    aggressor: null,
    players: players,
    locationId: 'test_zone',
    dealerIndex: 0,
    currentRoundBet: 0,
    state: 'PREFLOP',
    currentStreetRaises: 0,
    pot: 0,
  };

  const potManager = new PotManager(0.05, 50);

  for (let hand = 0; hand < handsToPlay; hand++) {
    const deck = createDeck();
    engine.board = [];
    potManager.resetHand();
    engine.aggressor = null;
    engine.currentStreetRaises = 0;
    engine.handHistory = []; // [DEBUG OVERHAUL] Track storyline

    const aliveCount = players.filter(p => p.chips > 0).length;
    if (aliveCount < 2) break;

    players.forEach(p => {
      p.hand = [deck.pop(), deck.pop()];
      p.isFolded = p.chips <= 0;
      p.currentBet = 0;
      p.totalWagered = 0;
      p.handState = { didVpip: false, didPfr: false, didThreeBet: false, didFourBetPlus: false };
      p.isBust = false
      if (p.chips > 0) p.stats.handsPlayed++;
    });

    const dealerIdx = hand % players.length;
    let actingIdx = (dealerIdx + 3) % players.length;
    engine.dealerIndex = dealerIdx;
    const runBettingRound = (street) => {
      const getPosName = (idx) => {
        const dist = (idx - dealerIdx + players.length) % players.length;
        const posMap6 = ['BTN', 'SB', 'BB', 'UTG', 'MP', 'CO'];
        return posMap6[dist] || 'MP';
      };

      engine.state = street;
      engine.currentStreetRaises = 0; // Standard reset
      let consecutiveChecksOrCalls = 0;
      let activeInRound = players.filter(p => !p.isFolded && p.chips > 0);
      let attempts = 0;

      while (consecutiveChecksOrCalls < activeInRound.length && attempts < 50) {
        attempts++;
        const p = players[actingIdx];
        if (!p.isFolded && p.chips > 0) {
          const callAmt = potManager.currentRoundBet - p.currentBet;
          engine.currentRoundBet = potManager.currentRoundBet;
          engine.pot = potManager.pot;

          let action = getUnifiedAction(p, engine);
          let amount = 0;

          if (p.id.toLowerCase().startsWith('shark') && street === 'PREFLOP') {
            const myPos = getPosName(actingIdx);
            console.log(`[DEBUG_SHARK] Hand ${hand} | ${p.name}(${myPos}) | ${engine.state} | CSR:${engine.currentStreetRaises} | CallAmt:${callAmt} | Hand:${p.hand.join(',')} | Action:${action.type} | Insight:${action.insight}`);
          }

          // [DEBUG OVERHAUL] Capture Extra Metadata
          let actionType = action.type;
          let rangeEst = action.rangeEstimate ? ` [Range: ${action.rangeEstimate}]` : '';
          let expTrigger = action.exploitTrigger ? ` [Exploit: ${action.exploitTrigger}]` : '';

          if (action.type === 'fold') {
            engine.handHistory.push(`[${street}] ${p.name}: Folds${rangeEst}${expTrigger}`);
            p.isFolded = true;
            p.stats.foldsPerStreet[street]++;
            activeInRound = activeInRound.filter(x => x.id !== p.id);
            consecutiveChecksOrCalls = 0;
          } else {
            if (action.type === 'check' || action.type === 'call') {
              amount = callAmt;
              consecutiveChecksOrCalls++;
              engine.handHistory.push(`[${street}] ${p.name}: ${action.type === 'check' ? 'Checks' : 'Calls ' + amount}${rangeEst}${expTrigger} - <${action.insight}>`);
              // VPIP check (not counting BB/SB unless facing raise)
              if (amount > 0 && !p.handState.didVpip) {
                p.stats.vpipCount++;
                p.handState.didVpip = true;
              }
              if (street !== 'PREFLOP' && action.type === 'call') {
                p.stats.callsCount++;
              }
            } else {
              // Raise or Bet
              amount = action.amount || (callAmt + engine.bb);
              if (amount > p.chips + p.currentBet) amount = p.chips + p.currentBet;

              const isActualRaise = amount > potManager.currentRoundBet;

              engine.handHistory.push(`[${street}] ${p.name}: Raises to ${amount}${rangeEst}${expTrigger} - <${action.insight}>`);

              if (isActualRaise) {
                engine.currentStreetRaises++;
                if (street === 'PREFLOP') {
                  if (engine.currentStreetRaises === 1) { // First raise (RFI)
                    if (!p.handState.didPfr) { p.stats.pfrCount++; p.handState.didPfr = true; }
                  } else if (engine.currentStreetRaises === 2) { // Exactly 3-Bet
                    if (!p.handState.didThreeBet) { p.stats.threeBetCount++; p.handState.didThreeBet = true; }
                  } else if (engine.currentStreetRaises >= 3) { // 4-Bet or higher
                    if (!p.handState.didFourBetPlus) { p.stats.fourBetPlusCount++; p.handState.didFourBetPlus = true; }
                  }
                  engine.aggressor = p.id;
                }
                consecutiveChecksOrCalls = 1;
              } else {
                consecutiveChecksOrCalls++;
              }

              if (!p.handState.didVpip) {
                p.stats.vpipCount++;
                p.handState.didVpip = true;
              }
              if (isActualRaise && street !== 'PREFLOP') {
                p.stats.betsCount++;
              }
            }

            if (amount > 0) potManager.placeBet(p, amount);
          }
        }
        actingIdx = (actingIdx + 1) % players.length;
      }
      players.forEach(p => p.currentBet = 0);
      potManager.currentRoundBet = 0;
    };

    // Preflop
    potManager.placeBet(players[(dealerIdx + 1) % players.length], engine.sb);
    potManager.placeBet(players[(dealerIdx + 2) % players.length], engine.bb);
    runBettingRound('PREFLOP');

    // const getPosName = (idx) => {
    //   const dist = (idx - dealerIdx + players.length) % players.length;
    //   const posMap6 = ['BTN', 'SB', 'BB', 'UTG', 'MP', 'CO'];
    //   return posMap6[dist] || 'MP';
    // };

    // Streets
    const streets = ['FLOP', 'TURN', 'RIVER'];
    for (const street of streets) {
      if (players.filter(p => !p.isFolded).length <= 1) break;
      if (street === 'FLOP') {
        engine.board.push(deck.pop(), deck.pop(), deck.pop());
        players.filter(p => !p.isFolded).forEach(p => p.stats.sawFlopCount++);
      }
      else {
        engine.board.push(deck.pop());
        if (street === 'TURN') players.filter(p => !p.isFolded).forEach(p => p.stats.sawTurnCount++);
        if (street === 'RIVER') players.filter(p => !p.isFolded).forEach(p => p.stats.sawRiverCount++);
      }
      actingIdx = (dealerIdx + 1) % players.length;
      runBettingRound(street);
    }

    // Showdown
    const activeAtEnd = players.filter(p => !p.isFolded);
    if (activeAtEnd.length > 1) activeAtEnd.forEach(p => p.stats.showdownCount++);

    const result = potManager.resolveShowdown(players, engine.board, engine.board.length === 0);
    if (result.winnerId) {
      const winner = players.find(p => p.id === result.winnerId);
      if (winner) {
        winner.stats.wins++;
        if (activeAtEnd.length > 1) winner.stats.showdownWinCount++;
      }
    }

    // [DEBUG OVERHAUL] Dump Hand History for Significant Pots (> 30bb)
    const totalPotBB = potManager.pot / engine.bb;
    if (totalPotBB >= 30 || activeAtEnd.length > 1) { // Dump if pot is huge or it went to showdown
      const involved = players.filter(p => p.totalWagered > engine.bb);
      if (involved.some(p => p.id.startsWith('shark'))) { // Only care if Shark was involved in the big pot
        console.log(`\n======================================`);
        console.log(`[HAND HISTORY DUMP] Hand #${hand} | Pot: ${potManager.pot} (${totalPotBB.toFixed(1)} BB) | Board: [${engine.board.join(', ')}]`);
        console.log(`Players: ${involved.map(p => `${p.name} (${p.hand.join(',')})`).join(' | ')}`);
        console.log(`--------------------------------------`);
        engine.handHistory.forEach(log => console.log(log));
        if (result.winnerId) console.log(`Winner: ${result.winnerId}`);
        console.log(`======================================\n`);
      }
    }
  }

  // Final Reports
  players.forEach(p => {
    p.stats.totalProfit = p.chips - p.startChips;
    if (p.chips <= 0) p.stats.bankrupt = true;
  });

  let logContent = `\n[${new Date().toLocaleString()}] Simulation Result (${opp1} vs ${opp2} vs ${opp3})\n`;

  const printGroupReport = (name, pList) => {
    const totalHands = pList.reduce((s, p) => s + p.stats.handsPlayed, 0) / pList.length;
    const avgVpip = (pList.reduce((s, p) => s + p.stats.vpipCount, 0) / Math.max(1, pList.reduce((s, p) => s + p.stats.handsPlayed, 0)) * 100).toFixed(1);
    const avgPfr = (pList.reduce((s, p) => s + p.stats.pfrCount, 0) / Math.max(1, pList.reduce((s, p) => s + p.stats.handsPlayed, 0)) * 100).toFixed(1);
    const avg3B = (pList.reduce((s, p) => s + p.stats.threeBetCount, 0) / Math.max(1, pList.reduce((s, p) => s + p.stats.handsPlayed, 0)) * 100).toFixed(1);
    const avg4B = (pList.reduce((s, p) => s + p.stats.fourBetPlusCount, 0) / Math.max(1, pList.reduce((s, p) => s + p.stats.handsPlayed, 0)) * 100).toFixed(1);
    const totalProfit = pList.reduce((s, p) => s + p.stats.totalProfit, 0);
    const folds = { PF: 0, F: 0, T: 0, R: 0 };
    pList.forEach(p => {
      folds.PF += p.stats.foldsPerStreet.PREFLOP;
      folds.F += p.stats.foldsPerStreet.FLOP;
      folds.T += p.stats.foldsPerStreet.TURN;
      folds.R += p.stats.foldsPerStreet.RIVER;
    });

    const report =
      `--- [${name}] Group Report ---
Hands Played (avg): ${Math.floor(totalHands)} | Profit: ${totalProfit} | VPIP: ${avgVpip}% | PFR: ${avgPfr}% | 3B: ${avg3B}% | 4B+: ${avg4B}%
Folds: PF(${folds.PF}) F(${folds.F}) T(${folds.T}) R(${folds.R})
WTSD: ${(pList.reduce((s, p) => s + p.stats.showdownCount, 0) / (pList.reduce((s, p) => s + p.stats.sawFlopCount, 0) || 1) * 100).toFixed(1)}% | W$SD: ${(pList.reduce((s, p) => s + p.stats.showdownWinCount, 0) / (pList.reduce((s, p) => s + p.stats.showdownCount, 0) || 1) * 100).toFixed(1)}%
Showdown Wins: ${pList.reduce((s, p) => s + p.stats.showdownWinCount, 0)}/${pList.reduce((s, p) => s + p.stats.showdownCount, 0)}\n`;

    console.log(`\n` + report);
    logContent += report;
  };

  const jsonLogFile = 'simulation_result.json';
  let statsJson = {};
  if (fs.existsSync(jsonLogFile)) {
    try {
      const existingData = fs.readFileSync(jsonLogFile, 'utf8');
      statsJson = JSON.parse(existingData);
    } catch (e) {
      console.error("Error reading JSON stats file:", e);
    }
  }

  const updateJsonStats = (name, pList) => {
    if (!statsJson[name]) {
      statsJson[name] = {
        "Hands Played(avg)": 0, "Profit": 0, "VPIP": 0, "PFR": 0, "3B": 0, "4B+": 0, "chips": 0, "WTSD": 0, "W$SD": 0,
        "Folds": { "PF": 0, "F": 0, "T": 0, "R": 0 }, "bankrupt_count": 0,
        "_meta": {
          "totalHandsRaw": 0, "vpipCountRaw": 0, "pfrCountRaw": 0, "threeBetCountRaw": 0, "fourBetCountRaw": 0,
          "showdownCountRaw": 0, "showdownWinCountRaw": 0, "sawFlopCountRaw": 0, "sawTurnCountRaw": 0, "sawRiverCountRaw": 0,
          "foldPFCountRaw": 0, "foldFCountRaw": 0, "foldTCountRaw": 0, "foldRCountRaw": 0
        }
      };
    }

    const s = statsJson[name];
    const parse = (v) => (typeof v === 'string') ? parseFloat(v.replace('%', '')) : (v || 0);

    if (!s.Folds) s.Folds = { PF: 0, F: 0, T: 0, R: 0 };
    if (!s._meta) {
      const hands = parse(s["Hands Played(avg)"]);
      const vpip = parse(s["VPIP"]);
      const pfr = parse(s["PFR"]);
      const wtsd = parse(s["WTSD"]);
      const wsd = parse(s["W$SD"]);

      s._meta = {
        totalHandsRaw: hands * (pList.length || 1),
        vpipCountRaw: Math.round((vpip / 100) * hands),
        pfrCountRaw: Math.round((pfr / 100) * hands),
        threeBetCountRaw: Math.round((parse(s["3B"]) / 100) * hands),
        fourBetCountRaw: Math.round((parse(s["4B+"]) / 100) * hands),
        sawFlopCountRaw: Math.round((vpip / 100) * hands * 0.7),
        sawTurnCountRaw: Math.round((vpip / 100) * hands * 0.5),
        sawRiverCountRaw: Math.round((vpip / 100) * hands * 0.3),
        foldPFCountRaw: parse(s.Folds.PF),
        foldFCountRaw: parse(s.Folds.F),
        foldTCountRaw: parse(s.Folds.T),
        foldRCountRaw: parse(s.Folds.R),
        showdownCountRaw: Math.round((wtsd / 100) * (Math.round((vpip / 100) * hands * 0.7))),
        showdownWinCountRaw: Math.round((wsd / 100) * Math.round((wtsd / 100) * (Math.round((vpip / 100) * hands * 0.7))))
      };
    }

    const m = s._meta;
    if (m.sawFlopCountRaw === undefined || m.sawFlopCountRaw === null) m.sawFlopCountRaw = Math.round(parse(s["VPIP"]) / 100 * parse(s["Hands Played(avg)"]) * 0.7);
    if (m.sawTurnCountRaw === undefined || m.sawTurnCountRaw === null) m.sawTurnCountRaw = Math.round(parse(s["VPIP"]) / 100 * parse(s["Hands Played(avg)"]) * 0.5);
    if (m.sawRiverCountRaw === undefined || m.sawRiverCountRaw === null) m.sawRiverCountRaw = Math.round(parse(s["VPIP"]) / 100 * parse(s["Hands Played(avg)"]) * 0.3);
    if (m.foldPFCountRaw === undefined || m.foldPFCountRaw === null) m.foldPFCountRaw = 0;
    if (m.foldFCountRaw === undefined || m.foldFCountRaw === null) m.foldFCountRaw = 0;
    if (m.foldTCountRaw === undefined || m.foldTCountRaw === null) m.foldTCountRaw = 0;
    if (m.foldRCountRaw === undefined || m.foldRCountRaw === null) m.foldRCountRaw = 0;

    const currentTotalHands = pList.reduce((acc, p) => acc + p.stats.handsPlayed, 0);
    const currentVpipCount = pList.reduce((acc, p) => acc + p.stats.vpipCount, 0);
    const currentPfrCount = pList.reduce((acc, p) => acc + p.stats.pfrCount, 0);
    const current3bCount = pList.reduce((acc, p) => acc + p.stats.threeBetCount, 0);
    const current4bCount = pList.reduce((acc, p) => acc + p.stats.fourBetPlusCount, 0);
    const currentShowdownCount = pList.reduce((acc, p) => acc + p.stats.showdownCount, 0);
    const currentShowdownWinCount = pList.reduce((acc, p) => acc + p.stats.showdownWinCount, 0);
    const currentSawFlopCount = pList.reduce((acc, p) => acc + p.stats.sawFlopCount, 0);
    const currentSawTurnCount = pList.reduce((acc, p) => acc + p.stats.sawTurnCount, 0);
    const currentSawRiverCount = pList.reduce((acc, p) => acc + p.stats.sawRiverCount, 0);
    const currentFoldPF = pList.reduce((acc, p) => acc + p.stats.foldsPerStreet.PREFLOP, 0);
    const currentFoldF = pList.reduce((acc, p) => acc + p.stats.foldsPerStreet.FLOP, 0);
    const currentFoldT = pList.reduce((acc, p) => acc + p.stats.foldsPerStreet.TURN, 0);
    const currentFoldR = pList.reduce((acc, p) => acc + p.stats.foldsPerStreet.RIVER, 0);

    m.totalHandsRaw += currentTotalHands;
    m.vpipCountRaw += currentVpipCount;
    m.pfrCountRaw += currentPfrCount;
    m.threeBetCountRaw += current3bCount;
    m.fourBetCountRaw += current4bCount;
    m.showdownCountRaw += currentShowdownCount;
    m.showdownWinCountRaw += currentShowdownWinCount;
    m.sawFlopCountRaw += currentSawFlopCount;
    m.sawTurnCountRaw += currentSawTurnCount;
    m.sawRiverCountRaw += currentSawRiverCount;
    m.foldPFCountRaw += currentFoldPF;
    m.foldFCountRaw += currentFoldF;
    m.foldTCountRaw += currentFoldT;
    m.foldRCountRaw += currentFoldR;

    s["Hands Played(avg)"] += currentTotalHands / pList.length;
    s["Profit"] += pList.reduce((acc, p) => acc + p.stats.totalProfit, 0);
    s["VPIP"] = Number((m.vpipCountRaw / m.totalHandsRaw * 100).toFixed(1));
    s["PFR"] = Number((m.pfrCountRaw / m.totalHandsRaw * 100).toFixed(1));
    s["3B"] = Number((m.threeBetCountRaw / m.totalHandsRaw * 100).toFixed(1));
    s["4B+"] = Number((m.fourBetCountRaw / m.totalHandsRaw * 100).toFixed(1));
    s["WTSD"] = Number((m.showdownCountRaw / (m.sawFlopCountRaw || 1) * 100).toFixed(1));
    s["W$SD"] = Number((m.showdownWinCountRaw / (m.showdownCountRaw || 1) * 100).toFixed(1));
    s["chips"] = pList.reduce((acc, p) => acc + p.chips, 0);

    s.Folds.PF = Number((m.foldPFCountRaw / m.totalHandsRaw * 100).toFixed(1));
    s.Folds.F = Number((m.foldFCountRaw / (m.sawFlopCountRaw || 1) * 100).toFixed(1));
    s.Folds.T = Number((m.foldTCountRaw / (m.sawTurnCountRaw || 1) * 100).toFixed(1));
    s.Folds.R = Number((m.foldRCountRaw / (m.sawRiverCountRaw || 1) * 100).toFixed(1));

    pList.forEach(p => {
      if (p.stats.bankrupt) s.bankrupt_count++;
    });
  };

  updateJsonStats(opp1, players.filter(p => p.id.startsWith(opp1)));
  updateJsonStats(opp2, players.filter(p => p.id.startsWith(opp2)));
  updateJsonStats(opp3, players.filter(p => p.id.startsWith(opp3)));

  fs.writeFileSync(jsonLogFile, JSON.stringify(statsJson, null, 2), 'utf8');
  console.log(`Cumulative stats saved to ${jsonLogFile}`);
}

runSimulation();

