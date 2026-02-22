
// Mocks
const mockStore = {
  store: {
    bankroll: 10000,
    equippedItems: [],
    equippedSkills: [],
    xp: 0,
    level: 1
  }
};

// Mock Player
const player = {
  chips: 0,
  id: 'player'
};

// Mock Logic
async function testBankroll() {
  console.log("Initial Bankroll:", mockStore.store.bankroll);

  // Buy-in
  const BUY_IN = 2000;
  if (mockStore.store.bankroll >= BUY_IN) {
    mockStore.store.bankroll -= BUY_IN;
    player.chips += BUY_IN;
    console.log(`Buy-in success. Bankroll: ${mockStore.store.bankroll}, Chips: ${player.chips}`);
  } else {
    console.log("Buy-in failed");
  }

  // Play: Lose all chips
  player.chips = 0;
  console.log("Player lost all chips.");

  // Re-buy
  if (player.chips <= 0) {
    if (mockStore.store.bankroll >= BUY_IN) {
      mockStore.store.bankroll -= BUY_IN;
      player.chips += BUY_IN;
      console.log(`Auto Re-buy success. Bankroll: ${mockStore.store.bankroll}, Chips: ${player.chips}`);
    } else {
      console.log("Auto Re-buy failed (Bankrupt)");
    }
  }

  // Play: Win some
  player.chips = 5000;
  console.log("Player won chips. Chips:", player.chips);

  // Cash Out
  mockStore.store.bankroll += player.chips;
  player.chips = 0;
  console.log(`Cash Out success. Bankroll: ${mockStore.store.bankroll}, Chips: ${player.chips}`);

  if (mockStore.store.bankroll === 11000) { // 10000 - 2000 - 2000 + 5000
    console.log("PASS: Bankroll logic verified.");
  } else {
    console.error(`FAIL: Expected 11000, got ${mockStore.store.bankroll}`);
  }
}

testBankroll();
