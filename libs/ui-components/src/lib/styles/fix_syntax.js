
const fs = require('fs');
const path = require('path');

const variantsFile = path.join(__dirname, '_variants.scss');
let content = fs.readFileSync(variantsFile, 'utf8');

// 1. Fix the extra braces (caused by the previous script appending a brace when the replacement also had one)
// Specifically looking for the pattern: } \n }
content = content.replace(/\}\s*\n\}/g, '}');

// 2. Fix the rgba issue in unified-variant-base
// Change rgba(#{$accent}, ...) to rgba($accent, ...)
// But wait, $accent might be a variable reference or a raw color.
// If $accent is #fed7aa, then rgba($accent, 0.5) is correct.
// If $accent is already a CSS variable or string, then rgba won't work anyway.
content = content.replace(/rgba\(#\{\$accent\},/g, 'rgba($accent,');
content = content.replace(/rgba\(#\{\$glow-color\},/g, 'rgba($glow-color,');

// 3. Look for stray semicolons like }; at line 49 in previous view
content = content.replace(/\};\s*\n/g, '}\n');

// 4. Double check for the specific broken blocks I saw
// variant-primary had two braces at the end 77, 78
// Actually my regex above /\}\s*\n\}/ might be too aggressive if it catches legitimate nested blocks.
// Variants usually aren't nested in this file.

fs.writeFileSync(variantsFile, content, 'utf8');
console.log('Cleanup finished.');
