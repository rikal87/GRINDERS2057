import { evaluateHand } from './src/logic/poker.js';

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
  } else {
    console.log(`PASS: ${message}`);
  }
}

function testPokerLogic() {
  console.log('--- Testing Poker Logic ---');

  // 1. Pair vs Pair + Kicker
  // P1: Pair 8s, Ace Kicker (8,8,A,K,4)
  // P2: Pair 8s, King Kicker (8,8,K,Q,4)
  const h1 = ['8s', '8h', 'As', 'Ks', '4s'];
  const h2 = ['8d', '8c', 'Kd', 'Qd', '4d'];

  const s1 = evaluateHand(h1);
  const s2 = evaluateHand(h2);

  console.log(`P1 Score: ${s1.total}, P2 Score: ${s2.total}`);
  assert(s1.total > s2.total, 'Pair 8s (Ace Kicker) > Pair 8s (King Kicker)');

  // 2. Pair vs Pair + Lower Kicker (5th card)
  // P1: 8 8 A K 5
  // P2: 8 8 A K 3
  const h3 = ['8s', '8h', 'As', 'Ks', '5s'];
  const h4 = ['8d', '8c', 'Ad', 'Kd', '3d'];
  const s3 = evaluateHand(h3);
  const s4 = evaluateHand(h4);
  assert(s3.total > s4.total, 'Pair 8s (5th kicker 5) > Pair 8s (5th kicker 3)');

  // 3. Two Pair Kicker
  // P1: A A 8 8 K
  // P2: A A 8 8 Q
  const h5 = ['As', 'Ah', '8s', '8h', 'Ks'];
  const h6 = ['Ad', 'Ac', '8d', '8c', 'Qd'];
  const s5 = evaluateHand(h5);
  const s6 = evaluateHand(h6);
  assert(s5.total > s6.total, 'Two Pair (K kicker) > Two Pair (Q kicker)');

  // 4. Wheel Straight (A-5) vs 6-High Straight
  // Wheel: 5 4 3 2 A
  // 6High: 6 5 4 3 2
  const wheel = ['5s', '4s', '3s', '2s', 'Ah'];
  const sixHigh = ['6s', '5d', '4d', '3d', '2d'];
  const sWheel = evaluateHand(wheel);
  const sSix = evaluateHand(sixHigh);

  console.log(`Wheel Rank: ${sWheel.rank}, Name: ${sWheel.name}, Total: ${sWheel.total}`);
  console.log(`6High Rank: ${sSix.rank}, Name: ${sSix.name}, Total: ${sSix.total}`);

  assert(sSix.total > sWheel.total, '6-High Straight > Wheel Straight (5-High)');

  // 5. Wheel Straight vs High Card
  // Wheel vs A K Q J 9 (Ace High)
  const aceHigh = ['As', 'Ks', 'Qs', 'Js', '9s'];
  const sAceHigh = evaluateHand(aceHigh);
  assert(sWheel.total > sAceHigh.total, 'Wheel > Ace High');

  // 6. Split Pot (Identical Hands)
  const h7 = ['As', 'Ks', 'Qs', 'Js', '9s'];
  const h8 = ['Ad', 'Kd', 'Qd', 'Jd', '9d'];
  const s7 = evaluateHand(h7);
  const s8 = evaluateHand(h8);
  assert(s7.total === s8.total, 'Identical hands have equal score');

  // 7. Full House vs Full House
  // 888 44 vs 888 22
  const fh1 = ['8s', '8h', '8d', '4s', '4h'];
  const fh2 = ['8c', '8d', '8h', '2s', '2h'];
  const sfh1 = evaluateHand(fh1);
  const sfh2 = evaluateHand(fh2);
  assert(sfh1.total > sfh2.total, 'FH 88844 > FH 88822');

}

testPokerLogic();
