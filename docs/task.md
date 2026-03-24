# Task: Achievement System & Item Lock/Unlock

## 1. Core Logic
- [/] Fix [store.js](file:///d:/github-repository/CyberPoker2077/src/logic/store.js): add [addUnlockAchievement](file:///d:/github-repository/CyberPoker2077/src/logic/store.js#121-124) and [getUnlockAchievements](file:///d:/github-repository/CyberPoker2077/src/logic/store.js#115-118) functions
- [ ] Fix [achievementManager.js](file:///d:/github-repository/CyberPoker2077/src/logic/achievementManager.js): fix [getPlayStatsSession](file:///d:/github-repository/CyberPoker2077/src/logic/store.js#417-420) import bug
- [ ] Implement [checkUnlockItem()](file:///d:/github-repository/CyberPoker2077/src/logic/achievementManager.js#769-786) logic
- [ ] Implement [isItemUnlocked()](file:///d:/github-repository/CyberPoker2077/src/logic/achievementManager.js#787-834) in [items.js](file:///d:/github-repository/CyberPoker2077/src/logic/items.js)

## 2. Shop Logic
- [ ] Filter locked items in [shopLogic.js](file:///d:/github-repository/CyberPoker2077/src/logic/shopLogic.js) [generateShopItems()](file:///d:/github-repository/CyberPoker2077/src/logic/shopLogic.js#42-96)

## 3. Session Report UI
- [ ] Implement `UNLOCK NEW ITEM LAYOUT` in [PlayStatsPopup.vue](file:///d:/github-repository/CyberPoker2077/src/components/PlayStatsPopup.vue)
- [ ] Call [checkCompleteAchievement()](file:///d:/github-repository/CyberPoker2077/src/logic/achievementManager.js#756-768) and [checkUnlockItem()](file:///d:/github-repository/CyberPoker2077/src/logic/achievementManager.js#769-786) on session report open

## 4. Shop Catalog Popup
- [ ] Create [ItemCatalogPopup.vue](file:///d:/github-repository/CyberPoker2077/src/components/ItemCatalogPopup.vue) with tier-based grid layout
- [ ] Add locked/unlocked item display with tooltips
- [ ] Add catalog button to [Shop.vue](file:///d:/github-repository/CyberPoker2077/src/components/Shop.vue)

## 5. Verification
- [x] Refactor [playRecordStats.js](file:///d:/github-repository/CyberPoker2077/src/logic/playRecordStats.js) to unify keys and simplify switch
- [x] Refactor [createPlayRecordStats](file:///d:/github-repository/CyberPoker2077/src/logic/playRecordStats.js#93-100) to auto-generate from enum
- [ ] Verify session report shows newly unlocked items
- [ ] Move `ItemCatalogPopup` to [App.vue](file:///d:/github-repository/CyberPoker2077/src/App.vue)
    - [ ] Add global event listener in [App.vue](file:///d:/github-repository/CyberPoker2077/src/App.vue)
    - [ ] Trigger from [Shop.vue](file:///d:/github-repository/CyberPoker2077/src/components/Shop.vue) via custom event
- [ ] Restore effect merging logic in [relinkItem](file:///d:/github-repository/CyberPoker2077/src/logic/items.js#1603-1715)
- [x] Implement local stats for winning with specific hands (One Pair, etc.) in [gameEngineEventAdaptor.js](file:///d:/github-repository/CyberPoker2077/src/logic/gameEngineEventAdaptor.js)
- [x] Redesign [Lobby.vue](file:///d:/github-repository/CyberPoker2077/src/components/Lobby.vue) with Canvas-based isometric Cyber City
    - [x] Design Canvas city generator logic
    - [x] Update [Lobby.vue](file:///d:/github-repository/CyberPoker2077/src/components/Lobby.vue) template and styles
    - [x] Add visual polish and animations
    - [x] Enhance building complexity (Shapes, Tiers, Spires)
- [x] Fix tooltip clipping in [PlayStatsPopup.vue](file:///d:/github-repository/CyberPoker2077/src/components/PlayStatsPopup.vue)
- [x] Create walkthrough
