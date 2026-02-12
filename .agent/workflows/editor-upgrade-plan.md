---
description: Plan maestro para elevar TODOS los componentes del editor al estándar gold del draggable-box
---

# 🎯 Plan Maestro — Editor Editing Experience Upgrade

> **Objetivo**: Llevar TODOS los componentes del visual editor al mismo nivel de calidad de edición que tiene el `draggable-box`, que actúa como **gold standard**.

---

## 📊 Auditoría del Estado Actual

### Componentes con Modo Aislado (32 archivos `*-isolated-mode.component.ts`)

| Tier       | Componente      | Undo/Redo | Resize 8pt | Drag | Grid/Snap | Keyboard | Esc/Cancel | Sidebar Pro |
| ---------- | --------------- | --------- | ---------- | ---- | --------- | -------- | ---------- | ----------- |
| 🥇 Gold    | `draggable-box` | ✅        | ✅         | ✅   | ✅        | ✅       | ✅         | ✅          |
| 🥈 Silver  | `button`        | ✅        | ✅         | ✅   | ✅        | ⚠️       | ✅         | ✅          |
| 🥉 Bronze  | `chip`          | ❌        | ❌         | ✅   | ❌        | ❌       | ✅         | ✅          |
| 🟡 Basic   | `title`         | ❌        | ⚠️ S only  | ❌   | ❌        | ❌       | ✅         | ⚠️          |
| 🟡 Basic   | `card-animated` | ❌        | ⚠️ S only  | ❌   | ❌        | ❌       | ✅         | ⚠️          |
| 🟡 Basic   | `image`         | ❌        | ⚠️         | ❌   | ❌        | ❌       | ✅         | ⚠️          |
| 🟡 Basic   | `card-premium`  | ❌        | ⚠️         | ❌   | ❌        | ❌       | ✅         | ⚠️          |
| 🟡 Basic   | `card-product`  | ❌        | ⚠️         | ❌   | ❌        | ❌       | ✅         | ⚠️          |
| 🟡 Basic   | `list`          | ❌        | ⚠️         | ❌   | ❌        | ❌       | ✅         | ⚠️          |
| 🟡 Basic   | `accordion`     | ❌        | ⚠️         | ❌   | ❌        | ❌       | ✅         | ⚠️          |
| 🔴 Minimal | All others (22) | ❌        | ❌         | ❌   | ❌        | ❌       | ⚠️         | ❌          |

---

## 🏗️ Arquitectura de Mejora

### Paso 0: Crear un `BaseIsolatedModeComponent` (FOUNDATION)

**Problema**: Cada isolated mode duplica ~400 líneas de lógica idéntica (drag, resize, undo/redo, grid, snap, keyboard shortcuts, mouse listeners, position dock, footer, header).

**Solución**: Crear una clase base abstracta que:

- Handles ALL mouse/touch events for drag & resize (8-point handles)
- Implements undo/redo stack
- Manages grid + snap state
- Provides keyboard shortcuts (arrows, G, S, R, Escape, Ctrl+Z/Y)
- Manages viewport scaling
- Manages position dock rendering via shared template

**Archivo**: `libs/features/editor/feature-editor/src/lib/pages/editor/components/base-isolated-mode.component.ts`

```
BaseIsolatedModeComponent
├── @Input() config: IsolatedModeConfig
├── @Output() closed: EventEmitter<void>
├── @Output() applied: EventEmitter<IsolatedModeConfig>
├── currentPosition: {x, y}
├── currentSize: {width, height}
├── editableContent: any
├── editableStyles: any
├── isDragging, isResizing, resizeHandle
├── viewportScale
├── showGrid, snapToGrid, gridSize
├── undoStack, redoStack
├── canUndo, canRedo
├──
├── abstract getDefaultSize(): {width, height}
├── abstract getDefaultPosition(): {x, y}
├── abstract buildContent(): any
├── abstract buildStyles(): any
├──
├── onMouseDown(), startResize(), onMouseMove(), onMouseUp()
├── handleArrowKey(), toggleGrid(), toggleSnap()
├── undo(), redo(), saveState()
├── apply(), cancel(), close()
├── scrollToComponent()
└── getCustomStyles() (overridable)
```

### Paso 1: Shared Styles Mixin

**Problema**: Cada isolated mode repite ~200 líneas de CSS casi idénticas.

**Solución**: Crear un archivo SCSS compartido con mixins para:

