/**
 * Layout Section Interfaces
 * 
 * This module defines the data structures for the flexible layout section system.
 * A layout section can have multiple slots, each containing a UI component.
 */

// Available layout types
export type LayoutType = 
  | 'single'           // 1 slot: full width
  | 'two-columns'      // 2 slots: 50/50
  | 'two-columns-left' // 2 slots: 70/30
  | 'two-columns-right'// 2 slots: 30/70
  | 'three-columns'    // 3 slots: 33/33/33
  | 'grid-2x2'         // 4 slots: 2x2 grid
  | 'grid-3x2'         // 6 slots: 3x2 grid
  | 'grid-3x3'         // 9 slots: 3x3 grid
  | 'sidebar-left'     // 2 slots: narrow sidebar + main content
  | 'sidebar-right'    // 2 slots: main content + narrow sidebar
  | 'hero-banner'      // 2 slots: large top + small bottom
  | 'masonry';         // Dynamic masonry layout

// Component types that can be placed in slots (todos los UI components wrappeados)
export type SlotComponentType = 
  | 'empty'
  | 'ui-button'
  | 'ui-image'
  | 'ui-title'
  | 'ui-card'
  | 'ui-card-animated'
  | 'ui-card-premium'
  | 'ui-accordion'
  | 'ui-list'
  | 'ui-chip'
  | 'ui-card-product'
  | 'draggable-box'
  | 'ui-input'
  | 'ui-table'
  | 'ui-showcase-atom'
  | 'ui-video'
  | 'ui-spacer'
  | 'ui-gallery';

// Configuration for a single slot
export interface SlotConfig {
  id: string;
  componentType: SlotComponentType;
  componentVariant?: string;
  content?: Record<string, any>;
  styles?: Record<string, any>;
  customStyles?: Record<string, any>;
  layoutStyles?: Record<string, any>;
}

// Layout section configuration
export interface LayoutSectionConfig {
  layoutType: LayoutType;
  slots: SlotConfig[];
  gap?: number;           // Gap between slots in pixels
  padding?: number;       // Internal padding
  backgroundColor?: string;
  borderRadius?: number;
  minHeight?: number;
  gridTemplateOverride?: string; // Legacy: single override for backward compat
  gridTemplateOverridePerRow?: Record<number, string>; // Per-row column overrides (row index → grid-template-columns)
}

// Get the number of columns for a layout type
export function getColumnCount(layoutType: LayoutType): number {
  switch (layoutType) {
    case 'single':
    case 'hero-banner':
      return 1;
    case 'two-columns':
    case 'two-columns-left':
    case 'two-columns-right':
    case 'sidebar-left':
    case 'sidebar-right':
    case 'grid-2x2':
      return 2;
    case 'three-columns':
    case 'grid-3x2':
    case 'grid-3x3':
      return 3;
    case 'masonry':
      return 1;
    default:
      return 1;
  }
}

// Layout definition with slot metadata
export interface LayoutDefinition {
  type: LayoutType;
  label: string;
  icon: string;
  description: string;
  slotCount: number;
  gridTemplate: string;   // CSS grid-template-areas or grid-template-columns
  slotNames: string[];    // Names for each slot position
}

// Available layouts catalog
export const LAYOUT_DEFINITIONS: LayoutDefinition[] = [
  {
    type: 'single',
    label: 'Una Columna',
    icon: '▢',
    description: 'Contenido a ancho completo',
    slotCount: 1,
    gridTemplate: '1fr',
    slotNames: ['principal']
  },
  {
    type: 'two-columns',
    label: 'Dos Columnas',
    icon: '▣▣',
    description: 'Dos columnas iguales',
    slotCount: 2,
    gridTemplate: '1fr 1fr',
    slotNames: ['izquierda', 'derecha']
  },
  {
    type: 'two-columns-left',
    label: 'Columna Grande Izq.',
    icon: '▣▢',
    description: 'Columna principal a la izquierda',
    slotCount: 2,
    gridTemplate: '2fr 1fr',
    slotNames: ['principal', 'secundaria']
  },
  {
    type: 'two-columns-right',
    label: 'Columna Grande Der.',
    icon: '▢▣',
    description: 'Columna principal a la derecha',
    slotCount: 2,
    gridTemplate: '1fr 2fr',
    slotNames: ['secundaria', 'principal']
  },
  {
    type: 'three-columns',
    label: 'Tres Columnas',
    icon: '▢▢▢',
    description: 'Tres columnas iguales',
    slotCount: 3,
    gridTemplate: '1fr 1fr 1fr',
    slotNames: ['izquierda', 'centro', 'derecha']
  },
  {
    type: 'grid-2x2',
    label: 'Grid 2x2',
    icon: '⊞',
    description: 'Cuadrícula de 4 elementos',
    slotCount: 4,
    gridTemplate: 'repeat(2, 1fr)',
    slotNames: ['arriba-izq', 'arriba-der', 'abajo-izq', 'abajo-der']
  },
  {
    type: 'grid-3x2',
    label: 'Grid 3x2',
    icon: '⊟⊟',
    description: 'Cuadrícula de 6 elementos',
    slotCount: 6,
    gridTemplate: 'repeat(3, 1fr)',
    slotNames: ['1', '2', '3', '4', '5', '6']
  },
  {
    type: 'grid-3x3',
    label: 'Grid 3x3',
    icon: '⊞⊞',
    description: 'Cuadrícula de 9 elementos',
    slotCount: 9,
    gridTemplate: 'repeat(3, 1fr)',
    slotNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
  },
  {
    type: 'sidebar-left',
    label: 'Sidebar Izquierda',
    icon: '|▣',
    description: 'Barra lateral estrecha a la izquierda',
    slotCount: 2,
    gridTemplate: '250px 1fr',
    slotNames: ['sidebar', 'contenido']
  },
  {
    type: 'sidebar-right',
    label: 'Sidebar Derecha',
    icon: '▣|',
    description: 'Barra lateral estrecha a la derecha',
    slotCount: 2,
    gridTemplate: '1fr 250px',
    slotNames: ['contenido', 'sidebar']
  },
  {
    type: 'hero-banner',
    label: 'Hero Banner',
    icon: '▬',
    description: 'Área grande arriba, pequeña abajo',
    slotCount: 2,
    gridTemplate: '1fr',
    slotNames: ['hero', 'contenido']
  }
];

