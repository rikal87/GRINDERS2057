---
id: SPEC-260723-highlight-coaching-system
title: GRINDERS 2057 선수별 일일 Top 3 클린 하이라이트 및 실시간 전략 코칭 시스템 사양서
status: active
related_specs: ["SPEC-260723-turn-interception-system", "SPEC-260723-roster-stat-system"]
target_files: ["src/logic/timeSystem.js", "src/logic/partnerSystem.js", "src/components/PartnerNetPage.vue", "src/components/TerminalLobby.vue"]
---

# 🎬 [SPEC] 선수별 일일 Top 3 클린 하이라이트 & 전략 코칭 시스템 사양서

본 문서는 **GRINDERS 2057** 프로젝트의 턴제 인터셉트 엔진과 완벽히 동기화되는 **"선수별 일일 Top 3 클린 하이라이트 스트림 (Clean Highlight Stream)"** 및 **"실시간 전략 코칭 개입 (Strategic Coaching Intervention)"** 시스템의 정식 사양서입니다.

---

## 1. 개요 및 설계 목적 (Overview)

1. **클린 하이라이트 필터링 (Clean Highlight Filtering)**:
   - 유저가 긴급 인터셉트 팝업에서 이미 직접 실시간 개입/관전했던 핸드는 하이라이트 목록에서 100% 자동 제외(Filter Out)하여 중복 시청 피로감을 차단한다.
   - 하루(1 Day) 시뮬레이션 중 유저가 지나쳤던 대형 승리 핸드 중 **상위 3개(Top 3 High-Stakes Wins)**만 추출하여 선수별 쿼터로 제공한다.
2. **2대 유저 코칭 명령 (Strategic Coaching Actions)**:
   - 실시간 관전/개입 시 유저가 1-Click 코칭 명령 집행:
     - **`[ 🏳️ FORCE_FOLD ]`**: 불리한 판 즉시 기권 유도 (손실 최소화)
     - **`[ 🔥 FORCE_RAISE ]`**: 상대 블러핑 파악 시 강공 배팅 유도 (수익 극대화)
     - **`[ 🧩 USE_MODULE ]`**: 에이전트 모듈 스킬(카드 투시 등) 발동

---

## 2. 하이라이트 UI 배치 및 동선 명세 (UI Placement)

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [동선 1: PARTNERS_NET 소속 선수 카드 내부] (메인 관제 장소)            │
│  - 파트너 카드 펼침 ➔ [ 📺 TODAY_TOP_3_HIGHLIGHTS (3/3) ] ➔ 버튼 위치  │
│  - 클릭 시 해당 선수의 오늘자 3대 엑기스 명장면 하이라이트 릴레이 재생 │
├────────────────────────────────────────────────────────────────────────┤
│ [동선 2: 턴 마감 일일 결산 보고서 팝업 (DAILY_SETTLEMENT_REPORT)]       │
│  - 일일 결산 팝업 ➔ 오늘 수익 1위 MVP 선수 옆 [ 🎬 WATCH_MVP_REPLAY ]! │
│  - 클릭 시 오늘의 1위 공신 MVP 선수의 명장면 1-Click 감상             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. 데이터 구조 및 필터링 메커니즘 (`partnerSystem.js`)

- 선수 객체 내 `dailyTopHighlights` 배열 가공 (최대 3개 항목 한도):
  ```json
  {
    "handId": "hand_max_04",
    "potSize": 45000,
    "winAmount": 32000,
    "isUserObserved": false,
    "replayData": { "cards": [], "actions": [] }
  }
  ```
- `isUserObserved === true` 항목은 하이라이트 재생 목록에서 100% 자동 정제(Filter Out).
