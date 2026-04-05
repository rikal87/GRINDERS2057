export class HandHistoryManager {
  constructor() {
    this.handHistory = [];
    this.currentHandHistory = null;
    this.actionHistory = []; 
  }

  startNewHand(players, blinds) {
    this.actionHistory = [];
    this.currentHandHistory = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      players: players.map(p => ({ name: p.name, chips: p.chips, id: p.id })),
      blinds: blinds,
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
  }

  recordAction(street, player, type, amount, pot) {
    if (this.currentHandHistory && this.currentHandHistory.actions[street]) {
      this.currentHandHistory.actions[street].push({
        player: player.name,
        type: type,
        amount: amount || 0,
        playerChips: player.chips,
        pot: pot
      });
    }

    this.actionHistory.push({
      playerId: player.id,
      street: street,
      action: type,
      amount: amount || 0,
      potSize: pot
    });
  }

  finalizeHistory(result, pot, board) {
    if (!this.currentHandHistory) return;
    
    const winnerResult = result.results.find(res => res.id === result.winnerId);
    this.currentHandHistory.winner = result.isChop ? `CHOP (${result.choppers.join(', ')})` : result.winnerId;
    this.currentHandHistory.winnerHand = winnerResult ? winnerResult.hand.name : 'Unknown Hand';
    this.currentHandHistory.pot = pot;
    this.currentHandHistory.board = [...board];
    this.currentHandHistory.detailedPots = result.detailedPots || [];
    this.currentHandHistory.playerResults = result.results || [];
    
    this.handHistory.unshift(this.currentHandHistory);
    if (this.handHistory.length > 200) this.handHistory.pop(); // Keep last 200 hands
  }
}
