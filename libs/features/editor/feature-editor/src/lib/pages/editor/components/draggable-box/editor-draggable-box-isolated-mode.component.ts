import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIDraggableBox1Component, UIDraggableBox2Component, UIDraggableBox3Component, variants } from '@negocio/ui-components';
import { SimpleVisualEditorService } from '@negocio/shared-components';
import { Subject } from 'rxjs';

export interface IsolatedModeConfig {
  sectionId: string;
  elementId: string;
  variant: string;
  globalVariant?: string;
  content: any;
  styles: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

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

                <div class="control-row">
                  <div class="control-group half">
                    <label>Tamaño Base</label>
                    <div class="select-wrapper">
                      <select [(ngModel)]="editableContent.size" (ngModelChange)="onContentChange()" class="premium-select">
                        <option value="sm">Pequeño</option>
                        <option value="md">Normal</option>
                        <option value="lg">Grande</option>
                      </select>
                    </div>
                  </div>
                  <div class="control-group half">
                    <label>Modo Oscuro</label>
                    <div class="toggle-wrapper" (click)="editableContent.dark = !editableContent.dark; onContentChange()" [class.active]="editableContent.dark">
                      <div class="toggle-slider"></div>
                      <span>{{ editableContent.dark ? 'Activado' : 'Desactivado' }}</span>
                    </div>
                  </div>
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <div class="select-wrapper">
                  <select [(ngModel)]="editableContent.variant" (ngModelChange)="onVariantChange()" class="premium-select">
                    <option value="">Página (Heredar)</option>
                    <option value="default">Caja Estándar (Blanca)</option>
                    <option *ngFor="let v of availableVariants" [value]="v">
                      {{ v | titlecase }}
                    </option>
                  </select>
                  </div>
                  <p class="variant-hint" *ngIf="!editableContent.variant">
                    Heredando: {{ config.globalVariant || 'glass' }}
                  </p>
                </div>
              </div>

              <!-- SECCIÓN: CONTENIDO -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📝</span>
                  <h4>CONTENIDO</h4>
                </div>
                <div class="control-group">
                  <label>Texto Principal</label>
                  <input type="text" [(ngModel)]="editableContent.title" (ngModelChange)="onContentChange()" class="premium-input" placeholder="Ej: Mi Caja Draggable">
                </div>
                <div class="control-group">
                  <label>Descripción Adjunta</label>
                  <textarea [(ngModel)]="editableContent.description" (ngModelChange)="onContentChange()" class="premium-textarea" rows="2" placeholder="Información adicional..."></textarea>
                </div>
              </div>

              <!-- SECCIÓN: COLORES -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>COLORES Y BORDES</h4>
                </div>
                
                <div class="control-group">
                  <label>Fondo del Elemento</label>
                  <div class="color-input-wrapper">
                    <div class="color-preview" [style.background-color]="editableStyles.backgroundColor">
                      <input type="color" [(ngModel)]="editableStyles.backgroundColor" (ngModelChange)="onStyleChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableStyles.backgroundColor" (ngModelChange)="onStyleChange()" class="premium-input hex-input">
                  </div>
                </div>

                <div class="control-group">
                  <label>Color de Borde</label>
                  <div class="color-input-wrapper">
                    <div class="color-preview" [style.background-color]="editableStyles.borderColor">
                      <input type="color" [(ngModel)]="editableStyles.borderColor" (ngModelChange)="onStyleChange()">
                    </div>
                    <input type="text" [(ngModel)]="editableStyles.borderColor" (ngModelChange)="onStyleChange()" class="premium-input hex-input">
                  </div>
                </div>

