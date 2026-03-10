const RANKS = '23456789TJQKA';
const SUITS = 'shdc'; // spades, hearts, diamonds, clubs
// 6-max / 9-max Playability & EV Based Rankings (Top 169)
// Values suitedness, connectivity, and high cards over low pocket pairs.
// 1 is best (AA), 169 is worst (72o)
const HAND_RANKINGS = {
  'AA': 1, 'KK': 2, 'QQ': 3, 'AKs': 4, 'JJ': 5,
  'AQs': 6, 'AKo': 7, 'KQs': 8, 'AJs': 9, 'TT': 10,
  'AQo': 11, 'ATs': 12, 'KJs': 13, '99': 14, 'QJs': 15,
  'AJo': 16, 'JTs': 17, 'KTs': 18, '88': 19, 'QTs': 20,
  'A9s': 21, 'KQo': 22, 'J9s': 23, 'T9s': 24, 'A8s': 25,
  'KJo': 26, '77': 27, 'Q9s': 28, 'A7s': 29, '98s': 30,
  'ATo': 31, 'K9s': 32, 'A5s': 33, 'A6s': 34, 'QJo': 35,
  '66': 36, 'A4s': 37, '87s': 38, 'KTo': 39, 'J8s': 40,
  'A3s': 41, 'Q8s': 42, 'T8s': 43, 'K8s': 44, 'A2s': 45,
  '97s': 46, '55': 47, 'JTo': 48, '76s': 49, 'K7s': 50,
  'QTo': 51, 'A9o': 52, '86s': 53, '65s': 54, 'J7s': 55,
  'Q7s': 56, 'K6s': 57, 'T7s': 58, '44': 59, '54s': 60,
  'K5s': 61, '96s': 62, 'Q6s': 63, 'K4s': 64, 'K3s': 65,
  '75s': 66, '85s': 67, 'K2s': 68, 'J6s': 69, '33': 70,
  'Q5s': 71, 'K9o': 72, 'A8o': 73, '64s': 74, 'Q4s': 75,
  'J9o': 76, 'T9o': 77, 'J5s': 78, 'Q3s': 79, '22': 80,
  'T6s': 81, 'Q2s': 82, 'A7o': 83, '53s': 84, '95s': 85,
  'J4s': 86, '98o': 87, 'A5o': 88, '74s': 89, 'J3s': 90,
  '84s': 91, 'J2s': 92, 'T5s': 93, 'T8o': 94, 'K8o': 95,
  '43s': 96, 'A6o': 97, '87o': 98, 'A4o': 99, 'Q9o': 100,
  'T4s': 101, '94s': 102, '63s': 103, '97o': 104, 'T3s': 105,
  '76o': 106, 'A3o': 107, 'T2s': 108, '52s': 109, '73s': 110,
  '83s': 111, 'A2o': 112, 'K7o': 113, 'Q8o': 114, '42s': 115,
  '62s': 116, '93s': 117, '82s': 118, 'J8o': 119, 'J7o': 120,
  '32s': 121, 'T7o': 122, 'K6o': 123, '54o': 124, '92s': 125,
  '65o': 126, 'K5o': 127, '86o': 128, 'Q7o': 129, 'J6o': 130,
  'K4o': 131, '75o': 132, '96o': 133, 'K3o': 134, 'Q6o': 135,
  'K2o': 136, '85o': 137, 'T6o': 138, '53o': 139, '64o': 140,
  'J5o': 141, 'Q5o': 142, '95o': 143, 'J4o': 144, 'Q4o': 145,
  '74o': 146, 'J3o': 147, 'Q3o': 148, '84o': 149, 'J2o': 150,
  'Q2o': 151, '94o': 152, 'T5o': 153, '43o': 154, '63o': 155,
  '93o': 156, 'T4o': 157, '73o': 158, 'T3o': 159, '83o': 160,
  '52o': 161, 'T2o': 162, '92o': 163, '42o': 164, '82o': 165,
  '62o': 166, '72s': 167, '32o': 168, '72o': 169
};
const HAND_RANKINGS_HEADSUP = {
  'AA': 1, 'KK': 2, 'QQ': 3, 'JJ': 4, 'AKs': 5,
  'TT': 6, 'AKo': 7, 'AQs': 8, '99': 9, 'AJs': 10,
  '88': 11, 'ATs': 12, 'AQo': 13, '77': 14, 'KQs': 15,
  'AJo': 16, 'QJs': 17, 'KJs': 18, 'ATo': 19, 'JTs': 20,
  '66': 21, 'KQo': 22, 'KTs': 23, 'QTs': 24, 'A9s': 25,
  'KJo': 26, '55': 27, 'QJo': 28, 'K9s': 29, 'A8s': 30,
  'Q9s': 31, 'J9s': 32, 'A5s': 33, 'A7s': 34, 'KTo': 35,
  'A4s': 36, 'A3s': 37, 'A6s': 38, 'QTo': 39, 'A2s': 40,
  'K8s': 41, 'T9s': 42, 'J8s': 43, '44': 44, 'A9o': 45,
  'K7s': 46, 'Q8s': 47, 'K6s': 48, 'K5s': 49, 'K4s': 50,
  'K3s': 51, 'K2s': 52, '33': 53, 'Q7s': 54, 'T8s': 55,
  'JTo': 56, 'K9o': 57, '98s': 58, 'Q6s': 59, 'J7s': 60,
  'Q5s': 61, 'Q4s': 62, 'Q3s': 63, 'Q2s': 64, '22': 65,
  'A8o': 66, 'T7s': 67, '87s': 68, 'J9o': 69, 'K8o': 70,
  'Q9o': 71, 'J6s': 72, 'J5s': 73, 'J4s': 74, 'J3s': 75,
  'J2s': 76, '97s': 77, '76s': 78, 'A7o': 79, 'T6s': 80,
  'T9o': 81, 'A5o': 82, '65s': 83, 'T5s': 84, 'T4s': 85,
  'T3s': 86, 'T2s': 87, 'Q8o': 88, 'A4o': 89, 'A6o': 90,
  'K7o': 91, '96s': 92, '86s': 93, 'A3o': 94, 'K6o': 95,
  'K5o': 96, '75s': 97, '54s': 98, 'K4o': 99, 'K3o': 100,
  'K2o': 101, '95s': 102, 'A2o': 103, '85s': 104, 'Q7o': 105,
  'J8o': 106, 'T8o': 107, '98o': 108, '64s': 109, '94s': 110,
  '53s': 111, '74s': 112, '43s': 113, 'Q6o': 114, 'Q5o': 115,
  'Q4o': 116, 'Q3o': 117, 'Q2o': 118, 'J7o': 119, '87o': 120,
  'T7o': 121, '93s': 122, '84s': 123, '97o': 124, '63s': 125,
  '76o': 126, 'J6o': 127, 'J5o': 128, 'J4o': 129, 'J3o': 130,
  'J2o': 131, '92s': 132, '73s': 133, '83s': 134, '52s': 135,
  'T6o': 136, '42s': 137, '65o': 138, '82s': 139, '96o': 140,
  '86o': 141, '75o': 142, '32s': 143, 'T5o': 144, 'T4o': 145,
  'T3o': 146, 'T2o': 147, '54o': 148, '62s': 149, '95o': 150,
  '85o': 151, '64o': 152, '94o': 153, '53o': 154, '74o': 155,
  '43o': 156, '93o': 157, '84o': 158, '63o': 159, '92o': 160,
  '73o': 161, '83o': 162, '52o': 163, '42o': 164, '82o': 165,
  '62o': 166, '32o': 167, '72o': 168
};
export const createDeck = () => {
  let deck = [];
  for (let s of SUITS) {
    for (let r of RANKS) {
      deck.push(r + s);
    }
  }
  return shuffle(deck);
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const evaluateHand = (cards) => {
  // 7 cards input (2 hole cards + 5 board cards)
  // Returns { rank: number, name: string, value: number }
  // Rank: 10 (Royal Flush) down to 1 (High Card)

  if (cards.length < 5) {
    return scoreFiveCards(cards);
  }

  const combos = getCombinations(cards, 5);
  let bestHand = null;

  for (const combo of combos) {
    const score = scoreFiveCards(combo);
    if (!bestHand || score.total > bestHand.total) {
      bestHand = score;
    }
  }

  return bestHand;
};

const getCombinations = (array, k) => {
  let result = [];
  const fn = (n, src, got) => {
    if (n === 0) {
      if (got.length > 0) result.push(got);
      return;
    }
    for (let i = 0; i < src.length; i++) {
      fn(n - 1, src.slice(i + 1), got.concat([src[i]]));
    }
  };
  fn(k, array, []);
  return result;
};

const getNutStatus = (hand, board) => {
  if (board.length === 0) return { isNuts: true, rank: 1, totalCombos: 1326 }; // Preflop AA is nuts

  // 1. Generate all possible hole cards (excluding hand and board)
  const knownCards = new Set([...hand, ...board]);
  const deck = [];
  for (let s of SUITS) {
    for (let r of RANKS) {
      const c = r + s;
      if (!knownCards.has(c)) deck.push(c);
    }
  }

  // 2. Evaluate Hero's Hand
  const heroScore = evaluateHand([...hand, ...board]).total;

  // 3. Evaluate All Possible Hands
  const scores = new Set();
  scores.add(heroScore);

  for (let i = 0; i < deck.length; i++) {
    for (let j = i + 1; j < deck.length; j++) {
      const villainHand = [deck[i], deck[j]];
      const score = evaluateHand([...villainHand, ...board]).total;
      scores.add(score);
    }
  }

  // 4. Sort unique scores descending
  const sortedScores = Array.from(scores).sort((a, b) => b - a);
  const rank = sortedScores.indexOf(heroScore) + 1; // 1 = Best (Nuts)

  return {
    isNuts: rank === 1,
    rank,
    isSecondNuts: rank === 2,
    percentile: rank / sortedScores.length
  };
};
export const getHandCategory = (hand, board, evalResult) => {
  const rank = evalResult.rank;
  const nutInfo = getNutStatus(hand, board);
  const usedHoleCards = evalResult.cards ? evalResult.cards.filter(c => hand.includes(c)).length : 0;

  // Absolute Nuts Check (or near nuts)
  if (nutInfo.isNuts) {
    if (usedHoleCards === 0) return 'BOARD_CHOP'; // Board is nuts (guaranteed split)
    // On the river, one card nuts is the absolute nuts. On earlier streets, it is vulnerable.
    if (usedHoleCards === 1 && board.length < 5) return 'STRONG';
    return 'NUTS';
  }
  if (nutInfo.isSecondNuts) {
    if (usedHoleCards === 0) return 'WEAK';
    if (usedHoleCards === 1) return 'STRONG';
    return 'MONSTER'; // Second Nuts is Monster if 2-cards
  }

  // Get Rank Values
  const getRankVal = c => '23456789TJQKA'.indexOf(c[0]);
  const handRanks = hand.map(getRankVal).sort((a, b) => b - a);
  const boardRanks = board.map(getRankVal).sort((a, b) => b - a);

  // Board Texture Flags
  const isBoardPaired = boardRanks.some((r, i) => r === boardRanks[i + 1]);
  const isBoardTrips = boardRanks.some((r, i) => r === boardRanks[i + 1] && r === boardRanks[i + 2]);

  const boardSuits = board.map(c => c[1]);
  const boardSuitCounts = {};
  boardSuits.forEach(s => boardSuitCounts[s] = (boardSuitCounts[s] || 0) + 1);
  const isBoardFlushPossible = Object.values(boardSuitCounts).some(c => c >= 3);
  const isBoardStraightPossible = analyzeBoardTexture(board).score >= 5;

  // 10: Royal Flush
  if (rank === 10) return 'NUTS';

  // 9: Straight Flush
  if (rank === 9) return nutInfo.rank <= 3 ? (usedHoleCards === 2 ? 'NUTS' : 'STRONG') : 'STRONG';

  // 8: Quads
  if (rank === 8) {
    if (usedHoleCards === 0) return 'WEAK';
    if (boardRanks.length >= 4 && boardRanks[0] === boardRanks[3]) {
      // Board is Quads. Kicker battle.
      if (nutInfo.rank <= 3) return usedHoleCards === 2 ? 'NUTS' : 'STRONG'; // Ace/King kicker
      return 'WEAK'; // Playing board mostly
    }
    return usedHoleCards === 2 ? 'NUTS' : 'STRONG';
  }

  // 7: Full House
  if (rank === 7) {
    if (usedHoleCards === 0) return 'WEAK';
    if (nutInfo.rank <= 5) return usedHoleCards === 2 ? 'MONSTER' : 'STRONG';
    if (nutInfo.rank <= 15) return 'STRONG';
    return 'MARGINAL'; // Bottom boat or playing board
  }

  // 6: Flush
  if (rank === 6) {
    if (usedHoleCards === 0) return 'WEAK';
    if (isBoardPaired) return 'GOOD'; // Vulnerable to Full House
    if (nutInfo.rank <= 5) return usedHoleCards === 2 ? 'NUTS' : 'MONSTER'; // High Flush
    if (nutInfo.rank <= 15) return 'STRONG'; // Mid Flush
    if (nutInfo.rank <= 25) return 'GOOD'; // Mid-Low Flush
    return 'STRONG'; // Low Flush
  }

  // 5: Straight
  if (rank === 5) {
    if (usedHoleCards === 0) return 'WEAK';
    if (isBoardFlushPossible) return 'MARGINAL'; // Vulnerable to Flush
    if (isBoardPaired) return 'MARGINAL'; // Vulnerable to FH
    if (nutInfo.rank <= 3) return usedHoleCards === 2 ? 'MONSTER' : 'STRONG'; // Nut Straight
    if (nutInfo.rank <= 10) return 'STRONG'; // Good Straight
    return 'GOOD'; // Bottom straight
  }

  // 4: Three of a Kind
  if (rank === 4) {
    if (usedHoleCards === 0) return 'WEAK';
    if (isBoardTrips) {
      if (nutInfo.rank <= 5) return 'STRONG'; // Top Kicker
      if (nutInfo.rank <= 15) return 'GOOD'; // Mid Kicker
      return 'WEAK'; // Low Kicker or Chop
    }

    // Set vs Trips
    const isPocketPair = hand[0][0] === hand[1][0];
    if (isPocketPair) return 'MONSTER'; // SET 
    // Trips
    if (nutInfo.rank <= 10) return 'STRONG'; // Good Kicker
    if (nutInfo.rank <= 20) return 'GOOD'; // Mid Kicker
    return 'MARGINAL'; // Weak Kicker
  }

  // 3: Two Pair
  if (rank === 3) {
    const boardHigh1 = boardRanks[0];
    const boardHigh2 = boardRanks[1];
    const hasTopPair = handRanks.includes(boardHigh1);
    const hasSecondPair = handRanks.includes(boardHigh2);

    if (isBoardPaired) {
      const isPocketPair = hand[0][0] === hand[1][0];
      // Overpair to the board pair (e.g. AA on KK86)
      if (isPocketPair && handRanks[0] > boardHigh1) return 'STRONG';

      // Counterfeited check
      if (!hasTopPair && handRanks.some(v => v < boardHigh1)) return 'MARGINAL';
      if (nutInfo.rank <= 15) return 'STRONG';
      return 'GOOD';
    }

    // Normal Two Pair (No board pair)
    if (hasTopPair && hasSecondPair) {
      if (isBoardFlushPossible || isBoardStraightPossible) return 'GOOD';
      return 'MONSTER'; // Top Two
    }
    if (hasTopPair) {
      if (isBoardFlushPossible || isBoardStraightPossible) return 'MARGINAL';
      return 'STRONG'; // Top Pair + Bottom Pair
    }

    // We have two pair but neither matches the top card (e.g., K-Q on A-K-Q)
    if (hasSecondPair) return 'GOOD'; // 2nd + 3rd pair
    return 'MARGINAL'; // Bottom two pairs
  }

  // 2: One Pair
  if (rank === 2) {
    const isPocketPair = hand[0][0] === hand[1][0];
    const maxBoard = boardRanks[0];

    if (isPocketPair) {
      if (handRanks[0] > maxBoard) return 'STRONG'; // Overpair
      if (handRanks[0] > (boardRanks[1] || -1)) {
        if (isBoardFlushPossible || isBoardStraightPossible) return 'MARGINAL';
        return 'GOOD'; // 2nd pair (Pocket pair between 1st and 2nd board card)
      }
      if (handRanks[0] < boardRanks[boardRanks.length - 1]) return 'WEAK'; // Underpair
      return 'MARGINAL'; // 3rd pair etc.
    } else {
      if (handRanks.includes(maxBoard)) {
        if (nutInfo.rank <= 30) return 'STRONG'; // TPTK / TPGK
        if (nutInfo.rank <= 60) {
          if (isBoardFlushPossible || isBoardStraightPossible) return 'MARGINAL';
          return 'GOOD'; // TPMK
        }
        if (isBoardFlushPossible || isBoardStraightPossible) return 'WEAK';
        return 'MARGINAL'; // TPWK
      }

      const pairedRank = handRanks.find(r => boardRanks.includes(r));
      if (pairedRank === boardRanks[1]) {
        if (isBoardFlushPossible || isBoardStraightPossible) return 'MARGINAL';
        return 'GOOD'; // Middle Pair (2nd pair with board)
      }
      return 'MARGINAL'; // Bottom pair / 3rd pair
    }
  }

  // 1: High Card
  if (rank === 1) {
    const holeVal = hand.map(c => '23456789TJQKA'.indexOf(c[0])).sort((a, b) => b - a);
    if (holeVal.includes(12)) return 'ACE_HIGH';
  }

  return 'AIR';
};
const scoreFiveCards = (cards) => {
  const ranks = cards.map(c => {
    const idx = RANKS.indexOf(c[0]);
    if (idx === -1) console.error(`[POKER] Invalid card rank: ${c}`);
    return idx;
  }).sort((a, b) => b - a);
  const suits = cards.map(c => c[1]);

  const counts = {};
  ranks.forEach(r => counts[r] = (counts[r] || 0) + 1);
  const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1] || b[0] - a[0]);

  // [FIX] Safety for empty hands (AI sometimes evaluates 0 cards on init)
  if (sortedCounts.length === 0) {
    return { rank: 0, name: 'No Hand', total: 0, cards: [] };
  }

  const isFlush = cards.length >= 5 && new Set(suits).size === 1;
  // Standard straight check
  let isStraight = cards.length >= 5 && ranks.every((r, i) => i === 0 || ranks[i - 1] - r === 1);
  // Wheel check (A, 5, 4, 3, 2)
  const isWheel = cards.length >= 5 && ranks[0] === 12 && ranks[1] === 3 && ranks[2] === 2 && ranks[3] === 1 && ranks[4] === 0;
  if (isWheel) isStraight = true;

  let rank = 1;
  let name = 'High Card';
  let total = 0;

  // Helper for Rank Names
  const getRankName = (idx, plural = false) => {
    const names = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
    const name = names[parseInt(idx)];
    if (plural) return name + 's';
    return name;
  };

  let score = 0;

  if (isFlush && isStraight) {
    if (!isWheel && ranks[0] === 12) { // Royal Flush
      rank = 10;
      name = 'Royal Flush';
      total = rank * Math.pow(15, 5);
    } else {
      rank = 9;
      // For SF, value depends ONLY on the high card of the straight.
      const highCard = isWheel ? 3 : ranks[0]; // 5 (index 3) if wheel, else top card
      name = `Straight Flush (${getRankName(highCard)} High)`;
      total = rank * Math.pow(15, 5) + highCard;
    }
  } else if (sortedCounts[0][1] === 4) {
    rank = 8;
    name = `Four of a Kind (${getRankName(sortedCounts[0][0], true)})`;
    // 4 of a kind val + kicker
    total = rank * Math.pow(15, 5) +
      Number(sortedCounts[0][0]) * Math.pow(15, 4) +
      Number(sortedCounts[1][0]) * Math.pow(15, 3);
  } else if (sortedCounts[0][1] === 3 && sortedCounts[1] && sortedCounts[1][1] === 2) {
    rank = 7;
    name = `Full House (${getRankName(sortedCounts[0][0], true)} full of ${getRankName(sortedCounts[1][0], true)})`;
    total = rank * Math.pow(15, 5) +
      Number(sortedCounts[0][0]) * Math.pow(15, 4) +
      Number(sortedCounts[1][0]) * Math.pow(15, 3);
  } else if (isFlush) {
    rank = 6;
    // Flush: All 5 cards matter, ordered by rank
    total = rank * Math.pow(15, 5);
    let flushVal = 0;
    for (let i = 0; i < ranks.length; i++) {
      const cardVal = ranks[i];
      total += cardVal * Math.pow(15, 4 - i);
      flushVal += cardVal * Math.pow(15, 4 - i);
    }
    // Calculate 0-100 score specifically for flushes.
    // Max flush value (Ace-high, next cards also high) is roughly:
    // 12*15^4 + 11*15^3 + 10*15^2 + 9*15^1 + 8*15^0 (Ace-King-Queen-Jack-9 is NOT a flush, it's A-K-Q-J-9)
    // Actually, A-K-Q-J-9 is a flush if they are same suit.
    // The max possible "pure" flush value is A,K,Q,J,9 (A,K,Q,J,T is Straight Flush)
    // Wait, Ace, King, Queen, Jack, 9 is the highest Non-Straight Flush.
    // Min is 7,5,4,3,2 (lowest non-straight flush)
    const maxFlushVal = 12 * Math.pow(15, 4) + 11 * Math.pow(15, 3) + 10 * Math.pow(15, 2) + 9 * Math.pow(15, 1) + 7 * Math.pow(15, 0); // AKQJ7 (AKQJ8 is straight flush if suited? No, T is needed)
    // Actually, AKQJ9 is a flush. AKQJT is SF.
    // High flush: 12, 11, 10, 9, 7 (if T is included it's a straight flush)
    // Lowest flush: 5, 3, 2, 1, 0 (7, 5, 4, 3, 2 is the lowest non-straight flush)
    // Let's use a simpler normalization 
    const minFlushVal = 5 * Math.pow(15, 4) + 3 * Math.pow(15, 3) + 2 * Math.pow(15, 2) + 1 * Math.pow(15, 1) + 0 * Math.pow(15, 0);
    score = Math.floor(((flushVal - minFlushVal) / (maxFlushVal - minFlushVal)) * 100);
    score = Math.max(0, Math.min(100, score));
    name = `Flush (${getRankName(ranks[0])} High, Score: ${score})`;
  } else if (isStraight) {
    rank = 5;
    const highCard = isWheel ? 3 : ranks[0];
    name = `Straight (${getRankName(highCard)} High)`;
    total = rank * Math.pow(15, 5) + highCard;
  } else if (sortedCounts[0][1] === 3) {
    rank = 4;
    name = `Three of a Kind (${getRankName(sortedCounts[0][0], true)})`;
    total = rank * Math.pow(15, 5);
    for (let i = 0; i < sortedCounts.length; i++) {
      total += Number(sortedCounts[i][0]) * Math.pow(15, 4 - i);
    }
  } else if (sortedCounts[0][1] === 2 && sortedCounts[1] && sortedCounts[1][1] === 2) {
    rank = 3;
    name = `Two Pair (${getRankName(sortedCounts[0][0], true)} and ${getRankName(sortedCounts[1][0], true)})`;
    total = rank * Math.pow(15, 5);
    for (let i = 0; i < sortedCounts.length; i++) {
      total += Number(sortedCounts[i][0]) * Math.pow(15, 4 - i);
    }
  } else if (sortedCounts[0][1] === 2) {
    rank = 2;
    name = `One Pair (${getRankName(sortedCounts[0][0], true)})`;
    total = rank * Math.pow(15, 5);
    for (let i = 0; i < sortedCounts.length; i++) {
      total += Number(sortedCounts[i][0]) * Math.pow(15, 4 - i);
    }
  } else {
    // High Card
    name = `High Card (${getRankName(ranks[0])})`;
    total = rank * Math.pow(15, 5);
    for (let i = 0; i < sortedCounts.length; i++) {
      total += Number(sortedCounts[i][0]) * Math.pow(15, 4 - i);
    }
  }

  return { rank, name, total, score, cards };
};

