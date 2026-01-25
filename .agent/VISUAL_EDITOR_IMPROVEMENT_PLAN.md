# 🎯 Plan de Mejora del Motor de Edición Visual

**Objetivo**: Crear un sistema de edición drag/drop/resize de nivel profesional para el MVP

## 📊 Análisis del Estado Actual

### ✅ Lo que Funciona Bien

1. **Arquitectura sólida**: Separación de responsabilidades (VisualEditorService, DragDropService, ElementGroupService)
2. **Multi-selección**: Sistema de selección múltiple con Ctrl+Click
3. **Ghost dragging**: Elemento fantasma durante el arrastre
4. **Threshold de drag**: 5px antes de iniciar drag (evita clicks accidentales)
5. **Containment**: Sistema de límites para el drag
6. **Overlay system**: Overlay independiente con handles de resize
7. **Event system**: Observables para elementSelected$, elementMoved$, elementResized$

### ⚠️ Problemas Identificados

#### 1. **Drag & Drop**

- ❌ Secciones completas se pueden arrastrar (rompe el layout)
- ❌ Coordenadas pueden "saltar" al soltar
- ❌ No hay snap-to-grid funcional
- ❌ No hay guías de alineación
- ❌ Límites de containment muy restrictivos (no se puede bajar)

#### 2. **Resize**

- ❌ No hay resize implementado completamente
- ❌ Handles se crean pero no tienen lógica de resize
- ❌ No hay aspect ratio lock
- ❌ No hay indicadores de dimensiones en tiempo real

#### 3. **Selección**

- ❌ Multi-selección no muestra bounding box visual
- ❌ No hay selección por área (marquee selection)
- ❌ Selección de elementos anidados es confusa

#### 4. **UX**

- ❌ No hay undo/redo integrado con el drag
- ❌ No hay feedback visual durante operaciones
- ❌ No hay keyboard shortcuts (Arrow keys, Delete, Escape)
- ❌ No hay zoom del canvas

#### 5. **Performance**

- ❌ Sync loop con requestAnimationFrame puede ser costoso
- ❌ No hay debounce en eventos de mouse
- ❌ Overlay se recrea completamente en cada selección

## 🚀 Plan de Mejoras (Priorizado)

### 🔴 CRÍTICO - Semana 1 (Días 1-3)

#### Tarea 1.1: Implementar Resize Completo

**Archivo**: `visual-editor.service.ts` (líneas 800+)

**Problemas**:

- Los handles se crean pero `setupResize()` no tiene lógica
- No hay actualización de dimensiones

**Solución**:

```typescript
private setupResize(element: HTMLElement, overlay: HTMLElement, config: DragResizeConfig) {
  const handles = overlay.querySelectorAll('.visual-resize-handle');

  handles.forEach((handle: Element) => {
    const handleEl = handle as HTMLElement;
    const handleType = handleEl.getAttribute('data-handle');

    let startX = 0, startY = 0;
    let startWidth = 0, startHeight = 0;
    let startLeft = 0, startTop = 0;

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      this.isResizing = true;
      this.resizeHandle = handleType;

      const rect = element.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startWidth = rect.width;
      startHeight = rect.height;
      startLeft = rect.left;
      startTop = rect.top;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!this.isResizing) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;

      // Calculate new dimensions based on handle
      switch (handleType) {
        case 'right':
          newWidth = Math.max(config.minWidth || 50, startWidth + deltaX);
          break;
        case 'bottom':
          newHeight = Math.max(config.minHeight || 50, startHeight + deltaY);
          break;
        case 'left':
          newWidth = Math.max(config.minWidth || 50, startWidth - deltaX);
          newLeft = startLeft + deltaX;
          break;
        case 'top':
          newHeight = Math.max(config.minHeight || 50, startHeight - deltaY);
          newTop = startTop + deltaY;
          break;
        case 'bottom-right':
          newWidth = Math.max(config.minWidth || 50, startWidth + deltaX);
          newHeight = Math.max(config.minHeight || 50, startHeight + deltaY);
          break;
        // ... otros handles
      }

      // Apply constraints
      if (config.maxWidth) newWidth = Math.min(newWidth, config.maxWidth);
      if (config.maxHeight) newHeight = Math.min(newHeight, config.maxHeight);

      // Apply to element
      this.renderer.setStyle(element, 'width', `${newWidth}px`);
      this.renderer.setStyle(element, 'height', `${newHeight}px`);

      // Update overlay
      this.updateOverlayPosition(overlay, element);

      // Update dimension label
      const label = overlay.querySelector('.visual-dimension-label');
      if (label) {
        this.renderer.setProperty(label, 'textContent',
          `${Math.round(newWidth)} × ${Math.round(newHeight)}`);
      }
    };

    const onMouseUp = () => {
      if (!this.isResizing) return;

      this.isResizing = false;
      this.resizeHandle = null;

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      // Emit event
      const rect = element.getBoundingClientRect();
      this.elementResized$.next({
        element,
        bounds: {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height
        }
      });
    };

    this.renderer.listen(handleEl, 'mousedown', onMouseDown);
  });
}
```

