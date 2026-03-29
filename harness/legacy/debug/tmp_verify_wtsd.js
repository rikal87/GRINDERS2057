
import { getHandBudget, isPotCommitted } from './src/logic/aiEngine/tools/aiBrainBudgetTool.js';

console.log('--- Phase 1: Budget Threshold Test ---');
const pot = 1000;
console.log(`Pot: ${pot}`);
console.log(`Marginal (35% equity): Expected > 1000, Got: ${getHandBudget(0.35, pot, 'TAG')}`);
console.log(`Good (55% equity): Expected > 2000, Got: ${getHandBudget(0.55, pot, 'TAG')}`);
console.log(`Monster (90% equity): Expected > 5000, Got: ${getHandBudget(0.90, pot, 'TAG')}`);

console.log('\n--- Phase 2: Commitment Test ---');
const player = { chips: 200, totalWagered: 800 }; // Invested 80% of stack
const spr = 0.2; // Very shallow
console.log(`Invested 800, Chips 200, SPR 0.2, Equity 35%: Committed? ${isPotCommitted(player, 0.35, pot)}`);

console.log('\n--- Phase 3: High Pot Bluff Safety (Manual Logic Check) ---');
// Manually check if aiEngine.js logic would reduce bluffFreq
const AF = 3;
const pfIntensity = 3;
let bluffFreq = Math.max(0.0, (AF - 2) * 0.06 + 0.06);
if (pfIntensity >= 3) bluffFreq *= 0.5;
console.log(`AF: ${AF}, pfIntensity: ${pfIntensity}, Original BluffFreq: ~0.12, New BluffFreq: ${bluffFreq}`);
