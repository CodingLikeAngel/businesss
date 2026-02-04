import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIDraggableBox1Component, UIDraggableBox2Component, UIDraggableBox3Component } from '@negocio/ui-components';
import { SimpleVisualEditorService, SimpleEditableElement } from '@negocio/shared-components';
import { Subject, takeUntil } from 'rxjs';

export interface IsolatedModeConfig {
  sectionId: string;
  elementId: string;
  variant: string;
  content: any;
  styles: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface UndoRedoState {
  position: { x: number; y: number };
  size: { width: number; height: number };
  styles: any;
  content: any;
}

@Component({
  selector: 'lib-editor-draggable-box-isolated-mode',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    UIDraggableBox1Component,
    UIDraggableBox2Component,
    UIDraggableBox3Component
  ],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="isolated-mode-header">
          <div class="header-left">
            <span class="mode-badge">🎯 Modo Aislado</span>
            <h3 class="component-title">{{ config.elementId }}</h3>
          </div>
          <div class="header-right">
            <button class="control-btn" (click)="undo()" [disabled]="!canUndo" title="Deshacer (Ctrl+Z)">
              <span>↶</span>
            </button>
            <button class="control-btn" (click)="redo()" [disabled]="!canRedo" title="Rehacer (Ctrl+Y)">
              <span>↷</span>
            </button>
            <button class="control-btn" (click)="toggleGrid()" 
                    [class.active]="showGrid" 
                    title="Mostrar/Ocultar cuadrícula (G)">
              <span>#</span>
            </button>
            <button class="control-btn" (click)="toggleSnap()" 
                    [class.active]="snapToGrid" 
                    title="Ajustar a cuadrícula (S)">
              <span>⊞</span>
            </button>
            <button class="control-btn" (click)="resetPosition()" title="Restablecer posición (R)">
              <span>↺</span>
            </button>
            <button class="close-btn" (click)="close()" title="Cerrar (Esc)">
              <span>✕</span>
            </button>
          </div>
        </div>

        <div class="isolated-mode-body">
          <!-- Sidebar Controls -->
          <div class="controls-sidebar">
            <div class="sidebar-section">
              <h4 class="section-title">📝 Contenido</h4>
              <div class="control-group">
                <label>Título</label>
                <input type="text" [(ngModel)]="editableContent.title" (ngModelChange)="onContentChange()" placeholder="Título">
              </div>
              <div class="control-group">
                <label>Descripción</label>
                <textarea [(ngModel)]="editableContent.description" (ngModelChange)="onContentChange()" rows="3" placeholder="Descripción"></textarea>
              </div>
            </div>

            <div class="sidebar-section">
              <h4 class="section-title">🎨 Estilos</h4>
              
              <div class="control-group">
                <label>Color de fondo</label>
                <div class="color-picker">
                  <input type="color" [(ngModel)]="editableStyles.backgroundColor" (ngModelChange)="onStyleChange()">
                  <input type="text" [(ngModel)]="editableStyles.backgroundColor" (ngModelChange)="onStyleChange()">
                </div>
              </div>

              <div class="control-group">
                <label>Color de borde</label>
                <div class="color-picker">
                  <input type="color" [(ngModel)]="editableStyles.borderColor" (ngModelChange)="onStyleChange()">
                  <input type="text" [(ngModel)]="editableStyles.borderColor" (ngModelChange)="onStyleChange()">
                </div>
              </div>

              <div class="control-group">
                <label>Radio de borde</label>
                <div class="input-with-unit">
                  <input type="number" [(ngModel)]="editableStyles.borderRadius" (ngModelChange)="onStyleChange()">
                  <select [(ngModel)]="borderRadiusUnit" (ngModelChange)="onStyleChange()">
                    <option value="px">px</option>
                    <option value="rem">rem</option>
                    <option value="%">%</option>
                  </select>
                </div>
              </div>

              <div class="control-group">
                <label>Sombra</label>
                <select [(ngModel)]="editableStyles.boxShadow" (ngModelChange)="onStyleChange()">
                  <option value="none">Ninguna</option>
                  <option value="0 4px 6px rgba(0,0,0,0.1)">Sutil</option>
                  <option value="0 10px 30px rgba(0,0,0,0.3)">Media</option>
                  <option value="0 15px 40px rgba(0,0,0,0.4)">Fuerte</option>
                  <option value="0 20px 50px rgba(0,0,0,0.5)">Extra fuerte</option>
                </select>
              </div>

              <div class="control-group">
                <label>Relleno (padding)</label>
                <div class="input-with-unit">
                  <input type="number" [(ngModel)]="editableStyles.padding" (ngModelChange)="onStyleChange()">
                  <select [(ngModel)]="paddingUnit" (ngModelChange)="onStyleChange()">
                    <option value="px">px</option>
                    <option value="rem">rem</option>
                    <option value="%">%</option>
                  </select>
                </div>
              </div>

              <div class="control-group">
                <label>Grosor de borde</label>
                <input type="number" [(ngModel)]="editableStyles.borderWidth" (ngModelChange)="onStyleChange()" min="0" max="10">
              </div>
            </div>

            <div class="sidebar-section">
              <h4 class="section-title">📐 Posición</h4>
              <div class="control-row">
                <div class="control-group">
                  <label>X</label>
                  <input type="number" [(ngModel)]="currentPosition.x" (ngModelChange)="onPositionChange()">
                </div>
                <div class="control-group">
                  <label>Y</label>
                  <input type="number" [(ngModel)]="currentPosition.y" (ngModelChange)="onPositionChange()">
                </div>
              </div>
              <div class="control-row">
                <div class="control-group">
                  <label>Ancho</label>
                  <input type="number" [(ngModel)]="currentSize.width" (ngModelChange)="onSizeChange()">
                </div>
                <div class="control-group">
                  <label>Alto</label>
                  <input type="number" [(ngModel)]="currentSize.height" (ngModelChange)="onSizeChange()">
                </div>
              </div>
            </div>
          </div>

          <!-- Canvas Area -->
          <div class="isolated-canvas" 
               #canvas
               [class.show-grid]="showGrid"
               [style.background-size]="gridSize + 'px ' + gridSize + 'px'">
            
            <!-- Canvas Inner Container for proper positioning -->
            <div class="canvas-inner" #canvasInner>
              <!-- Draggable Box Wrapper -->
              <div class="draggable-wrapper"
                   #draggableWrapper
                   [id]="config.elementId"
                   [style.position]="'absolute'"
                   [style.left.px]="currentPosition.x"
                   [style.top.px]="currentPosition.y"
                   [style.width.px]="currentSize.width"
                   [style.height.px]="currentSize.height"
                   [style.backgroundColor]="editableStyles.backgroundColor"
                   [style.border]="editableStyles.borderWidth + 'px solid ' + editableStyles.borderColor"
                   [style.borderRadius]="editableStyles.borderRadius + borderRadiusUnit"
                   [style.padding]="editableStyles.padding + paddingUnit"
                   [style.boxShadow]="editableStyles.boxShadow"
                   [attr.data-visual-editable]="config.elementId"
                   (mousedown)="onMouseDown($event)">
                
                <lib-ui-components-draggable-box-1
                  *ngIf="config.variant === 'draggable-box-1'"
                  [variant]="editableContent.variant || 'secondary'"
                  [rounded]="editableContent.rounded || 'md'"
                  [size]="editableContent.size || 'md'"
                  [dark]="editableContent.dark || false"
                  [content]="editableContent.content || editableContent.title || 'Drag me'"
                  [customStyles]="getCustomStyles()">
                </lib-ui-components-draggable-box-1>

                <lib-ui-components-draggable-box-2
                  *ngIf="config.variant === 'draggable-box-2'"
                  [variant]="editableContent.variant || 'secondary'"
                  [rounded]="editableContent.rounded || 'md'"
                  [size]="editableContent.size || 'md'"
                  [dark]="editableContent.dark || false"
                  [content]="editableContent.content || editableContent.title || 'Drag me'"
                  [customStyles]="getCustomStyles()">
                </lib-ui-components-draggable-box-2>

                <lib-ui-components-draggable-box-3
                  *ngIf="config.variant === 'draggable-box-3'"
                  [variant]="editableContent.variant || 'secondary'"
                  [rounded]="editableContent.rounded || 'md'"
                  [size]="editableContent.size || 'md'"
                  [dark]="editableContent.dark || false"
                  [content]="editableContent.content || editableContent.title || 'Drag me'"
                  [customStyles]="getCustomStyles()">
                </lib-ui-components-draggable-box-3>

                <!-- Resize Handles -->
                <div class="resize-handle nw" (mousedown)="startResize($event, 'nw')"></div>
                <div class="resize-handle n" (mousedown)="startResize($event, 'n')"></div>
                <div class="resize-handle ne" (mousedown)="startResize($event, 'ne')"></div>
                <div class="resize-handle e" (mousedown)="startResize($event, 'e')"></div>
                <div class="resize-handle se" (mousedown)="startResize($event, 'se')"></div>
                <div class="resize-handle s" (mousedown)="startResize($event, 's')"></div>
                <div class="resize-handle sw" (mousedown)="startResize($event, 'sw')"></div>
                <div class="resize-handle w" (mousedown)="startResize($event, 'w')"></div>
              </div>
            </div>

            <!-- Position Info -->
            <div class="position-info">
              <div class="info-item">
                <span class="label">X:</span>
                <span class="value">{{ currentPosition.x }}px</span>
              </div>
              <div class="info-item">
                <span class="label">Y:</span>
                <span class="value">{{ currentPosition.y }}px</span>
              </div>
              <div class="info-item">
                <span class="label">W:</span>
                <span class="value">{{ currentSize.width }}px</span>
              </div>
              <div class="info-item">
                <span class="label">H:</span>
                <span class="value">{{ currentSize.height }}px</span>
              </div>
              <div class="info-item" *ngIf="snapToGrid">
                <span class="label">🔒</span>
                <span class="value">{{ gridSize }}px</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="isolated-mode-footer">
          <div class="footer-left">
            <span class="shortcuts-hint">Atajos: ←↑→↓ Mover | Ctrl+Z/Y Deshacer/Rehacer | G Cuadrícula | S Snap | R Restablecer | Esc Cerrar</span>
          </div>
          <div class="footer-right">
            <button class="btn btn-secondary" (click)="cancel()">
              Cancelar
            </button>
            <button class="btn btn-primary" (click)="apply()">
              Aplicar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --header-height: 60px;
      --footer-height: 50px;
      --sidebar-width: 280px;
    }

