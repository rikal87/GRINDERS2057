import { reactive } from 'vue';
import { store, gainBankroll, TYPE_CHANGE_BANKROLL } from './store';

// Coin Definitions
const COIN_TYPES = {
  VITE: { name: 'ViteCoin', symbol: 'VITE', volatility: 0.05, risk: 0.0 },
  ETERNAL: { name: 'Eternalrium', symbol: 'ETR', volatility: 0.15, risk: 0.01 },
  SOUL: { name: 'SOULana', symbol: 'SOUL', volatility: 0.10, risk: 0.02 },
  DOGE: { name: 'D.O.G.E', symbol: 'DOGE', volatility: 0.30, risk: 0.07 }
};

// Random Coin Generator
const PREFIXES = ['Neuro', 'Cyber', 'Quantum', 'Plasma', 'Nano', 'Net', 'Void', 'Flux', 'Hol', 'Syn', 'Meta', 'Omni', 'Techno', 'Data', 'Bit', 'Block'];
const SUFFIXES = ['Coin', 'Chain', 'Link', 'System', 'Net', 'Flow', 'Credit', 'Token', 'DAO', 'Grid', 'Hash', 'Cash', 'Gold', 'Dust', 'Protocol', 'Base'];

const generateRandomCoin = (index) => {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
  const name = `${prefix}${suffix}`;
  const symbol = (prefix.substring(0, 3) + suffix.substring(0, 1)).toUpperCase();

  // Random characteristics
  const volatility = 0.05 + Math.random() * 0.25; // 5% to 30%
  const risk = Math.random() * 0.05; // 0% to 5% delisting risk
  const price = Math.floor(Math.random() * 5000) + 10;

  // Generate initial history for chart
  const history = [];
  let currentPrice = price;
  for (let i = 0; i < 20; i++) {
    history.unshift(currentPrice);
    currentPrice = currentPrice * (1 + (Math.random() - 0.5) * volatility);
  }

  return {
    id: `RND_${index}_${symbol}`,
    name,
    symbol,
    volatility,
    risk,
    price,
    history,
    delisted: false
  };
};

// Initial state for new market
const generateInitialMarket = () => {
  const staticCoins = Object.keys(COIN_TYPES).map(key => {
    const price = Math.floor(Math.random() * 1000) + 10;
    // Generate initial history
    const history = [];
    let currentPrice = price;
    for (let i = 0; i < 20; i++) {
      history.unshift(currentPrice);
      currentPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.1);
    }

    return {
      id: key,
      ...COIN_TYPES[key],
      price: price,
      history: history
    };
  });

  const randomCoins = Array.from({ length: 15 }, (_, i) => generateRandomCoin(i));

  return [...staticCoins, ...randomCoins];
};

// Market State (reactive)
export const marketState = reactive({
  coins: [],
  activeEvents: [], // [{ id, text, duration, modifiers: { coinId: { multiplier: 1.5, tendency: -0.05 } } }]
  lastUpdate: 0
});

const NEWS_EVENTS = [
  { text: "Arasaka Corp announces VITE adoption.", modifier: { target: 'VITE', volatility: 2.0, trend: 0.02 } },
  { text: "Militech firewall blocked ETERNAL transactions.", modifier: { target: 'ETERNAL', volatility: 1.5, trend: -0.03 } },
  { text: "NetWatch cracks down on SOULana nodes.", modifier: { target: 'SOUL', volatility: 3.0, trend: -0.05 } },
  { text: "DOGE to the Moon! Elon-AI tweets.", modifier: { target: 'DOGE', volatility: 4.0, trend: 0.05 } },
  { text: "Global server outage affects all markets.", modifier: { target: 'ALL', volatility: 0.5, trend: -0.01 } },
  { text: "Quantum computing breakthrough stabilizes networks.", modifier: { target: 'ALL', volatility: 0.2, trend: 0.01 } }
];

// Initialize or Load Market
export const initMarket = () => {
  if (store.marketState && store.marketState.coins && store.marketState.coins.length > 0) {
    marketState.coins = store.marketState.coins;
    marketState.lastUpdate = store.marketState.lastUpdate;

    // Migration: If no history, add it
    marketState.coins.forEach(c => {
      if (!c.history || c.history.length === 0) {
        c.history = [c.price];
        for (let i = 0; i < 19; i++) c.history.push(c.price);
      }
    });

    // Migration: If only static coins exist (old version), add random ones
    if (marketState.coins.length <= 4) {
      const randomCoins = Array.from({ length: 15 }, (_, i) => generateRandomCoin(i));
      marketState.coins = [...marketState.coins, ...randomCoins];
    }

    // [NEW] Portfolio Data Migration (Number -> Object)
    migratePortfolio();

  } else {
    marketState.coins = generateInitialMarket();
    marketState.lastUpdate = Date.now();
    // Sync back to main store for persistence
    store.marketState = {
      coins: marketState.coins,
      lastUpdate: marketState.lastUpdate
    };
  }

  // Start simulation loop (check every 10s, update every 10 min)
  setInterval(updateMarket, 10000);
};

