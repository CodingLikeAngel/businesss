// Slot Resize Service
// Servicio para manejar el redimensionado de slots en el layout

import { Injectable, signal, computed } from '@angular/core';
import { SlotConfig, LayoutSectionConfig, LayoutType } from './layout-section.interfaces';

export type ResizeDirection = 'horizontal' | 'vertical' | 'both' | 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se' | 'move';
export type ResizeAnchor = 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se' | 'move';
export type ResizeMode = 'auto-distribute' | 'fixed-total' | 'flexible';

@Injectable({ providedIn: 'root' })
export class SlotResizeService {
  // ========== STATE ==========
  
  // Slot activo siendo redimensionado
  readonly activeSlotIndex = signal<number | null>(null);
  
  // Tamaño inicial capturado al empezar el resize
  private startSize = { width: 0, height: 0 };
  
  // Tamaño inicial de los vecinos
  private neighborStartSizes = new Map<number, { width: number, height: number }>();

  // Si está en proceso de resize
  readonly isResizing = signal(false);
  
  // Dirección o ancla del resize
  readonly resizeDirection = signal<ResizeDirection>('e');
  
  // Posición inicial del slot al empezar el resize
  private startPosition = { left: 0, top: 0 };
  
  // Slot widths/heights/positions personalizados
  readonly customSizes = signal<Map<number, { width: number; height: number; left?: number; top?: number }>>(new Map());
  
  // Modo de distribución de espacio
  readonly resizeMode: ResizeMode = 'auto-distribute';

  // ========== CONFIGURATION ==========

  readonly minSlotWidth = 100;    // px mínimo
  readonly maxSlotWidth = 1200;  // px máximo
  readonly minSlotHeight = 40;   // px mínimo
  readonly maxSlotHeight = 840;  // px máximo
  readonly snapIncrement = 8;   // px para snap

  // ========== COMPUTED ==========

  readonly activeSlotSize = computed(() => {
    const index = this.activeSlotIndex();
    if (index === null) return null;
    return this.customSizes().get(index) || null;
  });

  // ========== METHODS ==========

  /**
   * Iniciar el proceso de resize
   */
  startResize(index: number, direction: ResizeDirection = 'e', currentSize?: { width: number, height: number }, currentPos?: { left: number, top: number }): void {
    this.activeSlotIndex.set(index);
    this.resizeDirection.set(direction);
    this.isResizing.set(true);

    // Capturar tamaño inicial del slot principal
    if (currentSize) {
      this.startSize = { ...currentSize };
    } else {
      const existing = this.customSizes().get(index);
      this.startSize = existing ? { ...existing } : { width: 400, height: 300 };
    }

    // Capturar tamaños iniciales de todos los slots actuales para distribución balanceada
    this.neighborStartSizes.clear();
    const sizes = this.customSizes();
    // Nota: Deberíamos tener los tamaños de todos los slots incluso si son 'auto'
    // Para simplificar, asumimos que si no están en customSizes, usaremos una estimación o el rect actual si lo pasara el componente
    
    // Capturar posición inicial
    this.startPosition = currentPos || { left: 0, top: 0 };
    
    // Inicializar tamaño en los signals si no existe
    if (!sizes.has(index)) {
      sizes.set(index, { ...this.startSize, ...this.startPosition });
      this.customSizes.set(new Map(sizes));
    }

    // Guardar estados iniciales de los vecinos actuales en customSizes
    sizes.forEach((val, idx) => {
        if (idx !== index) {
            this.neighborStartSizes.set(idx, { width: val.width, height: val.height });
        }
    });
  }

