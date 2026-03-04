import imgMicroStreetShop from '../assets/image/zone/micro_street_shop.jpg';
import imgMicroWarehouse from '../assets/image/zone/micro_warehouse.png';
import imgMicroUndergroundBar from '../assets/image/zone/micro_underground_bar.png';
import imgLowNeonLounge from '../assets/image/zone/low_neon_lounge.png';
import imgLowUndergroundClub from '../assets/image/zone/low_underground_club.png';
import imgLowOldCasino from '../assets/image/zone/low_old_casino.png';
import imgMiddleUndergroundCasino from '../assets/image/zone/middle_underground_casino.png';
import imgMiddleHoldemHouse from '../assets/image/zone/middle_holdem_house.png';
import imgMiddleCasinoHotel from '../assets/image/zone/middle_casino_hotel.png';
import imgHighProHouse from '../assets/image/zone/high_pro_house.png'; // Used for Royal Private Cardroom
import imgHighGrandCasino from '../assets/image/zone/high_grand_casino.png';
import imgSpecialOrbitLounge from '../assets/image/zone/special_orbit_lounge.png';
import { TRACK_ENUM } from './audioTracks.js';
import { store } from './store.js';

export const LOCATION_ID = {
  "FREE_SAFE_HOUSE": "free_safe_house",
  "FREE_STREET_SHOP_WITH_MAX": "free_street_shop_with_max",
  "LOW_NEON_LOUNGE": "low_neon_lounge",
  "LOW_UNDERGROUND_CLUB": "low_underground_club",
  "LOW_OLD_CASINO": "low_old_casino",
  "MIDDLE_UNDERGROUND_CASINO": "middle_underground_casino",
  "MIDDLE_HOLDEM_HOUSE": "middle_holdem_house",
  "MIDDLE_CASINO_HOTEL": "middle_casino_hotel",
  "HIGH_PRO_HOUSE": "high_pro_house",
  "HIGH_GRAND_CASINO": "high_grand_casino",
  "SPECIAL_ORBIT_LOUNGE": "special_orbit_lounge",
  "MICRO_WAREHOUSE_WITH_MAX": "micro_warehouse_with_max",
  "LOW_UNDERGROUND_CLUB_MEET_MAX": "low_underground_club_meet_max",
  "FREE_SAFE_HOUSE": 'free_safe_house',
  "MIDDLE_KBT_BASE": "middle_kbt_base",
}

