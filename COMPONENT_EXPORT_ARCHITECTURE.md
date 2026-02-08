# 🏗️ Component Export System - Arquitectura Técnica

## 📋 Documento Técnico Completo

Este documento cubre:
1. **Arquitectura del sistema de exportador multi-framework**
2. **Plan de implementación para React/Angular/Vue**
3. **Demo/Prototype primera versión funcional**

---

## 🎯 Visión General

### Objetivos del Sistema
```
┌─────────────────────────────────────────────────────────────────────┐
│                    COMPONENT EXPORT SYSTEM                         │
├─────────────────────────────────────────────────────────────────────┤
│  INPUT: Componentes diseñados en el editor visual de Anto Studios  │
│  PROCESS: Parsear estructura, extraer props, convertir estilos      │
│  OUTPUT: Código nativo para React, Angular, Vue, Web Components    │
└─────────────────────────────────────────────────────────────────────┘
```

### Problema a Resolver
- **Hoy:** Diseñadores crean → Desarrolladores re-implementan
- **Solución:** Diseño → Export directo → Código production-ready

---

## 🏗️ Arquitectura del Sistema

### 1. Diagrama de Arquitectura General

```
                    ┌─────────────────────────────────────────┐
                    │         EXPORT SERVICE                   │
                    │  ┌───────────────────────────────────┐  │
                    │  │     ExportOrchestrator             │  │
                    │  │  - Detecta framework destino       │  │
                    │  - Coordina exporters                │  │
                    │  - Maneja errores                   │  │
                    │  └───────────────────────────────────┘  │
                    └─────────────────┬───────────────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
              ▼                       ▼                       ▼
    ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
    │   PARSER        │   │   TRANSFORMER   │   │   GENERATOR     │
    │  ┌───────────┐  │   │  ┌───────────┐  │   │  ┌───────────┐  │
    │  │ Component │  │   │  │ AST       │  │   │  │ Template │  │
    │  │ Parser    │  │   │  │ Converter │  │   │  │ Engine   │  │
    │  └───────────┘  │   │  └───────────┘  │   │  └───────────┘  │
    └─────────────────┘   └─────────────────┘   └─────────────────┘
              │                       │                       │
              │                       │                       │
              ▼                       ▼                       ▼
    ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
    │ STYLE           │   │ PROP SCHEMA     │   │ CODE            │
    │ EXTRACTOR       │   │ GENERATOR       │   │ FORMATTER       │
    │  - CSS vars     │   │  - TypeScript   │   │  - Prettier     │
    │  - Inline       │   │  - Interfaces   │   │  - Indentation  │
    │  - Tailwind     │   │  - Validation   │   │  - Comments     │
    └─────────────────┘   └─────────────────┘   └─────────────────┘
```

### 2. Componentes del Sistema

#### 2.1 ExportOrchestrator
```typescript
// libs/shared-components/src/lib/services/export/orchestrator.ts
import { Injectable, signal } from '@angular/core';
import { ComponentMetadata } from '../models/component.model';
import { ReactExporter } from './react.exporter';
import { AngularExporter } from './angular.exporter';
import { VueExporter } from './vue.exporter';
import { WebComponentExporter } from './web-component.exporter';

export type FrameworkType = 'react' | 'angular' | 'vue' | 'web-component';

@Injectable({ providedIn: 'root' })
export class ExportOrchestrator {
  private exporters = {
    react: new ReactExporter(),
    angular: new AngularExporter(),
    vue: new VueExporter(),
    'web-component': new WebComponentExporter()
  };

  async export(
    component: ComponentMetadata,
    framework: FrameworkType,
    options: ExportOptions = {}
  ): Promise<ExportResult> {
    try {
      const exporter = this.exporters[framework];
      
      // Pipeline de exportación
      const parsed = await this.parse(component);
      const transformed = await this.transform(parsed, options);
      const generated = await exporter.generate(transformed);
      const formatted = await this.format(generated);
      
      return { success: true, code: formatted };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  private async parse(component: ComponentMetadata): Promise<ParsedComponent> {
    // Parsear estructura del componente del editor
    return {
      name: component.name,
      props: this.extractProps(component),
      slots: this.extractSlots(component),
      events: this.extractEvents(component),
      styles: this.extractStyles(component),
      children: component.children || []
    };
  }

  private async transform(parsed: ParsedComponent, options: ExportOptions): Promise<TransformedComponent> {
    // Transformar a formato intermedio (AST-like)
    return {
      ...parsed,
      frameworkProps: this.mapToFrameworkProps(parsed.props, options.framework),
      stylesAST: this.convertStylesToAST(parsed.styles)
    };
  }

  private async format(code: string): Promise<string> {
    // Aplicar formatting y linting
    return prettier.format(code, { parser: 'typescript' });
  }
}
```

