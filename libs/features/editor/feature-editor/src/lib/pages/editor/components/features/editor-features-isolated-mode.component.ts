import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  UICardAnimatedComponent
} from '@negocio/ui-components';
import { AppState } from '../../../../store/state/app.state';
import { selectCurrentPageGlobalStyles } from '../../../../store/selectors/page.selectors';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';

@Component({
  selector: 'lib-editor-features-isolated-mode',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    UICardAnimatedComponent
  ],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🎯 FEATURES EDITOR</span>
            <span class="separator">/</span>
            <span class="component-name">COLLECTIONS & GRID GOLD</span>
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
            <div class="sidebar-tabs">
                <button [class.active]="activeTab === 'content'" (click)="activeTab = 'content'">CONTENIDO</button>
                <button [class.active]="activeTab === 'layout'" (click)="activeTab = 'layout'">DISEÑO</button>
                <button [class.active]="activeTab === 'items'" (click)="activeTab = 'items'">ITEMS</button>
            </div>

            <div class="sidebar-scroll-content">
              
              <!-- CONTENT SECTION -->
              <div class="sidebar-section" *ngIf="activeTab === 'content'">
                <div class="section-header">
                  <span class="section-icon">📝</span>
                  <h4>CABECERA DE SECCIÓN</h4>
                </div>
                
                <div class="control-group">
                  <label>Título de la Sección</label>
                  <input type="text" [(ngModel)]="editableContent.title" (ngModelChange)="onContentChange()" class="premium-input" placeholder="Nuestras Ventajas">
                </div>

                <div class="control-group">
                  <label>Descripción / Subtítulo</label>
                  <textarea [(ngModel)]="editableContent.subtitle" (ngModelChange)="onContentChange()" class="premium-textarea" placeholder="Por qué elegirnos..."></textarea>
                </div>
              </div>

              <!-- LAYOUT SECTION -->
              <div class="sidebar-section" *ngIf="activeTab === 'layout'">
                <div class="section-header">
                  <span class="section-icon">📐</span>
                  <h4>GRID & APARIENCIA</h4>
                </div>
                
                <div class="control-group">
                  <label>Columnas (Desktop)</label>
                  <div class="grid-cols-selector">
                    <button *ngFor="let n of [1,2,3,4,5,6]" 
                            [class.active]="editableContent.gridCols === n" 
                            (click)="editableContent.gridCols = n; onContentChange()">
                      {{ n }}
                    </button>
                  </div>
                </div>

                <div class="control-group">
                  <label>Espaciado (Gap: {{ editableContent.gridGap }}px)</label>
                  <input type="range" min="0" max="100" step="4" [(ngModel)]="editableContent.gridGap" (ngModelChange)="onContentChange()" class="premium-range">
                </div>

                <div class="control-group">
                  <label>Variante General de Cartas</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="default">Clásico</option>
                    <option value="glass">Glassmorphism</option>
                    <option value="neon">Neon Spark</option>
                    <option value="cyberpunk">Cyberpunk</option>
                    <option value="retro">Arcade Retro</option>
                  </select>
                </div>

                <div class="section-header mt-8">
                  <span class="section-icon">📐</span>
                  <h4>TAMAÑO CANVAS</h4>
                </div>
                <div class="control-row grid grid-cols-2 gap-2">
                  <div class="control-group">
                    <label>WIDTH (PX)</label>
                    <input type="number" [(ngModel)]="currentSize.width" (ngModelChange)="onSizeChange()" class="premium-input text-center">
                  </div>
                  <div class="control-group">
                    <label>HEIGHT (PX)</label>
                    <input type="number" [(ngModel)]="currentSize.height" (ngModelChange)="onSizeChange()" class="premium-input text-center">
                  </div>
                </div>
              </div>

              <!-- ITEMS SECTION -->
              <div class="sidebar-section" *ngIf="activeTab === 'items'">
                <div class="section-header">
                  <span class="section-icon">✨</span>
                  <h4>ITEMS EN COLLECCIÓN</h4>
                  <button class="add-btn-mini" (click)="addItem()">+</button>
                </div>
                
                <div class="items-list-premium">
                  <div *ngFor="let item of editableItems; let i = index" 
                       class="item-card" 
                       [class.active]="selectedItemIndex === i" 
                       (click)="selectedItemIndex = i">
                    <div class="item-visual">{{ item.icon || '⭐' }}</div>
                    <div class="item-info">
                      <span class="item-title">{{ item.title || 'Característica' }}</span>
                      <span class="item-meta">Slot #{{ i + 1 }}</span>
                    </div>
                    <button class="delete-btn" (click)="removeItem(i, $event)">✕</button>
                  </div>
                </div>

                <!-- ITEM EDITOR -->
                <div class="detail-editor-card mt-6 animate-fade-in" *ngIf="selectedItemIndex !== -1">
                  <div class="section-header">
                    <span class="section-icon">✏️</span>
                    <h4>EDITAR SLOT #{{ selectedItemIndex + 1 }}</h4>
                  </div>

                  <div class="control-group">
                    <label>Icono (Emoji / Nombre)</label>
                    <input type="text" [(ngModel)]="editableItems[selectedItemIndex].icon" (ngModelChange)="onContentChange()" class="premium-input">
                  </div>

                  <div class="control-group">
                    <label>Título del Item</label>
                    <input type="text" [(ngModel)]="editableItems[selectedItemIndex].title" (ngModelChange)="onContentChange()" class="premium-input">
                  </div>

                  <div class="control-group">
                    <label>Descripción Detallada</label>
                    <textarea [(ngModel)]="editableItems[selectedItemIndex].description" (ngModelChange)="onContentChange()" class="premium-textarea h-24"></textarea>
                  </div>

                  <div class="control-group">
                    <label>Sobrescribir Variante</label>
                    <select [(ngModel)]="editableItems[selectedItemIndex].variant" (ngModelChange)="onContentChange()" class="premium-select">
                       <option [value]="undefined">Heredar General</option>
                       <option value="default">Clásico</option>
                       <option value="glass">Glass</option>
                       <option value="neon">Neon</option>
                    </select>
                  </div>
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
                     [style.min-height.px]="currentSize.height"
                     [class.is-dragging]="isDragging"
                     [class.is-resizing]="isResizing"
                     (mousedown)="onMouseDown($event)">
                  
                  <div class="preview-section-header" *ngIf="editableContent.title || editableContent.subtitle">
                      <h2 class="preview-title" [style.color]="'white'">{{ editableContent.title }}</h2>
                      <p class="preview-subtitle" [style.color]="'#94a3b8'">{{ editableContent.subtitle }}</p>
                  </div>

                  <div class="features-render-grid" 
                        [style.grid-template-columns]="'repeat(' + (editableContent.gridCols || 3) + ', 1fr)'"
                        [style.gap.px]="editableContent.gridGap || 20">
                    
                    <div *ngFor="let item of editableItems; let i = index" 
                          class="renderer-item-wrapper"
                          [class.is-editing]="selectedItemIndex === i"
                          (click)="selectedItemIndex = i; $event.stopPropagation()">
                        <lib-ui-components-card-animated
                          [icon]="item.icon"
                          [title]="item.title"
                          [description]="item.description"
                          [variant]="$any(item.variant || editableContent.variant || 'default')"
                          class="preview-card"
                        ></lib-ui-components-card-animated>
                        <div class="item-id-badge">#{{ i + 1 }}</div>
                    </div>
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
              <div class="dock-item"><span class="label">GRID</span><span class="value text-indigo-400">{{ editableContent.gridCols }} Cols</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">GAP</span><span class="value">{{ editableContent.gridGap }}px</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">TOTAL</span><span class="value">{{ editableItems.length }} Items</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Features Pro: Crea catálogos visuales de impacto con un grid dinámico.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Colección</button>
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

    .canvas-inner { width: 6000px; height: 8000px; position: relative; padding: 200px;
      &.show-grid { background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1.5px, transparent 1.5px); background-size: 40px 40px; }
      &.grid-snapping { background-image: radial-gradient(rgba(99, 102, 241, 0.25) 2px, transparent 2px); background-size: 40px 40px; }
    }

    .sidebar-tabs { display: flex; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .sidebar-tabs button { flex: 1; padding: 1rem; background: transparent; border: none; color: #64748b; font-size: 10px; font-weight: 900; letter-spacing: 1px; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.3s; }
    .sidebar-tabs button.active { color: #10b981; border-bottom-color: #10b981; background: rgba(16, 185, 129, 0.05); }

    .draggable-wrapper { position: absolute !important; cursor: move; z-index: 100; outline: 4px solid transparent; outline-offset: 8px; background: rgba(15, 23, 42, 0.4); padding: 40px; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.6); border-radius: 4px;
      &:hover { outline-color: rgba(99, 102, 241, 0.3); }
      &.is-dragging, &.is-resizing { outline-color: #6366f1; outline-width: 5px; }
    }

    .preview-section-header { text-align: center; margin-bottom: 50px; }
    .preview-title { font-size: 48px; font-weight: 900; margin-bottom: 10px; letter-spacing: -1px; }
    .preview-subtitle { font-size: 18px; max-width: 800px; margin: 0 auto; line-height: 1.6; }

    .features-render-grid { display: grid; width: 100%; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    .renderer-item-wrapper { position: relative; border-radius: 24px; border: 2px solid transparent; transition: all 0.3s;
      &.is-editing { border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); transform: scale(1.02); z-index: 10; }
    }
    .preview-card { width: 100%; pointer-events: none; display: block; }
    .item-id-badge { position: absolute; top: -10px; left: -10px; background: #3b82f6; color: white; font-size: 10px; font-weight: 800; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4); }

    .grid-cols-selector { display: flex; gap: 4px; }
    .grid-cols-selector button { flex: 1; height: 32px; background: #1e293b; border: 1px solid rgba(255,255,255,0.05); color: #64748b; border-radius: 6px; font-size: 11px; font-weight: 900; cursor: pointer; }
    .grid-cols-selector button.active { background: #3b82f6; color: white; }

    .items-list-premium { display: flex; flex-direction: column; gap: 8px; }
    .item-card { display: flex; align-items: center; gap: 12px; padding: 10px; background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 14px; cursor: pointer; transition: all 0.2s;
       &:hover { transform: translateX(4px); background: rgba(30, 41, 59, 0.7); }
       &.active { border-color: #3b82f6; background: rgba(59, 130, 246, 0.1); }
    }
    .item-visual { width: 32px; height: 32px; background: #0f172a; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
    .item-info { flex: 1; .item-title { display: block; color: white; font-size: 12px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .item-meta { font-size: 9px; color: #64748b; } }
    .delete-btn { background: transparent; border: none; color: #ef444455; cursor: pointer; padding: 4px; &:hover { color: #ef4444; } }

    .detail-editor-card { background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 16px; padding: 1.2rem; }
    .add-btn-mini { background: #10b981; color: white; border: none; padding: 2px 8px; border-radius: 4px; font-weight: 900; cursor: pointer; margin-left: auto; }

    .premium-input, .premium-select { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.6rem 0.8rem; border-radius: 10px; font-size: 12px; }
    .premium-textarea { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.6rem 0.8rem; border-radius: 10px; font-size: 11px; resize: none; }
    .premium-range { width: 100%; accent-color: #3b82f6; }

    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class EditorFeaturesIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;
  activeTab: 'content' | 'layout' | 'items' = 'content';
  selectedItemIndex = -1;
  editableItems: any[] = [];

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = { 
        ...this.config.content,
        title: this.config.content.title || 'Nuestras Ventajas',
        subtitle: this.config.content.subtitle || 'Descubre por qué somos la mejor opción para tu negocio.',
        gridCols: this.config.content.gridCols || 3,
        gridGap: this.config.content.gridGap || 24,
        variant: this.config.content.variant || 'default'
    };
    this.editableItems = JSON.parse(JSON.stringify(this.config.content.items || []));
    this.editableStyles = { ...this.config.styles };
    
    this.currentPosition = { ...(this.config.position || { x: 50, y: 50 }) };
    this.currentSize = { 
        width: parseInt(this.config.styles?.width) || 1100, 
        height: parseInt(this.config.styles?.height) || 600 
    };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.4;

    if (this.editableItems.length > 0) this.selectedItemIndex = 0;

    this.saveState();
  }

  override onContentChange() {
    this.scheduleSaveState();
  }

  addItem() {
    const newItem = {
      icon: '🚀',
      title: 'Nueva Característica',
      description: 'Describe aquí una ventaja competitiva de tu producto o servicio.',
      variant: 'default'
    };
    this.editableItems.push(newItem);
    this.selectedItemIndex = this.editableItems.length - 1;
    this.onContentChange();
  }

  removeItem(index: number, e: MouseEvent) {
    e.stopPropagation();
    this.editableItems.splice(index, 1);
    if (this.selectedItemIndex >= this.editableItems.length) {
      this.selectedItemIndex = Math.max(-1, this.editableItems.length - 1);
    }
    this.onContentChange();
  }

  override apply() {
    this.applied.emit({
      ...this.config,
      content: { 
        ...this.editableContent,
        items: this.editableItems
      },
      styles: {
        ...this.editableStyles,
        width: this.currentSize.width + 'px',
        minHeight: this.currentSize.height + 'px',
        position: 'relative'
      },
      position: { ...this.currentPosition },
      size: { ...this.currentSize }
    });
  }

  override onCanvasMouseDown(event: MouseEvent) { }
  onOverlayClick(event: MouseEvent) { this.cancel(); }
}
