---
id: SPEC-260724-turn-simulation-4d-luck-engine
title: GRINDERS 2057 턴 시뮬레이션 4D 스탯 & 럭 분산 엔진 사양서
status: active
related_specs: ["SPEC-260723-turn-interception-system", "SPEC-260724-matrix-log-stream-system"]
target_files: ["src/logic/zone.js", "src/logic/partnerSystem.js", "src/components/TableSearchPage.vue"]
---

# 💻 [SPEC] 턴 시뮬레이션 4D 스탯 & 럭 분산 엔진 사양서

본 문서는 **GRINDERS 2057** 프로젝트의 턴 마감 일일 손익 정산 시 **4D 스탯(`Skill`, `Guts`, `Mental`) 패시브 인컴 앵커**, **`REQ_SKILL` 카지노 스테이지 컷팅**, 및 **하루 200핸드 기준 포커 럭 분산(Luck Variance)** 연산의 정식 사양서입니다.

---

## 1. 4D 스탯 & REQ_SKILL 스테이지 난이도 매트릭스

| 카지노 스테이지 (Stage) | 요구 포커 기술 (`REQ_SKILL`) | 바이인 (Buy-in) | Big Blind (`bb`) | 스테이지 성격 |
| :--- | :--- | :--- | :--- | :--- |
| **01. Street Shop Backroom** | **SKILL 50+** | $1,000 CR | $10 CR | 길거리 비기너 판 |
| **02. Underground Pit** | **SKILL 60+** | $3,000 CR | $30 CR | 지하 도박장 판 |
| **03. Cyber Punk Lounge** | **SKILL 70+** | $8,000 CR | $80 CR | 레귤러 클럽 판 |
| **04. Dark Alley Club** | **SKILL 80+** | $15,000 CR | $150 CR | 암시장 베테랑 판 |
| **05. High Street Lounge** | **SKILL 88+** | $30,000 CR | $300 CR | 프로 롤러 VIP 판 |
| **06. High Grand Casino** | **SKILL 95+** | $50,000 CR | $500 CR | 전설 레전드 레이드 판 |

---

## 2. 하루 200핸드 포커 손익 연산 수식 (Poker Math Model)

1. **100핸드당 기본 기대 승률 (Base EV in bb/100)**:
   $$EV_{\text{base}} = (\text{Partner Skill} - \text{Stage ReqSkill}) \times 0.8 \quad (\text{bb/100})$$

2. **Guts & Mental 가중치 (Stat Modifiers)**:
   $$G_{\text{factor}} = 0.8 + \left(\frac{\text{Guts}}{250}\right) \quad (0.8 \sim 1.2 \text{배})$$
   $$M_{\text{penalty}} = \text{isTilting} ? -15.0 : 0.0 \quad (\text{bb/100 감산})$$

3. **하루 200핸드 포커 럭 분산 (Luck Variance $\Delta$)**:
   $$\text{Luck Variance} = \text{Random}(-35.0\text{ bb}, +45.0\text{ bb})$$

4. **최종 하루 턴 마감 PnL (CR) 연산**:
   $$\text{Daily PnL} = \left[ 2 \times \left( EV_{\text{base}} + M_{\text{penalty}} \right) \times G_{\text{factor}} + \text{Luck Variance} \right] \times \text{Zone BB}$$

---

## 3. UI/UX 거버넌스 규격

- 모호한 `OVR` 표기는 100% 원천 삭제한다.
- 카지노 아코디언 카드에 `REQ_SKILL: 70+` 네온 뱃지를 표기한다.
- 선수의 Skill이 미달할 경우 `⚠️ REQ_SKILL_UNMET (-15)` 네온 붉은 경고 뱃지를 출력한다.
