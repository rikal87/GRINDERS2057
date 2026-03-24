# Strategic Analysis: 1-Card vs. 2-Card Flush (poker.js)

## 1. Why the distinction currently exists
The logic at line 718 separates flushes into "Hidden/Robust" (2-cards) and "Obvious/Vulnerable" (1-card).

### A. 2-Card Flush (3-Flush Boards)
- **Rarity**: Much harder to make.
- **Strength**: You hold two of the suit, significantly blocking the opponent's ability to have a better flush.
- **Deception**: The opponent cannot see 4 of the suit on the board, so they may over-value their sets or straights.
- **Strategy**: This is almost always a `MONSTER` value-betting hand.

### B. 1-Card Flush (4-Flush/5-Flush Boards)
- **Visibility**: Every player sees the flush possibility immediately.
- **Vulnerability**: You only hold ONE card. If you don't have the Ace or King, any opponent with a single higher card of that suit wins.
- **Chop Potential**: On a 5-flush board, many games end in a chop or a tiny "kicker" win.
- **Strategy**: Often becomes a "Bluff-Catcher" or a thin value bet rather than a stack-committing monster.

## 2. Is it redundant with `absRank` (Nut Status)?
Technically, **YES** and **NO**.
- **Yes**: `absRank` (Absolute Rank) knows that a 1-card 9-high flush is rank #25 while an A-high flush is rank #1. It naturally reflects the relative strength.
- **No**: `absRank` is purely mathematical. The `usedHoleCards` logic acts as a **Human-like Heuristic Filter**. It tells the AI: "Even if this is rank #10, don't play it like a set of Kings because the whole world knows the flush is there."

## 3. Recommendation
**Keep the distinction but simplify it.** 
The current code is a bit verbose. We can rely more on `flushScore` for the "A-High" logic and use a simple "Vulnerability Penalty" for 1-card flushes.

### Proposed Refactoring:
Instead of a big if/else, we could apply a `-20` penalty to the `flushScore` if `usedHoleCards === 1`.
1. **Base Case**: 2-card Ace-high = 100 score -> `MONSTER`.
2. **Penalty Case**: 1-card Ace-high = 100 - 20 = 80 score -> `STRONG` (Correctly downgrades it from Monster to Strong because it's on a 4-flush board).
