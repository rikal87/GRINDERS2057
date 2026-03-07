import { getAdvancedAIAction } from '../src/logic/aiEngineAdvanced.js';

const mockEngine = {
  bb: 2,
  state: 'RIVER',
  players: [
    { id: 'shark_0', name: 'Shark', chips: 10000, currentBet: 0, totalWagered: 100, class: { AF: 3.5, WTSD: 0.24, vPIP: 0.27 } },
    { id: 'Max_0', name: 'Max', chips: 10000, currentBet: 200, totalWagered: 200, stats: { betsCount: 50, callsCount: 10, handsPlayed: 50, vpipCount: 15 } }
  ],
  board: ['As', 'Kd', '7s', '2h', '3c'],
  dealerIndex: 0,
  currentRoundBet: 200,
  pot: 200
};

const player = mockEngine.players[0];
player.hand = ['9h', '8h']; // Absolute garbage (Air) on this board

console.log("--- Testing Bluff Catching vs High AF (AF=4) ---");
const result = getAdvancedAIAction(player, mockEngine);
console.log("Result:", JSON.stringify(result, null, 2));

if (result.type === 'call') {
  console.log("BUG CONFIRMED: AI called with AIR because of high opponent AF!");
} else {
  console.log("AI correctly folded.");
}