const migratePortfolio = () => {
  if (!store.cryptoPortfolio) return;

  for (const [coinId, value] of Object.entries(store.cryptoPortfolio)) {
    // If legacy format (number), convert to object
    if (typeof value === 'number') {
      const coin = marketState.coins.find(c => c.id === coinId);
      // Best effort: set avgPrice to current price if unknown, to avoid wild ROI
      const currentPrice = coin ? coin.price : 0;
      store.cryptoPortfolio[coinId] = {
        amount: value,
        avgPrice: currentPrice
      };
      console.log(`[CRYPTO] Migrated portfolio entry for ${coinId}`);
    }
  }
};

const updateMarket = () => {
  const now = Date.now();
  // Update every 10 minutes (600,000 ms)
  // For testing/demo purposes, let's make it faster: every 1 minute
  if (now - marketState.lastUpdate < 60000) return;

  // 0. Event Management
  // Chance to spawn event
  if (Math.random() < 0.05 && marketState.activeEvents.length < 1) { // 5% chance per tick
    const template = NEWS_EVENTS[Math.floor(Math.random() * NEWS_EVENTS.length)];
    marketState.activeEvents.push({
      id: Date.now(),
      text: template.text,
      duration: 10, // ticks
      modifier: template.modifier
    });
  }

  // Process active events
  let currentModifiers = {};
  marketState.activeEvents = marketState.activeEvents.filter(e => {
    e.duration--;
    // Apply modifier
    const target = e.modifier.target;
    if (!currentModifiers[target]) currentModifiers[target] = { volatility: 1, trend: 0 };

    currentModifiers[target].volatility *= e.modifier.volatility;
    currentModifiers[target].trend += e.modifier.trend;

    return e.duration > 0;
  });

  marketState.coins.forEach(coin => {
    if (coin.delisted) return;

    // Apply Event Modifiers
    let modVol = 1;
    let modTrend = 0;

    if (currentModifiers['ALL']) {
      modVol *= currentModifiers['ALL'].volatility;
      modTrend += currentModifiers['ALL'].trend;
    }
    // Simplified matching for demo
    const specificMod = currentModifiers[coin.symbol] || currentModifiers[coin.id];
    if (specificMod) {
      modVol *= specificMod.volatility;
      modTrend += specificMod.trend;
    }

    // 1. Delisting Check (Daily chance logic approximated)
    // 1 minute check ~ 1/1440 of a day. 
    // If daily risk is 7%, per minute risk is roughly 0.00005
    if (Math.random() < (coin.risk / 1440) * 10) { // Accelerated risk for demo
      coin.delisted = true;
      coin.price = 0;
      console.log(`[CRYPTO] ${coin.name} has been DELISTED!`);
      return;
    }

    // 2. Price Movement
    const baseChange = (Math.random() - 0.5) * 2 * coin.volatility * modVol;
    const changePercent = baseChange + modTrend;

    let newPrice = coin.price * (1 + changePercent);
    newPrice = Math.max(0.01, newPrice); // Minimum price

    // Keep history (last 20 points)
    coin.history.push(coin.price);
    if (coin.history.length > 20) coin.history.shift();

    coin.prevPrice = coin.price;
    coin.price = newPrice;
  });

  marketState.lastUpdate = now;

  // Persist to store (Deep copy/assign)
  store.marketState = {
    coins: marketState.coins,
    lastUpdate: now
  };
};

export const buyCoin = (coinId, amountCR) => {
  const coin = marketState.coins.find(c => c.id === coinId);
  if (!coin || coin.delisted) return false;

  if (store.bankroll < amountCR) return false;

  const coinAmount = amountCR / coin.price;

  gainBankroll(-amountCR, TYPE_CHANGE_BANKROLL.CRYPTO_TRADE)

  if (!store.cryptoPortfolio) store.cryptoPortfolio = {};

  // Migration & Update Logic
  // Structure: { amount: number, avgPrice: number }
  // Handle legacy number-only portfolio
  let currentEntry = store.cryptoPortfolio[coinId];

  if (typeof currentEntry === 'number') {
    currentEntry = { amount: currentEntry, avgPrice: 0 }; // Legacy reset or need logic to estimate?
    // Assume 0 or current price if strictly tracking profit from NOW. 
    // Let's migrate to object on first buy.
  }

  if (!currentEntry) {
    store.cryptoPortfolio[coinId] = { amount: coinAmount, avgPrice: coin.price };
  } else {
    // Weighted Average Price
    const totalCost = (currentEntry.amount * currentEntry.avgPrice) + amountCR;
    const totalAmount = currentEntry.amount + coinAmount;
    store.cryptoPortfolio[coinId] = {
      amount: totalAmount,
      avgPrice: totalCost / totalAmount
    };
  }

  return true;
};

export const sellCoin = (coinId, amountCoin) => {
  const coin = marketState.coins.find(c => c.id === coinId);
  if (!coin) return false;

  let currentEntry = store.cryptoPortfolio[coinId];
  if (typeof currentEntry === 'number') {
    currentEntry = { amount: currentEntry, avgPrice: 0 }; // Legacy compat
  }

  if (!currentEntry || currentEntry.amount < amountCoin) return false;

  const returnCR = amountCoin * coin.price;

  currentEntry.amount -= amountCoin;
  // Avg Price doesn't change on sell (FIFO/LIFO doesn't matter for Avg)

  if (currentEntry.amount <= 0.000001) { // Floating point epsilon
    delete store.cryptoPortfolio[coinId];
  } else {
    store.cryptoPortfolio[coinId] = currentEntry;
  }
  gainBankroll(returnCR, TYPE_CHANGE_BANKROLL.CRYPTO_TRADE)
  return true;
};
