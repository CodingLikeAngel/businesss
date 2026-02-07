import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UITabsComponent, Tab } from '@negocio/ui-components';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

@Component({
  selector: 'lib-editor-tabs-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UITabsComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">📑 TABS EDITOR</span>
            <span class="separator">/</span>
            <span class="component-name">SISTEMA DE PESTAÑAS PRO</span>
          </div>
          
          <div class="header-actions">
            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <div class="isolated-mode-body">
          <div class="controls-sidebar">
            <div class="sidebar-scroll-content">
              
              <div class="sidebar-tabs">
                <button [class.active]="activeTab === 'items'" (click)="activeTab = 'items'">ELEMENTOS</button>
                <button [class.active]="activeTab === 'design'" (click)="activeTab = 'design'">DISEÑO</button>
              </div>

              <!-- ITEMS SECTION -->
              <div class="sidebar-section" *ngIf="activeTab === 'items'">
                <div class="section-header">
                  <span class="section-icon">🗂️</span>
                  <h4>LISTA DE PESTAÑAS</h4>
                </div>
                
                <div class="item-list">
                  <div *ngFor="let item of editableItems; let i = index" 
                       class="tab-item-card" 
                       [class.active]="selectedIndex === i"
                       (click)="selectedIndex = i">
                    <div class="item-main">
                      <span class="item-index">{{ i + 1 }}</span>
                      <input type="text" [(ngModel)]="item.label" class="premium-input-mini" placeholder="Título...">
                      <button (click)="removeItem(i, $event)" class="delete-btn">✕</button>
                    </div>
                    <div *ngIf="selectedIndex === i" class="item-details animate-fade-in">
                       <label>ID de Sección (Anclaje)</label>
                       <input type="text" [(ngModel)]="item.sectionId" class="premium-input-mini mt-1" placeholder="Ej: home, service-1...">
                    </div>
                  </div>
                </div>

                <button (click)="addItem()" class="add-btn-mini mt-4">+ Añadir Pestaña</button>
              </div>

              <!-- DESIGN SECTION -->
              <div class="sidebar-section" *ngIf="activeTab === 'design'">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>APARIENCIA</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante Visual</label>
                  <select [(ngModel)]="editableContent.variant" class="premium-input">
                    <option value="default">Clásica</option>
                    <option value="pills">Botones (Pills)</option>
                    <option value="underline">Subrayado (Underline)</option>
                    <option value="minimal">Minimalista</option>
                    <option value="vertical">Vertical (Izquierda)</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Alineación</label>
                  <select [(ngModel)]="editableContent.align" class="premium-input">
                    <option value="left">Izquierda</option>
                    <option value="center">Centro</option>
                    <option value="right">Derecha</option>
                    <option value="justify">Justificado (Full)</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Orientación</label>
                  <select [(ngModel)]="editableContent.orientation" class="premium-input">
                    <option value="horizontal">Horizontal</option>
                    <option value="vertical">Vertical</option>
                  </select>
                </div>

                <div class="control-group mt-6">
                   <label>Color de Acento</label>
                   <div class="color-input-wrapper">
                      <div class="color-preview" [style.background-color]="editableStyles.accentColor">
                         <input type="color" [(ngModel)]="editableStyles.accentColor">
                      </div>
                      <input type="text" [(ngModel)]="editableStyles.accentColor" class="premium-input hex-input">
                   </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Canvas area -->
          <div class="isolated-canvas">
            <div class="canvas-inner">
               <div class="draggable-wrapper"
                   [style.left.px]="currentPosition.x"
                   [style.top.px]="currentPosition.y"
                   (mousedown)="onMouseDown($event)">
                
                  <lib-ui-components-tabs
                    [variant]="editableContent.variant"
                    [orientation]="editableContent.orientation"
                    [tabs]="editableItems"
                    [customStyles]="getMergedStyles()"
                  ></lib-ui-components-tabs>

               </div>
            </div>

            <div class="modern-position-dock">
               <div class="dock-item"><span class="label">PES</span><span class="value text-indigo-400">{{ editableItems.length }}</span></div>
               <div class="dock-divider"></div>
               <div class="dock-item"><span class="label">LAYOUT</span><span class="value text-blue-400 uppercase">{{ editableContent.orientation }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Tabs Pro: Organiza contenidos complejos de forma intuitiva.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Confirmar Tabs</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .isolated-mode-overlay { position: fixed; inset: 0; background: rgba(2, 6, 23, 0.95); backdrop-filter: blur(12px); z-index: 9999999; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
    .isolated-mode-container { background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); }
    .isolated-mode-header { height: 64px; padding: 0 1.5rem; background: #1e293b; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between; }
    .mode-badge { font-size: 10px; font-weight: 800; color: #10b981; background: rgba(16, 185, 129, 0.1); padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2); }
    .component-name { color: white; font-size: 13px; font-weight: 600; margin-left: 8px; letter-spacing: 0.5px; }
    .close-main-btn { background: rgba(239, 68, 68, 0.1); color: #f87171; border: none; width: 32px; height: 32px; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
    .close-main-btn:hover { background: #ef4444; color: white; transform: rotate(90deg); }

    .isolated-mode-body {
      flex: 1;
      display: flex;
      flex-direction: row; /* Explicit row */
      overflow: hidden;
    }

    .controls-sidebar {
      width: 380px;
      min-width: 380px; /* Safety */
      flex-shrink: 0; /* Prevent shrinking */
      background: #020617;
      border-right: 1px solid rgba(255,255,255,0.1);
      overflow-y: auto;
    }

    .sidebar-tabs { display: flex; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 1.5rem; }
    .sidebar-tabs button { flex: 1; padding: 1rem; background: transparent; border: none; color: #64748b; font-size: 10px; font-weight: 900; letter-spacing: 1px; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.3s; }
    .sidebar-tabs button.active { color: #10b981; border-bottom-color: #10b981; background: rgba(16, 185, 129, 0.05); }

    .sidebar-scroll-content { padding: 1.5rem; }
    .sidebar-section { margin-bottom: 2rem; }
    .section-header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.2rem; color: #94a3b8; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
    
    .item-list { display: flex; flex-direction: column; gap: 10px; }
    .tab-item-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 10px; cursor: pointer; transition: all 0.2s; }
    .tab-item-card:hover { border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); }
    .tab-item-card.active { border-color: #10b981; background: rgba(16, 185, 129, 0.05); }
    
    .item-main { display: flex; align-items: center; gap: 8px; }
    .item-index { font-size: 9px; font-weight: 900; color: #64748b; background: rgba(255,255,255,0.1); width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; border-radius: 4px; }
    .item-details { margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05); }
    .item-details label { display: block; font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: 800; margin-bottom: 4px; }

    .control-group { margin-bottom: 1.2rem; }
    .control-group label { display: block; font-size: 10px; color: #64748b; margin-bottom: 0.5rem; text-transform: uppercase; font-weight: 700; }
    
    .premium-input { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 0.6rem 0.8rem; border-radius: 10px; font-size: 12px; }
    .premium-input-mini { width: 100%; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 0.4rem 0.6rem; border-radius: 6px; font-size: 11px; }

    .delete-btn { background: rgba(239, 68, 68, 0.1); color: #f87171; border: none; width: 24px; height: 24px; border-radius: 6px; cursor: pointer; }
    .add-btn-mini { width: 100%; background: transparent; border: 1px dashed rgba(16, 185, 129, 0.4); color: #10b981; padding: 10px; border-radius: 12px; font-size: 11px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
    .add-btn-mini:hover { background: rgba(16, 185, 129, 0.1); }

    .color-input-wrapper { display: flex; gap: 10px; align-items: center; }
    .color-preview { width: 34px; height: 34px; border-radius: 8px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
    .color-preview input { position: absolute; inset: -5px; width: 150%; height: 150%; cursor: pointer; }

    .isolated-canvas { flex: 1; background: #0f172a; position: relative; overflow: hidden; background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 20px 20px; }
    .canvas-inner { width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center; padding: 40px; }
    .draggable-wrapper { position: relative; cursor: move; border: 1.5px dashed #10b981; padding: 10px; background: rgba(255,255,255,0.02); min-width: 400px; }

    .modern-position-dock { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); padding: 0.6rem 1.2rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); display: flex; gap: 1.5rem; color: white; font-size: 11px; }
    .dock-divider { width: 1px; background: rgba(255,255,255,0.1); }
    .dock-item { display: flex; align-items: center; gap: 0.5rem; }

    .isolated-mode-footer { height: 72px; padding: 0 2rem; background: #1e293b; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); }
    .footer-hint { font-size: 12px; color: #94a3b8; font-style: italic; }
    .btn-clean { padding: 0.6rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; font-size: 13px; transition: all 0.2s; }
    .btn-clean.primary { background: #10b981; color: #fff; }
    .btn-clean.secondary { background: transparent; color: #94a3b8; }

    .animate-fade-in { animation: fadeIn 0.2s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class EditorTabsIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() config!: IsolatedModeConfig;
  @Output() closed = new EventEmitter<void>();
  @Output() applied = new EventEmitter<IsolatedModeConfig>();

  activeTab: 'items' | 'design' = 'items';
  selectedIndex = 0;
  
  editableContent: any = {};
  editableItems: Tab[] = [];
  editableStyles: any = {};
  
  currentPosition = { x: 0, y: 0 };
  
  isDragging = false;
  dragStartX = 0;
  dragStartY = 0;
  startPosX = 0;
  startPosY = 0;

  ngOnInit() {
    this.editableContent = { ...this.config.content };
    this.editableItems = [...(this.config.content['items'] || [])];
    this.editableStyles = { ...this.config.styles };
    this.currentPosition = { ...this.config.position };
    
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  ngOnDestroy() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  addItem() {
    const newItem: Tab = {
      label: `Nueva Pestaña ${this.editableItems.length + 1}`,
      sectionId: `tab_${Date.now()}`
    };
    this.editableItems.push(newItem);
    this.selectedIndex = this.editableItems.length - 1;
  }

  removeItem(index: number, event: MouseEvent) {
    event.stopPropagation();
    this.editableItems.splice(index, 1);
    if (this.selectedIndex >= this.editableItems.length) {
      this.selectedIndex = Math.max(0, this.editableItems.length - 1);
    }
  }

  onMouseDown(e: MouseEvent) {
    this.isDragging = true;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.startPosX = this.currentPosition.x;
    this.startPosY = this.currentPosition.y;
  }

  onMouseMove = (e: MouseEvent) => {
    if (this.isDragging) {
      this.currentPosition.x = this.startPosX + (e.clientX - this.dragStartX);
      this.currentPosition.y = this.startPosY + (e.clientY - this.dragStartY);
    }
  }

  onMouseUp = () => {
    this.isDragging = false;
  }

  getMergedStyles() {
    return { ...this.editableStyles };
  }

  close() { this.closed.emit(); }
  cancel() { this.closed.emit(); }
  onOverlayClick(e: Event) { this.closed.emit(); }

  apply() {
    this.applied.emit({
      ...this.config,
      content: { 
        ...this.editableContent, 
        items: this.editableItems
      },
      styles: { ...this.editableStyles },
      position: { ...this.currentPosition }
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') this.close();
  }
}
