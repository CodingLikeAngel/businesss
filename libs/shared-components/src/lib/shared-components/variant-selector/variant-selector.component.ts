import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  UIInputComponent, 
  InputOption, 
  variants,
  UIHeroSectionComponent,
  UIFeaturesSectionComponent,
  UICardRutasComponent,
  UITestimonialsSectionComponent,
  UIPricingTableSectionComponent,
  UINewsletterSectionComponent,
  UIFaqSectionComponent,
  UIGallerySectionComponent,
  UIStatsLibSectionComponent,
  UIContactSectionComponent,
  UICardAnimatedComponent,
  BubbleAnimationComponent,
  UIStepsSectionComponent,
  UIHeaderComponent,
  UIFooterComponent
} from '@negocio/ui-components';
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
  TestimonialsConfig,
  PageSection
} from '../../../services/variant.service';
import { TemplateSelectorComponent } from '../template-selector/template-selector.component';
import { PreviewDataService } from './preview-data.service';
import { ItemManagementService } from './item-management.service';
import { DragDropService } from './drag-drop.service';

@Component({
  selector: 'lib-variant-selector',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    UIInputComponent, 
    TemplateSelectorComponent,
    UIHeroSectionComponent,
    UIFeaturesSectionComponent,
    UICardRutasComponent,
    UITestimonialsSectionComponent,
    UIPricingTableSectionComponent,
    UINewsletterSectionComponent,
    UIFaqSectionComponent,
    UIGallerySectionComponent,
    UIStatsLibSectionComponent,
    UIContactSectionComponent,
    UICardAnimatedComponent,
    BubbleAnimationComponent,
    UIStepsSectionComponent,
    UIHeaderComponent,
    UIFooterComponent
  ],
  templateUrl: './variant-selector.component.html',
  styleUrl: './variant-selector.component.scss',
})
export class VariantSelectorComponent implements OnInit {
  variants = [...variants];
  globalVariant: string;
  selectorVariant = 'glass';
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
  
  private _currentStep: 'welcome' | 'editor' | 'preview' = 'welcome';
  get currentStep(): 'welcome' | 'editor' | 'preview' {
    return this._currentStep;
  }
  set currentStep(val: 'welcome' | 'editor' | 'preview') {
    this._currentStep = val;
  }

  @Input() isCollapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  activeTab: 'general' | 'structure' | 'explorer' | 'content' | 'design' | 'footer' = 'general';

  // Drag and Drop state getters
  get draggedSectionIndex(): number | null {
    return this.dragDropService.draggedSectionIndex;
  }

  get overSectionIndex(): number | null {
    return this.dragDropService.overSectionIndex;
  }
  
  // Sections state
  sections: PageSection[] = [];
  
  // Modal state for editing items
  showItemModal = false;
  modalItemType: 'service' | 'product' | 'testimonial' | 'faq' | 'gallery' | 'pricing' | 'promotion' | 'navItem' | 'navLink' | 'footerLink' | 'socialIcon' | null = null;
  editingItem: any = null;
  editingIndex: number = -1;

  showHeaderConfig = false;
  showFooterConfig = false;
  showNavBarConfig = false;
  showHeroConfig = false;
  showBubbleConfig = false;
  showCardConfig = false;
  showTitleConfig = false;
  showFaqConfig = false;
  showPricingConfig = false;
  showPromotionsConfig = false;
  showGalleryConfig = false;
  showProductsConfig = false;
  // Removed duplicate showProductsConfig
  componentVariants: { [key: string]: string } = {};

  availableSectionVariants = [
    { type: 'hero', label: 'Portada Hero', icon: '🚀', variants: this.variants },
    { type: 'features', label: 'Características', icon: '✨', variants: this.variants },
    { type: 'services', label: 'Servicios', icon: '🛠️', variants: this.variants },
    { type: 'products', label: 'Productos', icon: '🧩', variants: this.variants },
    { type: 'testimonials', label: 'Testimonios', icon: '⭐', variants: this.variants },
    { type: 'pricing', label: 'Precios', icon: '💰', variants: this.variants },
    { type: 'promotions', label: 'Ofertas', icon: '🎁', variants: this.variants },
    { type: 'faq', label: 'Preguntas', icon: '❓', variants: this.variants },
    { type: 'gallery', label: 'Galería', icon: '🖼️', variants: this.variants },
    { type: 'stats', label: 'Estadísticas', icon: '📈', variants: this.variants },
    { type: 'contact', label: 'Contacto', icon: '📞', variants: this.variants },
    { type: 'bubble', label: 'Efecto Burbujas', icon: '🫧', variants: this.variants },
    { type: 'steps', label: 'Pasos', icon: '👣', variants: this.variants },
    { type: 'header', label: 'Cabecera', icon: '🔝', variants: this.variants },
    { type: 'footer', label: 'Pie de Página', icon: '⧉', variants: this.variants },
  ];

