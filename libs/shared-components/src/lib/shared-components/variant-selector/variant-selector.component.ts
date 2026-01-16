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
import { ContentEditorComponent } from './content-editor.component';
import { DesignEditorComponent } from './design-editor.component';
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
    ContentEditorComponent,
    DesignEditorComponent,
    TemplateSelectorComponent
  ],
  templateUrl: './variant-selector.component.html',
  styleUrl: './variant-selector.component.scss',
})
export class VariantSelectorComponent implements OnInit {
  // Core properties
  globalVariant: string;
  selectorVariant = 'glass';

  // Selected items for content/design editing
  // Selected items synced with UiStateService
  get selectedElement() { return this.uiStateService.selectedElement; }
  get selectedSection() { return this.uiStateService.selectedSection; }

  // Global configs
  headerConfig: HeaderConfig;
  footerConfig: FooterConfig;
  navBarConfig: NavBarConfig;
  heroConfig: HeroConfig;
  bubbleConfig: BubbleConfig;
  cardConfig: CardConfig;
  titleConfig: TitleConfig;
  serviceCardsConfig: ServiceCardsConfig;
  faqConfig: FaqConfig;
  pricingConfig: PricingConfig;
  promotionsConfig: PromotionsConfig;
  galleryConfig: GalleryConfig;
  productsConfig: ProductsConfig;
  testimonialsConfig: TestimonialsConfig;
  statsConfig: any;

  // UI state
  private _currentStep: 'welcome' | 'editor' | 'preview' = 'welcome';
  mockElement: any;
  mockSection: any;
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
    this.headerConfig = this.variantService.getCurrentHeaderConfig();
    this.footerConfig = this.variantService.getCurrentFooterConfig();
    this.navBarConfig = this.variantService.getCurrentNavBarConfig();
    this.heroConfig = this.variantService.getCurrentHeroConfig();
    this.bubbleConfig = this.variantService.getCurrentBubbleConfig();
    this.cardConfig = this.variantService.getCurrentCardConfig();
    this.titleConfig = this.variantService.getCurrentTitleConfig();
    this.serviceCardsConfig = this.variantService.getCurrentServiceCardsConfig();
    this.faqConfig = this.variantService.getCurrentFaqConfig();
    this.pricingConfig = this.variantService.getCurrentPricingConfig();
    this.promotionsConfig = this.variantService.getCurrentPromotionsConfig();
    this.galleryConfig = this.variantService.getCurrentGalleryConfig();
    this.productsConfig = this.variantService.getCurrentProductsConfig();
    this.testimonialsConfig = this.variantService.getCurrentTestimonialsConfig();
    this.statsConfig = this.variantService.getCurrentStatsConfig();
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

  onElementSelected(element: any) {
    this.uiStateService.selectElement(element);
  }

  onSectionSelected(section: any) {
    // Create a copy to edit, ensuring content object exists
    const sectionCopy = {
      ...section,
      content: { ...(section.content || {}) },
      styles: { ...(section.styles || {}) }
    };
    
    // Ensure common keys exist
    const commonKeys = ['title', 'subtitle', 'description', 'text', 'link', 'image'];
    commonKeys.forEach(key => {
      if (sectionCopy.content[key] === undefined) {
         sectionCopy.content[key] = '';
      }
    });

    if (Object.keys(sectionCopy.content).length === 0) {
      sectionCopy.content.title = sectionCopy.label || 'Nueva Sección';
    }
    
    this.uiStateService.selectSection(sectionCopy);
  }

  

