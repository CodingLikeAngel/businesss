import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';
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
 * Products Section Isolated Mode Component
 * 
 * Extends BaseIsolatedModeComponent to provide:
 * - Undo/Redo functionality
 * - Drag & Resize capabilities
 * - Grid snapping
 * - Keyboard shortcuts
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
                    placeholder="Nuestros Productos"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <textarea 
                    [(ngModel)]="editableContent.subtitle" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    rows="2"
                    placeholder="Explora nuestra colección"
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <select 
                    [(ngModel)]="editableContent.variant" 
                    (ngModelChange)="onVariantChange()"
                    class="premium-input"
                  >
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
                  <h4>PRODUCTOS ({{ editableContent.products?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addProductItem()">+</button>
                </div>

                <div class="products-items-list">
                  <div class="product-item-edit" *ngFor="let product of editableContent.products; let i = index">
                    <div class="product-header">
                      <span class="product-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeProductItem(i)">×</button>
                    </div>
                    
                    <div class="control-group">
                      <label>Nombre</label>
                      <input 
                        type="text" 
                        [(ngModel)]="product.name" 
                        (ngModelChange)="onContentChange()"
                        class="premium-input" 
                        placeholder="Producto"
                      />
                    </div>
                    
                    <div class="control-group">
                      <label>Descripción</label>
                      <textarea 
                        [(ngModel)]="product.description" 
                        (ngModelChange)="onContentChange()"
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
                          (ngModelChange)="onContentChange()"
                          class="premium-input" 
                          placeholder="$99"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Imagen URL</label>
                        <input 
                          type="text" 
                          [(ngModel)]="product.imageUrl" 
                          (ngModelChange)="onContentChange()"
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
                          (ngModelChange)="onContentChange()"
                          class="premium-input" 
                          placeholder="Nuevo"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Texto Botón</label>
                        <input 
                          type="text" 
                          [(ngModel)]="product.buttonText" 
                          (ngModelChange)="onContentChange()"
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
                    [(ngModel)]="editableContent.backgroundColor" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input color-input"
                  />
                </div>

                <div class="control-row">
                  <div class="control-group flex-1">
                    <label>Color de Texto</label>
                    <input 
                      type="color" 
                      [(ngModel)]="editableContent.textColor" 
                      (ngModelChange)="onContentChange()"
                      class="premium-input color-input"
                    />
                  </div>
                  <div class="control-group flex-1">
                    <label>Color de Acento</label>
                    <input 
                      type="color" 
                      [(ngModel)]="editableContent.accentColor" 
                      (ngModelChange)="onContentChange()"
                      class="premium-input color-input"
                    />
                  </div>
                </div>

                <div class="control-group">
                  <label>Color de Botones</label>
                  <input 
                    type="color" 
                    [(ngModel)]="editableContent.buttonColor" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input color-input"
                  />
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
                  class="preview-products"
                  [style.background]="editableContent.backgroundColor || '#f8fafc'"
                  [style.color]="editableContent.textColor || '#1e293b'"
                >
                  <div class="preview-header">
                    <h2 class="preview-title">{{ editableContent.title || 'Nuestros Productos' }}</h2>
                    <p class="preview-subtitle">{{ editableContent.subtitle || 'Explora nuestra colección' }}</p>
                  </div>
                  
                  <div class="preview-products-grid" [class]="'variant-' + (editableContent.variant || 'grid')">
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
                          <span class="preview-product-price" [style.color]="editableContent.accentColor || '#6366f1'">
                            {{ product.price || '$99' }}
                          </span>
                          <button 
                            class="preview-product-button"
                            [style.background]="editableContent.buttonColor || '#6366f1'"
                          >
                            {{ product.buttonText || 'Ver más' }}
                          </button>
                        </div>
                      </div>
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
                <span class="value text-purple-400">{{ editableContent.variant || 'grid' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">PRODUCTS</span>
                <span class="value">{{ editableContent.products?.length || 0 }}</span>
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
  styleUrl: './editor-products-isolated-mode.component.scss',
})
export class EditorProductsIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvasElement') canvasRef!: ElementRef;

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

  protected initializeState(): void {
    const configProducts = this.config?.content?.['products'] as ProductItem[] | undefined;
    
    // Initialize content
    this.editableContent = {
      title: this.config?.content?.['title'] || 'Nuestros Productos',
      subtitle: this.config?.content?.['subtitle'] || 'Explora nuestra colección de productos de alta calidad',
      variant: this.config?.content?.['variant'] || 'grid',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#f8fafc',
      textColor: this.config?.content?.['textColor'] || '#1e293b',
      accentColor: this.config?.content?.['accentColor'] || '#6366f1',
      buttonColor: this.config?.content?.['buttonColor'] || '#6366f1',
      products: configProducts || [...this.defaultProducts],
    };

    // Initialize styles
    this.editableStyles = this.config?.styles ? { ...this.config.styles } : {};

    // Initialize position and size
    this.currentPosition = this.config?.position || { x: 50, y: 50 };
    this.currentSize = this.config?.size || { width: 700, height: 500 };
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };

    // Save initial state
    this.saveState();
  }

  protected getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement || null;
  }

  addProductItem(): void {
    if (!this.editableContent.products) {
      this.editableContent.products = [];
    }
    this.editableContent.products.push({
      name: 'Nuevo Producto',
      description: 'Descripción del nuevo producto',
      price: '$99',
      imageUrl: '',
      buttonText: 'Ver más',
    });
    this.saveState();
  }

  removeProductItem(index: number): void {
    if (this.editableContent.products && index >= 0 && index < this.editableContent.products.length) {
      this.editableContent.products.splice(index, 1);
      this.saveState();
    }
  }

  getPreviewProducts(): ProductItem[] {
    return this.editableContent.products || this.defaultProducts;
  }

  override apply(): void {
    const finalConfig: IsolatedModeConfig = {
      ...this.config,
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
