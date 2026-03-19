# Shark Performance Deep-Dive (Phase 2)

## Current Status
After the latest optimizations (Budget Loosening & SPR Commitment), the Shark persona has finally achieved **positive profitability (+3268)** in the latest simulation against [Max](file:///d:/github-repository/CyberPoker2077/src/logic/aiEngineAdvanced.js#170-180) and `rich_guy`.

### Key Metrics Comparison
| Metric | Previous (v1.0) | Current (v2.1) | Target |
| :--- | :--- | :--- | :--- |
| **VPIP** | 15.2% | 22.6% | ~25% |
| **3-Bet** | 3.1% | 3.3% | 7-10% |
| **W$SD** | 64.0% | 47.1% | 45-50% |
| **Profit** | -5552 | +3268 | Positive |

---

## Remaining Structural Problems


### 1. The "3% 3-Bet Ceiling" (Critical)
Despite increasing the `bluffFreq` to 0.55 for LAG/Shark players, the actual 3-bet frequency is stuck at **3.3%**.
- **Hypothesis**: The AI is strictly dependent on the [GTORanges.js](file:///d:/github-repository/CyberPoker2077/src/logic/GTORanges.js) matrix. If a hand is not explicitly in the `VALUE_3BET` or `BLUFF_3BET` sets for a specific position, the AI never 3-bets it.
- **Problem**: GTO matrices in [GTORanges.js](file:///d:/github-repository/CyberPoker2077/src/logic/GTORanges.js) are inherently conservative. A "Shark" should have an **Aggression Overlay** that 3-bets non-GTO hands based on player tendencies or pure high-card strength (e.g., AJo, KQs) regardless of the matrix if in Late Position.

### 2. Low 4-Bet Frequency (0.6%)
- **Stat**: Only 89 4-bets out of 14,547 hands (0.6%).
- **Analysis**: Even premium hands like KK+ are sometimes just calling 3-bets due to the "Action Penalty" or restrictive preflop value thresholds.
- **Impact**: Shark fails to build massive pots preflop when it has the nuts, losing potential value.

### 3. "Rich Guy" Effect
- **Observation**: The sudden jump in Shark profit is largely due to `rich_guy` (TAP) being extremely passive (3B: 0.2%).
- **Warning**: While the Shark is winning, it's doing so by being a "small bully" rather than a "dominant shark." Against more aggressive opponents (like the original `the_don`), the low 3-bet frequency will still lead to chip bleeding.

### 4. 현재 Shark는 TAP인 RICH_GUY의 퍼포먼스보다 딱히 우위를 보여주지 못하고있음(simulation_result.json 참조)
### 5. 버스트 횟수도 5회로 심각함
### 6. 샤크의 포스트 플랍 폴드 퍼포먼스 문제

샤크 폴드 스탯
      "PF": 72.9,
      "F": 23.9,
      "T": 20.1,
      "R": 20.7

리치가이 폴드 스탯
      "PF": 78.5,
      "F": 35.2,
      "T": 13.5,
      "R": 14.3
프리플랍은 대체로 스탠다드하나 턴 리버에 쉽게 폴드를 못하는 문제가 있어보임.
대체로 리버에서 뒤늦게 폴드를 하는 경향이있는데,
끈질긴건 무조건 나쁘다 할수없으나, 만약 이것이 성립하려면 날카로운 블러프로 상대를 폴드시킬 전략이 필요해보임.

### 7. [Expert Analysis] "Flop Stickiness" vs "Turn/River Bleeding"
Shark's current fold stats (F: 24.7%, T: 19.8%, R: 19.6%) indicate a pattern of "Flop Stickiness":
- **Problem**: It folds **much less than Rich Guy (35%)** on the flop, meaning it peels too many flops with marginal equity.
- **Bleeding**: Since it then folds ~20% on the Turn/River, it is essentially "donating" flop call money only to fold once the bets get larger.
- **The Fix**: Shark needs to tighten its flop defense (fold more weak hands early) but also **Bluff-Raise more on the flop** to take down pots immediately.

### 8. [Big Pot Analysis] "Value-Owning" & "1% Fold Bug"
A deep review of `big_pots_hh.txt` reveals fatal errors in high-stakes situations:
- **Value-Owning (Hand #845, #456)**: Shark raises later streets with **One Pair (TPKK)** against villains who have 3-bet the flop/turn. This is a massive leak. It fails to recognize when "Top Pair" has become a bluff-catcher rather than a value-hand.
- **The 1% Fold Bug (Hand #165)**: Shark folded Top Pair on the river to a microscopic bet (52 into 3600) because it was "Over Budget." It should **never** fold to tiny bets (under 10% of pot) if it has a decent hand.
- **Board Blindness**: Failing to realize its Full House is the "Underfull" on boards like 666KK.
- **River Meaninglessness (Hand #314)**: Shark calls off 80% of stack on the turn, leaving no room for play on the river. It should have either shoved or folded based on SPR.

### 9. [Opponent Analysis] Villain Profiling (Current State)
Shark handles basic opponent tracking via `aiBrainVillainTool.js`:
- **Hand-Level**: Detects `PFR_PASSED` (Villain checked flop after preflop raise) or `REPEATED_CHECK`. Adjusted C-bet/Probe bet chances accordingly.
- **Session-Level**: Tracks `VPIP`, `AF` (Aggression Factor), and `F2F` (Fold to Flop).
- **Gap**: Lacks "Showdown-to-Action" correlation (did they bluff last time?) and "Bet Size Telling."

---

## Phase 3 Action Plan (Updated)

### A. Preflop: "Aggression Overlay" v3.0
Break the 3% ceiling by disconnecting from strict Matrix dependence.
1. **Heuristic Upgrade**: Force 3-bet for Top 10% hands (99+, AJs+, AQo+) even if GTO Matrix says CALL.
2. **Positional Escalation**: Increase 3-bet frequency for Suited Connectors to 70% in BTN/CO.
3. **Preflop SPR Awareness**: Disable "Action Penalty" if SPR suggests preflop commitment.

### B. Postflop: "Value-Protection" & "Anti-Bleeding"
1. **Aggression Mitigation**: If facing a 3-bet/Extreme aggression, DISABLE raising with hands weaker than Two-Pair. (Fixes Value-Owning).
2. **The "Minimum Call" Rule**: If pot odds are < 10%, never fold `MARGINAL` or better hands regardless of budget.
3. **Barrel Persistence**: Follow up bluffs on scary turn cards to generate fold equity.

### C. Bankroll (Stack) Protection & Commitment
1. **All-In Thresholding**: If a call/raise would leave less than 20% of the current pot in the player's stack (Hand #314 fix), the AI should automatically convert the action to **All-In**.
2. **Stop-Loss Logic**: In massive pots (>1.5x stack), prioritize defensive checks or folds against extreme range-on-range aggression if hand is not MONSTER+.
