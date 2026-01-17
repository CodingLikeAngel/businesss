import { Component, HostListener, OnDestroy, OnInit, Inject, PLATFORM_ID, TrackByFunction, inject } from '@angular/core';
import { EditorService, CartService, ModalService } from '../../../index';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  VariantService,
  NavBarConfig,
  HeroConfig,
  FooterConfig,
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
  Testimonial,
  StatsConfig,
  FeaturesConfig,
  ChartConfig,
  UiStateService,
} from '@negocio/shared-components';
import { CardVariant, footerVariants, bubbleVariants, cardRutasVariants, titleVariants, variants } from '@negocio/ui-components';
import { EditorState, ModalState } from '../../models/editor.model';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: '',
})
export abstract class BaseEditorFeatureComponent implements OnInit, OnDestroy {
  protected editorService = inject(EditorService);
  protected cartService = inject(CartService);
  protected modalService = inject(ModalService);
  protected uiStateService = inject(UiStateService);

  private variantSub?: Subscription;
  private configSubs: Subscription[] = [];
  private editorStateSub?: Subscription;
  private modalStateSub?: Subscription;

  componentVariants: { [key: string]: string } = {};
  globalVariant = 'default';
  navBarConfig: NavBarConfig;
  heroConfig: HeroConfig;
  footerConfig: FooterConfig;
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
  statsConfig: StatsConfig;
  featuresConfig: FeaturesConfig;
  chartConfig: ChartConfig;

  editorState: EditorState;
  modalState: ModalState;
  loading$ = this.editorService.loading$;

  tabsConfig: any[] = [
    { label: 'Servicios', sectionId: 'servicios', icon: '🛠️' },
    { label: 'Productos', sectionId: 'productos', icon: '🧩' },
    { label: 'Precios', sectionId: 'precios', icon: '💰' },
    { label: 'Promociones', sectionId: 'promociones', icon: '🎁' },
    { label: 'FAQ', sectionId: 'faq', icon: '❓' },
    { label: 'Galería', sectionId: 'galeria', icon: '🖼️' },
    // { label: 'Contacto', sectionId: 'contacto', icon: '📞' },
  ];


  trackByTestimonialId: TrackByFunction<Testimonial> = (
    index: number,
    testimonial: Testimonial
  ) => testimonial.author;


  constructor(
    @Inject(PLATFORM_ID) protected platformId: object,
    protected variantService: VariantService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    this.navBarConfig = this.variantService.getCurrentNavBarConfig();
    this.heroConfig = this.variantService.getCurrentHeroConfig();
    this.footerConfig = this.variantService.getCurrentFooterConfig();
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
    this.featuresConfig = this.variantService.getCurrentFeaturesConfig();
    this.chartConfig = this.variantService.getCurrentChartConfig();

    this.editorState = this.editorService.getCurrentEditorState();
    this.modalState = this.modalService.getCurrentModalState();

    this.variantSub = this.variantService.componentVariants$.subscribe((variants) => {
      this.componentVariants = { ...variants };
    });
    this.variantService.globalVariant$.subscribe((variant) => {
      this.globalVariant = variant;
    });

    this.configSubs.push(
      this.variantService.heroConfig$.subscribe((config) => (this.heroConfig = config)),
      this.variantService.footerConfig$.subscribe((config) => (this.footerConfig = config)),
      this.variantService.bubbleConfig$.subscribe((config) => (this.bubbleConfig = config)),
      this.variantService.cardConfig$.subscribe((config) => (this.cardConfig = config)),
      this.variantService.titleConfig$.subscribe((config) => (this.titleConfig = config)),
      this.variantService.serviceCardsConfig$.subscribe((config) => (this.serviceCardsConfig = config)),
      this.variantService.faqConfig$.subscribe((config) => (this.faqConfig = config)),
      this.variantService.pricingConfig$.subscribe((config) => (this.pricingConfig = config)),
      this.variantService.promotionsConfig$.subscribe((config) => (this.promotionsConfig = config)),
      this.variantService.galleryConfig$.subscribe((config) => (this.galleryConfig = config)),
      this.variantService.productsConfig$.subscribe((config) => (this.productsConfig = config)),
      this.variantService.testimonialsConfig$.subscribe((config) => (this.testimonialsConfig = config)),
      this.variantService.statsConfig$.subscribe((config) => (this.statsConfig = config)),
      this.variantService.featuresConfig$.subscribe((config) => (this.featuresConfig = config)),
      this.variantService.chartConfig$.subscribe((config) => (this.chartConfig = config))
    );

    this.editorStateSub = this.editorService.editorState$.subscribe((state) => {
      this.editorState = state;
    });

    this.modalStateSub = this.modalService.modalState$.subscribe((state) => {
      this.modalState = state;
    });
  }


  ngOnInit() {
    this.onResize();
  }

  selectSection(event: Event, section: any) {
    event.stopPropagation();
    console.log('Selecting section:', section.id);
    
    // Ensure section has proper structure for editor
    const sectionCopy = {
      ...section,
      content: { ...(section.content || {}) },
      styles: { ...(section.styles || {}) }
    };
    
    this.uiStateService.selectSection(sectionCopy);
  }

  selectElement(event: Event | null, element: any) {
    if (event) {
      event.stopPropagation();
    }
    console.log('Selecting element:', element);
    this.uiStateService.selectElement(element);
  }

  trackBySectionId(index: number, section: any): string {
    return section.id;
  }

  trackByProductName(index: number, product: any): string {
    return product.name;
  }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      const isMobile = window.innerWidth < 768;
      this.editorService.updateEditorState({ isMobile });
    }
  }

  ngOnDestroy() {
    this.variantSub?.unsubscribe();
    this.configSubs.forEach((sub) => sub.unsubscribe());
    this.editorStateSub?.unsubscribe();
    this.modalStateSub?.unsubscribe();
  }



  onSocialClick(href: string) {
    console.log(`Social media clicked: ${href}`);
    window.open(href, '_blank');
  }

  openServiceModal(service: any) {
    this.modalService.openModal(service);
  }

  closeModal() {
    this.modalService.closeModal();
  }

  handleKeyUp(event: KeyboardEvent, service: any) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.openServiceModal(service);
    }
  }

  addToCart(product: { name: string; image: string; description: string; price: string }) {
    this.cartService.addToCart(product);
  }

  getVariant(componentId: string): any {
    return this.componentVariants[componentId] || this.globalVariant;
  }

  getModalTitle(): string {
    const item = this.modalState.selectedItem;
    if (!item) return 'Detalles';
    if ('serviceName' in item) {
      return item.serviceName;
    }
    if ('name' in item) {
      return item.name;
    }
    return 'Detalles';
  }


}
