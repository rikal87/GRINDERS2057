<template>
  <div class="crypto-exchange cyberpunk-container">
    <div class="scanlines"></div>
    <div class="vignette"></div>

    <header class="exchange-header">
      <div class="header-left">
        <button class="btn-back nexus-btn" @click="$emit('back')">
          <span class="btn-glitch">DISCONNECT</span>
          <span class="btn-tag">ESC</span>
        </button>
      </div>
      <div class="market-status">
        <span class="status-label">MARKET_STATUS:</span>
        <span class="status-val neon-green">LIVE_FEED_ACTIVE</span>
        <span class="update-timer">NEXT_UPDATE: {{ timeToNextUpdate }}s</span>
      </div>
      <div class="player-balance">
        <span class="label">NET_WORTH</span>
        <span class="value">{{ netWorth.toLocaleString() }} <span class="unit">CR</span></span>
      </div>
      <div class="player-balance">
        <span class="label">CASH</span>
        <span class="value">{{ store.bankroll.toLocaleString() }} <span class="unit">CR</span></span>
      </div>
    </header>

    <div class="main-layout">
      <!-- Market Ticker / News -->
      <div class="news-ticker glass-panel">
        <div class="ticker-content">
          <span v-if="marketState.activeEvents.length > 0">
            >>> BREAKING NEWS:
            <span v-for="evt in marketState.activeEvents" :key="evt.id" class="news-item">
              [{{ evt.text }}]
            </span>
            <<< </span>
              <span v-else>
                >>> MARKET STABLE >>> NO ACTIVE THREATS >>> MONITORING NETWORK TRAFFIC...
              </span>
        </div>
      </div>

      <div class="content-grid">
        <!-- Coin List -->
        <section class="coin-list-section glass-panel">
          <div class="list-header-row">
            <h2 class="section-title"><i class="icon-market"></i> ASSET_LISTINGS</h2>
            <div class="view-tabs">
              <button :class="{ active: viewMode === 'MARKET' }" @click="viewMode = 'MARKET'">MARKET</button>
              <button :class="{ active: viewMode === 'PORTFOLIO' }" @click="viewMode = 'PORTFOLIO'">PORTFOLIO</button>
            </div>
          </div>

          <div class="coin-grid-header">
            <span>ASSET</span>
            <span>PRICE</span>
            <span v-if="viewMode === 'MARKET'">24H%</span>
            <span v-else>AVG BUY</span>
            <span v-if="viewMode === 'MARKET'">RISK</span>
            <span v-else>ROI</span>
            <span v-if="viewMode === 'PORTFOLIO'">VAL</span>
            <span v-else>ACTION</span>
          </div>
          <div class="coin-list custom-scroll">
            <div v-if="filteredCoins.length === 0" class="empty-list">
              <p>NO_ASSETS_FOUND</p>
            </div>
            <div v-for="coin in filteredCoins" :key="coin.id" class="coin-row"
              :class="{ 'delisted': coin.delisted, 'selected': selectedCoin?.id === coin.id }"
              @click="selectCoin(coin)">
              <div class="coin-name">
                <span class="ticker">{{ coin.symbol }}</span>
                <span class="full-name">{{ coin.name }}</span>
              </div>
              <div class="coin-price">
                <span v-if="!coin.delisted">{{ formatPrice(coin.price) }} CR</span>
                <span v-else class="delisted-tag">DELISTED</span>
              </div>
              <div class="coin-trend" :class="getTrendClass(coin)">
                <template v-if="viewMode === 'MARKET'">
                  {{ getTrendIcon(coin) }} {{ getTrendPercent(coin) }}%
                </template>
                <template v-else>
                  {{ formatPrice(getAvgPrice(coin.id)) }}
                </template>
              </div>
              <div class="coin-risk">
                <template v-if="viewMode === 'MARKET'">
                  <div class="risk-bar">
                    <div class="risk-fill"
                      :style="{ width: (coin.risk * 1000) + '%', backgroundColor: getRiskColor(coin.risk) }"></div>
                  </div>
                </template>
                <template v-else>
                  <span :class="getRoiClass(coin)">{{ getRoi(coin) }}%</span>
                </template>
              </div>
              <div class="coin-action">
                <span v-if="viewMode === 'PORTFOLIO'" class="holding-val">
                  {{ formatPrice(getHoldingValue(coin)) }}
                </span>
                <button v-else-if="!coin.delisted" class="btn-select">TRADE</button>
              </div>
            </div>
          </div>
        </section>

        <!-- Trading Terminal -->
        <section class="trading-section glass-panel">
          <h2 class="section-title"><i class="icon-terminal"></i> TRANSACTION_TERMINAL</h2>

          <div v-if="selectedCoin" class="terminal-content">
            <div class="selected-header">
              <div class="coin-big-icon">{{ selectedCoin.symbol[0] }}</div>
              <div class="coin-details">
                <h3>{{ selectedCoin.name }} [{{ selectedCoin.symbol }}]</h3>
                <span class="live-price">{{ formatPrice(selectedCoin.price) }} CR</span>
              </div>
              <!-- Mini Chart -->
              <div class="coin-chart">
                <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                  <path :d="getChartPath(selectedCoin)" fill="none" class="chart-line" />
                </svg>
              </div>
            </div>

            <div class="portfolio-info">
              <div class="holding">
                <span class="label">HOLDING</span>
                <span class="value">{{ getHoldingAmount(selectedCoin.id) }} {{ selectedCoin.symbol }}</span>
              </div>
              <div class="holding">
                <span class="label">AVG_BUY</span>
                <span class="value">{{ formatPrice(getAvgPrice(selectedCoin.id)) }} CR</span>
              </div>
              <div class="holding">
                <span class="label">VALUE</span>
                <span class="value">{{ formatPrice(getHoldingValue(selectedCoin)) }} CR</span>
              </div>
              <div class="holding">
                <span class="label">ROI</span>
                <span class="value" :class="getRoiClass(selectedCoin)">{{ getRoi(selectedCoin) }}%</span>
              </div>
            </div>

            <div v-if="!selectedCoin.delisted" class="trade-controls">
              <div class="tabs">
                <button :class="{ active: tradeMode === 'BUY' }" @click="tradeMode = 'BUY'">BUY</button>
                <button :class="{ active: tradeMode === 'SELL' }" @click="tradeMode = 'SELL'">SELL</button>
              </div>

              <div class="input-area">
                <label v-if="tradeMode === 'BUY'">AMOUNT (CR)</label>
                <label v-else>AMOUNT ({{ selectedCoin.symbol }})</label>

                <div class="input-wrapper">
                  <input type="number" v-model.number="tradeAmount" min="0">
                  <button class="btn-max" @click="setMax">MAX</button>
                </div>
              </div>

              <div class="preview-area">
                <p>ESTIDMATED {{ tradeMode === 'BUY' ? 'RECEIVE' : 'RETURN' }}:</p>
                <span class="preview-val">
                  {{ tradePreview }}
                  {{ tradeMode === 'BUY' ? selectedCoin.symbol : 'CR' }}
                </span>
              </div>

              <button class="btn-execute" :class="tradeMode" @click="executeTrade" :disabled="!canTrade">
                CONFIRM_EXECUTION
              </button>
            </div>
            <div v-else class="delisted-warning">
              TRADING SUSPENDED via NETWORK PROTOCOL 404. ASSET LIQUIDATED.
            </div>
          </div>
          <div v-else class="empty-terminal">
            <p>SELECT_ASSET_TO_BEGIN_TRANSACTION</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { store } from '../logic/store';
