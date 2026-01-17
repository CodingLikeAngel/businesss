// Lista completa de todas las variantes disponibles en el sistema
export const ALL_VARIANTS = [
  // Básicas
  { id: 'primary', name: 'Primario', category: 'Básicas' },
  { id: 'secondary', name: 'Secundario', category: 'Básicas' },
  { id: 'outline', name: 'Contorno', category: 'Básicas' },
  { id: 'ghost', name: 'Fantasma', category: 'Básicas' },
  
  // Modernas
  { id: 'glass', name: 'Cristal', category: 'Modernas' },
  { id: 'neon', name: 'Neón', category: 'Modernas' },
  { id: 'cyberpunk', name: 'Cyberpunk', category: 'Modernas' },
  { id: 'retro', name: 'Retro', category: 'Modernas' },
  { id: 'minimal', name: 'Minimal', category: 'Modernas' },
  
  // Temáticas
  { id: 'jungle', name: 'Jungla', category: 'Temáticas' },
  { id: 'enchanted', name: 'Encantado', category: 'Temáticas' },
  { id: 'mystic', name: 'Místico', category: 'Temáticas' },
  { id: 'ancient', name: 'Antiguo', category: 'Temáticas' },
  { id: 'twilight', name: 'Crepúsculo', category: 'Temáticas' },
  { id: 'frosty', name: 'Helado', category: 'Temáticas' },
  { id: 'desert', name: 'Desierto', category: 'Temáticas' },
  { id: 'candy', name: 'Dulce', category: 'Temáticas' },
  { id: 'oceanic', name: 'Oceánico', category: 'Temáticas' },
  { id: 'fiery', name: 'Ardiente', category: 'Temáticas' },
  
  // Avanzadas
  { id: 'matrix', name: 'Matrix', category: 'Avanzadas' },
  { id: 'stellar', name: 'Estelar', category: 'Avanzadas' },
  { id: 'phoenix', name: 'Fénix', category: 'Avanzadas' },
  { id: 'aqua', name: 'Aqua', category: 'Avanzadas' },
  { id: 'plasma', name: 'Plasma', category: 'Avanzadas' },
  { id: 'cosmic', name: 'Cósmico', category: 'Avanzadas' },
  { id: 'vaporwave', name: 'Vaporwave', category: 'Avanzadas' },
  { id: 'aurora', name: 'Aurora', category: 'Avanzadas' },
  
  // Premium
  { id: 'luxury', name: 'Lujo', category: 'Premium' },
  { id: 'elegant', name: 'Elegante', category: 'Premium' },
  { id: 'vintage', name: 'Vintage', category: 'Premium' },
  { id: 'success', name: 'Éxito', category: 'Premium' },
  { id: 'default', name: 'Por Defecto', category: 'Premium' }
] as const;

export type VariantId = typeof ALL_VARIANTS[number]['id'];
export type VariantCategory = typeof ALL_VARIANTS[number]['category'];

// Propiedades editables por tipo de componente
export interface ComponentEditableProperties {
  // Propiedades comunes a todos
  common: string[];
  // Propiedades específicas por tipo
  button?: string[];
  card?: string[];
  input?: string[];
  section?: string[];
  hero?: string[];
  navbar?: string[];
  footer?: string[];
  modal?: string[];
  table?: string[];
  form?: string[];
  title?: string[];
  chart?: string[];
  pricing?: string[];
  newsletter?: string[];
  steps?: string[];
  breadcrumbs?: string[];
  spinner?: string[];
  accordion?: string[];
  tabs?: string[];
  list?: string[];
  chip?: string[];
  gallery?: string[];
}