// Component catalog for slot assignment
export interface ComponentCatalogItem {
  type: SlotComponentType;
  label: string;
  icon: string;
  category: 'basic' | 'content' | 'interactive' | 'media';
  defaultVariant?: string;
  defaultContent?: Record<string, any>;
}

export const COMPONENT_CATALOG: ComponentCatalogItem[] = [
  // Basic
  { type: 'ui-button', label: 'Botón', icon: '🔘', category: 'basic', defaultVariant: 'primary', defaultContent: { text: 'Botón' } },
  { type: 'ui-title', label: 'Título', icon: '📝', category: 'basic', defaultVariant: 'default', defaultContent: { text: 'Título' } },
  { type: 'ui-chip', label: 'Chip', icon: '🏷️', category: 'basic', defaultContent: { text: 'Chip' } },
  { type: 'ui-input', label: 'Campo de texto', icon: '✏️', category: 'basic', defaultVariant: 'primary', defaultContent: { placeholder: 'Escribe aquí...', label: 'Campo' } },
  // Content
  { type: 'ui-card', label: 'Tarjeta', icon: '📇', category: 'content', defaultVariant: 'glass', defaultContent: { title: 'Título', description: 'Descripción...' } },
  { type: 'ui-card-animated', label: 'Tarjeta Animada', icon: '✨', category: 'content', defaultContent: { title: 'Título', description: 'Descripción', image: '' } },
  { type: 'ui-card-premium', label: 'Tarjeta Premium', icon: '💎', category: 'content', defaultVariant: 'default', defaultContent: { icon: 'heroStar', title: 'Título', description: 'Descripción', price: '99', discount: '', image: '' } },
  { type: 'ui-list', label: 'Lista', icon: '📋', category: 'content', defaultContent: { items: ['Item 1', 'Item 2', 'Item 3'] } },
  { type: 'ui-card-product', label: 'Producto', icon: '🛒', category: 'content', defaultContent: { product: { image: '', name: 'Producto', description: 'Descripción...', price: '0.00' } } },
  { type: 'ui-showcase-atom', label: 'Bloque Icono + Texto', icon: '⚛️', category: 'content', defaultVariant: 'default', defaultContent: { icon: '✨', title: 'Título', text: 'Descripción breve.' } },
  { type: 'ui-table', label: 'Tabla', icon: '📊', category: 'content', defaultVariant: 'secondary', defaultContent: { columns: [{ key: 'col1', label: 'Columna 1' }], rows: [{ col1: 'Fila 1' }] } },
  // Interactive
  { type: 'ui-accordion', label: 'Acordeón', icon: '📂', category: 'interactive', defaultContent: { items: [{ title: 'Item 1', content: 'Contenido 1' }] } },
  { type: 'draggable-box', label: 'Caja Arrastrable', icon: '📦', category: 'interactive', defaultContent: { text: 'Caja' } },
  // Media
  { type: 'ui-image', label: 'Imagen', icon: '🖼️', category: 'media', defaultContent: { src: '', alt: 'Imagen' } },
  { type: 'ui-video', label: 'Vídeo', icon: '🎬', category: 'media', defaultContent: { src: '', autoplay: true, loop: true, muted: true } },
  { type: 'ui-gallery', label: 'Galería', icon: '🖼️', category: 'media', defaultContent: { images: [{ src: 'https://picsum.photos/300/200', alt: 'Imagen 1' }] } },
  // Layout
  { type: 'ui-spacer', label: 'Espaciador', icon: '↕️', category: 'basic', defaultVariant: 'empty', defaultContent: { height: '60px' } }
];

// Helper to get layout definition
export function getLayoutDefinition(type: LayoutType): LayoutDefinition | undefined {
  return LAYOUT_DEFINITIONS.find(l => l.type === type);
}

// Helper to get component catalog item
export function getComponentCatalogItem(type: SlotComponentType): ComponentCatalogItem | undefined {
  return COMPONENT_CATALOG.find(c => c.type === type);
}

// Helper to create initial slots for a layout
export function createInitialSlots(layoutType: LayoutType): SlotConfig[] {
  const layout = getLayoutDefinition(layoutType);
  if (!layout) return [];

  return layout.slotNames.map((name, index) => ({
    id: `slot_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 9)}`,
    componentType: 'empty' as SlotComponentType,
    content: {},
    styles: {}
  }));
}

// Helper to create default layout section config
export function createDefaultLayoutConfig(): LayoutSectionConfig {
  return {
    layoutType: 'single',
    slots: createInitialSlots('single'),
    gap: 16,
    padding: 24,
    minHeight: 200
  };
}
