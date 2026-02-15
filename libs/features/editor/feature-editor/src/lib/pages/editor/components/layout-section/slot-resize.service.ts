// Slot Resize Service
// Servicio para manejar el redimensionado de slots en el layout

import { Injectable, signal, computed } from '@angular/core';
import { SlotConfig, LayoutSectionConfig, LayoutType, LAYOUT_DEFINITIONS, getColumnCount } from './layout-section.interfaces';
import { ResizeAnchor } from './resize-handle.directive';

export type ResizeDirection = 'horizontal' | 'vertical' | 'both' | 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se' | 'move';
export type ResizeMode = 'auto-distribute' | 'fixed-total' | 'flexible';

// Re-export ResizeAnchor from resize-handle.directive to avoid duplicate
export { ResizeAnchor } from './resize-handle.directive';

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

    // Apply Position (only for non-strict grids)
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
    const isStrict = this.isStrictGrid(config.layoutType);

    config.slots.forEach((slot, i) => {
      const w = slot.layoutStyles?.['width'];
      const h = slot.layoutStyles?.['height'];
      const l = slot.layoutStyles?.['left'];
      const t = slot.layoutStyles?.['top'];
      
      // In strict grid mode, don't sync width - let grid-template-columns control it
      if (isStrict) {
        // Only sync height and position info for flow components
        const parsedH = h ? parseInt(h) : 0;
        if (parsedH > 0 || l || t) {
          sizes.set(i, {
            width: 0, // No width in strict grid
            height: isNaN(parsedH) ? 0 : parsedH,
            left: undefined,
            top: undefined
          });
        }
        return; // Skip width syncing for strict grids
      }
      
      // For non-strict layouts, sync everything
      if (w || h || l || t) {
        let parsedW = w ? parseInt(w) : 0;
        const parsedH = h ? parseInt(h) : 0;
        
        // Anti-collapse filter: If width is huge, skip it
        if (parsedW > 800) {
            parsedW = 0; 
        }

        if (parsedW > 0 || parsedH > 0 || l || t) {
            sizes.set(i, {
                width: parsedW,
                height: isNaN(parsedH) ? 0 : parsedH,
                left: l ? parseInt(l) : undefined,
                top: t ? parseInt(t) : undefined
            });
        }
      }
    });
    this.customSizes.set(sizes);
  }

  /**
   * Get the grid template for a specific row.
   * For single-row layouts (two-columns, three-columns, etc.) rowIndex is always 0.
   * For multi-row grids (grid-2x2, grid-3x2, grid-3x3) each row is independent.
   */
  getCustomGridTemplateForRow(config: LayoutSectionConfig, rowIndex: number = 0): string {
    const layoutType = config.layoutType;
    const def = LAYOUT_DEFINITIONS.find(l => l.type === layoutType);
    if (!def) return '1fr';

    const colCount = getColumnCount(layoutType);
    const rowStartIdx = rowIndex * colCount;
    const customSizesMap = this.customSizes();
    const isActivelyResizing = this.isResizing();

    // Helper: get width from customSizes for a global slot index
    const getW = (globalIdx: number): number | undefined => {
      const custom = customSizesMap.get(globalIdx)?.width;
      if (typeof custom === 'number' && custom > 0 && custom < 2500) {
        return custom;
      }
      return undefined;
    };

    // During active resize, build template dynamically from this row's customSizes
    if (isActivelyResizing) {
      return this.buildDynamicGridTemplateForRow(def, colCount, rowStartIdx, getW);
    }

    // When NOT resizing, use persisted per-row override if available
    if (config.gridTemplateOverridePerRow && config.gridTemplateOverridePerRow[rowIndex]) {
      return config.gridTemplateOverridePerRow[rowIndex];
    }

    // Legacy fallback: single gridTemplateOverride (applies to all rows)
    if (config.gridTemplateOverride) {
      return config.gridTemplateOverride;
    }

    // Default to the template defined in the catalog
    return def.gridTemplate || '1fr';
  }

  /**
   * Legacy wrapper — kept for backward compat with single-row layouts.
   */
  getCustomGridTemplate(config: LayoutSectionConfig): string {
    return this.getCustomGridTemplateForRow(config, 0);
  }

  /**
   * Build dynamic grid template during active resize for a specific row.
   * Uses global slot indices starting at rowStartIdx.
   */
  private buildDynamicGridTemplateForRow(
    def: any,
    colCount: number,
    rowStartIdx: number,
    getW: (globalIdx: number) => number | undefined
  ): string {
    const parts: string[] = [];
    let anyCustom = false;

    for (let c = 0; c < colCount; c++) {
      const w = getW(rowStartIdx + c);
      if (w) {
        parts.push(`${w}px`);
        anyCustom = true;
      } else {
        parts.push('1fr');
      }
    }

    return anyCustom ? parts.join(' ') : (def.gridTemplate || '1fr');
  }

  /**
   * Build grid template override for a specific row.
   * Uses proportional fr units (not raw pixels) so columns adapt to container width.
   */
  buildGridTemplateOverrideForRow(layoutType: LayoutType, rowIndex: number): string | undefined {
    const colCount = getColumnCount(layoutType);
    const rowStartIdx = rowIndex * colCount;

    const sizes = this.customSizes();
    const widths: (number | undefined)[] = [];

    for (let c = 0; c < colCount; c++) {
      const s = sizes.get(rowStartIdx + c);
      widths.push((s && s.width > 0 && s.width < 2500) ? s.width : undefined);
    }

    return this.toFr(widths);
  }

  /**
   * Build ALL per-row overrides at once, returning a Record<number, string>.
   */
  buildAllRowOverrides(layoutType: LayoutType, totalSlots: number): Record<number, string> | undefined {
    const colCount = getColumnCount(layoutType);
    const rowCount = Math.ceil(totalSlots / colCount);
    const result: Record<number, string> = {};
    let anyDefined = false;

    for (let r = 0; r < rowCount; r++) {
      const override = this.buildGridTemplateOverrideForRow(layoutType, r);
      if (override) {
        result[r] = override;
        anyDefined = true;
      }
    }

    return anyDefined ? result : undefined;
  }

  /**
   * Legacy wrapper — kept for backward compat with single-row layouts.
   */
  buildGridTemplateOverride(layoutType: LayoutType): string | undefined {
    return this.buildGridTemplateOverrideForRow(layoutType, 0);
  }

  /**
   * Convert pixel widths to proportional fr values.
   */
  private toFr(widths: (number | undefined)[]): string | undefined {
    const resolvedWidths = widths.map(w => w || 0);
    const minW = Math.max(1, Math.min(...resolvedWidths.filter(w => w > 0)));
    const anyValid = resolvedWidths.some(w => w > 0);
    if (!anyValid) return undefined;

    return resolvedWidths.map(w => {
      if (w <= 0) return '1fr';
      const fr = Math.round((w / minW) * 100) / 100;
      return `${fr}fr`;
    }).join(' ');
  }

  /**
   * Helper: find the horizontal neighbor in the SAME row.
   * Uses generic column-count logic so it works for any grid layout.
   */
  private getHorizontalNeighborIndex(layoutType: LayoutType, currentIndex: number): number {
    const colCount = getColumnCount(layoutType);

    // Single-column layouts have no horizontal neighbor
    if (colCount <= 1) return -1;

    const colInRow = currentIndex % colCount;
    const rowStart = currentIndex - colInRow;

    // For 2-column layouts: neighbor is the other column
    if (colCount === 2) {
      return colInRow === 0 ? rowStart + 1 : rowStart;
    }

    // For 3+ column layouts: pick neighbor based on resize direction
    if (colInRow === 0) return currentIndex + 1;                 // leftmost → right neighbor
    if (colInRow === colCount - 1) return currentIndex - 1;      // rightmost → left neighbor
    // Middle: use resize direction hint
    return this.resizeDirection() === 'w' ? currentIndex - 1 : currentIndex + 1;
  }

  /**
   * Helper to find vertical siblings (slots in the same column) for multi-row grids
   */
  private getColumnSiblings(layoutType: LayoutType, currentIndex: number): number[] {
    const siblings: number[] = [];
    
    // Grid 2x2 (2 rows, 2 columns)
    // 0 1
    // 2 3
    if (layoutType === 'grid-2x2') {
      if (currentIndex === 0) siblings.push(2);
      if (currentIndex === 2) siblings.push(0);
      if (currentIndex === 1) siblings.push(3);
      if (currentIndex === 3) siblings.push(1);
    }

    // Grid 3x2 (2 rows, 3 columns)
    // 0 1 2
    // 3 4 5
    if (layoutType.includes('grid-3x2')) {
      const col = currentIndex % 3;
      const row = Math.floor(currentIndex / 3);
      // Determine sibling in the other row
      const otherRow = row === 0 ? 1 : 0;
      const siblingIndex = (otherRow * 3) + col;
      siblings.push(siblingIndex);
    }

    // Grid 3x3 (3 rows, 3 columns)
    // 0 1 2
    // 3 4 5
    // 6 7 8
    if (layoutType.includes('grid-3x3')) {
      const col = currentIndex % 3;
      const row = Math.floor(currentIndex / 3);
      
      // Add siblings from all other rows
      [0, 1, 2].forEach(r => {
        if (r !== row) {
          siblings.push((r * 3) + col);
        }
      });
    }

    return siblings;
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
    const isStrictGridMode = this.isStrictGrid(config.layoutType);
    
    const updateSlot = (idx: number, w: number, h?: number, l?: number, t?: number) => {
      const slot = { ...slots[idx] };
      slot.layoutStyles = {
        ...slot.layoutStyles,
        // In strict grid mode, don't persist inline width — gridTemplateOverride controls columns
        ...(isStrictGridMode ? {} : { width: `${w}px` }),
        ...(h !== undefined ? { height: `${h}px` } : {}),
        position: (!isStrictGridMode && (l !== undefined || t !== undefined)) ? 'absolute' : (slot.layoutStyles?.['position'] || 'relative')
      };

      if (isStrictGridMode) {
        delete slot.layoutStyles['left'];
        delete slot.layoutStyles['top'];
        delete slot.layoutStyles['width'];
        slot.layoutStyles['position'] = 'relative';
        if (slot.styles) slot.styles = { ...slot.styles, transform: 'none' };
      } else {
        if (l !== undefined) slot.layoutStyles['left'] = `${l}px`;
        if (t !== undefined) slot.layoutStyles['top'] = `${t}px`;
      }
      slots[idx] = slot;
    };

    updateSlot(index, newWidth, newHeight, left, top);

    // Update customSizes signal so per-row template builders see the new size
    const currentSizes = new Map(this.customSizes());
    const sizeData = { width: newWidth, height: newHeight || 0, left, top };
    currentSizes.set(index, sizeData);

    // NOTE: We do NOT sync column siblings anymore — each row is autonomous

    this.customSizes.set(currentSizes);

    // For strict grids, clean up neighbor slots in the same row (no inline width/position)
    if (isStrictGridMode) {
      const neighborIdx = this.getHorizontalNeighborIndex(config.layoutType, index);
      if (neighborIdx !== -1) {
        const neighborSlot = { ...slots[neighborIdx] };
        neighborSlot.layoutStyles = {
          ...neighborSlot.layoutStyles,
          position: 'relative'
        };
        delete neighborSlot.layoutStyles['left'];
        delete neighborSlot.layoutStyles['top'];
        delete neighborSlot.layoutStyles['width'];
        slots[neighborIdx] = neighborSlot;
      }
    }

    // Build and persist per-row grid template overrides for strict grids
    const gridTemplateOverridePerRow = isStrictGridMode
      ? this.buildAllRowOverrides(config.layoutType, config.slots.length)
      : undefined;

    // Clear legacy single override when using per-row
    return { ...config, slots, gridTemplateOverride: undefined, gridTemplateOverridePerRow };
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
    if (!layoutType) return false;
    const type = layoutType.toLowerCase();
    const strictLayouts = [
      'grid-2x2', 'grid-3x2', 'grid-3x3',
      'two-columns', 'three-columns', 
      'two-columns-left', 'two-columns-right',
      'sidebar-left', 'sidebar-right',
      'hero-banner', 'masonry'
    ];
    return strictLayouts.some(s => type === s || type.includes('columns') || type.includes('grid-'));
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
