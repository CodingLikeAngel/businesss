import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  Store 
} from '@ngrx/store';
import { AppState } from '../../../../store/state/app.state';
import { selectCurrentPageGlobalStyles } from '../../../../store/selectors/page.selectors';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';
export { IsolatedModeConfig };

export interface UndoRedoState {
  content: any;
  styles: any;
}

@Component({
  selector: 'lib-editor-cta-isolated-mode',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">📣 CALL TO ACTION</span>
            <span class="separator">/</span>
            <span class="component-name">CONVERSIÓN Y CIERRE</span>
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
            
            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <div class="isolated-mode-body">
          <!-- Sidebar Controls -->
          <div class="controls-sidebar">
            <div class="sidebar-scroll-content">
              
              <!-- SECCIÓN: TEXTO -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">✍️</span>
                  <h4>MENSAJE PERSUASIVO</h4>
                </div>
                
                <div class="control-group">
                  <label>Título de Impacto</label>
                  <input type="text" [(ngModel)]="editableContent.title" (ngModelChange)="onPartialChange()" class="premium-input">
                </div>

                <div class="control-group">
                  <label>Subtítulo / Bajada</label>
                  <textarea [(ngModel)]="editableContent.subtitle" (ngModelChange)="onPartialChange()" class="premium-input h-24"></textarea>
                </div>
              </div>

              <!-- SECCIÓN: BOTONES -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🖱️</span>
                  <h4>ACCIONES (BOTONES)</h4>
                </div>
                
                <div class="control-group">
                  <label>Botón Principal (Texto)</label>
                  <input type="text" [(ngModel)]="editableContent.primaryButtonText" (ngModelChange)="onPartialChange()" class="premium-input">
                </div>

                <div class="control-group">
                  <label>Botón Secundario (Texto)</label>
                  <input type="text" [(ngModel)]="editableContent.secondaryButtonText" (ngModelChange)="onPartialChange()" class="premium-input">
                </div>
              </div>

              <!-- SECCIÓN: ESTILO VISUAL -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">✨</span>
                  <h4>APARIENCIA PREMIUM</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante de Layout</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onPartialChange()" class="premium-input">
                    <option value="centered">Centrado Máximo</option>
                    <option value="split">Dividido (Izquierda/Derecha)</option>
                    <option value="glass">Cristal / Glassmorphism</option>
                    <option value="neon">Neon Pulse</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Aspecto de Botón Principal</label>
                  <select [(ngModel)]="editableContent.buttonStyle" (ngModelChange)="onPartialChange()" class="premium-input">
                    <option value="solid">Sólido</option>
                    <option value="outline">Contorno</option>
                    <option value="glow">Brillo Exterior</option>
                  </select>
                </div>
              </div>

              <!-- SECCIÓN: COLORES -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>COLORES PERSONALIZADOS</h4>
                </div>

                <div class="control-group">
                  <label>Color de Fondo (Sección)</label>
                  <div class="flex gap-2">
                    <input type="color" [(ngModel)]="editableContent.backgroundColor" (ngModelChange)="onPartialChange()" class="color-picker-premium">
                    <input type="text" [(ngModel)]="editableContent.backgroundColor" (ngModelChange)="onPartialChange()" class="premium-input-small">
                  </div>
                </div>

                <div class="control-group">
                  <label>Color de Acento (Botón)</label>
                  <div class="flex gap-2">
                    <input type="color" [(ngModel)]="editableContent.accentColor" (ngModelChange)="onPartialChange()" class="color-picker-premium">
                    <input type="text" [(ngModel)]="editableContent.accentColor" (ngModelChange)="onPartialChange()" class="premium-input-small">
                  </div>
                </div>

                <div class="control-group">
                  <label>Color de Texto</label>
                  <div class="flex gap-2">
                    <input type="color" [(ngModel)]="editableContent.textColor" (ngModelChange)="onPartialChange()" class="color-picker-premium">
                    <input type="text" [(ngModel)]="editableContent.textColor" (ngModelChange)="onPartialChange()" class="premium-input-small">
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Canvas Area -->
          <div class="isolated-canvas cta-stage">
            <div class="canvas-inner" [style.background]="editableContent.backgroundColor">
               <div class="cta-preview-wrapper" [class]="'cta-layout--' + editableContent.variant">
                  
                  <div class="cta-content-zone" [style.color]="editableContent.textColor">
                     <h2 class="premium-cta-title">{{ editableContent.title }}</h2>
                     <p class="premium-cta-subtitle">{{ editableContent.subtitle }}</p>
                     
                     <div class="cta-actions-row">
                        <button class="cta-btn primary" 
                                [class]="'btn--' + editableContent.buttonStyle"
                                [style.background]="editableContent.accentColor"
                                [style.box-shadow]="editableContent.buttonStyle === 'glow' ? '0 0 20px ' + editableContent.accentColor : 'none'">
                           {{ editableContent.primaryButtonText }}
                        </button>
                        <button class="cta-btn secondary" 
                                *ngIf="editableContent.secondaryButtonText"
                                [style.border-color]="editableContent.textColor"
                                [style.color]="editableContent.textColor">
                           {{ editableContent.secondaryButtonText }}
                        </button>
                     </div>
                  </div>

               </div>
            </div>

            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">LAYOUT</span><span class="value uppercase text-cyan-400">{{ editableContent.variant }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">BG</span><div class="color-dot" [style.background]="editableContent.backgroundColor"></div><span class="value">{{ editableContent.backgroundColor }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">ACCENT</span><div class="color-dot" [style.background]="editableContent.accentColor"></div><span class="value">{{ editableContent.accentColor }}</span></div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Tip: Los CTA centrados con poco texto suelen tener un 30% más de tasa de click.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Publicar CTA</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .isolated-mode-overlay {
      position: fixed; inset: 0 !important; background: rgba(2, 6, 23, 0.98); backdrop-filter: blur(20px);
      z-index: 9999999 !important; display: flex; align-items: center; justify-content: center; padding: 1.5vh 1.5vw;
    }

    .isolated-mode-container {
      background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 32px;
      width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden;
      box-shadow: 0 60px 180px -40px rgba(0, 0, 0, 1);
      animation: premium-slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes premium-slide-up {
      from { opacity: 0; transform: translateY(40px) rotateX(10deg); }
      to { opacity: 1; transform: translateY(0) rotateX(0); }
    }

    .isolated-mode-header {
      height: 75px; padding: 0 2rem; background: #1e293b; border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex; align-items: center; justify-content: space-between;
    }

    .mode-badge { font-size: 10px; font-weight: 900; color: #34d399; background: rgba(52, 211, 153, 0.1); padding: 6px 14px; border-radius: 10px; border: 1px solid rgba(52, 211, 153, 0.2); }
    .component-name { color: white; font-size: 16px; font-weight: 800; margin-left: 15px; }
    .header-actions { display: flex; align-items: center; gap: 1.5rem; }

    .icon-btn {
      width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;
      background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8; border-radius: 14px; cursor: pointer; transition: all 0.3s;
    }
    .icon-btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.1); color: white; border-color: #34d399; transform: scale(1.05); }
    .icon-btn:disabled { opacity: 0.15; cursor: not-allowed; }

    .close-main-btn {
      width: 42px; height: 42px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);
      color: #ef4444; border-radius: 14px; cursor: pointer; transition: all 0.2s;
    }
    .close-main-btn:hover { background: #ef4444; color: white; transform: rotate(90deg); }

    .isolated-mode-body {
      flex: 1;
      display: flex;
      flex-direction: row; /* Explicit row */
      overflow: hidden;
    }

    .controls-sidebar {
      width: 380px;
      min-width: 380px; /* Safety */
      flex-shrink: 0; /* Prevent shrinking */
      background: #020617;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      overflow-y: auto;
    }

    .sidebar-scroll-content { padding: 2.5rem; }
    .sidebar-section { margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    .sidebar-section.no-border { border-bottom: none; }
    .section-header { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1.5rem; }
    .section-header h4 { margin: 0; font-size: 12px; color: #64748b; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; }

    .control-group { margin-bottom: 1.8rem; }
    .control-group label { display: block; font-size: 11px; color: #94a3b8; margin-bottom: 0.9rem; font-weight: 800; }

    .premium-input {
      width: 100%; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.12);
      color: white; padding: 1rem 1.25rem; border-radius: 18px; font-size: 15px; transition: all 0.3s;
    }
    .premium-input:focus { border-color: #34d399; background: rgba(15, 23, 42, 1); outline: none; box-shadow: 0 0 25px rgba(52, 211, 153, 0.1); }

    .premium-input-small { width: 90px; background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); color: white; padding: 0.6rem; border-radius: 12px; font-size: 12px; }
    .color-picker-premium { width: 48px; height: 40px; border: none; border-radius: 12px; cursor: pointer; background: transparent; }

    .isolated-canvas {
      flex: 1; background: #020617; position: relative; overflow: hidden;
      background-image: radial-gradient(rgba(52, 211, 153, 0.05) 1px, transparent 1px); background-size: 80px 80px;
    }

    .canvas-inner { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 100px; }
    
    .cta-preview-wrapper { width: 100%; max-width: 900px; padding: 80px; border-radius: 40px; position: relative; overflow: hidden; transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1); border: 1px solid rgba(255, 255, 255, 0.05); }
    
    .cta-layout--centered { text-align: center; }
    .cta-layout--split { display: flex; align-items: center; gap: 40px; text-align: left; }
    .cta-layout--glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border-color: rgba(255, 255, 255, 0.1); box-shadow: 0 40px 100px rgba(0,0,0,0.5); }
    .cta-layout--neon { border: 2px solid #34d399; box-shadow: 0 0 40px rgba(52, 211, 153, 0.2), inset 0 0 40px rgba(52, 211, 153, 0.1); }

    .premium-cta-title { font-size: 64px; font-weight: 900; margin-bottom: 2rem; letter-spacing: -0.02em; line-height: 1.1; }
    .premium-cta-subtitle { font-size: 24px; line-height: 1.6; font-weight: 500; opacity: 0.8; margin-bottom: 3.5rem; }

    .cta-actions-row { display: flex; gap: 20px; justify-content: inherit; }
    
    .cta-btn { padding: 1.25rem 2.8rem; border-radius: 20px; font-weight: 900; font-size: 18px; border: none; cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .cta-btn.primary { color: white; }
    .cta-btn.primary:hover { transform: scale(1.05); }
    .cta-btn.secondary { background: transparent; border: 2px solid transparent; }
    .cta-btn.secondary:hover { transform: scale(1.05); background: rgba(255, 255, 255, 0.05); }
    
    .btn--outline { background: transparent !important; border: 2px solid currentColor !important; }

    .modern-position-dock { position: absolute; bottom: 45px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.98); backdrop-filter: blur(15px); padding: 1rem 2.5rem; border-radius: 26px; border: 1px solid rgba(255, 255, 255, 0.12); display: flex; gap: 2.5rem; color: white; font-size: 14px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6); }
    .dock-divider { width: 1px; background: rgba(255, 255, 255, 0.15); }
    .dock-item { display: flex; align-items: center; gap: 0.9rem; }
    .dock-item .label { color: #64748b; font-weight: 900; text-transform: uppercase; font-size: 12px; }
    .color-dot { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); }

    .isolated-mode-footer { height: 85px; padding: 0 3.5rem; background: #1e293b; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.12); }
    .footer-hint { font-size: 14px; color: #94a3b8; font-weight: 700; }
    .btn-clean { padding: 0.9rem 2.5rem; border-radius: 18px; font-weight: 900; cursor: pointer; border: none; font-size: 15px; transition: all 0.3s; }
    .btn-clean.primary { background: #34d399; color: #020617; box-shadow: 0 8px 25px rgba(52, 211, 153, 0.4); }
    .btn-clean.secondary { background: transparent; color: #94a3b8; }
    .btn-clean.secondary:hover { color: white; background: rgba(255, 255, 255, 0.08); }
  `]
})
export class EditorCTAIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() config!: IsolatedModeConfig;
  @Output() closed = new EventEmitter<void>();
  @Output() applied = new EventEmitter<IsolatedModeConfig>();

  private store = inject(Store<AppState>);

  // State
  editableContent: any = {};
  
  // Undo/Redo
  undoStack: UndoRedoState[] = [];
  redoStack: UndoRedoState[] = [];

  private saveTimeout: any;

  get canUndo() { return this.undoStack.length > 1; }
  get canRedo() { return this.redoStack.length > 0; }

  ngOnInit() {
    this.initializeState();
  }

  private initializeState() {
    this.editableContent = {
      title: this.config.content.title || '¿Listo para escalar?',
      subtitle: this.config.content.subtitle || 'Únete a más de 10,000 empresas que ya están transformando su futuro digital.',
      primaryButtonText: this.config.content.primaryButtonText || 'Empezar ahora',
      secondaryButtonText: this.config.content.secondaryButtonText || 'Agendar Demo',
      variant: this.config.content.variant || 'centered',
      buttonStyle: this.config.content.buttonStyle || 'solid',
      backgroundColor: this.config.content.backgroundColor || '#0f172a',
      accentColor: this.config.content.accentColor || '#34d399',
      textColor: this.config.content.textColor || '#ffffff'
    };

    this.saveState();
  }

  ngOnDestroy() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
  }

  // --- ACTIONS ---
  saveState() {
    const state: UndoRedoState = {
      content: { ...this.editableContent },
      styles: { ...this.config.styles }
    };
    this.undoStack.push(state);
    this.redoStack = [];
    if (this.undoStack.length > 50) this.undoStack.shift();
  }

  undo() {
    if (this.undoStack.length > 1) {
      this.redoStack.push(this.undoStack.pop()!);
      this.restoreState(this.undoStack[this.undoStack.length - 1]);
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop()!;
      this.undoStack.push(state);
      this.restoreState(state);
    }
  }

  private restoreState(state: UndoRedoState) {
    this.editableContent = { ...state.content };
  }

  onPartialChange() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => this.saveState(), 800);
  }

  onOverlayClick(event: MouseEvent) { this.closed.emit(); }
  close() { this.closed.emit(); }
  cancel() { this.closed.emit(); }

  apply() {
    const config: IsolatedModeConfig = {
      ...this.config,
      content: { 
        ...this.config.content,
        ...this.editableContent
      }
    };
    this.applied.emit(config);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') this.close();
    if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
      event.preventDefault();
      this.undo();
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
      event.preventDefault();
      this.redo();
    }
  }
}
