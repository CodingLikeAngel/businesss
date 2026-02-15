import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';
import { AppState } from '../../../../store/state/app.state';
import { selectCurrentPageGlobalStyles } from '../../../../store/selectors/page.selectors';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-editor-smart-container-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">📦 SMART CONTAINER</span>
            <span class="separator">/</span>
            <span class="component-name">ORCHESTRATION GOLD</span>
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
              <button [class.active]="activeTab === 'layout'" (click)="activeTab = 'layout'">ESTRUCTURA</button>
              <button [class.active]="activeTab === 'style'" (click)="activeTab = 'style'">ESTILO</button>
            </div>

            <div class="sidebar-scroll-content">
              
              <!-- LAYOUT SECTION -->
              <div class="sidebar-section animate-fade-in" *ngIf="activeTab === 'layout'">
                <div class="section-header">
                  <span class="section-icon">📐</span>
                  <h4>ORDEN DE ELEMENTOS</h4>
                </div>
                
                <div class="reorder-tips">Organiza tus componentes internos arrastrando para cambiar su prioridad visual.</div>
                
                <div class="draggable-item-list">
                  <div *ngFor="let child of editableChildren; let i = index" 
                       class="child-item-card" 
                       draggable="true"
                       (dragstart)="onDragStart($event, i)"
                       (dragover)="onDragOver($event)"
                       (drop)="onDrop($event, i)"
                       (dragend)="onDragEnd()">
                    <span class="drag-handle">⠿</span>
                    <span class="child-index">#{{ i + 1 }}</span>
                    <span class="child-type">{{ child.type }}</span>
                  </div>
                </div>

                <div class="control-group mt-8">
                  <label>Gap entre Elementos ({{ editableContent.gap }}px)</label>
                  <input type="range" min="0" max="100" step="5" [(ngModel)]="editableContent.gap" (ngModelChange)="onContentChange()" class="premium-range">
                </div>
              </div>

              <!-- STYLE SECTION -->
              <div class="sidebar-section animate-fade-in" *ngIf="activeTab === 'style'">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>APARIENCIA DEL CONTENEDOR</h4>
                </div>
                
                <div class="control-group">
                  <label>Color de Fondo</label>
                  <div class="color-row">
                    <div class="color-preview" [style.background-color]="editableStyles.backgroundColor">
                      <input type="color" [(ngModel)]="editableStyles.backgroundColor" (ngModelChange)="onContentChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableStyles.backgroundColor" (ngModelChange)="onContentChange()" class="premium-input-mini">
                  </div>
                  <div class="theme-palette mt-2" *ngIf="globalColors$ | async as colors">
                     <div *ngFor="let c of colors" class="swatch" [style.background-color]="c" (click)="editableStyles.backgroundColor = c; onContentChange()"></div>
                  </div>
                </div>

                <div class="control-group">
                  <label>Padding Interno ({{ editableStyles.paddingProp }}px)</label>
                  <input type="range" min="0" max="100" step="5" [(ngModel)]="editableStyles.paddingProp" (ngModelChange)="onContentChange()" class="premium-range">
                </div>

                <div class="control-group">
                  <label>Radio de Borde ({{ editableStyles.borderRadiusProp }}px)</label>
                  <input type="range" min="0" max="60" step="4" [(ngModel)]="editableStyles.borderRadiusProp" (ngModelChange)="onContentChange()" class="premium-range">
                </div>

                <div class="control-group">
                  <label>Sombra Gold</label>
                  <select [(ngModel)]="editableStyles.boxShadow" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="none">Ninguna</option>
                    <option value="0 10px 30px rgba(0,0,0,0.1)">Suave</option>
                    <option value="0 20px 60px rgba(0,0,0,0.3)">Atrevida</option>
                    <option value="0 30px 100px rgba(0,0,0,0.5)">Dramática</option>
                  </select>
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
                     [style.minHeight.px]="currentSize.height"
                     [style.backgroundColor]="editableStyles.backgroundColor"
                     [style.padding.px]="editableStyles.paddingProp"
                     [style.borderRadius.px]="editableStyles.borderRadiusProp"
                     [style.boxShadow]="editableStyles.boxShadow"
                     [class.is-dragging]="isDragging"
                     [class.is-resizing]="isResizing"
                     (mousedown)="onMouseDown($event)">
                  
                  <div class="smart-content-flow" [style.gap.px]="editableContent.gap">
                      <div *ngFor="let child of editableChildren" class="placeholder-child">
                         <span class="label">COMPONENT: {{ child.type }}</span>
                      </div>
                      <div class="empty-hint" *ngIf="editableChildren.length === 0">El contenedor está vacío</div>
                  </div>

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
              <div class="dock-item"><span class="label">CHILDREN</span><span class="value">{{ editableChildren.length }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">GAP</span><span class="value">{{ editableContent.gap }}px</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">SIZE</span><span class="value">{{ currentSize.width }}x{{ currentSize.height }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Smart Container Gold: Flexibilidad total para orquestar tus diseños más complejos.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Contenedor</button>
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
        &.active { color: #f472b6; border-bottom-color: #f472b6; background: rgba(244, 114, 182, 0.05); }
      }
    }

    .canvas-inner { width: 4000px; height: 3000px; position: relative; padding-top: 150px;
      &.show-grid { background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px); background-size: 30px 30px; }
    }

    .draggable-wrapper { position: absolute !important; cursor: move; z-index: 100; border: 2px dashed transparent; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      &:hover { border-color: rgba(244, 114, 182, 0.3); }
      &.is-dragging, &.is-resizing { border-color: #f472b6; background: rgba(244, 114, 182, 0.02); }
    }

    .smart-content-flow { display: flex; flex-direction: column; width: 100%; height: 100%; 
      .placeholder-child { background: rgba(255,255,255,0.05); border: 1px dashed rgba(255,255,255,0.1); padding: 20px; border-radius: 12px; display: flex; align-items: center; justify-content: center; .label { font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 1px; } }
      .empty-hint { color: #475569; font-size: 12px; font-style: italic; text-align: center; margin-top: 40px; }
    }

    .reorder-tips { font-size: 11px; color: #64748b; margin-bottom: 20px; line-height: 1.5; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 10px; }
    .draggable-item-list { display: flex; flex-direction: column; gap: 10px; }
    .child-item-card { background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 12px; cursor: grab; display: flex; align-items: center; gap: 12px; transition: all 0.2s;
      &:active { cursor: grabbing; transform: scale(0.98); opacity: 0.8; }
      &:hover { border-color: rgba(255, 255, 255, 0.15); }
      .drag-handle { color: #334155; font-size: 18px; }
      .child-index { font-weight: 900; color: #f472b6; font-size: 10px; }
      .child-type { font-weight: 700; color: white; font-size: 12px; text-transform: uppercase; }
    }

    .color-row { display: flex; gap: 10px; align-items: center; .color-preview { width: 34px; height: 34px; border-radius: 8px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); input { position: absolute; inset: -5px; width: 150%; height: 150%; cursor: pointer; opacity: 0; } } }
    .theme-palette { display: flex; flex-wrap: wrap; gap: 5px; .swatch { width: 20px; height: 20px; border-radius: 4px; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); transition: transform 0.2s; &:hover { transform: scale(1.2); } } }

    .premium-input, .premium-select { width: 100%; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); color: white; padding: 0.8rem 1rem; border-radius: 12px; font-size: 13px; &:focus { border-color: #f472b6; outline: none; } }
    .premium-input-mini { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-family: monospace; }
    .premium-range { width: 100%; accent-color: #f472b6; }

    .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class EditorSmartContainerIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;

  private store = inject(Store<AppState>);
  globalColors$: Observable<string[]> = this.store.select(selectCurrentPageGlobalStyles).pipe(
    map(styles => styles ? [styles.primaryColor, styles.secondaryColor, styles.accentColor, styles.backgroundColor, styles.textColor].filter(Boolean) : [])
  );

  activeTab: 'layout' | 'style' = 'layout';
  editableChildren: any[] = [];
  dragToIndex = -1;

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = { 
        ...this.config.content,
        gap: this.config.content.gap || 20
    };
    this.editableChildren = JSON.parse(JSON.stringify(this.config.content.children || []));
    this.editableStyles = { 
        ...this.config.styles,
        paddingProp: parseInt(this.config.styles.padding) || 40,
        borderRadiusProp: parseInt(this.config.styles.borderRadius) || 24,
        backgroundColor: this.config.styles.backgroundColor || 'transparent',
        boxShadow: this.config.styles.boxShadow || 'none'
    };
    
    this.currentPosition = { ...(this.config.position || { x: 300, y: 150 }) };
    this.currentSize = { 
        width: this.config.size?.width || 800, 
        height: this.config.size?.height || 600 
    };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.5;

    this.saveState();
  }

  override saveState() {
    const newState = {
      position: { ...this.currentPosition },
      size: { ...this.currentSize },
      styles: JSON.parse(JSON.stringify(this.editableStyles)),
      content: {
        ...JSON.parse(JSON.stringify(this.editableContent)),
        children: JSON.parse(JSON.stringify(this.editableChildren))
      }
    };

    const lastState = this.undoStack[this.undoStack.length - 1];
    if (lastState && JSON.stringify(lastState) === JSON.stringify(newState)) return;

    this.undoStack.push(newState as any);
    if (this.undoStack.length > 50) this.undoStack.shift();
    this.redoStack = [];
  }

  onDragStart(event: DragEvent, index: number) {
    event.dataTransfer?.setData('text/plain', index.toString());
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, dropIndex: number) {
    event.preventDefault();
    const dragIndex = parseInt(event.dataTransfer?.getData('text/plain') || '-1');
    if (dragIndex !== -1 && dragIndex !== dropIndex) {
      const movedItem = this.editableChildren.splice(dragIndex, 1)[0];
      this.editableChildren.splice(dropIndex, 0, movedItem);
      this.onContentChange();
    }
  }

  onDragEnd() { }

  override apply() {
    this.applied.emit({
      ...this.config,
      content: { 
        ...this.editableContent, 
        children: this.editableChildren
      },
      styles: {
        ...this.editableStyles,
        padding: this.editableStyles.paddingProp + 'px',
        borderRadius: this.editableStyles.borderRadiusProp + 'px',
        left: this.currentPosition.x + 'px',
        top: this.currentPosition.y + 'px',
        width: this.currentSize.width + 'px',
        minHeight: this.currentSize.height + 'px',
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
