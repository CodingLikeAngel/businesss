import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIDraggableBox1Component, UIDraggableBox2Component, UIDraggableBox3Component, variants } from '@negocio/ui-components';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';

@Component({
  selector: 'lib-editor-draggable-box-isolated-mode',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    UIDraggableBox1Component,
    UIDraggableBox2Component,
    UIDraggableBox3Component
  ],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🎯 MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">DISEÑO & POSICIÓN</span>
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

        <div class="isolated-mode-body">
          <!-- Sidebar: pestañas unificadas Contenido | Estilo | Avanzado -->
          <div class="controls-sidebar">
            <div class="sidebar-tabs">
              <button [class.active]="activeTab === 'content'" (click)="activeTab = 'content'">Contenido</button>
              <button [class.active]="activeTab === 'design'" (click)="activeTab = 'design'">Estilo</button>
              <button [class.active]="activeTab === 'advanced'" (click)="activeTab = 'advanced'">Avanzado</button>
            </div>
            <div class="sidebar-scroll-content">
              <ng-container *ngIf="activeTab === 'content'">
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📝</span>
                  <h4>CONTENIDO</h4>
                </div>
                <div class="control-group">
                  <label>Texto de la caja</label>
                  <input type="text" [(ngModel)]="editableContent.content" (ngModelChange)="onContentChange()" class="premium-input" placeholder="Drag me...">
                </div>
              </div>
              </ng-container>
              <ng-container *ngIf="activeTab === 'design'">
              <!-- SECCIÓN: ESTILO -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">✨</span>
                  <h4>APARIENCIA</h4>
                </div>
                
                <div class="control-group">
                  <label>Tipo de Componente</label>
                  <div class="select-wrapper">
                    <select [(ngModel)]="editableContent.boxVariant" (ngModelChange)="onContentChange()" class="premium-select">
                      <option value="draggable-box-1">Caja Estándar (Card)</option>
                      <option value="draggable-box-2">Caja Widget (Icon & Info)</option>
                      <option value="draggable-box-3">Caja Glass (Elegant)</option>
                    </select>
                  </div>
                </div>

                <div class="control-group">
                  <label>Esquinas Redondeadas</label>
                  <div class="select-wrapper">
                    <select [(ngModel)]="editableContent.rounded" (ngModelChange)="onContentChange()" class="premium-select">
                      <option value="none">Recto (Ninguno)</option>
                      <option value="md">Suave (Manual/Default)</option>
                      <option value="full">Total (Píldora)</option>
                    </select>
                  </div>
                </div>

                <div class="control-group">
                  <label>Tamaño Base</label>
                  <div class="select-wrapper">
                    <select [(ngModel)]="editableContent.size" (ngModelChange)="onContentChange()" class="premium-select">
                      <option value="sm">Pequeño</option>
                      <option value="md">Normal</option>
                      <option value="lg">Grande</option>
                    </select>
                  </div>
                </div>

                <div class="control-group">
                  <label>Modo de Iluminación Ambient</label>
                  <div class="toggle-wrapper" (click)="toggleDarkMode()" [class.active]="editableContent.dark">
                    <div class="toggle-track">
                      <div class="toggle-thumb"></div>
                    </div>
                    <span>{{ editableContent.dark ? 'OSCURO' : 'CLARO' }}</span>
                  </div>
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <div class="select-wrapper">
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onVariantChange()" class="premium-select">
                    <option value="">Página (Heredar)</option>
                    <option value="default">Caja Estándar (Blanca)</option>
                    <option value="primary">Primaria (Color Accent)</option>
                    <option value="secondary">Secundaria (Verde)</option>
                    <option value="glass">Cristal (Glass)</option>
                    <option value="neon">Neón (Glow)</option>
                    <option value="cyberpunk">Cyberpunk</option>
                    <option value="gradient">Gradiente</option>
                    
                    <ng-container *ngFor="let v of availableVariants">
                      <option *ngIf="!['default', 'primary', 'secondary', 'glass', 'neon', 'cyberpunk', 'gradient'].includes(v)" [value]="v">
                        {{ formatVariantName(v) }}
                      </option>
                    </ng-container>
                  </select>
                  </div>
                </div>
              </div>

              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">📏</span>
                  <h4>DIMENSIONES</h4>
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
              </ng-container>
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
                   [class.ambient-dark]="true"
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
                  
                  <lib-ui-components-draggable-box-1
                    *ngIf="editableContent.boxVariant === 'draggable-box-1' || !editableContent.boxVariant"
                    [variant]="editableContent.variant || config.content['globalVariant'] || 'secondary'"
                    [rounded]="editableContent.rounded || 'md'"
                    [size]="editableContent.size || 'md'"
                    [dark]="editableContent.dark || false"
                    [content]="editableContent.content || editableContent.title || editableContent.text || 'Drag me'"
                    [customStyles]="getCustomStyles()"
                    style="width: 100%; height: 100%; display: block;">
                  </lib-ui-components-draggable-box-1>

                  <lib-ui-components-draggable-box-2
                    *ngIf="editableContent.boxVariant === 'draggable-box-2'"
                    [variant]="editableContent.variant || config.content['globalVariant'] || 'secondary'"
                    [rounded]="editableContent.rounded || 'md'"
                    [size]="editableContent.size || 'md'"
                    [dark]="editableContent.dark || false"
                    [content]="editableContent.content || editableContent.title || editableContent.text || 'Drag me'"
                    [customStyles]="getCustomStyles()"
                    style="width: 100%; height: 100%; display: block;">
                  </lib-ui-components-draggable-box-2>

                  <lib-ui-components-draggable-box-3
                    *ngIf="editableContent.boxVariant === 'draggable-box-3'"
                    [variant]="editableContent.variant || config.content['globalVariant'] || 'secondary'"
                    [rounded]="editableContent.rounded || 'md'"
                    [size]="editableContent.size || 'md'"
                    [dark]="editableContent.dark || false"
                    [content]="editableContent.content || editableContent.title || editableContent.text || 'Drag me'"
                    [customStyles]="getCustomStyles()"
                    style="width: 100%; height: 100%; display: block;">
                  </lib-ui-components-draggable-box-3>

                  <!-- Resize Handles -->
                  <div class="resize-handle nw" [class.active]="resizeHandle === 'nw'" (mousedown)="startResize($event, 'nw')"></div>
                  <div class="resize-handle n" [class.active]="resizeHandle === 'n'" (mousedown)="startResize($event, 'n')"></div>
                  <div class="resize-handle ne" [class.active]="resizeHandle === 'ne'" (mousedown)="startResize($event, 'ne')"></div>
                  <div class="resize-handle e" [class.active]="resizeHandle === 'e'" (mousedown)="startResize($event, 'e')"></div>
                  <div class="resize-handle se" [class.active]="resizeHandle === 'se'" (mousedown)="startResize($event, 'se')"></div>
                  <div class="resize-handle s" [class.active]="resizeHandle === 's'" (mousedown)="startResize($event, 's')"></div>
                  <div class="resize-handle sw" [class.active]="resizeHandle === 'sw'" (mousedown)="startResize($event, 'sw')"></div>
                  <div class="resize-handle w" [class.active]="resizeHandle === 'w'" (mousedown)="startResize($event, 'w')"></div>
                </div>
              </div>
            </div>

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
                <span class="label">WIDTH</span>
                <span class="value">{{ currentSize.width }}px</span>
              </div>
              <div class="dock-item">
                <span class="label">HEIGHT</span>
                <span class="value">{{ currentSize.height }}px</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">
             Usar <b>G</b> (rejilla), <b>S</b> (snap), <b>R</b> (reset) o flechas para ajuste fino.
          </div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar</button>
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

    .canvas-viewport {
      position: relative;
      box-shadow: 0 50px 100px rgba(0,0,0,0.5);
      border-radius: 8px;
      background: #000;
      flex-shrink: 0;
    }

    .canvas-inner {
      position: absolute;
      top: 0;
      left: 0;
      transform-origin: top left;
      background-color: #020617;
      background-size: 40px 40px;
      border-radius: 4px;
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
      
      &.show-grid {
        background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1.5px, transparent 1.5px);
      }
      &.grid-snapping {
        background-image: radial-gradient(rgba(99, 102, 241, 0.2) 1.5px, transparent 1.5px);
        box-shadow: inset 0 0 100px rgba(99, 102, 241, 0.05);
      }
    }

    .draggable-wrapper {
      position: absolute !important;
      cursor: move;
      z-index: 1000 !important;
      outline: 2px solid rgba(99, 102, 241, 0.5) !important;
      outline-offset: 1px;
      transition: outline-color 0.2s ease;
      background: rgba(255, 255, 255, 0.02);
      min-width: 40px;
      min-height: 40px;

      &:hover { outline-color: #6366f1 !important; outline-width: 3px !important; }
    }

    /* Form Styles from earlier cleanup */
    .sidebar-scroll-content { padding: 1.5rem; }
    .sidebar-section { margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    .sidebar-section.no-border { border-bottom: none; }
    .section-header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.25rem; }
    .section-header h4 { margin: 0; font-size: 12px; font-weight: 800; letter-spacing: 0.1em; color: #94a3b8; }
    .control-group { margin-bottom: 1.25rem; }
    .control-group label { display: block; font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 0.6rem; text-transform: uppercase; }
    
    .premium-input, .premium-select {
      width: 100%; min-height: 40px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08);
      color: #f8fafc; padding: 0.6rem 1rem; border-radius: 12px; font-size: 13px;
    }
    
    .toggle-wrapper {
      display: flex; align-items: center; gap: 0.75rem; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.6rem 1rem; border-radius: 12px; cursor: pointer;
      &.active { border-color: #6366f1; background: rgba(99, 102, 241, 0.1); }
      span { font-size: 10px; font-weight: 800; color: #94a3b8; }
    }
    .toggle-track { width: 36px; height: 20px; background: #1e293b; border-radius: 20px; position: relative; }
    .toggle-thumb { position: absolute; left: 2px; top: 2px; width: 14px; height: 14px; background: #94a3b8; border-radius: 50%; transition: all 0.3s; }
    .active .toggle-thumb { left: calc(100% - 16px); background: #fff; }
    .active .toggle-track { background: #6366f1; }
  `]
})
export class EditorDraggableBoxIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;
  activeTab: 'content' | 'design' | 'advanced' = 'content';
  availableVariants = variants;
  borderRadiusUnit = 'px';
  paddingUnit = 'px';

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    const defaultSizes: Record<string, { width: number; height: number }> = {
      'draggable-box-1': { width: 300, height: 120 },
      'draggable-box-2': { width: 350, height: 140 },
      'draggable-box-3': { width: 320, height: 160 }
    };

    const v = this.config.content['boxVariant'] || this.config.content['componentVariant'];
    const variant = ['draggable-box-1', 'draggable-box-2', 'draggable-box-3'].includes(v as string) ? (v as string) : 'draggable-box-1';
    const defSize = defaultSizes[variant] || { width: 300, height: 150 };

    this.currentPosition = { 
      x: this.config.position?.x ?? (2000 - (defSize.width / 2)), 
      y: this.config.position?.y ?? (2000 - (defSize.height / 2)) 
    };
    
    this.currentSize = { 
        width: this.config.size?.width || defSize.width, 
        height: this.config.size?.height || defSize.height 
    };

    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };

    // Set viewport scale (auto-calculo básico)
    const canvasW = this.config.canvasSize?.width || 1200;
    this.viewportScale = canvasW > 1400 ? 0.4 : (canvasW > 1000 ? 0.55 : 0.7);

    // Load editable content
    this.editableContent = {
      ...this.config.content,
      variant: this.config.content['variant'] || '',
      boxVariant: variant,
      rounded: this.config.content['rounded'] || 'md',
      size: this.config.content['size'] || 'md',
      dark: this.config.content['dark'] || false
    };

    // Load editable styles
    const hasVariant = !!this.editableContent.variant && this.editableContent.variant !== 'default';
    this.editableStyles = {
      backgroundColor: this.config.styles['backgroundColor'] !== undefined ? this.config.styles['backgroundColor'] : (hasVariant ? '' : '#10b981'),
      borderColor: this.config.styles['borderColor'] !== undefined ? this.config.styles['borderColor'] : (hasVariant ? '' : '#059669'),
      borderWidth: parseInt(this.config.styles['borderWidth'] as string) || this.extractBorderWidth(this.config.styles['border']),
      borderRadius: parseInt(this.config.styles['borderRadius'] as string) || 12,
      boxShadow: this.config.styles['boxShadow'] || '0 10px 30px rgba(0,0,0,0.3)',
      padding: parseInt(this.config.styles['padding'] as string) || 20
    };

    if (this.config.styles['borderRadius']?.toString().includes('%')) this.borderRadiusUnit = '%';
    if (this.config.styles['padding']?.toString().includes('%')) this.paddingUnit = '%';

    this.saveState();
  }

  getCustomStyles(): any {
    const styles: any = {};
    const hasVariant = !!this.editableContent.variant && this.editableContent.variant !== 'default';
    let bgColor = this.editableStyles.backgroundColor;
    
    if (!hasVariant && !bgColor) bgColor = '#10b981';
    if (bgColor) { styles.backgroundColor = bgColor; styles.background = bgColor; }
    
    if (this.editableStyles.borderColor || this.editableStyles.borderWidth) {
      styles.border = `${this.editableStyles.borderWidth || 2}px solid ${this.editableStyles.borderColor || '#059669'}`;
    }
    
    if (this.editableContent.rounded === 'md') {
      styles.borderRadius = `${this.editableStyles.borderRadius || 12}${this.borderRadiusUnit}`;
    }
    
    styles.padding = `${this.editableStyles.padding || 20}${this.paddingUnit}`;
    styles.boxShadow = this.editableStyles.boxShadow || '0 10px 30px rgba(0,0,0,0.3)';
    
    return styles;
  }

  toggleDarkMode() {
    this.editableContent.dark = !this.editableContent.dark;
    this.onContentChange();
  }

  override onVariantChange() {
    if (this.editableContent.variant && this.editableContent.variant !== '') {
      this.editableStyles.backgroundColor = '';
      this.editableStyles.borderColor = '';
    }
    super.onVariantChange();
  }

  onOverlayClick(event: MouseEvent) { this.cancel(); }
}