    .isolated-mode-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(12px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .isolated-mode-container {
      background: #1a1a2e;
      border-radius: 16px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      width: 95vw;
      max-width: 1600px;
      height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .isolated-mode-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      background: linear-gradient(135deg, #16213e 0%, #0f3460 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .mode-badge {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.4rem 0.75rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .component-title {
      color: #fff;
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
    }

    .header-right {
      display: flex;
      gap: 0.5rem;
    }

    .control-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      padding: 0.4rem 0.6rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 1rem;
    }

    .control-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }

    .control-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .control-btn.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: #667eea;
    }

    .close-btn {
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #ef4444;
      padding: 0.4rem 0.6rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 1rem;
    }

    .close-btn:hover {
      background: rgba(239, 68, 68, 0.3);
      transform: scale(1.05);
    }

    .isolated-mode-body {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    .controls-sidebar {
      width: var(--sidebar-width);
      background: #16213e;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1rem;
      overflow-y: auto;
      flex-shrink: 0;
    }

    .sidebar-section {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .section-title {
      color: #fff;
      font-size: 0.875rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
      opacity: 0.9;
    }

    .control-group {
      margin-bottom: 0.75rem;
    }

    .control-group label {
      display: block;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.75rem;
      margin-bottom: 0.25rem;
    }

    .control-group input[type="text"],
    .control-group input[type="number"],
    .control-group select,
    .control-group textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
      font-size: 0.875rem;
    }

    .control-group textarea {
      resize: vertical;
    }

    .control-group input:focus,
    .control-group select:focus,
    .control-group textarea:focus {
      outline: none;
      border-color: #667eea;
    }

    .color-picker {
      display: flex;
      gap: 0.5rem;
    }

    .color-picker input[type="color"] {
      width: 40px;
      height: 32px;
      padding: 0;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .color-picker input[type="text"] {
      flex: 1;
    }

    .input-with-unit {
      display: flex;
      gap: 0.5rem;
    }

    .input-with-unit input {
      flex: 1;
    }

    .input-with-unit select {
      width: 60px;
    }

    .control-row {
      display: flex;
      gap: 0.5rem;
    }

    .control-row .control-group {
      flex: 1;
    }

    .isolated-canvas {
      flex: 1;
      background: #0f0f1e;
      position: relative;
      overflow: auto;
    }

    .canvas-inner {
      position: relative;
      min-width: 100%;
      min-height: 100%;
    }

    .isolated-canvas.show-grid .canvas-inner {
      background-image: 
        linear-gradient(rgba(102, 126, 234, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(102, 126, 234, 0.1) 1px, transparent 1px);
      background-size: var(--grid-size, 20px) var(--grid-size, 20px);
    }

    .draggable-wrapper {
      cursor: move;
      transition: box-shadow 0.2s;
      position: absolute !important;
    }

    .draggable-wrapper:hover {
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.5);
    }

    /* Resize Handles */
    .resize-handle {
      position: absolute;
      width: 12px;
      height: 12px;
      background: #fff;
      border: 2px solid #667eea;
      border-radius: 50%;
      z-index: 10;
    }

    .resize-handle.nw { top: -6px; left: -6px; cursor: nw-resize; }
    .resize-handle.n { top: -6px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
    .resize-handle.ne { top: -6px; right: -6px; cursor: ne-resize; }
    .resize-handle.e { top: 50%; right: -6px; transform: translateY(-50%); cursor: e-resize; }
    .resize-handle.se { bottom: -6px; right: -6px; cursor: se-resize; }
    .resize-handle.s { bottom: -6px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
    .resize-handle.sw { bottom: -6px; left: -6px; cursor: sw-resize; }
    .resize-handle.w { top: 50%; left: -6px; transform: translateY(-50%); cursor: w-resize; }

    .position-info {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 0.75rem 1rem;
      display: flex;
      gap: 1.25rem;
      color: white;
      font-family: 'Courier New', monospace;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      align-items: center;
    }

    .info-item .label {
      font-size: 0.65rem;
      opacity: 0.6;
      text-transform: uppercase;
    }

    .info-item .value {
      font-size: 0.875rem;
      font-weight: 600;
      color: #667eea;
    }

    .isolated-mode-footer {
      padding: 1rem 1.5rem;
      background: #16213e;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }

    .footer-left {
      flex: 1;
    }

    .footer-right {
      display: flex;
      gap: 0.75rem;
    }

    .shortcuts-hint {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.75rem;
    }

    .btn {
      padding: 0.6rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      font-size: 0.875rem;
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
  `]
})
export class EditorDraggableBoxIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() config!: IsolatedModeConfig;
  @Output() closed = new EventEmitter<void>();
  @Output() applied = new EventEmitter<IsolatedModeConfig>();
  @ViewChild('canvas') canvasRef!: ElementRef;
  @ViewChild('draggableWrapper') draggableWrapperRef!: ElementRef;
  @ViewChild('canvasInner') canvasInnerRef!: ElementRef;

  private visualEditor = inject(SimpleVisualEditorService);
  private destroy$ = new Subject<void>();

  // Position and size state
  currentPosition: { x: number; y: number } = { x: 100, y: 100 };
  currentSize: { width: number; height: number } = { width: 300, height: 200 };
  initialPosition: { x: number; y: number } = { x: 100, y: 100 };
  initialSize: { width: number; height: number } = { width: 300, height: 200 };

  // Editable content and styles
  editableContent: any = {};
  editableStyles: any = {};
  borderRadiusUnit = 'px';
  paddingUnit = 'px';

  // Grid settings
  showGrid = true;
  snapToGrid = false;
  gridSize = 20;

  // Drag/Resize state
  private isDragging = false;
  private isResizing = false;
  private resizeHandle = '';
  private dragStartX = 0;
  private dragStartY = 0;
  private startPositionX = 0;
  private startPositionY = 0;
  private startSizeWidth = 0;
  private startSizeHeight = 0;

  // Undo/Redo
  private undoStack: UndoRedoState[] = [];
  private redoStack: UndoRedoState[] = [];
  private saveTimeout: any;

  // Getters for template access
  get canUndo(): boolean { return this.undoStack.length > 1; }
  get canRedo(): boolean { return this.redoStack.length > 0; }

  ngOnInit() {
    // Load initial position and size
    this.currentPosition = { ...this.config.position };
    this.currentSize = { ...this.config.size };
    this.initialPosition = { ...this.config.position };
    this.initialSize = { ...this.config.size };

    // Load editable content
    this.editableContent = {
      ...this.config.content,
      title: this.config.content['title'] || 'Draggable Box',
      description: this.config.content['description'] || 'Arrastra y redimensiona este elemento'
    };

    // Load editable styles
    this.editableStyles = {
      backgroundColor: this.config.styles['backgroundColor'] || '#10b981',
      borderColor: this.extractBorderColor(this.config.styles['border']),
      borderWidth: this.extractBorderWidth(this.config.styles['border']),
      borderRadius: parseInt(this.config.styles['borderRadius']) || 12,
      boxShadow: this.config.styles['boxShadow'] || '0 10px 30px rgba(0,0,0,0.3)',
      padding: parseInt(this.config.styles['padding']) || 20
    };

    // Save initial state for undo
    this.saveState();

    // Setup global mouse listeners
    setTimeout(() => this.setupMouseListeners(), 100);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.removeMouseListeners();
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
  }

  private extractBorderColor(border: string): string {
    if (!border) return '#059669';
    const match = border.match(/solid\s+(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\))/);
    return match ? match[1] : '#059669';
  }

  private extractBorderWidth(border: string): number {
    if (!border) return 2;
    const match = border.match(/(\d+)px/);
    return match ? parseInt(match[1]) : 2;
  }

  private setupMouseListeners() {
    if (typeof document !== 'undefined') {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    }
  }

  private removeMouseListeners() {
    if (typeof document !== 'undefined') {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // Close on Escape
    if (event.key === 'Escape') {
      event.preventDefault();
      this.cancel();
      return;
    }

    // Undo: Ctrl+Z or Cmd+Z
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      this.undo();
      return;
    }

    // Redo: Ctrl+Y or Cmd+Y or Ctrl+Shift+Z
    if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
      event.preventDefault();
      this.redo();
      return;
    }

    // Toggle grid
    if (event.key === 'g' || event.key === 'G') {
      this.toggleGrid();
      return;
    }

    // Toggle snap
    if (event.key === 's' || event.key === 'S') {
      this.toggleSnap();
      return;
    }

    // Reset position
    if (event.key === 'r' || event.key === 'R') {
      this.resetPosition();
      return;
    }

    // Arrow keys for fine positioning
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      const delta = event.shiftKey ? 10 : 1;
      this.handleArrowKey(event.key, delta);
      return;
    }
  }

  private handleArrowKey(key: string, delta: number) {
    switch (key) {
      case 'ArrowUp':
        this.currentPosition.y -= delta;
        break;
      case 'ArrowDown':
        this.currentPosition.y += delta;
        break;
      case 'ArrowLeft':
        this.currentPosition.x -= delta;
        break;
      case 'ArrowRight':
        this.currentPosition.x += delta;
        break;
    }
    this.onPositionChange();
  }

  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.startPositionX = this.currentPosition.x;
    this.startPositionY = this.currentPosition.y;
  }

  startResize(event: MouseEvent, handle: string) {
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

  private onMouseMove = (event: MouseEvent) => {
    if (this.isDragging) {
      const deltaX = event.clientX - this.dragStartX;
      const deltaY = event.clientY - this.dragStartY;
      
      let newX = this.startPositionX + deltaX;
      let newY = this.startPositionY + deltaY;
      
      if (this.snapToGrid) {
        newX = Math.round(newX / this.gridSize) * this.gridSize;
        newY = Math.round(newY / this.gridSize) * this.gridSize;
      }
      
      this.currentPosition.x = newX;
      this.currentPosition.y = newY;
      this.onPositionChange();
    }
    
    if (this.isResizing) {
      const deltaX = event.clientX - this.dragStartX;
      const deltaY = event.clientY - this.dragStartY;
      
      let newWidth = this.startSizeWidth;
      let newHeight = this.startSizeHeight;
      let newX = this.startPositionX;
      let newY = this.startPositionY;
      
      if (this.resizeHandle.includes('e')) {
        newWidth = this.startSizeWidth + deltaX;
      }
      if (this.resizeHandle.includes('w')) {
        newWidth = this.startSizeWidth - deltaX;
        newX = this.startPositionX + deltaX;
      }
      if (this.resizeHandle.includes('s')) {
        newHeight = this.startSizeHeight + deltaY;
      }
      if (this.resizeHandle.includes('n')) {
        newHeight = this.startSizeHeight - deltaY;
        newY = this.startPositionY + deltaY;
      }
      
      // Minimum size
      newWidth = Math.max(50, newWidth);
      newHeight = Math.max(50, newHeight);
      
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
      this.onPositionChange();
      this.onSizeChange();
    }
  }

  private onMouseUp = () => {
    this.isDragging = false;
    this.isResizing = false;
    this.resizeHandle = '';
  };

  private saveState() {
    const state: UndoRedoState = {
      position: { ...this.currentPosition },
      size: { ...this.currentSize },
      styles: { ...this.editableStyles },
      content: { ...this.editableContent }
    };
    this.undoStack.push(state);
    this.redoStack = [];
  }

  undo() {
    if (this.undoStack.length > 1) {
      const currentState = this.undoStack.pop()!;
      this.redoStack.push(currentState);
      const previousState = this.undoStack[this.undoStack.length - 1];
      this.restoreState(previousState);
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const nextState = this.redoStack.pop()!;
      this.undoStack.push(nextState);
      this.restoreState(nextState);
    }
  }

  private restoreState(state: UndoRedoState) {
    this.currentPosition = { ...state.position };
    this.currentSize = { ...state.size };
    this.editableStyles = { ...state.styles };
    this.editableContent = { ...state.content };
  }

  onPositionChange() {
    this.scheduleSaveState();
  }

  onSizeChange() {
    this.scheduleSaveState();
  }

  onStyleChange() {
    this.scheduleSaveState();
  }

  onContentChange() {
    this.scheduleSaveState();
  }

  private scheduleSaveState() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.saveState();
    }, 500);
  }

  toggleGrid() {
    this.showGrid = !this.showGrid;
  }

  toggleSnap() {
    this.snapToGrid = !this.snapToGrid;
    if (this.snapToGrid) {
      this.currentPosition.x = Math.round(this.currentPosition.x / this.gridSize) * this.gridSize;
      this.currentPosition.y = Math.round(this.currentPosition.y / this.gridSize) * this.gridSize;
      this.currentSize.width = Math.round(this.currentSize.width / this.gridSize) * this.gridSize;
      this.currentSize.height = Math.round(this.currentSize.height / this.gridSize) * this.gridSize;
      this.onPositionChange();
      this.onSizeChange();
    }
  }

  resetPosition() {
    this.currentPosition = { x: 100, y: 100 };
    this.currentSize = { width: 300, height: 200 };
    this.onPositionChange();
    this.onSizeChange();
  }

  getCustomStyles(): any {
    return {
      backgroundColor: this.editableStyles.backgroundColor,
      border: `${this.editableStyles.borderWidth}px solid ${this.editableStyles.borderColor}`,
      borderRadius: `${this.editableStyles.borderRadius}${this.borderRadiusUnit}`,
      padding: `${this.editableStyles.padding}${this.paddingUnit}`,
      boxShadow: this.editableStyles.boxShadow
    };
  }

  onOverlayClick(event: MouseEvent) {
    this.cancel();
  }

  cancel() {
    this.closed.emit();
  }

  close() {
    this.cancel();
  }

  apply() {
    const updatedConfig: IsolatedModeConfig = {
      ...this.config,
      content: {
        ...this.config.content,
        title: this.editableContent.title,
        description: this.editableContent.description
      },
      styles: {
        ...this.config.styles,
        backgroundColor: this.editableStyles.backgroundColor,
        border: `${this.editableStyles.borderWidth}px solid ${this.editableStyles.borderColor}`,
        borderRadius: `${this.editableStyles.borderRadius}${this.borderRadiusUnit}`,
        boxShadow: this.editableStyles.boxShadow,
        padding: `${this.editableStyles.padding}${this.paddingUnit}`
      },
      position: { ...this.currentPosition },
      size: { ...this.currentSize }
    };
    this.applied.emit(updatedConfig);
    this.closed.emit();
  }
}
