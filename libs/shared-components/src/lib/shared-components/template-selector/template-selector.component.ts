 import { Component, OnInit, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TemplateService, BusinessTemplate } from '../../../services/template.service';
import { VariantService } from '../../../services/variant.service';

@Component({
  selector: 'lib-template-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './template-selector.component.html',
  styleUrl: './template-selector.component.scss',
})
export class TemplateSelectorComponent implements OnInit {
  @Output() templateApplied = new EventEmitter<void>();

  showModal = false;
  templates: BusinessTemplate[] = [];
  filteredTemplates: BusinessTemplate[] = [];
  categories: string[] = [];
  selectedCategory: string | null = null;
  selectedTemplate: BusinessTemplate | null = null;
  searchQuery = '';

  previousConfig: any = null;
  confirmed = false;

  constructor(
    private templateService: TemplateService,
    private variantService: VariantService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    const defaultTemplates = this.templateService.getAllTemplates();
    let customTemplates: BusinessTemplate[] = [];
    if (isPlatformBrowser(this.platformId)) {
      customTemplates = JSON.parse(localStorage.getItem('custom_templates') || '[]');
    }
    this.templates = [...defaultTemplates, ...customTemplates];
    this.filteredTemplates = [...this.templates];
    this.categories = [...new Set(this.templates.map(t => t.category))];

    console.log('Template Selector initialized with templates:', this.templates.length);
    console.log('Categories:', this.categories);
  }

  openModal() {
    this.previousConfig = this.variantService.getFullConfig();
    this.confirmed = false;
    this.showModal = true;
  }

  closeModal() {
    if (!this.confirmed && this.previousConfig) {
      this.variantService.applyTemplate(this.previousConfig);
    }
    
    this.showModal = false;
    this.selectedTemplate = null;
    this.selectedCategory = null;
    this.previousConfig = null;
  }

  getTemplatesByCategory(): BusinessTemplate[] {
    let filtered = this.templates;

    // Filter by category
    if (this.selectedCategory) {
      filtered = filtered.filter(t => t.category === this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  onSearchInput(event: any) {
    this.searchQuery = event.target.value;
  }

  clearSearch() {
    this.searchQuery = '';
  }

  selectCategory(category: string | null) {
    this.selectedCategory = category;
  }

  selectTemplate(template: BusinessTemplate) {
    console.log('Template selected:', template.name);
    this.selectedTemplate = template;
    // Apply template for live preview
    this.variantService.applyTemplate(template);
    console.log('Template applied for preview');
  }

  applyTemplate() {
    console.log('Apply template clicked');
    if (!this.selectedTemplate) {
      console.log('No template selected');
      return;
    }

    console.log('Applying template:', this.selectedTemplate.name);
    this.confirmed = true;

    // Cerrar modal y notificar (la configuración ya está aplicada por el preview)
    this.closeModal();
    this.templateApplied.emit();
    console.log('Template applied successfully');
  }

  cancelSelection() {
    this.selectedTemplate = null;
    // If we cancel selection, should we revert to previousConfig immediately?
    // Probably yes, to remove the preview.
    if (this.previousConfig) {
        this.variantService.applyTemplate(this.previousConfig);
    }
  }

  getHeroBackground(hero: any): string {
    if (hero.videoBackground && hero.videoPoster) {
      return `url(${hero.videoPoster})`;
    }
    return 'linear-gradient(135deg, rgba(113, 255, 219, 0.1), rgba(0, 255, 255, 0.05))';
  }
}
