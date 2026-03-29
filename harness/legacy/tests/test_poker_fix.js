import { evaluateHand, getSimpleHandCategory } from './src/logic/poker.js';

const testCases = [
  {
    name: "Max's Hand (Board Pair only - Ace High)",
    hand: ['Ac', '9d'],
    board: ['3h', '5h', '3c', '2c', 'Tc'],
    expected: 'ACE_HIGH'
  },
  {
    name: "Two Pair on Board (Matched nothing - Air)",
    hand: ['4d', '6s'],
    board: ['3h', '3s', '5h', '5s', 'Tc'],
    expected: 'AIR'
  },
  {
    name: "True Middle Pair (Should still be GOOD/MARGINAL)",
    hand: ['5d', '9s'],
    board: ['3h', '5h', '3c', '2c', 'Tc'],
    expected: 'GOOD' // or MARGINAL depending on kicker/texture, but NOT AIR
  }
];

testCases.forEach(tc => {
  const evalRes = evaluateHand([...tc.hand, ...tc.board]);
  const category = getSimpleHandCategory(tc.hand, tc.board, evalRes);
  console.log(`[TEST] ${tc.name}`);
  console.log(`       Category: ${category} (Expected: ${tc.expected})`);
  const success = (tc.expected === 'GOOD') ? (category !== 'AIR' && category !== 'ACE_HIGH') : (category === tc.expected);
  console.log(`       Success: ${success}`);
});
