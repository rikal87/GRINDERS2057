
import fs from 'fs';
import { getAdvancedAIAction } from './src/logic/aiEngineAdvanced.js';

const OUT_FILE = 'mapping_result.txt';
function log(msg) {
  console.log(msg);
  try { fs.appendFileSync(OUT_FILE, msg + '\n'); } catch (e) { }
}
try { fs.writeFileSync(OUT_FILE, "--- MAPPING VERIFICATION START ---\n"); } catch (e) { }


function createEngine(heroPosIndex, villanPosIndex) {
  // 6 Players: 0=BTN, 1=SB, 2=BB, 3=UTG, 4=MP, 5=CO
  // Hero is p[heroPosIndex]
  const players = Array(6).fill(null).map((_, i) => ({
    id: `p${i}`,
    currentBet: 0,
    chips: 1000,
    hand: []
  }));

  // Set Hero Hand (Strong to ensure action if mapped)
  players[heroPosIndex].hand = ['As', 'Ks'];

  // Set Villain (Aggressor)
  players[villanPosIndex].currentBet = 50;

  return {
    players: players,
    dealerIndex: 0, // Fixed Dealer at 0 (BTN)
    bb: 20,
    state: 'PREFLOP',
    currentRoundBet: 50,
    currentStreetRaises: 1,
    aggressor: `p${villanPosIndex}`,
    potManager: { currentRoundBet: 50 },
    board: []
  };
}

const scenarios = [
  { name: "BB (Hero) vs SB (Aggressor)", hero: 2, villain: 1, expected: "VS_SB.BB" },
  { name: "SB (Hero) vs BTN (Aggressor)", hero: 1, villain: 0, expected: "VS_BTN.SB" },
  { name: "BB (Hero) vs BTN (Aggressor)", hero: 2, villain: 0, expected: "VS_BTN.BB" },
  { name: "BTN (Hero) vs CO (Aggressor)", hero: 0, villain: 5, expected: "VS_CO.BTN" },
  { name: "BTN (Hero) vs MP (Aggressor)", hero: 0, villain: 4, expected: "VS_MP.BTN" } // MJ is 4
];

async function run() {
  for (const s of scenarios) {
    log(`\nTesting: ${s.name}`);
    const engine = createEngine(s.hero, s.villain);
    const player = engine.players[s.hero];

    try {
      const result = getAdvancedAIAction(player, engine);
      log(`  -> Insight: ${result.insight}`);
      log(`  -> Action: ${result.type}, Amount: ${result.amount}`);

      // Check if insight proves mapping
      // Insight format: "GTO Value 3-Bet vs SB" or similar
      // If fallback: "Fallback Strong Call" or "No GTO Strategy"

      if (result.insight.includes("Fallback") || result.insight.includes("No GTO")) {
        log("  [FAIL] Mapping likely failed.");
      } else {
        log("  [PASS] Strategy found.");
      }

    } catch (e) {
      log(`  [ERROR] ${e.message}`);
    }
  }
}

run();
