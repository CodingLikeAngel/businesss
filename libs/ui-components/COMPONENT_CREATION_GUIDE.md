# 📘 Guía Completa: Crear y Añadir Componentes al Editor

Esta guía te enseñará cómo crear nuevos componentes UI, configurar sus variants, y añadirlos al editor visual de forma completa.

---

## 📋 Índice

1. [Estructura de Componentes](#estructura-de-componentes)
2. [Paso 1: Crear el Componente UI](#paso-1-crear-el-componente-ui)
3. [Paso 2: Configurar Variants en SCSS](#paso-2-configurar-variants-en-scss)
4. [Paso 3: Exportar el Componente](#paso-3-exportar-el-componente)
5. [Paso 4: Registrar en Component Explorer](#paso-4-registrar-en-component-explorer)
6. [Paso 5: Crear Sección de Editor](#paso-5-crear-sección-de-editor)
7. [Paso 6: Añadir al Editor Feature](#paso-6-añadir-al-editor-feature)
8. [Paso 7: Configurar Variants (Mínimo 3-4)](#paso-7-configurar-variants-mínimo-3-4)
9. [Checklist Final](#checklist-final)

---

## 🏗️ Estructura de Componentes

```
libs/ui-components/src/lib/
├── [component-name]/
│   ├── [component-name].component.ts
│   ├── [component-name].component.html
│   ├── [component-name].component.scss
│   └── (opcional) styles/
│       ├── _base.scss
│       ├── _variables.scss
│       └── _animations.scss
```

---

## 📝 Paso 1: Crear el Componente UI

### 1.1 Crear la estructura de archivos

Crea una nueva carpeta en `libs/ui-components/src/lib/[component-name]/`

**Ejemplo: `notification`**

```typescript
// notification.component.ts
import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../../models/ui-components-data.model';

const notificationVariants = baseVariants;
type NotificationVariantType = (typeof notificationVariants)[number] | (string & {});

@Component({
  selector: 'lib-ui-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class UINotificationComponent {
  // Inputs
  title = input('Notificación');
  message = input('Este es un mensaje de notificación');
  variant = input<NotificationVariantType>('primary');
  type = input<'info' | 'success' | 'warning' | 'error'>('info');
  dismissible = input(true);
  customStyles = input<Record<string, any>>({});

  // Outputs
  dismissed = output<void>();

  // Computed
  notificationClasses = computed(() => ['notification', `variant-${this.variant()}`, `type-${this.type()}`, this.dismissible() ? 'is-dismissible' : ''].filter(Boolean));

  notificationStyles = computed(() => this.customStyles());

  onDismiss() {
    this.dismissed.emit();
  }
}
```

```html
<!-- notification.component.html -->
<div [class]="notificationClasses()" [style]="notificationStyles()" class="notification-container">
  <div class="notification-icon">
    <span *ngIf="type() === 'info'">ℹ️</span>
    <span *ngIf="type() === 'success'">✅</span>
    <span *ngIf="type() === 'warning'">⚠️</span>
    <span *ngIf="type() === 'error'">❌</span>
  </div>

  <div class="notification-content">
    <h4 class="notification-title">{{ title() }}</h4>
    <p class="notification-message">{{ message() }}</p>
  </div>

  <button *ngIf="dismissible()" class="notification-close" (click)="onDismiss()" aria-label="Cerrar notificación">✕</button>
</div>
```

---

## 🎨 Paso 2: Configurar Variants en SCSS

### 2.1 Estructura básica del SCSS

```scss
// notification.component.scss
@use '../../styles/mixins' as shared;

:host {
  display: block;
  width: 100%;
}

.notification {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  // ⚠️ IMPORTANTE: Aplicar variants en el elemento que tiene la clase variant-*
  @include shared.apply-all-variants('variant-');

  // Estilos específicos por tipo
  &.type-info {
    border-left: 4px solid #3b82f6;
  }

  &.type-success {
    border-left: 4px solid #10b981;
  }

  &.type-warning {
    border-left: 4px solid #f59e0b;
  }

  &.type-error {
    border-left: 4px solid #ef4444;
  }

  // Overrides específicos para variants populares
  &.variant-neon {
    border: 1px solid var(--neon-primary, #00f3ff);
    box-shadow: 0 0 20px rgba(0, 243, 255, 0.2);
  }

  &.variant-cyberpunk {
    background: #000;
    border: 2px solid #facc15;
    border-radius: 0;
    box-shadow: 6px 6px 0 #ff003c;
  }

  &.variant-glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
}

.notification-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: inherit;
}

.notification-message {
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.9;
  color: inherit;
}

.notification-close {
  background: transparent;
  border: none;
  color: inherit;
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
}
```

### 2.2 ⚠️ Regla Importante

**El mixin `apply-all-variants` DEBE aplicarse en el elemento que tiene la clase `variant-${variant}`**

✅ **Correcto:**

```scss
.notification {
  @include shared.apply-all-variants('variant-');
}
```

❌ **Incorrecto:**

```scss
:host {
  @include shared.apply-all-variants('variant-'); // ❌ No funciona
}
```

---

## 📤 Paso 3: Exportar el Componente

### 3.1 Añadir al index.ts

```typescript
// libs/ui-components/src/index.ts

// ... otros exports ...

export * from './lib/notification/notification.component';
```

---

## 🔍 Paso 4: Registrar en Component Explorer

### 4.1 Importar el componente

```typescript
// libs/shared-components/src/lib/shared-components/variant-selector/component-explorer.component.ts

import { UINotificationComponent } from '@negocio/ui-components';

// En el array de imports del @Component:
imports: [
  // ... otros imports ...
  UINotificationComponent,
];
```

### 4.2 Añadir a la lista de componentes

```typescript
// En el método que define los componentes (busca la variable components o similar)

{
  type: 'notification',
  label: 'Notificación',
  icon: '🔔',
  description: 'Muestra mensajes de notificación con diferentes estilos',
  category: 'feedback',
  libraryType: 'component',
  variants: [
    'primary',
    'secondary',
    'neon',
    'cyberpunk',
    'glass',
    'gradient',
    'retro',
    'minimal',
    'dark',
    'success',
    'danger'
  ]
}
```

### 4.3 Añadir preview en el template

```html
<!-- En el ngSwitch del preview-viewport -->

<div *ngSwitchCase="'notification'" class="p-4">
  <lib-ui-notification [variant]="$any(selectedVariant)" [type]="'info'" title="Notificación de Ejemplo" message="Este es un mensaje de notificación de prueba"> </lib-ui-notification>
</div>
```

---

## 🛠️ Paso 5: Crear Sección de Editor

### 5.1 Crear el componente de editor

```typescript
// libs/features/editor/feature-editor/src/lib/pages/editor/components/notification/editor-notification-section.component.ts

import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplyDynamicStylesDirective, EnhancedVisualEditableDirective, VisualEditingConfig, VisualEditingEvent } from '@negocio/shared-components';
import { UINotificationComponent } from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

@Component({
  selector: 'lib-editor-notification-section',
  standalone: true,
  imports: [CommonModule, UINotificationComponent, ApplyDynamicStylesDirective, EnhancedVisualEditableDirective],
  template: `
    <div #sectionElement class="editor-section cursor-pointer py-4 transition-all" [class.is-selected]="selectedSectionId === section.id" (click)="selectSection($event, section)" [applyDynamicStyles]="section.styles" [enhancedVisualEditable]="getSectionConfig()" sectionId="{{ section.id }}" (visualEvents)="handleSectionEvent($event)">
      <div #notificationElement class="editor-element" [class.is-selected]="selectedElementId === section.id + '_notification'" (click)="selectElement($event, getMergedElement(section.id, section.id + '_notification', section.content, 'notification'))" [enhancedVisualEditable]="getNotificationConfig()" elementId="{{ section.id + '_notification' }}" sectionId="{{ section.id }}" (visualEvents)="handleNotificationEvent($event)">
        <lib-ui-notification [variant]="$any(section.content['variant'] || getVariant(section.id))" [title]="section.content['title'] || 'Notificación'" [message]="section.content['message'] || 'Mensaje de notificación'" [type]="section.content['type'] || 'info'" [dismissible]="section.content['dismissible'] !== false" [customStyles]="section.styles || {}"></lib-ui-notification>
      </div>
    </div>
  `,
})
export class EditorNotificationSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('notificationElement', { static: true }) notificationElement!: ElementRef;

  ngAfterViewInit() {
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.notificationElement, this.section.id + '_notification');
  }

  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section', {
      styling: {
        selectionOutline: '2px solid #6366f1',
        hoverEffects: true,
        resizeHandles: true,
        dimensionLabels: true,
      } as any,
    });
  }

  getNotificationConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      styling: {
        selectionOutline: '2px solid #10b981',
        hoverEffects: !this.platformInfo.isMobile,
        resizeHandles: true,
        dimensionLabels: true,
      } as any,
    });
  }

  handleSectionEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id);
  }

  handleNotificationEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_notification');
  }
}
```

---

## 🎯 Paso 6: Añadir al Editor Feature

### 6.1 Importar en editor-feature.component.ts

```typescript
// libs/features/editor/feature-editor/src/lib/pages/editor/desktop/editor-feature.component.ts

import { EditorNotificationSectionComponent } from '../components/notification/editor-notification-section.component';

// En el array de imports:
imports: [
  // ... otros imports ...
  EditorNotificationSectionComponent,
];
```

### 6.2 Añadir caso en editor-feature.component.html

```html
<!-- libs/features/editor/feature-editor/src/lib/pages/editor/desktop/editor-feature.component.html -->

<ng-container [ngSwitch]="section.type" *ngIf="section.visible">
  <!-- ... otros casos ... -->

  <!-- NOTIFICATION -->
  <lib-editor-notification-section *ngSwitchCase="'notification'" [section]="section" [componentVariants]="componentVariants" [globalVariant]="globalVariant" (elementMoved)="onElementMoved($event.bounds, $event.elementId, section)" (elementResized)="onElementResized($event.bounds, $event.elementId, section)" (sectionResized)="onSectionResized($event.section, $event.bounds)"> </lib-editor-notification-section>

  <!-- ... otros casos ... -->
</ng-container>
```

**Repetir lo mismo en la versión mobile:**

- `libs/features/editor/feature-editor/src/lib/pages/editor/mobile/editor-feature.component.html`

---

## 🎨 Paso 7: Configurar Variants (Mínimo 3-4)

### 7.1 Variants recomendados por componente

Cada componente debe tener al menos **3-4 variants** bien configurados. Aquí tienes ejemplos:

#### Variants Básicos (Recomendados para todos)

1. **primary** - Estilo principal
2. **secondary** - Estilo secundario
3. **outline** - Solo borde
4. **ghost** - Transparente

#### Variants Modernos (Elige 3-4)

5. **neon** - Efecto neón
6. **cyberpunk** - Estilo cyberpunk
7. **glass** - Efecto glassmorphism
8. **gradient** - Gradiente de colores
9. **retro** - Estilo retro
10. **minimal** - Minimalista

#### Variants Temáticos (Opcionales)

11. **dark** - Tema oscuro
12. **light** - Tema claro
13. **success** - Verde (éxito)
14. **danger** - Rojo (error)

### 7.2 Ejemplo de configuración completa

```typescript
// En component-explorer.component.ts

{
  type: 'notification',
  label: 'Notificación',
  icon: '🔔',
  description: 'Muestra mensajes de notificación con diferentes estilos',
  category: 'feedback',
  libraryType: 'component',
  variants: [
    // Básicos (4)
    'primary',
    'secondary',
    'outline',
    'ghost',
    // Modernos (4)
    'neon',
    'cyberpunk',
    'glass',
    'gradient',
    // Temáticos (2)
    'success',
    'danger'
  ]
}
```

**Total: 10 variants** (más que suficiente, pero mínimo 3-4)

---

## ✅ Checklist Final

Antes de considerar el componente completo, verifica:

### Componente UI

- [ ] Componente creado en `libs/ui-components/src/lib/[name]/`
- [ ] TypeScript con inputs/outputs correctos
- [ ] HTML template funcional
- [ ] SCSS con `apply-all-variants` en el elemento correcto
- [ ] Exportado en `libs/ui-components/src/index.ts`

### Component Explorer

- [ ] Importado en `component-explorer.component.ts`
- [ ] Añadido a la lista de componentes con al menos 3-4 variants
- [ ] Preview añadido en el template del modal
- [ ] Categoría asignada correctamente

### Editor Section

- [ ] Componente de editor creado
- [ ] Extiende `EnhancedBaseEditorSectionComponent`
- [ ] Configuración de visual editing implementada
- [ ] Template con bindings correctos

### Editor Feature

- [ ] Importado en `editor-feature.component.ts` (desktop y mobile)
- [ ] Caso `*ngSwitchCase` añadido en HTML (desktop y mobile)
- [ ] Eventos configurados correctamente

### Variants

- [ ] Mínimo 3-4 variants configurados
- [ ] Variants funcionan correctamente
- [ ] Estilos específicos añadidos si es necesario

### Testing

- [ ] Componente se muestra en el explorer
- [ ] Preview funciona correctamente
- [ ] Se puede añadir al lienzo
- [ ] Variants se aplican correctamente
- [ ] Edición visual funciona

## 🚀 Paso 8: Integración con el Sistema Universal (NUEVO)

Para que tu componente sea "Premium" y soporte drag & drop nativo, sigue estos pasos extra:

### 8.1 Extender `EnhancedBaseEditorSectionComponent`

Asegúrate de que tu `EditorSectionComponent` extienda la clase base enriquecida.

### 8.2 Registrar en AfterViewInit

```typescript
ngAfterViewInit() {
  this.applySectionVisualEditing(this.sectionElement, this.section.id);
  this.applyElementVisualEditing(this.notificationElement, this.section.id + '_notification');
}
```

### 8.3 Configurar Draggability

En el método `getNotificationConfig` (o similar), habilita `enableDrag: true`.

---

## ✅ Checklist Final Actualizado

### Integración Universal

- [ ] Extiende `EnhancedBaseEditorSectionComponent`
- [ ] Llama a `applyElementVisualEditing` en `ngAfterViewInit`
- [ ] `enableDrag` y `enableResize` configurados en la config del elemento
- [ ] Eventos `handleVisualEvent` implementados
- [ ] Metadata de edición definida (próximamente)

---

## 📚 Ejemplos de Referencia

### Componentes Simples (Atoms)

- `button` - Botón básico
- `chip` - Chip/tag
- `spinner` - Cargador

### Componentes Medianos (Molecules)

- `notification` - Notificación
- `card` - Tarjeta
- `input` - Campo de entrada

### Componentes Complejos (Organisms)

- `header` - Cabecera (con subtypes)
- `footer` - Pie de página (con subtypes)
- `hero` - Hero section (con subtypes)

---

## 🚀 Tips y Mejores Prácticas

1. **Nombres consistentes**: Usa kebab-case para archivos y camelCase para clases
2. **Variants estándar**: Siempre incluye `primary`, `secondary`, `outline`, `ghost`
3. **Responsive**: Asegúrate de que el componente funcione en mobile
4. **Accesibilidad**: Añade `aria-label` y roles ARIA cuando sea necesario
5. **Documentación**: Comenta código complejo
6. **Testing**: Prueba todos los variants antes de commitear

---

## 🆘 Solución de Problemas

### Variants no se aplican

- ✅ Verifica que `apply-all-variants` esté en el elemento con clase `variant-*`
- ✅ Verifica que la clase se esté aplicando en el template: `[class]="classes()"`
- ✅ Revisa la consola del navegador por errores SCSS

### Componente no aparece en explorer

- ✅ Verifica que esté exportado en `index.ts`
- ✅ Verifica que esté importado en `component-explorer.component.ts`
- ✅ Verifica que esté en la lista de componentes

### No se puede editar visualmente

- ✅ Verifica que extienda `EnhancedBaseEditorSectionComponent`
- ✅ Verifica que tenga `@ViewChild` para los elementos
- ✅ Verifica que llame a `applySectionVisualEditing` en `ngAfterViewInit`

---

## 📝 Notas Finales

- Esta guía cubre el flujo completo de creación de componentes
- Sigue los patrones establecidos en componentes existentes
- Si tienes dudas, revisa componentes similares como referencia
- Mantén la consistencia con el resto del sistema

**¡Feliz desarrollo! 🎉**
