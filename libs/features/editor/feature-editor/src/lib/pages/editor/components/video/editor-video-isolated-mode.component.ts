import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIVideoComponent } from '@negocio/ui-components';

import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

@Component({
  selector: 'lib-editor-video-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UIVideoComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🎯 MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">VIDEO - CONFIGURACIÓN PRO</span>
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
                  <span class="section-icon">🎬</span>
                  <h4>ORIGEN DEL VIDEO</h4>
                </div>
                
                <div class="control-group">
                  <label>URL del Video</label>
                  <input type="text" [(ngModel)]="editableContent.videoUrl" (ngModelChange)="onContentChange()" class="premium-input" placeholder="https://...">
                  <p class="text-[9px] text-slate-500 mt-1">Soporta MP4 directo o enlaces públicos.</p>
                </div>

                <div class="control-row grid grid-cols-2 gap-2 mt-4">
                  <div class="control-group">
                    <label class="checkbox-label">
                      <input type="checkbox" [(ngModel)]="editableContent.autoplay" (ngModelChange)="onContentChange()"> Autoplay
                    </label>
                  </div>
                  <div class="control-group">
                    <label class="checkbox-label">
                      <input type="checkbox" [(ngModel)]="editableContent.loop" (ngModelChange)="onContentChange()"> Loop
                    </label>
                  </div>
                </div>
              </div>

              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎭</span>
                  <h4>CAPA DE COLOR (OVERLAY)</h4>
                </div>
                
                <div class="control-group">
                  <label>Color de Overlay</label>
                  <div class="color-input-wrapper">
                    <div class="color-preview" [style.background-color]="editableStyles.overlayColor">
                      <input type="color" [(ngModel)]="editableStyles.overlayColor" (ngModelChange)="onStyleChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableStyles.overlayColor" (ngModelChange)="onStyleChange()" class="premium-input hex-input">
                  </div>
                </div>

                <div class="control-group">
                  <label>Opacidad del Video</label>
                  <input type="range" min="0" max="1" step="0.1" [(ngModel)]="editableStyles.opacity" (ngModelChange)="onStyleChange()" class="w-full">
                  <div class="text-right text-[10px] text-white/50">{{ editableStyles.opacity }}</div>
                </div>
              </div>

              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">📐</span>
                  <h4>DIMENSIONES (PX)</h4>
                </div>
                <div class="control-row grid grid-cols-2 gap-2">
                  <div class="control-group">
                    <label>X</label>
                    <input type="number" [(ngModel)]="currentPosition.x" (ngModelChange)="onPositionChange()" class="premium-input">
                  </div>
                  <div class="control-group">
                    <label>Y</label>
                    <input type="number" [(ngModel)]="currentPosition.y" (ngModelChange)="onPositionChange()" class="premium-input">
                  </div>
                </div>
                <div class="control-row grid grid-cols-2 gap-2">
                  <div class="control-group">
                    <label>Ancho</label>
                    <input type="number" [(ngModel)]="currentSize.width" (ngModelChange)="onSizeChange()" class="premium-input">
                  </div>
                  <div class="control-group">
                    <label>Alto</label>
                    <input type="number" [(ngModel)]="currentSize.height" (ngModelChange)="onSizeChange()" class="premium-input">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="isolated-canvas" [class.ambient-dark]="true">
            <div class="canvas-inner">
              <div class="draggable-wrapper"
                   [style.left.px]="currentPosition.x"
                   [style.top.px]="currentPosition.y"
                   [style.width.px]="currentSize.width"
                   [style.height.px]="currentSize.height"
                   (mousedown)="onMouseDown($event)">
                
                <lib-ui-video
                  [src]="editableContent.videoUrl"
                  [autoplay]="editableContent.autoplay"
                  [loop]="editableContent.loop"
                  [muted]="true"
                  [customStyles]="getMergedStyles()"
                  style="width: 100%; height: 100%; display: block;">
                </lib-ui-video>

                <div class="resize-handle se" (mousedown)="startResize($event, 'se')"></div>
              </div>
            </div>
            
            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">VID</span><span class="value">{{ currentSize.width }}x{{ currentSize.height }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">POS</span><span class="value">{{ currentPosition.x }}, {{ currentPosition.y }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Control de reproducción y efectos de capa para el video.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Configuración</button>
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
    .mode-badge { font-size: 10px; font-weight: 800; color: #818cf8; background: rgba(129, 140, 248, 0.1); padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(129, 140, 248, 0.2); }
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
      width: 320px;
      min-width: 320px; /* Safety */
      flex-shrink: 0; /* Prevent shrinking */
      background: #020617;
      border-right: 1px solid rgba(255,255,255,0.1);
      overflow-y: auto;
    }
    .sidebar-scroll-content { padding: 1.5rem; }
    .sidebar-section { margin-bottom: 2rem; }
    .section-header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.2rem; color: #94a3b8; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
    
    .control-group { margin-bottom: 1rem; }
    .control-group label { display: block; font-size: 10px; color: #64748b; margin-bottom: 0.5rem; text-transform: uppercase; font-weight: 700; }
    .checkbox-label { display: flex !important; align-items: center; gap: 0.5rem; cursor: pointer; color: #cbd5e1 !important; text-transform: none !important; font-size: 12px !important; }
    
    .premium-input {
      width: 100%;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255,255,255,0.1);
      color: white;
      padding: 0.6rem 0.8rem;
      border-radius: 10px;
      font-size: 12px;
      transition: all 0.2s;
    }
    .premium-input:focus { outline: none; border-color: #6366f1; background: rgba(15, 23, 42, 0.9); }
    
    .color-input-wrapper { display: flex; gap: 0.8rem; }
    .color-preview { width: 38px; height: 38px; border-radius: 10px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.2); }
    .color-preview input { position: absolute; inset: -5px; width: 150%; height: 150%; cursor: pointer; }

    .isolated-canvas { flex: 1; background: #020617; position: relative; overflow: hidden; background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 20px 20px; }
    .canvas-inner { width: 100%; height: 100%; position: relative; }
    
    .draggable-wrapper { position: absolute; cursor: move; border: 1.5px dashed #6366f1; box-shadow: 0 0 20px rgba(99, 102, 241, 0.2); }
    .resize-handle { position: absolute; width: 14px; height: 14px; background: #6366f1; border: 2px solid white; border-radius: 4px; bottom: -7px; right: -7px; cursor: se-resize; }

    .modern-position-dock { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); padding: 0.6rem 1.2rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); display: flex; gap: 1.5rem; color: white; font-size: 11px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); }
    .dock-divider { width: 1px; background: rgba(255,255,255,0.1); }
    .dock-item { display: flex; align-items: center; gap: 0.5rem; }
    .dock-item .label { color: #64748b; font-weight: 800; }

    .isolated-mode-footer { height: 72px; padding: 0 2rem; background: #1e293b; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); }
    .footer-hint { font-size: 12px; color: #94a3b8; font-style: italic; }
    .btn-clean { padding: 0.6rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; font-size: 13px; transition: all 0.2s; }
    .btn-clean.primary { background: #6366f1; color: white; box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.4); }
    .btn-clean.secondary { background: transparent; color: #94a3b8; }
    .btn-clean:hover { transform: translateY(-1px); opacity: 0.9; }
  `]
})
export class EditorVideoIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() config!: IsolatedModeConfig;
  @Output() closed = new EventEmitter<void>();
  @Output() applied = new EventEmitter<IsolatedModeConfig>();

  editableContent: any = {};
  editableStyles: any = {};
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
      videoUrl: this.config.content.videoUrl || '',
      autoplay: this.config.content.autoplay !== false,
      loop: this.config.content.loop !== false
    };
    this.editableStyles = {
      overlayColor: this.config.styles.overlayColor || 'rgba(0,0,0,0.3)',
      opacity: this.config.styles.opacity || 1
    };
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
      this.currentSize.height = Math.max(60, this.startH + (e.clientY - this.dragStartY));
    }
  }

  onMouseUp = () => {
    this.isDragging = false;
    this.isResizing = false;
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
        height: this.currentSize.height + 'px',
        position: 'absolute'
      },
      position: { ...this.currentPosition },
      size: { ...this.currentSize }
    });
  }
}
