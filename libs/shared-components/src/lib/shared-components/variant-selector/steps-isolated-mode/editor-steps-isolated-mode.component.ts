import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

/**
 * Step Item Interface
 */
export interface StepItem {
  number: string;
  title: string;
  description: string;
  icon?: string;
}

/**
 * Steps Section Isolated Mode Component
 * 
 * Extends BaseIsolatedModeComponent to provide:
 * - Undo/Redo functionality
 * - Drag & Resize capabilities
 * - Grid snapping
 * - Keyboard shortcuts
 */
@Component({
  selector: 'lib-editor-steps-isolated-mode',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="isolated-mode-overlay" (click)="onOverlayClick($event)">
      <div class="isolated-mode-container" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="isolated-mode-header">
          <div class="header-breadcrumb">
            <span class="mode-badge">🎨 MODO AISLADO</span>
            <span class="separator">/</span>
            <span class="component-name">STEPS SECTION</span>
          </div>
          <div class="header-actions">
            <button class="action-btn" (click)="undo()" [disabled]="!canUndo" title="Deshacer (Ctrl+Z)">↶</button>
            <button class="action-btn" (click)="redo()" [disabled]="!canRedo" title="Rehacer (Ctrl+Y)">↷</button>
            <button class="action-btn" (click)="toggleGrid()" [class.active]="showGrid" title="Toggle Grid (G)">⊞</button>
            <button class="action-btn" (click)="toggleSnap()" [class.active]="snapToGrid" title="Snap to Grid (S)">⬡</button>
            <button class="action-btn" (click)="resetPosition()" title="Reset Position (R)">⟲</button>
            <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <!-- Body -->
        <div class="isolated-mode-body">
          <!-- Sidebar Controls -->
          <div class="controls-sidebar">
            <div class="sidebar-scroll-content">
              
              <!-- CONTENT SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📝</span>
                  <h4>CONTENIDO</h4>
                </div>

                <div class="control-group">
                  <label>Título</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.title" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="Cómo Funciona"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <textarea 
                    [(ngModel)]="editableContent.subtitle" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    rows="2"
                    placeholder="Sigue estos simples pasos para comenzar"
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <select 
                    [(ngModel)]="editableContent.variant" 
                    (ngModelChange)="onVariantChange()"
                    class="premium-input"
                  >
                    <option value="horizontal">Horizontal</option>
                    <option value="vertical">Vertical</option>
                    <option value="cards">Tarjetas</option>
                    <option value="timeline">Línea de Tiempo</option>
                  </select>
                </div>
              </div>

              <!-- STEPS SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📋</span>
                  <h4>PASOS ({{ editableContent.steps?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addStepItem()">+</button>
                </div>

                <div class="steps-items-list">
                  <div class="step-item-edit" *ngFor="let step of editableContent.steps; let i = index">
                    <div class="step-header">
                      <span class="step-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeStepItem(i)">×</button>
                    </div>
                    
                    <div class="step-row">
                      <div class="control-group flex-1">
                        <label>Número</label>
                        <input 
                          type="text" 
                          [(ngModel)]="step.number" 
                          (ngModelChange)="onContentChange()"
                          class="premium-input" 
                          placeholder="1"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Icono</label>
                        <input 
                          type="text" 
                          [(ngModel)]="step.icon" 
                          (ngModelChange)="onContentChange()"
                          class="premium-input icon-input" 
                          placeholder="🚀"
                        />
                      </div>
                    </div>
                    
                    <div class="control-group">
                      <label>Título</label>
                      <input 
                        type="text" 
                        [(ngModel)]="step.title" 
                        (ngModelChange)="onContentChange()"
                        class="premium-input" 
                        placeholder="Título del paso"
                      />
                    </div>
                    
                    <div class="control-group">
                      <label>Descripción</label>
                      <textarea 
                        [(ngModel)]="step.description" 
                        (ngModelChange)="onContentChange()"
                        class="premium-input" 
                        rows="2"
                        placeholder="Descripción del paso"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <!-- STYLING SECTION -->
              <div class="sidebar-section no-border">
                <div class="section-header">
                  <span class="section-icon">🎨</span>
                  <h4>ESTILOS</h4>
                </div>

                <div class="control-group">
                  <label>Color de Fondo</label>
                  <input 
                    type="color" 
                    [(ngModel)]="editableContent.backgroundColor" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input color-input"
                  />
                </div>

                <div class="control-row">
                  <div class="control-group flex-1">
                    <label>Color de Texto</label>
                    <input 
                      type="color" 
                      [(ngModel)]="editableContent.textColor" 
                      (ngModelChange)="onContentChange()"
                      class="premium-input color-input"
                    />
                  </div>
                  <div class="control-group flex-1">
                    <label>Color de Acento</label>
                    <input 
                      type="color" 
                      [(ngModel)]="editableContent.accentColor" 
                      (ngModelChange)="onContentChange()"
                      class="premium-input color-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Canvas Preview -->
          <div class="isolated-canvas" #canvasElement [class.show-grid]="showGrid">
            <div class="canvas-inner">
              <!-- Draggable Wrapper -->
              <div 
                class="draggable-wrapper"
                [style.left.px]="currentPosition.x"
                [style.top.px]="currentPosition.y"
                [style.width.px]="currentSize.width"
                [style.height.px]="currentSize.height"
                (mousedown)="onMouseDown($event)"
              >
                <div 
                  class="preview-steps"
                  [style.background]="editableContent.backgroundColor || '#f8fafc'"
                  [style.color]="editableContent.textColor || '#1e293b'"
                >
                  <div class="preview-header">
                    <h2 class="preview-title">{{ editableContent.title || 'Cómo Funciona' }}</h2>
                    <p class="preview-subtitle">{{ editableContent.subtitle || 'Sigue estos simples pasos para comenzar' }}</p>
                  </div>
                  
                  <div class="preview-steps-grid" [class]="'variant-' + (editableContent.variant || 'horizontal')">
                    <div class="preview-step-item" *ngFor="let step of getPreviewSteps(); let i = index">
                      <div class="preview-step-number" [style.background]="editableContent.accentColor || '#6366f1'">
                        {{ step.number || (i + 1) }}
                      </div>
                      <span class="preview-step-icon">{{ step.icon || '⭐' }}</span>
                      <h3 class="preview-step-title">{{ step.title || 'Título del Paso' }}</h3>
                      <p class="preview-step-description">{{ step.description || 'Descripción del paso aquí' }}</p>
                    </div>
                  </div>
                </div>

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

            <!-- Info Dock -->
            <div class="modern-position-dock">
              <div class="dock-item">
                <span class="label">X</span>
                <span class="value">{{ currentPosition.x }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">Y</span>
                <span class="value">{{ currentPosition.y }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">W</span>
                <span class="value">{{ currentSize.width }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">H</span>
                <span class="value">{{ currentSize.height }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">VARIANT</span>
                <span class="value text-purple-400">{{ editableContent.variant || 'horizontal' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">STEPS</span>
                <span class="value">{{ editableContent.steps?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">
            <span class="hint-item">G: Grid</span>
            <span class="hint-item">S: Snap</span>
            <span class="hint-item">R: Reset</span>
            <span class="hint-item">Ctrl+Z: Undo</span>
            <span class="hint-item">Ctrl+S: Save</span>
          </div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editor-steps-isolated-mode.component.scss',
})
export class EditorStepsIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvasElement') canvasRef!: ElementRef;

  private defaultSteps: StepItem[] = [
    { number: '1', title: 'Regístrate', description: 'Crea tu cuenta gratis en segundos', icon: '📝' },
    { number: '2', title: 'Configura', description: 'Personaliza tu perfil y preferencias', icon: '⚙️' },
    { number: '3', title: 'Activa', description: 'Comienza a usar nuestras herramientas', icon: '🚀' },
    { number: '4', title: 'Escala', description: 'Grow y expande tu negocio', icon: '📈' },
  ];

  protected initializeState(): void {
    const configSteps = this.config?.content?.['steps'] as StepItem[] | undefined;
    
    // Initialize content
    this.editableContent = {
      title: this.config?.content?.['title'] || 'Cómo Funciona',
      subtitle: this.config?.content?.['subtitle'] || 'Sigue estos simples pasos para comenzar',
      variant: this.config?.content?.['variant'] || 'horizontal',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#f8fafc',
      textColor: this.config?.content?.['textColor'] || '#1e293b',
      accentColor: this.config?.content?.['accentColor'] || '#6366f1',
      steps: configSteps || [...this.defaultSteps],
    };

    // Initialize styles
    this.editableStyles = this.config?.styles ? { ...this.config.styles } : {};

    // Initialize position and size
    this.currentPosition = this.config?.position || { x: 50, y: 50 };
    this.currentSize = this.config?.size || { width: 700, height: 400 };
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };

    // Save initial state
    this.saveState();
  }

  protected getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement || null;
  }

  addStepItem(): void {
    if (!this.editableContent.steps) {
      this.editableContent.steps = [];
    }
    this.editableContent.steps.push({
      number: String((this.editableContent.steps?.length || 0) + 1),
      title: 'Nuevo Paso',
      description: 'Descripción del nuevo paso',
      icon: '⭐',
    });
    this.saveState();
  }

  removeStepItem(index: number): void {
    if (this.editableContent.steps && index >= 0 && index < this.editableContent.steps.length) {
      this.editableContent.steps.splice(index, 1);
      this.saveState();
    }
  }

  getPreviewSteps(): StepItem[] {
    return this.editableContent.steps || this.defaultSteps;
  }

  override apply(): void {
    const finalConfig: IsolatedModeConfig = {
      ...this.config,
      content: { ...this.editableContent },
      styles: {
        ...this.editableStyles,
        width: this.currentSize.width + 'px',
        height: this.currentSize.height + 'px',
        position: 'absolute',
        left: this.currentPosition.x + 'px',
        top: this.currentPosition.y + 'px'
      },
      position: { ...this.currentPosition },
      size: { ...this.currentSize },
      metadata: {
        createdAt: this.config?.metadata?.createdAt || Date.now(),
        modifiedAt: Date.now(),
        modifiedBy: this.config?.metadata?.modifiedBy,
      },
    };
    this.applied.emit(finalConfig);
  }
}
