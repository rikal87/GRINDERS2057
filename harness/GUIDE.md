# CyberPoker2077 AI Engine & Harness Technical Standard

This document defines the **Source of Truth** for the poker engine's data structures, communication protocols, and statistical metrics. All AI development and harness testing MUST adhere to these standards to ensure consistency across the UI, simulation, and different AI personas.

---

## 1. AI Action Contract (The Response)

Every AI decision function (`getAIAction`, `getUnifiedAction`) MUST return an object containing at least these 4 essential fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| **`action`** | `string` | The type of move: `'fold'`, `'call'`, `'check'`, `'raise'`, `'all_in'`. |
| **`amount`** | `number` | The total chips the player is putting into the pot this street (Integer). |
| **`insight`** | `string` | Debugging information (e.g., `Cont-P: 85%`, `Equity: 0.7`). |
| **`delay`** | `number` | Milliseconds of "thinking time" to simulate human-like delays. |

### Extended Fields (UI/Advanced)
- `dialogue`: (String) The character's speech bubble text.
- `exploitTrigger`: (String\|null) Detected opponent weakness (e.g., `'Maniac'`).
- `rangeEstimate`: (String) Human-readable range guess for the opponent.

---

## 2. Engine State Contract (The Input)

The `engine` object passed to the AI must reliably provide the following fields:

### Core State
- `state`: (`string`) `'PREFLOP'`, `'FLOP'`, `'TURN'`, `'RIVER'`.
- `board`: (`string[]`) Array of active cards (e.g., `['As', 'Kh', '2d']`).
- `pot`: (`number`) Total pot size.
- `currentRoundBet`: (`number`) The highest bet currently on the table for this street.
- `bb`: (`number`) Big Blind amount (Standard unit for sizing).
- `sb`: (`number`) Small Blind amount.

### Aggression Tracking
- `preflopRaises`: (`number`) Total raises preflop (0 = Unopened, 1 = RFI, 2 = 3-Bet...).
- `currentStreetRaises`: (`number`) Total raises on the current post-flop street.
- `aggressor`: (`string|null`) Player ID of the last person to raise.

### Players & History
- `players`: (`Player[]`) Array of all players at the table.
- `dealerIndex`: (`number`) Index of the dealer button.
- `actionHistory`: (`Action[]`) Chronological record of actions in the current hand.

---

## 3. Player Object Contract

Individual players within the `engine.players` array MUST follow this structure:

- `id`: (`string`) Unique identifier.
- `name`: (`string`) Display name.
- `chips`: (`number`) Current stack size.
- `currentBet`: (`number`) Chips already bet by this player on the *current* street.
- `hand`: (`string[]`) Player's hole cards (if visible to the AI).
- `isFolded`: (`boolean`) Whether the player has folded.
- `class`: (`object`) Contains persona traits like `AF`, `vPIP`, `WTSD`.
- `stats`: (`object`) Lifetime stats for this session (see Metrics below).

---

## 4. Statistical Metrics (The KPIs)

Harness simulations calculate the following KPIs to verify AI character profiles:

- **VPIP (Voluntary Put In Pot)**:
  - `(Hands with voluntary action) / (Total hands played)`
  - *Voluntary action* = Calling a raise, Raising, or Completing the SB (excludes checking the BB).
- **PFR (Pre-Flop Raise)**:
  - `(Hands with a pre-flop raise) / (Total hands played)`
- **AF (Aggression Factor)**:
  - `(Bets + Raises) / (Calls)`
  - Used to measure post-flop aggression.
- **WTSD (Went To Showdown)**:
  - `(Hands reaching showdown) / (Total hands where player saw a flop)`

---

## 5. Positional Standards (6-Max)

The engine and harness use the following positional mapping:

| Name | Index (vs Dealer) | Description |
| :--- | :--- | :--- |
| **BTN** | 0 | Dealer Button (Last to act post-flop) |
| **SB** | +1 | Small Blind |
| **BB** | +2 | Big Blind |
| **UTG** | +3 | Under The Gun (First to act pre-flop) |
| **MP** | +4 | Middle Position |
| **CO** | +5 | Cutoff |

For tables with `< 6` players, positions are shifted toward the blinds (e.g., in 3-Max: BTN, SB, BB).
