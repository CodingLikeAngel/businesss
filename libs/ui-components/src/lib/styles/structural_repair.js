
const fs = require('fs');
const path = require('path');

const variantsFile = 'C:\\Users\\a.nietosu_vitaly\\Desktop\\cosas\\business-template-main\\libs\\ui-components\\src\\lib\\styles\\_variants.scss';
let content = fs.readFileSync(variantsFile, 'utf8');

// 1. First, fix the major corruption seen in hex earlier
// Remove suspicious characters
content = content.replace(/currentColor;\{/g, 'currentColor;');
content = content.replace(/\}currentColor;/g, '}\n  currentColor;');
content = content.replace(/host \{: 2px;/g, 'host {\n  border-width: 2px;');

// 2. Fix the specific area around line 1217 which looked broken in view_file
// It looked like:
// 1213:   &:hover {
// 1214:     box-shadow: 0 0 30px rgba(0, 255, 255, 0.6);
// 1215:     &::before { opacity: 0.6; }
// 1216: 
// 1217:   * { position: relative; z-index: 1; }
// 1218: }
// 1219: }
// 1220: @mixin variant-default {

// Let's search for this pattern and fix it.
content = content.replace(/&::before \{ opacity: 0.6; \}\s*\* \{ position: relative; z-index: 1; \}\s*\}\s*\}/g, '&::before { opacity: 0.6; }\n    * { position: relative; z-index: 1; }\n  }\n}');

// 3. Move variant-default to the TOP (after initial mixins) to ensure it's always available
const defaultStart = content.indexOf('@mixin variant-default');
if (defaultStart !== -1) {
    let defaultEnd = -1;
    let balance = 0;
    let foundFirstBrace = false;
    for (let i = defaultStart; i < content.length; i++) {
        if (content[i] === '{') { balance++; foundFirstBrace = true; }
        else if (content[i] === '}') {
            balance--;
            if (foundFirstBrace && balance === 0) { defaultEnd = i + 1; break; }
        }
    }
    
    if (defaultEnd !== -1) {
        const defaultMixin = content.substring(defaultStart, defaultEnd);
        content = content.substring(0, defaultStart) + content.substring(defaultEnd);
        
        // Find a good place to insert it (after unified-variant-base)
        const insertionPoint = content.indexOf('}'); // End of unified-variant-base
        if (insertionPoint !== -1) {
            content = content.substring(0, insertionPoint + 1) + '\n\n' + defaultMixin + content.substring(insertionPoint + 1);
            console.log('Moved variant-default to the top.');
        }
    }
}

// 4. Global Structural Fix: Ensure space between mixins
content = content.replace(/\}\s*@mixin/g, '}\n\n@mixin');

fs.writeFileSync(variantsFile, content, 'utf8');
console.log('Structural repair finished.');
