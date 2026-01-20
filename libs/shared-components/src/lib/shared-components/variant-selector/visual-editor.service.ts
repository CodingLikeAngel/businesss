import { Injectable, ElementRef, Renderer2, RendererFactory2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ElementGroupService } from './element-group.service';
import { ElementGroup, MultiSelectionState } from './enhanced-visual-editing.interfaces';

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
  containment?: 'parent' | 'viewport' | 'container' | ElementRef;
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

  // Multi-selection state
  private multiSelectionState: MultiSelectionState = {
    selectedElements: new Set(),
    selectionBounds: null,
    activeGroup: null,
    selectionMode: 'single'
  };

  // Eventos observables
  public elementSelected$ = new Subject<HTMLElement>();
  public elementResized$ = new Subject<{ element: HTMLElement; bounds: ElementBounds }>();
  public elementMoved$ = new Subject<{ element: HTMLElement; bounds: ElementBounds }>();
  public elementDeselected$ = new Subject<void>();

  // Multi-selection events
  public multiSelectionChanged$ = new Subject<MultiSelectionState>();
  public groupSelected$ = new Subject<ElementGroup>();

  private overlayListeners: Function[] = [];
  private activeGuides: HTMLElement[] = [];
  private snapThreshold = 5;


  // Estado de edición
  private isEditMode = false;
  private isDragging = false;
  private isResizing = false;
  private resizeHandle: string | null = null;
  private isMultiSelecting = false;
  private selectionStartPoint: { x: number; y: number } | null = null;

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
    @Inject(PLATFORM_ID) private platformId: Object,
    private elementGroupService: ElementGroupService
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);

    // Subscribe to group events
    this.elementGroupService.groupEvents.subscribe(event => {
      if (event.type === 'created' || event.type === 'deleted') {
        this.updateMultiSelectionState();
      }
    });
  }

  // Multi-selection methods

  /**
   * Select multiple elements
   */
  selectMultiple(elements: HTMLElement[]): void {
    this.clearSelection();
    elements.forEach(element => this.multiSelectionState.selectedElements.add(element));
    this.updateMultiSelectionState();
    this.multiSelectionChanged$.next(this.multiSelectionState);
  }

  /**
   * Add element to current selection
   */
  addToSelection(element: HTMLElement): void {
    this.multiSelectionState.selectedElements.add(element);
    this.updateMultiSelectionState();
    this.multiSelectionChanged$.next(this.multiSelectionState);
  }

  /**
   * Remove element from current selection
   */
  removeFromSelection(element: HTMLElement): void {
    this.multiSelectionState.selectedElements.delete(element);
    this.updateMultiSelectionState();
    this.multiSelectionChanged$.next(this.multiSelectionState);
  }

  /**
   * Clear all selections
   */
  clearSelection(): void {
    this.multiSelectionState.selectedElements.clear();
    this.multiSelectionState.selectionBounds = null;
    this.multiSelectionState.activeGroup = null;
    this.multiSelectionState.selectionMode = 'single';
    this.updateMultiSelectionState();
    this.multiSelectionChanged$.next(this.multiSelectionState);
  }

  /**
   * Create group from current selection
   */
  createGroupFromSelection(name?: string, sectionId?: string): ElementGroup | null {
    if (this.multiSelectionState.selectedElements.size === 0) return null;

    const elements = Array.from(this.multiSelectionState.selectedElements);
    try {
      const group = this.elementGroupService.createGroup(elements, {}, name, sectionId);
      this.multiSelectionState.activeGroup = group;
      this.multiSelectionState.selectionMode = 'group';
      this.multiSelectionChanged$.next(this.multiSelectionState);
      this.groupSelected$.next(group);
      return group;
    } catch (error) {
      console.error('Failed to create group:', error);
      return null;
    }
  }

  /**
   * Select a group
   */
  selectGroup(groupId: string): void {
    const group = this.elementGroupService.getGroup(groupId);
    if (group) {
      this.clearSelection();
      this.multiSelectionState.activeGroup = group;
      this.multiSelectionState.selectionMode = 'group';
      this.multiSelectionState.selectedElements = new Set(group.elements.map(ge => ge.element));
      this.updateMultiSelectionState();
      this.multiSelectionChanged$.next(this.multiSelectionState);
      this.groupSelected$.next(group);
    }
  }

  /**
   * Get current multi-selection state
   */
  getMultiSelectionState(): MultiSelectionState {
    return { ...this.multiSelectionState };
  }

  /**
   * Check if element is in current selection
   */
  isElementSelected(element: HTMLElement): boolean {
    return this.multiSelectionState.selectedElements.has(element);
  }

  /**
   * Update multi-selection bounds
   */
  private updateMultiSelectionState(): void {
    if (this.multiSelectionState.selectedElements.size === 0) {
      this.multiSelectionState.selectionBounds = null;
      return;
    }

    const elements = Array.from(this.multiSelectionState.selectedElements);
    const bounds = this.calculateElementsBounds(elements);
    this.multiSelectionState.selectionBounds = bounds;
  }

  /**
   * Calculate bounds for multiple elements
   */
  private calculateElementsBounds(elements: HTMLElement[]): { x: number; y: number; width: number; height: number } | null {
    if (elements.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      minX = Math.min(minX, rect.left);
      minY = Math.min(minY, rect.top);
      maxX = Math.max(maxX, rect.right);
      maxY = Math.max(maxY, rect.bottom);
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
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

      // Check if Ctrl key is pressed for multi-selection
      if (e.ctrlKey || e.metaKey) {
        if (this.multiSelectionState.selectedElements.has(element)) {
          this.removeFromSelection(element);
        } else {
          this.addToSelection(element);
        }
      } else {
        // Single selection - clear previous and select this one
        this.clearSelection();
        this.selectElement(element, finalConfig);
      }
    });

    // Cleanup function
    return () => {
      // If the removed element was active, deselect it to prevent 'ghosting'
      if (this.activeElement === element) {
        this.deselectElement();
      }
      this.renderer.removeClass(element, 'visual-editable');
      this.renderer.removeAttribute(element, 'data-visual-editable');
      clickListener();
    };
  }

  /**
   * Actualiza la configuración de un elemento ya editable
   */
  updateConfig(element: HTMLElement, config: DragResizeConfig) {
    if (!isPlatformBrowser(this.platformId)) return;

    // Si el elemento es el activo, actualizar el overlay
    if (this.activeElement === element) {
      this.removeEditOverlay();
      this.createEditOverlay(element, config);
    }
  }


  /**
   * Selecciona un elemento por su ID DOM
   */
  selectElementById(id: string, config?: Partial<DragResizeConfig>) {
    if (!isPlatformBrowser(this.platformId)) return;
    const element = document.getElementById(id);
    if (element) {
      const finalConfig = { ...this.defaultConfig, ...(config || {}) };
      this.selectElement(element, finalConfig);
    }
  }

  /**
   * Selecciona un elemento para edición
   */
  public selectElement(element: HTMLElement, config: DragResizeConfig) {

    // Deseleccionar elemento anterior
    if (this.activeElement && this.activeElement !== element) {
      this.deselectElement();
    }

    this.activeElement = element;
    this.renderer.addClass(element, 'visual-selected');

    // Add to multi-selection if not already there
    this.multiSelectionState.selectedElements.add(element);
    this.multiSelectionState.selectionMode = 'single';
    this.updateMultiSelectionState();

    // Crear overlay de edición
    this.createEditOverlay(element, config);

    // Emitir evento
    this.elementSelected$.next(element);
    this.multiSelectionChanged$.next(this.multiSelectionState);
  }

  /**
   * Deselecciona el elemento activo
   */
  deselectElement() {
    if (!this.activeElement) return;

    this.renderer.removeClass(this.activeElement, 'visual-selected');
    this.removeEditOverlay();
    this.activeElement = null;

    // Remove from multi-selection
    this.multiSelectionState.selectedElements.clear();
    this.multiSelectionState.selectionBounds = null;
    this.multiSelectionState.activeGroup = null;
    this.multiSelectionState.selectionMode = 'single';

    this.elementDeselected$.next();
    this.multiSelectionChanged$.next(this.multiSelectionState);
  }

  /**
   * Crea el overlay de edición con handles
   */
  private createEditOverlay(element: HTMLElement, config: DragResizeConfig) {
    if (!isPlatformBrowser(this.platformId)) return;

    const rect = element.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Crear contenedor del overlay (no captura eventos para no bloquear menús)
    const overlay = this.renderer.createElement('div');
    this.renderer.addClass(overlay, 'visual-edit-overlay');
    this.renderer.setStyle(overlay, 'position', 'absolute');
    this.renderer.setStyle(overlay, 'top', `${rect.top + scrollY}px`);
    this.renderer.setStyle(overlay, 'left', `${rect.left + scrollX}px`);
    this.renderer.setStyle(overlay, 'width', `${rect.width}px`);
    this.renderer.setStyle(overlay, 'height', `${rect.height}px`);
    this.renderer.setStyle(overlay, 'pointer-events', 'none');
    this.renderer.setStyle(overlay, 'z-index', '900'); // Higher than sidebar (500) but below custom dialogs

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

    // Sync overlay position if element moves or changes size (e.g. sidebar collapse)
    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      const ro = new ResizeObserver(() => {
        this.updateOverlayPosition(overlay, element);
      });
      ro.observe(element);
      ro.observe(document.body); // Also observe body for global layout shifts
      this.overlayListeners.push(() => ro.disconnect());
    }
  }

  /**
   * Crea los handles de resize
   */
  private createResizeHandles(overlay: HTMLElement, handles: Partial<ResizeHandles>) {
    // If it's a section, we might want to only show side handles
    // This is often what users mean by "stretch borders"
    const isSection = this.activeElement?.getAttribute('data-type') === 'section' || 
                      this.activeElement?.classList.contains('editor-section');

    const handlePositions = [
      { name: 'top', cursor: 'ns-resize', enabled: handles.top },
      { name: 'right', cursor: 'ew-resize', enabled: handles.right },
      { name: 'bottom', cursor: 'ns-resize', enabled: handles.bottom },
      { name: 'left', cursor: 'ew-resize', enabled: handles.left },
      { name: 'top-left', cursor: 'nwse-resize', enabled: !isSection && handles.topLeft },
      { name: 'top-right', cursor: 'nesw-resize', enabled: !isSection && handles.topRight },
      { name: 'bottom-left', cursor: 'nesw-resize', enabled: !isSection && handles.bottomLeft },
      { name: 'bottom-right', cursor: 'nwse-resize', enabled: !isSection && handles.bottomRight }
    ];

    handlePositions.forEach(({ name, cursor, enabled }) => {
      if (!enabled) return;

      const handle = this.renderer.createElement('div');
      this.renderer.addClass(handle, 'visual-resize-handle');
      this.renderer.addClass(handle, `handle-${name}`);
      this.renderer.setStyle(handle, 'cursor', cursor);
      this.renderer.setStyle(handle, 'pointer-events', 'all'); // Handles should capture events
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
    let startStyleLeft = 0;
    let startStyleTop = 0;

    const onMouseDown = (e: MouseEvent) => {
      // Only drag if element is already selected (first click just selects)
      if (this.activeElement !== element) return;
      
      // Don't drag if clicking buttons or inputs inside
      const target = e.target as HTMLElement;
      if (target.closest('button, input, a, select, textarea')) return;

      this.isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const computedStyle = window.getComputedStyle(element);
      const position = computedStyle.position;
      
      const rect = element.getBoundingClientRect();
      const parentRect = (element.offsetParent as HTMLElement)?.getBoundingClientRect() || { left: 0, top: 0 };
      const parentBorderLeft = parseInt(computedStyle.borderLeftWidth) || 0;
      const parentBorderTop = parseInt(computedStyle.borderTopWidth) || 0;

      if (position === 'static' || computedStyle.left === 'auto') {
        startStyleLeft = rect.left - parentRect.left - parentBorderLeft;
        startStyleTop = rect.top - parentRect.top - parentBorderTop;
      } else {
        startStyleLeft = parseInt(computedStyle.left) || 0;
        startStyleTop = parseInt(computedStyle.top) || 0;
      }

      // 'Anchor' the element: convert to absolute with fit-content to prevent coordinate drifting
      this.renderer.setStyle(element, 'position', 'absolute');
      this.renderer.setStyle(element, 'left', `${startStyleLeft}px`);
      this.renderer.setStyle(element, 'top', `${startStyleTop}px`);
      this.renderer.setStyle(element, 'margin', '0');
      this.renderer.setStyle(element, 'transform', 'none');
      this.renderer.setStyle(element, 'width', 'fit-content');
      this.renderer.addClass(element, 'is-moving');

      e.preventDefault();
      e.stopPropagation();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!this.isDragging) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newX = startStyleLeft + deltaX;
      let newY = startStyleTop + deltaY;

      // Smart Alignment & Snapping
      this.clearGuides();
      const alignments = this.detectAlignment(element, newX, newY);
      
      if (alignments.x !== null) newX = alignments.x;
      if (alignments.y !== null) newY = alignments.y;

      // Snap to grid (if no alignment snap happened or optional)
      if (config.grid && config.grid > 1 && alignments.x === null && alignments.y === null) {
        newX = Math.round(newX / config.grid) * config.grid;
        newY = Math.round(newY / config.grid) * config.grid;
      }

      this.renderer.setStyle(element, 'left', `${newX}px`);
      this.renderer.setStyle(element, 'top', `${newY}px`);
      this.renderer.setStyle(element, 'position', 'absolute');

      this.updateOverlayPosition(overlay, element);
    };

    const onMouseUp = () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.clearGuides();
        this.renderer.removeClass(element, 'is-moving');
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

    // Attach drag to the element itself to allow clicking through overlay
    this.overlayListeners.push(this.renderer.listen(element, 'mousedown', onMouseDown));
    this.overlayListeners.push(this.renderer.listen(document, 'mousemove', onMouseMove));
    this.overlayListeners.push(this.renderer.listen(document, 'mouseup', onMouseUp));
  }

  /**
   * Detecta alineaciones con otros elementos para snapping y guías
   */
  private detectAlignment(element: HTMLElement, currentLeft: number, currentTop: number): { x: number | null, y: number | null } {
    const parent = element.offsetParent as HTMLElement;
    if (!parent) return { x: null, y: null };

    const parentRect = parent.getBoundingClientRect();
    const elRect = element.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Viewport-relative target bounds
    const targetX = parentRect.left + currentLeft;
    const targetY = parentRect.top + currentTop;
    const targetRight = targetX + elRect.width;
    const targetBottom = targetY + elRect.height;
    const targetCenterX = targetX + elRect.width / 2;
    const targetCenterY = targetY + elRect.height / 2;

    const parentCenterX = parentRect.left + parentRect.width / 2;
    const parentCenterY = parentRect.top + parentRect.height / 2;

    let snapX: number | null = null;
    let snapY: number | null = null;

    // Viewport-relative references for snapping
    const verticalRefs = [
      { ref: parentRect.left, label: 'Parent Left' },
      { ref: parentRect.right, label: 'Parent Right' },
      { ref: parentCenterX, label: 'Parent Center' }
    ];

    const horizontalRefs = [
      { ref: parentRect.top, label: 'Parent Top' },
      { ref: parentRect.bottom, label: 'Parent Bottom' },
      { ref: parentCenterY, label: 'Parent Center' }
    ];

    // Obtener todos los elementos editables excepto el actual
    const others = Array.from(document.querySelectorAll('.visual-editable'))
      .filter(el => el !== element)
      .map(el => {
        const r = el.getBoundingClientRect();
        return {
          el: el as HTMLElement,
          left: r.left,
          top: r.top,
          right: r.right,
          bottom: r.bottom,
          centerX: r.left + r.width / 2,
          centerY: r.top + r.height / 2
        };
      });

    // Vertical Alignments (X-axis snap)
    const allVerticalRefs = [
      ...verticalRefs,
      ...others.map(o => ({ ref: o.left })),
      ...others.map(o => ({ ref: o.right })),
      ...others.map(o => ({ ref: o.centerX }))
    ];

    for (const refObj of allVerticalRefs) {
      const matchX = this.getClosestMatch([
        { val: targetX, ref: refObj.ref, type: 'left' },
        { val: targetRight, ref: refObj.ref, type: 'right' },
        { val: targetCenterX, ref: refObj.ref, type: 'center' }
      ]);

      if (matchX) {
        const diff = matchX.ref - matchX.val;
        snapX = currentLeft + diff;
        this.drawGuide(matchX.ref + scrollX, Math.min(targetY, parentRect.top) + scrollY, 1, Math.max(targetBottom, parentRect.bottom) - Math.min(targetY, parentRect.top), 'v');
        break; 
      }
    }

    // Horizontal Alignments (Y-axis snap)
    const allHorizontalRefs = [
      ...horizontalRefs,
      ...others.map(o => ({ ref: o.top })),
      ...others.map(o => ({ ref: o.bottom })),
      ...others.map(o => ({ ref: o.centerY }))
    ];

    for (const refObj of allHorizontalRefs) {
      const matchY = this.getClosestMatch([
        { val: targetY, ref: refObj.ref, type: 'top' },
        { val: targetBottom, ref: refObj.ref, type: 'bottom' },
        { val: targetCenterY, ref: refObj.ref, type: 'center' }
      ]);

      if (matchY) {
        const diff = matchY.ref - matchY.val;
        snapY = currentTop + diff;
        this.drawGuide(Math.min(targetX, parentRect.left) + scrollX, matchY.ref + scrollY, Math.max(targetRight, parentRect.right) - Math.min(targetX, parentRect.left), 1, 'h');
        break;
      }
    }

    return { x: snapX, y: snapY };
  }

  private getClosestMatch(checks: { val: number, ref: number, type: string }[]) {
    for (const check of checks) {
      if (Math.abs(check.val - check.ref) <= this.snapThreshold) {
        return check;
      }
    }
    return null;
  }

  private drawGuide(x: number, y: number, w: number, h: number, orientation: 'v' | 'h') {
    const guide = this.renderer.createElement('div');
    this.renderer.addClass(guide, 'visual-guide');
    this.renderer.addClass(guide, orientation === 'v' ? 'visual-guide-v' : 'visual-guide-h');
    this.renderer.setStyle(guide, 'left', `${x}px`);
    this.renderer.setStyle(guide, 'top', `${y}px`);
    this.renderer.setStyle(guide, 'width', orientation === 'v' ? '1px' : `${w}px`);
    this.renderer.setStyle(guide, 'height', orientation === 'h' ? '1px' : `${h}px`);
    this.renderer.appendChild(document.body, guide);
    this.activeGuides.push(guide);
  }

  private clearGuides() {
    this.activeGuides.forEach(g => {
      if (g.parentNode) g.parentNode.removeChild(g);
    });
    this.activeGuides = [];
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
    let startStyleLeft = 0;
    let startStyleTop = 0;


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

      const computedStyle = window.getComputedStyle(element);
      startStyleLeft = parseInt(computedStyle.left) || 0;
      startStyleTop = parseInt(computedStyle.top) || 0;



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
          // Use relative adjustment if possible to avoid jumping
          this.renderer.setStyle(element, 'left', `${startStyleLeft + deltaX}px`);
          break;
        case 'bottom':
          newHeight = startHeight + deltaY;
          break;
        case 'top':
          newHeight = startHeight - deltaY;
          this.renderer.setStyle(element, 'top', `${startStyleTop + deltaY}px`);
          break;
        case 'top-left':
          newWidth = startWidth - deltaX;
          newHeight = startHeight - deltaY;
          this.renderer.setStyle(element, 'left', `${startStyleLeft + deltaX}px`);
          this.renderer.setStyle(element, 'top', `${startStyleTop + deltaY}px`);
          break;
        case 'top-right':
          newWidth = startWidth + deltaX;
          newHeight = startHeight - deltaY;
          this.renderer.setStyle(element, 'top', `${startStyleTop + deltaY}px`);
          break;
        case 'bottom-left':
          newWidth = startWidth - deltaX;
          newHeight = startHeight + deltaY;
          this.renderer.setStyle(element, 'left', `${startStyleLeft + deltaX}px`);
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
    this.overlayListeners.push(this.renderer.listen(overlay, 'mousedown', onHandleMouseDown));
    this.overlayListeners.push(this.renderer.listen(document, 'mousemove', onMouseMove));
    this.overlayListeners.push(this.renderer.listen(document, 'mouseup', onMouseUp));
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

    // Clean up alignment guides
    this.clearGuides();

    // Clean up listeners
    this.overlayListeners.forEach(unlisten => unlisten());
    this.overlayListeners = [];

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
        box-sizing: border-box;
      }
      .visual-editable:not(.editor-section) {
        width: fit-content !important;
      }
      .visual-guide {
        position: absolute;
        background: #6366f1;
        z-index: 99999;
        pointer-events: none;
        box-shadow: 0 0 4px rgba(99, 102, 241, 0.5);
      }
      .visual-guide-v { width: 1px; }
      .visual-guide-h { height: 1px; }
      .visual-editable.is-moving {
        opacity: 0.7;
        z-index: 9999;
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

      /* Element Group Styles */
      .element-group-member {
        position: relative;
      }

      .element-group-overlay {
        border: 2px solid #8b5cf6;
        background: rgba(139, 92, 246, 0.1);
        border-radius: 6px;
        box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.2),
                    0 0 20px rgba(139, 92, 246, 0.3);
        animation: group-pulse 2s ease-in-out infinite;
      }

      .group-selection-border {
        border: 2px solid #8b5cf6 !important;
        border-radius: 6px;
        box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.2),
                    0 0 20px rgba(139, 92, 246, 0.3);
        animation: group-pulse 2s ease-in-out infinite;
      }

      .group-label {
        background: #8b5cf6 !important;
        color: white !important;
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4) !important;
      }

      .group-resize-handle {
        border-color: #8b5cf6 !important;
      }

      .group-resize-handle:hover {
        background: #8b5cf6 !important;
      }

      @keyframes group-pulse {
        0%, 100% {
          box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.2),
                      0 0 20px rgba(139, 92, 246, 0.3);
        }
        50% {
          box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.4),
                      0 0 30px rgba(139, 92, 246, 0.5);
        }
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
