import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UITitleComponent } from '@negocio/ui-components';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

@Component({
  selector: 'lib-editor-title-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UITitleComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">TEXT EDITOR</span>
            <span class="separator">/</span>
            <span class="component-name">TITLE & TYPOGRAPHY</span>
          </div>
          
          <div class="header-actions">
            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <div class="isolated-mode-body">
          <div class="controls-sidebar">
            <div class="sidebar-scroll-content">
              
              <!-- CONTENT SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">✏️</span>
                  <h4>CONTENIDO</h4>
                </div>
                
                <div class="control-group">
                  <label>Texto del Título</label>
                  <textarea [(ngModel)]="editableContent.text" class="premium-input" rows="3"></textarea>
                </div>

                <div class="control-group">
                  <label>Nivel de Encabezado</label>
                  <select [(ngModel)]="editableContent.level" class="premium-input">
                    <option value="h1">H1 - Principal</option>
                    <option value="h2">H2 - Sección</option>
                    <option value="h3">H3 - Subsección</option>
                    <option value="h4">H4 - Detalle</option>
                    <option value="h5">H5 - Menor</option>
                    <option value="h6">H6 - Mini</option>
                  </select>
                </div>
              </div>

              <!-- STYLE SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>ESTILO & APARIENCIA</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante Visual</label>
                  <select [(ngModel)]="editableContent.variant" class="premium-input">
                    <option value="default">Estándar</option>
                    <option value="gradient">Gradiente (Premium)</option>
                    <option value="outline">Contorno (Outline)</option>
                    <option value="glitch">Glitch Effect</option>
                    <option value="neon">Neon Glow</option>
                    <option value="3d">3D Depth</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Alineación</label>
                  <select [(ngModel)]="editableContent.align" class="premium-input">
                    <option value="left">Izquierda</option>
                    <option value="center">Centro</option>
                    <option value="right">Derecha</option>
                  </select>
                </div>

                 <div class="control-group">
                  <label>Animación de Entrada</label>
                  <select [(ngModel)]="editableContent.animation" class="premium-input">
                    <option value="none">Sin Animación</option>
                    <option value="fade-up">Fade Up</option>
                    <option value="fade-in">Fade In</option>
                    <option value="zoom-in">Zoom In</option>
                    <option value="typewriter">Máquina de Escribir</option>
                    <option value="slide-in">Deslizar</option>
                  </select>
                </div>
              </div>

              <!-- COLORS SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🌈</span>
                  <h4>COLORES</h4>
                </div>
                
                <div class="control-group">
                  <label>Color Principal</label>
                  <div class="color-control-wrapper">
                    <div class="color-input-wrapper">
                      <div class="color-preview" [style.background-color]="editableStyles['color']">
                        <input type="color" [(ngModel)]="editableStyles['color']">
                      </div>
                      <input type="text" [(ngModel)]="editableStyles['color']" class="premium-input hex-input">
                    </div>
                  </div>
                </div>

                <div class="control-group">
                  <label>Tamaño de Fuente (px/rem)</label>
                  <input type="text" [(ngModel)]="editableStyles['fontSize']" class="premium-input">
                </div>
              </div>

            </div>
          </div>

          <div class="isolated-canvas">
            <div class="canvas-inner">
              <div class="draggable-wrapper"
                   [style.width.px]="currentSize.width"
                   [style.height.px]="currentSize.height">
                
                <lib-ui-components-title
                  [text]="editableContent.text"
                  [level]="editableContent.level"
                  [variant]="editableContent.variant"
                  [align]="editableContent.align"
                  [animation]="editableContent.animation"
                  [customStyles]="editableStyles"
                  style="width: 100%; height: 100%; display: block;"
                ></lib-ui-components-title>

                <div class="resize-handle se" (mousedown)="startResize($event)"></div>
              </div>
            </div>
            
            <div class="modern-position-dock">
                <div class="dock-item"><span class="label">LEVEL</span><span class="value uppercase text-fuchsia-400">{{ editableContent.level }}</span></div>
                <div class="dock-divider"></div>
                <div class="dock-item"><span class="label">ALIGN</span><span class="value uppercase">{{ editableContent.align }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Utiliza variantes como 'Gradient' o 'Neon' para destacar tus encabezados principales.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .isolated-mode-overlay {
      position: fixed;
      inset: 0;
      background: rgba(2, 6, 23, 0.95);
      backdrop-filter: blur(8px);
      z-index: 9999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .isolated-mode-container {
      background: #0f172a;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.7);
    }
    .isolated-mode-header {
      height: 64px;
      padding: 0 1.5rem;
      background: #1e293b;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .mode-badge { font-size: 10px; font-weight: 800; color: #f472b6; background: rgba(244, 114, 182, 0.1); padding: 5px 10px; border-radius: 8px; border: 1px solid rgba(244, 114, 182, 0.2); }
    .component-name { color: white; font-size: 13px; font-weight: 600; margin-left: 8px; font-family: 'Inter', sans-serif; letter-spacing: 0.5px; }
    .close-main-btn { background: rgba(239, 68, 68, 0.1); color: #f87171; border: none; width: 32px; height: 32px; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
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
      border-right: 1px solid rgba(255,255,255,0.05);
      overflow-y: auto;
    }
    .sidebar-scroll-content { padding: 1.5rem; }
    .sidebar-section { margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1.5rem; }
    .section-header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.2rem; color: #94a3b8; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
    
    .control-group { margin-bottom: 1rem; }
    .control-group label { display: block; font-size: 9px; color: #64748b; margin-bottom: 0.3rem; text-transform: uppercase; font-weight: 700; }
    
    .premium-input {
      width: 100%;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255,255,255,0.1);
      color: white;
      padding: 0.6rem;
      border-radius: 8px;
      font-size: 12px;
    }
    .premium-input:focus { border-color: #f472b6; outline: none; background: #0f172a; }

    .color-control-wrapper { display: flex; gap: 0.5rem; }
    .color-input-wrapper { display: flex; gap: 0.8rem; width: 100%; }
    .color-preview { width: 36px; height: 36px; border-radius: 8px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.2); }
    .color-preview input { position: absolute; inset: -5px; width: 200%; height: 200%; cursor: pointer; }

    .isolated-canvas { flex: 1; background: #010409; position: relative; overflow: hidden; background-image: radial-gradient(#334155 1px, transparent 1px); background-size: 20px 20px; }
    .canvas-inner { width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center; padding: 40px; }
    
    .draggable-wrapper { position: relative; border: 1px dashed rgba(244, 114, 182, 0.4); padding: 5px; min-width: 100px; min-height: 40px; }
    .resize-handle { position: absolute; width: 10px; height: 10px; background: #f472b6; border: 2px solid white; border-radius: 50%; bottom: -5px; right: -5px; cursor: se-resize; }

    .modern-position-dock { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(10px); padding: 0.6rem 1.4rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); display: flex; gap: 1.5rem; color: white; font-size: 11px; }
    .dock-divider { width: 1px; background: rgba(255, 255, 255, 0.1); }
    .dock-item { display: flex; align-items: center; gap: 0.5rem; }
    .dock-item .label { color: #64748b; font-weight: 800; }

    .isolated-mode-footer { height: 72px; padding: 0 2rem; background: #1e293b; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); }
    .footer-hint { font-size: 11px; color: #64748b; font-style: italic; }
    .btn-clean { padding: 0.6rem 1.8rem; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; font-size: 12px; transition: all 0.2s; }
    .btn-clean.primary { background: #f472b6; color: white; box-shadow: 0 4px 15px rgba(244, 114, 182, 0.3); }
    .btn-clean.secondary { background: transparent; color: #94a3b8; }
    .btn-clean:hover { transform: translateY(-1px); filter: brightness(1.1); }
  `]
})
export class EditorTitleIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() public config!: IsolatedModeConfig;
  @Output() public closed = new EventEmitter<void>();
  @Output() public applied = new EventEmitter<IsolatedModeConfig>();

  public editableContent: any = {};
  public editableStyles: any = {};
  public currentSize = { width: 0, height: 0 };
  
  private isResizing = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private startW = 0;
  private startH = 0;

  ngOnInit() {
    this.editableContent = { ...this.config.content };
    this.editableStyles = { ...this.config.styles };
    this.currentSize = { ...this.config.size };

    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  ngOnDestroy() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  public startResize(e: MouseEvent) {
    e.stopPropagation();
    this.isResizing = true;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.startW = this.currentSize.width;
    this.startH = this.currentSize.height;
  }

  private onMouseMove = (e: MouseEvent) => {
    if (this.isResizing) {
      this.currentSize.width = Math.max(50, this.startW + (e.clientX - this.dragStartX));
      this.currentSize.height = Math.max(20, this.startH + (e.clientY - this.dragStartY));
    }
  }

  private onMouseUp = () => {
    this.isResizing = false;
  }

  public close() { this.closed.emit(); }
  public cancel() { this.closed.emit(); }
  public onOverlayClick(e: Event) { this.closed.emit(); }

  public apply() {
    this.applied.emit({
      ...this.config,
      content: { ...this.editableContent },
      styles: {
        ...this.editableStyles,
        width: this.currentSize.width + 'px',
        height: this.currentSize.height + 'px'
      },
      size: { ...this.currentSize }
    });
  }
}
