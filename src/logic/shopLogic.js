import { store, gainBankroll, TYPE_CHANGE_BANKROLL } from './store.js';
import { ITEM_DATA, materializeItem } from './items.js';

export const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export const getRefreshCost = () => {
  return 500 * (store.shop.manualRefreshCount + 1);
};

export const canManualRefresh = () => {
  return store.bankroll >= getRefreshCost();
};

// Higher tiers get weight penalty from refreshments
// Weighted Random Selection
const selectWeightedItem = (pool, manualRefreshCount) => {
  // Base chance for higher tiers increases with manual refresh
  // Cap bonus at 25 (refreshes * 5)
  // const bonus = Math.min(25, manualRefreshCount * 0.05);

  // Calculate weights
  const weightedPool = pool.map(item => {
    let weight = 100;
    const tierNum = parseInt(item.tier.replace('T', ''));

    if (tierNum >= 6) weight -= 25;
    if (tierNum >= 5) weight -= 20;
    if (tierNum >= 4) weight -= 15;
    if (tierNum >= 3) weight -= 10;
    if (tierNum >= 2) weight -= 5;

    return { item, weight };
  });

  const totalWeight = weightedPool.reduce((sum, entry) => sum + entry.weight, 0);
  let random = Math.random() * totalWeight;

  for (const entry of weightedPool) {
    random -= entry.weight;
    if (random <= 0) return entry.item;
  }

  return pool[0]; // Fallback
};

export const generateShopItems = (level) => {
  const maxTier = Math.min(6, Math.floor(level / 4)); // Cap at level 6 tier logic

  let shadyDealBonus = 0;
  if (store.equippedProtector) {
    shadyDealBonus = store.equippedProtector.effects.filter(effect => effect.id === 'loyalty_card').reduce((sum, effect) => sum + effect.value, 0);
  }
  // console.info('store.shadyDealBonus', shadyDealBonus)
  const count = 2 + (Math.round(Math.random() * shadyDealBonus)) // Fixed 5(max) slots for better UI layout

  // Tiers mapping
  const tierMap = {
    'T1': 1, 'T2': 2, 'T3': 3, 'T4': 4, 'T5': 5, 'T6': 6
  };

  // Filter items by tier and access key status
  const availableItems = ITEM_DATA.filter(item => {
    if (item.isAccessKey && store.unlockedLocations?.includes(item.id)) {
      return false;
    }
    return tierMap[item.tier] <= maxTier + 1; // Allow slightly higher tier potential
  });

  const selected = [];
  const pool = [...availableItems];
  const shadyDealRateBonus = Math.min(0.7, store.shop.manualRefreshCount * 0.005);
  for (let i = 0; i < count && pool.length > 0; i++) {
    const pickedItem = selectWeightedItem(pool, store.shop.manualRefreshCount);

    // Remove picked to avoid duplicates in same batch
    const index = pool.findIndex(p => p.id === pickedItem.id);
    if (index > -1) pool.splice(index, 1);

    const itemInstance = materializeItem(pickedItem);

    // 3rd after shady deal slot has a chance for "Special Offer"
    if (Math.random() < (shadyDealRateBonus)) {
      itemInstance.isSpecialOffer = true;
      itemInstance.discount = 10 + Math.floor(Math.random() * 41); // 10-50% discount
      itemInstance.originalPrice = itemInstance.price;
      itemInstance.price = Math.floor(itemInstance.price * (1 - itemInstance.discount / 100));
      itemInstance.specialLabel = "SHADY_DEAL";
    }

    selected.push(itemInstance);
  }

  return selected;
};

export const refreshShop = (isManual = false) => {
  if (isManual) {
    const cost = getRefreshCost();
    if (store.bankroll < cost) return false;
    gainBankroll(-cost, TYPE_CHANGE_BANKROLL.OTHER)
    store.shop.manualRefreshCount++;
  } else {
    store.shop.manualRefreshCount = Math.max(0, store.shop.manualRefreshCount - 1);
  }

  store.shop.items = generateShopItems(store.level);
  store.shop.lastRefreshTime = Date.now();
  return true;
};

export const checkAutoRefresh = () => {
  const now = Date.now();
  if (now - store.shop.lastRefreshTime >= REFRESH_INTERVAL_MS) {
    refreshShop(false);
  }
};
