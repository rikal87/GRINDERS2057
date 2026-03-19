# AI Brain Orchestrator 리뷰 (2026-03-19)



## aiBrainHub.js, aiEngineAdvanced.js 그리고 aiEngine.js 의 용도 정의
aiEngineAdvanced.js 현재 aiBrainHub.js 이전 버전으로 개발이 끝나면 aiBrainHub.js로 대체할 예정.
aiEngine.js 휴리스틱 기반 초중반 NPC에 장착되어 사용되고 있는 엔진. 정교한 판단보단 빠르고 개성있는 판단을 하도록 설계됨.(재미위주)
aiBrainHub.js의 경우 추후 강력한 보스전이나 하이스테이크에서 사용될 엔진임으로 상용 포커 AI 수준의 정교한 판단을 하도록 설계됨.
현재 simulate_ai_match에서 사용되는 엔진은 aiBrainHub.js와 aiEngine.js임

Shark 는 aiBrainHub.js 사용함
나머지는 aiEngine.js 사용함
------------------------

## 1. WTSD (Went To Showdown) 지표 분석
현재 `simulation_result.json` 상의 WTSD 수치는 **27% ~ 32%** 수준으로, 일반적인 수익성 있는 AI의 타겟치(약 35% ~ 45%)에 비해 현저히 낮습니다. 이는 AI가 쇼다운까지 가지 못하고 폴드하거나, 혹은 쇼다운 전에 무리한 블러프로 칩을 소모하고 있음을 의미합니다.

