import { createDeck, evaluateHand } from './poker.js';
import { PotManager } from './PotManager.js';
import { getAIAction } from './aiEngine.v2.js';
import { PARTNER_STATUS } from './constants.js';
import { zones } from './zone.js';
import { CLASSES_ENEMY, CLASSES_PARTNER } from './persona.js';

/**
 * [GRINDERS 2057] MatchSimulator — Decisive Moment Injection Engine
 * 
 * 핵심 변경사항:
 * - simulateHand()가 FLOP/TURN/RIVER 시작 직전 팟 20BB+ 감지 시
 *   핸드를 즉시 중단하고 capturePoint 스냅샷을 반환 (Decisive Moment Injection)
 * - Hero는 항상 players[0] 고정 (Seat 0 Hardlock)
 * - Phase 1 리플레이용 phase1Stream (PREFLOP ~ 결정 지점 직전)을 capturePoint에 포함
 */
export class MatchSimulator {
  constructor(options = {}) {
    this.bb = options.bb || 20;
    this.sb = options.sb || 10;
    this.rake = options.rake || 0.05;
    this.rakeCap = options.rakeCap || 50;
    this.potManager = new PotManager(this.rake, this.rakeCap);
    this.eventBuffer = [];
    this.maxEventsPerTick = options.maxEventsPerTick || 1;
    this.cooldownMap = new Map();
    this.cooldownMs = options.cooldownMs || 180000;
  }

  simulatePartnerCycle(partner, locationId = 'high_grand_casino', tableBb = 100) {
    if (partner.status !== PARTNER_STATUS.GAMBLING || partner.bankroll <= 0) return null;

    this.bb = tableBb || this.bb;
    this.sb = Math.round(this.bb / 2);

    const isActionCycle = ((partner.vPIP + partner.WTSD) / 2) > Math.random();
    if (!isActionCycle) return null;

    const volatility = partner.AF * Math.max(partner.bankroll / 1000, 25) * Math.random();
    const estimatedPot = Math.ceil(100 * volatility);
    const minBigPotBbRatio = 50;
    const isVolatileSpike = estimatedPot >= (this.bb * minBigPotBbRatio) || (partner.relationship !== undefined && partner.relationship < 300);

    if (isVolatileSpike) {
      let locationConfig = null;
      for (const zone of zones) {
        const loc = zone.locations.find(l => l.id === locationId);
        if (loc) { locationConfig = loc; break; }
      }

      const tableNpcs = locationConfig?.npcs || ['Fish', 'Broke', 'MR_CALL'];
      const availableTemplates = [...CLASSES_PARTNER, ...CLASSES_ENEMY];

      // [HERO SEAT 0 HARDLOCK] Hero always at index 0
      const roster = [{
        ...partner,
        personaId: partner.id || partner.name || 'HERO',
        chips: Math.round((partner.bankroll || 2000) * 0.8),
        isHero: true
      }];
      const usedIds = new Set([partner.id]);

      let count = 1;
      while (roster.length < 6) {
        const npcName = tableNpcs[(count - 1) % tableNpcs.length];
        const template = availableTemplates.find(t => t.id === npcName || t.name === npcName) || availableTemplates[count % availableTemplates.length];
        const candidateId = `${template.id}_${count}`;
        if (!usedIds.has(candidateId)) {
          usedIds.add(candidateId);
          roster.push({
            ...template,
            id: candidateId,
            personaId: template.id || template.name || 'NPC',
            name: `${template.name} #${count}`,
            chips: Math.round(this.bb * (50 + Math.floor(Math.random() * 100))),
            isHero: false
          });
        }
        count++;
      }

      return this.simulateHand(roster, partner.timestamp, locationId);
    }

    const isWin = Math.random() < partner.W$SD;
    const netWorthChange = isWin ? Math.ceil(97 * volatility) : -Math.ceil(100 * volatility);
    partner.bankroll = Math.max(0, partner.bankroll + netWorthChange);
    if (partner.sessionNetWorth !== undefined) partner.sessionNetWorth += netWorthChange;

    return null;
  }

