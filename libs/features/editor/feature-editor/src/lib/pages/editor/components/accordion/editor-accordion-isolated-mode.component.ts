import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIAccordionComponent, UIAccordion1Component, UIAccordion2Component, UIAccordion3Component, variants } from '@negocio/ui-components';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';

@Component({
  selector: 'lib-editor-accordion-isolated-mode',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    UIAccordionComponent,
    UIAccordion1Component,
    UIAccordion2Component,
    UIAccordion3Component
  ],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🎯 MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">ACORDEÓN PREMIUM GOLD</span>
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
              <button [class.active]="activeTab === 'style'" (click)="activeTab = 'style'">APARIENCIA</button>
            </div>

            <div class="sidebar-scroll-content">
              
              <!-- CONTENT SECTION -->
              <div class="sidebar-section" *ngIf="activeTab === 'content'">
                <div class="section-header">
                  <span class="section-icon">📋</span>
                  <h4>ELEMENTOS</h4>
                  <button class="add-btn-mini" (click)="addItem()">+</button>
                </div>
                
                <div class="accordion-items-list">
                  <div *ngFor="let item of editableContent.items; let i = index" class="accordion-item-editor">
                    <div class="item-header">
                      <span>ITEM #{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeItem(i)">✕</button>
                    </div>
                    <div class="control-group">
                      <label>Título</label>
                      <input type="text" [(ngModel)]="item.title" (ngModelChange)="onPartialChange()" class="premium-input">
                    </div>
                    <div class="control-group">
                      <label>Contenido</label>
                      <textarea [(ngModel)]="item.content" (ngModelChange)="onPartialChange()" class="premium-textarea"></textarea>
                    </div>
                  </div>
                </div>

                <button class="add-btn-full mt-4" (click)="addItem()">+ Añadir Nuevo Elemento</button>
              </div>

              <!-- STYLE SECTION -->
              <div class="sidebar-section" *ngIf="activeTab === 'style'">
                <div class="section-header">
                  <span class="section-icon">✨</span>
                  <h4>ESTILO & COMPONENTE</h4>
                </div>
                
                <div class="control-group">
                  <label>Tipo de Acordeón</label>
                  <select [(ngModel)]="editableContent.accordionVariant" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="accordion">Estándar (Básico)</option>
                    <option value="accordion-1">Card (Sombreado)</option>
                    <option value="accordion-2">Minimalista (Líneas)</option>
                    <option value="accordion-3">Glass (Elegante)</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Variante Visual</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onVariantChange()" class="premium-select">
                    <option value="default">Default</option>
                    <option value="primary">Primaria</option>
                    <option value="secondary">Secundaria</option>
                    <option value="glass">Glassmorphism</option>
                    <option value="neon">Neon Glow</option>
                    <ng-container *ngFor="let v of availableVariants">
                       <option *ngIf="!['primary', 'secondary', 'glass', 'neon', 'default'].includes(v)" [value]="v">{{ formatVariantName(v) }}</option>
                    </ng-container>
                  </select>
                </div>

                <div class="control-row grid grid-cols-2 gap-2">
                   <div class="control-group">
                      <label>Tamaño</label>
                      <select [(ngModel)]="editableContent.size" (ngModelChange)="onContentChange()" class="premium-select">
                        <option value="sm">Pequeño</option>
                        <option value="md">Mediano</option>
                        <option value="lg">Grande</option>
                      </select>
                   </div>
                   <div class="control-group">
                      <label>Redondeado</label>
                      <select [(ngModel)]="editableContent.rounded" (ngModelChange)="onContentChange()" class="premium-select">
                        <option value="none">Recto</option>
                        <option value="md">Suave</option>
                        <option value="full">Cápsula</option>
                      </select>
                   </div>
                </div>

                <div class="checkbox-control mb-4" (click)="editableContent.dark = !editableContent.dark; onContentChange()">
                   <div class="custom-checkbox" [class.checked]="editableContent.dark"></div>
                   <span>Modo Oscuro (Ambient Dark)</span>
                </div>

                <!-- Dimensions within Style tab for optimization -->
                <div class="section-header mt-8">
                  <span class="section-icon">📏</span>
                  <h4>TAMAÑO & POSICIÓN</h4>
                </div>
                <div class="control-row grid grid-cols-2 gap-2">
                  <div class="control-group">
                    <label>X / Y</label>
                    <div class="flex gap-2">
                      <input type="number" [(ngModel)]="currentPosition.x" (ngModelChange)="onPositionChange()" class="premium-input text-center p-1">
                      <input type="number" [(ngModel)]="currentPosition.y" (ngModelChange)="onPositionChange()" class="premium-input text-center p-1">
                    </div>
                  </div>
                  <div class="control-group">
                    <label>Width / Height</label>
                    <div class="flex gap-2">
                       <input type="number" [(ngModel)]="currentSize.width" (ngModelChange)="onSizeChange()" class="premium-input text-center p-1">
                       <input type="number" [(ngModel)]="currentSize.height" (ngModelChange)="onSizeChange()" class="premium-input text-center p-1">
                    </div>
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
                  
                  <lib-ui-components-accordion
                    *ngIf="editableContent.accordionVariant === 'accordion' || !editableContent.accordionVariant"
                    [variant]="editableContent.variant || 'glass'"
                    [items]="editableContent.items || []"
                    [customStyles]="editableStyles"
                    style="width: 100%; height: 100%; display: block;">
                  </lib-ui-components-accordion>

                  <lib-ui-components-accordion-1
                    *ngIf="editableContent.accordionVariant === 'accordion-1'"
                    [variant]="editableContent.variant || 'glass'"
                    [rounded]="editableContent.rounded || 'md'"
                    [size]="editableContent.size || 'md'"
                    [dark]="editableContent.dark || false"
                    [items]="editableContent.items || []"
                    [customStyles]="editableStyles"
                    style="width: 100%; height: 100%; display: block;">
                  </lib-ui-components-accordion-1>

                  <lib-ui-components-accordion-2
                    *ngIf="editableContent.accordionVariant === 'accordion-2'"
                    [variant]="editableContent.variant || 'glass'"
                    [rounded]="editableContent.rounded || 'md'"
                    [size]="editableContent.size || 'md'"
                    [dark]="editableContent.dark || false"
                    [items]="editableContent.items || []"
                    [customStyles]="editableStyles"
                    style="width: 100%; height: 100%; display: block;">
                  </lib-ui-components-accordion-2>

                  <lib-ui-components-accordion-3
                    *ngIf="editableContent.accordionVariant === 'accordion-3'"
                    [variant]="editableContent.variant || 'glass'"
                    [rounded]="editableContent.rounded || 'md'"
                    [size]="editableContent.size || 'md'"
                    [dark]="editableContent.dark || false"
                    [items]="editableContent.items || []"
                    [customStyles]="editableStyles"
                    style="width: 100%; height: 100%; display: block;">
                  </lib-ui-components-accordion-3>

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
              <div class="dock-item"><span class="label">ITEMS</span><span class="value">{{ editableContent.items?.length || 0 }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">SIZE</span><span class="value">{{ currentSize.width }}x{{ currentSize.height }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Gestiona secciones desplegables. Usa atajos para mayor precisión.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
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

    .canvas-inner { width: 4000px; height: 4000px; position: relative; background-size: 20px 20px;
      &.show-grid { background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px); }
      &.grid-snapping { background-image: radial-gradient(rgba(99, 102, 241, 0.25) 1.5px, transparent 1.5px); }
    }

    .draggable-wrapper { position: absolute !important; cursor: move; z-index: 100; outline: 2px solid transparent; outline-offset: 4px; background: rgba(255, 255, 255, 0.01);
      &:hover { outline-color: rgba(99, 102, 241, 0.4); }
      &.is-dragging, &.is-resizing { outline-color: #6366f1; outline-width: 3px; }
    }

    .sidebar-tabs { display: flex; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .sidebar-tabs button { flex: 1; padding: 1rem; background: transparent; border: none; color: #64748b; font-size: 10px; font-weight: 900; letter-spacing: 1px; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.3s; }
    .sidebar-tabs button.active { color: #10b981; border-bottom-color: #10b981; background: rgba(16, 185, 129, 0.05); }

    .accordion-items-list { display: flex; flex-direction: column; gap: 12px; }
    .accordion-item-editor { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 1rem; }
    .item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-size: 10px; font-weight: 900; color: #6366f1; }
    .remove-btn { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: none; width: 22px; height: 22px; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
    .remove-btn:hover { background: #ef4444; color: white; }
    
    .add-btn-mini { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); width: 24px; height: 24px; border-radius: 6px; font-weight: 900; cursor: pointer; margin-left: auto; }
    .add-btn-full { width: 100%; padding: 0.8rem; background: transparent; border: 1px dashed rgba(16, 185, 129, 0.5); color: #10b981; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .add-btn-full:hover { background: rgba(16, 185, 129, 0.1); border-style: solid; }

    .checkbox-control { display: flex; align-items: center; gap: 10px; cursor: pointer;
      span { font-size: 12px; color: #94a3b8; font-weight: 600; }
    }
    .custom-checkbox { width: 18px; height: 18px; border: 2px solid rgba(255, 255, 255, 0.15); border-radius: 4px; position: relative; transition: all 0.2s;
      &.checked { background: #6366f1; border-color: #6366f1; }
      &.checked::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: 900; }
    }

    .premium-textarea { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.8rem; border-radius: 12px; font-size: 13px; line-height: 1.5; resize: none; min-height: 80px; }
    .premium-input, .premium-select { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.6rem 0.8rem; border-radius: 10px; font-size: 12px; }
  `]
})
export class EditorAccordionIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;
  activeTab: 'content' | 'style' = 'content';
  availableVariants = variants;

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = { 
        ...this.config.content,
        accordionVariant: this.config.content.accordionVariant || 'accordion',
        variant: this.config.content.variant || 'glass',
        size: this.config.content.size || 'md',
        rounded: this.config.content.rounded || 'md',
        dark: this.config.content.dark || false,
        items: [...(this.config.content['items'] || [])]
    };
    this.editableStyles = { ...this.config.styles };
    
    // Position & Size initialization
    this.currentPosition = { ...(this.config.position || { x: 2000 - 400, y: 2000 - 300 }) };
    this.currentSize = { ...(this.config.size || { width: 800, height: 600 }) };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.5;

    this.saveState();
  }

  addItem() {
    if (!this.editableContent.items) this.editableContent.items = [];
    this.editableContent.items.push({ 
      title: 'Nueva sección', 
      content: 'Contenido adicional para tu acordeón.' 
    });
    this.onPartialChange();
  }

  removeItem(index: number) {
    this.editableContent.items.splice(index, 1);
    this.onPartialChange();
  }

  onPartialChange() {
    this.scheduleSaveState();
  }

  override apply() {
    this.applied.emit({
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
    });
  }

  onCanvasMouseDown(event: MouseEvent) { }
  onOverlayClick(event: MouseEvent) { this.cancel(); }
}
