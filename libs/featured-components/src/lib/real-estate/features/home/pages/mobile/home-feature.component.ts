import { Component, HostListener, OnDestroy, OnInit, Inject, PLATFORM_ID, TrackByFunction } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { VariantService, NavBarConfig, HeroConfig, FooterConfig, BubbleConfig } from '@negocio/shared-components';
import {

  CardVariant,
  AccordionItem,
  TableColumn,
  TableRow,
  GalleryImage,
  UITitleComponent,
  CardPremiumConfig,
  UIModalComponent,
  UICardRutasComponent,
  BubbleAnimationComponent,
  BubbleConfig as BubbleAnimationConfig,
  UIFooterComponent,
} from '@negocio/ui-components';
import { UINavBarComponent as LibUINavBarComponent } from '@negocio/ui-components';
import { UIHeroSectionComponent as LibUIHeroSectionComponent } from '@negocio/ui-components';
import { UIHeroSectionComponent } from '@negocio/ui-components';
import { UINavBarComponent } from '@negocio/ui-components';
import { FaqSectionComponent, GallerySectionComponent, PricingSectionComponent, PromotionsSectionComponent, ReservationFormComponent, ServiceSectionComponent } from '@negocio/featured-components';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'lib-home-feature-mobile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LibUINavBarComponent,
    UINavBarComponent,
    ReservationFormComponent,
    FaqSectionComponent,
    PricingSectionComponent,
    GallerySectionComponent,
    PromotionsSectionComponent,
    UICardRutasComponent,
    BubbleAnimationComponent,
    UITitleComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-feature.component.html',
  styles: [/* Existing styles unchanged */],
})
export class HomeMobileFeatureComponent implements OnDestroy, OnInit {
  isMobile = false;
  modalOpen = false;
  selectedService: any | null = null;
  private variantSub?: Subscription;
  private navBarConfigSub?: Subscription;
  private heroConfigSub?: Subscription;
  private footerConfigSub?: Subscription;
  private bubbleConfigSub?: Subscription;

  componentVariants: { [key: string]: string } = {};
  globalVariant = 'luxury';
  navBarConfig: NavBarConfig;
  heroConfig: HeroConfig;
  footerConfig: FooterConfig;
  bubbleConfig: BubbleConfig;

  faqItems: AccordionItem[] = [
    {
      title: '¿Cómo funciona el proceso de compra?',
      content: 'Primero seleccionas una propiedad, luego coordinamos una visita y finalmente firmamos el contrato.',
      expanded: false,
    },
    {
      title: '¿Ofrecen financiamiento?',
      content: 'Sí, trabajamos con varios bancos para ofrecerte las mejores opciones de financiamiento.',
      expanded: false,
    },
  ];

  priceColumns: TableColumn[] = [
    { key: 'service', label: 'Servicio' },
    { key: 'description', label: 'Descripción' },
    { key: 'price', label: 'Precio' },
  ];

  priceRows: TableRow[] = [
    { service: 'Visita Guiada', description: 'Visita a la propiedad con un agente', price: 'Gratis' },
    { service: 'Evaluación', description: 'Evaluación de la propiedad', price: '100€' },
    { service: 'Contrato', description: 'Firma de contrato y trámites', price: '200€' },
  ];

  premiumCardConfigs: CardPremiumConfig[] = [
    {
      title: 'Casa de Lujo',
      description: 'Casa de lujo con piscina y jardín.',
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3',
      price: '500,000€',
      discount: '-5%',
      icon: 'heroStar',
      tooltip: '¡Oportunidad única!',
    },
    {
      title: 'Apartamento Céntrico',
      description: 'Apartamento en el centro de la ciudad.',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
      price: '300,000€',
      discount: 'Oferta',
      icon: 'heroStar',
      tooltip: 'Ubicación privilegiada.',
    },
    {
      title: 'Chalet con Vista',
      description: 'Chalet con vista al mar.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
      price: '600,000€',
      discount: 'Novedad',
      icon: 'heroStar',
      tooltip: 'Vista espectacular.',
    },
  ];

  allGalleryConfigs = [
    {
      images: [
        { src: '/1029.png', alt: 'Propiedad 1' },
        { src: '/1090.png', alt: 'Propiedad 2' },
        { src: '/retro-stars.png', alt: 'Propiedad 3' },
      ],
    },
  ];

