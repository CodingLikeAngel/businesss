import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';
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
 * Restaurant Section Isolated Mode Component
 * 
 * Extends BaseIsolatedModeComponent to provide:
 * - Undo/Redo functionality
 * - Drag & Resize capabilities
 * - Grid snapping
 * - Keyboard shortcuts
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
                  <label>Nombre del Restaurante</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.restaurantName" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="El Buen Sabor"
                  />
                </div>

                <div class="control-group">
                  <label>Tagline</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.tagline" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="Cocina de autor con tradición"
                  />
                </div>

                <div class="control-group">
                  <label>Descripción</label>
                  <textarea 
                    [(ngModel)]="editableContent.description" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    rows="2"
                    placeholder="Breve descripción del restaurante"
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <select 
                    [(ngModel)]="editableContent.variant" 
                    (ngModelChange)="onVariantChange()"
                    class="premium-input"
                  >
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
                  <h4>MENÚ ({{ editableContent.menuItems?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addMenuItem()">+</button>
                </div>

                <div class="menu-items-list">
                  <div class="menu-item-edit" *ngFor="let item of editableContent.menuItems; let i = index">
                    <div class="menu-item-header">
                      <span class="menu-item-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeMenuItem(i)">×</button>
                    </div>
                    
                    <div class="control-group">
                      <label>Nombre del Plato</label>
                      <input 
                        type="text" 
                        [(ngModel)]="item.name" 
                        (ngModelChange)="onContentChange()"
                        class="premium-input" 
                        placeholder="Plato principal"
                      />
                    </div>
                    
                    <div class="control-group">
                      <label>Descripción</label>
                      <textarea 
                        [(ngModel)]="item.description" 
                        (ngModelChange)="onContentChange()"
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
                          (ngModelChange)="onContentChange()"
                          class="premium-input" 
                          placeholder="25€"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Categoría</label>
                        <select [(ngModel)]="item.category" (ngModelChange)="onContentChange()" class="premium-input">
                          <option value="entrante">Entrante</option>
                          <option value="principal">Principal</option>
                          <option value="postre">Postre</option>
                          <option value="bebida">Bebida</option>
                        </select>
                      </div>
                    </div>
                    
                    <div class="dietary-flags">
                      <label class="checkbox-label">
                        <input type="checkbox" [(ngModel)]="item.isVegetarian" (ngModelChange)="onContentChange()" />
                        🌿 Vegetariano
                      </label>
                      <label class="checkbox-label">
                        <input type="checkbox" [(ngModel)]="item.isVegan" (ngModelChange)="onContentChange()" />
                        🌱 Vegano
                      </label>
                      <label class="checkbox-label">
                        <input type="checkbox" [(ngModel)]="item.isGlutenFree" (ngModelChange)="onContentChange()" />
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
                  <h4>CARACTERÍSTICAS ({{ editableContent.features?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addFeature()">+</button>
                </div>

                <div class="features-list">
                  <div class="feature-edit" *ngFor="let feature of editableContent.features; let i = index">
                    <div class="feature-header">
                      <span class="feature-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeFeature(i)">×</button>
                    </div>
                    
                    <div class="control-group">
                      <label>Título</label>
                      <input 
                        type="text" 
                        [(ngModel)]="feature.title" 
                        (ngModelChange)="onContentChange()"
                        class="premium-input" 
                        placeholder="Característica"
                      />
                    </div>
                    
                    <div class="control-group">
                      <label>Descripción</label>
                      <textarea 
                        [(ngModel)]="feature.description" 
                        (ngModelChange)="onContentChange()"
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
                        (ngModelChange)="onContentChange()"
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
                  <label>Color del Botón</label>
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
                  class="preview-restaurant"
                  [style.background]="editableContent.backgroundColor || '#1a1a2e'"
                  [style.color]="editableContent.textColor || '#ffffff'"
                >
                  <div class="preview-header">
                    <h1 class="preview-title">{{ editableContent.restaurantName || 'El Buen Sabor' }}</h1>
                    <p class="preview-tagline">{{ editableContent.tagline || 'Cocina de autor con tradición' }}</p>
                    <p class="preview-description">{{ editableContent.description || 'Descubre una experiencia culinaria única' }}</p>
                  </div>
                  
                  <div class="preview-menu-section" *ngIf="editableContent.menuItems && editableContent.menuItems.length > 0">
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

                  <div class="preview-features" *ngIf="editableContent.features && editableContent.features.length > 0">
                    <div class="preview-feature-item" *ngFor="let feature of editableContent.features">
                      <span class="preview-feature-icon">{{ feature.icon || '⭐' }}</span>
                      <h4>{{ feature.title || 'Característica' }}</h4>
                      <p>{{ feature.description || 'Descripción' }}</p>
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
                <span class="value text-purple-400">{{ editableContent.variant || 'elegant' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">ITEMS</span>
                <span class="value">{{ editableContent.menuItems?.length || 0 }}</span>
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
  styleUrl: './editor-restaurant-isolated-mode.component.scss',
})
export class EditorRestaurantIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvasElement') canvasRef!: ElementRef;

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

  protected initializeState(): void {
    const configMenuItems = this.config?.content?.['menuItems'] as MenuItem[] | undefined;
    const configFeatures = this.config?.content?.['features'] as { title: string; description: string; icon: string }[] | undefined;
    
    // Initialize content
    this.editableContent = {
      restaurantName: this.config?.content?.['restaurantName'] || 'El Buen Sabor',
      tagline: this.config?.content?.['tagline'] || 'Cocina de autor con tradición',
      description: this.config?.content?.['description'] || 'Descubre una experiencia culinaria única',
      variant: this.config?.content?.['variant'] || 'elegant',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#1a1a2e',
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      accentColor: this.config?.content?.['accentColor'] || '#d4af37',
      buttonColor: this.config?.content?.['buttonColor'] || '#d4af37',
      menuItems: configMenuItems || [...this.defaultMenuItems],
      features: configFeatures || [...this.defaultFeatures],
    };

    // Initialize styles
    this.editableStyles = this.config?.styles ? { ...this.config.styles } : {};

    // Initialize position and size
    this.currentPosition = this.config?.position || { x: 50, y: 50 };
    this.currentSize = this.config?.size || { width: 700, height: 600 };
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };

    // Save initial state
    this.saveState();
  }

  protected getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement || null;
  }

  addMenuItem(): void {
    if (!this.editableContent.menuItems) {
      this.editableContent.menuItems = [];
    }
    this.editableContent.menuItems.push({
      name: 'Nuevo Plato',
      description: 'Descripción del nuevo plato',
      price: '20€',
      category: 'principal',
    });
    this.saveState();
  }

  removeMenuItem(index: number): void {
    if (this.editableContent.menuItems && index >= 0 && index < this.editableContent.menuItems.length) {
      this.editableContent.menuItems.splice(index, 1);
      this.saveState();
    }
  }

  addFeature(): void {
    if (!this.editableContent.features) {
      this.editableContent.features = [];
    }
    this.editableContent.features.push({
      title: 'Nueva Característica',
      description: 'Descripción de la característica',
      icon: '⭐',
    });
    this.saveState();
  }

  removeFeature(index: number): void {
    if (this.editableContent.features && index >= 0 && index < this.editableContent.features.length) {
      this.editableContent.features.splice(index, 1);
      this.saveState();
    }
  }

  getPreviewMenuItems(): MenuItem[] {
    return this.editableContent.menuItems || this.defaultMenuItems;
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
