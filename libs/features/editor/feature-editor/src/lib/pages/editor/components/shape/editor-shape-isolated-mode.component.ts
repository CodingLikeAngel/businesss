import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIShapeComponent } from '@negocio/ui-components';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

// Re-export IsolatedModeConfig for convenience
export { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

@Component({
  selector: 'lib-editor-shape-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UIShapeComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🧩 SHAPE EDITOR</span>
            <span class="separator">/</span>
            <span class="component-name">FORMAS VECTORIALES GOLD</span>
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
              
              <!-- SHAPE TYPE -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🧩</span>
                  <h4>FORMA VECTORIAL</h4>
                </div>
                
                <div class="control-group">
                  <label>Tipo de Geometría</label>
                  <select [(ngModel)]="editableContent.shapeType" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="circle">Círculo Perfecto</option>
                    <option value="square">Cuadrado / Rectángulo</option>
                    <option value="triangle">Triángulo</option>
                    <option value="blob">Gota Orgánica (Blob)</option>
                    <option value="wave">Onda Fluida (Wave)</option>
                    <option value="custom">SVG Path Personalizado</option>
                  </select>
                </div>

                <div class="control-group animate-fade-in" *ngIf="editableContent.shapeType === 'custom'">
                  <label>Definición del Path (SVG)</label>
                  <textarea [(ngModel)]="editableContent.customPath" (ngModelChange)="onContentChange()" class="premium-textarea" placeholder="M 0 0 L 100 0 ..."></textarea>
                </div>
              </div>

              <!-- APPEARANCE -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>ESTILO & RELLENO</h4>
                </div>
                
                <div class="control-group">
                  <label>Color de Fondo</label>
                  <div class="color-input-wrapper">
                    <div class="color-preview" [style.background-color]="editableStyles.fill">
                      <input type="color" [(ngModel)]="editableStyles.fill" (ngModelChange)="onContentChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableStyles.fill" (ngModelChange)="onContentChange()" class="premium-input hex-input">
                  </div>
                </div>

                <div class="control-row grid grid-cols-2 gap-4">
                  <div class="control-group">
                    <label>Opacidad ({{ (editableStyles.opacity * 100).toFixed(0) }}%)</label>
                    <input type="range" min="0" max="1" step="0.05" [(ngModel)]="editableStyles.opacity" (ngModelChange)="onContentChange()" class="premium-range">
                  </div>
                  <div class="control-group">
                    <label>Rotación ({{ editableStyles.rotate }}°)</label>
                    <input type="range" min="0" max="360" step="1" [(ngModel)]="editableStyles.rotate" (ngModelChange)="onContentChange()" class="premium-range">
                  </div>
                </div>
              </div>

              <!-- TRANSFORM SECTION -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">📐</span>
                  <h4>TRANSFORMACIÓN</h4>
                </div>
                <div class="control-row grid grid-cols-2 gap-2">
                  <div class="control-group">
                    <label>X / Y (PX)</label>
                    <div class="flex gap-2">
                      <input type="number" [(ngModel)]="currentPosition.x" (ngModelChange)="onPositionChange()" class="premium-input text-center p-1">
                      <input type="number" [(ngModel)]="currentPosition.y" (ngModelChange)="onPositionChange()" class="premium-input text-center p-1">
                    </div>
                  </div>
                  <div class="control-group">
                    <label>WIDTH / HEIGHT</label>
                    <div class="flex gap-2">
                       <input type="number" [(ngModel)]="currentSize.width" (ngModelChange)="onSizeChange()" class="premium-input text-center p-1">
                       <input type="number" [(ngModel)]="currentSize.height" (ngModelChange)="onSizeChange()" class="premium-input text-center p-1">
                    </div>
                  </div>
                </div>
              </div>
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
                  
                  <lib-ui-components-shape
                    [type]="editableContent.shapeType || 'blob'"
                    [customPath]="editableContent.customPath"
                    [customStyles]="getMergedStyles()"
                    style="width: 100%; height: 100%; display: block;">
                  </lib-ui-components-shape>

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
              <div class="dock-item"><span class="label">X</span><span class="value">{{ currentPosition.x }}</span></div>
              <div class="dock-item"><span class="label">Y</span><span class="value">{{ currentPosition.y }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">W</span><span class="value">{{ currentSize.width }}</span></div>
              <div class="dock-item"><span class="label">H</span><span class="value">{{ currentSize.height }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Usa los manejadores para transformar la geometría con soltura.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Forma</button>
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

    .canvas-inner { width: 4000px; height: 4000px; position: relative; background-size: 20px 20px;
      &.show-grid { background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px); }
      &.grid-snapping { background-image: radial-gradient(rgba(99, 102, 241, 0.25) 1.5px, transparent 1.5px); }
    }

    .draggable-wrapper { position: absolute !important; cursor: move; z-index: 100; outline: 2px solid transparent; outline-offset: 4px;
      &:hover { outline-color: rgba(99, 102, 241, 0.4); }
      &.is-dragging, &.is-resizing { outline-color: #6366f1; outline-width: 3px; }
    }

    .premium-input, .premium-select { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.6rem 0.8rem; border-radius: 10px; font-size: 12px; }
    .premium-textarea { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); color: #818cf8; padding: 0.6rem 0.8rem; border-radius: 10px; font-size: 11px; font-family: monospace; height: 80px; }
    .premium-range { width: 100%; accent-color: #6366f1; }
    .color-input-wrapper { display: flex; gap: 10px; align-items: center; .color-preview { width: 34px; height: 34px; border-radius: 8px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); input { position: absolute; inset: -5px; width: 150%; height: 150%; cursor: pointer; opacity: 0; } } .hex-input { font-family: monospace; } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class EditorShapeIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = { 
        ...this.config.content,
        shapeType: this.config.content.shapeType || 'blob',
        customPath: this.config.content.customPath || ''
    };
    this.editableStyles = { 
        ...this.config.styles,
        fill: this.config.styles?.fill || '#6366f1',
        opacity: this.config.styles?.opacity !== undefined ? this.config.styles.opacity : 1,
        rotate: this.config.styles?.rotate || 0
    };
    
    this.currentPosition = { ...(this.config.position || { x: 2000 - 150, y: 2000 - 150 }) };
    this.currentSize = { ...(this.config.size || { width: 300, height: 300 }) };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.8;

    this.saveState();
  }

  override onContentChange() {
    this.scheduleSaveState();
  }

  getMergedStyles() {
    return {
      ...this.editableStyles,
      transform: `rotate(${this.editableStyles.rotate}deg)`
    };
  }

  override apply() {
    this.applied.emit({
      ...this.config,
      content: { ...this.editableContent },
      styles: {
        ...this.getMergedStyles(),
        width: this.currentSize.width + 'px',
        height: this.currentSize.height + 'px',
        position: 'absolute',
        left: this.currentPosition.x + 'px',
        top: this.currentPosition.y + 'px'
      },
      position: { ...this.currentPosition },
      size: { ...this.currentSize }
    });
  }

  override onCanvasMouseDown(event: MouseEvent) { }
  onOverlayClick(event: MouseEvent) { this.cancel(); }
}
