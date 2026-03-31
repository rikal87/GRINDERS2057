
import { PotManager } from './src/logic/PotManager.js';

const potManager = new PotManager(0.05, 50);

const players = [
  { id: 'player', name: 'YOU', chips: 1000, currentBet: 0, totalWagered: 1, isMe: true }, // SB
  { id: 'ai1', name: 'AI 1', chips: 1000, currentBet: 0, totalWagered: 2 }, // BB
  { id: 'ai2', name: 'AI 2', chips: 1000, currentBet: 6, totalWagered: 6 }  // Raiser (won)
];

// Everyone else folded to ai2 pre-flop.
// Next step in game logic would be returning uncalled bets.
// Second highest wager is 2. So ai2 gets 4 back.
// Pot becomes 1+2+2 = 5.

console.log("--- Pre-flop Fold Scenario ---");
const result = potManager.resolveShowdown(players, [], true); // isNoFlopNoDrop = true
console.log("Rake Collected:", result.rake);
console.log("Detailed Pots:", JSON.stringify(result.detailedPots, null, 2));

console.log("\n--- All-In Pre-flop Scenario (Runout) ---");
const playersAllIn = [
  { id: 'player', name: 'YOU', chips: 0, currentBet: 0, totalWagered: 100, isMe: true },
  { id: 'ai1', name: 'AI 1', chips: 0, currentBet: 0, totalWagered: 100 },
];
// Betting ended pre-flop, but board was run out!
const boardFull = ['Ah', 'Kh', 'Qh', 'Jh', 'Th'];
const resultAllIn = potManager.resolveShowdown(playersAllIn, boardFull, boardFull.length === 0);
console.log("Board Length:", boardFull.length);
console.log("Rake Collected:", resultAllIn.rake);
if (resultAllIn.rake > 0) {
  console.log("BUG CONFIRMED: Rake was taken even though betting ended pre-flop (due to board length 5)");
} else {
  console.log("Logic passed (No rake taken)");
}
