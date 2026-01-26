
const fs = require('fs');
const path = require('path');

const variantsFile = 'C:\\Users\\a.nietosu_vitaly\\Desktop\\cosas\\business-template-main\\libs\\ui-components\\src\\lib\\styles\\_variants.scss';
let content = fs.readFileSync(variantsFile, 'utf8');

function improveVariant(name, content_block) {
    const startPattern = `@mixin variant-${name}`;
    const startIdx = content.indexOf(startPattern);
    if (startIdx !== -1) {
        let nextMixinIdx = content.indexOf('@mixin', startIdx + startPattern.length);
        if (nextMixinIdx === -1) nextMixinIdx = content.length;
        content = content.substring(0, startIdx) + content_block + '\n\n' + content.substring(nextMixinIdx);
        console.log(`UX/UI Improved: variant-${name}`);
    }
}

// 1. ZELDA - Noble & Content-Safe
improveVariant('zelda', `@mixin variant-zelda {
  --theme-bg: #004d2c;
  --theme-accent: #fbdf71;
  
  position: relative;
  background: var(--theme-bg);
  color: var(--theme-accent);
  border: 2px solid var(--theme-accent);
  border-radius: 4px; /* Content safety first */
  padding: 2rem 3rem;
  font-family: 'Cinzel', serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);

  /* Modern decorative corners instead of deforming clip-path */
  &::before, &::after {
    content: '▲';
    position: absolute;
    font-size: 0.8rem;
    opacity: 0.4;
    transition: 0.3s;
  }
  &::before { top: 10px; left: 10px; }
  &::after { bottom: 10px; right: 10px; transform: rotate(180deg); }

  &:hover {
    background: #005a31;
    box-shadow: 0 15px 45px rgba(0,0,0,0.4), 0 0 20px rgba(251, 223, 113, 0.1);
    transform: translateY(-4px);

    &::before, &::after {
      opacity: 1;
      text-shadow: 0 0 10px var(--theme-accent);
    }
  }
}`);

// 2. POKEMON - Iconic & Functional
improveVariant('pokemon', `@mixin variant-pokemon {
  --theme-bg: #ffffff;
  
  position: relative;
  background: var(--theme-bg);
  color: #333;
  border: 4px solid #333;
  border-radius: 20px;
  padding: 2rem;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 0px #333;

  /* PokeBall inspired header decoration instead of deforming the whole component */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 12px;
    background: #ee1515;
    border-bottom: 4px solid #333;
  }

  &::after {
    content: '';
    position: absolute;
    top: 6px; left: 50%; transform: translateX(-50%);
    width: 20px; height: 20px;
    background: #fff;
    border: 4px solid #333;
    border-radius: 50%;
    z-index: 2;
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 0px #ee1515;
    
    &::after {
      background: #ee1515;
      animation: pulse 1s infinite;
    }
  }
}`);

// 3. CYBERPUNK - High-Tech & Readable
improveVariant('cyberpunk', `@mixin variant-cyberpunk {
  --theme-bg: #fcee0a;
  --theme-color: #000000;
  
  position: relative;
  background: var(--theme-bg);
  color: var(--theme-color);
  font-family: 'Orbitron', sans-serif;
  font-weight: 900;
  text-transform: uppercase;
  /* Very subtle notch instead of deep deforming polygon */
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%);
  border: none;
  padding: 2rem 3rem;
  transition: all 0.1s;
  box-shadow: 6px 6px 0px #000;

  &::before {
    content: 'TRML_VX_99';
    position: absolute;
    bottom: 5px; left: 10px;
    font-size: 0.5rem;
    letter-spacing: 1px;
    opacity: 0.6;
  }

  &:hover {
    background: #00f3ff;
    transform: translate(-3px, -3px);
    box-shadow: 12px 12px 0px #ff003c;
    
    &::before {
      content: 'ERROR_REWRITE';
      color: #ff003c;
    }
  }
}`);

// 4. WATER - Fluid & Professional
improveVariant('water', `@mixin variant-water {
  --theme-bg: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  --theme-color: #fff;
  
  background: var(--theme-bg);
  border-radius: 16px;
  padding: 2rem 3rem;
  position: relative;
  overflow: hidden;
  transition: all 0.5s ease;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2);

  /* Use a wavy pseudo-element for decoration instead of deforming the component */
  &::before {
    content: '';
    position: absolute;
    bottom: -50%; left: -25%; width: 150%; height: 100%;
    background: rgba(255,255,255,0.1);
    border-radius: 40%;
    animation: rotate 10s linear infinite;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(37, 99, 235, 0.3);
    
    &::before {
      animation-duration: 5s;
    }
  }
}`);

// 5. ROCKSTAR - Impactful & Clean
improveVariant('rockstar', `@mixin variant-rockstar {
  --theme-bg: #000;
  --theme-color: #f9d71c;
  
  background: var(--theme-bg);
  color: var(--theme-color);
  font-family: 'Impact', 'Arial Black', sans-serif;
  text-transform: uppercase;
  padding: 2rem 4rem;
  border-radius: 0;
  border-left: 8px solid #f9d71c;
  position: relative;
  transition: all 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67);
  box-shadow: 8px 8px 0px rgba(0,0,0,0.2);

  &:hover {
    background: #111;
    border-left-width: 16px;
    padding-left: 4.5rem;
    color: #fff;
    box-shadow: 12px 12px 0px rgba(249, 215, 28, 0.3);
  }
}`);

// 6. CRYSTAL - Sophisticated & Safe
improveVariant('crystal', `@mixin variant-crystal {
  --theme-bg: rgba(255, 255, 255, 0.8);
  --theme-color: #0369a1;
  
  background: var(--theme-bg);
  backdrop-filter: blur(12px);
  color: var(--theme-color);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);

  /* Faceted light effect in background */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 45%, rgba(255,255,255,0.6) 50%, transparent 55%);
    background-size: 200% 200%;
    animation: shimmer-fast 6s infinite;
    pointer-events: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.95);
    transform: scale(1.01);
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    border-color: var(--theme-color);
  }
}`);

fs.writeFileSync(variantsFile, content, 'utf8');
console.log('UX/UI Harmonization Finished.');
