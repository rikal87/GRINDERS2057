Big Daddy는 영화 라운더스 KGB의 테디의 오마주 캐릭터입니다.
플레이어가 뱅크롤이 500,000 이상을 가지고 있을때,
맥스가 플레이어에게 Big Daddy를 소개시켜줍니다.(더 큰 스테이크 게임을 뛰기 위한 발판)
하지만 파트너인 플로렌스는 플레이어가 Big Daddy와 게임을 하는것을 반대합니다.

이후 플레이어가 만약 이 챌린지를 승락한다면, KBT 관계자가 몇일이 지난후 KBT리더인 Big Daddy 헤즈업 경기를 주선해줍니다.
만약 플레이어가 패배한다면, 프로렌스와의 관계도가 최악이 됩니다.(경고를 무시했기때문)
승리한다면, 플레이어와 프로렌스와의 관계도가 나빠지긴하지만, 크게 문제가 되진않습니다.

---

### 시스템 구현 방안 (기획 상세)

현재 게임에 구현된 `eventSystemMax.js`, `eventSystemFlorence.js`, `persona.js` 시스템을 활용하여 위 스토리를 구현하는 구체적인 방안입니다.

#### 1. 사전 빌드업 설계 (Bankroll 20만 ~ 30만 구간)
갑자기 50만 크레딧에 도달하여 Big Daddy와 만나는 것은 스토리적 몰입을 저해할 수 있습니다. 따라서 플레이어가 성장하는 과정에 서서히 위기감을 고조시킬 빌드업 이벤트를 배치합니다.

1. **소문 (Bankroll 20만 달성 - 맥스 이벤트)**:
   - "이봐 친구, 최근 KBT 조직이 뒷골목 판돈을 다 쓸어 담고 있다더군. 그 조직 보스가 'Big Daddy'라는데... 지난밤에 하이롤러 하나를 뼈까지 발라먹었다는 소문이야." (빅 대디의 잔혹성 암시)
2. **초대장 (Bankroll 30만 달성 - KBT 브로커 조우)**:
   - 플레이어의 판돈 규모가 커지자, KBT 소속 브로커가 은밀하게 접근합니다.
   - "네놈 이름이 요즘 테이블에서 자꾸 들리더군. 뒷골목 푼돈 줍는 건 이제 지겹지 않나? 진짜 '큰 판'에서 놀고 싶다면 50만 크레딧을 채워서 KBT 리더를 찾아와라. 그가 너의 배짱을 시험해 줄 테니."
3. **맥스의 호들갑과 플로렌스의 경고 (브로커 조우 직후)**:
   - **맥스**: 브로커의 제안을 전해 듣자마자 매우 흥분하며 말합니다. "와 썅! KBT 보스 대가리를 직접 딸 기회라고?! 당장 50만을 모아서 그 판에 치고 들어가자고!"
   - **플로렌스**: 맥스의 제안 직후 또는 동시에 경고를 보냅니다. "요즘 판을 꽤 크게 벌리시던데, 나무가 너무 빨리 자라면 벌목꾼의 눈에 가장 먼저 띄는 법이죠. 특히 KBT 같은 위험한 집단은 더더욱요. 그 초대에 절대 응하지 마세요."

