# Walkthrough - Achievement System & Item Lock/Unlock

## What Was Built

### 1. Core Logic — [achievementManager.js](file:///d:/github-repository/CyberPoker2077/src/logic/achievementManager.js)

- **[checkCompleteAchievement()](file:///d:/github-repository/CyberPoker2077/src/logic/achievementManager.js#756-768)**: Reads the current session stats, compares them against `UNLOCK_RULES`, and records any newly completed achievements via [addUnlockAchievement()](file:///d:/github-repository/CyberPoker2077/src/logic/store.js#121-124). Called when the session report opens.

- **[isItemUnlocked(item, unlockedAchievementIds)](file:///d:/github-repository/CyberPoker2077/src/logic/achievementManager.js#787-834)**: Pure function that determines whether an item is accessible. It counts how many times each "guarded" effect appears in the item's effects array and checks if the player has achieved a rule that permits that many instances.
  - Items with no guarded effects → always unlocked.
  - Items with more guarded effects than the player's highest rule allows → locked.

- **[createPlayRecordStats()](file:///d:/github-repository/CyberPoker2077/src/logic/playRecordStats.js#93-100)**: `PLAY_RECORD_STATS_TYPE` enum의 모든 값을 자동으로 순회하여 `0`으로 초기화된 객체를 생성합니다. `BigInt`, `float`, `Object` 등 특수 타입만 `STAT_OVERRIDES` 상수를 통해 제외(override) 처리합니다. 이제 새로운 스탯을 추가하려면 enum에만 등록하면 됩니다.

- **Shop.vue Error Fix**: `window` 오브젝트가 템플릿 내에서 접근 불가능한 문제를 해결하기 위해 [openCatalog](file:///d:/github-repository/CyberPoker2077/src/components/Shop.vue#114-117) 함수를 `script setup`으로 이동하여 전역 이벤트를 안전하게 발생시키도록 수정했습니다.
- **Achievement ID Renames**: 사용자가 [achievementManager.js](file:///d:/github-repository/CyberPoker2077/src/logic/achievementManager.js)에서 ID를 `BUST_1`, `THRITY_1` 등으로 변경한 사항이 시스템 전체 로직에 동적으로 반영됨을 확인했습니다.
- **Hand Win Recording**: [gameEngineEventAdaptor.js](file:///d:/github-repository/CyberPoker2077/src/logic/gameEngineEventAdaptor.js)에 `HAND_RANK_TO_STAT` 매핑을 추가하여, 포커 대결(Showdown) 승리 시 특정 족보(원 페어, 플러시 등)로 승리한 횟수를 자동으로 기록하도록 구현했습니다.
- **Hand Suit Tracking**: [gameEngine.js](file:///d:/github-repository/CyberPoker2077/src/logic/gameEngine.js)에서 각 라운드 시작 시 플레이어가 받은 핸드의 문양(Suit)을 추출하여 기록하는 로직을 추가했습니다. 이 과정에서 발생한 `isME` 오타를 `isMe`로 수정하고, 매핑 오브젝트를 사용하여 로직을 최적화했습니다.
- **Sequential Unlocked Items Animation**: [PlayStatsPopup.vue](file:///d:/github-repository/CyberPoker2077/src/components/PlayStatsPopup.vue)에서 새로운 아이템이 해금될 때, 모든 아이템이 한꺼번에 나타나지 않고 `TransitionGroup`과 `setTimeout`을 사용하여 일정 간격으로 하나씩 순차적으로 나타나는("차자작") 연출을 추가했습니다.
- **Cyber City Lobby High-Detail Overhaul**: 로비 캔버스 렌더러를 **면(Face) 채우기** 및 **정교한 3D 투영** 방식으로 재구축했습니다. 계단식(Tiered), 피라미드형(Tapered), 첨탑형(Spire) 건물을 도입하고 층별 가이드라인과 PCB 스타일 바닥을 추가하여 시각적 완성도를 극대화했습니다.
- **Tooltip Clipping Fix**: [PlayStatsPopup.vue](file:///d:/github-repository/CyberPoker2077/src/components/PlayStatsPopup.vue)의 해금 아이템 그리드에서 툴팁이 왼쪽으로 짤리는 문제를 해결했습니다. 툴팁 정렬 방식을 중앙에서 왼쪽으로 조정하고, 상위 컨테이너의 `overflow-x` 제한을 완화하여 모든 해금 아이템의 이름을 온전하게 확인할 수 있도록 개선했습니다.

### 2. [store.js](file:///d:/github-repository/CyberPoker2077/src/logic/store.js)
- [addUnlockAchievement](file:///d:/github-repository/CyberPoker2077/src/logic/store.js#121-124) / [getUnlockAchievements](file:///d:/github-repository/CyberPoker2077/src/logic/store.js#115-118) were already present (duplicate declarations removed).
- [getPlayStatsSession(type)](file:///d:/github-repository/CyberPoker2077/src/logic/store.js#417-420) fixed to use optional chaining (`?.`) to avoid crashes when `play_stats_session` is null.

### 3. Shop Logic — [shopLogic.js](file:///d:/github-repository/CyberPoker2077/src/logic/shopLogic.js)
- [generateShopItems()](file:///d:/github-repository/CyberPoker2077/src/logic/shopLogic.js#42-96) now filters `ITEM_DATA` through [isItemUnlocked(item, getUnlockAchievements())](file:///d:/github-repository/CyberPoker2077/src/logic/achievementManager.js#787-834) before building the shop pool.
- Locked items never appear in the shop.

### 4. Session Report — [PlayStatsPopup.vue](file:///d:/github-repository/CyberPoker2077/src/components/PlayStatsPopup.vue)
- On [show](file:///d:/github-repository/CyberPoker2077/src/logic/gameEngineEventAdaptor.js#149-177), captures the previous unlock state, runs [checkCompleteAchievement()](file:///d:/github-repository/CyberPoker2077/src/logic/achievementManager.js#756-768), then calls [checkUnlockItem(previous)](file:///d:/github-repository/CyberPoker2077/src/logic/achievementManager.js#769-786).
- A new **NEWLY_UNLOCKED_ITEMS** section slides in at 3.5s showing up to 5 item cards (icon + name in gold).
- If more than 5 items are unlocked, shows "외 X개의 새로운 아이템이 해방됨" text.

### 5. Item Catalog — [ItemCatalogPopup.vue](file:///d:/github-repository/CyberPoker2077/src/components/ItemCatalogPopup.vue) (new file)
- Grouped by tier (T1–T6), each tier shows a grid of 50×50 item cards.
- **Unlocked items**: Show full icon; hover tooltip shows name + description.
- **Locked items**: Show `?` icon; hover tooltip shows the required achievement and effect count.
- Opened via a new **📋 ITEM_CATALOG** button in the shop's left panel.

## Files Changed

| File | Change |
|---|---|
| [achievementManager.js](file:///d:/github-repository/CyberPoker2077/src/logic/achievementManager.js) | Full rewrite with [checkCompleteAchievement](file:///d:/github-repository/CyberPoker2077/src/logic/achievementManager.js#756-768), [checkUnlockItem](file:///d:/github-repository/CyberPoker2077/src/logic/achievementManager.js#769-786), [isItemUnlocked](file:///d:/github-repository/CyberPoker2077/src/logic/achievementManager.js#787-834) |
| [store.js](file:///d:/github-repository/CyberPoker2077/src/logic/store.js) | Removed duplicate declarations, fixed null-safe [getPlayStatsSession](file:///d:/github-repository/CyberPoker2077/src/logic/store.js#417-420) |
| [shopLogic.js](file:///d:/github-repository/CyberPoker2077/src/logic/shopLogic.js) | Added [isItemUnlocked](file:///d:/github-repository/CyberPoker2077/src/logic/achievementManager.js#787-834) filter to [generateShopItems](file:///d:/github-repository/CyberPoker2077/src/logic/shopLogic.js#42-96) |
| [PlayStatsPopup.vue](file:///d:/github-repository/CyberPoker2077/src/components/PlayStatsPopup.vue) | Added unlock section UI + achievement check on show |
| [ItemCatalogPopup.vue](file:///d:/github-repository/CyberPoker2077/src/components/ItemCatalogPopup.vue) | **New** — Full catalog popup with lock/unlock state |
| [Shop.vue](file:///d:/github-repository/CyberPoker2077/src/components/Shop.vue) | Added catalog button + `ItemCatalogPopup` integration |
