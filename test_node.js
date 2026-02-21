
import fs from 'fs';
console.log("Hello from Node");
try {
  fs.writeFileSync('test_node_output.txt', 'Node is working');
  console.log("File written");
} catch (e) {
  console.error(e);
}
