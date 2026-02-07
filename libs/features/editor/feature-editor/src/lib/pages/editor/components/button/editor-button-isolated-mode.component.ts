import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UIButtonComponent } from '@negocio/ui-components';
import { AppState } from '../../../../store/state/app.state';
import { selectCurrentPageGlobalStyles } from '../../../../store/selectors/page.selectors';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

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
            <span class="component-name">BOTÓN UNIVERSAL - GRADIENTES & HOVER</span>
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
            
            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <div class="isolated-mode-body">
          <!-- Sidebar Controls -->
          <div class="controls-sidebar">
            <div class="sidebar-scroll-content">
              
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

                <div class="control-row grid grid-cols-2 gap-2 mt-4">
                  <div class="control-group">
                    <label>Icono Inicial</label>
                    <select [(ngModel)]="editableContent.leadingIcon" (ngModelChange)="onContentChange()" class="premium-input">
                      <option [value]="undefined">Ninguno</option>
                      <option value="heroStar">Estrella</option>
                      <option value="heroRocketLaunch">Cohete</option>
                      <option value="heroArrowRight">Flecha</option>
                    </select>
                  </div>
                  <div class="control-group">
                    <label>Icono Final</label>
                    <select [(ngModel)]="editableContent.trailingIcon" (ngModelChange)="onContentChange()" class="premium-input">
                      <option [value]="undefined">Ninguno</option>
                      <option value="heroStar">Estrella</option>
                      <option value="heroRocketLaunch">Cohete</option>
                      <option value="heroArrowRight">Flecha</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- SECCIÓN: APARIENCIA -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">✨</span>
                  <h4>ESTILO BASE</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onVariantChange()" class="premium-input">
                    <option value="primary">Primario</option>
                    <option value="secondary">Secundario</option>
                    <option value="accent">Acento</option>
                    <option value="glass">Glassmorphism</option>
                    <option value="ghost">Ghost</option>
                    <option value="outline">Outline</option>
                  </select>
                </div>

                <div class="control-row grid grid-cols-2 gap-2 mt-4">
                  <div class="control-group">
                    <label>Redondeado</label>
                    <select [(ngModel)]="editableContent.rounded" (ngModelChange)="onContentChange()" class="premium-input">
                      <option value="none">Recto</option>
                      <option value="md">Suave</option>
                      <option value="full">Cápsula</option>
                    </select>
                  </div>
                  <div class="control-group">
                    <label>Tamaño</label>
                    <select [(ngModel)]="editableContent.size" (ngModelChange)="onContentChange()" class="premium-input">
                      <option value="sm">Pequeño</option>
                      <option value="md">Medio</option>
                      <option value="lg">Grande</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- SECCIÓN: TIPOGRAFÍA -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🔤</span>
                  <h4>TIPOGRAFÍA</h4>
                </div>
                <div class="control-row grid grid-cols-2 gap-2">
                  <div class="control-group">
                    <label>Tamaño Fuente</label>
                    <input type="number" [(ngModel)]="editableStyles.fontSize" [style.fontSize.px]="13" (ngModelChange)="onStyleChange()" class="premium-input" placeholder="14">
                  </div>
                  <div class="control-group">
                    <label>Peso</label>
                    <select [(ngModel)]="editableStyles.fontWeight" (ngModelChange)="onStyleChange()" class="premium-input">
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="600">Semibold</option>
                      <option value="700">Bold</option>
                      <option value="800">Black</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- SECCIÓN: COLORES & GRADIENTES -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>FONDO & GRADIENTE</h4>
                </div>
                
                <div class="control-group mb-4">
                  <label>Tipo de Fondo</label>
                  <div class="flex bg-slate-900/50 p-1 rounded-lg gap-1 border border-white/5">
                    <button (click)="bgType = 'solid'; onStyleChange()" [class.active]="bgType === 'solid'" class="sub-tab-btn">Sólido</button>
                    <button (click)="bgType = 'gradient'; onStyleChange()" [class.active]="bgType === 'gradient'" class="sub-tab-btn">Gradiente</button>
                  </div>
                </div>

                <div *ngIf="bgType === 'solid'">
                  <div class="control-group">
                    <label>Color de Fondo</label>
                    <div class="color-control-wrapper">
                      <div class="color-input-wrapper">
                        <div class="color-preview" [style.background-color]="editableStyles.backgroundColor">
                          <input type="color" [(ngModel)]="editableStyles.backgroundColor" (ngModelChange)="onStyleChange()">
                        </div>
                        <input type="text" [(ngModel)]="editableStyles.backgroundColor" (ngModelChange)="onStyleChange()" class="premium-input hex-input">
                      </div>
                      <div class="theme-palette" *ngIf="globalColors$ | async as colors">
                        <div *ngFor="let c of colors" class="palette-swatch" [style.background-color]="c" (click)="editableStyles.backgroundColor = c; onStyleChange()"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div *ngIf="bgType === 'gradient'" class="space-y-4">
                  <div class="control-group">
                    <label>Color 1</label>
                    <div class="color-input-wrapper">
                      <div class="color-preview" [style.background-color]="gradColor1">
                        <input type="color" [(ngModel)]="gradColor1" (ngModelChange)="onStyleChange()">
                      </div>
                    </div>
                  </div>
                  <div class="control-group">
                    <label>Color 2</label>
                    <div class="color-input-wrapper">
                      <div class="color-preview" [style.background-color]="gradColor2">
                        <input type="color" [(ngModel)]="gradColor2" (ngModelChange)="onStyleChange()">
                      </div>
                    </div>
                  </div>
                </div>

                <div class="control-group mt-4">
                  <label>Color del Texto</label>
                  <div class="color-input-wrapper">
                    <div class="color-preview" [style.background-color]="editableStyles.color">
                      <input type="color" [(ngModel)]="editableStyles.color" (ngModelChange)="onStyleChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableStyles.color" (ngModelChange)="onStyleChange()" class="premium-input hex-input">
                  </div>
                </div>
              </div>

              <!-- SECCIÓN: EFECTOS HOVER -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">⚡</span>
                  <h4>EFECTOS HOVER</h4>
                </div>
                
                <div class="control-group">
                  <label>Color Fondo (Hover)</label>
                  <div class="color-input-wrapper">
                    <div class="color-preview" [style.background-color]="editableStyles['--btn-hover-bg']">
                      <input type="color" [(ngModel)]="editableStyles['--btn-hover-bg']" (ngModelChange)="onStyleChange()">
                    </div>
                  </div>
                </div>

                <div class="control-group">
                  <label>Escala (Hover): {{ hoverScale }}</label>
                  <input type="range" min="0.8" max="1.2" step="0.01" [(ngModel)]="hoverScale" (ngModelChange)="onStyleChange()" class="w-full">
                </div>
              </div>

              <!-- SECCIÓN: FEEDBACK -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🔊</span>
                  <h4>FEEDBACK</h4>
                </div>
                <div class="flex items-center justify-between p-2 bg-slate-900/40 rounded-xl border border-white/5 mb-3">
                  <span class="text-[11px] text-slate-300 font-bold uppercase">Sensación Háptica</span>
                  <div class="toggle-switch" [class.active]="editableContent.haptic" (click)="editableContent.haptic = !editableContent.haptic; onContentChange()">
                    <div class="toggle-thumb"></div>
                  </div>
                </div>
                <div class="control-group">
                  <label>Sonido URL (Clic)</label>
                  <input type="text" [(ngModel)]="editableContent.soundUrl" (ngModelChange)="onContentChange()" class="premium-input" placeholder="https://...">
                </div>
              </div>

              <!-- SECCIÓN: DIMENSIONES -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">📐</span>
                  <h4>POSICIÓN & TAMAÑO</h4>
                </div>
                <div class="control-row grid grid-cols-2 gap-2">
                  <div class="control-group">
                    <label>Posición X</label>
                    <input type="number" [(ngModel)]="currentPosition.x" (ngModelChange)="onPositionChange()" class="premium-input text-center">
                  </div>
                  <div class="control-group">
                    <label>Posición Y</label>
                    <input type="number" [(ngModel)]="currentPosition.y" (ngModelChange)="onPositionChange()" class="premium-input text-center">
                  </div>
                </div>
                <div class="control-row grid grid-cols-2 gap-2">
                  <div class="control-group">
                    <label>Ancho (W)</label>
                    <input type="number" [(ngModel)]="currentSize.width" (ngModelChange)="onSizeChange()" class="premium-input text-center">
                  </div>
                  <div class="control-group">
                    <label>Alto (H)</label>
                    <input type="number" [(ngModel)]="currentSize.height" (ngModelChange)="onSizeChange()" class="premium-input text-center">
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Canvas Area -->
          <div class="isolated-canvas" 
               #canvas
             [class.ambient-dark]="true">
            
            <div class="canvas-inner" #canvasInner>
              <div class="draggable-wrapper"
                   #draggableWrapper
                   [style.left.px]="currentPosition.x"
                   [style.top.px]="currentPosition.y"
                   [style.width.px]="currentSize.width"
                   [style.height.px]="currentSize.height"
                   (mousedown)="onMouseDown($event)">
                
                <lib-ui-components-button
                  [variant]="editableContent.variant || 'primary'"
                  [rounded]="editableContent.rounded || 'md'"
                  [size]="editableContent.size || 'md'"
                  [dark]="editableContent.dark || false"
                  [leadingIcon]="editableContent.leadingIcon"
                  [trailingIcon]="editableContent.trailingIcon"
                  [customStyles]="getCustomStyles()"
                  [haptic]="editableContent.haptic"
                  [soundUrl]="editableContent.soundUrl"
                  [style.transform]="'scale(' + hoverScale + ')'"
                  class="preview-btn"
                  style="width: 100%; height: 100%; display: block;">
                  {{ editableContent.label }}
                </lib-ui-components-button>

                <!-- Resize Handles -->
                <div class="resize-handle se" (mousedown)="startResize($event, 'se')"></div>
              </div>
            </div>

            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">X</span><span class="value">{{ currentPosition.x }}px</span></div>
              <div class="dock-item"><span class="label">Y</span><span class="value">{{ currentPosition.y }}px</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">SIZE</span><span class="value">{{ currentSize.width }}x{{ currentSize.height }}</span></div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Diseño proactivo: usa gradientes para llamar la atención sobre el CTA.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
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
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.08);
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
      background: #1e293b;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .mode-badge { font-size: 10px; font-weight: 800; color: #6366f1; background: rgba(99, 102, 241, 0.15); padding: 4px 8px; border-radius: 6px; }
    .component-name { color: #f8fafc; font-size: 14px; font-weight: 700; }
    .header-actions { display: flex; align-items: center; gap: 1rem; }

    .icon-btn {
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #94a3b8;
      border-radius: 10px;
      cursor: pointer;
    }
    .icon-btn:disabled { opacity: 0.3; cursor: not-allowed; }

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
      width: 320px;
      background: #020617;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      overflow-y: auto;
    }

    .sidebar-scroll-content { padding: 1.5rem; }
    .sidebar-section { margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    .sidebar-section.no-border { border-bottom: none; }
    .section-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
    .section-header h4 { margin: 0; font-size: 12px; color: #94a3b8; letter-spacing: 0.1em; }

    .control-group { margin-bottom: 1rem; }
    .control-group label { display: block; font-size: 11px; color: #94a3b8; margin-bottom: 0.5rem; }

    .premium-input {
      width: 100%;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: white;
      padding: 0.6rem 0.8rem;
      border-radius: 10px;
      font-size: 12px;
    }

    .sub-tab-btn { flex: 1; padding: 6px; font-size: 10px; font-weight: 800; color: #64748b; border-radius: 6px; transition: all 0.2s; background: transparent; border: none; cursor: pointer; }
    .sub-tab-btn.active { background: #6366f1; color: white; }

    .toggle-switch { width: 34px; height: 18px; background: #1e293b; border-radius: 20px; position: relative; cursor: pointer; transition: background 0.3s; }
    .toggle-switch.active { background: #6366f1; }
    .toggle-switch .toggle-thumb { width: 14px; height: 14px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: transform 0.3s; }
    .toggle-switch.active .toggle-thumb { transform: translateX(16px); }

    .color-control-wrapper { display: flex; flex-direction: column; gap: 0.5rem; }
    .color-input-wrapper { display: flex; gap: 0.8rem; }
    .color-preview { width: 38px; height: 38px; border-radius: 10px; position: relative; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.2); }
    .color-preview input { position: absolute; inset: -5px; width: 150%; height: 150%; cursor: pointer; }

    .theme-palette { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px; }
    .palette-swatch { width: 20px; height: 20px; border-radius: 4px; cursor: pointer; border: 1px solid rgba(255, 255, 255, 0.08); transition: transform 0.2s; }
    .palette-swatch:hover { transform: scale(1.2); z-index: 10; border-color: white; }

    .isolated-canvas { flex: 1; background: #020617; position: relative; overflow: hidden; background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px); background-size: 20px 20px; }
    .canvas-inner { width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center; }
    
    .draggable-wrapper { position: relative; cursor: move; border: 1px dashed rgba(99, 102, 241, 0.5); padding: 5px; }
    .resize-handle { position: absolute; width: 10px; height: 10px; background: #6366f1; border: 1.5px solid white; border-radius: 3px; bottom: -5px; right: -5px; cursor: se-resize; }
    .preview-btn { transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }

    .modern-position-dock { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); padding: 0.6rem 1.2rem; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.08); display: flex; gap: 1.5rem; color: white; font-size: 11px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); }
    .dock-divider { width: 1px; background: rgba(255, 255, 255, 0.1); }
    .dock-item { display: flex; align-items: center; gap: 0.5rem; }
    .dock-item .label { color: #64748b; font-weight: 800; }

    .isolated-mode-footer { height: 72px; padding: 0 2rem; background: #1e293b; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.08); }
    .footer-hint { font-size: 12px; color: #94a3b8; font-style: italic; }
    .btn-clean { padding: 0.6rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; font-size: 13px; transition: all 0.2s; }
    .btn-clean.primary { background: #6366f1; color: white; }
    .btn-clean.secondary { background: transparent; color: #94a3b8; }
    .btn-clean:hover { transform: translateY(-1px); opacity: 0.9; }
  `]
})
export class EditorButtonIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() config!: IsolatedModeConfig;
  @Output() closed = new EventEmitter<void>();
  @Output() applied = new EventEmitter<IsolatedModeConfig>();

  @ViewChild('canvas') canvas!: ElementRef;

  private store = inject(Store<AppState>);
  globalColors$: Observable<string[]> = this.store.select(selectCurrentPageGlobalStyles).pipe(
    map(styles => {
      if (!styles) return [];
      return [
        styles.primaryColor,
        styles.secondaryColor,
        styles.accentColor,
        styles.backgroundColor,
        styles.textColor
      ].filter(Boolean);
    })
  );

  // State
  editableContent: any = {};
  editableStyles: any = {};
  currentPosition = { x: 0, y: 0 };
  currentSize = { width: 0, height: 0 };
  initialPosition = { x: 0, y: 0 };
  initialSize = { width: 0, height: 0 };

  // Advanced Styles
  bgType: 'solid' | 'gradient' = 'solid';
  gradColor1 = '#6366f1';
  gradColor2 = '#a855f7';
  hoverScale = 1;

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
      trailingIcon: this.config.content.trailingIcon,
      haptic: this.config.content.haptic || false,
      soundUrl: this.config.content.soundUrl || ''
    };

    this.editableStyles = {
      backgroundColor: this.config.styles.backgroundColor || '',
      color: this.config.styles.color || '',
      fontSize: this.config.styles.fontSize || '',
      fontWeight: this.config.styles.fontWeight || '',
      '--btn-hover-bg': this.config.styles['--btn-hover-bg'] || '',
      '--btn-hover-shadow': this.config.styles['--btn-hover-shadow'] || ''
    };

    // Detect gradient
    if (this.editableStyles.backgroundColor?.startsWith('linear-gradient')) {
      this.bgType = 'gradient';
      const colors = this.editableStyles.backgroundColor.match(/#[a-fA-F0-9]{3,6}/g);
      if (colors && colors.length >= 2) {
        this.gradColor1 = colors[0];
        this.gradColor2 = colors[1];
      }
    }

    this.hoverScale = parseFloat(this.config.styles['--btn-hover-scale']) || 1;

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
      this.currentPosition.x = this.startPositionX + dx;
      this.currentPosition.y = this.startPositionY + dy;
    } else if (this.isResizing) {
      const dx = event.clientX - this.dragStartX;
      const dy = event.clientY - this.dragStartY;
      let nw = this.startSizeWidth;
      let nh = this.startSizeHeight;

      if (this.resizeHandle.includes('e')) nw = this.startSizeWidth + dx;
      if (this.resizeHandle.includes('s')) nh = this.startSizeHeight + dy;

      this.currentSize.width = Math.max(40, nw);
      this.currentSize.height = Math.max(30, nh);
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

  onVariantChange() { this.onContentChange(); }
  
  getCustomStyles() {
    const s: any = { ...this.editableStyles };
    
    if (this.bgType === 'gradient') {
      s.backgroundColor = `linear-gradient(45deg, ${this.gradColor1}, ${this.gradColor2})`;
    }
    
    s['--btn-hover-scale'] = this.hoverScale;
    
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
