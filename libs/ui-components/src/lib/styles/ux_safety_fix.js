
const fs = require('fs');
const path = require('path');

const variantsFile = 'C:\\Users\\a.nietosu_vitaly\\Desktop\\cosas\\business-template-main\\libs\\ui-components\\src\\lib\\styles\\_variants.scss';
let content = fs.readFileSync(variantsFile, 'utf8');

// 1. Remove ALL clip-path globally in variants to prevent any deformation
content = content.replace(/clip-path\s*:[^;]+;/g, '/* safe */');

// 2. Remove aggressive border-radius that makes components non-rectangular
// Looking for border-radius: 50% or large fixed values in mixins
content = content.replace(/border-radius\s*:\s*(50%|100%|999px|100px|50vw);/g, 'border-radius: var(--theme-radius, 12px);');

// 3. Fix width/height/aspect-ratio constraints that might force circles or distorted boxes
// These usually belong to sub-elements or tiny icons, but in variants they often target the whole component incorrectly
content = content.replace(/(@mixin\s+variant-[^\{]+\{[^}]*)(width\s*:\s*(?!0|auto|100%)[^;]+;)/g, '$1/* auto-width */');
content = content.replace(/(@mixin\s+variant-[^\{]+\{[^}]*)(height\s*:\s*(?!0|auto|100%)[^;]+;)/g, '$1/* auto-height */');
content = content.replace(/(@mixin\s+variant-[^\{]+\{[^}]*)(aspect-ratio\s*:[^;]+;)/g, '$1/* auto-ratio */');

// 4. Special manual fix for problematic brands
function ensureRectangular(name) {
    const regex = new RegExp(`@mixin\\s+variant-${name}\\s*\\{[^]*?\\}`, 'g');
    content = content.replace(regex, (match) => {
        return match
            .replace(/border-radius\s*:[^;]+;/g, 'border-radius: var(--theme-radius, 12px);')
            .replace(/clip-path\s*:[^;]+;/g, '/* safe */')
            .replace(/width\s*:[^;]+;/g, '/* auto */')
            .replace(/height\s*:[^;]+;/g, '/* auto */');
    });
}

const list = ['pokemon', 'kirby', 'zelda', 'circle', 'bubble', 'cloud', 'crystal', 'gear', 'star', 'hexagon'];
list.forEach(ensureRectangular);

fs.writeFileSync(variantsFile, content, 'utf8');
console.log('Final UX safety fix completed.');
