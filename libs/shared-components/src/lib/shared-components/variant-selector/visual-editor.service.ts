import { Injectable, ElementRef, Renderer2, RendererFactory2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface ResizeHandles {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
  topLeft: boolean;
  topRight: boolean;
  bottomLeft: boolean;
  bottomRight: boolean;
}

export interface DragResizeConfig {
  enableDrag: boolean;
  enableResize: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  handles?: Partial<ResizeHandles>;
  grid?: number; // Snap to grid
  containment?: 'parent' | 'viewport' | ElementRef;
}

export interface ElementBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root'
})
export class VisualEditorService {
  private renderer: Renderer2;
  private activeElement: HTMLElement | null = null;
  private destroy$ = new Subject<void>();
  
  // Eventos observables
  public elementSelected$ = new Subject<HTMLElement>();
  public elementResized$ = new Subject<{ element: HTMLElement; bounds: ElementBounds }>();
  public elementMoved$ = new Subject<{ element: HTMLElement; bounds: ElementBounds }>();
  public elementDeselected$ = new Subject<void>();

  // Estado de edición
  private isEditMode = false;
  private isDragging = false;
  private isResizing = false;
  private resizeHandle: string | null = null;

  // Configuración por defecto
  private defaultConfig: DragResizeConfig = {
    enableDrag: true,
    enableResize: true,
    minWidth: 50,
    minHeight: 50,
    handles: {
      top: true,
      right: true,
      bottom: true,
      left: true,
      topLeft: true,
      topRight: true,
      bottomLeft: true,
      bottomRight: true
    },
    grid: 1
  };

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /**
   * Activa el modo de edición visual
   */
  enableEditMode() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isEditMode = true;
    this.addGlobalStyles();
  }

  /**
   * Desactiva el modo de edición visual
   */
  disableEditMode() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isEditMode = false;
    this.deselectElement();
    this.removeGlobalStyles();
  }

  /**
   * Hace un elemento editable visualmente
   */
  makeEditable(
    element: HTMLElement,
    config: Partial<DragResizeConfig> = {}
  ): () => void {
    if (!isPlatformBrowser(this.platformId)) {
      return () => {}; // Return empty cleanup function for SSR
    }

    const finalConfig = { ...this.defaultConfig, ...config };

    // Añadir clase de editable
    this.renderer.addClass(element, 'visual-editable');

    // Añadir atributo data para identificación
    this.renderer.setAttribute(element, 'data-visual-editable', 'true');

    // Hacer el elemento posicionable si no lo es
    const position = window.getComputedStyle(element).position;
    if (position === 'static') {
      this.renderer.setStyle(element, 'position', 'relative');
    }

    // Click para seleccionar
    const clickListener = this.renderer.listen(element, 'click', (e: MouseEvent) => {
      if (!this.isEditMode) return;
      e.stopPropagation();
      this.selectElement(element, finalConfig);
    });

    // Cleanup function
    return () => {
      this.renderer.removeClass(element, 'visual-editable');
      this.renderer.removeAttribute(element, 'data-visual-editable');
      clickListener();
      if (this.activeElement === element) {
        this.deselectElement();
      }
    };
  }

  /**
   * Selecciona un elemento para edición
   */
  private selectElement(element: HTMLElement, config: DragResizeConfig) {
    // Deseleccionar elemento anterior
    if (this.activeElement && this.activeElement !== element) {
      this.deselectElement();
    }

    this.activeElement = element;
    this.renderer.addClass(element, 'visual-selected');

    // Crear overlay de edición
    this.createEditOverlay(element, config);

    // Emitir evento
    this.elementSelected$.next(element);
  }

  /**
   * Deselecciona el elemento activo
   */
  deselectElement() {
    if (!this.activeElement) return;

    this.renderer.removeClass(this.activeElement, 'visual-selected');
    this.removeEditOverlay();
    this.activeElement = null;
    this.elementDeselected$.next();
  }

  /**
   * Crea el overlay de edición con handles
   */
  private createEditOverlay(element: HTMLElement, config: DragResizeConfig) {
    if (!isPlatformBrowser(this.platformId)) return;

    const rect = element.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Crear contenedor del overlay
    const overlay = this.renderer.createElement('div');
    this.renderer.addClass(overlay, 'visual-edit-overlay');
    this.renderer.setStyle(overlay, 'position', 'absolute');
    this.renderer.setStyle(overlay, 'top', `${rect.top + scrollY}px`);
    this.renderer.setStyle(overlay, 'left', `${rect.left + scrollX}px`);
    this.renderer.setStyle(overlay, 'width', `${rect.width}px`);
    this.renderer.setStyle(overlay, 'height', `${rect.height}px`);
    this.renderer.setStyle(overlay, 'pointer-events', 'none');
    this.renderer.setStyle(overlay, 'z-index', '9999');
    this.renderer.setAttribute(overlay, 'data-overlay', 'true');

    // Crear borde de selección
    const border = this.renderer.createElement('div');
    this.renderer.addClass(border, 'visual-selection-border');
    this.renderer.appendChild(overlay, border);

    // Crear label con dimensiones
    const label = this.renderer.createElement('div');
    this.renderer.addClass(label, 'visual-dimension-label');
    this.renderer.setProperty(label, 'textContent', `${Math.round(rect.width)} × ${Math.round(rect.height)}`);
    this.renderer.appendChild(overlay, label);

    // Crear handles de resize
    if (config.enableResize && config.handles) {
      this.createResizeHandles(overlay, config.handles);
    }

    // Añadir al body
    this.renderer.appendChild(document.body, overlay);

    // Setup drag si está habilitado
    if (config.enableDrag) {
      this.setupDrag(element, overlay, config);
    }

    // Setup resize si está habilitado
    if (config.enableResize) {
      this.setupResize(element, overlay, config);
    }
  }

  /**
   * Crea los handles de resize
   */
  private createResizeHandles(overlay: HTMLElement, handles: Partial<ResizeHandles>) {
    const handlePositions = [
      { name: 'top', cursor: 'ns-resize', enabled: handles.top },
      { name: 'right', cursor: 'ew-resize', enabled: handles.right },
      { name: 'bottom', cursor: 'ns-resize', enabled: handles.bottom },
      { name: 'left', cursor: 'ew-resize', enabled: handles.left },
      { name: 'top-left', cursor: 'nwse-resize', enabled: handles.topLeft },
      { name: 'top-right', cursor: 'nesw-resize', enabled: handles.topRight },
      { name: 'bottom-left', cursor: 'nesw-resize', enabled: handles.bottomLeft },
      { name: 'bottom-right', cursor: 'nwse-resize', enabled: handles.bottomRight }
    ];

    handlePositions.forEach(({ name, cursor, enabled }) => {
      if (!enabled) return;

      const handle = this.renderer.createElement('div');
      this.renderer.addClass(handle, 'visual-resize-handle');
      this.renderer.addClass(handle, `handle-${name}`);
      this.renderer.setStyle(handle, 'cursor', cursor);
      this.renderer.setStyle(handle, 'pointer-events', 'all');
      this.renderer.setAttribute(handle, 'data-handle', name);
      this.renderer.appendChild(overlay, handle);
    });
  }

  /**
   * Configura el drag del elemento
   */
  private setupDrag(element: HTMLElement, overlay: HTMLElement, config: DragResizeConfig) {
    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;

    const onMouseDown = (e: MouseEvent) => {
      // Solo drag desde el overlay, no desde handles
      if ((e.target as HTMLElement).classList.contains('visual-resize-handle')) {
        return;
      }

      this.isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const rect = element.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;

      e.preventDefault();
      e.stopPropagation();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!this.isDragging) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newX = initialX + deltaX;
      let newY = initialY + deltaY;

      // Snap to grid
      if (config.grid && config.grid > 1) {
        newX = Math.round(newX / config.grid) * config.grid;
        newY = Math.round(newY / config.grid) * config.grid;
      }

      // Aplicar posición
      this.renderer.setStyle(element, 'left', `${newX}px`);
      this.renderer.setStyle(element, 'top', `${newY}px`);
      this.renderer.setStyle(element, 'position', 'absolute');

      // Actualizar overlay
      this.updateOverlayPosition(overlay, element);
    };

    const onMouseUp = () => {
      if (this.isDragging) {
        this.isDragging = false;
        const rect = element.getBoundingClientRect();
        this.elementMoved$.next({
          element,
          bounds: {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height
          }
        });
      }
    };

    // Listeners
    this.renderer.listen(overlay, 'mousedown', onMouseDown);
    this.renderer.listen(document, 'mousemove', onMouseMove);
    this.renderer.listen(document, 'mouseup', onMouseUp);
  }

  /**
   * Configura el resize del elemento
   */
  private setupResize(element: HTMLElement, overlay: HTMLElement, config: DragResizeConfig) {
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;
    let startLeft = 0;
    let startTop = 0;

    const onHandleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains('visual-resize-handle')) return;

      this.isResizing = true;
      this.resizeHandle = target.getAttribute('data-handle');
      
      startX = e.clientX;
      startY = e.clientY;

      const rect = element.getBoundingClientRect();
      startWidth = rect.width;
      startHeight = rect.height;
      startLeft = rect.left;
      startTop = rect.top;

      e.preventDefault();
      e.stopPropagation();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!this.isResizing || !this.resizeHandle) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;

      // Calcular nuevas dimensiones según el handle
      switch (this.resizeHandle) {
        case 'right':
          newWidth = startWidth + deltaX;
          break;
        case 'left':
          newWidth = startWidth - deltaX;
          newLeft = startLeft + deltaX;
          break;
        case 'bottom':
          newHeight = startHeight + deltaY;
          break;
        case 'top':
          newHeight = startHeight - deltaY;
          newTop = startTop + deltaY;
          break;
        case 'top-left':
          newWidth = startWidth - deltaX;
          newHeight = startHeight - deltaY;
          newLeft = startLeft + deltaX;
          newTop = startTop + deltaY;
          break;
        case 'top-right':
          newWidth = startWidth + deltaX;
          newHeight = startHeight - deltaY;
          newTop = startTop + deltaY;
          break;
        case 'bottom-left':
          newWidth = startWidth - deltaX;
          newHeight = startHeight + deltaY;
          newLeft = startLeft + deltaX;
          break;
        case 'bottom-right':
          newWidth = startWidth + deltaX;
          newHeight = startHeight + deltaY;
          break;
      }

      // Aplicar restricciones
      if (config.minWidth) newWidth = Math.max(newWidth, config.minWidth);
      if (config.minHeight) newHeight = Math.max(newHeight, config.minHeight);
      if (config.maxWidth) newWidth = Math.min(newWidth, config.maxWidth);
      if (config.maxHeight) newHeight = Math.min(newHeight, config.maxHeight);

      // Snap to grid
      if (config.grid && config.grid > 1) {
        newWidth = Math.round(newWidth / config.grid) * config.grid;
        newHeight = Math.round(newHeight / config.grid) * config.grid;
      }

      // Aplicar dimensiones
      this.renderer.setStyle(element, 'width', `${newWidth}px`);
      this.renderer.setStyle(element, 'height', `${newHeight}px`);

      // Si cambió la posición (handles izquierda/arriba)
      if (newLeft !== startLeft || newTop !== startTop) {
        this.renderer.setStyle(element, 'left', `${newLeft}px`);
        this.renderer.setStyle(element, 'top', `${newTop}px`);
        this.renderer.setStyle(element, 'position', 'absolute');
      }

      // Actualizar overlay
      this.updateOverlayPosition(overlay, element);
      this.updateDimensionLabel(overlay, newWidth, newHeight);
    };

    const onMouseUp = () => {
      if (this.isResizing) {
        this.isResizing = false;
        this.resizeHandle = null;
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
      }
    };

    // Listeners
    this.renderer.listen(overlay, 'mousedown', onHandleMouseDown);
    this.renderer.listen(document, 'mousemove', onMouseMove);
    this.renderer.listen(document, 'mouseup', onMouseUp);
  }

  /**
   * Actualiza la posición del overlay
   */
  private updateOverlayPosition(overlay: HTMLElement, element: HTMLElement) {
    if (!isPlatformBrowser(this.platformId)) return;

    const rect = element.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    this.renderer.setStyle(overlay, 'top', `${rect.top + scrollY}px`);
    this.renderer.setStyle(overlay, 'left', `${rect.left + scrollX}px`);
    this.renderer.setStyle(overlay, 'width', `${rect.width}px`);
    this.renderer.setStyle(overlay, 'height', `${rect.height}px`);
  }

  /**
   * Actualiza el label de dimensiones
   */
  private updateDimensionLabel(overlay: HTMLElement, width: number, height: number) {
    const label = overlay.querySelector('.visual-dimension-label');
    if (label) {
      this.renderer.setProperty(label, 'textContent', `${Math.round(width)} × ${Math.round(height)}`);
    }
  }

  /**
   * Elimina el overlay de edición
   */
  private removeEditOverlay() {
    if (!isPlatformBrowser(this.platformId)) return;

    const overlay = document.querySelector('[data-overlay="true"]');
    if (overlay) {
      this.renderer.removeChild(document.body, overlay);
    }
  }

  /**
   * Añade estilos globales para el modo de edición
   */
  private addGlobalStyles() {
    if (!isPlatformBrowser(this.platformId)) return;

    const styleId = 'visual-editor-styles';
    if (document.getElementById(styleId)) return;

    const style = this.renderer.createElement('style');
    this.renderer.setAttribute(style, 'id', styleId);
    this.renderer.setProperty(style, 'textContent', `
      .visual-editable {
        outline: 1px dashed rgba(99, 102, 241, 0.3);
        outline-offset: 2px;
        transition: outline 0.2s ease;
        cursor: move;
      }

      .visual-editable:hover {
        outline: 2px dashed rgba(99, 102, 241, 0.6);
      }

      .visual-selected {
        outline: 2px solid #6366f1 !important;
        outline-offset: 2px;
      }

      .visual-edit-overlay {
        pointer-events: none;
      }

      .visual-selection-border {
        position: absolute;
        inset: -2px;
        border: 2px solid #6366f1;
        border-radius: 4px;
        pointer-events: none;
        box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.2),
                    0 0 20px rgba(99, 102, 241, 0.3);
        animation: pulse-border 2s ease-in-out infinite;
      }

      @keyframes pulse-border {
        0%, 100% { box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.2), 0 0 20px rgba(99, 102, 241, 0.3); }
        50% { box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.4), 0 0 30px rgba(99, 102, 241, 0.5); }
      }

      .visual-dimension-label {
        position: absolute;
        top: -28px;
        left: 50%;
        transform: translateX(-50%);
        background: #6366f1;
        color: white;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 700;
        font-family: 'Courier New', monospace;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        pointer-events: none;
      }

      .visual-resize-handle {
        position: absolute;
        background: white;
        border: 2px solid #6366f1;
        border-radius: 50%;
        width: 12px;
        height: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transition: all 0.2s ease;
      }

      .visual-resize-handle:hover {
        background: #6366f1;
        transform: scale(1.3);
      }

      .handle-top {
        top: -6px;
        left: 50%;
        transform: translateX(-50%);
      }

      .handle-right {
        top: 50%;
        right: -6px;
        transform: translateY(-50%);
      }

      .handle-bottom {
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
      }

      .handle-left {
        top: 50%;
        left: -6px;
        transform: translateY(-50%);
      }

      .handle-top-left {
        top: -6px;
        left: -6px;
      }

      .handle-top-right {
        top: -6px;
        right: -6px;
      }

      .handle-bottom-left {
        bottom: -6px;
        left: -6px;
      }

      .handle-bottom-right {
        bottom: -6px;
        right: -6px;
      }
    `);

    this.renderer.appendChild(document.head, style);
  }

  /**
   * Elimina estilos globales
   */
  private removeGlobalStyles() {
    if (!isPlatformBrowser(this.platformId)) return;

    const style = document.getElementById('visual-editor-styles');
    if (style) {
      this.renderer.removeChild(document.head, style);
    }
  }

  /**
   * Obtiene el elemento actualmente seleccionado
   */
  getActiveElement(): HTMLElement | null {
    return this.activeElement;
  }

  /**
   * Verifica si está en modo de edición
   */
  isInEditMode(): boolean {
    return this.isEditMode;
  }

  /**
   * Limpieza al destruir el servicio
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.disableEditMode();
  }
}
