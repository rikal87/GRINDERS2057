---
id: SPEC-260724-matrix-log-stream-system
title: GRINDERS 2057 턴 집행 고속 매트릭스 텔레메트리 로그 스트림 연출 사양서
status: active
related_specs: ["SPEC-260723-turn-interception-system", "SPEC-260723-highlight-coaching-system"]
target_files: ["src/logic/timeSystem.js", "src/components/TerminalLobby.vue", "src/components/MatrixLogOverlay.vue"]
---

# 💻 [SPEC] 턴 집행 고속 매트릭스 텔레메트리 로그 스트림 연출 사양서

본 문서는 **GRINDERS 2057** 프로젝트의 턴 집행 시 출현하는 **"고속 매트릭스 텔레메트리 로그 스트림 (High-Speed Matrix Telemetry Log Stream)"** 시각 연출 및 인터셉트 일시정지 메커니즘의 정식 사양서입니다.

---

## 1. 연출 개요 및 목표 (Overview)

1. **해커 콘솔 메트릭스 스트림 연출 (High-Speed Log Stream)**:
   - 유저가 `[ ➔ PASS_DAY / EXECUTE_TURN ]` 버튼을 클릭하면 화면이 풀스크린 해커 콘솔로 전환된다.
   - 00:00 ~ 24:00 시뮬레이션 동안 10개 파견 섹터의 포커 딜링/배팅 로그가 0.03초 간격으로 초고속 롤링 스크롤된다.
2. **인터셉트 프리즈 (Interception Freeze)**:
   - $30,000 CR 이상 빅 팟 승부나 적발 위기 발생 시 고속 스크롤이 **`🚨 [WARNING] BIG_POT_ALERT` 로그에서 툭 멈추며(Freeze)** 긴급 인터셉트 개입 팝업으로 극적 이행한다.

---

## 2. 3단계 텔레메트리 연출 시나리오 (3-Stage Scenario)

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [Stage 1: 고속 텔레메트리 로그 스크롤 (0.03s Interval)]                 │
│  > [00:15] MAX @ VIP_CASINO -> DEALT [A♠, K♠] (FLOP: Q♠, J♠, 10♦)      │
│  > [00:42] ELENA @ CLUB_HOLDEM -> RAISE $8,000 | BOT_ZODIAC -> CALL     │
│  > [02:10] LEO @ DARK_ALLEY -> FOLD PREFLOP                            │
├────────────────────────────────────────────────────────────────────────┤
│ [Stage 2: 인터셉터 발생 시 툭 멈춤 (Freeze & Intercept)]               │
│  > [14:35] 🚨 [BIG_POT_ALERT] MAX @ VIP_CASINO -> POT $45,000 CR       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ [ 👁️ SPECTATE & INTERVENE ] (실시간 관전 진입)                 │  │
│  │ [ ⏩ FAST SIMULATE PASS ] (로그 스크롤 재개)                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────────┤
│ [Stage 3: 턴 마감 & 일일 결산 보고서 이행]                             │
│  > [24:00] SIMULATION_COMPLETE // 1,248 HANDS PROCESSED             │
│  - 스크롤 완결 후 DAILY_AGENCY_SETTLEMENT_REPORT 팝업 출력             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. UI/UX 거버넌스 규격

- **서체 및 배색**: `Orbitron 900` + `Pretendard Std 900`, 네온 옐로우(`--neon-yellow`), 네온 시안(`--neon-cyan`), 네온 마젠타(`--neon-magenta`).
- **인스턴트 스킵 (Skip Option)**: 화면 터치/클릭 시 2.5초 대기 없이 즉시 최종 결산 보고서로 이행.
