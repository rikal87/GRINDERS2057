
// Mocking the logic from PotManager.js and gameEngine.js

function getRake(potAmount, isNoFlopNoDrop, rake = 0.05, remainingRakeCap = 50) {
  let theoreticalRake = isNoFlopNoDrop ? 0 : Math.min(potAmount * rake, remainingRakeCap);
  return Math.floor(theoreticalRake);
}

console.log("--- TEST 1: Pre-flop Fold ---");
// Imagine everyone folds, board is empty.
let board = [];
let isNoFlopNoDrop = (board.length === 0);
console.log("Board length:", board.length);
console.log("isNoFlopNoDrop:", isNoFlopNoDrop);
console.log("Rake:", getRake(100, isNoFlopNoDrop)); // Should be 0

console.log("\n--- TEST 2: All-in Pre-flop (Buggy Scenario) ---");
// Imagine all-in pre-flop, board is run out.
board = ['Ah', 'Kh', 'Qh', 'Jh', 'Th'];
isNoFlopNoDrop = (board.length === 0); // This is how gameEngine.js currently does it
console.log("Board length:", board.length);
console.log("isNoFlopNoDrop:", isNoFlopNoDrop);
console.log("Rake:", getRake(1000, isNoFlopNoDrop)); // Should be 0 but will be 50

if (getRake(1000, isNoFlopNoDrop) > 0) {
  console.log("BUG CONFIRMED: Rake taken after all-in pre-flop because board length > 0");
}

console.log("\n--- TEST 3: Proposed Fix ---");
let isFlopDealt = false; // Initial state
// Pre-flop all-in happens... board is populated... 
board = ['Ah', 'Kh', 'Qh', 'Jh', 'Th'];
// But isFlopDealt stayed false because dealFlop was called as part of runout?
// Actually, dealFlop() sets isFlopDealt = true.
// Wait! If dealFlop() is called, it IS a flop.

// No, wait. For an all-in, the rules say "if it started pre-flop, it's no drop".
// So we should track if any flop was dealt *before* we became "resolved".

function getRakeFixed(potAmount, isNoFlopNoDrop, rake = 0.05, remainingRakeCap = 50) {
  return isNoFlopNoDrop ? 0 : Math.floor(Math.min(potAmount * rake, remainingRakeCap));
}

// In my proposed fix, I will pass `!isFlopDealt` where isFlopDealt is ONLY set when 
// the game transitions TO the flop street during betting.

console.log("With !isFlopDealt check (where isFlopDealt=false for pre-flop all-ins):");
console.log("Rake:", getRakeFixed(1000, true)); // passes true for isNoFlopNoDrop
