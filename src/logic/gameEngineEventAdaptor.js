
import { store, gainBankroll } from './store.js';
import { evaluateHand } from './poker.js';
export class EventAdaptor {
  updateEquippedEffects() {

  }
  chat({ players, playerId, message }) {
    console.info('chat', playerId, message);
  }
  roundStart(players, street) {
    console.info('roundStart');
    players.forEach(p => {
      p.item?.effects?.forEach(e => {
        if (e.trigger.includes('round_start')) {
          this.executeItemEffect(p, e, { street });
        }
      });
    });
  }
  preflopStart() {
    console.info('preflopStart');
  }
  startStreet(street) {
    console.info('startStreet', street);
  }
  endStreet(street) {
    console.info('endStreet', street);
  }
  roundEnd(players, street) {
    console.info('roundEnd');
    players.forEach(p => {
      p.item?.effects?.forEach(e => {
        if (e.trigger.includes('round_end')) {
          this.executeItemEffect(p, e, { street });
        }
      });
    });
  }
  gameOver({ winnerId }) {
    console.info('gameOver', winnerId);
  }
  playerEliminated(player) {
    console.info('playerEliminated', player.name);
  }
  gameWon({ player, prize }) {
    console.info('gameWon', player.name, prize);
  }
  bet({ player, amount, pot }) {
    // console.info('bet', player, amount, pot);
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('bet')) {
        this.executeItemEffect(player, e, { amount, pot });
      }
    });
  }
  blindPay({ player, amount, pot }) {
    // console.info('blindPay', player, amount, pot);
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('blind_pay')) {
        this.executeItemEffect(player, e, { amount, pot });
      }
    });
  }
  showdown({ result, amount, pot, runoutInProgress, board }) {
    // console.info('showdown', result);
    result.results.forEach(r => {
      if (r.id === result.winnerId) {
        if (runoutInProgress) this.winAtShowdownWithAllIn({ player: r.player, amount, pot, hand: r.hand, board });
        else this.winAtShowdown({ player: r.player, amount, pot, hand: r.hand, board });
      } else {
        if (runoutInProgress) this.loseAtShowdownWithAllIn({ player: r.player, amount, pot, hand: r.hand, board });
        else this.loseAtShowdown({ player: r.player, amount, pot, hand: r.hand, board });
      }
    });
  }
  winAtShowdown({ player, amount, pot, hand, board }) {
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('winAtShowdown') || e.trigger.includes('win')) {
        this.executeItemEffect(player, e, { amount, pot, equity: player.equity, hand, board, isWin: true });
      }
    });
  }
  winAtShowdownWithAllIn({ player, amount, pot, hand, board }) {
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('winAtShowdownWithAllIn') || e.trigger.includes('win')) {
        this.executeItemEffect(player, e, { amount, pot, equity: player.equity, hand, board, isWin: true });
      }
    });
  }
  winAtWithoutShowdown({ player, amount, pot, hand, board }) {
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('winWithoutShowdown') || e.trigger.includes('win')) {
        this.executeItemEffect(player, e, { amount, pot, hand, board, isWin: true });
      }
    });
  }
  loseAtShowdownWithAllIn({ player, amount, pot, hand, board }) {
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('loseAtShowdownWithAllIn') || e.trigger.includes('lose')) {
        this.executeItemEffect(player, e, { amount, pot, equity: player.equity, hand, board, isWin: false });
      }
    });
  }

  loseAtShowdown({ player, amount, pot, hand, board }) {
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('loseAtShowdown') || e.trigger.includes('lose')) {
        this.executeItemEffect(player, e, { amount, pot, equity: player.equity, hand, board, isWin: false });
      }
    });
  }

  fold({ player, amount, pot, board }) {
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('fold')) {
        this.executeItemEffect(player, e, { amount, pot, board });
      }
    });
  }
  dealFlop() {

  }
  dealTurn() {

  }
  dealRiver() {

  }
  rebuy({ player, amount }) {

  }
  gainXP({ player, amount, bb, isHighStakes, locationLV }) {
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('gainXP')) {
        this.executeItemEffect(player, e, { amount, bb, isHighStakes, locationLV });
      }
    });
  }
  bankruptcy({ player }) {
    console.info('bankruptcy', player.item);
    let rescueFund = player.level * 2000;
    store.bankroll = rescueFund;
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('bankrupt')) {
        this.executeItemEffect(player, e, { amount: rescueFund });
      }
    });

    // store.xp = 0;
  }
  useSkill({ player, skill }) {

  }
  executeItemEffect(player, effect, context) {
    // Normalize effect structure: support both flattened (activeEffects) and raw (item.effects)
    // const effect = e.effect ? { ...e, type: e.effect.type, value: e.effect.value } : e;
    // console.info('executeItemEffect', player, effect, context);

    switch (effect.id) {
      case 'synapse_reading':
        // Trigger: 'flop'
        if (context.street === 'ROUND_START') {
          if (effect.cooldown === 0) {
            console.log('[EFFECT] Synapse Reading ACTIVATED!');
            effect.isActivated = true;
            effect.cooldown = effect.maxCooldown;
          }
          else {
            // console.log(`[EFFECT] Synapse Cooldown: ${effect.cooldown}`);
            effect.cooldown--;
          }
        } else if (context.street === 'ROUND_END') {
          console.log('[EFFECT] Synapse Reading DEACTIVATED');
          effect.isActivated = false; // for debug
        }

        break;
      case 'initial_bankroll_bonus':
        store.bankroll += Math.floor(context.amount * effect.value);
        break;
      case 'ram_max':
        // Passive
        break;

      case 'ram_regen':
        // Passive
        break;

      case 'ghost_bet':
        // Trigger: 'bet'
        if (context.amount > 0 && Math.random() < effect.value) {
          const refund = context.amount;
          player.chips += refund;
          // this.potManager.pot -= refund; // Keeping pot same as "Free Bet"
          console.log(`[ITEM EFFECT] Bet Refund triggered! +${refund}`);
        }
        break;

      case 'pre_flop_fold_refund':
        // Trigger: 'fold'
        if (this.state === 'PREFLOP') {
          const refundAmount = Math.ceil(player.totalWagered * effect.value);
          if (refundAmount > 0) {
            player.chips += refundAmount;
            console.log(`[ITEM EFFECT] Fold Refund: ${refundAmount}`);
          }
        }
        break;

      case 'blind_discount':
        // Trigger: 'blind_pay'
        const discount = Math.ceil(context.amount * effect.value);
        player.chips += discount;
        break;
      // --- Showdown / End Hand Effects ---
      case 'pot_bonus':
        // Trigger: 'win'
        const bonus = Math.ceil(player.totalWagered * effect.value.value);
        player.chips += bonus;
        break;

      case 'allin_insurance':
        // Trigger: 'allin_lose'
        const equity = context.equity || 0;
        const recovery = Math.ceil((player.totalWagered || 0) * (equity / 100) * effect.value.value);
        if (recovery > 0) {
          player.chips += recovery;
        }
        break;

      case 'showdown_lose_refund':
        // Trigger: 'showdown_lose'
        const wagered = player.totalWagered || 0;
        const refundShowdown = Math.ceil(wagered * effect.value.value);
        console.info('showdown_refund', player, refundShowdown);
        player.chips += refundShowdown;
        break;
      case 'chip_rounding':
        const unit = player.chipRounding;
        const bonusChips = Math.ceil(player.totalWagered / unit) * unit;
        player.chips += bonusChips - player.totalWagered;
        break;
      case 'rake_reduction':
        // Trigger: 'win' or 'showdown_win'
        // implement in pot manager
        break;
      case 'golden_touch': {
        const chipBonus = effect.value * context.amount;
        gainBankroll(chipBonus);
        break;
      }
      case 'xp_boost':
        player.tempXPBonus += effect.value;
        break;
      case 'pair_master':
        // Trigger: 'win'
        const t = [...player.hand, ...(context.board || [])];
        const maid = evaluateHand(t);
        console.info('pair_master', maid);
        if (maid) {
          const isPair = maid.rank == 2 || maid.rank == 3;
          if (isPair) player.tempXPBonus += effect.value;
        }
        break;
      case 'cooler':
        const isCooler = context.result ? context.result.results.find(r => r.id === 'player').hand.rank >= 7 : false;
        if (isCooler) {
          player.tempXPBonus += effect.value
        }
        break;
      case 'outkicked':
        const winnerHandName = context.result ? context.result.results.find(r => r.id === context.result.winnerId).hand.name : '';
        const playerHandName = context.result ? context.result.results.find(r => r.id === 'player').hand.name : '';
        if (winnerHandName === playerHandName) {
          player.tempXPBonus += effect.value
        }
        break;
      case 'double_down': {
        const h = context.result.results.find(r => r.isMe)?.hand.rank;
        if (h) {
          const isStraight = h == 5 || h == 9;
          if (isStraight) player.tempXPBonus += effect.value;
        }
      } break;
      case 'flush_master': {
        const isFlush = context.result ? context.result.results.find(r => r.isMe)?.hand.rank == 6 : false;
        if (isFlush) player.tempXPBonus += effect.value;
      } break;
      case 'full_house_master': {
        const isFullHouse = context.result ? context.result.results.find(r => r.isMe)?.hand.rank == 7 : false;
        if (isFullHouse) player.tempXPBonus += effect.value;
      } break;
      case 'straight_flush_master': {
        const isStraightFlush = context.result ? context.result.results.find(r => r.isMe)?.hand.rank == 9 : false;
        if (isStraightFlush) player.tempXPBonus += effect.value;
      } break;
      case 'four_of_a_kind_master': {
        const isFourOfAKind = context.result ? context.result.results.find(r => r.isMe)?.hand.rank == 8 : false;
        if (isFourOfAKind) player.tempXPBonus += effect.value;
      } break;
      case 'royal_flush_master': {
        const isRoyalFlush = context.result ? context.result.results.find(r => r.isMe)?.hand.rank == 10 : false;
        if (isRoyalFlush) player.tempXPBonus += effect.value;
      } break;
      case 'blackjack_master': {
        // ['Ah', 'Jc']
        const isBlackjack = player.hand.includes('A') && player.hand.includes('J')
        if (isBlackjack) player.tempXPBonus += effect.value;
      } break;
      case 'sets_master': {
        const isSets = context.result ? context.result.results.find(r => r.isMe)?.hand.rank == 4 : false;
        if (isSets) player.tempXPBonus += effect.value;
      } break;
      case 'failure_is_mother_of_success': {
        // [FIX] effect is the flattened item object now
        if (context.isWin) {
          effect.stack = 1; // Reset stack on win
        } else {
          effect.stack = (effect.stack || 1) + 1; // Increment stack on lose
          player.tempXPBonus += effect.value
        }
        break;
      }
      case 'winner_master': {
        // [FIX] effect is the flattened item object
        if (context.isWin) {
          effect.stack = (effect.stack || 1) + 1; // Increment stack on win
          player.tempXPBonus += effect.value
        } else {
          effect.stack = 1; // Reset stack on lose
        }
        break;
      }

      case 'diamond_collector':
      case 'heart_collector':
      case 'spade_collector':
      case 'club_collector':
        const suitMap = {
          'diamond_collector': 'd', 'heart_collector': 'h',
          'spade_collector': 's', 'club_collector': 'c'
        };
        const targetSuit = suitMap[effect.id];
        let count = 0;
        const allCards = [...player.hand, ...(context.board || [])];
        allCards.forEach(c => { if (c && c.suit === targetSuit) count++; });
        const collectionBonus = Math.floor((player.totalWagered || 0) * count * effect.value);
        if (collectionBonus > 0) {
          player.chips += collectionBonus;
        }
        break;

      case 'lucky_7_collector':
        let count7 = 0;
        [...player.hand, ...(context.board || [])].forEach(c => { if (c && c.rank === '7') count7++; });
        const bonus7 = Math.floor((player.totalWagered || 0) * count7 * effect.value);
        if (bonus7 > 0) {
          player.chips += bonus7;
        }
        break;

      case 'omen':
        let count6 = 0;
        [...player.hand, ...(context.board || [])].forEach(c => { if (c && c.rank === '6') count6++; });
        const bonus6 = Math.floor((player.totalWagered || 0) * count6 * effect.value);
        if (bonus6 > 0) {
          player.chips += bonus6;
        }
        break;

      case 'ram_steal':
        player.recoverRam(effect.value);
        this.notifyEffect(effect, `Stole ${effect.value} RAM`);
        break;

      case 'quantum_luck':
        const qBonus = Math.floor((player.totalWagered || 0) * (100.0 - context.equity || 100) * effect.value);
        console.info('quantum_luck', qBonus);
        if (qBonus > 0) {
          player.chips += qBonus;
        }
        break;


      default:
        console.log(`[ITEMS] Effect ${effect.id} handled externally or passive.`);
        break;
    }
  }
  notifyEffect(effect, message) {
    // Helper to show toast/log
    const name = effect.originalDef?.name || effect.name || 'Item Effect';
    console.log(`[EFFECT] ${name}: ${message}`);
    // TODO: Connect to UI Toast system
  }
}