  serviceCards: any[] = [
    {
      routeName: 'Visita Guiada',
      imageUrl: '/retro-stars.png',
      difficulty: 'Duración: 1 hora',
      rating: 4.8,
      reviews: 400,
      duration: 1,
      distance: 0,
      ascent: 0,
      description: 'Visita a la propiedad con un agente especializado.',
      features: ['Asesoramiento', 'Información detallada'],
      link: '#forms',
    },
    {
      routeName: 'Evaluación',
      imageUrl: '/1029.png',
      difficulty: 'Duración: 2 horas',
      rating: 4.9,
      reviews: 350,
      duration: 2,
      distance: 0,
      ascent: 0,
      description: 'Evaluación completa de la propiedad.',
      features: ['Informe detallado', 'Recomendaciones'],
      link: '#forms',
    },
    {
      routeName: 'Contrato',
      imageUrl: '/1090.png',
      difficulty: 'Duración: 3 horas',
      rating: 4.7,
      reviews: 280,
      duration: 3,
      distance: 0,
      ascent: 0,
      description: 'Firma de contrato y trámites legales.',
      features: ['Asesoramiento legal', 'Trámites incluidos'],
      link: '#forms',
    },
  ];

  products = [
    {
      name: 'Casa de Lujo',
      image: '/1029.png',
      description: 'Casa de lujo con piscina y jardín.',
      price: '500,000€',
    },
    {
      name: 'Apartamento Céntrico',
      image: '/1029.png',
      description: 'Apartamento en el centro de la ciudad.',
      price: '300,000€',
    },
    {
      name: 'Chalet con Vista',
      image: '/1029.png',
      description: 'Chalet con vista al mar.',
      price: '600,000€',
    },
  ];

  trackByProductId: TrackByFunction<{ name: string; image: string; description: string; price: string }> = (
    index: number,
    product: { name: string; image: string; description: string; price: string }
  ) => product.name;

  constructor(@Inject(PLATFORM_ID) private platformId: object, private variantService: VariantService) {
    this.navBarConfig = this.variantService.getCurrentNavBarConfig();
    this.heroConfig = this.variantService.getCurrentHeroConfig();
    this.footerConfig = this.variantService.getCurrentFooterConfig();
    this.bubbleConfig = this.variantService.getCurrentBubbleConfig();
    this.variantSub = this.variantService.componentVariants$.subscribe((variants) => {
      this.componentVariants = { ...variants };
    });
    this.variantService.globalVariant$.subscribe((variant) => {
      this.globalVariant = variant;
    });
    this.navBarConfigSub = this.variantService.navBarConfig$.subscribe((config) => {
      this.navBarConfig = config;
    });
    this.heroConfigSub = this.variantService.heroConfig$.subscribe((config) => {
      this.heroConfig = config;
    });
    this.footerConfigSub = this.variantService.footerConfig$.subscribe((config) => {
      this.footerConfig = config;
    });
    this.bubbleConfigSub = this.variantService.bubbleConfig$.subscribe((config) => {
      this.bubbleConfig = config;
    });
  }

  ngOnInit() {
    this.isMobile = window.innerWidth < 768;
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  ngOnDestroy() {
    this.variantSub?.unsubscribe();
    this.navBarConfigSub?.unsubscribe();
    this.heroConfigSub?.unsubscribe();
    this.footerConfigSub?.unsubscribe();
    this.bubbleConfigSub?.unsubscribe();
  }

  scrollToSection(sectionId: string | Event) {
    const id = typeof sectionId === 'string' ? sectionId : (sectionId as any).target?.value || sectionId;
    if (typeof id === 'string' && id.startsWith('/')) {
      return;
    }
    if (typeof id === 'string') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
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

  getVariant(componentId: string): CardVariant {
    const variant = this.componentVariants[componentId] || this.globalVariant;
    const validVariants = [
      'default', 'luxury', 'elegant', 'vintage', 'cyberpunk', 'jungle', 'enchanted', 'mystic', 'ancient', 'twilight', 'frosty', 'desert',
      'candy', 'oceanic', 'fiery', 'primary', 'secondary', 'neon', 'matrix', 'stellar', 'retro', 'phoenix',
      'aqua', 'plasma', 'cosmic', 'vaporwave', 'aurora'
    ];
    return validVariants.includes(variant) ? (variant as CardVariant) : 'default';
  }
}