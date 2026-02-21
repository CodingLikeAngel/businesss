import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIListComponent } from '@negocio/ui-components';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';

@Component({
  selector: 'lib-editor-list-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UIListComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">📝 LIST EDITOR</span>
            <span class="separator">/</span>
            <span class="component-name">LISTA INTELIGENTE GOLD</span>
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
            <div class="sidebar-tabs">
              <button [class.active]="activeTab === 'content'" (click)="activeTab = 'content'">Contenido</button>
              <button [class.active]="activeTab === 'design'" (click)="activeTab = 'design'">Estilo</button>
              <button [class.active]="activeTab === 'advanced'" (click)="activeTab = 'advanced'">Avanzado</button>
            </div>

            <div class="sidebar-scroll-content">
              
              <!-- CONTENT SECTION -->
              <div class="sidebar-section" *ngIf="activeTab === 'content'">
                <div class="section-header">
                  <span class="section-icon">📋</span>
                  <h4>ELEMENTOS</h4>
                </div>
                
                <div class="item-list">
                  <div *ngFor="let item of editableItems; let i = index" class="list-item-card">
                    <div class="item-main">
                      <span class="item-index">{{ i + 1 }}</span>
                      <input type="text" [(ngModel)]="editableItems[i]" (ngModelChange)="onPartialChange()" class="premium-input-mini" placeholder="Texto del item...">
                      <button (click)="removeItem(i)" class="delete-btn">✕</button>
                    </div>
                  </div>
                </div>

                <button (click)="addItem()" class="add-btn-mini mt-4">+ Añadir Elemento</button>
              </div>

              <!-- STYLE SECTION -->
              <div class="sidebar-section" *ngIf="activeTab === 'design'">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>APARIENCIA</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante Visual</label>
                  <div class="select-wrapper">
                    <select [(ngModel)]="editableContent.variant" (ngModelChange)="onContentChange()" class="premium-select">
                      <option value="default">Estándar</option>
                      <option value="bordered">Con Bordes</option>
                      <option value="striped">Cebra (Striped)</option>
                      <option value="flush">Sin Bordes (Flush)</option>
                      <option value="cards">Tarjetas</option>
                    </select>
                  </div>
                </div>

                <div class="control-row grid grid-cols-2 gap-2">
                   <div class="control-group">
                      <label>Tamaño</label>
                      <select [(ngModel)]="editableContent.size" (ngModelChange)="onContentChange()" class="premium-select">
                        <option value="sm">Pequeño</option>
                        <option value="md">Normal</option>
                        <option value="lg">Grande</option>
                      </select>
                   </div>
                   <div class="control-group">
                      <label>Redondeado</label>
                      <select [(ngModel)]="editableContent.rounded" (ngModelChange)="onContentChange()" class="premium-select">
                        <option value="none">Recto</option>
                        <option value="md">Suave</option>
                        <option value="lg">Pronunciado</option>
                        <option value="full">Cápsula</option>
                      </select>
                   </div>
                </div>

                <div class="control-group">
                  <label>Animación</label>
                  <select [(ngModel)]="editableContent.animation" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="none">Ninguna</option>
                    <option value="fade">Fade In</option>
                    <option value="slide">Slide Up</option>
                    <option value="scale">Scale Up</option>
                  </select>
                </div>
              </div>

              <!-- POSITION SECTION -->
              <div class="sidebar-section no-border" *ngIf="activeTab === 'advanced'">
                <div class="section-header">
                  <span class="section-icon">📏</span>
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
                  
                  <lib-ui-components-list
                    [items]="editableItems"
                    [variant]="editableContent.variant"
                    [size]="editableContent.size"
                    [rounded]="editableContent.rounded"
                    [customStyles]="editableStyles"
                    style="display: block; width: 100%; height: 100%;">
                  </lib-ui-components-list>

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
              <div class="dock-item"><span class="label">ITEMS</span><span class="value text-indigo-400">{{ editableItems.length }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">SIZE</span><span class="value">{{ currentSize.width }}x{{ currentSize.height }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Lista Pro: Gestiona enumeraciones y colecciones con un diseño impecable.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
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

    .sidebar-tabs { display: flex; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .sidebar-tabs button { flex: 1; padding: 1rem; background: transparent; border: none; color: #64748b; font-size: 10px; font-weight: 900; letter-spacing: 1px; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.3s; }
    .sidebar-tabs button.active { color: #10b981; border-bottom-color: #10b981; background: rgba(16, 185, 129, 0.05); }

    .item-list { display: flex; flex-direction: column; gap: 8px; }
    .list-item-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 8px; }
    .item-main { display: flex; align-items: center; gap: 8px; }
    .item-index { font-size: 9px; font-weight: 900; color: #64748b; background: rgba(255,255,255,0.1); width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; border-radius: 4px; }
    
    .delete-btn { background: rgba(239, 68, 68, 0.1); color: #f87171; border: none; width: 24px; height: 24px; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
    .delete-btn:hover { background: #ef4444; color: white; }
    .add-btn-mini { width: 100%; background: transparent; border: 1px dashed rgba(16, 185, 129, 0.4); color: #10b981; padding: 10px; border-radius: 12px; font-size: 11px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
    .add-btn-mini:hover { background: rgba(16, 185, 129, 0.1); border-style: solid; }

    .premium-input, .premium-select { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.6rem 0.8rem; border-radius: 10px; font-size: 12px; }
    .premium-input-mini { width: 100%; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.4rem 0.6rem; border-radius: 6px; font-size: 11px; }
  `]
})
export class EditorListIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;
  activeTab: 'content' | 'design' | 'advanced' = 'content';
  editableItems: string[] = [];

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = { 
        ...this.config.content,
        variant: this.config.content.variant || 'default',
        size: this.config.content.size || 'md',
        rounded: this.config.content.rounded || 'md',
        animation: this.config.content.animation || 'none'
    };
    this.editableItems = [...(this.config.content['items'] || [])];
    this.editableStyles = { ...this.config.styles };
    
    this.currentPosition = { ...(this.config.position || { x: 2000 - 300, y: 2000 - 200 }) };
    this.currentSize = { ...(this.config.size || { width: 600, height: 400 }) };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.6;

    this.saveState();
  }

  addItem() {
    this.editableItems.push(`Nuevo elemento de lista`);
    this.onPartialChange();
  }

  removeItem(index: number) {
    this.editableItems.splice(index, 1);
    this.onPartialChange();
  }

  onPartialChange() {
    this.scheduleSaveState();
  }

  override apply() {
    this.applied.emit({
      ...this.config,
      variant: this.editableContent.variant,
      content: { 
        ...this.editableContent, 
        items: this.editableItems
      },
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
