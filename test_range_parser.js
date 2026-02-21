
import { expandRange } from './src/logic/poker.js';

function testRange(input, expectedCount, description) {
  const result = expandRange(input);
  console.log(`[TEST] ${description}: ${input} -> ${result.length} hands. (Expected: ${expectedCount})`);
  if (result.length !== expectedCount) {
    console.error(`FAILED: Expected ${expectedCount}, got ${result.length}`);
    console.error(result);
  } else {
    console.log("PASSED");
  }
}

console.log("--- Testing Range Parser ---");
testRange("JJ+", 4 * 6, "JJ+ (JJ, QQ, KK, AA)"); // 6 combos each * 4 = 24
testRange("AKs", 4, "AKs (4 suits)");
testRange("AQs+", 2 * 4, "AQs+ (AQs, AKs)");
testRange("22-55", 4 * 6, "22-55 (22,33,44,55)");
testRange("A2s-A5s", 4 * 4, "A2s-A5s (A2s, A3s, A4s, A5s)");
testRange("T9s", 4, "T9s");
testRange("KQo", 12, "KQo (12 combos)");
