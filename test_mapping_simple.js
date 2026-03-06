
import { getAdvancedAIAction } from './src/logic/aiEngineAdvanced.js';

async function run() {
  console.log("--- START MAPPING TEST ---");
  // Mock Engine
  const engine = {
    players: [
      { id: 'p0', currentBet: 0, hand: ['As', 'Ks'], chips: 1000 }, // SB (Hero)
      { id: 'p1', currentBet: 50, chips: 1000 }, // BTN (Aggressor)
    ],
    dealerIndex: 1, // p1 is BTN. p0 is SB.
    bb: 20,
    state: 'PREFLOP',
    currentRoundBet: 50,
    currentStreetRaises: 1,
    aggressor: 'p1',
    potManager: { currentRoundBet: 50 },
    board: []
  };

  try {
    const res = getAdvancedAIAction(engine.players[0], engine);
    console.log(`SB vs BTN: ${res.insight}`);
  } catch (e) {
    console.log("Error: " + e.message);
  }
  console.log("--- END MAPPING TEST ---");
}

run();
