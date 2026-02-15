import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIStepsSectionComponent } from '@negocio/featured-components';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';

@Component({
  selector: 'lib-editor-steps-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UIStepsSectionComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">📍 STEPS EDITOR</span>
            <span class="separator">/</span>
            <span class="component-name">PROCESS WORKFLOW GOLD</span>
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
              <button [class.active]="activeTab === 'items'" (click)="activeTab = 'items'">PASOS</button>
              <button [class.active]="activeTab === 'design'" (click)="activeTab = 'design'">DISEÑO</button>
            </div>

            <div class="sidebar-scroll-content">
              
              <!-- ITEMS SECTION -->
              <div class="sidebar-section animate-fade-in" *ngIf="activeTab === 'items'">
                <div class="section-header">
                  <span class="section-icon">🛤️</span>
                  <h4>FLUJO DE TRABAJO</h4>
                </div>
                
                <div class="item-list">
                  <div *ngFor="let step of editableItems; let i = index" 
                       class="step-item-card" 
                       [class.active]="selectedIndex === i"
                       (click)="selectedIndex = i">
                    <div class="item-main">
                      <span class="item-index">{{ i + 1 }}</span>
                      <input type="text" [(ngModel)]="step.title" (ngModelChange)="onContentChange()" class="premium-input-mini" placeholder="Ej: Contacto">
                      <button (click)="removeStep(i, $event)" class="delete-btn-mini">✕</button>
                    </div>
                    <div *ngIf="selectedIndex === i" class="item-details animate-fade-in">
                        <label>Descripción del Paso</label>
                        <textarea [(ngModel)]="step.description" (ngModelChange)="onContentChange()" class="premium-textarea h-24" placeholder="¿Qué ocurre en este paso?"></textarea>
                        
                        <label class="mt-4">Icono / Emoji</label>
                        <input type="text" [(ngModel)]="step.icon" (ngModelChange)="onContentChange()" class="premium-input-mini" placeholder="📨">
                    </div>
                  </div>
                </div>

                <button (click)="addStep()" class="add-btn-premium mt-4">+ Nuevo Paso</button>
              </div>

              <!-- DESIGN SECTION -->
              <div class="sidebar-section animate-fade-in" *ngIf="activeTab === 'design'">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>ESTILO DEL PROCESO</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante Visual</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="modern">Moderno (Minimal)</option>
                    <option value="connected">Conectado (Línea)</option>
                    <option value="vertical">Vertical Flow</option>
                    <option value="boxed">Cápsulas Numeradas</option>
                  </select>
                </div>

                <div class="control-row grid grid-cols-2 gap-3">
                   <div class="control-group">
                      <label>Color Maestro</label>
                      <div class="color-row">
                        <div class="color-preview" [style.background-color]="editableStyles.accentColor">
                          <input type="color" [(ngModel)]="editableStyles.accentColor" (ngModelChange)="onContentChange()">
                        </div>
                        <input type="text" [(ngModel)]="editableStyles.accentColor" (ngModelChange)="onContentChange()" class="premium-input-mini">
                      </div>
                   </div>
                   <div class="control-group">
                      <label>Radio Borde ({{ editableStyles.borderRadius }}px)</label>
                      <input type="range" min="0" max="40" step="4" [(ngModel)]="editableStyles.borderRadius" (ngModelChange)="onContentChange()" class="premium-range">
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
                     [class.is-dragging]="isDragging"
                     [class.is-resizing]="isResizing"
                     (mousedown)="onMouseDown($event)">
                  
                  <lib-ui-steps-section
                    [variant]="editableContent.variant"
                    [steps]="editableItems"
                    [customStyles]="editableStyles"
                    style="width: 100%; display: block;">
                  </lib-ui-steps-section>

                  <!-- Lateral handles -->
                  <div class="resize-handle e"  (mousedown)="startResize($event, 'e')"></div>
                  <div class="resize-handle w"  (mousedown)="startResize($event, 'w')"></div>
                </div>
              </div>

            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">HITOS</span><span class="value">{{ editableItems.length }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">ESTILO</span><span class="value uppercase text-purple-400">{{ editableContent.variant }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">WIDTH</span><span class="value">{{ currentSize.width }}px</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Steps Gold: Explica tu proceso paso a paso para reducir la fricción del usuario.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Actualizar Proceso</button>
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

    .canvas-inner { width: 4000px; height: 3000px; position: relative; padding-top: 150px;
      &.show-grid { background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px); background-size: 30px 30px; }
    }

    .draggable-wrapper { position: absolute !important; cursor: move; z-index: 100; border: 2px dashed transparent; padding: 40px; transition: border-color 0.2s;
      &:hover { border-color: rgba(139, 92, 246, 0.3); }
      &.is-dragging, &.is-resizing { border-color: #8b5cf6; background: rgba(139, 92, 246, 0.02); }
    }

    .item-list { display: flex; flex-direction: column; gap: 12px; }
    .step-item-card { background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 12px; cursor: pointer; transition: all 0.2s;
      &:hover { border-color: rgba(255, 255, 255, 0.15); }
      &.active { border-color: #8b5cf6; background: rgba(139, 92, 246, 0.05); }
    }
    
    .item-main { display: flex; align-items: center; gap: 10px; }
    .item-index { font-size: 9px; font-weight: 900; color: #64748b; background: rgba(255, 255, 255, 0.05); width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border-radius: 6px; }
    .item-details { margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05); label { display: block; font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: 800; margin-bottom: 6px; } }

    .delete-btn-mini { background: rgba(239, 68, 68, 0.1); color: #f87171; border: none; width: 24px; height: 24px; border-radius: 6px; cursor: pointer; transition: all 0.2s; &:hover { background: #ef4444; color: white; } }

    .add-btn-premium { width: 100%; background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1)); border: 1px dashed rgba(139, 92, 246, 0.4); color: #a78bfa; padding: 12px; border-radius: 14px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.3s; &:hover { border-color: #8b5cf6; background: rgba(139, 92, 246, 0.2); } }

    .color-row { display: flex; gap: 10px; align-items: center; .color-preview { width: 34px; height: 34px; border-radius: 8px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); input { position: absolute; inset: -5px; width: 150%; height: 150%; cursor: pointer; opacity: 0; } } }

    .premium-input, .premium-select, .premium-textarea { width: 100%; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); color: white; padding: 0.8rem 1rem; border-radius: 12px; font-size: 13px; &:focus { border-color: #8b5cf6; outline: none; } }
    .premium-input-mini { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-family: monospace; }
    .premium-range { width: 100%; accent-color: #8b5cf6; }

    .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class EditorStepsIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;

  activeTab: 'items' | 'design' = 'items';
  selectedIndex = 0;
  editableItems: any[] = [];

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = { 
        ...this.config.content,
        variant: this.config.content.variant || 'modern'
    };
    this.editableItems = JSON.parse(JSON.stringify(this.config.content.steps || []));
    this.editableStyles = { 
        ...this.config.styles,
        borderRadius: parseInt(this.config.styles.borderRadius) || 12,
        accentColor: this.config.styles.accentColor || '#8b5cf6'
    };
    
    this.currentPosition = { ...(this.config.position || { x: 200, y: 150 }) };
    this.currentSize = { 
        width: this.config.size?.width || 1100, 
        height: this.config.size?.height || 500 
    };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.5;

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
        steps: JSON.parse(JSON.stringify(this.editableItems))
      }
    };

    const lastState = this.undoStack[this.undoStack.length - 1];
    if (lastState && JSON.stringify(lastState) === JSON.stringify(newState)) return;

    this.undoStack.push(newState as any);
    if (this.undoStack.length > 50) this.undoStack.shift();
    this.redoStack = [];
  }

  addStep() {
    this.editableItems.push({
      title: 'Nuevo Paso Estratégico',
      description: 'Define aquí la acción clave que el usuario debe realizar.',
      icon: '🚀'
    });
    this.selectedIndex = this.editableItems.length - 1;
    this.onContentChange();
  }

  removeStep(index: number, event: MouseEvent) {
    event.stopPropagation();
    this.editableItems.splice(index, 1);
    if (this.selectedIndex >= this.editableItems.length) {
      this.selectedIndex = Math.max(0, this.editableItems.length - 1);
    }
    this.onContentChange();
  }

  override apply() {
    this.applied.emit({
      ...this.config,
      content: { 
        ...this.editableContent, 
        steps: this.editableItems
      },
      styles: {
        ...this.editableStyles,
        borderRadius: this.editableStyles.borderRadius + 'px',
        left: this.currentPosition.x + 'px',
        top: this.currentPosition.y + 'px',
        width: this.currentSize.width + 'px',
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