export const calculateOuts = (hole, board) => {
  if (board.length === 0) return { outs: 0, draws: [] };

  const allCards = [...hole, ...board];
  const suits = allCards.map(c => c[1]);
  const ranks = allCards.map(c => '23456789TJQKA'.indexOf(c[0])).sort((a, b) => a - b);
  const uniqueRanks = [...new Set(ranks)];

  let outs = 0;
  const draws = [];

  // 1. Flush Draw
  const suitCounts = {};
  suits.forEach(s => suitCounts[s] = (suitCounts[s] || 0) + 1);
  for (const s in suitCounts) {
    if (suitCounts[s] === 4) {
      outs += 9;
      draws.push(`Flush Draw (${s})`);
    }
  }

  // 2. Straight Draw (Revised)
  // Simulate adding every rank to check for straights (Handles Double Gutshots & Wheel)
  const straightOuts = new Set();
  const rankSet = new Set(uniqueRanks);

  for (let r = 0; r < 13; r++) {
    if (rankSet.has(r)) continue;

    rankSet.add(r);
    const sorted = Array.from(rankSet).sort((a, b) => a - b);
    let hasStr = false;

    // Check Normal Straight
    for (let i = 0; i <= sorted.length - 5; i++) {
      if (sorted[i + 4] - sorted[i] === 4) {
        hasStr = true;
        break;
      }
    }
    // Check Wheel Straight (A,2,3,4,5 -> 0,1,2,3,12)
    if (!hasStr) {
      if (rankSet.has(0) && rankSet.has(1) && rankSet.has(2) && rankSet.has(3) && rankSet.has(12)) {
        hasStr = true;
      }
    }

    if (hasStr) straightOuts.add(r);
    rankSet.delete(r);
  }

  if (straightOuts.size > 0) {
    const derivedOuts = straightOuts.size * 4;
    outs += derivedOuts;
    const label = derivedOuts >= 8 ? "Open-Ended / Double Gutshot" : "Gutshot Straight Draw";
    draws.push(label);
  }

  // 3. Overcards (if current hand is weak)
  // Only count if we don't have a made hand (Pair+)
  const currentEval = evaluateHand(allCards);
  if (currentEval.rank === 1) { // High Card only
    const boardHigh = Math.max(...board.map(c => '23456789TJQKA'.indexOf(c[0])));
    const holeRanks = hole.map(c => '23456789TJQKA'.indexOf(c[0]));
    let overcards = 0;
    holeRanks.forEach(r => {
      if (r > boardHigh) overcards++;
    });
    if (overcards > 0) {
      outs += (overcards * 3);
      draws.push(`${overcards} Overcard(s)`);
    }
  }

  return { outs, draws };
};

