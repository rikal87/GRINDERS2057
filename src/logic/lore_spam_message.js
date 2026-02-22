const lore_spam_message = [
  {
    "type": "SPAM",
    "sender": "Lucky_777 Bot",
    "title": "⚡ 100% 승률 보장! 화성행 티켓이 눈앞에!",
    "body": "아직도 운에 맡기십니까? 최신 AI 'DeepMind-Z' 해킹 툴이 상대의 패를 꿰뚫어 봅니다. 단돈 5,000 CR! 지금 바로 다운로드하세요! (보안 경고: NetWatch 추적을 피하려면 VPN 필수)",
    "probability": 0.03
  },
  {
    "type": "SPAM",
    "sender": "Prince of Nigeria (Legacy Virus)",
    "title": "[Help] 왕위 계승 자금 지원 요청",
    "body": "친애하는 친구여, 나는 나이지리아의 왕자입니다. 200년 전 냉동된 나의 조상이 깨어났습니다. 그의 계좌 동결을 풀기 위해 1,000 CR만 보내주시면 화성 이주권을 선물로 드리겠습니다.",
    "probability": 0.01
  },
  {
    "type": "SPAM",
    "sender": "Adult_Bot_XXX",
    "title": "♥ 외로운 밤, 위로가 필요하신가요?",
    "body": "최신형 안드로이드 'Pleasure-Model T-800' 대기 중. 다운타운 모텔 304호. 현금(CR)만 받습니다. *경고: 바이러스 감염 주의*",
    "probability": 0.05
  },
  {
    "type": "SPAM",
    "sender": "Unknown Sender",
    "title": "I KNOW WHAT YOU DID",
    "body": "지난 밤, 뒷골목 게임에서 네가 쓴 속임수... 내가 다 봤어. 신고 당하기 싫으면 입금해. 510392-102-4912 (10,000 CR)",
    "probability": 0.02
  },
  {
    "type": "LORE",
    "sender": "N54 News",
    "title": "[속보] 시냅스(Synapse) 주가 폭락, 왜?",
    "body": "오늘 아침 시냅스 본사 연구소에서 발생한 '생화학 유출 사고' 루머로 주가가 15% 급락했습니다. 사측은 단순한 시스템 오작동이라 해명했지만, 시민들의 불안은 커지고 있습니다.",
    "trigger_day": 3
  },
  {
    "type": "LORE",
    "sender": "N54 News",
    "title": "[사회] '배급(Rations)' 중단 사태 장기화",
    "body": "C구역 슬럼가의 기본소득 배급 시스템이 해킹으로 인해 3일째 마비되었습니다. 옴니 다이내믹스는 폭동 진압용 드론 'Peacemaker'를 해당 구역에 급파했습니다.",
    "trigger_day": 7
  },
  {
    "type": "LORE",
    "sender": "WNS Weather",
    "title": "[날씨] 강한 산성비 주의보",
    "body": "내일은 pH 3.5 수준의 강한 산성비가 내릴 예정입니다. 외출 시 반드시 보호 장비를 착용하시고, 노출된 피부나 크롬 부품은 즉시 중화제로 세척하십시오.",
    "trigger_day": 10
  },
  {
    "type": "LORE",
    "sender": "Synapse Corp PR",
    "title": "[캠페인] 감정은 통제될 때 아름답습니다.",
    "body": "불필요한 분노와 슬픔이 당신의 효율성을 떨어뜨리나요? 시냅스의 'Serenity' 감정 조절 모듈을 설치하세요. 언제나 평온한 멘탈이 승리의 지름길입니다.",
    "probability": 0.05
  },
  {
    "type": "SOCIAL",
    "sender": "A.Jones",
    "title": "쓸만한 '그라인더'를 찾고 있어",
    "body": "소문을 좀 들었네. 자네가 요즘 테이블에서 꽤 짭짤하게 챙긴다고? 내 클라이언트가 조용한 해결사를 원해. 관심 있으면 연락해. - A.Jones",
    "trigger_rep": 50
  },
  {
    "type": "SOCIAL",
    "sender": "Neon Rats Leader",
    "title": "쥐구멍에도 볕은 든다",
    "body": "다운타운 놈들이 우리 구역 물을 흐리고 있어. 네가 그쪽 카지노에 가서 본떼를 좀 보여줄 수 있나? 우리 정보원들이 놈들의 패 패턴을 좀 흘려줄 수도 있는데 말이야.",
    "trigger_zone": "low_neon_lounge"
  },
  {
    "type": "SOCIAL",
    "sender": "Circuit Breakers",
    "title": "기계 노예가 될 텐가?",
    "body": "네 몸에 박힌 그 크롬 덩어리들이 널 구원할 거라 믿나? 진정한 인간성은 육체에서 나온다. 시냅스 놈들의 서버를 태워버리는 날, 우리와 함께하자.",
    "trigger_augment": true
  },
  {
    "sender": "Zenith Financial",
    "title": "[독촉] 신용 등급 하락 경고",
    "body": "귀하의 최근 소득 신고 내역이 불투명합니다. 즉시 세금을 납부하지 않으면, 귀하의 계좌가 동결되고 모든 자산이 몰수될 수 있습니다. 이것은 마지막 경고입니다.",
    "trigger_tax_late": true
  },
  {
    "type": "LORE",
    "sender": "Unknown",
    "title": "...",
    "body": "01001000 01000101 01001100 01010000 00100000 01001101 01000101 (이 메시지는 자동으로 소멸됩니다)",
    "probability": 0.001
  },
  {
    "type": "LORE",
    "sender": "Future Self?",
    "title": "10년 전의 나에게",
    "body": "이봐, 2057년 10월 25일 저녁 8시. 퀸스 하이 플러시에 절대 올인하지 마. 그 판은 함정이야. 믿어. 난 이미 후회하고 있으니까.",
    "trigger_date": "2057-10-25"
  },
  {
    "type": "SPAM",
    "sender": "Loan_Shark_Bot",
    "title": "급전 필요하신가요? 무담보/무보증!",
    "body": "신용 등급 9등급도 OK! 장기 담보 대출 승인률 99.9%. 지금 바로 클릭하세요. (연이자 4000%, 신체 포기 각서 자동 서명됨)",
    "probability": 0.04
  },
  {
    "type": "SPAM",
    "sender": "Recall_Notice",
    "title": "[리콜] 옴니 다이내믹스 의수 결함 안내",
    "body": "귀하가 착용한 'Gorilla Arms MK.2' 모델에서 간헐적인 폭력성 제어 실패가 보고되었습니다. 가까운 정비소에서 펌웨어 업데이트를 받으십시오. *미조치 시 발생한 인명 피해에 대해 당사는 책임지지 않습니다.*",
    "probability": 0.02
  },
  {
    "type": "LORE",
    "sender": "Mars_Immigration_Bureau",
    "title": "[공지] 제 42차 화성 이주권 추첨 결과",
    "body": "금번 이주권 로또(Lotus Ticket) 당첨 번호를 안내해 드립니다. 1등: A-4929-X... (더 보기) *낙첨되신 분들은 지구에서 더 나은 삶을 개척하시길 바랍니다.*",
    "trigger_day": 15
  },
  {
    "type": "LORE",
    "sender": "Underground_Gossip",
    "title": "전설의 해커 'Alt'가 돌아왔다?",
    "body": "어제 새벽, 딥 웹의 올드 서버 하나가 털렸어. 남겨진 시그니처가 50년 전 그 전설이랑 똑같다던데... 기업 놈들 지금 비상 걸렸음. ㅋㅋ",
    "trigger_rep": 30
  },
  {
    "type": "SOCIAL",
    "sender": "Synapse_Recruiter",
    "title": "임상 실험 아르바이트 모집",
    "body": "신약 'Euphoria-X'의 베타 테스터를 모집합니다. 간단한 투약 후 포커를 치시면서 감정 변화만 기록하면 됩니다. 보수: 500 CR + 의료비 지원(필요 시).",
    "trigger_zone": "low_neon_lounge"
  },
  {
    "type": "SOCIAL",
    "sender": "The_Syndicate",
    "title": "경고장",
    "body": "우리 구역에서 장사하려면 상납금을 내야지? 이번엔 말로 하지만, 다음엔 네 놈의 그 예쁜 손가락을 가져가겠다. - The Knife",
    "trigger_win_big": true
  },
  {
    "type": "SOCIAL",
    "sender": "Mom",
    "title": "잘 지내니?",
    "body": "뉴스에서 또 폭동이 났다더라. 넌 괜찮은 거지? 배급표가 또 줄었어. 이번 달엔 약 보내주기 힘들 것 같아. 미안하다. 사랑한다 아들.",
    "trigger_day": 20
  },
  {
    "type": "SOCIAL",
    "sender": "Ex-Girlfriend",
    "title": "돈 갚아",
    "body": "너 내 크레딧 카드 들고 튄 지 벌써 1년이야. 화성 갈 거라고 큰소리치더니, 아직도 그 시궁창에서 도박이나 하고 있니? 당장 안 갚으면 경찰에 신고할거야.",
    "trigger_rep": 10
  },
  {
    "type": "SPAM",
    "sender": "Religious_Fanatic",
    "title": "종말이 다가옵니다!",
    "body": "기술은 악마의 유혹입니다! 당신의 눈, 팔, 심장을 기계로 바꾸고도 인간이라 할 수 있습니까? 순수함으로 돌아가십시오. '자연 회귀 교단'이 당신을 기다립니다.",
    "probability": 0.03
  },
  {
    "type": "LORE",
    "sender": "System_Admin",
    "title": "Debug Message",
    "body": "Error: NPC 'Fish_04' logic loop detected. Resetting behavior module... (이 메시지는 플레이어에게 보여지면 안 됩니다)",
    "probability": 0.0001
  },
  {
    "type": "SOCIAL",
    "sender": "PokerBuddy_Mike",
    "title": "야 어제 중계 봤냐?",
    "body": "와씨 그 올드 라이온(Old Lion) 할배 플레이 봤어? 리버에 2, 7 들고 블러핑 치는데 지리더라 ㅋㅋ 내 멘탈이었으면 벌써 나갔음.",
    "trigger_day": 5
  },
  {
    "type": "SOCIAL",
    "sender": "Gamble_Addict",
    "title": "오늘 다운타운 물 좋다",
    "body": "지금 네온 라운지에 피쉬(Fish)들 떼거지로 몰려옴. 빨리 와라. 자리 없을 수도 있음. 난 벌써 5만 크레딧 땡김 ㅋㅋ",
    "trigger_zone": "low_neon_lounge"
  },
  {
    "type": "SOCIAL",
    "sender": "Tilt_Master",
    "title": "아니 이게 말이 되냐고",
    "body": "AA 들고 프리플랍 올인 박았는데, 상대가 7, 2 들고 콜 받더니 풀하우스 띄움. 이거 게임 조작 아님? 고객센터 신고한다 ㅡㅡ",
    "trigger_loss": true
  },
  {
    "type": "SOCIAL",
    "sender": "Rich_Wannabe",
    "title": "화성 티켓 찌라시",
    "body": "야, 이번에 화성 이주권 암시장 시세 떴는데 10억 크레딧이라더라. 우리 같은 놈들은 평생 쳐도 못 가 ㅋㅋ 그냥 여기서 놀다 죽자.",
    "trigger_day": 10
  },
  {
    "type": "SOCIAL",
    "sender": "PokerBuddy_Sarah",
    "title": "너 어제 그 콜 뭐임?",
    "body": "리플레이 돌려봤는데, 거기서 3번째 넛으로 콜을 따? 미쳤냐 ㅋㅋ 너 혹시 상대 패 보이는 해킹 툴 쓰냐? 조심해라 밴 당한다.",
    "trigger_win_big": true
  },
  {
    "type": "SOCIAL",
    "sender": "Loan_Beggar",
    "title": "형님 제발 한 번만",
    "body": "진짜 딱 500 크레딧만 빌려주십쇼. 이번 판 느낌 진짜 좋습니다. 따면 바로 2배로 갚겠습니다. 저번에 빌린 건... 다음 주에 꼭...",
    "trigger_rep": 20
  },
  {
    "type": "SOCIAL",
    "sender": "Strategy_Nerd",
    "title": "요즘 메타 분석",
    "body": "요즘 그라인더들 죄다 GTO(Game Theory Optimal) 흉내 낸다고 난리네. 그래봤자 봇한테는 안 되는데 ㅋㅋ 우린 그냥 익스플로잇(Exploit)이나 파자.",
    "trigger_rep": 40
  },
  {
    "type": "SOCIAL",
    "sender": "Newbie_01",
    "title": "질문 좀요 ㅠㅠ",
    "body": "형님들, '팟 오즈(Pot Odds)'가 뭐예요? 이거 모르면 호구라던데... 족보 외우기도 힘들어 죽겠네요.",
    "trigger_level": 1
  },
  {
    "type": "SOCIAL",
    "sender": "Old_Timer",
    "title": "라떼는 말이야",
    "body": "옛날엔 패 까보면 다 뻥카였어. 요즘 애들은 너무 소심해. 레이즈를 못 쳐, 레이즈를. 낭만이 없어 낭만이.",
    "trigger_day": 30
  },
  {
    "type": "SOCIAL",
    "sender": "Anon_Hacker",
    "title": "[정보] 카지노 보안 허점",
    "body": "다운타운 구형 카지노, 밤 10시부터 11시 사이에 난수 생성기(RNG) 루틴이 단순해진다. 믿거나 말거나. 난 이미 한탕 하고 빠짐. ㅋ",
    "trigger_day": 44
  },
  {
    "type": "SOCIAL",
    "sender": "Drunk_Guy",
    "title": "야, 술이나 한잔해",
    "body": "돈 다 잃었다... 오늘따라 술맛이 쓰네. 너도 털렸냐? 리지스 바로 와라. 내가 산다. (거짓말임)",
  },
  {
    "type": "SOCIAL",
    "sender": "Fan_Club_Prez",
    "title": "샤크 사냥꾼 등장!",
    "body": "와 대박! 너 랭킹 게시판 떴어! 그 유명한 'Shark_01' 잡았다며? 사인 좀 해주라 ㅋㅋㅋ",
  },
  {
    "type": "SOCIAL",
    "sender": "Conspiracy_Theorist",
    "title": "이거 다 가짜야",
    "body": "우리가 진짜 카드를 치는 게 아니라, 시냅스 기업 놈들이 우리 뇌파 가지고 실험하는 거라니까? 너도 가끔 머리아프지 않냐?",
    "probability": 0.01
  },
  {
    "type": "SOCIAL",
    "sender": "Rage_Quitter",
    "title": "접는다 ㅂㅂ",
    "body": "이 망겜 안 함. 밸런스 꼬라지 봐라. 내일 다시 온다.",
  },
  {
    "type": "SOCIAL",
    "sender": "Lucky_Strike",
    "title": "오늘의 운세",
    "body": "오늘 행운의 숫자는 7, 그리고 J야. 잭팟 터질 느낌? 믿고 올인 박아보자고!",
  },
  {
    "type": "SOCIAL",
    "sender": "Bad_Beat_Bob",
    "title": "로그 깠다",
    "body": "방금 판 로그 보는데, 턴에 넛 플러시였던 놈이 리버에 풀하우스 된 거 실화냐? 확률 2%도 안 되는 걸 띄우네. 망겜 수준 ㅉㅉ",
  },
  {
    "type": "SOCIAL",
    "sender": "Crypto_Bro",
    "title": "VITECOIN 2057 떡상!",
    "body": "야, 내가 뭐랬냐? 비트코인 지금 50% 올랐다. 포커 접고 코인이나 해라. 아직 저점이다. 지금이라도 타라.",
    "trigger_day": 8
  },
  {
    "type": "SOCIAL",
    "sender": "GTO_Slave",
    "title": "솔버 결과 공유함",
    "body": "방금 그 상황 솔버(Solver) 돌려봤는데, 거기서 3벳은 실수(Blunder)임. 콜로 끊고 턴을 봤어야지. 공부 좀 해라.",
  },
  {
    "type": "SOCIAL",
    "sender": "Hustler_J",
    "title": "중고 칩 팝니다",
    "body": "급전 필요해서 1만 크레딧 칩 9000에 팝니다. 쿨거래 시 네온 라운지 입장권 덤으로 드림. 쪽지 주세요.",
    "trigger_zone": "low_neon_lounge"
  },
  {
    "type": "SOCIAL",
    "sender": "Paranoid_Pat",
    "title": "딜러 로봇 눈빛 봤냐?",
    "body": "아까 그 딜러 봇, 내가 패 쪼을 때 눈이 빨갛게 빛나던데? 내 패 스캔한 거 아님? 이따가 끝나고 뒷골목에서 확인해본다.",
    "probability": 0.02
  },
  {
    "type": "SOCIAL",
    "sender": "Tournament_Grinder",
    "title": "주말 토너먼트 파티 구함",
    "body": "이번 주말 '새터데이 나이트 피버' 토너먼트 지분 투자자 구합니다. ROI 20% 보장. 전적 검색 해보셈. 아이디: Ace_Killer",
    "trigger_day": 6
  },
  {
    "type": "SPAM",
    "sender": "Mars_Real_Estate",
    "title": "화성 돔(Dome) 입주권 특별 분양",
    "body": "지구에서의 삶이 지겨우신가요? 화성 '뉴 에덴' 돔의 쾌적한 공기를 마시며 여생을 보내세요. 지금 계약하시면 산소 발생기 무료 업그레이드!",
    "probability": 0.03
  },
  {
    "type": "SPAM",
    "sender": "Cyber_Church",
    "title": "당신의 영혼을 백업하십시오",
    "body": "육체는 썩어 문드러지지만, 데이터는 영원합니다. '이터널 클라우드(Eternal Cloud)' 장례 서비스. 당신의 의식을 서버에 업로드하세요.",
    "probability": 0.02
  },
  {
    "type": "SPAM",
    "sender": "Hot_Androids",
    "title": "근처에 외로운 안드로이드가 있습니다",
    "body": "당신의 1km 반경 내에 주인을 기다리는 안드로이드가 3기 있습니다. [프로필 보기] *성인 인증 필요*",
    "probability": 0.05
  },
  {
    "type": "SPAM",
    "sender": "Brain_Hack_Tool",
    "title": "상대의 생각을 읽고 싶나요?",
    "body": "최신형 '마인드 리더' 해킹 툴 불법 유출본! 상대의 동공 확장, 심박수 변화를 분석하여 블러핑을 99.9% 감지합니다. 다운로드 링크 -> click.here",
    "probability": 0.04
  },
  {
    "type": "LORE",
    "sender": "City_Admin",
    "title": "[공지] 통행 금지 시간 안내",
    "body": "최근 갱단 간의 총격전 빈발로 인해 다운타운 구역 통행 금지 시간이 변경되었습니다. 22:00 ~ 06:00 위반 시 즉결 처형될 수 있습니다.",
    "trigger_day": 18
  },
  {
    "type": "LORE",
    "sender": "WNS News",
    "title": "[경제] 물값 폭등, 시민들 반발",
    "body": "정수 플랜트 오염으로 인해 생수 가격이 전주 대비 300% 폭등했습니다. 시민들은 빗물 정수 필터를 구하기 위해 암시장으로 몰리고 있습니다.",
    "trigger_day": 25
  },
  {
    "type": "LORE",
    "sender": "Tech_Magazine",
    "title": "[리뷰] 맨티스 블레이드 vs 고릴라 암즈",
    "body": "근접 전투 최강자는 누구인가? 속도의 맨티스, 파괴력의 고릴라. 이번 호에서는 실제 갱단원들의 생생한 후기를 들어봅니다.",
    "probability": 0.03
  },
  {
    "type": "LORE",
    "sender": "Gossip_Girl_2077",
    "title": "유명 포커 프로 A씨, 사실은 AI?",
    "body": "최근 연승 행진을 달리는 프로 포커 플레이어 'X'가 사실은 완벽하게 위장된 안드로이드라는 소문이 돌고 있어. 밥 먹는 걸 본 사람이 아무도 없다는데?",
  },
  {
    "type": "SOCIAL",
    "sender": "Militech_HR",
    "title": "보안 요원 채용 (경력직)",
    "body": "신체 개조율 70% 이상, 전투 모듈 장착자 우대. 주요 업무: 기업 자산 보호 및 '불순분자' 제거. 연봉: 협의 가능 + 탄약 무제한 지급.",
    "trigger_augment": true
  },
  {
    "type": "SOCIAL",
    "sender": "Old_Friend",
    "title": "야, 살아있냐?",
    "body": "너 소식 끊긴 지 꽤 됐다? 죽은 줄 알고 장례식 치를 뻔했잖아. 이번에 크게 한탕 했다며? 술이나 한번 사라.",
    "trigger_win_big": true
  },
  {
    "type": "SOCIAL",
    "sender": "Landlord",
    "title": "[경고] 소음 공해 민원 접수",
    "body": "당신 방에서 밤마다 고성방가(비명?)가 들린다는 민원이 들어왔습니다. 한 번만 더 신고 들어오면 퇴실 조치합니다. *샷건 소리는 자제해주세요.*",
    "probability": 0.05
  },
  {
    "type": "SOCIAL",
    "sender": "Noob_Killer",
    "title": "뉴비들 귀엽네 ㅋㅋ",
    "body": "마이크로 스테이크(Micro Stakes) 양민 학살 꿀잼. 림프(Limp)하고 촙(Chop)하는 거 보면 암 걸릴 것 같은데 돈은 잘 벌림. 다들 얼른 와서 빨대 꽂으셈.",
    "trigger_zone": "micro_street_shop"
  },
  {
    "type": "SOCIAL",
    "sender": "Variance_Victim",
    "title": "다운스윙 20바이인 째...",
    "body": "나 진짜 포커 신한테 저주받았나 봐. AK가 AQ한테 10번 연속 넘어가네. 이게 확률적으로 말이 되냐? 뛰어내리고 싶다!!!",
    "trigger_loss": true
  },
  {
    "type": "SOCIAL",
    "sender": "Bluff_King",
    "title": "72o으로 쿼즈 띄움 ㅋㅋㅋ",
    "body": "상대 표정 썩는 거 봤어야 되는데. 이 맛에 포커 치지. 근데 다음 판에 AA 들고 넘어감 ㅠ",
    "probability": 0.05
  },
  {
    "type": "SOCIAL",
    "sender": "Table_Sheriff",
    "title": "매너 좀 챙겨라",
    "body": "야, 칩 던지는 놈 누구냐? 딜러 봇 인식 오류 난다고. 기본 예절은 좀 지키면서 게임하자.",
    "probability": 0.05
  },
  {
    "id": "SPAM_014",
    "type": "SPAM",
    "sender": "Organ_Dealer",
    "title": "신선한 신장 삽니다",
    "body": "A급 신장, 간, 안구 최고가 매입. 수술비 무료, 1시간 내 입금. 급전 필요하신 분 연락주세요. (비밀 보장)",
    "probability": 0.03
  },
  {
    "type": "SPAM",
    "sender": "Fake_Police",
    "title": "[출석 요구서] 귀하는 도박법 위반 혐의로...",
    "body": "신고가 접수되었습니다. 24시간 내에 아래 링크로 벌금을 납부하지 않으면 체포 영장이 발부됩니다. [납부하기 (바이러스 포함)]",
    "probability": 0.02
  },
  {
    "type": "LORE",
    "sender": "History_Channel",
    "title": "오늘의 역사: 2020년 팬데믹",
    "body": "오늘은 2020년 대유행의 시작일로부터 37년째 되는 날입니다. 그때는 마스크만 쓰면 살 수 있었죠. 지금은 방독면이 없으면 5분도 못 버티는데 말입니다.",
    "trigger_day": 40
  },
  {
    "type": "SOCIAL",
    "sender": "Coffee_Addict",
    "title": "카페인 수혈 시급",
    "body": "24시간째 그라인딩 중. 에너지 드링크 추천 좀 해줘. '블루베어' 먹었다가 심장 터질 뻔함.",
    "probability": 0.1
  },
  {
    "type": "SOCIAL",
    "sender": "Pattern_Analyst",
    "title": "Fish_03 얘 봇 아님?",
    "body": "배팅 사이즈가 너무 일정한데? 프리플랍 2.5BB 오픈, 림프엔 4BB 레이즈. 딱 봐도 매크로 돌리는 봇이다. 운영자 뭐하냐?",
    "trigger_zone": "micro_warehouse"
  },
  {
    "type": "SOCIAL",
    "sender": "Pro_Watcher",
    "title": "와, 네임드 프로 봤음",
    "body": "High Stakes 테이블 관전하는데 'Isildur_Clone' 있더라. 칩 스택이 내 전재산의 100배임 ㄷㄷ 숨만 쉬어도 돈 벌겠네 부럽다.",
    "trigger_rep": 50
  },
  {
    "type": "SOCIAL",
    "sender": "Rake_Hater",
    "title": "레이크 실화냐?",
    "body": "카지노 놈들 레이크(Rake) 10% 떼가는 거 너무한 거 아님? 우리가 호구도 아니고... 이래서 다들 불법 하우스 가나 봄.",
    "probability": 0.05
  },
  {
    "type": "SOCIAL",
    "sender": "Late_Reg_King",
    "title": "토너먼트 레이트 레지 됨?",
    "body": "지금 일어났는데 토너 참가 가능? 블라인드 이미 많이 올랐으려나. 에라 모르겠다 숏스택 운영 간다.",
    "probability": 0.05
  },
  {
    "type": "LORE",
    "sender": "Developer",
    "title": "Hello World",
    "body": "System.out.println(\"이 메시지를 발견하다니 운이 좋군요.\"); // TODO: 여기에 히든 보상 추가하기",
    "probability": 0.0001
  },
  {
    "type": "SPAM",
    "sender": "Time_Traveler",
    "title": "미래에서 왔습니다",
    "body": "저는 2077년에서 왔습니다. 내일 모레 시냅스 주식 사세요. 100배 오릅니다. 수수료는 나중에 10%만 주시면 됩니다.",
    "probability": 0.01
  },
  {
    "type": "SOCIAL",
    "sender": "Bad_Beat_Barry",
    "title": "리버 억까 레전드",
    "body": "플랍 셋(Set)이었는데 리버에 상대 원카드 스트레이트 완성됨. 키보드 부셨다. 추천 키보드 받는다...",
    "trigger_loss": true
  },
  {
    "type": "SOCIAL",
    "sender": "Happy_Grinder",
    "title": "오늘 일당 벌었다",
    "body": "3시간 쳐서 20,000 크레딧 멘징함. 오늘 저녁은 합성 영양 죽 말고 진짜 고기 먹으러 간다. 부럽냐? ㅋㅋ",
    "trigger_win_big": true
  },
  {
    "type": "SOCIAL",
    "sender": "Lounge_Rat",
    "title": "오르빗 라운지 썰 푼다",
    "body": "아는 형이 오르빗 라운지 웨이터로 일하는데, 거기선 팁으로 1,000,000 크레딧 칩 던져준대. 우리도 언젠간 갈 수 있겠지?",
    "trigger_rep": 80
  },
  {
    "type": "SOCIAL",
    "sender": "Fold_Master",
    "title": "포커는 인내심이다",
    "body": "1시간 동안 패 안 들어와서 폴드만 함. 블라인드 때문에 칩 다 녹겠다. 언제까지 참아야 하냐...",
    "probability": 0.1
  },
  {
    "type": "SOCIAL",
    "sender": "Shark_Bait",
    "title": "형들 나 호구임?",
    "body": "방금 판 상대가 첵-레이즈 하길래 올인 박았는데 넛(Nut) 들고 있었네... 이거 뻔한 패턴이었음? ㅠㅠ",
    "probability": 0.05
  },
  {
    "type": "SOCIAL",
    "sender": "City_Drifter",
    "title": "비 온다",
    "body": "산성비 오지게 오네. 오늘은 그냥 집에서 온라인 포커나 쳐야겠다. 너네도 괜히 나갔다가 피부 녹지 마라.",
    "trigger_day": 10
  },
  {
    "type": "LORE",
    "sender": "Synapse_HR",
    "title": "[의무] 직원 행복도 조사",
    "body": "모든 시민은 의무적으로 월 1회 행복도 조사를 받아야 합니다. 당신의 행복 수치가 50 미만일 경우, 강제 심리 치료가 진행될 수 있습니다. *웃으세요. 시냅스가 지켜보고 있습니다.*",
    "probability": 0.05
  },
  {
    "type": "SOCIAL",
    "sender": "Slow_Roll_Hater",
    "title": "슬로우 롤(Slow Roll) 하는 새끼들",
    "body": "아니 넛 들고 왜 고민하는 척함? 시간 끄는 거 비매너 아님? 진짜 손가락 잘라버리고 싶네.",
    "trigger_loss": true
  },
  {
    "type": "SOCIAL",
    "sender": "High_Roller_Wannabe",
    "title": "나도 마바리 탈출한다",
    "body": "오늘 잭팟 터져서 시드머니 10배 불림. 이제 마이크로 스테이크 졸업하고 로우(Low) 간다. 가서 털리고 다시 올게 ㅋㅋ",
    "trigger_win_big": true
  },
  {
    "type": "SPAM",
    "sender": "Pet_Clone_Service",
    "title": "죽은 강아지를 다시 만나세요",
    "body": "당신의 소중한 반려동물, 클로닝 기술로 완벽하게 복원해 드립니다. 기억 이식 옵션 포함. 지금 예약 시 털 색상 변경 무료.",
    "probability": 0.02
  },
  {
    "type": "SOCIAL",
    "sender": "NetWatch_Agent",
    "title": "[경고] 불법 맥주소 탐지됨",
    "body": "귀하의 접속 로그에서 인가되지 않은 VPN 사용 흔적이 발견되었습니다. 즉시 중단하지 않을 경우, 접속 차단 및 위치 추적이 개시됩니다.",
    "probability": 0.01
  },
  {
    "type": "SOCIAL",
    "sender": "Blind_Stealer",
    "title": "블라인드 스틸 개꿀",
    "body": "버튼(Button)에서 아무거나 들고 레이즈하면 다 죽네 ㅋㅋㅋ 니들 패 안 보고 치지? 오늘도 공짜 밥 먹고 갑니다~",
    "trigger_win_big": true
  },
  {
    "type": "SOCIAL",
    "sender": "River_Rat",
    "title": "리버는 나의 편",
    "body": "플랍, 턴 다 지고 있었는데 리버에 역전함. 역시 포커는 운빨망겜(운 실력 게임)이다. 꼬우면 니들도 기도해라.",
    "trigger_win_big": true
  },
  {
    "type": "LORE",
    "sender": "Space_Tour_Agency",
    "title": "달 기지 관광 패키지",
    "body": "지구의 중력에서 벗어나세요! 3박 4일 달 기지 투어 특가 세일. *우주복 대여료 별도*",
    "probability": 0.03
  },
  {
    "type": "SOCIAL",
    "sender": "Bot_Hunter",
    "title": "봇 구분법 알려줌",
    "body": "1. 채팅 안 침 2. 벳 사이즈가 기계적임 3. 틸트(Tilt)가 없음 근데 3번은 나도 해당 안 되네... 젠장.",
    "trigger_level": 5
  },
  {
    "type": "LORE",
    "sender": "Red_Pill",
    "title": "진실을 원해?",
    "body": "만약 이 모든 게 시뮬레이션이라면? 네가 낀 썬글라스... 아니 VR 고글을 벗어봐. 현실은 훨씬 더 시궁창일 테니까.",
    "probability": 0.001
  }
]
export const getRndLoreSpamMessage = () => {
  const rndIndex = Math.round(Math.random() * lore_spam_message.length);
  // let cumulativeProb = 0;
  // for (const msg of lore_spam_message) {
  //   cumulativeProb += msg.probability;
  //   if (rnd < cumulativeProb) {
  //     return msg;
  //   }
  // }
  return lore_spam_message[rndIndex];
}