import { marketState, initMarket, buyCoin, sellCoin } from '../logic/cryptoMarket';

defineEmits(['back']);

const selectedCoin = ref(null);
const tradeMode = ref('BUY');
const tradeAmount = ref(0);
const timeToNextUpdate = ref(10);
const viewMode = ref('MARKET'); // MARKET | PORTFOLIO

const filteredCoins = computed(() => {
  if (viewMode.value === 'MARKET') {
    return marketState.coins;
  } else {
    // Portfolio Mode: Only show coins with > 0 holdings
    return marketState.coins.filter(c => getHoldingAmount(c.id) > 0);
  }
});

const netWorth = computed(() => {
  let total = store.bankroll;
  if (!store.cryptoPortfolio) return total;

  for (const [coinId, entry] of Object.entries(store.cryptoPortfolio)) {
    const coin = marketState.coins.find(c => c.id === coinId);
    if (coin) {
      const amount = typeof entry === 'number' ? entry : entry.amount;
      total += amount * coin.price;
    }
  }
  return Math.floor(total);
});

const getHoldingAmount = (coinId) => {
  const entry = store.cryptoPortfolio?.[coinId];
  if (!entry) return 0;
  return typeof entry === 'number' ? entry : entry.amount;
};

const getAvgPrice = (coinId) => {
  const entry = store.cryptoPortfolio?.[coinId];
  if (!entry || typeof entry === 'number') return 0;
  return entry.avgPrice;
};

