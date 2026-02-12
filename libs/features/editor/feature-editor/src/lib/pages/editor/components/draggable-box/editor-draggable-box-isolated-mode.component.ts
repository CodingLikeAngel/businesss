import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIDraggableBox1Component, UIDraggableBox2Component, UIDraggableBox3Component, variants } from '@negocio/ui-components';
import { SimpleVisualEditorService } from '@negocio/shared-components';
import { Subject } from 'rxjs';

import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

export interface UndoRedoState {
  position: { x: number; y: number };
  size: { width: number; height: number };
  styles: any;
  content: any;
}

@Component({
  selector: 'lib-editor-draggable-box-isolated-mode',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    UIDraggableBox1Component,
    UIDraggableBox2Component,
    UIDraggableBox3Component
  ],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🎯 MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">DISEÑO & POSICIÓN</span>
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
              <button class="icon-btn" (click)="toggleGrid()" 
                      [class.active]="showGrid" 
                      title="Cuadrícula (G)">
                <span class="icon">#</span>
              </button>
              <button class="icon-btn" (click)="toggleSnap()" 
                      [class.active]="snapToGrid" 
                      title="Snap (S)">
                <span class="icon">⊞</span>
              </button>
              <button class="icon-btn" (click)="resetPosition()" title="Reset (R)">
                <span class="icon">↺</span>
              </button>
            </div>

            <div class="divider"></div>

            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">
              ✕
            </button>
          </div>
        </div>

        <div class="isolated-mode-body">
          <!-- Sidebar Controls -->
          <div class="controls-sidebar">
            <div class="sidebar-scroll-content">
              <!-- SECCIÓN: ESTILO -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">✨</span>
                  <h4>APARIENCIA</h4>
                </div>
                
                <div class="control-group">
                  <label>Tipo de Componente</label>
                  <div class="select-wrapper">
                    <select [(ngModel)]="editableContent.boxVariant" (ngModelChange)="onContentChange()" class="premium-select">
                      <option value="draggable-box-1">Caja Estándar (Card)</option>
                      <option value="draggable-box-2">Caja Widget (Icon & Info)</option>
                      <option value="draggable-box-3">Caja Glass (Elegant)</option>
                    </select>
                  </div>
                </div>

                <div class="control-group">
                  <label>Esquinas Redondeadas</label>
                  <div class="select-wrapper">
                    <select [(ngModel)]="editableContent.rounded" (ngModelChange)="onContentChange()" class="premium-select">
                      <option value="none">Recto (Ninguno)</option>
                      <option value="md">Suave (Manual/Default)</option>
                      <option value="full">Total (Píldora)</option>
                    </select>
                  </div>
                </div>

                <div class="control-group">
                  <label>Tamaño Base</label>
                  <div class="select-wrapper">
                    <select [(ngModel)]="editableContent.size" (ngModelChange)="onContentChange()" class="premium-select">
                      <option value="sm">Pequeño</option>
                      <option value="md">Normal</option>
                      <option value="lg">Grande</option>
                    </select>
                  </div>
                </div>

                <div class="control-group">
                  <label>Modo de Iluminación Ambient</label>
                  <div class="toggle-wrapper" (click)="toggleDarkMode()" [class.active]="editableContent.dark">
                    <div class="toggle-track">
                      <div class="toggle-thumb"></div>
                    </div>
                    <span>{{ editableContent.dark ? 'OSCURO' : 'CLARO' }}</span>
                  </div>
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <div class="select-wrapper">
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onVariantChange()" class="premium-select">
                    <option value="">Página (Heredar)</option>
                    <option value="default">Caja Estándar (Blanca)</option>
                    <option value="primary">Primaria (Color Accent)</option>
                    <option value="secondary">Secundaria (Verde)</option>
                    <option value="glass">Cristal (Glass)</option>
                    <option value="neon">Neón (Glow)</option>
                    <option value="cyberpunk">Cyberpunk</option>
                    <option value="gradient">Gradiente</option>
                    
                    <!-- All other variants -->
                    <ng-container *ngFor="let v of availableVariants">
                      <option *ngIf="!['default', 'primary', 'secondary', 'glass', 'neon', 'cyberpunk', 'gradient'].includes(v)" [value]="v">
                        {{ formatVariantName(v) }}
                      </option>
                    </ng-container>
                  </select>
                  </div>
                  <p class="variant-hint" *ngIf="!editableContent.variant">
                    Heredando: {{ config.content['globalVariant'] || 'glass' }}
                  </p>
                </div></div> <!-- Close control-group and sidebar-section -->

                <div class="sidebar-section no-border">
                  <div class="section-header">
                    <span class="section-icon">📏</span>
                    <h4>DIMENSIONES</h4>
                  </div>
                  <div class="control-row grid grid-cols-2 gap-2">
                    <div class="control-group">
                      <label>Posición X</label>
                      <input type="number" [(ngModel)]="currentPosition.x" (ngModelChange)="onPositionChange()" class="premium-input text-center">
                    </div>
                    <div class="control-group">
                      <label>Posición Y</label>
                      <input type="number" [(ngModel)]="currentPosition.y" (ngModelChange)="onPositionChange()" class="premium-input text-center">
                    </div>
                  </div>
                  <div class="control-row grid grid-cols-2 gap-2">
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

            </div> <!-- Close scroll content -->
          </div> <!-- Close sidebar -->

          <!-- Canvas Area -->
          <div class="isolated-canvas" 
               #canvas
               (mousedown)="onCanvasMouseDown($event)">
            
            <div class="canvas-viewport"
                 [style.width.px]="(config.canvasSize?.width || 1200) * viewportScale"
                 [style.height.px]="(config.canvasSize?.height || 800) * viewportScale">
              
              <div class="canvas-inner" #canvasInner
                   [style.width.px]="config.canvasSize?.width || 1200"
                   [style.height.px]="config.canvasSize?.height || 800"
                   [style.transform]="'scale(' + viewportScale + ')'"
                   [class.ambient-dark]="true"
                   [class.show-grid]="showGrid"
                   [class.grid-snapping]="snapToGrid">
                
                <!-- Slot Boundary Guide (Flexible Layouts) -->
                <div class="slot-guide" *ngIf="config.content['slotBounds']"
                     [style.left.px]="config.content['slotBounds'].x"
                     [style.top.px]="config.content['slotBounds'].y"
                     [style.width.px]="config.content['slotBounds'].width"
                     [style.height.px]="config.content['slotBounds'].height">
                  <span class="slot-label">ÁREA DEL SLOT</span>
                </div>
                
                <div class="draggable-wrapper"
                     #draggableWrapper
                     [style.left.px]="currentPosition.x"
                     [style.top.px]="currentPosition.y"
                     [style.width.px]="currentSize.width"
                     [style.height.px]="currentSize.height"
                     [class.is-dragging]="isDragging"
                     [class.is-resizing]="isResizing"
                     (mousedown)="onMouseDown($event)">
                  
                  <lib-ui-components-draggable-box-1
                    *ngIf="editableContent.boxVariant === 'draggable-box-1' || !editableContent.boxVariant"
                    [variant]="editableContent.variant || config.content['globalVariant'] || 'secondary'"
                    [rounded]="editableContent.rounded || 'md'"
                    [size]="editableContent.size || 'md'"
                    [dark]="editableContent.dark || false"
                    [content]="editableContent.content || editableContent.title || editableContent.text || 'Drag me'"
                    [customStyles]="getCustomStyles()"
                    style="width: 100%; height: 100%; display: block;">
                  </lib-ui-components-draggable-box-1>

                  <lib-ui-components-draggable-box-2
                    *ngIf="editableContent.boxVariant === 'draggable-box-2'"
                    [variant]="editableContent.variant || config.content['globalVariant'] || 'secondary'"
                    [rounded]="editableContent.rounded || 'md'"
                    [size]="editableContent.size || 'md'"
                    [dark]="editableContent.dark || false"
                    [content]="editableContent.content || editableContent.title || editableContent.text || 'Drag me'"
                    [customStyles]="getCustomStyles()"
                    style="width: 100%; height: 100%; display: block;">
                  </lib-ui-components-draggable-box-2>

                  <lib-ui-components-draggable-box-3
                    *ngIf="editableContent.boxVariant === 'draggable-box-3'"
                    [variant]="editableContent.variant || config.content['globalVariant'] || 'secondary'"
                    [rounded]="editableContent.rounded || 'md'"
                    [size]="editableContent.size || 'md'"
                    [dark]="editableContent.dark || false"
                    [content]="editableContent.content || editableContent.title || editableContent.text || 'Drag me'"
                    [customStyles]="getCustomStyles()"
                    style="width: 100%; height: 100%; display: block;">
                  </lib-ui-components-draggable-box-3>

                  <!-- Resize Handles -->
                  <div class="resize-handle nw" [class.active]="resizeHandle === 'nw'" (mousedown)="startResize($event, 'nw')"></div>
                  <div class="resize-handle n" [class.active]="resizeHandle === 'n'" (mousedown)="startResize($event, 'n')"></div>
                  <div class="resize-handle ne" [class.active]="resizeHandle === 'ne'" (mousedown)="startResize($event, 'ne')"></div>
                  <div class="resize-handle e" [class.active]="resizeHandle === 'e'" (mousedown)="startResize($event, 'e')"></div>
                  <div class="resize-handle se" [class.active]="resizeHandle === 'se'" (mousedown)="startResize($event, 'se')"></div>
                  <div class="resize-handle s" [class.active]="resizeHandle === 's'" (mousedown)="startResize($event, 's')"></div>
                  <div class="resize-handle sw" [class.active]="resizeHandle === 'sw'" (mousedown)="startResize($event, 'sw')"></div>
                  <div class="resize-handle w" [class.active]="resizeHandle === 'w'" (mousedown)="startResize($event, 'w')"></div>
                </div>
              </div>
            </div>

            <!-- Enhanced Position Info -->

            <!-- Enhanced Position Info -->
            <div class="modern-position-dock">
              <div class="dock-item">
                <span class="label">X</span>
                <span class="value">{{ currentPosition.x }}px</span>
              </div>
              <div class="dock-item">
                <span class="label">Y</span>
                <span class="value">{{ currentPosition.y }}px</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">WIDTH</span>
                <span class="value">{{ currentSize.width }}px</span>
              </div>
              <div class="dock-item">
                <span class="label">HEIGHT</span>
                <span class="value">{{ currentSize.height }}px</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">
             Usar <b>G</b> (rejilla), <b>S</b> (snap), <b>R</b> (reset) o flechas para ajuste fino.
          </div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary-accent: #6366f1;
      --primary-accent-glow: rgba(99, 102, 241, 0.4);
      --bg-darker: #020617;
      --bg-surface: #0f172a;
      --bg-header: #1e293b;
      --border-color: rgba(255, 255, 255, 0.08);
      --text-dim: #94a3b8;
      --sidebar-width: 320px;
    }

    .isolated-mode-overlay {
      position: fixed;
      inset: 0 !important;
      background: rgba(2, 6, 23, 0.95);
      backdrop-filter: blur(16px) saturate(180%);
      z-index: 10000005 !important; /* Extremely high to beat any sidebar */
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5vh 1.5vw;
      pointer-events: all;
    }

    .isolated-mode-container {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 24px;
      box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05);
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: container-entry 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes container-entry {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    
    .ghost-wrapper {
      position: absolute;
      border: 2px dashed rgba(99, 102, 241, 0.3);
      background: rgba(99, 102, 241, 0.05);
      border-radius: 12px;
      pointer-events: none;
      z-index: 5;
    }

    /* HEADER */
    .isolated-mode-header {
      height: 70px;
      padding: 0 1.5rem;
      background: var(--bg-header);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }

    .header-breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .mode-badge {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: var(--primary-accent);
      background: rgba(99, 102, 241, 0.15);
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid rgba(99, 102, 241, 0.3);
    }

    .separator { color: var(--text-dim); font-size: 12px; }
    .component-name { color: #f8fafc; font-size: 14px; font-weight: 700; }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .action-group {
      display: flex;
      gap: 0.5rem;
    }

    .divider {
      width: 1px;
      height: 24px;
      background: var(--border-color);
    }

    .icon-btn {
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      color: var(--text-dim);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .icon-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
      border-color: var(--primary-accent);
    }

    .icon-btn.active {
      background: var(--primary-accent);
      color: white;
      box-shadow: 0 0 15px var(--primary-accent-glow);
      border-color: var(--primary-accent);
    }

    .close-main-btn {
      width: 38px;
      height: 38px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #ef4444;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 800;
    }

    .close-main-btn:hover {
      background: #ef4444;
      color: white;
      transform: rotate(90deg);
    }

    /* BODY */
    .isolated-mode-body {
      flex: 1;
      display: flex;
      flex-direction: row; /* Explicit row */
      overflow: hidden;
    }

    /* SIDEBAR */
    .controls-sidebar {
      width: var(--sidebar-width);
      min-width: var(--sidebar-width); /* Safety */
      flex-shrink: 0; /* Prevent shrinking */
      background: #020617;
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
    }

    .sidebar-scroll-content {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .sidebar-section {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .sidebar-section.no-border { border-bottom: none; }

    .section-header {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 1.25rem;
    }

    .section-icon { font-size: 16px; }

    .section-header h4 {
      margin: 0;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: var(--text-dim);
    }

    .control-group { margin-bottom: 1.25rem; }
    .control-group label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: var(--text-dim);
      margin-bottom: 0.6rem;
      text-transform: uppercase;
    }

    .control-row {
      display: flex;
      gap: 1rem;
    }
    .control-group.half { flex: 1; }

    /* INPUTS & SELECTS */
    .premium-input, .premium-select, .premium-textarea {
      width: 100%;
      min-height: 40px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      color: #f8fafc;
      padding: 0.6rem 1rem;
      border-radius: 12px;
      font-size: 13px;
      transition: all 0.2s;
    }

    .premium-input:focus, .premium-select:focus, .premium-textarea:focus {
      outline: none;
      background: rgba(99, 102, 241, 0.05);
      border-color: var(--primary-accent);
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    }

    /* Fix dropdown visibility */
    .premium-select option {
      background: #1e293b;
      color: white;
      padding: 10px;
    }

    .select-wrapper { position: relative; }
    .select-wrapper::after {
      content: '▼';
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 8px;
      color: var(--text-dim);
      pointer-events: none;
    }

    .premium-select {
      appearance: none;
      padding-right: 2rem;
    }

    /* TOGGLE SWITCH */
     .toggle-wrapper {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      padding: 0.6rem 1rem;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      user-select: none;
    }

    .toggle-wrapper span {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: var(--text-dim);
    }

    .toggle-track {
      width: 36px;
      height: 20px;
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      position: relative;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .toggle-thumb {
      position: absolute;
      left: 2px;
      top: 2px;
      width: 14px;
      height: 14px;
      background: #94a3b8;
      border-radius: 50%;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .toggle-wrapper.active {
      border-color: var(--primary-accent);
      background: rgba(99, 102, 241, 0.1);
    }

    .toggle-wrapper.active .toggle-track {
      background: var(--primary-accent);
      border-color: var(--primary-accent);
    }

    .toggle-wrapper.active .toggle-thumb {
      left: calc(100% - 17px);
      background: white;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }

    .toggle-wrapper.active span { color: white; }

    /* SNAPPING INDICATOR */
    .draggable-wrapper.snapping {
      box-shadow: 0 0 0 2px var(--primary-accent), 0 0 20px var(--primary-accent-glow) !important;
    }

    /* PIERCE ENCAPSULATION */
    ::ng-deep {
      .draggable-wrapper {
        lib-ui-components-draggable-box-1,
        lib-ui-components-draggable-box-2,
        lib-ui-components-draggable-box-3 {
          display: block !important;
          width: 100% !important;
          height: 100% !important;
          position: relative !important;
        }
        
        .draggable-box-1,
        .draggable-box-2,
        .draggable-box-3 {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          visibility: visible !important;
          opacity: 1 !important;
        }

        .draggable-box-1-content,
        .draggable-box-2-content,
        .draggable-box-3-content {
           display: block !important;
           color: inherit !important;
        }
      }
    }

    .draggable-wrapper.snapping {
      box-shadow: 0 0 0 2px var(--primary-accent), 0 0 20px var(--primary-accent-glow) !important;
    }

    .toggle-wrapper span {
      font-size: 11px;
      font-weight: 700;
      color: #f8fafc;
    }

    .color-input-wrapper {
      display: flex;
      gap: 0.75rem;
    }

    .color-preview {
      width: 42px;
      height: 38px;
      border-radius: 10px;
      position: relative;
      overflow: hidden;
      border: 1px solid var(--border-color);
    }

    .color-preview input[type="color"] {
      position: absolute;
      inset: -5px;
      width: 200%;
      height: 200%;
      cursor: pointer;
      opacity: 0;
    }

    .hex-input { font-family: 'Courier New', monospace; flex: 1; }

    .input-with-icon {
      position: relative;
    }

    .input-with-icon .axis {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-weight: 800;
      color: var(--primary-accent);
      font-size: 10px;
    }

    .input-with-icon input { padding-left: 28px; }

    .isolated-canvas {
      flex: 1;
      background-color: #020617;
      position: relative;
      overflow: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      transition: background-color 0.4s ease;
      z-index: 1;
    }

    .canvas-viewport {
      position: relative;
      box-shadow: 0 50px 100px rgba(0,0,0,0.5);
      border-radius: 8px;
      background: #000;
      flex-shrink: 0;
    }

    .canvas-inner {
      position: absolute;
      top: 0;
      left: 0;
      transform-origin: top left;
      background-color: #020617;
      background-size: 40px 40px;
      border-radius: 4px;
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
    }

    .canvas-inner.show-grid {
      background-image: 
        radial-gradient(rgba(255, 255, 255, 0.1) 1.5px, transparent 1.5px);
    }

    .canvas-inner.grid-snapping {
      background-image: 
        radial-gradient(rgba(99, 102, 241, 0.2) 1.5px, transparent 1.5px);
      box-shadow: inset 0 0 100px rgba(99, 102, 241, 0.05);
    }

    .slot-guide {
      position: absolute;
      border: 2px dashed rgba(99, 102, 241, 0.3);
      pointer-events: none;
      z-index: 10;
      background: rgba(99, 102, 241, 0.02);
      border-radius: 4px;
    }

    .slot-label {
      position: absolute;
      top: -22px;
      left: 0;
      font-size: 10px;
      font-weight: 800;
      color: var(--primary-accent);
      padding: 2px 0;
      letter-spacing: 0.12em;
      opacity: 0.8;
      text-shadow: 0 1px 4px rgba(0,0,0,0.5);
    }
    
    .canvas-inner.ambient-dark {
       background-color: #020617;
    }

    .draggable-wrapper {
      position: absolute !important;
      cursor: move;
      z-index: 1000 !important;
      /* ROBUSTNESS: Ensure visibility even if component fails */
      outline: 2px solid rgba(99, 102, 241, 0.5) !important;
      outline-offset: 1px;
      transition: all 0.2s ease;
      background: rgba(255, 255, 255, 0.02);
      min-width: 40px;
      min-height: 40px;
    }

    .draggable-wrapper:hover {
      outline-color: var(--primary-accent) !important;
      outline-width: 3px !important;
    }

    /* Draggable Wrapper */
    .draggable-wrapper {
      position: absolute !important;
      cursor: move;
      z-index: 1000 !important;
      outline: 2px solid rgba(99, 102, 241, 0.5) !important;
      outline-offset: 1px;
      transition: all 0.2s ease;
      background: rgba(255, 255, 255, 0.02);
      min-width: 40px;
      min-height: 40px;
    }

    /* RESIZE HANDLES - EXTREMELY VISIBLE */
    .resize-handle {
      position: absolute;
      width: 14px;
      height: 14px;
      background: #ffffff !important;
      border: 2px solid var(--primary-accent) !important;
      border-radius: 4px;
      z-index: 3000 !important;
      box-shadow: 0 2px 5px rgba(0,0,0,0.5);
      pointer-events: all;
    }

    .resize-handle:hover {
      background: var(--primary-accent);
      transform: scale(1.3);
      box-shadow: 0 0 10px var(--primary-accent-glow);
    }
    
    .resize-handle.active {
      background: var(--primary-accent);
      border-color: #fff;
      transform: scale(1.5);
    }

    .resize-handle.nw { top: -6px; left: -6px; cursor: nw-resize; }
    .resize-handle.n { top: -6px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
    .resize-handle.ne { top: -6px; right: -6px; cursor: ne-resize; }
    .resize-handle.e { top: 50%; right: -6px; transform: translateY(-50%); cursor: e-resize; }
    .resize-handle.se { bottom: -6px; right: -6px; cursor: se-resize; }
    .resize-handle.s { bottom: -6px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
    .resize-handle.sw { bottom: -6px; left: -6px; cursor: sw-resize; }
    .resize-handle.w { top: 50%; left: -6px; transform: translateY(-50%); cursor: w-resize; }

    /* POSITION DOCK */
    .modern-position-dock {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border-color);
      border-radius: 50px;
      padding: 8px 20px;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      z-index: 1000;
      pointer-events: none;
    }

    .dock-item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .dock-item .label {
      font-size: 9px;
      font-weight: 900;
      color: var(--primary-accent);
      background: rgba(99, 102, 241, 0.15);
      padding: 2px 8px;
      border-radius: 6px;
      letter-spacing: 0.05em;
    }

    .dock-item .value { color: #fff; font-size: 12px; font-weight: 700; font-family: 'JetBrains Mono', 'Courier New', monospace; }
    .dock-divider { width: 1px; height: 16px; background: rgba(255, 255, 255, 0.1); }

    /* FOOTER */
    .isolated-mode-footer {
      height: 70px;
      background: var(--bg-header);
      border-top: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      flex-shrink: 0;
    }

    .footer-hint { font-size: 11px; color: var(--text-dim); }
    .footer-hint b { color: var(--primary-accent); }

    .btn-clean {
      padding: 0.8rem 2rem;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .btn-clean.secondary {
      background: transparent;
      color: var(--text-dim);
    }
    .btn-clean.secondary:hover { color: #fff; background: rgba(255, 255, 255, 0.05); }

    .btn-clean.primary {
      background: var(--primary-accent);
      color: white;
      box-shadow: 0 8px 20px -5px var(--primary-accent-glow);
    }
    .btn-clean.primary:hover { transform: translateY(-2px); box-shadow: 0 12px 25px -5px var(--primary-accent-glow); }
  `]
})
export class EditorDraggableBoxIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() config!: IsolatedModeConfig;
  @Output() closed = new EventEmitter<void>();
  @Output() applied = new EventEmitter<IsolatedModeConfig>();
  @ViewChild('canvas') canvasRef!: ElementRef;
  @ViewChild('draggableWrapper') draggableWrapperRef!: ElementRef;
  @ViewChild('canvasInner') canvasInnerRef!: ElementRef;

  availableVariants = variants;

  private visualEditor = inject(SimpleVisualEditorService);
  private destroy$ = new Subject<void>();

  // Public state for template access
  public isDragging = false;
  public isResizing = false;
  public resizeHandle = '';

  // Position and size state
  currentPosition: { x: number; y: number } = { x: 100, y: 100 };
  currentSize: { width: number; height: number } = { width: 300, height: 200 };
  initialPosition: { x: number; y: number } = { x: 100, y: 100 };
  initialSize: { width: number; height: number } = { width: 300, height: 200 };

  // Editable content and styles
  editableContent: any = {};
  editableStyles: any = {};
  borderRadiusUnit = 'px';
  paddingUnit = 'px';

  // Grid settings
  showGrid = true;
  snapToGrid = false;
  gridSize = 40;

  // Drag/Resize state
  private dragStartX = 0;
  private dragStartY = 0;
  private startPositionX = 0;
  private startPositionY = 0;
  private startSizeWidth = 0;
  private startSizeHeight = 0;

  // Scaling System
  public viewportScale: number = 0.5;

  // Undo/Redo
  private undoStack: UndoRedoState[] = [];
  private redoStack: UndoRedoState[] = [];
  private saveTimeout: any;

  // Getters for template access
  get canUndo(): boolean { return this.undoStack.length > 1; }
  get canRedo(): boolean { return this.redoStack.length > 0; }

  ngOnInit() {
    // Define sensible default sizes per component type - these match the actual visual design
    const defaultSizes: Record<string, { width: number; height: number }> = {
      'draggable-box-1': { width: 300, height: 120 },
      'draggable-box-2': { width: 350, height: 140 },
      'draggable-box-3': { width: 320, height: 160 }
    };

    const v = this.config.content['boxVariant'] || this.config.content['componentVariant'];
    // Ensure it's a valid variant, otherwise default to 1
    const validVariants = ['draggable-box-1', 'draggable-box-2', 'draggable-box-3'];
    const variant = validVariants.includes(v as string) ? (v as string) : 'draggable-box-1';
    
    const defSize = defaultSizes[variant] || { width: 300, height: 150 };

    // Use exact position from config (now normalized to section)
    this.currentPosition = { 
      x: this.config.position?.x ?? 100, 
      y: this.config.position?.y ?? 100 
    };
    
    // Robust size initialization
    const incomingWidth = this.config.size?.width || defSize.width;
    const incomingHeight = this.config.size?.height || defSize.height;
    
    // Safety check: if width/height are 0 or negative, use default
    this.currentSize = { 
        width: (incomingWidth > 20) ? incomingWidth : defSize.width, 
        height: (incomingHeight > 10) ? incomingHeight : defSize.height 
    };

    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };

    // Auto-scale viewport based on section size
    const canvasW = this.config.canvasSize?.width || 1200;
    if (canvasW > 1400) this.viewportScale = 0.4;
    else if (canvasW > 1000) this.viewportScale = 0.55;
    else this.viewportScale = 0.7;
    
    // Ensure we scroll to the component after view init
    setTimeout(() => this.scrollToComponent(), 100);

    // Load editable content
    this.editableContent = {
      ...this.config.content,
      title: this.config.content['title'] || this.config.content['text'] || 'Draggable Box',
      description: this.config.content['description'] || 'Arrastra y redimensiona este elemento',
      variant: this.config.content['variant'] || '',
      boxVariant: variant,
      rounded: this.config.content['rounded'] || 'md',
      size: this.config.content['size'] || 'md',
      dark: this.config.content['dark'] || false
    };

    // Load editable styles
    // ROBUSTNESS: We want to use inheritance (empty string) if a variant is present
    const hasVariant = !!this.editableContent.variant && this.editableContent.variant !== 'default';
    
    this.editableStyles = {
      backgroundColor: this.config.styles['backgroundColor'] !== undefined ? this.config.styles['backgroundColor'] : (hasVariant ? '' : '#10b981'),
      borderColor: this.config.styles['borderColor'] !== undefined ? this.config.styles['borderColor'] : (hasVariant ? '' : '#059669'),
      borderWidth: parseInt(this.config.styles['borderWidth'] as string) || this.extractBorderWidth(this.config.styles['border']),
      borderRadius: parseInt(this.config.styles['borderRadius'] as string) || 12,
      boxShadow: this.config.styles['boxShadow'] || '0 10px 30px rgba(0,0,0,0.3)',
      padding: parseInt(this.config.styles['padding'] as string) || 20
    };

    // Detect units
    if (this.config.styles['borderRadius']?.toString().includes('%')) this.borderRadiusUnit = '%';
    if (this.config.styles['padding']?.toString().includes('%')) this.paddingUnit = '%';

    // Save initial state for undo
    this.saveState();

    // Setup global mouse listeners
    setTimeout(() => this.setupMouseListeners(), 100);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.removeMouseListeners();
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
  }

  private extractBorderColor(border: string): string {
    if (!border) return '#059669';
    const match = border.match(/solid\s+(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\))/);
    return match ? match[1] : '#059669';
  }

  private extractBorderWidth(border: string): number {
    if (!border) return 2;
    const match = border.match(/(\d+)px/);
    return match ? parseInt(match[1]) : 2;
  }

  private setupMouseListeners() {
    if (typeof document !== 'undefined') {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    }
  }

  private removeMouseListeners() {
    if (typeof document !== 'undefined') {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // Close on Escape
    if (event.key === 'Escape') {
      event.preventDefault();
      this.cancel();
      return;
    }

    // Undo: Ctrl+Z or Cmd+Z
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      this.undo();
      return;
    }

    // Redo: Ctrl+Y or Cmd+Y or Ctrl+Shift+Z
    if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
      event.preventDefault();
      this.redo();
      return;
    }

    // Toggle grid
    if (event.key === 'g' || event.key === 'G') {
      this.toggleGrid();
      return;
    }

    // Toggle snap
    if (event.key === 's' || event.key === 'S') {
      this.toggleSnap();
      return;
    }

    // Reset position
    if (event.key === 'r' || event.key === 'R') {
      this.resetToCenter();
      return;
    }

    // Arrow keys for fine positioning
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      const delta = event.shiftKey ? 10 : 1;
      this.handleArrowKey(event.key, delta);
      return;
    }
  }

  private handleArrowKey(key: string, delta: number) {
    switch (key) {
      case 'ArrowUp':
        this.currentPosition.y -= delta;
        break;
      case 'ArrowDown':
        this.currentPosition.y += delta;
        break;
      case 'ArrowLeft':
        this.currentPosition.x -= delta;
        break;
      case 'ArrowRight':
        this.currentPosition.x += delta;
        break;
    }
    
    if (this.snapToGrid) {
      this.currentPosition.x = Math.round(this.currentPosition.x / this.gridSize) * this.gridSize;
      this.currentPosition.y = Math.round(this.currentPosition.y / this.gridSize) * this.gridSize;
    }
    
    this.onPositionChange();
  }

  resetToCenter() {
    this.currentPosition = {
      x: 2000 - (this.currentSize.width / 2),
      y: 2000 - (this.currentSize.height / 2)
    };
    this.onPositionChange();
    this.scrollToComponent();
  }

  scrollToComponent() {
    if (this.canvasRef && this.canvasRef.nativeElement) {
      const canvas = this.canvasRef.nativeElement;
      // Scroll to center the component in the view
      // Component Center X = currentPosition.x + width/2
      // Canvas Center X = canvas.clientWidth / 2
      // Scroll Left = Component Center X - Canvas Center X
      
      const x = this.currentPosition.x + (this.currentSize.width / 2) - (canvas.clientWidth / 2);
      const y = this.currentPosition.y + (this.currentSize.height / 2) - (canvas.clientHeight / 2);
      
      console.log('Scrolling to:', x, y);

      canvas.scrollTo({
        left: x,
        top: y,
        behavior: 'smooth'
      });
    }
  }

  onCanvasMouseDown(event: MouseEvent) {
    // Deselect or other canvas actions
  }

  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.startPositionX = this.currentPosition.x;
    this.startPositionY = this.currentPosition.y;

    this.setupMouseListeners();
  }

  startResize(event: MouseEvent, handle: string) {
    event.preventDefault();
    event.stopPropagation();
    
    this.isResizing = true;
    this.resizeHandle = handle;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.startPositionX = this.currentPosition.x;
    this.startPositionY = this.currentPosition.y;
    this.startSizeWidth = this.currentSize.width;
    this.startSizeHeight = this.currentSize.height;
  }

  private onMouseMove = (event: MouseEvent) => {
    if (this.isDragging) {
      const deltaX = (event.clientX - this.dragStartX) / this.viewportScale;
      const deltaY = (event.clientY - this.dragStartY) / this.viewportScale;
      
      let newX = this.startPositionX + deltaX;
      let newY = this.startPositionY + deltaY;
      
      if (this.snapToGrid) {
        newX = Math.round(newX / this.gridSize) * this.gridSize;
        newY = Math.round(newY / this.gridSize) * this.gridSize;
      }
      
      // Strict Containment Clamping
      const canvasW = this.config.canvasSize?.width || 4000;
      const canvasH = this.config.canvasSize?.height || 4000;
      this.currentPosition.x = Math.max(0, Math.min(newX, canvasW - this.currentSize.width));
      this.currentPosition.y = Math.max(0, Math.min(newY, canvasH - this.currentSize.height));

      this.onPositionChange();
    }
    
    if (this.isResizing) {
      const deltaX = (event.clientX - this.dragStartX) / this.viewportScale;
      const deltaY = (event.clientY - this.dragStartY) / this.viewportScale;
      
      let newWidth = this.startSizeWidth;
      let newHeight = this.startSizeHeight;
      let newX = this.startPositionX;
      let newY = this.startPositionY;
      
      const canvasW = this.config.canvasSize?.width || 1200;
      const canvasH = this.config.canvasSize?.height || 800;

      if (this.resizeHandle.includes('e')) {
        newWidth = Math.min(this.startSizeWidth + deltaX, canvasW - this.startPositionX);
      }
      if (this.resizeHandle.includes('w')) {
        const maxDeltaX = this.startPositionX; // Cannot move left more than current X
        const safeDeltaX = Math.max(-maxDeltaX, deltaX);
        newWidth = this.startSizeWidth - safeDeltaX;
        newX = this.startPositionX + safeDeltaX;
      }
      if (this.resizeHandle.includes('s')) {
        newHeight = Math.min(this.startSizeHeight + deltaY, canvasH - this.startPositionY);
      }
      if (this.resizeHandle.includes('n')) {
        const maxDeltaY = this.startPositionY;
        const safeDeltaY = Math.max(-maxDeltaY, deltaY);
        newHeight = this.startSizeHeight - safeDeltaY;
        newY = this.startPositionY + safeDeltaY;
      }
      
      // Minimum size
      newWidth = Math.max(50, newWidth);
      newHeight = Math.max(50, newHeight);
      
      if (this.snapToGrid) {
        newWidth = Math.round(newWidth / this.gridSize) * this.gridSize;
        newHeight = Math.round(newHeight / this.gridSize) * this.gridSize;
        newX = Math.round(newX / this.gridSize) * this.gridSize;
        newY = Math.round(newY / this.gridSize) * this.gridSize;
      }
      
      this.currentSize.width = newWidth;
      this.currentSize.height = newHeight;
      this.currentPosition.x = newX;
      this.currentPosition.y = newY;
      this.onPositionChange();
      this.onSizeChange();
    }
  }

  private onMouseUp = () => {
    this.isDragging = false;
    this.isResizing = false;
    this.resizeHandle = '';
  };

  private saveState() {
    const state: UndoRedoState = {
      position: { ...this.currentPosition },
      size: { ...this.currentSize },
      styles: { ...this.editableStyles },
      content: { ...this.editableContent }
    };
    this.undoStack.push(state);
    this.redoStack = [];
  }

  undo() {
    if (this.undoStack.length > 1) {
      const currentState = this.undoStack.pop()!;
      this.redoStack.push(currentState);
      const previousState = this.undoStack[this.undoStack.length - 1];
      this.restoreState(previousState);
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const nextState = this.redoStack.pop()!;
      this.undoStack.push(nextState);
      this.restoreState(nextState);
    }
  }

  private restoreState(state: UndoRedoState) {
    this.currentPosition = { ...state.position };
    this.currentSize = { ...state.size };
    this.editableStyles = { ...state.styles };
    this.editableContent = { ...state.content };
  }

  onPositionChange() {
    this.currentPosition.x = Math.max(0, this.currentPosition.x);
    this.currentPosition.y = Math.max(0, this.currentPosition.y);
    this.scheduleSaveState();
  }

  onSizeChange() {
    this.currentSize.width = Math.max(40, this.currentSize.width);
    this.currentSize.height = Math.max(40, this.currentSize.height);
    this.scheduleSaveState();
  }

  onStyleChange() {
    this.scheduleSaveState();
  }

  onContentChange() {
    this.scheduleSaveState();
  }

  private scheduleSaveState() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.saveState();
    }, 500);
  }

  toggleGrid() {
    this.showGrid = !this.showGrid;
  }

  toggleSnap() {
    this.snapToGrid = !this.snapToGrid;
    if (this.snapToGrid) {
      this.currentPosition.x = Math.round(this.currentPosition.x / this.gridSize) * this.gridSize;
      this.currentPosition.y = Math.round(this.currentPosition.y / this.gridSize) * this.gridSize;
      this.currentSize.width = Math.round(this.currentSize.width / this.gridSize) * this.gridSize;
      this.currentSize.height = Math.round(this.currentSize.height / this.gridSize) * this.gridSize;
      this.onPositionChange();
      this.onSizeChange();
    }
  }

  resetPosition() {
    this.currentPosition = { x: 100, y: 100 };
    this.currentSize = { width: 300, height: 200 };
    this.onPositionChange();
    this.onSizeChange();
  }

  toggleDarkMode() {
    this.editableContent.dark = !this.editableContent.dark;
    
    // If we enable dark mode, we might want to clear manual colors if they look like "light defaults"
    if (this.editableContent.dark && this.editableStyles.backgroundColor === '#ffffff') {
      this.editableStyles.backgroundColor = '#111827';
    } else if (!this.editableContent.dark && this.editableStyles.backgroundColor === '#111827') {
      this.editableStyles.backgroundColor = '#ffffff';
    }
    
    this.onContentChange();
  }

  onVariantChange() {
    // If a variant is selected, we clear the manual colors so the variant can shine
    if (this.editableContent.variant && this.editableContent.variant !== '') {
      this.editableStyles.backgroundColor = '';
      this.editableStyles.borderColor = '';
    }
    this.onContentChange();
  }

  getCustomStyles(): any {
    const styles: any = {};
    
    // Determine background color with robust fallbacks
    const hasVariant = !!this.editableContent.variant && this.editableContent.variant !== 'default';
    let bgColor = this.editableStyles.backgroundColor;
    
    // Fallback if empty and no variant
    if (!hasVariant && !bgColor) {
      bgColor = '#10b981';
    }

    if (bgColor) {
      styles.backgroundColor = bgColor;
      styles.background = bgColor;
    }
    
    // Border logic
    if (this.editableStyles.borderColor || this.editableStyles.borderWidth) {
      const bWidth = this.editableStyles.borderWidth || 2;
      const bColor = this.editableStyles.borderColor || '#059669';
      styles.border = `${bWidth}px solid ${bColor}`;
    }
    
    // Only apply manual border-radius if the preset is 'md' (standard/manual).
    if (this.editableContent.rounded === 'md') {
      styles.borderRadius = `${this.editableStyles.borderRadius || 12}${this.borderRadiusUnit}`;
    }
    
    styles.padding = `${this.editableStyles.padding || 20}${this.paddingUnit}`;
    styles.boxShadow = this.editableStyles.boxShadow || '0 10px 30px rgba(0,0,0,0.3)';
    
    return styles;
  }

  onOverlayClick(event: MouseEvent) {
    this.cancel();
  }

  cancel() {
    this.closed.emit();
  }

  close() {
    this.cancel();
  }

  apply() {
    const updatedConfig: IsolatedModeConfig = {
      ...this.config,
      content: {
        ...this.config.content,
        title: this.editableContent.title,
        description: this.editableContent.description,
        variant: this.editableContent.variant,
        boxVariant: this.editableContent.boxVariant,
        rounded: this.editableContent.rounded,
        size: this.editableContent.size,
        dark: this.editableContent.dark
      },
      styles: {
        ...this.config.styles,
        backgroundColor: this.editableStyles.backgroundColor,
        borderColor: this.editableStyles.borderColor,
        borderWidth: `${this.editableStyles.borderWidth}px`,
        border: this.editableStyles.borderColor 
          ? `${this.editableStyles.borderWidth}px solid ${this.editableStyles.borderColor}`
          : (this.editableStyles.borderWidth > 0 ? `${this.editableStyles.borderWidth}px solid transparent` : 'none'),
        borderRadius: `${this.editableStyles.borderRadius}${this.borderRadiusUnit}`,
        boxShadow: this.editableStyles.boxShadow,
        padding: `${this.editableStyles.padding}${this.paddingUnit}`
      },
      position: { ...this.currentPosition },
      size: { ...this.currentSize }
    };
    this.applied.emit(updatedConfig);
  }

  formatVariantName(variant: string): string {
    if (!variant) return '';
    // Handle special cases or generic formatting
    return variant
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
