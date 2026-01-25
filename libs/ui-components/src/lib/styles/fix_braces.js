
const fs = require('fs');
const path = require('path');

const variantsFile = path.join(__dirname, '_variants.scss');
let content = fs.readFileSync(variantsFile, 'utf8');

let output = '';
let currentBraces = 0;

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Check if next line contains @mixin and currentBraces > 0
    if (line.trim().startsWith('@mixin') && currentBraces > 0) {
        output += '}\n'.repeat(currentBraces);
        currentBraces = 0;
    }
    
    output += line + '\n';
    
    for (let char of line) {
        if (char === '{') currentBraces++;
        if (char === '}') currentBraces--;
    }
}

// Final cleanup
content = output;
content = content.replace(/\}\s*\}/g, '}'); // Fix doubles
content = content.replace(/^(\s*)\}/, ''); // Fix start of file
content = content.replace(/\};\s*\n/g, '}\n'); // Fix stray semicolons

fs.writeFileSync(variantsFile, content, 'utf8');
console.log('Brute force brace fix applied.');
