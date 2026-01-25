
const fs = require('fs');
const path = require('path');

const variantsFile = path.join(__dirname, '_variants.scss');
let content = fs.readFileSync(variantsFile, 'utf8');

// Robust replacement for specifically broken mixins
function forceFix(name, content_block) {
    const regex = new RegExp(`@mixin\\s+variant-${name}\\s*(\([^)]*\))?\\s*\\{[^]*?\\n(@mixin|$)`, 'g');
    // Using a more manual search because regex might fail on messy braces
    const startPattern = `@mixin variant-${name}`;
    const startIdx = content.indexOf(startPattern);
    if (startIdx !== -1) {
        // Find next @mixin after this one
        let nextMixinIdx = content.indexOf('@mixin', startIdx + startPattern.length);
        if (nextMixinIdx === -1) nextMixinIdx = content.length;
        
        const oldBlock = content.substring(startIdx, nextMixinIdx);
        content = content.substring(0, startIdx) + content_block + '\n\n' + content.substring(nextMixinIdx);
        console.log(`Force fixed variant-${name}`);
    }
}

forceFix('glass', `@mixin variant-glass {
  --theme-bg: rgba(255, 255, 255, 0.05);
  --theme-color: #ffffff;
  --theme-accent: #ffffff;
  --theme-radius: 2rem;
  --theme-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  --theme-border: 1px solid rgba(255, 255, 255, 0.15);
  
  position: relative;
  overflow: hidden;
  background: var(--theme-bg);
  backdrop-filter: blur(25px) saturate(200%);
  -webkit-backdrop-filter: blur(25px) saturate(200%);
  border-radius: var(--theme-radius);
  border: var(--theme-border) !important;
  color: var(--theme-color);
  box-shadow: var(--theme-shadow);

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    transform: rotate(30deg);
    pointer-events: none;
    transition: all 0.8s ease;
  }

  &:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.4) !important;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    
    &::before {
      transform: rotate(45deg) translate(10%, 10%);
    }
  }

  p, span, h1, h2, h3, h4, h5, h6 {
    text-shadow: 0 4px 8px rgba(0,0,0,0.5);
    letter-spacing: 0.5px;
  }
}`);

forceFix('neon', `@mixin variant-neon {
  --theme-bg: #050505;
  --theme-color: #ffffff;
  --theme-accent: #00f3ff;
  --theme-radius: 12px;
  --theme-shadow: 0 0 15px rgba(0, 243, 255, 0.4);
  --theme-border: 2px solid #00f3ff;
  
  position: relative;
  background: var(--theme-bg);
  color: var(--theme-color);
  border-radius: var(--theme-radius);
  border: var(--theme-border) !important;
  box-shadow: var(--theme-shadow);
  font-family: 'Orbitron', sans-serif;
  transition: all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 14px;
    background: linear-gradient(45deg, #00f3ff, #ff00ff, #00ff88, #00f3ff);
    background-size: 400% 400%;
    z-index: -1;
    opacity: 0.5;
    filter: blur(10px);
    animation: gradient-shift 3s ease infinite;
  }

  &:hover {
    transform: scale(1.03) translateY(-2px);
    border-color: #ff00ff !important;
    box-shadow: 0 0 30px rgba(255, 0, 255, 0.6);
    
    &::before {
      opacity: 0.8;
      filter: blur(15px);
    }
  }

  * {
    color: #fff !important;
    text-shadow: 0 0 10px rgba(0, 243, 255, 0.8);
  }
}`);

forceFix('cyberpunk', `@mixin variant-cyberpunk {
  --theme-bg: #fcee0a;
  --theme-color: #1a1a1a;
  --theme-accent: #00ffcc;
  --theme-radius: 0px;
  --theme-border: 4px solid #000;
  --theme-shadow: 10px 10px 0px #000, 0 0 30px rgba(252, 238, 10, 0.4);

  position: relative;
  background: var(--theme-bg);
  color: var(--theme-color);
  clip-path: polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%);
  border: none;
  font-family: 'Orbitron', sans-serif;
  font-weight: 900;
  text-transform: uppercase;
  padding: 2rem 3rem;
  transition: all 0.15s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  box-shadow: var(--theme-shadow);

  &::before {
    content: 'SYSTEM_OK';
    position: absolute;
    top: 8px;
    right: 20px;
    font-size: 0.6rem;
    letter-spacing: 3px;
    opacity: 0.7;
    animation: binary-flicker 2s infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.05) 50%);
    background-size: 100% 4px;
    pointer-events: none;
  }

  &:hover {
    transform: translate(-5px, -5px);
    box-shadow: 15px 15px 0px #000, 0 0 40px rgba(0, 255, 204, 0.5);
    background: var(--theme-accent);
    color: #000;

    &::before {
      content: 'USER_AUTH';
      color: #ff003c;
    }
  }

  &.section {
    background: #000;
    color: #fcee0a;
    border: 4px solid #fcee0a;
    box-shadow: 20px 20px 0px rgba(252, 238, 10, 0.2);
    
    &:hover {
      box-shadow: 25px 25px 0px rgba(252, 238, 10, 0.4);
    }
  }
}`);

fs.writeFileSync(variantsFile, content, 'utf8');
console.log('Final restoration applied.');
