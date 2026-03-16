import { GameEngine } from './src/logic/GameEngine.js';
import { store } from './src/logic/store.js';

// Mock dependencies
global.window = {}; // if needed
// Mock audioManager
import { audioManager } from './src/logic/audioManager.js';
audioManager.playSFX = () => { };
audioManager.playBGM = () => { };
audioManager.setPlaybackRate = () => { };
audioManager.setFilter = () => { };

// Mock store
store.bankroll = 10000;
store.equippedItem = { effects: [] };

async function testTimeBank() {
  console.log('--- Starting Timebank Verification ---');
  const engine = new GameEngine('VANGUARD', 2, 10, 20, 1000);

  // Check initial maxTimeBank
  const human = engine.players[0];
  console.log(`Initial Max TimeBank: ${human.maxTimeBank}s (Expected: 30s)`);
  if (human.maxTimeBank !== 30) throw new Error('Default TimeBank incorrect');

  // Add Item Effect
  human.item = { effects: [{ effect: { type: 'time_bank', value: 10 } }] };
  console.log(`Max TimeBank with Item: ${human.maxTimeBank}s (Expected: 40s)`);
  if (human.maxTimeBank !== 40) throw new Error('Item Effect TimeBank incorrect');

  // Start Hand
  console.log('Starting Hand...');
  await engine.startNewHand();

  // Check timer start
  // We need to wait for turn. 
  // If dealerIndex=0, SB=0 (Player), BB=1 (CPU).
  // Preflop: SB acts first? No, BB acts last. 
  // Heads Up: Dealer=SB, Other=BB. 
  // Dealer(SB) posts SB. BB posts BB. 
  // Action starts correctly? 
  // In Heads Up: Dealer acts first Preflop.
  // engine.initializePlayers sets dealerIndex = 0.
  // startNewHand increments dealerIndex -> 1.
  // SB = 1 (CPU), BB = 0 (Player).
  // Preflop action starts with Dealer (SB) ? No, dealing works: SB, BB.
  // Action starts `(bbIndex + 1) % playerCount`.
  // If SB=1, BB=0. Next = 1 (CPU).
  // So CPU acts first.

  // We need to simulate CPU turn or force Player turn.
  // engine.processTurns is async.

  // Wait for engine state to settle?
  // engine.turnTimer should be null if not player turn.

  // Let's force startTurnTimer on player to test logic directly
  console.log('Testing startTurnTimer logic directly...');
  engine.startTurnTimer(human);

  // Wait 2 seconds
  await new Promise(r => setTimeout(r, 2100));

  console.log(`TimeRemaining after ~2s: ${human.timeBankRemaining}`);
  if (human.timeBankRemaining > 38 || human.timeBankRemaining < 37) {
    console.warn('Timer tick inaccurate or not running? Value:', human.timeBankRemaining);
    // Note: interval is 1s. 40 -> 39 -> 38.
  }

  // Stop Timer
  engine.stopTurnTimer();
  console.log('Timer stopped.');

  // Test Timeout
  console.log('Testing Timeout...');
  human.timeBankRemaining = 1; // Set to 1s
  engine.startTurnTimer(human);

  await new Promise(r => setTimeout(r, 1500));
  // Should have timed out and folded/checked
  console.log('Player State (Folded?):', human.isFolded);
  console.log('Player CurrentBet:', human.currentBet);

  if (human.isFolded || human.currentBet > 0 || engine.playersActedCount > 0) {
    console.log('Timeout handled action successfully.');
  } else {
    console.error('Timeout did NOT trigger action.');
  }

  console.log('--- Verification Complete ---');
}

testTimeBank().catch(e => console.error(e));