  selectedExplorerComponent: any = null;
  selectedExplorerVariant: any = 'glass';

  // Getters for default data from service
  get defaultTestimonials() { return this.previewDataService.getDefaultTestimonials(); }
  get defaultServices() { return this.previewDataService.getDefaultServices(); }
  get defaultProducts() { return this.previewDataService.getDefaultProducts(); }
  get defaultFaq() { return this.previewDataService.getDefaultFaq(); }
  get defaultGallery() { return this.previewDataService.getDefaultGallery(); }
  get defaultPricing() { return this.previewDataService.getDefaultPricing(); }

  selectExplorerComponent(comp: any) {
    this.selectedExplorerComponent = comp;
    this.selectedExplorerVariant = comp.variants[0];
  }

  addSectionToPage() {
    if (!this.selectedExplorerComponent) return;
    
    const newSection: PageSection = {
      id: `sec_${new Date().getTime()}`,
      type: this.selectedExplorerComponent.type,
      label: `${this.selectedExplorerComponent.label} (${this.selectedExplorerVariant})`,
      visible: true
    };
    
    // Set its specific variant
    this.variantService.setComponentVariant(newSection.id, this.selectedExplorerVariant);
    
    const currentSections = [...this.sections];
    currentSections.push(newSection);
    this.variantService.setSections(currentSections);
    
    this.activeTab = 'structure';
    this.selectedExplorerComponent = null;
    alert('Sección añadida a la estructura. ¡Organízala arrastrando!');
  }

  variantOptions: InputOption[] = this.variants.map((variant) => ({
    value: variant,
    label: variant.charAt(0).toUpperCase() + variant.slice(1),
  }));

  componentVariantOptions: InputOption[] = [
    { value: '', label: 'Global' },
    ...this.variantOptions,
  ];

  alignOptions: InputOption[] = [
    { value: 'left', label: 'Izquierda' },
    { value: 'center', label: 'Centro' },
    { value: 'right', label: 'Derecha' },
  ];

  cardAnimationOptions: InputOption[] = [
    { value: 'pulse', label: 'Pulso' },
    { value: 'fade', label: 'Desvanecer' },
    { value: 'slide', label: 'Deslizar' },
    { value: 'bounce', label: 'Rebotar' },
    { value: 'none', label: 'Ninguna' },
  ];

  titleLevelOptions: InputOption[] = [
    { value: 'h1', label: 'H1' },
    { value: 'h2', label: 'H2' },
    { value: 'h3', label: 'H3' },
    { value: 'h4', label: 'H4' },
    { value: 'h5', label: 'H5' },
    { value: 'h6', label: 'H6' },
  ];

  titleAnimationOptions: InputOption[] = [
    { value: 'none', label: 'Ninguna' },
    { value: 'fade', label: 'Desvanecer' },
    { value: 'pulse', label: 'Pulso' },
    { value: 'bounce', label: 'Rebotar' },
    { value: 'glitch', label: 'Glitch' },
    { value: 'slide', label: 'Deslizar' },
  ];

  constructor(
    private variantService: VariantService,
    private previewDataService: PreviewDataService,
    private itemManagementService: ItemManagementService,
    private dragDropService: DragDropService
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
  }

  setActiveTab(tab: any) {
    this.activeTab = tab;
  }

  toggleHeaderConfig() {
    this.showHeaderConfig = !this.showHeaderConfig;
  }

  resetConfiguration() {
    if (confirm('¿Estás seguro de que quieres restablecer toda la configuración? Se perderán todos los cambios.')) {
      this.variantService.resetConfig();
    }
  }

  onTemplateApplied() {
    // Template has been applied, configurations will update automatically via subscriptions
    // No action needed as all configs are subscribed in ngOnInit
  }

  // --- List Management ---

  openAddModal(type: any) {
    this.modalItemType = type;
    this.editingItem = this.getEmptyItem(type);
    this.editingIndex = -1;
    this.showItemModal = true;
  }

