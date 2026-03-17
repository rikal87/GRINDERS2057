import { store, gainBankroll, getUnlockAchievements } from './store.js';
import { ITEM_DATA, relinkItem } from './items.js';
import { TYPE_CHANGE_BANKROLL } from "./constants.js";
import { isItemUnlocked } from './achievementManager.js';
export const REFRESH_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12 hours in game time

export const getRefreshCost = () => {
  return 500 * (store.shop.manualRefreshCount + 1);
};

export const canManualRefresh = () => {
  return store.bankroll >= getRefreshCost();
};

// Higher tiers get weight penalty from refreshments
// Weighted Random Selection
const selectWeightedItem = (pool, manualRefreshCount) => {
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

export const generateShopItems = () => {
  let shadyDealBonus = 0;
  if (store.equippedItem) {
    shadyDealBonus = store.equippedItem.effects.filter(effect => effect.id === 'loyalty_card').reduce((sum, effect) => sum + effect.value, 0);
  }
  const count = 2 + (Math.round(Math.random() * shadyDealBonus))

  // Get current unlocked achievements for lock checking
  const unlockedAchievements = getUnlockAchievements();

  // Filter items by tier, access key status, and achievement lock status
  const availableItems = ITEM_DATA.filter(item => {
    if (item.isAccessKey && store.unlockedLocations?.includes(item.id)) {
      return false;
    }
    if (!isItemUnlocked(item, unlockedAchievements)) {
      return false; // Item requires an achievement not yet earned
    }
    return true;
  });

  const selected = [];
  const pool = [...availableItems];
  const shadyDealRateBonus = Math.min(0.7, store.shop.manualRefreshCount * 0.005);
  for (let i = 0; i < count && pool.length > 0; i++) {
    const pickedItem = selectWeightedItem(pool, store.shop.manualRefreshCount);

    // Remove picked to avoid duplicates in same batch
    const index = pool.findIndex(p => p.id === pickedItem.id);
    if (index > -1) pool.splice(index, 1);

    const itemInstance = relinkItem(pickedItem);

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
    gainBankroll(-cost, TYPE_CHANGE_BANKROLL.BRIBE_DEALER)
    store.shop.manualRefreshCount++;
  } else {
    store.shop.manualRefreshCount = Math.max(0, store.shop.manualRefreshCount - 1);
  }

  store.shop.items = generateShopItems();
  store.shop.lastRefreshTime = store.gameTime;
  return true;
};

export const checkAutoRefresh = () => {
  const now = store.gameTime;
  if (now - store.shop.lastRefreshTime >= REFRESH_INTERVAL_MS) {
    refreshShop(false);
  }
};
