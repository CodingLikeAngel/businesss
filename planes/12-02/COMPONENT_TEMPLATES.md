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
         (dblclick)="openIsolatedMode()"
         [enhancedVisualEditable]="getComponentConfig()"
         elementId="{{section.id + '_el'}}"
         (visualEvents)="handleComponentEvent($event)">

      <!-- Quick Action Floating Button -->
      <button class="quick-isolated-btn" (click)="openIsolatedMode($event)" title="Editar Avanzado (I)">
        🎯
      </button>

      <lib-ui-[component-name]
        [variant]="section.content['variant'] || getVariant(section.id)"
        [rounded]="section.content['rounded'] || 'md'"
        [size]="section.content['size'] || 'md'"
        [dark]="section.content['dark'] || false"
        [label]="section.content['label']"
        [customStyles]="section.styles || {}"
      ></lib-ui-[component-name]>
    </div>
  `,
  styles: [`
    .editor-element { position: relative; cursor: move; }
    .quick-isolated-btn {
      position: absolute; top: 10px; right: 10px;
      width: 32px; height: 32px;
      background: rgba(99, 102, 241, 0.9);
      border-radius: 50%; opacity: 0;
      transform: scale(0.8); transition: all 0.2s;
    }
    .editor-element:hover .quick-isolated-btn { opacity: 1; transform: scale(1); }
  `]
})
export class Editor[ComponentName]SectionComponent extends EnhancedBaseEditorSectionComponent {
  openIsolatedMode(event?: MouseEvent) {
    if (event) event.stopPropagation();
    // Logic to open isolated mode...
  }
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

        <!-- Header with History Controls -->
        <div class="isolated-mode-header">
           <div class="history-controls">
              <button (click)="undo()" [disabled]="!canUndo">↶</button>
              <button (click)="redo()" [disabled]="!canRedo">↷</button>
           </div>
           <div class="canvas-controls">
              <button [class.active]="showGrid" (click)="toggleGrid()">#</button>
              <button [class.active]="snapToGrid" (click)="toggleSnap()">⊞</button>
           </div>
        </div>

        <div class="isolated-mode-body">
           <!-- Premium Sidebar -->
           <aside class="controls-sidebar">
             <div class="sidebar-section">
               <label>Tamaño Base</label>
               <select [(ngModel)]="editableContent.size" class="premium-select">
                 <option value="sm">Pequeño</option><option value="md">Normal</option><option value="lg">Grande</option>
               </select>

               <label>Modo Luz Canvas</label>
               <div class="premium-toggle" [class.active]="editableContent.dark" (click)="toggleDark()">
                 <span>{{ editableContent.dark ? 'OSCURO' : 'CLARO' }}</span>
               </div>
             </div>
           </aside>

           <!-- Professional Canvas (Ambient Responsive) -->
           <div class="isolated-canvas" [class.ambient-dark]="editableContent.dark" [class.show-grid]="showGrid" [class.snapping]="snapToGrid">
             <div class="canvas-inner">
                <!-- GHOST PREVIEW -->
                <div class="ghost-wrapper" *ngIf="isDragging" [style.left.px]="initialX" [style.top.px]="initialY"></div>

                <div class="draggable-wrapper" (mousedown)="onMouseDown($event)"
                     [class.magnetic-active]="snapToGrid && isDragging"
                     [style.left.px]="currentPosition.x" [style.top.px]="currentPosition.y">
                  <lib-ui-[component-name] ...inputs...></lib-ui-[component-name]>
                </div>
             </div>
           </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
           <button (click)="close()">Cancelar</button>
           <button class="btn-primary" (click)="apply()">Guardar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .isolated-canvas { background: #f1f5f9; transition: background 0.4s; }
    .isolated-canvas.ambient-dark { background: #020617; }
    .isolated-canvas.show-grid { background-image: radial-gradient(rgba(0,0,0,0.1) 1.5px, transparent 1.5px); background-size: 40px 40px; }
    .isolated-canvas.ambient-dark.show-grid { background-image: radial-gradient(rgba(255,255,255,0.2) 1.5px, transparent 1.5px); }
    .isolated-canvas.snapping.show-grid { background-image: radial-gradient(var(--primary-accent) 2px, transparent 2px); }
  `]
})
export class Editor[ComponentName]IsolatedModeComponent {
  // 🚀 CRITICAL: Implementar sync de los "Big 5" y Undo/Redo stack
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
