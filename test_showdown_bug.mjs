
import { evaluateHand } from './src/logic/poker.js';
import { PotManager } from './src/logic/PotManager.js';

console.log("Starting Test...");

try {
  const board = ['2h', '5h', '8h', 'Qd', 'Kd'];
  const handA = ['2s', '3s'];
  const handB = ['Ah', 'Th'];

  console.log("Evaluating Hand A...");
  const evalA = evaluateHand([...handA, ...board]);
  console.log("Hand A:", evalA.name, evalA.total);

  console.log("Evaluating Hand B...");
  const evalB = evaluateHand([...handB, ...board]);
  console.log("Hand B:", evalB.name, evalB.total);

  if (evalB.total > evalA.total) {
    console.log("OK: Flush > One Pair");
  } else {
    console.error("FAIL: One Pair >= Flush");
  }

  const pm = new PotManager();
  const players = [
    { id: 'A', hand: handA, isFolded: false, totalWagered: 100, chips: 0, currentBet: 100 },
    { id: 'B', hand: handB, isFolded: false, totalWagered: 100, chips: 0, currentBet: 100 }
  ];

  console.log("Resolving Showdown...");
  const result = pm.resolveShowdown(players, board);
  console.log("Winner:", result.winnerId);

} catch (e) {
  console.error("CRASH:", e);
}
console.log("Done.");
process.exit(0);
