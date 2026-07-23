# SPEC-20260724 — Decisive Moment 시스템 고도화 2대 과제

## 개요

Decisive Moment Injection 아키텍처(IP-260724) 구현 이후,  
체리피킹 플레이 방식이 매니지먼트 장르로서 경쟁력을 갖추기 위해  
반드시 후속 구현되어야 할 2대 핵심 과제를 기록한다.

**현재 상태 진단**: Phase 1은 고속 액션 재생에 불과하며, 개입 결과가 게임 레벨 파급효과로 연결되지 않아  
체리피킹이 "미니게임 팝업" 수준에 머무름. 아래 두 과제 없이는 반복 재미가 얕다.

---

## TASK-A: Phase 1 자동 리플레이를 서사 전달 도구로 격상

### 배경

유저가 결정적 순간(Phase 2)에 감정이 실리려면,  
그 빅팟이 "왜 형성됐는지"의 맥락을 Phase 1에서 체험해야 한다.  
현재 Phase 1은 빠르게 AI 액션이 흘러갈 뿐, 서사가 없다.

### 구현 목표

Phase 1 자동 리플레이 구간에 3개 레이어를 추가한다:

#### 1. 파트너 심리 독백 (Psychological Monologue)

- `phase1Stream`의 각 액션 시점에 파트너의 내면 독백 텍스트를 삽입
- 예시:
  ```
  [PREFLOP — RAISE $300]
  "Ks Qd... 프리미엄 핸드다. 이 판에서 밀리면 안 돼."

  [FLOP — K♥ 9♠ 3♦ — BET $600]
  "탑 페어. 상대가 콜한다. 뭔가 연결된 게 있을지도..."

  [TURN — 9♦ — CHECK]
  "보드가 페어됐다. 내 킹이 약해졌어. 트랩인가, 아니면..."
  ```
- 텍스트는 파트너의 `AF`, `WTSD`, `relationship` 스탯에 따라 어조가 달라짐
  - 공격형(AF 높음): 자신감 있는 독백
  - 수비형(WTSD 낮음): 불안, 계산적 독백

#### 2. 실시간 HUD 분석 오버레이

Phase 1 재생 중 화면 우측에 분석 패널 표시:

```
[ NEURAL_ANALYSIS // PHASE_1_REPLAY ]
────────────────────────────────────
POT BUILDUP TRAJECTORY
  PREFLOP:  $200 CR  (20 BB)
  FLOP:   $1,100 CR  (110 BB)  ▲ 위험 급증
  TURN:   $3,700 CR  (370 BB)  ⚠ DECISIVE_ZONE

HERO HAND STRENGTH
  PREFLOP: AA — TOP 0.5%
  FLOP:    SET (3 of a kind) — 강함
  TURN:    FULL HOUSE 가능성 vs FLUSH DRAW 위험

VILLAIN RANGE ESTIMATE
  UTG 3-BET + FLOP 레이즈 패턴
  → 추정: TT-KK, AK, 또는 Flush Draw
```

#### 3. 상황 설명 타이틀 카드

각 스트릿 전환 시 1.5초간 화면 중앙에 컨텍스트 카드 표시:

```
╔══════════════════════════════╗
║  TURN // 결정의 갈림길       ║
║  상대의 체크레이즈가         ║
║  Kate의 풀하우스를 위협한다  ║
╚══════════════════════════════╝
```

### 영향 파일 (예측)

- `src/components/PokerTable.vue` — Phase 1 HUD 오버레이 추가
- `src/logic/gameEngine.js` — `_checkPhase1Transition()` 시점에 독백 생성 트리거
- `src/logic/chatAI.js` (또는 신규) — 독백 텍스트 생성 로직

---

## TASK-B: 개입 결과의 파급 시스템 강화

### 배경

유저의 Phase 2 결정(직접 개입 또는 AI 위임)이 해당 핸드의 승패로만 끝나면,  
체리피킹은 반복 재미를 갖지 못한다. FC 매니지먼트에서 교체카드 한 장이  
시즌 전체 흐름에 영향을 미치듯, 유저의 개입 결정이 파트너의 생애 궤적에 영향을 주어야 한다.

### 파급 매트릭스

| 시나리오 | 개입 방식 | 결과 | 파급 효과 |
| :--- | :--- | :--- | :--- |
| 직접 개입 → 승리 | DIRECT_INTERVENE | 팟 획득 | 관계도 +15, 뱅크롤 부스트, `skillRating` +1 |
| 직접 개입 → 패배 | DIRECT_INTERVENE | 팟 손실 | 관계도 -10, 파트너 틸트 위험 (+tilt) |
| AI 위임 → AI 승리 | AI_DELEGATE | 팟 획득 | 관계도 변화 없음, 뱅크롤 정상 반영 |
| AI 위임 → AI 패배 | AI_DELEGATE | 팟 손실 | 관계도 -5 ("그때 직접 했어야 했는데") |
| 개입 기회 무시 (패스) | PASS | 자동 처리 | 관계도 -3 ("관심 없어 보였어") |

### 연쇄 파급 시나리오

```text
[경쟁력 있는 파급 서사 예시]

Week 3:
  Kate 빅팟 — 유저 직접 개입 → 승리
  → Kate 관계도 85 → 92 (임계치 90 돌파)
  → Kate 특수 이벤트 해금: "독점 파트너 계약 제안"
  → Kate 스탯 WTSD +3 (유저를 믿고 더 대범해짐)

Week 5:
  Kate 빅팟 — 유저 직접 개입 → 패배 (잘못된 콜)
  → Kate 관계도 92 → 79
  → Kate 대화: "...이번엔 믿었는데, 다음엔 혼자 할게요"
  → 다음 Decisive Moment에서 AI_DELEGATE가 기본값으로 변경됨
```

### 구현 목표

Phase 2 결과 확정 후(showdown 완료 시):

1. `resolveDecisiveMomentResult(engine, interveneType, won)` 함수 신설
2. 파트너의 `relationship`, `bankroll`, `skillRating`, `tilt` 스탯에 파급 적용
3. `partnerSystem.js`의 파트너 상태 업데이트 및 저장
4. 결과 화면에 파급 효과 요약 표시:
   ```
   [ DECISIVE_MOMENT_RESULT ]
   Kate — FULL HOUSE vs FLUSH DRAW
   결과: 승리 (+$3,700 CR)
   
   관계도: 79 → 92  (+13)
   스킬레이팅: 71 → 72  (+1)
   특수 효과: [TRUST_BOND_FORMED] 해금
   ```

### 영향 파일 (예측)

- `src/logic/partnerSystem.js` — `resolveDecisiveMomentResult()` 신설
- `src/logic/gameEngine.js` — showdown 완료 시점에 결과 훅 연결
- `src/components/App.vue` — 결과 오버레이 UI

---

## 우선순위

두 과제 모두 필수이나 순서는 아래와 같이 권장:

1. **TASK-B 먼저**: 파급 시스템 없이 TASK-A 서사를 아무리 풍부하게 만들어도 반복 플레이의 동기가 없음.
2. **TASK-A 후속**: 파급이 구축된 후 서사를 입히면 "이 결정이 Kate의 커리어를 바꾼다"는 감정적 무게가 살아남.

---

*문서 생성: 2026-07-24*  
*관련 계획서: IP-260724 (Decisive Moment Injection)*
