import fs from 'fs';
import path from 'path';

const root = 'd:/github-repository/CyberPoker2077';
const targetBase = path.join(root, 'harness/legacy');

// 1. Files in src/logic/debug/
const debugSrc = path.join(root, 'src/logic/debug');
if (fs.existsSync(debugSrc)) {
    const debugFiles = fs.readdirSync(debugSrc);
    debugFiles.forEach(file => {
        const oldPath = path.join(debugSrc, file);
        const newPath = path.join(targetBase, 'debug', file);
        if (fs.statSync(oldPath).isFile()) {
            try {
                fs.renameSync(oldPath, newPath);
                console.log(`Moved src/logic/debug/${file} -> legacy/debug/`);
            } catch (err) {
                console.error(`Failed to move ${file}: ${err.message}`);
            }
        }
    });
}

// 2. Specific simulation/test files in src/logic/
const logicSrc = path.join(root, 'src/logic');
const specificFiles = [
    'simulate_staged_hands.js',
    'simulate_staged_hands.STG.js',
    'simulate_ai_match.js',
    'test_flush_scoring.js',
    'test_node.js'
];

specificFiles.forEach(file => {
    const oldPath = path.join(logicSrc, file);
    const newPath = path.join(targetBase, 'scripts', file);
    if (fs.existsSync(oldPath)) {
        try {
            fs.renameSync(oldPath, newPath);
            console.log(`Moved src/logic/${file} -> legacy/scripts/`);
        } catch (err) {
            console.error(`Failed to move ${file}: ${err.message}`);
        }
    }
});

console.log('Secondary cleanup complete.');
