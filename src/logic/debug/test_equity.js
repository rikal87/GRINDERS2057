
import { calculateEquity, createDeck } from '../poker.js';

console.log('--- Equity Calculation Test ---');

// Scenario 1: Preflop AA vs KK
const p1 = { id: 'p1', hand: ['As', 'Ad'], isFolded: false };
const p2 = { id: 'p2', hand: ['Ks', 'Kd'], isFolded: false };
const board1 = [];

console.log('Scenario 1: Preflop AA vs KK (Expected ~82% vs ~18%)');
const eq1 = calculateEquity([p1, p2], board1, 5000);
console.log('Result:', eq1);

// Scenario 2: Flop - Flush Draw vs Top Pair
// Board: 2h, 7h, Jd
// P1: Ah, Kh (Nut Flush Draw + Overcards)
// P2: Js, 9c (Top Pair)
const p3 = { id: 'draw', hand: ['Ah', 'Kh'], isFolded: false };
const p4 = { id: 'pair', hand: ['Js', '9c'], isFolded: false };
const board2 = ['2h', '7h', 'Jd'];

console.log('\nScenario 2: Flop - Flush Draw vs Top Pair');
const eq2 = calculateEquity([p3, p4], board2, 5000);
console.log('Result:', eq2);

// Scenario 3: River (Deterministic)
// Board: 2h, 7h, Jd, 3s, 2c
// P3: Ah, Kh (High Card A)
// P4: Js, 9c (Two Pair Js and 2s) -> Winner
const board3 = ['2h', '7h', 'Jd', '3s', '2c'];
console.log('\nScenario 3: River (Deterministic)');
const eq3 = calculateEquity([p3, p4], board3, 10);
console.log('Result:', eq3);
