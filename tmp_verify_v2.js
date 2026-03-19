import fs from 'fs';
import { evaluateHand, getHandCategory, getSimpleHandCategory } from './src/logic/poker.js';

const OUT_FILE = 'tmp_verify_results.txt';
function log(msg) {
  console.log(msg);
  fs.appendFileSync(OUT_FILE, msg + '\n');
}

fs.writeFileSync(OUT_FILE, "--- Hand Category Comparison (Nut-First Refactor) ---\n");

const scenarios = [
  {
    name: "Absolute Nuts (Straight Flush)",
    hand: ["As", "Ks"],
    board: ["Qs", "Js", "Ts", "2d", "3d"],
  },
  {
    name: "Strong Hand (Top Pair Top Kicker)",
    hand: ["Ad", "Kd"],
    board: ["As", "7h", "2c", "5d", "9s"],
  },
  {
    name: "Weakened by Board (Top Pair on 4-Flush)",
    hand: ["Ad", "Kd"],
    board: ["As", "Qs", "Js", "Ts", "2d"],
  },
  {
    name: "Marginal Hand (Middle Pair)",
    hand: ["Qs", "Jd"],
    board: ["As", "Qh", "2c", "5d", "9s"],
  }
];

scenarios.forEach(s => {
  const evalResult = evaluateHand([...s.hand, ...s.board]);
  const simple = getSimpleHandCategory(s.hand, s.board, evalResult);
  const advanced = getHandCategory(s.hand, s.board, evalResult);
  
  log(`\nScenario: ${s.name}`);
  log(`Hand: ${s.hand}, Board: ${s.board}`);
  log(`Simple (Heuristic): ${simple}`);
  log(`Advanced (Nut-First): ${advanced}`);
});

log("\n--- Comparison Complete ---");
