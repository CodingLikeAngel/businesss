import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIShapeComponent } from '@negocio/ui-components';
import { Subject } from 'rxjs';

import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';
export { IsolatedModeConfig };

@Component({
  selector: 'lib-editor-shape-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, UIShapeComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🎯 MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">FORMA ABSTRACTA - ESTILO & POSICIÓN</span>
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
                  <span class="section-icon">🧩</span>
                  <h4>FORMA</h4>
                </div>
                
                <div class="control-group">
                  <label>Tipo de Forma</label>
                  <select [(ngModel)]="editableContent.shapeType" (ngModelChange)="onContentChange()" class="premium-select">
                    <option value="circle">Círculo</option>
                    <option value="square">Cuadrado</option>
                    <option value="triangle">Triángulo</option>
                    <option value="blob">Gota (Blob)</option>
                    <option value="wave">Onda (Wave)</option>
                    <option value="custom">Personalizado (Path)</option>
                  </select>
                </div>

                <div class="control-group" *ngIf="editableContent.shapeType === 'custom'">
                  <label>SVG Path Custom</label>
                  <textarea [(ngModel)]="editableContent.customPath" (ngModelChange)="onContentChange()" class="premium-input h-24" placeholder="M 0 0 ..."></textarea>
                </div>
              </div>

              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>ESTILO</h4>
                </div>
                
                <div class="control-group">
                  <label>Color de Relleno</label>
                  <div class="color-input-wrapper">
                    <div class="color-preview" [style.background-color]="editableStyles.fill">
                      <input type="color" [(ngModel)]="editableStyles.fill" (ngModelChange)="onStyleChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableStyles.fill" (ngModelChange)="onStyleChange()" class="premium-input hex-input">
                  </div>
                </div>

                <div class="control-group">
                  <label>Opacidad</label>
                  <input type="range" min="0" max="1" step="0.1" [(ngModel)]="editableStyles.opacity" (ngModelChange)="onStyleChange()" class="w-full">
                  <div class="text-right text-[10px] text-white/50">{{ editableStyles.opacity }}</div>
                </div>

                <div class="control-group">
                  <label>Rotación (deg)</label>
                  <input type="range" min="0" max="360" [(ngModel)]="editableStyles.rotate" (ngModelChange)="onStyleChange()" class="w-full">
                  <div class="text-right text-[10px] text-white/50">{{ editableStyles.rotate }}°</div>
                </div>
              </div>

              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">📐</span>
                  <h4>DIMENSIONES</h4>
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

          <div class="isolated-canvas" #canvas [class.ambient-dark]="true">
            <div class="canvas-inner">
              <div class="draggable-wrapper"
                   [style.left.px]="currentPosition.x"
                   [style.top.px]="currentPosition.y"
                   [style.width.px]="currentSize.width"
                   [style.height.px]="currentSize.height"
                   (mousedown)="onMouseDown($event)">
                
                <lib-ui-shape
                  [type]="editableContent.shapeType || 'blob'"
                  [customPath]="editableContent.customPath"
                  [customStyles]="getMergedStyles()"
                  style="width: 100%; height: 100%; display: block;">
                </lib-ui-shape>

                <div class="resize-handle se" (mousedown)="startResize($event, 'se')"></div>
              </div>
            </div>
            
            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">POS</span><span class="value">{{ currentPosition.x }}, {{ currentPosition.y }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">SIZE</span><span class="value">{{ currentSize.width }}x{{ currentSize.height }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Arrastra para mover, usa el tirador para redimensionar.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .isolated-mode-overlay {
      position: fixed;
      inset: 0;
      background: rgba(2, 6, 23, 0.9);
      backdrop-filter: blur(12px);
      z-index: 9999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .isolated-mode-container {
      background: #0f172a;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .isolated-mode-header {
      height: 60px;
      padding: 0 1.5rem;
      background: #1e293b;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .mode-badge { font-size: 10px; font-weight: 800; color: #6366f1; background: rgba(99, 102, 241, 0.1); padding: 4px 8px; border-radius: 6px; }
    .component-name { color: white; font-size: 13px; font-weight: 600; margin-left: 8px; }
    .close-main-btn { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: none; width: 30px; height: 30px; border-radius: 8px; cursor: pointer; }

    .isolated-mode-body {
      flex: 1;
      display: flex;
      flex-direction: row; /* Explicit row */
      overflow: hidden;
    }

    .controls-sidebar {
      width: 300px;
      min-width: 300px; /* Safety */
      flex-shrink: 0; /* Prevent shrinking */
      background: #020617;
      border-right: 1px solid rgba(255,255,255,0.1);
      overflow-y: auto;
    }
    .sidebar-scroll-content { padding: 1.5rem; }
    .sidebar-section { margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1rem; }
    .section-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; color: #94a3b8; font-size: 12px; font-weight: 800; }
    
    .control-group { margin-bottom: 0.8rem; }
    .control-group label { display: block; font-size: 10px; color: #64748b; margin-bottom: 0.4rem; text-transform: uppercase; font-weight: 700; }
    
    .premium-input, .premium-select {
      width: 100%;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255,255,255,0.1);
      color: white;
      padding: 0.5rem;
      border-radius: 8px;
      font-size: 12px;
    }
    
    .color-input-wrapper { display: flex; gap: 0.5rem; }
    .color-preview { width: 30px; height: 30px; border-radius: 6px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
    .color-preview input { position: absolute; inset: -5px; width: 150%; height: 150%; cursor: pointer; }

    .isolated-canvas { flex: 1; background: #020617; position: relative; overflow: hidden; }
    .canvas-inner { width: 100%; height: 100%; position: relative; }
    
    .draggable-wrapper { position: absolute; cursor: move; border: 1px dashed rgba(99, 102, 241, 0.5); }
    .resize-handle { position: absolute; width: 12px; height: 12px; background: #6366f1; border: 2px solid white; border-radius: 50%; bottom: -6px; right: -6px; cursor: se-resize; }

    .modern-position-dock { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(4px); padding: 0.4rem 1rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); display: flex; gap: 1rem; color: white; font-size: 10px; }
    .dock-divider { width: 1px; background: rgba(255,255,255,0.1); }

    .isolated-mode-footer { height: 60px; padding: 0 1.5rem; background: #1e293b; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); }
    .footer-hint { font-size: 11px; color: #94a3b8; }
    .btn-clean { padding: 0.5rem 1.2rem; border-radius: 8px; font-weight: 700; cursor: pointer; border: none; font-size: 12px; transition: all 0.2s; }
    .btn-clean.primary { background: #6366f1; color: white; }
    .btn-clean.secondary { background: transparent; color: #94a3b8; }
    .btn-clean:hover { opacity: 0.8; }
  `]
})
export class EditorShapeIsolatedModeComponent implements OnInit, OnDestroy {
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
      shapeType: this.config.content.shapeType || 'blob',
      customPath: this.config.content.customPath || ''
    };
    this.editableStyles = {
      fill: this.config.styles.fill || '#6366f1',
      opacity: this.config.styles.opacity || 1,
      rotate: this.config.styles.rotate || 0
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
      this.currentSize.width = Math.max(20, this.startW + (e.clientX - this.dragStartX));
      this.currentSize.height = Math.max(20, this.startH + (e.clientY - this.dragStartY));
    }
  }

  onMouseUp = () => {
    this.isDragging = false;
    this.isResizing = false;
  }

  getMergedStyles() {
    return {
      ...this.editableStyles,
      transform: `rotate(${this.editableStyles.rotate}deg)`
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
