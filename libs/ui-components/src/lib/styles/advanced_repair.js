
const fs = require('fs');
const path = require('path');

const variantsFile = 'C:\\Users\\a.nietosu_vitaly\\Desktop\\cosas\\business-template-main\\libs\\ui-components\\src\\lib\\styles\\_variants.scss';
let content = fs.readFileSync(variantsFile, 'utf8');

console.log('Original length:', content.length);

// 1. Fix mashed semicolons and braces
content = content.replace(/(\w+;)\s*\{/g, '$1\n  '); // Remove suspicious opening braces after semicolons
content = content.replace(/\}\s*(\w+:)/g, '}\n  $1'); // Ensure space after closing brace
content = content.replace(/;\s*@mixin/g, ';\n\n@mixin'); // Ensure mixins start on new lines

// 2. Fix the specific "variant-outline" and "variant-ghost" area which seems most corrupted
const corruptedAreaStart = content.indexOf('@mixin variant-outline');
if (corruptedAreaStart !== -1) {
    const nextMixin = content.indexOf('@mixin variant-glass', corruptedAreaStart + 20);
    if (nextMixin !== -1) {
        const replacement = `@mixin variant-outline {
  --theme-bg: transparent;
  --theme-color: currentColor;
  --theme-border-width: 2px;
  --theme-radius: 10px;
  background: var(--theme-bg);
  color: var(--theme-color);
  border: var(--theme-border-width) solid currentColor;
  border-radius: var(--theme-radius);
}

@mixin variant-ghost {
  --theme-bg: transparent;
  --theme-color: currentColor;
  --theme-radius: 6px;
  background: var(--theme-bg);
  color: var(--theme-color);
  border: none;
  border-radius: var(--theme-radius);
  &:hover { background: rgba(0,0,0,0.05); }
}

`;
        content = content.substring(0, corruptedAreaStart) + replacement + content.substring(nextMixin);
        console.log('Manually reconstructed outline/ghost mixins.');
    }
}

// 3. Global Cleanup of weird characters (non-ascii that might have slipped in)
// content = content.replace(/[^\x00-\x7F]/g, ''); // Be careful with this if there are emojis

// 4. Double check for the specific error at line 109
const lines = content.split('\n');
console.log('Line 108:', lines[107]);
console.log('Line 109:', lines[108]);
console.log('Line 110:', lines[109]);

fs.writeFileSync(variantsFile, content, 'utf8');
console.log('File repair finished.');
