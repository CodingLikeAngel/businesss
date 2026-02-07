import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
 * Stats Isolated Mode Content
 */
export interface StatsIsolatedModeContent {
  title?: string;
  subtitle?: string;
  stats?: StatsItem[];
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  iconColor?: string;
}

/**
 * Stats Section Isolated Mode Component
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
                  <label>Título de la Sección</label>
                  <input 
                    type="text" 
                    [(ngModel)]="content.title" 
                    class="premium-input" 
                    placeholder="Nuestros Números"
                  />
                </div>

                <div class="control-group">
                  <label>Subtítulo</label>
                  <textarea 
                    [(ngModel)]="content.subtitle" 
                    class="premium-input" 
                    rows="2"
                    placeholder="Lo que hemos logrado juntos"
                  ></textarea>
                </div>

                <div class="control-group">
                  <label>Variante de Estilo</label>
                  <select [(ngModel)]="content.variant" class="premium-input">
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
                  <h4>ESTADÍSTICAS ({{ content.stats?.length || 0 }})</h4>
                  <button class="add-btn" (click)="addStatItem()">+</button>
                </div>

                <div class="stats-items-list">
                  <div class="stat-item-edit" *ngFor="let stat of content.stats; let i = index">
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
                          class="premium-input value-input" 
                          placeholder="500+"
                        />
                      </div>
                      <div class="control-group flex-1">
                        <label>Etiqueta</label>
                        <input 
                          type="text" 
                          [(ngModel)]="stat.label" 
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

                <div class="control-group">
                  <label>Color de Iconos</label>
                  <input 
                    type="color" 
                    [(ngModel)]="content.iconColor" 
                    class="premium-input color-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Canvas Preview -->
          <div class="isolated-canvas">
            <div class="canvas-inner">
              <div 
                class="preview-stats"
                [style.background]="content.backgroundColor || '#0f172a'"
                [style.color]="content.textColor || '#ffffff'"
              >
                <div class="preview-header">
                  <h2 class="preview-title">{{ content.title || 'Nuestros Números' }}</h2>
                  <p class="preview-subtitle">{{ content.subtitle || 'Lo que hemos logrado juntos' }}</p>
                </div>
                
                <div class="preview-stats-grid" [class]="'variant-' + (content.variant || 'cards')">
                  <div class="preview-stat-item" *ngFor="let stat of getPreviewStats()">
                    <span class="preview-stat-icon" [style.color]="content.iconColor || '#6366f1'">
                      {{ stat.icon || '📊' }}
                    </span>
                    <span class="preview-stat-value" [style.color]="content.accentColor || '#6366f1'">
                      {{ stat.value || '100+' }}
                    </span>
                    <span class="preview-stat-label">{{ stat.label || 'Estadística' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Info Dock -->
            <div class="modern-position-dock">
              <div class="dock-item">
                <span class="label">VARIANT</span>
                <span class="value text-purple-400">{{ content.variant || 'cards' }}</span>
              </div>
              <div class="dock-divider"></div>
              <div class="dock-item">
                <span class="label">STATS</span>
                <span class="value">{{ content.stats?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="isolated-mode-footer">
          <div class="footer-hint">Edita las estadísticas de tu sección.</div>
          <div class="footer-actions-btns">
            <button class="btn-clean secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-clean primary" (click)="apply()">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editor-stats-isolated-mode.component.scss',
})
export class EditorStatsIsolatedModeComponent implements OnInit, OnDestroy {
  @Input() public config!: IsolatedModeConfig;
  @Output() public closed = new EventEmitter<void>();
  @Output() public applied = new EventEmitter<IsolatedModeConfig>();

  public content: StatsIsolatedModeContent = {};
  
  private defaultStats: StatsItem[] = [
    { value: '500+', label: 'Clientes Satisfechos', icon: '👥' },
    { value: '10K+', label: 'Proyectos Entregados', icon: '🚀' },
    { value: '98%', label: 'Tasa de Éxito', icon: '🎯' },
    { value: '24/7', label: 'Soporte Disponible', icon: '💬' },
  ];

  ngOnInit() {
    const configStats = this.config?.content?.['stats'] as StatsItem[] | undefined;
    
    this.content = {
      title: this.config?.content?.['title'] || 'Nuestros Números',
      subtitle: this.config?.content?.['subtitle'] || 'Lo que hemos logrado juntos',
      variant: this.config?.content?.['variant'] || 'cards',
      backgroundColor: this.config?.content?.['backgroundColor'] || '#0f172a',
      textColor: this.config?.content?.['textColor'] || '#ffffff',
      accentColor: this.config?.content?.['accentColor'] || '#6366f1',
      iconColor: this.config?.content?.['iconColor'] || '#6366f1',
      stats: configStats || this.defaultStats,
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

  public addStatItem() {
    if (!this.content.stats) {
      this.content.stats = [];
    }
    this.content.stats.push({
      value: '100+',
      label: 'Nueva Estadística',
      icon: '⭐',
    });
  }

  public removeStatItem(index: number) {
    if (this.content.stats && index >= 0 && index < this.content.stats.length) {
      this.content.stats.splice(index, 1);
    }
  }

  public getPreviewStats(): StatsItem[] {
    return this.content.stats || this.defaultStats;
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
