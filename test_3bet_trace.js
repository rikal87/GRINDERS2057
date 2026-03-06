
import fs from 'fs';
import { expandRange } from './src/logic/poker.js';
import { getAdvancedAIAction } from './src/logic/aiEngineAdvanced.js';
import { GTO_RANGES } from './src/logic/GTORanges.js';

const LOG_FILE = 'debug_3bet.txt';
function log(msg) {
  try {
    fs.appendFileSync(LOG_FILE, msg + '\n');
  } catch (e) { }
}

try {
  fs.writeFileSync(LOG_FILE, "--- START 3-BET TRACE ---\n");
} catch (e) { }

try {
  // 1. Inspect Range Expansion
  log("Inspecting VS_BTN.SB.VALUE_3BET...");
  const rangeStr = GTO_RTO_RANGES.VS_BTN.SB.VALUE_3BET;
  log(`Raw String: ${rangeStr}`);

  // Manual expansion
  const expanded = expandRange(rangeStr);
  const set = new Set(expanded);
  log(`Expanded Size: ${set.size}`);
  log(`Contains 'AsKs'? ${set.has('AsKs')}`);
  log(`Contains 'AhKh'? ${set.has('AhKh')}`);

  // 2. Scenario 1: SB vs BTN (Hero has AKs)
  const engine = {
    players: [
      { id: 'p0', currentBet: 0, hand: ['As', 'Ks'], chips: 1000 }, // SB (Hero)
      { id: 'p1', currentBet: 20, chips: 1000 }, // BB
      { id: 'p2', currentBet: 0, chips: 1000 }, // UTG
      { id: 'p3', currentBet: 50, chips: 1000 }, // BTN (Aggressor, Raised to 50)
    ],
    dealerIndex: 2, // UTG is dealer? No. 
    // 4 players: 0(SB), 1(BB), 2(UTG), 3(BTN).
    // If dealerIndex = 3 (BTN).
    // 0 is SB. Correct.
    dealerIndex: 3,
    bb: 20,
    state: 'PREFLOP',
    currentRoundBet: 50,
    currentStreetRaises: 1,
    aggressor: 'p3',
    potManager: { currentRoundBet: 50 },
    board: [],
    pot: 70
  };

  // We need to make sure getPosName in engine identifies p0 as SB.
  // aiEngineAdvanced calculates positions dynamically.

  log("\nRunning Scenario: SB (AKs) vs BTN Raise...");
  const result = getAdvancedAIAction(engine.players[0], engine);
  log(`Result: ${result.type} - ${result.insight} - Amount: ${result.amount}`);

} catch (e) {
  log(`ERROR: ${e.stack}`);
}

log("--- END 3-BET TRACE ---");
