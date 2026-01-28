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
  StatItem,
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
      title: '¿Cuánto tiempo dura una cita?',
      content: 'Depende del servicio. Un corte hombre toma 30 minutos, un tinte hasta 2 horas.',
      expanded: false,
    },
    {
      title: '¿Puedo cancelar mi reserva?',
      content: 'Sí, hasta 24 horas antes sin costo. Contáctanos para gestionar.',
      expanded: false,
    },
  ];

  priceColumns: TableColumn[] = [
    { key: 'service', label: 'Servicio' },
    { key: 'description', label: 'Descripción' },
    { key: 'price', label: 'Precio' },
  ];

  priceRows: TableRow[] = [
    { service: 'Corte Hombre', description: 'Corte personalizado', price: '15€' },
    { service: 'Corte Mujer', description: 'Estilo a medida', price: '25€' },
    { service: 'Manicura', description: 'Diseño básico o personalizado', price: '20€' },
  ];

  premiumCardConfigs: CardPremiumConfig[] = [
    {
      title: 'Combo Corte + Tinte',
      description: 'Corte personalizado y tinte vibrante.',
      image: 'https://images.unsplash.com/photo-1608245447191-7b8af1f3c211',
      price: '50€',
      discount: '-20%',
      icon: 'heroStar',
      tooltip: '¡Ahorra con este combo especial!',
    },
    {
      title: 'Manicura Premium',
      description: 'Diseño de larga duración con arte.',
      image: 'https://images.unsplash.com/photo-1595876722061-d5c962e7de31',
      price: '30€',
      discount: 'Oferta',
      icon: 'heroStar',
      tooltip: 'Manicura de larga duración.',
    },
    {
      title: 'Tratamiento Capilar',
      description: 'Hidratación profunda para tu cabello.',
      image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f',
      price: '35€',
      discount: 'Novedad',
      icon: 'heroStar',
      tooltip: 'Revitaliza tu cabello hoy.',
    },
  ];

  allGalleryConfigs = [
    {
      images: [
        { src: '/1029.png', alt: 'Salón 1' },
        { src: '/1090.png', alt: 'Corte 1' },
        { src: '/retro-stars.png', alt: 'Manicura 1' },
      ],
    },
  ];

  serviceCards: any[] = [
    {
      routeName: 'Cardiología',
      imageUrl: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd',
      difficulty: 'Diagnóstico',
      rating: 4.9,
      reviews: 320,
      duration: 0,
      distance: 0,
      ascent: 0,
      description: 'Cuidado integral del corazón con tecnología de punta.',
      features: ['Electrocardiograma', 'Prueba de esfuerzo'],
      link: '#forms',
    },
    {
      routeName: 'Dermatología',
      imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d',
      difficulty: 'Tratamiento',
      rating: 4.8,
      reviews: 215,
      duration: 0,
      distance: 0,
      ascent: 0,
      description: 'Salud y estética de la piel por expertos certificados.',
      features: ['Control de lunares', 'Tratamientos láser'],
      link: '#forms',
    },
    {
      routeName: 'Pediatría',
      imageUrl: 'https://images.unsplash.com/photo-1632053001735-dc5a475ac343',
      difficulty: 'Cuidado Infantil',
      rating: 5.0,
      reviews: 450,
      duration: 0,
      distance: 0,
      ascent: 0,
      description: 'Atención cálida y especializada para los más pequeños.',
      features: ['Vacunación', 'Control de crecimiento'],
      link: '#forms',
    },
  ];

  clinicFeatures = [
    {
      title: 'Tecnología Avanzada',
      description: 'Equipamiento de última generación para diagnósticos precisos.',
      icon: '🔬',
    },
    {
      title: 'Atención 24/7',
      description: 'Urgencias y personal médico disponible en todo momento.',
      icon: '🚑',
    },
    {
      title: 'Telemedicina',
      description: 'Consultas virtuales con tus especialistas desde casa.',
      icon: '📲',
    },
    {
      title: 'Resultados Digitales',
      description: 'Acceso inmediato a tu historial y análisis en línea.',
      icon: '💻',
    },
  ];

  clinicTestimonials = [
    {
      author: 'Laura Gómez',
      role: 'Paciente',
      quote: 'La atención en pediatría es excepcional. Mis hijos se sienten seguros y tranquilos.',
      avatar: 'https://i.pravatar.cc/150?u=laura',
    },
    {
      author: 'Miguel Ángel',
      role: 'Paciente de Cardiología',
      quote: 'Gracias a su diagnóstico temprano, pude tratar mi condición a tiempo. Eternamente agradecido.',
      avatar: 'https://i.pravatar.cc/150?u=miguel',
    },
    {
      author: 'Elena R.',
      role: 'Paciente Dermatología',
      quote: 'Resultados visibles desde la primera sesión. Profesionalismo puro.',
      avatar: 'https://i.pravatar.cc/150?u=elena',
    },
  ];

  products = [
    {
      name: 'Tinte Neón',
      image: '/1029.png',
      description: 'Colores vibrantes de larga duración, sin amoníaco.',
      price: '25€',
    },
    {
      name: 'Champú Hidratante',
      image: '/1029.png',
      description: 'Nutre y fortalece tu cabello con ingredientes naturales.',
      price: '18€',
    },
    {
      name: 'Plancha Profesional',
      image: '/1029.png',
      description: 'Tecnología iónica para un alisado perfecto.',
      price: '80€',
    },
  ];

  clinicStats: StatItem[] = [
    {
      icon: '🏥',
      label: 'Pacientes Atendidos',
      value: '10,000+',
      description: 'Cuidado de calidad para la comunidad',
      progress: 90,
      trend: 'up',
      trendValue: '+8%',
      unit: '',
    },
    {
      icon: '⭐',
      label: 'Satisfacción',
      value: '4.9/5',
      description: 'Calificación promedio de pacientes',
      progress: 98,
      trend: 'stable',
      trendValue: '0%',
      unit: '',
    },
    {
      icon: '👨‍⚕️',
      label: 'Especialistas',
      value: '20+',
      description: 'Médicos certificados en diversas áreas',
      progress: 100,
      trend: 'stable',
      trendValue: '0%',
      unit: '',
    },
    {
      icon: '🏆',
      label: 'Años de Servicio',
      value: '25+',
      description: 'Comprometidos con tu salud',
      progress: 100,
      trend: 'stable',
      trendValue: '0%',
      unit: '',
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
