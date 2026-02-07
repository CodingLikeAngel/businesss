import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

/**
 * Gym Class Interface
 */
export interface GymClass {
  name: string;
  description: string;
  duration: string;
  intensity: string;
  schedule: string;
  instructor: string;
  imageUrl?: string;
}

/**
 * Gym Membership Plan Interface
 */
export interface GymMembershipPlan {
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

/**
 * Gym Isolated Mode Content
 */
export interface GymIsolatedModeContent {
  gymName?: string;
  tagline?: string;
  description?: string;
  classes?: GymClass[];
  plans?: GymMembershipPlan[];
  stats?: { icon: string; value: string; label: string }[];
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  buttonColor?: string;
}

/**
 * Gym Section Isolated Mode Component
 */
@Component({
  selector: 'lib-editor-gym-isolated-mode',
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
            <span class="component-name">GYM SECTION</span>
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
                  <label>Nombre del Gimnasio</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.gymName" 
                    class="premium-input" 
                    placeholder="FitPower Gym"
                  />
                </div>

                <div class="control-group">
                  <label>Tagline</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.tagline" 
                    class="premium-input" 
                    placeholder="Transforma tu cuerpo, transforma tu vida"
                  />
                </div>

                <div class="control-group">
                  <label>Descripción</label>
                  <textarea 
                    [(ngModel)]="content.description" 
                    class="premium-input" 
                    rows="2"
                    placeholder="Breve descripción del gimnasio"
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <select [(ngModel)]="content.variant" class="premium-input">
                    <option value="energetic">Energético</option>
                    <option value="modern">Moderno</option>
                    <option value="classic">Clásico</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>

              <!-- CLASSES SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">💪</span>
                  <h4>CLASES ({{ content.classes?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addClass()">+</button>
                </div>

                <div class="classes-list">
                  <div class="class-edit" *ngFor="let cls of content.classes; let i = index">
                    <div class="class-header">
                      <span class="class-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeClass(i)">×</button>
                    </div>
                    
                    <div class="control-group">
                      <label>Nombre de la Clase</label>
                      <input 
                        type="text" 
                        [(ngModel)]="cls.name" 
                        class="premium-input" 
                        placeholder="CrossFit"
                      />
                    </div>
                    
                    <div class="control-group">
                      <label>Descripción</label>
                      <textarea 
                        [(ngModel)]="cls.description" 
                        class="premium-input" 
                        rows="2"
                        placeholder="Descripción de la clase"
                      ></textarea>
                    </div>
                    
                    <div class="class-row">
                      <div class="control-group flex-1">
                        <label>Duración</label>
                        <input 
                          type="text" 
                          [(ngModel)]="cls.duration" 
                          class="premium-input" 
                          placeholder="60 min"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Intensidad</label>
                        <select [(ngModel)]="cls.intensity" class="premium-input">
                          <option value="baja">Baja</option>
                          <option value="media">Media</option>
                          <option value="alta">Alta</option>
                        </select>
                      </div>
                    </div>
                    
                    <div class="class-row">
                      <div class="control-group flex-1">
                        <label>Horario</label>
                        <input 
                          type="text" 
                          [(ngModel)]="cls.schedule" 
                          class="premium-input" 
                          placeholder="L-V: 8:00, 18:00"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Instructor</label>
                        <input 
                          type="text" 
                          [(ngModel)]="cls.instructor" 
                          class="premium-input" 
                          placeholder="Juan Pérez"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- PLANS SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">💳</span>
                  <h4>PLANES ({{ content.plans?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addPlan()">+</button>
                </div>

                <div class="plans-list">
                  <div class="plan-edit" *ngFor="let plan of content.plans; let i = index">
                    <div class="plan-header">
                      <span class="plan-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removePlan(i)">×</button>
                    </div>
                    
                    <div class="control-group">
                      <label>Nombre del Plan</label>
                      <input 
                        type="text" 
                        [(ngModel)]="plan.name" 
                        class="premium-input" 
                        placeholder="Plan Básico"
                      />
                    </div>
                    
                    <div class="plan-row">
                      <div class="control-group flex-1">
                        <label>Precio</label>
                        <input 
                          type="text" 
                          [(ngModel)]="plan.price" 
                          class="premium-input" 
                          placeholder="29.99€"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>
                          <input type="checkbox" [(ngModel)]="plan.isPopular" />
                          Popular
                        </label>
                      </div>
                    </div>
                    
                    <div class="control-group">
                      <label>Características (una por línea)</label>
                      <textarea 
                        [(ngModel)]="planFeaturesText" 
                        class="premium-input" 
                        rows="3"
                        placeholder="Acceso a sala&#10;Clases grupales&#10;Parking gratuito"
                        (change)="updatePlanFeatures(i)"
                      ></textarea>
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
                class="preview-gym"
                [style.background]="content.backgroundColor || '#0f172a'"
                [style.color]="content.textColor || '#ffffff'"
              >
                <div class="preview-header">
                  <h1 class="preview-title">{{ content.gymName || 'FitPower Gym' }}</h1>
                  <p class="preview-tagline">{{ content.tagline || 'Transforma tu cuerpo, transforma tu vida' }}</p>
                  <p class="preview-description">{{ content.description || 'El mejor gimnasio de la ciudad' }}</p>
                </div>
                
                <div class="preview-classes-section" *ngIf="content.classes && content.classes.length > 0">
                  <h3 class="preview-section-title">Clases Destacadas</h3>
                  <div class="preview-classes-grid">
                    <div class="preview-class-card" *ngFor="let cls of getPreviewClasses()">
                      <div class="preview-class-icon">🏋️</div>
                      <h4>{{ cls.name || 'Clase' }}</h4>
                      <p class="preview-class-desc">{{ cls.description || 'Descripción' }}</p>
                      <div class="preview-class-meta">
                        <span>{{ cls.duration || '60 min' }}</span>
                        <span [class]="'intensity-' + (cls.intensity || 'media')">{{ cls.intensity || 'Media' }}</span>
                      </div>
                      <p class="preview-class-schedule">{{ cls.schedule || 'Horario' }}</p>
                    </div>
                  </div>
                </div>

                <div class="preview-plans-section" *ngIf="content.plans && content.plans.length > 0">
                  <h3 class="preview-section-title">Planes de Membresía</h3>
                  <div class="preview-plans-grid">
                    <div 
                      class="preview-plan-card" 
                      *ngFor="let plan of content.plans"
                      [class.popular]="plan.isPopular"
                    >
                      <span class="popular-badge" *ngIf="plan.isPopular">Más Popular</span>
                      <h4>{{ plan.name || 'Plan' }}</h4>
                      <div class="preview-plan-price">{{ plan.price || '29.99€' }}</div>
                      <ul class="preview-plan-features">
                        <li *ngFor="let feature of plan.features">{{ feature }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Info Dock -->
            <div class="modern-position-dock">
              <div class="dock-item">
                <span class="label">VARIANT</span>
                <span class="value text-purple-400">{{ content.variant || 'energetic' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">CLASSES</span>
                <span class="value">{{ content.classes?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Edita tu sección de gimnasio.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editor-gym-isolated-mode.component.scss',
})
export class EditorGymIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() public config!: IsolatedModeConfig;
  @Output() public closed = new EventEmitter<void>();
  @Output() public applied = new EventEmitter<IsolatedModeConfig>();

  public content: GymIsolatedModeContent = {};
  public planFeaturesText: string = '';
  
  private defaultClasses: GymClass[] = [
    { name: 'CrossFit', description: 'Entrenamiento funcional de alta intensidad', duration: '60 min', intensity: 'alta', schedule: 'L-V: 8:00, 18:00', instructor: 'Carlos Ruiz' },
    { name: 'Yoga', description: 'Clase de yoga para flexibilidad y relajación', duration: '75 min', intensity: 'baja', schedule: 'L-V: 7:00, 19:00', instructor: 'María García' },
    { name: 'Spinning', description: 'Entrenamiento cardiovascular en bicicleta', duration: '45 min', intensity: 'alta', schedule: 'L-V: 6:00, 17:00', instructor: 'Ana López' },
  ];

  private defaultPlans: GymMembershipPlan[] = [
    { name: 'Básico', price: '29.99€', features: ['Acceso a sala', 'Horarios limitados'], isPopular: false },
    { name: 'Premium', price: '49.99€', features: ['Acceso ilimitado', 'Clases grupales', 'Sauna'], isPopular: true },
    { name: 'VIP', price: '79.99€', features: ['Todo Premium', 'Entrenador personal', 'Nutrición'], isPopular: false },
  ];

  ngOnInit() {
    const configClasses = this.config?.content?.['classes'] as GymClass[] | undefined;
    const configPlans = this.config?.content?.['plans'] as GymMembershipPlan[] | undefined;
    
    this.content = {
      gymName: this.config?.content?.['gymName'] || 'FitPower Gym',
      tagline: this.config?.content?.['tagline'] || 'Transforma tu cuerpo, transforma tu vida',
      description: this.config?.content?.['description'] || 'El mejor gimnasio de la ciudad',
      variant: this.config?.content?.['variant'] || 'energetic',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#0f172a',
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      accentColor: this.config?.content?.['accentColor'] || '#ef4444',
      buttonColor: this.config?.content?.['buttonColor'] || '#ef4444',
      classes: configClasses || this.defaultClasses,
      plans: configPlans || this.defaultPlans,
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

  public addClass() {
    if (!this.content.classes) {
      this.content.classes = [];
    }
    this.content.classes.push({
      name: 'Nueva Clase',
      description: 'Descripción de la nueva clase',
      duration: '60 min',
      intensity: 'media',
      schedule: 'L-V: 9:00',
      instructor: 'Instructor',
    });
  }

  public removeClass(index: number) {
    if (this.content.classes && index >= 0 && index < this.content.classes.length) {
      this.content.classes.splice(index, 1);
    }
  }

  public addPlan() {
    if (!this.content.plans) {
      this.content.plans = [];
    }
    this.content.plans.push({
      name: 'Nuevo Plan',
      price: '39.99€',
      features: ['Característica 1', 'Característica 2'],
      isPopular: false,
    });
  }

  public removePlan(index: number) {
    if (this.content.plans && index >= 0 && index < this.content.plans.length) {
      this.content.plans.splice(index, 1);
    }
  }

  public updatePlanFeatures(planIndex: number) {
    if (this.content.plans && this.content.plans[planIndex]) {
      this.content.plans[planIndex].features = this.planFeaturesText.split('\n').filter(f => f.trim());
    }
  }

  public getPreviewClasses(): GymClass[] {
    return this.content.classes || this.defaultClasses;
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
