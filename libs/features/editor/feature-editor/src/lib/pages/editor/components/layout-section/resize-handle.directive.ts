// Resize Handle Directive
// Directive para handles de redimensionado en slots

import { Directive, Input, Output, EventEmitter, ElementRef, HostListener, inject } from '@angular/core';
import { SlotResizeService, ResizeDirection } from './slot-resize.service';

export interface ResizeEvent {
  width: number;
  height: number;
  deltaX: number;
  deltaY: number;
}

export type ResizeAnchor = 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se' | 'move';

@Directive({
  selector: '[appResizeHandle]',
  standalone: true
})
export class ResizeHandleDirective {
  // ========== INPUTS ==========

  @Input() slotIndex: number = 0;
  @Input() direction: ResizeDirection = 'horizontal';
  @Input() anchor: ResizeAnchor = 'e'; // Punto de anclaje
  @Input() minWidth: number = 80;
  @Input() minHeight: number = 40;
  @Input() snapEnabled: boolean = true;
  @Input() snapSize: number = 8;

  // ========== OUTPUTS ==========

  @Output() resizeStart = new EventEmitter<void>();
  @Output() resizeMove = new EventEmitter<ResizeEvent>();
  @Output() resizeEnd = new EventEmitter<ResizeEvent>();
  @Output() resized = new EventEmitter<ResizeEvent>();

  // ========== INJECTION ==========

  private resizeService = inject(SlotResizeService);
  private element = inject(ElementRef);

  // ========== PRIVATE STATE ==========

  private startX = 0;
  private startY = 0;
  private startWidth = 0;
  private startHeight = 0;
  private isDragging = false;
  private cleanupFns: (() => void)[] = [];

  // ========== HOST LISTENERS ==========

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    // Solo iniciar si es botón izquierdo
    if (event.button !== 0) return;
    
    event.preventDefault();
    event.stopPropagation();

    this.startResize(event);
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length !== 1) return;
    
    event.preventDefault();
    event.stopPropagation();

    const touch = event.touches[0];
    this.startResize({
      clientX: touch.clientX,
      clientY: touch.clientY,
      button: 0,
      preventDefault: () => {},
      stopPropagation: () => {}
    } as any);
  }

  // ========== PRIVATE METHODS ==========

  private startResize(event: MouseEvent): void {
    this.isDragging = true;
    
    // Obtener dimensiones actuales
    const parent = this.getParentElement();
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startWidth = rect.width;
    this.startHeight = rect.height;

    // Iniciar servicio con el tamaño y posicion local
    this.resizeService.startResize(this.slotIndex, this.anchor, 
      { width: rect.width, height: rect.height },
      { left: parent.offsetLeft, top: parent.offsetTop }
    );

    // Emitir evento de inicio
    this.resizeStart.emit();

    // Agregar listeners globales
    this.addGlobalListeners();

    // Cambiar cursor
    this.updateCursor(true);

    // Agregar clase visual
    this.element.nativeElement.classList.add('resizing');
    parent.classList.add('slot-being-resized');
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;

    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;

    // Calcular nuevos tamaños
    let newWidth = this.startWidth;
    let newHeight = this.startHeight;

    if (this.direction === 'horizontal' || this.direction === 'both') {
      newWidth += dx;
    }
    if (this.direction === 'vertical' || this.direction === 'both') {
      newHeight += dy;
    }

    // Aplicar mínimos
    newWidth = Math.max(this.minWidth, newWidth);
    newHeight = Math.max(this.minHeight, newHeight);

    // Snap to grid
    if (this.snapEnabled) {
      newWidth = this.snapToGrid(newWidth);
      newHeight = this.snapToGrid(newHeight);
    }

    // Emitir evento de movimiento
    this.resizeMove.emit({
      width: newWidth,
      height: newHeight,
      deltaX: dx,
      deltaY: dy
    });

    // Actualizar servicio pasando el ancla específica
    this.resizeService.onResizeMove(this.slotIndex, { dx, dy }, this.anchor);
  }

  private onMouseUp(): void {
    if (!this.isDragging) return;

    this.endResize();
  }

  private endResize(): void {
    if (!this.isDragging) return;

    this.isDragging = false;

    // Obtener tamaño final
    const parent = this.getParentElement();
    if (parent) {
      const rect = parent.getBoundingClientRect();
      this.resized.emit({
        width: rect.width,
        height: rect.height,
        deltaX: rect.width - this.startWidth,
        deltaY: rect.height - this.startHeight
      });
    }

    // Limpiar servicio
    this.resizeService.endResize();

    // Emitir evento de fin
    this.resizeEnd.emit();

    // Remover listeners globales
    this.removeGlobalListeners();

    // Restaurar cursor
    this.updateCursor(false);

    // Remover clase visual
    this.element.nativeElement.classList.remove('resizing');
    if (parent) {
      parent.classList.remove('slot-being-resized');
    }
  }

  private addGlobalListeners(): void {
    // Mouse events
    const mouseMoveHandler = (e: MouseEvent) => this.onMouseMove(e);
    const mouseUpHandler = () => this.onMouseUp();
    
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);

    // Touch events
    const touchMoveHandler = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        this.onMouseMove({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY,
          button: 0,
          preventDefault: () => e.preventDefault(),
          stopPropagation: () => e.stopPropagation()
        } as any);
      }
    };
    const touchEndHandler = () => this.onMouseUp();
    
    document.addEventListener('touchmove', touchMoveHandler);
    document.addEventListener('touchend', touchEndHandler);

    // Store cleanup functions
    this.cleanupFns = [
      () => document.removeEventListener('mousemove', mouseMoveHandler),
      () => document.removeEventListener('mouseup', mouseUpHandler),
      () => document.removeEventListener('touchmove', touchMoveHandler),
      () => document.removeEventListener('touchend', touchEndHandler)
    ];

    // Escape key to cancel
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.resizeService.cancelResize();
        this.endResize();
      }
    };
    document.addEventListener('keydown', escapeHandler);
    this.cleanupFns.push(() => document.removeEventListener('keydown', escapeHandler));
  }

  private removeGlobalListeners(): void {
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];
  }

  private getParentElement(): HTMLElement | null {
    return this.element.nativeElement.parentElement;
  }

  private snapToGrid(value: number): number {
    return Math.round(value / this.snapSize) * this.snapSize;
  }

  private updateCursor(isResizing: boolean): void {
    if (isResizing) {
      const cursorMap: Record<ResizeAnchor, string> = {
        'n': 'ns-resize',
        's': 'ns-resize',
        'e': 'ew-resize',
        'w': 'ew-resize',
        'nw': 'nwse-resize',
        'se': 'nwse-resize',
        'ne': 'nesw-resize',
        'sw': 'nesw-resize',
        'move': 'move'
      };
      document.body.style.cursor = cursorMap[this.anchor] || 'pointer';
    } else {
      document.body.style.cursor = '';
    }
  }

  // ========== NG ON DESTROY ==========

  @HostListener('destroy')
  onDestroy(): void {
    if (this.isDragging) {
      this.removeGlobalListeners();
      this.resizeService.cancelResize();
    }
  }
}
