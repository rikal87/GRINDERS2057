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
  const opp2 = 'rich_guy'
  const opp3 = 'shark'
  console.log(`Starting Staged Hand Simulation (${opp1} vs ${opp2} vs ${opp3})...`);
  
  const oop1Template = CLASSES_ENEMY.find(c => c.id === opp1 || c.name === opp1);
  const oop2Template = CLASSES_ENEMY.find(c => c.id === opp2 || c.name === opp2);
  const oop3Template = CLASSES_ENEMY.find(c => c.id === opp3 || c.name === opp3);

  function getUnifiedActionByPersona(player, engine) {
    if (player.id.startsWith('shark')) {
      return getAdvancedAIAction(player, engine); // Always use advanced for shark
    }
    if (player.class?.isBoss) {
      return getAdvancedAIAction(player, engine);
    }
    return getAIAction(player, engine);
  }

  let players = [];
  const createPlayer = (id, name, template, initialChips) => ({
    id, name, class: template, chips: initialChips, startChips: initialChips,
    currentBet: 0, totalWagered: 0, isFolded: false, hand: [], stats: { handsPlayed: 0, vpipCount: 0, pfrCount: 0, threeBetCount: 0, fourBetPlusCount: 0 },
    handState: { didVpip: false, didPfr: false, didThreeBet: false }
  });

  // Simplified 3-player table for clarity
  players.push(createPlayer(`Max_0`, `Max`, oop1Template, 2000));
  players.push(createPlayer(`rich_guy_0`, `rich_guy`, oop2Template, 2000));
  players.push(createPlayer(`shark_0`, `shark`, oop3Template, 2000));

  const engine = { bb: 2, sb: 1, board: [], aggressor: null, players: players, dealerIndex: 0, currentRoundBet: 0, state: 'PREFLOP', currentStreetRaises: 0, preflopRaises: 0, pot: 0, actionHistory: [] };
  const potManager = new PotManager(0, 0);

  let resultsLog = "=== Staged Hand Simulation Detailed Log ===\n\n";

  for (let cycle = 0; cycle < 12; cycle++) {
    const handIdxInCycle = cycle % 3;
    
    // Assign Hand Tiers based on rotation
    // Cycle 0: Max(SP), Rich(P), Shark(S)
    // Cycle 1: Shark(SP), Max(P), Rich(S)
    // Cycle 2: Rich(SP), Shark(P), Max(S)
    
    let tierMap = {};
    if (handIdxInCycle === 0) { tierMap = { Max: 'SUPER_PREMIUM', rich_guy: 'PREMIUM', shark: 'STRONG' }; }
    else if (handIdxInCycle === 1) { tierMap = { Max: 'STRONG', rich_guy: 'SUPER_PREMIUM', shark: 'PREMIUM' }; }
    else { tierMap = { Max: 'PREMIUM', rich_guy: 'STRONG', shark: 'SUPER_PREMIUM' }; }

    for (let h = 0; h < 5; h++) { // Play 5 hands of this configuration
      engine.board = [];
      potManager.resetHand();
      engine.aggressor = null;
      engine.handHistory = [];
      engine.actionHistory = [];
      engine.currentStreetRaises = 0;
      engine.preflopRaises = 0;

      players.forEach(p => {
        const tier = tierMap[p.name];
        const possibilities = HAND_TIERS[tier];
        p.hand = [...possibilities[Math.floor(Math.random() * possibilities.length)]];
        p.isFolded = false;
        p.currentBet = 0;
        p.totalWagered = 0;
        p.handState = { didVpip: false, didPfr: false, didThreeBet: false, didFourBetPlus: false };
      });

      // Fixed Dealer for this test (Max=0, Rich=1, Shark=2)
      engine.dealerIndex = (h % 3);
      let actingIdx = (engine.dealerIndex + 3) % players.length;

      // PREFLOP ONLY FOR THIS DEBUG
      potManager.placeBet(players[(engine.dealerIndex + 1) % players.length], engine.sb);
      potManager.placeBet(players[(engine.dealerIndex + 2) % players.length], engine.bb);
      
      engine.state = 'PREFLOP';
      players.forEach(p => p.actedThisStreet = false);
      
      let attempts = 0;
      while (attempts < 20) {
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
            if (amount > 0 && !p.handState.didVpip) { p.handState.didVpip = true; p.stats.vpipCount++; }
          } else {
            const targetAmount = action.amount || (callAmt + engine.bb);
            amount = targetAmount - p.currentBet;
            engine.handHistory.push(`${p.name} (${p.hand}): Raises to ${p.currentBet + amount} - <${action.insight}>`);
            
            engine.currentStreetRaises++;
            engine.preflopRaises++;
            if (engine.currentStreetRaises === 1) p.stats.pfrCount++;
            if (engine.currentStreetRaises === 2) p.stats.threeBetCount++;
            if (engine.currentStreetRaises >= 3) p.stats.fourBetPlusCount++;
            
            p.actedThisStreet = true;
            players.forEach(px => px.actedThisStreet = false);
            p.actedThisStreet = true;
            p.handState.didVpip = true; 
            p.stats.vpipCount++;
          }
          if (amount > 0) potManager.placeBet(p, amount);
          
          // Store Action History for AI
          engine.actionHistory.push({ playerId: p.id, street: 'PREFLOP', action: action.type, amount: amount });
        }
        actingIdx = (actingIdx + 1) % players.length;
      }

      let hh = `\n[CYCLE ${cycle} HAND ${h}] TierConfig: Max=${tierMap.Max}, Rich=${tierMap.rich_guy}, Shark=${tierMap.shark}\n`;
      engine.handHistory.forEach(line => hh += `  ${line}\n`);
      resultsLog += hh;
      console.log(hh);
    }
  }

  fs.writeFileSync('staged_hands_results.log', resultsLog, 'utf8');
}

runStagedSimulation();
