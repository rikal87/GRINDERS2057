
function calculateIntensity(raises, AF, vPIP) {
    // Current Logic
    const raiseCallIntensity = AF >= 3.0 ? 0.65 : Math.min(0.90, 0.65 + (3.0 - AF) * 0.15);
    let oldIntensity = 1.0;
    if (raises >= 3) oldIntensity = 0.3;
    else if (raises >= 2) oldIntensity = 0.65;
    else if (raises >= 1) oldIntensity = raiseCallIntensity;

    // Proposed Logic 1 (if/else)
    const personalityBonus = (AF * 0.05) + (vPIP * 0.2); 
    let newIntensity = 1.0;
    if (raises >= 3) newIntensity = Math.min(0.85, 0.25 + personalityBonus);
    else if (raises >= 2) newIntensity = Math.min(0.95, 0.55 + personalityBonus);
    else if (raises >= 1) newIntensity = raiseCallIntensity;

    // Proposed Logic 2 (Formula-based)
    let formulaIntensity = 1.0;
    if (raises >= 1) {
        formulaIntensity = Math.pow(0.7, raises) + personalityBonus;
        formulaIntensity = Math.max(0.2, Math.min(0.95, formulaIntensity));
    }

    return { oldIntensity, newIntensity, formulaIntensity };
}

const players = [
    { name: "Nit", AF: 1.0, vPIP: 0.15 },
    { name: "Standard", AF: 2.5, vPIP: 0.27 },
    { name: "LAG", AF: 4.0, vPIP: 0.35 },
    { name: "Maniac", AF: 5.0, vPIP: 0.45 }
];

console.log("--- AI Intensity Comparison (Old vs. New vs. Formula) ---");
[1, 2, 3].forEach(raises => {
    console.log(`\n[Raises: ${raises}] (${raises + 1}-Bet Context)`);
    console.log("Player\t\tAF/vPIP\t\tOld Int\t\tNew(if)\t\tFormula\t\tChange(Formula)");
    console.log("-----------------------------------------------------------------------------------------");
    players.forEach(p => {
        const { oldIntensity, newIntensity, formulaIntensity } = calculateIntensity(raises, p.AF, p.vPIP);
        const diff = (formulaIntensity - oldIntensity).toFixed(2);
        console.log(`${p.name.padEnd(10)}\t${p.AF}/${p.vPIP}\t\t${oldIntensity.toFixed(2)}\t\t${newIntensity.toFixed(2)}\t\t${formulaIntensity.toFixed(2)}\t\t${diff > 0 ? '+' : ''}${diff}`);
    });
});
