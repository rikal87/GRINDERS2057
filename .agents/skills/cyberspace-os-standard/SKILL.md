---
name: cyberspace-os-standard
description: GRINDERS 2057 Cyberspace OS 디자인 헌장, 3대 표준 UI 뼈대 및 디자인 레퍼런스 가이드라인
---

# 🤖 GRINDERS 2057 // CYBERSPACE OS 디자인 시스템 표준 매뉴얼

본 스킬 문서는 **GRINDERS 2057의 독자적인 `Cyberspace OS`**의 모든 터미널 서브페이지 개발 시 준수해야 하는 **절대적 비주얼 및 UX 표준 가이드라인**입니다. 하이테크 비주얼 톤앤매너 및 레이아웃 기조의 영감 레퍼런스로 번지(Bungie)사의 게임 Marathon 기조를 참조하되, 오리지널리티를 확보하기 위한 구체적인 코딩 가이드라인을 정의합니다.

---

## 0. 로컬 비주얼 레퍼런스 저장소 (Design Reference Assets)
프로젝트 내 로컬 디렉토리에 저장된 실제 비주얼 샘플 및 타이포그래피 예시 이미지를 UI 설계 시 적극적으로 참조한다.
- **저장소 위치**: [src/assets/design_reference/](file:///d:/github-repository/CyberPoker2077/src/assets/design_reference)
- **보유 레퍼런스 파일**:
  - `타이포그래피활용예시1.png`: 웅장한 가변 타이포그래피 및 비대칭 레이아웃 배치 예시.
  - `타이포그래피활용예시2.png`: 하이테크 FUI 오버레이 및 직각 블록 배색 활용 예시.

---

## 1. 레이아웃 & 기하학적 원칙 (Geometry & Layout)
- **100% Zero Roundedness**:
  - 모든 컴포넌트, 카드, 모달, 입력창, 버튼의 둥근 모서리(`border-radius`)를 완전 금지하고 **`border-radius: 0px;` (완전 직각)**을 강제한다.
- **Zero 斜線 (No Slants)**:
  - 사선 다각형 구조(`skewX`)를 배제하고, 완전한 직사각형 그리드 시스템으로 UI 단차를 조절한다.

---

## 2. Cyberspace OS 3대 표준 UI 뼈대 분류 (Systematic Layout Taxonomy)
정보의 성격과 중점에 따라 아래 3가지 표준 Master Template 중 하나를 엄격히 선택하여 설계한다.

### [Template A: Brutalist Accordion Stack] (목록 탐색 중심 1단 확장형)
- **적용 대상**: `01 // TABLE_SEARCH`, 메인 로비 메뉴
- **구조**: 웅장한 1단 대형 카드 목록. 클릭 시 세로 아래로 쓱- 물리적 아코디언 펼침.

### [Template B: Master-Detail Split Console] (조작/설정 중심 2단 분할 콘솔)
- **적용 대상**: `04 // PARTNERS_NET`, `03 // BLACK_MARKET`, `05 // MODULE_DECK`
- **구조**: **좌측 30%** (세로 파트너/모듈 선택 인덱스 바) + **우측 70%** (선택 항목의 웅장한 실시간 3D/CCTV, 세부 수치 연산, 슬라이더, 서명/결제 네온 블록 거대 통제 패널).

### [Template C: Dual Log Stream] (대화/로그 중심 메신저)
- **적용 대상**: `06 // COMMS_INBOX`, 딜러 교신 네트워크
- **구조**: 좌측 수신함 인덱스 스트림 + 우측 거대 암호문 메신저 뷰어.

---

## 3. 시그니처 CMY 3원색 배색 시스템 (Color Hierarchy)
네온 3원색 분할 배색을 정밀 매핑한다.
- **Pure Black (`#000000`)**: 모든 화면의 배경색이자 디폴트 베이스.
- **Neon Cyan (`#00f0ff` / `var(--neon-cyan)`)**: 
  - 기본 시스템 메타 텍스트, 비활성 보더라인, 일반 수치 표기, 안내용 아이콘.
- **Neon Yellow (`#ccff00` / `var(--neon-yellow)`)**: 
  - 활성화된 카드 헤더 블록, 핵심 바이인 재화 수치, 최종 실행 및 진입 CTA(Call-To-Action) 버튼 배경.
- **Neon Magenta (`#ff005c` / `var(--neon-magenta)`)**: 
  - 차단 상태(Blacklisted), 부족 상태(Insufficient), 데스매치 조건 등의 강력한 경고 상태 및 제한 구역 표기.

---

## 4. 타이포그래피 & FUI 데코레이션 (Typography & FUI Decor)
- **Pretendard Std 900 (Black)**:
  - 영문/국문 모두 가장 두꺼운 블랙 두께를 사용하며, 타이틀은 거대 가변 폰트(`clamp()`)를 적용하여 웅장함을 유지한다.
- **No Emojis & Real Illusts**:
  - 알록달록한 일반 이모지(🥺, 🔓, 🪙 등)의 사용을 **100% 금지(Strictly Forbidden)**한다.
  - 아이콘과 장식이 필요할 시 오직 **포커 카드 문양(`♠ ♦ ♥ ♣`)** 혹은 **미니멀 FUI 심볼(`▣, ◈, ⬢`)**만 네온 단색으로 렌더링하여 사용한다.
- **CcComms & Device Logs**:
  - 단순 SF 문구 대신 포커/해킹 OS 감성의 데이터 장식(`[POT_ODDS: 4:1]`, `[EV_CALC: +0.872]`, `HAND_HISTORY_SYNC`)을 오버레이로 배치한다.

---

## 5. 원저작자 도용 방지 및 오리지널 차별화 방안 (Anti-Copycat Protocol)
- **FUI 기호 및 텍스트 데이터의 테마 치환**:
  - `[POT_ODDS: 4:1 // EV_CALC: +0.872]`, `DECK_HEURISTICS_SYSTEM` 등 포커 통계 연산 데이터로 치환.
- **배색 체계의 다차원 분리 (CMY 3원색 분할)**:
  - Cyan(정보), Magenta(경고/제한), Yellow(조준/CTA) 3원색 분할.
