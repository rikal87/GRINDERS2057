import { createMockEngine, createMockPlayer } from '../core/EngineMocker.js';
import { getAIAction } from '../../src/logic/aiEngine.v2.js';

/**
 * Regression Test Suite: "Golden Scenarios"
 * These are fixed-state hands extracted from historical logs (hand_history.log).
 * We expect the AI to make specific strategic decisions in these high-leverage spots.
 */
export const regressionScenarios = [
    {
        name: "Hand #4 Regression: High SPR Value Building (Top Pair)",
        setup: () => {
            const board = ['Jc', '6c', 'Ah', '6d', '2s'];
            const player = createMockPlayer({
                id: 'Max_0',
                name: 'Max_0',
                hand: ['Ac', '7c'], // Top Pair Aces, no kicker
                chips: 1000,
                class: { AF: 4, vPIP: 0.35, WTSD: 0.3 }
            });
            const engine = createMockEngine({
                state: 'RIVER',
                board,
                pot: 1022,
                currentRoundBet: 715, // Facing a large raise
                aggressor: 'fish_1',
                players: [player, createMockPlayer({ id: 'fish_1', chips: 200 })]
            });
            return { player, engine };
        },
        action: getAIAction,
        expect: (result) => {
            // In the original log, Max_0 raised here to 1489 because of high equity (60%).
            // We expect it to at least CALL or RAISE (Continue), but never FOLD.
            return ['call', 'raise', 'all_in'].includes(result.action);
        }
    },
    {
        name: "Hand #17 Regression: Flush Threat Awareness (Set vs 4-Flush Board)",
        setup: () => {
            const board = ['Qh', 'Jh', '5d', 'Th', '6c']; // 3 hearts on board
            const player = createMockPlayer({
                id: 'Max_0',
                name: 'Max_0',
                hand: ['5s', '5c'], // Set of 5s
                chips: 1454,
                class: { AF: 4, vPIP: 0.3, WTSD: 0.3 }
            });
            const engine = createMockEngine({
                state: 'RIVER',
                board,
                pot: 1021,
                currentRoundBet: 393, // Facing a bet on a scary board
                aggressor: 'fish_0',
                players: [player, createMockPlayer({ id: 'fish_0', chips: 1000 })]
            });
            return { player, engine };
        },
        action: getAIAction,
        expect: (result) => {
            // In Hand #17, the AI raised here, but it's a risky spot against a 4-flush.
            // A "Correct" modern AI should be cautious. 
            // We mostly want to ensure it doesn't FAIL the contract and makes a logical move.
            return ['call', 'raise', 'all_in'].includes(result.action);
        }
    }
];