const getHoldingValue = (coin) => {
  return getHoldingAmount(coin.id) * coin.price;
};

const getRoi = (coin) => {
  const entry = store.cryptoPortfolio?.[coin.id];
  if (!entry || typeof entry === 'number' || entry.avgPrice === 0) return '0.00';

  const diff = coin.price - entry.avgPrice;
  return ((diff / entry.avgPrice) * 100).toFixed(2);
};

const getRoiClass = (coin) => {
  const roi = parseFloat(getRoi(coin));
  if (roi > 0) return 'trend-up';
  if (roi < 0) return 'trend-down';
  return 'trend-flat';
};

let timerInterval = null;

onMounted(() => {
  initMarket();

  // Update local timer visual
  timerInterval = setInterval(() => {
    // Check real store time
    const now = Date.now();
    const diff = now - store.marketState.lastUpdate;
    // Assuming 60s update for demo (matching logic file)
    const remaining = Math.max(0, 60000 - diff);
    timeToNextUpdate.value = Math.ceil(remaining / 1000);
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

const selectCoin = (coin) => {
  selectedCoin.value = coin;
  tradeAmount.value = 0;
};

const formatPrice = (p) => {
  return p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const getTrendPercent = (coin) => {
  if (!coin.prevPrice || coin.delisted) return '0.00';
  const diff = ((coin.price - coin.prevPrice) / coin.prevPrice) * 100;
  return diff.toFixed(2);
};

const getTrendClass = (coin) => {
  const p = parseFloat(getTrendPercent(coin));
  if (p > 0) return 'trend-up';
  if (p < 0) return 'trend-down';
  return 'trend-flat';
};

const getTrendIcon = (coin) => {
  const p = parseFloat(getTrendPercent(coin));
  if (p > 0) return '▲';
  if (p < 0) return '▼';
  return '-';
};

const getRiskColor = (risk) => {
  if (risk < 0.01) return '#00f0ff'; // Safe
  if (risk < 0.05) return '#ffff00'; // Mid
  return '#ff003c'; // Danger
};

const setMax = () => {
  if (!selectedCoin.value) return;

  if (tradeMode.value === 'BUY') {
    tradeAmount.value = store.bankroll;
  } else {
    tradeAmount.value = getHoldingAmount(selectedCoin.value.id);
  }
};

const tradePreview = computed(() => {
  if (!selectedCoin.value || tradeAmount.value <= 0) return 0;

  if (tradeMode.value === 'BUY') {
    return (tradeAmount.value / selectedCoin.value.price).toFixed(4);
  } else {
    return formatPrice(tradeAmount.value * selectedCoin.value.price);
  }
});

const canTrade = computed(() => {
  if (tradeAmount.value <= 0) return false;
  if (tradeMode.value === 'BUY') return store.bankroll >= tradeAmount.value;
  if (tradeMode.value === 'SELL') return getHoldingAmount(selectedCoin.value.id) >= tradeAmount.value;
  return false;
});

const executeTrade = () => {
  if (!canTrade.value) return;

  // Logic from module will return success bool
  // Actually logic module needs to be imported or re-implemented here if not using direct store access
  // We imported buyCoin/sellCoin

  // Note: logic buyCoin takes (coinId, amountCR)
  // sellCoin takes (coinId, amountCoin)

  let success = false;
  if (tradeMode.value === 'BUY') {
    // Logic implementation
    // We update store bankroll
    // Updated logic import
    // Let's implement directly since we have direct access to store and it's simpler for UI feedback
    if (buyCoin(selectedCoin.value.id, tradeAmount.value)) {
      success = true;
    }
  } else {
    // SELL
    if (sellCoin(selectedCoin.value.id, tradeAmount.value)) {
      success = true;
    }
  }

  if (success) {
    tradeAmount.value = 0;
    // Provide Feedback?
  }
};

const getChartPath = (coin) => {
  if (!coin.history || coin.history.length < 2) return '';
  const data = coin.history;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Map points to 0-100 x, 0-40 y (inverted y)
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * 100;
    const normalizedY = (val - min) / range;
    const y = 40 - (normalizedY * 40);
    return `${x},${y}`;
  });

  return `M ${points.join(' L ')}`;
};
</script>

<style scoped>
.crypto-exchange {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #050a0e;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  font-family: 'Inter', sans-serif;
  color: #fff;
  z-index: 50;
}

/* Reusing some SafeHouse styles for consistency */
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
  z-index: 100;
  opacity: 0.3;
}

.vignette {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, transparent 40%, rgba(0, 0, 0, 0.8) 100%);
  pointer-events: none;
  z-index: 101;
}

.exchange-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  z-index: 10;
}

