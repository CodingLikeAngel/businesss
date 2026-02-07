import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
 * Testimonials Section Isolated Mode Content
 */
export interface TestimonialsIsolatedModeContent {
  title?: string;
  subtitle?: string;
  variant?: string;
  testimonials?: TestimonialIsolatedItem[];
  backgroundColor?: string;
  textColor?: string;
}

/**
 * Testimonials Section Isolated Mode Component
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
                    placeholder="Ej: Lo que dicen nuestros clientes"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.subtitle" 
                    class="premium-input" 
                    placeholder="Ej: Historias reales de éxito"
                  />
                </div>

                <div class="control-group">
                  <label>Variante</label>
                  <select [(ngModel)]="content.variant" class="premium-input">
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

              <!-- TESTIMONIALS SECTION -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">💬</span>
                  <h4>TESTIMONIALS ({{ content.testimonials?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addTestimonial()">+</button>
                </div>

                <div class="testimonials-list">
                  <div class="testimonial-item-edit" *ngFor="let item of content.testimonials; let i = index">
                    <div class="testimonial-header">
                      <span class="testimonial-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeTestimonial(i)">×</button>
                    </div>
                    
                    <div class="control-group">
                      <label>Cita</label>
                      <textarea 
                        [(ngModel)]="item.quote" 
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
                          class="premium-input" 
                          placeholder="Nombre"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Rol</label>
                        <input 
                          type="text" 
                          [(ngModel)]="item.role" 
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
                        class="w-full"
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
                class="preview-testimonials" 
                [style.background]="getPreviewBackground()"
                [style.color]="content.textColor || '#ffffff'"
              >
                <div class="preview-header" *ngIf="content.title || content.subtitle">
                  <h2 class="preview-title">{{ content.title || 'Testimonios' }}</h2>
                  <p class="preview-subtitle">{{ content.subtitle || 'Lo que dicen nuestros clientes' }}</p>
                </div>
                
                <div class="preview-grid">
                  <div 
                    class="preview-testimonial" 
                    *ngFor="let item of (content.testimonials || defaultTestimonials).slice(0, 3)"
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
            </div>

            <!-- Info Dock -->
            <div class="modern-position-dock">
              <div class="dock-item">
                <span class="label">VARIANT</span>
                <span class="value text-purple-400">{{ content.variant || 'default' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">ITEMS</span>
                <span class="value">{{ content.testimonials?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Gestiona los testimonios de tus clientes.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editor-testimonials-isolated-mode.component.scss',
})
export class EditorTestimonialsIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() public config!: IsolatedModeConfig;
  @Output() public closed = new EventEmitter<void>();
  @Output() public applied = new EventEmitter<IsolatedModeConfig>();

  public content: TestimonialsIsolatedModeContent = {};
  
  public defaultTestimonials: TestimonialIsolatedItem[] = [
    { quote: "Increíble atención al detalle y un diseño que supera todas las expectativas.", author: "Ana García", role: "CEO, TechFlow", rating: 5 },
    { quote: "Nuestra conversión aumentó un 200% gracias a la nueva web.", author: "Carlos Ruiz", role: "Marketing Director", rating: 5 },
    { quote: "Profesionales, rápidos y con una calidad estética insuperable.", author: "Elena M.", role: "Fundadora, EcoLife", rating: 4 },
  ];

  ngOnInit() {
    this.content = {
      title: this.config?.content?.['title'] || 'Lo que dicen nuestros clientes',
      subtitle: this.config?.content?.['subtitle'] || 'Historias reales de éxito.',
      variant: this.config?.content?.['variant'] || 'default',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#0f172a',
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      testimonials: this.config?.content?.['testimonials'] || this.defaultTestimonials,
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

  public addTestimonial() {
    if (!this.content.testimonials) {
      this.content.testimonials = [];
    }
    this.content.testimonials.push({
      quote: "Nuevo testimonio del cliente.",
      author: "Nuevo Cliente",
      role: "Empresa",
      rating: 5,
    });
  }

  public removeTestimonial(index: number) {
    if (this.content.testimonials && index >= 0 && index < this.content.testimonials.length) {
      this.content.testimonials.splice(index, 1);
    }
  }

  public apply() {
    const contentObj: Record<string, any> = {
      title: this.content.title,
      subtitle: this.content.subtitle,
      variant: this.content.variant,
      backgroundColor: this.content.backgroundColor,
      textColor: this.content.textColor,
      testimonials: this.content.testimonials,
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
