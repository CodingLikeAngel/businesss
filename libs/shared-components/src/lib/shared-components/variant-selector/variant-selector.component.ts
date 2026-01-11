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
  TestimonialsConfig,
  PageSection
} from '../../../services/variant.service';
import { TemplateSelectorComponent } from '../template-selector/template-selector.component';
import { footerVariants, bubbleVariants, cardRutasVariants, titleVariants } from '@negocio/ui-components';

@Component({
  selector: 'lib-variant-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, UIInputComponent, TemplateSelectorComponent],
  templateUrl: './variant-selector.component.html',
  styleUrl: './variant-selector.component.scss',
})
export class VariantSelectorComponent implements OnInit {
  variants = [
    'default',
    ...new Set([...footerVariants, ...bubbleVariants, ...cardRutasVariants, ...titleVariants, ...variants]),
  ];
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

  activeTab: 'general' | 'header' | 'hero' | 'structure' | 'layout' | 'content' | 'footer' | 'pricing' | 'promotions' | 'gallery' = 'general';
  
  // Sections state
  sections: PageSection[] = [];
  
  // Modal state for editing items
  showItemModal = false;
  modalItemType: 'service' | 'product' | 'testimonial' | 'faq' | 'gallery' | 'pricing' | 'promotion' | null = null;
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
  navItemsJson: string;
  exploreLinksJson: string;
  trendLinksJson: string;
  socialIconsJson: string;
  navLinksJson: string;
  navCustomStylesJson: string;
  navigationCardsJson: string;
  carouselItemsJson: string;
  heroCustomStylesJson: string;
  cardCustomStylesJson: string;
  titleCustomStylesJson: string;
  serviceCardsJson: string;
  faqItemsJson: string;
  priceColumnsJson: string;
  priceRowsJson: string;
  premiumCardsJson: string;
  galleryImagesJson: string;
  productsJson: string;
  componentVariants: { [key: string]: string } = {};

  components = [
    { id: 'navbar', label: 'Navbar' },
    { id: 'hero', label: 'Hero Section' },
    { id: 'card', label: 'Card' },
    { id: 'faq', label: 'FAQ Section' },
    { id: 'pricing', label: 'Pricing Section' },
    { id: 'promotions', label: 'Promotions Section' },
    { id: 'gallery', label: 'Gallery Section' },
    { id: 'form', label: 'Reservation Form' },
    { id: 'bubble', label: 'Bubble Animation' },
    { id: 'title', label: 'Title' },
    { id: 'products', label: 'Products Section' },
    { id: 'footer', label: 'Footer' },
    { id: 'testimonials', label: 'Testimonials Section' },
  ];

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

  constructor(private variantService: VariantService) {
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
    this.navItemsJson = JSON.stringify(this.headerConfig.navItems, null, 2);
    this.exploreLinksJson = JSON.stringify(this.footerConfig.exploreLinks, null, 2);
    this.trendLinksJson = JSON.stringify(this.footerConfig.trendLinks, null, 2);
    this.socialIconsJson = JSON.stringify(this.footerConfig.socialIcons, null, 2);
    this.navLinksJson = JSON.stringify(this.navBarConfig.navLinks, null, 2);
    this.navCustomStylesJson = JSON.stringify(this.navBarConfig.customStyles, null, 2);
    this.navigationCardsJson = JSON.stringify(this.heroConfig.navigationCards, null, 2);
    this.carouselItemsJson = JSON.stringify(this.heroConfig.carouselItems, null, 2);
    this.heroCustomStylesJson = JSON.stringify(this.heroConfig.customStyles, null, 2);
    this.cardCustomStylesJson = JSON.stringify(this.cardConfig.customStyles, null, 2);
    this.titleCustomStylesJson = JSON.stringify(this.titleConfig.customStyles, null, 2);
    this.serviceCardsJson = JSON.stringify(this.serviceCardsConfig.items, null, 2);
    this.faqItemsJson = JSON.stringify(this.faqConfig.items, null, 2);
    this.priceColumnsJson = JSON.stringify(this.pricingConfig.columns, null, 2);
    this.priceRowsJson = JSON.stringify(this.pricingConfig.rows, null, 2);
    this.premiumCardsJson = JSON.stringify(this.promotionsConfig.premiumCards, null, 2);
    this.galleryImagesJson = JSON.stringify(this.galleryConfig.images, null, 2);
    this.productsJson = JSON.stringify(this.productsConfig.items, null, 2);
  }

