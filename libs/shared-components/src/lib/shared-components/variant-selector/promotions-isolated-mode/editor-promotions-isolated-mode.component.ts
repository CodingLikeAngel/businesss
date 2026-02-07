import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

/**
 * Promotion Item Interface
 */
export interface PromotionItem {
  title: string;
  description: string;
  discount: string;
  code?: string;
  imageUrl?: string;
  expiresAt?: string;
}

/**
 * Promotions Isolated Mode Content
 */
export interface PromotionsIsolatedModeContent {
  title?: string;
  subtitle?: string;
  promotions?: PromotionItem[];
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  buttonColor?: string;
}

/**
 * Promotions Section Isolated Mode Component
 */
@Component({
  selector: 'lib-editor-promotions-isolated-mode',
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
            <span class="component-name">PROMOTIONS SECTION</span>
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
                  <label>Título</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.title" 
                    class="premium-input" 
                    placeholder="Ofertas Especiales"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <textarea 
                    [(ngModel)]="content.subtitle" 
                    class="premium-input" 
                    rows="2"
                    placeholder="No te pierdas nuestras promociones"
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <select [(ngModel)]="content.variant" class="premium-input">
                    <option value="cards">Tarjetas</option>
                    <option value="banner">Banner</option>
                    <option value="list">Lista</option>
                    <option value="grid">Grid</option>
                  </select>
                </div>
              </div>

              <!-- PROMOTIONS SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🏷️</span>
                  <h4>PROMOCIONES ({{ content.promotions?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addPromotion()">+</button>
                </div>

                <div class="promotions-items-list">
                  <div class="promotion-item-edit" *ngFor="let promo of content.promotions; let i = index">
                    <div class="promotion-header">
                      <span class="promotion-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removePromotion(i)">×</button>
                    </div>
                    
                    <div class="control-group">
                      <label>Título</label>
                      <input 
                        type="text" 
                        [(ngModel)]="promo.title" 
                        class="premium-input" 
                        placeholder="50% de descuento"
                      />
                    </div>
                    
                    <div class="control-group">
                      <label>Descripción</label>
                      <textarea 
                        [(ngModel)]="promo.description" 
                        class="premium-input" 
                        rows="2"
                        placeholder="Descripción de la promoción"
                      ></textarea>
                    </div>
                    
                    <div class="promotion-row">
                      <div class="control-group flex-1">
                        <label>Descuento</label>
                        <input 
                          type="text" 
                          [(ngModel)]="promo.discount" 
                          class="premium-input" 
                          placeholder="-50%"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Código</label>
                        <input 
                          type="text" 
                          [(ngModel)]="promo.code" 
                          class="premium-input" 
                          placeholder="PROMO50"
                        />
                      </div>
                    </div>
                    
                    <div class="control-group">
                      <label>Imagen URL</label>
                      <input 
                        type="text" 
                        [(ngModel)]="promo.imageUrl" 
                        class="premium-input" 
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- STYLING SECTION -->
              <div class="sidebar-section no-border">
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

                <div class="control-row">
                  <div class="control-group flex-1">
                    <label>Color de Texto</label>
                    <input 
                      type="color" 
                      [(ngModel)]="content.textColor" 
                      class="premium-input color-input"
                    />
                  </div>
                  <div class="control-group flex-1">
                    <label>Color de Acento</label>
                    <input 
                      type="color" 
                      [(ngModel)]="content.accentColor" 
                      class="premium-input color-input"
                    />
                  </div>
                </div>

                <div class="control-group">
                  <label>Color del Botón</label>
                  <input 
                    type="color" 
                    [(ngModel)]="content.buttonColor" 
                    class="premium-input color-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Canvas Preview -->
          <div class="isolated-canvas">
            <div class="canvas-inner">
              <div 
                class="preview-promotions"
                [style.background]="content.backgroundColor || '#0f172a'"
                [style.color]="content.textColor || '#ffffff'"
              >
                <div class="preview-header">
                  <h2 class="preview-title">{{ content.title || 'Ofertas Especiales' }}</h2>
                  <p class="preview-subtitle">{{ content.subtitle || 'No te pierdas nuestras promociones limitadas' }}</p>
                </div>
                
                <div class="preview-promotions-grid" [class]="'variant-' + (content.variant || 'cards')">
                  <div class="preview-promotion-item" *ngFor="let promo of getPreviewPromotions()">
                    <div class="preview-promotion-image">
                      <div class="preview-image-placeholder" *ngIf="!promo.imageUrl">
                        🏷️
                      </div>
                      <img *ngIf="promo.imageUrl" [src]="promo.imageUrl" [alt]="promo.title" />
                      <span class="preview-discount-badge">{{ promo.discount || '-25%' }}</span>
                    </div>
                    <div class="preview-promotion-content">
                      <h3 class="preview-promotion-title">{{ promo.title || 'Promoción' }}</h3>
                      <p class="preview-promotion-description">{{ promo.description || 'Descripción de la promoción' }}</p>
                      <div class="preview-promotion-code" *ngIf="promo.code">
                        Código: <code>{{ promo.code }}</code>
                      </div>
                      <button 
                        class="preview-promotion-button"
                        [style.background]="content.buttonColor || '#6366f1'"
                      >
                        Ver Oferta
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Info Dock -->
            <div class="modern-position-dock">
              <div class="dock-item">
                <span class="label">VARIANT</span>
                <span class="value text-purple-400">{{ content.variant || 'cards' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">PROMOS</span>
                <span class="value">{{ content.promotions?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Edita tu sección de promociones.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editor-promotions-isolated-mode.component.scss',
})
export class EditorPromotionsIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() public config!: IsolatedModeConfig;
  @Output() public closed = new EventEmitter<void>();
  @Output() public applied = new EventEmitter<IsolatedModeConfig>();

  public content: PromotionsIsolatedModeContent = {};
  
  private defaultPromotions: PromotionItem[] = [
    { title: '50% de Descuento', description: 'En tu primera compra', discount: '-50%', code: 'BIENVENIDO50' },
    { title: 'Envío Gratis', description: 'En pedidos mayores a $50', discount: 'FREE', code: 'ENVIOGRATIS' },
    { title: '2x1 en Productos', description: 'Selecciona tus favoritos', discount: '2x1', code: 'DOSXUNO' },
  ];

  ngOnInit() {
    const configPromotions = this.config?.content?.['promotions'] as PromotionItem[] | undefined;
    
    this.content = {
      title: this.config?.content?.['title'] || 'Ofertas Especiales',
      subtitle: this.config?.content?.['subtitle'] || 'No te pierdas nuestras promociones limitadas',
      variant: this.config?.content?.['variant'] || 'cards',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#0f172a',
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      accentColor: this.config?.content?.['accentColor'] || '#6366f1',
      buttonColor: this.config?.content?.['buttonColor'] || '#6366f1',
      promotions: configPromotions || this.defaultPromotions,
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

  public addPromotion() {
    if (!this.content.promotions) {
      this.content.promotions = [];
    }
    this.content.promotions.push({
      title: 'Nueva Promoción',
      description: 'Descripción de la nueva promoción',
      discount: '-25%',
      code: 'NUEVO25',
    });
  }

  public removePromotion(index: number) {
    if (this.content.promotions && index >= 0 && index < this.content.promotions.length) {
      this.content.promotions.splice(index, 1);
    }
  }

  public getPreviewPromotions(): PromotionItem[] {
    return this.content.promotions || this.defaultPromotions;
  }

  public apply() {
    this.applied.emit({
      ...this.config,
      content: { ...this.content },
      metadata: {
        createdAt: this.config?.metadata?.createdAt || Date.now(),
        modifiedAt: Date.now(),
        modifiedBy: this.config?.metadata?.modifiedBy,
      },
    });
  }
}
