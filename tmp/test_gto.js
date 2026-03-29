
import { getGTOMatrix } from '../src/logic/aiEngine/tools/aiBrainRangeTool.js';
import { GTO_RANGES } from '../src/logic/GTORanges.js';

console.log("Starting GTO Test...");
const start = Date.now();
const matrix = getGTOMatrix();
const end = Date.now();

console.log(`GTO Matrix Loaded in ${end - start}ms`);
console.log("Matrix Keys:", Object.keys(matrix));
console.log("VS_3BET IP CALL Size:", matrix.VS_3BET.IP.CALL.size);
console.log("SHORT_STACK OPEN Size:", matrix.SHORT_STACK.OPEN.size);

if (GTO_RANGES.SETS) {
    console.log("GTO_RANGES.SETS found.");
} else {
    console.error("GTO_RANGES.SETS is MISSING!");
}
