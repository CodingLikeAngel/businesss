/**
 * BaseIsolatedModeComponent
 * 
 * Abstract base class for ALL isolated-mode editors.
 * Provides unified drag, 8-point resize, undo/redo, grid/snap, keyboard shortcuts,
 * viewport scaling, and position dock — everything a rich editing mode needs.
 * 
 * Concrete implementations only need to:
 *   1. Define their template (sidebar controls + canvas component)
 *   2. Override getDefaultSize(), getDefaultPosition() if needed
 *   3. Override initializeContent() and initializeStyles()
 *   4. Override buildApplyPayload() to return the final IsolatedModeConfig
 */

import {
  Component, Input, Output, EventEmitter, 
  OnInit, OnDestroy, HostListener,
  ViewChild, ElementRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { IsolatedModeConfig } from './enhanced-visual-editing.interfaces';

// ========== SHARED TYPES ==========

export type ResizeHandleType = 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se';

export interface UndoRedoSnapshot {
  position: { x: number; y: number };
  size: { width: number; height: number };
  styles: Record<string, any>;
  content: Record<string, any>;
}

// ========== SHARED CSS (as const for inline usage) ==========

export const ISOLATED_MODE_SHARED_STYLES = `
  /* ===== SHARED ISOLATED MODE STYLES ===== */

  :host {
    --iso-primary: #6366f1;
    --iso-primary-glow: rgba(99, 102, 241, 0.4);
    --iso-bg-darker: #020617;
    --iso-bg-surface: #0f172a;
    --iso-bg-header: #1e293b;
    --iso-border: rgba(255, 255, 255, 0.08);
    --iso-text-dim: #94a3b8;
    --iso-text-bright: #f8fafc;
    --iso-sidebar-width: 320px;
    --iso-danger: #ef4444;
  }

  .isolated-mode-overlay {
    position: fixed;
    inset: 0 !important;
    background: rgba(2, 6, 23, 0.95);
    backdrop-filter: blur(16px) saturate(180%);
    z-index: 10000005 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5vh 1.5vw;
    pointer-events: all;
  }

  .isolated-mode-container {
    background: var(--iso-bg-surface);
    border: 1px solid var(--iso-border);
    border-radius: 24px;
    box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05);
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: isoContainerEntry 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes isoContainerEntry {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  /* HEADER */
  .isolated-mode-header {
    height: 64px;
    min-height: 64px;
    padding: 0 1.5rem;
    background: var(--iso-bg-header);
    border-bottom: 1px solid var(--iso-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .header-breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .mode-badge {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.05em;
    color: var(--iso-primary);
    background: rgba(99, 102, 241, 0.15);
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid rgba(99, 102, 241, 0.3);
  }

  .separator { color: var(--iso-text-dim); font-size: 12px; }
  .component-name { color: var(--iso-text-bright); font-size: 14px; font-weight: 700; letter-spacing: 0.3px; }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .action-group {
    display: flex;
    gap: 0.4rem;
  }

  .header-divider {
    width: 1px;
    height: 24px;
    background: var(--iso-border);
  }

  .icon-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--iso-border);
    color: var(--iso-text-dim);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
  }

  .icon-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    border-color: var(--iso-primary);
  }

  .icon-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .icon-btn.active {
    background: var(--iso-primary);
    color: white;
    box-shadow: 0 0 15px var(--iso-primary-glow);
    border-color: var(--iso-primary);
  }

  .close-main-btn {
    width: 36px;
    height: 36px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: var(--iso-danger);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 800;
    font-size: 14px;
  }

  .close-main-btn:hover {
    background: var(--iso-danger);
    color: white;
    transform: rotate(90deg);
  }

  /* BODY */
  .isolated-mode-body {
    flex: 1;
    display: flex;
    flex-direction: row;
    overflow: hidden;
  }

  /* SIDEBAR */
  .controls-sidebar {
    width: var(--iso-sidebar-width);
    min-width: var(--iso-sidebar-width);
    flex-shrink: 0;
    background: var(--iso-bg-darker);
    border-right: 1px solid var(--iso-border);
    display: flex;
    flex-direction: column;
  }

  .sidebar-scroll-content {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
  }

  .sidebar-section {
    margin-bottom: 1.75rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .sidebar-section.no-border { border-bottom: none; }

  .section-header {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1.1rem;
  }

  .section-icon { font-size: 15px; }

  .section-header h4 {
    margin: 0;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.12em;
    color: var(--iso-text-dim);
    text-transform: uppercase;
  }

  .control-group { margin-bottom: 1rem; }

  .control-group label {
    display: block;
    font-size: 10px;
    font-weight: 700;
    color: var(--iso-text-dim);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .control-row {
    display: flex;
    gap: 0.75rem;
  }

  .control-group.half { flex: 1; }

  /* INPUTS & SELECTS */
  .premium-input, .premium-select, .premium-textarea {
    width: 100%;
    min-height: 38px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--iso-border);
    color: var(--iso-text-bright);
    padding: 0.5rem 0.8rem;
    border-radius: 10px;
    font-size: 12px;
    transition: all 0.2s;
    box-sizing: border-box;
  }

  .premium-input:focus, .premium-select:focus, .premium-textarea:focus {
    outline: none;
    background: rgba(99, 102, 241, 0.05);
    border-color: var(--iso-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .premium-select option {
    background: var(--iso-bg-header);
    color: white;
    padding: 8px;
  }

  .select-wrapper { position: relative; }
  .select-wrapper::after {
    content: '▼';
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 8px;
    color: var(--iso-text-dim);
    pointer-events: none;
  }

  .premium-select {
    appearance: none;
    padding-right: 2rem;
  }

  /* TOGGLE SWITCH */
  .toggle-wrapper {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--iso-border);
    padding: 0.5rem 0.8rem;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    user-select: none;
  }

  .toggle-wrapper span {
    font-size: 10px;
    font-weight: 700;
    color: var(--iso-text-dim);
  }

  .toggle-track {
    width: 34px;
    height: 18px;
    background: var(--iso-bg-header);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    position: relative;
    transition: all 0.3s;
    flex-shrink: 0;
  }

  .toggle-thumb {
    position: absolute;
    left: 2px;
    top: 2px;
    width: 12px;
    height: 12px;
    background: #94a3b8;
    border-radius: 50%;
    transition: all 0.3s;
  }

  .toggle-wrapper.active {
    border-color: var(--iso-primary);
    background: rgba(99, 102, 241, 0.08);
  }

  .toggle-wrapper.active .toggle-track {
    background: var(--iso-primary);
    border-color: var(--iso-primary);
  }

  .toggle-wrapper.active .toggle-thumb {
    left: calc(100% - 15px);
    background: white;
  }

  .toggle-wrapper.active span { color: white; }

  /* COLOR INPUTS */
  .color-input-wrapper {
    display: flex;
    gap: 0.6rem;
  }

  .color-preview {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    border: 1px solid var(--iso-border);
    flex-shrink: 0;
  }

  .color-preview input[type="color"] {
    position: absolute;
    inset: -5px;
    width: 200%;
    height: 200%;
    cursor: pointer;
    opacity: 0;
  }

  /* CANVAS */
  .isolated-canvas {
    flex: 1;
    background-color: var(--iso-bg-darker);
    position: relative;
    overflow: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    transition: background-color 0.4s ease;
    z-index: 1;
  }

  .canvas-viewport {
    position: relative;
    box-shadow: 0 50px 100px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    background: #000;
    flex-shrink: 0;
  }

  .canvas-inner {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: top left;
    background-color: var(--iso-bg-darker);
    background-size: 40px 40px;
    border-radius: 4px;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  /* Fallback for components that dont use viewport scaling */
  .canvas-inner-auto {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .canvas-inner.show-grid, .canvas-inner-auto.show-grid {
    background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }

  .canvas-inner.grid-snapping, .canvas-inner-auto.grid-snapping {
    background-image: radial-gradient(rgba(99, 102, 241, 0.2) 1.5px, transparent 1.5px);
    background-size: 20px 20px;
  }

  /* DRAGGABLE WRAPPER */
  .draggable-wrapper {
    position: absolute !important;
    cursor: move;
    z-index: 100;
    outline: 2px solid rgba(99, 102, 241, 0.4);
    outline-offset: 2px;
    transition: outline-color 0.15s ease, box-shadow 0.3s ease;
    background: rgba(255, 255, 255, 0.01);
    min-width: 40px;
    min-height: 40px;
  }

  .draggable-wrapper:hover {
    outline-color: var(--iso-primary);
  }

  .draggable-wrapper.is-dragging,
  .draggable-wrapper.is-resizing {
    outline-color: var(--iso-primary);
    outline-width: 3px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    transition: none;
  }

  /* RESIZE HANDLES */
  .resize-handle {
    position: absolute;
    width: 12px;
    height: 12px;
    background: #ffffff;
    border: 2px solid var(--iso-primary);
    border-radius: 3px;
    z-index: 3000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    pointer-events: all;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .resize-handle:hover {
    background: var(--iso-primary);
    transform: scale(1.3);
    box-shadow: 0 0 10px var(--iso-primary-glow);
  }

  .resize-handle.active {
    background: var(--iso-primary);
    border-color: #fff;
    transform: scale(1.5);
  }

  .resize-handle.nw { top: -7px; left: -7px; cursor: nw-resize; }
  .resize-handle.n  { top: -7px; left: 50%; margin-left: -6px; cursor: n-resize; }
  .resize-handle.ne { top: -7px; right: -7px; cursor: ne-resize; }
  .resize-handle.e  { top: 50%; right: -7px; margin-top: -6px; cursor: e-resize; }
  .resize-handle.se { bottom: -7px; right: -7px; cursor: se-resize; }
  .resize-handle.s  { bottom: -7px; left: 50%; margin-left: -6px; cursor: s-resize; }
  .resize-handle.sw { bottom: -7px; left: -7px; cursor: sw-resize; }
  .resize-handle.w  { top: 50%; left: -7px; margin-top: -6px; cursor: w-resize; }

  /* POSITION DOCK */
  .modern-position-dock {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(15, 23, 42, 0.88);
    backdrop-filter: blur(12px);
    border: 1px solid var(--iso-border);
    border-radius: 50px;
    padding: 8px 20px;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    pointer-events: none;
  }

  .dock-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .dock-item .label {
    font-size: 9px;
    font-weight: 900;
    color: var(--iso-primary);
    background: rgba(99, 102, 241, 0.15);
    padding: 2px 7px;
    border-radius: 5px;
    letter-spacing: 0.05em;
  }

  .dock-item .value {
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    font-family: 'JetBrains Mono', 'Courier New', monospace;
  }

  .dock-divider {
    width: 1px;
    height: 16px;
    background: rgba(255, 255, 255, 0.1);
  }

  /* FOOTER */
  .isolated-mode-footer {
    height: 64px;
    min-height: 64px;
    background: var(--iso-bg-header);
    border-top: 1px solid var(--iso-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    flex-shrink: 0;
  }

  .footer-hint {
    font-size: 11px;
    color: var(--iso-text-dim);
  }

  .footer-hint b, .footer-hint kbd {
    color: var(--iso-primary);
    font-weight: 700;
  }

  .footer-actions-btns {
    display: flex;
    gap: 0.75rem;
  }

  .btn-clean {
    padding: 0.6rem 1.8rem;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    border: none;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .btn-clean.secondary {
    background: transparent;
    color: var(--iso-text-dim);
  }
  .btn-clean.secondary:hover { color: #fff; background: rgba(255, 255, 255, 0.05); }

  .btn-clean.primary {
    background: var(--iso-primary);
    color: white;
    box-shadow: 0 8px 20px -5px var(--iso-primary-glow);
  }
  .btn-clean.primary:hover { transform: translateY(-2px); box-shadow: 0 12px 25px -5px var(--iso-primary-glow); }

  /* DIMENSION LABELS (shown during resize) */
  .dimension-label {
    position: absolute;
    background: var(--iso-primary);
    color: white;
    font-size: 10px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 4px;
    pointer-events: none;
    z-index: 5000;
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap;
  }

  .dimension-label.width-label {
    bottom: -22px;
    left: 50%;
    transform: translateX(-50%);
  }

  .dimension-label.height-label {
    right: -50px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

// ========== BASE COMPONENT ==========

@Component({
  template: ''
})
export abstract class BaseIsolatedModeComponent implements OnInit, OnDestroy {

  // ───── INPUTS / OUTPUTS ─────

  @Input() config!: IsolatedModeConfig;
  @Output() closed = new EventEmitter<void>();
  @Output() applied = new EventEmitter<IsolatedModeConfig>();

  // ───── VIEW REFS (optional, set by child) ─────

  @ViewChild('canvas') canvasRef?: ElementRef;
  @ViewChild('canvasInner') canvasInnerRef?: ElementRef;

  // ───── PUBLIC STATE (template-bound) ─────

  currentPosition: { x: number; y: number } = { x: 100, y: 100 };
  currentSize: { width: number; height: number } = { width: 300, height: 200 };
  initialPosition: { x: number; y: number } = { x: 100, y: 100 };
  initialSize: { width: number; height: number } = { width: 300, height: 200 };

  editableContent: any = {};
  editableStyles: any = {};

  isDragging = false;
  isResizing = false;
  resizeHandle: ResizeHandleType | '' = '';

  showGrid = true;
  snapToGrid = false;
  gridSize = 20;

  viewportScale = 0.5;

  // ───── UNDO / REDO ─────

  private undoStack: UndoRedoSnapshot[] = [];
  private redoStack: UndoRedoSnapshot[] = [];
  private saveTimeout: any;

  get canUndo(): boolean { return this.undoStack.length > 1; }
  get canRedo(): boolean { return this.redoStack.length > 0; }

  // ───── PRIVATE DRAG/RESIZE STATE ─────

  private dragStartX = 0;
  private dragStartY = 0;
  private startPositionX = 0;
  private startPositionY = 0;
  private startSizeWidth = 0;
  private startSizeHeight = 0;

  protected destroy$ = new Subject<void>();

  // ========================================================================
  //  ABSTRACT — Must be implemented by children
  // ========================================================================

  /** Return default size for this component type (e.g. button → 180x50) */
  abstract getDefaultSize(): { width: number; height: number };

  /** Initialize editableContent from config. Called once in ngOnInit. */
  abstract initializeContent(): void;

  /** Initialize editableStyles from config. Called once in ngOnInit. */
  abstract initializeStyles(): void;

  /** Build the final IsolatedModeConfig to emit on apply. */
  abstract buildApplyPayload(): IsolatedModeConfig;

  // ========================================================================
  //  LIFECYCLE
  // ========================================================================

  ngOnInit(): void {
    const defaultSize = this.getDefaultSize();

    // Position
    const pos = this.config?.position;
    if (pos && (pos.x !== 0 || pos.y !== 0)) {
      this.currentPosition = { ...pos };
    } else {
      // Center in a 4000x4000 canvas
      this.currentPosition = {
        x: 2000 - (defaultSize.width / 2),
        y: 2000 - (defaultSize.height / 2)
      };
    }

    // Size
    const configSize = this.config?.size;
    this.currentSize = {
      width: configSize?.width || defaultSize.width,
      height: configSize?.height || defaultSize.height
    };

    // Save references
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };

    // Child initialization
    this.initializeContent();
    this.initializeStyles();

    // First undo snapshot
    this.saveState();

    // Setup mouse listeners + scroll
    if (typeof document !== 'undefined') {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    }

    setTimeout(() => this.scrollToComponent(), 120);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (typeof document !== 'undefined') {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
  }

  // ========================================================================
  //  KEYBOARD SHORTCUTS
  // ========================================================================

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    // Ignore if user is typing in an input/select/textarea
    const target = event.target as HTMLElement;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName)) return;

    // Escape → cancel
    if (event.key === 'Escape') {
      event.preventDefault();
      this.cancel();
      return;
    }

    // Ctrl+Z → undo
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      this.undo();
      return;
    }

    // Ctrl+Y / Ctrl+Shift+Z → redo
    if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
      event.preventDefault();
      this.redo();
      return;
    }

    // Ctrl+S → save
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      this.apply();
      return;
    }

    // G → grid
    if (event.key.toLowerCase() === 'g') {
      this.toggleGrid();
      return;
    }

    // S → snap (only when not Ctrl+S)
    if (event.key.toLowerCase() === 's' && !event.ctrlKey && !event.metaKey) {
      this.toggleSnap();
      return;
    }

    // R → reset
    if (event.key.toLowerCase() === 'r') {
      this.resetToCenter();
      return;
    }

    // Arrow keys → fine positioning
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      const delta = event.shiftKey ? 10 : 1;
      this.handleArrowKey(event.key, delta);
    }
  }

  // ========================================================================
  //  DRAG & RESIZE
  // ========================================================================

  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.startPositionX = this.currentPosition.x;
    this.startPositionY = this.currentPosition.y;
  }

  startResize(event: MouseEvent, handle: ResizeHandleType): void {
    event.preventDefault();
    event.stopPropagation();

    this.isResizing = true;
    this.resizeHandle = handle;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.startPositionX = this.currentPosition.x;
    this.startPositionY = this.currentPosition.y;
    this.startSizeWidth = this.currentSize.width;
    this.startSizeHeight = this.currentSize.height;
  }

  private onMouseMove = (event: MouseEvent): void => {
    const scale = this.viewportScale || 1;

    if (this.isDragging) {
      const deltaX = (event.clientX - this.dragStartX) / scale;
      const deltaY = (event.clientY - this.dragStartY) / scale;

      let newX = this.startPositionX + deltaX;
      let newY = this.startPositionY + deltaY;

      if (this.snapToGrid) {
        newX = Math.round(newX / this.gridSize) * this.gridSize;
        newY = Math.round(newY / this.gridSize) * this.gridSize;
      }

      // Clamp to canvas
      const canvasW = this.config.canvasSize?.width || 4000;
      const canvasH = this.config.canvasSize?.height || 4000;
      this.currentPosition.x = Math.max(0, Math.min(newX, canvasW - this.currentSize.width));
      this.currentPosition.y = Math.max(0, Math.min(newY, canvasH - this.currentSize.height));
    }

    if (this.isResizing) {
      const deltaX = (event.clientX - this.dragStartX) / scale;
      const deltaY = (event.clientY - this.dragStartY) / scale;

      let newWidth = this.startSizeWidth;
      let newHeight = this.startSizeHeight;
      let newX = this.startPositionX;
      let newY = this.startPositionY;

      const canvasW = this.config.canvasSize?.width || 4000;
      const canvasH = this.config.canvasSize?.height || 4000;

      if (this.resizeHandle.includes('e')) {
        newWidth = Math.min(this.startSizeWidth + deltaX, canvasW - this.startPositionX);
      }
      if (this.resizeHandle.includes('w')) {
        const maxDx = this.startPositionX;
        const safeDx = Math.max(-maxDx, deltaX);
        newWidth = this.startSizeWidth - safeDx;
        newX = this.startPositionX + safeDx;
      }
      if (this.resizeHandle.includes('s')) {
        newHeight = Math.min(this.startSizeHeight + deltaY, canvasH - this.startPositionY);
      }
      if (this.resizeHandle.includes('n')) {
        const maxDy = this.startPositionY;
        const safeDy = Math.max(-maxDy, deltaY);
        newHeight = this.startSizeHeight - safeDy;
        newY = this.startPositionY + safeDy;
      }

      // Minimum size
      newWidth = Math.max(40, newWidth);
      newHeight = Math.max(30, newHeight);

      // Snap
      if (this.snapToGrid) {
        newWidth = Math.round(newWidth / this.gridSize) * this.gridSize;
        newHeight = Math.round(newHeight / this.gridSize) * this.gridSize;
        newX = Math.round(newX / this.gridSize) * this.gridSize;
        newY = Math.round(newY / this.gridSize) * this.gridSize;
      }

      this.currentSize.width = newWidth;
      this.currentSize.height = newHeight;
      this.currentPosition.x = newX;
      this.currentPosition.y = newY;
    }
  };

  private onMouseUp = (): void => {
    if (this.isDragging || this.isResizing) {
      this.scheduleSaveState();
    }
    this.isDragging = false;
    this.isResizing = false;
    this.resizeHandle = '';
  };

  // ========================================================================
  //  UNDO / REDO
  // ========================================================================

  private saveState(): void {
    this.undoStack.push({
      position: { ...this.currentPosition },
      size: { ...this.currentSize },
      styles: { ...this.editableStyles },
      content: { ...this.editableContent }
    });
    this.redoStack = [];
  }

  protected scheduleSaveState(): void {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => this.saveState(), 400);
  }

  undo(): void {
    if (this.undoStack.length > 1) {
      const current = this.undoStack.pop()!;
      this.redoStack.push(current);
      this.restoreState(this.undoStack[this.undoStack.length - 1]);
    }
  }

  redo(): void {
    if (this.redoStack.length > 0) {
      const next = this.redoStack.pop()!;
      this.undoStack.push(next);
      this.restoreState(next);
    }
  }

  private restoreState(state: UndoRedoSnapshot): void {
    this.currentPosition = { ...state.position };
    this.currentSize = { ...state.size };
    this.editableStyles = { ...state.styles };
    this.editableContent = { ...state.content };
  }

  // ========================================================================
  //  GRID / SNAP / NAVIGATION
  // ========================================================================

  toggleGrid(): void {
    this.showGrid = !this.showGrid;
  }

  toggleSnap(): void {
    this.snapToGrid = !this.snapToGrid;
    if (this.snapToGrid) {
      this.currentPosition.x = Math.round(this.currentPosition.x / this.gridSize) * this.gridSize;
      this.currentPosition.y = Math.round(this.currentPosition.y / this.gridSize) * this.gridSize;
      this.currentSize.width = Math.round(this.currentSize.width / this.gridSize) * this.gridSize;
      this.currentSize.height = Math.round(this.currentSize.height / this.gridSize) * this.gridSize;
    }
  }

  resetToCenter(): void {
    const defaultSize = this.getDefaultSize();
    this.currentSize = { ...defaultSize };
    this.currentPosition = {
      x: 2000 - (defaultSize.width / 2),
      y: 2000 - (defaultSize.height / 2)
    };
    this.scheduleSaveState();
    this.scrollToComponent();
  }

  resetPosition(): void {
    this.resetToCenter();
  }

  private handleArrowKey(key: string, delta: number): void {
    switch (key) {
      case 'ArrowUp':    this.currentPosition.y -= delta; break;
      case 'ArrowDown':  this.currentPosition.y += delta; break;
      case 'ArrowLeft':  this.currentPosition.x -= delta; break;
      case 'ArrowRight': this.currentPosition.x += delta; break;
    }

    if (this.snapToGrid) {
      this.currentPosition.x = Math.round(this.currentPosition.x / this.gridSize) * this.gridSize;
      this.currentPosition.y = Math.round(this.currentPosition.y / this.gridSize) * this.gridSize;
    }

    this.currentPosition.x = Math.max(0, this.currentPosition.x);
    this.currentPosition.y = Math.max(0, this.currentPosition.y);
    this.scheduleSaveState();
  }

  scrollToComponent(): void {
    if (!this.canvasRef?.nativeElement) return;
    const canvas = this.canvasRef.nativeElement;
    const scale = this.viewportScale || 1;
    const scrollLeft = Math.max(0, (this.currentPosition.x * scale) - (canvas.clientWidth / 2) + (this.currentSize.width * scale / 2));
    const scrollTop = Math.max(0, (this.currentPosition.y * scale) - (canvas.clientHeight / 2) + (this.currentSize.height * scale / 2));
    canvas.scrollTo({ left: scrollLeft, top: scrollTop, behavior: 'smooth' });
  }

  // ========================================================================
  //  EVENT HELPERS (called from template ngModelChange etc.)
  // ========================================================================

  onPositionChange(): void {
    this.currentPosition.x = Math.max(0, this.currentPosition.x);
    this.currentPosition.y = Math.max(0, this.currentPosition.y);
    this.scheduleSaveState();
  }

  onSizeChange(): void {
    this.currentSize.width = Math.max(40, this.currentSize.width);
    this.currentSize.height = Math.max(30, this.currentSize.height);
    this.scheduleSaveState();
  }

  onContentChange(): void {
    this.scheduleSaveState();
  }

  onStyleChange(): void {
    this.scheduleSaveState();
  }

  // ========================================================================
  //  ACTIONS
  // ========================================================================

  apply(): void {
    this.applied.emit(this.buildApplyPayload());
  }

  cancel(): void {
    this.closed.emit();
  }

  close(): void {
    this.cancel();
  }

  onOverlayClick(event: MouseEvent): void {
    this.cancel();
  }

  onCanvasMouseDown(_event: MouseEvent): void {
    // Override in child if deselection behavior is needed
  }

  // ========================================================================
  //  UTILITY
  // ========================================================================

  formatVariantName(variant: string): string {
    if (!variant) return '';
    return variant
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
