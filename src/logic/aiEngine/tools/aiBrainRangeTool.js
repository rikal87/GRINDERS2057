import { GTO_RANGES, expandRange } from '../../GTORanges.js';

let cachedMatrix = null;

/**
 * [Tool] Range Tool
 * Parses and caches the GTO range matrix.
 */
export function getGTOMatrix() {
  if (cachedMatrix) return cachedMatrix;

  // 1. Unopened RFI ranges
  const OPEN = {};
  for (const pos in GTO_RANGES.OPEN) {
    OPEN[pos] = expandRange(GTO_RANGES.OPEN[pos]);
  }

  // 2. Defense vs Opens
  const DEFENSE = {};
  ['VS_UTG', 'VS_MP', 'VS_CO', 'VS_BTN', 'VS_SB'].forEach(vsPos => {
    if (GTO_RANGES[vsPos]) {
      DEFENSE[vsPos] = {};
      for (const myPos in GTO_RANGES[vsPos]) {
        const strat = GTO_RANGES[vsPos][myPos];
        if (typeof strat === 'string') {
          DEFENSE[vsPos][myPos] = expandRange(strat);
        } else {
          DEFENSE[vsPos][myPos] = {
            VALUE_3BET: expandRange(strat.VALUE_3BET),
            BLUFF_3BET: expandRange(strat.BLUFF_3BET),
            CALL: expandRange(strat.CALL)
          };
        }
      }
    }
  });

  // 3. Use Pre-expanded sets from GTORanges.js
  const VS_3BET = GTO_RANGES.SETS.VS_3BET;
  const SHORT_STACK = GTO_RANGES.SETS.SHORT_STACK;

  cachedMatrix = { OPEN, VS_3BET, SHORT_STACK, DEFENSE };
  return cachedMatrix;
}
