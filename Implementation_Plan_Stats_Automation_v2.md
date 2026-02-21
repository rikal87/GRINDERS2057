이 문서는 단순한 기록을 넘어, 플레이어의 행동 데이터를 AI Agent가 어떻게 **학습(Machine Learning)**하고 이를 프로토콜 해금으로 연결하는지에 대한 구체적인 메커니즘을 담고 있습니다.

# [Intelligence_Automation] AI Agent Statistics & Intelligence Automation

## Proposed Changes

### Logic Layer

#### [MODIFY] [store.js](file:///d:/github-repository/CyberPoker2077/src/logic/store.js)
- Extend `play_stats` with the full schema from `stats.js`.
- Implement BigInt-safe `localStorage` serialization (using `n` suffix or separate string storage).
- Update `initialState` to properly revive BigInt values during `JSON.parse`.

#### [MODIFY] [gameEngineEventAdaptor.js](file:///d:/github-repository/CyberPoker2077/src/logic/gameEngineEventAdaptor.js)
- Implement detailed tracking logic for each event:
  - `bet`, `fold`, `blindPay`, `call` (if exists), `raise`: Update action counts and PFR/VPIP related metrics.
  - `showdown`: Track `wtsd`, `w$sd`, `showdown_win`, `all_in_win`, and peak pots.
  - `playerEliminated`: Determine enemy persona and increment `bust_enemy` counter in `play_stats`.
  - `roundEnd`: Update `played_hands` and check for `max_bankroll` / `max_credit`.

#### [MODIFY] [aiTaskSystem.js](file:///d:/github-repository/CyberPoker2077/src/logic/aiTaskSystem.js)
- Implement `isTaskUnlocked(taskDef)` helper function.
- Integrate `unlock` status into `AI_TASK_DATA` processing.

### UI Layer

#### [MODIFY] [SafeHouse.vue](file:///d:/github-repository/CyberPoker2077/src/components/SafeHouse.vue)
- Update the task list to visually indicate locked tasks.
- Add "Requirement" tooltips or labels based on `taskDef.unlock`.

### [Intelligence_Automation] Play Stats Modal

#### [MODIFY] [SafeHouse.vue](file:///d:/github-repository/CyberPoker2077/src/components/SafeHouse.vue)
- Add `showStatsModal` reactive state.
- Implement the "PLAY_STATS_OVERVIEW" modal template.
- Categorize stats into "Behavioral", "Economic", and "Luck/Records".
- Add computed properties for Percentage metrics (VPIP, PFR, W$SD).

#### [MODIFY] [SafeHouse.css](file:///d:/github-repository/CyberPoker2077/src/styles/components/SafeHouse.css)
- Add styles for `.stats-modal`, `.stats-grid`, and `.stat-entry`.
- Implement a clean, high-contrast table look with neon accents.

## Verification Plan

### Manual Verification
- Open the Stats Modal via the button.
- Verify that metrics like VPIP/PFR are calculated correctly relative to `played_hands`.
- Ensure BigInt values (Total Earned) are displayed clearly.

## 1. Project Objective
플레이어의 포커 플레이 스타일과 경제 활동을 정밀하게 추적하고, 축적된 데이터를 통해 **황도 12궁 AI 모델**의 특수 기능(TASK)을 해금하거나 자동화된 시스템 피드백을 제공합니다.

## 2. Updated Statistics Schema
[stats.js](src/logic/stats.js) 참조
Data Persistence: 모든 stats는 store.js를 통해 영구 저장되며, timeSystem.js와 동기화되어 게임 일자별 통계를 생성합니다.
BigInt Handling: total_earn_money 등은 JSON 저장 시 문자열화(Stringify) 처리가 필요합니다.

## 3. HOW TO WORK?
우리는 이미 아래의 핵심 코어 로직을 구현한 상태입니다.
gameEngine.js (홀덤 게임 제어)
gameEngineEventAdaptor.js (홀덤 게임 이벤트 인터셉터 및 중간처리)
해당 기능을 활용하여 통계와 연동하십시오.
