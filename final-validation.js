/**
 * Final Validation Script for Enhanced UI Components
 * 
 * This script validates that all enhanced components with gaming variants
 * are properly integrated and working correctly.
 */

const fs = require('fs');
const path = require('path');

console.log('🎮 Final Validation: Enhanced UI Components');
console.log('==========================================\n');

// Components that have been enhanced
const enhancedComponents = [
  {
    name: 'Button Component',
    files: [
      'libs/ui-components/src/lib/button/button.component.ts',
      'libs/ui-components/src/lib/button/button.component.scss'
    ],
    variantSupport: true,
    gamingVariants: true
  },
  {
    name: 'Input Component',
    files: [
      'libs/ui-components/src/lib/forms/input/input.component.ts',
      'libs/ui-components/src/lib/forms/input/input.component.scss'
    ],
    variantSupport: true,
    gamingVariants: true
  },
  {
    name: 'Card Component',
    files: [
      'libs/ui-components/src/lib/cards/card/card.component.ts',
      'libs/ui-components/src/lib/cards/card/styles/_base.scss'
    ],
    variantSupport: true,
    gamingVariants: true
  },
  {
    name: 'Modal Component',
    files: [
      'libs/ui-components/src/lib/modal/modal.component.ts',
      'libs/ui-components/src/lib/modal/modal.component.scss'
    ],
    variantSupport: true,
    gamingVariants: true
  },
  {
    name: 'Chip Component',
    files: [
      'libs/ui-components/src/lib/chip/chip.component.ts',
      'libs/ui-components/src/lib/chip/styles/_base.scss'
    ],
    variantSupport: true,
    gamingVariants: true
  }
];

// All variants to validate (including gaming and other themes)
const allVariants = [
  'default', 'primary', 'secondary', 'outline', 'ghost', 'link',
  'neon', 'cyberpunk', 'gradient', 'glass', 'retro', 'pulse-gradient',
  'holo', 'matrix', 'quantum', 'cybernetic', 'danger', 'success',
  'nano', 'stellar', 'phoenix', 'galactic', 'orbitron', 'cartoon',
  'luma', 'platform', 'hero', 'coin', 'cloud', 'fire', 'water',
  'leaf', 'amber-glow', 'minimal-white', 'mario', 'zelda', 'kirby',
  'rayman', 'lum', 'river', 'minimal', 'hex-teal', 'purple-edge',
  'rose-radial', 'yellow-pulse', 'green-inset', 'blue-skew',
  'orange-dash', 'indigo-dots', 'bubble', 'electoon', 'jungle',
  'joycon', 'neomorph', 'glitch', 'portal', 'bioshock',
  'super-meat-boy', 'pokemon', 'animal-crossing', 'assassins-creed',
  'far-cry', 'watch-dogs', 'bioshock-enhanced', 'lol', 'overwatch',
  'minecraft', 'fortnite', 'ice', 'metal', 'energy', 'void', 'cosmic',
  'plasma', 'arcade', 'pixel', 'chaos', 'vortex', 'stone', 'donkeykong',
  'supermeatboy', 'aqua', 'vaporwave', 'aurora', 'trailblazer'
];

let allValid = true;

// Validate each enhanced component
console.log('🔍 Validating Enhanced Components:\n');

enhancedComponents.forEach(component => {
  console.log(`📋 ${component.name}:`);
  
  // Check if files exist
  let filesExist = true;
  component.files.forEach(filePath => {
    try {
      fs.accessSync(path.join(__dirname, filePath));
      console.log(`  ✅ File exists: ${path.basename(filePath)}`);
    } catch (error) {
      console.log(`  ❌ File missing: ${path.basename(filePath)}`);
      filesExist = false;
      allValid = false;
    }
  });
  
  // Check variant support in TypeScript files
  if (component.variantSupport) {
    const tsFile = component.files.find(f => f.endsWith('.ts'));
    if (tsFile) {
      try {
        const tsContent = fs.readFileSync(path.join(__dirname, tsFile), 'utf8');
        if (tsContent.includes('variant')) {
          console.log('  ✅ Variant support: Yes');
        } else {
          console.log('  ❌ Variant support: No');
          allValid = false;
        }
      } catch (error) {
        console.log('  ⚠️  Could not check variant support');
      }
    }
  }
  
  // Check gaming variants in SCSS files
  if (component.gamingVariants) {
    const scssFile = component.files.find(f => f.endsWith('.scss'));
    if (scssFile) {
      try {
        const scssContent = fs.readFileSync(path.join(__dirname, scssFile), 'utf8');
        if (scssContent.includes('@include shared.apply-all-variants') || 
            scssContent.includes('apply-all-variants')) {
          console.log('  ✅ Gaming variants: Integrated');
        } else {
          console.log('  ❌ Gaming variants: Not integrated');
          allValid = false;
        }
      } catch (error) {
        console.log('  ⚠️  Could not check gaming variants');
      }
    }
  }
  
  console.log('');
});

