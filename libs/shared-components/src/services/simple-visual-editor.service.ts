import { Injectable, Renderer2, RendererFactory2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';

export interface SimpleEditableElement {
  id: string;
  element: HTMLElement;
  bounds: DOMRect;
}

export interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  // Local coordinates for element style
  elementStartLocalX: number;
  elementStartLocalY: number;
  // Global coordinates for selection box
  elementStartGlobalX: number;
  elementStartGlobalY: number;
  // Containment
  minX: number;
  inputMaxX: number; // Renamed to avoid confusion
  minY: number;
  inputMaxY: number;
}


export interface ResizeState {
  isResizing: boolean;
  handle: string;
  startX: number;
  startY: number;
  elementStartWidth: number;
  elementStartHeight: number;
  // Local coordinates (style.left/top values)
  elementStartLocalX: number;
  elementStartLocalY: number;
}

@Injectable({
  providedIn: 'root'
})
export class SimpleVisualEditorService {
  private renderer: Renderer2;
  private selectedElement: HTMLElement | null = null;
  private selectionBox: HTMLElement | null = null;
  private resizeHandles: HTMLElement[] = [];
  
  private dragState: DragState = {
    isDragging: false,
    startX: 0,
    startY: 0,
    elementStartLocalX: 0,
    elementStartLocalY: 0,
    elementStartGlobalX: 0,
    elementStartGlobalY: 0,
    minX: -Infinity,
    inputMaxX: Infinity,
    minY: -Infinity,
    inputMaxY: Infinity
  };

  private resizeState: ResizeState = {
    isResizing: false,
    handle: '',
    startX: 0,
    startY: 0,
    elementStartWidth: 0,
    elementStartHeight: 0,
    elementStartLocalX: 0,
    elementStartLocalY: 0
  };

  public elementSelected$ = new Subject<SimpleEditableElement>();
  public elementMoved$ = new Subject<SimpleEditableElement>();
  public elementResized$ = new Subject<SimpleEditableElement>();

  private mode: 'all' | 'move' | 'resize' = 'all';
  private globalListeners: Function[] = [];

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  setMode(mode: 'all' | 'move' | 'resize') {
    this.mode = mode;
    console.log(`📐 Mode changed to: ${mode}`);
    
    // Update handles visibility
    if (this.selectedElement) {
      this.updateHandlesVisibility();
    }
  }

  getMode(): 'all' | 'move' | 'resize' {
    return this.mode;
  }

  enableEditMode() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    console.log('🎨 Simple Visual Editor: ENABLED');
    
    // Add global styles
    this.addGlobalStyles();
    
