
import fs from 'fs';
import { getAdvancedAIAction } from './src/logic/aiEngineAdvanced.js';

function createMockEngine(state, dealerIdx, playerCount) {
  const players = Array(playerCount).fill(0).map((_, i) => ({
    id: `p${i}`,
    chips: 1000,
    currentBet: 0,
    hand: [],
    class: { name: 'SIM_BOT' }
  }));

  return {
    players,
    dealerIndex: dealerIdx,
    bb: 2,
    sb: 1,
    state,
    currentRoundBet: 2,
    currentStreetRaises: 0,
    aggressor: null,
    potManager: { currentRoundBet: 2 },
    board: [],
    pot: 10
  };
}

let outputLog = "";
function log(msg) {
  outputLog += msg + "\n";
  console.log(msg);
}

function runScenario(name, setupFn, iterations = 1) {
  log(`\n--- Scenario: ${name} ---`);
  const counts = {};

  for (let i = 0; i < iterations; i++) {
    const { player, engine } = setupFn();
    const result = getAdvancedAIAction(player, engine);
    const key = `${result.action} (${result.insight})`;
    counts[key] = (counts[key] || 0) + 1;
  }

  // Print stats
  Object.entries(counts).forEach(([k, v]) => {
    const pct = ((v / iterations) * 100).toFixed(1);
    log(`  ${k}: ${v} (${pct}%)`);
  });
}

try {
  // --- Preflop Tests (Regression) ---
  runScenario("UTG Open (AA) - Regression", () => {
    const engine = createMockEngine('PREFLOP', 0, 6);
    const player = engine.players[3];
    player.hand = ["As", "Ad"];
    engine.potManager.currentRoundBet = 2;
    return { player, engine };
  });

  // --- Postflop Tests ---

  // 1. C-Bet with Top Pair (Strong)
  runScenario("Flop C-Bet: Top Pair (AsKs on Ah 9d 2c)", () => {
    const engine = createMockEngine('FLOP', 0, 6);
    const player = engine.players[0]; // BTN
    player.hand = ["As", "Ks"];
    engine.board = ["Ah", "9d", "2c"]; // A high dry
    engine.aggressor = 'p0'; // We raised pre
    engine.potManager.currentRoundBet = 0; // Check to us

    return { player, engine };
  });

  // 2. C-Bet Bluff (Air on Dry Board)
  runScenario("Flop C-Bet: Air (7s6s on Ah 9d 2c)", () => {
    const engine = createMockEngine('FLOP', 0, 6);
    const player = engine.players[0]; // BTN
    player.hand = ["7s", "6s"];
    engine.board = ["Ah", "9d", "2c"];
    engine.aggressor = 'p0';

    return { player, engine };
  }, 20); // Frequency Check (60%)

  // 3. Defending Draw (Flush Draw)
  runScenario("Flop Defend: Flush Draw vs Bet", () => {
    const engine = createMockEngine('FLOP', 0, 6);
    const player = engine.players[2]; // BB
    player.hand = ["Js", "Ts"];
    engine.board = ["As", "5s", "2d"]; // Flush draw
    engine.aggressor = 'p0'; // BTN Aggressor

    // BTN bets 5 into pot of 10
    engine.pot = 10;
    engine.potManager.currentRoundBet = 5;
    player.currentBet = 0;

    return { player, engine };
  });

  fs.writeFileSync('test_results.txt', outputLog);

} catch (e) {
  fs.writeFileSync('test_error.txt', e.toString());
}
