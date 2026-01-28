const fs = require('fs');
const path = require('path');

const files = [
  'libs/ui-components/src/lib/tooltip/tooltip-3/tooltip-3.component.scss',
  'libs/ui-components/src/lib/tooltip/tooltip-2/tooltip-2.component.scss',
  'libs/ui-components/src/lib/tooltip/tooltip-1/tooltip-1.component.scss',
  'libs/ui-components/src/lib/title/title-3/title-3.component.scss',
  'libs/ui-components/src/lib/title/title-2/title-2.component.scss',
  'libs/ui-components/src/lib/title/title-1/title-1.component.scss',
  'libs/ui-components/src/lib/tabs/tabs-3/tabs-3.component.scss',
  'libs/ui-components/src/lib/tabs/tabs-2/tabs-2.component.scss',
  'libs/ui-components/src/lib/tabs/tabs-1/tabs-1.component.scss',
  'libs/ui-components/src/lib/table/table-3/table-3.component.scss',
  'libs/ui-components/src/lib/table/table-2/table-2.component.scss',
  'libs/ui-components/src/lib/table/table-1/table-1.component.scss',
  'libs/ui-components/src/lib/spinner/spinner-3/spinner-3.component.scss',
  'libs/ui-components/src/lib/spinner/spinner-2/spinner-2.component.scss',
  'libs/ui-components/src/lib/spinner/spinner-1/spinner-1.component.scss',
  'libs/ui-components/src/lib/list/list-3/list-3.component.scss',
  'libs/ui-components/src/lib/list/list-2/list-2.component.scss',
  'libs/ui-components/src/lib/modal/modal-2/modal-2.component.scss',
  'libs/ui-components/src/lib/modal/modal-3/modal-3.component.scss',
  'libs/ui-components/src/lib/modal/modal-1/modal-1.component.scss',
  'libs/ui-components/src/lib/gallery/gallery-3/gallery-3.component.scss',
  'libs/ui-components/src/lib/forms/input/input-3/input-3.component.scss',
  'libs/ui-components/src/lib/gallery/gallery-2/gallery-2.component.scss',
  'libs/ui-components/src/lib/forms/input/input-2/input-2.component.scss',
  'libs/ui-components/src/lib/gallery/gallery-1/gallery-1.component.scss',
  'libs/ui-components/src/lib/forms/input/input-1/input-1.component.scss',
  'libs/ui-components/src/lib/chart/chart-1/chart-1.component.scss'
];

let fixedCount = 0;

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    const original = content;
    content = content.replace(/@use '\.\.\/\.\.\/\.\.\/styles\/mixins' as shared;/g, "@use '../../styles/mixins' as shared;");
    if (content !== original) {
      fs.writeFileSync(fullPath, content, 'utf8');
      fixedCount++;
      console.log(`Fixed: ${file}`);
    }
  } else {
    console.log(`Not found: ${file}`);
  }
});

console.log(`\nTotal files fixed: ${fixedCount}`);
