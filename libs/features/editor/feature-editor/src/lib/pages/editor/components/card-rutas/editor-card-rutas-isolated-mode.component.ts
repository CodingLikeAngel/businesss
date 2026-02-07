import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UICardRutasComponent } from '@negocio/ui-components';
import { AppState } from '../../../../store/state/app.state';
import { selectCurrentPageGlobalStyles } from '../../../../store/selectors/page.selectors';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

@Component({
  selector: 'lib-editor-card-rutas-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UICardRutasComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🏔️ NATURE EDITOR</span>
            <span class="separator">/</span>
            <span class="component-name">CARD RUTAS & NATURE</span>
          </div>
          
          <div class="header-actions">
            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <div class="isolated-mode-body">
          <div class="controls-sidebar">
            <div class="sidebar-scroll-content">
              
              <!-- ITEMS SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🌲</span>
                  <h4>RUTAS (ITEMS)</h4>
                </div>
                
                <div *ngFor="let item of editableContent.items; let i = index" class="item-editor-box">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-[9px] font-bold text-slate-500 uppercase">Ruta #{{i + 1}}</span>
                        <button *ngIf="editableContent.items.length > 1" (click)="removeItem(i)" class="text-rose-400 hover:text-rose-600">✕</button>
                    </div>
                    <div class="control-group">
                        <label>Nombre de Ruta</label>
                        <input type="text" [(ngModel)]="item.routeName" class="premium-input text-[11px]">
                    </div>
                    <div class="control-group">
                        <label>Imagen (URL)</label>
                        <input type="text" [(ngModel)]="item.imageUrl" class="premium-input text-[11px]">
                    </div>
                    <div class="grid grid-cols-2 gap-2 mt-2">
                        <div class="control-group">
                            <label>Dificultad</label>
                            <input type="text" [(ngModel)]="item.difficulty" class="premium-input text-[11px]">
                        </div>
                        <div class="control-group">
                            <label>Rating</label>
                            <input type="number" [(ngModel)]="item.rating" class="premium-input text-[11px]">
                        </div>
                    </div>
                </div>
                
                <button (click)="addItem()" class="w-full py-2 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 text-[10px] font-bold uppercase hover:border-emerald-500 hover:text-emerald-500 transition-all mt-2">
                    + Añadir Nueva Ruta
                </button>
              </div>

              <!-- APPEARANCE SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">✨</span>
                  <h4>APARIENCIA & ANIMACIÓN</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante Visual</label>
                  <select [(ngModel)]="editableContent.variant" class="premium-input">
                    <option value="default">Estándar</option>
                    <option value="glass">Cristal (Glass)</option>
                    <option value="neon">Neón / Cyber</option>
                    <option value="trailblazer">Trailblazer (Premium)</option>
                    <option value="mario">Retro (Nintendo)</option>
                    <option value="rockstar">Gritty (RockStar)</option>
                    <option value="rayman">Whimsical (Rayman)</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Animación Card</label>
                  <select [(ngModel)]="editableContent.animation" class="premium-input">
                    <option value="none">Sin Animación</option>
                    <option value="pulse">Pulso (Pulse)</option>
                    <option value="fade">Aparecer (Fade)</option>
                    <option value="slide">Deslizar (Slide)</option>
                    <option value="bounce">Rebote (Bounce)</option>
                    <option value="glitch">Glitch / Error</option>
                  </select>
                </div>
              </div>

              <!-- COLORS SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>TEMATIZACIÓN</h4>
                </div>
                
                <div class="control-group">
                  <label>Color de Acento (Detalles)</label>
                  <div class="color-control-wrapper">
                    <div class="color-input-wrapper">
                      <div class="color-preview" [style.background-color]="editableContent.accentColor">
                        <input type="color" [(ngModel)]="editableContent.accentColor">
                      </div>
                      <input type="text" [(ngModel)]="editableContent.accentColor" class="premium-input hex-input">
                    </div>
                  </div>
                </div>

                <div class="control-group">
                  <label>Color de fondo</label>
                  <div class="color-control-wrapper">
                    <div class="color-input-wrapper">
                      <div class="color-preview" [style.background-color]="editableContent.backgroundColor">
                        <input type="color" [(ngModel)]="editableContent.backgroundColor">
                      </div>
                      <input type="text" [(ngModel)]="editableContent.backgroundColor" class="premium-input hex-input">
                    </div>
                  </div>
                </div>
                
                <div class="control-group">
                  <label>Color de texto</label>
                  <div class="color-control-wrapper">
                    <div class="color-input-wrapper">
                      <div class="color-preview" [style.background-color]="editableContent.textColor">
                        <input type="color" [(ngModel)]="editableContent.textColor">
                      </div>
                      <input type="text" [(ngModel)]="editableContent.textColor" class="premium-input hex-input">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="isolated-canvas">
            <div class="canvas-inner">
              <div class="draggable-wrapper"
                   [style.width.px]="currentSize.width"
                   [style.height.px]="currentSize.height">
                
                <lib-ui-components-card-rutas
                  [items]="editableContent.items"
                  [variant]="editableContent.variant"
                  [backgroundColor]="editableContent.backgroundColor"
                  [textColor]="editableContent.textColor"
                  [accentColor]="editableContent.accentColor"
                  [animation]="editableContent.animation"
                  [customStyles]="editableStyles"
                  style="display: block; width: 100%; height: 100%;">
                </lib-ui-components-card-rutas>

                <div class="resize-handle se" (mousedown)="startResize($event)"></div>
              </div>
            </div>
            
            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">RUTAS</span><span class="value">{{ editableContent.items.length }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">VAR</span><span class="value capitalize text-emerald-400">{{ editableContent.variant }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Las Cards de Rutas están optimizadas para Nature Apps, con soporte para gestos HammerJS en móvil.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Sincronizar Diseño</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .isolated-mode-overlay {
      position: fixed;
      inset: 0;
      background: rgba(2, 6, 23, 0.95);
      backdrop-filter: blur(12px);
      z-index: 9999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .isolated-mode-container {
      background: #060a0f;
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 24px;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 0 50px rgba(0, 0, 0, 0.8), 0 0 20px rgba(16, 185, 129, 0.1);
    }
    .isolated-mode-header {
      height: 64px;
      padding: 0 1.5rem;
      background: #0f172a;
      border-bottom: 1px solid rgba(16, 185, 129, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .mode-badge { font-size: 10px; font-weight: 800; color: #10b981; background: rgba(16, 185, 129, 0.1); padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2); }
    .component-name { color: white; font-size: 13px; font-weight: 600; margin-left: 8px; font-family: 'Inter', sans-serif; letter-spacing: 0.5px; }
    .close-main-btn { background: rgba(239, 68, 68, 0.1); color: #f87171; border: none; width: 32px; height: 32px; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
    .close-main-btn:hover { background: #ef4444; color: white; transform: rotate(90deg); }

    .isolated-mode-body { flex: 1; display: flex; overflow: hidden; }
    .controls-sidebar { width: 320px; background: #020617; border-right: 1px solid rgba(255,255,255,0.1); overflow-y: auto; }
    .sidebar-scroll-content { padding: 1.5rem; }
    .sidebar-section { margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1.5rem; }
    .sidebar-section.no-border { border-bottom: none; }
    .section-header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.2rem; color: #94a3b8; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
    
    .item-editor-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 14px; padding: 0.8rem; margin-bottom: 1rem; }
    
    .control-group { margin-bottom: 0.8rem; }
    .control-group label { display: block; font-size: 9px; color: #64748b; margin-bottom: 0.3rem; text-transform: uppercase; font-weight: 700; }
    
    .premium-input {
      width: 100%;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255,255,255,0.1);
      color: white;
      padding: 0.5rem 0.6rem;
      border-radius: 8px;
    }

    .color-control-wrapper { display: flex; flex-direction: column; gap: 0.5rem; }
    .color-input-wrapper { display: flex; gap: 0.8rem; }
    .color-preview { width: 32px; height: 32px; border-radius: 8px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.2); }
    .color-preview input { position: absolute; inset: -5px; width: 150%; height: 150%; cursor: pointer; }

    .isolated-canvas { flex: 1; background: #010409; position: relative; overflow: hidden; background-image: radial-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px); background-size: 25px 25px; }
    .canvas-inner { width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center; padding: 40px; }
    
    .draggable-wrapper { position: relative; border: 1px dashed rgba(16, 185, 129, 0.4); padding: 5px; }
    .resize-handle { position: absolute; width: 12px; height: 12px; background: #10b981; border: 2px solid white; border-radius: 4px; bottom: -6px; right: -6px; cursor: se-resize; }

    .modern-position-dock { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(10px); padding: 0.6rem 1.4rem; border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.2); display: flex; gap: 1.5rem; color: white; font-size: 11px; }
    .dock-divider { width: 1px; background: rgba(255, 255, 255, 0.1); }
    .dock-item { display: flex; align-items: center; gap: 0.5rem; }
    .dock-item .label { color: #64748b; font-weight: 800; }

    .isolated-mode-footer { height: 72px; padding: 0 2rem; background: #0f172a; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(16, 185, 129, 0.1); }
    .footer-hint { font-size: 11px; color: #64748b; font-style: italic; }
    .btn-clean { padding: 0.6rem 1.8rem; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; font-size: 12px; transition: all 0.2s; }
    .btn-clean.primary { background: #10b981; color: white; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); }
    .btn-clean.secondary { background: transparent; color: #94a3b8; }
    .btn-clean:hover { transform: translateY(-1px); filter: brightness(1.1); }
  `]
})
export class EditorCardRutasIsolatedModeComponent implements OnInit, OnDestroy {
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

  public addItem() {
    const newItem = {
        routeName: 'Nueva Ruta',
        imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80',
        difficulty: 'Baja',
        rating: 4.5,
        reviews: 10,
        duration: 2,
        distance: 5,
        ascent: 100,
        description: 'Descripción de la nueva ruta.',
        features: ['Pruebas'],
        link: '#'
    };
    this.editableContent.items = [...this.editableContent.items, newItem];
  }

  public removeItem(index: number) {
    this.editableContent.items = this.editableContent.items.filter((_: any, i: number) => i !== index);
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
      this.currentSize.width = Math.max(300, this.startW + (e.clientX - this.dragStartX));
      this.currentSize.height = Math.max(200, this.startH + (e.clientY - this.dragStartY));
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
