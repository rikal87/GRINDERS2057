import { evaluateHand, getDrawCategory, getStartingHandRank, analyzeBoardTexture, getSimpleHandCategory, getStartingHandRankHeadsup, getStartingHandRank96Max } from './poker.js';
// import { LLMService } from './llmService.js';
import { getAIChatDialogue, } from './AIChatSystem.js';
import { CHAT_TRIGGERS } from './persona.js'

/**
 * AI Decision Engine (LLM Integrated)
 * Now delegates Prompt Construction & Schema to LLMService.
 */
export const chatAI = (player, trigger = CHAT_TRIGGERS.FOLD_WEAK, insight = "", duration = 0) => {
  const safeTrigger = trigger || 'FOLD'; // Fallback if undefined
  const msg = getAIChatDialogue(safeTrigger.toUpperCase(), player.name.toUpperCase());
  console.log(`[AI_CHAT] ${player.name} ${safeTrigger.toUpperCase()}: ${msg}`);

  if (player.dialogueTimeoutId) {
    clearTimeout(player.dialogueTimeoutId);
  }

  // Dynamic duration calculation: Base 2500ms + 50ms per character
  // Cap at 7000ms max to prevent it from getting stuck forever.
  let displayDuration = duration > 0 ? duration : (2000 + (msg.length * 100));
  displayDuration = Math.min(Math.max(displayDuration, 2000), 8000);

  player.lastDialogue = msg;
  player.lastThought = insight;

  player.dialogueTimeoutId = setTimeout(() => {
    player.lastDialogue = null;
    player.lastThought = null;
    player.dialogueTimeoutId = null;
  }, displayDuration);

  return msg;
}
export const getAIAction = (player, engine) => {
  let decision = getHeuristicFallback(player, engine);
  // Process Decision
  const action = {
    type: decision.action || 'fold',
    amount: decision.amount || 0,
    delay: decision.delay || 1000,
    insight: decision.insight || "",
    dialogue: decision.dialogue || ""
  };

  // Safety Layer: Ensure 'raise' actually increases the bet
  if (action.type === 'raise') {
    // [SAFETY] Ensure raise is valid and INT
    let currentBet = engine.potManager ? engine.potManager.currentRoundBet : engine.currentRoundBet;
    // [FIX] Handle Float Issues
    action.amount = Math.floor(action.amount);
    // Cap at chips
    if (action.amount > player.chips + player.currentBet) {
      action.amount = player.chips + player.currentBet;
    }
    // [FIX] Demote to CALL if amount <= currentBet (e.g. All-In but not enough to raise, or logic error)
    if (action.amount <= currentBet && currentBet > 0) {
      action.type = 'call';
      action.amount = currentBet;
      // If we intended to raise but were forced to call, update insight
      action.insight += " (Downgraded to Call)";
    }
  }
  // [NEW] Global All-In Check
  // If the determined amount puts us all_in (or more), switch action to 'all_in'
  if (action.type === 'raise' && action.amount >= player.chips + player.currentBet) {
    action.amount = player.chips + player.currentBet;
    action.type = 'all_in';
  }
  if (Math.random() < 0.25) action.dialogue = getAIChatDialogue(action.type, player.name, action.insight);
  if (engine.state === 'PREFLOP') action.delay /= 2; // if preflop, faster decision
  return action;
};

/**
 * Heuristic Fallback (Moved from LLMService.mockDecision)
 */
