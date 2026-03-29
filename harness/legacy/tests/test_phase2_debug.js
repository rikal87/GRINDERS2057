
import { getAdvancedAIAction } from './src/logic/aiEngineAdvanced.js';

async function testPhase2() {
  console.log("--- START PHASE 2 TEST ---");
  try {
    // 1. Squeeze Scenario
    // UTG Raises to 5, MP Calls 5. Hero is CO.
    const engineSqueeze = {
      players: [
        { id: 'p0', currentBet: 0, hand: ['Ad', 'Kd'] }, // CO (Hero)
        { id: 'p1', currentBet: 0 }, // BTN
        { id: 'p2', currentBet: 0 }, // SB
        { id: 'p3', currentBet: 0 }, // BB
        { id: 'p4', currentBet: 5 }, // UTG (Aggressor)
        { id: 'p5', currentBet: 5 }, // MP (Caller)
      ],
      dealerIndex: 1,
      bb: 2,
      state: 'PREFLOP',
      currentRoundBet: 5,
      currentStreetRaises: 1,
      aggressor: 'p4',
      potManager: { currentRoundBet: 5 },
      board: []
    };
    const playerSqueeze = engineSqueeze.players[0];

    console.log("Testing Squeeze (CO vs UTG+Call)...");
    const resSqueeze = getAdvancedAIAction(playerSqueeze, engineSqueeze);
    console.log(`[SQUEEZE] Insight: ${resSqueeze.insight}`);
    console.log(`[SQUEEZE] Action: ${resSqueeze.type}, Amount: ${resSqueeze.amount}`);

    // 2. River Polarization
    // Board is Dry. We have Air (7s2d).
    const engineRiver = {
      players: [{ id: 'p1', hand: ['7s', '2d'], currentBet: 0 }], // Hero
      dealerIndex: 0,
      bb: 2,
      state: 'RIVER',
      currentRoundBet: 0,
      currentStreetRaises: 0,
      aggressor: 'p1',
      board: ['Ah', '9d', '2c', '5h', 'Qs'],
      pot: 100,
      potManager: { currentRoundBet: 0 }
    };
    const playerRiver = engineRiver.players[0];

    console.log("\nTesting River Polarization (Air)...");
    for (let i = 0; i < 3; i++) {
      const res = getAdvancedAIAction(playerRiver, engineRiver);
      console.log(`[RIVER ${i}] ${res.insight} -> ${res.type} ${res.amount}`);
    }

  } catch (e) {
    console.log("ERROR: " + e.stack);
  }
  console.log("--- END PHASE 2 TEST ---");
}

testPhase2();
