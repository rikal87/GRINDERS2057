import { calculateEquity, createDeck } from './poker.js';
import { getAIAction, chatAI, } from './aiEngine.v2.js';
import { getAdvancedAIAction } from './aiEngineAdvanced.js';
import { CLASSES_PARTNER } from './persona.js'
import { audioManager } from './audioManager.js';
import { PotManager } from './PotManager.js';
import { EventAdaptor } from './gameEngineEventAdaptor.js';
import { getPartner, getJoinedPartners } from './partnerSystem.js';
import { shareBenefitForPartners, shareCollusion } from './partnerContractSystem.js';
import { isFastFoward, getListPlayStatsSession, gainInfamy, gainXPEstimate, store, saveStore, gainBankroll, gainSuspicion, getCurrentSuspicion, getCurrentInfamy, gainXP, gainClearedZoneCount, gainClearReward, processMissionResult } from './store.js';
import { LOCATION_ID, CONTRACT_TYPE, CHAT_TRIGGERS, TYPE_CHANGE_BANKROLL } from './constants.js'
import { CLASSES, CLASSES_ENEMY, CLASSES_ENEMY_BOSS } from './persona.js';
import { zones } from './zone.js';
import { GAME_RESULT_CODE, PLAY_RECORD_STATS_TYPE, recordPlayStatsSession } from './playRecordStats';
export const gameResult = (winBB) => {
  if (winBB >= 100) return GAME_RESULT_CODE.WIN_BIG;
  if (winBB >= 50) return GAME_RESULT_CODE.WIN_MEDIUM;
  if (winBB >= 30) return GAME_RESULT_CODE.WIN_SMALL;
  if (winBB <= -100) return GAME_RESULT_CODE.LOSE_BIG;
  if (winBB <= -50) return GAME_RESULT_CODE.LOSE_MEDIUM;
  if (winBB <= -30) return GAME_RESULT_CODE.LOSE_SMALL;
  return GAME_RESULT_CODE.NEUTRAL;
}
const eventAdaptor = new EventAdaptor();
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export class GameEngine {
  constructor(playerClass = 'VANGUARD', tableSize = 2, sb = 1, bb = 2, buyin = 1000, rake = 0.05, rakeCap = 50, isAdvanced = false
    , locationId = 'micro_street_shop', locationLV = 1, buyInLimit = 999999, isMonitoring = false, inviteId = null, isDeathmatch = false) {
    this.exited = false;
    this.locationId = locationId;
    this.tableSize = tableSize;
    this.sb = sb;
    this.bb = bb;
    this.isAdvanced = isAdvanced;
    this.rake = rake;
    this.rakeCap = rakeCap;
    this.deck = [];
    this.board = [];
    this.state = 'IDLE';
    this.buyIn = buyin;
    this.dealerIndex = 0;
    this.currentPlayerIndex = 0;
    this.isTutorial = false;
    this.mentor = null;
    this.gameOver = false;
    this.exitReservationRounds = -1; // -1 means no reservation
    this.exitReservationRoundsMax = -1;
    this.exitReservationRoundDefault = 15; // default value
    this.winnerId = null;
    this.playersActedCount = 0;
    this.runoutInProgress = false;
    this.calculationInProgress = false;
    this.victoryPrize = 0;
    this.lastTriggeredItem = null; // Visual feedback
    // NEW: Delegate money logic
    this.potManager = new PotManager(this.rake, this.rakeCap);
    this.handHistory = [];
    this.currentHandHistory = null;
    this.actionHistory = []; // [v3.0] Structured history for AI analysis
    this.processingAI = false;
    this.locationLV = locationLV;
    this.turnTimer = null;
    this.currentStreetRaises = 0;
    this.pot = 0; // [FIX] Reactive property for instant updates
    this.aggressor = null; // Track who raised preflop for C-Bet logic
    this.buyInLimit = buyInLimit; // only for human?
    this.inviteId = inviteId;
    this.preflopRaises = 0;
    this.suspicion = 0;
    this.infamy = 0;
    this.playersPools = [];
    this.isMonitoring = isMonitoring;
    this.isDeathmatch = isDeathmatch;
    // [FIX] Initialize players after all properties are set
    this.players = this.initializePlayers(playerClass, tableSize);
    // this.partners = [];
  }

  // Getter for backward compatibility / easier access
  // get pot() { return this.potManager.pot; } // Removed for direct property access
  get currentRoundBet() { return this.potManager.currentRoundBet; }
  // if (Math.random() < 0.25) chatAI(aiPlayer, CHAT_TRIGGERS.GAME_START, "", 0, this)
  initializePlayers(humanClass, size) {
    const players = [];

    // [FIX] Calculate buy-in multiplier BEFORE object initialization to avoid NaN
    const item = store.equippedItem;
    const baseMultiplier = 1;
    const itemBonus = (item && item.effects) ? item.effects.reduce((sum, e) => (e.id === 'buy_in_multiply') ? sum + e.value : sum, 0) : 0;
    const buyInMultiply = baseMultiplier + itemBonus;

    const YOU = {
      id: 'player',
      name: 'YOU',
      class: CLASSES[humanClass],
      hand: [],
      chips: Math.floor(this.buyIn * buyInMultiply), // Will be validated against bankroll in constructor or UI
      initialChips: Math.floor(this.buyIn * buyInMultiply),
      currentBet: 0,
      totalWagered: 0,
      isFolded: false,
      isHuman: true,
      isMe: true,
      // buyInMultiply: 1, // [FIX] Default multiplier for human
      gainedXp: 0,
      effectCooldowns: {},
      item: store.equippedItem,
      tempXPBonus: 0.0,
      buyInLimit: this.buyInLimit,
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
      // get chipRounding() {
      //   if (!this.item || !this.item.effects) return 1;
      //   const bonus = this.item.effects.reduce((sum, e) => (e.id === 'chip_rounding') ? sum + e.value : sum, 0);
      //   return Math.pow(10, bonus);
      // },
      get rakeReduction() {
        if (!this.item || !this.item.effects) return 0;
        const reductionEffect = this.item.effects.reduce((sum, e) => {
          const effectObj = e.effect || (typeof e === 'object' ? e : null);
          if (effectObj && effectObj.id === ITEM_EFFECT_ID.RAKE_REDUCTION) {
            return sum + (effectObj.value || 0);
          }
          if (e === ITEM_EFFECT_ID.RAKE_REDUCTION) {
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
      // get bonusXpToGoldRatio() {
      // if (!this.item || !this.item.effects) return 0;
      // const transGoldToXpRatio = this.item.effects.reduce((sum, e) => (e.id === 'golden_touch') ? sum + e.value : sum, 0);
      // return Math.min(1, transGoldToXpRatio);
      // },

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
      // Helper methods for skills
    }
    this.processBuyIn(YOU)
    players.push(YOU)

    // Build spawn requirements from store.activeBoosts
    const spawnBoosts = store.activeBoosts
      .filter(b => b.effect.type === 'spawn')
      .map(b => b.effect);

    const spawnMultBoosts = store.activeBoosts
      .filter(b => b.effect.type === 'spawn_rate_mul')
      .map(b => b.effect);

    // Filter Regular Enemies
    if (this.locationId === LOCATION_ID.FREE_STREET_SHOP_WITH_MAX) {
      this.isTutorial = true;
    }

    let locationConfig = null;
    for (const zone of zones) {
      const loc = zone.locations.find(l => l.id === this.locationId);
      if (loc) {
        locationConfig = loc;
        break;
      }
    }
    this.allowedNames = locationConfig.npcs;

    // Some tasks might allow spawning an enemy even if it's not strictly allowed by the zone.
    // For now we'll allow forced spawns to override loc allowedNames
    console.log('this.buyInLimit', this.buyInLimit);
    let enemiesToPlace = [];
    // 0. partners Spawns (Top Priority from zone.js config)
    if (!this.inviteId) {
      const joinedPartners = getJoinedPartners();
      joinedPartners.forEach(partner => {
        const validContract = partner.contracts.find(contract => contract.type === CONTRACT_TYPE.COLLUSION && contract.active);
        const template = CLASSES_PARTNER.find(e => e.id === partner.id)
        if (template && validContract) {
          enemiesToPlace.push({ ...template });
        } else {
          console.info(`[GAME] Partner ${partner.name} is not with you`);
        }
      });
    }
    // 1. Guests Spawns (Top Priority from zone.js config)
    if (locationConfig.guests && Array.isArray(locationConfig.guests)) {
      locationConfig.guests.forEach(guestName => {
        if (enemiesToPlace.length >= size - 1) return;
        const targetId = guestName.toLowerCase();
        const template = [...CLASSES_ENEMY, ...CLASSES_PARTNER].find(e => e.name.toLowerCase() === targetId)
        if (template) {
          enemiesToPlace.push({ ...template });
        } else {
          console.warn(`[GAME] Companion persona '${guestName}' not found in CLASSES.`);
        }
      });
    }
    // 2. Forced Spawns (Boosts)
    this.bossPool = [...CLASSES_ENEMY_BOSS].filter(p => p.isBoss).sort(() => Math.random() - 0.5);

    spawnBoosts.forEach(eff => {
      // Find the enemy template
      // Match case-insensitively due to ID mismatch (e.g. 'shark' vs 'Shark')
      const targetId = eff.id.toLowerCase();
      let template = null;
      if (targetId === 'named_pro') {
        // Pop boss if available
        if (this.bossPool.length > 0) template = this.bossPool.pop();
      } else {
        template = CLASSES_ENEMY.find(e => e.name.toLowerCase() === targetId);
      }

      if (template) {
        // Add up to `amount` times, but respect table size (size - 1 for YOU)
        for (let j = 0; j < eff.amount; j++) {
          if (enemiesToPlace.length >= size - 1) break;
          // Clone the template
          enemiesToPlace.push({ ...template });
        }
      }
    });

    // 3. Weighted Random Spawns for remainders
    this.availableEnemies = CLASSES_ENEMY.filter(enemy => enemy.name !== 'Named_Pro' && this.allowedNames.includes(enemy.name));

    // Prepare weights based on multiply boosts
    this.weightMap = {};
    this.availableEnemies.forEach(env => {
      this.weightMap[env.name.toLowerCase()] = 1.0;
    });

    spawnMultBoosts.forEach(eff => {
      const targetId = eff.id.toLowerCase();
      if (this.weightMap[targetId] !== undefined) {
        this.weightMap[targetId] *= eff.amount;
      }
    });

    // Helper to pick randomly based on weights
    this.getWeightedRandomEnemy = () => {
      // Add Named_Pro logic (random chance if allowed)
      if (this.allowedNames.includes('Named_Pro') && Math.random() < 0.1 && this.bossPool.length > 0) {
        return this.bossPool.pop();
      }

      const totalWeight = this.availableEnemies.reduce((sum, en) => sum + this.weightMap[en.name.toLowerCase()], 0);
      let rand = Math.random() * totalWeight;
      for (const en of this.availableEnemies) {
        rand -= this.weightMap[en.name.toLowerCase()];
        if (rand <= 0) return { ...en, isDrunken: locationConfig.isDrunken };
      }
      return { ...this.availableEnemies[0] }; // Fallback
    };

    // Optional: Shuffle enemiesToPlace to randomize seat positions
    enemiesToPlace = enemiesToPlace.sort(() => Math.random() - 0.5);

    // Create the generic pool of random enemies for substitutions later
    const fallbackPool = [];
    while (fallbackPool.length < size * 2) {
      fallbackPool.push(this.getWeightedRandomEnemy());
    }
    this.playersPools = fallbackPool.sort(() => Math.random() - 0.5);

    // --- Apply Infamy Modifications to NPC Template base on Zone ---
    this.infamy = getCurrentInfamy(this.locationId);
    this.suspicion = getCurrentSuspicion(this.locationId);

    // Gather all NPCs needed for the table
    const tableNpcs = [];

    // First put the guaranteed enemies (Partners, Guests, Forced) up to the table limit
    for (let i = 0; i < enemiesToPlace.length && tableNpcs.length < size - 1; i++) {
      tableNpcs.push(this.createAIPlayerFromTemplate(enemiesToPlace[i], `cpu_${i + 1}`));
    }

    // Fill the empty seats with random NPCs from the pool
    let cpuCount = enemiesToPlace.length + 1;
    while (tableNpcs.length < size - 1) {
      tableNpcs.push(this.createAIPlayer(`cpu_${cpuCount++}`));
    }

    // Completely shuffle the NPCs so guaranteed ones don't always sit right next to the player
    const shuffledNpcs = tableNpcs.sort(() => Math.random() - 0.5);
    players.push(...shuffledNpcs);

    if (this.isTutorial) {
      this.mentor = players.find(e => e.name === 'Max(Mentor)');
    }
    return players;
  }

  createAIPlayerFromTemplate(villanTemplate, customId) {
    const villan = { ...villanTemplate };
    console.info('vt', villanTemplate)
    console.info('villan', villan);

    // Apply Infamy Modifiers
    if (this.infamy >= 60) {
      villan.chipMultiply = (villan.chipMultiply || 1) * 1.5;
      villan.isAdvanced = true;
    }

    if (this.infamy >= 40) {
      villan.vPIP = (villan.vPIP || 1) * 0.7;
      villan.WTSD = (villan.WTSD || 1) * 0.7;
      villan.initialVPIP = villan.vPIP;
      villan.initialWTSD = villan.WTSD;
    }

    if (this.infamy >= 20) {
      // NPC AF = ((3 - {NPC 초기 AF} ) * 0.5) + {NPC 초기 AF} 로 보정.
      const baseAF = villan.AF || 1.0;
      villan.AF = ((2.5 - baseAF) * 0.5) + baseAF;
      villan.initialAF = villan.AF;
    }
    const chips = this.buyIn * villan.chipMultiply;
    const genId = customId || `cpu_${Math.random().toString(36).substr(2, 5)}`;

    const aiPlayer = {
      id: villan.isPartner ? villan.id : genId,
      name: `${villan.name}`,
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
      isBoss: villan.isBoss || false,
      item: null,
      maxTimeBank: 15,
      showHoleCards: false,
      timeBankRemaining: 15,
      tilt: 0,
      isDrunken: villan.isDrunken || false,
      isEliminated: false,
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

  createAIPlayer(customId = null) {
    let villanTemplate = null;
    if (this.playersPools && this.playersPools.length > 0) {
      villanTemplate = this.playersPools.pop();
    } else if (this.getWeightedRandomEnemy) {
      // Use the newly extracted probability logic when pool runs out
      villanTemplate = this.getWeightedRandomEnemy();
    } else {
      return null;
    }
    return this.createAIPlayerFromTemplate(villanTemplate, customId);
  }
  async startNewHand(isFirstHand = false) {
    if (this.exited) return;
    audioManager.disableTensionMode();
    this.deck = createDeck();
    this.board = [];
    this.potManager.resetHand();
    this.playersActedCount = 0;
    this.preflopRaises = 0;
    this.currentStreetRaises = 0; // [FIX] Reset raises for new hand
    this.aggressor = null;
    this.actionHistory = []; // [v3.0] Reset history for new hand
    if (this.exitReservationRounds > 0) {
      this.exitReservationRounds--;
    } else if (this.exitReservationRounds === 0) {
      // Time to exit
      this.cashOut();
      return;
    }

    this.players.forEach(p => {
      p.hand = [this.deck.pop(), this.deck.pop()];
      p.isFolded = p.chips <= 0; // Out of game if no chips
      p.currentBet = 0;
      p.totalWagered = 0;
      p.isBlind = false; // Reset blind status
      p.isJoinPot = false; // Reset VPIP tracker
      p.showHoleCards = false; // reset show hole cards
      // [FIX] Reset AF to initial before applying tilt modifiers
      if (p.class && !p.isBoss && !p.isAdvanced) {
        p.class.vPIP = p.initialVPIP;
        p.class.WTSD = p.initialWTSD;
        p.class.AF = p.initialAF; // initialize
        if (p.tilt >= 75) {
          p.class.AF += 2;
        } else if (p.tilt >= 50) {
          p.class.AF += 1;
        } else if (p.tilt >= 25) {
          p.class.AF += 0.5;
        }
        if (p.isDrunken) {
          p.class.AF += 1;
          p.class.vPIP += 0.15;
          p.class.WTSD += 0.15;
        }
      }
      if (!p.isEliminated) recordPlayStatsSession(p, PLAY_RECORD_STATS_TYPE.HANDS_PLAYED);
      if (p.isMe) {
        const suitToStat = {
          'h': PLAY_RECORD_STATS_TYPE.DEALT_HANDS_HEART,
          'c': PLAY_RECORD_STATS_TYPE.DEALT_HANDS_CLUB,
          'd': PLAY_RECORD_STATS_TYPE.DEALT_HANDS_DIAMOND,
          's': PLAY_RECORD_STATS_TYPE.DEALT_HANDS_SPADE
        };
        p.hand.forEach((h) => {
          const suit = h.slice(-1);
          if (suitToStat[suit]) {
            recordPlayStatsSession(p, suitToStat[suit]);
          }
        });
      }
    });

    this.calculationInProgress = false;
    // Check Trigger: PREFLOP start (or Round Start)
    // this.checkSkillTriggers('round_start');
    // this.checkSkillTriggers('preflop_start');
    if (isFirstHand) {
      const players = this.players.filter(p => !p.isMe);
      let pickOne = players.find((p) => p.name === 'Max(Mentor)');
      if (pickOne) {
        chatAI(pickOne, CHAT_TRIGGERS.GAME_START, "", 0, this)
      } else {
        pickOne = players[Math.floor(Math.random() * players.length)];
        console.info('pickOne', pickOne)
        chatAI(pickOne, CHAT_TRIGGERS.GAME_START, "", 0, this)
      }
      eventAdaptor.gameStart({ locationId: this.locationId, inviteId: this.inviteId });
      await sleep(2000);
    }
    eventAdaptor.roundStart(this.players, { sb: this.sb, bb: this.bb });
    // Initialize history for new hand
    this.currentHandHistory = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      players: this.players.map(p => ({ name: p.name, chips: p.chips, id: p.id })),
      blinds: { sb: this.sb, bb: this.bb },
      board: [],
      actions: {
        PREFLOP: [],
        FLOP: [],
        TURN: [],
        RIVER: [],
        SHOWDOWN: []
      },
      winner: null,
      pot: 0,
      detailedPots: [],
      playerResults: []
    };

    this.runoutInProgress = false;

    // Filter active (non-eliminated) players
    const activePlayersIndices = this.players
      .map((p, idx) => ({ p, idx }))
      .filter(item => !item.p.isEliminated)
      .map(item => item.idx);

    const activeCount = activePlayersIndices.length;
    if (activeCount < 2) return; // Should not happen if game over check works

    // Increment dealer index within the subset of active players
    let currentActiveDealerIdx = activePlayersIndices.indexOf(this.dealerIndex);
    if (currentActiveDealerIdx === -1) {
      // If previous dealer was eliminated, pick the next available
      currentActiveDealerIdx = 0;
    }

    // Move dealer to next active person
    currentActiveDealerIdx = (currentActiveDealerIdx + 1) % activeCount;
    this.dealerIndex = activePlayersIndices[currentActiveDealerIdx];

    // Assign blinds based on active list
    let sbIndex, bbIndex, firstToActIndex;
    if (activeCount === 2) {
      // Heads-up: Dealer is SB, other is BB
      sbIndex = activePlayersIndices[currentActiveDealerIdx];
      bbIndex = activePlayersIndices[(currentActiveDealerIdx + 1) % activeCount];
      firstToActIndex = sbIndex; // SB acts first preflop in HU
    } else {
      sbIndex = activePlayersIndices[(currentActiveDealerIdx + 1) % activeCount];
      bbIndex = activePlayersIndices[(currentActiveDealerIdx + 2) % activeCount];
      firstToActIndex = activePlayersIndices[(currentActiveDealerIdx + 3) % activeCount];
    }

    this.placeBet(this.players[sbIndex], this.sb, true, this.bb);
    this.players[sbIndex].isBlind = true;

    this.placeBet(this.players[bbIndex], this.bb, true, this.bb);
    this.players[bbIndex].isBlind = true;

    this.currentPlayerIndex = firstToActIndex;
    this.state = 'PREFLOP';
    eventAdaptor.startStreet('PREFLOP');

    this.processTurns();
  }

  placeBet(player, amount, isBlind, bb) {
    const previousRoundBet = this.potManager.currentRoundBet;
    const raised = this.potManager.placeBet(player, amount);
    this.pot = this.potManager.pot; // [FIX] Sync reactive pot immediately
    if (isBlind) recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.PAY_BLIND);

    // Check if player's action is mathematically a raise or a call based on the pot/bet
    // If not a blind, and the amount placed raises the current round bet, it's a raise
    if (!isBlind) {
      if (amount > 0) {
        player.voluntarilyInteracted = true;
        // player.totalWagered += amount;
      }
      const isAllIn = player.chips === 0;
      const amountIncreased = this.potManager.currentRoundBet - previousRoundBet;

      // It's a genuine raise if they increased the round's bet by at least a BB, 
      // or if they went all-in to increase it.
      const isGenuineRaise = raised && (amountIncreased >= bb || (isAllIn && amountIncreased > 0));

      if (isGenuineRaise) {
        eventAdaptor.raise({ player, amount, pot: this.pot, street: this.state });
        this.playersActedCount = 0; // Reset to 0, handlePlayerAction will increment to 1
      } else if (amount > 0) {
        eventAdaptor.call({ player, amount, pot: this.pot, street: this.state });
      }
    }
    return raised;
  }

  async handlePlayerAction(player, action) {
    if (this.runoutInProgress) return; // Block actions during runout
    if (this.exited) return;

    // [FIX] Capture state BEFORE action for correct dialogue triggers
    const callAmtBefore = this.potManager.currentRoundBet - player.currentBet;
    const isInitialRaise = (this.currentStreetRaises === 0);

    // console.info('handlePlayerAction', player.name, action)
    // [PROFILING] Faced Flop Bet
    if (this.state === 'FLOP' && this.potManager.currentRoundBet > 0) {
      if (!player.hasFacedFlopBet) {
        // We can record this directly or via eventAdaptor if we add a new event.
        // For now, let's stick to the behavior recording pattern.
        recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.FACED_FLOP_BET);
        player.hasFacedFlopBet = true;
      }
    }

    if (player.isHuman) {
      this.stopTurnTimer();
    }
    // this.mentor
    if (action.type === 'fold') {
      if (player.isMe && this.mentor && this.mentor.isFolded && Math.random() < 0.3) chatAI(this.mentor, CHAT_TRIGGERS.FOLD_FOR_PLAYER, "", 0, this)
      player.isFolded = true;

      eventAdaptor.fold({ player, amount: player.totalWagered, pot: this.pot, board: this.board, street: this.state, players: this.players });
      audioManager.playSFX('card-dealt&fold');
      // this.checkItemTriggers('fold', { phase: this.state }); // Trigger Fold Effects
    } else if (action.type === 'call' || action.type === 'check') {
      const diff = this.potManager.currentRoundBet - player.currentBet;
      this.placeBet(player, diff);
      if (diff > 0) {
        action.type = 'call';
        audioManager.playSFX('puti-n-chip');
        if (player.isMe && this.mentor && this.mentor.isFolded && Math.random() < 0.3) chatAI(this.mentor, CHAT_TRIGGERS.CALL_FOR_PLAYER, "", 0, this);
      } else {
        action.type = 'check';
        audioManager.playSFX('check');
        if (player.isMe && this.mentor && this.mentor.isFolded && Math.random() < 0.3) chatAI(this.mentor, CHAT_TRIGGERS.CHECK_FOR_PLAYER, "", 0, this);
      }

    } else if (action.type === 'raise' || action.type === 'bet' || action.type === 'all_in') {
      const diff = action.amount - player.currentBet;
      const raised = this.placeBet(player, diff);
      // [FIX] Ensure stats exist
      if (player.isMe && this.mentor && this.mentor.isFolded && Math.random() < 0.3) {
        if (action.type === 'all_in') {
          chatAI(this.mentor, CHAT_TRIGGERS.ALL_IN_FOR_PLAYER);
        } else {
          // Compare the diff to the pot before the bet to get a sense of size
          const potRatio = diff / (this.pot > 0 ? this.pot : this.bb);
          if (potRatio <= 0.30) {
            chatAI(this.mentor, CHAT_TRIGGERS.RAISE_SMALL_FOR_PLAYER, "", 0, this);
          } else if (potRatio >= 0.7) {
            chatAI(this.mentor, CHAT_TRIGGERS.RAISE_BIG_FOR_PLAYER, "", 0, this);
          } else {
            chatAI(this.mentor, CHAT_TRIGGERS.RAISE_MEDIUM_FOR_PLAYER, "", 0, this);
          }
        }
      }
      if (action.amount > 0 && player.chips === 0) {
        action.type = 'all_in';
        audioManager.playSFX('all_in');
        if (player.isMe) audioManager.enableTensionMode('reverb');
        setTimeout(() => {
          audioManager.playSFX('all_in-sign');
        }, 1000);
      } else {
        action.type = 'raise'; // Normalize to raise or keep bet
        audioManager.playSFX('puti-n-chip');
      }

      if (raised) {
        this.currentStreetRaises++;
        this.aggressor = player.id;
        if (this.state === 'PREFLOP') {
          this.preflopRaises++;

          // [v5.0] Track 3-Bet Opportunities (Fix 3B% calculation)
          if (this.currentStreetRaises === 1) {
            this.players.forEach(p => {
              if (p.id !== player.id && !p.isFolded && p.chips > 0) {
                if (p.stats.threeBetOppCount === undefined) p.stats.threeBetOppCount = 0;
                p.stats.threeBetOppCount++;
              }
            });
          } else if (this.currentStreetRaises === 2) {
            // Track 4-Bet+ Opportunities
            this.players.forEach(p => {
              if (p.id !== player.id && !p.isFolded && p.chips > 0) {
                if (p.stats.fourBetOppCount === undefined) p.stats.fourBetOppCount = 0;
                p.stats.fourBetOppCount++;
              }
            });
          }
        }
      } else {
        this.aggressor = null;
      }
    }

    // [REQ] Handle BET vs RAISE and CALL vs CHECK for default lastDialogue
    let displayAction = action.type.toLocaleUpperCase();
    if (displayAction === 'CALL' && callAmtBefore === 0) {
      displayAction = 'CHECK';
    } else if (displayAction === 'RAISE' && this.state !== 'PREFLOP' && isInitialRaise) {
      displayAction = 'BET';
    }

    player.lastDialogue = action.dialogue || displayAction + '.';
    player.lastThought = action.insight;
    if (player.dialogueTimeoutId) {
      clearTimeout(player.dialogueTimeoutId);
    }
    player.dialogueTimeoutId = setTimeout(() => {
      player.lastDialogue = null
      player.lastThought = null
      player.dialogueTimeoutId = null
    }, 3000);

    // Record Action
    if (this.currentHandHistory && this.currentHandHistory.actions[this.state]) {
      this.currentHandHistory.actions[this.state].push({
        player: player.name,
        type: action.type,
        amount: action.amount || 0,
        playerChips: player.chips,
        pot: this.pot
      });
    }

    // [v3.0] Populate structured action history for AI engine
    this.actionHistory.push({
      playerId: player.id,
      street: this.state,
      action: action.type,
      amount: action.amount || 0,
      potSize: this.pot
    });

    // [FIX] Do not increment acted count for Folds, because they are removed from activePlayers.
    // Otherwise we double-count (increment numerator AND decrement denominator).
    if (action.type !== 'fold') {
      this.playersActedCount++;
    }

    // Check All-In Condition before moving (in case this action sealed it)
    // await this.checkAllInCondition();
    eventAdaptor.action({
      player,
      type: action.type.toUpperCase(),
      street: this.state,
      amount: action.amount,
      preflopRaises: this.preflopRaises
    });
    if (!this.runoutInProgress) {
      await this.moveToNextPlayer();
      // processTurns is called inside moveToNextPlayer
    }
  }
  async moveToNextPlayer() {
    // Current active players include those with chips OR those who already made a bet this street (all_ins)
    const activePlayers = this.players.filter(p => !p.isFolded && !p.isEliminated);

    // A player is matched if they match the currentRoundBet OR if they are all_in (less than 1 chip)
    const allMatched = activePlayers.every(p => p.currentBet === this.potManager.currentRoundBet || Math.floor(p.chips) === 0);

    // Only wait for players who can actually act (have chips)
    const playersWithChips = activePlayers.filter(p => p.chips > 0);
    const everyoneActed = this.playersActedCount >= playersWithChips.length;

    if (everyoneActed && allMatched) {
      this.currentPlayerIndex = -1; // Ensure no one is "current" during transition
      await this.nextStreet();
      return;
    }

    // Find next eligible player
    let nextIdx = (this.currentPlayerIndex + 1) % this.players.length;
    let attempts = 0;
    while ((this.players[nextIdx].isFolded || this.players[nextIdx].chips <= 0) && attempts < this.players.length) {
      nextIdx = (nextIdx + 1) % this.players.length;
      attempts++;
    }

    // Safety: If everyone is all_in or folded (no one left to act), force next state
    if (attempts >= this.players.length || !playersWithChips.find(p => p.chips >= 1)) {
      console.log('[GAME] Everyone is All-In or Folded. Forcing next street.');
      this.currentPlayerIndex = -1;
      await this.nextStreet();
      return;
    }

    this.currentPlayerIndex = nextIdx;
    this.processTurns(); // This is async but we don't necessarily need to await it here unless we want to block
  }

  async nextStreet() {
    if (this.exited) return;
    this.currentPlayerIndex = -1; // Block actions during transition

    // 1. Return Uncalled Bets (Excess portions of all-in bets)
    const uncalledResult = this.potManager.returnUncalledBets(this.players);
    if (uncalledResult) {
      // 1.1 Record in Hand History
      if (this.currentHandHistory && this.currentHandHistory.actions[this.state]) {
        this.currentHandHistory.actions[this.state].push({
          player: uncalledResult.player.name,
          type: 'uncalled_return',
          amount: uncalledResult.amount,
          playerChips: uncalledResult.player.chips,
          pot: this.potManager.pot
        });
      }
      // 1.2 Record in Action History (for AI/Stats)
      this.actionHistory.push({
        playerId: uncalledResult.player.id,
        street: this.state,
        action: 'uncalled_return',
        amount: uncalledResult.amount,
        potSize: this.potManager.pot
      });

      eventAdaptor.uncalledBetReturned(uncalledResult);
      // Synchronize reactive pot immediate update
      this.pot = this.potManager.pot;
      await sleep(1500); // Visual pause for UI update
    }

    await sleep(1000);
    this.players.forEach(p => p.currentBet = 0);
    this.potManager.currentRoundBet = 0; // Reset for new street
    this.currentStreetRaises = 0;
    this.playersActedCount = 0;
    // this.pressureActive = false; // Reset pressure skill effect each street
    this.players.forEach(p => p.hasFacedFlopBet = false);

    const activePlayers = this.players.filter(p => !p.isFolded && !p.isEliminated);
    if (activePlayers.length === 1) {
      // this.state = 'SHOWDOWN';
      // const currentPot = this.pot; // [FIX] Capture pot before resolution clears it
      // eventAdaptor.winAtWithoutShowdown({ player: activePlayers[0], amount: player.totalWagered, pot: currentPot, board: this.board });
      this.resolveShowdown(true);
      return;
    }
    // Determine next active player (even if they can't bet, strictly speaking we need a pointer, 
    // but if we are auto-running it matters less. We follow standard logic to find first non-folded player left of button)
    let nextIdx = (this.dealerIndex + 1) % this.players.length;
    let attempts = 0;
    while ((this.players[nextIdx].isFolded || this.players[nextIdx].chips <= 0) && attempts < this.players.length) {
      nextIdx = (nextIdx + 1) % this.players.length;
      attempts++;
    }

    // Same safety check for nextStreet to avoid infinite loops there too
    if (attempts >= this.players.length) {
      // If everyone is all_in, we just proceed with the street logic, 
      // processTurns will handle the "no chips" check by skipping or checkAllInCondition will take over.
      // But better to be explicit:
      // Identify who can still act? No one.
      // Just let it proceed to checkAllInCondition.
    }

    this.currentPlayerIndex = nextIdx;
    if (this.state === 'PREFLOP') {
      eventAdaptor.endStreet('PREFLOP');
      eventAdaptor.startStreet('FLOP');
      this.dealFlop();
    } else if (this.state === 'FLOP') {
      eventAdaptor.endStreet('FLOP');
      eventAdaptor.startStreet('TURN');
      this.dealTurn();
    } else if (this.state === 'TURN') {
      eventAdaptor.endStreet('TURN');
      eventAdaptor.startStreet('RIVER');
      this.dealRiver();
    } else if (this.state === 'RIVER') {
      eventAdaptor.endStreet('RIVER');
      this.state = 'SHOWDOWN';
      this.resolveShowdown();
      return;
    }

    // Check for Auto-Runout (All-in situation) handled by checkAllInCondition
    // But we should check at start of street too if players are already all_in 
    // (though handlePlayerAction likely caught it, but maybe not if everyone was all_in pre-deal?)
    await this.checkAllInCondition();

    this.processTurns();
  }

  async resolveShowdown(withoutShowdownEvent = false) {
    // this.runoutInProgress = false; // Reset runout flag
    // Delegate to PotManager
    // [FIX] Check board length for No Flop No Drop instead of state (which is likely SHOWDOWN)
    const currentPot = this.pot; // [FIX] Capture pot before clearing
    const result = this.potManager.resolveShowdown(this.players, this.board, this.board.length === 0);
    this.showdownResults = result;
    this.calculationInProgress = true

    // [FAST_FOLD] Reduce showdown delay if player is folded and setting is ON

    // Finalize History
    if (this.currentHandHistory) {
      const winnerResult = result.results.find(res => res.id === result.winnerId);
      this.currentHandHistory.winner = result.isChop ? `CHOP (${result.choppers.join(', ')})` : result.winnerId;
      this.currentHandHistory.winnerHand = winnerResult ? winnerResult.hand.name : 'Unknown Hand';
      this.currentHandHistory.pot = currentPot;
      this.currentHandHistory.board = [...this.board];
      this.currentHandHistory.detailedPots = result.detailedPots || [];
      this.currentHandHistory.playerResults = result.results || [];
      this.handHistory.unshift(this.currentHandHistory);
      if (this.handHistory.length > 200) this.handHistory.pop(); // Keep last 200 hands
    }

    if (!withoutShowdownEvent) {
      this.state = 'SHOWDOWN';
      eventAdaptor.showdown({ result, pot: currentPot, runoutInProgress: this.runoutInProgress, board: this.board, result })
      eventAdaptor.endStreet('SHOWDOWN');
    } else {
      eventAdaptor.winAtWithoutShowdown({ result, pot: currentPot, runoutInProgress: this.runoutInProgress, board: this.board, result });
    }
    // else eventAdaptor.win({ player: this.players[0], pot: this.pot });
    this.runoutInProgress = false; // Reset runout flag
    window.isFastFowardActive = false; // Rest fast fold flag
    // if (isPlayerWinner) {
    //   eventAdaptor.showdownWin({ winnerResult, pot: this.pot });
    //   if (isAllIn) eventAdaptor.allinWin({ winnerResult, pot: currentPot });
    // } else {
    //   eventAdaptor.showdownLose({ winnerResult, pot: currentPot });
    //   if (isAllIn) eventAdaptor.allinLose({ winnerResult, pot: currentPot });
    // }
    // Human XP Gain (Estimated)


    // [IMPROVEMENT] Calculate and update XP/Level
    // [AI CHAT] Showdown Result

    // Use PotManager's pre-calculated winner data
    const bestWinnersList = result.choppers || [];
    // We still need maxWinAmount to scale the tilt change appropriately.
    let maxWinAmount = 0;
    if (bestWinnersList.length > 0) {
      const bestWinnerResult = result.results.find(r => r.id === bestWinnersList[0]);
      if (bestWinnerResult) maxWinAmount = bestWinnerResult.amountWon;
    }

    if (result.isChop) {
      // It's a true Chop for the main pot
      const mainPot = result.detailedPots?.find(p => p.name.includes('Main Pot'));
      const mainPotWinners = mainPot ? mainPot.winners : [];

      const aiChoppers = this.players.filter(p => !p.isHuman && !p.isFolded && mainPotWinners.includes(p.id));
      if (aiChoppers.length > 0) {
        const chopper = aiChoppers[Math.floor(Math.random() * aiChoppers.length)];
        chatAI(chopper, CHAT_TRIGGERS.CHOP, "", 0, this);
      }
    } else {
      const isHuge = this.pot > (this.bb * 40);
      // Process AI reactions and Tilt (Tilt only changes if they chat)
      if (this.street !== 'PREFLOP') {
        this.players.forEach(p => {
          // Skip Humans, Folded players, and Eliminated players
          if (p.isHuman || p.isFolded || p.isEliminated) return;

          const isBestWinner = bestWinnersList.includes(p.id);
          const chatPercentage = (isHuge ? 0.6 : 0.3) + (p.isDrunken ? 0.3 : 0.0);

          if (Math.random() < chatPercentage) {
            if (isBestWinner) {
              chatAI(p, isHuge ? CHAT_TRIGGERS.WIN_HUGE : CHAT_TRIGGERS.WIN_SMALL, "", 0, this);
              // Decrease tilt based on how much they actually won
              p.tilt = Math.max(0, p.tilt - Math.round(maxWinAmount / this.bb));
            } else {
              chatAI(p, isHuge ? CHAT_TRIGGERS.LOSE_HUGE : CHAT_TRIGGERS.LOSE_SMALL, "", 0, this);
              // Increase tilt based on the total pot they lost out on
              p.tilt = Math.min(100, p.tilt + Math.round(this.pot / this.bb * 0.5));
            }
          }
        });
      }
    }

    // Process Human Player Results (XP, Suspicion)
    const meResults = result.results.filter(r => r.isMe);
    if (meResults.length > 0) {
      const me = meResults[0].player;

      // [FIX] reduce without initial value throws error on single element arrays! Added initial 0.
      const totalAmountWon = meResults.reduce((sum, cur) => sum + cur.amountWon, 0);

      gainXPEstimate(me, totalAmountWon, this.bb, this.isAdvanced, this.locationLV);

      if (this.infamy >= 100 && this.isMonitoring) {
        const suspicionGainBase = (totalAmountWon / this.bb) * (this.infamy === 100 ? 0.4 : 0.2);
        const suspicionGainPenalty = me.born_villain * 0.25;
        gainSuspicion(this.locationId, suspicionGainBase * (1.0 - suspicionGainPenalty));
      }

      // Mentor Tutorial Feedback
      if (this.isTutorial && this.mentor && this.mentor.isFolded && !me.isFolded && Math.random() < 0.3) {
        const meResult = meResults[0];
        const netProfit = meResult.amountWon - me.totalWagered;
        if (netProfit > 0) {
          // Player Profited
          const isHugeWin = netProfit > (this.bb * 20);
          if (Math.random() < 0.5 && this.street !== 'PREFLOP') chatAI(this.mentor, isHugeWin ? CHAT_TRIGGERS.WIN_HUGE_FOR_PLAYER : CHAT_TRIGGERS.WIN_SMALL_FOR_PLAYER, "", 0, this);
        } else if (netProfit < 0) {
          // Player Lost Money (either lost entirely, or chop/side pot refund was less than wagered)
          const isHugeLoss = me.totalWagered > (this.bb * 20);
          if (Math.random() < 0.5 && this.street !== 'PREFLOP') chatAI(this.mentor, isHugeLoss ? CHAT_TRIGGERS.LOSE_HUGE_FOR_PLAYER : CHAT_TRIGGERS.LOSE_SMALL_FOR_PLAYER, "", 0, this);
        } else {
          // Even break (Chop)
          if (Math.random() < 0.5) chatAI(this.mentor, CHAT_TRIGGERS.CHOP, "", 0, this);
        }
      }
    }
    const bestWinner = this.players.find(p => p.id === result.winnerId);
    this.checkBusted(bestWinner);
    this.potManager.pot = 0;
    this.pot = 0; // [FIX] Sync reactive pot immediately
    // Reset interaction flags for next hand
    this.players.forEach(p => {
      p.voluntarilyInteracted = false;
    });
    // this.street = 'ROUND_END';
    eventAdaptor.roundEnd({ players: this.players, bestWinner, street: this.street });
    const sleepTime = (this.showdownResults?.detailedPots?.length || 1) * 4000 + 1000;
    // saveStore();
    await sleep(sleepTime)
    if (this.suspicion >= 40 && this.checkTriggerCasinoInvestigation()) return;
    this.calculationInProgress = false;
    this.startNewHand();
  }

  // --- Reservation Exit Logic ---
  handleReservedExit() {
    console.log('[GAME] Reservation round limit reached. Exiting automatically.');
    this.exitReservationRounds = -1; // Reset
    // eventAdaptor.reservedExitReached();
    // The App.vue or ControlPanel should handle the actual exit sequence if needed, 
    // or we can call exitGame directly if we want to force it here.
    // However, clean exit is usually managed by UI. We will emit a custom event.
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('trigger-cashout'));
    }
  }
  async triggerCasinoInvestigation(players) {
    console.warn('[SECURITY] Casino security investigating player...');
    const partners = players.filter(p => p.isPartner); // partners with you in this table
    let cheatingThreshold = 0;
    const cheatingThresholdMap = {
      [CONTRACT_TYPE.COLLUSION]: 999, // this is obviously cheating!!
      [CONTRACT_TYPE.BENEFIT_SHARE]: 25,
      [CONTRACT_TYPE.BAILOUT]: 10,
      [CONTRACT_TYPE.A_DATE_WITH_YOU]: 5,
    };
    partners.forEach(p => {
      const partnerData = getPartner(p.id);
      const validContracts = partnerData.contracts.filter((c) => c.active);
      cheatingThreshold += validContracts.reduce((total, c) => total + (cheatingThresholdMap[c.type] || 0), 0);
    })
    gainSuspicion(this.locationId, cheatingThreshold); // You will be held liable even if no intentional misconduct occurred
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('trigger-investigation'));
    }
    audioManager.pause();
    await sleep(1500);
    audioManager.playSFX('investigation');
    await sleep(5000 + Math.random() * 2000);
    if (cheatingThreshold > 100) this.triggerCasinoConfiscation(players)
    else {
      window.dispatchEvent(new CustomEvent('trigger-investigation-result'));
    }
  }
  checkTriggerCasinoInvestigation() {
    if (this.suspicion >= 80) {
      this.triggerCasinoInvestigation(this.players);
      return true;
    } else if (Math.random() < this.suspicion * .001) {
      this.triggerCasinoInvestigation(this.players);
      return true;
    }
    return false;
  }
  async triggerCasinoConfiscation(players) {
    audioManager.playSFX('confiscation');
    console.warn('[SECURITY] Casino security confiscating player...');
    players.forEach(p => {
      p.chips = 0
      p.gainedXp = 0
      if (p.isPartner) {
        p.shouldLeave = true;
      }
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('trigger-confiscation'));
    }
    await sleep(6000);
    audioManager.play();
  }

  async checkBusted(bestWinner, isConfiscation = false) {
    // 1. Bankrupt Players
    this.players.forEach((p, index) => {
      if (p.isEliminated === true && !p.isHuman && Math.random() < 0.3) {
        const newPlayer = this.createAIPlayer(p.id);
        if (!newPlayer) return;
        this.players.splice(index, 1, newPlayer);
        p = newPlayer; // update local reference
        console.log(`[GAME] Empty seat filled by ${p.name}`);
        chatAI(p, CHAT_TRIGGERS.GAME_START); // Say hi
      }
      if (p.chips <= 0 && !p.isEliminated) {
        console.log(`[GAME] ${p.name} eliminated.`);

        // Handle Generic Bust Event (Stats, Item Effects)
        eventAdaptor.bust(p, bestWinner, this.locationId, this.inviteId);

        // [AI CHAT] Self Elimination
        if (p.isHuman) {
          const buyInSuccess = this.processBuyIn(p, true);
          if (buyInSuccess) {
            eventAdaptor.rebuy({ player: p, amount: p.chips });
            return true; // Skip elimination
          }
        } else {
          eventAdaptor.bustEnemy(p, bestWinner);
          chatAI(p, CHAT_TRIGGERS.SELF_ELIMINATED);
        }
        p.isEliminated = true;
        if (bestWinner && !bestWinner.isMe) chatAI(bestWinner, CHAT_TRIGGERS.ELIMINATED_ENEMY);
        // Handle Human Bankruptcy
        if (p.isHuman && !this.isConfiscation) { // only popup when you normally lose
          this.gameOver = true;
          audioManager.enableTensionMode();
          this.winnerId = bestWinner ? bestWinner.id : 'cpu';
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('trigger-game-over', { detail: { winnerId: this.winnerId } }));
          }
        }
      }
    });

    // 3. Check for Victory (Only Human Remains)
    const lastSurvior = this.players.filter(p => !p.isEliminated)
    if (lastSurvior.length === 1) {
      if (lastSurvior[0].isMe) {
        this.winnerId = 'player';
        this.gameOver = true;
        this.victoryPrize = gainXPEstimate(lastSurvior[0], this.bb * 100, this.bb, this.isAdvanced, this.locationLV);
        eventAdaptor.gameWon(lastSurvior[0], this.bb * 100, this.locationId, this.inviteId);
        await sleep(3000);
        this.cashOut(true); // end of game
      }
    }
    return false;
  }
  exitGame() {
    this.exited = true;
    audioManager.disableTensionMode();
    eventAdaptor.playerLeaveTable(this.players[0], this.locationId, this.players, this.inviteId);
    this.stopTurnTimer();
    this.state = 'IDLE';
    console.log('[GAME] Engine cleaned up.');
  }
  processBuyIn(player) {
    if (store.bankroll <= 0 || player.buyInLimit <= 0) {
      console.warn(`[BANKROLL] Insufficient funds for buy-in.`);
      player.chips = 0;
      return false;
    }
    const targetBuyIn = this.buyIn * player.buyInMultiply;
    const actualBuyIn = Math.min(store.bankroll, targetBuyIn);
    player.chips = Math.round(actualBuyIn);
    player.totalBuyIn += actualBuyIn;
    player.buyInLimit--;
    gainBankroll(actualBuyIn * -1, TYPE_CHANGE_BANKROLL.GAMBLING);
    console.log(`[BANKROLL] Buy-in deducted: ${actualBuyIn}. Remaining: ${store.bankroll}, ${player.buyInLimit} `);
    return true;
  }

  dealFlop() {
    this.deck.pop();
    this.board.push(this.deck.pop(), this.deck.pop(), this.deck.pop());
    this.state = 'FLOP';
    audioManager.playSFX('card-dealt&fold');
    // this.checkSkillTriggers('flop_start');
    // eventAdaptor.startStreet(this.state); // Moved to nextStreet
  }

  dealTurn() {
    this.deck.pop();
    this.board.push(this.deck.pop());
    this.state = 'TURN';
    audioManager.playSFX('card-dealt&fold');
    // eventAdaptor.startStreet(this.state); // Moved to nextStreet
  }
  dealRiver() {
    this.deck.pop();
    this.board.push(this.deck.pop());
    this.state = 'RIVER';
    audioManager.playSFX('card-dealt&fold');
    // eventAdaptor.startStreet(this.state); // Moved to nextStreet
  }

  // --- All-In Showdown Logic ---

  async checkAllInCondition() {
    if (this.state === 'SHOWDOWN' || this.runoutInProgress || this.gameOver) return;

    const activePlayers = this.players.filter(p => !p.isFolded);
    const playersWithChips = activePlayers.filter(p => p.chips >= 1);
    const allMatched = activePlayers.every(p => p.currentBet === this.potManager.currentRoundBet || p.chips < 1);

    if (activePlayers.length > 1 && playersWithChips.length <= 1 && allMatched) {
      console.log('[GAME] All-In Condition Met. Starting Runout.');

      // Return Uncalled portion BEFORE runout starts
      const uncalledResult = this.potManager.returnUncalledBets(this.players);
      if (uncalledResult) {
        // Record in Hand History
        if (this.currentHandHistory && this.currentHandHistory.actions[this.state]) {
          this.currentHandHistory.actions[this.state].push({
            player: uncalledResult.player.name,
            type: 'uncalled_return',
            amount: uncalledResult.amount,
            playerChips: uncalledResult.player.chips,
            pot: this.potManager.pot
          });
        }
        this.actionHistory.push({
          playerId: uncalledResult.player.id,
          street: this.state,
          action: 'uncalled_return',
          amount: uncalledResult.amount,
          potSize: this.potManager.pot
        });

        eventAdaptor.uncalledBetReturned(uncalledResult);
        this.pot = this.potManager.pot;
        await sleep(1500);
      }

      await this.startAllInShowdown();
    }
  }

  async startAllInShowdown() {
    this.runoutInProgress = true;
    // Reveal Hands (Visually handled by UI checking isFolded/isAllIn, but we can flag it)
    this.players.forEach(p => {
      if (!p.isFolded) {
        // p.isFaceUp = true; // Optional: If UI needs explicit flag
        console.log(`[ALL - IN] Revealing hand for ${p.name}: `, p.hand);
      }
    });

    audioManager.enableTensionMode();
    calculateEquity(this.players, this.board);
    // Notify System/UI
    // EventAdaptor.allInModeActivated(); // If exists
    await this.runNextStep();
  }

  async runNextStep() {
    if (this.checkSkipAction()) return;
    await sleep(1500); // 1.5s delay
    console.log(`[RUNOUT] Step processing... State: ${this.state}`);

    // If we are still in runout mode
    if (!this.runoutInProgress) return;

    if (this.state === 'PREFLOP') {
      eventAdaptor.endStreet(this.state);
      this.dealFlop();
      await this.runNextStep();
    } else if (this.state === 'FLOP') {
      eventAdaptor.endStreet(this.state);
      this.dealTurn();
      await this.runNextStep();
    } else if (this.state === 'TURN') {
      eventAdaptor.endStreet(this.state);
      this.dealRiver();
      await this.runNextStep();
    } else if (this.state === 'RIVER') {
      await sleep(1500); // 1.5s delay
      eventAdaptor.endStreet(this.state);
      this.state = 'SHOWDOWN';
      this.resolveShowdown();
    }
  }

  async cashOut(isForceExit = false) {
    if (!isForceExit) {
      const rounds = this.exitReservationRoundDefault - this.exitReservationRounds;
      if (this.isMonitoring) gainSuspicion(this.locationId, rounds);
      if (this.checkTriggerCasinoInvestigation()) return;
    }

    if (typeof window !== 'undefined') {
      const player = this.players.find(p => p.isMe);
      const netWinnings = (player.chips - player.totalBuyIn);
      recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.NET_WINNING, { amount: netWinnings })
      const winBB = netWinnings / this.bb;
      // infarmy Calc
      let generatedInfamy = winBB * 0.2;
      let baseBoostInfamy = (this.exitReservationRounds === -1 ? 1.0 : 0.5) + player.born_villain + player.infamy_boost;
      if (generatedInfamy > 0) {
        gainInfamy(this.locationId, generatedInfamy * baseBoostInfamy);
      } else gainInfamy(this.locationId, generatedInfamy);
      // game result Calc
      const result = gameResult(winBB);
      store.play_stats_session.msgCode = result
      if (result === GAME_RESULT_CODE.WIN_BIG) gainClearReward(this.locationId);
      if (result.indexOf('WIN') !== -1) {
        gainClearedZoneCount(this.locationId);
      }
      // mission result
      processMissionResult(player, result, this);
      // gain xp and bankroll
      const gainedXP = gainXP(player);
      gainBankroll(player.chips, TYPE_CHANGE_BANKROLL.GAMBLING); // returned chips

      eventAdaptor.cashout(player, { gainedXP, netWinnings, stats: getListPlayStatsSession() });
      const isFlorenceEvent = this.locationId === LOCATION_ID.LOW_UNDERGROUND_CLUB_VIP_ROOM;
      // share collusion
      const partners = this.players.filter(p => p.isPartner);
      partners.forEach(partner => {
        const partnerNetWinnings = partner.chips - partner.initialChips;
        const share = shareCollusion(partner.id, netWinnings, partnerNetWinnings, isFlorenceEvent)
        recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.NET_SHARE, { amount: -share })
        // todo chips calculate to partner.bankroll
      });
      // share benefit
      const share = shareBenefitForPartners(netWinnings);
      recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.NET_SHARE, { amount: -share })
      saveStore();
      window.dispatchEvent(new CustomEvent('trigger-cashout', { detail: { isForceExit } }));
    } else console.warn('[GAME] cashOut failed');
  }

  async processTurns() {
    if (this.checkSkipAction() || this.runoutInProgress) return;
    const activePlayers = this.players.filter(p => !p.isFolded && !p.isEliminated);
    if (activePlayers.length === 1) {
      this.resolveShowdown(true);
      return;
    }

    const player = this.players[this.currentPlayerIndex];
    if (!player) return;

    if (player.isFolded || player.isEliminated) {
      this.moveToNextPlayer();
      return;
    }

    if (player.isHuman) {
      // Human turn: Waiting for UI input
      console.log(`[TURN] Waiting for Human Input...`);
      this.startTurnTimer(player);
      return;
    }
    player.lastDialogue = null
    player.lastThought = null
    // AI Turn
    // [PHASE 3] Timing Tells
    // We get the action first to determine the delay (Thinking Time/Hollywooding)
    let action;
    const isAdvanced = (player.class && player.class.isBoss);
    if (isAdvanced) {
      action = getAdvancedAIAction(player, this);
    } else {
      action = getAIAction(player, this);
    }

    const delay = (action.delay || (1000 + Math.random() * 1000)) * (window.isFastFowardActive ? 0.2 : 1);
    console.log(`[AI TURN] ${player.name} thinking for ${Math.floor(delay)}ms...${window.isFastFowardActive ? ' (FAST_FOLD)' : ''}`);
    // await sleep(delay); // Removed redundant sleep. Timer loop handles delay.
    // Safety check if state changed during delay

    // Simulate Time Bank Drain
    player.timeBankRemaining = player.maxTimeBank || 15; // Reset for visualization
    const step = 100;
    let elapsed = 0;
    // Animate the delay
    while (elapsed < delay) {
      if (this.checkSkipAction() || this.runoutInProgress) break;
      await sleep(step);
      elapsed += step;
      player.timeBankRemaining = Math.max(0, player.timeBankRemaining - (step / 1000));
    }
    if (this.checkSkipAction() || this.runoutInProgress) return;
    await this.handlePlayerAction(player, action);

  }
  checkSkipAction() {
    return this.gameOver || this.state === 'SHOWDOWN' || this.exited
  }
  // --- Timebank System ---

  startTurnTimer(player) {
    this.stopTurnTimer(); // Clear existing

    player.timeBankRemaining = player.maxTimeBank;

    this.turnTimer = setInterval(() => {
      if (this.gameOver || this.state === 'SHOWDOWN') {
        this.stopTurnTimer();
        return;
      }

      player.timeBankRemaining -= 0.1;

      if (player.timeBankRemaining <= 0) {
        this.handleTimeout(player);
      }
    }, 100);
  }

  stopTurnTimer(player) {
    if (this.turnTimer) {
      clearInterval(this.turnTimer);
      this.turnTimer = null;
    }
  }

  handleTimeout(player) {
    this.stopTurnTimer();
    console.log(`[TIMER] Timeout for ${player.name}!`);

    // Auto-Action: Check if possible, otherwise Fold
    const currentBet = this.potManager.currentRoundBet;
    if (player.currentBet >= currentBet) {
      // Can Check
      this.handlePlayerAction(player, { type: 'check' });
    } else {
      // Must Fold
      this.handlePlayerAction(player, { type: 'fold' });
    }
  }

  // cleanup() {
  //   this.stopTurnTimer();
  //   audioManager.disableTensionMode();
  //   // this.gameOver = true;
  //   this.state = 'IDLE';
  //   this = null;
  //   // this.players = []; // [FIX] Don't wipe players yet to prevent UI crashes during transition
  //   console.log('[GAME] Engine cleaned up.');
  // }
}

