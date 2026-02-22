
import { GameEngine } from './gameEngine_test_copy.js';

console.log("--- Starting Specific Turn Skip Verification (Heads-Up) ---");

async function verifyTurnLogic() {
  const engine = new GameEngine('VANGUARD', 2);

  // Force Dealer to be Human (0) so Human acts first preflop
  engine.dealerIndex = 1;
  engine.startNewHand();

  console.log(`\nState: ${engine.state}, Current Player: ${engine.players[engine.currentPlayerIndex].name}`);

  // 1. Human Actions
  console.log("-> YOU (Human) CALL (2)");
  engine.handlePlayerAction({ type: 'call' });
  console.log(`Current Player: ${engine.players[engine.currentPlayerIndex].name}`);

  // 2. CPU Actions - Simulate a Raise
  console.log("-> AGENT_1 (CPU) RAISES to 10");
  engine.handlePlayerAction({ type: 'raise', amount: 10 });

  console.log(`\nResults after CPU Raise:`);
  console.log(`State: ${engine.state}`);
  console.log(`Current Player: ${engine.players[engine.currentPlayerIndex].name}`);
  console.log(`Players Acted Count: ${engine.playersActedCount}`);

  if (engine.state === 'PREFLOP' && engine.currentPlayerIndex === 0) {
    console.log("\n[TEST SUCCESS] Turn correctly returned to Human after CPU raise.");
  } else {
    console.log("\n[TEST FAILURE] Turn skipped Human or street transitioned prematurely.");
  }
}

verifyTurnLogic();
