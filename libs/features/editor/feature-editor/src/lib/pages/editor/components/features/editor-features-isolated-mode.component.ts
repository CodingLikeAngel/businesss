import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { 
  UICardAnimatedComponent
} from '@negocio/ui-components';
import { AppState } from '../../../../store/state/app.state';
import { selectCurrentPageGlobalStyles } from '../../../../store/selectors/page.selectors';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';
export { IsolatedModeConfig };

export interface UndoRedoState {
  items: any[];
  content: any;
  styles: any;
}

@Component({
  selector: 'lib-editor-features-isolated-mode',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    UICardAnimatedComponent
  ],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🎯 MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">FEATURES GRID - PREMIUM EDITOR</span>
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
              
              <!-- SECCIÓN: CABECERA DE SECCIÓN -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📝</span>
                  <h4>CABECERA DE SECCIÓN</h4>
                </div>
                
                <div class="control-group">
                  <label>Título de la Sección</label>
                  <input type="text" [(ngModel)]="editableContent.title" (ngModelChange)="onPartialChange()" class="premium-input" placeholder="Nuestras Ventajas">
                </div>

                <div class="control-group">
                  <label>Descripción / Subtítulo</label>
                  <textarea [(ngModel)]="editableContent.subtitle" (ngModelChange)="onPartialChange()" class="premium-input h-20" placeholder="Por qué elegirnos..."></textarea>
                </div>
              </div>

              <!-- SECCIÓN: CONFIGURACIÓN GRID -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📐</span>
                  <h4>LAYOUT & GRID</h4>
                </div>
                
                <div class="control-group">
                  <label>Columnas (Escritorio)</label>
                  <div class="grid-cols-selector">
                    <button *ngFor="let n of [1,2,3,4,5,6]" 
                            [class.active]="editableContent.gridCols === n" 
                            (click)="editableContent.gridCols = n; onPartialChange()">
                      {{ n }}
                    </button>
                  </div>
                </div>

                <div class="control-group">
                  <label>Espaciado (Gap: {{ editableContent.gridGap }})</label>
                  <input type="range" min="0" max="40" step="2" [(ngModel)]="editableContent.gridGap" (ngModelChange)="onPartialChange()" class="premium-range">
                </div>

                <div class="control-group">
                  <label>Variante General Items</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onPartialChange()" class="premium-input">
                    <option value="default">Default</option>
                    <option value="glass">Glassmorphism</option>
                    <option value="neon">Neon Spark</option>
                    <option value="cyberpunk">Cyberpunk</option>
                    <option value="retro">Retro Arcade</option>
                  </select>
                </div>
              </div>

              <!-- SECCIÓN: ELEMENTOS (ITEMS) -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">✨</span>
                  <h4>ELEMENTOS ({{ editableItems.length }})</h4>
                  <button class="premium-add-btn" (click)="addItem()">+ Añadir</button>
                </div>
                
                <div class="items-list-premium">
                  <div *ngFor="let item of editableItems; let i = index" 
                       class="item-card" 
                       [class.active]="selectedItemIndex === i" 
                       (click)="selectItem(i)">
                    <div class="item-visual">
                      <span class="item-icon-preview">{{ item.icon || '⭐' }}</span>
                    </div>
                    <div class="item-info">
                      <span class="item-title">{{ item.title || 'Nueva Característica' }}</span>
                      <span class="item-meta">Item #{{ i + 1 }}</span>
                    </div>
                    <div class="item-actions">
                      <button class="delete-icon-btn" (click)="removeItem(i, $event)">✕</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- SECCIÓN: EDITOR DE ITEM SELECCIONADO -->
              <div class="sidebar-section no-border" *ngIf="selectedItemIndex !== -1">
                <div class="detail-editor-card">
                  <div class="section-header">
                    <span class="section-icon">✏️</span>
                    <h4>EDITAR ELEMENTO #{{ selectedItemIndex + 1 }}</h4>
                  </div>

                  <div class="control-group">
                    <label>Icono (Emoji / SVG Name)</label>
                    <input type="text" [(ngModel)]="editableItems[selectedItemIndex].icon" (ngModelChange)="onPartialChange()" class="premium-input">
                  </div>

                  <div class="control-group">
                    <label>Título</label>
                    <input type="text" [(ngModel)]="editableItems[selectedItemIndex].title" (ngModelChange)="onPartialChange()" class="premium-input">
                  </div>

                  <div class="control-group">
                    <label>Descripción</label>
                    <textarea [(ngModel)]="editableItems[selectedItemIndex].description" (ngModelChange)="onPartialChange()" class="premium-input h-24"></textarea>
                  </div>

                  <div class="control-group">
                    <label>Variante Específica</label>
                    <select [(ngModel)]="editableItems[selectedItemIndex].variant" (ngModelChange)="onPartialChange()" class="premium-input">
                       <option [value]="undefined">Heredar General</option>
                       <option value="default">Default</option>
                       <option value="glass">Glass</option>
                       <option value="neon">Neon</option>
                       <option value="cyberpunk">Cyberpunk</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Canvas Area -->
          <div class="isolated-canvas" [class.ambient-grid]="true">
            <div class="canvas-inner">
               
               <!-- Section Header Preview -->
               <div class="preview-section-header" *ngIf="editableContent.title || editableContent.subtitle">
                  <h2 class="preview-title">{{ editableContent.title }}</h2>
                  <p class="preview-subtitle">{{ editableContent.subtitle }}</p>
               </div>

               <!-- Grid Preview -->
               <div class="features-render-grid" 
                    [style.grid-template-columns]="'repeat(' + (editableContent.gridCols || 3) + ', 1fr)'"
                    [style.gap.px]="editableContent.gridGap || 20">
                 
                 <div *ngFor="let item of editableItems; let i = index" 
                      class="renderer-item-wrapper"
                      [class.is-editing]="selectedItemIndex === i"
                      (click)="selectItem(i)">
                    <lib-ui-components-card-animated
                      [icon]="item.icon"
                      [title]="item.title"
                      [description]="item.description"
                      [variant]="$any(item.variant || editableContent.variant || 'default')"
                      class="preview-card"
                    ></lib-ui-components-card-animated>
                    
                    <div class="item-id-badge">#{{ i + 1 }}</div>
                 </div>

               </div>
            </div>

            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">LAYOUT</span><span class="value text-indigo-400">{{ editableContent.gridCols }} Columnas</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">GAP</span><span class="value">{{ editableContent.gridGap }}px</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">ELEMENTOS</span><span class="value">{{ editableItems.length }}</span></div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Consejo: Selecciona un elemento del grid para editar su contenido individualmente.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Colección</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .isolated-mode-overlay {
      position: fixed;
      inset: 0 !important;
      background: rgba(2, 6, 23, 0.96);
      backdrop-filter: blur(12px);
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
      box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.8);
      animation: premium-entry 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes premium-entry {
      from { opacity: 0; transform: translateY(20px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
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

    .mode-badge { font-size: 10px; font-weight: 800; color: #38bdf8; background: rgba(56, 189, 248, 0.1); padding: 5px 10px; border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.2); }
    .component-name { color: #f8fafc; font-size: 14px; font-weight: 700; margin-left: 10px; }
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
      transition: all 0.2s;
    }
    .icon-btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.08); color: white; }
    .icon-btn:disabled { opacity: 0.2; cursor: not-allowed; }

    .divider { width: 1px; height: 30px; background: rgba(255, 255, 255, 0.1); }

    .close-main-btn {
      width: 38px;
      height: 38px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #ef4444;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .close-main-btn:hover { background: #ef4444; color: white; }

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
    .section-header h4 { margin: 0; font-size: 11px; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }

    .control-group { margin-bottom: 1.2rem; }
    .control-group label { display: block; font-size: 10px; color: #94a3b8; margin-bottom: 0.6rem; font-weight: 600; }

    .premium-input {
      width: 100%;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: white;
      padding: 0.7rem 0.9rem;
      border-radius: 12px;
      font-size: 12px;
      transition: all 0.2s;
    }
    .premium-input:focus { border-color: #3b82f6; background: rgba(15, 23, 42, 0.9); outline: none; }

    .premium-range { width: 100%; height: 6px; background: #1e293b; border-radius: 10px; cursor: pointer; }

    .grid-cols-selector { display: flex; gap: 6px; }
    .grid-cols-selector button {
      flex: 1;
      height: 34px;
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.05);
      color: #94a3b8;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .grid-cols-selector button.active { background: #3b82f6; color: white; border-color: #60a5fa; box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); }

    .premium-add-btn {
      background: #10b981;
      color: white;
      border: none;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .items-list-premium { display: flex; flex-direction: column; gap: 10px; }
    .item-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.3s;
    }
    .item-card:hover { background: rgba(30, 41, 59, 0.7); border-color: rgba(255, 255, 255, 0.1); transform: translateX(5px); }
    .item-card.active { background: rgba(59, 130, 246, 0.1); border-color: #3b82f6; }

    .item-visual {
      width: 36px;
      height: 36px;
      background: #0f172a;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .item-info { flex: 1; overflow: hidden; }
    .item-title { display: block; color: white; font-size: 12px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .item-meta { font-size: 10px; color: #64748b; font-weight: 500; }

    .delete-icon-btn { background: transparent; border: none; color: #ef444455; font-size: 14px; cursor: pointer; transition: color 0.2s; }
    .item-card:hover .delete-icon-btn { color: #ef4444; }

    .detail-editor-card {
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: 16px;
      padding: 1.2rem;
    }

    .isolated-canvas {
      flex: 1;
      background: #020617;
      position: relative;
      overflow: hidden;
      background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 40px 40px;
    }

    .canvas-inner { width: 100%; height: 100%; overflow-y: auto; padding: 100px; display: flex; flex-direction: column; align-items: center; }
    
    .preview-section-header { text-align: center; margin-bottom: 60px; max-width: 700px; }
    .preview-title { color: white; font-size: 42px; font-weight: 800; margin-bottom: 1rem; }
    .preview-subtitle { color: #94a3b8; font-size: 18px; line-height: 1.6; }

    .features-render-grid { display: grid; width: 100%; max-width: 1200px; }
    .renderer-item-wrapper { position: relative; border-radius: 20px; border: 2px solid transparent; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); cursor: pointer; }
    .renderer-item-wrapper.is-editing { border-color: #3b82f6; transform: scale(1.03); box-shadow: 0 20px 40px -10px rgba(59, 130, 246, 0.4); z-index: 10; }
    .renderer-item-wrapper:hover:not(.is-editing) { border-color: rgba(255, 255, 255, 0.1); }
    
    .preview-card { width: 100%; pointer-events: none; }
    
    .item-id-badge { position: absolute; top: -10px; left: -10px; background: #3b82f6; color: white; font-size: 10px; font-weight: 800; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4); }

    .modern-position-dock { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); padding: 0.6rem 1.4rem; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.08); display: flex; gap: 1.5rem; color: white; font-size: 11px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); }
    .dock-divider { width: 1px; background: rgba(255, 255, 255, 0.1); }
    .dock-item { display: flex; align-items: center; gap: 0.5rem; }
    .dock-item .label { color: #64748b; font-weight: 800; }

    .isolated-mode-footer { height: 72px; padding: 0 2rem; background: #1e293b; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.08); }
    .footer-hint { font-size: 12px; color: #94a3b8; font-style: italic; }
    .btn-clean { padding: 0.7rem 1.8rem; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; font-size: 13px; transition: all 0.2s; }
    .btn-clean.primary { background: #3b82f6; color: white; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2); }
    .btn-clean.secondary { background: transparent; color: #94a3b8; }
    .btn-clean.secondary:hover { color: white; background: rgba(255, 255, 255, 0.05); }
  `]
})
export class EditorFeaturesIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() config!: IsolatedModeConfig;
  @Output() closed = new EventEmitter<void>();
  @Output() applied = new EventEmitter<IsolatedModeConfig>();

  private store = inject(Store<AppState>);
  globalColors$: Observable<string[]> = this.store.select(selectCurrentPageGlobalStyles).pipe(
    map(styles => styles ? [styles.primaryColor, styles.secondaryColor, styles.accentColor] : [])
  );

  // State
  editableItems: any[] = [];
  editableContent: any = {};
  selectedItemIndex = -1;
  
  // Undo/Redo
  undoStack: UndoRedoState[] = [];
  redoStack: UndoRedoState[] = [];

  private destroy$ = new Subject<void>();
  private saveTimeout: any;

  get canUndo() { return this.undoStack.length > 1; }
  get canRedo() { return this.redoStack.length > 0; }

  ngOnInit() {
    this.initializeState();
  }

  private initializeState() {
    this.editableItems = JSON.parse(JSON.stringify(this.config.content.items || []));
    this.editableContent = {
      title: this.config.content.title || '',
      subtitle: this.config.content.subtitle || '',
      gridCols: this.config.content.gridCols || 3,
      gridGap: this.config.content.gridGap || 20,
      variant: this.config.content.variant || 'default'
    };

    if (this.editableItems.length > 0) {
      this.selectedItemIndex = 0;
    }

    this.saveState();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- ACTIONS ---
  saveState() {
    const state: UndoRedoState = {
      items: JSON.parse(JSON.stringify(this.editableItems)),
      content: { ...this.editableContent },
      styles: { ...this.config.styles }
    };
    this.undoStack.push(state);
    this.redoStack = [];
    
    if (this.undoStack.length > 50) this.undoStack.shift();
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
    this.editableItems = JSON.parse(JSON.stringify(state.items));
    this.editableContent = { ...state.content };
  }

  onPartialChange() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => this.saveState(), 800);
  }

  selectItem(index: number) {
    this.selectedItemIndex = index;
  }

  addItem() {
    this.editableItems.push({
      icon: '✨',
      title: 'Nueva Característica',
      description: 'Una característica asombrosa de tu negocio que encantará a tus clientes.',
      variant: 'default'
    });
    this.selectedItemIndex = this.editableItems.length - 1;
    this.saveState();
  }

  removeItem(index: number, e: MouseEvent) {
    e.stopPropagation();
    this.editableItems.splice(index, 1);
    if (this.selectedItemIndex >= this.editableItems.length) {
      this.selectedItemIndex = this.editableItems.length - 1;
    }
    this.saveState();
  }

  onOverlayClick(event: MouseEvent) { this.closed.emit(); }
  close() { this.closed.emit(); }
  cancel() { this.closed.emit(); }

  apply() {
    const config: IsolatedModeConfig = {
      ...this.config,
      content: { 
        ...this.config.content,
        ...this.editableContent,
        items: this.editableItems
      }
    };
    this.applied.emit(config);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') this.close();
    if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
      event.preventDefault();
      this.undo();
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
      event.preventDefault();
      this.redo();
    }
  }
}
