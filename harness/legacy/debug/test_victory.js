
import { GameEngine } from '../gameEngine.js';
import { EventAdaptor } from '../gameEngineEventAdaptor.js';

console.log('--- Victory Logic Verification ---');

// Mock EventAdaptor to capture events
EventAdaptor.prototype.playerEliminated = (p) => console.log(`[EVENT] Player Eliminated: ${p.name}`);
EventAdaptor.prototype.gameWon = ({ player, prize }) => console.log(`[EVENT] Game Won by ${player.name} with prize ${prize}`);

// Initialize Game with 1 CPU
const engine = new GameEngine('VANGUARD', 2, 10, 20, 1000);
const cpu = engine.players[1];

console.log(`Initial Players: ${engine.players.length}`);

// Force CPU bankruptcy
console.log('Forcing CPU bankruptcy...');
cpu.chips = 0;

// Run checkBankruptcy
engine.checkBankruptcy();

console.log(`Players Remaining: ${engine.players.length}`);
if (engine.players.length === 1 && engine.players[0].isHuman) {
  console.log('PASS: CPU eliminated, Human remaining.');
} else {
  console.error('FAIL: Player count mismatch.');
}

if (engine.gameOver && engine.winnerId === 'player') {
  console.log('PASS: Game Over triggered with Player Victory.');
} else {
  console.error(`FAIL: Game Over state: ${engine.gameOver}, Winner: ${engine.winnerId}`);
}
