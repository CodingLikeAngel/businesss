import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';

/**
 * Feature Item Interface for Isolated Mode
 */
export interface FeatureIsolatedItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  color?: string;
  iconType?: string;
  category?: string;
}

/**
 * Features Section Isolated Mode Content
 */
export interface FeaturesIsolatedModeContent {
  title?: string;
  subtitle?: string;
  variant?: string;
  features?: FeatureIsolatedItem[];
  backgroundColor?: string;
  textColor?: string;
}

/**
 * Features Section Isolated Mode Component
 * Provides premium editing experience for Features sections
 */
@Component({
  selector: 'lib-editor-features-isolated-mode',
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
            <span class="component-name">FEATURES SECTION</span>
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
                  <label>Título de la Sección</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.title" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="Ej: Nuestros Servicios Premium"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <textarea 
                    [(ngModel)]="editableContent.subtitle" 
                    (ngModelChange)="onContentChange()"
                    class="premium-textarea" 
                    placeholder="Describe tu sección..."
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Variante</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="default">Default</option>
                    <option value="grid">Grid</option>
                    <option value="list">Lista</option>
                    <option value="cards">Tarjetas</option>
                  </select>
                </div>
              </div>

              <!-- FEATURES SECTION -->
              <div class="sidebar-section" *ngIf="activeTab === 'content'">
                <div class="section-header">
                  <span class="section-icon">✨</span>
                  <h4>FEATURES ({{ editableContent.features?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addFeature()">+</button>
                </div>

                <div class="items-list">
                  <div class="item-editor" *ngFor="let feature of editableContent.features; let i = index">
                    <div class="item-header">
                      <span class="item-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeFeature(i)">×</button>
                    </div>
                    
                    <div class="control-group">
                      <label>Icono</label>
                      <input 
                        type="text" 
                        [(ngModel)]="feature.icon" 
                        (ngModelChange)="onContentChange()"
                        class="premium-input" 
                        placeholder="🚀"
                      />
                    </div>
                    
                    <div class="control-group">
                      <label>Título</label>
                      <input 
                        type="text" 
                        [(ngModel)]="feature.title" 
                        (ngModelChange)="onContentChange()"
                        class="premium-input" 
                        placeholder="Título del feature"
                      />
                    </div>
                    
                    <div class="control-group">
                      <label>Descripción</label>
                      <textarea 
                        [(ngModel)]="feature.description" 
                        (ngModelChange)="onContentChange()"
                        class="premium-textarea"
                        placeholder="Descripción..."
                      ></textarea>
                    </div>
                    
                    <div class="control-group">
                      <label>Color</label>
                      <input 
                        type="color" 
                        [(ngModel)]="feature.color" 
                        (ngModelChange)="onContentChange()"
                        class="premium-input color-input"
                      />
                    </div>
                  </div>
                </div>

                <button class="add-btn-full mt-4" (click)="addFeature()">+ Añadir Feature</button>
              </div>

              <!-- STYLE TAB -->
              <div class="sidebar-section no-border" *ngIf="activeTab === 'style'">
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

                <div class="section-header mt-6">
                  <span class="section-icon">📏</span>
                  <h4>DIMENSIONES</h4>
                </div>

                <div class="control-row">
                  <div class="control-group">
                    <label>Posición X</label>
                    <input type="number" [(ngModel)]="currentPosition.x" (ngModelChange)="onPositionChange()" class="premium-input text-center">
                  </div>
                  <div class="control-group">
                    <label>Posición Y</label>
                    <input type="number" [(ngModel)]="currentPosition.y" (ngModelChange)="onPositionChange()" class="premium-input text-center">
                  </div>
                </div>
                <div class="control-row">
                  <div class="control-group">
                    <label>Ancho (W)</label>
                    <input type="number" [(ngModel)]="currentSize.width" (ngModelChange)="onSizeChange()" class="premium-input text-center">
                  </div>
                  <div class="control-group">
                    <label>Alto (H)</label>
                    <input type="number" [(ngModel)]="currentSize.height" (ngModelChange)="onSizeChange()" class="premium-input text-center">
                  </div>
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
                
                <div class="preview-features" 
                     [style.background]="editableContent.backgroundColor || '#1a1a2e'"
                     [style.color]="editableContent.textColor || '#ffffff'">
                  
                  <div class="preview-header" *ngIf="editableContent.title || editableContent.subtitle">
                    <h2 class="preview-title">{{ editableContent.title || 'Título de Features' }}</h2>
                    <p class="preview-subtitle">{{ editableContent.subtitle || 'Subtítulo descriptivo' }}</p>
                  </div>
                  
                  <div class="preview-grid">
                    <div class="preview-feature" 
                         *ngFor="let feature of editableContent.features; let i = index"
                         [style.borderColor]="feature.color || '#6366f1'">
                      <div class="preview-icon" [style.background]="feature.color || '#6366f1'">
                        {{ feature.icon || '⭐' }}
                      </div>
                      <h3 class="preview-feature-title">{{ feature.title || 'Feature ' + (i + 1) }}</h3>
                      <p class="preview-feature-desc">{{ feature.description || 'Descripción del feature' }}</p>
                    </div>
                    
                    <div class="preview-feature placeholder" *ngIf="!editableContent.features?.length">
                      <div class="preview-icon">➕</div>
                      <p>Añade features desde el panel</p>
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
                <span class="value">{{ editableContent.variant || 'default' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">FEATURES</span>
                <span class="value">{{ editableContent.features?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Gestiona el contenido y estilo de tu sección de features.</div>
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
    @include item-editor;

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

    .preview-features {
      width: 100%;
      height: 100%;
      padding: 40px;
      border-radius: 8px;
      overflow: auto;
    }

    .preview-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .preview-title {
      font-size: 2rem;
      font-weight: 800;
      margin: 0 0 12px 0;
    }

    .preview-subtitle {
      font-size: 1rem;
      opacity: 0.8;
      margin: 0;
    }

    .preview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .preview-feature {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        border-color: rgba(99, 102, 241, 0.3);
      }

      &.placeholder {
        opacity: 0.5;
        border-style: dashed;
      }
    }

    .preview-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      margin: 0 auto 16px;
    }

    .preview-feature-title {
      font-size: 1rem;
      font-weight: 700;
      margin: 0 0 8px 0;
    }

    .preview-feature-desc {
      font-size: 0.875rem;
      opacity: 0.7;
      margin: 0;
      line-height: 1.5;
    }
  `]
})
export class EditorFeaturesIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = {
      title: this.config?.content?.['title'] || 'Nuestros Servicios Premium',
      subtitle: this.config?.content?.['subtitle'] || 'Descubre cómo podemos ayudarte a llevar tu negocio al siguiente nivel.',
      variant: this.config?.content?.['variant'] || 'default',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#1a1a2e',
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      features: this.config?.content?.['features'] || [
        { id: '1', icon: '🚀', title: 'Alta Velocidad', description: 'Optimizamos cada línea de código', color: '#3b82f6' },
        { id: '2', icon: '🛡️', title: 'Seguridad Total', description: 'Protegemos tus datos con estándares altos', color: '#10b981' },
        { id: '3', icon: '📱', title: 'Diseño Responsive', description: 'Perfecto en cualquier dispositivo', color: '#f59e0b' },
        { id: '4', icon: '🎨', title: 'UI/UX Increíble', description: 'Interfaces intuitivas que enamoran', color: '#ef4444' },
      ],
    };

    this.editableStyles = { ...this.config?.styles };

    this.currentPosition = {
      x: this.config?.position?.x ?? 2000 - 450,
      y: this.config?.position?.y ?? 2000 - 200
    };
    this.currentSize = {
      width: this.config?.size?.width || 900,
      height: this.config?.size?.height || 400
    };

    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.5;

    this.saveState();
  }

  addFeature() {
    if (!this.editableContent.features) {
      this.editableContent.features = [];
    }
    this.editableContent.features.push({
      id: Date.now().toString(),
      icon: '✨',
      title: 'Nuevo Feature',
      description: 'Descripción del nuevo feature',
      color: '#8b5cf6',
    });
    this.onContentChange();
  }

  removeFeature(index: number) {
    if (this.editableContent.features && index >= 0 && index < this.editableContent.features.length) {
      this.editableContent.features.splice(index, 1);
      this.onContentChange();
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
