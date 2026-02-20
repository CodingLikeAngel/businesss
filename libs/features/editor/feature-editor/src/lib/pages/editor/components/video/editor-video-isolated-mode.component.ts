import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIVideoComponent } from '@negocio/ui-components';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';

@Component({
  selector: 'lib-editor-video-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UIVideoComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">📽️ MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">VIDEO PRO GOLD</span>
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
              
              <!-- VIDEO SOURCE -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎬</span>
                  <h4>ORIGEN</h4>
                </div>
                
                <div class="control-group">
                  <label>URL del Video</label>
                  <input type="text" [(ngModel)]="editableContent.videoUrl" (ngModelChange)="onContentChange()" class="premium-input" placeholder="https://...">
                  <p class="variant-hint mt-2">Soporta MP4, YouTube, Vimeo o enlaces directos.</p>
                </div>

                <div class="control-row grid grid-cols-2 gap-4 mt-6">
                  <div class="checkbox-control" (click)="editableContent.autoplay = !editableContent.autoplay; onContentChange()">
                     <div class="custom-checkbox" [class.checked]="editableContent.autoplay"></div>
                     <span>Autoplay</span>
                  </div>
                  <div class="checkbox-control" (click)="editableContent.loop = !editableContent.loop; onContentChange()">
                     <div class="custom-checkbox" [class.checked]="editableContent.loop"></div>
                     <span>Loop</span>
                  </div>
                </div>
              </div>

              <!-- OVERLAY & EFFECTS -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎭</span>
                  <h4>EFECTOS & OVERLAY</h4>
                </div>
                
                <div class="control-group">
                  <label>Color de Filtro</label>
                  <div class="color-input-wrapper">
                    <div class="color-preview" [style.background-color]="editableStyles.overlayColor">
                      <input type="color" [(ngModel)]="editableStyles.overlayColor" (ngModelChange)="onContentChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableStyles.overlayColor" (ngModelChange)="onContentChange()" class="premium-input hex-input">
                  </div>
                </div>

                <div class="control-group">
                  <label>Opacidad del Video ({{ (editableStyles.opacity * 100).toFixed(0) }}%)</label>
                  <input type="range" min="0" max="1" step="0.05" [(ngModel)]="editableStyles.opacity" (ngModelChange)="onContentChange()" class="premium-range">
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
                    <label>X / Y</label>
                    <div class="flex gap-2">
                      <input type="number" [(ngModel)]="currentPosition.x" (ngModelChange)="onPositionChange()" class="premium-input text-center p-1">
                      <input type="number" [(ngModel)]="currentPosition.y" (ngModelChange)="onPositionChange()" class="premium-input text-center p-1">
                    </div>
                  </div>
                  <div class="control-group">
                    <label>W / H</label>
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
                  
                  <lib-ui-components-video
                    [src]="editableContent.videoUrl"
                    [autoplay]="editableContent.autoplay"
                    [loop]="editableContent.loop"
                    [muted]="true"
                    [customStyles]="editableStyles"
                    style="width: 100%; height: 100%; display: block;">
                  </lib-ui-components-video>

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
              <div class="dock-item"><span class="label">SIZE</span><span class="value">{{ currentSize.width }}x{{ currentSize.height }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Control de reproducción y efectos de capa para el video.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Configuración</button>
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

    .draggable-wrapper { position: absolute !important; cursor: move; z-index: 100; outline: 2px solid transparent; outline-offset: 4px; background: rgba(0, 0, 0, 0.4);
      &:hover { outline-color: rgba(99, 102, 241, 0.4); }
      &.is-dragging, &.is-resizing { outline-color: #6366f1; outline-width: 3px; }
    }

    .checkbox-control { display: flex; align-items: center; gap: 10px; cursor: pointer;
      span { font-size: 12px; color: #94a3b8; font-weight: 600; }
    }
    .custom-checkbox { width: 18px; height: 18px; border: 2px solid rgba(255, 255, 255, 0.15); border-radius: 4px; position: relative; transition: all 0.2s;
      &.checked { background: #6366f1; border-color: #6366f1; }
      &.checked::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: 900; }
    }

    .premium-input, .premium-select { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.6rem 0.8rem; border-radius: 10px; font-size: 12px; }
    .premium-range { width: 100%; accent-color: #6366f1; }
    .color-input-wrapper { display: flex; gap: 10px; align-items: center; .color-preview { width: 34px; height: 34px; border-radius: 8px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); input { position: absolute; inset: -5px; width: 150%; height: 150%; cursor: pointer; opacity: 0; } } .hex-input { font-family: monospace; } }
    .variant-hint { font-size: 10px; color: #64748b; font-style: italic; }
  `]
})
export class EditorVideoIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = { 
        ...this.config.content,
        videoUrl: this.config.content.videoUrl || '',
        autoplay: this.config.content.autoplay !== false,
        loop: this.config.content.loop !== false
    };
    this.editableStyles = { 
        ...this.config.styles,
        overlayColor: this.config.styles?.overlayColor || 'rgba(0,0,0,0.3)',
        opacity: this.config.styles?.opacity !== undefined ? this.config.styles.opacity : 1
    };
    
    this.currentPosition = { ...(this.config.position || { x: 2000 - 320, y: 2000 - 180 }) };
    this.currentSize = { ...(this.config.size || { width: 640, height: 360 }) };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.6;

    this.saveState();
  }

  override onContentChange() {
    this.scheduleSaveState();
  }

  override apply() {
    this.applied.emit({
      ...this.config,
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
    });
  }

  override onCanvasMouseDown(event: MouseEvent) { }
  onOverlayClick(event: MouseEvent) { this.cancel(); }
}
