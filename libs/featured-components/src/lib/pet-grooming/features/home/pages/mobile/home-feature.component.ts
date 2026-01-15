import { Component, HostListener, OnDestroy, OnInit, Inject, PLATFORM_ID, TrackByFunction } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { VariantService, NavBarConfig, HeroConfig, FooterConfig, BubbleConfig } from '@negocio/shared-components';
import {
  UINavBarComponent,
  UIHeroSectionComponent,
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
import { FaqSectionComponent, GallerySectionComponent, PricingSectionComponent, PromotionsSectionComponent, ReservationFormComponent, ServiceSectionComponent } from '@negocio/featured-components';

@Component({
  selector: 'lib-home-feature-mobile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UINavBarComponent,
    UIHeroSectionComponent,
    ReservationFormComponent,
    FaqSectionComponent,
    PricingSectionComponent,
    GallerySectionComponent,
    PromotionsSectionComponent,
    UIModalComponent,
    UICardRutasComponent,
    BubbleAnimationComponent,
    UITitleComponent,
    UIFooterComponent,
  ],
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
  globalVariant = 'default';
  navBarConfig: NavBarConfig;
  heroConfig: HeroConfig;
  footerConfig: FooterConfig;
  bubbleConfig: BubbleConfig;

  faqItems: AccordionItem[] = [
    {
      title: '¿Cuánto tiempo toma un servicio de peluquería?',
      content: 'Depende del servicio. Un baño y corte toma 1 hora, un servicio completo hasta 2 horas.',
      expanded: false,
    },
    {
      title: '¿Ofrecen servicios para todas las razas?',
      content: 'Sí, atendemos a todas las razas y tamaños. Contáctanos para detalles.',
      expanded: false,
    },
  ];

  priceColumns: TableColumn[] = [
    { key: 'service', label: 'Servicio' },
    { key: 'description', label: 'Descripción' },
    { key: 'price', label: 'Precio' },
  ];

  priceRows: TableRow[] = [
    { service: 'Baño y Corte', description: 'Baño con champú y corte de pelo', price: '30€' },
    { service: 'Corte Especial', description: 'Corte de pelo especial para razas', price: '50€' },
    { service: 'Spa para Mascotas', description: 'Tratamiento de spa completo', price: '80€' },
  ];

  premiumCardConfigs: CardPremiumConfig[] = [
    {
      title: 'Baño Premium',
      description: 'Baño con productos premium y masaje.',
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3',
      price: '40€',
      discount: '-10%',
      icon: 'heroStar',
      tooltip: '¡Cuidado premium para tu mascota!',
    },
    {
      title: 'Paquete Completo',
      description: 'Baño, corte y tratamiento de spa.',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
      price: '100€',
      discount: 'Oferta',
      icon: 'heroStar',
      tooltip: 'Todo incluido para tu mascota.',
    },
    {
      title: 'Corte Creativo',
      description: 'Corte de pelo creativo y personalizado.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
      price: '60€',
      discount: 'Novedad',
      icon: 'heroStar',
      tooltip: 'Estilo único para tu mascota.',
    },
  ];

  allGalleryConfigs = [
    {
      images: [
        { src: '/1029.png', alt: 'Peluquería 1' },
        { src: '/1090.png', alt: 'Servicio 1' },
        { src: '/retro-stars.png', alt: 'Equipo 1' },
      ],
    },
  ];

  serviceCards: any[] = [
    {
      routeName: 'Baño y Corte',
      imageUrl: '/retro-stars.png',
      difficulty: 'Duración: 1 hora',
      rating: 4.8,
      reviews: 400,
      duration: 1,
      distance: 0,
      ascent: 0,
      description: 'Baño con champú y corte de pelo básico.',
      features: ['Champú premium', 'Corte básico'],
      link: '#forms',
    },
    {
      routeName: 'Corte Especial',
      imageUrl: '/1029.png',
      difficulty: 'Duración: 1.5 horas',
      rating: 4.9,
      reviews: 350,
      duration: 1.5,
      distance: 0,
      ascent: 0,
      description: 'Corte de pelo especial para razas específicas.',
      features: ['Corte personalizado', 'Productos premium'],
      link: '#forms',
    },
    {
      routeName: 'Spa para Mascotas',
      imageUrl: '/1090.png',
      difficulty: 'Duración: 2 horas',
      rating: 4.7,
      reviews: 280,
      duration: 2,
      distance: 0,
      ascent: 0,
      description: 'Tratamiento de spa completo para tu mascota.',
      features: ['Masaje', 'Tratamiento premium'],
      link: '#forms',
    },
  ];

  products = [
    {
      name: 'Champú Premium',
      image: '/1029.png',
      description: 'Champú de alta calidad para mascotas.',
      price: '20€',
    },
    {
      name: 'Cepillo Profesional',
      image: '/1029.png',
      description: 'Cepillo profesional para pelaje.',
      price: '15€',
    },
    {
      name: 'Perfume para Mascotas',
      image: '/1029.png',
      description: 'Perfume suave para mascotas.',
      price: '10€',
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

  scrollToSection(sectionId: string) {
    if (sectionId.startsWith('/')) {
      return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
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
      'default', 'cyberpunk', 'jungle', 'enchanted', 'mystic', 'ancient', 'twilight', 'frosty', 'desert',
      'candy', 'oceanic', 'fiery', 'primary', 'secondary', 'neon', 'matrix', 'stellar', 'retro', 'phoenix',
      'aqua', 'plasma', 'cosmic', 'vaporwave', 'aurora'
    ];
    return validVariants.includes(variant) ? (variant as CardVariant) : 'default';
  }
}