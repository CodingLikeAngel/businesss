
const fs = require('fs');
const path = require('path');

const variantsFile = path.join(__dirname, '_variants.scss');
let content = fs.readFileSync(variantsFile, 'utf8');

const replacements = [
  {
    old: `@mixin variant-secondary {
  --theme-bg: #4b5563;
  --theme-color: white;
  --theme-accent: #9ca3af;
  --theme-radius: 8px;
  background: var(--theme-bg);
  color: var(--theme-color);
  border-radius: var(--theme-radius);
}`,
    new: `@mixin variant-secondary {
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
}`
  },
  {
    old: `@mixin variant-glass {
  --theme-bg: rgba(255, 255, 255, 0.03);
  --theme-color: #ffffff;
  --theme-accent: #ffffff;
  --theme-radius: 2rem;
  --theme-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  --theme-border: 1px solid rgba(255, 255, 255, 0.1);
  --theme-padding: 3rem;
  
  position: relative;
  overflow: hidden;
  background: var(--theme-bg);
  backdrop-filter: blur(25px) saturate(180%);
  -webkit-backdrop-filter: blur(25px) saturate(180%);
  border-radius: var(--theme-radius);
  border: var(--theme-border);
  color: var(--theme-color);
  box-shadow: var(--theme-shadow);

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
    transform: rotate(30deg);
    pointer-events: none;
    transition: all 0.6s ease;
  }

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 
      0 15px 45px 0 rgba(0, 0, 0, 0.45),
      inset 0 0 0 1px rgba(255, 255, 255, 0.1);
    
    &::before {
      transform: rotate(45deg) translate(5%, 5%);
    }
  }

  // Content adjustment
  p, span, h1, h2, h3, h4, h5, h6 {
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
}`,
    new: `@mixin variant-glass {
  --theme-bg: rgba(255, 255, 255, 0.05);
  --theme-color: #ffffff;
  --theme-accent: #ffffff;
  --theme-radius: 2rem;
  --theme-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  --theme-border: 1px solid rgba(255, 255, 255, 0.15);
  --theme-padding: 3rem;
  
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

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%,
      rgba(255, 255, 255, 0.05) 100%
    );
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.4) !important;
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.5),
      inset 0 0 20px rgba(255, 255, 255, 0.1);
    
    &::before {
      transform: rotate(45deg) translate(10%, 10%);
    }
  }

  p, span, h1, h2, h3, h4, h5, h6 {
    text-shadow: 0 4px 8px rgba(0,0,0,0.5);
    letter-spacing: 0.5px;
  }
}`
  },
  {
    old: `@mixin variant-neon {
  --theme-bg: #050505;
  --theme-color: #ffffff;
  --theme-accent: #00f3ff;
  --theme-radius: 12px;
  --theme-shadow: 0 0 20px rgba(0, 243, 255, 0.5);
  --theme-border: 2px solid #00f3ff;
  --theme-font: 'Orbitron', sans-serif;
  
  position: relative;
  background: var(--theme-bg);
  color: var(--theme-color);
  border-radius: var(--theme-radius);
  border: var(--theme-border);
  box-shadow: var(--theme-shadow);
  font-family: var(--theme-font);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  // Enhanced neon glow with multiple layers
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 14px;
    background: linear-gradient(45deg, #00f3ff, #ff00ff, #00f3ff, #00ff88);
    background-size: 300% 300%;
    z-index: -1;
    opacity: 0.4;
    filter: blur(8px);
    animation: neon-flow 4s linear infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 16px;
    background: linear-gradient(45deg, #00f3ff, #ff00ff, #00f3ff);
    background-size: 200% 200%;
    z-index: -2;
    opacity: 0.3;
    filter: blur(12px);
    animation: neon-flow 4s linear infinite reverse;
  }

  &:hover {
    transform: scale(1.05);
    background: #0a0a0a;
    border-color: #ff00ff;
    box-shadow:
      0 0 20px rgba(255, 0, 255, 0.6),
      0 0 40px rgba(255, 0, 255, 0.4),
      inset 0 0 15px rgba(255, 0, 255, 0.2);

    &::before {
      opacity: 0.8;
      filter: blur(12px);
      animation-duration: 2s;
    }

    &::after {
      opacity: 0.6;
      filter: blur(16px);
      animation-duration: 2s;
    }
  }

  // Enhanced Text Neon Effect with color cycling
  * {
    color: #fff !important;
    text-shadow:
      0 0 5px rgba(0, 243, 255, 0.8),
      0 0 10px rgba(0, 243, 255, 0.6),
      0 0 15px rgba(0, 243, 255, 0.4),
      0 0 20px rgba(255, 0, 255, 0.3);
    animation: neon-text-glow 3s ease-in-out infinite alternate;
  }
}`,
    new: `@mixin variant-neon {
  --theme-bg: #050505;
  --theme-color: #ffffff;
  --theme-accent: #00f3ff;
  --theme-radius: 12px;
  --theme-shadow: 0 0 15px rgba(0, 243, 255, 0.4);
  --theme-border: 2px solid #00f3ff;
  --theme-font: 'Orbitron', sans-serif;
  
  position: relative;
  background: var(--theme-bg);
  color: var(--theme-color);
  border-radius: var(--theme-radius);
  border: var(--theme-border) !important;
  box-shadow: var(--theme-shadow);
  font-family: var(--theme-font);
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
}`
  },
  {
    old: `@mixin variant-cyberpunk {
  --theme-bg: #fcee0a;
  --theme-color: #000000;
  --theme-accent: #00ffcc;
  --theme-radius: 0px;
  --theme-border: 4px solid #000;
  --theme-shadow: 8px 8px 0px #000;
  --theme-font: 'Orbitron', sans-serif;
  --theme-clip: polygon(0 0, 100% 0, 100% 80%, 90% 100%, 0 100%);
  --theme-skew: -2deg;
  --theme-padding: 3rem;

  position: relative;
  background: var(--theme-bg);
  color: var(--theme-color);
  clip-path: var(--theme-clip);
  border: none;
  font-family: var(--theme-font);
  font-weight: 900;
  text-transform: uppercase;
  padding: var(--theme-padding);
  transition: all 0.2s ease;
  box-shadow: var(--theme-shadow);

  &::before {
    content: 'AD-2077';
    position: absolute;
    top: 5px;
    right: 15px;
    font-size: 0.6rem;
    letter-spacing: 2px;
    opacity: 0.5;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: #000;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translate(-3px, -3px);
    box-shadow: 11px 11px 0px #000;
    background: #00ffcc; // Cyberpunk Cyan
    color: #000;

    &::after {
      transform: scaleX(1);
      transform-origin: left;
    }
  }

  &.section {
    background: #000;
    color: #fcee0a;
    border: 4px solid #fcee0a;
    box-shadow: 15px 15px 0px rgba(252, 238, 10, 0.3);
  }
}`,
    new: `@mixin variant-cyberpunk {
  --theme-bg: #fcee0a;
  --theme-color: #1a1a1a;
  --theme-accent: #00ffcc;
  --theme-radius: 0px;
  --theme-border: 4px solid #000;
  --theme-shadow: 10px 10px 0px #000, 0 0 30px rgba(252, 238, 10, 0.4);
  --theme-font: 'Orbitron', sans-serif;
  --theme-clip: polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%);
  --theme-padding: 3rem;

  position: relative;
  background: var(--theme-bg);
  color: var(--theme-color);
  clip-path: var(--theme-clip);
  border: none;
  font-family: var(--theme-font);
  font-weight: 900;
  text-transform: uppercase;
  padding: var(--theme-padding);
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
}`
  },
  {
    old: `@mixin variant-matrix {
  --theme-bg: #000000;
  --theme-color: #00ff41;
  --theme-accent: #008f11;
  --theme-radius: 0px;
  --theme-border: 1px solid #00ff41;
  --theme-shadow: 0 0 20px #00ff41;
  --theme-font: 'Courier New', monospace;
  --theme-padding: 3rem;

  background: var(--theme-bg);
  color: var(--theme-color);
  border: var(--theme-border);
  font-family: var(--theme-font);
  position: relative;
  overflow: hidden;
  text-shadow: 0 0 8px #00ff41;
  box-shadow: var(--theme-shadow);
  
  &::before {
    content: '10110100101010110';
    position: absolute;
    top: 0;
    left: 0;
    font-size: 8px;
    opacity: 0.1;
    white-space: nowrap;
    animation: matrix-rain 2s linear infinite;
  }

  &:hover {
    background: rgba(0, 255, 65, 0.1);
    transform: scale(1.02);
  }
}`,
    new: `@mixin variant-matrix {
  --theme-bg: #000;
  --theme-color: #00ff41;
  --theme-accent: #003b00;
  --theme-radius: 0px;
  --theme-border: 1px solid #00ff41;
  --theme-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
  --theme-font: 'Courier New', monospace;

  background: var(--theme-bg);
  color: var(--theme-color);
  border: var(--theme-border);
  font-family: var(--theme-font);
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
    overflow: hidden;
    line-height: 1;
    word-break: break-all;
    animation: matrix-rain 10s linear infinite;
    pointer-events: none;
  }

  &:hover {
    background: #001100;
    box-shadow: 0 0 40px rgba(0, 255, 65, 0.5);
    transform: perspective(500px) rotateX(2deg);
    
    &::before {
      color: rgba(0, 255, 65, 0.3);
    }
  }
}`
  },
  {
    old: `@mixin variant-holo {
  @include unified-variant-base(
    linear-gradient(135deg, #0c4a6e, #0369a1, #0284c7),
    #ffffff,
    #7dd3fc,
    #0ea5e9
  );
  border-radius: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 300;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg,
      transparent,
      rgba(125, 211, 252, 0.4) 20%,
      rgba(14, 165, 233, 0.4) 50%,
      rgba(125, 211, 252, 0.4) 80%,
      transparent
    );
    animation: holo-wave 3s ease-in-out infinite;
  }

  &::after {
    content: '⟡';
    position: absolute;
    top: 50%;
    right: -20px;
    transform: translateY(-50%);
    font-size: 1.2rem;
    color: #7dd3fc;
    text-shadow: 0 0 10px #7dd3fc;
    animation: holo-gem 2s ease-in-out infinite;
  }

  &:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 0 25px rgba(14, 165, 233, 0.8), 0 0 40px rgba(125, 211, 252, 0.6);
  }

  &:active {
    transform: translateY(0) scale(0.99);
  }
}`,
    new: `@mixin variant-holo {
  --theme-bg: linear-gradient(135deg, rgba(12, 74, 110, 0.8) 0%, rgba(3, 105, 161, 0.8) 100%);
  --theme-color: #fff;
  --theme-accent: #7dd3fc;
  
  background: var(--theme-bg);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(125, 211, 252, 0.3);
  color: var(--theme-color);
  position: relative;
  overflow: hidden;
  transition: all 0.5s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2) 50%,
      transparent
    );
    transform: skewX(-20deg) translateX(-150%);
    transition: 0.8s;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 30px rgba(14, 165, 233, 0.5);
    border-color: rgba(125, 211, 252, 0.6);
    
    &::before {
      transform: skewX(-20deg) translateX(150%);
    }
  }

  * {
    text-shadow: 0 0 10px rgba(125, 211, 252, 0.5);
  }
}`
  },
  {
    old: `@mixin variant-zelda {
  @include unified-variant-base(
    linear-gradient(135deg, #228b22, #daa520, #4169e1),
    #ffffff,
    #ffd700,
    #228b22
  );
  position: relative;
  overflow: hidden;
  font-family: 'serif';
  border-radius: 0;
  border: 3px solid #daa520;
  clip-path: polygon(0 20%, 20% 0, 80% 0, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0 80%);
  background-image:
    radial-gradient(circle at 25% 25%, rgba(255,215,0,0.3) 0%, transparent 30%),
    radial-gradient(circle at 75% 75%, rgba(65,105,225,0.2) 0%, transparent 30%),
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 10 L70 40 L50 70 L30 40 Z" fill="rgba(255,255,255,0.1)"/></svg>');
  background-size: 40px 40px;
  text-shadow: 2px 2px 0 rgba(0,0,0,0.5);

  &::before {
    content: '🗡️⚔️';
    position: absolute;
    top: -15px;
    right: -15px;
    font-size: 2rem;
    opacity: 0.9;
    animation: sword-shine 3s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg,
      transparent 40%,
      rgba(255,215,0,0.2) 45%,
      rgba(255,215,0,0.2) 55%,
      transparent 60%
    );
    animation: triforce-glow 4s ease-in-out infinite;
    pointer-events: none;
  }

  &:hover {
    transform: scale(1.05) rotate(1deg);
    box-shadow: 0 0 30px rgba(218, 165, 32, 0.8), 0 0 50px rgba(34, 139, 34, 0.6);
    clip-path: polygon(0 15%, 15% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%);
    background-image:
      radial-gradient(circle at 25% 25%, rgba(255,215,0,0.5) 0%, transparent 30%),
      radial-gradient(circle at 75% 75%, rgba(65,105,225,0.4) 0%, transparent 30%),
      url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 10 L70 40 L50 70 L30 40 Z" fill="rgba(255,255,255,0.2)"/></svg>');
  }

  &:active {
    transform: scale(0.98) rotate(-0.5deg);
  }
}`,
    new: `@mixin variant-zelda {
  position: relative;
  padding: 2rem 4rem;
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
    opacity: 0.8;
    animation: triforce-glow 2s infinite;
  }

  &:hover {
    background: #007c44;
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(251, 223, 113, 0.6);
    
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(rgba(255,255,255,0.1), transparent);
    }
  }

  * {
    text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.8);
  }
}`
  }
];

replacements.forEach(r => {
    const normalizedOld = r.old.replace(/\r\n/g, '\n');
    content = content.replace(/\r\n/g, '\n'); 
    if (content.includes(normalizedOld)) {
        content = content.replace(normalizedOld, r.new.replace(/\r\n/g, '\n'));
        console.log('Replaced a block.');
    } else {
        console.log('Could not find block.');
    }
});

fs.writeFileSync(variantsFile, content, 'utf8');
