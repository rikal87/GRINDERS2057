
import { evaluateHand } from './poker.js';

const testHands = [
    { name: 'Nut Flush', cards: ['As', 'Ks', 'Qs', 'Js', '9s'] },
    { name: 'King High Flush High', cards: ['Ks', 'Qs', 'Js', 'Ts', '8s'] },
    { name: 'King High Flush Low', cards: ['Ks', '8s', '6s', '4s', '2s'] },
    { name: 'Lowest Flush', cards: ['7s', '5s', '4s', '3s', '2s'] }
];

testHands.forEach(h => {
    const res = evaluateHand(h.cards);
    console.log(`${h.name}: ${res.name} (Total: ${res.total}, Score: ${res.score})`);
});
