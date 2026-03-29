import { createMockEngine, createMockPlayer, setupStreet } from '../core/EngineMocker.js';
import { getUnifiedAction } from '../../src/logic/aiEngine/aiBrainHub.js';

export const postflopScenarios = [
    {
        name: "Flop C-Bet with Top Pair (AK on A92r)",
        setup: () => {
            const engine = createMockEngine({ state: 'FLOP', pot: 10 });
            const player = engine.players[0]; // Hero
            player.hand = ['As', 'Ks'];
            engine.aggressor = player.id; // We were the preflop raiser
            setupStreet(engine, 'FLOP', ['Ah', '9d', '2c']);
            engine.currentRoundBet = 0; // Checked to us
            return { player, engine };
        },
        action: getUnifiedAction,
        expect: (result) => result.type === 'raise' || result.type === 'bet'
    },
    {
        name: "Flop Defense with Flush Draw (JTs on As5s2d)",
        setup: () => {
            const engine = createMockEngine({ state: 'FLOP', pot: 10 });
            const player = engine.players[2]; // BB
            player.hand = ['Js', 'Ts'];
            engine.aggressor = 'p0'; // BTN is aggressor
            setupStreet(engine, 'FLOP', ['As', '5s', '2d']);
            
            // Facing a bet of 5
            engine.currentRoundBet = 5;
            player.currentBet = 0;
            return { player, engine };
        },
        action: getUnifiedAction,
        expect: (result) => ['call', 'raise'].includes(result.type)
    }
];