  openEditModal(type: any, item: any, index: number) {
    this.modalItemType = type;
    this.editingItem = { ...item };
    this.editingIndex = index;
    this.showItemModal = true;
  }

  closeItemModal() {
    this.showItemModal = false;
    this.editingItem = null;
    this.modalItemType = null;
  }

  saveItem() {
    if (!this.modalItemType) return;

    switch (this.modalItemType) {
      case 'service':
        this.itemManagementService.saveServiceItem(this.editingItem, this.editingIndex);
        break;
      case 'product':
        this.itemManagementService.saveProductItem(this.editingItem, this.editingIndex);
        break;
      case 'testimonial':
        this.itemManagementService.saveTestimonialItem(this.editingItem, this.editingIndex);
        break;
      case 'faq':
        this.itemManagementService.saveFaqItem(this.editingItem, this.editingIndex);
        break;
      case 'gallery':
        this.itemManagementService.saveGalleryItem(this.editingItem, this.editingIndex);
        break;
      case 'pricing':
        this.itemManagementService.savePricingItem(this.editingItem, this.editingIndex);
        break;
      case 'promotion':
        this.itemManagementService.savePromotionItem(this.editingItem, this.editingIndex);
        break;
      case 'navItem':
        this.itemManagementService.saveNavItem(this.editingItem, this.editingIndex);
        break;
      case 'navLink':
        this.itemManagementService.saveNavLink(this.editingItem, this.editingIndex);
        break;
      case 'footerLink':
        const listType = this.editingItem._listType === 'explore' ? 'explore' : 'trend';
        this.itemManagementService.saveFooterLink(this.editingItem, this.editingIndex, listType);
        break;
      case 'socialIcon':
        this.itemManagementService.saveSocialIcon(this.editingItem, this.editingIndex);
        break;
    }
    this.closeItemModal();
  }

  removeItem(type: any, index: number) {
    if (confirm('¿Eliminar este elemento?')) {
      switch (type) {
        case 'service':
          this.itemManagementService.removeServiceItem(index);
          break;
        case 'product':
          this.itemManagementService.removeProductItem(index);
          break;
        case 'testimonial':
          this.itemManagementService.removeTestimonialItem(index);
          break;
        case 'faq':
          this.itemManagementService.removeFaqItem(index);
          break;
        case 'gallery':
          this.itemManagementService.removeGalleryItem(index);
          break;
        case 'pricing':
          this.itemManagementService.removePricingItem(index);
          break;
        case 'promotion':
          this.itemManagementService.removePromotionItem(index);
          break;
        case 'navItem':
          this.itemManagementService.removeNavItem(index);
          break;
        case 'navLink':
          this.itemManagementService.removeNavLink(index);
          break;
        case 'footerLink':
          // For footerLink, we need to determine the list type
          // This is a bit complex, so we'll keep the existing logic for now
          break;
        case 'socialIcon':
          this.itemManagementService.removeSocialIcon(index);
          break;
        case 'section':
          this.itemManagementService.removeSection(this.sections, index);
          break;
      }
    }
  }


  private getEmptyItem(type: any): any {
    return this.itemManagementService.getEmptyItem(type);
  }

  ngOnInit() {
    this.variantService.globalVariant$.subscribe((variant) => {
      this.globalVariant = variant;
    });

    this.variantService.componentVariants$.subscribe((variants) => {
      this.componentVariants = { ...variants };
    });

    this.variantService.headerConfig$.subscribe((config) => {
      this.headerConfig = config;
    });

    this.variantService.footerConfig$.subscribe((config) => {
      this.footerConfig = config;
    });

    this.variantService.navBarConfig$.subscribe((config) => {
      this.navBarConfig = config;
    });

    this.variantService.heroConfig$.subscribe((config) => {
      this.heroConfig = config;
    });

    this.variantService.bubbleConfig$.subscribe((config) => {
      this.bubbleConfig = config;
    });

    this.variantService.cardConfig$.subscribe((config) => {
      this.cardConfig = config;
    });

    this.variantService.titleConfig$.subscribe((config) => {
      this.titleConfig = config;
    });

    this.variantService.serviceCardsConfig$.subscribe((config) => {
      this.serviceCardsConfig = config;
    });

    this.variantService.faqConfig$.subscribe((config) => {
      this.faqConfig = config;
    });

    this.variantService.pricingConfig$.subscribe((config) => {
      this.pricingConfig = config;
    });

    this.variantService.promotionsConfig$.subscribe((config) => {
      this.promotionsConfig = config;
    });

    this.variantService.galleryConfig$.subscribe((config) => {
      this.galleryConfig = config;
    });

    this.variantService.productsConfig$.subscribe((config) => {
      this.productsConfig = config;
    });

    this.variantService.builderStep$.subscribe((step) => {
      this.currentStep = step;
    });

    this.variantService.sections$.subscribe(sections => {
      this.sections = sections;
    });
  }

