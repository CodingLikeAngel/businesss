# 🎨 Plantillas Rápidas para Crear Componentes (Golden Standard)

Use estas plantillas para asegurar compatibilidad total con el sistema de edición visual avanzado.

---

## 📋 Template 1: UI Component (Atom/Molecule)

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
  // 🚀 MANDATORIOS: Los "Big 5" del Editor
  variant = input<[COMPONENT_NAME]VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  customStyles = input<Record<string, any>>({});

  // Inputs de contenido
  label = input('Label Content');

  // Computed: Clases estandarizadas
  componentClasses = computed(() => {
    const classes = ['[component-name]', `variant-${this.variant()}`];
    classes.push(`[component-name]-rounded-${this.rounded()}`);
    classes.push(`[component-name]-size-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  // Computed: Estilos personalizados
  componentStyles = computed(() => {
    const styles: Record<string, any> = { ...this.customStyles() };

    // Mapeo inteligente de variables si existen
    if (styles['backgroundColor']) styles['--component-bg'] = styles['backgroundColor'];
    if (styles['borderColor']) styles['--component-border'] = styles['borderColor'];

    return styles;
  });
}
```

### HTML

```html
<div [class]="componentClasses()" [style]="componentStyles()">
  <span class="content">{{ label() }}</span>
</div>
```

### SCSS

```scss
@use '../../styles/mixins' as shared;

:host {
  display: block;
  width: 100%;
  height: 100%; // 🚀 IMPORTANTE: Para que el redimensionado funcione
}

.[component-name] {
  // 🚀 REGLA DE ORO: Usar prefijo 'variant-'
  @include shared.apply-all-variants('variant-');

  width: 100%;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  // States
  &.dark {
    background: #0f172a;
    color: white;
  }

  // Rounded Presets
  &.draggable-box-1-rounded-none {
    border-radius: 0;
  }
  &.draggable-box-1-rounded-full {
    border-radius: 9999px;
  }
}
```

---

## 📋 Template 2: Editor Section (The Bridge)

### TypeScript

```typescript
@Component({
  selector: 'lib-editor-[component-name]-section',
  standalone: true,
  imports: [CommonModule, UI[ComponentName]Component, EnhancedVisualEditableDirective],
  template: `
    <div #componentElement class="editor-element"
         [class.is-selected]="selectedElementId === section.id + '_el'"
         (click)="selectElement($event, getMergedElement(section.id, section.id + '_el', section.content, '[component-name]'))"
         [enhancedVisualEditable]="getComponentConfig()"
         elementId="{{section.id + '_el'}}"
         (visualEvents)="handleComponentEvent($event)">

      <lib-ui-[component-name]
        [variant]="section.content['variant'] || getVariant(section.id)"
        [rounded]="section.content['rounded'] || 'md'"
        [size]="section.content['size'] || 'md'"
        [dark]="section.content['dark'] || false"
        [label]="section.content['label']"
        [customStyles]="section.styles || {}"
      ></lib-ui-[component-name]>
    </div>
  `
})
export class Editor[ComponentName]SectionComponent extends EnhancedBaseEditorSectionComponent {
  // 🚀 Implementar lógica de guardado y sync aquí
}
```

---

## 📋 Template 3: Isolated Mode (Premium Editor)

### TypeScript

```typescript
@Component({
  selector: 'lib-editor-[name]-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UI[ComponentName]Component],
  template: `
    <div class="isolated-mode-overlay" (click)="close()">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">

        <!-- Premium Sidebar -->
        <div class="controls-sidebar">
          <div class="sidebar-section">
            <h4>APARIENCIA</h4>
            <div class="control-group">
              <label>Variante</label>
              <select [(ngModel)]="editableContent.variant" (ngModelChange)="onContentChange()" class="premium-select">
                <option *ngFor="let v of availableVariants" [value]="v">{{v}}</option>
              </select>
            </div>

            <div class="toggle-row">
               <span>Modo Oscuro</span>
               <div class="premium-toggle" [class.active]="editableContent.dark" (click)="toggleDark()">
                 <div class="handle"></div>
               </div>
            </div>
          </div>
        </div>

        <!-- Professional Canvas -->
        <div class="isolated-canvas">
          <div class="canvas-inner">
             <div class="draggable-wrapper"
                  [style.left.px]="currentPosition.x"
                  [style.top.px]="currentPosition.y"
                  [style.width.px]="currentSize.width"
                  [style.height.px]="currentSize.height">
               <lib-ui-[component-name]
                 [variant]="editableContent.variant"
                 [rounded]="editableContent.rounded"
                 [size]="editableContent.size"
                 [dark]="editableContent.dark"
                 [customStyles]="getCustomStyles()">
               </lib-ui-[component-name]>
             </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="isolated-mode-footer">
          <button (click)="close()" class="btn-secondary">Cancelar</button>
          <button (click)="apply()" class="btn-primary">Guardar Cambios</button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './isolated-mode.premium.scss' // Reusar o extender de un core SCSS
})
export class Editor[ComponentName]IsolatedModeComponent {
  // 🚀 CRITICAL: Implementar sync de los "Big 5"
  apply() {
    const updated = {
       content: {
         ...this.editableContent,
         variant: this.editableContent.variant,
         rounded: this.editableContent.rounded,
         size: this.editableContent.size,
         dark: this.editableContent.dark
       },
       styles: { ...this.editableStyles },
       position: this.currentPosition,
       size: this.currentSize
    };
    this.applied.emit(updated);
  }
}
```

---

## ✅ Checklist de Implementación Universal

- [ ] ¿El componente UI tiene los Inputs: `variant`, `rounded`, `size`, `dark`, `customStyles`?
- [ ] ¿El SCSS usa `@include shared.apply-all-variants('variant-')`?
- [ ] ¿El componente UI tiene `width: 100%` y `height: 100%`?
- [ ] ¿El Editor Section pasa TODAS las propiedades al componente UI?
- [ ] ¿El Isolated Mode sincroniza las 5 propiedades al guardar?
- [ ] ¿Se disparan los z-index correctamente en Isolated Mode?

---

**¡Sigue estas reglas para que tus componentes se sientan premium! 🚀**
