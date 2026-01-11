import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() isCollapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();
  @Output() templateApplied = new EventEmitter<void>();

  templates: BusinessTemplate[] = [];
  categories: string[] = [];
  selectedCategory: string | null = null;
  selectedTemplate: BusinessTemplate | null = null;
  showConfirmation = false;

  constructor(
    private templateService: TemplateService,
    private variantService: VariantService
  ) {}

  ngOnInit() {
    this.templates = this.templateService.getAllTemplates();
    this.categories = [...new Set(this.templates.map(t => t.category))];
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
    this.showConfirmation = true;
  }

  applyTemplate() {
    if (!this.selectedTemplate) return;

    // Aplicar todas las configuraciones del template
    this.variantService.applyTemplate(this.selectedTemplate);
    
    this.showConfirmation = false;
    this.selectedTemplate = null;
    this.templateApplied.emit();
  }

  cancelSelection() {
    this.showConfirmation = false;
    this.selectedTemplate = null;
  }
}

