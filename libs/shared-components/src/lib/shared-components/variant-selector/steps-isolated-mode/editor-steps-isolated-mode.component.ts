import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

/**
 * Step Item Interface
 */
export interface StepItem {
  number: string;
  title: string;
  description: string;
  icon?: string;
}

/**
 * Steps Isolated Mode Content
 */
export interface StepsIsolatedModeContent {
  title?: string;
  subtitle?: string;
  steps?: StepItem[];
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

/**
 * Steps Section Isolated Mode Component
 */
@Component({
  selector: 'lib-editor-steps-isolated-mode',
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
            <span class="component-name">STEPS SECTION</span>
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
                  <label>Título</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.title" 
                    class="premium-input" 
                    placeholder="Cómo Funciona"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <textarea 
                    [(ngModel)]="content.subtitle" 
                    class="premium-input" 
                    rows="2"
                    placeholder="Sigue estos simples pasos para comenzar"
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <select [(ngModel)]="content.variant" class="premium-input">
                    <option value="horizontal">Horizontal</option>
                    <option value="vertical">Vertical</option>
                    <option value="cards">Tarjetas</option>
                    <option value="timeline">Línea de Tiempo</option>
                  </select>
                </div>
              </div>

              <!-- STEPS SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📋</span>
                  <h4>PASOS ({{ content.steps?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addStepItem()">+</button>
                </div>

                <div class="steps-items-list">
                  <div class="step-item-edit" *ngFor="let step of content.steps; let i = index">
                    <div class="step-header">
                      <span class="step-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeStepItem(i)">×</button>
                    </div>
                    
                    <div class="step-row">
                      <div class="control-group flex-1">
                        <label>Número</label>
                        <input 
                          type="text" 
                          [(ngModel)]="step.number" 
                          class="premium-input" 
                          placeholder="1"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Icono</label>
                        <input 
                          type="text" 
                          [(ngModel)]="step.icon" 
                          class="premium-input icon-input" 
                          placeholder="🚀"
                        />
                      </div>
                    </div>
                    
                    <div class="control-group">
                      <label>Título</label>
                      <input 
                        type="text" 
                        [(ngModel)]="step.title" 
                        class="premium-input" 
                        placeholder="Título del paso"
                      />
                    </div>
                    
                    <div class="control-group">
                      <label>Descripción</label>
                      <textarea 
                        [(ngModel)]="step.description" 
                        class="premium-input" 
                        rows="2"
                        placeholder="Descripción del paso"
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
              </div>
            </div>
          </div>

          <!-- Canvas Preview -->
          <div class="isolated-canvas">
            <div class="canvas-inner">
              <div 
                class="preview-steps"
                [style.background]="content.backgroundColor || '#f8fafc'"
                [style.color]="content.textColor || '#1e293b'"
              >
                <div class="preview-header">
                  <h2 class="preview-title">{{ content.title || 'Cómo Funciona' }}</h2>
                  <p class="preview-subtitle">{{ content.subtitle || 'Sigue estos simples pasos para comenzar' }}</p>
                </div>
                
                <div class="preview-steps-grid" [class]="'variant-' + (content.variant || 'horizontal')">
                  <div class="preview-step-item" *ngFor="let step of getPreviewSteps(); let i = index">
                    <div class="preview-step-number" [style.background]="content.accentColor || '#6366f1'">
                      {{ step.number || (i + 1) }}
                    </div>
                    <span class="preview-step-icon">{{ step.icon || '⭐' }}</span>
                    <h3 class="preview-step-title">{{ step.title || 'Título del Paso' }}</h3>
                    <p class="preview-step-description">{{ step.description || 'Descripción del paso aquí' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Info Dock -->
            <div class="modern-position-dock">
              <div class="dock-item">
                <span class="label">VARIANT</span>
                <span class="value text-purple-400">{{ content.variant || 'horizontal' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">STEPS</span>
                <span class="value">{{ content.steps?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Edita tu sección de pasos.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editor-steps-isolated-mode.component.scss',
})
export class EditorStepsIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() public config!: IsolatedModeConfig;
  @Output() public closed = new EventEmitter<void>();
  @Output() public applied = new EventEmitter<IsolatedModeConfig>();

  public content: StepsIsolatedModeContent = {};
  
  private defaultSteps: StepItem[] = [
    { number: '1', title: 'Regístrate', description: 'Crea tu cuenta gratis en segundos', icon: '📝' },
    { number: '2', title: 'Configura', description: 'Personaliza tu perfil y preferencias', icon: '⚙️' },
    { number: '3', title: 'Activa', description: 'Comienza a usar nuestras herramientas', icon: '🚀' },
    { number: '4', title: 'Escala', description: 'Grow y expande tu negocio', icon: '📈' },
  ];

  ngOnInit() {
    const configSteps = this.config?.content?.['steps'] as StepItem[] | undefined;
    
    this.content = {
      title: this.config?.content?.['title'] || 'Cómo Funciona',
      subtitle: this.config?.content?.['subtitle'] || 'Sigue estos simples pasos para comenzar',
      variant: this.config?.content?.['variant'] || 'horizontal',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#f8fafc',
      textColor: this.config?.content?.['textColor'] || '#1e293b',
      accentColor: this.config?.content?.['accentColor'] || '#6366f1',
      steps: configSteps || this.defaultSteps,
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

  public addStepItem() {
    if (!this.content.steps) {
      this.content.steps = [];
    }
    this.content.steps.push({
      number: String((this.content.steps?.length || 0) + 1),
      title: 'Nuevo Paso',
      description: 'Descripción del nuevo paso',
      icon: '⭐',
    });
  }

  public removeStepItem(index: number) {
    if (this.content.steps && index >= 0 && index < this.content.steps.length) {
      this.content.steps.splice(index, 1);
    }
  }

  public getPreviewSteps(): StepItem[] {
    return this.content.steps || this.defaultSteps;
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
