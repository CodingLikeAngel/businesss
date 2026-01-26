
const fs = require('fs');
const path = require('path');

const variantsFile = 'C:\\Users\\a.nietosu_vitaly\\Desktop\\cosas\\business-template-main\\libs\\ui-components\\src\\lib\\styles\\_variants.scss';
let content = fs.readFileSync(variantsFile, 'utf8');

// 1. Remove all trace of deforming clip-paths and their comments
content = content.replace(/\/\* removed clip-path:[^*]+\*\//g, '');
content = content.replace(/\/\* safe \*\//g, '');
content = content.replace(/\/\* Removed deforming clip-path \*\//g, '');
content = content.replace(/clip-path\s*:[^;]+;/g, '');

// 2. Standardize border radius (ensure no 50% on variants)
content = content.replace(/border-radius\s*:\s*50%;/g, 'border-radius: var(--theme-radius, 1rem);');

// 3. Remove auto-width/height comments
content = content.replace(/\/\* auto-width \*\//g, '');
content = content.replace(/\/\* auto-height \*\//g, '');
content = content.replace(/\/\* auto-ratio \*\//g, '');
content = content.replace(/\/\* auto \*\//g, '');

// 4. Final normalization of empty lines and braces
content = content.replace(/\n{3,}/g, '\n\n');

fs.writeFileSync(variantsFile, content, 'utf8');
console.log('Final polish completed.');
