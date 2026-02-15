import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UITableComponent, tableVariants, TableColumn, TableRow } from '@negocio/ui-components';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';

@Component({
  selector: 'lib-editor-table-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UITableComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">📊 DATA EDITOR</span>
            <span class="separator">/</span>
            <span class="component-name">TABLA PRO GOLD</span>
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
              <button [class.active]="activeTab === 'data'" (click)="activeTab = 'data'">DATOS</button>
              <button [class.active]="activeTab === 'style'" (click)="activeTab = 'style'">DISEÑO</button>
            </div>

            <div class="sidebar-scroll-content">
              
              <!-- DATA SECTION -->
              <div class="sidebar-section" *ngIf="activeTab === 'data'">
                <div class="section-header">
                  <span class="section-icon">📋</span>
                  <h4>COLUMNAS</h4>
                  <button class="add-btn-mini" (click)="addColumn()">+</button>
                </div>
                
                <div class="column-list">
                  <div *ngFor="let col of editableColumns; let i = index" class="column-item">
                    <input type="text" [(ngModel)]="col.label" (ngModelChange)="onPartialChange()" placeholder="Etiqueta..." class="premium-input-mini">
                    <input type="text" [(ngModel)]="col.key" (ngModelChange)="onPartialChange()" placeholder="Clave..." class="premium-input-mini opacity-60">
                    <button (click)="removeColumn(i)" class="delete-btn">✕</button>
                  </div>
                </div>

                <div class="section-header mt-8">
                  <span class="section-icon">🔢</span>
                  <h4>VALORES (FILAS)</h4>
                </div>

                <div class="row-list-scroller">
                  <div *ngFor="let row of editableRows; let rowIndex = index" class="row-editor-card">
                    <div class="row-editor-header">
                      <span>Fila #{{ rowIndex + 1 }}</span>
                      <button (click)="removeRow(rowIndex)" class="text-red-400 hover:text-red-300">Eliminar</button>
                    </div>
                    <div class="grid grid-cols-1 gap-2 p-3">
                       <div *ngFor="let col of editableColumns" class="control-group-compact">
                          <label>{{ col.label }}</label>
                          <input type="text" [(ngModel)]="row[col.key]" (ngModelChange)="onPartialChange()" class="premium-input-mini">
                       </div>
                    </div>
                  </div>
                </div>
                <button (click)="addRow()" class="add-btn-full mt-4">+ Añadir Nueva Fila</button>
              </div>

              <!-- STYLE SECTION -->
              <div class="sidebar-section" *ngIf="activeTab === 'style'">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>APARIENCIA</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante Visual</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onPartialChange()" class="premium-select">
                    <option *ngFor="let v of variants" [value]="v">{{ v | titlecase }}</option>
                  </select>
                </div>

                <div class="control-row grid grid-cols-2 gap-2">
                   <div class="control-group">
                      <label>Tamaño</label>
                      <select [(ngModel)]="editableContent.size" (ngModelChange)="onContentChange()" class="premium-select">
                        <option value="sm">Compacto</option>
                        <option value="md">Mediano</option>
                        <option value="lg">Espacioso</option>
                      </select>
                   </div>
                   <div class="control-group">
                      <label>Redondeado</label>
                      <select [(ngModel)]="editableContent.rounded" (ngModelChange)="onContentChange()" class="premium-select">
                        <option value="none">Recto</option>
                        <option value="md">Suave</option>
                        <option value="full">Redondo</option>
                      </select>
                   </div>
                </div>

                <div class="checkbox-control mb-4" (click)="editableContent.dark = !editableContent.dark; onContentChange()">
                   <div class="custom-checkbox" [class.checked]="editableContent.dark"></div>
                   <span>Modo Oscuro (Dark Pro)</span>
                </div>

                <div class="section-header mt-8">
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
                    <label>Dimensions</label>
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
          <div class="isolated-canvas" #canvas (mousedown)="onCanvasMouseDown($event)" [class.is-dark]="editableContent.dark">
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
                  
                  <lib-ui-components-table
                    [variant]="editableContent.variant"
                    [size]="editableContent.size"
                    [rounded]="editableContent.rounded"
                    [dark]="editableContent.dark"
                    [columns]="editableColumns"
                    [rows]="editableRows"
                    style="display: block; width: 100%; height: 100%;">
                  </lib-ui-components-table>

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
              <div class="dock-item"><span class="label">COLS</span><span class="value text-indigo-400">{{ editableColumns.length }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">ROWS</span><span class="value text-blue-400">{{ editableRows.length }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Tabla de Datos Pro: Configura columnas y filas con precisión atómica.</div>
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

    .column-list { display: flex; flex-direction: column; gap: 8px; }
    .column-item { display: flex; gap: 6px; align-items: center; background: rgba(255,255,255,0.02); padding: 6px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.03); }
    .delete-btn { background: rgba(239, 68, 68, 0.1); color: #f87171; border: none; width: 24px; height: 24px; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
    .delete-btn:hover { background: #ef4444; color: white; }
    
    .add-btn-mini { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); width: 24px; height: 24px; border-radius: 6px; font-weight: 900; cursor: pointer; margin-left: auto; }
    .add-btn-full { width: 100%; padding: 0.8rem; background: transparent; border: 1px dashed rgba(16, 185, 129, 0.5); color: #10b981; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .add-btn-full:hover { background: rgba(16, 185, 129, 0.1); border-style: solid; }

    .row-editor-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; margin-bottom: 1rem; overflow: hidden; }
    .row-editor-header { padding: 8px 12px; background: rgba(255,255,255,0.02); display: flex; justify-content: space-between; font-size: 10px; font-weight: 800; color: #94a3b8; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .row-list-scroller { max-height: 400px; overflow-y: auto; padding-right: 4px; }
    .control-group-compact { margin-bottom: 0.5rem; label { display: block; font-size: 9px; font-weight: 800; color: #64748b; margin-bottom: 2px; text-transform: uppercase; } }

    .checkbox-control { display: flex; align-items: center; gap: 10px; cursor: pointer;
      span { font-size: 12px; color: #94a3b8; font-weight: 600; }
    }
    .custom-checkbox { width: 18px; height: 18px; border: 2px solid rgba(255, 255, 255, 0.15); border-radius: 4px; position: relative; transition: all 0.2s;
      &.checked { background: #6366f1; border-color: #6366f1; }
      &.checked::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: 900; }
    }

    .premium-input, .premium-select { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.6rem 0.8rem; border-radius: 10px; font-size: 12px; }
    .premium-input-mini { width: 100%; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.4rem 0.6rem; border-radius: 6px; font-size: 11px; }

    .isolated-canvas.is-dark { background: #020617; }
  `]
})
export class EditorTableIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;
  activeTab: 'data' | 'style' = 'data';
  variants = tableVariants;
  
  editableColumns: TableColumn[] = [];
  editableRows: TableRow[] = [];

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = { 
        ...this.config.content,
        variant: this.config.content.variant || 'default',
        size: this.config.content.size || 'md',
        rounded: this.config.content.rounded || 'md',
        dark: this.config.content.dark || false
    };
    this.editableColumns = [...(this.config.content['columns'] || [])];
    this.editableRows = [...(this.config.content['rows'] || [])];
    this.editableStyles = { ...this.config.styles };
    
    this.currentPosition = { ...(this.config.position || { x: 2000 - 400, y: 2000 - 200 }) };
    this.currentSize = { ...(this.config.size || { width: 800, height: 400 }) };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.5;

    this.saveState();
  }

  addColumn() {
    const newKey = `col_${this.editableColumns.length + 1}`;
    this.editableColumns.push({ key: newKey, label: `Columna ${this.editableColumns.length + 1}` });
    this.editableRows.forEach(row => row[newKey] = '-');
    this.onPartialChange();
  }

  removeColumn(index: number) {
    const key = this.editableColumns[index].key;
    this.editableColumns.splice(index, 1);
    this.editableRows.forEach(row => delete row[key]);
    this.onPartialChange();
  }

  addRow() {
    const newRow: TableRow = {};
    this.editableColumns.forEach(col => newRow[col.key] = 'Dato');
    this.editableRows.push(newRow);
    this.onPartialChange();
  }

  removeRow(index: number) {
    this.editableRows.splice(index, 1);
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
        columns: this.editableColumns,
        rows: this.editableRows
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
