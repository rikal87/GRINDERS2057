import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PERSONALITIES } from './src/logic/persona.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dialoguesDir = path.join(__dirname, 'src/logic/dialogues');
if (!fs.existsSync(dialoguesDir)) {
  fs.mkdirSync(dialoguesDir);
}

let indexContent = `// Auto-generated dialogues index\n`;
let indexExport = `\nexport const PERSONALITIES = {\n`;

for (const [key, data] of Object.entries(PERSONALITIES)) {
  if (key === 'AN_UNKNOWN_WOMAN') continue; // Handle alias separately
  
  const fileName = key.toLowerCase();
  const varName = `${key}_DIALOGUE`;
  
  let dataStr = JSON.stringify(data, null, 2);
  // Replace string keys with CHAT_TRIGGERS constants
  dataStr = dataStr.replace(/"([A-Z_]+)":/g, "[CHAT_TRIGGERS.$1]:");
  
  const fileContent = `import { CHAT_TRIGGERS } from '../constants.js';\n\nexport const ${varName} = ${dataStr};\n`;
  
  fs.writeFileSync(path.join(dialoguesDir, `${fileName}.js`), fileContent);
  
  indexContent += `import { ${varName} } from './${fileName}.js';\n`;
  indexExport += `  ${key}: ${varName},\n`;
}

indexExport += `  AN_UNKNOWN_WOMAN: FLORENCE_DIALOGUE\n};\n`;
fs.writeFileSync(path.join(dialoguesDir, `index.js`), indexContent + indexExport);

console.log('Successfully extracted all dialogues!');
