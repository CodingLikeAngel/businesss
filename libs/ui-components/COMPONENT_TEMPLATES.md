# 🎨 Plantillas Rápidas para Crear Componentes

Plantillas listas para copiar y pegar al crear nuevos componentes.

---

## 📋 Template 1: Componente Simple (Atom)

### TypeScript

```typescript
import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../../models/ui-components-data.model';

const [COMPONENT_NAME]Variants = baseVariants;
type [COMPONENT_NAME]VariantType = typeof [COMPONENT_NAME]Variants[number] | (string & {});

@Component({
  selector: 'lib-ui-[component-name]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './[component-name].component.html',
  styleUrl: './[component-name].component.scss'
})
export class UI[ComponentName]Component {
  // Inputs
  label = input('Label');
  variant = input<[COMPONENT_NAME]VariantType>('primary');
  customStyles = input<Record<string, any>>({});

  // Computed
  componentClasses = computed(() => [
    '[component-name]',
    `variant-${this.variant()}`
  ].filter(Boolean));

  componentStyles = computed(() => this.customStyles());
}
```

### HTML

```html
<div [class]="componentClasses()" [style]="componentStyles()" class="[component-name]-container">{{ label() }}</div>
```

### SCSS

```scss
@use '../../styles/mixins' as shared;

:host {
  display: block;
  width: 100%;
}

.[component-name] {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;

  // ⚠️ IMPORTANTE: Aplicar variants aquí
  @include shared.apply-all-variants('variant-');

  // Overrides específicos si es necesario
  &.variant-neon {
    border: 1px solid var(--neon-primary, #00f3ff);
    box-shadow: 0 0 20px rgba(0, 243, 255, 0.2);
  }
}
```

---

## 📋 Template 2: Componente con Subtypes (como Header/Footer)

### TypeScript

```typescript
import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../../models/ui-components-data.model';

const [COMPONENT_NAME]Variants = baseVariants;
type [COMPONENT_NAME]VariantType = typeof [COMPONENT_NAME]Variants[number] | (string & {});

@Component({
  selector: 'lib-ui-[component-name]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './[component-name].component.html',
  styleUrl: './[component-name].component.scss'
})
export class UI[ComponentName]Component {
  title = input('[Component Name]');
  variant = input<[COMPONENT_NAME]VariantType>('primary');
  customStyles = input<Record<string, any>>({});

  componentClasses = computed(() => [
    '[component-name]',
    `variant-${this.variant()}`
  ].filter(Boolean));

  componentStyles = computed(() => this.customStyles());
}
```

### HTML con ngSwitch para subtypes

```html
<ng-container [ngSwitch]="subtype()">
  <!-- SUBTYPE 1 -->
  <div *ngSwitchCase="'type1'" [class]="componentClasses()" [style]="componentStyles()">
    <!-- Contenido tipo 1 -->
  </div>

  <!-- SUBTYPE 2 -->
  <div *ngSwitchCase="'type2'" [class]="componentClasses()" [style]="componentStyles()">
    <!-- Contenido tipo 2 -->
  </div>

  <!-- DEFAULT -->
  <div *ngSwitchDefault [class]="componentClasses()" [style]="componentStyles()">
    <!-- Contenido por defecto -->
  </div>
</ng-container>
```

---

---

## 📋 Template 3: Editor Section Component (Universal & Draggable)

Use this template to ensure your component is automatically draggable, resizable, and editable.

### TypeScript

