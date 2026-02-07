import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
 * Gallery Isolated Mode Content
 */
export interface GalleryIsolatedModeContent {
  title?: string;
  subtitle?: string;
  variant?: string;
  images?: GalleryImageItem[];
  backgroundColor?: string;
  textColor?: string;
  columns?: number;
}

/**
 * Gallery Section Isolated Mode Component
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
                    placeholder="Galería de Proyectos"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.subtitle" 
                    class="premium-input" 
                    placeholder="Explora nuestro trabajo reciente"
                  />
                </div>

                <div class="control-group">
                  <label>Variante</label>
                  <select [(ngModel)]="content.variant" class="premium-input">
                    <option value="default">Default</option>
                    <option value="grid">Grid</option>
                    <option value="masonry">Masonry</option>
                    <option value="carousel">Carrusel</option>
                    <option value="masonry">Mosaic</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Columnas: {{ content.columns || 3 }}</label>
                  <input 
                    type="range" 
                    min="2" 
                    max="6" 
                    [(ngModel)]="content.columns" 
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

              <!-- IMAGES SECTION -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">🖼️</span>
                  <h4>IMÁGENES ({{ content.images?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addImage()">+</button>
                </div>

                <div class="images-list">
                  <div class="image-item-edit" *ngFor="let img of content.images; let i = index">
                    <div class="image-header">
                      <span class="image-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeImage(i)">×</button>
                    </div>
                    
                    <div class="control-group">
                      <label>URL de Imagen</label>
                      <input 
                        type="text" 
                        [(ngModel)]="img.src" 
                        class="premium-input" 
                        placeholder="https://"
                      />
                    </div>
                    
                    <div class="control-group">
                      <label>Texto Alternativo</label>
                      <input 
                        type="text" 
                        [(ngModel)]="img.alt" 
                        class="premium-input" 
                        placeholder="Descripción de la imagen"
                      />
                    </div>
                    
                    <div class="control-group">
                      <label>Categoría</label>
                      <input 
                        type="text" 
                        [(ngModel)]="img.category" 
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
          <div class="isolated-canvas">
            <div class="canvas-inner">
              <div 
                class="preview-gallery" 
                [style.background]="getPreviewBackground()"
                [style.color]="content.textColor || '#ffffff'"
              >
                <div class="preview-header" *ngIf="content.title || content.subtitle">
                  <h2 class="preview-title">{{ content.title || 'Galería' }}</h2>
                  <p class="preview-subtitle">{{ content.subtitle || 'Explora nuestro trabajo' }}</p>
                </div>
                
                <div class="preview-grid" [style.gridTemplateColumns]="'repeat(' + (content.columns || 3) + ', 1fr)'">
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
                  <div class="preview-image placeholder" *ngIf="!content.images?.length">
                    <div class="preview-placeholder-icon">🖼️</div>
                    <span>Añade imágenes</span>
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
                <span class="label">IMAGES</span>
                <span class="value">{{ content.images?.length || 0 }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">COLS</span>
                <span class="value">{{ content.columns || 3 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Gestiona las imágenes de tu galería.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editor-gallery-isolated-mode.component.scss',
})
export class EditorGalleryIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() public config!: IsolatedModeConfig;
  @Output() public closed = new EventEmitter<void>();
  @Output() public applied = new EventEmitter<IsolatedModeConfig>();

  public content: GalleryIsolatedModeContent = {};
  
  private defaultImages: GalleryImageItem[] = [
    { src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0', alt: 'Proyecto 1', category: 'web' },
    { src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4', alt: 'Proyecto 2', category: 'app' },
    { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c', alt: 'Proyecto 3', category: 'design' },
    { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', alt: 'Proyecto 4', category: 'web' },
    { src: 'https://images.unsplash.com/photo-1551434678-e076c223a692', alt: 'Proyecto 5', category: 'app' },
    { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', alt: 'Proyecto 6', category: 'design' },
  ];

  ngOnInit() {
    const configImages = this.config?.content?.['images'] as GalleryImageItem[] | undefined;
    
    this.content = {
      title: this.config?.content?.['title'] || 'Galería de Proyectos',
      subtitle: this.config?.content?.['subtitle'] || 'Explora nuestro trabajo reciente.',
      variant: this.config?.content?.['variant'] || 'default',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#0f172a',
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      columns: this.config?.content?.['columns'] || 3,
      images: configImages || this.defaultImages,
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

  public addImage() {
    if (!this.content.images) {
      this.content.images = [];
    }
    this.content.images.push({
      src: '',
      alt: 'Nueva Imagen',
      category: '',
    });
  }

  public removeImage(index: number) {
    if (this.content.images && index >= 0 && index < this.content.images.length) {
      this.content.images.splice(index, 1);
    }
  }

  public getPreviewImages(): GalleryImageItem[] {
    return this.content.images || this.defaultImages;
  }

  public apply() {
    const contentObj: Record<string, any> = {
      title: this.content.title,
      subtitle: this.content.subtitle,
      variant: this.content.variant,
      backgroundColor: this.content.backgroundColor,
      textColor: this.content.textColor,
      columns: this.content.columns,
      images: this.content.images || this.defaultImages,
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
