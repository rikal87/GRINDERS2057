import { createMockEngine } from '../core/EngineMocker.js';
import { getUnifiedAction } from '../../src/logic/aiEngine/aiBrainHub.js';

export const preflopScenarios = [
    {
        name: "UTG Open (AA) - Strong Raise",
        setup: () => {
            const engine = createMockEngine({ state: 'PREFLOP', playerCount: 6 });
            const player = engine.players[3]; // UTG in 6-max (index 3 if dealer is 0)
            player.hand = ["As", "Ad"];
            engine.currentRoundBet = 2; // BB
            return { player, engine };
        },
        action: getUnifiedAction,
        expect: (result) => result.type === 'raise'
    },
    {
        name: "BB Defend (JsTs) vs BTN Open",
        setup: () => {
            const engine = createMockEngine({ state: 'PREFLOP', playerCount: 6 });
            const player = engine.players[2]; // BB
            const btn = engine.players[0]; // BTN
            
            player.hand = ["Js", "Ts"];
            player.currentBet = 2; // BB
            
            // BTN raises to 6
            btn.currentBet = 6;
            engine.currentRoundBet = 6;
            engine.pot = 9; // SB(1) + BB(2) + BTN(6)
            engine.preflopRaises = 1;
            
            return { player, engine };
        },
        action: getUnifiedAction,
        expect: (result) => ['call', 'raise'].includes(result.type)
    }
];
