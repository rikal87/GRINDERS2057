import fs from 'fs';
import { PotManager } from './src/logic/PotManager.js';

// Mock Poker Module
// We need to mock evaluateHand differently because PotManager imports it
// Since we can't easily mock ES module imports in this simple script without a loader,
// we will Monkey Patch the PotManager instance or just rely on the fact that evaluateHand 
// is imported. 
// Actually, PotManager uses `evaluateHand` imported from `./poker.js`.
// We can't mock it easily here unless we use a test runner or modify PotManager to accept an evaluator.
// OR, we can just let it run real evaluateHand, but give the players real cards that match our scenario.

// Real Cards Scenario
// P1: As Ah (AA)
// P2: Ks Kh (KK)
// P3: Qs Qh (QQ)
// Board: 2d 3d 4d 5d 7c (Doesn't matter, AA > KK > QQ on dry board)

function testSidePots() {
  const log = [];
  const consoleLog = (msg) => log.push(msg);

  try {
    consoleLog('--- Testing Side Pot Logic ---');
    const pm = new PotManager(0, 0);

    const p1 = { id: 'p1', name: 'Shorty', chips: 2000, currentBet: 0, totalWagered: 0, hand: ['As', 'Ah'], isFolded: false };
    const p2 = { id: 'p2', name: 'Deep1', chips: 10000, currentBet: 0, totalWagered: 0, hand: ['Ks', 'Kh'], isFolded: false };
    const p3 = { id: 'p3', name: 'Deep2', chips: 10000, currentBet: 0, totalWagered: 0, hand: ['Qs', 'Qh'], isFolded: false };

    const players = [p1, p2, p3];
    // Board that ensures no flush/straight interference for these specific hands
    // AA vs KK vs QQ. 
    // Board: 7c 8d 2s 3h Jc
    const board = ['7c', '8d', '2s', '3h', 'Jc'];

    // Preflop: P1 All-in (2000), P2 Call (2000), P3 Call (2000)
    pm.placeBet(p1, 2000); // P1 All-in
    pm.placeBet(p2, 2000);
    pm.placeBet(p3, 2000);

    // Turn: P2 Bets 3000 more, P3 Calls 3000 more
    pm.placeBet(p2, 3000); // +3000 = 5000 Total
    pm.placeBet(p3, 3000); // +3000 = 5000 Total

    consoleLog(`Pot Total: ${pm.pot} (Expected 12000)`);

    // Resolve
    const result = pm.resolveShowdown(players, board);

    // Check Results
    const p1Res = result.results.find(r => r.id === 'p1');
    const p2Res = result.results.find(r => r.id === 'p2');
    const p3Res = result.results.find(r => r.id === 'p3');

    consoleLog(`P1 Won: ${p1Res.amountWon}`);
    consoleLog(`P2 Won: ${p2Res.amountWon}`);
    consoleLog(`P3 Won: ${p3Res.amountWon}`);

    // Logic Check
    // Main Pot (2000*3 = 6000). AA wins.
    // Side Pot (3000*2 = 6000). KK wins.
    // Total P1: 6000. Total P2: 6000. Total P3: 0.

    if (p1Res.amountWon === 6000 && p2Res.amountWon === 6000 && p3Res.amountWon === 0) {
      consoleLog('PASS: Side Pot Logic Verified.');
    } else {
      consoleLog('FAIL: Incorrect Distribution.');
    }

    fs.writeFileSync('verify_sidepot_out.txt', log.join('\n'));

  } catch (e) {
    fs.writeFileSync('verify_sidepot_out.txt', `ERROR: ${e.message}\n${e.stack}`);
  }
}

testSidePots();
