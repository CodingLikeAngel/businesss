import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UICardAnimatedComponent } from '@negocio/ui-components';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';

@Component({
  selector: 'lib-editor-card-animated-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UICardAnimatedComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">✨ ANIMATED CARD</span>
            <span class="separator">/</span>
            <span class="component-name">MOTION GOLD</span>
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
              <button [class.active]="activeTab === 'content'" (click)="activeTab = 'content'">Contenido</button>
              <button [class.active]="activeTab === 'design'" (click)="activeTab = 'design'">Estilo</button>
              <button [class.active]="activeTab === 'advanced'" (click)="activeTab = 'advanced'">Avanzado</button>
            </div>

            <div class="sidebar-scroll-content">
              
              <!-- CONTENT SECTION -->
              <div class="sidebar-section animate-fade-in" *ngIf="activeTab === 'content'">
                <div class="section-header">
                  <span class="section-icon">📝</span>
                  <h4>DATOS DE LA TARJETA</h4>
                </div>
                
                <div class="control-group">
                  <label>Título</label>
                  <input type="text" [(ngModel)]="editableContent.title" (ngModelChange)="onContentChange()" class="premium-input" placeholder="Título...">
                </div>

                <div class="control-group">
                  <label>Descripción</label>
                  <textarea [(ngModel)]="editableContent.description" (ngModelChange)="onContentChange()" class="premium-textarea h-24" placeholder="Breve texto descriptivo..."></textarea>
                </div>

                <div class="control-group">
                  <label>Imagen de Fondo (URL)</label>
                  <input type="text" [(ngModel)]="editableContent.image" (ngModelChange)="onContentChange()" class="premium-input" placeholder="https://...">
                </div>
              </div>

              <!-- DESIGN SECTION -->
              <div class="sidebar-section animate-fade-in" *ngIf="activeTab === 'design'">
                <div class="section-header">
                  <span class="section-icon">🎬</span>
                  <h4>ANIMACIÓN & VARIANTE</h4>
                </div>
                
                <div class="control-group">
                  <label>Tipo de Entrada</label>
                  <select [(ngModel)]="editableContent.animation" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="fade">Fade In (Suave)</option>
                    <option value="slide">Slide (Desplazar)</option>
                    <option value="zoom">Zoom (Escala)</option>
                    <option value="flip">Flip (Rotar)</option>
                    <option value="none">Sin Animación</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Variante Visual</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="default">Estándar</option>
                    <option value="glass">Glassmorphism</option>
                    <option value="primary">Acento Primario</option>
                    <option value="neon">Brillo Neón</option>
                  </select>
                </div>

                <div class="divider-section"></div>

                <div class="section-header mt-6">
                  <span class="section-icon">🎨</span>
                  <h4>CUSTOMLOOK</h4>
                </div>

                <div class="control-group">
                  <label>Color de Superposición</label>
                  <div class="color-row">
                    <div class="color-preview" [style.background-color]="editableStyles.backgroundColor">
                      <input type="color" [(ngModel)]="editableStyles.backgroundColor" (ngModelChange)="onContentChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableStyles.backgroundColor" (ngModelChange)="onContentChange()" class="premium-input-mini">
                  </div>
                </div>

                 <div class="control-row mt-4">
                  <div class="control-group">
                    <label>Duración (ms)</label>
                    <input type="number" [(ngModel)]="editableContent.duration" (ngModelChange)="onContentChange()" class="premium-input-mini">
                  </div>
                  <div class="control-group">
                    <label>Delay (ms)</label>
                    <input type="number" [(ngModel)]="editableContent.delay" (ngModelChange)="onContentChange()" class="premium-input-mini">
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
                     [style.height.px]="currentSize.height"
                     [class.is-dragging]="isDragging"
                     [class.is-resizing]="isResizing"
                     (mousedown)="onMouseDown($event)">
                  
                  <lib-ui-components-card-animated
                    [title]="editableContent.title"
                    [description]="editableContent.description"
                    [image]="editableContent.image"
                    [animation]="editableContent.animation"
                    [customStyles]="editableStyles"
                    style="width: 100%; height: 100%; display: block;">
                  </lib-ui-components-card-animated>

                  <!-- 8-Point Resizing -->
                  <div class="resize-handle n"  (mousedown)="startResize($event, 'n')"></div>
                  <div class="resize-handle s"  (mousedown)="startResize($event, 's')"></div>
                  <div class="resize-handle e"  (mousedown)="startResize($event, 'e')"></div>
                  <div class="resize-handle w"  (mousedown)="startResize($event, 'w')"></div>
                  <div class="resize-handle nw" (mousedown)="startResize($event, 'nw')"></div>
                  <div class="resize-handle ne" (mousedown)="startResize($event, 'ne')"></div>
                  <div class="resize-handle sw" (mousedown)="startResize($event, 'sw')"></div>
                  <div class="resize-handle se" (mousedown)="startResize($event, 'se')"></div>
                </div>
              </div>

            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">MOTION</span><span class="value uppercase text-fuchsia-400">{{ editableContent.animation }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">SIZE</span><span class="value">{{ currentSize.width }}x{{ currentSize.height }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">POS</span><span class="value">{{ currentPosition.x }},{{ currentPosition.y }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Animated Gold: Las transiciones suaves mejoran la retención visual del usuario.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Animación</button>
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
        &.active { color: #d946ef; border-bottom-color: #d946ef; background: rgba(217, 70, 239, 0.05); }
      }
    }

    .canvas-inner { width: 4000px; height: 3000px; position: relative; padding-top: 200px;
      &.show-grid { background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px); background-size: 40px 40px; }
    }

    .draggable-wrapper { position: absolute !important; cursor: move; z-index: 100; border: 2px dashed transparent; transition: border-color 0.2s;
      &:hover { border-color: rgba(217, 70, 239, 0.3); }
      &.is-dragging, &.is-resizing { border-color: #d946ef; background: rgba(217, 70, 239, 0.02); }
    }

    .color-row { display: flex; gap: 10px; align-items: center; .color-preview { width: 34px; height: 34px; border-radius: 8px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); input { position: absolute; inset: -5px; width: 150%; height: 150%; cursor: pointer; opacity: 0; } } }
    
    .premium-input, .premium-select, .premium-textarea { width: 100%; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); color: white; padding: 0.8rem 1rem; border-radius: 12px; font-size: 13px; &:focus { border-color: #d946ef; outline: none; } }
    .premium-input-mini { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-family: monospace; }
    .premium-range { width: 100%; accent-color: #d946ef; }

    .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class EditorCardAnimatedIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;

  activeTab: 'content' | 'design' | 'advanced' = 'content';

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = { 
        ...this.config.content,
        title: this.config.content.title || 'Título de Tarjeta',
        description: this.config.content.description || 'Descripción animada...',
        image: this.config.content.image || '',
        animation: this.config.content.animation || 'fade',
        duration: this.config.content.duration || 500,
        delay: this.config.content.delay || 0,
        variant: this.config.content.variant || 'default'
    };
    
    this.editableStyles = { 
        ...this.config.styles,
        backgroundColor: this.config.styles.backgroundColor || 'transparent'
    };
    
    this.currentPosition = { ...(this.config.position || { x: 500, y: 300 }) };
    this.currentSize = { 
        width: this.config.size?.width || 350, 
        height: this.config.size?.height || 450 
    };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.75;

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
        height: this.currentSize.height + 'px',
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
