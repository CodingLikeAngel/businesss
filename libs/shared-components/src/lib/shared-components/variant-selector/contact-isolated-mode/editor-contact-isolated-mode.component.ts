import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
 * Form Field Interface
 */
export interface FormFieldItem {
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
}

/**
 * Contact Isolated Mode Content
 */
export interface ContactIsolatedModeContent {
  title?: string;
  subtitle?: string;
  variant?: string;
  infoTitle?: string;
  contactItems?: ContactInfoItem[];
  buttonText?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

/**
 * Contact Form Isolated Mode Component
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
                    placeholder="¡Contáctanos!"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.subtitle" 
                    class="premium-input" 
                    placeholder="Cuéntanos tu proyecto..."
                  />
                </div>

                <div class="control-group">
                  <label>Variante</label>
                  <select [(ngModel)]="content.variant" class="premium-input">
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
                    [(ngModel)]="content.infoTitle" 
                    class="premium-input" 
                    placeholder="Información de Contacto"
                  />
                </div>

                <div class="control-group">
                  <label>Texto del Botón</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.buttonText" 
                    class="premium-input" 
                    placeholder="Enviar Mensaje"
                  />
                </div>
              </div>

              <!-- CONTACT ITEMS SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📞</span>
                  <h4>CONTACTOS ({{ content.contactItems?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addContactItem()">+</button>
                </div>

                <div class="contact-items-list">
                  <div class="contact-item-edit" *ngFor="let item of content.contactItems; let i = index">
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
                          class="premium-input icon-input" 
                          placeholder="📧"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Título</label>
                        <input 
                          type="text" 
                          [(ngModel)]="item.title" 
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
                          class="premium-input" 
                          placeholder="https://"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Texto Link</label>
                        <input 
                          type="text" 
                          [(ngModel)]="item.linkText" 
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

                <div class="control-group">
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

          <!-- Canvas Preview -->
          <div class="isolated-canvas">
            <div class="canvas-inner">
              <div 
                class="preview-contact" 
                [style.background]="getPreviewBackground()"
                [style.color]="content.textColor || '#ffffff'"
              >
                <div class="preview-content-wrapper">
                  <div class="preview-info-section" *ngIf="content.infoTitle">
                    <h3 class="preview-info-title">{{ content.infoTitle || 'Información de Contacto' }}</h3>
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
                    <h2 class="preview-title">{{ content.title || '¡Contáctanos!' }}</h2>
                    <p class="preview-subtitle">{{ content.subtitle || 'Cuéntanos tu proyecto' }}</p>
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
                        [style.background]="content.accentColor || '#6366f1'"
                      >
                        {{ content.buttonText || 'Enviar Mensaje' }}
                      </button>
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
                <span class="label">CONTACTS</span>
                <span class="value">{{ content.contactItems?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Gestiona la información de contacto.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editor-contact-isolated-mode.component.scss',
})
export class EditorContactIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() public config!: IsolatedModeConfig;
  @Output() public closed = new EventEmitter<void>();
  @Output() public applied = new EventEmitter<IsolatedModeConfig>();

  public content: ContactIsolatedModeContent = {};
  
  private defaultContacts: ContactInfoItem[] = [
    { icon: '📧', title: 'Email', value: 'info@empresa.com', link: 'mailto:info@empresa.com', linkText: 'Enviar email' },
    { icon: '📞', title: 'Teléfono', value: '+34 900 123 456', link: 'tel:+34900123456', linkText: 'Llamar ahora' },
    { icon: '📍', title: 'Dirección', value: 'Calle Principal 123', link: 'https://maps.google.com', linkText: 'Ver en mapa' },
  ];

  ngOnInit() {
    const configContacts = this.config?.content?.['contactItems'] as ContactInfoItem[] | undefined;
    
    this.content = {
      title: this.config?.content?.['title'] || '¡Contáctanos!',
      subtitle: this.config?.content?.['subtitle'] || 'Cuéntanos tu proyecto y te ayudaremos a hacerlo realidad.',
      variant: this.config?.content?.['variant'] || 'default',
      infoTitle: this.config?.content?.['infoTitle'] || 'Información de Contacto',
      buttonText: this.config?.content?.['buttonText'] || 'Enviar Mensaje',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#0f172a',
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      accentColor: this.config?.content?.['accentColor'] || '#6366f1',
      contactItems: configContacts || this.defaultContacts,
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

  public addContactItem() {
    if (!this.content.contactItems) {
      this.content.contactItems = [];
    }
    this.content.contactItems.push({
      icon: '📱',
      title: 'Nuevo Contacto',
      value: 'info@ejemplo.com',
      link: '',
      linkText: 'Contactar',
    });
  }

  public removeContactItem(index: number) {
    if (this.content.contactItems && index >= 0 && index < this.content.contactItems.length) {
      this.content.contactItems.splice(index, 1);
    }
  }

  public getPreviewContacts(): ContactInfoItem[] {
    return this.content.contactItems || this.defaultContacts;
  }

  public apply() {
    const contentObj: Record<string, any> = {
      title: this.content.title,
      subtitle: this.content.subtitle,
      variant: this.content.variant,
      infoTitle: this.content.infoTitle,
      buttonText: this.content.buttonText,
      backgroundColor: this.content.backgroundColor,
      textColor: this.content.textColor,
      accentColor: this.content.accentColor,
      contactItems: this.content.contactItems || this.defaultContacts,
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
