# Shark GTO AI - 패배 원인 진단 리포트

## 시뮬레이션 요약 데이터

| 항목 | Max | Gangster | Shark(GTO) |
|---|---|---|---|
| 수익 | **+4,767** ✅ | +835 ✅ | **-8,087** ❌ |
| VPIP | 20.7 | 20.0 | 16.8 |
| 3-Bet% | 3.4 | **5.7** | **2.7** ← 최저 |
| W$SD | 48.8 | 38.5 | **62.7** ← 최고 |
| WTSD | 21.6 | 25.0 | **27.5** ← 최고 |
| 파산 횟수 | 0 | 5 | 3 |

> W$SD가 62.7%로 압도적으로 높은데 칩이 -8087. 쇼다운에서 이기는데 돈을 잃고 있음 = **칩이 쇼다운 전에 이미 새고 있다는 증거.**

---

## 1. 버그 #1: Pot-Intensity 에쿼티 할인 없음 (aiEngine.js)

### 증상
[aiEngine.js](file:///d:/github-repository/CyberPoker2077/src/logic/aiEngine.js)의 포스트플랍 에쿼티 맵:
```js
if (handCategory === 'GOOD') estimatedEquity = 0.55;
```
이 값은 **SRP, 3-Bet팟, 4-Bet팟 모두 동일**하게 적용됨.

### 왜 문제인가?
- SRP (단순 오픈-콜)에서 `GOOD` 핸드 (예: TPMK)의 실제 에쿼티 ≈ 50~55% → 정상
- **4-Bet팟**에서 상대 레인지는 훨씬 타이트 (QQ+, AK+). 이 상황에서 TPMK = 실제 에쿼티 **30~35%**
- Shark는 4-Bet팟에서도 55% 에쿼티를 믿고 "Call Odds"를 내뱉으며 칩을 헌납함

### 코드 위치 ([aiEngine.js](file:///d:/github-repository/CyberPoker2077/src/logic/aiEngine.js), L.352)
```js
// [현재] 포스트플랍 intensity 페널티 없음
let basePenalty = (pfIntensity * 0.05) + (raises * 0.10);
requiredEquityPenalty = Math.min(0.35, basePenalty);
// -> pfIntensity는 required_equity에만 반영, estimatedEquity에는 무영향
```

### 픽스 방향
- 4-Bet팟(pfIntensity >= 3)에서 GOOD/MARGINAL 핸드 estimatedEquity를 **-15~20%** 할인
- NUTS/MONSTER는 예외

---

## 2. 버그 #2: SPR 슈브가 핸드 강도를 무시함 (aiBrainPostflop.js)

### 증상 (Hand #522 예시)
```
Board: [9d, Ac, Th, Js, Jh]
Shark1 Hand: Kc, Ad (TPTK - Two Pair)
상대: Max1 (Ts, Tc) = Full House
[TURN] Shark1: Raises to 1570 - <SPR Committal Shove (SPR:0.02)>
→ 졌음
```

### 왜 문제인가?
```js
// aiBrainPostflop.js, L.212-224
if (!isCheckable && finalEquity >= potOdds) {
  const sprAfterAction = stackAfterAction / (potSize + callAmount);
  if (sprAfterAction < 0.2) {
    return { action: 'raise', amount: player.chips, insight: 'SPR Committal Shove' };
  }
}
```
- `finalEquity >= potOdds` 조건만 만족하면 **핸드 카테고리 무시**하고 올인
- `GOOD` (Two Pair)으로 상대의 버밍 레이즈에 올인 → 상대가 FH인 경우 죽음
- **픽스**: SPR 슈브는 `MONSTER` 이상일 때만 발동

---

## 3. 버그 #3: 3-Bet 오버레이 포지션 무시 (aiBrainPreflop.js)

### 증상
```js
// L.128-131 (현재)
if (handRank <= 20) {
  return { action: 'raise', amount: currentBet * 3.5, insight: 'Premium 3-Bet Overlay...' };
}
```

### 왜 문제인가?
- Rank 20 = `QTs` (강하긴 하지만 오프포지션에서 3-Bet은 낭비)
- 이 코드가 **포지션(EP/BB/SB)에 무관하게** 무조건 3-Bet 발동
- OOP에서 AJs로 3-Bet → 콜 받으면 최악의 상황
- 실제로 3-Bet%가 2.7%밖에 안 나오는 이유: 상대방들이 4-Bet으로 반격하면 레인지 어드밴티지가 없어 접기 때문

### 픽스 방향
- Rank <= 13 이하: 포지션 무관하게 3-Bet (AA-JJ, AKs, AKo 등)
- Rank 14~25: 레이트 포지션 (BTN/CO)에서만 3-Bet
- Rank > 25: 3-Bet 없음 (기존 매트릭스 활용)

---

## 4. 버그 #4: 슈팟 콜 (5-Bet 팟) 레인지 너무 넓음 (aiBrainPreflop.js)

### 증상 (big_pots_hh.txt Hand #62 유사 패턴)
```
Shark TT → 상대 5-Bet 콜 → 상대 QQ → 패배
```

### 코드 위치 ([aiBrainPreflop.js](file:///d:/github-repository/CyberPoker2077/src/logic/aiEngine/strategies/aiBrainPreflop.js), L.89-111)
```js
const callThreshold = 12 + (villain.isManiac ? 8 : 0) + sprAdjustment;
if (contextStrategies.CALL.has(hand) || handRank <= callThreshold) {
  return { action: 'call', insight: `GTO call ${engine.currentStreetRaises}-Bet` };
}
```
- `callThreshold = 12`: Rank 12 = `A9s` → TT (Rank 10)도 5-Bet 콜
- 휴리스틱 AI는 5-Bet 시 거의 QQ+ 이기 때문에 TT은 패배 확률 높음

### 픽스 방향
- 5-Bet+(currrentStreetRaises >= 4) 콜 기준: **Rank <= 5** (AA, KK, QQ, AKs)로 축소

---

## 요약: 우선순위별 픽스 리스트

| 우선순위 | 버그 | 파일 | 예상 효과 |
|---|---|---|---|
| 🔴 P1 | SPR 슈브 핸드 강도 체크 | [aiBrainPostflop.js](file:///d:/github-repository/CyberPoker2077/src/logic/aiEngine/strategies/aiBrainPostflop.js) | 파산 3→0 |
| 🔴 P1 | 5-Bet 콜 레인지 축소 | [aiBrainPreflop.js](file:///d:/github-repository/CyberPoker2077/src/logic/aiEngine/strategies/aiBrainPreflop.js) | 칩 누수 방지 |
| 🟠 P2 | Pot-Intensity 에쿼티 할인 | [aiEngine.js](file:///d:/github-repository/CyberPoker2077/src/logic/aiEngine.js) | WTSD 질 개선 |
| 🟠 P2 | 3-Bet 오버레이 포지션 필터 | [aiBrainPreflop.js](file:///d:/github-repository/CyberPoker2077/src/logic/aiEngine/strategies/aiBrainPreflop.js) | 3-Bet% 의미있게 상승 |