#### 2.2 React Exporter
```typescript
// libs/shared-components/src/lib/services/export/react.exporter.ts
import { Injectable } from '@angular/core';
import { TransformedComponent } from './orchestrator';
import { ExporterBase } from './exporter-base';

@Injectable({ providedIn: 'root' })
export class ReactExporter extends ExporterBase {
  
  generate(component: TransformedComponent): string {
    const imports = this.generateImports(component);
    const interfaces = this.generateInterfaces(component);
    const componentBody = this.generateComponent(component);
    const styles = this.generateStyles(component);

    return `
// Auto-generated by Anto Studios Component Export
// Framework: React (Functional Component with Hooks)
// Generated: ${new Date().toISOString()}

${imports}

${interfaces}

${componentBody}

${styles}
    `.trim();
  }

  private generateImports(component: TransformedComponent): string {
    const imports = ['import React'];

    if (component.usesState) {
      imports.push('useState', 'useCallback');
    }

    if (component.usesEffects) {
      imports.push('useEffect');
    }

    if (component.props.length > 0) {
      imports.push(`import { ${component.name}Props } from './${component.name}.types';`);
    }

    return imports.length > 1 
      ? `import { ${imports.slice(1).join(', ')} } from 'react';` 
      : "import React from 'react';";
  }

  private generateInterfaces(component: TransformedComponent): string {
    if (component.props.length === 0) {
      return '';
    }

    const propsInterface = component.props.map(prop => {
      const tsType = this.mapTypeToTypeScript(prop.type);
      const optional = prop.optional ? '?' : '';
      return `  ${prop.name}${optional}: ${tsType};`;
    }).join('\n');

    return `
export interface ${component.name}Props {
${propsInterface}
}
    `.trim();
  }

  private generateComponent(component: TransformedComponent): string {
    const propsDestructuring = component.props
      .map(p => `${p.name} = ${JSON.stringify(p.defaultValue)}`)
      .join(', ');

    const propsType = component.props.length > 0 
      ? `: React.FC<${component.name}Props>` 
      : '';

    const classNameBinding = `const className = \`${component.baseClassName}\${variant ? ' btn--' + variant : ''}\`;`;

    return `
export const ${component.name}${propsType} = ({
${this.indent(propsDestructuring, 2)}
}: ${component.props.length > 0 ? component.name + 'Props' : 'object'}) => {
${this.indent(classNameBinding, 2)}

  return (
    <${component.htmlTag}
      className={className}
     ${component.hasClickHandler ? '      onClick={onClick}' : ''}
      ${component.hasDisabled ? '      disabled={disabled}' : ''}
    >
      ${component.hasChildren ? '{children}' : component.slots.map(s => `<${s} />`).join('\n      ')}
    </${component.htmlTag}>
  );
};
    `.trim();
  }

  private generateStyles(component: TransformedComponent): string {
    if (!component.hasStyles) return '';

    return `
// Styles (CSS Modules format)
const styles = \`
${component.styles}
\`;

export default styles;
    `.trim();
  }

  private mapTypeToTypeScript(type: string): string {
    const typeMap: Record<string, string> = {
      'string': 'string',
      'number': 'number',
      'boolean': 'boolean',
      'function': '() => void',
      'array': 'any[]',
      'object': 'Record<string, any>',
      'ReactNode': 'React.ReactNode',
      'Event': 'React.MouseEvent'
    };
    return typeMap[type] || 'any';
  }

  private indent(text: string, spaces: number): string {
    const indent = ' '.repeat(spaces);
    return text.split('\n').map(line => line ? indent + line : line).join('\n');
  }
}
```

#### 2.3 Angular Exporter
```typescript
// libs/shared-components/src/lib/services/export/angular.exporter.ts
import { Injectable } from '@angular/core';
import { TransformedComponent } from './orchestrator';
import { ExporterBase } from './exporter-base';