- Overlay, container, header, footer
- Sidebar, sections, controls, inputs
- Canvas, grid, draggable wrapper
- Resize handles, position dock
- Animations

**Archivo**: `libs/features/editor/feature-editor/src/lib/pages/editor/components/_isolated-mode-shared.scss`

### Paso 2: Shared Template Partials

Los templates comparten estructura:

1. Header (badge, breadcrumb, actions)
2. Body → Sidebar + Canvas
3. Footer (hint + save/discard)

Las únicas diferencias son:

- **Sidebar sections**: Controles específicos del componente
- **Canvas content**: El componente UI renderizado

---

## 📋 Plan de Ejecución por Tiers

### TIER 1: Foundation (Prerequisito) — Estimado: 1 sesión

1. [ ] Crear `BaseIsolatedModeComponent` con toda la lógica shared
2. [ ] Crear `_isolated-mode-shared.scss` con estilos shared
3. [ ] Refactorizar `draggable-box-isolated-mode` para extender de Base (prueba de concepto)
4. [ ] Verificar que funciona igual que antes

### TIER 2: Core Components (más usados) — Estimado: 2 sesiones

5. [ ] Migrar `button-isolated-mode` → extends Base
6. [ ] Migrar `chip-isolated-mode` → extends Base + ADD resize 8pt, undo/redo, grid/snap
7. [ ] Migrar `title-isolated-mode` → extends Base + ADD drag, resize 8pt, undo, grid
8. [ ] Migrar `image-isolated-mode` → extends Base + ADD drag, resize 8pt, undo, grid
9. [ ] Migrar `card-animated-isolated-mode` → extends Base + ADD features
10. [ ] Migrar `accordion-isolated-mode` → extends Base + ADD features

### TIER 3: Content Components — Estimado: 2 sesiones

11. [ ] Migrar `card-premium-isolated-mode` → extends Base
12. [ ] Migrar `card-product-isolated-mode` → extends Base
13. [ ] Migrar `card-rutas-isolated-mode` → extends Base
14. [ ] Migrar `card-testimonial-isolated-mode` → extends Base
15. [ ] Migrar `list-isolated-mode` → extends Base
16. [ ] Migrar `gallery-isolated-mode` → extends Base

### TIER 4: Sections/Complex — Estimado: 2 sesiones

17. [ ] Migrar `hero-isolated-mode` → extends Base
18. [ ] Migrar `features-isolated-mode` → extends Base
19. [ ] Migrar `pricing-isolated-mode` → extends Base
20. [ ] Migrar `testimonials-isolated-mode` → extends Base
21. [ ] Migrar `contact-isolated-mode` → extends Base
22. [ ] Migrar `cta-isolated-mode` → extends Base
23. [ ] Migrar `faq-isolated-mode` → extends Base
24. [ ] Migrar `stats-isolated-mode` → extends Base
25. [ ] Migrar `steps-isolated-mode` → extends Base

### TIER 5: Media & Interactive — Estimado: 1 sesión

26. [ ] Migrar `video-isolated-mode` → extends Base
27. [ ] Migrar `map-isolated-mode` → extends Base
28. [ ] Migrar `shape-isolated-mode` → extends Base
29. [ ] Migrar `table-isolated-mode` → extends Base
30. [ ] Migrar `tabs-isolated-mode` → extends Base

### TIER 6: Remaining — Estimado: 1 sesión

31. [ ] Migrar `products-isolated-mode` → extends Base
32. [ ] Migrar `promotions-isolated-mode` → extends Base
33. [ ] Migrar `services-isolated-mode` → extends Base
34. [ ] Migrar `showcase-isolated-mode` → extends Base
35. [ ] Migrar `newsletter-isolated-mode` → extends Base (si existe)
36. [ ] Migrar `smart-container-isolated-mode` → extends Base

---

## 🎨 Mejoras UX Globales a Implementar

### 1. **Keyboard Shortcuts Unificados** (en BaseIsolatedMode)

- `Escape` → Cancelar/Cerrar
- `Ctrl+Z` / `Cmd+Z` → Deshacer
- `Ctrl+Y` / `Ctrl+Shift+Z` → Rehacer
- `G` → Grid toggle
- `S` → Snap toggle
- `R` → Reset position/size
- `Arrow Keys` → Movimiento fino (1px), `Shift+Arrow` → 10px
- `Ctrl+S` → Guardar y cerrar
- `Delete/Backspace` → Borrar componente (con confirmación)

