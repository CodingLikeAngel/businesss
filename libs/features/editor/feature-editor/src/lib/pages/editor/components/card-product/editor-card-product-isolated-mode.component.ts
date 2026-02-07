import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiCardProductsComponent } from '@negocio/ui-components';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

@Component({
  selector: 'lib-editor-card-product-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UiCardProductsComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🛍️ MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">CARD PRODUCT</span>
          </div>
          
          <div class="header-actions">
            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <div class="isolated-mode-body">
          <div class="controls-sidebar">
            <div class="sidebar-scroll-content">
              
              <!-- PRODUCT INFO -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📦</span>
                  <h4>INFORMACIÓN DEL PRODUCTO</h4>
                </div>
                
                <div class="control-group">
                  <label>Nombre del Producto</label>
                  <input type="text" [(ngModel)]="editableContent.name" class="premium-input">
                </div>

                <div class="control-group">
                  <label>Descripción</label>
                  <textarea [(ngModel)]="editableContent.description" class="premium-input h-24"></textarea>
                </div>

                <div class="control-group">
                  <label>URL de Imagen</label>
                  <input type="text" [(ngModel)]="editableContent.image" class="premium-input">
                </div>
              </div>

              <!-- PRICING -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">💰</span>
                  <h4>PRECIO Y DESCUENTOS</h4>
                </div>
                
                <div class="control-row grid grid-cols-2 gap-3">
                  <div class="control-group">
                    <label>Precio</label>
                    <input type="number" [(ngModel)]="editableContent.price" class="premium-input">
                  </div>
                  <div class="control-group">
                    <label>Moneda</label>
                    <select [(ngModel)]="editableContent.currency" class="premium-input">
                      <option value="USD">USD $</option>
                      <option value="EUR">EUR €</option>
                      <option value="GBP">GBP £</option>
                      <option value="MXN">MXN $</option>
                    </select>
                  </div>
                </div>

                <div class="control-group">
                  <label class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="editableContent.onSale" class="w-4 h-4">
                    <span>En Oferta</span>
                  </label>
                </div>

                <div class="control-group" *ngIf="editableContent.onSale">
                  <label>Precio Original</label>
                  <input type="number" [(ngModel)]="editableContent.originalPrice" class="premium-input">
                </div>
              </div>

              <!-- APPEARANCE -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>APARIENCIA</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante Visual</label>
                  <select [(ngModel)]="editableContent.variant" class="premium-input">
                    <option value="">Heredar Global</option>
                    <option value="default">Estándar</option>
                    <option value="primary">Primario</option>
                    <option value="secondary">Secundario</option>
                    <option value="glass">Vidrio (Glass)</option>
                    <option value="neon">Neón</option>
                    <option value="cyberpunk">Cyberpunk</option>
                  </select>
                  <p class="variant-hint" *ngIf="!editableContent.variant">
                    Heredando: {{ config.content['globalVariant'] || 'glass' }}
                  </p>
                </div>

                <div class="control-group">
                  <label>Tamaño</label>
                  <select [(ngModel)]="editableContent.size" class="premium-input">
                    <option value="sm">Pequeño</option>
                    <option value="md">Mediano</option>
                    <option value="lg">Grande</option>
                  </select>
                </div>
              </div>

              <!-- ACTIONS -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">⚡</span>
                  <h4>ACCIONES</h4>
                </div>
                
                <div class="control-group">
                  <label>Texto del Botón</label>
                  <input type="text" [(ngModel)]="editableContent.buttonText" class="premium-input">
                </div>

                <div class="control-group">
                  <label class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="editableContent.showRating" class="w-4 h-4">
                    <span>Mostrar Rating</span>
                  </label>
                </div>

                <div class="control-group" *ngIf="editableContent.showRating">
                  <label>Rating (0-5)</label>
                  <input type="number" min="0" max="5" step="0.1" [(ngModel)]="editableContent.rating" class="premium-input">
                </div>
              </div>
            </div>
          </div>

          <div class="isolated-canvas">
            <div class="canvas-inner">
              <div class="draggable-wrapper"
                   [style.width.px]="currentSize.width"
                   [style.height.px]="currentSize.height">
                
                
                <lib-card-products
                  [product]="{
                    name: editableContent.name || 'Producto',
                    price: (editableContent.currency || 'USD') + ' ' + (editableContent.price || 99),
                    image: editableContent.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80',
                    description: editableContent.description || 'Descripción del producto'
                  }"
                  [variant]="editableContent.variant || config.content['globalVariant'] || 'glass'"
                  [customStyles]="editableStyles">
                </lib-card-products>

                <div class="resize-handle se" (mousedown)="startResize($event)"></div>
              </div>
            </div>
            
            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">PRICE</span><span class="value text-green-400">{{ editableContent.currency || 'USD' }} {{ editableContent.price || 0 }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">SIZE</span><span class="value">{{ currentSize.width }}x{{ currentSize.height }}</span></div>
              <div class="dock-divider" *ngIf="editableContent.onSale"></div>
              <div class="dock-item" *ngIf="editableContent.onSale"><span class="label">SALE</span><span class="value text-red-400">ON</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Configura todos los detalles de tu producto.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .isolated-mode-overlay {
      position: fixed;
      inset: 0;
      background: rgba(2, 6, 23, 0.98);
      backdrop-filter: blur(15px);
      z-index: 9999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .isolated-mode-container {
      background: #0f172a;
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 32px;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.8);
    }
    .isolated-mode-header {
      height: 72px;
      padding: 0 2rem;
      background: #1e293b;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .mode-badge { font-size: 10px; font-weight: 800; color: #6366f1; background: rgba(99, 102, 241, 0.1); padding: 5px 12px; border-radius: 10px; border: 1px solid rgba(99, 102, 241, 0.2); }
    .component-name { color: white; font-size: 14px; font-weight: 700; margin-left: 10px; letter-spacing: 0.5px; }
    .close-main-btn { background: rgba(239, 68, 68, 0.1); color: #f87171; border: none; width: 36px; height: 36px; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
    .close-main-btn:hover { background: #ef4444; color: white; transform: rotate(90deg); }

    .isolated-mode-body { flex: 1; display: flex; overflow: hidden; }
    .controls-sidebar { width: 340px; background: #020617; border-right: 1px solid rgba(255,255,255,0.05); overflow-y: auto; }
    .sidebar-scroll-content { padding: 2rem; }
    .sidebar-section { margin-bottom: 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 2rem; }
    .sidebar-section.no-border { border-bottom: none; }
    .section-header { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1.5rem; color: #64748b; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; }
    
    .control-group { margin-bottom: 1.5rem; }
    .control-group label { display: block; font-size: 10px; color: #475569; margin-bottom: 0.6rem; text-transform: uppercase; font-weight: 800; }
    
    .premium-input {
      width: 100%;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255,255,255,0.1);
      color: white;
      padding: 0.6rem 0.8rem;
      border-radius: 10px;
      font-size: 12px;
    }

    .variant-hint { font-size: 10px; color: #64748b; margin-top: 0.5rem; font-style: italic; }

    .isolated-canvas { flex: 1; background: #020617; position: relative; overflow: hidden; background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 20px 20px; }
    .canvas-inner { width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center; padding: 50px; }
    
    .draggable-wrapper { position: relative; border: 1px dashed rgba(16, 185, 129, 0.5); padding: 5px; }
    .resize-handle { position: absolute; width: 10px; height: 10px; background: #10b981; border: 1.5px solid white; border-radius: 3px; bottom: -5px; right: -5px; cursor: se-resize; }

    .modern-position-dock { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); padding: 0.6rem 1.2rem; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.08); display: flex; gap: 1.5rem; color: white; font-size: 11px; }
    .dock-divider { width: 1px; background: rgba(255, 255, 255, 0.1); }
    .dock-item { display: flex; align-items: center; gap: 0.5rem; }
    .dock-item .label { color: #64748b; font-weight: 800; }

    .isolated-mode-footer { height: 72px; padding: 0 2rem; background: #1e293b; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.08); }
    .footer-hint { font-size: 12px; color: #94a3b8; font-style: italic; }
    .btn-clean { padding: 0.6rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; font-size: 13px; transition: all 0.2s; }
    .btn-clean.primary { background: #6366f1; color: white; }
    .btn-clean.secondary { background: transparent; color: #94a3b8; }
    .btn-clean:hover { transform: translateY(-1px); opacity: 0.9; }
  `]
})
export class EditorCardProductIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() public config!: IsolatedModeConfig;
  @Output() public closed = new EventEmitter<void>();
  @Output() public applied = new EventEmitter<IsolatedModeConfig>();

  public editableContent: any = {};
  public editableStyles: any = {};
  public currentSize = { width: 0, height: 0 };
  
  private isResizing = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private startW = 0;
  private startH = 0;

  ngOnInit() {
    this.editableContent = { ...this.config.content };
    this.editableStyles = { ...this.config.styles };
    this.currentSize = { ...this.config.size };

    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  ngOnDestroy() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  public startResize(e: MouseEvent) {
    e.stopPropagation();
    this.isResizing = true;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.startW = this.currentSize.width;
    this.startH = this.currentSize.height;
  }

  private onMouseMove = (e: MouseEvent) => {
    if (this.isResizing) {
      this.currentSize.width = Math.max(250, this.startW + (e.clientX - this.dragStartX));
      this.currentSize.height = Math.max(300, this.startH + (e.clientY - this.dragStartY));
    }
  }

  private onMouseUp = () => {
    this.isResizing = false;
  }

  public close() { this.closed.emit(); }
  public cancel() { this.closed.emit(); }
  public onOverlayClick(e: Event) { this.closed.emit(); }

  public apply() {
    this.applied.emit({
      ...this.config,
      content: { ...this.editableContent },
      styles: {
        ...this.editableStyles,
        width: this.currentSize.width + 'px',
        height: this.currentSize.height + 'px'
      },
      size: { ...this.currentSize }
    });
  }
}
