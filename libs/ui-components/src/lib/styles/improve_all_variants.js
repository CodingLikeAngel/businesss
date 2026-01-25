
const fs = require('fs');
const path = require('path');

const variantsFile = path.join(__dirname, '_variants.scss');
let content = fs.readFileSync(variantsFile, 'utf8');

function improveVariant(name, newStyles) {
    const regex = new RegExp(`@mixin\\s+variant-${name}\\s*(?:\\([^)]*\\))?\\s*\\{[^]*?\\}`, 'g');
    const match = content.match(regex);
    if (match) {
        content = content.replace(regex, `@mixin variant-${name} {\n${newStyles}\n}`);
        console.log(`Improved variant-${name}`);
        return true;
    }
    console.log(`Could not find variant-${name}`);
    return false;
}

// 1. Base Mixin
const baseRegex = /@mixin\s+unified-variant-base\s*(\([^)]*\))?\s*\{[^]*?\}/g;
if (content.match(baseRegex)) {
    content = content.replace(baseRegex, `@mixin unified-variant-base($bg, $color, $accent, $glow-color) {
  --theme-bg: #{$bg};
  --theme-color: #{$color};
  --theme-accent: #{$accent};
  --theme-border: 1px solid rgba(#{$accent}, 0.5);
  --theme-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1),
    0 0 20px rgba(#{$glow-color}, 0.2);
  --theme-glow: 0 0 30px rgba(#{$glow-color}, 0.6), 0 0 60px rgba(#{$glow-color}, 0.2);

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
    border-color: rgba(#{$accent}, 0.8);
    
    &::before {
      transform: translateX(100%);
    }
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
  }
}`);
    console.log('Improved unified-variant-base');
}

improveVariant('primary', `
  --theme-bg: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  --theme-color: white;
  --theme-accent: #60a5fa;
  --theme-radius: 12px;
  --theme-shadow: 
    0 10px 15px -3px rgba(37, 99, 235, 0.3),
    0 4px 6px -4px rgba(37, 99, 235, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  
  background: var(--theme-bg);
  color: var(--theme-color);
  border-radius: var(--theme-radius);
  box-shadow: var(--theme-shadow);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 
      0 20px 25px -5px rgba(37, 99, 235, 0.4),
      0 0 15px rgba(59, 130, 246, 0.5);
    filter: brightness(1.1);
  }
`);

improveVariant('secondary', `
  --theme-bg: linear-gradient(135deg, #4b5563 0%, #1f2937 100%);
  --theme-color: white;
  --theme-accent: #9ca3af;
  --theme-radius: 10px;
  background: var(--theme-bg);
  color: var(--theme-color);
  border-radius: var(--theme-radius);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
    filter: contrast(1.1);
  }
`);

improveVariant('glass', `
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
  }

  * {
    text-shadow: 0 4px 8px rgba(0,0,0,0.5);
  }
`);

improveVariant('neon', `
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
  }
`);

improveVariant('cyberpunk', `
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

  &:hover {
    transform: translate(-5px, -5px);
    box-shadow: 15px 15px 0px #000, 0 0 40px rgba(0, 255, 204, 0.5);
    background: var(--theme-accent);
    color: #000;
  }
`);

improveVariant('matrix', `
  --theme-bg: #000;
  --theme-color: #00ff41;
  --theme-border: 1px solid #00ff41;
  
  background: var(--theme-bg);
  color: var(--theme-color);
  border: var(--theme-border);
  font-family: 'Courier New', monospace;
  position: relative;
  overflow: hidden;
  text-shadow: 0 0 10px #00ff41;

  &::before {
    content: '0110101101010110';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: rgba(0, 255, 65, 0.15);
    font-size: 10px;
    word-break: break-all;
    animation: matrix-rain 10s linear infinite;
    pointer-events: none;
  }

  &:hover {
    background: #001100;
    box-shadow: 0 0 40px rgba(0, 255, 65, 0.5);
  }
`);

