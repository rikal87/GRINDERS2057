
import { gainBankroll, store } from './store';
import { zones } from './zone';
import { getRndLoreSpamMessage } from './lore_spam_message';
import { audioManager } from './audioManager';
import { scheduleEvent } from './eventSystem';
import { TYPE_CHANGE_BANKROLL } from './constants.js'
import { debtRepayment, transferBankroll } from './partnerSystem.js';
export const MESSAGE_TYPE = {
  SYSTEM: 'SYSTEM',
  FINANCE: 'FINANCE',
  SOCIAL: 'SOCIAL',
  SPAM: 'SPAM',
  TUTORIAL: 'TUTORIAL',
  MISSION: 'MISSION',
  REWARD: 'REWARD',
  EVENT: 'EVENT',
}
export const MESSAGE_ACTION_TYPE = {
  RECEIVE: 'RECEIVE',
  PAY_RENT: 'PAY_RENT',
  PAY_FINE: 'PAY_FINE',
  TRANSFER: 'TRANSFER',
  DEBT_REPAYMENT: 'DEBT_REPAYMENT',
  PAY_INCOME_TAX: 'PAY_INCOME_TAX',
  ACCEPT_INVITE: 'ACCEPT_INVITE',
  INTERACT: 'INTERACT',
  DELETE_MESSAGE: 'DELETE_MESSAGE',
}
export const MESSAGE_ACTION_LABEL_TYPE = {
  PAY: 'PAY',
  PAY_RENT: 'PAY',
  PAY_FINE: 'PAY',
  DEBT_REPAYMENT: 'REPAYMENT',
  PAY_INCOME_TAX: 'PAY',
  ACCEPT_INVITE: 'ACCEPT',
}
export const MESSAGE_ACTION_RESOLVE_TYPE = {
  ACCEPT: 'ACCEPT',
  REFUSE: 'REFUSE',
  PAY: 'PAY',
  JOIN: 'JOIN',
}
export const sendMessage = (type, title, body, actions = [], sender = 'System', expireMinutes = null) => {
  const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
  const msg = {
    id,
    type, // SYSTEM, FINANCE, SOCIAL, SPAM, TIER_EVENT, TUTORIAL
    sender,
    title,
    body,
    timestamp: store.gameTime,
    isRead: false,
    actions, // [{ label, actionType, payload }]
    expireAt: expireMinutes ? store.gameTime + (expireMinutes * 60 * 1000) : null // Treat expireMinutes as relative minutes
  };

  store.messages.unshift(msg);

  // Play notification sound if not spam (Debounced to prevent loud bursts)
  const now = Date.now();
  // Use a static property on sendMessage to track time across calls
  if (!sendMessage.lastSoundTime || now - sendMessage.lastSoundTime > 500) {
    if (type === MESSAGE_TYPE.REWARD) audioManager.playSFX('alarm');
    else audioManager.playSFX('inmessage');
    sendMessage.lastSoundTime = now;
  }

  return id;
};

export const markAsRead = (id) => {
  const msg = store.messages.find(m => m.id === id);
  if (msg) msg.isRead = true;
};

export const deleteMessage = (id) => {
  const idx = store.messages.findIndex(m => m.id === id);
  if (idx !== -1) store.messages.splice(idx, 1);
};

