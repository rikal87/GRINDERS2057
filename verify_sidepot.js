import { PotManager } from './src/logic/PotManager.js';

// Mock evaluateHand to avoid dependency complexity
// Returns fixed scores based on our scenario
// Scenario:
// P1 (Short Stack): AA (Winning Hand) - All-in Preflop (2000 chips)
// P2 (Deep Stack): KK (2nd Best) - Calls P1, bets more on Turn (5000 chips total)
// P3 (Deep Stack): QQ (Loser) - Calls P1, Calls P2 (5000 chips total)

const MOCK_HANDS = {
  'p1': { total: 1000, name: 'AA' }, // Best
  'p2': { total: 800, name: 'KK' },  // 2nd
  'p3': { total: 500, name: 'QQ' }   // 3rd
};

// Mock Poker Module
import * as poker from './src/logic/poker.js';
poker.evaluateHand = (cards) => {
  // We can infer player from cards if we track it, but here we just mock
  // In PotManager, it evaluates p.hand + board.
  // Let's cheat by attaching 'id' to card? No.
  // Let's map by hand content.
  const handStr = cards.slice(0, 2).join('');
  if (handStr === 'AsAh') return MOCK_HANDS.p1;
  if (handStr === 'KsKh') return MOCK_HANDS.p2;
  if (handStr === 'QsQh') return MOCK_HANDS.p3;
  return { total: 0 };
};

function testSidePots() {
  console.log('--- Testing Side Pot Logic ---');
  const pm = new PotManager(0, 0); // No rake for clarity

  const p1 = { id: 'p1', name: 'Shorty', chips: 2000, currentBet: 0, totalWagered: 0, hand: ['As', 'Ah'], isFolded: false };
  const p2 = { id: 'p2', name: 'Deep1', chips: 10000, currentBet: 0, totalWagered: 0, hand: ['Ks', 'Kh'], isFolded: false };
  const p3 = { id: 'p3', name: 'Deep2', chips: 10000, currentBet: 0, totalWagered: 0, hand: ['Qs', 'Qh'], isFolded: false };

  const players = [p1, p2, p3];

  // Preflop: P1 All-in (2000), P2 Call (2000), P3 Call (2000)
  console.log('Preflop: P1 All-in 2000, P2 Call, P3 Call');
  pm.placeBet(p1, 2000);
  pm.placeBet(p2, 2000);
  pm.placeBet(p3, 2000);

  // Pot should be 6000
  console.log(`Pot after Preflop: ${pm.pot} (Expected 6000)`);

  // Turn: P2 Bets 3000 more, P3 Calls 3000 more
  // P1 is all-in, ignores this.
  console.log('Turn: P2 Bets 3000, P3 Call');
  pm.placeBet(p2, 3000); // Total 5000
  pm.placeBet(p3, 3000); // Total 5000

  // Pot should be 6000 + 6000 = 12000
  console.log(`Pot after Turn: ${pm.pot} (Expected 12000)`);

  // Showdown
  // P1 (AA) beats everyone but only eligible for Main Pot (2000*3 = 6000).
  // Side Pot (3000*2 = 6000) is between P2 (KK) and P3 (QQ).
  // P2 should win Side Pot. 
  // P1 should win Main Pot.

  console.log('Resolving Showdown...');
  const result = pm.resolveShowdown(players, []);

  // Analyze Results
  result.results.forEach(r => {
    console.log(`Player ${r.id} (${r.hand.name}) Won: ${r.amountWon}`);
  });

  // Validations
  const p1Win = result.results.find(r => r.id === 'p1').amountWon;
  const p2Win = result.results.find(r => r.id === 'p2').amountWon;
  const p3Win = result.results.find(r => r.id === 'p3').amountWon;

  if (p1Win === 6000 && p2Win === 6000 && p3Win === 0) {
    console.log('PASS: Logic Valid. P1 took Main Pot (6000), P2 took Side Pot (6000).');
  } else {
    console.error('FAIL: Distribution incorrect.');
    console.error(`Expected: P1=6000, P2=6000, P3=0`);
    console.error(`Actual: P1=${p1Win}, P2=${p2Win}, P3=${p3Win}`);
  }
}

testSidePots();
