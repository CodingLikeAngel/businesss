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

  readonly minSlotWidth = 80;    
  readonly maxSlotWidth = 1400;  
  readonly minSlotHeight = 20;   
  readonly maxSlotHeight = 1200; 
  readonly snapIncrement = 4;    

  // ========== UTILS & VALIDATION ==========

  /**
   * Clamp a value between min and max
   */
  public clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Snap a value to the grid increment
   */
  public snap(value: number): number {
    return Math.round(value / this.snapIncrement) * this.snapIncrement;
  }

  /**
   * Validate and return safe dimensions
   */
  public validateDimensions(width: number, height: number): { width: number; height: number } {
    return {
      width: this.clamp(this.snap(width), this.minSlotWidth, this.maxSlotWidth),
      height: this.clamp(this.snap(height), this.minSlotHeight, this.maxSlotHeight)
    };
  }

  /**
   * Validate and return safe position within parent boundaries
   */
  public validatePosition(left: number, top: number, parentW: number, parentH: number, itemW: number, itemH: number): { left: number; top: number } {
    return {
      left: this.clamp(this.snap(left), 0, Math.max(0, parentW - itemW)),
      top: this.clamp(this.snap(top), 0, Math.max(0, parentH - itemH))
    };
  }

  // ========== METHODS ==========

  /**
   * Iniciar el proceso de resize
   */
  startResize(index: number, direction: ResizeDirection = 'e', currentSize?: { width: number, height: number }, currentPos?: { left: number, top: number }): void {
    this.activeSlotIndex.set(index);
    this.resizeDirection.set(direction);
    this.isResizing.set(true);

    const sizes = this.customSizes();
    const existing = sizes.get(index);

    // Capture initial size with fallback to current visual rect
    this.startSize = currentSize 
      ? { ...currentSize } 
      : (existing ? { width: existing.width, height: existing.height } : { width: 400, height: 300 });

    // Capture initial position
    this.startPosition = currentPos || (existing ? { left: existing.left || 0, top: existing.top || 0 } : { left: 0, top: 0 });

    // Capture neighbor start sizes for proportional distribution
    this.neighborStartSizes.clear();
    sizes.forEach((val, idx) => {
        if (idx !== index) {
            this.neighborStartSizes.set(idx, { width: val.width, height: val.height });
        }
    });
    
    // Ensure active slot is in customSizes
    if (!existing) {
      sizes.set(index, { ...this.startSize, ...this.startPosition });
      this.customSizes.set(new Map(sizes));
    }
  }

  onResizeMove(index: number, delta: { dx: number; dy: number }, anchor?: ResizeAnchor, isStrictGrid: boolean = false, layoutType?: LayoutType): void {
    if (this.activeSlotIndex() !== index) return;

    const currentAnchor = anchor || this.resizeDirection();
    let newWidth = this.startSize.width;
    let newHeight = this.startSize.height;
    let deltaLeft = 0;
    let deltaTop = 0;

    // Advanced 8-point and move logic
    switch (currentAnchor as any) {
      case 'move':
        deltaLeft = delta.dx;
        deltaTop = delta.dy;
        break;
      case 'e':
        newWidth = this.startSize.width + delta.dx;
        break;
      case 'w':
        newWidth = this.startSize.width - delta.dx;
        if (!isStrictGrid) deltaLeft = delta.dx;
        break;
      case 's':
        newHeight = this.startSize.height + delta.dy;
        break;
      case 'n':
        newHeight = this.startSize.height - delta.dy;
        if (!isStrictGrid) deltaTop = delta.dy;
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
    }

    // Apply Snapping & Clamping (Robust)
    const validDim = this.validateDimensions(newWidth, newHeight);
    newWidth = validDim.width;
    newHeight = validDim.height;

    const sizes = new Map(this.customSizes());
    
    // --- Grid Distribution Logic ---
    if (isStrictGrid && layoutType) {
        const neighborIdx = this.getHorizontalNeighborIndex(layoutType, index);
        if (neighborIdx !== -1) {
            const neighborStart = this.neighborStartSizes.get(neighborIdx);
            if (neighborStart) {
                // If we are shrinking/growing, neighbor must compensate
                const deltaW = newWidth - this.startSize.width;
                let neighborNewWidth = neighborStart.width - deltaW;

                // Clamp neighbor and adjust current width if neighbor hits limit
                if (neighborNewWidth < this.minSlotWidth) {
                    neighborNewWidth = this.minSlotWidth;
                    newWidth = this.startSize.width + (neighborStart.width - this.minSlotWidth);
                } else if (neighborNewWidth > this.maxSlotWidth) {
                    neighborNewWidth = this.maxSlotWidth;
                    newWidth = this.startSize.width - (this.maxSlotWidth - neighborStart.width);
                }

                const neighborData = sizes.get(neighborIdx);
                if (neighborData) {
                    sizes.set(neighborIdx, { ...neighborData, width: neighborNewWidth });
                }
            }
        }
    }

    // Apply Position
    const finalLeft = isStrictGrid ? 0 : Math.max(0, this.startPosition.left + deltaLeft);
    const finalTop = isStrictGrid ? 0 : Math.max(0, this.startPosition.top + deltaTop);

    sizes.set(index, { 
      width: newWidth, 
      height: newHeight, 
      left: isStrictGrid ? undefined : this.snap(finalLeft),
      top: isStrictGrid ? undefined : this.snap(finalTop)
    });

    this.customSizes.set(sizes);
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
   * Sync custom sizes from config
   */
  syncFromConfig(config: LayoutSectionConfig): void {
    const sizes = new Map<number, { width: number; height: number; left?: number; top?: number }>();
    config.slots.forEach((slot, i) => {
      const w = slot.layoutStyles?.['width'];
      const h = slot.layoutStyles?.['height'];
      const l = slot.layoutStyles?.['left'];
      const t = slot.layoutStyles?.['top'];
      
      if (w || h || l || t) {
        const parsedW = w ? parseInt(w) : 0;
        const parsedH = h ? parseInt(h) : 0;
        
        sizes.set(i, {
          width: isNaN(parsedW) ? 0 : parsedW,
          height: isNaN(parsedH) ? 0 : parsedH,
          left: l ? parseInt(l) : undefined,
          top: t ? parseInt(t) : undefined
        });
      }
    });
    this.customSizes.set(sizes);
  }

  /**
   * Obtener el grid template personalizado basado en customSizes o en la config persistida
   */
  getCustomGridTemplate(config: LayoutSectionConfig): string {
    const customSizesMap = this.customSizes();
    const layoutType = config.layoutType;

    const getW = (idx: number): number | undefined => {
      const custom = customSizesMap.get(idx)?.width;
      if (typeof custom === 'number' && custom > 0) return custom;
      
      const saved = config.slots[idx]?.layoutStyles?.['width'];
      if (saved && typeof saved === 'string' && saved.includes('px')) {
        const p = parseInt(saved);
        return isNaN(p) ? undefined : p;
      }
      return undefined;
    };

    if (layoutType.includes('two-columns') || layoutType.includes('sidebar-left') || layoutType.includes('sidebar-right')) {
        const w0 = getW(0);
        const w1 = getW(1);
        if (w0 && w1) return `${w0}px ${w1}px`;
        if (w0) return `${w0}px 1fr`;
        if (w1) return `1fr ${w1}px`;
    }

    if (layoutType === 'three-columns') {
        const parts = [];
        for (let i = 0; i < 3; i++) {
            const w = getW(i);
            parts.push(w ? `${w}px` : '1fr');
        }
        return parts.join(' ');
    }

    if (layoutType === 'grid-2x2') {
        const w0 = getW(0) || getW(2);
        const w1 = getW(1) || getW(3);
        if (w0 && w1) return `${w0}px ${w1}px`;
        return '1fr 1fr';
    }

    if (layoutType === 'grid-3x2' || layoutType === 'grid-3x3') {
        const w0 = getW(0) || getW(3) || getW(6);
        const w1 = getW(1) || getW(4) || getW(7);
        const w2 = getW(2) || getW(5) || getW(8);
        if (w0 || w1 || w2) {
            return `${(w0 !== undefined) ? w0 + 'px' : '1fr'} ${(w1 !== undefined) ? w1 + 'px' : '1fr'} ${(w2 !== undefined) ? w2 + 'px' : '1fr'}`;
        }
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
        if (currentIndex === 1) return (this.resizeDirection() === 'w' ? 0 : 2);
        if (currentIndex === 2) return 1;
        break;
      case 'grid-2x2':
        if (currentIndex === 0) return 1;
        if (currentIndex === 1) return 0;
        if (currentIndex === 2) return 3;
        if (currentIndex === 3) return 2;
        break;
    }
    return -1;
  }

  /**
   * Aplicar resize a un slot específico y devolver nueva config
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
    const isStrictGrid = this.isStrictGrid(config.layoutType);
    
    const updateSlot = (idx: number, w: number, h?: number, l?: number, t?: number) => {
      const slot = { ...slots[idx] };
      slot.layoutStyles = {
        ...slot.layoutStyles,
        width: `${w}px`,
        ...(h !== undefined ? { height: `${h}px` } : {}),
        position: (!isStrictGrid && (l !== undefined || t !== undefined)) ? 'absolute' : (slot.layoutStyles?.['position'] || 'relative')
      };

      if (isStrictGrid) {
        delete slot.layoutStyles['left'];
        delete slot.layoutStyles['top'];
        slot.layoutStyles['position'] = 'relative';
        if (slot.styles) slot.styles = { ...slot.styles, transform: 'none' };
      } else {
        if (l !== undefined) slot.layoutStyles['left'] = `${l}px`;
        if (t !== undefined) slot.layoutStyles['top'] = `${t}px`;
      }
      slots[idx] = slot;
    };

    updateSlot(index, newWidth, newHeight, left, top);

    // If grid, also update neighbor persisted width
    if (isStrictGrid) {
      const neighborIdx = this.getHorizontalNeighborIndex(config.layoutType, index);
      if (neighborIdx !== -1) {
          const neighborSize = this.customSizes().get(neighborIdx);
          if (neighborSize) {
              updateSlot(neighborIdx, neighborSize.width);
          }
      }
    }

    return { ...config, slots };
  }

  /**
   * Actualizar manualmente el tamaño de un slot
   */
  updateSlotSize(index: number, width: number, height: number, left?: number, top?: number): void {
    const sizes = new Map(this.customSizes());
    sizes.set(index, { width, height, left, top });
    this.customSizes.set(sizes);
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
    
    if (slot.layoutStyles) {
        delete slot.layoutStyles['width'];
        delete slot.layoutStyles['height'];
        delete slot.layoutStyles['left'];
        delete slot.layoutStyles['top'];
        slot.layoutStyles['position'] = 'relative';
    }

    slots[index] = slot;
    const sizes = new Map(this.customSizes());
    sizes.delete(index);
    this.customSizes.set(sizes);

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

  calculateAutoDistribution(config: LayoutSectionConfig, idx: number, w: number): LayoutSectionConfig {
    return this.resizeSlot(config, idx, w);
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
