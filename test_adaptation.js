
import { getAdvancedAIAction } from './src/logic/aiEngineAdvanced.js';
import fs from 'fs';

const OUT_FILE = 'adaptation_test.txt';
function log(msg) {
  console.log(msg);
  try { fs.appendFileSync(OUT_FILE, msg + '\n'); } catch (e) { }
}
try { fs.writeFileSync(OUT_FILE, "--- ADAPTATION TEST ---\n"); } catch (e) { }

async function run() {
  log("Scenario: Hero (SB) vs MANIAC (BTN, vPIP 0.9)");

  // Setup Engine with Maniac
  const engine = {
    players: [
      { id: 'p0', currentBet: 0, hand: ['9s', '9d'], chips: 1000, stats: {} }, // SB (Hero) - 99
      {
        id: 'p1',
        currentBet: 50,
        chips: 1000,
        name: 'ManiacBot',
        stats: { handsPlayed: 100, vPIP: 0.9, foldToFlop: 0.1 } // EXTREME MANIAC
      },
    ],
    dealerIndex: 1, // BTN=p1
    bb: 20,
    state: 'PREFLOP',
    currentRoundBet: 50,
    currentStreetRaises: 1,
    aggressor: 'p1',
    potManager: { currentRoundBet: 50 },
    board: []
  };

  try {
    // Run AI multiple times to check RNG effects or logical output
    const res = getAdvancedAIAction(engine.players[0], engine);
    log(`Action: ${res.type}`);
    log(`Insight: ${res.insight}`);
    log(`Amount: ${res.amount}`);

    // 99 is normally a Call or 3-Bet. 
    // Vs Maniac, we might see adjustment mentioned in insight.

  } catch (e) {
    log("ERROR: " + e.stack);
  }
}

run();