  simulateHand(playersInput, timestamp = null, locationId = 'high_grand_casino') {
    const deck = createDeck();
    const potManager = this.potManager;
    potManager.resetHand();

    const players = playersInput.map(p => ({
      ...p,
      chips: p.chips || 2000,
      startChips: p.chips || 2000,
      currentBet: 0,
      totalWagered: 0,
      isFolded: false,
      hand: [deck.pop(), deck.pop()],
      handState: { didVpip: false, didPfr: false }
    }));

    const engine = {
      bb: this.bb, sb: this.sb,
      board: [], aggressor: null, players,
      dealerIndex: 0, currentRoundBet: 0,
      state: 'PREFLOP', currentStreetRaises: 0,
      preflopRaises: 0, pot: 0
    };

    const actionStream = [];
    const dealerIdx = 0;

    potManager.placeBet(players[(dealerIdx + 1) % players.length], engine.sb);
    actionStream.push({ street: 'PREFLOP', type: 'blind', player: players[(dealerIdx + 1) % players.length].name, playerId: players[(dealerIdx + 1) % players.length].id, amount: engine.sb });
    potManager.placeBet(players[(dealerIdx + 2) % players.length], engine.bb);
    actionStream.push({ street: 'PREFLOP', type: 'blind', player: players[(dealerIdx + 2) % players.length].name, playerId: players[(dealerIdx + 2) % players.length].id, amount: engine.bb });

    let actingIdx = (dealerIdx + 3) % players.length;

    const runBettingRound = (street) => {
      engine.state = street;
      engine.currentStreetRaises = 0;
      players.forEach(p => p.actedThisStreet = false);
      let attempts = 0;
      while (attempts < 100) {
        attempts++;
        const activePlayers = players.filter(p => !p.isFolded);
        const playersWithChips = activePlayers.filter(p => p.chips > 0);
        if (activePlayers.length <= 1 || playersWithChips.length === 0) break;
        const missingAction = playersWithChips.find(p => !p.actedThisStreet || p.currentBet < potManager.currentRoundBet);
        if (!missingAction) break;

        const p = players[actingIdx];
        if (!p.isFolded && p.chips > 0) {
          const callAmt = potManager.currentRoundBet - p.currentBet;
          engine.currentRoundBet = potManager.currentRoundBet;
          engine.pot = potManager.pot;
          const action = getAIAction(p, engine);
          let amount = 0;
          if (action.type === 'fold') {
            actionStream.push({ street, type: 'fold', player: p.name, playerId: p.id });
            p.isFolded = true;
            if (players.filter(px => !px.isFolded).length <= 1) break;
          } else if (action.type === 'check' || action.type === 'call') {
            amount = callAmt;
            actionStream.push({ street, type: amount === 0 ? 'check' : 'call', player: p.name, playerId: p.id, amount });
            if (amount > 0) potManager.placeBet(p, amount);
            p.actedThisStreet = true;
          } else {
            const targetAmount = action.amount || (callAmt + engine.bb);
            amount = targetAmount - p.currentBet;
            if (amount > p.chips) amount = p.chips;
            const isAllIn = p.chips <= amount;
            potManager.placeBet(p, amount);
            actionStream.push({ street, type: isAllIn ? 'all_in' : 'raise', player: p.name, playerId: p.id, amount: p.currentBet, potSize: potManager.pot });
            if (street === 'PREFLOP') engine.preflopRaises++;
            players.forEach(px => px.actedThisStreet = false);
            p.actedThisStreet = true;
          }
        }
        actingIdx = (actingIdx + 1) % players.length;
      }
      players.forEach(p => p.currentBet = 0);
      potManager.currentRoundBet = 0;
    };

    // PREFLOP
    runBettingRound('PREFLOP');

    // POST-FLOP STREETS — Decisive Moment Injection
    const streets = ['FLOP', 'TURN', 'RIVER'];
    for (const street of streets) {
      if (players.filter(p => !p.isFolded).length <= 1) break;

      if (street === 'FLOP') engine.board.push(deck.pop(), deck.pop(), deck.pop());
      else engine.board.push(deck.pop());
      actionStream.push({ street, type: 'board_deal', board: [...engine.board] });

      const potBbRatio = Math.round(potManager.pot / this.bb);
      // Hero is always index 0 (Seat 0 Hardlock)
      const heroPlayer = players[0];
      const isHeroActive = heroPlayer && !heroPlayer.isFolded;

      // [DECISIVE MOMENT INJECTION] Pot >= 20BB + Hero alive = capture & pause
      if (potBbRatio >= 20 && isHeroActive) {
        console.info(`🎯 [DECISIVE_MOMENT] ${heroPlayer.name} @ ${street}: Pot $${potManager.pot.toLocaleString()} CR (${potBbRatio} BB) — capturePoint 생성`);

        return {
          capturePoint: {
            timestamp: timestamp || Date.now(),
            locationId,
            bb: this.bb,
            sb: this.sb,
            pot: potManager.pot,
            potBbRatio,
            board: [...engine.board],
            currentStreet: street,
            decisiveStreet: street,
            // Hero is always index 0 (Seat 0 Hardlock)
            players: players.map((p, idx) => ({
              id: p.id,
              name: p.name,
              hand: [...(p.hand || [])],
              chips: p.chips,
              isFolded: p.isFolded,
              isHero: idx === 0,
              personaId: p.personaId || p.id,
              seatIndex: idx
            })),
            // Full action history PREFLOP ~ this street (for Phase 1 auto-replay)
            phase1Stream: [...actionStream],
            isBigPot: true,
            isCooler: this.detectCoolerScenario(players, engine.board)
          }
        };
      }

      actingIdx = (dealerIdx + 1) % players.length;
      runBettingRound(street);
    }

    return null; // No decisive moment this cycle
  }

  detectCoolerScenario(players, board) {
    const active = players.filter(p => !p.isFolded && p.hand && p.hand.length === 2);
    if (active.length < 2) return false;
    let strongHandCount = 0;
    active.forEach(p => {
      const evalRes = evaluateHand([...p.hand, ...board]);
      if (evalRes.rank >= 3) strongHandCount++;
    });
    return strongHandCount >= 2;
  }

  consumeEventsForTick() {
    if (this.eventBuffer.length === 0) return [];
    return this.eventBuffer.splice(0, this.maxEventsPerTick);
  }
}
