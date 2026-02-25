<template>
  <div class="black-market-container">
    <div class="scanlines"></div>
    <div class="vignette"></div>

    <!-- Background Elements -->
    <div class="bg-grid"></div>

    <div class="market-layout">
      <!-- LEFT PANEL: Dealer & Controls -->
      <aside class="dealer-panel glass-panel">
        <header class="market-header">
          <h1 class="market-title" data-text="BLACK_MARKET">BLACK_MARKET</h1>
          <div class="sub-title">UNTRACEABLE GOODS // NO REFUNDS</div>
        </header>

        <div class="dealer-visual">
          <div class="dealer-silhouette">
            <div class="eye-glow"></div>
          </div>
          <div class="dealer-dialogue">
            <p class="dialogue-text">"{{ dealerMessage }}"</p>
          </div>
          <div class="refresh-section">
            <div class="refresh-info">
              <span>STOCK_CYCLE:</span>
              <span class="timer">{{ formatTime(nextRefreshIn) }}</span>
            </div>
            <button class="btn-refresh glitch-btn" :disabled="!canManualRefresh()" @click="handleManualRefresh">
              <div class="btn-content">BRIBE_DEALER</div>
              <div class="btn-decoration">{{ getRefreshCost() }} CR</div>
            </button>
            <div class="bribe-level" v-if="store.shop.manualRefreshCount > 0">
              BRIBE_LEVEL: <span class="level-val">{{ store.shop.manualRefreshCount }}</span>
            </div>
          </div>
        </div>

        <div class="player-wallet">
          <div class="label">YOUR_CREDITS</div>
          <div class="value">{{ store.bankroll.toLocaleString() }} <span class="currency">CR</span></div>
        </div>

        <div class="control-actions">

          <button class="btn-leave" @click="$emit('back')">
            LEAVE_AREA
          </button>
        </div>
      </aside>
      <!-- RIGHT PANEL: Merchandise -->
      <main class="merch-panel">
        <div class="items-grid" v-if="store.shop.items.length > 0">
          <div v-for="(item, idx) in store.shop.items" :key="item.instanceId" class="item-card" :class="{
            'special-offer': item.isSpecialOffer
          }" @click="buyItem(item, idx)">
            <div class="card-header">
              <span class="tier-tag" :class="'tier-' + item.tier">{{ item.tier }}</span>
              <span class="special-tag" v-if="item.isSpecialOffer">{{ item.specialLabel }}</span>
            </div>

            <div class="item-icon">{{ item.icon }}</div>

            <div class="item-details">
              <h3 class="name">{{ item.name }}</h3>
              <p class="desc">{{ item.desc }}</p>

              <div class="effects-mini">
                <div v-for="eff in item.effects" :key="eff?.name" class="eff-badge"
                  :class="'rarity-' + (eff?.rarity ? eff.rarity.toLowerCase() : 'common')">
                  <span class="eff-name">{{ eff?.name }}</span>
                  <span class="eff-desc">{{ eff?.desc }}</span>
                </div>
              </div>
            </div>

            <div class="item-price">
              <div v-if="item.discount" class="discount-box">
                <span class="original">{{ item.originalPrice }}</span>
                <span class="percent">-{{ item.discount }}%</span>
              </div>
              <div class="final-price" :class="{ 'can-afford': store.bankroll >= item.price }">
                {{ item.price }} CR
              </div>
            </div>

            <div class="buy-overlay" :class="{ 'insufficient': store.bankroll < item.price }">
              <span>{{ store.bankroll < item.price ? 'INSUFFICIENT_FUNDS' : 'PURCHASE' }}</span>
            </div>
          </div>
        </div>
        <div v-else class="empty-stock">
          <h2>OUT_OF_STOCK</h2>
          <p>Come back later or grease the wheels...</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { store, gainShopRefreshCount } from '../logic/store';
import { audioManager } from '../logic/audioManager';
import { refreshShop, getRefreshCost, canManualRefresh, checkAutoRefresh, REFRESH_INTERVAL_MS } from '../logic/shopLogic';
import { getinstanceId } from '../logic/items';

defineEmits(['back']);

const nextRefreshIn = ref(0);
const dealerMessage = ref('');
let timer = null;

