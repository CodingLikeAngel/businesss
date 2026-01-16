import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIInputComponent, InputOption, variants } from '@negocio/ui-components';
import {
  VariantService,
  HeaderConfig,
  FooterConfig,
  NavBarConfig,
  HeroConfig,
  BubbleConfig,
  CardConfig,
  TitleConfig,
  ServiceCardsConfig,
  FaqConfig,
  PricingConfig,
  PromotionsConfig,
  GalleryConfig,
  ProductsConfig,
  TestimonialsConfig
} from '../../../services/variant.service';

// Import subcomponents
import { PageManagementComponent } from './page-management.component';
import { SectionStructureComponent } from './section-structure.component';
import { ComponentExplorerComponent } from './component-explorer.component';
import { TemplateSelectorComponent } from '../template-selector/template-selector.component';

// Import services
import { ConfigurationService } from './configuration.service';
import { UiStateService } from './ui-state.service';
import { TemplateService } from './template.service';
import { ExportService } from './export.service';

@Component({
  selector: 'lib-variant-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UIInputComponent,
    PageManagementComponent,
    SectionStructureComponent,
    ComponentExplorerComponent,
    TemplateSelectorComponent
  ],
  templateUrl: './variant-selector.component.html',
  styleUrl: './variant-selector.component.scss',
})
export class VariantSelectorComponent implements OnInit {
  // Core properties
  globalVariant: string;
  selectorVariant = 'glass';

  // UI state
  private _currentStep: 'welcome' | 'editor' | 'preview' = 'welcome';
  get currentStep(): 'welcome' | 'editor' | 'preview' {
    return this._currentStep;
  }
  set currentStep(val: 'welcome' | 'editor' | 'preview') {
    this._currentStep = val;
  }

  @Input() isCollapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  // UI State getters/setters
  get activeTab(): 'general' | 'structure' | 'explorer' | 'content' | 'design' | 'footer' {
    return this.uiStateService.activeTab || 'general';
  }

  set activeTab(value: 'general' | 'structure' | 'explorer' | 'content' | 'design' | 'footer') {
    this.uiStateService.activeTab = value;
  }

  // Options for global variant
  variantOptions: InputOption[] = variants.map((variant) => ({
    value: variant,
    label: variant.charAt(0).toUpperCase() + variant.slice(1),
  }));

  constructor(
    private variantService: VariantService,
    private configurationService: ConfigurationService,
    private uiStateService: UiStateService,
    private templateService: TemplateService,
    private exportService: ExportService
  ) {
    this.globalVariant = this.variantService.getVariantForComponent('global');
  }

  setActiveTab(tab: 'general' | 'structure' | 'explorer' | 'content' | 'design' | 'footer') {
    this.uiStateService.setActiveTab(tab);
  }

  resetConfiguration() {
    this.configurationService.resetConfiguration();
  }

  onTemplateApplied() {
    this.templateService.onTemplateApplied();
  }

  // Event handlers for subcomponents
  onPageSelected(pageId: string) {
    // Handle page selection if needed
  }

  onAddSection() {
    this.activeTab = 'explorer';
  }

  onComponentSelected(event: any) {
    this.activeTab = 'structure';
  }

  ngOnInit() {
    this.variantService.globalVariant$.subscribe((variant) => {
      this.globalVariant = variant;
    });

    this.variantService.builderStep$.subscribe((step) => {
      this.currentStep = step;
    });
  }

  setStep(step: 'welcome' | 'editor' | 'preview') {
    this.currentStep = step;

    // Fix NG0100: Defer the service update to the next macrotask
    setTimeout(() => {
      // Allow the layout to know exactly which step we are in
      this.variantService.setBuilderStep(step);
    });
  }

  isStep(step: string): boolean {
    return this.currentStep === step;
  }

  onGlobalVariantChange() {
    this.configurationService.setGlobalVariant(this.globalVariant);
    // When changing the global variant manually, we want it to apply everywhere,
    // so we clear specific component overrides that might block it.
    this.configurationService.clearAllComponentVariants();
  }

  clearComponentVariants() {
    this.configurationService.clearAllComponentVariants();
  }

  exportProject() {
    this.exportService.exportProject();
  }

  saveAsCustomTemplate() {
    this.templateService.saveAsCustomTemplate();
  }
}