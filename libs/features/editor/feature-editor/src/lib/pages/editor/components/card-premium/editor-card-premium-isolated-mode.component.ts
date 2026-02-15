import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UICardPremiumComponent, heroIconPaths } from '@negocio/ui-components';
import { AppState } from '../../../../store/state/app.state';
import { selectCurrentPageGlobalStyles } from '../../../../store/selectors/page.selectors';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';

@Component({
  selector: 'lib-editor-card-premium-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UICardPremiumComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🎯 MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">CARTA PREMIUM GOLD</span>
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
              
              <!-- CONTENT SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📝</span>
                  <h4>CONTENIDO</h4>
                </div>
                
                <div class="control-group">
                  <label>Título</label>
                  <input type="text" [(ngModel)]="editableContent.title" (ngModelChange)="onContentChange()" class="premium-input">
                </div>

                <div class="control-group">
                  <label>Descripción</label>
                  <textarea [(ngModel)]="editableContent.description" (ngModelChange)="onContentChange()" class="premium-textarea h-24"></textarea>
                </div>

                <div class="control-row grid grid-cols-2 gap-2">
                  <div class="control-group">
                    <label>Precio / Valor</label>
                    <input type="text" [(ngModel)]="editableContent.price" (ngModelChange)="onContentChange()" class="premium-input">
                  </div>
                  <div class="control-group">
                    <label>Badge / Descuento</label>
                    <input type="text" [(ngModel)]="editableContent.discount" (ngModelChange)="onContentChange()" class="premium-input">
                  </div>
                </div>

                <div class="control-group">
                  <label>URL de Imagen</label>
                  <input type="text" [(ngModel)]="editableContent.image" (ngModelChange)="onContentChange()" class="premium-input">
                </div>
              </div>

              <!-- APPEARANCE SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">✨</span>
                  <h4>APARIENCIA</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante Visual</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="default">Estándar</option>
                    <option value="primary">Primario</option>
                    <option value="secondary">Secundario</option>
                    <option value="glowing">Brillo (Glowing)</option>
                    <option value="glass">Vidrio (Glass)</option>
                    <option value="neon">Neón</option>
                    <option value="cyberpunk">Cyberpunk</option>
                    <option value="luxury">Lujo / Gold</option>
                    <option value="stellar">Estelar</option>
                    <option value="holo">Holograma</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Icono Representativo</label>
                  <div class="icon-selector-grid">
                    <div *ngFor="let entry of iconEntries" 
                         (click)="editableContent.icon = entry.key; onContentChange()"
                         [class.active]="editableContent.icon === entry.key"
                         class="icon-option">
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                         <path [attr.d]="entry.path" stroke-linecap="round" stroke-linejoin="round"/>
                       </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- COLORS SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>COLORES</h4>
                </div>
                
                <div class="control-group">
                  <label>Color de fondo</label>
                  <div class="color-input-wrapper">
                    <div class="color-preview" [style.background-color]="editableStyles.backgroundColor">
                      <input type="color" [(ngModel)]="editableStyles.backgroundColor" (ngModelChange)="onStyleChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableStyles.backgroundColor" (ngModelChange)="onStyleChange()" class="premium-input font-mono">
                  </div>
                </div>

                <div class="control-group">
                  <label>Color de texto</label>
                  <div class="color-input-wrapper">
                    <div class="color-preview" [style.background-color]="editableStyles.color">
                      <input type="color" [(ngModel)]="editableStyles.color" (ngModelChange)="onStyleChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableStyles.color" (ngModelChange)="onStyleChange()" class="premium-input font-mono">
                  </div>
                  <div class="theme-palette mt-2" *ngIf="globalColors$ | async as colors">
                     <div *ngFor="let c of colors" class="palette-swatch" [style.background-color]="c" (click)="editableStyles.color = c; onStyleChange()"></div>
                  </div>
                </div>
              </div>

              <!-- DIMENSIONS SECTION -->
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
                  
                  <lib-ui-components-card-premium
                    [config]="editableContent"
                    [variant]="editableContent.variant"
                    [customStyles]="editableStyles"
                    style="display: block; width: 100%; height: 100%;">
                  </lib-ui-components-card-premium>

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
              <div class="dock-item"><span class="label">VARIANT</span><span class="value capitalize text-indigo-400">{{ editableContent.variant }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">SIZE</span><span class="value">{{ currentSize.width }}x{{ currentSize.height }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Las cartas premium soportan fondos de imagen y efectos visuales avanzados según la variante.</div>
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

    .icon-selector-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-top: 8px; }
    .icon-option { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.05); aspect-ratio: 1; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #94a3b8; cursor: pointer; transition: all 0.2s; }
    .icon-option:hover { background: rgba(255,255,255,0.1); color: white; }
    .icon-option.active { background: rgba(99, 102, 241, 0.1); border-color: #6366f1; color: #6366f1; }

    .color-input-wrapper { display: flex; gap: 0.8rem; }
    .color-preview { width: 38px; height: 38px; border-radius: 10px; position: relative; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.2); }
    .color-preview input { position: absolute; inset: -5px; width: 150%; height: 150%; cursor: pointer; }
    .palette-swatch { width: 22px; height: 22px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(255, 255, 255, 0.1); transition: transform 0.2s; }
    .palette-swatch:hover { transform: scale(1.2); border-color: white; }

    .premium-textarea { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.8rem; border-radius: 12px; font-size: 13px; line-height: 1.5; resize: none; }
    .premium-input, .premium-select { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.6rem 0.8rem; border-radius: 10px; font-size: 12px; }
  `]
})
export class EditorCardPremiumIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;

  private store = inject(Store<AppState>);
  globalColors$: Observable<string[]> = this.store.select(selectCurrentPageGlobalStyles).pipe(
    map(s => s ? [s.primaryColor, s.secondaryColor, s.accentColor, s.backgroundColor, s.textColor].filter(Boolean) : [])
  );
  
  iconEntries = Object.entries(heroIconPaths).map(([key, path]) => ({ key, path }));

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = { ...this.config.content };
    this.editableStyles = { ...this.config.styles };
    
    // Position & Size initialization
    this.currentPosition = { ...(this.config.position || { x: 2000 - 175, y: 2000 - 250 }) };
    this.currentSize = { ...(this.config.size || { width: 350, height: 500 }) };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.6;

    this.saveState();
  }

  override apply() {
    const finalConfig = {
      ...this.config,
      variant: this.editableContent.variant,
      content: { ...this.editableContent },
      styles: {
        ...this.editableStyles,
        width: this.currentSize.width + 'px',
        height: this.currentSize.height + 'px',
        position: 'absolute',
        left: this.currentPosition.x + 'px',
        top: this.currentPosition.y + 'px'
      },
      position: { ...this.currentPosition },
      size: { ...this.currentSize }
    };
    this.applied.emit(finalConfig);
  }

  override onCanvasMouseDown(event: MouseEvent) { }
  onOverlayClick(event: MouseEvent) { this.cancel(); }
}
