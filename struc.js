const fs = require('fs');
const path = require('path');

function listProjectStructure(dir, level = 0) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        if (item === 'node_modules' || item === '.git' || item === 'build' || item.startsWith('.')) continue;
        
        const fullPath = path.join(dir, item);
        const isDirectory = fs.statSync(fullPath).isDirectory();
        
        console.log('  '.repeat(level) + (isDirectory ? '📁 ' : '📄 ') + item);
        
        if (isDirectory) {
            listProjectStructure(fullPath, level + 1);
        }
    }
}

listProjectStructure('.');