export const EDITABLE_PROPERTIES: ComponentEditableProperties = {
  common: [
    'backgroundColor',
    'color',
    'padding',
    'margin',
    'borderRadius',
    'border',
    'boxShadow',
    'backdropFilter',
    'opacity',
    'width',
    'height',
    'minWidth',
    'minHeight',
    'maxWidth',
    'maxHeight'
  ],
  button: [
    'fontSize',
    'fontWeight',
    'textTransform',
    'letterSpacing',
    'cursor',
    'transition'
  ],
  card: [
    'overflow',
    'backgroundImage',
    'backgroundSize',
    'backgroundPosition'
  ],
  input: [
    'fontSize',
    'fontWeight',
    'lineHeight',
    'outline',
    'borderColor',
    'focusBorderColor'
  ],
  section: [
    'backgroundImage',
    'backgroundSize',
    'backgroundPosition',
    'backgroundAttachment',
    'minHeight',
    'display',
    'flexDirection',
    'justifyContent',
    'alignItems',
    'gap'
  ],
  hero: [
    'backgroundImage',
    'backgroundSize',
    'backgroundPosition',
    'minHeight',
    'textAlign',
    'display',
    'flexDirection',
    'justifyContent',
    'alignItems'
  ],
  navbar: [
    'position',
    'top',
    'left',
    'right',
    'zIndex',
    'display',
    'justifyContent',
    'alignItems',
    'gap'
  ],
  footer: [
    'display',
    'flexDirection',
    'justifyContent',
    'alignItems',
    'gap',
    'textAlign'
  ],
  modal: [
    'zIndex',
    'position',
    'top',
    'left',
    'transform',
    'maxWidth',
    'maxHeight',
    'overflow'
  ],
  table: [
    'borderCollapse',
    'borderSpacing',
    'width',
    'tableLayout'
  ],
  form: [
    'display',
    'flexDirection',
    'gap',
    'alignItems'
  ],
  title: [
    'fontSize',
    'fontWeight',
    'textAlign',
    'textTransform',
    'letterSpacing',
    'lineHeight'
  ],
  chart: [
    'height',
    'width',
    'padding',
    'margin'
  ],
  accordion: [
    'gap',
    'padding',
    'margin'
  ],
  tabs: [
    'gap',
    'padding'
  ],
  list: [
    'gap',
    'padding',
    'fontSize'
  ],
  chip: [
    'fontSize',
    'fontWeight',
    'padding'
  ],
  gallery: [
    'gap',
    'gridTemplateColumns',
    'padding'
  ],
  pricing: [
    'gap',
    'padding',
    'margin'
  ],
  newsletter: [
   'padding',
   'margin',
   'backgroundImage'
 ],
 steps: [
   'gap',
   'padding'
 ],
 breadcrumbs: [
   'fontSize',
   'color'
 ],
 spinner: [
   'width',
   'height',
   'color'
 ]
};

// Detectar tipo de componente basado en su estructura
export function detectComponentType(element: any): keyof ComponentEditableProperties {
  if (!element) return 'common';
  
  const type = element.type?.toLowerCase() || '';
  const tagName = element.tagName?.toLowerCase() || '';
  const className = element.className || '';
  
  // Detectar por tipo explícito
  if (type.includes('button') || tagName === 'button') return 'button';
  if (type.includes('card')) return 'card';
  if (type.includes('input') || tagName === 'input') return 'input';
  if (type.includes('section') || tagName === 'section') return 'section';
  if (type.includes('hero')) return 'hero';
  if (type.includes('navbar') || type.includes('nav')) return 'navbar';
  if (type.includes('footer')) return 'footer';
  if (type.includes('modal')) return 'modal';
  if (type.includes('table') || tagName === 'table') return 'table';
  if (type.includes('form') || tagName === 'form') return 'form';
  if (type.includes('title') || type.includes('subtitle') || (tagName >= 'h1' && tagName <= 'h6')) return 'title';
  if (type.includes('chart')) return 'chart';
  if (type.includes('accordion') || type.includes('faq')) return 'accordion';
  if (type.includes('tabs')) return 'tabs';
  if (type.includes('list')) return 'list';
  if (type.includes('chip')) return 'chip';
  if (type.includes('gallery')) return 'gallery';
  if (type.includes('pricing')) return 'pricing';
  if (type.includes('newsletter')) return 'newsletter';
  if (type.includes('steps')) return 'steps';
  if (type.includes('breadcrumbs')) return 'breadcrumbs';
  if (type.includes('spinner')) return 'spinner';
  
  // Detectar por clase
  if (className.includes('card')) return 'card';
  if (className.includes('btn') || className.includes('button')) return 'button';
  if (className.includes('hero')) return 'hero';
  if (className.includes('nav')) return 'navbar';
  if (className.includes('footer')) return 'footer';
  
  return 'common';
}

// Obtener propiedades editables para un componente
export function getEditableProperties(element: any): string[] {
  const componentType = detectComponentType(element);
  const specificProps = EDITABLE_PROPERTIES[componentType] || [];
  return [...EDITABLE_PROPERTIES.common, ...specificProps];
}
