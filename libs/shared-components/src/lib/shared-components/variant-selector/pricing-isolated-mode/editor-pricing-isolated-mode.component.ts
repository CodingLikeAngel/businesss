import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

/**
 * Pricing Plan Item Interface for Editing
 */
export interface PricingPlanEditItem {
  name: string;
  price: string;
  featuresText: string;
  highlighted?: boolean;
  buttonText?: string;
}

/**
 * Pricing Table Isolated Mode Content
 */
export interface PricingIsolatedModeContent {
  title?: string;
  subtitle?: string;
  variant?: string;
  plans?: PricingPlanEditItem[];
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

/**
 * Pricing Table Isolated Mode Component
 */
@Component({
  selector: 'lib-editor-pricing-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🎨 MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">PRICING TABLE</span>
          </div>
          <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
        </div>

        <!-- Body -->
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
                  <label>Título de la Sección</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.title" 
                    class="premium-input" 
                    placeholder="Planes y Precios"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.subtitle" 
                    class="premium-input" 
                    placeholder="Elige el plan perfecto"
                  />
                </div>

                <div class="control-group">
                  <label>Variante</label>
                  <select [(ngModel)]="content.variant" class="premium-input">
                    <option value="default">Default</option>
                    <option value="cards">Tarjetas</option>
                    <option value="toggle">Con Toggle</option>
                    <option value="highlight">Con Highlight</option>
                  </select>
                </div>
              </div>

              <!-- STYLING SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>ESTILOS</h4>
                </div>

                <div class="control-group">
                  <label>Color de Fondo</label>
                  <input 
                    type="color" 
                    [(ngModel)]="content.backgroundColor" 
                    class="premium-input color-input"
                  />
                </div>

                <div class="control-group">
                  <label>Color de Texto</label>
                  <input 
                    type="color" 
                    [(ngModel)]="content.textColor" 
                    class="premium-input color-input"
                  />
                </div>

                <div class="control-group">
                  <label>Color de Acento</label>
                  <input 
                    type="color" 
                    [(ngModel)]="content.accentColor" 
                    class="premium-input color-input"
                  />
                </div>
              </div>

              <!-- PLANS SECTION -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">💰</span>
                  <h4>PLANES ({{ content.plans?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addPlan()">+</button>
                </div>

                <div class="plans-list">
                  <div class="plan-item-edit" *ngFor="let plan of content.plans; let i = index">
                    <div class="plan-header">
                      <span class="plan-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removePlan(i)">×</button>
                    </div>
                    
                    <div class="plan-row">
                      <div class="control-group flex-1">
                        <label>Nombre</label>
                        <input 
                          type="text" 
                          [(ngModel)]="plan.name" 
                          class="premium-input" 
                          placeholder="Plan Name"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Precio</label>
                        <input 
                          type="text" 
                          [(ngModel)]="plan.price" 
                          class="premium-input" 
                          placeholder="99€"
                        />
                      </div>
                    </div>
                    
                    <div class="control-group">
                      <label>Características (una por línea)</label>
                      <textarea 
                        [(ngModel)]="plan.featuresText" 
                        class="premium-input h-20" 
                        placeholder="Característica 1&#10;Característica 2&#10;Característica 3"
                      ></textarea>
                    </div>
                    
                    <div class="plan-row">
                      <div class="control-group flex-1">
                        <label class="flex items-center gap-2">
                          <input type="checkbox" [(ngModel)]="plan.highlighted" class="w-4 h-4" />
                          <span>Destacado</span>
                        </label>
                      </div>
                      <div class="control-group flex-1">
                        <label>Texto Botón</label>
                        <input 
                          type="text" 
                          [(ngModel)]="plan.buttonText" 
                          class="premium-input" 
                          placeholder="Elegir Plan"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Canvas Preview -->
          <div class="isolated-canvas">
            <div class="canvas-inner">
              <div 
                class="preview-pricing" 
                [style.background]="getPreviewBackground()"
                [style.color]="content.textColor || '#ffffff'"
              >
                <div class="preview-header" *ngIf="content.title || content.subtitle">
                  <h2 class="preview-title">{{ content.title || 'Planes y Precios' }}</h2>
                  <p class="preview-subtitle">{{ content.subtitle || 'Elige el plan perfecto para ti' }}</p>
                </div>
                
                <div class="preview-grid">
                  <div 
                    class="preview-plan" 
                    *ngFor="let plan of getPreviewPlans(); let idx = index"
                    [class.highlighted]="plan.highlighted"
                    [style.borderColor]="plan.highlighted ? content.accentColor : 'rgba(255,255,255,0.2)'"
                  >
                    <div class="preview-plan-name">{{ plan.name || 'Plan ' + (idx + 1) }}</div>
                    <div class="preview-plan-price">{{ plan.price || 'XX€' }}</div>
                    <ul class="preview-plan-features">
                      <li *ngFor="let f of getFeaturesList(plan)">{{ f }}</li>
                    </ul>
                    <button 
                      class="preview-plan-button"
                      [style.background]="plan.highlighted ? content.accentColor : 'rgba(255,255,255,0.2)'"
                    >
                      {{ plan.buttonText || 'Elegir Plan' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Info Dock -->
            <div class="modern-position-dock">
              <div class="dock-item">
                <span class="label">VARIANT</span>
                <span class="value text-purple-400">{{ content.variant || 'default' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">PLANES</span>
                <span class="value">{{ content.plans?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Gestiona los planes y precios de tu servicio.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editor-pricing-isolated-mode.component.scss',
})
export class EditorPricingIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() public config!: IsolatedModeConfig;
  @Output() public closed = new EventEmitter<void>();
  @Output() public applied = new EventEmitter<IsolatedModeConfig>();

  public content: PricingIsolatedModeContent = {};
  
  private defaultPlans: PricingPlanEditItem[] = [
    { name: 'Básico', price: '500€', featuresText: 'Web simple\nSEO básico\nDominio incluido', highlighted: false, buttonText: 'Elegir Plan' },
    { name: 'Pro', price: '1200€', featuresText: 'Tienda online\nSEO avanzado\nSoporte 24/7', highlighted: true, buttonText: 'Elegir Plan' },
    { name: 'Enterprise', price: 'Consultar', featuresText: 'A medida\nSoporte 24/7\nIntegraciones', highlighted: false, buttonText: 'Contactar' },
  ];

  ngOnInit() {
    const configPlans = this.config?.content?.['plans'] as PricingPlanEditItem[] | undefined;
    
    this.content = {
      title: this.config?.content?.['title'] || 'Planes y Precios',
      subtitle: this.config?.content?.['subtitle'] || 'Elige el plan perfecto para ti.',
      variant: this.config?.content?.['variant'] || 'default',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#0f172a',
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      accentColor: this.config?.content?.['accentColor'] || '#6366f1',
      plans: configPlans || this.defaultPlans,
    };

    document.addEventListener('keydown', this.handleKeydown);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.handleKeydown);
  }

  private handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.close();
    }
  };

  public close() {
    this.closed.emit();
  }

  public cancel() {
    this.closed.emit();
  }

  public onOverlayClick(e: Event) {
    this.closed.emit();
  }

  public addPlan() {
    if (!this.content.plans) {
      this.content.plans = [];
    }
    this.content.plans.push({
      name: 'Nuevo Plan',
      price: 'XX€',
      featuresText: 'Característica 1\nCaracterística 2\nCaracterística 3',
      highlighted: false,
      buttonText: 'Elegir Plan',
    });
  }

  public removePlan(index: number) {
    if (this.content.plans && index >= 0 && index < this.content.plans.length) {
      this.content.plans.splice(index, 1);
    }
  }

  public getPreviewPlans(): PricingPlanEditItem[] {
    return this.content.plans || this.defaultPlans;
  }

  public getFeaturesList(plan: PricingPlanEditItem): string[] {
    return plan.featuresText ? plan.featuresText.split('\n').filter(f => f.trim()) : ['Característica 1', 'Característica 2', 'Característica 3'];
  }

  public apply() {
    const contentObj: Record<string, any> = {
      title: this.content.title,
      subtitle: this.content.subtitle,
      variant: this.content.variant,
      backgroundColor: this.content.backgroundColor,
      textColor: this.content.textColor,
      accentColor: this.content.accentColor,
      plans: this.content.plans || this.defaultPlans,
    };

    this.applied.emit({
      ...this.config,
      content: contentObj,
      metadata: {
        createdAt: this.config?.metadata?.createdAt || Date.now(),
        modifiedAt: Date.now(),
        modifiedBy: this.config?.metadata?.modifiedBy,
      },
    });
  }

  public getPreviewBackground(): string {
    return this.content.backgroundColor || '#0f172a';
  }
}
