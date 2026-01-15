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
    <div class="template-gallery">
      <!-- Header -->
      <div class="gallery-header">
        <h2 class="gallery-title">Choose a Template</h2>
        <p class="gallery-subtitle">Start with a professional design and customize it to your needs</p>
        <button class="close-btn" (click)="onClose()" aria-label="Close gallery">
          <span class="close-icon">×</span>
        </button>
      </div>

      <!-- Category Filter -->
      <div class="category-filter">
        <button
          *ngFor="let category of categories$ | async"
          class="category-btn"
          [class.active]="selectedCategory === category.id"
          (click)="selectCategory(category.id)"
        >
          <span class="category-icon">{{ category.icon }}</span>
          <span class="category-name">{{ category.name }}</span>
        </button>
      </div>

      <!-- Search Bar -->
      <div class="search-container">
        <input
          type="text"
          class="search-input"
          placeholder="Search templates..."
          [(ngModel)]="searchQuery"
          (input)="onSearch()"
        />
        <span class="search-icon">🔍</span>
      </div>

      <!-- Templates Grid -->
      <div class="templates-grid">
        <div
          *ngFor="let template of filteredTemplates"
          class="template-card"
          [class.premium]="template.premium"
          (click)="selectTemplate(template)"
        >
          <!-- Thumbnail -->
          <div class="template-thumbnail">
            <img
              [src]="template.thumbnail"
              [alt]="template.name"
              (error)="onImageError($event)"
            />
            <div class="template-overlay">
              <button class="preview-btn" (click)="previewTemplate(template, $event)">
                <span>👁️</span> Preview
              </button>
              <button class="use-btn" (click)="useTemplate(template, $event)">
                <span>✨</span> Use Template
              </button>
            </div>
            <span *ngIf="template.premium" class="premium-badge">Premium</span>
          </div>

          <!-- Info -->
          <div class="template-info">
            <h3 class="template-name">{{ template.name }}</h3>
            <p class="template-description">{{ template.description }}</p>
            <div class="template-meta">
              <span class="template-popularity">
                ⭐ {{ template.popularity }}%
              </span>
              <span class="template-author">by {{ template.author }}</span>
            </div>
            <div class="template-tags">
              <span *ngFor="let tag of template.tags" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredTemplates.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No templates found</h3>
          <p>Try adjusting your search or category filter</p>
        </div>
      </div>

      <!-- Preview Modal -->
      <div *ngIf="previewingTemplate" class="preview-modal" (click)="closePreview()">
        <div class="preview-content" (click)="$event.stopPropagation()">
          <button class="preview-close" (click)="closePreview()">×</button>
          <img
            [src]="previewingTemplate.preview"
            [alt]="previewingTemplate.name"
            class="preview-image"
          />
          <div class="preview-actions">
            <button class="btn-secondary" (click)="closePreview()">Close</button>
            <button class="btn-primary" (click)="useTemplate(previewingTemplate, $event)">
              Use This Template
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .template-gallery {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      z-index: 1000;
      overflow-y: auto;
      padding: 2rem;
    }

    .gallery-header {
      text-align: center;
      color: white;
      margin-bottom: 3rem;
      position: relative;
    }

    .gallery-title {
      font-size: 3rem;
      font-weight: 800;
      margin: 0 0 0.5rem 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .gallery-subtitle {
      font-size: 1.25rem;
      opacity: 0.9;
      margin: 0;
    }

    .close-btn {
      position: absolute;
      top: -1rem;
      right: 0;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(90deg);
    }

    .close-icon {
      font-size: 2rem;
      color: white;
      line-height: 1;
    }

    .category-filter {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 2rem;
    }

    .category-btn {
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid transparent;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .category-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }

    .category-btn.active {
      background: white;
      color: #667eea;
      border-color: white;
    }

    .category-icon {
      font-size: 1.25rem;
    }

    .search-container {
      max-width: 600px;
      margin: 0 auto 3rem;
      position: relative;
    }

    .search-input {
      width: 100%;
      padding: 1rem 3rem 1rem 1.5rem;
      border: none;
      border-radius: 50px;
      font-size: 1rem;
      background: white;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .search-icon {
      position: absolute;
      right: 1.5rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.25rem;
    }

    .templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .template-card {
      background: white;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .template-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .template-thumbnail {
      position: relative;
      aspect-ratio: 16 / 10;
      overflow: hidden;
      background: #f0f0f0;
    }

    .template-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .template-card:hover .template-thumbnail img {
      transform: scale(1.05);
    }

    .template-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .template-card:hover .template-overlay {
      opacity: 1;
    }

    .preview-btn,
    .use-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 50px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .preview-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid white;
    }

    .preview-btn:hover {
      background: white;
      color: #667eea;
    }

    .use-btn {
      background: #667eea;
      color: white;
    }

    .use-btn:hover {
      background: #5568d3;
      transform: scale(1.05);
    }

    .premium-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-size: 0.875rem;
      font-weight: 700;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .template-info {
      padding: 1.5rem;
    }

    .template-name {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      color: #2d3748;
    }

    .template-description {
      color: #718096;
      margin: 0 0 1rem 0;
      line-height: 1.6;
    }

    .template-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }

    .template-popularity {
      color: #f6ad55;
      font-weight: 600;
    }

    .template-author {
      color: #a0aec0;
    }

    .template-tags {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .tag {
      background: #edf2f7;
      color: #4a5568;
      padding: 0.25rem 0.75rem;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem 2rem;
      color: white;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 2rem;
      margin: 0 0 0.5rem 0;
    }

    .empty-state p {
      font-size: 1.125rem;
      opacity: 0.8;
    }

    .preview-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .preview-content {
      background: white;
      border-radius: 1rem;
      max-width: 1200px;
      max-height: 90vh;
      overflow: auto;
      position: relative;
    }

    .preview-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 2rem;
      cursor: pointer;
      z-index: 10;
    }

    .preview-image {
      width: 100%;
      display: block;
    }

    .preview-actions {
      padding: 2rem;
      display: flex;
      gap: 1rem;
      justify-content: center;
      background: #f7fafc;
    }

    .btn-secondary,
    .btn-primary {
      padding: 1rem 2rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-secondary {
      background: #e2e8f0;
      color: #2d3748;
    }

    .btn-secondary:hover {
      background: #cbd5e0;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5568d3;
    }

    @media (max-width: 768px) {
      .template-gallery {
        padding: 1rem;
      }

      .gallery-title {
        font-size: 2rem;
      }

      .templates-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .category-filter {
        gap: 0.5rem;
      }

      .category-btn {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      }
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
