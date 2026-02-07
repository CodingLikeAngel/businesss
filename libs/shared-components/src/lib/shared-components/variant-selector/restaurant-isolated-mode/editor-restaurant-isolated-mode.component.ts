import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

/**
 * Restaurant Menu Item Interface
 */
export interface MenuItem {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
}

/**
 * Restaurant Isolated Mode Content
 */
export interface RestaurantIsolatedModeContent {
  restaurantName?: string;
  tagline?: string;
  description?: string;
  menuItems?: MenuItem[];
  features?: { title: string; description: string; icon: string }[];
  testimonials?: { author: string; role: string; quote: string; avatar?: string }[];
  stats?: { icon: string; label: string; value: string; description: string }[];
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  buttonColor?: string;
}

/**
 * Restaurant Section Isolated Mode Component
 */
@Component({
  selector: 'lib-editor-restaurant-isolated-mode',
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
            <span class="component-name">RESTAURANT SECTION</span>
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
                  <label>Nombre del Restaurante</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.restaurantName" 
                    class="premium-input" 
                    placeholder="El Buen Sabor"
                  />
                </div>

                <div class="control-group">
                  <label>Tagline</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.tagline" 
                    class="premium-input" 
                    placeholder="Cocina de autor con tradición"
                  />
                </div>

                <div class="control-group">
                  <label>Descripción</label>
                  <textarea 
                    [(ngModel)]="content.description" 
                    class="premium-input" 
                    rows="2"
                    placeholder="Breve descripción del restaurante"
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <select [(ngModel)]="content.variant" class="premium-input">
                    <option value="elegant">Elegante</option>
                    <option value="casual">Casual</option>
                    <option value="moderno">Moderno</option>
                    <option value="tradicional">Tradicional</option>
                  </select>
                </div>
              </div>

              <!-- MENU SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🍽️</span>
                  <h4>MENÚ ({{ content.menuItems?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addMenuItem()">+</button>
                </div>

                <div class="menu-items-list">
                  <div class="menu-item-edit" *ngFor="let item of content.menuItems; let i = index">
                    <div class="menu-item-header">
                      <span class="menu-item-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeMenuItem(i)">×</button>
                    </div>
                    
                    <div class="control-group">
                      <label>Nombre del Plato</label>
                      <input 
                        type="text" 
                        [(ngModel)]="item.name" 
                        class="premium-input" 
                        placeholder="Plato principal"
                      />
                    </div>
                    
                    <div class="control-group">
                      <label>Descripción</label>
                      <textarea 
                        [(ngModel)]="item.description" 
                        class="premium-input" 
                        rows="2"
                        placeholder="Descripción del plato"
                      ></textarea>
                    </div>
                    
                    <div class="menu-item-row">
                      <div class="control-group flex-1">
                        <label>Precio</label>
                        <input 
                          type="text" 
                          [(ngModel)]="item.price" 
                          class="premium-input" 
                          placeholder="25€"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Categoría</label>
                        <select [(ngModel)]="item.category" class="premium-input">
                          <option value="entrante">Entrante</option>
                          <option value="principal">Principal</option>
                          <option value="postre">Postre</option>
                          <option value="bebida">Bebida</option>
                        </select>
                      </div>
                    </div>
                    
                    <div class="dietary-flags">
                      <label class="checkbox-label">
                        <input type="checkbox" [(ngModel)]="item.isVegetarian" />
                        🌿 Vegetariano
                      </label>
                      <label class="checkbox-label">
                        <input type="checkbox" [(ngModel)]="item.isVegan" />
                        🌱 Vegano
                      </label>
                      <label class="checkbox-label">
                        <input type="checkbox" [(ngModel)]="item.isGlutenFree" />
                        🌾 Sin Gluten
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- FEATURES SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">⭐</span>
                  <h4>CARACTERÍSTICAS ({{ content.features?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addFeature()">+</button>
                </div>

                <div class="features-list">
                  <div class="feature-edit" *ngFor="let feature of content.features; let i = index">
                    <div class="feature-header">
                      <span class="feature-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeFeature(i)">×</button>
                    </div>
                    
                    <div class="control-group">
                      <label>Título</label>
                      <input 
                        type="text" 
                        [(ngModel)]="feature.title" 
                        class="premium-input" 
                        placeholder="Característica"
                      />
                    </div>
                    
                    <div class="control-group">
                      <label>Descripción</label>
                      <textarea 
                        [(ngModel)]="feature.description" 
                        class="premium-input" 
                        rows="2"
                        placeholder="Descripción"
                      ></textarea>
                    </div>
                    
                    <div class="control-group">
                      <label>Icono (emoji)</label>
                      <input 
                        type="text" 
                        [(ngModel)]="feature.icon" 
                        class="premium-input" 
                        placeholder="🍽️"
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
                class="preview-restaurant"
                [style.background]="content.backgroundColor || '#1a1a2e'"
                [style.color]="content.textColor || '#ffffff'"
              >
                <div class="preview-header">
                  <h1 class="preview-title">{{ content.restaurantName || 'El Buen Sabor' }}</h1>
                  <p class="preview-tagline">{{ content.tagline || 'Cocina de autor con tradición' }}</p>
                  <p class="preview-description">{{ content.description || 'Descubre una experiencia culinaria única' }}</p>
                </div>
                
                <div class="preview-menu-section" *ngIf="content.menuItems && content.menuItems.length > 0">
                  <h3 class="preview-section-title">Menú Destacado</h3>
                  <div class="preview-menu-grid">
                    <div class="preview-menu-item" *ngFor="let item of getPreviewMenuItems()">
                      <div class="preview-menu-item-header">
                        <h4 class="preview-menu-item-name">{{ item.name || 'Plato' }}</h4>
                        <span class="preview-menu-item-price">{{ item.price || '25€' }}</span>
                      </div>
                      <p class="preview-menu-item-desc">{{ item.description || 'Descripción del plato' }}</p>
                      <div class="preview-dietary-flags">
                        <span *ngIf="item.isVegetarian">🌿</span>
                        <span *ngIf="item.isVegan">🌱</span>
                        <span *ngIf="item.isGlutenFree">🌾</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="preview-features" *ngIf="content.features && content.features.length > 0">
                  <div class="preview-feature-item" *ngFor="let feature of content.features">
                    <span class="preview-feature-icon">{{ feature.icon || '⭐' }}</span>
                    <h4>{{ feature.title || 'Característica' }}</h4>
                    <p>{{ feature.description || 'Descripción' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Info Dock -->
            <div class="modern-position-dock">
              <div class="dock-item">
                <span class="label">VARIANT</span>
                <span class="value text-purple-400">{{ content.variant || 'elegant' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">ITEMS</span>
                <span class="value">{{ content.menuItems?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Edita tu sección de restaurante.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editor-restaurant-isolated-mode.component.scss',
})
export class EditorRestaurantIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() public config!: IsolatedModeConfig;
  @Output() public closed = new EventEmitter<void>();
  @Output() public applied = new EventEmitter<IsolatedModeConfig>();

  public content: RestaurantIsolatedModeContent = {};
  
  private defaultMenuItems: MenuItem[] = [
    { name: 'Tataki de Atún', description: 'Con costra de sésamo y reducción de soja cítrica', price: '24€', category: 'entrante' },
    { name: 'Solomillo de Ternera', description: 'A la brasa con puré de boletus y trufa negra', price: '28€', category: 'principal' },
    { name: 'Coulant de Chocolate', description: 'Corazón fundente con helado de vainilla', price: '9€', category: 'postre' },
  ];

  private defaultFeatures = [
    { title: 'Producto de Km 0', description: 'Ingredientes frescos de proveedores locales', icon: '🌿' },
    { title: 'Bodega Exclusiva', description: 'Más de 100 referencias seleccionadas', icon: '🍷' },
    { title: 'Cocina de Autor', description: 'Platos tradicionales reinterpretados', icon: '🎨' },
  ];

  ngOnInit() {
    const configMenuItems = this.config?.content?.['menuItems'] as MenuItem[] | undefined;
    const configFeatures = this.config?.content?.['features'] as { title: string; description: string; icon: string }[] | undefined;
    
    this.content = {
      restaurantName: this.config?.content?.['restaurantName'] || 'El Buen Sabor',
      tagline: this.config?.content?.['tagline'] || 'Cocina de autor con tradición',
      description: this.config?.content?.['description'] || 'Descubre una experiencia culinaria única',
      variant: this.config?.content?.['variant'] || 'elegant',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#1a1a2e',
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      accentColor: this.config?.content?.['accentColor'] || '#d4af37',
      buttonColor: this.config?.content?.['buttonColor'] || '#d4af37',
      menuItems: configMenuItems || this.defaultMenuItems,
      features: configFeatures || this.defaultFeatures,
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

  public addMenuItem() {
    if (!this.content.menuItems) {
      this.content.menuItems = [];
    }
    this.content.menuItems.push({
      name: 'Nuevo Plato',
      description: 'Descripción del nuevo plato',
      price: '20€',
      category: 'principal',
    });
  }

  public removeMenuItem(index: number) {
    if (this.content.menuItems && index >= 0 && index < this.content.menuItems.length) {
      this.content.menuItems.splice(index, 1);
    }
  }

  public addFeature() {
    if (!this.content.features) {
      this.content.features = [];
    }
    this.content.features.push({
      title: 'Nueva Característica',
      description: 'Descripción de la característica',
      icon: '⭐',
    });
  }

  public removeFeature(index: number) {
    if (this.content.features && index >= 0 && index < this.content.features.length) {
      this.content.features.splice(index, 1);
    }
  }

  public getPreviewMenuItems(): MenuItem[] {
    return this.content.menuItems || this.defaultMenuItems;
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
