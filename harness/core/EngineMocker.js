import { PotManager } from '../../src/logic/PotManager.js';

/**
 * Creates a standardized Mock Player for the harness.
 */
export function createMockPlayer(overrides = {}) {
    const { class: classOverrides, ...rest } = overrides;
    return {
        id: `p${Math.floor(Math.random() * 1000)}`,
        name: 'MockPlayer',
        chips: 1000,
        currentBet: 0,
        totalWagered: 0,
        hand: [],
        isFolded: false,
        handState: { 
            didVpip: false, 
            didPfr: false, 
            didThreeBet: false, 
            didFourBetPlus: false, 
            actedThisStreet: false 
        },
        stats: { 
            handsPlayed: 0, 
            vpipCount: 0, 
            pfrCount: 0, 
            threeBetCount: 0, 
            threeBetOppCount: 0,
            fourBetPlusCount: 0, 
            fourBetOppCount: 0,
            sawFlopCount: 0,
            sawTurnCount: 0,
            sawRiverCount: 0,
            showdownCount: 0,
            showdownWinCount: 0,
            wins: 0,
            winnings: 0 
        },
        ...rest,
        class: { 
            id: 'SIM_BOT', 
            name: 'Simulation Bot', 
            AF: 2, 
            vPIP: 0.25, 
            WTSD: 0.25, 
            isBoss: false,
            ...(classOverrides || {}) 
        }
    };
}

/**
 * Creates a standardized Mock Engine state.
 */
export function createMockEngine(overrides = {}) {
    const playerCount = overrides.playerCount || 6;
    const players = overrides.players || Array(playerCount).fill(0).map((_, i) => createMockPlayer({ id: `p${i}`, name: `Player ${i}` }));

    return {
        state: 'PREFLOP',
        board: [],
        pot: 0,
        currentRoundBet: 0,
        bb: 2,
        sb: 1,
        preflopRaises: 0,
        currentStreetRaises: 0,
        aggressor: null,
        players,
        dealerIndex: 0,
        actionHistory: [],
        handHistory: [],
        ...overrides
    };
}

/**
 * Standardized PotManager factory for tests.
 */
export function createMockPotManager(rake = 0, rakeCap = 0) {
    return new PotManager(rake, rakeCap);
}

/**
 * Utility to setup a specific board/street state.
 */
export function setupStreet(engine, street, board = []) {
    engine.state = street.toUpperCase();
    engine.board = board;
    engine.currentStreetRaises = 0;
    engine.players.forEach(p => p.handState.actedThisStreet = false);
}
