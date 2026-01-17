# Sistema de Edición Visual Avanzado - Documentación

## 📋 Resumen de Implementación

Se ha implementado un sistema completo de edición visual con las siguientes características:

### ✅ 1. Sistema de Registro de Variantes (`variant-registry.ts`)

**Ubicación:** `libs/shared-components/src/lib/shared-components/variant-selector/variant-registry.ts`

**Características:**

- ✅ **35+ variantes** organizadas en 5 categorías:

  - Básicas (primary, secondary, outline, ghost)
  - Modernas (glass, neon, cyberpunk, retro, minimal)
  - Temáticas (jungle, enchanted, mystic, ancient, twilight, frosty, desert, candy, oceanic, fiery)
  - Avanzadas (matrix, stellar, phoenix, aqua, plasma, cosmic, vaporwave, aurora)
  - Premium (luxury, elegant, vintage, success, default)

- ✅ **Detección automática de tipo de componente**

  - Detecta: button, card, input, section, hero, navbar, footer, modal, table, form
  - Basado en: type, tagName, className

- ✅ **Propiedades editables específicas por tipo**
  - Propiedades comunes (backgroundColor, color, padding, margin, etc.)
  - Propiedades específicas por componente (fontSize para buttons, backgroundImage para sections, etc.)

**Uso:**
\`\`\`typescript
import { ALL_VARIANTS, getEditableProperties, detectComponentType } from './variant-registry';

// Obtener todas las variantes
const variants = ALL_VARIANTS;

// Detectar tipo de componente
const type = detectComponentType(element);

// Obtener propiedades editables
const properties = getEditableProperties(element);
\`\`\`

---

### ✅ 2. DesignEditorComponent Mejorado

**Ubicación:** `libs/shared-components/src/lib/shared-components/variant-selector/design-editor.component.ts`

**Características:**

- ✅ **Dropdown completo de variantes** con categorías
- ✅ **Grid de variantes rápidas** para acceso rápido
- ✅ **Selectores de color funcionales** (color picker + input hex)
- ✅ **Propiedades específicas por componente** (solo muestra las relevantes)
- ✅ **Grupos colapsables** organizados:
  - 🎨 Colores (fondo, texto, borde)
  - ✨ Efectos Visuales (blur, sombra, opacidad)
  - 📝 Tipografía (tamaño, peso, transformación, espaciado)
  - 📐 Espaciado & Layout (padding, margin, width, height)
  - ⬜ Bordes (border, borderRadius)
  - 🖼️ Fondo (backgroundImage, size, position)
  - 📦 Flexbox (direction, justify, align, gap)
- ✅ **Botón de reset** para restablecer estilos
- ✅ **Inputs mejorados** con validación visual
- ✅ **Rangos** para propiedades numéricas (opacidad)
- ✅ **Selects** para propiedades predefinidas

**Uso:**
\`\`\`html
<lib-design-editor
[selectedElement]="selectedElement"
[selectedSection]="selectedSection"
(styleChanged)="onStyleChange()"
(variantApplied)="onVariantApply($event)"

> </lib-design-editor>
> \`\`\`

---

### ✅ 3. Sistema de Drag & Resize Visual

**Ubicación:** `libs/shared-components/src/lib/shared-components/variant-selector/visual-editor.service.ts`

**Características:**

- ✅ **Drag & Drop** de elementos
- ✅ **Resize con 8 handles** (top, right, bottom, left, corners)
- ✅ **Snap to grid** configurable
- ✅ **Restricciones de tamaño** (min/max width/height)
- ✅ **Overlay visual** con borde animado
- ✅ **Label de dimensiones** en tiempo real
- ✅ **Eventos observables** (elementSelected$, elementResized$, elementMoved$)
- ✅ **Modo de edición** activable/desactivable

**Configuración:**
\`\`\`typescript
export interface DragResizeConfig {
enableDrag: boolean; // Habilitar arrastre
enableResize: boolean; // Habilitar redimensionamiento
minWidth?: number; // Ancho mínimo
minHeight?: number; // Alto mínimo
maxWidth?: number; // Ancho máximo
maxHeight?: number; // Alto máximo
handles?: Partial<ResizeHandles>; // Handles activos
grid?: number; // Snap to grid (px)
containment?: 'parent' | 'viewport' | ElementRef;
}
\`\`\`

**Uso Programático:**
\`\`\`typescript
import { VisualEditorService } from './visual-editor.service';

constructor(private visualEditor: VisualEditorService) {}

// Activar modo de edición
this.visualEditor.enableEditMode();

// Hacer un elemento editable
const cleanup = this.visualEditor.makeEditable(element, {
enableDrag: true,
enableResize: true,
minWidth: 100,
minHeight: 50,
grid: 5
});

// Escuchar eventos
this.visualEditor.elementResized$.subscribe(({ element, bounds }) => {
console.log('Elemento redimensionado:', bounds);
});

// Desactivar modo de edición
this.visualEditor.disableEditMode();

// Cleanup
cleanup();
\`\`\`

---

### ✅ 4. Directiva Visual Editable

**Ubicación:** `libs/shared-components/src/lib/shared-components/variant-selector/visual-editable.directive.ts`

**Características:**

- ✅ **Uso declarativo** en templates
- ✅ **Configuración automática** por tipo (section vs element)
- ✅ **Eventos de salida** (visualResized, visualMoved, visualSelected)
- ✅ **Configuración personalizable**

**Uso en Templates:**
\`\`\`html

<!-- Para secciones (solo resize vertical) -->
<section
  visualEditable
  visualType="section"
  (visualResized)="onSectionResized($event)"
>
  Contenido de la sección
</section>

<!-- Para elementos (drag + resize completo) -->
<div
  visualEditable
  visualType="element"
  [visualConfig]="{ minWidth: 100, grid: 10 }"
  (visualMoved)="onElementMoved($event)"
  (visualResized)="onElementResized($event)"
>
  Contenido del elemento
</div>
\`\`\`

---

## 🎯 Separación de Edición: Secciones vs Elementos

### Secciones

- **Drag:** Deshabilitado (las secciones no se mueven)
- **Resize:** Solo vertical (handle bottom)
- **Propiedades:** backgroundImage, minHeight, display, flexbox
- **Uso:** Para contenedores principales de página

### Elementos

- **Drag:** Habilitado (se pueden mover libremente)
- **Resize:** Completo (8 handles)
- **Propiedades:** Específicas según tipo (button, card, input, etc.)
- **Uso:** Para componentes internos

---

## 📦 Integración en el Editor

### 1. Importar en el módulo/componente:

\`\`\`typescript
import { VisualEditableDirective } from './visual-editable.directive';
import { VisualEditorService } from './visual-editor.service';

@Component({
imports: [
// ... otros imports
VisualEditableDirective
],
providers: [VisualEditorService]
})
\`\`\`

### 2. Activar modo de edición:

\`\`\`typescript
export class EditorComponent {
constructor(private visualEditor: VisualEditorService) {}

ngOnInit() {
this.visualEditor.enableEditMode();
}

ngOnDestroy() {
this.visualEditor.disableEditMode();
}
}
\`\`\`

### 3. Aplicar a elementos:

\`\`\`html

<div *ngFor="let section of sections">
  <section
    visualEditable
    visualType="section"
    [attr.data-section-id]="section.id"
    (visualResized)="updateSectionHeight(section, $event)"
  >
    <!-- Contenido de la sección -->
    
    <div
      *ngFor="let element of section.elements"
      visualEditable
      visualType="element"
      [attr.data-element-id]="element.id"
      (visualMoved)="updateElementPosition(element, $event)"
      (visualResized)="updateElementSize(element, $event)"
    >
      <!-- Contenido del elemento -->
    </div>
  </section>
</div>
\`\`\`

---

## 🎨 Estilos Visuales

El sistema añade automáticamente estilos CSS cuando se activa el modo de edición:

- **`.visual-editable`**: Outline punteado para elementos editables
- **`.visual-selected`**: Borde sólido para elemento seleccionado
- **`.visual-edit-overlay`**: Overlay con handles y label
- **`.visual-resize-handle`**: Handles de redimensionamiento
- **`.visual-dimension-label`**: Label con dimensiones

---

## 🔄 Flujo de Trabajo

1. **Usuario activa modo de edición** → `visualEditor.enableEditMode()`
2. **Elementos se vuelven editables** → Outline punteado visible
3. **Usuario hace click en elemento** → Se selecciona y muestra overlay
4. **Usuario arrastra/redimensiona** → Actualización en tiempo real
5. **Eventos emitidos** → Componente padre actualiza modelo de datos
6. **Usuario guarda cambios** → Persistir en backend/localStorage

---

## 📊 Próximos Pasos Sugeridos

### Completar Component Explorer:

- [ ] Añadir componentes faltantes (Input, Select, Checkbox, Radio, etc.)
- [ ] Mejorar previsualizaciones con datos reales
- [ ] Añadir búsqueda/filtrado de componentes

### Mejorar Sistema Visual:

- [ ] Añadir guías de alineación (snap to other elements)
- [ ] Implementar multi-selección (Ctrl+Click)
- [ ] Añadir undo/redo
- [ ] Añadir copy/paste de elementos
- [ ] Añadir teclado shortcuts (Delete, Ctrl+C, Ctrl+V, etc.)

### Persistencia:

- [ ] Guardar cambios visuales en el modelo
- [ ] Sincronizar con VariantService
- [ ] Implementar auto-save

---

## 🐛 Notas de Depuración

### Si el drag/resize no funciona:

1. Verificar que `enableEditMode()` fue llamado
2. Verificar que el elemento tiene `position: relative` o `absolute`
3. Verificar que no hay z-index conflictivos
4. Revisar consola para errores

### Si los colores no se actualizan:

1. Verificar que `targetStyles` existe
2. Verificar que `styleChanged.emit()` se está llamando
3. Verificar que el componente padre está escuchando el evento

### Si las variantes no se aplican:

1. Verificar que el componente tiene soporte para esa variante
2. Verificar que los mixins SCSS están importados
3. Verificar que `variantApplied.emit()` se está llamando

---

## 📝 Ejemplo Completo

\`\`\`typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { VisualEditorService } from './visual-editor.service';
import { VisualEditableDirective } from './visual-editable.directive';

@Component({
selector: 'app-page-editor',
standalone: true,
imports: [VisualEditableDirective],
template: \`
<div class="editor-container">
<button (click)="toggleEditMode()">
{{ editMode ? 'Desactivar' : 'Activar' }} Edición Visual
</button>

      <div class="canvas">
        <section
          *ngFor="let section of sections"
          visualEditable
          visualType="section"
          [style.minHeight.px]="section.height"
          (visualResized)="onSectionResize(section, $event)"
        >
          <h2>{{ section.title }}</h2>

          <div
            *ngFor="let element of section.elements"
            visualEditable
            visualType="element"
            [style.left.px]="element.x"
            [style.top.px]="element.y"
            [style.width.px]="element.width"
            [style.height.px]="element.height"
            (visualMoved)="onElementMove(element, $event)"
            (visualResized)="onElementResize(element, $event)"
          >
            {{ element.content }}
          </div>
        </section>
      </div>
    </div>

\`
})
export class PageEditorComponent implements OnInit, OnDestroy {
editMode = false;
sections = [
{
id: 1,
title: 'Hero Section',
height: 400,
elements: [
{ id: 1, content: 'Button', x: 50, y: 50, width: 120, height: 40 }
]
}
];

constructor(private visualEditor: VisualEditorService) {}

ngOnInit() {
this.visualEditor.enableEditMode();
this.editMode = true;
}

ngOnDestroy() {
this.visualEditor.disableEditMode();
}

toggleEditMode() {
this.editMode = !this.editMode;
if (this.editMode) {
this.visualEditor.enableEditMode();
} else {
this.visualEditor.disableEditMode();
}
}

onSectionResize(section: any, bounds: any) {
section.height = bounds.height;
console.log('Section resized:', section);
}

onElementMove(element: any, bounds: any) {
element.x = bounds.x;
element.y = bounds.y;
console.log('Element moved:', element);
}

onElementResize(element: any, bounds: any) {
element.width = bounds.width;
element.height = bounds.height;
console.log('Element resized:', element);
}
}
\`\`\`

---

## 🎉 Conclusión

El sistema de edición visual está completamente implementado y listo para usar. Proporciona:

✅ **Edición de variantes** con dropdown completo
✅ **Edición de propiedades** específicas por componente
✅ **Drag & Drop** visual con feedback en tiempo real
✅ **Resize** con 8 handles y restricciones
✅ **Separación clara** entre secciones y elementos
✅ **API limpia** tanto programática como declarativa

Para cualquier duda o mejora, consultar este documento o revisar el código fuente de los servicios y directivas.
