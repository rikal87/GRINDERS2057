
import { store, gainBankroll, gainLT } from './store.js';
import { evaluateHand } from './poker.js';
import { recoverStamina } from './staminaSystem.js';
import { scheduleEvent, EVENT_ID } from './eventSystem.js';
import { PARTNER_ID, TYPE_CHANGE_BANKROLL } from './constants.js';
import { recordPlayStatsSession, PLAY_RECORD_STATS_TYPE } from './playRecordStats.js';
import { ITEM_EFFECT_ID } from './itemsEffect.js';


// const cleanupInvites = (locationId) => {
//   store.messages = store.messages.filter(m => {
//     // Keep message if it has no actions OR its action is not ACCEPT_INVITE for this location
//     return !m.actions?.some(a => a.actionType === 'ACCEPT_INVITE' && a.payload?.location_id === locationId);
//   });
// };

export class EventAdaptor {
  updateEquippedEffects() {

  }
  chat({ players, playerId, message }) {
    console.info('chat', playerId, message);
  }
  roundStart(players, { sb, bb }) {
    console.info('roundStart');
    players.forEach(p => {
      p.item?.effects?.forEach(e => {
        if (e.trigger.includes('round_start')) {
          this.executeItemEffect(p, e, { sb, bb });
        }
      });
    });
  }
  cashout(player, { netWinnings, gainedXP, stats }) {
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('cashout')) {
        this.executeItemEffect(player, e, { netWinnings, gainedXP, stats });
      }
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
  roundEnd({ players, street, bestWinner }) {
    console.info('roundEnd');
    players.forEach(p => {
      p.item?.effects?.forEach(e => {
        if (e.trigger.includes('round_end')) {
          this.executeItemEffect(p, e, { street, bestWinner });
        }
        if (e.cooldown > 0) e.cooldown--;
      });
    });
    // // Update bankroll peaks
    // if (store.play_stats.max_bankroll < store.bankroll) {
    //   store.play_stats.max_bankroll = store.bankroll;
    // }
  }
  gameOver({ winnerId }) {
    console.info('gameOver', winnerId);
  }
  bustEnemy(player, bestWinner) {
    recordPlayStatsSession(bestWinner, PLAY_RECORD_STATS_TYPE.BUST_ENEMY, { enemyClass: player.class.id });
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('bust_enemy')) {
        this.executeItemEffect(player, e, {});
      }
    });
  }

  playerBankrupt(player, bestWinner, locationId, inviteId) {
    console.info('playerBankrupt', player.name);
    recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.BANKRUPT);
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('bankrupt')) {
        this.executeItemEffect(player, e, {});
      }
    });
    // An NPC went bankrupt
    if (player.id === PARTNER_ID.MAX) {
      scheduleEvent(EVENT_ID.MAX.ELIMINATED, 5);
    }
    if (player.id === PARTNER_ID.FLORENCE) {
      scheduleEvent(EVENT_ID.FLORENCE.ELIMINATED, 5);
    }
  }
  // TODO: CHANGE WON LOGIC
  gameWon(player, prize, locationId, inviteId) {
    console.info('gameWon', player.name, prize);
    // // cleanupInvites(locationId);
    // deleteMessage(inviteId);
    // let firstClearReward = null;
    // for (const tier of zones) {
    //   const loc = tier.locations.find(l => l.id === locationId);
    //   if (loc && loc.firstClearReward) {
    //     firstClearReward = loc.firstClearReward;
    //     break;
    //   }
    // }
    // if (firstClearReward) {
    //   if (!store.unlockedLocations) store.unlockedLocations = [];
    //   if (!store.unlockedLocations.includes(firstClearReward)) {
    //     store.unlockedLocations.push(firstClearReward);
    //     console.log(`[GAME] First Clear Reward Awarded: ${firstClearReward}`);
    //   }
    // }
  }
  // TODO: THIS IS NOT USED MAYBE COMBINE TO CASHOUT LOGIC
  playerLeaveTable(player, locationId, allPlayers, inviteId) {
    console.info('playerLeaveTable', player.name, locationId, inviteId);
    if (!player.isMe) return;
    // cleanupInvites(locationId);
  }

  raise({ player, amount, pot, street }) {
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('raise') || e.trigger.includes('bet')) {
        this.executeItemEffect(player, e, { amount, pot });
      }
    });
  }
  call({ player, amount, pot, street }) {
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('call')) {
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
    result.results.forEach(r => {
      recordPlayStatsSession(r.player, PLAY_RECORD_STATS_TYPE.WTSD);
      if (r.isWinner) {
        recordPlayStatsSession(r.player, PLAY_RECORD_STATS_TYPE.WIN, { pot: r.amountWon, amount: r.player.totalWagered, equity: r.player.equity, rake: result.rake, rakeSaved: r.rakeSaved, isShowDown: true });
        if (runoutInProgress) this.winAtShowdownWithAllIn({ player: r.player, amount: r.amountWon, pot, hand: r.hand, board, result });
        else this.winAtShowdown({ player: r.player, amount: r.amountWon, pot, hand: r.hand, board, result });
      } else {
        recordPlayStatsSession(r.player, PLAY_RECORD_STATS_TYPE.LOSE, { pot: r.player.totalWagered, amount: r.amountWon, equity: r.player.equity, isShowDown: true });
        if (runoutInProgress) this.loseAtShowdownWithAllIn({ player: r.player, amount: 0, pot, hand: r.hand, board, result });
        else this.loseAtShowdown({ player: r.player, amount: 0, pot, hand: r.hand, board, result });
      }
    });
  }
  winAtWithoutShowdown({ result, amount, pot, board }) {
    result.results.forEach(r => {
      recordPlayStatsSession(r.player, PLAY_RECORD_STATS_TYPE.WIN, { pot: r.amountWon, amount: r.player.totalWagered, rake: result.rake, rakeSaved: r.rakeSaved, isShowDown: false });
      r.player.item?.effects?.forEach(e => {
        if (e.trigger.includes('winWithoutShowdown') || e.trigger.includes('win')) {
          this.executeItemEffect(r.player, e, { amount: r.amountWon, pot: r.amountWon, hand: r.player.hand, board, isWin: true, result });
        }
      });
    });
  }
  loseAtShowdown({ player, amount, pot, board, result }) {
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('loseAtShowdown') || e.trigger.includes('lose')) {
        this.executeItemEffect(player, e, { amount, pot, equity: player.equity, hand, board, isWin: false, result });
      }
    });
  }
  winAtShowdown({ player, amount, pot, hand, board, result }) {
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('winAtShowdown') || e.trigger.includes('win')) {
        this.executeItemEffect(player, e, { amount, pot, equity: player.equity, hand, board, isWin: true, result });
      }
    });
  }
  winAtShowdownWithAllIn({ player, amount, pot, hand, board, result }) {
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('winAtShowdownWithAllIn') || e.trigger.includes('win')) {
        this.executeItemEffect(player, e, { amount, pot, equity: player.equity, hand, board, isWin: true, result });
      }
    });
  }

  loseAtShowdownWithAllIn({ player, amount, pot, hand, board, result }) {
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('loseAtShowdownWithAllIn') || e.trigger.includes('lose')) {
        this.executeItemEffect(player, e, { amount, pot, equity: player.equity, hand, board, isWin: false, result });
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

  fold({ player, amount, pot, board, street, players }) {
    if (player.totalWagered > 0) {
      recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.LOSE, { pot: player.totalWagered, amount: 0 });
    }
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('fold')) {
        this.executeItemEffect(player, e, { amount, pot, board, street, players });
      }
      if (player.totalWagered > 0 && e.trigger.includes('lose')) {
        this.executeItemEffect(player, e, { amount, pot, equity: player.equity, hand: player.hand, board, isWin: false });
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
  gainXP({ player, amount }) {
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('gainXP')) {
        this.executeItemEffect(player, e, { amount });
      }
    });
  }
  bankruptcy({ player }) {
    console.info('bankruptcy', player.item);
    if (player.isMe) {
      store.play_stats.bankruptcy_count++;
    }
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('bankrupt')) {
        this.executeItemEffect(player, e, {});
      }
    });

    // store.xp = 0;
  }
  action({ player, type, street, amount, preflopRaises }) {
    switch (type) {
      case 'FOLD':
        recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.FOLD);
        if (street === 'FLOP' && player.totalWagered > 0) {
          recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.FOLDED_TO_FLOP_BET);
        }
        break;
      case 'CHECK':
        recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.CHECK);
        break;
      case 'CALL':
        recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.CALL);
        if (street === 'PREFLOP' && !player.isJoinPot) {
          recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.VPIP);
          player.isJoinPot = true;
        }
        break;
      case 'ALL_IN':
      case 'RAISE':
      case 'BET':
        recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.RAISE);
        if (street === 'PREFLOP') {
          if (!player.isJoinPot) {
            recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.VPIP);
            player.isJoinPot = true;
          }
          recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.PFR);
          if (preflopRaises === 2) {
            recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE._3BET);
          }
          if (preflopRaises >= 3) {
            recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE._4BET_OR_MORE);
          }
        }
        break;
    }
  }
  executeItemEffect(player, effect, context) {
    if (effect.cooldown > 0) {
      return;
    }
    switch (effect.id) {
      case ITEM_EFFECT_ID.SHOW_ME_YOUR_BLUFF:
        const existBestWinner = context.bestWinner;
        if (existBestWinner) {
          if (!existBestWinner.isMe && Math.random() < effect.value) {
            console.log('[EFFECT] Show Me Bluff ACTIVATED!');
            existBestWinner.showHoleCards = true;
            effect.cooldown = effect.maxCooldown;
          }
        }
        break;
      case ITEM_EFFECT_ID.STONK: {
        const stats = context.stats;
        if (stats && stats.hands_played > 0 && context.netWinnings > 0) {
          const volatility = Math.random() * effect.value + 0.01;
          const bonus = Math.floor(context.netWinnings * volatility);
          if (Math.random() <= (stats.w$sd / stats.wtsd) * 100) {
            gainBankroll(bonus, TYPE_CHANGE_BANKROLL.ITEM_EFFECT);
            recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.ITEM_EFFECT, { amount: bonus })
          } else {
            gainBankroll(-bonus, TYPE_CHANGE_BANKROLL.ITEM_EFFECT);
            recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.ITEM_EFFECT, { amount: -bonus })
          }
          break;
        }
      }
      case ITEM_EFFECT_ID.BADBEAT_JACKPOT:
        // to-do 어케만들지
        if (!context.isWin) {
          const bonus = Math.floor(player.initialChips * effect.value);
          gainBankroll(bonus, TYPE_CHANGE_BANKROLL.ITEM_EFFECT);
          recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.ITEM_EFFECT, { amount: bonus })
        }
        break;
      case ITEM_EFFECT_ID.COOLDOWN_REDUCTION:
        player.item?.effects?.forEach(e => {
          if (e.id !== ITEM_EFFECT_ID.COOLDOWN_REDUCTION) {
            e.cooldown = Math.max(0, e.cooldown - effect.value);
          }
        });
        break;
      case ITEM_EFFECT_ID.EMERGENCY_FUND:
        gainBankroll(effect.valueCalc, TYPE_CHANGE_BANKROLL.ITEM_EFFECT);
        recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.ITEM_EFFECT, { amount: effect.valueCalc })
        effect.cooldown = effect.maxCooldown;
        break;
      case ITEM_EFFECT_ID.SMOKE_BREAK:
        recoverStamina(effect.value);
        gainLT(-effect.value);
        effect.cooldown = effect.maxCooldown;
        break;
      case ITEM_EFFECT_ID.LT_RECOVERY:
        gainLT(effect.value);
        break;
      case ITEM_EFFECT_ID.STEMINA_REGEN:
        recoverStamina(effect.value);
        effect.cooldown = effect.maxCooldown;
        break;
      case ITEM_EFFECT_ID.DOPAMINE_ADDICTION:
        recoverStamina(effect.value);
        effect.cooldown = effect.maxCooldown;
        break;
      case ITEM_EFFECT_ID.LAST_STAND:
        if (player.chips <= context.bb * 25) {
          gainLT(effect.value)
        }
        break;
      case ITEM_EFFECT_ID.LT_REGEN_PLUS:
        gainLT(effect.value)
        effect.cooldown = effect.maxCooldown;
        break;
      case ITEM_EFFECT_ID.JOY_OF_VITALITY:
        if (context.isWin) {
          recoverStamina(effect.value);
        }
        break;
      case ITEM_EFFECT_ID.TILT_RECOVERY:
        if (!context.isWin) {
          recoverStamina(effect.value);
        }
        break;
      case ITEM_EFFECT_ID.SYNAPSE_READING:
        if (!effect.isActivated) {
          console.log('[EFFECT] Synapse Reading ACTIVATED!');
          effect.isActivated = true;
        } else {
          console.log('[EFFECT] Synapse Reading DEACTIVATED');
          effect.isActivated = false;
          effect.cooldown = effect.maxCooldown;
        }
        break;
      case ITEM_EFFECT_ID.GHOST_BET:
        // Trigger: 'bet'
        if (context.amount > 0 && Math.random() < effect.value) {
          const refund = context.amount;
          player.chips += Math.ceil(refund);
          // this.potManager.pot -= refund; // Keeping pot same as "Free Bet"
          console.log(`[ITEM EFFECT] Bet Refund triggered! +${refund}`);
        }
        break;
      case ITEM_EFFECT_ID.PRE_FLOP_FOLD_REFUND:
        // Trigger: 'fold'
        if (this.state === 'PREFLOP') {
          const refundAmount = Math.ceil(player.totalWagered * effect.value);
          if (refundAmount > 0) {
            player.chips += refundAmount;
            console.log(`[ITEM EFFECT] Fold Refund: ${refundAmount}`);
          }
        }
        break;
      case ITEM_EFFECT_ID.BLIND_DISCOUNT:
        // Trigger: 'blind_pay'
        const discount = Math.ceil(context.amount * effect.value);
        player.chips += discount;
        break;
      // --- Showdown / End Hand Effects ---
      case ITEM_EFFECT_ID.SESSION_PROFIT_BONUS:
        // Trigger: 'cashout'
        if (context.netWinnings > 0) {
          const bonus = Math.ceil(context.netWinnings * (effect.value || 0));
          gainBankroll(bonus, TYPE_CHANGE_BANKROLL.ITEM_EFFECT);
          recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.ITEM_EFFECT, { amount: bonus })
        }
        break;

      case ITEM_EFFECT_ID.ALLIN_INSURANCE:
        // Trigger: 'allin_lose'
        const equity = context.equity || 0;
        if (!context.isWin && equity <= 70) {
          const recovery = Math.ceil((player.totalWagered || 0) * (equity / 100) * effect.value);
          if (recovery > 0) {
            player.chips += recovery;
          }
          effect.cooldown = effect.maxCooldown;
        }
        break;
      case ITEM_EFFECT_ID.SHOWDOWN_LOSE_REFUND:
        // Trigger: 'showdown_lose'
        const wagered = player.totalWagered || 0;
        const refundShowdown = Math.ceil(wagered * effect.value);
        console.info('showdown_refund', player, refundShowdown);
        player.chips += refundShowdown;
        effect.cooldown = effect.maxCooldown;
        break;
      case ITEM_EFFECT_ID.CHIP_ROUNDING:
        const unit = Math.pow(100, effect.value);
        player.chips = Math.ceil(player.chips / unit) * unit;
        effect.cooldown = effect.maxCooldown;
        break;
      case ITEM_EFFECT_ID.RAKE_REDUCTION:
        // Trigger: 'win' or 'showdown_win'
        // implement in pot manager
        break;
      case ITEM_EFFECT_ID.GOLDEN_TOUCH: {
        // Trigger: 'end_session'
        const bonus = effect.value * context.gainedXP;
        gainBankroll(bonus, TYPE_CHANGE_BANKROLL.ITEM_EFFECT);
        recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.ITEM_EFFECT, { amount: bonus })
        break;
      }
      case ITEM_EFFECT_ID.XP_BOOST:
        player.tempXPBonus += effect.value;
        break;
      case ITEM_EFFECT_ID.PAIR_MASTER:
        // Trigger: 'win'
        const t = [...player.hand, ...(context.board || [])];
        const maid = evaluateHand(t);
        console.info('pair_master', maid);
        if (maid) {
          const isPair = maid.rank == 2 || maid.rank == 3;
          if (isPair) player.tempXPBonus += effect.value;
        }
        break;
      case ITEM_EFFECT_ID.COOLER:
        const isCooler = context.result ? context.result.results.find(r => r.id === 'player').hand.rank >= 3 : false;
        if (isCooler) {
          recoverStamina(effect.value);
          effect.cooldown = effect.maxCooldown;
        }
        break;
      case ITEM_EFFECT_ID.OUTKICKED:
        const winnerHandName = context.result ? context.result.results.find(r => r.id === context.result.winnerId).hand.name : '';
        const playerHandName = context.result ? context.result.results.find(r => r.id === 'player').hand.name : '';
        if (winnerHandName === playerHandName) {
          player.tempXPBonus += effect.value
        }
        break;
      case ITEM_EFFECT_ID.DOUBLE_DOWN: {
        if (!context.result) return;
        const h = context.result.results.find(r => r.isMe)?.hand.rank;
        if (h) {
          const isStraight = h == 5 || h == 9;
          if (isStraight) player.tempXPBonus += effect.value;
        }
      } break;
      case ITEM_EFFECT_ID.FLUSH_MASTER: {
        const isFlush = context.result ? context.result.results.find(r => r.isMe)?.hand.rank == 6 : false;
        if (isFlush) player.tempXPBonus += effect.value;
      } break;
      case ITEM_EFFECT_ID.FULL_HOUSE_MASTER: {
        const isFullHouse = context.result ? context.result.results.find(r => r.isMe)?.hand.rank == 7 : false;
        if (isFullHouse) player.tempXPBonus += effect.value;
      } break;
      case ITEM_EFFECT_ID.STRAIGHT_FLUSH_MASTER: {
        const isStraightFlush = context.result ? context.result.results.find(r => r.isMe)?.hand.rank == 9 : false;
        if (isStraightFlush) player.tempXPBonus += effect.value;
      } break;
      case ITEM_EFFECT_ID.FOUR_OF_A_KIND_MASTER: {
        const isFourOfAKind = context.result ? context.result.results.find(r => r.isMe)?.hand.rank == 8 : false;
        if (isFourOfAKind) player.tempXPBonus += effect.value;
      } break;
      case ITEM_EFFECT_ID.ROYAL_FLUSH_MASTER: {
        const isRoyalFlush = context.result ? context.result.results.find(r => r.isMe)?.hand.rank == 10 : false;
        if (isRoyalFlush) player.tempXPBonus += effect.value;
      } break;
      case ITEM_EFFECT_ID.BLACKJACK_MASTER: {
        // ['Ah', 'Jc']
        const isBlackjack = player.hand.includes('A') && player.hand.includes('J')
        if (isBlackjack) player.tempXPBonus += effect.value;
      } break;
      case ITEM_EFFECT_ID.SETS_MASTER: {
        const isSets = context.result ? context.result.results.find(r => r.isMe)?.hand.rank == 4 : false;
        if (isSets) player.tempXPBonus += effect.value;
      } break;
      case ITEM_EFFECT_ID.FAILURE_IS_MOTHER_OF_SUCCESS: {
        // [FIX] effect is the flattened item object now
        if (context.isWin) {
          effect.stack = 0; // Reset stack on win
        } else {
          effect.stack = (effect.stack || 0) + 1; // Increment stack on lose
          player.tempXPBonus += effect.value
        }
        break;
      }
      case ITEM_EFFECT_ID.WINNER_MASTER: {
        // [FIX] effect is the flattened item object
        if (context.isWin) {
          effect.stack = (effect.stack || 0) + 1; // Increment stack on win
          player.tempXPBonus += effect.value * effect.stack
        } else {
          effect.stack = 0; // Reset stack on lose
        }
        break;
      }

      case ITEM_EFFECT_ID.DIAMOND_COLLECTOR:
      case ITEM_EFFECT_ID.HEART_COLLECTOR:
      case ITEM_EFFECT_ID.SPADE_COLLECTOR:
      case ITEM_EFFECT_ID.CLUB_COLLECTOR:
        // Trigger: 'win'
        const suitMap = {
          [ITEM_EFFECT_ID.DIAMOND_COLLECTOR]: 'd', [ITEM_EFFECT_ID.HEART_COLLECTOR]: 'h',
          [ITEM_EFFECT_ID.SPADE_COLLECTOR]: 's', [ITEM_EFFECT_ID.CLUB_COLLECTOR]: 'c'
        };
        const targetSuit = suitMap[effect.id];
        let count = 0;
        const allCards = [...player.hand, ...(context.board || [])];
        allCards.forEach(c => { if (c && c.suit === targetSuit) count++; });
        const collectionBonus = Math.floor((player.totalWagered || 0) * count * effect.value);
        if (collectionBonus > 0) {
          player.chips += collectionBonus;
        }
        effect.cooldown = effect.maxCooldown;
        break;

      case ITEM_EFFECT_ID.LUCKY_7_COLLECTOR:
        // Trigger: 'win'
        let count7 = 0;
        [...player.hand, ...(context.board || [])].forEach(c => { if (c && c.rank === '7') count7++; });
        const bonus7 = Math.floor((player.totalWagered || 0) * count7 * effect.value);
        if (bonus7 > 0) {
          player.chips += bonus7;
        }
        effect.cooldown = effect.maxCooldown;
        break;

      case ITEM_EFFECT_ID.OMEN:
        // Trigger: 'lose'
        let count6 = 0;
        [...player.hand, ...(context.board || [])].forEach(c => { if (c && c.rank === '6') count6++; });
        const bonus6 = Math.floor((player.totalWagered || 0) * count6 * effect.value);
        if (bonus6 > 0) {
          player.chips += bonus6;
        }
        effect.cooldown = effect.maxCooldown;
        break;

      // case 'ram_steal':
      //   player.recoverRam(effect.value);
      //   this.notifyEffect(effect, `Stole ${effect.value} RAM`);
      //   break;
      case ITEM_EFFECT_ID.QUANTUM_FOLD:
        if (context.street === 'PREFLOP') {
          player.chips += Math.ceil((player.totalWagered || 0) * effect.value);
          effect.cooldown = effect.maxCooldown;
        }
        break;
      case ITEM_EFFECT_ID.QUANTUM_LUCK:
        console.info('quantum_luck context', context.isWin, context.equity);
        if (context.isWin && context.equity < 50) {
          const qBonus = Math.floor((player.totalWagered || 0) * (50.0 - context.equity || 50.0) * effect.value);
          effect.cooldown = effect.maxCooldown;
          player.equity = 100.0;
          console.info('quantum_luck', qBonus);
          if (qBonus > 0) {
            gainBankroll(qBonus, TYPE_CHANGE_BANKROLL.ITEM_EFFECT);
            recordPlayStatsSession(player, PLAY_RECORD_STATS_TYPE.ITEM_EFFECT, { amount: qBonus })
          }
        };
        break;
      default:
        console.log(`[ITEMS] Effect ${effect.id} handled externally or passive.`);
        break;
    }
    // if( effect.cooldown = effect.maxCooldown;)
  }
  notifyEffect(effect, message) {
    // Helper to show toast/log
    const name = effect.originalDef?.name || effect.name || 'Item Effect';
    console.log(`[EFFECT] ${name}: ${message}`);
    // TODO: Connect to UI Toast system
  }
}