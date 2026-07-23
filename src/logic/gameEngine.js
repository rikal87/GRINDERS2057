import { calculateEquity, createDeck } from './poker.js';
import { getAIAction } from './aiEngine.v2.js';
import { applyPartnerCollusion, handlePartnerCollusionSignals, validateCollusionCompliance, initPartnerCollusion } from './collusionActionProcessor.js';
import { chatAI } from './AIChatSystem.js';
import { getAdvancedAIAction } from './aiEngineAdvanced.js';
import { CLASSES_PARTNER } from './persona.js'
import { PlayerFactory } from './playerFactory.js';
import { HandHistoryManager } from './HandHistoryManager.js';
import { audioManager } from './audioManager.js';
import { PotManager } from './PotManager.js';
import { generateToughCallThought } from './thinkingScriptGenerator.js';
import { EventAdaptor } from './gameEngineEventAdaptor.js';
import { getJoinedPartners } from './partnerSystem.js';
import { shareBenefitForPartners, shareCollusion } from './partnerContractSystem.js';
import {
  getListPlayStatsSession, gainInfamy, gainXPEstimate, store, saveStore, gainBankroll, gainSuspicion,
  getCurrentSuspicion, getCurrentInfamy, gainXP, gainClearedZoneCount, gainClearReward, processMissionResult
} from './store.js';
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
    , locationId = 'micro_street_shop', locationLV = 1, buyInLimit = 999999, isMonitoring = false, inviteId = null, isDeathmatch = false, options = {}) {
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
    this.historyManager = new HandHistoryManager();
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
    this.exitReservationRounds = null;
    this.options = options || {};
    this.isSpectateMode = options.isSpectateMode || false;
    this.spectateHero = options.spectateHero || (options.snapshot ? options.snapshot.heroId : null);
    this.players = this.initializePlayers(playerClass, tableSize);
  }

  // Getter for backward compatibility / easier access
  get handHistory() { return this.historyManager.handHistory; }
  get currentHandHistory() { return this.historyManager.currentHandHistory; }
  get actionHistory() { return this.historyManager.actionHistory; }
  get currentRoundBet() { return this.potManager.currentRoundBet; }
  // if (Math.random() < 0.25) chatAI(aiPlayer, CHAT_TRIGGERS.GAME_START, "", 0, this)
  initializePlayers(humanClass, size) {
    const players = [];

    if (!this.isSpectateMode) {
      const YOU = PlayerFactory.createHumanPlayer(this, humanClass);
      this.processBuyIn(YOU);
      players.push(YOU);
    }

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

    // Spectating Mode: Ensure the Hero (e.g. 'Max') is guaranteed at the table
    if (this.isSpectateMode && this.spectateHero) {
      const heroTemplate = [...CLASSES_PARTNER, ...CLASSES_ENEMY].find(e => e.id === this.spectateHero || e.name === this.spectateHero);
      if (heroTemplate) {
        enemiesToPlace.push({ ...heroTemplate });
      }
    }

    // 0. partners Spawns (Top Priority from zone.js config)
    if (!this.inviteId && !this.isSpectateMode) {
      const joinedPartners = getJoinedPartners();
      joinedPartners.forEach(partner => {
        const validContract = partner.contracts.find(contract => contract.type === CONTRACT_TYPE.COLLUSION && contract.active);
        const template = CLASSES_PARTNER.find(e => e.id === partner.id)
        if (template && validContract) {
          enemiesToPlace.push({ ...template, contracts: partner.contracts });
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
    const targetNpcCount = this.isSpectateMode ? size : size - 1;
    for (let i = 0; i < enemiesToPlace.length && tableNpcs.length < targetNpcCount; i++) {
      tableNpcs.push(this.createAIPlayerFromTemplate(enemiesToPlace[i], `cpu_${i + 1}`));
    }

    // Fill the empty seats with random NPCs from the pool
    let cpuCount = enemiesToPlace.length + 1;
    while (tableNpcs.length < targetNpcCount) {
      tableNpcs.push(this.createAIPlayer(`cpu_${cpuCount++}`));
    }

    // In normal mode, shuffle NPCs. In spectate mode, maintain exact snapshot seat order.
    const shuffledNpcs = this.isSpectateMode ? tableNpcs : tableNpcs.sort(() => Math.random() - 0.5);
    players.push(...shuffledNpcs);

    // De-duplicate names for players sharing the same persona
    const nameCounts = {};
    players.forEach(p => {
      nameCounts[p.name] = (nameCounts[p.name] || 0) + 1;
    });

    const currentNameIndices = {};
    players.forEach(p => {
      const originalName = p.name;
      if (nameCounts[originalName] > 1) {
        currentNameIndices[originalName] = (currentNameIndices[originalName] || 0) + 1;
        p.name = `${originalName} #${currentNameIndices[originalName]}`;
      }
    });

    // Spectating Mode: Override players array with exact snapshot player roster and IDs
    const snapshot = this.options?.snapshot;
    if (this.isSpectateMode && snapshot && snapshot.players && Array.isArray(snapshot.players)) {
      players.length = 0; // Clear generated default players
      snapshot.players.forEach((sp, idx) => {
        const aiPlayer = PlayerFactory.createAIPlayer(this, sp.id || `snap_${idx}`);
        aiPlayer.id = sp.id || aiPlayer.id;
        aiPlayer.name = sp.name || aiPlayer.name;
        aiPlayer.chips = sp.chips || (this.bb * 100);
        players.push(aiPlayer);
      });
      console.log('🎥 [SPECTATE ENGINE] Exact Snapshot Player Roster Constructed:', players.map(p => `${p.name} (${p.id})`));
      return players;
    }

    if (this.isTutorial) {
      this.mentor = players.find(e => e.name === 'Max(Mentor)');
    }
    return players;
  }

  createAIPlayerFromTemplate(villanTemplate, customId) {
    return PlayerFactory.createAIPlayerFromTemplate(this, villanTemplate, customId);
  }

  createAIPlayer(customId = null) {
    return PlayerFactory.createAIPlayer(this, customId);
  }

  forceFoldCurrentHand() {
    if (!this.players || this.players.length === 0) return false;
    const hero = this.players[0];
    if (hero && !hero.folded) {
      hero.folded = true;
      console.info(`[STRATEGIC_COACHING] Force fold executed for ${hero.name}`);
      return true;
    }
    return false;
  }

  forceRaiseCurrentHand(amount = 5000) {
    if (!this.players || this.players.length === 0) return false;
    const hero = this.players[0];
    if (hero && !hero.folded) {
      hero.currentBet = (hero.currentBet || 0) + amount;
      console.info(`[STRATEGIC_COACHING] Force raise executed for ${hero.name}`);
      return true;
    }
    return false;
  }

  /**
   * [DECISIVE MOMENT INJECTION]
   * MatchSimulator에서 캡처한 capturePoint를 주입하여 Phase 1(PREFLOP부터 고속 자동 연출)을 시작.
   * 결정적 순간 스트릿(FLOP/TURN)에 도달하면 자동으로 일시정지되어 Phase 2(유저 개입)로 전환.
   */
  injectCapturePoint(capturePoint) {
    if (!capturePoint) return;
    console.info(`🎯 [DECISIVE_MOMENT_ENGINE] injectCapturePoint Executed! Starting Phase 1 Replay from PREFLOP -> target: ${capturePoint.currentStreet}`);

    this.capturePoint = capturePoint;
    this.deck = createDeck(); // Initialize valid 52-card deck
    this.board = []; // Start empty for visual dealing in Phase 1
    this.state = 'PREFLOP'; // Start from PREFLOP so user watches history
    this.potManager.resetHand();
    this.potManager.pot = capturePoint.sb + capturePoint.bb; // Initial blind pot

    // Remove snapshot cards (hole cards + board cards) from active deck to prevent duplicate/undefined dealing
    if (capturePoint.board && Array.isArray(capturePoint.board)) {
      capturePoint.board.forEach(card => {
        const idx = this.deck.indexOf(card);
        if (idx !== -1) this.deck.splice(idx, 1);
      });
    }
    if (capturePoint.players && Array.isArray(capturePoint.players)) {
      capturePoint.players.forEach(sp => {
        if (sp.hand && Array.isArray(sp.hand)) {
          sp.hand.forEach(card => {
            const idx = this.deck.indexOf(card);
            if (idx !== -1) this.deck.splice(idx, 1);
          });
        }
      });
    }

    // Restore players' hole cards (Hero is always Seat 0)
    if (capturePoint.players && Array.isArray(capturePoint.players)) {
      this.players.forEach((p, idx) => {
        const cpPlayer = capturePoint.players[idx];
        if (cpPlayer) {
          if (cpPlayer.hand && cpPlayer.hand.length === 2) {
            p.hand = [...cpPlayer.hand];
          }
          p.isFolded = false; // Reset folded state for PREFLOP replay start
          if (cpPlayer.chips !== undefined) p.chips = cpPlayer.chips;
        }
        p.currentBet = 0;
        p.showHoleCards = this.isSpectateMode;
      });
    }

    // Restore phase1Stream into historyManager
    if (capturePoint.phase1Stream && Array.isArray(capturePoint.phase1Stream)) {
      capturePoint.phase1Stream.forEach(act => {
        const targetPlayer = this.players.find(p => p.id === act.playerId || p.name === act.player)
          || { id: act.playerId || 'unknown', name: act.player || '', chips: 0 };
        this.historyManager.recordAction(act.street || 'PREFLOP', targetPlayer, act.type, act.amount || 0, act.potSize || capturePoint.pot || 0);
      });
    }

    this.playersActedCount = 0;
    this.potManager.currentRoundBet = 0;
    this.currentPlayerIndex = 0;

    // Enable Phase 1 replay mode: High-speed auto-playback until target street
    this.isPhase1Replay = true;

    // Start Phase 1 replay loop
    this.processTurns();
  }

  async startNewHand(isFirstHand = false) {
    if (this.exited) return;
    audioManager.disableTensionMode();
    this.deck = createDeck();
    this.board = [];
    this.potManager.resetHand();
    this.playersActedCount = 0;
    this.waitingTriggered = false;
    this.bigPotTensionTriggered = false;
    this.currentStreetRaises = 0;
    this.aggressor = null;
    this.historyManager.actionHistory = [];

    // [DECISIVE MOMENT INJECTION] capturePoint 기반 상태 주입
    // 기존 actionStream 리플레이 방식을 완전히 대체
    const capturePoint = this.options?.capturePoint;
    if (this.isSpectateMode && capturePoint) {
      console.log('🎥 [DECISIVE_MOMENT_ENGINE] capturePoint 감지 — Phase 1 자동 리플레이 진입:', capturePoint.currentStreet);
      this.isPhase1Replay = true;
      this.capturePoint = capturePoint;
      // phase1Stream을 historyManager에 기록 (AI 컨텍스트용)
      if (capturePoint.phase1Stream && Array.isArray(capturePoint.phase1Stream)) {
        capturePoint.phase1Stream.forEach(act => {
          const targetPlayer = this.players.find(p => p.id === act.playerId || p.name === act.player)
            || { id: act.playerId || 'unknown', name: act.player || '', chips: 0 };
          this.historyManager.recordAction(act.street || 'PREFLOP', targetPlayer, act.type, act.amount || 0, act.potSize || capturePoint.pot || 0);
          if (act.type === 'raise' || act.type === 'all_in') this.aggressor = targetPlayer;
        });
        console.log('🎥 [DECISIVE_MOMENT_ENGINE] phase1Stream 복원 완료:', capturePoint.phase1Stream.length, 'actions');
      }
    } else {
      this.isPhase1Replay = false;
      this.capturePoint = null;
    }
    if (typeof this.exitReservationRounds === 'number' && this.exitReservationRounds > 0) {
      this.exitReservationRounds--;
    } else if (typeof this.exitReservationRounds === 'number' && this.exitReservationRounds === 0) {
      // Time to exit
      this.cashOut();
      return;
    }

    this.players.forEach((p, pIdx) => {
      // [DECISIVE MOMENT] capturePoint 기반 홀카드/폴드 상태 직접 주입 (index 0 = Hero 고정)
      let presetHand = null;
      let presetFolded = false;
      if (this.isSpectateMode && capturePoint && capturePoint.players && capturePoint.players.length > 0) {
        const snapPlayer = capturePoint.players[pIdx];
        if (snapPlayer) {
          if (snapPlayer.hand && snapPlayer.hand.length === 2) {
            presetHand = [...snapPlayer.hand];
            console.log(`🎥 [DECISIVE_MOMENT_ENGINE] Seat ${pIdx} (${p.name}) 홀카드 주입:`, presetHand);
          }
          presetFolded = !!snapPlayer.isFolded;
          if (presetFolded) console.log(`🎥 [DECISIVE_MOMENT_ENGINE] Seat ${pIdx} (${p.name}) FOLD 상태 복원`);
        }
      }

      p.hand = presetHand || [this.deck.pop(), this.deck.pop()];
      p.isFolded = presetFolded || (p.chips <= 0);
      p.currentBet = 0;
      p.totalWagered = 0;
      p.isBlind = false; // Reset blind status
      p.isJoinPot = false; // Reset VPIP tracker
      p.showHoleCards = this.isSpectateMode; // In spectate mode, reveal cards for live insight
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
      if (!p.isEliminated) {
        recordPlayStatsSession(p, PLAY_RECORD_STATS_TYPE.HANDS_PLAYED);
        p._f3b = false;
        p._f4b = false;
        p._d3b = false;
        p._d4b = false;
      }
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
      const opponents = this.players.filter(p => !p.isMe);
      const me = this.players.find(p => p.isMe);
      if (me) {
        opponents.forEach(p => {
          if (p.personaId) {
            recordPlayStatsSession(me, PLAY_RECORD_STATS_TYPE.MET_ENEMY, { enemyClass: p.personaId });
          }
        });
      }
      let pickOne = opponents.find((p) => p.name === 'Max(Mentor)');
      if (pickOne) {
        chatAI(pickOne, CHAT_TRIGGERS.GAME_START, "", 0, this)
      } else {
        pickOne = opponents[Math.floor(Math.random() * opponents.length)];
        console.info('pickOne', pickOne)
        chatAI(pickOne, CHAT_TRIGGERS.GAME_START, "", 0, this)
      }
      eventAdaptor.gameStart({ locationId: this.locationId, inviteId: this.inviteId });
      await sleep(2000);
    }
    eventAdaptor.roundStart(this.players, { sb: this.sb, bb: this.bb });
    // Initialize history for new hand
    this.historyManager.startNewHand(this.players, { sb: this.sb, bb: this.bb });

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

    // [COLLUSION] Pre-flop coordination start
    this.players.filter(p => p.isPartner).forEach(partner => {
      initPartnerCollusion(partner, this);
    });

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
    // [NEW] Store last action info for showdown analysis (especially for Hero Call / Bluff check)
    player.lastActionStreet = this.state;
    player.lastActionEquity = player.currentEquity || 0; // Set by aiEngine or gameEngine
    // player.lastActionPotOdds = (engine && engine.pot > 0) ? (amount / (engine.pot + amount)) : 0;

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
      validateCollusionCompliance(player, action, this);
    }
    const activePlayersCount = this.players.filter(p => !p.isFolded && !p.isEliminated).length;
    const isHeadsUp = activePlayersCount === 2;

    if (action.type === 'fold') {
      if (player.isMe && this.mentor && this.mentor.isFolded && isHeadsUp && Math.random() < 0.3) chatAI(this.mentor, CHAT_TRIGGERS.FOLD_FOR_PLAYER, "", 0, this)
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
        if (player.isMe && this.mentor && this.mentor.isFolded && isHeadsUp && Math.random() < 0.3) chatAI(this.mentor, CHAT_TRIGGERS.CALL_FOR_PLAYER, "", 0, this);
      } else {
        action.type = 'check';
        audioManager.playSFX('check');
        if (player.isMe && this.mentor && this.mentor.isFolded && isHeadsUp && Math.random() < 0.3) chatAI(this.mentor, CHAT_TRIGGERS.CHECK_FOR_PLAYER, "", 0, this);
      }

    } else if (action.type === 'raise' || action.type === 'bet' || action.type === 'all_in') {
      const diff = action.amount - player.currentBet;
      const raised = this.placeBet(player, diff);
      // [FIX] Ensure stats exist
      if (player.isMe && this.mentor && this.mentor.isFolded && isHeadsUp && Math.random() < 0.3) {
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
                if (!p._f3b) {
                  if (p.stats.threeBetOppCount === undefined) p.stats.threeBetOppCount = 0;
                  p.stats.threeBetOppCount++;
                  p._f3b = true;
                }
              }
            });
          } else if (this.currentStreetRaises === 2) {
            // Track 4-Bet+ Opportunities (only on the first 3-bet)
            this.players.forEach(p => {
              if (p.id !== player.id && !p.isFolded && p.chips > 0) {
                if (!p._f4b) {
                  if (p.stats.fourBetOppCount === undefined) p.stats.fourBetOppCount = 0;
                  p.stats.fourBetOppCount++;
                  p._f4b = true;
                }
              }
            });
          }
        }
      }
    }

    // [REQ] Handle BET vs RAISE and CALL vs CHECK for default lastDialogue
    let displayAction = action.type.toLocaleUpperCase();
    if (displayAction === 'CALL' && callAmtBefore === 0) {
      displayAction = 'CHECK';
    } else if (displayAction === 'RAISE' && this.state !== 'PREFLOP' && isInitialRaise) {
      displayAction = 'BET';
    }

    if (action.dialogueTrigger && !player.isHuman) {
      chatAI(player, action.dialogueTrigger, action.insight, 3000, this);
    } else {
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
    }

    // [NEW] Store AI-calculated odds/equity for showdown triggers (Hero Call / Bluff Caught)
    if (!player.isHuman) {
      player.lastActionType = action.type;
      player.lastActionPotOdds = action.potOdds || 0;
      player.lastActionEquity = action.estimatedEquity || 0;
    }

    // Record Action to History Manager
    this.historyManager.recordAction(this.state, player, action.type, action.amount, this.pot);

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
      this.waitingTriggered = false; // Reset waiting trigger for next player
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
      this.historyManager.recordAction(this.state, uncalledResult.player, 'uncalled_return', uncalledResult.amount, this.potManager.pot);

      eventAdaptor.uncalledBetReturned(uncalledResult);
      // Synchronize reactive pot immediate update
      this.pot = this.potManager.pot;
      await sleep(1500); // Visual pause for UI update
    }

    await sleep(1000);
    this.players.forEach(p => p.currentBet = 0);
    this.potManager.currentRoundBet = 0; // Reset for new street
    const streetAggressorWasPresent = this.currentStreetRaises > 0;
    this.players.forEach(p => p.hasFacedFlopBet = false);

    // [MOD] If no one raised/bet this street, the 'Initative' or Aggressor status expires.
    // This prevents AI from being stuck in DONK_AVOIDER mode for streets where the old aggressor checked.
    if (!streetAggressorWasPresent) {
      this.aggressor = null;
    }

    this.currentStreetRaises = 0;
    this.playersActedCount = 0;

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

    if (attempts >= this.players.length) {
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

    // Finalize History
    this.historyManager.finalizeHistory(result, currentPot, this.board);

    if (!withoutShowdownEvent) {
      this.state = 'SHOWDOWN';

      // 1. Calculate final equity for active players to determine reveal order
      calculateEquity(this.players, this.board);

      // 2. Filter active players who need card reveal (exclude folded/eliminated/humans who are already visible)
      const showdowers = this.players.filter(p => !p.isFolded && p.hand && p.hand.length === 2);
      
      // 3. Sort by equity ascending (lowest equity / losers open first to build tension)
      showdowers.sort((a, b) => (a.equity || 0) - (b.equity || 0));

      // 4. Reveal cards sequentially with a delay
      for (const p of showdowers) {
        if (!p.isHuman && !p.showHoleCards) {
          p.showHoleCards = true;
          audioManager.playSFX('ui-click-soft');
          await sleep(1000); // 1.0s delay between card reveals
        }
      }

      eventAdaptor.showdown({ result, pot: currentPot, runoutInProgress: this.runoutInProgress, board: this.board, result })
      eventAdaptor.endStreet('SHOWDOWN');
    } else {
      eventAdaptor.winAtWithoutShowdown({ result, pot: currentPot, runoutInProgress: this.runoutInProgress, board: this.board, result });
    }
    // else eventAdaptor.win({ player: this.players[0], pot: this.pot });
    this.runoutInProgress = false; // Reset runout flag
    window.isFastFowardActive = false; // Rest fast fold flag
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
      let specialEventHandled = false;

      // [NEW] Check for mutually exclusive special events (Bluff Caught)
      if (this.state === 'SHOWDOWN' && !withoutShowdownEvent) {
        // Find if someone was bluffing on the river and lost (Equity <= 30%)
        const bluffer = this.players.find(p => !bestWinnersList.includes(p.id) && p.id === this.aggressor && p.lastActionStreet === 'RIVER' && ['raise', 'bet', 'all_in'].includes(p.lastActionType) && p.lastActionEquity <= 0.3);
        
        if (bluffer) {
          // Find the catcher (a winner who called on the river)
          const catcher = this.players.find(p => bestWinnersList.includes(p.id) && p.lastActionStreet === 'RIVER' && p.lastActionType === 'call');
          
          if (catcher && !catcher.isHuman && !catcher.isFolded && !catcher.isEliminated) {
            // Priority 1: NPC catcher taunts the bluffer (User or another NPC)
            chatAI(catcher, CHAT_TRIGGERS.BLUFF_CAUGHT_FOR_PLAYER, "", 0, this);
            specialEventHandled = true;
          } else if (bluffer && !bluffer.isHuman && !bluffer.isFolded && !bluffer.isEliminated) {
            // Priority 2: NPC bluffer got caught and complains
            chatAI(bluffer, CHAT_TRIGGERS.BLUFF_CAUGHT, "", 0, this);
            specialEventHandled = true;
          }
        }
      }

      // Process AI reactions and Tilt (Tilt only changes if they chat)
      this.players.forEach(p => {
        // Skip Humans, Folded players, and Eliminated players
        if (p.isHuman || p.isFolded || p.isEliminated) return;

        const isBestWinner = bestWinnersList.includes(p.id);

        // Tilt calculation
        if (isBestWinner) {
          p.tilt = Math.max(0, p.tilt - Math.round(maxWinAmount / this.bb));
        } else {
          p.tilt = Math.min(100, p.tilt + Math.round(this.pot / this.bb * 0.5));
        }

        // If a special event handled the chat, suppress normal win/lose chat to avoid UI clutter
        if (specialEventHandled) return;

        const chatPercentage = (isHuge ? 0.6 : 0.3) + (p.isDrunken ? 0.3 : 0.0);
        
        if (Math.random() < chatPercentage) {
          const trigger = isBestWinner ? (isHuge ? CHAT_TRIGGERS.WIN_HUGE : CHAT_TRIGGERS.WIN_SMALL) : (isHuge ? CHAT_TRIGGERS.LOSE_HUGE : CHAT_TRIGGERS.LOSE_SMALL);
          chatAI(p, trigger, "", 0, this);
        }
      });
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

    this.potManager.pot = 0;
    this.pot = 0; // [FIX] Sync reactive pot immediately
    // Reset interaction flags for next hand
    this.players.forEach(p => {
      p.voluntarilyInteracted = false;
    });
    // this.street = 'ROUND_END';
    eventAdaptor.roundEnd({ players: this.players, bestWinner, street: this.street });
    // Sync live match chip results back to partner store bankrolls
    if (this.isSpectateMode) {
      result.results.forEach(res => {
        const partnerData = store.partners.find(p => p.id === res.id || p.id === res.player.id || p.name === res.player.name);
        if (partnerData) {
          const netGainLoss = res.amountWon - res.player.totalWagered;
          partnerData.bankroll = Math.max(0, partnerData.bankroll + netGainLoss);
          if (partnerData.sessionNetWorth !== undefined) partnerData.sessionNetWorth += netGainLoss;
          console.log(`🎥 [SPECTATE BANKROLL SYNC] Synced ${partnerData.name}'s bankroll: Net ${netGainLoss >= 0 ? '+' : ''}${netGainLoss} => New Total: $${partnerData.bankroll}`);
        }
      });
    }

    const sleepTime = (this.showdownResults?.detailedPots?.length || 1) * 4000 + 1000;
    // saveStore();
    await sleep(sleepTime);
    await this.checkBusted(bestWinner);
    if (this.suspicion >= 40 && this.checkTriggerCasinoInvestigation()) return;
    this.calculationInProgress = false;
    
    // Spectating / Decisive Moment Mode: Hand complete, auto-exit to OS and unlock simulation
    if (this.isSpectateMode || this.options?.capturePoint || this.capturePoint) {
      console.log('🎥 [DECISIVE_MOMENT_ENGINE] 관전/개입 핸드가 완료되었습니다. 시뮬레이션을 언락하고 OS로 복귀합니다.');
      this.isSpectateMode = false;
      this.capturePoint = null;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('resume-simulation-unlock'));
        window.dispatchEvent(new CustomEvent('exit-spectate-to-lobby'));
      }
      return; // Do NOT start new hand continuously!
    }

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

  async checkBusted(bestWinner) {
    // 1. Bankrupt Players
    this.players.forEach((p, index) => {
      if (p.isEliminated === true && !p.isHuman && Math.random() < 0.3) {
        const newPlayer = this.createAIPlayer(p.id);
        if (!newPlayer) return;
        this.players.splice(index, 1, newPlayer);
        console.log(`[GAME] Empty seat filled by ${newPlayer.name}`);
        chatAI(newPlayer, CHAT_TRIGGERS.GAME_START); // Say hi
        p = newPlayer; // update local reference
        const me = this.players.find(pl => pl.isMe);
        if (me && p.personaId) {
          recordPlayStatsSession(me, PLAY_RECORD_STATS_TYPE.MET_ENEMY, { enemyClass: p.personaId });
        }
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
          chatAI(p, CHAT_TRIGGERS.ELIMINATED_SELF);
        }
        p.isEliminated = true;
        if (bestWinner && !bestWinner.isMe) chatAI(bestWinner, CHAT_TRIGGERS.ELIMINATED_ENEMY);
        // Handle Human Bankruptcy
        if (p.isHuman) { // only popup when you normally lose
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
    // [DECISIVE MOMENT ENGINE] capturePoint.board 기반 보드 카드 주입
    const cpBoard = this.capturePoint?.board;
    this.board = [];

    if (this.isSpectateMode && cpBoard && cpBoard.length >= 3) {
      this.board.push(cpBoard[0], cpBoard[1], cpBoard[2]);
      console.log('[DECISIVE_MOMENT_ENGINE] Flop Dealt from capturePoint:', this.board);
    } else {
      for (let i = 0; i < 3; i++) {
        if (i === 0) this.deck.pop(); // Burn card
        this.board.push(this.deck.pop());
      }
    }

    this.state = 'FLOP';
    this._checkPhase1Transition('FLOP');
    audioManager.playSFX('card-dealt&fold');
  }

  dealTurn() {
    const cpBoard = this.capturePoint?.board;
    if (this.isSpectateMode && cpBoard && cpBoard.length >= 4) {
      this.board.push(cpBoard[3]);
      console.log('[DECISIVE_MOMENT_ENGINE] Turn Dealt from capturePoint:', this.board);
    } else {
      this.deck.pop(); // Burn card
      this.board.push(this.deck.pop());
    }
    this.state = 'TURN';
    this._checkPhase1Transition('TURN');
    audioManager.playSFX('card-dealt&fold');
  }

  dealRiver() {
    const cpBoard = this.capturePoint?.board;
    if (this.isSpectateMode && cpBoard && cpBoard.length >= 5) {
      this.board.push(cpBoard[4]);
      console.log('[DECISIVE_MOMENT_ENGINE] River Dealt from capturePoint:', this.board);
    } else {
      this.deck.pop(); // Burn card
      this.board.push(this.deck.pop());
    }
    this.state = 'RIVER';
    this._checkPhase1Transition('RIVER');
    audioManager.playSFX('card-dealt&fold');
  }

  /**
   * [DECISIVE MOMENT ENGINE] Phase 1 → Phase 2 전환 감지
   * capturePoint.currentStreet에 도달하면 isPhase1Replay = false 전환
   * → App.vue의 isPhase2Ready computed가 true가 되어 Phase 2 선택 UI 노출
   */
  _checkPhase1Transition(currentStreet) {
    if (!this.isPhase1Replay || !this.capturePoint) return;
    if (currentStreet === this.capturePoint.currentStreet) {
      console.info(`[DECISIVE_MOMENT_ENGINE] Phase 1 완료: ${currentStreet} 도달 — Phase 2 대기 상태로 전환`);
      this.isPhase1Replay = false;
      // capturePoint는 유지: Phase 2 UI가 이를 참조함
    }
  }


  checkEnteredBigPotTension() {
    if (this.bigPotTensionTriggered) return;

    if (this.pot > this.bb * 100) {
      this.bigPotTensionTriggered = true;
      audioManager.enableTensionMode();

      const activePlayers = this.players.filter(p => !p.isFolded && !p.isEliminated);
      if (activePlayers.length === 2) {
        const activeNPCs = activePlayers.filter(p => !p.isHuman);
        if (activeNPCs.length > 0) {
          const picker = activeNPCs[Math.floor(Math.random() * activeNPCs.length)];
          chatAI(picker, CHAT_TRIGGERS.BIG_POT_TENSION, "", 0, this);
        }
      }
    }
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
        this.historyManager.recordAction(this.state, uncalledResult.player, 'uncalled_return', uncalledResult.amount, this.potManager.pot);

        eventAdaptor.uncalledBetReturned(uncalledResult);
        this.pot = this.potManager.pot;
        await sleep(1500);
      }

      await this.startAllInShowdown();
    }
  }

  async startAllInShowdown() {
    this.runoutInProgress = true;
    // Reveal all active hands for the All-In runout
    this.players.forEach(p => {
      if (!p.isFolded) {
        p.showHoleCards = true;
        console.log(`[ALL - IN] Revealing hand for ${p.name}: `, p.hand);
      }
    });

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
    this.checkEnteredBigPotTension();
    if (this.state === 'PREFLOP') {
      eventAdaptor.endStreet(this.state);
      this.dealFlop();
      calculateEquity(this.players, this.board); // Recalculate equity after flop
      await this.runNextStep();
    } else if (this.state === 'FLOP') {
      eventAdaptor.endStreet(this.state);
      this.dealTurn();
      calculateEquity(this.players, this.board); // Recalculate equity after turn
      await this.runNextStep();
    } else if (this.state === 'TURN') {
      eventAdaptor.endStreet(this.state);
      this.dealRiver();
      calculateEquity(this.players, this.board); // Recalculate equity after river
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

    const player = this.players.find(p => p.isMe);
    // [FIX] Use player.totalBuyIn for correct net winnings calculation
    const netWinnings = (player.chips - player.totalBuyIn);
    recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.NET_WINNING, { amount: netWinnings })
    const winBB = netWinnings / this.bb;

    // infarmy Calc
    let generatedInfamy = winBB * 0.2;
    let baseBoostInfamy = (this.exitReservationRounds === -1 ? 1.0 : 0.5) + (player.born_villain || 0) + (player.infamy_boost || 0);

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

    // [FIX] Consistently identify Florence Event
    const isFlorenceSession = this.locationId === LOCATION_ID.LOW_UNDERGROUND_CLUB_VIP_ROOM;

    // share collusion
    const partners = this.players.filter(p => !p.isEliminated && p.isPartner);
    partners.forEach(partner => {
      // [FIX] Partner uses initialChips (no rebuy), Player uses totalBuyIn
      const partnerNetWinnings = partner.chips - partner.initialChips;
      console.info('partner.personaId', partner.personaId)
      const share = shareCollusion(partner.personaId, netWinnings, partnerNetWinnings, isFlorenceSession)
      recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.NET_SHARE, { amount: -share })
    });
    // share benefit
    const share = shareBenefitForPartners(netWinnings);
    recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.NET_SHARE, { amount: -share })
    await saveStore();
    audioManager.pause();
    if (result === GAME_RESULT_CODE.WIN_BIG) audioManager.playSFX('end-session-bigwin');
    else if (result === GAME_RESULT_CODE.WIN_MEDIUM) audioManager.playSFX('end-session-midwin');
    else audioManager.playSFX('end-session')
    window.dispatchEvent(new CustomEvent('trigger-cashout', { detail: { isForceExit } }));
  }

  async processTurns() {
    if (this.checkSkipAction() || this.runoutInProgress) return;
    const activePlayers = this.players.filter(p => !p.isFolded && !p.isEliminated);
    if (activePlayers.length === 1) {
      this.resolveShowdown(true);
      return;
    }
    this.checkEnteredBigPotTension();
    const player = this.players[this.currentPlayerIndex];
    if (!player) return;

    if (player.isFolded || player.isEliminated) {
      this.moveToNextPlayer();
      return;
    }

    if (player.isHuman) {
      // Human turn: Waiting for UI input
      console.log(`[TURN] Waiting for Human Input...`);
      this.myTurn = true;
      this.startTurnTimer(player);
      // [NEW] Check collusion signals when it's player's turn to provide guidance
      const partner = this.players.find(p => p.isPartner);
      if (partner) handlePartnerCollusionSignals(partner, { insight: '' }, this);
      return;
    } else this.myTurn = false;
    player.lastDialogue = null
    player.lastThought = null
    // AI Turn
    let action;

    // [DECISIVE MOMENT ENGINE] Phase 1 (자동 리플레이): phase1Stream 기반 고속 AI 액션
    // Phase 2 (라이브): isPhase1Replay === false, 정상 AI/유저 플로우
    // presetActionInStream 방식은 완전 폐기
    const isGTO = (player.class && player.class.isBoss);
    if (isGTO) {
      action = getAdvancedAIAction(player, this);
    } else {
      action = getAIAction(player, this);
    }

    // [NEW] Collusion Strategy
    if (player.isPartner) {
      action = applyPartnerCollusion(player, this, action);
      handlePartnerCollusionSignals(player, action, this);
    }


    // [NEW] Inject Advanced Tough Call Monologues on the River
    // Skip this if the user has folded and fast-forward is active
    if (this.state === 'RIVER' && (this.currentRoundBet - player.currentBet) > 0 && !window.isFastFowardActive) {
      const advancedThoughtArray = generateToughCallThought(player, this, action);
      if (advancedThoughtArray && Array.isArray(advancedThoughtArray) && advancedThoughtArray.length > 0) {
        action.thoughtSequence = advancedThoughtArray;
      }
    }

    let delay = (action.delay || (1000 + Math.random() * 1000)) * ((window.isFastFowardActive || this.isPhase1Replay) ? 0.15 : 1);
    
    // If they have a narrative sequence, force a longer delay to read the text
    if (action.thoughtSequence) {
      const neededDelay = action.thoughtSequence.length * 2000; // 2 seconds per line
      delay = Math.max(delay, neededDelay) * (window.isFastFowardActive ? 0.2 : 1);
    }
    console.log(`[AI TURN] ${player.name} thinking for ${Math.floor(delay)}ms...${window.isFastFowardActive ? ' (FAST_FOLD)' : ''}`);
    // await sleep(delay); // Removed redundant sleep. Timer loop handles delay.
    // Safety check if state changed during delay

    // Simulate Time Bank Drain
    player.timeBankRemaining = player.maxTimeBank || 15; // Reset for visualization
    const step = 100;
    let elapsed = 0;
    
    // Thought sequence tracker
    let thoughtIndex = -1;
    let thoughtInterval = action.thoughtSequence ? delay / action.thoughtSequence.length : delay;

    // Animate the delay
    while (elapsed < delay) {
      if (this.checkSkipAction() || this.runoutInProgress) break;
      await sleep(step);
      elapsed += step;
      
      // Advance thought sequence based on elapsed time
      if (action.thoughtSequence) {
        const expectedIndex = Math.min(
          Math.floor(elapsed / thoughtInterval), 
          action.thoughtSequence.length - 1
        );
        if (expectedIndex !== thoughtIndex) {
          thoughtIndex = expectedIndex;
          player.lastThought = action.thoughtSequence[thoughtIndex];
        }
      }

      player.timeBankRemaining = Math.max(0, player.timeBankRemaining - (step / 1000));
    }
    if (this.checkSkipAction() || this.runoutInProgress) return;
    
    player.lastThought = null; // Clear thought right before taking action
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

      // [NEW] WAITING Trigger: Play takes > 10s and only 2 players left in pot
      if (!this.waitingTriggered && player.isHuman && player.timeBankRemaining < (player.maxTimeBank - 10)) {
        const activePlayers = this.players.filter(p => !p.isFolded && !p.isEliminated);
        if (activePlayers.length === 2) {
          const npc = activePlayers.find(p => !p.isHuman);
          if (npc) {
            chatAI(npc, CHAT_TRIGGERS.WAITING, "", 0, this);
            this.waitingTriggered = true;
          }
        }
      }

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
}

if (typeof window !== 'undefined') {
  window.GameEngineClass = GameEngine;
}