@Injectable({ providedIn: 'root' })
export class AngularExporter extends ExporterBase {
  
  generate(component: TransformedComponent): string {
    const imports = this.generateImports(component);
    const componentClass = this.generateComponentClass(component);
    const template = this.generateTemplate(component);
    const styles = this.generateStyles(component);

    return `
// Auto-generated by Anto Studios Component Export
// Framework: Angular (Standalone Component)
// Generated: ${new Date().toISOString()}

${imports}

@Component({
  selector: '${this.toKebabCase(component.name)}',
  standalone: true,
  imports: [CommonModule${component.needsRouter ? ', RouterModule' : ''}],
  template: \`
${this.indent(template, 4)}
  \`,
  styles: [\`
${this.indent(styles, 4)}
  \`]
})
export class ${component.name}Component {
${this.indent(componentClass, 2)}
}
    `.trim();
  }

  private generateImports(component: TransformedComponent): string {
    return `import { Component, Input, Output, EventEmitter${component.needsOnInit ? ', OnInit' : ''}${component.needsChanges ? ', OnChanges, SimpleChanges' : ''} } from '@angular/core';
import { CommonModule } from '@angular/common'${component.needsRouter ? ", RouterModule } from '@angular/router';" : ';'}`;
  }

  private generateComponentClass(component: TransformedComponent): string {
    const inputs = component.props
      .map(p => `  @Input() ${p.name}: ${this.mapTypeToTypeScript(p.type)} = ${JSON.stringify(p.defaultValue)};`)
      .join('\n');

    const outputs = component.events
      .map(e => `  @Output() ${e.name} = new EventEmitter<${this.mapTypeToTypeScript(e.type)}>();`)
      .join('\n');

    return `
  // Inputs${inputs ? '\n' + inputs : ''}
  
  // Outputs${outputs ? '\n' + outputs : ''}
  
  // Public methods
  handleClick(event: Event): void {
    this.onClick.emit(event);
  }
    `.trim();
  }

  private generateTemplate(component: TransformedComponent): string {
    const classBinding = `[class]="'${component.baseClassName} ' + (variant ? 'btn--' + variant : '')"`;
    
    return `
<button
  ${classBinding}
  [disabled]="disabled"
  (click)="handleClick($event)"
>
  <ng-content></ng-content>
</button>
    `.trim();
  }

  private generateStyles(component: TransformedComponent): string {
    return component.styles || '';
  }

  private toKebabCase(name: string): string {
    return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  private mapTypeToTypeScript(type: string): string {
    const typeMap: Record<string, string> = {
      'string': 'string',
      'number': 'number',
      'boolean': 'boolean',
      'function': 'EventEmitter<void>',
      'Event': 'Event'
    };
    return typeMap[type] || 'any';
  }
}
```

#### 2.4 Vue 3 Exporter
```typescript
// libs/shared-components/src/lib/services/export/vue.exporter.ts
import { Injectable } from '@angular/core';
import { TransformedComponent } from './orchestrator';
import { ExporterBase } from './exporter-base';

@Injectable({ providedIn: 'root' })
export class VueExporter extends ExporterBase {
  
  generate(component: TransformedComponent): string {
    return `<template>
  <button
    :class="computedClass"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
${this.generateScriptSetup(component)}
</script>

${this.generateStyles(component)}
    `.trim();
  }