export const zones = [
  {
    "id": "free",
    "name_ko": "Free Stakes",
    "name_en": "Free Stakes",
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    "description_ko": "게임의 첫 여정의 시작점.",
    "description_en": "The starting point of your first journey in the game.",
    get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
    "locations": [
      {
        "id": "free_safe_house",
        "name_ko": "안전가옥",
        "name_en": "Safe House",
        get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
        "imgSrc": null,
        "description_ko": "안전가옥으로 친구들을 초대하였습니다.",
        "description_en": "Invited friends to the safe house.",
        get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
        "atmosphere": "다소 어두움, 가벼운 분위기, 가끔 절박함",
        "requirements": null,
        "isHidden": true,
        "level": 1,
        "npcs": [
          "Fish",
          "Broke",
          "MR_CALL"
        ],
        "tables": {
          buyInLimit: 1,
          amount: 2000, amount_fmt: '2K', amount_min_fmt: '1K', sb: 10, bb: 20, available: [
            6
          ], baseRake: 0.0, rakeCap: 0
        },
        "theme": {
          "background": "radial-gradient(circle, #2c2c2c 0%, #1a1a1a 100%)",
          "borderColor": "#3f6ae2ff",
          "boxShadow": "0 0 20px rgba(146, 148, 255, 0.8)"
        },
        'bgMusic': [TRACK_ENUM.BGM_Kinetic, TRACK_ENUM.VelvetShadows, TRACK_ENUM.Nightscape, TRACK_ENUM.DreamVector]
      },
      {
        "id": "free_street_shop",
        "name_ko": "길거리 상점 뒷편",
        "name_en": "Street Shop Backroom",
        get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
        "imgSrc": imgMicroStreetShop,
        "description_ko": "낮게 깔린 네온사인 불빛이 비치는 좁은 골목, 셔터가 반쯤 내려간 구멍가게 안쪽에 급히 마련된 접이식 테이블로 지인들과 소소한 재미를 위해 모인 곳.",
        "description_en": "A narrow alley illuminated by low neon signs, a folding table hastily set up inside a corner shop with half-lowered shutters, a place to gather with acquaintances for some minor fun.",
        get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
        "atmosphere": "어두움, 가벼운 분위기, 가끔 절박함",
        "requirements": null,
        "level": 1,
        "npcs": [
          "Fish",
          "Broke"
        ],
        "tables": {
          amount: 1000, amount_fmt: '1K', amount_min_fmt: '500', sb: 5, bb: 10, available: [
            6,
            9
          ], baseRake: 0.00, rakeCap: 50
        },
        "theme": {
          "background": "radial-gradient(circle, #2c2c2c 0%, #1a1a1a 100%)",
          "borderColor": "#555",
          "boxShadow": "0 0 20px rgba(0,0,0,0.8)"
        },
        'bgMusic': [TRACK_ENUM.Nightscape, TRACK_ENUM.Placebo]
      },
      {
        "id": "free_street_shop_with_max",
        "name_ko": "길거리 상점 뒷편",
        "name_en": "Street Shop Backroom",
        get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
        "imgSrc": imgMicroStreetShop,
        "isHidden": true,
        "description_ko": "맥스가 포커를 가르쳐주겠다고 제안했습니다.",
        "description_en": "Max offered to teach you how to play poker.",
        get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
        "atmosphere": "어두움, 가벼운 분위기, 가끔 절박함",
        "requirements": null,
        "level": 1,
        guests: ['Max(Mentor)'],
        "npcs": [
          "Fish"
        ],
        "tables": {
          buyInLimit: 1,
          amount: 1000, amount_fmt: '1K', amount_min_fmt: '500', sb: 5, bb: 10, available: [
            6,
            9
          ], baseRake: 0.00, rakeCap: 50
        },
        "theme": {
          "background": "radial-gradient(circle, #2c2c2c 0%, #1a1a1a 100%)",
          "borderColor": "#555",
          "boxShadow": "0 0 20px rgba(0,0,0,0.8)"
        },
        'bgMusic': [TRACK_ENUM.Nightscape, TRACK_ENUM.Placebo]
      }
    ]
  },
  {
    "id": "micro",
    "name_ko": "Micro Stakes",
    "name_en": "Micro Stakes",
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    "description_ko": "단순 오락거리를 위해 찾는 곳. 돈을 잃어도 타격이 적어 무모한 플레이가 빈번하지만, 가끔 절박한 플레이어도 존재.",
    "description_en": "A place visited for simple entertainment. Since losing money doesn't hurt much, reckless play is frequent, but occasionally desperate players also exist.",
    get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
    "locations": [
      {
        "id": "micro_warehouse_with_max",
        "name_ko": "뒷골목 창고(맥스와 함께)",
        "name_en": "Back Alley Warehouse(with Max)",
        get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
        "imgSrc": imgMicroWarehouse,
        "description_ko": "맥스와 함께 뒷골목 창고를 방문하였습니다.",
        "description_en": "Visited the back alley warehouse with Max.",
        get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
        "requirements": null,
        "isHidden": true,
        "firstClearRewards": "underground_bar_invite",
        "level": 2,
        "npcs": [
          "Fish",
          "Broke",
        ],
        guests: ['Max'],
        "tables": {
          amount: 2500, amount_fmt: '2.5K', amount_min_fmt: '1.25K', sb: 10, bb: 25, available: [6, 9], baseRake: 0.08, rakeCap: 125
        },
        "theme": {
          "background": "radial-gradient(circle, #2a2a2a 0%, #0f0f0f 100%)",
          "borderColor": "#8B4513",
          "boxShadow": "0 0 20px rgba(139, 69, 19, 0.3)"
        },
        'bgMusic': [TRACK_ENUM.Nightscape, TRACK_ENUM.Placebo]
      },
      {
        "id": "micro_warehouse",
        "name_ko": "뒷골목 창고",
        "name_en": "Back Alley Warehouse",
        get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
        "imgSrc": imgMicroWarehouse,
        "description_ko": "버려진 건물의 지하 저장고를 무단 점거하여 운영되는 불법 도박장. 주로 인근 하층민들이나 자극을 찾는 부랑자들이 자주 찾는 곳.",
        "description_en": "An illegal gambling den operated by squatting in the underground cellar of an abandoned building. Mainly visited by the local lower class or vagrants seeking stimulation.",
        get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
        "requirements": null,
        "firstClearRewards": ["underground_bar_invite"],
        "level": 2,
        "npcs": [
          "Fish",
          "Broke",
        ],
        "tables": {
          amount: 2500, amount_fmt: '2.5K', amount_min_fmt: '1.25K', sb: 10, bb: 25, available: [6, 9], baseRake: 0.08, rakeCap: 125
        },
        "theme": {
          "background": "radial-gradient(circle, #2a2a2a 0%, #0f0f0f 100%)",
          "borderColor": "#8B4513",
          "boxShadow": "0 0 20px rgba(139, 69, 19, 0.3)"
        },
        'bgMusic': [TRACK_ENUM.Nightscape, TRACK_ENUM.Placebo]
      },
      {
        "id": "micro_underground_bar",
        "name_ko": "지하 바",
        "name_en": "Underground Bar",
        get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
        "imgSrc": imgMicroUndergroundBar,
        "description_ko": "겉으로는 평범한 술집처럼 보이지만, 단골들만 아는 암호를 대야 입장할 수 있는 비밀 아지트. 비교적 적은 판돈으로도 전략을 시험해보고 싶은 이들이 주로 찾는 곳.",
        "description_en": "Looks like an ordinary bar on the outside, but it's a secret hideout that requires a password known only to regulars to enter. Mostly visited by those who want to test their strategies even with relatively small stakes.",
        get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
        "level": 3,
        "requirements": "underground_bar_invite",
        "npcs": [
          "Fish",
          "Nit",
          "Gambler"
        ],
        "tables": {
          amount: 5000, amount_fmt: '5K', amount_min_fmt: '2.5K', sb: 25, bb: 50, available: [6, 9], baseRake: 0.06, rakeCap: 250
        },
        "theme": {
          "background": "radial-gradient(circle, #1a0b2e 0%, #0d001a 100%)",
          "borderColor": "#9d00ff",
          "boxShadow": "0 0 25px rgba(157, 0, 255, 0.4)"
        },
        'bgMusic': [TRACK_ENUM.MalibuMoon]
      }
    ]
  },
  {
    "id": "low",
    "name_ko": "Low Stakes",
    "name_en": "Low Stakes",
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    "description_ko": "본격적으로 포커를 업으로 삼기 시작하는 단계. 실력이 드러나며 다양한 직업군과 성향이 혼재.",
    "description_en": "The stage where you start taking poker seriously as a profession. Skills begin to show, and a mix of various professions and tendencies exists.",
    get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
    "locations": [
      {
        "id": "low_neon_lounge",
        "name_ko": "네온 라운지",
        "name_en": "Neon Lounge",
        get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
        "imgSrc": imgLowNeonLounge,
        "description_ko": "트렌드에 민감한 청년들이 퇴근 후 가볍게 한잔하며 즐기는 장소.",
        "description_en": "A place where trend-sensitive youth enjoy a light drink after work.",
        get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
        "atmosphere": "세련됨, 차분함, 도시적",
        "requirements": null,
        "level": 4,
        "firstClearRewards": "club_membership",
        "npcs": [
          "Fish",
          "MR_CALL",
          "Gambler",
          "Nit"
        ],
        "tables": { amount: 10000, amount_fmt: '10K', amount_min_fmt: '5K', sb: 50, bb: 100, available: [6, 9], baseRake: 0.07, rakeCap: 500 },
        "theme": {
          "background": "radial-gradient(circle, #001a1a 0%, #000d0d 100%)",
          "borderColor": "#00f0ff",
          "boxShadow": "0 0 30px rgba(0, 240, 255, 0.5)"
        },
        'bgMusic': [TRACK_ENUM.Dystopia, TRACK_ENUM.BeThere, TRACK_ENUM.Overnight]
      },
      {
        "id": "low_underground_club_meet_max",
        "name_ko": "H.B.D 클럽",
        "name_en": "H.B.D Club",
        get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
        "imgSrc": imgLowUndergroundClub,
        "description_ko": "말로만 듣던 부자들이 VIP 룸에서 포커를 치고 있다.",
        "description_en": "Playing poker with the rich guys you've only heard about.",
        get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
        "atmosphere": "시끄러움, 혼란스러움, 들뜸",
        "requirements": null,
        isHidden: true,
        "level": 5,
        "npcs": [
          "Rich_Guy"
        ],
        guests: ['Max', 'An_Unknown_Woman'],
        "tables": {
          buyInLimit: 1,
          amount: 25000, amount_fmt: '25K', amount_min_fmt: '12.5K', sb: 125, bb: 250, available: [6, 9], baseRake: 0.06, rakeCap: 1000
        },
        "theme": {
          "background": "radial-gradient(circle, #2e001f 0%, #1a0011 100%)",
          "borderColor": "#ff0080",
          "boxShadow": "0 0 30px rgba(255, 0, 128, 0.6)"
        },
        'bgMusic': [TRACK_ENUM.HearTheBass]
      },
      {
        "id": "low_underground_club",
        "name_ko": "H.B.D 클럽",
        "name_en": "H.B.D Club",
        get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
        "imgSrc": imgLowUndergroundClub,
        "description_ko": "시끄러운 음악과 화려한 조명 속에서 이성과 판단력이 마비되기 쉬운 곳. 클럽 구석의 VIP 부스에서 진행되는 게임.",
        "description_en": "A place where reason and judgment can easily be paralyzed amidst loud music and flashy lights. A game played in a VIP booth in the corner of the club.",
        get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
        "atmosphere": "시끄러움, 혼란스러움, 들뜸",
        "requirements": "club_membership",
        "level": 5,
        "npcs": [
          "Rich_Guy",
          "Maniac",
          "Gambler",
          "Gangster"
        ],
        "tables": { amount: 25000, amount_fmt: '25K', amount_min_fmt: '12.5K', sb: 100, bb: 250, available: [6, 9], baseRake: 0.06, rakeCap: 1000 },
        "theme": {
          "background": "radial-gradient(circle, #2e001f 0%, #1a0011 100%)",
          "borderColor": "#ff0080",
          "boxShadow": "0 0 30px rgba(255, 0, 128, 0.6)"
        },
        'bgMusic': [TRACK_ENUM.DreamVector, TRACK_ENUM.VelvetShadows]
      },
      {
        "id": "low_old_casino",
        "name_ko": "구형 카지노",
        "name_en": "Old Casino",
        get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
        "imgSrc": imgLowOldCasino,
        "description_ko": "과거의 영광은 사라지고 이제는 동네 노름판으로 전락한 구형의 카지노.",
        "description_en": "An old casino where the past glory is gone, now reduced to a local gambling joint.",
        get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
        "atmosphere": "낡음, 퇴폐적, 느슨함",
        "requirements": null,
        "level": 6,
        "npcs": [
          "Fish",
          "Nit",
          "Broke",
          "MR_CALL",
          "Gambler",
          "Maniac",
          "Rich_Guy",
          "Gangster"
        ],
        "tables": { amount: 50000, amount_fmt: '50K', amount_min_fmt: '25K', sb: 250, bb: 500, available: [6, 9], baseRake: 0.06, rakeCap: 5000 },
        "theme": {
          "background": "radial-gradient(circle, #0f2e0f 0%, #051a05 100%)",
          "borderColor": "#2e8b57",
          "boxShadow": "0 0 20px rgba(46, 139, 87, 0.4)"
        },
        'bgMusic': [TRACK_ENUM.Solitude, TRACK_ENUM.DustyDay]
      }
    ]
  },
  {
    "id": "middle",
    "name_ko": "Middle Stakes",
    "name_en": "Middle Stakes",
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    "description_ko": "본격적인 승부사들의 영역. 생계를 걸거나 도약을 준비하는 이들이 모임.",
    "description_en": "The realm of true gamblers. A gathering place for those risking their livelihood or preparing for a leap forward.",
    get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
    "locations": [
      {
        "id": "middle_kbt_base",
        "name_ko": "KBT 본거지",
        "name_en": "KBT Base",
        get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
        "imgSrc": imgMiddleUndergroundCasino,
        "description_ko": "KBT 조직의 본거지. '더 벙커'의 안쪽에 위치해 있다.",
        "description_en": "The base of the KBT syndicate. Located deep inside 'The Bunker'.",
        get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
        "atmosphere": "긴장감, 위압감",
        "isHidden": true,
        "requirements": null,
        "level": 5,
        "npcs": [
          "KBT_Leader",
        ],
        "firstClearRewards": "the_bunker_key",
        "tables": { buyInLimit: 1, amount: 100000, amount_fmt: '100K', amount_min_fmt: '50K', sb: 500, bb: 1000, available: [6], baseRake: 0.00, rakeCap: 0, isAdvanced: true },
        "theme": {
          "background": "radial-gradient(circle, #1c1c1c 0%, #000000 100%)",
          "borderColor": "#708090",
          "boxShadow": "0 0 25px rgba(112, 128, 144, 0.5)"
        },
        'bgMusic': [TRACK_ENUM.JourneyToTitan]
      },
      {
        "id": "middle_underground_casino",
        "name_ko": "더 벙커",
        "name_en": "The Bunker",
        get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
        "imgSrc": imgMiddleUndergroundCasino,
        "description_ko": "버려진 지하 벙커를 개조한 불법 도박장. KBT가 관리하고 있다.",
        "description_en": "An illegal gambling den converted from an abandoned underground bunker. Managed by KBT.",
        get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
        "atmosphere": "기괴함, 공포, 사이버펑크 호러",
        "requirements": "the_bunker_key",
        "level": 5,
        "npcs": [
          "Maniac",
          "Gangster",
        ],
        "tables": { amount: 100000, amount_fmt: '100K', amount_min_fmt: '50K', sb: 500, bb: 1000, available: [6, 9], baseRake: 0.08, rakeCap: 5000 },
        "theme": {
          "background": "radial-gradient(circle, #1c1c1c 0%, #000000 100%)",
          "borderColor": "#708090",
          "boxShadow": "0 0 25px rgba(112, 128, 144, 0.5)"
        },
        'bgMusic': [TRACK_ENUM.JourneyToTitan]
      },
      {
        "id": "middle_casino_hotel",
        "name_ko": "카지노 호텔",
        "name_en": "Casino Hotel",
        get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
        "imgSrc": imgMiddleCasinoHotel,
        "description_ko": "도시 외곽이나 관광지에 위치한 중형 카지노. 관광객과 보안팀의 눈치 싸움.",
        "description_en": "A medium-sized casino located on the outskirts of the city or in tourist areas. A battle of wits between tourists and the security team.",
        get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
        "atmosphere": "활기참, 약간의 허세, 탐욕",
        "requirements": null,
        "level": 6,
        "npcs": [
          "Gangster",
          "Gambler",
          "Rich_Guy",
          "The_Don",
          "Quant_Pro",
          "Old_Lion"
        ],
        "tables": { amount: 250000, amount_fmt: '250K', amount_min_fmt: '125K', sb: 1000, bb: 2500, available: [6, 9], baseRake: 0.06, rakeCap: 25000, isAdvanced: true },
        "theme": {
          "background": "radial-gradient(circle, #001a33 0%, #000a14 100%)",
          "borderColor": "#ffd700",
          "boxShadow": "0 0 30px rgba(255, 215, 0, 0.4)"
        },
        'bgMusic': [TRACK_ENUM.Nightscape]
      },
      {
        "id": "middle_holdem_house",
        "name_ko": "홀덤 하우스 시설",
        "name_en": "Hold'em House",
        get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
        "imgSrc": imgMiddleHoldemHouse,
        "description_ko": "합법과 불법의 경계에 있는 사설 시설로, 실력을 검증받은 플레이어들만 멤버십으로 운영.",
        "description_en": "A private facility on the border of legal and illegal, operating on a membership basis only for players with verified skills.",
        get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
        "atmosphere": "정돈됨, 건조함, 전문적",
        "requirements": "holdem_house_membership",
        "level": 7,
        "npcs": [
          "Old_Lion",
          "Quant_Pro",
          "Shark",
        ],
        "tables": { amount: 500000, amount_fmt: '500K', amount_min_fmt: '250K', sb: 2500, bb: 5000, available: [6, 9], baseRake: 0.06, rakeCap: 50000, isAdvanced: true },
        "theme": {
          "background": "radial-gradient(circle, #1a2a3a 0%, #0d151d 100%)",
          "borderColor": "#4682b4",
          "boxShadow": "0 0 25px rgba(70, 130, 180, 0.5)"
        },
        'bgMusic': [TRACK_ENUM.BGM_Kinetic, TRACK_ENUM.DreamVector, TRACK_ENUM.VelvetShadows]
      },
    ]
  },
  {
    "id": "high",
    "name_ko": "High Stakes",
    "name_en": "High Stakes",
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    "description_ko": "선택받은 소수만이 접근할 수 있는 영역. 승패는 권력의 이동을 의미.",
    "description_en": "A realm accessible only to a chosen few. Victory or defeat means a shift in power.",
    get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
    "locations": [

      {
        "id": "high_royal_room",
        "name_ko": "로열 프라이빗 카드룸",
        "name_en": "Royal Private Cardroom",
        get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
        "imgSrc": imgHighProHouse,
        "description_ko": "도시 내 최고의 실력자들이 모이는 성지, 기업 스폰서십의 기회.",
        "description_en": "The sanctuary where the city's best players gather, an opportunity for corporate sponsorship.",
        get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
        "atmosphere": "엄숙함, 긴장감, 엘리트주의",
        "requirements": 'royal_room_invite',
        "level": 8,
        "npcs": [
          "Quant_Pro",
          "Shark",
          "Old_Lion",
          "Named_Pro",
        ],
        "tables": { amount: 1000000, amount_fmt: '1M', amount_min_fmt: '500K', sb: 5000, bb: 10000, available: [6, 9], baseRake: 0.05, rakeCap: 50000, isAdvanced: true },
        "theme": {
          "background": "radial-gradient(circle, #3d0000 0%, #1a0000 100%)",
          "borderColor": "#ff4d4d",
          "boxShadow": "0 0 40px rgba(255, 0, 0, 0.6)"
        },
        'bgMusic': [TRACK_ENUM.Grainders2057, TRACK_ENUM.Dystopia, TRACK_ENUM.DreamVector, TRACK_ENUM.VelvetShadows]
      },
      {
        "id": "high_safe_house",
        "name_ko": "안전가옥",
        "name_en": "Safe House",
        get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
        "imgSrc": null,
        "description_ko": "안전 가옥으로 유명한 실력자들을 초대하였습니다.",
        "description_en": "Invited famous skilled players to the safe house.",
        get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
        "atmosphere": "다소 어두움, 진지한 분위기",
        "requirements": null,
        "isHidden": true,
        "level": 0,
        "npcs": [
          "Shark"
        ],
        "tables": {
          amount: 2500000, amount_fmt: '2.5M', amount_min_fmt: '1.25M', sb: 5000, bb: 10000, available: [
            6
          ], baseRake: 0.0, rakeCap: 0
        },
        "theme": {
          "background": "radial-gradient(circle, #2c2c2c 0%, #1a1a1a 100%)",
          "borderColor": "#3f6ae2ff",
          "boxShadow": "0 0 20px rgba(146, 148, 255, 0.8)"
        },
        'bgMusic': [TRACK_ENUM.Grainders2057, TRACK_ENUM.VelvetShadows, TRACK_ENUM.Nightscape, TRACK_ENUM.DreamVector]
      },
      {
        "id": "high_grand_casino",
        "name_ko": "대형 카지노 호텔",
        "name_en": "Grand Casino Hotel",
        get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
        "imgSrc": imgHighGrandCasino,
        "description_ko": "도시 중심부 거대 자본의 상징. 사회 유력 인사들의 게임 장소, 판돈의 단위는 상상을 초월.",
        "description_en": "A symbol of massive capital in the heart of the city. A gaming venue for influential figures in society, stakes are beyond imagination.",
        get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
        "atmosphere": "웅장함, 압도적, 럭셔리",
        "requirements": null,
        "level": 8,
        "npcs": [
          "The_Whale",
          "Shark",
          "The_Don",
          "Rich_Guy",
        ],
        "tables": { amount: 5000000, amount_fmt: '5M', amount_min_fmt: '2.5M', sb: 25000, bb: 50000, available: [6, 9], baseRake: 0.06, rakeCap: 500000, isAdvanced: true },
        "theme": {
          "background": "radial-gradient(circle, #1a1a1a 0%, #000000 100%)",
          "borderColor": "#ffd700",
          "boxShadow": "0 0 50px rgba(255, 215, 0, 0.7)"
        },
        'bgMusic': [TRACK_ENUM.Placebo, TRACK_ENUM.DustyDay, TRACK_ENUM.Dystopia, TRACK_ENUM.BeThere]
      },
      {
        "id": "war_of_the_gods",
        "name_ko": "신들의 전쟁",
        "name_en": "War of the Gods",
        get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
        "imgSrc": null,
        "description_ko": "진정한 전설들을 초대하였습니다.",
        "description_en": "Invited the true legends.",
        get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
        "atmosphere": "엔드 게임을 위한 시작",
        "requirements": null,
        "isHidden": true,
        "level": 0,
        "npcs": [
          "Shark"
        ],
        "tables": {
          amount: 20000000, amount_fmt: '20M', amount_min_fmt: '10M', sb: 50000, bb: 100000, available: [
            6
          ], baseRake: 0.0, rakeCap: 0
        },
        "theme": {
          "background": "radial-gradient(circle, #001a33 0%, #000a14 100%)",
          "borderColor": "#ffd700",
          "boxShadow": "0 0 30px rgba(255, 215, 0, 0.4)"
        },
        'bgMusic': [TRACK_ENUM.Grainders2057, TRACK_ENUM.VelvetShadows, TRACK_ENUM.Nightscape, TRACK_ENUM.DreamVector]
      },
    ]
  },
  {
    "id": "special",
    "name_ko": "Special Tier (The Sanctuary)",
    "name_en": "Special Tier (The Sanctuary)",
    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
    "description_ko": "지구에서 벗어난 공간. 운명을 건 승부.",
    "description_en": "A space outside of Earth. A game with destiny on the line.",
    get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
    "locations": [
      {
        "id": "special_orbit_lounge",
        "name_ko": "'투 더 마스' 궤도 라운지",
        "name_en": "The Orbit",
        get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },
        "imgSrc": imgSpecialOrbitLounge,
        "description_ko": "지구과 화성를 오가는 최상위 권력층들의 잠시 머무는 곳. 치외법권 구역.",
        "description_en": "A brief stopover for the highest echelons commuting between Earth and Mars. An extraterritorial zone.",
        get description() { return store.settings.language === 'en' ? this.description_en : this.description_ko; },
        "atmosphere": "신비로움, 초현실적, 고립감",
        "requirements": "orbit_lounge_network_hacking",
        "level": 10,
        "npcs": [
          "Musk_V",
          "The_Whale"
        ],
        "tables": { amount: 100000000, amount_fmt: '100M', amount_min_fmt: '50M', sb: 500000, bb: 1000000, available: [6, 9], baseRake: 0.03, rakeCap: 5000000, isAdvanced: false },
        "theme": {
          "background": "radial-gradient(circle, #000033 0%, #00001a 100%)",
          "borderColor": "#00ffff",
          "boxShadow": "0 0 60px rgba(0, 255, 255, 0.8)"
        },
        'bgMusic': [TRACK_ENUM.RemoteLocation]
      }
    ]
  }
]