
import { GameEngine } from '../gameEngine.js';
import { EventAdaptor } from '../gameEngineEventAdaptor.js';

// Mock Adaptor to avoid UI errors
EventAdaptor.allInModeActivated = () => console.log('MOCK UI: ALL IN MODE ON');
EventAdaptor.endStreet = (s) => console.log(`MOCK UI: END ${s}`);
EventAdaptor.startStreet = (s) => console.log(`MOCK UI: START ${s}`);
EventAdaptor.bet = () => { };
EventAdaptor.blindPay = () => { };
EventAdaptor.showdownWin = () => console.log('MOCK UI: SHOWDOWN WIN');
EventAdaptor.showdownLose = () => console.log('MOCK UI: SHOWDOWN LOSE');
EventAdaptor.allinWin = () => console.log('MOCK UI: ALLIN WIN');
EventAdaptor.allinLose = () => console.log('MOCK UI: ALLIN LOSE');
EventAdaptor.allinShowdown = () => console.log('MOCK UI: ALLIN SHOWDOWN');

// Initialize Game
const game = new GameEngine('VANGUARD', 2);
console.log('Game Initialized');

game.startNewHand();
console.log('Hand Started. State:', game.state);

// Force Chips for Scenario
game.players[0].chips = 1000;
game.players[1].chips = 1000;

console.log('--- Action Sequence ---');
const p1 = game.players[game.currentPlayerIndex];
console.log(`${p1.name} goes ALL-IN`);
game.handlePlayerAction({ type: 'raise', amount: 1000 });

const p2 = game.players[game.currentPlayerIndex];
console.log(`${p2.name} CALLS`);
game.handlePlayerAction({ type: 'call', amount: 1000 });

console.log(`Runout Progress: ${game.runoutInProgress}`);
console.log(`State: ${game.state}`);

// Wait for Runout
setTimeout(() => {
  console.log(`State after 2s (FLOP?): ${game.state}`);
}, 2000);

setTimeout(() => {
  console.log(`State after 4s (TURN?): ${game.state}`);
}, 4000);

setTimeout(() => {
  console.log(`State after 6s (RIVER?): ${game.state}`);
}, 6000);

setTimeout(() => {
  console.log(`State after 8s (SHOWDOWN?): ${game.state}`);
  if (game.state === 'SHOWDOWN') console.log('PASS: All-In Runout verified');
  else console.error('FAIL: Did not reach Showdown');
}, 8000);
