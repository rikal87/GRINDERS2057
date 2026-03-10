import { calculateEquity, createDeck } from './poker.js';
import { getAIAction, chatAI, } from './aiEngine.js';
import { getAdvancedAIAction } from './aiEngineAdvanced.js';
import { CLASSES_PARTNER } from './persona.js'
import { audioManager } from './audioManager.js';
import { PotManager } from './PotManager.js';
import { EventAdaptor } from './gameEngineEventAdaptor.js';
import { getPartner, getJoinedPartners } from './partnerSystem.js';
import { gainXPEstimate, store, saveStore, gainBankroll, gainSuspicion, getCurrentSuspicion, getCurrentInfamy } from './store.js';
import { LOCATION_ID, CONTRACT_TYPE, CHAT_TRIGGERS, TYPE_CHANGE_BANKROLL } from './constants.js'
import { CLASSES, CLASSES_ENEMY, CLASSES_ENEMY_BOSS } from './persona.js';
import { zones } from './zone.js';
import { recordPlayStatsSession, PLAY_RECORD_STATS_TYPE } from './playRecordStats.js';

const eventAdaptor = new EventAdaptor();
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export class GameEngine {
  constructor(playerClass = 'VANGUARD', tableSize = 2, sb = 1, bb = 2, buyin = 1000, rake = 0.05, rakeCap = 50, isAdvanced = false, locationId = 'micro_street_shop', locationLV = 1, buyInLimit = 999999, inviteId = null) {
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
    this.players = this.initializePlayers(playerClass, tableSize); // [FIX] Initialize players after all properties are set
    // this.partners = [];
  }

  // Getter for backward compatibility / easier access
  // get pot() { return this.potManager.pot; } // Removed for direct property access
  get currentRoundBet() { return this.potManager.currentRoundBet; }

  initializePlayers(humanClass, size) {
    const players = [];
    const YOU = {
      id: 'player',
      name: 'YOU',
      class: CLASSES[humanClass],
      hand: [],
      chips: Math.floor(this.buyIn * this.buyInMultiply), // Will be validated against bankroll in constructor or UI
      currentBet: 0,
      totalWagered: 0,
      isFolded: false,
      isHuman: true,
      isMe: true,
      // buyInMultiply: 1, // [FIX] Default multiplier for human
      gainedXp: 0,
      effectCooldowns: {},
      item: store.equippedProtector,
      tempXPBonus: 0.0,
      buyInLimit: this.buyInLimit,
      totalBuyIn: 0,
      stats: {
        handsPlayed: 0,
        vPIPCount: 0,
        pfrCount: 0,
        threeBetCount: 0,
        facedFlopBet: 0,
        foldedToFlopBet: 0,
        aggressiveActions: 0, // Bet + Raise
        calls: 0,
        get vPIP() { return this.handsPlayed > 0 ? (this.vPIPCount / this.handsPlayed) * 100 : 0; },
        get pfr() { return this.handsPlayed > 0 ? (this.pfrCount / this.handsPlayed) * 100 : 0; },
        get threeBet() { return this.handsPlayed > 0 ? (this.threeBetCount / this.handsPlayed) * 100 : 0; },
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
      get infamy_boost() {
        if (!this.item || !this.item.effects) return 0;
        const bonus = this.item.effects.reduce((sum, e) => (e.id === 'infamy_boost') ? sum + e.value : sum, 0);
        return bonus;
      },
      get born_villain() {
        if (!this.item || !this.item.effects) return 0;
        const bonus = this.item.effects.reduce((sum, e) => (e.id === 'born_villain') ? sum + e.value : sum, 0);
        return bonus;
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

      timeBankRemaining: 10, // Initial value
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
    const allowedNames = locationConfig.npcs;

    // Some tasks might allow spawning an enemy even if it's not strictly allowed by the zone.
    // For now we'll allow forced spawns to override loc allowedNames
    console.log('this.buyInLimit', this.buyInLimit);
    let enemiesToPlace = [];
    // 0. partners Spawns (Top Priority from zone.js config)
    const joinedPartners = getJoinedPartners();
    joinedPartners.forEach(partner => {
      const validContract = partner.contracts.find(contract => contract.type === CONTRACT_TYPE.COLLUSION && contract.active);
      const template = CLASSES_PARTNER.find(e => e.id === partner.id)
      if (template && validContract) {
        enemiesToPlace.push({ ...template });
      } else {
        console.warn(`[GAME] Partner ${partner.name} is not with you`);
      }
    });

    // 1. Guests Spawns (Top Priority from zone.js config)
    if (locationConfig.guests && Array.isArray(locationConfig.guests)) {
      locationConfig.guests.forEach(guestName => {
        if (enemiesToPlace.length >= size - 1) return;
        const targetId = guestName.toLowerCase();
        const template = [...CLASSES_ENEMY, ...CLASSES_PARTNER].find(e => e.name.toLowerCase() === targetId)
        if (template) {
          enemiesToPlace.push({ ...template });
          setTimeout(() => {
            chatAI(template, CHAT_TRIGGERS.GAME_START);
          }, 2000);
        } else {
          console.warn(`[GAME] Companion persona '${guestName}' not found in CLASSES.`);
        }
      });
    }
    // 2. Forced Spawns (Boosts)
    const bossPool = [...CLASSES_ENEMY_BOSS].filter(p => p.isBoss).sort(() => Math.random() - 0.5);

    spawnBoosts.forEach(eff => {
      // Find the enemy template
      // Match case-insensitively due to ID mismatch (e.g. 'shark' vs 'Shark')
      const targetId = eff.id.toLowerCase();
      let template = null;
      if (targetId === 'named_pro') {
        // Pop boss if available
        if (bossPool.length > 0) template = bossPool.pop();
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
    const availableEnemies = CLASSES_ENEMY.filter(enemy => enemy.name !== 'Named_Pro' && allowedNames.includes(enemy.name));

    // Prepare weights based on multiply boosts
    const weightMap = {};
    availableEnemies.forEach(env => {
      weightMap[env.name.toLowerCase()] = 1.0;
    });

    spawnMultBoosts.forEach(eff => {
      const targetId = eff.id.toLowerCase();
      if (weightMap[targetId] !== undefined) {
        weightMap[targetId] *= eff.amount;
      }
    });

    // Helper to pick randomly based on weights
    const getWeightedRandomEnemy = () => {
      // Add Named_Pro logic (random chance if allowed)
      if (allowedNames.includes('Named_Pro') && Math.random() < 0.1 && bossPool.length > 0) {
        return bossPool.pop();
      }

      const totalWeight = availableEnemies.reduce((sum, en) => sum + weightMap[en.name.toLowerCase()], 0);
      let rand = Math.random() * totalWeight;
      for (const en of availableEnemies) {
        rand -= weightMap[en.name.toLowerCase()];
        if (rand <= 0) return { ...en };
      }
      return { ...availableEnemies[0] }; // Fallback
    };

    while (enemiesToPlace.length < size - 1) {
      enemiesToPlace.push(getWeightedRandomEnemy());
    }

    // Optional: Shuffle enemiesToPlace so forced spawns aren't always seated right next to YOU
    enemiesToPlace = enemiesToPlace.sort(() => Math.random() - 0.5);

    // --- Apply Infamy Modifications to NPC Template base on Zone ---
    // const currentZoneData = store.status_zone[this.locationId] || { infamy: 0, suspicion: 0 };
    this.infamy = getCurrentInfamy(this.locationId);
    this.suspicion = getCurrentSuspicion(this.locationId);
    for (let i = 0; i < enemiesToPlace.length; i++) {
      let villanTemplate = enemiesToPlace[i];
      // Clone the template so we don't mutate the base CLASSES_ENEMY object directly
      let villan = { ...villanTemplate };

      // Apply Infamy Modifiers
      if (this.infamy >= 60) {
        villan.chipMultiply = (villan.chipMultiply || 1) * 1.5;
        villan.isAdvanced = true;
      }

      if (this.infamy >= 40) {
        villan.vPIP_modifier = (villan.vPIP_modifier || 1) * 0.7;
        villan.WTSD_modifier = (villan.WTSD_modifier || 1) * 1.3;
      }

      if (this.infamy >= 20) {
        // NPC AF = ((3 - {NPC 초기 AF} ) * 0.5) + {NPC 초기 AF} 로 보정.
        const baseAF = villan.af || 1.0;
        villan.af_modifier = ((3 - baseAF) * 0.5) + baseAF;
      }
      const chips = this.buyIn * villan.chipMultiply
      const aiPlayer = {
        id: villan.isPartner ? villan.id : `cpu_${i + 1}`,
        name: `${villan.name}`,
        tempXPBonus: 0,
        class: villan,
        hand: [],
        chips: chips,
        initialChips: chips,
        currentBet: 0,
        totalWagered: 0,
        isFolded: false,
        isHuman: false,
        isPartner: villan.isPartner || false,
        isBoss: villan.isBoss || false,
        item: null,
        // Helper methods for skills
        maxTimeBank: 15, // Default 30s for AI
        timeBankRemaining: 15,
        stats: {
          handsPlayed: 0,
          vPIPCount: 0,
          pfrCount: 0,
          threeBetCount: 0,
          facedFlopBet: 0,
          foldedToFlopBet: 0,
          aggressiveActions: 0, // Bet + Raise
          calls: 0,
          get vPIP() { return this.handsPlayed > 0 ? (this.vPIPCount / this.handsPlayed) * 100 : 0; },
          get pfr() { return this.handsPlayed > 0 ? (this.pfrCount / this.handsPlayed) * 100 : 0; },
          get threeBet() { return this.handsPlayed > 0 ? (this.threeBetCount / this.handsPlayed) * 100 : 0; },
          get foldToFlop() { return this.facedFlopBet > 0 ? (this.foldedToFlopBet / this.facedFlopBet) * 100 : 0; },
          get aggressionFactor() { return this.calls > 0 ? this.aggressiveActions / this.calls : (this.aggressiveActions > 0 ? 10 : 0); } // Infinite if no calls but has raises
        },
      };

      if (Math.random() < 0.3) chatAI(aiPlayer, CHAT_TRIGGERS.GAME_START)
      players.push(aiPlayer);
    }
    if (this.isTutorial) {
      this.mentor = players.find(e => e.name === 'Max(Mentor)');
      console.log('MENTOR', this.mentor);
    }
    return players;
  }

  async startNewHand() {
    audioManager.disableTensionMode();
    this.deck = createDeck();
    this.board = [];
    this.potManager.resetHand();
    this.playersActedCount = 0;
    this.preflopRaises = 0;
    this.currentStreetRaises = 0; // [FIX] Reset raises for new hand
    this.aggressor = null;

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
      recordPlayStatsSession(p, PLAY_RECORD_STATS_TYPE.HANDS_PLAYED);
    });
    this.calculationInProgress = false;
    // Check Trigger: PREFLOP start (or Round Start)
    // this.checkSkillTriggers('round_start');
    // this.checkSkillTriggers('preflop_start');

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
    if (!isBlind && amount > 0) {
      player.voluntarilyInteracted = true;
    }

    // Check if player's action is mathematically a raise or a call based on the pot/bet
    // If not a blind, and the amount placed raises the current round bet, it's a raise
    if (!isBlind) {
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
    if (this.state === 'IDLE') return;
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
      if (player.isMe && this.mentor && this.mentor.isFolded && Math.random() < 0.3) chatAI(this.mentor, CHAT_TRIGGERS.FOLD_FOR_PLAYER)
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
        if (player.isMe && this.mentor && this.mentor.isFolded && Math.random() < 0.3) chatAI(this.mentor, CHAT_TRIGGERS.CALL_FOR_PLAYER);
      } else {
        action.type = 'check';
        audioManager.playSFX('check');
        if (player.isMe && this.mentor && this.mentor.isFolded && Math.random() < 0.3) chatAI(this.mentor, CHAT_TRIGGERS.CHECK_FOR_PLAYER);
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
            chatAI(this.mentor, CHAT_TRIGGERS.RAISE_SMALL_FOR_PLAYER);
          } else if (potRatio >= 0.7) {
            chatAI(this.mentor, CHAT_TRIGGERS.RAISE_BIG_FOR_PLAYER);
          } else {
            chatAI(this.mentor, CHAT_TRIGGERS.RAISE_MEDIUM_FOR_PLAYER);
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
        }
      } else {
        this.aggressor = null;
      }
    }
    player.lastDialogue = action.dialogue || action.type.toLocaleUpperCase() + '.';
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
    if (this.state === 'IDLE') return;
    this.currentPlayerIndex = -1; // Block actions during sleep
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
    // this.state = 'ROUND_END';
    // Finalize History
    if (this.currentHandHistory) {
      const winnerResult = result.results.find(res => res.id === result.winnerId);
      this.currentHandHistory.winner = result.winnerId;
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

    // if (isPlayerWinner) {
    //   eventAdaptor.showdownWin({ winnerResult, pot: this.pot });
    //   if (isAllIn) eventAdaptor.allinWin({ winnerResult, pot: currentPot });
    // } else {
    //   eventAdaptor.showdownLose({ winnerResult, pot: currentPot });
    //   if (isAllIn) eventAdaptor.allinLose({ winnerResult, pot: currentPot });
    // }
    // Human XP Gain (Estimated)
    const meResult = result.results.find(r => r.isMe);
    const me = this.players.find(p => p.isMe);
    // [IMPROVEMENT] Calculate and update XP/Level
    // [AI CHAT] Showdown Result
    const winners = result.results.filter(r => r.isWinner);
    if (winners.length > 1 && winners.some(w => w.amountWon === winners[0].amountWon)) {
      // It's a true Chop if multiple people won similar amounts from the same pot
      const aiChoppers = this.players.filter(p => !p.isHuman && !p.isFolded && winners.some(w => w.id === p.id));
      if (aiChoppers.length > 0) {
        const chopper = aiChoppers[Math.floor(Math.random() * aiChoppers.length)];
        chatAI(chopper, CHAT_TRIGGERS.CHOP);
      }
    } else {
      // AI Bragging if they won
      const aiWinners = winners.filter(w => !w.isMe);
      if (aiWinners.length > 0) {
        const primaryAiWinner = this.players.find(p => p.id === aiWinners[0].id);
        if (primaryAiWinner) {
          const isHuge = this.pot > (this.bb * 40);
          chatAI(primaryAiWinner, isHuge ? CHAT_TRIGGERS.WIN_HUGE : CHAT_TRIGGERS.WIN_SMALL);
        }
      }

      // AI Complaining if Human won the main pot
      const meWinner = winners.find(w => w.isMe);
      if (meWinner && meWinner.amountWon > meWinner.player.totalWagered) {
        const losers = this.players.filter(p => !p.isHuman && !p.isFolded && !p.isMe);
        if (losers.length > 0 && Math.random() < 0.5) {
          const complainer = losers[Math.floor(Math.random() * losers.length)];
          const isHuge = this.pot > (this.bb * 40);
          chatAI(complainer, isHuge ? CHAT_TRIGGERS.LOSE_HUGE : CHAT_TRIGGERS.LOSE_SMALL);

          // [FIX] Infamy and suspicion system
          if (this.infamy >= 80) {
            const suspicionGainBase = this.pot / this.bb * (this.infamy === 100 ? 0.4 : 0.2);
            const suspicionGainBoost = 1.0;
            const suspicionGainPenalty = me.born_villain * 0.25;
            gainSuspicion(this.locationId, suspicionGainBase * (suspicionGainBoost - suspicionGainPenalty));
          }
        }
      }
    }

    if (meResult && meResult.isWinner) {
      eventAdaptor.gainXP({ player: me });
      gainXPEstimate(me, meResult.amountWon, this.bb, this.isAdvanced, this.locationLV);
    }

    // Mentor Tutorial Feedback
    if (this.isTutorial && this.mentor && this.mentor.isFolded && me && !me.isFolded && Math.random() < 0.3) {
      const netProfit = (meResult ? meResult.amountWon : 0) - me.totalWagered;
      if (netProfit > 0) {
        // Player Profited
        const isHugeWin = netProfit > (this.bb * 20);
        if (Math.random() < 0.5) chatAI(this.mentor, isHugeWin ? CHAT_TRIGGERS.WIN_HUGE_FOR_PLAYER : CHAT_TRIGGERS.WIN_SMALL_FOR_PLAYER);
      } else if (netProfit < 0) {
        // Player Lost Money (either lost entirely, or chop/side pot refund was less than wagered)
        const isHugeLoss = me.totalWagered > (this.bb * 20);
        if (Math.random() < 0.5) chatAI(this.mentor, isHugeLoss ? CHAT_TRIGGERS.LOSE_HUGE_FOR_PLAYER : CHAT_TRIGGERS.LOSE_SMALL_FOR_PLAYER);
      } else {
        // Even break (Chop)
        if (Math.random() < 0.5) chatAI(this.mentor, CHAT_TRIGGERS.CHOP);
      }
    }
    const bestWinner = this.players.find(p => p.id === result.winnerId);
    this.checkBankruptcy(bestWinner);
    this.potManager.pot = 0;
    this.pot = 0; // [FIX] Sync reactive pot immediately

    // Reset interaction flags for next hand
    this.players.forEach(p => {
      p.voluntarilyInteracted = false;
    });

    eventAdaptor.roundEnd(this.players, 'ROUND_END');
    const sleepTime = (this.showdownResults?.detailedPots?.length || 1) * 4000 + 1000
    await sleep(sleepTime)
    saveStore();
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
      [CONTRACT_TYPE.SHARE_BENEFIT]: 25,
      [CONTRACT_TYPE.BANKRUPT_RESCUE]: 10,
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
      // audioManager.play(); this.handleReservedExit();
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
    await sleep(5000);
    audioManager.play();
  }

  checkBankruptcy(bestWinner, isConfiscation = false) {
    // 1. Bankrupt Players
    this.players.forEach(p => {
      if (p.chips <= 0 && !p.isEliminated) {
        console.log(`[GAME] ${p.name} eliminated.`);

        // [AI CHAT] Self Elimination
        if (p.isHuman) {
          const buyInSuccess = this.processBuyIn(p, true);
          if (buyInSuccess) {
            eventAdaptor.rebuy({ player: p, amount: p.chips });
            return true; // Skip elimination
          }
        } else {
          chatAI(p, CHAT_TRIGGERS.SELF_ELIMINATED);
        }

        p.isEliminated = true;
        if (bestWinner && !bestWinner.isMe) chatAI(bestWinner, CHAT_TRIGGERS.ELIMINATED_ENEMY);
        // Handle Human Bankruptcy
        if (p.isHuman && !this.isConfiscation) { // only popup when you normally lose
          this.gameOver = true;
          this.winnerId = bestWinner ? bestWinner.id : 'cpu';
          // this.state = 'IDLE';
        }
        eventAdaptor.playerBankrupt(p, bestWinner, this.locationId, this.inviteId);
      }
    });

    // 3. Check for Victory (Only Human Remains)
    const lastSurvior = this.players.filter(p => !p.isEliminated)
    if (lastSurvior.length === 1 && lastSurvior[0].isMe) {
      console.log('[GAME] Victory! You are the last survivor.');
      this.winnerId = 'player';
      this.gameOver = true;
      this.victoryPrize = gainXPEstimate(lastSurvior[0], this.bb * 100, this.bb, this.isAdvanced, this.locationLV);
      console.log(`[GAME] Victory Prize Awarded: ${this.bb * 100} `);
      eventAdaptor.gameWon(lastSurvior[0], this.bb * 100, this.locationId, this.inviteId);
      this.cashOut(true);
    }

    return false;
  }
  exitGame() {
    eventAdaptor.playerLeaveTable(this.players[0], this.locationId, this.players, this.inviteId);
    this.cleanup();
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
      gainSuspicion(this.locationId, rounds);
      if (this.checkTriggerCasinoInvestigation()) return;
    }

    if (typeof window !== 'undefined') {
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
    const delay = action.delay || (1000 + Math.random() * 1000); // Fallback
    console.log(`[AI TURN] ${player.name} thinking for ${Math.floor(delay)}ms...`);
    // await sleep(delay); // Removed redundant sleep. Timer loop handles delay.
    // Safety check if state changed during delay

    // Simulate Time Bank Drain
    player.timeBankRemaining = player.maxTimeBank || 30; // Reset for visualization
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
    return this.gameOver || this.state === 'SHOWDOWN' || this.state === 'IDLE'
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

  cleanup() {
    this.stopTurnTimer();
    audioManager.disableTensionMode();
    this.gameOver = true;
    this.state = 'IDLE';
    this.players = [];
    console.log('[GAME] Engine cleaned up.');
  }
}

