 import { Component, OnInit, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
 import { CommonModule, isPlatformBrowser } from '@angular/common';
 import { FormsModule } from '@angular/forms';
 import { trigger, state, style, transition, animate } from '@angular/animations';
 import { TemplateService, BusinessTemplate } from '../../../services/template.service';
 import { VariantService } from '../../../services/variant.service';

@Component({
  selector: 'lib-template-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './template-selector.component.html',
  styleUrl: './template-selector.component.scss',
  animations: [
    trigger('dropdownAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-10px) scale(0.95)'
      })),
      state('*', style({
        opacity: 1,
        transform: 'translateY(0) scale(1)'
      })),
      transition('void <=> *', animate('200ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ])
  ]
})
export class TemplateSelectorComponent implements OnInit {
  @Output() templateApplied = new EventEmitter<void>();

  showDropdown = false;
  templates: BusinessTemplate[] = [];
  categories: string[] = [];
  selectedCategory: string | null = null;
  selectedTemplate: BusinessTemplate | null = null;
  searchQuery = '';
  isApplying = false;
  previewingTemplate: BusinessTemplate | null = null;

  previousConfig: any = null;
  confirmed = false;

  constructor(
    private templateService: TemplateService,
    private variantService: VariantService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    console.log('TemplateSelectorComponent constructor called');
  }

  ngOnInit() {
    const defaultTemplates = this.templateService.getAllTemplates();
    let customTemplates: BusinessTemplate[] = [];
    if (isPlatformBrowser(this.platformId)) {
      customTemplates = JSON.parse(localStorage.getItem('custom_templates') || '[]');
    }
    this.templates = [...defaultTemplates, ...customTemplates];
    this.categories = [...new Set(this.templates.map(t => t.category))];

    console.log('Template Selector initialized with templates:', this.templates.length);
    console.log('Categories:', this.categories);
    console.log('Templates:', this.templates.map(t => ({ name: t.name, category: t.category })));
  }

  toggleDropdown() {
    if (this.showDropdown) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown() {
    this.previousConfig = this.variantService.getFullConfig();
    this.confirmed = false;
    this.showDropdown = true;
  }

  closeDropdown() {
    if (!this.confirmed && this.previousConfig) {
      this.variantService.applyTemplate(this.previousConfig);
    }

    this.showDropdown = false;
    this.selectedTemplate = null;
    this.selectedCategory = null;
    this.previewingTemplate = null;
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
    this.previewingTemplate = null; // Clear preview when selecting
    // Apply template for live preview
    this.variantService.applyTemplate(template);
    console.log('Template applied for preview');
  }

  previewTemplate(template: BusinessTemplate) {
    if (this.previewingTemplate?.id === template.id) {
      // Stop previewing
      this.previewingTemplate = null;
      if (this.selectedTemplate) {
        this.variantService.applyTemplate(this.selectedTemplate);
      } else if (this.previousConfig) {
        this.variantService.applyTemplate(this.previousConfig);
      }
    } else {
      // Start previewing
      this.previewingTemplate = template;
      this.variantService.applyTemplate(template);
    }
  }

  isPreviewing(template: BusinessTemplate): boolean {
    return this.previewingTemplate?.id === template.id;
  }

  async applyTemplate() {
    console.log('Apply template clicked');
    if (!this.selectedTemplate) {
      console.log('No template selected');
      return;
    }

    console.log('Applying template:', this.selectedTemplate.name);
    this.isApplying = true;

    try {
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      this.confirmed = true;

      // Close dropdown and notify
      this.closeDropdown();
      this.templateApplied.emit();
      console.log('Template applied successfully');
    } catch (error) {
      console.error('Error applying template:', error);
    } finally {
      this.isApplying = false;
    }
  }

  cancelSelection() {
    this.selectedTemplate = null;
    this.previewingTemplate = null;
    // Revert to previous config to remove any preview
    if (this.previousConfig) {
      this.variantService.applyTemplate(this.previousConfig);
    }
  }

  get filteredTemplates(): BusinessTemplate[] {
    return this.getTemplatesByCategory();
  }

  getHeroBackground(hero: any): string {
    if (hero.videoBackground && hero.videoPoster) {
      return `url(${hero.videoPoster})`;
    }
    return 'linear-gradient(135deg, rgba(113, 255, 219, 0.1), rgba(0, 255, 255, 0.05))';
  }

  trackByTemplate(index: number, template: BusinessTemplate): string {
    return template.id;
  }
}
