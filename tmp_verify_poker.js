import { evaluateHand, getHandCategory, getSimpleHandCategory } from './src/logic/poker.js';

const scenarios = [
  {
    name: "Top Pair on 4-Flush Board",
    hand: ["Ad", "Ks"],
    board: ["As", "Qs", "Js", "Ts", "2d"],
    expectedSimple: "MARGINAL",
  },
  {
    name: "Set on 4-Flush Board",
    hand: ["8d", "8h"],
    board: ["8s", "5s", "3s", "2s", "Kd"],
    expectedSimple: "STRONG", // Downgraded from MONSTER
  },
  {
    name: "Straight on Paired Board",
    hand: ["9d", "8h"],
    board: ["7s", "6s", "5d", "5h", "Kh"],
    expectedSimple: "GOOD", // Downgraded from MONSTER/STRONG
  }
];

console.log("--- Starting Hand Category Comparison ---");

scenarios.forEach(s => {
  const evalResult = evaluateHand([...s.hand, ...s.board]);
  const simple = getSimpleHandCategory(s.hand, s.board, evalResult);
  const advanced = getHandCategory(s.hand, s.board, evalResult);
  
  console.log(`Scenario: ${s.name}`);
  console.log(`Hand: ${s.hand}, Board: ${s.board}`);
  console.log(`Simple: ${simple}`);
  console.log(`Advanced: ${advanced}`);
  console.log(`Match: ${simple === advanced ? "YES" : "NO (Expected for some scenarios due to nutInfo)"}`);
  console.log("-----------------------------------------");
});
