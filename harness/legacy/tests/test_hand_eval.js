
import { evaluateHand, getSimpleHandCategory, getHandCategory } from './src/logic/poker.js';

const tests = [
  {
    name: 'Guaranteed Royal Flush on Board',
    hand: ['2c', '7d'],
    board: ['As', 'Ks', 'Qs', 'Js', 'Ts'],
    expectations: { simple: 'BOARD_CHOP', advanced: 'BOARD_CHOP' }
  },
  {
    name: 'Quads on Board with Ace Kicker (Nuts)',
    hand: ['2c', '7d'],
    board: ['As', 'Ac', 'Ah', 'Ad', 'Ks'],
    expectations: { simple: 'BOARD_CHOP', advanced: 'BOARD_CHOP' }
  },
  {
    name: 'Straight on Board but not Nuts (Vulnerable to Flush)',
    hand: ['2h', '3d'],
    board: ['Ts', 'Js', 'Qs', 'Kh', 'Ad'], // kh -> Kh
    expectations: { simple: 'WEAK', advanced: 'WEAK' }
  }
];

console.log('--- DEFINITIVE CHOP TESTS ---');

let allPassed = true;

tests.forEach(t => {
  const evalResult = evaluateHand([...t.hand, ...t.board]);
  const simpleCat = getSimpleHandCategory(t.hand, t.board, evalResult);
  const advancedCat = getHandCategory(t.hand, t.board, evalResult);

  console.log(`Test: ${t.name}`);
  console.log(`  Simple: ${simpleCat} (Expected: ${t.expectations.simple})`);
  console.log(`  Advanced: ${advancedCat} (Expected: ${t.expectations.advanced})`);

  if (simpleCat === t.expectations.simple && advancedCat === t.expectations.advanced) {
    console.log('  PASS');
  } else {
    allPassed = false;
    console.log('  FAIL');
  }
});

if (allPassed) {
  console.log('\nALL DEFINITIVE TESTS PASSED!');
} else {
  process.exit(1);
}
