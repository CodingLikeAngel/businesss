
const fs = require('fs');
const variantsFile = 'C:\\Users\\a.nietosu_vitaly\\Desktop\\cosas\\business-template-main\\libs\\ui-components\\src\\lib\\styles\\_variants.scss';
const content = fs.readFileSync(variantsFile, 'utf8');

let balance = 0;
let errors = 0;
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let char of line) {
        if (char === '{') balance++;
        if (char === '}') balance--;
        if (balance < 0) {
            console.error(`Unmatched closing brace at line ${i+1}`);
            errors++;
            balance = 0;
        }
    }
}
if (balance > 0) {
    console.error(`Unclosed opening braces: ${balance}`);
    errors++;
}

// Also check for common syntax errors
content.split('\n').forEach((line, i) => {
    if (line.includes('};')) console.error(`Suspicious closure at line ${i+1}: ${line}`);
    if (line.includes(';{')) console.error(`Mashed brace at line ${i+1}: ${line}`);
});

if (errors === 0) console.log('Brace balance: OK');
else process.exit(1);
