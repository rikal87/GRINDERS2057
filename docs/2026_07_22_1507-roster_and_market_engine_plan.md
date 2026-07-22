# 📄 [구현 계획서] GRINDERS 2057: 선수 로스터 엔진 & 인력 시장 시뮬레이션 구축

본 문서는 **GRINDERS 2057**의 장르 전환(포커 에이전시 매니지먼트)에 맞춰 백엔드 NPC/파트너 데이터 구조(`persona.js`, `partnerSystem.js`)를 리팩토링하고, 인력 시장(Scouting Pool) 및 로스터 관리 UI를 구축하기 위한 마이크로 태스크 계획서입니다.

---

## 1. 개요 & 개발 목표

- **기존 한계:** 4명의 수동 지정 파트너(`CLASSES_PARTNER`) 위주의 단순 스탯 및 1:1 개인 관계 시뮬레이션.
- **새로운 목표:** 
  1. **절차적 선수 생성기 (Roster Generator):** 기술/결함/사채 빚을 떠안은 무작위 포커 선수 무한 생성.
  2. **에이전시 계약 & 로스터 관리 시스템 (Contract & Roster Engine):** 스카우팅, 빚 인수, 수익 배분, 월급 및 해약 관리.
  3. **인력 시장 터미널 OS UI (`04 // PARTNERS_NET`):** [cyberspace-os-standard](file:///d:/github-repository/CyberPoker2077/.agents/skills/cyberspace-os-standard/SKILL.md) 헌장을 적용한 Master-Detail 2단 인력 시장 콘솔 및 계약 체결 팝업.

---

## 2. 모듈별 변경 사항 (Proposed Changes)

### Component 0: 고정 틱 이벤트 수신 버퍼 엔진 (Fixed-Rate Event Notification Buffer) ([simulate_ai_match.js](file:///d:/github-repository/CyberPoker2077/harness/legacy/scripts/simulate_ai_match.js))
- [x] [simulate_ai_match.js](file:///d:/github-repository/CyberPoker2077/harness/legacy/scripts/simulate_ai_match.js) 
  - **고정 틱 이벤트 수신 메커니즘 (Fixed Event Rate Buffer):**
    - 백그라운드에서 아무리 수많은 NPC 경기와 빅팟이 동시에 터지더라도, 유저의 단말기(메신저/터미널)가 수신할 수 있는 이벤트 수는 **`틱당 최대 N개 (Fixed Events Per Tick)`**로 꽉 묶어 보장 (알림 도배 및 과부하 100% 방지).
    - 수신 큐(Queue)에 들어온 빅팟 이벤트는 순차적으로 차례대로 유저 UI에 유입 ➔ 성능 부하 0% & 매끄러운 UX 흐름 유지.

### Component 0.5: 메신저 긴급 수신 알림 UI & 알림 도배 방지 필터 (Priority Filtering & Throttling)
- **100+ NPC 규모에서의 알림 도배 예방 필터:**
  - **우선순위 상한제 (Priority Queue):** NPC 100명이 기용되어 알림 큐가 밀릴 경우, **판돈 금액이 더 크거나 핵심 유망주/에이스 선수의 빅팟 우선순위**만 남기고 소형 빅팟은 자동으로 메시지 목록에 단순 로그 처리.
  - **쿨다운 타이머 (Cooldown):** 동일 선수의 알림은 최소 3분 간격으로만 수신되도록 스로틀링(Throttling) 적용 ➔ 알림 폭탄 예방 및 최상의 UX 보장.

### Component 0.8: 관전 전용 포커 테이블 & 리플레이 스냅샷 뷰어 UI (`MatchSpectateModal.vue`)
- [x] [MatchSpectateModal.vue](file:///d:/github-repository/CyberPoker2077/src/components/terminal/MatchSpectateModal.vue) [NEW]
  - **하이브리드 관전 플레이어 (VOD Replay + Live Transition):**
    - 메신저의 🚨 `[관전 진입]` 버튼 클릭 시 오픈되는 **Zero-Radius CRT 방송 오버레이 팝업**.
    - **과거 스트리트(Preflop~Flop):** `actionStream` 스냅샷 버퍼를 0.3초 단위로 고속 재생(VOD Replay)하여 서사적맥락(기승전결)을 유저에게 재생.
    - **현재 스트리트(Turn/River):** 리플레이가 끝나는 즉시 실시간 라이브로 전환하여, **100% 동일한 카드/판돈 상태에서 다음 액션 진행 상황 관전 가능**.

### Component 1: NPC & 로스터 스탯 스키마 확장 (`persona.js`)
- [x] [persona.js](file:///d:/github-repository/CyberPoker2077/src/logic/persona.js)
  - **3대 스탯 아키텍처 스키마 (Stat Schema Blueprint):**
    1. **`skills` (기술 스탯 0~100):**
       - `gto` (GTO 연산력: 수학적 솔버 정확도), `bluff` (블러핑 유도), `tell` (상대 Tell 감지율)
    2. **`flaws` (결함 & 멘탈 스탯 0~100):**
       - `tiltResistance` (TILT 저항력: 연패 시 폭주 방지), `drugDependence` (약물 의존도: 도파민 블라인드), `loyalty` (충성도: 타 에이전시 스카웃/배신 방지)
    3. **`financials` (경제 스탯):**
       - `weeklySalary` (주급), `buyoutCost` (에이전시 이적 인수금), `makeupDebt` (선수가 등에 짊어진 사채 빚)
  - **`generateRandomRosterCandidate(tier)` 절차적 생성 함수 기획:**
    - F급(거리의 도박꾼)부터 S급(세계적인 천재)까지, **능력치는 뛰어나지만 사채 빚 10만 달러나 약물 의존도를 달고 나오는 결함 있는 기용 대상 무작위 생성**.

### Component 2: 에이전시 & 이적 시장 엔진 (`partnerSystem.js` & `partnerContractSystem.js`)
- [x] [partnerSystem.js](file:///d:/github-repository/CyberPoker2077/src/logic/partnerSystem.js)
  - `store.marketPool` (이적 시장 선수 목록) 관리.
  - `signRosterContract(candidateId, terms)`: 빚 인수 + 인수금 지불 후 `store.myRoster`로 선수 등록.
  - `releaseRosterContract(partnerId)`: 선수 방출 및 해약금 처리.
  - **TILT 시뮬레이션 수치 반영:** `simulatePartnersNetWorth` 내에 손실에 따른 `currentTilt` 지수 누적 로직 추가.

### Component 3: UI 구현 (`04 // PARTNERS_NET` & 이적 콘솔)
- [x] [TerminalPartnersNet.vue](file:///d:/github-repository/CyberPoker2077/src/components/terminal/TerminalPartnersNet.vue) (기존 파트너 페이지 재건축)
  - **Template B (Master-Detail Split Console)** 준수:
    - **좌측 30%**: [내 에이전시 로스터] / [다크웹 인력 시장] 탭 분리 세로 인덱스 목록.
    - **우측 70%**: 선택된 선수의 3D/CCTV 스캔 오버레이, 기술/결함 스탯 레이더, 빚 인수 및 계약 체결 CTA 네온 블록.

---

## 3. 마이크로 태스크 실행 순서 (Implementation Phases)

### Phase 1: 백엔드 로스터 엔진 확장 (`persona.js` & `partnerSystem.js`)
1. `persona.js`에 `ROSTER_TIERS`, `ROSTER_FLAWS` 상수 정의 및 무작위 생성기 함수 작성.
2. `partnerSystem.js`에 인력 시장 리프레시(`refreshMarketPool`) 및 에이전시 계약 처리 메커니즘 추가.
3. 단위 테스트/데이터 콘솔 로그로 선수 생성 및 계약 데이터 검증.

### Phase 2: 인력 시장 UI (`TerminalPartnersNet.vue`) 개편
1. `TerminalPartnersNet.vue` 레이아웃을 `Template B (Master-Detail Split)` 구조로 수정.
2. 내 로스터 / 다크웹 이적 시장 탭 전환 구현.
3. 직각(Zero-Radius) 세라믹/네온 톤의 계약 체결 팝업 (`RosterContractModal.vue`) 연결.

---

## 4. 검증 계획 (Verification Plan)

### 백엔드 시뮬레이션 검증
- 개발자 콘솔에서 `refreshMarketPool()` 실행 시 무작위 결함 선수(빚, TILT 저항력 등)가 성공적으로 생기는지 확인.
- `signRosterContract()` 호출 시 플레이어 자금 차감, 빚 인수 및 `myRoster` 등록 작동 확인.

### UI / UX 비주얼 검증
- `cyberspace-os-standard` 헌장에 따라 직각, CMY 3원색 배색, Pretendard Std 900 적용 여부 점검.
- 내 로스터 목록과 다크웹 이적 시장 간 전환 스무스 여부 검증.
