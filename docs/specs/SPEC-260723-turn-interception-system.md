---
id: SPEC-260723-turn-interception-system
title: GRINDERS 2057 턴제 인터셉트 시뮬레이션 및 빅 팟 개입 시스템 사양서
status: active
related_specs: ["SPEC-260723-roster-stat-system", "SPEC-260723-traits-career-system"]
target_files: ["src/logic/timeSystem.js", "src/logic/partnerSystem.js", "src/components/TerminalLobby.vue"]
---

# 🎯 [SPEC] 턴제 인터셉트 시뮬레이션 & 빅 팟 개입 시스템 사양서

본 문서는 **GRINDERS 2057** 프로젝트의 코어 루프를 기존의 실시간 시스템에서 **"턴제 일일 결산 + 긴급 인터셉트 개입 시스템 (Turn-based Daily Loop with Interception Interrupt)"**으로 전면 개편하기 위한 정식 기술/게임 디자인 사양서입니다.

---

## 1. 개요 및 설계 목적 (Overview)

1. **턴제 경영 심뮬레이션(Turn-based Management) 도입**:
   - 플레이어가 매 턴(1 Turn = 1 Day) 선수를 배치하고 경영 명령을 내린 후 `[ ➔ PASS DAY / EXECUTE TURN ]` 버튼을 눌러 하루 동안의 카지노 파견 결과를 집행한다.
2. **긴급 개입 인터셉터 (Interception Interrupt Engine)**:
   - 턴 진행 시뮬레이션(00:00 ~ 24:00) 도중, **$30,000 이상의 빅 팟(Big Pot) 올인 승부**나 **카지노 보안팀의 블랙리스트 수사(Security Bust)**와 같은 대형 이벤트가 발생하면 시뮬레이션이 일시 정지(Pause)되고 유저에게 개입 팝업이 전송된다.

---

## 2. 턴 execution 및 인터셉트 3단계 메커니즘 (3-Phase Loop)

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [Phase 1: 준비 및 턴 명령 단계 (Preparation Phase)]                      │
│  - 선수 파견 구역 지정, 스태미너 수혈, 모듈 장착, 딜러 뇌물 송금     │
│  - [ ➔ PASS DAY / EXECUTE TURN ] 클릭 시 턴 시뮬레이션 시작             │
├────────────────────────────────────────────────────────────────────────┤
│ [Phase 2: 턴 시뮬레이션 및 인터셉트 발생 (Simulation & Interception)]  │
│  - 00:00 ~ 24:00 텔레메트리 프로그레스 진행                           │
│  - 조건 충족 시 시뮬레이션 멈춤 및 긴급 팝업 출력:                      │
│    - [ 👁️ SPECTATE & INTERVENE ] (실시간 포커 핸드 관전 & 모듈 개입)   │
│    - [ ⏩ FAST SIMULATE PASS ] (결과만 즉시 자동 진행)                 │
├────────────────────────────────────────────────────────────────────────┤
│ [Phase 3: 일일 최종 PnL 결산 리포트 (Daily Settlement Report)]         │
│  - 하루 총 수익/손실 PnL, 체력/틸트 변화, 사채 빚 청산 보고서 출력     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. 인터셉터 발생 조건 및 개입 옵션 (Interception Conditions)

### 3.1 3대 인터셉트 트리거 조건 (Interception Triggers)
1. **[🚨 BIG_POT_ALERT]**: 파견 선수의 올인 승부 판 돈이 **$30,000 CR 이상**일 때 발생.
2. **[🚨 SECURITY_BUST_WARNING]**: 파견 카지노의 보안 레벨이 상승하여 선수가 **블랙리스트 적발 위기**에 직면했을 때 발생.
3. **[🚨 DEBT_COLLECTOR_AMBUSH]**: 선수의 메이크업 빚(Makeup Debt)으로 인해 사채업자 브로커가 카지노에 급습했을 때 발생.

### 3.2 유저 개입 모드 선택지 (Intervention Modes)
- **옵션 A: `[ 👁️ SPECTATE & INTERVENE ]` (관전 및 개입)**
  - 해당 카지노의 실시간 포커 테이블 핸드로 전환.
  - 에이전트 모듈 스킬(예: `BLUFF_DETECTOR`, `SUSPICION_OVERLAY`)을 발동하거나 **기권(Fold) 수건 던지기**로 손실 최소화.
- **옵션 B: `[ ⏩ FAST SIMULATE PASS ]` (자동 패스)**
  - 유저 개입 없이 선수의 OVR 및 4D 스탯(Skill, Guts, Mental) 확률에 따라 시뮬레이션을 즉시 완결.

---

## 4. 관련 코드 모듈 연동 명세 (`timeSystem.js` & `partnerSystem.js`)

- [`src/logic/timeSystem.js`](file:///d:/github-repository/CyberPoker2077/src/logic/timeSystem.js): `advanceTurnDay()` 및 `processInterceptionEvents()` 메서드 구축.
- [`src/logic/partnerSystem.js`](file:///d:/github-repository/CyberPoker2077/src/logic/partnerSystem.js): 턴 집행 후 선수별 `sessionNetWorth`, `bankroll`, `mentalRating` 일괄 업데이트.
- [`src/components/TerminalLobby.vue`](file:///d:/github-repository/CyberPoker2077/src/components/TerminalLobby.vue): 메인 로비에 `[ ➔ PASS DAY / EXECUTE TURN ]` 사선 렌즈 메인 액션 버튼 장착.
