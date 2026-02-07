import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

/**
 * FAQ Item Interface
 */
export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * FAQ Isolated Mode Content
 */
export interface FAQIsolatedModeContent {
  title?: string;
  subtitle?: string;
  items?: FAQItem[];
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

/**
 * FAQ Section Isolated Mode Component
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
          <button class="close-main-btn" (click)="close()" title="Cerrar (Esc)">✕</button>
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
                    [(ngModel)]="content.title" 
                    class="premium-input" 
                    placeholder="Preguntas Frecuentes"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <textarea 
                    [(ngModel)]="content.subtitle" 
                    class="premium-input" 
                    rows="2"
                    placeholder="Encuentra respuestas a las preguntas más comunes"
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <select [(ngModel)]="content.variant" class="premium-input">
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
                  <h4>PREGUNTAS ({{ content.items?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addFAQItem()">+</button>
                </div>

                <div class="faq-items-list">
                  <div class="faq-item-edit" *ngFor="let item of content.items; let i = index">
                    <div class="faq-header">
                      <span class="faq-number">{{ i + 1 }}</span>
                      <button class="remove-btn" (click)="removeFAQItem(i)">×</button>
                    </div>
                    
                    <div class="control-group">
                      <label>Pregunta</label>
                      <input 
                        type="text" 
                        [(ngModel)]="item.question" 
                        class="premium-input" 
                        placeholder="¿Cuál es tu pregunta?"
                      />
                    </div>
                    
                    <div class="control-group">
                      <label>Respuesta</label>
                      <textarea 
                        [(ngModel)]="item.answer" 
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
                    [(ngModel)]="content.backgroundColor" 
                    class="premium-input color-input"
                  />
                </div>

                <div class="control-row">
                  <div class="control-group flex-1">
                    <label>Color de Texto</label>
                    <input 
                      type="color" 
                      [(ngModel)]="content.textColor" 
                      class="premium-input color-input"
                    />
                  </div>
                  <div class="control-group flex-1">
                    <label>Color de Acento</label>
                    <input 
                      type="color" 
                      [(ngModel)]="content.accentColor" 
                      class="premium-input color-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Canvas Preview -->
          <div class="isolated-canvas">
            <div class="canvas-inner">
              <div 
                class="preview-faq"
                [style.background]="content.backgroundColor || '#f8fafc'"
                [style.color]="content.textColor || '#1e293b'"
              >
                <div class="preview-header">
                  <h2 class="preview-title">{{ content.title || 'Preguntas Frecuentes' }}</h2>
                  <p class="preview-subtitle">{{ content.subtitle || 'Encuentra respuestas a las preguntas más comunes' }}</p>
                </div>
                
                <div class="preview-faq-list" [class]="'variant-' + (content.variant || 'accordion')">
                  <div class="preview-faq-item" *ngFor="let item of getPreviewFAQItems()">
                    <div class="preview-faq-question">
                      <span class="preview-icon">{{ content.variant === 'accordion' ? '▼' : 'Q:' }}</span>
                      {{ item.question || '¿Cuál es tu pregunta?' }}
                    </div>
                    <div class="preview-faq-answer" *ngIf="content.variant !== 'accordion' || true">
                      {{ item.answer || 'Tu respuesta aquí...' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Info Dock -->
            <div class="modern-position-dock">
              <div class="dock-item">
                <span class="label">VARIANT</span>
                <span class="value text-purple-400">{{ content.variant || 'accordion' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">ITEMS</span>
                <span class="value">{{ content.items?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Edita tu sección de FAQ.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editor-faq-isolated-mode.component.scss',
})
export class EditorFAQIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() public config!: IsolatedModeConfig;
  @Output() public closed = new EventEmitter<void>();
  @Output() public applied = new EventEmitter<IsolatedModeConfig>();

  public content: FAQIsolatedModeContent = {};
  
  private defaultItems: FAQItem[] = [
    { question: '¿Cómo puedo empezar?', answer: 'Puedes registrarte gratis y comenzar a usar nuestras herramientas inmediatamente.' },
    { question: '¿Cuáles son los métodos de pago?', answer: 'Aceptamos tarjetas de crédito, PayPal y transferencias bancarias.' },
    { question: '¿Puedo cancelar mi suscripción?', answer: 'Sí, puedes cancelar en cualquier momento desde tu panel de usuario.' },
    { question: '¿Ofrecen soporte técnico?', answer: 'Sí, nuestro equipo de soporte está disponible 24/7 para ayudarte.' },
  ];

  ngOnInit() {
    const configItems = this.config?.content?.['items'] as FAQItem[] | undefined;
    
    this.content = {
      title: this.config?.content?.['title'] || 'Preguntas Frecuentes',
      subtitle: this.config?.content?.['subtitle'] || 'Encuentra respuestas a las preguntas más comunes',
      variant: this.config?.content?.['variant'] || 'accordion',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#f8fafc',
      textColor: this.config?.content?.['textColor'] || '#1e293b',
      accentColor: this.config?.content?.['accentColor'] || '#6366f1',
      items: configItems || this.defaultItems,
    };

    document.addEventListener('keydown', this.handleKeydown);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.handleKeydown);
  }

  private handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.close();
    }
  };

  public close() {
    this.closed.emit();
  }

  public cancel() {
    this.closed.emit();
  }

  public onOverlayClick(e: Event) {
    this.closed.emit();
  }

  public addFAQItem() {
    if (!this.content.items) {
      this.content.items = [];
    }
    this.content.items.push({
      question: 'Nueva pregunta',
      answer: 'Respuesta a la nueva pregunta',
    });
  }

  public removeFAQItem(index: number) {
    if (this.content.items && index >= 0 && index < this.content.items.length) {
      this.content.items.splice(index, 1);
    }
  }

  public getPreviewFAQItems(): FAQItem[] {
    return this.content.items || this.defaultItems;
  }

  public apply() {
    this.applied.emit({
      ...this.config,
      content: { ...this.content },
      metadata: {
        createdAt: this.config?.metadata?.createdAt || Date.now(),
        modifiedAt: Date.now(),
        modifiedBy: this.config?.metadata?.modifiedBy,
      },
    });
  }
}
