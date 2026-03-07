import fs from 'fs';
import { createDeck } from './poker.js';
import { getUnifiedAction } from './aiEngine/aiBrainHub.js';
import { PotManager } from './PotManager.js';
import { getAIAction } from './aiEngine.js';
import { CLASSES_PARTNER } from './persona.js';

/**
 * AI vs AI Match Simulation Script
 */
async function runSimulation() {
  const opp1 = process.argv[2] || 'old_lion';
  const opp2 = process.argv[3] || 'gangster';
  const opp3 = process.argv[4] || 'Max';

  const players = [];
  const getPersona = (id) => CLASSES_PARTNER.find(p => p.id === id) || { id };
  const oop1Template = { id: opp1, class: getPersona(opp1), chips: 1000 };
  const oop2Template = { id: opp2, class: getPersona(opp2), chips: 1000 };
  const oop3Template = { id: opp3, class: getPersona(opp3), chips: 1000 };
  const getAction = (p, engine) => {
    if (p.class.id === 'shark') {
      return getUnifiedAction(p, engine);
    };
    // !!!!!!!!!!!!!!!do not edit this line!!!!!!!!!!!!!!!
    return getAIAction(p, engine);
    // !!!!!!!!!!!!!!!do not edit this line!!!!!!!!!!!!!!!
    // !!!!!!!!!!!!!!!do not edit this line!!!!!!!!!!!!!!!
    // !!!!!!!!!!!!!!!do not edit this line!!!!!!!!!!!!!!!
    // !!!!!!!!!!!!!!!do not edit this line!!!!!!!!!!!!!!!
  }
  const createPlayer = (id, name, template, chips) => ({
    ...template,
    id,
    name,
    chips,
    startChips: chips,
    hand: [],
    currentBet: 0,
    totalWagered: 0,
    isFolded: false,
    stats: {
      handsPlayed: 0,
      vpipCount: 0,
      pfrCount: 0,
      threeBetCount: 0,
      fourBetPlusCount: 0,
      wins: 0,
      showdownCount: 0,
      showdownWinCount: 0,
      bluffCatchCount: 0,
      bluffCatchWinCount: 0,
      sawFlopCount: 0,
      sawTurnCount: 0,
      sawRiverCount: 0,
      foldsPerStreet: { PREFLOP: 0, FLOP: 0, TURN: 0, RIVER: 0 },
      totalProfit: 0,
      bankrupt: false
    },
    handState: {
      didVpip: false,
      didPfr: false,
      didThreeBet: false,
      didFourBetPlus: false,
      attemptedBluffCatch: false,
      facedRaise: false
    }
  });

  for (let i = 0; i < 2; i++) {
    players.push(createPlayer(`${opp1}_${i}`, `${opp1}_${i}`, oop1Template, 10000));
    players.push(createPlayer(`${opp2}_${i}`, `${opp2}_${i}`, oop2Template, 10000));
    players.push(createPlayer(`${opp3}_${i}`, `${opp3}_${i}`, oop3Template, 10000));
  }

  let handsToPlay = 2000;
  const handHistoryFile = 'hand_history.log';
  fs.writeFileSync(handHistoryFile, `Simulation Log - ${new Date().toLocaleString()}\n`, 'utf8');

  console.log(`Initialized 6 players. Running ${handsToPlay} hands...`);

  const engine = {
    bb: 10,
    sb: 5,
    board: [],
    aggressor: null,
    players: players,
    locationId: 'test_zone',
    dealerIndex: 0,
    currentRoundBet: 0,
    state: 'PREFLOP',
    currentStreetRaises: 0,
    aggressor: null, // Track who raised preflop for C-Bet logic
    preflopRaises: 0,
    pot: 0,
  };

  const potManager = new PotManager(0.05, 50);

  for (let hand = 0; hand < handsToPlay; hand++) {
    const deck = createDeck();
    engine.board = [];
    potManager.resetHand();
    engine.currentStreetRaises = 0;
    engine.preflopRaises = 0;
    engine.handHistory = []; // [DEBUG OVERHAUL] Track storyline
    engine.actionHistory = []; // [v23] Track structured actions for Brain analysis
    engine.aggressor = null;
    const alivePlayer = players.filter(p => p.chips > 0);
    // const bustHero = players.filter(p => p.class.id === 'shark' && p.chips === 0);
    // const alivePlayerisShark = alivePlayer.filter(p => p.class.id === 'shark')
    if (alivePlayer.length <= 2) break;

    players.forEach(p => {
      p.hand = [deck.pop(), deck.pop()];
      p.isFolded = p.chips <= 0;
      p.currentBet = 0;
      p.totalWagered = 0;
      p.handState = { didVpip: false, didPfr: false, didThreeBet: false, didFourBetPlus: false, attemptedBluffCatch: false, facedRaise: false };
      p.actionHistory = [];
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
      engine.currentStreetRaises = 0;
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
          let action = getAction(p, engine);
          let amount = 0;
          let actionType = action.type || action.action;

          let rangeEst = action.rangeEstimate ? ` [Range: ${action.rangeEstimate}]` : '';
          let expTrigger = action.exploitTrigger ? ` [Exploit: ${action.exploitTrigger}]` : '';

          if (actionType === 'fold') {
            engine.handHistory.push(`[${street}] ${p.name}: Folds${rangeEst}${expTrigger}`);
            p.isFolded = true;
            p.stats.foldsPerStreet[street]++;
            activeInRound = activeInRound.filter(x => x.id !== p.id);
            if (activeInRound.length <= 1) break;
            consecutiveChecksOrCalls++;
            if (engine.aggressor === p.id) {
              engine.aggressor = null; // reset aggressor if we check or call
            }
          } else {
            if (actionType === 'check' || actionType === 'call') {
              if (engine.aggressor === p.id) {
                engine.aggressor = null; // reset aggressor if we check or call
              }
              amount = callAmt;
              consecutiveChecksOrCalls++;
              engine.handHistory.push(`[${street}] ${p.name}: ${actionType === 'check' ? 'Checks' : 'Calls ' + amount}${rangeEst}${expTrigger} - <${action.insight}>`);
              if (amount > 0 && !p.handState.didVpip) {
                p.stats.vpipCount++;
                p.handState.didVpip = true;
              }
              if (street !== 'PREFLOP' && actionType === 'call') {
                p.stats.callsCount++;
              }
              if (action.isBluffCatch) {
                p.stats.bluffCatchCount++;
                p.handState.attemptedBluffCatch = true;
              }
            } else {

              amount = action.amount || (callAmt + engine.bb);
              if (amount > p.chips + p.currentBet) amount = p.chips + p.currentBet;

              const isActualRaise = amount > potManager.currentRoundBet;

              engine.handHistory.push(`[${street}] ${p.name}: Raises to ${amount}${rangeEst}${expTrigger} - <${action.insight}>`);

              if (isActualRaise) {
                engine.aggressor = p.id;
                engine.currentStreetRaises++;
                players.filter(other => !other.isFolded && other.id !== p.id).forEach(other => {
                  other.handState.facedRaise = true;
                });
                if (street === 'PREFLOP') {
                  if (engine.currentStreetRaises === 1) {
                    if (!p.handState.didPfr) { p.stats.pfrCount++; p.handState.didPfr = true; }
                  } else if (engine.currentStreetRaises === 2) {
                    if (!p.handState.didThreeBet) { p.stats.threeBetCount++; p.handState.didThreeBet = true; }
                  } else if (engine.currentStreetRaises >= 3) {
                    if (!p.handState.didFourBetPlus) { p.stats.fourBetPlusCount++; p.handState.didFourBetPlus = true; }
                  }

                  engine.preflopRaises = engine.currentStreetRaises;
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

            const historyEntry = { playerId: p.id, street, action: actionType, amount };
            players.filter(p => p.class.id === opp1).forEach(shark => {
              if (!shark.actionHistory) shark.actionHistory = [];
              shark.actionHistory.push(historyEntry);
            });
          }
        }
        actingIdx = (actingIdx + 1) % players.length;
      }
      players.forEach(p => p.currentBet = 0);
      potManager.currentRoundBet = 0;
    };

    potManager.placeBet(players[(dealerIdx + 1) % players.length], engine.sb);
    potManager.placeBet(players[(dealerIdx + 2) % players.length], engine.bb);
    runBettingRound('PREFLOP');

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

    const activeAtEnd = players.filter(p => !p.isFolded);
    if (activeAtEnd.length > 1) activeAtEnd.forEach(p => p.stats.showdownCount++);

    const result = potManager.resolveShowdown(players, engine.board, engine.board.length === 0);
    if (result.winnerId) {
      const winner = players.find(p => p.id === result.winnerId);
      if (winner) {
        winner.stats.wins++;
        if (activeAtEnd.length > 1) {
          winner.stats.showdownWinCount++;
          if (winner.handState.attemptedBluffCatch) {
            winner.stats.bluffCatchWinCount++;
          }
        }
      }
    }

    const totalPotBB = potManager.pot / engine.bb;
    if (totalPotBB >= 30 || activeAtEnd.length > 1) {
      const involved = players.filter(p => p.totalWagered > engine.bb);
      if (involved.some(p => p.name.startsWith(opp1))) {
        let dump = `\n======================================\n`;
        dump += `[HAND HISTORY DUMP] Hand #${hand} | Pot: ${potManager.pot} (${totalPotBB.toFixed(1)} BB) | Board: [${engine.board.join(', ')}]\n`;
        dump += `Players: ${involved.map(p => `${p.name} (${p.hand.join(',')})`).join(' | ')}\n`;
        dump += `--------------------------------------\n`;
        engine.handHistory.forEach(log => dump += log + '\n');
        if (result.winnerId) dump += `Winner: ${result.winnerId}\n`;
        dump += `======================================\n`;
        fs.appendFileSync(handHistoryFile, dump, 'utf8');
      }
    }
  }

  players.forEach(p => {
    p.stats.totalProfit = p.chips - p.startChips;
    if (p.chips <= 0) p.stats.bankrupt = true;
  });

  const report = {};
  const groups = [opp1, opp2, opp3];
  groups.forEach(g => {
    const list = players.filter(p => p.class.id === g);
    const hands = list.reduce((s, p) => s + p.stats.handsPlayed, 0) / list.length;
    const profit = list.reduce((s, p) => s + (p.chips - p.startChips), 0) / list.length;
    const vpip = (list.reduce((s, p) => s + p.stats.vpipCount, 0) / Math.max(1, list.reduce((s, p) => s + p.stats.handsPlayed, 0)) * 100).toFixed(1);
    const pfr = (list.reduce((s, p) => s + p.stats.pfrCount, 0) / Math.max(1, list.reduce((s, p) => s + p.stats.handsPlayed, 0)) * 100).toFixed(1);
    const threeB = (list.reduce((s, p) => s + p.stats.threeBetCount, 0) / Math.max(1, list.reduce((s, p) => s + p.stats.handsPlayed, 0)) * 100).toFixed(1);
    const fourB = (list.reduce((s, p) => s + p.stats.fourBetPlusCount, 0) / Math.max(1, list.reduce((s, p) => s + p.stats.handsPlayed, 0)) * 100).toFixed(1);

    report[g] = {
      "Hands Played(avg)": hands,
      "Profit": profit,
      "VPIP": parseFloat(vpip),
      "PFR": parseFloat(pfr),
      "3B": parseFloat(threeB),
      "4B+": parseFloat(fourB),
      "chips": list[0].chips,
      "bankrupt_count": list.filter(p => p.chips <= 0).length,
      "WTSD": `${(list.reduce((s, p) => s + p.stats.showdownCount, 0) / (list.reduce((s, p) => s + p.stats.sawFlopCount, 0) || 1) * 100).toFixed(1)}%`,
      "W$SD": `${(list.reduce((s, p) => s + p.stats.showdownWinCount, 0) / (list.reduce((s, p) => s + p.stats.showdownCount, 0) || 1) * 100).toFixed(1)}%`,
      "_meta": {
        "totalHandsRaw": list.reduce((s, p) => s + p.stats.handsPlayed, 0),
        "vpipCountRaw": list.reduce((s, p) => s + p.stats.vpipCount, 0),
        "pfrCountRaw": list.reduce((s, p) => s + p.stats.pfrCount, 0),
        "threeBetCountRaw": list.reduce((s, p) => s + p.stats.threeBetCount, 0),
        "fourBetCountRaw": list.reduce((s, p) => s + p.stats.fourBetPlusCount, 0),
        "showdownCountRaw": list.reduce((s, p) => s + p.stats.showdownCount, 0),
        "showdownWinCountRaw": list.reduce((s, p) => s + p.stats.showdownWinCount, 0)
      }
    };
  });
  fs.writeFileSync('simulation_result.json', JSON.stringify(report, null, 2));
}

runSimulation();
