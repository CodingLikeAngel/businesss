import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UIShowcaseAtomComponent } from '@negocio/ui-components';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';
import { AppState } from '../../../../store/state/app.state';
import { selectCurrentPageGlobalStyles } from '../../../../store/selectors/page.selectors';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-editor-showcase-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UIShowcaseAtomComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🎯 SHOWCASE ATOM</span>
            <span class="separator">/</span>
            <span class="component-name">DESIGN SYSTEM GOLD</span>
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
            </div>

            <div class="divider"></div>

            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <!-- ===== BODY ===== -->
        <div class="isolated-mode-body">
          
          <!-- Sidebar Controls -->
          <div class="controls-sidebar">
            <div class="sidebar-tabs">
              <button [class.active]="activeTab === 'content'" (click)="activeTab = 'content'">CONTENIDO</button>
              <button [class.active]="activeTab === 'design'" (click)="activeTab = 'design'">ESTILO</button>
            </div>

            <div class="sidebar-scroll-content">
              
              <!-- CONTENT SECTION -->
              <div class="sidebar-section animate-fade-in" *ngIf="activeTab === 'content'">
                <div class="section-header">
                  <span class="section-icon">📝</span>
                  <h4>DATOS DEL ATOM</h4>
                </div>
                
                <div class="control-group">
                  <label>Icono (Emoji / SVG)</label>
                  <input type="text" [(ngModel)]="editableContent.icon" (ngModelChange)="onContentChange()" class="premium-input" placeholder="✨">
                </div>

                <div class="control-group">
                  <label>Título de la Característica</label>
                  <input type="text" [(ngModel)]="editableContent.title" (ngModelChange)="onContentChange()" class="premium-input" placeholder="Título...">
                </div>

                <div class="control-group">
                  <label>Descripción</label>
                  <textarea [(ngModel)]="editableContent.text" (ngModelChange)="onContentChange()" class="premium-textarea h-24" placeholder="Describe brevemente esto..."></textarea>
                </div>
              </div>

              <!-- DESIGN SECTION -->
              <div class="sidebar-section animate-fade-in" *ngIf="activeTab === 'design'">
                <div class="section-header">
                  <span class="section-icon">📐</span>
                  <h4>LAYOUT & VARIANTE</h4>
                </div>
                
                <div class="control-group">
                  <label>Configuración de Ejes</label>
                  <select [(ngModel)]="editableContent.layout" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="vertical">Vertical (Stack)</option>
                    <option value="horizontal">Horizontal (Row)</option>
                    <option value="centered">Centro Absoluto</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Variante Estética</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="default">Estándar</option>
                    <option value="glass">Cristal / Blur</option>
                    <option value="neon">Neón / Glow</option>
                    <option value="cyberpunk">Cyberpunk High-Tech</option>
                    <option value="minimal">Minimal Ink</option>
                  </select>
                </div>

                <div class="divider-section"></div>

                <div class="section-header mt-6">
                  <span class="section-icon">🎨</span>
                  <h4>PALETA PERSONALIZADA</h4>
                </div>

                <div class="control-group">
                  <label>Color de Icono</label>
                  <div class="color-row">
                    <div class="color-preview" [style.background-color]="editableStyles.iconColor">
                      <input type="color" [(ngModel)]="editableStyles.iconColor" (ngModelChange)="onContentChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableStyles.iconColor" (ngModelChange)="onContentChange()" class="premium-input-mini">
                  </div>
                  <div class="theme-palette mt-2" *ngIf="globalColors$ | async as colors">
                     <div *ngFor="let c of colors" class="swatch" [style.background-color]="c" (click)="editableStyles.iconColor = c; onContentChange()"></div>
                  </div>
                </div>

                <div class="control-group">
                  <label>Fondo de Tarjeta</label>
                  <div class="color-row">
                    <div class="color-preview" [style.background-color]="editableStyles.backgroundColor">
                      <input type="color" [(ngModel)]="editableStyles.backgroundColor" (ngModelChange)="onContentChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableStyles.backgroundColor" (ngModelChange)="onContentChange()" class="premium-input-mini">
                  </div>
                </div>

                <div class="control-group">
                  <label>Radio de Borde ({{ editableStyles.borderRadiusProp }}px)</label>
                  <input type="range" min="0" max="40" step="2" [(ngModel)]="editableStyles.borderRadiusProp" (ngModelChange)="onContentChange()" class="premium-range">
                </div>
              </div>
            </div>
          </div>

          <!-- Canvas Area -->
          <div class="isolated-canvas" #canvas (mousedown)="onCanvasMouseDown($event)">
              <div class="canvas-inner" #canvasInner
                   [style.transform]="'scale(' + viewportScale + ')'"
                   [style.transformOrigin]="'center top'"
                   [class.show-grid]="showGrid"
                   [class.grid-snapping]="snapToGrid">
                
                <div class="draggable-wrapper"
                     #draggableWrapper
                     [style.left.px]="currentPosition.x"
                     [style.top.px]="currentPosition.y"
                     [style.width.px]="currentSize.width"
                     [style.minHeight.px]="currentSize.height"
                     [class.is-dragging]="isDragging"
                     [class.is-resizing]="isResizing"
                     (mousedown)="onMouseDown($event)">
                  
                  <lib-ui-components-showcase-atom
                    [icon]="editableContent.icon"
                    [title]="editableContent.title"
                    [text]="editableContent.text"
                    [layout]="editableContent.layout"
                    [variant]="editableContent.variant"
                    [customStyles]="getFinalStyles()"
                    style="display: block; width: 100%;">
                  </lib-ui-components-showcase-atom>

                  <!-- 8-Point Resizing -->
                  <div class="resize-handle n"  (mousedown)="startResize($event, 'n')"></div>
                  <div class="resize-handle s"  (mousedown)="startResize($event, 's')"></div>
                  <div class="resize-handle e"  (mousedown)="startResize($event, 'e')"></div>
                  <div class="resize-handle w"  (mousedown)="startResize($event, 'w')"></div>
                  <div class="resize-handle nw" (mousedown)="startResize($event, 'nw')"></div>
                  <div class="resize-handle ne" (mousedown)="startResize($event, 'ne')"></div>
                  <div class="resize-handle sw" (mousedown)="startResize($event, 'sw')"></div>
                  <div class="resize-handle se" (mousedown)="startResize($event, 'se')"></div>
                </div>
              </div>

            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">VARIANTE</span><span class="value uppercase text-amber-400">{{ editableContent.variant }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">WIDTH</span><span class="value">{{ currentSize.width }}px</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">POS</span><span class="value">{{ currentPosition.x }},{{ currentPosition.y }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Showcase Gold: Cada átomo visual está optimizado para la máxima legibilidad y estética.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Publicar Átomo</button>
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

    .sidebar-tabs { display: flex; background: rgba(15, 23, 42, 0.4); border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      button { flex: 1; padding: 1.2rem 0.5rem; background: transparent; border: none; color: #64748b; font-size: 10px; font-weight: 900; letter-spacing: 1.5px; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        &.active { color: #fbbf24; border-bottom-color: #fbbf24; background: rgba(251, 191, 36, 0.05); }
      }
    }

    .canvas-inner { width: 4000px; height: 3000px; position: relative; padding-top: 200px;
      &.show-grid { background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px); background-size: 40px 40px; }
    }

    .draggable-wrapper { position: absolute !important; cursor: move; z-index: 100; border: 2px dashed transparent; transition: border-color 0.2s;
      &:hover { border-color: rgba(251, 191, 36, 0.3); }
      &.is-dragging, &.is-resizing { border-color: #fbbf24; background: rgba(251, 191, 36, 0.02); }
    }

    .color-row { display: flex; gap: 10px; align-items: center; .color-preview { width: 34px; height: 34px; border-radius: 8px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); input { position: absolute; inset: -5px; width: 150%; height: 150%; cursor: pointer; opacity: 0; } } }
    
    .theme-palette { display: flex; flex-wrap: wrap; gap: 5px; .swatch { width: 20px; height: 20px; border-radius: 4px; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); transition: transform 0.2s; &:hover { transform: scale(1.2); } } }

    .premium-input, .premium-select, .premium-textarea { width: 100%; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); color: white; padding: 0.8rem 1rem; border-radius: 12px; font-size: 13px; &:focus { border-color: #fbbf24; outline: none; } }
    .premium-input-mini { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-family: monospace; }
    .premium-range { width: 100%; accent-color: #fbbf24; }

    .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class EditorShowcaseIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;

  private store = inject(Store<AppState>);
  globalColors$: Observable<string[]> = this.store.select(selectCurrentPageGlobalStyles).pipe(
    map(styles => styles ? [styles.primaryColor, styles.secondaryColor, styles.accentColor, styles.backgroundColor, styles.textColor].filter(Boolean) : [])
  );

  activeTab: 'content' | 'design' = 'content';

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = { 
        ...this.config.content,
        icon: this.config.content.icon || '✨',
        layout: this.config.content.layout || 'vertical',
        variant: this.config.content.variant || 'default'
    };
    
    this.editableStyles = { 
        ...this.config.styles,
        borderRadiusProp: parseInt(this.config.styles.borderRadius) || 16,
        iconColor: this.config.styles.iconColor || '#fbbf24',
        backgroundColor: this.config.styles.backgroundColor || 'transparent'
    };
    
    this.currentPosition = { ...(this.config.position || { x: 500, y: 300 }) };
    this.currentSize = { 
        width: this.config.size?.width || 350, 
        height: this.config.size?.height || 250 
    };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.8;

    this.saveState();
  }

  getFinalStyles() {
    return {
      ...this.editableStyles,
      borderRadius: this.editableStyles.borderRadiusProp + 'px'
    };
  }

  override saveState() {
    const newState = {
      position: { ...this.currentPosition },
      size: { ...this.currentSize },
      styles: JSON.parse(JSON.stringify(this.editableStyles)),
      content: JSON.parse(JSON.stringify(this.editableContent))
    };

    const lastState = this.undoStack[this.undoStack.length - 1];
    if (lastState && JSON.stringify(lastState) === JSON.stringify(newState)) return;

    this.undoStack.push(newState as any);
    if (this.undoStack.length > 50) this.undoStack.shift();
    this.redoStack = [];
  }

  override apply() {
    this.applied.emit({
      ...this.config,
      content: { ...this.editableContent },
      styles: {
        ...this.getFinalStyles(),
        left: this.currentPosition.x + 'px',
        top: this.currentPosition.y + 'px',
        width: this.currentSize.width + 'px',
        minHeight: this.currentSize.height + 'px',
        position: 'absolute'
      },
      position: { ...this.currentPosition },
      size: { ...this.currentSize }
    });
  }

  override onContentChange() {
    this.scheduleSaveState();
  }

  override onCanvasMouseDown(event: MouseEvent) { }
  onOverlayClick(event: MouseEvent) { this.cancel(); }
}
