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
export const zones = [
  {
    "id": "free",
    "name": "Free Stakes",
    "description": "게임의 첫 여정의 시작점.",
    "locations": [
      {
        "id": "free_safe_house",
        "name": "안전가옥",
        "englishName": "Safe House",
        "imgSrc": null,
        "description": "안전가옥으로 친구들을 초대하였습니다.",
        "atmosphere": "다소 어두움, 가벼운 분위기, 가끔 절박함",
        "requirements": null,
        "isHidden": true,
        "level": 0,
        "npcs": [
          "Fish",
          "Broke",
          "MR_CALL"
        ],
        "tables": {
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
        "name": "길거리 상점 뒷편",
        "englishName": "Street Shop Backroom",
        "imgSrc": imgMicroStreetShop,
        "description": "낮게 깔린 네온사인 불빛이 비치는 좁은 골목, 셔터가 반쯤 내려간 구멍가게 안쪽에 급히 마련된 접이식 테이블로 지인들과 소소한 재미를 위해 모인 곳.",
        "atmosphere": "어두움, 가벼운 분위기, 가끔 절박함",
        "requirements": null,
        "level": 1,
        "npcs": [
          "Fish",
          "Broke",
          "MR_CALL"
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
      }
    ]
  },
  {
    "id": "micro",
    "name": "Micro Stakes",
    "description": "단순 오락거리를 위해 찾는 곳. 돈을 잃어도 타격이 적어 무모한 플레이가 빈번하지만, 가끔 절박한 플레이어도 존재.",
    "locations": [
      {
        "id": "micro_warehouse",
        "name": "뒷골목 창고",
        "englishName": "Back Alley Warehouse",
        "imgSrc": imgMicroWarehouse,
        "description": "버려진 건물의 지하 저장고를 무단 점거하여 운영되는 불법 도박장. 주로 인근 하층민들이나 자극을 찾는 부랑자들이 자주 찾는 곳.",
        "requirements": null,
        "firstClearReward": "underground_bar_invite",
        "level": 2,
        "npcs": [
          "Fish",
          "Broke",
          "Maniac",
          "Gangster",
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
        "name": "지하 바",
        "englishName": "Underground Bar",
        "imgSrc": imgMicroUndergroundBar,
        "description": "겉으로는 평범한 술집처럼 보이지만, 단골들만 아는 암호를 대야 입장할 수 있는 비밀 아지트. 비교적 적은 판돈으로도 전략을 시험해보고 싶은 이들이 주로 찾는 곳.",
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
    "name": "Low Stakes",
    "description": "본격적으로 포커를 업으로 삼기 시작하는 단계. 실력이 드러나며 다양한 직업군과 성향이 혼재.",
    "locations": [
      {
        "id": "low_neon_lounge",
        "name": "네온 라운지",
        "englishName": "Neon Lounge",
        "imgSrc": imgLowNeonLounge,
        "description": "트렌드에 민감한 청년들이 퇴근 후 가볍게 한잔하며 즐기는 장소.",
        "atmosphere": "세련됨, 차분함, 도시적",
        "requirements": null,
        "level": 4,
        "firstClearReward": "club_membership",
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
        'bgMusic': [TRACK_ENUM.Dystopia, TRACK_ENUM.BeThere]
      },
      {
        "id": "low_underground_club",
        "name": "H.B.D 클럽",
        "englishName": "H.B.D Club",
        "imgSrc": imgLowUndergroundClub,
        "description": "시끄러운 음악과 화려한 조명 속에서 이성과 판단력이 마비되기 쉬운 곳. 클럽 구석의 VIP 부스에서 진행되는 게임.",
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
        "name": "구형 카지노",
        "englishName": "Old Casino",
        "imgSrc": imgLowOldCasino,
        "description": "과거의 영광은 사라지고 이제는 동네 노름판으로 전락한 구형의 카지노.",
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
    "name": "Middle Stakes",
    "description": "본격적인 승부사들의 영역. 생계를 걸거나 도약을 준비하는 이들이 모임.",
    "locations": [
      {
        "id": "middle_kbt_base",
        "name": "KBT 본거지",
        "englishName": "KBT Base",
        "imgSrc": imgMiddleUndergroundCasino,
        "description": "KBT 조직의 본거지. '더 벙커'의 안쪽에 위치해 있다.",
        "atmosphere": "긴장감, 위압감",
        "isHidden": true,
        "requirements": null,
        "level": 5,
        "npcs": [
          "KBT_Leader",
        ],
        "firstClearReward": "the_bunker_key",
        "tables": { amount: 100000, amount_fmt: '100K', amount_min_fmt: '50K', sb: 500, bb: 1000, available: [6], baseRake: 0.00, rakeCap: 0, isHighStakes: true },
        "theme": {
          "background": "radial-gradient(circle, #1c1c1c 0%, #000000 100%)",
          "borderColor": "#708090",
          "boxShadow": "0 0 25px rgba(112, 128, 144, 0.5)"
        },
        'bgMusic': [TRACK_ENUM.JourneyToTitan]
      },
      {
        "id": "middle_underground_casino",
        "name": "더 벙커",
        "englishName": "The Bunker",
        "imgSrc": imgMiddleUndergroundCasino,
        "description": "버려진 지하 벙커를 개조한 불법 도박장. KBT가 관리하고 있다.",
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
        "name": "카지노 호텔",
        "englishName": "Casino Hotel",
        "imgSrc": imgMiddleCasinoHotel,
        "description": "도시 외곽이나 관광지에 위치한 중형 카지노. 관광객과 보안팀의 눈치 싸움.",
        "atmosphere": "활기참, 약간의 허세, 탐욕",
        "requirements": null,
        "level": 6,
        "npcs": [
          "Gangster",
          "Gambler",
          "Rich_Guy",
          "Mafia_Boss",
          "Quant_Pro",
        ],
        "tables": { amount: 250000, amount_fmt: '250K', amount_min_fmt: '125K', sb: 1000, bb: 2500, available: [6, 9], baseRake: 0.06, rakeCap: 25000, isHighStakes: true },
        "theme": {
          "background": "radial-gradient(circle, #001a33 0%, #000a14 100%)",
          "borderColor": "#ffd700",
          "boxShadow": "0 0 30px rgba(255, 215, 0, 0.4)"
        },
        'bgMusic': [TRACK_ENUM.Nightscape]
      },
      {
        "id": "middle_holdem_house",
        "name": "홀덤 하우스 시설",
        "englishName": "Hold'em House",
        "imgSrc": imgMiddleHoldemHouse,
        "description": "합법과 불법의 경계에 있는 사설 시설로, 실력을 검증받은 플레이어들만 멤버십으로 운영.",
        "atmosphere": "정돈됨, 건조함, 전문적",
        "requirements": "holdem_house_membership",
        "level": 7,
        "npcs": [
          "Old_Lion",
          "Quant_Pro",
          "Shark",
        ],
        "tables": { amount: 500000, amount_fmt: '500K', amount_min_fmt: '250K', sb: 2500, bb: 5000, available: [6, 9], baseRake: 0.06, rakeCap: 50000, isHighStakes: true },
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
    "name": "High Stakes",
    "description": "선택받은 소수만이 접근할 수 있는 영역. 승패는 권력의 이동을 의미.",
    "locations": [

      {
        "id": "high_royal_room",
        "name": "로열 프라이빗 카드룸",
        "englishName": "Royal Private Cardroom",
        "imgSrc": imgHighProHouse,
        "description": "도시 내 최고의 실력자들이 모이는 성지, 기업 스폰서십의 기회.",
        "atmosphere": "엄숙함, 긴장감, 엘리트주의",
        "requirements": 'royal_room_invite',
        "level": 8,
        "npcs": [
          "Quant_Pro",
          "Shark",
          "Old_Lion",
          "Named_Pro",
        ],
        "tables": { amount: 1000000, amount_fmt: '1M', amount_min_fmt: '500K', sb: 5000, bb: 10000, available: [6, 9], baseRake: 0.05, rakeCap: 50000, isHighStakes: true },
        "theme": {
          "background": "radial-gradient(circle, #3d0000 0%, #1a0000 100%)",
          "borderColor": "#ff4d4d",
          "boxShadow": "0 0 40px rgba(255, 0, 0, 0.6)"
        },
        'bgMusic': [TRACK_ENUM.Grainders2057, TRACK_ENUM.Dystopia, TRACK_ENUM.DreamVector, TRACK_ENUM.VelvetShadows]
      },
      {
        "id": "high_safe_house",
        "name": "안전가옥",
        "englishName": "Safe House",
        "imgSrc": null,
        "description": "안전 가옥으로 유명한 실력자들을 초대하였습니다.",
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
        "name": "대형 카지노 호텔",
        "englishName": "Grand Casino Hotel",
        "imgSrc": imgHighGrandCasino,
        "description": "도시 중심부 거대 자본의 상징. 사회 유력 인사들의 게임 장소, 판돈의 단위는 상상을 초월.",
        "atmosphere": "웅장함, 압도적, 럭셔리",
        "requirements": null,
        "level": 8,
        "npcs": [
          "The_Whale",
          "Shark",
          "Mafia_Boss",
          "Rich_Guy",
        ],
        "tables": { amount: 5000000, amount_fmt: '5M', amount_min_fmt: '2.5M', sb: 25000, bb: 50000, available: [6, 9], baseRake: 0.06, rakeCap: 500000, isHighStakes: true },
        "theme": {
          "background": "radial-gradient(circle, #1a1a1a 0%, #000000 100%)",
          "borderColor": "#ffd700",
          "boxShadow": "0 0 50px rgba(255, 215, 0, 0.7)"
        },
        'bgMusic': [TRACK_ENUM.Placebo, TRACK_ENUM.DustyDay, TRACK_ENUM.Dystopia, TRACK_ENUM.BeThere]
      },
      {
        "id": "war_of_the_gods",
        "name": "신들의 전쟁",
        "englishName": "War of the Gods",
        "imgSrc": null,
        "description": "진정한 전설들을 초대하였습니다.",
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
    "name": "Special Tier (The Sanctuary)",
    "description": "지구에서 벗어난 공간. 운명을 건 승부.",
    "locations": [
      {
        "id": "special_orbit_lounge",
        "name": "'투 더 마스' 궤도 라운지",
        "englishName": "The Orbit",
        "imgSrc": imgSpecialOrbitLounge,
        "description": "지구과 화성를 오가는 최상위 권력층들의 잠시 머무는 곳. 치외법권 구역.",
        "atmosphere": "신비로움, 초현실적, 고립감",
        "requirements": "orbit_lounge_network_hacking",
        "level": 10,
        "npcs": [
          "Musk_V",
          "The_Whale"
        ],
        "tables": { amount: 100000000, amount_fmt: '100M', amount_min_fmt: '50M', sb: 500000, bb: 1000000, available: [6, 9], baseRake: 0.03, rakeCap: 5000000, isHighStakes: false },
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