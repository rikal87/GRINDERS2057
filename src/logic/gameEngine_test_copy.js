import { evaluateHand, createDeck } from './poker.js';
// import { getAIAction, AI_ARCHETYPES } from './aiEngine.js';
// import { audioManager } from './audioManager.js';

const audioManager = {
  playSFX: () => { },
  setFilter: () => { },
  play: () => { }
};

// Mock AI_ARCHETYPES
const AI_ARCHETYPES = {
  TAG: { name: 'Vanguard', aggression: 0.3 },
  LAG: { name: 'Maniac', aggression: 0.6 },
  PASSIVE: { name: 'Sentinel', aggression: 0.1 }
};


export const CLASSES = {
  VANGUARD: { name: 'Vanguard', philosophy: 'TAG', aggression: .32, maxRam: 100, skills: [{ id: 'hud', name: 'HUD', cost: 20, reserved: true }] },
  SENTINEL: { name: 'Sentinel', philosophy: 'Passive', aggression: .16, maxRam: 120, skills: [{ id: 'marriage', name: 'Wait', cost: 0 }] },
  HIJACK: { name: 'Hijack', philosophy: 'Cheater', aggression: .22, maxRam: 80, skills: [{ id: 'swap', name: 'Swap', cost: 50 }] },
  MANIAC: { name: 'Maniac', philosophy: 'LAG', aggression: .4, maxRam: 150, skills: [{ id: 'pressure', name: 'Push', cost: 20 }] }
};

export class GameEngine {
  constructor(playerClass = 'VANGUARD', tableSize = 2) {
    this.tableSize = tableSize;
    this.deck = [];
    this.board = [];
    this.pot = 0;
    this.currentRoundBet = 0;
    this.state = 'IDLE';
    this.dealerIndex = 0;
    this.currentPlayerIndex = 0;
    this.players = this.initializePlayers(playerClass, tableSize);
    this.gameOver = false;
    this.winnerId = null;
    this.playersActedCount = 0;
  }

  initializePlayers(humanClass, size) {
    const players = [];
    const INITIAL_CHIPS = 100;

    // Human
    players.push({
      id: 'player',
      name: 'YOU',
      class: CLASSES[humanClass],
      hand: [],
      chips: INITIAL_CHIPS,
      currentBet: 0,
      ram: { used: 0, reserved: 0 },
      isFolded: false,
      isHuman: true
    });

    const archetypes = Object.values(AI_ARCHETYPES);
    const classes = Object.values(CLASSES);

    for (let i = 1; i < size; i++) {
      players.push({
        id: `cpu_${i}`,
        name: `AGENT_${i}`,
        class: classes[i % classes.length],
        archetype: archetypes[i % archetypes.length],
        hand: [],
        chips: INITIAL_CHIPS,
        currentBet: 0,
        isFolded: false,
        isHuman: false
      });
    }
    return players;
  }

  startNewHand() {
    this.deck = createDeck();
    this.board = [];
    this.pot = 0;
    this.currentRoundBet = 0;
    this.playersActedCount = 0;
    this.players.forEach(p => {
      p.hand = [this.deck.pop(), this.deck.pop()];
      p.isFolded = p.chips <= 0; // Out of game if no chips
      p.currentBet = 0;
    });

    this.dealerIndex = (this.dealerIndex + 1) % this.tableSize;
    const sbIndex = (this.dealerIndex + 1) % this.tableSize;
    const bbIndex = (this.dealerIndex + 2) % this.tableSize;

    this.placeBet(this.players[sbIndex], 1);
    this.placeBet(this.players[bbIndex], 2);
    this.currentRoundBet = 2;
    this.currentPlayerIndex = (bbIndex + 1) % this.tableSize;
    this.state = 'PREFLOP';
  }

  placeBet(player, amount) {
    if (amount > player.chips) amount = player.chips;
    player.chips -= amount;
    player.currentBet += amount;
    this.pot += amount;
    if (player.currentBet > this.currentRoundBet) {
      this.currentRoundBet = player.currentBet;
      // If someone raises, others need a chance to respond
      this.playersActedCount = 0; // Reset to 0, handlePlayerAction will increment to 1
    }
  }

  handlePlayerAction(action) {
    const player = this.players[this.currentPlayerIndex];
    if (action.type === 'fold') {
      player.isFolded = true;
      audioManager.playSFX('card-dealt&fold');
      const activePlayers = this.players.filter(p => !p.isFolded);
      if (activePlayers.length === 1) {
        this.state = 'SHOWDOWN';
        this.resolveShowdown();
        return;
      }
    } else if (action.type === 'call') {
      const diff = this.currentRoundBet - player.currentBet;
      this.placeBet(player, diff);
      audioManager.playSFX('puti-n-chip');
    } else if (action.type === 'raise') {
      const diff = action.amount - player.currentBet;
      this.placeBet(player, diff);
      // Check for all-in
      if (player.chips === 0) {
        audioManager.playSFX('all-in-sign');
      }
      audioManager.playSFX('puti-n-chip');
    } else if (action.type === 'check') {
      // Check is valid if currentRoundBet is already matched by player
    }

    this.playersActedCount++;
    this.moveToNextPlayer();
  }

