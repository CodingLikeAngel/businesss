
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

// 1. Crystal - Faceted & Sparkling
forceFix('crystal', `@mixin variant-crystal {
  --theme-bg: linear-gradient(135deg, #fff 0%, #e0f2fe 100%);
  --theme-color: #0369a1;
  
  position: relative;
  background: var(--theme-bg);
  color: var(--theme-color);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  padding: 2rem;
  font-family: 'Cinzel', serif;
  font-weight: 700;
  text-transform: uppercase;
  transition: all 0.5s ease;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%);
    animation: shimmer-fast 4s infinite;
  }

  &:hover {
    transform: scale(1.05) rotate(2deg);
    box-shadow: 0 20px 40px rgba(186, 230, 253, 0.4);
    filter: brightness(1.05);
  }
}`);

// 2. Jungle - Lush & Depth
forceFix('jungle', `@mixin variant-jungle {
  --theme-bg: linear-gradient(135deg, #064e3b, #065f46);
  --theme-color: #d1fae5;
  
  background: var(--theme-bg);
  color: var(--theme-color);
  border-radius: 40px 10px 40px 10px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(6, 78, 59, 0.3);
  position: relative;

  &::after {
    content: '🌿';
    position: absolute;
    bottom: -10px; right: -5px;
    font-size: 2rem;
    opacity: 0.2;
    transform: rotate(15deg);
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(6, 78, 59, 0.4);
    background: linear-gradient(135deg, #065f46, #047857);
  }
}`);

// 3. Water - Fluid & Rippling
forceFix('water', `@mixin variant-water {
  --theme-bg: #3b82f6;
  --theme-color: #fff;
  
  background: var(--theme-bg);
  border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%;
  padding: 1.5rem 3rem;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);

  &:hover {
    border-radius: 50%;
    transform: scale(1.05);
    background: #2563eb;
    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.4);
  }
}`);

// 4. Fire - Intense & Moving
forceFix('fire', `@mixin variant-fire {
  --theme-bg: linear-gradient(to top, #991b1b, #ef4444);
  
  background: var(--theme-bg);
  color: #fff;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  font-weight: 800;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(251, 146, 60, 0.4), transparent);
    animation: pulse 2s infinite;
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 0 30px #f97316;
    background: linear-gradient(to top, #b91c1c, #f87171);
  }
}`);

// 5. Stone - Solid & Brutalist (Remedy/Control aesthetic)
forceFix('stone', `@mixin variant-stone {
  --theme-bg: #27272a;
  --theme-color: #f4f4f5;
  
  background: var(--theme-bg);
  color: var(--theme-color);
  border: 4px solid #3f3f46;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 900;
  box-shadow: 8px 8px 0px #18181b;
  transition: 0.1s;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 10px 10px 0px #18181b;
    background: #3f3f46;
  }
}`);

fs.writeFileSync(variantsFile, content, 'utf8');
console.log('Batch 4 (Organic) Finished.');
