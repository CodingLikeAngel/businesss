import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/state/app.state';
import { selectCurrentPageGlobalStyles } from '../../../../store/selectors/page.selectors';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UIChipComponent, chipVariants } from '@negocio/ui-components';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

@Component({
  selector: 'lib-editor-chip-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UIChipComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">ATOM EDITOR</span>
            <span class="separator">/</span>
            <span class="component-name">SMART CHIP</span>
          </div>
          
          <div class="header-actions">
            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <div class="isolated-mode-body">
          <div class="controls-sidebar">
            <div class="sidebar-scroll-content">
              
              <!-- Content Section -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📝</span>
                  <h4>CONTENIDO</h4>
                </div>
                <div class="control-group">
                  <label>Texto del Chip</label>
                  <input type="text" [(ngModel)]="editableContent.label" (ngModelChange)="onContentChange()" class="premium-input" placeholder="Etiqueta...">
                </div>
                <div class="control-group">
                   <label>Icono (Nombre)</label>
                   <input type="text" [(ngModel)]="editableContent.iconName" class="premium-input" placeholder="e.g. check, star...">
                </div>
                <div class="control-group">
                   <label>Avatar URL (Opcional)</label>
                   <input type="text" [(ngModel)]="editableContent.avatarSrc" class="premium-input" placeholder="https://...">
                </div>
              </div>

              <!-- Appearance Section -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>APARIENCIA</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante de Color</label>
                  <select [(ngModel)]="editableContent.variant" class="premium-select">
                     <option *ngFor="let v of variants" [value]="v">{{ formatVariantName(v) }}</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Estilo Visual</label>
                  <select [(ngModel)]="editableContent.variantSystem" class="premium-select">
                    <option value="filled">Relleno (Filled)</option>
                    <option value="outlined">Bordeado (Outlined)</option>
                    <option value="ghost">Fantasma (Ghost)</option>
                  </select>
                </div>

                <div class="control-row">
                   <div class="control-group half">
                      <label>Tamaño</label>
                      <select [(ngModel)]="editableContent.size" class="premium-select">
                        <option value="sm">Pequeño</option>
                        <option value="md">Mediano</option>
                        <option value="lg">Grande</option>
                      </select>
                   </div>
                   <div class="control-group half">
                      <label>Redondeo</label>
                      <select [(ngModel)]="editableContent.rounded" class="premium-select">
                        <option value="none">Cuadrado</option>
                        <option value="md">Suave</option>
                        <option value="full">Total</option>
                      </select>
                   </div>
                </div>

                 <div class="control-group">
                  <label>Modo de Iluminación</label>
                  <div class="toggle-wrapper" (click)="editableContent.dark = !editableContent.dark" [class.active]="editableContent.dark">
                    <div class="toggle-track"><div class="toggle-thumb"></div></div>
                    <span>{{ editableContent.dark ? 'OSCURO' : 'CLARO' }}</span>
                  </div>
                </div>
              </div>

              <!-- Features Section -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">⚙️</span>
                  <h4>COMPORTAMIENTO</h4>
                </div>
                
                <div class="checkbox-group">
                   <label>
                     <input type="checkbox" [(ngModel)]="editableContent.removable"> Removible (Botón X)
                   </label>
                </div>
                 <div class="checkbox-group">
                   <label>
                     <input type="checkbox" [(ngModel)]="editableContent.selected"> Seleccionado (Active)
                   </label>
                </div>
                <div class="checkbox-group">
                   <label>
                     <input type="checkbox" [(ngModel)]="editableContent.disabled"> Deshabilitado
                   </label>
                </div>
              </div>

            </div>
          </div>

          <!-- Canvas area -->
          <div class="isolated-canvas" [class.dark-mode]="editableContent.dark">
            <div class="canvas-inner">
               <div class="draggable-wrapper"
                   [style.left.px]="currentPosition.x"
                   [style.top.px]="currentPosition.y"
                   (mousedown)="onMouseDown($event)">
                
                  <lib-ui-components-chip
                    [variant]="editableContent.variant"
                    [variantSystem]="editableContent.variantSystem"
                    [rounded]="editableContent.rounded"
                    [size]="editableContent.size"
                    [dark]="editableContent.dark"
                    [removable]="editableContent.removable"
                    [selected]="editableContent.selected"
                    [disabled]="editableContent.disabled"
                    [iconName]="editableContent.iconName"
                    [avatarSrc]="editableContent.avatarSrc"
                  >
                    {{ editableContent.label }}
                  </lib-ui-components-chip>

               </div>
            </div>

            <div class="modern-position-dock">
               <div class="dock-item"><span class="label">VARIANT</span><span class="value text-indigo-400">{{ editableContent.variant | uppercase }}</span></div>
               <div class="dock-divider"></div>
               <div class="dock-item"><span class="label">STYLE</span><span class="value text-blue-400">{{ editableContent.variantSystem | uppercase }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Smart Chip: Elemento interactivo versátil para etiquetas y filtros.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .isolated-mode-overlay { position: fixed; inset: 0; background: rgba(2, 6, 23, 0.95); backdrop-filter: blur(12px); z-index: 9999999; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
    .isolated-mode-container { background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); }
    .isolated-mode-header { height: 64px; padding: 0 1.5rem; background: #1e293b; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between; }
    .mode-badge { font-size: 10px; font-weight: 800; color: #ec4899; background: rgba(236, 72, 153, 0.1); padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(236, 72, 153, 0.2); }
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
      width: 320px;
      min-width: 320px; /* Safety */
      flex-shrink: 0; /* Prevent shrinking */
      background: #020617;
      border-right: 1px solid rgba(255,255,255,0.1);
      overflow-y: auto;
    }
    .sidebar-scroll-content { padding: 1.5rem; }
    .sidebar-section { margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1.5rem; }
    .sidebar-section.no-border { border-bottom: none; }
    .section-header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.2rem; color: #94a3b8; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
    
    .control-group { margin-bottom: 1.2rem; }
    .control-group label { display: block; font-size: 10px; color: #64748b; margin-bottom: 0.5rem; text-transform: uppercase; font-weight: 700; }
    .control-row { display: flex; gap: 10px; }
    .control-group.half { flex: 1; }
    
    .premium-input, .premium-select { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 0.6rem 0.8rem; border-radius: 10px; font-size: 12px; }
    
    .toggle-wrapper { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 8px; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; transition: all 0.2s; }
    .toggle-wrapper.active { border-color: #ec4899; background: rgba(236, 72, 153, 0.1); }
    .toggle-track { width: 30px; height: 16px; background: #334155; border-radius: 20px; position: relative; transition: all 0.2s; }
    .toggle-wrapper.active .toggle-track { background: #ec4899; }
    .toggle-thumb { width: 12px; height: 12px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: all 0.2s; }
    .toggle-wrapper.active .toggle-thumb { left: 16px; }
    .toggle-wrapper span { font-size: 10px; font-weight: 700; color: #94a3b8; }
    .toggle-wrapper.active span { color: white; }

    .checkbox-group { margin-bottom: 0.8rem; }
    .checkbox-group label { display: flex; align-items: center; gap: 8px; color: #cbd5e1; font-size: 12px; cursor: pointer; }

    .isolated-canvas { flex: 1; background: #f8fafc; position: relative; overflow: hidden; background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 20px 20px; transition: background 0.3s; }
    .isolated-canvas.dark-mode { background: #0f172a; background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px); }
    
    .canvas-inner { width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center; }
    .draggable-wrapper { position: relative; cursor: move; }
    
    .modern-position-dock { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); padding: 0.6rem 1.2rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); display: flex; gap: 1.5rem; color: white; font-size: 11px; }
    .dock-divider { width: 1px; background: rgba(255,255,255,0.1); }
    .dock-item { display: flex; align-items: center; gap: 0.5rem; }
    
    .isolated-mode-footer { height: 72px; padding: 0 2rem; background: #1e293b; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); }
    .footer-hint { font-size: 12px; color: #94a3b8; font-style: italic; }
    .btn-clean { padding: 0.6rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; font-size: 13px; transition: all 0.2s; }
    .btn-clean.primary { background: #ec4899; color: #fff; }
    .btn-clean.secondary { background: transparent; color: #94a3b8; }
  `]
})
export class EditorChipIsolatedModeComponent implements OnInit {
  @Input() config!: IsolatedModeConfig;
  @Output() closed = new EventEmitter<void>();
  @Output() applied = new EventEmitter<IsolatedModeConfig>();

  variants = chipVariants;
  editableContent: any = {};

  formatVariantName(variant: string): string {
    if (!variant) return '';
    return variant.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  
  currentPosition = { x: 0, y: 0 };
  
  isDragging = false;
  dragStartX = 0;
  dragStartY = 0;
  startPosX = 0;
  startPosY = 0;

  ngOnInit() {
    this.editableContent = { ...this.config.content };
    this.currentPosition = { ...this.config.position };
    
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  ngOnDestroy() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
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

  onContentChange() {}
  close() { this.closed.emit(); }
  cancel() { this.closed.emit(); }
  onOverlayClick(e: Event) { this.closed.emit(); }

  apply() {
    this.applied.emit({
      ...this.config,
      content: { ...this.editableContent },
      position: { ...this.currentPosition }
    });
  }
}
