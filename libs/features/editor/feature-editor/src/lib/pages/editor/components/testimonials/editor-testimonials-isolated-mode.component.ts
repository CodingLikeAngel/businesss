import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/state/app.state';
import { selectCurrentPageGlobalStyles } from '../../../../store/selectors/page.selectors';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

/**
 * Testimonials Isolated Mode Configuration
 */
export interface IsolatedModeConfig {
  sectionId: string;
  elementId: string;
  type: string;
  content: any;
  styles: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface UndoRedoState {
  items: any[];
  content: any;
  styles: any;
}

@Component({
  selector: 'lib-editor-testimonials-isolated-mode',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🎯 MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">TESTIMONIALS - PREMIUM FEEDBACK EDITOR</span>
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
                  <h4>CONCEPTO</h4>
                </div>
                
                <div class="control-group">
                  <label>Título de la Sección</label>
                  <input type="text" [(ngModel)]="editableContent.title" (ngModelChange)="onPartialChange()" class="premium-input" placeholder="Testimonios">
                </div>

                <div class="control-group">
                  <label>Subtítulo / Promo</label>
                  <input type="text" [(ngModel)]="editableContent.subtitle" (ngModelChange)="onPartialChange()" class="premium-input" placeholder="Nuestros clientes confían">
                </div>
              </div>

              <!-- SECCIÓN: CONFIGURACIÓN LAYOUT -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📐</span>
                  <h4>LAYOUT & ESTILO</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante de Layout</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onPartialChange()" class="premium-input">
                    <option value="default">Default (Grid)</option>
                    <option value="carousel">Carrusel Deslizante</option>
                    <option value="columns">Columnas de Altura Variable</option>
                    <option value="centered">Centrado Foco</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Diseño de Tarjetas</label>
                  <select [(ngModel)]="editableContent.cardVariant" (ngModelChange)="onPartialChange()" class="premium-input">
                    <option value="default">Clásico</option>
                    <option value="glass">Glassmorphism</option>
                    <option value="neon">Neon</option>
                    <option value="minimal">Minimalista</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Columnas (Mobile/Desktop)</label>
                  <div class="grid-cols-selector">
                    <button *ngFor="let n of [1,2,3,4]" 
                            [class.active]="editableContent.gridCols === n" 
                            (click)="editableContent.gridCols = n; onPartialChange()">
                      {{ n }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- SECCIÓN: LISTADO DE TESTIMONIOS -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">💬</span>
                  <h4>TESTIMONIOS ({{ editableItems.length }})</h4>
                  <button class="premium-add-btn" (click)="addItem()">+ Añadir</button>
                </div>
                
                <div class="items-list-premium">
                  <div *ngFor="let item of editableItems; let i = index" 
                       class="item-card" 
                       [class.active]="selectedItemIndex === i" 
                       (click)="selectItem(i)">
                    <div class="item-visual avatar">
                      <img [src]="item.avatar || 'https://i.pravatar.cc/100?u=' + i" *ngIf="item.avatar" class="w-full h-full rounded-lg object-cover">
                      <span *ngIf="!item.avatar">👤</span>
                    </div>
                    <div class="item-info">
                      <span class="item-title">{{ item.author || 'Anónimo' }}</span>
                      <span class="item-meta">{{ item.role || 'Cliente' }}</span>
                    </div>
                    <div class="item-actions">
                      <button class="delete-icon-btn" (click)="removeItem(i, $event)">✕</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- SECCIÓN: EDITOR DE TESTIMONIO SELECCIONADO -->
              <div class="sidebar-section no-border" *ngIf="selectedItemIndex !== -1">
                <div class="detail-editor-card feedback">
                  <div class="section-header">
                    <span class="section-icon">✏️</span>
                    <h4>EDITAR TESTIMONIO #{{ selectedItemIndex + 1 }}</h4>
                  </div>

                  <div class="control-group">
                    <label>Nombre del Autor</label>
                    <input type="text" [(ngModel)]="editableItems[selectedItemIndex].author" (ngModelChange)="onPartialChange()" class="premium-input">
                  </div>

                  <div class="control-group">
                    <label>Cargo / Empresa</label>
                    <input type="text" [(ngModel)]="editableItems[selectedItemIndex].role" (ngModelChange)="onPartialChange()" class="premium-input">
                  </div>

                  <div class="control-group">
                    <label>Testimonio (La Cita)</label>
                    <textarea [(ngModel)]="editableItems[selectedItemIndex].quote" (ngModelChange)="onPartialChange()" class="premium-input h-32" placeholder="Escribe el testimonio aquí..."></textarea>
                  </div>

                  <div class="control-group">
                    <label>Calificación ({{ editableItems[selectedItemIndex].rating || 5 }} estrellas)</label>
                    <div class="flex gap-1 justify-center py-2 bg-slate-900/50 rounded-xl">
                      <button *ngFor="let s of [1,2,3,4,5]" 
                              class="text-xl transition-transform hover:scale-125 focus:outline-none"
                              [style.color]="s <= (editableItems[selectedItemIndex].rating || 5) ? '#fbbf24' : '#475569'"
                              (click)="editableItems[selectedItemIndex].rating = s; onPartialChange()">
                        ★
                      </button>
                    </div>
                  </div>

                  <div class="control-group">
                    <label>URL de Imagen Avatar</label>
                    <input type="text" [(ngModel)]="editableItems[selectedItemIndex].avatar" (ngModelChange)="onPartialChange()" class="premium-input">
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Canvas Area -->
          <div class="isolated-canvas ambient-testimonials">
            <div class="canvas-inner" [style.background-image]="canvasBg">
               <div class="testimonials-preview-container">
                  <div class="preview-header-branded" *ngIf="editableContent.title">
                     <h2 class="premium-title">{{ editableContent.title }}</h2>
                     <p class="premium-subtitle">{{ editableContent.subtitle }}</p>
                  </div>

                  <div class="testimonials-render-grid" 
                       [style.grid-template-columns]="getGridColumns()"
                       [style.gap.px]="30">
                    
                    <div *ngFor="let item of editableItems; let i = index" 
                         class="testimonial-render-wrapper"
                         [class.is-editing]="selectedItemIndex === i"
                         (click)="selectItem(i)">
                      
                      <div class="testimonial-card-renderer" [style.color]="'white'">
                         <div class="quote-symbol">"</div>
                         <p class="quote-text">{{ item.quote || 'Cita del cliente...' }}</p>
                         <div class="author-block">
                            <img [src]="item.avatar || 'https://i.pravatar.cc/100?u=' + i" class="author-avatar shadow-lg">
                            <div class="author-details">
                               <div class="name">{{ item.author || 'Nombre' }}</div>
                               <div class="role">{{ item.role || 'Cargo' }}</div>
                            </div>
                         </div>
                         <div class="rating-stars">
                            <span *ngFor="let s of [1,2,3,4,5]" [style.color]="s <= (item.rating || 5) ? '#fbbf24' : '#ffffff22'">★</span>
                         </div>
                      </div>

                      <div class="item-id-badge">#{{ i + 1 }}</div>
                    </div>
                  </div>
               </div>
            </div>

            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">LAYOUT</span><span class="value text-purple-400">{{ (editableContent.variant || 'grid') | uppercase }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">TRANSFORM</span><span class="value">SCALE(1.0)</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">FEEDBACKS</span><span class="value">{{ editableItems.length }}</span></div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Consejo: Mantén los testimonios breves e impactantes para una mejor lectura en móvil.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Testimonios</button>
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
      backdrop-filter: blur(14px);
      z-index: 9999999 !important;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5vh 1.5vw;
    }

    .isolated-mode-container {
      background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px;
      width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden;
      box-shadow: 0 40px 80px -15px rgba(0, 0, 0, 0.9);
      animation: premium-entry 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes premium-entry {
      from { opacity: 0; transform: scale(0.97); }
      to { opacity: 1; transform: scale(1); }
    }

    .isolated-mode-header {
      height: 70px; padding: 0 1.5rem; background: #1e293b; border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex; align-items: center; justify-content: space-between;
    }

    .mode-badge { font-size: 10px; font-weight: 800; color: #a855f7; background: rgba(168, 85, 247, 0.1); padding: 5px 10px; border-radius: 8px; border: 1px solid rgba(168, 85, 247, 0.2); }
    .component-name { color: #f8fafc; font-size: 14px; font-weight: 700; margin-left: 10px; }
    .header-actions { display: flex; align-items: center; gap: 1rem; }

    .icon-btn {
      width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;
      background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);
      color: #94a3b8; border-radius: 10px; cursor: pointer; transition: all 0.2s;
    }
    .icon-btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.08); color: white; border-color: #6366f1; }
    .icon-btn:disabled { opacity: 0.1; cursor: not-allowed; }

    .close-main-btn {
      width: 38px; height: 38px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);
      color: #ef4444; border-radius: 10px; cursor: pointer; transition: all 0.2s;
    }
    .close-main-btn:hover { background: #ef4444; color: white; }

    .isolated-mode-body { flex: 1; display: flex; overflow: hidden; }

    .controls-sidebar {
      width: 350px; background: #020617; border-right: 1px solid rgba(255, 255, 255, 0.08); overflow-y: auto;
    }

    .sidebar-scroll-content { padding: 1.8rem; }
    .sidebar-section { margin-bottom: 2.2rem; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    .sidebar-section.no-border { border-bottom: none; }
    .section-header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.2rem; }
    .section-header h4 { margin: 0; font-size: 11px; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; }

    .control-group { margin-bottom: 1.4rem; }
    .control-group label { display: block; font-size: 10px; color: #94a3b8; margin-bottom: 0.7rem; font-weight: 700; }

    .premium-input {
      width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08);
      color: white; padding: 0.75rem 1rem; border-radius: 14px; font-size: 13px; transition: all 0.2s;
    }
    .premium-input:focus { border-color: #6366f1; background: rgba(15, 23, 42, 0.9); outline: none; }

    .grid-cols-selector { display: flex; gap: 8px; }
    .grid-cols-selector button {
      flex: 1; height: 36px; background: #1e293b; border: 1px solid rgba(255, 255, 255, 0.05);
      color: #94a3b8; border-radius: 10px; font-size: 11px; font-weight: 800; cursor: pointer; transition: all 0.2s;
    }
    .grid-cols-selector button.active { background: #6366f1; color: white; border-color: #818cf8; box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }

    .premium-add-btn {
      background: #8b5cf6; color: white; border: none; padding: 5px 12px; border-radius: 8px;
      font-size: 11px; font-weight: 800; cursor: pointer;
    }

    .items-list-premium { display: flex; flex-direction: column; gap: 12px; }
    .item-card {
      display: flex; align-items: center; gap: 14px; padding: 12px;
      background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px;
      cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .item-card:hover { background: rgba(30, 41, 59, 0.8); border-color: rgba(99, 102, 241, 0.3); transform: translateY(-2px); }
    .item-card.active { background: rgba(99, 102, 241, 0.15); border-color: #6366f1; }

    .item-visual.avatar {
      width: 44px; height: 44px; background: #0f172a; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; font-size: 20px; overflow: hidden;
    }

    .item-info { flex: 1; overflow: hidden; }
    .item-title { display: block; color: white; font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .item-meta { font-size: 11px; color: #64748b; font-weight: 600; }

    .delete-icon-btn { background: transparent; border: none; color: #ef444433; font-size: 16px; cursor: pointer; transition: color 0.2s; }
    .item-card:hover .delete-icon-btn { color: #ef4444; }

    .detail-editor-card.feedback {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
      border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 20px; padding: 1.4rem;
    }

    .isolated-canvas {
      flex: 1; background: #020617; position: relative; overflow: hidden;
      background-image: radial-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px); background-size: 50px 50px;
    }

    .canvas-inner { width: 100%; height: 100%; overflow-y: auto; padding: 80px 40px; display: flex; flex-direction: column; align-items: center; }
    
    .preview-header-branded { text-align: center; margin-bottom: 70px; max-width: 800px; }
    .premium-title { color: white; font-size: 48px; font-weight: 900; margin-bottom: 1.2rem; letter-spacing: -0.02em; }
    .premium-subtitle { color: #94a3b8; font-size: 20px; line-height: 1.6; font-weight: 500; }

    .testimonials-render-grid { display: grid; width: 100%; max-width: 1200px; }
    .testimonial-render-wrapper { position: relative; border-radius: 24px; border: 2px solid transparent; transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1); cursor: pointer; }
    .testimonial-render-wrapper.is-editing { border-color: #6366f1; transform: scale(1.05); z-index: 10; filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5)); }
    
    .testimonial-card-renderer {
      background: #1e293b; border-radius: 24px; padding: 2.5rem; height: 100%;
      border: 1px solid rgba(255, 255, 255, 0.05); display: flex; flex-direction: column; gap: 1.5rem;
    }
    
    .quote-symbol { font-size: 80px; font-family: serif; line-height: 1; height: 40px; color: #6366f1; opacity: 0.3; margin-top: -20px; }
    .quote-text { font-size: 18px; line-height: 1.7; font-weight: 500; font-style: italic; color: #e2e8f0; }
    
    .author-block { display: flex; align-items: center; gap: 1rem; margin-top: auto; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 1.5rem; }
    .author-avatar { width: 50px; height: 50px; border-radius: 12px; border: 2px solid #6366f1; }
    .author-details .name { color: white; font-weight: 800; font-size: 16px; }
    .author-details .role { color: #94a3b8; font-size: 12px; font-weight: 600; }
    
    .rating-stars { display: flex; gap: 2px; font-size: 14px; }
    
    .item-id-badge { position: absolute; top: -12px; left: -12px; background: #6366f1; color: white; font-size: 11px; font-weight: 900; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.5); }

    .modern-position-dock { position: absolute; bottom: 35px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(10px); padding: 0.75rem 1.8rem; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.08); display: flex; gap: 1.8rem; color: white; font-size: 12px; box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.4); }
    .dock-divider { width: 1px; background: rgba(255, 255, 255, 0.1); }
    .dock-item { display: flex; align-items: center; gap: 0.6rem; }
    .dock-item .label { color: #64748b; font-weight: 900; text-transform: uppercase; }

    .isolated-mode-footer { height: 75px; padding: 0 2.5rem; background: #1e293b; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.08); }
    .footer-hint { font-size: 12px; color: #94a3b8; font-weight: 500; }
    .btn-clean { padding: 0.75rem 2rem; border-radius: 14px; font-weight: 800; cursor: pointer; border: none; font-size: 14px; transition: all 0.2s; }
    .btn-clean.primary { background: #6366f1; color: white; box-shadow: 0 4px 15px -1px rgba(99, 102, 241, 0.4); }
    .btn-clean.secondary { background: transparent; color: #94a3b8; }
    .btn-clean.secondary:hover { color: white; background: rgba(255, 255, 255, 0.05); }
  `]
})
export class EditorTestimonialsIsolatedModeComponent implements OnInit, OnDestroy {
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
  
  get canvasBg() {
    return 'none';
  }

  ngOnInit() {
    this.initializeState();
  }

  private initializeState() {
    this.editableItems = JSON.parse(JSON.stringify(this.config.content.items || this.config.content.testimonials || []));
    this.editableContent = {
      title: this.config.content.title || 'Lo que dicen de nosotros',
      subtitle: this.config.content.subtitle || 'Damos lo mejor para nuestros clientes.',
      variant: this.config.content.variant || 'default',
      cardVariant: this.config.content.cardVariant || 'default',
      gridCols: this.config.content.gridCols || 3
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
      author: 'Nuevo Cliente',
      role: 'CEO en Creative Co.',
      quote: 'Trabajar con este equipo ha sido una de las mejores decisiones para nuestra marca. El resultado final superó todas las expectativas.',
      avatar: 'https://i.pravatar.cc/150?u=' + Math.random(),
      rating: 5
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

  getGridColumns() {
    return `repeat(${this.editableContent.gridCols}, 1fr)`;
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
        items: this.editableItems,
        testimonials: this.editableItems // Sync with legacy props if needed
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
