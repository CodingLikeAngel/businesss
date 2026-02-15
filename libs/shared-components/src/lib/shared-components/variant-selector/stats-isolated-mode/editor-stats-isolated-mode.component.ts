import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

/**
 * Stats Item Interface
 */
export interface StatsItem {
  value: string;
  label: string;
  icon?: string;
}

/**
 * Stats Section Isolated Mode Component
 * 
 * Extends BaseIsolatedModeComponent to provide:
 * - Undo/Redo functionality
 * - Drag & Resize capabilities
 * - Grid snapping
 * - Keyboard shortcuts
 */
@Component({
  selector: 'lib-editor-stats-isolated-mode',
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
            <span class="component-name">STATS SECTION</span>
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
                  <label>Título de la Sección</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editableContent.title" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    placeholder="Nuestros Números"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <textarea 
                    [(ngModel)]="editableContent.subtitle" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    rows="2"
                    placeholder="Lo que hemos logrado juntos"
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <select 
                    [(ngModel)]="editableContent.variant" 
                    (ngModelChange)="onVariantChange()"
                    class="premium-input"
                  >
                    <option value="cards">Tarjetas</option>
                    <option value="inline">En línea</option>
                    <option value="grid">Grid</option>
                    <option value="minimal">Minimalista</option>
                  </select>
                </div>
              </div>

              <!-- STATS ITEMS SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">📊</span>
                  <h4>ESTADÍSTICAS ({{ editableContent.stats?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addStatItem()">+</button>
                </div>

                <div class="stats-items-list">
                  <div class="stat-item-edit" *ngFor="let stat of editableContent.stats; let i = index">
                    <div class="stat-header">
                      <span class="stat-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeStatItem(i)">×</button>
                    </div>
                    
                    <div class="stat-row">
                      <div class="control-group flex-1">
                        <label>Valor</label>
                        <input 
                          type="text" 
                          [(ngModel)]="stat.value" 
                          (ngModelChange)="onContentChange()"
                          class="premium-input value-input" 
                          placeholder="500+"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Etiqueta</label>
                        <input 
                          type="text" 
                          [(ngModel)]="stat.label" 
                          (ngModelChange)="onContentChange()"
                          class="premium-input" 
                          placeholder="Clientes"
                        />
                      </div>
                    </div>
                    
                    <div class="control-group">
                      <label>Icono (emoji)</label>
                      <input 
                        type="text" 
                        [(ngModel)]="stat.icon" 
                        (ngModelChange)="onContentChange()"
                        class="premium-input icon-input" 
                        placeholder="👥"
                      />
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

                <div class="control-group">
                  <label>Color de Iconos</label>
                  <input 
                    type="color" 
                    [(ngModel)]="editableContent.iconColor" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input color-input"
                  />
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
                  class="preview-stats"
                  [style.background]="editableContent.backgroundColor || '#0f172a'"
                  [style.color]="editableContent.textColor || '#ffffff'"
                >
                  <div class="preview-header">
                    <h2 class="preview-title">{{ editableContent.title || 'Nuestros Números' }}</h2>
                    <p class="preview-subtitle">{{ editableContent.subtitle || 'Lo que hemos logrado juntos' }}</p>
                  </div>
                  
                  <div class="preview-stats-grid" [class]="'variant-' + (editableContent.variant || 'cards')">
                    <div class="preview-stat-item" *ngFor="let stat of getPreviewStats()">
                      <span class="preview-stat-icon" [style.color]="editableContent.iconColor || '#6366f1'">
                        {{ stat.icon || '📊' }}
                      </span>
                      <span class="preview-stat-value" [style.color]="editableContent.accentColor || '#6366f1'">
                        {{ stat.value || '100+' }}
                      </span>
                      <span class="preview-stat-label">{{ stat.label || 'Estadística' }}</span>
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
                <span class="value text-purple-400">{{ editableContent.variant || 'cards' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">STATS</span>
                <span class="value">{{ editableContent.stats?.length || 0 }}</span>
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
  styleUrl: './editor-stats-isolated-mode.component.scss',
})
export class EditorStatsIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvasElement') canvasRef!: ElementRef;

  private defaultStats: StatsItem[] = [
    { value: '500+', label: 'Clientes Satisfechos', icon: '👥' },
    { value: '10K+', label: 'Proyectos Entregados', icon: '🚀' },
    { value: '98%', label: 'Tasa de Éxito', icon: '🎯' },
    { value: '24/7', label: 'Soporte Disponible', icon: '💬' },
  ];

  protected initializeState(): void {
    const configStats = this.config?.content?.['stats'] as StatsItem[] | undefined;
    
    // Initialize content
    this.editableContent = {
      title: this.config?.content?.['title'] || 'Nuestros Números',
      subtitle: this.config?.content?.['subtitle'] || 'Lo que hemos logrado juntos',
      variant: this.config?.content?.['variant'] || 'cards',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#0f172a',
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      accentColor: this.config?.content?.['accentColor'] || '#6366f1',
      iconColor: this.config?.content?.['iconColor'] || '#6366f1',
      stats: configStats || [...this.defaultStats],
    };

    // Initialize styles
    this.editableStyles = this.config?.styles ? { ...this.config.styles } : {};

    // Initialize position and size
    this.currentPosition = this.config?.position || { x: 50, y: 50 };
    this.currentSize = this.config?.size || { width: 650, height: 350 };
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };

    // Save initial state
    this.saveState();
  }

  protected getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement || null;
  }

  addStatItem(): void {
    if (!this.editableContent.stats) {
      this.editableContent.stats = [];
    }
    this.editableContent.stats.push({
      value: '100+',
      label: 'Nueva Estadística',
      icon: '⭐',
    });
    this.saveState();
  }

  removeStatItem(index: number): void {
    if (this.editableContent.stats && index >= 0 && index < this.editableContent.stats.length) {
      this.editableContent.stats.splice(index, 1);
      this.saveState();
    }
  }

  getPreviewStats(): StatsItem[] {
    return this.editableContent.stats || this.defaultStats;
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
