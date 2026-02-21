import fs from 'fs';
import path from 'path';

const logFile = path.resolve('d:\\github-repository\\CyberPoker2077\\debug_out.txt');

try {
  fs.writeFileSync(logFile, "Starting debug...\n");

  // ... Logic ...
  // Simplified Side Pot Test Logic Inline
  const p1 = { id: 'p1', totalWagered: 2000, isFolded: false, handTotal: 1000 };
  const p2 = { id: 'p2', totalWagered: 5000, isFolded: false, handTotal: 800 };
  const p3 = { id: 'p3', totalWagered: 5000, isFolded: false, handTotal: 600 };
  const players = [p1, p2, p3];

  // Simulate Pot Manager Logic
  let pots = [];
  let allPlayers = [...players].sort((a, b) => a.totalWagered - b.totalWagered);
  let lastWagered = 0;

  for (let i = 0; i < allPlayers.length; i++) {
    let p = allPlayers[i];
    let wager = p.totalWagered;
    if (wager > lastWagered) {
      let diff = wager - lastWagered;
      let contributors = players.filter(pl => pl.totalWagered >= wager);
      let amount = diff * contributors.length;
      pots.push({ amount, contributors });
      lastWagered = wager;
    }
  }

  fs.appendFileSync(logFile, JSON.stringify(pots) + "\n");

  // Check Pots
  // Pot 1: 2000 * 3 = 6000. Contribs: p1, p2, p3. Winner: p1 (1000 score)
  // Pot 2: 3000 * 2 = 6000. Contribs: p2, p3. Winner: p2 (800 score)

  // Resolve
  let winnings = { p1: 0, p2: 0, p3: 0 };

  pots.forEach(pot => {
    let contenders = pot.contributors;
    contenders.sort((a, b) => b.handTotal - a.handTotal);
    let winner = contenders[0];
    winnings[winner.id] += pot.amount;
  });

  fs.appendFileSync(logFile, JSON.stringify(winnings) + "\n");

  if (winnings.p1 === 6000 && winnings.p2 === 6000 && winnings.p3 === 0) {
    fs.appendFileSync(logFile, "PASS\n");
  } else {
    fs.appendFileSync(logFile, "FAIL\n");
  }

} catch (e) {
  fs.writeFileSync(path.resolve('d:\\github-repository\\CyberPoker2077\\debug_error.txt'), e.message);
}
