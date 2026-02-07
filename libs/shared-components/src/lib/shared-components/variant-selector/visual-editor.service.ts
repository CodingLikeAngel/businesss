import { Injectable, ElementRef, Renderer2, RendererFactory2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ElementGroupService } from './element-group.service';
import { ElementGroup, MultiSelectionState } from './enhanced-visual-editing.interfaces';
import { UndoRedoService } from '../../services/undo-redo.service';

export type InteractionMode = 'select' | 'move' | 'resize' | 'all';


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
  public isDragging = false;
  public isResizing = false;
  private resizeHandle: string | null = null;
  private isMultiSelecting = false;
  private selectionStartPoint: { x: number; y: number } | null = null;
  private registeredElements = new Set<HTMLElement>();

  // Toggles for robustness
  public snapToGrid = true;
  public showGuides = true;
  public gridStep = 8; // Multiple of 4/8 is standard for design systems


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
    grid: 8
  };

  private _interactionMode: InteractionMode = 'all';
  private dragThreshold = 5; // Pixels to move before drag starts

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: Object,
    private elementGroupService: ElementGroupService,
    private undoRedoService: UndoRedoService
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
   * Set the current interaction mode
   */
  setInteractionMode(mode: InteractionMode) {
    this._interactionMode = mode;
    this.updateGlobalCursor();
    // Re-create overlay if active to show/hide handles
    if (this.activeElement) {
      this.removeEditOverlay();
      this.createEditOverlay(this.activeElement, this.defaultConfig); // Use stored config if possible? For now default
    }
  }

  get interactionMode(): InteractionMode {
    return this._interactionMode;
  }

  /**
   * Activa el modo de edición visual
   */
  enableEditMode() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isEditMode = true;
    this.addGlobalStyles();
    this.updateGlobalCursor();
    this.setupKeyboardShortcuts();
    this.setupMarqueeSelection();
    
    // Scan for editable elements after a short delay to ensure DOM is ready
    setTimeout(() => {
      this.scanAndRegisterEditableElements();
    }, 100);
  }

  /**
   * Scan the DOM for elements with data-visual-editable and register them
   */
  private scanAndRegisterEditableElements() {
    if (!isPlatformBrowser(this.platformId)) return;

    const editableElements = document.querySelectorAll('[data-visual-editable]');
    console.log(`🔍 Found ${editableElements.length} editable elements`);
    
    editableElements.forEach((element: Element) => {
      const htmlElement = element as HTMLElement;
      const elementId = htmlElement.getAttribute('data-visual-editable');
      
      if (elementId && !this.registeredElements.has(htmlElement)) {
        console.log(`✅ Registering element: ${elementId}`);
        
        // Add click listener to select element
        const clickListener = this.renderer.listen(htmlElement, 'click', (e: MouseEvent) => {
          e.stopPropagation();
          this.selectElement(htmlElement, {
            ...this.defaultConfig,
            enableDrag: this._interactionMode === 'all' || this._interactionMode === 'move',
            enableResize: this._interactionMode === 'all' || this._interactionMode === 'resize'
          });
        });
        
        this.overlayListeners.push(clickListener);
        this.registeredElements.add(htmlElement);
      }
    });
  }


  /**
   * Desactiva el modo de edición visual
   */
  disableEditMode() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isEditMode = false;
    this.deselectElement();
    this.removeGlobalStyles();
    this.destroy$.next();
  }

  /**
   * Setup keyboard shortcuts for the visual editor
   */
  private setupKeyboardShortcuts(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(takeUntil(this.destroy$))
      .subscribe(e => {
        if (!this.isEditMode) return;

        // Ignore if typing in input/textarea
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
          return;
        }

        // SHORTCUTS HANDLED BY GLOBAL KEYBOARD SERVICE
        // We remove internal handlers to prevent conflicts with HistoryService

        // Arrow keys - Nudge element (Keep this as it's specific to visual editing)
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && this.activeElement) {
          // Check if not focused on input
          const target = e.target as HTMLElement;
          if (!target.tagName.match(/INPUT|TEXTAREA|SELECT/)) {
             e.preventDefault();
             const step = e.shiftKey ? 10 : 1;
             this.nudgeElement(e.key, step);
          }
        }

        // Escape - Deselect (Keep as it is visual specific)
        if (e.key === 'Escape') {
          this.deselectElement();
        }

        // Ctrl+D - Duplicate
        if ((e.ctrlKey || e.metaKey) && e.key === 'd' && this.activeElement) {
          e.preventDefault();
          this.duplicateElement();
        }

        // Ctrl+A - Select all (future enhancement)
        // if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        //   e.preventDefault();
        //   this.selectAll();
        // }
      });
  }

  /**
   * Setup marquee selection (Shift+Drag to select multiple elements)
   */
  private setupMarqueeSelection(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    let marquee: HTMLElement | null = null;
    let startX = 0;
    let startY = 0;
    let isMarqueeActive = false;

    const onMouseDown = (e: MouseEvent) => {
      // Only activate with Shift key
      if (!e.shiftKey || !this.isEditMode) return;
      
      // Don't start marquee if clicking on an element
      const target = e.target as HTMLElement;
      if (target.classList.contains('visual-editable') || 
          target.closest('.visual-editable')) {
        return;
      }

      isMarqueeActive = true;
      startX = e.clientX;
      startY = e.clientY;

      // Create marquee element
      marquee = this.renderer.createElement('div');
      this.renderer.addClass(marquee, 'marquee-selection');
      this.renderer.setStyle(marquee, 'position', 'fixed');
      this.renderer.setStyle(marquee, 'border', '2px dashed #6366f1');
      this.renderer.setStyle(marquee, 'background', 'rgba(99, 102, 241, 0.1)');
      this.renderer.setStyle(marquee, 'left', `${startX}px`);
      this.renderer.setStyle(marquee, 'top', `${startY}px`);
      this.renderer.setStyle(marquee, 'width', '0px');
      this.renderer.setStyle(marquee, 'height', '0px');
      this.renderer.setStyle(marquee, 'z-index', '10001');
      this.renderer.setStyle(marquee, 'pointer-events', 'none');
      this.renderer.appendChild(document.body, marquee);

      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMarqueeActive || !marquee) return;

      const currentX = e.clientX;
      const currentY = e.clientY;

      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);
      const left = Math.min(currentX, startX);
      const top = Math.min(currentY, startY);

      this.renderer.setStyle(marquee, 'left', `${left}px`);
      this.renderer.setStyle(marquee, 'top', `${top}px`);
      this.renderer.setStyle(marquee, 'width', `${width}px`);
      this.renderer.setStyle(marquee, 'height', `${height}px`);
    };

    const onMouseUp = () => {
      if (!isMarqueeActive || !marquee) return;

      const marqueeRect = marquee.getBoundingClientRect();
      const selectedElements: HTMLElement[] = [];

      // Check which elements intersect with marquee
      this.registeredElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (this.rectsIntersect(marqueeRect, rect)) {
          selectedElements.push(el);
        }
      });

      // Select all intersecting elements
      if (selectedElements.length > 0) {
        this.selectMultiple(selectedElements);
        console.log(`📦 Marquee selected ${selectedElements.length} elements`);
      }

      // Cleanup
      if (marquee && marquee.parentNode) {
        marquee.parentNode.removeChild(marquee);
      }
      marquee = null;
      isMarqueeActive = false;
    };

    // Attach listeners
    fromEvent<MouseEvent>(document, 'mousedown')
      .pipe(takeUntil(this.destroy$))
      .subscribe(onMouseDown);

    fromEvent<MouseEvent>(document, 'mousemove')
      .pipe(takeUntil(this.destroy$))
      .subscribe(onMouseMove);

    fromEvent<MouseEvent>(document, 'mouseup')
      .pipe(takeUntil(this.destroy$))
      .subscribe(onMouseUp);
  }

  /**
   * Check if two rectangles intersect
   */
  private rectsIntersect(r1: DOMRect, r2: DOMRect): boolean {
    return !(r1.right < r2.left || 
             r1.left > r2.right || 
             r1.bottom < r2.top || 
             r1.top > r2.bottom);
  }

  /**
   * Nudge the active element in a direction
   */
  private nudgeElement(direction: string, step: number): void {
    if (!this.activeElement) return;

    const rect = this.activeElement.getBoundingClientRect();
    const parent = this.activeElement.offsetParent as HTMLElement || document.body;
    const parentRect = parent.getBoundingClientRect();

    let newLeft = rect.left - parentRect.left;
    let newTop = rect.top - parentRect.top;

    switch (direction) {
      case 'ArrowUp':
        newTop -= step;
        break;
      case 'ArrowDown':
        newTop += step;
        break;
      case 'ArrowLeft':
        newLeft -= step;
        break;
      case 'ArrowRight':
        newLeft += step;
        break;
    }

    // Apply position
    this.renderer.setStyle(this.activeElement, 'position', 'absolute');
    this.renderer.setStyle(this.activeElement, 'left', `${newLeft}px`);
    this.renderer.setStyle(this.activeElement, 'top', `${newTop}px`);

    // Save state for undo
    this.saveElementState('Nudged element');

    // Emit event
    this.elementMoved$.next({
      element: this.activeElement,
      bounds: {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      }
    });
  }

  /**
   * Delete the active element
   */
  private deleteElement(): void {
    if (!this.activeElement) return;

    // Save state before deletion for undo
    this.saveElementState('Deleted element');

    // Remove element
    const parent = this.activeElement.parentElement;
    if (parent) {
      parent.removeChild(this.activeElement);
    }

    this.deselectElement();
  }

  /**
   * Duplicate the active element
   */
  private duplicateElement(): void {
    if (!this.activeElement) return;

    const clone = this.activeElement.cloneNode(true) as HTMLElement;
    
    // Offset the clone slightly
    const rect = this.activeElement.getBoundingClientRect();
    this.renderer.setStyle(clone, 'position', 'absolute');
    this.renderer.setStyle(clone, 'left', `${this.activeElement.offsetLeft + 20}px`);
    this.renderer.setStyle(clone, 'top', `${this.activeElement.offsetTop + 20}px`);

    // Insert after original
    const parent = this.activeElement.parentElement;
    if (parent) {
      parent.insertBefore(clone, this.activeElement.nextSibling);
    }

    // Save state
    this.saveElementState('Duplicated element');

    // Select the clone
    this.selectElement(clone, this.defaultConfig);
  }

  /**
   * Undo last action
   */
  public undo(): void {
    const state = this.undoRedoService.undo();
    if (state) {
      this.restoreElementState(state);
      console.log('↩️ Undo:', state.description || 'Unknown action');
    }
  }

  /**
   * Redo last undone action
   */
  public redo(): void {
    const state = this.undoRedoService.redo();
    if (state) {
      this.restoreElementState(state);
      console.log('↪️ Redo:', state.description || 'Unknown action');
    }
  }

  /**
   * Save current element state for undo/redo
   */
  private saveElementState(description: string): void {
    if (!this.activeElement) return;

    const state = {
      elementId: this.activeElement.id,
      description,
      position: {
        left: this.activeElement.style.left,
        top: this.activeElement.style.top
      },
      size: {
        width: this.activeElement.style.width,
        height: this.activeElement.style.height
      },
      innerHTML: this.activeElement.innerHTML
    };

    this.undoRedoService.push(state);
  }

  /**
   * Restore element state from undo/redo
   */
  private restoreElementState(state: any): void {
    if (!state || !state.elementId) return;

    const element = document.getElementById(state.elementId);
    if (!element) return;

    // Restore position
    if (state.position) {
      if (state.position.left) this.renderer.setStyle(element, 'left', state.position.left);
      if (state.position.top) this.renderer.setStyle(element, 'top', state.position.top);
    }

    // Restore size
    if (state.size) {
      if (state.size.width) this.renderer.setStyle(element, 'width', state.size.width);
      if (state.size.height) this.renderer.setStyle(element, 'height', state.size.height);
    }

    // Restore content if needed
    if (state.innerHTML) {
      this.renderer.setProperty(element, 'innerHTML', state.innerHTML);
    }
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

    // Hacer el elemento posicionable si no lo es, pero solo si es necesario
    const currentStyle = window.getComputedStyle(element);
    if (currentStyle.position === 'static') {
      this.renderer.setStyle(element, 'position', 'relative');
    }
    this.renderer.setStyle(element, 'box-sizing', 'border-box');

    // Click para seleccionar
    const clickListener = this.renderer.listen(element, 'click', (e: MouseEvent) => {
      if (!this.isEditMode) return;
      
      // PREVENT NAVIGATION / REFRESH
      e.preventDefault(); 
      e.stopPropagation();

      const elementId = element.id || element.getAttribute('id') || element.getAttribute('elementId');

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

    // Deseleccionar elemento anterior si es distinto, o limpiar overlay si es el mismo
    if (this.activeElement) {
      if (this.activeElement !== element) {
        this.deselectElement();
      } else {
        this.removeEditOverlay();
      }
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
    this.isDragging = false;

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

    // ROBUSTNESS REVOLUTION: The overlay now lives INSIDE the section's coordinate space.
    // This makes it immune to global translates, scales, or sticky jumps.
    const section = element.closest('.editor-section, header, .header, footer') as HTMLElement || document.body;
    const sectionRect = section.getBoundingClientRect();
    const scrollX = section.scrollLeft;
    const scrollY = section.scrollTop;

    // Crear contenedor del overlay 
    const overlay = this.renderer.createElement('div');
    this.renderer.addClass(overlay, 'visual-edit-overlay');
    
    // ABSOLUTE position relative to the section anchor
    this.renderer.setStyle(overlay, 'position', 'absolute');
    this.renderer.setStyle(overlay, 'pointer-events', 'none');
    this.renderer.setStyle(overlay, 'z-index', '10000');
    
    this.updateOverlayPosition(overlay, element);
    
    this.renderer.setAttribute(overlay, 'data-overlay', 'true');
    this.renderer.setAttribute(overlay, 'data-host-id', section.id);

    // Crear borde de selección
    const border = this.renderer.createElement('div');
    this.renderer.addClass(border, 'visual-selection-border');
    this.renderer.appendChild(overlay, border);

    // Crear label con dimensiones
    const label = this.renderer.createElement('div');
    this.renderer.addClass(label, 'visual-dimension-label');
    this.renderer.setProperty(label, 'textContent', `${Math.round(element.offsetWidth)} × ${Math.round(element.offsetHeight)}`);
    this.renderer.appendChild(overlay, label);

    // Crear handles de resize
    const canResize = config.enableResize && (this._interactionMode === 'resize' || this._interactionMode === 'all');
    if (canResize && config.handles) {
      this.createResizeHandles(overlay, config.handles);
    }

    // Añadir al host (Section) para estabilidad de coordenadas
    this.renderer.appendChild(section, overlay);

    // Setup drag
    if (config.enableDrag) {
      this.setupDrag(element, overlay, config);
    }

    // Setup resize
    if (config.enableResize) {
      this.setupResize(element, overlay, config);
    }

    // Sync overlay position with high frequency loop
    const syncLoop = () => {
      if (!overlay.isConnected) return; 
      this.updateOverlayPosition(overlay, element);
      requestAnimationFrame(syncLoop);
    };
    requestAnimationFrame(syncLoop);
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
    let ghost: HTMLElement | null = null;
    let ghostStartX = 0;
    let ghostStartY = 0;
    let hasCrossedThreshold = false; // flag for threshold

    const onMouseDown = (e: MouseEvent) => {
      // Check mode
      if (this._interactionMode !== 'move' && this._interactionMode !== 'all') return;

      // SHIELD: Prevent dragging whole sections (the main cause of 'disintegration')
      const el = element;
      const isHeaderFooter = el.tagName === 'HEADER' || el.tagName === 'FOOTER' || el.classList.contains('header') || el.classList.contains('footer') || el.id.includes('header') || el.id.includes('navbar');
      const isSection = el.classList.contains('editor-section') || el.classList.contains('hero-section') || el.classList.contains('testimonials-container') || el.classList.contains('pricing-container') || el.classList.contains('stats-container');
      
      // If it's a section, we strictly block drag to preserve document flow
      if (isHeaderFooter || isSection) {
           console.warn('🛡️ Drag blocked: Container elements must remain in flow.', element.id);
           this.renderer.setStyle(overlay, 'cursor', 'not-allowed');
           return;
      }
      
      // Don't drag if clicking buttons or inputs inside
      const target = e.target as HTMLElement;
      if (target.closest('button, input, a, select, textarea, .visual-resize-handle')) return;

      e.preventDefault();
      e.stopPropagation();

      // We DON'T set isDragging = true yet. Wait for threshold.
      hasCrossedThreshold = false;
      startX = e.clientX;
      startY = e.clientY;
      
      // But we DO need to listen for move/up now
    };

    // Boundaries for drag
    let minX = -Infinity;
    let minY = -Infinity;
    let maxX = Infinity;
    let maxY = Infinity;

    const startDrag = () => {
       this.isDragging = true;

       // Force parent to be relative to stabilize positioning context
       // This is the "robust" fix for "jumping to header"
       const parent = element.parentElement;
       if (parent && parent !== document.body) {
           const style = window.getComputedStyle(parent);
           if (style.position === 'static') {
               this.renderer.setStyle(parent, 'position', 'relative');
           }
       }

        // Create Ghost Element
        ghost = element.cloneNode(true) as HTMLElement;
        const rect = element.getBoundingClientRect();
        
        // Add coordinates label to ghost
        const posLabel = this.renderer.createElement('div');
        this.renderer.addClass(posLabel, 'visual-pos-label');
        this.renderer.setStyle(posLabel, 'position', 'absolute');
        this.renderer.setStyle(posLabel, 'bottom', '-30px');
        this.renderer.setStyle(posLabel, 'left', '50%');
        this.renderer.setStyle(posLabel, 'transform', 'translateX(-50%)');
        this.renderer.setStyle(posLabel, 'background', '#10b981');
        this.renderer.setStyle(posLabel, 'color', 'white');
        this.renderer.setStyle(posLabel, 'padding', '2px 8px');
        this.renderer.setStyle(posLabel, 'border-radius', '4px');
        this.renderer.setStyle(posLabel, 'font-size', '10px');
        this.renderer.setStyle(posLabel, 'white-space', 'nowrap');
        this.renderer.setStyle(posLabel, 'z-index', '10001');
        this.renderer.setProperty(posLabel, 'textContent', `X: ${Math.round(rect.left)} Y: ${Math.round(rect.top)}`);
        this.renderer.appendChild(ghost, posLabel);

        // Calculate boundaries 
        // We use GLOBAL coordinates for the ghost checks because ghost is fixed
        if (config.containment) {
           let containerEl: HTMLElement | null = null;
           
           if (typeof config.containment === 'string') {
               if (config.containment === 'parent' || config.containment === 'container') {
                  containerEl = element.parentElement;
               } else if (config.containment === 'viewport') {
                   minX = 0;
                   minY = 0;
                   maxX = window.innerWidth - rect.width;
                   maxY = window.innerHeight - rect.height;
               }
           } else if (config.containment instanceof ElementRef) {
               containerEl = config.containment.nativeElement;
           }

           if (containerEl) {
               const cRect = containerEl.getBoundingClientRect();
               minX = cRect.left;
               minY = cRect.top;
               // We ALLOW dragging down/right beyond container (unlimited)
               // This fixes "no se puede bajar nunca"
               maxX = Infinity; 
               maxY = Infinity;
           }
       } else {
           minX = -Infinity; minY = -Infinity; maxX = Infinity; maxY = Infinity;
       }

       // Style ghost to match exact screen position but fixed
       this.renderer.addClass(ghost, 'visual-ghost-drag');
       this.renderer.setStyle(ghost, 'position', 'fixed');
       this.renderer.setStyle(ghost, 'left', `${rect.left}px`);
       this.renderer.setStyle(ghost, 'top', `${rect.top}px`);
       this.renderer.setStyle(ghost, 'width', `${rect.width}px`);
       this.renderer.setStyle(ghost, 'height', `${rect.height}px`);
       this.renderer.setStyle(ghost, 'margin', '0');
       this.renderer.setStyle(ghost, 'z-index', '9999');
       this.renderer.setStyle(ghost, 'opacity', '0.85');
       this.renderer.setStyle(ghost, 'pointer-events', 'none');
       this.renderer.setStyle(ghost, 'box-shadow', '0 15px 30px rgba(0,0,0,0.3)');
       this.renderer.setStyle(ghost, 'transform', 'none');
       
       // Cleanup ghost directives/classes to avoid interference
       ghost.removeAttribute('data-visual-editable');
       ghost.classList.remove('visual-editable');
       ghost.classList.remove('visual-selected');

       this.renderer.appendChild(document.body, ghost);
       
       ghostStartX = rect.left;
       ghostStartY = rect.top;

       // Dim the original element
       this.renderer.setStyle(element, 'opacity', '0.3');
       
       // Hide overlay during drag
       this.renderer.setStyle(overlay, 'display', 'none');
    };

    const onMouseMove = (e: MouseEvent) => {
      // Check buttons to ensure drag state
      if ((e.buttons !== 1) && !this.isDragging) return;

      // START MODIFICATION: Threshold Logic
      if (!this.isDragging) {
         if (Math.abs(e.clientX - startX) > this.dragThreshold || Math.abs(e.clientY - startY) > this.dragThreshold) {
            if (this._interactionMode !== 'move' && this._interactionMode !== 'all') return;
            // threshold crossed
         } else {
            return; 
         }
      }
      
      if (!this.isDragging) {
         if (!hasCrossedThreshold && startX !== 0) {
            hasCrossedThreshold = true;
            startDrag();
         } else {
           return;
         }
      }
      
      if (!ghost) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newX = ghostStartX + deltaX;
      let newY = ghostStartY + deltaY;

      // Apply strict containment (GLOBAL coords)
      // Only min bounds are strictly enforced to prevent going above/left
      if (newX < minX) newX = minX;
      if (newY < minY) newY = minY;
      // Max bounds are unlimited (down/right) per user requirement

      // SNAPPING LOGIC
      if (this.snapToGrid) {
        newX = Math.round(newX / this.gridStep) * this.gridStep;
        newY = Math.round(newY / this.gridStep) * this.gridStep;
      }

      this.renderer.setStyle(ghost, 'left', `${newX}px`);
      this.renderer.setStyle(ghost, 'top', `${newY}px`);

      // Update position label
      const posLabel = ghost.querySelector('.visual-pos-label');
      if (posLabel) {
        posLabel.textContent = `X: ${Math.round(newX)} Y: ${Math.round(newY)}`;
      }
    };

    const cleanupGhost = () => {
      if (ghost && ghost.parentNode) {
        ghost.parentNode.removeChild(ghost);
      }
      ghost = null;
      // Aggressive cleanup of any stray ghosts
      const strays = document.querySelectorAll('.visual-ghost-drag');
      strays.forEach(stray => {
        if (stray.parentNode) stray.parentNode.removeChild(stray);
      });
    };

    const onMouseUp = () => {
      startX = 0; // Reset
      hasCrossedThreshold = false;

      if (this.isDragging && ghost) {
        this.isDragging = false;
        
        // Finalize position
        const ghostRect = ghost.getBoundingClientRect();
        
        // Find suitable anchor for coordinates
        // We prefer the section parent to keep things scoped
        const parent = element.closest('.editor-section, .editor-container') as HTMLElement || element.offsetParent as HTMLElement || document.body;
        const parentRect = parent.getBoundingClientRect();
        const computedParent = window.getComputedStyle(parent);
        const borderLeft = parseFloat(computedParent.borderLeftWidth) || 0;
        const borderTop = parseFloat(computedParent.borderTopWidth) || 0;

        // Calculate position relative to the anchor
        // We use viewport coordinates everywhere for the math to remain robust
        let newLeft = ghostRect.left - parentRect.left - borderLeft;
        let newTop = ghostRect.top - parentRect.top - borderTop;
        
        // If parent is scrolled, adjust accordingly
        newLeft += parent.scrollLeft;
        newTop += parent.scrollTop;

        // SMART POSITIONING: Service only emits the intent. 
        // We do NOT modify the actual element style here because it conflicts with Angular Change Detection
        // and causing "double jumps". The subscriber will handle persistence.
        
        // Restore opacity
        this.renderer.setStyle(element, 'opacity', '1');

        // Robust cleanup
        cleanupGhost();

        // Restore overlay
        this.renderer.setStyle(overlay, 'display', 'block');
        this.updateOverlayPosition(overlay, element);

        this.elementMoved$.next({
          element,
          bounds: { 
            x: Math.round(ghostRect.left),
            y: Math.round(ghostRect.top),
            width: Math.round(ghostRect.width), 
            height: Math.round(ghostRect.height) 
          }
        });
      } else {
        cleanupGhost();
        this.renderer.setStyle(element, 'opacity', '1');
        this.renderer.setStyle(overlay, 'display', 'block');
      }
    };

    // Attach drag to the element itself
    this.overlayListeners.push(this.renderer.listen(element, 'mousedown', onMouseDown));
    this.overlayListeners.push(this.renderer.listen(document, 'mousemove', onMouseMove));
    this.overlayListeners.push(this.renderer.listen(document, 'mouseup', onMouseUp));
    // Also listen to window blur or escape to cancel?
  }

  /**
   * Detecta alineaciones con otros elementos para snapping y guías
   */
  private detectAlignment(element: HTMLElement, currentLeft: number, currentTop: number): { x: number | null, y: number | null } {
    if (!this.showGuides) return { x: null, y: null };
    
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
      
      // If element is not positioned, left/top might be 'auto'.
      // We assume setupDrag/setupResize are called on elements that ARE positioning-capable or already positioned.
      // If position is static, this logic will fail. The visual editor generally forces absolute/relative.
      startStyleLeft = parseFloat(computedStyle.left);
      if (isNaN(startStyleLeft)) startStyleLeft = element.offsetLeft;

      startStyleTop = parseFloat(computedStyle.top);
      if (isNaN(startStyleTop)) startStyleTop = element.offsetTop;



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

      // Calculate raw new dimensions based on mouse movement
      let rawNewWidth = startWidth;
      let rawNewHeight = startHeight;
      
      const handle = this.resizeHandle || '';

      if (handle.includes('right')) {
         rawNewWidth = startWidth + deltaX;
      } else if (handle.includes('left')) {
         rawNewWidth = startWidth - deltaX;
      }

      if (handle.includes('bottom')) {
         rawNewHeight = startHeight + deltaY;
      } else if (handle.includes('top')) {
         rawNewHeight = startHeight - deltaY;
      }

      // Apply constraints to get FINAL dimensions first
      let finalWidth = rawNewWidth;
      let finalHeight = rawNewHeight;
      
      if (config.minWidth) finalWidth = Math.max(finalWidth, config.minWidth);
      if (config.maxWidth) finalWidth = Math.min(finalWidth, config.maxWidth);
      if (config.minHeight) finalHeight = Math.max(finalHeight, config.minHeight);
      if (config.maxHeight) finalHeight = Math.min(finalHeight, config.maxHeight);
      
      // Snap to grid (optional, applies to dimensions)
      if (config.grid && config.grid > 1) {
        finalWidth = Math.round(finalWidth / config.grid) * config.grid;
        finalHeight = Math.round(finalHeight / config.grid) * config.grid;
      }

      // Calculate effective delta (actual change after constraints)
      const effectiveWDelta = finalWidth - startWidth;
      const effectiveHDelta = finalHeight - startHeight;

      // Apply dimensions
      this.renderer.setStyle(element, 'width', `${finalWidth}px`);
      this.renderer.setStyle(element, 'height', `${finalHeight}px`);

      // Apply position compensation for Left/Top handles to anchor the opposite edge
      if (handle.includes('left')) {
          // 'effectiveWDelta' tells us exactly how much the width changed.
          // If width increased by 10px, left must decrease by 10px to keep right edge stable.
          // We use startStyleLeft (numeric value from element.style.left at start)
          const newLeft = startStyleLeft - effectiveWDelta;
          this.renderer.setStyle(element, 'left', `${newLeft}px`);
      }

      if (handle.includes('top')) {
          const newTop = startStyleTop - effectiveHDelta;
          this.renderer.setStyle(element, 'top', `${newTop}px`);
      }



      
       // Actualizar overlay
      requestAnimationFrame(() => {
        this.updateOverlayPosition(overlay, element);
      });
      this.updateDimensionLabel(overlay, finalWidth, finalHeight);
    };


    const onMouseUp = () => {
      if (this.isResizing) {
        this.isResizing = false;
        this.resizeHandle = null;
        const rect = element.getBoundingClientRect();
        this.elementResized$.next({
          element,
          bounds: {
            x: element.offsetLeft,
            y: element.offsetTop,
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
    if (!element || !overlay) return;
    
    const section = overlay.parentElement || document.body;
    const sRect = section.getBoundingClientRect();
    const eRect = element.getBoundingClientRect();
    
    // MATH: Element Viewport - Section Viewport = Element Relative to Section
    // We add section scroll in case the section itself is scrollable (rare but possible)
    const top = (eRect.top - sRect.top) + section.scrollTop;
    const left = (eRect.left - sRect.left) + section.scrollLeft;

    this.renderer.setStyle(overlay, 'top', `${top}px`);
    this.renderer.setStyle(overlay, 'left', `${left}px`);
    this.renderer.setStyle(overlay, 'width', `${eRect.width}px`);
    this.renderer.setStyle(overlay, 'height', `${eRect.height}px`);

    // Update dimensions label
    const label = overlay.querySelector('.visual-dimension-label');
    if (label) {
      label.textContent = `${Math.round(eRect.width)} × ${Math.round(eRect.height)}`;
    }
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

    const overlays = document.querySelectorAll('[data-overlay="true"]');
    overlays.forEach(overlay => {
      const parent = overlay.parentNode;
      if (parent) {
        this.renderer.removeChild(parent, overlay);
      }
    });
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
      /* Removed restrictive width: fit-content that broke layouts */
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
      
      /* Mode specific cursor overides */
      body.mode-move .visual-editable {
        cursor: move !important;
      }
      body.mode-resize .visual-editable {
        cursor: default; /* Select only */
      }
      body.mode-resize .visual-resize-handle {
        cursor: pointer; /* Or specific resize cursor */
        background: #6366f1; /* Highlight handles in resize mode */
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
        z-index: 10001;
      }

      .visual-pos-label {
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        font-family: 'Courier New', monospace;
        font-weight: 700;
      }

      .visual-resize-handle {
        position: absolute;
        background: white;
        border: 2px solid #6366f1;
        border-radius: 50%;
        width: 14px;
        height: 14px;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        z-index: 10002;
      }

      .visual-resize-handle:hover {
        transform: scale(1.3);
        background: #6366f1;
        border-color: white;
      }

      .visual-ghost-drag {
        filter: drop-shadow(0 20px 40px rgba(0,0,0,0.4));
        transition: opacity 0.2s ease;
      }

      .marquee-selection {
        border-radius: 4px;
        backdrop-filter: blur(2px);
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
        box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.2);
      }

      .visual-selected {
        outline: 3px solid #3b82f6 !important;
        outline-offset: 4px !important;
        box-shadow: 0 0 30px rgba(59, 130, 246, 0.6) !important;
        z-index: 10000 !important;
        overflow: visible !important;
      }

      /* GLOBAL ROBUSTNESS: Sections must stay in relative flow by default */
      .builder-shell .frame-content .editor-section {
        position: relative !important;
        box-sizing: border-box !important;
        min-height: 50px !important;
        transform: none !important;
        transition: none !important;
      }

      /* STICKY LOCK: Only for canvas content to avoid breaking the editor shell controls */
      .builder-shell .frame-content header, 
      .builder-shell .frame-content .header, 
      .builder-shell .frame-content .navbar,
      .builder-shell .frame-content [id*="navbar"] {
        position: sticky !important;
        top: 0 !important;
        z-index: 100 !important;
        transform: none !important;
        left: 0 !important;
        width: 100% !important;
      }

      .has-floating-children {
        min-height: 600px !important;
      }

      [style*="background"] {
         overflow: visible !important;
      }
      
      .visual-edit-overlay {
         pointer-events: none !important;
      }
      .visual-resize-handle {
         pointer-events: all !important;
         z-index: 10001 !important;
      }
    `);

    this.renderer.appendChild(document.head, style);
  }

  private updateGlobalCursor() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    document.body.classList.remove('mode-move', 'mode-resize', 'mode-select');
    if (this._interactionMode !== 'all') {
      document.body.classList.add(`mode-${this._interactionMode}`);
    }
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

  // === ISOLATED MODE SUPPORT ===
  
  /**
   * Observable for isolated mode events
   */
  public isolatedModeEntered$ = new Subject<{ mode: string; section: any }>();
  public isolatedModeExited$ = new Subject<any>();
  
  /**
   * Enter isolated mode for a specific section type
   */
  enterIsolatedMode(mode: string, section: any) {
    console.log('🎯 VisualEditorService: Entering isolated mode:', mode);
    this.isolatedModeEntered$.next({ mode, section });
    
    // Disable edit mode while in isolated mode
    if (this.isEditMode) {
      this.disableEditMode();
    }
  }
  
  /**
   * Exit isolated mode
   */
  exitIsolatedMode(result?: any) {
    console.log('🔄 VisualEditorService: Exiting isolated mode', result);
    this.isolatedModeExited$.next(result);
    
    // Re-enable edit mode
    this.enableEditMode();
  }

  /**
   * Updates overlay position to match element
   */


  /**
   * Limpieza al destruir el servicio
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.disableEditMode();
  }
}
