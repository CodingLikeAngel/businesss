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

  constructor(
    private templateService: TemplateService,
    private variantService: VariantService
  ) {}

  ngOnInit() {
    this.templates = this.templateService.getAllTemplates();
    this.categories = [...new Set(this.templates.map(t => t.category))];
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedTemplate = null;
    this.selectedCategory = null;
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
  }

  applyTemplate() {
    if (!this.selectedTemplate) return;

    // Aplicar todas las configuraciones del template
    this.variantService.applyTemplate(this.selectedTemplate);
    
    // Cerrar modal y notificar
    this.closeModal();
    this.templateApplied.emit();
    
    // Feedback visual opcional - podrías agregar una notificación aquí
  }

  cancelSelection() {
    this.selectedTemplate = null;
  }
}
