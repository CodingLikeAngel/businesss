import { Component, HostListener, OnDestroy, OnInit, Inject, PLATFORM_ID, TrackByFunction } from '@angular/core';
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
} from '@negocio/shared-components';
import { CardVariant, footerVariants, bubbleVariants, cardRutasVariants, titleVariants, variants } from '@negocio/ui-components';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: '',
})
export abstract class BaseHomeFeatureComponent implements OnInit, OnDestroy {
  isMobile: boolean;
  modalOpen = false;
  selectedService: any | null = null;
  private variantSub?: Subscription;
  private configSubs: Subscription[] = [];

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

  trackByProductName: TrackByFunction<any> = (index: number, product: any) => product.name;

  constructor(@Inject(PLATFORM_ID) protected platformId: object, protected variantService: VariantService, protected router: Router, protected route: ActivatedRoute) {
    this.isMobile = false;
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
      this.variantService.statsConfig$.subscribe((config) => (this.statsConfig = config))
    );
  }

  
  ngOnInit() {
    this.onResize();
  }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth < 768;
    }
  }

  ngOnDestroy() {
    this.variantSub?.unsubscribe();
    this.configSubs.forEach((sub) => sub.unsubscribe());
  }


  
  onSocialClick(href: string) {
    console.log(`Social media clicked: ${href}`);
    window.open(href, '_blank');
  }

  openServiceModal(service: any) {
    this.selectedService = service;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedService = null;
  }

  handleKeyUp(event: KeyboardEvent, service: any) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.openServiceModal(service);
    }
  }

  addToCart(product: { name: string; image: string; description: string; price: string }) {
    console.log(`Producto añadido al carrito: ${product.name}`);
  }

  getVariant(componentId: string): any {
    return this.componentVariants[componentId] || this.globalVariant;
  }

  
}