export const handleMessageAction = (msgId, actionIndex, isStory = false) => {
  const msg = store.messages.find(m => m.id === msgId);
  console.info('msg', msg)
  if (!msg || !msg.actions[actionIndex]) return;

  const action = msg.actions[actionIndex];
  console.info('action', action)
  // Process Action Logic
  switch (action.actionType) {
    case MESSAGE_ACTION_TYPE.RECEIVE:
      gainBankroll(action.payload.amount, TYPE_CHANGE_BANKROLL.RECEIVE)
      sendMessage('SYSTEM', 'Receive Successful', `You received ${action.payload.amount.toLocaleString()} ${action.payload.currency} from ${action.payload.sender}.`);
      deleteMessage(msgId); // Remove bill after payment
      // Trigger success effect?
      break;
    case MESSAGE_ACTION_TYPE.PAY_RENT:
    case MESSAGE_ACTION_TYPE.PAY_FINE:
      const amount = action.payload.amount;
      if (store.bankroll >= amount) {
        gainBankroll(-amount, action.actionType)
        if (action.actionType === MESSAGE_ACTION_TYPE.PAY_RENT && store.missedPayments) {
          store.missedPayments.rent_bill = Math.max(0, store.missedPayments.rent_bill - 1);
        }
        sendMessage(MESSAGE_TYPE.FINANCE, 'Payment Successful', `Successfully paid ${amount.toLocaleString()} ${action.payload.currency || 'CR'}.`);
        deleteMessage(msgId); // Remove bill after payment
        // Trigger success effect?
      } else {
        audioManager.playSFX('error');
        sendMessage(MESSAGE_TYPE.FINANCE, 'Insufficient Funds!', `Failed to pay ${amount.toLocaleString()} ${action.payload.currency || 'CR'}.`);
      }
      break;
    case MESSAGE_ACTION_TYPE.DEBT_REPAYMENT: {
      const p = action.payload;
      console.info('p', p)
      if (p.resolveType === MESSAGE_ACTION_RESOLVE_TYPE.ACCEPT) {
        console.info('p.id', p.id, p.amount)
        const result = debtRepayment(p.id, p.amount, false, true);
        if (result) {
          sendMessage(MESSAGE_TYPE.FINANCE, 'Transaction Successful', `Successfully transferred ${(p.amount || 0).toLocaleString()} CR.to ${p.to}.`);
          deleteMessage(msgId);
          if (p.nextEvent) scheduleEvent(p.nextEvent, 5 + Math.random() * 12);
        } else {
          audioManager.playSFX('error');
          sendMessage(MESSAGE_TYPE.FINANCE, 'Insufficient Funds!', `Failed to transfer ${(p.amount || 0).toLocaleString()} CR.to ${p.to}.`);
        }
      } else if (p.resolveType === MESSAGE_ACTION_RESOLVE_TYPE.REFUSE) {
        audioManager.playSFX('error');
        if (p.nextEvent) scheduleEvent(p.nextEvent, 5 + Math.random() * 12);
        deleteMessage(msgId);
      }
      break;
    }
    case MESSAGE_ACTION_TYPE.TRANSFER: {
      const p = action.payload;
      if (p.resolveType === MESSAGE_ACTION_RESOLVE_TYPE.ACCEPT) {
        const result = transferBankroll(p.id, p.amount, false);
        if (result.success) {
          sendMessage(MESSAGE_TYPE.FINANCE, 'Transaction Successful', `Successfully transferred ${(p.amount || 0).toLocaleString()} CR.to ${p.to}.`);
          deleteMessage(msgId);
          if (p.nextEvent) scheduleEvent(p.nextEvent, 5 + Math.random() * 12);
        } else {
          audioManager.playSFX('error');
          sendMessage(MESSAGE_TYPE.FINANCE, 'Insufficient Funds!', `Failed to transfer ${(p.amount || 0).toLocaleString()} CR.to ${p.to}.`);
        }
      } else if (p.resolveType === MESSAGE_ACTION_RESOLVE_TYPE.REFUSE) {
        audioManager.playSFX('error');
        if (p.nextEvent) scheduleEvent(p.nextEvent, 5 + Math.random() * 12);
        deleteMessage(msgId);
      }
      break;
    }
    case MESSAGE_ACTION_TYPE.PAY_INCOME_TAX:
      const taxAmount = action.payload.amount;
      if (store.bankroll >= taxAmount) {
        gainBankroll(-taxAmount, action.actionType)
        // Update the high water mark for the next cycle
        store.latest_pay_income_base_amount = store.bankroll;
        if (store.missedPayments) {
          store.missedPayments.income_tax = 0; // Reset completely upon payment
        }
        sendMessage(MESSAGE_TYPE.FINANCE, 'Tax Paid', `Income tax of ${taxAmount.toLocaleString()} CR has been settled. Next cycle base is now ${store.latest_pay_income_base_amount.toLocaleString()} CR.`, 1);

        // Remove ALL pending income tax messages since paying updates the base correctly
        store.messages = store.messages.filter(m =>
          !(m.actions && m.actions.some(a => a.actionType === MESSAGE_ACTION_TYPE.PAY_INCOME_TAX))
        );
      } else {
        audioManager.playSFX('error');
        sendMessage(MESSAGE_TYPE.FINANCE, 'Insufficient Funds!', `You need ${taxAmount.toLocaleString()} CR to pay your income tax.Failure to pay will result in severe penalties!`);
      }
      break;
    case MESSAGE_ACTION_TYPE.ACCEPT_INVITE:
      if (action.payload.resolveType === MESSAGE_ACTION_RESOLVE_TYPE.REFUSE) {
        scheduleEvent(action.payload.nextEvent, 5 + Math.random() * 12);
        deleteMessage(msgId);
        break;
      }
      audioManager.playSFX('opening-door');
      // Navigate to specific zone or start game
      let locationConfig = null;
      for (const zone of zones) {
        const loc = zone.locations.find(l => l.id === action.payload.location_id);
        if (loc) {
          locationConfig = loc;
          break;
        }
      }
      if (locationConfig) {
        window.dispatchEvent(new CustomEvent('open-table-search', {
          detail: {
            locationId: locationConfig.id,
            inviteId: msgId
          }
        }));
      }
      break;
    case MESSAGE_ACTION_TYPE.INTERACT:
      if (action.payload.resolveType === MESSAGE_ACTION_RESOLVE_TYPE.ACCEPT) {
        scheduleEvent(action.payload.nextEvent, 5 + Math.random() * 12);
      } else if (action.payload.resolveType === MESSAGE_ACTION_RESOLVE_TYPE.REFUSE) {
        scheduleEvent(action.payload.nextEvent, 5 + Math.random() * 12);
      }
      deleteMessage(msgId);
      break;
    case MESSAGE_ACTION_TYPE.DELETE_MESSAGE:
      // audioManager.playSFX('notification');
      deleteMessage(msgId);
      break;
  }
}

export const sendLoreAndSpamMessage = () => {
  const loreSpamMessage = getRndLoreSpamMessage();

  sendMessage(MESSAGE_TYPE.SPAM, loreSpamMessage.title, loreSpamMessage.body, [], loreSpamMessage.sender);
}

export const checkMessageExpiration = () => {
  const now = store.gameTime;
  store.messages = store.messages.filter(msg => {
    if (msg.expireAt && now >= msg.expireAt) {
      return false;
    }
    return true;
  });
};

