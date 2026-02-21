import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiCardProductsComponent } from '@negocio/ui-components';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';

@Component({
  selector: 'lib-editor-card-product-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UiCardProductsComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🛍️ MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">CARD PRODUCT GOLD</span>
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
              <button class="icon-btn" (click)="resetPosition()" title="Reset (R)">
                <span class="icon">↺</span>
              </button>
            </div>

            <div class="divider"></div>

            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <!-- ===== BODY ===== -->
        <div class="isolated-mode-body">
          
          <!-- Sidebar: pestañas unificadas Contenido | Estilo | Avanzado -->
          <div class="controls-sidebar">
            <div class="sidebar-tabs">
              <button [class.active]="activeTab === 'content'" (click)="activeTab = 'content'">Contenido</button>
              <button [class.active]="activeTab === 'design'" (click)="activeTab = 'design'">Estilo</button>
              <button [class.active]="activeTab === 'advanced'" (click)="activeTab = 'advanced'">Avanzado</button>
            </div>
            <div class="sidebar-scroll-content">
              <ng-container *ngIf="activeTab === 'content'">
              <!-- PRODUCT INFO -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📦</span>
                  <h4>INFORMACIÓN</h4>
                </div>
                
                <div class="control-group">
                  <label>Nombre del Producto</label>
                  <input type="text" [(ngModel)]="editableContent.name" (ngModelChange)="onContentChange()" class="premium-input">
                </div>

                <div class="control-group">
                  <label>Descripción</label>
                  <textarea [(ngModel)]="editableContent.description" (ngModelChange)="onContentChange()" class="premium-textarea h-24"></textarea>
                </div>

                <div class="control-group">
                  <label>URL de Imagen</label>
                  <input type="text" [(ngModel)]="editableContent.image" (ngModelChange)="onContentChange()" class="premium-input">
                </div>
              </div>

              <!-- PRICING -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">💰</span>
                  <h4>PRECIO</h4>
                </div>
                
                <div class="control-row grid grid-cols-2 gap-3">
                  <div class="control-group">
                    <label>Precio</label>
                    <input type="number" [(ngModel)]="editableContent.price" (ngModelChange)="onContentChange()" class="premium-input">
                  </div>
                  <div class="control-group">
                    <label>Moneda</label>
                    <select [(ngModel)]="editableContent.currency" (ngModelChange)="onContentChange()" class="premium-select">
                      <option value="USD">USD $</option>
                      <option value="EUR">EUR €</option>
                      <option value="GBP">GBP £</option>
                      <option value="MXN">MXN $</option>
                    </select>
                  </div>
                </div>

                <div class="checkbox-control mb-3" (click)="editableContent.onSale = !editableContent.onSale; onContentChange()">
                   <div class="custom-checkbox" [class.checked]="editableContent.onSale"></div>
                   <span>En Oferta (Sale)</span>
                </div>

                <div class="control-group" *ngIf="editableContent.onSale">
                  <label>Precio Original</label>
                  <input type="number" [(ngModel)]="editableContent.originalPrice" (ngModelChange)="onContentChange()" class="premium-input">
                </div>
              </div>
              </ng-container>
              <ng-container *ngIf="activeTab === 'design'">
              <!-- APPEARANCE -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>APARIENCIA</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante Visual</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="default">Estándar</option>
                    <option value="primary">Primario</option>
                    <option value="secondary">Secundario</option>
                    <option value="glass">Vidrio (Glass)</option>
                    <option value="neon">Neón</option>
                    <option value="cyberpunk">Cyberpunk</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Tamaño</label>
                  <select [(ngModel)]="editableContent.size" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="sm">Pequeño</option>
                    <option value="md">Mediano</option>
                    <option value="lg">Grande</option>
                  </select>
                </div>
              </div>

              <!-- DIMENSIONS SECTION -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">📐</span>
                  <h4>TAMAÑO & POSICIÓN</h4>
                </div>
                <div class="control-row grid grid-cols-2 gap-2">
                  <div class="control-group">
                    <label>X</label>
                    <input type="number" [(ngModel)]="currentPosition.x" (ngModelChange)="onPositionChange()" class="premium-input text-center">
                  </div>
                  <div class="control-group">
                    <label>Y</label>
                    <input type="number" [(ngModel)]="currentPosition.y" (ngModelChange)="onPositionChange()" class="premium-input text-center">
                  </div>
                </div>
                <div class="control-row grid grid-cols-2 gap-2">
                  <div class="control-group">
                    <label>Width</label>
                    <input type="number" [(ngModel)]="currentSize.width" (ngModelChange)="onSizeChange()" class="premium-input text-center">
                  </div>
                  <div class="control-group">
                    <label>Height</label>
                    <input type="number" [(ngModel)]="currentSize.height" (ngModelChange)="onSizeChange()" class="premium-input text-center">
                  </div>
                </div>
              </div>
              </ng-container>
            </div>
          </div>

          <!-- Canvas Area -->
          <div class="isolated-canvas" #canvas (mousedown)="onCanvasMouseDown($event)">
              <div class="canvas-inner" #canvasInner
                   [style.transform]="'scale(' + viewportScale + ')'"
                   [style.transformOrigin]="'center'"
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
                  
                  <lib-card-products
                    [product]="{
                      name: editableContent.name || 'Producto',
                      price: (editableContent.currency || 'USD') + ' ' + (editableContent.price || 99),
                      image: editableContent.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
                      description: editableContent.description || 'Descripción del producto'
                    }"
                    [variant]="editableContent.variant || 'glass'"
                    [customStyles]="editableStyles"
                    style="display: block; width: 100%; height: 100%;">
                  </lib-card-products>

                  <!-- 8-point Resize Handles -->
                  <div class="resize-handle nw" (mousedown)="startResize($event, 'nw')"></div>
                  <div class="resize-handle n"  (mousedown)="startResize($event, 'n')"></div>
                  <div class="resize-handle ne" (mousedown)="startResize($event, 'ne')"></div>
                  <div class="resize-handle e"  (mousedown)="startResize($event, 'e')"></div>
                  <div class="resize-handle se" (mousedown)="startResize($event, 'se')"></div>
                  <div class="resize-handle s"  (mousedown)="startResize($event, 's')"></div>
                  <div class="resize-handle sw" (mousedown)="startResize($event, 'sw')"></div>
                  <div class="resize-handle w"  (mousedown)="startResize($event, 'w')"></div>
                </div>
              </div>

            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">PRICE</span><span class="value text-green-400">{{ editableContent.currency || 'USD' }} {{ editableContent.price || 0 }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">SIZE</span><span class="value">{{ currentSize.width }}x{{ currentSize.height }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Optimiza la visualización de tus productos en el catálogo.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Cambios</button>
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

    .canvas-inner {
      width: 4000px;
      height: 4000px;
      position: relative;
      background-size: 20px 20px;
      &.show-grid { background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px); }
      &.grid-snapping { background-image: radial-gradient(rgba(99, 102, 241, 0.25) 1.5px, transparent 1.5px); }
    }

    .draggable-wrapper {
      position: absolute !important;
      cursor: move;
      z-index: 100;
      outline: 2px solid transparent;
      outline-offset: 4px;
      background: rgba(255, 255, 255, 0.01);
      &:hover { outline-color: rgba(99, 102, 241, 0.4); }
      &.is-dragging, &.is-resizing { outline-color: #6366f1; outline-width: 3px; }
    }

    .checkbox-control {
      display: flex; align-items: center; gap: 10px; cursor: pointer;
      span { font-size: 12px; color: #94a3b8; font-weight: 600; }
    }
    .custom-checkbox {
      width: 18px; height: 18px; border: 2px solid rgba(255, 255, 255, 0.15); border-radius: 4px; position: relative; transition: all 0.2s;
      &.checked { background: #6366f1; border-color: #6366f1; }
      &.checked::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: 900; }
    }

    .premium-textarea { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.8rem; border-radius: 12px; font-size: 13px; line-height: 1.5; resize: none; }
    .premium-input, .premium-select { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.6rem 0.8rem; border-radius: 10px; font-size: 12px; }
  `]
})
export class EditorCardProductIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;
  activeTab: 'content' | 'design' | 'advanced' = 'content';

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = { ...this.config.content };
    this.editableStyles = { ...this.config.styles };
    
    // Position & Size initialization
    this.currentPosition = { ...(this.config.position || { x: 2000 - 150, y: 2000 - 200 }) };
    this.currentSize = { ...(this.config.size || { width: 300, height: 400 }) };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.6;

    this.saveState();
  }

  override apply() {
    const finalConfig = {
      ...this.config,
      variant: this.editableContent.variant,
      content: { ...this.editableContent },
      styles: {
        ...this.editableStyles,
        width: this.currentSize.width + 'px',
        height: this.currentSize.height + 'px',
        position: 'absolute',
        left: this.currentPosition.x + 'px',
        top: this.currentPosition.y + 'px'
      },
      position: { ...this.currentPosition },
      size: { ...this.currentSize }
    };
    this.applied.emit(finalConfig);
  }

  override onCanvasMouseDown(event: MouseEvent) { }
  onOverlayClick(event: MouseEvent) { this.cancel(); }
}
