// Slot Resize Service
// Servicio para manejar el redimensionado de slots en el layout

import { Injectable, signal, computed } from '@angular/core';
import { SlotConfig, LayoutSectionConfig, LayoutType } from './layout-section.interfaces';

export type ResizeDirection = 'horizontal' | 'vertical' | 'both';
export type ResizeMode = 'auto-distribute' | 'fixed-total' | 'flexible';

// Re-export ResizeEvent from directive to avoid circular dependencies
export { ResizeEvent } from './resize-handle.directive';

@Injectable({ providedIn: 'root' })
export class SlotResizeService {
  // ========== STATE ==========
  
  // Slot activo siendo redimensionado
  readonly activeSlotIndex = signal<number | null>(null);
  
  // Si está en proceso de resize
  readonly isResizing = signal(false);
  
  // Dirección del resize
  readonly resizeDirection = signal<ResizeDirection>('horizontal');
  
  // Slot widths/heights personalizados (cuando no son auto)
  readonly customSizes = signal<Map<number, { width: number; height: number }>>(new Map());
  
  // Modo de distribución de espacio
  readonly resizeMode: ResizeMode = 'auto-distribute';

  // ========== CONFIGURATION ==========

  readonly minSlotWidth = 80;    // px mínimo
  readonly maxSlotWidth = 1200;  // px máximo
  readonly minSlotHeight = 40;   // px mínimo
  readonly maxSlotHeight = 800;  // px máximo
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
  startResize(index: number, direction: ResizeDirection = 'horizontal'): void {
    this.activeSlotIndex.set(index);
    this.resizeDirection.set(direction);
    this.isResizing.set(true);
    
    // Inicializar tamaño si no existe
    const sizes = this.customSizes();
    if (!sizes.has(index)) {
      sizes.set(index, { width: 0, height: 0 });
      this.customSizes.set(new Map(sizes));
    }
  }

  /**
   * Durante el movimiento del mouse
   */
  onResizeMove(index: number, delta: { dx: number; dy: number }): void {
    if (this.activeSlotIndex() !== index) return;

    const currentSize = this.customSizes().get(index) || { width: 0, height: 0 };
    let newWidth = currentSize.width;
    let newHeight = currentSize.height;

    // Aplicar delta según dirección
    if (this.resizeDirection() === 'horizontal' || this.resizeDirection() === 'both') {
      newWidth += delta.dx;
    }
    if (this.resizeDirection() === 'vertical' || this.resizeDirection() === 'both') {
      newHeight += delta.dy;
    }

    // Snap to grid
    newWidth = this.snapToGrid(newWidth);
    newHeight = this.snapToGrid(newHeight);

    // Aplicar límites
    newWidth = this.clampWidth(newWidth);
    newHeight = this.clampHeight(newHeight);

    // Actualizar store
    const sizes = this.customSizes();
    sizes.set(index, { width: newWidth, height: newHeight });
    this.customSizes.set(new Map(sizes));
  }

  /**
   * Finalizar el resize
   */
  endResize(): void {
    this.activeSlotIndex.set(null);
    this.isResizing.set(false);
    this.resizeDirection.set('horizontal');
  }

  /**
   * Cancelar resize sin guardar
   */
  cancelResize(): void {
    // Revertir cambios temporales
    const sizes = this.customSizes();
    const index = this.activeSlotIndex();
    if (index !== null) {
      // Restaurar al tamaño original antes del resize
      // Por ahora solo limpiamos el estado
    }
    this.endResize();
  }

