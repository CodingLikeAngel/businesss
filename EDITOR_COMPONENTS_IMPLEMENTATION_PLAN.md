# Plan de Implementación: Componentes Editables en el Editor

## 📋 Objetivo

Hacer que todos los componentes de la librería UI sean completamente editables en el editor visual, con soporte para:

- ✅ Custom styles (backgroundColor, color, etc.)
- ✅ Variant selection
- ✅ Property editing en tiempo real
- ✅ Visual feedback

## 🎯 Estado Actual

### ✅ Componentes YA Implementados (Con Editor Wrapper)

Estos componentes ya tienen su wrapper en `libs/features/editor/feature-editor/src/lib/pages/editor/components/`:

1. ✅ **accordion** - Editor wrapper completo
2. ✅ **breadcrumbs** - Editor wrapper completo
3. ✅ **bubble** - Editor wrapper completo
4. ✅ **chart** - Editor wrapper completo
5. ✅ **chip** - Editor wrapper completo
6. ✅ **contact** - Editor wrapper completo
7. ✅ **cta** - Editor wrapper completo
8. ✅ **faq** - Editor wrapper completo
9. ✅ **features** - Editor wrapper completo
10. ✅ **footer** - Editor wrapper completo
11. ✅ **gallery** - Editor wrapper completo
12. ✅ **header** - Editor wrapper completo
13. ✅ **hero** - Editor wrapper completo
14. ✅ **list** - Editor wrapper completo
15. ✅ **newsletter** - Editor wrapper completo
16. ✅ **pricing** - Editor wrapper completo
17. ✅ **products** - Editor wrapper completo
18. ✅ **promotions** - Editor wrapper completo
19. ✅ **services** - Editor wrapper completo
20. ✅ **showcase** - Editor wrapper completo
21. ✅ **spinner** - Editor wrapper completo
22. ✅ **stats** - Editor wrapper completo
23. ✅ **steps** - Editor wrapper completo
24. ✅ **table** - Editor wrapper completo
25. ✅ **tabs** - Editor wrapper completo
26. ✅ **testimonials** - Editor wrapper completo

### ❌ Componentes FALTANTES (Sin Editor Wrapper)

Estos componentes existen en `libs/ui-components/src/lib/` pero NO tienen wrapper de editor:

1. ❌ **button** - Falta wrapper
2. ❌ **image** - Falta wrapper
3. ❌ **modal** - Falta wrapper (solo se usa como overlay, no como sección)
4. ❌ **card** (genérico) - Falta wrapper
5. ❌ **card-rutas** - Falta wrapper
6. ❌ **card-premium** - Falta wrapper
7. ❌ **tooltip** - Falta wrapper (componente auxiliar)
8. ❌ **title** - Falta wrapper
9. ❌ **input** - Falta wrapper
10. ❌ **date-time-picker** - Falta wrapper

---

## 📝 Plan de Implementación por Fases

### **FASE 1: Componentes de Alta Prioridad** (Día 1-2)

#### 1.1 Button Component

**Archivo**: `libs/features/editor/feature-editor/src/lib/pages/editor/components/button/editor-button-section.component.ts`

```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIButtonComponent } from '@negocio/ui-components';
import { ApplyDynamicStylesDirective, VisualEditableDirective } from '@negocio/shared-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-button-section',
  standalone: true,
  imports: [CommonModule, UIButtonComponent, ApplyDynamicStylesDirective, VisualEditableDirective],
  template: `
    <div *ngIf="!isMobile" class="editor-section cursor-pointer py-8" [class.is-selected]="selectedSectionId === section.id" (click)="selectSection($event, section)" [applyDynamicStyles]="section.styles" [visualEditable]="true" visualType="section">
      <div class="container mx-auto px-6 max-w-7xl flex justify-center">
        <lib-ui-components-button [variant]="getVariant(section.id)" [size]="section.content['size'] || 'md'" [rounded]="section.content['rounded'] || 'md'" [customStyles]="section.customStyles" class="editor-element" [class.is-selected]="selectedElementId === section.id + '_button'" (click)="selectElement($event, { id: section.id + '_button', sectionId: section.id, content: section.content, type: 'button' })" [visualEditable]="true" visualType="element">
          {{ section.content['label'] || 'Button' }}
        </lib-ui-components-button>
      </div>
    </div>
  `,
})
export class EditorButtonSectionComponent extends BaseEditorSectionComponent {
  @Input() override section: any;
}
```

**HTML Template**: `editor-button-section.component.html`

#### 1.2 Title Component

**Similar al Button**, pero usando `UITitleComponent`

#### 1.3 Image Component

**Similar**, pero con preview de imagen y upload

---

### **FASE 2: Componentes de Tarjetas** (Día 3)

