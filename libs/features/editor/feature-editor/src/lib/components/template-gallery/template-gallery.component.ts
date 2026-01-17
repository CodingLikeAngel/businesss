import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TemplateService } from '../../services/template.service';
import { Template, TemplateCategory } from '../../models/editor.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-template-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="template-gallery-overlay" (click)="onClose()">
      <div class="template-gallery-container" (click)="$event.stopPropagation()">
        <!-- Header Section -->
        <header class="gallery-header">
          <div class="header-content">
            <h2 class="gallery-title">Galería de Plantillas</h2>
            <p class="gallery-subtitle">Diseños premium listos para potenciar tu negocio</p>
          </div>
          <button class="close-btn" (click)="onClose()" aria-label="Cerrar">
             <i class="close-icon">&times;</i>
          </button>
        </header>

        <!-- Filters Section -->
        <div class="gallery-controls">
          <div class="search-wrapper">
             <span class="search-icon">🔍</span>
             <input
               type="text"
               class="search-input"
               placeholder="Buscar plantilla perfecta..."
               [(ngModel)]="searchQuery"
               (input)="onSearch()"
             />
          </div>
          
          <nav class="category-nav">
            <button
              *ngFor="let category of categories$ | async"
              class="category-tag"
              [class.active]="selectedCategory === category.id"
              (click)="selectCategory(category.id)"
            >
              <span class="cat-icon">{{ category.icon }}</span>
              {{ category.name }}
            </button>
          </nav>
        </div>

        <!-- Templates Grid -->
        <main class="templates-scroll-area">
          <div class="templates-grid">
            <article
              *ngFor="let template of filteredTemplates; let i = index"
              class="template-card-premium"
              [class.premium]="template.premium"
              [style.--index]="i"
              (click)="selectTemplate(template)"
            >
              <div class="card-visual">
                <img
                  [src]="template.thumbnail"
                  [alt]="template.name"
                  (error)="onImageError($event)"
                  class="template-img"
                />
                <div class="card-overlay">
                  <div class="action-buttons">
                    <button class="btn-action preview" (click)="previewTemplate(template, $event)">
                      <span class="icon">👁️</span> Previsualizar
                    </button>
                    <button class="btn-action use" (click)="useTemplate(template, $event)">
                      <span class="icon">✨</span> Usar Ahora
                    </button>
                  </div>
                </div>
                <span *ngIf="template.premium" class="premium-badge-v2">PREMIUM</span>
              </div>

              <div class="card-content">
                <div class="card-header">
                  <h3 class="template-name">{{ template.name }}</h3>
                  <div class="popularity-rank">
                    <span class="star">⭐</span>
                    {{ template.popularity }}%
                  </div>
                </div>
                <p class="template-desc">{{ template.description }}</p>
                <div class="card-footer">
                  <div class="tag-list">
                    <span *ngFor="let tag of template.tags" class="mini-tag">#{{ tag }}</span>
                  </div>
                  <span class="author">por {{ template.author }}</span>
                </div>
              </div>
            </article>

            <!-- Empty State -->
            <div *ngIf="filteredTemplates.length === 0" class="empty-state-v2">
              <div class="empty-art">🔍</div>
              <h3>No encontramos nada</h3>
              <p>Intenta con otros términos o categorías</p>
            </div>
          </div>
        </main>
      </div>

      <!-- Detail Preview (Fixed Overlay) -->
      <div *ngIf="previewingTemplate" class="modern-preview-overlay" (click)="closePreview()">
        <div class="preview-card" (click)="$event.stopPropagation()">
            <header class="preview-header">
                <h3>{{ previewingTemplate.name }}</h3>
                <button class="icon-close" (click)="closePreview()">&times;</button>
            </header>
            <div class="preview-body">
                 <img [src]="previewingTemplate.preview" [alt]="previewingTemplate.name" />
            </div>
            <footer class="preview-footer">
                <button class="btn-cancel" (click)="closePreview()">Volver</button>
                <button class="btn-select" (click)="useTemplate(previewingTemplate, $event)">
                    Utilizar esta plantilla
                </button>
            </footer>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      --accent-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      --glass-bg: rgba(15, 23, 42, 0.8);
      --glass-border: rgba(255, 255, 255, 0.1);
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
    }

    .template-gallery-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(12px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      animation: backdropFade 0.4s ease-out;
    }

    .template-gallery-container {
      width: 100%;
      max-width: 1400px;
      height: 90vh;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 2rem;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      animation: containerSlide 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Header */
    .gallery-header {
      padding: 2.5rem 3rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      background: linear-gradient(to bottom, rgba(255,255,255,0.03), transparent);
    }

    .gallery-title {
      font-size: 2.75rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      background: linear-gradient(to right, #fff, #94a3b8);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0;
    }

    .gallery-subtitle {
      color: var(--text-muted);
      font-size: 1.125rem;
      margin: 0.5rem 0 0;
    }

    .close-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--glass-border);
      width: 3rem;
      height: 3rem;
      border-radius: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .close-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.4);
      transform: rotate(90deg);
    }

    .close-icon {
      font-size: 1.75rem;
      color: white;
      font-style: normal;
    }

    /* Controls */
    .gallery-controls {
      padding: 0 3rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .search-wrapper {
      position: relative;
      max-width: 500px;
    }

    .search-icon {
      position: absolute;
      left: 1.25rem;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0.5;
    }

    .search-input {
      width: 100%;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--glass-border);
      border-radius: 1rem;
      padding: 0.875rem 1rem 0.875rem 3rem;
      color: white;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .search-input:focus {
      background: rgba(255, 255, 255, 0.07);
      border-color: #6366f1;
      outline: none;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    }

    .category-nav {
      display: flex;
      gap: 0.75rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }

    .category-nav::-webkit-scrollbar { height: 4px; }
    .category-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

    .category-tag {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid transparent;
      padding: 0.625rem 1.25rem;
      border-radius: 50px;
      color: var(--text-muted);
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .category-tag:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .category-tag.active {
      background: var(--primary-gradient);
      color: white;
      border-color: transparent;
      box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4);
    }

    /* Grid Area */
    .templates-scroll-area {
      flex: 1;
      overflow-y: auto;
      padding: 0 3rem 3rem;
    }

    .templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
    }

    /* Template Card */
    .template-card-premium {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--glass-border);
      border-radius: 1.5rem;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      opacity: 0;
      animation: cardFadeIn 0.5s ease forwards;
      animation-delay: calc(var(--index) * 0.05s);
    }

    .template-card-premium:hover {
      transform: translateY(-8px);
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);
    }

    .card-visual {
      position: relative;
      aspect-ratio: 16/10;
      overflow: hidden;
    }

    .template-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .template-card-premium:hover .template-img {
      transform: scale(1.1);
    }

    .card-overlay {
      position: absolute;
      inset: 0;
      background: rgba(15, 23, 42, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      backdrop-filter: blur(4px);
    }

    .template-card-premium:hover .card-overlay {
      opacity: 1;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 80%;
    }

    .btn-action {
      width: 100%;
      padding: 0.75rem;
      border-radius: 0.75rem;
      border: 1px solid transparent;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .btn-action.preview {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .btn-action.preview:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .btn-action.use {
      background: var(--primary-gradient);
      color: white;
    }

    .btn-action.use:hover {
      transform: scale(1.02);
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
    }

    .premium-badge-v2 {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: var(--accent-gradient);
      padding: 0.35rem 0.75rem;
      border-radius: 0.5rem;
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: white;
      box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
    }

    /* Card Content */
    .card-content {
      padding: 1.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }

    .template-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      margin: 0;
    }

    .popularity-rank {
      font-size: 0.875rem;
      color: #fbbf24;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .template-desc {
      font-size: 0.9375rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin: 0 0 1.5rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-footer {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .mini-tag {
      font-size: 0.75rem;
      color: #818cf8;
      font-weight: 600;
      margin-right: 0.5rem;
    }

    .author {
      font-size: 0.75rem;
      color: rgba(255,255,255,0.3);
    }

    /* Empty State */
    .empty-state-v2 {
      grid-column: 1 / -1;
      text-align: center;
      padding: 5rem 0;
      color: var(--text-muted);
    }

    .empty-art { font-size: 4rem; margin-bottom: 1.5rem; opacity: 0.5; }

    /* Modern Preview Modal */
    .modern-preview-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.85);
        backdrop-filter: blur(8px);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }

    .preview-card {
        background: #1e293b;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 1.5rem;
        width: 100%;
        max-width: 1100px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: previewZoom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .preview-header {
        padding: 1.25rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    .preview-header h3 { color: white; margin: 0; font-size: 1.25rem; }

    .icon-close {
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        opacity: 0.5;
        transition: opacity 0.3s;
    }

    .icon-close:hover { opacity: 1; }

    .preview-body {
        padding: 0;
        overflow-y: auto;
        background: #0f172a;
    }

    .preview-body img { width: 100%; display: block; }

    .preview-footer {
        padding: 1.5rem 2rem;
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        background: #1e293b;
        border-top: 1px solid rgba(255,255,255,0.05);
    }

    .btn-cancel, .btn-select {
        padding: 0.75rem 1.75rem;
        border-radius: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
    }

    .btn-cancel { background: rgba(255,255,255,0.05); color: white; border: none; }
    .btn-cancel:hover { background: rgba(255,255,255,0.1); }

    .btn-select { background: var(--primary-gradient); color: white; border: none; }
    .btn-select:hover { transform: scale(1.02); box-shadow: 0 0 20px rgba(99, 102, 241, 0.5); }

    /* Animations */
    @keyframes backdropFade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes containerSlide { from { transform: translateY(30px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
    @keyframes cardFadeIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes previewZoom { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

    @media (max-width: 768px) {
      .gallery-header { padding: 1.5rem 1.5rem 1rem; }
      .gallery-controls { padding: 0 1.5rem 1rem; }
      .templates-scroll-area { padding: 0 1.5rem 1.5rem; }
      .gallery-title { font-size: 1.75rem; }
    }
  `]
})
export class TemplateGalleryComponent implements OnInit {
  private templateService = inject(TemplateService);

  @Output() templateSelected = new EventEmitter<Template>();
  @Output() closed = new EventEmitter<void>();

  templates$!: Observable<Template[]>;
  categories$!: Observable<TemplateCategory[]>;

  filteredTemplates: Template[] = [];
  selectedCategory = 'all';
  searchQuery = '';
  previewingTemplate: Template | null = null;

  ngOnInit(): void {
    this.templates$ = this.templateService.templates$;
    this.categories$ = this.templateService.categories$;

    this.templateService.templates$.subscribe(templates => {
      this.filteredTemplates = templates;
    });
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.filterTemplates();
  }

  onSearch(): void {
    this.filterTemplates();
  }

  private filterTemplates(): void {
    let templates = this.templateService.getTemplates();

    // Filter by category
    if (this.selectedCategory && this.selectedCategory !== 'all') {
      templates = templates.filter(t => t.category === this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      templates = templates.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    this.filteredTemplates = templates;
  }

  selectTemplate(template: Template): void {
    this.templateService.selectTemplate(template);
  }

  previewTemplate(template: Template, event: Event): void {
    event.stopPropagation();
    this.previewingTemplate = template;
  }

  closePreview(): void {
    this.previewingTemplate = null;
  }

  useTemplate(template: Template, event: Event): void {
    event.stopPropagation();
    this.templateSelected.emit(template);
    this.closePreview();
  }

  onClose(): void {
    this.closed.emit();
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="24" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ETemplate Preview%3C/text%3E%3C/svg%3E';
  }
}
