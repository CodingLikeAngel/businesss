
const fs = require('fs');
const variantsFile = 'C:\\Users\\a.nietosu_vitaly\\Desktop\\cosas\\business-template-main\\libs\\ui-components\\src\\lib\\styles\\_variants.scss';
const content = fs.readFileSync(variantsFile, 'utf8');

// Normalize line endings and remove possible nul characters or garbage
const cleanContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\0/g, '');

fs.writeFileSync(variantsFile, cleanContent, 'utf8');
console.log('File normalized.');
