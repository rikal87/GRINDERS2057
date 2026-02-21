
import fs from 'fs';
try {
  fs.writeFileSync('test_fs_output.txt', 'Hello FS');
  console.log('Wrote file');
} catch (e) {
  console.error(e);
}
