
import fs from 'fs';

function log(msg) {
  try {
    fs.appendFileSync('debug_postflop.txt', msg + '\n');
    console.log(msg);
  } catch (e) { }
}

async function testPostflop() {
  try {
    log("Importing AI...");
    const { getAdvancedAIAction } = await import('./src/logic/aiEngineAdvanced.js');

    // Mock Engine for Flop C-Bet
    const engine = {
      players: [{ id: 'p1', hand: ['As', 'Ks'], currentBet: 0 }], // Hero
      dealerIndex: 0,
      bb: 2,
      state: 'FLOP',
      currentRoundBet: 0,
      currentStreetRaises: 0,
      aggressor: 'p1', // Hero is aggressor
      board: ['Ah', '9d', '2c'], // Top Pair
      pot: 10,
      potManager: { currentRoundBet: 0 }
    };
    const player = engine.players[0];

    log("Testing C-Bet with Top Pair...");
    const result = getAdvancedAIAction(player, engine);
    log(`Result: Action=${result.type}, Insight=${result.insight}`);

    // Mock Engine for Drawing
    const engineDraw = {
      players: [{ id: 'p1', hand: ['Js', 'Ts'], currentBet: 0 }],
      dealerIndex: 0,
      bb: 2,
      state: 'FLOP',
      currentRoundBet: 5, // Facing Bet
      currentStreetRaises: 1,
      aggressor: 'p2', // Villain is aggressor
      board: ['As', '5s', '2d'], // Flush Draw
      pot: 10,
      potManager: { currentRoundBet: 5 }
    };
    const playerDraw = engineDraw.players[0];

    log("Testing Draw Defense...");
    const resultDraw = getAdvancedAIAction(playerDraw, engineDraw);
    log(`Result: Action=${resultDraw.type}, Insight=${resultDraw.insight}`);

  } catch (e) {
    log("Error: " + e.stack);
  }
}

testPostflop();
