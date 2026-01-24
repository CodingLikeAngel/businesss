 import { Component, OnInit, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
 import { CommonModule, isPlatformBrowser } from '@angular/common';
 import { FormsModule } from '@angular/forms';
 import { trigger, state, style, transition, animate } from '@angular/animations';
 import { TemplateService, BusinessTemplate } from '../../../services/template.service';
 import { VariantService } from '../../../services/variant.service';

import { VariantTemplateService } from '../variant-selector/template.service';

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
  isDragging = false;
  dragStartX = 0;
  dragStartY = 0;
  dropdownPosition = { top: '50%', left: '50%' };
  isFullScreen = false;

  constructor(
    private templateService: TemplateService,
    private variantTemplateService: VariantTemplateService,
    private variantService: VariantService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    console.log('TemplateSelectorComponent constructor called');
  }

  // ... (ngOnInit remains largely same but uses this.variantTemplateService)

  ngOnInit() {
    // Load templates from Data Service
    const defaultTemplates = this.templateService.getAllTemplates();
    let customTemplates: BusinessTemplate[] = [];
    if (isPlatformBrowser(this.platformId)) {
      customTemplates = JSON.parse(localStorage.getItem('custom_templates') || '[]');
    }
    this.templates = [...defaultTemplates, ...customTemplates];
    this.categories = [...new Set(this.templates.map(t => t.category))];

    console.log('Template Selector initialized with templates:', this.templates.length);
    
    // Initialize drag functionality
    this.initDragFunctionality();
  }

  // ... 


  initDragFunctionality() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Wait for next tick to ensure DOM is ready
    setTimeout(() => {
      const dropdownElement = document.querySelector('.template-dropdown') as HTMLElement;
      if (!dropdownElement) return;

      const headerElement = dropdownElement.querySelector('.dropdown-header') as HTMLElement;
      if (!headerElement) return;

      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let currentX = 0;
      let currentY = 0;

      const onMouseDown = (e: MouseEvent) => {
        // Don't drag if clicking on buttons
        const target = e.target as HTMLElement;
        if (target.closest('.close-btn') || target.closest('.fullscreen-btn')) return;

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        // Get current transform values
        const style = window.getComputedStyle(dropdownElement);
        const matrix = new DOMMatrix(style.transform);
        currentX = matrix.m41; // translateX
        currentY = matrix.m42; // translateY

        headerElement.style.cursor = 'grabbing';
        e.preventDefault();
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging || this.isFullScreen) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        const newX = currentX + dx;
        const newY = currentY + dy;

        // Update position using transform for better performance
        dropdownElement.style.transform = `translate(calc(-50% + ${newX}px), calc(-50% + ${newY}px))`;
      };

      const onMouseUp = () => {
        if (isDragging) {
          isDragging = false;
          headerElement.style.cursor = 'move';
          
          // Update current position for next drag
          const style = window.getComputedStyle(dropdownElement);
          const matrix = new DOMMatrix(style.transform);
          currentX = matrix.m41;
          currentY = matrix.m42;
        }
      };

      headerElement.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      // Cleanup on component destroy
      this.cleanupDragListeners = () => {
        headerElement.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
    }, 100);
  }

  private cleanupDragListeners?: () => void;
  private modalElement?: HTMLElement;
  private originalParent?: HTMLElement;

  ngOnDestroy() {
    if (this.cleanupDragListeners) {
      this.cleanupDragListeners();
    }
    // Move modal back to original parent if needed
    if (this.modalElement && this.originalParent && this.modalElement.parentNode === document.body) {
      this.originalParent.appendChild(this.modalElement);
    }
  }

  toggleFullScreen() {
    this.isFullScreen = !this.isFullScreen;
    const dropdownElement = document.querySelector('.template-dropdown') as HTMLElement;
    if (dropdownElement) {
      if (this.isFullScreen) {
        dropdownElement.style.transform = 'none';
      } else {
        dropdownElement.style.transform = 'translate(-50%, -50%)';
      }
    }
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
    
    // Initialize drag and move modal to body after render
    setTimeout(() => {
      this.initDragFunctionality();
      
      // Move modal to body to escape parent overflow
      if (isPlatformBrowser(this.platformId)) {
        const modal = document.querySelector('.template-dropdown') as HTMLElement;
        if (modal && modal.parentElement) {
          this.modalElement = modal;
          this.originalParent = modal.parentElement as HTMLElement;
          // Move to body
          document.body.appendChild(modal);
        }
      }
    }, 50);
  }

  closeDropdown() {
    if (!this.confirmed && this.previousConfig) {
      // Revert to previous state using direct state injection
      // This assumes VariantService has a method to restore full state, or we manually restore parts
      // For now, let's try to restore global variant at least
      if (this.previousConfig.globalVariant) {
        this.variantService.setGlobalVariant(this.previousConfig.globalVariant);
      }
      // Ideally VariantService should have a restoreState(config) method
    }

    // Move modal back before hiding
    if (this.modalElement && this.originalParent && this.modalElement.parentNode === document.body) {
      this.originalParent.appendChild(this.modalElement);
    }

    this.showDropdown = false;
    this.selectedTemplate = null;
    this.selectedCategory = null;
    this.previewingTemplate = null;
    this.previousConfig = null;
    
    // Cleanup drag listeners
    if (this.cleanupDragListeners) {
      this.cleanupDragListeners();
      this.cleanupDragListeners = undefined;
    }
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
    this.previewingTemplate = null; 
    
    // Use the robust service to apply the template by ID
    const blueprintId = this.mapCategoryToBlueprint(template.category);
    
    if (blueprintId) {
        this.variantTemplateService.applyTemplate(blueprintId);
    }
    console.log('Template selected for application');
  }

  // ...

  previewTemplate(template: BusinessTemplate) {
     // Preview logic temporarily disabled for stability
     console.log('Preview feature coming soon');
  }

  // ...

  isPreviewing(template: BusinessTemplate): boolean {
    return this.previewingTemplate?.id === template.id;
  }

  // Helper to map UI categories to our hardcoded blueprints
  public mapCategoryToBlueprint(category: string): string | null {
      const lower = category.toLowerCase();
      if (lower.includes('deportes') || lower.includes('fitness') || lower.includes('gym')) return 'fitness';
      if (lower.includes('salud') || lower.includes('clinic') || lower.includes('médico')) return 'clinic';
      if (lower.includes('diseño') || lower.includes('arte') || lower.includes('agency') || lower.includes('marketing')) return 'agency';
      return null;
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
      await new Promise(resolve => setTimeout(resolve, 500));

      const blueprintId = this.mapCategoryToBlueprint(this.selectedTemplate.category);
      if (blueprintId) {
          this.variantTemplateService.applyTemplate(blueprintId);
      } else {
          console.warn('No blueprint found for category:', this.selectedTemplate.category);
      }

      this.confirmed = true;
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
