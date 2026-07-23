---
id: GOV-260723-css-design-system-charter
title: GRINDERS 2057 Cyberspace OS 디자인 시스템 및 CSS 거버넌스 헌장
status: active
related_specs: ["SPEC-MASTER-cyber-agency-manager"]
target_files: ["src/assets/css/theme-os.css", "src/assets/css/theme-components.css"]
---

# 📜 [GOVERNANCE] GRINDERS 2057 Cyberspace OS 디자인 시스템 & CSS 헌장

본 문서는 **GRINDERS 2057** 프로젝트의 프론트엔드 UI/UX 개발 시 스타일 파편화 및 폰트 혼선을 근본적으로 방지하고, Marathon 및 사이버펑크 디스토피아 느와르 톤앤매너를 일관되게 유지하기 위한 **글로벌 CSS 거버넌스 헌장(Design System Charter)**입니다.

---

## 1. 5대 핵심 CSS 거버넌스 원칙 (5 Core Principles)

### 제1조 [단일 진실 출처 원칙 (Single Source of Truth)]
- 모든 색상 토큰, 폰트 스택, 여백, 공통 UI 컴포넌트 클래스는 오직 [`src/assets/css/theme-os.css`](file:///d:/github-repository/CyberPoker2077/src/assets/css/theme-os.css) 및 [`src/assets/css/theme-components.css`](file:///d:/github-repository/CyberPoker2077/src/assets/css/theme-components.css)에서만 정의 및 관리한다.

### 제2조 [컴포넌트 내 Ad-hoc CSS 작성 전면 금지 (No Ad-hoc Styles Rule)]
- 개별 Vue 컴포넌트(`<style scoped>`) 내부에서 `font-family`, `color`, `background-color`, `border`를 임의로 수동 재정의(Ad-hoc)하는 행위를 **엄격히 금지(STRICTLY FORBIDDEN)**한다.
- Vue 컴포넌트는 오직 레이아웃 배치(`flex`, `grid`, `gap`, `margin`) 조절용 클래스만 작성하며, 비주얼 스타일은 100% 중앙 디자인 시스템 클래스를 상속받아 사용한다.

### 제3조 [폰트 스택 2대 단일화 헌장 (Dual Font Stack Charter)]
- 프로젝트의 모든 서체는 오직 아래 2가지 표준 폰트로만 렌더링되며, `Share Tech Mono` 등 기타 보조 서체 혼용을 100% 금지한다:
  1. **UI / 영문 / 수치 / 뱃지 / 버튼 / 텔레메트리**: 무조건 **`Orbitron`** 단독 1순위 상속.
  2. **한글 본문 / 선수 성향 / 서사 텍스트**: **`Pretendard Std 900`** 2순위 자동 폴백.
- 전역 최상위 폰트 스택 수식:
  ```css
  html, body, #app, *, button, input, select, textarea {
    font-family: 'Orbitron', 'Pretendard Std', -apple-system, sans-serif !important;
  }
  ```

### 제4조 [CMY 3원색 배색 및 라인 노이즈 방지 (Color & Border Noise Rules)]
- **3원색 전용 배색**:
  - `Cyan`: `#00F0FF` (정보, 수수료, 기본 UI)
  - `Yellow`: `#CCFF00` (강조, 바이인, 1급 메인 액션, OVR)
  - `Magenta`: `#FF005C` (위험, 블랙리스트, 채무, 경고)
  - `Background`: `#000000` / `#040608` (Pure Black base)
- **라인 노이즈(Border Noise) 방지**: 사방 박스 테두리(`border: 1px solid...`) 중복 지정을 엄금한다. 테두리 선 대신 **단색 면(Solid Fill Block)**과 **여백(Spacing)**으로 영역을 구별하고, 구분선은 오직 세션 간 얇은 구분선 1개만 허용한다.

### 제5조 [직각 강제 및 이모지 치환 원칙 (No Round & Emoji Rule)]
- 모든 UI 버튼, 카드, 입력창, 모달 팝업의 모서리는 **Round 금지 (직각 강제: `border-radius: 0px !important`)**.
- 유치한 모바일 이모지(😄, 🔥, 🚀, 💾, 📜, 🎁, 🪪, 💵, 💰 등) 사용을 **100% 엄격히 금지(STRICTLY FORBIDDEN)**한다.

### 제5.2조 [FUI 표준 이모지 치환 규격 표 (FUI Symbol Mapping Matrix)]
모바일 이모지가 누출되지 않도록 개발 시 아래 픽셀 수트 및 FUI 기호 매핑 표만 사용합니다:

| 기존 모바일 이모지 | 대체 FUI 표준 기호 / 픽셀 태그 | 용도 및 서식 예시 |
|---|---|---|
| 💾 (하드웨어/저장) | **`♣`** 또는 `[HW]` | `♣ HARDWARE` |
| 📜 (계약서/문서) | **`♦`** 또는 `[CTR]` | `♦ FINANCIAL_CONTRACTS` |
| 🎁 (선물/아이템) | **`♥`** 또는 `[GIFT]` | `♥ PARTNER_GIFTS` |
| 🪪 (키카드/신분증) | **`♠`** 또는 `[KEY]` | `♠ ACCESS_KEYCARDS` |
| 💵 / 💰 (돈/지불) | **`$`** 또는 `[CR]` | `[ $ BRIBE_DEALER ] ➔` |
| 🔒 (자물쇠/잠금) | **`[LOCKED]`** 또는 `[DENIED]` | `[LOCKED // REQ_UNMET]` |
| ➔ / ▲ / ▼ (화살표) | **`➔`**, **`▲`**, **`▼`** | `[ BUY_ITEM ] ➔` |


---

## 2. 중앙 공통 FUI 유틸리티 클래스 명세 (`theme-components.css`)

개발 시 Vue 컴포넌트에서 직접 가져다 써야 하는 표준 FUI UI 클래스 규격입니다:

| 클래스명 | 용도 및 비주얼 설명 |
|---|---|
| `.fui-hero-title` | 웅장한 메인 페이지 타이틀 (Orbitron 900, 4.5rem) |
| `.fui-symbol-string` | Marathon 스타일 FUI 특수 기호 엠블럼 데코레이터 (`+ IIIIIIII X ⦿ 28 93 ⨉`) |
| `.fui-accordion-item` | 1열 풀스크린 아코디언 카드 (선택 시 `#CCFF00` 솔리드 반전) |
| `.fui-target-btn` | 우측 사선 렌즈 액션 버튼 (`[ DEPLOY ] ➔`) |
| `.fui-spec-card` | 라인 노이즈가 제거된 시원한 단색 스탯 및 정보 박스 |
| `.fui-cctv-frame` | CCTV 감시 카메라 모니터 프레임 데코레이터 |

---

## 3. 거버넌스 준수 및 업데이트 절차

1. 신규 컴포넌트 추가 시 본 헌장의 CSS 변수 및 클래스 명세를 100% 준수해야 합니다.
2. 예외적 스타일이 필요한 경우 컴포넌트 내에 개별 작성하지 않고, 본 헌장에 안건을 올린 후 `theme-components.css`에 표준 클래스로 등록하여 사용합니다.

---

## 4. 헌장 보강: ITCSS 체계 및 BEM 네이밍 방법론 (Professional CSS Architecture)

전문 웹 프로젝트 및 하이엔드 디자인 시스템에서 스타일 충돌을 100% 방지하기 위해 채택하는 **ITCSS (Inverted Triangle CSS) 7단계 레이어 및 BEM 방법론 규격**입니다:

```text
┌───────────────────────────────────────────────────────────┐
│ [ITCSS 7-LAYER ARCHITECTURE]                              │
├───────────────────────────────────────────────────────────┤
│ 1. Settings   : :root 디자인 토큰 (--neon-cyan, font-stack) │
│ 2. Tools      : CSS Mixins & Keyframe Animations          │
│ 3. Generic    : Reset CSS & Box-sizing (* { box-sizing }) │
│ 4. Elements   : HTML 태그 기본 스타일 (button, input, h1)  │
│ 5. Objects    : 레이아웃 뼈대 (.fui-viewport, .fui-grid)  │
│ 6. Components : 독립 UI 블록 (.fui-accordion-item)        │
│ 7. Utilities   : 단일 유틸리티 (.font-orbitron, .glow-cyan) │
└───────────────────────────────────────────────────────────┘
```

### 4.1 BEM (Block Element Modifier) 네이밍 규격 강제
컴포넌트 클래스 작성 시 무질서한 클래스명 남발을 방지하기 위해 BEM 규칙을 강제합니다:
- **Block (독립 컴포넌트)**: `.fui-accordion-card`
- **Element (하위 구성 요소)**: `.fui-accordion-card__title`, `.fui-accordion-card__num`
- **Modifier (상태/변형)**: `.fui-accordion-card--active`, `.fui-accordion-card--blacklisted`

### 4.2 글로벌 트랜지션 & Easing 통일 규격
- 모든 UI의 호버/펼침 트랜지션 속도는 오직 아래 2가지 토큰으로 일괄 통일합니다:
  - **기본 빠른 반응**: `transition: all 0.2s ease-out;`
  - **시원한 브루탈리즘 감속**: `transition: all 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);`

---

## 5. 2대 표준 페이지 찍어내기 스캐폴드 템플릿 규격 (Page Scaffolding Templates)

신규 서브페이지(예: 다크웹 스폰서십, 암시장, 재활 센터) 개발 시 톤앤매너 붕괴 및 스타일 파편화를 막기 위해 아래 2대 표준 뼈대 템플릿을 복사하여 데이터만 바인딩합니다:

### 5.1 [유형 A] 1열 풀스크린 아코디언 템플릿 (`TableSearchPage.vue` 뼈대)
- **적용 대상**: 파트너 로스터, 암시장 상점, 스카우팅 시장, 퀘스트 목록 등 리스트/선택 기반 화면.
- **핵심 특징**: 1열 카드 클릭 시 `#CCFF00` 솔리드 반전 + 대형 비주얼 렌즈 배너 + 4D CRT 블록 바 + 사선 액션 버튼(`[ ACTION ] ➔`).

### 5.2 [유형 B] 격자형 매니지먼트 대시보드 템플릿 (`TerminalLobby.vue` 뼈대)
- **적용 대상**: 에이전시 로비, 모듈 덱 장착, 메신저 단말기, 자산 통계 라운지 등 관제/모듈 기반 화면.
- **핵심 특징**: 3~4열 대시보드 카드 그리드 + FUI 텔레메트리 모니터링 칩.

---

## 6. 제6조 [모바일-퍼스트 터치 UX 및 반응형 헌장 (Mobile-First Touch UX Charter)]

스마트폰, 태블릿, 데스크탑 등 모든 디바이스에서 최상의 조작감과 톤앤매너를 유지하기 위해 다음 3대 모바일 터치 UX 규칙을 강제합니다:

### 6.1 데스크탑 마우스 `:hover` 의존성 100% 금지
- 마우스 커서가 없는 터치 디바이스에서의 "Sticky Hover 버그(터치 후 색상 갇힘 현상)"를 100% 차단합니다.
- 마우스 호버 효과는 오직 `@media (hover: hover) and (pointer: fine)` 미디어 쿼리 내부로 래핑 격리하며, 호버 시에만 보이는 중요한 비주얼/렌즈 요소의 존재를 금지합니다. (기본 상태 30% 은은한 상시 노출 원칙)

### 6.2 모바일 순간 터치 피드백 (`:active` Instant Touch Flash) 필수화
- 모든 클릭/터치 가능 요소(`.instant-flash-btn`, `.target-lockon-btn`)에는 마우스 호버가 아닌 **손가락 터치 순간(`:active`) 찰나 반응**을 강제합니다:
  - `transform: scale(0.97)` (미세 누름 피드백)
  - `filter: brightness(1.3)` (네온 순간 발광 플래시)
  - `-webkit-tap-highlight-color: transparent` (모바일 사각형 파란 잔상 잔재 제거)

### 6.3 모바일 반응형 뷰포트 & 최소 터치 영역 보장 (Touch Target Size)
- 모든 조작 버튼 및 카드 터치 타겟은 최소 **44px × 44px 이상**의 쾌적한 터치 영역을 보장합니다.
- 모바일 해상도(`max-width: 768px`)에서는 다중 컬럼 패널을 지양하고, **1열 풀스크린 아코디언 (`fui-accordion-item`)** 방식으로 자동 전환되어 가로 스크롤 및 찌그러짐을 원천 차단합니다.



