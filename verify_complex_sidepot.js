
// MOCK POKER
const evaluateHand = (cards) => {
  // P1 (Short): AA 
  // P2 (Mid): KK
  // P3 (Deep1): QQ
  // P4 (Deep2): JJ
  const handStr = cards.slice(0, 2).map(c => c).join('');
  if (handStr.includes('As')) return { total: 1000, name: 'AA' };
  if (handStr.includes('Ks')) return { total: 800, name: 'KK' };
  if (handStr.includes('Qs')) return { total: 600, name: 'QQ' };
  if (handStr.includes('Js')) return { total: 400, name: 'JJ' };
  return { total: 0 };
};

// POTMANAGER (Copied for isolation)
class PotManager {
  constructor(rake = 0.05, rakeCap = 50) {
    this.pot = 0;
    this.currentRoundBet = 0;
    this.rake = rake;
    this.rakeCap = rakeCap;
  }
  placeBet(player, amount) {
    player.currentBet += amount;
    player.totalWagered = (player.totalWagered || 0) + amount;
    this.pot += amount;
    if (player.currentBet > this.currentRoundBet) {
      this.currentRoundBet = player.currentBet;
      return true;
    }
    return false;
  }
  resolveShowdown(players, board) {
    let activePlayers = players.filter(p => !p.isFolded);
    activePlayers.forEach(p => p.handRank = evaluateHand([...p.hand, ...board]));
    let pots = [];
    let allPlayers = [...players].sort((a, b) => (a.totalWagered || 0) - (b.totalWagered || 0));
    let lastWagered = 0;
    for (let i = 0; i < allPlayers.length; i++) {
      let p = allPlayers[i];
      let wager = p.totalWagered || 0;
      if (wager > lastWagered) {
        let diff = wager - lastWagered;
        let contributors = players.filter(pl => (pl.totalWagered || 0) >= wager);
        let potAmount = diff * contributors.length;
        let eligibleActivePlayers = activePlayers.filter(ap => (ap.totalWagered || 0) >= wager);
        if (eligibleActivePlayers.length > 0) {
          pots.push({ amount: potAmount, eligiblePlayers: eligibleActivePlayers });
        }
        lastWagered = wager;
      }
    }
    let winnings = {};
    players.forEach(p => winnings[p.id] = 0);
    pots.forEach(pot => {
      if (pot.amount <= 0) return;
      let contenders = pot.eligiblePlayers;
      contenders.sort((a, b) => b.handRank.total - a.handRank.total);
      let bestScore = contenders[0].handRank.total;
      let winners = contenders.filter(c => c.handRank.total === bestScore);
      let share = Math.floor(pot.amount / winners.length);
      winners.forEach(w => winnings[w.id] += share);
    });
    return {
      results: activePlayers.map(p => ({ id: p.id, amountWon: winnings[p.id] })),
      pots: pots // Return pots for debug inspection
    };
  }
}

// TEST: Short(20), Mid(50), Deep(100), Deep(100)
// P1 (Short): AA - All-in 2000
// P2 (Mid): KK - All-in 5000
// P3 (Deep): QQ - All-in 10000
// P4 (Deep): JJ - All-in 10000

const pm = new PotManager(0, 0);

const p1 = { id: 'p1', name: 'Short', chips: 0, totalWagered: 0, currentBet: 0, hand: ['As', 'Ah'] };  // 2000
const p2 = { id: 'p2', name: 'Mid', chips: 0, totalWagered: 0, currentBet: 0, hand: ['Ks', 'Kh'] };  // 5000
const p3 = { id: 'p3', name: 'Deep1', chips: 0, totalWagered: 0, currentBet: 0, hand: ['Qs', 'Qh'] };  // 10000
const p4 = { id: 'p4', name: 'Deep2', chips: 0, totalWagered: 0, currentBet: 0, hand: ['Js', 'Jh'] };  // 10000

const players = [p1, p2, p3, p4];

console.log('--- Complex Multi-Side Pot Test ---');

// Bets
pm.placeBet(p1, 2000);
pm.placeBet(p2, 5000);
pm.placeBet(p3, 10000);
pm.placeBet(p4, 10000);

console.log(`Total Pot: ${pm.pot} (Expected: 2000+5000+10000+10000 = 27000)`);

const result = pm.resolveShowdown(players, []);

// Expected Pots:
// Pot 1 (Main): 2000 * 4 = 8000. Contribs: All. Winner: P1 (AA).
// Pot 2 (Side1): (5000-2000) * 3 = 3000 * 3 = 9000. Contribs: P2, P3, P4. Winner: P2 (KK).
// Pot 3 (Side2): (10000-5000) * 2 = 5000 * 2 = 10000. Contribs: P3, P4. Winner: P3 (QQ).

console.log('--- Pot Makeup ---');
result.pots.forEach((p, i) => {
  console.log(`Pot ${i + 1}: Amount ${p.amount}, Contribs: ${p.eligiblePlayers.length}`);
});

console.log('--- Winnings ---');
result.results.forEach(r => {
  console.log(`${r.id}: ${r.amountWon}`);
});

const p1Win = result.results.find(r => r.id === 'p1').amountWon;
const p2Win = result.results.find(r => r.id === 'p2').amountWon;
const p3Win = result.results.find(r => r.id === 'p3').amountWon;
const p4Win = result.results.find(r => r.id === 'p4').amountWon;

// Validation
if (p1Win === 8000 && p2Win === 9000 && p3Win === 10000 && p4Win === 0) {
  console.log('PASS: Complex logic verified.');
} else {
  console.log('FAIL: Distribution mismatch.');
}
