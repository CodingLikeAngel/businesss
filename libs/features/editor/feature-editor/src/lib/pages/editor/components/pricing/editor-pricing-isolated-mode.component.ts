import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/state/app.state';
import { selectCurrentPageGlobalStyles } from '../../../../store/selectors/page.selectors';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';
export { IsolatedModeConfig };

export interface UndoRedoState {
  plans: any[];
  content: any;
  styles: any;
}

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
        
        <!-- Header -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">💎 PREMIUM PRICING</span>
            <span class="separator">/</span>
            <span class="component-name">PLANES Y TARIFAS</span>
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
            
            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <div class="isolated-mode-body">
          <!-- Sidebar Controls -->
          <div class="controls-sidebar">
            <div class="sidebar-scroll-content">
              
              <!-- SECCIÓN: CABECERA -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📜</span>
                  <h4>CONCEPTO DE SECCIÓN</h4>
                </div>
                
                <div class="control-group">
                  <label>Título Principal</label>
                  <input type="text" [(ngModel)]="editableContent.title" (ngModelChange)="onPartialChange()" class="premium-input">
                </div>

                <div class="control-group">
                  <label>Subtítulo Explicativo</label>
                  <textarea [(ngModel)]="editableContent.subtitle" (ngModelChange)="onPartialChange()" class="premium-input h-20"></textarea>
                </div>
              </div>

              <!-- SECCIÓN: CONFIGURACIÓN GLOBAL -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">⚙️</span>
                  <h4>AJUSTES GLOBALES</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante Visual</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onPartialChange()" class="premium-input">
                    <option value="default">Estándar</option>
                    <option value="glass">Glassmorphism</option>
                    <option value="modern">Modern Suite</option>
                    <option value="minimal">Minimal Dark</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Moneda / Símbolo</label>
                  <input type="text" [(ngModel)]="editableContent.currency" (ngModelChange)="onPartialChange()" class="premium-input" placeholder="€">
                </div>

                <div class="control-group">
                  <label>Color de Acento (Highlight)</label>
                  <div class="flex gap-2">
                    <input type="color" [(ngModel)]="editableContent.accentColor" (ngModelChange)="onPartialChange()" class="color-picker-premium">
                    <input type="text" [(ngModel)]="editableContent.accentColor" (ngModelChange)="onPartialChange()" class="premium-input-small">
                  </div>
                </div>
              </div>

              <!-- SECCIÓN: LISTADO DE PLANES -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">💰</span>
                  <h4>PLANES ACTIVOS ({{ editablePlans.length }})</h4>
                  <button class="premium-add-btn" (click)="addPlan()">+ Nuevo</button>
                </div>
                
                <div class="items-list-premium">
                  <div *ngFor="let plan of editablePlans; let i = index" 
                       class="item-card" 
                       [class.active]="selectedPlanIndex === i" 
                       (click)="selectPlan(i)">
                    <div class="item-visual plan" [style.border-color]="plan.highlighted ? editableContent.accentColor : 'transparent'">
                      <span class="text-xs font-bold">{{ plan.price }}</span>
                    </div>
                    <div class="item-info">
                      <span class="item-title">{{ plan.name || 'Sin Nombre' }}</span>
                      <span class="item-meta">{{ plan.highlighted ? '🔥 DESTACADO' : 'Plan Estándar' }}</span>
                    </div>
                    <div class="item-actions">
                      <button class="delete-icon-btn" (click)="removePlan(i, $event)">✕</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- SECCIÓN: EDITOR DE PLAN SELECCIONADO -->
              <div class="sidebar-section no-border" *ngIf="selectedPlanIndex !== -1">
                <div class="premium-editor-box">
                  <div class="section-header">
                    <span class="section-icon">✏️</span>
                    <h4>EDITAR PLAN: {{ editablePlans[selectedPlanIndex].name }}</h4>
                  </div>

                  <div class="control-group">
                    <label>Nombre del Plan</label>
                    <input type="text" [(ngModel)]="editablePlans[selectedPlanIndex].name" (ngModelChange)="onPartialChange()" class="premium-input">
                  </div>

                  <div class="control-group">
                    <label>Precio / Valor</label>
                    <input type="text" [(ngModel)]="editablePlans[selectedPlanIndex].price" (ngModelChange)="onPartialChange()" class="premium-input">
                  </div>

                  <div class="control-group">
                    <label>Período (ej: /mes, /año)</label>
                    <input type="text" [(ngModel)]="editablePlans[selectedPlanIndex].period" (ngModelChange)="onPartialChange()" class="premium-input">
                  </div>

                  <div class="control-group">
                    <label>Características (Una por línea)</label>
                    <textarea [(ngModel)]="editablePlans[selectedPlanIndex].featuresText" (ngModelChange)="onPartialChange()" class="premium-input h-32" placeholder="Característica 1&#10;Característica 2..."></textarea>
                  </div>

                  <div class="control-group">
                    <label class="premium-checkbox-label">
                      <input type="checkbox" [(ngModel)]="editablePlans[selectedPlanIndex].highlighted" (ngModelChange)="onPartialChange()">
                      <span>Destacar este plan</span>
                    </label>
                  </div>

                  <div class="control-group">
                    <label>Texto del Botón</label>
                    <input type="text" [(ngModel)]="editablePlans[selectedPlanIndex].buttonText" (ngModelChange)="onPartialChange()" class="premium-input">
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Canvas Area -->
          <div class="isolated-canvas pricing-ambient">
            <div class="canvas-inner">
               <div class="pricing-preview-container">
                  <div class="preview-header-branded" *ngIf="editableContent.title">
                     <h2 class="premium-title">{{ editableContent.title }}</h2>
                     <p class="premium-subtitle">{{ editableContent.subtitle }}</p>
                  </div>

                  <div class="pricing-render-grid">
                    <div *ngFor="let plan of editablePlans; let i = index" 
                         class="plan-render-wrapper"
                         [class.is-highlighted]="plan.highlighted"
                         [class.is-editing]="selectedPlanIndex === i"
                         (click)="selectPlan(i)">
                      
                      <div class="plan-card-renderer" [style.border-top-color]="plan.highlighted ? editableContent.accentColor : 'transparent'">
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

                         <button class="plan-cta" [style.background]="plan.highlighted ? editableContent.accentColor : 'rgba(255,255,255,0.05)'">
                            {{ plan.buttonText || 'Elegir Plan' }}
                         </button>
                      </div>

                      <div class="item-id-badge">#{{ i + 1 }}</div>
                    </div>
                  </div>
               </div>
            </div>

            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">ACCENT</span><div class="color-dot" [style.background]="editableContent.accentColor"></div><span class="value uppercase">{{ editableContent.accentColor }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">CURRENCY</span><span class="value">{{ editableContent.currency }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">TRANSFORM</span><span class="value">SCALE(1.0)</span></div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Consejo: Destaca el plan que ofrezca la mejor relación calidad-precio para aumentar conversiones.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Tabla de Precios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .isolated-mode-overlay {
      position: fixed; inset: 0 !important; background: rgba(2, 6, 23, 0.97); backdrop-filter: blur(16px);
      z-index: 9999999 !important; display: flex; align-items: center; justify-content: center; padding: 1.5vh 1.5vw;
    }

    .isolated-mode-container {
      background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 28px;
      width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden;
      box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 1);
      animation: premium-zoom-in 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes premium-zoom-in {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }

    .isolated-mode-header {
      height: 72px; padding: 0 1.8rem; background: #1e293b; border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex; align-items: center; justify-content: space-between;
    }

    .mode-badge { font-size: 10px; font-weight: 900; color: #fbbf24; background: rgba(251, 191, 36, 0.1); padding: 6px 12px; border-radius: 9px; border: 1px solid rgba(251, 191, 36, 0.2); }
    .component-name { color: #f8fafc; font-size: 15px; font-weight: 800; margin-left: 12px; }
    .header-actions { display: flex; align-items: center; gap: 1.2rem; }

    .icon-btn {
      width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
      background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08);
      color: #94a3b8; border-radius: 12px; cursor: pointer; transition: all 0.25s;
    }
    .icon-btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.1); color: white; border-color: #fbbf24; }
    .icon-btn:disabled { opacity: 0.15; cursor: not-allowed; }

    .close-main-btn {
      width: 40px; height: 40px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);
      color: #ef4444; border-radius: 12px; cursor: pointer; transition: all 0.2s;
    }
    .close-main-btn:hover { background: #ef4444; color: white; }

    .isolated-mode-body {
      flex: 1;
      display: flex;
      flex-direction: row; /* Standardized layout */
      overflow: hidden;
    }

    .controls-sidebar {
      width: 380px;
      min-width: 380px;
      flex-shrink: 0;
      background: #020617;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      overflow-y: auto;
    }

    .sidebar-scroll-content { padding: 2rem; }
    .sidebar-section { margin-bottom: 2.5rem; padding-bottom: 1.8rem; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
    .sidebar-section.no-border { border-bottom: none; }
    .section-header { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1.5rem; }
    .section-header h4 { margin: 0; font-size: 12px; color: #64748b; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; }

    .control-group { margin-bottom: 1.5rem; }
    .control-group label { display: block; font-size: 11px; color: #94a3b8; margin-bottom: 0.8rem; font-weight: 800; }

    .premium-input {
      width: 100%; background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.1);
      color: white; padding: 0.85rem 1.1rem; border-radius: 16px; font-size: 14px; transition: all 0.3s;
    }
    .premium-input:focus { border-color: #fbbf24; background: rgba(15, 23, 42, 1); outline: none; box-shadow: 0 0 20px rgba(251, 191, 36, 0.1); }

    .premium-input-small { width: 80px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); color: white; padding: 0.5rem; border-radius: 10px; font-size: 11px; }
    .color-picker-premium { width: 44px; height: 36px; border: none; border-radius: 10px; cursor: pointer; background: transparent; }

    .premium-add-btn {
      background: #fbbf24; color: #0f172a; border: none; padding: 6px 14px; border-radius: 10px;
      font-size: 12px; font-weight: 900; cursor: pointer; box-shadow: 0 4px 10px rgba(251, 191, 36, 0.3);
    }

    .items-list-premium { display: flex; flex-direction: column; gap: 14px; }
    .item-card {
      display: flex; align-items: center; gap: 16px; padding: 14px;
      background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 18px;
      cursor: pointer; transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
    }
    .item-card:hover { background: rgba(30, 41, 59, 0.8); border-color: rgba(251, 191, 36, 0.3); transform: translateX(8px); }
    .item-card.active { background: rgba(251, 191, 36, 0.08); border-color: #fbbf24; }

    .item-visual.plan {
      width: 48px; height: 48px; background: #0f172a; border-radius: 14px; border: 2px solid transparent;
      display: flex; align-items: center; justify-content: center; color: white; overflow: hidden;
    }

    .item-info { flex: 1; overflow: hidden; }
    .item-title { display: block; color: white; font-size: 14px; font-weight: 800; }
    .item-meta { font-size: 11px; color: #64748b; font-weight: 700; }

    .premium-editor-box {
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.03) 0%, rgba(245, 158, 11, 0.03) 100%);
      border: 1px solid rgba(251, 191, 36, 0.15); border-radius: 22px; padding: 1.6rem;
    }
    
    .premium-checkbox-label { display: flex; align-items: center; gap: 10px; cursor: pointer; color: white !important; }

    .isolated-canvas {
      flex: 1; background: #020617; position: relative; overflow: hidden;
      background-image: radial-gradient(rgba(251, 191, 36, 0.03) 1px, transparent 1px); background-size: 60px 60px;
    }

    .canvas-inner { width: 100%; height: 100%; overflow-y: auto; padding: 80px 40px; display: flex; flex-direction: column; align-items: center; }
    
    .preview-header-branded { text-align: center; margin-bottom: 70px; max-width: 800px; }
    .premium-title { color: white; font-size: 52px; font-weight: 900; margin-bottom: 1.4rem; letter-spacing: -0.01em; }
    .premium-subtitle { color: #94a3b8; font-size: 22px; line-height: 1.6; font-weight: 500; }

    .pricing-render-grid { display: flex; gap: 30px; width: 100%; max-width: 1100px; justify-content: center; align-items: flex-end; }
    .plan-render-wrapper { position: relative; flex: 1; max-width: 350px; border-radius: 28px; border: 2px solid transparent; transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1); cursor: pointer; }
    .plan-render-wrapper.is-editing { border-color: #fbbf24; transform: scale(1.06) translateY(-10px); z-index: 10; filter: drop-shadow(0 30px 60px rgba(0, 0, 0, 0.6)); }
    .plan-render-wrapper.is-highlighted:not(.is-editing) { border-color: rgba(251, 191, 36, 0.1); }
    
    .plan-card-renderer {
      background: #1e293b; border-radius: 28px; padding: 3rem 2rem; border-top: 4px solid transparent; 
      position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; height: 100%;
    }
    
    .plan-badge { position: absolute; top: -15px; background: #fbbf24; color: #0f172a; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 900; box-shadow: 0 10px 20px rgba(251, 191, 36, 0.3); }
    .plan-name { font-size: 20px; font-weight: 900; color: #f8fafc; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
    .plan-price { display: flex; align-items: baseline; gap: 4px; margin-bottom: 2rem; color: white; }
    .plan-price .currency { font-size: 24px; font-weight: 600; }
    .plan-price .amount { font-size: 56px; font-weight: 900; }
    .plan-price .period { font-size: 16px; color: #64748b; font-weight: 600; }
    
    .plan-features { list-style: none; padding: 0; margin: 0 0 2.5rem 0; width: 100%; display: flex; flex-direction: column; gap: 1rem; }
    .plan-features li { display: flex; align-items: center; gap: 10px; color: #cbd5e1; font-size: 14px; font-weight: 600; text-align: left; }
    .check-icon { font-weight: 900; }
    
    .plan-cta { width: 100%; padding: 1rem; border-radius: 16px; border: none; color: white; font-weight: 900; font-size: 15px; margin-top: auto; cursor: pointer; }
    
    .item-id-badge { position: absolute; top: -15px; left: -15px; background: #fbbf24; color: #0f172a; font-size: 12px; font-weight: 900; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 20; }

    .modern-position-dock { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.96); backdrop-filter: blur(12px); padding: 0.85rem 2rem; border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.1); display: flex; gap: 2rem; color: white; font-size: 13px; box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5); }
    .dock-divider { width: 1px; background: rgba(255, 255, 255, 0.1); }
    .dock-item { display: flex; align-items: center; gap: 0.8rem; }
    .dock-item .label { color: #64748b; font-weight: 900; text-transform: uppercase; font-size: 11px; }
    .color-dot { width: 14px; height: 14px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2); }

    .isolated-mode-footer { height: 80px; padding: 0 3rem; background: #1e293b; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.1); }
    .footer-hint { font-size: 13px; color: #94a3b8; font-weight: 600; }
    .btn-clean { padding: 0.8rem 2.2rem; border-radius: 16px; font-weight: 900; cursor: pointer; border: none; font-size: 14px; transition: all 0.25s; }
    .btn-clean.primary { background: #fbbf24; color: #0f172a; box-shadow: 0 5px 20px rgba(251, 191, 36, 0.3); }
    .btn-clean.secondary { background: transparent; color: #94a3b8; }
    .btn-clean.secondary:hover { color: white; background: rgba(255, 255, 255, 0.05); }
  `]
})
export class EditorPricingIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() config!: IsolatedModeConfig;
  @Output() closed = new EventEmitter<void>();
  @Output() applied = new EventEmitter<IsolatedModeConfig>();

  private store = inject(Store<AppState>);

  // State
  editablePlans: any[] = [];
  editableContent: any = {};
  selectedPlanIndex = -1;
  
  // Undo/Redo
  undoStack: UndoRedoState[] = [];
  redoStack: UndoRedoState[] = [];

  private saveTimeout: any;

  get canUndo() { return this.undoStack.length > 1; }
  get canRedo() { return this.redoStack.length > 0; }

  ngOnInit() {
    this.initializeState();
  }

  private initializeState() {
    this.editablePlans = JSON.parse(JSON.stringify(this.config.content.plans || this.config.content.items || []));
    this.editableContent = {
      title: this.config.content.title || 'Planes de Inversión',
      subtitle: this.config.content.subtitle || 'Elige la opción que mejor se adapte a tus necesidades.',
      variant: this.config.content.variant || 'default',
      accentColor: this.config.content.accentColor || '#fbbf24',
      currency: this.config.content.currency || '€'
    };

    if (this.editablePlans.length > 0) {
      this.selectedPlanIndex = 0;
    }

    this.saveState();
  }

  ngOnDestroy() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
  }

  // --- ACTIONS ---
  saveState() {
    const state: UndoRedoState = {
      plans: JSON.parse(JSON.stringify(this.editablePlans)),
      content: { ...this.editableContent },
      styles: { ...this.config.styles }
    };
    this.undoStack.push(state);
    this.redoStack = [];
    if (this.undoStack.length > 50) this.undoStack.shift();
  }

  undo() {
    if (this.undoStack.length > 1) {
      this.redoStack.push(this.undoStack.pop()!);
      this.restoreState(this.undoStack[this.undoStack.length - 1]);
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop()!;
      this.undoStack.push(state);
      this.restoreState(state);
    }
  }

  private restoreState(state: UndoRedoState) {
    this.editablePlans = JSON.parse(JSON.stringify(state.plans));
    this.editableContent = { ...state.content };
  }

  onPartialChange() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => this.saveState(), 800);
  }

  selectPlan(index: number) { this.selectedPlanIndex = index; }

  addPlan() {
    this.editablePlans.push({
      name: 'Nuevo Plan',
      price: '99',
      period: '/mes',
      featuresText: 'Característica A\nCaracterística B\nSoporte Premium',
      highlighted: false,
      buttonText: 'Empezar ahora'
    });
    this.selectedPlanIndex = this.editablePlans.length - 1;
    this.saveState();
  }

  removePlan(index: number, e: MouseEvent) {
    e.stopPropagation();
    this.editablePlans.splice(index, 1);
    if (this.selectedPlanIndex >= this.editablePlans.length) {
      this.selectedPlanIndex = this.editablePlans.length - 1;
    }
    this.saveState();
  }

  getPlanFeatures(plan: any): string[] {
    if (!plan.featuresText) return [];
    return plan.featuresText.split('\n').filter((f: string) => f.trim() !== '');
  }

  onOverlayClick(event: MouseEvent) { this.closed.emit(); }
  close() { this.closed.emit(); }
  cancel() { this.closed.emit(); }

  apply() {
    const config: IsolatedModeConfig = {
      ...this.config,
      content: { 
        ...this.config.content,
        ...this.editableContent,
        plans: this.editablePlans,
        items: this.editablePlans // Sync legacy
      }
    };
    this.applied.emit(config);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') this.close();
    if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
      event.preventDefault();
      this.undo();
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
      event.preventDefault();
      this.redo();
    }
  }
}
