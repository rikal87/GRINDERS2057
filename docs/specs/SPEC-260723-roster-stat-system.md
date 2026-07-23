---
id: SPEC-260723-roster-stat-system
title: GRINDERS 2057 파트너 및 계약/수익분배 시스템기반 상세 명세서 (Base Spec)
status: active
related_specs: ["SPEC-MASTER-cyber-agency-manager", "IP-260722-roster-market-engine", "SPEC-260723-traits-career-system"]
target_files: ["src/logic/partnerSystem.js", "src/logic/partnerContractSystem.js", "src/logic/persona.js"]
---

# 📄 [SPEC] 파트너 스탯 및 계약/수익분배 베이스 명세서 (Base Spec)

본 문서는 기존 코드베이스에 구현된 [`src/logic/partnerSystem.js`](file:///d:/github-repository/CyberPoker2077/src/logic/partnerSystem.js) 및 [`src/logic/partnerContractSystem.js`](file:///d:/github-repository/CyberPoker2077/src/logic/partnerContractSystem.js)의 핵심 데이터 구조, 관계도 연산, 5대 계약 메커니즘을 온전히 보존 및 명세화하고, 에이전시 장르 전환 시 발생하는 구조적 부적합 요소 분석 및 **비전문가 유저를 위한 이원화 스탯 표기 체계(Dual-Layer Stat Architecture)**를 명세화한 **기초 규격서**입니다.

---

## 1. 파트너 엔티티 베이스 스키마 (`Partner` Data Schema)

기존 `partnerSystem.js`에 정의된 `Partner` 데이터 모델의 전체 필드 사양입니다:

```typescript
interface PartnerBase {
  // 1. 식별 및 페르소나
  id: string;                      // 파트너 고유 ID (예: 'max', 'florence')
  name: string;                    // 표시 이름
  fullName: string;                // 전체 이름
  philosophy: string;              // 성향/도박 철학 문구
  note: string;                    // 파트너 특이사항 비고

  // 2. UI 표시용 4대 직관 스탯 및 12단계 세분화 등급 (Top Layer)
  ovr: number;                     // 종합 능력치 오버롤 (0 ~ 99)
  maxOvrCap: number;               // 소프트/하드 성장 한계선 (Max Cap: 44 ~ 99)
  tierBadge: string;               // 12단계 세분화 등급 ('SS' | 'S+' | 'S' | 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F')
  skillRating: number;             // [실력] 포커 IQ 및 정석 플레이 (0 ~ 100)
  gutsRating: number;              // [배짱] 팟 배팅 및 결단력 (0 ~ 100)
  mentalRating: number;            // [멘탈] 배드비트 저항 및 TILT 방어 (0 ~ 100)
  stardomRating: number;           // [스타성] 스폰서 수입 및 다크웹 후원금 (0 ~ 100)
  archetypeBadge: string;          // 성향 뱃지 ('GTO_CYBORG' | 'TIME_BOMB' | 'ROCK' | 'WEED')

  // 3. 고유 특성 및 커리어 이력 (Perks & Achievements)
  traits: Array<Trait>;            // 최대 3개 특성 배열 (미발현/잠재 특성 포함)
  careers: Array<CareerEntry>;      // 선수 명예/경력 이력 태그 배열

  // 4. 포커 엔진 런타임 연산 스탯 및 경기 통계 기록 (Play Statistics)
  vPIP: number;                    // Voluntarily Put Money In Pot (자발적 팟 참가율)
  AF: number;                      // Aggression Factor (공격성 지수)
  WTSD: number;                    // Went To Showdown (쇼다운 진출률)
  W$SD: number;                    // Won $ at Showdown (쇼다운 승률)
  chipMultiply: number;            // 칩 획득 배율
  playStats: {                     // 세션 승/패 및 핸드 누적 전적
    totalHands: number;            // 총 누적 참전 핸드 수
    wins: number;                  // 세션 승리 횟수
    losses: number;                // 세션 패배 횟수
    totalProfit: number;           // 누적 순수익금 ($)
    bbPerHundred: number;          // 100핸드당 평균 수익 (BB/100)
    bigPotsWon: number;            // 대형 팟(50BB 이상) 승리 횟수
    recentResults: Array<number>;  // 최근 10 세션 손익 히스토리
  };

  // 5. 에이전시 충성도 및 매니지먼트 관리 (Loyalty & Flight Risk)
  agencyLoyalty: number;           // 에이전시 충성도 (0 ~ 100)
  relationship: number;            // 관계도 (0 ~ 1000)
  isPartner: boolean;              // 파트너 여부
  isJoined: boolean;               // 가입/합류 여부
  isJoinedTable: boolean;          // 현재 테이블 참가 여부
  status: string;                  // PARTNER_STATUS ('IDLE' | 'GAMBLING' | 'GONE' 등)
  schedule: Array<ScheduleRule>;   // 요일/시간별 상태 스케줄 규칙
  lastRelationshipCheckTime: string; // 관계도 갱신 체크 타임스탬프

  // 6. 재정 및 채무 (Financials & Debt)
  initialBankroll: number;         // 초기 뱅크롤 ($)
  bankroll: number;                // 현재 보유 뱅크롤 ($ - 실시간 가감 정산, 선수의 HP 개념)
  makeupDebt: number;              // 에이전시 대납 메이크업 빚 ($)
  debt: number;                    // 일반 채무 관계 ($)
  netShareTotal: number;           // 누적 정산 지분 분배금 ($)
  netWorthHistory: Array<{ time: string, netWorth: number }>; // 자산 변동 이력

  // 7. 계약 및 시스템 연동
  contracts: Array<Contract>;      // 체결/체결 가능한 계약 객체 배열
  isAdvanced: boolean;             // 고급 기능 해금 여부
  sendedEventIds: Array<string>;   // 발송 완료된 이벤트 ID 중복 방지 큐
}
```

---

## 2. 5대 계약 시스템 명세 (`partnerContractSystem.js`)

플레이어와 파트너가 체결할 수 있는 5가지 정식 계약 타입과 조건 규칙입니다.

### 2.1 계약 종류 및 요구/해지 관계도 조건

| 계약 타입 (`CONTRACT_TYPE`) | 설명 | 요구 관계도 (`Required`) | 파기 관계도 (`Break`) | 핵심 이익/위험 메커니즘 |
|---|---|---|---|---|
| `BENEFIT_SHARE` | 이익 공유 계약 | **300** | **250** | 세션 수익 발생 시 `ratio` 비율로 분배. 동시 1개 계약 제한. |
| `BAILOUT` | 파산 구제 계약 | **100** | **300** | 파산 시 뱅크롤의 30% 지원. 7일 유예기간 후 일반 채무(`debt`) 전환. |
| `COLLUSION` | 담합 플레이 계약 | **800** | **400** | 동일 테이블 세션 수익 분배. **적발 시 모든 바이인 몰수 리스크.** |
| `STAKING` | 하이스테이크 스테이크 | **1000** | **500** | 파트너가 바이인 100% 대납 및 세션 지분 분배. |
| `A_DATE_WITH_YOU` | 개인 친밀 관계 | **800** | **400** | 개인적 데이트 관계. 무작위 관계도 변동 발생. |

---

### 2.2 계약 예외 및 거절 사유 (`CONTRACT_SIGN_PREVENT_REASON`)

```javascript
export const CONTRACT_SIGN_PREVENT_REASON = {
  BENEFIT_SHARE_MAX_COUNT: 'BENEFIT_SHARE_MAX_COUNT', // [이익 공유]는 동시에 1개의 파트너와만 체결 가능
  RELATIONSHIP: 'RELATIONSHIP',                      // 요구 관계도 미달
  ACTIVE: 'ACTIVE',                                  // 이미 해당 계약 진행 중
  COOLDOWN: 'COOLDOWN',                              // 해지 후 쿨다운 기간 미충족 (기본 72시간/Ticks)
  NONE: 'NONE'                                       // 계약 수락 가능
};
```

---

## 3. 세션 시뮬레이션 & 관계도 동적 연산 알고리즘

### 3.1 생활비 지출 및 포커 경기 시뮬레이션 (`simulatePartnersNetWorth`)
1. **비경기 시 생활비 감가**: 파트너가 `IDLE` 상태일 때 시간당(Cycle) 뱅크롤의 `0.15%`가 생활비로 자동 차감.
2. **경기 시 포커 AI 시뮬레이션**: `PARTNER_STATUS.GAMBLING` 시 `MatchSimulator` 풀 시뮬레이션 수행.
3. **저변동성 수학적 대체 수식 (Fallback Math)**:
   $$\text{HandTrigger} = \frac{\text{vPIP} + \text{WTSD}}{2} > \text{Random}()$$
   $$\text{Volatility} = \text{AF} \times \max\left(\frac{\text{Bankroll}}{1000}, 25\right) \times \text{Random}()$$
   - 승리 시: $+ 97 \times \text{Volatility}$
   - 패배 시: $- 100 \times \text{Volatility}$

---

### 3.2 세션 종료 후 관계도 변동 및 이익 정산 (`triggerRelationshipChange`)

1. **채무 자동으로 상환 정산**:
   - 파트너가 세션 순수익을 올렸고 플레이어에게 빚이 있을 경우, 수익의 50% 한도 내에서 `debtRepayment()` 자동 집행.
2. **이익 공유(`BENEFIT_SHARE`) 정산**:
   - 비율(`ratio`)에 따라 파트너 자금 ➔ 플레이어 자금으로 상호 정산.
3. **관계도 동적 수치 연산식**:
   - **채무 영향**: $\text{forDebt} = \text{Math.round}\left(\frac{\text{debt}}{\text{impactPercentage}}\right)$
   - **수익 공유 영향**: $\text{forShareBenefit} = \text{Math.round}\left(\text{baseGain} \times \left(|0.5 - \text{ratio}| \times 4 + 1\right)\right)$
   - **담합 영향**: $\text{forCollusion} = \text{Math.round}\left(\text{baseGain} \times \left(|0.5 - \text{ratio}| \times 4 + 1\right)\right)$
   - 최종 계산된 수치가 관계도 `relationship` (0~1000)에 합산 적용됨.

---

## 4. 이원화 스탯 레이어 및 CRT 네온 게이지 UI 명세 (Dual-Layer Stat & CRT Block UI Specification)

포커 전문 지식이 없는 유저도 직관적으로 선수의 가치를 식별하도록 **UI 표기용 상위 레이어(4대 직관 스탯 & 12단계 등급)**와 **엔진 연산용 하위 레이어(포커 raw 수치)**를 완벽 분리하며, 디자인 헌장에 명시된 **100% 직각 CRT 네온 블록(`█` / `░`) 게이지 바**를 표준 적용합니다.

```text
┌───────────────────────────────────────────────────────────┐
│ [Top UI Layer: 직각 CRT 네온 블록 게이지 표현 (Terminal OS)]│
│  - OVR (종합 능력치 0 ~ 99) | BUYOUT: [$145,000 Cash-out] │
│  - 12단계 등급: SS / S+ / S / A+ / A / A- / B+ / B / C+ / C / D / F
│                                                           │
│  SKILL    [████████░░] 82/100  [GTO_CYBORG]               │
│  GUTS     [██████████] 95/100  [HIGH_VOLATILITY]          │
│  MENTAL   [🟨🟨████████] 120/100 🛡️[OVER-SHIELD: +20%]    │
│  STARDOM  [██████░░░░] 60/100  [SPONSOR_UNLOCKED]         │
│                                                           │
│  - 재정 지표: [BANKROLL: $50,000 (선수 HP)] | [DEBT: $12,000 Makeup]
│  - 고유 특성 (Traits): [침착한 자] / [유망주] / [흙수저] / [??? 미발현]
│  - 전적 기록 (Stats): [RECORD: 42W - 18L | ROI: +14.2 BB/100]
└───────────────────────────────────────────────────────────┘
                             │
                             │ [동적 정규화 수식 매핑 (Normalization Mapping)]
                             ▼
┌───────────────────────────────────────────────────────────┐
│ [Bottom Engine Layer: 터미널 상세 정보 탭 / 백엔드 수식]   │
│  - vPIP (프리플랍 참가율) = EffectiveSkill * 0.15 + EffectiveGuts * 0.25│
│  - PFR (프리플랍 레이즈)  = EffectiveSkill * 0.10 + EffectiveGuts * 0.30│
│  - AF (공격성 지수)      = EffectiveGuts / 20            │
│  - W$SD (쇼다운 승률)    = EffectiveSkill * 0.6 + 30     │
│  - 스폰서/다크웹 수입    = STARDOM * $100 / 시간          │
└───────────────────────────────────────────────────────────┘
```

### 4.1.1 4대 직관 스탯-게임 메커니즘 1:1 대응 관계표

| 직관 지표 | 게이밍 정체성 (Gamified Identity) | 게임 시스템 및 연산 수식 영향 |
|---|---|---|
| **`skill` (실력)** | **평균 수익률 (Mean EV)** | 틱당 우상향 기본 승률 (Win Rate). 높을수록 실수 없이 안정적 이익 창출. |
| **`guts` (배짱)** | **변동성 / 팟 크기 (Variance)** | 팟 크기($\text{PotSize} = \text{guts} \times \text{Volatility}$) 형성. 높을수록 대형 팟 ROI 폭발 or 대파산. |
| **`mental` (멘탈)** | **디버프 / 리스크 제어 (Debuff Risk)** | 붕괴 시 실력 패널티($\text{EffectiveSkill}$ 감쇄) 및 연패 TILT 급발진 제어망. |
| **`bankroll` (뱅크롤)** | **선수 생명력 (Player HP)** | 카지노 바이인 및 선수의 체력(HP). $0이 되면 파산(Bust) ➔ 에이전시 대납 메이크업 빚 귀속. |

---

### 4.1.2 디아블로 보호막 스타일 오버레이 게이지(Over-Shield Layered Bar) 규격

특성(`[침착한 자]`, `[유망주]` 등)에 의해 일반 스탯 한계(100)를 초과(예: 120/100)할 경우, **디아블로의 보호막(Over-Shield) 개념을 이식한 레이어드 덧씌우기 연출**을 표준 적용합니다:

1. **가로 프레임 10칸 규격 고정 (Layout Alignment)**:
   - UI 정렬 파괴를 막기 위해 모든 스탯 바의 가로 길이(10칸 프레임)는 100% 동일하게 유지합니다.
2. **Neon Yellow 오버레이 레이어 덧씌우기 (Over-Shield Overlay)**:
   - 100점 만점을 초과하는 +20점(2칸 분량)이 게이지 바 앞쪽부터 **Neon Yellow (`#ccff00`) 오버레이 층(`🟨`)으로 덧씌워져 중첩 표기**됩니다.
   - 예: `[🟨🟨████████] 120/100 🛡️[OVER-SHIELD: +20%]`
3. **직관적 오버실드 감성 체감**:
   - 가로 길이가 늘어나는 대신, 기존 바 위에 파란색/노란색 보호막이 차오르는 디아블로/SF 실드 메타포를 주어 **"한계를 뚫고 방어막이 덧씌워진 한계 초월 상태"**임을 정밀하게 전달합니다.

---

### 4.1.3 스탯 성장-경제적 몸값 폭등 & 한계 돌파(Cap Break) 예외 규칙 (Dynamic Economic & Cap Break Strategy)

인위적인 인공 하드 캡을 폐기하고, **선수가 성장할수록 선수의 몸값(Signing Bonus Demand), 요구 지분율(Partner Share Target), 이적 바이아웃 매각 대금(Buyout Cash-out)이 기하급수적으로 폭등하는 경제적 연동 시스템**을 기본으로 하되, **유망주(`PRODIGY`) 특성 보유자의 한계 돌파 예외 규정**을 유지합니다:

1. **선수 성장에 따른 이익 분배율 폭등**:
   - 선수가 C급(OVR 30)에서 S급(OVR 90)으로 성장함에 따라 선수가 요구하는 지분 비율이 **45% ➔ 85%**로 폭등합니다.
   - 선수가 성장할수록 에이전시의 세션 정산 수수료 비율은 줄어들지만, 선수의 승률과 팟 상금 규모가 커져 절대 수익은 증가합니다.
2. **최고점 매각 및 자금 확보 (Buyout Cash-out Strategy)**:
   - 선수의 지분 요구가 너무 높아져 재계약 부담이 커진 시점에서, 플레이어는 **경쟁 에이전시에게 선수를 바이아웃 매각 대금(`BuyoutValue`)을 받고 즉시 이적(Cash-out)시키는 경영적 선택**을 할 수 있습니다:
     $$\text{BuyoutValue} = (\text{OVR} \times \$1,000) + (\text{stardomRating} \times \$500) - \text{makeupDebt}$$
   - C급 유망주를 육성하여 S급 최고점에서 $200,000+ 현금을 받고 매각한 뒤, 그 자금으로 새로운 C급 유망주 선수를 여러 명 새로 육성하는 **'선수 육성 ➔ 바이아웃 매각 대금 회수' 선순환 루프**를 형성합니다.
3. **유망주(`PRODIGY`) 및 한계 돌파(Cap Break) 특성 예외 규정 유지**:
   - **`[PRODIGY / 유망주]` 특성 보유자**: 일반 선수가 성장에 따라 지분 요법 부담이 폭증하는 것과 달리, 유망주 특성을 가진 선수는 **성장 속도가 1.5배 빠르며 한계치(S+ / 95 OVR)까지 수수료 감가 저항을 지니고 지속 발굴**됩니다.
   - **`[CALM_MIND / 침착한 자]` 등 특성 보유자**: 멘탈 등 특정 스탯 한계를 100 이상(120/100)으로 초월시킬 수 있는 **Over-Shield 한계 돌파 혜택이 유지**됩니다.

---

## 5. 에이전시 장르 전환에 따른 현행 구조의 5대 부적합 요소 및 개편 방안

기존 1:1 파트너 개인 관계 시뮬레이터에서 **에이전시 매니지먼트**로 전환 시 시급히 리팩토링해야 할 결함 분석입니다:

### 5.1 하드코딩된 고정 4인 파트너 배열 (`CLASSES_PARTNER`)
- **부적합 이유**: 에이전시 매니지먼트는 다크웹/이적 시장에서 절차적 생성(Procedural Generation)된 선수들을 무한히 스카우팅·계약·방출하는 구조여야 함.
- **개편안**: `CLASSES_PARTNER` 하드코딩 참조를 폐기하고 동적 동화 시장 풀(`marketPool`) 데이터 생성 엔진 구축.

### 5.2 개인 친밀도 중심의 관계도 메커니즘 (`relationship >= 800`)
- **부적합 이유**: 기업 에이전시 계약은 1:1 데이트나 개인적 호감도가 아닌 이익 분배율(`profitSplitRatio`), 사채 빚 인수(`makeupDebt`), 에이전시 충성도(`agencyLoyalty`)로 작용해야 함.
- **개편안**: 호감도 요구치 시스템을 폐기하고, 경제적 반대급부 및 계약 조건 협상 알고리즘으로 교체.

### 5.3 이익 공유 계약의 단일 1인 제한 (`BENEFIT_SHARE_MAX_COUNT`)
- **부적합 이유**: 에이전시는 수십 명의 소속 선수와 동시에 계약을 체결하여 멀티 세션 팟 수익을 수수료로 일괄 정산해야 함.
- **개편안**: 1인 최대 계약 수 제한(Max Count Limit) 로직 전면 삭제.

### 5.4 1:1 개인 파산 구제 (`BAILOUT`) 방식
- **부적합 이유**: 에이전시 스테이킹(Staking)에서는 선수가 발생시킨 세션 손실을 에이전시 자금으로 대납하되, 해당 손실은 선수의 메이크업 빚(`makeupDebt`)으로 쌓여 이익을 내기 전까지 귀속되어야 함.
- **개편안**: 7일 유예 채무 지원 방식을 '에이전시 Staking Makeup 빚 회수 및 선순위 변제' 시스템으로 변환.

### 5.5 테이블 직접 참가 전제 계약 (`COLLUSION` 등)
- **부적합 이유**: 매니저는 포커 테이블에 직접 참가하지 않으므로 1:1 테이블 담합 플레이는 무의미함.
- **개편안**: '타 에이전시 선수 사보타주', '딜러 매수', '약물/멘탈 재활 케어' 계약으로 기능 교체.

---

### 5.6 에이전시 재계약 협상 난이도, 충성도(Loyalty) 및 이탈/스카우팅 심화 메커니즘 (Deep Negotiation & Flight System)

에이전시 매니지먼트 장르의 깊이감(Depth)과 긴장감(Tension)을 유지하기 위한 3대 핵심 경영 연산 명세입니다:

#### 1. OVR 및 스타성 비례 계약 협상 수식 (Dynamic Contract Demands)
- 선수의 능력치(`OVR`) 및 인기도(`stardomRating`)가 높아질수록 선수가 요구하는 최소 이익 분배율과 계약금이 기하급수적으로 폭등합니다:
  $$\text{PartnerShareTarget} = \text{Math.min}\left(0.90, 0.45 + \frac{\text{OVR}}{200} + \frac{\text{stardomRating}}{250}\right)$$
  $$\text{SigningBonusDemand} = \text{OVR} \times \text{stardomRating} \times \$20$$
  - **C/D급 (OVR 30)**: 파트너 45% vs 에이전시 55% 분배 수락.
  - **S급 (OVR 90)**: 파트너 85% vs 에이전시 15% 분배를 요구하며, 계약 미충족 시 협상 결렬.

#### 2. 에이전시 충성도(`agencyLoyalty`) 및 재계약 거부/이탈 프로토콜 (Flight Risk)
- 무리한 수수료 착취, 연속 배드비트 멘탈 케어 무시, 정산 지연 발생 시 충성도가 지속 감가됩니다.
  - **경고 (Loyalty 30 ~ 49)**: `[RENEWAL WARNING]` 단말기 경고 알림. 재계약 거부 확률 50%.
  - **재계약 거부 (Loyalty 10 ~ 29)**: 잔여 계약 만료 즉시 재계약 불응 후 FA 시장으로 자진 이탈.
  - **야반도주 / 타 에이전시 이적 (Loyalty 0 ~ 9)**: 메이크업 빚이 없는 경우 계약 기간 중이라도 타 에이전시의 스카우트 유혹에 넘어가 위약금을 물고 **무단 계약 파기 이탈 (Poached)**.

#### 3. 메이크업 채무 귀속 및 바인딩 (Makeup Debt Binding)
- 선수가 에이전시로부터 빚(`makeupDebt > 0`)을 지고 있는 경우, **빚을 전액 상환하기 전까지는 법적으로 에이전시를 무단 이탈할 수 없음 (Debt Protection Lock)**.
- 단, 타 경쟁 에이전시가 해당 메이크업 빚을 대신 대납해 주고 선수를 빼가는 **'바이아웃 스카우팅(Buyout Steal)'** 적대적 스카우팅 이벤트 발생 가능.

---

### 5.7 카지노 구역 2중 진입 장벽 (Dual Gating Architecture: Buy-in Cash & Player Stardom)

선수를 카지노 스테이지에 파견하기 위해서는 **① 에이전시의 바이인 대납 현금**과 **② 선수의 최소 인기도/스타성 요구치(`stardomRating >= Target`)**를 동시에 충족해야 파견 집행 가능:

1. **마이크로 지하 창고 (Micro)**: 필요 바이인 $1,000 / 요구 스타성 `0+` (제한 없음)
2. **H.B.D 클럽 VIP (Low)**: 필요 바이인 $25,000 / 요구 스타성 `20+` (신예 스타)
3. **홀덤 하우스 (Middle)**: 필요 바이인 $100,000 / 요구 스타성 `50+` (인기 프로)
4. **로열 카드룸 (High)**: 필요 바이인 $1,000,000 / 요구 스타성 `80+` (탑스타 초청장 필수)
5. **투 더 마스 궤도 라운지 (Special)**: 필요 바이인 $10,000,000 / 요구 스타성 `95+` (세계 챔피언 & 레전드)

---

### 5.8 1-Click 에이전시 자금 주입 (Direct Capital Staking Injection)

선수의 뱅크롤(HP)이 바닥났거나 상급 카지노 진출을 위해 에이전시 현금(`store.bankroll`)을 선수 뱅크롤(`partner.bankroll`)에 직접 주입할 때의 2대 경영 선택지:

1. **[선택 A] 무상 지원 / 성과 격려금 (Gift & Stimulus)**:
   - 조건 없이 뱅크롤 전액 무상 주입 ➔ 선수의 에이전시 충성도(`agencyLoyalty`) +30 폭등.
2. **[선택 B] 채무 귀속 대납 / 사채 (Makeup Staking Loan)**:
   - 주입 금액 전액이 선수의 메이크업 빚(`makeupDebt`)으로 적립 ➔ 빚 상환 전까지 무단 이탈 금지(`Debt Lock`).

---

### 5.9 동일 카지노 다중 파견 및 담합(Collusion) 2대 운용 프로토콜

동일 카지노 스테이지에 소속 선수를 여러 명 동시 파견할 시의 2대 운용 전략:

1. **[전략 A] 안전 분산 출전 (Table Separation)**:
   - 각자 다른 테이블(#01, #02)에 배치하여 의심도 0%로 안전하게 독자 백그라운드 팟 수확.
2. **[전략 B] 동일 테이블 담합 공작 (Collusion Operation)**:
   - 두 선수를 동일 테이블에 동시 투입하여 샌드위치 베팅 집행 ➔ 세션 수익률(EV) +25% 우상향 독식.
   - 단, 틱당 5% 확률로 카지노 보안 적발(`SECURITY_DETECTION`) 발동 ➔ 적발 시 세션 칩 몰수 및 3일간 출전 차단.

---

### 5.10 카지노 블랙리스트 및 3대 신분 세탁 메커니즘 (Blacklist & Laundering System)

담합 적발 또는 치팅 스캔들 발생 시 해당 카지노 블랙리스트(`BLACKLISTED`)로 지정되어 출전 차단(`ACCESS_DENIED`). 단, `Micro Warehouse` 및 `Orbit Lounge` 등 치외법권 스테이지 제외:

1. **아이템 수단**: 블랙 마켓(`Shop.vue`)에서 **`[신분 세탁 마이크로 칩]` ($15,000)** 구매 후 선수에게 착용시킴 (100% 해제).
2. **모듈 수단**: 모듈 덱 **`[IDENTITY_FORGERY]`** 태스크 가동 (24시간 의심도/악명 50% 감가).
3. **메신저 뇌물 수단**: `CommsInboxPage.vue`에서 카지노 보안 담당자에게 **$20,000 비자금 송금 후 즉시 블랙리스트 삭제 합의**.

---

## 6. 향후 에이전시 매니지먼트 세부 확장 로드맵 (Extension Roadmap)

1. **[구현 단계 1] 4차원 스탯 및 절차적 생성기 연동**: `persona.js` 내 무작위 선수 생성기(`generateRandomRosterCandidate`) 구축.
2. **[구현 단계 2] 메이크업(Makeup) 손실 대납 및 Profit Split 회수**: `partnerSystem.js` 세션 정산 로직 개편.
3. **[구현 단계 3] 인력 시장 터미널 OS UI 연동**: `TerminalPartnersNet.vue` Master-Detail 콘솔 바인딩.

