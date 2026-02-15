import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UITabsComponent, Tab } from '@negocio/ui-components';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';

@Component({
  selector: 'lib-editor-tabs-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UITabsComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">📑 TABS EDITOR</span>
            <span class="separator">/</span>
            <span class="component-name">SISTEMA DE PESTAÑAS GOLD</span>
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
              <button [class.active]="activeTab === 'items'" (click)="activeTab = 'items'">ELEMENTOS</button>
              <button [class.active]="activeTab === 'design'" (click)="activeTab = 'design'">DISEÑO</button>
            </div>

            <div class="sidebar-scroll-content">
              
              <!-- ITEMS SECTION -->
              <div class="sidebar-section" *ngIf="activeTab === 'items'">
                <div class="section-header">
                  <span class="section-icon">🗂️</span>
                  <h4>LISTA DE PESTAÑAS</h4>
                  <button class="add-btn-mini" (click)="addItem()">+</button>
                </div>
                
                <div class="item-list">
                  <div *ngFor="let item of editableItems; let i = index" 
                       class="tab-item-card" 
                       [class.active]="selectedIndex === i"
                       (click)="selectedIndex = i">
                    <div class="item-main">
                      <span class="item-index">{{ i + 1 }}</span>
                      <input type="text" [(ngModel)]="item.label" (ngModelChange)="onPartialChange()" class="premium-input-mini" placeholder="Título...">
                      <button (click)="removeItem(i, $event)" class="delete-btn">✕</button>
                    </div>
                    <div *ngIf="selectedIndex === i" class="item-details animate-fade-in">
                       <label>ID de Sección (Anclaje)</label>
                       <input type="text" [(ngModel)]="item.sectionId" (ngModelChange)="onPartialChange()" class="premium-input-mini mt-1" placeholder="Ej: home, services...">
                    </div>
                  </div>
                </div>

                <button (click)="addItem()" class="add-btn-full mt-4">+ Añadir Pestaña</button>
              </div>

              <!-- DESIGN SECTION -->
              <div class="sidebar-section" *ngIf="activeTab === 'design'">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>APARIENCIA</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante Visual</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="default">Clásica</option>
                    <option value="pills">Botones (Pills)</option>
                    <option value="underline">Subrayado (Underline)</option>
                    <option value="minimal">Minimalista</option>
                    <option value="vertical">Vertical (Izquierda)</option>
                  </select>
                </div>

                <div class="control-row grid grid-cols-2 gap-2">
                   <div class="control-group">
                      <label>Alineación</label>
                      <select [(ngModel)]="editableContent.align" (ngModelChange)="onContentChange()" class="premium-select">
                        <option value="left">Izquierda</option>
                        <option value="center">Centro</option>
                        <option value="right">Derecha</option>
                      </select>
                   </div>
                   <div class="control-group">
                      <label>Orientación</label>
                      <select [(ngModel)]="editableContent.orientation" (ngModelChange)="onContentChange()" class="premium-select">
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                      </select>
                   </div>
                </div>

                <div class="control-group mt-6">
                   <label>Color de Acento</label>
                   <div class="color-input-wrapper">
                      <div class="color-preview" [style.background-color]="editableStyles.accentColor">
                         <input type="color" [(ngModel)]="editableStyles.accentColor" (ngModelChange)="onContentChange()">
                      </div>
                      <input type="text" [(ngModel)]="editableStyles.accentColor" (ngModelChange)="onContentChange()" class="premium-input hex-input">
                   </div>
                </div>

                <div class="section-header mt-8">
                  <span class="section-icon">📏</span>
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
                    <label>Width / Height</label>
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
                  
                  <lib-ui-components-tabs
                    [variant]="editableContent.variant"
                    [orientation]="editableContent.orientation"
                    [tabs]="editableItems"
                    [customStyles]="editableStyles"
                    style="display: block; width: 100%; height: 100%;">
                  </lib-ui-components-tabs>

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
              <div class="dock-item"><span class="label">TABS</span><span class="value text-indigo-400">{{ editableItems.length }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">SIZE</span><span class="value">{{ currentSize.width }}x{{ currentSize.height }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Tabs Pro: Organiza contenidos complejos de forma intuitiva.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../_isolated-mode-shared.scss'],
  styles: [`
    @import '../_isolated-mode-shared';
    @include isolated-mode-foundation;
    @include resize-handles;
    @include modern-dock;

    .canvas-inner { width: 4000px; height: 4000px; position: relative; background-size: 20px 20px;
      &.show-grid { background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px); }
      &.grid-snapping { background-image: radial-gradient(rgba(99, 102, 241, 0.25) 1.5px, transparent 1.5px); }
    }

    .draggable-wrapper { position: absolute !important; cursor: move; z-index: 100; outline: 2px solid transparent; outline-offset: 4px; background: rgba(255, 255, 255, 0.01);
      &:hover { outline-color: rgba(99, 102, 241, 0.4); }
      &.is-dragging, &.is-resizing { outline-color: #6366f1; outline-width: 3px; }
    }

    .sidebar-tabs { display: flex; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .sidebar-tabs button { flex: 1; padding: 1rem; background: transparent; border: none; color: #64748b; font-size: 10px; font-weight: 900; letter-spacing: 1px; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.3s; }
    .sidebar-tabs button.active { color: #10b981; border-bottom-color: #10b981; background: rgba(16, 185, 129, 0.05); }

    .item-list { display: flex; flex-direction: column; gap: 8px; }
    .tab-item-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 0.8rem; cursor: pointer; transition: all 0.2s;
      &.active { border-color: #10b981; background: rgba(16, 185, 129, 0.05); }
    }
    .item-main { display: flex; align-items: center; gap: 8px; }
    .item-index { font-size: 9px; font-weight: 900; color: #64748b; background: rgba(255,255,255,0.1); width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; border-radius: 4px; }
    .item-details { margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.05); label { display: block; font-size: 9px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 4px; } }

    .delete-btn { background: rgba(239, 68, 68, 0.1); color: #f87171; border: none; width: 22px; height: 22px; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
    .delete-btn:hover { background: #ef4444; color: white; }
    
    .add-btn-mini { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); width: 24px; height: 24px; border-radius: 6px; font-weight: 900; cursor: pointer; margin-left: auto; }
    .add-btn-full { width: 100%; padding: 0.8rem; background: transparent; border: 1px dashed rgba(16, 185, 129, 0.5); color: #10b981; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .add-btn-full:hover { background: rgba(16, 185, 129, 0.1); border-style: solid; }

    .premium-input, .premium-select { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.6rem 0.8rem; border-radius: 10px; font-size: 12px; }
    .premium-input-mini { width: 100%; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.4rem 0.6rem; border-radius: 6px; font-size: 11px; }

    .color-input-wrapper { display: flex; gap: 10px; align-items: center; .color-preview { width: 34px; height: 34px; border-radius: 8px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); input { position: absolute; inset: -5px; width: 150%; height: 150%; cursor: pointer; opacity: 0; } } .hex-input { font-family: monospace; } }
  `]
})
export class EditorTabsIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;
  activeTab: 'items' | 'design' = 'items';
  selectedIndex = 0;
  editableItems: Tab[] = [];

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = { 
        ...this.config.content,
        variant: this.config.content.variant || 'default',
        align: this.config.content.align || 'left',
        orientation: this.config.content.orientation || 'horizontal'
    };
    this.editableItems = [...(this.config.content['items'] || [])];
    this.editableStyles = { 
        ...this.config.styles,
        accentColor: this.config.styles?.accentColor || '#6366f1'
    };
    
    this.currentPosition = { ...(this.config.position || { x: 2000 - 300, y: 2000 - 100 }) };
    this.currentSize = { ...(this.config.size || { width: 600, height: 200 }) };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.6;

    this.saveState();
  }

  addItem() {
    const newItem: Tab = {
      label: `Nueva Pestaña ${this.editableItems.length + 1}`,
      sectionId: `tab_${Date.now()}`
    };
    this.editableItems.push(newItem);
    this.selectedIndex = this.editableItems.length - 1;
    this.onPartialChange();
  }

  removeItem(index: number, event: MouseEvent) {
    event.stopPropagation();
    this.editableItems.splice(index, 1);
    if (this.selectedIndex >= this.editableItems.length) {
      this.selectedIndex = Math.max(0, this.editableItems.length - 1);
    }
    this.onPartialChange();
  }

  onPartialChange() {
    this.scheduleSaveState();
  }

  override apply() {
    this.applied.emit({
      ...this.config,
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

  onCanvasMouseDown(event: MouseEvent) { }
  onOverlayClick(event: MouseEvent) { this.cancel(); }
}
