
import fs from 'fs';

function log(msg) {
  try {
    fs.appendFileSync('debug_log.txt', msg + '\n');
  } catch (e) {
    // ignore
  }
}

log("Starting debug script...");

try {
  log("Importing...");
  const { getAdvancedAIAction } = await import('./src/logic/aiEngineAdvanced.js');
  log("Import success.");

  // Mock Engine
  const engine = {
    players: [{ id: 'p1' }, { id: 'p2' }],
    dealerIndex: 0,
    bb: 2,
    state: 'PREFLOP',
    currentRoundBet: 2,
    currentStreetRaises: 0
  };
  const player = { id: 'p1', hand: ['As', 'Ks'], class: { name: 'TestBot' } };

  log("Running action...");
  const result = getAdvancedAIAction(player, engine);
  log("Result: " + JSON.stringify(result));

} catch (e) {
  log("Error: " + e.stack);
}
