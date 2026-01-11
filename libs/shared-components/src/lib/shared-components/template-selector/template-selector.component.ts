import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateService, BusinessTemplate } from '../../../services/template.service';
import { VariantService } from '../../../services/variant.service';

@Component({
  selector: 'lib-template-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-selector.component.html',
  styleUrl: './template-selector.component.scss',
})
export class TemplateSelectorComponent implements OnInit {
  @Output() templateApplied = new EventEmitter<void>();

  showModal = false;
  templates: BusinessTemplate[] = [];
  categories: string[] = [];
  selectedCategory: string | null = null;
  selectedTemplate: BusinessTemplate | null = null;

  previousConfig: any = null;
  confirmed = false;

  constructor(
    private templateService: TemplateService,
    private variantService: VariantService
  ) {}

  ngOnInit() {
    this.templates = this.templateService.getAllTemplates();
    this.categories = [...new Set(this.templates.map(t => t.category))];
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
    if (!this.selectedCategory) {
      return this.templates;
    }
    return this.templates.filter(t => t.category === this.selectedCategory);
  }

  selectCategory(category: string | null) {
    this.selectedCategory = category;
  }

  selectTemplate(template: BusinessTemplate) {
    this.selectedTemplate = template;
    // Immediate preview
    this.variantService.applyTemplate(template);
  }

  applyTemplate() {
    if (!this.selectedTemplate) return;

    this.confirmed = true;
    
    // Cerrar modal y notificar (la configuración ya está aplicada por el preview)
    this.closeModal();
    this.templateApplied.emit();
  }

  cancelSelection() {
    this.selectedTemplate = null;
    // If we cancel selection, should we revert to previousConfig immediately?
    // Probably yes, to remove the preview.
    if (this.previousConfig) {
        this.variantService.applyTemplate(this.previousConfig);
    }
  }
}
