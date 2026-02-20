import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UIImageComponent, variants } from '@negocio/ui-components';
import { AppState } from '../../../../store/state/app.state';
import { selectCurrentPageGlobalStyles } from '../../../../store/selectors/page.selectors';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';

@Component({
  selector: 'lib-editor-image-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UIImageComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🎯 MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">SMART IMAGE PRO</span>
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
            <div class="sidebar-scroll-content">
              
              <!-- Content Section -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🔗</span>
                  <h4>CONTENIDO</h4>
                </div>
                <div class="control-group">
                  <label>URL de Imagen</label>
                  <input type="text" [(ngModel)]="editableContent.src" (ngModelChange)="onContentChange()" class="premium-input" placeholder="https://...">
                </div>
                <div class="control-group">
                  <label>Texto Alt / SEO</label>
                  <input type="text" [(ngModel)]="editableContent.alt" (ngModelChange)="onContentChange()" class="premium-input" placeholder="Descripción de la imagen...">
                </div>
              </div>

              <!-- Base Style Section -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">✨</span>
                  <h4>ESTILO BASE</h4>
                </div>
                <div class="control-group">
                  <label>Variante Visual</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="default">Estándar</option>
                    <option value="polaroid">Polaroid</option>
                    <option value="glass">Glassmorphism</option>
                    <option value="neon">Neon Glow</option>
                    <option disabled>──────────────</option>
                    <ng-container *ngFor="let v of availableVariants">
                      <option *ngIf="!['default', 'polaroid', 'glass', 'neon'].includes(v)" [value]="v">{{ formatVariantName(v) }}</option>
                    </ng-container>
                  </select>
                </div>
              </div>

              <!-- Filters Section -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🪄</span>
                  <h4>FILTROS PRO</h4>
                </div>
                <div class="control-group" *ngFor="let key of filterKeys">
                  <label>{{ formatFilterName(key) }}: {{ filters[key] }}{{ key === 'blur' ? 'px' : '%' }}</label>
                  <input type="range" [min]="key === 'blur' ? 0 : 0" [max]="(key === 'brightness' || key === 'contrast') ? 200 : (key === 'blur' ? 20 : 100)" 
                         [(ngModel)]="filters[key]" (ngModelChange)="onFilterChange()" class="w-full">
                </div>
              </div>

              <!-- Masks Section -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎭</span>
                  <h4>MÁSCARAS & FORMAS</h4>
                </div>
                <div class="mask-grid">
                  <div *ngFor="let m of maskPresets" 
                       class="mask-item" 
                       [class.active]="selectedMask === m.id"
                       (click)="applyMask(m.id, m.value)">
                    <div class="mask-preview" [style.clip-path]="m.value"></div>
                    <span>{{ m.label }}</span>
                  </div>
                </div>
              </div>

              <!-- Borders Section -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>BORDES & SOMBRAS</h4>
                </div>
                
                <div class="control-group">
                  <label>Color de Borde</label>
                  <div class="color-input-wrapper">
                    <div class="color-preview" [style.background-color]="editableStyles.borderColor">
                      <input type="color" [(ngModel)]="editableStyles.borderColor" (ngModelChange)="onStyleChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableStyles.borderColor" (ngModelChange)="onStyleChange()" class="premium-input font-mono">
                  </div>
                  <div class="theme-palette mt-2" *ngIf="globalColors$ | async as colors">
                     <div *ngFor="let c of colors" class="palette-swatch" [style.background-color]="c" (click)="editableStyles.borderColor = c; onStyleChange()"></div>
                  </div>
                </div>

                <div class="control-row grid grid-cols-2 gap-2 mt-4">
                  <div class="control-group">
                    <label>Borde (px)</label>
                    <input type="number" [(ngModel)]="borderWidth" (ngModelChange)="onStyleChange()" class="premium-input">
                  </div>
                  <div class="control-group">
                     <label>Radio (px)</label>
                     <input type="number" [(ngModel)]="borderRadius" (ngModelChange)="onStyleChange()" class="premium-input">
                  </div>
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
                
                <div class="image-mask-container" [style.clip-path]="currentMaskValue">
                  <lib-ui-components-image 
                       [src]="editableContent.src" 
                       [alt]="editableContent.alt"
                       [variant]="editableContent.variant || 'default'"
                       [filter]="currentFilterString"
                       [customStyles]="{
                         'border-color': editableStyles.borderColor,
                         'border-width': borderWidth + 'px',
                         'border-style': borderWidth > 0 ? 'solid' : 'none',
                         'border-radius': borderRadius + 'px'
                       }"
                       style="width: 100%; height: 100%; display: block;">
                  </lib-ui-components-image>
                </div>

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
              <div class="dock-item"><span class="label">X</span><span class="value">{{ currentPosition.x }}</span></div>
              <div class="dock-item"><span class="label">Y</span><span class="value">{{ currentPosition.y }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">MASK</span><span class="value capitalize text-indigo-400">{{ selectedMask }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">SIZE</span><span class="value">{{ currentSize.width }}x{{ currentSize.height }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Usa máscaras y filtros para crear composiciones visuales únicas.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
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
      &.show-grid { background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px); }
      &.grid-snapping { background-image: radial-gradient(rgba(99, 102, 241, 0.25) 1.5px, transparent 1.5px); }
    }

    .draggable-wrapper {
      position: absolute !important;
      cursor: move;
      z-index: 100;
      outline: 2px solid transparent;
      outline-offset: 4px;
      background: rgba(255, 255, 255, 0.01);
      &:hover { outline-color: rgba(99, 102, 241, 0.4); }
      &.is-dragging, &.is-resizing { outline-color: #6366f1; outline-width: 3px; }
    }

    .image-mask-container { width: 100%; height: 100%; overflow: hidden; }

    .mask-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .mask-item { background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 10px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 5px; border: 1px solid rgba(255, 255, 255, 0.05); transition: all 0.2s; }
    .mask-item:hover { background: rgba(255, 255, 255, 0.08); transform: translateY(-2px); }
    .mask-item.active { background: rgba(99, 102, 241, 0.1); border-color: #6366f1; }
    .mask-preview { width: 30px; height: 30px; background: #6366f1; }
    .mask-item span { font-size: 9px; color: #94a3b8; font-weight: 700; }

    .color-input-wrapper { display: flex; gap: 0.8rem; }
    .color-preview { width: 38px; height: 38px; border-radius: 10px; position: relative; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.2); }
    .color-preview input { position: absolute; inset: -5px; width: 150%; height: 150%; cursor: pointer; }
    .palette-swatch { width: 22px; height: 22px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(255, 255, 255, 0.1); transition: transform 0.2s; }
    .palette-swatch:hover { transform: scale(1.2); z-index: 10; border-color: white; }

    .premium-input, .premium-select {
      width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08);
      color: white; padding: 0.6rem 0.8rem; border-radius: 10px; font-size: 12px;
    }
  `]
})
export class EditorImageIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;

  private store = inject(Store<AppState>);
  globalColors$: Observable<string[]> = this.store.select(selectCurrentPageGlobalStyles).pipe(
    map(s => s ? [s.primaryColor, s.secondaryColor, s.accentColor, s.backgroundColor, s.textColor].filter(Boolean) : [])
  );

  availableVariants = variants;
  filters: any = { brightness: 100, contrast: 100, grayscale: 0, sepia: 0, blur: 0 };
  filterKeys: string[] = ['brightness', 'contrast', 'grayscale', 'sepia', 'blur'];
  
  selectedMask = 'none';
  currentMaskValue = 'none';
  maskPresets = [
    { id: 'none', label: 'Cuadrado', value: 'none' },
    { id: 'circle', label: 'Círculo', value: 'circle(50% at 50% 50%)' },
    { id: 'ellipse', label: 'Elipse', value: 'ellipse(25% 40% at 50% 50%)' },
    { id: 'inset', label: 'Inset', value: 'inset(10% 10% 10% 10% round 20px)' },
    { id: 'hexagon', label: 'Hexágono', value: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' },
    { id: 'star', label: 'Estrella', value: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' },
  ];

  borderWidth = 0;
  borderRadius = 0;

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = {
      src: this.config.content.src || '',
      alt: this.config.content.alt || '',
      variant: this.config.content.variant || this.config.variant || 'default'
    };
    this.editableStyles = { ...this.config.styles };
    
    if (this.editableStyles.filter) {
        const f = this.editableStyles.filter;
        this.filters.brightness = this.parseFilter(f, 'brightness', 100);
        this.filters.contrast = this.parseFilter(f, 'contrast', 100);
        this.filters.grayscale = this.parseFilter(f, 'grayscale', 0);
        this.filters.sepia = this.parseFilter(f, 'sepia', 0);
        this.filters.blur = this.parseFilter(f, 'blur', 0);
    }

    this.currentMaskValue = this.editableStyles['clip-path'] || 'none';
    const activeMask = this.maskPresets.find(m => m.value === this.currentMaskValue);
    this.selectedMask = activeMask ? activeMask.id : 'none';

    this.borderWidth = parseInt(this.editableStyles['border-width']) || 0;
    this.borderRadius = parseInt(this.editableStyles['border-radius']) || 0;

    this.currentPosition = { ...(this.config.position || { x: 2000 - 150, y: 2000 - 150 }) };
    this.currentSize = { ...(this.config.size || { width: 300, height: 300 }) };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.6;

    this.saveState();
  }

  private parseFilter(filterStr: string, name: string, defaultValue: number): number {
    const match = filterStr.match(new RegExp(`${name}\\(([^)]+)\\)`));
    if (!match) return defaultValue;
    return parseInt(match[1]);
  }

  get currentFilterString() {
    return `brightness(${this.filters.brightness}%) contrast(${this.filters.contrast}%) grayscale(${this.filters.grayscale}%) sepia(${this.filters.sepia}%) blur(${this.filters.blur}px)`;
  }

  formatFilterName(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  applyMask(id: string, value: string) {
    this.selectedMask = id;
    this.currentMaskValue = value;
    this.onStyleChange();
  }

  onFilterChange() { this.onStyleChange(); }

  override apply() {
    const finalConfig = {
      ...this.config,
      variant: this.editableContent.variant,
      content: { ...this.editableContent },
      styles: {
        ...this.editableStyles,
        filter: this.currentFilterString,
        'clip-path': this.currentMaskValue,
        'border-width': this.borderWidth + 'px',
        'border-radius': this.borderRadius + 'px',
        left: this.currentPosition.x + 'px',
        top: this.currentPosition.y + 'px',
        width: this.currentSize.width + 'px',
        height: this.currentSize.height + 'px',
        position: 'absolute'
      },
      position: { ...this.currentPosition },
      size: { ...this.currentSize }
    };
    this.applied.emit(finalConfig);
  }

  override onCanvasMouseDown(event: MouseEvent) { }
  onOverlayClick(event: MouseEvent) { this.cancel(); }
}