  private generateScriptSetup(component: TransformedComponent): string {
    const props = component.props.map(p => {
      const type = this.mapVuePropType(p.type);
      const required = !p.optional ? ', required: true' : '';
      const defaultVal = p.defaultValue !== undefined 
        ? `, default: ${JSON.stringify(p.defaultValue)}` 
        : '';
      return `    ${p.name}: { type: ${type}${required}${defaultVal} }`;
    }).join(',\n');

    const emit = component.events.length > 0 
      ? `\n\nconst emit = defineEmits<{
      ${component.events.map(e => `  ${e.name}: [${this.mapTypeToTypeScript(e.type)}]`).join('\n      ')}
    }>();`
      : '';

    const computed = `
const computedClass = computed(() => 
  \`${component.baseClassName} \${variant ? 'btn--' + variant : ''}\`.trim()
);`;

    return `import { computed${component.usesState ? ', ref' : ''} } from 'vue';

interface ${component.name}Props {
${component.props.map(p => `  ${p.name}${p.optional ? '?' : ''}: ${this.mapTypeToTypeScript(p.type)}`).join('\n')}
}

const props = withDefaults(defineProps<${component.name}Props>(), {
${component.props.filter(p => p.defaultValue !== undefined).map(p => `  ${p.name}: ${JSON.stringify(p.defaultValue)}`).join(',\n')}
});${emit}${computed}
    
function handleClick(event: Event) {
  emit('click', event);
}
    `.trim();
  }

  private generateStyles(component: TransformedComponent): string {
    if (!component.styles) return '';

    return `<style scoped>
${component.styles}
</style>`;
  }

  private mapVuePropType(type: string): string {
    const typeMap: Record<string, string> = {
      'string': 'String',
      'number': 'Number',
      'boolean': 'Boolean',
      'function': 'Function',
      'array': 'Array',
      'object': 'Object'
    };
    return typeMap[type] || 'Any';
  }

  private mapTypeToTypeScript(type: string): string {
    const typeMap: Record<string, string> = {
      'string': 'string',
      'number': 'number',
      'boolean': 'boolean',
      'function': 'void',
      'Event': 'Event'
    };
    return typeMap[type] || 'any';
  }
}
```

#### 2.5 Web Component Exporter
```typescript
// libs/shared-components/src/lib/services/export/web-component.exporter.ts
import { Injectable } from '@angular/core';
import { TransformedComponent } from './orchestrator';
import { ExporterBase } from './exporter-base';

@Injectable({ providedIn: 'root' })
export class WebComponentExporter extends ExporterBase {
  
  generate(component: TransformedComponent): string {
    return `
// Auto-generated by Anto Studios Component Export
// Framework: Web Components (Vanilla JS)
// Generated: ${new Date().toISOString()}

class ${component.name} extends HTMLElement {
  static get observedAttributes() {
    return [${component.props.map(p => `'${p.name}'`).join(', ')}];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._state = {
      ${component.props.map(p => `${p.name}: ${JSON.stringify(p.defaultValue)}`).join(',\n      ')}
    };
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this._state[name] = newValue;
      this.render();
    }
  }

  get ${component.props.map(p => p.name).join(',\n      ')}() {
    return this._state;
  }

  ${component.props.map(p => `set ${p.name}(value) {
    this._state.${p.name} = value;
    this.setAttribute('${p.name}', value);
  }`).join('\n\n  ')}

  render() {
    const className = \`${component.baseClassName} \${this._state.variant ? 'btn--' + this._state.variant : ''}\`.trim();
    
    this.shadowRoot.innerHTML = \`
      <style>
        ${component.styles.replace(/\n/g, '\n        ')}
      </style>
      <button
        class="\${className}"
        \${this._state.disabled ? 'disabled' : ''}
        part="button"
      >
        <slot></slot>
      </button>
    \`;

    this.shadowRoot.querySelector('button').addEventListener('click', (e) => {
      this.dispatchEvent(new CustomEvent('click', {
        detail: { originalEvent: e },
        bubbles: true,
        composed: true
      }));
    });
  }
}

customElements.define('${this.toKebabCase(component.name)}', ${component.name});

export { ${component.name} };
    `.trim();
  }

