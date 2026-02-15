import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  UIHeroSectionComponent, 
  UIHeroMinimalComponent 
} from '@negocio/featured-components';
import { AppState } from '../../../../store/state/app.state';
import { selectCurrentPageGlobalStyles } from '../../../../store/selectors/page.selectors';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

// Re-export IsolatedModeConfig for convenience
export { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

@Component({
  selector: 'lib-editor-hero-isolated-mode',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    UIHeroSectionComponent,
    UIHeroMinimalComponent
  ],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">⚡ HERO EDITOR</span>
            <span class="separator">/</span>
            <span class="component-name">BRANDING & LAYOUT GOLD</span>
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

        <!-- ===== BODY ===== -->
        <div class="isolated-mode-body">
          
          <!-- Sidebar Controls -->
          <div class="controls-sidebar">
            <div class="sidebar-scroll-content">
              
              <!-- CONTENT SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📝</span>
                  <h4>CONTENIDO ESTRATÉGICO</h4>
                </div>
                
                <div class="control-group">
                  <label>Título Principal</label>
                  <input type="text" [(ngModel)]="editableContent.title" (ngModelChange)="onContentChange()" class="premium-input" placeholder="Título impactante...">
                </div>

                <div class="control-group">
                  <label>Cuerpo / Descripción</label>
                  <textarea [(ngModel)]="editableContent.subtitle" (ngModelChange)="onContentChange()" class="premium-textarea" placeholder="Describe tu propuesta de valor..."></textarea>
                </div>

                <div class="control-row grid grid-cols-2 gap-4 mt-4">
                  <div class="control-group">
                    <label>Texto Botón (CTA)</label>
                    <input type="text" [(ngModel)]="editableContent.ctaLabel" (ngModelChange)="onContentChange()" class="premium-input" placeholder="Comenzar">
                  </div>
                  <div class="control-group">
                    <label>Nombre Marca</label>
                    <input type="text" [(ngModel)]="editableContent.businessName" (ngModelChange)="onContentChange()" class="premium-input" placeholder="Tu Marca">
                  </div>
                </div>
              </div>

              <!-- LAYOUT & VARIANTS -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">✨</span>
                  <h4>DISEÑO & LAYOUT</h4>
                </div>
                
                <div class="control-group">
                  <label>Arquitectura de Sección</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onContentChange()" class="premium-select">
                    <optgroup label="Minimalistas">
                      <option value="default">Clásico Equilibrado</option>
                      <option value="minimal">Minimal Pro (Dark)</option>
                      <option value="split">Split Layout (Mitades)</option>
                    </optgroup>
                    <optgroup label="Visuales Premium">
                      <option value="glass">Glassmorphism (Cristal)</option>
                      <option value="matrix">Matrix Code (Digital)</option>
                      <option value="cyberpunk">Cyberpunk Neon</option>
                      <option value="stellar">Cosmos / Estelar</option>
                      <option value="phoenix">Llamas Phoenix</option>
                    </optgroup>
                  </select>
                </div>

                <div class="checkbox-control mt-4" (click)="editableContent.videoBackground = !editableContent.videoBackground; onContentChange()">
                   <div class="custom-checkbox" [class.checked]="editableContent.videoBackground"></div>
                   <span>Fondo con Video Activo</span>
                </div>

                <div *ngIf="editableContent.videoBackground" class="control-group mt-3 animate-fade-in">
                  <label>URL Video de Fondo (MP4)</label>
                  <input type="text" [(ngModel)]="editableContent.videoUrl" (ngModelChange)="onContentChange()" class="premium-input" placeholder="https://...">
                </div>

                <div class="control-row grid grid-cols-2 gap-4 mt-6">
                  <div class="checkbox-control" (click)="editableContent.showCta = !editableContent.showCta; onContentChange()">
                     <div class="custom-checkbox" [class.checked]="editableContent.showCta"></div>
                     <span>Mostrar CTA</span>
                  </div>
                  <div class="checkbox-control" (click)="editableContent.showScrollIcon = !editableContent.showScrollIcon; onContentChange()">
                     <div class="custom-checkbox" [class.checked]="editableContent.showScrollIcon"></div>
                     <span>Icono Scroll</span>
                  </div>
                </div>
              </div>

              <!-- BRANDING COLORS -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>BRANDING & COLORES</h4>
                </div>
                
                <div class="control-group">
                  <label>Fondo de Sección</label>
                  <div class="color-control-wrapper">
                    <div class="color-input-wrapper">
                      <div class="color-preview" [style.background-color]="editableStyles.backgroundColor">
                        <input type="color" [(ngModel)]="editableStyles.backgroundColor" (ngModelChange)="onContentChange()">
                      </div>
                      <input type="text" [(ngModel)]="editableStyles.backgroundColor" (ngModelChange)="onContentChange()" class="premium-input hex-input">
                    </div>
                    <div class="theme-palette" *ngIf="globalColors$ | async as colors">
                      <div *ngFor="let c of colors" class="palette-swatch" [style.background-color]="c" (click)="editableStyles.backgroundColor = c; onContentChange()"></div>
                    </div>
                  </div>
                </div>

                <div class="control-group">
                  <label>Color del Texto</label>
                  <div class="color-input-wrapper">
                    <div class="color-preview" [style.background-color]="editableStyles.color">
                      <input type="color" [(ngModel)]="editableStyles.color" (ngModelChange)="onContentChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableStyles.color" (ngModelChange)="onContentChange()" class="premium-input hex-input">
                  </div>
                </div>
              </div>

              <!-- POSITION & CANVAS -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">📐</span>
                  <h4>DIMENSIONES CANVAS</h4>
                </div>
                <div class="control-row grid grid-cols-2 gap-2">
                  <div class="control-group">
                    <label>OFFSET X / Y</label>
                    <div class="flex gap-2">
                      <input type="number" [(ngModel)]="currentPosition.x" (ngModelChange)="onPositionChange()" class="premium-input text-center p-1">
                      <input type="number" [(ngModel)]="currentPosition.y" (ngModelChange)="onPositionChange()" class="premium-input text-center p-1">
                    </div>
                  </div>
                  <div class="control-group">
                    <label>VIEWPORT W / H</label>
                    <div class="flex gap-2">
                       <input type="number" [(ngModel)]="currentSize.width" (ngModelChange)="onSizeChange()" class="premium-input text-center p-1">
                       <input type="number" [(ngModel)]="currentSize.height" (ngModelChange)="onSizeChange()" class="premium-input text-center p-1">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Canvas Area -->
          <div class="isolated-canvas" #canvas (mousedown)="onCanvasMouseDown($event)">
              <div class="canvas-inner" #canvasInner
                   [style.transform]="'scale(' + viewportScale + ')'"
                   [style.transformOrigin]="'center'"
                   [class.show-grid]="showGrid"
                   [class.grid-snapping]="snapToGrid">
                
                <div class="draggable-wrapper"
                     #draggableWrapper
                     [style.left.px]="currentPosition.x"
                     [style.top.px]="currentPosition.y"
                     [style.width.px]="currentSize.width"
                     [style.height.px]="currentSize.height"
                     [class.is-dragging]="isDragging"
                     [class.is-resizing]="isResizing"
                     (mousedown)="onMouseDown($event)">
                  
                  <!-- Renderer Dinámico -->
                  <ng-container [ngSwitch]="editableContent.variant">
                    <lib-ui-hero-minimal
                      *ngSwitchCase="'minimal'"
                      [title]="editableContent.title"
                      [subtitle]="editableContent.subtitle"
                      [ctaLabel]="editableContent.ctaLabel"
                      [showCta]="editableContent.showCta"
                      [variant]="'dark'"
                      [customStyles]="editableStyles"
                      class="hero-instance">
                    </lib-ui-hero-minimal>

                    <lib-ui-hero-section
                      *ngSwitchDefault
                      [title]="editableContent.title"
                      [subtitle]="editableContent.subtitle"
                      [ctaLabel]="editableContent.ctaLabel"
                      [businessName]="editableContent.businessName"
                      [variant]="editableContent.variant || 'default'"
                      [showCta]="editableContent.showCta"
                      [showScrollIcon]="editableContent.showScrollIcon"
                      [videoBackground]="editableContent.videoBackground"
                      [videoUrl]="editableContent.videoUrl"
                      [customStyles]="editableStyles"
                      class="hero-instance">
                    </lib-ui-hero-section>
                  </ng-container>

                  <!-- 8-point Resize Handles -->
                  <div class="resize-handle nw" (mousedown)="startResize($event, 'nw')"></div>
                  <div class="resize-handle n"  (mousedown)="startResize($event, 'n')"></div>
                  <div class="resize-handle ne" (mousedown)="startResize($event, 'ne')"></div>
                  <div class="resize-handle e"  (mousedown)="startResize($event, 'e')"></div>
                  <div class="resize-handle se" (mousedown)="startResize($event, 'se')"></div>
                  <div class="resize-handle s"  (mousedown)="startResize($event, 's')"></div>
                  <div class="resize-handle sw" (mousedown)="startResize($event, 'sw')"></div>
                  <div class="resize-handle w"  (mousedown)="startResize($event, 'w')"></div>
                </div>
              </div>

            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">VARIANT</span><span class="value text-indigo-400 capitalize">{{ editableContent.variant }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">VIEWPORT</span><span class="value">{{ currentSize.width }}x{{ currentSize.height }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">VIDEO</span><span class="value" [class.text-green-400]="editableContent.videoBackground">{{ editableContent.videoBackground ? 'ON' : 'OFF' }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Hero Pro: La primera impresión es la que cuenta. Diseña para impactar.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Sección</button>
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

    .canvas-inner { width: 6000px; height: 4000px; position: relative; background-size: 40px 40px;
      &.show-grid { background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1.5px, transparent 1.5px); }
      &.grid-snapping { background-image: radial-gradient(rgba(99, 102, 241, 0.3) 2px, transparent 2px); }
    }

    .draggable-wrapper { position: absolute !important; cursor: move; z-index: 100; outline: 4px solid transparent; outline-offset: 8px; background: white; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.6);
      &:hover { outline-color: rgba(99, 102, 241, 0.3); }
      &.is-dragging, &.is-resizing { outline-color: #6366f1; outline-width: 5px; }
    }

    .hero-instance { width: 100%; height: 100%; display: block; pointer-events: none; }

    .checkbox-control { display: flex; align-items: center; gap: 10px; cursor: pointer;
      span { font-size: 11px; color: #94a3b8; font-weight: 800; text-transform: uppercase; }
    }
    .custom-checkbox { width: 20px; height: 20px; border: 2px solid rgba(255, 255, 255, 0.15); border-radius: 6px; position: relative; transition: all 0.2s;
      &.checked { background: #6366f1; border-color: #6366f1; }
      &.checked::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: 900; }
    }

    .premium-input, .premium-select { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.7rem 0.9rem; border-radius: 12px; font-size: 13px; }
    .premium-textarea { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 0.7rem 0.9rem; border-radius: 12px; font-size: 12px; height: 100px; resize: none; }
    
    .color-control-wrapper { display: flex; flex-direction: column; gap: 10px; }
    .color-input-wrapper { display: flex; gap: 10px; align-items: center; .color-preview { width: 42px; height: 42px; border-radius: 10px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); input { position: absolute; inset: -5px; width: 150%; height: 150%; cursor: pointer; opacity: 0; } } .hex-input { font-family: monospace; } }
    .theme-palette { display: flex; gap: 6px; flex-wrap: wrap; }
    .palette-swatch { width: 24px; height: 24px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(255, 255, 255, 0.1); transition: all 0.2s; &:hover { transform: scale(1.25); border-color: white; } }

    .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class EditorHeroIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;
  private store = inject(Store<AppState>);

  globalColors$: Observable<string[]> = this.store.select(selectCurrentPageGlobalStyles).pipe(
    map(styles => {
      if (!styles) return [];
      return [
        styles.primaryColor,
        styles.secondaryColor,
        styles.accentColor,
        styles.backgroundColor,
        styles.textColor
      ].filter(Boolean);
    })
  );

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = { 
        ...this.config.content,
        variant: this.config.content.variant || 'default',
        title: this.config.content.title || 'Título Hero',
        subtitle: this.config.content.subtitle || 'Subtítulo o descripción breve.',
        ctaLabel: this.config.content.ctaLabel || 'Saber Más',
        businessName: this.config.content.businessName || '',
        showCta: this.config.content.showCta !== false,
        showScrollIcon: this.config.content.showScrollIcon !== false,
        videoBackground: this.config.content.videoBackground || false,
        videoUrl: this.config.content.videoUrl || 'https://www.w3schools.com/tags/mov_bbb.mp4'
    };
    
    this.editableStyles = { 
        ...this.config.styles,
        backgroundColor: this.config.styles?.backgroundColor || '#111827',
        color: this.config.styles?.color || '#ffffff'
    };
    
    // Para secciones, por defecto ocupamos gran parte del canvas
    this.currentPosition = { ...(this.config.position || { x: 50, y: 50 }) };
    this.currentSize = { 
        width: parseInt(this.config.styles?.width) || 1200, 
        height: parseInt(this.config.styles?.height) || 700 
    };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.4; // Gran angular para secciones

    this.saveState();
  }

  override onContentChange() {
    this.scheduleSaveState();
  }

  override apply() {
    this.applied.emit({
      ...this.config,
      content: { ...this.editableContent },
      styles: {
        ...this.editableStyles,
        width: (this.currentSize.width > 0 ? this.currentSize.width + 'px' : '100%'),
        height: this.currentSize.height + 'px',
        position: 'relative'
      },
      position: { ...this.currentPosition },
      size: { ...this.currentSize }
    });
  }

  override onCanvasMouseDown(event: MouseEvent) { }
  onOverlayClick(event: MouseEvent) { this.cancel(); }
}
