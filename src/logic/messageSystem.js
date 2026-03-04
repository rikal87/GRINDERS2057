
import { gainBankroll, store, TYPE_CHANGE_BANKROLL } from './store';
import { zones } from './zone';
import { getRndLoreSpamMessage } from './lore_spam_message';
import { audioManager } from './audioManager';
// import { EVENT_ID, scheduleEvent } from './eventSystem';
export const MESSAGE_TYPE = {
  SYSTEM: 'SYSTEM',
  FINANCE: 'FINANCE',
  SOCIAL: 'SOCIAL',
  SPAM: 'SPAM',
  TUTORIAL: 'TUTORIAL',
  MISSION: 'MISSION',
}
export const MESSAGE_ACTION_TYPE = {
  RECEIVE: 'RECEIVE',
  PAY_RENT: 'PAY_RENT',
  PAY_FINE: 'PAY_FINE',
  DEBT_REPAYMENT: 'DEBT_REPAYMENT',
  PAY_INCOME_TAX: 'PAY_INCOME_TAX',
  ACCEPT_INVITE: 'ACCEPT_INVITE',
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
export const sendMessage = (type, title, body, actions = [], sender = 'System') => {
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
    expireAt: null // Optional
  };
  audioManager.playSFX('inmessage');
  store.messages.unshift(msg);

  // Optional: Play notification sound if not spam
  // if (type !== 'SPAM') audioManager.playSFX('notification');

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
  if (!msg || !msg.actions[actionIndex]) return;

  const action = msg.actions[actionIndex];

  // Process Action Logic
  switch (action.actionType) {
    case MESSAGE_ACTION_TYPE.RECEIVE:
      audioManager.playSFX('paybill');
      gainBankroll(action.payload.amount, TYPE_CHANGE_BANKROLL.RECEIVE)
      sendMessage('SYSTEM', 'Receive Successful', `You received ${action.payload.amount.toLocaleString()} ${action.payload.currency} from ${action.payload.sender}.`);
      deleteMessage(msgId); // Remove bill after payment
      // Trigger success effect?
      break;
    case MESSAGE_ACTION_TYPE.PAY_RENT:
    case MESSAGE_ACTION_TYPE.PAY_FINE:
      const amount = action.payload.amount;
      if (store.bankroll >= amount) {
        audioManager.playSFX('paybill');
        gainBankroll(-amount, action.actionType)
        if (action.actionType === MESSAGE_ACTION_TYPE.PAY_RENT && store.missedPayments) {
          store.missedPayments.rent_bill = Math.max(0, store.missedPayments.rent_bill - 1);
        }
        sendMessage('SYSTEM', 'Payment Successful', `Successfully paid ${amount.toLocaleString()} ${action.payload.currency || 'CR'}.`);
        deleteMessage(msgId); // Remove bill after payment
        // Trigger success effect?
      } else {
        audioManager.playSFX('error');
        sendMessage('SYSTEM', 'Insufficient Funds!', `Failed to pay ${amount.toLocaleString()} ${action.payload.currency || 'CR'}.`);
      }
      break;
    case MESSAGE_ACTION_TYPE.DEBT_REPAYMENT:
      const p = action.payload;

      if (p.resolveType === MESSAGE_ACTION_RESOLVE_TYPE.ACCEPT) {
        if (store.bankroll >= p.amount) {
          audioManager.playSFX('paybill');
          gainBankroll(-p.amount, action.actionType)
          sendMessage('SYSTEM', 'Transaction Successful', `Successfully transferred ${p.amount.toLocaleString()} CR. to ${p.to}.`, 1);
          scheduleEvent(msgId, 2)
          deleteMessage(msgId);
          if (p.nextEvent) scheduleEvent(p.nextEvent, Math.random() * 2);
        } else {
          audioManager.playSFX('error');
          sendMessage('SYSTEM', 'Insufficient Funds!', `Failed to transfer ${p.amount.toLocaleString()} CR. to ${p.to}.`);
        }
      } else if (p.resolveType === MESSAGE_ACTION_RESOLVE_TYPE.REFUSE) {
        if (p.nextEvent) scheduleEvent(p.nextEvent, Math.random() * 2);
        deleteMessage(msgId);
      }
      break;
    case MESSAGE_ACTION_TYPE.PAY_INCOME_TAX:
      const taxAmount = action.payload.amount;
      if (store.bankroll >= taxAmount) {
        audioManager.playSFX('paybill');
        gainBankroll(-taxAmount, action.actionType)
        // Update the high water mark for the next cycle
        store.latest_pay_income_base_amount = store.bankroll;
        if (store.missedPayments) {
          store.missedPayments.income_tax = 0; // Reset completely upon payment
        }
        sendMessage('SYSTEM', 'Tax Paid', `Income tax of ${taxAmount.toLocaleString()} CR has been settled. Next cycle base is now ${store.latest_pay_income_base_amount.toLocaleString()} CR.`, 1);

        // Remove ALL pending income tax messages since paying updates the base correctly
        store.messages = store.messages.filter(m =>
          !(m.actions && m.actions.some(a => a.actionType === MESSAGE_ACTION_TYPE.PAY_INCOME_TAX))
        );
      } else {
        audioManager.playSFX('error');
        sendMessage('SYSTEM', 'Insufficient Funds!', `You need ${taxAmount.toLocaleString()} CR to pay your income tax. Failure to pay will result in severe penalties!`);
      }
      break;
    case MESSAGE_ACTION_TYPE.ACCEPT_INVITE:
      if (action.payload.resolveType === MESSAGE_ACTION_RESOLVE_TYPE.REFUSE) {
        scheduleEvent(action.payload.nextEvent, 1);
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
        const table = locationConfig.tables;
        const joinPayload = {
          inviteId: msgId,
          locationId: locationConfig.id,
          locationName: locationConfig.name,
          locationLV: locationConfig.level,
          rake: table.baseRake || 0,
          buyIn: table.amount,
          rakeCap: table.rakeCap || 0,
          isAdvanced: table.isAdvanced || false,
          size: table.available[0] || 2,
          sb: table.sb,
          bb: table.bb,
          buyInLimit: table.buyInLimit,
        };
        window.dispatchEvent(new CustomEvent('join-table', { detail: joinPayload }));
        // deleteMessage(msgId);
      }
      break;
    case 'DELETE_MESSAGE':
      // audioManager.playSFX('notification');
      deleteMessage(msgId);
      break;
  }
}

export const sendLoreAndSpamMessage = () => {
  const loreSpamMessage = getRndLoreSpamMessage();

  sendMessage('SPAM', loreSpamMessage.title, loreSpamMessage.body, [], loreSpamMessage.sender);
}