const DEALER_QUOTES = {
  enter: [
    "Look who decided to show up. Use cash, no traces.",
    "Got some new toys from Arasaka... fell off a truck.",
    "Be quick. I don't like loiterers.",
    "Whatever you need to survive, I got it.",
    "The data stream brought you here? Or was it desperation?",
    "Eyes open. The city is watching.",
    "Welcome to the dark side of the street.",
    "Don't touch the merchandise unless you're buying.",
    "Stay sharp. The streets are unforgiving."
  ],
  buy: [
    "Smart choice. That one's a lifesaver.",
    "Payment received. Pleasure doing business.",
    "Don't ask where I got that.",
    "Heh, I knew you'd like that one.",
    "A fine piece of tech. Treat it well.",
    "No refunds, by the way.",
    "It'll serve you better than your last one.",
    "Smooth transaction. Just how I like it.",
    "Consider it an investment in your survival."
  ],
  refresh: [
    "Let me check the back... for a price.",
    "Alright, let's see what else came in.",
    "Money talks. New stock available.",
    "You have expensive taste. I like that.",
    "Decrypting a new shipment...",
    "Found something interesting in the deep web.",
    "If you have the credits, I have the goods.",
    "Refreshing the inventory. Don't blink.",
    "Let's see what the scavs dragged in."
  ],
  poor: [
    "Not enough creds. Get out of here.",
    "I ain't running a charity.",
    "Come back when you're rich.",
    "Insufficient funds. Don't waste my time.",
    "Looks like you're tapped out.",
    "No eddies, no service.",
    "Go earn some scratch, then we talk.",
    "My time is money. You have neither."
  ]
};

const setRandomQuote = (type) => {
  const quotes = DEALER_QUOTES[type];
  if (quotes) {
    dealerMessage.value = quotes[Math.floor(Math.random() * quotes.length)];
  }
};

const updateTimer = () => {
  const now = Date.now();
  const elapsed = now - store.shop.lastRefreshTime;
  nextRefreshIn.value = Math.max(0, REFRESH_INTERVAL_MS - elapsed);
  checkAutoRefresh();
};

onMounted(() => {
  if (store.shop.items.length === 0) {
    refreshShop(false);
  }
  updateTimer();
  timer = setInterval(updateTimer, 1000);
  setRandomQuote('enter');
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const formatTime = (ms) => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const isHighTier = (item) => {
  if (!item || !item.tier) return false;
  const t = parseInt(item.tier.replace('T', ''));
  return t >= 4;
};

const buyItem = (item, idx) => {
  if (store.bankroll >= item.price) {
    store.bankroll -= item.price;
    if (item.isAccessKey) {
      if (!store.unlockedLocations) store.unlockedLocations = [];
      store.unlockedLocations.push(item.id);
    } else if (item.isConsumable) {
      console.info('item.id')
      if (item.id === 'black_consumer') gainShopRefreshCount(-5)

    } else {
      item.instanceId = getinstanceId(item)
      // Only add to inventory if NOT an access key (or maybe both? user just said add to store)
      // Actually, access keys probably shouldn't clutter the inventory if they are just passive unlocks.
      // But let's add them to inventory for now so user sees what they bought, 
      // AND add to unlockedLocations for logic.
      store.ownedProtectors.push(item);
    }
    audioManager.playSFX('coin-throw');
    store.shop.items.splice(idx, 1);
    setRandomQuote('buy');
  } else {
    audioManager.playSFX('ui-error');
    setRandomQuote('poor');
  }
};

const handleManualRefresh = () => {
  if (refreshShop(true)) {
    audioManager.playSFX('opening-door');
    updateTimer();
    setRandomQuote('refresh');
  } else {
    setRandomQuote('poor');
  }
};
</script>

<style scoped>
.black-market-container {
  flex-grow: 1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #020202;
  color: #e0e0e0;
  overflow: hidden;
  z-index: 50;
}

/* Background FX */
.bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(0, 255, 127, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 127, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.5;
  pointer-events: none;
}

.scanlines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
    linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
  background-size: 100% 4px, 3px 100%;
  pointer-events: none;
  z-index: 10;
  opacity: 0.4;
}

.market-layout {
  /* position: relative; */
  z-index: 20;
  height: 100%;
  display: grid;
  grid-template-columns: 350px 1fr;
  flex-grow: 1;
  gap: 2px;
}

/* LEFT SIDE */
.dealer-panel {
  background: rgba(10, 15, 20, 0.95);
  border-right: 2px solid #333;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 10px 0 30px rgba(0, 0, 0, 0.8);
}

.market-header {
  margin-bottom: 2rem;
  flex-direction: column;
}

.market-title {
  font-size: 1.75rem;
  color: #ff0055;
  /* margin: 0; */
  letter-spacing: -2px;
  text-transform: uppercase;
  text-shadow: 2px 2px 0px #00ffcc;
  position: relative;
}

.sub-title {
  font-size: 0.7rem;
  color: #555;
  letter-spacing: 2px;
}

.dealer-visual {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: 2rem;
}

.dealer-silhouette {
  width: 150px;
  height: 150px;
  background: #111;
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 1);
  margin-bottom: 1.5rem;
}

