# 🎯 Plan: Resizable Slots + Cleanup Legacy Wrappers

## 📋 Resumen

Hacer los slots del layout-section **resizables mediante drag handles** y eliminar las secciones wrapper legacy que son "una mierda".

---

## 🔍 Análisis de la Arquitectura Actual

### Layout Section Actual (`EditorLayoutSectionComponent`)
```
Grid Container
├── Slot 1 (50% width)
│   └── Component
├── Slot 2 (50% width)
│   └── Component
└── Slots con CSS Grid fijo (no redimensionables)
```

### Problema:
- Los slots tienen ancho fijo definido por CSS Grid
- No hay forma de redimensionar individualmente
- Necesita handles de resize en cada slot

---

## 🎯 Objetivos del Sistema de Resize

### 1. Drag Handles en Cada Slot
```
┌─────────────────────────────────────────────┐
│  Slot 1                                    │
│  ┌─────────────────────────────────────┐  │
│  │  📦 Componente                      │  │
│  │                                    │  │
│  │                                    │  │
│  │                                    │  │
│  └─────────────────────────────────────┘  │
│          ↔ ← Handle de resize           │
└─────────────────────────────────────────────┘
```

### 2. Tipos de Resize Soportados
- **Horizontal**: Adjust width de slots adyacentes
- **Vertical**: Adjust height del slot
- **Both**: Width y height libres
- **Snap**: Grid snapping (16px, 32px, 64px)

### 3. Comportamiento con Grid
- **Auto-distribución**: Si un slot crece, sus vecinos shrinked
- **Fixed total**: Ancho total del container permanece constante
- **Flexible**: Total width puede expandirse

---

## 📁 Archivos a Modificar/Crear

### Nuevos Archivos
```
libs/features/editor/feature-editor/src/lib/pages/editor/components/
├── layout-section/
│   ├── resize-handle.directive.ts       # Directive para handles
│   ├── slot-resize.service.ts           # Servicio de lógica de resize
│   └── resizable-slot.component.ts      # Wrapper para slots resizables
```

### Archivos a Modificar
```
libs/features/editor/feature-editor/src/lib/pages/editor/components/
├── layout-section/
│   ├── editor-layout-section.component.ts  # Agregar lógica de resize
│   └── layout-section.interfaces.ts       # Agregar resize config
```

### Archivos a Eliminar (Legacy Wrappers)
```
libs/shared-components/src/lib/shared-components/variant-selector/
└── component-explorer.component.ts        # 🗑️ ELIMINAR

libs/features/editor/feature-editor/src/lib/pages/editor/components/
├── button/                               # Si es wrapper legacy
├── accordion/                            # Si es wrapper legacy
├── card-animated/                        # Si es wrapper legacy
├── card-premium/                         # Si es wrapper legacy
├── chip/                                 # Si es wrapper legacy
├── draggable-box/                        # Si es wrapper legacy
├── image/                                # Si es wrapper legacy
├── list/                                 # Si es wrapper legacy
└── title/                                # Si es wrapper legacy
```

---

## 🛠️ Implementación: Slot Resize Service

