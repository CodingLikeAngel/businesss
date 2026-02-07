import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIButtonComponent } from '@negocio/ui-components';
import { SimpleVisualEditorService } from '@negocio/shared-components';
import { Subject } from 'rxjs';

export interface IsolatedModeConfig {
  sectionId: string;
  elementId: string;
  variant: string;
  globalVariant?: string;
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
  selector: 'lib-editor-button-isolated-mode',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    UIButtonComponent
  ],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🎯 MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">BOTÓN UNIVERSAL - DISEÑO & POSICIÓN</span>
          </div>
          
          <div class="header-actions">
            <div class="action-group">
              <button class="icon-btn" (click)="undo()" [disabled]="!canUndo" title="Deshacer (Ctrl+Z)">
                <span class="icon">↶</span>
              </button>
              <button class="icon-btn" (click)="redo()" [disabled]="!canRedo" title="Rehacer (Ctrl+Y)">
                <span class="icon">↷</span>
              </button>
            </div>
            
            <div class="divider"></div>
            
            <div class="action-group">
              <button class="icon-btn" (click)="toggleGrid()" 
                      [class.active]="showGrid" 
                      title="Cuadrícula (G)">
                <span class="icon">#</span>
              </button>
              <button class="icon-btn" (click)="toggleSnap()" 
                      [class.active]="snapToGrid" 
                      title="Snap (S)">
                <span class="icon">⊞</span>
              </button>
              <button class="icon-btn" (click)="resetPosition()" title="Reset (R)">
                <span class="icon">↺</span>
              </button>
            </div>

            <div class="divider"></div>

            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">
              ✕
            </button>
          </div>
        </div>

        <div class="isolated-mode-body">
          <!-- Sidebar Controls -->
          <div class="controls-sidebar">
            <div class="sidebar-scroll-content">
              <!-- SECCIÓN: APARIENCIA -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">✨</span>
                  <h4>APARIENCIA</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <div class="select-wrapper">
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onVariantChange()" class="premium-select">
                    <option value="">Página (Heredar)</option>
                    <option value="primary">Primario</option>
                    <option value="secondary">Secundario</option>
                    <option value="accent">Acento</option>
                    <option value="glass">Glass</option>
                    <option value="ghost">Ghost</option>
                    <option value="outline">Outline</option>
                  </select>
                  </div>
                </div>

                <div class="control-group">
                  <label>Esquinas Redondeadas</label>
                  <div class="select-wrapper">
                    <select [(ngModel)]="editableContent.rounded" (ngModelChange)="onContentChange()" class="premium-select">
                      <option value="none">Recto</option>
                      <option value="md">Suave</option>
                      <option value="full">Total (Píldora)</option>
                    </select>
                  </div>
                </div>

                <div class="control-group">
                  <label>Tamaño</label>
                  <div class="select-wrapper">
                    <select [(ngModel)]="editableContent.size" (ngModelChange)="onContentChange()" class="premium-select">
                      <option value="sm">Pequeño</option>
                      <option value="md">Normal</option>
                      <option value="lg">Grande</option>
                    </select>
                  </div>
                </div>

                <div class="control-group">
                  <label>Modo Oscuro</label>
                  <div class="toggle-wrapper" (click)="toggleDarkMode()" [class.active]="editableContent.dark">
                    <div class="toggle-track">
                      <div class="toggle-thumb"></div>
                    </div>
                    <span>{{ editableContent.dark ? 'OSCURO' : 'CLARO' }}</span>
                  </div>
                </div>
              </div>

              <!-- SECCIÓN: CONTENIDO -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📝</span>
                  <h4>CONTENIDO</h4>
                </div>
                
                <div class="control-group">
                  <label>Texto del Botón</label>
                  <input type="text" [(ngModel)]="editableContent.label" (ngModelChange)="onContentChange()" class="premium-input" placeholder="Haz clic aquí...">
                </div>

                <div class="control-group">
                  <label>Icono Principal (Leading)</label>
                  <div class="select-wrapper">
                    <select [(ngModel)]="editableContent.leadingIcon" (ngModelChange)="onContentChange()" class="premium-select">
                      <option [value]="undefined">Ninguno</option>
                      <option value="heroStar">Estrella</option>
                      <option value="heroRocketLaunch">Cohete</option>
                      <option value="heroArrowRight">Flecha</option>
                    </select>
                  </div>
                </div>

                <div class="control-group">
                  <label>Icono Secundario (Trailing)</label>
                  <div class="select-wrapper">
                    <select [(ngModel)]="editableContent.trailingIcon" (ngModelChange)="onContentChange()" class="premium-select">
                      <option [value]="undefined">Ninguno</option>
                      <option value="heroStar">Estrella</option>
                      <option value="heroRocketLaunch">Cohete</option>
                      <option value="heroArrowRight">Flecha</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- SECCIÓN: COLORES PERSONALIZADOS -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>COLORES Y ESTILOS</h4>
                </div>
                
                <div class="control-group">
                  <label>Color de Fondo</label>
                  <div class="color-input-wrapper">
                    <div class="color-preview" [style.background-color]="editableStyles.backgroundColor">
                      <input type="color" [(ngModel)]="editableStyles.backgroundColor" (ngModelChange)="onStyleChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableStyles.backgroundColor" (ngModelChange)="onStyleChange()" class="premium-input hex-input">
                  </div>
                </div>

                <div class="control-group">
                  <label>Color de Texto</label>
                  <div class="color-input-wrapper">
                    <div class="color-preview" [style.background-color]="editableStyles.color">
                      <input type="color" [(ngModel)]="editableStyles.color" (ngModelChange)="onStyleChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableStyles.color" (ngModelChange)="onStyleChange()" class="premium-input hex-input">
                  </div>
                </div>
              </div>

              <!-- SECCIÓN: DIMENSIONES -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">📐</span>
                  <h4>POSICIÓN Y TAMAÑO</h4>
                </div>
                <div class="control-row">
                  <div class="control-group">
                    <label>Posición X</label>
                    <div class="input-with-icon">
                      <span class="axis">X</span>
                      <input type="number" [(ngModel)]="currentPosition.x" (ngModelChange)="onPositionChange()" class="premium-input">
                    </div>
                  </div>
                  <div class="control-group">
                    <label>Posición Y</label>
                    <div class="input-with-icon">
                      <span class="axis">Y</span>
                      <input type="number" [(ngModel)]="currentPosition.y" (ngModelChange)="onPositionChange()" class="premium-input">
                    </div>
                  </div>
                </div>
                <div class="control-row">
                  <div class="control-group">
                    <label>Ancho (W)</label>
                    <input type="number" [(ngModel)]="currentSize.width" (ngModelChange)="onSizeChange()" class="premium-input">
                  </div>
                  <div class="control-group">
                    <label>Alto (H)</label>
                    <input type="number" [(ngModel)]="currentSize.height" (ngModelChange)="onSizeChange()" class="premium-input">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Canvas Area -->
          <div class="isolated-canvas" 
               #canvas
             [class.show-grid]="showGrid"
             [class.grid-snapping]="snapToGrid"
             [class.ambient-dark]="editableContent.dark"
             [style.background-size]="gridSize + 'px ' + gridSize + 'px'">
            
            <div class="canvas-inner" #canvasInner>
              <!-- GHOST PREVIEW -->
              <div class="ghost-wrapper"
                   *ngIf="isDragging || isResizing"
                   [style.left.px]="initialPosition.x"
                   [style.top.px]="initialPosition.y"
                   [style.width.px]="initialSize.width"
                   [style.height.px]="initialSize.height">
              </div>

              <div class="draggable-wrapper"
                   #draggableWrapper
                   [style.left.px]="currentPosition.x"
                   [style.top.px]="currentPosition.y"
                   [style.width.px]="currentSize.width"
                   [style.height.px]="currentSize.height"
                   [class.snapping]="snapToGrid && isDragging"
                   [class.is-dragging]="isDragging"
                   [class.is-resizing]="isResizing"
                   (mousedown)="onMouseDown($event)">
                
                <lib-ui-components-button
                  [variant]="editableContent.variant || 'primary'"
                  [rounded]="editableContent.rounded || 'md'"
                  [size]="editableContent.size || 'md'"
                  [dark]="editableContent.dark || false"
                  [leadingIcon]="editableContent.leadingIcon"
                  [trailingIcon]="editableContent.trailingIcon"
                  [customStyles]="getCustomStyles()"
                  style="width: 100%; height: 100%; display: block;">
                  {{ editableContent.label }}
                </lib-ui-components-button>

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
            <div class="modern-position-dock">
              <div class="dock-item">
                <span class="label">X</span>
                <span class="value">{{ currentPosition.x }}px</span>
              </div>
              <div class="dock-item">
                <span class="label">Y</span>
                <span class="value">{{ currentPosition.y }}px</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">WIDTH</span>
                <span class="value">{{ currentSize.width }}px</span>
              </div>
              <div class="dock-item">
                <span class="label">HEIGHT</span>
                <span class="value">{{ currentSize.height }}px</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">
             Usar <b>G</b> (rejilla), <b>S</b> (snap), <b>R</b> (reset) o flechas.
          </div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary-accent: #6366f1;
      --primary-accent-glow: rgba(99, 102, 241, 0.4);
      --bg-darker: #020617;
      --bg-surface: #0f172a;
      --bg-header: #1e293b;
      --border-color: rgba(255, 255, 255, 0.08);
      --text-dim: #94a3b8;
      --sidebar-width: 320px;
    }

    .isolated-mode-overlay {
      position: fixed;
      inset: 0 !important;
      background: rgba(2, 6, 23, 0.95);
      backdrop-filter: blur(16px);
      z-index: 9999999 !important;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5vh 1.5vw;
    }

    .isolated-mode-container {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 24px;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: container-entry 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes container-entry {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }

    .isolated-mode-header {
      height: 70px;
      padding: 0 1.5rem;
      background: var(--bg-header);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .mode-badge {
      font-size: 10px;
      font-weight: 800;
      color: var(--primary-accent);
      background: rgba(99, 102, 241, 0.15);
      padding: 4px 8px;
      border-radius: 6px;
    }

    .component-name { color: #f8fafc; font-size: 14px; font-weight: 700; }

    .header-actions { display: flex; align-items: center; gap: 1rem; }

    .icon-btn {
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      color: var(--text-dim);
      border-radius: 10px;
      cursor: pointer;
    }

    .icon-btn.active {
      background: var(--primary-accent);
      color: white;
    }

    .close-main-btn {
      width: 38px;
      height: 38px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #ef4444;
      border-radius: 10px;
      cursor: pointer;
    }

    .isolated-mode-body { flex: 1; display: flex; overflow: hidden; }

    .controls-sidebar {
      width: var(--sidebar-width);
      background: #020617;
      border-right: 1px solid var(--border-color);
      overflow-y: auto;
    }

    .sidebar-scroll-content { padding: 1.5rem; }

    .sidebar-section {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .section-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
    .section-header h4 { margin: 0; font-size: 12px; color: var(--text-dim); letter-spacing: 0.1em; }

    .control-group { margin-bottom: 1rem; }
    .control-group label { display: block; font-size: 11px; color: var(--text-dim); margin-bottom: 0.5rem; }

    .premium-input, .premium-select {
      width: 100%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 10px;
      font-size: 13px;
    }

    .toggle-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .toggle-track {
      width: 34px;
      height: 18px;
      background: #1e293b;
      border-radius: 20px;
      position: relative;
    }

    .toggle-thumb {
      width: 14px;
      height: 14px;
      background: white;
      border-radius: 50%;
      position: absolute;
      top: 2px;
      left: 2px;
      transition: all 0.2s;
    }

    .active .toggle-track { background: var(--primary-accent); }
    .active .toggle-thumb { left: 18px; }

    .isolated-canvas {
      flex: 1;
      background: #f1f5f9;
      background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
      background-size: 20px 20px;
      position: relative;
      overflow: auto;
      padding: 100px;
    }

    .isolated-canvas.ambient-dark { background-color: #020617; background-image: radial-gradient(#1e293b 1px, transparent 1px); }

    .canvas-inner { width: 2000px; height: 2000px; position: relative; }

    .draggable-wrapper {
      position: absolute;
      cursor: move;
      outline: 2px solid transparent;
      transition: outline 0.2s;
    }

    .draggable-wrapper:hover { outline: 2px solid var(--primary-accent); }

    .resize-handle {
      position: absolute;
      width: 10px;
      height: 10px;
      background: var(--primary-accent);
      border: 2px solid white;
      border-radius: 50%;
      z-index: 10;
    }

    .resize-handle.se { bottom: -5px; right: -5px; cursor: se-resize; }
    .resize-handle.sw { bottom: -5px; left: -5px; cursor: sw-resize; }
    .resize-handle.ne { top: -5px; right: -5px; cursor: ne-resize; }
    .resize-handle.nw { top: -5px; left: -5px; cursor: nw-resize; }
    .resize-handle.n { top: -5px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
    .resize-handle.s { bottom: -5px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
    .resize-handle.e { top: 50%; right: -5px; transform: translateY(-50%); cursor: e-resize; }
    .resize-handle.w { top: 50%; left: -5px; transform: translateY(-50%); cursor: w-resize; }

    .ghost-wrapper {
      position: absolute;
      border: 2px dashed var(--primary-accent);
      opacity: 0.3;
      pointer-events: none;
    }

    .modern-position-dock {
      position: sticky;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.9);
      backdrop-filter: blur(8px);
      padding: 0.5rem 1.5rem;
      border-radius: 20px;
      display: flex;
      gap: 1.5rem;
      border: 1px solid var(--border-color);
      color: white;
      font-size: 11px;
      z-index: 100;
    }

    .dock-item { display: flex; flex-direction: column; align-items: center; }
    .dock-item .label { color: var(--text-dim); font-weight: 800; font-size: 9px; }

    .isolated-mode-footer {
      height: 60px;
      padding: 0 1.5rem;
      background: var(--bg-header);
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--border-color);
    }

    .btn-clean {
      padding: 0.5rem 1.5rem;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      border: none;
    }

    .btn-clean.primary { background: var(--primary-accent); color: white; }
    .btn-clean.secondary { background: transparent; color: var(--text-dim); }
  `]
})
export class EditorButtonIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() config!: IsolatedModeConfig;
  @Output() closed = new EventEmitter<void>();
  @Output() applied = new EventEmitter<IsolatedModeConfig>();

  @ViewChild('canvas') canvas!: ElementRef;

  // State
  editableContent: any = {};
  editableStyles: any = {};
  currentPosition = { x: 0, y: 0 };
  currentSize = { width: 0, height: 0 };
  initialPosition = { x: 0, y: 0 };
  initialSize = { width: 0, height: 0 };

  // Undo/Redo
  undoStack: UndoRedoState[] = [];
  redoStack: UndoRedoState[] = [];

  // Interaction
  isDragging = false;
  isResizing = false;
  resizeHandle = '';
  dragStartX = 0;
  dragStartY = 0;
  startPositionX = 0;
  startPositionY = 0;
  startSizeWidth = 0;
  startSizeHeight = 0;

  // Grid
  showGrid = true;
  snapToGrid = true;
  gridSize = 20;

  private destroy$ = new Subject<void>();
  private saveTimeout: any;

  get canUndo() { return this.undoStack.length > 1; }
  get canRedo() { return this.redoStack.length > 0; }

  ngOnInit() {
    this.initializeState();
    this.setupMouseListeners();
  }

  private initializeState() {
    this.editableContent = {
      variant: this.config.content.variant || 'primary',
      rounded: this.config.content.rounded || 'md',
      size: this.config.content.size || 'md',
      dark: this.config.content.dark || false,
      label: this.config.content.label || 'Botón',
      leadingIcon: this.config.content.leadingIcon,
      trailingIcon: this.config.content.trailingIcon
    };

    this.editableStyles = {
      backgroundColor: this.config.styles.backgroundColor || '',
      color: this.config.styles.color || ''
    };

    this.currentPosition = { ...this.config.position };
    this.currentSize = { ...this.config.size };
    this.initialPosition = { ...this.config.position };
    this.initialSize = { ...this.config.size };

    this.saveState();
  }

  // --- MOUSE HANDLERS ---
  private setupMouseListeners() {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  ngOnDestroy() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMouseDown(event: MouseEvent) {
    event.preventDefault();
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
      const dx = event.clientX - this.dragStartX;
      const dy = event.clientY - this.dragStartY;
      let nx = this.startPositionX + dx;
      let ny = this.startPositionY + dy;
      if (this.snapToGrid) {
        nx = Math.round(nx / this.gridSize) * this.gridSize;
        ny = Math.round(ny / this.gridSize) * this.gridSize;
      }
      this.currentPosition.x = nx;
      this.currentPosition.y = ny;
    } else if (this.isResizing) {
      const dx = event.clientX - this.dragStartX;
      const dy = event.clientY - this.dragStartY;
      let nw = this.startSizeWidth;
      let nh = this.startSizeHeight;
      let nx = this.startPositionX;
      let ny = this.startPositionY;

      if (this.resizeHandle.includes('e')) nw = this.startSizeWidth + dx;
      if (this.resizeHandle.includes('w')) { nw = this.startSizeWidth - dx; nx = this.startPositionX + dx; }
      if (this.resizeHandle.includes('s')) nh = this.startSizeHeight + dy;
      if (this.resizeHandle.includes('n')) { nh = this.startSizeHeight - dy; ny = this.startPositionY + dy; }

      if (this.snapToGrid) {
        nw = Math.round(nw / this.gridSize) * this.gridSize;
        nh = Math.round(nh / this.gridSize) * this.gridSize;
        nx = Math.round(nx / this.gridSize) * this.gridSize;
        ny = Math.round(ny / this.gridSize) * this.gridSize;
      }

      this.currentSize.width = Math.max(40, nw);
      this.currentSize.height = Math.max(30, nh);
      this.currentPosition.x = nx;
      this.currentPosition.y = ny;
    }
  }

  private onMouseUp = () => {
    if (this.isDragging || this.isResizing) {
      this.isDragging = false;
      this.isResizing = false;
      this.saveState();
    }
  }

  // --- ACTIONS ---
  saveState() {
    const state = {
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
      this.redoStack.push(this.undoStack.pop()!);
      this.restoreState(this.undoStack[this.undoStack.length - 1]);
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop()!;
      this.undoStack.push(state);
      this.restoreState(state);
    }
  }

  private restoreState(state: UndoRedoState) {
    this.currentPosition = { ...state.position };
    this.currentSize = { ...state.size };
    this.editableStyles = { ...state.styles };
    this.editableContent = { ...state.content };
  }

  onPositionChange() { this.scheduleSave(); }
  onSizeChange() { this.scheduleSave(); }
  onStyleChange() { this.scheduleSave(); }
  onContentChange() { this.scheduleSave(); }

  private scheduleSave() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => this.saveState(), 1000);
  }

  toggleGrid() { this.showGrid = !this.showGrid; }
  toggleSnap() { this.snapToGrid = !this.snapToGrid; }
  toggleDarkMode() { this.editableContent.dark = !this.editableContent.dark; this.onContentChange(); }
  onVariantChange() { this.onContentChange(); }
  
  resetPosition() {
    this.currentPosition = { ...this.initialPosition };
    this.currentSize = { ...this.initialSize };
    this.saveState();
  }

  getCustomStyles() {
    const s: any = {};
    if (this.editableStyles.backgroundColor) s.backgroundColor = this.editableStyles.backgroundColor;
    if (this.editableStyles.color) s.color = this.editableStyles.color;
    return s;
  }

  onOverlayClick(event: MouseEvent) { this.closed.emit(); }
  close() { this.closed.emit(); }
  cancel() { this.closed.emit(); }

  apply() {
    const config: IsolatedModeConfig = {
      ...this.config,
      content: { ...this.editableContent },
      styles: {
        ...this.getCustomStyles(),
        left: `${this.currentPosition.x}px`,
        top: `${this.currentPosition.y}px`,
        width: `${this.currentSize.width}px`,
        height: `${this.currentSize.height}px`,
        position: 'absolute'
      },
      position: this.currentPosition,
      size: this.currentSize
    };
    this.applied.emit(config);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') this.close();
    if ((event.ctrlKey || event.metaKey) && event.key === 'z') this.undo();
    if ((event.ctrlKey || event.metaKey) && event.key === 'y') this.redo();
  }
}
