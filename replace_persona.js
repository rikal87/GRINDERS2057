import fs from 'fs';
const file = 'src/logic/persona.js';
let content = fs.readFileSync(file, 'utf8');
const pStart = content.indexOf('export const PERSONALITIES = {');
if (pStart > -1) {
    let pEnd = content.indexOf('PERSONALITIES.AN_UNKNOWN_WOMAN = PERSONALITIES.FLORENCE;');
    if (pEnd > -1) {
        let afterPEnd = content.indexOf('\n', pEnd);
        content = content.substring(0, pStart) + "export { PERSONALITIES } from './dialogues/index.js';\n" + content.substring(afterPEnd + 1);
    } else {
        content = content.substring(0, pStart) + "export { PERSONALITIES } from './dialogues/index.js';\n";
    }
    fs.writeFileSync(file, content);
    console.log("Replaced PERSONALITIES in persona.js");
} else {
    console.log("Could not find PERSONALITIES block.");
}
