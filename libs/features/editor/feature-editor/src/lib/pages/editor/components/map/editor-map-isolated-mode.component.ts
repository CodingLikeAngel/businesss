import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIMapComponent } from '@negocio/ui-components';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

// Re-export IsolatedModeConfig for convenience
export { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

@Component({
  selector: 'lib-editor-map-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UIMapComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">📍 MAP EDITOR</span>
            <span class="separator">/</span>
            <span class="component-name">GOOGLE MAPS GOLD</span>
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
          
          <!-- Sidebar Controls -->
          <div class="controls-sidebar">
            <div class="sidebar-scroll-content">
              
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📍</span>
                  <h4>MÉTRICAS DE UBICACIÓN</h4>
                </div>
                
                <div class="control-group">
                  <label>Dirección Estratégica</label>
                  <textarea [(ngModel)]="editableContent.address" (ngModelChange)="onContentChange()" class="premium-textarea h-24" placeholder="Calle, Ciudad, Código Postal..."></textarea>
                </div>

                <div class="control-group mt-6">
                  <label>Zoom Nivel ({{ editableContent.zoom }})</label>
                  <input type="range" min="1" max="21" step="0.5" [(ngModel)]="editableContent.zoom" (ngModelChange)="onContentChange()" class="premium-range">
                  <div class="flex justify-between text-[9px] text-white/40 mt-1 uppercase font-bold">
                    <span>Mundo</span>
                    <span>Edificio</span>
                  </div>
                </div>
              </div>

              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>DISEÑO & APARIENCIA</h4>
                </div>
                
                <div class="control-group">
                  <label>Bordes Redondeados ({{ editableStyles.borderRadius }}px)</label>
                  <input type="range" min="0" max="100" step="4" [(ngModel)]="editableStyles.borderRadius" (ngModelChange)="onContentChange()" class="premium-range">
                </div>

                <div class="checkbox-control mt-4" (click)="editableContent.showOverlay = !editableContent.showOverlay; onContentChange()">
                   <div class="custom-checkbox" [class.checked]="editableContent.showOverlay"></div>
                   <span>Overlay Interactivo Activo</span>
                </div>
              </div>

              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">📐</span>
                  <h4>CANVAS GEOMETRÍA</h4>
                </div>
                <div class="control-row grid grid-cols-2 gap-2">
                  <div class="control-group">
                    <label>WIDTH (PX)</label>
                    <input type="number" [(ngModel)]="currentSize.width" (ngModelChange)="onSizeChange()" class="premium-input text-center">
                  </div>
                  <div class="control-group">
                    <label>HEIGHT (PX)</label>
                    <input type="number" [(ngModel)]="currentSize.height" (ngModelChange)="onSizeChange()" class="premium-input text-center">
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
                  
                  <lib-ui-map
                    [address]="editableContent.address"
                    [zoom]="editableContent.zoom"
                    [showOverlay]="editableContent.showOverlay"
                    [customStyles]="getMergedStyles()"
                    style="width: 100%; height: 100%; display: block; border-radius: inherit;">
                  </lib-ui-map>

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
              <div class="dock-item"><span class="label">ZOOM</span><span class="value">{{ editableContent.zoom }}x</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">UBICACIÓN</span><span class="value text-emerald-400">Google API Active</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">SIZE</span><span class="value">{{ currentSize.width }}x{{ currentSize.height }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Map Pro: Las direcciones precisas mejoran la tasa de conversión en un 25%.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Ubicación</button>
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

    .canvas-inner { width: 6000px; height: 4000px; position: relative; padding: 200px;
      &.show-grid { background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1.5px, transparent 1.5px); background-size: 40px 40px; }
      &.grid-snapping { background-image: radial-gradient(rgba(16, 185, 129, 0.2) 2px, transparent 2px); background-size: 40px 40px; }
    }

    .draggable-wrapper { position: absolute !important; cursor: move; z-index: 100; outline: 3px solid transparent; outline-offset: 6px; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.6); overflow: hidden;
      &:hover { outline-color: rgba(16, 185, 129, 0.3); }
      &.is-dragging, &.is-resizing { outline-color: #10b981; outline-width: 4px; }
    }

    .checkbox-control { display: flex; align-items: center; gap: 10px; cursor: pointer;
      span { font-size: 11px; color: #94a3b8; font-weight: 800; text-transform: uppercase; }
    }
    .custom-checkbox { width: 20px; height: 20px; border: 2px solid rgba(255, 255, 255, 0.15); border-radius: 6px; position: relative; transition: all 0.2s;
      &.checked { background: #10b981; border-color: #10b981; }
      &.checked::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: 900; }
    }

    .premium-input { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.7rem 0.9rem; border-radius: 12px; font-size: 13px; }
    .premium-textarea { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.7rem 0.9rem; border-radius: 12px; font-size: 12px; resize: none; }
    .premium-range { width: 100%; accent-color: #10b981; }

    .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class EditorMapIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = { 
        ...this.config.content,
        address: this.config.content.address || 'Madrid, Spain',
        zoom: this.config.content.zoom || 15,
        showOverlay: this.config.content.showOverlay !== false
    };
    this.editableStyles = { 
        ...this.config.styles,
        borderRadius: parseInt(this.config.styles.borderRadius) || 12
    };
    
    this.currentPosition = { ...(this.config.position || { x: 50, y: 50 }) };
    this.currentSize = { 
        width: this.config.size?.width || 800, 
        height: this.config.size?.height || 500 
    };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.5;

    this.saveState();
  }

  override onContentChange() {
    this.scheduleSaveState();
  }

  getMergedStyles() {
    return {
      ...this.editableStyles,
      borderRadius: this.editableStyles.borderRadius + 'px'
    };
  }

  override apply() {
    this.applied.emit({
      ...this.config,
      content: { ...this.editableContent },
      styles: {
        ...this.editableStyles,
        ...this.getMergedStyles(),
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

  override onCanvasMouseDown(event: MouseEvent) { }
  onOverlayClick(event: MouseEvent) { this.cancel(); }
}
