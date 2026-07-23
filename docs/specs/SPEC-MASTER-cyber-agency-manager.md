---
id: SPEC-MASTER-cyber-agency-manager
title: GRINDERS 2057 마스터 게임 기획서 (Cyber Agency Manager Master GDD)
status: MASTER_GDD
related_specs: ["SPEC-260723-roster-stat-system"]
target_files: ["src/App.vue", "src/logic/partnerSystem.js", "src/logic/persona.js"]
---

# 🎯 [MASTER GDD] GRINDERS 2057: CYBER-AGENCY MANAGER

> **문서 상태:** MASTER_GDD (Single Source of Truth)  
> **최종 갱신일:** 2026-07-23  
> **장르:** 사이버펑크 느와르 포커 에이전시 매니지먼트 & 관전 시뮬레이션 (FM/FC 스타일 + 다크웹 공작)  

---

## 1. 개요 및 장르 전환 정의 (Genre Pivot Definition)

본 프로젝트는 플레이어가 직접 1인칭으로 카드 핸드를 플레이하던 단순 포커 덱빌딩 게임에서, **디스토피아 에이전시 대표로서 포커 선수(Roster)를 발굴·계약·육성하고 멀티 세션 경기를 관전/공작하는 "사이버펑크 포커 매니지먼트 시뮬레이션"**으로 마스터 장르 전환을 단행합니다.

---

## 2. UI / UX Dual-Theme Architecture (이중 공간 레이어)

