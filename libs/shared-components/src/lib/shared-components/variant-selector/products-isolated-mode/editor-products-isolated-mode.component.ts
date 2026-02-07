import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

/**
 * Product Item Interface
 */
export interface ProductItem {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  badge?: string;
  features?: string[];
  buttonText?: string;
}

/**
 * Products Isolated Mode Content
 */
export interface ProductsIsolatedModeContent {
  title?: string;
  subtitle?: string;
  products?: ProductItem[];
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  buttonColor?: string;
}

/**
 * Products Section Isolated Mode Component
 */
@Component({
  selector: 'lib-editor-products-isolated-mode',
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
            <span class="component-name">PRODUCTS SECTION</span>
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
                    placeholder="Nuestros Productos"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <textarea 
                    [(ngModel)]="content.subtitle" 
                    class="premium-input" 
                    rows="2"
                    placeholder="Explora nuestra colección"
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <select [(ngModel)]="content.variant" class="premium-input">
                    <option value="grid">Grid</option>
                    <option value="list">Lista</option>
                    <option value="featured">Featured</option>
                    <option value="carousel">Carrusel</option>
                  </select>
                </div>
              </div>

              <!-- PRODUCTS SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🛍️</span>
                  <h4>PRODUCTOS ({{ content.products?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addProductItem()">+</button>
                </div>

                <div class="products-items-list">
                  <div class="product-item-edit" *ngFor="let product of content.products; let i = index">
                    <div class="product-header">
                      <span class="product-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeProductItem(i)">×</button>
                    </div>
                    
                    <div class="control-group">
                      <label>Nombre</label>
                      <input 
                        type="text" 
                        [(ngModel)]="product.name" 
                        class="premium-input" 
                        placeholder="Producto"
                      />
                    </div>
                    
                    <div class="control-group">
                      <label>Descripción</label>
                      <textarea 
                        [(ngModel)]="product.description" 
                        class="premium-input" 
                        rows="2"
                        placeholder="Descripción del producto"
                      ></textarea>
                    </div>
                    
                    <div class="product-row">
                      <div class="control-group flex-1">
                        <label>Precio</label>
                        <input 
                          type="text" 
                          [(ngModel)]="product.price" 
                          class="premium-input" 
                          placeholder="$99"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Imagen URL</label>
                        <input 
                          type="text" 
                          [(ngModel)]="product.imageUrl" 
                          class="premium-input" 
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div class="product-row">
                      <div class="control-group flex-1">
                        <label>Etiqueta</label>
                        <input 
                          type="text" 
                          [(ngModel)]="product.badge" 
                          class="premium-input" 
                          placeholder="Nuevo"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Texto Botón</label>
                        <input 
                          type="text" 
                          [(ngModel)]="product.buttonText" 
                          class="premium-input" 
                          placeholder="Ver más"
                        />
                      </div>
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
                  <label>Color de Botones</label>
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
                class="preview-products"
                [style.background]="content.backgroundColor || '#f8fafc'"
                [style.color]="content.textColor || '#1e293b'"
              >
                <div class="preview-header">
                  <h2 class="preview-title">{{ content.title || 'Nuestros Productos' }}</h2>
                  <p class="preview-subtitle">{{ content.subtitle || 'Explora nuestra colección' }}</p>
                </div>
                
                <div class="preview-products-grid" [class]="'variant-' + (content.variant || 'grid')">
                  <div class="preview-product-item" *ngFor="let product of getPreviewProducts()">
                    <div class="preview-product-image">
                      <div class="preview-image-placeholder">
                        <span *ngIf="!product.imageUrl">🖼️</span>
                        <img *ngIf="product.imageUrl" [src]="product.imageUrl" [alt]="product.name" />
                      </div>
                      <span class="preview-product-badge" *ngIf="product.badge">
                        {{ product.badge }}
                      </span>
                    </div>
                    <div class="preview-product-content">
                      <h3 class="preview-product-name">{{ product.name || 'Producto' }}</h3>
                      <p class="preview-product-description">{{ product.description || 'Descripción del producto' }}</p>
                      <div class="preview-product-footer">
                        <span class="preview-product-price" [style.color]="content.accentColor || '#6366f1'">
                          {{ product.price || '$99' }}
                        </span>
                        <button 
                          class="preview-product-button"
                          [style.background]="content.buttonColor || '#6366f1'"
                        >
                          {{ product.buttonText || 'Ver más' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Info Dock -->
            <div class="modern-position-dock">
              <div class="dock-item">
                <span class="label">VARIANT</span>
                <span class="value text-purple-400">{{ content.variant || 'grid' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">PRODUCTS</span>
                <span class="value">{{ content.products?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Edita los productos de tu sección.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editor-products-isolated-mode.component.scss',
})
export class EditorProductsIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() public config!: IsolatedModeConfig;
  @Output() public closed = new EventEmitter<void>();
  @Output() public applied = new EventEmitter<IsolatedModeConfig>();

  public content: ProductsIsolatedModeContent = {};
  
  private defaultProducts: ProductItem[] = [
    { 
      name: 'Producto Premium', 
      description: 'La mejor opción para tus necesidades', 
      price: '$99', 
      imageUrl: '',
      badge: 'Nuevo',
      buttonText: 'Ver más'
    },
    { 
      name: 'Producto Estándar', 
      description: 'Calidad y precio equilibrado', 
      price: '$79', 
      imageUrl: '',
      buttonText: 'Ver más'
    },
    { 
      name: 'Producto Básico', 
      description: 'Ideal para comenzar', 
      price: '$49', 
      imageUrl: '',
      buttonText: 'Ver más'
    },
    { 
      name: 'Producto Deluxe', 
      description: 'La experiencia definitiva', 
      price: '$149', 
      imageUrl: '',
      badge: 'Popular',
      buttonText: 'Ver más'
    },
  ];

  ngOnInit() {
    const configProducts = this.config?.content?.['products'] as ProductItem[] | undefined;
    
    this.content = {
      title: this.config?.content?.['title'] || 'Nuestros Productos',
      subtitle: this.config?.content?.['subtitle'] || 'Explora nuestra colección de productos de alta calidad',
      variant: this.config?.content?.['variant'] || 'grid',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#f8fafc',
      textColor: this.config?.content?.['textColor'] || '#1e293b',
      accentColor: this.config?.content?.['accentColor'] || '#6366f1',
      buttonColor: this.config?.content?.['buttonColor'] || '#6366f1',
      products: configProducts || this.defaultProducts,
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

  public addProductItem() {
    if (!this.content.products) {
      this.content.products = [];
    }
    this.content.products.push({
      name: 'Nuevo Producto',
      description: 'Descripción del nuevo producto',
      price: '$99',
      imageUrl: '',
      buttonText: 'Ver más',
    });
  }

  public removeProductItem(index: number) {
    if (this.content.products && index >= 0 && index < this.content.products.length) {
      this.content.products.splice(index, 1);
    }
  }

  public getPreviewProducts(): ProductItem[] {
    return this.content.products || this.defaultProducts;
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
