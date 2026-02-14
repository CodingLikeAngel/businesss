import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { UIImageComponent, variants } from '@negocio/ui-components';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/state/app.state';
import { selectCurrentPageGlobalStyles } from '../../../../store/selectors/page.selectors';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

@Component({
  selector: 'lib-editor-image-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UIImageComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🎯 MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">SMART IMAGE v2 - FILTROS & MÁSCARAS</span>
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

              <!-- Base Style Section (New) -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">✨</span>
                  <h4>ESTILO BASE</h4>
                </div>
                <div class="control-group">
                  <label>Variante Visual</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onContentChange()" class="premium-input">
                    <option value="default">Estándar</option>
                    <option value="polaroid">Polaroid (Exclusivo)</option>
                    <option value="glass">Glassmorphism</option>
                    <option value="neon">Neon Glow</option>
                    
                    <option disabled>──────────────</option>
                    
                    <ng-container *ngFor="let v of availableVariants">
                      <option *ngIf="!['default', 'polaroid', 'glass', 'neon'].includes(v)" [value]="v">
                        {{ formatVariantName(v) }}
                      </option>
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
                
                <div class="control-group">
                  <label>Brillo: {{ filters.brightness }}%</label>
                  <input type="range" min="0" max="200" [(ngModel)]="filters.brightness" (ngModelChange)="onFilterChange()" class="w-full">
                </div>

                <div class="control-group">
                  <label>Contraste: {{ filters.contrast }}%</label>
                  <input type="range" min="0" max="200" [(ngModel)]="filters.contrast" (ngModelChange)="onFilterChange()" class="w-full">
                </div>

                <div class="control-group">
                  <label>Grayscale: {{ filters.grayscale }}%</label>
                  <input type="range" min="0" max="100" [(ngModel)]="filters.grayscale" (ngModelChange)="onFilterChange()" class="w-full">
                </div>

                <div class="control-group">
                  <label>Sepia: {{ filters.sepia }}%</label>
                  <input type="range" min="0" max="100" [(ngModel)]="filters.sepia" (ngModelChange)="onFilterChange()" class="w-full">
                </div>

                <div class="control-group">
                  <label>Desenfoque (Blur): {{ filters.blur }}px</label>
                  <input type="range" min="0" max="20" [(ngModel)]="filters.blur" (ngModelChange)="onFilterChange()" class="w-full">
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
                  <div class="color-control-wrapper">
                    <div class="color-input-wrapper">
                      <div class="color-preview" [style.background-color]="editableStyles.borderColor">
                        <input type="color" [(ngModel)]="editableStyles.borderColor" (ngModelChange)="onStyleChange()">
                      </div>
                      <input type="text" [(ngModel)]="editableStyles.borderColor" (ngModelChange)="onStyleChange()" class="premium-input hex-input">
                    </div>
                    <div class="theme-palette" *ngIf="globalColors$ | async as colors">
                       <div *ngFor="let c of colors" 
                            class="palette-swatch" 
                            [style.background-color]="c"
                            [title]="c"
                            (click)="editableStyles.borderColor = c; onStyleChange()"></div>
                    </div>
                  </div>
                </div>

                <div class="control-row grid grid-cols-2 gap-2 mt-4">
                  <div class="control-group">
                    <label>Ancho (px)</label>
                    <input type="number" [(ngModel)]="borderWidth" (ngModelChange)="onStyleChange()" class="premium-input">
                  </div>
                  <div class="control-group">
                     <label>Radio (px)</label>
                     <input type="number" [(ngModel)]="borderRadius" (ngModelChange)="onStyleChange()" class="premium-input">
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Canvas area -->
          <div class="isolated-canvas">
            <div class="canvas-inner">
               <div class="draggable-wrapper"
                   [style.left.px]="currentPosition.x"
                   [style.top.px]="currentPosition.y"
                   [style.width.px]="currentSize.width"
                   [style.height.px]="currentSize.height"
                   (mousedown)="onMouseDown($event)">
                
                  <div class="image-mask-container" [style.clip-path]="currentMaskValue">
                    <lib-ui-image 
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
                    </lib-ui-image>
                  </div>

                  <div class="resize-handle se" (mousedown)="startResize($event, 'se')"></div>
               </div>
            </div>

            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">FILTER</span><span class="value text-amber-400">ACTIVE</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">MASK</span><span class="value capitalize text-indigo-400">{{ selectedMask }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Smart Image v2: Experimenta con máscaras geométricas para diseños vanguardistas.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Filtros</button>
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
      background: #0f172a;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 24px;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .isolated-mode-header {
      height: 64px;
      padding: 0 1.5rem;
      background: #1e293b;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .mode-badge { font-size: 10px; font-weight: 800; color: #10b981; background: rgba(16, 185, 129, 0.1); padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2); }
    .component-name { color: white; font-size: 13px; font-weight: 600; margin-left: 8px; font-family: 'Inter', sans-serif; letter-spacing: 0.5px; }
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
    
    .premium-input {
      width: 100%;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255,255,255,0.1);
      color: white;
      padding: 0.6rem 0.8rem;
      border-radius: 10px;
      font-size: 12px;
    }

    .mask-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .mask-item { background: rgba(255,255,255,0.05); border-radius: 12px; padding: 10px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 5px; border: 1px solid transparent; transition: all 0.2s; }
    .mask-item:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }
    .mask-item.active { background: rgba(99, 102, 241, 0.1); border-color: #6366f1; }
    .mask-preview { width: 30px; height: 30px; background: #6366f1; }
    .mask-item span { font-size: 9px; color: #94a3b8; font-weight: 700; }

    .color-control-wrapper { display: flex; flex-direction: column; gap: 0.5rem; }
    .color-input-wrapper { display: flex; gap: 0.8rem; }
    .color-preview { width: 38px; height: 38px; border-radius: 10px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.2); }
    .color-preview input { position: absolute; inset: -5px; width: 150%; height: 150%; cursor: pointer; }

    .theme-palette { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px; }
    .palette-swatch { width: 20px; height: 20px; border-radius: 4px; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); transition: transform 0.2s; }
    .palette-swatch:hover { transform: scale(1.2); z-index: 10; border-color: white; }

    .isolated-canvas { flex: 1; background: #020617; position: relative; overflow: hidden; background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 20px 20px; }
    .canvas-inner { width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center; }
    
    .draggable-wrapper { position: relative; cursor: move; border: 1px dashed rgba(16, 185, 129, 0.5); padding: 5px; }
    .image-mask-container { width: 100%; height: 100%; overflow: hidden; }
    .isolated-image { width: 100%; height: 100%; object-fit: cover; }
    .resize-handle { position: absolute; width: 10px; height: 10px; background: #10b981; border: 1.5px solid white; border-radius: 3px; bottom: -5px; right: -5px; cursor: se-resize; }

    .modern-position-dock { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); padding: 0.6rem 1.2rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); display: flex; gap: 1.5rem; color: white; font-size: 11px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); }
    .dock-divider { width: 1px; background: rgba(255,255,255,0.1); }
    .dock-item { display: flex; align-items: center; gap: 0.5rem; }
    .dock-item .label { color: #64748b; font-weight: 800; }

    .isolated-mode-footer { height: 72px; padding: 0 2rem; background: #1e293b; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); }
    .footer-hint { font-size: 12px; color: #94a3b8; font-style: italic; }
    .btn-clean { padding: 0.6rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; font-size: 13px; transition: all 0.2s; }
    .btn-clean.primary { background: #10b981; color: #fff; }
    .btn-clean.secondary { background: transparent; color: #94a3b8; }
    .btn-clean:hover { transform: translateY(-1px); opacity: 0.9; }
  `]
})
export class EditorImageIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() config!: IsolatedModeConfig;
  @Output() closed = new EventEmitter<void>();
  @Output() applied = new EventEmitter<IsolatedModeConfig>();

  private store = inject(Store<AppState>);
  globalColors$: Observable<string[]> = this.store.select(selectCurrentPageGlobalStyles).pipe(
    map(styles => {
      if (!styles) return [];
      return [
        styles.primaryColor,
        styles.secondaryColor,
        styles.accentColor,
        styles.backgroundColor,
        styles.textColor
      ].filter(Boolean);
    })
  );

  availableVariants = variants;

  editableContent: any = {};
  editableStyles: any = {};
  filters = { brightness: 100, contrast: 100, grayscale: 0, sepia: 0, blur: 0 };
  
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

  formatVariantName(variant: string): string {
    if (!variant) return '';
    return variant.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  borderWidth = 0;
  borderRadius = 0;

  currentPosition = { x: 0, y: 0 };
  currentSize = { width: 0, height: 0 };

  isDragging = false;
  isResizing = false;
  dragStartX = 0;
  dragStartY = 0;
  startPosX = 0;
  startPosY = 0;
  startW = 0;
  startH = 0;

  ngOnInit() {
    this.editableContent = {
      src: this.config.content.src || '',
      alt: this.config.content.alt || ''
    };
    this.editableStyles = { ...this.config.styles };
    
    // Load current filters and masks from styles if they exist
    if (this.editableStyles.filter) {
        // Simple parser for demonstration (could be more robust)
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

    this.currentPosition = { ...this.config.position };
    this.currentSize = { ...this.config.size };

    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  ngOnDestroy() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  private parseFilter(filterStr: string, name: string, defaultValue: number): number {
    const match = filterStr.match(new RegExp(`${name}\\(([^)]+)\\)`));
    if (!match) return defaultValue;
    return parseInt(match[1]);
  }

  get currentFilterString() {
    return `brightness(${this.filters.brightness}%) contrast(${this.filters.contrast}%) grayscale(${this.filters.grayscale}%) sepia(${this.filters.sepia}%) blur(${this.filters.blur}px)`;
  }

  applyMask(id: string, value: string) {
    this.selectedMask = id;
    this.currentMaskValue = value;
    this.onStyleChange();
  }

  onMouseDown(e: MouseEvent) {
    this.isDragging = true;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.startPosX = this.currentPosition.x;
    this.startPosY = this.currentPosition.y;
  }

  startResize(e: MouseEvent, handle: string) {
    e.stopPropagation();
    this.isResizing = true;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.startW = this.currentSize.width;
    this.startH = this.currentSize.height;
  }

  onMouseMove = (e: MouseEvent) => {
    if (this.isDragging) {
      this.currentPosition.x = this.startPosX + (e.clientX - this.dragStartX);
      this.currentPosition.y = this.startPosY + (e.clientY - this.dragStartY);
    } else if (this.isResizing) {
      this.currentSize.width = Math.max(50, this.startW + (e.clientX - this.dragStartX));
      this.currentSize.height = Math.max(50, this.startH + (e.clientY - this.dragStartY));
    }
  }

  onMouseUp = () => {
    this.isDragging = false;
    this.isResizing = false;
  }

  onContentChange() {}
  onStyleChange() {}
  onFilterChange() {}

  close() { this.closed.emit(); }
  cancel() { this.closed.emit(); }
  onOverlayClick(e: Event) { this.closed.emit(); }

  apply() {
    this.applied.emit({
      ...this.config,
      // FIX: Explicitly set top-level variant
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
    });
  }
}
