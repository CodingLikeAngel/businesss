import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UICardComponent } from '@negocio/ui-components';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

@Component({
  selector: 'lib-editor-card-testimonial-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UICardComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">💬 MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">CARD TESTIMONIAL</span>
          </div>
          
          <div class="header-actions">
            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <div class="isolated-mode-body">
          <div class="controls-sidebar">
            <div class="sidebar-scroll-content">
              
              <!-- AUTHOR INFO -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">👤</span>
                  <h4>INFORMACIÓN DEL AUTOR</h4>
                </div>
                
                <div class="control-group">
                  <label>Nombre del Autor</label>
                  <input type="text" [(ngModel)]="editableContent.authorName" class="premium-input">
                </div>

                <div class="control-group">
                  <label>Cargo / Posición</label>
                  <input type="text" [(ngModel)]="editableContent.authorRole" class="premium-input">
                </div>

                <div class="control-group">
                  <label>Empresa / Organización</label>
                  <input type="text" [(ngModel)]="editableContent.company" class="premium-input">
                </div>

                <div class="control-group">
                  <label>URL de Avatar</label>
                  <input type="text" [(ngModel)]="editableContent.avatar" class="premium-input">
                </div>
              </div>

              <!-- TESTIMONIAL CONTENT -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">💬</span>
                  <h4>CONTENIDO DEL TESTIMONIO</h4>
                </div>
                
                <div class="control-group">
                  <label>Testimonio</label>
                  <textarea [(ngModel)]="editableContent.testimonial" class="premium-input h-32" placeholder="Escribe el testimonio aquí..."></textarea>
                </div>

                <div class="control-group">
                  <label>Fecha</label>
                  <input type="text" [(ngModel)]="editableContent.date" class="premium-input" placeholder="Ej: Enero 2026">
                </div>
              </div>

              <!-- RATING -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">⭐</span>
                  <h4>VALORACIÓN</h4>
                </div>
                
                <div class="control-group">
                  <label class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="editableContent.showRating" class="w-4 h-4">
                    <span>Mostrar Rating</span>
                  </label>
                </div>

                <div class="control-group" *ngIf="editableContent.showRating">
                  <label>Rating (0-5)</label>
                  <div class="flex items-center gap-3">
                    <input type="range" min="0" max="5" step="0.5" [(ngModel)]="editableContent.rating" class="flex-1">
                    <span class="text-white font-bold text-sm">{{ editableContent.rating || 0 }}</span>
                  </div>
                </div>
              </div>

              <!-- APPEARANCE -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>APARIENCIA</h4>
                </div>
                
                <div class="control-group">
                  <label>Variante Visual</label>
                  <select [(ngModel)]="editableContent.variant" class="premium-input">
                    <option value="">Heredar Global</option>
                    <option value="default">Estándar</option>
                    <option value="primary">Primario</option>
                    <option value="secondary">Secundario</option>
                    <option value="glass">Vidrio (Glass)</option>
                    <option value="neon">Neón</option>
                    <option value="cyberpunk">Cyberpunk</option>
                  </select>
                  <p class="variant-hint" *ngIf="!editableContent.variant">
                    Heredando: {{ config.content['globalVariant'] || 'glass' }}
                  </p>
                </div>

                <div class="control-group">
                  <label>Estilo de Card</label>
                  <select [(ngModel)]="editableContent.cardStyle" class="premium-input">
                    <option value="minimal">Minimalista</option>
                    <option value="bordered">Con Borde</option>
                    <option value="elevated">Elevado (Shadow)</option>
                    <option value="quote">Estilo Cita</option>
                  </select>
                </div>

                <div class="control-group">
                  <label class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="editableContent.showQuotes" class="w-4 h-4">
                    <span>Mostrar Comillas</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="isolated-canvas">
            <div class="canvas-inner">
              <div class="draggable-wrapper"
                   [style.width.px]="currentSize.width"
                   [style.height.px]="currentSize.height">
                
                
                <lib-ui-components-card
                  [title]="editableContent.authorName || 'Juan Pérez'"
                  [description]="editableContent.testimonial || 'Excelente servicio y atención al cliente. Muy recomendado.'"
                  [variant]="editableContent.variant || config.content['globalVariant'] || 'glass'"
                  [customStyles]="editableStyles">
                  
                  <!-- Author info footer -->
                  <div class="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {{ (editableContent.authorName || 'JP')[0] }}
                    </div>
                    <div class="flex-1">
                      <div class="text-xs font-bold text-white">{{ editableContent.authorRole || 'CEO' }}</div>
                      <div class="text-[10px] text-slate-400">{{ editableContent.company || 'Tech Company' }}</div>
                    </div>
                    <div *ngIf="editableContent.showRating !== false" class="text-yellow-400 text-sm">
                      {{ '⭐'.repeat(Math.floor(editableContent.rating || 5)) }}
                    </div>
                  </div>
                </lib-ui-components-card>

                <div class="resize-handle se" (mousedown)="startResize($event)"></div>
              </div>
            </div>
            
            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">AUTHOR</span><span class="value text-purple-400">{{ editableContent.authorName || 'Juan Pérez' }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">RATING</span><span class="value text-yellow-400">{{ editableContent.showRating !== false ? (editableContent.rating || 5) + '⭐' : 'Hidden' }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">SIZE</span><span class="value">{{ currentSize.width }}x{{ currentSize.height }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Personaliza el testimonio de tus clientes.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
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
      background: rgba(2, 6, 23, 0.98);
      backdrop-filter: blur(15px);
      z-index: 9999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .isolated-mode-container {
      background: #0f172a;
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 32px;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.8);
    }
    .isolated-mode-header {
      height: 72px;
      padding: 0 2rem;
      background: #1e293b;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .mode-badge { font-size: 10px; font-weight: 800; color: #6366f1; background: rgba(99, 102, 241, 0.1); padding: 5px 12px; border-radius: 10px; border: 1px solid rgba(99, 102, 241, 0.2); }
    .component-name { color: white; font-size: 14px; font-weight: 700; margin-left: 10px; letter-spacing: 0.5px; }
    .close-main-btn { background: rgba(239, 68, 68, 0.1); color: #f87171; border: none; width: 36px; height: 36px; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
    .close-main-btn:hover { background: #ef4444; color: white; transform: rotate(90deg); }

    .isolated-mode-body { flex: 1; display: flex; overflow: hidden; }
    .controls-sidebar { width: 340px; background: #020617; border-right: 1px solid rgba(255,255,255,0.05); overflow-y: auto; }
    .sidebar-scroll-content { padding: 2rem; }
    .sidebar-section { margin-bottom: 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 2rem; }
    .sidebar-section.no-border { border-bottom: none; }
    .section-header { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1.5rem; color: #64748b; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; }
    
    .control-group { margin-bottom: 1.5rem; }
    .control-group label { display: block; font-size: 10px; color: #475569; margin-bottom: 0.6rem; text-transform: uppercase; font-weight: 800; }
    
    .premium-input {
      width: 100%;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255,255,255,0.1);
      color: white;
      padding: 0.6rem 0.8rem;
      border-radius: 10px;
      font-size: 12px;
    }

    .variant-hint { font-size: 10px; color: #64748b; margin-top: 0.5rem; font-style: italic; }

    .isolated-canvas { flex: 1; background: #020617; position: relative; overflow: hidden; background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 20px 20px; }
    .canvas-inner { width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center; padding: 50px; }
    
    .draggable-wrapper { position: relative; border: 1px dashed rgba(16, 185, 129, 0.5); padding: 5px; }
    .resize-handle { position: absolute; width: 10px; height: 10px; background: #10b981; border: 1.5px solid white; border-radius: 3px; bottom: -5px; right: -5px; cursor: se-resize; }

    .modern-position-dock { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); padding: 0.6rem 1.2rem; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.08); display: flex; gap: 1.5rem; color: white; font-size: 11px; }
    .dock-divider { width: 1px; background: rgba(255, 255, 255, 0.1); }
    .dock-item { display: flex; align-items: center; gap: 0.5rem; }
    .dock-item .label { color: #64748b; font-weight: 800; }

    .isolated-mode-footer { height: 72px; padding: 0 2rem; background: #1e293b; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.08); }
    .footer-hint { font-size: 12px; color: #94a3b8; font-style: italic; }
    .btn-clean { padding: 0.6rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; font-size: 13px; transition: all 0.2s; }
    .btn-clean.primary { background: #6366f1; color: white; }
    .btn-clean.secondary { background: transparent; color: #94a3b8; }
    .btn-clean:hover { transform: translateY(-1px); opacity: 0.9; }
  `]
})
export class EditorCardTestimonialIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() public config!: IsolatedModeConfig;
  @Output() public closed = new EventEmitter<void>();
  @Output() public applied = new EventEmitter<IsolatedModeConfig>();

  public editableContent: any = {};
  public editableStyles: any = {};
  public currentSize = { width: 0, height: 0 };
  public Math = Math; // Expose Math to template
  
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
      this.currentSize.width = Math.max(300, this.startW + (e.clientX - this.dragStartX));
      this.currentSize.height = Math.max(250, this.startH + (e.clientY - this.dragStartY));
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
