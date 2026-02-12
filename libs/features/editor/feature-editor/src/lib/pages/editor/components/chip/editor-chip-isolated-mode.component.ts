import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIChipComponent, chipVariants } from '@negocio/ui-components';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';
import { BaseIsolatedModeComponent, ISOLATED_MODE_SHARED_STYLES, ResizeHandleType } from '../base-isolated-mode.component';

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
                <span>↶</span>
              </button>
              <button class="icon-btn" (click)="redo()" [disabled]="!canRedo" title="Rehacer (Ctrl+Y)">
                <span>↷</span>
              </button>
            </div>
            
            <div class="header-divider"></div>
            
            <div class="action-group">
              <button class="icon-btn" (click)="toggleGrid()" 
                      [class.active]="showGrid" 
                      title="Cuadrícula (G)">
                <span>#</span>
              </button>
              <button class="icon-btn" (click)="toggleSnap()" 
                      [class.active]="snapToGrid" 
                      title="Snap (S)">
                <span>⊞</span>
              </button>
              <button class="icon-btn" (click)="resetPosition()" title="Reset (R)">
                <span>↺</span>
              </button>
            </div>

            <div class="header-divider"></div>

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

                <div class="control-row">
                   <div class="control-group half">
                      <label>Tamaño</label>
                      <div class="select-wrapper">
                        <select [(ngModel)]="editableContent['size']" (ngModelChange)="onContentChange()" class="premium-select">
                          <option value="sm">Pequeño</option>
                          <option value="md">Mediano</option>
                          <option value="lg">Grande</option>
                        </select>
                      </div>
                   </div>
                   <div class="control-group half">
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
                  <div class="toggle-wrapper" (click)="editableContent['dark'] = !editableContent['dark']; onContentChange()" [class.active]="editableContent['dark']">
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
                
                <div class="checkbox-group">
                   <label>
                     <input type="checkbox" [(ngModel)]="editableContent['removable']" (ngModelChange)="onContentChange()"> Removible (Botón X)
                   </label>
                </div>
                 <div class="checkbox-group">
                   <label>
                     <input type="checkbox" [(ngModel)]="editableContent['selected']" (ngModelChange)="onContentChange()"> Seleccionado (Active)
                   </label>
                </div>
                <div class="checkbox-group">
                   <label>
                     <input type="checkbox" [(ngModel)]="editableContent['disabled']" (ngModelChange)="onContentChange()"> Deshabilitado
                   </label>
                </div>
              </div>

              <!-- Dimensions Section -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">📏</span>
                  <h4>POSICIÓN & TAMAÑO</h4>
                </div>
                <div class="control-row">
                  <div class="control-group half">
                    <label>Posición X</label>
                    <input type="number" [(ngModel)]="currentPosition.x" (ngModelChange)="onPositionChange()" class="premium-input text-center">
                  </div>
                  <div class="control-group half">
                    <label>Posición Y</label>
                    <input type="number" [(ngModel)]="currentPosition.y" (ngModelChange)="onPositionChange()" class="premium-input text-center">
                  </div>
                </div>
                <div class="control-row">
                  <div class="control-group half">
                    <label>Ancho (W)</label>
                    <input type="number" [(ngModel)]="currentSize.width" (ngModelChange)="onSizeChange()" class="premium-input text-center">
                  </div>
                  <div class="control-group half">
                    <label>Alto (H)</label>
                    <input type="number" [(ngModel)]="currentSize.height" (ngModelChange)="onSizeChange()" class="premium-input text-center">
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Canvas Area -->
          <div class="isolated-canvas" #canvas (mousedown)="onCanvasMouseDown($event)">
            <div class="canvas-viewport"
                 [style.width.px]="(config.canvasSize?.width || 1200) * viewportScale"
                 [style.height.px]="(config.canvasSize?.height || 800) * viewportScale">
              <div class="canvas-inner" #canvasInner
                   [style.width.px]="config.canvasSize?.width || 1200"
                   [style.height.px]="config.canvasSize?.height || 800"
                   [style.transform]="'scale(' + viewportScale + ')'"
                   [class.show-grid]="showGrid"
                   [class.grid-snapping]="snapToGrid">
                
                <div class="draggable-wrapper"
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

                  <!-- Dimension labels during resize -->
                  <div class="dimension-label width-label" *ngIf="isResizing">{{ currentSize.width }}px</div>
                  <div class="dimension-label height-label" *ngIf="isResizing">{{ currentSize.height }}px</div>
                </div>
              </div>
            </div>

            <!-- Position Dock -->
            <div class="modern-position-dock">
              <div class="dock-item">
                <span class="label">X</span>
                <span class="value">{{ currentPosition.x }}px</span>
              </div>
              <div class="dock-item">
                <span class="label">Y</span>
                <span class="value">{{ currentPosition.y }}px</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">W</span>
                <span class="value">{{ currentSize.width }}px</span>
              </div>
              <div class="dock-item">
                <span class="label">H</span>
                <span class="value">{{ currentSize.height }}px</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">VARIANT</span>
                <span class="value chip-variant">{{ editableContent['variant'] }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== FOOTER ===== -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">
            <b>G</b> rejilla · <b>S</b> snap · <b>R</b> reset · <b>Flechas</b> ajuste fino · <b>Ctrl+Z/Y</b> deshacer/rehacer
          </div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [ISOLATED_MODE_SHARED_STYLES, `
    /* Component-specific overrides */
    .checkbox-group { margin-bottom: 0.8rem; }
    .checkbox-group label { 
      display: flex; 
      align-items: center; 
      gap: 8px; 
      color: #cbd5e1; 
      font-size: 12px; 
      cursor: pointer;
      text-transform: none;
      font-weight: 500;
    }
    .checkbox-group input[type="checkbox"] {
      accent-color: var(--iso-primary);
    }
    .chip-variant {
      color: #a78bfa !important;
      text-transform: capitalize;
    }
    .text-center { text-align: center; }
  `]
})
export class EditorChipIsolatedModeComponent extends BaseIsolatedModeComponent {
  variants = chipVariants;

  // ===== BaseIsolatedModeComponent overrides =====

  getDefaultSize() {
    return { width: 160, height: 48 };
  }

  initializeContent(): void {
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
  }

  initializeStyles(): void {
    this.editableStyles = { ...(this.config?.styles || {}) };
  }

  buildApplyPayload(): IsolatedModeConfig {
    return {
      ...this.config,
      content: { ...this.editableContent },
      styles: { ...this.editableStyles },
      position: { ...this.currentPosition },
      size: { ...this.currentSize }
    };
  }
}
