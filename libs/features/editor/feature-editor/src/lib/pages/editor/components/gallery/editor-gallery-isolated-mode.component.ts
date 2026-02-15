import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIGallerySectionComponent } from '@negocio/featured-components';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';

@Component({
  selector: 'lib-editor-gallery-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UIGallerySectionComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🖼️ GALLERY EDITOR</span>
            <span class="separator">/</span>
            <span class="component-name">MULTIMEDIA GALLERY GOLD</span>
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
              <button [class.active]="activeTab === 'media'" (click)="activeTab = 'media'">CONTENIDO</button>
              <button [class.active]="activeTab === 'layout'" (click)="activeTab = 'layout'">DISPOSICIÓN</button>
            </div>

            <div class="sidebar-scroll-content">
              
              <!-- MEDIA SECTION -->
              <div class="sidebar-section animate-fade-in" *ngIf="activeTab === 'media'">
                <div class="section-header">
                  <span class="section-icon">📷</span>
                  <h4>IMÁGENES Y MULTIMEDIA</h4>
                </div>
                
                <div class="media-grid">
                  <div *ngFor="let item of editableItems; let i = index" 
                       class="media-item-card" 
                       [class.active]="selectedIndex === i"
                       (click)="selectedIndex = i">
                    <img [src]="item.src" class="media-thumb">
                    <div class="media-info">
                       <span class="media-title">{{ item.title || 'Multimedia' }}</span>
                       <button (click)="removeItem(i, $event)" class="delete-btn-mini">✕</button>
                    </div>
                  </div>
                </div>

                <div *ngIf="editableItems[selectedIndex]" class="item-editor-panel mt-6">
                   <div class="control-group">
                      <label>Fuente de Imagen (URL)</label>
                      <input type="text" [(ngModel)]="editableItems[selectedIndex].src" (ngModelChange)="onContentChange()" class="premium-input">
                   </div>
                   <div class="control-group">
                      <label>Título / Título Alternativo</label>
                      <input type="text" [(ngModel)]="editableItems[selectedIndex].title" (ngModelChange)="onContentChange()" class="premium-input">
                   </div>
                   <div class="control-group">
                      <label>Descripción Breve</label>
                      <textarea [(ngModel)]="editableItems[selectedIndex].description" (ngModelChange)="onContentChange()" class="premium-textarea h-20"></textarea>
                   </div>
                </div>

                <button (click)="addItem()" class="add-btn-premium mt-4">+ Añadir Elemento</button>
              </div>

              <!-- LAYOUT SECTION -->
              <div class="sidebar-section animate-fade-in" *ngIf="activeTab === 'layout'">
                <div class="section-header">
                  <span class="section-icon">🧩</span>
                  <h4>CONFIGURACIÓN DE GRID</h4>
                </div>
                
                <div class="control-group">
                  <label>Columnas ({{ editableContent.columns }})</label>
                  <div class="grid-selector">
                    <button *ngFor="let n of [1,2,3,4,5,6]" 
                            [class.active]="editableContent.columns === n" 
                            (click)="editableContent.columns = n; onContentChange()">
                      {{ n }}
                    </button>
                  </div>
                </div>

                <div class="control-group">
                  <label>Espaciado entre Items ({{ editableContent.gap }}px)</label>
                  <input type="range" min="0" max="80" step="4" [(ngModel)]="editableContent.gap" (ngModelChange)="onContentChange()" class="premium-range">
                </div>

                <div class="control-group">
                  <label>Variante de Visualización</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="grid">Cuadrícula Equilibrada</option>
                    <option value="masonry">Mosaico Fluido (Masonry)</option>
                    <option value="slider">Carrusel Interactivo</option>
                    <option value="justified">Justificado Fotográfico</option>
                  </select>
                </div>

                <div class="checkbox-control mt-6" (click)="editableContent.lightbox = !editableContent.lightbox; onContentChange()">
                   <div class="custom-checkbox" [class.checked]="editableContent.lightbox"></div>
                   <span>Activar Visualización Lightbox</span>
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
                     [class.is-dragging]="isDragging"
                     [class.is-resizing]="isResizing"
                     (mousedown)="onMouseDown($event)">
                  
                  <lib-ui-components-gallery-section
                    [title]="editableContent.title || 'Galería Pro'"
                    [subtitle]="editableContent.subtitle || ''"
                    [variant]="editableContent.variant || 'grid'"
                    [images]="editableItems"
                    [customStyles]="editableStyles"
                    style="width: 100%; display: block;">
                  </lib-ui-components-gallery-section>

                  <!-- Left/Right resize only since it's a section width -->
                  <div class="resize-handle e"  (mousedown)="startResize($event, 'e')"></div>
                  <div class="resize-handle w"  (mousedown)="startResize($event, 'w')"></div>
                </div>
              </div>

            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">COLS</span><span class="value">{{ editableContent.columns }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">ELEMENTOS</span><span class="value">{{ editableItems.length }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">WIDTH</span><span class="value">{{ currentSize.width }}px</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Galería Gold: Las imágenes optimizadas cargan un 40% más rápido.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Publicar Galería</button>
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
        &.active { color: #8b5cf6; border-bottom-color: #8b5cf6; background: rgba(139, 92, 246, 0.05); }
      }
    }

    .canvas-inner { width: 4000px; height: 3000px; position: relative; padding-top: 100px;
      &.show-grid { background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px); background-size: 30px 30px; }
    }

    .draggable-wrapper { position: absolute !important; cursor: move; z-index: 100; border: 2px dashed transparent; padding: 20px; transition: border-color 0.2s;
      &:hover { border-color: rgba(139, 92, 246, 0.3); }
      &.is-dragging, &.is-resizing { border-color: #8b5cf6; background: rgba(139, 92, 246, 0.02); }
    }

    .media-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .media-item-card { background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.2s;
      &:hover { border-color: #8b5cf6; transform: translateY(-2px); }
      &.active { border-color: #8b5cf6; box-shadow: 0 0 20px rgba(139, 92, 246, 0.2); }
    }
    .media-thumb { width: 100%; height: 90px; object-fit: cover; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    .media-info { padding: 8px; display: flex; justify-content: space-between; align-items: center; 
      .media-title { font-size: 10px; color: #94a3b8; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    }

    .delete-btn-mini { background: rgba(239, 68, 68, 0.1); color: #f87171; border: none; width: 22px; height: 22px; border-radius: 6px; cursor: pointer; font-size: 10px; transition: all 0.2s; &:hover { background: #ef4444; color: white; } }

    .grid-selector { display: grid; grid-template-columns: repeat(6, 1fr); gap: 5px; background: rgba(15, 23, 42, 0.6); padding: 5px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.05);
      button { aspect-ratio: 1; border: none; background: transparent; color: #64748b; border-radius: 6px; font-weight: 800; font-size: 11px; cursor: pointer; transition: all 0.2s;
        &.active { background: #8b5cf6; color: white; }
        &:hover:not(.active) { background: rgba(255, 255, 255, 0.05); color: white; }
      }
    }

    .add-btn-premium { width: 100%; background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.1)); border: 1px dashed rgba(139, 92, 246, 0.4); color: #a78bfa; padding: 12px; border-radius: 14px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.3s;
      &:hover { background: rgba(139, 92, 246, 0.2); border-color: #8b5cf6; transform: translateY(-1px); }
    }

    .premium-input, .premium-select, .premium-textarea { width: 100%; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); color: white; padding: 0.8rem 1rem; border-radius: 12px; font-size: 13px; transition: all 0.2s; &:focus { border-color: #8b5cf6; outline: none; background: #0f172a; } }
    .premium-range { width: 100%; accent-color: #8b5cf6; }

    .checkbox-control { display: flex; align-items: center; gap: 12px; cursor: pointer; span { font-size: 11px; color: #94a3b8; font-weight: 800; text-transform: uppercase; } }
    .custom-checkbox { width: 22px; height: 22px; border: 2px solid rgba(255, 255, 255, 0.15); border-radius: 7px; position: relative; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      &.checked { background: #8b5cf6; border-color: #8b5cf6; transform: scale(1.1); }
      &.checked::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; font-weight: 900; }
    }

    .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class EditorGalleryIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;

  activeTab: 'media' | 'layout' = 'media';
  selectedIndex = 0;
  editableItems: any[] = [];

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = { 
        ...this.config.content,
        columns: this.config.content.columns || 3,
        gap: this.config.content.gap || 20,
        variant: this.config.content.variant || 'grid',
        lightbox: this.config.content.lightbox !== false
    };
    this.editableItems = JSON.parse(JSON.stringify(this.config.content['items'] || []));
    this.editableStyles = { ...this.config.styles };
    
    // Gallery is usually a full-width or large centered section
    this.currentPosition = { ...(this.config.position || { x: 200, y: 100 }) };
    this.currentSize = { 
        width: this.config.size?.width || 1000, 
        height: this.config.size?.height || 600 
    };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.4;

    if (this.editableItems.length > 0) this.selectedIndex = 0;

    this.saveState();
  }

  override saveState() {
    const newState = {
      position: { ...this.currentPosition },
      size: { ...this.currentSize },
      styles: JSON.parse(JSON.stringify(this.editableStyles)),
      content: {
        ...JSON.parse(JSON.stringify(this.editableContent)),
        items: JSON.parse(JSON.stringify(this.editableItems))
      }
    };

    const lastState = this.undoStack[this.undoStack.length - 1];
    if (lastState && JSON.stringify(lastState) === JSON.stringify(newState)) return;

    this.undoStack.push(newState as any);
    if (this.undoStack.length > 50) this.undoStack.shift();
    this.redoStack = [];
  }

  addItem() {
    this.editableItems.push({
      src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      title: 'Nueva Imagen de Galería',
      description: 'Captura un momento inolvidable para tus visitantes.'
    });
    this.selectedIndex = this.editableItems.length - 1;
    this.onContentChange();
  }

  removeItem(index: number, event: MouseEvent) {
    event.stopPropagation();
    this.editableItems.splice(index, 1);
    if (this.selectedIndex >= this.editableItems.length) {
      this.selectedIndex = Math.max(0, this.editableItems.length - 1);
    }
    this.onContentChange();
  }

  override onContentChange() {
    this.scheduleSaveState();
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
        left: this.currentPosition.x + 'px',
        top: this.currentPosition.y + 'px',
        width: this.currentSize.width + 'px',
        position: 'absolute'
      },
      position: { ...this.currentPosition },
      size: { ...this.currentSize }
    });
  }

  onCanvasMouseDown(event: MouseEvent) { }
  onOverlayClick(event: MouseEvent) { this.cancel(); }
}
