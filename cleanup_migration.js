import fs from 'fs';
import path from 'path';

const root = 'd:/github-repository/CyberPoker2077';
const targetBase = path.join(root, 'harness/legacy');

const mappings = {
    'tests': /^test_.*\.m?js$/,
    'verifications': /^verify_.*\.js$/,
    'debug': /^(debug|repro|tmp_verify)_.*\.js$/,
    'scripts': /^.*\.py$/
};

// Create dirs if they don't exist
Object.keys(mappings).forEach(dir => {
    const dirPath = path.join(targetBase, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created ${dirPath}`);
    }
});

const files = fs.readdirSync(root);

files.forEach(file => {
    for (const [dir, regex] of Object.entries(mappings)) {
        if (regex.test(file)) {
            const oldPath = path.join(root, file);
            const newPath = path.join(targetBase, dir, file);
            try {
                fs.renameSync(oldPath, newPath);
                console.log(`Moved ${file} -> ${path.join('legacy', dir, file)}`);
            } catch (err) {
                console.error(`Failed to move ${file}: ${err.message}`);
            }
            break; 
        }
    }
});

console.log('Cleanup complete.');
