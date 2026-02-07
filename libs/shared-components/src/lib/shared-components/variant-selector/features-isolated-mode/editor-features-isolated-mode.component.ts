import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

/**
 * Feature Item Interface for Isolated Mode
 */
export interface FeatureIsolatedItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  color?: string;
  iconType?: string;
  category?: string;
}

/**
 * Feature Category Interface
 */
export interface FeatureIsolatedCategory {
  id: string;
  name: string;
  icon: string;
}

/**
 * Features Section Isolated Mode Content
 */
export interface FeaturesIsolatedModeContent {
  title?: string;
  subtitle?: string;
  variant?: string;
  categories?: FeatureIsolatedCategory[];
  features?: FeatureIsolatedItem[];
  backgroundColor?: string;
  textColor?: string;
}

/**
 * Features Section Isolated Mode Component
 * Provides premium editing experience for Features sections
 */
@Component({
  selector: 'lib-editor-features-isolated-mode',
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
            <span class="component-name">FEATURES SECTION</span>
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
                    placeholder="Ej: Nuestros Servicios Premium"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <textarea 
                    [(ngModel)]="content.subtitle" 
                    class="premium-input h-24" 
                    placeholder="Describe tu sección..."
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Variante</label>
                  <select [(ngModel)]="content.variant" class="premium-input">
                    <option value="default">Default</option>
                    <option value="grid">Grid</option>
                    <option value="list">Lista</option>
                    <option value="cards">Tarjetas</option>
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
              </div>

              <!-- FEATURES SECTION -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">✨</span>
                  <h4>FEATURES ({{ content.features?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addFeature()">+</button>
                </div>

                <div class="features-list">
                  <div class="feature-item-edit" *ngFor="let feature of content.features; let i = index">
                    <div class="feature-header">
                      <span class="feature-number">{{ i + 1 }}</span>
                      <input 
                        type="text" 
                        [(ngModel)]="feature.icon" 
                        class="premium-input icon-input" 
                        placeholder="🚀"
                      />
                      <button class="remove-btn" (click)="removeFeature(i)">×</button>
                    </div>
                    <input 
                      type="text" 
                      [(ngModel)]="feature.title" 
                      class="premium-input" 
                      placeholder="Título del feature"
                    />
                    <textarea 
                      [(ngModel)]="feature.description" 
                      class="premium-input h-16" 
                      placeholder="Descripción..."
                    ></textarea>
                    <div class="feature-colors">
                      <input 
                        type="color" 
                        [(ngModel)]="feature.color" 
                        class="color-mini"
                        title="Color"
                      />
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
                class="preview-features" 
                [style.background]="getPreviewBackground()"
                [style.color]="content.textColor || '#ffffff'"
              >
                <div class="preview-header" *ngIf="content.title || content.subtitle">
                  <h2 class="preview-title">{{ content.title || 'Título de Features' }}</h2>
                  <p class="preview-subtitle">{{ content.subtitle || ' Subtítulo descriptivo' }}</p>
                </div>
                
                <div class="preview-grid">
                  <div 
                    class="preview-feature" 
                    *ngFor="let feature of content.features; let i = index"
                    [style.borderColor]="feature.color || '#6366f1'"
                  >
                    <div class="preview-icon" [style.background]="feature.color || '#6366f1'">
                      {{ feature.icon || '⭐' }}
                    </div>
                    <h3 class="preview-feature-title">{{ feature.title || 'Feature ' + (i + 1) }}</h3>
                    <p class="preview-feature-desc">{{ feature.description || 'Descripción del feature' }}</p>
                  </div>
                  
                  <!-- Placeholders if no features -->
                  <div class="preview-feature placeholder" *ngIf="!content.features?.length">
                    <div class="preview-icon">➕</div>
                    <p>Añade features desde el panel</p>
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
                <span class="label">FEATURES</span>
                <span class="value">{{ content.features?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Gestiona el contenido y estilo de tu sección de features.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editor-features-isolated-mode.component.scss',
})
export class EditorFeaturesIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() public config!: IsolatedModeConfig;
  @Output() public closed = new EventEmitter<void>();
  @Output() public applied = new EventEmitter<IsolatedModeConfig>();

  public content: FeaturesIsolatedModeContent = {};

  ngOnInit() {
    this.content = {
      title: this.config?.content?.['title'] || 'Nuestros Servicios Premium',
      subtitle: this.config?.content?.['subtitle'] || 'Descubre cómo podemos ayudarte a llevar tu negocio al siguiente nivel.',
      variant: this.config?.content?.['variant'] || 'default',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#1a1a2e',
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      features: this.config?.content?.['features'] || [
        { id: '1', icon: '🚀', title: 'Alta Velocidad', description: 'Optimizamos cada línea de código', color: '#3b82f6' },
        { id: '2', icon: '🛡️', title: 'Seguridad Total', description: 'Protegemos tus datos con estándares altos', color: '#10b981' },
        { id: '3', icon: '📱', title: 'Diseño Responsive', description: 'Perfecto en cualquier dispositivo', color: '#f59e0b' },
        { id: '4', icon: '🎨', title: 'UI/UX Increíble', description: 'Interfaces intuitivas que enamoran', color: '#ef4444' },
      ],
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

  public addFeature() {
    if (!this.content.features) {
      this.content.features = [];
    }
    this.content.features.push({
      id: Date.now().toString(),
      icon: '✨',
      title: 'Nuevo Feature',
      description: 'Descripción del nuevo feature',
      color: '#8b5cf6',
    });
  }

  public removeFeature(index: number) {
    if (this.content.features && index >= 0 && index < this.content.features.length) {
      this.content.features.splice(index, 1);
    }
  }

  public apply() {
    const contentObj: Record<string, any> = {
      title: this.content.title,
      subtitle: this.content.subtitle,
      variant: this.content.variant,
      backgroundColor: this.content.backgroundColor,
      textColor: this.content.textColor,
      features: this.content.features,
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
    return this.content.backgroundColor || '#1a1a2e';
  }
}
