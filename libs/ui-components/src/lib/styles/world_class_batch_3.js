
const fs = require('fs');
const path = require('path');

const variantsFile = 'C:\\Users\\a.nietosu_vitaly\\Desktop\\cosas\\business-template-main\\libs\\ui-components\\src\\lib\\styles\\_variants.scss';
let content = fs.readFileSync(variantsFile, 'utf8');

function forceFix(name, content_block) {
    const startPattern = `@mixin variant-${name}`;
    const startIdx = content.indexOf(startPattern);
    if (startIdx !== -1) {
        let nextMixinIdx = content.indexOf('@mixin', startIdx + startPattern.length);
        if (nextMixinIdx === -1) nextMixinIdx = content.length;
        content = content.substring(0, startIdx) + content_block + '\n\n' + content.substring(nextMixinIdx);
        console.log(`World Class Design applied to: variant-${name}`);
    } else {
        console.log(`Could not find variant-${name}`);
    }
}

// 1. Glass - Apple/Microsoft Fluent design
forceFix('glass', `@mixin variant-glass {
  --theme-bg: rgba(255, 255, 255, 0.03);
  --theme-color: #ffffff;
  
  background: var(--theme-bg);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 2rem;
  padding: 2.5rem;
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%);
    pointer-events: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-8px) scale(1.01);
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.5),
      inset 0 0 20px rgba(255, 255, 255, 0.1);
  }
}`);

// 2. Neon - Cyberpunk 2077 / OLED Aesthetics
forceFix('neon', `@mixin variant-neon {
  --theme-bg: #000;
  --theme-color: #fff;
  --theme-accent: #00f3ff;
  
  background: #000;
  color: #fff;
  border: 2px solid #00f3ff;
  border-radius: 12px;
  box-shadow: 
    0 0 10px rgba(0, 243, 255, 0.5),
    inset 0 0 10px rgba(0, 243, 255, 0.2);
  font-family: 'Orbitron', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff00ff;
    box-shadow: 
      0 0 20px rgba(255, 0, 255, 0.8),
      0 0 40px rgba(255, 0, 255, 0.4),
      inset 0 0 15px rgba(255, 0, 255, 0.2);
    transform: scale(1.05);
    text-shadow: 0 0 10px #ff00ff;
  }
}`);

// 3. Cyberpunk - High Fidelity Distant Future
forceFix('cyberpunk', `@mixin variant-cyberpunk {
  --theme-bg: #fcee0a;
  --theme-color: #000;
  
  background: var(--theme-bg);
  color: var(--theme-color);
  font-family: 'Orbitron', sans-serif;
  font-weight: 900;
  text-transform: uppercase;
  clip-path: polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%);
  border: none;
  padding: 2rem 3rem;
  position: relative;
  transition: 0.1s;
  box-shadow: 8px 8px 0px #000;

  &::before {
    content: 'ACCESS_GRANTED';
    position: absolute;
    top: 5px; right: 15px;
    font-size: 0.6rem;
    opacity: 0.7;
    letter-spacing: 2px;
  }

  &:hover {
    transform: translate(-4px, -4px);
    box-shadow: 12px 12px 0px #ff003c;
    background: #00f3ff;
    
    &::before {
       content: 'SYS_OVERRIDE';
       color: #ff003c;
    }
  }
}`);

// 4. Matrix - The Digital Rain
forceFix('matrix', `@mixin variant-matrix {
  --theme-bg: #000;
  --theme-color: #00ff41;
  
  background: #000;
  color: #00ff41;
  border: 1px solid #00ff41;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 8px #00ff41;
  position: relative;
  overflow: hidden;

  &::after {
    content: '010111010101101010101101';
    position: absolute;
    top: -100%; left: 0; width: 100%;
    font-size: 10px;
    opacity: 0.15;
    animation: rain 10s linear infinite;
    word-break: break-all;
    pointer-events: none;
  }

  &:hover {
    background: #001100;
    box-shadow: 0 0 25px rgba(0, 255, 65, 0.4);
    letter-spacing: 2px;
  }
}`);

// 5. Quantum - Particle Physics Aesthetic
forceFix('quantum', `@mixin variant-quantum {
  --theme-bg: #0f172a;
  --theme-color: #818cf8;
  
  background: radial-gradient(circle at center, #1e1b4b 0%, #0f172a 100%);
  color: #818cf8;
  border: 1px solid rgba(129, 140, 248, 0.3);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);

  &::before {
    content: '';
    position: absolute;
    inset: -50%;
    background: conic-gradient(from 0deg, transparent, rgba(129, 140, 248, 0.1), transparent);
    animation: rotate 6s linear infinite;
  }

  &:hover {
    transform: perspective(1000px) rotateX(10deg);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(129, 140, 248, 0.2);
    border-color: #818cf8;
  }
}`);

// 6. Aurora - Nature's Soul
forceFix('aurora', `@mixin variant-aurora {
  --theme-bg: linear-gradient(270deg, #00f2fe, #4facfe, #7000ff, #00f2fe);
  --theme-color: #fff;
  
  background: var(--theme-bg);
  background-size: 400% 400%;
  animation: gradient-shift 12s ease infinite;
  color: #fff;
  border: none;
  border-radius: 30px;
  box-shadow: 0 10px 30px rgba(79, 172, 254, 0.3);
  padding: 1rem 3rem;
  font-weight: 700;
  letter-spacing: 1px;

  &:hover {
    transform: scale(1.05) rotate(1deg);
    box-shadow: 0 15px 45px rgba(112, 0, 255, 0.4);
  }
}`);

fs.writeFileSync(variantsFile, content, 'utf8');
console.log('Batch 3 (Ethereal) Finished.');
