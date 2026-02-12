import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UITitleComponent, variants } from '@negocio/ui-components';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';
import { BaseIsolatedModeComponent, ISOLATED_MODE_SHARED_STYLES } from '../base-isolated-mode.component';

@Component({
  selector: 'lib-editor-title-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UITitleComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🎯 MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">TITLE & TYPOGRAPHY</span>
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
                  <span class="section-icon">✏️</span>
                  <h4>CONTENIDO</h4>
                </div>
                
                <div class="control-group">
                  <label>Texto del Título</label>
                  <textarea [(ngModel)]="editableContent.text" (ngModelChange)="onContentChange()" class="premium-textarea" rows="3" placeholder="Escribe tu título aquí..."></textarea>
                </div>

                <div class="control-group">
                  <label>Nivel de Encabezado</label>
                  <div class="select-wrapper">
                    <select [(ngModel)]="editableContent.level" (ngModelChange)="onContentChange()" class="premium-select">
                      <option value="h1">H1 - Principal</option>
                      <option value="h2">H2 - Sección</option>
                      <option value="h3">H3 - Subsección</option>
                      <option value="h4">H4 - Detalle</option>
                      <option value="h5">H5 - Menor</option>
                      <option value="h6">H6 - Mini</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- STYLE SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>ESTILO & APARIENCIA</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante Visual</label>
                  <div class="select-wrapper">
                    <select [(ngModel)]="editableContent.variant" (ngModelChange)="onContentChange()" class="premium-select">
                      <option value="default">Estándar</option>
                      <option value="gradient">Gradiente (Premium)</option>
                      <option value="outline">Contorno (Outline)</option>
                      <option value="glitch">Glitch Effect</option>
                      <option value="neon">Neon Glow</option>
                      <option value="3d">3D Depth</option>
                      
                      <option disabled>──────────────</option>
                      
                      <ng-container *ngFor="let v of availableVariants">
                        <option *ngIf="!['default', 'gradient', 'outline', 'glitch', 'neon', '3d'].includes(v)" [value]="v">
                          {{ formatVariantName(v) }}
                        </option>
                      </ng-container>
                    </select>
                  </div>
                </div>

                <div class="control-group">
                  <label>Alineación</label>
                  <div class="alignment-btns">
                    <button class="align-btn" [class.active]="editableContent.align === 'left'" (click)="editableContent.align = 'left'; onContentChange()">⬅</button>
                    <button class="align-btn" [class.active]="editableContent.align === 'center'" (click)="editableContent.align = 'center'; onContentChange()">↔</button>
                    <button class="align-btn" [class.active]="editableContent.align === 'right'" (click)="editableContent.align = 'right'; onContentChange()">➡</button>
                  </div>
                </div>

                 <div class="control-group">
                  <label>Animación de Entrada</label>
                  <div class="select-wrapper">
                    <select [(ngModel)]="editableContent.animation" (ngModelChange)="onContentChange()" class="premium-select">
                      <option value="none">Sin Animación</option>
                      <option value="fade-up">Fade Up</option>
                      <option value="fade-in">Fade In</option>
                      <option value="zoom-in">Zoom In</option>
                      <option value="typewriter">Máquina de Escribir</option>
                      <option value="slide-in">Deslizar</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- COLORS SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🌈</span>
                  <h4>COLORES</h4>
                </div>
                
                <div class="control-group">
                  <label>Color Principal</label>
                  <div class="color-input-wrapper">
                    <div class="color-preview" [style.background-color]="editableStyles['color']">
                      <input type="color" [(ngModel)]="editableStyles['color']" (ngModelChange)="onStyleChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableStyles['color']" (ngModelChange)="onStyleChange()" class="premium-input" placeholder="#000000">
                  </div>
                </div>

                <div class="control-group">
                  <label>Tamaño de Fuente</label>
                  <input type="text" [(ngModel)]="editableStyles['fontSize']" (ngModelChange)="onStyleChange()" class="premium-input" placeholder="24px o 2rem">
                </div>

                <div class="control-group">
                  <label>Peso de Fuente</label>
                  <div class="select-wrapper">
                    <select [(ngModel)]="editableStyles['fontWeight']" (ngModelChange)="onStyleChange()" class="premium-select">
                      <option value="">Normal</option>
                      <option value="300">Light (300)</option>
                      <option value="400">Regular (400)</option>
                      <option value="500">Medium (500)</option>
                      <option value="600">Semibold (600)</option>
                      <option value="700">Bold (700)</option>
                      <option value="800">Extra Bold (800)</option>
                      <option value="900">Black (900)</option>
                    </select>
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
                  
                  <lib-ui-components-title
                    [text]="editableContent.text"
                    [level]="editableContent.level"
                    [variant]="editableContent.variant"
                    [align]="editableContent.align"
                    [animation]="editableContent.animation"
                    [customStyles]="editableStyles"
                    style="width: 100%; height: 100%; display: block;">
                  </lib-ui-components-title>

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
                <span class="label">LEVEL</span>
                <span class="value title-level">{{ editableContent.level }}</span>
              </div>
              <div class="dock-item">
                <span class="label">ALIGN</span>
                <span class="value">{{ editableContent.align }}</span>
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
    .alignment-btns {
      display: flex;
      gap: 4px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 3px;
    }
    .align-btn {
      flex: 1;
      padding: 6px;
      text-align: center;
      background: transparent;
      border: none;
      border-radius: 8px;
      color: #94a3b8;
      cursor: pointer;
      font-size: 11px;
      transition: all 0.2s;
    }
    .align-btn.active {
      background: var(--iso-primary);
      color: white;
      box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
    }
    .align-btn:hover:not(.active) {
      background: rgba(255, 255, 255, 0.06);
    }
    .title-level {
      color: #f472b6 !important;
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
export class EditorTitleIsolatedModeComponent extends BaseIsolatedModeComponent {
  availableVariants = variants;

  // ===== BaseIsolatedModeComponent overrides =====

  getDefaultSize() {
    return { width: 500, height: 80 };
  }

  initializeContent(): void {
    const c = this.config?.content || {};
    this.editableContent = {
      text: c.text || 'Título de ejemplo',
      level: c.level || 'h2',
      variant: c.variant || this.config?.variant || 'default',
      align: c.align || 'center',
      animation: c.animation || 'none'
    };
  }

  initializeStyles(): void {
    const s = this.config?.styles || {};
    this.editableStyles = {
      color: s.color || '',
      fontSize: s.fontSize || '',
      fontWeight: s.fontWeight || ''
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