function getHeuristicFallback(player, engine) {
  const callAmt = engine.currentRoundBet - player.currentBet;
  const pot = engine.pot;
  const AF = player.class?.AF || 1;
  const street = engine.state;
  let handCategory = 'AIR';
  // const activePlayers = engine.players.filter(p => !p.isFolded).length;
  // const isHeadsUp = activePlayers === 2;
  const betRatio = pot > 0 ? (callAmt / pot) : 0;
  const raises = engine.currentStreetRaises || 0;
  let dialogue = "";
  let amount = 0; // [FIX] Initialize amount to avoid ReferenceError
  // 1. Evaluate Strength
  let strengthScore = 0;
  let handRank = 169;

  let drawInfo = { draws: [] };
  const vPIP = player.class.vPIP || 0.5; // Default 50%
  const wtsd = player.class.WTSD || 0.5;
  const isAdvanced = engine.isAdvanced;
  const playerIdx = engine.players.findIndex(p => p.id === player.id);
  const dealerIdx = engine.dealerIndex;
  const playerCount = engine.players.length;
  const startingStack = player.chips + player.totalWagered;
  let raiseThreshold = 100 - (AF * 10);
  let callThreshold = Math.max(0, 50 - (street === 'PREFLOP' ? vPIP : wtsd) * 50);
  let bluffFreq = Math.max(0, (AF - 2)) * 0.1; // Base bluff freq
  // Distance from Button (0 = Button, 1 = CO, ...)
  let multiplier = 1.0;
  const distFromButton = (dealerIdx - playerIdx + playerCount) % playerCount; // not care about low level player

  // add short stack strategy
  if (player.chips < 40 * engine.bigBlind) {
    /*
     scenario A
    you dealted JKo = STR 36 + 20 = 56 (Calculated STR)
    you have (200chips) 20bb big blinds
    you have lower then 40bb big blinds
    56 * 2 = 112 (STR)
    */
    /*
      scenario B
     you dealted 55 = STR 30.5 + 10 = 40.5 (Calculated STR)
     you have (200 chips) 20bb big blinds
     you have lower then 40bb big blinds
     40.5 * 2 = 81 (STR)
     */
    /*
     scenario C
     you dealted J2o = STR 4.75 (Calculated STR)
     you have (100 chips) 10bb big blinds
     you have lower then 40bb big blinds
     4.75 * 4 = 19 (Multiplier is high, but STR is low)
     */
    /*
     scenario D
     you dealted J2o = STR 4.75 (Calculated STR)
     you have (30 chips) 3bb big blinds
     you have lower then 40bb big blinds
     4.75 * 13.33 = 63.3 (Multiplier is veryhigh, so str is quite good)
     */
    multiplier = engine.bigBlind * 40 / player.chips;
  }
  // this boost only your open raise situation (for advanced only)
  if (raises > 0 && isAdvanced) multiplier -= Math.min(1, 1 - (3.5 - AF));

  const alivePlayers = engine.players.filter(p => !p.isFolded).length;
  if (street === 'PREFLOP') {
    // Short stack strategy: Pocket Pair and Big Hand Advantage
    if (isAdvanced && (player.chips <= 30 * engine.bigBlind || alivePlayers <= 2)) handRank = getStartingHandRankHeadsup(player.hand);
    else handRank = getStartingHandRank96Max(player.hand);

    // [vPIP Logic]

    // handRank 1 is best (AA), 169 is worst (72o)
    // Percentile: 1 - (Rank / 169). e.g., Rank 1 => 0.99 (Top 1%), Rank 169 => 0 (Bottom 0%)
    const percentile = 1 - (handRank / 169);

    // If our hand is WORSE than our vPIP threshold, we should fold.
    // vPIP .20 means we play top 20%. So if percentile < .80 (implying rank > ~34), we fold.
    // Wait, vPIP=1 means play 100%. vPIP=0.1 means play top 10%.
    // So we play if percentile >= (1 - vPIP).
    // If there are more players, we should play less.
    // const vPIPThreshold = 1 - vPIP - (alivePlayers / 20);
    const vPIPThreshold = 1 - vPIP;
    // Check for Big Blind: if no raises, we can check regardless of vPIP.
    // console.info('percentile', percentile, 'vPIPThreshold', vPIPThreshold);
    if (percentile < vPIPThreshold && callAmt > 0) {
      // Hand is too weak for our vPIP
      return { action: 'fold', amount: 0, insight: `vPIP Fold (Rank ${handRank})` };
    }
    // Invert rank for score: 1 (AA) -> 100, 169 (72o) -> 0
    strengthScore = Math.round(Math.max(0, (169 - handRank) / 4));
    if (handRank <= 7) strengthScore += 90; // Premium bonus
    else if (handRank <= 13) strengthScore += 60; // Strong bonus
    else if (handRank <= 22) strengthScore += 40; // Good bonus
    else if (handRank <= 33) strengthScore += 20; // Fair bonus
    else if (handRank <= 100) strengthScore += 10; // Weak bonus
    if (isAdvanced) {
      if (distFromButton <= 1) strengthScore += 10; // Button bonus
      else if (distFromButton <= 3) strengthScore += 5; // MP bonus
    }

  } else {
    // Postflop
    const evaluation = evaluateHand([...player.hand, ...engine.board]);
    const drawCategory = getDrawCategory(player.hand, engine.board);
    handCategory = getSimpleHandCategory(player.hand, engine.board, evaluation);
    // Baseline Score from Rank
    // Pair (2) -> ~20-30, Sets (4) -> ~60, FullHouse (7) -> ~90
    // Category Adjustments
    if (handCategory === 'NUTS') strengthScore = 125;
    else if (handCategory === 'MONSTER') strengthScore = 100;
    else if (handCategory === 'STRONG') strengthScore = 75;
    else if (handCategory === 'MARGINAL') strengthScore = 50;
    else if (handCategory === 'WEAK') strengthScore = 25;
    else if (handCategory === 'ACE_HIGH') strengthScore = 10;
    else strengthScore = 0;

    if (drawCategory === 'DRAW_MONSTER') strengthScore += 25 * (5 - engine.board.length);
    if (drawCategory === 'DRAW_STRONG') strengthScore += 18 * (5 - engine.board.length);
    if (drawCategory === 'DRAW_WEAK') strengthScore += 8 * (5 - engine.board.length);

    // Multi-way penalty for marginal hands
    // if (!isHeadsUp && rank <= 4) strengthScore -= 15; // Top Pair or worse is weaker in multiway
    console.info(`[AI_ENGINE] ${player.name} handCategory:`, handCategory, `strengthScore:`, strengthScore);
  }
  strengthScore *= multiplier;
  console.info('strengthScore', strengthScore);
  // 2. Establish Contextual Thresholds
  // Adjust requirements based on Bet Size & Street

  const boardAnalysis = analyzeBoardTexture(engine.board);

  if (alivePlayers > 2) {
    const penalty = (alivePlayers - 2) * 5; // Multi-way penalty
    callThreshold += penalty;
    raiseThreshold += penalty;
  }
  // [PHASE 4] Commitment Logic (User Feedback: Based on Self Investment)
  // Old SPR was: const spr = pot > 0 ? (player.chips / pot) : 20;
  // New: Commitment Ratio = Total Wagered / (Current Chips + Total Wagered)

  const commitmentRatio = startingStack > 0 ? (player.totalWagered / startingStack) : 0;
  const spr = pot > 0 ? (player.chips / pot) : 20;
  let insight = `Score: ${Math.floor(strengthScore)} (Thres: ${Math.floor(callThreshold)}/${Math.floor(raiseThreshold)})`;
  if (isAdvanced) {
    if (spr < 1.5) {
      // [Pot Odds] Pot is huge relative to our stack (even if we didn't put much in).
      // We get great odds.
      callThreshold *= 0.8;
    } else if (spr > 10) {
      // [Deep Stack] Play tighter against AF (Reverse Implied Odds)
      // But we can float/bluff more on earlier streets.
      // But, don't care about low-level player
      callThreshold *= 1.1;
      if (street !== 'RIVER') bluffFreq += 0.05;
    }
  }
  // [AI FIX] 3-Bet Specific Adjustment
  // If facing a raise Preflop, we need a stronger hand to 3-Bet.

  if (isAdvanced) {
    if (street === 'FLOP') {
      bluffFreq *= 1.2; // Attack weakness on Flop
    } else if (street === 'TURN') {
      bluffFreq *= 0.66; // Less bluffing on turn
    } else if (street === 'RIVER') {
      // River bluff only base aggressive
    }
  }
  // [AI FIX] If we are facing an all_in (or bet > our stack), we cannot bluff.
  // We have 0 fold equity if we are the one going all_in for our life.
  if (callAmt >= player.chips) bluffFreq = 0;
  // 3. Decision


  let action = 'fold';
  // [HIGH STAKES AI] Enhanced Position & C-Bet Logic
  // console.info('player>>', player.name, 'bluffFreq', bluffFreq);
  if (isAdvanced) {
    // We want to see if the Human (or any specific opponent) is exploitable.
    // For now, we focus on the Human Player.
    const human = engine.players.find(p => p.isHuman && !p.isFolded);
    let humanStats = { vPIP: 0, foldToFlop: 0 };
    if (human && human.stats) {
      humanStats.vPIP = human.stats.vPIP;
      // Normalize FoldToFlop: If they faced very few bets, don't trust it yet.
      if (human.stats.facedFlopBet >= 3) {
        humanStats.foldToFlop = human.stats.foldToFlop;
      }
    }
    // Strategy Matrix
    // 2. Determine Context
    const isaggressor = engine.aggressor === player.id;
    const isAggressor = isaggressor;
    // [BOARD TEXTURE BLUFF ADJUSTMENT]
    // Dry Board: Hard to hit, so bluffs (stabs) work better. +10% bluff.
    // Wet Board: Easy to hit, opponents call more. -15% bluff (unless we have draw).
    // [PHASE 4] Range Advantage
    // Aggressor favors High Cards (J+). Caller favors Low/Mid.
    const highCardCount = boardAnalysis.ranks ? boardAnalysis.ranks.filter(r => r >= 9).length : 0; // J,Q,K,A
    if (isAggressor) {
      // We are aggressor.
      if (highCardCount >= 1) {
        bluffFreq += 0.1 * highCardCount; // Range Match: Bluff more
        insight += " [Range Adv+]";
      } else {
        bluffFreq -= 0.1; // Range Miss: Check back more
        insight += " [Range Disd-]";
      }
    } else {
      // We are defender.
      if (highCardCount <= 2 && boardAnalysis.type === 'WET') {
        // Low & Connected board hits our calling range better.
        // Donk/Check-Raise opportunity.
        bluffFreq += 0.1 * (3 - highCardCount); // Range Match: Bluff more
        raiseThreshold -= 10;
        insight += " [Range Adv (Def)]";
      }
    }

    // 1. Position Awareness
    if (distFromButton <= 1) {
      // Late Position (Button/CO): Looser requirements
      raiseThreshold -= 10;
      callThreshold -= 5;
      bluffFreq += 0.1;
    } else if (distFromButton >= Math.floor(alivePlayers / 2)) {
      // Early Position: Tighter
      raiseThreshold += 5;
    }

    // 2. C-Bet Logic (Continuation Bet)
    // If we raised Preflop, we should keep AF on Flop.
    if (street === 'FLOP' && isAggressor) {
      // We are the aggressor.
      // C-Bet Frequency is high. We accept wider range.
      // raiseThreshold -= 15; // Bet with almost anything decent or air
      raiseThreshold *= 0.9;
      bluffFreq += 0.2; // High bluff chance (C-Bet air)
    }

    // [PHASE 2] Adaptive Profiling Logic
    // [PHASE 4] Stat Reliability: Only exploit if we have > 20 hands
    if (human && human.stats && human.stats.handsPlayed >= 25) {
      // A. Exploit Tight/Passive (High Fold to Flop)
      // If Human folds > 60% to flop bets, we should bluff more on Flop/Turn.
      if (humanStats.foldToFlop > 0.6) {
        bluffFreq += 0.15; // Bluff more
        // raiseThreshold -= 5; // Bet lighter
        raiseThreshold *= 1.05;
        insight += " [Exp:Tight]";
      }

      // B. Exploit Calling Station (High vPIP, Low Fold)
      // If Human vPIP > 0.6 and FoldToFlop < 0.4
      if (humanStats.vPIP > 0.6 && humanStats.foldToFlop < 0.4) {
        bluffFreq *= humanStats.foldToFlop
        // Value Bet widening? 
        // We can actually bet THINNER value because they call wide.
        raiseThreshold *= 0.8; // Value bet marginal hands (Top Pair weak kicker etc)
        callThreshold *= 0.8;
        // But ensure we don't bluff air. The bluffFreq reduction handles air.
        // The raiseThreshold reduction lets us value bet thinner.
        insight += " [Exp:Station]";
      }
    }
  }
  // [FINAL COMMITMENT CHECK] 
  // User logic: As commitment increases, folding becomes near impossible.
  // Applied here so it scales down properly and overrides raise penalties. 
  if (commitmentRatio > 0.35) {
    callThreshold = Math.floor(callThreshold * (1 - commitmentRatio));
    raiseThreshold = Math.floor(raiseThreshold * (1 - commitmentRatio));
    insight += ` [Committed ${(commitmentRatio * 100).toFixed(0)}%]`;

    // Hard cap for extreme commitment (e.g. stack almost gone)
    if (commitmentRatio > 0.70) {
      callThreshold = Math.min(callThreshold, 15);
    }
  } else {
    callThreshold = Math.min(callThreshold, 50); // cap call threshold
    callThreshold *= Math.random() * 0.2 - 0.1; // If you have a weak hand, not always avoid folding
  }
  if (callAmt > 0) {
    const threshold = (25 + (3 - AF) * 5) * raises;
    raiseThreshold += threshold // passive player more tight, but Agressive player doesn't really care about that
    callThreshold += threshold * 0.5;
  }
  if (callAmt === 0) {
    // Automatic Check if free
    if (strengthScore > raiseThreshold) {
      // Value bet / Protection bet
      action = 'raise';
      insight = "Value/Protection Bet";
    } else if (Math.random() < bluffFreq) {
      action = 'raise';
      insight = "Pure Bluff bet.";
    } else {
      action = 'check';
      insight = "Check";
    }
  } else {
    // We face a bet
    if (strengthScore >= raiseThreshold) {
      // Monster / Strong Value
      if (betRatio > 1.0 && street !== 'RIVER') {
        action = 'call'; // Flat call huge overbets with strong hands to keep them in?
        insight = "Trapping huge bet.";
      } else {
        action = 'raise';
        insight = "Value Raise.";
      }
    } else if (strengthScore >= callThreshold) {
      // Retain / Call
      action = 'call';
      insight = "Calling for value/odds.";
    } else {
      // Weak
      // [PHASE 3] River Overbet Bluff logic
      const rnd = Math.random()
      if (isAdvanced && rnd < bluffFreq / 2) {
        action = 'raise';
        insight = "River All-in Bluff";
        amount = player.chips + 10000; // Force All-In logic later
      } else if (rnd < bluffFreq) {
        action = 'raise';
        insight = "Pure Bluff Raise.";
      } else {
        action = 'fold';
      }
    }
  }

  // 4. Sizing (Standard NLH Logic)
  // amount was initialized to 0
  if (action === 'raise') {
    // A. Preflop Sizing
    if (street === 'PREFLOP') {
      let openSize = 2.5; // Default 2.5x
      let mult = player.chips < 20 * engine.bigBlind || spr < 1.8 ? 99999 : 1 // if short stack, go all in
      if (raises > 0) mult = Math.max(2.2, 5.5 - raises);
      // [OPEN RAISE]
      // Standard Open: 2.2BB - 3.5BB
      let bbAmt = engine.bb;
      if (isAdvanced && distFromButton > 3) openSize += 0.5;
      amount = Math.floor(bbAmt * openSize * mult);
    }
    // B. Postflop Sizing
    else {
      if (callAmt > 0) {
        // [RAISE / CHECK-RAISE]
        // We are facing a bet. Standard raise is 3x the bet (or pot sized).
        // A "Pot-Sized Raise" is (Pot + 2*Bet).
        // Let's stick to a multiplier of the bet we are facing. 
        // engine.currentRoundBet is the bet we face.
        let mult = 3.0;
        // Adjust for board texture / strength?
        if (strengthScore > raiseThreshold + 20) mult = 4.0 + Math.max(0, (AF - 3)); // Punishment
        amount = Math.max(amount, Math.floor(engine.currentRoundBet * mult));
      } else {
        // [BET / SEMI-BLUFF] (First to act or checked to)
        // Bet based on Pot Size %
        // 33% (Small/Dry), 66% (Standard), 75-100% (Polarized/Wet)
        const pot = engine.pot;
        let potPct = 0.5; // Default 1/2 pot
        if (isAdvanced) {
          // [BOARD TEXTURE ANALYSIS]
          // Adjust sizing based on board wetness
          if (boardAnalysis.type === 'DRY') {
            potPct -= 0.2; // Trapping / Inducing or bluff stab?
          } else if (boardAnalysis.type === 'WET') {
            potPct += 0.35; // Heavy value or bluff
          } else if (strengthScore < callThreshold) {
            if (drawInfo && drawInfo.draws.length > 0) potPct += 0.25;
          }
        }
        // [High Stakes Adjustment] Overbets
        if (isAdvanced && street === 'RIVER' && (strengthScore > raiseThreshold + 50 || strengthScore < callThreshold - 20)) {
          // Polarized Range: Nuts or Air -> Overbet (Pot)
          potPct = 1.0 + (AF / 2);
        }
        amount = Math.max(amount, Math.floor(pot * potPct));
      }
    }
  }
  if (handCategory === 'BOARD_CHOP') {
    action = 'call';
    insight = "Board Chop";
  }
  // [PHASE 3] Timing Tells (Delay)
  let delay = 1000 + Math.random() * 2000; // Default 1-3s
  const difficulty = Math.abs(strengthScore - callThreshold); // How close was it?
  if (strengthScore > raiseThreshold + 40) {
    // Super Strong:
    // Snap Call/Raise (0.5s) OR Hollywood Tank (2-3.5s)
    if (Math.random() < 0.3) delay = 500; // Snap
    else delay = 2000 + Math.random() * 1500; // Trapping tank
  } else if (difficulty < 10) {
    // Borderline decision: Tank
    delay = 2000 + Math.random() * 3000; // 2-5s
  } else if (action === 'fold') {
    // Easy fold? Fast.
    if (strengthScore < callThreshold - 20) delay = 1000;
  }
  // Bluffing Timing:
  if (action === 'raise' && strengthScore < callThreshold) {
    // Bluffing.
    // Sometimes Snap Raise (Confidence), sometimes Tank (Calculation)
    if (Math.random() < 0.5) delay = 2000 + Math.random() * 2000;
    else delay = 1000; // "Obvious raise."
  }
  return {
    action,
    amount: action === 'raise' ? amount : (action === 'call' ? engine.currentRoundBet : 0),
    insight: insight + ` (d:${Math.floor(delay)}ms)`,
    dialogue,
    delay // Pass delay to engine
  };
}
