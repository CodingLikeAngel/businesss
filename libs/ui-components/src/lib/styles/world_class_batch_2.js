
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

// 1. Mario - Nintendo Tactile Excellence
forceFix('mario', `@mixin variant-mario {
  --theme-bg: #e60012;
  --theme-accent: #fbd000;
  
  position: relative;
  background: var(--theme-bg);
  color: #fff;
  font-family: 'Press Start 2P', system-ui;
  border: 4px solid #000;
  box-shadow: 4px 4px 0px #000;
  padding: 1.2rem 2.5rem;
  transition: all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  overflow: visible;

  &::before {
    content: 'M';
    position: absolute;
    top: -22px; left: 50%; transform: translateX(-50%);
    width: 44px; height: 44px;
    background: #fff;
    color: #e60012;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
    border: 4px solid #000;
    box-shadow: 4px 0px 0px rgba(0,0,0,0.2);
    z-index: 2;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -12px; left: 10%; width: 80%; height: 8px;
    background: rgba(0,0,0,0.2);
    border-radius: 50%;
    filter: blur(2px);
    transition: 0.2s;
  }

  &:hover {
    transform: translateY(-8px);
    background: #ff1a1a;
    box-shadow: 0px 12px 0px #000;
    
    &::after {
      transform: scale(0.8);
      opacity: 0.5;
    }
  }

  &:active {
    transform: translateY(2px);
    box-shadow: 0px 0px 0px #000;
  }
}`);

// 2. Zelda - Royal Elegance
forceFix('zelda', `@mixin variant-zelda {
  --theme-bg: #005a31;
  --theme-accent: #fbdf71;
  
  position: relative;
  background: var(--theme-bg);
  color: var(--theme-accent);
  border: 2px solid var(--theme-accent);
  padding: 1.5rem 4rem;
  font-family: 'Cinzel', serif;
  text-transform: uppercase;
  letter-spacing: 3px;
  clip-path: polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%);
  overflow: hidden;
  transition: all 0.4s ease;

  &::before {
    content: '▲';
    position: absolute;
    top: 5px; left: 50%; transform: translateX(-50%);
    opacity: 0.3;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(rgba(251, 223, 113, 0.05), transparent);
    pointer-events: none;
  }

  &:hover {
    background: #007c44;
    box-shadow: 0 0 30px rgba(251, 223, 113, 0.2);
    transform: scale(1.05);

    &::before {
       opacity: 1;
       text-shadow: 0 0 10px var(--theme-accent);
       animation: pulse 2s infinite;
    }
  }
}`);

// 3. Pokemon - Master UI
forceFix('pokemon', `@mixin variant-pokemon {
  --theme-bg: #fff;
  
  position: relative;
  background: linear-gradient(to bottom, #ee1515 48%, #333 48%, #333 52%, #fff 52%);
  border: 6px solid #333;
  border-radius: 50%;
  width: 120px; height: 120px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);

  &::before {
    content: '';
    position: absolute;
    width: 30px; height: 30px;
    background: #fff;
    border: 6px solid #333;
    border-radius: 50%;
    z-index: 2;
    box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
  }

  &:hover {
    transform: rotate(360deg) scale(1.1);
    box-shadow: 0 20px 40px rgba(238, 21, 21, 0.4);
  }
}`);

// 4. Rockstar - Gritty Rockstar vibe
forceFix('rockstar', `@mixin variant-rockstar {
  --theme-bg: #000;
  --theme-color: #f9d71c;
  
  background: var(--theme-bg);
  color: var(--theme-color);
  font-family: 'Impact', sans-serif;
  text-transform: uppercase;
  font-size: 2rem;
  padding: 1rem 3rem;
  border-left: 15px solid #f9d71c;
  transform: skewX(-10deg);
  transition: all 0.2s;
  box-shadow: 10px 10px 0px rgba(249, 215, 28, 0.2);

  &:hover {
    transform: skewX(-10deg) translate(-5px, -5px);
    box-shadow: 20px 20px 0px rgba(249, 215, 28, 0.4);
    background: #111;
    color: #fff;
  }
}`);

// 5. Ubisoft - Animus Interface
forceFix('ubisoft', `@mixin variant-ubisoft {
  --theme-bg: rgba(255, 255, 255, 0.05);
  --theme-color: #00ffff;
  
  background: var(--theme-bg);
  color: var(--theme-color);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 255, 255, 0.3);
  font-family: 'Exo 2', sans-serif;
  text-transform: uppercase;
  letter-spacing: 5px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 2px;
    background: #00ffff;
    animation: scanline 4s linear infinite;
  }

  &:hover {
    background: rgba(0, 255, 255, 0.1);
    border-color: #00ffff;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
    text-shadow: 0 0 10px #00ffff;
  }
}`);

// 6. Retro - 80s Cyber Excellence
forceFix('retro', `@mixin variant-retro {
  --theme-bg: #2d1b58;
  --theme-color: #ff00ff;
  
  background: var(--theme-bg);
  color: var(--theme-color);
  border: 4px solid #00ffff;
  box-shadow: 8px 8px 0px #00ffff, -8px -8px 0px #ff00ff;
  font-family: 'VT323', monospace;
  font-size: 1.5rem;
  padding: 1rem 2rem;
  transition: all 0.1s steps(2);

  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 4px 4px 0px #00ffff, -4px -4px 0px #ff00ff;
    filter: hue-rotate(90deg);
  }
}`);

fs.writeFileSync(variantsFile, content, 'utf8');
console.log('Batch 2 (Experience) Finished.');
