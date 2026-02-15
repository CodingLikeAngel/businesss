import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';
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
 * Gym Section Isolated Mode Component
 * 
 * Extends BaseIsolatedModeComponent to provide:
 * - Undo/Redo functionality
 * - Drag & Resize capabilities
 * - Grid snapping
 * - Keyboard shortcuts
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
                  <label>Nombre del Gimnasio</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.gymName" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="FitPower Gym"
                  />
                </div>

                <div class="control-group">
                  <label>Tagline</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.tagline" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="Transforma tu cuerpo, transforma tu vida"
                  />
                </div>

                <div class="control-group">
                  <label>Descripción</label>
                  <textarea 
                    [(ngModel)]="editableContent.description" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    rows="2"
                    placeholder="Breve descripción del gimnasio"
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <select 
                    [(ngModel)]="editableContent.variant" 
                    (ngModelChange)="onVariantChange()"
                    class="premium-input"
                  >
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
                  <h4>CLASES ({{ editableContent.classes?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addClass()">+</button>
                </div>

                <div class="classes-list">
                  <div class="class-edit" *ngFor="let cls of editableContent.classes; let i = index">
                    <div class="class-header">
                      <span class="class-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeClass(i)">×</button>
                    </div>
                    
                    <div class="control-group">
                      <label>Nombre de la Clase</label>
                      <input 
                        type="text" 
                        [(ngModel)]="cls.name" 
                        (ngModelChange)="onContentChange()"
                        class="premium-input" 
                        placeholder="CrossFit"
                      />
                    </div>
                    
                    <div class="control-group">
                      <label>Descripción</label>
                      <textarea 
                        [(ngModel)]="cls.description" 
                        (ngModelChange)="onContentChange()"
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
                          (ngModelChange)="onContentChange()"
                          class="premium-input" 
                          placeholder="60 min"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Intensidad</label>
                        <select [(ngModel)]="cls.intensity" (ngModelChange)="onContentChange()" class="premium-input">
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
                          (ngModelChange)="onContentChange()"
                          class="premium-input" 
                          placeholder="L-V: 8:00, 18:00"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Instructor</label>
                        <input 
                          type="text" 
                          [(ngModel)]="cls.instructor" 
                          (ngModelChange)="onContentChange()"
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
                  <h4>PLANES ({{ editableContent.plans?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addPlan()">+</button>
                </div>

                <div class="plans-list">
                  <div class="plan-edit" *ngFor="let plan of editableContent.plans; let i = index">
                    <div class="plan-header">
                      <span class="plan-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removePlan(i)">×</button>
                    </div>
                    
                    <div class="control-group">
                      <label>Nombre del Plan</label>
                      <input 
                        type="text" 
                        [(ngModel)]="plan.name" 
                        (ngModelChange)="onContentChange()"
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
                          (ngModelChange)="onContentChange()"
                          class="premium-input" 
                          placeholder="29.99€"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>
                          <input type="checkbox" [(ngModel)]="plan.isPopular" (ngModelChange)="onContentChange()" />
                          Popular
                        </label>
                      </div>
                    </div>
                    
                    <div class="control-group">
                      <label>Características (una por línea)</label>
                      <textarea 
                        [ngModel]="getPlanFeaturesText(i)"
                        (ngModelChange)="updatePlanFeatures(i, $event)"
                        class="premium-input" 
                        rows="3"
                        placeholder="Acceso a sala&#10;Clases grupales&#10;Parking gratuito"
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
                  class="preview-gym"
                  [style.background]="editableContent.backgroundColor || '#0f172a'"
                  [style.color]="editableContent.textColor || '#ffffff'"
                >
                  <div class="preview-header">
                    <h1 class="preview-title">{{ editableContent.gymName || 'FitPower Gym' }}</h1>
                    <p class="preview-tagline">{{ editableContent.tagline || 'Transforma tu cuerpo, transforma tu vida' }}</p>
                    <p class="preview-description">{{ editableContent.description || 'El mejor gimnasio de la ciudad' }}</p>
                  </div>
                  
                  <div class="preview-classes-section" *ngIf="editableContent.classes && editableContent.classes.length > 0">
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

                  <div class="preview-plans-section" *ngIf="editableContent.plans && editableContent.plans.length > 0">
                    <h3 class="preview-section-title">Planes de Membresía</h3>
                    <div class="preview-plans-grid">
                      <div 
                        class="preview-plan-card" 
                        *ngFor="let plan of editableContent.plans"
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
                <span class="value text-purple-400">{{ editableContent.variant || 'energetic' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">CLASSES</span>
                <span class="value">{{ editableContent.classes?.length || 0 }}</span>
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
  styleUrl: './editor-gym-isolated-mode.component.scss',
})
export class EditorGymIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvasElement') canvasRef!: ElementRef;

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

  protected initializeState(): void {
    const configClasses = this.config?.content?.['classes'] as GymClass[] | undefined;
    const configPlans = this.config?.content?.['plans'] as GymMembershipPlan[] | undefined;
    
    // Initialize content
    this.editableContent = {
      gymName: this.config?.content?.['gymName'] || 'FitPower Gym',
      tagline: this.config?.content?.['tagline'] || 'Transforma tu cuerpo, transforma tu vida',
      description: this.config?.content?.['description'] || 'El mejor gimnasio de la ciudad',
      variant: this.config?.content?.['variant'] || 'energetic',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#0f172a',
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      accentColor: this.config?.content?.['accentColor'] || '#ef4444',
      buttonColor: this.config?.content?.['buttonColor'] || '#ef4444',
      classes: configClasses || [...this.defaultClasses],
      plans: configPlans || [...this.defaultPlans],
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

  addClass(): void {
    if (!this.editableContent.classes) {
      this.editableContent.classes = [];
    }
    this.editableContent.classes.push({
      name: 'Nueva Clase',
      description: 'Descripción de la nueva clase',
      duration: '60 min',
      intensity: 'media',
      schedule: 'L-V: 9:00',
      instructor: 'Instructor',
    });
    this.saveState();
  }

  removeClass(index: number): void {
    if (this.editableContent.classes && index >= 0 && index < this.editableContent.classes.length) {
      this.editableContent.classes.splice(index, 1);
      this.saveState();
    }
  }

  addPlan(): void {
    if (!this.editableContent.plans) {
      this.editableContent.plans = [];
    }
    this.editableContent.plans.push({
      name: 'Nuevo Plan',
      price: '39.99€',
      features: ['Característica 1', 'Característica 2'],
      isPopular: false,
    });
    this.saveState();
  }

  removePlan(index: number): void {
    if (this.editableContent.plans && index >= 0 && index < this.editableContent.plans.length) {
      this.editableContent.plans.splice(index, 1);
      this.saveState();
    }
  }

  getPlanFeaturesText(planIndex: number): string {
    if (this.editableContent.plans && this.editableContent.plans[planIndex]) {
      return this.editableContent.plans[planIndex].features.join('\n');
    }
    return '';
  }

  updatePlanFeatures(planIndex: number, featuresText: string): void {
    if (this.editableContent.plans && this.editableContent.plans[planIndex]) {
      this.editableContent.plans[planIndex].features = featuresText.split('\n').filter(f => f.trim());
      this.saveState();
    }
  }

  getPreviewClasses(): GymClass[] {
    return this.editableContent.classes || this.defaultClasses;
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
