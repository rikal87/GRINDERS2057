# AI Performance Review: Brain (Shark) vs. Heuristic (Max)

## 1. Profit Summary
- **Max (Heuristic)**: +11,276
- **Shark (Brain)**: -9,309
- **Observation**: Despite having "more information", the Brain is being outperformed by a simpler logic. This is due to several critical "Over-Aggression" leaks in the Brain's strategy.

## 2. Key Differentiation (The "Value Gap")

### A. Value-Raise Thresholds
- **Max (Heuristic)**: Needs **45%** margin over pot odds to raise facing a bet (`requiredEquity + 0.45`).
- **Shark (Brain)**: Needs **40%** margin (`valMargin = 0.40`).
- **Impact**: Shark is raising "thinner" than Max. In a splashy/raisy environment, raising too thin leads to getting reraised and being forced to fold or call at a disadvantage.

### B. The "Committal Shove" Leak (Hand #534)
- **Shark (Brain)**: Has a rule to SHOVE if SPR < 0.2 and hand is `STRONG` (Top Pair). 
  - *Failure*: In Hand #534, Shark shoved AJ (Top Pair) into a board where a Straight was likely.
- **Max (Heuristic)**: Does not have such an aggressive committal rule for non-premiums. It stays within its value thresholds.
- **Conclusion**: Shark's "Aggressive SPR awareness" is being exploited by hands that have us crushed.

### C. Deception (Trap) Logic
- **Max (Heuristic)**: If equity > 85% on the flop, it **Traps** (adds 1.1 to threshold to ensure it just calls).
- **Shark (Brain)**: Always bets for value when equity is high.
- **Impact**: Max builds bigger pots later when it has the nuts, while Shark scares people away early or allows them to get away cheaply.

### D. Multi-Street Reraise Block
- **Max (Heuristic)**: Has very complex `pfIntensity` and `raises` adjustments that scale exponentially (Line 372+).
- **Shark (Brain)**: Relies on `rangeInteractionScore`. While smart, it doesn't yet match the "raw fear" of Max's exponential penalties in multi-raise pots.

## 3. Recommended Fixes for Shark (Brain)

1. **Stricter Committal Shove**: Limit SPR Shoves to `MONSTER`+ only. `STRONG` (Top Pair) should never shove.
2. **Raise Margin parity**: Increase Shark's `valMargin` to **0.45** to match Max.
3. **Trap Logic Implementation**: Add a "Trap" check for `NUTS` on the Flop.
4. **Sizing Alignment**: Ensure `calculateRaiseSize` isn't over-betting non-premium hands.

---
*Reference: aiEngine.js vs aiBrainPostflop.js logic comparison (0320)*
