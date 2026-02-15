import { Directive, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { IsolatedModeConfig } from './enhanced-visual-editing.interfaces';

/**
 * Undo/Redo State Interface
 */
export interface UndoRedoState {
  position: { x: number; y: number };
  size: { width: number; height: number };
  styles: any;
  content: any;
}

/**
 * Base Isolated Mode Component
 * 
 * This abstract class provides the foundation for all isolated mode components.
 * It includes:
 * - Undo/Redo functionality
 * - Drag & Resize capabilities
 * - Grid snapping
 * - Keyboard shortcuts
 * - State management
 * 
 * Usage:
 * 1. Extend this class
 * 2. Implement initializeState() to set up component-specific state
 * 3. Implement getCanvasElement() to return the canvas HTMLElement
 * 4. Override apply() if custom output format is needed
 */
@Directive()
export abstract class BaseIsolatedModeComponent implements OnInit, OnDestroy {
  // Inputs/Outputs
  @Input() config!: IsolatedModeConfig;
  @Output() closed = new EventEmitter<void>();
  @Output() applied = new EventEmitter<IsolatedModeConfig>();

  // Content & Styles State
  editableContent: any = {};
  editableStyles: any = {};

  // Position & Size State
  currentPosition = { x: 0, y: 0 };
  currentSize = { width: 0, height: 0 };
  initialPosition = { x: 0, y: 0 };
  initialSize = { width: 0, height: 0 };

  // Grid Settings
  showGrid = true;
  snapToGrid = true;
  gridSize = 20;

  // Viewport Settings
  viewportScale = 1;

  // Interaction State
  isDragging = false;
  isResizing = false;
  resizeHandle: string | null = null;
  
  dragStartX = 0;
  dragStartY = 0;
  startPositionX = 0;
  startPositionY = 0;
  startSizeWidth = 0;
  startSizeHeight = 0;

  // Undo/Redo Stack
  undoStack: UndoRedoState[] = [];
  redoStack: UndoRedoState[] = [];

  // Active Tab (for components with tabs)
  activeTab: 'content' | 'style' = 'content';

  protected destroy$ = new Subject<void>();

  // Computed properties
  get canUndo() { return this.undoStack.length > 1; }
  get canRedo() { return this.redoStack.length > 0; }

  // =========================================================================
  // Lifecycle Hooks
  // =========================================================================

  ngOnInit() {
    this.initializeState();
    this.setupViewport();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =========================================================================
  // Abstract Methods (must be implemented by child classes)
  // =========================================================================

  /**
   * Initialize component-specific state
   * Called in ngOnInit
   */
  protected abstract initializeState(): void;

  /**
   * Return the canvas element for scrolling and interactions
   */
  protected abstract getCanvasElement(): HTMLElement | null;

  // =========================================================================
  // Viewport Setup
  // =========================================================================

  protected setupViewport() {
    setTimeout(() => this.scrollToComponent(), 100);
  }

  protected scrollToComponent() {
    const canvas = this.getCanvasElement();
    if (!canvas) return;

    const x = this.currentPosition.x + (this.currentSize.width / 2) - (canvas.clientWidth / 2);
    const y = this.currentPosition.y + (this.currentSize.height / 2) - (canvas.clientHeight / 2);

    canvas.scrollTo({
      left: x,
      top: y,
      behavior: 'smooth'
    });
  }

  // =========================================================================
  // Undo/Redo System
  // =========================================================================

  private saveTimeout: any;

  saveState() {
    const newState: UndoRedoState = {
      position: { ...this.currentPosition },
      size: { ...this.currentSize },
      styles: JSON.parse(JSON.stringify(this.editableStyles)),
      content: JSON.parse(JSON.stringify(this.editableContent))
    };

    // Only save if different from last
    const lastState = this.undoStack[this.undoStack.length - 1];
    if (lastState && JSON.stringify(lastState) === JSON.stringify(newState)) return;

    this.undoStack.push(newState);
    if (this.undoStack.length > 50) this.undoStack.shift();
    this.redoStack = [];
  }

  scheduleSaveState(delay = 500) {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => this.saveState(), delay);
  }

  undo() {
    if (this.undoStack.length <= 1) return;
    const currentState = this.undoStack.pop()!;
    this.redoStack.push(currentState);
    this.applyState(this.undoStack[this.undoStack.length - 1]);
  }

  redo() {
    if (this.redoStack.length === 0) return;
    const next = this.redoStack.pop()!;
    this.undoStack.push(next);
    this.applyState(next);
  }

  private applyState(state: UndoRedoState) {
    this.currentPosition = { ...state.position };
    this.currentSize = { ...state.size };
    this.editableStyles = JSON.parse(JSON.stringify(state.styles));
    this.editableContent = JSON.parse(JSON.stringify(state.content));
  }

  // =========================================================================
  // Helper Methods
  // =========================================================================

  protected extractBorderColor(border: string, fallback = '#10b981'): string {
    if (!border) return fallback;
    const match = border.match(/solid\s+(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\))/);
    return match ? match[1] : fallback;
  }

  protected extractBorderWidth(border: string, fallback = 2): number {
    if (!border) return fallback;
    const match = border.match(/(\d+)px/);
    return match ? parseInt(match[1]) : fallback;
  }

  formatVariantName(variant: string): string {
    if (!variant) return '';
    return variant
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // =========================================================================
  // Change Handlers
  // =========================================================================

  onPositionChange() { this.scheduleSaveState(); }
  onSizeChange() { this.scheduleSaveState(); }
  onStyleChange() { this.scheduleSaveState(); }
  onContentChange() { this.scheduleSaveState(); }
  onVariantChange() { this.scheduleSaveState(); }
  onPartialChange() { this.scheduleSaveState(); }

  // =========================================================================
  // Mouse Interaction Handlers
  // =========================================================================

  onMouseDown(event: MouseEvent) {
    if (this.isResizing) return;
    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.startPositionX = this.currentPosition.x;
    this.startPositionY = this.currentPosition.y;
    event.stopPropagation();
  }

  onCanvasMouseDown(event: MouseEvent) {
    // Default implementation - can be overridden by child components
  }

  startResize(event: MouseEvent, handle: string) {
    this.isResizing = true;
    this.resizeHandle = handle;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.startPositionX = this.currentPosition.x;
    this.startPositionY = this.currentPosition.y;
    this.startSizeWidth = this.currentSize.width;
    this.startSizeHeight = this.currentSize.height;
    event.stopPropagation();
    event.preventDefault();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const dx = (event.clientX - this.dragStartX) / this.viewportScale;
      const dy = (event.clientY - this.dragStartY) / this.viewportScale;
      
      let newX = this.startPositionX + dx;
      let newY = this.startPositionY + dy;

      if (this.snapToGrid) {
        newX = Math.round(newX / this.gridSize) * this.gridSize;
        newY = Math.round(newY / this.gridSize) * this.gridSize;
      }

      this.currentPosition.x = newX;
      this.currentPosition.y = newY;
    } 
    else if (this.isResizing && this.resizeHandle) {
      const dx = (event.clientX - this.dragStartX) / this.viewportScale;
      const dy = (event.clientY - this.dragStartY) / this.viewportScale;
      
      this.handleResize(dx, dy);
    }
  }

  private handleResize(dx: number, dy: number) {
    const minSize = 20;
    let newWidth = this.startSizeWidth;
    let newHeight = this.startSizeHeight;
    let newX = this.startPositionX;
    let newY = this.startPositionY;

    if (this.resizeHandle?.includes('e')) newWidth = Math.max(minSize, this.startSizeWidth + dx);
    if (this.resizeHandle?.includes('s')) newHeight = Math.max(minSize, this.startSizeHeight + dy);
    
    if (this.resizeHandle?.includes('w')) {
      const possibleWidth = this.startSizeWidth - dx;
      if (possibleWidth > minSize) {
        newWidth = possibleWidth;
        newX = this.startPositionX + dx;
      }
    }
    
    if (this.resizeHandle?.includes('n')) {
      const possibleHeight = this.startSizeHeight - dy;
      if (possibleHeight > minSize) {
        newHeight = possibleHeight;
        newY = this.startPositionY + dy;
      }
    }

    if (this.snapToGrid) {
      this.currentSize.width = Math.round(newWidth / this.gridSize) * this.gridSize;
      this.currentSize.height = Math.round(newHeight / this.gridSize) * this.gridSize;
      this.currentPosition.x = Math.round(newX / this.gridSize) * this.gridSize;
      this.currentPosition.y = Math.round(newY / this.gridSize) * this.gridSize;
    } else {
      this.currentSize.width = newWidth;
      this.currentSize.height = newHeight;
      this.currentPosition.x = newX;
      this.currentPosition.y = newY;
    }
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    if (this.isDragging || this.isResizing) {
      this.saveState();
    }
    this.isDragging = false;
    this.isResizing = false;
    this.resizeHandle = null;
  }

  // =========================================================================
  // Keyboard Shortcuts
  // =========================================================================

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // Don't handle shortcuts when typing in inputs
    if ((event.target as HTMLElement).tagName === 'INPUT' || 
        (event.target as HTMLElement).tagName === 'TEXTAREA' ||
        (event.target as HTMLElement).tagName === 'SELECT') {
      return;
    }

    // Ctrl/Cmd shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 'z':
          event.preventDefault();
          if (event.shiftKey) {
            this.redo();
          } else {
            this.undo();
          }
          break;
        case 'y':
          event.preventDefault();
          this.redo();
          break;
        case 's':
          event.preventDefault();
          this.apply();
          break;
      }
    } else {
      // Regular shortcuts
      switch (event.key) {
        case 'g':
        case 'G':
          this.toggleGrid();
          break;
        case 's':
        case 'S':
          this.toggleSnap();
          break;
        case 'r':
        case 'R':
          this.resetPosition();
          break;
        case 'Escape':
          this.close();
          break;
        case 'ArrowLeft':
          this.moveFino(-1, 0, event.shiftKey);
          break;
        case 'ArrowRight':
          this.moveFino(1, 0, event.shiftKey);
          break;
        case 'ArrowUp':
          this.moveFino(0, -1, event.shiftKey);
          break;
        case 'ArrowDown':
          this.moveFino(0, 1, event.shiftKey);
          break;
      }
    }
  }

  moveFino(dx: number, dy: number, shift: boolean) {
    const step = shift ? 10 : 1;
    this.currentPosition.x += dx * step;
    this.currentPosition.y += dy * step;
    this.saveState();
  }

  // =========================================================================
  // Toggle Actions
  // =========================================================================

  toggleGrid() { 
    this.showGrid = !this.showGrid; 
  }

  toggleSnap() { 
    this.snapToGrid = !this.snapToGrid; 
  }

  toggleDarkMode() {
    this.editableContent.dark = !this.editableContent.dark;
    this.onContentChange();
  }
  
  resetPosition() {
    this.currentPosition = { ...this.initialPosition };
    this.currentSize = { ...this.initialSize };
    this.saveState();
  }

  // =========================================================================
  // Actions
  // =========================================================================

  apply() {
    const finalConfig: IsolatedModeConfig = {
      ...this.config,
      content: { ...this.editableContent },
      styles: { 
        ...this.editableStyles,
        width: this.currentSize.width + 'px',
        height: this.currentSize.height + 'px',
        position: 'absolute',
        left: this.currentPosition.x + 'px',
        top: this.currentPosition.y + 'px'
      },
      position: { ...this.currentPosition },
      size: { ...this.currentSize }
    };
    this.applied.emit(finalConfig);
  }

  cancel() { 
    this.closed.emit(); 
  }

  close() { 
    this.closed.emit(); 
  }

  onOverlayClick(event: MouseEvent) { 
    this.cancel(); 
  }
}