#### 2. 메인 이벤트 흐름 설계
1. **조건 달성**: 플레이어의 `Bankroll >= 500,000`
2. **맥스의 호들갑 (Max Event)**: 맥스가 드디어 목표 금액이 모였다며 [새로운 큰 판(Big Daddy)]에 대해 언급하며 본격적인 스토리 시작.
3. **플로렌스의 최종 경고 (Florence Event)**: 맥스의 호들갑 직후, 플로렌스가 다시 한 번 Big Daddy의 위험성을 경고하며 절대 그 판에 끼지 말 것을 당부하는 메시지 발송.
4. **초대장 수락/거절 (Broker Event)**: 경고 직후, 브로커가 최종적으로 준비가 되었냐며 챌린지 수락 여부를 물어봄 (Mission 형태의 Accept/Refuse 버튼 제공).
5. **매치 주선 및 진행**: 수락 시 지정된 시간 예약 후 `zone.js`에 새로 추가된 `middle_kbt_vip_room` (LOCATION_ID.MIDDLE_KBT_VIP_ROOM) 장소로 헤즈업 게임 활성화.
6. **참가 결정에 따른 결과 처리**:
   - **미션 거절 시**: 플로렌스로부터 "현명한 선택"이라는 긍정적인 메시지 수신 (관계도 +50). 반면 맥스로부터 "쫄보 자식"이라며 실망한 듯한 메시지 수신 (관계도 -50).
   - **미션 수락 시**: 맥스로부터 "직접 텍사스 스타일을 보여주고 와라!"며 긍정적인 응원 메시지 수신 (관계도 +50). 반면 플로렌스로부터 "제 조언을 무시하다니 실망입니다"라는 우려 섞인 메시지 수신 (관계도 -100).
7. **매치 결과 처리 (Florence Event 연계)**:
   - **승리 시**: 플로렌스로부터 "경고를 무시한 건 불쾌하지만 수익과 실력은 인정하죠." 뉘앙스의 메시지 도착. 파트너 관계는 유지되나 관계도 소폭 하락 (예: -50).
   - **패배 시**: 플로렌스로부터 "통제 불능의 도박꾼과는 파트너를 할 수 없어요." 뉘앙스의 메시지 도착. 파트너 관계 즉시 파기 및 관계도 최악으로 설정 (`EVENT_FLORENCE.GONE` 이벤트 연계 유도).

#### 2. 파일별 구현 명세

**`persona.js` 설정안**
- 이미 `CLASSES_ENEMY`에 `kbt_leader` (Big Daddy)가 정의되어 있으므로, 텍스트 대사(PERSONALITIES 부분)에 테디 KGB 오마주 대사를 추가하여 개성을 살립니다.
  - `CHAT_TRIGGERS.WIN_HUGE`: "It hurts doesn't it? Your hopes dashed.", "Just like a young man coming in for a quickie."
  - `CHAT_TRIGGERS.LOSE_HUGE`: "Pay him. Pay that man his money."
  - `CHAT_TRIGGERS.ALL_IN`: "I will splash the pot whenever the fuck I please."
  - `CHAT_TRIGGERS.GAME_START`: "If you don't have my money then you are mine."

**`eventSystemMax.js` 추가 이벤트**
- `PRE_BUILD_UP_RUMOR_BIG_DADDY` (새로 추가):
  - 발동 조건: `getCurrentBankroll() >= 200000`
  - 내용: 맥스가 KBT 조직과 그 리더인 빅 대디의 악명 높은 행적(하룻밤 만에 거부를 거덜냈다는 소문 등)을 넌지시 언급하는 대화 이벤트.
- `PRE_BUILD_UP_KBT_BROKER_MEET` (새로 추가, KBT 브로커 대사):
  - 발동 조건: `getCurrentBankroll() >= 300000`
  - 내용: KBT 관련 브로커가 등잘하여 "큰 판에서 놀고 싶다면 50만 CR을 준비해 찾아와라"라고 운을 띄움.
- `PRE_BUILD_UP_MAX_EXCITED` (새로 추가):
  - 발동 조건: KBT 브로커 이벤트 조회 직후
  - 내용: 맥스가 이 사실을 듣고 엄청나게 흥분하며 당장 50만을 모아서 준비해보자며 플레이어를 부추김. (이 때 플로렌스가 경고 메시지 `PRE_BUILD_UP_WARN_KBT`를 발송하도록 스케줄 연계)