  ngOnInit() {
    this.variantService.globalVariant$.subscribe((variant) => {
      this.globalVariant = variant;
    });

    this.variantService.builderStep$.subscribe((step) => {
      this.currentStep = step;
    });

    this.variantService.headerConfig$.subscribe(c => this.headerConfig = c);
    this.variantService.footerConfig$.subscribe(c => this.footerConfig = c);
    this.variantService.navBarConfig$.subscribe(c => this.navBarConfig = c);
    this.variantService.heroConfig$.subscribe(c => this.heroConfig = c);
    this.variantService.bubbleConfig$.subscribe(c => this.bubbleConfig = c);
    this.variantService.cardConfig$.subscribe(c => this.cardConfig = c);
    this.variantService.titleConfig$.subscribe(c => this.titleConfig = c);
    this.variantService.serviceCardsConfig$.subscribe(c => this.serviceCardsConfig = c);
    this.variantService.faqConfig$.subscribe(c => this.faqConfig = c);
    this.variantService.pricingConfig$.subscribe(c => this.pricingConfig = c);
    this.variantService.promotionsConfig$.subscribe(c => this.promotionsConfig = c);
    this.variantService.galleryConfig$.subscribe(c => this.galleryConfig = c);
    this.variantService.productsConfig$.subscribe(c => this.productsConfig = c);
    this.variantService.testimonialsConfig$.subscribe(c => this.testimonialsConfig = c);
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

  // Content and Design Editor event handlers
  onContentChanged() {
    if (this.selectedSection) {
      if (this.selectedSection.isGlobal) {
        this.updateGlobalConfigFromSelection();
      } else if (this.selectedSection && this.selectedSection.id) {
        this.variantService.updateSectionInCurrentPage(this.selectedSection.id, this.selectedSection);
      }
    } else if (this.selectedElement) {
      this.syncElementBack();
    }
  }

  onStyleChanged() {
    if (this.selectedSection) {
      if (this.selectedSection.isGlobal) {
        this.updateGlobalConfigFromSelection();
      } else if (this.selectedSection && this.selectedSection.id) {
        this.variantService.updateSectionInCurrentPage(this.selectedSection.id, this.selectedSection);
      }
    } else if (this.selectedElement) {
      this.syncElementBack();
    }
  }

  syncElementBack() {
    if (!this.selectedElement || !this.selectedElement._original) return;
    
    const source = this.selectedElement._original;
    const content = this.selectedElement.content;
    const styles = this.selectedElement.styles;

    // Apply styles
    source.styles = { ...(source.styles || {}), ...styles };
    if (this.selectedElement.variant) {
      source.variant = this.selectedElement.variant;
    }

    // Map content back to original fields based on what was normalized
    if (content.title !== undefined) {
      if ('name' in source) source.name = content.title;
      if ('routeName' in source) source.routeName = content.title;
      if ('label' in source) source.label = content.title;
      if ('author' in source) source.author = content.title;
      if ('title' in source) source.title = content.title;
    }
    
    if (content.description !== undefined) {
      if ('description' in source) source.description = content.description;
      if ('quote' in source) source.quote = content.description;
      if ('text' in source) source.text = content.description;
    }

    if (content.subtitle !== undefined) {
      if ('value' in source) source.value = content.subtitle;
      if ('icon' in source) source.icon = content.subtitle;
    }

    if (content.image !== undefined) {
      if ('image' in source) source.image = content.image;
      if ('imageUrl' in source) source.imageUrl = content.image;
    }

    if (content.link !== undefined) {
      if ('link' in source) source.link = content.link;
    }

    // Force save to local storage
    this.variantService.saveToLocalStorage();

    // Check if we are updating a global component and trigger specific update
    // Only update global configs if the selected element is actually the global instance (identified by specific IDs)
    const isGlobalElement = ['navbar', 'header', 'footer'].includes(this.selectedElement.id);
    
    if (isGlobalElement) {
      if (this.selectedElement.type === 'header') {
        this.variantService.setHeaderConfig(source);
      } else if (this.selectedElement.type === 'footer') {
        this.variantService.setFooterConfig(source);
      } else if (this.selectedElement.type === 'navbar') {
        this.variantService.setNavBarConfig(source);
      }
    }
  }

  updateGlobalConfigFromSelection() {
    const type = this.selectedSection.type;
    const content = this.selectedSection.content;
    const styles = this.selectedSection.styles;

    switch (type) {
      case 'header': this.variantService.setHeaderConfig({ ...content, customStyles: styles }); break;
      case 'footer': this.variantService.setFooterConfig({ ...content, customStyles: styles }); break;
      case 'navBar': this.variantService.setNavBarConfig({ ...content, customStyles: styles }); break;
      case 'hero': this.variantService.setHeroConfig({ ...content, customStyles: styles }); break;
      case 'bubble': this.variantService.setBubbleConfig({ ...content, customStyles: styles }); break;
      case 'card': this.variantService.setCardConfig({ ...content, customStyles: styles }); break;
      case 'title': this.variantService.setTitleConfig({ ...content, customStyles: styles }); break;
    }
  }

  selectGlobalComponent(type: string) {
    let config: any;
    let label: string;

    switch (type) {
      case 'header': config = this.headerConfig; label = 'Cabecera'; break;
      case 'footer': config = this.footerConfig; label = 'Pie de Página'; break;
      case 'navBar': config = this.navBarConfig; label = 'Barra de Navegación'; break;
      case 'hero': config = this.heroConfig; label = 'Portada Hero'; break;
      case 'bubble': config = this.bubbleConfig; label = 'Efecto Burbujas'; break;
      case 'card': config = this.cardConfig; label = 'Configuración de Tarjetas'; break;
      case 'title': config = this.titleConfig; label = 'Configuración de Títulos'; break;
      default: return;
    }

    this.uiStateService.selectSection({
      id: `global_${type}`,
      type: type,
      label: label,
      content: config ? { ...config } : {},
      styles: config?.customStyles ? { ...config.customStyles } : {},
      isGlobal: true
    });
  }

  onVariantApplied(variantId: string) {
    console.log('Variant applied:', variantId);
    if (this.selectedSection?.isGlobal) {
      this.selectedSection.content.variant = variantId;
      this.updateGlobalConfigFromSelection();
    } else if (this.selectedSection) {
      this.selectedSection.variant = variantId;
      this.variantService.setComponentVariant(this.selectedSection.id, variantId);
    } else if (this.selectedElement) {
      this.selectedElement.variant = variantId;
      this.syncElementBack();
    }
  }
}