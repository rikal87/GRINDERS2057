import { calculateEquity, createDeck } from './poker.js';
import { getAIAction, chatAI, } from './aiEngine.js';
import { getAdvancedAIAction } from './aiEngineAdvanced.js';
// import { CHAT_TRIGGERS } from './AIChatSystem.js';
import { CHAT_TRIGGERS, CLASSES_COMPANION } from './persona.js'
import { audioManager } from './audioManager.js';
import { PotManager } from './PotManager.js';
import { EventAdaptor } from './gameEngineEventAdaptor.js';
import { gainXP, initializeBankroll, store, saveStore } from './store.js';
import { CLASSES, CLASSES_ENEMY, CLASSES_ENEMY_BOSS } from './persona.js';
import { zones } from './zone.js';

const eventAdaptor = new EventAdaptor();
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export class GameEngine {
  constructor(playerClass = 'VANGUARD', tableSize = 2, sb = 1, bb = 2, buyin = 1000, rake = 0.05, rakeCap = 50, isHighStakes = false, locationId = 'micro_street_shop', locationLV = 1, buyInLimit = 999999, inviteId = null) {
    this.locationId = locationId;
    this.tableSize = tableSize;
    this.sb = sb;
    this.bb = bb;
    this.isHighStakes = isHighStakes;
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
    this.winnerId = null;
    this.playersActedCount = 0;
    this.runoutInProgress = false;
    this.pressureActive = false;
    this.victoryPrize = 0;
    this.lastTriggeredItem = null; // Visual feedback
    // NEW: Delegate money logic
    this.potManager = new PotManager(this.rake, this.rakeCap);
    this.handHistory = [];
    this.currentHandHistory = null;
    this.processingAI = false;
    this.locationLV = locationLV;
    // store.bankroll -= this.buyIn; // Deduct from bankroll
    this.turnTimer = null;
    this.currentStreetRaises = 0;
    this.pot = 0; // [FIX] Reactive property for instant updates
    this.preflopAggressor = null; // Track who raised preflop for C-Bet logic
    this.buyInLimit = buyInLimit; // only for human?
    this.inviteId = inviteId;
    this.players = this.initializePlayers(playerClass, tableSize); // [FIX] Initialize players after all properties are set
    // this.companions = [];
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
      chips: this.buyIn * this.buyInMultiply, // Will be validated against bankroll in constructor or UI
      currentBet: 0,
      totalWagered: 0,
      ram: { used: 0, reserved: 0 },
      isFolded: false,
      isHuman: true,
      isMe: true,
      // buyInMultiply: 1, // [FIX] Default multiplier for human
      gainedXp: 0,
      effectCooldowns: {},
      item: store.equippedProtector,
      tempXPBonus: 0.0,
      buyInLimit: this.buyInLimit,
      stats: {
        handsPlayed: 0,
        vPIPCount: 0,
        facedFlopBet: 0,
        foldedToFlopBet: 0,
        aggressiveActions: 0, // Bet + Raise
        calls: 0,
        get vPIP() { return this.handsPlayed > 0 ? this.vPIPCount / this.handsPlayed : 0; },
        get foldToFlop() { return this.facedFlopBet > 0 ? this.foldedToFlopBet / this.facedFlopBet : 0; },
        get aggressionFactor() { return this.calls > 0 ? this.aggressiveActions / this.calls : (this.aggressiveActions > 0 ? 10 : 0); } // Infinite if no calls but has raises
      },
      get canReadSynapses() {
        if (!this.item || !this.item.effects) return false;
        // Fix: Find the effect object first, then check isActivated
        const effect = this.item.effects.find(e => e.id === 'synapse_reading');
        return effect ? effect.isActivated : false;
      },
      get chipRounding() {
        if (!this.item || !this.item.effects) return 1;
        const bonus = this.item.effects.reduce((sum, e) => (e.id === 'chip_rounding') ? sum + e.value : sum, 0);
        return Math.pow(10, bonus);
      },
      // get bonusXpToGoldRatio() {
      // if (!this.item || !this.item.effects) return 0;
      // const transGoldToXpRatio = this.item.effects.reduce((sum, e) => (e.id === 'golden_touch') ? sum + e.value : sum, 0);
      // return Math.min(1, transGoldToXpRatio);
      // },

      get maxTimeBank() {
        const base = 30; // Default 30 seconds
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

      timeBankRemaining: 30, // Initial value
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
    if (this.locationId === 'micro_warehouse_with_max' || this.locationId === 'free_street_shop_with_max') {
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

    let enemiesToPlace = [];
    // 0. Companions Spawns (Top Priority from zone.js config)
    if (locationConfig.companions && Array.isArray(locationConfig.companions)) {
      locationConfig.companions.forEach(companionName => {
        if (enemiesToPlace.length >= size - 1) return;
        const targetId = companionName.toLowerCase();
        let template = CLASSES_COMPANION.find(e => e.name.toLowerCase() === targetId)
        if (template) {
          enemiesToPlace.push({ ...template });
          chatAI(template, CHAT_TRIGGERS.GAME_START);
        } else {
          console.warn(`[GAME] Companion persona '${companionName}' not found in CLASSES.`);
        }
      });
    }
    // 1. Forced Spawns (Boosts)
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

    // 2. Weighted Random Spawns for remainders
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
      if (allowedNames.includes('Named_Pro') && Math.random() < 0.5 && bossPool.length > 0) {
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

    for (let i = 0; i < enemiesToPlace.length; i++) {
      let villan = enemiesToPlace[i];
      const aiPlayer = {
        id: `cpu_${i + 1}`,
        name: `${villan.name}`,
        tempXPBonus: 0,
        class: villan,
        hand: [],
        chips: this.buyIn * villan.chipMultiply,
        currentBet: 0,
        totalWagered: 0,
        isFolded: false,
        isHuman: false,
        isCompanion: villan.isCompanion || false,
        isBoss: villan.isBoss || false,
        item: null,
        // Helper methods for skills
        maxTimeBank: 30, // Default 30s for AI
        timeBankRemaining: 30,
        stats: {
          handsPlayed: 0,
          vPIPCount: 0,
          facedFlopBet: 0,
          foldedToFlopBet: 0,
          aggressiveActions: 0, // Bet + Raise
          calls: 0,
          get vPIP() { return this.handsPlayed > 0 ? this.vPIPCount / this.handsPlayed : 0; },
          get foldToFlop() { return this.facedFlopBet > 0 ? this.foldedToFlopBet / this.facedFlopBet : 0; },
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
    this.currentStreetRaises = 0; // [FIX] Reset raises for new hand
    this.preflopAggressor = null;
    this.players.forEach(p => {
      p.hand = [this.deck.pop(), this.deck.pop()];
      p.isFolded = p.chips <= 0; // Out of game if no chips
      p.currentBet = 0;
      p.totalWagered = 0;
      p.isBlind = false; // Reset blind status
      if (p.stats) p.stats.handsPlayed++;
    });

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

    this.placeBet(this.players[sbIndex], this.sb, true);
    this.players[sbIndex].isBlind = true;

    this.placeBet(this.players[bbIndex], this.bb, true);
    this.players[bbIndex].isBlind = true;

    this.currentPlayerIndex = firstToActIndex;
    this.state = 'PREFLOP';
    eventAdaptor.startStreet('PREFLOP');

    this.processTurns();
  }

  placeBet(player, amount, isBlind) {
    const raised = this.potManager.placeBet(player, amount);
    this.pot = this.potManager.pot; // [FIX] Sync reactive pot immediately
    if (!isBlind && amount > 0) {
      player.voluntarilyInteracted = true;
    }
    if (raised && !isBlind) {
      // If someone raises, others need a chance to respond
      eventAdaptor.bet({ player, amount, pot: this.pot, street: this.state });
      this.playersActedCount = 0; // Reset to 0, handlePlayerAction will increment to 1
    }
    return raised;
  }

  async handlePlayerAction(player, action) {
    if (this.runoutInProgress) return; // Block actions during runout
    if (this.state === 'IDLE') return;
    // console.info('handlePlayerAction', player.name, action)
    // [PROFILING] Faced Flop Bet
    // If Human acts on FLOP and there is a bet to call (>0), they faced a bet.
    // Ensure we count only once per street?
    // Let's use a flag on current hand or just increment.
    // If they Call/Raise/Fold, they faced it.
    // Limitation: If they check-raise, they technically faced a bet if they called a bet before? No.
    // If currentRoundBet > 0.
    if (player.isHuman && this.state === 'FLOP' && this.potManager.currentRoundBet > 0) {
      // Check if we already counted this street?
      // For simplicity, let's just count every action facing a bet as an "instance".
      // Or better: flags.
      if (!player.hasFacedFlopBet) {
        player.stats.facedFlopBet++;
        player.hasFacedFlopBet = true;
      }
    }

    if (player.isHuman) {
      this.stopTurnTimer();
    }
    // this.mentor
    if (action.type === 'fold') {
      if (player.isMe && this.mentor && this.mentor.isFolded) chatAI(this.mentor, CHAT_TRIGGERS.FOLD_FOR_PLAYER)
      player.isFolded = true;

      // [PROFILING] Fold to Flop Bet
      if (player.isHuman && this.state === 'FLOP' && this.potManager.currentRoundBet > 0) {
        player.stats.foldedToFlopBet++;
      }

      eventAdaptor.fold({ player, amount: player.totalWagered, pot: this.pot, board: this.board, street: this.state });
      audioManager.playSFX('card-dealt&fold');
      const activePlayers = this.players.filter(p => !p.isFolded);
      if (activePlayers.length === 1) {
        this.state = 'SHOWDOWN';
        const currentPot = this.pot; // [FIX] Capture pot before resolution clears it
        eventAdaptor.winAtWithoutShowdown({ player: activePlayers[0], amount: player.totalWagered, pot: currentPot, board: this.board });
        this.resolveShowdown(true);
        return;
      }
      // this.checkItemTriggers('fold', { phase: this.state }); // Trigger Fold Effects
    } else if (action.type === 'call' || action.type === 'check') {
      const diff = this.potManager.currentRoundBet - player.currentBet;
      this.placeBet(player, diff);
      if (!player.stats) player.stats = { calls: 0, aggressiveActions: 0, handsPlayed: 0, vPIPCount: 0, facedFlopBet: 0, foldedToFlopBet: 0 };
      if (player.stats.calls === undefined) player.stats.calls = 0;

      if (diff > 0) {
        player.stats.calls++; // [STATS] Track Call only if chips added
        audioManager.playSFX('puti-n-chip');
        if (player.isMe && this.mentor && this.mentor.isFolded) chatAI(this.mentor, CHAT_TRIGGERS.CALL_FOR_PLAYER)
      } else {
        action.type = 'check';
        audioManager.playSFX('check');
        if (player.isMe && this.mentor && this.mentor.isFolded) chatAI(this.mentor, CHAT_TRIGGERS.CHECK_FOR_PLAYER)
      }
    } else if (action.type === 'raise' || action.type === 'bet' || action.type === 'all_in') {
      const diff = action.amount - player.currentBet;
      const raised = this.placeBet(player, diff);
      // [FIX] Ensure stats exist
      if (player.isMe && this.mentor && this.mentor.isFolded) {
        if (action.type === 'all_in') {
          chatAI(this.mentor, CHAT_TRIGGERS.ALL_IN_FOR_PLAYER);
        } else {
          // Compare the diff to the pot before the bet to get a sense of size
          const potRatio = diff / (this.pot > 0 ? this.pot : this.bb);
          if (potRatio < 0.35) {
            chatAI(this.mentor, CHAT_TRIGGERS.RAISE_SMALL_FOR_PLAYER);
          } else if (potRatio > 1.2) {
            chatAI(this.mentor, CHAT_TRIGGERS.RAISE_BIG_FOR_PLAYER);
          } else {
            chatAI(this.mentor, CHAT_TRIGGERS.RAISE_MEDIUM_FOR_PLAYER);
          }
        }
      }
      if (!player.stats) player.stats = { calls: 0, aggressiveActions: 0, handsPlayed: 0, vPIPCount: 0, facedFlopBet: 0, foldedToFlopBet: 0 };
      if (player.stats.aggressiveActions === undefined) player.stats.aggressiveActions = 0;

      player.stats.aggressiveActions++; // [STATS] Track Raise/Bet
      if (action.amount > 0 && player.chips === 0) {
        audioManager.playSFX('all_in');
        if (player.isMe) audioManager.enableTensionMode('reverb');
        setTimeout(() => {
          audioManager.playSFX('all_in-sign');
        }, 1000);
      } else {
        audioManager.playSFX('puti-n-chip');
      }

      if (raised) {
        this.currentStreetRaises++;
        // Track Preflop Aggressor
        if (this.state === 'PREFLOP') {
          this.preflopAggressor = player.id;
        }
      }
    }
    // [FIX] Show dialogue/insight AFTER delay (Synchronized with Action)
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

    if (!this.runoutInProgress) {
      await this.moveToNextPlayer();
      // processTurns is called inside moveToNextPlayer
    }
  }
  async moveToNextPlayer() {
    // Current active players include those with chips OR those who already made a bet this street (all_ins)
    const activePlayers = this.players.filter(p => !p.isFolded && (p.chips > 0 || p.currentBet > 0));

    // Check if betting round is over
    // A player is matched if they match the currentRoundBet OR if they are all_in
    const allMatched = activePlayers.every(p => p.currentBet === this.potManager.currentRoundBet || p.chips === 0);

    // Only wait for players who can actually act (have chips)
    const playersWithChips = activePlayers.filter(p => p.chips > 0);
    const everyoneActed = this.playersActedCount >= playersWithChips.length;

    if (everyoneActed && allMatched) {
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
    if (attempts >= this.players.length) {
      console.log('[GAME] Everyone is All-In or Folded. Forcing next street.');
      await this.nextStreet();
      return;
    }

    this.currentPlayerIndex = nextIdx;
    this.processTurns(); // This is async but we don't necessarily need to await it here unless we want to block
  }

  async nextStreet() {
    if (this.state === 'IDLE') return;
    await sleep(1000);
    this.players.forEach(p => p.currentBet = 0);
    this.potManager.currentRoundBet = 0; // Reset for new street
    this.currentStreetRaises = 0;
    this.playersActedCount = 0;
    this.pressureActive = false; // Reset pressure skill effect each street
    this.players.forEach(p => p.hasFacedFlopBet = false);

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
    eventAdaptor.startStreet('SHOWDOWN');
    this.showdownResults = result;

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
      if (this.handHistory.length > 20) this.handHistory.pop(); // Keep last 20 hands
    }

    if (!withoutShowdownEvent) eventAdaptor.showdown({ result, pot: currentPot, runoutInProgress: this.runoutInProgress, board: this.board, result })
    // else eventAdaptor.win({ player: this.players[0], pot: this.pot });
    this.runoutInProgress = false; // Reset runout flag
    // if (isPlayerWinner) {
    //   eventAdaptor.showdownWin({ winnerResult, pot: this.pot });
    //   if (isAllIn) eventAdaptor.allinWin({ winnerResult, pot: currentPot });
    // } else {
    //   eventAdaptor.showdownLose({ winnerResult, pot: currentPot });
    //   if (isAllIn) eventAdaptor.allinLose({ winnerResult, pot: currentPot });
    // }
    eventAdaptor.endStreet('SHOWDOWN');
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
          chatAI(complainer, isHuge ? CHAT_TRIGGERS.WIN_HUGE : CHAT_TRIGGERS.WIN_SMALL);
        }
      }
    }

    // Human XP Gain
    const meResult = result.results.find(r => r.isMe);
    const me = this.players.find(p => p.isMe);
    if (meResult && meResult.isWinner) {
      const gainXPAmount = gainXP(me, meResult.amountWon, this.bb, this.isHighStakes, this.locationLV);
      eventAdaptor.gainXP({ player: me, amount: gainXPAmount, bb: this.bb, isHighStakes: this.isHighStakes, locationLV: this.locationLV });
    }

    // Mentor Tutorial Feedback
    if (this.isTutorial && this.mentor && this.mentor.isFolded && me && !me.isFolded) {
      const netProfit = (meResult ? meResult.amountWon : 0) - me.totalWagered;
      if (netProfit > 0) {
        // Player Profited
        const isHugeWin = netProfit > (this.bb * 20);
        chatAI(this.mentor, isHugeWin ? CHAT_TRIGGERS.WIN_HUGE_FOR_PLAYER : CHAT_TRIGGERS.WIN_SMALL_FOR_PLAYER);
      } else if (netProfit < 0) {
        // Player Lost Money (either lost entirely, or chop/side pot refund was less than wagered)
        const isHugeLoss = me.totalWagered > (this.bb * 20);
        chatAI(this.mentor, isHugeLoss ? CHAT_TRIGGERS.LOSE_HUGE_FOR_PLAYER : CHAT_TRIGGERS.LOSE_SMALL_FOR_PLAYER);
      } else {
        // Even break (Chop)
        chatAI(this.mentor, CHAT_TRIGGERS.CHOP);
      }
    }
    const bestWinner = this.players.find(p => p.id === result.winnerId);
    this.checkBankruptcy(bestWinner);
    this.potManager.pot = 0;
    this.pot = 0; // [FIX] Sync reactive pot immediately

    // [PROFILING] Update vPIP
    // If player put more money than their forced blind, they voluntarily played.
    // However, simply checking totalWagered > blind amount is decently accurate.
    // [STAT TRACKING] vPIP for All Players
    this.players.forEach(p => {
      if (p.voluntarilyInteracted && p.stats) {
        p.stats.vPIPCount++;
      }
      // p.tempXPBonus = 0; // Reset temp XP Bonus
      p.voluntarilyInteracted = false; // Reset
    });

    eventAdaptor.roundEnd(this.players, 'ROUND_END');
    let sleepTime = (this.showdownResults?.detailedPots?.length || 1) * 4000 + 1000
    await sleep(sleepTime)
    saveStore(); // Save at the end of every complete hand
    this.startNewHand();
  }

  // --- Skill Trigger System ---
  // checkSkillTriggers(triggerType, context = {}) {
  //   // Only check for human player (index 0) as AI skills are handled differently or not equipped via store
  //   const player = this.players[0];
  //   if (!player || !player.isHuman) return;

  //   // Load equipped skills from store
  //   const equippedIds = store.equippedSkills.filter(id => id);

  //   equippedIds.forEach(skillId => {
  //     const skill = SKILL_DATA.find(s => s.id === skillId);
  //     if (skill && skill.trigger === triggerType) {
  //       console.log(`[SKILL TARGET] ${ skill.name } triggered by ${ triggerType } `);
  //       // Execute effect
  //       if (typeof skill.effect === 'function') {
  //         skill.effect(this, player, context);
  //       }
  //     }
  //   });
  // }

  checkBankruptcy(bestWinner) {
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
        eventAdaptor.playerBankrupt(p, bestWinner, this.locationId, this.inviteId);

        // Handle Human Bankruptcy
        if (p.isHuman) {
          this.gameOver = true;
          this.winnerId = bestWinner ? bestWinner.id : 'cpu';
        }
      }
    });

    // 2. Check Human Bankruptcy (no more need)
    // const human = this.players.find(p => p.isHuman);
    // if (human && human.chips <= 0) {
    //   // [AI CHAT] Enemy Elimination (Mockery)
    //   const aiSurvivors = this.players.find(s => s.chips > 0 && s.id !== human.id && !s.isHuman);
    //   if (aiSurvivors && Math.random() < 0.6) {
    //     chatAI(aiSurvivors, CHAT_TRIGGERS.ELIMINATED_ENEMY);
    //   }

    //   const buyInResult = this.processBuyIn(human);
    //   if (buyInResult) {
    //     eventAdaptor.rebuy({ player: human, amount: BUY_IN });
    //   } else {
    //     this.gameOver = true;
    //     this.winnerId = 'cpu'; // Generic loss
    //     initializeBankroll();
    //     eventAdaptor.playerEliminated({ player: human });
    //   }
    // }

    // 3. Check for Victory (Only Human Remains)
    const lastSurvior = this.players.filter(p => !p.isEliminated)
    if (lastSurvior.length === 1 && lastSurvior[0].isMe) {
      console.log('[GAME] Victory! You are the last survivor.');
      this.winnerId = 'player';
      this.gameOver = true;
      this.victoryPrize = gainXP(lastSurvior[0], this.bb * 100, this.bb, this.isHighStakes);
      audioManager.playSFX('clear-table');
      console.log(`[GAME] Victory Prize Awarded: ${this.bb * 100} `);

      eventAdaptor.gameWon(lastSurvior[0], this.bb * 100, this.locationId, this.inviteId);
    }

    return false;
  }
  exitGame() {
    eventAdaptor.playerLeaveTable(this.players[0], this.locationId, this.players, this.inviteId);
    store.bankroll += this.players[0].chips;
    saveStore();
    this.cleanup();
  }
  processBuyIn(player, isRebuy = false) {
    if (store.bankroll <= 0 || player.buyInLimit <= 0) {
      console.warn(`[BANKROLL] Insufficient funds for buy-in.`);
      return false;
    }
    const targetBuyIn = this.buyIn * player.buyInMultiply;
    const actualBuyIn = Math.min(store.bankroll, targetBuyIn);
    player.chips = actualBuyIn;
    if (isRebuy) player.buyInLimit--;
    store.bankroll -= actualBuyIn;
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

  useSkill(player, skillId) {
    const skill = player.class.skills.find(s => s.id === skillId);
    if (!skill) return false;

    const totalCost = (player.ram.used || 0) + (player.ram.reserved || 0) + skill.cost;
    const maxRam = player.maxRam || player.class.maxRam;
    if (totalCost > maxRam) return false;

    if (skill.reserved) {
      player.ram.reserved += skill.cost;
    } else {
      player.ram.used += skill.cost;
    }

    // Effect implementation
    switch (skillId) {
      case 'hud':
        player.hudActive = !player.hudActive; // Toggle
        break;
      case 'swap':
        // Replace cards
        player.hand = [this.deck.pop(), this.deck.pop()];
        audioManager.playSFX('card-dealt&fold');
        break;
      case 'pressure':
        // No-fold logic for current street
        this.pressureActive = true;
        break;
    }

    return true;
  }

  // --- All-In Showdown Logic ---

  async checkAllInCondition() {
    if (this.state === 'SHOWDOWN' || this.runoutInProgress || this.gameOver) return;

    const activePlayers = this.players.filter(p => !p.isFolded);
    const playersWithChips = activePlayers.filter(p => p.chips > 0);

    // Condition: More than 1 active player, but 1 or 0 have chips left (meaning others are all_in)
    // AND all bets are matched (no pending actions)
    const allMatched = activePlayers.every(p => p.currentBet === this.potManager.currentRoundBet || p.chips === 0);

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
    if (this.state === 'SHOWDOWN' || this.gameOver) return;

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

  async cashOut() {
    const player = this.players[0];
    if (player && player.chips > 0) {
      store.bankroll += player.chips;
      console.log(`[BANKROLL] Cashed out ${player.chips}. New Bankroll: ${store.bankroll} `);
      player.chips = 0;
    }
  }

  async processTurns() {
    if (this.state === 'IDLE') return;
    if (this.gameOver || this.state === 'SHOWDOWN' || this.runoutInProgress) return;

    const player = this.players[this.currentPlayerIndex];
    if (!player) return;

    if (player.isFolded || player.chips <= 0) {
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
    console.info('delay', delay)
    // Animate the delay
    while (elapsed < delay) {
      if (this.gameOver || this.state === 'SHOWDOWN' || this.runoutInProgress) break;
      await sleep(step);
      elapsed += step;
      player.timeBankRemaining = Math.max(0, player.timeBankRemaining - (step / 1000));
    }
    if (this.gameOver || this.state === 'SHOWDOWN' || this.runoutInProgress || this.state === 'IDLE') return;
    await this.handlePlayerAction(player, action);

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