  onResizeMove(index: number, delta: { dx: number; dy: number }, anchor?: ResizeAnchor, isStrictGrid: boolean = false, layoutType?: LayoutType): void {
    if (this.activeSlotIndex() !== index) return;

    const currentAnchor = anchor || this.resizeDirection();
    let newWidth = this.startSize.width;
    let newHeight = this.startSize.height;
    let deltaLeft = 0;
    let deltaTop = 0;

    // Lógica avanzada de 8 puntos
    switch (currentAnchor as any) {
      case 'e':
        newWidth = this.startSize.width + delta.dx;
        break;
      case 'w':
        if (isStrictGrid) {
            newWidth = this.startSize.width - delta.dx;
        } else {
            newWidth = this.startSize.width - delta.dx;
            deltaLeft = delta.dx;
        }
        break;
      case 's':
        newHeight = this.startSize.height + delta.dy;
        break;
      case 'n':
        if (isStrictGrid) {
            newHeight = this.startSize.height - delta.dy;
        } else {
            newHeight = this.startSize.height - delta.dy;
            deltaTop = delta.dy;
        }
        break;
      case 'se':
        newWidth = this.startSize.width + delta.dx;
        newHeight = this.startSize.height + delta.dy;
        break;
      case 'sw':
        newWidth = this.startSize.width - delta.dx;
        newHeight = this.startSize.height + delta.dy;
        if (!isStrictGrid) deltaLeft = delta.dx;
        break;
      case 'ne':
        newWidth = this.startSize.width + delta.dx;
        newHeight = this.startSize.height - delta.dy;
        if (!isStrictGrid) deltaTop = delta.dy;
        break;
      case 'nw':
        newWidth = this.startSize.width - delta.dx;
        newHeight = this.startSize.height - delta.dy;
        if (!isStrictGrid) {
            deltaLeft = delta.dx;
            deltaTop = delta.dy;
        }
        break;
      case 'move':
        if (!isStrictGrid) {
            deltaLeft = delta.dx;
            deltaTop = delta.dy;
        }
        break;
    }

    // Snap to grid
    newWidth = this.snapToGrid(newWidth);
    newHeight = this.snapToGrid(newHeight);

    // Aplicar límites
    newWidth = this.clampWidth(newWidth);
    newHeight = this.clampHeight(newHeight);

    // --- Lógica de Distribución en Grid (Resizing uno afecta al otro) ---
    const sizes = new Map(this.customSizes());
    
    if (isStrictGrid && layoutType) {
        const neighborIdx = this.getHorizontalNeighborIndex(layoutType, index);
        if (neighborIdx !== -1) {
            const neighborStart = this.neighborStartSizes.get(neighborIdx);
            if (neighborStart) {
                // El cambio de ancho del principal es proporcional al del vecino
                // deltaW = currentNewWidth - startWidth
                const deltaW = newWidth - this.startSize.width;
                let neighborNewWidth = neighborStart.width - deltaW;

                // Si el vecino llega al límite mínimo, bloqueamos el crecimiento del actual
                if (neighborNewWidth < this.minSlotWidth) {
                    neighborNewWidth = this.minSlotWidth;
                    // Recalculamos newWidth basado en lo que el vecino pudo ceder
                    newWidth = this.startSize.width + (neighborStart.width - this.minSlotWidth);
                }

                sizes.set(neighborIdx, { 
                    ...sizes.get(neighborIdx)!, 
                    width: neighborNewWidth 
                });
            }
        }
    }

    // Actualizar principal
    let finalLeft = isStrictGrid ? 0 : Math.max(0, this.startPosition.left + deltaLeft);
    let finalTop = isStrictGrid ? 0 : Math.max(0, this.startPosition.top + deltaTop);

    sizes.set(index, { 
      width: newWidth, 
      height: newHeight, 
      left: isStrictGrid ? undefined : finalLeft,
      top: isStrictGrid ? undefined : finalTop
    });

    this.customSizes.set(sizes);
  }

  /**
   * Actualizar manualmente el tamaño de un slot
   */
  updateSlotSize(index: number, width: number, height: number, left?: number, top?: number): void {
    const sizes = this.customSizes();
    sizes.set(index, { width, height, left, top });
    this.customSizes.set(new Map(sizes));
  }

  /**
   * Finalizar el resize
   */
  endResize(): void {
    this.activeSlotIndex.set(null);
    this.isResizing.set(false);
    this.neighborStartSizes.clear();
  }

  cancelResize(): void {
    this.endResize();
  }

  resetCustomSizes(): void {
    this.customSizes.set(new Map());
  }

  /**
   * Obtener el width efectivo de un slot
   */
  getEffectiveWidth(config: LayoutSectionConfig, index: number): string {
    const customSize = this.customSizes().get(index);
    if (customSize && customSize.width > 0) {
      return `${customSize.width}px`;
    }
    return '1fr'; 
  }

  /**
   * Obtener el template de grid personalizado basado en customSizes
   */
  getCustomGridTemplate(config: LayoutSectionConfig): string {
    const customSizes = this.customSizes();
    const layoutType = config.layoutType;

    // Lógica para 2 columnas (la más común donde se pide este comportamiento)
    if (layoutType.includes('two-columns') || layoutType.includes('sidebar')) {
        const w0 = customSizes.get(0)?.width;
        const w1 = customSizes.get(1)?.width;
        if (w0 && w1) return `${w0}px ${w1}px`;
        if (w0) return `${w0}px 1fr`;
        if (w1) return `1fr ${w1}px`;
    }

    // Para grids de más columnas o complejos
    if (layoutType === 'three-columns') {
        const parts = [];
        for (let i = 0; i < 3; i++) {
            const w = customSizes.get(i)?.width;
            parts.push(w ? `${w}px` : '1fr');
        }
        return parts.join(' ');
    }

    // Para grids 2x2 etc, solemos redimensionar columnas, no todo el grid simultáneamente
    if (layoutType === 'grid-2x2') {
        const w0 = customSizes.get(0)?.width || customSizes.get(2)?.width;
        const w1 = customSizes.get(1)?.width || customSizes.get(3)?.width;
        if (w0 && w1) return `${w0}px ${w1}px`;
        return '1fr 1fr';
    }

    return this.getDefaultGridTemplate(layoutType);
  }

