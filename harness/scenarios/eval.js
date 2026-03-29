import { evaluateHand } from '../../src/logic/poker.js';

export const evalScenarios = [
    {
        name: "Nut Flush vs King High Flush",
        setup: () => {
            const h1 = ['As', 'Ks', 'Qs', 'Js', '9s'];
            const h2 = ['Ks', 'Qs', 'Js', 'Ts', '8s'];
            return { h1, h2 };
        },
        action: ({ h1, h2 }) => {
            const r1 = evaluateHand(h1);
            const r2 = evaluateHand(h2);
            return { r1, r2 };
        },
        expect: (result) => result.r1.total > result.r2.total && result.r1.name === 'Flush'
    },
    {
        name: "Lowest Flush Verification",
        setup: () => {
            return { hand: ['7s', '5s', '4s', '3s', '2s'] };
        },
        action: ({ hand }) => evaluateHand(hand),
        expect: (result) => result.name === 'Flush'
    }
];