// Validate gaming variants in mixins
console.log('🔍 Validating Gaming Variants in Mixins:\n');

const mixinsFilePath = path.join(__dirname, 'libs/ui-components/src/lib/styles/_mixins.scss');
try {
  const mixinsContent = fs.readFileSync(mixinsFilePath, 'utf8');
  
  allVariants.forEach(variant => {
    if (mixinsContent.includes(`@mixin variant-${variant}`)) {
      console.log(`  ✅ ${variant}`);
    } else {
      console.log(`  ❌ ${variant} - Missing`);
      allValid = false;
    }
  });
} catch (error) {
  console.log('  ❌ Could not read mixins file');
  allValid = false;
}

// Validate gaming variants in model
console.log('\n🔍 Validating Gaming Variants in Model:\n');

const modelFilePath = path.join(__dirname, 'libs/ui-components/src/lib/models/ui-components-data.model.ts');
try {
  const modelContent = fs.readFileSync(modelFilePath, 'utf8');
  
  allVariants.forEach(variant => {
    if (modelContent.includes(`'${variant}'`)) {
      console.log(`  ✅ ${variant}`);
    } else {
      console.log(`  ❌ ${variant} - Missing`);
      allValid = false;
    }
  });
} catch (error) {
  console.log('  ❌ Could not read model file');
  allValid = false;
}

// Validate showcase component
console.log('\n🔍 Validating Showcase Component:\n');

const showcaseFilePath = path.join(__dirname, 'libs/ui-components/src/lib/showcase/gaming-variants-showcase.component.ts');
try {
  const showcaseContent = fs.readFileSync(showcaseFilePath, 'utf8');
  console.log('  ✅ Showcase component exists');
  
  allVariants.forEach(variant => {
    if (showcaseContent.includes(variant)) {
      console.log(`  ✅ ${variant} in showcase`);
    } else {
      console.log(`  ❌ ${variant} missing from showcase`);
      allValid = false;
    }
  });
} catch (error) {
  console.log('  ⚠️  Showcase component not found (optional)');
}

// Validate documentation
console.log('\n🔍 Validating Documentation:\n');

const docsFilePath = path.join(__dirname, 'libs/ui-components/docs/GAMING_VARIANTS.md');
try {
  const docsContent = fs.readFileSync(docsFilePath, 'utf8');
  console.log('  ✅ Documentation exists');
  
  allVariants.forEach(variant => {
    if (docsContent.includes(variant)) {
      console.log(`  ✅ ${variant} documented`);
    } else {
      console.log(`  ❌ ${variant} not documented`);
      allValid = false;
    }
  });
} catch (error) {
  console.log('  ❌ Documentation not found');
  allValid = false;
}

// Summary
console.log('\n📊 Final Validation Summary');
console.log('============================');
console.log(`Components Enhanced: ${enhancedComponents.length}`);
console.log(`All Variants: ${allVariants.length}`);
console.log(`Overall Status: ${allValid ? '✅ ALL VALIDATIONS PASSED' : '❌ SOME VALIDATIONS FAILED'}`);

if (allValid) {
  console.log('\n🎉 COMPLETE SUCCESS!');
  console.log('\n📋 Enhanced Components Summary:');
  enhancedComponents.forEach(component => {
    console.log(`  • ${component.name}`);
  });
  
  console.log('\n🎮 All Variants Available:');
  allVariants.forEach(variant => {
    console.log(`  • ${variant}`);
  });
  
  console.log('\n💡 Usage Examples:');
  console.log('  <lib-ui-components-button variant="pokemon">Button</lib-ui-components-button>');
  console.log('  <lib-ui-components-card variant="minecraft">Card</lib-ui-components-card>');
  console.log('  <lib-ui-components-modal variant="fortnite">Modal</lib-ui-components-modal>');
  console.log('  <lib-ui-components-chip variant="lol">Chip</lib-ui-components-chip>');
  console.log('  <lib-ui-components-input variant="animal-crossing" />');
  console.log('  <lib-ui-components-title variant="neon">Title</lib-ui-components-title>');
  console.log('  <lib-ui-components-footer variant="cyberpunk">Footer</lib-ui-components-footer>');
  
  console.log('\n✨ The UI components library has been successfully enhanced with');
  console.log('   a comprehensive set of variants including gaming-inspired themes');
  console.log('   from Nintendo, Ubisoft, Bioshock, League of Legends, and other');
  console.log('   popular franchises, plus additional design themes!');
  
  process.exit(0);
} else {
  console.log('\n⚠️  Please review the validation results above.');
  console.log('Some components may need additional work.');
  process.exit(1);
}