### 주요 현상
- **Max의 높은 F(Flop) 폴드율 (20.8%)**: 플랍에서 너무 쉽게 포기하는 경향이 있음.
- **3-Bet/4-Bet 팟에서의 과도한 블러프**: 프리플랍 공격성은 좋으나, 포스트플랍에서 일관성 없는 거대 블러프 후 폴드(Hand #130, #102).
- **Budget Fold 현상**: 핸드 가치에 비해 투자 예산(Budget)이 너무 짜게 책정되어 있어, 상대의 베팅에 기계적으로 폴드함.

------------------------

## 2. 로직상의 문제점 및 원인 분석

### A. 예산 제한(Budget Tool)의 과도한 보수성
`aiBrainBudgetTool.js` 및 `aiEngineAdvanced.js`의 예산 책정 로직에 심각한 오류가 발견되었습니다.

```javascript
// aiBrainBudgetTool.js
if (equity >= 0.50) return potSize * 1.5; // Coinflip+: willing to put in full pot+
if (equity >= 0.35) return potSize * 0.8; // Marginal: 80% of pot only
```

- **문제**: 35%의 에퀴티(Marginal)를 가진 핸드가 팟 사이즈의 80%까지만 투자할 수 있게 설정되어 있습니다. 
- **결과**: 상대가 팟 사이즈 베팅을 할 경우, 수학적으로는 콜(Pot Odds 33.3%)이 정답임에도 불구하고 예산 초과(Budget Over)로 인해 폴드하게 됩니다. 이는 WTSD를 낮추는 결정적인 요인입니다.
- **개선안**: Marginal 핸드의 예산을 최소 팟 사이즈 이상(1.2x ~ 1.5x)으로 상향 조정해야 합니다.
- **의견** : 이제 버짓은 에퀴티 기반으로 집행해주는 것이 어떨까함
원래 버짓툴의 경우,
도입 용도가 만약 내가 몬스터 핸드를 메이드한다면 팟을 더욱 키우기 위해 트랩성 플레이를 할때 일부러 체크하고 리버에 올인을 하거나 오버뱃을 할때 얼마나 팟을 키울지 결정하는 용도거나,
살짝 마지널한 핸드의 경우 3스트릿 모두 배팅하는걸 막는 용도였음
만약 그 의도되록 동작하지않고 단순히 내가 배팅할 한도로만 작동한다면 이점을 개선해야함

### B. "Pure Bluff"의 남발 및 범위 보호 부재

`src/logic/aiEngine.js` 및 `aiEngineAdvanced.js`의 레거시/폴백 로직에서 고강도 팟(3B/4B)에서의 블러프 빈도가 너무 높습니다.

- **사례 (Hand #130)**: Max가 `Tc Ah` (Ace High)로 3-Bet 팟 플랍에서 팟의 수 배에 달하는 470 레이즈를 감행(Pure Bluff). 이후 리버까지 아무런 액션을 취하지 못하고 체크-폴드하며 큰 팟을 상실.
- **문제**: 블러프 규모가 팟 대비 너무 크고, 상대의 레인지를 고려하지 않은 "올인성 블러프"가 3-Bet/4-Bet 팟에서 자주 발생합니다.
- **개선안**: 고강도 팟(3B/4B)에서는 `bluffFreq`를 현재보다 더 크게 감쇠시키거나, 세미 블러프(Draw 기반) 위주로만 허용해야 합니다.
- **의견**: 현재 Pure Bluff의 경우 오직 [aiEngine.js]에서만 사용되고있음. (다른 엔진에서는 미사용)

### C. 에퀴티 페널티의 중첩 (Aggression Penalty)
`aiBrainPostflop.js`에서 상대의 레이즈마다 에퀴티를 인위적으로 삭감합니다.

```javascript
let aggressionPenalty = (currentStreetRaises || 1) * 0.10; // 레이즈당 10% 감점
```

- **문제**: 이미 `getNutStatus`나 `getHandCategory`에서 보드 텍스처를 고려하고 있는데, 여기에 추가로 상대의 레이즈를 이유로 에퀴티를 10~20%씩 깎으면, 실제 승률이 높은 핸드조차 'WEAK' 등급으로 추락하여 폴드하게 됩니다.
- **개선안**: 페널티 비중을 낮추거나(5%), 프리미엄 핸드(MONSTER+)에 대해서는 이 페널티를 면제해야 합니다.
- **의견**: 좋은 의견으로 에퀴티를 삭감시켜 좋은 핸드를 폴드가 되어선 안되나, 무리한 콜 또한 자제하게 만들어야하는 과제가 있음.
---

## 3. 향후 개선 방향
[aiBrainHub.js]
1. **Budget Threshold 상향**: `MARGINAL` 핸드의 호출 범위를 수학적 팟 오즈(Pot Odds)에 부합하도록 수정.
2. **High-Pot Aggression 제어**: 3-Bet/4-Bet 팟에서는 'Pure Bluff' 대신 'Semi-Bluff' 비중을 높이고, 무리한 오버베팅 자제.
3. **Commitment 로직 강화**: 이미 팟의 30% 이상을 투자한 경우, 에퀴티가 35% 이상이면 웬만하면 쇼다운까지 가도록 유도.
4. aiEngineAdvanced.js에 구현된 일부 기능들을 aiBrainHub.js에 편입하여 통합(chat 기능, GTO_RANGES 등 이미 구현된 기능이 있을시 가져와서 쓰거나 통합)

[aiEngine.js]
1. ** aiEngine.js 쇼다운률 개선**: `aiEngine.js`의 낮은 쇼다운률 개선

---

## 4. Antigravity 기술적 답변 / 구현 계획

### 1) Budget 로직의 재정의
사용자님의 의견대로 Budget은 단순한 "베팅 한도"가 아닌 **"전략적 투자 상한선"**으로 기능해야 합니다.
- **수정 방향**: `getHandBudget`에서 에퀴티 35%~50% 구간의 예산을 `potSize * 1.5` 이상으로 확보하여, 상대의 팟 사이즈 베팅에 대한 대응력을 확보하겠습니다.
- **트랩/압박 강화**: 에퀴티 85% 이상(MONSTER+)에서는 예산을 대폭 늘려(5x 이상) 리버 올인이 가능하도록 수정하겠습니다.

### 2) 에퀴티 삭감(Aggression Penalty) 방식 개선
에퀴티를 직접 깎는 방식(Penalty)은 핸드 카테고리 자체를 변질시켜 'Budget Fold'를 유발합니다.
- **수정 방향**: 에퀴티 수치는 그대로 유지하되, `requiredEquity` (콜에 필요한 최소 승률)에 가중치를 주는 방식으로 변경하겠습니다. 
- **효과**: 내 핸드의 강도는 유지하면서, 상대의 공격성이 높을 때 더 신중하게 콜 하도록 유도합니다.

### 3) High-Pot Bluff 제어 (aiEngine.js)
`aiEngine.js`의 `Pure Bluff`가 거대 팟에서 자멸하는 것을 방지합니다.
- **수정 방향**: `pfIntensity` (프리플랍 레이즈 횟수)가 3 이상일 경우 `bluffFreq`를 대폭(50% 이상) 감쇠시키는 안전장치를 추가하겠습니다.

---

## 5. 실행 로드맵 (Proposed Implementation)

### [Phase 1: Budget & Commitment Fix]
- [ ] `aiBrainBudgetTool.js`: `MARGINAL` 에퀴티 구간 예산 상향 (0.8x -> 1.5x)
- [ ] `aiBrainPostflop.js`: `isPotCommitted` 호출 시점 최적화 및 에퀴티 삭감 로직 완화

### [Phase 2: Aggression & Bluff Balancing]
- [ ] `aiEngine.js`: 3-Bet/4-Bet 팟에서의 `Pure Bluff` 확률 및 규모 제어 로직 추가
- [ ] `aiBrainPostflop.js`: `AggressionPenalty`를 `RequiredEquity` 가중치로 전환

### [Phase 3: Engine Integration]
- [ ] `aiEngineAdvanced.js`의 GTO Range 및 특수 로직을 `aiBrainHub.js`로 이관(유용하다면 활용)
- [ ] `getAdvancedAIAction`을 `aiBrainHub` 기반으로 완전 교체