  /**
   * Helper para encontrar el vecino horizontal en la misma fila
   */
  private getHorizontalNeighborIndex(layoutType: LayoutType, currentIndex: number): number {
    switch (layoutType) {
      case 'two-columns':
      case 'two-columns-left':
      case 'two-columns-right':
      case 'sidebar-left':
      case 'sidebar-right':
      case 'hero-banner':
        return currentIndex === 0 ? 1 : (currentIndex === 1 ? 0 : -1);
      case 'three-columns':
        if (currentIndex === 0) return 1;
        if (currentIndex === 1) return 2;
        if (currentIndex === 2) return 1;
        break;
      case 'grid-2x2':
        // Slots 0-1 están juntos, 2-3 están juntos
        if (currentIndex === 0) return 1;
        if (currentIndex === 1) return 0;
        if (currentIndex === 2) return 3;
        if (currentIndex === 3) return 2;
        break;
    }
    return -1;
  }

  /**
   * Aplicar resize a un slot específico
   */
  resizeSlot(
    config: LayoutSectionConfig,
    index: number,
    newWidth: number,
    newHeight?: number,
    left?: number,
    top?: number
  ): LayoutSectionConfig {
    const slots = [...config.slots];
    const slot = { ...slots[index] };
    const isStrictGrid = this.isStrictGrid(config.layoutType);
    
    // Actualizar estilos de layout
    slot.layoutStyles = {
      ...slot.layoutStyles,
      width: `${newWidth}px`,
      ...(newHeight !== undefined ? { height: `${newHeight}px` } : {}),
      position: (!isStrictGrid && (left !== undefined || top !== undefined)) ? 'absolute' : (slot.layoutStyles?.['position'] || 'relative')
    };

    if (isStrictGrid) {
      delete slot.layoutStyles['left'];
      delete slot.layoutStyles['top'];
      slot.layoutStyles['position'] = 'relative';
      slot.styles = { ...slot.styles, transform: 'none' };

      // Si es un grid y hemos redimensionado un vecino, también debemos persistir el tamaño del vecino
      const neighborIdx = this.getHorizontalNeighborIndex(config.layoutType, index);
      if (neighborIdx !== -1) {
          const neighborSize = this.customSizes().get(neighborIdx);
          if (neighborSize) {
              slots[neighborIdx] = {
                  ...slots[neighborIdx],
                  layoutStyles: {
                      ...slots[neighborIdx].layoutStyles,
                      width: `${neighborSize.width}px`
                  }
              };
          }
      }
    } else {
        if (left !== undefined) slot.layoutStyles['left'] = `${left}px`;
        if (top !== undefined) slot.layoutStyles['top'] = `${top}px`;
    }

    slots[index] = slot;

    return { ...config, slots };
  }

  /**
   * Verificar si un slot tiene tamaño personalizado
   */
  hasCustomSize(index: number): boolean {
    const size = this.customSizes().get(index);
    return size !== undefined && (size.width > 0 || size.height > 0);
  }

  /**
   * Eliminar tamaño personalizado de un slot
   */
  clearSlotSize(config: LayoutSectionConfig, index: number): LayoutSectionConfig {
    const slots = [...config.slots];
    const slot = { ...slots[index] };
    
    // Limpiar estilos de layout
    if (slot.layoutStyles) {
        delete slot.layoutStyles['width'];
        delete slot.layoutStyles['height'];
        delete slot.layoutStyles['left'];
        delete slot.layoutStyles['top'];
        slot.layoutStyles['position'] = 'relative';
    }

    slots[index] = slot;

    // Limpiar del store reactivo
    const sizes = this.customSizes();
    sizes.delete(index);
    this.customSizes.set(new Map(sizes));

    return { ...config, slots };
  }

  public isStrictGrid(layoutType: LayoutType): boolean {
    const strictLayouts: LayoutType[] = [
      'grid-2x2', 'grid-3x2', 'grid-3x3',
      'two-columns', 'three-columns', 
      'two-columns-left', 'two-columns-right',
      'sidebar-left', 'sidebar-right',
      'hero-banner'
    ];
    return strictLayouts.includes(layoutType);
  }

  private snapToGrid(value: number): number {
    return Math.round(value / this.snapIncrement) * this.snapIncrement;
  }

  private clampWidth(value: number): number {
    return Math.max(this.minSlotWidth, Math.min(this.maxSlotWidth, value));
  }

  private clampHeight(value: number): number {
    return Math.max(this.minSlotHeight, Math.min(this.maxSlotHeight, value));
  }

  private getDefaultGridTemplate(layoutType: LayoutType): string {
    const templates: Record<LayoutType, string> = {
      'single': '1fr',
      'two-columns': '1fr 1fr',
      'two-columns-left': '2fr 1fr',
      'two-columns-right': '1fr 2fr',
      'three-columns': '1fr 1fr 1fr',
      'grid-2x2': '1fr 1fr',
      'grid-3x2': '1fr 1fr 1fr',
      'grid-3x3': '1fr 1fr 1fr',
      'sidebar-left': '250px 1fr',
      'sidebar-right': '1fr 250px',
      'hero-banner': '1fr',
      'masonry': '1fr 1fr 1fr'
    };
    return templates[layoutType] || '1fr';
  }
}
