import { createMockEngine, createMockPlayer } from '../core/EngineMocker.js';
import { getUnifiedAction as getAdvancedAIAction } from '../../src/logic/aiEngine/aiBrainHub.js';
import { getAIAction } from '../../src/logic/aiEngine.v2.js';
import { createDeck } from '../../src/logic/poker.js';
import { PotManager } from '../../src/logic/PotManager.js';
import { CLASSES_ENEMY as D1, CLASSES_PARTNER as D2 } from '../../src/logic/persona.js';

const ALL_CLASSES = [...D2, ...D1];

const HAND_TIERS = {
    SUPER_PREMIUM: [['As', 'Ah'], ['Ks', 'Kh'], ['Qs', 'Qh']],
    PREMIUM: [['Js', 'Jh'], ['Ts', 'Th'], ['Ac', 'Kc'], ['Ad', 'Kd'], ['As', 'Qs']],
    STRONG: [['9s', '9h'], ['8s', '8h'], ['Ac', 'Qc'], ['Ah', 'Qd'], ['Ks', 'Js']],
    CONNECTORS: [['8s', '7s'], ['9c', '8c'], ['Tc', 'Jc'], ['Qs', 'Js']]
};

/**
 * PHASE 4: STAGED SIMULATION
 * Goal: Track statistical convergence (VPIP/PFR) over 250 hands.
 */
