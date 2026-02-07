import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIListComponent } from '@negocio/ui-components';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

@Component({
  selector: 'lib-editor-list-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UIListComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">📝 LIST EDITOR</span>
            <span class="separator">/</span>
            <span class="component-name">LISTA INTELLIGENT PRO</span>
          </div>
          
          <div class="header-actions">
            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <div class="isolated-mode-body">
          <div class="controls-sidebar">
            <div class="sidebar-scroll-content">
              
              <div class="sidebar-tabs">
                <button [class.active]="activeTab === 'content'" (click)="activeTab = 'content'">CONTENIDO</button>
                <button [class.active]="activeTab === 'style'" (click)="activeTab = 'style'">APARIENCIA</button>
              </div>

              <!-- CONTENT SECTION -->
              <div class="sidebar-section" *ngIf="activeTab === 'content'">
                <div class="section-header">
                  <span class="section-icon">📋</span>
                  <h4>ELEMENTOS DE LA LISTA</h4>
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
              <div class="sidebar-section" *ngIf="activeTab === 'style'">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>DISEÑO Y ESTILO</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante Visual</label>
                  <select [(ngModel)]="editableContent.variant" class="premium-input">
                    <option value="default">Estándar</option>
                    <option value="bordered">Con Bordes</option>
                    <option value="striped">Cebra (Striped)</option>
                    <option value="flush">Sin Bordes (Flush)</option>
                    <option value="cards">Tarjetas</option>
                  </select>
                </div>

                <div class="control-row grid grid-cols-2 gap-2">
                   <div class="control-group">
                      <label>Tamaño</label>
                      <select [(ngModel)]="editableContent.size" class="premium-input">
                        <option value="sm">Pequeño</option>
                        <option value="md">Normal</option>
                        <option value="lg">Grande</option>
                      </select>
                   </div>
                   <div class="control-group">
                      <label>Redondeado</label>
                      <select [(ngModel)]="editableContent.rounded" class="premium-input">
                        <option value="none">Recto</option>
                        <option value="md">Suave</option>
                        <option value="lg">Pronunciado</option>
                        <option value="full">Cápsula</option>
                      </select>
                   </div>
                </div>

                <div class="control-group">
                  <label>Animación al Entrar</label>
                  <select [(ngModel)]="editableContent.animation" class="premium-input">
                    <option value="none">Ninguna</option>
                    <option value="fade">Fade In</option>
                    <option value="slide">Slide Up</option>
                    <option value="scale">Scale Up</option>
                  </select>
                </div>

                <div class="section-header mt-8">
                  <span class="section-icon">📐</span>
                  <h4>DIMENSIONES</h4>
                </div>
                <div class="control-row grid grid-cols-2 gap-2">
                   <div class="control-group">
                      <label>Ancho Máximo (PX)</label>
                      <input type="number" [(ngModel)]="editableStyles.maxWidth" class="premium-input">
                   </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Canvas area -->
          <div class="isolated-canvas">
            <div class="canvas-inner">
               <div class="draggable-wrapper"
                   [style.max-width.px]="editableStyles.maxWidth || 600">
                
                  <lib-ui-list
                    [items]="editableItems"
                    [variant]="editableContent.variant"
                    [size]="editableContent.size"
                    [rounded]="editableContent.rounded"
                    [customStyles]="editableStyles"
                  ></lib-ui-list>

               </div>
            </div>

            <div class="modern-position-dock">
               <div class="dock-item"><span class="label">ITEMS</span><span class="value text-indigo-400">{{ editableItems.length }}</span></div>
               <div class="dock-divider"></div>
               <div class="dock-item"><span class="label">VAR</span><span class="value text-blue-400 uppercase">{{ editableContent.variant }}</span></div>
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
      flex-direction: row; /* Explicit row layout */
      overflow: hidden;
    }

    .controls-sidebar {
      width: 380px;
      min-width: 380px; /* Security/Stability */
      flex-shrink: 0; /* No shrink in flex container */
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
    
    .item-list { display: flex; flex-direction: column; gap: 8px; }
    .list-item-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 8px; }
    .item-main { display: flex; align-items: center; gap: 8px; }
    .item-index { font-size: 9px; font-weight: 900; color: #64748b; background: rgba(255,255,255,0.1); width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; border-radius: 4px; }
    
    .control-group { margin-bottom: 1.2rem; }
    .control-group label { display: block; font-size: 10px; color: #64748b; margin-bottom: 0.5rem; text-transform: uppercase; font-weight: 700; }
    .control-row { display: flex; gap: 10px; }
    
    .premium-input { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 0.6rem 0.8rem; border-radius: 10px; font-size: 12px; }
    .premium-input-mini { width: 100%; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 0.4rem 0.6rem; border-radius: 6px; font-size: 11px; }

    .delete-btn { background: rgba(239, 68, 68, 0.1); color: #f87171; border: none; width: 24px; height: 24px; border-radius: 6px; cursor: pointer; }
    .add-btn-mini { width: 100%; background: transparent; border: 1px dashed rgba(16, 185, 129, 0.4); color: #10b981; padding: 10px; border-radius: 12px; font-size: 11px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
    .add-btn-mini:hover { background: rgba(16, 185, 129, 0.1); }

    .isolated-canvas { flex: 1; background: #0f172a; position: relative; overflow: hidden; background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 20px 20px; }
    .canvas-inner { width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center; padding: 40px; }
    .draggable-wrapper { position: relative; width: 100%; border: 1.5px dashed #10b981; padding: 15px; background: rgba(255,255,255,0.01); border-radius: 8px; }

    .modern-position-dock { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); padding: 0.6rem 1.2rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); display: flex; gap: 1.5rem; color: white; font-size: 11px; }
    .dock-divider { width: 1px; background: rgba(255,255,255,0.1); }
    .dock-item { display: flex; align-items: center; gap: 0.5rem; }

    .isolated-mode-footer { height: 72px; padding: 0 2rem; background: #1e293b; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); }
    .footer-hint { font-size: 12px; color: #94a3b8; font-style: italic; }
    .btn-clean { padding: 0.6rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; font-size: 13px; transition: all 0.2s; }
    .btn-clean.primary { background: #10b981; color: #fff; }
    .btn-clean.secondary { background: transparent; color: #94a3b8; }
  `]
})
export class EditorListIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() config!: IsolatedModeConfig;
  @Output() closed = new EventEmitter<void>();
  @Output() applied = new EventEmitter<IsolatedModeConfig>();

  activeTab: 'content' | 'style' = 'content';
  
  editableContent: any = {};
  editableItems: string[] = [];
  editableStyles: any = {};
  
  ngOnInit() {
    this.editableContent = { 
        ...this.config.content,
        variant: this.config.content.variant || 'default',
        size: this.config.content.size || 'md',
        rounded: this.config.content.rounded || 'md'
    };
    this.editableItems = [...(this.config.content['items'] || [])];
    this.editableStyles = { ...this.config.styles };
  }

  ngOnDestroy() {}

  addItem() {
    this.editableItems.push(`Nuevo elemento de lista`);
  }

  removeItem(index: number) {
    this.editableItems.splice(index, 1);
  }

  onPartialChange() {}
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
      styles: { ...this.editableStyles }
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') this.close();
  }
}
