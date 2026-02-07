import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

/**
 * Spa Treatment Interface
 */
export interface SpaTreatment {
  name: string;
  description: string;
  duration: string;
  price: string;
  benefits: string[];
  imageUrl?: string;
}

/**
 * Spa Isolated Mode Content
 */
export interface SpaIsolatedModeContent {
  spaName?: string;
  tagline?: string;
  description?: string;
  treatments?: SpaTreatment[];
  features?: { title: string; description: string; icon: string }[];
  testimonial?: { author: string; role: string; quote: string; avatar?: string };
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  buttonColor?: string;
}

/**
 * Spa Section Isolated Mode Component
 */
@Component({
  selector: 'lib-editor-spa-isolated-mode',
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
            <span class="component-name">SPA SECTION</span>
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
                  <label>Nombre del Spa</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.spaName" 
                    class="premium-input" 
                    placeholder="Zen Spa & Wellness"
                  />
                </div>

                <div class="control-group">
                  <label>Tagline</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.tagline" 
                    class="premium-input" 
                    placeholder="Tu oasis de paz y relax"
                  />
                </div>

                <div class="control-group">
                  <label>Descripción</label>
                  <textarea 
                    [(ngModel)]="content.description" 
                    class="premium-input" 
                    rows="2"
                    placeholder="Breve descripción del spa"
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <select [(ngModel)]="content.variant" class="premium-input">
                    <option value="relaxing">Relajante</option>
                    <option value="luxury">Lujo</option>
                    <option value="natural">Natural</option>
                    <option value="minimal">Minimalista</option>
                  </select>
                </div>
              </div>

              <!-- TREATMENTS SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🌸</span>
                  <h4>TRATAMIENTOS ({{ content.treatments?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addTreatment()">+</button>
                </div>

                <div class="treatments-list">
                  <div class="treatment-edit" *ngFor="let treatment of content.treatments; let i = index">
                    <div class="treatment-header">
                      <span class="treatment-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeTreatment(i)">×</button>
                    </div>
                    
                    <div class="control-group">
                      <label>Nombre del Tratamiento</label>
                      <input 
                        type="text" 
                        [(ngModel)]="treatment.name" 
                        class="premium-input" 
                        placeholder="Masaje Relajante"
                      />
                    </div>
                    
                    <div class="control-group">
                      <label>Descripción</label>
                      <textarea 
                        [(ngModel)]="treatment.description" 
                        class="premium-input" 
                        rows="2"
                        placeholder="Descripción del tratamiento"
                      ></textarea>
                    </div>
                    
                    <div class="treatment-row">
                      <div class="control-group flex-1">
                        <label>Duración</label>
                        <input 
                          type="text" 
                          [(ngModel)]="treatment.duration" 
                          class="premium-input" 
                          placeholder="60 min"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Precio</label>
                        <input 
                          type="text" 
                          [(ngModel)]="treatment.price" 
                          class="premium-input" 
                          placeholder="89€"
                        />
                      </div>
                    </div>
                    
                    <div class="control-group">
                      <label>Beneficios (separados por coma)</label>
                      <input 
                        type="text" 
                        [(ngModel)]="treatmentBenefitsText" 
                        class="premium-input" 
                        placeholder="Relax, Relajación muscular, Estrés"
                        (change)="updateTreatmentBenefits(i)"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- FEATURES SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">✨</span>
                  <h4>CARACTERÍSTICAS</h4>
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
                        placeholder="Sauna"
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
                        placeholder="🧖"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- TESTIMONIAL SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">💬</span>
                  <h4>TESTIMONIO</h4>
                </div>

                <div class="testimonial-edit" *ngIf="content.testimonial">
                  <div class="control-group">
                    <label>Autor</label>
                    <input 
                      type="text" 
                      [(ngModel)]="content.testimonial.author" 
                      class="premium-input" 
                      placeholder="María García"
                    />
                  </div>
                  
                  <div class="control-group">
                    <label>Cargo/Rol</label>
                    <input 
                      type="text" 
                      [(ngModel)]="content.testimonial.role" 
                      class="premium-input" 
                      placeholder="Cliente VIP"
                    />
                  </div>
                  
                  <div class="control-group">
                    <label>Comentario</label>
                    <textarea 
                      [(ngModel)]="content.testimonial.quote" 
                      class="premium-input" 
                      rows="3"
                      placeholder="La mejor experiencia de spa..."
                    ></textarea>
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
                class="preview-spa"
                [style.background]="content.backgroundColor || '#1a1a2e'"
                [style.color]="content.textColor || '#ffffff'"
              >
                <div class="preview-header">
                  <h1 class="preview-title">{{ content.spaName || 'Zen Spa & Wellness' }}</h1>
                  <p class="preview-tagline">{{ content.tagline || 'Tu oasis de paz y relax' }}</p>
                  <p class="preview-description">{{ content.description || 'Descubre el equilibrio perfecto entre cuerpo y mente' }}</p>
                </div>
                
                <div class="preview-treatments-section" *ngIf="content.treatments && content.treatments.length > 0">
                  <h3 class="preview-section-title">Nuestros Tratamientos</h3>
                  <div class="preview-treatments-grid">
                    <div class="preview-treatment-card" *ngFor="let treatment of getPreviewTreatments()">
                      <div class="preview-treatment-icon">🌸</div>
                      <h4>{{ treatment.name || 'Tratamiento' }}</h4>
                      <p class="preview-treatment-desc">{{ treatment.description || 'Descripción' }}</p>
                      <div class="preview-treatment-meta">
                        <span>{{ treatment.duration || '60 min' }}</span>
                        <span class="preview-treatment-price">{{ treatment.price || '89€' }}</span>
                      </div>
                      <div class="preview-treatment-benefits">
                        <span class="benefit-tag" *ngFor="let benefit of treatment.benefits">{{ benefit }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="preview-features" *ngIf="content.features && content.features.length > 0">
                  <div class="preview-feature-item" *ngFor="let feature of content.features">
                    <span class="preview-feature-icon">{{ feature.icon || '✨' }}</span>
                    <h4>{{ feature.title || 'Característica' }}</h4>
                    <p>{{ feature.description || 'Descripción' }}</p>
                  </div>
                </div>

                <div class="preview-testimonial" *ngIf="content.testimonial">
                  <div class="testimonial-quote">"{{ content.testimonial.quote || 'La mejor experiencia de spa que he tenido. Totalmente recomendado.' }}"</div>
                  <div class="testimonial-author">
                    <span class="author-name">{{ content.testimonial.author || 'María García' }}</span>
                    <span class="author-role">{{ content.testimonial.role || 'Cliente VIP' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Info Dock -->
            <div class="modern-position-dock">
              <div class="dock-item">
                <span class="label">VARIANT</span>
                <span class="value text-purple-400">{{ content.variant || 'relaxing' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">TREATMENTS</span>
                <span class="value">{{ content.treatments?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Edita tu sección de spa.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editor-spa-isolated-mode.component.scss',
})
export class EditorSpaIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() public config!: IsolatedModeConfig;
  @Output() public closed = new EventEmitter<void>();
  @Output() public applied = new EventEmitter<IsolatedModeConfig>();

  public content: SpaIsolatedModeContent = {};
  public treatmentBenefitsText: string = '';
  
  private defaultTreatments: SpaTreatment[] = [
    { name: 'Masaje Relajante', description: 'Masaje suave para reducir el estrés', duration: '60 min', price: '89€', benefits: ['Relax', 'Alivio muscular'] },
    { name: 'Facial Rejuvenecedor', description: 'Tratamiento facial con productos naturales', duration: '45 min', price: '120€', benefits: ['Hidratación', 'Luminosidad'] },
    { name: 'Aromaterapia', description: 'Tratamiento con aceites esenciales', duration: '90 min', price: '150€', benefits: ['Equilibrio', 'Bienestar'] },
  ];

  private defaultFeatures = [
    { title: 'Sauna', description: 'Sauna de madera natural', icon: '🧖' },
    { title: 'Piscina Temperada', description: 'Agua termal a 32°C', icon: '🏊' },
    { title: 'Habitaciones de Relax', description: 'Zonas de descanso silenciosas', icon: '🛋️' },
  ];

  ngOnInit() {
    const configTreatments = this.config?.content?.['treatments'] as SpaTreatment[] | undefined;
    const configFeatures = this.config?.content?.['features'] as { title: string; description: string; icon: string }[] | undefined;
    
    this.content = {
      spaName: this.config?.content?.['spaName'] || 'Zen Spa & Wellness',
      tagline: this.config?.content?.['tagline'] || 'Tu oasis de paz y relax',
      description: this.config?.content?.['description'] || 'Descubre el equilibrio perfecto entre cuerpo y mente',
      variant: this.config?.content?.['variant'] || 'relaxing',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#1a1a2e',
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      accentColor: this.config?.content?.['accentColor'] || '#a78bfa',
      buttonColor: this.config?.content?.['buttonColor'] || '#a78bfa',
      treatments: configTreatments || this.defaultTreatments,
      features: configFeatures || this.defaultFeatures,
      testimonial: this.config?.content?.['testimonial'] || { 
        author: 'María García', 
        role: 'Cliente VIP', 
        quote: 'La mejor experiencia de spa que he tenido. Totalmente recomendado.' 
      },
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

  public addTreatment() {
    if (!this.content.treatments) {
      this.content.treatments = [];
    }
    this.content.treatments.push({
      name: 'Nuevo Tratamiento',
      description: 'Descripción del nuevo tratamiento',
      duration: '60 min',
      price: '99€',
      benefits: ['Beneficio 1', 'Beneficio 2'],
    });
  }

  public removeTreatment(index: number) {
    if (this.content.treatments && index >= 0 && index < this.content.treatments.length) {
      this.content.treatments.splice(index, 1);
    }
  }

  public updateTreatmentBenefits(treatmentIndex: number) {
    if (this.content.treatments && this.content.treatments[treatmentIndex]) {
      this.content.treatments[treatmentIndex].benefits = this.treatmentBenefitsText.split(',').map(b => b.trim()).filter(b => b);
    }
  }

  public addFeature() {
    if (!this.content.features) {
      this.content.features = [];
    }
    this.content.features.push({
      title: 'Nueva Característica',
      description: 'Descripción',
      icon: '✨',
    });
  }

  public removeFeature(index: number) {
    if (this.content.features && index >= 0 && index < this.content.features.length) {
      this.content.features.splice(index, 1);
    }
  }

  public getPreviewTreatments(): SpaTreatment[] {
    return this.content.treatments || this.defaultTreatments;
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