    // Scan for editable elements
    setTimeout(() => {
      this.scanEditableElements();
    }, 200);
  }

  private addGlobalStyles() {
    const styleId = 'simple-visual-editor-styles';
    if (document.getElementById(styleId)) return;

    const style = this.renderer.createElement('style');
    this.renderer.setAttribute(style, 'id', styleId);
    this.renderer.setProperty(style, 'textContent', `
      .simple-editable {
        cursor: pointer !important;
        transition: outline 0.2s;
      }
      
      .simple-editable:hover {
        outline: 2px dashed rgba(59, 130, 246, 0.5) !important;
        outline-offset: 2px;
      }
      
      .simple-selected {
        outline: 2px solid rgb(59, 130, 246) !important;
        outline-offset: 2px;
      }
      
      .simple-selection-box {
        position: fixed;
        border: 2px solid rgb(59, 130, 246);
        background: rgba(59, 130, 246, 0.1);
        pointer-events: none;
        z-index: 9998;
      }
      
      .simple-resize-handle {
        position: absolute;
        width: 12px;
        height: 12px;
        background: white;
        border: 2px solid rgb(59, 130, 246);
        border-radius: 50%;
        z-index: 9999;
        cursor: pointer;
        pointer-events: auto;
      }
      
      .simple-resize-handle.nw { top: -6px; left: -6px; cursor: nw-resize; }
      .simple-resize-handle.n  { top: -6px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
      .simple-resize-handle.ne { top: -6px; right: -6px; cursor: ne-resize; }
      .simple-resize-handle.e  { top: 50%; right: -6px; transform: translateY(-50%); cursor: e-resize; }
      .simple-resize-handle.se { bottom: -6px; right: -6px; cursor: se-resize; }
      .simple-resize-handle.s  { bottom: -6px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
      .simple-resize-handle.sw { bottom: -6px; left: -6px; cursor: sw-resize; }
      .simple-resize-handle.w  { top: 50%; left: -6px; transform: translateY(-50%); cursor: w-resize; }
    `);
    
    this.renderer.appendChild(document.head, style);
  }

  private scanEditableElements() {
    const elements = document.querySelectorAll('[data-visual-editable]');
    console.log(`🔍 Found ${elements.length} editable elements`);
    
    elements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      this.renderer.addClass(htmlEl, 'simple-editable');
      
      // Add click listener
      const listener = this.renderer.listen(htmlEl, 'click', (e: MouseEvent) => {
        e.stopPropagation();
        this.selectElement(htmlEl);
      });
      
      this.globalListeners.push(listener);
    });
  }

  selectElement(element: HTMLElement) {
    console.log('✅ Element selected:', element.id);
    
    // Deselect previous
    if (this.selectedElement) {
      this.renderer.removeClass(this.selectedElement, 'simple-selected');
    }
    
    // Select new
    this.selectedElement = element;
    this.renderer.addClass(element, 'simple-selected');
    
    // Create selection box and handles
    this.createSelectionBox();
    this.createResizeHandles();
    this.attachDragListeners();
    
    // Emit event
    const bounds = element.getBoundingClientRect();
    this.elementSelected$.next({
      id: element.id,
      element,
      bounds
    });
  }

  private createSelectionBox() {
    // Remove old box
    if (this.selectionBox) {
      this.renderer.removeChild(document.body, this.selectionBox);
    }
    
    if (!this.selectedElement) return;
    
    const bounds = this.selectedElement.getBoundingClientRect();
    this.selectionBox = this.renderer.createElement('div');
    this.renderer.addClass(this.selectionBox, 'simple-selection-box');
    // With position: fixed, use viewport coordinates directly
    this.renderer.setStyle(this.selectionBox, 'left', `${bounds.left}px`);
    this.renderer.setStyle(this.selectionBox, 'top', `${bounds.top}px`);
    this.renderer.setStyle(this.selectionBox, 'width', `${bounds.width}px`);
    this.renderer.setStyle(this.selectionBox, 'height', `${bounds.height}px`);
    
    this.renderer.appendChild(document.body, this.selectionBox);
  }

  private createResizeHandles() {
    // Remove old handles
    this.resizeHandles.forEach(handle => {
      this.renderer.removeChild(document.body, handle);
    });
    this.resizeHandles = [];
    
    if (!this.selectedElement || !this.selectionBox) return;
    
    const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
    
    handles.forEach(position => {
      const handle = this.renderer.createElement('div');
      this.renderer.addClass(handle, 'simple-resize-handle');
      this.renderer.addClass(handle, position);
      this.renderer.setAttribute(handle, 'data-handle', position);
      
      // Add resize listener
      const listener = this.renderer.listen(handle, 'mousedown', (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        this.startResize(e, position);
      });
      
      this.renderer.appendChild(this.selectionBox, handle);
      this.resizeHandles.push(handle);
      this.globalListeners.push(listener);
    });
    
    this.updateHandlesVisibility();
  }

  private updateHandlesVisibility() {
    const showHandles = this.mode === 'all' || this.mode === 'resize';
    
    this.resizeHandles.forEach(handle => {
      this.renderer.setStyle(handle, 'display', showHandles ? 'block' : 'none');
    });
  }

  private attachDragListeners() {
    if (!this.selectedElement || !this.selectionBox) return;
    
    const canDrag = this.mode === 'all' || this.mode === 'move';
    if (!canDrag) return;
    
    const listener = this.renderer.listen(this.selectedElement, 'mousedown', (e: MouseEvent) => {
      // Don't drag if clicking on a resize handle
      if ((e.target as HTMLElement).classList.contains('simple-resize-handle')) {
        return;
      }
      
      e.stopPropagation();
      e.preventDefault();
      this.startDrag(e);
    });
    
    this.globalListeners.push(listener);
  }

  private startDrag(e: MouseEvent) {
    if (!this.selectedElement) return;
    
    const bounds = this.selectedElement.getBoundingClientRect();
    // containment
    
    // Identify containment parent - Use direct parent for most reliable local positioning
    let containmentParent = this.selectedElement.parentElement;
    
    // Force the containment parent to be the positioning context (offsetParent)
    if (containmentParent && containmentParent !== document.body) {
       const style = window.getComputedStyle(containmentParent);
       if (style.position === 'static') {
         this.renderer.setStyle(containmentParent, 'position', 'relative');
       }
    }
    
    // Refresh offsetParent after potential style change
    const container = (this.selectedElement.offsetParent as HTMLElement) || this.selectedElement.parentElement || document.body;
    
    // Calculate correct local position
    let startLocalX = 0;
    let startLocalY = 0;
    
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const containerStyle = window.getComputedStyle(container);
      const borderLeft = parseFloat(containerStyle.borderLeftWidth) || 0;
      const borderTop = parseFloat(containerStyle.borderTopWidth) || 0;
      
      let scrollTop = container.scrollTop;
      let scrollLeft = container.scrollLeft;
      
      if (container === document.body || container === document.documentElement) {
         scrollTop = window.scrollY || document.documentElement.scrollTop;
         scrollLeft = window.scrollX || document.documentElement.scrollLeft;
      }

      startLocalX = bounds.left - containerRect.left - borderLeft + scrollLeft;
      startLocalY = bounds.top - containerRect.top - borderTop + scrollTop;
    } else {
      startLocalX = bounds.left;
      startLocalY = bounds.top;
    }
    
    // Containment: Block moving above/left of container, but allow unlimited bottom/right
    // This allows the user to move "down" freely without hitting an artificial max height constraint.
    let minX = 0;
    let inputMaxX = Infinity;
    let minY = 0;
    let inputMaxY = Infinity;

    if (container && container !== document.body) {
         // If container is body, allow negative (off canvas)? No, restrict to viewport.
         // Stick to simple 0 min.
    } else {
         minX = 0;
         minY = 0;
    }

    this.dragState = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      elementStartLocalX: startLocalX,
      elementStartLocalY: startLocalY,
      elementStartGlobalX: bounds.left + window.scrollX,
      elementStartGlobalY: bounds.top + window.scrollY,
      minX,
      inputMaxX,
      minY,
      inputMaxY
    };
    
    console.log('🖱️ Drag started', this.dragState);
    
    // Add global mouse listeners
    const moveListener = this.renderer.listen('document', 'mousemove', (e: MouseEvent) => {
      this.onDragMove(e);
    });
    
    const upListener = this.renderer.listen('document', 'mouseup', () => {
      this.endDrag();
      moveListener();
      upListener();
    });
  }

  private onDragMove(e: MouseEvent) {
    if (!this.dragState.isDragging || !this.selectedElement) return;
    
    const deltaX = e.clientX - this.dragState.startX;
    const deltaY = e.clientY - this.dragState.startY;
    
    let newLocalX = this.dragState.elementStartLocalX + deltaX;
    let newLocalY = this.dragState.elementStartLocalY + deltaY;
    
    // Check containment (local coords)
    if (newLocalX < this.dragState.minX) newLocalX = this.dragState.minX;
    if (newLocalX > this.dragState.inputMaxX) newLocalX = this.dragState.inputMaxX;
    
    if (newLocalY < this.dragState.minY) newLocalY = this.dragState.minY;
    if (newLocalY > this.dragState.inputMaxY) newLocalY = this.dragState.inputMaxY;
    
    // Update element position (Local)
    this.renderer.setStyle(this.selectedElement, 'position', 'absolute');
    this.renderer.setStyle(this.selectedElement, 'left', `${newLocalX}px`);
    this.renderer.setStyle(this.selectedElement, 'top', `${newLocalY}px`);
    
    // Update selection box using element's new viewport position
    if (this.selectionBox) {
      const rect = this.selectedElement.getBoundingClientRect();
      this.renderer.setStyle(this.selectionBox, 'left', `${rect.left}px`);
      this.renderer.setStyle(this.selectionBox, 'top', `${rect.top}px`);
    }
  }

  private endDrag() {
    if (!this.dragState.isDragging || !this.selectedElement) return;
    
    console.log('🖱️ Drag ended');
    this.dragState.isDragging = false;
    
    const bounds = this.selectedElement.getBoundingClientRect();
    this.elementMoved$.next({
      id: this.selectedElement.id,
      element: this.selectedElement,
      bounds
    });
  }

  private startResize(e: MouseEvent, handle: string) {
    if (!this.selectedElement) return;
    
    const bounds = this.selectedElement.getBoundingClientRect();
    // Use offsetParent as the reference for absolute positioning
    const container = (this.selectedElement.offsetParent as HTMLElement) || this.selectedElement.parentElement || document.body;
    
    // Calculate correct local position using bounding rects
    // This works regardless of the element's current positioning scheme
    let startLocalX = 0;
    let startLocalY = 0;
    
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const containerStyle = window.getComputedStyle(container);
      const borderLeft = parseFloat(containerStyle.borderLeftWidth) || 0;
      const borderTop = parseFloat(containerStyle.borderTopWidth) || 0;
      
      startLocalX = bounds.left - containerRect.left - borderLeft + container.scrollLeft;
      startLocalY = bounds.top - containerRect.top - borderTop + container.scrollTop;
    } else {
      startLocalX = bounds.left;
      startLocalY = bounds.top;
    }
    
    this.resizeState = {
      isResizing: true,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      elementStartWidth: bounds.width,
      elementStartHeight: bounds.height,
      elementStartLocalX: startLocalX,
      elementStartLocalY: startLocalY
    };
    
    console.log(`📏 Resize started (${handle})`, this.resizeState);
    
    // Add global mouse listeners
    const moveListener = this.renderer.listen('document', 'mousemove', (e: MouseEvent) => {
      this.onResizeMove(e);
    });
    
    const upListener = this.renderer.listen('document', 'mouseup', () => {
      this.endResize();
      moveListener();
      upListener();
    });
  }

  private onResizeMove(e: MouseEvent) {
    if (!this.resizeState.isResizing || !this.selectedElement) return;
    
    const deltaX = e.clientX - this.resizeState.startX;
    const deltaY = e.clientY - this.resizeState.startY;
    
    let newWidth = this.resizeState.elementStartWidth;
    let newHeight = this.resizeState.elementStartHeight;
    let newLocalX = this.resizeState.elementStartLocalX;
    let newLocalY = this.resizeState.elementStartLocalY;
    
    const handle = this.resizeState.handle;
    
    // Calculate new dimensions based on handle
    if (handle.includes('e')) {
      newWidth = this.resizeState.elementStartWidth + deltaX;
    }
    if (handle.includes('w')) {
      newWidth = this.resizeState.elementStartWidth - deltaX;
      newLocalX = this.resizeState.elementStartLocalX + deltaX;
    }
    if (handle.includes('s')) {
      newHeight = this.resizeState.elementStartHeight + deltaY;
    }
    if (handle.includes('n')) {
      newHeight = this.resizeState.elementStartHeight - deltaY;
      newLocalY = this.resizeState.elementStartLocalY + deltaY;
    }
    
    // Apply minimum size
    newWidth = Math.max(50, newWidth);
    newHeight = Math.max(50, newHeight);
    
    // Update element dimensions
    this.renderer.setStyle(this.selectedElement, 'width', `${newWidth}px`);
    this.renderer.setStyle(this.selectedElement, 'height', `${newHeight}px`);
    
    // Update position for west/north handles (using LOCAL coordinates)
    if (handle.includes('w') || handle.includes('n')) {
      this.renderer.setStyle(this.selectedElement, 'position', 'absolute');
      this.renderer.setStyle(this.selectedElement, 'left', `${newLocalX}px`);
      this.renderer.setStyle(this.selectedElement, 'top', `${newLocalY}px`);
    }
    
    // Update selection box using viewport coordinates (position: fixed)
    if (this.selectionBox) {
      const rect = this.selectedElement.getBoundingClientRect();
      this.renderer.setStyle(this.selectionBox, 'width', `${rect.width}px`);
      this.renderer.setStyle(this.selectionBox, 'height', `${rect.height}px`);
      this.renderer.setStyle(this.selectionBox, 'left', `${rect.left}px`);
      this.renderer.setStyle(this.selectionBox, 'top', `${rect.top}px`);
    }
  }

  private endResize() {
    if (!this.resizeState.isResizing || !this.selectedElement) return;
    
    console.log('📏 Resize ended');
    this.resizeState.isResizing = false;
    
    const bounds = this.selectedElement.getBoundingClientRect();
    this.elementResized$.next({
      id: this.selectedElement.id,
      element: this.selectedElement,
      bounds
    });
  }

  deselect() {
    if (this.selectedElement) {
      this.renderer.removeClass(this.selectedElement, 'simple-selected');
      this.selectedElement = null;
    }
    
    if (this.selectionBox) {
      this.renderer.removeChild(document.body, this.selectionBox);
      this.selectionBox = null;
    }
    
    this.resizeHandles.forEach(handle => {
      this.renderer.removeChild(document.body, handle);
    });
    this.resizeHandles = [];
  }

  destroy() {
    this.deselect();
    this.globalListeners.forEach(listener => listener());
    this.globalListeners = [];
  }
}