  private toKebabCase(name: string): string {
    return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
}
```

### 3. Modelo de Datos

```typescript
// libs/shared-components/src/lib/models/export.model.ts

export interface ComponentMetadata {
  id: string;
  name: string;
  type: ComponentType;
  htmlTag: string;
  baseClassName: string;
  props: PropDefinition[];
  slots: SlotDefinition[];
  events: EventDefinition[];
  children: ComponentMetadata[];
  styles: StyleDefinition;
  variants: VariantDefinition[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: string;
    author: string;
  };
}

export interface PropDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'function' | 'array' | 'object' | 'ReactNode' | 'Event';
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
```

---

## 📋 Plan de Implementación

### Fase 1: Core Export System (Semanas 1-2)

#### Semana 1: Base Architecture
```
Day 1-2: Create ExportOrchestrator service
         - Define ComponentMetadata model
         - Create base exporter interface
         - Set up error handling

Day 3-4: Implement Parser
         - Extract props from editor components
         - Extract slots and events
         - Extract styles

Day 5:   Basic React exporter MVP
         - Generate functional component
         - Basic props interface
```

#### Semana 2: Multi-Framework Support
```
Day 1-2: Complete React exporter
         - Handle all prop types
         - Add styling support
         - Add event handling

Day 3-4: Implement Angular exporter
         - Standalone components
         - Input/Output decorators
         - Template syntax

Day 5:   Implement Vue 3 exporter
         - Composition API
         - TypeScript support
         - Scoped styles
```

### Fase 2: Advanced Features (Semanas 3-4)

#### Semana 3: Web Components + Styles
```
Day 1-2: Web Component exporter
         - Shadow DOM
         - Custom Elements API
         - Observed attributes

Day 3-5: Style extraction system
         - CSS variables extraction
         - Tailwind class mapping
         - SCSS variable support
```

#### Semana 4: Code Quality
```
Day 1-2: TypeScript generation
         - Strict mode support
         - Generic types

Day 3-4: Code formatting
         - Prettier integration
         - Custom rules

Day 5:   Testing utilities
         - Jest test templates
         - Storybook stories
```

### Fase 3: Integration (Semanas 5-6)

#### Semana 5: Editor Integration
```
Day 1-3: Add export button to editor UI
         - Framework selector
         - Options modal

Day 4-5: Preview panel for exported code
         - Syntax highlighting
         - Copy to clipboard
```

#### Semana 6: Download + ZIP
```
Day 1-3: ZIP file generation
         - Multiple file exports
         - Directory structure

Day 4-5: Download service integration
         - Browser download API
         - Progress indicator
```

---

## 🧪 Demo/Prototype: Primera Versión Funcional

### 3.1 Servicio de Export (MVP)

```typescript
// libs/shared-components/src/lib/services/export/export.service.ts
import { Injectable } from '@angular/core';
import { ComponentMetadata } from '../../models/component.model';

export type Framework = 'react' | 'angular' | 'vue' | 'web-component';

export interface ExportConfig {
  framework: Framework;
  typescript: boolean;
  styles: 'css' | 'scss' | 'modules';
}

@Injectable({ providedIn: 'root' })
export class ExportService {
  
  private templates: Record<Framework, (component: ComponentMetadata) => string> = {
    react: (c) => this.reactTemplate(c),
    angular: (c) => this.angularTemplate(c),
    vue: (c) => this.vueTemplate(c),
    'web-component': (c) => this.webComponentTemplate(c)
  };

  export(component: ComponentMetadata, config: ExportConfig): string {
    const template = this.templates[config.framework];
    return template(component);
  }

  private reactTemplate(component: ComponentMetadata): string {
    const props = component.props.map(p => 
      `${p.name}${p.optional ? '?' : ''}: ${this.mapType(p.type)}`
    ).join('\n  ');

    return `import React from 'react';

interface ${component.name}Props {
  ${props}
}

export const ${component.name}: React.FC<${component.name}Props> = ({
  ${component.props.map(p => p.name).join(',\n  ')}
}) => {
  return (
    <${component.htmlTag} className="${component.baseClassName}">
      {/* Content here */}
    </${component.htmlTag}>
  );
};
`;
  }

