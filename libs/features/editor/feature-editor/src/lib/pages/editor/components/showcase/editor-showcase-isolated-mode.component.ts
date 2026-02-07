import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UIShowcaseAtomComponent, ShowcaseLayout, ShowcaseVariant } from '@negocio/ui-components';
import { AppState } from '../../../../store/state/app.state';
import { selectCurrentPageGlobalStyles } from '../../../../store/selectors/page.selectors';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface IsolatedModeConfig {
  sectionId: string;
  elementId: string;
  type: string;
  content: any;
  styles: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

@Component({
  selector: 'lib-editor-showcase-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UIShowcaseAtomComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🎯 MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">SHOWCASE ATOM - DISEÑO</span>
          </div>
          
          <div class="header-actions">
            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <div class="isolated-mode-body">
          <div class="controls-sidebar">
            <div class="sidebar-scroll-content">
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📝</span>
                  <h4>CONTENIDO</h4>
                </div>
                
                <div class="control-group">
                  <label>Icono (Emoji / SVG Path)</label>
                  <input type="text" [(ngModel)]="editableContent.icon" (ngModelChange)="onContentChange()" class="premium-input" placeholder="✨">
                </div>

                <div class="control-group">
                  <label>Título</label>
                  <input type="text" [(ngModel)]="editableContent.title" (ngModelChange)="onContentChange()" class="premium-input" placeholder="Título...">
                </div>

                <div class="control-group">
                  <label>Texto descriptivo</label>
                  <textarea [(ngModel)]="editableContent.text" (ngModelChange)="onContentChange()" class="premium-input h-20" placeholder="Descripción..."></textarea>
                </div>
              </div>

              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📐</span>
                  <h4>LAYOUT & VARIANTE</h4>
                </div>
                
                <div class="control-group">
                  <label>Disposición (Layout)</label>
                  <select [(ngModel)]="editableContent.layout" (ngModelChange)="onContentChange()" class="premium-input">
                    <option value="vertical">Vertical</option>
                    <option value="horizontal">Horizontal</option>
                    <option value="centered">Centrado</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Variante Visual</label>
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onContentChange()" class="premium-input">
                    <option value="default">Estándar</option>
                    <option value="glass">Glassmorphism</option>
                    <option value="neon">Neon Glow</option>
                    <option value="cyberpunk">Cyberpunk</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>
              </div>

              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>COLORES & ESTILOS</h4>
                </div>
                
                <div class="control-group">
                  <label>Color de Icono</label>
                  <div class="color-control-wrapper">
                    <div class="color-input-wrapper">
                      <div class="color-preview" [style.background-color]="editableStyles.iconColor">
                        <input type="color" [(ngModel)]="editableStyles.iconColor" (ngModelChange)="onStyleChange()">
                      </div>
                      <input type="text" [(ngModel)]="editableStyles.iconColor" (ngModelChange)="onStyleChange()" class="premium-input hex-input">
                    </div>
                    <div class="theme-palette" *ngIf="globalColors$ | async as colors">
                       <div *ngFor="let c of colors" 
                            class="palette-swatch" 
                            [style.background-color]="c"
                            [title]="c"
                            (click)="editableStyles.iconColor = c; onStyleChange()"></div>
                    </div>
                  </div>
                </div>

                <div class="control-group">
                  <label>Fondo de Tarjeta</label>
                  <div class="color-control-wrapper">
                    <div class="color-input-wrapper">
                      <div class="color-preview" [style.background-color]="editableStyles.backgroundColor">
                        <input type="color" [(ngModel)]="editableStyles.backgroundColor" (ngModelChange)="onStyleChange()">
                      </div>
                      <input type="text" [(ngModel)]="editableStyles.backgroundColor" (ngModelChange)="onStyleChange()" class="premium-input hex-input">
                    </div>
                    <div class="theme-palette" *ngIf="globalColors$ | async as colors">
                       <div *ngFor="let c of colors" 
                            class="palette-swatch" 
                            [style.background-color]="c"
                            [title]="c"
                            (click)="editableStyles.backgroundColor = c; onStyleChange()"></div>
                    </div>
                  </div>
                </div>

                <div class="control-group">
                  <label>Radio de Borde (px)</label>
                  <input type="range" min="0" max="40" step="2" [(ngModel)]="borderRadiusValue" (ngModelChange)="onBorderRadiusChange()" class="w-full">
                  <div class="text-right text-[10px] text-white/50">{{ borderRadiusValue }}px</div>
                </div>
              </div>

              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">📏</span>
                  <h4>DIMENSIONES (PX)</h4>
                </div>
                <div class="control-row grid grid-cols-2 gap-2">
                  <div class="control-group">
                    <label>Ancho</label>
                    <input type="number" [(ngModel)]="currentSize.width" (ngModelChange)="onSizeChange()" class="premium-input">
                  </div>
                  <div class="control-group">
                    <label>Alto (Min)</label>
                    <input type="number" [(ngModel)]="currentSize.height" (ngModelChange)="onSizeChange()" class="premium-input">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="isolated-canvas">
            <div class="canvas-inner">
              <div class="draggable-wrapper"
                   [style.left.px]="currentPosition.x"
                   [style.top.px]="currentPosition.y"
                   [style.width.px]="currentSize.width"
                   [style.min-height.px]="currentSize.height"
                   (mousedown)="onMouseDown($event)">
                
                <lib-ui-showcase-atom
                  [icon]="editableContent.icon"
                  [title]="editableContent.title"
                  [text]="editableContent.text"
                  [layout]="editableContent.layout"
                  [variant]="editableContent.variant"
                  [customStyles]="getMergedStyles()"
                  style="display: block;">
                </lib-ui-showcase-atom>

                <div class="resize-handle se" (mousedown)="startResize($event, 'se')"></div>
              </div>
            </div>
            
            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">ATOM</span><span class="value">{{ editableContent.layout }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">W</span><span class="value">{{ currentSize.width }}px</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Controla el impacto visual de cada característica en tu diseño.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Feature</button>
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
      backdrop-filter: blur(12px);
      z-index: 9999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .isolated-mode-container {
      background: #0f172a;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 24px;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .isolated-mode-header {
      height: 64px;
      padding: 0 1.5rem;
      background: #1e293b;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .mode-badge { font-size: 10px; font-weight: 800; color: #fbbf24; background: rgba(251, 191, 36, 0.1); padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(251, 191, 36, 0.2); }
    .component-name { color: white; font-size: 13px; font-weight: 600; margin-left: 8px; font-family: 'Inter', sans-serif; letter-spacing: 0.5px; }
    .close-main-btn { background: rgba(239, 68, 68, 0.1); color: #f87171; border: none; width: 32px; height: 32px; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
    .close-main-btn:hover { background: #ef4444; color: white; transform: rotate(90deg); }

    .isolated-mode-body { flex: 1; display: flex; overflow: hidden; }
    .controls-sidebar { width: 320px; background: #020617; border-right: 1px solid rgba(255,255,255,0.1); overflow-y: auto; }
    .sidebar-scroll-content { padding: 1.5rem; }
    .sidebar-section { margin-bottom: 2rem; }
    .section-header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.2rem; color: #94a3b8; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
    
    .control-group { margin-bottom: 1rem; }
    .control-group label { display: block; font-size: 10px; color: #64748b; margin-bottom: 0.5rem; text-transform: uppercase; font-weight: 700; }
    
    .premium-input {
      width: 100%;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255,255,255,0.1);
      color: white;
      padding: 0.6rem 0.8rem;
      border-radius: 10px;
      font-size: 12px;
    }
    
    .color-control-wrapper { display: flex; flex-direction: column; gap: 0.5rem; }
    .color-input-wrapper { display: flex; gap: 0.8rem; }
    .color-preview { width: 38px; height: 38px; border-radius: 10px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.2); }
    .color-preview input { position: absolute; inset: -5px; width: 150%; height: 150%; cursor: pointer; }

    .theme-palette { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px; }
    .palette-swatch { width: 20px; height: 20px; border-radius: 4px; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); transition: transform 0.2s; }
    .palette-swatch:hover { transform: scale(1.2); z-index: 10; border-color: white; }

    .isolated-canvas { flex: 1; background: #020617; position: relative; overflow: hidden; background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 20px 20px; }
    .canvas-inner { width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center; }
    
    .draggable-wrapper { position: relative; cursor: move; border: 1px dashed rgba(251, 191, 36, 0.5); padding: 5px; }
    .resize-handle { position: absolute; width: 10px; height: 10px; background: #fbbf24; border: 1.5px solid white; border-radius: 3px; bottom: -5px; right: -5px; cursor: se-resize; }

    .modern-position-dock { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); padding: 0.6rem 1.2rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); display: flex; gap: 1.5rem; color: white; font-size: 11px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); }
    .dock-divider { width: 1px; background: rgba(255,255,255,0.1); }
    .dock-item { display: flex; align-items: center; gap: 0.5rem; }
    .dock-item .label { color: #64748b; font-weight: 800; }

    .isolated-mode-footer { height: 72px; padding: 0 2rem; background: #1e293b; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); }
    .footer-hint { font-size: 12px; color: #94a3b8; font-style: italic; }
    .btn-clean { padding: 0.6rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; font-size: 13px; transition: all 0.2s; }
    .btn-clean.primary { background: #fbbf24; color: #000; }
    .btn-clean.secondary { background: transparent; color: #94a3b8; }
    .btn-clean:hover { transform: translateY(-1px); opacity: 0.9; }
  `]
})
export class EditorShowcaseIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() config!: IsolatedModeConfig;
  @Output() closed = new EventEmitter<void>();
  @Output() applied = new EventEmitter<IsolatedModeConfig>();

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

  editableContent: any = {};
  editableStyles: any = {};
  borderRadiusValue = 16;
  currentPosition = { x: 0, y: 0 };
  currentSize = { width: 0, height: 0 };

  isDragging = false;
  isResizing = false;
  dragStartX = 0;
  dragStartY = 0;
  startPosX = 0;
  startPosY = 0;
  startW = 0;
  startH = 0;

  ngOnInit() {
    this.editableContent = {
      icon: this.config.content.icon || '✨',
      title: this.config.content.title || '',
      text: this.config.content.text || '',
      layout: this.config.content.layout || 'vertical',
      variant: this.config.content.variant || 'default'
    };
    this.editableStyles = { ...this.config.styles };
    this.borderRadiusValue = parseInt(this.editableStyles.borderRadius) || 16;
    this.currentPosition = { ...this.config.position };
    this.currentSize = { ...this.config.size };

    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  ngOnDestroy() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseDown(e: MouseEvent) {
    this.isDragging = true;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.startPosX = this.currentPosition.x;
    this.startPosY = this.currentPosition.y;
  }

  startResize(e: MouseEvent, handle: string) {
    e.stopPropagation();
    this.isResizing = true;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.startW = this.currentSize.width;
    this.startH = this.currentSize.height;
  }

  onMouseMove = (e: MouseEvent) => {
    if (this.isDragging) {
      this.currentPosition.x = this.startPosX + (e.clientX - this.dragStartX);
      this.currentPosition.y = this.startPosY + (e.clientY - this.dragStartY);
    } else if (this.isResizing) {
      this.currentSize.width = Math.max(100, this.startW + (e.clientX - this.dragStartX));
      this.currentSize.height = Math.max(50, this.startH + (e.clientY - this.dragStartY));
    }
  }

  onMouseUp = () => {
    this.isDragging = false;
    this.isResizing = false;
  }

  onBorderRadiusChange() {
    this.editableStyles.borderRadius = this.borderRadiusValue + 'px';
  }

  getMergedStyles() {
    return {
      ...this.editableStyles
    };
  }

  onContentChange() {}
  onStyleChange() {}
  onPositionChange() {}
  onSizeChange() {}

  close() { this.closed.emit(); }
  cancel() { this.closed.emit(); }
  onOverlayClick(e: Event) { this.closed.emit(); }

  apply() {
    this.applied.emit({
      ...this.config,
      content: { ...this.editableContent },
      styles: {
        ...this.getMergedStyles(),
        left: this.currentPosition.x + 'px',
        top: this.currentPosition.y + 'px',
        width: this.currentSize.width + 'px',
        minHeight: this.currentSize.height + 'px',
        position: 'absolute'
      },
      position: { ...this.currentPosition },
      size: { ...this.currentSize }
    });
  }
}
