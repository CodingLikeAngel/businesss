
const fs = require('fs');
const path = require('path');

const variantsFile = 'C:\\Users\\a.nietosu_vitaly\\Desktop\\cosas\\business-template-main\\libs\\ui-components\\src\\lib\\styles\\_variants.scss';
const content = fs.readFileSync(variantsFile, 'utf8');
const lines = content.split(/\r?\n/);

let balance = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let char of line) {
        if (char === '{') balance++;
        if (char === '}') balance--;
        
        if (balance < 0) {
            console.log(`NEGATIVE BALANCE at line ${i + 1}: balance=${balance}`);
            console.log(`Line content: ${JSON.stringify(line)}`);
            // Reset balance to debug further
            balance = 0; 
        }
    }
}
console.log(`Final balance: ${balance}`);
