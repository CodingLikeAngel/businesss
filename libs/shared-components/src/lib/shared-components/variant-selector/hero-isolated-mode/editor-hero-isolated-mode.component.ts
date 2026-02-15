import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';
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
            <span class="mode-badge">🎯 MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">HERO SECTION</span>
          </div>
          
          <div class="header-actions">
            <div class="action-group">
              <button class="icon-btn" (click)="undo()" [disabled]="!canUndo" title="Deshacer (Ctrl+Z)">
                <span class="icon">↶</span>
              </button>
              <button class="icon-btn" (click)="redo()" [disabled]="!canRedo" title="Rehacer (Ctrl+Y)">
                <span class="icon">↷</span>
              </button>
            </div>
            
            <div class="divider"></div>
            
            <div class="action-group">
              <button class="icon-btn" (click)="toggleGrid()" [class.active]="showGrid" title="Cuadrícula (G)">
                <span class="icon">#</span>
              </button>
              <button class="icon-btn" (click)="toggleSnap()" [class.active]="snapToGrid" title="Snap (S)">
                <span class="icon">⊞</span>
              </button>
              <button class="icon-btn" (click)="resetPosition()" title="Reset (R)">
                <span class="icon">↺</span>
              </button>
            </div>

            <div class="divider"></div>

            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <!-- Body -->
        <div class="isolated-mode-body">
          <!-- Sidebar Controls -->
          <div class="controls-sidebar">
            <div class="sidebar-tabs">
              <button [class.active]="activeTab === 'content'" (click)="activeTab = 'content'">CONTENIDO</button>
              <button [class.active]="activeTab === 'style'" (click)="activeTab = 'style'">APARIENCIA</button>
            </div>

            <div class="sidebar-scroll-content">
              
              <!-- CONTENT TAB -->
              <div class="sidebar-section" *ngIf="activeTab === 'content'">
                <div class="section-header">
                  <span class="section-icon">📝</span>
                  <h4>TEXTO</h4>
                </div>

                <div class="control-group">
                  <label>Badge</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.badge" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="Ej: Introducing"
                  />
                </div>

                <div class="control-group">
                  <label>Título Principal</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.title" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="Ej: Less is More"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <textarea 
                    [(ngModel)]="editableContent.subtitle" 
                    (ngModelChange)="onContentChange()"
                    class="premium-textarea" 
                    placeholder="Describe tu sección hero..."
                  ></textarea>
                </div>
              </div>

              <!-- CTA SECTION -->
              <div class="sidebar-section" *ngIf="activeTab === 'content'">
                <div class="section-header">
                  <span class="section-icon">🔘</span>
                  <h4>LLAMADA A LA ACCIÓN</h4>
                </div>

                <div class="control-group">
                  <label>Texto del CTA</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.ctaLabel" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="Ej: Read More"
                  />
                </div>

                <div class="control-group">
                  <label>Link del CTA</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.ctaHref" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="https://"
                  />
                </div>

                <div class="control-group">
                  <label>Texto CTA Secundario</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.secondaryCtaLabel" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="Secondary action"
                  />
                </div>

                <div class="control-group">
                  <label>Link CTA Secundario</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.secondaryCtaHref" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="https://"
                  />
                </div>
              </div>

              <!-- BACKGROUND SECTION -->
              <div class="sidebar-section" *ngIf="activeTab === 'style'">
                <div class="section-header">
                  <span class="section-icon">🖼️</span>
                  <h4>FONDO</h4>
                </div>

                <div class="control-group">
                  <label>Tipo de Fondo</label>
                  <select [(ngModel)]="editableContent.backgroundType" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="none">Sin fondo</option>
                    <option value="solid">Color Sólido</option>
                    <option value="gradient">Gradiente</option>
                    <option value="image">Imagen</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div class="control-group" *ngIf="editableContent.backgroundType === 'image'">
                  <label>URL de Imagen</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.backgroundImage" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="https://"
                  />
                </div>

                <div class="control-group" *ngIf="editableContent.backgroundType === 'video'">
                  <label>URL de Video</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.backgroundVideo" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="https://"
                  />
                </div>

                <div class="control-group" *ngIf="editableContent.backgroundType === 'solid'">
                  <label>Color de Fondo</label>
                  <input 
                    type="color" 
                    [(ngModel)]="editableContent.backgroundColor" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input color-input"
                  />
                </div>

                <div class="control-group" *ngIf="editableContent.backgroundType === 'gradient'">
                  <label>Gradiente (CSS)</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.backgroundGradient" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="linear-gradient(...)"
                  />
                </div>

                <div class="checkbox-control" (click)="editableContent.overlay = !editableContent.overlay; onContentChange()">
                  <div class="custom-checkbox" [class.checked]="editableContent.overlay"></div>
                  <span>Overlay Oscuro</span>
                </div>

                <div class="control-group" *ngIf="editableContent.overlay">
                  <label>Opacidad del Overlay: {{ editableContent.overlayOpacity }}%</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    [(ngModel)]="editableContent.overlayOpacity" 
                    (ngModelChange)="onContentChange()"
                    class="w-full"
                  />
                </div>
              </div>

              <!-- LAYOUT SECTION -->
              <div class="sidebar-section no-border" *ngIf="activeTab === 'style'">
                <div class="section-header">
                  <span class="section-icon">📐</span>
                  <h4>LAYOUT</h4>
                </div>

                <div class="control-group">
                  <label>Variante</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onContentChange()" class="premium-select">
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
                  <select [(ngModel)]="editableContent.height" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="auto">Automática</option>
                    <option value="screen">Pantalla Completa</option>
                    <option value="custom">Personalizada</option>
                  </select>
                </div>

                <div class="control-group" *ngIf="editableContent.height === 'custom'">
                  <label>Altura Personalizada (px)</label>
                  <input 
                    type="number" 
                    [(ngModel)]="editableContent.customHeight" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input"
                    min="200"
                    max="800"
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
                  <label>Alineación</label>
                  <select [(ngModel)]="editableContent.textAlign" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="left">Izquierda</option>
                    <option value="center">Centro</option>
                    <option value="right">Derecha</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Canvas Preview -->
          <div class="isolated-canvas" #canvas (mousedown)="onCanvasMouseDown($event)">
            <div class="canvas-inner"
                 [style.transform]="'scale(' + viewportScale + ')'"
                 [style.transformOrigin]="'center'"
                 [class.show-grid]="showGrid"
                 [class.grid-snapping]="snapToGrid">
              
              <div class="draggable-wrapper"
                   [style.left.px]="currentPosition.x"
                   [style.top.px]="currentPosition.y"
                   [style.width.px]="currentSize.width"
                   [style.height.px]="currentSize.height"
                   [class.is-dragging]="isDragging"
                   [class.is-resizing]="isResizing"
                   (mousedown)="onMouseDown($event)">
                
                <div class="preview-hero" 
                     [style.height]="getPreviewHeight()"
                     [style.background]="getPreviewBackground()"
                     [style.color]="editableContent.textColor || '#ffffff'"
                     [style.textAlign]="editableContent.textAlign || 'center'">
                  
                  <div class="hero-overlay" *ngIf="editableContent.overlay" 
                       [style.background]="'rgba(0,0,0,' + (editableContent.overlayOpacity || 50) / 100 + ')'"></div>
                  
                  <div class="hero-content-wrapper" [class]="'variant-' + editableContent.variant">
                    <div class="preview-badge" *ngIf="editableContent.badge">
                      {{ editableContent.badge }}
                    </div>
                    <h1 class="preview-title">{{ editableContent.title || 'Título Principal' }}</h1>
                    <p class="preview-subtitle">{{ editableContent.subtitle || 'Subtítulo descriptivo para tu sección hero' }}</p>
                    <div class="preview-actions" *ngIf="editableContent.ctaLabel">
                      <button class="preview-cta primary">{{ editableContent.ctaLabel }}</button>
                      <button class="preview-cta secondary" *ngIf="editableContent.secondaryCtaLabel">
                        {{ editableContent.secondaryCtaLabel }}
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
                <span class="label">VARIANT</span>
                <span class="value">{{ editableContent.variant || 'minimal' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">BACKGROUND</span>
                <span class="value">{{ editableContent.backgroundType || 'none' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">HEIGHT</span>
                <span class="value">{{ editableContent.height || 'auto' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Usar <b>G</b> (rejilla), <b>S</b> (snap), <b>R</b> (reset) o flechas para ajuste fino.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import '../_isolated-mode-shared';
    @include isolated-mode-foundation;
    @include resize-handles;
    @include modern-dock;

    .canvas-inner {
      width: 4000px;
      height: 4000px;
      position: relative;
      background-size: 20px 20px;

      &.show-grid {
        background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
      }

      &.grid-snapping {
        background-image: radial-gradient(rgba(99, 102, 241, 0.25) 1.5px, transparent 1.5px);
      }
    }

    .draggable-wrapper {
      position: absolute !important;
      cursor: move;
      z-index: 100;
      outline: 2px solid transparent;
      outline-offset: 4px;
      background: rgba(255, 255, 255, 0.01);
      transition: outline-color 0.2s;

      &:hover {
        outline-color: rgba(99, 102, 241, 0.4);
      }

      &.is-dragging,
      &.is-resizing {
        outline-color: #6366f1;
        outline-width: 3px;
      }
    }

    .preview-hero {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      border-radius: 8px;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      z-index: 1;
    }

    .hero-content-wrapper {
      position: relative;
      z-index: 2;
      padding: 40px;
      max-width: 800px;

      &.variant-centered,
      &.variant-minimal {
        text-align: center;
      }

      &.variant-left-aligned {
        text-align: left;
      }

      &.variant-right-aligned {
        text-align: right;
      }
    }

    .preview-badge {
      display: inline-block;
      background: rgba(99, 102, 241, 0.2);
      color: #a5b4fc;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 16px;
      letter-spacing: 0.5px;
    }

    .preview-title {
      font-size: 3rem;
      font-weight: 800;
      margin: 0 0 16px 0;
      line-height: 1.2;
    }

    .preview-subtitle {
      font-size: 1.25rem;
      opacity: 0.8;
      margin: 0 0 24px 0;
      line-height: 1.6;
    }

    .preview-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .preview-cta {
      padding: 12px 28px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s;

      &.primary {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
        }
      }

      &.secondary {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);

        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }
  `]
})
export class EditorHeroIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    // Initialize content
    this.editableContent = {
      badge: this.config?.content?.['badge'] || '',
      title: this.config?.content?.['title'] || 'Less is More',
      subtitle: this.config?.content?.['subtitle'] || 'Minimalist design focuses on the essential, stripping away the unnecessary.',
      ctaLabel: this.config?.content?.['ctaLabel'] || 'Read More',
      ctaHref: this.config?.content?.['ctaHref'] || '',
      secondaryCtaLabel: this.config?.content?.['secondaryCtaLabel'] || '',
      secondaryCtaHref: this.config?.content?.['secondaryCtaHref'] || '',
      backgroundType: this.config?.content?.['backgroundType'] || 'none',
      backgroundImage: this.config?.content?.['backgroundImage'] || '',
      backgroundVideo: this.config?.content?.['backgroundVideo'] || '',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#1a1a2e',
      backgroundGradient: this.config?.content?.['backgroundGradient'] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      overlay: this.config?.content?.['overlay'] ?? false,
      overlayOpacity: this.config?.content?.['overlayOpacity'] || 50,
      variant: this.config?.content?.['variant'] || 'minimal',
      height: this.config?.content?.['height'] || 'auto',
      customHeight: this.config?.content?.['customHeight'] || 400,
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      textAlign: this.config?.content?.['textAlign'] || 'center',
    };

    // Initialize styles
    this.editableStyles = { ...this.config?.styles };

    // Initialize position and size
    this.currentPosition = {
      x: this.config?.position?.x ?? 2000 - 400,
      y: this.config?.position?.y ?? 2000 - 200
    };
    this.currentSize = {
      width: this.config?.size?.width || 800,
      height: this.config?.size?.height || 400
    };

    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.5;

    this.saveState();
  }

  getPreviewHeight(): string {
    if (this.editableContent.height === 'screen') {
      return '100%';
    } else if (this.editableContent.height === 'custom') {
      return `${this.editableContent.customHeight || 400}px`;
    }
    return 'auto';
  }

  getPreviewBackground(): string {
    switch (this.editableContent.backgroundType) {
      case 'solid':
        return this.editableContent.backgroundColor || '#1a1a2e';
      case 'gradient':
        return this.editableContent.backgroundGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'image':
        return `url(${this.editableContent.backgroundImage}) center/cover`;
      case 'video':
        return '#000000';
      default:
        return 'transparent';
    }
  }

  override apply() {
    this.applied.emit({
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
    });
  }
}
