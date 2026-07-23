---
id: SPEC-260723-traits-career-system
title: GRINDERS 2057 선수 고유 특성(Traits) 및 커리어(Careers) 상세 기획 명세서
status: active
related_specs: ["SPEC-MASTER-cyber-agency-manager", "SPEC-260723-roster-stat-system"]
target_files: ["src/logic/traits.js", "src/logic/careers.js"]
---

# 📄 [SPEC] 선수 선천적 특성(Innate Traits) 및 후천적 커리어(Acquired Careers) 명세서

본 문서는 **GRINDERS 2057** 포커 에이전시 매니지먼트의 핵심 서사 및 육성 재미를 담당하는 **선천적 특성(Innate Traits)**과 **후천적 커리어(Acquired Careers)**의 분리 아키텍처 및 데이터 연산 체계를 규정하는 기술 스펙 문서입니다.

---

## 1. 개요 및 이분법 아키텍처 원칙 (Dual Architecture Principle)

선수의 특성 시스템은 유저의 RPG적 육성 성취감과 서사 체감을 극대화하기 위해 **선천적 재능(Innate Traits)**과 **후천적 업적(Acquired Careers)**으로 완벽히 역할 분리됩니다:

```text
┌───────────────────────────────────────────────────────────┐
│ [Innate Traits: 선천적 특성 (타고난 성향 & 패시브)]       │
│  - 스카우팅 시점 부여 (최대 3개, 미발현 ??? 포함)          │
│  - 실력/배짱/멘탈/스타성 수치 보정 & 경기 규칙 변형        │
│  - 예: [침착한 자], [포커 컴퓨터], [유리멘탈], [파산 불사조] │
└───────────────────────────────────────────────────────────┘
                             │
                             │ [에이전시 경영 및 경력 누적 (Agency Progression)]
                             ▼
┌───────────────────────────────────────────────────────────┐
│ [Acquired Careers: 후천적 커리어 (경영 훈장 & 이력 스펙)]  │
│  - 플레이어가 에이전시 운영 중 조건 달성 시 실시간 적재    │
│  - 스타성/이적 몸값(Buyout) 폭등 & 다크웹 스폰서 해금     │
│  - 예: [에이전시 창립 멤버], [메이크업 빚 청산자], [WSOP 우승]│
└───────────────────────────────────────────────────────────┘
```

---

## 2. 선천적 특성(Innate Traits) 명세

### 2.1 특성 아키텍처 구조

```typescript
interface Trait {
  id: string;              // 특성 고유 ID (예: 'CALM_MIND')
  name: string;            // UI 표시 명칭 (예: '침착한 자')
  category: 'PERK' | 'HYBRID' | 'FLAW'; // 긍정 / 일장일단 / 부정
  type: 'MENTAL' | 'SKILL' | 'GUTS' | 'STARDOM' | 'SPECIAL';
  tier: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  desc: string;            // 직관적 스탯 +- 설명 문구
  isUnrevealed: boolean;   // 미발현 (???) 여부
  unlockXp: number;        // 해금 필요 누적 참전 경험치
}
```

---

## 3. 후천적 커리어(Acquired Careers) 명세

### 3.1 커리어 데이터 구조

```typescript
interface CareerEntry {
  id: string;              // 이력 고유 ID
  title: string;           // 표기 타이틀 (예: '메이크업 빚 전액 청산자')
  achievedTime: string;    // 달성 시각 타임스탬프
  category: 'ORIGIN' | 'AGENCY_MILESTONE' | 'TIMELINE_HISTORY'; // 이력 분류
  bonus: {
    stardomAdd?: number;   // 스타성 보정
    gutsAdd?: number;      // 배짱 보정
    buyoutMultiplier?: number; // 이적 해약금 배율
  };
}
```

---

### 3.2 주요 후천적 커리어 이력 태그 목록 (Acquired Career Tags DB)

| 커리어 이력 타이틀 | 카테고리 | 획득 조건 (Trigger) | 경영 및 수치 영향 효과 |
|---|---|---|---|
| **`동네 프리롤 우승자`** | `ORIGIN` | 소형 지하 프리롤 토너먼트 1위 달성 | 스타성 `stardomRating` +5 |
| **`에이전시 창립 멤버`** | `AGENCY_MILESTONE` | 에이전시 설립 직후 1호 계약 파트너 | 충성도 100% 고정 & 이탈 거부 |
| **`메이크업 빚 청산자`** | `AGENCY_MILESTONE` | $50,000 대납 빚을 세션 수익으로 청산 | 배짱 `gutsRating` +10, TILT 저항 |
| **`메이저 챔피언`** | `AGENCY_MILESTONE` | 메이저 S급 토너먼트 1위 달성 | 스타성 +25, 이적 몸값(Buyout) 3배 폭등 |
| **`다크웹 핫 스트리머`** | `AGENCY_MILESTONE` | 관전 세션 빅팟 5회 연승 | 스타성 +15, 다크웹 스폰서십 해금 |

---

## 4. 담합(Collusion) 및 치팅(Cheating) 시스템적 연산 명세 (Systemic Collusion Architecture)

2026-07-23 의사결정 프로토콜(`decision-protocol`)에 따라, 담합 및 치팅은 복잡한 실시간 미니게임 대신 **백그라운드 가상 시뮬레이션(Mode A)의 특성(Trait) 및 모듈(Module) 패시브 수치 연산 체계(옵션 A)**로 확정 및 전면 표준화합니다:

1. **동일 테이블 담합 공작 패시브 연산 (`COLLUSION_PASSIVE`)**:
   - 동일 테이블에 2인 이상 소속 선수를 투입하고 담합 연산 모듈/특성을 활성화하면 **세션 수익률(EV) +25% 우상향 보정**.
   - 단, 틱당 **5% 확률로 카지노 보안 적발(`SECURITY_DETECTION`)**이 발동하여 적발 시 세션 칩 몰수 및 3일간 출전 금지.
2. **치팅 스캔들 패시브 연산 (`CHEATING_SCANDAL`)**:
   - `[CHEATING_SCANDAL]` 특성 보유자는 쇼다운 승률이 +30% 상승하나, 5% 확률로 딜러에 의해 전액 몰수 및 $10,000 채무 추가.

---

## 5. 연동 및 링킹 지정

- 본 기술 명세서는 [`SPEC-260723-roster-stat-system.md`](file:///d:/github-repository/CyberPoker2077/docs/specs/SPEC-260723-roster-stat-system.md) 및 [`SPEC-MASTER-cyber-agency-manager.md`](file:///d:/github-repository/CyberPoker2077/docs/specs/SPEC-MASTER-cyber-agency-manager.md)의 하위 구현 명세서로 바인딩됩니다.

