import { evaluateHand } from './poker.js';

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
    amount = Math.floor(amount); // [FIX] Enforce integer bets
    if (amount > player.chips) amount = player.chips;
    player.chips -= amount;
    player.currentBet += amount;
    player.totalWagered = (player.totalWagered || 0) + amount; // 이번 핸드에서 플레이어가 총 베팅으로 넣은 전체 금액입니다.
    this.pot += amount;

    if (player.currentBet > this.currentRoundBet) {
      this.currentRoundBet = player.currentBet;
      return true; // Indicates a raise occurred
    }
    return false;
  }
  // apply rake only if flop is dealt
  resolveShowdown(players, board, isNoFlopNoDrop = false) {
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
    let contestedWins = {};
    let detailedPots = []; // [NEW] For sequential UI visualization
    players.forEach(p => {
      winnings[p.id] = 0;
      contestedWins[p.id] = 0;
    });
    // Track total rake collected for display/stats?
    let totalRakeCollected = 0;

    pots.forEach((pot, index) => {
      if (pot.amount <= 0) return;

      // Find winner for this pot
      let contenders = pot.eligiblePlayers;
      contenders.sort((a, b) => {
        // Prioritize Rank (Integer 1-10) to avoid any float/large number precision issues
        if (b.handRank.rank !== a.handRank.rank) {
          return b.handRank.rank - a.handRank.rank;
        }
        return b.handRank.total - a.handRank.total;
      }); // Descending

      // Check for ties
      let bestScore = contenders[0].handRank.total;
      let winners = contenders.filter(c => c.handRank.total === bestScore);

      // [DEBUG] Showdown Analysis
      console.group('SHOWDOWN_ANALYSIS_POT');
      console.log(`Pot Amount: ${pot.amount}, Contenders: ${contenders.length}`);
      contenders.forEach(c => {
        console.log(`Player ${c.id}: ${c.handRank.name} (Rank: ${c.handRank.rank}, Total: ${c.handRank.total}) - ${c.handRank.cards.join(',')}`);
      });
      console.log(`Winner(s): ${winners.map(w => w.id).join(', ')}`);
      // Sanity Check: If winner's rank < any loser's rank, something is WRONG.
      // E.g. Winner One Pair (2) vs Loser Flush (6).
      const winnerRank = winners[0].handRank.rank;
      const maxRank = Math.max(...contenders.map(c => c.handRank.rank));
      if (winnerRank < maxRank) {
        console.error('[CRITICAL] SHOWDOWN BUG DETECTED: Winner has lower rank than a loser!');
        // Force correction?
        // This implies 'total' calculation was inconsistent with 'rank'.
        // Re-sort via rank primary?
        // contenders.sort((a,b) => (b.handRank.rank - a.handRank.rank) || (b.handRank.total - a.handRank.total));
      }
      console.groupEnd();

      // Rake Calculation
      let roughRake = isNoFlopNoDrop ? 0 : Math.min(pot.amount * this.rake, this.rakeCap);

      // Apply Rake Reduction (if winner has item)
      let maxReduction = 0;
      winners.forEach(w => {
        if (w.item && w.item.effects) {
          const reductionEffect = w.item.effects.reduce((sum, e) => (e.effect && e.effect.type === 'rake_reduction') ? sum + e.effect.value : sum, 0);
          // apply reduction to strongest effect
          maxReduction = Math.max(maxReduction, reductionEffect)
        }
      });

      // Cap reduction at 100%
      if (maxReduction > 1) maxReduction = 1;

      let finalRake = Math.floor(roughRake * (1 - maxReduction));
      totalRakeCollected += finalRake;

      let distributable = Math.floor(pot.amount - finalRake); // [FIX] Ensure distributable is integer

      if (distributable <= 0) return; // Should not happen unless rake > pot

      let share = Math.floor(distributable / winners.length);
      const isContested = contenders.length > 1;

      // [NEW] Track detailed pot info
      let potName;

      // Re-eval name logic for clarity:
      // Index 0 is always Main.
      // Index > 0:
      //   If 1 contender -> Returned
      //   If >1 contenders -> Side Pot X

      if (index === 0) {
        potName = 'Main Pot';
      } else if (contenders.length === 1) {
        potName = 'Returned';
      } else {
        // Count how many "Side Pots" we have so far
        const sidePotCount = detailedPots.filter(p => p.name.startsWith('Side Pot')).length;
        potName = `Side Pot ${sidePotCount + 1}`;
      }

      let potDetail = {
        name: potName,
        amount: distributable,
        winners: winners.map(w => w.id),
        winningHand: winners[0].handRank,
        isContested: isContested
      };
      detailedPots.push(potDetail);

      winners.forEach(w => {
        winnings[w.id] += share;
        if (isContested) {
          contestedWins[w.id] += share;
        }
      });

      // Remainder (1 chip) goes to first (simplified)
      let remainder = distributable % winners.length;
      if (remainder > 0) {
        winnings[winners[0].id] += remainder;
        if (isContested) {
          contestedWins[winners[0].id] += remainder;
        }
      }
    });

    // [NEW] Post-process detailedPots to merge identical winner sets (for cleaner UI)
    // We only merge "Side Pot" entries, or any pots really? 
    // User requested: "If identical winners, group them".
    // Strategy: Collapse consecutive pots if winners are identical.

    if (detailedPots.length > 1) {
      let mergedPots = [];
      let currentGroup = null;

      detailedPots.forEach(pot => {
        if (!currentGroup) {
          currentGroup = { ...pot };
          return;
        }

        // Check if winners are effectively identical
        // Sort both arrays to be sure, though they usually come from same object refs if same players
        // But let's rely on ID string comparison
        const w1 = currentGroup.winners.slice().sort().join(',');
        const w2 = pot.winners.slice().sort().join(',');

        if (w1 === w2) {
          // Merge!
          currentGroup.amount += pot.amount;
          // Update Name
          const isMainInGroup = currentGroup.name.includes('Main Pot');
          const isMainInNew = pot.name.includes('Main Pot');
          const isReturnedInGroup = currentGroup.name.includes('Returned');
          const isReturnedInNew = pot.name.includes('Returned');

          if (isMainInGroup || isMainInNew) {
            // If merging Main Pot with Returned -> Main Pot
            if (isReturnedInGroup || isReturnedInNew) {
              currentGroup.name = 'Main Pot';
            } else {
              // Merging Main Pot with actual Side Pots
              currentGroup.name = 'Main Pot & Side Pots';
            }
          } else if (isReturnedInGroup && isReturnedInNew) {
            currentGroup.name = 'Returned';
          } else {
            // Side Pot + Side Pot = Side Pots
            currentGroup.name = 'Side Pots';
          }
        } else {
          // Push current and start new
          mergedPots.push(currentGroup);
          currentGroup = { ...pot };
        }
      });
      if (currentGroup) mergedPots.push(currentGroup);
      detailedPots = mergedPots;
    }

    // 5. Apply winnings and generate result object
    activePlayers.forEach(p => {
      let amountWon = winnings[p.id];
      if (amountWon > 0) {
        p.chips += amountWon;
      }
    });

    // Identify primary winner for UI highlights
    // Use Net Profit (Amount Won - Total Wagered) to determine true winner
    // This prevents "Refund Winners" (who bet huge, everyone else all-in small, they get refund > main pot) from being marked winner
    let bestWinner = activePlayers.reduce((prev, current) => {
      const prevNet = winnings[prev.id] - (prev.totalWagered || 0);
      const currNet = winnings[current.id] - (current.totalWagered || 0);
      return currNet > prevNet ? current : prev;
    }, activePlayers[0]);

    // Fallback: If nobody made profit (e.g. all equal loss due to rake?), use raw winnings
    // But usually someone makes profit in poker unless rake > 100%.

    // Return structured results for UI
    return {
      results: activePlayers.map(p => ({
        id: p.id,
        player: p,
        hand: p.handRank,
        isMe: p.isMe,
        isWinner: contestedWins[p.id] > 0 || activePlayers.length === 1, // Mark as winner if they won a contested pot or are the last player standing
        amountWon: winnings[p.id] //  해당 플레이어가 쇼다운 결과로 돌려받는(승리 또는 무승부/사이드팟으로 얻는) 칩의 양입니다. 완전히 패배했다면 0이 됩니다. (간혹 여러 명이 올인하여 사이드팟을 먹었다면 0이 아닌 일부 금액을 돌려받을 수 있습니다.)
      })),
      winnerId: bestWinner ? bestWinner.id : null,
      rake: totalRakeCollected,
      detailedPots: detailedPots // [NEW] Return detailed pots
    };
  }
}