```typescript
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { UI[ComponentName]Component } from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

@Component({
  selector: 'lib-editor-[component-name]-section',
  standalone: true,
  imports: [
    CommonModule,
    UI[ComponentName]Component,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  template: `
    <div #sectionElement
      class="editor-section cursor-pointer py-4 transition-all"
      [class.is-selected]="selectedSectionId === section.id"
      (click)="selectSection($event, section)"
      [applyDynamicStyles]="section.styles"
      [enhancedVisualEditable]="getSectionConfig()"
      sectionId="{{section.id}}"
      (visualEvents)="handleSectionEvent($event)">

      <div #componentElement class="editor-element"
           [class.is-selected]="selectedElementId === section.id + '_[component-name]'"
           (click)="selectElement($event, getMergedElement(section.id, section.id + '_[component-name]', section.content, '[component-name]'))"
           [enhancedVisualEditable]="getComponentConfig()"
           elementId="{{section.id + '_[component-name]'}}"
           sectionId="{{section.id}}"
           (visualEvents)="handleComponentEvent($event)">
        <lib-ui-[component-name]
          [variant]="$any(section.content['variant'] || getVariant(section.id))"
          [label]="section.content['label'] || 'Label'"
          [customStyles]="section.styles || {}"
        ></lib-ui-[component-name]>
      </div>
    </div>
  `
})
export class Editor[ComponentName]SectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('componentElement', { static: true }) componentElement!: ElementRef;

  ngAfterViewInit() {
    // 🚀 Regla de Oro: Registrar para edición visual
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.componentElement, this.section.id + '_[component-name]');
  }

  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section', {
      styling: {
        selectionOutline: '2px solid #6366f1',
        hoverEffects: true,
        resizeHandles: true
      } as any
    });
  }

  getComponentConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      enableDrag: true,    // ⬅️ Permitir arrastrar
      enableResize: true,  // ⬅️ Permitir redimensionar
      styling: {
        selectionOutline: '2px solid #10b981',
        hoverEffects: true,
        resizeHandles: true
      } as any
    });
  }

  handleSectionEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id);
  }

  handleComponentEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_[component-name]');
  }
}
```

---

## 📋 Template 4: Registro en Component Explorer

### 1. Import

```typescript
import { UI[ComponentName]Component } from '@negocio/ui-components';

// En imports array:
imports: [
  // ... otros ...
  UI[ComponentName]Component
]
```

### 2. Añadir a lista de componentes

```typescript
{
  type: '[component-name]',
  label: '[Component Name]',
  icon: '🔔', // Cambiar por emoji apropiado
  description: 'Descripción del componente',
  category: '[category]', // 'feedback', 'layout', 'navigation', etc.
  libraryType: 'component', // o 'section'
  variants: [
    'primary',
    'secondary',
    'outline',
    'ghost',
    'neon',
    'cyberpunk',
    'glass',
    'gradient'
  ]
}
```

### 3. Añadir preview

```html
<div *ngSwitchCase="'[component-name]'" class="p-4">
  <lib-ui-[component-name] [variant]="$any(selectedVariant)" [label]="'Ejemplo'"> </lib-ui-[component-name]>
</div>
```

---

## 📋 Template 5: Añadir al Editor Feature

### 1. Import en TypeScript

```typescript
import { Editor[ComponentName]SectionComponent } from '../components/[component-name]/editor-[component-name]-section.component';

// En imports:
imports: [
  // ... otros ...
  Editor[ComponentName]SectionComponent
]
```

### 2. Añadir caso en HTML

```html
<!-- [COMPONENT NAME] -->
<lib-editor-[component-name]-section *ngSwitchCase="'[component-name]'" [section]="section" [componentVariants]="componentVariants" [globalVariant]="globalVariant" (elementMoved)="onElementMoved($event.bounds, $event.elementId, section)" (elementResized)="onElementResized($event.bounds, $event.elementId, section)" (sectionResized)="onSectionResized($event.section, $event.bounds)"> </lib-editor-[component-name]-section>
```

---

## 🔄 Reemplazos Necesarios

Al usar estas plantillas, reemplaza:

- `[COMPONENT_NAME]` → Nombre en mayúsculas (ej: `NOTIFICATION`)
- `[ComponentName]` → PascalCase (ej: `Notification`)
- `[component-name]` → kebab-case (ej: `notification`)
- `[category]` → Categoría apropiada
- `🔔` → Emoji apropiado para el componente

---

## 📝 Variants Mínimos Recomendados

```typescript
variants: [
  // Básicos (4 obligatorios)
  'primary',
  'secondary',
  'outline',
  'ghost',

  // Modernos (elegir 3-4)
  'neon',
  'cyberpunk',
  'glass',
  'gradient',
  'retro',
  'minimal',

  // Temáticos (opcional)
  'dark',
  'success',
  'danger',
];
```

**Total mínimo: 7 variants** (4 básicos + 3 modernos)

---

## ✅ Quick Checklist

- [ ] Componente UI creado
- [ ] SCSS con `apply-all-variants` en elemento correcto
- [ ] Exportado en `index.ts`
- [ ] Registrado en `component-explorer`
- [ ] Preview añadido
- [ ] Editor section creado
- [ ] Añadido a `editor-feature` (desktop y mobile)
- [ ] Mínimo 7 variants configurados
- [ ] Probado en el editor

---

**¡Listo para usar! 🚀**
