
import { getAdvancedAIAction } from '../src/logic/aiEngineAdvanced.js';

// Mock engine state
const mockEngine = {
  state: 'FLOP',
  board: ['As', 'Ks', 'Qs'],
  pot: 100,
  currentRoundBet: 20,
  currentStreetRaises: 0,
  players: [
    { id: 'shark_1', name: 'Shark', hand: ['Js', 'Ts'], chips: 1000, currentBet: 0, totalWagered: 10, stats: {}, class: { AF: 3, WTSD: 0.5, vPIP: 0.25 } },
    { id: 'human', name: 'Human', hand: ['2h', '7d'], chips: 1000, currentBet: 20, totalWagered: 20, stats: {}, isHuman: true, class: { AF: 1.5, WTSD: 0.5, vPIP: 0.3 } }
  ],
  dealerIndex: 0,
  bb: 2,
  potManager: { currentRoundBet: 20, pot: 100 }
};

const player = mockEngine.players[0];
player.hand = ['Js', '2s']; // Very weak pair on As-Ks-Qs board (if we hit a 2)
// Actually let's make it a Middle Pair on a different board
mockEngine.board = ['Ts', '7h', '2c'];
player.hand = ['7s', '6s']; // Middle Pair
mockEngine.pot = 200;
mockEngine.currentRoundBet = 400; // Facing a 2x pot bet (Polarized/Bluff?)
player.currentBet = 0;
player.totalWagered = 50; 
mockEngine.potManager = { currentRoundBet: 400, pot: 200 }; 

console.log("Testing getAdvancedAIAction for a marginal hand scenario facing LARGE bet (Should FOLD)...");
const result = getAdvancedAIAction(player, mockEngine);

console.log("Result:", JSON.stringify(result, null, 2));

if (result && result.type) {
  console.log("SUCCESS: Action type is", result.type);
} else {
  console.error("FAIL: Decision is undefined or missing type!");
  process.exit(1);
}
