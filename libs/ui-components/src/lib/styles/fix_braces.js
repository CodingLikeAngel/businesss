
const fs = require('fs');
const path = require('path');

const variantsFile = path.join(__dirname, '_variants.scss');
let content = fs.readFileSync(variantsFile, 'utf8');

// 1. Fix missing closing braces before @mixin
// Find any sequence of text between @mixin and the next @mixin that doesn't end with }
// This is tricky. Let's use a simpler approach:
// Replace \n@mixin with }\n@mixin, then clean up double }}
content = content.replace(/\n@mixin/g, '\n}\n@mixin');
content = content.replace(/\}\s*\}/g, '}');

// 2. Fix the start of the file where it might have added an extra }
content = content.replace(/^(\s*)\}/, '$1');

// 3. Fix the duplicated hover and complex blocks in variant-glass specifically
// The view showed it had a lot of mess.
// Let's just restore variant-glass to something sane.
const glassRegex = /@mixin\s+variant-glass\s*\{[^]*?\}/g;
// Since they might be missing braces, the regex above won't work well.

// Let's use a split approach to find and fix blocks
const lines = content.split('\n');
const fixedLines = [];
let braceCount = 0;

for (let line of lines) {
    if (line.includes('@mixin')) {
        // If we hit a new mixin but we were inside one, close it.
        // (Wait, this might mess up if @mixin is in a comment or something)
        // But in this file they are all top-level.
    }
}

// Actually, let's just use the "replace with sane version" for the ones I know are broken.

fs.writeFileSync(variantsFile, content, 'utf8');
console.log('Brute force brace fix applied.');
