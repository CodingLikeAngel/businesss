import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';
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
 * Promotions Section Isolated Mode Component
 * 
 * Extends BaseIsolatedModeComponent to provide:
 * - Undo/Redo functionality
 * - Drag & Resize capabilities
 * - Grid snapping
 * - Keyboard shortcuts
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
                  <label>Título</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.title" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="Ofertas Especiales"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <textarea 
                    [(ngModel)]="editableContent.subtitle" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    rows="2"
                    placeholder="No te pierdas nuestras promociones"
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <select 
                    [(ngModel)]="editableContent.variant" 
                    (ngModelChange)="onVariantChange()"
                    class="premium-input"
                  >
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
                  <h4>PROMOCIONES ({{ editableContent.promotions?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addPromotion()">+</button>
                </div>

                <div class="promotions-items-list">
                  <div class="promotion-item-edit" *ngFor="let promo of editableContent.promotions; let i = index">
                    <div class="promotion-header">
                      <span class="promotion-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removePromotion(i)">×</button>
                    </div>
                    
                    <div class="control-group">
                      <label>Título</label>
                      <input 
                        type="text" 
                        [(ngModel)]="promo.title" 
                        (ngModelChange)="onContentChange()"
                        class="premium-input" 
                        placeholder="50% de descuento"
                      />
                    </div>
                    
                    <div class="control-group">
                      <label>Descripción</label>
                      <textarea 
                        [(ngModel)]="promo.description" 
                        (ngModelChange)="onContentChange()"
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
                          (ngModelChange)="onContentChange()"
                          class="premium-input" 
                          placeholder="-50%"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Código</label>
                        <input 
                          type="text" 
                          [(ngModel)]="promo.code" 
                          (ngModelChange)="onContentChange()"
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
                        (ngModelChange)="onContentChange()"
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
                  class="preview-promotions"
                  [style.background]="editableContent.backgroundColor || '#0f172a'"
                  [style.color]="editableContent.textColor || '#ffffff'"
                >
                  <div class="preview-header">
                    <h2 class="preview-title">{{ editableContent.title || 'Ofertas Especiales' }}</h2>
                    <p class="preview-subtitle">{{ editableContent.subtitle || 'No te pierdas nuestras promociones limitadas' }}</p>
                  </div>
                  
                  <div class="preview-promotions-grid" [class]="'variant-' + (editableContent.variant || 'cards')">
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
                          [style.background]="editableContent.buttonColor || '#6366f1'"
                        >
                          Ver Oferta
                        </button>
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
                <span class="value text-purple-400">{{ editableContent.variant || 'cards' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">PROMOS</span>
                <span class="value">{{ editableContent.promotions?.length || 0 }}</span>
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
  styleUrl: './editor-promotions-isolated-mode.component.scss',
})
export class EditorPromotionsIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvasElement') canvasRef!: ElementRef;

  private defaultPromotions: PromotionItem[] = [
    { title: '50% de Descuento', description: 'En tu primera compra', discount: '-50%', code: 'BIENVENIDO50' },
    { title: 'Envío Gratis', description: 'En pedidos mayores a $50', discount: 'FREE', code: 'ENVIOGRATIS' },
    { title: '2x1 en Productos', description: 'Selecciona tus favoritos', discount: '2x1', code: 'DOSXUNO' },
  ];

  protected initializeState(): void {
    const configPromotions = this.config?.content?.['promotions'] as PromotionItem[] | undefined;
    
    // Initialize content
    this.editableContent = {
      title: this.config?.content?.['title'] || 'Ofertas Especiales',
      subtitle: this.config?.content?.['subtitle'] || 'No te pierdas nuestras promociones limitadas',
      variant: this.config?.content?.['variant'] || 'cards',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#0f172a',
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      accentColor: this.config?.content?.['accentColor'] || '#6366f1',
      buttonColor: this.config?.content?.['buttonColor'] || '#6366f1',
      promotions: configPromotions || [...this.defaultPromotions],
    };

    // Initialize styles
    this.editableStyles = this.config?.styles ? { ...this.config.styles } : {};

    // Initialize position and size
    this.currentPosition = this.config?.position || { x: 50, y: 50 };
    this.currentSize = this.config?.size || { width: 600, height: 500 };
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };

    // Save initial state
    this.saveState();
  }

  protected getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement || null;
  }

  addPromotion(): void {
    if (!this.editableContent.promotions) {
      this.editableContent.promotions = [];
    }
    this.editableContent.promotions.push({
      title: 'Nueva Promoción',
      description: 'Descripción de la nueva promoción',
      discount: '-25%',
      code: 'NUEVO25',
    });
    this.saveState();
  }

  removePromotion(index: number): void {
    if (this.editableContent.promotions && index >= 0 && index < this.editableContent.promotions.length) {
      this.editableContent.promotions.splice(index, 1);
      this.saveState();
    }
  }

  getPreviewPromotions(): PromotionItem[] {
    return this.editableContent.promotions || this.defaultPromotions;
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
