import { MatchSimulator } from '../src/logic/matchSimulator.js';

console.log('======================================================');
console.log('🚨 [LIVE HOOK TEST] Component 0 Event Hook Verification');
console.log('======================================================');

const matchSim = new MatchSimulator({ bb: 20, sb: 10, maxEventsPerTick: 1, cooldownMs: 0 });

const mockMax = {
  id: 'Max',
  name: 'Max Houston',
  bankroll: 27500,
  vPIP: 0.45,
  AF: 4.5,
  WTSD: 0.35,
  W$SD: 0.53,
  status: 'GAMBLING',
  sessionNetWorth: 0,
  relationship: 100 // low relationship triggers volatile simulation
};

console.log(`[TEST INITIATED] Simulating 100 In-game Hours for Max Houston...`);

let hookCaptured = [];

let mockTime = Date.now();

for (let hour = 1; hour <= 100; hour++) {
  mockTime += 3600000; // 1시간 진행 (3,600,000ms)
  const snapshot = matchSim.simulatePartnerCycle({ ...mockMax, timestamp: mockTime });
  const events = matchSim.consumeEventsForTick();

  if (events.length > 0) {
    events.forEach(evt => {
      hookCaptured.push({ hour, evt });
      console.log(`\n⏰ [HOUR ${hour}] HOOK TRIGGERED!`);
      console.log(`- Alert Text: 🚨 [LIVE MATCH ALERT] ${evt.heroName}님이 테이블에서 $${evt.potSize} 대형 팟 경기를 치르고 있습니다.`);
      console.log(`- Snapshot Captured: ${evt.snapshot.actionStream.length} action steps in VOD buffer.`);
      console.log(`- Board Cards: [${evt.snapshot.board.join(', ')}]`);
    });
  }
}

console.log(`\n======================================================`);
console.log(`📊 [HOOK TEST SUMMARY] Total Captured Hooks: ${hookCaptured.length}/10 hours`);
console.log(`======================================================`);
