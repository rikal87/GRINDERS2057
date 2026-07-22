import { evaluateHand } from './poker.js';
import { ITEM_EFFECT_ID } from './constants.js';

export class PotManager {
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
    amount = Math.floor(amount);
    if (amount > player.chips) amount = player.chips;
    player.chips -= amount;
    player.currentBet += amount;
    player.totalWagered = (player.totalWagered || 0) + amount;
    this.pot += amount;

    if (player.currentBet > this.currentRoundBet) {
      const isCleanRaise = amount > (this.currentRoundBet - (player.currentBet - amount));
      this.currentRoundBet = player.currentBet;
      return isCleanRaise;
    }
    return false;
  }

  returnUncalledBets(players) {
    const sortedByWager = [...players].sort((a, b) => (b.totalWagered || 0) - (a.totalWagered || 0));
    
    if (sortedByWager.length > 1 && (sortedByWager[0].totalWagered || 0) > (sortedByWager[1].totalWagered || 0)) {
      const topWager = sortedByWager[0].totalWagered || 0;
      const secondWager = sortedByWager[1].totalWagered || 0;
      const uncalled = topWager - secondWager;
      const player = sortedByWager[0];

      player.chips += uncalled;
      player.totalWagered -= uncalled;
      this.pot -= uncalled;
      
      return { player, amount: uncalled };
    }
    return null;
  }

  resolveShowdown(players, board, isNoFlopNoDrop = false) {
    this.returnUncalledBets(players);
    let activePlayers = players.filter(p => !p.isFolded);

    activePlayers.forEach(p => {
      p.handRank = evaluateHand([...p.hand, ...board]);
    });

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
          pots.push({
            amount: potAmount,
            eligiblePlayers: eligibleActivePlayers
          });
        }
        lastWagered = wager;
      }
    }

    let winnings = {};
    let playerRakeSaved = {};
    let contestedWins = {};
    let detailedPots = [];
    players.forEach(p => {
      winnings[p.id] = 0;
      playerRakeSaved[p.id] = 0;
      contestedWins[p.id] = 0;
    });

    let totalRakeCollected = 0;
    let totalRakeSaved = 0;
    let remainingRakeCap = this.rakeCap;

    pots.forEach((pot, index) => {
      if (pot.amount <= 0) return;

      let contenders = pot.eligiblePlayers;
      contenders.sort((a, b) => {
        if (b.handRank.rank !== a.handRank.rank) {
          return b.handRank.rank - a.handRank.rank;
        }
        return b.handRank.total - a.handRank.total;
      });

      let bestScore = contenders[0].handRank.total;
      let winners = contenders.filter(c => c.handRank.total === bestScore);

      let theoreticalRake = isNoFlopNoDrop ? 0 : Math.min(pot.amount * this.rake, remainingRakeCap);
      let maxReduction = 0;

      let finalRake = Math.floor(theoreticalRake * (1 - maxReduction));
      let rakeSaved = theoreticalRake - finalRake;

      totalRakeCollected += finalRake;
      totalRakeSaved += rakeSaved;
      remainingRakeCap = Math.max(0, remainingRakeCap - finalRake);

      let distributable = Math.floor(pot.amount - finalRake);
      if (distributable <= 0) return;

      let share = Math.floor(distributable / winners.length);
      const isContested = contenders.length > 1;

      let potName = index === 0 ? 'Main Pot' : (contenders.length === 1 ? 'Returned' : `Side Pot ${index}`);
      let potDetail = {
        name: potName,
        amount: distributable,
        winners: winners.map(w => w.id),
        winningHand: winners[0].handRank,
        isContested,
        rakeCollected: finalRake,
        rakeSaved
      };
      detailedPots.push(potDetail);

      winners.forEach(w => {
        winnings[w.id] += share;
        playerRakeSaved[w.id] += Math.floor(rakeSaved / winners.length);
        if (isContested) contestedWins[w.id] += share;
      });

      let remainder = distributable % winners.length;
      if (remainder > 0) {
        winnings[winners[0].id] += remainder;
        playerRakeSaved[winners[0].id] += (rakeSaved % winners.length);
        if (isContested) contestedWins[winners[0].id] += remainder;
      }
    });

    activePlayers.forEach(p => {
      let amountWon = winnings[p.id];
      if (amountWon > 0) p.chips += Math.floor(amountWon);
    });

    let maxNet = -Infinity;
    let bestWinners = [];
    activePlayers.forEach(p => {
      const net = winnings[p.id] - (p.totalWagered || 0);
      if (net > maxNet) {
        maxNet = net;
        bestWinners = [p];
      } else if (net === maxNet) {
        bestWinners.push(p);
      }
    });

    let bestWinner = bestWinners.length > 0 ? bestWinners[0] : null;
    let isChop = bestWinners.length > 1 || (detailedPots.length > 0 && detailedPots.some(p => p.winners.length > 1 && p.name.includes('Main Pot')));

    return {
      results: activePlayers.map(p => ({
        id: p.id,
        player: p,
        hand: p.handRank,
        isMe: p.isMe,
        isWinner: contestedWins[p.id] > 0 || activePlayers.length === 1,
        amountWon: winnings[p.id],
        rakeSaved: playerRakeSaved[p.id]
      })),
      winnerId: bestWinner ? bestWinner.id : null,
      isChop,
      choppers: bestWinners.map(w => w.id),
      rake: totalRakeCollected,
      rakeSaved: totalRakeSaved,
      detailedPots
    };
  }
}
