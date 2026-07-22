// Cyberspace OS FUI Graphic Symbol & Retro CRT Pixel Dot-Matrix Engine
// Converts standard emojis into rich pixel-dot matrix retro cyberpunk emblems

export const getModuleSymbolData = (item) => {
  if (!item) return { symbol: '▣', emoji: '⚙️', code: 'PLUGIN', color: 'cyan' };

  const id = (item.id || '').toLowerCase();
  const type = (item.type || '').toUpperCase();

  // 1. HACKING / SECURITY / TAX
  if (id.includes('hack') || id.includes('forgery') || id.includes('tax') || id.includes('bunker') || type === 'HACKING') {
    return {
      symbol: '⬣',
      emoji: item.icon || '💾',
      code: 'SYS_BREACH',
      pokerIcon: '♥',
      color: 'magenta',
      badgeClass: 'fui-symbol-magenta'
    };
  }

  // 2. NETWORKING / SPAWN / RADAR
  if (id.includes('attractor') || id.includes('finder') || id.includes('hunter') || id.includes('invite') || type === 'NETWORKING') {
    return {
      symbol: '⬢',
      emoji: item.icon || '📡',
      code: 'NET_BEACON',
      pokerIcon: '♣',
      color: 'cyan',
      badgeClass: 'fui-symbol-cyan'
    };
  }

  // 3. BOOST / XP / STAMINA / POWER
  if (id.includes('xp') || id.includes('boost') || id.includes('stamina') || id.includes('coach') || id.includes('review') || type === 'BOOST') {
    return {
      symbol: '⚡',
      emoji: item.icon || '🚀',
      code: 'PWR_CORE',
      pokerIcon: '♦',
      color: 'yellow',
      badgeClass: 'fui-symbol-yellow'
    };
  }

  // 4. HUD / OVERLAY / ANALYZER
  if (id.includes('hud') || id.includes('overlay') || id.includes('equity') || id.includes('calc')) {
    return {
      symbol: '◈',
      emoji: item.icon || '📊',
      code: 'HUD_CHIP',
      pokerIcon: '♠',
      color: 'yellow',
      badgeClass: 'fui-symbol-yellow'
    };
  }

  // 5. WORK / SHADOW / BANKROLL
  if (id.includes('shadow') || id.includes('siphon') || id.includes('work')) {
    return {
      symbol: '▣',
      emoji: item.icon || '💼',
      code: 'DATA_CELL',
      pokerIcon: '♠',
      color: 'cyan',
      badgeClass: 'fui-symbol-cyan'
    };
  }

  // Default Fallback
  return {
    symbol: '▣',
    emoji: item.icon || '🗲',
    code: 'HARDWARE',
    pokerIcon: '♠',
    color: 'cyan',
    badgeClass: 'fui-symbol-cyan'
  };
};
