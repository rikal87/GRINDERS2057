import fs from 'fs';
import { createDeck } from './poker.js';
import { CLASSES_ENEMY as D1, CLASSES_PARTNER as D2 } from './persona.js'
import { getAIAction } from './aiEngine.js';
import { getUnifiedAction as getAdvancedAIAction } from './aiEngine/aiBrainHub.js';
import { PotManager } from './PotManager.js';

const CLASSES_ENEMY = [...D2, ...D1]
export async function runSimulation() {
  const opp1 = 'Florence'
  const opp2 = 'gangster'
  const opp3 = 'shark'
  console.log(`Starting DB Simulation (${opp1} vs ${opp2} vs ${opp3})...`);
  const logHeader = `Simulation Log - ${new Date().toLocaleString()}\n\n`;
  fs.writeFileSync('hand_history.log', logHeader, 'utf8');

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
      threeBetOppCount: 0,
      fourBetPlusCount: 0,
      fourBetOppCount: 0,
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
    players.push(createPlayer(`${opp1}_${i}`, `${opp1}_${i}`, oop1Template, 2000));
    players.push(createPlayer(`${opp2}_${i}`, `${opp2}_${i}`, oop2Template, 2000));
    players.push(createPlayer(`${opp3}_${i}`, `${opp3}_${i}`, oop3Template, 2000));
  }

  const handsToPlay = 1000;
  console.log(`Initialized 6 players. Running ${handsToPlay} hands...`);

  const engine = {
    bb: 20,
    sb: 10,
    board: [],
    aggressor: null,
    players: players,
    locationId: 'test_zone',
    dealerIndex: 0,
    currentRoundBet: 0,
    state: 'PREFLOP',
    currentStreetRaises: 0,
    preflopRaises: 0,
    pot: 0,
  };

  const potManager = new PotManager(0.05, 50);

  for (let hand = 0; hand < handsToPlay; hand++) {
    const deck = createDeck();
    engine.board = [];
    potManager.resetHand();
    engine.aggressor = null;
    engine.currentStreetRaises = 0;
    engine.preflopRaises = 0;
    engine.handHistory = []; // [DEBUG OVERHAUL] Track storyline
    engine.actionHistory = []; // [v3.0] Structured history for AI analysis

    const activeGroups = new Set(players.filter(p => p.chips > 0).map(p => p.class.id));
    if (activeGroups.size <= 1) {
      console.log(`!!!Simulation complete: Only group [${Array.from(activeGroups)[0] || 'NONE'}] remains.`);
      break;
    }

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
      engine.currentStreetRaises = 0;

      // Initialize acted status for the street
      players.forEach(p => p.actedThisStreet = false);

      let attempts = 0;
      const maxAttempts = 200; // Safety break

      while (attempts < maxAttempts) {
        attempts++;

        // CHECK TERMINATION CONDITION
        // Round ends if:
        // 1. Every non-folded player has acted at least once this street AND
        // 2. Every non-folded player has matched the currentRoundBet (or is All-In)
        const activePlayers = players.filter(p => !p.isFolded);
        const missingAction = activePlayers.find(p => p.chips > 0 && !p.actedThisStreet);
        const missingMatch = activePlayers.find(p => p.chips > 0 && p.currentBet !== potManager.currentRoundBet);

        if (!missingAction && !missingMatch) break;
        if (activePlayers.length <= 1) break;

        const p = players[actingIdx];

        if (!p.isFolded && p.chips > 0) {
          const callAmt = potManager.currentRoundBet - p.currentBet;
          engine.currentRoundBet = potManager.currentRoundBet;
          engine.pot = potManager.pot;

          let action = getUnifiedAction(p, engine);
          let amount = 0;

          let rangeEst = action.rangeEstimate ? ` [Range: ${action.rangeEstimate}]` : '';
          let expTrigger = action.exploitTrigger ? ` [Exploit: ${action.exploitTrigger}]` : '';

          if (action.type === 'fold') {
            engine.handHistory.push(`[${street}] ${p.name}: Folds${rangeEst}${expTrigger}`);
            engine.actionHistory.push({ playerId: p.id, street, action: 'fold', amount: 0 });
            p.isFolded = true;
            if (engine.aggressor === p.id) engine.aggressor = null;
            p.stats.foldsPerStreet[street]++;

            // Check if hand should end immediately
            if (players.filter(px => !px.isFolded).length <= 1) break;
          } else {
            if (action.type === 'check' || action.type === 'call') {
              amount = callAmt;
              if (engine.aggressor === p.id) engine.aggressor = null;

              engine.handHistory.push(`[${street}] ${p.name}: ${action.type === 'check' ? 'Checks' : 'Calls ' + amount}${rangeEst}${expTrigger} - <${action.insight}>`);
              engine.actionHistory.push({ playerId: p.id, street, action: action.type, amount: amount });

              if (amount > 0 && !p.handState.didVpip) {
                p.stats.vpipCount++;
                p.handState.didVpip = true;
              }
              if (street !== 'PREFLOP' && action.type === 'call') {
                p.stats.callsCount++;
              }
              p.actedThisStreet = true;
            } else {
              // Raise or Bet
              const targetAmount = action.amount || (callAmt + engine.bb);
              amount = targetAmount - p.currentBet;
              if (amount > p.chips) amount = p.chips;

              const totalBetOnStreet = p.currentBet + amount;
              const isActualRaise = totalBetOnStreet > potManager.currentRoundBet;
              engine.handHistory.push(`[${street}] ${p.name}: Raises to ${totalBetOnStreet}${rangeEst}${expTrigger} - <${action.insight}>`);
              engine.actionHistory.push({ playerId: p.id, street, action: isActualRaise ? 'raise' : 'bet', amount: totalBetOnStreet });

              if (isActualRaise) {
                engine.currentStreetRaises++;
                if (street === 'PREFLOP') {
                  engine.preflopRaises++;
                  if (engine.currentStreetRaises === 1) {
                    if (!p.handState.didPfr) { p.stats.pfrCount++; p.handState.didPfr = true; }
                    // [FIX] Register 3-Bet opportunity for all other active players
                    players.forEach(px => {
                      if (px.id !== p.id && !px.isFolded && px.chips > 0) {
                        px.stats.threeBetOppCount++;
                      }
                    });
                  } else if (engine.currentStreetRaises === 2) {
                    if (!p.handState.didThreeBet) { p.stats.threeBetCount++; p.handState.didThreeBet = true; }
                    // [v5.0] Track 4-Bet Opportunities
                    players.forEach(px => {
                      if (px.id !== p.id && !px.isFolded && px.chips > 0) {
                        px.stats.fourBetOppCount++;
                      }
                    });
                  } else if (engine.currentStreetRaises >= 3) {
                    if (!p.handState.didFourBetPlus) { p.stats.fourBetPlusCount++; p.handState.didFourBetPlus = true; }
                  }
                }
                engine.aggressor = p.id;

                // CRITICAL: A raise resets acted state for EVERYONE ELSE
                players.forEach(px => px.actedThisStreet = false);
              }

              p.actedThisStreet = true;

              if (!p.handState.didVpip) {
                p.stats.vpipCount++;
                p.handState.didVpip = true;
              }
              if (isActualRaise && street !== 'PREFLOP') {
                p.stats.betsCount++;
              }
            }

            if (amount > 0) {
              potManager.placeBet(p, amount);
            }
          }
        } else if (!p.isFolded && p.chips <= 0) {
          // Player is All-In, just ensure they are marked acted
          p.actedThisStreet = true;
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

    // [HAND HISTORY DUMP] Always dump to hand_history.log
    let hhText = `\n======================================\n`;
    hhText += `[HAND HISTORY DUMP] Hand #${hand} | Pot: ${potManager.pot} | Board: [${engine.board.join(', ')}]\n`;
    hhText += `Players: ${players.filter(p => !p.isFolded || p.totalWagered > 0).map(p => `${p.name} (${p.hand.join(',')})`).join(' | ')}\n`;
    hhText += `--------------------------------------\n`;
    engine.handHistory.forEach(log => hhText += log + '\n');
    if (result.results) {
      hhText += `Showdown Results:\n`;
      result.results.forEach(r => {
        hhText += `  - ${r.id}: ${r.hand.name} (${r.player.hand.join(',')})\n`;
      });
    }
    if (result.winnerId) hhText += `Winner: ${result.winnerId}\n`;
    hhText += `======================================\n`;

    fs.appendFileSync('hand_history.log', hhText, 'utf8');

    // [HAND HISTORY DUMP] For Significant Pots (> 500) ALSO dump to big_pots_hh.txt
    if (potManager.pot > 500) {
      console.log(hhText);
      fs.appendFileSync('big_pots_hh.txt', hhText, 'utf8');
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
    const current3bOppCount = pList.reduce((acc, p) => acc + p.stats.threeBetOppCount, 0);
    const current4bCount = pList.reduce((acc, p) => acc + p.stats.fourBetPlusCount, 0);
    const current4bOppCount = pList.reduce((acc, p) => acc + p.stats.fourBetOppCount, 0);
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
    if (!m.threeBetOppCountRaw) m.threeBetOppCountRaw = 0;
    m.threeBetOppCountRaw += current3bOppCount;
    m.fourBetCountRaw += current4bCount;
    if (!m.fourBetOppCountRaw) m.fourBetOppCountRaw = 0;
    m.fourBetOppCountRaw += current4bOppCount;
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
    s["3B"] = Number((m.threeBetCountRaw / (m.threeBetOppCountRaw || 1) * 100).toFixed(1));
    s["4B+"] = Number((m.fourBetCountRaw / (m.fourBetOppCountRaw || 1) * 100).toFixed(1));
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