[cyberspace-os-standard](file:///d:/github-repository/CyberPoker2077/.agents/skills/cyberspace-os-standard/SKILL.md) 디자인 헌장(100% Zero Radius, CMY 3원색 배색, Pretendard Std 900)을 준수하며 현실과 사이버 공간을 완전 이원화합니다.

```text
┌───────────────────────────────────────────────────────────┐
│ [Bottom Layer: Cyber-Terminal OS (Black Neon Theme)]      │
│  - 배경: Pure Black (#000000), CRT 스캔라인, 기계음       │
│  - 핵심: 선수 데이터 연산, 다크웹 장비/약물 거래, 빚 정산 │
│  - 템포: 초당 수십 줄의 텍스트 로그가 폭포수처럼 연산됨   │
└───────────────────────────────────────────────────────────┘
                             ▲
                             │ [모드 전환: CRT 켜짐 & 스캔라인 글리치 이펙트]
                             ▼
┌───────────────────────────────────────────────────────────┐
│ [Top Layer: Secured Enterprise Messenger (Ceramic Off-White Theme)]│
│  - 차가운 세라믹 오프화이트 (#E2E8F0), 기업용 보안 단말기 감성│
│  - 핵심: 선수 이적 협상, 비열한 사보타주 거래, 사건/사고 처리│
│  - 규칙: 직각 텍스트 박스, 이모지 금지 (포커 기호 ♠♦♥♣ 치환)│
└───────────────────────────────────────────────────────────┘
```

** 해당 문서는 계획서이며 실제 적용된 내용과 다를수있음!!!!

---

## 3. Core Game Loop & Broadcast System (관전 & 경기 시스템)

플레이어가 직접 포커를 치는 것이 아닌, **"스포츠 중계/경마 감성의 관전 및 베팅 마스터"** 시점으로 진행됩니다.

### ① 속도 2원화 시뮬레이션 (Speed Two-Tier Engine)
- **일반 핸드 (Skipped Fast Log):** 어두운 터미널 콘솔에서 초당 수십 줄의 포커 연산 로그가 0.5초 만에 빠르게 지나감 (`HAND #102: FOLD...`).
- **빅팟 / 올인 / TILT 핸드 (The Live Broadcast):** 경고음과 함께 2D HUD 관전 화면이 켜지며 **"슬로우 모션 텐션 중계"**로 자동/수동 전환.

### ② 빅팟 관전 HUD & 정적의 텐션 연출
- 무의미한 대사는 들어내고, **[선수 심장박동 HUD] + [동공 확장 수치] + [타임뱅크 카운트다운]**으로 정적의 몰입감 제공.
- 결과 직후 1초 간 강렬한 멘탈 타격 이펙트 (CRT 화면 흔들림 및 네온 마젠타 번쩍임).

---

## 4. 선수(NPC) 시스템 & 스카우팅 (Roster & Scouting)

상세 능력치 연산식 및 스킹 경제 매커니즘은 [SPEC-260723-roster-stat-system.md](file:///d:/github-repository/CyberPoker2077/docs/specs/SPEC-260723-roster-stat-system.md)를 상시 참조합니다.

### ① 4차원 스탯 아키텍처
- **기술 스탯:** `solverPrecision` / `aggressionFactor` / `exploitativeRead` / `tellShield`
- **멘탈 & 결함:** `tiltThreshold` / `substanceAddiction` / `staminaMax` / `agencyLoyalty`
- **스테이킹 경제:** `profitSplitRatio` (수익 분배율), `makeupDebt` (손실 대납 빚), `weeklyRetainer` (주급)

### ② 4대 선수 페르소나 아키타입
1. **TAG (Tight Aggressive):** 정석 AI 사이보그. 고비용, 저리스크.
2. **LAG (Loose Aggressive):** 공격형 팟 제조기. 높은 폭발력과 멘탈 위험.
3. **ROCK (NIT):** 극보수적 안전빵. 손실 방어 위주.
4. **MANIAC (도박꾼):** 약물/빚 중독자. 극단적 대파산 또는 슈퍼 팟 제조.

---

## 5. 메신저(Comms) 및 비즈니스 시스템

선수와의 마모되는 대화 선택지를 배제하고, **"명확한 리스크/리턴의 비즈니스 단말기"**로 단순화.

- **이적 & 빚 인수 협상:** "몸값을 30% 깎아줄 테니, 내 사채 빚을 대신 갚아달라."
- **사보타주 & 다크웹 거래:** 딜러 매수 청탁, 상대 에이전시 선수 해킹 바이러스 주입.
- **사생활 사건/사고(Events):** "선수 A가 카지노 도박장에서 인질로 잡혔습니다. 몸값을 송금하시겠습니까?"

---

## 6. 단계별 장비 & 코너맨 해금 시스템 (Progression Tree)

유저의 실시간 경기 개입은 **"고티어 장비 및 특수 기술 해금"**을 통해서만 제한적으로 허용됩니다.

```text
[Tier 1: 기초 매니저] 
 └── 관전 및 기본 사이드 베팅만 가능. (선수에게 전적으로 의존)

[Tier 2: 중급 매니저 - 통신장비 업그레이드]
 └── [타임뱅크 연장 (Timebank Extender)]: 딜러 통신망을 해킹해 5초 생각할 시간 추가.

[Tier 3: 고급 매니저 - 뇌파 링크 장착]
 └── [코너맨 수신호 (Cornerman Sign)]: 타임뱅크 5초 전 1회 제공.
     - [FOLD 강제] 또는 [ALL-IN 부추기기] 지시.
     - 단, 선수의 [복종도/TILT 수치]에 따라 지시를 무시하고 급발진할 확률 존재.

[Tier 4: 최상위 다크웹 매니저 - 마인드 해킹]
 └── 복종도와 상관없이 100% 원격 조종. (단, 선수 뇌 세포 파괴 및 후유증 리스크)
```

---

## 7. 세부 기획 참조 연동 지도 (Specification Sitemap)

- ♠ **선수 능력치 및 포커 AI 수식 상세**: [SPEC-260723-roster-stat-system.md](file:///d:/github-repository/CyberPoker2077/docs/specs/SPEC-260723-roster-stat-system.md)
- ♦ **로스터 & 인력 시장 구현 계획서**: [IP-260722-roster-market-engine.md](file:///d:/github-repository/CyberPoker2077/docs/plans/IP-260722-roster-market-engine.md)
- ♦ **에이전트 모듈 장착 구현 계획서**: [IP-260722-agent-module-unification.md](file:///d:/github-repository/CyberPoker2077/docs/plans/IP-260722-agent-module-unification.md)
