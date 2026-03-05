import { calculateEquity, createDeck } from './poker.js';
import { getAIAction } from './aiEngine.js';
import { getAdvancedAIAction } from './aiEngineAdvanced.js';
import { CLASSES_ENEMY } from './persona.js';
import { PotManager } from './PotManager.js';

export async function runSimulation() {
  const opp = 'Old_Lion'
  const opp2 = 'Gangster'
  console.log(`Starting DB Simulation (Shark vs ${opp})...`);

  const sharkTemplate = CLASSES_ENEMY.find(c => c.id === 'shark' || c.name === 'Shark');
  const oldLionTemplate = CLASSES_ENEMY.find(c => c.id === opp || c.name === opp);
  const oop2Template = CLASSES_ENEMY.find(c => c.id === opp2 || c.name === opp2);

  if (!sharkTemplate || !oldLionTemplate) {
    console.error("Could not find  template.");
    return;
  }

  function getUnifiedAction(player, engine) {
    if (player.id.startsWith('shark')) {
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
      totalProfit: 0
    },
    // Reset per hand
    handState: {
      didVpip: false,
      didPfr: false,
      didThreeBet: false
    }
  });

  for (let i = 0; i < 2; i++) {
    players.push(createPlayer(`shark_${i}`, `Shark_${i}`, sharkTemplate, 10000));
    players.push(createPlayer(`${opp}_${i}`, `${opp}_${i}`, oldLionTemplate, 10000));
    players.push(createPlayer(`${opp2}_${i}`, `${opp2}_${i}`, oop2Template, 10000));
  }

  let handsToPlay = 1000;
  console.log(`Initialized 6 players. Running ${handsToPlay} hands...`);

  const engine = {
    bb: 2,
    sb: 1,
    board: [],
    preflopAggressor: null,
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
    engine.preflopAggressor = null;
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

          if (p.id.startsWith('shark') && street === 'PREFLOP') {
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
                  engine.preflopAggressor = p.id;
                }
                consecutiveChecksOrCalls = 1;
              } else {
                consecutiveChecksOrCalls++;
              }

              if (!p.handState.didVpip) {
                p.stats.vpipCount++;
                p.handState.didVpip = true;
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
      if (street === 'FLOP') engine.board.push(deck.pop(), deck.pop(), deck.pop());
      else engine.board.push(deck.pop());
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

  const printGroupReport = (name, pList) => {
    const totalHands = pList.reduce((s, p) => s + p.stats.handsPlayed, 0) / pList.length;
    const avgVpip = (pList.reduce((s, p) => s + p.stats.vpipCount, 0) / pList.reduce((s, p) => s + p.stats.handsPlayed, 0) * 100).toFixed(1);
    const avgPfr = (pList.reduce((s, p) => s + p.stats.pfrCount, 0) / pList.reduce((s, p) => s + p.stats.handsPlayed, 0) * 100).toFixed(1);
    const avg3B = (pList.reduce((s, p) => s + p.stats.threeBetCount, 0) / pList.reduce((s, p) => s + p.stats.handsPlayed, 0) * 100).toFixed(1);
    const avg4B = (pList.reduce((s, p) => s + p.stats.fourBetPlusCount, 0) / pList.reduce((s, p) => s + p.stats.handsPlayed, 0) * 100).toFixed(1);
    const totalProfit = pList.reduce((s, p) => s + p.stats.totalProfit, 0);
    const folds = { PF: 0, F: 0, T: 0, R: 0 };
    pList.forEach(p => {
      folds.PF += p.stats.foldsPerStreet.PREFLOP;
      folds.F += p.stats.foldsPerStreet.FLOP;
      folds.T += p.stats.foldsPerStreet.TURN;
      folds.R += p.stats.foldsPerStreet.RIVER;
    });

    console.log(`\n--- [${name}] Group Report ---`);
    console.log(`Hands Played (avg): ${Math.floor(totalHands)} | Profit: ${totalProfit} | VPIP: ${avgVpip}% | PFR: ${avgPfr}% | 3B: ${avg3B}% | 4B+: ${avg4B}%`);
    console.log(`Folds: PF(${folds.PF}) F(${folds.F}) T(${folds.T}) R(${folds.R})`);
    console.log(`Showdown Wins: ${pList.reduce((s, p) => s + p.stats.showdownWinCount, 0)}/${pList.reduce((s, p) => s + p.stats.showdownCount, 0)}`);
  };

  printGroupReport("SHARK (Advanced)", players.filter(p => p.id.startsWith('shark')));
  printGroupReport(`${opp} (Basic) `, players.filter(p => p.id.startsWith(opp)));
  printGroupReport(`${opp2} (Basic2) `, players.filter(p => p.id.startsWith(opp2)));

  console.log("\nDetailed Final Chips:");
  players.forEach(p => console.log(`${p.name}: ${p.chips} ${p.stats.bankrupt ? '(BANKRUPT)' : ''}`));
}

runSimulation();

