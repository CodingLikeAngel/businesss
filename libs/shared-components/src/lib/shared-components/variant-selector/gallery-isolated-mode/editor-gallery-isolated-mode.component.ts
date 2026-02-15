import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

/**
 * Gallery Image Item Interface
 */
export interface GalleryImageItem {
  src: string;
  alt: string;
  category?: string;
}

/**
 * Gallery Section Isolated Mode Component
 * 
 * Extends BaseIsolatedModeComponent to provide:
 * - Undo/Redo functionality
 * - Drag & Resize capabilities
 * - Grid snapping
 * - Keyboard shortcuts
 */
@Component({
  selector: 'lib-editor-gallery-isolated-mode',
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
            <span class="component-name">GALLERY SECTION</span>
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
                    placeholder="Galería de Proyectos"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.subtitle" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="Explora nuestro trabajo reciente"
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
                    <option value="grid">Grid</option>
                    <option value="masonry">Masonry</option>
                    <option value="carousel">Carrusel</option>
                    <option value="mosaic">Mosaic</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Columnas: {{ editableContent.columns || 3 }}</label>
                  <input 
                    type="range" 
                    min="2" 
                    max="6" 
                    [(ngModel)]="editableContent.columns" 
                    (ngModelChange)="onContentChange()"
                    class="w-full"
                  />
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
              </div>

              <!-- IMAGES SECTION -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">🖼️</span>
                  <h4>IMÁGENES ({{ editableContent.images?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addImage()">+</button>
                </div>

                <div class="images-list">
                  <div class="image-item-edit" *ngFor="let img of editableContent.images; let i = index">
                    <div class="image-header">
                      <span class="image-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeImage(i)">×</button>
                    </div>
                    
                    <div class="control-group">
                      <label>URL de Imagen</label>
                      <input 
                        type="text" 
                        [(ngModel)]="img.src" 
                        (ngModelChange)="onContentChange()"
                        class="premium-input" 
                        placeholder="https://"
                      />
                    </div>
                    
                    <div class="control-group">
                      <label>Texto Alternativo</label>
                      <input 
                        type="text" 
                        [(ngModel)]="img.alt" 
                        (ngModelChange)="onContentChange()"
                        class="premium-input" 
                        placeholder="Descripción de la imagen"
                      />
                    </div>
                    
                    <div class="control-group">
                      <label>Categoría</label>
                      <input 
                        type="text" 
                        [(ngModel)]="img.category" 
                        (ngModelChange)="onContentChange()"
                        class="premium-input" 
                        placeholder="Categoría (opcional)"
                      />
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
                  class="preview-gallery" 
                  [style.background]="getPreviewBackground()"
                  [style.color]="editableContent.textColor || '#ffffff'"
                >
                  <div class="preview-header" *ngIf="editableContent.title || editableContent.subtitle">
                    <h2 class="preview-title">{{ editableContent.title || 'Galería' }}</h2>
                    <p class="preview-subtitle">{{ editableContent.subtitle || 'Explora nuestro trabajo' }}</p>
                  </div>
                  
                  <div class="preview-grid" [style.gridTemplateColumns]="'repeat(' + (editableContent.columns || 3) + ', 1fr)'">
                    <div 
                      class="preview-image" 
                      *ngFor="let img of getPreviewImages()"
                      [style.backgroundImage]="'url(' + (img.src || 'https://via.placeholder.com/300') + ')'"
                    >
                      <div class="preview-overlay">
                        <span class="preview-alt">{{ img.alt || 'Imagen' }}</span>
                      </div>
                    </div>
                    
                    <!-- Placeholders if no images -->
                    <div class="preview-image placeholder" *ngIf="!editableContent.images?.length">
                      <div class="preview-placeholder-icon">🖼️</div>
                      <span>Añade imágenes</span>
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
                <span class="label">IMAGES</span>
                <span class="value">{{ editableContent.images?.length || 0 }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">COLS</span>
                <span class="value">{{ editableContent.columns || 3 }}</span>
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
  styleUrl: './editor-gallery-isolated-mode.component.scss',
})
export class EditorGalleryIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvasElement') canvasRef!: ElementRef;

  private defaultImages: GalleryImageItem[] = [
    { src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0', alt: 'Proyecto 1', category: 'web' },
    { src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4', alt: 'Proyecto 2', category: 'app' },
    { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c', alt: 'Proyecto 3', category: 'design' },
    { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', alt: 'Proyecto 4', category: 'web' },
    { src: 'https://images.unsplash.com/photo-1551434678-e076c223a692', alt: 'Proyecto 5', category: 'app' },
    { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', alt: 'Proyecto 6', category: 'design' },
  ];

  protected initializeState(): void {
    const configImages = this.config?.content?.['images'] as GalleryImageItem[] | undefined;
    
    // Initialize content
    this.editableContent = {
      title: this.config?.content?.['title'] || 'Galería de Proyectos',
      subtitle: this.config?.content?.['subtitle'] || 'Explora nuestro trabajo reciente.',
      variant: this.config?.content?.['variant'] || 'default',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#0f172a',
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      columns: this.config?.content?.['columns'] || 3,
      images: configImages || [...this.defaultImages],
    };

    // Initialize styles
    this.editableStyles = this.config?.styles ? { ...this.config.styles } : {};

    // Initialize position and size
    this.currentPosition = this.config?.position || { x: 50, y: 50 };
    this.currentSize = this.config?.size || { width: 650, height: 450 };
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };

    // Save initial state
    this.saveState();
  }

  protected getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement || null;
  }

  addImage(): void {
    if (!this.editableContent.images) {
      this.editableContent.images = [];
    }
    this.editableContent.images.push({
      src: '',
      alt: 'Nueva Imagen',
      category: '',
    });
    this.saveState();
  }

  removeImage(index: number): void {
    if (this.editableContent.images && index >= 0 && index < this.editableContent.images.length) {
      this.editableContent.images.splice(index, 1);
      this.saveState();
    }
  }

  getPreviewImages(): GalleryImageItem[] {
    return this.editableContent.images || this.defaultImages;
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
        columns: this.editableContent.columns,
        images: this.editableContent.images || this.defaultImages,
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