  setActiveTab(tab: any) {
    this.activeTab = tab;
  }

  exportProject() {
    const fullConfig = {
      header: this.headerConfig,
      footer: this.footerConfig,
      navBar: this.navBarConfig,
      hero: this.heroConfig,
      bubble: this.bubbleConfig,
      card: this.cardConfig,
      titleConfig: this.titleConfig,
      serviceCards: this.serviceCardsConfig,
      faq: this.faqConfig,
      pricing: this.pricingConfig,
      promotions: this.promotionsConfig,
      gallery: this.galleryConfig,
      products: this.productsConfig,
      testimonials: this.testimonialsConfig,
      globalVariant: this.globalVariant,
      componentVariants: this.componentVariants,
      sections: this.sections
    };
    const blob = new Blob([JSON.stringify(fullConfig, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `config-antostudios-${new Date().getTime()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
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
        const services = [...this.serviceCardsConfig.items];
        if (this.editingIndex >= 0) { services[this.editingIndex] = this.editingItem; }
        else { services.push(this.editingItem); }
        this.variantService.setServiceCardsConfig({ items: services });
        break;
      case 'product':
        const products = [...this.productsConfig.items];
        if (this.editingIndex >= 0) { products[this.editingIndex] = this.editingItem; }
        else { products.push(this.editingItem); }
        this.variantService.setProductsConfig({ items: products });
        break;
      case 'testimonial':
        const testimonials = [...this.testimonialsConfig.items];
        if (this.editingIndex >= 0) { testimonials[this.editingIndex] = this.editingItem; }
        else { testimonials.push(this.editingItem); }
        this.variantService.setTestimonialsConfig({ items: testimonials });
        break;
      case 'faq':
        const faq = [...this.faqConfig.items];
        if (this.editingIndex >= 0) { faq[this.editingIndex] = this.editingItem; }
        else { faq.push(this.editingItem); }
        this.variantService.setFaqConfig({ items: faq });
        break;
      case 'gallery':
        const gallery = [...this.galleryConfig.images];
        if (this.editingIndex >= 0) { gallery[this.editingIndex] = this.editingItem; }
        else { gallery.push(this.editingItem); }
        this.variantService.setGalleryConfig({ images: gallery });
        break;
      case 'pricing':
        const rows = [...this.pricingConfig.rows];
        if (this.editingIndex >= 0) { rows[this.editingIndex] = this.editingItem; }
        else { rows.push(this.editingItem); }
        this.variantService.setPricingConfig({ rows });
        break;
      case 'promotion':
        const promotions = [...this.promotionsConfig.premiumCards];
        if (this.editingIndex >= 0) { promotions[this.editingIndex] = this.editingItem; }
        else { promotions.push(this.editingItem); }
        this.variantService.setPromotionsConfig({ premiumCards: promotions });
        break;
    }
    this.closeItemModal();
  }

  removeItem(type: any, index: number) {
    if (confirm('¿Eliminar este elemento?')) {
      switch (type) {
        case 'service':
          const services = [...this.serviceCardsConfig.items];
          services.splice(index, 1);
          this.variantService.setServiceCardsConfig({ items: services });
          break;
        case 'product':
          const products = [...this.productsConfig.items];
          products.splice(index, 1);
          this.variantService.setProductsConfig({ items: products });
          break;
        case 'testimonial':
          const testimonials = [...this.testimonialsConfig.items];
          testimonials.splice(index, 1);
          this.variantService.setTestimonialsConfig({ items: testimonials });
          break;
        case 'faq':
          const faq = [...this.faqConfig.items];
          faq.splice(index, 1);
          this.variantService.setFaqConfig({ items: faq });
          break;
        case 'gallery':
          const gallery = [...this.galleryConfig.images];
          gallery.splice(index, 1);
          this.variantService.setGalleryConfig({ images: gallery });
          break;
        case 'pricing':
          const rows = [...this.pricingConfig.rows];
          rows.splice(index, 1);
          this.variantService.setPricingConfig({ rows });
          break;
        case 'promotion':
          const promotions = [...this.promotionsConfig.premiumCards];
          promotions.splice(index, 1);
          this.variantService.setPromotionsConfig({ premiumCards: promotions });
          break;
      }
    }
  }

  private getEmptyItem(type: any): any {
    switch (type) {
      case 'service': return { routeName: 'Nuevo Servicio', description: 'Descripción aquí', imageUrl: '', features: [], link: '#' };
      case 'product': return { name: 'Nuevo Producto', description: 'Descripción aquí', image: '', price: '0€' };
      case 'testimonial': return { quote: 'Cita espectacular', author: 'Nombre del Autor' };
      case 'faq': return { title: 'Pregunta frecuente', content: 'Respuesta detallada', expanded: false };
      case 'gallery': return { src: '', alt: 'Descripción de imagen' };
      case 'pricing': return { service: 'Servicio', description: 'Detalles', price: '0€' };
      case 'promotion': return { title: 'Oferta Especial', description: 'Detallitos', image: '', price: '0€', discount: '0%', icon: 'heroStar', tooltip: '¡Aprovecha!' };
      default: return {};
    }
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
      this.navItemsJson = JSON.stringify(config.navItems, null, 2);
    });

    this.variantService.footerConfig$.subscribe((config) => {
      this.footerConfig = config;
      this.exploreLinksJson = JSON.stringify(config.exploreLinks, null, 2);
      this.trendLinksJson = JSON.stringify(config.trendLinks, null, 2);
      this.socialIconsJson = JSON.stringify(config.socialIcons, null, 2);
    });

    this.variantService.navBarConfig$.subscribe((config) => {
      this.navBarConfig = config;
      this.navLinksJson = JSON.stringify(config.navLinks, null, 2);
      this.navCustomStylesJson = JSON.stringify(config.customStyles, null, 2);
    });

    this.variantService.heroConfig$.subscribe((config) => {
      this.heroConfig = config;
      this.navigationCardsJson = JSON.stringify(config.navigationCards, null, 2);
      this.carouselItemsJson = JSON.stringify(config.carouselItems, null, 2);
      this.heroCustomStylesJson = JSON.stringify(config.customStyles, null, 2);
    });

    this.variantService.bubbleConfig$.subscribe((config) => {
      this.bubbleConfig = config;
    });

    this.variantService.cardConfig$.subscribe((config) => {
      this.cardConfig = config;
      this.cardCustomStylesJson = JSON.stringify(config.customStyles, null, 2);
    });

    this.variantService.titleConfig$.subscribe((config) => {
      this.titleConfig = config;
      this.titleCustomStylesJson = JSON.stringify(config.customStyles, null, 2);
    });

    this.variantService.serviceCardsConfig$.subscribe((config) => {
      this.serviceCardsConfig = config;
      this.serviceCardsJson = JSON.stringify(config.items, null, 2);
    });

    this.variantService.faqConfig$.subscribe((config) => {
      this.faqConfig = config;
      this.faqItemsJson = JSON.stringify(config.items, null, 2);
    });

    this.variantService.pricingConfig$.subscribe((config) => {
      this.pricingConfig = config;
      this.priceColumnsJson = JSON.stringify(config.columns, null, 2);
      this.priceRowsJson = JSON.stringify(config.rows, null, 2);
    });

    this.variantService.promotionsConfig$.subscribe((config) => {
      this.promotionsConfig = config;
      this.premiumCardsJson = JSON.stringify(config.premiumCards, null, 2);
    });

    this.variantService.galleryConfig$.subscribe((config) => {
      this.galleryConfig = config;
      this.galleryImagesJson = JSON.stringify(config.images, null, 2);
    });

    this.variantService.productsConfig$.subscribe((config) => {
      this.productsConfig = config;
      this.productsJson = JSON.stringify(config.items, null, 2);
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
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === this.sections.length - 1) return;

    const newSections = [...this.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    
    this.variantService.setSections(newSections);
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
  }

  onComponentVariantChange(componentId: string) {
    this.variantService.setComponentVariant(componentId, this.componentVariants[componentId] || null);
  }

  clearComponentVariants() {
    this.variantService.clearAllComponentVariants();
  }

  toggleHeaderConfig() {
    this.showHeaderConfig = !this.showHeaderConfig;
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

  updateNavItems() {
    try {
      const navItems = JSON.parse(this.navItemsJson);
      this.variantService.setHeaderConfig({ navItems });
    } catch (e) {
      console.error('Invalid JSON for navItems', e);
    }
  }

  updateExploreLinks() {
    try {
      const exploreLinks = JSON.parse(this.exploreLinksJson);
      this.variantService.setFooterConfig({ exploreLinks });
    } catch (e) {
      console.error('Invalid JSON for exploreLinks', e);
    }
  }

  updateTrendLinks() {
    try {
      const trendLinks = JSON.parse(this.trendLinksJson);
      this.variantService.setFooterConfig({ trendLinks });
    } catch (e) {
      console.error('Invalid JSON for trendLinks', e);
    }
  }

  updateSocialIcons() {
    try {
      const socialIcons = JSON.parse(this.socialIconsJson);
      this.variantService.setFooterConfig({ socialIcons });
    } catch (e) {
      console.error('Invalid JSON for socialIcons', e);
    }
  }

  updateNavLinks() {
    try {
      const navLinks = JSON.parse(this.navLinksJson);
      this.variantService.setNavBarConfig({ navLinks });
    } catch (e) {
      console.error('Invalid JSON for navLinks', e);
    }
  }

  updateNavCustomStyles() {
    try {
      const customStyles = JSON.parse(this.navCustomStylesJson);
      this.variantService.setNavBarConfig({ customStyles });
    } catch (e) {
      console.error('Invalid JSON for navCustomStyles', e);
    }
  }

  updateNavigationCards() {
    try {
      const navigationCards = JSON.parse(this.navigationCardsJson);
      this.variantService.setHeroConfig({ navigationCards });
    } catch (e) {
      console.error('Invalid JSON for navigationCards', e);
    }
  }

  updateCarouselItems() {
    try {
      const carouselItems = JSON.parse(this.carouselItemsJson);
      this.variantService.setHeroConfig({ carouselItems });
    } catch (e) {
      console.error('Invalid JSON for carouselItems', e);
    }
  }

  updateHeroCustomStyles() {
    try {
      const customStyles = JSON.parse(this.heroCustomStylesJson);
      this.variantService.setHeroConfig({ customStyles });
    } catch (e) {
      console.error('Invalid JSON for heroCustomStyles', e);
    }
  }

  updateCardCustomStyles() {
    try {
      const customStyles = JSON.parse(this.cardCustomStylesJson);
      this.variantService.setCardConfig({ customStyles });
    } catch (e) {
      console.error('Invalid JSON for cardCustomStyles', e);
    }
  }

  updateTitleCustomStyles() {
    try {
      const customStyles = JSON.parse(this.titleCustomStylesJson);
      this.variantService.setTitleConfig({ customStyles });
    } catch (e) {
      console.error('Invalid JSON for titleCustomStyles', e);
    }
  }

  updateServiceCards() {
    try {
      const items = JSON.parse(this.serviceCardsJson);
      this.variantService.setServiceCardsConfig({ items });
    } catch (e) {
      console.error('Invalid JSON for serviceCards', e);
    }
  }

  updateFaqItems() {
    try {
      const items = JSON.parse(this.faqItemsJson);
      this.variantService.setFaqConfig({ items });
    } catch (e) {
      console.error('Invalid JSON for faqItems', e);
    }
  }

  updatePriceColumns() {
    try {
      const columns = JSON.parse(this.priceColumnsJson);
      this.variantService.setPricingConfig({ columns });
    } catch (e) {
      console.error('Invalid JSON for priceColumns', e);
    }
  }

  updatePriceRows() {
    try {
      const rows = JSON.parse(this.priceRowsJson);
      this.variantService.setPricingConfig({ rows });
    } catch (e) {
      console.error('Invalid JSON for priceRows', e);
    }
  }

  updatePremiumCards() {
    try {
      const premiumCards = JSON.parse(this.premiumCardsJson);
      this.variantService.setPromotionsConfig({ premiumCards });
    } catch (e) {
      console.error('Invalid JSON for premiumCards', e);
    }
  }

  updateGalleryImages() {
    try {
      const images = JSON.parse(this.galleryImagesJson);
      this.variantService.setGalleryConfig({ images });
    } catch (e) {
      console.error('Invalid JSON for galleryImages', e);
    }
  }

  updateProducts() {
    try {
      const items = JSON.parse(this.productsJson);
      this.variantService.setProductsConfig({ items });
    } catch (e) {
      console.error('Invalid JSON for products', e);
    }
  }
}