  moveToNextPlayer() {
    // Current active players include those with chips OR those who already made a bet this street (all-ins)
    const activePlayers = this.players.filter(p => !p.isFolded && (p.chips > 0 || p.currentBet > 0));

    // Check if betting round is over
    // A player is matched if they match the currentRoundBet OR if they are all-in
    const allMatched = activePlayers.every(p => p.currentBet === this.currentRoundBet || p.chips === 0);
    const everyoneActed = this.playersActedCount >= activePlayers.length;

    if (everyoneActed && allMatched) {
      if (activePlayers.length === 1) {
        this.state = 'SHOWDOWN';
        this.resolveShowdown();
      } else {
        this.nextStreet();
      }
      return;
    }

    // Find next eligible player
    let nextIdx = (this.currentPlayerIndex + 1) % this.tableSize;
    let attempts = 0;
    while ((this.players[nextIdx].isFolded || this.players[nextIdx].chips <= 0) && attempts < this.tableSize) {
      nextIdx = (nextIdx + 1) % this.tableSize;
      attempts++;
    }
    this.currentPlayerIndex = nextIdx;
  }

  nextStreet() {
    this.players.forEach(p => p.currentBet = 0);
    this.currentRoundBet = 0;
    this.playersActedCount = 0;

    // Determine next active player (even if they can't bet, strictly speaking we need a pointer, 
    // but if we are auto-running it matters less. We follow standard logic to find first non-folded player left of button)
    let nextIdx = (this.dealerIndex + 1) % this.tableSize;
    let attempts = 0;
    while ((this.players[nextIdx].isFolded || this.players[nextIdx].chips <= 0) && attempts < this.tableSize) {
      nextIdx = (nextIdx + 1) % this.tableSize;
      attempts++;
    }
    this.currentPlayerIndex = nextIdx;

    if (this.state === 'PREFLOP') {
      this.dealFlop();
    } else if (this.state === 'FLOP') {
      this.dealTurn();
    } else if (this.state === 'TURN') {
      this.dealRiver();
    } else if (this.state === 'RIVER') {
      this.state = 'SHOWDOWN';
      this.resolveShowdown();
      return;
    }

    // Check for Auto-Runout (All-in situation)
    // If fewer than 2 players have chips, no betting can occur.
    const activePlayers = this.players.filter(p => !p.isFolded);
    const capablePlayers = activePlayers.filter(p => p.chips > 0);

    if (activePlayers.length > 1 && capablePlayers.length <= 1 && this.state !== 'SHOWDOWN') {
      console.log(`Auto-Runout active: ${this.state} -> Next Street in 2.5s`);
      setTimeout(() => {
        this.nextStreet();
      }, 2500);
    }
  }

  resolveShowdown() {
    const activePlayers = this.players.filter(p => !p.isFolded);
    const results = activePlayers.map(p => ({
      id: p.id,
      player: p,
      hand: evaluateHand([...p.hand, ...this.board])
    }));
    results.sort((a, b) => b.hand.total - a.hand.total);

    const winner = results[0].player;
    winner.chips += this.pot;
    this.pot = 0;
    this.checkBankruptcy();
  }

  checkBankruptcy() {
    if (this.players[0].chips <= 0) {
      this.gameOver = true;
      this.winnerId = 'cpu';
      return true; // Player is bankrupt
    }
    return false;
  }

  resetGame() {
    this.players = this.initializePlayers(this.players[0].class.name.toUpperCase(), this.tableSize);
    this.gameOver = false;
    this.state = 'IDLE';
  }

  dealFlop() {
    this.deck.pop();
    this.board.push(this.deck.pop(), this.deck.pop(), this.deck.pop());
    this.state = 'FLOP';
  }

  dealTurn() {
    this.deck.pop();
    this.board.push(this.deck.pop());
    this.state = 'TURN';
  }

  dealRiver() {
    this.deck.pop();
    this.board.push(this.deck.pop());
    this.state = 'RIVER';
  }

  useSkill(player, skillId) {
    // Basic skill stub
    const skill = player.class.skills.find(s => s.id === skillId);
    if (!skill) return false;
    if (player.ram.used + skill.cost > player.class.maxRam) return false;
    player.ram.used += skill.cost;
    return true;
  }
}
