import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';
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
 * Spa Section Isolated Mode Component
 * 
 * Extends BaseIsolatedModeComponent to provide:
 * - Undo/Redo functionality
 * - Drag & Resize capabilities
 * - Grid snapping
 * - Keyboard shortcuts
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
                  <label>Nombre del Spa</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.spaName" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="Zen Spa & Wellness"
                  />
                </div>

                <div class="control-group">
                  <label>Tagline</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.tagline" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="Tu oasis de paz y relax"
                  />
                </div>

                <div class="control-group">
                  <label>Descripción</label>
                  <textarea 
                    [(ngModel)]="editableContent.description" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    rows="2"
                    placeholder="Breve descripción del spa"
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <select 
                    [(ngModel)]="editableContent.variant" 
                    (ngModelChange)="onVariantChange()"
                    class="premium-input"
                  >
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
                  <h4>TRATAMIENTOS ({{ editableContent.treatments?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addTreatment()">+</button>
                </div>

                <div class="treatments-list">
                  <div class="treatment-edit" *ngFor="let treatment of editableContent.treatments; let i = index">
                    <div class="treatment-header">
                      <span class="treatment-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeTreatment(i)">×</button>
                    </div>
                    
                    <div class="control-group">
                      <label>Nombre del Tratamiento</label>
                      <input 
                        type="text" 
                        [(ngModel)]="treatment.name" 
                        (ngModelChange)="onContentChange()"
                        class="premium-input" 
                        placeholder="Masaje Relajante"
                      />
                    </div>
                    
                    <div class="control-group">
                      <label>Descripción</label>
                      <textarea 
                        [(ngModel)]="treatment.description" 
                        (ngModelChange)="onContentChange()"
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
                          (ngModelChange)="onContentChange()"
                          class="premium-input" 
                          placeholder="60 min"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Precio</label>
                        <input 
                          type="text" 
                          [(ngModel)]="treatment.price" 
                          (ngModelChange)="onContentChange()"
                          class="premium-input" 
                          placeholder="89€"
                        />
                      </div>
                    </div>
                    
                    <div class="control-group">
                      <label>Beneficios (separados por coma)</label>
                      <input 
                        type="text" 
                        [ngModel]="getTreatmentBenefitsText(i)" 
                        (ngModelChange)="updateTreatmentBenefits(i, $event)"
                        class="premium-input" 
                        placeholder="Relax, Relajación muscular, Estrés"
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
                        placeholder="Sauna"
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

                <div class="testimonial-edit" *ngIf="editableContent.testimonial">
                  <div class="control-group">
                    <label>Autor</label>
                    <input 
                      type="text" 
                      [(ngModel)]="editableContent.testimonial.author" 
                      (ngModelChange)="onContentChange()"
                      class="premium-input" 
                      placeholder="María García"
                    />
                  </div>
                  
                  <div class="control-group">
                    <label>Cargo/Rol</label>
                    <input 
                      type="text" 
                      [(ngModel)]="editableContent.testimonial.role" 
                      (ngModelChange)="onContentChange()"
                      class="premium-input" 
                      placeholder="Cliente VIP"
                    />
                  </div>
                  
                  <div class="control-group">
                    <label>Comentario</label>
                    <textarea 
                      [(ngModel)]="editableContent.testimonial.quote" 
                      (ngModelChange)="onContentChange()"
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
                  class="preview-spa"
                  [style.background]="editableContent.backgroundColor || '#1a1a2e'"
                  [style.color]="editableContent.textColor || '#ffffff'"
                >
                  <div class="preview-header">
                    <h1 class="preview-title">{{ editableContent.spaName || 'Zen Spa & Wellness' }}</h1>
                    <p class="preview-tagline">{{ editableContent.tagline || 'Tu oasis de paz y relax' }}</p>
                    <p class="preview-description">{{ editableContent.description || 'Descubre el equilibrio perfecto entre cuerpo y mente' }}</p>
                  </div>
                  
                  <div class="preview-treatments-section" *ngIf="editableContent.treatments && editableContent.treatments.length > 0">
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

                  <div class="preview-features" *ngIf="editableContent.features && editableContent.features.length > 0">
                    <div class="preview-feature-item" *ngFor="let feature of editableContent.features">
                      <span class="preview-feature-icon">{{ feature.icon || '✨' }}</span>
                      <h4>{{ feature.title || 'Característica' }}</h4>
                      <p>{{ feature.description || 'Descripción' }}</p>
                    </div>
                  </div>

                  <div class="preview-testimonial" *ngIf="editableContent.testimonial">
                    <div class="testimonial-quote">"{{ editableContent.testimonial.quote || 'La mejor experiencia de spa que he tenido. Totalmente recomendado.' }}"</div>
                    <div class="testimonial-author">
                      <span class="author-name">{{ editableContent.testimonial.author || 'María García' }}</span>
                      <span class="author-role">{{ editableContent.testimonial.role || 'Cliente VIP' }}</span>
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
                <span class="value text-purple-400">{{ editableContent.variant || 'relaxing' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">TREATMENTS</span>
                <span class="value">{{ editableContent.treatments?.length || 0 }}</span>
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
  styleUrl: './editor-spa-isolated-mode.component.scss',
})
export class EditorSpaIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvasElement') canvasRef!: ElementRef;

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

  protected initializeState(): void {
    const configTreatments = this.config?.content?.['treatments'] as SpaTreatment[] | undefined;
    const configFeatures = this.config?.content?.['features'] as { title: string; description: string; icon: string }[] | undefined;
    
    // Initialize content
    this.editableContent = {
      spaName: this.config?.content?.['spaName'] || 'Zen Spa & Wellness',
      tagline: this.config?.content?.['tagline'] || 'Tu oasis de paz y relax',
      description: this.config?.content?.['description'] || 'Descubre el equilibrio perfecto entre cuerpo y mente',
      variant: this.config?.content?.['variant'] || 'relaxing',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#1a1a2e',
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      accentColor: this.config?.content?.['accentColor'] || '#a78bfa',
      buttonColor: this.config?.content?.['buttonColor'] || '#a78bfa',
      treatments: configTreatments || [...this.defaultTreatments],
      features: configFeatures || [...this.defaultFeatures],
      testimonial: this.config?.content?.['testimonial'] || { 
        author: 'María García', 
        role: 'Cliente VIP', 
        quote: 'La mejor experiencia de spa que he tenido. Totalmente recomendado.' 
      },
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

  addTreatment(): void {
    if (!this.editableContent.treatments) {
      this.editableContent.treatments = [];
    }
    this.editableContent.treatments.push({
      name: 'Nuevo Tratamiento',
      description: 'Descripción del nuevo tratamiento',
      duration: '60 min',
      price: '99€',
      benefits: ['Beneficio 1', 'Beneficio 2'],
    });
    this.saveState();
  }

  removeTreatment(index: number): void {
    if (this.editableContent.treatments && index >= 0 && index < this.editableContent.treatments.length) {
      this.editableContent.treatments.splice(index, 1);
      this.saveState();
    }
  }

  getTreatmentBenefitsText(treatmentIndex: number): string {
    if (this.editableContent.treatments && this.editableContent.treatments[treatmentIndex]) {
      return this.editableContent.treatments[treatmentIndex].benefits.join(', ');
    }
    return '';
  }

  updateTreatmentBenefits(treatmentIndex: number, benefitsText: string): void {
    if (this.editableContent.treatments && this.editableContent.treatments[treatmentIndex]) {
      this.editableContent.treatments[treatmentIndex].benefits = benefitsText.split(',').map(b => b.trim()).filter(b => b);
      this.saveState();
    }
  }

  addFeature(): void {
    if (!this.editableContent.features) {
      this.editableContent.features = [];
    }
    this.editableContent.features.push({
      title: 'Nueva Característica',
      description: 'Descripción',
      icon: '✨',
    });
    this.saveState();
  }

  removeFeature(index: number): void {
    if (this.editableContent.features && index >= 0 && index < this.editableContent.features.length) {
      this.editableContent.features.splice(index, 1);
      this.saveState();
    }
  }

  getPreviewTreatments(): SpaTreatment[] {
    return this.editableContent.treatments || this.defaultTreatments;
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