  private angularTemplate(component: ComponentMetadata): string {
    return `import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: '${this.toKebabCase(component.name)}',
  standalone: true,
  template: \`
    <${component.htmlTag} 
      [class]="'${component.baseClassName}'"
      (click)="onClick.emit($event)"
    >
      <ng-content></ng-content>
    </${component.htmlTag}>
  \`
})
export class ${component.name}Component {
  ${component.props.map(p => `  @Input() ${p.name}: ${this.mapType(p.type)} = ${JSON.stringify(p.defaultValue)};`).join('\n  ')}
  @Output() onClick = new EventEmitter<Event>();
}
`;
  }

  private vueTemplate(component: ComponentMetadata): string {
    return `<template>
  <${component.htmlTag} :class="'${component.baseClassName}'" @click="$emit('click', $event)">
    <slot></slot>
  </${component.htmlTag}>
</template>

<script setup lang="ts">
defineProps<{
  ${component.props.map(p => `${p.name}${p.optional ? '?' : ''}: ${this.mapType(p.type)}`).join('\n  ')}
}>()

defineEmits<{
  (e: 'click', event: Event): void
}>()
</script>
`;
  }

  private webComponentTemplate(component: ComponentMetadata): string {
    return `class ${component.name} extends HTMLElement {
  static get observedAttributes() {
    return [${component.props.map(p => `'${p.name}'`).join(', ')}];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = \`
      <style>
        .${component.baseClassName} {
          /* Styles here */
        }
      </style>
      <${component.htmlTag} class="${component.baseClassName}">
        <slot></slot>
      </${component.htmlTag}>
    \`;
  }
}

customElements.define('${this.toKebabCase(component.name)}', ${component.name});
`;
  }

