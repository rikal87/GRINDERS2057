
import { GameEngine } from '../gameEngine.js';
import { store } from '../store.js';

// Minimal mock for store if needed
store.bankroll = 10000;
store.level = 1;
store.equippedItem = null;
store.ownedItems = [];

console.log("--- Starting Turn Skip Verification Test ---");

/**
 * Scenario: 2 Players, Human acts, then CPU raises.
 * Expected: Turn should come back to Human.
 */
async function testCpuRaiseHeadsUp() {
  console.log("\n[TEST] Scenario: CPU Raise in Heads-Up");
  const engine = new GameEngine('VANGUARD', 2, 1, 2, 1000);

  // Force Dealer to be Human (0) so Human acts first preflop
  engine.dealerIndex = 1;
  engine.startNewHand();
  // dealerIndex++ makes it 0. sb=0, bb=1. current=0. Correct.

  console.log(`Initial State: ${engine.state}, Current Player: ${engine.players[engine.currentPlayerIndex].name}`);

  if (!engine.players[engine.currentPlayerIndex].isHuman) {
    console.error("FAILED: Action should start with Human.");
    return;
  }

  // Human Calls
  console.log("Human calls...");
  await engine.handlePlayerAction({ type: 'call' });
  console.log(`Current Player: ${engine.players[engine.currentPlayerIndex].name}`);

  // CPU Raises
  console.log("CPU raises...");
  await engine.handlePlayerAction({ type: 'raise', amount: 10 });

  console.log(`State: ${engine.state}`);
  console.log(`Current Player: ${engine.players[engine.currentPlayerIndex].name}`);
  console.log(`Players Acted Count: ${engine.playersActedCount}`);

  if (engine.players[engine.currentPlayerIndex].isHuman) {
    console.log("SUCCESS: Turn returned to Human correctly after CPU raise.");
  } else if (engine.state !== 'PREFLOP') {
    console.log(`FAILED: Street transitioned to ${engine.state} without human action!`);
  } else {
    console.log("FAILED: Turn stayed with CPU or went elsewhere.");
  }
}

/**
 * Scenario: All-In Call
 * Expected: Round should end and transition street or showdown.
 */
async function testAllInCall() {
  console.log("\n[TEST] Scenario: All-In Call");
  const engine = new GameEngine('VANGUARD', 2, 1, 2, 10); // Small buyin for easy all-in
  engine.dealerIndex = 1;
  engine.startNewHand();

  console.log("Human raises to all-in (10)...");
  await engine.handlePlayerAction({ type: 'raise', amount: 10 });

  console.log("CPU calls (all-in)...");
  await engine.handlePlayerAction({ type: 'call' });

  console.log(`State: ${engine.state}`);
  if (engine.state === 'SHOWDOWN' || engine.runoutInProgress) {
    console.log("SUCCESS: All-in triggered runout/showdown.");
  } else {
    console.log(`FAILED: Game stuck in ${engine.state} after mutual all-in.`);
  }
}

async function runTests() {
  try {
    await testCpuRaiseHeadsUp();
    await testAllInCall();
  } catch (e) {
    console.error("Test execution error:", e);
  }
}

runTests();
