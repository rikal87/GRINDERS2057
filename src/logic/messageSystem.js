
import { store } from './store';

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
        alert('Insufficient Funds!');
      }
      break;
    case 'ACCEPT_INVITE':
      // Navigate to specific zone or start game
      // This might need a callback or global event bus
      console.log('Invite accepted:', action.payload);
      break;
  }
}
