<template>
  <div class="black-market-container">
    <div class="scanlines"></div>
    <div class="vignette"></div>

    <!-- Background Elements -->
    <div class="bg-grid"></div>

    <div class="market-layout">
      <!-- LEFT PANEL: Dealer & Controls (Mobile: Top CCTV Header) -->
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
              <div class="btn-decoration">{{ getRefreshCost().toLocaleString() }} CR</div>
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
          <button class="btn-catalog" @click="openCatalog">ITEM_CATALOG</button>
          <button class="btn-leave" @click="$emit('back')">LEAVE</button>
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
              <div class="price-mobile-inline">{{ item.price.toLocaleString() }} CR</div>
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
                <span class="original">{{ item.originalPrice.toLocaleString() }} CR</span>
                <span class="percent">-{{ item.discount }}%</span>
              </div>
              <div class="final-price" :class="{ 'can-afford': store.bankroll >= item.price }">
                {{ item.price.toLocaleString() }} CR
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
import { store, gainShopRefreshCount, gainBankroll } from '../logic/store';
import { audioManager } from '../logic/audioManager';
import { refreshShop, getRefreshCost, canManualRefresh, checkAutoRefresh, REFRESH_INTERVAL_MS } from '../logic/shopLogic';
import { getinstanceId } from '../logic/items';
import { gainPartnersRelationshipOliveBranch } from '../logic/partnerSystem';
import { TYPE_CHANGE_BANKROLL } from '../logic/constants.js'

defineEmits(['back']);

const nextRefreshIn = ref(0);
const dealerMessage = ref('');
let timer = null;

const openCatalog = () => {
  window.dispatchEvent(new CustomEvent('open-item-catalog'));
};

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
  const now = store.gameTime;
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
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const buyItem = (item, idx) => {
  if (store.bankroll >= item.price) {
    gainBankroll(-item.price, TYPE_CHANGE_BANKROLL.BUY_ITEM)
    if (item.isAccessKey) {
      if (!store.unlockedLocations) store.unlockedLocations = [];
      store.unlockedLocations.push(item.id);
    } else if (item.isConsumable) {
      console.info('item.id')
      if (item.id === 'black_consumer') gainShopRefreshCount(-5)
      if (item.id === 'olive_branch') gainPartnersRelationshipOliveBranch()

    } else {
      item.instanceId = getinstanceId(item)
      // Only add to inventory if NOT an access key (or maybe both? user just said add to store)
      // Actually, access keys probably shouldn't clutter the inventory if they are just passive unlocks.
      // But let's add them to inventory for now so user sees what they bought, 
      // AND add to unlockedLocations for logic.
      store.ownedItems.push(item);
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

<style lang="css">
@import '../styles/components/Shop.css';
@import '../styles/components/Shop-layout-desktop.css';
@import '../styles/components/Shop-layout-mobile.css';
</style>

