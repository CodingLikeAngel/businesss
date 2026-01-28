import { Component, HostListener, OnDestroy, OnInit, Inject, PLATFORM_ID, TrackByFunction } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { VariantService, NavBarConfig, HeroConfig, FooterConfig, BubbleConfig } from '@negocio/shared-components';
import {
  UINavBarComponent,
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
import {
  UIHeroSectionComponent,
  UIStatsLibSectionComponent,
  UIFeaturesSectionComponent,
  UITestimonialsSectionComponent,
  UINewsletterSectionComponent,
  ProductsSectionComponent,
  PromotionsSectionComponent,
  UIFaqSectionComponent,
  UIGallerySectionComponent,
  UIPricingTableSectionComponent,
  ReservationFormComponent
} from '@negocio/featured-components';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'lib-home-feature',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UINavBarComponent,
    UIHeroSectionComponent,
    ReservationFormComponent,
    UIFaqSectionComponent,
    UIPricingTableSectionComponent,
    UIGallerySectionComponent,
    UIStatsLibSectionComponent,
    UIFeaturesSectionComponent,
    UITestimonialsSectionComponent,
    UINewsletterSectionComponent,
    ProductsSectionComponent,
    PromotionsSectionComponent,
    UIModalComponent,
    UICardRutasComponent,
    BubbleAnimationComponent,
    UITitleComponent,
    UIFooterComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-feature.component.html',
  styles: [/* Existing styles unchanged */],
})
export class HomeDesktopFeatureComponent implements OnDestroy, OnInit {
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
    { service: 'Valoración Silver', description: 'Tasación básica y reporte de mercado', price: 'Gratis' },
    { service: 'Pack Gold Venta', description: 'Fotos HD, Tour Virtual 360°, Publicación Premium', price: '1.5%' },
    { service: 'Gestión Platinum', description: 'Staging, Asesoría Legal, Gestión de Visitas VIP', price: '2.5%' },
  ];

  realEstateStats = [
    { label: 'Propiedades Vendidas', value: '500+', icon: '🔑' },
    { label: 'Clientes Satisfechos', value: '98%', icon: '😊' },
    { label: 'Años de Experiencia', value: '25', icon: '🏛️' },
    { label: 'Valor Gestionado', value: '120M€', icon: '💰' },
  ];

  realEstateFeatures = [
    {
      title: 'Cartera Exclusiva',
      description: 'Acceso a propiedades off-market que no encontrarás en portales públicos.',
      icon: '💎'
    },
    {
      title: 'Tecnología Inmersiva',
      description: 'Tours virtuales 3D y drones para mostrar cada rincón de tu futuro hogar.',
      icon: '🕶️'
    },
    {
      title: 'Asesoría Integral',
      description: 'Te acompañamos desde la búsqueda hasta la firma ante notario y la entrega de llaves.',
      icon: '🤝'
    },
    {
      title: 'Inversión Inteligente',
      description: 'Análisis de rentabilidad y plusvalía para inversores exigentes.',
      icon: '📈'
    }
  ];

  realEstateTestimonials = [
    {
      author: 'Familia Rodríguez',
      role: 'Compradores Primeriza',
      quote: 'Gracias por la paciencia y por encontrarnos la casa de nuestros sueños. ¡Insuperables!',
      avatar: 'https://i.pravatar.cc/150?u=rodriguez'
    },
    {
      author: 'Carlos M.',
      role: 'Inversionista',
      quote: 'Su conocimiento del mercado local me ha hecho ganar un 20% más de rentabilidad.',
      avatar: 'https://i.pravatar.cc/150?u=carlosm'
    },
    {
      author: 'Sofía L.',
      role: 'Vendedora',
      quote: 'Vendieron mi ático en tiempo récord y al precio que yo quería. Profesionales 100%.',
      avatar: 'https://i.pravatar.cc/150?u=sofia'
    }
  ];

  premiumCardConfigs: CardPremiumConfig[] = [
    {
      title: 'Villa Moderna',
      description: 'Diseño vanguardista con vistas infinitas al mar.',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80',
      price: '1.2M€',
      discount: 'Exclusiva',
      icon: 'heroStar',
      tooltip: 'Lujo sin compromisos.',
    },
    {
      title: 'Penthouse Urbano',
      description: 'El cielo de la ciudad a tus pies. Terraza privada.',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80',
      price: '850k€',
      discount: 'Nuevo',
      icon: 'heroStar',
      tooltip: 'Vive en las alturas.',
    },
    {
      title: 'Finca Rústica',
      description: 'Paz y naturaleza a solo 20 min de la ciudad.',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80',
      price: '600k€',
      discount: 'Oportunidad',
      icon: 'heroStar',
      tooltip: 'Tu refugio personal.',
    },
  ];

  allGalleryConfigs = [
    {
      images: [
        { src: 'https://images.unsplash.com/photo-1600596542815-37a9a2111692?auto=format&fit=crop&q=80', alt: 'Salón de Lujo' },
        { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80', alt: 'Piscina Infinity' },
        { src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80', alt: 'Cocina Gourmet' },
      ],
    },
  ];

  serviceCards: any[] = [
    {
      routeName: 'Compra',
      imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80',
      difficulty: 'Proceso Guiado',
      rating: 4.9,
      reviews: 500,
      duration: 0,
      distance: 0,
      ascent: 0,
      description: 'Encuentra tu hogar ideal con nuestra selección exclusiva.',
      features: ['Búsqueda personalizada', 'Financiación'],
      link: '#forms',
    },
    {
      routeName: 'Venta',
      imageUrl: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80',
      difficulty: 'Máximo Valor',
      rating: 4.8,
      reviews: 300,
      duration: 0,
      distance: 0,
      ascent: 0,
      description: 'Obtén el mejor precio por tu propiedad con nuestro marketing.',
      features: ['Valoración gratuita', 'Home Staging'],
      link: '#forms',
    },
    {
      routeName: 'Alquiler',
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80',
      difficulty: 'Gestión Total',
      rating: 4.7,
      reviews: 400,
      duration: 0,
      distance: 0,
      ascent: 0,
      description: 'Gestión de alquileres segura y rentable para propietarios.',
      features: ['Seguro de impago', 'Mantenimiento'],
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
      'default', 'cyberpunk', 'jungle', 'enchanted', 'mystic', 'ancient', 'twilight', 'frosty', 'desert',
      'candy', 'oceanic', 'fiery', 'primary', 'secondary', 'neon', 'matrix', 'stellar', 'retro', 'phoenix',
      'aqua', 'plasma', 'cosmic', 'vaporwave', 'aurora'
    ];
    return validVariants.includes(variant) ? (variant as CardVariant) : 'default';
  }
}