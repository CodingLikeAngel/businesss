import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
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
// import { TemplateSelectorComponent } from '../template-selector/template-selector.component';

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
    DesignEditorComponent
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
  get activeTab(): 'pages' | 'general' | 'structure' | 'explorer' | 'content' | 'design' | 'footer' {
    return this.uiStateService.activeTab || 'pages';
  }

  set activeTab(value: 'pages' | 'general' | 'structure' | 'explorer' | 'content' | 'design' | 'footer') {
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

  setActiveTab(tab: 'pages' | 'general' | 'structure' | 'explorer' | 'content' | 'design' | 'footer') {
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
    console.log('🎨 Style changed detected');
    
    if (this.selectedSection) {
      console.log('📦 Updating section styles:', this.selectedSection.styles);
      
      if (this.selectedSection.isGlobal) {
        this.updateGlobalConfigFromSelection();
      } else if (this.selectedSection && this.selectedSection.id) {
        // Ensure styles are properly merged
        const updatedSection = {
          ...this.selectedSection,
          styles: { ...this.selectedSection.styles }
        };
        
        // Update in service
        this.variantService.updateSectionInCurrentPage(this.selectedSection.id, updatedSection);
        
        // Trigger change detection by updating the observable
        this.uiStateService.selectSection(updatedSection);
      }
    } else if (this.selectedElement) {
      console.log('🔧 Updating element styles:', this.selectedElement.styles);
      this.syncElementBack();
    }
    
    // Force change detection
    setTimeout(() => {
      console.log('✅ Styles applied and change detection triggered');
    }, 0);
  }

  syncElementBack() {
    if (!this.selectedElement || !this.selectedElement._original) return;
    
    const content = this.selectedElement.content || {};
    const styles = this.selectedElement.styles || {};
    const variant = this.selectedElement.variant;
    const source = this.selectedElement._original;

    // Capture old variant for ngOnChanges
    const oldVariant = isNaN(Number(source.variant)) ? source.variant : source.variant?.(); // Handle potential signal
    const isSignal = typeof source.variant === 'function';

    // 1. Determine element context
    const isListItem = this.selectedElement.id.includes('_feature_') || 
                      this.selectedElement.id.includes('_stat_') || 
                      this.selectedElement.id.includes('_service_') ||
                      this.selectedElement.id.includes('_product_') ||
                      this.selectedElement.id.includes('_testimonial_') ||
                      this.selectedElement.id.includes('_faq_') ||
                      this.selectedElement.id.includes('_image_') ||
                      this.selectedElement.id.includes('_promo_') ||
                      this.selectedElement.id.includes('_card_') ||
                      this.selectedElement.id.includes('_list_') ||
                      this.selectedElement.id.includes('_step_') ||
                      this.selectedElement.id.includes('_tab_');
    
    const isTopLevelFieldMapper = ['title', 'subtitle', 'cta', 'form', 'contact', 'chart', 'header', 'footer', 'pricing', 'newsletter', 'steps', 'gallery', 'breadcrumbs', 'spinner'].includes(this.selectedElement.type);

    // 2. Apply updates to the source reference (crucial for items in arrays)
    if (content.title !== undefined) {
      source.title = content.title;
      if ('name' in source) source.name = content.title;
      if ('routeName' in source) source.routeName = content.title;
      if ('label' in source) source.label = content.title;
      if ('author' in source) source.author = content.title;
    }
    
    if (content.description !== undefined) {
      source.description = content.description;
      if ('quote' in source) source.quote = content.description;
      if ('text' in source) source.text = content.description;
    }

    if (content.subtitle !== undefined) {
      source.subtitle = content.subtitle;
      if ('value' in source) source.value = content.subtitle;
      if ('icon' in source) source.icon = content.subtitle;
    }

    if (content.image !== undefined) {
      source.image = content.image;
      if ('imageUrl' in source) source.imageUrl = content.image;
    }

    if (variant && !isSignal) {
      source.variant = variant;
    }

    source.styles = { ...(source.styles || {}), ...styles };
    if ('customStyles' in source) {
      source.customStyles = { ...(source.customStyles || {}), ...styles };
    }

    // 3. Handle observer notification and parent updates
    if (this.selectedElement['sectionId']) {
      const sectionId = this.selectedElement['sectionId'];
      const updates: any = {};
      
      // If editing a top-level property of the section (like section title), 
      // we need to tell the section specifically.
      if (!isListItem && isTopLevelFieldMapper && content) {
        updates.content = {};
        const keys = ['title', 'subtitle', 'description', 'text', 'label', 'link', 'image'];
        keys.forEach(key => {
          if (content[key] !== undefined) updates.content[key] = content[key];
        });
        if (variant) updates.content.variant = variant;
        
        // Map styles to the correct field (title -> titleStyles)
        if (styles && Object.keys(styles).length > 0) {
          const styleKey = this.selectedElement.type + 'Styles';
          updates.content[styleKey] = { ...(content[styleKey] || {}), ...styles };
        }
      }

      // If it's a section-level element (not in a list) but NOT a field mapper, 
      // it might be the section itself? No, section is handled in onStyleChanged.
      // But just in case, if there are styles and no content-specific mapping:
      if (!isListItem && !isTopLevelFieldMapper && styles) {
        updates.styles = styles;
      }

      // 4. Force global subject notification for components to trigger re-render
      if (isListItem) {
        if (this.selectedElement.id.includes('_stat_')) {
          const config = this.variantService.getCurrentStatsConfig();
          const index = config.items.findIndex(i => i === source);
          if (index !== -1) config.items[index] = { ...source };
          this.variantService.setStatsConfig(config);
        }
        if (this.selectedElement.id.includes('_feature_')) {
          const config = this.variantService.getCurrentFeaturesConfig();
          const index = config.items.findIndex(i => i === source);
          if (index !== -1) config.items[index] = { ...source };
          this.variantService.setFeaturesConfig(config);
        }
        if (this.selectedElement.id.includes('_service_')) {
          const config = this.variantService.getCurrentServiceCardsConfig();
          const index = config.items.findIndex(i => i === source);
          if (index !== -1) config.items[index] = { ...source };
          this.variantService.setServiceCardsConfig(config);
        }
        if (this.selectedElement.id.includes('_product_')) {
          const config = this.variantService.getCurrentProductsConfig();
          const index = config.items.findIndex(i => i === source);
          if (index !== -1) config.items[index] = { ...source };
          this.variantService.setProductsConfig(config);
        }
        if (this.selectedElement.id.includes('_testimonial_')) {
          const config = this.variantService.getCurrentTestimonialsConfig();
          const index = config.items.findIndex(i => i === source);
          if (index !== -1) config.items[index] = { ...source };
          this.variantService.setTestimonialsConfig(config);
        }
        if (this.selectedElement.id.includes('_faq_')) {
          const config = this.variantService.getCurrentFaqConfig();
          const index = config.items.findIndex(i => i === source);
          if (index !== -1) config.items[index] = { ...source };
          this.variantService.setFaqConfig(config);
        }
        if (this.selectedElement.id.includes('_image_')) {
          const config = this.variantService.getCurrentGalleryConfig();
          const index = config.images.findIndex(i => i === source);
          if (index !== -1) config.images[index] = { ...source };
          this.variantService.setGalleryConfig(config);
        }
        if (this.selectedElement.id.includes('_promo_')) {
          const config = this.variantService.getCurrentPromotionsConfig();
          const index = config.premiumCards.findIndex(i => i === source);
          if (index !== -1) config.premiumCards[index] = { ...source };
          this.variantService.setPromotionsConfig(config);
        }
        if (this.selectedElement.id.includes('_card_')) {
          const config = this.variantService.getCurrentHeroConfig();
          const index = config.navigationCards?.findIndex(i => i === source);
          if (index !== -1 && config.navigationCards) config.navigationCards[index] = { ...source };
          this.variantService.setHeroConfig(config);
        }
        // Generic list update for simpler structures if needed, but usually specific configs handle them.
        // For list, steps, tabs, they are often direct content arrays in the section which we might need to handle if not using a specific config service.
        // Assuming they are updated by reference in the section update logic if they are part of section.content['items'].

      }

      // Trigger section update (this re-emits the whole section list to observers)
      this.variantService.updateSection(sectionId, updates);
      
      if (variant && !isListItem) {
        this.variantService.setComponentVariant(sectionId, variant);
      }
      
      return;
    }

    // Fallback for global components or elements without sectionId
    if (source.ngOnChanges) {
      const changes: any = {};
      if (variant && oldVariant !== variant) {
        changes['variant'] = new SimpleChange(oldVariant, variant, false);
      }
      if (Object.keys(changes).length > 0) source.ngOnChanges(changes);
      if (source.cdr?.markForCheck) source.cdr.markForCheck();
      else if (source.changeDetectorRef?.markForCheck) source.changeDetectorRef.markForCheck();
    }

    const isGlobalElement = ['navbar', 'header', 'footer'].includes(this.selectedElement.id) || this.selectedElement.isGlobal;
    if (isGlobalElement) {
      if (this.selectedElement.type === 'header') this.variantService.setHeaderConfig(source);
      else if (this.selectedElement.type === 'footer') this.variantService.setFooterConfig(source);
      else if (this.selectedElement.type === 'navbar') this.variantService.setNavBarConfig(source);
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
    
    // Helper to clear overriding styles when applying a variant
    const clearManualStyles = (target: any) => {
      if (variantId !== 'default' && target.styles) {
        delete target.styles.backgroundColor;
        delete target.styles.color;
      }
    };

    if (this.selectedSection?.isGlobal) {
      this.selectedSection.content.variant = variantId;
      clearManualStyles(this.selectedSection);
      this.updateGlobalConfigFromSelection();
      this.onStyleChanged();
    } else if (this.selectedSection) {
      this.selectedSection.variant = variantId;
      clearManualStyles(this.selectedSection);
      this.variantService.setComponentVariant(this.selectedSection.id, variantId);
      this.onStyleChanged();
    } else if (this.selectedElement) {
      this.selectedElement.variant = variantId;
      clearManualStyles(this.selectedElement);
      this.syncElementBack();
      // Ensure the section variant mapping is also updated if sectionId is present
      if (this.selectedElement['sectionId']) {
        this.variantService.setComponentVariant(this.selectedElement['sectionId'], variantId);
      }
      this.onStyleChanged();
    }
  }
}