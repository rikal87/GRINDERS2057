
import fs from 'fs';
console.log('Hello from test_simple');
try {
  fs.writeFileSync('test_simple_out.txt', 'Hello World');
  console.log('File written');
} catch (e) {
  console.error(e);
}