improveVariant('holo', `
  --theme-bg: linear-gradient(135deg, rgba(12, 74, 110, 0.8) 0%, rgba(3, 105, 161, 0.8) 100%);
  --theme-color: #fff;
  --theme-accent: #7dd3fc;
  
  background: var(--theme-bg);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(125, 211, 252, 0.3);
  position: relative;
  overflow: hidden;
  transition: all 0.5s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2) 50%, transparent);
    transform: skewX(-20deg) translateX(-150%);
    transition: 0.8s;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 30px rgba(14, 165, 233, 0.5);
    
    &::before {
      transform: skewX(-20deg) translateX(150%);
    }
  }
`);

improveVariant('zelda', `
  position: relative;
  padding: 1.5rem 3rem;
  background: #005a31;
  color: #fbdf71;
  border: 4px solid #fbdf71;
  clip-path: polygon(15% 0, 85% 0, 100% 50%, 85% 100%, 15% 100%, 0 50%);
  font-family: 'Cinzel', serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  overflow: hidden;

  &::before {
    content: '▲';
    position: absolute;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.5rem;
    animation: triforce-glow 2s infinite;
  }

  &:hover {
    background: #007c44;
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(251, 223, 113, 0.6);
  }
`);

improveVariant('mario', `
  position: relative;
  overflow: visible;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.8em;
  padding: 1.5rem 3rem;
  background: #e53e3e;
  color: white;
  border: 4px solid #000;
  box-shadow: 6px 6px 0px #000;
  image-rendering: pixelated;

  &::before {
    content: 'M';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    color: #e53e3e;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid #000;
    box-shadow: 4px 4px 0 #000;
  }

  &:hover {
    animation: mario-jump 0.4s ease-out;
    background: #ff5e5e;
    transform: translateY(-5px);
    box-shadow: 10px 10px 0px #000;
  }
`);

improveVariant('minimal', `
  --theme-bg: transparent;
  --theme-color: #1a1a1a;
  --theme-border: 1px solid #e5e5e5;
  
  background: var(--theme-bg);
  border: var(--theme-border);
  color: var(--theme-color);
  border-radius: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: #1a1a1a;
    background: #1a1a1a;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`);

improveVariant('luxury', `
  position: relative;
  background: linear-gradient(135deg, #1c1c1c 0%, #000 100%);
  color: #d4af37;
  border: 1px solid #d4af37;
  padding: 1rem 2rem;
  font-family: 'Cinzel', serif;
  text-transform: uppercase;
  letter-spacing: 3px;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: 0.6s;
  }

  &:hover {
    color: #fff;
    background: #d4af37;
    box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
    
    &::before {
      left: 100%;
    }
  }
`);

improveVariant('retro', `
  --theme-bg: #fdf6e3;
  --theme-color: #657b83;
  --theme-border: 4px solid #b58900;
  --theme-shadow: 4px 4px 0px #b58900;
  
  background: var(--theme-bg);
  color: var(--theme-color);
  border: var(--theme-border);
  box-shadow: var(--theme-shadow);
  font-family: 'Press Start 2P', cursive;
  padding: 1.5rem 2.5rem;
  transition: all 0.1s steps(2);
  
  &:hover {
    transform: translate(-3px, -3px);
    box-shadow: 7px 7px 0px #b58900;
    color: #d33682;
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 0px 0px 0px #b58900;
  }
`);

improveVariant('success', `
  --theme-bg: #10b981;
  background: var(--theme-bg);
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.4);
  transition: all 0.3s;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.5);
    filter: brightness(1.1);
  }
`);

improveVariant('danger', `
  --theme-bg: #ef4444;
  background: var(--theme-bg);
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.4);
  transition: all 0.3s;

  &:hover {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    filter: brightness(1.1);
  }
`);

improveVariant('quantum', `
  --theme-bg: #000;
  --theme-color: #818cf8;
  --theme-border: 1px solid #6366f1;
  
  background: var(--theme-bg);
  border: var(--theme-border);
  color: var(--theme-color);
  box-shadow: 0 0 25px rgba(99, 102, 241, 0.4);
  transition: all 0.5s ease;

  &:hover {
    box-shadow: 0 0 45px rgba(99, 102, 241, 0.7);
    transform: perspective(1000px) rotateY(5deg);
  }
`);

fs.writeFileSync(variantsFile, content, 'utf8');
console.log('Premium improvement process finished.');
