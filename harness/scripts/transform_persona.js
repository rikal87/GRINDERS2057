const fs = require('fs');
const path = 'd:\\github-repository\\CyberPoker2077\\src\\logic\\persona.js';

let content = fs.readFileSync(path, 'utf8');

// The regex looks for [CHAT_TRIGGERS.SOME_EVENT]: [ ... ]
// the challenge is safely matching [...].
// Since arrays contain arrays of strings, we can look for `[` followed by contents then `]`.
// A better way is using a pattern that stops at `],\n` or similar.
// Actually, they look like this:
// [CHAT_TRIGGERS.GAME_START]: [
//   "String",
//   "String"
// ], // or ]
// So we can capture the inside of the array.

const regex = /\[CHAT_TRIGGERS\.([A-Z_]+)\]:\s*\[([\s\S]*?)\](,?(\n|\r))/g;

content = content.replace(regex, (match, p1, p2, p3) => {
    // If it already has `{ en:`, then skip (though it shouldn't)
    if (match.includes('{ en:')) return match;
    
    // Some lines might have empty arrays: `[]`
    // Or single line: `["hello", "world"],`
    // We will wrap p2 in { en: [...], ko: [] }
    return `[CHAT_TRIGGERS.${p1}]: {
      en: [${p2}],
      ko: []
    }${p3}`;
});

fs.writeFileSync(path, content, 'utf8');
console.log("Transformation complete.");
