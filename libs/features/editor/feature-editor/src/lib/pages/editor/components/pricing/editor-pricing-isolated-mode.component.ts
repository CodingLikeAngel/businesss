import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';

@Component({
  selector: 'lib-editor-pricing-isolated-mode',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">💎 PRICING EDITOR</span>
            <span class="separator">/</span>
            <span class="component-name">PLANES & TARIFAS GOLD</span>
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
                <button [class.active]="activeTab === 'config'" (click)="activeTab = 'config'">ESTILO</button>
                <button [class.active]="activeTab === 'plans'" (click)="activeTab = 'plans'">PLANES</button>
            </div>

            <div class="sidebar-scroll-content">
              
              <!-- CONFIG TAB -->
              <div class="sidebar-section" *ngIf="activeTab === 'config'">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>CONCEPTO & ESTILO</h4>
                </div>
                
                <div class="control-group">
                  <label>Título de la Sección</label>
                  <input type="text" [(ngModel)]="editableContent.title" (ngModelChange)="onContentChange()" class="premium-input">
                </div>

                <div class="control-group">
                  <label>Subtítulo / Promo</label>
                  <textarea [(ngModel)]="editableContent.subtitle" (ngModelChange)="onContentChange()" class="premium-textarea"></textarea>
                </div>

                <div class="control-row grid grid-cols-2 gap-4 mt-4">
                  <div class="control-group">
                    <label>Moneda</label>
                    <input type="text" [(ngModel)]="editableContent.currency" (ngModelChange)="onContentChange()" class="premium-input text-center">
                  </div>
                  <div class="control-group">
                    <label>Color Acento</label>
                    <div class="color-input-wrapper">
                        <div class="color-preview" [style.background-color]="editableContent.accentColor">
                            <input type="color" [(ngModel)]="editableContent.accentColor" (ngModelChange)="onContentChange()">
                        </div>
                        <input type="text" [(ngModel)]="editableContent.accentColor" (ngModelChange)="onContentChange()" class="premium-input hex-input">
                    </div>
                  </div>
                </div>

                <div class="control-group mt-6">
                  <label>Ajuste de Canvas (Height)</label>
                  <input type="number" [(ngModel)]="currentSize.height" (ngModelChange)="onSizeChange()" class="premium-input">
                </div>
              </div>

              <!-- PLANS TAB -->
              <div class="sidebar-section" *ngIf="activeTab === 'plans'">
                <div class="section-header">
                  <span class="section-icon">💰</span>
                  <h4>PLANES ACTIVOS</h4>
                  <button class="add-btn-mini" (click)="addPlan()">+</button>
                </div>
                
                <div class="items-list-premium">
                  <div *ngFor="let plan of editablePlans; let i = index" 
                       class="item-card" 
                       [class.active]="selectedPlanIndex === i" 
                       (click)="selectedPlanIndex = i">
                    <div class="item-visual" [style.background-color]="plan.highlighted ? editableContent.accentColor : 'rgba(255,255,255,0.05)'">
                        <span class="text-[10px] font-bold">{{ plan.price }}</span>
                    </div>
                    <div class="item-info">
                      <span class="item-title">{{ plan.name || 'Sin Nombre' }}</span>
                      <span class="item-meta">{{ plan.highlighted ? 'RECOMENDADO' : 'Estándar' }}</span>
                    </div>
                    <button class="delete-btn" (click)="removePlan(i, $event)">✕</button>
                  </div>
                </div>

                <!-- PLAN EDITOR -->
                <div class="detail-editor-card mt-6 animate-fade-in" *ngIf="selectedPlanIndex !== -1">
                  <div class="section-header">
                    <span class="section-icon">✏️</span>
                    <h4>EDITAR PLAN #{{ selectedPlanIndex + 1 }}</h4>
                  </div>

                  <div class="control-group">
                    <label>Nombre del Plan</label>
                    <input type="text" [(ngModel)]="editablePlans[selectedPlanIndex].name" (ngModelChange)="onContentChange()" class="premium-input">
                  </div>

                  <div class="control-row grid grid-cols-2 gap-2">
                    <div class="control-group">
                        <label>Precio</label>
                        <input type="text" [(ngModel)]="editablePlans[selectedPlanIndex].price" (ngModelChange)="onContentChange()" class="premium-input">
                    </div>
                    <div class="control-group">
                        <label>Periodo</label>
                        <input type="text" [(ngModel)]="editablePlans[selectedPlanIndex].period" (ngModelChange)="onContentChange()" class="premium-input" placeholder="/mes">
                    </div>
                  </div>

                  <div class="control-group">
                    <label>Características (Líneas)</label>
                    <textarea [(ngModel)]="editablePlans[selectedPlanIndex].featuresText" (ngModelChange)="onContentChange()" class="premium-textarea h-32" placeholder="Acceso Premium&#10;Soporte 24/7..."></textarea>
                  </div>

                  <div class="checkbox-control mt-4" (click)="editablePlans[selectedPlanIndex].highlighted = !editablePlans[selectedPlanIndex].highlighted; onContentChange()">
                    <div class="custom-checkbox" [class.checked]="editablePlans[selectedPlanIndex].highlighted"></div>
                    <span>Destacar este Plan</span>
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
                  
                  <div class="preview-header-branded" *ngIf="editableContent.title">
                      <h2 class="premium-title">{{ editableContent.title }}</h2>
                      <p class="premium-subtitle">{{ editableContent.subtitle }}</p>
                  </div>

                  <div class="pricing-render-grid">
                    <div *ngFor="let plan of editablePlans; let i = index" 
                         class="plan-render-wrapper"
                         [class.is-highlighted]="plan.highlighted"
                         [class.is-editing]="selectedPlanIndex === i"
                         (click)="selectedPlanIndex = i; $event.stopPropagation()">
                      
                      <div class="plan-card-renderer" [style.border-top-color]="plan.highlighted ? editableContent.accentColor : 'rgba(255,255,255,0.05)'">
                         <div class="plan-badge" *ngIf="plan.highlighted" [style.background]="editableContent.accentColor">RECOMENDADO</div>
                         <h3 class="plan-name">{{ plan.name }}</h3>
                         <div class="plan-price">
                            <span class="currency">{{ editableContent.currency }}</span>
                            <span class="amount">{{ plan.price }}</span>
                            <span class="period">{{ plan.period }}</span>
                         </div>
                         
                         <ul class="plan-features">
                            <li *ngFor="let feat of getPlanFeatures(plan)">
                                <span class="check-icon" [style.color]="editableContent.accentColor">✓</span>
                                {{ feat }}
                            </li>
                         </ul>

                         <button class="plan-cta" [style.background]="plan.highlighted ? editableContent.accentColor : 'rgba(255,255,255,0.08)'">
                            {{ plan.buttonText || 'Elegir Plan' }}
                         </button>
                      </div>

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
              <div class="dock-item"><span class="label">ACCENT</span><div class="color-dot" [style.background]="editableContent.accentColor"></div><span class="value uppercase">{{ editableContent.accentColor }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">CURRENCY</span><span class="value">{{ editableContent.currency }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">TOTAL</span><span class="value">{{ editablePlans.length }} Planes</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Pricing Pro: El 80% de los usuarios eligen el plan destacado. Úsalo con estrategia.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Tarifas</button>
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

    .canvas-inner { width: 6000px; height: 6000px; position: relative; padding: 200px;
      &.show-grid { background-image: radial-gradient(rgba(255, 255, 255, 0.04) 1.5px, transparent 1.5px); background-size: 60px 60px; }
      &.grid-snapping { background-image: radial-gradient(rgba(251, 191, 36, 0.2) 2px, transparent 2px); background-size: 60px 60px; }
    }

    .sidebar-tabs { display: flex; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .sidebar-tabs button { flex: 1; padding: 1rem; background: transparent; border: none; color: #64748b; font-size: 10px; font-weight: 900; letter-spacing: 1px; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.3s; }
    .sidebar-tabs button.active { color: #fbbf24; border-bottom-color: #fbbf24; background: rgba(251, 191, 36, 0.05); }

    .draggable-wrapper { position: absolute !important; cursor: move; z-index: 100; outline: 4px solid transparent; outline-offset: 8px; background: rgba(15, 23, 42, 0.4); padding: 50px; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.6); border-radius: 4px;
      &:hover { outline-color: rgba(251, 191, 36, 0.3); }
      &.is-dragging, &.is-resizing { outline-color: #fbbf24; outline-width: 5px; }
    }

    .preview-header-branded { text-align: center; margin-bottom: 60px; }
    .premium-title { font-size: 56px; font-weight: 900; color: white; margin-bottom: 10px; letter-spacing: -2px; }
    .premium-subtitle { font-size: 20px; color: #94a3b8; max-width: 800px; margin: 0 auto; line-height: 1.5; }

    .pricing-render-grid { display: flex; gap: 30px; width: 100%; justify-content: center; align-items: flex-end; }
    .plan-render-wrapper { position: relative; flex: 1; max-width: 350px; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      &.is-editing { transform: scale(1.05) translateY(-5px); z-index: 10; .plan-card-renderer { border-color: #fbbf24; box-shadow: 0 30px 60px rgba(0,0,0,0.4); } }
    }

    .plan-card-renderer { background: #1e293b; border-radius: 32px; padding: 3rem 2rem; border-top: 5px solid transparent; position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; height: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
    .plan-badge { position: absolute; top: -15px; color: #020617; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 900; }
    .plan-name { font-size: 20px; font-weight: 900; color: #f8fafc; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.1em; }
    .plan-price { display: flex; align-items: baseline; gap: 4px; color: white; margin-bottom: 2rem; }
    .plan-price .amount { font-size: 54px; font-weight: 900; }
    .plan-price .currency { font-size: 20px; font-weight: 700; }
    .plan-price .period { font-size: 14px; color: #64748b; }
    .plan-features { list-style: none; padding: 0; margin: 0 0 2rem 0; width: 100%; display: flex; flex-direction: column; gap: 0.8rem; }
    .plan-features li { display: flex; align-items: center; gap: 10px; color: #94a3b8; font-size: 14px; text-align: left; }
    .plan-cta { width: 100%; padding: 1rem; border-radius: 16px; border: none; color: white; font-weight: 900; font-size: 14px; margin-top: auto; cursor: pointer; }

    .item-id-badge { position: absolute; top: -12px; left: -12px; background: #fbbf24; color: #020617; font-size: 11px; font-weight: 900; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 20; }

    .items-list-premium { display: flex; flex-direction: column; gap: 8px; }
    .item-card { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; cursor: pointer;
       &.active { border-color: #fbbf24; background: rgba(251, 191, 36, 0.08); }
    }
    .item-visual { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; }
    .item-info { flex: 1; .item-title { display: block; color: white; font-size: 12px; font-weight: 700; } .item-meta { font-size: 9px; color: #64748b; } }
    .delete-btn { background: transparent; border: none; color: #ef444455; cursor: pointer; padding: 4px; &:hover { color: #ef4444; } }

    .checkbox-control { display: flex; align-items: center; gap: 10px; cursor: pointer;
      span { font-size: 11px; color: #94a3b8; font-weight: 800; text-transform: uppercase; }
    }
    .custom-checkbox { width: 20px; height: 20px; border: 2px solid rgba(255, 255, 255, 0.15); border-radius: 6px; position: relative; transition: all 0.2s;
      &.checked { background: #fbbf24; border-color: #fbbf24; }
      &.checked::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #020617; font-size: 12px; font-weight: 900; }
    }

    .detail-editor-card { background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(251, 191, 36, 0.2); border-radius: 20px; padding: 1.5rem; }
    .add-btn-mini { background: #fbbf24; color: #020617; border: none; padding: 2px 10px; border-radius: 6px; font-weight: 900; cursor: pointer; margin-left: auto; }

    .premium-input, .premium-select { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.7rem 0.9rem; border-radius: 12px; font-size: 13px; }
    .premium-textarea { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.7rem 0.9rem; border-radius: 12px; font-size: 12px; height: 80px; resize: none; }
    .color-input-wrapper { display: flex; gap: 10px; align-items: center; .color-preview { width: 40px; height: 40px; border-radius: 10px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); input { position: absolute; inset: -5px; width: 150%; height: 150%; cursor: pointer; opacity: 0; } } .hex-input { font-family: monospace; } }

    .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class EditorPricingIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;
  activeTab: 'config' | 'plans' = 'config';
  selectedPlanIndex = -1;
  editablePlans: any[] = [];

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = { 
        ...this.config.content,
        title: this.config.content.title || 'Planes Detallados',
        subtitle: this.config.content.subtitle || 'Transparencia total para que elijas con confianza.',
        currency: this.config.content.currency || '€',
        accentColor: this.config.content.accentColor || '#fbbf24',
        variant: this.config.content.variant || 'default'
    };
    this.editablePlans = JSON.parse(JSON.stringify(this.config.content.plans || this.config.content.items || []));
    this.editableStyles = { ...this.config.styles };
    
    this.currentPosition = { ...(this.config.position || { x: 50, y: 50 }) };
    this.currentSize = { 
        width: parseInt(this.config.styles?.width) || 1100, 
        height: parseInt(this.config.styles?.height) || 800 
    };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.4;

    if (this.editablePlans.length > 0) this.selectedPlanIndex = 0;

    this.saveState();
  }

  override onContentChange() {
    this.scheduleSaveState();
  }

  addPlan() {
    this.editablePlans.push({
      name: 'Plan Nuevo',
      price: '99',
      period: '/mes',
      featuresText: 'Característica 1\nCaracterística 2\nSoporte VIP',
      highlighted: false,
      buttonText: 'Empezar ya'
    });
    this.selectedPlanIndex = this.editablePlans.length - 1;
    this.onContentChange();
  }

  removePlan(index: number, e: MouseEvent) {
    e.stopPropagation();
    this.editablePlans.splice(index, 1);
    if (this.selectedPlanIndex >= this.editablePlans.length) {
      this.selectedPlanIndex = Math.max(-1, this.editablePlans.length - 1);
    }
    this.onContentChange();
  }

  getPlanFeatures(plan: any): string[] {
    if (!plan.featuresText) return [];
    return plan.featuresText.split('\n').filter((f: any) => f.trim() !== '');
  }

  override apply() {
    this.applied.emit({
      ...this.config,
      content: { 
        ...this.editableContent,
        plans: this.editablePlans,
        items: this.editablePlans // Backward compat
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

  onCanvasMouseDown(event: MouseEvent) { }
  onOverlayClick(event: MouseEvent) { this.cancel(); }
}
