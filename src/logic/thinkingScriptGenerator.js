import { getLanguage } from './store.js';

/**
 * Generates an internal monologue (thought) for the AI when they are facing a tough decision.
 * Called specifically on the RIVER when facing a bet/raise.
 * @param {Object} player - The AI player object
 * @param {Object} engine - The game engine instance
 * @param {Object} action - The decided action (not executed yet, just used to gauge how hard they thought)
 */
export const generateToughCallThought = (player, engine, action) => {
  const lang = getLanguage() || 'ko';
  
  const callAmt = engine.currentRoundBet - player.currentBet;
  const potRatio = callAmt / (engine.pot > 0 ? engine.pot : 1);
  const isAllIn = callAmt >= player.chips;
  const personaId = (player.personaId || player.name).toUpperCase();
  
  if (potRatio < 0.4 && !isAllIn) return null;
  if (Math.random() < 0.2) return null; // 20% chance to skip

  // --- 1. Analyze Opponent History ---
  // Find who made the big bet/raise on the RIVER
  let aggressorId = null;
  for (let i = engine.historyManager.actionHistory.length - 1; i >= 0; i--) {
    const act = engine.historyManager.actionHistory[i];
    if (act.street === 'RIVER' && (act.action === 'raise' || act.action === 'all_in' || act.action === 'bet')) {
      aggressorId = act.playerId;
      break;
    }
  }

  let opponentHistory = { passive: false, aggressive: false };
  if (aggressorId) {
    const oppActions = engine.historyManager.actionHistory.filter(a => a.playerId === aggressorId);
    let aggressiveCount = 0;
    let callCount = 0;
    oppActions.forEach(a => {
      if (a.street === 'FLOP' || a.street === 'TURN') {
        if (a.action === 'raise' || a.action === 'bet') aggressiveCount++;
        if (a.action === 'call') callCount++;
      }
    });

    if (callCount >= 2 && aggressiveCount === 0) opponentHistory.passive = true;
    if (aggressiveCount >= 2) opponentHistory.aggressive = true;
  }

  // Group personas
  const ANALYTICAL_PERSONAS = ['SHARK', 'QUANT_PRO', 'THE_DON', 'IVY_00', 'VANGUARD'];
  const AGGRESSIVE_PERSONAS = ['MANIAC', 'GAMBLER', 'GANGSTER', 'RICH_GUY'];
  const FISH_PERSONAS = ['FISH', 'BROKE', 'MR_CALL'];

  // --- 2. Build Progressive Dialogue Arrays ---
  let sequence = { ko: [], en: [] };

  if (FISH_PERSONAS.includes(personaId)) {
    // Fish Logic
    if (isAllIn) {
      sequence.ko = ["하아... 너무 쎈데.", "근데 이미 돈을 너무 많이 넣었어.", "에라 모르겠다. 기도 메타 간다, 콜!"];
      sequence.en = ["Wow... that's a huge bet.", "But I'm already pot committed.", "Whatever, I'm calling and praying!"];
    } else {
      sequence.ko = ["내 패가 꽤 괜찮은 것 같은데.", "보드에 뭐가 있든 난 안 죽어.", "콜! 카드나 보자고."];
      sequence.en = ["My cards look pretty good.", "I don't care what's on the board.", "Call! Let's see them."];
    }
  } else if (AGGRESSIVE_PERSONAS.includes(personaId)) {
    // Aggressive Logic
    if (opponentHistory.passive && isAllIn) {
      sequence.ko = ["플랍이랑 턴에서 그렇게 얌전하더니...", "리버에서 갑자기 올인이라? 장난해?", "완전 뻥카 냄새가 진동을 하네. 못 죽는다!"];
      sequence.en = ["You were so quiet on the flop and turn...", "And now a river shove? Are you kidding me?", "I smell a massive bluff. I ain't folding!"];
    } else if (opponentHistory.aggressive && isAllIn) {
      sequence.ko = ["끝까지 미친 듯이 박아대는군.", "진짜 괴물 패를 쥐고 있는 건가?", "근데 나도 여기서 물러설 생각은 없어."];
      sequence.en = ["Just relentlessly betting all the way.", "Do you really have a monster hand?", "Well, I'm not backing down either."];
    } else if (isAllIn) {
      sequence.ko = ["리버 올인...?", "쫄게 만들려는 속셈인가 본데, 나한테는 안 통하지.", "콜 받아준다. 까봐!"];
      sequence.en = ["A river all-in...?", "Trying to scare me? Nice try, but I don't scare easy.", "I'm calling. Show them!"];
    } else {
      sequence.ko = ["사이즈 봐라. 찔끔 베팅해서 간 좀 보시겠다?", "이딴 베팅엔 절대 안 죽어."];
      sequence.en = ["Look at that sizing. Trying to milk me?", "I'm never folding to this."];
    }
  } else {
    // Analytical / GTO Logic (Narrative Focus)
    if (opponentHistory.passive && isAllIn) {
      sequence.ko = [
        "플랍, 턴 내내 얌전하게 콜만 하다가 리버에서 갑자기 올인...",
        "보드 텍스처를 보면 이건 전형적인 드로우(Draw) 완성 패턴이거나...",
        "아니면 날 낚기 위해 파놓은 끔찍한 함정(Trap)인데.",
        "수학적으로 이건 폴드하는 게 맞지만... 너무 의심스럽군."
      ];
      sequence.en = [
        "Quietly calling the flop and turn, and now a sudden river shove...",
        "Looking at the board texture, this is a classic completed draw...",
        "Or it's a terrifying trap they've been setting up all along.",
        "Mathematically it's a fold, but something feels very wrong."
      ];
    } else if (opponentHistory.aggressive && potRatio >= 0.7) {
      sequence.ko = [
        "프리플랍부터 리버까지 멈추지 않는 트리플 배럴이라...",
        "이 사이즈의 벳은 진짜 넛(Nut)이거나 완벽한 공갈, 둘 중 하나로 완전히 양극화되어 있다.",
        "내 블로커를 생각하면 상대의 밸류 콤보는 줄어들지만,",
        "내 레인지의 최하단으로 이걸 잡아야 할까...?"
      ];
      sequence.en = [
        "A relentless triple barrel from preflop to river...",
        "A bet of this size is completely polarized. It's either the absolute nuts or air.",
        "Factoring in my blockers, their value combinations are reduced, but...",
        "Do I really want to catch this with the bottom of my range?"
      ];
    } else if (isAllIn) {
      sequence.ko = [
        "리버에서 모든 칩을 밀어 넣는다고?",
        "상대의 벳 사이징과 이전 액션들을 복기해보자.",
        "이 상황에서 상대가 주장하는 레인지가 과연 메이크센스(Make sense)한가?",
        "블러핑 빈도를 감안하면 콜이지만, 결정을 내리기가 어렵군."
      ];
      sequence.en = [
        "Pushing all the chips in on the river?",
        "Let's reconstruct the hand and their bet sizing.",
        "Does the range they're representing actually make sense here?",
        "Given the bluff frequencies, a call is standard, but it's a tough spot."
      ];
    } else {
      sequence.ko = [
        "애매한 사이즈의 밸류 벳(Value bet)...",
        "콜을 유도하는 사이징 같은데 팟 오즈(Pot odds)는 나온다.",
        "하지만 이미 지고 있는 느낌을 지울 수가 없네."
      ];
      sequence.en = [
        "A weirdly sized value bet...",
        "It looks like it's begging for a call, and the pot odds are there.",
        "But I can't shake the feeling that I'm already beat."
      ];
    }
  }

  return sequence[lang];
};