.eye-glow {
  position: absolute;
  top: 56%;
  left: 46%;
  width: 30px;
  height: 30px;
  background: #ff0055;
  border-radius: 50%;
  box-shadow: 0 0 10px #ff0055;
  animation: blink 4s infinite;
}

.dealer-dialogue {
  background: #000;
  border: 1px solid #333;
  padding: 1rem;
  width: 100%;
  min-height: 80px;
  position: relative;
}

.dealer-dialogue::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #333;
}

.dialogue-text {
  color: #00ffcc;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
  font-style: italic;
}

.player-wallet {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 4px solid #ffd700;
}

.player-wallet .label {
  font-size: 0.7rem;
  color: #888;
  margin-bottom: 5px;
}

.player-wallet .value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #fff;
}

.player-wallet .currency {
  font-size: 1rem;
  color: #ffd700;
}

.control-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.refresh-section {
  border-top: 1px solid #333;
  padding-top: 1rem;
}

.refresh-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.btn-refresh {
  width: 100%;
  background: transparent;
  border: 1px solid #ff0055;
  color: #ff0055;
  padding: 12px;
  font-family: inherit;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.btn-refresh:hover:not(:disabled) {
  background: #ff0055;
  color: #000;
  box-shadow: 0 0 15px #ff0055;
}

.btn-refresh:disabled {
  border-color: #333;
  color: #333;
  cursor: not-allowed;
}

.bribe-level {
  font-size: 0.7rem;
  color: #444;
  text-align: center;
  margin-top: 5px;
}
.bribe-level .level-val {
  color: #ff0055;
}

.btn-leave {
  border: none;
  padding: 10px;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.2s;
}

/* RIGHT SIDE */
.merch-panel {
  padding: 2rem;
  height: 100%;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.4);
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.item-card.special-offer {
  border-color: #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.1);
}

.item-card:hover .buy-overlay {
  opacity: 1;
}

.buy-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 255, 204, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.buy-overlay.insufficient {
  background: rgba(255, 0, 60, 0.2);
  border: 1px solid var(--neon-magenta);
}

.buy-overlay.insufficient span {
  background: var(--neon-magenta);
  color: #fff;
  box-shadow: 0 0 15px var(--neon-magenta);
}

.buy-overlay span {
  background: #00ffcc;
  color: #000;
  padding: 5px 10px;
  font-weight: bold;
  transform: rotate(-5deg);
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.special-tag {
  font-size: 0.7rem;
  background: #ffd700;
  color: #000;
  padding: 2px 6px;
  font-weight: bold;
}

.item-icon {
  font-size: 3rem;
  text-align: center;
  margin: 1rem 0;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));
}

.item-details {
  flex: 1;
}

.effects-mini {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 15px;
  align-items: flex-start;
}

.eff-badge {
  display: flex;
  flex-direction: column;
  background: rgba(0, 240, 255, 0.05);
  border-left: 2px solid var(--neon-cyan);
  padding: 4px 8px;
  width: 100%;
  text-align: left;
}

.eff-name {
  color: var(--neon-cyan);
  font-size: 0.6rem;
  /* font-weight: bold; */
  text-transform: uppercase;
  letter-spacing: 1px;
}

.eff-desc {
  color: #ccc;
  font-size: 1rem;
  line-height: 1.2;
}

.item-price {
  margin-top: 1rem;
  text-align: right;
}

.discount-box {
  font-size: 0.8rem;
  color: #888;
  text-decoration: line-through;
}
.discount-box .percent {
  color: #ff0055;
  text-decoration: none;
  font-weight: bold;
  margin-left: 5px;
}

.final-price {
  font-size: 1.4rem;
  color: #555;
  /* Disabled look by default */
  font-weight: bold;
}

.final-price.can-afford {
  color: #00ffcc;
  text-shadow: 0 0 5px rgba(0, 255, 204, 0.5);
}

@keyframes blink {
  0%,
  90%,
  100% {
    opacity: 1;
  }
  95% {
    opacity: 0;
  }
}

/* Scrollbar */
.merch-panel::-webkit-scrollbar {
  width: 6px;
}
.merch-panel::-webkit-scrollbar-track {
  background: #000;
}
.merch-panel::-webkit-scrollbar-thumb {
  background: #333;
}
.merch-panel::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
