
import { GameEngine } from '../gameEngine.js';
import { EventAdaptor } from '../gameEngineEventAdaptor.js';
import { store } from '../store.js'; // Might fail if store uses browser globals, but let's try.

// Mock store if needed (store.js uses vue reactivity which might require DOM or shim)
// But let's assume imports work for logic check.

console.log('--- Bug Fix Verification ---');

// 1. Verify BuyIn variable
const engine = new GameEngine('VANGUARD', 2, 1, 2, 5000);
console.log(`BuyIn Value in Engine: ${engine.buyIn} (Expected 5000)`);

if (engine.buyIn === 5000) {
  console.log('PASS: BuyIn variable naming fixed.');
} else {
  console.error('FAIL: BuyIn variable mismatch.');
}

// 2. Verify EventAdaptor Safety
const adaptor = new EventAdaptor();
const dummyPlayer = {
  id: 'p1',
  level: 1,
  item: {} // Empty object causing previous crash
};

console.log('Testing bankruptcy with empty item...');
try {
  adaptor.bankruptcy({ player: dummyPlayer });
  console.log('PASS: No crash on bankruptcy.');
} catch (e) {
  console.error('FAIL: Crash on bankruptcy:', e.message);
}

console.log('Testing bet with empty item...');
try {
  adaptor.bet({ player: dummyPlayer, amount: 100, pot: 200 });
  console.log('PASS: No crash on bet.');
} catch (e) {
  console.error('FAIL: Crash on bet:', e.message);
}
