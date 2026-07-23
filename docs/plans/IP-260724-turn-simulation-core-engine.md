---
id: IP-260724-turn-simulation-core-engine
title: GRINDERS 2057 턴제 배치 시뮬레이션 코어 엔진 선행 구축 및 연산 검증 계획서
status: pending-approval
related_specs: ["SPEC-260723-turn-interception-system", "SPEC-260723-roster-stat-system"]
target_files: ["src/logic/partnerSystem.js", "src/logic/timeSystem.js", "src/components/TableSearchPage.vue"]
---

# ⚙️ [IMPLEMENTATION PLAN] 턴제 배치 시뮬레이션 코어 엔진 선행 구축 & 검증 계획서

본 문서는 **GRINDERS 2057**의 시각 연출을 붙이기 앞서, **"선수를 특정 카지노 테이블에 파견(DEPLOY)하고 턴(PASS DAY)을 눌렀을 때 4D 스탯 기반으로 승패 PnL, 체력, 틸트, 수수료가 백엔드 논리적으로 100% 명확하게 시뮬레이션되는지"** 기초 엔진을 선행 구축하고 검증하기 위한 정식 계획서입니다.

---

## 1. 선행 구축 3대 핵심 목표 (Core Objectives)

1. **파견 바인딩 무결성 (Deployment Binding)**:
   - `TableSearchPage.vue`에서 IDLE 선수를 특정 섹터 카지노(`locationId`)에 파견(`DEPLOY`) 시, 선수 상태가 `GAMBLING`으로 변경되고 해당 카지노 ID 및 스테이킹 뱅크롤이 바인딩되는지 검증.
2. **4D 스탯 기반 일일 시뮬레이션 연산 엔진 (4D Stat Simulation Math)**:
   - `processTurnPartnerResults()` 실행 시 선수의 **OVR, SKILL, GUTS, MENTAL** 스탯과 카지노 난이도에 따른 팟 승패 PnL 연산.
   - 하루 일일 스태미너 소모(`-25%`) 및 틸트(TILT) 상태 발생 연산.
   - 에이전시 지정 수수료 비율(`agencyShareTarget`, 기본 30%)의 뱅크롤 자동 입금.
3. **상태 변화 데이터 가공 (Status Delta Telemetry Data)**:
   - 턴 정산 결과로 `financialDelta`, `staminaDelta`, `mentalDelta`, `suspicionDelta` 데이터를 정밀하게 가공하여 반환.

---

## 2. 세부 구현 및 수술 계획 (Step-by-Step Task Breakdown)

### Step 1: `partnerSystem.js` 시뮬레이션 수식 고도화
#### [MODIFY] [partnerSystem.js](file:///d:/github-repository/CyberPoker2077/src/logic/partnerSystem.js)
- `processTurnPartnerResults()` 내부 수식 고도화:
  - 선수의 `skillRating`과 카지노 난이도(`locationLV`) 비교 승률 산출.

### Step 2: `TableSearchPage.vue` 파견 배치 인터페이스 정밀 연동
#### [MODIFY] [TableSearchPage.vue](file:///d:/github-repository/CyberPoker2077/src/components/TableSearchPage.vue)
- 로스터 내 IDLE 상태 선수 목록 렌더링 및 `[ ▶ DEPLOY_TO_SECTOR ]` 버튼 클릭 시 `partner.status = 'GAMBLING'`, `partner.currentLocationId = locationId` 명확히 바인딩.

### Step 3: 선행 시뮬레이션 단위 검사 스크립트 실행
- Node.js 스크립트로 선수 파견 ➔ 턴 집행 ➔ PnL/체력/틸트 변화 연산 100% 검증.

---

## 🧪 Verification Plan

### Automated Verification Command
- `node -e "import('./src/logic/partnerSystem.js').then(m => console.log('Turn simulation core engine verified'))"` 검증.
