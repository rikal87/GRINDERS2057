
import { getAdvancedAIAction } from './src/logic/aiEngineAdvanced.js';
import fs from 'fs';

const OUT_FILE = 'preflop_debug.txt';
function log(msg) {
  console.log(msg);
  try { fs.appendFileSync(OUT_FILE, msg + '\n'); } catch (e) { }
}
try { fs.writeFileSync(OUT_FILE, "--- PREFLOP DEBUG START ---\n"); } catch (e) { }

// Mock Engine Helper
function createEngine(scenario) {
  const players = Array(6).fill(null).map((_, i) => ({
    id: `p${i}`,
    currentBet: 0,
    chips: 1000,
    hand: [],
    stats: { handsPlayed: 100, vPIP: 0.2, foldToFlop: 0.5 } // Standard stats
  }));

  const hero = players[scenario.heroIndex];
  hero.hand = scenario.heroHand;

  // Set Aggressor if any
  if (scenario.aggressorIndex !== undefined) {
    players[scenario.aggressorIndex].currentBet = scenario.betSize || 50;
  }

  // Blinds
  // 6-Max: BTN=0, SB=1, BB=2, UTG=3, MP=4, CO=5 (using logical index)
  // Actually dealerIndex decides positions.
  // If dealerIndex = 0 (BTN is p0).

  // Let's use dealerIndex = 0.
  // p0: BTN
  // p1: SB
  // p2: BB
  // p3: UTG
  // p4: MP
  // p5: CO

  return {
    players,
    dealerIndex: 0,
    bb: 20,
    state: 'PREFLOP',
    currentRoundBet: scenario.aggressorIndex !== undefined ? (scenario.betSize || 50) : 20, // 20 is BB
    currentStreetRaises: scenario.raises || 0,
    aggressor: scenario.aggressorIndex !== undefined ? `p${scenario.aggressorIndex}` : null,
    potManager: { currentRoundBet: scenario.aggressorIndex !== undefined ? (scenario.betSize || 50) : 20 },
    board: []
  };
}

async function run() {
  // Test Case 1: RFI (Open Raise)
  // Hero is BTN (p0), Hand AA. Unopened.
  log("\n[TEST 1] RFI Check: BTN with AA");
  const engineRFI = createEngine({ heroIndex: 0, heroHand: ['As', 'Ac'], raises: 0 });
  // IMPORTANT: currentRoundBet must be BB (20) for it to be unopened
  engineRFI.currentRoundBet = 20;
  engineRFI.potManager.currentRoundBet = 20;

  try {
    const res = getAdvancedAIAction(engineRFI.players[0], engineRFI);
    log(`Create Action: ${res.type} ${res.amount} (${res.insight})`);
  } catch (e) { log("Error: " + e.stack); }

  // Test Case 2: 3-Bet Value
  // Hero is SB (p1), Hand AA. Villain BTN (p0) Raises to 50.
  log("\n[TEST 2] 3-Bet Value: SB with AA vs BTN Open");
  const engine3Bet = createEngine({ heroIndex: 1, heroHand: ['As', 'Ac'], aggressorIndex: 0, betSize: 50, raises: 1 });

  try {
    const res = getAdvancedAIAction(engine3Bet.players[1], engine3Bet);
    log(`Create Action: ${res.type} ${res.amount} (${res.insight})`);

    // Check mapping logic trace if possible (inferred from insight)
    // Expected: "GTO Value 3-Bet vs BTN" or similar
  } catch (e) { log("Error: " + e.stack); }

  // Test Case 3: 3-Bet Bluff (A5s)
  log("\n[TEST 3] 3-Bet Bluff: SB with A5s vs BTN Open");
  const engine3BetBluff = createEngine({ heroIndex: 1, heroHand: ['As', '5s'], aggressorIndex: 0, betSize: 50, raises: 1 });
  try {
    // Run multiple times to catch RNG freq
    let raises = 0;
    for (let i = 0; i < 5; i++) {
      const res = getAdvancedAIAction(engine3BetBluff.players[1], engine3BetBluff);
      if (res.type === 'raise') raises++;
    }
    log(`Triggered Bluff 3-Bet ${raises}/5 times.`);
  } catch (e) { log("Error: " + e.stack); }

  // Test Case 4: Mapping Check (Mid Position)
  // Hero is MP (p4) facing UTG (p3) raise
  // p3 is UTG. p4 is MP.
  log("\n[TEST 4] MP vs UTG Open");
  const engineMap = createEngine({ heroIndex: 4, heroHand: ['As', 'Ks'], aggressorIndex: 3, betSize: 50, raises: 1 });
  try {
    const res = getAdvancedAIAction(engineMap.players[4], engineMap);
    log(`Action: ${res.type} (${res.insight})`);
  } catch (e) { log("Error: " + e.stack); }

}

run();
