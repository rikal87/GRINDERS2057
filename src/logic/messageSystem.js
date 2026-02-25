
import { store } from './store';
import { zones } from './zone';
import { getRndLoreSpamMessage } from './lore_spam_message';
import { audioManager } from './audioManager';
export const MESSAGE_TYPE = {
  SYSTEM: 'SYSTEM',
  FINANCE: 'FINANCE',
  SOCIAL: 'SOCIAL',
  SPAM: 'SPAM',
  TIER_EVENT: 'TIER_EVENT',
  TUTORIAL: 'TUTORIAL'
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
    case 'RECEIVE':
      store.bankroll += action.payload.amount;
      sendMessage('SYSTEM', 'Receive Successful', `You received ${action.payload.amount.toLocaleString()} CR.`);
      deleteMessage(msgId); // Remove bill after payment
      // Trigger success effect?
      break;
    case 'PAY_RENT':
    case 'PAY_TAX':
    case 'PAY_FINE':
      const amount = action.payload.amount;
      if (store.bankroll >= amount) {
        store.bankroll -= amount;

        if (action.actionType === 'PAY_RENT' && store.missedPayments) {
          store.missedPayments.rent_bill = Math.max(0, store.missedPayments.rent_bill - 1);
        }

        sendMessage('SYSTEM', 'Payment Successful', `Successfully paid ${amount.toLocaleString()} CR.`);
        deleteMessage(msgId); // Remove bill after payment
        // Trigger success effect?
      } else {
        sendMessage('SYSTEM', 'Insufficient Funds!', `You need ${amount.toLocaleString()} CR to pay this bill.`);
      }
      break;
    case 'PAY_INCOME_TAX':
      const taxAmount = action.payload.amount;
      if (store.bankroll >= taxAmount) {
        store.bankroll -= taxAmount;
        // Update the high water mark for the next cycle
        store.latest_pay_income_base_amount = store.bankroll;

        if (store.missedPayments) {
          store.missedPayments.income_tax = 0; // Reset completely upon payment
        }

        sendMessage('SYSTEM', 'Tax Paid', `Income tax of ${taxAmount.toLocaleString()} CR has been settled. Next cycle base is now ${store.latest_pay_income_base_amount.toLocaleString()} CR.`);

        // Remove ALL pending income tax messages since paying updates the base correctly
        store.messages = store.messages.filter(m =>
          !(m.actions && m.actions.some(a => a.actionType === 'PAY_INCOME_TAX'))
        );
      } else {
        sendMessage('SYSTEM', 'Insufficient Funds!', `You need ${taxAmount.toLocaleString()} CR to pay your income tax. Failure to pay will result in severe penalties!`);
      }
      break;
    case 'ACCEPT_INVITE':
      // Navigate to specific zone or start game
      const pl = action.payload;
      let locationConfig = null;
      let locationLV = 1;
      for (const zone of zones) {
        const loc = zone.locations.find(l => l.id === pl.location_id);
        if (loc) {
          locationConfig = loc;
          locationLV = zone.level;
          break;
        }
      }
      if (locationConfig) {
        const table = locationConfig.tables;
        const joinPayload = {
          inviteId: msgId,
          size: pl.available || 6,
          buyIn: table.amount,
          rake: table.baseRake || 0,
          rakeCap: table.rakeCap || 0,
          isHighStakes: table.isHighStakes || false,
          locationLV: locationLV,
          sb: table.sb,
          bb: table.bb,
          locationId: locationConfig.id,
          locationName: locationConfig.name,
          backgroundDescription: locationConfig.backgroundDescription
        };
        window.dispatchEvent(new CustomEvent('join-table', { detail: joinPayload }));
        // deleteMessage(msgId);
      }
      break;
    case 'DELETE_MESSAGE':
      deleteMessage(msgId);
      break;
  }
  audioManager.playSFX('notification');
}

export const sendLoreAndSpamMessage = () => {
  const loreSpamMessage = getRndLoreSpamMessage();

  sendMessage(loreSpamMessage.type, loreSpamMessage.title, loreSpamMessage.body, []);
}

