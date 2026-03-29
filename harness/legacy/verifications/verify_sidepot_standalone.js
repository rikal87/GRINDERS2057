
// MOCK POKER
const evaluateHand = (cards) => {
  // P1: As Ah (AA)
  // P2: Ks Kh (KK)
  // P3: Qs Qh (QQ)
  const handStr = cards.slice(0, 2).map(c => c).join('');
  // Simple heuristic for our scenario
  if (handStr.includes('As') && handStr.includes('Ah')) return { total: 1000, name: 'AA' };
  if (handStr.includes('Ks') && handStr.includes('Kh')) return { total: 800, name: 'KK' };
  if (handStr.includes('Qs') && handStr.includes('Qh')) return { total: 600, name: 'QQ' };
  return { total: 0 };
};

// COPIED POTMANAGER CLASS (Simplified for test)
class PotManager {
  constructor(rake = 0.05, rakeCap = 50) {
    this.pot = 0;
    this.currentRoundBet = 0;
    this.rake = rake;
    this.rakeCap = rakeCap;
  }

  resetHand() {
    this.pot = 0;
    this.currentRoundBet = 0;
  }

  placeBet(player, amount) {
    if (amount > player.chips) amount = player.chips;
    player.chips -= amount;
    player.currentBet += amount;
    player.totalWagered = (player.totalWagered || 0) + amount;
    this.pot += amount;

    if (player.currentBet > this.currentRoundBet) {
      this.currentRoundBet = player.currentBet;
      return true; // Indicates a raise occurred
    }
    return false;
  }

  resolveShowdown(players, board) {
    // 1. Identify all players involved (not folded)
    let activePlayers = players.filter(p => !p.isFolded);

    // 2. Evaluate hands for everyone
    activePlayers.forEach(p => {
      p.handRank = evaluateHand([...p.hand, ...board]);
    });

    // 3. Create pots container
    // Structure: { amount: number, eligiblePlayers: object[] }
    let pots = [];

    // Collect all players (including folded) to determine pot structure
    let allPlayers = [...players].sort((a, b) => (a.totalWagered || 0) - (b.totalWagered || 0));
    let lastWagered = 0;

    for (let i = 0; i < allPlayers.length; i++) {
      let p = allPlayers[i];
      let wager = p.totalWagered || 0;
      if (wager > lastWagered) {
        let diff = wager - lastWagered;
        let contributors = players.filter(pl => (pl.totalWagered || 0) >= wager);
        let potAmount = diff * contributors.length;

        // Check if any active player is involved in this slice
        let eligibleActivePlayers = activePlayers.filter(ap => (ap.totalWagered || 0) >= wager);

        if (eligibleActivePlayers.length > 0) {
          pots.push({
            amount: potAmount,
            eligiblePlayers: eligibleActivePlayers
          });
        }
        lastWagered = wager;
      }
    }

    // 4. Resolve each pot
    let winnings = {};
    players.forEach(p => winnings[p.id] = 0);
    // Track total rake collected for display/stats?
    let totalRakeCollected = 0;

    pots.forEach(pot => {
      if (pot.amount <= 0) return;

      // Find winner for this pot
      let contenders = pot.eligiblePlayers;
      contenders.sort((a, b) => b.handRank.total - a.handRank.total); // Descending

      // Check for ties
      let bestScore = contenders[0].handRank.total;
      let winners = contenders.filter(c => c.handRank.total === bestScore);

      // Rake Calculation
      let roughRake = Math.min(pot.amount * this.rake, this.rakeCap);
      let maxReduction = 0; // Simplified for test
      let finalRake = Math.floor(roughRake * (1 - maxReduction));
      totalRakeCollected += finalRake;

      let distributable = pot.amount - finalRake;

      if (distributable <= 0) return;

      let share = Math.floor(distributable / winners.length);
      winners.forEach(w => {
        winnings[w.id] += share;
      });

      // Remainder
      let remainder = distributable % winners.length;
      if (remainder > 0) winnings[winners[0].id] += remainder;
    });

    // 5. Apply winnings and generate result object
    activePlayers.forEach(p => {
      let amountWon = winnings[p.id];
      if (amountWon > 0) {
        p.chips += amountWon;
      }
    });

    return {
      results: activePlayers.map(p => ({
        id: p.id,
        amountWon: winnings[p.id]
      })),
      rake: totalRakeCollected
    };
  }
}

// TEST EXECUTION
console.log('--- Testing Standalone Side Pot Logic ---');
const pm = new PotManager(0, 0);

const p1 = { id: 'p1', name: 'Shorty', chips: 2000, currentBet: 0, totalWagered: 0, hand: ['As', 'Ah'], isFolded: false };
const p2 = { id: 'p2', name: 'Deep1', chips: 10000, currentBet: 0, totalWagered: 0, hand: ['Ks', 'Kh'], isFolded: false };
const p3 = { id: 'p3', name: 'Deep2', chips: 10000, currentBet: 0, totalWagered: 0, hand: ['Qs', 'Qh'], isFolded: false };

const players = [p1, p2, p3];

// Preflop: P1 All-in (2000), P2 Call (2000), P3 Call (2000)
pm.placeBet(p1, 2000);
pm.placeBet(p2, 2000);
pm.placeBet(p3, 2000);

// Turn: P2 Bets 3000, P3 Call 3000
pm.placeBet(p2, 3000);
pm.placeBet(p3, 3000);

console.log(`Pot Total: ${pm.pot} (Expected 12000)`);

const result = pm.resolveShowdown(players, []);

const p1Win = result.results.find(r => r.id === 'p1').amountWon;
const p2Win = result.results.find(r => r.id === 'p2').amountWon;
const p3Win = result.results.find(r => r.id === 'p3').amountWon;

console.log(`P1 Won: ${p1Win}`);
console.log(`P2 Won: ${p2Win}`);
console.log(`P3 Won: ${p3Win}`);

if (p1Win === 6000 && p2Win === 6000 && p3Win === 0) {
  console.log('PASS: Side Pot Logic Verified.');
} else {
  console.log('FAIL: Incorrect Distribution.');
}
