import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

// Re-export IsolatedModeConfig for convenience
export { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

@Component({
  selector: 'lib-editor-testimonials-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">💬 TESTIMONIALS EDITOR</span>
            <span class="separator">/</span>
            <span class="component-name">SOCIAL PROOF GOLD</span>
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
              <button class="icon-btn" (click)="toggleGrid()" [class.active]="showGrid" title="Cuadrícula (G)">
                <span class="icon">#</span>
              </button>
              <button class="icon-btn" (click)="toggleSnap()" [class.active]="snapToGrid" title="Snap (S)">
                <span class="icon">⊞</span>
              </button>
            </div>

            <div class="divider"></div>

            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <!-- ===== BODY ===== -->
        <div class="isolated-mode-body">
          
          <!-- Sidebar Controls -->
          <div class="controls-sidebar">
            <div class="sidebar-tabs">
              <button [class.active]="activeTab === 'items'" (click)="activeTab = 'items'">FEEDBACK</button>
              <button [class.active]="activeTab === 'design'" (click)="activeTab = 'design'">LAYOUT</button>
            </div>

            <div class="sidebar-scroll-content">
              
              <!-- ITEMS SECTION -->
              <div class="sidebar-section animate-fade-in" *ngIf="activeTab === 'items'">
                <div class="section-header">
                  <span class="section-icon">⭐️</span>
                  <h4>COMENTARIOS DE CLIENTES</h4>
                </div>
                
                <div class="item-list">
                  <div *ngFor="let item of editableItems; let i = index" 
                       class="testimonial-item-card" 
                       [class.active]="selectedIndex === i"
                       (click)="selectedIndex = i">
                    <div class="item-main">
                      <div class="avatar-mini">
                        <img [src]="item.avatar" *ngIf="item.avatar" class="w-full h-full object-cover">
                        <span *ngIf="!item.avatar">👤</span>
                      </div>
                      <div class="flex-1 overflow-hidden">
                        <input type="text" [(ngModel)]="item.author" (ngModelChange)="onContentChange()" class="premium-input-mini" placeholder="Nombre...">
                      </div>
                      <button (click)="removeItem(i, $event)" class="delete-btn-mini">✕</button>
                    </div>
                    
                    <div *ngIf="selectedIndex === i" class="item-details animate-fade-in">
                        <label>Cargo / Empresa</label>
                        <input type="text" [(ngModel)]="item.role" (ngModelChange)="onContentChange()" class="premium-input-mini" placeholder="CEO en...">
                        
                        <label class="mt-3">Reseña del Cliente</label>
                        <textarea [(ngModel)]="item.quote" (ngModelChange)="onContentChange()" class="premium-textarea h-24" placeholder="Escribe el testimonio..."></textarea>
                        
                        <div class="rating-editor mt-3">
                           <label>Puntuación ({{ item.rating }}★)</label>
                           <div class="flex gap-1 mt-1">
                              <button *ngFor="let s of [1,2,3,4,5]" 
                                      (click)="item.rating = s; onContentChange()"
                                      class="star-btn"
                                      [class.active]="s <= item.rating">★</button>
                           </div>
                        </div>

                        <label class="mt-3">Avatar URL</label>
                        <input type="text" [(ngModel)]="item.avatar" (ngModelChange)="onContentChange()" class="premium-input-mini" placeholder="https://...">
                    </div>
                  </div>
                </div>

                <button (click)="addItem()" class="add-btn-premium mt-4">+ Nuevo Testimonio</button>
              </div>

              <!-- DESIGN SECTION -->
              <div class="sidebar-section animate-fade-in" *ngIf="activeTab === 'design'">
                <div class="section-header">
                  <span class="section-icon">🧩</span>
                  <h4>GRID & APARIENCIA</h4>
                </div>
                
                <div class="control-group">
                  <label>Título de Sección</label>
                  <input type="text" [(ngModel)]="editableContent.title" (ngModelChange)="onContentChange()" class="premium-input">
                </div>

                <div class="control-group">
                  <label>Variante de Tarjetas</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="default">Diseño Grid Clásico</option>
                    <option value="carousel">Carrusel Fluido</option>
                    <option value="columns">Mampostería (Masonry)</option>
                    <option value="centered">Foco Central</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Columnas Visuales ({{ editableContent.gridCols }})</label>
                  <div class="grid-selector">
                    <button *ngFor="let n of [1,2,3]" 
                            [class.active]="editableContent.gridCols === n" 
                            (click)="editableContent.gridCols = n; onContentChange()">
                      {{ n }}
                    </button>
                  </div>
                </div>

                <div class="control-group mt-6">
                  <label>Estética de Tarjetas</label>
                  <select [(ngModel)]="editableContent.cardVariant" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="default">Sólido Moderno</option>
                    <option value="glass">Glassmorphism Transparente</option>
                    <option value="minimal">Minimalista (Sin Borde)</option>
                    <option value="neon">Brillo Neón (Accent)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Canvas Area -->
          <div class="isolated-canvas" #canvas (mousedown)="onCanvasMouseDown($event)">
              <div class="canvas-inner" #canvasInner
                   [style.transform]="'scale(' + viewportScale + ')'"
                   [style.transformOrigin]="'center top'"
                   [class.show-grid]="showGrid"
                   [class.grid-snapping]="snapToGrid">
                
                <div class="draggable-wrapper"
                     #draggableWrapper
                     [style.left.px]="currentPosition.x"
                     [style.top.px]="currentPosition.y"
                     [style.width.px]="currentSize.width"
                     [class.is-dragging]="isDragging"
                     [class.is-resizing]="isResizing"
                     (mousedown)="onMouseDown($event)">
                  
                  <div class="preview-render-testimonials" [style.columns]="editableContent.gridCols">
                      <div class="header-preview-text" *ngIf="editableContent.title">
                         <h2>{{ editableContent.title }}</h2>
                      </div>

                      <div class="testimonial-cards-grid" 
                           [style.grid-template-columns]="'repeat(' + editableContent.gridCols + ', 1fr)'">
                        <div *ngFor="let item of editableItems; let i = index" 
                             class="testimonial-card-gold"
                             [class.is-editing]="selectedIndex === i"
                             (click)="selectedIndex = i">
                           <div class="quote-sign">"</div>
                           <p class="quote-body">{{ item.quote || 'Excelente servicio...' }}</p>
                           <div class="author-info">
                              <img [src]="item.avatar || 'https://i.pravatar.cc/100?u=' + i" class="avatar-img">
                              <div class="details">
                                 <div class="name">{{ item.author || 'Anónimo' }}</div>
                                 <div class="role">{{ item.role || 'Cliente' }}</div>
                              </div>
                           </div>
                           <div class="stars-row">
                              <span *ngFor="let s of [1,2,3,4,5]" [style.color]="s <= item.rating ? '#fbbf24' : '#475569'">★</span>
                           </div>
                        </div>
                      </div>
                  </div>

                  <!-- Horizontal resize -->
                  <div class="resize-handle e"  (mousedown)="startResize($event, 'e')"></div>
                  <div class="resize-handle w"  (mousedown)="startResize($event, 'w')"></div>
                </div>
              </div>

            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">RESEÑAS</span><span class="value">{{ editableItems.length }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">LAYOUT</span><span class="value uppercase text-indigo-400">{{ editableContent.variant }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">COLS</span><span class="value">{{ editableContent.gridCols }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Testimonials Gold: La prueba social es el factor #1 en la decisión de compra.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Publicar Feedback</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import '../_isolated-mode-shared';
    @include isolated-mode-foundation;
    @include resize-handles;
    @include modern-dock;

    .sidebar-tabs { display: flex; background: rgba(15, 23, 42, 0.4); border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      button { flex: 1; padding: 1.2rem 0.5rem; background: transparent; border: none; color: #64748b; font-size: 10px; font-weight: 900; letter-spacing: 1.5px; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        &.active { color: #8b5cf6; border-bottom-color: #8b5cf6; background: rgba(139, 92, 246, 0.05); }
      }
    }

    .canvas-inner { width: 4000px; height: 3000px; position: relative; padding-top: 60px;
      &.show-grid { background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px); background-size: 30px 30px; }
    }

    .draggable-wrapper { position: absolute !important; cursor: move; z-index: 100; border: 2px dashed transparent; padding: 20px; transition: border-color 0.2s;
      &:hover { border-color: rgba(139, 92, 246, 0.3); }
      &.is-dragging, &.is-resizing { border-color: #8b5cf6; background: rgba(139, 92, 246, 0.02); }
    }

    .item-list { display: flex; flex-direction: column; gap: 12px; }
    .testimonial-item-card { background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 12px; cursor: pointer; transition: all 0.2s;
      &:hover { border-color: rgba(255, 255, 255, 0.15); }
      &.active { border-color: #8b5cf6; background: rgba(139, 92, 246, 0.05); box-shadow: 0 0 20px rgba(139, 92, 246, 0.1); }
    }
    
    .item-main { display: flex; align-items: center; gap: 10px; }
    .avatar-mini { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.05); overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 14px; }
    .item-details { margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);
      label { display: block; font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: 800; margin-bottom: 6px; }
    }

    .delete-btn-mini { background: rgba(239, 68, 68, 0.1); color: #f87171; border: none; width: 24px; height: 24px; border-radius: 6px; cursor: pointer; transition: all 0.2s; &:hover { background: #ef4444; color: white; } }

    .star-btn { background: transparent; border: none; color: #475569; font-size: 16px; cursor: pointer; transition: all 0.2s; &.active { color: #fbbf24; transform: scale(1.2); } }

    .grid-selector { display: flex; gap: 5px; background: rgba(15, 23, 42, 0.6); padding: 5px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.05);
      button { flex: 1; height: 30px; border: none; background: transparent; color: #64748b; border-radius: 6px; font-weight: 800; font-size: 11px; cursor: pointer; transition: all 0.2s;
        &.active { background: #8b5cf6; color: white; }
      }
    }

    .add-btn-premium { width: 100%; background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.1)); border: 1px dashed rgba(139, 92, 246, 0.4); color: #a78bfa; padding: 12px; border-radius: 14px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.3s;
      &:hover { background: rgba(139, 92, 246, 0.2); border-color: #8b5cf6; transform: translateY(-1px); }
    }

    .premium-input, .premium-select, .premium-textarea { width: 100%; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); color: white; padding: 0.8rem 1rem; border-radius: 12px; font-size: 13px; transition: all 0.2s; &:focus { border-color: #8b5cf6; outline: none; background: #0f172a; } }
    .premium-input-mini { width: 100%; background: transparent; border: 1px solid transparent; color: white; padding: 4px 8px; border-radius: 6px; font-size: 12px; &:focus { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); } }

    .preview-render-testimonials { color: white; text-align: center; }
    .header-preview-text h2 { font-size: 32px; font-weight: 900; margin-bottom: 40px; color: white; }

    .testimonial-cards-grid { display: grid; gap: 24px; padding: 10px; }
    .testimonial-card-gold { background: #1e293b; border-radius: 20px; padding: 24px; border: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; text-align: left; transition: all 0.3s;
      &.is-editing { border-color: #8b5cf6; transform: scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
      .quote-sign { font-size: 48px; font-family: serif; color: #8b5cf6; opacity: 0.2; height: 30px; margin-top: -10px; }
      .quote-body { font-size: 15px; color: #cbd5e1; line-height: 1.6; margin-bottom: 20px; font-style: italic; }
      .author-info { display: flex; align-items: center; gap: 12px; .avatar-img { width: 44px; height: 44px; border-radius: 12px; border: 2px solid #8b5cf6; } .details .name { font-weight: 800; font-size: 15px; } .details .role { font-size: 11px; color: #64748b; } }
      .stars-row { margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px; display: flex; gap: 2px; }
    }

    .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class EditorTestimonialsIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;

  activeTab: 'items' | 'design' = 'items';
  selectedIndex = 0;
  editableItems: any[] = [];

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = { 
        ...this.config.content,
        title: this.config.content.title || 'Lo que dicen de nosotros',
        variant: this.config.content.variant || 'default',
        gridCols: this.config.content.gridCols || 3,
        cardVariant: this.config.content.cardVariant || 'default'
    };
    this.editableItems = JSON.parse(JSON.stringify(this.config.content.items || this.config.content.testimonials || []));
    this.editableStyles = { ...this.config.styles };
    
    this.currentPosition = { ...(this.config.position || { x: 200, y: 80 }) };
    this.currentSize = { 
        width: this.config.size?.width || 1000, 
        height: this.config.size?.height || 700 
    };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.5;

    if (this.editableItems.length > 0) this.selectedIndex = 0;

    this.saveState();
  }

  override saveState() {
    const newState = {
      position: { ...this.currentPosition },
      size: { ...this.currentSize },
      styles: JSON.parse(JSON.stringify(this.editableStyles)),
      content: {
        ...JSON.parse(JSON.stringify(this.editableContent)),
        items: JSON.parse(JSON.stringify(this.editableItems))
      }
    };

    const lastState = this.undoStack[this.undoStack.length - 1];
    if (lastState && JSON.stringify(lastState) === JSON.stringify(newState)) return;

    this.undoStack.push(newState as any);
    if (this.undoStack.length > 50) this.undoStack.shift();
    this.redoStack = [];
  }

  addItem() {
    this.editableItems.push({
      author: 'Nuevo Cliente Satisfecho',
      role: 'CEO en Creative Studios',
      quote: 'El equipo superó todas nuestras expectativas. La calidad y el trato han sido excepcionales desde el primer día.',
      avatar: 'https://i.pravatar.cc/150?u=' + Math.random(),
      rating: 5
    });
    this.selectedIndex = this.editableItems.length - 1;
    this.onContentChange();
  }

  removeItem(index: number, event: MouseEvent) {
    event.stopPropagation();
    this.editableItems.splice(index, 1);
    if (this.selectedIndex >= this.editableItems.length) {
      this.selectedIndex = Math.max(0, this.editableItems.length - 1);
    }
    this.onContentChange();
  }

  override onContentChange() {
    this.scheduleSaveState();
  }

  override apply() {
    this.applied.emit({
      ...this.config,
      content: { 
        ...this.editableContent, 
        items: this.editableItems,
        testimonials: this.editableItems
      },
      styles: {
        ...this.editableStyles,
        left: this.currentPosition.x + 'px',
        top: this.currentPosition.y + 'px',
        width: this.currentSize.width + 'px',
        position: 'absolute'
      },
      position: { ...this.currentPosition },
      size: { ...this.currentSize }
    });
  }

  override onCanvasMouseDown(event: MouseEvent) { }
  onOverlayClick(event: MouseEvent) { this.cancel(); }
}
