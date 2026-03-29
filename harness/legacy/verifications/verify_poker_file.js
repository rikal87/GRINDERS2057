import fs from 'fs';
import { evaluateHand } from './src/logic/poker.js';

function assert(condition, message) {
  if (!condition) {
    fs.writeFileSync('verify_result.txt', `FAIL: ${message}`);
    process.exit(1);
  }
}

function testPokerLogic() {
  try {
    // ... (Same test cases as before)
    // 1. Pair vs Pair + Kicker
    const h1 = ['8s', '8h', 'As', 'Ks', '4s'];
    const h2 = ['8d', '8c', 'Kd', 'Qd', '4d'];
    const s1 = evaluateHand(h1);
    const s2 = evaluateHand(h2);
    assert(s1.total > s2.total, 'Pair 8s (Ace Kicker) > Pair 8s (King Kicker)');

    // 2. Wheel Straight vs 6-High Straight
    const wheel = ['5s', '4s', '3s', '2s', 'Ah'];
    const sixHigh = ['6s', '5d', '4d', '3d', '2d'];
    const sWheel = evaluateHand(wheel);
    const sSix = evaluateHand(sixHigh);
    assert(sSix.total > sWheel.total, '6-High Straight > Wheel Straight');

    fs.writeFileSync('verify_result.txt', 'PASS');
  } catch (e) {
    fs.writeFileSync('verify_result.txt', `ERROR: ${e.message}`);
  }
}

testPokerLogic();
