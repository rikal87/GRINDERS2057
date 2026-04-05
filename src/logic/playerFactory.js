import { CLASSES } from './persona.js';
import { store } from './store.js';
import { ITEM_EFFECT_ID } from './constants.js';

export class PlayerFactory {
  static createHumanPlayer(engine, humanClass) {
    // [FIX] Calculate buy-in multiplier BEFORE object initialization to avoid NaN
    const item = store.equippedItem;
    const baseMultiplier = 1;
    const itemBonus = (item && item.effects) ? item.effects.reduce((sum, e) => (e.id === 'buy_in_multiply') ? sum + e.value : sum, 0) : 0;
    const buyInMultiply = baseMultiplier + itemBonus;

    const YOU = {
      id: 'player',
      personaId: 'player',
      name: 'YOU',
      class: CLASSES[humanClass],
      hand: [],
      chips: Math.floor(engine.buyIn * buyInMultiply), // Will be validated against bankroll in constructor or UI
      initialChips: Math.floor(engine.buyIn * buyInMultiply),
      currentBet: 0,
      totalWagered: 0,
      isFolded: false,
      isHuman: true,
      isMe: true,
      gainedXp: 0,
      effectCooldowns: {},
      item: store.equippedItem,
      tempXPBonus: 0.0,
      buyInLimit: engine.buyInLimit,
      totalBuyIn: 0,
      stats: {
        handsPlayed: 0,
        vPIPCount: 0,
        pfrCount: 0,
        threeBetCount: 0,
        threeBetOppCount: 0,
        fourBetOrMoreCount: 0,
        fourBetOppCount: 0,
        facedFlopBet: 0,
        foldedToFlopBet: 0,
        aggressiveActions: 0, // Bet + Raise
        calls: 0,
        get vPIP() { return this.handsPlayed > 0 ? (this.vPIPCount / this.handsPlayed) * 100 : 0; },
        get pfr() { return this.handsPlayed > 0 ? (this.pfrCount / this.handsPlayed) * 100 : 0; },
        get threeBet() { return this.threeBetOppCount > 0 ? (this.threeBetCount / this.threeBetOppCount) * 100 : 0; },
        get fourBetOrMore() { return this.fourBetOppCount > 0 ? (this.fourBetOrMoreCount / this.fourBetOppCount) * 100 : 0; },
        get foldToFlop() { return this.facedFlopBet > 0 ? (this.foldedToFlopBet / this.facedFlopBet) * 100 : 0; },
        get aggressionFactor() { return this.calls > 0 ? this.aggressiveActions / this.calls : (this.aggressiveActions > 0 ? 10 : 0); } // Infinite if no calls but has raises
      },
      get canReadSynapses() {
        if (!this.item || !this.item.effects) return false;
        // Fix: Find the effect object first, then check isActivated
        const effect = this.item.effects.find(e => e.id === 'synapse_reading');
        return effect ? effect.isActivated : false;
      },
      get rakeReduction() {
        if (!this.item || !this.item.effects) return 0;
        const reductionEffect = this.item.effects.reduce((sum, e) => {
          const effectObj = e.effect || (typeof e === 'object' ? e : null);
          if (effectObj && effectObj.id === ITEM_EFFECT_ID?.RAKE_REDUCTION) {
            return sum + (effectObj.value || 0);
          }
          if (typeof ITEM_EFFECT_ID !== 'undefined' && e === ITEM_EFFECT_ID.RAKE_REDUCTION) {
            return sum + 0.25; // Default T2 reduction value
          }
          return sum;
        }, 0);
        return reductionEffect;
      },
      get infamy_boost() {
        if (!this.item || !this.item.effects) return 0;
        return this.item.effects.reduce((sum, e) => {
          const id = e.id || (typeof e === 'string' ? e : null);
          return (id === 'infamy_boost') ? sum + (e.value || 0.1) : sum;
        }, 0);
      },
      get born_villain() {
        if (!this.item || !this.item.effects) return 0;
        return this.item.effects.reduce((sum, e) => {
          const id = e.id || (typeof e === 'string' ? e : null);
          return (id === 'born_villain') ? sum + (e.value || 0.1) : sum;
        }, 0);
      },
      get maxTimeBank() {
        const base = 15; // Default 15 seconds
        if (!this.item || !this.item.effects) return base;
        const bonus = this.item.effects.reduce((sum, e) => (e.id === 'time_bank') ? sum + e.value : sum, 0);
        return base + bonus;
      },
      get buyInMultiply() {
        const base = 1; // Default x1
        if (!this.item || !this.item.effects) return base;
        const bonus = this.item.effects.reduce((sum, e) => (e.id === 'buy_in_multiply') ? sum + e.value : sum, 0);
        return base + bonus;
      },

      timeBankRemaining: 15, // Initial value
      isEliminated: false,
    };
    return YOU;
  }