```typescript
// libs/features/editor/feature-editor/src/lib/pages/editor/components/layout-section/slot-resize.service.ts
import { Injectable, signal } from '@angular/core';
import { SlotConfig, LayoutSectionConfig } from './layout-section.interfaces';

export type ResizeDirection = 'horizontal' | 'vertical' | 'both';
export type ResizeMode = 'auto-distribute' | 'fixed-total' | 'flexible';

@Injectable({ providedIn: 'root' })
export class SlotResizeService {
  // Estado del resize
  readonly activeSlotIndex = signal<number | null>(null);
  readonly isResizing = signal(false);
  readonly resizeMode: ResizeMode = 'auto-distribute';
  
  // Configuración
  readonly minSlotWidth = 100;  // px
  readonly maxSlotWidth = 800;   // px
  readonly minSlotHeight = 50;   // px
  readonly maxSlotHeight = 600;  // px
  readonly snapIncrement = 16;   // px

  // Iniciar resize
  startResize(index: number, direction: ResizeDirection): void {
    this.activeSlotIndex.set(index);
    this.isResizing.set(true);
  }

  // Durante el resize
  onResizeMove(index: number, delta: { dx: number; dy: number }): void {
    if (this.activeSlotIndex() !== index) return;
    
    // Lógica de distribución automática
    this.distributeSpace(index, delta.dx);
  }

  // Finalizar resize
  endResize(): void {
    this.activeSlotIndex.set(null);
    this.isResizing.set(false);
  }

  // Aplicar resize a un slot específico
  resizeSlot(
    config: LayoutSectionConfig,
    index: number,
    newWidth: number,
    newHeight?: number
  ): LayoutSectionConfig {
    const slots = [...config.slots];
    const slot = { ...slots[index] };

    // Actualizar estilos del slot
    slot.styles = {
      ...slot.styles,
      width: `${newWidth}px`,
      ...(newHeight ? { height: `${newHeight}px` } : {})
    };

    slots[index] = slot;

    return {
      ...config,
      slots
    };
  }

  // Distribuir espacio entre slots adyacentes
  private distributeSpace(
    changedIndex: number,
    deltaX: number
  ): void {
    // Lógica: Si slot A crece Xpx, slot B decrece Xpx
    const neighborIndex = changedIndex + 1;
    // ... implementación
  }

  // Snap a grid
  snapToGrid(value: number): number {
    return Math.round(value / this.snapIncrement) * this.snapIncrement;
  }
}
```

---

## 🖐️ Implementación: Resize Handle Directive

```typescript
// libs/features/editor/feature-editor/src/lib/pages/editor/components/layout-section/resize-handle.directive.ts
import { Directive, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { SlotResizeService } from './slot-resize.service';

@Directive({
  selector: '[appResizeHandle]',
  standalone: true
})
export class ResizeHandleDirective {
  @Input() slotIndex: number = 0;
  @Input() direction: 'horizontal' | 'vertical' | 'both' = 'horizontal';
  
  @Output() resized = new EventEmitter<{ width: number; height: number }>();

  private startX = 0;
  private startY = 0;
  private startWidth = 0;
  private startHeight = 0;

  constructor(
    private element: ElementRef,
    private resizeService: SlotResizeService
  ) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.startX = event.clientX;
    this.startY = event.clientY;
    
    const parent = this.element.nativeElement.parentElement;
    const styles = window.getComputedStyle(parent);
    this.startWidth = parseInt(styles.width, 10);
    this.startHeight = parseInt(styles.height, 10);

    this.resizeService.startResize(this.slotIndex, this.direction);

    // Add global listeners
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  private onMouseMove = (event: MouseEvent): void => {
    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;

    const newWidth = this.startWidth + dx;
    const newHeight = this.startHeight + dy;

    // Snap to grid
    const snappedWidth = this.resizeService.snapToGrid(newWidth);
    const snappedHeight = this.resizeService.snapToGrid(newHeight);

    this.resized.emit({ width: snappedWidth, height: snappedHeight });
  };

  private onMouseUp = (): void => {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    this.resizeService.endResize();
  };
}
```

---

## 🎨 Template Modificado