.nexus-btn {
  background: rgba(0, 240, 255, 0.05);
  border: 1px solid var(--neon-cyan);
  color: var(--neon-cyan);
  padding: 8px 16px;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
  clip-path: polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%);
}

.nexus-btn:hover {
  background: var(--neon-cyan);
  color: #000;
  box-shadow: 0 0 20px var(--neon-cyan);
}

.status-label,
.label {
  font-size: 0.6rem;
  opacity: 0.6;
  margin-right: 8px;
}

.status-val {

  font-weight: 900;
  text-shadow: 0 0 5px #39ff14;
}

.update-timer {
  font-size: 0.6rem;
  margin-left: 15px;
  color: #aaa;
}

.player-balance .value {
  font-size: 1.2rem;
  color: var(--neon-yellow);
  font-weight: 900;

}

.main-layout {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1.5rem;
  z-index: 10;
  overflow: hidden;
  min-height: 0;
  /* Crucial for nested flex scrolling */
}

.news-ticker {
  height: 30px;
  background: rgba(255, 0, 0, 0.1);
  border-top: 1px solid rgba(255, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 0, 0, 0.3);
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
}

.ticker-content {
  animation: scroll-left 20s linear infinite;
  color: var(--neon-magenta);

  font-size: 0.8rem;
}

@keyframes scroll-left {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.content-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
  flex: 1;
  overflow: hidden;
  min-height: 0;
  /* Crucial for nested flex scrolling */
}

.glass-panel {
  background: rgba(10, 20, 30, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 240, 255, 0.2);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.section-title {
  color: var(--neon-cyan);
  font-size: 0.8rem;
  margin-bottom: 1rem;
  letter-spacing: 2px;
  border-bottom: 1px solid rgba(0, 240, 255, 0.2);
  padding-bottom: 5px;
}

.coin-grid-header {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr;
  font-size: 0.6rem;
  opacity: 0.5;
  margin-bottom: 10px;
  padding: 0 10px;
}

.list-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 240, 255, 0.2);
  margin-bottom: 10px;
  padding-bottom: 5px;
}

.list-header-row .section-title {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.view-tabs {
  display: flex;
  gap: 10px;
}

.view-tabs button {
  background: transparent;
  border: none;
  color: #666;
  font-size: 0.6rem;
  font-weight: 800;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 2px;
}

.view-tabs button.active {
  color: var(--neon-cyan);
  background: rgba(0, 240, 255, 0.1);
}

.empty-list {
  padding: 20px;
  text-align: center;
  color: #666;
  font-size: 0.8rem;
}

.holding-val {

  color: var(--neon-cyan);
  font-weight: bold;
}

.coin-list {
  flex: 1;
  overflow-y: auto;
}

.coin-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr;
  padding: 12px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  align-items: center;
  transition: all 0.2s;
}