#### Tarea 1.2: Guías de Alineación (Smart Guides)

**Nuevo archivo**: `alignment-guides.service.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class AlignmentGuidesService {
  private guides: HTMLElement[] = [];
  private snapThreshold = 5;

  showGuides(draggingElement: HTMLElement, allElements: HTMLElement[]): void {
    this.clearGuides();

    const dragRect = draggingElement.getBoundingClientRect();

    allElements.forEach((el) => {
      if (el === draggingElement) return;

      const rect = el.getBoundingClientRect();

      // Check vertical alignment
      if (Math.abs(dragRect.left - rect.left) < this.snapThreshold) {
        this.createGuide('vertical', rect.left);
      }
      if (Math.abs(dragRect.right - rect.right) < this.snapThreshold) {
        this.createGuide('vertical', rect.right);
      }

      // Check horizontal alignment
      if (Math.abs(dragRect.top - rect.top) < this.snapThreshold) {
        this.createGuide('horizontal', rect.top);
      }
      if (Math.abs(dragRect.bottom - rect.bottom) < this.snapThreshold) {
        this.createGuide('horizontal', rect.bottom);
      }
    });
  }

  private createGuide(type: 'vertical' | 'horizontal', position: number): void {
    const guide = document.createElement('div');
    guide.className = `alignment-guide alignment-guide-${type}`;
    guide.style.position = 'fixed';
    guide.style.zIndex = '9998';
    guide.style.backgroundColor = '#6366f1';
    guide.style.pointerEvents = 'none';

    if (type === 'vertical') {
      guide.style.left = `${position}px`;
      guide.style.top = '0';
      guide.style.width = '1px';
      guide.style.height = '100vh';
    } else {
      guide.style.left = '0';
      guide.style.top = `${position}px`;
      guide.style.width = '100vw';
      guide.style.height = '1px';
    }

    document.body.appendChild(guide);
    this.guides.push(guide);
  }

  clearGuides(): void {
    this.guides.forEach((guide) => guide.remove());
    this.guides = [];
  }

  snapToGuides(position: { x: number; y: number }, size: { width: number; height: number }): { x: number; y: number } {
    // Implementation for snapping logic
    return position;
  }
}
```

#### Tarea 1.3: Keyboard Shortcuts

**Archivo**: `visual-editor.service.ts`

```typescript
private setupKeyboardShortcuts(): void {
  if (!isPlatformBrowser(this.platformId)) return;

  fromEvent<KeyboardEvent>(document, 'keydown')
    .pipe(takeUntil(this.destroy$))
    .subscribe(e => {
      if (!this.isEditMode || !this.activeElement) return;

      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        this.deleteSelectedElement();
      }

      // Escape - deselect
      if (e.key === 'Escape') {
        this.deselectElement();
      }

      // Arrow keys - nudge
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        this.nudgeElement(e.key, step);
      }

      // Ctrl+Z - Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      }

      // Ctrl+Shift+Z - Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        this.redo();
      }

      // Ctrl+D - Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        this.duplicateElement();
      }
    });
}

private nudgeElement(direction: string, step: number): void {
  if (!this.activeElement) return;

  const rect = this.activeElement.getBoundingClientRect();
  let newX = rect.left;
  let newY = rect.top;

  switch (direction) {
    case 'ArrowUp': newY -= step; break;
    case 'ArrowDown': newY += step; break;
    case 'ArrowLeft': newX -= step; break;
    case 'ArrowRight': newX += step; break;
  }

  // Apply position and emit event
  this.elementMoved$.next({
    element: this.activeElement,
    bounds: { x: newX, y: newY, width: rect.width, height: rect.height }
  });
}
```

### 🟡 IMPORTANTE - Semana 1 (Días 4-5)

#### Tarea 2.1: Marquee Selection (Selección por Área)

