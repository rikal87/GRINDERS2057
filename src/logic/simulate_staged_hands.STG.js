import fs from 'fs';
import { createDeck } from './poker.js';
import { CLASSES_ENEMY as D1, CLASSES_PARTNER as D2 } from './persona.js'
import { getAIAction } from './aiEngine.js';
import { getUnifiedAction as getAdvancedAIAction } from './aiEngine/aiBrainHub.js';
import { PotManager } from './PotManager.js';

const CLASSES_ENEMY = [...D2, ...D1]

/**
 * Hand Tiers for Staged Test
 */
const HAND_TIERS = {
  SUPER_PREMIUM: [['As', 'Ah'], ['Ks', 'Kh'], ['Qs', 'Qh']],
  PREMIUM: [['Js', 'Jh'], ['Ts', 'Th'], ['Ac', 'Kc'], ['Ad', 'Kd'], ['As', 'Qs']],
  STRONG: [['9s', '9h'], ['8s', '8h'], ['Ac', 'Qc'], ['Ah', 'Qd'], ['Ks', 'Js']],
  CONNECTORS: [['8s', '7s'], ['9c', '8c'], ['Tc', 'Jc'], ['Qs', 'Js']]
};

export async function runStagedSimulation() {
  const opp1 = 'Max'
  const opp2 = 'Rich_Guy' // Case sensitive usually
  const opp3 = 'Shark'
  
  console.log(`Starting Staged Hand Simulation...`);
  
  const oop1Template = CLASSES_ENEMY.find(c => c.name === 'Max' || c.id === 'Max');
  const oop2Template = CLASSES_ENEMY.find(c => c.name === 'Rich_Guy' || c.id === 'rich_guy');
  const oop3Template = CLASSES_ENEMY.find(c => c.name === 'Shark' || c.id === 'shark');

  if (!oop1Template || !oop2Template || !oop3Template) {
    console.error("Error: Could not find one or more player templates.");
    console.log("Templates found:", !!oop1Template, !!oop2Template, !!oop3Template);
    return;
  }

  function getUnifiedActionByPersona(player, engine) {
    try {
      if (player.id.toLowerCase().includes('shark')) {
        return getAdvancedAIAction(player, engine);
      }
      if (player.class?.isAdvanced) {
        return getAdvancedAIAction(player, engine);
      }
      return getAIAction(player, engine);
    } catch (err) {
      console.error(`Action Error for ${player.name}:`, err.message);
      return { type: 'fold', insight: 'Error fallback' };
    }
  }

  let players = [];
  const createPlayer = (id, name, template, initialChips) => ({
    id, name, class: template, chips: initialChips, startChips: initialChips,
    currentBet: 0, totalWagered: 0, isFolded: false, hand: [], 
    stats: { handsPlayed: 0, vpipCount: 0, pfrCount: 0, threeBetCount: 0, fourBetPlusCount: 0 },
    handState: { didVpip: false, didPfr: false, didThreeBet: false }
  });

  players.push(createPlayer(`Max_0`, `Max`, oop1Template, 2000));
  players.push(createPlayer(`rich_guy_0`, `Rich_Guy`, oop2Template, 2000));
  players.push(createPlayer(`shark_0`, `Shark`, oop3Template, 2000));

  const engine = { bb: 2, sb: 1, board: [], aggressor: null, players: players, dealerIndex: 0, currentRoundBet: 0, state: 'PREFLOP', currentStreetRaises: 0, preflopRaises: 0, pot: 0, actionHistory: [] };
  const potManager = new PotManager(0, 0);

  let resultsLog = "=== Staged Hand Simulation Detailed Log ===\n\n";

  for (let cycle = 0; cycle < 9; cycle++) {
    const handIdxInCycle = cycle % 3;
    let tierMap = {};
    if (handIdxInCycle === 0) { tierMap = { Max: 'SUPER_PREMIUM', Rich_Guy: 'PREMIUM', Shark: 'STRONG' }; }
    else if (handIdxInCycle === 1) { tierMap = { Max: 'STRONG', Rich_Guy: 'SUPER_PREMIUM', Shark: 'PREMIUM' }; }
    else { tierMap = { Max: 'PREMIUM', Rich_Guy: 'STRONG', Shark: 'SUPER_PREMIUM' }; }

    for (let h = 0; h < 3; h++) {
      engine.board = [];
      potManager.resetHand();
      engine.aggressor = null;
      engine.handHistory = [];
      engine.actionHistory = [];
      engine.currentStreetRaises = 0;
      engine.preflopRaises = 0;

      // Assign Tiered Hands
      players.forEach(p => {
        const tier = tierMap[p.name];
        const possibilities = HAND_TIERS[tier];
        p.hand = [...possibilities[Math.floor(Math.random() * possibilities.length)]];
        p.isFolded = false;
        p.currentBet = 0;
        p.totalWagered = 0;
        p.handState = { didVpip: false, didPfr: false, didThreeBet: false };
      });

      // Card Removal Safety (User feedback)
      const deck = createDeck();
      players.forEach(p => {
        p.hand.forEach(c => {
          const idx = deck.indexOf(c);
          if (idx > -1) deck.splice(idx, 1);
        });
      });

      engine.dealerIndex = h;
      let actingIdx = (engine.dealerIndex + 3) % players.length;

      potManager.placeBet(players[(engine.dealerIndex + 1) % players.length], engine.sb);
      potManager.placeBet(players[(engine.dealerIndex + 2) % players.length], engine.bb);
      
      engine.state = 'PREFLOP';
      players.forEach(p => p.actedThisStreet = false);
      
      let attempts = 0;
      while (attempts < 30) {
        attempts++;
        const activePlayers = players.filter(p => !p.isFolded);
        const missingAction = activePlayers.find(p => p.chips > 0 && !p.actedThisStreet);
        const missingMatch = activePlayers.find(p => p.chips > 0 && p.currentBet !== potManager.currentRoundBet);
        if (!missingAction && !missingMatch) break;
        if (activePlayers.length <= 1) break;

        const p = players[actingIdx];
        if (!p.isFolded) {
          const callAmt = potManager.currentRoundBet - p.currentBet;
          engine.currentRoundBet = potManager.currentRoundBet;
          engine.pot = potManager.pot;

          let action = getUnifiedActionByPersona(p, engine);
          let amount = 0;

          if (action.type === 'fold') {
            engine.handHistory.push(`${p.name} (${p.hand}): Folds - <${action.insight}>`);
            p.isFolded = true;
          } else if (action.type === 'call' || action.type === 'check') {
            amount = callAmt;
            engine.handHistory.push(`${p.name} (${p.hand}): Calls ${amount} - <${action.insight}>`);
            p.actedThisStreet = true;
          } else {
            const targetAmount = action.amount || (callAmt + engine.bb);
            amount = targetAmount - p.currentBet;
            engine.handHistory.push(`${p.name} (${p.hand}): Raises to ${p.currentBet + amount} - <${action.insight}>`);
            
            engine.currentStreetRaises++;
            p.actedThisStreet = true;
            players.forEach(px => px.actedThisStreet = (px === p));
          }
          if (amount > 0) potManager.placeBet(p, amount);
          engine.actionHistory.push({ playerId: p.id, street: 'PREFLOP', action: action.type, amount: amount });
        }
        actingIdx = (actingIdx + 1) % players.length;
      }

      let hh = `\n[CYCLE ${cycle} HAND ${h}] TierConfig: Max=${tierMap.Max}, Rich=${tierMap.Rich_Guy}, Shark=${tierMap.Shark}\n`;
      engine.handHistory.forEach(line => hh += `  ${line}\n`);
      resultsLog += hh;
      console.log(hh);
    }
  }

  fs.writeFileSync('staged_hands_results.log', resultsLog, 'utf8');
}

runStagedSimulation().catch(console.error);