export const calculateEquity = (players, board, iterations = 1000) => {
  // players: Array of { id, hand: [card1, card2], isFolded }
  // board: Array of cards (0 to 5)
  // Returns: Object { [playerId]: equity (0-1) }

  const activePlayers = players.filter(p => !p.isFolded && p.hand && p.hand.length === 2);
  if (activePlayers.length === 0) return {};
  if (activePlayers.length === 1) {
    return { [activePlayers[0].id]: 1.0 };
  }

  // If board is full (river), no simulation needed, just evaluate
  if (board.length === 5) {
    const results = activePlayers.map(p => {
      const evalResult = evaluateHand([...p.hand, ...board]);
      return { id: p.id, score: evalResult.total };
    });

    // Find max score
    const maxScore = Math.max(...results.map(r => r.score));
    const winners = results.filter(r => r.score === maxScore);

    activePlayers.forEach(p => {
      // Check if p is in winners
      const isWinner = winners.some(w => w.id === p.id);
      p.equity = isWinner ? (1.0 / winners.length) * 100 : 0;
    });

    // Return for compatibility, though modification is primary
    return activePlayers;
  }

  const wins = {};
  activePlayers.forEach(p => wins[p.id] = 0);

  // Simulation
  const knownCards = new Set([...board]);
  activePlayers.forEach(p => p.hand.forEach(c => knownCards.add(c)));

  const fullDeck = [];
  for (let s of SUITS) {
    for (let r of RANKS) {
      fullDeck.push(r + s);
    }
  }
  const remainingDeck = fullDeck.filter(c => !knownCards.has(c));

  // Pre-calculate needs
  const cardsNeeded = 5 - board.length;

  for (let i = 0; i < iterations; i++) {
    // Shuffle remaining deck (Fisher-Yates) basically
    // For performance in JS loop, we can just pick random cards
    // Or copy array and shuffle. Array copy is safer.
    const runoutDeck = [...remainingDeck];

    // Quick shuffle for only needed cards
    // We only need top N cards
    for (let j = 0; j < cardsNeeded; j++) {
      const r = j + Math.floor(Math.random() * (runoutDeck.length - j));
      [runoutDeck[j], runoutDeck[r]] = [runoutDeck[r], runoutDeck[j]];
    }

    const runout = runoutDeck.slice(0, cardsNeeded);
    const finalBoard = [...board, ...runout];

    // Evaluate
    let bestScore = -1;
    let winners = [];

    for (const p of activePlayers) {
      // Optimization: Evaluate without full object creation if possible, 
      // but evaluateHand is our source of truth.
      const score = evaluateHand([...p.hand, ...finalBoard]).total;
      if (score > bestScore) {
        bestScore = score;
        winners = [p.id];
      } else if (score === bestScore) {
        winners.push(p.id);
      }
    }

    // Award wins
    const winShare = 1.0 / winners.length;
    winners.forEach(id => wins[id] += winShare);
  }

  // Normalize
  activePlayers.forEach(p => {
    p.equity = (wins[p.id] / iterations) * 100; // Percentage 0-100
  });

  return activePlayers;
};

