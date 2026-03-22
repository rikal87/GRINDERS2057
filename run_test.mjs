import { execSync } from 'child_process';
import fs from 'fs';
try {
  const output = execSync('node src/logic/simulate_ai_match.js', { stdio: 'pipe' });
  fs.writeFileSync('run_test_out.txt', output.toString());
} catch (err) {
  fs.writeFileSync('run_test_out.txt', err.message + '\n\n' + (err.stdout ? err.stdout.toString() : '') + '\n\n' + (err.stderr ? err.stderr.toString() : ''));
}
