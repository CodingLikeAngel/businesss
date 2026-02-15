import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

// Re-export IsolatedModeConfig for convenience
export { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

@Component({
  selector: 'lib-editor-cta-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- ===== HEADER ===== -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">📣 CTA EDITOR</span>
            <span class="separator">/</span>
            <span class="component-name">CONVERSION GOLD</span>
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
            </div>

            <div class="divider"></div>

            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <!-- ===== BODY ===== -->
        <div class="isolated-mode-body">
          
          <!-- Sidebar Controls -->
          <div class="controls-sidebar">
            <div class="sidebar-tabs">
              <button [class.active]="activeTab === 'content'" (click)="activeTab = 'content'">CONTENIDO</button>
              <button [class.active]="activeTab === 'design'" (click)="activeTab = 'design'">DISEÑO</button>
            </div>

            <div class="sidebar-scroll-content">
              
              <!-- CONTENT SECTION -->
              <div class="sidebar-section animate-fade-in" *ngIf="activeTab === 'content'">
                <div class="section-header">
                  <span class="section-icon">✍️</span>
                  <h4>MENSAJE PERSUASIVO</h4>
                </div>
                
                <div class="control-group">
                  <label>Título Gancho</label>
                  <input type="text" [(ngModel)]="editableContent.title" (ngModelChange)="onContentChange()" class="premium-input" placeholder="¿Listo para empezar?">
                </div>

                <div class="control-group">
                  <label>Subtítulo / Bajada</label>
                  <textarea [(ngModel)]="editableContent.subtitle" (ngModelChange)="onContentChange()" class="premium-textarea h-24" placeholder="Escribe un mensaje que convierta..."></textarea>
                </div>

                <div class="divider-section"></div>

                <div class="section-header mt-6">
                  <span class="section-icon">🖱️</span>
                  <h4>ACCIONES</h4>
                </div>

                <div class="control-group">
                  <label>Texto Botón Principal</label>
                  <input type="text" [(ngModel)]="editableContent.primaryButtonText" (ngModelChange)="onContentChange()" class="premium-input">
                </div>

                <div class="control-group">
                  <label>Texto Botón Secundario</label>
                  <input type="text" [(ngModel)]="editableContent.secondaryButtonText" (ngModelChange)="onContentChange()" class="premium-input" placeholder="Opcional...">
                </div>
              </div>

              <!-- DESIGN SECTION -->
              <div class="sidebar-section animate-fade-in" *ngIf="activeTab === 'design'">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>APARIENCIA GOLD</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante de Layout</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="centered">Centrado Absoluto</option>
                    <option value="split">Dividido Horizontal</option>
                    <option value="glass">Cristal / Glassmorphism</option>
                    <option value="neon">Neón Pulse</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Estilo de Botón</label>
                  <select [(ngModel)]="editableContent.buttonStyle" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="solid">Sólido Moderno</option>
                    <option value="outline">Sólo Contorno</option>
                    <option value="glow">Brillo Exterior (Glow)</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Radio de Borde ({{ editableStyles.borderRadius }}px)</label>
                  <input type="range" min="0" max="60" step="4" [(ngModel)]="editableStyles.borderRadius" (ngModelChange)="onContentChange()" class="premium-range">
                </div>

                <div class="divider-section"></div>

                <div class="section-header mt-6">
                  <span class="section-icon">🌈</span>
                  <h4>PALETA DE COLOR</h4>
                </div>

                <div class="control-group">
                  <label>Color de Fondo</label>
                  <div class="color-row">
                    <div class="color-preview" [style.background-color]="editableContent.backgroundColor">
                      <input type="color" [(ngModel)]="editableContent.backgroundColor" (ngModelChange)="onContentChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableContent.backgroundColor" (ngModelChange)="onContentChange()" class="premium-input-mini">
                  </div>
                </div>

                <div class="control-group">
                  <label>Color de Acento (Botón)</label>
                  <div class="color-row">
                    <div class="color-preview" [style.background-color]="editableContent.accentColor">
                      <input type="color" [(ngModel)]="editableContent.accentColor" (ngModelChange)="onContentChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableContent.accentColor" (ngModelChange)="onContentChange()" class="premium-input-mini">
                  </div>
                </div>

                <div class="control-group">
                  <label>Color de Texto</label>
                  <div class="color-row">
                    <div class="color-preview" [style.background-color]="editableContent.textColor">
                      <input type="color" [(ngModel)]="editableContent.textColor" (ngModelChange)="onContentChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableContent.textColor" (ngModelChange)="onContentChange()" class="premium-input-mini">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Canvas Area -->
          <div class="isolated-canvas" #canvas (mousedown)="onCanvasMouseDown($event)">
              <div class="canvas-inner" #canvasInner
                   [style.transform]="'scale(' + viewportScale + ')'"
                   [style.transformOrigin]="'center top'"
                   [class.show-grid]="showGrid"
                   [class.grid-snapping]="snapToGrid">
                
                <div class="draggable-wrapper"
                     #draggableWrapper
                     [style.left.px]="currentPosition.x"
                     [style.top.px]="currentPosition.y"
                     [style.width.px]="currentSize.width"
                     [style.background]="editableContent.backgroundColor"
                     [style.color]="editableContent.textColor"
                     [style.borderRadius.px]="editableStyles.borderRadius"
                     [class.is-dragging]="isDragging"
                     [class.is-resizing]="isResizing"
                     [class]="'cta-variant--' + editableContent.variant"
                     (mousedown)="onMouseDown($event)">
                  
                  <div class="cta-render-zone">
                      <h2 class="title-render">{{ editableContent.title }}</h2>
                      <p class="subtitle-render">{{ editableContent.subtitle }}</p>
                      
                      <div class="actions-render">
                         <button class="btn-main" 
                                 [class]="'btn--' + editableContent.buttonStyle"
                                 [style.background]="editableContent.accentColor"
                                 [style.boxShadow]="editableContent.buttonStyle === 'glow' ? '0 0 30px ' + editableContent.accentColor + '66' : 'none'">
                            {{ editableContent.primaryButtonText }}
                         </button>
                         <button class="btn-sub" 
                                 *ngIf="editableContent.secondaryButtonText"
                                 [style.borderColor]="editableContent.textColor"
                                 [style.color]="editableContent.textColor">
                            {{ editableContent.secondaryButtonText }}
                         </button>
                      </div>
                  </div>

                  <!-- Resize handles -->
                  <div class="resize-handle e"  (mousedown)="startResize($event, 'e')"></div>
                  <div class="resize-handle w"  (mousedown)="startResize($event, 'w')"></div>
                </div>
              </div>

            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">VARIANTE</span><span class="value uppercase text-emerald-400">{{ editableContent.variant }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">WIDTH</span><span class="value">{{ currentSize.width }}px</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">BG</span><span class="value uppercase">{{ editableContent.backgroundColor }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">CTA Gold: Impacto visual directo diseñado para maximizar tus conversiones.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Llamada a Acción</button>
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

    .sidebar-tabs { display: flex; background: rgba(15, 23, 42, 0.4); border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      button { flex: 1; padding: 1.2rem 0.5rem; background: transparent; border: none; color: #64748b; font-size: 10px; font-weight: 900; letter-spacing: 1.5px; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        &.active { color: #10b981; border-bottom-color: #10b981; background: rgba(16, 185, 129, 0.05); }
      }
    }

    .canvas-inner { width: 4000px; height: 3000px; position: relative; padding-top: 150px;
      &.show-grid { background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px); background-size: 40px 40px; }
    }

    .draggable-wrapper { position: absolute !important; cursor: move; z-index: 100; border: 2px dashed transparent; padding: 80px; transition: border-color 0.2s, box-shadow 0.4s;
      &:hover { border-color: rgba(16, 185, 129, 0.3); }
      &.is-dragging, &.is-resizing { border-color: #10b981; background: rgba(16, 185, 129, 0.02); }
      
      &.cta-variant--centered { text-align: center; }
      &.cta-variant--split { display: flex; align-items: center; justify-content: space-between; text-align: left; .cta-render-zone { max-width: 60%; } }
      &.cta-variant--glass { background: rgba(255, 255, 255, 0.03) !important; backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1) !important; box-shadow: 0 40px 100px rgba(0,0,0,0.5); }
      &.cta-variant--neon { border: 2px solid #10b981 !important; box-shadow: 0 0 50px rgba(16, 185, 129, 0.2), inset 0 0 50px rgba(16, 185, 129, 0.1); }
    }

    .title-render { font-size: 48px; font-weight: 900; margin-bottom: 1.5rem; line-height: 1.1; }
    .subtitle-render { font-size: 20px; opacity: 0.8; margin-bottom: 3rem; line-height: 1.6; max-width: 800px; margin-left: auto; margin-right: auto; }
    .cta-variant--split .subtitle-render { margin-left: 0; }

    .actions-render { display: flex; gap: 20px; justify-content: inherit; }
    .btn-main, .btn-sub { padding: 1.2rem 2.5rem; border-radius: 16px; font-weight: 900; font-size: 16px; border: none; cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .btn-main { color: white; &:hover { transform: scale(1.05); } &.btn--outline { background: transparent !important; border: 2px solid currentColor; } }
    .btn-sub { background: transparent; border: 2px solid transparent; &:hover { transform: scale(1.05); background: rgba(255,255,255,0.05); } }

    .color-row { display: flex; gap: 10px; align-items: center; .color-preview { width: 34px; height: 34px; border-radius: 8px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); input { position: absolute; inset: -5px; width: 150%; height: 150%; cursor: pointer; opacity: 0; } } }

    .premium-input, .premium-select, .premium-textarea { width: 100%; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); color: white; padding: 0.8rem 1rem; border-radius: 12px; font-size: 13px; transition: all 0.2s; &:focus { border-color: #10b981; outline: none; background: #0f172a; } }
    .premium-input-mini { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-family: monospace; }
    .premium-range { width: 100%; accent-color: #10b981; }

    .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class EditorCTAIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvas') canvasRef!: ElementRef;

  activeTab: 'content' | 'design' = 'content';

  protected override getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement;
  }

  protected override initializeState() {
    this.editableContent = { 
        ...this.config.content,
        title: this.config.content.title || '¿Listo para escalar?',
        subtitle: this.config.content.subtitle || 'Transforma tu presencia digital hoy mismo.',
        primaryButtonText: this.config.content.primaryButtonText || 'Empezar ahora',
        secondaryButtonText: this.config.content.secondaryButtonText || 'Ver Demo',
        variant: this.config.content.variant || 'centered',
        buttonStyle: this.config.content.buttonStyle || 'solid',
        backgroundColor: this.config.content.backgroundColor || '#0f172a',
        accentColor: this.config.content.accentColor || '#10b981',
        textColor: this.config.content.textColor || '#ffffff'
    };
    
    this.editableStyles = { 
        ...this.config.styles,
        borderRadius: parseInt(this.config.styles.borderRadius) || 24
    };
    
    this.currentPosition = { ...(this.config.position || { x: 250, y: 120 }) };
    this.currentSize = { 
        width: this.config.size?.width || 1000, 
        height: this.config.size?.height || 500 
    };
    
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };
    this.viewportScale = 0.55;

    this.saveState();
  }

  override saveState() {
    const newState = {
      position: { ...this.currentPosition },
      size: { ...this.currentSize },
      styles: JSON.parse(JSON.stringify(this.editableStyles)),
      content: JSON.parse(JSON.stringify(this.editableContent))
    };

    const lastState = this.undoStack[this.undoStack.length - 1];
    if (lastState && JSON.stringify(lastState) === JSON.stringify(newState)) return;

    this.undoStack.push(newState as any);
    if (this.undoStack.length > 50) this.undoStack.shift();
    this.redoStack = [];
  }

  override apply() {
    this.applied.emit({
      ...this.config,
      content: { 
        ...this.editableContent
      },
      styles: {
        ...this.editableStyles,
        borderRadius: this.editableStyles.borderRadius + 'px',
        left: this.currentPosition.x + 'px',
        top: this.currentPosition.y + 'px',
        width: this.currentSize.width + 'px',
        position: 'absolute'
      },
      position: { ...this.currentPosition },
      size: { ...this.currentSize }
    });
  }

  override onContentChange() {
    this.scheduleSaveState();
  }

  override onCanvasMouseDown(event: MouseEvent) { }
  onOverlayClick(event: MouseEvent) { this.cancel(); }
}
