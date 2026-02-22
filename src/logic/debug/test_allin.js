
import { GameEngine } from '../gameEngine.js';
import { EventAdaptor } from '../gameEngineEventAdaptor.js';

// Mock Adaptor to avoid UI errors
EventAdaptor.allInModeActivated = () => console.log('MOCK UI: ALL IN MODE ON');
EventAdaptor.endStreet = (s) => console.log(`MOCK UI: END ${s}`);
EventAdaptor.startStreet = (s) => console.log(`MOCK UI: START ${s}`);
EventAdaptor.bet = () => { };
EventAdaptor.blindPay = () => { };

// Initialize Game
const game = new GameEngine('VANGUARD', 2);
console.log('Game Initialized');

game.startNewHand();
console.log('Hand Started. State:', game.state);

// Force Chips for Scenario
game.players[0].chips = 1000;
game.players[1].chips = 1000;

console.log('--- Action Sequence ---');
// SB (Cpu) posts 1, BB (Player) posts 2.
// Current Actor should be CPU (SB position relative to button?)
// Let's check current player
const p1 = game.players[game.currentPlayerIndex];
console.log(`Computed Current Player: ${p1.name}`);

// Action 1: Player 1 Raises to All-In (Simulated)
// If P1 has 1000 chips, raise 999 (+1 posted)
console.log(`${p1.name} goes ALL-IN`);
game.handlePlayerAction({ type: 'raise', amount: 1000 });

// Action 2: Player 2 Calls All-In
const p2 = game.players[game.currentPlayerIndex];
console.log(`Current Player: ${p2.name}`);
console.log(`${p2.name} CALLS`);
game.handlePlayerAction({ type: 'call', amount: 1000 });

// Check State
console.log(`Runout Progress: ${game.runoutInProgress}`);
console.log(`State: ${game.state}`);

// Wait for timeouts (simulation)
setTimeout(() => {
  console.log(`State after 2s: ${game.state}`);
}, 2000);

setTimeout(() => {
  console.log(`State after 4s (Should be later street): ${game.state}`);
}, 4000);

setTimeout(() => {
  console.log(`State after 8s (Should be SHOWDOWN): ${game.state}`);
  if (game.state === 'SHOWDOWN') console.log('PASS: All-In Runout verified');
  else console.error('FAIL: Did not reach Showdown');
}, 8000);
