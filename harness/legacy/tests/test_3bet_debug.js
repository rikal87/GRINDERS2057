
import { expandRange } from './src/logic/poker.js';
import { getAdvancedAIAction } from './src/logic/aiEngineAdvanced.js';
import { GTO_RANGES } from './src/logic/GTORanges.js';

console.log("--- DEBUG 3-BET START ---");

// 1. Check Range Expansion
const testRange = "AKs, QQ+";
const expanded = expandRange(testRange);
console.log(`Range "${testRange}" expands to (first 5):`, expanded.slice(0, 5));
console.log(`Total combos: ${expanded.length}`);

// 2. Check Hand Match
// Scenario: SB vs BTN Open. Value 3-Bet Range is "88+, ATs+, KJs+, QJs, AJo+"
const sbVsBtn = GTO_RANGES.VS_BTN.SB.VALUE_3BET;
const sbVsBtnSet = new Set(expandRange(sbVsBtn));

const testHand = ['As', 'Ks']; // AKs
// aiEngineAdvanced uses getCanonicalHand interally. We need to match that logic or see what it produces.
// In the engine: hand = getCanonicalHand(player.hand);

const ranks = '23456789TJQKA';
function getCanonical(h) {
  const r1 = h[0][0];
  const r2 = h[1][0];
  const v1 = ranks.indexOf(r1);
  const v2 = ranks.indexOf(r2);
  if (v1 > v2) return h[0] + h[1];
  return h[1] + h[0];
}

const canonical = getCanonical(testHand);
console.log(`Hand: ${testHand} -> Canonical: "${canonical}"`);
console.log(`Is "${canonical}" in Set? ${sbVsBtnSet.has(canonical)}`);

// 3. Run Engine
const engine = {
  players: [
    { id: 'p0', currentBet: 0, hand: ['As', 'Ks'] }, // SB (Hero)
    { id: 'p1', currentBet: 20 }, // BTN (Aggressor)
    { id: 'p2', currentBet: 20 } // BB
  ],
  dealerIndex: 0, // p0 is SB? No.
  // In 3 players: BTN(0), SB(1), BB(2).
  // Let's set p0 as SB. p2 as BTN.
  // If dealerIndex = 2 (p2 is BTN). p0 is SB.
  // Wait, logical index. 
  // engine.players[0] is hero.
};

// ... Wait, manual engine setup is error prone. rely on unit logic above.
console.log("--- DEBUG 3-BET END ---");
