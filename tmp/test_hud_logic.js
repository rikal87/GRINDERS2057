
import { GameEngine } from '../src/logic/gameEngine.js';
import { store } from '../src/logic/store.js';

async function testStats() {
    console.log('Starting HUD Stats Test...');
    
    // Mock store for testing
    store.isActiveHud = true;
    
    const engine = new GameEngine('GRINDER', 2, 1, 2, 1000);
    const human = engine.players.find(p => p.isMe);
    const cpu = engine.players.find(p => !p.isMe);

    console.log('Hand 1: Human folds preflop, CPU wins.');
    await engine.startNewHand();
    // Preflop: SB(Human), BB(CPU). Human acts first.
    await engine.handlePlayerAction(human, { type: 'fold' });
    
    console.log('Human Stats:', JSON.stringify(human.stats, null, 2));
    console.log('CPU Stats:', JSON.stringify(cpu.stats, null, 2));
    
    if (human.stats.handsPlayed !== 1) throw new Error('Human handsPlayed should be 1');
    if (cpu.stats.handsPlayed !== 1) throw new Error('CPU handsPlayed should be 1');
    if (human.stats.vPIPCount !== 0) throw new Error('Human vPIPCount should be 0 (folded preflop)');

    console.log('Hand 2: Human calls, CPU checks. Flop dealt. Human bets, CPU folds.');
    await engine.startNewHand();
    // Preflop: Dealer moves. Let's assume Human is first again for simplicity in mock if we manually trigger.
    // In real engine, it alternates.
    const activePlayer = engine.players[engine.currentPlayerIndex];
    console.log('Current player to act:', activePlayer.name);
    
    await engine.handlePlayerAction(activePlayer, { type: 'call' });
    const nextPlayer = engine.players[engine.currentPlayerIndex];
    await engine.handlePlayerAction(nextPlayer, { type: 'check' });
    
    console.log('Post-Preflop Stats:');
    engine.players.forEach(p => console.log(`${p.name}: VPIP=${p.stats.vPIP}% PFR=${p.stats.pfr}%`));
    
    if (activePlayer.stats.vPIPCount !== 1) throw new Error(`${activePlayer.name} VPIPCount should be 1`);
    
    console.log('Test Passed!');
}

testStats().catch(err => {
    console.error('Test Failed:', err);
    process.exit(1);
});