  static createAIPlayerFromTemplate(engine, villanTemplate, customId) {
    const villan = { ...villanTemplate };

    // Apply Infamy Modifiers
    if (engine.infamy >= 60) {
      villan.chipMultiply = (villan.chipMultiply || 1) * 1.5;
      villan.isAdvanced = true;
    }

    if (engine.infamy >= 40) {
      villan.vPIP = (villan.vPIP || 1) * 0.7;
      villan.WTSD = (villan.WTSD || 1) * 0.7;
      villan.initialVPIP = villan.vPIP;
      villan.initialWTSD = villan.WTSD;
    }

    if (engine.infamy >= 20) {
      // NPC AF = ((3 - {NPC 초기 AF} ) * 0.5) + {NPC 초기 AF} 로 보정.
      const baseAF = villan.AF || 1.0;
      villan.AF = ((2.5 - baseAF) * 0.5) + baseAF;
      villan.initialAF = villan.AF;
    }

    // Fallback if engine.buyIn is missing somehow (preventNaN)
    const engineBuyIn = engine.buyIn || 1000;
    const chips = engineBuyIn * (villan.chipMultiply || 1);
    const genId = customId || crypto.randomUUID();

    const aiPlayer = {
      id: genId,
      personaId: villan.id,
      name: villan.name,
      tempXPBonus: 0,
      class: villan,
      hand: [],
      chips: chips,
      initialChips: chips,
      initialVPIP: villan.vPIP,
      initialWTSD: villan.WTSD,
      initialAF: villan.initialAF,
      currentBet: 0,
      totalWagered: 0,
      isFolded: false,
      isHuman: false,
      isPartner: villan.isPartner || false,
      isAdvanced: villan.isAdvanced || false,
      isBoss: villan.isBoss || false,
      item: null,
      maxTimeBank: 15,
      showHoleCards: false,
      timeBankRemaining: 15,
      tilt: 0,
      isDrunken: villan.isDrunken || false,
      isEliminated: false,
      contracts: villan.contracts || [],
      stats: {
        handsPlayed: 0,
        vPIPCount: 0,
        pfrCount: 0,
        threeBetCount: 0,
        threeBetOppCount: 0,
        fourBetOrMoreCount: 0,
        fourBetOppCount: 0,
        facedFlopBet: 0,
        foldedToFlopBet: 0,
        aggressiveActions: 0,
        calls: 0,
        check: 0,
        fold: 0,
        all_in: 0,
        win: 0,
        lose: 0,
        bust: 0,
        bankrupt: 0,
        currentWinStreak: 0,
        currentLoseStreak: 0,
        maxWinStreak: 0,
        maxLoseStreak: 0,
        max_win_equity: 0,
        maxLoseEquity: 0,
        maxLosePot: 0,
        paid_rake: 0,
        rake_saved: 0,
        w$sd: 0,
        wtsd: 0,
        wsd: 0,
        faced_raise: 0,
        faced_3bet: 0,
        faced_4bet_or_more: 0,
        folded_to_raise: 0,
        folded_to_3bet: 0,
        folded_to_4bet_or_more: 0,
        net_winning: 0,
        get vPIP() { return this.handsPlayed > 0 ? (this.vPIPCount / this.handsPlayed) * 100 : 0; },
        get pfr() { return this.handsPlayed > 0 ? (this.pfrCount / this.handsPlayed) * 100 : 0; },
        get threeBet() { return this.threeBetOppCount > 0 ? (this.threeBetCount / this.threeBetOppCount) * 100 : 0; },
        get fourBetOrMore() { return this.fourBetOppCount > 0 ? (this.fourBetOrMoreCount / this.fourBetOppCount) * 100 : 0; },
        get foldToFlop() { return this.facedFlopBet > 0 ? (this.foldedToFlopBet / this.facedFlopBet) * 100 : 0; },
        get aggressionFactor() { return this.calls > 0 ? this.aggressiveActions / this.calls : (this.aggressiveActions > 0 ? 10 : 0); }
      },
    };
    return aiPlayer;
  }

  static createAIPlayer(engine, customId = null) {
    let villanTemplate = null;
    if (engine.playersPools && engine.playersPools.length > 0) {
      villanTemplate = engine.playersPools.pop();
    } else if (engine.getWeightedRandomEnemy) {
      // Use the newly extracted probability logic when pool runs out
      villanTemplate = engine.getWeightedRandomEnemy();
    } else {
      return null;
    }
    return PlayerFactory.createAIPlayerFromTemplate(engine, villanTemplate, customId);
  }
}
