import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIChipComponent, chipVariants } from '@negocio/ui-components';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';

@Component({
  selector: 'lib-editor-chip-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UIChipComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🎯 MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">SMART CHIP</span>
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
              <button class="icon-btn" (click)="toggleGrid()" 
                      [class.active]="showGrid" 
                      title="Cuadrícula (G)">
                <span class="icon">#</span>
              </button>
              <button class="icon-btn" (click)="toggleSnap()" 
                      [class.active]="snapToGrid" 
                      title="Snap (S)">
                <span class="icon">⊞</span>
              </button>
              <button class="icon-btn" (click)="resetPosition()" title="Reset (R)">
                <span class="icon">↺</span>
              </button>
            </div>

            <div class="divider"></div>

            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">
              ✕
            </button>
          </div>
        </div>

        <!-- ===== BODY ===== -->
        <div class="isolated-mode-body">
          
          <!-- Sidebar Controls -->
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
                  <input type="text" [(ngModel)]="editableContent['label']" (ngModelChange)="onContentChange()" class="premium-input" placeholder="Etiqueta...">
                </div>
                <div class="control-group">
                   <label>Icono (Nombre)</label>
                   <input type="text" [(ngModel)]="editableContent['iconName']" (ngModelChange)="onContentChange()" class="premium-input" placeholder="e.g. check, star...">
                </div>
                <div class="control-group">
                   <label>Avatar URL (Opcional)</label>
                   <input type="text" [(ngModel)]="editableContent['avatarSrc']" (ngModelChange)="onContentChange()" class="premium-input" placeholder="https://...">
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
                  <div class="select-wrapper">
                    <select [(ngModel)]="editableContent['variant']" (ngModelChange)="onContentChange()" class="premium-select">
                       <option *ngFor="let v of variants" [value]="v">{{ formatVariantName(v) }}</option>
                    </select>
                  </div>
                </div>

                <div class="control-group">
                  <label>Estilo Visual</label>
                  <div class="select-wrapper">
                    <select [(ngModel)]="editableContent['variantSystem']" (ngModelChange)="onContentChange()" class="premium-select">
                      <option value="filled">Relleno (Filled)</option>
                      <option value="outlined">Bordeado (Outlined)</option>
                      <option value="ghost">Fantasma (Ghost)</option>
                    </select>
                  </div>
                </div>

                <div class="control-row grid grid-cols-2 gap-2">
                   <div class="control-group">
                      <label>Tamaño</label>
                      <div class="select-wrapper">
                        <select [(ngModel)]="editableContent['size']" (ngModelChange)="onContentChange()" class="premium-select">
                          <option value="sm">Pequeño</option>
                          <option value="md">Mediano</option>
                          <option value="lg">Grande</option>
                        </select>
                      </div>
                   </div>
                   <div class="control-group">
                      <label>Redondeo</label>
                      <div class="select-wrapper">
                        <select [(ngModel)]="editableContent['rounded']" (ngModelChange)="onContentChange()" class="premium-select">
                          <option value="none">Cuadrado</option>
                          <option value="md">Suave</option>
                          <option value="full">Total</option>
                        </select>
                      </div>
                   </div>
                </div>

                <div class="control-group">
                  <label>Modo de Iluminación</label>
                  <div class="toggle-wrapper" (click)="toggleDarkMode()" [class.active]="editableContent['dark']">
                    <div class="toggle-track"><div class="toggle-thumb"></div></div>
                    <span>{{ editableContent['dark'] ? 'OSCURO' : 'CLARO' }}</span>
                  </div>
                </div>
              </div>

              <!-- Features Section -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">⚙️</span>
                  <h4>COMPORTAMIENTO</h4>
                </div>
                
                <div class="checkbox-control mb-2" (click)="editableContent['removable'] = !editableContent['removable']; onContentChange()">
                   <div class="custom-checkbox" [class.checked]="editableContent['removable']"></div>
                   <span>Removible (Botón X)</span>
                </div>
                <div class="checkbox-control mb-2" (click)="editableContent['selected'] = !editableContent['selected']; onContentChange()">
                   <div class="custom-checkbox" [class.checked]="editableContent['selected']"></div>
                   <span>Seleccionado (Active)</span>
                </div>
                <div class="checkbox-control" (click)="editableContent['disabled'] = !editableContent['disabled']; onContentChange()">
                   <div class="custom-checkbox" [class.checked]="editableContent['disabled']"></div>
                   <span>Deshabilitado</span>
                </div>
              </div>

              <!-- Dimensions Section -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">📏</span>
                  <h4>POSICIÓN & TAMAÑO</h4>
                </div>
                <div class="control-row grid grid-cols-2 gap-2">
                  <div class="control-group">
                    <label>Posición X</label>
                    <input type="number" [(ngModel)]="currentPosition.x" (ngModelChange)="onPositionChange()" class="premium-input text-center">
                  </div>
                  <div class="control-group">
                    <label>Posición Y</label>
                    <input type="number" [(ngModel)]="currentPosition.y" (ngModelChange)="onPositionChange()" class="premium-input text-center">
                  </div>
                </div>
                <div class="control-row grid grid-cols-2 gap-2">
                  <div class="control-group">
                    <label>Ancho (W)</label>
                    <input type="number" [(ngModel)]="currentSize.width" (ngModelChange)="onSizeChange()" class="premium-input text-center">
                  </div>
                  <div class="control-group">
                    <label>Alto (H)</label>
                    <input type="number" [(ngModel)]="currentSize.height" (ngModelChange)="onSizeChange()" class="premium-input text-center">
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
                
                <lib-ui-components-chip
                  [variant]="editableContent['variant']"
                  [variantSystem]="editableContent['variantSystem']"
                  [rounded]="editableContent['rounded']"
                  [size]="editableContent['size']"
                  [dark]="editableContent['dark']"
                  [removable]="editableContent['removable']"
                  [selected]="editableContent['selected']"
                  [disabled]="editableContent['disabled']"
                  [iconName]="editableContent['iconName']"
                  [avatarSrc]="editableContent['avatarSrc']"
                  style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                  {{ editableContent['label'] }}
                </lib-ui-components-chip>

                <!-- 8-point Resize Handles -->
                <div class="resize-handle nw" [class.active]="resizeHandle === 'nw'" (mousedown)="startResize($event, 'nw')"></div>
                <div class="resize-handle n"  [class.active]="resizeHandle === 'n'"  (mousedown)="startResize($event, 'n')"></div>
                <div class="resize-handle ne" [class.active]="resizeHandle === 'ne'" (mousedown)="startResize($event, 'ne')"></div>
                <div class="resize-handle e"  [class.active]="resizeHandle === 'e'"  (mousedown)="startResize($event, 'e')"></div>
                <div class="resize-handle se" [class.active]="resizeHandle === 'se'" (mousedown)="startResize($event, 'se')"></div>
                <div class="resize-handle s"  [class.active]="resizeHandle === 's'"  (mousedown)="startResize($event, 's')"></div>
                <div class="resize-handle sw" [class.active]="resizeHandle === 'sw'" (mousedown)="startResize($event, 'sw')"></div>
                <div class="resize-handle w"  [class.active]="resizeHandle === 'w'"  (mousedown)="startResize($event, 'w')"></div>
              </div>
            </div>

            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">X</span><span class="value">{{ currentPosition.x }}</span></div>
              <div class="dock-item"><span class="label">Y</span><span class="value">{{ currentPosition.y }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">SIZE</span><span class="value">{{ currentSize.width }}x{{ currentSize.height }}</span></div>
            </div>
          </div>
        </div>

        <!-- ===== FOOTER ===== -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">
             Ajuste preciso de chips para layouts densos.
          </div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar</button>
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

    .canvas-inner {
      width: 4000px;
      height: 4000px;
      position: relative;
      background-size: 20px 20px;
      &.show-grid { background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px); }
      &.grid-snapping { background-image: radial-gradient(rgba(99, 102, 241, 0.25) 1.5px, transparent 1.5px); }
    }

    .draggable-wrapper {
      position: absolute !important;
      cursor: move;
      z-index: 100;
      outline: 2px solid transparent;
      outline-offset: 4px;
      transition: all 0.2s ease;
      background: rgba(255, 255, 255, 0.01);
      &:hover { outline-color: rgba(99, 102, 241, 0.4); }
      &.is-dragging, &.is-resizing { outline-color: #6366f1; outline-width: 3px; }
    }

    .checkbox-control {
      display: flex; align-items: center; gap: 10px; cursor: pointer;
      span { font-size: 12px; color: #94a3b8; font-weight: 600; }
    }
    .custom-checkbox {
      width: 18px; height: 18px; border: 2px solid rgba(255, 255, 255, 0.15); border-radius: 4px; position: relative; transition: all 0.2s;
      &.checked { background: #6366f1; border-color: #6366f1; }
      &.checked::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: 900; }
    }

    .premium-input, .premium-select {
      width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08);
      color: white; padding: 0.6rem 0.8rem; border-radius: 10px; font-size: 12px;
    }

    /* Style for Toggle in Chip */
    .toggle-wrapper {
      display: flex; align-items: center; justify-content: space-between; background: rgba(15, 23, 42, 0.6); 
      border: 1px solid rgba(255, 255, 255, 0.08); padding: 0.6rem 0.8rem; border-radius: 10px; cursor: pointer;
      &.active { border-color: #6366f1; }
      span { font-size: 10px; font-weight: 800; color: #94a3b8; }
    }
    .toggle-track { width: 32px; height: 16px; background: #1e293b; border-radius: 20px; position: relative; }
    .toggle-thumb { width: 12px; height: 12px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: transform 0.3s; }
    .active .toggle-thumb { transform: translateX(16px); }
  `]
})
export class EditorChipIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;
  variants = chipVariants;

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    const c = this.config?.content || {};
    this.editableContent = {
      label: c.label || c.text || 'Chip',
      variant: c.variant || 'default',
      variantSystem: c.variantSystem || 'filled',
      rounded: c.rounded || 'full',
      size: c.size || 'md',
      dark: c.dark || false,
      removable: c.removable || false,
      selected: c.selected || false,
      disabled: c.disabled || false,
      iconName: c.iconName || '',
      avatarSrc: c.avatarSrc || ''
    };

    this.editableStyles = { ...(this.config?.styles || {}) };
    
    // Position & Size initialization
    this.currentPosition = { ...(this.config?.position || { x: 2000 - 80, y: 2000 - 24 }) };
    this.currentSize = { ...(this.config?.size || { width: 160, height: 48 }) };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.7;

    this.saveState();
  }

  toggleDarkMode() {
    this.editableContent['dark'] = !this.editableContent['dark'];
    this.onContentChange();
  }

  onCanvasMouseDown(event: MouseEvent) { /* Silenciamos clics fuera */ }
  onOverlayClick(event: MouseEvent) { this.cancel(); }
}
