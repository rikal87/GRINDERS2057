# AI Brain Strategy Review 0320.v3

## Summary of simulation results
- **Shark Profit**: -9,309 (Worst performance)
- **Bankrupt Count**: 6 (Highest)
- **W$SD**: 41.1% (Target is 55%+, but currently bleeding in big pots)
- **Problem**: Shark is "Busting" (Bankrupt) too often due to infinite preflop bluffing and postflop "Two Pair" attachment syndrome.

## Case Studies

### 1. Preflop Bluff Escalation (Hand #990)
- **Scenario**: Shark_0 (A3s) faces 4-bet, 5-bet, 6-bet from KK.
- **Fail**: Shark_0 kept 4rd-5th-6th-betting a "Polarized Bluff" until all-in.
- **Diagnosis**: The `Polarized 3-Bet/4-Bet` logic lacks a **Max Aggression Cap**. Once an opponent 4-bets or 5-bets, a hand like A3s should almost always fold or occasionally call if odds are extreme, but NEVER reraise again.

### 2. Broadway Straight Blindness (Hand #438)
- **Board**: `T-A-K-5-9`
- **Hand**: Shark_0 (A9) - Two Pair.
- **Opponent**: `rich_guy_1` (QJ) - Straight.
- **Fail**: Shark kept reraising the river (`Raises to 2615`).
- **Diagnosis**: 82% equity for Two Pair on an `A-K-T` board is mathematically incorrect against a raise. The "Broadway Danger" penalty in `aiBrainPostflop.js` is clearly failing to account for straights when Hero has Two Pair.

### 3. Paired Board "Set-Blindness" (Hand #993)
- **Board**: `7-A-K-J-J`
- **Hand**: Shark_1 (AK) - Top Two Pair.
- **Opponent**: `Max_0` (JK) - Full House.
- **Fail**: Shark re-raised the river (`Raises to 655`).
- **Diagnosis**: Despite recent `isPaired` penalties, Shark still treats AK on a paired board as `MONSTER` / `82%` equity. Two-pair on a paired board is essentially "Bluff Catcher" status against river raises.

## Proposed Strategy Refinements

### A. Preflop Bluff Cap
- Implement a strict rule: **Bluffs (Rank > 15-20) can only raise ONCE preflop.**
- If a bluff faces a reraise, it must FOLD. (NO 5-bet or 6-bet bluffs).

### B. Postflop "Relative Strength" Downgrade
- **Specific Rule**: If board is Paired OR has 3-to-a-straight (T-J-Q style), Two Pair cannot be `MONSTER`. 
- Downgrade `STRONG` to `GOOD` or `MARGINAL` if facing a raise on dangerous boards.

### C. Showdown Value Realization
- If Hero has Two Pair and faces a River Raise on a board with Straights/Flushes/Trips possible, `canValueBet` must be `false`.
