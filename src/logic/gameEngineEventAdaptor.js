
import { store, gainBankroll, gainLT, gainClearedZoneCount } from './store.js';
import { evaluateHand } from './poker.js';
import { recoverStamina } from './staminaSystem.js';
import { zones, LOCATION_ID } from './zone.js';
import { scheduleEvent, EVENT_ID } from './eventSystem.js';
import { deleteMessage } from './messageSystem.js'
import { PARTNER_ID } from './partnerSystem.js';

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
    store.play_stats.played_hands++; // Increment every new hand
    players.forEach(p => {
      p.item?.effects?.forEach(e => {
        if (e.trigger.includes('round_start')) {
          this.executeItemEffect(p, e, { sb, bb });
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
        if (e.cooldown > 0) e.cooldown--;
      });
    });
    // Update bankroll peaks
    if (store.play_stats.max_bankroll < store.bankroll) {
      store.play_stats.max_bankroll = store.bankroll;
    }
  }
  gameOver({ winnerId }) {
    console.info('gameOver', winnerId);
  }
  playerBankrupt(player, bestWinner, locationId, inviteId) {
    console.info('playerBankrupt', player.name);
    if (player.isMe) {
      store.play_stats.bankruptcy_count++;
      player.item?.effects?.forEach(e => {
        if (e.trigger.includes('bankrupt')) {
          this.executeItemEffect(player, e, {});
        }
      });

      // cleanupInvites(locationId);
      deleteMessage(inviteId);

      if (locationId === LOCATION_ID.FREE_STREET_SHOP_WITH_MAX) {
        scheduleEvent(EVENT_ID.MAX.TUTORIAL_LOSE_PLAYER, 0);
      } else if (locationId === LOCATION_ID.LOW_UNDERGROUND_CLUB_MEET_MAX) {
        scheduleEvent(EVENT_ID.MAX.MAIN_STORY_1_3_MEET_AT_CLUB_LOSE, 0);
      }
    } else {
      // An NPC went bankrupt
      if (bestWinner && bestWinner.isMe) {
        // Player bankrupted the NPC
        const persona = player.persona || player.name;
        if (store.play_stats.bust_enemy[persona] !== undefined) {
          store.play_stats.bust_enemy[persona]++;
        } else {
          store.play_stats.bust_enemy['Fish']++;
        }

        if (locationId === LOCATION_ID.FREE_STREET_SHOP_WITH_MAX && player.name === 'Max') {
          scheduleEvent(EVENT_ID.MAX.TUTORIAL_WIN, 1);
        } else if (locationId === LOCATION_ID.LOW_UNDERGROUND_CLUB_MEET_MAX && player.name === 'Max') {
          scheduleEvent(EVENT_ID.MAX.MAIN_STORY_1_3_MEET_AT_CLUB_WIN, 1); // if max wins complate main story 1-3
        }

      } else {
        // Someone else bankrupted the NPC
        if (locationId === LOCATION_ID.FREE_STREET_SHOP_WITH_MAX && player.name === 'Max') {
          scheduleEvent(EVENT_ID.MAX.TUTORIAL_LOSE_MAX, 1);
        }
      }
    }
  }
  gameWon(player, prize, locationId, inviteId) {
    console.info('gameWon', player.name, prize);
    // cleanupInvites(locationId);
    deleteMessage(inviteId);
    let firstClearReward = null;
    for (const tier of zones) {
      const loc = tier.locations.find(l => l.id === locationId);
      if (loc && loc.firstClearReward) {
        firstClearReward = loc.firstClearReward;
        break;
      }
    }
    if (firstClearReward) {
      if (!store.unlockedLocations) store.unlockedLocations = [];
      if (!store.unlockedLocations.includes(firstClearReward)) {
        store.unlockedLocations.push(firstClearReward);
        console.log(`[GAME] First Clear Reward Awarded: ${firstClearReward}`);
      }
    }
    if (locationId) gainClearedZoneCount(locationId);

    // [Tutorial] Handled edge cases for the tutorial table
    if (locationId === LOCATION_ID.FREE_STREET_SHOP_WITH_MAX) {
      if (player.isMe) {
        scheduleEvent(EVENT_ID.MAX.TUTORIAL_WIN, 2);
      } else if (player.id === PARTNER_ID.MAX) {
        scheduleEvent(EVENT_ID.MAX.TUTORIAL_WIN_MAX, 2);
      }
    }
    // MAIN_STORY_1_2_MEET_AT_CLUB_SUCCESS
    if (locationId === LOCATION_ID.LOW_UNDERGROUND_CLUB_MEET_MAX || player.isMe) {
      scheduleEvent(EVENT_ID.MAX.MAIN_STORY_1_2_MEET_AT_CLUB_SUCCESS, 2);
    }
  }
  playerLeaveTable(player, locationId, allPlayers, inviteId) {
    console.info('playerLeaveTable', player.name, locationId, inviteId);
    if (!player.isMe) return;
    // cleanupInvites(locationId);

    deleteMessage(inviteId);
    if (locationId === LOCATION_ID.FREE_STREET_SHOP_WITH_MAX) {
      // Run away early -> Max gets mad
      if (!player.isEliminated) {
        if (store.completedEvents.includes(EVENT_ID.MAX.TUTORIAL_LEAVE)) {
          scheduleEvent(EVENT_ID.MAX.TUTORIAL_LEAVE_AGAIN, 2);
        } else {
          scheduleEvent(EVENT_ID.MAX.TUTORIAL_LEAVE, 2);
        }
      }
    } else if (locationId === LOCATION_ID.LOW_UNDERGROUND_CLUB_MEET_MAX) {
      if (store.sessionNetWorth >= 100000) {
        scheduleEvent(EVENT_ID.MAX.MAIN_STORY_1_2_MEET_AT_CLUB_SUCCESS, 3);
      } else {
        scheduleEvent(EVENT_ID.MAX.MAIN_STORY_1_2_MEET_AT_CLUB_FAILED, 3);
      }
    }
  }

  bet({ player, amount, pot, street }) {
    if (player.isMe) {
      store.play_stats.raise++;
      store.play_stats.vpip_count++;
      if (street === 'PREFLOP') store.play_stats.pfr++;
    }
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
    const me = result.results.find(r => r.player.isMe);
    if (me) {
      store.play_stats.wtsd++;
    }
    if (result.rake) {
      store.play_stats.paid_rake += result.rake;
    }

    result.results.forEach(r => {
      if (r.isWinner) {
        if (runoutInProgress) this.winAtShowdownWithAllIn({ player: r.player, amount: r.amountWon, pot, hand: r.hand, board });
        else this.winAtShowdown({ player: r.player, amount: r.amountWon, pot, hand: r.hand, board });
      } else {
        if (runoutInProgress) this.loseAtShowdownWithAllIn({ player: r.player, amount: 0, pot, hand: r.hand, board });
        else this.loseAtShowdown({ player: r.player, amount: 0, pot, hand: r.hand, board });
      }
    });

    if (me && me.isWinner) {
      store.play_stats.w$sd++;
    }
  }
  winAtShowdown({ player, amount, pot, hand, board }) {
    if (player.isMe) {
      store.play_stats.showdown_win++;
      this.updateWinPost(amount);
    }
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('winAtShowdown') || e.trigger.includes('win')) {
        this.executeItemEffect(player, e, { amount, pot, equity: player.equity, hand, board, isWin: true });
      }
    });
  }
  winAtShowdownWithAllIn({ player, amount, pot, hand, board }) {
    if (player.isMe) {
      store.play_stats.showdown_win++;
      store.play_stats.all_in_win++;
      this.updateWinPost(amount);
    }
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('winAtShowdownWithAllIn') || e.trigger.includes('win')) {
        this.executeItemEffect(player, e, { amount, pot, equity: player.equity, hand, board, isWin: true });
      }
    });
  }
  winAtWithoutShowdown({ player, amount, pot, hand, board }) {
    if (player.isMe) {
      store.play_stats.win_without_showdown++;
      this.updateWinPost(pot);
    }
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('winWithoutShowdown') || e.trigger.includes('win')) {
        this.executeItemEffect(player, e, { amount, pot, hand, board, isWin: true });
      }
    });
  }
  loseAtShowdownWithAllIn({ player, amount, pot, hand, board }) {
    if (player.isMe) {
      this.updateLosePost(pot, player.equity);
    }
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('loseAtShowdownWithAllIn') || e.trigger.includes('lose')) {
        this.executeItemEffect(player, e, { amount, pot, equity: player.equity, hand, board, isWin: false });
      }
    });
  }

  loseAtShowdown({ player, amount, pot, hand, board }) {
    if (player.isMe) {
      this.updateLosePost(pot, player.equity);
    }
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('loseAtShowdown') || e.trigger.includes('lose')) {
        this.executeItemEffect(player, e, { amount, pot, equity: player.equity, hand, board, isWin: false });
      }
    });
  }

  updateWinPost(pot) {
    store.play_stats.total_earn_money += BigInt(pot);
    if (store.play_stats.max_win_pot < pot) store.play_stats.max_win_pot = pot;
    store.play_stats.max_win_streak++;
    store.play_stats.max_lose_streak = 0;
  }

  updateLosePost(pot, equity) {
    store.play_stats.total_lost_money += BigInt(pot);
    if (store.play_stats.max_lose_pot < pot) store.play_stats.max_lose_pot = pot;
    store.play_stats.max_lose_streak++;
    store.play_stats.max_win_streak = 0;
    if (equity > 50 && equity > store.play_stats.max_lose_equity) {
      store.play_stats.max_lose_equity = equity;
    }
  }

  fold({ player, amount, pot, board, street }) {
    if (player.isMe) {
      store.play_stats.fold++;
    }
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('fold')) {
        this.executeItemEffect(player, e, { amount, pot, board, street });
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
    if (player.isMe) {
      store.play_stats.bankruptcy_count++;
    }
    let rescueFund = player.level * 2000;
    gainBankroll(rescueFund);
    player.item?.effects?.forEach(e => {
      if (e.trigger.includes('bankrupt')) {
        this.executeItemEffect(player, e, { amount: rescueFund });
      }
    });

    // store.xp = 0;
  }
  action({ player, type, amount, street }) {
    if (!player.isMe) return;

    switch (type) {
      case 'CHECK':
        store.play_stats.check++;
        break;
      case 'CALL':
        store.play_stats.call++;
        store.play_stats.vpip_count++;
        break;
      case 'RAISE':
        store.play_stats.raise++;
        store.play_stats.vpip_count++;
        if (street === 'PREFLOP') {
          store.play_stats.pfr++;
        }
        break;
      case 'ALLIN':
        store.play_stats.all_in++;
        break;
    }
  }
  useSkill({ player, skill }) {

  }
  executeItemEffect(player, effect, context) {
    if (effect.cooldown > 0) {
      return;
    }
    switch (effect.id) {
      case 'cooldown_reduction':
        player.item?.effects?.forEach(e => {
          if (e.id !== 'cooldown_reduction') {
            e.cooldown = Math.max(0, e.cooldown - effect.value);
          }
        });
        break;
      case 'emergency_fund':
        gainBankroll(effect.valueCalc);
        effect.cooldown = effect.maxCooldown;
        break;
      case 'smoke_break':
        recoverStamina(effect.value);
        gainLT(-effect.value);
        effect.cooldown = effect.maxCooldown;
        break;
      case 'lt_recovery':
        gainLT(effect.value);
        break;
      case 'stemina_regen':
        recoverStamina(effect.value);
        effect.cooldown = effect.maxCooldown;
        break;
      case 'dopamine_addiction':
        recoverStamina(effect.value);
        effect.cooldown = effect.maxCooldown;
        break;
      case 'last_stand':
        if (player.chips <= context.bb * 25) {
          gainLT(effect.value)
        }
        break;
      case 'lt_regen_plus':
        gainLT(effect.value)
        effect.cooldown = effect.maxCooldown;
        break;
      case 'joy_of_vitality':
        if (context.isWin) {
          recoverStamina(effect.value);
        }
        break;
      case 'tilt_recovery':
        if (!context.isWin) {
          recoverStamina(effect.value);
        }
        break;
      case 'synapse_reading':
        if (!effect.isActivated) {
          console.log('[EFFECT] Synapse Reading ACTIVATED!');
          effect.isActivated = true;
        } else {
          console.log('[EFFECT] Synapse Reading DEACTIVATED');
          effect.isActivated = false;
          effect.cooldown = effect.maxCooldown;
        }
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
        // player.chips += bonus;
        gainBankroll(bonus);
        effect.cooldown = effect.maxCooldown;
        break;

      case 'allin_insurance':
        // Trigger: 'allin_lose'
        const equity = context.equity || 0;
        if (!context.isWin && equity <= 75) {
          const recovery = Math.ceil((player.totalWagered || 0) * (equity / 100) * effect.value.value);
          if (recovery > 0) {
            player.chips += recovery;
          }
          effect.cooldown = effect.maxCooldown;
        }
        break;
      case 'showdown_lose_refund':
        // Trigger: 'showdown_lose'
        const wagered = player.totalWagered || 0;
        const refundShowdown = Math.ceil(wagered * effect.value);
        console.info('showdown_refund', player, refundShowdown);
        player.chips += refundShowdown;
        effect.cooldown = effect.maxCooldown;
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
          effect.stack = 0; // Reset stack on win
        } else {
          effect.stack = (effect.stack || 0) + 1; // Increment stack on lose
          player.tempXPBonus += effect.value
        }
        break;
      }
      case 'winner_master': {
        // [FIX] effect is the flattened item object
        if (context.isWin) {
          effect.stack = (effect.stack || 0) + 1; // Increment stack on win
          player.tempXPBonus += effect.value * effect.stack
        } else {
          effect.stack = 0; // Reset stack on lose
        }
        break;
      }

      case 'diamond_collector':
      case 'heart_collector':
      case 'spade_collector':
      case 'club_collector':
        // Trigger: 'win'
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
        effect.cooldown = effect.maxCooldown;
        break;

      case 'lucky_7_collector':
        // Trigger: 'win'
        let count7 = 0;
        [...player.hand, ...(context.board || [])].forEach(c => { if (c && c.rank === '7') count7++; });
        const bonus7 = Math.floor((player.totalWagered || 0) * count7 * effect.value);
        if (bonus7 > 0) {
          player.chips += bonus7;
        }
        effect.cooldown = effect.maxCooldown;
        break;

      case 'omen':
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
      case 'quantum_fold':
        if (context.street === 'PREFLOP') {
          player.chips += Math.ceil((player.totalWagered || 0) * effect.value);
          effect.cooldown = effect.maxCooldown;
        }
        break;
      case 'quantum_luck':
        console.info('quantum_luck context', context.isWin, context.equity);
        if (context.isWin && context.equity < 50) {
          const qBonus = Math.floor((player.totalWagered || 0) * (50.0 - context.equity || 50.0) * effect.value);
          effect.cooldown = effect.maxCooldown;
          player.equity = 100.0;
          console.info('quantum_luck', qBonus);
          if (qBonus > 0) gainBankroll(qBonus);
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