export const getStartingHandRank = (hand, refHandRankSheet = HAND_RANKINGS) => {
  if (!hand || hand.length !== 2) return 169;

  // Helper to get rank char
  const r1 = hand[0][0];
  const r2 = hand[1][0];
  const s1 = hand[0][1];
  const s2 = hand[1][1];

  // Map rank chars to values for sorting
  const val = (r) => '23456789TJQKA'.indexOf(r);

  // Sort high card first
  let h1 = r1, h2 = r2;
  if (val(r2) > val(r1)) {
    h1 = r2; h2 = r1;
  }

  const isPair = h1 === h2;
  const isSuited = s1 === s2;

  let key = h1 + h2;
  if (!isPair) {
    key += (isSuited ? 's' : 'o');
  }

  return refHandRankSheet[key] || 169;
};
export const getStartingHandRank96Max = (hand) => {
  return getStartingHandRank(hand, HAND_RANKINGS);
};
export const getStartingHandRankHeadsup = (hand) => {
  return getStartingHandRank(hand, HAND_RANKINGS_HEADSUP);
};
export const analyzeBoardTexture = (board) => {
  if (!board || board.length < 3) return { type: 'NEUTRAL', score: 0.5 };

  const ranks = board.map(c => '23456789TJQKA'.indexOf(c[0])).sort((a, b) => a - b);
  const suits = board.map(c => c[1]);

  let score = 0; // 0 = Dry/Static, 10 = Wet/Dynamic

  // 1. Connectivity (Straights)
  let maxConnectivity = 0;
  // Check for 4-card clusters
  if (ranks.length >= 4) {
    for (let i = 0; i <= ranks.length - 4; i++) {
      const spread = ranks[i + 3] - ranks[i];
      if (spread <= 4) maxConnectivity = Math.max(maxConnectivity, 4);
    }
  }
  // Check for 3-card clusters
  for (let i = 0; i <= ranks.length - 3; i++) {
    const spread = ranks[i + 2] - ranks[i];
    if (spread <= 4) maxConnectivity = Math.max(maxConnectivity, 3);
  }

  // Check Wheel Straight (A, 2, 3, 4, 5)
  const hasAce = ranks.includes(12);
  if (hasAce) {
    const lowRanks = ranks.filter(r => r <= 3); // 2, 3, 4, 5
    if (lowRanks.length >= 3) maxConnectivity = Math.max(maxConnectivity, 4);
    else if (lowRanks.length >= 2) maxConnectivity = Math.max(maxConnectivity, 3);
  }

  if (maxConnectivity >= 4) score += 8;
  else if (maxConnectivity >= 3) score += 5;
  else {
    // Check for 2-card connectivity (guts/backdoor)
    for (let i = 0; i < ranks.length - 1; i++) {
      const gap = (ranks[i + 1] - ranks[i] - 1);
      if (gap <= 2) score += 1;
    }
  }

  // 2. Suits (Flush potential)
  const suitCounts = {};
  suits.forEach(s => suitCounts[s] = (suitCounts[s] || 0) + 1);
  const maxSuit = Math.max(...Object.values(suitCounts));

  if (maxSuit >= 4) score += 8;
  else if (maxSuit === 3) score += 5;
  else if (maxSuit === 2) score += 1;

  // 3. Pairs (Static)
  const rankCounts = {};
  ranks.forEach(r => rankCounts[r] = (rankCounts[r] || 0) + 1);
  const maxRankCount = Math.max(...Object.values(rankCounts));

  if (maxRankCount >= 2) {
    score -= 2; // Paired board is static (Polarized) -> Dryish
  }

  let type = 'NEUTRAL';
  if (score >= 7) type = 'WET';
  else if (score <= 2) type = 'DRY';

  return { type, score, maxConnectivity, maxSuit, maxRankCount, ranks };
};
export const getDrawCategory = (hand, board) => {
  const outsData = calculateOuts(hand, board);
  if (outsData.outs >= 12) return 'DRAW_MONSTER';
  if (outsData.outs >= 8) return 'DRAW_STRONG';
  if (outsData.outs >= 4) return 'DRAW_WEAK';
  return 'AIR';
}
export const getSimpleHandCategory = (hand, board, evalResult) => {
  const rank = evalResult.rank;

  // Get Rank Values
  const getRankVal = c => '23456789TJQKA'.indexOf(c[0]);
  const handRanks = hand.map(getRankVal).sort((a, b) => b - a);
  const boardRanks = board.map(getRankVal).sort((a, b) => b - a);

  // Board Texture Flags
  const isBoardPaired = boardRanks.some((r, i) => r === boardRanks[i + 1]);
  const isBoardTrips = boardRanks.some((r, i) => r === boardRanks[i + 1] && r === boardRanks[i + 2]);

  const texture = analyzeBoardTexture(board);
  const isBoardFlushPossible = texture.maxSuit >= 3;
  const isBoardStraightPossible = texture.maxConnectivity >= 3;
  const isBoardOnehandFlushPossible = texture.maxSuit >= 4;
  const isBoardOnehandStraightPossible = texture.maxConnectivity >= 4;
  const isPocketPair = hand[0][0] === hand[1][0];
  const isBoardFullHouse = (boardRanks.length >= 5) && (
    (boardRanks[0] === boardRanks[2] && boardRanks[3] === boardRanks[4]) ||
    (boardRanks[0] === boardRanks[1] && boardRanks[2] === boardRanks[4])
  );
  const holeVal = hand.map(c => '23456789TJQKA'.indexOf(c[0])).sort((a, b) => b - a);
  const usedHoleCards = evalResult.cards ? evalResult.cards.filter(c => hand.includes(c)).length : 0;

  // 10: Royal Flush
  // 9: Straight Flush
  if (rank === 10 || rank === 9) {
    if (usedHoleCards === 0) return 'BOARD_CHOP'; // Board is nuts
    return 'NUTS';
  }

  // 8: Quads
  if (rank === 8) {
    // Board is Quads?
    const boardIsQuads = boardRanks.length >= 4 && boardRanks[0] === boardRanks[3];
    if (boardIsQuads) {
      if (getNutStatus(hand, board).isNuts) return 'NUTS'; // Ace Kicker
      return 'BOARD_CHOP'; // High Kicker (K, Q) or Marginal
    }
    return 'NUTS';
  }

  // 7: Full House
  if (rank === 7) {
    if (isBoardFullHouse === 0) return 'BOARD_CHOP';

    // Extract triplet rank from evalResult.total
    const tripRank = Math.floor((evalResult.total % Math.pow(15, 5)) / Math.pow(15, 4));

    if (isBoardFullHouse) {
      if (isPocketPair) {
        // High pocket pair improves the Board Trips to a massive Full House
        return handRanks[0] >= 8 ? 'MONSTER' : 'STRONG'; // Tens (8) or higher
      }
      return 'MARGINAL'; // Using 1 card to fill a boat on a trips board is vulnerable
    }

    const boardPairs = boardRanks.filter((r, i) => r === boardRanks[i + 1]);
    const higherBoardPair = boardPairs.some(r => r > tripRank);

    if (higherBoardPair) return 'STRONG';
    return 'MONSTER';
  }

  // 6: Flush
  if (rank === 6) {
    if (usedHoleCards === 0) {
      return getNutStatus(hand, board).isNuts ? 'BOARD_CHOP' : 'WEAK';
    }
    if (isBoardPaired) return 'GOOD';

    const flushScore = evalResult.score || 0;
    if (usedHoleCards === 2) {
      if (flushScore >= 80) return 'MONSTER';
      if (flushScore >= 40) return 'STRONG';
      return 'GOOD';
    } else {
      // 1-card flush
      if (flushScore >= 90) return 'STRONG';
      if (flushScore >= 60) return 'GOOD';
      return 'MARGINAL';
    }
  }

  // 5: Straight
  if (rank === 5) {
    if (usedHoleCards === 0) {
      // If it's a Broadway straight on board, it's often the nuts (unless flush possible)
      const isNuts = getNutStatus(hand, board).isNuts;
      return isNuts ? 'BOARD_CHOP' : 'WEAK';
    }
    let caseSum = 0;
    if (isBoardPaired) caseSum++;
    if (isBoardFlushPossible) caseSum++;
    if (isBoardOnehandFlushPossible) caseSum++;
    if (usedHoleCards === 1) caseSum++;
    if (usedHoleCards === 2) caseSum--;

    if (caseSum >= 2) return 'GOOD';
    else if (caseSum >= 0) return 'STRONG';
    // else if (caseSum === -1) return 'MONSTER';
    return 'MONSTER';
  }

  // 4: Three of a Kind
  if (rank === 4) {
    if (isBoardTrips) return 'WEAK';
    // Set vs Trips
    let caseSum = 0;
    if (isBoardFlushPossible) caseSum++;
    if (isBoardStraightPossible) caseSum++;
    if (isBoardOnehandFlushPossible) caseSum++;
    if (isBoardOnehandStraightPossible) caseSum++;
    if (isPocketPair) caseSum -= 2;

    if (caseSum >= 3) return 'MARGINAL';
    else if (caseSum >= 2) return 'GOOD';
    else if (caseSum >= 0) return 'STRONG'; // TRIPS
    return 'MONSTER'; // SET 
  }

  // 3: Two Pair
  if (rank === 3) {
    const boardHigh1 = boardRanks[0];
    const boardHigh2 = boardRanks[1] || -1;
    const hole1 = holeVal.includes(boardHigh1);
    const hole2 = holeVal.includes(boardHigh2);
    const myPair = holeVal.find(v => boardRanks.includes(v)) || 0;

    let caseSum = 0;
    if (isBoardFlushPossible) caseSum++;
    if (isBoardStraightPossible) caseSum++;
    if (isBoardOnehandFlushPossible) caseSum++;
    if (isBoardOnehandStraightPossible) caseSum++;

    // Normal Two Pair (No board pair)
    if (hole1 && hole2) caseSum--; // Top Two
    if (hole1 || hole2) caseSum--; // Top Pair + Middle Pair

    // [FIX] If the two-pair is entirely on the board and player matched nothing
    if (!isPocketPair && !hole1 && !hole2) {
      if (holeVal.includes(12)) return 'ACE_HIGH';
      return 'AIR';
    }

    if (myPair < boardHigh1 || myPair < boardHigh2) caseSum += 2; // Counterfeited
    // if ()
    if (caseSum <= -2) return 'MONSTER';
    else if (caseSum === -1) return 'STRONG';
    else if (caseSum === 0) return 'GOOD';
    else if (caseSum <= 2) return 'MARGINAL';
    else return 'WEAK';
  }
  // 2: One Pair
  if (rank === 2) {

    const maxBoard = boardRanks[0];
    const pairedRank = holeVal.find(v => boardRanks.includes(v));
    const kicker = holeVal.find(v => v !== pairedRank);

    // [FIX] If the pair is entirely on the board and player matched nothing
    if (!isPocketPair && pairedRank === undefined) {
      if (holeVal.includes(12)) return 'ACE_HIGH';
      return 'AIR';
    }

    let caseSum = 0;
    if (isBoardFlushPossible) caseSum++;
    if (isBoardStraightPossible) caseSum++;
    if (isBoardOnehandFlushPossible) caseSum++;
    if (isBoardOnehandStraightPossible) caseSum++;
    if (isBoardPaired) caseSum++;

    // Pair strength base weights
    if (isPocketPair) {
      if (handRanks[0] > maxBoard) caseSum -= 2; // High Overpair
      else if (handRanks[0] > (boardRanks[1] || -1)) caseSum++; // Middle pocket pair
      else caseSum += 2; // Underpair
    } else {
      if (pairedRank === maxBoard) caseSum += 0; // Top Pair (Normalized)
      else if (pairedRank === boardRanks[1]) caseSum += 1; // Middle Pair
      else caseSum += 2; // Bottom pair
      // Kicker sensitivity
      if (kicker < 7) caseSum += 2; // Weak Kicker Penalty
      else if (kicker >= 12) caseSum -= 1; // Ace/King Kicker Bonus
    }

    // Final Mapping (User adjusted)
    if (caseSum <= -2) return 'STRONG';
    else if (caseSum <= 0) return 'GOOD';
    else if (caseSum >= 1) return 'MARGINAL';
    return 'WEAK';
  }

  // 1: High Card
  if (rank === 1) {
    if (holeVal.includes(12)) return 'ACE_HIGH';
  }
  return 'AIR';
}
