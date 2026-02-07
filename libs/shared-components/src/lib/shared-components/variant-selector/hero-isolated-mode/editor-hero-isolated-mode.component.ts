import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

/**
 * Hero Isolated Mode Content Interface
 */
export interface HeroIsolatedModeContent {
  badge?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  backgroundType?: 'none' | 'solid' | 'gradient' | 'image' | 'video';
  backgroundImage?: string;
  backgroundVideo?: string;
  backgroundColor?: string;
  backgroundGradient?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  variant?: 'minimal' | 'centered' | 'left-aligned' | 'right-aligned' | 'split' | 'fullscreen';
  height?: 'auto' | 'screen' | 'custom';
  customHeight?: number;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
}

/**
 * Hero Isolated Mode Component
 * Provides a premium editing experience for Hero sections
 */
@Component({
  selector: 'lib-editor-hero-isolated-mode',
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
            <span class="component-name">HERO SECTION</span>
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
                  <label>Badge</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.badge" 
                    class="premium-input" 
                    placeholder="Ej: Introducing"
                  />
                </div>

                <div class="control-group">
                  <label>Título Principal</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.title" 
                    class="premium-input" 
                    placeholder="Ej: Less is More"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <textarea 
                    [(ngModel)]="content.subtitle" 
                    class="premium-input h-24" 
                    placeholder="Describe tu sección hero..."
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Texto del CTA</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.ctaLabel" 
                    class="premium-input" 
                    placeholder="Ej: Read More"
                  />
                </div>

                <div class="control-group">
                  <label>Link del CTA</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.ctaHref" 
                    class="premium-input" 
                    placeholder="https://"
                  />
                </div>

                <div class="control-group" *ngIf="content.secondaryCtaLabel">
                  <label>Texto Secondary CTA</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.secondaryCtaLabel" 
                    class="premium-input" 
                    placeholder="Secondary action"
                  />
                </div>

                <div class="control-group" *ngIf="content.secondaryCtaLabel">
                  <label>Link Secondary CTA</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.secondaryCtaHref" 
                    class="premium-input" 
                    placeholder="https://"
                  />
                </div>
              </div>

              <!-- BACKGROUND SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🖼️</span>
                  <h4>FONDO</h4>
                </div>

                <div class="control-group">
                  <label>Tipo de Fondo</label>
                  <select [(ngModel)]="content.backgroundType" class="premium-input">
                    <option value="none">Sin fondo</option>
                    <option value="solid">Color Sólido</option>
                    <option value="gradient">Gradiente</option>
                    <option value="image">Imagen</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div class="control-group" *ngIf="content.backgroundType === 'image'">
                  <label>URL de Imagen</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.backgroundImage" 
                    class="premium-input" 
                    placeholder="https://"
                  />
                </div>

                <div class="control-group" *ngIf="content.backgroundType === 'video'">
                  <label>URL de Video</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.backgroundVideo" 
                    class="premium-input" 
                    placeholder="https://"
                  />
                </div>

                <div class="control-group" *ngIf="content.backgroundType === 'solid'">
                  <label>Color de Fondo</label>
                  <input 
                    type="color" 
                    [(ngModel)]="content.backgroundColor" 
                    class="premium-input color-input"
                  />
                </div>

                <div class="control-group" *ngIf="content.backgroundType === 'gradient'">
                  <label>Gradiente (CSS)</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.backgroundGradient" 
                    class="premium-input" 
                    placeholder="linear-gradient(...)"
                  />
                </div>

                <div class="control-group">
                  <label class="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="content.overlay" 
                      class="w-4 h-4"
                    />
                    <span>Overlay Oscuro</span>
                  </label>
                </div>

                <div class="control-group" *ngIf="content.overlay">
                  <label>Opacidad del Overlay</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    [(ngModel)]="content.overlayOpacity" 
                    class="w-full"
                  />
                  <span class="text-white text-sm">{{ content.overlayOpacity }}%</span>
                </div>
              </div>

              <!-- LAYOUT SECTION -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">📐</span>
                  <h4>LAYOUT</h4>
                </div>

                <div class="control-group">
                  <label>Variante</label>
                  <select [(ngModel)]="content.variant" class="premium-input">
                    <option value="minimal">Minimalista</option>
                    <option value="centered">Centrado</option>
                    <option value="left-aligned">Alineado Izquierda</option>
                    <option value="right-aligned">Alineado Derecha</option>
                    <option value="split">Split (Dividido)</option>
                    <option value="fullscreen">Pantalla Completa</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Altura</label>
                  <select [(ngModel)]="content.height" class="premium-input">
                    <option value="auto">Automática</option>
                    <option value="screen">Pantalla Completa</option>
                    <option value="custom">Personalizada</option>
                  </select>
                </div>

                <div class="control-group" *ngIf="content.height === 'custom'">
                  <label>Altura Personalizada (px)</label>
                  <input 
                    type="number" 
                    [(ngModel)]="content.customHeight" 
                    class="premium-input"
                    min="200"
                    max="800"
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
                  <label>Alineación</label>
                  <select [(ngModel)]="content.textAlign" class="premium-input">
                    <option value="left">Izquierda</option>
                    <option value="center">Centro</option>
                    <option value="right">Derecha</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Canvas Preview -->
          <div class="isolated-canvas">
            <div class="canvas-inner">
              <div 
                class="preview-hero" 
                [style.height]="getPreviewHeight()"
                [style.background]="getPreviewBackground()"
                [style.color]="content.textColor || '#ffffff'"
                [style.textAlign]="content.textAlign || 'center'"
              >
                <div class="hero-content-wrapper" [class]="'variant-' + content.variant">
                  <div class="preview-badge" *ngIf="content.badge">
                    {{ content.badge }}
                  </div>
                  <h1 class="preview-title">{{ content.title || 'Título Principal' }}</h1>
                  <p class="preview-subtitle">{{ content.subtitle || 'Subtítulo descriptivo para tu sección hero' }}</p>
                  <div class="preview-actions" *ngIf="content.ctaLabel">
                    <button class="preview-cta primary">{{ content.ctaLabel }}</button>
                    <button class="preview-cta secondary" *ngIf="content.secondaryCtaLabel">
                      {{ content.secondaryCtaLabel }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Info Dock -->
            <div class="modern-position-dock">
              <div class="dock-item">
                <span class="label">VARIANT</span>
                <span class="value text-purple-400">{{ content.variant || 'minimal' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">BACKGROUND</span>
                <span class="value">{{ content.backgroundType || 'none' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">HEIGHT</span>
                <span class="value">{{ content.height || 'auto' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Personaliza tu sección hero con controles avanzados.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editor-hero-isolated-mode.component.scss',
})
export class EditorHeroIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() public config!: IsolatedModeConfig;
  @Output() public closed = new EventEmitter<void>();
  @Output() public applied = new EventEmitter<IsolatedModeConfig>();

  // Editable content with proper typing
  public content: HeroIsolatedModeContent = {};

  ngOnInit() {
    // Initialize from config or use defaults
    this.content = {
      badge: this.config?.content?.['badge'] || '',
      title: this.config?.content?.['title'] || 'Less is More',
      subtitle: this.config?.content?.['subtitle'] || 'Minimalist design focuses on the essential, stripping away the unnecessary.',
      ctaLabel: this.config?.content?.['ctaLabel'] || 'Read More',
      ctaHref: this.config?.content?.['ctaHref'] || '',
      secondaryCtaLabel: this.config?.content?.['secondaryCtaLabel'] || '',
      secondaryCtaHref: this.config?.content?.['secondaryCtaHref'] || '',
      backgroundType: (this.config?.content?.['backgroundType'] as HeroIsolatedModeContent['backgroundType']) || 'none',
      backgroundImage: this.config?.content?.['backgroundImage'] || '',
      backgroundVideo: this.config?.content?.['backgroundVideo'] || '',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#1a1a2e',
      backgroundGradient: this.config?.content?.['backgroundGradient'] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      overlay: this.config?.content?.['overlay'] ?? false,
      overlayOpacity: this.config?.content?.['overlayOpacity'] || 50,
      variant: (this.config?.content?.['variant'] as HeroIsolatedModeContent['variant']) || 'minimal',
      height: (this.config?.content?.['height'] as HeroIsolatedModeContent['height']) || 'auto',
      customHeight: this.config?.content?.['customHeight'] || 400,
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      textAlign: (this.config?.content?.['textAlign'] as HeroIsolatedModeContent['textAlign']) || 'center',
    };

    // Listen for escape key
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
    const contentObj: Record<string, any> = {
      badge: this.content.badge,
      title: this.content.title,
      subtitle: this.content.subtitle,
      ctaLabel: this.content.ctaLabel,
      ctaHref: this.content.ctaHref,
      secondaryCtaLabel: this.content.secondaryCtaLabel,
      secondaryCtaHref: this.content.secondaryCtaHref,
      backgroundType: this.content.backgroundType,
      backgroundImage: this.content.backgroundImage,
      backgroundVideo: this.content.backgroundVideo,
      backgroundColor: this.content.backgroundColor,
      backgroundGradient: this.content.backgroundGradient,
      overlay: this.content.overlay,
      overlayOpacity: this.content.overlayOpacity,
      variant: this.content.variant,
      height: this.content.height,
      customHeight: this.content.customHeight,
      textColor: this.content.textColor,
      textAlign: this.content.textAlign,
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

  public getPreviewHeight(): string {
    if (this.content.height === 'screen') {
      return '100vh';
    } else if (this.content.height === 'custom') {
      return `${this.content.customHeight || 400}px`;
    }
    return 'auto';
  }

  public getPreviewBackground(): string {
    switch (this.content.backgroundType) {
      case 'solid':
        return this.content.backgroundColor || '#1a1a2e';
      case 'gradient':
        return this.content.backgroundGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'image':
        return `url(${this.content.backgroundImage}) center/cover`;
      case 'video':
        return '#000000';
      default:
        return 'transparent';
    }
  }
}