  /**
   * Resetear todos los tamaños personalizados
   */
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
    return 'auto'; // Usar distribución automática de CSS Grid
  }

  /**
   * Obtener el height efectivo de un slot
   */
  getEffectiveHeight(config: LayoutSectionConfig, index: number): string {
    const customSize = this.customSizes().get(index);
    if (customSize && customSize.height > 0) {
      return `${customSize.height}px`;
    }
    return 'auto';
  }

  /**
   * Aplicar resize a un slot específico
   */
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

    // Marcar como no-auto para CSS Grid
    slot.styles['--custom-width'] = `${newWidth}px`;

    slots[index] = slot;

    // Actualizar custom sizes
    const sizes = this.customSizes();
    sizes.set(index, { width: newWidth, height: newHeight || 0 });
    this.customSizes.set(new Map(sizes));

    return {
      ...config,
      slots
    };
  }

  /**
   * Calcular distribución automática de anchos
   */
  calculateAutoDistribution(
    config: LayoutSectionConfig,
    changedIndex: number,
    newWidth: number
  ): LayoutSectionConfig {
    const slots = [...config.slots];
    const currentWidth = this.getCurrentSlotWidth(config, changedIndex);
    const delta = newWidth - currentWidth;

    if (Math.abs(delta) < 1) return config; // Sin cambio significativo

    // Encontrar vecino para ajustar
    const neighborIndex = this.findNeighborIndex(config.layoutType, changedIndex);
    if (neighborIndex === -1) return config; // No hay vecino

    const neighborWidth = this.getCurrentSlotWidth(config, neighborIndex);
    const newNeighborWidth = neighborWidth - delta;

    // Verificar límites del vecino
    if (newNeighborWidth < this.minSlotWidth) {
      // No permitir que el vecino sea muy pequeño
      return config;
    }

    // Aplicar nuevo ancho al vecino
    slots[neighborIndex] = {
      ...slots[neighborIndex],
      styles: {
        ...slots[neighborIndex].styles,
        width: `${newNeighborWidth}px`,
        '--custom-width': `${newNeighborWidth}px`
      }
    };

    return {
      ...config,
      slots
    };
  }

  /**
   * Obtener el template de grid personalizado
   */
  getCustomGridTemplate(config: LayoutSectionConfig): string {
    const customSizes = this.customSizes();
    const parts: string[] = [];

    for (let i = 0; i < config.slots.length; i++) {
      const size = customSizes.get(i);
      if (size && size.width > 0) {
        parts.push(`${size.width}px`);
      } else {
        // Usar distribución automática basada en layout type
        const autoTemplate = this.getDefaultGridTemplate(config.layoutType);
        const partsAuto = autoTemplate.split(' ');
        parts.push(partsAuto[i] || '1fr');
      }
    }

    return parts.join(' ');
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
    
    // Limpiar estilos de tamaño
    const slot = { ...slots[index] };
    delete slot.styles?.['width'];
    delete slot.styles?.['height'];
    delete slot.styles?.['--custom-width'];
    slots[index] = slot;

    // Limpiar del store
    const sizes = this.customSizes();
    sizes.delete(index);
    this.customSizes.set(new Map(sizes));

    return {
      ...config,
      slots
    };
  }

  // ========== PRIVATE HELPERS ==========

  /**
   * Snap a grid
   */
  private snapToGrid(value: number): number {
    return Math.round(value / this.snapIncrement) * this.snapIncrement;
  }

  /**
   * Clamp width a límites
   */
  private clampWidth(value: number): number {
    return Math.max(this.minSlotWidth, Math.min(this.maxSlotWidth, value));
  }

  /**
   * Clamp height a límites
   */
  private clampHeight(value: number): number {
    return Math.max(this.minSlotHeight, Math.min(this.maxSlotHeight, value));
  }

  /**
   * Obtener width actual de un slot
   */
  private getCurrentSlotWidth(config: LayoutSectionConfig, index: number): number {
    const slot = config.slots[index];
    if (slot?.styles?.['width']) {
      return parseInt(slot.styles['width'], 10);
    }
    // Calcular basado en distribución del layout
    return this.estimateSlotWidth(config, index);
  }

  /**
   * Estimar width basado en layout type
   */
  private estimateSlotWidth(config: LayoutSectionConfig, index: number): number {
    const totalSlots = config.slots.length;
    const baseWidth = 400; // Estimación base

    // Ajustar según tipo de layout
    switch (config.layoutType) {
      case 'two-columns':
      case 'two-columns-left':
      case 'two-columns-right':
      case 'sidebar-left':
      case 'sidebar-right':
        return index === 0 ? baseWidth : baseWidth * 0.5;
      case 'three-columns':
        return baseWidth * 0.33;
      case 'grid-2x2':
      case 'grid-3x2':
      case 'grid-3x3':
        return baseWidth * 0.5;
      case 'single':
      case 'hero-banner':
      default:
        return baseWidth;
    }
  }

  /**
   * Encontrar índice del vecino para ajustar
   */
  private findNeighborIndex(layoutType: LayoutType, changedIndex: number): number {
    const totalSlots = this.getSlotCountForLayout(layoutType);
    
    // Vecino a la derecha
    if (changedIndex < totalSlots - 1) {
      return changedIndex + 1;
    }
    
    // Vecino a la izquierda (si es el último)
    if (changedIndex > 0) {
      return changedIndex - 1;
    }
    
    return -1;
  }

  /**
   * Obtener número de slots para un layout type
   */
  private getSlotCountForLayout(layoutType: LayoutType): number {
    const counts: Record<LayoutType, number> = {
      'single': 1,
      'two-columns': 2,
      'two-columns-left': 2,
      'two-columns-right': 2,
      'three-columns': 3,
      'grid-2x2': 4,
      'grid-3x2': 6,
      'grid-3x3': 9,
      'sidebar-left': 2,
      'sidebar-right': 2,
      'hero-banner': 2,
      'masonry': 3 // Variable, usar 3 como default
    };
    return counts[layoutType] || 2;
  }

  /**
   * Obtener template de grid default para un layout type
   */
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
