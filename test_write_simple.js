import fs from 'fs';
try {
  fs.writeFileSync('test_write.txt', 'HELLO WORLD');
  console.log('Write success');
} catch (e) {
  console.error('Write failed:', e);
}
