
import { evaluateHand, getHandCategory } from './src/logic/poker.js';
import { getPostflopAction } from './src/logic/aiEngine/strategies/aiBrainPostflop.js';

const player = {
  id: 'shark_1',
  hand: ['8h', '7h'],
  chips: 1000,
  currentBet: 0,
  totalWagered: 271, // 50 (pre) + 60 (flop) + 161 (turn)
  class: { philosophy: 'TAG' }
};

const board = ['3s', 'Ts', '5s', '5d', 'Th'];
const context = {
  player,
  board,
  potSize: 1324 - 386, // Pot before Max's raise level (actually 1324 is final)
  // Let's re-calculate:
  // Preflop: shark_1 50, Max 50 -> Pot 100
  // Flop: shark_1 60, Max 60 -> Pot 220
  // Turn: shark_1 161, Max 161 -> Pot 542
  // River: shark_1 check, Max raises 386 -> Pot 928
  // callAmount: 386
  potSize: 542 + 386, 
  callAmount: 386,
  isCheckable: false,
  street: 'RIVER',
  hasInitiative: true, // shark_1 was the aggressor but checked river
  potType: 'SRP',
  currentStreetRaises: 1
};

const evalResult = evaluateHand([...player.hand, ...board]);
const catInfo = getHandCategory(player.hand, board, evalResult);
const actionData = getPostflopAction(context);

console.log('--- REPRO HAND #433 ---');
console.log(`Hand: ${player.hand.join(',')} | Board: ${board.join(',')}`);
console.log(`Evaluated: ${evalResult.name} (Total: ${evalResult.total})`);
console.log(`Category: ${catInfo.category} (Percentile: ${catInfo.percentile.toFixed(3)})`);
console.log(`Action: ${actionData.action} (${actionData.insight})`);

if (actionData.action === 'call' && actionData.insight.includes('Bluff Catching')) {
  console.log('ISSUE REPRODUCED: AI is bluff catching with 8-high on double-paired board.');
} else {
  console.log('ISSUE NOT REPRODUCED or already fixed.');
}
