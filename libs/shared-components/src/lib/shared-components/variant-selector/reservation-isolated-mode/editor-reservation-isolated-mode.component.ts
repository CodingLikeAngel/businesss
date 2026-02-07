import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

/**
 * Reservation Field Interface
 */
export interface ReservationField {
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
}

/**
 * Reservation Isolated Mode Content
 */
export interface ReservationIsolatedModeContent {
  title?: string;
  subtitle?: string;
  fields?: ReservationField[];
  submitButtonText?: string;
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  buttonColor?: string;
}

/**
 * Reservation Form Isolated Mode Component
 */
@Component({
  selector: 'lib-editor-reservation-isolated-mode',
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
            <span class="component-name">RESERVATION FORM</span>
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
                    placeholder="Reserva tu Cita"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <textarea 
                    [(ngModel)]="content.subtitle" 
                    class="premium-input" 
                    rows="2"
                    placeholder="Completa el formulario para reservar"
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Texto del Botón</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.submitButtonText" 
                    class="premium-input" 
                    placeholder="Reservar Ahora"
                  />
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <select [(ngModel)]="content.variant" class="premium-input">
                    <option value="centered">Centrado</option>
                    <option value="split">Dividido</option>
                    <option value="minimal">Minimalista</option>
                  </select>
                </div>
              </div>

              <!-- FIELDS SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📋</span>
                  <h4>CAMPOS ({{ content.fields?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addField()">+</button>
                </div>

                <div class="fields-items-list">
                  <div class="field-item-edit" *ngFor="let field of content.fields; let i = index">
                    <div class="field-header">
                      <span class="field-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeField(i)">×</button>
                    </div>
                    
                    <div class="field-row">
                      <div class="control-group flex-1">
                        <label>Etiqueta</label>
                        <input 
                          type="text" 
                          [(ngModel)]="field.label" 
                          class="premium-input" 
                          placeholder="Nombre"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Tipo</label>
                        <select [(ngModel)]="field.type" class="premium-input">
                          <option value="text">Texto</option>
                          <option value="email">Email</option>
                          <option value="tel">Teléfono</option>
                          <option value="date">Fecha</option>
                          <option value="time">Hora</option>
                          <option value="number">Número</option>
                          <option value="textarea">Área de texto</option>
                        </select>
                      </div>
                    </div>
                    
                    <div class="field-row">
                      <div class="control-group flex-1">
                        <label>Placeholder</label>
                        <input 
                          type="text" 
                          [(ngModel)]="field.placeholder" 
                          class="premium-input" 
                          placeholder="Tu nombre..."
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Requerido</label>
                        <select [(ngModel)]="field.required" class="premium-input">
                          <option [ngValue]="true">Sí</option>
                          <option [ngValue]="false">No</option>
                        </select>
                      </div>
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
                class="preview-reservation"
                [style.background]="content.backgroundColor || '#f8fafc'"
                [style.color]="content.textColor || '#1e293b'"
              >
                <div class="preview-content">
                  <h2 class="preview-title">{{ content.title || 'Reserva tu Cita' }}</h2>
                  <p class="preview-subtitle">{{ content.subtitle || 'Completa el formulario para reservar tu cita' }}</p>
                  
                  <div class="preview-form">
                    <div class="preview-form-field" *ngFor="let field of getPreviewFields()">
                      <label>{{ field.label || 'Campo' }} <span *ngIf="field.required" class="required">*</span></label>
                      <input 
                        [type]="field.type || 'text'" 
                        [placeholder]="field.placeholder || ''"
                        class="preview-input"
                      />
                    </div>
                    <button 
                      class="preview-submit-button"
                      [style.background]="content.buttonColor || '#6366f1'"
                    >
                      {{ content.submitButtonText || 'Reservar Ahora' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Info Dock -->
            <div class="modern-position-dock">
              <div class="dock-item">
                <span class="label">VARIANT</span>
                <span class="value text-purple-400">{{ content.variant || 'centered' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">FIELDS</span>
                <span class="value">{{ content.fields?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Edita tu formulario de reserva.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editor-reservation-isolated-mode.component.scss',
})
export class EditorReservationIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() public config!: IsolatedModeConfig;
  @Output() public closed = new EventEmitter<void>();
  @Output() public applied = new EventEmitter<IsolatedModeConfig>();

  public content: ReservationIsolatedModeContent = {};
  
  private defaultFields: ReservationField[] = [
    { label: 'Nombre', type: 'text', placeholder: 'Tu nombre completo', required: true },
    { label: 'Email', type: 'email', placeholder: 'tu@email.com', required: true },
    { label: 'Teléfono', type: 'tel', placeholder: '+34 600 000 000', required: true },
    { label: 'Fecha', type: 'date', placeholder: '', required: true },
    { label: 'Hora', type: 'time', placeholder: '', required: true },
    { label: 'Notas', type: 'textarea', placeholder: 'Alguna nota adicional...', required: false },
  ];

  ngOnInit() {
    const configFields = this.config?.content?.['fields'] as ReservationField[] | undefined;
    
    this.content = {
      title: this.config?.content?.['title'] || 'Reserva tu Cita',
      subtitle: this.config?.content?.['subtitle'] || 'Completa el formulario para reservar tu cita',
      submitButtonText: this.config?.content?.['submitButtonText'] || 'Reservar Ahora',
      variant: this.config?.content?.['variant'] || 'centered',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#f8fafc',
      textColor: this.config?.content?.['textColor'] || '#1e293b',
      accentColor: this.config?.content?.['accentColor'] || '#6366f1',
      buttonColor: this.config?.content?.['buttonColor'] || '#6366f1',
      fields: configFields || this.defaultFields,
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

  public addField() {
    if (!this.content.fields) {
      this.content.fields = [];
    }
    this.content.fields.push({
      label: 'Nuevo Campo',
      type: 'text',
      placeholder: 'Placeholder...',
      required: false,
    });
  }

  public removeField(index: number) {
    if (this.content.fields && index >= 0 && index < this.content.fields.length) {
      this.content.fields.splice(index, 1);
    }
  }

  public getPreviewFields(): ReservationField[] {
    return this.content.fields || this.defaultFields;
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
