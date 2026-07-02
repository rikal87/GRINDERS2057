const PREFIXES = {
  en: [
    'Neon', 'Rusty', 'Chrome', 'Glitch', 'Iron', 'Mad', 'Lucky', 'Blind',
    'Cyber', 'Voodoo', 'Ghost', 'Shadow', 'Silver', 'Steel', 'Smog', 'Static',
    'Toxic', 'Zero', 'Crimson', 'Acid', 'Null', 'Void', 'Electric', 'Junk'
  ],
  ko: [
    '네온', '녹슨', '크롬', '글리치', '강철', '미친', '럭키', '눈먼',
    '사이버', '부두', '고스트', '그림자', '실버', '스틸', '스모그', '정전기',
    '맹독', '제로', '크림슨', '애시드', '널', '공허', '전기', '정크'
  ]
};

const NAMES = {
  en: [
    'Jack', 'Sarah', 'Max', 'Riple', 'Tyrell', 'Neo', 'Trinity', 'Spike',
    'Faye', 'Jet', 'Ed', 'Bebop', 'Molly', 'Case', 'Wintermute', 'Neuromancer',
    'Deckard', 'Batty', 'Pris', 'Zhora', 'Gaff', 'Bryant', 'Holden', 'Leon',
    'Tetsuo', 'Kaneda', 'Kei', 'Ryu', 'Akira', 'Motoko', 'Batou', 'Togusa'
  ],
  ko: [
    '잭', '사라', '맥스', '리플', '타이렐', '네오', '트리니티', '스파이크',
    '페이', '제트', '에드', '비밥', '몰리', '케이스', '윈터뮤트', '뉴로맨서',
    '데카드', '배티', '프리스', '조라', '개프', '브라이언트', '홀든', '레온',
    '테츠오', '카네다', '케이', '류', '아키라', '모토코', '바토', '토구사'
  ]
};

/**
 * Generates a random name from the Prefix and Name lists based on the locale.
 * Ensures the generated name does not exist in the provided existingNames set.
 * @param {Set<string>|Array<string>} existingNames - A set or array of names currently in use.
 * @param {string} locale - 'en' or 'ko' (defaults to 'en')
 * @returns {string} A unique name string.
 */
export function generateUniqueName(existingNames, locale = 'en') {
  const existingSet = new Set(existingNames);
  let name = '';
  let attempts = 0;
  const maxAttempts = 100;

  // Fallback to English if an unsupported locale is passed
  const safeLocale = PREFIXES[locale] ? locale : 'en';

  const prefixList = PREFIXES[safeLocale];
  const nameList = NAMES[safeLocale];

  while (attempts < maxAttempts) {
    const prefix = prefixList[Math.floor(Math.random() * prefixList.length)];
    const baseName = nameList[Math.floor(Math.random() * nameList.length)];
    
    // In Korean, we usually don't need a space between prefix and name if it's a title, 
    // but a space is safer for readability (e.g. "녹슨 잭", "네온 사라")
    name = `${prefix} ${baseName}`;

    if (!existingSet.has(name)) {
      return name;
    }
    attempts++;
  }

  // Fallback
  return safeLocale === 'ko' 
    ? `그라인더_${Math.floor(Math.random() * 10000)}` 
    : `Grinder_${Math.floor(Math.random() * 10000)}`;
}