.coin-row:hover {
  background: rgba(255, 255, 255, 0.05);
}

.coin-row.selected {
  background: rgba(0, 240, 255, 0.1);
  border-left: 2px solid var(--neon-cyan);
}

.coin-row.delisted {
  opacity: 0.4;
  pointer-events: none;
  filter: grayscale(1);
}

.ticker {

  font-weight: 900;
  color: var(--neon-cyan);
  margin-right: 8px;
}

.full-name {
  font-size: 0.8rem;
  opacity: 0.7;
}

.coin-price {}

.trend-up {
  color: #39ff14;
}
.trend-down {
  color: #ff003c;
}
.trend-flat {
  color: #aaa;
}

.risk-bar {
  width: 100%;
  height: 4px;
  background: #333;
  border-radius: 2px;
}

.risk-fill {
  height: 100%;
  border-radius: 2px;
}

.btn-select {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 0.6rem;
  padding: 2px 6px;
  cursor: pointer;
}

.trading-section {
  border: 1px solid var(--neon-cyan);
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.1);
}

.terminal-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.selected-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 2rem;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
  padding-bottom: 1rem;
}

.coin-big-icon {
  width: 50px;
  height: 50px;
  background: var(--neon-cyan);
  color: #000;
  font-size: 2rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  clip-path: polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%);
}

.coin-details h3 {
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.live-price {
  font-size: 1rem;

  color: var(--neon-yellow);
}

.coin-chart {
  flex: 1;
  height: 60px;
  margin-left: 20px;
  border: 1px solid rgba(0, 240, 255, 0.1);
  background: rgba(0, 20, 40, 0.3);
}

.coin-chart svg {
  width: 100%;
  height: 100%;
}

.chart-line {
  stroke: var(--neon-cyan);
  stroke-width: 2px;
  vector-effect: non-scaling-stroke;
}

.portfolio-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 10px;
}

.holding {
  display: flex;
  flex-direction: column;
}
.holding .value {
  color: var(--neon-cyan);
  font-weight: bold;
}

.trade-controls {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tabs {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tabs button {
  flex: 1;
  background: transparent;
  border: none;
  color: #888;
  padding: 10px;
  cursor: pointer;
  font-weight: 900;
  transition: all 0.3s;
}

.tabs button.active {
  color: #fff;
  border-bottom: 2px solid var(--neon-cyan);
  background: rgba(0, 240, 255, 0.05);
}

.input-area label {
  display: block;
  font-size: 0.7rem;
  opacity: 0.7;
  margin-bottom: 8px;
}

.input-wrapper {
  display: flex;
  gap: 10px;
}

.input-wrapper input {
  flex: 1;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #444;
  color: #fff;
  padding: 10px;

  font-size: 1.1rem;
}

.btn-max {
  background: #333;
  border: 1px solid #555;
  color: #fff;
  padding: 0 15px;
  cursor: pointer;
}

.preview-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 10px;
}

.preview-val {

  font-weight: bold;
  color: var(--neon-green);
}

.btn-execute {
  padding: 15px;
  font-weight: 900;
  cursor: pointer;
  border: none;
  clip-path: polygon(0 0, 100% 0, 100% 80%, 95% 100%, 0 100%);
}

.btn-execute.BUY {
  background: #39ff14;
  color: #000;
}

.btn-execute.SELL {
  background: #ff003c;
  color: #fff;
}

.btn-execute:disabled {
  background: #333;
  color: #888;
  cursor: not-allowed;
}

.empty-terminal {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
  font-size: 0.8rem;
}

.delisted-warning {
  color: #ff003c;
  background: rgba(255, 0, 60, 0.1);
  border: 1px solid #ff003c;
  padding: 20px;
  text-align: center;
  font-weight: 900;
}
</style>
