// Component Export System - Models
// Modelos de datos para el exportador de componentes multi-framework

export type FrameworkType = 'react' | 'angular' | 'vue' | 'web-component';

export type PropType = 'string' | 'number' | 'boolean' | 'function' | 'array' | 'object' | 'ReactNode' | 'Event';

export interface PropDefinition {
  name: string;
  type: PropType;
  defaultValue?: any;
  required: boolean;
  description?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: any[];
  };
}

export interface SlotDefinition {
  name: string;
  required: boolean;
  description?: string;
}

export interface EventDefinition {
  name: string;
  type: string;
  description?: string;
}

export interface StyleDefinition {
  mode: 'css' | 'scss' | 'css-modules' | 'tailwind' | 'inline';
  content: string;
  variables?: Record<string, string>;
}

export interface ComponentMetadata {
  id: string;
  name: string;
  type: ComponentType;
  htmlTag: string;
  baseClassName: string;
  props: PropDefinition[];
  slots: SlotDefinition[];
  events: EventDefinition[];
  children?: ComponentMetadata[];
  styles: StyleDefinition;
  variants: VariantDefinition[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: string;
    author: string;
  };
}

export type ComponentType = 
  | 'button' 
  | 'input' 
  | 'card' 
  | 'modal' 
  | 'navbar' 
  | 'footer' 
  | 'accordion' 
  | 'tabs' 
  | 'table' 
  | 'form'
  | 'gallery'
  | 'pricing'
  | 'custom';

export interface VariantDefinition {
  name: string;
  props: Partial<PropDefinition>[];
  styles?: Partial<StyleDefinition>;
}

export interface ExportOptions {
  framework: FrameworkType;
  typescript?: boolean;
  styling?: 'css' | 'scss' | 'modules' | 'tailwind';
  indentation?: 2 | 4;
  addComments?: boolean;
  generateTests?: boolean;
  generateStories?: boolean;
}

export interface ExportResult {
  success: boolean;
  code?: string;
  files?: ExportFile[];
  error?: string;
  warnings?: string[];
}

export interface ExportFile {
  name: string;
  path: string;
  content: string;
  language: 'typescript' | 'javascript' | 'html' | 'css' | 'scss';
}

// Component Schema para el editor
export interface EditorComponentSchema {
  type: string;
  selector: string;
  name: string;
  props: EditorPropSchema[];
  styles: EditorStyleSchema[];
}

export interface EditorPropSchema {
  name: string;
  type: string;
  defaultValue?: any;
  UI?: {
    type: 'input' | 'select' | 'checkbox' | 'color' | 'number';
    options?: any[];
    label?: string;
    description?: string;
  };
}

export interface EditorStyleSchema {
  property: string;
  type: 'string' | 'number' | 'color' | 'select';
  defaultValue?: any;
  options?: string[];
  label?: string;
}