```typescript
// En editor-layout-section.component.ts - template
template: `
  <div class="grid-container"
       [style.gridTemplateColumns]="getGridTemplate()"
       [style.gap.px]="config.gap">
    
    <!-- Slots with resize handles -->
    <div *ngFor="let slot of config.slots; let i = index"
         class="slot resizable"
         [class.empty]="slot.componentType === 'empty'"
         [class.selected]="selectedSlotIndex === i"
         [class.resizing]="resizeService.activeSlotIndex() === i"
         [style.width.px]="getSlotWidth(i)"
         [style.height.px]="getSlotHeight(i)">
      
      <!-- Slot content -->
      <ng-container [ngSwitch]="slot.componentType">
        <!-- ... componentes existentes ... -->
      </ng-container>

      <!-- Resize Handle (only in edit mode) -->
      <div *ngIf="isEditing && slot.componentType !== 'empty'"
           class="resize-handle"
           [attr.data-direction]="'horizontal'"
           appResizeHandle
           [slotIndex]="i"
           (resized)="onSlotResized(i, $event)">
        <span class="handle-icon">⤢</span>
      </div>
    </div>
  </div>
`,
styles: [`
  .slot.resizable {
    position: relative;
    overflow: hidden;
  }

  .resize-handle {
    position: absolute;
    right: -8px;
    top: 0;
    bottom: 0;
    width: 16px;
    background: rgba(99, 102, 241, 0.2);
    cursor: ew-resize;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
    z-index: 10;
  }

  .slot:hover .resize-handle,
  .slot.resizing .resize-handle {
    opacity: 1;
  }

  .handle-icon {
    color: rgba(99, 102, 241, 0.8);
    font-size: 12px;
  }
`]
```

---

## 📋 Plan de Implementación (Semanas)

### Semana 1: Core Resize System
- [ ] Crear `SlotResizeService`
- [ ] Crear `ResizeHandleDirective`
- [ ] Modificar `LayoutSectionConfig` para almacenar widths/heights
- [ ] Integrar resize handles en template

### Semana 2: UX Improvements
- [ ] Snap to grid (16px, 32px, 64px)
- [ ] Visual feedback durante resize
- [ ] Limites mínimos/máximos
- [ ] Auto-distribución de espacio

### Semana 3: Legacy Cleanup
- [ ] Auditar componentes wrapper existentes
- [ ] Migrar funcionalidad necesaria al nuevo sistema
- [ ] Eliminar `component-explorer.component.ts`
- [ ] Eliminar wrappers redundantes en `/components/`

---

## 🗑️ Archivos Legacy a Eliminar

### Prioridad ALTA (sin uso o deprecated)
```
libs/shared-components/src/lib/shared-components/variant-selector/
└── component-explorer.component.ts          # NO SE USA - Eliminar
```

### Prioridad MEDIA (revisar funcionalidad)
```
libs/features/editor/feature-editor/src/lib/pages/editor/components/
├── button/editor-button-isolated-mode.component.ts      # ¿Es necesario?
├── accordion/editor-accordion-isolated-mode.component.ts # ¿Es necesario?
├── card-animated/editor-card-animated-isolated-mode.component.ts
├── card-premium/editor-card-premium-isolated-mode.component.ts
├── chip/editor-chip-isolated-mode.component.ts
├── draggable-box/editor-draggable-box-isolated-mode.component.ts
├── image/editor-image-isolated-mode.component.ts
├── list/editor-list-isolated-mode.component.ts
└── title/editor-title-isolated-mode.component.ts
```

**Nota:** Estos archivos parecen ser isolated modes que YA están integrados en `EditorLayoutSectionComponent`. Revisar si se usan en otros lugares antes de eliminar.

---

## ✅ Checklist de Cleanup

- [ ] Verificar que `component-explorer.component.ts` no está importado en ningún lugar
- [ ] Verificar que isolated mode components no tienen otras dependencias
- [ ] Ejecutar `nx test` después de eliminar archivos
- [ ] Verificar que el build pasa
- [ ] Documentar cambios en CHANGELOG

---

## 🔗 Referencias

- **Resize Handles**: CSS `resize` property, o librerías como `angular-resizable-element`
- **Grid Snap**: `Math.round(value / gridSize) * gridSize`
- **Drag Events**: Angular `HostListener` para mouse events

---

**Creado:** 2026-02-08  
**Estado:** Listo para implementar
