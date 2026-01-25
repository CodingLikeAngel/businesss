
const fs = require('fs');
const path = require('path');

const variantsFile = path.join(__dirname, '_variants.scss');
let content = fs.readFileSync(variantsFile, 'utf8');

function improveVariant(name, newStyles) {
    const regex = new RegExp(`@mixin\\s+variant-${name}\\s*(?:\\([^)]*\\))?\\s*\\{[^]*?\\}`, 'g');
    if (content.match(regex)) {
        content = content.replace(regex, `@mixin variant-${name} {\n${newStyles}\n}`);
        console.log(`Improved variant-${name}`);
        return true;
    }
    return false;
}

// 1. Aurora - Northern Lights
improveVariant('aurora', `
  --theme-bg: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  background: linear-gradient(270deg, #00f2fe, #4facfe, #00f2fe);
  background-size: 400% 400%;
  animation: gradient-shift 10s ease infinite;
  color: #fff;
  border: none;
  border-radius: 30px;
  box-shadow: 0 0 20px rgba(79, 172, 254, 0.4);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 15px 30px rgba(79, 172, 254, 0.6);
  }
`);

// 2. Minecraft - Blocky Style
improveVariant('minecraft', `
  --theme-bg: #3c3c3c;
  --theme-color: #fff;
  
  background: #3c3c3c;
  color: #fff;
  image-rendering: pixelated;
  border: 4px solid #000;
  box-shadow: inset -4px -4px 0px 0px rgba(0,0,0,0.5), inset 4px 4px 0px 0px rgba(255,255,255,0.2);
  font-family: 'Press Start 2P', cursive;
  padding: 1rem;
  border-radius: 0;

  &:hover {
    background: #4a4a4a;
    transform: scale(1.05);
  }

  &:active {
    box-shadow: inset 4px 4px 0px 0px rgba(0,0,0,0.5);
  }
`);

// 3. Pokemon - PokeBall Theme
improveVariant('pokemon', `
  position: relative;
  background: linear-gradient(to bottom, #ee1515 50%, #ffffff 50%);
  color: #333;
  border: 4px solid #333;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  font-weight: 800;
  overflow: visible;

  &:hover {
    transform: rotate(2deg) scale(1.05);
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 25px;
    height: 25px;
    background: white;
    border: 4px solid #333;
    border-radius: 50%;
    z-index: 2;
  }
`);

// 4. Default - Clean Dark/Light
improveVariant('default', `
  --theme-bg: #fff;
  --theme-color: #1f2937;
  --theme-border: 1px solid #e5e7eb;
  
  background: var(--theme-bg);
  color: var(--theme-color);
  border: var(--theme-border);
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
`);

// 5. Success/Danger revisited (Global themes)
improveVariant('success', `
  background: #10b981;
  color: #fff;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  &:hover {
    background: #059669;
    box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
  }
`);

improveVariant('danger', `
  background: #ef4444;
  color: #fff;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  &:hover {
    background: #dc2626;
    box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
  }
`);

fs.writeFileSync(variantsFile, content, 'utf8');
console.log('Final batch finished.');
