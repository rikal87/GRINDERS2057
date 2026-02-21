
import { PotManager } from './src/logic/PotManager.js';
import { evaluateHand } from './src/logic/poker.js';

console.log("Starting Showdown Logic Test...");

// 1. Setup Scenario
// Board: 2h, 5h, 8h, Qd, Kd (3 Hearts on board)
const board = ['2h', '5h', '8h', 'Qd', 'Kd'];

// Player A (User): 2s, 3s -> Pair of 2s (2s, 2h, Kd, Qd, 8h)
const playerA = {
  id: 'playerA',
  name: 'User (One Pair)',
  chips: 0,
  currentBet: 100,
  totalWagered: 100,
  isFolded: false,
  hand: ['2s', '3s']
};

// Player B (Opponent): Ah, Th -> Flush (Ah, Th, 8h, 5h, 2h)
const playerB = {
  id: 'playerB',
  name: 'Opponent (Flush)',
  chips: 0,
  currentBet: 100,
  totalWagered: 100,
  isFolded: false,
  hand: ['Ah', 'Th']
};

const players = [playerA, playerB];

// 2. Evaluate Hands manually first to verify poker.js
console.log("--- Hand Evaluation ---");
const evalA = evaluateHand([...playerA.hand, ...board]);
console.log(`Player A Hand: ${evalA.name} (Rank: ${evalA.rank}, Total: ${evalA.total})`);

const evalB = evaluateHand([...playerB.hand, ...board]);
console.log(`Player B Hand: ${evalB.name} (Rank: ${evalB.rank}, Total: ${evalB.total})`);

if (evalB.rank > evalA.rank) {
  console.log("SUCCESS: poker.js evaluates Flush > One Pair correctly.");
} else {
  console.error("FAILURE: poker.js evaluates One Pair >= Flush!");
}

// 3. Test PotManager
console.log("\n--- PotManager Resolution ---");
const potManager = new PotManager();
potManager.pot = 200;
potManager.currentRoundBet = 100;

// Resolve
const result = potManager.resolveShowdown(players, board);

console.log("Winner ID:", result.winnerId);
result.results.forEach(r => {
  console.log(`Player ${r.id}: Winner=${r.isWinner}, Amount=${r.amountWon}, Hand=${r.hand.name}`);
});

if (result.winnerId === 'playerB') {
  console.log("SUCCESS: PotManager declared the Flush player as the winner.");
} else {
  console.error(`FAILURE: PotManager declared ${result.winnerId} as the winner!`);
}
