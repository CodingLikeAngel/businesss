import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UIButtonComponent, variants } from '@negocio/ui-components';
import { AppState } from '../../../../store/state/app.state';
import { selectCurrentPageGlobalStyles } from '../../../../store/selectors/page.selectors';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

// Re-export IsolatedModeConfig for convenience
export { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

@Component({
  selector: 'lib-editor-button-isolated-mode',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    UIButtonComponent
  ],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🎯 MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">BOTÓN UNIVERSAL - GRADIENTES & HOVER</span>
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

            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <div class="isolated-mode-body">
          <!-- Sidebar Controls -->
          <div class="controls-sidebar">
            <div class="sidebar-scroll-content">
              
              <!-- SECCIÓN: CONTENIDO -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📝</span>
                  <h4>CONTENIDO</h4>
                </div>
                
                <div class="control-group">
                  <label>Texto del Botón</label>
                  <input type="text" [(ngModel)]="editableContent.label" (ngModelChange)="onContentChange()" class="premium-input" placeholder="Haz clic aquí...">
                </div>

                <div class="control-row grid grid-cols-2 gap-2 mt-4">
                  <div class="control-group">
                    <label>Icono Inicial</label>
                    <select [(ngModel)]="editableContent.leadingIcon" (ngModelChange)="onContentChange()" class="premium-input">
                      <option [value]="undefined">Ninguno</option>
                      <option value="heroStar">Estrella</option>
                      <option value="heroRocketLaunch">Cohete</option>
                      <option value="heroArrowRight">Flecha</option>
                    </select>
                  </div>
                  <div class="control-group">
                    <label>Icono Final</label>
                    <select [(ngModel)]="editableContent.trailingIcon" (ngModelChange)="onContentChange()" class="premium-input">
                      <option [value]="undefined">Ninguno</option>
                      <option value="heroStar">Estrella</option>
                      <option value="heroRocketLaunch">Cohete</option>
                      <option value="heroArrowRight">Flecha</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- SECCIÓN: APARIENCIA -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">✨</span>
                  <h4>ESTILO BASE</h4>
                </div>
                
                  <div class="control-group">
                  <label>Variante</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onVariantChange()" class="premium-input">
                    <option value="primary">Primario</option>
                    <option value="secondary">Secundario</option>
                    <option value="accent">Acento</option>
                    <option value="glass">Glassmorphism</option>
                    <option value="outline">Contorno</option>
                    <option value="ghost">Fantasma</option>
                    <option value="neon">Neon</option>
                    <option value="cyberpunk">Cyberpunk</option>
                    
                    <option disabled>──────────────</option>
                    
                    <ng-container *ngFor="let v of availableVariants">
                      <option *ngIf="!['primary', 'secondary', 'accent', 'glass', 'outline', 'ghost', 'neon', 'cyberpunk'].includes(v)" [value]="v">
                        {{ formatVariantName(v) }}
                      </option>
                    </ng-container>
                  </select>
                </div>

                <div class="control-row grid grid-cols-2 gap-2">
                  <div class="control-group">
                    <label>Tamaño</label>
                    <select [(ngModel)]="editableContent.size" (ngModelChange)="onContentChange()" class="premium-input">
                      <option value="xs">Extra Pequeño</option>
                      <option value="sm">Pequeño</option>
                      <option value="md">Medio</option>
                      <option value="lg">Grande</option>
                      <option value="xl">Extra Grande</option>
                    </select>
                  </div>
                  <div class="control-group">
                    <label>Redondeo</label>
                    <select [(ngModel)]="editableContent.rounded" (ngModelChange)="onContentChange()" class="premium-input">
                      <option value="none">Ninguno</option>
                      <option value="sm">Suave</option>
                      <option value="md">Medio</option>
                      <option value="lg">Pronunciado</option>
                      <option value="full">Cápsula</option>
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
              </div>

              <!-- SECCIÓN: COLORES PERSONALIZADOS -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🌈</span>
                  <h4>COLORES</h4>
                </div>
                
                <div class="control-group">
                  <label>Fondo</label>
                  <div class="flex gap-2 p-1 bg-slate-900/50 rounded-lg mb-2">
                    <button class="sub-tab-btn" [class.active]="bgType === 'solid'" (click)="bgType = 'solid'; onStyleChange()">SÓLIDO</button>
                    <button class="sub-tab-btn" [class.active]="bgType === 'gradient'" (click)="bgType = 'gradient'; onStyleChange()">GRADIENTE</button>
                  </div>

                  <div *ngIf="bgType === 'solid'" class="color-input-wrapper">
                    <div class="color-preview" [style.background]="editableStyles.backgroundColor">
                      <input type="color" [(ngModel)]="editableStyles.backgroundColor" (ngModelChange)="onStyleChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableStyles.backgroundColor" (ngModelChange)="onStyleChange()" class="premium-input font-mono" placeholder="#hex">
                  </div>

                  <div *ngIf="bgType === 'gradient'" class="flex flex-col gap-2">
                    <div class="color-input-wrapper">
                      <div class="color-preview" [style.background]="gradColor1">
                        <input type="color" [(ngModel)]="gradColor1" (ngModelChange)="onStyleChange()">
                      </div>
                      <input type="text" [(ngModel)]="gradColor1" (ngModelChange)="onStyleChange()" class="premium-input font-mono">
                    </div>
                    <div class="color-input-wrapper">
                      <div class="color-preview" [style.background]="gradColor2">
                        <input type="color" [(ngModel)]="gradColor2" (ngModelChange)="onStyleChange()">
                      </div>
                      <input type="text" [(ngModel)]="gradColor2" (ngModelChange)="onStyleChange()" class="premium-input font-mono">
                    </div>
                  </div>

                  <div class="theme-palette" *ngIf="globalColors$ | async as colors">
                    <div *ngFor="let c of colors" 
                         class="palette-swatch" 
                         [style.background]="c" 
                         (click)="bgType === 'solid' ? editableStyles.backgroundColor = c : gradColor1 = c; onStyleChange()">
                    </div>
                  </div>
                </div>

                <div class="control-group">
                  <label>Texto</label>
                  <div class="color-input-wrapper">
                    <div class="color-preview" [style.background]="editableStyles.color">
                      <input type="color" [(ngModel)]="editableStyles.color" (ngModelChange)="onStyleChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableStyles.color" (ngModelChange)="onStyleChange()" class="premium-input font-mono">
                  </div>
                </div>
              </div>

              <!-- SECCIÓN: TIPOGRAFÍA -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🔤</span>
                  <h4>TIPOGRAFÍA</h4>
                </div>
                <div class="control-row grid grid-cols-2 gap-2">
                  <div class="control-group">
                    <label>Tamaño Fuente</label>
                    <input type="number" [(ngModel)]="editableStyles.fontSize" (ngModelChange)="onStyleChange()" class="premium-input" placeholder="14">
                  </div>
                  <div class="control-group">
                    <label>Peso</label>
                    <select [(ngModel)]="editableStyles.fontWeight" (ngModelChange)="onStyleChange()" class="premium-input">
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="600">Semibold</option>
                      <option value="700">Bold</option>
                      <option value="800">Black</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- SECCIÓN: EFECTOS HOVER -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">⚡</span>
                  <h4>EFECTOS HOVER</h4>
                </div>
                
                <div class="control-group">
                  <label>Color Fondo (Hover)</label>
                  <div class="color-input-wrapper">
                    <div class="color-preview" [style.background-color]="editableStyles['--btn-hover-bg']">
                      <input type="color" [(ngModel)]="editableStyles['--btn-hover-bg']" (ngModelChange)="onStyleChange()">
                    </div>
                  </div>
                </div>

                <div class="control-group">
                  <label>Escala (Hover): {{ hoverScale }}</label>
                  <input type="range" min="0.8" max="1.2" step="0.01" [(ngModel)]="hoverScale" (ngModelChange)="onStyleChange()" class="w-full">
                </div>
              </div>

              <!-- SECCIÓN: DIMENSIONES -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">📐</span>
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
                
                <lib-ui-components-button
                  [variant]="editableContent.variant || 'primary'"
                  [rounded]="editableContent.rounded || 'md'"
                  [size]="editableContent.size || 'md'"
                  [dark]="editableContent.dark || false"
                  [leadingIcon]="editableContent.leadingIcon"
                  [trailingIcon]="editableContent.trailingIcon"
                  [customStyles]="getCustomStyles()"
                  [haptic]="editableContent.haptic"
                  [soundUrl]="editableContent.soundUrl"
                  [style.transform]="'scale(' + hoverScale + ')'"
                  class="preview-btn"
                  style="width: 100%; height: 100%; display: block;">
                  {{ editableContent.label }}
                </lib-ui-components-button>

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
                <span class="label">SIZE</span>
                <span class="value">{{ currentSize.width }}x{{ currentSize.height }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Diseño proactivo: usa gradientes para llamar la atención sobre el CTA.</div>
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

    .canvas-inner {
      width: 4000px;
      height: 4000px;
      position: relative;
      background-size: 20px 20px;
      &.show-grid { background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px); }
      &.grid-snapping { background-image: radial-gradient(rgba(99, 102, 241, 0.3) 1.5px, transparent 1.5px); }
    }
    
    .draggable-wrapper {
      position: absolute !important;
      cursor: move;
      z-index: 100;
      outline: 2px solid transparent;
      outline-offset: 4px;
      transition: outline-color 0.15s ease, box-shadow 0.3s ease;
      background: rgba(255, 255, 255, 0.01);
      &:hover { outline-color: rgba(99, 102, 241, 0.5); }
      &.is-dragging, &.is-resizing { outline-color: #6366f1; outline-width: 3px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
    }

    .sub-tab-btn { flex: 1; padding: 6px; font-size: 10px; font-weight: 800; color: #64748b; border-radius: 6px; background: transparent; border: none; cursor: pointer; }
    .sub-tab-btn.active { background: #6366f1; color: white; }

    .color-input-wrapper { display: flex; gap: 0.8rem; }
    .color-preview { width: 38px; height: 38px; border-radius: 10px; position: relative; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.2); }
    .color-preview input { position: absolute; inset: -5px; width: 150%; height: 150%; cursor: pointer; }

    .theme-palette { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px; }
    .palette-swatch { width: 20px; height: 20px; border-radius: 4px; cursor: pointer; border: 1px solid rgba(255, 255, 255, 0.08); }

    .premium-input {
      width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08);
      color: white; padding: 0.6rem 0.8rem; border-radius: 10px; font-size: 12px;
    }

    /* Style for Toggle in Button */
    .toggle-wrapper {
      display: flex; align-items: center; justify-content: space-between; background: rgba(15, 23, 42, 0.6); 
      border: 1px solid rgba(255, 255, 255, 0.08); padding: 0.6rem 1rem; border-radius: 12px; cursor: pointer;
      &.active { border-color: #6366f1; }
      span { font-size: 11px; font-weight: 700; color: #94a3b8; }
    }
    .toggle-track { width: 34px; height: 18px; background: #1e293b; border-radius: 20px; position: relative; }
    .toggle-thumb { width: 14px; height: 14px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: transform 0.3s; }
    .active .toggle-thumb { transform: translateX(16px); }
    .active .toggle-track { background: #6366f1; }
  `]
})
export class EditorButtonIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;

  private store = inject(Store<AppState>);
  globalColors$: Observable<string[]> = this.store.select(selectCurrentPageGlobalStyles).pipe(
    map(styles => styles ? [styles.primaryColor, styles.secondaryColor, styles.accentColor, styles.backgroundColor, styles.textColor].filter(Boolean) : [])
  );

  bgType: 'solid' | 'gradient' = 'solid';
  gradColor1 = '#6366f1';
  gradColor2 = '#a855f7';
  hoverScale = 1;
  availableVariants = variants;

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    const content = this.config?.content || {};
    const styles = this.config?.styles || {};
    
    this.editableContent = {
      variant: content.variant || this.config?.variant || 'primary',
      rounded: content.rounded || 'md',
      size: content.size || 'md',
      dark: content.dark || false,
      label: content.label || content.text || 'Botón',
      leadingIcon: content.leadingIcon,
      trailingIcon: content.trailingIcon,
      haptic: content.haptic || false,
      soundUrl: content.soundUrl || ''
    };

    this.editableStyles = {
      backgroundColor: styles.backgroundColor || '',
      color: styles.color || '',
      fontSize: styles.fontSize || '',
      fontWeight: styles.fontWeight || '',
      '--btn-hover-bg': styles['--btn-hover-bg'] || '',
      '--btn-hover-shadow': styles['--btn-hover-shadow'] || ''
    };

    if (this.editableStyles.backgroundColor?.startsWith('linear-gradient')) {
      this.bgType = 'gradient';
      const colors = this.editableStyles.backgroundColor.match(/#[a-fA-F0-9]{3,6}/g);
      if (colors && colors.length >= 2) {
        this.gradColor1 = colors[0];
        this.gradColor2 = colors[1];
      }
    }

    this.hoverScale = parseFloat(styles['--btn-hover-scale']) || 1;
    this.currentPosition = { ...(this.config?.position || { x: 2000 - 90, y: 2000 - 25 }) };
    this.currentSize = { ...(this.config?.size || { width: 180, height: 50 }) };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.7;

    this.saveState();
  }

  getCustomStyles() {
    const s: any = { ...this.editableStyles };
    if (this.bgType === 'gradient') {
      s.backgroundColor = `linear-gradient(45deg, ${this.gradColor1}, ${this.gradColor2})`;
    }
    s['--btn-hover-scale'] = this.hoverScale;
    return s;
  }

  toggleDarkMode() {
    this.editableContent.dark = !this.editableContent.dark;
    this.onContentChange();
  }

  override apply() {
    const styles = {
      ...this.getCustomStyles(),
      left: `${this.currentPosition.x}px`,
      top: `${this.currentPosition.y}px`,
      width: `${this.currentSize.width}px`,
      height: `${this.currentSize.height}px`,
      position: 'absolute'
    };
    
    const finalConfig = {
      ...this.config,
      variant: this.editableContent.variant,
      content: { ...this.editableContent },
      styles: styles,
      position: this.currentPosition,
      size: this.currentSize
    };
    this.applied.emit(finalConfig);
  }

  onOverlayClick(event: MouseEvent) { this.cancel(); }
}
