# SafeHouse 기능 풀스크린 OS 페이지 이관 구현 계획서

## 1. 개요
기존 `SafeHouse.vue` 및 어설픈 모달 팝업으로 분산되어 있던 **파트너 관리, 모듈 장착, 메시지함** 기능을 `TerminalLobby.vue` 메인 터미널 OS 메뉴에서 접근 가능한 **독립 풀스크린 터미널 서브페이지**로 완전히 이관 및 구축합니다.

---

## 2. 세부 변경 및 신규 서브페이지 구축 (Proposed Changes)

### 1) [NEW] 파트너 관리 OS 페이지 (`src/components/PartnerNetPage.vue`)
- **역할**: 파트너와의 관계도, 올리브 나뭇가지 선물, 파트너 특수 혜택 및 미션을 관리하는 독창적 CMY 풀스크린 OS 화면.
- **라우팅 ID**: `currentView === 'partner_net'`

### 2) [NEW] 모듈 장착 & 덱 관리 OS 페이지 (`src/components/ModuleDeckPage.vue`)
- **역할**: 암시장에서 구매하거나 해금한 에이전트 모듈들을 덱 슬롯에 장착/해제하고 조합 시너지를 확인하는 덱 빌딩 OS 화면.
- **라우팅 ID**: `currentView === 'module_deck'`

### 3) [NEW] 암호화 통신 메신저 OS 페이지 (`src/components/CommsInboxPage.vue`)
- **역할**: 기존 답답했던 모달 팝업을 완전 폐기하고, 딜러/하우스 보안관/파트너와의 교신 메시지를 세로형 터미널 통신망 로그 형태로 읽고 응답하는 풀스크린 메신저 OS 화면.
- **라우팅 ID**: `currentView === 'comms_inbox'`

### 4) [MODIFY] 메인 로비 터미널 메뉴 업데이트 (`src/components/TerminalLobby.vue` & `src/App.vue`)
- `TerminalLobby.vue` 메뉴 리스트에 **`04 // PARTNERS_NET`**, **`05 // MODULE_DECK`**, **`06 // COMMS_INBOX`** 카드 주입 및 클릭 이벤트 바인딩.
- `App.vue`에 신규 서브페이지 조건부 렌더링 분기 연동.

---

## 3. 검증 계획 (Verification Plan)
- **Vite Build Verification**: `npm run build` 통과 검증.
- **UI & 톤앤매너 검증**: `cyberspace-os-standard` 스킬 규격(직각 0px, CMY 배색, 포커 FUI 오버레이) 준수 여부 확인.
