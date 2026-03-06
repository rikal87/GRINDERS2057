
import { calculateEquity, createDeck } from './poker.js';
import { getAIAction, chatAI, } from './aiEngine.js';
import { getAdvancedAIAction } from './aiEngineAdvanced.js';
import { CHAT_TRIGGERS } from './persona.js'
import { gainBankroll, store } from './store.js';
// Mock audioManager
const audioManager = {
  playSFX: () => { },
  setFilter: () => { },
  setPlaybackRate: () => { },
  play: () => { }
};
import { PotManager } from './PotManager.js';
// import { SKILL_DATA } from './skills.js'; // Mock or ignore if not needed for this test
const SKILL_DATA = [];
import { EventAdaptor } from './gameEngineEventAdaptor.js';
import { gainXP } from './store.js';
import { CLASSES, CLASSES_ENEMY, CLASSES_ENEMY_HIGHSTAKE, CLASSES_ENEMY_BOSS } from './persona.js';
import { zones } from './zone_node.js'; // IMPORT FROM MOCK

const eventAdaptor = new EventAdaptor();
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export class GameEngine {
  constructor(playerClass = 'VANGUARD', tableSize = 2, sb = 1, bb = 2, buyin = 1000, rake = 0.05, rakeCap = 50, isAdvanced = false, locationId = 'micro_street_shop') {
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
    this.buyInMultiply = 1; // Default
    this.players = this.initializePlayers(playerClass, tableSize);
    this.gameOver = false;
    this.winnerId = null;
    this.playersActedCount = 0;
    this.runoutInProgress = false;
    this.pressureActive = false;
    this.victoryPrize = 0;
    this.lastTriggeredItem = null;
    this.potManager = new PotManager(this.rake, this.rakeCap);
    this.handHistory = [];
    this.currentHandHistory = null;
    this.processingAI = false;

    this.turnTimer = null;
    this.currentStreetRaises = 0;
    this.pot = 0;
    this.aggressor = null;
    this.locationId = locationId;
  }

  get currentRoundBet() { return this.potManager.currentRoundBet; }

  initializePlayers(humanClass, size) {
    const players = [];

    const YOU = {
      id: 'player',
      name: 'YOU',
      class: CLASSES[humanClass],
      hand: [],
      chips: this.buyIn * this.buyInMultiply,
      currentBet: 0,
      totalWagered: 0,
      ram: { used: 0, reserved: 0 },
      isFolded: false,
      isHuman: true,
      isMe: true,
      gainedXp: 0,
      effectCooldowns: {},
      item: store.equippedProtector,
      tempXPBonus: 0.0,
      stats: {
        handsPlayed: 0,
        vPIPCount: 0,
        facedFlopBet: 0,
        foldedToFlopBet: 0,
        aggressiveActions: 0,
        calls: 0,
        get vPIP() { return this.handsPlayed > 0 ? this.vPIPCount / this.handsPlayed : 0; },
        get foldToFlop() { return this.facedFlopBet > 0 ? this.foldedToFlopBet / this.facedFlopBet : 0; },
        get aggressionFactor() { return this.calls > 0 ? this.aggressiveActions / this.calls : (this.aggressiveActions > 0 ? 10 : 0); }
      },
      baseMaxRam: CLASSES[humanClass].maxRam,
      get maxRam() { return this.baseMaxRam; },
      get maxTimeBank() { return 30; },
      get buyInMultiply() { return 1; },
      timeBankRemaining: 30,
      recoverRam: function (amount) { },
      addStatus: function (status) { }
    }
    this.processBuyIn(YOU)
    players.push(YOU)

    let availableEnemies = [];
    const bossPool = [...CLASSES_ENEMY_BOSS].filter(p => p.isBoss).sort(() => Math.random() - 0.5);

    let locationConfig = null;
    for (const zone of zones) {
      const loc = zone.locations.find(l => l.id === this.locationId);
      if (loc) {
        locationConfig = loc;
        break;
      }
    }

    if (locationConfig && locationConfig.npcs) {
      console.log(`[GAME] Initializing NPCs for ${locationConfig.name}:`, locationConfig.npcs);

      const allowedNames = locationConfig.npcs;
      const zoneRegulars = CLASSES_ENEMY.filter(enemy => allowedNames.includes(enemy.name));

      availableEnemies = [...zoneRegulars];

      if (allowedNames.includes('Named_Pro')) {
        console.log(`[GAME] Named_Pro detected. Adding a random Boss to pool.`);
        if (bossPool.length > 0) {
          availableEnemies.push(bossPool[0]);
        }
      }
    } else {
      console.warn(`[GAME] No NPC config found for ${this.locationId}. Using full pool.`);
      availableEnemies = [...CLASSES_ENEMY];
    }

    availableEnemies.sort(() => Math.random() - 0.5);

    for (let i = 1; i < size; i++) {
      let villan;
      if (availableEnemies.length > 0) {
        villan = availableEnemies.pop();
      } else {
        if (locationConfig && locationConfig.npcs) {
          const allowedNames = locationConfig.npcs;
          const zoneRegulars = CLASSES_ENEMY.filter(enemy => allowedNames.includes(enemy.name));
          villan = zoneRegulars[Math.floor(Math.random() * zoneRegulars.length)];
        } else {
          villan = CLASSES_ENEMY[Math.floor(Math.random() * CLASSES_ENEMY.length)];
        }
      }

      const aiPlayer = {
        id: `cpu_${i} `,
        name: `${villan.name}`,
        tempXPBonus: 0,
        class: villan,
        hand: [],
        chips: this.buyIn * villan.chipMultiply,
        currentBet: 0,
        totalWagered: 0,
        isFolded: false,
        isHuman: false,
        item: null,
        recoverRam: function (amount) { },
        addStatus: function (status) { },
        maxTimeBank: 30,
        timeBankRemaining: 30
      };

      players.push(aiPlayer);
    }
    return players;
  }

  processBuyIn(player) {
    player.chips = this.buyIn; // Simplified for test
    return true;
  }
}
