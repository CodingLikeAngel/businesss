import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UICardAnimatedComponent } from '@negocio/ui-components';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';
import { BaseIsolatedModeComponent, ISOLATED_MODE_SHARED_STYLES } from '../base-isolated-mode.component';

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
            <span class="mode-badge">🎯 MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">CARD ANIMATED</span>
          </div>
          
          <div class="header-actions">
            <div class="action-group">
              <button class="icon-btn" (click)="undo()" [disabled]="!canUndo" title="Deshacer (Ctrl+Z)">
                <span>↶</span>
              </button>
              <button class="icon-btn" (click)="redo()" [disabled]="!canRedo" title="Rehacer (Ctrl+Y)">
                <span>↷</span>
              </button>
            </div>
            
            <div class="header-divider"></div>
            
            <div class="action-group">
              <button class="icon-btn" (click)="toggleGrid()" 
                      [class.active]="showGrid" title="Cuadrícula (G)">
                <span>#</span>
              </button>
              <button class="icon-btn" (click)="toggleSnap()" 
                      [class.active]="snapToGrid" title="Snap (S)">
                <span>⊞</span>
              </button>
              <button class="icon-btn" (click)="resetPosition()" title="Reset (R)">
                <span>↺</span>
              </button>
            </div>

            <div class="header-divider"></div>

            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <!-- ===== BODY ===== -->
        <div class="isolated-mode-body">
          
          <!-- Sidebar Controls -->
          <div class="controls-sidebar">
            <div class="sidebar-scroll-content">
              
              <!-- CONTENT SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📝</span>
                  <h4>CONTENIDO</h4>
                </div>
                
                <div class="control-group">
                  <label>Título</label>
                  <input type="text" [(ngModel)]="editableContent.title" (ngModelChange)="onContentChange()" class="premium-input" placeholder="Card Title...">
                </div>

                <div class="control-group">
                  <label>Descripción</label>
                  <textarea [(ngModel)]="editableContent.description" (ngModelChange)="onContentChange()" class="premium-textarea" rows="3" placeholder="Card description..."></textarea>
                </div>

                <div class="control-group">
                  <label>URL de Imagen</label>
                  <input type="text" [(ngModel)]="editableContent.image" (ngModelChange)="onContentChange()" class="premium-input" placeholder="https://...">
                </div>

                <div class="image-preview" *ngIf="editableContent.image">
                  <img [src]="editableContent.image" alt="Preview" style="width: 100%; height: 120px; object-fit: cover; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);">
                </div>
              </div>

              <!-- ANIMATION SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">✨</span>
                  <h4>ANIMACIÓN</h4>
                </div>
                
                <div class="control-group">
                  <label>Tipo de Animación</label>
                  <div class="select-wrapper">
                    <select [(ngModel)]="editableContent['animation']" (ngModelChange)="onContentChange()" class="premium-select">
                      <option value="none">Sin Animación</option>
                      <option value="fade">Fade In</option>
                      <option value="slide">Slide Up</option>
                      <option value="zoom">Zoom In</option>
                      <option value="bounce">Bounce</option>
                      <option value="flip">Flip</option>
                      <option value="rotate">Rotate</option>
                    </select>
                  </div>
                </div>

                <div class="control-row">
                  <div class="control-group half">
                    <label>Duración (ms)</label>
                    <input type="number" [(ngModel)]="editableContent['duration']" (ngModelChange)="onContentChange()" class="premium-input" placeholder="500">
                  </div>
                  <div class="control-group half">
                    <label>Delay (ms)</label>
                    <input type="number" [(ngModel)]="editableContent['delay']" (ngModelChange)="onContentChange()" class="premium-input" placeholder="0">
                  </div>
                </div>
              </div>

              <!-- APPEARANCE SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>APARIENCIA</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante Visual</label>
                  <div class="select-wrapper">
                    <select [(ngModel)]="editableContent['variant']" (ngModelChange)="onContentChange()" class="premium-select">
                      <option value="default">Estándar</option>
                      <option value="primary">Primario</option>
                      <option value="secondary">Secundario</option>
                      <option value="glass">Vidrio (Glass)</option>
                      <option value="neon">Neón</option>
                      <option value="cyberpunk">Cyberpunk</option>
                    </select>
                  </div>
                  <p class="variant-hint" *ngIf="!editableContent['variant']">
                    Heredando: {{ config.content['globalVariant'] || 'glass' }}
                  </p>
                </div>

                <div class="control-group">
                  <label>Color de fondo</label>
                  <div class="color-input-wrapper">
                    <div class="color-preview" [style.background-color]="editableStyles['backgroundColor']">
                      <input type="color" [(ngModel)]="editableStyles['backgroundColor']" (ngModelChange)="onStyleChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableStyles['backgroundColor']" (ngModelChange)="onStyleChange()" class="premium-input" placeholder="#hex">
                  </div>
                </div>
              </div>

              <!-- DIMENSIONS SECTION -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">📏</span>
                  <h4>POSICIÓN & TAMAÑO</h4>
                </div>
                <div class="control-row">
                  <div class="control-group half">
                    <label>Posición X</label>
                    <input type="number" [(ngModel)]="currentPosition.x" (ngModelChange)="onPositionChange()" class="premium-input text-center">
                  </div>
                  <div class="control-group half">
                    <label>Posición Y</label>
                    <input type="number" [(ngModel)]="currentPosition.y" (ngModelChange)="onPositionChange()" class="premium-input text-center">
                  </div>
                </div>
                <div class="control-row">
                  <div class="control-group half">
                    <label>Ancho (W)</label>
                    <input type="number" [(ngModel)]="currentSize.width" (ngModelChange)="onSizeChange()" class="premium-input text-center">
                  </div>
                  <div class="control-group half">
                    <label>Alto (H)</label>
                    <input type="number" [(ngModel)]="currentSize.height" (ngModelChange)="onSizeChange()" class="premium-input text-center">
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Canvas Area -->
          <div class="isolated-canvas" #canvas (mousedown)="onCanvasMouseDown($event)">
            <div class="canvas-viewport"
                 [style.width.px]="(config.canvasSize?.width || 1200) * viewportScale"
                 [style.height.px]="(config.canvasSize?.height || 800) * viewportScale">
              <div class="canvas-inner" #canvasInner
                   [style.width.px]="config.canvasSize?.width || 1200"
                   [style.height.px]="config.canvasSize?.height || 800"
                   [style.transform]="'scale(' + viewportScale + ')'"
                   [class.show-grid]="showGrid"
                   [class.grid-snapping]="snapToGrid">
                
                <div class="draggable-wrapper"
                     [style.left.px]="currentPosition.x"
                     [style.top.px]="currentPosition.y"
                     [style.width.px]="currentSize.width"
                     [style.height.px]="currentSize.height"
                     [class.is-dragging]="isDragging"
                     [class.is-resizing]="isResizing"
                     (mousedown)="onMouseDown($event)">
                  
                  <lib-ui-components-card-animated
                    [title]="editableContent['title'] || 'Card Title'"
                    [description]="editableContent['description'] || 'Card description'"
                    [image]="editableContent['image'] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80'"
                    [animation]="editableContent['animation'] || 'fade'"
                    [customStyles]="editableStyles"
                    style="width: 100%; height: 100%; display: block;">
                  </lib-ui-components-card-animated>

                  <!-- 8-point Resize Handles -->
                  <div class="resize-handle nw" [class.active]="resizeHandle === 'nw'" (mousedown)="startResize($event, 'nw')"></div>
                  <div class="resize-handle n"  [class.active]="resizeHandle === 'n'"  (mousedown)="startResize($event, 'n')"></div>
                  <div class="resize-handle ne" [class.active]="resizeHandle === 'ne'" (mousedown)="startResize($event, 'ne')"></div>
                  <div class="resize-handle e"  [class.active]="resizeHandle === 'e'"  (mousedown)="startResize($event, 'e')"></div>
                  <div class="resize-handle se" [class.active]="resizeHandle === 'se'" (mousedown)="startResize($event, 'se')"></div>
                  <div class="resize-handle s"  [class.active]="resizeHandle === 's'"  (mousedown)="startResize($event, 's')"></div>
                  <div class="resize-handle sw" [class.active]="resizeHandle === 'sw'" (mousedown)="startResize($event, 'sw')"></div>
                  <div class="resize-handle w"  [class.active]="resizeHandle === 'w'"  (mousedown)="startResize($event, 'w')"></div>

                  <!-- Dimension labels during resize -->
                  <div class="dimension-label width-label" *ngIf="isResizing">{{ currentSize.width }}px</div>
                  <div class="dimension-label height-label" *ngIf="isResizing">{{ currentSize.height }}px</div>
                </div>
              </div>
            </div>

            <!-- Position Dock -->
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
                <span class="label">SIZE</span>
                <span class="value">{{ currentSize.width }}×{{ currentSize.height }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">ANIM</span>
                <span class="value anim-tag">{{ editableContent['animation'] || 'none' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== FOOTER ===== -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">
            <b>G</b> rejilla · <b>S</b> snap · <b>R</b> reset · <b>Flechas</b> ajuste fino · <b>Ctrl+Z/Y</b> deshacer/rehacer
          </div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [ISOLATED_MODE_SHARED_STYLES, `
    /* Component-specific */
    .variant-hint { 
      font-size: 10px; 
      color: #64748b; 
      margin-top: 0.5rem; 
      font-style: italic; 
    }
    .image-preview {
      margin-top: 0.75rem;
    }
    .anim-tag {
      color: #34d399 !important;
      text-transform: uppercase;
    }
    .text-center { text-align: center; }
    .premium-textarea {
      resize: vertical;
      min-height: 60px;
      font-family: inherit;
    }
  `]
})
export class EditorCardAnimatedIsolatedModeComponent extends BaseIsolatedModeComponent {

  // ===== BaseIsolatedModeComponent overrides =====

  getDefaultSize() {
    return { width: 350, height: 420 };
  }

  initializeContent(): void {
    const c = this.config?.content || {};
    this.editableContent = {
      title: c.title || 'Card Title',
      description: c.description || 'Card description',
      image: c.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80',
      animation: c.animation || 'fade',
      duration: c.duration || 500,
      delay: c.delay || 0,
      variant: c.variant || this.config?.variant || 'default'
    };
  }

  initializeStyles(): void {
    const s = this.config?.styles || {};
    this.editableStyles = {
      backgroundColor: s.backgroundColor || '',
      ...s
    };
  }

  buildApplyPayload(): IsolatedModeConfig {
    return {
      ...this.config,
      content: { ...this.editableContent },
      styles: {
        ...this.editableStyles,
        width: this.currentSize.width + 'px',
        height: this.currentSize.height + 'px'
      },
      position: { ...this.currentPosition },
      size: { ...this.currentSize }
    };
  }
}
