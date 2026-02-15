import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UICardComponent } from '@negocio/ui-components';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';

@Component({
  selector: 'lib-editor-card-testimonial-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UICardComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">💬 TESTIMONIAL CARD</span>
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
            <div class="sidebar-scroll-content">
              
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">✍️</span>
                  <h4>TESTIMONIO</h4>
                </div>
                
                <div class="control-group">
                  <label>Autor / Cliente</label>
                  <input type="text" [(ngModel)]="editableContent.author" (ngModelChange)="onContentChange()" class="premium-input">
                </div>

                <div class="control-group">
                  <label>Cargo / Rol</label>
                  <input type="text" [(ngModel)]="editableContent.role" (ngModelChange)="onContentChange()" class="premium-input">
                </div>

                <div class="control-group">
                  <label>Comentario</label>
                  <textarea [(ngModel)]="editableContent.text" (ngModelChange)="onContentChange()" class="premium-textarea h-24"></textarea>
                </div>

                <div class="control-group">
                  <label>Foto de Perfil (URL)</label>
                  <input type="text" [(ngModel)]="editableContent.avatar" (ngModelChange)="onContentChange()" class="premium-input">
                </div>
              </div>

              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>ESTILO VISUAL</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante de Card</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="modern">Moderno (Minimal)</option>
                    <option value="boxed">Enmarcado (Shadow)</option>
                    <option value="glass">Cristal (Blur)</option>
                    <option value="gradient">Gradiente Suave</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Puntuación ({{ editableContent.rating }} estrellas)</label>
                  <input type="range" min="1" max="5" [(ngModel)]="editableContent.rating" (ngModelChange)="onContentChange()" class="premium-range">
                </div>

                <div class="control-group">
                  <label>Color de Enfoque</label>
                  <div class="color-row">
                    <div class="color-preview" [style.background-color]="editableStyles.accentColor">
                      <input type="color" [(ngModel)]="editableStyles.accentColor" (ngModelChange)="onContentChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableStyles.accentColor" (ngModelChange)="onContentChange()" class="premium-input-mini">
                  </div>
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
                  
                  <div class="testimonial-render-card" [class]="'variant--' + editableContent.variant" [style.borderColor]="editableStyles.accentColor">
                      <div class="card-header-flex">
                         <img [src]="editableContent.avatar" class="avatar-circle">
                         <div class="info">
                            <span class="author">{{ editableContent.author }}</span>
                            <span class="role">{{ editableContent.role }}</span>
                         </div>
                         <div class="rating" [style.color]="editableStyles.accentColor">
                            {{ '⭐'.repeat(editableContent.rating) }}
                         </div>
                      </div>
                      <p class="quote">"{{ editableContent.text }}"</p>
                  </div>

                  <!-- Lateral handles -->
                  <div class="resize-handle e"  (mousedown)="startResize($event, 'e')"></div>
                  <div class="resize-handle w"  (mousedown)="startResize($event, 'w')"></div>
                </div>
              </div>

            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">VARIANTE</span><span class="value uppercase text-pink-400">{{ editableContent.variant }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">RATING</span><span class="value">{{ editableContent.rating }}/5</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">WIDTH</span><span class="value">{{ currentSize.width }}px</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Testimonial Gold: Las reseñas con foto aumentan la conversión hasta en un 40%.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Actualizar Testimonio</button>
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

    .canvas-inner { width: 4000px; height: 3000px; position: relative; padding-top: 250px;
      &.show-grid { background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px); background-size: 40px 40px; }
    }

    .draggable-wrapper { position: absolute !important; cursor: move; z-index: 100; border: 2px dashed transparent; padding: 20px; transition: border-color 0.2s;
      &:hover { border-color: rgba(236, 72, 153, 0.3); }
      &.is-dragging, &.is-resizing { border-color: #ec4899; background: rgba(236, 72, 153, 0.02); }
    }

    .testimonial-render-card { background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      &.variant--glass { backdrop-filter: blur(20px); background: rgba(255,255,255,0.03); }
      &.variant--gradient { background: linear-gradient(135deg, rgba(88, 28, 135, 0.1), rgba(15, 23, 42, 0.9)); }
      .card-header-flex { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
      .avatar-circle { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; }
      .info { flex: 1; display: flex; flex-direction: column; }
      .author { font-size: 16px; font-weight: 800; color: white; }
      .role { font-size: 12px; color: #64748b; }
      .quote { font-size: 15px; line-height: 1.6; color: #94a3b8; font-style: italic; }
    }

    .color-row { display: flex; gap: 10px; align-items: center; .color-preview { width: 34px; height: 34px; border-radius: 8px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); input { position: absolute; inset: -5px; width: 150%; height: 150%; cursor: pointer; opacity: 0; } } }

    .premium-input, .premium-select, .premium-textarea { width: 100%; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); color: white; padding: 0.8rem 1rem; border-radius: 12px; font-size: 13px; &:focus { border-color: #ec4899; outline: none; } }
    .premium-input-mini { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-family: monospace; }
    .premium-range { width: 100%; accent-color: #ec4899; }
  `]
})
export class EditorCardTestimonialIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = { 
        ...this.config.content,
        author: this.config.content.author || 'Cliente Satisfecho',
        role: this.config.content.role || 'CEO de Empresa',
        text: this.config.content.text || 'Una experiencia increíble que superó nuestras expectativas.',
        avatar: this.config.content.avatar || 'https://i.pravatar.cc/150',
        variant: this.config.content.variant || 'modern',
        rating: this.config.content.rating || 5
    };
    
    this.editableStyles = { 
        ...this.config.styles,
        accentColor: this.config.styles.accentColor || '#ec4899'
    };
    
    this.currentPosition = { ...(this.config.position || { x: 500, y: 300 }) };
    this.currentSize = { 
        width: this.config.size?.width || 450, 
        height: this.config.size?.height || 280 
    };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.8;

    this.saveState();
  }

  override saveState() {
    const newState = {
      position: { ...this.currentPosition },
      size: { ...this.currentSize },
      styles: JSON.parse(JSON.stringify(this.editableStyles)),
      content: JSON.parse(JSON.stringify(this.editableContent))
    };

    const lastState = this.undoStack[this.undoStack.length - 1];
    if (lastState && JSON.stringify(lastState) === JSON.stringify(newState)) return;

    this.undoStack.push(newState as any);
    if (this.undoStack.length > 50) this.undoStack.shift();
    this.redoStack = [];
  }

  override apply() {
    this.applied.emit({
      ...this.config,
      content: { ...this.editableContent },
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

  override onContentChange() {
    this.scheduleSaveState();
  }

  override onCanvasMouseDown(event: MouseEvent) { }
  onOverlayClick(event: MouseEvent) { this.cancel(); }
}
