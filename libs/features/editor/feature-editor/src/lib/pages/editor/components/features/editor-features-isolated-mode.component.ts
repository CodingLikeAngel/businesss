import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UICardAnimatedComponent } from '@negocio/ui-components';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

@Component({
  selector: 'lib-editor-features-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UICardAnimatedComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">GRID EDITOR</span>
            <span class="separator">/</span>
            <span class="component-name">FEATURES COLLECTION</span>
          </div>
          
          <div class="header-actions">
            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <div class="isolated-mode-body">
          <div class="controls-sidebar">
            <div class="sidebar-scroll-content">
              
              <!-- GRID SETTINGS -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📐</span>
                  <h4>LAYOUT & GRID</h4>
                </div>
                
                <div class="control-group">
                  <label>Columnas (Escritorio)</label>
                  <div class="grid-cols-selector">
                    <button [class.active]="gridCols === 2" (click)="gridCols = 2">2</button>
                    <button [class.active]="gridCols === 3" (click)="gridCols = 3">3</button>
                    <button [class.active]="gridCols === 4" (click)="gridCols = 4">4</button>
                  </div>
                </div>

                <div class="control-group">
                  <label>Espaciado (Gap)</label>
                  <input type="range" min="4" max="20" step="2" [(ngModel)]="gridGap" class="w-full">
                  <span class="text-xs text-gray-400 mt-1 block">{{gridGap * 0.25}}rem</span>
                </div>
              </div>

              <!-- ITEMS EDITOR -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">✨</span>
                  <h4>ELEMENTOS ({{ editableItems.length }})</h4>
                  <button class="add-btn" (click)="addItem()">+ Add</button>
                </div>
                
                <div class="items-list">
                  <div *ngFor="let item of editableItems; let i = index" class="feature-item-row" [class.active]="selectedItemIndex === i" (click)="selectItem(i)">
                    <div class="item-drag-handle">::</div>
                    <div class="item-content">
                      <span class="item-title">{{ item.title || 'Nuevo Elemento' }}</span>
                      <span class="item-desc">{{ item.description | slice:0:30 }}...</span>
                    </div>
                    <button class="delete-btn" (click)="removeItem(i, $event)">×</button>
                  </div>
                </div>
              </div>

              <!-- SELECTED ITEM EDITOR -->
              <div class="sidebar-section no-border" *ngIf="selectedItemIndex !== -1">
                <div class="section-header">
                  <span class="section-icon">✏️</span>
                  <h4>EDITAR ITEM #{{ selectedItemIndex + 1 }}</h4>
                </div>

                <div class="control-group">
                  <label>Icono</label>
                  <input type="text" [(ngModel)]="editableItems[selectedItemIndex].icon" class="premium-input" placeholder="e.g. rocket, star...">
                </div>

                <div class="control-group">
                  <label>Título</label>
                  <input type="text" [(ngModel)]="editableItems[selectedItemIndex].title" class="premium-input">
                </div>

                <div class="control-group">
                  <label>Descripción</label>
                  <textarea [(ngModel)]="editableItems[selectedItemIndex].description" class="premium-input" rows="3"></textarea>
                </div>

                <div class="control-group">
                  <label>Variante Individual</label>
                  <select [(ngModel)]="editableItems[selectedItemIndex].variant" class="premium-input">
                     <option [value]="undefined">Heredar de Sección</option>
                     <option value="default">Default</option>
                     <option value="glass">Glass</option>
                     <option value="neon">Neon</option>
                     <option value="cyberpunk">Cyberpunk</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          <div class="isolated-canvas">
            <div class="canvas-inner">
               <div class="features-preview-grid" 
                    [style.grid-template-columns]="'repeat(' + gridCols + ', 1fr)'"
                    [style.gap.rem]="gridGap * 0.25">
                 
                 <div *ngFor="let item of editableItems; let i = index" 
                      class="preview-item"
                      [class.selected]="selectedItemIndex === i"
                      (click)="selectItem(i)">
                    <lib-ui-components-card-animated
                      [icon]="item.icon"
                      [title]="item.title"
                      [description]="item.description"
                      [variant]="item.variant || 'default'"
                    ></lib-ui-components-card-animated>
                 </div>

               </div>
            </div>
            
            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">GRID</span><span class="value text-indigo-400">{{ gridCols }} COLS</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">TOTAL</span><span class="value">{{ editableItems.length }} ITEMS</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Gestiona tu grid de características. Arrastra para reordenar (próximamente).</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Colección</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .isolated-mode-overlay {
      position: fixed; inset: 0; background: rgba(2, 6, 23, 0.98); backdrop-filter: blur(10px);
      z-index: 9999999; display: flex; align-items: center; justify-content: center; padding: 1.5rem;
    }
    .isolated-mode-container {
      background: #0f172a; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px;
      width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden;
      box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.7);
    }
    .isolated-mode-header {
      height: 64px; padding: 0 1.5rem; background: #1e293b; border-bottom: 1px solid rgba(255,255,255,0.05);
      display: flex; align-items: center; justify-content: space-between;
    }
    .mode-badge { font-size: 10px; font-weight: 800; color: #38bdf8; background: rgba(56, 189, 248, 0.1); padding: 5px 10px; border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.2); }
    .component-name { color: white; font-size: 13px; font-weight: 600; margin-left: 8px; letter-spacing: 0.5px; }
    .close-main-btn { background: rgba(239, 68, 68, 0.1); color: #f87171; border: none; width: 32px; height: 32px; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
    
    .isolated-mode-body { flex: 1; display: flex; overflow: hidden; }
    .controls-sidebar { width: 340px; background: #020617; border-right: 1px solid rgba(255,255,255,0.05); overflow-y: auto; }
    .sidebar-scroll-content { padding: 1.5rem; }
    .sidebar-section { margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1.5rem; }
    .sidebar-section.no-border { border-bottom: none; }
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.2rem; color: #94a3b8; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
    .section-icon { margin-right: 0.5rem; }
    .add-btn { background: #3b82f6; color: white; border: none; padding: 2px 8px; border-radius: 4px; font-size: 10px; cursor: pointer; }

    .control-group { margin-bottom: 1rem; }
    .control-group label { display: block; font-size: 9px; color: #64748b; margin-bottom: 0.4rem; text-transform: uppercase; font-weight: 700; }
    .premium-input { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 0.6rem; border-radius: 8px; font-size: 12px; }
    
    .grid-cols-selector { display: flex; gap: 5px; }
    .grid-cols-selector button { flex: 1; background: #1e293b; border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; padding: 0.5rem; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
    .grid-cols-selector button.active { background: #3b82f6; color: white; border-color: #3b82f6; }

    .items-list { display: flex; flex-direction: column; gap: 8px; }
    .feature-item-row { display: flex; align-items: center; gap: 8px; padding: 8px; background: rgba(30, 41, 59, 0.5); border-radius: 8px; border: 1px solid transparent; cursor: pointer; transition: all 0.2s; }
    .feature-item-row:hover { background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.3); }
    .feature-item-row.active { background: rgba(59, 130, 246, 0.2); border-color: #3b82f6; }
    .item-drag-handle { color: #475569; cursor: move; }
    .item-content { flex: 1; overflow: hidden; }
    .item-title { display: block; font-size: 11px; color: white; font-weight: 600; }
    .item-desc { display: block; font-size: 9px; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .delete-btn { background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 16px; opacity: 0; transition: opacity 0.2s; }
    .feature-item-row:hover .delete-btn { opacity: 1; }

    .isolated-canvas { flex: 1; background: #010409; position: relative; overflow: hidden; background-image: radial-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px); background-size: 30px 30px; }
    .canvas-inner { width: 100%; height: 100%; overflow-y: auto; padding: 60px; }
    
    .features-preview-grid { display: grid; width: 100%; max-width: 1200px; margin: 0 auto; }
    .preview-item { transition: all 0.3s; border: 2px solid transparent; border-radius: 16px; }
    .preview-item.selected { border-color: #3b82f6; transform: scale(1.02); box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
    
    .modern-position-dock { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); padding: 0.6rem 1.4rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); display: flex; gap: 1.5rem; color: white; font-size: 11px; }
    .dock-divider { width: 1px; background: rgba(255, 255, 255, 0.1); }
    .dock-item { display: flex; align-items: center; gap: 0.5rem; }
    
    .isolated-mode-footer { height: 72px; padding: 0 2rem; background: #1e293b; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); }
    .footer-hint { font-size: 11px; color: #64748b; font-style: italic; }
    .btn-clean { padding: 0.6rem 2rem; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; font-size: 12px; transition: all 0.2s; }
    .btn-clean.primary { background: #3b82f6; color: white; }
    .btn-clean.secondary { background: transparent; color: #94a3b8; }
  `]
})
export class EditorFeaturesIsolatedModeComponent implements OnInit {
  @Input() config!: IsolatedModeConfig;
  @Output() closed = new EventEmitter<void>();
  @Output() applied = new EventEmitter<IsolatedModeConfig>();

  editableItems: any[] = [];
  gridCols = 3;
  gridGap = 10;
  
  selectedItemIndex = -1;

  ngOnInit() {
    this.editableItems = JSON.parse(JSON.stringify(this.config.content.items || []));
    this.gridCols = this.config.content.gridCols || 3;
    this.gridGap = this.config.content.gridGap || 10;
    
    if (this.editableItems.length > 0) {
      this.selectedItemIndex = 0;
    }
  }

  selectItem(index: number) {
    this.selectedItemIndex = index;
  }

  addItem() {
    this.editableItems.push({
      icon: 'star',
      title: 'Nueva Característica',
      description: 'Descripción breve de la característica.',
      variant: 'default'
    });
    this.selectedItemIndex = this.editableItems.length - 1;
  }

  removeItem(index: number, e: Event) {
    e.stopPropagation();
    this.editableItems.splice(index, 1);
    if (this.selectedItemIndex >= this.editableItems.length) {
      this.selectedItemIndex = this.editableItems.length - 1;
    }
  }

  close() { this.closed.emit(); }
  cancel() { this.closed.emit(); }
  onOverlayClick(e: Event) { this.closed.emit(); }

  apply() {
    this.applied.emit({
      ...this.config,
      content: { 
        ...this.config.content,
        items: this.editableItems,
        gridCols: this.gridCols,
        gridGap: this.gridGap
      }
    });
  }
}
