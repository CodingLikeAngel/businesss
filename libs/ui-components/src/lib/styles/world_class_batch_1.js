
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

// 1. Better Base Mixin (The Soul of the Design System)
const basePattern = `@mixin unified-variant-base`;
const baseStart = content.indexOf(basePattern);
if (baseStart !== -1) {
    let nextMixinIdx = content.indexOf('@mixin', baseStart + basePattern.length);
    const newBase = `@mixin unified-variant-base($bg, $color, $accent, $glow-color) {
  --theme-bg: #{$bg};
  --theme-color: #{$color};
  --theme-accent: #{$accent};
  --theme-border: 1px solid rgba($accent, 0.3);
  --theme-shadow-sm: 0 2px 4px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1);
  --theme-shadow-md: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
  --theme-shadow-lg: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
  --theme-glow: 0 0 20px rgba($glow-color, 0.4), 0 0 40px rgba($glow-color, 0.1);

  background: var(--theme-bg);
  color: var(--theme-color);
  border: var(--theme-border);
  border-radius: $unified-border-radius;
  box-shadow: var(--theme-shadow-sm);
  font-family: $unified-font-family;
  font-weight: 500;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
    transform: translateX(-100%);
    transition: 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
    z-index: -1;
  }

  &:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow: var(--theme-shadow-md), var(--theme-glow);
    border-color: rgba($accent, 0.6);
    
    &::before {
      transform: translateX(100%);
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
    box-shadow: var(--theme-shadow-sm);
  }
}`;
    content = content.substring(0, baseStart) + newBase + '\n\n' + content.substring(nextMixinIdx);
    console.log("World Class Design applied to: unified-variant-base");
}

// 2. Primary - The "Big Tech" Look (Microsoft/Apple style)
forceFix('primary', `@mixin variant-primary {
  --theme-bg: linear-gradient(145deg, #2563eb, #1d4ed8);
  --theme-color: #ffffff;
  --theme-accent: #60a5fa;
  
  background: var(--theme-bg);
  color: var(--theme-color);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.8rem 1.8rem;
  font-weight: 600;
  box-shadow: 
    0 4px 6px -1px rgba(37, 99, 235, 0.2),
    0 2px 4px -1px rgba(37, 99, 235, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 10px 20px -5px rgba(37, 99, 235, 0.4),
      0 0 15px rgba(59, 130, 246, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    filter: brightness(1.1);
  }
}`);

// 3. Secondary - Clean & Sophisticated
forceFix('secondary', `@mixin variant-secondary {
  --theme-bg: #f8fafc;
  --theme-color: #1e293b;
  
  background: var(--theme-bg);
  color: var(--theme-color);
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.8rem 1.8rem;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);

  &:hover {
    background: #fff;
    border-color: #cbd5e1;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
    transform: translateY(-1px);
  }
}`);

// 4. Corporate - The "Executive" Look
forceFix('corporate', `@mixin variant-corporate {
  --theme-bg: #ffffff;
  --theme-color: #0f172a;
  
  background: var(--theme-bg);
  color: var(--theme-color);
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-weight: 600;
  letter-spacing: -0.01em;
  box-shadow: 
    0 1px 2px rgba(0,0,0,0.05),
    0 0 0 1px rgba(0,0,0,0.05);

  &:hover {
    border-color: #2563eb;
    background: #f8fafc;
    color: #2563eb;
    box-shadow: 
      0 4px 6px -1px rgba(37, 99, 235, 0.1),
      0 0 0 1px rgba(37, 99, 235, 0.1);
  }
}`);

// 5. Luxury - The "Global Premium" Look (Gucci/Versace aesthetic)
forceFix('luxury', `@mixin variant-luxury {
  --theme-bg: #000000;
  --theme-color: #d4af37;
  
  background: var(--theme-bg);
  color: var(--theme-color);
  border: 1px solid #d4af37;
  padding: 1.2rem 3rem;
  font-family: 'Cinzel', serif;
  text-transform: uppercase;
  letter-spacing: 5px;
  font-weight: 700;
  position: relative;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(212,175,55, 0.2), 
      transparent
    );
    transition: 0.6s;
  }

  &:hover {
    color: #000;
    background: #d4af37;
    letter-spacing: 7px;
    box-shadow: 0 0 40px rgba(212,175,55, 0.4);
    
    &::before {
      left: 100%;
    }
  }
}`);

// 6. Elegant - The "High Fashion" Look
forceFix('elegant', `@mixin variant-elegant {
  --theme-bg: transparent;
  --theme-color: #1a1a1a;
  
  background: var(--theme-bg);
  color: var(--theme-color);
  border-bottom: 2px solid #1a1a1a;
  padding: 0.5rem 0;
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: 1.1rem;
  transition: all 0.3s ease;

  &:hover {
    padding-left: 1rem;
    padding-right: 1rem;
    background: rgba(0,0,0,0.02);
    letter-spacing: 1px;
  }
}`);

// 7. Minimal - The "Invisible Design" Look (Braun/Dieter Rams style)
forceFix('minimal', `@mixin variant-minimal {
  --theme-bg: #f5f5f7;
  --theme-color: #1d1d1f;
  
  background: var(--theme-bg);
  color: var(--theme-color);
  border: none;
  border-radius: 980px; // Pill shape
  padding: 0.6rem 1.4rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #e8e8ed;
    transform: scale(1.02);
  }
}`);

fs.writeFileSync(variantsFile, content, 'utf8');
console.log('Batch 1 (World Class) Finished.');