  private toKebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  private mapType(type: string): string {
    const map: Record<string, string> = {
      'string': 'string',
      'number': 'number',
      'boolean': 'boolean',
      'function': '() => void',
      'Event': 'Event'
    };
    return map[type] || 'any';
  }
}
```

### 3.2 UI Integration (MVP)

```typescript
// libs/shared-components/src/lib/shared-components/export-panel/export-panel.component.ts
import { Component, signal, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportService, Framework } from '../../services/export/export.service';
import { ComponentMetadata } from '../../models/component.model';

@Component({
  selector: 'app-export-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="export-panel">
      <h3>Export Component</h3>
      
      <div class="framework-selector">
        <label>Framework:</label>
        <select [(ngModel)]="selectedFramework">
          <option value="react">React</option>
          <option value="angular">Angular</option>
          <option value="vue">Vue 3</option>
          <option value="web-component">Web Components</option>
        </select>
      </div>

      <div class="options">
        <label>
          <input type="checkbox" [(ngModel)]="useTypeScript">
          TypeScript
        </label>
        <label>
          <input type="checkbox" [(ngModel)]="includeStyles">
          Include Styles
        </label>
      </div>

      <button (click)="previewExport()" class="preview-btn">
        Preview Code
      </button>

      @if (showPreview()) {
        <div class="preview-area">
          <pre><code>{{ previewCode() }}</code></pre>
          <button (click)="copyToClipboard()" class="copy-btn">
            Copy
          </button>
        </div>
      }

      <button (click)="downloadExport()" class="download-btn">
        Download Files
      </button>
    </div>
  `,
  styles: [`
    .export-panel {
      padding: 1rem;
      background: #1a1a2e;
      border-radius: 8px;
    }
    .framework-selector {
      margin-bottom: 1rem;
    }
    .preview-area {
      background: #0f0f1a;
      padding: 1rem;
      border-radius: 4px;
      margin: 1rem 0;
    }
    pre {
      white-space: pre-wrap;
      max-height: 300px;
      overflow: auto;
    }
  `]
})
export class ExportPanelComponent {
  selectedFramework: Framework = 'react';
  useTypeScript = true;
  includeStyles = true;
  showPreview = signal(false);
  previewCode = signal('');

  constructor(private exportService: ExportService) {}

  previewExport() {
    // Get current component from editor
    const currentComponent = this.getCurrentComponent();
    if (!currentComponent) return;

    const code = this.exportService.export(currentComponent, {
      framework: this.selectedFramework,
      typescript: this.useTypeScript,
      styles: 'css'
    });

    this.previewCode.set(code);
    this.showPreview.set(true);
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.previewCode());
  }

  downloadExport() {
    // Implement ZIP download
  }

  private getCurrentComponent(): ComponentMetadata | null {
    // Get from editor state
    return null; // TODO: Implement
  }
}
```

---

## 📁 Estructura de Archivos

```
libs/shared-components/src/lib/services/export/
├── index.ts                          # Exports públicos
├── export.service.ts                 # Servicio principal (MVP)
├── export.service.full.ts            # Servicio completo
├── orchestrator.ts                   # ExportOrchestrator
├── models/
│   ├── export.model.ts              # Interfaces
│   └── component.model.ts           # ComponentMetadata
├── exporters/
│   ├── index.ts
│   ├── exporter-base.ts             # Clase base
│   ├── react.exporter.ts
│   ├── angular.exporter.ts
│   ├── vue.exporter.ts
│   └── web-component.exporter.ts
├── transformers/
│   ├── ast-transformer.ts
│   ├── prop-transformer.ts
│   └── style-transformer.ts
├── formatters/
│   ├── prettier.formatter.ts
│   └── linter.ts
└── templates/
    ├── react-templates.ts
    ├── angular-templates.ts
    ├── vue-templates.ts
    └── web-component-templates.ts
```

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('ReactExporter', () => {
  it('should generate functional component', () => {
    const component: ComponentMetadata = {
      name: 'Button',
      props: [{ name: 'variant', type: 'string' }],
      // ...
    };
    
    const result = exporter.generate(component);
    
    expect(result).toContain('export const Button');
    expect(result).toContain('React.FC');
  });

  it('should generate TypeScript interface', () => {
    // Test prop interfaces
  });

  it('should handle optional props', () => {
    // Test optional props
  });
});
```

### Integration Tests
```typescript
describe('ExportOrchestrator', () => {
  it('should export to all frameworks', async () => {
    const component = createTestComponent();
    
    const react = await orchestrator.export(component, 'react');
    const angular = await orchestrator.export(component, 'angular');
    const vue = await orchestrator.export(component, 'vue');
    const webComponent = await orchestrator.export(component, 'web-component');
    
    expect(react.success).toBe(true);
    expect(angular.success).toBe(true);
    expect(vue.success).toBe(true);
    expect(webComponent.success).toBe(true);
  });
});
```

---

## 📦 Deliverables

### v1.0 (MVP - 2 semanas)
- [x] ExportOrchestrator básico
- [x] React exporter (functional components)
- [x] Angular exporter (standalone)
- [x] Vue exporter (Composition API)
- [x] Web Component exporter
- [x] Preview UI en editor
- [x] Copy to clipboard

### v1.5 (3-4 semanas)
- [ ] TypeScript strict mode
- [ ] CSS/SCSS modules support
- [ ] Tailwind class extraction
- [ ] Storybook generation
- [ ] Jest test templates
- [ ] ZIP download

### v2.0 (5-6 semanas)
- [ ] Design tokens export
- [ ] Multi-component export
- [ ] Figma plugin import
- [ ] GitHub integration
- [ ] CI/CD templates

---

## 🎯 Métricas de Éxito

### Technical
- [ ] 95%+ code generation success rate
- [ ] Linting pass rate > 90%
- [ ] Bundle size < 50KB
- [ ] Export time < 500ms per component

### User
- [ ] User satisfaction > 4.5/5
- [ ] Export usage > 50% of Pro users
- [ ] Support tickets < 5% of total

---

**Creado:** Febrero 2026  
**Versión:** 1.0  
**Estado:** Ready for Implementation
