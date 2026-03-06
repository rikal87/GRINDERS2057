
import { getAdvancedAIAction } from './src/logic/aiEngineAdvanced.js';

// Mock Engine for 6-Max
const createEngine = (heroPosName) => {
  // 6 Players
  // Dealer is Index 0.
  // 0: BTN
  // 1: SB
  // 2: BB
  // 3: UTG
  // 4: MP (HJ)
  // 5: CO

  const players = [
    { id: 'btn', name: 'BTN', chips: 1000, hand: [], isFolded: false, currentBet: 0 },
    { id: 'sb', name: 'SB', chips: 1000, hand: [], isFolded: false, currentBet: 10 },
    { id: 'bb', name: 'BB', chips: 1000, hand: [], isFolded: false, currentBet: 20 },
    { id: 'utg', name: 'UTG', chips: 1000, hand: [], isFolded: true, currentBet: 0 }, // Folded
    { id: 'mp', name: 'MP', chips: 1000, hand: [], isFolded: false, currentBet: 0 },  // Hero?
    { id: 'co', name: 'CO', chips: 1000, hand: [], isFolded: false, currentBet: 0 }
  ];

  let heroIndex = -1;
  if (heroPosName === 'UTG') heroIndex = 3;
  if (heroPosName === 'MP') heroIndex = 4;
  if (heroPosName === 'CO') heroIndex = 5;
  if (heroPosName === 'BTN') heroIndex = 0;
  if (heroPosName === 'SB') heroIndex = 1;

  // Give Hero AA
  players[heroIndex].hand = ['As', 'Ah'];
  players[heroIndex].isFolded = false; // Hero is active

  return {
    players,
    dealerIndex: 0,
    bb: 20,
    state: 'PREFLOP',
    currentRoundBet: 20,
    currentStreetRaises: 0,
    aggressor: null,
    potManager: { currentRoundBet: 20 },
    board: []
  };
};

async function runTest() {
  console.log("--- 6-Max RFI Debug ---");
  const positions = ['UTG', 'MP', 'CO', 'BTN', 'SB'];

  for (const pos of positions) {
    const engine = createEngine(pos);
    // Find Hero
    const hero = engine.players.find(p => p.hand[0] === 'As');

    try {
      console.log(`\nTesting Position: ${pos}`);
      const res = getAdvancedAIAction(hero, engine);
      console.log(`Action: ${res.type}, Amount: ${res.amount}, Insight: ${res.insight}`);

      if (res.type === 'fold') {
        console.error(`FAIL: Folded AA at ${pos}`);
      } else {
        console.log(`PASS: Raised at ${pos}`);
      }
    } catch (e) {
      console.error(`ERROR at ${pos}: ${e.message}`);
    }
  }
}

runTest();