                <div class="control-row">
                  <div class="control-group half">
                    <label>Radio ({{borderRadiusUnit}})</label>
                    <input type="number" [(ngModel)]="editableStyles.borderRadius" (ngModelChange)="onStyleChange()" class="premium-input">
                  </div>
                  <div class="control-group half">
                    <label>Unidad</label>
                    <div class="select-wrapper">
                      <select [(ngModel)]="borderRadiusUnit" (ngModelChange)="onStyleChange()" class="premium-select compact">
                        <option value="px">px</option>
                        <option value="rem">rem</option>
                        <option value="%">%</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="control-group">
                  <label>Sombra (Preset)</label>
                  <div class="select-wrapper">
                    <select [(ngModel)]="editableStyles.boxShadow" (ngModelChange)="onStyleChange()" class="premium-select">
                      <option value="none">Sin Sombra</option>
                      <option value="0 4px 6px rgba(0,0,0,0.15)">Suave</option>
                      <option value="0 10px 25px rgba(0,0,0,0.3)">Elevada</option>
                      <option value="0 20px 50px rgba(0,0,0,0.5)">Profunda</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- SECCIÓN: DIMENSIONES -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">📐</span>
                  <h4>POSICIÓN Y TAMAÑO</h4>
                </div>
                <div class="control-row">
                  <div class="control-group">
                    <label>Posición X</label>
                    <div class="input-with-icon">
                      <span class="axis">X</span>
                      <input type="number" [(ngModel)]="currentPosition.x" (ngModelChange)="onPositionChange()" class="premium-input">
                    </div>
                  </div>
                  <div class="control-group">
                    <label>Posición Y</label>
                    <div class="input-with-icon">
                      <span class="axis">Y</span>
                      <input type="number" [(ngModel)]="currentPosition.y" (ngModelChange)="onPositionChange()" class="premium-input">
                    </div>
                  </div>
                </div>
                <div class="control-row">
                  <div class="control-group">
                    <label>Ancho (W)</label>
                    <input type="number" [(ngModel)]="currentSize.width" (ngModelChange)="onSizeChange()" class="premium-input">
                  </div>
                  <div class="control-group">
                    <label>Alto (H)</label>
                    <input type="number" [(ngModel)]="currentSize.height" (ngModelChange)="onSizeChange()" class="premium-input">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Canvas Area -->
          <div class="isolated-canvas" 
               #canvas
               [class.show-grid]="showGrid"
               [style.background-size]="gridSize + 'px ' + gridSize + 'px'">
            
            <div class="canvas-inner" #canvasInner>
              <div class="draggable-wrapper"
                   #draggableWrapper
                   [id]="config.elementId"
                   [style.left.px]="currentPosition.x"
                   [style.top.px]="currentPosition.y"
                   [style.width.px]="currentSize.width"
                   [style.height.px]="currentSize.height"
                   [style.backgroundColor]="editableStyles.backgroundColor"
                   [style.border]="editableStyles.borderWidth + 'px solid ' + editableStyles.borderColor"
                   [style.borderRadius]="editableContent.rounded === 'md' ? (editableStyles.borderRadius + borderRadiusUnit) : null"
                   [style.padding]="editableStyles.padding + paddingUnit"
                   [style.boxShadow]="editableStyles.boxShadow"
                   (mousedown)="onMouseDown($event)">
                
                <lib-ui-components-draggable-box-1
                  *ngIf="editableContent.boxVariant === 'draggable-box-1'"
                  [variant]="editableContent.variant || config.globalVariant || 'secondary'"
                  [rounded]="editableContent.rounded || 'md'"
                  [size]="editableContent.size || 'md'"
                  [dark]="editableContent.dark || false"
                  [content]="editableContent.content || editableContent.title || 'Drag me'"
                  [customStyles]="getCustomStyles()">
                </lib-ui-components-draggable-box-1>

                <lib-ui-components-draggable-box-2
                  *ngIf="editableContent.boxVariant === 'draggable-box-2'"
                  [variant]="editableContent.variant || config.globalVariant || 'secondary'"
                  [rounded]="editableContent.rounded || 'md'"
                  [size]="editableContent.size || 'md'"
                  [dark]="editableContent.dark || false"
                  [content]="editableContent.content || editableContent.title || 'Drag me'"
                  [customStyles]="getCustomStyles()">
                </lib-ui-components-draggable-box-2>

