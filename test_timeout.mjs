import { runSimulation } from './src/logic/simulate_ai_match.js';
console.log('Running test script...');
setTimeout(() => {
  console.log('Timeout reached. Exiting...');
  process.exit(1);
}, 5000);
import('./src/logic/simulate_ai_match.js').catch(e => {
  console.log('Error:', e);
});
