
import { getAdvancedAIAction } from './src/logic/aiEngineAdvanced.js';
import fs from 'fs';

const OUT = 'rfi_result.txt';
try { fs.writeFileSync(OUT, "START\n"); } catch (e) { }

function log(msg) {
  try { fs.appendFileSync(OUT, msg + '\n'); } catch (e) { }
  console.log(msg);
}

// Mock Engine RFI
const engine = {
  players: [
    { id: 'p0', currentBet: 0, hand: ['As', 'Ac'], chips: 1000, stats: { vPIP: 0.2 } },
    { id: 'p1', currentBet: 0, chips: 1000 },
  ],
  dealerIndex: 0,
  bb: 20,
  state: 'PREFLOP',
  currentRoundBet: 20, // BB amount
  currentStreetRaises: 0, // Unopened
  preflopAggressor: null,
  potManager: { currentRoundBet: 20 },
  board: []
};

// Check
try {
  const res = getAdvancedAIAction(engine.players[0], engine);
  log(`RFI Action: ${res.type}`);
  log(`RFI Insight: ${res.insight}`);
} catch (e) {
  log("ERROR: " + e.stack);
}
