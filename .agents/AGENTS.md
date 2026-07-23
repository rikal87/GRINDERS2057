# 🤖 GRINDERS 2057 

본 문서는 GRINDERS 2057 프로젝트 개발에 따른 에이전트 행동 강령을 정의합니다.

---

## 1. 디자인 및 톤앤매너 규칙
- 모든 터미널 OS 서브페이지, 컴포넌트, 인게임 HUD 개발 시 반드시 **`cyberspace-os-standard` 스킬**의 비주얼 매뉴얼을 항시 로드하여 준수하십시오.
- **Round 금지(직각 강제)**, **CMY 3원색 배색 체계**, **Pretendard Std 900 타이포그래피**, **이모지 사용 100% 금지 및 포커 기호(♠♦♥♣) 치환** 규칙을 준수하십시오.
- 디자인 예시 레퍼런스 이미지는 [src/assets/design_reference/](file:///d:/github-repository/CyberPoker2077/src/assets/design_reference) (예: `타이포그래피활용예시1.png`, `타이포그래피활용예시2.png`)를 상시 참조하여 웅장한 가변 서체 및 FUI 배색 기조를 유지하십시오.
- 모든 서브 화면 설계의 뼈대는 `TerminalLobby.vue`와 `TerminalLayout.vue`를 기준으로 가져갑니다.
- 시스템 명칭은 **`GRINDERS 2057 Cyberspace OS`**로 통일하며, 비주얼 톤앤매너 및 레이아웃 기조의 영감 레퍼런스로 게임 Marathon을 참조합니다.

---

## 2. AI_LOG.md 기록 중단 및 문서 관리 지침 (Doc Policy)
- **`AI_LOG.md` 생성 및 실시간 갱신 금지**: 프로젝트 루트의 `AI_LOG.md` 파일은 폐기되었으며, 더 이상 로그 작성을 진행하지 않습니다. (글로벌 룰 오버라이드)
- **문서화 통합 일원화**: 모든 설계 결정, 아키텍처 변경, 구현 계획은 프로젝트 내 [`docs/`](file:///d:/github-repository/CyberPoker2077/docs) 디렉터리(`adrs/`, `plans/`, `specs/`, `reports/`, `governance/`) 및 [`docs/INDEX.md`](file:///d:/github-repository/CyberPoker2077/docs/INDEX.md) 지도를 통해서만 관리합니다.

---

## 3. 팩토리 패턴 하이드레이션 강제 헌장 (Factory Pattern Hydration Charter)
- **순수 멸균 객체 저장/복원 원칙**: `localStorage`, DB 저장 시에는 메서드/Getter가 제거된 pure raw 데이터만 직렬화(`JSON.stringify`)하여 저장합니다.
- **팩토리 함수 복원 연동 강제 (Factory Instantiation)**:
  - 데이터 복원/생성 시 단순 객체 할당(`Object.assign`)이나 TS interface 캐스팅을 금지하고, 반드시 팩토리 함수(`createPartner()`, `createCandidate()`, `hydratePartnerTraits()`)를 경유해야 합니다.
  - 팩토리 함수는 i18n getter (`get name()`, `get desc()`), 효과 콜백(`applyEffect`), 스탯 연산 수식 메서드를 온전히 바인딩하여 복원해야 합니다.
