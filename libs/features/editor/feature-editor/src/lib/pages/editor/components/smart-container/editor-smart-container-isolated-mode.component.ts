import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SmartContainerComponent, SmartContainerConfig } from '@negocio/ui-components';
import { AppState } from '../../../../store/state/app.state';
import { selectCurrentPageGlobalStyles } from '../../../../store/selectors/page.selectors';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

@Component({
  selector: 'lib-editor-smart-container-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, SmartContainerComponent],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">📦 CONTAINER EDITOR</span>
            <span class="separator">/</span>
            <span class="component-name">SMART CONTAINER</span>
          </div>
          
          <div class="header-actions">
            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <div class="isolated-mode-body">
          <div class="controls-sidebar">
            <div class="sidebar-scroll-content">
              
              <!-- LAYOUT SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📐</span>
                  <h4>LAYOUT & DISPLAY</h4>
                </div>
                
                <div class="control-group">
                  <label>Display Type</label>
                  <select [(ngModel)]="editableConfig.display" class="premium-input">
                    <option value="block">Block (Standard)</option>
                    <option value="flex">Flexbox</option>
                    <option value="grid">Grid (Future)</option>
                  </select>
                </div>

                <div class="control-group" *ngIf="editableConfig.display === 'flex'">
                  <label>Direction</label>
                  <select [(ngModel)]="editableConfig.flexDirection" class="premium-input">
                    <option value="row">Horizontal (Row)</option>
                    <option value="column">Vertical (Column)</option>
                  </select>
                </div>

                <div class="control-row grid grid-cols-2 gap-2" *ngIf="editableConfig.display === 'flex'">
                  <div class="control-group">
                    <label>Justify</label>
                    <select [(ngModel)]="editableConfig.justifyContent" class="premium-input">
                      <option value="flex-start">Start</option>
                      <option value="center">Center</option>
                      <option value="flex-end">End</option>
                      <option value="space-between">Between</option>
                    </select>
                  </div>
                  <div class="control-group">
                    <label>Align</label>
                    <select [(ngModel)]="editableConfig.alignItems" class="premium-input">
                      <option value="stretch">Stretch</option>
                      <option value="center">Center</option>
                      <option value="flex-start">Start</option>
                    </select>
                  </div>
                </div>

                <div class="control-group">
                  <label>Gap (Spacing)</label>
                  <input type="text" [(ngModel)]="editableConfig.gap" placeholder="e.g. 20px" class="premium-input">
                </div>
              </div>

              <!-- APPEARANCE SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">✨</span>
                  <h4>STYLING & COLORS</h4>
                </div>
                
                <div class="control-group">
                  <label>Background Color</label>
                  <div class="color-control-wrapper">
                    <div class="color-input-wrapper">
                      <div class="color-preview" [style.background-color]="editableConfig.backgroundColor">
                        <input type="color" [(ngModel)]="editableConfig.backgroundColor">
                      </div>
                      <input type="text" [(ngModel)]="editableConfig.backgroundColor" class="premium-input hex-input">
                    </div>
                  </div>
                </div>

                <div class="control-group">
                  <label>Border Radius</label>
                  <input type="text" [(ngModel)]="editableConfig.borderRadius" placeholder="e.g. 12px" class="premium-input">
                </div>

                <div class="control-group">
                  <label>Border</label>
                  <input type="text" [(ngModel)]="editableConfig.border" placeholder="e.g. 1px solid #ccc" class="premium-input">
                </div>
              </div>

              <!-- SPACING SECTION -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">↔️</span>
                  <h4>PADDING & MARGIN</h4>
                </div>
                <div class="control-row grid grid-cols-2 gap-2">
                  <div class="control-group">
                    <label>Padding</label>
                    <input type="text" [(ngModel)]="editableConfig.padding" class="premium-input">
                  </div>
                  <div class="control-group">
                    <label>Margin</label>
                    <input type="text" [(ngModel)]="editableConfig.margin" class="premium-input">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="isolated-canvas">
            <div class="canvas-inner">
              <div class="draggable-wrapper"
                   [style.width.px]="currentSize.width"
                   [style.height.px]="currentSize.height">
                
                <lib-smart-container
                  [config]="editableConfig"
                  [variant]="'default'"
                  style="display: block; width: 100%; height: 100%;">
                  
                  <!-- Preview content inside the container -->
                  <div class="w-full h-full flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-lg">
                    <div class="text-center">
                      <p class="text-xs font-bold uppercase tracking-widest">Container Preview</p>
                      <p class="text-[10px] opacity-60 mt-1">Width: {{currentSize.width}}px | Height: {{currentSize.height}}px</p>
                    </div>
                  </div>
                  
                </lib-smart-container>

                <div class="resize-handle se" (mousedown)="startResize($event)"></div>
              </div>
            </div>
            
            <div class="modern-position-dock">
              <div class="dock-item"><span class="label">DISPLAY</span><span class="value uppercase text-indigo-400">{{ editableConfig.display }}</span></div>
              <div class="dock-divider"></div>
              <div class="dock-item"><span class="label">SIZE</span><span class="value">{{ currentSize.width }}x{{ currentSize.height }}</span></div>
            </div>
          </div>
        </div>

        <div class="isolated-mode-footer">
          <div class="footer-hint">Los Smart Containers permiten agrupar componentes y gestionar el layout interno dinámicamente.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Descartar cambios</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Estructura</button>
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
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255,255,255,0.08);
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 14px;
      font-size: 12px;
      transition: all 0.2s;
    }
    .premium-input:focus { border-color: #6366f1; outline: none; background: #0f172a; }

    .color-control-wrapper { display: flex; flex-direction: column; gap: 0.5rem; }
    .color-input-wrapper { display: flex; gap: 1rem; }
    .color-preview { width: 42px; height: 42px; border-radius: 12px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
    .color-preview input { position: absolute; inset: -10px; width: 200%; height: 200%; cursor: pointer; }

    .isolated-canvas { flex: 1; background: #010409; position: relative; overflow: hidden; background-image: 
      linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
      background-size: 30px 30px; }
    .canvas-inner { width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center; padding: 60px; }
    
    .draggable-wrapper { position: relative; border: 2px dashed rgba(99, 102, 241, 0.3); padding: 8px; border-radius: 4px; }
    .resize-handle { position: absolute; width: 14px; height: 14px; background: #6366f1; border: 2px solid white; border-radius: 5px; bottom: -7px; right: -7px; cursor: se-resize; transition: transform 0.2s; }
    .resize-handle:hover { transform: scale(1.2); }

    .modern-position-dock { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(12px); padding: 0.8rem 1.8rem; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.05); display: flex; gap: 2rem; color: white; font-size: 11px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .dock-divider { width: 1px; background: rgba(255, 255, 255, 0.1); }
    .dock-item { display: flex; align-items: center; gap: 0.6rem; }
    .dock-item .label { color: #475569; font-weight: 900; }

    .isolated-mode-footer { height: 80px; padding: 0 3rem; background: #1e293b; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.05); }
    .footer-hint { font-size: 12px; color: #64748b; font-style: italic; }
    .btn-clean { padding: 0.8rem 2rem; border-radius: 16px; font-weight: 800; cursor: pointer; border: none; font-size: 13px; transition: all 0.3s; }
    .btn-clean.primary { background: #6366f1; color: white; box-shadow: 0 5px 20px rgba(99, 102, 241, 0.4); }
    .btn-clean.secondary { background: transparent; color: #64748b; }
    .btn-clean:hover { transform: translateY(-2px); filter: brightness(1.1); }
    .btn-clean.active { transform: translateY(0); opacity: 0.8; }
  `]
})
export class EditorSmartContainerIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() public config!: IsolatedModeConfig;
  @Output() public closed = new EventEmitter<void>();
  @Output() public applied = new EventEmitter<IsolatedModeConfig>();

  public editableConfig: SmartContainerConfig = {};
  public currentSize = { width: 0, height: 0 };
  
  private isResizing = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private startW = 0;
  private startH = 0;

  ngOnInit() {
    this.editableConfig = { ...this.config.content };
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
      this.currentSize.width = Math.max(100, this.startW + (e.clientX - this.dragStartX));
      this.currentSize.height = Math.max(100, this.startH + (e.clientY - this.dragStartY));
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
      content: { ...this.editableConfig },
      styles: {
        ...this.config.styles,
        width: this.currentSize.width + 'px',
        height: this.currentSize.height + 'px'
      },
      size: { ...this.currentSize }
    });
  }
}
