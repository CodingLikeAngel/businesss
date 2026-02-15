import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

/**
 * Testimonial Item Interface for Isolated Mode
 */
export interface TestimonialIsolatedItem {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  rating?: number;
}

/**
 * Testimonials Section Isolated Mode Component
 * 
 * Extends BaseIsolatedModeComponent to provide:
 * - Undo/Redo functionality
 * - Drag & Resize capabilities
 * - Grid snapping
 * - Keyboard shortcuts
 */
@Component({
  selector: 'lib-editor-testimonials-isolated-mode',
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
            <span class="component-name">TESTIMONIALS SECTION</span>
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
                    placeholder="Ej: Lo que dicen nuestros clientes"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.subtitle" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="Ej: Historias reales de éxito"
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
                    <option value="carousel">Carrusel</option>
                    <option value="grid">Grid</option>
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

              <!-- TESTIMONIALS SECTION -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">💬</span>
                  <h4>TESTIMONIALS ({{ editableContent.testimonials?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addTestimonial()">+</button>
                </div>

                <div class="testimonials-list">
                  <div class="testimonial-item-edit" *ngFor="let item of editableContent.testimonials; let i = index">
                    <div class="testimonial-header">
                      <span class="testimonial-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeTestimonial(i)">×</button>
                    </div>
                    
                    <div class="control-group">
                      <label>Cita</label>
                      <textarea 
                        [(ngModel)]="item.quote" 
                        (ngModelChange)="onContentChange()"
                        class="premium-input h-20" 
                        placeholder="Lo que dice el cliente..."
                      ></textarea>
                    </div>
                    
                    <div class="testimonial-row">
                      <div class="control-group flex-1">
                        <label>Autor</label>
                        <input 
                          type="text" 
                          [(ngModel)]="item.author" 
                          (ngModelChange)="onContentChange()"
                          class="premium-input" 
                          placeholder="Nombre"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Rol</label>
                        <input 
                          type="text" 
                          [(ngModel)]="item.role" 
                          (ngModelChange)="onContentChange()"
                          class="premium-input" 
                          placeholder="Cargo, Empresa"
                        />
                      </div>
                    </div>
                    
                    <div class="control-group">
                      <label>Rating: {{ item.rating || 5 }} ⭐</label>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        [(ngModel)]="item.rating" 
                        (ngModelChange)="onContentChange()"
                        class="w-full"
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
                  class="preview-testimonials" 
                  [style.background]="getPreviewBackground()"
                  [style.color]="editableContent.textColor || '#ffffff'"
                >
                  <div class="preview-header" *ngIf="editableContent.title || editableContent.subtitle">
                    <h2 class="preview-title">{{ editableContent.title || 'Testimonios' }}</h2>
                    <p class="preview-subtitle">{{ editableContent.subtitle || 'Lo que dicen nuestros clientes' }}</p>
                  </div>
                  
                  <div class="preview-grid">
                    <div 
                      class="preview-testimonial" 
                      *ngFor="let item of (editableContent.testimonials || defaultTestimonials).slice(0, 3)"
                    >
                      <div class="preview-quote">"{{ item.quote || 'Excelente servicio...' }}"</div>
                      <div class="preview-author">
                        <div class="preview-avatar">{{ (item.avatar || 'https://i.pravatar.cc/150?u=test')[0] }}</div>
                        <div class="preview-info">
                          <div class="preview-name">{{ item.author || 'Nombre' }}</div>
                          <div class="preview-role">{{ item.role || 'Cargo' }}</div>
                        </div>
                      </div>
                      <div class="preview-rating">
                        <span *ngFor="let star of [1,2,3,4,5]">{{ star <= (item.rating || 5) ? '★' : '☆' }}</span>
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
                <span class="value text-purple-400">{{ editableContent.variant || 'default' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">ITEMS</span>
                <span class="value">{{ editableContent.testimonials?.length || 0 }}</span>
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
  styleUrl: './editor-testimonials-isolated-mode.component.scss',
})
export class EditorTestimonialsIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvasElement') canvasRef!: ElementRef;

  defaultTestimonials: TestimonialIsolatedItem[] = [
    { quote: "Increíble atención al detalle y un diseño que supera todas las expectativas.", author: "Ana García", role: "CEO, TechFlow", rating: 5 },
    { quote: "Nuestra conversión aumentó un 200% gracias a la nueva web.", author: "Carlos Ruiz", role: "Marketing Director", rating: 5 },
    { quote: "Profesionales, rápidos y con una calidad estética insuperable.", author: "Elena M.", role: "Fundadora, EcoLife", rating: 4 },
  ];

  protected initializeState(): void {
    // Initialize content
    this.editableContent = {
      title: this.config?.content?.['title'] || 'Lo que dicen nuestros clientes',
      subtitle: this.config?.content?.['subtitle'] || 'Historias reales de éxito.',
      variant: this.config?.content?.['variant'] || 'default',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#0f172a',
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      testimonials: this.config?.content?.['testimonials'] || [...this.defaultTestimonials],
    };

    // Initialize styles
    this.editableStyles = this.config?.styles ? { ...this.config.styles } : {};

    // Initialize position and size
    this.currentPosition = this.config?.position || { x: 50, y: 50 };
    this.currentSize = this.config?.size || { width: 600, height: 400 };
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };

    // Save initial state
    this.saveState();
  }

  protected getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement || null;
  }

  addTestimonial(): void {
    if (!this.editableContent.testimonials) {
      this.editableContent.testimonials = [];
    }
    this.editableContent.testimonials.push({
      quote: "Nuevo testimonio del cliente.",
      author: "Nuevo Cliente",
      role: "Empresa",
      rating: 5,
    });
    this.saveState();
  }

  removeTestimonial(index: number): void {
    if (this.editableContent.testimonials && index >= 0 && index < this.editableContent.testimonials.length) {
      this.editableContent.testimonials.splice(index, 1);
      this.saveState();
    }
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
        testimonials: this.editableContent.testimonials,
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
