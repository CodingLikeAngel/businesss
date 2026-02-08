// Slot Resize Service
// Servicio para manejar el redimensionado de slots en el layout

import { Injectable, signal, computed } from '@angular/core';
import { SlotConfig, LayoutSectionConfig, LayoutType } from './layout-section.interfaces';

export type ResizeDirection = 'horizontal' | 'vertical' | 'both' | 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se';
export type ResizeMode = 'auto-distribute' | 'fixed-total' | 'flexible';

@Injectable({ providedIn: 'root' })
export class SlotResizeService {
  // ========== STATE ==========
  
  // Slot activo siendo redimensionado
  readonly activeSlotIndex = signal<number | null>(null);
  
  // Tamaño inicial capturado al empezar el resize
  private startSize = { width: 0, height: 0 };
  
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
  startResize(index: number, direction: ResizeDirection = 'e', currentSize?: { width: number, height: number }, currentPos?: { left: number, top: number }): void {
    this.activeSlotIndex.set(index);
    this.resizeDirection.set(direction);
    this.isResizing.set(true);

    // Capturar tamaño inicial
    if (currentSize) {
      this.startSize = { ...currentSize };
    } else {
      const existing = this.customSizes().get(index);
      this.startSize = existing ? { ...existing } : { width: 400, height: 300 };
    }

    // Capturar posición inicial
    this.startPosition = currentPos || { left: 0, top: 0 };
    
    // Inicializar tamaño en los signals si no existe
    const sizes = this.customSizes();
    if (!sizes.has(index)) {
      sizes.set(index, { ...this.startSize, ...this.startPosition });
      this.customSizes.set(new Map(sizes));
    }
  }

  onResizeMove(index: number, delta: { dx: number; dy: number }, anchor?: ResizeDirection): void {
    if (this.activeSlotIndex() !== index) return;

    const currentAnchor = anchor || this.resizeDirection();
    let newWidth = this.startSize.width;
    let newHeight = this.startSize.height;
    let deltaLeft = 0;
    let deltaTop = 0;

    // Lógica avanzada de 8 puntos
    switch (currentAnchor) {
      case 'e':
        newWidth += delta.dx;
        break;
      case 'w':
        newWidth -= delta.dx;
        deltaLeft = delta.dx;
        break;
      case 's':
        newHeight += delta.dy;
        break;
      case 'n':
        newHeight -= delta.dy;
        deltaTop = delta.dy;
        break;
      case 'se':
        newWidth += delta.dx;
        newHeight += delta.dy;
        break;
      case 'sw':
        newWidth -= delta.dx;
        newHeight += delta.dy;
        deltaLeft = delta.dx;
        break;
      case 'ne':
        newWidth += delta.dx;
        newHeight -= delta.dy;
        deltaTop = delta.dy;
        break;
      case 'nw':
        newWidth -= delta.dx;
        newHeight -= delta.dy;
        deltaLeft = delta.dx;
        deltaTop = delta.dy;
        break;
      case 'horizontal':
        newWidth += delta.dx;
        break;
      case 'vertical':
        newHeight += delta.dy;
        break;
      case 'both':
        newWidth += delta.dx;
        newHeight += delta.dy;
        break;
    }

    // Snap to grid
    newWidth = this.snapToGrid(newWidth);
    newHeight = this.snapToGrid(newHeight);

    // Aplicar límites
    newWidth = this.clampWidth(newWidth);
    newHeight = this.clampHeight(newHeight);

    // --- Lógica de Colisión / Evitar Colapso ---
    const collidingSlotIndex = this.checkCollisions(index, {
      width: newWidth,
      height: newHeight,
      left: this.startPosition.left + deltaLeft,
      top: this.startPosition.top + deltaTop
    });

    if (collidingSlotIndex !== -1) {
      // Si hay colisión, bloqueamos el avance en esa dirección o ajustamos
      // Por ahora, aplicamos un "soft clamp": si detectamos colisión, revertimos al último estado válido
      // o limitamos el crecimiento.
      
      // Intentamos un ajuste fino: reducimos el delta hasta que no colisione (simplificado)
      if (Math.abs(delta.dx) > Math.abs(delta.dy)) {
        newWidth = this.startSize.width; // Bloquear horizontal
      } else {
        newHeight = this.startSize.height; // Bloquear vertical
      }
    }

    // Actualizar store (Incluyendo posición si es necesario)
    const sizes = this.customSizes();
    sizes.set(index, { 
      width: newWidth, 
      height: newHeight, 
      left: this.startPosition.left + deltaLeft,
      top: this.startPosition.top + deltaTop
    });
    this.customSizes.set(new Map(sizes));
  }

  /**
   * Verifica si el slot actual colisiona con otros slots
   */
  private checkCollisions(currentIndex: number, rect: { width: number, height: number, left: number, top: number }): number {
    const allSizes = this.customSizes();
    
    for (const [index, otherRect] of allSizes.entries()) {
      if (index === currentIndex) continue;

      // AABB Collision detection
      const buffer = 4; // Pequeño margen de seguridad
      const collides = (
        rect.left < (otherRect.left || 0) + otherRect.width - buffer &&
        rect.left + rect.width > (otherRect.left || 0) + buffer &&
        rect.top < (otherRect.top || 0) + otherRect.height - buffer &&
        rect.top + rect.height > (otherRect.top || 0) + buffer
      );

      if (collides) return index;
    }
    
    return -1;
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

    // Actualizar estilos de layout del slot (contenedor padre)
    slot.layoutStyles = {
      ...slot.layoutStyles,
      width: newWidth,
      ...(newHeight ? { height: newHeight } : {}),
      ...(config.slots[index].layoutStyles?.['left'] !== undefined || newWidth !== this.startSize.width ? { 
          left: (slot.layoutStyles?.['left'] || 0) + (newWidth - this.startSize.width) 
      } : {})
    };

    // Si el service tiene posición calculada, usarla
    const custom = this.customSizes().get(index);
    if (custom && custom.left !== undefined) {
      slot.layoutStyles['left'] = custom.left;
      slot.layoutStyles['top'] = custom.top;
      slot.layoutStyles['position'] = 'absolute';
    }

    // Mantener compatibilidad con estilos directos si el componente los usa
    slot.styles = {
      ...slot.styles,
      '--custom-width': `${newWidth}px`
    };

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

    // Aplicar nuevo ancho al vecino en layoutStyles
    slots[neighborIndex] = {
      ...slots[neighborIndex],
      layoutStyles: {
        ...slots[neighborIndex].layoutStyles,
        width: newNeighborWidth
      },
      styles: {
        ...slots[neighborIndex].styles,
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
