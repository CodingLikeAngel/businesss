
const fs = require('fs');
const path = require('path');

const variantsFile = 'C:\\Users\\a.nietosu_vitaly\\Desktop\\cosas\\business-template-main\\libs\\ui-components\\src\\lib\\styles\\_variants.scss';
let content = fs.readFileSync(variantsFile, 'utf8');

// Fix the specific known break
content = content.replace(/--theme-border-\s*--theme-radius/g, '--theme-border-width: 2px;\n  --theme-radius');

// Search for other truncated properties (ending in hyphen)
content = content.replace(/([a-z-]+-)\s*\n/gi, (match, p1) => {
    // If it looks like a truncated variable, try to guess or just remove the line
    console.log(`Found truncated line: ${p1}`);
    return ''; // Safer to remove the broken line than guess
});

// Also fix some potential missing semicolons if any
// But mainly let's verify if there are more "--prefix-" followed by nothing.

fs.writeFileSync(variantsFile, content, 'utf8');
console.log('Syntax repair completed.');
