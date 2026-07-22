# 에이전트 모듈 시스템 흡수통일 (items.js ➔ aiAgentTaskData.js) 구현 계획서

## 1. 개요 및 목표
기존 1개만 장착 가능하고 정적이던 `items.js` / `itemsEffect.js` 아이템 시스템을 `aiAgentTaskData.js` 중심의 **다중 슬롯 에이전트 모듈(Agent Module) 덱 빌딩 시스템**으로 흡수 통합합니다.

---

## 2. 세부 변경 사항 (Proposed Changes)

### [Component 1] 에이전트 데이터 통합 (`src/logic/aiAgentTaskData.js`)
- `items.js`에만 독립적으로 존재하던 기존 아이템들을 `AI_TASK_DATA` 스펙(`id`, `tier`, `name`, `desc`, `type`, `effect`)으로 마이그레이션 등록.
- 소비성 및 패시브 아이템 효과의 `TASK_EFFECT_TYPE` 상수 확장.

### [Component 2] 아이템 런타임 및 상점 바인딩 (`src/logic/shopLogic.js` & `src/logic/items.js`)
- 암시장 상점(`shopLogic.js`)에서 `AI_TASK_DATA`의 통합 모듈 상품들을 온전히 불러와 판매/새로고침하도록 데이터 쿼리 경로 정리.
- `items.js` 및 `itemsEffect.js`의 legacy 단일 장착 로직을 통합 모듈 구조와 호환되게 연결.

### [Component 3] 검증 및 문서화 (`docs/`)
- 통합 완료 후 아키텍처 문서 미러링 및 `npm run build` 검증.

---

## 3. 검증 계획 (Verification Plan)
- **자동 빌드 검증**: `npm run build` 0-Error 통과 확인.
- **수동 기능 검증**: 암시장(`Shop.vue`) 진입 시 모듈 상품 정상 노출 확인 및 에이전트 태스크 슬롯(`AgentTaskPopup.vue`) 장착 가능 여부 점검.
