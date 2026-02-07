import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { 
  UIHeroSectionComponent, 
  UIHeroMinimalComponent, 
  UIHeroSplitComponent 
} from '@negocio/featured-components';
import { AppState } from '../../../../store/state/app.state';
import { selectCurrentPageGlobalStyles } from '../../../../store/selectors/page.selectors';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

/**
 * Hero Isolated Mode Configuration
 */
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
  selector: 'lib-editor-hero-isolated-mode',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    UIHeroSectionComponent,
    UIHeroMinimalComponent
  ],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🎯 MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">HERO SECTION - BRANDING & LAYOUT</span>
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
                  <label>Título Principal</label>
                  <input type="text" [(ngModel)]="editableContent.title" (ngModelChange)="onContentChange()" class="premium-input" placeholder="Título impactante...">
                </div>

                <div class="control-group">
                  <label>Subtítulo / Descripción</label>
                  <textarea [(ngModel)]="editableContent.subtitle" (ngModelChange)="onContentChange()" class="premium-input h-24" placeholder="Describe tu propuesta de valor..."></textarea>
                </div>

                <div class="control-row grid grid-cols-2 gap-2 mt-4">
                  <div class="control-group">
                    <label>Texto CTA</label>
                    <input type="text" [(ngModel)]="editableContent.ctaLabel" (ngModelChange)="onContentChange()" class="premium-input" placeholder="Comenzar">
                  </div>
                  <div class="control-group">
                    <label>Nombre Negocio</label>
                    <input type="text" [(ngModel)]="editableContent.businessName" (ngModelChange)="onContentChange()" class="premium-input" placeholder="Tu Marca">
                  </div>
                </div>
              </div>

              <!-- SECCIÓN: APARIENCIA & LAYOUT -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">✨</span>
                  <h4>DISEÑO & VARIANTES</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante de Layout</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onVariantChange()" class="premium-input">
                    <optgroup label="Estándar">
                      <option value="default">Clásico</option>
                      <option value="minimal">Minimalista</option>
                      <option value="split">Split (Dividido)</option>
                    </optgroup>
                    <optgroup label="Premium / Efectos">
                      <option value="glass">Glassmorphism</option>
                      <option value="matrix">Matrix Code</option>
                      <option value="cyberpunk">Cyberpunk Neon</option>
                      <option value="retro">Arcade Retro</option>
                      <option value="phoenix">Llamas Phoenix</option>
                      <option value="stellar">Estelar / Cosmos</option>
                    </optgroup>
                  </select>
                </div>

                <div class="flex items-center justify-between p-2 bg-slate-900/40 rounded-xl border border-white/5 mt-4">
                  <span class="text-[11px] text-slate-300 font-bold uppercase">Background con Video</span>
                  <div class="toggle-switch" [class.active]="editableContent.videoBackground" (click)="editableContent.videoBackground = !editableContent.videoBackground; onContentChange()">
                    <div class="toggle-thumb"></div>
                  </div>
                </div>

                <div *ngIf="editableContent.videoBackground" class="control-group mt-3">
                  <label>URL Video Background</label>
                  <input type="text" [(ngModel)]="editableContent.videoUrl" (ngModelChange)="onContentChange()" class="premium-input" placeholder="https://...">
                </div>
              </div>

              <!-- SECCIÓN: COLORES & BRANDING -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>COLORES & BRANDING</h4>
                </div>
                
                <div class="control-group">
                  <label>Color de Fondo (Fallback)</label>
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

              <!-- SECCIÓN: INTERACCIÓN -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🖱️</span>
                  <h4>INTERACCIÓN</h4>
                </div>
                
                <div class="space-y-3">
                  <div class="flex items-center justify-between p-2 bg-slate-900/40 rounded-xl border border-white/5">
                    <span class="text-[11px] text-slate-300 font-bold uppercase">Mostrar CTA</span>
                    <div class="toggle-switch" [class.active]="editableContent.showCta" (click)="editableContent.showCta = !editableContent.showCta; onContentChange()">
                      <div class="toggle-thumb"></div>
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-between p-2 bg-slate-900/40 rounded-xl border border-white/5">
                    <span class="text-[11px] text-slate-300 font-bold uppercase">Icono de Scroll</span>
                    <div class="toggle-switch" [class.active]="editableContent.showScrollIcon" (click)="editableContent.showScrollIcon = !editableContent.showScrollIcon; onContentChange()">
                      <div class="toggle-thumb"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- SECCIÓN: DIMENSIONES -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">📐</span>
                  <h4>DIMENSIONES CANVAS</h4>
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
                <p class="text-[10px] text-slate-500 italic mt-2">Nota: El modo aislado escala el componente para previsualización.</p>
              </div>

            </div>
          </div>

          <!-- Canvas Area -->
          <div class="isolated-canvas" #canvas [class.ambient-dark]="true">
            <div class="canvas-inner" #canvasInner>
              <div class="hero-preview-wrapper"
                   #draggableWrapper
                   [style.width.px]="currentSize.width"
                   [style.height.px]="currentSize.height"
                   [style.left.px]="currentPosition.x"
                   [style.top.px]="currentPosition.y">
                
                <!-- RENDERER DINÁMICO SEGÚN VARIANTE -->
                <ng-container [ngSwitch]="editableContent.variant">
                  <lib-ui-hero-minimal
                    *ngSwitchCase="'minimal'"
                    [title]="editableContent.title"
                    [subtitle]="editableContent.subtitle"
                    [ctaLabel]="editableContent.ctaLabel"
                    [showCta]="editableContent.showCta"
                    [variant]="'dark'"
                    [customStyles]="getHeroStyles()"
                    class="hero-instance">
                  </lib-ui-hero-minimal>

                  <lib-ui-hero-section
                    *ngSwitchDefault
                    [title]="editableContent.title"
                    [subtitle]="editableContent.subtitle"
                    [ctaLabel]="editableContent.ctaLabel"
                    [businessName]="editableContent.businessName"
                    [variant]="editableContent.variant || 'default'"
                    [showCta]="editableContent.showCta"
                    [showScrollIcon]="editableContent.showScrollIcon"
                    [videoBackground]="editableContent.videoBackground"
                    [videoUrl]="editableContent.videoUrl"
                    [customStyles]="getHeroStyles()"
                    class="hero-instance">
                  </lib-ui-hero-section>
                </ng-container>

                <!-- Resize Handles (Solo SE para Hero por simplicidad de layout) -->
                <div class="resize-handle se" (mousedown)="startResize($event, 'se')"></div>
              </div>
            </div>

            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">VARIANT</span><span class="value text-purple-400">{{ editableContent.variant | uppercase }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">SIZE</span><span class="value">{{ currentSize.width }}x{{ currentSize.height }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">VIDEO</span><span class="value">{{ editableContent.videoBackground ? 'ON' : 'OFF' }}</span></div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Consejo: Usa variates como 'Matrix' o 'Cyberpunk' para negocios tecnológicos.</div>
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

    .isolated-mode-body {
      flex: 1;
      display: flex;
      flex-direction: row; /* Explicit row */
      overflow: hidden;
    }

    .controls-sidebar {
      width: 380px;
      min-width: 380px; /* Safety */
      flex-shrink: 0; /* Prevent shrinking */
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

    .isolated-canvas { flex: 1; background: #020617; position: relative; overflow: hidden; background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px); background-size: 40px 40px; }
    .canvas-inner { width: 100%; height: 100%; position: relative; overflow: auto; padding: 200px; }
    
    .hero-preview-wrapper { 
      position: relative; 
      background: white; 
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); 
      overflow: hidden;
      transition: width 0.3s, height 0.3s;
    }
    
    .hero-instance { width: 100%; height: 100%; display: block; pointer-events: none; }
    
    .resize-handle { position: absolute; width: 18px; height: 18px; background: #6366f1; border: 3px solid white; border-radius: 6px; z-index: 100; }
    .resize-handle.se { bottom: -9px; right: -9px; cursor: se-resize; }

    .modern-position-dock { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); padding: 0.6rem 1.2rem; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.08); display: flex; gap: 1.5rem; color: white; font-size: 11px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); }
    .dock-divider { width: 1px; background: rgba(255, 255, 255, 0.1); }
    .dock-item { display: flex; align-items: center; gap: 0.5rem; }
    .dock-item .label { color: #64748b; font-weight: 800; }

    .isolated-mode-footer { height: 72px; padding: 0 2rem; background: #1e293b; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.08); }
    .footer-hint { font-size: 12px; color: #94a3b8; font-style: italic; }
    .btn-clean { padding: 0.6rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; font-size: 13px; transition: all 0.2s; }
    .btn-clean.primary { background: #6366f1; color: white; }
    .btn-clean.secondary { background: transparent; color: #94a3b8; }
  `]
})
export class EditorHeroIsolatedModeComponent implements OnInit, OnDestroy {
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
  currentSize = { width: 1200, height: 600 };
  
  // Undo/Redo
  undoStack: UndoRedoState[] = [];
  redoStack: UndoRedoState[] = [];

  // Interaction
  isDragging = false;
  isResizing = false;
  resizeHandle = '';
  dragStartX = 0;
  dragStartY = 0;
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
    // Sync with section content
    this.editableContent = {
      variant: this.config.content.variant || 'default',
      title: this.config.content.title || 'Título',
      subtitle: this.config.content.subtitle || 'Subtítulo',
      ctaLabel: this.config.content.ctaLabel || 'Saber Más',
      businessName: this.config.content.businessName || '',
      showCta: this.config.content.showCta !== false,
      showScrollIcon: this.config.content.showScrollIcon !== false,
      videoBackground: this.config.content.videoBackground !== false,
      videoUrl: this.config.content.videoUrl || 'https://www.w3schools.com/tags/mov_bbb.mp4'
    };

    this.editableStyles = {
      backgroundColor: this.config.styles.backgroundColor || '#111827',
      color: this.config.styles.color || '#ffffff'
    };

    // Calculate canvas centering
    this.currentSize = {
       width: parseInt(this.config.styles.width) || 1200,
       height: parseInt(this.config.styles.height) || 600
    };
    
    this.currentPosition = { x: 50, y: 50 }; // Visual offset in canvas

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

  startResize(event: MouseEvent, handle: string) {
    event.preventDefault();
    event.stopPropagation();
    this.isResizing = true;
    this.resizeHandle = handle;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.startSizeWidth = this.currentSize.width;
    this.startSizeHeight = this.currentSize.height;
  }

  private onMouseMove = (event: MouseEvent) => {
    if (this.isResizing) {
      const dx = event.clientX - this.dragStartX;
      const dy = event.clientY - this.dragStartY;
      
      let nw = this.startSizeWidth + dx;
      let nh = this.startSizeHeight + dy;

      this.currentSize.width = Math.max(800, nw);
      this.currentSize.height = Math.max(400, nh);
    }
  }

  private onMouseUp = () => {
    if (this.isResizing) {
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

  onSizeChange() { this.scheduleSave(); }
  onStyleChange() { this.scheduleSave(); }
  onContentChange() { this.scheduleSave(); }

  private scheduleSave() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => this.saveState(), 1000);
  }

  onVariantChange() { this.onContentChange(); }
  
  getHeroStyles() {
    return { ...this.editableStyles };
  }

  onOverlayClick(event: MouseEvent) { this.closed.emit(); }
  close() { this.closed.emit(); }
  cancel() { this.closed.emit(); }

  apply() {
    const config: IsolatedModeConfig = {
      ...this.config,
      content: { ...this.editableContent },
      styles: {
        ...this.getHeroStyles(),
        width: `${this.currentSize.width}px`,
        height: `${this.currentSize.height}px`,
        position: 'relative'
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