export async function runStagedSimulation(runner) {
    const oppNames = ['Max', 'rich_guy', 'shark'];
    const players = oppNames.map(name => {
        const template = ALL_CLASSES.find(c => c.id === name || c.name === name);
        return createMockPlayer({
            id: `${name}_0`,
            name,
            class: template,
            chips: 2000,
            startChips: 2000
        });
    });

    const potManager = new PotManager();
    const engine = createMockEngine({ 
        players, 
        bb: 20, 
        sb: 10,
        potManager 
    });

    function getAIActionByPersona(p, eng) {
        if (p.id.startsWith('shark') || p.class?.isBoss) {
            return getAdvancedAIAction(p, eng);
        }
        return getAIAction(p, eng);
    }

    const runBettingRound = (street) => {
        engine.state = street;
        engine.currentStreetRaises = 0;
        players.forEach(p => p.handState.actedThisStreet = false);

        let actingIdx = (street === 'PREFLOP') ? (engine.dealerIndex + 3) % players.length : (engine.dealerIndex + 1) % players.length;

        let attempts = 0;
        const maxAttempts = 50;

        while (attempts < maxAttempts) {
            attempts++;
            const activePlayers = players.filter(p => !p.isFolded && p.chips > 0);
            const playersWithChips = players.filter(p => !p.isFolded && p.chips >= 1);
            
            // Sync with gameEngine.js: If everyone is all-in or folded, force next street
            if (activePlayers.length <= 1 || playersWithChips.length === 0) break;

            const missingAction = activePlayers.find(p => !p.handState.actedThisStreet || p.currentBet < potManager.currentRoundBet);
            if (!missingAction) break;

            const p = players[actingIdx];

            if (!p.isFolded && p.chips > 0) {
                const callAmt = potManager.currentRoundBet - p.currentBet;
                engine.currentRoundBet = potManager.currentRoundBet;
                
                // CRITICAL: Ensure AI sees total pot (collected + current bets)
                engine.pot = potManager.pot;
                engine.aggressor = p.handState.wasLastAggressor ? p.id : engine.aggressor;

                const action = getAIActionByPersona(p, engine);
                let amount = 0;

                const actionType = action.action || action.type || 'fold';

                if (actionType === 'fold') {
                    p.isFolded = true;
                } else if (actionType === 'call' || actionType === 'check') {
                    amount = callAmt;
                    p.handState.actedThisStreet = true;
                    if (amount > 0 && !p.handState.didVpip) {
                        p.handState.didVpip = true;
                        p.stats.vpipCount++;
                    }
                } else {
                    const targetAmount = action.amount || (callAmt + engine.bb);
                    amount = targetAmount - p.currentBet;
                    if (amount > p.chips) amount = p.chips;

                    const isActualRaise = (p.currentBet + amount) > potManager.currentRoundBet;
                    if (isActualRaise) {
                        engine.currentStreetRaises++;
                        if (street === 'PREFLOP') {
                            engine.preflopRaises++;
                            if (engine.currentStreetRaises === 1) {
                                if (!p.handState.didPfr) { p.stats.pfrCount++; p.handState.didPfr = true; }
                                players.forEach(px => { if (px.id !== p.id && !px.isFolded && px.chips > 0) px.stats.threeBetOppCount++; });
                            } else if (engine.currentStreetRaises === 2) {
                                p.stats.threeBetCount++;
                                players.forEach(px => { if (px.id !== p.id && !px.isFolded && px.chips > 0) px.stats.fourBetOppCount++; });
                            }
                        }
                        players.filter(px => px.id !== p.id && !px.isFolded).forEach(px => px.handState.actedThisStreet = false);
                    }
                    
                    p.handState.actedThisStreet = true;
                    if (!p.handState.didVpip) {
                        p.handState.didVpip = true;
                        p.stats.vpipCount++;
                    }
                }

                if (amount > 0) potManager.placeBet(p, amount);
            }
            actingIdx = (actingIdx + 1) % players.length;
        }
        players.forEach(p => p.currentBet = 0);
        potManager.currentRoundBet = 0;
    };

    const handsToPlay = 250;
    runner.addLog(`Starting Staged Simulation with: ${oppNames.join(', ')}`);

    for (let hand = 0; hand < handsToPlay; hand++) {
        const deck = createDeck();
        potManager.resetHand();
        engine.dealerIndex = hand % players.length;
        engine.board = [];
        engine.preflopRaises = 0;
        engine.aggressor = null;

        const rotation = Math.floor(hand / 5) % players.length;
        let tierMap = {};
        if (rotation === 0) tierMap = { Max: 'SUPER_PREMIUM', rich_guy: 'PREMIUM', shark: 'STRONG' };
        else if (rotation === 1) tierMap = { Max: 'STRONG', rich_guy: 'SUPER_PREMIUM', shark: 'PREMIUM' };
        else tierMap = { Max: 'PREMIUM', rich_guy: 'STRONG', shark: 'SUPER_PREMIUM' };

        players.forEach(p => {
            const isStaged = Math.random() < 0.25; // Introduce 75% Junk hands for realistic folding
            if (isStaged) {
                const tier = tierMap[p.name] || 'STRONG';
                const possibilities = HAND_TIERS[tier];
                const selected = possibilities[Math.floor(Math.random() * possibilities.length)];
                p.hand = [...selected]; 
            } else {
                p.hand = [deck.pop(), deck.pop()];
            }
            p.isFolded = false;
            p.currentBet = 0;
            p.totalWagered = 0;
            p.handState = { didVpip: false, didPfr: false, didThreeBet: false, didFourBetPlus: false, actedThisStreet: false };
            p.stats.handsPlayed++;
        });

        // Blinds
        potManager.placeBet(players[(engine.dealerIndex + 1) % players.length], engine.sb);
        potManager.placeBet(players[(engine.dealerIndex + 2) % players.length], engine.bb);

        runBettingRound('PREFLOP');

        const streets = ['FLOP', 'TURN', 'RIVER'];
        for (const street of streets) {
            const activeCount = players.filter(p => !p.isFolded).length;
            if (activeCount <= 1) break;

            const deckCount = street === 'FLOP' ? 3 : 1;
            for (let i = 0; i < deckCount; i++) engine.board.push(deck.pop());
            
            players.filter(p => !p.isFolded).forEach(p => {
                if (street === 'FLOP') p.stats.sawFlopCount++;
                else if (street === 'TURN') p.stats.sawTurnCount++;
                else if (street === 'RIVER') p.stats.sawRiverCount++;
            });

            runBettingRound(street);
        }

        const activeAtEnd = players.filter(p => !p.isFolded);
        if (activeAtEnd.length > 1) {
            activeAtEnd.forEach(p => p.stats.showdownCount++);
            const results = potManager.resolveShowdown(players, engine.board, true);
            results.results.forEach(res => {
                if (res.amountWon > 0) {
                    res.player.stats.showdownWinCount++;
                    res.player.stats.wins++;
                }
            });
        } else if (activeAtEnd.length === 1) {
            const winner = activeAtEnd[0];
            winner.chips += potManager.pot;
            winner.stats.wins++;
        }

        if ((hand + 1) % 50 === 0) {
            runner.addLog(`Progress: ${hand + 1}/${handsToPlay} hands simulated...`);
        }
    }

    runner.addLog("\n--- Persona Stat Validation (Robust) ---");
    const threshold = 15;
    let allValid = true;

    players.forEach(p => {
        const vpip = (p.stats.vpipCount / p.stats.handsPlayed);
        const pfr = (p.stats.pfrCount / p.stats.handsPlayed);
        const wtsd = (p.stats.showdownCount / (p.stats.sawFlopCount || 1));
        const wsd = (p.stats.showdownWinCount / (p.stats.showdownCount || 1));

        const targetVpip = p.class?.vPIP || 0.3;
        const targetPfr = (targetVpip * 0.7);

        const vpipDiff = Math.abs((vpip - targetVpip) * 100);
        const vpipStatus = vpipDiff <= threshold ? 'PASS' : 'DRIFT';

        if (vpipStatus === 'DRIFT') allValid = false;

        runner.addLog(
            `${p.name.padEnd(10)} | ` +
            `VPIP: ${(vpip * 100).toFixed(1)}% (Target: ${(targetVpip * 100).toFixed(0)}%, ${vpipStatus}) | ` +
            `PFR: ${(pfr * 100).toFixed(1)}% | ` +
            `WTSD: ${(wtsd * 100).toFixed(1)}% | W$SD: ${(wsd * 100).toFixed(1)}%`
        );
    });

    return allValid;
}