### 2. **Visual Feedback Mejorado**

- Outline animado al seleccionar en el canvas
- Crosshair guides al arrastrar
- Dimension labels en vivo durante resize
- Snapping visualizado con líneas magnéticas
- Transition suave al soltar (settle animation)

### 3. **Position Dock Inteligente**

- Mostrar X, Y, Width, Height
- Mostrar distancia al borde más cercano
- Mostrar elemento padre
- Editable en línea (click para escribir valor)

### 4. **Zoom & Navigation**

- Ctrl+Scroll → Zoom canvas
- Space+Drag → Pan canvas
- Ctrl+0 → Fit to view
- Ctrl+1 → 100%

---

## 🔧 Mejoras Específicas del Layout Section

### Mejoras ya implementadas:

- [x] SlotResizeService centralizado
- [x] ResizeHandleDirective con 8 puntos
- [x] Customización de grid template por resize
- [x] Clase `.resizing` para deshabilitar transitions
- [x] Segregación layout styles vs appearance styles

### Mejoras pendientes dentro del Layout Section:

1. [ ] **Drag & Drop para reordenar slots** (CDK DragDrop)
2. [ ] **Alignment Guides** — Smart guides al mover/redimensionar
3. [ ] **Dimensiones en Tooltip** — Mostrar WxH mientras se redimensiona un slot
4. [ ] **Quick Actions Menu** — Context menu al right-click en un slot
5. [ ] **Copy/Paste Slots** — Duplicar configuración de un slot a otro
6. [ ] **Lock Ratio** — Mantener aspect ratio al redimensionar (Shift+drag)
7. [ ] **Undo/Redo para resizes** — Integrar con el HistoryService global

---

## 📐 Convenciones de Código

### Naming

- Isolated mode components: `Editor{Component}IsolatedModeComponent`
- Section components: `Editor{Component}SectionComponent`
- Base classes: `Base{Concept}Component`

### Structure

- Cada carpeta de componente:
  ```
  {component}/
  ├── editor-{component}-section.component.ts
  ├── editor-{component}-isolated-mode.component.ts
  ├── editor-{component}-{variant}-section.component.ts (si aplica)
  └── README.md (opcional)
  ```

### Template Pattern (Isolated Mode)

```html
<div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
  <div class="isolated-mode-container" (click)="$event.stopPropagation()">
    <!-- Header: badge + breadcrumb + action buttons -->
    <div class="isolated-mode-header">...</div>

    <div class="isolated-mode-body">
      <!-- Sidebar: Component-specific controls -->
      <div class="controls-sidebar">...</div>

      <!-- Canvas: Live preview with drag+resize -->
      <div class="isolated-canvas">
        <div class="canvas-inner" [class.show-grid]="showGrid">
          <div class="draggable-wrapper" ...>
            <!-- COMPONENT GOES HERE -->
            <!-- 8 resize handles -->
          </div>
        </div>
        <div class="modern-position-dock">...</div>
      </div>
    </div>

    <!-- Footer: hint + discard/save -->
    <div class="isolated-mode-footer">...</div>
  </div>
</div>
```

---

## 🚀 Resumen Ejecutivo

| Metric                        | Actual  | Post-Upgrade |
| ----------------------------- | ------- | ------------ |
| Componentes con Drag completo | 3 (10%) | 32 (100%)    |
| Componentes con Resize 8pt    | 2 (6%)  | 32 (100%)    |
| Componentes con Undo/Redo     | 2 (6%)  | 32 (100%)    |
| Componentes con Grid/Snap     | 2 (6%)  | 32 (100%)    |
| Componentes con Keyboard      | 1 (3%)  | 32 (100%)    |
| Líneas de código duplicadas   | ~6000   | ~800 (base)  |
| Estimación total              | —       | ~9 sesiones  |

**El primer paso más impactante es crear el `BaseIsolatedModeComponent`**. Con eso listo, migrar cada componente es simplemente:

1. Extender la base
2. Definir `getDefaultSize()` y `buildContent()/buildStyles()`
3. Añadir las sidebar sections específicas del componente
4. El template envuelve su componente UI dentro del `draggable-wrapper` compartido

Todo lo demás (drag, resize, undo, grid, keyboard, position dock, zoom) viene gratis de la base.
