
import { store } from './store';
import { zones } from './zone';
import { getRndLoreSpamMessage } from './lore_spam_message';
import { audioManager } from './audioManager';
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

export const handleMessageAction = (msgId, actionIndex) => {
  const msg = store.messages.find(m => m.id === msgId);
  if (!msg || !msg.actions[actionIndex]) return;

  const action = msg.actions[actionIndex];

  // Process Action Logic
  switch (action.actionType) {
    case 'PAY_RENT':
    case 'PAY_TAX':
    case 'PAY_FINE':
      const amount = action.payload.amount;
      if (store.bankroll >= amount) {
        store.bankroll -= amount;
        sendMessage('SYSTEM', 'Payment Successful', `Successfully paid ${amount.toLocaleString()} CR.`);
        deleteMessage(msgId); // Remove bill after payment
        // Trigger success effect?
      } else {
        sendMessage('SYSTEM', 'Insufficient Funds!', `You need ${amount.toLocaleString()} CR to pay this bill.`);
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
        deleteMessage(msgId);
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
  sendMessage(loreSpamMessage.type, loreSpamMessage.title, loreSpamMessage.body, [{ label: 'DEL', actionType: 'DELETE_MESSAGE', payload: {} }]);
}

