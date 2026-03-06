import { evaluateHand, getDrawCategory, getStartingHandRank, analyzeBoardTexture, getSimpleHandCategory, getStartingHandRankHeadsup, getStartingHandRank96Max } from './poker.js';
// import { LLMService } from './llmService.js';
import { getAIChatDialogue, } from './AIChatSystem.js';
import { CHAT_TRIGGERS } from './constants.js'

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
  const raises = engine.currentStreetRaises || 0;
  let dialogue = "";
  let amount = 0;
  let insight = "";

  const vPIP = player.class.vPIP || 0.5;
  const wtsd = player.class.WTSD || 0.5;
  const isAdvanced = player.isAdvanced;
  const playerIdx = engine.players.findIndex(p => p.id === player.id);
  const dealerIdx = engine.dealerIndex;
  const playerCount = engine.players.length;
  const startingStack = player.chips + player.totalWagered;

  // Base Bluff Frequency based on Aggression Factor
  let bluffFreq = (AF - 2.5) * 0.1 + 0.05;
  let multiplier = 1.0;
  const distFromButton = (dealerIdx - playerIdx + playerCount) % playerCount;

  // Short stack Strategy (Multiplies effective equity logic)
  if (player.chips < 40 * engine.bigBlind) {
    multiplier = engine.bigBlind * 40 / player.chips;
  }
  if (raises > 0 && isAdvanced) multiplier -= Math.min(1, 1 - (3.5 - AF));

  const alivePlayers = engine.players.filter(p => !p.isFolded).length;

  // --- 1. Evaluate Estimated Equity ---
  let estimatedEquity = 0;
  let handRank = 169;
  let drawInfo = { draws: [] };

  if (street === 'PREFLOP') {
    if (isAdvanced && (player.chips <= 30 * engine.bigBlind || alivePlayers <= 2)) {
      handRank = getStartingHandRankHeadsup(player.hand);
    } else {
      handRank = getStartingHandRank96Max(player.hand);
    }

    const percentile = 1 - (handRank / 169);
    estimatedEquity = percentile; // Simplified: Top 10% hand = 90% equity

    // vPIP Fold Check (Before any pot odds, unless we are in Big Blind and it's free)
    let vPIPThreshold = 1 - vPIP;
    if (callAmt > 0) {
      // if (raises > 0) {
      //   // Play tighter against raises (require higher percentile)
      //   vPIPThreshold = vPIPThreshold + (1 - vPIPThreshold) * Math.min(0.8, raises * 0.4);
      // }
      if (percentile < vPIPThreshold) {
        // Very weak hand compared to VPIP
        return { action: 'fold', amount: 0, insight: `vPIP Fold (Eq: ${(estimatedEquity * 100).toFixed(0)}%)` };
      }
    }
    if (handRank <= 2) estimatedEquity = 0.9; // AA, KK Super Premium Hand
    else if (handRank <= 4) estimatedEquity = 0.8; // QQ, AKs Premium Hand
    else if (handRank <= 7) estimatedEquity = 0.7; // Semi premium hand
    else if (handRank <= 11) estimatedEquity = 0.6; // Strong hand
    else if (handRank <= 13) estimatedEquity = 0.55; // Good hand
    else if (handRank <= 33) estimatedEquity = 0.5; // Fair hand
    else if (handRank <= 100) estimatedEquity = 0.4; // Weak hand
    else estimatedEquity = 0.35; // Trash hand

    if (isAdvanced) {
      if (distFromButton <= 1) estimatedEquity += 0.05; // Position bonus
      else if (distFromButton >= alivePlayers - 2) estimatedEquity -= 0.05; // EP penalty
    }

  } else {
    // Postflop
    const evaluation = evaluateHand([...player.hand, ...engine.board]);
    const drawCategory = getDrawCategory(player.hand, engine.board);
    handCategory = getSimpleHandCategory(player.hand, engine.board, evaluation);

    if (handCategory === 'NUTS') estimatedEquity = 0.95;
    else if (handCategory === 'MONSTER') estimatedEquity = 0.85;
    else if (handCategory === 'STRONG') estimatedEquity = 0.70;
    else if (handCategory === 'GOOD') estimatedEquity = 0.55;
    else if (handCategory === 'MARGINAL') estimatedEquity = 0.40;
    else if (handCategory === 'WEAK') estimatedEquity = 0.20;
    else if (handCategory === 'ACE_HIGH') estimatedEquity = 0.10;
    else estimatedEquity = 0.05; // AIR

    // Add Draw Equity
    let drawBonus = 0;
    if (drawCategory === 'DRAW_MONSTER') drawBonus = 0.25;
    else if (drawCategory === 'DRAW_STRONG') drawBonus = 0.15;
    else if (drawCategory === 'DRAW_WEAK') drawBonus = 0.05;

    // Less turns left = less draw value
    const streetsLeft = street === 'FLOP' ? 2 : (street === 'TURN' ? 1 : 0);
    drawBonus *= (streetsLeft / 2);

    estimatedEquity = Math.min(0.98, estimatedEquity + drawBonus);
    console.info(`[AI_ENGINE] ${player.name} Category: ${handCategory}, Base Eq: ${estimatedEquity}`);
  }

  // Adjust equity based on short stack aggressiveness
  estimatedEquity = Math.min(0.99, estimatedEquity * (multiplier > 1 ? (1 + (multiplier - 1) * 0.2) : 1));

  // --- 2. Pot Odds & MDF (Minimum Defense Frequency) ---
  const totalPotAfterCall = pot + callAmt;
  let potOdds = callAmt > 0 ? (callAmt / totalPotAfterCall) : 0;

  // Required Equity to Call (Base)
  let requiredEquity = potOdds;

  // Multi-way penalty: If many players, our hand needs to be stronger to win.
  if (alivePlayers > 2) {
    requiredEquity += (alivePlayers - 2) * 0.05;
  }

  // Commitment Ratio = Total Wagered / (Current Chips + Total Wagered)
  const commitmentRatio = startingStack > 0 ? (player.totalWagered / startingStack) : 0;
  const spr = pot > 0 ? (player.chips / pot) : 20;

  // Adjust required equity based on SPR & Depth
  if (isAdvanced) {
    if (spr < 1.5) {
      requiredEquity *= 0.8; // Great odds, committed
    } else if (spr > 10) {
      requiredEquity *= 1.1; // Deep stack, reverse implied odds
      if (street !== 'RIVER') bluffFreq += 0.05;
    }
  }

  // --- 3. Opponent Profiling (Adjust requiredEquity & Bluff Freq) ---
  const boardAnalysis = analyzeBoardTexture(engine.board);
  const isAggressor = engine.aggressor === player.id;

  if (isAdvanced) {
    const human = engine.players.find(p => p.isHuman && !p.isFolded);
    let humanStats = { vPIP: 0, foldToFlop: 0 };
    if (human && human.stats && human.stats.handsPlayed >= 25) {
      if (human.stats.facedFlopBet >= 3) {
        humanStats.foldToFlop = human.stats.foldToFlop;
      }
      humanStats.vPIP = human.stats.vPIP;
      // Exploit Tight: They fold a lot, bluff more. If they bet, they have it (require more equity to call).
      // if (humanStats.foldToFlop > 0.6) {
      bluffFreq += (humanStats.foldToFlop - 0.45);
      if (callAmt > 0) requiredEquity += 0.05; // Respect their bets more
      insight += " [Exp:Tight]";
      // }
      // Exploit Station: They don't fold. Don't bluff, value bet thinner.
      if (humanStats.vPIP > 0.6 && humanStats.foldToFlop < 0.4) {
        bluffFreq *= humanStats.foldToFlop;
        requiredEquity -= 0.05; // We can call lighter because they bluff/bet wide
        insight += " [Exp:Station]";
      }
    }
    // Board Texture / Range Advantage
    const highCardCount = boardAnalysis.ranks ? boardAnalysis.ranks.filter(r => r >= 9).length : 0;
    const lowCardCount = boardAnalysis.ranks ? boardAnalysis.ranks.filter(r => r < 9).length : 0;
    if (isAggressor) {
      if (street === 'FLOP') {
        const bluffMod = (highCardCount * 2) - lowCardCount * .05;
        bluffFreq += bluffMod;
      }
    } else {
      raiseEquityThreshold *= 1.25;
      if (street === 'FLOP' || boardAnalysis.type === 'WET') {
        bluffFreq += 0.05 * lowCardCount;
      }
    }
    // Street adjustments
    if (street === 'TURN') bluffFreq *= 0.66;
  }

  // [NEW] 2.5 Virtually Committed Check (Hard Cap to Prevent Absurd Folds)
  const isVirtuallyCommitted = callAmt > 0 && (
    (player.chips <= (engine.bb * 2)) || // Has 2bb or less currently
    (player.chips / (pot + player.chips) < 0.1) // Remaining stack is < 10% of the pot
  );

  if (isVirtuallyCommitted) {
    // Override math: 100% committed, never fold
    requiredEquity = 0;
    insight += " [V-Committed]";
  } else {
    // Normal soft commitment scaling
    if (commitmentRatio > 0.35) {
      requiredEquity *= Math.max(0, 1 - (commitmentRatio * 0.5));
      insight += ` [Commt ${(commitmentRatio * 100).toFixed(0)}%]`;
    }
  }

  // raiseEquityThreshold (Need a clear edge over just calling to value raise)
  let raiseEquityThreshold = requiredEquity + 0.20;
  if (isAdvanced && isAggressor && street === 'FLOP') {
    raiseEquityThreshold -= 0.1; // C-Bet lighter
  }

  // --- 3.5 NPC Playstyle Adjustments ---
  // lower AF > 3 = Overestimating your own hand, lower AF < 3 = Underestimating your own hand
  raiseEquityThreshold += (3 - AF) * 0.1; // lower AF > 3 = raise more, lower AF < 3 = raise less
  requiredEquity += ((0.3 - (street === 'PREFLOP' ? vPIP : wtsd)) / 2);
  if (player.class === 'GAMBLER') { // gambler is draw equity lover
    const addBonus = drawBonus > 0.0 ? .1 : 0; // bonus for draw equity
    estimatedEquity = Math.min(0.98, estimatedEquity + addBonus);
  }
  // Penalty for facing multiple raises
  if (callAmt > 0) {
    requiredEquity += raises * 0.08;
    raiseEquityThreshold += raises * 0.15;
  }

  if (callAmt >= player.chips) bluffFreq = 0; // Can't bluff an all-in

  insight += ` [Eq:${(estimatedEquity * 100).toFixed(0)}% / Req:${(requiredEquity * 100).toFixed(0)}%]`;
  console.info(`[AI_ENGINE] ${player.name} ${insight} raiseEquityThreshold: ${(raiseEquityThreshold * 100).toFixed(0)}%, estimatedEquity: ${(estimatedEquity * 100).toFixed(0)}%, requiredEquity: ${(requiredEquity * 100).toFixed(0)}%`);
  // --- 4. Decision Making ---
  let action = 'fold';
  if (callAmt === 0) {
    if (estimatedEquity >= raiseEquityThreshold) {
      action = 'raise'; insight += " (Value)";
    } else if (Math.random() < bluffFreq) {
      action = 'raise'; insight += " (Bluff)";
    } else {
      action = 'check'; insight += " (Check)";
    }
  } else {
    // We face a bet
    if (estimatedEquity >= raiseEquityThreshold) {
      if (potOdds > 0.4 && street !== 'RIVER' && estimatedEquity < 0.85) {
        // Just call big bets if our hand isn't an absolute monster
        action = 'call'; insight += " (Call Huge)";
      } else {
        action = 'raise'; insight += " (Value Raise)";
      }
    } else if (estimatedEquity >= requiredEquity) {
      action = 'call'; insight += " (Call Odds)";
    } else {
      // Fold
      const rnd = Math.random();
      if (isAdvanced && rnd < bluffFreq / 2 && street === 'RIVER') {
        action = 'raise'; amount = player.chips + 10000; insight += " (River Shove Bluff)";
      } else if (rnd < bluffFreq) {
        action = 'raise'; insight += " (Pure Bluff)";
      } else {
        action = 'fold'; insight += " (Fold)";
      }
    }
  }

  if (handCategory === 'BOARD_CHOP') {
    action = 'call'; insight = "Board Chop";
  }

  // --- 5. Sizing ---
  if (action === 'raise') {
    let currentBet = engine.currentRoundBet || 0;

    if (street === 'PREFLOP') {
      // [1] 프리플랍: 아직 앞사람의 "레이즈"가 없는 경우 기본 오픈 레이즈 사이즈
      let openSizeBase = player.isAdvanced ? engine.bb * 2.2 : engine.bb * 2.5;
      if (isAdvanced && distFromButton > 3) openSizeBase += 0.5;

      let mult = player.chips < 20 * engine.bigBlind || spr < 1.8 ? 99999 : 1;

      // 누군가 레이즈를 했다면 (오픈레이즈가 아닌 3-bet+ 상황)
      if (raises > 0) {
        mult = Math.max(2.2, 5 - raises);
        amount = Math.floor(currentBet * mult); // 앞선 베팅액 * 배수
      } else {
        // 본인이 최초의 레이즈 (오픈, 림퍼 상대로 한 스퀴즈 추가)
        // 팟에 있는 1.5bb(SB+BB)를 제외한 나머지 순수 림퍼들의 참여 금액만 기본 오픈 사이즈에 더함
        let blindMoney = (engine.bb || engine.bigBlind) * 1.5;
        let limperMoney = Math.max(0, pot - blindMoney);
        amount = Math.floor((openSizeBase + limperMoney) * mult);
      }
    } else {
      // [2] 포스트 플랍
      if (callAmt > 0) {
        // 2-1. 상대가 벳을 친 상태 -> 보통 상대 벳의 3~4배를 레이즈
        let mult = Math.max(2.2, 4.5 - raises);
        // if (estimatedEquity > raiseEquityThreshold + 0.20) mult += .5;

        amount = Math.floor(currentBet * mult);
        // [보정] 무조건 상대방 베팅의 2배 이상은 레이즈하게 하한선 보장
        amount = Math.max(amount, currentBet * 2);
      } else {
        // 2-2. 아무도 베팅 안함 -> 팟 사이즈 비율로 "첫 배팅"
        let potPct = 0.5;
        if (boardAnalysis.type === 'DRY') potPct -= 0.15;
        else if (boardAnalysis.type === 'WET') potPct += 0.25;
        else if (estimatedEquity < requiredEquity && drawInfo.draws.length > 0) potPct += 0.20; // 쎼미블러프
        if (street === 'RIVER' && (estimatedEquity >= 0.70)) {
          if (estimatedEquity >= 0.70) {
            potPct = AF * 0.1 + 0.7 + (estimatedEquity - 0.7); // 강한 핸드의 양극화 오버벳
          } else {
            potPct = AF * 0.1 + 0.7 + (requiredEquity - 0.7); // 블러프 양극화 오버벳
          }
        }
        amount = Math.floor(pot * potPct);
        // [보정] 아무리 작아도 1 빅블라인드 이상은 치도록 보장
        amount = Math.max(amount, engine.bb || 2);
      }
    }
  }

  // --- 6. Timing Tells ---
  let delay = 1000 + Math.random() * 2000;
  const equityDiff = Math.abs(estimatedEquity - requiredEquity);

  if (estimatedEquity >= raiseEquityThreshold + 0.15) {
    if (Math.random() < 0.3) delay = 500; else delay = 2000 + Math.random() * 1500;
  } else if (equityDiff < 0.10) {
    delay = 2000 + Math.random() * 3000;
  } else if (action === 'fold' && estimatedEquity < requiredEquity - 0.20) {
    delay = 500 + Math.random() * 300;
  }

  if (action === 'raise' && estimatedEquity < requiredEquity) {
    if (Math.random() < 0.5) delay = 2000 + Math.random() * 2000;
    else delay = 1300;
  }

  return {
    action,
    amount: action === 'raise' ? amount : (action === 'call' ? engine.currentRoundBet : 0),
    insight: insight + ` (d:${Math.floor(delay)}ms)`,
    dialogue,
    delay
  };
}
