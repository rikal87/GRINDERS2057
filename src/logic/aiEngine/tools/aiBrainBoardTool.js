import { analyzeBoardTexture } from '../../poker.js';

/**
 * [Tool] Board Analysis Tool
 * Wraps poker.js utilities and adds specific danger assessments for the Brain.
 */
export function analyzeBoard(context) {
  const { board } = context;
  if (!board || board.length < 3) return { type: 'NEUTRAL', score: 0.5 };

  // Core texture from poker.js
  const base = analyzeBoardTexture(board);
  const boardFreq = {}; 
  if (base.ranks) base.ranks.forEach(r => boardFreq[r] = (boardFreq[r] || 0) + 1);
  
  // High card density
  const highCardCount = base.ranks ? base.ranks.filter(r => r >= 9).length : 0;
  
  // Flush Danger Level
  let flushDanger = 'NONE';
  if (base.maxSuit >= 4) flushDanger = 'HIGH';
  else if (base.maxSuit === 3) flushDanger = 'MED';
  else if (base.maxSuit === 2) flushDanger = 'LOW';

  // Straight Danger Level
  let straightDanger = 'LOW';
  if (base.connectedness >= 4) straightDanger = 'HIGH'; // 4+ to a straight
  else if (base.connectedness === 3 && highCardCount >= 2) straightDanger = 'MED'; // 3 to a straight on high board
  else if (base.connectedness === 3) straightDanger = 'LOW';

  // Downgrade Check: Is there an overcard on the current street?
  const ranksStr = '23456789TJQKA';
  let isDowngraded = false;
  if (board.length === 4) { // TURN
    const turnRank = ranksStr.indexOf(board[3][0]);
    const maxFlopRank = Math.max(...board.slice(0, 3).map(c => ranksStr.indexOf(c[0])));
    if (turnRank > maxFlopRank) isDowngraded = true;
  } else if (board.length === 5) { // RIVER
    const riverRank = ranksStr.indexOf(board[4][0]);
    const maxPrevRank = Math.max(...board.slice(0, 4).map(c => ranksStr.indexOf(c[0])));
    if (riverRank > maxPrevRank) isDowngraded = true;
  }

  const isBroadway = highCardCount >= 3;
  const isHighCardHeavy = highCardCount >= 2;

  // [v20] Range-to-Board Interaction: 
  // How much does this board correlate with a narrowed preflop range (3BP/4BP)?
  const potType = context.potType || 'SRP';
  let rangeInteractionScore = 0;
  if (['3BET_POT', '4BET_POT', '5BET_POT'].includes(potType)) {
    if (isBroadway) rangeInteractionScore = 0.9;
    else if (isHighCardHeavy) rangeInteractionScore = 0.6;
    else if (base.maxSuit >= 3) rangeInteractionScore = 0.4;
  }

  return {
    ...base,
    highCardCount,
    isBroadway,
    isHighCardHeavy,
    rangeInteractionScore,
    flushDanger,
    straightDanger,
    isDowngraded,
    isWet: base.score >= 5,
    isDry: base.score <= 2,
    isPaired: base.maxRankCount >= 2,
    isDoublePaired: Object.values(boardFreq).filter(v => v >= 2).length >= 2,
    isTrips: base.maxRankCount >= 3,
    fullHouseDanger: (Object.values(boardFreq).filter(v => v >= 2).length >= 2 || base.maxRankCount >= 3) ? 'HIGH' : 'LOW',
    maxBoardRank: (base.ranks && base.ranks.length > 0) ? Math.max(...base.ranks) : -1,
    isFlushPossible: base.maxSuit >= 3
  };
}
