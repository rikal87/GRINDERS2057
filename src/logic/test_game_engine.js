
import { GameEngine, CLASSES } from './gameEngine_test_copy.js';
import fs from 'fs';

const logFile = 'test_output.txt';

// Clear log file
fs.writeFileSync(logFile, "Starting Test Log\n");

function log(msg) {
  console.log(msg);
  fs.appendFileSync(logFile, (typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg) + '\n');
}

log("Starting GameEngine Test...");

const engine = new GameEngine('VANGUARD', 2);
engine.startNewHand();

log("Initial State: " + engine.state);
// log("Players:", engine.players.map(p => ({ id: p.id, chips: p.chips, hand: p.hand })));

const player = engine.players[0];
const cpu = engine.players[1];

log(`Current Turn: ${engine.currentPlayerIndex}`);

// Player goes All-In
log("Player goes All-In...");
engine.handlePlayerAction({ type: 'raise', amount: 100 }); // All chips (100)

log(`Current Round Bet: ${engine.currentRoundBet}`);
log(`CPU Chips: ${cpu.chips}, CPU Bet: ${cpu.currentBet}`);

// CPU Calls
log("CPU Calls...");
engine.handlePlayerAction({ type: 'call' }); // Should match 100

log("--- Betting Completed, checking auto-runout ---");
log(`State: ${engine.state}`);
log(`Board: ${engine.board}`);

// Override setTimeout to run immediately and sequentially
const originalSetTimeout = global.setTimeout;
global.setTimeout = (fn, delay) => {
  log(`[TEST] Timeout set for ${delay}ms. Executing immediately.`);
  fn();
};

// Re-run scenario with fast forward
const testEngine = new GameEngine('VANGUARD', 2);
testEngine.startNewHand();

log("--- START SCENARIO ---");
testEngine.handlePlayerAction({ type: 'raise', amount: 100 });
testEngine.handlePlayerAction({ type: 'call' });
log("--- ACTION COMPLETE ---");

log("Final State Check:");
log(`State: ${testEngine.state}`);
log(`Board: ${testEngine.board}`);
log(`Board Length: ${testEngine.board.length}`);

if (testEngine.board.length === 5) {
  log("SUCCESS: All community cards dealt.");
} else {
  log("FAILURE: Community cards missing. Board length: " + testEngine.board.length);
}