#### 2.1 Card (Genérico)

#### 2.2 Card Rutas

#### 2.3 Card Premium

Todos siguiendo el mismo patrón de wrapper.

---

### **FASE 3: Componentes de Formulario** (Día 4)

#### 3.1 Input Component

#### 3.2 Date-Time-Picker Component

---

### **FASE 4: Componentes Auxiliares** (Día 5)

#### 4.1 Tooltip Component

#### 4.2 Modal Component (como sección editable)

---

## 🔧 Patrón Estándar para Crear Wrappers

### Estructura de Archivos

```
libs/features/editor/feature-editor/src/lib/pages/editor/components/
└── [component-name]/
    ├── editor-[component-name]-section.component.ts
    └── editor-[component-name]-section.component.html
```

### Template TypeScript Base

```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UI[ComponentName]Component } from '@negocio/ui-components';
import {
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-[component-name]-section',
  standalone: true,
  imports: [
    CommonModule,
    UI[ComponentName]Component,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-[component-name]-section.component.html'
})
export class Editor[ComponentName]SectionComponent extends BaseEditorSectionComponent {
  @Input() override section: any;
}
```

### Template HTML Base

```html
<!-- DESKTOP -->
<div *ngIf="!isMobile" class="editor-section cursor-pointer py-12" [class.is-selected]="selectedSectionId === section.id" (click)="selectSection($event, section)" [applyDynamicStyles]="section.styles" [visualEditable]="true" visualType="section" (visualResized)="onSectionResized($event)">
  <div class="container mx-auto px-6 max-w-7xl">
    <lib-ui-[component-selector] [variant]="getVariant(section.id)" [customStyles]="section.customStyles" [applyDynamicStyles]="section.styles" class="editor-element" [class.is-selected]="selectedElementId === section.id + '_element'" (click)="selectElement($event, getMergedElement(section.id, section.id + '_element', section.content, 'element'))" [visualEditable]="true" visualType="element"> </lib-ui-[component-selector]>
  </div>
</div>

<!-- MOBILE -->
<div *ngIf="isMobile" class="editor-section cursor-pointer py-8 p-4" [class.is-selected]="selectedSectionId === section.id" (click)="selectSection($event, section)">
  <!-- Similar pero simplificado -->
</div>
```

---

## 📊 Checklist de Verificación

Para cada componente nuevo, verificar:

- [ ] ✅ Componente UI tiene `customStyles` input
- [ ] ✅ Componente UI tiene `variant` input
- [ ] ✅ Componente UI usa `computed()` para estilos
- [ ] ✅ SCSS tiene `@include shared.apply-all-variants()`
- [ ] ✅ SCSS tiene overrides `!important` para custom styles
- [ ] ✅ Wrapper de editor creado
- [ ] ✅ Wrapper usa `ApplyDynamicStylesDirective`
- [ ] ✅ Wrapper usa `VisualEditableDirective`
- [ ] ✅ Wrapper extiende `BaseEditorSectionComponent`
- [ ] ✅ Template tiene versión desktop y mobile
- [ ] ✅ Componente añadido a `component-explorer.component.ts`
- [ ] ✅ Componente añadido al switch en `editor-feature.component.html`

---

## 🚀 Comandos Útiles

### Generar nuevo wrapper de editor

```bash
npx nx g @schematics/angular:component editor-[name]-section --project=feature-editor --path=libs/features/editor/feature-editor/src/lib/pages/editor/components/[name] --export --skip-tests --style=none --inline-template=false
```

### Compilar y verificar

```bash
npx nx build ui-components
npx nx build feature-editor
npx nx serve antoStudios
```

---

## 📅 Estimación de Tiempo

- **Fase 1** (Button, Title, Image): 4-6 horas
- **Fase 2** (Cards): 3-4 horas
- **Fase 3** (Forms): 3-4 horas
- **Fase 4** (Auxiliares): 2-3 horas

**Total estimado**: 12-17 horas de trabajo

---

## 🎯 Próximos Pasos INMEDIATOS

1. **Crear wrapper para Button** (más simple, buen punto de partida)
2. **Crear wrapper para Title** (muy usado)
3. **Crear wrapper para Image** (visual, importante)
4. **Actualizar component-explorer** para incluir estos componentes
5. **Actualizar editor-feature.component.html** con los nuevos `*ngSwitchCase`

---

## 📝 Notas Importantes

- Todos los componentes UI ya tienen la estructura de custom styles
- El patrón está bien establecido (header, footer, accordion)
- Solo falta crear los wrappers de editor
- La mayoría del trabajo es copy-paste y ajuste de nombres

**Guardado**: `EDITOR_COMPONENTS_IMPLEMENTATION_PLAN.md`
