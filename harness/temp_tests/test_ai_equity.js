// harness/temp_tests/test_ai_equity.js
function calculateContProb(estimatedEquity, WTSD, potOdds, street, callAmt) {
    let wtsdBonus = (WTSD - 0.2) * 0.8;
    const decentHandFactor = Math.max(0, Math.min(1, (estimatedEquity - 0.25) / 0.20));
    wtsdBonus *= decentHandFactor;
    
    const perceivedEq = estimatedEquity + wtsdBonus;
    let continueProb = 0.1 + (perceivedEq * 1.5);

    if (callAmt > 0) {
        const universalPressure = potOdds * 0.5;
        continueProb = Math.max(0.05, continueProb - universalPressure);
    }

    if (estimatedEquity >= 0.45) {
      const baseProt = (street === 'FLOP' ? 0.70 : 0.35);
      const floorPressure = Math.min(0.5, potOdds) * 0.6;
      continueProb = Math.max(continueProb, baseProt - floorPressure);
    }
    return continueProb;
}

const WTSD = 0.45; // Gangster calling station (very loose)
const potOdds = 0.33; // ~half pot bet
const callAmt = 1000; // Facing a bet

console.log("--- AI Continuation Probability Test ---");
console.log(`Villian WTSD: ${WTSD} | Facing Bet PotOdds: ${potOdds.toFixed(2)}`);
console.log("----------------------------------------");

const testCases = [
    { eq: 0.20, label: "Garbage" },
    { eq: 0.35, label: "Weak Draw" },
    { eq: 0.50, label: "Marginal Pair" },
    { eq: 0.70, label: "Strong Pair" }
];

testCases.forEach(tc => {
    const prob = calculateContProb(tc.eq, WTSD, potOdds, 'TURN', callAmt);
    console.log(`Equity: ${(tc.eq * 100).toFixed(0)}% [${tc.label.padEnd(13)}] --> Cont-P: ${(prob * 100).toFixed(1)}%`);
});