- `MAIN_STORY_3_0_INTRODUCE_BIG_DADDY` (기존 플랜 변경됨 -> 삭제 후 이벤트 `MAIN_STORY_3_1_CHALLENGE_KBT_LEADER`로 바로 통합 혹은 명칭 조정)
- `MAIN_STORY_3_1_CHALLENGE_KBT_LEADER` (새로 추가/상세화):
  - 내용: 브로커가 "준비되었냐"며 챌린지 참가(`MESSAGE_ACTION_TYPE.ACCEPT_INVITE`) 의사 묻기 제공.
  - 수락/거절 시: `ResolveType`에 따라 각각 맥스와 플로렌스의 후속 반응 이벤트 스케줄링.
  - 수락 이후: 장소 `LOCATION_ID` 할당 시 `zone.js`의 `middle_kbt_vip_room` 활용, 일정 시간 이후로 게임 예약 스케줄링.
- `MAIN_STORY_3_2_CHALLENGE_KBT_ACCEPT` (새로 추가):
  - 내용: 수락 시 맥스가 발송하는 응원 및 기대 메시지 (관계도 상승).
- `MAIN_STORY_3_2_CHALLENGE_KBT_REFUSE` (새로 추가):
  - 내용: 거절 시 맥스가 보내는 실망 섞인 푸념 메시지 (관계도 하락).

**`eventSystemFlorence.js` 추가 이벤트**
- `PRE_BUILD_UP_WARN_KBT` (새로 추가):
  - 발동 조건: 맥스의 `PRE_BUILD_UP_MAX_EXCITED` 이벤트 처리 후 발생
  - 내용: 플로렌스가 너무 과도한 판돈을 굴려 KBT의 눈에 띌까 우려되는 마음에 보내는 선제적 경고 메시지 ("벌목꾼의 눈에 띄려 하지 마세요... 그 초대에 응하지 마시길 바랍니다.").
- `MAIN_STORY_3_0_WARN_BIG_DADDY` (새로 추가):
  - 발동 조건: `getCurrentBankroll() >= 500000` 조건 달성시 맥스가 다시 참가 의사를 물어볼 때 함께 발생.
  - 내용: "진짜로 그 미치광이의 판에 뛰어들 생각이신가요? 통제 불가능한 리스크입니다. 당장 그만두세요." 식의 철저한 경고.
- `MAIN_STORY_3_2_CHALLENGE_KBT_ACCEPT_FLORENCE` (새로 추가):
  - 내용: 수락 시 발송. "결국 제 조언을 무시하셨군요. 당신의 리스크 관리에 깊은 우려를 표합니다." (관계도 대폭 하락).
- `MAIN_STORY_3_2_CHALLENGE_KBT_REFUSE_MAX` (새로추가):
  - 내용: 거절 시 발송. "야 이 쫄보 자식아!  뭐이런식으로 남자가 그릇이 작다라는 식의 뭐 대충 그런 말투, 하지만 크게 관계도가 하락하진 않음"
- `MAIN_STORY_3_2_CHALLENGE_KBT_REFUSE_FLORENCE` (새로 추가):
  - 내용: 거절 시 발송. "현명한 판단입니다. 우리는 통제 가능한 싸움에만 베팅하면 됩니다." (관계도 상승).
- `MAIN_STORY_3_2_BIG_DADDY_WIN` (새로 추가):
  - 발동 조건: Big Daddy와의 게임에서 플레이어가 승리하여 KBT 이벤트가 종료된 상황.
  - 내용: "당신의 무모함에 질렸지만... 실력과 자신감 하나만큼은 훌륭하네요. 이번 한 번만 넘어가겠어요."
  - 효과: `gainRelationship(PARTNER_ID.FLORENCE, -200)`
- `MAIN_STORY_3_2_BIG_DADDY_LOSE` (새로 추가):
  - 발동 조건: Big Daddy와의 게임에서 플레이어가 파산(패배)한 상황.
  - 내용: "제 경고를 그렇게 완전히 무시하다니... 당신은 통제 불가능한 리스크 그 자체입니다. 우리 비즈니스는 여기까지 하죠."
  - 효과: `gainRelationship(PARTNER_ID.FLORENCE, -999)` 및 `leavePartner` 등의 치명적인 불이익 부여.
