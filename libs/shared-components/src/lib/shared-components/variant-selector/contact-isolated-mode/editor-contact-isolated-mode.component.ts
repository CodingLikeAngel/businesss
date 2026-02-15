import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

/**
 * Contact Info Item Interface
 */
export interface ContactInfoItem {
  icon: string;
  title: string;
  value: string;
  link?: string;
  linkText?: string;
}

/**
 * Contact Form Isolated Mode Component
 * 
 * Extends BaseIsolatedModeComponent to provide:
 * - Undo/Redo functionality
 * - Drag & Resize capabilities
 * - Grid snapping
 * - Keyboard shortcuts
 */
@Component({
  selector: 'lib-editor-contact-isolated-mode',
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
            <span class="component-name">CONTACT SECTION</span>
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
                    placeholder="¡Contáctanos!"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.subtitle" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="Cuéntanos tu proyecto..."
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
                    <option value="primary">Primary</option>
                    <option value="split">Split</option>
                    <option value="centered">Centrado</option>
                  </select>
                </div>
              </div>

              <!-- INFO SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">ℹ️</span>
                  <h4>INFORMACIÓN</h4>
                </div>

                <div class="control-group">
                  <label>Título de Información</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.infoTitle" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="Información de Contacto"
                  />
                </div>

                <div class="control-group">
                  <label>Texto del Botón</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.buttonText" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="Enviar Mensaje"
                  />
                </div>
              </div>

              <!-- CONTACT ITEMS SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📞</span>
                  <h4>CONTACTOS ({{ editableContent.contactItems?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addContactItem()">+</button>
                </div>

                <div class="contact-items-list">
                  <div class="contact-item-edit" *ngFor="let item of editableContent.contactItems; let i = index">
                    <div class="contact-header">
                      <span class="contact-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeContactItem(i)">×</button>
                    </div>
                    
                    <div class="contact-row">
                      <div class="control-group flex-1">
                        <label>Icono</label>
                        <input 
                          type="text" 
                          [(ngModel)]="item.icon" 
                          (ngModelChange)="onContentChange()"
                          class="premium-input icon-input" 
                          placeholder="📧"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Título</label>
                        <input 
                          type="text" 
                          [(ngModel)]="item.title" 
                          (ngModelChange)="onContentChange()"
                          class="premium-input" 
                          placeholder="Email"
                        />
                      </div>
                    </div>
                    
                    <div class="control-group">
                      <label>Valor</label>
                      <input 
                        type="text" 
                        [(ngModel)]="item.value" 
                        (ngModelChange)="onContentChange()"
                        class="premium-input" 
                        placeholder="info@empresa.com"
                      />
                    </div>
                    
                    <div class="contact-row">
                      <div class="control-group flex-1">
                        <label>Link</label>
                        <input 
                          type="text" 
                          [(ngModel)]="item.link" 
                          (ngModelChange)="onContentChange()"
                          class="premium-input" 
                          placeholder="https://"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Texto Link</label>
                        <input 
                          type="text" 
                          [(ngModel)]="item.linkText" 
                          (ngModelChange)="onContentChange()"
                          class="premium-input" 
                          placeholder="Enviar email"
                        />
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

                <div class="control-group">
                  <label>Color de Texto</label>
                  <input 
                    type="color" 
                    [(ngModel)]="editableContent.textColor" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input color-input"
                  />
                </div>

                <div class="control-group">
                  <label>Color de Acento</label>
                  <input 
                    type="color" 
                    [(ngModel)]="editableContent.accentColor" 
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
                  class="preview-contact" 
                  [style.background]="getPreviewBackground()"
                  [style.color]="editableContent.textColor || '#ffffff'"
                >
                  <div class="preview-content-wrapper">
                    <div class="preview-info-section" *ngIf="editableContent.infoTitle">
                      <h3 class="preview-info-title">{{ editableContent.infoTitle || 'Información de Contacto' }}</h3>
                      <div class="preview-contact-list">
                        <div class="preview-contact-item" *ngFor="let item of getPreviewContacts()">
                          <span class="preview-contact-icon">{{ item.icon || '📧' }}</span>
                          <div class="preview-contact-details">
                            <div class="preview-contact-title">{{ item.title || 'Título' }}</div>
                            <div class="preview-contact-value">{{ item.value || 'Valor' }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="preview-form-section">
                      <h2 class="preview-title">{{ editableContent.title || '¡Contáctanos!' }}</h2>
                      <p class="preview-subtitle">{{ editableContent.subtitle || 'Cuéntanos tu proyecto' }}</p>
                      <div class="preview-form">
                        <div class="preview-form-field">
                          <label>Nombre</label>
                          <input type="text" placeholder="Tu nombre" />
                        </div>
                        <div class="preview-form-field">
                          <label>Email</label>
                          <input type="email" placeholder="tu@email.com" />
                        </div>
                        <div class="preview-form-field">
                          <label>Mensaje</label>
                          <textarea placeholder="Tu mensaje..."></textarea>
                        </div>
                        <button 
                          class="preview-submit-button"
                          [style.background]="editableContent.accentColor || '#6366f1'"
                        >
                          {{ editableContent.buttonText || 'Enviar Mensaje' }}
                        </button>
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
                <span class="label">CONTACTS</span>
                <span class="value">{{ editableContent.contactItems?.length || 0 }}</span>
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
  styleUrl: './editor-contact-isolated-mode.component.scss',
})
export class EditorContactIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvasElement') canvasRef!: ElementRef;

  private defaultContacts: ContactInfoItem[] = [
    { icon: '📧', title: 'Email', value: 'info@empresa.com', link: 'mailto:info@empresa.com', linkText: 'Enviar email' },
    { icon: '📞', title: 'Teléfono', value: '+34 900 123 456', link: 'tel:+34900123456', linkText: 'Llamar ahora' },
    { icon: '📍', title: 'Dirección', value: 'Calle Principal 123', link: 'https://maps.google.com', linkText: 'Ver en mapa' },
  ];

  protected initializeState(): void {
    const configContacts = this.config?.content?.['contactItems'] as ContactInfoItem[] | undefined;
    
    // Initialize content
    this.editableContent = {
      title: this.config?.content?.['title'] || '¡Contáctanos!',
      subtitle: this.config?.content?.['subtitle'] || 'Cuéntanos tu proyecto y te ayudaremos a hacerlo realidad.',
      variant: this.config?.content?.['variant'] || 'default',
      infoTitle: this.config?.content?.['infoTitle'] || 'Información de Contacto',
      buttonText: this.config?.content?.['buttonText'] || 'Enviar Mensaje',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#0f172a',
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      accentColor: this.config?.content?.['accentColor'] || '#6366f1',
      contactItems: configContacts || [...this.defaultContacts],
    };

    // Initialize styles
    this.editableStyles = this.config?.styles ? { ...this.config.styles } : {};

    // Initialize position and size
    this.currentPosition = this.config?.position || { x: 50, y: 50 };
    this.currentSize = this.config?.size || { width: 700, height: 450 };
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };

    // Save initial state
    this.saveState();
  }

  protected getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement || null;
  }

  addContactItem(): void {
    if (!this.editableContent.contactItems) {
      this.editableContent.contactItems = [];
    }
    this.editableContent.contactItems.push({
      icon: '📱',
      title: 'Nuevo Contacto',
      value: 'info@ejemplo.com',
      link: '',
      linkText: 'Contactar',
    });
    this.saveState();
  }

  removeContactItem(index: number): void {
    if (this.editableContent.contactItems && index >= 0 && index < this.editableContent.contactItems.length) {
      this.editableContent.contactItems.splice(index, 1);
      this.saveState();
    }
  }

  getPreviewContacts(): ContactInfoItem[] {
    return this.editableContent.contactItems || this.defaultContacts;
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
        infoTitle: this.editableContent.infoTitle,
        buttonText: this.editableContent.buttonText,
        backgroundColor: this.editableContent.backgroundColor,
        textColor: this.editableContent.textColor,
        accentColor: this.editableContent.accentColor,
        contactItems: this.editableContent.contactItems || this.defaultContacts,
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
