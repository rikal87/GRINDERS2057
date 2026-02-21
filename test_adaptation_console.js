
import { getAdvancedAIAction } from './src/logic/aiEngineAdvanced.js';

async function run() {
  console.log("--- ADAPTATION TEST CONSOLE ---");

  // Scenario 1: vs Regular (vPIP 0.2)
  const engineReg = {
    players: [
      { id: 'p0', currentBet: 0, hand: ['9s', '8s'], chips: 1000, stats: {} },
      { id: 'p1', currentBet: 50, chips: 1000, stats: { handsPlayed: 100, vPIP: 0.2 } },
    ],
    dealerIndex: 1, bb: 20, state: 'PREFLOP', currentRoundBet: 50, currentStreetRaises: 1, preflopAggressor: 'p1', board: [],
    potManager: { currentRoundBet: 50 }
  };

  // Scenario 2: vs Maniac (vPIP 0.8)
  const engineManiac = {
    players: [
      { id: 'p0', currentBet: 0, hand: ['9s', '8s'], chips: 1000, stats: {} },
      { id: 'p1', currentBet: 50, chips: 1000, stats: { handsPlayed: 100, vPIP: 0.8 } },
    ],
    dealerIndex: 1, bb: 20, state: 'PREFLOP', currentRoundBet: 50, currentStreetRaises: 1, preflopAggressor: 'p1', board: [],
    potManager: { currentRoundBet: 50 }
  };

  try {
    console.log("1. Vs Regular (vPIP 0.2)");
    const res1 = getAdvancedAIAction(engineReg.players[0], engineReg);
    console.log(`   Insight: ${res1.insight}`);

    console.log("2. Vs Maniac (vPIP 0.8)");
    const res2 = getAdvancedAIAction(engineManiac.players[0], engineManiac);
    console.log(`   Insight: ${res2.insight}`);

  } catch (e) {
    console.log("ERROR: " + e.message);
  }
  console.log("--- END TEST ---");
}

run();
