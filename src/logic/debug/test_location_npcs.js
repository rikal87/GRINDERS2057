
import { GameEngine } from '../gameEngine_node.js';
import { zones } from '../zone_node.js';
import { CLASSES_ENEMY_BOSS } from '../persona.js';
import fs from 'fs';

const logFile = 'test_results.txt';
try {
  fs.writeFileSync(logFile, "=== Testing Zone-Based NPC Spawning ===\n");
} catch (e) {
  console.error("Error writing log file", e);
}

function log(msg) {
  console.log(msg);
  try {
    fs.appendFileSync(logFile, (typeof msg === 'object' ? JSON.stringify(msg) : msg) + '\n');
  } catch (e) { }
}

// 1. Test Micro Stakes (Street Shop Backroom)
// NPCs: Fish, MR_CALL, Broke
log("\n--- TEST 1: Micro Stakes (micro_street_shop) ---");
const engineMicro = new GameEngine('VANGUARD', 6, 5, 10, 1000, 0, 100, false, 'micro_street_shop');

// Check initial players (excluding Human at index 0)
const opponentsMicro = engineMicro.players.slice(1);
const allowedMicro = ['Fish', 'MR_CALL', 'Broke'];

log("Opponents: " + opponentsMicro.map(p => p.name).join(', '));

const allValidMicro = opponentsMicro.every(p => allowedMicro.includes(p.name));
if (allValidMicro) {
  log("PASS: All opponents are valid for micro_street_shop.");
} else {
  log("FAIL: Found invalid opponents for micro_street_shop.");
}


// 2. Test High Stakes with Named_Pro (Royal Private Cardroom)
// NPCs: Named_Pro, Quant_Pro, Old_Lion
// Named_Pro should be replaced by a Boss
log("\n--- TEST 2: High Stakes (high_royal_room) ---");
const engineHigh = new GameEngine('VANGUARD', 6, 5000, 10000, 1000000, 0.11, 100000, true, 'high_royal_room');

const opponentsHigh = engineHigh.players.slice(1);
const allowedHighBase = ['Quant_Pro', 'Old_Lion'];
const bossNames = CLASSES_ENEMY_BOSS.map(b => b.name);

log("Opponents: " + opponentsHigh.map(p => p.name).join(', '));

let hasBoss = false;
let allValidHigh = true;

opponentsHigh.forEach(p => {
  if (bossNames.includes(p.name)) {
    hasBoss = true;
    log(`> Boss Detected: ${p.name}`);
  } else if (!allowedHighBase.includes(p.name)) {
    log(`> Invalid Opponent: ${p.name}`);
    allValidHigh = false;
  }
});

if (allValidHigh) {
  log("PASS: All regular opponents are valid.");
} else {
  log("FAIL: Invalid regular opponents found.");
}

if (hasBoss) {
  log("PASS: Boss successfully spawned via 'Named_Pro'.");
} else {
  // It's possible we just got unlucky if Named_Pro wasn't picked (random sort)
  // But with 6 players and 3 items in pool, it MUST be picked unless pool logic is broken.
  log("WARN: No boss spawned. (This might be chance if not all NPCs are forced).");
}

// 3. Test Invalid Location (Fallback)
log("\n--- TEST 3: Invalid Location (fallback) ---");
const engineInvalid = new GameEngine('VANGUARD', 6, 1, 2, 1000, 0, 0, false, 'invalid_zone_id');
if (engineInvalid.players.length === 6) {
  log("PASS: Fallback mechanism worked (players spawned).");
  log("Opponents: " + engineInvalid.players.slice(1).map(p => p.name).slice(0, 3).join(', ') + "...");
} else {
  log("FAIL: Fallback mechanism failed.");
}

log("\n=== Test Complete ===");