  toggleSectionVisibility(section: PageSection) {
    const updatedSections = this.sections.map(s => 
      s.id === section.id ? { ...s, visible: !s.visible } : s
    );
    this.variantService.setSections(updatedSections);
  }

  moveSection(index: number, direction: 'up' | 'down') {
    this.dragDropService.moveSection(this.sections, index, direction);
  }

  // --- Native Drag and Drop Implementation ---

  onDragStart(index: number) {
    this.dragDropService.onDragStart(index);
  }

  onDragOver(event: DragEvent, index: number) {
    this.dragDropService.onDragOver(event, index);
  }

  onDragEnd() {
    this.dragDropService.onDragEnd(this.sections);
  }

  // --- Custom Templates ---

  saveAsCustomTemplate() {
    const name = prompt('Nombre para tu plantilla personalizada:', 'Nueva Plantilla');
    if (name) {
      const config = this.variantService.getFullConfig();
      const templates = JSON.parse(localStorage.getItem('custom_templates') || '[]');
      templates.push({
        ...config,
        id: `custom_${new Date().getTime()}`,
        name,
        category: 'Personalizado',
        icon: '💎'
      });
      localStorage.setItem('custom_templates', JSON.stringify(templates));
      alert('Plantilla guardada correctamente en el navegador.');
    }
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
    this.variantService.setGlobalVariant(this.globalVariant);
    // When changing the global variant manually, we want it to apply everywhere,
    // so we clear specific component overrides that might block it.
    this.clearComponentVariants();
  }

  onComponentVariantChange(componentId: string) {
    this.variantService.setComponentVariant(componentId, this.componentVariants[componentId] || null);
  }

  clearComponentVariants() {
    this.variantService.clearAllComponentVariants();
  }

  exportProject() {
    const fullConfig = this.variantService.getFullConfig();
    const blob = new Blob([JSON.stringify(fullConfig, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `config-antostudios-${new Date().getTime()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  toggleFooterConfig() {
    this.showFooterConfig = !this.showFooterConfig;
  }

  toggleNavBarConfig() {
    this.showNavBarConfig = !this.showNavBarConfig;
  }

  toggleHeroConfig() {
    this.showHeroConfig = !this.showHeroConfig;
  }

  toggleBubbleConfig() {
    this.showBubbleConfig = !this.showBubbleConfig;
  }

  toggleCardConfig() {
    this.showCardConfig = !this.showCardConfig;
  }

  toggleTitleConfig() {
    this.showTitleConfig = !this.showTitleConfig;
  }

  toggleFaqConfig() {
    this.showFaqConfig = !this.showFaqConfig;
  }

  togglePricingConfig() {
    this.showPricingConfig = !this.showPricingConfig;
  }

  togglePromotionsConfig() {
    this.showPromotionsConfig = !this.showPromotionsConfig;
  }

  toggleGalleryConfig() {
    this.showGalleryConfig = !this.showGalleryConfig;
  }

  toggleProductsConfig() {
    this.showProductsConfig = !this.showProductsConfig;
  }

  onKeyUpToggle(event: KeyboardEvent, toggleFn: () => void) {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleFn.call(this);
    }
  }

  updateHeaderConfig() {
    this.variantService.setHeaderConfig(this.headerConfig);
  }

  updateFooterConfig() {
    this.variantService.setFooterConfig(this.footerConfig);
  }

  updateNavBarConfig() {
    this.variantService.setNavBarConfig(this.navBarConfig);
  }

  updateHeroConfig() {
    this.variantService.setHeroConfig(this.heroConfig);
  }

  updateBubbleConfig() {
    this.variantService.setBubbleConfig(this.bubbleConfig);
  }

  updateCardConfig() {
    this.variantService.setCardConfig(this.cardConfig);
  }

  updateTitleConfig() {
    this.variantService.setTitleConfig(this.titleConfig);
  }
}