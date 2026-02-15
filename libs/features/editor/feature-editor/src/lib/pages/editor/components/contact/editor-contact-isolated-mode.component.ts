import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIContactSectionComponent } from '@negocio/featured-components';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';

@Component({
  selector: 'lib-editor-contact-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UIContactSectionComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">📞 CONTACT EDITOR</span>
            <span class="separator">/</span>
            <span class="component-name">OMNICHANNEL & CONTACT GOLD</span>
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
                <button [class.active]="activeTab === 'config'" (click)="activeTab = 'config'">ESTILO</button>
                <button [class.active]="activeTab === 'info'" (click)="activeTab = 'info'">MÉTODOS</button>
            </div>

            <div class="sidebar-scroll-content">
              
              <!-- CONFIG TAB -->
              <div class="sidebar-section" *ngIf="activeTab === 'config'">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>APARIENCIA & LAYOUT</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante Estratégica</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="split">Dividido (Info + Form)</option>
                    <option value="centered">Centrado Minimalista</option>
                    <option value="map-bg">Mapa de Fondo Full</option>
                    <option value="dark-luxury">Lujo Oscuro (Premium)</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Título del Formulario</label>
                  <input type="text" [(ngModel)]="editableContent.formTitle" (ngModelChange)="onContentChange()" class="premium-input" placeholder="Escríbenos">
                </div>

                <div class="control-group">
                  <label>Color de Énfasis</label>
                  <div class="color-input-wrapper">
                      <div class="color-preview" [style.background-color]="editableStyles.accentColor">
                          <input type="color" [(ngModel)]="editableStyles.accentColor" (ngModelChange)="onContentChange()">
                      </div>
                      <input type="text" [(ngModel)]="editableStyles.accentColor" (ngModelChange)="onContentChange()" class="premium-input hex-input">
                  </div>
                </div>

                <div class="checkbox-control mt-6" (click)="editableContent.showMap = !editableContent.showMap; onContentChange()">
                  <div class="custom-checkbox" [class.checked]="editableContent.showMap"></div>
                  <span>Incluir Mapa Interactivo</span>
                </div>

                <div class="section-header mt-10">
                  <span class="section-icon">📐</span>
                  <h4>DIMENSIONES CANVAS</h4>
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

              <!-- INFO TAB -->
              <div class="sidebar-section" *ngIf="activeTab === 'info'">
                <div class="section-header">
                  <span class="section-icon">📍</span>
                  <h4>MÉTODOS DE CONTACTO</h4>
                  <button class="add-btn-mini" (click)="addItem()">+</button>
                </div>
                
                <div class="items-list-premium">
                  <div *ngFor="let item of editableItems; let i = index" 
                       class="item-card" 
                       [class.active]="selectedItemIndex === i" 
                       (click)="selectedItemIndex = i">
                    <div class="item-visual">{{ item.icon || '📍' }}</div>
                    <div class="item-info">
                      <span class="item-title">{{ item.label || 'Método' }}</span>
                      <span class="item-meta">{{ item.value || 'Sin valor' }}</span>
                    </div>
                    <button class="delete-btn" (click)="removeItem(i, $event)">✕</button>
                  </div>
                </div>

                <!-- ITEM EDITOR -->
                <div class="detail-editor-card mt-6 animate-fade-in" *ngIf="selectedItemIndex !== -1">
                  <div class="section-header">
                    <span class="section-icon">✏️</span>
                    <h4>EDITAR MÉTODO #{{ selectedItemIndex + 1 }}</h4>
                  </div>

                  <div class="control-group">
                    <label>Icono (Emoji)</label>
                    <input type="text" [(ngModel)]="editableItems[selectedItemIndex].icon" (ngModelChange)="onContentChange()" class="premium-input">
                  </div>

                  <div class="control-group">
                    <label>Etiqueta (Ej: WhatsApp)</label>
                    <input type="text" [(ngModel)]="editableItems[selectedItemIndex].label" (ngModelChange)="onContentChange()" class="premium-input">
                  </div>

                  <div class="control-group">
                    <label>Valor / Enlace</label>
                    <input type="text" [(ngModel)]="editableItems[selectedItemIndex].value" (ngModelChange)="onContentChange()" class="premium-input">
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
                     [style.min-height.px]="currentSize.height"
                     [class.is-dragging]="isDragging"
                     [class.is-resizing]="isResizing"
                     (mousedown)="onMouseDown($event)">
                  
                  <lib-ui-contact-section
                    [variant]="editableContent.variant"
                    [contactItems]="editableItems"
                    [customStyles]="editableStyles"
                    class="hero-instance"
                  ></lib-ui-contact-section>

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
              <div class="dock-item"><span class="label">MÉTODOS</span><span class="value text-emerald-400">{{ editableItems.length }} Activos</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">LAYOUT</span><span class="value uppercase">{{ editableContent.variant }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">MAPA</span><span class="value" [class.text-green-400]="editableContent.showMap">{{ editableContent.showMap ? 'SÍ' : 'NO' }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Contact Pro: Asegúrate de que tus botones de contacto lleven a los enlaces correctos.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Contacto</button>
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

    .canvas-inner { width: 6000px; height: 6000px; position: relative; padding: 200px;
      &.show-grid { background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1.5px, transparent 1.5px); background-size: 40px 40px; }
      &.grid-snapping { background-image: radial-gradient(rgba(16, 185, 129, 0.2) 2px, transparent 2px); background-size: 40px 40px; }
    }

    .sidebar-tabs { display: flex; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .sidebar-tabs button { flex: 1; padding: 1rem; background: transparent; border: none; color: #64748b; font-size: 10px; font-weight: 900; letter-spacing: 1px; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.3s; }
    .sidebar-tabs button.active { color: #10b981; border-bottom-color: #10b981; background: rgba(16, 185, 129, 0.05); }

    .draggable-wrapper { position: absolute !important; cursor: move; z-index: 100; outline: 4px solid transparent; outline-offset: 8px; background: rgba(15, 23, 42, 0.2); padding: 50px; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.6); border-radius: 4px;
      &:hover { outline-color: rgba(16, 185, 129, 0.3); }
      &.is-dragging, &.is-resizing { outline-color: #10b981; outline-width: 5px; }
    }

    .hero-instance { width: 100%; height: 100%; display: block; pointer-events: none; }

    .items-list-premium { display: flex; flex-direction: column; gap: 8px; }
    .item-card { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; cursor: pointer;
       &.active { border-color: #10b981; background: rgba(16, 185, 129, 0.08); }
    }
    .item-visual { width: 36px; height: 36px; background: #0f172a; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
    .item-info { flex: 1; .item-title { display: block; color: white; font-size: 12px; font-weight: 700; } .item-meta { font-size: 9px; color: #64748b; } }
    .delete-btn { background: transparent; border: none; color: #ef444455; cursor: pointer; padding: 4px; &:hover { color: #ef4444; } }

    .checkbox-control { display: flex; align-items: center; gap: 10px; cursor: pointer;
      span { font-size: 11px; color: #94a3b8; font-weight: 800; text-transform: uppercase; }
    }
    .custom-checkbox { width: 20px; height: 20px; border: 2px solid rgba(255, 255, 255, 0.15); border-radius: 6px; position: relative; transition: all 0.2s;
      &.checked { background: #10b981; border-color: #10b981; }
      &.checked::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: 900; }
    }

    .detail-editor-card { background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 20px; padding: 1.5rem; }
    .add-btn-mini { background: #10b981; color: white; border: none; padding: 2px 10px; border-radius: 6px; font-weight: 900; cursor: pointer; margin-left: auto; }

    .premium-input, .premium-select { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.7rem 0.9rem; border-radius: 12px; font-size: 13px; }
    .premium-textarea { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.7rem 0.9rem; border-radius: 12px; font-size: 12px; height: 80px; resize: none; }
    .color-input-wrapper { display: flex; gap: 10px; align-items: center; .color-preview { width: 40px; height: 40px; border-radius: 10px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); input { position: absolute; inset: -5px; width: 150%; height: 150%; cursor: pointer; opacity: 0; } } .hex-input { font-family: monospace; } }

    .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class EditorContactIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;
  activeTab: 'config' | 'info' = 'info';
  selectedItemIndex = -1;
  editableItems: any[] = [];

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = { 
        ...this.config.content,
        variant: this.config.content.variant || 'split',
        showMap: this.config.content.showMap !== false,
        formTitle: this.config.content.formTitle || 'Escríbenos'
    };
    this.editableItems = JSON.parse(JSON.stringify(this.config.content.contactItems || []));
    if (this.editableItems.length === 0) {
        this.editableItems = [
            { label: 'Teléfono', value: '+34 600 000 000', icon: '📞' },
            { label: 'Email', value: 'hello@example.com', icon: '📧' }
        ];
    }
    this.editableStyles = { 
        ...this.config.styles,
        accentColor: this.config.styles?.accentColor || '#10b981'
    };
    
    this.currentPosition = { ...(this.config.position || { x: 50, y: 50 }) };
    this.currentSize = { 
        width: parseInt(this.config.styles?.width) || 1100, 
        height: parseInt(this.config.styles?.height) || 700 
    };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.4;

    if (this.editableItems.length > 0) this.selectedItemIndex = 0;

    this.saveState();
  }

  override onContentChange() {
    this.scheduleSaveState();
  }

  addItem() {
    this.editableItems.push({
      label: 'Nuevo Método',
      value: 'Escribe aquí...',
      icon: '📍'
    });
    this.selectedItemIndex = this.editableItems.length - 1;
    this.onContentChange();
  }

  removeItem(index: number, e: MouseEvent) {
    e.stopPropagation();
    this.editableItems.splice(index, 1);
    if (this.selectedItemIndex >= this.editableItems.length) {
      this.selectedItemIndex = Math.max(-1, this.editableItems.length - 1);
    }
    this.onContentChange();
  }

  override apply() {
    this.applied.emit({
      ...this.config,
      content: { 
        ...this.editableContent,
        contactItems: this.editableItems
      },
      styles: {
        ...this.editableStyles,
        width: this.currentSize.width + 'px',
        minHeight: this.currentSize.height + 'px',
        position: 'relative'
      },
      position: { ...this.currentPosition },
      size: { ...this.currentSize }
    });
  }

  onCanvasMouseDown(event: MouseEvent) { }
  onOverlayClick(event: MouseEvent) { this.cancel(); }
}
