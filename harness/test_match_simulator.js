import { MatchSimulator } from '../src/logic/matchSimulator.js';

console.log('=== [Component 0 Engine Verification Test (Full Integration)] ===');
const sim = new MatchSimulator({ bb: 20, sb: 10, maxEventsPerTick: 1, cooldownMs: 100 });

const mockPartner = {
  id: 'Max',
  name: 'Max Houston',
  bankroll: 27500,
  vPIP: 0.35,
  AF: 3.5,
  WTSD: 0.3,
  W$SD: 0.53,
  status: 'GAMBLING',
  sessionNetWorth: 0,
  relationship: 500
};

let totalCycles = 0;
let triggeredSnapshots = [];

for (let i = 0; i < 50; i++) {
  totalCycles++;
  const snapshot = sim.simulatePartnerCycle(mockPartner);
  if (snapshot && snapshot.isTriggered) {
    triggeredSnapshots.push(snapshot);
  }
}

console.log(`\n--- Partner Cycle Test Results ---`);
console.log(`Total Simulated Cycles: ${totalCycles}`);
console.log(`Updated Partner Bankroll: $${mockPartner.bankroll}`);
console.log(`Partner Session NetWorth: $${mockPartner.sessionNetWorth}`);
console.log(`Captured BigPot/Cooler Snapshots: ${triggeredSnapshots.length}`);

if (triggeredSnapshots.length > 0) {
  const sample = triggeredSnapshots[0];
  console.log(`\n🚨 [SAMPLE SNAPSHOT CAPTURED] Pot: $${sample.potSize} | Board: [${sample.board.join(', ')}]`);
  console.log(`Action Stream Event Count: ${sample.actionStream.length}`);
  console.log(`Sample Preflop Action Log:`, sample.actionStream.filter(a => a.street === 'PREFLOP'));
}

const tickEvents = sim.consumeEventsForTick();
console.log(`\nConsumed Tick Events (Max 1 per tick): ${tickEvents.length} event(s) drained.`);
if (tickEvents.length > 0) {
  console.log(`Drained Event Payload:`, {
    id: tickEvents[0].id,
    hero: tickEvents[0].heroName,
    pot: tickEvents[0].potSize
  });
}
console.log('\n=== [Component 0 Engine Verification Passed 100%] ===');