                <lib-ui-components-draggable-box-3
                  *ngIf="editableContent.boxVariant === 'draggable-box-3'"
                  [variant]="editableContent.variant || config.globalVariant || 'secondary'"
                  [rounded]="editableContent.rounded || 'md'"
                  [size]="editableContent.size || 'md'"
                  [dark]="editableContent.dark || false"
                  [content]="editableContent.content || editableContent.title || 'Drag me'"
                  [customStyles]="getCustomStyles()">
                </lib-ui-components-draggable-box-3>

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
      z-index: 9999999 !important; /* Extremely high to beat any sidebar */
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
      box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8);
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
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
      overflow: hidden;
    }

    /* SIDEBAR */
    .controls-sidebar {
      width: var(--sidebar-width);
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
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      color: #f8fafc;
      padding: 0.6rem 0.8rem;
      border-radius: 10px;
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
      padding: 0.5rem 0.75rem;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .toggle-wrapper:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .toggle-wrapper.active {
      border-color: var(--primary-accent);
      background: rgba(99, 102, 241, 0.05);
    }

    .toggle-slider {
      width: 32px;
      height: 18px;
      background: #334155;
      border-radius: 20px;
      position: relative;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .toggle-slider::after {
      content: '';
      position: absolute;
      left: 3px;
      top: 3px;
      width: 12px;
      height: 12px;
      background: white;
      border-radius: 50%;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .active .toggle-slider {
      background: var(--primary-accent);
    }

    .active .toggle-slider::after {
      left: calc(100% - 15px);
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
      /* Transparent checkerboard */
      background-image: 
        linear-gradient(45deg, #1e293b 25%, transparent 25%), 
        linear-gradient(-45deg, #1e293b 25%, transparent 25%), 
        linear-gradient(45deg, transparent 75%, #1e293b 75%), 
        linear-gradient(-45deg, transparent 75%, #1e293b 75%);
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
      background-color: #0f172a;
      position: relative;
      overflow: auto; /* Changed to auto to allow scrolling to the box if needed */
      display: block; /* Removed flex centering that was hiding the box */
      padding: 100px; /* Give some breathing room */
    }

    .canvas-inner {
      width: 3000px; /* Larger inner canvas */
      height: 3000px;
      position: relative;
      flex-shrink: 0;
      background: transparent;
    }

    .show-grid {
      background-image: 
        radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
      background-size: 40px 40px;
    }

    .draggable-wrapper {
      position: absolute !important;
      cursor: move;
      z-index: 100;
    }

    /* RESIZE HANDLES */
    .resize-handle {
      position: absolute;
      width: 10px;
      height: 10px;
      background: #fff;
      border: 2px solid var(--primary-accent);
      border-radius: 50%;
      z-index: 10;
    }

    .resize-handle.nw { top: -5px; left: -5px; cursor: nw-resize; }
    .resize-handle.n { top: -5px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
    .resize-handle.ne { top: -5px; right: -5px; cursor: ne-resize; }
    .resize-handle.e { top: 50%; right: -5px; transform: translateY(-50%); cursor: e-resize; }
    .resize-handle.se { bottom: -5px; right: -5px; cursor: se-resize; }
    .resize-handle.s { bottom: -5px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
    .resize-handle.sw { bottom: -5px; left: -5px; cursor: sw-resize; }
    .resize-handle.w { top: 50%; left: -5px; transform: translateY(-50%); cursor: w-resize; }

    /* POSITION DOCK */
    .modern-position-dock {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border-color);
      border-radius: 50px;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    }

    .dock-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .dock-item .label {
      font-size: 8px;
      font-weight: 900;
      color: var(--primary-accent);
      background: rgba(99, 102, 241, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .dock-item .value { color: #fff; font-size: 11px; font-weight: 600; font-family: monospace; }
    .dock-divider { width: 1px; height: 16px; background: var(--border-color); }

    /* FOOTER */
    .isolated-mode-footer {
      height: 60px;
      background: var(--bg-header);
      border-top: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      flex-shrink: 0;
    }

    .footer-hint { font-size: 11px; color: var(--text-dim); }
    .footer-hint b { color: var(--primary-accent); }

    .btn-clean {
      padding: 0.75rem 2rem;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
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

  availableVariants = variants.filter(v => v !== 'default');

  private visualEditor = inject(SimpleVisualEditorService);
  private destroy$ = new Subject<void>();

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
  gridSize = 20;

  // Drag/Resize state
  private isDragging = false;
  private isResizing = false;
  private resizeHandle = '';
  private dragStartX = 0;
  private dragStartY = 0;
  private startPositionX = 0;
  private startPositionY = 0;
  private startSizeWidth = 0;
  private startSizeHeight = 0;

  // Undo/Redo
  private undoStack: UndoRedoState[] = [];
  private redoStack: UndoRedoState[] = [];
  private saveTimeout: any;

  // Getters for template access
  get canUndo(): boolean { return this.undoStack.length > 1; }
  get canRedo(): boolean { return this.redoStack.length > 0; }

  ngOnInit() {
    // Load initial position and size
    this.currentPosition = { 
      x: Math.max(0, this.config.position?.x || 0), 
      y: Math.max(0, this.config.position?.y || 0) 
    };
    this.currentSize = { 
      width: Math.max(100, this.config.size?.width || 300), 
      height: Math.max(60, this.config.size?.height || 200) 
    };
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };

    // Load editable content
    this.editableContent = {
      ...this.config.content,
      title: this.config.content['title'] || 'Draggable Box',
      description: this.config.content['description'] || 'Arrastra y redimensiona este elemento',
      variant: this.config.content['variant'] || '',
      boxVariant: this.config.content['boxVariant'] || 'draggable-box-1',
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
      this.resetPosition();
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
    this.onPositionChange();
  }

  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.startPositionX = this.currentPosition.x;
    this.startPositionY = this.currentPosition.y;
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
      const deltaX = event.clientX - this.dragStartX;
      const deltaY = event.clientY - this.dragStartY;
      
      let newX = this.startPositionX + deltaX;
      let newY = this.startPositionY + deltaY;
      
      if (this.snapToGrid) {
        newX = Math.round(newX / this.gridSize) * this.gridSize;
        newY = Math.round(newY / this.gridSize) * this.gridSize;
      }
      
      this.currentPosition.x = newX;
      this.currentPosition.y = newY;
      this.onPositionChange();
    }
    
    if (this.isResizing) {
      const deltaX = event.clientX - this.dragStartX;
      const deltaY = event.clientY - this.dragStartY;
      
      let newWidth = this.startSizeWidth;
      let newHeight = this.startSizeHeight;
      let newX = this.startPositionX;
      let newY = this.startPositionY;
      
      if (this.resizeHandle.includes('e')) {
        newWidth = this.startSizeWidth + deltaX;
      }
      if (this.resizeHandle.includes('w')) {
        newWidth = this.startSizeWidth - deltaX;
        newX = this.startPositionX + deltaX;
      }
      if (this.resizeHandle.includes('s')) {
        newHeight = this.startSizeHeight + deltaY;
      }
      if (this.resizeHandle.includes('n')) {
        newHeight = this.startSizeHeight - deltaY;
        newY = this.startPositionY + deltaY;
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

  onVariantChange() {
    // If a variant is selected, we clear the manual colors so the variant can shine
    if (this.editableContent.variant && this.editableContent.variant !== '') {
      this.editableStyles.backgroundColor = '';
      this.editableStyles.borderColor = '';
    } else {
      // Reverting to "Por defecto" (inherited from global)
      // We don't necessarily want to force green here if the global theme is active
      // But if there's no color at all, the component might look broken if global is also default
    }
    this.onContentChange();
  }

  getCustomStyles(): any {
    const styles: any = {};
    
    // Only add styles if they are specifically set, otherwise let variants handle it
    if (this.editableStyles.backgroundColor !== undefined && this.editableStyles.backgroundColor !== '') {
      styles.backgroundColor = this.editableStyles.backgroundColor;
    }
    
    if (this.editableStyles.borderColor !== undefined && this.editableStyles.borderColor !== '') {
      styles.border = `${this.editableStyles.borderWidth || 0}px solid ${this.editableStyles.borderColor}`;
    } else if (this.editableStyles.borderWidth) {
      // If we have width but no color, we might still want to respect the width if the variant has a color
      styles.borderWidth = `${this.editableStyles.borderWidth}px`;
    }
    
    // Only apply manual border-radius if the preset is 'md' (standard/manual).
    // If 'none' or 'full' is selected, we let the component's CSS classes handle it.
    if (this.editableContent.rounded === 'md') {
      styles.borderRadius = `${this.editableStyles.borderRadius}${this.borderRadiusUnit}`;
    }
    
    styles.padding = `${this.editableStyles.padding}${this.paddingUnit}`;
    styles.boxShadow = this.editableStyles.boxShadow;
    
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
}
