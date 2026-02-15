import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';
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
 * Pricing Table Isolated Mode Component
 * 
 * Extends BaseIsolatedModeComponent to provide:
 * - Undo/Redo functionality
 * - Drag & Resize capabilities
 * - Grid snapping
 * - Keyboard shortcuts
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
          <div class="header-actions">
            <button class="action-btn" (click)="undo()" [disabled]="!canUndo" title="Deshacer (Ctrl+Z)">↶</button>
            <button class="action-btn" (click)="redo()" [disabled]="!canRedo" title="Rehacer (Ctrl+Y)">↷</button>
            <button class="action-btn" (click)="toggleGrid()" [class.active]="showGrid" title="Toggle Grid (G)">⊞</button>
            <button class="action-btn" (click)="toggleSnap()" [class.active]="snapToGrid" title="Snap to Grid (S)">⬡</button>
            <button class="action-btn" (click)="resetPosition()" title="Reset Position (R)">⟲</button>
            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
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
                    [(ngModel)]="editableContent.title" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="Planes y Precios"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.subtitle" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="Elige el plan perfecto"
                  />
                </div>

                <div class="control-group">
                  <label>Variante</label>
                  <select 
                    [(ngModel)]="editableContent.variant" 
                    (ngModelChange)="onVariantChange()"
                    class="premium-input"
                  >
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
                    [(ngModel)]="editableContent.backgroundColor" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input color-input"
                  />
                </div>

                <div class="control-group">
                  <label>Color de Texto</label>
                  <input 
                    type="color" 
                    [(ngModel)]="editableContent.textColor" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input color-input"
                  />
                </div>

                <div class="control-group">
                  <label>Color de Acento</label>
                  <input 
                    type="color" 
                    [(ngModel)]="editableContent.accentColor" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input color-input"
                  />
                </div>
              </div>

              <!-- PLANS SECTION -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">💰</span>
                  <h4>PLANES ({{ editableContent.plans?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addPlan()">+</button>
                </div>

                <div class="plans-list">
                  <div class="plan-item-edit" *ngFor="let plan of editableContent.plans; let i = index">
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
                          (ngModelChange)="onContentChange()"
                          class="premium-input" 
                          placeholder="Plan Name"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Precio</label>
                        <input 
                          type="text" 
                          [(ngModel)]="plan.price" 
                          (ngModelChange)="onContentChange()"
                          class="premium-input" 
                          placeholder="99€"
                        />
                      </div>
                    </div>
                    
                    <div class="control-group">
                      <label>Características (una por línea)</label>
                      <textarea 
                        [(ngModel)]="plan.featuresText" 
                        (ngModelChange)="onContentChange()"
                        class="premium-input h-20" 
                        placeholder="Característica 1&#10;Característica 2&#10;Característica 3"
                      ></textarea>
                    </div>
                    
                    <div class="plan-row">
                      <div class="control-group flex-1">
                        <label class="flex items-center gap-2">
                          <input type="checkbox" [(ngModel)]="plan.highlighted" (ngModelChange)="onContentChange()" class="w-4 h-4" />
                          <span>Destacado</span>
                        </label>
                      </div>
                      <div class="control-group flex-1">
                        <label>Texto Botón</label>
                        <input 
                          type="text" 
                          [(ngModel)]="plan.buttonText" 
                          (ngModelChange)="onContentChange()"
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
          <div class="isolated-canvas" #canvasElement [class.show-grid]="showGrid">
            <div class="canvas-inner">
              <!-- Draggable Wrapper -->
              <div 
                class="draggable-wrapper"
                [style.left.px]="currentPosition.x"
                [style.top.px]="currentPosition.y"
                [style.width.px]="currentSize.width"
                [style.height.px]="currentSize.height"
                (mousedown)="onMouseDown($event)"
              >
                <div 
                  class="preview-pricing" 
                  [style.background]="getPreviewBackground()"
                  [style.color]="editableContent.textColor || '#ffffff'"
                >
                  <div class="preview-header" *ngIf="editableContent.title || editableContent.subtitle">
                    <h2 class="preview-title">{{ editableContent.title || 'Planes y Precios' }}</h2>
                    <p class="preview-subtitle">{{ editableContent.subtitle || 'Elige el plan perfecto para ti' }}</p>
                  </div>
                  
                  <div class="preview-grid">
                    <div 
                      class="preview-plan" 
                      *ngFor="let plan of getPreviewPlans(); let idx = index"
                      [class.highlighted]="plan.highlighted"
                      [style.borderColor]="plan.highlighted ? editableContent.accentColor : 'rgba(255,255,255,0.2)'"
                    >
                      <div class="preview-plan-name">{{ plan.name || 'Plan ' + (idx + 1) }}</div>
                      <div class="preview-plan-price">{{ plan.price || 'XX€' }}</div>
                      <ul class="preview-plan-features">
                        <li *ngFor="let f of getFeaturesList(plan)">{{ f }}</li>
                      </ul>
                      <button 
                        class="preview-plan-button"
                        [style.background]="plan.highlighted ? editableContent.accentColor : 'rgba(255,255,255,0.2)'"
                      >
                        {{ plan.buttonText || 'Elegir Plan' }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Resize Handles -->
                <div class="resize-handle nw" (mousedown)="startResize($event, 'nw')"></div>
                <div class="resize-handle n" (mousedown)="startResize($event, 'n')"></div>
                <div class="resize-handle ne" (mousedown)="startResize($event, 'ne')"></div>
                <div class="resize-handle e" (mousedown)="startResize($event, 'e')"></div>
                <div class="resize-handle se" (mousedown)="startResize($event, 'se')"></div>
                <div class="resize-handle s" (mousedown)="startResize($event, 's')"></div>
                <div class="resize-handle sw" (mousedown)="startResize($event, 'sw')"></div>
                <div class="resize-handle w" (mousedown)="startResize($event, 'w')"></div>
              </div>
            </div>

            <!-- Info Dock -->
            <div class="modern-position-dock">
              <div class="dock-item">
                <span class="label">X</span>
                <span class="value">{{ currentPosition.x }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">Y</span>
                <span class="value">{{ currentPosition.y }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">W</span>
                <span class="value">{{ currentSize.width }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">H</span>
                <span class="value">{{ currentSize.height }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">VARIANT</span>
                <span class="value text-purple-400">{{ editableContent.variant || 'default' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">PLANES</span>
                <span class="value">{{ editableContent.plans?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">
            <span class="hint-item">G: Grid</span>
            <span class="hint-item">S: Snap</span>
            <span class="hint-item">R: Reset</span>
            <span class="hint-item">Ctrl+Z: Undo</span>
            <span class="hint-item">Ctrl+S: Save</span>
          </div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editor-pricing-isolated-mode.component.scss',
})
export class EditorPricingIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvasElement') canvasRef!: ElementRef;

  private defaultPlans: PricingPlanEditItem[] = [
    { name: 'Básico', price: '500€', featuresText: 'Web simple\nSEO básico\nDominio incluido', highlighted: false, buttonText: 'Elegir Plan' },
    { name: 'Pro', price: '1200€', featuresText: 'Tienda online\nSEO avanzado\nSoporte 24/7', highlighted: true, buttonText: 'Elegir Plan' },
    { name: 'Enterprise', price: 'Consultar', featuresText: 'A medida\nSoporte 24/7\nIntegraciones', highlighted: false, buttonText: 'Contactar' },
  ];

  protected initializeState(): void {
    const configPlans = this.config?.content?.['plans'] as PricingPlanEditItem[] | undefined;
    
    // Initialize content
    this.editableContent = {
      title: this.config?.content?.['title'] || 'Planes y Precios',
      subtitle: this.config?.content?.['subtitle'] || 'Elige el plan perfecto para ti.',
      variant: this.config?.content?.['variant'] || 'default',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#0f172a',
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      accentColor: this.config?.content?.['accentColor'] || '#6366f1',
      plans: configPlans || [...this.defaultPlans],
    };

    // Initialize styles
    this.editableStyles = this.config?.styles ? { ...this.config.styles } : {};

    // Initialize position and size
    this.currentPosition = this.config?.position || { x: 50, y: 50 };
    this.currentSize = this.config?.size || { width: 700, height: 450 };
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };

    // Save initial state
    this.saveState();
  }

  protected getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement || null;
  }

  addPlan(): void {
    if (!this.editableContent.plans) {
      this.editableContent.plans = [];
    }
    this.editableContent.plans.push({
      name: 'Nuevo Plan',
      price: 'XX€',
      featuresText: 'Característica 1\nCaracterística 2\nCaracterística 3',
      highlighted: false,
      buttonText: 'Elegir Plan',
    });
    this.saveState();
  }

  removePlan(index: number): void {
    if (this.editableContent.plans && index >= 0 && index < this.editableContent.plans.length) {
      this.editableContent.plans.splice(index, 1);
      this.saveState();
    }
  }

  getPreviewPlans(): PricingPlanEditItem[] {
    return this.editableContent.plans || this.defaultPlans;
  }

  getFeaturesList(plan: PricingPlanEditItem): string[] {
    return plan.featuresText ? plan.featuresText.split('\n').filter(f => f.trim()) : ['Característica 1', 'Característica 2', 'Característica 3'];
  }

  getPreviewBackground(): string {
    return this.editableContent.backgroundColor || '#0f172a';
  }

  override apply(): void {
    const finalConfig: IsolatedModeConfig = {
      ...this.config,
      content: {
        title: this.editableContent.title,
        subtitle: this.editableContent.subtitle,
        variant: this.editableContent.variant,
        backgroundColor: this.editableContent.backgroundColor,
        textColor: this.editableContent.textColor,
        accentColor: this.editableContent.accentColor,
        plans: this.editableContent.plans || this.defaultPlans,
      },
      styles: {
        ...this.editableStyles,
        width: this.currentSize.width + 'px',
        height: this.currentSize.height + 'px',
        position: 'absolute',
        left: this.currentPosition.x + 'px',
        top: this.currentPosition.y + 'px'
      },
      position: { ...this.currentPosition },
      size: { ...this.currentSize },
      metadata: {
        createdAt: this.config?.metadata?.createdAt || Date.now(),
        modifiedAt: Date.now(),
        modifiedBy: this.config?.metadata?.modifiedBy,
      },
    };
    this.applied.emit(finalConfig);
  }
}
