import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

/**
 * Newsletter Isolated Mode Content
 */
export interface NewsletterIsolatedModeContent {
  title?: string;
  subtitle?: string;
  placeholderText?: string;
  buttonText?: string;
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  buttonColor?: string;
  showSocial?: boolean;
}

/**
 * Newsletter Section Isolated Mode Component
 */
@Component({
  selector: 'lib-editor-newsletter-isolated-mode',
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
            <span class="component-name">NEWSLETTER SECTION</span>
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
                    placeholder="Suscríbete a nuestro boletín"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <textarea 
                    [(ngModel)]="content.subtitle" 
                    class="premium-input" 
                    rows="2"
                    placeholder="Recibe las últimas noticias y ofertas..."
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Texto del Placeholder</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.placeholderText" 
                    class="premium-input" 
                    placeholder="Tu email..."
                  />
                </div>

                <div class="control-group">
                  <label>Texto del Botón</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.buttonText" 
                    class="premium-input" 
                    placeholder="Suscribirse"
                  />
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <select [(ngModel)]="content.variant" class="premium-input">
                    <option value="centered">Centrado</option>
                    <option value="minimal">Minimalista</option>
                    <option value="creative">Creativo</option>
                    <option value="modern">Moderno</option>
                  </select>
                </div>

                <div class="control-group checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" [(ngModel)]="content.showSocial" />
                    <span>Mostrar redes sociales</span>
                  </label>
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
                class="preview-newsletter"
                [style.background]="content.backgroundColor || '#0f172a'"
                [style.color]="content.textColor || '#ffffff'"
              >
                <div class="preview-content">
                  <h2 class="preview-title">{{ content.title || 'Suscríbete a nuestro boletín' }}</h2>
                  <p class="preview-subtitle">{{ content.subtitle || 'Recibe las últimas noticias y ofertas directamente en tu correo.' }}</p>
                  
                  <div class="preview-form">
                    <input 
                      type="email" 
                      class="preview-input"
                      [placeholder]="content.placeholderText || 'Tu email...'"
                    />
                    <button 
                      class="preview-button"
                      [style.background]="content.buttonColor || '#6366f1'"
                    >
                      {{ content.buttonText || 'Suscribirse' }}
                    </button>
                  </div>

                  <div class="preview-social" *ngIf="content.showSocial">
                    <span class="social-icon">📘</span>
                    <span class="social-icon">📸</span>
                    <span class="social-icon">🐦</span>
                    <span class="social-icon">💼</span>
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
                <span class="label">SOCIAL</span>
                <span class="value">{{ content.showSocial ? 'ON' : 'OFF' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Edita tu sección de newsletter.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editor-newsletter-isolated-mode.component.scss',
})
export class EditorNewsletterIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() public config!: IsolatedModeConfig;
  @Output() public closed = new EventEmitter<void>();
  @Output() public applied = new EventEmitter<IsolatedModeConfig>();

  public content: NewsletterIsolatedModeContent = {};

  ngOnInit() {
    this.content = {
      title: this.config?.content?.['title'] || 'Suscríbete a nuestro boletín',
      subtitle: this.config?.content?.['subtitle'] || 'Recibe las últimas noticias y ofertas directamente en tu correo.',
      placeholderText: this.config?.content?.['placeholderText'] || 'Tu email...',
      buttonText: this.config?.content?.['buttonText'] || 'Suscribirse',
      variant: this.config?.content?.['variant'] || 'centered',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#0f172a',
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      accentColor: this.config?.content?.['accentColor'] || '#6366f1',
      buttonColor: this.config?.content?.['buttonColor'] || '#6366f1',
      showSocial: this.config?.content?.['showSocial'] ?? true,
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