```typescript
private setupMarqueeSelection(): void {
  let marquee: HTMLElement | null = null;
  let startX = 0, startY = 0;

  const onMouseDown = (e: MouseEvent) => {
    if (!e.shiftKey) return; // Only with Shift key
    if (e.target !== document.body) return; // Only on empty space

    startX = e.clientX;
    startY = e.clientY;

    marquee = this.renderer.createElement('div');
    this.renderer.addClass(marquee, 'marquee-selection');
    this.renderer.setStyle(marquee, 'position', 'fixed');
    this.renderer.setStyle(marquee, 'border', '2px dashed #6366f1');
    this.renderer.setStyle(marquee, 'background', 'rgba(99, 102, 241, 0.1)');
    this.renderer.setStyle(marquee, 'left', `${startX}px`);
    this.renderer.setStyle(marquee, 'top', `${startY}px`);
    this.renderer.setStyle(marquee, 'z-index', '10001');
    this.renderer.appendChild(document.body, marquee);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!marquee) return;

    const width = Math.abs(e.clientX - startX);
    const height = Math.abs(e.clientY - startY);
    const left = Math.min(e.clientX, startX);
    const top = Math.min(e.clientY, startY);

    this.renderer.setStyle(marquee, 'left', `${left}px`);
    this.renderer.setStyle(marquee, 'top', `${top}px`);
    this.renderer.setStyle(marquee, 'width', `${width}px`);
    this.renderer.setStyle(marquee, 'height', `${height}px`);
  };

  const onMouseUp = () => {
    if (!marquee) return;

    const marqueeRect = marquee.getBoundingClientRect();
    const selectedElements: HTMLElement[] = [];

    this.registeredElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (this.rectsIntersect(marqueeRect, rect)) {
        selectedElements.push(el);
      }
    });

    if (selectedElements.length > 0) {
      this.selectMultiple(selectedElements);
    }

    marquee.remove();
    marquee = null;
  };

  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

private rectsIntersect(r1: DOMRect, r2: DOMRect): boolean {
  return !(r1.right < r2.left ||
           r1.left > r2.right ||
           r1.bottom < r2.top ||
           r1.top > r2.bottom);
}
```

#### Tarea 2.2: Integración con UndoRedoService

```typescript
import { UndoRedoService } from '../../services/undo-redo.service';

constructor(
  private undoRedoService: UndoRedoService,
  // ... otros
) {}

private saveState(description: string): void {
  const state = {
    elementId: this.activeElement?.id,
    position: this.getElementPosition(this.activeElement),
    size: this.getElementSize(this.activeElement)
  };
  this.undoRedoService.pushState(state, description);
}

undo(): void {
  const state = this.undoRedoService.undo();
  if (state) {
    this.restoreElementState(state.data);
  }
}

redo(): void {
  const state = this.undoRedoService.redo();
  if (state) {
    this.restoreElementState(state.data);
  }
}
```

### 🟢 MEJORAS - Semana 2

#### Tarea 3.1: Snap to Grid

```typescript
private snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

// En onMouseMove del drag:
if (config.grid && config.grid > 1) {
  newX = this.snapToGrid(newX, config.grid);
  newY = this.snapToGrid(newY, config.grid);
}
```

#### Tarea 3.2: Zoom del Canvas

```typescript
private canvasZoom = 1;

setZoom(zoom: number): void {
  this.canvasZoom = Math.max(0.1, Math.min(3, zoom));
  const canvas = document.querySelector('.builder-shell');
  if (canvas) {
    this.renderer.setStyle(canvas, 'transform', `scale(${this.canvasZoom})`);
    this.renderer.setStyle(canvas, 'transform-origin', 'top left');
  }
}

zoomIn(): void { this.setZoom(this.canvasZoom + 0.1); }
zoomOut(): void { this.setZoom(this.canvasZoom - 0.1); }
zoomReset(): void { this.setZoom(1); }
```

#### Tarea 3.3: Rulers y Medidas

```typescript
private showRulers(): void {
  // Crear reglas horizontal y vertical
  // Mostrar medidas en tiempo real durante drag/resize
}
```

## 📋 Checklist de Implementación

### Semana 1

- [ ] Día 1: Implementar resize completo con todos los handles
- [ ] Día 2: Crear sistema de guías de alineación
- [ ] Día 3: Implementar keyboard shortcuts básicos
- [ ] Día 4: Agregar marquee selection
- [ ] Día 5: Integrar undo/redo con todas las operaciones

### Semana 2

- [ ] Día 6: Snap to grid funcional
- [ ] Día 7: Zoom del canvas
- [ ] Día 8: Rulers y medidas
- [ ] Día 9: Testing y pulido
- [ ] Día 10: Documentación

## 🎯 Métricas de Éxito

1. **Resize**: Todos los handles funcionan suavemente
2. **Drag**: Sin saltos, con guías de alineación
3. **Selección**: Multi-selección visual clara
4. **Keyboard**: Todos los shortcuts funcionan
5. **Undo/Redo**: Historial completo de acciones
6. **Performance**: 60 FPS durante operaciones

## 🚀 Próximo Paso

**COMENZAR CON**: Tarea 1.1 - Implementar Resize Completo

Esta es la funcionalidad más crítica que falta y tendrá el mayor impacto en la experiencia de usuario.

---

_Plan creado por Antigravity AI - 2026-01-25_
