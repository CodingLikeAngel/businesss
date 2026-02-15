import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';
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
 * Reservation Form Isolated Mode Component
 * 
 * Extends BaseIsolatedModeComponent to provide:
 * - Undo/Redo functionality
 * - Drag & Resize capabilities
 * - Grid snapping
 * - Keyboard shortcuts
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
                  <label>Título</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.title" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="Reserva tu Cita"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <textarea 
                    [(ngModel)]="editableContent.subtitle" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    rows="2"
                    placeholder="Completa el formulario para reservar"
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Texto del Botón</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.submitButtonText" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="Reservar Ahora"
                  />
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <select 
                    [(ngModel)]="editableContent.variant" 
                    (ngModelChange)="onVariantChange()"
                    class="premium-input"
                  >
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
                  <h4>CAMPOS ({{ editableContent.fields?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addField()">+</button>
                </div>

                <div class="fields-items-list">
                  <div class="field-item-edit" *ngFor="let field of editableContent.fields; let i = index">
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
                          (ngModelChange)="onContentChange()"
                          class="premium-input" 
                          placeholder="Nombre"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Tipo</label>
                        <select [(ngModel)]="field.type" (ngModelChange)="onContentChange()" class="premium-input">
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
                          (ngModelChange)="onContentChange()"
                          class="premium-input" 
                          placeholder="Tu nombre..."
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Requerido</label>
                        <select [(ngModel)]="field.required" (ngModelChange)="onContentChange()" class="premium-input">
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
                  class="preview-reservation"
                  [style.background]="editableContent.backgroundColor || '#f8fafc'"
                  [style.color]="editableContent.textColor || '#1e293b'"
                >
                  <div class="preview-content">
                    <h2 class="preview-title">{{ editableContent.title || 'Reserva tu Cita' }}</h2>
                    <p class="preview-subtitle">{{ editableContent.subtitle || 'Completa el formulario para reservar tu cita' }}</p>
                    
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
                        [style.background]="editableContent.buttonColor || '#6366f1'"
                      >
                        {{ editableContent.submitButtonText || 'Reservar Ahora' }}
                      </button>
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
                <span class="value text-purple-400">{{ editableContent.variant || 'centered' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">FIELDS</span>
                <span class="value">{{ editableContent.fields?.length || 0 }}</span>
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
  styleUrl: './editor-reservation-isolated-mode.component.scss',
})
export class EditorReservationIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvasElement') canvasRef!: ElementRef;

  private defaultFields: ReservationField[] = [
    { label: 'Nombre', type: 'text', placeholder: 'Tu nombre completo', required: true },
    { label: 'Email', type: 'email', placeholder: 'tu@email.com', required: true },
    { label: 'Teléfono', type: 'tel', placeholder: '+34 600 000 000', required: true },
    { label: 'Fecha', type: 'date', placeholder: '', required: true },
    { label: 'Hora', type: 'time', placeholder: '', required: true },
    { label: 'Notas', type: 'textarea', placeholder: 'Alguna nota adicional...', required: false },
  ];

  protected initializeState(): void {
    const configFields = this.config?.content?.['fields'] as ReservationField[] | undefined;
    
    // Initialize content
    this.editableContent = {
      title: this.config?.content?.['title'] || 'Reserva tu Cita',
      subtitle: this.config?.content?.['subtitle'] || 'Completa el formulario para reservar tu cita',
      submitButtonText: this.config?.content?.['submitButtonText'] || 'Reservar Ahora',
      variant: this.config?.content?.['variant'] || 'centered',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#f8fafc',
      textColor: this.config?.content?.['textColor'] || '#1e293b',
      accentColor: this.config?.content?.['accentColor'] || '#6366f1',
      buttonColor: this.config?.content?.['buttonColor'] || '#6366f1',
      fields: configFields || [...this.defaultFields],
    };

    // Initialize styles
    this.editableStyles = this.config?.styles ? { ...this.config.styles } : {};

    // Initialize position and size
    this.currentPosition = this.config?.position || { x: 50, y: 50 };
    this.currentSize = this.config?.size || { width: 500, height: 550 };
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };

    // Save initial state
    this.saveState();
  }

  protected getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement || null;
  }

  addField(): void {
    if (!this.editableContent.fields) {
      this.editableContent.fields = [];
    }
    this.editableContent.fields.push({
      label: 'Nuevo Campo',
      type: 'text',
      placeholder: 'Placeholder...',
      required: false,
    });
    this.saveState();
  }

  removeField(index: number): void {
    if (this.editableContent.fields && index >= 0 && index < this.editableContent.fields.length) {
      this.editableContent.fields.splice(index, 1);
      this.saveState();
    }
  }

  getPreviewFields(): ReservationField[] {
    return this.editableContent.fields || this.defaultFields;
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
