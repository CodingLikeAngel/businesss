# 🎯 Referencia Completa: Draggable Box (Golden Standard)

Este documento sirve como **referencia definitiva** para el componente Draggable Box, el cual representa el "Golden Standard" de implementación para componentes editables premium.

---

## 📋 Índice

1. [Arquitectura General](#arquitectura-general)
2. [Componentes UI (draggable-box-1/2/3)](#componentes-ui)
3. [Editor Section Component](#editor-section-component)
4. [Isolated Mode Component](#isolated-mode-component)
5. [Flujo de Datos](#flujo-de-datos)
6. [Features Premium](#features-premium)
7. [Código de Referencia](#código-de-referencia)

---

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                    editor-feature.component                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │            editor-draggable-box-section                  │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │            draggable-box (wrapper)               │    │    │
│  │  │  ┌───────────────────────────────────────────┐  │    │    │
│  │  │  │  lib-ui-components-draggable-box-X        │  │    │    │
│  │  │  │  (Componente visual puro)                 │  │    │    │
│  │  │  └───────────────────────────────────────────┘  │    │    │
│  │  │  [resize-handles]                               │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │       editor-draggable-box-isolated-mode (Modal)        │    │
│  │  ┌────────────┐  ┌────────────────────────────────┐     │    │
│  │  │  Sidebar   │  │         Canvas                 │     │    │
│  │  │  Controls  │  │  ┌──────────────────────────┐  │     │    │
│  │  │            │  │  │   draggable-wrapper      │  │     │    │
│  │  │            │  │  │   + resize handles       │  │     │    │
│  │  │            │  │  └──────────────────────────┘  │     │    │
│  │  └────────────┘  └────────────────────────────────┘     │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Componentes UI

### Ubicación

`libs/ui-components/src/lib/draggable-box/`

### Variantes Disponibles

- `draggable-box-1`: Card estándar con contenido centrado
- `draggable-box-2`: Widget de acción con icono lateral
- `draggable-box-3`: Card expandida con descripción

### Inputs Mandatorios (Big 5)

| Input          | Tipo                       | Default       | Descripción                                     |
| -------------- | -------------------------- | ------------- | ----------------------------------------------- |
| `variant`      | string                     | `'secondary'` | Variante de estilo (primary, neon, glass, etc.) |
| `rounded`      | `'none' \| 'md' \| 'full'` | `'md'`        | Preset de border-radius                         |
| `size`         | `'sm' \| 'md' \| 'lg'`     | `'md'`        | Escala del componente                           |
| `dark`         | boolean                    | `false`       | Modo oscuro local                               |
| `customStyles` | object                     | `{}`          | Overrides CSS manuales                          |

### SCSS Crítico

```scss
.draggable-box-X {
  @include shared.apply-all-variants('variant-');

  // OBLIGATORIO: Llenar contenedor padre
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
```

---

## 📝 Editor Section Component

### Ubicación

`libs/features/editor/feature-editor/.../draggable-box/editor-draggable-box-section.component.ts`

### Responsabilidades

1. **Renderizar** el componente en el canvas principal
2. **Gestionar** drag & drop y resize en contexto normal
3. **Abrir** Isolated Mode cuando se solicita
4. **Sincronizar** cambios con el NgRx Store

### Puntos de Entrada Rápido

```html
<!-- DOUBLE CLICK para entrar en Isolated Mode -->
<div class="box-content-wrapper" (dblclick)="openIsolatedMode()">
  <!-- FLOATING BUTTON de acción rápida -->
  <button class="quick-isolated-btn" (click)="openIsolatedMode($event)" title="Editar en Modo Aislado (I)">🎯</button>
</div>
```

### Validación de Dimensiones

```typescript
private loadPositionFromStore() {
  // ... cargar valores ...

  // ROBUSTNESS: Clamp dimensions
  if (width) {
    this.boxWidth = Math.min(800, Math.max(100, parsedWidth));
  }
  if (height) {
    this.boxHeight = Math.min(600, Math.max(60, parsedHeight));
  }
}
```

---

## 🖼️ Isolated Mode Component

### Ubicación

`libs/features/editor/feature-editor/.../draggable-box/editor-draggable-box-isolated-mode.component.ts`

### Features Premium Implementados

#### 1. Ambient Responsive Canvas

El fondo del canvas cambia según el modo oscuro del componente.

```html
<div class="isolated-canvas" [class.ambient-dark]="editableContent.dark" [class.show-grid]="showGrid"></div>
```

```scss
.isolated-canvas {
  background: #f1f5f9;
}
.isolated-canvas.ambient-dark {
  background: #020617;
}
```

#### 2. Magnetic Grid (Snap to Grid)

```typescript
if (this.snapToGrid) {
  newX = Math.round(newX / this.gridSize) * this.gridSize;
  newY = Math.round(newY / this.gridSize) * this.gridSize;
}
```

```scss
.grid-snapping.show-grid {
  background-image: radial-gradient(var(--primary-accent) 2px, transparent 2px);
}
```

#### 3. Ghost Preview

```html
<div class="ghost-wrapper" *ngIf="isDragging || isResizing" [style.left.px]="initialPosition.x" [style.top.px]="initialPosition.y"></div>
```

#### 4. Undo/Redo Stack

```typescript
private undoStack: UndoRedoState[] = [];
private redoStack: UndoRedoState[] = [];

undo() {
  if (this.undoStack.length > 1) {
    const current = this.undoStack.pop()!;
    this.redoStack.push(current);
    this.restoreState(this.undoStack[this.undoStack.length - 1]);
  }
}
```

#### 5. Default Sizes per Variant

```typescript
const defaultSizes: Record<string, { width: number; height: number }> = {
  'draggable-box-1': { width: 280, height: 120 },
  'draggable-box-2': { width: 260, height: 100 },
  'draggable-box-3': { width: 320, height: 180 },
};
```

---

## 🔄 Flujo de Datos

```
┌──────────────────────────────────────────────────────────────┐
│                        NgRx Store                             │
│  section.styles = { left, top, width, height, ... }          │
│  section.content = { variant, boxVariant, rounded, ... }     │
└──────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│               editor-draggable-box-section                    │
│  loadPositionFromStore() → validateDimensions() → state      │
└──────────────────────────────────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
   [Main Canvas]                 [Isolated Mode]
   - Drag/Resize básico          - Drag/Resize avanzado
   - Click → Select              - Grid, Snap, Ghost
                                 - Undo/Redo
                                 - Controls completos
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│             applyIsolatedChanges(config)                      │
│  - Actualiza estado local                                     │
│  - Dispatch al store (debounced)                              │
└──────────────────────────────────────────────────────────────┘
```

---

## ⌨️ Atajos de Teclado

| Tecla          | Acción               |
| -------------- | -------------------- |
| `I`            | Abrir Isolated Mode  |
| `G`            | Toggle Grid          |
| `S`            | Toggle Snap          |
| `R`            | Reset posición       |
| `Ctrl+Z`       | Undo                 |
| `Ctrl+Shift+Z` | Redo                 |
| `Escape`       | Cerrar Isolated Mode |

---

## 📁 Estructura de Archivos

```
libs/features/editor/feature-editor/src/lib/pages/editor/components/draggable-box/
├── editor-draggable-box-section.component.ts    # Sección del editor principal
├── editor-draggable-box-isolated-mode.component.ts  # Modal de edición avanzada
└── (estilos inline en los componentes)

libs/ui-components/src/lib/draggable-box/
├── draggable-box-1/
│   ├── draggable-box-1.component.ts
│   ├── draggable-box-1.component.html
│   └── draggable-box-1.component.scss
├── draggable-box-2/
│   └── ...
└── draggable-box-3/
    └── ...
```

---

## ✅ Checklist para Nuevos Componentes

Usa este Draggable Box como referencia para implementar nuevos componentes editables:

### UI Component

- [ ] Implementa los "Big 5" inputs
- [ ] SCSS usa `apply-all-variants('variant-')`
- [ ] Tiene `width: 100%; height: 100%` para llenar wrapper
- [ ] Exportado en `index.ts`

### Editor Section

- [ ] Extiende `EnhancedBaseEditorSectionComponent`
- [ ] Tiene `(dblclick)="openIsolatedMode()"` y botón flotante
- [ ] Valida dimensiones al cargar del store
- [ ] Usa `outline` para selección (no `border`)

### Isolated Mode

- [ ] Canvas con Ambient Theme (dark/light)
- [ ] Grid con Snap magnético
- [ ] Ghost preview durante drag
- [ ] Undo/Redo stack
- [ ] Default sizes sensatos por variante

---

**Última actualización**: 2026-02-05
