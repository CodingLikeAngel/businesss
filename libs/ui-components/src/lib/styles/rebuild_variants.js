
const fs = require('fs');
const path = require('path');

const variantsFile = path.join(__dirname, '_variants.scss');
let content = fs.readFileSync(variantsFile, 'utf8');

// 1. Fix the top mixin once and for all
const blocks = content.split('\n@mixin');
// blocks[0] is the @use part
// blocks[1] is the unified-variant-base part

const baseMixin = ` unified-variant-base($bg, $color, $accent, $glow-color) {
  --theme-bg: #{$bg};
  --theme-color: #{$color};
  --theme-accent: #{$accent};
  --theme-border: 1px solid rgba($accent, 0.5);
  --theme-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1),
    0 0 20px rgba($glow-color, 0.2);
  --theme-glow: 0 0 30px rgba($glow-color, 0.6), 0 0 60px rgba($glow-color, 0.2);

  background: var(--theme-bg);
  color: var(--theme-color);
  border: var(--theme-border);
  border-radius: $unified-border-radius;
  box-shadow: var(--theme-shadow);
  font-family: $unified-font-family;
  font-weight: $unified-font-weight;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, transparent, rgba(255,255,255,0.05), transparent);
    transform: translateX(-100%);
    transition: 0.6s;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: var(--theme-glow), 0 12px 24px rgba(0, 0, 0, 0.2);
    border-color: rgba($accent, 0.8);
    
    &::before {
      transform: translateX(100%);
    }
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
  }
}`;

blocks[1] = baseMixin;

// Also fix the corrupted variant-primary and secondary if they grew extra braces
// or lost them. Actually, I will apply a general brace equalizer to all blocks.

function equalize(block) {
    let count = 0;
    let result = '';
    const lines = block.split('\n');
    for (let line of lines) {
        if (line.includes('@mixin')) {
            // skip the name line for counting if it doesn't have { yet
        }
        for (let char of line) {
            if (char === '{') count++;
            if (char === '}') count--;
        }
        result += line + '\n';
    }
    while (count > 0) {
        result += '}\n';
        count--;
    }
    // Simple way to avoid nested mess in this specific file:
    // If a line starts with @mixin, we should have closed previous.
    return result.trim();
}

const cleanedBlocks = blocks.map((b, i) => i === 0 ? b : equalize(b));

content = cleanedBlocks.join('\n@mixin ');

fs.writeFileSync(variantsFile, content, 'utf8');
console.log('Rebuilt file structure.');
