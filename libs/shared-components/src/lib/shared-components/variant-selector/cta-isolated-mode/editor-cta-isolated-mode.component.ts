import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

/**
 * CTA Isolated Mode Content
 */
export interface CTAIsolatedModeContent {
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  secondaryColor?: string;
  backgroundImage?: string;
}

/**
 * CTA Section Isolated Mode Component
 */
@Component({
  selector: 'lib-editor-cta-isolated-mode',
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
            <span class="component-name">CTA SECTION</span>
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
                  <label>Título Principal</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.title" 
                    class="premium-input" 
                    placeholder="¡Comienza tu proyecto hoy!"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <textarea 
                    [(ngModel)]="content.subtitle" 
                    class="premium-input" 
                    rows="3"
                    placeholder="Únete a miles de usuarios que ya están aprovechando..."
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <select [(ngModel)]="content.variant" class="premium-input">
                    <option value="centered">Centrado</option>
                    <option value="left">Izquierda</option>
                    <option value="right">Derecha</option>
                    <option value="split">Dividido</option>
                    <option value="banner">Banner</option>
                  </select>
                </div>
              </div>

              <!-- BUTTONS SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🔘</span>
                  <h4>BOTONES</h4>
                </div>

                <div class="control-group">
                  <label>Texto Botón Principal</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.primaryButtonText" 
                    class="premium-input" 
                    placeholder="Empezar Gratis"
                  />
                </div>

                <div class="control-group">
                  <label>Texto Botón Secundario</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.secondaryButtonText" 
                    class="premium-input" 
                    placeholder="Ver Demo"
                  />
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

                <div class="control-row">
                  <div class="control-group flex-1">
                    <label>Color Acento</label>
                    <input 
                      type="color" 
                      [(ngModel)]="content.accentColor" 
                      class="premium-input color-input"
                    />
                  </div>
                  <div class="control-group flex-1">
                    <label>Color Secundario</label>
                    <input 
                      type="color" 
                      [(ngModel)]="content.secondaryColor" 
                      class="premium-input color-input"
                    />
                  </div>
                </div>

                <div class="control-group">
                  <label>Imagen de Fondo (URL)</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.backgroundImage" 
                    class="premium-input" 
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Canvas Preview -->
          <div class="isolated-canvas">
            <div class="canvas-inner">
              <div 
                class="preview-cta"
                [style.background]="getPreviewBackground()"
                [style.color]="content.textColor || '#ffffff'"
              >
                <div class="preview-content">
                  <h2 class="preview-title">{{ content.title || '¡Comienza tu proyecto hoy!' }}</h2>
                  <p class="preview-subtitle">{{ content.subtitle || 'Únete a miles de usuarios que ya están aprovechando nuestras herramientas.' }}</p>
                  
                  <div class="preview-buttons">
                    <button 
                      class="preview-btn preview-btn-primary"
                      [style.background]="content.accentColor || '#6366f1'"
                    >
                      {{ content.primaryButtonText || 'Empezar Gratis' }}
                    </button>
                    <button 
                      class="preview-btn preview-btn-secondary"
                      [style.background]="content.secondaryColor || 'transparent'"
                      [style.border-color]="content.textColor || '#ffffff'"
                    >
                      {{ content.secondaryButtonText || 'Ver Demo' }}
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
                <span class="label">BUTTONS</span>
                <span class="value">2</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Edita tu llamada a la acción.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editor-cta-isolated-mode.component.scss',
})
export class EditorCTAIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() public config!: IsolatedModeConfig;
  @Output() public closed = new EventEmitter<void>();
  @Output() public applied = new EventEmitter<IsolatedModeConfig>();

  public content: CTAIsolatedModeContent = {};

  ngOnInit() {
    this.content = {
      title: this.config?.content?.['title'] || '¡Comienza tu proyecto hoy!',
      subtitle: this.config?.content?.['subtitle'] || 'Únete a miles de usuarios que ya están aprovechando nuestras herramientas para crecer.',
      variant: this.config?.content?.['variant'] || 'centered',
      primaryButtonText: this.config?.content?.['primaryButtonText'] || 'Empezar Gratis',
      secondaryButtonText: this.config?.content?.['secondaryButtonText'] || 'Ver Demo',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#0f172a',
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      accentColor: this.config?.content?.['accentColor'] || '#6366f1',
      secondaryColor: this.config?.content?.['secondaryColor'] || 'transparent',
      backgroundImage: this.config?.content?.['backgroundImage'] || '',
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

  public getPreviewBackground(): string {
    if (this.content.backgroundImage) {
      return `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${this.content.backgroundImage})`;
    }
    return this.content.backgroundColor || '#0f172a';
  }
}
