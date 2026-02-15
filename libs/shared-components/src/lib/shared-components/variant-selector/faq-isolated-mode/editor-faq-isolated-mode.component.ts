import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseIsolatedModeComponent } from '../base-isolated-mode.component';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

/**
 * FAQ Item Interface
 */
export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * FAQ Section Isolated Mode Component
 * 
 * Extends BaseIsolatedModeComponent to provide:
 * - Undo/Redo functionality
 * - Drag & Resize capabilities
 * - Grid snapping
 * - Keyboard shortcuts
 */
@Component({
  selector: 'lib-editor-faq-isolated-mode',
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
            <span class="component-name">FAQ SECTION</span>
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
                    placeholder="Preguntas Frecuentes"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <textarea 
                    [(ngModel)]="editableContent.subtitle" 
                    (ngModelChange)="onContentChange()"
                    class="premium-input" 
                    rows="2"
                    placeholder="Encuentra respuestas a las preguntas más comunes"
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <select 
                    [(ngModel)]="editableContent.variant" 
                    (ngModelChange)="onVariantChange()"
                    class="premium-input"
                  >
                    <option value="accordion">Acordeón</option>
                    <option value="list">Lista Simple</option>
                    <option value="cards">Tarjetas</option>
                  </select>
                </div>
              </div>

              <!-- FAQ ITEMS SECTION -->
              <div class="sidebar-section">
                <div class="section-header">
                  <span class="section-icon">❓</span>
                  <h4>PREGUNTAS ({{ editableContent.items?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addFAQItem()">+</button>
                </div>

                <div class="faq-items-list">
                  <div class="faq-item-edit" *ngFor="let item of editableContent.items; let i = index">
                    <div class="faq-header">
                      <span class="faq-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeFAQItem(i)">×</button>
                    </div>
                    
                    <div class="control-group">
                      <label>Pregunta</label>
                      <input 
                        type="text" 
                        [(ngModel)]="item.question" 
                        (ngModelChange)="onContentChange()"
                        class="premium-input" 
                        placeholder="¿Cuál es tu pregunta?"
                      />
                    </div>
                    
                    <div class="control-group">
                      <label>Respuesta</label>
                      <textarea 
                        [(ngModel)]="item.answer" 
                        (ngModelChange)="onContentChange()"
                        class="premium-input" 
                        rows="3"
                        placeholder="Tu respuesta aquí..."
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
                  class="preview-faq"
                  [style.background]="editableContent.backgroundColor || '#f8fafc'"
                  [style.color]="editableContent.textColor || '#1e293b'"
                >
                  <div class="preview-header">
                    <h2 class="preview-title">{{ editableContent.title || 'Preguntas Frecuentes' }}</h2>
                    <p class="preview-subtitle">{{ editableContent.subtitle || 'Encuentra respuestas a las preguntas más comunes' }}</p>
                  </div>
                  
                  <div class="preview-faq-list" [class]="'variant-' + (editableContent.variant || 'accordion')">
                    <div class="preview-faq-item" *ngFor="let item of getPreviewFAQItems()">
                      <div class="preview-faq-question">
                        <span class="preview-icon">{{ editableContent.variant === 'accordion' ? '▼' : 'Q:' }}</span>
                        {{ item.question || '¿Cuál es tu pregunta?' }}
                      </div>
                      <div class="preview-faq-answer" *ngIf="editableContent.variant !== 'accordion' || true">
                        {{ item.answer || 'Tu respuesta aquí...' }}
                      </div>
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
                <span class="value text-purple-400">{{ editableContent.variant || 'accordion' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">ITEMS</span>
                <span class="value">{{ editableContent.items?.length || 0 }}</span>
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
  styleUrl: './editor-faq-isolated-mode.component.scss',
})
export class EditorFAQIsolatedModeComponent extends BaseIsolatedModeComponent {
  @ViewChild('canvasElement') canvasRef!: ElementRef;

  private defaultItems: FAQItem[] = [
    { question: '¿Cómo puedo empezar?', answer: 'Puedes registrarte gratis y comenzar a usar nuestras herramientas inmediatamente.' },
    { question: '¿Cuáles son los métodos de pago?', answer: 'Aceptamos tarjetas de crédito, PayPal y transferencias bancarias.' },
    { question: '¿Puedo cancelar mi suscripción?', answer: 'Sí, puedes cancelar en cualquier momento desde tu panel de usuario.' },
    { question: '¿Ofrecen soporte técnico?', answer: 'Sí, nuestro equipo de soporte está disponible 24/7 para ayudarte.' },
  ];

  protected initializeState(): void {
    const configItems = this.config?.content?.['items'] as FAQItem[] | undefined;
    
    // Initialize content
    this.editableContent = {
      title: this.config?.content?.['title'] || 'Preguntas Frecuentes',
      subtitle: this.config?.content?.['subtitle'] || 'Encuentra respuestas a las preguntas más comunes',
      variant: this.config?.content?.['variant'] || 'accordion',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#f8fafc',
      textColor: this.config?.content?.['textColor'] || '#1e293b',
      accentColor: this.config?.content?.['accentColor'] || '#6366f1',
      items: configItems || [...this.defaultItems],
    };

    // Initialize styles
    this.editableStyles = this.config?.styles ? { ...this.config.styles } : {};

    // Initialize position and size
    this.currentPosition = this.config?.position || { x: 50, y: 50 };
    this.currentSize = this.config?.size || { width: 600, height: 450 };
    this.initialPosition = { ...this.currentPosition };
    this.initialSize = { ...this.currentSize };

    // Save initial state
    this.saveState();
  }

  protected getCanvasElement(): HTMLElement | null {
    return this.canvasRef?.nativeElement || null;
  }

  addFAQItem(): void {
    if (!this.editableContent.items) {
      this.editableContent.items = [];
    }
    this.editableContent.items.push({
      question: 'Nueva pregunta',
      answer: 'Respuesta a la nueva pregunta',
    });
    this.saveState();
  }

  removeFAQItem(index: number): void {
    if (this.editableContent.items && index >= 0 && index < this.editableContent.items.length) {
      this.editableContent.items.splice(index, 1);
      this.saveState();
    }
  }

  getPreviewFAQItems(): FAQItem[] {
    return this.editableContent.items || this.defaultItems;
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
